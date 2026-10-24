import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BF, C, EI, EIO, EO, FONT, FPS, glow, shake, tw } from '../../lib';
import { Character, legs } from '../../components/Character';
import { Hi, Holo, Rant, ScenePill, Stamp, ek, life, pk } from '../../components/UI';

/* 痛点 02 · 来都来了 / 排都排了（第 49–63 拍）
   寒风里排队第 188 号，脚被“已等 90 分钟”的锁链锁住 → 旁边免排队的店在招手 → 扭头回来硬排
   → 斜切到电影院：2.1 分烂片，“万一最后 10 分钟好看呢？” → 结局更烂 → 结算 */

const GROUND = 890;
const HIP = { x: 820, y: GROUND - 222 };
const WIPE_A = BF(56), WIPE_B = BF(56) + 9;

const Snow: React.FC<{ f: number; n?: number; k?: number }> = ({ f, n = 90, k = 1 }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    {Array.from({ length: n }, (_, i) => {
      const sp = 3 + random('sv' + i) * 5;
      const x = ((random('sx' + i) * 2200 - f * sp * 1.6 * k) % 2200 + 2200) % 2200 - 140;
      const y = ((random('sy' + i) * 1080 + f * sp) % 1080);
      return <circle key={i} cx={x} cy={y} r={1.5 + random('sr' + i) * 3} fill="#DDE8FF" opacity={0.35 + 0.4 * random('so' + i)} />;
    })}
  </svg>
);

