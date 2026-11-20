import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { backgrounds, artUrl } from '../game/art';
import { Stage4Mode } from '../game/types';

type Variant='opening'|'wedding'|'ending';
const stories={
  opening:[
    {speaker:'Người kể chuyện',who:'king',bg:0,title:'Lời hẹn ở Phong Châu',text:'Thuở vua Hùng thứ mười tám, công chúa Mị Nương đến tuổi se duyên. Hai vị thần cùng đến cầu hôn: một người làm chủ non cao, một người cai quản nước thẳm.'},
    {speaker:'Vua Hùng',who:'king',bg:0,title:'Ba sính lễ, một lời hứa',text:'“Ngày mai, ai mang voi chín ngà, gà chín cựa, ngựa chín hồng mao đến trước, ta sẽ gả con gái cho!” Sơn Tinh lên đường. Thủy Tinh cũng chẳng chịu nhường.'},
    {speaker:'Sơn Tinh',who:'son',bg:0,title:'Văn Lang lên sóng!',text:'“Bà con ơi, hội chợ mở rồi!” Giữa tiếng trống đồng và dòng bình luận Văn Lang Live, Sơn Tinh phải canh đúng lúc để kéo được voi chín ngà trước đối thủ.'},
  ],
  wedding:[
    {speaker:'Vua Hùng',who:'king',bg:0,title:'Sính lễ đủ đầy',text:'Voi chín ngà, gà chín cựa, ngựa chín hồng mao đã có đủ. Vua Hùng giữ lời: “Ta gả Mị Nương cho Sơn Tinh!”'},
    {speaker:'Mị Nương',who:'princess',bg:2,title:'Trống hội rước dâu',text:'Dưới sắc cờ hội, Mị Nương theo Sơn Tinh về núi Tản Viên. Tiếng trống ngân qua đồng ruộng, lời chúc phúc nối dài từ Phong Châu đến non cao.'},
    {speaker:'Thủy Tinh',who:'thuy',bg:3,title:'Cơn giận đến muộn',text:'“Ai cho Sơn Tinh cưới trước?!” Đến sau một bước, Thủy Tinh nổi giận hô mưa gọi gió. Cua và thuồng luồng theo sóng lũ tràn vào làng.'},
    {speaker:'Sơn Tinh',who:'son',bg:3,title:'Nước dâng, núi cũng dâng',text:'“Mị Nương, hãy ở trên đỉnh núi!” Sơn Tinh nhặt đá, nhổ cây, dựng tường giữ đất. Trụ vững sáu mươi giây, đừng để nước chạm đỉnh Tản Viên.'},
  ],
  ending:[
    {speaker:'Người kể chuyện',who:'son',bg:3,title:'Non cao giữ lời',text:'Thủy Tinh đánh mãi không thắng, đành thu quân. Dân làng trở về, Mị Nương mỉm cười. Tản Viên vẫn đứng vững sau mưa giông.'},
    {speaker:'Mị Nương',who:'princess',bg:2,title:'Truyền thuyết còn kể mãi',text:'Từ đó, năm nào Thủy Tinh cũng dâng nước đánh Sơn Tinh. Nước dâng bao nhiêu, núi cao bấy nhiêu… Bạn đã hoàn thành câu chuyện và mở thử thách Vô tận!'},
  ],
};
export function WeddingCutscene({variant='wedding',onStartStage4,onReturnHome}:{variant?:Variant;onStartStage4:(mode:Stage4Mode)=>void;onReturnHome:()=>void}){
  const [index,setIndex]=useState(0);const panels=stories[variant];const panel=panels[index];
  const next=()=>index+1<panels.length?setIndex(index+1):onStartStage4(variant==='ending'?'endless':'timed60');
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.code==='Space'||e.code==='Enter')&&!e.repeat&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();next();}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[index]);
  return <section className="story-scene" style={{backgroundImage:`linear-gradient(0deg,#fff5e3ee,transparent 85%),url(${backgrounds[panel.bg]})`}}>
    <div className="story-top"><span className="eyebrow">{variant==='opening'?'THUỞ ẤY Ở VĂN LANG':variant==='ending'?'HẠ MÀN TRUYỀN THUYẾT':'CẦU NỐI · ĐÓN DÂU VỀ NÚI'}</span><button className="secondary" onClick={()=>onStartStage4(variant==='ending'?'endless':'timed60')}>Bỏ qua →</button></div>
    <div className={'story-figure portrait portrait-'+panel.who} style={{backgroundImage:`url(${artUrl('characters-v1.png')})`}}/>
    <div className="story-dialog" key={index}><span className="eyebrow">{panel.speaker}</span><h1>{panel.title}</h1><p>{panel.text}</p><div className="story-bottom"><span>{index+1} / {panels.length} · Space / Enter để tiếp tục</span><div className="button-row">{variant==='ending'&&index===panels.length-1&&<button className="secondary" onClick={onReturnHome}>Về menu</button>}<button className="primary" onClick={next}>{index<panels.length-1?'Tiếp tục':variant==='ending'?'Chơi vô tận':'Lên đường'}<ArrowRight size={18}/></button></div></div></div>
  </section>;
}
