import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BF, C, EIO, EO, FONT, FPS, glow, shake, tw } from '../../lib';
import { Character, legs } from '../../components/Character';
import { Hi, Insight, Rant, ScenePill, life, pk } from '../../components/UI';

/* 痛点 03 · 学都学了 / 写都写了（第 65–79 拍）
   死胡同里抱着废稿和旧教材，一下下撞玻璃墙 → 两句自我感动 → 身后就是阳光出口，却被“旧日历”堆死 → 真相 */

const GROUND = 880;
const HITS = [66, 67, 68, 69, 71, 73, 75, 77];
const GLASS_X = 1235;

function hitK(f: number) {
  let k = 0;
  for (const n of HITS) {
    const d = (f - BF(n)) / 21.39;
    if (d > -0.35 && d < 0.4) k = Math.max(k, d < 0 ? Math.cos((d / 0.35) * Math.PI / 2) ** 2 : Math.cos((d / 0.4) * Math.PI / 2) ** 2);
  }
  return k;
}

export const ExAlley: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const step = tw(f, BF(65), BF(65.8), 0, 1, EIO);
  const hipX = 960 + 50 * step;
  const hk = hitK(f);
  const hits = HITS.filter((n) => f >= BF(n)).length;
  let cam = { x: 0, y: 0 };
  HITS.forEach((n) => { const s = shake(f, BF(n), 5, 9, 'ah' + n); cam.x += s.x; cam.y += s.y; });
  const pan = tw(f, BF(73), BF(74), 0, 1, EIO) * (1 - tw(f, BF(76.5), BF(77.5), 0, 1, EIO));
  const doorGlow = 0.55 + 0.45 * pan + 0.1 * Math.sin(t * 3);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', background: C.bg0 }}>
      <AbsoluteFill style={{ transform: `translate(${cam.x + pan * 120}px, ${cam.y}px) scale(${1.02 + pan * 0.03})`, transformOrigin: '400px 600px' }}>
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, #160828 0%, #1E0A30 60%, #0B0418 100%)' }} />
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {/* 砖墙 */}
          {Array.from({ length: 13 }, (_, r) => Array.from({ length: 22 }, (_, i) => (
            <rect key={`${r}-${i}`} x={i * 92 - (r % 2) * 46} y={180 + r * 54} width={88} height={50} fill="#1C0B2E" stroke="#2A1240" strokeWidth={2} opacity={0.9 - random('bk' + r + i) * 0.3} />
          )))}
          {/* 阳光出口（左） */}
          <defs>
            <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFE6A0" /><stop offset="1" stopColor="#FFB23D" stopOpacity="0" /></radialGradient>
          </defs>
          <circle cx={290} cy={600} r={420} fill="url(#sun)" opacity={0.45 * doorGlow} />
          <rect x={170} y={400} width={240} height={480} rx={8} fill="#FFE2A0" opacity={0.95} style={{ filter: `drop-shadow(0 0 ${30 * doorGlow}px ${C.gold})` }} />
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M290 640 L${560 + i * 40} ${420 + i * 100} L${560 + i * 40} ${470 + i * 100} Z`} fill="#FFE2A0" opacity={0.08 * doorGlow} />)}
          {/* 旧日历堆 */}
          {Array.from({ length: 9 }, (_, i) => {
            const yrs = ['2021', '2022', '2023', '2024'];
            const col = i % 3, row = Math.floor(i / 3);
            const x = 430 + col * 120 + (row % 2) * 40, y = GROUND - 110 - row * 104;
            const wob = f >= BF(74) ? Math.sin(f / 2 + i) * 3 : 0;
            return (
              <g key={i} transform={`translate(${x + wob} ${y}) rotate(${(random('cr' + i) - 0.5) * 16})`}>
                <rect x={-58} y={-50} width={116} height={104} rx={8} fill="#E8E2F4" stroke="#6B5A8A" strokeWidth={3} />
                <rect x={-58} y={-50} width={116} height={26} rx={6} fill={C.red} />
                <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill="#2A1A40">{yrs[i % 4]}</text>
              </g>
            );
          })}
          <rect x={0} y={GROUND} width={1920} height={200} fill="#0A0418" />
          <line x1={0} x2={1920} y1={GROUND} y2={GROUND} stroke={C.pink} strokeOpacity={0.45} strokeWidth={3} />
          {/* 此路不通（玻璃墙后） */}
          <g transform="translate(1560 360)">
            <circle r={80} fill="none" stroke={C.red} strokeWidth={14} style={{ filter: `drop-shadow(0 0 16px ${C.red})` }} />
            <rect x={-56} y={-12} width={112} height={24} fill={C.red} />
          </g>
          {/* 钢化玻璃墙 + 裂纹 */}
          <rect x={GLASS_X} y={230} width={40} height={GROUND - 230} fill={C.cyan} opacity={0.16} />
          <line x1={GLASS_X} x2={GLASS_X} y1={230} y2={GROUND} stroke={C.cyan} strokeWidth={4} style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }} />
          <line x1={GLASS_X + 40} x2={GLASS_X + 40} y1={230} y2={GROUND} stroke={C.cyan} strokeWidth={2} opacity={0.6} />
          {hits > 0 && Array.from({ length: Math.min(hits * 2, 14) }, (_, i) => {
            const a = (i / 14) * Math.PI * 2 + 0.3, r = 40 + random('cl' + i) * 110;
            return <path key={i} d={`M${GLASS_X} 418 l ${Math.cos(a) * r * 0.25} ${Math.sin(a) * r} l ${Math.cos(a + 0.4) * 10} ${Math.sin(a + 0.4) * r * 0.4}`} stroke="#E8FDFF" strokeWidth={2.5} fill="none" opacity={0.85} />;
          })}
          {/* 主角：抱着废稿撞墙 */}
          <Character x={hipX} y={GROUND - 222} t={t} chair={false} wind={0.6} rot={hk * 15} headTilt={hk * 8} id="al"
            {...legs(step > 0 && step < 1 ? step * Math.PI * 2 : 0, step > 0 && step < 1 ? 0.6 : 0)} handN={{ x: 150, y: -120 }} handF={{ x: 130, y: -150 }} />
          {/* 废稿与旧教材 */}
          <g transform={`rotate(${hk * 15} ${hipX} ${GROUND - 222}) translate(${hipX + 120} ${GROUND - 330})`}>
            {Array.from({ length: 9 }, (_, i) => (
              <rect key={i} x={-46 + (random('pp' + i) - 0.5) * 10} y={-i * 22} width={96} height={20} rx={3} fill={i % 3 === 0 ? '#5B3C8A' : '#EDE6FF'} stroke="#3A2A5A" strokeWidth={2} />
            ))}
          </g>
          {/* 飘落的纸 */}
          {HITS.map((n, j) => f >= BF(n) && f < BF(n) + 40 ? Array.from({ length: 3 }, (_, i) => {
            const k = (f - BF(n)) / 40;
            return <rect key={`${n}-${i}`} x={hipX + 150 - i * 50 - k * 120} y={GROUND - 420 + k * 380 + Math.sin(k * 9 + i) * 20} width={40} height={52} fill="#EDE6FF" opacity={1 - k}
              transform={`rotate(${k * 200 + i * 40 + j * 30} ${hipX + 150 - i * 50 - k * 120} ${GROUND - 420 + k * 380})`} />;
          }) : null)}
        </svg>
        {/* 咚 */}
        {HITS.map((n) => {
          const k = life(f, BF(n), BF(n) + 12, 2, 5);
          return k > 0 ? <div key={n} style={{ position: 'absolute', left: GLASS_X - 150, top: 300 - (f - BF(n)) * 1.5, fontWeight: 900, fontSize: 64, color: C.cyan, opacity: k, textShadow: glow(C.cyan, 0.6), transform: `scale(${pk(f, BF(n), 5)}) rotate(-10deg)` }}>咚！</div> : null;
        })}
        <div style={{ position: 'absolute', left: 1440, top: 470, width: 240, textAlign: 'center', fontWeight: 900, fontSize: 46, color: C.red, textShadow: glow(C.red, 0.6) }}>此路不通</div>
        {f >= BF(73.5) && (
          <div style={{ position: 'absolute', left: 140, top: 320, width: 300, textAlign: 'center', transform: `scale(${pk(f, BF(73.5), 8)})`, opacity: 1 - tw(f, BF(74.9), BF(75.2), 0, 1) }}>
            <span style={{ padding: '4px 18px', borderRadius: 12, background: C.gold, color: C.ink, fontWeight: 900, fontSize: 34, lineHeight: '50px', boxShadow: `0 0 20px ${C.gold}` }}>← 转身就是出口</span>
          </div>
        )}
        {f >= BF(74) && (
          <div style={{ position: 'absolute', left: 440, top: GROUND - 440, width: 360, textAlign: 'center', transform: `scale(${pk(f, BF(74), 8)})`, opacity: f >= BF(77) ? 1 - tw(f, BF(77), BF(77.5), 0, 1) : 1 }}>
            <span style={{ padding: '2px 14px', borderRadius: 10, background: 'rgba(40,4,20,0.9)', border: `2px solid ${C.red}`, color: '#FFD6DE', fontWeight: 900, fontSize: 30, lineHeight: '44px' }}>旧日历堵住了退路</span>
          </div>
        )}
      </AbsoluteFill>
      <Rant x={180} y={150} w={1000} f={f} k={pk(f, BF(67), 8) * (1 - tw(f, BF(70.4), BF(70.8), 0, 1))} tail="right" lines={['这方案我改了三天三夜，', '怎么能推翻重来？！']} />
      <Rant x={140} y={150} w={1080} f={f} k={pk(f, BF(70.6), 8) * (1 - tw(f, BF(75), BF(75.4), 0, 1))} tail="right" lines={['这个专业 / 行业我熬了四年，', '现在转行，我前四年算什么？！']} />
      <Insight x={300} y={128} w={1080} k={tw(f, BF(75.2), BF(75.2) + 8, 0, 1, EO)} tag="真相" size={46}
        lines={[<>前四年已经<Hi c={C.gold}>沉没</Hi>了，</>, <>继续死磕 ＝ 再赔上<Hi c={C.red}>未来的十年</Hi>！</>]} />
      <ScenePill k={tw(f, BF(65) + 4, BF(65) + 12, 0, 1, EO)} num="痛点 03" text="学都学了" sub="写都写了" />
    </AbsoluteFill>
  );
};
