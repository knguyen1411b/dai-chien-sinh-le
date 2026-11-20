import { background, sprite } from './art';
import { clamp, distance, Game, label, move, random, Services, sfx } from './play';

export function roosterGame(s: Services): Game {
  const p = {x: 480, y: 470};
  const chickens = Array.from({length: 13}, (_, i) => ({x: random(230, 1020), y: random(240, 590), kind: i < 6 ? 'hen' : i < 10 ? 'chick' : i < 12 ? 'rooster' : 'golden', state: 'wander', timer: random(1, 4), angle: random(0, 6.28), run: 0, caught: false}));
  const crabs: {x: number; y: number; carrying: boolean; captive?: typeof chickens[number]}[] = [];
  const grains: {x: number; y: number; gold: boolean; life: number}[] = [];
  const penned: typeof chickens = [];
  const dog = {x: 140, y: 360};
  const bushes = [{x: 130,y: 260},{x: 1140,y: 355},{x: 1070,y: 590}];
  let time = 0, grain = 8, golden = 1, useGold = false, bag: typeof chickens = [], count = 0, hasGolden = false, lost = 0, stun = 0, throwCD = 0, shoutCD = 0, nextCrab = 15, nextGold = 20, bark = 5;
  function action(code: string) {
    if (stun > 0) return;
    if (code === 'KeyQ') useGold = !useGold;
    if (code === 'Space' && bag.length < 3) {
      const c = chickens.find(c => !c.caught && distance(c, p) < 64 && (c.state === 'eat' || c.state === 'rest' || c.x < 100 || c.x > 1170 || c.y < 210 || c.y > 605));
      if (c) { c.caught = true; bag.push(c); sfx('chicken'); s.effect(p.x, p.y - 80, 'Bắt được!'); }
      else s.effect(p.x, p.y - 90, 'Dụ ăn / dồn góc rồi bắt');
    }
  }
  return {
    key: action,
    pointer(button) {
      if (stun > 0) return;
      if (button === 2 && shoutCD <= 0) {
        shoutCD = 2; sfx('shout'); s.effect(s.input.x, s.input.y, 'HÈ!', true);
        chickens.forEach(c => { if (!c.caught && distance(c, s.input) < 160) {c.angle = Math.atan2(c.y - s.input.y, c.x - s.input.x); c.state = 'flee'; c.timer = .6;} });
      } else if (button === 0 && throwCD <= 0 && (useGold ? golden > 0 : grain > 0)) {
        const d = Math.max(1, distance(p, s.input)); const factor = Math.min(1, 320 / d);
        grains.push({x: p.x + (s.input.x - p.x) * factor, y: p.y + (s.input.y - p.y) * factor, gold: useGold, life: 4});
        if (useGold) golden--; else grain--; throwCD = .5; sfx('throw');
      }
    },
    update(dt) {
      time += dt; stun -= dt; throwCD -= dt; shoutCD -= dt; bark -= dt;
      if (time >= nextGold) { nextGold += 20; golden = Math.min(2, golden + 1); s.effect(640, 370, 'Có thóc nếp vàng!'); }
      if (stun <= 0) move(s.input, p, 220 * (1 - bag.length * .12) * (p.x < 330 && p.y > 480 ? .5 : 1), dt);
      if (distance(p, {x: 640, y: 380}) < 65) grain = 8;
      if (p.x > 950 && p.y < 290 && bag.length) {
        bag.forEach(c => { if (c.kind === 'golden') hasGolden = true; else count++; penned.push(c); }); bag = []; sfx('collect'); s.effect(1080, 250, 'Vào lồng!');
      }
      for (let i = grains.length - 1; i >= 0; i--) {grains[i].life -= dt; if (grains[i].life <= 0) grains.splice(i, 1);}
      dog.x = 640 + Math.sin(time * .35) * 450;
      dog.y = 420 + Math.sin(time * .6) * 70;
      if (bark <= 0) {bark = 7; sfx('bark'); s.effect(dog.x, dog.y - 60, 'GÂU!'); chickens.forEach(c => {if (distance(c, dog) < 200) {c.state = 'flee'; c.timer = 3; c.angle = Math.atan2(c.y - dog.y, c.x - dog.x);}});}
      if (distance(p, dog) < 45) {p.x = clamp(p.x + (p.x > dog.x ? 80 : -80), 70, 1210);}
      chickens.forEach(c => {
        if (c.caught) return;
        c.timer -= dt;
        const fear = c.kind === 'golden' ? 200 : c.kind === 'chick' ? 80 : 120;
        const bait = grains.find(g => (c.kind !== 'golden' || g.gold) && distance(c, g) < 220);
        if (c.state === 'rest') { if (c.timer <= 0) {c.state = 'wander'; c.run = 0;} return; }
        if (bait && c.state !== 'flee') {
          c.angle = Math.atan2(bait.y - c.y, bait.x - c.x); c.state = 'eat';
          if (distance(c, bait) < 22) return;
        } else if (distance(c, p) < fear && c.state !== 'eat') {
          c.state = 'flee'; c.angle = Math.atan2(c.y - p.y, c.x - p.x); c.timer = .4;
          if (c.kind === 'rooster' && distance(c, p) < 75 && stun <= 0) {stun = 1.2; s.effect(p.x, p.y - 90, 'Gà mổ! Choáng', true); sfx('hit');}
        } else if (c.timer <= 0) {c.state = 'wander'; c.angle += random(-1, 1); c.timer = random(.8, 2.5);}
        if (c.state === 'flee') {
          c.run += dt;
          if (c.run > (c.kind === 'golden' ? 7 : c.kind === 'chick' ? 3 : 4)) {c.state = 'rest'; c.timer = 2; return;}
        } else c.run = Math.max(0, c.run - dt);
        let vx = Math.cos(c.angle), vy = Math.sin(c.angle);
        if (c.state === 'wander') {
          chickens.forEach(other => {const d = distance(c, other); if (other !== c && !other.caught && d < 40 && d > 0) {vx += (c.x-other.x)/d*1.5; vy += (c.y-other.y)/d*1.5;}});
        }
        const speed = c.state === 'flee' ? c.kind === 'golden' ? 300 : c.kind === 'chick' ? 170 : 240 : c.kind === 'chick' ? 70 : 100;
        const len = Math.hypot(vx,vy) || 1;
        c.x = clamp(c.x + vx/len * speed * dt, 80, 1200); c.y = clamp(c.y + vy/len * speed * dt, 200, 625);
        if (c.x <= 80 || c.x >= 1200 || c.y <= 200 || c.y >= 625) c.angle += Math.PI;
        if (c.x < 330 && c.y > 490) {c.x = 335; c.angle = -Math.PI/2;}
      });
      if (time >= nextCrab && crabs.length < 2) {nextCrab += s.difficulty === 'easy' ? 19 : s.difficulty === 'hard' ? 10 : 14; crabs.push({x: 230,y: 550,carrying: false}); s.effect(240, 480, 'CUA ĐANG ĐẾN!'); sfx('warning');}
      for (let i = crabs.length - 1; i >= 0; i--) {
        const c = crabs[i];
        const target = c.carrying ? {x: 180,y: 580} : chickens.filter(a => !a.caught && a.kind !== 'golden').sort((a,b) => distance(a,c)-distance(b,c))[0];
        if (!target) continue;
        const d = distance(c,target) || 1; c.x += (target.x-c.x)/d*90*dt; c.y += (target.y-c.y)/d*90*dt;
        if (distance(c,p) < 55) {if(c.captive){c.captive.caught=false;c.captive.x=c.x;c.captive.y=c.y;c.captive.state='rest';c.captive.timer=2;}crabs.splice(i,1); s.effect(c.x,c.y,'Đuổi cua!'); sfx('hit');continue;}
        if (d < 25) {if (c.carrying) {lost++;crabs.splice(i,1);s.effect(200,550,'Mất 1 gà!');} else if('caught' in target){target.caught = true;c.carrying = true;c.captive=target;}}
      }
      if (hasGolden && count >= 8) s.finish(true, 'Sân đình rộn rã!', 'Tám gà thường và gà chín cựa đã vào lồng. Còn ngựa chín hồng mao!', 100 + Math.ceil(100-time), lost, [{label:'Gà trong lồng',value:`${count} + gà chín cựa`}]);
      else if (lost > 4 || time >= 100) s.finish(false, lost > 4 ? 'Cua tha mất quá nhiều gà!' : 'Trời đã trưa!', 'Dùng thóc dụ gà, Space để bắt khi đang ăn, rồi đem tới lồng góc phải trên.', count*10, lost);
      s.hud({time:100-time, player:(count + +hasGolden)/9, bot:lost/5, status:stun > 0 ? 'Đang choáng…' : `Đang mang ${bag.length}/3 gà · Thóc ${useGold ? 'NẾP VÀNG' : 'thường'}`, detail:`Lồng ${count}/8 · Gà chín cựa ${hasGolden ? '✓' : 'chưa có'} · Thóc ${grain} / Nếp ${golden}`, warning:lost >= 4 ? 'Bảo vệ những con gà còn lại!' : ''});
    },
    draw(ctx) {
      background(ctx,2);
      // Draw the delivered birds on the coop floor, behind its front bamboo rail.
      ctx.save(); ctx.beginPath(); ctx.rect(950, 195, 220, 92); ctx.clip();
      penned.forEach((c,i)=>{
        const x=977+(i%5)*39+Math.sin(time*1.7+i)*3;
        const y=230+Math.floor(i/5)*23+Math.sin(time*2+i)*2;
        sprite(ctx,c.kind,x,y,c.kind==='golden'?43:34,42);
      });
      ctx.restore();
      ctx.strokeStyle='#936134';ctx.lineWidth=4;
      ctx.beginPath();ctx.moveTo(940,280);ctx.lineTo(1175,280);
      for(let x=945;x<=1175;x+=23){ctx.moveTo(x,263);ctx.lineTo(x,291);}ctx.stroke();
      grains.forEach(g => {ctx.fillStyle=g.gold?'#ffdc3d':'#eee4c2'; for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(g.x+Math.sin(i*6)*12,g.y+Math.cos(i*3)*10,4,2,i,0,7);ctx.fill();}});
      const objects = chickens.filter(c=>!c.caught).map(c=>({y:c.y,draw:()=>{
        const hidden=bushes.some(b=>distance(c,b)<70)&&distance(p,c)>130; ctx.globalAlpha=hidden?.2:1;
        sprite(ctx,c.kind,c.x,c.y,c.kind==='golden'?78:c.kind==='chick'?35:58,75);ctx.globalAlpha=1;
        if(c.state==='rest')label(ctx,'Zz',c.x,c.y-60,16); if(c.state==='eat')label(ctx,'♥',c.x,c.y-60,16,'#d65037');
      }}));
      objects.push({y:p.y,draw:()=>{sprite(ctx,'son',p.x,p.y,70,110);bag.forEach((c,i)=>sprite(ctx,c.kind,p.x-20+i*20,p.y-65,32,35));if(stun>0)label(ctx,'✦ ✦ ✦',p.x,p.y-115,20);}});
      objects.push({y:dog.y,draw:()=>sprite(ctx,'dog',dog.x,dog.y,90,75)});
      crabs.forEach(c=>objects.push({y:c.y,draw:()=>{sprite(ctx,'crab',c.x,c.y,65,60);if(c.carrying)sprite(ctx,'hen',c.x,c.y-35,35,40);}}));
      objects.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
      label(ctx,`CHUỒNG GÀ · ${penned.length} CON`,1060,185,16);label(ctx,'NẠP THÓC',640,420,16);
    }
  };
}
