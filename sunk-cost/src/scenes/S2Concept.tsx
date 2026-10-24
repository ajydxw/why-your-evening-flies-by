import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { BF, C, EBACK, EI, EIO, EO, FONT, FPS, curveG, fadeIn, fadeOut, glow, popIn, shake, tw } from '../lib';
import { Character } from '../components/Character';
import { Icon, IconName, StarShape } from '../components/Icons';

/* ============================================================
   第二段 · 亮出知识点（11.57 – 22.98s，第 5–8 小节）
   深渊定格 + 灵魂拷问 → 碎片倒吸、标题砸屏 + 一句话定义 → 文字化成图标、弯成倒 U 曲线 → 三枚印章 + “你在这”
   ============================================================ */

const TITLE = ['沉', '没', '成', '本', '谬', '误'];
const TX = (i: number) => 960 + (i - 2.5) * 210, TY = 430;
const ICONS: { name: IconName; u: number; col: string }[] = [
  { name: 'yuan', u: 0.1, col: C.cyan }, { name: 'clock', u: 0.28, col: C.cyan },
  { name: 'takeout', u: 0.58, col: C.pink }, { name: 'ticket', u: 0.7, col: C.pink },
  { name: 'books', u: 0.82, col: C.pink }, { name: 'heart', u: 0.95, col: C.pink },
];
const CX = (u: number) => 260 + u * 1180;
const CY = (u: number) => 820 - 480 * curveG(u);
const LINE_Y = 600;

type Frag = { kind: 'shard' | 'glass' | 'token' | 'digit'; x: number; y: number; vx: number; vy: number; rot: number; s: number; target: number; ch?: string };
const FRAGS: Frag[] = Array.from({ length: 54 }, (_, i) => {
  const kinds: Frag['kind'][] = ['shard', 'glass', 'token', 'digit'];
  const a = random('fa' + i) * Math.PI * 2, r = 260 + random('fr' + i) * 640;
  let x = 960 + Math.cos(a) * r * 1.15, y = 520 + Math.sin(a) * r * 0.62;
  // 中间留给“灵魂拷问”文字：落在文字区的碎片推到上下两侧
  if (x > 360 && x < 1560 && y > 290 && y < 600) y = y < 445 ? 250 - random('py' + i) * 150 : 640 + random('py' + i) * 160;
  return {
    kind: kinds[i % 4], x, y,
    vx: (random('fvx' + i) - 0.5) * 120, vy: -80 - random('fvy' + i) * 160, rot: random('fro' + i) * 360,
    s: 0.7 + random('fs' + i) * 0.9, target: i % 6, ch: ['2', '3', ':', '0', '5', '1'][i % 6],
  };
});

