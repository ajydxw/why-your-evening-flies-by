import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { BF, C, EBACK, EI, EIO, EO, FONT, FPS, glow, shake, tw } from '../lib';
import { Character, legs } from '../components/Character';
import { Hi, Holo, Insight, Stamp, ek, life, pk } from '../components/UI';

/* ============================================================
   第六段 · 给方法：3 个马上能用的“止损开关”（91.43 – 114.25s，第 128–160 拍）
   色调从压抑的暗紫转为通透的青蓝 + 流光金
   方法 01 今日清零（128–140 拍）  方法 02 改写心理账本（140–150 拍）  方法 03 事前熔断线（150–160 拍）
   ============================================================ */

const GROUND = 890;
const A2 = BF(140), A3 = BF(150);

const BrightBG: React.FC<{ f: number }> = ({ f }) => (
  <>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0F4470 0%, #0B3358 55%, #082640 100%)' }} />
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 82% 8%, rgba(255,214,120,0.55) 0%, rgba(255,214,120,0.12) 25%, transparent 50%)' }} />
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: 50 }, (_, i) => (
        <circle key={i} cx={random('px' + i) * 1920 + Math.sin(f / 40 + i) * 20} cy={(((random('py' + i) * 1080 - f * (0.6 + random('pv' + i))) % 1080) + 1080) % 1080}
          r={1.5 + random('pr' + i) * 2.5} fill={i % 3 ? '#BFF6FF' : C.gold} opacity={0.35 + 0.4 * random('po' + i)} />
      ))}
      <rect x={0} y={GROUND} width={1920} height={190} fill="#072238" />
      <line x1={0} x2={1920} y1={GROUND} y2={GROUND} stroke="#BFF6FF" strokeOpacity={0.7} strokeWidth={3} />
      {Array.from({ length: 18 }, (_, i) => <line key={i} x1={960 + (i - 9) * 110} y1={GROUND} x2={960 + (i - 9) * 300} y2={1080} stroke="#BFF6FF" strokeOpacity={0.14} strokeWidth={2} />)}
    </svg>
  </>
);

const MethodCard: React.FC<{ f: number; at: number; num: string; title: React.ReactNode; out?: number }> = ({ f, at, num, title, out = 1e9 }) => (
  <Holo x={84} y={56} w={940} k={pk(f, at, 9) * (1 - tw(f, out - 6, out, 0, 1))} col={C.gold} bg="rgba(40,26,4,0.82)" origin="0 50%">
    <div style={{ display: 'inline-block', padding: '0 14px', borderRadius: 8, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 28, lineHeight: '42px' }}>{num}</div>
    <div style={{ fontWeight: 900, fontSize: 54, lineHeight: '72px', color: '#fff' }}>{title}</div>
  </Holo>
);