const Street: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const lookBack = f >= BF(52) && f < BF(53);            // 扭头看免排队的店
  const shiver = Math.sin(f * 2.3) * (f >= BF(54) ? 4 : 2);
  const freeOn = f >= BF(51) ? (f < BF(51) + 6 ? (Math.floor(f) % 2 ? 1 : 0.3) : 1) : 0.12;
  const wave = Math.sin(t * 9) * 22;
  const chainK = tw(f, BF(50), BF(50) + 5, 0, 1, EO);
  const called = f >= BF(54.5) ? 53 : 52;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0A1236 0%, #141A4A 55%, #0B0F2A 100%)' }} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* 远处楼群 */}
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 150 - 20} y={260 + random('bh' + i) * 200} width={130} height={700} fill="#0D1238" opacity={0.9} />)}
        {/* 免排队的店（左） */}
        <g opacity={0.35 + 0.65 * freeOn}>
          <rect x={90} y={380} width={400} height={510} fill="#0B2638" stroke={C.cyan} strokeWidth={4} style={{ filter: `drop-shadow(0 0 ${20 * freeOn}px ${C.cyan})` }} />
          <rect x={200} y={600} width={180} height={290} fill="#FFD27A" opacity={0.85 * freeOn} />
          {Array.from({ length: 4 }, (_, i) => {
            const ph = ((t * 0.6 + i / 4) % 1);
            return <path key={i} d={`M${250 + i * 26} ${590 - ph * 120} q 12 -18 0 -36 q -12 -18 0 -36`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.6 * Math.sin(ph * Math.PI) * freeOn} strokeLinecap="round" />;
          })}
          {/* 招手的霓虹手 */}
          <g transform={`translate(430 470) rotate(${wave * freeOn})`}>
            <path d="M0 40 L0 -10 M-14 0 L-14 -26 M14 0 L14 -30 M28 6 L28 -20 M-28 14 L-30 -6" stroke={C.gold} strokeWidth={9} strokeLinecap="round" />
            <rect x={-34} y={0} width={70} height={50} rx={20} fill="none" stroke={C.gold} strokeWidth={8} />
          </g>
        </g>
        {/* 网红店（右） */}
        <rect x={1180} y={330} width={760} height={560} fill="#24082E" stroke={C.pink} strokeWidth={4} style={{ filter: `drop-shadow(0 0 14px ${C.pink})` }} />
        <rect x={1340} y={560} width={220} height={330} fill="#3A1030" stroke={C.pink} strokeWidth={3} />
        {/* 排队的人 */}
        {[1010, 1130, 1250, 1370].map((x, i) => (
          <Character key={i} x={x} y={HIP.y + 20} scale={0.9} t={t + i} chair={false} wind={0.3} opacity={0.3} id={'q' + i}
            {...legs(0, 0)} handN={{ x: 40, y: 10 }} handF={{ x: 20, y: 14 }} />
        ))}
        <rect x={0} y={GROUND} width={1920} height={190} fill="#0A0C24" />
        <line x1={0} x2={1920} y1={GROUND} y2={GROUND} stroke={C.cyan} strokeOpacity={0.4} strokeWidth={3} />
        {/* 主角 */}
        <Character x={HIP.x + shiver} y={HIP.y} t={t} chair={false} wind={2.2} flip={lookBack} id="qm"
          {...legs(0, 0)} handN={{ x: 96, y: -96 }} handF={{ x: 70, y: -100 }} headTilt={lookBack ? -6 : 4} />
        {/* 小票 */}
        <g transform={`translate(${HIP.x + (lookBack ? -96 : 96) + shiver} ${HIP.y - 130}) rotate(${lookBack ? 8 : -8})`}>
          <rect x={-22} y={-34} width={44} height={60} rx={4} fill="#FFF6E0" />
          <text x={0} y={2} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={18} fill={C.ink}>188</text>
        </g>
        {/* 哈气 */}
        {Array.from({ length: 3 }, (_, i) => {
          const ph = ((t * 0.8 + i / 3) % 1);
          const dir = lookBack ? -1 : 1;
          return <circle key={'br' + i} cx={HIP.x + dir * (130 + ph * 70)} cy={HIP.y - 238 - ph * 30} r={8 + ph * 22} fill="#E8F0FF" opacity={0.35 * (1 - ph)} />;
        })}
        {/* 粉色锁链 */}
        {chainK > 0 && [[-70, 1], [110, -1]].map(([dx, dir], j) => {
          const x0 = HIP.x + dx, x1 = HIP.x + 20 + dir * 10;
          return Array.from({ length: 6 }, (_, i) => {
            const k = (i / 5) * chainK;
            const x = x0 + (x1 - x0) * k, y = GROUND + 6 - (GROUND - (HIP.y + 190)) * k;
            return <ellipse key={`${j}-${i}`} cx={x} cy={y} rx={12} ry={7} transform={`rotate(${i % 2 ? 60 : -30} ${x} ${y})`} fill="none" stroke={C.pink} strokeWidth={5} style={{ filter: `drop-shadow(0 0 6px ${C.pink})` }} />;
          });
        })}
      </svg>
      <Snow f={f} k={f >= BF(54) ? 1.6 : 1} />
      {/* 招牌 */}
      <div style={{ position: 'absolute', left: 90, top: 300, width: 400, textAlign: 'center', opacity: 0.35 + 0.65 * freeOn }}>
        <span style={{ fontWeight: 900, fontSize: 40, lineHeight: '64px', color: C.cyan, textShadow: glow(C.cyan, freeOn * 0.6) }}>免排队 · 马上吃</span>
      </div>
      <div style={{ position: 'absolute', left: 1210, top: 360, width: 640, textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 46, lineHeight: '62px', color: C.pink, textShadow: glow(C.pink, 0.5) }}>网红餐厅 · 排队中</div>
        <div style={{ display: 'inline-block', marginTop: 16, padding: '4px 20px', borderRadius: 10, background: '#120414', border: `2px solid ${C.red}`, color: C.red, fontWeight: 900, fontSize: 36, lineHeight: '48px', fontVariantNumeric: 'tabular-nums' }}>
          当前叫号 {called}</div>
      </div>
      {chainK > 0 && (
        <div style={{ position: 'absolute', left: HIP.x - 330, top: GROUND - 120, transform: `scale(${pk(f, BF(50), 8)})`, whiteSpace: 'nowrap' }}>
          <span style={{ padding: '4px 16px', borderRadius: 10, background: C.pink, color: '#fff', fontWeight: 900, fontSize: 32, lineHeight: '46px', boxShadow: `0 0 16px ${C.pink}` }}>🔒 已等 90 分钟</span>
        </div>
      )}
      <Holo x={560} y={150} w={400} k={pk(f, BF(49.5), 9) * (1 - tw(f, BF(52.6), BF(53), 0, 1))} col={C.gold} bg="rgba(30,18,4,0.9)">
        <div style={{ color: C.dim, fontWeight: 700, fontSize: 26, lineHeight: '36px' }}>排队小票</div>
        <div style={{ color: C.gold, fontWeight: 900, fontSize: 66, lineHeight: '80px', textShadow: glow(C.gold, 0.4) }}>第 188 号</div>
        <div style={{ color: C.red, fontWeight: 900, fontSize: 30, lineHeight: '42px' }}>前面还有 {called === 52 ? 136 : 135} 桌</div>
      </Holo>
      {lookBack && <div style={{ position: 'absolute', left: HIP.x - 220, top: HIP.y - 360, fontWeight: 900, fontSize: 56, color: C.cyan, textShadow: glow(C.cyan, 0.6), transform: `scale(${pk(f, BF(52), 6)})` }}>？！</div>}
      <Rant x={120} y={150} w={960} f={f} k={pk(f, BF(53), 8)} tail="right" lines={['都排了一个半小时了！', '现在走，前面不就白等了吗？！']} />
    </AbsoluteFill>
  );
};

