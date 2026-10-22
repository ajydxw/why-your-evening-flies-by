// ================= S3: ruler ② distance (k64–96) =================
const FL = [48.75, 49.75, 50.75];
function drawLights(g, t, o = {}) {
  KAP.forEach((P, i) => { const f = t > FL[i] ? Math.exp(-(t - FL[i]) * 5) : 0, base = o.base ?? .35;
    g.save(); g.strokeStyle = 'rgba(255,214,160,.5)'; g.lineWidth = 3; g.beginPath(); g.arc(P[0], P[1], 34, 0, TAU); g.stroke(); g.restore();
    orb(g, P[0], P[1], 20 + 10 * f, base + (1 - base) * f, AMB); if (f > .02) { glowDot(g, P[0], P[1], 260 * f + 60, `rgba(255,220,150,${.8 * f})`); g.save(); g.strokeStyle = `rgba(255,220,160,${f})`; g.lineWidth = 4; g.beginPath(); g.arc(P[0], P[1], 34 + (1 - f) * 120, 0, TAU); g.stroke(); g.restore(); }
    if (o.labels) kText(g, 'ABC'[i], P[0], P[1] + 100, 54, { align: 'center', color: '#ffe2b0', alpha: o.labels });
  });
}
function drawS3a(g, t) { // k64–74 chapter + kappa test
  bgDeep(g, t, '#17122e', '#05040b', .3);
  if (t < Q(66)) { g.strokeStyle = 'rgba(160,180,255,.18)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 600); g.lineTo(W, 600); g.stroke(); }
  drawLights(g, t, { labels: inv(Q(65.5), Q(66), t) });
  rise(g, '来做个小测试', 960, 210, 76, Q(66), t, { t1: Q(71.6) });
  rise(g, '盯住这三个光点，感受它们亮起的间隔', 960, 300, 46, Q(66) + .45, t, { t1: Q(71.6), color: '#ffd9a0', weight: 700 });
  rise(g, 'A→B 和 B→C，哪一段更久？', 960, 250, 84, Q(72), t, { t1: Q(74) - .05, color: (i) => (i == 0 || i == 2 || i == 6 || i == 8) ? AMB : '#fff' });
  const ch = inv(Q(72.5), Q(72.5) + .25, t) * (1 - inv(Q(74) - .15, Q(74), t)); if (ch > 0) { [['A→B 更久', 760], ['B→C 更久', 1160]].forEach(([s, x], j) => { const hi = j == 1 ? inv(Q(73), Q(73) + .15, t) : 0; g.save(); g.globalAlpha = ch; g.translate(x, 830); g.scale(1 + .08 * hi, 1 + .08 * hi); g.font = F(900, 48); const w = g.measureText(s).width + 70; rr(g, -w / 2, -45, w, 90, 45); g.fillStyle = hi ? `rgba(255,178,63,${.25 + .6 * hi})` : 'rgba(255,255,255,.1)'; g.fill(); g.strokeStyle = 'rgba(255,214,160,.7)'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, 2); g.restore(); });
    const hk = inv(Q(73), Q(73) + .2, t); if (hk > 0) kText(g, '多数人的直觉 ↓', 1160, 745, 36, { align: 'center', color: '#ffd9a0', alpha: hk * ch, weight: 700 }); }
  if (t > Q(74) - .15) { slamT(g, '其实——一样长。', 960, 290, 128, Q(74), t, { color: (i) => i >= 3 ? AMB : '#fff' });
    [[0, 'A→B   1.0 秒'], [1, 'B→C   1.0 秒']].forEach(([j, s]) => { const k = E.outC(inv(Q(74) + .1 + j * .2, Q(74) + .45 + j * .2, t)); if (k <= 0) return; const x0 = j ? 990 : 550; g.save(); rr(g, x0, 790, 380 * k, 60, 30); g.fillStyle = j ? 'rgba(255,178,63,.85)' : 'rgba(160,200,255,.8)'; g.fill(); g.globalAlpha = k; g.font = F(900, 40); g.fillStyle = '#120c1e'; g.textBaseline = 'middle'; g.fillText(s, x0 + 30, 822); g.restore(); });
    tagT(g, '卡帕效应 · Cohen, Hansel & Sylvester, 1953', 60, 70, Q(74), Q(82), t); }
}
function drawWalker(g, x, y, s, ph) {
  g.save(); g.translate(x, y); g.scale(s, s); const sw = Math.sin(ph) * .5; g.strokeStyle = '#cfd8ee'; g.lineWidth = 14; g.lineCap = 'round';
  g.beginPath(); g.moveTo(0, -70); g.lineTo(Math.sin(sw) * 50, 0); g.moveTo(0, -70); g.lineTo(-Math.sin(sw) * 50, 0); g.moveTo(0, -150); g.lineTo(Math.sin(-sw) * 45, -95); g.moveTo(0, -150); g.lineTo(Math.sin(sw) * 45, -95); g.stroke();
  g.lineWidth = 20; g.beginPath(); g.moveTo(0, -160); g.lineTo(0, -70); g.stroke(); g.fillStyle = '#cfd8ee'; g.beginPath(); g.arc(0, -195, 26, 0, TAU); g.fill(); g.restore();
}
function drawS3b(g, t) { // k76–82 kappa: farther = longer
  bgDeep(g, t, '#1b1432', '#05040b', .25);
  rise(g, '这叫"卡帕效应"——', 960, 190, 60, Q(76) + .05, t, { color: '#ffd9a0', weight: 700 });
  slamT(g, '大脑默认：', 960, 300, 88, Q(77), t);
  slamT(g, '走得越远，花得越久。', 960, 445, 124, Q(78), t, { color: (i) => (i == 2 || i == 3 || i == 7 || i == 8) ? AMB : '#fff' });
  const p = E.ioS(inv(Q(76), Q(82) - .1, t)), x = lerp(180, 1720, p), y = 860;
  g.save(); g.fillStyle = '#2a2342'; g.fillRect(100, y, 1720, 26); g.strokeStyle = 'rgba(255,214,160,.5)'; g.lineWidth = 2; for (let i = 0; i <= 86; i++) { const xx = 100 + i * 20; g.beginPath(); g.moveTo(xx, y + 26); g.lineTo(xx, y + 26 + (i % 5 ? 10 : 22)); g.stroke(); } g.restore();
  g.save(); g.strokeStyle = AMB; g.lineWidth = 8; g.shadowColor = AMB; g.shadowBlur = 20; g.beginPath(); g.moveTo(180, y + 12); g.lineTo(x, y + 12); g.stroke(); g.restore();
  drawWalker(g, x, y, 1, t * 11);
  const mins = Math.round(1 + 59 * p), bw = 260; g.save(); g.translate(x, y - 285); g.globalAlpha = inv(Q(76) + .2, Q(76) + .5, t); rr(g, -bw / 2, -46, bw, 80, 24); g.fillStyle = 'rgba(8,6,18,.75)'; g.fill(); g.strokeStyle = 'rgba(255,178,63,.7)'; g.lineWidth = 2; g.stroke();
  g.beginPath(); g.moveTo(-14, 34); g.lineTo(0, 54); g.lineTo(14, 34); g.fill(); g.font = F(900, 40); g.fillStyle = '#fff'; g.textAlign = 'center'; g.fillText(`感觉 ${mins} 分钟`, 0, 8); g.restore();
  subT(g, '在大脑里，距离和时间是绑在一起"估"的', Q(79.5), Q(82) - .05, t);
}
function drawCity(g, t, p) {
  g.fillStyle = '#1c1830'; g.fillRect(-2000, -2000, 6000, 6000);
  const r = rng(31); for (let bx = -600; bx < 2600; bx += 200) for (let by = -600; by < 1700; by += 200) { const w = 150 + r() * 30, h = 150 + r() * 30; g.fillStyle = r() < .12 ? '#21402f' : ['#2c2745', '#332c50', '#28233f'][Math.floor(r() * 3)]; rr(g, bx + 18, by + 18, w - 20, h - 20, 10); g.fill(); }
  g.strokeStyle = '#2b4a7a'; g.lineWidth = 70; g.beginPath(); g.moveTo(-600, 1100); g.bezierCurveTo(400, 900, 900, 1300, 2600, 950); g.stroke();
  const P = CITY; let L = 0; const seg = []; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(d); L += d; }
  let rem = L * p; g.save(); g.strokeStyle = AMB; g.lineWidth = 12; g.lineCap = 'round'; g.lineJoin = 'round'; g.shadowColor = AMB; g.shadowBlur = 24; g.setLineDash([2, 22]); g.beginPath(); g.moveTo(P[0][0], P[0][1]); let hx = P[0][0], hy = P[0][1];
  for (let i = 1; i < P.length && rem > 0; i++) { const u = Math.min(1, rem / seg[i - 1]); hx = lerp(P[i - 1][0], P[i][0], u); hy = lerp(P[i - 1][1], P[i][1], u); g.lineTo(hx, hy); rem -= seg[i - 1]; } g.stroke(); g.restore();
  PINS.forEach(([x, y, s], i) => { const k = inv(i * .2 - .05, i * .2 + .05, p); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(E.outB(k), E.outB(k)); g.fillStyle = i ? '#ffffff' : AMB; g.beginPath(); g.arc(0, -40, 26, 0, TAU); g.fill(); g.beginPath(); g.moveTo(-18, -26); g.lineTo(0, 0); g.lineTo(18, -26); g.fill(); kText(g, s, 0, -82, 40, { align: 'center', color: '#fff', shadow: 'rgba(0,0,0,.9)' }); g.restore(); });
  orb(g, hx, hy, 14, 1);
}
const CITY = [[260, 820], [600, 820], [600, 420], [1250, 420], [1250, 260], [1560, 260], [1560, 420], [1250, 420], [600, 420], [600, 820], [260, 820]];
const PINS = [[260, 820, '家'], [600, 620, '地铁'], [1250, 260, '公司'], [1560, 260, '食堂'], [900, 420, '便利店']];
function drawS3c(g, t) { // k82–88 day 8000 steps vs night 10 cm
  const zin = E.inE(inv(Q(84) - .45, Q(84), t));
  if (t < Q(84)) { const p = inv(Q(82), Q(84) - .4, t); g.save(); cam(g, lerp(910, 260, zin), lerp(560, 790, zin), (1 + .05 * inv(Q(82), Q(84), t)) * Math.exp(3.2 * zin), -.03 + .03 * zin); drawCity(g, t, p); g.restore(); if (zin > 0) zoomBlur(g, 960, 540, .5 * zin);
    const steps = Math.round(8000 * E.ioS(p) / 10) * 10; g.save(); g.globalAlpha = 1 - zin; hudTime(g, `白天：${steps.toLocaleString('en-US')} 步`, 70, 60, 1, 1.3); g.restore();
    rise(g, '白天，你跑了大半个城', 960, 1000, 64, Q(82) + .1, t, { t1: Q(84) - .2 }); return; }
  const z = E.outE(inv(Q(84), Q(84) + .5, t)); const s = lerp(9, 1.22, z) * (1 + .05 * inv(Q(84), Q(88), t));
  g.save(); cam(g, 960, 430, s, lerp(.4, 0, z)); drawTopDown(g, t, { traces: 200, idx: 2, thumbUp: Math.sin(t * 9) * .5 + .5, clock: '00:12' });
  g.fillStyle = 'rgba(255,240,215,.96)'; rr(g, 1028, 412, 34, 116, 5); g.fill(); g.strokeStyle = '#3a2a1a'; g.lineWidth = 1.6; for (let i = 0; i <= 10; i++) { const ty = 528 - 11.6 * i; g.beginPath(); g.moveTo(1028, ty); g.lineTo(1028 + (i % 5 ? 10 : 20), ty); g.stroke(); } g.restore();
  if (z < 1) zoomBlur(g, 960, 540, .5 * (1 - z));
  hudTime(g, '今晚：10 厘米', 70, 60, inv(Q(84) + .2, Q(84) + .4, t), 1.3);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 860, W, 220);
  slamT(g, '今晚，你只挪了 10 厘米', 960, 990, 84, Q(85), t, { color: (i) => i >= 7 ? AMB : '#fff' });
  tagT(g, '类比', 1490, 958, Q(85) + .2, Q(88), t, { size: 32 });
}
function drawS3d(g, t) { // k88–96 brain: no movement = no time; ruler ② broken; tease ③
  bgDeep(g, t, '#1a1330', '#05040b', .25); const out = inv(Q(91.6), Q(92), t);
  layer(g, 1 - out, g => {
  slamT(g, '移动距离 ≈ 0', 960, 330, 110, Q(88), t);
  const ak = E.outC(inv(Q(88.5), Q(89), t)); if (ak > 0) { g.save(); g.strokeStyle = AMB; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(960, 380); g.lineTo(960, 380 + 80 * ak); g.moveTo(940, 360 + 80 * ak); g.lineTo(960, 380 + 80 * ak); g.lineTo(980, 360 + 80 * ak); g.stroke(); g.restore(); }
  slamT(g, '大脑估计：没过多久', 960, 570, 110, Q(89), t, { color: (i) => i >= 5 ? AMB : '#fff' });
  const rk = E.outB(inv(Q(89.6), Q(90), t)); if (rk > 0) drawRulerBar(g, 960, 790, 1000, 130, '② 距离', { s: rk, crack: t > Q(90) ? 1 : 0, split: E.outC(inv(Q(90), Q(90.6), t)), crackX: 60 });
  stampT(g, '尺子② 失灵', 1180, 720, Q(90), t, { size: 80 });
  });
  subT(g, '一晚上没挪地方，大脑就以为：没过多久', Q(90) + .15, Q(92) - .1, t);
  const dk = inv(Q(92), Q(92) + .3, t) * (1 - inv(Q(93.8), Q(94), t)); if (dk > 0) { g.save(); const s = 1 + .08 * inv(Q(92), Q(94), t); g.translate(960, 540); g.scale(s, s); g.translate(-960, -540); rise(g, '但最狠的，', 960, 470, 96, Q(92), t); rise(g, '是第三把尺子——', 960, 620, 120, Q(92.7), t, { color: (i) => i >= 1 && i <= 5 ? AMB : '#fff' }); g.restore(); }
  if (t >= Q(94)) drawAlarm(g, t);
}
function drawAlarm(g, t) { // k94–96 morning alarm
  const u = inv(Q(94), Q(94) + .35, t), ring = t > Q(94) ? 1 : 0;
  g.fillStyle = radial(g, 960, 1000, 1400 * E.outC(u) + 1, [[0, 'rgba(255,214,150,1)'], [.5, 'rgba(255,170,110,.9)'], [1, 'rgba(60,40,80,1)']]); g.fillRect(0, 0, W, H);
  const r = rng(4); g.save(); g.globalCompositeOperation = 'lighter'; g.translate(960, 1000); for (let i = 0; i < 14; i++) { g.rotate(TAU / 14); g.fillStyle = 'rgba(255,240,200,.12)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-80, -1600); g.lineTo(80, -1600); g.fill(); } g.restore();
  const sh = Math.sin(t * 70) * 8 * ring, s = lerp(.2, 1, E.outB(u)); g.save(); g.translate(960 + sh, 560); g.scale(s, s); g.rotate(Math.sin(t * 60) * .04 * ring);
  g.fillStyle = '#e8493f'; [-1, 1].forEach(d => { g.beginPath(); g.arc(d * 150, -200, 70, Math.PI, TAU); g.fill(); }); g.fillStyle = '#c23a33'; g.beginPath(); g.arc(0, 0, 240, 0, TAU); g.fill(); g.fillStyle = '#fff6ea'; g.beginPath(); g.arc(0, 0, 200, 0, TAU); g.fill();
  g.font = F(900, 120); g.fillStyle = '#2a1e2e'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('07:30', 0, 10); g.strokeStyle = '#2a1e2e'; g.lineWidth = 20; g.lineCap = 'round'; [-1, 1].forEach(d => { g.beginPath(); g.moveTo(d * 120, 200); g.lineTo(d * 170, 270); g.stroke(); }); g.restore();
  if (ring) { g.save(); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 8; g.lineCap = 'round'; [-1, 1].forEach(d => { for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + d * (.5 + i * .3); g.beginPath(); g.moveTo(960 + Math.cos(a) * 330, 560 + Math.sin(a) * 330); g.lineTo(960 + Math.cos(a) * 400, 560 + Math.sin(a) * 400); g.stroke(); } }); g.restore(); }
}
function drawS3(g, t, fx) {
  if (t < Q(76)) { drawS3a(g, t); chapterBand(g, t, Q(64), 2, '距离', '第二把尺子'); if (t > Q(74)) fx.fl = .35 * Math.exp(-(t - Q(74)) * 9); FL.forEach(f => { if (t > f) fx.fl += .12 * Math.exp(-(t - f) * 10); }); }
  else if (t < Q(82)) { drawS3b(g, t); fx.fl = .3 * Math.exp(-(t - Q(76)) * 10) + (t > Q(78) ? .25 * Math.exp(-(t - Q(78)) * 10) : 0); }
  else if (t < Q(88)) { drawS3c(g, t); fx.fl = .3 * Math.exp(-(t - Q(82)) * 10) + (t > Q(84) ? .5 * Math.exp(-(t - Q(84)) * 10) : 0); }
  else if (t < Q(96)) { drawS3d(g, t); fx.fl = .25 * Math.exp(-(t - Q(88)) * 10) + (t > Q(94) ? .7 * Math.exp(-(t - Q(94)) * 8) : 0); fx.ca = t > Q(90) ? 12 * Math.exp(-(t - Q(90)) * 7) : 0; }
  else if (typeof drawS4 === 'function') return drawS4(g, t, fx);
  return fx;
}
