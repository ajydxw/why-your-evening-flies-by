// ================= OPENING TIMELINE =================
const T = { s2: bt(4), det: bt(6), hit: bt(7), shat: bt(8), lineA: bt(9), lineB: bt(10), fly: bt(13), bedIn: bt(14), swipe: bt(16), freeze: bt(20), slam2: bt(21), neq: bt(22), rew: bt(23), mont: bt(24), rocket: bt(26), ruler: bt(27), burst: bt(29), tShat: bt(32), END: bt(32) + .5 };
const AMB = '#FFB23F';
const IMPACT = [1000, 540];
let SNAP = null, VOR = null, SH_A = null, SH_B = null, SH_T = null, TBOX = null;
const splitX = (y, xt) => xt - 300 * (y / H);
function slashTop(t) { if (t < T.s2) return W + 420; return lerp(W + 420, 1150, E.outE(inv(T.s2, T.s2 + .42, t))); }

function stickySec(t) { const q = Math.max(0, (t - PH) / BEAT), k = Math.floor(q), u = q - k; const m = E.ioQ(clamp((u - .04) / .72)); const v = 37 + k + m; return { a: v / 60 * TAU, ghosts: (u > .04 && u < .8) ? [[(v - .25 * m) / 60 * TAU, .22], [(v - .5 * m) / 60 * TAU, .12]] : null }; }

