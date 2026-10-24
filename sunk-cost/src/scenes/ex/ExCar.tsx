import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BF, C, EI, EIO, EO, FONT, FPS, glow, shake, tw } from '../../lib';
import { Character } from '../../components/Character';
import { Hi, Rant, ScenePill, pk } from '../../components/UI';

/* 痛点 04 · 爱都爱了（第 81–94 拍）
   用自己的粉色围巾当纤绳，拉一辆掉了轮子、冒黑烟、往悬崖倒溜的破车 → 颤抖的独白 → 围巾快被扯断
   → 全屏总结：为了挽回 10%，献祭余生的 90% */

const CLIFF = 200;
const groundY = (x: number) => 860 - (x - CLIFF) * 0.1;
const SLOPE = (Math.atan(-0.1) * 180) / Math.PI;
const JERKS: [number, number][] = [[83, 14], [85, 16], [87, 46], [89, 24], [91, 30], [92.5, 18]];
const rot = (x: number, y: number, deg: number) => { const a = (deg * Math.PI) / 180; return { x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a) }; };

export const ExCar: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  let slide = 12 * tw(f, BF(81), BF(94), 0, 1);
  JERKS.forEach(([n, d]) => { slide += d * tw(f, BF(n), BF(n) + 6, 0, 1, EO); });
  const carX = 600 - slide;
  const carY = groundY(carX);
  const lean = 28 + 3 * Math.sin(t * 6);
  const hipX = carX + 650, hipY = groundY(hipX) - 205;
  const strain = f >= BF(87) ? 1 : tw(f, BF(83), BF(87), 0.3, 0.7);
  let cam = { x: 0, y: 0 };
  JERKS.forEach(([n, d]) => { const s = shake(f, BF(n), 7, d * 0.4, 'cj' + n); cam.x += s.x; cam.y += s.y; });
  // 绳子两端
  const nk = rot(24, -198, lean); const neck = { x: hipX + nk.x, y: hipY + nk.y };
  const hk = rot(205, -105, SLOPE); const hook = { x: carX + hk.x, y: carY + hk.y };
  const vib = Math.sin(f * 3.1) * 3 * strain;
  const midX = (neck.x + hook.x) / 2, midY = (neck.y + hook.y) / 2 + 26 * (1 - strain) + vib;
  const fray = tw(f, BF(87), BF(89), 0, 1, EO);
  const wheelFall = tw(f, BF(89), BF(90), 0, 1, EI);
  const sum = tw(f, BF(90), BF(90) + 7, 0, 1, EO);
  const burn = tw(f, BF(91.5), BF(93), 0, 1, EIO);
  const alarm = f >= BF(87) ? 0.5 + 0.5 * Math.sin(t * 16) : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', background: C.bg0 }}>
      <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(1.03)`, transformOrigin: '900px 600px' }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, #2A0626 0%, #3A0A2A 45%, #120414 100%)' }} />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {/* 远山 */}
          <path d="M0 620 L180 520 L360 600 L560 470 L760 590 L980 500 L1200 610 L1420 520 L1660 600 L1920 540 L1920 1080 L0 1080 Z" fill="#1E0520" opacity={0.8} />
          {/* 深渊 */}
          <rect x={0} y={860} width={CLIFF} height={220} fill="#050108" />
          <ellipse cx={80} cy={1080} rx={260} ry={120} fill={C.red} opacity={0.25 + 0.1 * Math.sin(t * 4)} />
          {/* 斜坡 */}
          <path d={`M${CLIFF} 860 L1920 ${groundY(1920)} L1920 1080 L${CLIFF} 1080 Z`} fill="#140412" />
          <line x1={CLIFF} y1={860} x2={1920} y2={groundY(1920)} stroke={C.pink} strokeWidth={4} strokeOpacity={0.6} />
          <path d={`M${CLIFF} 860 L${CLIFF - 20} 920 L${CLIFF + 10} 980 L${CLIFF - 14} 1080`} stroke={C.pink} strokeWidth={3} fill="none" opacity={0.5} />
          {/* 鞋底拖痕 */}
          {slide > 10 && <line x1={hipX + 20} y1={groundY(hipX + 20) - 2} x2={hipX + 20 + slide} y2={groundY(hipX + 20 + slide) - 2} stroke={C.pink} strokeWidth={5} opacity={0.5} strokeDasharray="20 10" />}
          {/* 脱落的轮子 */}
          {(() => {
            const wx = 330 - wheelFall * 160, wy = groundY(330) - 40 + wheelFall * wheelFall * 400;
            return <g transform={`translate(${wx} ${wy}) rotate(${-wheelFall * 400})`}><circle r={38} fill="#0A0410" stroke="#6B5A7A" strokeWidth={8} /><circle r={10} fill="#6B5A7A" /></g>;
          })()}
          {/* 破车 */}
          <g transform={`translate(${carX} ${carY}) rotate(${SLOPE + Math.sin(f * 1.3) * 0.6})`}>
            <path d="M-210 -40 L-200 -140 L-120 -150 L-90 -230 L80 -230 L120 -150 L205 -130 L210 -40 Z" fill="#2A1A2E" stroke="#8A6A8A" strokeWidth={5} />
            <path d="M-80 -215 L-60 -160 L60 -160 L70 -215 Z" fill="#0A0410" stroke="#8A6A8A" strokeWidth={3} />
            <path d="M-40 -205 L-10 -180 L-30 -170" stroke="#C8B8D8" strokeWidth={3} fill="none" />
            <path d="M-170 -100 L-130 -80 L-150 -60" stroke="#6B5A7A" strokeWidth={4} fill="none" />
            <circle cx={130} cy={-30} r={40} fill="#0A0410" stroke="#6B5A7A" strokeWidth={8} />
            <rect x={-170} y={-50} width={80} height={14} fill="#0A0410" transform="rotate(14 -130 -43)" />
            {/* 车顶行李 */}
            <rect x={-150} y={-300} width={120} height={70} rx={8} fill="#3A0A30" stroke={C.pink} strokeWidth={3} />
            <rect x={-20} y={-310} width={110} height={80} rx={8} fill="#22103A" stroke="#B48CFF" strokeWidth={3} />
            <ellipse cx={150} cy={-262} rx={66} ry={26} fill="#C88A3A" stroke={C.gold} strokeWidth={3} />
          </g>
          {/* 黑烟 */}
          {Array.from({ length: 8 }, (_, i) => {
            const ph = ((t * 0.55 + i / 8) % 1);
            const x = carX - 215 - ph * 160 + Math.sin(ph * 6 + i) * 20, y = carY - 60 - ph * 420;
            return <circle key={i} cx={x} cy={y} r={30 + ph * 70} fill="#2A2032" opacity={0.8 * (1 - ph)} />;
          })}
          {/* 围巾纤绳 */}
          <path d={`M${neck.x} ${neck.y} Q ${midX} ${midY} ${hook.x} ${hook.y}`} stroke="#FF62B8" strokeWidth={16 - fray * 6} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 ${8 + strain * 10}px ${C.pink})` }} />
          {fray > 0 && Array.from({ length: 7 }, (_, i) => {
            const k = 0.42 + i * 0.025, x = neck.x + (hook.x - neck.x) * k, y = neck.y + (hook.y - neck.y) * k + 10;
            return <line key={i} x1={x} y1={y} x2={x + (random('fr' + i) - 0.5) * 30 * fray} y2={y + (10 + random('fy' + i) * 26) * fray} stroke="#FFD1EA" strokeWidth={2.5} />;
          })}
          {strain > 0.6 && [0, 1, 2].map((i) => <line key={'tl' + i} x1={midX - 40 + i * 30} y1={midY - 24} x2={midX - 50 + i * 30} y2={midY - 44} stroke="#fff" strokeWidth={3} opacity={0.4 + 0.4 * Math.sin(f + i)} />)}
          <Character x={hipX} y={hipY} t={t} chair={false} rot={lean} wind={1.4} angry={0.15} id="car"
            handN={{ x: 70, y: -175 }} handF={{ x: 52, y: -180 }} headTilt={-14}
            kneeN={{ x: 92, y: 70 }} footN={{ x: 136, y: 171 }} kneeF={{ x: -6, y: 112 }} footF={{ x: -30, y: 242 }} />
          {/* 汗 */}
          {Array.from({ length: 3 }, (_, i) => {
            const ph = ((t * 1.2 + i / 3) % 1);
            const p = rot(130, -270, lean);
            return <path key={'sw' + i} d="M0 -9 Q 6 2 0 7 Q -6 2 0 -9 Z" transform={`translate(${hipX + p.x + ph * 30} ${hipY + p.y + ph * 50})`} fill={C.cyan} opacity={1 - ph} />;
          })}
        </svg>
        {/* 行李标签（错开高度，用引线连到行李） */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {[[-90, -300, -190, -380, 81.6, C.pink], [35, -310, 20, -440, 82.2, '#B48CFF'], [150, -288, 250, -380, 82.8, C.gold]].map(([bx, by, lx, ly, at, col], i) => {
            const a = rot(bx as number, by as number, SLOPE), b = rot(lx as number, ly as number, SLOPE);
            const k = pk(f, BF(at as number), 8);
            return k > 0 ? <line key={i} x1={carX + a.x} y1={carY + a.y} x2={carX + a.x + (b.x - a.x) * Math.min(1, k)} y2={carY + a.y + (b.y - a.y) * Math.min(1, k)} stroke={col as string} strokeWidth={3} /> : null;
          })}
        </svg>
        {[['5 年青春', C.pink, -190, -380, 81.6], ['无数次妥协', '#B48CFF', 20, -440, 82.2], ['未兑现的大饼', C.gold, 250, -380, 82.8]].map(([txt, col, lx, ly, at]) => {
          const p = rot(lx as number, ly as number, SLOPE);
          return (
            <div key={txt as string} style={{ position: 'absolute', left: carX + p.x - 110, top: carY + p.y - 22, width: 220, textAlign: 'center', transform: `scale(${pk(f, BF(at as number), 8)})` }}>
              <span style={{ padding: '2px 12px', borderRadius: 8, background: 'rgba(20,4,20,0.92)', border: `2px solid ${col}`, color: col as string, fontWeight: 900, fontSize: 30, lineHeight: '42px', whiteSpace: 'nowrap' }}>{txt}</span>
            </div>
          );
        })}
      </AbsoluteFill>
      {alarm > 0 && <AbsoluteFill style={{ boxShadow: `inset 0 0 ${160 + alarm * 120}px ${C.red}`, opacity: 0.55 + 0.3 * alarm }} />}
      <Rant x={190} y={128} w={1080} f={f} k={pk(f, BF(84), 8) * (1 - tw(f, BF(89.6), BF(90), 0, 1))} tail="right" shakeAmp={1.6} size={56}
        lines={['我陪 TA 吃了那么多苦，', '现在放手，我不就全亏了吗？！']} />
      {/* 全屏总结 */}
      {sum > 0 && <AbsoluteFill style={{ background: `rgba(8,2,14,${0.82 * sum})` }} />}
      {sum > 0 && (
        <AbsoluteFill style={{ opacity: sum }}>
          <div style={{ position: 'absolute', left: 0, width: 1920, top: 180, textAlign: 'center', transform: `scale(${1.3 - 0.3 * sum})` }}>
            <div style={{ display: 'inline-block', padding: '2px 22px', borderRadius: 12, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 40, lineHeight: '60px', boxShadow: `0 0 26px ${C.gold}` }}>最高级的内耗</div>
            <div style={{ marginTop: 30, fontWeight: 900, fontSize: 66, lineHeight: '92px', color: '#fff' }}>为了挽回已经打水漂的 <Hi c="#B8B0CC">10%</Hi>，</div>
            <div style={{ fontWeight: 900, fontSize: 78, lineHeight: '104px', color: '#fff' }}>亲手献祭掉余生的 <Hi c={C.red}>90%</Hi>！</div>
          </div>
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <rect x={360} y={610} width={120} height={56} rx={10} fill="#5A5470" />
            <rect x={488} y={610} width={1072} height={56} rx={10} fill={C.gold} style={{ filter: `drop-shadow(0 0 16px ${C.gold})` }} />
            <rect x={488} y={610} width={1072 * burn} height={56} rx={10} fill={C.red} style={{ filter: `drop-shadow(0 0 20px ${C.red})` }} />
            {burn > 0 && burn < 1 && Array.from({ length: 10 }, (_, i) => {
              const ph = ((t * 2 + i / 10) % 1);
              return <circle key={i} cx={488 + 1072 * burn + (random('fl' + i) - 0.5) * 30} cy={610 - ph * 70} r={8 * (1 - ph)} fill={i % 2 ? C.gold : C.red} opacity={1 - ph} />;
            })}
          </svg>
          <div style={{ position: 'absolute', left: 300, top: 682, width: 240, textAlign: 'center', fontWeight: 700, fontSize: 28, color: '#B8B0CC' }}>打水漂的 10%</div>
          <div style={{ position: 'absolute', left: 488, top: 682, width: 1072, textAlign: 'center', fontWeight: 900, fontSize: 32, color: burn > 0.5 ? C.red : C.gold }}>{burn > 0.5 ? '余生 90% · 正在被献祭' : '余生 90%'}</div>
        </AbsoluteFill>
      )}
      <ScenePill k={tw(f, BF(81) + 4, BF(81) + 12, 0, 1, EO) * (1 - sum)} num="痛点 04" text="爱都爱了" />
    </AbsoluteFill>
  );
};
