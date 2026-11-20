import { floodSky, sprite } from './art';
import { clamp, distance, Game, label, random, Services, sfx } from './play';

type Resource={x:number;y:number;kind:string;hold:number};
type Enemy={x:number;y:number;hp:number;kind:string;side:number};
export function floodGame(s:Services):Game {
  const p={x:520,y:0,vy:0};
  const resources:Resource[]=[];
  const enemies:Enemy[]=[];
  const projectiles:{x:number;y:number;vx:number;vy:number}[]=[];
  const bag:string[]=[];
  const waves:{x:number;size:number}[]=[];
  let time=0,H=110,W=40,nextRock=2,nextTree=6,nextBoulder=10,nextMonster=8,waveIndex=0,wall=false,ultimate=0,throwCD=0,buildCD=0,best=H-W,defeated=0,anger=0;
  const waveTimes=[12,24,36,48,54];
  const rise={easy:.8,normal:1,hard:1.3}[s.difficulty];
  const top=()=>clamp(720-H*3,140,480);
  const ground=(x:number)=>top()+Math.max(0,Math.abs(x-640)-100)*(700-top())/380;
  const waterY=()=>Math.max(80,720-W*3);
  const shore=(side:number)=>640+side*(100+clamp((waterY()-top())/(700-top()),0,1)*380);
  const used=()=>bag.reduce((n,k)=>n+(k==='boulder'?2:1),0);
  p.y=ground(p.x);
  function raise(amount:number){
    const oldGround=ground(p.x),onGround=p.y>=oldGround-2;
    H+=amount;
    if(onGround){p.y=ground(p.x);p.vy=0;}
    resources.forEach(r=>r.y=ground(r.x));
  }
  function spawn(kind:string,limit:number){
    if(resources.filter(r=>r.kind===kind).length>=limit)return;
    // Materials stay on the two mountain shoulders, away from the building altar.
    const candidates=Array.from({length:10},()=>Math.random()<.5?random(335,515):random(765,945));
    const x=candidates.find(x=>ground(x)<waterY()-24&&resources.every(r=>Math.abs(r.x-x)>24));
    if(x!==undefined)resources.push({x,y:ground(x),kind,hold:0});
  }
  function useUltimate(){
    if(ultimate>0)return;
    raise(10);W=Math.max(0,W-5);enemies.length=0;ultimate=20;
    s.effect(640,top()-25,'THẦN NÚI NỔI GIẬN!',true);sfx('ultimate');
  }
  function interact(dt:number){
    if(Math.abs(p.x-640)<72&&Math.abs(p.y-ground(p.x))<10&&bag.length&&buildCD<=0){
      const gain=bag.reduce((n,k)=>n+(k==='boulder'?12:k==='tree'?3:4),0);
      raise(gain);bag.length=0;buildCD=.3;s.effect(p.x,p.y-100,`Nâng đất +${gain} thước`,true);sfx('raise');return;
    }
    const item=resources.find(r=>distance(r,p)<60&&used()+(r.kind==='boulder'?2:1)<=4);
    if(!item)return;
    resources.forEach(r=>{if(r!==item)r.hold=0;});
    item.hold+=dt;
    const needed=item.kind==='rock'?0:item.kind==='tree'?1.2:1.5;
    if(item.hold>=needed){bag.push(item.kind);resources.splice(resources.indexOf(item),1);sfx('collect');s.effect(p.x,p.y-85,'Đã nhặt!');}
  }
  function spawnEnemy(kind:string,side:number){
    if(enemies.length>=8)return;
    enemies.push({x:side<0?20:1260,y:waterY()+72,hp:kind==='crab'?2:3,kind,side});
    s.effect(side<0?120:1160,waterY()-35,'Thủy quái dưới nước!');sfx('warning');
  }
  for(const x of [355,430,500,780,850,925])resources.push({x,y:ground(x),kind:'rock',hold:0});
  for(const x of [385,895])resources.push({x,y:ground(x),kind:'tree',hold:0});
  return {
    key(code){
      if((code==='Space'||code==='KeyW'||code==='ArrowUp')&&p.y>=ground(p.x)-2)p.vy=-380;
      if(code==='KeyQ')useUltimate();
      if(code==='KeyE')interact(0);
    },
    pointer(button){
      if(button===2){
        const i=bag.indexOf('tree');
        if(i>=0){bag.splice(i,1);wall=true;sfx('raise');s.effect(shore(1),waterY()-80,'Tường chắn ở mép nước!');}
        else s.effect(p.x,p.y-90,'Cần cây để dựng tường');
      }
      if(button===0&&throwCD<=0){
        const i=bag.indexOf('rock');
        if(i>=0){bag.splice(i,1);throwCD=.25;const d=Math.hypot(s.input.x-p.x,s.input.y-(p.y-45))||1;
          projectiles.push({x:p.x,y:p.y-45,vx:(s.input.x-p.x)/d*650,vy:(s.input.y-(p.y-45))/d*650});sfx('throw');}
        else s.effect(p.x,p.y-100,'Nhặt đá trên sườn núi trước');
      }
    },
    update(dt){
      time+=dt;ultimate-=dt;throwCD-=dt;buildCD-=dt;
      W+=rise*(time>=20&&time<=35?1.5:1)*dt;
      const oldGround=ground(p.x),wasGrounded=p.y>=oldGround-2;
      const movement=+(s.input.keys.has('KeyD')||s.input.keys.has('ArrowRight'))-+(s.input.keys.has('KeyA')||s.input.keys.has('ArrowLeft'));
      p.x=clamp(p.x+movement*220*(used()>2?.85:1)*dt,320,960);
      // Keep a walking character attached to the slope instead of falling through the terrain.
      if(wasGrounded&&p.vy>=0){p.y=ground(p.x);p.vy=0;}
      else{p.vy+=950*dt;p.y=Math.min(ground(p.x),p.y+p.vy*dt);if(p.y>=ground(p.x))p.vy=0;}
      if(s.input.keys.has('KeyE'))interact(dt);else resources.forEach(r=>r.hold=0);
      if(time>=nextRock){nextRock+=1.5;spawn('rock',8);}
      if(time>=nextTree){nextTree+=6;spawn('tree',4);}
      if(time>=nextBoulder){nextBoulder+=10;spawn('boulder',2);}
      resources.forEach(r=>r.y=ground(r.x));
      for(let i=resources.length-1;i>=0;i--)if(resources[i].y>=waterY()-8)resources.splice(i,1);
      if(time>=nextMonster){nextMonster+=time>60?6:s.difficulty==='easy'?15:12;spawnEnemy(time>22&&Math.random()<.5?'serpent':'crab',Math.random()<.5?-1:1);}
      if(H-W>40){anger+=dt;if(anger>=10){anger=0;spawnEnemy('crab',1);}}else anger=0;
      if(waveIndex<waveTimes.length&&time>=waveTimes[waveIndex]){waves.push({x:1400,size:waveIndex===4?15:8});waveIndex++;sfx('wave');}
      if(s.endless&&time>60&&Math.floor(time/12)>Math.floor((time-dt)/12))waves.push({x:1400,size:10+Math.floor(time/40)});
      for(let i=waves.length-1;i>=0;i--){
        const w=waves[i];w.x-=370*dt;
        if(w.x<=shore(1)+35){
          if(wall){w.size*=.5;wall=false;s.effect(shore(1),waterY()-50,'Tường đỡ nửa sức sóng!',true);}
          W+=w.size;waves.splice(i,1);sfx('hit');
          if(Math.abs(p.x-640)>200){bag.length=0;p.x=clamp(p.x+(p.x<640?35:-35),320,960);p.y=Math.min(p.y,ground(p.x));s.effect(p.x,p.y-80,'Sóng cuốn mất đồ!',true);}
        }
      }
      for(const e of enemies){
        const targetX=shore(e.side)+e.side*36;
        e.x+=Math.sign(targetX-e.x)*Math.min(Math.abs(targetX-e.x),(e.kind==='crab'?85:110)*dt);
        // Entire enemy stays below the surface and outside the dry mountain bank.
        if(e.side<0)e.x=Math.min(e.x,targetX);else e.x=Math.max(e.x,targetX);
        e.y=waterY()+76;
        if(Math.abs(e.x-targetX)<6){const damage=(e.kind==='crab'?1:1.6)*(s.difficulty==='easy'?.7:1);H-=damage*dt;}
      }
      for(let i=projectiles.length-1;i>=0;i--){
        const b=projectiles[i];b.x+=b.vx*dt;b.y+=b.vy*dt;
        const e=enemies.find(e=>distance({x:e.x,y:e.y-32},b)<52);
        if(e){e.hp--;s.effect(e.x,e.y-45,'−1',true);sfx('hit');projectiles.splice(i,1);
          if(e.hp<=0){spawn('rock',8);enemies.splice(enemies.indexOf(e),1);defeated++;}}
        else if(b.x<0||b.x>1280||b.y<0||b.y>740)projectiles.splice(i,1);
      }
      best=Math.max(best,H-W);
      const warning=waveIndex<waveTimes.length&&waveTimes[waveIndex]-time<=4?(waveIndex===4?'SÓNG THẦN ĐANG ĐẾN!':'Sóng sắp tới từ bên phải!'):time>=20&&time<=35?'MƯA DÔNG — NƯỚC DÂNG NHANH':'';
      if(W>=H)s.finish(false,'Nước đã chạm đỉnh núi!','Nhặt đá trên sườn núi, mang về bệ giữa và nhấn E để nâng đất. Dùng Q mỗi 20 giây.',Math.round(time*10),0,[{label:'Trụ vững',value:`${Math.floor(time)} giây`}]);
      else if(!s.endless&&time>=60)s.finish(true,'Tản Viên đứng vững!','Thủy Tinh kiệt sức rút quân. Bình yên trở lại với Văn Lang.',Math.round(H*10),0,[{label:'Độ cao núi',value:`${Math.round(H)} thước`},{label:'Thủy quái hạ',value:String(defeated)},{label:'Khoảng cách tốt nhất',value:`${Math.round(best)} thước`}]);
      s.hud({time:s.endless?time:60-time,player:clamp(H/200,0,1),bot:clamp(W/200,0,1),status:`Mang ${used()}/4 ô · Đá ${bag.filter(k=>k==='rock').length} · Cây ${bag.filter(k=>k==='tree').length} · Tảng ${bag.filter(k=>k==='boulder').length}`,detail:`Núi ${Math.round(H)} / Nước ${Math.round(W)} thước · Q: ${ultimate<=0?'SẴN SÀNG':Math.ceil(ultimate)+'s'} · Tường ${wall?'đã dựng':'chưa có'}`,warning});
    },
    draw(ctx){
      floodSky(ctx);
      // Distant peaks remain behind the one interactive mountain, with no duplicate summit house.
      for(let i=0;i<6;i++){
        ctx.fillStyle=i%2?'#bccdb1':'#a9c2b3';ctx.beginPath();ctx.moveTo(i*250-180,550);ctx.lineTo(i*250+30,255+(i%3)*40);ctx.lineTo(i*250+260,550);ctx.fill();
      }
      ctx.fillStyle='#c88753';ctx.beginPath();ctx.moveTo(160,720);
      for(let x=160;x<=1120;x+=8)ctx.lineTo(x,ground(x));
      ctx.lineTo(1120,720);ctx.closePath();ctx.fill();
      for(let layer=0;layer<7;layer++){
        const y=top()+40+layer*48;if(y>700)break;
        const edge=100+(y-top())/(700-top())*380;
        ctx.strokeStyle=layer%2?'#a66943':'#dfad70';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(640-edge,y);ctx.quadraticCurveTo(640,y+15,640+edge,y);ctx.stroke();
      }
      ctx.strokeStyle='#75955b';ctx.lineWidth=11;ctx.lineJoin='round';ctx.beginPath();
      for(let x=200;x<=1080;x+=8){if(x===200)ctx.moveTo(x,ground(x));else ctx.lineTo(x,ground(x));}ctx.stroke();
      const summit=top();
      // A small house on the rear of the summit; the altar is a separate, visible delivery point.
      ctx.fillStyle='#f6e6b8';ctx.fillRect(615,summit-63,87,63);ctx.fillStyle='#ae5338';ctx.beginPath();ctx.moveTo(600,summit-63);ctx.lineTo(657,summit-108);ctx.lineTo(717,summit-63);ctx.closePath();ctx.fill();
      ctx.fillStyle='#815c3e';ctx.fillRect(644,summit-37,22,37);sprite(ctx,'princess',690,summit,38,65);
      ctx.fillStyle='#edcc86';ctx.strokeStyle='#a7753d';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(595,summit+3,43,9,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      label(ctx,'E · NÂNG ĐẤT',595,summit-17,15);
      for(const r of resources){
        if(r.kind==='tree'){
          ctx.fillStyle='#9d6b40';ctx.fillRect(r.x-5,r.y-52,10,52);ctx.fillStyle='#769d5e';ctx.beginPath();ctx.arc(r.x,r.y-64,24,0,Math.PI*2);ctx.fill();
        }else{
          const size=r.kind==='boulder'?28:15;
          ctx.fillStyle=r.kind==='boulder'?'#b6b3a1':'#eee0bc';ctx.strokeStyle='#897e65';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(r.x-size,r.y);ctx.lineTo(r.x-size*.7,r.y-size);ctx.lineTo(r.x+size*.4,r.y-size*1.4);ctx.lineTo(r.x+size,r.y-size*.3);ctx.lineTo(r.x+size*.8,r.y);ctx.closePath();ctx.fill();ctx.stroke();
        }
        if(distance(r,p)<65)label(ctx,r.hold>0?`${Math.round(r.hold/(r.kind==='tree'?1.2:1.5)*100)}%`:(r.kind==='rock'?'E':'Giữ E'),r.x,r.y-(r.kind==='tree'?100:52),16);
      }
      sprite(ctx,'son',p.x,p.y,65,110);
      bag.forEach((k,i)=>{ctx.fillStyle=k==='tree'?'#719652':'#dfd1a7';ctx.strokeStyle='#856b4a';ctx.fillRect(p.x-25+i*16,p.y-110,12,12);ctx.strokeRect(p.x-25+i*16,p.y-110,12,12);});
      const wy=waterY();
      ctx.fillStyle='#68b9c9d9';ctx.beginPath();ctx.moveTo(0,720);
      for(let x=0;x<=1280;x+=8)ctx.lineTo(x,wy+Math.sin(x*.025+time*3)*5);
      ctx.lineTo(1280,720);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#d8f0e8';ctx.lineWidth=3;ctx.beginPath();for(let x=0;x<=1280;x+=8){const y=wy+Math.sin(x*.025+time*3)*5;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
      for(const e of enemies){
        ctx.save();ctx.globalAlpha=.82;sprite(ctx,e.kind,e.x,e.y,90,60,e.side<0);ctx.restore();
        label(ctx,'♥'.repeat(e.hp),e.x,e.y-63,13,'#8b3d2d');
      }
      for(const w of waves){ctx.fillStyle='#a9e1e2';ctx.beginPath();ctx.ellipse(w.x,wy,30,w.size===15?90:52,-.3,0,Math.PI*2);ctx.fill();}
      for(const b of projectiles){ctx.fillStyle='#fff0c6';ctx.strokeStyle='#8e7b5d';ctx.beginPath();ctx.arc(b.x,b.y,8,0,Math.PI*2);ctx.fill();ctx.stroke();}
      if(wall){const x=shore(1);ctx.strokeStyle='#966b3c';ctx.lineWidth=7;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(x+i*7,wy+12);ctx.lineTo(x+i*7-13,wy-65);ctx.stroke();}label(ctx,'TƯỜNG CHẮN',x+10,wy-80,14);}
      if(time>50)sprite(ctx,'thuy',1190,260,100,155);
      label(ctx,'ĐÁ TRÊN NÚI → NHẶT E → VỀ GIỮA NÂNG ĐẤT',640,680,16);
    }
  };
}
