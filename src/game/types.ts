import { artUrl, backgrounds } from './art';
export type StageId = 1 | 2 | 3 | 4;
export type Stage4Mode = 'timed60' | 'endless';
export interface StageResult {
  stageId: StageId; won:boolean; playerScore:number; botScore:number; headline:string; summary:string;
  stats:Array<{label:string;value:string}>; stars?:number; stage4Mode?:Stage4Mode; altitudeMeters?:number; survivedSeconds?:number;
}
export interface SavedRecords {
  completedStages:StageId[]; bestStageScores:Partial<Record<StageId,number>>; bestStageStars?:Partial<Record<StageId,number>>; endlessBestSeconds:number; endlessBestAltitude:number;
}
export const ARTWORK_PATHS={hero:artUrl('characters-v1.png'),stage1:backgrounds[0],stage2:backgrounds[1],stage3:backgrounds[2],stage4:backgrounds[3]};
export const STAGES={
  1:{chapterLabel:'Hồi 01 · Voi chín ngà',title:'Voi Chín Ngà',artwork:backgrounds[0],folkRemixHook:'Chợ Văn Lang mở hội. Hai vị thần tranh nhau một băng chuyền sính lễ. Di chuyển Sơn Tinh cầm dây, tung thòng lọng rồi kéo thật nhanh!',objective:'Kéo được voi chín ngà trước Thủy Tinh trong 75 giây. Thú thường cho điểm; Phước Trời giúp voi quý sớm xuất hiện.',controls:['A / D hoặc ← →: di chuyển Sơn Tinh và dây thừng','Space / Click: tung thòng lọng · Khi thắt được thú: bấm liên tục để kéo','Thòng lọng cách tâm ≤25px: chắc · ≤60px: lỏng · Thanh kéo về 0: tuột dây','Voi chín ngà là sính lễ duy nhất giúp qua màn.']},
  2:{chapterLabel:'Hồi 02 · Gà chín cựa',title:'Gà Chín Cựa',artwork:backgrounds[1],folkRemixHook:'Đàn gà chạy tán loạn trên sân đình. Chạy đuổi không đủ: phải dụ ăn, lùa góc, rồi nhanh tay bắt!',objective:'Mang 8 gà thường và gà chín cựa vào lồng góc phải trên trong 100 giây. Đừng để cua tha quá 4 gà.',controls:['WASD / Mũi tên: chạy · Space: bắt gà gần đang ăn / nghỉ / sát rào','Chuột trái: ném thóc · Chuột phải: hú đuổi quanh con trỏ · Q: đổi thóc','Mang tối đa 3 gà · Về lồng tự thả · Bồ thóc giữa sân nạp đầy','Gà chín cựa chỉ ăn nếp vàng · Chạy tới gần cua để đuổi.']},
  3:{chapterLabel:'Hồi 03 · Ngựa chín hồng mao',title:'Ngựa Chín Hồng Mao',artwork:backgrounds[2],folkRemixHook:'Nhịp trống đồng vang trên bãi hội. Sơn Tinh thuần chiến mã bằng tiếng nhạc, từng sợi hồng mao dần bừng sáng.',objective:'Gõ đúng ít nhất 75% nốt mỗi đoạn để sáng 1 sợi. Đủ 9 sợi trước đối thủ trong tối đa 18 đoạn. Dưới 50% mất 1 sợi.',controls:['A S K L hoặc ← ↓ ↑ →: bốn làn nốt, gõ lúc nốt chạm vạch','Tuyệt vời: ±60ms · Tốt: ±120ms · Không tính giữ phím','Hiệu chỉnh độ trễ theo tiếng chuông trước khi vào màn nếu cần.']},
  4:{chapterLabel:'Hồi 04 · Lấp biển dời núi',title:'Lấp Biển Dời Núi',artwork:backgrounds[3],folkRemixHook:'Đến muộn, Thủy Tinh nổi cơn thịnh nộ. Bãi đá ở bên phải, núi và bệ nâng ở bên trái. Nhặt thật nhiều đá rồi mang qua lối nối để nâng núi. Cua và thuồng luồng chỉ phá núi từ dưới nước!',objective:'Giữ độ cao núi lớn hơn mực nước trong 60 giây. Không có thanh máu; nước chạm đỉnh núi là thua.',controls:['A / D: chạy · W / Space: nhảy · E: nhặt / giữ để nhổ cây, vác tảng','Bên phải: E nhặt đá/cây · Bên trái: E tại bệ để nâng núi · Tối đa 4 ô','Chuột trái: ném đá xuống nước hạ quái · Chuột phải: dùng cây dựng tường ở mép nước','Q: Thần Núi nổi giận (+10 núi, −5 nước), hồi 20 giây.']},
};
const key='sontinh_thuytinh_4_0_records_v2';
export function loadSavedRecords():SavedRecords{
  const empty:SavedRecords={completedStages:[],bestStageScores:{},endlessBestSeconds:0,endlessBestAltitude:0};
  try{const r=JSON.parse(localStorage.getItem(key)||'null');if(!r)return empty;return {completedStages:Array.isArray(r.completedStages)?r.completedStages.filter((i:number)=>[1,2,3,4].includes(i)):[],bestStageScores:r.bestStageScores&&typeof r.bestStageScores==='object'?r.bestStageScores:{},bestStageStars:r.bestStageStars&&typeof r.bestStageStars==='object'?r.bestStageStars:{},endlessBestSeconds:Number(r.endlessBestSeconds)||0,endlessBestAltitude:Number(r.endlessBestAltitude)||0};}catch{return empty;}
}
export function saveRecords(records:SavedRecords){try{localStorage.setItem(key,JSON.stringify(records));}catch{/* Game remains playable when storage is disabled. */}}
