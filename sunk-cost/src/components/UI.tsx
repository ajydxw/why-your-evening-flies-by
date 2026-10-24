import React from 'react';
import { C, EBACK, EO, FONT, glow, tw } from '../lib';

/* 通用 UI 零件：全息卡片、吐槽气泡、印章、标题条、洞见横幅。
   所有组件都只接收“进度值 k（0..1）”，时间控制统一放在场景里，方便卡拍。 */

type Box = { x: number; y: number; w: number; h?: number };

/** 全息卡片：k=0→1 弹出（缩放 + 透明度） */
export const Holo: React.FC<Box & { k: number; col?: string; bg?: string; rot?: number; origin?: string; pad?: string; glowK?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  x, y, w, h, k, col = C.cyan, bg = 'rgba(8,20,48,0.86)', rot = 0, origin = 'center', pad = '18px 26px', glowK = 1, children, style }) => {
  if (k <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, padding: pad, boxSizing: 'border-box', borderRadius: 20,
      background: bg, border: `3px solid ${col}`, boxShadow: `0 0 ${22 * glowK}px ${col}88, inset 0 0 26px ${col}22`, fontFamily: FONT,
      transform: `scale(${0.55 + 0.45 * k}) rotate(${rot}deg)`, transformOrigin: origin, opacity: Math.min(1, k * 1.4), ...style }}>
      {children}
    </div>
  );
};

/** 锯齿吐槽气泡（与第一段“这把输了”同款） */
export const Rant: React.FC<Box & { k: number; f: number; lines: string[]; col?: string; size?: number; tail?: 'left' | 'right' | 'none'; shakeAmp?: number }> = ({
  x, y, w, h, k, f, lines, col = C.pink, size = 54, tail = 'left', shakeAmp = 0.6 }) => {
  if (k <= 0.001) return null;
  const hh = h ?? lines.length * size * 1.36 + 56;
  const tailPath = tail === 'left' ? `L${w * 0.32} ${hh} L${w * 0.2} ${hh + 34} L${w * 0.24} ${hh}` : tail === 'right' ? `L${w * 0.82} ${hh} L${w * 0.86} ${hh + 34} L${w * 0.72} ${hh}` : '';
  const d = `M14 8 L${w * 0.15} 0 L${w * 0.3} 12 L${w * 0.45} 0 L${w * 0.6} 10 L${w * 0.78} 0 L${w - 14} 12 L${w} ${hh * 0.5} L${w - 12} ${hh - 8} ${tailPath} L16 ${hh - 6} L0 ${hh * 0.5} Z`;
  const jit = Math.sin(f * 1.7) * shakeAmp;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: hh, fontFamily: FONT, transformOrigin: tail === 'right' ? '80% 100%' : '25% 100%',
      transform: `scale(${0.4 + 0.6 * k}) rotate(${-1.5 + jit}deg)`, opacity: Math.min(1, k * 1.5) }}>
      <svg width={w} height={hh + 40} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d={d} fill="#2A0420" stroke={col} strokeWidth={5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 16px ${col})` }} />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 28, width: w, textAlign: 'center', fontWeight: 900, fontSize: size, lineHeight: `${size * 1.36}px`, color: '#fff', textShadow: glow(col, 0.6) }}>
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

/** 印章：k=0→1 从 1.8 倍砸到 1 倍 */
export const Stamp: React.FC<Box & { k: number; col?: string; rot?: number; bg?: string; children?: React.ReactNode }> = ({ x, y, w, h, k, col = C.pink, rot = -4, bg = 'rgba(30,4,22,0.9)', children }) => {
  if (k <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', padding: '14px 24px', borderRadius: 18, fontFamily: FONT,
      border: `5px solid ${col}`, background: bg, boxShadow: `0 0 30px ${col}99, inset 0 0 0 3px ${col}44`,
      transform: `scale(${1.8 - 0.8 * k}) rotate(${rot}deg)`, opacity: Math.min(1, k * 2), textAlign: 'center' }}>
      {children}
    </div>
  );
};

/** 场景标题条（左上角）：编号 + 口头禅 */
export const ScenePill: React.FC<{ k: number; num: string; text: string; col?: string; sub?: string; x?: number; y?: number }> = ({ k, num, text, col = C.pink, sub, x = 84, y = 58 }) => {
  if (k <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT,
      transform: `translateX(${(1 - k) * -80}px)`, opacity: k }}>
      <div style={{ padding: '4px 16px', borderRadius: 10, background: col, color: C.ink, fontWeight: 900, fontSize: 28, lineHeight: '42px', boxShadow: `0 0 16px ${col}` }}>{num}</div>
      <div style={{ fontWeight: 900, fontSize: 52, lineHeight: '64px', color: '#fff', textShadow: glow(col, 0.55), letterSpacing: 4 }}>{text}</div>
      {sub && <div style={{ fontWeight: 700, fontSize: 28, color: C.dim, marginLeft: 4 }}>{sub}</div>}
    </div>
  );
};

/** 洞见横幅：k 控制出现，lines 每行可以是字符串或节点 */
export const Insight: React.FC<Box & { k: number; lines: React.ReactNode[]; col?: string; size?: number; tag?: string; bg?: string }> = ({ x, y, w, k, lines, col = C.gold, size = 44, tag, bg = 'rgba(30,18,4,0.9)' }) => {
  if (k <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, boxSizing: 'border-box', padding: '20px 34px', borderRadius: 18, fontFamily: FONT,
      background: bg, border: `3px solid ${col}`, boxShadow: `0 0 34px ${col}77`, textAlign: 'center',
      transform: `translateY(${(1 - k) * 40}px) scale(${0.9 + 0.1 * k})`, opacity: k }}>
      {tag && <div style={{ display: 'inline-block', padding: '0 14px', marginBottom: 6, borderRadius: 8, background: col, color: C.ink, fontWeight: 900, fontSize: 26, lineHeight: '38px' }}>{tag}</div>}
      {lines.map((l, i) => <div key={i} style={{ fontWeight: 900, fontSize: size, lineHeight: `${size * 1.4}px`, color: '#fff' }}>{l}</div>)}
    </div>
  );
};

/** 彩色强调词 */
export const Hi: React.FC<{ c?: string; children: React.ReactNode }> = ({ c = C.gold, children }) => <span style={{ color: c, textShadow: glow(c, 0.35) }}>{children}</span>;

/** 弹出进度（带回弹）——等价于 popIn，但允许自定义时长 */
export const pk = (f: number, start: number, dur = 9) => tw(f, start, start + dur, 0, 1, EBACK);
/** 平滑出现 */
export const ek = (f: number, start: number, dur = 8) => tw(f, start, start + dur, 0, 1, EO);
/** 区间内显示：在 [a, b) 内为 1，前后各自淡入淡出 */
export const life = (f: number, a: number, b: number, fin = 6, fout = 6) => Math.min(tw(f, a, a + fin, 0, 1, EO), tw(f, b - fout, b, 1, 0, EO));
