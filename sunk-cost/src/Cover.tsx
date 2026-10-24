import React from 'react';
import { AbsoluteFill } from 'remotion';
import './components/Fonts';
import { C, FONT, glow } from './lib';
import { CoverMode, S1Hook } from './scenes/S1Hook';

/* 发布封面（Composition 时长与正片相同，导出第 COVER_FRAME 帧，背景直接取开头场景该帧）：背景 = 片中最吸睛的一帧（第 8.5s 左右，红温小人“激光眼”死盯段位星星）
   横版 1920×1080（抖音横屏封面 16:9） / 竖版 1080×1440（3:4） */
export const COVER_FRAME = 256;

const Title: React.FC<{ size: number; lines: React.ReactNode[] }> = ({ size, lines }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.16, color: C.white, letterSpacing: 2,
    textShadow: `0 6px 0 #2A0A3E, 0 0 26px rgba(255,62,165,0.55)`, whiteSpace: 'nowrap' }}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);
const Key: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: C.pink, textShadow: `0 6px 0 #2A0A3E, ${glow(C.pink, 0.9)}` }}>{children}</span>
);
const Sub: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 900, fontSize: size, color: C.gold, padding: `${size * 0.18}px ${size * 0.42}px`,
    background: 'rgba(12,6,30,0.82)', border: `3px solid ${C.gold}`, borderRadius: size * 0.3, boxShadow: `0 0 24px ${C.gold}66`, textShadow: `0 0 14px ${C.gold}88`, whiteSpace: 'nowrap' }}>
    134秒戒掉中国式内耗：沉没成本谬误
  </div>
);
/** 背景：把开头场景的点 (ox, oy) 放到封面的 (tx, ty)，并以该点为中心缩放 */
const Bg: React.FC<{ scale: number; ox: number; oy: number; tx: number; ty: number }> = ({ scale, ox, oy, tx, ty }) => (
  <div style={{ position: 'absolute', left: tx - ox, top: ty - oy, width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: `${ox}px ${oy}px` }}>
    <CoverMode.Provider value><S1Hook /></CoverMode.Provider>
  </div>
);

export const CoverH: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg0, overflow: 'hidden' }}>
    <Bg scale={1.05} ox={1000} oy={430} tx={960} ty={690} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,3,26,0.97) 0%, rgba(7,3,26,0.9) 24%, rgba(7,3,26,0) 42%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center' }}>
      <Title size={116} lines={[<>为什么你总被<Key>“来都来了”</Key>毁掉？</>]} />
      <div style={{ marginTop: 22 }}><Sub size={52} /></div>
    </div>
  </AbsoluteFill>
);

export const CoverV: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg0, overflow: 'hidden' }}>
    <Bg scale={0.84} ox={1000} oy={430} tx={560} ty={1000} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(7,3,26,1) 0%, rgba(7,3,26,0.97) 44.5%, rgba(7,3,26,0) 60%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center' }}>
      <Title size={124} lines={['为什么你总被', <Key key="k">“来都来了”</Key>, '毁掉？']} />
      <div style={{ marginTop: 34 }}><Sub size={50} /></div>
    </div>
  </AbsoluteFill>
);