/* ---------- 方法 01：今日清零 ---------- */
const M1: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const hip = { x: 640, y: GROUND - 222 };
  const btn = pk(f, BF(130), 9);
  const press = tw(f, BF(130.6), BF(131), 0, 1, EI) * (1 - tw(f, BF(131.3), BF(131.8), 0, 1, EO));
  const dissolve = tw(f, BF(131), BF(132.6), 0, 1, EO);
  const ring = tw(f, BF(131), BF(131) + 16, 0, 1, EO);
  const relief = tw(f, BF(132), BF(133), 0, 1, EIO);
  const handN = { x: 120 + 60 * press, y: -150 + 10 * press };
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* 身后拖着的旧账车厢 */}
        {[{ x: 180, l: '已花的钱' }, { x: 400, l: '耗掉的时间' }].map((c, i) => (
          <g key={i} opacity={1 - dissolve}>
            <rect x={c.x - 100} y={GROUND - 150} width={190} height={120} rx={10} fill="#3A3048" stroke="#8A7AA0" strokeWidth={4} />
            <circle cx={c.x - 60} cy={GROUND - 22} r={22} fill="#1A1424" stroke="#8A7AA0" strokeWidth={4} />
            <circle cx={c.x + 50} cy={GROUND - 22} r={22} fill="#1A1424" stroke="#8A7AA0" strokeWidth={4} />
            <text x={c.x - 5} y={GROUND - 78} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#E8E0F4">{c.l}</text>
            <line x1={c.x + 90} y1={GROUND - 90} x2={c.x + 130} y2={GROUND - 90} stroke="#8A7AA0" strokeWidth={6} strokeDasharray="10 6" />
          </g>
        ))}
        <line x1={530} y1={GROUND - 90} x2={hip.x - 20} y2={hip.y + 20} stroke="#8A7AA0" strokeWidth={6} strokeDasharray="10 6" opacity={1 - dissolve} />
        {dissolve > 0 && dissolve < 1 && Array.from({ length: 60 }, (_, i) => {
          const x0 = 80 + random('dx' + i) * 480, y0 = GROUND - 160 + random('dy' + i) * 140;
          return <circle key={i} cx={x0 + (random('dvx' + i) - 0.3) * 200 * dissolve} cy={y0 - (150 + random('dvy' + i) * 400) * dissolve} r={3 + random('dr' + i) * 4} fill={i % 2 ? C.gold : '#BFF6FF'} opacity={1 - dissolve} />;
        })}
        <Character x={hip.x} y={hip.y} t={t} chair={false} wind={0.8 + relief} id="m1" {...legs(0, 0)} rot={-3 * relief}
          handN={f >= BF(130) ? handN : { x: 50, y: 10 }} handF={{ x: 20, y: 14 }} headTilt={-6 * relief} />
        {/* 历史清零键 */}
        {btn > 0 && (
          <g transform={`translate(${hip.x + 230} ${hip.y - 150}) scale(${btn * (1 - 0.12 * press)})`}>
            <circle r={62} fill="#3A2A04" stroke={C.gold} strokeWidth={5} style={{ filter: `drop-shadow(0 0 ${18 + 20 * press}px ${C.gold})` }} />
            <circle r={46} fill={C.gold} />
            <path d="M-16 -18 A 24 24 0 1 0 18 -16 M18 -16 L 20 -32 M18 -16 L 2 -14" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
        )}
        {ring > 0 && ring < 1 && <circle cx={hip.x + 230} cy={hip.y - 150} r={60 + ring * 700} fill="none" stroke={C.gold} strokeWidth={10 * (1 - ring)} opacity={1 - ring} />}
      </svg>
      {btn > 0 && <div style={{ position: 'absolute', left: hip.x + 130, top: hip.y - 260, width: 200, textAlign: 'center', fontWeight: 900, fontSize: 30, color: C.gold, textShadow: glow(C.gold, 0.4), transform: `scale(${btn})` }}>历史清零键</div>}
      <MethodCard f={f} at={BF(128.6)} num="方法 01" title={<>开启“<Hi>今日清零</Hi>”视角</>} />
      <Holo x={1060} y={250} w={760} k={pk(f, BF(133), 9)} col={C.cyan} bg="rgba(4,30,48,0.88)">
        <div style={{ display: 'inline-block', padding: '0 12px', borderRadius: 8, background: C.cyan, color: C.ink, fontWeight: 900, fontSize: 26, lineHeight: '38px' }}>问自己一句</div>
        <div style={{ fontWeight: 900, fontSize: 40, lineHeight: '58px', color: '#fff', marginTop: 6 }}>如果今天<Hi c={C.cyan}>第一次</Hi>遇见</div>
        <div style={{ fontWeight: 900, fontSize: 40, lineHeight: '58px', color: '#fff' }}>这件事 / 这个人，</div>
        <div style={{ fontWeight: 900, fontSize: 40, lineHeight: '58px', color: '#fff' }}>我还会掏钱入局吗？</div>
      </Holo>
      {f >= BF(135) && (
        <div style={{ position: 'absolute', left: 1060, top: 560, width: 760, display: 'flex', gap: 24 }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 14, border: '2px solid rgba(255,255,255,0.4)', color: C.dim, fontWeight: 900, fontSize: 34, lineHeight: '50px', opacity: ek(f, BF(135), 6) }}>会 → 那就继续</div>
          <div style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 14, background: C.cyan, color: C.ink, fontWeight: 900, fontSize: 34, lineHeight: '50px', boxShadow: `0 0 22px ${C.cyan}`, transform: `scale(${pk(f, BF(135.5), 8)})` }}>绝不 → 立刻停手</div>
        </div>
      )}
      <Stamp x={1060} y={670} w={760} k={tw(f, BF(136), BF(136) + 6, 0, 1, EO)} col={C.cyan} bg="rgba(4,30,48,0.92)" rot={-2}>
        <div style={{ fontWeight: 900, fontSize: 38, lineHeight: '54px', color: '#fff' }}>只要答案是“<Hi c={C.cyan}>绝不</Hi>”，现在立刻停手！</div>
      </Stamp>
    </AbsoluteFill>
  );
};