function drawOfficeCam(g, t) {
  g.save();
  const z = E.ioC(inv(.12, 1.75, t)); let s = lerp(2.75, 1, z) * (1 + .018 * Math.max(0, t - 1.75)); let cx = 960, cy = lerp(300, 540, z);
  const sl = t >= T.s2 ? E.outE(inv(T.s2, T.s2 + .45, t)) : 0; cx += 360 * sl; s *= lerp(1, .95, sl);
  const sh = shakeAt(t, [[bt(0), 7, .3], [bt(1), 6, .3], [bt(2), 6, .3], [bt(3), 6, .3], [bt(4), 10, .35]]);
  cam(g, cx, cy, s, sh.r, sh.x, sh.y);
  const ss = stickySec(t);
  drawOffice(g, t, { sec: ss.a, ghosts: ss.ghosts, drip: E.ioS(inv(.2, 5.2, t)) * .95, hours: 15 + 47 / 60 + ss.a / TAU / 60, yawn: Math.sin(Math.PI * inv(1.9, 2.9, t)) });
  g.restore();
}
function bedHoursS2(t) { const u = inv(T.s2 + .1, T.hit, t); return 19.5 + 4 * E.inC(u) * .25 + 4 * .75 * u; }
function drawBedS2(g, t, xt) {
  g.save(); g.beginPath(); g.moveTo(xt, 0); g.lineTo(W + 10, 0); g.lineTo(W + 10, H); g.lineTo(splitX(H, xt), H); g.closePath(); g.clip();
  const off = xt - 1150; g.translate(off, 0);
  g.save(); cam(g, 470, 470, .9); const hrs = bedHoursS2(t); drawBedroom(g, t, { p: .15, hours: hrs, spin: t > T.s2 + .2 ? 1 : 0, steam: 1, flick: .75 + .25 * Math.sin(t * 40) }); g.restore();
  // rolling digital clock under the wall clock
  const mins = Math.floor((hrs % 24) * 60), hh = String(Math.floor(mins / 60)).padStart(2, '0'), mm = String(mins % 60).padStart(2, '0');
  const dx = 1610, dy = 430; g.save(); rr(g, dx - 150, dy - 62, 300, 92, 24); g.fillStyle = 'rgba(10,8,20,.6)'; g.fill(); g.strokeStyle = 'rgba(255,178,63,.5)'; g.lineWidth = 2; g.stroke();
  g.font = F(900, 70); g.textAlign = 'center'; g.fillStyle = AMB; const speed = t > T.s2 + .2 && t < T.hit ? 1 : 0; for (let i = -2; i <= 2; i++) { g.globalAlpha = speed ? [.15, .3, 1, .3, .15][i + 2] : (i == 0 ? 1 : 0); g.fillText(`${hh}:${mm}`, dx, dy + 12 + i * 16 * speed); } g.restore();
  g.restore();
  // amber edge
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,178,63,.95)'; g.lineWidth = 5; g.shadowColor = AMB; g.shadowBlur = 30; g.beginPath(); g.moveTo(xt, -10); g.lineTo(splitX(H + 10, xt), H + 10); g.stroke(); g.restore();
}
function line1(g, t) {
  const drop = (t0) => (i) => { const ti = t0 + i * .065, k = inv(ti, ti + .6, t); return { a: clamp(k * 2.5), dy: -80 * (1 - E.outC(k)) + 10 * Math.sin(Math.PI * clamp(k * 1.4)) * (1 - k), sy: 1 + .45 * Math.pow(1 - k, 2), sx: 1 - .12 * Math.pow(1 - k, 2) }; };
  kText(g, '为什么你上班 8 小时，', 110, 880, 62, { color: (i, c) => (c === '8' || c === '小' || c === '时') ? '#ffffff' : '#dfe6ef', fn: drop(.4), track: .02 });
  kText(g, '度日如年，', 104, 1012, 124, { color: '#c9d8ec', fn: drop(1.05), track: .04 });
}
function line2(g, t) {
  if (t < T.s2 + .1) return;
  const zip = (t0) => (i, n) => { const ti = t0 + (n - 1 - i) * .03, k = inv(ti, ti + .28, t); return { a: clamp(k * 3), dx: 420 * (1 - E.outE(k)), sx: 1 + 1.2 * (1 - E.outE(k)) }; };
  kText(g, '下班后的 4 小时，', 1868, 150, 62, { align: 'right', color: '#ffe6c4', fn: zip(T.s2 + .12) });
  kText(g, '一眨眼就没了？', 1872, 282, 112, { align: 'right', color: (i) => i < 3 ? AMB : '#fff1dc', fn: zip(T.s2 + .3) });
}
function flyingHand(g, t) {
  if (t < T.det || t >= T.hit) return; const u = inv(T.det, T.hit, t), e = E.inC(u);
  const p0 = [1312, 387], p1 = [1560, 800], p2 = IMPACT; const bx = (1 - e) * (1 - e) * p0[0] + 2 * e * (1 - e) * p1[0] + e * e * p2[0], by = (1 - e) * (1 - e) * p0[1] + 2 * e * (1 - e) * p1[1] + e * e * p2[1];
  for (let k = 6; k >= 0; k--) { const e2 = E.inC(Math.max(0, u - k * .02)); const x = (1 - e2) * (1 - e2) * p0[0] + 2 * e2 * (1 - e2) * p1[0] + e2 * e2 * p2[0], y = (1 - e2) * (1 - e2) * p0[1] + 2 * e2 * (1 - e2) * p1[1] + e2 * e2 * p2[1];
    const sc = lerp(1, 2.6, E.inQ(clamp(u - k * .02))); g.save(); g.globalAlpha = k ? .22 * (1 - k / 7) : 1; g.translate(x, y); g.rotate(2 + e2 * 14); g.scale(sc, sc); if (!k) { g.shadowColor = AMB; g.shadowBlur = 30; } g.fillStyle = k ? AMB : '#fff4e0'; g.strokeStyle = AMB; g.lineWidth = 3; rr(g, -9, -70, 18, 90, 9); g.fill(); if (!k) g.stroke(); g.restore(); }
  glowDot(g, bx, by, 140, 'rgba(255,178,63,.55)');
}
function drawS12(g, t, withHand = true) {
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  drawOfficeCam(g, t);
  const xt = slashTop(t);
  if (xt < W + 400) drawBedS2(g, t, xt);
  line1(g, t); line2(g, t);
  if (withHand) flyingHand(g, t);
}
function buildShatter() {
  SNAP = mk(W, H); const g = SNAP.getContext('2d'); drawS12(g, T.hit - .001, false);
  const r = rng(12), seeds = [];
  for (let i = 0; i < 34; i++) { const a = r() * TAU, d = 20 + Math.pow(r(), .8) * 260; seeds.push([IMPACT[0] + Math.cos(a) * d, IMPACT[1] + Math.sin(a) * d]); }
  for (let i = 0; i < 40; i++) { const a = r() * TAU, d = 260 + r() * 700; seeds.push([IMPACT[0] + Math.cos(a) * d * 1.3, IMPACT[1] + Math.sin(a) * d]); }
  for (let i = 0; i < 46; i++) seeds.push([r() * W, r() * H]);
  VOR = voronoi(seeds, -20, -20, W + 20, H + 20).filter(P => P.length > 2).map(P => { const S = polyInfo(P); S.d = Math.hypot(S.cx - IMPACT[0], S.cy - IMPACT[1]); const dx = S.cx - IMPACT[0], dy = S.cy - IMPACT[1], l = Math.hypot(dx, dy) || 1; S.dir = [dx / l, dy / l]; S.r = [r(), r(), r(), r()]; return S; });
}
function drawCrack(g, t) { // T.hit..T.shat
  const u = t - T.hit, R = 2300 * E.outE(clamp(u / .5)), push = 1 + .03 * E.outC(clamp(u / .7));
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(IMPACT[0], IMPACT[1]); g.scale(push, push); g.translate(-IMPACT[0], -IMPACT[1]);
  VOR.forEach(S => { const on = S.d < R ? 1 : 0; const sep = on * (3 + S.r[0] * 7) * (1 + 2 * clamp((u - .3) / .4)) * (S.d < 300 ? 1.6 : 1); drawShard(g, SNAP, S, S.cx + S.dir[0] * sep, S.cy + S.dir[1] * sep, on * (S.r[1] - .5) * .02, 1, 1, 1, on ? ['rgba(235,245,255,.75)', 2] : null); });
  g.restore();
  glowDot(g, IMPACT[0], IMPACT[1], 260, `rgba(255,200,130,${.55 * (1 - clamp(u / .6))})`);
}
function shardState(S, t) {
  const tau = t - T.shat - S.d / 4200; if (tau <= 0) return null; const u = 1 - Math.exp(-tau * 2.6);
  const sp = 260 + S.r[0] * 620, z = 1 + (.25 + S.r[1] * 1.4) * u * 1.4;
  let x = S.cx + S.dir[0] * sp * u, y = S.cy + S.dir[1] * sp * u + 60 * tau * tau; x = 960 + (x - 960) * z; y = 540 + (y - 540) * z;
  return { x, y, rot: (S.r[2] - .5) * 5 * u, sc: z, flip: Math.cos(S.r[3] * 7 * u + .2), a: 1 - clamp((tau - .45) / .9) };
}
function drawVoid(g, t) {
  g.fillStyle = radial(g, 960, 560, 1300, [[0, '#14102a'], [.6, '#08070f'], [1, '#020205']]); g.fillRect(0, 0, W, H);
  const r = rng(3); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 90; i++) { const x = (r() * W + t * 14 * (r() - .5) * 4 + W) % W, y = (r() * H - t * 10 * r() + H * 3) % H; g.globalAlpha = .12 + .3 * r(); g.fillStyle = r() < .6 ? '#ffcf8a' : '#9fc2ff'; g.beginPath(); g.arc(x, y, .8 + r() * 2.2, 0, TAU); g.fill(); } g.restore();
}
function drawImgShards(g, t) {
  VOR.forEach(S => { const st = shardState(S, t); if (!st) { drawShard(g, SNAP, S, S.cx + S.dir[0] * 12, S.cy + S.dir[1] * 12, 0, 1, 1, 1, ['rgba(235,245,255,.7)', 2]); return; } if (st.a <= 0) return;
    drawShard(g, SNAP, S, st.x, st.y, st.rot, st.sc, st.flip, st.a * (.55 + .45 * Math.abs(st.flip)), [`rgba(255,${200 + 40 * Math.abs(st.flip)},150,${.85 * st.a})`, 2.2]);
    if (Math.abs(st.flip) < .25) glowDot(g, st.x, st.y, 60 * st.sc, `rgba(255,230,200,${.5 * st.a})`); });
}
function buildText() {
  SH_A = shardText([{ str: '不是时间变快了——', x: 960, y: 455, size: 104, opt: { align: 'center', color: '#f4f6fb', shadow: null } }], 30, 4);
  SH_B = shardText([{ str: '是你的大脑，根本没在数。', x: 960, y: 650, size: 128, opt: { align: 'center', color: (i) => (i >= 5 && i <= 9) ? AMB : '#ffffff', shadow: null } }], 34, 5);
  SH_T = shardText([{ str: '你的夜晚，', x: 960, y: 420, size: 118, opt: { align: 'center', color: '#f4f6fb', shadow: null } }, { str: '为什么过得这么快？', x: 960, y: 610, size: 156, opt: { align: 'center', color: (i) => (i >= 5 && i <= 7) ? AMB : '#ffffff', shadow: null } }, { str: '—— 偷走 4 小时的 10 厘米 ——', x: 960, y: 728, size: 48, opt: { align: 'center', color: '#ffcf8a', weight: 700, shadow: null } }], 30, 6);
}
function assemble(g, SH, t, tLock, spread = 900, dur = .55, from = null, edgeCol = 'rgba(255,214,150,.9)') {
  if (t >= tLock + .03) { g.drawImage(SH.cv, 0, 0); return; }
  SH.tris.forEach(S => {
    const ta = tLock - S.r1 * .14, k = inv(ta - dur, ta, t); if (k <= 0) return;
    const a = S.r2 * TAU, d = spread * (.45 + S.r3 * .9); const sx = from ? from[0] + (S.r2 - .5) * 300 : S.cx + Math.cos(a) * d, sy = from ? from[1] + (S.r3 - .5) * 300 : S.cy + Math.sin(a) * d;
    const e = E.outQ(k); const x = lerp(sx, S.cx, e), y = lerp(sy, S.cy, e);
    drawShard(g, SH.cv, S, x, y, (1 - e) * (S.r4 - .5) * 9, lerp(.2, 1, E.outC(k)), Math.cos((1 - e) * S.r4 * 9), clamp(k * 2.5), k < .98 ? [edgeCol, 1.5] : null);
  });
}
function explodeOut(g, SH, t, t0) { // shards fly toward camera
  SH.tris.forEach(S => { const tau = t - t0 - S.r1 * .08; if (tau < 0) { drawShard(g, SH.cv, S, S.cx, S.cy, 0, 1, 1, 1); return; } const u = 1 - Math.exp(-tau * 3); const z = 1 + (1 + S.r2 * 3) * u; const dx = S.cx - 960, dy = S.cy - 540; const x = 960 + dx * z + (S.r3 - .5) * 400 * u, y = 540 + dy * z + (S.r4 - .5) * 300 * u;
    drawShard(g, SH.cv, S, x, y, (S.r4 - .5) * 6 * u, z, Math.cos(S.r2 * 8 * u), 1 - clamp(tau / .55), ['rgba(255,214,150,.8)', 1.5]); });
}
function maskSweep(g, src, x, w, a, col = '255,240,220') { // light band clipped to text pixels
  TX.setTransform(1, 0, 0, 1, 0, 0); TX.globalCompositeOperation = 'source-over'; TX.clearRect(0, 0, W, H); TX.drawImage(src, 0, 0); TX.globalCompositeOperation = 'source-in';
  TX.fillStyle = linear(TX, x - w, 0, x + w, 0, [[0, `rgba(${col},0)`], [.5, `rgba(${col},${a})`], [1, `rgba(${col},0)`]]); TX.fillRect(0, 0, W, H); TX.globalCompositeOperation = 'source-over';
  g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(TMP, 0, 0); g.restore();
}
function sub(g, str, t0, t1, t, opt = {}) { // bottom/any subtitle with soft in/out
  const a = inv(t0, t0 + .2, t) * (1 - inv(t1 - .2, t1, t)); if (a <= 0) return;
  kText(g, str, opt.x ?? 960, opt.y ?? 975, opt.size ?? 64, { align: 'center', color: opt.color || '#fff', alpha: a, shadow: 'rgba(0,0,0,.8)', sBlur: 30, fn: (i, n) => { const k = inv(t0 + i * .025, t0 + i * .025 + .3, t); return { a: k, dy: 18 * (1 - E.outC(k)) }; } });
}
function hudTime(g, str, x, y, a = 1, big = 1) {
  if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = F(900, 46 * big); const w = g.measureText(str).width + 60 * big; rr(g, x, y, w, 70 * big, 35 * big); g.fillStyle = 'rgba(8,6,18,.62)'; g.fill(); g.strokeStyle = 'rgba(255,178,63,.55)'; g.lineWidth = 2; g.stroke();
  g.fillStyle = AMB; g.textBaseline = 'middle'; g.fillText(str, x + 30 * big, y + 37 * big); g.restore();
}
function fmtH(h) { h = ((h % 24) + 24) % 24; const m = Math.floor(h * 60 + 1e-6); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

function countTimes() { const a = []; let c = T.lineB + .175, n = 0; while (c < T.fly - .5) { a.push(c); c += .178 * (1 + n * .13); n++; } return a; }
const CT = countTimes();
function drawCountDial(g, t) { // the brain's "stopwatch" stepping, slowing, then stopping
  const A = inv(T.lineB + .05, T.lineB + .35, t) * (1 - inv(T.fly - .35, T.fly, t)); if (A <= 0) return;
  let k = 0; while (k < CT.length && t >= CT[k]) k++;
  const last = CT[CT.length - 1], dead = inv(last + .15, last + .7, t);
  const step = k > 0 ? E.outB(clamp((t - CT[k - 1]) / .09)) : 0; const pos = Math.max(0, k - 1 + step), ang = -Math.PI / 2 + pos * TAU / 12;
  const R = 430, cx = 960, cy = 555; g.save(); g.translate(cx, cy);
  g.globalAlpha = A * .2 * (1 - .5 * dead); g.strokeStyle = '#c8d2ff'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, R, 0, TAU); g.stroke();
  for (let i = 0; i < 60; i++) { const an = -Math.PI / 2 + i / 60 * TAU, L = i % 5 ? 12 : 30; const lit = i / 5 <= pos + 1e-6; g.globalAlpha = A * (lit ? .55 * (1 - .85 * dead) : .18 * (1 - .4 * dead)); g.strokeStyle = lit ? AMB : '#c8d2ff'; g.lineWidth = i % 5 ? 2 : 4; g.beginPath(); g.moveTo(Math.cos(an) * R, Math.sin(an) * R); g.lineTo(Math.cos(an) * (R - L), Math.sin(an) * (R - L)); g.stroke(); }
  g.globalAlpha = A * .5 * (1 - dead); g.strokeStyle = AMB; g.lineWidth = 5; g.lineCap = 'round'; g.shadowColor = AMB; g.shadowBlur = 18; g.beginPath(); g.moveTo(-Math.cos(ang) * 40, -Math.sin(ang) * 40); g.lineTo(Math.cos(ang) * (R - 50), Math.sin(ang) * (R - 50)); g.stroke();
  g.restore();
}
// ----- shot 4: fly through, vortex, reveal -----
function drawFly(g, t) {
  const u = inv(T.fly, T.fly + .42, t); drawVoid(g, t);
  const s = Math.exp(3.6 * E.inC(u)); g.save(); g.translate(960, 600); g.scale(s, s); g.translate(-960, -600); g.globalAlpha = 1 - clamp((u - .6) / .4);
  g.drawImage(SH_A.cv, 0, 0); g.drawImage(SH_B.cv, 0, 0); g.restore();
  // vortex streaks converging
  const v = inv(T.fly + .15, T.bedIn, t); const r = rng(8); g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  for (let i = 0; i < 160; i++) { const a0 = r() * TAU, d0 = 300 + r() * 1300, spd = .6 + r(); const q = clamp(v * spd * 1.4 - r() * .3); if (q <= 0) continue; const d = d0 * (1 - E.inC(q)), a = a0 + 3.2 * E.inC(q); const d2 = d0 * (1 - E.inC(Math.max(0, q - .08))), a2 = a0 + 3.2 * E.inC(Math.max(0, q - .08));
    g.strokeStyle = r() < .6 ? 'rgba(255,190,100,.7)' : 'rgba(160,200,255,.7)'; g.lineWidth = 1.5 + r() * 3; g.globalAlpha = (1 - q) * .9; g.beginPath(); g.moveTo(960 + Math.cos(a2) * d2, 540 + Math.sin(a2) * d2); g.lineTo(960 + Math.cos(a) * d, 540 + Math.sin(a) * d); g.stroke(); }
  g.restore();
  glowDot(g, 960, 540, 80 + 500 * E.inC(v), `rgba(170,210,255,${.4 + .6 * v})`);
  if (v > .5) { g.save(); g.globalAlpha = (v - .5) * 2; g.translate(960, 540); const ps = .3 + 1.2 * E.inE(v); rr(g, -40 * ps, -80 * ps, 80 * ps, 160 * ps, 12 * ps); g.fillStyle = '#dfeeff'; g.fill(); g.restore(); }
}
function drawReveal(g, t) {
  const u = inv(T.bedIn, bt(15), t), z = E.outE(u); const s = lerp(9, 1.0, z) * (1 + .04 * inv(bt(15), T.swipe, t)); const cx = lerp(700, 960, z), cy = lerp(455, 520, z);
  g.save(); cam(g, cx, cy, s); drawBedroom(g, t, { p: 0, steam: 1, flick: .9 + .1 * Math.sin(t * 9) }); g.restore();
  zoomBlur(g, 960, 540, .25 * (1 - z));
}
// ----- shot 5: swipe + timelapse -----
const TL0 = bt(17) + .05, TL1 = bt(19) + .6;
function tlP(t) { return E.ioC(inv(TL0, TL1, t)); }
function drawSwipeCU(g, t) {
  const u = inv(T.swipe + .08, T.swipe + .38, t), e = E.ioC(u); const ty = lerp(830, 470, e), tx = lerp(1095, 1050, e);
  const trail = []; for (let i = 0; i <= 16; i++) { const e2 = E.ioC(clamp(u - i * .035)); if (u - i * .035 < 0) break; trail.push([lerp(1095, 1050, e2) + 12, lerp(830, 470, e2) + 10]); }
  g.save(); const s = 1.02 + .05 * inv(T.swipe, T.swipe + .6, t); cam(g, 960, 560, s); drawPhoneCU(g, t, { idx: 0, k: E.ioC(inv(T.swipe + .12, T.swipe + .42, t)), thumb: [tx, ty], trail: trail.length > 1 ? trail : null, clock: '21:00', bat: .78 }); g.restore();
}
function drawTimelapse(g, t) {
  const p = tlP(t), sp = (tlP(t + .02) - tlP(t - .02)) / .04; const s = 1.1 + .1 * inv(TL0 - .3, T.freeze, t);
  g.save(); cam(g, 1180, 470, s); drawBedroom(g, t, { p, hours: 21 + 4 * p, spin: clamp(sp * .9), steam: 1 - clamp(p * 1.6), trail: true, flick: .6 + .4 * hsh(Math.floor(t * 11)) }); g.restore();
  // exposure flicker
  flash(g, .05 * clamp(sp) * hsh(Math.floor(t * 30)), '#fff');
}
function drawShot5(g, t) {
  const w0 = T.swipe + .5, w1 = w0 + .26;
  if (t < w0) drawSwipeCU(g, t);
  else if (t < w1) { const u = E.ioC(inv(w0, w1, t)); g.save(); g.translate(-W * u, 0); drawSwipeCU(g, t); g.restore(); g.save(); g.translate(W * (1 - u), 0); drawTimelapse(g, t); g.restore(); motionBlurX(g, -260 * Math.sin(Math.PI * u), 12); }
  else drawTimelapse(g, t);
  const p = tlP(t); const hudA = inv(w1 - .1, w1 + .1, t) * (t < T.freeze ? 1 : 0);
  if (hudA > 0) { const sp = clamp((tlP(t + .02) - tlP(t - .02)) / .04); g.save(); g.globalAlpha = hudA;
    hudTime(g, fmtH(21 + 4 * p), 80, 70, 1, 1.5);
    const b = lerp(.78, .12, p); g.translate(80, 190); rr(g, 0, 0, 150, 64, 14); g.fillStyle = 'rgba(8,6,18,.62)'; g.fill(); g.strokeStyle = b < .2 ? '#ff5a5a' : 'rgba(255,255,255,.7)'; g.lineWidth = 4; rr(g, 16, 14, 96, 36, 6); g.stroke(); g.fillStyle = b < .2 ? '#ff5a5a' : '#fff'; g.fillRect(22, 20, 84 * b, 24); g.fillRect(116, 24, 8, 16);
    g.font = F(900, 40); g.fillStyle = b < .2 ? '#ff5a5a' : '#fff'; g.fillText(Math.round(b * 100) + '%', 170, 46); g.restore(); }
}
// ----- shot 6: freeze compare -----
function drawFreeze(g, t) {
  BX.setTransform(1, 0, 0, 1, 0, 0); BX.save(); cam(BX, 1180, 470, 1.2); drawBedroom(BX, T.freeze, { p: 1, hours: 25, steam: 0 }); BX.restore();
  const u = inv(T.freeze, T.freeze + .25, t); g.save(); g.filter = `grayscale(${.8 * u}) brightness(${1 - .66 * u}) blur(${6 * u}px)`; const s = 1 + .03 * inv(T.freeze, T.rew, t); g.translate(960, 540); g.scale(s, s); g.translate(-960, -540); g.drawImage(BUF, 0, 0); g.restore();
  const slam = (t0) => { const k = inv(t0, t0 + .16, t); return k <= 0 ? null : { s: lerp(1.9, 1, E.inC(k)), a: clamp(k * 3) }; };
  const pill = (str, x, y, col) => { g.save(); g.font = F(700, 44); const w = g.measureText(str).width + 56; rr(g, x - w / 2, y - 34, w, 68, 34); g.fillStyle = 'rgba(0,0,0,.5)'; g.fill(); g.strokeStyle = col; g.globalAlpha *= .7; g.lineWidth = 2; g.stroke(); g.restore(); kText(g, str, x, y + 15, 44, { align: 'center', color: col, weight: 700 }); };
  const L = slam(T.freeze + .04); if (L) { g.save(); g.translate(540, 540); g.scale(L.s, L.s); g.globalAlpha = L.a; kText(g, '4 小时', 0, 60, 200, { align: 'center', color: '#ffffff' }); pill('真实时间', 0, 170, '#c9d3e6'); g.restore(); }
  const R = slam(T.slam2 - .16); if (R) { g.save(); g.translate(1400, 540); g.scale(R.s, R.s); g.globalAlpha = R.a; const wob = Math.sin((t - T.slam2) * 26) * 4 * Math.exp(-(t - T.slam2) * 3); kText(g, '一会儿', wob, 52, 170, { align: 'center', color: AMB }); pill('你的感觉', 0, 170, '#ffd9a0'); g.restore(); }
  const N = inv(T.neq - .14, T.neq, t); if (N > 0) { g.save(); g.translate(985, 540); const s2 = lerp(2.2, 1, E.inC(N)); g.scale(s2, s2); g.globalAlpha = N; kText(g, '≠', 0, 50, 170, { align: 'center', color: '#ff5f5f' }); g.restore(); }
}
// ----- shot 7: rewind, montage, rocket, top-down -----
function drawRewind(g, t) {
  const u = inv(T.rew, T.mont, t), p = 1 - E.ioC(u); const jit = (hsh(Math.floor(t * 30)) - .5) * 14;
  g.save(); g.translate(0, jit); cam(g, 1180, 470, 1.2 - .1 * E.ioC(u)); drawBedroom(g, t, { p, hours: 21 + 4 * p, spin: 1, steam: 1 - p, trail: true }); g.restore();
  chroma(g, 8, 0);
  g.save(); g.globalAlpha = .18; g.fillStyle = '#000'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2); g.restore();
  const by = ((t * 1.7) % 1) * H; g.save(); g.globalAlpha = .5; for (let i = 0; i < 40; i++) { g.fillStyle = hsh(i + Math.floor(t * 30)) > .5 ? '#fff' : '#888'; g.fillRect(hsh(i * 3 + t) * W, by + hsh(i * 7) * 60, 40 + hsh(i) * 220, 2 + hsh(i * 5) * 4); } g.restore();
  g.save(); g.font = F(900, 64); g.fillStyle = '#fff'; g.shadowColor = '#000'; g.shadowBlur = 10; g.fillText('◀◀  倒回去看看', 90, 120); g.restore();
  hudTime(g, fmtH(21 + 4 * p), 90, 160, 1, 1.2);
}
const BUBS = ['再刷一个就睡', '最后一个', '这个看完就睡', '真的最后一个！'];
const CLK = ['21:37', '22:41', '23:28', '00:46'];
function drawMontage(g, t) {
  const hb = BEAT / 2, q = (t - T.mont) / hb, i = Math.min(3, Math.floor(q)), f = q - Math.floor(q);
  const k = E.ioC(clamp(f / .55)); const ty = lerp(840, 480, k);
  g.save(); cam(g, 960, 560, 1.0 + .08 * inv(T.mont, T.rocket, t)); drawPhoneCU(g, t, { idx: 1 + i, k, thumb: [lerp(1095, 1050, k), ty], clock: CLK[i], bat: lerp(.66, .2, q / 4) }); g.restore();
  // bubbles
  for (let j = 0; j <= Math.min(3, Math.floor(q)); j++) { const kk = inv(T.mont + j * hb, T.mont + j * hb + .18, t); const s = E.outB(kk); const x = 380 + (j % 2) * 90, y = 230 + j * 170; g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = clamp(kk * 3);
    g.font = F(900, 54); const w = g.measureText(BUBS[j]).width + 70; rr(g, -w / 2, -48, w, 96, 48); g.fillStyle = '#fff'; g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 20; g.fill(); g.shadowBlur = 0; g.beginPath(); g.moveTo(w / 2 - 50, 40); g.lineTo(w / 2 - 10, 70); g.lineTo(w / 2 - 20, 30); g.fill(); g.fillStyle = '#1b1530'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(BUBS[j], 0, 2); g.restore(); }
  // flood of small bubbles
  const fl = inv(T.mont + 4 * hb - .35, T.rocket, t); if (fl > 0) { const r = rng(21); for (let j = 0; j < 26; j++) { const t0 = r() * .9, x = r() * W, y = r() * H, kk = clamp((fl - t0) * 6); if (kk <= 0) continue; const s = E.outB(kk) * (.5 + r() * .5); g.save(); g.translate(x, y); g.scale(s, s); g.rotate((r() - .5) * .3); const str = BUBS[Math.floor(r() * 4)]; g.font = F(900, 46); const w = g.measureText(str).width + 56; rr(g, -w / 2, -40, w, 80, 40); g.fillStyle = 'rgba(255,255,255,.95)'; g.fill(); g.fillStyle = '#1b1530'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, 0, 2); g.restore(); } }
}
function drawTop(g, t) {
  const u = inv(T.rocket, T.rocket + .6, t), z = E.outE(u); const s = lerp(16, 1.22, z) * (1 + .06 * inv(T.rocket + .6, T.burst, t));
  const pr = inv(T.rocket, T.burst, t), n = Math.floor(lerp(20, 220, pr)); const cy = lerp(470, 430, z);
  g.save(); cam(g, 960, cy, s, lerp(.5, 0, z)); drawTopDown(g, t, { traces: n, idx: 3, thumbUp: (Math.sin(t * 9) * .5 + .5), clock: fmtH(21 + 4 * E.ioS(pr)) });
  // ruler in world space beside the phone: 100 units = 10 cm
  const rk = E.outC(inv(T.ruler, T.ruler + .45, t)); if (rk > 0) { const x = 1028, y0 = 528, y1 = 412, yy = lerp(y0, y1, rk);
    g.fillStyle = 'rgba(255,240,215,.96)'; g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 10; rr(g, x, yy, 34, y0 - yy, 5); g.fill(); g.shadowBlur = 0; g.strokeStyle = '#3a2a1a'; g.lineWidth = 1.6;
    for (let i = 0; i <= 10; i++) { const ty = y0 - (y0 - y1) * i / 10; if (ty < yy) break; g.beginPath(); g.moveTo(x, ty); g.lineTo(x + (i % 5 ? 10 : 20), ty); g.stroke(); } }
  g.restore();
  zoomBlur(g, 960, 540, .5 * (1 - z), 10);
  if (rk_a(t) > 0) { const sx = 960 + (1072 - 960) * s, sy = 540 + (476 - cy) * s; g.save(); g.globalAlpha = rk_a(t); g.strokeStyle = AMB; g.lineWidth = 3; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + 90, sy - 60); g.lineTo(sx + 150, sy - 60); g.stroke(); kText(g, '10 cm', sx + 162, sy - 38, 72, { color: AMB, shadow: 'rgba(0,0,0,.8)', sBlur: 20 }); g.restore(); }
  if (t > T.rocket + .3) sub(g, '偷走它的，就是这 10 厘米', T.rocket + .35, T.burst + .05, t, { y: 1000, size: 66, color: '#fff' });
}
function rk_a(t) { return clamp(E.outC(inv(T.ruler, T.ruler + .45, t)) * 2 - .6); }
// ----- shot 8: title -----
function drawTitleBg(g, t) {
  drawVoid(g, t); g.save(); g.translate(960, 540); g.rotate(t * .05); g.globalCompositeOperation = 'lighter';
  for (const [r, a] of [[430, .16], [520, .1], [640, .06]]) { g.strokeStyle = `rgba(255,178,63,${a})`; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.stroke(); for (let i = 0; i < 60; i++) { const an = i / 60 * TAU, L = i % 5 ? 10 : 26; g.beginPath(); g.moveTo(Math.cos(an) * r, Math.sin(an) * r); g.lineTo(Math.cos(an) * (r - L), Math.sin(an) * (r - L)); g.stroke(); } }
  g.restore();
}
function drawTitle(g, t) {
  drawTitleBg(g, t); const s = 1 + .04 * inv(T.burst, T.tShat, t); g.save(); g.translate(960, 540); g.scale(s, s); g.translate(-960, -540);
  if (t < T.tShat) assemble(g, SH_T, t, T.burst + .38, 700, .42, null); else explodeOut(g, SH_T, t, T.tShat);
  g.restore();
  // light sweep (masked to title)
  const sw = inv(T.burst + .45, T.burst + 1.25, t); if (sw > 0 && sw < 1 && t < T.tShat) { g.save(); g.translate(960, 540); g.scale(s, s); g.translate(-960, -540); maskSweep(g, SH_T.cv, lerp(260, 1660, E.ioC(sw)), 160, .85, '255,236,200'); g.restore(); }
  // burst particles
  const b = t - T.burst; if (b >= 0 && b < 1) { const r = rng(44); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 140; i++) { const a = r() * TAU, sp = 400 + r() * 1400, d = sp * (1 - Math.exp(-b * 4)) / 4 * 3; g.globalAlpha = (1 - b) * .9; g.fillStyle = r() < .7 ? AMB : '#fff'; g.beginPath(); g.arc(960 + Math.cos(a) * d, 540 + Math.sin(a) * d, 2 + r() * 3, 0, TAU); g.fill(); } g.restore(); }
}

