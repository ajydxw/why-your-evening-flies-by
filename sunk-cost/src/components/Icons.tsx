import React from 'react';

/** 霓虹线条图标，绘制在以 (0,0) 为中心、约 72×72 的范围内 */
export type IconName = 'yuan' | 'clock' | 'takeout' | 'ticket' | 'books' | 'heart' | 'star';
export const Icon: React.FC<{ name: IconName; color: string; sw?: number }> = ({ name, color, sw = 4 }) => {
  const s = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'yuan':
      return <g {...s}><circle r={30} /><path d="M-13 -16 L0 0 L13 -16 M0 0 V18 M-11 2 H11 M-11 10 H11" /></g>;
    case 'clock':
      return <g {...s}><circle r={28} cy={4} /><path d="M0 4 V-10 M0 4 L11 11 M-26 -22 L-16 -30 M26 -22 L16 -30 M-16 30 L-20 36 M16 30 L20 36" /></g>;
    case 'takeout':
      return <g {...s}><path d="M-30 -2 H30 Q 28 28 0 30 Q -28 28 -30 -2 Z" /><path d="M-12 -12 Q -6 -20 -12 -28 M2 -12 Q 8 -20 2 -28 M16 -12 Q 22 -20 16 -28" /><path d="M-20 34 H20" /></g>;
    case 'ticket':
      return <g {...s}><path d="M-32 -20 H32 V-8 A8 8 0 0 0 32 8 V20 H-32 V8 A8 8 0 0 0 -32 -8 Z" /><path d="M-10 -20 V20" strokeDasharray="4 5" /><path d="M10 -9 L13 -2 L20 -2 L14 3 L16 10 L10 6 L4 10 L6 3 L0 -2 L7 -2 Z" /></g>;
    case 'books':
      return <g {...s}><path d="M0 -20 Q -14 -28 -32 -24 V22 Q -14 18 0 26 Q 14 18 32 22 V-24 Q 14 -28 0 -20 Z" /><path d="M0 -20 V26 M-22 -12 Q -12 -14 -6 -10 M-22 -2 Q -12 -4 -6 0 M6 -10 Q 12 -14 22 -12" /></g>;
    case 'heart':
      return <g {...s}><path d="M0 26 C -20 12 -32 2 -32 -10 C -32 -22 -22 -28 -14 -28 C -7 -28 -2 -24 0 -19 C 2 -24 7 -28 14 -28 C 22 -28 32 -22 32 -10 C 32 2 20 12 0 26 Z" /><path d="M2 -18 L-6 -4 L4 2 L-4 16" /></g>;
    case 'star':
      return <g {...s}><path d="M0 -30 L9 -10 L30 -9 L14 5 L19 27 L0 15 L-19 27 L-14 5 L-30 -9 L-9 -10 Z" /></g>;
  }
};
export const StarShape: React.FC<{ r: number; fill?: string; stroke?: string; sw?: number; style?: React.CSSProperties }> = ({ r, fill = 'none', stroke = 'none', sw = 3, style }) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5; const rr = i % 2 === 0 ? r : r * 0.45;
    pts.push(`${Math.cos(a) * rr},${Math.sin(a) * rr}`);
  }
  return <polygon points={pts.join(' ')} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" style={style} />;
};
