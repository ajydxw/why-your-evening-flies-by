import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { C, EBACK, EI, EIO, EO, FONT, curveG, glow, tw } from '../lib';
import { Icon, IconName } from './Icons';

/* 倒 U 曲线“总控台”：几何参数与第二段 S2Concept 完全一致，保证镜头拉回时画面无缝衔接。
   每个痛点开始前回到这里：光标滑到下一个节点 → 口头禅标签砸下 → 镜头钻进节点。 */

export const CX = (u: number) => 260 + u * 1180;
export const CY = (u: number) => 820 - 480 * curveG(u);
export const NODES: { u: number; icon: IconName; label: string }[] = [
  { u: 0.58, icon: 'takeout', label: '买都买了' },
  { u: 0.7, icon: 'ticket', label: '来都来了' },
  { u: 0.82, icon: 'books', label: '学都学了' },
  { u: 0.95, icon: 'heart', label: '爱都爱了' },
];
export const nodeXY = (i: number) => ({ x: CX(NODES[i].u), y: CY(NODES[i].u) });
const PILL_POS = [{ x: 800, y: 500 }, { x: 930, y: 690 }, { x: 1070, y: 800 }, { x: 1225, y: 828 }];   // 放在曲线下方，避开“你在这”的移动路径
const BIG = { x: 1010, y: 166 };

export const HubBG: React.FC<{ f: number; tint?: string }> = ({ f, tint = '#2C0E60' }) => (
  <>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 46%, ${tint} 0%, #10062C 45%, #040210 100%)` }} />
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: 70 }, (_, i) => (
        <circle key={i} cx={random('bx' + i) * 1920} cy={(((random('by' + i) * 1080 - f * 0.3 * random('bv' + i)) % 1080) + 1080) % 1080}
          r={1 + random('br' + i) * 1.8} fill={i % 3 ? '#9FA8FF' : C.pink} opacity={0.25 + 0.35 * random('bo' + i)} />
      ))}
      <g stroke={C.cyan} strokeOpacity={0.12} strokeWidth={1.5}>
        {Array.from({ length: 25 }, (_, i) => <line key={i} x1={960 + (i - 12) * 40} y1={600} x2={960 + (i - 12) * 220} y2={1080} />)}
        {[0, 30, 70, 130, 210, 320, 480].map((d, i) => <line key={'h' + i} x1={0} x2={1920} y1={600 + d} y2={600 + d} />)}
      </g>
    </svg>
  </>
);

type HubProps = {
  f: number;
  stage: number;        // 当前要引出的节点序号 0..3；4 = 收尾（光标跌穿谷底）
  slideA: number; slideB: number; // 光标从上一个节点滑到当前节点的帧区间
  labelAt: number;      // 大标签砸下的帧
  crash?: number;       // 0..1 跌穿谷底进度（stage=4 时使用）
  dim?: number;         // 0..1 整体压暗
};

