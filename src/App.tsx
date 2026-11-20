import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { ARTWORK_PATHS, loadSavedRecords, saveRecords, Stage4Mode, StageId, StageResult, STAGES } from './game/types';
import { backgrounds, preloadArt } from './game/art';
import { Difficulty } from './game/play';
import { soundEngine } from './game/sound';
import { StageArtwork } from './components/StageArtwork';
import { WeddingCutscene } from './components/WeddingCutscene';
import { Stage1Elephant } from './game/stages/Stage1Elephant';
import { Stage2Rooster } from './game/stages/Stage2Rooster';
import { Stage3Horse } from './game/stages/Stage3Horse';
import { Stage4Flood } from './game/stages/Stage4Flood';

type Screen='menu'|'story'|'brief'|'play'|'result'|'wedding'|'ending';
export default function App(){
  const [screen,setScreen]=useState<Screen>('menu');
  const [stage,setStage]=useState<StageId>(1);
  const [mode,setMode]=useState<Stage4Mode>('timed60');
  const [difficulty,setDifficulty]=useState<Difficulty>('easy');
  const [paused,setPaused]=useState(false);
  const [muted,setMuted]=useState(false);
  const [run,setRun]=useState(0);
  const [outcome,setOutcome]=useState<StageResult|null>(null);
  const [records,setRecords]=useState(loadSavedRecords);
  const [artReady,setArtReady]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [offset,setOffset]=useState(0);
  const [taps,setTaps]=useState<number[]>([]);
  const [calibrating,setCalibrating]=useState(false);
  useEffect(()=>{preloadArt().then(()=>setArtReady(true)).catch(e=>setError(e.message));},[]);
  const launch=useCallback(()=>{setPaused(false);setRun(k=>k+1);setScreen('play');},[]);
  const complete=useCallback((r:StageResult)=>{
    setOutcome(r);setPaused(false);setScreen('result');
    setRecords(prev=>{
      const next={...prev,completedStages:r.won?Array.from(new Set([...prev.completedStages,r.stageId])):prev.completedStages,
        bestStageScores:{...prev.bestStageScores,[r.stageId]:Math.max(prev.bestStageScores[r.stageId]??0,r.playerScore)},
        endlessBestSeconds:r.stage4Mode==='endless'?Math.max(prev.endlessBestSeconds,r.survivedSeconds??0):prev.endlessBestSeconds};
      saveRecords(next);return next;
    });
  },[]);
  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)return;
      if(e.code==='KeyR'&&(screen==='play'||screen==='result')){e.preventDefault();launch();}
      if(e.code==='Escape'&&screen==='play')setPaused(p=>!p);
      if((e.code==='Space'||e.code==='Enter')&&screen==='result'&&!outcome?.won&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();launch();}
    };
    const hide=()=>{if(document.hidden&&screen==='play')setPaused(true);};
    const blur=()=>{if(screen==='play')setPaused(true);};
    window.addEventListener('keydown',handler);document.addEventListener('visibilitychange',hide);window.addEventListener('blur',blur);
    return()=>{window.removeEventListener('keydown',handler);document.removeEventListener('visibilitychange',hide);window.removeEventListener('blur',blur);};
  },[screen,launch,outcome]);
  useEffect(()=>{
    if(!calibrating)return;
    const start=soundEngine.now()+.5;
    let ticks=0;
    const timer=window.setInterval(()=>{if(soundEngine.now()>=start+ticks*.6&&ticks<8){soundEngine.playEffect('perfect');ticks++;}},8);
    const hit=(e:KeyboardEvent)=>{if(e.code==='Space'&&!e.repeat){e.preventDefault();const elapsed=soundEngine.now()-start;const beat=Math.round(elapsed/.6);if(beat>=0&&beat<8)setTaps(t=>[...t,(elapsed-beat*.6)*1000]);}};
    const end=window.setTimeout(()=>setCalibrating(false),5500);
    window.addEventListener('keydown',hit);return()=>{clearInterval(timer);clearTimeout(end);window.removeEventListener('keydown',hit);};
  },[calibrating]);
  useEffect(()=>{if(!calibrating&&taps.length>=4)setOffset(Math.round(Math.max(-200,Math.min(200,taps.reduce((a,b)=>a+b,0)/taps.length))));},[calibrating,taps]);
  async function enter(id:StageId,story=false){
    setLoading(true);setError('');
    try{await soundEngine.prepare();if(!artReady){await preloadArt();setArtReady(true);}soundEngine.playEffect('click');setStage(id);setMode('timed60');setScreen(story?'story':'brief');}
    catch(e){setError(e instanceof Error?e.message:'Không tải được tài nguyên. Hãy thử lại.');}
    finally{setLoading(false);}
  }
  const meta=STAGES[stage];
  const Stage=[Stage1Elephant,Stage2Rooster,Stage3Horse,Stage4Flood][stage-1];
  const next=()=>{if(stage===3)setScreen('wedding');else if(stage===4)setScreen('ending');else{setStage((stage+1) as StageId);setScreen('brief');}};
  const home=()=>{soundEngine.stopMusic();setPaused(false);setScreen('menu');};
  const stars=outcome?.stars??0;
  return <div className="game-shell">
    <header className="topbar"><button className="wordmark" onClick={home}>SƠN TINH <span>×</span> THỦY TINH<small>ĐẠI CHIẾN SÍNH LỄ 4.0</small></button>
      <div className="chapter-marker">{screen==='menu'?'DÂN GIAN REMIX':meta.chapterLabel}</div>
      <div className="top-actions"><button aria-label={muted?'Bật âm thanh':'Tắt âm thanh'} onClick={()=>setMuted(soundEngine.toggleMute())}>{muted?<VolumeX size={19}/>:<Volume2 size={19}/>}</button>{screen==='play'&&<button onClick={()=>setPaused(p=>!p)}>{paused?<Play size={18}/>:<Pause size={18}/>}<span>{paused?'Tiếp tục':'Tạm dừng'}</span></button>}{screen!=='menu'&&<button onClick={home}><ArrowLeft size={18}/><span>Về menu</span></button>}</div>
    </header>
    <main className="stage-space"><div className="frame">
      {screen==='menu'&&<section className="menu-scene" style={{backgroundImage:`linear-gradient(90deg,#fff5e3fa 0%,#fff5e3ed 44%,#fff5e32b 100%),url(${backgrounds[0]})`}}>
        <div className="menu-copy"><span className="eyebrow">MỘT TRUYỀN THUYẾT · BỐN THỬ THÁCH</span><h1>Sính lễ đủ đầy.<br/><em>Non sông dậy sóng.</em></h1><p>Hóa thân Sơn Tinh, tranh sính lễ với Thủy Tinh. Tiếng trống gọi hội, đàn gà náo loạn — và một lời hẹn giữa núi rừng.</p>
          <label className="difficulty">Độ khó <select aria-label="Độ khó" value={difficulty} onChange={e=>setDifficulty(e.target.value as Difficulty)}><option value="easy">Dễ — làm quen</option><option value="normal">Thường — cân sức</option><option value="hard">Khó — tranh tài</option></select></label>
          <button className="primary" disabled={loading} onClick={()=>enter(1,true)}><Play size={20}/>{loading?'Đang tải tài nguyên…':'Bắt đầu câu chuyện'}<ArrowRight size={20}/></button>
          {records.completedStages.includes(4)&&<button className="quiet" onClick={()=>{enter(4).then(()=>setMode('endless'));}}>Thử sức đại hồng thủy vô tận · Kỷ lục {records.endlessBestSeconds}s</button>}
          <small className="menu-record">Đã chinh phục {records.completedStages.length}/4 thử thách · Tài nguyên và âm thanh chạy cục bộ</small>
          {error&&<p className="error" role="alert">{error}</p>}
        </div>
        <div className="menu-portraits"><Portrait who="son"/><Portrait who="thuy"/></div>
        <div className="stage-tiles">{([1,2,3,4] as StageId[]).map(id=><button key={id} disabled={loading} onClick={()=>enter(id)}><span className="tile-art" style={{backgroundImage:`url(${backgrounds[id-1]})`}}/><span><small>HỒI 0{id} {records.completedStages.includes(id)?'✓':''}</small><strong>{STAGES[id].title}</strong></span><ArrowRight size={18}/></button>)}</div>
      </section>}
      {screen==='story'&&<WeddingCutscene variant="opening" onStartStage4={()=>setScreen('brief')} onReturnHome={home}/>}
      {screen==='wedding'&&<WeddingCutscene variant="wedding" onStartStage4={()=>{setStage(4);setMode('timed60');setScreen('brief');}} onReturnHome={home}/>}
      {screen==='ending'&&<WeddingCutscene variant="ending" onStartStage4={()=>{setStage(4);setMode('endless');setScreen('brief');}} onReturnHome={home}/>}
      {screen==='brief'&&<section className="brief-scene">
        <StageArtwork src={meta.artwork} alt={meta.title} fallbackTitle={meta.title} className="brief-background"/>
        <div className="brief-scrim"/><div className="brief-copy"><span className="eyebrow">{meta.chapterLabel}</span><h1>{meta.title}</h1><p className="narration">{meta.folkRemixHook}</p><h2>Nhiệm vụ</h2><p>{meta.objective}</p><div className="control-list">{meta.controls.map((c,i)=><p key={i}>{c}</p>)}</div>
          {stage===3&&<div className="latency"><label>Độ trễ nhịp: {offset} ms<input aria-label="Độ trễ nhịp" type="range" min="-200" max="200" step="5" value={offset} onChange={e=>setOffset(+e.target.value)}/></label><button disabled={calibrating} onClick={()=>{setTaps([]);setCalibrating(true);}}>{calibrating?`Bấm Space theo tiếng chuông (${taps.length}/8)`:'Hiệu chỉnh 8 nhịp bằng Space'}</button></div>}
          <button className="primary" disabled={calibrating} onClick={launch}>Vào thử thách<ArrowRight size={20}/></button><small>R: chơi lại màn này · Esc: tạm dừng</small>
        </div><div className="brief-character"><Portrait who={stage===4?'thuy':'son'}/></div>
      </section>}
      {screen==='play'&&<><Stage key={run} paused={paused} difficulty={difficulty} offset={offset} mode={mode} onComplete={complete}/>{paused&&<div className="veil"><div className="pause-card"><span className="eyebrow">TRỐNG HỘI TẠM NGƯNG</span><h1>Chờ bạn trở lại</h1><p>Thời gian và nhạc đã dừng. Tiến độ màn chơi được giữ nguyên.</p><button className="primary" onClick={()=>setPaused(false)}><Play size={20}/>Tiếp tục</button><button className="secondary" onClick={launch}><RotateCcw size={18}/>Chơi lại màn này</button></div></div>}</>}
      {screen==='result'&&outcome&&<section className="result-scene" style={{backgroundImage:`linear-gradient(#fff3dfd9,#fff8eaf5),url(${meta.artwork})`}}><div className="result-portrait"><Portrait who={outcome.won?'son':'thuy'}/></div><div className="result-copy"><span className="eyebrow">{outcome.won?'THỬ THÁCH HOÀN THÀNH':'THỬ LẠI MỘT LẦN NỮA'}</span><div className="stars">{'★'.repeat(stars)}{'☆'.repeat(3-stars)}</div><h1>{outcome.headline}</h1><p>{outcome.summary}</p>{!outcome.won&&<blockquote>“Hôm nay ta chưa ăn sáng nên hơi cay!” — Thủy Tinh</blockquote>}<div className="result-stats"><div><small>ĐIỂM</small><strong>{outcome.playerScore}</strong></div>{outcome.stats.map(st=><div key={st.label}><small>{st.label}</small><strong>{st.value}</strong></div>)}</div><div className="button-row">{outcome.won&&<button className="primary" onClick={next}>{stage===4?'Đọc đoạn kết':stage===3?'Rước dâu về núi':'Sính lễ tiếp theo'}<ArrowRight size={19}/></button>}<button className={outcome.won?'secondary':'primary'} onClick={launch}><RotateCcw size={18}/>Chơi lại · R</button></div></div></section>}
    </div></main>
    <footer className="bottom-strip"><span>{screen==='play'?meta.controls[0]:'Văn Lang Live · Một cuộc đua sính lễ chưa từng có'}</span><span>{screen==='play'?'R: Chơi lại · Esc: Tạm dừng':'Bàn phím + Chuột · Game web 2D'}</span></footer>
  </div>;
}

export function Portrait({who}:{who:'son'|'thuy'|'king'|'princess'}){
  return <div role="img" aria-label={{son:'Sơn Tinh',thuy:'Thủy Tinh',king:'Vua Hùng',princess:'Mị Nương'}[who]} className={'portrait portrait-'+who} style={{backgroundImage:`url(${ARTWORK_PATHS.hero})`}}/>;
}
