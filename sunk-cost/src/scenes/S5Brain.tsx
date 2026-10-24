import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { BF, C, EBACK, EI, EIO, EO, FONT, FPS, glow, shake, tw } from '../lib';
import { Character, legs } from '../components/Character';
import { Hi, Holo, Insight, ek, life, pk } from '../components/UI';

/* ============================================================
   第五段 · 讲原理：解剖大脑的“死磕程序”（68.61 – 91.43s，第 96–128 拍）
   机制 01 杏仁核劫持 + 损失厌恶天平（96–108 拍）
   机制 02 工作记忆被旧账占满（108–118 拍）
   机制 03 简单任务 vs 精细任务（118–128 拍）
   ============================================================ */

const M2 = BF(108), M3 = BF(118);

/** 神经元网络背景 */
const Neurons: React.FC<{ f: number; tint?: string }> = ({ f, tint = '#0E2260' }) => {
  const N = 28;
  const pts = Array.from({ length: N }, (_, i) => ({ x: random('nx' + i) * 1920, y: random('ny' + i) * 1080 }));
  const links: [number, number][] = [];
  pts.forEach((p, i) => pts.forEach((q, j) => { if (j > i && Math.hypot(p.x - q.x, p.y - q.y) < 330) links.push([i, j]); }));
  const drift = (i: number) => ({ x: Math.sin(f / 50 + i) * 8, y: Math.cos(f / 60 + i * 1.3) * 8 });
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${tint} 0%, #06103A 50%, #020616 100%)` }} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        {links.map(([i, j], k) => {
          const a = pts[i], b = pts[j], da = drift(i), db = drift(j);
          const ph = ((f / 40 + random('lp' + k)) % 1);
          return (
            <g key={k}>
              <line x1={a.x + da.x} y1={a.y + da.y} x2={b.x + db.x} y2={b.y + db.y} stroke="#3A6CFF" strokeWidth={1.5} opacity={0.22} />
              <circle cx={a.x + da.x + (b.x + db.x - a.x - da.x) * ph} cy={a.y + da.y + (b.y + db.y - a.y - da.y) * ph} r={3} fill={k % 4 ? C.cyan : C.pink} opacity={0.6 * Math.sin(ph * Math.PI)} />
            </g>
          );
        })}
        {pts.map((p, i) => { const d = drift(i); return <circle key={i} cx={p.x + d.x} cy={p.y + d.y} r={4 + random('nr' + i) * 4} fill="#7FA2FF" opacity={0.5} />; })}
      </svg>
    </>
  );
};

const BRAIN = 'M -380 40 C -400 -120 -300 -250 -150 -270 C -40 -330 120 -320 220 -260 C 340 -230 410 -120 400 0 C 420 90 360 170 260 190 C 200 250 80 260 0 230 C -60 260 -180 250 -240 200 C -340 190 -390 120 -380 40 Z';
const SULCI = ['M -250 -120 C -150 -60 -60 -160 40 -100', 'M -300 40 C -200 20 -150 100 -40 60', 'M 60 -200 C 120 -120 220 -160 300 -80', 'M 80 40 C 160 0 240 80 330 30', 'M 20 -300 C 0 -200 60 -120 30 -20', 'M -160 -230 C -120 -160 -200 -100 -150 -30'];
const PFC = { x: 300, y: -70 }, AMY = { x: 30, y: 110 };