/* ---------- 方法 02：改写心理账本 ---------- */
const M2: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const pen = tw(f, BF(141.5), BF(142.5), 0, 1, EIO);
  const strike = tw(f, BF(141.5), BF(142.2), 0, 1, EO);
  const write = tw(f, BF(142.4), BF(143.6), 0, 1, EIO);
  const morph = tw(f, BF(144), BF(144.6), 0, 1, EIO);
  const walk = tw(f, BF(144.3), BF(145.3), 0, 1, EIO);
  const rise = tw(f, BF(145.3), BF(147.5), 0, 1, EIO);
  const S = { x: 1230, y: GROUND };
  const newLabel = '【排雷情报费 · 已结清】';
  const shown = newLabel.slice(0, Math.round(write * newLabel.length));
  const platTop = S.y - 120 + morph * 30 - rise * 130;
  const hipX = 850 + 380 * walk, hipY = walk < 1 ? GROUND - 222 - Math.sin(walk * Math.PI) * 40 - (walk > 0.6 ? (platTop - GROUND) * -((walk - 0.6) / 0.4) : 0) : platTop - 222;
  const penX = S.x - 200 + 400 * pen, penY = S.y - 70 - Math.sin(pen * Math.PI * 3) * 10;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* 黑色绊脚石 → 青色浮空踏板 */}
        {morph < 1 && (
          <path d={`M${S.x - 230} ${S.y} L${S.x - 200} ${S.y - 110} L${S.x - 60} ${S.y - 150} L${S.x + 120} ${S.y - 135} L${S.x + 220} ${S.y - 80} L${S.x + 240} ${S.y} Z`}
            fill="#1A1424" stroke="#5A4A6A" strokeWidth={5} opacity={1 - morph} />
        )}
        {morph > 0 && (
          <g opacity={morph}>
            {rise > 0 && Array.from({ length: 6 }, (_, i) => <line key={i} x1={S.x - 180 + i * 72} y1={platTop + 40} x2={S.x - 180 + i * 72} y2={platTop + 40 + 130 * rise} stroke={C.cyan} strokeWidth={4} opacity={0.4} />)}
            <rect x={S.x - 240} y={platTop} width={480} height={44} rx={22} fill="rgba(46,230,255,0.35)" stroke={C.cyan} strokeWidth={5} style={{ filter: `drop-shadow(0 0 24px ${C.cyan})` }} />
          </g>
        )}
        <Character x={hipX} y={hipY} t={t} chair={false} wind={1} id="m2" {...legs(walk > 0 && walk < 1 ? walk * Math.PI * 4 : 0, walk > 0 && walk < 1 ? 0.7 : 0)}
          handN={rise > 0 ? { x: 150, y: -330 } : { x: 50, y: 10 }} handF={rise > 0 ? { x: -60, y: -320 } : { x: 20, y: 14 }} headTilt={rise > 0 ? -12 : 4} />
        {/* 金色画笔 */}
        {f >= BF(141.3) && f < BF(144) && (
          <g transform={`translate(${penX} ${penY}) rotate(-35)`} opacity={life(f, BF(141.3), BF(144), 4, 6)}>
            <rect x={-12} y={-140} width={24} height={120} rx={8} fill={C.gold} style={{ filter: `drop-shadow(0 0 12px ${C.gold})` }} />
            <path d="M-12 -20 L12 -20 L0 10 Z" fill="#fff" />
          </g>
        )}
        {write > 0 && write < 1 && Array.from({ length: 10 }, (_, i) => <circle key={i} cx={S.x - 180 + 360 * write + (random('sp' + i) - 0.5) * 60} cy={S.y - 80 + (random('sq' + i) - 0.5) * 60} r={3} fill={C.gold} />)}
      </svg>
      {morph < 1 && (
        <div style={{ position: 'absolute', left: S.x - 240, top: S.y - 104, width: 480, textAlign: 'center', fontWeight: 900, fontSize: 34, lineHeight: '48px', opacity: 1 - morph }}>
          <div style={{ position: 'relative', display: 'inline-block', color: write > 0 ? '#7A6A8A' : '#fff' }}>
            [白花的时间与钱]
            <div style={{ position: 'absolute', left: 0, top: 22, height: 5, width: `${strike * 100}%`, background: C.red }} />
          </div>
        </div>
      )}
      {write > 0 && (
        <div style={{ position: 'absolute', left: S.x - 300, top: (morph > 0 ? platTop + 56 : S.y - 200), width: 600, textAlign: 'center', fontWeight: 900, fontSize: 38, lineHeight: '52px', color: C.gold, textShadow: glow(C.gold, 0.5), whiteSpace: 'nowrap' }}>{shown}</div>
      )}
      <MethodCard f={f} at={A2 + 2} num="方法 02" title={<>重写你的“<Hi>心理账本</Hi>”</>} />
      <Insight x={84} y={730} w={880} k={tw(f, BF(146), BF(146) + 8, 0, 1, EO)} col={C.cyan} bg="rgba(4,30,48,0.9)" size={36} tag="换个说法"
        lines={[<>那笔钱和时间不是“白扔了”，</>, <>而是买到了“<Hi c={C.cyan}>此路不通</Hi>”的宝贵情报！</>]} />
    </AbsoluteFill>
  );
};