const Cinema: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const remain = Math.max(0, 600 - 600 * tw(f, BF(59), BF(61), 0, 1, EIO));
  const mm = String(Math.floor(remain / 60)).padStart(2, '0'), ss = String(Math.floor(remain % 60)).padStart(2, '0');
  const ended = f >= BF(61);
  const nod = Math.max(0, Math.sin(t * 3)) * 6;
  const prog = 0.83 + 0.17 * tw(f, BF(59), BF(61), 0, 1, EIO);
  const comments = ['这也能上映？', '我睡了一觉醒来还没完', '退票！', '剧情在哪', '导演出来挨打', '前排的已经走了'];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 30%, #23104A 0%, #0B0620 60%, #050210 100%)' }} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* 银幕光束 */}
        <path d="M430 520 L1490 520 L1700 1080 L220 1080 Z" fill="#8FA8FF" opacity={0.05} />
        <rect x={430} y={110} width={1060} height={410} rx={10} fill={ended ? '#14061C' : '#2A2440'} stroke="#C8C0FF" strokeWidth={4} style={{ filter: 'drop-shadow(0 0 24px #7C6CFF)' }} />
        {/* 烂片画面：纸板怪兽 */}
        {!ended && (
          <g transform={`translate(${960 + Math.sin(t * 2) * 60} 340) rotate(${Math.sin(t * 5) * 6})`}>
            <line x1={-40} y1={-230} x2={-40} y2={-120} stroke="#fff" strokeWidth={2} opacity={0.6} />
            <line x1={40} y1={-230} x2={40} y2={-120} stroke="#fff" strokeWidth={2} opacity={0.6} />
            <path d="M-90 100 L-80 -60 Q 0 -150 80 -60 L90 100 Z" fill="#7A5A3A" stroke="#3A2A1A" strokeWidth={5} />
            <circle cx={-30} cy={-40} r={18} fill="#fff" /><circle cx={34} cy={-46} r={12} fill="#fff" />
            <circle cx={-26} cy={-38} r={7} fill="#000" /><circle cx={36} cy={-44} r={5} fill="#000" />
            <path d="M-40 20 L-20 6 L0 22 L20 6 L40 20" stroke="#fff" strokeWidth={6} fill="none" />
          </g>
        )}
        {/* 播放进度 */}
        <rect x={470} y={488} width={980} height={8} rx={4} fill="rgba(255,255,255,0.25)" />
        <rect x={470} y={488} width={980 * prog} height={8} rx={4} fill={C.pink} />
        {/* 观众席 */}
        {Array.from({ length: 3 }, (_, r) => Array.from({ length: 12 }, (_, i) => {
          const x = 120 + i * 150 + (r % 2) * 70, y = 760 + r * 110;
          const leaving = r === 0 && (i === 8 || i === 10) && f > BF(57);
          if (leaving) return null;
          return <g key={`${r}-${i}`}><rect x={x - 50} y={y} width={100} height={120} rx={20} fill="#120A2A" stroke={C.pink} strokeOpacity={0.25} strokeWidth={2} />
            {random('aud' + r + i) > 0.55 && <circle cx={x} cy={y - 18} r={26} fill="#0A0618" opacity={0.9} />}</g>;
        }))}
        {/* 起身离场的人 */}
        {[0, 1].map((k) => {
          const p = tw(f, BF(57) + k * 8, BF(60) + k * 8, 0, 1, EIO);
          return p > 0 && p < 1 ? <Character key={'lv' + k} x={1300 + k * 120 + p * 500} y={700} scale={0.7} t={t} chair={false} wind={0.3} opacity={0.5} id={'lv' + k} {...legs(t * 9, 0.8)} handN={{ x: 40, y: 10 }} handF={{ x: 20, y: 14 }} /> : null;
        })}
        <Character x={780} y={850} scale={0.95} t={t} wind={0.4} tired={1} headTilt={-8 + nod} eyesClosed={ended ? 1 : 0.45} rot={ended ? -10 : 0} id="cm"
          handN={{ x: 120, y: -40 }} handF={{ x: 100, y: -46 }} kneeN={{ x: 128, y: -14 }} footN={{ x: 140, y: 100 }} />
      </svg>
      {/* 弹幕 */}
      {!ended && comments.map((c, i) => {
        const x = 1500 - ((f - WIPE_A + i * 26) * 7) % 1300;
        return <div key={i} style={{ position: 'absolute', left: x, top: 136 + (i % 4) * 58, fontWeight: 700, fontSize: 30, color: '#fff', opacity: 0.85, whiteSpace: 'nowrap', textShadow: '0 0 6px #000, 0 0 2px #000' }}>{c}</div>;
      })}
      <div style={{ position: 'absolute', left: 452, top: 128, padding: '2px 14px', borderRadius: 10, background: C.red, color: '#fff', fontWeight: 900, fontSize: 32, lineHeight: '46px', boxShadow: `0 0 16px ${C.red}` }}>评分 2.1</div>
      <div style={{ position: 'absolute', left: 1290, top: 440, fontWeight: 900, fontSize: 30, color: '#fff', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 6px #000' }}>剩余 {mm}:{ss}</div>
      {ended && (
        <div style={{ position: 'absolute', left: 430, top: 170, width: 1060, textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 40, color: C.dim, letterSpacing: 12 }}>— 剧 终 —</div>
          <div style={{ display: 'inline-block', marginTop: 24, padding: '8px 30px', borderRadius: 14, border: `5px solid ${C.pink}`, color: C.pink, fontWeight: 900, fontSize: 58, lineHeight: '74px',
            transform: `scale(${1.8 - 0.8 * tw(f, BF(61), BF(61) + 6, 0, 1, EO)}) rotate(-4deg)`, textShadow: glow(C.pink, 0.5), background: 'rgba(30,4,22,0.85)' }}>最后 10 分钟：更烂了</div>
        </div>
      )}
      <Rant x={90} y={560} w={720} f={f} k={pk(f, BF(57), 8) * (1 - tw(f, BF(61), BF(61) + 5, 0, 1))} size={48} tail="right" lines={['票都买了，', '万一最后 10 分钟好看呢？']} />
    </AbsoluteFill>
  );
};