const FragView: React.FC<{ fr: Frag; x: number; y: number; rot: number; op: number; sc: number }> = ({ fr, x, y, rot, op, sc }) => {
  const s = fr.s * sc;
  const tr = `translate(${x} ${y}) rotate(${rot}) scale(${s})`;
  if (fr.kind === 'shard') return <g transform={tr} opacity={op}><polygon points="0,-26 12,4 -6,18 -14,-2" fill={C.gold} stroke="#FFF3C4" strokeWidth={2} /></g>;
  if (fr.kind === 'glass') return <g transform={tr} opacity={op}><polygon points="0,-30 20,16 -16,10" fill={`${C.cyan}55`} stroke={C.cyan} strokeWidth={2.5} /></g>;
  if (fr.kind === 'token') return <g transform={tr} opacity={op}><text x={0} y={12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={C.red}>−1★</text></g>;
  return <g transform={tr} opacity={op}><text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill="none" stroke={C.cyan} strokeWidth={2}>{fr.ch}</text></g>;
};

export const S2Concept: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const fz = f - BF(16);                      // 定格开始后的帧数
  const converge = tw(f, BF(19), BF(20), 0, 1, EI);
  const titleOn = f >= BF(20);
  const toIcons = f >= BF(24);
  const spread = tw(f, BF(25), BF(25) + 10, 0, 1, EIO);
  const bend = f < BF(26) ? 0 : f < BF(27) ? 0.55 * tw(f, BF(26), BF(26) + 8, 0, 1, EBACK) : 0.55 + 0.45 * tw(f, BF(27), BF(27) + 8, 0, 1, EBACK);
  const lineDraw = tw(f, BF(25), BF(25) + 12, 0, 1, EO);
  const gridOn = tw(f, BF(24), BF(25), 0, 1, EO);
  // 镜头抖动
  const sh = shake(f, BF(20), 14, 18, 's20');
  const sh2 = shake(f, BF(19), 5, 8, 's19');
  let stamps = { x: 0, y: 0 };
  [28, 29, 30].forEach((n) => { const s = shake(f, BF(n), 5, 7, 'st' + n); stamps.x += s.x; stamps.y += s.y; });
  [26, 27].forEach((n) => { const s = shake(f, BF(n), 5, 5, 'gr' + n); stamps.x += s.x; stamps.y += s.y; });
  const camX = sh.x + sh2.x + stamps.x, camY = sh.y + sh2.y + stamps.y;
  const pushIn = f < BF(20) ? 1 + tw(f, BF(16), BF(19), 0, 0.03) : 1;

  return (
    <AbsoluteFill style={{ background: C.bg0, fontFamily: FONT, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${camX}px, ${camY}px) scale(${pushIn})`, transformOrigin: '960px 540px' }}>
        {/* 背景：深渊 → 全息网格空间 */}
        <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 46%, #2C0E60 0%, #10062C 45%, #040210 100%)' }} />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 70 }, (_, i) => (
            <circle key={i} cx={random('bx' + i) * 1920} cy={(((random('by' + i) * 1080 - f * 0.3 * random('bv' + i)) % 1080) + 1080) % 1080}
              r={1 + random('br' + i) * 1.8} fill={i % 3 ? '#9FA8FF' : C.pink} opacity={0.25 + 0.35 * random('bo' + i)} />
          ))}
          {gridOn > 0 && (
            <g stroke={C.cyan} strokeOpacity={0.12 * gridOn} strokeWidth={1.5}>
              {Array.from({ length: 25 }, (_, i) => <line key={i} x1={960 + (i - 12) * 40} y1={600} x2={960 + (i - 12) * 220} y2={1080} />)}
              {[0, 30, 70, 130, 210, 320, 480].map((d, i) => <line key={'h' + i} x1={0} x2={1920} y1={600 + d} y2={600 + d} />)}
            </g>
          )}
        </svg>

        {/* 定格的小人（继续往下坠，倒吸时被甩出画面） */}
        {f < BF(20) && (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <Character x={1040 + Math.min(fz, 4) * 6} y={800 + (fz < 4 ? fz * 22 : 88) + tw(f, BF(19), BF(20), 0, 600, EI)} rot={-58 + Math.sin(f / 20) * 1.5} scale={0.62}
              t={fz < 4 ? t : BF(16) / FPS + 4 / FPS} tired={1} wind={fz < 4 ? 1.6 : 0.15} angry={0.2} id="fall"
              kneeN={{ x: 120, y: -50 }} footN={{ x: 160, y: 40 }} kneeF={{ x: 96, y: 10 }} footF={{ x: 50, y: 110 }}
              handN={{ x: 120, y: -330 }} handF={{ x: -40, y: -320 }} opacity={1 - converge} />
          </svg>
        )}

        {/* 碎片：先定格悬停，第 19 拍被倒吸回中心 */}
        {f < BF(20) + 1 && (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {FRAGS.map((fr, i) => {
              const stop = 1 - Math.exp(-Math.max(0, fz) / 3);   // 时间骤停：速度迅速衰减为 0
              const x0 = fr.x + fr.vx * stop * 0.25 + Math.sin(f / 30 + i) * 2;
              const y0 = fr.y + fr.vy * stop * 0.25 + Math.cos(f / 26 + i) * 2;
              const tx = TX(fr.target) + (random('ox' + i) - 0.5) * 60, ty = TY + (random('oy' + i) - 0.5) * 60;
              const k = converge;
              const x = x0 + (tx - x0) * k, y = y0 + (ty - y0) * k;
              const kp = tw(f - 2, BF(19), BF(20), 0, 1, EI);
              const px = x0 + (tx - x0) * kp, py = y0 + (ty - y0) * kp;
              const op = 0.85 * (1 - tw(f, BF(20) - 2, BF(20), 0, 1));
              return (
                <g key={i}>
                  {k > 0.05 && <line x1={px} y1={py} x2={x} y2={y} stroke={fr.kind === 'glass' || fr.kind === 'digit' ? C.cyan : C.gold} strokeWidth={3} opacity={op * 0.8} strokeLinecap="round" />}
                  <FragView fr={fr} x={x} y={y} rot={fr.rot + f * 0.3 + k * 360} op={op} sc={1 - k * 0.5} />
                </g>
              );
            })}
          </svg>
        )}

        {/* 定格 UI：取景框 + 暂停标签 + 灵魂拷问 */}
        {f < BF(19) + 6 && (
          <AbsoluteFill style={{ opacity: f >= BF(19) ? fadeOut(f, BF(19), 5) : fadeIn(f, BF(16) + 3, 5) }}>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
              {[[72, 72, 1, 1], [1848, 72, -1, 1], [72, 1008, 1, -1], [1848, 1008, -1, -1]].map(([x, y, sx, sy], i) => (
                <path key={i} d={`M${x} ${y + sy * 70} V${y} H${x + sx * 70}`} stroke={C.white} strokeWidth={4} fill="none" opacity={0.7} />
              ))}
            </svg>
            <div style={{ position: 'absolute', left: 110, top: 104, padding: '6px 18px', borderRadius: 10, border: `2px solid ${C.cyan}`, color: C.cyan,
              fontWeight: 900, fontSize: 32, lineHeight: '42px', background: 'rgba(10,30,50,0.6)' }}>❚❚ 先暂停一下</div>
            <div style={{ position: 'absolute', left: 0, width: 1920, top: 330, textAlign: 'center' }}>
              {f >= BF(17) && (
                <div style={{ display: 'inline-block', fontWeight: 900, fontSize: 64, lineHeight: '88px', color: C.white, textShadow: '0 0 18px #000, 0 0 40px #000',
                  transform: `translateY(${(1 - popIn(f, BF(17), 8)) * 30}px)`, opacity: fadeIn(f, BF(17), 5) }}>明明 23:00 就能去睡</div>
              )}
            </div>
            <div style={{ position: 'absolute', left: 0, width: 1920, top: 440, textAlign: 'center' }}>
              {f >= BF(18) && (
                <div style={{ display: 'inline-block', fontWeight: 900, fontSize: 96, lineHeight: '124px', color: C.gold, textShadow: `0 0 20px #000, ${glow(C.gold, 0.7)}`,
                  transform: `scale(${0.7 + 0.3 * popIn(f, BF(18), 8)})` }}>为什么偏要「再来一把」？</div>
              )}
            </div>
          </AbsoluteFill>
        )}

        {/* 闪电 */}
        {f >= BF(19) && f < BF(19) + 14 && (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {[[C.gold, 'M180 -20 L520 220 L430 260 L760 400 L690 430 L930 520', 0], [C.cyan, 'M1760 -20 L1420 230 L1510 270 L1180 400 L1260 440 L990 520', 2]].map(([col, d, dl], i) => {
              const k = f - BF(19) - (dl as number);
              const op = k < 0 ? 0 : k < 3 ? 1 : k < 5 ? 0.3 : k < 7 ? 0.9 : Math.max(0, 1 - (k - 7) / 6);
              return (
                <g key={i} opacity={op}>
                  <path d={d as string} stroke={col as string} strokeWidth={30} fill="none" opacity={0.35} strokeLinejoin="bevel" />
                  <path d={d as string} stroke={col as string} strokeWidth={12} fill="none" opacity={0.8} strokeLinejoin="bevel" />
                  <path d={d as string} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinejoin="bevel" style={{ filter: `drop-shadow(0 0 14px ${col})` }} />
                </g>
              );
            })}
          </svg>
        )}

        {/* 标题：沉没成本谬误 */}
        {titleOn && <Title f={f} />}

        {/* 冲击波 */}
        {f >= BF(20) && f < BF(20) + 24 && (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {[0, 5].map((d, i) => {
              const k = tw(f, BF(20) + d, BF(20) + d + 18, 0, 1, EO);
              return <ellipse key={i} cx={960} cy={TY} rx={60 + 1100 * k} ry={30 + 520 * k} fill="none" stroke={i ? C.cyan : C.gold} strokeWidth={14 * (1 - k)} opacity={1 - k} />;
            })}
            {Array.from({ length: 40 }, (_, i) => {
              const k = tw(f, BF(20), BF(20) + 22, 0, 1, EO);
              const a = random('da' + i) * Math.PI * 2, r = 100 + k * (400 + random('dr' + i) * 600);
              return <circle key={i} cx={960 + Math.cos(a) * r * 1.3} cy={TY + Math.sin(a) * r * 0.7} r={3 + (1 - k) * 4} fill={i % 2 ? C.gold : '#FFFFFF'} opacity={1 - k} />;
            })}
          </svg>
        )}

        {/* 一句话定义 */}
        {f >= BF(21) && f < BF(24) + 8 && <Definition f={f} />}

        {/* 倒 U 曲线 */}
        {toIcons && <CurveStage f={f} spread={spread} bend={bend} lineDraw={lineDraw} />}
      </AbsoluteFill>

      {/* 定格时的去色暗角 */}
      {f < BF(19) && <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)', opacity: tw(f, BF(16), BF(16) + 6, 0, 1) }} />}
      {/* 闪白 */}
      <AbsoluteFill style={{ background: '#FFFFFF', opacity: Math.max(fadeOut(f, BF(16), 7) * (f >= BF(16) ? 1 : 0), f >= BF(20) ? 0.85 * fadeOut(f, BF(20), 8) : 0, f >= BF(19) && f < BF(19) + 3 ? 0.35 : 0) }} />
    </AbsoluteFill>
  );
};

