import { background, sprite } from './art';
import { bar, clamp, Game, label, random, Services, sfx } from './play';

export function elephantGame(s: Services): Game {
  const kinds = ['buffalo', 'deer', 'turtle', 'tiger', 'elephant'];
  const drain: Record<string, number> = {buffalo: 10, deer: 8, turtle: 6, tiger: 12, elephant: 12, nine: 14};
  const speed: Record<string, number> = {buffalo: 1, deer: 1.5, turtle: .6, tiger: 1.2, elephant: .8, nine: .9};
  const animals: {id: number; kind: string; x: number; owner: number}[] = [];
  const hooks = [0, 1].map(i => ({x: i ? 860 : 400, y: i ? 600 : 260, state: 'idle', progress: 0, target: 0, quality: 1, cooldown: 0}));
  let time = 0, spawn = 0, misses = 0, id = 0, score = 0, bot = 0, ai = 1, attack = 0;
  const conf = {easy: {react: 1.6, rate: 4, chance: .6}, normal: {react: 1.1, rate: 5, chance: .75}, hard: {react: .7, rate: 6, chance: .85}}[s.difficulty];
  function throwHook(i: number) {
    const h = hooks[i];
    if (h.cooldown > 0) return;
    if (h.state === 'tug') { h.progress = Math.min(100, h.progress + 4); if (!i) sfx('pull'); return; }
    if (h.state !== 'idle') return;
    h.state = 'drop'; h.y = i ? 600 : 260; sfx('throw');
  }
  function release(i: number) { const h = hooks[i]; const a = animals.find(a => a.id === h.target); if (a) a.owner = -1; h.state = 'idle'; h.cooldown = .6; h.target = 0; h.progress = 0; }
  return {
    key(code) { if (code === 'Space') throwHook(0); },
    pointer(button) { if (!button) throwHook(0); },
    update(dt) {
      time += dt; spawn -= dt; ai -= dt; attack += dt;
      const direction = +(s.input.keys.has('KeyD') || s.input.keys.has('ArrowRight')) - +(s.input.keys.has('KeyA') || s.input.keys.has('ArrowLeft'));
      const player = hooks[0];
      const previousX = player.x;
      player.x = clamp(player.x + direction * 420 * dt, 85, 1195);
      const heldAnimal = animals.find(a => a.id === player.target);
      if (heldAnimal) heldAnimal.x = clamp(heldAnimal.x + player.x - previousX, 60, 1220);
      if (spawn <= 0) {
        spawn = 1.4;
        const special = !animals.some(a => a.kind === 'nine') && (misses >= 20 || Math.random() * 100 < 4 + Math.max(0, misses - 9) * 8);
        const r = Math.random(); const index = r < .28 ? 0 : r < .52 ? 1 : r < .74 ? 2 : r < .9 ? 3 : 4;
        const kind = special ? 'nine' : kinds[index];
        misses = special ? 0 : misses + 1;
        animals.push({id: ++id, kind, x: 1360, owner: -1});
        if (special) { s.effect(640, 350, 'VOI CHÍN NGÀ!', true); sfx('elephant'); }
      }
      animals.forEach(a => { if (a.owner < 0) a.x -= 170 * speed[a.kind] * dt; });
      for (let j = animals.length - 1; j >= 0; j--) if (animals[j].x < -110) animals.splice(j, 1);
      if (ai <= 0) {
        ai = conf.react;
        const h = hooks[1];
        if (h.state === 'idle' && animals.length) {
          const a = animals.find(a => a.kind === 'nine' && a.owner < 0) ?? animals.find(a => a.owner < 0 && a.x < 1150 && a.x > 100);
          if (a) { h.x = clamp(a.x - 170 * speed[a.kind] * .25 + (Math.random() < conf.chance ? random(-35, 35) : 100), 85, 1195); throwHook(1); }
        }
      }
      hooks.forEach((h, i) => {
        h.cooldown -= dt;
        if (h.state === 'drop') {
          h.y += (i ? -1 : 1) * 680 * dt;
          if ((!i && h.y >= 430) || (i && h.y <= 430)) {
            const target = animals.filter(a => a.owner < 0).sort((a, b) => Math.abs(a.x - h.x) - Math.abs(b.x - h.x))[0];
            const d = target ? Math.abs(target.x - h.x) : 999;
            if (target && d <= 60) { h.state = 'tug'; h.target = target.id; h.progress = 30; h.quality = d <= 25 ? .7 : 1.3; target.owner = i; s.effect(h.x, 390, d <= 25 ? 'Thắt chắc!' : 'Dây lỏng'); sfx('hit'); }
            else { s.effect(h.x, 420, 'Trượt!'); release(i); }
          }
        }
        if (h.state === 'tug') {
          const a = animals.find(a => a.id === h.target);
          if (!a) { release(i); return; }
          if (i) h.progress += 4 * conf.rate * random(.85, 1.15) * dt;
          // A completed pull must resolve before the animal can drain it again.
          if (h.progress < 100) {
            h.progress -= drain[a.kind] * h.quality * dt;
            if (a.kind === 'tiger' && attack >= 2) h.progress -= 12;
          }
          if (h.progress >= 100) {
            const special = a.kind === 'nine';
            if (i) bot += 10; else score += a.kind === 'tiger' || a.kind === 'elephant' ? 20 : 10;
            animals.splice(animals.indexOf(a), 1); s.effect(h.x, 400, special ? 'Đủ sính lễ!' : '+10', true); release(i);
            if (special) s.finish(!i, i ? 'Thủy Tinh đã có voi!' : 'Sính lễ thứ nhất!', i ? 'Hãy canh thòng lọng đúng tâm để thắt chắc và kéo nhanh hơn.' : 'Voi chín ngà đã theo Sơn Tinh về núi.', score + (!i ? 100 : 0), bot, [{label: 'Thời gian còn', value: `${Math.ceil(75 - time)} giây`}]);
          } else if (h.progress <= 0) { s.effect(h.x, 430, 'Tuột dây!'); release(i); }
        }
      });
      if (attack >= 2) attack = 0;
      if (time >= 75) s.finish(false, 'Chợ đã tan!', 'Chưa kéo được voi chín ngà. Thử lại, Phước Trời sẽ giúp bạn!', score, bot);
      s.hud({time: 75 - time, player: clamp(hooks[0].progress / 100, 0, 1), bot: clamp(hooks[1].progress / 100, 0, 1), status: hooks[0].state === 'tug' ? 'BẤM LIÊN TỤC SPACE ĐỂ KÉO!' : 'A/D hoặc ← →: di chuyển · Space/Click: thả dây', detail: `Phước Trời ${misses}/21 · Điểm ${score}`, warning: time > 65 ? 'Chợ sắp tan!' : ''});
    },
    draw(ctx) {
      background(ctx, 1);
      ctx.fillStyle = '#ead3a4'; ctx.fillRect(0, 365, 1280, 140);
      ctx.strokeStyle = '#67402d'; ctx.lineWidth = 6; ctx.strokeRect(-5, 365, 1290, 140);
      for (let x = -40; x < 1340; x += 50) {ctx.fillStyle = '#bb9662'; ctx.fillRect((x - time * 80 % 50), 480, 28, 12);}
      sprite(ctx, 'son', hooks[0].x - 30, 315, 90, 155); sprite(ctx, 'thuy', hooks[1].x + 30, 705, 100, 170);
      animals.forEach(a => { const h = hooks[a.owner]; const y = h ? 470 - (a.owner ? -1 : 1) * h.progress * .7 : 470; sprite(ctx, a.kind, a.x, y, a.kind === 'nine' ? 142 : 110, 110); });
      hooks.forEach((h, i) => {
        const target = animals.find(a => a.id === h.target);
        const x = target?.x ?? h.x; const y = target ? 430 - (i ? -1 : 1) * h.progress * .7 : h.state === 'drop' ? h.y : i ? 580 : 280;
        const loopX=target?target.x:x;
        const loopY=target?y+7:y;
        const radiusX=target?(target.kind==='nine'?48:36):26;
        const radiusY=target?16:20;
        const handY=i?630:245;
        ctx.save();ctx.lineCap='round';
        ctx.strokeStyle='#83582f';ctx.lineWidth=7;
        ctx.beginPath();ctx.moveTo(h.x,handY);
        ctx.quadraticCurveTo((h.x+loopX)/2+(target?0:22),(handY+loopY)/2,loopX,loopY+(i?radiusY:-radiusY));ctx.stroke();
        ctx.beginPath();ctx.ellipse(loopX,loopY,radiusX,radiusY,0,0,Math.PI*2);ctx.stroke();
        // The pale twisted strand makes the closed rope loop readable against the animals.
        ctx.strokeStyle='#efd096';ctx.lineWidth=2;ctx.setLineDash([5,5]);
        ctx.beginPath();ctx.moveTo(h.x,handY);ctx.quadraticCurveTo((h.x+loopX)/2+(target?0:22),(handY+loopY)/2,loopX,loopY+(i?radiusY:-radiusY));ctx.stroke();
        ctx.beginPath();ctx.ellipse(loopX,loopY,radiusX,radiusY,0,0,Math.PI*2);ctx.stroke();
        ctx.setLineDash([]);ctx.fillStyle='#aa7b42';ctx.beginPath();ctx.arc(loopX,loopY+(i?radiusY:-radiusY),5,0,Math.PI*2);ctx.fill();ctx.restore();
        if (h.state === 'tug') bar(ctx, x - 60, i ? 610 : 300, 120, h.progress / 100, i ? '#58b4cc' : '#b9492f');
      });
      bar(ctx, 440, 664, 350, misses / 21); label(ctx, 'PHƯỚC TRỜI', 615, 650, 18);
    }
  };
}
