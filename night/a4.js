// ================= S4: ruler ③ memory (k96–128) =================
function drawCoworker(g, x, y, talk) {
  g.save(); g.translate(x, y);
  g.fillStyle = '#c4704f'; g.beginPath(); g.moveTo(-160, 760); g.bezierCurveTo(-165, 240, -130, 112, 0, 104); g.bezierCurveTo(130, 112, 165, 240, 160, 760); g.fill();
  g.fillStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.moveTo(60, 760); g.bezierCurveTo(90, 400, 110, 200, 0, 104); g.bezierCurveTo(130, 112, 165, 240, 160, 760); g.fill();
  g.fillStyle = '#efe4d6'; g.beginPath(); g.moveTo(-46, 106); g.lineTo(-8, 160); g.lineTo(30, 106); g.fill();
  g.fillStyle = '#dcb89e'; g.fillRect(-26, 50, 48, 62); g.fillStyle = '#e6c3a9'; g.beginPath(); g.ellipse(0, 0, 64, 72, 0, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(-58, -4); g.quadraticCurveTo(-80, 8, -60, 20); g.fill();
  g.fillStyle = '#3b2a22'; g.beginPath(); g.moveTo(66, 10); g.bezierCurveTo(78, -60, 30, -92, -10, -84); g.bezierCurveTo(-52, -76, -72, -46, -66, -18); g.bezierCurveTo(-36, -44, 10, -40, 34, -22); g.bezierCurveTo(46, -8, 52, 4, 66, 10); g.fill();
  g.fillStyle = '#c9a48c'; g.beginPath(); g.ellipse(26, 8, 11, 15, 0, 0, TAU); g.fill();
  g.fillStyle = '#2a2e38'; g.beginPath(); g.arc(-36, -2, 7, 0, TAU); g.fill(); g.beginPath(); g.arc(-6, -2, 6, 0, TAU); g.fill();
  g.strokeStyle = '#3b2a22'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-48, -26); g.quadraticCurveTo(-36, -36, -24, -28); g.moveTo(-14, -28); g.quadraticCurveTo(-4, -36, 6, -27); g.stroke();
  g.fillStyle = 'rgba(230,120,110,.3)'; g.beginPath(); g.ellipse(-30, 20, 12, 7, 0, 0, TAU); g.fill();
  g.fillStyle = '#8a4d48'; g.beginPath(); g.ellipse(-24, 36, 11, 3 + talk * 9, 0, 0, TAU); g.fill();
  g.restore();
}
function drawS4a(g, t) { // k96–102 morning office: "what did you watch?"
  const p = E.ioS(inv(Q(96), Q(102), t)), talkW = (t > Q(99) && t < Q(100.3)) ? .3 + .3 * Math.abs(Math.sin(t * 22)) : 0, yawn = t < Q(97.5) ? Math.sin(Math.PI * inv(Q(96), Q(97.5), t)) : 0;
  g.save(); cam(g, lerp(960, 1080, p), lerp(540, 500, p), lerp(1.0, 1.1, p)); drawOffice(g, t, { hours: 9.5 + (t - Q(96)) / 600, yawn: Math.max(yawn, talkW) });
  const ck = E.outB(inv(Q(98) - .4, Q(98) - .05, t)); if (ck > 0) { const talkC = ((t > Q(98) && t < Q(98.9)) || (t > Q(100) && t < Q(100.9))) ? Math.abs(Math.sin(t * 20)) : 0; drawCoworker(g, lerp(2300, 1720, ck), 450, talkC); }
  g.restore();
  g.save(); g.fillStyle = 'rgba(255,200,140,.08)'; g.globalCompositeOperation = 'lighter'; g.fillRect(0, 0, W, H); g.restore();
  hudTime(g, '第二天 09:30', 70, 60, inv(Q(96) + .2, Q(96) + .5, t) * (1 - inv(Q(101.8), Q(102), t)), 1.1);
  bubble(g, '昨晚干嘛了？', 1440, 200, Q(98), Q(99.9), t, { tx: 1640, ty: 380 });
  bubble(g, '刷了会儿手机……', 470, 420, Q(99), Q(100.9), t, { tx: 780, ty: 520 });
  bubble(g, '都刷到啥了？', 1440, 200, Q(100), Q(102), t, { tx: 1640, ty: 380 });
  const ca = inv(Q(101) - .1, Q(101) + .1, t) * (1 - inv(Q(101.85), Q(102), t)); if (ca > 0) { const s = E.outB(inv(Q(101) - .1, Q(101) + .15, t)); g.save(); g.translate(540, 300); g.scale(s, s); g.translate(-540, -300); cloudB(g, 540, 300, 600, 330, ca);
    g.save(); g.beginPath(); g.ellipse(540, 300, 250, 120, 0, 0, TAU); g.clip(); [-1, 0, 1].forEach((d, j) => { const jit = (hsh(Math.floor(t * 18) + j * 7) - .5) * 14; g.save(); g.globalAlpha = ca * (.5 + .3 * hsh(Math.floor(t * 12) + j)); g.filter = `blur(${7 + 4 * Math.sin(t * 9 + j)}px)`; drawCard(g, 540 + d * 140 - 50 + jit, 230, 100, 150, j * 2 + 1, t); g.restore(); });
    g.restore(); kText(g, '？？？', 540, 330, 70, { align: 'center', color: '#1d1a2a', alpha: ca, shadow: null }); g.restore(); }
  subT(g, '……想不起来。', Q(101.3), Q(102) - .03, t);
}
function drawS4b(g, t) { // k102–104 quiz the viewer
  bgDeep(g, t, '#1b1432', '#05040b', .2);
  rise(g, '考考你：', 960, 175, 56, Q(102) + .02, t, { color: '#ffd9a0', weight: 700 });
  slamT(g, '说出昨晚刷到的 3 个视频？', 960, 320, 100, Q(102) + .14, t, { color: (i) => i == 9 ? AMB : '#fff' });
  [0, 1, 2].forEach(j => { const t0 = Q(102.5 + j * .5), k = E.outB(inv(t0 - .12, t0 + .1, t)); if (k <= 0) return; const x = 600 + j * 360, y = 700, w = 230, h = 340; g.save(); g.translate(x, y); g.scale(k, k);
    g.save(); g.beginPath(); rr(g, -w / 2, -h / 2, w, h, 22); g.clip(); g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(-w / 2, -h / 2, w, h);
    const gh = (1 - inv(Q(103.7), Q(104), t)) * (.35 + .25 * hsh(Math.floor(t * 14) + j * 3)); g.globalAlpha = gh; g.filter = 'blur(16px)'; drawCard(g, -w / 2 + 10, -h / 2 + 10, w - 20, h - 20, j * 2 + 2, t); g.restore();
    g.setLineDash([16, 12]); g.lineDashOffset = -t * 40; g.strokeStyle = 'rgba(255,214,160,.75)'; g.lineWidth = 4; rr(g, -w / 2, -h / 2, w, h, 22); g.stroke(); g.setLineDash([]);
    kText(g, String(j + 1), -w / 2 + 22, -h / 2 + 52, 36, { color: '#ffd9a0', weight: 700, shadow: null });
    kText(g, '?', 0, 50, 150, { align: 'center', color: '#fff', alpha: .9 }); g.restore(); });
}
const WD = [['早高峰', '#8fb4e8'], ['开会', '#f2c48d'], ['改方案', '#9fd8b4'], ['午饭', '#e8a0a0'], ['加班', '#b9a7e8']];
const TRIP = [['新城市', '#ff6b6b'], ['迷路', '#ffd166'], ['路边小吃', '#06d6a0'], ['海边', '#4cc9f0'], ['日落', '#f72585'], ['夜市', '#ffb23f']];
function drawS4c(g, t) { // k104–108 recall counts memory beads
  bgDeep(g, t, '#1a1430', '#05040b', .2);
  rise(g, '回头估算时间时，大脑数的是——', 960, 175, 54, Q(104) + .02, t, { color: '#ffd9a0', weight: 700 });
  slamT(g, '"记忆点"', 960, 320, 150, Q(105), t, { color: AMB });
  const y = 620; let xe = 300; WD.forEach((b, i) => { const tl = Q(105.5 + i * .5); if (t > tl - .25) xe = Math.max(xe, lerp(300, 400 + i * 250 + 120, E.outC(inv(tl - .25, tl, t)))); });
  kText(g, '普通工作日', 260, 545, 40, { color: '#cfd8ee', weight: 700, alpha: inv(Q(104.5), Q(105), t) });
  thread(g, 260, xe, y, inv(Q(104.5), Q(105), t));
  WD.forEach(([lb, col], i) => { const tl = Q(105.5 + i * .5), k = inv(tl - .22, tl, t); if (k <= 0) return; const x = 400 + i * 250, yy = lerp(y - 320, y, E.inC(k)) - (t > tl ? 26 * Math.exp(-(t - tl) * 9) * Math.abs(Math.sin((t - tl) * 18)) : 0);
    if (t > tl) { const r = (t - tl) * 300; g.save(); g.strokeStyle = hexA(col, .6 * Math.exp(-(t - tl) * 5)); g.lineWidth = 3; g.beginPath(); g.arc(x, y, 34 + r * .5, 0, TAU); g.stroke(); g.restore(); }
    bead(g, x, yy, 36, col, 1); kText(g, lb, x, y + 92, 36, { align: 'center', color: '#fff', weight: 700, alpha: inv(tl, tl + .2, t) }); });
  const bk = E.outC(inv(Q(107.5), Q(108) - .1, t)); if (bk > 0) { const x1 = lerp(260, xe, bk); g.save(); g.strokeStyle = 'rgba(255,214,160,.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(260, 752); g.lineTo(260, 772); g.lineTo(x1, 772); g.lineTo(x1, 752); g.stroke(); g.restore(); kText(g, '回想起来 ≈ 一整天', (260 + x1) / 2, 830, 40, { align: 'center', color: AMB, alpha: bk }); }
  subT(g, '珠子越多，回想起来就越长', Q(106.5), Q(107.5) - .02, t);
}
function drawS4d(g, t) { // k108–112 holiday paradox
  bgDeep(g, t, '#1e1636', '#06040c', .15);
  slamT(g, '旅行第一天', 960, 170, 92, Q(108) + .12, t);
  const sp = E.ioC(inv(Q(110), Q(111), t)), y = 600, zoom = lerp(1, .9, sp);
  rise(g, '玩的时候：一晃就过', 960, 300, 64, Q(108.5), t, { t1: Q(110) - .02, color: '#ffd9a0' });
  rise(g, '回头一想：好像过了好久', 960, 300, 64, Q(110), t, { color: (i) => i >= 5 ? AMB : '#ffd9a0' });
  g.save(); g.translate(960, y); g.scale(zoom, zoom); g.translate(-960, -y);
  const xs = TRIP.map((_, i) => lerp(960 + (i - 2.5) * 86, 230 + i * 300, sp)); const xe = lerp(960 + 2.5 * 86 + 90, 2200, sp), x0 = lerp(960 - 2.5 * 86 - 90, 120, sp);
  thread(g, x0, xe, y, inv(Q(108.2), Q(108.5), t));
  TRIP.forEach(([lb, col], i) => { const tl = Q(108.5) + i * BEAT * .25, k = inv(tl - .16, tl, t); if (k <= 0) return; const yy = lerp(y - 200, y, E.inC(k));
    if (t > tl) { g.save(); g.globalCompositeOperation = 'lighter'; const u = t - tl, r = rng(i + 40); for (let q = 0; q < 8; q++) { const an = r() * TAU, d = 30 + u * 260 * (.5 + r()); g.globalAlpha = Math.max(0, 1 - u * 2.5); g.fillStyle = col; g.beginPath(); g.arc(xs[i] + Math.cos(an) * d, y + Math.sin(an) * d, 4, 0, TAU); g.fill(); } g.restore(); }
    bead(g, xs[i], yy, 42, col, 1, .9); kText(g, lb, xs[i], y + 100, 38, { align: 'center', color: '#fff', weight: 700, alpha: inv(Q(110.3) + i * .06, Q(110.6) + i * .06, t) }); });
  const bk = E.outC(inv(Q(110.5), Q(111.5), t)); if (bk > 0) { g.save(); g.strokeStyle = 'rgba(255,214,160,.75)'; g.lineWidth = 3; g.beginPath(); g.moveTo(120, 780); g.lineTo(120, 800); g.lineTo(lerp(120, 2200, bk), 800); g.stroke(); g.restore(); }
  g.restore();
  if (bk > 0) kText(g, '回想起来：像过了一个星期 →', 1000, 860, 42, { align: 'center', color: AMB, alpha: bk });
  tagT(g, '假期悖论 · Claudia Hammond《Time Warped》', 60, 70, Q(110), Q(112), t);
}
const NB = (() => { const r = rng(8), a = []; for (let i = 0; i < 200; i++) a.push({ c: i % 50, row: Math.floor(i / 50), ord: r(), jx: (r() - .5) * 8, jy: (r() - .5) * 8, ph: r() * TAU }); return a; })();
function drawS4e(g, t) { // k112–118 tonight: 200 videos, zero beads
  bgDeep(g, t, '#12122a', '#040409', .15);
  const n = Math.round(200 * E.ioS(inv(Q(112), Q(114), t))), ha = inv(Q(112) + .02, Q(112) + .25, t);
  if (ha > 0) kText(g, `今晚：刷了 ${n} 个视频`, 960, 200, 84, { align: 'center', alpha: ha, color: (i, ch) => /\d/.test(ch) ? AMB : '#fff' });
  rise(g, '可它们太像、太碎——', 960, 340, 76, Q(114), t, { t1: Q(116) - .03, color: '#cfd8ee' });
  slamT(g, '一颗都没留下。', 960, 345, 124, Q(116), t, { color: (i) => i >= 1 && i <= 2 ? RED : '#fff' });
  const y = 600, shrink = E.ioC(inv(Q(116.4), Q(117.3), t)), x0 = lerp(150, 930, shrink), x1 = lerp(1770, 990, shrink);
  thread(g, x0, x1, y, 1, 'rgba(200,205,230,.45)');
  const blur = inv(Q(114.5), Q(116), t), jit = blur * 6;
  const drawNB = (g) => { NB.forEach(b => { const x = 176 + b.c * 32 + b.jx + Math.sin(t * 30 + b.ph) * jit, yy = y - 48 + b.row * 32 + b.jy + Math.cos(t * 27 + b.ph) * jit, ta = Q(112) + b.ord * (Q(114) - Q(112)) * .98, k = inv(ta - .1, ta, t); if (k <= 0) return;
    const tp = Q(116) - .1 + (x / W) * .3; if (t > tp) { const u = inv(tp, tp + .25, t); if (u >= 1) return; g.save(); g.globalAlpha = 1 - u; g.strokeStyle = '#aab0c8'; g.lineWidth = 2; g.beginPath(); g.arc(x, yy, 9 + u * 22, 0, TAU); g.stroke(); g.restore(); return; }
    bead(g, x, lerp(yy - 60, yy, E.inC(k)), 11, '#7d8199', k, 0); }); };
  if (blur > 0) { LX.setTransform(1, 0, 0, 1, 0, 0); LX.globalAlpha = 1; LX.globalCompositeOperation = 'source-over'; LX.filter = 'none'; LX.clearRect(0, 0, W, H); drawNB(LX); g.save(); g.filter = `blur(${(blur * 3).toFixed(2)}px)`; g.drawImage(LAYC, 0, 0); g.restore(); } else drawNB(g);
  if (t > Q(116) - .1) { g.save(); g.globalCompositeOperation = 'lighter'; const r = rng(12); for (let q = 0; q < 90; q++) { const px = 176 + r() * 1570, tp = Q(116) - .1 + (px / W) * .3, u = t - tp; if (u < 0 || u > .6) continue; g.globalAlpha = (1 - u / .6) * .8; g.fillStyle = '#c9cee6'; g.beginPath(); g.arc(px + (r() - .5) * 60 * u, y - 50 + r() * 100 - u * 220 * r(), 2.5, 0, TAU); g.fill(); } g.restore(); }
  subT(g, '刷了 4 小时，回头一想：好像什么都没发生', Q(116.6), Q(118) - .03, t);
}
function drawS4f(g, t) { // k118–124 compare: recall length
  bgDeep(g, t, '#181330', '#05040b', .2);
  rise(g, '回想起来的"长度"', 960, 140, 60, Q(118), t, { color: '#ffd9a0', weight: 700 });
  const rows = [['普通工作日', 290, Q(118)], ['旅行第一天', 450, Q(118.5)], ['今晚 4 小时', 610, Q(119)]];
  rows.forEach(([lb, y, t0], j) => { const k = E.outE(inv(t0 - .1, t0 + .3, t)); if (k <= 0) return; g.save(); g.globalAlpha = k; g.translate(-200 * (1 - k), 0);
    kText(g, lb, 110, y + 14, 42, { color: j == 2 ? '#ffb0a8' : '#fff', weight: 700 });
    if (j == 0) { thread(g, 470, 1130, y); WD.forEach(([, c], i) => bead(g, 540 + i * 130, y, 26, c, 1, .4)); kText(g, '≈ 一整天', 1180, y + 14, 40, { color: '#cfd8ee', weight: 700 }); }
    if (j == 1) { thread(g, 470, 1930, y); TRIP.forEach(([, c], i) => bead(g, 550 + i * 230, y, 30, c, 1, .6)); kText(g, '≈ 好久好久 →', 1820, y - 40, 34, { align: 'right', color: AMB, weight: 700 }); }
    if (j == 2) { thread(g, 470, 530, y, 1, 'rgba(255,170,160,.7)'); kText(g, '≈ 一眨眼', 580, y + 14, 44, { color: RED, weight: 900 }); }
    g.restore(); });
  const rk = E.outB(inv(Q(119.5) - .1, Q(120) - .08, t)); if (rk > 0) drawRulerBar(g, 960, 815, 980, 120, '③ 回忆', { s: rk, crack: t > Q(120) ? 1 : 0, split: E.outC(inv(Q(120), Q(120.6), t)), crackX: -40 });
  stampT(g, '尺子③ 失灵', 1210, 735, Q(120), t, { size: 80 });
  subT(g, '没有记忆点，大脑回头一算：没过多久', Q(120.6), Q(124) - .05, t);
}
const RL3 = [['① 注意力', '没在数', -1], ['② 距离', '没挪窝', 1], ['③ 回忆', '没记住', 0]];
function drawS4g(g, t) { // k124–128 three broken rulers converge
  bgDeep(g, t, '#22101e', '#060308', .1);
  const rush = E.inE(inv(Q(127.4), Q(128), t)), pulse = t > Q(127) ? .5 + .5 * Math.sin((t - Q(127)) * 26) : 0;
  g.save(); g.translate(960, 540); g.scale(1 + 1.6 * rush, 1 + 1.6 * rush); g.translate(-960, -540);
  RL3.forEach(([lb, st, d], i) => { const t0 = Q(124 + i), k = E.outE(inv(t0 - .25, t0, t)); if (k <= 0) return; const ty = 330 + i * 200, x = 880 + (d ? d * 1600 * (1 - k) : 0), y = ty + (d ? 0 : 700 * (1 - k)), rot = (1 - k) * (d || 1) * .5 + Math.sin(t * 2 + i) * .02 * (1 - rush);
    drawRulerBar(g, x, y, 900, 120, lb, { rot, crack: 1, split: .35 + .15 * rush, crackX: [80, 40, -40][i], glow: pulse * .8 });
    const lk = inv(t0, t0 + .15, t); if (lk > 0) { g.save(); g.translate(x + 590, y); g.scale(1 + .3 * Math.exp(-(t - t0) * 10), 1 + .3 * Math.exp(-(t - t0) * 10)); kText(g, st, 0, 22, 66, { color: RED, alpha: lk }); g.restore(); } });
  g.restore();
  if (pulse) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,60,60,${.08 * pulse})`; g.fillRect(0, 0, W, H); g.restore(); }
  if (rush > 0) zoomBlur(g, 960, 540, .35 * rush);
}
function drawS4(g, t, fx) {
  if (t < Q(102)) { drawS4a(g, t); chapterBand(g, t, Q(96), 3, '回忆', '第三把尺子'); fx.fl = .55 * Math.exp(-(t - Q(96)) * 7); }
  else if (t < Q(104)) { drawS4b(g, t); fx.fl = .3 * Math.exp(-(t - Q(102)) * 10); }
  else if (t < Q(108)) { drawS4c(g, t); fx.fl = .25 * Math.exp(-(t - Q(104)) * 10) + (t > Q(105) ? .2 * Math.exp(-(t - Q(105)) * 10) : 0); }
  else if (t < Q(112)) { drawS4d(g, t); fx.fl = .3 * Math.exp(-(t - Q(108)) * 10); fx.bl = .55; }
  else if (t < Q(118)) { drawS4e(g, t); fx.fl = .2 * Math.exp(-(t - Q(112)) * 10) + (t > Q(116) ? .3 * Math.exp(-(t - Q(116)) * 9) : 0); fx.ca = t > Q(116) ? 12 * Math.exp(-(t - Q(116)) * 7) : 0; }
  else if (t < Q(124)) { drawS4f(g, t); fx.fl = .2 * Math.exp(-(t - Q(118)) * 10); fx.ca = t > Q(120) ? 12 * Math.exp(-(t - Q(120)) * 7) : 0; }
  else if (t < Q(128)) { drawS4g(g, t); [124, 125, 126].forEach(k => { if (t > Q(k)) fx.fl += .18 * Math.exp(-(t - Q(k)) * 10); }); fx.ca = 6 * inv(Q(127), Q(128), t); }
  else if (typeof drawS5 === 'function') return drawS5(g, t, fx);
  return fx;
}
