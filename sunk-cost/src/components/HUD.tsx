import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, FPS, curveG, heartRate, heartbeats, kf, glow } from '../lib';
import tl from '../data/timeline.json';

const CW = 360, CH = 200;
function ecg(dt: number) {
  if (dt < 0) return 0;
  if (dt < 0.03) return -dt / 0.03;
  if (dt < 0.06) return -1 + ((dt - 0.03) / 0.03) * 1.4;
  if (dt < 0.09) return 0.4 - ((dt - 0.06) / 0.03) * 0.4;
  if (dt > 0.18 && dt < 0.34) return -0.22 * Math.sin(((dt - 0.18) / 0.16) * Math.PI);
  return 0;
}
export const hrColor = (hr: number) => (hr < 95 ? C.cyan : hr < 125 ? C.gold : hr < 160 ? C.pink : C.red);
const hrState = (hr: number) => (hr < 95 ? '平稳' : hr < 125 ? '紧张' : hr < 160 ? '上头' : '爆表');

/** 右下角常驻小卡：心率 + 倒 U 曲线 + “你在这” */
export const HUD: React.FC<{ opacity?: number }> = ({ opacity: op0 = 1 }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const [fa, fb] = tl.hudFade ?? [9999, 10000];
  const opacity = op0 * (t <= fa ? 1 : t >= fb ? 0 : 0.5 + 0.5 * Math.cos(((t - fa) / (fb - fa)) * Math.PI));
  if (opacity <= 0) return null;
  const hr = heartRate(t);
  const col = hrColor(hr);
  // 最近一次心跳 → 心形跳动
  let last = -9;
  for (const b of heartbeats) { if (b <= t) last = b; else break; }
  const beatK = Math.max(0, 1 - (t - last) / 0.18);
  // 心电图
  const ex0 = 222, ew = 116, ey = 48, eh = 20;
  const pts: string[] = [];
  for (let i = 0; i <= ew; i += 2) {
    const tt = t - ((ew - i) / ew) * 1.8;
    let v = 0;
    for (const b of heartbeats) { if (b > tt) break; if (tt - b < 0.4) v += ecg(tt - b); }
    pts.push(`${ex0 + i},${ey + v * eh}`);
  }
  // 倒 U 小曲线
  const cx0 = 24, cw = 312, cy0 = 182, chh = 64;
  const cpts: string[] = [];
  for (let i = 0; i <= 60; i++) { const u = i / 60; cpts.push(`${cx0 + u * cw},${cy0 - curveG(u) * chh}`); }
  let u = kf(t, tl.cursor);
  if (t > 3.017 && t < 5.869) u += Math.sin(t * 22) * 0.018; // 顶点处摇晃
  const drop = tl.cursorDrop ? kf(t, tl.cursorDrop) : 0;            // 跌穿谷底
  const dx = cx0 + u * cw, dy = cy0 - curveG(u) * chh + drop;
  const lx = Math.min(Math.max(dx, 62), CW - 62);
  const alarm = hr >= 165 ? 0.5 + 0.5 * Math.sin(t * 18) : 0;
  return (
    <div style={{ position: 'absolute', right: 64, bottom: 56, width: CW, height: CH, opacity, fontFamily: FONT }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'rgba(12,6,34,0.78)',
        border: `2px solid ${col}88`, boxShadow: `0 0 ${18 + alarm * 30}px ${col}${alarm > 0 ? 'aa' : '55'}, inset 0 0 24px ${col}22` }} />
      <svg width={CW} height={CH} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="hudc" x1="0" x2="1">
            <stop offset="0" stopColor={C.cyan} /><stop offset="0.45" stopColor={C.gold} /><stop offset="1" stopColor={C.pink} />
          </linearGradient>
        </defs>
        <g transform={`translate(34 46) scale(${1 + beatK * 0.25}) translate(-16 -15)`}>
          <path d="M16 29 C 6 21 0 15 0 8.5 C 0 3.5 4 0 8.5 0 C 12 0 14.5 2 16 4.5 C 17.5 2 20 0 23.5 0 C 28 0 32 3.5 32 8.5 C 32 15 26 21 16 29 Z" fill={col} style={{ filter: `drop-shadow(0 0 6px ${col})` }} />
        </g>
        <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={2.5} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${col})` }} />
        <line x1={20} x2={CW - 20} y1={96} y2={96} stroke="rgba(255,255,255,0.12)" />
        <polyline points={cpts.join(' ')} fill="none" stroke="url(#hudc)" strokeWidth={3} strokeLinecap="round" />
        <line x1={cx0} x2={cx0 + cw} y1={cy0 + 2} y2={cy0 + 2} stroke="rgba(255,255,255,0.18)" />
        <circle cx={dx} cy={dy} r={9 + beatK * 3} fill={col} opacity={0.35} />
        <circle cx={dx} cy={dy} r={6} fill="#fff" stroke={col} strokeWidth={3} />
      </svg>
      <div style={{ position: 'absolute', left: 60, top: 14, width: 90, color: C.white, fontWeight: 900, fontSize: 44, lineHeight: '56px', letterSpacing: -1,
        fontVariantNumeric: 'tabular-nums', textShadow: glow(col, 0.5) }}>{Math.round(hr)}</div>
      <div style={{ position: 'absolute', left: 154, top: 22, color: col, fontWeight: 700, fontSize: 20, lineHeight: '22px' }}>BPM</div>
      <div style={{ position: 'absolute', left: 154, top: 44, color: C.dim, fontWeight: 700, fontSize: 20, lineHeight: '22px' }}>{hrState(hr)}</div>
      <div style={{ position: 'absolute', left: lx - 44, top: dy - 46 >= 100 ? dy - 46 : dy + 16, width: 88, height: 30, borderRadius: 8,
        background: col, color: C.ink, fontWeight: 900, fontSize: 19, lineHeight: '30px', textAlign: 'center',
        boxShadow: `0 0 12px ${col}` }}>你在这</div>
    </div>
  );
};
