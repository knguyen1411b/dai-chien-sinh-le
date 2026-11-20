import { useEffect, useRef, useState } from 'react';
import { Difficulty, HUD, result, Services } from './play';
import { Stage4Mode, StageId, StageResult } from './types';
import { elephantGame } from './elephant';
import { roosterGame } from './rooster';
import { horseGame } from './horse';
import { floodGame } from './flood';
import { soundEngine } from './sound';

export interface StageProps {
  paused: boolean;
  difficulty?: Difficulty;
  offset?: number;
  mode?: Stage4Mode;
  onComplete(result: StageResult): void;
}
export function ArcadeStage({stage, paused, difficulty='easy', offset=0, mode='timed60', onComplete}: StageProps & {stage:StageId}) {
  const ref=useRef<HTMLCanvasElement>(null);
  const pauseRef=useRef(paused);pauseRef.current=paused;
  const [hud,setHud]=useState<HUD>({time:[75,100,89,60][stage-1],player:0,bot:0,status:'Chuẩn bị…',detail:''});
  const [countdown,setCountdown]=useState(3);
  useEffect(()=>{
    const canvas=ref.current!,ctx=canvas.getContext('2d')!;
    const input={keys:new Set<string>(),x:640,y:360};
    const floats:{x:number;y:number;text:string;life:number}[]=[];
    let finished=false,raf=0,last=performance.now(),sync=0,shake=0,stop=0;
    let audioElapsed=0,lastAudio=soundEngine.now(),intro=3,musicStarted=false;
    const s:Services={input,difficulty,endless:mode==='endless',offset,audioTime:()=>audioElapsed,
      hud:h=>{if(sync<=0){setHud(h);sync=.08;}},
      effect:(x,y,text,strong=false)=>{floats.push({x,y,text,life:1});if(strong){shake=.15;stop=.04;}},
      finish:(won,headline,summary,score,bot,stats=[])=>{
        if(finished)return;finished=true;soundEngine.stopMusic();soundEngine.playEffect(won?'win':'lose');
        const ratio=stage===3?parseInt(stats.find(st=>st.label==='Độ chính xác')?.value??'0')/100:stage===4?parseInt(stats.find(st=>st.label==='Khoảng cách tốt nhất')?.value??'0')/80:1-audioElapsed/(stage===1?75:100);
        const stars=won?(stage===3?(ratio>=.9?3:ratio>=.75?2:1):ratio>=.5?3:ratio>=.2?2:1):0;
        onComplete({...result(stage,won,headline,summary,score,bot,stats),stars,stage4Mode:mode,survivedSeconds:Math.floor(audioElapsed)});
      }};
    const game=[elephantGame,roosterGame,horseGame,floodGame][stage-1](s);
    const keydown=(e:KeyboardEvent)=>{
      if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;
      if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
      if(pauseRef.current||finished||intro>0)return;
      input.keys.add(e.code);if(!e.repeat)game.key(e.code);
    };
    const keyup=(e:KeyboardEvent)=>input.keys.delete(e.code);
    const clear=()=>input.keys.clear();
    const pointer=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();input.x=(e.clientX-r.left)*1280/r.width;input.y=(e.clientY-r.top)*720/r.height;};
    const click=(e:PointerEvent)=>{pointer(e);if(!pauseRef.current&&!finished&&intro<=0)game.pointer(e.button);};
    const context=(e:Event)=>e.preventDefault();
    window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',clear);
    canvas.addEventListener('pointermove',pointer);canvas.addEventListener('pointerdown',click);canvas.addEventListener('contextmenu',context);
    function frame(now:number){
      const dt=Math.min((now-last)/1000,.05);last=now;const audioNow=soundEngine.now();
      if(!pauseRef.current&&!finished&&intro>0){intro=Math.max(0,intro-dt);setCountdown(Math.ceil(intro));if(intro<=0){soundEngine.startMusic(stage);musicStarted=true;}}
      else if(!pauseRef.current&&!finished){
        if(!musicStarted){soundEngine.startMusic(stage);musicStarted=true;}
        audioElapsed+=Math.max(0,audioNow-lastAudio);sync-=dt;shake-=dt;
        if(stop>0&&stage!==3)stop-=dt;else game.update(dt);
        floats.forEach(f=>{f.life-=dt;f.y-=dt*40;});while(floats[0]?.life<=0)floats.shift();
      }else input.keys.clear();
      lastAudio=audioNow;
      ctx.clearRect(0,0,1280,720);ctx.save();if(shake>0)ctx.translate((Math.random()-.5)*8,(Math.random()-.5)*8);
      game.draw(ctx);
      floats.forEach(f=>{ctx.save();ctx.globalAlpha=Math.max(0,f.life);ctx.font='700 25px "Be Vietnam Pro", "Segoe UI", Arial, sans-serif';ctx.textAlign='center';ctx.strokeStyle='#30271e';ctx.lineWidth=5;ctx.strokeText(f.text,f.x,f.y);ctx.fillStyle='#fff0b4';ctx.fillText(f.text,f.x,f.y);ctx.restore();});
      ctx.restore();if(!finished)raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);
    return()=>{cancelAnimationFrame(raf);soundEngine.stopMusic();window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',clear);canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('pointerdown',click);canvas.removeEventListener('contextmenu',context);};
  },[stage,difficulty,mode,offset,onComplete]);
  useEffect(()=>{soundEngine.pauseMusic(paused);},[paused]);
  return <div className="playfield">
    <canvas ref={ref} width={1280} height={720} aria-label={`Sân chơi màn ${stage}`} />
    <div className="game-hud" aria-live="off">
      <div className="hud-progress"><span>SƠN TINH</span><meter min="0" max="1" value={hud.player}/><span>THỦY TINH</span><meter className="water-meter" min="0" max="1" value={hud.bot}/></div>
      <div className="hud-objective"><strong>{hud.status}</strong><small>{hud.detail}</small></div>
      <div className={'clock '+(hud.time<10?'urgent':'')}>{Math.max(0,Math.ceil(hud.time))}<small>GIÂY</small></div>
    </div>
    {hud.warning&&<div className="game-warning" role="status">⚠ {hud.warning}</div>}
    {countdown>0&&<div className="countdown" aria-live="polite"><span>CHUẨN BỊ</span><strong>{countdown}</strong></div>}
    <div className="live-chat">VĂN LANG LIVE <span>{hud.time<10?'Cả làng đang cổ vũ Sơn Tinh!':stage===1?'Voi chín ngà có ship COD không ạ?':stage===2?'Gà này chạy nhanh hơn deadline của mình!':stage===3?'Xin một tràng pháo tay cho tay trống Tản Viên!':'Nước lên một thước, núi cao thêm một thước!'}</span></div>
  </div>;
}
