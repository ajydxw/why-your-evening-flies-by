// ================= S2: ruler ① attention (k32–64) =================
function headPath(g) { g.beginPath(); g.moveTo(-120, 170); g.bezierCurveTo(-125, 80, -200, -20, -165, -125); g.bezierCurveTo(-125, -235, 70, -255, 140, -150); g.bezierCurveTo(165, -110, 158, -70, 170, -40); g.lineTo(205, 15); g.lineTo(172, 32); g.bezierCurveTo(180, 55, 165, 78, 158, 92); g.bezierCurveTo(140, 118, 95, 122, 62, 116); g.lineTo(52, 170); g.closePath(); }
function drawHead(g, x, y, s, t, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  headPath(g); g.fillStyle = linear(g, -200, -250, 200, 170, [[0, '#30285a'], [1, '#17122a']]); g.fill(); g.strokeStyle = 'rgba(160,190,255,.4)'; g.lineWidth = 3; g.stroke();
  g.save(); headPath(g); g.clip(); const bx = -15, by = -110; glowDot(g, bx, by, 230, `rgba(255,140,190,${.28 * (o.glow ?? 1)})`);
  g.fillStyle = '#e993b6'; g.beginPath(); g.ellipse(bx, by, 125, 88, -.08, 0, TAU); g.fill(); g.strokeStyle = '#b8587f'; g.lineWidth = 6; g.lineCap = 'round';
  [[-80, -30, 40, .4, 2.6], [-30, -60, 35, 3.5, 5.8], [30, -20, 45, .2, 2.8], [-40, 30, 38, 3.3, 6], [60, 40, 30, 3.8, 6.2], [90, -40, 28, 1.8, 4.4]].forEach(([dx, dy, r, a0, a1]) => { g.beginPath(); g.arc(bx + dx * .9, by + dy * .75, r * .7, a0, a1); g.stroke(); });
  g.restore(); g.restore();
}
function drawStopwatch(g, x, y, r, ang, a = 1) {
  if (a <= 0 || r <= 1) return; g.save(); g.translate(x, y); g.globalAlpha = a; g.fillStyle = '#d9dde8';
  rr(g, -r * .2, -r * 1.36, r * .4, r * .26, 6); g.fill(); g.fillRect(-r * .08, -r * 1.12, r * .16, r * .16);
  g.save(); g.rotate(.75); rr(g, -r * .1, -r * 1.22, r * .2, r * .2, 4); g.fill(); g.restore();
  g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fillStyle = '#eef1f7'; g.fill(); g.lineWidth = r * .12; g.strokeStyle = '#9aa3b8'; g.stroke();
  for (let i = 0; i < 12; i++) { const an = i / 12 * TAU; g.strokeStyle = '#4a5068'; g.lineWidth = r * .045; g.beginPath(); g.moveTo(Math.cos(an) * r * .82, Math.sin(an) * r * .82); g.lineTo(Math.cos(an) * r * .68, Math.sin(an) * r * .68); g.stroke(); }
  g.rotate(ang); g.strokeStyle = '#e0453a'; g.lineWidth = r * .07; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, r * .15); g.lineTo(0, -r * .75); g.stroke(); g.fillStyle = '#e0453a'; g.beginPath(); g.arc(0, 0, r * .09, 0, TAU); g.fill(); g.restore();
}
function drawS2a(g, t) { // k32–36: your brain has no stopwatch
  bgDeep(g, t, '#1d1440', '#05040b');
  const up = E.outE(inv(Q(32) - .1, Q(32) + .7, t)), zin = E.inE(inv(Q(35.55), Q(36), t));
  const hx = 540, hy = lerp(860, 600, up), bx = hx - 15 * 1.5, by = hy - 110 * 1.5;
  g.save(); const s = (1 + .05 * inv(Q(32), Q(36), t)) * Math.exp(3.4 * zin); g.translate(bx, by); g.scale(s, s); g.translate(-bx, -by);
  drawHead(g, hx, hy, 1.5, t, { glow: 1 + .5 * Math.sin(t * 4) });
  const d = inv(Q(33) - .42, Q(33), t); if (d > 0) { const kill = inv(Q(34) + .05, Q(34) + .55, t); const sy = lerp(-220, by, E.outB(d));
    drawStopwatch(g, bx, sy, 72 * (1 - .75 * E.inC(kill)), t * 9 * (1 - kill), 1 - kill);
    if (t > Q(34) - .12) { const x1 = inv(Q(34) - .12, Q(34) - .02, t), x2 = inv(Q(34) - .02, Q(34) + .08, t), R = 125; g.save(); g.strokeStyle = RED; g.lineCap = 'round'; g.lineWidth = 24; g.shadowColor = RED; g.shadowBlur = 25; g.globalAlpha = 1 - inv(Q(35.1), Q(35.5), t);
      g.beginPath(); g.moveTo(bx - R, by - R); g.lineTo(bx - R + 2 * R * x1, by - R + 2 * R * x1); if (x2 > 0) { g.moveTo(bx + R, by - R); g.lineTo(bx + R - 2 * R * x2, by - R + 2 * R * x2); } g.stroke(); g.restore(); } }
  const qk = inv(Q(35), Q(35) + .3, t); if (qk > 0) kText(g, '?', bx, by + 55 - 40 * E.outB(qk), 170, { align: 'center', color: AMB, alpha: qk, shadow: 'rgba(255,150,40,.8)', sBlur: 40 });
  g.restore();
  rise(g, '你的大脑里，', 1330, 430, 84, Q(32) + .3, t, { t1: Q(36) });
  slamT(g, '没有秒表。', 1330, 615, 168, Q(34), t, { color: (i) => (i == 2 || i == 3) ? AMB : '#fff', t1: Q(36) });
  if (zin > 0) zoomBlur(g, bx, by, .4 * zin);
}
const RL = ['① 注意力', '② 距离', '③ 回忆'];
function drawS2b(g, t) { // k36–42: three rulers, ruler ① takes over
  bgDeep(g, t, '#201638', '#05040b', .5);
  const ex = E.ioC(inv(Q(39.2), Q(40), t));
  rise(g, '它只能靠三把"尺子"来估', 960, 215, 80, Q(36) + .05, t, { t1: Q(39.4), color: (i, c) => (i >= 4 && i <= 9) ? AMB : '#fff' });
  for (let i = 0; i < 3; i++) { const ta = Q(36.5 + i * .5), k = inv(ta - .32, ta, t); if (k <= 0) continue; const e = E.outB(k);
    let x = lerp([-1400, 3300, 960][i], 960, E.outC(k)), y = lerp([440, 610, 1600][i], 425 + i * 190, E.outC(k)) + Math.sin(t * 2 + i) * 5, rot = (1 - e) * [-.6, .6, .4][i] + [-.02, .015, -.01][i], s = 1;
    if (i > 0) x += [0, 2700, -2700][i] * E.inC(ex);
    else { x = lerp(x, 960, ex); y = lerp(y, 540, ex); rot *= 1 - ex; s = Math.exp(2.4 * E.inC(ex)) * (1 + .06 * inv(Q(40), Q(42), t)); x -= 90 * inv(Q(40), Q(42), t) * s / 11; }
    drawRulerBar(g, x, y, 1200, 150, RL[i], { rot, s, glow: i == 0 ? .4 * ex : 0 });
  }
  if (t > Q(39.6)) { flash(g, .55 * inv(Q(39.6), Q(40), t), '#000'); zoomBlur(g, 960, 540, .3 * ex * (1 - inv(Q(40), Q(40.3), t))); }
  chapterBand(g, t, Q(40), 1, '注意力', '第一把尺子');
}
function drawKitchen(g, t, o = {}) { // world 0..960
  g.fillStyle = '#34405a'; g.fillRect(-100, -100, 1160, 1280);
  g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 2; for (let x = 0; x < 960; x += 80) { g.beginPath(); g.moveTo(x, 150); g.lineTo(x, 640); g.stroke(); } for (let y = 160; y < 640; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(960, y); g.stroke(); }
  g.fillStyle = '#4b5672'; g.fillRect(-100, -100, 1160, 250); g.fillStyle = '#56627f'; for (let x = 20; x < 960; x += 240) { rr(g, x, 10, 220, 125, 10); g.fill(); }
  g.fillStyle = '#d8c8ae'; g.fillRect(-100, 640, 1160, 34); g.fillStyle = '#6b5a4c'; g.fillRect(-100, 674, 1160, 500); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-100, 674, 1160, 14);
  const mx = 110, my = 380, mw = 440, mh = 260; g.fillStyle = 'rgba(0,0,0,.3)'; rr(g, mx + 10, my + 18, mw, mh, 22); g.fill(); g.fillStyle = '#e4e8ef'; rr(g, mx, my, mw, mh, 22); g.fill();
  rr(g, mx + 26, my + 28, 290, 204, 14); g.fillStyle = '#1a1f2b'; g.fill();
  g.save(); rr(g, mx + 26, my + 28, 290, 204, 14); g.clip(); g.fillStyle = radial(g, mx + 171, my + 130, 200, [[0, 'rgba(255,190,90,.85)'], [1, 'rgba(255,140,40,.15)']]); g.fillRect(mx, my, mw, mh);
  g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.ellipse(mx + 171, my + 200, 110, 22, 0, 0, TAU); g.fill(); g.fillStyle = '#f2f2f2'; rr(g, mx + 121 + Math.cos(t * 2) * 34, my + 150, 100, 50, 12); g.fill(); g.restore();
  rr(g, mx + 334, my + 40, 92, 54, 8); g.fillStyle = '#0e1a14'; g.fill(); g.font = F(900, 36); g.fillStyle = '#5dffb0'; g.textAlign = 'center'; g.shadowColor = '#5dffb0'; g.shadowBlur = 10; g.fillText(o.disp || '1:00', mx + 380, my + 80); g.shadowBlur = 0; g.textAlign = 'left';
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { g.fillStyle = '#c5cbd6'; rr(g, mx + 342 + j * 42, my + 116 + i * 38, 34, 26, 6); g.fill(); }
  drawStander(g, 760, 1120, t, 1);
}
function drawStander(g, x, y, t, tap) {
  g.save(); g.translate(x, y);
  g.fillStyle = '#2b3550'; rr(g, -62, -330, 52, 330, 20); g.fill(); g.save(); g.translate(36, -330); g.rotate(-.1 * Math.max(0, Math.sin(t * 13)) * tap); rr(g, -26, 0, 52, 330, 20); g.fill(); g.restore();
  g.fillStyle = '#7a93c4'; rr(g, -105, -650, 210, 350, 75); g.fill();
  g.fillStyle = '#6a82b4'; rr(g, -115, -530, 230, 72, 36); g.fill(); g.fillStyle = '#e2b79c'; g.beginPath(); g.arc(-104, -494, 26, 0, TAU); g.arc(104, -494, 26, 0, TAU); g.fill();
  const bob = Math.sin(t * 1.5) * 4; g.fillStyle = '#e2b79c'; g.beginPath(); g.ellipse(-12, -742 + bob, 82, 92, 0, 0, TAU); g.fill(); g.fillStyle = '#2a2236'; g.beginPath(); g.ellipse(8, -796 + bob, 92, 52, -.2, Math.PI * .95, TAU * 1.02); g.fill();
  g.fillStyle = '#1e1a26'; g.beginPath(); g.ellipse(-54, -746 + bob, 10, 7, 0, 0, TAU); g.fill(); g.strokeStyle = '#1e1a26'; g.lineWidth = 6; g.beginPath(); g.moveTo(-70, -757 + bob); g.lineTo(-36, -755 + bob); g.stroke();
  g.strokeStyle = '#9c6d64'; g.lineWidth = 5; g.beginPath(); g.moveTo(-64, -700 + bob); g.lineTo(-40, -698 + bob); g.stroke(); g.restore();
}
function drawS2c(g, t) { // k42–48: microwave minute vs scrolling minute
  const t0 = Q(42), p = inv(Q(42.3), Q(45.6), t), sec = Math.floor(60 * p + 1e-6), inA = E.outE(inv(t0 - .02, t0 + .45, t)), zs = 1 + .05 * inv(t0, Q(48), t);
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.save(); g.beginPath(); g.rect(0, 0, 960, H); g.clip(); g.translate(-700 * (1 - inA), 0); g.translate(480, 540); g.scale(zs, zs); g.translate(-480, -540);
  const left = 60 - sec; drawKitchen(g, t, { disp: left >= 60 ? '1:00' : '0:' + String(left).padStart(2, '0') }); g.restore();
  g.save(); g.beginPath(); g.rect(960, 0, 960, H); g.clip(); g.translate(700 * (1 - inA), 0); g.translate(480, 0);
  const cyc = .42, q = (t - t0) / cyc, f = q - Math.floor(q), k = E.ioC(clamp(f / .6)); cam(g, 960, 560, .8 * zs);
  drawPhoneCU(g, t, { idx: 1 + (Math.floor(q) % 5 + 5) % 5, k, thumb: [lerp(1095, 1050, k), lerp(840, 480, k)], clock: '23:41', bat: .4 }); g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,178,63,.9)'; g.lineWidth = 4; g.shadowColor = AMB; g.shadowBlur = 24; g.beginPath(); g.moveTo(960, 0); g.lineTo(960, H); g.stroke(); g.restore();
  rise(g, '盯着微波炉的 1 分钟', 480, 140, 56, t0 + .15, t);
  rise(g, '刷视频的 1 分钟', 1440, 140, 56, t0 + .3, t);
  const pa = inv(t0 + .2, t0 + .45, t); if (pa > 0) { g.save(); g.globalAlpha = pa; rr(g, 830, 210, 260, 104, 22); g.fillStyle = 'rgba(8,6,18,.75)'; g.fill(); g.strokeStyle = 'rgba(255,178,63,.7)'; g.lineWidth = 2; g.stroke(); g.font = F(700, 26); g.fillStyle = '#ffd9a0'; g.textAlign = 'center'; g.fillText('真实时间', 960, 248); g.font = F(900, 46); g.fillStyle = '#fff'; g.fillText('00:' + String(Math.min(60, sec)).padStart(2, '0'), 960, 298); g.restore(); }
  // feelings
  const lb = inv(Q(44) - .2, Q(44), t); if (lb > 0) { g.save(); g.globalAlpha = lb; g.fillStyle = linear(g, 0, 760, 0, H, [[0, 'rgba(0,0,0,0)'], [.4, 'rgba(0,0,0,.6)'], [1, 'rgba(0,0,0,.75)']]); g.fillRect(0, 760, W, 320); g.restore(); }
  if (t > Q(44) - .15) { const k1 = inv(Q(44) - .13, Q(44), t); kText(g, '好——漫——长', 480, 900, 104, { align: 'center', color: '#cfe0f5', alpha: clamp(k1 * 2.5), shadow: 'rgba(0,0,0,.85)', sBlur: 30, fn: (i, n) => ({ dy: -60 * (1 - E.outB(k1)) + 6 * Math.sin(t * 3 + i), sy: 1 + .25 * Math.max(0, Math.sin(t * 2 + i * .6)) }) }); }
  if (t > Q(45) - .15) { const k2 = inv(Q(45) - .12, Q(45), t); kText(g, '嗖——没了', 1440, 900, 104, { align: 'center', color: AMB, alpha: clamp(k2 * 3), shadow: 'rgba(0,0,0,.85)', sBlur: 30, fn: (i, n) => ({ dx: 500 * (1 - E.outE(k2)) * (1 + i * .2), sx: 1 + 1.5 * (1 - E.outE(k2)) }) }); }
  subT(g, '同样 1 分钟——差别只在：你有没有"盯着"时间', Q(46), Q(48) - .05, t);
}
// --- the attentional-gate model ---
function drawMetronome(g, x, y, s, ang) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#6e4630'; g.beginPath(); g.moveTo(-110, 0); g.lineTo(110, 0); g.lineTo(55, -330); g.lineTo(-55, -330); g.closePath(); g.fill();
  g.fillStyle = '#8f5f40'; g.beginPath(); g.moveTo(-80, -20); g.lineTo(80, -20); g.lineTo(40, -300); g.lineTo(-40, -300); g.closePath(); g.fill();
  g.fillStyle = '#e9d9b8'; rr(g, -14, -280, 28, 200, 6); g.fill();
  g.save(); g.translate(0, -60); g.rotate(ang); g.strokeStyle = '#e8e8f0'; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -320); g.stroke(); g.fillStyle = AMB; rr(g, -22, -240, 44, 36, 6); g.fill(); g.restore();
  g.fillStyle = '#4a2f20'; rr(g, -122, -16, 244, 22, 8); g.fill(); g.restore();
}
function drawGate(g, x, y, close, a = 1) {
  if (a <= 0) return; g.save(); g.globalAlpha = a; const h = 150, gap = (1 - close) * h * 1.7;
  g.fillStyle = '#5a6180'; rr(g, x - 72, y - h - 30, 22, 2 * h + 60, 8); g.fill(); rr(g, x + 50, y - h - 30, 22, 2 * h + 60, 8); g.fill(); rr(g, x - 80, y - h - 46, 160, 22, 8); g.fill();
  const col = close > .5 ? 'rgba(255,90,90,.8)' : 'rgba(120,255,170,.6)'; g.fillStyle = col; g.fillRect(x - 50, y - h, 100, h - gap / 2); g.fillRect(x - 50, y + gap / 2, 100, h - gap / 2);
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(x - 50 + i * 25, y - h); g.lineTo(x - 50 + i * 25, y - gap / 2); g.moveTo(x - 50 + i * 25, y + gap / 2); g.lineTo(x - 50 + i * 25, y + h); g.stroke(); }
  glowDot(g, x, y - h - 70, 60, close > .5 ? 'rgba(255,80,80,.9)' : 'rgba(110,255,160,.9)'); g.fillStyle = close > .5 ? '#ff6a6a' : '#7dffb4'; g.beginPath(); g.arc(x, y - h - 70, 14, 0, TAU); g.fill(); g.restore();
}
const MOD = { met: [330, 330], gate: [960, 640], jar: [1500, 820], mouth: [1500, 500], close: Q(52) };
function orbPath(k, t) { // orb emitted on beat k
  const t0 = Q(k), tg = t0 + .62, pass = tg < MOD.close - .04; if (t < t0) return null;
  if (t < tg) { const u = (t - t0) / .62, x = lerp(MOD.met[0], MOD.gate[0], u), y = lerp(MOD.met[1], MOD.gate[1], u) - 140 * Math.sin(Math.PI * u); return { x, y, a: clamp(u * 5) }; }
  if (!pass) { const u = (t - tg) / .55; if (u > 1) return null; return { x: MOD.gate[0] - 70 - 260 * u, y: MOD.gate[1] - 160 * Math.sin(Math.PI * Math.min(1, u * 1.2)) + 260 * u * u, a: 1 - u, bounce: 1 }; }
  const tj = tg + .5; if (t < tj) { const u = (t - tg) / .5; return { x: lerp(MOD.gate[0], MOD.mouth[0], u), y: lerp(MOD.gate[1], MOD.mouth[1], u) - 120 * Math.sin(Math.PI * u), a: 1 }; }
  const tl = tj + .3; if (t < tl) { const u = E.inC((t - tj) / .3); return { x: MOD.mouth[0], y: lerp(MOD.mouth[1], MOD.jar[1] - 40, u), a: 1 }; }
  return { landed: 1 };
}
function drawModel(g, t, o = {}) {
  bgDeep(g, t, '#1a1434', '#05040b', .35);
  g.save(); g.setLineDash([4, 14]); g.strokeStyle = 'rgba(255,200,120,.22)'; g.lineWidth = 4; g.beginPath(); g.moveTo(MOD.met[0], MOD.met[1]); g.quadraticCurveTo(645, 340, MOD.gate[0], MOD.gate[1]); g.quadraticCurveTo(1230, 420, MOD.mouth[0], MOD.mouth[1]); g.stroke(); g.restore();
  drawMetronome(g, MOD.met[0], 820, 1.15, .38 * Math.cos(Math.PI * (t - PH) / BEAT));
  const ga = E.outB(inv(Q(50) - .25, Q(50), t)), cl = E.outB(inv(MOD.close - .12, MOD.close, t));
  if (ga > 0) { g.save(); g.translate(0, -400 * (1 - ga)); drawGate(g, MOD.gate[0], MOD.gate[1], cl, clamp(ga * 2)); g.restore(); }
  let n = 0; const fl = []; for (let k = 46; k <= 56; k++) { const P = orbPath(k, t); if (!P) continue; if (P.landed) { n++; continue; } fl.push(P); }
  drawJar(g, MOD.jar[0], MOD.jar[1] + 20, 250, 300, n, t, { r: 15 });
  fl.forEach(P => orb(g, P.x, P.y, 15, P.a));
  g.save(); kText(g, `已数：${n}`, MOD.jar[0], 450, 50, { align: 'center', color: '#ffe2b0' }); g.restore();
  const ea = inv(Q(50) - .1, Q(50) + .2, t); if (ea > 0) { const look = lerp(-1, 1, E.ioC(inv(MOD.close - .3, MOD.close - .08, t))); g.save(); g.globalAlpha = ea;
    drawClock(g, 700, 215, 62, 22 + t / 60, { sec: t * TAU / 4 }); drawPhoneIcon(g, 1220, 215, .85, t, look > 0 ? 1 : .25, 3);
    g.setLineDash([3, 10]); g.strokeStyle = 'rgba(255,200,120,.6)'; g.lineWidth = 4; g.beginPath(); g.moveTo(960 + look * 40, 205); g.lineTo(look < 0 ? 770 : 1170, 215); g.stroke(); g.setLineDash([]);
    drawEye(g, 960, 215, .75, look); g.restore(); }
  rise(g, '节拍器', MOD.met[0], 905, 44, Q(48) + .1, t, { color: '#ffd9a0', weight: 700 });
  rise(g, '闸门', MOD.gate[0], 905, 44, Q(50), t, { color: '#ffd9a0', weight: 700 });
  rise(g, '计数', MOD.jar[0], 905, 44, Q(48) + .25, t, { color: '#ffd9a0', weight: 700 });
}
function drawS2d(g, t) { // k48–56
  const zi = E.outE(inv(Q(48), Q(48) + .5, t)); g.save(); g.translate(960, 540); g.scale(lerp(1.25, 1, zi) * (1 + .03 * inv(Q(48), Q(56), t)), lerp(1.25, 1, zi)); g.translate(-960, -540); drawModel(g, t); g.restore();
  subT(g, '大脑里有个"节拍器"，一直在发脉冲', Q(48) + .1, Q(50) - .05, t);
  subT(g, '中间还有一道"闸门"：你看着时间，它就开', Q(50) + .05, MOD.close - .05, t);
  subT(g, '眼睛一离开时间——闸门就关上', MOD.close + .02, Q(53) - .05, t, { color: '#ffd0d0' });
  tagT(g, '注意力闸门模型 · Zakay & Block, 1997', 60, 70, Q(50), Q(56), t);
  const dm = inv(Q(53) - .15, Q(53), t); if (dm > 0) { g.fillStyle = `rgba(5,4,12,${.78 * dm})`; g.fillRect(0, 0, W, H); }
  slamT(g, '只有你留意时间，', 960, 480, 116, Q(53), t, { color: (i) => (i >= 3 && i <= 6) ? AMB : '#fff' });
  slamT(g, '它才会被"数"进去。', 960, 660, 130, Q(54), t);
}
let S2E_LBL = 1;
function drawS2e(g, t) { // k56–60 two jars
  const t0 = Q(56), sl = E.outE(inv(t0 - .02, t0 + .4, t));
  g.fillStyle = radial(g, 480, 500, 900, [[0, '#2c3a58'], [1, '#0b1020']]); g.fillRect(0, 0, 960, H);
  g.fillStyle = radial(g, 1440, 500, 900, [[0, '#2a1a48'], [1, '#08060f']]); g.fillRect(960, 0, 960, H);
  g.save(); g.translate(0, 80 * (1 - sl)); g.globalAlpha = sl;
  // left: office clock, jar fills
  drawClock(g, 480, 260, 82, 15 + t / 40, { sec: t * TAU / 2 }); rise(g, '上班盯着钟', 480, 130, 52, t0 + .05, t, { weight: 700 });
  const nL = Math.floor(240 * E.outC(inv(t0, Q(58.6), t))), fall = []; if (t < Q(58.6)) for (let j = 0; j < 8; j++) { const ph = (t * 2.6 + j / 8) % 1; fall.push([(hsh(j) - .5) * 160, lerp(-420, -60 - Math.min(26, nL / 9.5) * 14, ph), clamp(ph * 4)]); }
  drawJar(g, 480, 830, 300, 360, nL, t, { r: 8, falling: fall });
  layerT(g, S2E_LBL, g => kText(g, `已数 ${nL}`, 480, 900, 40, { align: 'center', color: '#cfe0f5', weight: 700 }));
  // right: phone, gate closed, orbs bounce off
  drawPhoneIcon(g, 1440, 260, .95, t, 1, 4); rise(g, '晚上刷手机', 1440, 130, 52, t0 + .15, t, { weight: 700 });
  const pas = [Q(56.6), Q(57.6), Q(58.6)]; let nR = pas.filter(x => t > x + .25).length; const open = pas.some(x => t > x - .1 && t < x + .12);
  const fallR = []; pas.forEach(x => { const u = (t - x + .1) / .35; if (u > 0 && u < 1) fallR.push([0, lerp(-420, -40, E.inC(u)), 1]); });
  drawJar(g, 1440, 830, 300, 360, nR, t, { r: 14, falling: fallR, seed: 5 });
  g.save(); g.translate(1440, 830 - 395); g.rotate(Math.PI / 2); drawGate(g, 0, 0, open ? 0 : 1, 1); g.restore();
  for (let j = 0; j < 10; j++) { const ph = (t * 2.2 + j / 10) % 1, side = j % 2 ? 1 : -1; const x = 1440 + side * (20 + 300 * ph), y = 300 + 130 * Math.min(1, ph * 4) - 200 * Math.sin(Math.PI * Math.min(1, ph * 1.3)) * (ph > .25 ? 1 : 0) + 500 * Math.max(0, ph - .25) ** 2; orb(g, ph < .25 ? 1440 + side * 10 : x, ph < .25 ? lerp(330, 420, ph * 4) : y - 0, 12, (1 - ph) * .9); }
  layerT(g, S2E_LBL, g => kText(g, `已数 ${nR}`, 1440, 900, 40, { align: 'center', color: '#ffd9a0', weight: 700 }));
  g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,178,63,.8)'; g.lineWidth = 3; g.beginPath(); g.moveTo(960, 0); g.lineTo(960, H); g.stroke(); g.restore();
  layerT(g, S2E_LBL, g => { slamT(g, '数得多 → 好漫长', 480, 1005, 62, Q(58), t, { color: '#cfe0f5' });
  slamT(g, '数得少 → 一眨眼', 1440, 1005, 62, Q(59), t, { color: AMB }); });
}
function drawS2f(g, t) { // k60–64 ruler ① broken; orbs roll out
  if (t < Q(62)) { const z = E.ioC(inv(Q(60) - .2, Q(60) + .4, t)); g.save(); cam(g, lerp(960, 1440, z), lerp(540, 600, z), lerp(1, 1.45, z) * (1 + .03 * inv(Q(60), Q(62), t))); S2E_LBL = 1 - E.ioC(inv(Q(60) - .2, Q(60) + .2, t)); drawS2e(g, t); S2E_LBL = 1; g.restore();
    g.fillStyle = `rgba(0,0,0,${.35 * z})`; g.fillRect(0, 0, W, H);
    stampT(g, '尺子① 失灵', 960, 430, Q(60), t, { size: 96 });
    subT(g, '注意力全被屏幕吸走——时间，根本没被数进去', Q(60) + .15, Q(62), t); return; }
  bgDeep(g, t, '#17122e', '#05040b', .3);
  const u = inv(Q(62), Q(62) + .6, t), tip = E.outB(u); g.save(); g.translate(lerp(560, 300, E.inC(inv(Q(62.6), Q(63.6), t))), 760); g.rotate(-tip * Math.PI / 2 * .92); g.globalAlpha = 1 - inv(Q(63), Q(63.6), t); drawJar(g, 0, 0, 300, 360, 0, t, { r: 14 }); g.restore();
  g.strokeStyle = 'rgba(160,180,255,.18)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 600); g.lineTo(W, 600); g.stroke();
  KAP.forEach((P, i) => { const ts = Q(62.25) + i * .1, te = [Q(62.9), Q(63.3), Q(63.9)][i], k = inv(ts, te, t); if (k <= 0) return; const e = E.outC(k), x = lerp(720, P[0], e), y = P[1] - Math.abs(Math.sin(e * Math.PI * 3)) * 30 * (1 - e); orb(g, x, y, 20, 1); });
}
const KAP = [[560, 580], [800, 580], [1560, 580]];
