import { Easing, interpolate, random } from 'remotion';
import tl from './data/timeline.json';
import hbData from './data/heartbeats.json';

export const FPS = tl.fps;
export const W = tl.width;
export const H = tl.height;
/** 第 n 拍的秒数（音乐有 0.165s 前奏空白，拍点 = 0.165 + 0.713n） */
export const B = (n: number) => tl.beatOffset + tl.beatSec * n;
/** 第 n 拍对应的帧（浮点） */
export const BF = (n: number) => B(n) * FPS;

export const C = {
  bg0: '#07031A', bg1: '#140A36', bg2: '#0B1238',
  cyan: '#2EE6FF', pink: '#FF3EA5', gold: '#FFC83D', red: '#FF2E4D',
  white: '#F5F2FF', dim: 'rgba(245,242,255,0.62)', ink: '#090416',
};
export const FONT = '"Noto Sans SC", "Noto Sans CJK SC", sans-serif';

export const EO = Easing.out(Easing.cubic);
export const EI = Easing.in(Easing.cubic);
export const EIO = Easing.inOut(Easing.cubic);
export const EBACK = Easing.out(Easing.back(1.8));

/** 帧 f 在 [a,b] 区间内从 from 过渡到 to（自动夹紧） */
export function tw(f: number, a: number, b: number, from: number, to: number, ease = EIO) {
  return interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
}
/** 弹出：0 → 1，带回弹 */
export function popIn(f: number, start: number, dur = 9) {
  return tw(f, start, start + dur, 0, 1, EBACK);
}
export function fadeIn(f: number, start: number, dur = 6) { return tw(f, start, start + dur, 0, 1, EO); }
export function fadeOut(f: number, start: number, dur = 6) { return tw(f, start, start + dur, 1, 0, EI); }
/** 分段线性关键帧 [[t,v],...]（t 为秒） */
export function kf(t: number, keys: number[][]) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1]; const [t1, v1] = keys[i];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return keys[keys.length - 1][1];
}
export const heartRate = (sec: number) => kf(sec, tl.hr);
export const heartbeats: number[] = hbData.beats;

/** 倒 U 曲线：u∈[0,1] → 高度 0..1。左侧缓升，右侧断崖 */
export function curveG(u: number) {
  const p = 0.45;
  const w = u < p ? 0.3 : 0.24;
  return Math.exp(-(((u - p) / w) ** 2));
}
/** 屏幕抖动（确定性随机） */
export function shake(f: number, start: number, dur: number, amp: number, seed = 's') {
  if (f < start || f > start + dur) return { x: 0, y: 0 };
  const k = 1 - (f - start) / dur;
  return { x: (random(seed + 'x' + f) - 0.5) * 2 * amp * k, y: (random(seed + 'y' + f) - 0.5) * 2 * amp * k };
}
export const glow = (c: string, s = 1) => `0 0 ${8 * s}px ${c}, 0 0 ${22 * s}px ${c}, 0 0 ${48 * s}px ${c}66`;