/* ---------- 3D 发光标题 ---------- */
const Title: React.FC<{ f: number }> = ({ f }) => {
  const out = f >= BF(24) ? tw(f, BF(24), BF(24) + 6, 0, 1, EI) : 0;
  const float = Math.sin(f / 18) * 4;
  const ext = Array.from({ length: 12 }, (_, k) => `${k + 1}px ${k + 1}px 0 ${['#A8640A', '#9A5808', '#8C4E06', '#7E4405', '#703B04', '#633303'][Math.min(5, Math.floor(k / 2))]}`).join(', ');
  return (
    <AbsoluteFill>
      {/* 呼吸辉光 */}
      <div style={{ position: 'absolute', left: 300, top: TY - 170, width: 1320, height: 340, borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${C.gold}40 0%, ${C.gold}00 70%)`, opacity: (0.6 + 0.4 * Math.sin(f / 7)) * (1 - out) }} />
      {TITLE.map((ch, i) => {
        const k = popIn(f, BF(20) + i * 1.2, 10);
        const sc = (1.8 - 0.8 * k) * (1 + out * 0.4);
        const style: React.CSSProperties = { position: 'absolute', left: TX(i) - 110, top: TY - 120 + float, width: 220, height: 240, textAlign: 'center',
          fontWeight: 900, fontSize: 196, lineHeight: '240px', transform: `scale(${sc})`, opacity: Math.min(1, k * 1.4) * (1 - out) };
        return (
          <React.Fragment key={i}>
            <div style={{ ...style, color: '#B86E0C', textShadow: `${ext}, 0 0 60px ${C.gold}88` }}>{ch}</div>
            <div style={{ ...style, backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #FFF1BF 38%, #FFC83D 70%, #FF9D1C 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 16px ${C.gold})` }}>{ch}</div>
          </React.Fragment>
        );
      })}

      <div style={{ position: 'absolute', left: 0, width: 1920, top: TY + 132, textAlign: 'center', fontWeight: 900, fontSize: 40, lineHeight: '48px', color: C.cyan,
        letterSpacing: tw(f, BF(20) + 4, BF(20) + 16, 34, 16, EO), opacity: fadeIn(f, BF(20) + 4, 6) * (1 - out), textShadow: glow(C.cyan, 0.5) }}>SUNK COST FALLACY</div>
    </AbsoluteFill>
  );
};