/* ---------- 方法 03：事前熔断线 ---------- */
const RULES: [React.ReactNode, string][] = [
  [<>排位连输 <Hi>2</Hi> 把 → 立刻关机</>, C.cyan],
  [<>排队超 <Hi>30</Hi> 分钟 → 扭头换店</>, C.cyan],
  [<>别把决定权留给<Hi c={C.pink}>上头后</Hi>的自己！</>, C.gold],
];
const M3c: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const line = tw(f, BF(150.5), BF(151.5), 0, 1, EO);
  const dial = pk(f, BF(151.5), 9);
  const needle = tw(f, BF(153), BF(155.8), 0, 0.8, EIO);
  const fire = f >= BF(156);
  const shield = tw(f, BF(156), BF(156) + 10, 0, 1, EBACK);
  const jump = tw(f, BF(157), BF(157.7), 0, 1, EIO);
  const zoom = tw(f, BF(157.7), BF(159.3), 0, 1, EI);
  const turned = f >= BF(156.6);
  const hipX = 470 - 90 * jump - 900 * zoom, hipY = GROUND - 222 - Math.sin(jump * Math.PI) * 140 + 40 * jump - 40 * zoom * 0;
  const sh = shake(f, BF(156), 8, 10, 'fuse');
  const D = { x: 830, y: 600 };
  const ang = -180 + 180 * needle;
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {/* 新的高速轨道（向左上方延伸） */}
        {fire && (
          <g opacity={tw(f, BF(156.3), BF(157), 0, 1)}>
            <path d={`M${560} ${GROUND - 14} L-100 ${GROUND - 180}`} stroke={C.cyan} strokeWidth={10} style={{ filter: `drop-shadow(0 0 16px ${C.cyan})` }} />
            <path d={`M${560} ${GROUND + 10} L-100 ${GROUND - 156}`} stroke={C.cyan} strokeWidth={4} opacity={0.6} />
            {zoom > 0 && Array.from({ length: 8 }, (_, i) => <line key={i} x1={hipX + 120 + i * 60} y1={hipY - 40 - i * 22 + 60} x2={hipX + 280 + i * 60} y2={hipY - 40 - i * 22 + 100} stroke="#fff" strokeWidth={3} opacity={0.6 * (1 - zoom)} />)}
          </g>
        )}
        {/* 金色熔断线 */}
        <line x1={540} y1={GROUND - 4} x2={540 + 420 * line} y2={GROUND - 4} stroke={C.gold} strokeWidth={8} style={{ filter: `drop-shadow(0 0 14px ${C.gold})` }} />
        {/* 熔断表盘 */}
        {dial > 0 && (
          <g transform={`translate(${D.x} ${D.y}) scale(${dial})`}>
            <path d="M-170 0 A 170 170 0 0 1 170 0" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={30} />
            <path d="M-170 0 A 170 170 0 0 1 52.5 -161.7" fill="none" stroke={C.cyan} strokeWidth={30} opacity={0.75} />
            <path d="M52.5 -161.7 A 170 170 0 0 1 170 0" fill="none" stroke={C.red} strokeWidth={30} opacity={0.85} />
            <line x1={0} y1={0} x2={170 * 1.15 * Math.cos(-0.8 * Math.PI + Math.PI * 0)} y2={0} stroke="none" />
            <line x1={52.5 * 1.25} y1={-161.7 * 1.25} x2={52.5 * 0.8} y2={-161.7 * 0.8} stroke={C.gold} strokeWidth={6} />
            <line x1={0} y1={0} x2={150 * Math.cos((ang * Math.PI) / 180)} y2={150 * Math.sin((ang * Math.PI) / 180)} stroke="#fff" strokeWidth={8} strokeLinecap="round" />
            <circle r={18} fill={fire ? C.red : C.gold} style={{ filter: `drop-shadow(0 0 ${fire ? 20 : 8}px ${fire ? C.red : C.gold})` }} />
          </g>
        )}
        {/* 主角 + 护盾 */}
        <Character x={hipX} y={hipY} t={t} chair={false} wind={1.2} id="m3" flip={turned}
          {...legs(f < BF(150.5) ? 0 : 0, 0)} handN={f >= BF(150.5) && f < BF(151.6) ? { x: 150, y: 60 } : { x: 50, y: 10 }} handF={{ x: 20, y: 14 }} />
        {shield > 0 && zoom < 1 && (
          <ellipse cx={hipX + 30} cy={hipY - 40} rx={200 * shield} ry={280 * shield} fill="rgba(46,230,255,0.12)" stroke={C.cyan} strokeWidth={6} opacity={1 - zoom} style={{ filter: `drop-shadow(0 0 20px ${C.cyan})` }} />
        )}
      </svg>
      {dial > 0 && <div style={{ position: 'absolute', left: D.x - 160, top: D.y + 24, width: 320, textAlign: 'center', fontWeight: 900, fontSize: 32, color: fire ? C.red : '#fff', transform: `scale(${dial})` }}>{fire ? '熔断已触发！' : '熔断闹钟'}</div>}
      {line > 0 && <div style={{ position: 'absolute', left: 560, top: GROUND + 16, width: 380, textAlign: 'center', fontWeight: 900, fontSize: 28, color: C.gold, opacity: line }}>进场前先画好底线</div>}
      <MethodCard f={f} at={A3 + 2} num="方法 03" title={<>事前设好“<Hi>熔断线</Hi>”</>} />
      {RULES.map(([r, col], i) => (
        <Holo key={i} x={1040} y={270 + i * 140} w={780} k={pk(f, BF(152 + i), 9)} col={col} bg={i === 2 ? 'rgba(40,26,4,0.9)' : 'rgba(4,30,48,0.9)'} pad="14px 28px">
          <div style={{ fontWeight: 900, fontSize: 42, lineHeight: '64px', color: '#fff', whiteSpace: 'nowrap' }}>{r}</div>
        </Holo>
      ))}
      {f >= BF(158.3) && (
        <div style={{ position: 'absolute', left: 1180, top: 760, transform: `scale(${pk(f, BF(158.3), 8)})`, transformOrigin: '100% 50%' }}>
          <span style={{ padding: '4px 18px', borderRadius: 12, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 30, lineHeight: '46px', boxShadow: `0 0 20px ${C.gold}` }}>心率回落 · 回到最佳状态 ↘</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const S6Method: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = tw(f, BF(128), BF(128) + 10, 0, 1, EO);
  const sw2 = tw(f, A2 - 4, A2 + 4, 0, 1, EIO), sw3 = tw(f, A3 - 4, A3 + 4, 0, 1, EIO);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', background: '#04030E' }}>
      <AbsoluteFill style={{ clipPath: reveal < 1 ? `circle(${reveal * 1200}px at 960px 540px)` : undefined }}>
        <BrightBG f={f} />
        {f < A2 + 4 && <AbsoluteFill style={{ opacity: 1 - sw2, transform: `translateX(${-sw2 * 200}px)` }}><M1 f={f} /></AbsoluteFill>}
        {f >= A2 - 4 && f < A3 + 4 && <AbsoluteFill style={{ opacity: f < A2 + 4 ? sw2 : 1 - sw3, transform: `translateX(${f < A2 + 4 ? (1 - sw2) * 200 : -sw3 * 200}px)` }}><M2 f={f} /></AbsoluteFill>}
        {f >= A3 - 4 && <AbsoluteFill style={{ opacity: f < A3 + 4 ? sw3 : 1, transform: `translateX(${f < A3 + 4 ? (1 - sw3) * 200 : 0}px)` }}><M3c f={f} /></AbsoluteFill>}
      </AbsoluteFill>
      {reveal > 0 && reveal < 1 && (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={960} cy={540} r={reveal * 1200} fill="none" stroke="#fff" strokeWidth={14 * (1 - reveal) + 2} style={{ filter: `drop-shadow(0 0 20px ${C.gold})` }} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
