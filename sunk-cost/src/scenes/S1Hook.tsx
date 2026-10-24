import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { BF, C, EBACK, EI, EIO, EO, FONT, FPS, fadeOut, glow, popIn, shake, tw } from '../lib';
import { Character } from '../components/Character';
import { StarShape } from '../components/Icons';

/* ============================================================
   第一段 · 吸睛开头（0 – 11.57s，第 1–4 小节）
   22:55「再赢一把就睡」→ 23:00 惜败 → 拍碎睡觉提醒、红温死磕 → 连跪到 05:30 坠入深渊
   ============================================================ */

/** 封面模式：隐藏吐槽气泡，给封面大标题让位 */
export const CoverMode = React.createContext(false);

const HIP = { x: 500, y: 790 };
const ROOM_SHIFT = 1150;
const fallK = (f: number) => tw(f, BF(15) + 2, BF(16), 0, 1, EI);
const STAR_X = (i: number) => 1400 + (i - 2) * 140, STAR_Y = 300;

const clockText = (f: number) => {
  const steps: [number, number][] = [[0, 55], [BF(1), 56], [BF(2), 57], [BF(3), 58], [BF(3.5), 59], [BF(4), 60], [BF(6), 61], [BF(8), 62], [BF(9), 63], [BF(10), 64], [BF(11), 66]];
  let m = 55;
  for (const [ff, mm] of steps) if (f >= ff) m = mm;
  let total = 22 * 60 + m;
  if (f >= BF(12)) {
    // 10 倍速：23:10 → 次日 05:30
    const k = tw(f, BF(12), BF(14), 0, 1, EIO);
    total = 23 * 60 + 10 + k * (6 * 60 + 20);
  }
  total = Math.floor(total) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export function mixc(a: string, b: string, k: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const kk = Math.min(1, Math.max(0, k));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * kk).toString(16).padStart(2, '0')).join('');
}

/* ---------- 房间背景 ---------- */
const Room: React.FC<{ f: number; dawn: number; red: number }> = ({ f, dawn, red }) => {
  const bld = Array.from({ length: 16 }, (_, i) => ({
    x: 110 + i * 23 + random('bx' + i) * 6, w: 18 + random('bw' + i) * 16, h: 60 + random('bh' + i) * 170,
  }));
  const sky0 = mixc('#0A0F3A', '#E9EEF5', dawn), sky1 = mixc('#2B0E5C', '#FFE6C2', dawn);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mixc('#170A3A', '#2A1C48', dawn * 0.6)} />
          <stop offset="1" stopColor={mixc('#0A0520', '#1A1230', dawn * 0.6)} />
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky0} /><stop offset="1" stopColor={sky1} /></linearGradient>
        <radialGradient id="redamb" cx="0.5" cy="0.55" r="0.7"><stop offset="0" stopColor={C.red} stopOpacity="0" /><stop offset="1" stopColor={C.red} stopOpacity="0.55" /></radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF4DC" stopOpacity="0.55" /><stop offset="1" stopColor="#FFF4DC" stopOpacity="0" /></linearGradient>
        <clipPath id="win"><rect x={110} y={120} width={360} height={350} rx={6} /></clipPath>
      </defs>
      <rect width={1920} height={1080} fill="url(#wall)" />
      <rect x={0} y={60} width={1920} height={3} fill={C.pink} opacity={0.35} />
      <rect x={0} y={928} width={1920} height={152} fill="#080418" />
      {/* 地面透视网格 */}
      <g stroke={C.cyan} strokeOpacity={0.18} strokeWidth={1.5}>
        {Array.from({ length: 21 }, (_, i) => <line key={i} x1={960 + (i - 10) * 60} y1={930} x2={960 + (i - 10) * 260} y2={1080} />)}
        {[0, 18, 42, 76, 120].map((d, i) => <line key={'h' + i} x1={0} x2={1920} y1={930 + d} y2={930 + d} />)}
      </g>
      <rect x={0} y={926} width={1920} height={3} fill={C.cyan} opacity={0.5} />
      {/* 窗户 */}
      <g clipPath="url(#win)">
        <rect x={110} y={120} width={360} height={350} fill="url(#sky)" />
        <circle cx={400} cy={190 + dawn * 120} r={26} fill={mixc('#FFF3C9', '#FFFFFF', dawn)} opacity={1 - dawn * 0.7} style={{ filter: 'drop-shadow(0 0 18px #FFE9A8)' }} />
        {Array.from({ length: 22 }, (_, i) => (
          <circle key={i} cx={120 + random('st' + i) * 340} cy={130 + random('sy' + i) * 160} r={1.6} fill="#fff" opacity={(0.4 + 0.6 * Math.abs(Math.sin(f / 9 + i))) * (1 - dawn)} />
        ))}
        {bld.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={470 - b.h} width={b.w} height={b.h} fill={mixc('#0C0726', '#7E86A0', dawn * 0.8)} />
            {Array.from({ length: Math.floor(b.h / 22) }, (_, j) => (
              random(`w${i}-${j}`) > 0.45 ? <rect key={j} x={b.x + 4} y={470 - b.h + 8 + j * 22} width={b.w - 8} height={6}
                fill={random(`wc${i}-${j}`) > 0.5 ? C.pink : C.gold} opacity={0.75 * (1 - dawn)} /> : null
            ))}
          </g>
        ))}
      </g>
      <rect x={110} y={120} width={360} height={350} rx={6} fill="none" stroke="#5B3BA8" strokeWidth={10} />
      <line x1={290} y1={120} x2={290} y2={470} stroke="#5B3BA8" strokeWidth={6} />
      {/* 清晨惨白阳光 */}
      {dawn > 0 && <polygon points="470,120 470,470 1300,1080 760,1080" fill="url(#beam)" opacity={dawn} />}
      {red > 0 && <rect width={1920} height={1080} fill="url(#redamb)" opacity={red} />}
    </svg>
  );
};