/* ---------- 定义卡 ---------- */
const Definition: React.FC<{ f: number }> = ({ f }) => {
  const k = tw(f, BF(21), BF(21) + 8, 0, 1, EO);
  const k2 = tw(f, BF(21) + 4, BF(21) + 12, 0, 1, EO);
  const out = f >= BF(24) ? fadeOut(f, BF(24), 6) : 1;
  const row = (kk: number, tag: string, col: string, text: string, top: number) => (
    <div style={{ position: 'absolute', left: 0, width: 1920, top, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20,
      opacity: kk, transform: `translateY(${(1 - kk) * 24}px)` }}>
      <span style={{ padding: '2px 16px', borderRadius: 10, background: col, color: C.ink, fontWeight: 900, fontSize: 36, lineHeight: '52px' }}>{tag}</span>
      <span style={{ color: C.white, fontWeight: 700, fontSize: 44, lineHeight: '60px' }}>{text}</span>
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: 'absolute', left: 460, width: 1000, top: 662, height: 156, borderRadius: 20, background: 'rgba(8,4,26,0.72)', border: `1.5px solid ${C.gold}55`, opacity: k }} />
      {row(k, '沉没成本', C.gold, '已经付出、怎么都收不回的投入', 680)}
      {row(k2, '谬误', C.pink, '为了“不白费”它，继续做不划算的事', 752)}
    </AbsoluteFill>
  );
};