// ================= master =================
function renderOpen(t) {
  const g = X; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  let bl = .35, ca = 0, fl = 0, shake = { x: 0, y: 0 };
  if (t < T.hit) { drawS12(g, t); bl = t < T.s2 ? .22 : .38; }
  else if (t < T.shat) { drawCrack(g, t); const u = t - T.hit; fl = .85 * Math.exp(-u * 14); ca = 22 * Math.exp(-u * 5); bl = .45; }
  else if (t < T.fly) {
    const sh = shakeAt(t, [[T.shat, 26, .5], [T.lineA, 9, .25], [T.lineB, 30, .5]]); g.save(); g.translate(sh.x, sh.y);
    drawVoid(g, t); const push = 1 + .11 * E.ioS(inv(T.lineB, T.fly, t)); g.save(); g.translate(960, 560); g.scale(push, push); g.translate(-960, -560);
    drawCountDial(g, t);
    drawImgShards(g, t);
    assemble(g, SH_A, t, T.lineA, 1100, .6);
    const kb = inv(T.lineB - .17, T.lineB, t); if (kb > 0) { const s = lerp(2.6, 1, E.inC(kb)); g.save(); g.globalAlpha = clamp(kb * 2); g.translate(960, 600); g.scale(s, s); g.translate(-960, -600); g.drawImage(SH_B.cv, 0, 0); g.restore();
      const w = t - T.lineB; if (w > 0 && w < .6) { g.save(); g.strokeStyle = `rgba(255,190,100,${.7 * (1 - w / .6)})`; g.lineWidth = 8 * (1 - w / .6); g.beginPath(); g.ellipse(960, 600, 200 + w * 1800, 60 + w * 600, 0, 0, TAU); g.stroke(); g.restore(); } }
    // sweep on line A lock
    const sw = inv(T.lineA + .03, T.lineA + .5, t); if (sw > 0 && sw < 1) maskSweep(g, SH_A.cv, lerp(380, 1540, E.ioC(sw)), 120, .9);
    g.restore(); g.restore();
    fl = .5 * Math.exp(-(t - T.lineB) * 12) * (t > T.lineB ? 1 : 0) + .25 * Math.exp(-(t - T.shat) * 10); ca = (t > T.lineB ? 10 * Math.exp(-(t - T.lineB) * 6) : 0) + 14 * Math.exp(-(t - T.shat) * 6); bl = .5;
  }
  else if (t < T.bedIn) { drawFly(g, t); bl = .55; }
  else if (t < T.swipe) { drawReveal(g, t); fl = .7 * Math.exp(-(t - T.bedIn) * 10); bl = .4; }
  else if (t < T.freeze) { drawShot5(g, t); bl = .42; }
  else if (t < T.rew) { drawFreeze(g, t); const u = t - T.freeze; ca = 16 * Math.exp(-u * 7) + (t > T.slam2 ? 8 * Math.exp(-(t - T.slam2) * 9) : 0); fl = .3 * Math.exp(-u * 12); bl = .3;
    const sh = shakeAt(t, [[T.freeze + .2, 18, .4], [T.slam2, 16, .35], [T.neq, 10, .3]]); if (sh.x) { TX.clearRect(0, 0, W, H); TX.drawImage(C, 0, 0); g.drawImage(TMP, sh.x, sh.y); } }
  else if (t < T.mont) { drawRewind(g, t); bl = .3; }
  else if (t < T.rocket) { drawMontage(g, t); bl = .35; }
  else if (t < T.burst) { drawTop(g, t); bl = .45; fl = .6 * Math.exp(-(t - T.rocket) * 12); }
  else { drawTitle(g, t); bl = .55; fl = .9 * Math.exp(-(t - T.burst) * 9) + (t > T.tShat ? .4 * Math.exp(-(t - T.tShat) * 10) : 0); ca = 12 * Math.exp(-(t - T.burst) * 6); }
  // subtitles across shots
  if (t >= T.bedIn - .05 && t < T.swipe + .5) sub(g, '不信？看看你今晚', T.bedIn + .08, T.swipe + .5, t, { size: 70 });
  if (t >= T.bedIn && t < T.swipe) hudTime(g, '21:00', 80, 70, inv(T.bedIn + .3, T.bedIn + .5, t), 1.5);
  g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  bloom(g, bl, 10); if (ca > .3) chroma(g, ca, .3); flash(g, fl);
  vignette(g, .6); grain(g, t, .085);
}