/* ---------------- 机制 01 ---------------- */
const Mech1: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const shift = tw(f, BF(101), BF(101.7), 0, 1, EIO);
  const bx = 900 - 380 * shift, by = 540 + 20 * shift, bs = 1 - 0.32 * shift;
  const G = (p: { x: number; y: number }) => ({ x: bx + p.x * bs, y: by + p.y * bs });
  const draw = tw(f, BF(96), BF(97.2), 0, 1, EO);
  const alarm = f >= BF(98) ? 1 : 0;
  const arcs = f >= BF(99) && f < BF(101) + 6;
  const dead = f >= BF(100);
  const pf = G(PFC), am = G(AMY);
  const sh = shake(f, BF(100), 10, 14, 'm100');
  // 天平
  const balIn = life(f, BF(101.5), BF(105), 8, 6);
  const theta = f < BF(103) ? -16 * tw(f, BF(101.5), BF(102.2), 0, 1, EBACK) : -16 + 16 * tw(f, BF(103), BF(103) + 10, 0, 1, EBACK);
  const plus = f >= BF(103) ? pk(f, BF(103), 8) : 0;
  const keyIn = tw(f, BF(105), BF(105) + 8, 0, 1, EBACK);
  const hover = Math.sin((f - BF(105)) / 6) * 0.5 + 0.5;
  const P = { x: 1350, y: 300 };
  const end = (s: number) => ({ x: P.x + s * 270 * Math.cos((theta * Math.PI) / 180), y: P.y + s * 270 * Math.sin((theta * Math.PI) / 180) });
  const L = end(-1), R = end(1);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <g transform={`translate(${bx} ${by}) scale(${bs})`}>
          <path d={BRAIN} fill="rgba(20,60,140,0.25)" stroke={C.cyan} strokeWidth={5} strokeDasharray={3000} strokeDashoffset={3000 * (1 - draw)} style={{ filter: `drop-shadow(0 0 12px ${C.cyan})` }} />
          {SULCI.map((d, i) => <path key={i} d={d} fill="none" stroke={C.cyan} strokeWidth={3} opacity={0.5 * draw} />)}
          <path d="M -60 230 C -60 280 -50 320 -40 350 L 0 350 C 10 300 20 260 20 230" fill="rgba(20,60,140,0.25)" stroke={C.cyan} strokeWidth={4} opacity={draw} />
          {/* 前额叶 */}
          <ellipse cx={PFC.x} cy={PFC.y} rx={95} ry={130} fill={dead ? 'rgba(10,10,20,0.9)' : 'rgba(46,230,255,0.22)'} stroke={dead ? '#445' : C.cyan} strokeWidth={4} opacity={draw} style={{ filter: dead ? 'none' : `drop-shadow(0 0 16px ${C.cyan})` }} />
          {dead && Array.from({ length: 40 }, (_, i) => <rect key={i} x={PFC.x - 80 + random('st' + i + Math.floor(f / 2)) * 160} y={PFC.y - 110 + random('sy' + i + Math.floor(f / 2)) * 220} width={10} height={3} fill="#AAB" opacity={0.6} />)}
          {/* 杏仁核 */}
          {alarm > 0 && [0, 1, 2].map((k) => { const ph = (((f - BF(98)) / 18 + k / 3) % 1); return <ellipse key={k} cx={AMY.x} cy={AMY.y} rx={40 + ph * 140} ry={28 + ph * 100} fill="none" stroke={C.pink} strokeWidth={4} opacity={1 - ph} />; })}
          <ellipse cx={AMY.x} cy={AMY.y} rx={42 + alarm * 6 * Math.sin(f / 2)} ry={28} fill={C.pink} opacity={draw} style={{ filter: `drop-shadow(0 0 ${14 + alarm * 20}px ${C.pink})` }} />
        </g>
        {/* 高压电流 */}
        {arcs && [0, 1, 2].map((k) => {
          const seg = 9, ptsA: string[] = [];
          for (let i = 0; i <= seg; i++) {
            const u = i / seg, j = i === 0 || i === seg ? 0 : (random(`ar${k}-${i}-${Math.floor(f / 2)}`) - 0.5) * 90;
            ptsA.push(`${am.x + (pf.x - am.x) * u + j * 0.6},${am.y + (pf.y - am.y) * u + j}`);
          }
          return <polyline key={k} points={ptsA.join(' ')} fill="none" stroke={k ? C.pink : '#FFFFFF'} strokeWidth={k ? 4 : 6} style={{ filter: `drop-shadow(0 0 12px ${C.pink})` }} />;
        })}
        {/* 天平 */}
        {balIn > 0 && (
          <g opacity={balIn}>
            <line x1={P.x} y1={P.y} x2={P.x} y2={690} stroke={C.gold} strokeWidth={8} />
            <rect x={P.x - 90} y={690} width={180} height={18} rx={8} fill={C.gold} />
            <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke={C.gold} strokeWidth={10} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${C.gold})` }} />
            <circle cx={P.x} cy={P.y} r={14} fill="#fff" />
            {[L, R].map((e, i) => (
              <g key={i}>
                <line x1={e.x} y1={e.y} x2={e.x - 80} y2={e.y + 170} stroke={C.gold} strokeWidth={3} />
                <line x1={e.x} y1={e.y} x2={e.x + 80} y2={e.y + 170} stroke={C.gold} strokeWidth={3} />
                <path d={`M${e.x - 110} ${e.y + 170} Q ${e.x} ${e.y + 230} ${e.x + 110} ${e.y + 170} Z`} fill="#2A1A08" stroke={C.gold} strokeWidth={4} />
              </g>
            ))}
            <rect x={L.x - 80} y={L.y + 70} width={160} height={100} rx={10} fill={C.red} style={{ filter: `drop-shadow(0 0 14px ${C.red})` }} />
            <rect x={R.x - 80} y={R.y + 110} width={160} height={60} rx={10} fill={C.gold} />
            {plus > 0 && <rect x={R.x - 80} y={R.y + 110 - 64 * plus} width={160} height={60} rx={10} fill={C.gold} opacity={plus} />}
          </g>
        )}
        {/* 退出键 */}
        {keyIn > 0 && (
          <g transform={`translate(1300 470) scale(${keyIn})`}>
            <rect x={-170} y={-70} width={340} height={170} rx={30} fill="#5A0618" />
            <rect x={-170} y={-96} width={340} height={170} rx={30} fill={C.red} style={{ filter: `drop-shadow(0 0 22px ${C.red})` }} />
            <path d={`M${200 - hover * 70} ${150 - hover * 40} l 0 -70 l 20 18 l 14 -26 l 12 6 l -14 26 l 26 2 Z`} fill="#fff" stroke={C.ink} strokeWidth={3} />
          </g>
        )}
      </svg>
      {/* 标签 */}
      <div style={{ position: 'absolute', left: pf.x - 120, top: pf.y - 210 * bs - 30, width: 240, textAlign: 'center', opacity: draw }}>
        <div style={{ fontWeight: 900, fontSize: 34, lineHeight: '44px', color: dead ? '#8890AA' : C.cyan, textShadow: dead ? 'none' : glow(C.cyan, 0.4) }}>前额叶皮层</div>
        <div style={{ display: 'inline-block', padding: '0 12px', borderRadius: 8, background: dead ? C.red : 'rgba(46,230,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 26, lineHeight: '38px' }}>{dead ? '信号中断' : '理性算账中…'}</div>
      </div>
      <div style={{ position: 'absolute', left: am.x - 140, top: am.y + 60 * bs + 20, width: 280, textAlign: 'center', opacity: draw }}>
        <div style={{ fontWeight: 900, fontSize: 34, lineHeight: '44px', color: C.pink, textShadow: glow(C.pink, 0.4) }}>杏仁核</div>
        <div style={{ display: 'inline-block', padding: '0 12px', borderRadius: 8, background: alarm ? C.pink : 'rgba(255,62,165,0.2)', color: '#fff', fontWeight: 700, fontSize: 26, lineHeight: '38px' }}>{alarm ? '损失警报！' : '情绪警报中枢'}</div>
      </div>
      {balIn > 0 && (
        <>
          <div style={{ position: 'absolute', left: L.x - 80, top: L.y + 70, width: 160, height: 100, textAlign: 'center', opacity: balIn, color: '#fff', fontWeight: 900, fontSize: 28, lineHeight: '34px', paddingTop: 16, boxSizing: 'border-box' }}>失去<br />100 元</div>
          <div style={{ position: 'absolute', left: R.x - 80, top: R.y + 110 - 64 * plus, width: 160, height: 60 + 64 * plus, opacity: balIn, color: C.ink, fontWeight: 900, fontSize: 28, lineHeight: `${60 + 64 * plus}px`, textAlign: 'center' }}>赚到 {plus > 0.5 ? 200 : 100} 元</div>
          <div style={{ position: 'absolute', left: 980, top: 730, width: 740, textAlign: 'center', opacity: balIn * ek(f, BF(103.4), 8) }}>
            <div style={{ fontWeight: 900, fontSize: 40, lineHeight: '54px', color: '#fff' }}>失去 <Hi c={C.red}>100 元</Hi> 的痛 ≈ 赚到 <Hi c={C.gold}>200 元</Hi> 的爽</div>
            <div style={{ fontWeight: 700, fontSize: 26, lineHeight: '38px', color: C.dim }}>损失厌恶：亏损带来的痛感，大约是同等收益的 2 倍</div>
          </div>
        </>
      )}
      {keyIn > 0 && (
        <>
          <div style={{ position: 'absolute', left: 1130, top: 360, width: 340, textAlign: 'center', fontWeight: 900, fontSize: 72, lineHeight: '120px', color: '#fff', transform: `scale(${keyIn})`, transformOrigin: '170px 110px' }}>退出</div>
          <div style={{ position: 'absolute', left: 1080, top: 250, width: 440, textAlign: 'center', opacity: keyIn }}>
            <span style={{ padding: '2px 16px', borderRadius: 10, background: 'rgba(40,4,20,0.9)', border: `2px solid ${C.red}`, color: '#FFD6DE', fontWeight: 900, fontSize: 32, lineHeight: '46px' }}>按下去 = 坐实亏了</span>
          </div>
        </>
      )}
      <Holo x={84} y={60} w={760} k={pk(f, BF(96.5), 9)} col={C.pink} bg="rgba(40,4,30,0.86)" origin="0 50%">
        <div style={{ display: 'inline-block', padding: '0 12px', borderRadius: 8, background: C.pink, color: C.ink, fontWeight: 900, fontSize: 26, lineHeight: '38px' }}>机制 01</div>
        <div style={{ fontWeight: 900, fontSize: 46, lineHeight: '62px', color: '#fff' }}>杏仁核的“损失厌恶”劫持</div>
      </Holo>
      <Insight x={140} y={800} w={1300} k={tw(f, BF(105.3), BF(105.3) + 8, 0, 1, EO)} tag="致命幻觉" size={46}
        lines={[<>只要我不按下“<Hi c={C.red}>退出键</Hi>”，</>, <>这笔账在心理上就<Hi c={C.gold}>还没算亏</Hi>！</>]} />
    </AbsoluteFill>
  );
};

/* ---------------- 机制 02 ---------------- */
const SLOTS = ['已花的钱', '耗掉的时间', '我不甘心', '怕人笑话'];
const Mech2: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const drops = [108.5, 109, 109.5, 110];
  const filled = drops.filter((d) => f >= BF(d)).length;
  const meter = tw(f, BF(108.5), BF(110) + 4, 0, 1, EIO);
  let cam = { x: 0, y: 0 };
  drops.forEach((d) => { const s = shake(f, BF(d), 5, 8, 'dr' + d); cam.x += s.x; cam.y += s.y; });
  const packets = [[111, '新机会'], [112, '换条路'], [113, '及时止损']] as const;
  const fan = f / 1.2;
  return (
    <AbsoluteFill style={{ transform: `translate(${cam.x}px, ${cam.y}px)` }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <rect x={290} y={300} width={1340} height={380} rx={20} fill="rgba(6,24,40,0.85)" stroke={C.cyan} strokeWidth={3} />
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={300 + i * 45} y1={680} x2={300 + i * 45} y2={700 + (i % 3) * 10} stroke={C.cyan} strokeOpacity={0.3} strokeWidth={2} />)}
        {SLOTS.map((_, i) => {
          const x = 340 + i * 320;
          const k = tw(f, BF(drops[i]) - 6, BF(drops[i]), 0, 1, EI);
          const y = 330 - 520 * (1 - k);
          return (
            <g key={i}>
              <rect x={x} y={330} width={280} height={320} rx={10} fill="#030C18" stroke={C.cyan} strokeOpacity={0.6} strokeWidth={3} />
              {Array.from({ length: 12 }, (_, j) => <rect key={j} x={x + 14 + j * 22} y={634} width={12} height={12} fill={C.gold} opacity={0.7} />)}
              {k > 0 && (
                <g transform={`translate(0 ${y - 330})`}>
                  <rect x={x + 16} y={360} width={248} height={250} rx={12} fill="#3A2A30" stroke="#7A3A40" strokeWidth={5} />
                  {[[30, 380], [234, 380], [30, 590], [234, 590]].map(([rx, ry], j) => <circle key={j} cx={x + rx} cy={ry} r={7} fill="#7A5A60" />)}
                  {f >= BF(drops[i]) && Array.from({ length: 4 }, (_, j) => {
                    const ph = ((t * 0.7 + j / 4 + i * 0.13) % 1);
                    return <circle key={'sm' + j} cx={x + 80 + j * 40 + Math.sin(ph * 6) * 12} cy={350 - ph * 160} r={14 + ph * 30} fill={C.red} opacity={0.32 * (1 - ph)} />;
                  })}
                </g>
              )}
              {f >= BF(drops[i]) && f < BF(drops[i]) + 10 && Array.from({ length: 10 }, (_, j) => {
                const kk = (f - BF(drops[i])) / 10, a = Math.PI + (j / 9) * Math.PI;
                return <circle key={'sp' + j} cx={x + 140 + Math.cos(a) * 160 * kk} cy={360 + Math.sin(a) * 90 * kk} r={4 * (1 - kk) + 1} fill={C.gold} />;
              })}
            </g>
          );
        })}
        {/* 数据包被弹飞 */}
        {packets.map(([n, _l], i) => {
          const a = BF(n), k1 = tw(f, a - 10, a, 0, 1, EI), k2 = tw(f, a, a + 14, 0, 1, EO);
          if (f < a - 10 || f > a + 16) return null;
          const x = f < a ? 2000 - (2000 - 1660) * k1 : 1660 + 240 * k2, y = f < a ? 420 + i * 60 : 420 + i * 60 - 320 * k2;
          return <g key={i} transform={`translate(${x} ${y}) rotate(${f < a ? 0 : k2 * 260})`}><rect x={-80} y={-44} width={160} height={88} rx={14} fill="rgba(46,230,255,0.25)" stroke={C.cyan} strokeWidth={4} style={{ filter: `drop-shadow(0 0 14px ${C.cyan})` }} /></g>;
        })}
        {/* 风扇狂转 */}
        <g transform="translate(1760 490)">
          <circle r={70} fill="#030C18" stroke={C.red} strokeWidth={4} />
          {[0, 1, 2, 3].map((k) => <path key={k} d="M0 0 Q 30 -50 0 -62 Q -20 -40 0 0" fill={C.red} opacity={0.75} transform={`rotate(${fan * 47 + k * 90})`} />)}
        </g>
      </svg>
      {SLOTS.map((s, i) => {
        const k = tw(f, BF(drops[i]) - 6, BF(drops[i]), 0, 1, EI);
        return k > 0 ? <div key={i} style={{ position: 'absolute', left: 356 + i * 320, top: 440 - 520 * (1 - k), width: 248, textAlign: 'center', fontWeight: 900, fontSize: 40, lineHeight: '50px', color: '#FFE0E4', textShadow: glow(C.red, 0.4) }}>[{s}]</div> : null;
      })}
      {packets.map(([n, l], i) => {
        const a = BF(n), k1 = tw(f, a - 10, a, 0, 1, EI), k2 = tw(f, a, a + 14, 0, 1, EO);
        if (f < a - 10 || f > a + 16) return null;
        const x = f < a ? 2000 - (2000 - 1660) * k1 : 1660 + 240 * k2, y = f < a ? 420 + i * 60 : 420 + i * 60 - 320 * k2;
        return <div key={i} style={{ position: 'absolute', left: x - 80, top: y - 22, width: 160, textAlign: 'center', fontWeight: 900, fontSize: 30, lineHeight: '44px', color: '#fff', transform: `rotate(${f < a ? 0 : k2 * 260}deg)` }}>{l}</div>;
      })}
      {packets.map(([n], i) => {
        const k = life(f, BF(n), BF(n) + 14, 2, 5);
        return k > 0 ? <div key={'d' + i} style={{ position: 'absolute', left: 1460, top: 236, fontWeight: 900, fontSize: 36, color: C.red, opacity: k, textShadow: glow(C.red, 0.5), transform: `scale(${pk(f, BF(n), 5)})` }}>拒绝访问</div> : null;
      })}
      <div style={{ position: 'absolute', left: 1690, top: 580, width: 140, textAlign: 'center', fontWeight: 700, fontSize: 24, color: C.red }}>过载狂转</div>
      {/* 内存条占用 */}
      <div style={{ position: 'absolute', left: 290, top: 712, width: 1340, opacity: 1 - tw(f, BF(115), BF(115) + 6, 0, 1) }}>
        <div style={{ height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
          <div style={{ width: `${meter * 100}%`, height: '100%', background: meter > 0.99 ? C.red : C.gold, boxShadow: `0 0 20px ${C.red}` }} />
        </div>
        <div style={{ marginTop: 6, fontWeight: 900, fontSize: 30, color: meter > 0.99 ? C.red : C.gold }}>工作记忆占用 {Math.round(meter * 100)}%{meter > 0.99 && (Math.floor(f / 6) % 2 ? '  ⚠ RAM FULL' : '')}</div>
      </div>
      <Holo x={290} y={90} w={1340} k={pk(f, BF(108), 9)} col={C.red} bg="rgba(44,4,14,0.9)" pad="14px 26px">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>
          <span style={{ padding: '0 12px', borderRadius: 8, background: C.red, color: '#fff', fontWeight: 900, fontSize: 28, lineHeight: '42px' }}>机制 02</span>
          <span style={{ fontWeight: 900, fontSize: 48, lineHeight: '64px', color: '#fff' }}>工作记忆 100% 过载</span>
          <span style={{ fontWeight: 900, fontSize: 36, color: C.red }}>RAM FULL</span>
        </div>
      </Holo>
      <Insight x={240} y={770} w={1220} k={tw(f, BF(115), BF(115) + 8, 0, 1, EO)} tag="核心洞见" size={44} col={C.cyan} bg="rgba(4,22,36,0.92)"
        lines={[<>脑子全在算“<Hi c={C.red}>过去的旧账</Hi>”，</>, <>就再也没有 1MB 内存去算“<Hi c={C.cyan}>未来的出路</Hi>”！</>]} />
    </AbsoluteFill>
  );
};

/* ---------------- 机制 03 ---------------- */
const Mech3: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const open = tw(f, M3, M3 + 9, 0, 1, EO);
  const slideU = ((f - M3) / 40) % 1;
  const sx = 170 + 600 * slideU, sy = 380 + 330 * slideU;
  const checks = ['切掉烂摊子', '承认看走眼', '重新规划路线'];
  const e95 = tw(f, BF(119), BF(123), 0, 0.95, EIO);
  const ban = tw(f, BF(124), BF(124) + 8, 0, 1, EO);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${960 + (1 - open) * 960}px 0 0)`, background: 'linear-gradient(160deg, #3A0838 0%, #1A0420 100%)' }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <path d="M120 460 L860 800 L860 840 L120 500 Z" fill={C.pink} opacity={0.85} style={{ filter: `drop-shadow(0 0 18px ${C.pink})` }} />
          {Array.from({ length: 5 }, (_, i) => <line key={i} x1={sx - 60 - i * 40} y1={sy - 40 - i * 18} x2={sx - 120 - i * 40} y2={sy - 66 - i * 18} stroke="#fff" strokeWidth={3} opacity={0.5} />)}
          <Character x={sx} y={sy} scale={0.62} rot={-62} t={t} chair={false} wind={1.6} eyesClosed={1} id="slide"
            handN={{ x: -40, y: -60 }} handF={{ x: -60, y: -40 }} kneeN={{ x: 110, y: 20 }} footN={{ x: 200, y: 40 }} kneeF={{ x: 100, y: 30 }} footF={{ x: 190, y: 60 }} />
        </svg>
        <div style={{ position: 'absolute', left: 110, top: 160, width: 760 }}>
          <div style={{ fontWeight: 900, fontSize: 56, lineHeight: '70px', color: C.pink, textShadow: glow(C.pink, 0.5) }}>无脑继续死磕</div>
          <div style={{ fontWeight: 900, fontSize: 38, lineHeight: '54px', color: '#fff' }}>＝ 低耗能【简单任务】</div>
          <div style={{ fontWeight: 700, fontSize: 28, lineHeight: '40px', color: C.dim }}>顺应本能，闭着眼往下滑</div>
        </div>
        <div style={{ position: 'absolute', left: 110, top: 880, width: 740 }}>
          <div style={{ fontWeight: 900, fontSize: 30, color: '#fff', marginBottom: 8 }}>大脑耗能 <span style={{ color: C.pink }}>5%</span></div>
          <div style={{ height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.12)' }}><div style={{ width: '5%', height: '100%', borderRadius: 11, background: C.pink }} /></div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${960 + (1 - open) * 960}px)`, background: 'linear-gradient(200deg, #06304A 0%, #041A2C 100%)' }}>
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          <rect x={1250} y={540} width={420} height={250} rx={18} fill="#062A3E" stroke={C.cyan} strokeWidth={4} style={{ filter: `drop-shadow(0 0 16px ${C.cyan})` }} />
          {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={1290 + (i % 6) * 66} cy={710 + Math.floor(i / 6) * 44} r={12} fill={(Math.floor(f / 4) + i) % 3 ? C.cyan : C.gold} opacity={0.8} />)}
          {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1330 + i * 130} 625) rotate(${f * (i % 2 ? -6 : 6)})`}>{[0, 60, 120, 180, 240, 300].map((a) => <rect key={a} x={-6} y={-38} width={12} height={16} fill={C.cyan} transform={`rotate(${a})`} />)}<circle r={26} fill="none" stroke={C.cyan} strokeWidth={6} /></g>)}
          <Character x={1130} y={738} scale={0.8} t={t} chair={false} wind={0.6} id="ctl" {...legs(0, 0)}
            handN={{ x: 180 + Math.sin(t * 14) * 14, y: -90 }} handF={{ x: 160 + Math.cos(t * 12) * 14, y: -100 }} headTilt={8} />
          {Array.from({ length: 2 }, (_, i) => { const ph = ((t * 1.3 + i / 2) % 1); return <path key={i} d="M0 -9 Q 6 2 0 7 Q -6 2 0 -9 Z" transform={`translate(${1215 + ph * 6} ${520 + ph * 40})`} fill={C.cyan} opacity={1 - ph} />; })}
        </svg>
        <div style={{ position: 'absolute', left: 1050, top: 150, width: 780 }}>
          <div style={{ fontWeight: 900, fontSize: 56, lineHeight: '70px', color: C.cyan, textShadow: glow(C.cyan, 0.5) }}>果断认错止损</div>
          <div style={{ fontWeight: 900, fontSize: 38, lineHeight: '54px', color: '#fff' }}>＝ 高耗能【精细任务】</div>
          <div style={{ fontWeight: 700, fontSize: 28, lineHeight: '40px', color: C.dim }}>需要极高的认知控制</div>
        </div>
        {checks.map((c, i) => (
          <div key={c} style={{ position: 'absolute', left: 1300, top: 345 + i * 56, opacity: ek(f, BF(119 + i), 6), transform: `translateX(${(1 - ek(f, BF(119 + i), 6)) * 30}px)`, fontWeight: 900, fontSize: 32, lineHeight: '50px', color: '#fff' }}>
            <span style={{ color: C.gold, marginRight: 10 }}>✓</span>{c}</div>
        ))}
        <div style={{ position: 'absolute', left: 1050, top: 880, width: 400 }}>
          <div style={{ fontWeight: 900, fontSize: 30, color: '#fff', marginBottom: 8 }}>大脑耗能 <span style={{ color: C.cyan }}>{Math.round(e95 * 100)}%</span></div>
          <div style={{ height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.12)' }}><div style={{ width: `${e95 * 100}%`, height: '100%', borderRadius: 11, background: C.cyan, boxShadow: `0 0 12px ${C.cyan}` }} /></div>
        </div>
      </AbsoluteFill>
      {/* 分割线 + VS */}
      <div style={{ position: 'absolute', left: 957, top: 0, width: 6, height: 1080 * open, background: '#fff', boxShadow: `0 0 18px ${C.gold}` }} />
      <div style={{ position: 'absolute', left: 900, top: 470, width: 120, height: 120, borderRadius: 60, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 50, lineHeight: '120px', textAlign: 'center', transform: `scale(${pk(f, M3 + 4, 9)})`, boxShadow: `0 0 30px ${C.gold}` }}>VS</div>
      <div style={{ position: 'absolute', left: 0, width: 1920, top: 50, textAlign: 'center', opacity: ek(f, M3 + 2, 8) }}>
        <div style={{ display: 'inline-block', padding: '6px 26px', borderRadius: 16, background: 'rgba(6,4,22,0.92)', border: `2px solid ${C.gold}`, boxShadow: `0 0 20px ${C.gold}66` }}>
        <span style={{ padding: '0 14px', borderRadius: 8, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 28, lineHeight: '42px', marginRight: 16, verticalAlign: 'middle' }}>机制 03</span>
        <span style={{ fontWeight: 900, fontSize: 46, lineHeight: '64px', color: '#fff', verticalAlign: 'middle' }}>大脑天生爱走“省电模式”</span>
        </div>
      </div>
      {ban > 0 && <AbsoluteFill style={{ background: `rgba(4,2,16,${0.78 * ban})` }} />}
      {ban > 0 && (
        <div style={{ position: 'absolute', left: 0, width: 1920, top: 350, textAlign: 'center', opacity: ban, transform: `scale(${1.25 - 0.25 * ban})` }}>
          <div style={{ fontWeight: 900, fontSize: 66, lineHeight: '96px', color: '#fff' }}>你不是舍不得沉没成本，</div>
          <div style={{ fontWeight: 900, fontSize: 76, lineHeight: '110px', color: '#fff' }}>你只是不敢承认“<Hi c={C.gold}>我当初选错了</Hi>”！</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const S5Brain: React.FC = () => {
  const f = useCurrentFrame();
  const flash = 1 - tw(f, BF(96), BF(96) + 8, 0, 1, EO);
  const w2 = tw(f, M2 - 4, M2 + 4, 0, 1, EIO);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', background: '#020616' }}>
      <Neurons f={f} tint={f < M2 ? '#0E2260' : f < M3 ? '#2A0E30' : '#0E2260'} />
      {f < M2 + 4 && <AbsoluteFill style={{ opacity: 1 - w2, transform: `scale(${1 + w2 * 0.3})` }}><Mech1 f={f} /></AbsoluteFill>}
      {f >= M2 - 4 && f < M3 + 9 && <AbsoluteFill style={{ opacity: f < M2 + 4 ? w2 : 1, transform: `scale(${f < M2 + 4 ? 0.8 + 0.2 * w2 : 1})` }}><Mech2 f={f} /></AbsoluteFill>}
      {f >= M3 && <Mech3 f={f} />}
      {flash > 0 && <AbsoluteFill style={{ background: '#E8FDFF', opacity: flash }} />}
    </AbsoluteFill>
  );
};