/* ---------- 图标排队 → 弯成倒 U 曲线 → 印章 ---------- */
const CurveStage: React.FC<{ f: number; spread: number; bend: number; lineDraw: number }> = ({ f, spread, bend, lineDraw }) => {
  const yAt = (u: number) => LINE_Y + (CY(u) - LINE_Y) * bend;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) { const u = i / 120; if (u > lineDraw) break; pts.push(`${CX(u)},${yAt(u)}`); }
  const axes = tw(f, BF(26), BF(26) + 10, 0, 1, EO);
  const st = (n: number) => (f >= BF(n) ? tw(f, BF(n), BF(n) + 6, 0, 1, EO) : 0);
  const stS = (n: number) => 1.7 - 0.7 * st(n);
  const s1 = st(28), s2 = st(29), s3 = st(30);
  const peakX = CX(0.45), peakY = yAt(0.45);
  const pinK = f >= BF(31) ? tw(f, BF(31) - 6, BF(31), 0, 1, EI) : 0;
  const pinB = f >= BF(31) ? popIn(f, BF(31), 10) : 0;
  const pinU = 0.58, pinX = CX(pinU), pinY = yAt(pinU);
  const header = fadeIn(f, BF(25), 8);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, width: 1920, top: 64, textAlign: 'center', opacity: header }}>
        <span style={{ fontWeight: 900, fontSize: 44, lineHeight: '56px', color: C.gold, textShadow: glow(C.gold, 0.45), letterSpacing: 6 }}>沉没成本谬误</span>
        <span style={{ fontWeight: 700, fontSize: 26, color: C.dim, marginLeft: 20, letterSpacing: 4 }}>收益曲线</span>
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="cg" x1="260" x2="1440" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.cyan} /><stop offset="0.4" stopColor={C.cyan} /><stop offset="0.47" stopColor={C.gold} /><stop offset="0.56" stopColor={C.pink} /><stop offset="1" stopColor={C.red} />
          </linearGradient>
          <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="rgba(245,242,255,0.7)" /></marker>
        </defs>
        {/* 坐标轴 */}
        <g opacity={axes}>
          <line x1={230} y1={870} x2={230 + 1240 * axes} y2={870} stroke="rgba(245,242,255,0.6)" strokeWidth={3} markerEnd="url(#arr)" />
          <line x1={230} y1={870} x2={230} y2={870 - 600 * axes} stroke="rgba(245,242,255,0.6)" strokeWidth={3} markerEnd="url(#arr)" />
        </g>
        {/* 右侧断崖警示 */}
        {s3 > 0 && (
          <path d={`M${CX(0.5)} ${yAt(0.5)} ${Array.from({ length: 50 }, (_, i) => { const u = 0.5 + (i / 49) * 0.5; return `L${CX(u)} ${yAt(u)}`; }).join(' ')} L${CX(1)} 870 L${CX(0.5)} 870 Z`}
            fill={C.red} opacity={0.14 * s3 + 0.05 * Math.sin(f / 4) * s3} />
        )}
        {/* 黄金止损线 */}
        {s2 > 0 && (
          <line x1={peakX} y1={peakY - 20} x2={peakX} y2={peakY - 20 + (870 - peakY + 20) * s2} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" style={{ filter: `drop-shadow(0 0 8px ${C.gold})` }} />
        )}
        {pts.length > 1 && (
          <>
            <polyline points={pts.join(' ')} fill="none" stroke="url(#cg)" strokeWidth={22} opacity={0.25} strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={pts.join(' ')} fill="none" stroke="url(#cg)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {bend > 0.9 && Array.from({ length: 14 }, (_, i) => {
          const u = ((f - BF(27)) / 90 + i / 14) % 1;
          return <circle key={'fl' + i} cx={CX(u)} cy={yAt(u)} r={5} fill="#FFFFFF" opacity={0.75 * Math.sin(u * Math.PI)} style={{ filter: `drop-shadow(0 0 6px ${u < 0.45 ? C.cyan : C.pink})` }} />;
        })}
        {s2 > 0 && <circle cx={peakX} cy={peakY} r={12 + 4 * Math.sin(f / 4)} fill={C.gold} style={{ filter: `drop-shadow(0 0 12px ${C.gold})` }} />}
        {/* 图标节点 */}
        {ICONS.map((ic, i) => {
          const born = popIn(f, BF(24) + i, 9);
          const lx = CX(ic.u), ly = yAt(ic.u);
          const x = TX(i) + (lx - TX(i)) * spread, y = TY + (ly - TY) * spread;
          const hot = i >= 2 && s3 > 0 ? 0.5 + 0.5 * Math.sin(f / 3 + i) : 0;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${born})`}>
              <circle r={46} fill="#0C0628" stroke={ic.col} strokeWidth={3} style={{ filter: `drop-shadow(0 0 ${10 + hot * 10}px ${ic.col})` }} />
              <Icon name={ic.name} color={ic.col} sw={3.5} />
            </g>
          );
        })}
        {/* 碎字爆散的火花 */}
        {f < BF(24) + 14 && TITLE.map((_, i) => Array.from({ length: 8 }, (_, j) => {
          const k = tw(f, BF(24) + i, BF(24) + i + 14, 0, 1, EO);
          const a = (j / 8) * Math.PI * 2 + i;
          return <circle key={`${i}-${j}`} cx={TX(i) + Math.cos(a) * 120 * k} cy={TY + Math.sin(a) * 120 * k} r={4 * (1 - k)} fill={C.gold} opacity={1 - k} />;
        }))}
      </svg>
      {/* 轴标签 */}
      <div style={{ position: 'absolute', left: 1240, top: 884, width: 220, textAlign: 'right', opacity: axes, color: C.dim, fontWeight: 700, fontSize: 28 }}>继续投入 →</div>
      <div style={{ position: 'absolute', left: 250, top: 262, opacity: axes, color: C.dim, fontWeight: 700, fontSize: 28 }}>实际收益</div>
      {/* 三枚印章 */}
      {s1 > 0 && (
        <div style={{ position: 'absolute', left: 300, top: 312, padding: '10px 22px', borderRadius: 14, border: `3px solid ${C.cyan}`, background: 'rgba(6,30,46,0.82)',
          transform: `scale(${stS(28)}) rotate(-4deg)`, opacity: s1, boxShadow: `0 0 20px ${C.cyan}66` }}>
          <div style={{ color: C.cyan, fontWeight: 900, fontSize: 40, lineHeight: '50px' }}>清醒投入期</div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 28, lineHeight: '38px' }}>及时收手，见好就收</div>
        </div>
      )}
      {s2 > 0 && (
        <div style={{ position: 'absolute', left: peakX - 150, top: peakY - 112, width: 300, textAlign: 'center', transform: `scale(${stS(29)})`, opacity: s2 }}>
          <span style={{ display: 'inline-block', padding: '4px 20px', borderRadius: 12, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 40, lineHeight: '56px', boxShadow: `0 0 24px ${C.gold}` }}>黄金止损线</span>
        </div>
      )}
      {s3 > 0 && (
        <div style={{ position: 'absolute', left: 1090, top: 300, padding: '10px 22px', borderRadius: 14, border: `3px solid ${C.pink}`, background: 'rgba(46,4,30,0.84)',
          transform: `scale(${stS(30)}) rotate(3deg)`, opacity: s3, boxShadow: `0 0 20px ${C.pink}66` }}>
          <div style={{ color: C.pink, fontWeight: 900, fontSize: 40, lineHeight: '50px' }}>死磕区</div>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 28, lineHeight: '38px' }}>为了回本，搭上全部！</div>
        </div>
      )}
      {/* “你在这” 落点 */}
      {pinK > 0 && (
        <div style={{ position: 'absolute', left: pinX - 70, top: pinY - 132 - (1 - pinK) * 500 + (1 - pinB) * -14, width: 140, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '2px 16px', borderRadius: 12, background: C.pink, color: '#fff', fontWeight: 900, fontSize: 32, lineHeight: '48px', boxShadow: `0 0 20px ${C.pink}` }}>你在这</div>
          <svg width={140} height={30} style={{ display: 'block' }}><path d="M58 0 L82 0 L70 22 Z" fill={C.pink} /></svg>
        </div>
      )}
    </AbsoluteFill>
  );
};