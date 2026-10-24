import React from 'react';
import { Composition } from 'remotion';
import { Main } from './Main';
import tl from './data/timeline.json';
import { CoverH, CoverV } from './Cover';

export const Root: React.FC = () => (
  <>
    {/* 第 1–2 段预览：0 – 23.0s */}
    <Composition id="Part1" component={Main} durationInFrames={Math.round(tl.part1EndSec * tl.fps)} fps={tl.fps} width={tl.width} height={tl.height} />
    {/* 全片（后续段落完成后使用） */}
    <Composition id="Full" component={Main} durationInFrames={Math.round(tl.durationSec * tl.fps)} fps={tl.fps} width={tl.width} height={tl.height} />
    {/* 发布封面（静帧）：横版 16:9、竖版 3:4 */}
    <Composition id="CoverH" component={CoverH} durationInFrames={Math.round(tl.durationSec * tl.fps)} fps={tl.fps} width={1920} height={1080} />
    <Composition id="CoverV" component={CoverV} durationInFrames={Math.round(tl.durationSec * tl.fps)} fps={tl.fps} width={1080} height={1440} />
  </>
);