export const ExQueue: React.FC<{ f: number }> = ({ f }) => {
  const wipe = tw(f, WIPE_A, WIPE_B, 0, 1, EI);
  const settle = tw(f, BF(62), BF(62) + 6, 0, 1, EO);
  const sh = shake(f, BF(62), 8, 12, 'q62');
  const cut = (k: number) => `polygon(${2300 * k - 300}px 0, 2400px 0, 2400px 1080px, ${2300 * k - 700}px 1080px)`;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', background: C.bg0, transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      {f < WIPE_B && <Street f={f} />}
      {f >= WIPE_A && (
        <AbsoluteFill style={{ clipPath: f < WIPE_B ? cut(1 - wipe) : undefined }}>
          <Cinema f={f} />
        </AbsoluteFill>
      )}
      {f >= WIPE_A && f < WIPE_B && (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <line x1={2300 * (1 - wipe) - 300} y1={0} x2={2300 * (1 - wipe) - 700} y2={1080} stroke="#fff" strokeWidth={10} style={{ filter: `drop-shadow(0 0 16px ${C.cyan})` }} />
        </svg>
      )}
      {f >= WIPE_A && f < BF(58) && (
        <div style={{ position: 'absolute', left: 1500, top: 600, opacity: life(f, WIPE_B, BF(58), 4, 6), transform: `scale(${pk(f, WIPE_B, 8)})` }}>
          <span style={{ padding: '4px 18px', borderRadius: 10, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 34, lineHeight: '50px' }}>同款操作</span>
        </div>
      )}
      {settle > 0 && <AbsoluteFill style={{ background: `rgba(6,2,18,${0.62 * settle})` }} />}
      <Stamp x={400} y={330} w={1040} k={settle} col={C.pink} rot={-3}>
        <div style={{ display: 'inline-block', padding: '0 16px', borderRadius: 10, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 32, lineHeight: '48px' }}>最终收益</div>
        <div style={{ fontWeight: 900, fontSize: 60, lineHeight: '84px', color: '#fff', marginTop: 8 }}>
          多冻 <Hi c={C.cyan}>90 分钟</Hi> <span style={{ color: C.dim }}>＋</span> 白搭 <Hi c={C.red}>2 小时</Hi>
        </div>
        <div style={{ fontWeight: 900, fontSize: 44, lineHeight: '60px', color: C.pink, textShadow: glow(C.pink, 0.4) }}>钱没回来，时间也搭进去了</div>
      </Stamp>
      <ScenePill k={ek(f, BF(49) + 4, 8)} num="痛点 02" text="来都来了" sub="排都排了 · 票都买了" />
    </AbsoluteFill>
  );
};
