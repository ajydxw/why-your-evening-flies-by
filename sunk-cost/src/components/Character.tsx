import React from 'react';
import { C } from '../lib';

export type Pt = { x: number; y: number };
export type Pose = {
  x: number; y: number;           // 髋部在画面中的位置
  scale?: number; rot?: number;   // 整体缩放 / 旋转（度，正值=前倾）
  handN?: Pt; handF?: Pt;         // 近侧 / 远侧手的目标点（局部坐标，髋部为原点）
  kneeN?: Pt; footN?: Pt; kneeF?: Pt; footF?: Pt;
  headTilt?: number;              // 头部倾斜（度）
  angry?: number;                 // 0..1 红温程度
  laser?: number;                 // 0..1 眼睛激光
  laserTo?: Pt;                   // 激光落点（与 x/y 同一坐标系）
  tired?: number;                 // 0..1 黑眼圈
  sick?: number;                  // 0..1 脸色发青（吃坏肚子）
  flip?: boolean;                 // 水平翻转（朝左）
  eyesClosed?: number;            // 0..1 闭眼
  t: number;                      // 秒，用于围巾飘动
  wind?: number;                  // 围巾飘动幅度倍数
  chair?: boolean; chairOpacity?: number;
  opacity?: number; id?: string;
};

const L1 = 108, L2 = 108;
function ik(s: Pt, h: Pt, bend = 1): [Pt, Pt] {
  const dx = h.x - s.x, dy = h.y - s.y;
  let d = Math.hypot(dx, dy);
  const maxd = L1 + L2 - 0.5; const dd = Math.min(Math.max(d, 20), maxd);
  const th = Math.atan2(dy, dx);
  const a = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + dd * dd - L2 * L2) / (2 * L1 * dd))));
  const e = { x: s.x + L1 * Math.cos(th + bend * a), y: s.y + L1 * Math.sin(th + bend * a) };
  const hh = { x: s.x + dd * Math.cos(th), y: s.y + dd * Math.sin(th) };
  return [e, hh];
}
function ribbon(pts: Pt[], w0: number) {
  const L: string[] = [], R: string[] = [];
  pts.forEach((p, i) => {
    const q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
    const ang = Math.atan2(q.y - o.y, q.x - o.x) + Math.PI / 2;
    const w = w0 * (1 - (i / pts.length) * 0.75);
    L.push(`${p.x + Math.cos(ang) * w / 2},${p.y + Math.sin(ang) * w / 2}`);
    R.unshift(`${p.x - Math.cos(ang) * w / 2},${p.y - Math.sin(ang) * w / 2}`);
  });
  return `M${L.join(' L')} L${R.join(' L')} Z`;
}

