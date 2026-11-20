import { background, sprite } from './art';
import { Game, label, Services, sfx } from './play';

export function horseGame(s: Services): Game {
  const lanes = ['KeyA','KeyS','KeyK','KeyL'];
  const arrows = ['ArrowLeft','ArrowDown','ArrowUp','ArrowRight'];
  const notes: {t:number; lane:number; judged:boolean; phrase:number}[] = [];
  for(let phrase=0;phrase<18;phrase++) {
    for(let beat=0;beat<8;beat++) {
      notes.push({t:2.4+phrase*4.8+beat*.6,lane:(beat*3+phrase)%4,judged:false,phrase});
      if(phrase>=6 && beat%2===(phrase>=12?0:1)) notes.push({t:2.4+phrase*4.8+beat*.6+.3,lane:(beat+phrase+1)%4,judged:false,phrase});
    }
  }
  let time=0, phrase=0, feathers=0, bot=0, hits=0, perfect=0, missed=0;
  let judgment='', judgeLife=0;
  const phraseHits=Array(18).fill(0);
  const flashes=[0,0,0,0];
  const fall={easy:2,normal:1.6,hard:1.3}[s.difficulty];
  function hit(lane:number) {
    const t=s.audioTime();
    flashes[lane]=.15;
    const note=notes.filter(n=>n.lane===lane&&!n.judged).sort((a,b)=>Math.abs(a.t-t)-Math.abs(b.t-t))[0];
    const d=note?Math.abs(t-note.t-s.offset/1000):999;
    if(note&&d<=.12){note.judged=true;phraseHits[note.phrase]++;hits++;if(d<=.06)perfect++;judgment=d<=.06?'TUYỆT VỜI':'TỐT';sfx(d<=.06?'perfect':'hit');s.effect(120+lane*85,535,d<=.06?'+100':'+60');}
    else {judgment='HỤT';missed++;sfx('miss');}
    judgeLife=.5;
  }
  return {
    key(code){const i=lanes.includes(code)?lanes.indexOf(code):arrows.indexOf(code);if(i>=0)hit(i);},
    pointer(){},
    update(dt){
      time=s.audioTime();judgeLife-=dt;flashes.forEach((v,i)=>flashes[i]=Math.max(0,v-dt));
      notes.forEach(n=>{if(!n.judged&&time-n.t>.12){n.judged=true;missed++;judgment='HỤT';judgeLife=.3;}});
      if(time>=2.4+(phrase+1)*4.8&&phrase<18){
        const total=notes.filter(n=>n.phrase===phrase).length;
        const ratio=phraseHits[phrase]/total;
        feathers=Math.max(0,feathers+(ratio>=.75?1:ratio<.5?-1:0));
        const r=Math.random(), base={easy:.55,normal:.7,hard:.82}[s.difficulty];
        const chance=base+(feathers-bot>=3?.1:bot-feathers>=3?-.1:0);
        bot=Math.max(0,bot+(r<chance?1:r>chance+.22?-1:0));phrase++;
        s.effect(640,260,ratio>=.75?'+1 HỒNG MAO':ratio<.5?'−1 HỒNG MAO':'Giữ nhịp nhé!',ratio>=.75);
        if(feathers>=9||bot>=9||phrase>=18) s.finish(feathers>=9,feathers>=9?'Trống hội thuần mã!':'Ngựa vẫn bất kham!',feathers>=9?'Chín sợi hồng mao đã sáng. Hãy mang sính lễ về Phong Châu!':'Gõ khi nốt chạm vạch. Có thể chỉnh độ trễ trước khi thử lại.',feathers*100+perfect*10,bot*100,[{label:'Độ chính xác',value:`${Math.round(hits/Math.max(1,hits+missed)*100)}%`},{label:'Tuyệt vời',value:String(perfect)}]);
      }
      s.hud({time:88.8-time,player:feathers/9,bot:bot/9,status:time<2.4?'Đếm nhịp… chuẩn bị A S K L':'Gõ khi nốt chạm vạch sáng',detail:`Đoạn ${Math.min(18,phrase+1)}/18 · Hồng mao ${feathers}/9 · Đối thủ ${bot}/9`});
    },
    draw(ctx){
      background(ctx,3);
      ctx.fillStyle='#172b32e8';ctx.fillRect(60,105,370,520);
      const colors=['#d76a43','#edbf59','#63a798','#6799bb'];
      for(let i=0;i<4;i++){
        ctx.fillStyle=flashes[i]>0?colors[i]+'99':'#e6cf9c18';ctx.fillRect(80+i*85,120,75,440);
        ctx.fillStyle=colors[i];ctx.fillRect(80+i*85,554,75,5);label(ctx,['A','S','K','L'][i],117+i*85,600,27);
      }
      notes.filter(n=>!n.judged&&n.t-time<fall&&n.t-time>-.12).forEach(n=>{const y=555-(n.t-time)/fall*420;ctx.fillStyle=colors[n.lane];ctx.beginPath();ctx.roundRect(85+n.lane*85,y-10,65,20,8);ctx.fill();});
      sprite(ctx,'horse'+(feathers<3?0:feathers<7?1:2),755,610,520,420);
      sprite(ctx,'thuy',1160,420,100,170);
      label(ctx,'THỦY TINH',1150,450,18);
      for(let i=0;i<4;i++){ctx.fillStyle=colors[i]+'33';ctx.fillRect(1050+i*47,480,37,130);const y=490+((time*.7+i*.25)%1)*110;ctx.fillStyle=colors[i];ctx.fillRect(1054+i*47,y,29,8);}
      for(let i=0;i<9;i++){ctx.fillStyle=i<feathers?'#e85845':'#5f4d40';ctx.beginPath();ctx.ellipse(510+i*48,660,9,20,.5,0,7);ctx.fill();ctx.fillStyle=i<bot?'#5aabc9':'#5f4d40';ctx.fillRect(1050+i*21,650,14,20);}
      if(judgeLife>0)label(ctx,judgment,245,490,28,judgment==='HỤT'?'#f08871':'#ffe0a0');
      if(time<2.4)label(ctx,String(Math.max(1,4-Math.floor(time/.6))),245,350,90);
    }
  };
}
