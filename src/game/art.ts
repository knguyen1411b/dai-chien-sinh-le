const art = import.meta.glob('../../assets/concepts/**/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
export const artUrl = (name: string) => art[Object.keys(art).find(k => k.endsWith('/' + name))!];
export const backgrounds = [1, 2, 3, 4].map((n, i) => artUrl(['background-01-cho-van-lang-v1.png', 'background-02-san-dinh-v1.png', 'background-03-hoi-nhac-v1.png', 'background-04-tan-vien-v1.png'][i]));
const sheets: Record<string, HTMLImageElement> = {};
export function preloadArt() {
  return Promise.all([...Object.entries(art).map(([path, url]) => new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Không tải được hình: ' + path));
    sheets[path.split('/').pop()!] = img;
    img.src = url;
  })), document.fonts.load('700 22px "Be Vietnam Pro"', 'Sơn Tinh – Thủy Tinh Tiếng Việt')]);
}
type Crop = [string, number, number, number, number];
const crops: Record<string, Crop> = {
  son: ['characters-v1.png', 0, 0, 480, 887],
  thuy: ['characters-v1.png', 466, 0, 585, 887],
  king: ['characters-v1.png', 1020, 0, 369, 887],
  princess: ['characters-v1.png', 1390, 0, 384, 887],
  buffalo: ['animals-01-market-v1.png', 0, 30, 530, 440],
  deer: ['animals-01-market-v1.png', 575, 0, 365, 470],
  turtle: ['animals-01-market-v1.png', 1010, 120, 526, 330],
  tiger: ['animals-01-market-v1.png', 0, 530, 460, 450],
  elephant: ['animals-01-market-v1.png', 420, 510, 510, 470],
  nine: ['animals-01-market-v1.png', 925, 460, 611, 520],
  hen: ['animals-02-village-v1.png', 80, 0, 450, 420],
  chick: ['animals-02-village-v1.png', 600, 180, 215, 220],
  rooster: ['animals-02-village-v1.png', 950, 0, 530, 440],
  golden: ['animals-02-village-v1.png', 80, 420, 725, 595],
  dog: ['animals-02-village-v1.png', 860, 440, 570, 550],
  horse0: ['animals-03-horse-states-v1.png', 0, 0, 720, 724],
  horse1: ['animals-03-horse-states-v1.png', 720, 0, 670, 724],
  horse2: ['animals-03-horse-states-v1.png', 1395, 0, 777, 724],
  crab: ['animals-04-water-monsters-v1.png', 0, 70, 880, 770],
  serpent: ['animals-04-water-monsters-v1.png', 920, 50, 854, 800],
};
export function sprite(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, w: number, h = w, flip = false) {
  const crop = crops[name];
  if (!crop) return;
  const [file, sx, sy, sw, sh] = crop;
  const image = sheets[file];
  if (!image?.complete || !image.naturalWidth) return;
  const scale = Math.min(w / sw, h / sh);
  ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1);
  ctx.drawImage(image, sx, sy, sw, sh, -sw * scale / 2, -sh * scale, sw * scale, sh * scale);
  ctx.restore();
}
export function background(ctx: CanvasRenderingContext2D, stage: number) {
  const name = ['background-01-cho-van-lang-v1.png', 'background-02-san-dinh-v1.png', 'background-03-hoi-nhac-v1.png', 'background-04-tan-vien-v1.png'][stage - 1];
  if (sheets[name]?.complete) ctx.drawImage(sheets[name], 0, 0, 1280, 720);
}
export function floodSky(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#f5ecd5'; ctx.fillRect(0, 0, 1280, 720);
  const image = sheets['background-04-tan-vien-v1.png'];
  if (image?.complete && image.naturalWidth) {
    ctx.save(); ctx.globalAlpha = .4;
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight * .21, 0, 0, 1280, 190);
    ctx.restore();
  }
}
