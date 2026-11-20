import { StageId, StageResult } from './types';
import { soundEngine } from './sound';

export type Difficulty = 'easy' | 'normal' | 'hard';
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
export const distance = (a: {x: number; y: number}, b: {x: number; y: number}) => Math.hypot(a.x - b.x, a.y - b.y);
export const random = (a: number, b: number) => a + Math.random() * (b - a);
export interface Input { keys: Set<string>; x: number; y: number; }
export interface Game {
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  key(code: string): void;
  pointer(button: number): void;
}
export interface HUD { time: number; player: number; bot: number; status: string; detail: string; warning?: string; }
export interface Services {
  input: Input;
  difficulty: Difficulty;
  endless: boolean;
  offset: number;
  audioTime(): number;
  hud(value: HUD): void;
  finish(won: boolean, headline: string, summary: string, score: number, bot: number, stats?: StageResult['stats']): void;
  effect(x: number, y: number, text: string, strong?: boolean): void;
}
export function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 22, color = '#fff2cb') {
  ctx.save(); ctx.font = `700 ${size}px "Be Vietnam Pro", "Segoe UI", Arial, sans-serif`; ctx.textAlign = 'center';
  ctx.lineWidth = 5; ctx.strokeStyle = '#30271e'; ctx.strokeText(text, x, y); ctx.fillStyle = color; ctx.fillText(text, x, y); ctx.restore();
}
export function bar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, value: number, color = '#eeb954') {
  ctx.fillStyle = '#252b2c'; ctx.fillRect(x, y, w, 12);
  ctx.fillStyle = color; ctx.fillRect(x, y, w * clamp(value, 0, 1), 12);
}
export function move(input: Input, p: {x: number; y: number}, speed: number, dt: number) {
  let x = +(input.keys.has('KeyD') || input.keys.has('ArrowRight')) - +(input.keys.has('KeyA') || input.keys.has('ArrowLeft'));
  let y = +(input.keys.has('KeyS') || input.keys.has('ArrowDown')) - +(input.keys.has('KeyW') || input.keys.has('ArrowUp'));
  const len = Math.hypot(x, y) || 1;
  p.x = clamp(p.x + x / len * speed * dt, 70, 1210);
  p.y = clamp(p.y + y / len * speed * dt, 190, 640);
}
export function result(stageId: StageId, won: boolean, headline: string, summary: string, playerScore: number, botScore: number, stats: StageResult['stats']): StageResult {
  return {stageId, won, headline, summary, playerScore, botScore, stats};
}
export const sfx = (name: string) => soundEngine.playEffect(name);