/* ---------- 游戏面板 ---------- */
const Panel: React.FC<{ f: number }> = ({ f }) => {
  const lost = f >= BF(4);
  const crash = f >= BF(12);
  const lit = (i: number) => {
    if (i === 4) return 0;                                    // 第 5 颗永远差一步
    if (i > 0 && f < BF(i)) return 0;                         // 第 1 颗首帧就亮着
    if (i === 3 && f >= BF(4)) return 0;                      // 第 4 颗当场碎掉
    if (crash && i <= 2 && f >= BF(12 + (2 - i))) return 0;   // 连跪时一颗颗掉光
    return 1;
  };
  const border = crash ? C.red : lost ? mixc(C.red, C.cyan, 0.4) : C.cyan;
  const sh = shake(f, BF(4), 10, 14, 'p4');
  const sh2 = crash ? shake(f, BF(12), 80, 8, 'p12') : { x: 0, y: 0 };
  const wins = f >= BF(3) ? 4 : f >= BF(2) ? 3 : f >= BF(1) ? 2 : 1;
  const winPop = wins === 1 ? 1 : popIn(f, [0, BF(1), BF(2), BF(3)][wins - 1], 8);
  const comboFlash = [0, 1, 2, 3].reduce((m, i) => Math.max(m, f >= BF(i) ? Math.max(0, 1 - (f - BF(i)) / 14) : 0), 0);
  const losses = f >= BF(14) ? 8 : f >= BF(13) ? 5 : 3;
  const lossPop = popIn(f, f >= BF(14) ? BF(14) : f >= BF(13) ? BF(13) : BF(12), 7);
  const tag = crash ? ['心态崩了', C.red] : lost ? ['连胜中断', C.red] : ['状态：神仙附体', C.gold];
  return (
    <div style={{ position: 'absolute', left: 1000 + sh.x + sh2.x, top: 140 + sh.y + sh2.y, width: 800, height: 480, fontFamily: FONT }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 22, background: crash ? 'rgba(48,6,20,0.78)' : 'rgba(14,10,46,0.72)',
        border: `2px solid ${border}`, boxShadow: `0 0 26px ${border}88, inset 0 0 40px ${border}33` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: 22, opacity: 0.18,
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0 1px, transparent 1px 5px)' }} />
      <div style={{ position: 'absolute', left: 40, top: 26, color: C.cyan, fontWeight: 700, fontSize: 34, letterSpacing: 2 }}>晋级赛 · 决胜局</div>
      <div style={{ position: 'absolute', right: 36, top: 26, padding: '4px 16px', borderRadius: 10, background: `${tag[1]}22`,
        border: `2px solid ${tag[1]}`, color: tag[1], fontWeight: 900, fontSize: 28, lineHeight: '38px' }}>{tag[0]}</div>
      <svg width={800} height={480} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const on = lit(i); const k = i >= 1 && i <= 3 ? popIn(f, BF(i), 8) : 1;
          const x = STAR_X(i) - 1000, y = STAR_Y - 140;
          const pulse = i === 4 && !lost ? 0.5 + 0.5 * Math.sin(f / 4) : 0;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <StarShape r={50} fill="rgba(255,255,255,0.05)" stroke={i === 4 && !lost ? C.gold : 'rgba(255,255,255,0.28)'} sw={3} style={{ opacity: 0.6 + pulse * 0.4 }} />
              {on > 0 && <g transform={`scale(${0.4 + 0.6 * k})`}><StarShape r={52} fill={C.gold} stroke="#FFF3C4" sw={3} style={{ filter: `drop-shadow(0 0 14px ${C.gold})` }} /></g>}
            </g>
          );
        })}
      </svg>
      {!lost && <div style={{ position: 'absolute', left: 150, top: 200, width: 500, height: 200, borderRadius: '50%',
        background: `radial-gradient(ellipse at center, ${C.gold}88 0%, ${C.gold}00 70%)`, opacity: 0.35 + comboFlash * 0.65, transform: `scale(${0.8 + comboFlash * 0.5})` }} />}
      {!lost && (
        <div style={{ position: 'absolute', left: 0, width: 800, top: 236, textAlign: 'center', color: C.gold, fontWeight: 900, fontSize: 96, lineHeight: '120px',
          transform: `scale(${0.6 + 0.4 * winPop})`, textShadow: glow(C.gold, 0.8) }}>×{wins} 连胜</div>
      )}
      {lost && !crash && (
        <div style={{ position: 'absolute', left: 0, width: 800, top: 236, textAlign: 'center', fontWeight: 900, fontSize: f < BF(8) ? 104 : 64, lineHeight: '120px',
          color: f < BF(8) ? C.red : C.white, transform: `scale(${f < BF(8) ? 1.6 - 0.6 * popIn(f, BF(4), 7) : 1})`,
          textShadow: glow(f < BF(8) ? C.red : C.pink, 0.8) }}>{f < BF(8) ? '惜败  −1★' : `匹配中${'.'.repeat(1 + (Math.floor(f / 5) % 3))}`}</div>
      )}
      {crash && (
        <div style={{ position: 'absolute', left: 0, width: 800, top: 226, textAlign: 'center', color: C.red, fontWeight: 900, fontSize: 120, lineHeight: '140px',
          transform: `scale(${1.5 - 0.5 * lossPop})`, textShadow: glow(C.red, 1) }}>连跪 ×{losses}</div>
      )}
      <div style={{ position: 'absolute', left: 0, width: 800, top: 396, textAlign: 'center', fontWeight: 700, fontSize: 32, lineHeight: '44px',
        color: crash ? '#FFB3C0' : lost ? C.dim : C.cyan }}>
        {crash ? (f >= BF(14) ? '05:30 · 星星全掉光' : '一颗一颗往下掉…') : lost ? '差一点就赢了……' : '再赢 1 把 → 晋级成功'}
      </div>
      {f >= BF(4) && f < BF(4) + 8 && Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{ position: 'absolute', left: -20 + random(`g${f}${i}`) * 60, top: random(`gy${f}${i}`) * 440, width: 840, height: 8 + random(`gh${i}`) * 22,
          background: i % 2 ? C.red : C.cyan, opacity: 0.55, mixBlendMode: 'screen' }} />
      ))}
    </div>
  );
};

