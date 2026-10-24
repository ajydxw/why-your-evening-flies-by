import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BF, C, EIO, EO, FONT, FPS, glow, shake, tw } from '../../lib';
import { Character } from '../../components/Character';
import { Hi, Holo, Rant, ScenePill, Stamp, ek, life, pk } from '../../components/UI';

/* 痛点 01 · 买都买了（第 33–47 拍）
   68 元的难吃外卖 → 吃一口脸色发青 → 垃圾桶亮起“立刻止损” → 抱着碗硬塞 → 救护车 → 结算 */

const HIP = { x: 680, y: 790 };
const MOUTH = { x: 120, y: -236 };            // 局部坐标
const BITES = [35, 40, 41, 42, 43];           // 每一口都落在拍点上

/** 送到嘴边的程度：拍点处 = 1 */
function biteK(f: number) {
  let k = 0;
  for (const n of BITES) {
    const d = Math.abs(f - BF(n)) / (0.45 * 21.39);
    if (d < 1) k = Math.max(k, Math.cos((d * Math.PI) / 2) ** 2);
  }
  return k;
}

export const ExTakeout: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const hug = tw(f, BF(37), BF(37) + 8, 0, 1, EIO);
  const bowlX = 1040 - 160 * hug;
  const sick = 0.8 * tw(f, BF(35.5), BF(35.5) + 8, 0, 1, EO);
  const eaten = BITES.filter((n) => f >= BF(n) + 3).length;
  const level = 1 - Math.min(0.75, eaten * 0.15);
  const bk = biteK(f);
  // 手：勺子在碗和嘴之间来回
  const dip = { x: bowlX - HIP.x - 30, y: -176 };
  const rest = { x: 196, y: -108 };
  const handTarget = f < BF(34) ? rest : { x: dip.x + (MOUTH.x - dip.x) * bk, y: dip.y + (MOUTH.y - dip.y) * bk };
  const handN = f < BF(34) ? rest : { x: rest.x + (handTarget.x - rest.x) * tw(f, BF(34), BF(34) + 6, 0, 1, EO), y: rest.y + (handTarget.y - rest.y) * tw(f, BF(34), BF(34) + 6, 0, 1, EO) };
  const handF = hug > 0 ? { x: 178 + (bowlX + 100 - HIP.x - 178) * hug, y: -114 + (-150 + 114) * hug } : { x: 178, y: -114 };
  const shakeNo = f >= BF(37) && f < BF(38.5) ? Math.sin((f - BF(37)) * 0.9) * 12 * (1 - (f - BF(37)) / (BF(38.5) - BF(37))) : 0;
  const gag = BITES.slice(1).reduce((a, n) => a + (f > BF(n) && f < BF(n) + 8 ? Math.sin(((f - BF(n)) / 8) * Math.PI) : 0), 0);
  // 镜头
  let cam = { x: 0, y: 0 };
  BITES.slice(1).forEach((n) => { const s = shake(f, BF(n), 5, 6, 'tb' + n); cam.x += s.x; cam.y += s.y; });
  const s45 = shake(f, BF(45), 8, 14, 'tset'); cam.x += s45.x; cam.y += s45.y;
  const drift = 1.02 + 0.03 * tw(f, BF(33), BF(47), 0, 1);
  const siren = f >= BF(44) && f < BF(45.5) ? (Math.floor((f - BF(44)) / 4) % 2 === 0 ? C.red : '#2E6BFF') : null;
  const settle = tw(f, BF(45), BF(45) + 6, 0, 1, EO);
  const trashOn = f >= BF(36) ? 0.6 + 0.4 * Math.sin(f / 4) : 0.15;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', background: C.bg0 }}>
      <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${drift})`, transformOrigin: '900px 600px' }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1A0B3E 0%, #120830 60%, #0A0520 100%)' }} />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {/* 墙面霓虹灯带 + 地板 */}
          <rect x={0} y={150} width={1920} height={6} fill={C.pink} opacity={0.5} style={{ filter: `drop-shadow(0 0 10px ${C.pink})` }} />
          <rect x={0} y={880} width={1920} height={200} fill="#090418" />
          <line x1={0} x2={1920} y1={880} y2={880} stroke={C.cyan} strokeOpacity={0.45} strokeWidth={3} />
          {Array.from({ length: 16 }, (_, i) => <line key={i} x1={960 + (i - 8) * 120} y1={880} x2={960 + (i - 8) * 320} y2={1080} stroke={C.cyan} strokeOpacity={0.1} strokeWidth={2} />)}
          {/* 垃圾桶：一键止损 */}
          <g transform="translate(250 880)">
            <ellipse cx={0} cy={0} rx={90} ry={14} fill={C.cyan} opacity={0.25 * trashOn} />
            <path d="M-60 -150 L60 -150 L50 0 L-50 0 Z" fill="#0B1A2E" stroke={C.cyan} strokeWidth={4} style={{ filter: `drop-shadow(0 0 ${6 + 18 * trashOn}px ${C.cyan})` }} />
            <rect x={-70} y={-170} width={140} height={18} rx={6} fill="#0B1A2E" stroke={C.cyan} strokeWidth={4} />
            {[-25, 0, 25].map((x) => <line key={x} x1={x} y1={-130} x2={x * 0.85} y2={-20} stroke={C.cyan} strokeWidth={3} opacity={0.6} />)}
          </g>
          {/* 桌子 */}
          <rect x={780} y={690} width={620} height={18} rx={6} fill="#1C1040" stroke={C.pink} strokeWidth={3} style={{ filter: `drop-shadow(0 0 8px ${C.pink})` }} />
          <rect x={820} y={708} width={14} height={172} fill="#120A2A" /><rect x={1350} y={708} width={14} height={172} fill="#120A2A" />
          {/* 外卖袋 */}
          <g transform="translate(1250 690)">
            <path d="M-50 0 L-44 -110 L44 -110 L50 0 Z" fill="#2A1450" stroke={C.gold} strokeWidth={3} opacity={0.9} />
            <path d="M-20 -110 Q 0 -140 20 -110" stroke={C.gold} strokeWidth={4} fill="none" />
            <text x={0} y={-48} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={C.gold}>网红</text>
            <text x={0} y={-18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={26} fill={C.gold}>爆款</text>
          </g>
          {/* 诡异绿色外卖 */}
          <g transform={`translate(${bowlX} 690)`}>
            <ellipse cx={0} cy={-80} rx={124} ry={22} fill="#0E2A14" />
            <ellipse cx={0} cy={-80 + (1 - level) * 50} rx={118 - (1 - level) * 20} ry={18} fill="#4BD84A" opacity={0.95} style={{ filter: 'drop-shadow(0 0 14px #5CFF6A)' }} />
            {Array.from({ length: 7 }, (_, i) => {
              const ph = ((t * 1.3 + random('bp' + i)) % 1);
              const bx = (random('bx' + i) - 0.5) * 180 * (0.6 + level * 0.4);
              return <circle key={i} cx={bx} cy={-84 + (1 - level) * 50 - ph * 18} r={4 + ph * 10} fill="none" stroke="#B6FF8A" strokeWidth={3} opacity={1 - ph} />;
            })}
            <path d="M-124 -80 Q -110 0 0 0 Q 110 0 124 -80 Z" fill="#1A0E36" stroke={C.pink} strokeWidth={4} />
            <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={C.pink}>¥68</text>
            {/* 绿色毒气 */}
            {Array.from({ length: 5 }, (_, i) => {
              const ph = ((t * 0.5 + i / 5) % 1);
              return <path key={'s' + i} d={`M${-40 + i * 20} ${-100 - ph * 160} q 14 -20 0 -40 q -14 -20 0 -40`} stroke="#7CFF6A" strokeWidth={5} fill="none" opacity={0.5 * Math.sin(ph * Math.PI)} strokeLinecap="round" />;
            })}
          </g>
          <Character x={HIP.x} y={HIP.y} t={t} rot={4 + gag * 4} handN={handN} handF={handF} sick={sick} headTilt={shakeNo - gag * 6} id="tk" />
          {/* 勺子 */}
          {f >= BF(34) && (() => {
            const hx = HIP.x + handN.x, hy = HIP.y + handN.y;
            return <g transform={`translate(${hx} ${hy}) rotate(${-20 - bk * 30})`}><line x1={0} y1={0} x2={46} y2={0} stroke="#CFC8FF" strokeWidth={6} strokeLinecap="round" /><ellipse cx={56} cy={0} rx={13} ry={8} fill="#CFC8FF" /><ellipse cx={56} cy={-2} rx={9} ry={4} fill="#4BD84A" /></g>;
          })()}
          {/* 眼泪 */}
          {f >= BF(39.5) && Array.from({ length: 6 }, (_, i) => {
            const ph = (((f - BF(39.5)) / 22 + i / 6) % 1);
            return <path key={'tear' + i} d="M0 -10 Q 7 2 0 8 Q -7 2 0 -10 Z" transform={`translate(${HIP.x + 112 + ph * 10} ${HIP.y - 252 + ph * 120}) scale(${1.4 - ph * 0.6})`} fill={C.cyan} opacity={1 - ph} style={{ filter: `drop-shadow(0 0 4px ${C.cyan})` }} />;
          })}
        </svg>

        {/* 呕 */}
        {BITES.slice(1).map((n) => {
          const k = life(f, BF(n) + 3, BF(n) + 15, 3, 5);
          return k > 0 ? <div key={n} style={{ position: 'absolute', left: HIP.x + 150, top: HIP.y - 330 - (f - BF(n)) * 2, fontWeight: 900, fontSize: 48, color: '#9CFF6A', opacity: k, textShadow: glow('#5CFF6A', 0.6), transform: `rotate(${n % 2 ? 8 : -6}deg)` }}>呕……</div> : null;
        })}
        {/* 胃部报警 */}
        {f >= BF(36) && (
          <div style={{ position: 'absolute', left: 430, top: 560, display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${pk(f, BF(36), 8) * (1 + 0.06 * Math.sin(f / 2.5))})`, transformOrigin: '60px 40px' }}>
            <svg width={84} height={84} style={{ filter: `drop-shadow(0 0 14px ${C.red})` }}>
              <circle cx={42} cy={42} r={38} fill="#3A0612" stroke={C.red} strokeWidth={4} />
              <path d="M24 38 Q 24 18 42 18 Q 60 18 60 38 Q 60 48 54 52 L54 60 L30 60 L30 52 Q 24 48 24 38 Z" fill={C.red} />
              <circle cx={34} cy={38} r={5} fill="#3A0612" /><circle cx={50} cy={38} r={5} fill="#3A0612" />
            </svg>
            <div style={{ padding: '0 14px', borderRadius: 10, background: C.red, color: '#fff', fontWeight: 900, fontSize: 30, lineHeight: '44px' }}>胃部报警</div>
          </div>
        )}
        {/* 垃圾桶标签 */}
        {f >= BF(36.5) && (
          <div style={{ position: 'absolute', left: 70, top: 640, width: 360, textAlign: 'center', whiteSpace: 'nowrap', transform: `scale(${pk(f, BF(36.5), 8)})` }}>
            <div style={{ display: 'inline-block', padding: '0 16px', borderRadius: 12, background: C.cyan, color: C.ink, fontWeight: 900, fontSize: 30, lineHeight: '46px', boxShadow: `0 0 18px ${C.cyan}` }}>倒掉 = 立刻止损</div>
          </div>
        )}
        {/* 外卖订单 */}
        <Holo x={1110} y={196} w={430} k={pk(f, BF(33.5), 9) * (f >= BF(45) ? 1 - settle * 0.6 : 1)} col={C.gold} bg="rgba(30,18,4,0.88)">
          <div style={{ color: C.dim, fontWeight: 700, fontSize: 26, lineHeight: '36px' }}>外卖订单 · 已送达</div>
          <div style={{ color: C.gold, fontWeight: 900, fontSize: 68, lineHeight: '84px', textShadow: glow(C.gold, 0.4) }}>实付 ¥68</div>
          <div style={{ display: 'inline-block', padding: '0 14px', borderRadius: 10, background: C.red, color: '#fff', fontWeight: 900, fontSize: 30, lineHeight: '44px' }}>巨难吃 · 一星差评</div>
        </Holo>
        {/* 急诊账单 */}
        <Holo x={1110} y={480} w={430} k={pk(f, BF(44), 8) * (f >= BF(45) ? 1 - settle * 0.6 : 1)} col={C.red} bg="rgba(40,4,14,0.9)">
          <div style={{ color: C.dim, fontWeight: 700, fontSize: 26, lineHeight: '36px' }}>医院 · 急诊</div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 38, lineHeight: '52px' }}>肠胃炎 挂号 + 输液</div>
          <div style={{ color: C.red, fontWeight: 900, fontSize: 56, lineHeight: '68px', textShadow: glow(C.red, 0.4) }}>−¥300</div>
        </Holo>
        <Rant x={110} y={150} w={880} f={f} k={pk(f, BF(38), 8) * (f >= BF(44) ? 1 - tw(f, BF(44), BF(44) + 5, 0, 1) : 1)} tail="right"
          lines={['花了 68 块买的！', '扔了不就白花钱了吗？！']} />
      </AbsoluteFill>
      {/* 救护车警灯 */}
      {siren && <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${f % 8 < 4 ? '15%' : '85%'} 0%, ${siren}66 0%, transparent 60%)`, mixBlendMode: 'screen' }} />}
      {/* 结算 */}
      {settle > 0 && <AbsoluteFill style={{ background: `rgba(6,2,18,${0.62 * settle})` }} />}
      <Stamp x={420} y={300} w={1000} k={settle} col={C.pink} rot={-3}>
        <div style={{ display: 'inline-block', padding: '0 16px', borderRadius: 10, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 32, lineHeight: '48px' }}>最终收益</div>
        <div style={{ fontWeight: 900, fontSize: 60, lineHeight: '84px', color: '#fff', marginTop: 8 }}>
          <Hi c={C.gold}>¥68</Hi> 照样没了 <span style={{ color: C.dim }}>＋</span> 肠胃炎 <Hi c={C.red}>−¥300</Hi>
        </div>
        <div style={{ fontWeight: 900, fontSize: 44, lineHeight: '60px', color: C.pink, textShadow: glow(C.pink, 0.4) }}>拿身体当垃圾桶</div>
      </Stamp>
      <ScenePill k={ek(f, BF(33) + 4, 8)} num="痛点 01" text="买都买了" />
    </AbsoluteFill>
  );
};