/** 戴粉色围巾的剪影小人（侧身朝右） */
export const Character: React.FC<Pose> = (p) => {
  const id = p.id ?? 'c';
  const angry = p.angry ?? 0, tired = p.tired ?? 0, wind = p.wind ?? 1;
  const sick = p.sick ?? 0;
  let body = angry > 0 ? mix('#0C0720', '#3A0614', angry) : '#0C0720';
  let far = angry > 0 ? mix('#07040F', '#24030B', angry) : '#07040F';
  if (sick > 0) { body = mix(body, '#123A1A', sick); far = mix(far, '#0A2410', sick); }
  const S = { x: 44, y: -186 }, SF = { x: 30, y: -184 };
  const hN = p.handN ?? { x: 196, y: -108 }, hF = p.handF ?? { x: 178, y: -114 };
  const [eN, hN2] = ik(S, hN, 1), [eF, hF2] = ik(SF, hF, 1);
  const hip = { x: 8, y: -8 };
  const kN = p.kneeN ?? { x: 128, y: -14 }, fN = p.footN ?? { x: 134, y: 112 };
  const kF = p.kneeF ?? { x: 116, y: -18 }, fF = p.footF ?? { x: 120, y: 110 };
  const head = { x: 80, y: -252 };
  // 把全局落点换算到头部局部坐标（抵消整体旋转、缩放和头部倾斜）
  let le = { x: 760, y: -330 };
  if (p.laserTo) {
    const r = (-(p.rot ?? 0) * Math.PI) / 180, sc = p.scale ?? 1;
    const dx = p.laserTo.x - p.x, dy = p.laserTo.y - p.y;
    const bx = (dx * Math.cos(r) - dy * Math.sin(r)) / sc, by = (dx * Math.sin(r) + dy * Math.cos(r)) / sc;
    const hr = (-(p.headTilt ?? 0) * Math.PI) / 180, px = bx - 58, py = by + 214;
    le = { x: 58 + px * Math.cos(hr) - py * Math.sin(hr), y: -214 + px * Math.sin(hr) + py * Math.cos(hr) };
  }
  // 围巾尾巴
  const tail = (phase: number, len: number, droop: number) => {
    const pts: Pt[] = [];
    for (let k = 0; k <= 9; k++) {
      const a = wind * (6 + k * 2.6) * Math.sin(p.t * 7.5 - k * 0.65 + phase);
      pts.push({ x: 24 - k * len, y: -196 + k * droop + a });
    }
    return pts;
  };
  const filt = `rim-${id}`;
  return (
    <g transform={`${p.flip ? `translate(${2 * p.x} 0) scale(-1 1) ` : ''}translate(${p.x} ${p.y}) rotate(${p.rot ?? 0}) scale(${p.scale ?? 1})`} opacity={p.opacity ?? 1}>
      <defs>
        <filter id={filt} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow in="SourceAlpha" dx="4" dy="0" stdDeviation="2.2" floodColor={C.cyan} floodOpacity="0.95" result="a" />
          <feDropShadow in="SourceAlpha" dx="-3" dy="-2" stdDeviation="2.5" floodColor={C.pink} floodOpacity="0.75" result="b" />
          <feDropShadow in="SourceAlpha" dx="0" dy="0" stdDeviation={6 + angry * 10} floodColor={angry > 0.05 ? C.red : sick > 0.3 ? '#5CFF7A' : C.cyan} floodOpacity={0.25 + angry * 0.6} result="c" />
          <feMerge><feMergeNode in="c" /><feMergeNode in="a" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`sc-${id}`} x1="1" x2="0"><stop offset="0" stopColor="#FF62B8" /><stop offset="1" stopColor="#C01C78" /></linearGradient>
      </defs>
      {p.chair !== false && (
        <g opacity={p.chairOpacity ?? 1}>
          <g transform="rotate(-9 -60 -16)">
            <rect x={-92} y={-276} width={58} height={262} rx={26} fill="#120A2A" stroke={C.pink} strokeWidth={3} style={{ filter: `drop-shadow(0 0 6px ${C.pink})` }} />
            <rect x={-80} y={-250} width={34} height={70} rx={14} fill="#1C1040" />
          </g>
          <rect x={-84} y={-12} width={168} height={26} rx={12} fill="#120A2A" stroke={C.pink} strokeWidth={2.5} />
          <rect x={-8} y={14} width={14} height={80} fill="#0E0822" />
          <rect x={-96} y={94} width={182} height={10} rx={5} fill="#0E0822" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={2} />
          {[-92, -1, 82].map((wx) => <circle key={wx} cx={wx} cy={110} r={9} fill="#0E0822" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={2} />)}
        </g>
      )}
      <g filter={`url(#${filt})`}>
        {/* 远侧腿、远侧手臂 */}
        <path d={`M${hip.x - 10} ${hip.y} L${kF.x} ${kF.y} L${fF.x} ${fF.y}`} stroke={far} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx={fF.x + 16} cy={fF.y + 6} rx={24} ry={10} fill={far} />
        <path d={`M${SF.x} ${SF.y} L${eF.x} ${eF.y} L${hF2.x} ${hF2.y}`} stroke={far} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={hF2.x} cy={hF2.y} r={14} fill={far} />
        {/* 围巾尾巴（在背后飘） */}
        <path d={ribbon(tail(0, 19, 3), 22)} fill={`url(#sc-${id})`} />
        <path d={ribbon(tail(1.7, 16, 6), 17)} fill="#E02A8E" />
        {/* 躯干 */}
        <path d="M-40 2 C -52 -70 -42 -142 -2 -186 C 14 -206 40 -216 62 -211 C 88 -202 90 -150 82 -112 C 74 -64 62 -22 46 2 Z" fill={body} />
        {/* 头 */}
        <g transform={`rotate(${p.headTilt ?? 0} 58 -214)`}>
          <rect x={46} y={-226} width={30} height={30} rx={10} fill={body} />
          <circle cx={head.x} cy={head.y} r={45} fill={body} />
          <path d="M118 -262 Q 132 -250 121 -240 Z" fill={body} />
          <path d="M60 -294 Q 70 -312 86 -300 Q 76 -306 70 -296 Z" fill={body} />
          {tired > 0 && <path d="M92 -246 Q 104 -238 115 -247" stroke="#6B2BBF" strokeWidth={5} fill="none" opacity={tired} strokeLinecap="round" />}
          {(p.eyesClosed ?? 0) > 0.5
            ? <path d="M97 -258 Q 104 -253 111 -258" stroke={C.cyan} strokeWidth={3.5} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 5px ${C.cyan})` }} />
            : <ellipse cx={104} cy={-258} rx={5 + angry * 3} ry={(3.6 + angry * 1.5) * (1 - (p.eyesClosed ?? 0))}
                fill={angry > 0.3 ? '#FF4F9A' : sick > 0.4 ? '#9CFF6A' : C.cyan} style={{ filter: `drop-shadow(0 0 ${5 + angry * 8}px ${angry > 0.3 ? C.pink : sick > 0.4 ? '#7CFF4A' : C.cyan})` }} />}
          {(p.laser ?? 0) > 0 && (
            <g opacity={p.laser}>
              <line x1={108} y1={-258} x2={le.x} y2={le.y} stroke={C.pink} strokeWidth={10} opacity={0.35} strokeLinecap="round" />
              <line x1={108} y1={-258} x2={le.x} y2={le.y} stroke="#FFD1EA" strokeWidth={3} strokeLinecap="round" />
              <circle cx={le.x} cy={le.y} r={14} fill={C.pink} opacity={0.6} />
            </g>
          )}
        </g>
        {/* 围巾领口 */}
        <path d="M24 -200 Q 52 -186 86 -206" stroke={`url(#sc-${id})`} strokeWidth={22} strokeLinecap="round" fill="none" />
        <circle cx={24} cy={-198} r={13} fill="#E02A8E" />
        {/* 近侧腿、近侧手臂 */}
        <path d={`M${hip.x} ${hip.y} L${kN.x} ${kN.y} L${fN.x} ${fN.y}`} stroke={body} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx={fN.x + 18} cy={fN.y + 6} rx={26} ry={11} fill={body} />
        <path d={`M${S.x} ${S.y} L${eN.x} ${eN.y} L${hN2.x} ${hN2.y}`} stroke={body} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={hN2.x} cy={hN2.y} r={16} fill={body} />
      </g>
    </g>
  );
};

function mix(a: string, b: string, k: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, k))).toString(16).padStart(2, '0')).join('');
}

/** 站立 / 走路的腿部姿势（局部坐标）。phase 为步态相位（弧度），amp=0 时为站立 */
export function legs(phase = 0, amp = 0) {
  const sN = Math.sin(phase), sF = Math.sin(phase + Math.PI);
  const up = (ph: number) => Math.max(0, Math.sin(ph + Math.PI / 2)) * 26 * amp;
  return {
    kneeN: { x: 20 + sN * 46 * amp + 10 * amp, y: 100 - up(phase) * 0.4 },
    footN: { x: 12 + sN * 62 * amp, y: 206 - up(phase) },
    kneeF: { x: 6 + sF * 46 * amp + 10 * amp, y: 100 - up(phase + Math.PI) * 0.4 },
    footF: { x: -2 + sF * 62 * amp, y: 206 - up(phase + Math.PI) },
  };
}
/** 髋部到地面的距离（站立时） */
export const HIP_TO_GROUND = 222;