/* ---------- 星星点亮时的金色绸带 + 火花 ---------- */
const Ribbons: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="rib" x1="0" x2="1"><stop offset="0" stopColor="#FFF6CF" /><stop offset="0.5" stopColor={C.gold} /><stop offset="1" stopColor={C.pink} stopOpacity="0" /></linearGradient>
    </defs>
    {[0, 1, 2, 3].map((i) => {
      const s = BF(i); if (f < s || f > s + 26) return null;
      const k = (f - s) / 26; const cx = STAR_X(i), cy = STAR_Y;
      return (
        <g key={i} opacity={1 - k}>
          {[0, 1, 2, 3, 4].map((j) => {
            const a = (j * 2 * Math.PI) / 5 + i;
            const r1 = 70 + 300 * EO(k);
            const d = `M${cx} ${cy} Q ${cx + Math.cos(a + 1) * r1 * 0.8} ${cy + Math.sin(a + 1) * r1 * 0.8} ${cx + Math.cos(a) * r1} ${cy + Math.sin(a) * r1}`;
            return <path key={j} d={d} stroke="url(#rib)" strokeWidth={16 * (1 - k) + 3} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.gold})` }} />;
          })}
          <circle cx={cx} cy={cy} r={50 + 150 * EO(k)} fill="none" stroke={C.gold} strokeWidth={8 * (1 - k)} />
          <circle cx={cx} cy={cy} r={40 + 90 * EO(k)} fill="none" stroke="#FFFFFF" strokeWidth={4 * (1 - k)} />
          {Array.from({ length: 18 }, (_, j) => {
            const a = (j / 18) * Math.PI * 2 + random(`sp${i}${j}`);
            const r = 40 + 260 * EO(k) * (0.6 + random(`sr${i}${j}`) * 0.6);
            return <g key={'s' + j} transform={`translate(${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}) rotate(${k * 180})`}>
              <StarShape r={(7 * (1 - k) + 2) * (j % 3 === 0 ? 1.6 : 1)} fill={j % 2 ? '#FFF3C4' : C.gold} /></g>;
          })}
        </g>
      );
    })}
    {f > BF(3) && f < BF(3) + 16 && (
      <rect x={1000 + ((f - BF(3)) / 16) * 900 - 200} y={140} width={120} height={480} fill="#FFF8DD" opacity={0.18} transform="skewX(-20)" />
    )}
  </svg>
);

/* ---------- 桌子、键盘、红色按钮、角色 ---------- */
const DeskAndHero: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const angry = tw(f, BF(8), BF(8) + 6, 0, 1, EO) * (f < BF(12) ? 1 : tw(f, BF(12), BF(14), 1, 0.55));
  const tired = tw(f, BF(12), BF(14), 0, 1);
  const btnUp = tw(f, BF(6), BF(6) + 8, 0, 1, EBACK);
  let rot = 0, headTilt = 0;
  const typing = (k: number) => Math.sin(f * 2.1 + k) * 5;
  let handN = { x: 196 + typing(0), y: -108 - Math.abs(typing(1)) * 1.2 };
  let handF = { x: 176 + typing(2), y: -114 - Math.abs(typing(3)) * 1.2 };
  if (f >= BF(4) && f < BF(8)) {
    // 惜败：僵住 → 头在“睡觉”和“再来一把”之间来回看
    handN = { x: 190, y: -104 }; handF = { x: 172, y: -110 };
    headTilt = f < BF(5) ? tw(f, BF(4), BF(4) + 5, 0, -8) : f < BF(6) ? -14 + Math.sin(f / 3) * 2 : f < BF(7) ? tw(f, BF(6), BF(6) + 5, -14, 10) : 10 + Math.sin(f / 2) * 3;
  }
  if (f >= BF(8) - 5 && f < BF(8) + 10) {
    // 一巴掌拍碎睡觉提醒：近侧手甩向左上方
    const k = tw(f, BF(8) - 5, BF(8), 0, 1, EI) * tw(f, BF(8) + 2, BF(8) + 10, 1, 0, EIO);
    handN = { x: 196 - 250 * k, y: -108 - 220 * k };
    rot = -8 * k;
  }
  if (f >= BF(9) - 4 && f < BF(15)) {
    // 双拳轮流狂砸红色按钮
    rot = tw(f, BF(9) - 4, BF(9), 0, 12, EO);
    const ph = (f - BF(9)) / (BF(9.5) - BF(9));
    const hitN = Math.abs(Math.cos(ph * Math.PI)), hitF = Math.abs(Math.sin(ph * Math.PI));
    const slow = f >= BF(12) ? 0.55 : 1;
    handN = { x: 262, y: -150 + (1 - hitN) * 64 * slow - 30 * (1 - slow) };
    handF = { x: 246, y: -160 + (1 - hitF) * 64 * slow - 30 * (1 - slow) };
    headTilt = 8 + (f >= BF(12) ? 14 * tired : 0);
  }
  // 坠落：房间被镜头甩上去，人基本跟着镜头往下掉，同时翻滚
  let hx = HIP.x, hy = HIP.y;
  const fk = fallK(f);
  if (fk > 0) { hy = HIP.y + ROOM_SHIFT * fk * 0.9 + 60 * fk; hx = HIP.x + 220 * fk; rot = -150 * fk; }
  const flail = fk > 0 ? Math.sin(f / 2) : 0;
  const steam = f >= BF(8) + 4 && f < BF(13);
  const press = f >= BF(9) && f < BF(15) ? Math.abs(Math.sin(((f - BF(9)) / (BF(9.5) - BF(9))) * Math.PI)) : 0;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      {/* 全息投影光锥 */}
      <polygon points="1080,700 1120,700 1800,620 1000,620" fill={f >= BF(12) ? C.red : C.cyan} opacity={0.07} />
      <rect x={1070} y={690} width={60} height={12} rx={4} fill="#1A1040" stroke={C.cyan} strokeWidth={2} />
      {/* 桌子 */}
      <g transform={f >= BF(15) ? `translate(0 ${tw(f, BF(15), BF(16), 0, 60, EI)}) rotate(${tw(f, BF(15), BF(16), 0, 4, EI)} 900 700)` : ''}>
        <rect x={610} y={700} width={630} height={24} rx={6} fill="#130B30" stroke={C.pink} strokeWidth={2.5} style={{ filter: `drop-shadow(0 0 8px ${C.pink})` }} />
        <rect x={640} y={724} width={16} height={204} fill="#0D0724" />
        <rect x={1196} y={724} width={16} height={204} fill="#0D0724" />
        <rect x={640} y={688} width={122} height={12} rx={3} fill="#1B1045" />
        <rect x={646} y={691} width={110} height={4} rx={2} fill={`hsl(${(f * 6) % 360} 90% 65%)`} opacity={0.8} />
        {btnUp > 0 && (
          <g transform={`translate(800 700) scale(1 ${btnUp})`}>
            <rect x={-50} y={-14} width={100} height={14} rx={4} fill="#2A0A1A" stroke={C.red} strokeWidth={2} />
            <ellipse cx={0} cy={-16 + press * 6} rx={42} ry={22} fill={C.red} style={{ filter: `drop-shadow(0 0 ${14 + press * 14}px ${C.red})` }} />
            <ellipse cx={-10} cy={-24 + press * 6} rx={14} ry={6} fill="#FF9AAA" opacity={0.7} />
          </g>
        )}
      </g>
      <Character x={hx} y={hy} rot={rot} t={t} handN={handN} handF={handF} headTilt={headTilt}
        angry={angry} laser={f >= BF(8) + 6 && f < BF(12) ? 0.7 + 0.3 * Math.sin(f) : 0} laserTo={{ x: 1400, y: 300 }} tired={tired}
        wind={1 + angry * 1.5}
        kneeN={flail ? { x: 120, y: -40 + flail * 30 } : undefined} footN={flail ? { x: 150, y: 60 - flail * 40 } : undefined}
        kneeF={flail ? { x: 100, y: -10 - flail * 30 } : undefined} footF={flail ? { x: 60, y: 90 + flail * 40 } : undefined} />
      {steam && Array.from({ length: 8 }, (_, i) => {
        const k = ((f - BF(8) - 4 + i * 6) % 40) / 40;
        return <circle key={i} cx={HIP.x + 70 + Math.sin(i * 2 + f / 6) * 26 + rot * 3} cy={HIP.y - 310 - k * 140} r={10 + k * 26} fill="#FFB3C9" opacity={0.35 * (1 - k)} />;
      })}
    </svg>
  );
};

/* ---------- 气泡、睡觉提醒卡、吐槽大字（跟随镜头） ---------- */
const Overlays: React.FC<{ f: number }> = ({ f }) => {
  // 开场气泡：第 0 帧就在画面上，保证首帧有信息量
  const hookK = f < 6 ? 0.9 + 0.1 * tw(f, 0, 6, 0, 1, EBACK) : 1;
  const hookOut = f >= BF(4) ? fadeOut(f, BF(4) + 2, 6) : 1;
  const crackHook = f >= BF(4);
  const cardIn = popIn(f, BF(5), 9);
  const cardAlive = f >= BF(5) && f < BF(8);
  const cardGlow = f >= BF(6) && f < BF(7) ? 0.6 : 0.2 + 0.2 * Math.sin(f / 4);
  const rantIn = popIn(f, BF(9), 8);
  const cover = React.useContext(CoverMode);
  const rantOn = !cover && (f >= BF(9) && f < BF(12) + 4);
  const press = f >= BF(9) ? Math.abs(Math.sin(((f - BF(9)) / (BF(9.5) - BF(9))) * Math.PI)) : 0;
  return (
    <>
      {hookOut > 0 && (
        <div style={{ position: 'absolute', left: 96, top: 352, width: 560, height: 124, opacity: hookOut, transform: `scale(${hookK})`, transformOrigin: '520px 124px' }}>
          <svg width={560} height={150} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <path d="M14 0 H546 Q560 0 560 14 V110 Q560 124 546 124 H500 L520 150 L470 124 H14 Q0 124 0 110 V14 Q0 0 14 0 Z"
              fill="rgba(255,248,230,0.96)" stroke={C.gold} strokeWidth={4} style={{ filter: `drop-shadow(0 0 16px ${C.gold})` }} />
            {crackHook && <path d="M180 0 L210 40 L190 62 L236 124" stroke="#3A1020" strokeWidth={4} fill="none" />}
          </svg>
          <div style={{ position: 'absolute', inset: 0, textAlign: 'center', fontWeight: 900, fontSize: 62, lineHeight: '124px', color: '#2A0E3C', letterSpacing: 2 }}>再赢一把，就睡！</div>
        </div>
      )}
      {cardAlive && (
        <div style={{ position: 'absolute', left: 130, top: 268, width: 470, height: 214, transform: `scale(${0.5 + 0.5 * cardIn}) translateX(${(1 - cardIn) * -60}px)`, opacity: cardIn, transformOrigin: '235px 107px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'rgba(8,30,48,0.88)', border: `2px solid ${C.cyan}`, boxShadow: `0 0 ${20 + cardGlow * 40}px ${C.cyan}` }} />
          <div style={{ position: 'absolute', left: 28, top: 20, fontWeight: 900, fontSize: 38, color: C.cyan, lineHeight: '48px' }}>⏰ 23:00 该睡了</div>
          <div style={{ position: 'absolute', left: 28, top: 72, fontWeight: 700, fontSize: 28, color: C.white, lineHeight: '38px' }}>明早 9:00 还有季度汇报</div>
          <div style={{ position: 'absolute', left: 28, top: 124, width: 414, height: 64, borderRadius: 14, background: C.cyan, color: C.ink,
            fontWeight: 900, fontSize: 32, lineHeight: '64px', textAlign: 'center' }}>立刻睡觉 · 还能睡满 8 小时</div>
        </div>
      )}
      {/* 拍碎：玻璃碎片 + 挥击弧光 */}
      {f >= BF(8) - 3 && f < BF(8) + 24 && (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {f < BF(8) + 6 && <path d="M690 560 Q 560 300 300 330" stroke="#E8FDFF" strokeWidth={Math.max(1, 18 * (1 - (f - BF(8) + 3) / 9))} fill="none" strokeLinecap="round" opacity={0.85} style={{ filter: `drop-shadow(0 0 12px ${C.cyan})` }} />}
          {Array.from({ length: 26 }, (_, i) => {
            const k = Math.max(0, (f - BF(8)) / 24);
            const a = random('ga' + i) * Math.PI * 2, sp = 200 + random('gs' + i) * 500;
            const x = 365 + Math.cos(a) * sp * k - 200 * k, y = 375 + Math.sin(a) * sp * k + 700 * k * k;
            const s = 14 + random('gz' + i) * 30;
            return <polygon key={i} points={`0,${-s} ${s * 0.7},${s * 0.6} ${-s * 0.6},${s * 0.4}`} transform={`translate(${x} ${y}) rotate(${random('gr' + i) * 360 + k * 400})`}
              fill={i % 4 === 0 ? '#FFFFFF' : C.cyan} opacity={(1 - k) * 0.9} style={{ filter: `drop-shadow(0 0 6px ${C.cyan})` }} />;
          })}
        </svg>
      )}
      {rantOn && (
        <div style={{ position: 'absolute', left: 120, top: 286, width: 880, height: 196, transform: `scale(${0.4 + 0.6 * rantIn}) rotate(${-2 + Math.sin(f / 2) * 0.6}deg)`, transformOrigin: '480px 200px',
          opacity: f >= BF(12) ? fadeOut(f, BF(12), 4) : 1 }}>
          <svg width={880} height={196} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <path d="M20 10 L120 0 L240 14 L380 0 L520 12 L660 0 L860 14 L880 100 L866 180 L640 192 L560 216 L520 186 L300 198 L20 186 L0 100 Z"
              fill="#2A0420" stroke={C.pink} strokeWidth={5} style={{ filter: `drop-shadow(0 0 18px ${C.pink})` }} />
          </svg>
          <div style={{ position: 'absolute', left: 0, top: 22, width: 880, textAlign: 'center', fontWeight: 900, fontSize: 56, lineHeight: '76px', color: '#FFFFFF', textShadow: glow(C.pink, 0.7) }}>
            这把输了，<br />前两小时不就白打了？！</div>
        </div>
      )}
      {f >= BF(8) + 6 && f < BF(12) && (
        <div style={{ position: 'absolute', left: 396, top: 512, padding: '2px 16px', borderRadius: 10, background: C.red, border: '3px solid #fff', color: '#fff', fontWeight: 900, fontSize: 30, lineHeight: '40px',
          transform: `scale(${popIn(f, BF(8) + 6, 7)}) rotate(-6deg)`, boxShadow: `0 0 18px ${C.red}` }}>已红温</div>
      )}
      {/* 红色按钮的全息标签 */}
      {f >= BF(6) && f < BF(15) && (
        <div style={{ position: 'absolute', left: 645, top: 566, width: 330, height: 62, borderRadius: 14, background: 'rgba(60,4,24,0.85)', border: `2px solid ${C.red}`,
          color: '#FFD6DE', fontWeight: 900, fontSize: 38, lineHeight: '58px', textAlign: 'center', boxShadow: `0 0 20px ${C.red}`,
          transform: `scale(${popIn(f, BF(6), 8) * (1 + 0.06 * press)})` }}>
          {f >= BF(12) ? '再来一把 ×8' : '不服！再来一把'}</div>
      )}
    </>
  );
};

/* ---------- 第 4 小节：-1★ 冰雹 ---------- */
const Rain: React.FC<{ f: number }> = ({ f }) => {
  if (f < BF(12)) return null;
  return (
    <AbsoluteFill>
      {Array.from({ length: 34 }, (_, i) => {
        const start = BF(12) + random('rs' + i) * (BF(15.5) - BF(12));
        if (f < start) return null;
        const k = (f - start) / FPS;
        const x = 80 + random('rx' + i) * 1760, y = -80 + 1500 * k * k + 300 * k;
        if (y > 1150) return null;
        const size = 30 + random('rz' + i) * 34;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, fontWeight: 900, fontSize: size, color: C.red, fontFamily: FONT,
          textShadow: glow(C.red, 0.5), transform: `rotate(${(random('rr' + i) - 0.5) * 40}deg)` }}>−1★</div>;
      })}
    </AbsoluteFill>
  );
};

/* ---------- 第 4 小节的大字反问（不跟镜头，保证可读） ---------- */
const BigLines: React.FC<{ f: number }> = ({ f }) => {
  if (f < BF(14) || f >= BF(16)) return null;
  const k = popIn(f, BF(14), 7);
  const sh = shake(f, BF(14), 12, 10, 'bl');
  return (
    <div style={{ position: 'absolute', left: 0, top: 398 + sh.y, width: 1920, height: 176, transform: `translateX(${sh.x}px)`, opacity: f >= BF(15) + 10 ? fadeOut(f, BF(15) + 10, 6) : 1 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(8,2,14,0.9)', borderTop: `3px solid ${C.red}`, borderBottom: `3px solid ${C.red}`,
        transform: `scaleX(${k})` }} />
      <div style={{ position: 'absolute', left: 0, width: 1920, top: 20, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: '134px', color: '#fff',
        textShadow: glow(C.red, 1), transform: `scale(${1.5 - 0.5 * k})`, opacity: k }}>说好的「一把」呢？</div>
    </div>
  );
};

/* ---------- 第 15 拍：地板碎裂（房间坐标系内） ---------- */
const FloorBreak: React.FC<{ f: number }> = ({ f }) => {
  if (f < BF(15)) return null;
  const crack = tw(f, BF(15), BF(15) + 4, 0, 1, EO);
  const g = Math.max(0, (f - BF(15) - 2) / FPS);
  const chunks = [[260, 930, 160], [430, 930, 140], [580, 930, 170], [760, 930, 150], [130, 960, 120], [660, 970, 130]];
  return (
    <svg width={1920} height={1600} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      <rect x={0} y={926} width={1920} height={700} fill="#030108" opacity={crack} />
      {chunks.map(([x, y, w], i) => (
        <polygon key={i} points={`0,0 ${w},${-6 + i * 3} ${w - 20},44 14,52`} fill="#140A30" stroke={C.cyan} strokeWidth={2} strokeOpacity={0.6}
          transform={`translate(${x} ${y + 1200 * g * g * (0.7 + i * 0.1)}) rotate(${g * (i % 2 ? 90 : -70)} ${w / 2} 24)`} />
      ))}
      <g stroke="#FFE1F0" strokeWidth={5} fill="none" opacity={crack * (1 - g * 2)} style={{ filter: `drop-shadow(0 0 8px ${C.pink})` }}>
        <path d="M500 928 L420 980 L380 1080 M500 928 L600 1000 L640 1080 M500 928 L300 960 L120 1040 M500 928 L760 950 L980 1060" />
      </g>
    </svg>
  );
};

/* ---------- 深渊背景 + 下坠速度线（在房间后面/前面） ---------- */
const Void: React.FC<{ f: number }> = () => (
  <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 70%, #2A0D5C 0%, #0E0528 45%, #030108 100%)' }} />
);
const SpeedLines: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  if (k <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {Array.from({ length: 30 }, (_, i) => {
        const y = (((random('ly' + i) * 1400 - f * 90) % 1400) + 1400) % 1400 - 200;
        return <line key={i} x1={random('lx' + i) * 1920} x2={random('lx' + i) * 1920} y1={y} y2={y + 220} stroke={i % 2 ? C.pink : C.cyan} strokeWidth={2 + (i % 3)} opacity={0.55 * k} />;
      })}
    </svg>
  );
};

/* ---------- 主场景 ---------- */
export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const dawn = tw(f, BF(12), BF(14), 0, 1, EIO);
  const red = f < BF(4) ? 0 : f < BF(8) ? 0.25 : f < BF(12) ? 0.55 + 0.15 * Math.sin(f / 3) : 0.7 + 0.25 * Math.sin(f / 1.5);
  let cam = tw(f, 0, BF(4), 1.0, 1.05, EIO);
  if (f >= BF(4)) cam = 1.05 + 0.05 * (1 - tw(f, BF(4), BF(4) + 10, 0, 1, EO));
  if (f >= BF(8)) cam = 1.05 + tw(f, BF(8), BF(12), 0, 0.05);
  if (f >= BF(12)) cam = 1.1 - tw(f, BF(12), BF(15), 0, 0.1);
  const s1 = shake(f, BF(4), 10, 10, 'c4');
  const s2 = shake(f, BF(8), 8, 14, 'c8');
  const mash = { x: 0, y: 0 };
  for (let k = 0; k < 6; k++) { const m = shake(f, BF(9 + k * 0.5), 4, 6, 'm' + k); mash.x += m.x; mash.y += m.y; }
  const s3 = f >= BF(12) ? shake(f, BF(12), BF(16) - BF(12), 7, 'c12') : { x: 0, y: 0 };
  const s4 = shake(f, BF(14), 8, 18, 'c14');
  const fk = fallK(f);
  const camX = s1.x + s2.x + mash.x + s3.x + s4.x, camY = s1.y + s2.y + mash.y + s3.y + s4.y - fk * ROOM_SHIFT;
  const dim = f >= BF(14) ? tw(f, BF(14), BF(14) + 4, 0, 0.5) : 0;
  const clk = clockText(f);
  const clockCol = f >= BF(12) ? (f >= BF(14) ? '#FFFFFF' : C.pink) : f >= BF(4) ? C.red : C.cyan;
  const clockK = f >= BF(4) && f < BF(4) + 10 ? 1.25 - 0.25 * popIn(f, BF(4), 8) : 1;
  return (
    <AbsoluteFill style={{ background: C.bg0, fontFamily: FONT, overflow: 'hidden' }}>
      <Void f={f} />
      <AbsoluteFill style={{ transform: `translate(${camX}px, ${camY}px) scale(${cam})`, transformOrigin: '900px 560px' }}>
        <Room f={f} dawn={dawn} red={red} />
        <FloorBreak f={f} />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 36 }, (_, i) => {
            const x = (random('dx' + i) * 1920 + f * (0.6 + random('dv' + i))) % 1920;
            const y = 80 + ((random('dy' + i) * 900 - f * (0.4 + random('dw' + i) * 0.8)) % 900 + 900) % 900;
            return <circle key={i} cx={x} cy={y} r={1.5 + random('dr' + i) * 2.5} fill={i % 3 ? C.cyan : C.pink} opacity={0.35 + 0.3 * Math.sin(f / 8 + i)} />;
          })}
        </svg>
        <div style={{ position: 'absolute', left: 560, top: 118, width: 400, textAlign: 'center', fontWeight: 900, fontSize: 124, lineHeight: '140px',
          color: clockCol, fontVariantNumeric: 'tabular-nums', letterSpacing: 4, textShadow: glow(clockCol, 0.9),
          transform: `scale(${clockK}) rotate(${f >= BF(12) && f < BF(14) ? Math.sin(f) * 3 : 0}deg)` }}>{clk}</div>
        <Panel f={f} />
        <Ribbons f={f} />
        <DeskAndHero f={f} />
        <Overlays f={f} />
      </AbsoluteFill>
      {dim > 0 && <AbsoluteFill style={{ background: '#05010C', opacity: dim * (1 - fk) }} />}
      <SpeedLines f={f} k={fk} />
      <Rain f={f} />
      <BigLines f={f} />
    </AbsoluteFill>
  );
};