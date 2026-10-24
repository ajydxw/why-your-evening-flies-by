import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import './components/Fonts';
import { BF } from './lib';
import { HUD } from './components/HUD';
import { S1Hook } from './scenes/S1Hook';
import { S2Concept } from './scenes/S2Concept';
import { S34Examples } from './scenes/S34Examples';
import { S5Brain } from './scenes/S5Brain';
import { S6Method } from './scenes/S6Method';
import { S7Ending } from './scenes/S7Ending';

/** 全片时间线（所有场景都使用全局帧号，方便和音乐拍点一一对应） */
export const Main: React.FC = () => {
  const f = useCurrentFrame();
  let scene: React.ReactNode;
  if (f < Math.round(BF(16))) scene = <S1Hook />;            // 0 – 11.57s   吸睛开头
  else if (f < Math.round(BF(32))) scene = <S2Concept />;    // 11.57 – 22.98s 亮出知识点
  else if (f < Math.round(BF(96))) scene = <S34Examples />;  // 22.98 – 68.61s 共鸣举例
  else if (f < Math.round(BF(128))) scene = <S5Brain />;     // 68.61 – 91.43s 讲原理
  else if (f < Math.round(BF(160))) scene = <S6Method />;    // 91.43 – 114.25s 给方法
  else scene = <S7Ending />;                                 // 114.25 – 134.2s 留白结尾
  return (
    <AbsoluteFill style={{ background: '#07031A' }}>
      {scene}
      <HUD />
    </AbsoluteFill>
  );
};
