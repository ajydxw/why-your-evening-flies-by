import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BF, C, EI, EO, FONT, FPS, glow, tw } from '../../lib';
import { Hub, nodeXY, zoomAt } from '../../components/Hub';
import { Character } from '../../components/Character';

/* 举例收尾（第 94–96 拍）：光标跌穿谷底 → “明知道在亏，为什么就是停不下来？” → 镜头钻进小人眉心，进入大脑 */

export const Bridge: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const h = nodeXY(3);
  const back = tw(f, BF(94), BF(94) + 8, 3, 1, EO);
  const crash = tw(f, BF(94.55), BF(95.1), 0, 1, EI);
  const q = tw(f, BF(94.3), BF(94.3) + 7, 0, 1, EO);
  const close = f >= BF(95);
  const forehead = { x: 1012, y: 500 };
  const zoom = 1 + 15 * tw(f, BF(95.3), BF(96), 0, 1, EI) ** 1.5;
  const flash = tw(f, BF(96) - 4, BF(96), 0, 1, EI);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: '#040210' }}>
      {!close && (
        <AbsoluteFill style={zoomAt(h.x, h.y, back)}>
          <Hub f={f} stage={4} slideA={BF(94) + 4} slideB={BF(94.55)} labelAt={1e9} crash={crash} dim={tw(f, BF(94.25), BF(94.25) + 6, 0, 0.8)} />
        </AbsoluteFill>
      )}
      {close && (
        <AbsoluteFill style={zoomAt(forehead.x, forehead.y, zoom)}>
          <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 52% 46%, #1A0F4A 0%, #07031A 60%)' }} />
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <Character x={736} y={1266} scale={2.8} t={t} chair={false} wind={0.5} id="head" handN={{ x: 40, y: 10 }} handF={{ x: 20, y: 14 }} />
            {/* 眉心的光点 */}
            <circle cx={forehead.x} cy={forehead.y} r={10 + 6 * Math.sin(f)} fill="#fff" style={{ filter: `drop-shadow(0 0 18px ${C.cyan})` }} />
          </svg>
        </AbsoluteFill>
      )}
      {close && (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, opacity: tw(f, BF(95.3), BF(95.6), 0, 1) }}>
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2, r0 = 200 + ((f * 40 + i * 53) % 500), r1 = r0 + 160;
            return <line key={i} x1={960 + Math.cos(a) * r0} y1={540 + Math.sin(a) * r0} x2={960 + Math.cos(a) * r1} y2={540 + Math.sin(a) * r1} stroke={i % 3 ? C.cyan : C.pink} strokeWidth={3} opacity={0.6} />;
          })}
        </svg>
      )}
      {q > 0 && (
        <div style={{ position: 'absolute', left: 0, width: 1920, top: close ? 110 : 330, textAlign: 'center', opacity: close ? 1 - tw(f, BF(95.5), BF(95.9), 0, 1) : q,
          transform: `scale(${close ? 0.8 : 1.4 - 0.4 * q})` }}>
          <div style={{ fontWeight: 900, fontSize: 72, lineHeight: '100px', color: '#fff', textShadow: glow(C.pink, 0.5) }}>明知道在亏，</div>
          <div style={{ fontWeight: 900, fontSize: 88, lineHeight: '116px', color: '#fff', textShadow: glow(C.pink, 0.8) }}>为什么就是<span style={{ color: C.pink }}>停不下来</span>？</div>
        </div>
      )}
      {flash > 0 && <AbsoluteFill style={{ background: '#E8FDFF', opacity: flash }} />}
    </AbsoluteFill>
  );
};
