// ================= S6: the page, the fix, goodnight (k160–end) =================
function drawPaper(g, t, x, y, rot, s, wp) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); const w = 1000, h = 620;
  g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 50; g.shadowOffsetY = 24; g.fillStyle = '#f6efe1'; g.fillRect(-w / 2, -h / 2, w, h); g.shadowColor = 'transparent';
  g.strokeStyle = 'rgba(90,130,200,.28)'; g.lineWidth = 2; for (let yy = -h / 2 + 170; yy < h / 2 - 20; yy += 78) { g.beginPath(); g.moveTo(-w / 2 + 40, yy); g.lineTo(w / 2 - 40, yy); g.stroke(); }
  g.strokeStyle = 'rgba(230,90,90,.35)'; g.beginPath(); g.moveTo(-w / 2 + 120, -h / 2); g.lineTo(-w / 2 + 120, h / 2); g.stroke();
  kText(g, '昨晚', -w / 2 + 150, -h / 2 + 110, 64, { color: '#2a2238', shadow: null }); kText(g, '21:00 – 01:00', w / 2 - 50, -h / 2 + 105, 38, { align: 'right', color: '#8a7f90', weight: 700, shadow: null });
  if (wp > 0) { g.save(); g.beginPath(); g.rect(-w / 2 + 140, -h / 2 + 150, 520 * wp, 120); g.clip(); kText(g, '刷手机。', -w / 2 + 150, -h / 2 + 238, 92, { color: '#2a2238', shadow: null }); g.restore(); }
  g.restore();
}
function drawS6a(g, t) { // k160–163 4 hours = one line
  bgDeep(g, t, '#241a24', '#070509', 0); glowDot(g, 960, 480, 900, 'rgba(255,190,120,.16)');
  const k = inv(Q(160), Q(160) + .12, t), s = lerp(1.7, 1, E.inC(k)) * (1 + (t > Q(160) + .12 ? .03 * Math.exp(-(t - Q(160) - .12) * 9) : 0)), out = E.inC(inv(Q(162.3), Q(162.75), t));
  drawPaper(g, t, 960, 470 + out * 900, -.025 - out * .2, s, E.ioS(inv(Q(160) + .3, Q(160) + .85, t)));
  subT(g, '4 小时，在记忆里只剩一行字。', Q(161), Q(162.5) - .02, t);
}
function drawS6b(g, t) { // k162.5–164 good news: rulers can be fixed
  if (t < Q(162.75)) drawS6a(g, t); else bgDeep(g, t, '#1d1630', '#05040b', .15);
  rise(g, '好消息：', 960, 330, 66, Q(162.55), t, { color: '#ffd9a0', weight: 700 });
  slamT(g, '尺子能修。', 960, 500, 156, Q(163), t, { color: (i) => i < 2 ? AMB : '#fff' });
  [['① 注意力', 380], ['② 距离', 960], ['③ 回忆', 1540]].forEach(([lb, x], i) => { const ka = E.outB(inv(Q(162.6) + i * .06, Q(162.9) + i * .06, t)); if (ka <= 0) return; const heal = E.outC(inv(Q(163) - .15, Q(163) + .05, t)), sp = .35 * (1 - heal);
    drawRulerBar(g, x, 780, 500, 90, lb, { s: ka * .95, crack: heal < 1 ? 1 : 0, split: sp, crackX: 30, glow: heal * (.6 + .4 * Math.exp(-(t - Q(163)) * 3)) }); });
}
function tipTitle(g, str, t0, t) { slamT(g, str, 960, 165, 88, t0 + .12, t, { color: (i) => i == 0 ? AMB : '#fff' }); }
function drawTip1(g, t) { // k164–168 put time in sight
  bgDeep(g, t, '#1b1530', '#05040b', .15); tipTitle(g, '① 把时间放进视线里', Q(164), t);
  const a = E.outB(inv(Q(164), Q(164) + .35, t)); g.save(); g.translate(620, 590); g.scale(a, a); drawClock(g, 0, 0, 190, 22.6 + (t - Q(164)) / 60, { sec: (t * TAU / 4) % TAU }); g.restore();
  const ea = inv(Q(164.3), Q(164.6), t); if (ea > 0) { g.save(); g.globalAlpha = ea; drawEye(g, 1000, 330, .7, -.9, (t % 2.6) < .12 ? 1 : 0); g.setLineDash([6, 14]); g.strokeStyle = 'rgba(255,214,160,.6)'; g.lineWidth = 4; g.beginPath(); g.moveTo(930, 350); g.lineTo(780, 460); g.stroke(); g.setLineDash([]); g.restore(); }
  let n = 0; for (let i = 0; i < 9; i++) { const ts = Q(164.5 + i * .4), u = inv(ts, ts + .55, t); if (u <= 0) continue; if (u >= 1) { n++; continue; } const e = E.ioC(u), x = lerp(620, 1320, e), y = lerp(590, 760, e) - Math.sin(Math.PI * e) * 260; orb(g, x, y, 14, 1); }
  drawJar(g, 1320, 860, 250, 300, n * 3, t, { r: 13 });
  kText(g, `被数进去：${n * 3}`, 1320, 470, 40, { align: 'center', color: '#ffd9a0', weight: 700, alpha: inv(Q(165), Q(165.3), t) });
  subT(g, '床头放个钟，或者定个"该放下了"的闹钟', Q(165), Q(168) - .03, t);
}
const PATH6 = [[730, 560], [930, 470], [1130, 420], [1260, 450], [1330, 600], [1400, 720], [1200, 790], [960, 760], [760, 640]];
function drawTip2(g, t) { // k168–172 get up and walk
  bgDeep(g, t, '#1b1530', '#05040b', .15); tipTitle(g, '② 刷一阵，起身走几步', Q(168), t);
  const a = E.outE(inv(Q(168), Q(168) + .4, t)); g.save(); g.globalAlpha = a; g.translate(960, 600); g.scale(lerp(.9, 1, a), lerp(.9, 1, a)); g.translate(-960, -600);
  g.fillStyle = 'rgba(30,24,52,.85)'; rr(g, 420, 330, 1080, 560, 18); g.fill(); g.strokeStyle = CREAM; g.lineWidth = 8; g.beginPath(); g.moveTo(1080, 330); g.lineTo(420, 330); g.lineTo(420, 890); g.lineTo(820, 890); g.moveTo(960, 890); g.lineTo(1500, 890); g.lineTo(1500, 330); g.lineTo(1300, 330); g.stroke();
  g.strokeStyle = '#7fc4ff'; g.lineWidth = 10; g.beginPath(); g.moveTo(1090, 330); g.lineTo(1290, 330); g.stroke(); glowDot(g, 1190, 340, 200, 'rgba(120,190,255,.25)'); kText(g, '窗', 1190, 310, 30, { align: 'center', color: '#9fd0ff', weight: 700 });
  g.fillStyle = '#4a3f6e'; rr(g, 450, 360, 250, 330, 14); g.fill(); g.fillStyle = '#e8e2f2'; rr(g, 470, 375, 210, 70, 18); g.fill(); g.fillStyle = '#6a5a9a'; rr(g, 450, 470, 250, 220, 14); g.fill(); kText(g, '床', 575, 600, 34, { align: 'center', color: '#d8d0f0', weight: 700, shadow: null });
  g.fillStyle = '#3c3456'; rr(g, 1390, 560, 90, 300, 10); g.fill(); g.fillStyle = '#fff'; rr(g, 1415, 640, 40, 50, 6); g.fill(); kText(g, '水', 1435, 760, 30, { align: 'center', color: '#d8d0f0', weight: 700, shadow: null });
  g.fillStyle = 'rgba(255,178,63,.9)'; g.beginPath(); g.arc(720, 560, 9, 0, TAU); g.fill(); kText(g, '原来：10 厘米', 720, 528, 26, { align: 'center', color: '#ffd9a0', weight: 700, alpha: 1 - inv(Q(169), Q(169.5), t) });
  const segs = []; let L = 0; for (let i = 1; i < PATH6.length; i++) { const d = Math.hypot(PATH6[i][0] - PATH6[i - 1][0], PATH6[i][1] - PATH6[i - 1][1]); segs.push(d); L += d; }
  const p = E.ioS(inv(Q(168.5), Q(171.6), t)), step = 46, nSteps = Math.floor(L * p / step);
  for (let s = 0; s < nSteps; s++) { let d = s * step + 20, i = 0; while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; } const u = Math.min(1, d / segs[i]), x = lerp(PATH6[i][0], PATH6[i + 1][0], u), y = lerp(PATH6[i][1], PATH6[i + 1][1], u), an = Math.atan2(PATH6[i + 1][1] - PATH6[i][1], PATH6[i + 1][0] - PATH6[i][0]), side = s % 2 ? 1 : -1;
    const age = (nSteps - s); g.save(); g.translate(x - Math.sin(an) * 12 * side, y + Math.cos(an) * 12 * side); g.rotate(an + Math.PI / 2); g.globalAlpha = Math.max(.35, 1 - age * .03); g.fillStyle = AMB; g.beginPath(); g.ellipse(0, 0, 9, 15, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(0, -20, 6, 0, TAU); g.fill(); g.restore(); }
  g.restore();
  hudTime(g, `移动：${(0.1 + 14.9 * p).toFixed(1)} 米`, 1530, 220, inv(Q(168.5), Q(168.8), t), .9);
  subT(g, '倒杯水、开窗吹吹风，都算', Q(169), Q(172) - .03, t);
}
function drawTip3(g, t) { // k172–176 leave one memory bead
  bgDeep(g, t, '#1b1530', '#05040b', .15); tipTitle(g, '③ 给今晚留一个记忆点', Q(172), t);
  const y = 560; thread(g, 360, 1560, y, inv(Q(172), Q(172) + .3, t));
  const k = inv(Q(173) - .22, Q(173), t), u = t - Q(173);
  if (u > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.translate(960, y); g.rotate(u * .3); for (let i = 0; i < 12; i++) { g.rotate(TAU / 12); g.fillStyle = `rgba(255,200,120,${.18 * Math.min(1, u * 3)})`; g.beginPath(); g.moveTo(0, 0); g.lineTo(-30, -520); g.lineTo(30, -520); g.fill(); } g.restore(); g.save(); g.strokeStyle = `rgba(255,220,160,${Math.max(0, .9 - u)})`; g.lineWidth = 5; g.beginPath(); g.arc(960, y, 80 + u * 400, 0, TAU); g.stroke(); g.restore(); }
  if (k > 0) bead(g, 960, lerp(y - 380, y, E.inC(k)) - (u > 0 ? 30 * Math.exp(-u * 8) * Math.abs(Math.sin(u * 20)) : 0), 72, AMB, 1, 1.2);
  [['一通电话', 560, 173.5], ['几页书', 960, 174], ['一句日记', 1360, 174.5]].forEach(([s, x, kk]) => { const a = E.outB(inv(Q(kk) - .1, Q(kk) + .15, t)); if (a <= 0) return; g.save(); g.translate(x, 770); g.scale(a, a); g.font = F(900, 46); const w = g.measureText(s).width + 70; rr(g, -w / 2, -42, w, 84, 42); g.fillStyle = 'rgba(255,178,63,.18)'; g.fill(); g.strokeStyle = 'rgba(255,214,160,.8)'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, 0, 2); g.restore(); });
  subT(g, '哪怕只有一颗，今晚也会被"记住"', Q(174.8), Q(176) - .03, t);
}
function drawS6d(g, t) { // k176–180 the night is not shorter
  bgDeep(g, t, '#1d1530', '#05040b', .15); const y = 545, L0 = 1500, k = E.outEl(inv(Q(176), Q(177.3), t)), L = 20 + (L0 - 20) * k;
  ribbonSeg(g, 960 - L / 2, 960 + L / 2, y, 90, 0);
  ['21:00', '22:00', '23:00', '00:00', '01:00'].forEach((s, i) => kText(g, s, 960 - L0 / 2 + i * L0 / 4, y - 70, 34, { align: 'center', color: '#ffd9a0', weight: 700, alpha: inv(Q(177) + i * .08, Q(177.3) + i * .08, t) }));
  for (let i = 0; i < 40; i++) { const tt = Q(177) + i * (Q(179.5) - Q(177)) / 40, a = inv(tt, tt + .1, t); if (a <= 0) continue; const x = 960 - L0 / 2 + (i + .5) * L0 / 40; glowDot(g, x, y, 40, `rgba(255,240,200,${.7 * a * (.5 + .5 * Math.exp(-(t - tt) * 4))})`); g.fillStyle = `rgba(255,255,255,${a})`; g.beginPath(); g.arc(x, y, 5, 0, TAU); g.fill(); }
  slamT(g, '你的夜晚没有变短，', 960, 330, 100, Q(176) + .12, t);
  slamT(g, '只是没被数进去。', 960, 790, 124, Q(178), t, { color: (i) => i >= 4 && i <= 6 ? AMB : '#fff' });
}
function drawEnd(g, t) { // k180–end: screen off, goodnight, final question
  const u = inv(Q(180), Q(180) + .32, t);
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  if (u < 1) { LX.setTransform(1, 0, 0, 1, 0, 0); LX.globalAlpha = 1; LX.globalCompositeOperation = 'source-over'; LX.filter = 'none'; LX.clearRect(0, 0, W, H); drawS6d(LX, Q(180) - .02); }
  if (u < 1) { const sy = u < .6 ? lerp(1, .006, E.inC(u / .6)) : .006, sx = u < .6 ? 1 : lerp(1, .0, E.inC((u - .6) / .4)); g.save(); g.translate(960, 540); g.scale(sx, sy); g.translate(-960, -540); g.drawImage(LAYC, 0, 0); g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,255,255,${.5 * u})`; g.fillRect(0, 0, W, H); g.restore(); }
  const d = 1 - inv(Q(180) + .3, Q(180) + .7, t); if (u > .55 && d > 0) glowDot(g, 960, 540, 60, `rgba(255,255,255,${d})`);
  const fin = 1 - inv(133.85, 134.15, t);
  const ga = inv(129.2, 129.7, t) * (1 - inv(131.1, 131.45, t)); if (ga > 0) kText(g, '晚安。', 960, 540, 104, { align: 'center', color: CREAM, alpha: ga, shadow: 'rgba(255,190,120,.35)', sBlur: 40 });
  const ra = inv(129.8, 130.2, t) * (1 - inv(131.1, 131.45, t)); if (ra > 0) { kText(g, '参考：Cohen, Hansel & Sylvester (1953) 卡帕效应 ｜ Zakay & Block (1997) 注意力闸门模型 ｜ Hammond (2012)《Time Warped》假期悖论', 960, 985, 24, { align: 'center', color: 'rgba(255,255,255,.55)', weight: 700, alpha: ra, shadow: null }); }
  if (t > 131.6) { rise(g, '对了——', 960, 470, 56, 131.7, t, { color: '#ffd9a0', weight: 700, alpha: fin }); rise(g, '你现在，几点了？', 960, 600, 104, 132.4, t, { color: (i) => i == 4 || i == 5 ? AMB : '#fff', alpha: fin, stag: .05 }); }
}
function drawS6(g, t, fx) {
  if (t < Q(162.5)) { drawS6a(g, t); fx.fl = .7 * Math.exp(-(t - Q(160)) * 7); fx.ca = 14 * Math.exp(-(t - Q(160)) * 7); }
  else if (t < Q(164)) { drawS6b(g, t); fx.fl = t > Q(163) ? .35 * Math.exp(-(t - Q(163)) * 8) : 0; fx.bl = .55; }
  else if (t < Q(168)) { drawTip1(g, t); fx.fl = .25 * Math.exp(-(t - Q(164)) * 10); }
  else if (t < Q(172)) { drawTip2(g, t); fx.fl = .25 * Math.exp(-(t - Q(168)) * 10); }
  else if (t < Q(176)) { drawTip3(g, t); fx.fl = .25 * Math.exp(-(t - Q(172)) * 10) + (t > Q(173) ? .3 * Math.exp(-(t - Q(173)) * 8) : 0); fx.bl = .6; }
  else if (t < Q(180)) { drawS6d(g, t); fx.fl = .25 * Math.exp(-(t - Q(176)) * 10) + (t > Q(178) ? .25 * Math.exp(-(t - Q(178)) * 10) : 0); fx.bl = .55; }
  else { drawEnd(g, t); fx.bl = .3; }
  return fx;
}
