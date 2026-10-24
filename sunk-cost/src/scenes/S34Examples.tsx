import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { BF, EI, EO, tw } from '../lib';
import { Hub, diveScale, nodeXY, zoomAt } from '../components/Hub';
import { S2Concept } from './S2Concept';
import { ExTakeout } from './ex/ExTakeout';
import { ExQueue } from './ex/ExQueue';
import { ExAlley } from './ex/ExAlley';
import { ExCar } from './ex/ExCar';
import { Bridge } from './ex/Bridge';

/* ============================================================
   第三、四段 · 共鸣举例（22.98 – 68.61s，第 32–96 拍）
   每个痛点：回到倒 U 曲线 → 光标滑到下一个节点 → 口头禅砸下 → 镜头钻进节点 → 痛点小剧场 → 结算 → 拉回曲线
   ============================================================ */

type Seg = { node: number; Scene: React.FC<{ f: number }>; beat: number; inA: number; inB: number; out: number };
export const SEGS: Seg[] = [
  { node: 0, Scene: ExTakeout, beat: 32, inA: BF(32.35), inB: BF(33), out: BF(47) },
  { node: 1, Scene: ExQueue, beat: 48, inA: BF(48.35), inB: BF(49), out: BF(63) },
  { node: 2, Scene: ExAlley, beat: 64, inA: BF(64.35), inB: BF(65), out: BF(79) },
  { node: 3, Scene: ExCar, beat: 80, inA: BF(80.35), inB: BF(81), out: BF(94) },
];

/** 场景层：从节点处圆形展开；退出时缩回节点 */
const SceneLayer: React.FC<{ f: number; seg: Seg }> = ({ f, seg }) => {
  const { x, y } = nodeXY(seg.node);
  const R = tw(f, seg.inB - 4, seg.inB + 8, 0, 2300, EI);
  const inS = tw(f, seg.inB - 4, seg.inB + 10, 1.25, 1, EO);
  const outS = tw(f, seg.out, seg.out + 7, 1, 0.06, EI);
  const outR = tw(f, seg.out, seg.out + 7, 2300, 60, EI);
  const s = f < seg.out ? inS : outS;
  const r = f < seg.out ? R : outR;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at ${x}px ${y}px)` }}>
      <AbsoluteFill style={zoomAt(x, y, s)}>
        <seg.Scene f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const S34Examples: React.FC = () => {
  const f = useCurrentFrame();
  const layers: React.ReactNode[] = [];
  // 第一次：直接沿用第二段收尾的曲线画面，镜头钻进“外卖”节点
  const s0 = SEGS[0];
  if (f < s0.inB + 8) {
    const n = nodeXY(0);
    layers.push(
      <AbsoluteFill key="h0" style={{ ...zoomAt(n.x, n.y, diveScale(f, s0.inA, s0.inB)), opacity: tw(f, s0.inB - 3, s0.inB + 2, 1, 0) }}>
        <S2Concept />
      </AbsoluteFill>,
    );
  }
  SEGS.forEach((seg, i) => {
    // 回到曲线（第 2–4 个痛点之前）
    if (i > 0) {
      const prev = SEGS[i - 1];
      if (f >= prev.out && f < seg.inB + 8) {
        const p = nodeXY(prev.node), c = nodeXY(seg.node);
        const back = tw(f, prev.out, prev.out + 8, 3, 1, EO);
        const dive = diveScale(f, seg.inA, seg.inB);
        const style = f < seg.inA ? zoomAt(p.x, p.y, back) : zoomAt(c.x, c.y, dive);
        layers.push(
          <AbsoluteFill key={'h' + i} style={{ ...style, opacity: tw(f, seg.inB - 3, seg.inB + 2, 1, 0) }}>
            <Hub f={f} stage={seg.node} slideA={prev.out + 4} slideB={BF(seg.beat) - 1} labelAt={BF(seg.beat)} />
          </AbsoluteFill>,
        );
      }
    }
    if (f >= seg.inB - 4 && f < seg.out + 8) layers.push(<SceneLayer key={'s' + i} f={f} seg={seg} />);
  });
  // 收尾：光标跌穿谷底 → 灵魂拷问 → 镜头钻进小人眉心
  if (f >= SEGS[3].out) layers.unshift(<Bridge key="br" f={f} />);
  return <AbsoluteFill style={{ background: '#07031A' }}>{layers}</AbsoluteFill>;
};
