import { useEffect, useState } from 'react';
import { ArrowRight, ChevronsRight } from 'lucide-react';
import { backgrounds, artUrl } from '../game/art';
import { Stage4Mode } from '../game/types';

type Variant='opening'|'wedding'|'ending';
const stories={
  opening:[
    {speaker:'VUA HÙNG XVIII · VĂN LANG LIVE',who:'king',bg:0,title:'Vua Hùng ra đề sính lễ',text:'“Hỡi hai chàng tài tuấn! Ai đem đủ Voi chín ngà, Gà chín cựa, Ngựa chín hồng mao tới trước sẽ được cưới Mị Nương!”'},
    {speaker:'SƠN TINH · HÀNH TRÌNH BẮT ĐẦU',who:'son',bg:0,title:'Hai vị thần lên đường',text:'Sơn Tinh lên núi, Thủy Tinh gọi sóng. Cả Văn Lang dõi theo cuộc đua sính lễ. Trước hết, hãy tới hội chợ và tung dây thòng lọng bắt voi chín ngà!'},
  ],
  wedding:[
    {speaker:'Vua Hùng',who:'king',bg:0,title:'Sính lễ đủ đầy',text:'Voi chín ngà, gà chín cựa, ngựa chín hồng mao đã có đủ. Vua Hùng giữ lời: “Ta gả Mị Nương cho Sơn Tinh!”'},
    {speaker:'Mị Nương',who:'princess',bg:2,title:'Trống hội rước dâu',text:'Dưới sắc cờ hội, Mị Nương theo Sơn Tinh về núi Tản Viên. Tiếng trống ngân qua đồng ruộng, lời chúc phúc nối dài từ Phong Châu đến non cao.'},
    {speaker:'Thủy Tinh',who:'thuy',bg:3,title:'Cơn giận đến muộn',text:'“Ai cho Sơn Tinh cưới trước?!” Đến sau một bước, Thủy Tinh nổi giận hô mưa gọi gió. Cua và thuồng luồng theo sóng lũ tràn vào làng.'},
    {speaker:'Sơn Tinh',who:'son',bg:3,title:'Nước dâng, núi cũng dâng',text:'“Mị Nương, hãy ở trên đỉnh núi!” Sơn Tinh nhặt đá ở bãi bên phải, mang về núi bên trái để nâng đất và dựng tường. Trụ vững sáu mươi giây, đừng để nước chạm đỉnh Tản Viên.'},
  ],
  ending:[
    {speaker:'Người kể chuyện',who:'son',bg:3,title:'Non cao giữ lời',text:'Thủy Tinh đánh mãi không thắng, đành thu quân. Dân làng trở về, Mị Nương mỉm cười. Tản Viên vẫn đứng vững sau mưa giông.'},
    {speaker:'Mị Nương',who:'princess',bg:2,title:'Truyền thuyết còn kể mãi',text:'Từ đó, năm nào Thủy Tinh cũng dâng nước đánh Sơn Tinh. Nước dâng bao nhiêu, núi cao bấy nhiêu… Bạn đã hoàn thành câu chuyện và mở thử thách Vô tận!'},
  ],
};
export function WeddingCutscene({variant='wedding',onStartStage4,onReturnHome}:{variant?:Variant;onStartStage4:(mode:Stage4Mode)=>void;onReturnHome:()=>void}){
  const [index,setIndex]=useState(0);
  const panels=stories[variant];const panel=panels[index];
  const proceed=()=>onStartStage4(variant==='ending'?'endless':'timed60');
  const next=()=>index+1<panels.length?setIndex(index+1):proceed();
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{
      if(e.repeat)return;
      if(e.code==='Escape'){e.preventDefault();proceed();}
      else if((e.code==='Space'||e.code==='Enter')&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();next();}
    };
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[index,variant,onStartStage4]);
  const backdrop=variant==='opening'||(variant==='wedding'&&index===0)?artUrl('story-palace-v1.png'):backgrounds[panel.bg];
  return <section className="legend-story" style={{backgroundImage:`url(${backdrop})`}} aria-label={panel.title}>
    <div className="legend-story-top"><p>{variant==='opening'?'Mở đầu':variant==='ending'?'Đoạn kết':'Rước dâu'} · {panel.title} · Khung {index+1}/{panels.length}</p><button className="paper-button" onClick={proceed}>Bỏ qua (Esc)<ChevronsRight/></button></div>
    {variant!=='opening'&&!(variant==='wedding'&&index===0)&&<div className={'legend-story-figure portrait portrait-'+panel.who} style={{backgroundImage:`url(${artUrl('characters-v1.png')})`}}/>}
    <div className="legend-dialogue" key={index} aria-live="polite"><span className="legend-speaker">{panel.speaker}</span><p className="legend-dialogue-text">{panel.text}</p><div className="legend-dialogue-bottom"><span>Nhấn Space / Enter hoặc nút bên phải để tiếp tục</span><div className="button-row">{variant==='ending'&&index===panels.length-1&&<button className="dialogue-next" onClick={onReturnHome}>Về menu</button>}<button className="dialogue-next" onClick={next}>{index<panels.length-1?'Tiếp theo':variant==='ending'?'Chơi vô tận':'Lên đường'}<ArrowRight size={18}/></button></div></div></div>
  </section>;
}
