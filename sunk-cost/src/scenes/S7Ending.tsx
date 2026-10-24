import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { BF, C, EIO, EO, FONT, FPS, tw } from '../lib';
import { Character, legs } from '../components/Character';

/* ============================================================
   第七段 · 留白结尾：跳下错误的列车（114.25 – 134.2s，第 160 拍起）
   黎明山顶站台：旧列车冒着黑烟沿下坡远去，小人伸懒腰，转身走向发光的花海
   128.8s 起画面渐黑 → 131.6s 起纯黑白字金句静止定格（全程静音）
   ============================================================ */

const PLAT_Y = 760;
const FADE_A = 128.8 * FPS, FADE_B = 131.0 * FPS;
const TEXT_A = 131.15 * FPS, TEXT_B = 131.6 * FPS;

const sky = (k: number) => `linear-gradient(180deg, #0A1A44 0%, #24356E ${40 - k * 6}%, #6A5A9A ${60 - k * 6}%, #FFB06A ${78 - k * 4}%, #FFD79A 90%)`;

export const S7Ending: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const dawn = tw(f, BF(160), BF(180), 0, 1, EIO);
  const train = tw(f, BF(160), BF(170), 0, 1, EIO);
  const stretch = tw(f, BF(162), BF(163), 0, 1, EIO) * (1 - tw(f, BF(165), BF(166), 0, 1, EIO));
  const walkK = tw(f, BF(169), BF(181), 0, 1);
  const walking = f >= BF(169);
  const SC = 0.72;
  const hipX = 960 + 480 * walkK;
  const groundAt = (x: number) => (x < 1100 ? PLAT_Y : PLAT_Y + (x - 1100) * 0.06);
  const hipY = groundAt(hipX) - 222 * SC - (walking ? Math.abs(Math.sin(t * 5.5)) * 5 : 0);
  const l1 = tw(f, BF(164), BF(164) + 18, 0, 1, EO), l2 = tw(f, BF(168), BF(168) + 18, 0, 1, EO);
  const fade = tw(f, FADE_A, FADE_B, 0, 1, EIO);
  const textK = tw(f, TEXT_A, TEXT_B, 0, 1, EO);
  const bloom = (i: number) => tw(f, BF(166) + i * 3, BF(166) + i * 3 + 14, 0, 1, EO);
  const sunY = 690 - 90 * dawn;

  if (f >= TEXT_A - 1) {
    // 纯黑白字金句：不做任何运动，安静定格
    return (
      <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
        <div style={{ position: 'absolute', left: 0, width: 1920, top: 412, textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 68, lineHeight: '128px', opacity: textK, letterSpacing: 4 }}>
          <div>别让一句“来都来了”，</div>
          <div>绑架你原本可以翻盘的人生。</div>
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ background: sky(dawn) }} />
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id="sun7"><stop offset="0" stopColor="#FFF4D6" /><stop offset="0.35" stopColor="#FFD27A" stopOpacity="0.9" /><stop offset="1" stopColor="#FFB06A" stopOpacity="0" /></radialGradient>
        </defs>
        {/* 星星渐隐 */}
        {Array.from({ length: 80 }, (_, i) => (
          <circle key={i} cx={random('s7x' + i) * 1920} cy={random('s7y' + i) * 520} r={1 + random('s7r' + i) * 2} fill="#fff"
            opacity={(0.3 + 0.6 * Math.abs(Math.sin(t * 1.5 + i))) * (1 - dawn * 0.8)} />
        ))}
        {/* 朝阳 */}
        <circle cx={1500} cy={sunY} r={520} fill="url(#sun7)" opacity={0.75 + 0.25 * dawn} />
        <circle cx={1500} cy={sunY} r={70} fill="#FFF4D6" />
        {/* 远山 */}
        <path d="M0 700 L220 600 L420 660 L640 560 L860 650 L1080 580 L1300 660 L1560 590 L1800 650 L1920 620 L1920 1080 L0 1080 Z" fill="#2A2E5E" opacity={0.85} />
        <path d="M0 780 L260 700 L520 760 L800 690 L1100 770 L1400 720 L1700 780 L1920 740 L1920 1080 L0 1080 Z" fill="#1A1E44" />
        {/* 花海山坡（右） */}
        <path d={`M1100 ${PLAT_Y} Q 1500 ${PLAT_Y + 10} 1920 ${PLAT_Y + 60} L1920 1080 L1100 1080 Z`} fill="#141A3A" />
        {Array.from({ length: 46 }, (_, i) => {
          const x = 1140 + random('fx' + i) * 760, y = PLAT_Y + 30 + random('fy' + i) * 260;
          const col = [C.cyan, C.pink, C.gold][i % 3], b = bloom(i % 12);
          return <g key={i} transform={`translate(${x} ${y}) scale(${0.4 + 0.6 * b})`}>
            <line x1={0} y1={0} x2={0} y2={24} stroke="#3A6A6A" strokeWidth={3} />
            {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-9} rx={5} ry={10} fill={col} opacity={0.85} transform={`rotate(${a + Math.sin(t + i) * 6})`} />)}
            <circle r={4} fill="#fff" style={{ filter: `drop-shadow(0 0 ${6 + 6 * b}px ${col})` }} />
          </g>;
        })}
        {/* 下坡轨道 + 远去的旧列车（左） */}
        <path d={`M420 ${PLAT_Y + 12} Q 200 ${PLAT_Y + 60} -60 ${PLAT_Y + 260}`} stroke="#5A4A6A" strokeWidth={8} fill="none" />
        <path d={`M420 ${PLAT_Y + 32} Q 200 ${PLAT_Y + 80} -60 ${PLAT_Y + 280}`} stroke="#5A4A6A" strokeWidth={5} fill="none" opacity={0.6} />
        {(() => {
          const u = 0.15 + train * 1.05;
          const x = 420 - u * 520, y = PLAT_Y + 12 + u * u * 200;
          const sc = 1 - 0.45 * train;
          return (
            <g transform={`translate(${x} ${y}) rotate(${18 * u}) scale(${sc})`} opacity={1 - tw(train, 0.8, 1, 0, 1)}>
              {Array.from({ length: 6 }, (_, i) => {
                const ph = ((t * 0.7 + i / 6) % 1);
                return <circle key={i} cx={-40 + ph * 120} cy={-150 - ph * 220} r={26 + ph * 50} fill="#141018" opacity={0.7 * (1 - ph)} />;
              })}
              {[0, 1, 2].map((k) => (
                <g key={k} transform={`translate(${k * 190} 0)`}>
                  <rect x={-90} y={-110} width={176} height={96} rx={10} fill="#2A2234" stroke="#6A5A7A" strokeWidth={4} />
                  <circle cx={-50} cy={-8} r={16} fill="#141018" /><circle cx={50} cy={-8} r={16} fill="#141018" />
                  <text x={-2} y={-52} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill="#9A8AAA">{['来都来了', '买都买了', '爱都爱了'][k]}</text>
                </g>
              ))}
              <rect x={-120} y={-150} width={40} height={60} fill="#2A2234" />
            </g>
          );
        })()}
        {/* 山顶站台 */}
        <rect x={420} y={PLAT_Y} width={700} height={40} fill="#22285A" stroke="#BFF6FF" strokeWidth={3} />
        <rect x={420} y={PLAT_Y + 40} width={700} height={300} fill="#141A3A" />
        {[520, 1040].map((x) => (
          <g key={x}>
            <rect x={x - 5} y={PLAT_Y - 220} width={10} height={220} fill="#3A4070" />
            <circle cx={x} cy={PLAT_Y - 226} r={14} fill="#FFE6A0" style={{ filter: 'drop-shadow(0 0 16px #FFD27A)' }} />
          </g>
        ))}
        <rect x={600} y={PLAT_Y - 200} width={260} height={64} rx={10} fill="#0F2A44" stroke="#BFF6FF" strokeWidth={3} />
        <text x={730} y={PLAT_Y - 157} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={32} fill="#BFF6FF">下一站 · 对的风景</text>
        {/* 主角 */}
        <Character x={hipX} y={hipY} scale={SC} t={t} chair={false} wind={0.55} id="end"
          {...legs(walking ? t * 5.5 : 0, walking ? 0.55 : 0)}
          handN={stretch > 0 ? { x: 50 + 130 * stretch, y: 10 - 320 * stretch } : walking ? { x: 40 + Math.sin(t * 5.5) * 30, y: 14 } : { x: 50, y: 10 }}
          handF={stretch > 0 ? { x: 20 - 140 * stretch, y: 14 - 310 * stretch } : walking ? { x: 20 - Math.sin(t * 5.5) * 30, y: 14 } : { x: 20, y: 14 }}
          headTilt={-10 * stretch} eyesClosed={stretch > 0.5 ? 1 : 0} />
        {/* 晨光里的金色粒子 */}
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={'gp' + i} cx={(random('gx' + i) * 1920 + t * 20 * random('gv' + i)) % 1920} cy={300 + random('gy' + i) * 600 - Math.sin(t + i) * 20} r={2 + random('gr' + i) * 2} fill="#FFE6A0" opacity={0.6 * dawn} />
        ))}
      </svg>
      {/* 两行温润的 3D 发光字 */}
      <div style={{ position: 'absolute', left: 0, width: 1920, top: 128, textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: 56, lineHeight: '86px', letterSpacing: 2 }}>
        <div style={{ opacity: l1, transform: `translateY(${(1 - l1) * 20}px)`, textShadow: '0 2px 0 #C9B8E8, 0 4px 0 #9F8CC8, 0 6px 10px rgba(0,0,0,0.4), 0 0 26px rgba(255,236,200,0.8)' }}>已经打翻的牛奶，不值得你再哭一整个夜晚；</div>
        <div style={{ opacity: l2, transform: `translateY(${(1 - l2) * 20}px)`, textShadow: '0 2px 0 #C9B8E8, 0 4px 0 #9F8CC8, 0 6px 10px rgba(0,0,0,0.4), 0 0 26px rgba(255,236,200,0.8)' }}>已经坐错的列车，越早下车，离对的风景越近。</div>
      </div>
      {/* 融进晨曦，再平滑转黑 */}
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 70% 55%, rgba(255,230,170,0.9) 0%, rgba(255,200,120,0) 60%)', opacity: tw(f, BF(178), FADE_A + 20, 0, 0.8) * (1 - fade) }} />
      <AbsoluteFill style={{ background: '#000', opacity: fade }} />
    </AbsoluteFill>
  );
};