export const Hub: React.FC<HubProps> = ({ f, stage, slideA, slideB, labelAt, crash = 0, dim = 0 }) => {
  // 光标位置
  const fromU = stage === 0 ? 0.45 : NODES[Math.min(stage, 4) - 1].u;
  const toU = stage >= 4 ? 1.0 : NODES[stage].u;
  const u = fromU + (toU - fromU) * tw(f, slideA, slideB, 0, 1, EIO);
  let px = CX(u), py = CY(u);
  if (stage >= 4) { py += crash * crash * 420; px += crash * 40; }
  const lab = f >= labelAt ? tw(f, labelAt, labelAt + 8, 0, 1, EBACK) : 0;
  const ring = f >= labelAt ? tw(f, labelAt, labelAt + 16, 0, 1, EO) : 0;
  const cur = stage < 4 ? nodeXY(stage) : null;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) { const uu = i / 120; pts.push(`${CX(uu)},${CY(uu)}`); }
  const crackK = stage >= 4 ? tw(crash, 0.05, 0.35, 0, 1, EO) : 0;
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <HubBG f={f} />
      <div style={{ position: 'absolute', left: 0, width: 1920, top: 64, textAlign: 'center' }}>
        <span style={{ fontWeight: 900, fontSize: 44, lineHeight: '56px', color: C.gold, textShadow: glow(C.gold, 0.45), letterSpacing: 6 }}>沉没成本谬误</span>
        <span style={{ fontWeight: 700, fontSize: 26, color: C.dim, marginLeft: 20, letterSpacing: 4 }}>收益曲线</span>
      </div>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <linearGradient id="hcg" x1="260" x2="1440" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={C.cyan} /><stop offset="0.4" stopColor={C.cyan} /><stop offset="0.47" stopColor={C.gold} /><stop offset="0.56" stopColor={C.pink} /><stop offset="1" stopColor={C.red} />
          </linearGradient>
          <marker id="harr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="rgba(245,242,255,0.7)" /></marker>
        </defs>
        <line x1={230} y1={870} x2={1470} y2={870} stroke="rgba(245,242,255,0.6)" strokeWidth={3} markerEnd="url(#harr)" />
        <line x1={230} y1={870} x2={230} y2={270} stroke="rgba(245,242,255,0.6)" strokeWidth={3} markerEnd="url(#harr)" />
        <path d={`M${CX(0.5)} ${CY(0.5)} ${Array.from({ length: 50 }, (_, i) => { const uu = 0.5 + (i / 49) * 0.5; return `L${CX(uu)} ${CY(uu)}`; }).join(' ')} L${CX(1)} 870 L${CX(0.5)} 870 Z`}
          fill={C.red} opacity={0.13 + 0.05 * Math.sin(f / 4) + stage * 0.03} />
        <line x1={CX(0.45)} y1={CY(0.45) - 20} x2={CX(0.45)} y2={870} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" opacity={0.85} />
        <polyline points={pts.join(' ')} fill="none" stroke="url(#hcg)" strokeWidth={22} opacity={0.25} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts.join(' ')} fill="none" stroke="url(#hcg)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        {Array.from({ length: 14 }, (_, i) => {
          const uu = ((f / 90) + i / 14) % 1;
          return <circle key={'fl' + i} cx={CX(uu)} cy={CY(uu)} r={5} fill="#FFFFFF" opacity={0.75 * Math.sin(uu * Math.PI)} />;
        })}
        <circle cx={CX(0.45)} cy={CY(0.45)} r={12 + 4 * Math.sin(f / 4)} fill={C.gold} style={{ filter: `drop-shadow(0 0 12px ${C.gold})` }} />
        {/* 曲线尾端断裂（跌穿谷底） */}
        {crackK > 0 && (
          <g stroke={C.red} strokeWidth={5} fill="none" opacity={crackK} style={{ filter: `drop-shadow(0 0 10px ${C.red})` }}>
            <path d={`M${CX(0.97)} ${CY(0.97)} l -30 40 l 24 30 l -36 60`} />
            <path d={`M${CX(0.97)} ${CY(0.97)} l 26 34 l -12 40 l 30 46`} />
          </g>
        )}
        {/* 左侧两个“清醒”图标 */}
        {[{ u: 0.1, n: 'yuan' as IconName }, { u: 0.28, n: 'clock' as IconName }].map((ic) => (
          <g key={ic.n} transform={`translate(${CX(ic.u)} ${CY(ic.u)})`}>
            <circle r={46} fill="#0C0628" stroke={C.cyan} strokeWidth={3} />
            <Icon name={ic.n} color={C.cyan} sw={3.5} />
          </g>
        ))}
        {/* 四个痛点节点 */}
        {NODES.map((nd, i) => {
          const visited = i < stage, current = i === stage;
          const hot = current && lab > 0 ? 0.5 + 0.5 * Math.sin(f / 3) : 0;
          const col = visited || current ? (i >= 2 ? C.red : C.pink) : C.pink;
          return (
            <g key={i} transform={`translate(${CX(nd.u)} ${CY(nd.u)}) scale(${current ? 1 + 0.25 * lab : 1})`} opacity={visited || current ? 1 : 0.6}>
              <circle r={46} fill={current && lab > 0 ? '#3A0624' : '#0C0628'} stroke={col} strokeWidth={visited || current ? 4 : 3} style={{ filter: `drop-shadow(0 0 ${8 + hot * 18}px ${col})` }} />
              <Icon name={nd.icon} color={col} sw={3.5} />
            </g>
          );
        })}
        {cur && ring > 0 && ring < 1 && <circle cx={cur.x} cy={cur.y} r={46 + ring * 120} fill="none" stroke={C.pink} strokeWidth={6 * (1 - ring)} opacity={1 - ring} />}
        {cur && lab > 0 && (
          <path d={`M${BIG.x + 40} ${BIG.y + 116} L${cur.x + (BIG.x + 40 - cur.x) * 0.15} ${cur.y - 60}`} stroke={C.pink} strokeWidth={3} strokeDasharray="8 8" opacity={lab} />
        )}
        {/* 光标 */}
        <circle cx={px} cy={py} r={22 + 4 * Math.sin(f / 3)} fill={C.pink} opacity={0.35} />
        <circle cx={px} cy={py} r={13} fill="#fff" stroke={C.pink} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${C.pink})` }} />
      </svg>
      <div style={{ position: 'absolute', left: 1240, top: 884, width: 220, textAlign: 'right', color: C.dim, fontWeight: 700, fontSize: 28 }}>继续投入 →</div>
      <div style={{ position: 'absolute', left: 250, top: 262, color: C.dim, fontWeight: 700, fontSize: 28 }}>实际收益</div>
      <div style={{ position: 'absolute', left: CX(0.45) - 110, top: CY(0.45) - 76, width: 220, textAlign: 'center' }}>
        <span style={{ padding: '2px 14px', borderRadius: 10, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 26, lineHeight: '40px' }}>黄金止损线</span>
      </div>
      {/* 已经踩过的坑：小标签 */}
      {NODES.map((nd, i) => (i < stage ? (
        <div key={i} style={{ position: 'absolute', left: PILL_POS[i].x, top: PILL_POS[i].y, padding: '0 14px', borderRadius: 10, background: 'rgba(46,4,30,0.9)', border: `2px solid ${C.pink}`,
          color: '#FFD6EC', fontWeight: 900, fontSize: 26, lineHeight: '38px' }}>{nd.label}</div>
      ) : null))}
      {/* 你在这 */}
      <div style={{ position: 'absolute', left: px - 70, top: py - 118, width: 140, textAlign: 'center', opacity: stage >= 4 ? 1 - crash : 1 }}>
        <div style={{ display: 'inline-block', padding: '0 14px', borderRadius: 10, background: C.pink, color: '#fff', fontWeight: 900, fontSize: 28, lineHeight: '42px', boxShadow: `0 0 18px ${C.pink}` }}>你在这</div>
        <svg width={140} height={26} style={{ display: 'block' }}><path d="M60 0 L80 0 L70 18 Z" fill={C.pink} /></svg>
      </div>
      {/* 当前痛点：大标签 */}
      {cur && lab > 0 && (
        <div style={{ position: 'absolute', left: BIG.x, top: BIG.y, transform: `scale(${1.6 - 0.6 * lab})`, transformOrigin: '0 50%', opacity: Math.min(1, lab * 1.5) }}>
          <div style={{ display: 'inline-block', padding: '0 14px', borderRadius: 8, background: C.pink, color: C.ink, fontWeight: 900, fontSize: 26, lineHeight: '38px' }}>痛点 0{stage + 1}</div>
          <div style={{ fontWeight: 900, fontSize: 76, lineHeight: '86px', color: '#fff', letterSpacing: 6, textShadow: glow(C.pink, 0.8) }}>“{NODES[stage].label}”</div>
        </div>
      )}
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(4,2,16,${0.7 * dim})` }} />}
    </AbsoluteFill>
  );
};

/** 镜头钻进节点 / 从节点拉回：返回外层容器的 transform（以节点为中心缩放） */
export const zoomAt = (x: number, y: number, s: number): React.CSSProperties => ({ transformOrigin: '0 0', transform: `translate(${x}px, ${y}px) scale(${s}) translate(${-x}px, ${-y}px)` });
export const diveScale = (f: number, a: number, b: number) => 1 + 7 * tw(f, a, b, 0, 1, EI);
