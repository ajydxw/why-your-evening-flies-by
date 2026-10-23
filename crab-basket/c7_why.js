// ================= ⑤ 为什么偏偏是身边人 (WHY – Q120) =================
const L1 = Q(76.5), L1R = Q(78.2), L1SL = Q(80.2), L1CH = Q(81.5), L1BAR = [Q(82), Q(82.75), Q(83.5), Q(84.25), Q(85)], L1CAP = Q(86);
const L2 = Q(88), L2B = [Q(89), Q(89.6)], L2SNAP = Q(91.1), L2CUR = Q(91.8), L2CLK = Q(94), L2S = [Q(94.7), Q(95.4)], L2M = Q(96.3), L2BUB = [Q(96.8), Q(97.25), Q(97.7)], L2SNAPC = Q(99.3), L2CAP = Q(100.5);
const L3 = Q(103), L3RISE = Q(105.1), L3CU = [Q(107.5), Q(109.5), Q(111.5)], L3W = Q(113.5), L3S = [Q(114.5), Q(115.5)], L3OUT = Q(118.6), BRK = Q(120);
const P_JIE = { body: '#e08a3c', bodyD: '#9a5520', style: 'short', hair: '#2b1e14', outfit: 'tee' };
function causeTag(g, str, t0, t1, t) { tagT(g, str, 68, 160, t0, t1, t, { size: 34, col: GOLD, bg: 'rgba(24,14,4,.7)' }); }
function infoBG(g, c0 = '#152033', c1 = '#04060a') {
  g.fillStyle = radial(g, 960, 480, 1250, [[0, c0], [1, c1]]); g.fillRect(-100, -100, W + 200, H + 200);
  g.save(); g.strokeStyle = 'rgba(140,170,220,.045)'; g.lineWidth = 1; for (let x = 0; x <= W; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore();
}
// ---------- WHY intro ----------
function whyScene(g, t) {
  rowBG(g);
  for (let i = 0; i < 3; i++) { const k = E.inC(inv(WHY + i * .07, WHY + .5 + i * .07, t)); if (k >= 1) continue; const P = cardPose(i, t); P.y += 1300 * k; P.r += (i - 1) * .7 * k; P.x += (i - 1) * 200 * k; drawCardImg(g, cardImgAt(i, t), P, 1 - .15 * k); }
  const la = 1 - inv(WHY, WHY + .2, t); if (la > 0) { g.save(); g.globalAlpha = la; for (let i = 0; i < 3; i++) drawCheckLabel(g, i, t); g.restore(); }
  slamT(g, TYPE[2], 960, 925, 104, CHK[2] + .2, t, { color: (k) => k < 1 ? '#fff' : GOLD, stroke: ['#1a1000', 10], t1: WHY + .25 });
  const bk = E.ioS(inv(WHY + .15, WHY + .7, t)); if (bk > 0) { g.fillStyle = `rgba(4,3,4,${.85 * bk})`; g.fillRect(0, 0, W, H); glowDot(g, 960, 560, 900, 'rgba(255,110,50,.22)', bk); }
  const qk = inv(Q(74.05), Q(74.05) + .5, t), zo = E.inE(inv(L1 - .3, L1, t));
  if (qk > 0) { g.save(); g.translate(960, 600); g.rotate(.12 * (1 - E.outB(qk)) + .02 * Math.sin(t * 2)); const s = E.outB(qk) * (1 + zo * 1.2); g.scale(s, s); g.globalAlpha = .16 * (1 - zo);
    g.font = F(900, 900); g.textAlign = 'center'; g.fillStyle = linear(g, 0, -600, 0, 200, [[0, '#ffd27a'], [1, '#ff4b1e']]); g.fillText('？', 0, 300); g.restore(); }
  g.save(); g.translate(960, 600); g.scale(1 + zo * .8, 1 + zo * .8); g.translate(-960, -600); g.globalAlpha = 1 - zo;
  rise(g, '三种拉法，同一个问题：', 960, 390, 52, Q(73.95), t, { color: '#b9c3d2' });
  slamT(g, '为什么偏偏是', 960, 580, 104, Q(74.6), t);
  slamT(g, '身边人？', 960, 800, 210, Q(75.25), t, { from: 2.6, color: () => linear(g, 0, -200, 0, 20, [[0, '#ffd8b8'], [.45, ORG], [1, '#c22a14']]), stroke: ['rgba(30,4,0,.7)', 10] });
  g.restore();
}
// ---------- Layer 1: comparison ----------
function ecgWave(p) { const G = (c, w, a) => a * Math.exp(-Math.pow((p - c) / w, 2)); return G(.12, .025, .12) - G(.2, .008, .15) + G(.225, .011, 1) - G(.252, .01, .32) + G(.42, .04, .24); }
function bpmPhase(tt, b0, b1, ta, tb) { // integrated beats
  if (tt < ta) return tt * b0 / 60; const d = Math.min(tt, tb) - ta, D = tb - ta, mid = (b0 * d + (b1 - b0) * d * d / (2 * D)) / 60;
  return ta * b0 / 60 + mid + (tt > tb ? (tt - tb) * b1 / 60 : 0);
}
function ecg(g, x, y, w, h, t, phf, amp, col) {
  g.save(); rr(g, x, y, w, h, 14); g.fillStyle = '#05080d'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; g.stroke(); g.clip();
  g.strokeStyle = 'rgba(120,255,170,.05)'; g.lineWidth = 1; for (let xx = x; xx < x + w; xx += 30) { g.beginPath(); g.moveTo(xx, y); g.lineTo(xx, y + h); g.stroke(); } for (let yy = y; yy < y + h; yy += 30) { g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); }
  const sp = 300; let lx = 0, ly = 0; g.beginPath();
  for (let xx = 0; xx <= w - 20; xx += 3) { const tt = t - (w - 20 - xx) / sp, p = ((phf(tt) % 1) + 1) % 1, v = ecgWave(p) * amp(tt) + (nz(tt * 9, 3) - .5) * .03; lx = x + xx; ly = y + h * .64 - v * h * .56; xx ? g.lineTo(lx, ly) : g.moveTo(lx, ly); }
  g.strokeStyle = col; g.lineWidth = 4; g.shadowColor = col; g.shadowBlur = 14; g.stroke(); g.shadowBlur = 0;
  glowDot(g, lx, ly, 26, col, .9); g.fillStyle = '#fff'; g.beginPath(); g.arc(lx, ly, 4, 0, TAU); g.fill();
  g.restore();
}
function heart(g, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.moveTo(0, 14); g.bezierCurveTo(-34, -8, -18, -34, 0, -18); g.bezierCurveTo(18, -34, 34, -8, 0, 14); g.fill(); g.restore(); }
function panel(g, cx, y, w, h, label, lc) {
  g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 40; g.shadowOffsetY = 16; rr(g, cx - w / 2, y, w, h, 26); g.fillStyle = '#0e1520'; g.fill(); g.shadowColor = 'transparent'; g.strokeStyle = 'rgba(255,255,255,.08)'; g.lineWidth = 2; g.stroke();
  g.font = F(900, 32); const lw = g.measureText(label).width + 48; rr(g, cx - lw / 2, y - 26, lw, 52, 26); g.fillStyle = lc; g.fill(); g.fillStyle = '#0b0f16'; g.textAlign = 'center'; g.fillText(label, cx, y + 11); g.textAlign = 'left'; g.restore();
}
function layer1(g, t) {
  infoBG(g);
  causeTag(g, '原因一 · 比较', L1 + .1, L2, t);
  if (t < L1CH + .5) {
    const out = E.inC(inv(L1CH, L1CH + .45, t)), lin = E.outC(inv(L1, L1 + .45, t)), rin = E.outC(inv(L1R - .4, L1R, t));
    const B0 = 72, phL = (tt) => tt * 70 / 60, phR = (tt) => bpmPhase(tt, B0, 132, L1R + .15, L1R + 1.5), bpmR = Math.round(lerp(B0, 132, inv(L1R + .15, L1R + 1.5, t)));
    const stress = inv(L1R + .15, L1R + 1.5, t);
    g.save(); g.globalAlpha = 1 - out; g.translate(0, -120 * out);
    // left: tycoon
    g.save(); g.translate(-900 * (1 - lin), 0);
    panel(g, 500, 230, 780, 560, '离你很远的人', '#9fb3cc');
    g.fillStyle = '#7d8aa0'; g.font = F(700, 28); g.fillText('财经快讯 · 刚刚', 150, 318);
    g.fillStyle = '#e9eef6'; g.font = F(900, 50); g.fillText('首富身家一夜', 150, 390); g.fillText('又涨了 100 亿', 150, 455);
    ecg(g, 150, 520, 520, 200, t, phL, () => .35, '#5df2a0');
    heart(g, 735, 580, 1.1, '#5df2a0'); g.fillStyle = '#5df2a0'; g.font = F(900, 56); g.textAlign = 'center'; g.fillText('70', 735, 670); g.font = F(700, 22); g.fillText('BPM', 735, 700); g.textAlign = 'left';
    slamT(g, '哦。', 760, 420, 96, Q(77.55), t, { color: '#c8d0dc', from: 1.6 });
    g.restore();
    // right: deskmate
    const sx = stress * (Math.sin(t * 71) * 5), sy = stress * Math.cos(t * 63) * 4;
    g.save(); g.translate(900 * (1 - rin) + sx, sy);
    panel(g, 1420, 230, 780, 560, '离你很近的人', ORG);
    const bub = E.outB(inv(L1R, L1R + .25, t));
    avatar(g, 1100, 360, 36, '同', '#c9a23a'); g.fillStyle = '#7d8aa0'; g.font = F(700, 26); g.fillText('同桌', 1150, 330);
    if (bub > 0) { g.save(); g.translate(1150, 395); g.scale(bub, bub); g.font = F(900, 46); const bw = g.measureText('我考上研了！🎉').width + 56; rr(g, 0, -38, bw, 84, 22); g.fillStyle = '#262d39'; g.fill(); g.fillStyle = '#fff'; g.fillText('我考上研了！🎉', 28, 20); g.restore(); }
    const pr = phR(t) % 1, pulse = Math.exp(-pr * 7) * stress;
    ecg(g, 1070, 520, 520, 200, t, phR, (tt) => .35 + .75 * inv(L1R + .15, L1R + 1.5, tt), stress > .05 ? '#ff4b3e' : '#5df2a0');
    const hc = stress > .05 ? '#ff4b3e' : '#5df2a0'; heart(g, 1655, 580, 1.1 + .45 * pulse, hc); g.fillStyle = hc; g.font = F(900, 56); g.textAlign = 'center'; g.fillText(String(bpmR), 1655, 670); g.font = F(700, 22); g.fillText('BPM', 1655, 700); g.textAlign = 'left';
    if (stress > 0) { g.save(); rr(g, 1030, 230, 780, 560, 26); g.strokeStyle = `rgba(255,75,62,${.25 + .6 * pulse})`; g.lineWidth = 5; g.shadowColor = RED; g.shadowBlur = 30 * pulse; g.stroke(); g.restore(); }
    g.restore();
    g.restore();
    slamT(g, '我们只跟够得着的人比。', 960, 930, 86, L1SL, t, { t1: L1CH + .35, color: (i) => i >= 4 && i <= 6 ? ORG : '#fff' });
  }
  if (t >= L1CH) { // sting chart
    const ci = E.outC(inv(L1CH + .38, L1CH + .75, t));
    g.save(); g.globalAlpha = ci; g.translate(0, 60 * (1 - ci));
    kText(g, '刺痛指数', 960, 175, 64, { color: '#fff', weight: 900 });
    kText(g, '看到对方过得好时，你有多难受', 960, 232, 30, { color: '#8a96a8', weight: 500 });
    g.restore();
    const NM = ['首富', '明星', '老同学', '同事', '同桌 / 室友'], VAL = [.04, .1, .5, .78, 1.13], COL = ['#56657e', '#6a6f92', '#c9824a', '#f0653a', '#ff3b2f'], RY = [320, 425, 530, 635, 740];
    g.save(); g.globalAlpha = ci;
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 3; g.beginPath(); g.moveTo(150, 300); g.lineTo(150, 770); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(138, 760); g.lineTo(162, 760); g.lineTo(150, 786); g.fill();
    g.fillStyle = '#8a96a8'; g.font = F(700, 28); g.textAlign = 'center'; g.fillText('远', 150, 285); g.fillStyle = ORG; g.fillText('近', 150, 822);
    g.restore();
    for (let i = 0; i < 5; i++) {
      const k = inv(L1BAR[i], L1BAR[i] + .42, t), la = inv(L1BAR[i] - .15, L1BAR[i], t); if (la <= 0) continue;
      g.save(); g.globalAlpha = la * ci; g.fillStyle = i === 4 ? '#fff' : '#d5dce7'; g.font = F(900, 40); g.textAlign = 'right'; g.fillText(NM[i], 470, RY[i] + 14); g.textAlign = 'left';
      g.fillStyle = 'rgba(255,255,255,.05)'; rr(g, 510, RY[i] - 30, 1250, 60, 30); g.fill();
      const len = Math.max(60, 1250 * VAL[i] * (i === 4 ? E.outC(k) : E.outB(k))), shk = i === 4 ? hit(t, L1BAR[4] + .42, .5) * 10 : 0;
      g.translate(Math.sin(t * 80) * shk, 0);
      g.fillStyle = linear(g, 510, 0, 510 + len, 0, [[0, COL[Math.max(0, i - 1)]], [1, COL[i]]]); if (i >= 3) { g.shadowColor = COL[i]; g.shadowBlur = 30; } rr(g, 510, RY[i] - 30, len, 60, 30); g.fill(); g.shadowBlur = 0;
      g.fillStyle = '#fff'; g.font = F(900, 32); const pct = Math.round(VAL[i] * 100 * (i === 4 ? E.outC(k) : clamp(k * 1.4))); if (i < 4) g.fillText(pct + '%', 530 + len, RY[i] + 12);
      g.restore();
    }
    stampT(g, '爆表', 1730, 668, L1BAR[4] + .45, t, { size: 66, rot: -.14, color: '#ffe36b' });
    rise(g, '离得越近、跑道越像，', 960, 895, 58, L1CAP, t, { t1: L2 + .05 });
    slamT(g, '越扎心。', 960, 1000, 92, Q(86.9), t, { t1: L2 + .05, color: () => linear(g, 0, -80, 0, 10, [[0, '#ffd8b8'], [1, ORG]]) });
  }
}
// ---------- Layer 2: cost ----------
function cursor(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#fff'; g.strokeStyle = '#111'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 58); g.lineTo(14, 45); g.lineTo(25, 70); g.lineTo(35, 65); g.lineTo(24, 41); g.lineTo(42, 40); g.closePath(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 12; g.fill(); g.shadowBlur = 0; g.stroke(); g.restore(); }
function bigButton(g, cx, cy, s, o) {
  g.save(); g.translate(cx, cy); g.scale(s, s); g.globalAlpha *= o.a ?? 1;
  g.shadowColor = o.glow ? o.col : 'rgba(0,0,0,.55)'; g.shadowBlur = o.glow ? 40 * o.glow : 40; g.shadowOffsetY = o.glow ? 0 : 16; rr(g, -320, -170, 640, 340, 34); g.fillStyle = '#101823'; g.fill(); g.shadowColor = 'transparent';
  g.strokeStyle = o.col; g.lineWidth = 4; g.globalAlpha *= .9; g.stroke(); g.globalAlpha /= .9;
  g.fillStyle = o.col; g.font = F(900, 64); g.textAlign = 'center'; g.fillText(o.title, 0, -72);
  g.fillStyle = '#fff'; g.font = F(900, 44); g.fillText(o.cost, 0, 4); g.fillStyle = '#8a96a8'; g.font = F(500, 28); g.fillText(o.sub, 0, 52); g.textAlign = 'left';
  g.fillStyle = 'rgba(255,255,255,.07)'; rr(g, -250, 92, 500, 26, 13); g.fill(); if (o.bar > 0) { g.fillStyle = o.col; g.shadowColor = o.col; g.shadowBlur = 16; rr(g, -250, 92, Math.max(26, 500 * o.bar), 26, 13); g.fill(); g.shadowBlur = 0; }
  if (o.flash > 0) { g.fillStyle = `rgba(255,255,255,${.5 * o.flash})`; rr(g, -320, -170, 640, 340, 34); g.fill(); }
  g.restore();
}
function bubbleSay(g, x, y, s, str, col, a) {
  if (a <= 0 || s <= 0) return; g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= a; g.font = F(900, 72); const w = g.measureText(str).width + 80;
  g.beginPath(); g.moveTo(-w / 2 + 30, -70); g.arcTo(w / 2, -70, w / 2, 70, 30); g.arcTo(w / 2, 70, -w / 2, 70, 30); g.lineTo(-10, 70); g.lineTo(-40, 120); g.lineTo(-44, 70); g.arcTo(-w / 2, 70, -w / 2, -70, 30); g.arcTo(-w / 2, -70, w / 2, -70, 30); g.closePath();
  g.fillStyle = '#f4f1ea'; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; g.fill(); g.shadowBlur = 0; g.strokeStyle = col; g.lineWidth = 6; g.stroke();
  g.fillStyle = '#1b1f28'; g.textAlign = 'center'; g.fillText(str, 0, 25); g.textAlign = 'left'; g.restore();
}
function layer2(g, t) {
  infoBG(g, '#1c1a26');
  causeTag(g, '原因二 · 成本', L2 + .1, BRK, t);
  if (t < L2M + .5) {
    const go = E.inC(inv(L2M, L2M + .45, t));
    g.save(); g.globalAlpha = 1 - go; g.translate(960, 540); g.scale(1 - .15 * go, 1 - .15 * go); g.translate(-960, -540);
    rise(g, '看到身边人往前跑，你有两个按钮：', 960, 205, 54, L2 + .2, t, { color: '#c3ccd8' });
    const kL = E.outB(inv(L2B[0], L2B[0] + .4, t)), kR = E.outB(inv(L2B[1], L2B[1] + .4, t));
    const hoverL = inv(Q(92.5), Q(92.7), t) * (1 - inv(Q(93.2), Q(93.4), t)), clk = hit(t, L2CLK, .5), dimL = inv(L2CLK, L2CLK + .3, t);
    const barL = .08 * E.outC(inv(Q(90.3), Q(96), t)), barR = E.outE(inv(L2SNAP, L2SNAP + .12, t));
    if (kL > 0) bigButton(g, 540, 540, kL * (1 + .03 * hoverL), { col: CY, title: '自己追上去', cost: '要 3 个月', sub: '熬夜 · 自律 · 还不一定成', bar: barL, glow: hoverL, a: 1 - .55 * dimL });
    if (kR > 0) bigButton(g, 1380, 540, kR * (1 - .05 * clk), { col: ORG, title: '把他拉回来', cost: '只要 3 秒', sub: '一句“别卷了”就够了', bar: barR, flash: hit(t, L2SNAP, .35) + clk, glow: dimL });
    if (kL > 0 && t > Q(90.3)) { g.fillStyle = CY; g.font = F(700, 26); g.fillText('3 个月 ›', 540 - 250 + 500 * barL + 34, 652); }
    // cursor
    const ca = inv(L2CUR, L2CUR + .2, t); if (ca > 0) {
      const m1 = E.ioC(inv(L2CUR, Q(92.6), t)), m2 = E.ioC(inv(Q(93.25), Q(93.85), t)), wob = (1 - m2) * hoverL * 14 * Math.sin(t * 9);
      const cx = lerp(lerp(980, 600, m1), 1420, m2) + wob, cy = lerp(lerp(1060, 600, m1), 590, m2), cs = 1.25 * (1 - .18 * hit(t, L2CLK, .25));
      g.save(); g.globalAlpha *= ca; cursor(g, cx, cy, cs); g.restore();
      const rp = inv(L2CLK, L2CLK + .5, t); if (rp > 0 && rp < 1) { g.save(); g.strokeStyle = `rgba(255,140,90,${1 - rp})`; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, 20 + 120 * E.outC(rp), 0, TAU); g.stroke(); g.restore(); }
    }
    slamT(g, '往上爬很贵，', 540, 860, 92, L2S[0], t, { color: (i) => i === 3 || i === 4 ? '#8ff7f1' : '#fff' });
    slamT(g, '往下拉很便宜。', 1380, 860, 92, L2S[1], t, { color: (i) => i === 3 || i === 4 || i === 5 ? ORG : '#fff' });
    g.restore();
  }
  if (t >= L2M) { // words become claws
    const SAY = [['别卷了。', YEL, '室友'], ['坐下。', PUR, '同事'], ['你变了。', '#c9d1dc', '老友']], X3 = [430, 960, 1490];
    const m = E.ioC(inv(Q(98.4), Q(99.05), t)), snap = inv(L2SNAPC - .08, L2SNAPC + .02, t), tw = Math.sin(t * 6);
    for (let i = 0; i < 3; i++) {
      const k = inv(L2BUB[i], L2BUB[i] + .35, t); if (k <= 0) continue; const x = X3[i], y = 500 + 8 * Math.sin(t * 2 + i);
      bubbleSay(g, x, y, E.outB(k) * (1 + .25 * m) * lerp(1, .2, m), SAY[i][0], SAY[i][1], 1 - m);
      g.save(); g.globalAlpha = inv(0, .15, k) * (1 - m); g.fillStyle = '#8a96a8'; g.font = F(700, 30); g.textAlign = 'center'; g.fillText(SAY[i][2], x, y + 175); g.restore();
      if (m > 0) { const op = lerp(.6, .0, E.inC(snap)), sc = 2.5 * E.outB(m), jit = hit(t, L2SNAPC, .4) * 8;
        glowDot(g, x, y, 300, 'rgba(255,90,40,.35)', m * (.6 + .4 * hit(t, L2SNAPC, .6)));
        bigClaw(g, x + 40 + Math.sin(t * 50 + i) * jit, y - 30 + 10 * tw, sc, op, -.62 + (i - 1) * .12 + .05 * Math.sin(t * 3 + i), m);
      }
    }
    if (snap > 0) { const sp = inv(L2SNAPC, L2SNAPC + .35, t); if (sp < 1) for (let i = 0; i < 3; i++) { g.save(); g.globalAlpha = 1 - sp; g.strokeStyle = '#ffd27a'; g.lineWidth = 4; for (let j = 0; j < 8; j++) { const a = j / 8 * TAU, r0 = 120 + 160 * E.outC(sp); g.beginPath(); g.moveTo(X3[i] + 60 + Math.cos(a) * r0, 500 + Math.sin(a) * r0); g.lineTo(X3[i] + 60 + Math.cos(a) * (r0 + 40), 500 + Math.sin(a) * (r0 + 40)); g.stroke(); } g.restore(); } }
    slamT(g, '一句话，就是一只钳子。', 960, 880, 96, L2CAP, t, { t1: L3 + .05, color: (i) => i >= 8 && i <= 9 ? ORG : '#fff' });
  }
}
function bigClaw(g, x, y, s, open, ang, a = 1) { // crab cheliped: arm from below + pincer
  if (s <= 0) return; g.save(); g.globalAlpha *= a; const cs = Math.cos(ang), sn = Math.sin(ang), wx = x - cs * 76 * s, wy = y - sn * 76 * s, ex = wx - 55 * s, ey = wy + 75 * s, sx = ex - 5 * s, sy = ey + 120 * s;
  g.lineCap = 'round'; g.lineJoin = 'round';
  for (const [w, c] of [[44, ORD], [28, ORG]]) { g.strokeStyle = c; g.lineWidth = w * s * .5; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.lineTo(wx, wy); g.stroke(); }
  g.fillStyle = ORD; g.beginPath(); g.arc(ex, ey, 13 * s * .5, 0, TAU); g.fill();
  drawPincer(g, x, y, ang, s, open, ORG, ORD, ORL, 0); g.restore();
}
// ---------- Layer 3: alarms ----------
function dome(g, x, y, R, red, a = 1) {
  g.save(); g.globalAlpha *= a; g.beginPath(); g.moveTo(x - R, y + 900); g.lineTo(x - R, y); g.arc(x, y, R, Math.PI, 0); g.lineTo(x + R, y + 900);
  g.fillStyle = red > 0 ? `rgba(255,${lerp(200, 70, red) | 0},${lerp(255, 60, red) | 0},${.07 + .06 * red})` : 'rgba(150,200,255,.07)'; g.fill();
  g.strokeStyle = red > 0 ? `rgba(255,${lerp(210, 90, red) | 0},${lerp(255, 80, red) | 0},.45)` : 'rgba(170,210,255,.35)'; g.lineWidth = 3; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, R - 22, Math.PI * 1.15, Math.PI * 1.38); g.stroke();
  g.restore();
}
function alarm(g, x, y, s, on, t) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (on > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const a = t * 7; for (const o of [0, Math.PI]) { g.fillStyle = radial(g, 0, 0, 520, [[0, `rgba(255,60,40,${.42 * on})`], [1, 'rgba(255,60,40,0)']]); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 520, a + o - .35, a + o + .35); g.closePath(); g.fill(); } g.restore();
    glowDot(g, 0, -10, 120, `rgba(255,50,30,${.7 * on * (.7 + .3 * Math.sin(t * 20))})`); }
  g.fillStyle = '#2a2f3a'; rr(g, -34, 0, 68, 18, 5); g.fill();
  g.fillStyle = on > 0 ? `rgb(255,${lerp(150, 60, on) | 0},${lerp(150, 50, on) | 0})` : '#5a6272'; g.beginPath(); g.arc(0, 0, 28, Math.PI, 0); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.ellipse(-9, -14, 6, 9, -.4, 0, TAU); g.fill();
  g.restore();
}
function linRiser(g, x, y, s, t, o = {}) { // glowing Lin with up-rays
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 7; i++) { const xx = x + (i - 3) * 60 * s + 10 * Math.sin(t * 1.3 + i); g.fillStyle = linear(g, 0, y + 300 * s, 0, y - 900 * s, [[0, 'rgba(47,216,207,0)'], [.4, `rgba(47,216,207,${.07 + .04 * Math.sin(t * 3 + i)})`], [1, 'rgba(47,216,207,0)']]); g.fillRect(xx - 18 * s, y - 900 * s, 36 * s, 1200 * s); }
  g.restore();
  glowDot(g, x, y - 128 * s, 330 * s, 'rgba(47,216,207,.35)');
  lit(g, L => drawPerson(L, x, y, s, Object.assign({}, P_LIN, o)), L => { L.globalCompositeOperation = 'destination-out'; L.fillStyle = linear(L, 0, y + 40 * s, 0, y + 300 * s, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,1)']]); L.fillRect(-6000, -6000, 12000, 12000); });
}
const L3P = [[380, P_PENG, '大鹏'], [960, P_WANG, '王姐'], [1540, P_JIE, '阿杰']];
const L3TH = [['他走了，', '谁陪我开黑？'], ['他要是成了，', '显得我当年太怂。'], ['他是不是', '看不上我们了？']];
function thought(g, x, y, lines, t0, t, col) {
  const k = E.outB(inv(t0, t0 + .3, t)); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k);
  g.fillStyle = 'rgba(248,246,240,.96)'; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; rr(g, -340, -130, 680, 260, 70); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = col; g.lineWidth = 5; g.stroke(); g.restore();
  lines.forEach((ln, j) => typeT(g, ln, x - 290, y - 22 + j * 82, 62, t0 + .2 + j * .25, t, { color: '#1b1f28', weight: 900, cps: 22, align: 'left', shadow: false }));
}
function layer3(g, t) {
  infoBG(g, '#141a26');
  causeTag(g, '原因三 · 警报', L3 + .1, L3OUT, t);
  const inCU = t >= L3CU[0] && t < L3W;
  if (!inCU) {
    const wide2 = t >= L3W, rise_ = E.ioS(inv(L3RISE, L3CU[0], t)) * .88 + .12 * E.ioS(inv(L3W, L3W + 1.5, t)), on = [0, 1, 2].map(i => wide2 ? 1 : 0);
    const z = wide2 ? 1.0 + .03 * (t - L3W) : 1, dim = wide2 ? .55 * E.ioC(inv(L3S[0] - .4, L3S[0], t)) : 0;
    g.save(); cam(g, 960, 540 - (wide2 ? 20 : 0), z);
    if (rise_ > 0) linRiser(g, 960, lerp(1300, 390, rise_), .85, t, { eyes: wide2 ? 'open' : 'happy', mouth: wide2 ? 'flat' : 'smile', brow: wide2 ? -.4 : .1, look: wide2 ? [0, .8] : [0, -.4] });
    L3P.forEach(([x, P, nm], i) => {
      const red = Math.max(on[i], i === 0 ? inv(L3CU[0] - .2, L3CU[0] - .1, t) : 0) * (.75 + .25 * Math.sin(t * 14 + i)), worried = wide2;
      lit(g, L => drawPerson(L, x, 860, .8, Object.assign({}, P, { eyes: worried ? 'wide' : 'happy', mouth: worried ? 'tight' : 'smile', brow: worried ? -.5 : .1, look: worried ? [(960 - x) / 600, -.9] : [0, 0] })),
        L => { if (red > 0) FILL(L, `rgba(255,40,30,${.18 * red})`); if (rise_ > .1) FILL(L, linear(L, 0, 300, 0, 900, [[0, `rgba(47,216,207,${.12 * rise_})`], [1, 'rgba(47,216,207,0)']])); });
      dome(g, x, 720, 225, red);
      alarm(g, x, 495, 1, red, t + i);
      if (!wide2) { g.save(); g.globalAlpha = inv(L3 + .3, L3 + .6, t); g.fillStyle = 'rgba(200,225,255,.75)'; g.font = F(700, 28); g.textAlign = 'center'; g.fillText('安全感', x, 560); g.restore(); }
      g.fillStyle = 'rgba(220,228,240,.8)'; g.font = F(700, 30); g.textAlign = 'center'; g.fillText(nm, x, 1050); g.textAlign = 'left';
    });
    g.restore();
    if (dim > 0) { g.fillStyle = `rgba(4,4,8,${dim})`; g.fillRect(0, 0, W, H); }
    rise(g, '他们大多不是坏人。', 960, 200, 72, L3 + .35, t, { t1: L3RISE + .3 });
    rise(g, '只是待在原地，很安全。', 960, 300, 48, Q(104.4), t, { color: '#aab4c4', t1: L3RISE + .3 });
    if (wide2) {
      slamT(g, '你的上升，', 960, 450, 96, L3S[0], t, { color: (i) => i >= 2 && i <= 3 ? '#8ff7f1' : '#fff' });
      slamT(g, '只是碰响了他们的警报。', 960, 620, 100, L3S[1], t, { color: (i) => i >= 8 && i <= 9 ? '#ff5a4a' : '#fff' });
    }
  } else { // close-ups: alarm goes off
    const i = t < L3CU[1] ? 0 : t < L3CU[2] ? 1 : 2, u = t - L3CU[i], side = i === 1 ? -1 : 1, px = side > 0 ? 1290 : 630, [_, P, nm] = L3P[i];
    const on = inv(L3CU[i] + .12, L3CU[i] + .2, t), z = 1.02 + .04 * u;
    g.fillStyle = '#0b0e15'; g.fillRect(0, 0, W, H);
    g.save(); cam(g, 960, 540, z);
    glowDot(g, px, -200, 900, 'rgba(47,216,207,.22)');
    lit(g, L => drawPerson(L, px, 930, 1.75, Object.assign({}, P, { eyes: u > .2 ? (i === 1 ? 'half' : 'wide') : 'open', mouth: i === 1 ? 'tight' : u > .25 ? 'frown' : 'flat', brow: -.55, look: [-side * .3, -.8], tilt: side * .04 })),
      L => { FILL(L, `rgba(255,40,30,${on * (.12 + .12 * (.5 + .5 * Math.sin(t * 14)))})`); FILL(L, linear(L, 0, 200, 0, 800, [[0, 'rgba(47,216,207,.16)'], [1, 'rgba(47,216,207,0)']])); });
    dome(g, px, 700, 600, on);
    alarm(g, px, 112, 1.6, on, t);
    g.restore();
    stampT(g, '叮！', px + side * 190, 190, L3CU[i] + .14, t, { size: 56, rot: side * .14, color: '#ff5a4a' });
    who(g, nm + '（心里）', P.body, side > 0 ? 160 : 1100, 300, L3CU[i] + .25, t);
    thought(g, side > 0 ? 520 : 1440, 520, L3TH[i], L3CU[i] + .3, t, P.body);
  }
  const fo = inv(L3OUT, BRK - .05, t); if (fo > 0) { g.fillStyle = `rgba(0,0,0,${E.ioS(fo)})`; g.fillRect(0, 0, W, H); }
}
function sceneWhy(g, t) { if (t < L1) whyScene(g, t); else if (t < L2) layer1(g, t); else if (t < L3) layer2(g, t); else layer3(g, t); }
