// ================= TITLE SECTION · Q16 → Q32 =================
const PREV_END = 1e9;
const T16 = Q(16), T17 = Q(17), T18 = Q(18), T19 = Q(19), T20 = Q(20), T21 = Q(21), T22 = Q(22), T23 = Q(23), T24 = Q(24), T25 = Q(25), T26 = Q(26), T27 = Q(27), T28 = Q(28), T29 = Q(29), T30 = Q(30), T31 = Q(31), T32 = Q(32);
function hexRGB(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
function mixHex(a, b, k) { const A = hexRGB(a), B = hexRGB(b); k = clamp(k); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; }
const mixC = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const rgbS = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${clamp(a)})`;
const sstep = (a, b, x) => E.ioS(inv(a, b, x));
// chart geometry (world units)
const CHART = { x: 0, y: -390, z: .74 };
const AX0 = -1000, AX1 = 1040, AXY = 40, AYT = -800, ZB = 330;
const C_CYAN = [79, 233, 255], C_HOT = [255, 45, 85], C_CHG = [190, 248, 255], C_BLUE = [70, 165, 255], C_GOLD = [255, 196, 64], C_RED = [255, 45, 85];
const TICKX = i => -900 + 180 * i;
// key moments
const CHG0 = T16 + .22, CHG1 = T17 + .12, GLINT = Q(19.5), CAPT = Q(24.5), CRASH2 = Q(30.5);
const XL = -560, X29 = 40, SE2 = Q(31.7), REW1 = T26 + .28, ZIP0 = T28 - .26;
const chartK = t => E.ioC(inv(T20, T20 + .6, t));
const zoneL = t => E.outC(inv(REW1, REW1 + .3, t)), zoneM = t => E.outC(inv(T28, T28 + .25, t)), zoneR = t => E.outC(inv(CRASH2, CRASH2 + .2, t));
// extra hits
SHAKES.push([T16, 12, .35], [T18, 26, .5], [T20, 4, .3], [T21, 3, .2], [T22, 3, .2], [T24, 5, .3], [T24 + .5, 5, .3], [T25, 9, .3], [T26, 10, .3], [T28, 8, .35], [T30, 24, .5], [CRASH2, 14, .4]);
FLASHES.push([T16, .2, .15], [T18, .26, .2], [T26, .15, .12], [T30, .3, .2], [CRASH2, .18, .2]);
CHROMA.push([T16, 9, .3], [T18, 16, .45], [T24, 6, .3], [T25, 6, .25], [T26, 14, .4], [T30, 16, .5], [CRASH2, 12, .4]);
BPM_K.push([Q(26.3), 64], [T28, 96], [Q(29.2), 118], [T30, 166]);
HB_T.push(Q(26.6), Q(27.6), T28, Q(28.75), Q(29.35), Q(29.8), Q(30.1), Q(30.4), Q(30.7), T31, Q(31.3), Q(31.6), Q(31.9));
// ---------- camera ----------
function camT(t) {
  const b = camAt(Math.min(t, B5 + .5)); const k = chartK(t);
  const push = lerp(1, 1.07, E.ioS(inv(T16, T20, t))) * (1 + .03 * pulse(t, T18, 5));
  let z = lerp(b.z * push, CHART.z, k);
  z *= 1 + .02 * pulse(t, T28, 4) + .035 * pulse(t, T30, 5) + .012 * pulse(t, T25, 6);
  return { x: lerp(b.x, CHART.x, k), y: lerp(b.y, CHART.y, k), z };
}
// ---------- walker (bar 8) ----------
function slide2(t) { const u = t - T30; if (u < .22) return lerp(X29, X29 + 46, E.outC(clamp(u / .22))); const v = inv(T30 + .22, SE2, t); return lerp(X29 + 46, 600, v < .5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2.4) / 2); }
function walkerT(t) {
  if (t >= T30) { const x = slide2(t); return { x, y: curY(x), mode: 'fall', u: t - T30, se: SE2, x0: X29 }; }
  let x, k = 0, slouch = 0, tri = 0, nerv = 0;
  if (t < REW1) { const u = E.ioC(inv(T26, REW1, t)); x = lerp(XEND, XL, u); k = -u * 9; }
  else if (t < ZIP0) { x = XL; slouch = E.outC(inv(REW1, REW1 + .4, t)); k = 0; }
  else if (t < T28) { const u = E.ioC(inv(ZIP0, T28, t)); x = lerp(XL, 0, u); k = u * 5; slouch = 1 - E.outC(inv(ZIP0, ZIP0 + .12, t)); }
  else if (t < T29 + .2) { x = 0; tri = E.outB(clamp((t - T28) / .3)); nerv = E.ioS(inv(T29, T29 + .2, t)) * .5; }
  else { const u = inv(T29 + .2, T30, t); x = lerp(0, X29, E.ioS(u)); k = u * 2; tri = lerp(1, .35, E.ioS(u)); nerv = lerp(.5, 1, u); }
  const fk = Math.floor(k);
  return { x, y: curY(x), mode: 'walk', k, ph: k - fk, leg: ((fk % 2) + 2) % 2, slouch, tri, nerv };
}
// ---------- prebuilt assets ----------
const TITLE = '耶克斯-多德森定律', TS = 150, TB = 668, SEAM = TB + 42, SUB = 'YERKES–DODSON LAW · 1908';
let TG = [], TW = 0, TLX = 0, QP = null, FLY = [], ARR = [], SUBL = null;
const SHAFT = (() => { const c = mk(64, 256), g = c.getContext('2d'); g.fillStyle = linear(g, 0, 0, 0, 256, [[0, 'rgba(255,200,90,0)'], [.7, 'rgba(255,205,110,.55)'], [1, 'rgba(255,225,160,1)']]); g.fillRect(0, 0, 64, 256); g.globalCompositeOperation = 'destination-in'; g.fillStyle = linear(g, 0, 0, 64, 0, [[0, 'rgba(0,0,0,0)'], [.5, 'rgba(0,0,0,1)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, 64, 256); return c; })();
const TTC = mk(W, H), TTX = TTC.getContext('2d'), GHC = mk(W, H), GHX = GHC.getContext('2d');
function buildTitleSection() {
  // gold extruded glyphs
  const m = mk(10, 10).getContext('2d'); const L = layout(m, TITLE, TS, 900, .02); TW = L.w; TLX = W / 2 - TW / 2;
  TG = L.chars.map(c => {
    const pad = 44, by = 178, cw = Math.ceil(c.w) + pad * 2, cv = mk(cw, by + 80), g = cv.getContext('2d');
    g.font = F(900, TS); g.textBaseline = 'alphabetic';
    for (let k = 13; k >= 1; k--) { g.fillStyle = mixHex('#1e0c00', '#9a5208', 1 - k / 13); g.fillText(c.ch, pad + k * .5, by + k * 1.1); }
    const face = () => linear(g, 0, by - TS * .9, 0, by + 10, [[0, '#fff7d6'], [.4, '#ffd65e'], [.56, '#ffae1e'], [1, '#e56400']]);
    g.save(); g.shadowColor = 'rgba(255,170,40,.75)'; g.shadowBlur = 30; g.fillStyle = face(); g.fillText(c.ch, pad, by); g.restore();
    g.fillStyle = face(); g.fillText(c.ch, pad, by);
    g.lineWidth = 1.6; g.strokeStyle = 'rgba(255,255,235,.55)'; g.strokeText(c.ch, pad, by);
    return { cv, by, pad, cx: c.x + c.w / 2, w: c.w };
  });
  SUBL = layout(m, SUB, 40, 700, .28);
  // question text → particles
  const qc = mk(W, H), qg = qc.getContext('2d'); drawQuestion(qg, B5 - .02);
  const d = qg.getImageData(0, 0, W, H).data, r = rng(1616), all = [];
  for (let y = 0; y < H; y += 3) for (let x = 0; x < W; x += 3) { const i = (y * W + x) * 4; if (d[i + 3] < 150 || d[i] + d[i + 1] + d[i + 2] < 330) continue; all.push([x, y, d[i], d[i + 1], d[i + 2]]); }
  const keep = 2300 / all.length, pts = [];
  for (const [x, y, R, G, B] of all) { if (r() > keep) continue; const a = Math.atan2(y - 380, x - 470) + (r() - .5) * 1.2, v = lerp(250, 900, r());
    const tx = lerp(-1250, -650, Math.pow(r(), .8)); pts.push({ x: x + r() * 2, y: y + r() * 2, c: [R, G, B], vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, tx, ty: (r() - .5) * 14, t0: T16 + .05 + r() * .12, t1: T16 + .4 + r() * .32 + (x / W) * .05, w: lerp(1.6, 3, r()) }); }
  QP = { img: qc, pts };
  // flyer eyes: sample visible city eyes at the chart camera
  const sv = { ...CAM }; CAM.x = CHART.x; CAM.y = CHART.y; CAM.z = CHART.z; const cand = [];
  for (const [Ly, dd, cw, ch] of [[L_NEAR, DD.near, 24, 14], [L_MID, DD.mid, 16, 10]]) for (const b of Ly) for (const w of b.win) {
    if (!w.isEye) continue; const [x, y] = P(w.x + cw / 2, w.y + ch / 2, dd); if (x < 80 || x > W - 80 || y < 140 || y > 800) continue; cand.push({ w, dd, cw, ch, sx: x, sy: y }); }
  Object.assign(CAM, sv);
  const r2 = rng(2424); for (let i = cand.length - 1; i > 0; i--) { const j = Math.floor(r2() * (i + 1)); [cand[i], cand[j]] = [cand[j], cand[i]]; }
  const sel = cand.slice(0, 110).sort((a, b) => a.sx - b.sx); let n = 0; FLY = []; ARR = [];
  for (let i = 0; i <= 10; i++) { ARR.push([]); for (let j = 0; j < 2 * i; j++) { const f = sel[n++]; if (!f) continue; f.tick = i; f.t0 = T24 + .02 + r2() * .1; f.t1 = T24 + .24 + i * .034 + (j / (2 * i)) * .07; f.cx = (r2() - .5) * 260; f.cy = -160 - r2() * 260; f.ew0 = f.cw * .78 * sc(f.dd); FLY.push(f); ARR[i].push(f.t1); } }
  // sanity log
  console.log('title section built', TG.length, QP.pts.length, FLY.length);
}
// ---------- curve colouring ----------
function curveState(t) {
  return { chg: t < CHG0 ? -1e9 : lerp(-1560, 1560, E.ioS(inv(CHG0, CHG1, t))), hx: t < T26 ? hangX(Math.min(t, T26 - .001)) : -1e9, zl: zoneL(t), zm: zoneM(t), zr: zoneR(t), ck: chartK(t),
    slip: t > T30 ? hangX(t) : -1e9 };
}
function curveCol(x, t, S) {
  let c = x < S.chg ? C_CHG : (x > -10 && x < S.hx ? C_HOT : C_CYAN);
  const wl = 1 - sstep(-ZB - 40, -ZB + 40, x), wr = sstep(ZB - 40, ZB + 40, x), wm = 1 - wl - wr;
  if (S.zl > 0) c = mixC(c, C_BLUE, wl * S.zl); if (S.zm > 0) c = mixC(c, C_GOLD, wm * S.zm); if (S.zr > 0) c = mixC(c, C_RED, wr * S.zr);
  if (S.slip > -1e8 && x > X29 - 20 && x < S.slip) c = mixC(c, [255, 60, 80], .85);
  return c;
}
function wireT(g, t, S) {
  const z = CAM.z; const xa = Math.max(lerp(-1500, AX0, S.ck), CAM.x - W / 2 / z - 50), xb = Math.min(lerp(1500, AX1, S.ck), CAM.x + W / 2 / z + 50);
  const pts = []; const st = Math.max(1.5, 6 / z);
  for (let x = xa; x <= xb + .01; x += st) { const [sx, sy] = P(x, wireY(x, t)); pts.push([sx, sy]); }
  if (pts.length < 2) return;
  const [ga] = P(xa, 0), [gb] = P(xb, 0); const gc = linear(g, ga, 0, gb, 0, []), gw = linear(g, ga, 0, gb, 0, []);
  for (let j = 0; j <= 40; j++) { const f = j / 40, x = lerp(xa, xb, f), c = curveCol(x, t, S); const fade = lerp(1, clamp(Math.min(x - xa, xb - x) / 70), S.ck);
    gc.addColorStop(f, rgbS(c, fade)); gw.addColorStop(f, rgbS(mixC(c, [255, 255, 255], .72), fade)); }
  const lw = lerp(clamp(z * 1.3, 1.6, 4.2), 3.4, S.ck), bp = 1 + .35 * beatPulse(t, 6) + .8 * pulse(t, T23 + .62, 3) * (t > T23);
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]));
  g.strokeStyle = gc; g.globalAlpha = clamp(.2 * bp); g.lineWidth = lw * 9; g.stroke(); g.globalAlpha = .5; g.lineWidth = lw * 3.2; g.stroke(); g.globalAlpha = 1; g.lineWidth = lw; g.strokeStyle = gw; g.stroke();
  // charge head
  if (t > CHG0 && t < CHG1 + .15) { const hxw = S.chg, [hx, hy] = P(hxw, curY(hxw)); const a = 1 - inv(CHG1, CHG1 + .15, t);
    glowDot(g, hx, hy, 120, '#bff8ff', .9 * a); glowDot(g, hx, hy, 30, '#ffffff', a);
    const rr2 = rng(Math.floor(t * 60)); g.strokeStyle = 'rgba(210,250,255,.85)'; g.lineWidth = 1.6; g.globalAlpha = a;
    for (let k = 0; k < 5; k++) { g.beginPath(); let px = hx, py = hy; g.moveTo(px, py); const an = rr2() * TAU; for (let s2 = 0; s2 < 4; s2++) { px += Math.cos(an + (rr2() - .5) * 1.4) * 18; py += Math.sin(an + (rr2() - .5) * 1.4) * 18; g.lineTo(px, py); } g.stroke(); } }
  // tracing dot (Q23)
  if (t > T23 && t < T23 + .9) { const a = 1 - inv(T23 + .62, T23 + .9, t);
    for (let k = 14; k >= 0; k--) { const tt = t - k * .012; const xd = lerp(AX0, AX1, E.ioS(inv(T23, T23 + .62, tt))); const [dx, dy] = P(xd, curY(xd)); glowDot(g, dx, dy, (k ? 22 : 70) * (1 - k / 16), k ? '#9ff6ff' : '#ffffff', a * (k ? .5 : 1)); }
    const xd = lerp(AX0, AX1, E.ioS(inv(T23, T23 + .62, t))); const [dx, dy] = P(xd, curY(xd)); glowDot(g, dx, dy, 16, '#ffffff', a); }
  g.restore();
}
// ---------- chart furniture ----------
function zoneFill(g, t, S) {
  const [, ytop] = P(0, curY(0)), [, yax] = P(0, AXY);
  const Z = [[AX0, -ZB, C_BLUE, S.zl * (1 + 1.4 * pulse(t, REW1, 5))], [-ZB, ZB, C_GOLD, S.zm * (1 + 1.6 * pulse(t, T28, 5))], [ZB, AX1, C_RED, S.zr * (1 + 1.6 * pulse(t, CRASH2, 5)) * (t < CRASH2 + .35 && hsh(Math.floor(t * 40)) > .6 ? .35 : 1)]];
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [a, b, c, k] of Z) { if (k <= .003) continue;
    g.beginPath(); const [x0, y0] = P(a, AXY); g.moveTo(x0, y0); for (let x = a; x <= b; x += 8) { const [sx, sy] = P(x, curY(x)); g.lineTo(sx, sy); } const [x1, y1] = P(b, curY(b)); g.lineTo(x1, y1); const [x2, y2] = P(b, AXY); g.lineTo(x2, y2); g.closePath();
    g.fillStyle = linear(g, 0, ytop, 0, yax, [[0, rgbS(c, .3 * k)], [.6, rgbS(c, .12 * k)], [1, rgbS(c, .05 * k)]]); g.fill(); }
  g.restore();
  // dashed separators
  g.save(); g.setLineDash([10, 12]); g.lineWidth = 2;
  for (const [x, k] of [[-ZB, S.zl], [ZB, S.zm]]) { if (k <= 0) continue; const [sx, sy0] = P(x, AXY), [, sy1] = P(x, AYT + 60); const yy = lerp(sy0, sy1, E.outC(k)); g.strokeStyle = `rgba(220,235,255,${.38 * k})`; g.beginPath(); g.moveTo(sx, sy0); g.lineTo(sx, yy); g.stroke(); }
  g.restore();
}
function drawAxes(g, t, S) {
  if (t < T20) return; const gk = E.ioS(inv(T20 + .25, T21 + .3, t));
  const [ax0, ay0] = P(AX0, AXY), [ax1] = P(AX1, AXY), [, ayt] = P(AX0, AYT);
  if (gk > 0) { g.save(); g.lineWidth = 1; g.strokeStyle = `rgba(130,170,255,${.07 * gk})`; g.beginPath();
    for (let x = AX0 + 100; x < AX1; x += 100) { const [sx] = P(x, 0); g.moveTo(sx, ay0); g.lineTo(sx, ayt); }
    for (let y = AXY - 100; y > AYT; y -= 100) { const [, sy] = P(0, y); g.moveTo(ax0, sy); g.lineTo(ax1, sy); } g.stroke(); g.restore(); }
  g.save(); g.lineCap = 'round'; g.strokeStyle = 'rgba(225,238,255,.92)'; g.fillStyle = 'rgba(225,238,255,.92)'; g.lineWidth = 3.2; g.shadowColor = '#7ff4ff'; g.shadowBlur = 14;
  const ky = E.outE(inv(T21, T21 + .38, t)); if (ky > 0) { const yt = lerp(ay0, ayt, ky); g.beginPath(); g.moveTo(ax0, ay0); g.lineTo(ax0, yt); g.stroke(); g.beginPath(); g.moveTo(ax0, yt - 16); g.lineTo(ax0 - 9, yt + 2); g.lineTo(ax0 + 9, yt + 2); g.closePath(); g.fill(); glowDot(g, ax0, yt, 40, '#bff8ff', .8 * (1 - inv(T21 + .3, T21 + .6, t))); }
  const kx = E.outE(inv(T22, T22 + .38, t)); if (kx > 0) { const xt = lerp(ax0, ax1, kx); g.beginPath(); g.moveTo(ax0, ay0); g.lineTo(xt, ay0); g.stroke(); g.beginPath(); g.moveTo(xt + 16, ay0); g.lineTo(xt - 2, ay0 - 9); g.lineTo(xt - 2, ay0 + 9); g.closePath(); g.fill(); glowDot(g, xt, ay0, 40, '#bff8ff', .8 * (1 - inv(T22 + .3, T22 + .6, t))); }
  g.shadowBlur = 0; g.restore();
  // labels
  const la = E.outB(clamp((t - T21 - .2) / .3)); if (la > 0) { g.save(); g.globalAlpha = clamp(la); g.translate(ax0 + 22, ayt + 14); g.scale(la, la); g.font = F(900, 34); g.fillStyle = '#e8f2ff'; g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 12; g.fillText('表现', 0, 0); g.font = F(700, 20); g.fillStyle = 'rgba(200,220,255,.6)'; g.fillText('PERFORMANCE', 0, 28); g.restore(); }
  const lb = E.outB(clamp((t - T22 - .25) / .3)); if (lb > 0) { g.save(); g.globalAlpha = clamp(lb); g.textAlign = 'right'; g.translate(ax1 + 10, ay0 + 60); g.scale(lb, lb); g.font = F(900, 32); g.fillStyle = '#e8f2ff'; g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 12; g.fillText('压力 / 紧张程度 →', 0, 0); g.font = F(700, 19); g.fillStyle = 'rgba(200,220,255,.6)'; g.fillText('AROUSAL · STRESS', 0, 27); g.restore(); }
}
// tick eyes: more watchers → more pressure
function tickOpen(i, t) { if (i === 0) return 0; let n = 0; for (const a of ARR[i]) if (t >= a) n++; return (n / (2 * i)) * lerp(.18, 1, i / 10); }
function drawTicks(g, t, look) {
  if (t < T22) return; const [, ay] = P(0, AXY);
  const lock = E.outE(inv(T25 - .05, T25 + .12, t)), lp = pulse(t, T25, 6);
  for (let i = 0; i <= 10; i++) {
    const [x0] = P(TICKX(i), AXY); const app = E.outB(clamp((t - T22 - .03 - (x0 - 220) / 1510 * .3) / .22)); if (app <= 0) continue;
    const w = lerp(11, 23, i / 10) * app * (1 + .35 * lp), o = tickOpen(i, t);
    const tr = i >= 7 && t > T24 + .5 ? (i - 6) * .9 * (1 + 1.5 * (t > T30)) : 0; const x = x0 + nz(t * 34, i) * tr, y = ay + nz(t * 31, i + 9) * tr * .6;
    if (o > .02 && i >= 5) glowDot(g, x, y, w * 3.2, '#ff2a50', (.15 + .5 * (i - 5) / 5) * o * (1 + lp));
    // closed lid
    if (o < .5) { g.save(); g.globalAlpha = clamp(1 - o * 2); g.strokeStyle = 'rgba(225,238,255,.85)'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x, y + w * .75, x + w, y); g.stroke();
      for (const f of [-.5, 0, .5]) { const lx = x + f * w, ly = y + w * .37 * (1 - f * f) ; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx + f * 5, ly + 6); g.stroke(); } g.restore(); }
    if (o > .02) { const wander = [x + Math.sin(t * 2.7 + i * 1.7) * 300, y - 200 + Math.cos(t * 2.1 + i) * 150]; drawEye(g, x, y, w, o, lerp(wander[0], look[0], lock), lerp(wander[1], look[1], lock), 1, true); }
    // land ripple
    for (const a of ARR[i]) { const u = t - a; if (u < 0 || u > .35) continue; g.save(); g.strokeStyle = `rgba(255,90,120,${.7 * (1 - u / .35)})`; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, w + 40 * E.outC(u / .35), (w + 40 * E.outC(u / .35)) * .55, 0, 0, TAU); g.stroke(); g.restore(); }
  }
}
function drawFlyers(g, t) {
  if (t < T24 || t > T25 + .1) return;
  g.save();
  for (const f of FLY) { if (t < f.t0 || t > f.t1) continue; const k = E.ioC(inv(f.t0, f.t1, t)), k2 = E.ioC(inv(f.t0, f.t1, t - .03));
    const [sx, sy] = P(f.w.x + f.cw / 2, f.w.y + f.ch / 2, f.dd), [tx, ty] = P(TICKX(f.tick), AXY);
    const bz = (u) => { const cx = (sx + tx) / 2 + f.cx, cy = Math.min(sy, ty) + f.cy; return [(1 - u) * (1 - u) * sx + 2 * u * (1 - u) * cx + u * u * tx, (1 - u) * (1 - u) * sy + 2 * u * (1 - u) * cy + u * u * ty]; };
    const [x, y] = bz(k), [px, py] = bz(k2);
    g.globalCompositeOperation = 'lighter'; g.strokeStyle = 'rgba(255,60,95,.55)'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(px, py); g.lineTo(x, y); g.stroke();
    g.globalCompositeOperation = 'source-over'; drawEye(g, x, y, lerp(Math.max(5, f.ew0), 8, k), 1, tx, ty - 200, 1, true); }
  g.restore();
}
// ---------- zone labels ----------
function zoneLabel(g, t, t0, wx, wy, small, big, col, glitch) {
  const u = t - t0; if (u < 0) return; const [x, y] = P(wx, wy); const s = E.outB(clamp(u / .32)), a = clamp(u / .12);
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a; g.textAlign = 'center';
  const gl = glitch && (u < .45 || (u % .9) > .82) ? 1 : 0;
  g.font = F(900, 58); const bw = Math.max(g.measureText(big).width, 150) + 70;
  g.fillStyle = 'rgba(6,4,20,.62)'; rr(g, -bw / 2, -64, bw, 118, 16); g.fill(); g.strokeStyle = rgbS(col, .75); g.lineWidth = 2.5; g.shadowColor = rgbS(col, 1); g.shadowBlur = 16; g.stroke(); g.shadowBlur = 0;
  g.font = F(700, 25); g.fillStyle = 'rgba(225,238,255,.78)'; g.fillText(small, 0, -30);
  g.font = F(900, 58); g.textBaseline = 'alphabetic';
  if (gl) { const j = (hsh(Math.floor(t * 50)) - .5) * 26; g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(0,240,255,.8)'; g.fillText(big, j - 5, 36); g.fillStyle = 'rgba(255,0,60,.9)'; g.fillText(big, -j + 5, 36); g.globalCompositeOperation = 'source-over'; }
  g.fillStyle = rgbS(mixC(col, [255, 255, 255], .25)); g.shadowColor = rgbS(col); g.shadowBlur = 22; g.fillText(big, gl ? (hsh(Math.floor(t * 50) + 3) - .5) * 14 : 0, 36);
  g.restore();
}
// ---------- star at the apex ----------
function drawStar(g, t) {
  if (t < T28) return; const u = t - T28; const [cx, cy, s] = P(0, curY(0) - 30);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const d of [0, .09]) { const v = (u - d) / .6; if (v <= 0 || v >= 1) continue; g.strokeStyle = `rgba(255,214,110,${1 - v})`; g.lineWidth = 9 * (1 - v); g.beginPath(); g.arc(cx, cy, 30 + 420 * E.outC(v), 0, TAU); g.stroke(); }
  if (u < .7) { const r0 = 40 + 260 * E.outE(u / .5), r1 = r0 + 120 * (1 - u / .7); g.strokeStyle = `rgba(255,230,150,${1 - u / .7})`; g.lineWidth = 3;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + u * .5; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke(); } }
  if (u < 1.2) { const r = rng(2828); for (let i = 0; i < 46; i++) { const a = r() * TAU, v = lerp(200, 700, r()), life = .6 + r() * .6; if (u > life) continue; const px = cx + Math.cos(a) * v * u, py = cy + Math.sin(a) * v * u + 500 * u * u; glowDot(g, px, py, 10, '#ffd36a', 1 - u / life); } }
  glowDot(g, cx, cy, 260, '#ffb840', .5 * pulse(t, T28, 3));
  // persistent 4-point star above the apex
  const [qx, qy] = P(0, curY(0) - 118); const k = E.outB(clamp(u / .35)), R = 30 * k * (1 + .12 * Math.sin(t * 6)) * (t > CRASH2 ? .8 : 1), rot = t * .6;
  glowDot(g, qx, qy, R * 4, '#ffc040', .55 * clamp(k));
  g.fillStyle = '#fff2c0'; g.beginPath(); for (let i = 0; i < 8; i++) { const a = rot + i * Math.PI / 4, rad = i % 2 ? R * .28 : R; i ? g.lineTo(qx + Math.cos(a) * rad, qy + Math.sin(a) * rad) : g.moveTo(qx + Math.cos(a) * rad, qy + Math.sin(a) * rad); } g.closePath(); g.fill();
  g.restore();
}
// ---------- question particles (Q16) ----------
function drawQP(g, t) {
  if (!QP || t > T17 + .4) return; const a0 = 1 - inv(T16, T16 + .07, t); if (a0 > 0) { g.save(); g.globalAlpha = a0; g.drawImage(QP.img, 0, 0); g.restore(); }
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  const pos = (p, tt) => { const u = Math.max(0, tt - T16); const ex = p.x + p.vx * (1 - Math.exp(-u * 5)) / 5, ey = p.y + p.vy * (1 - Math.exp(-u * 5)) / 5 + 60 * u * u; const k = E.inC(inv(p.t0, p.t1, tt)); const [tx, ty] = P(p.tx, curY(p.tx) + p.ty); return [lerp(ex, tx, k), lerp(ey, ty, k)]; };
  for (const p of QP.pts) { if (t > p.t1) continue; const [x, y] = pos(p, t), [px, py] = pos(p, t - .025); const hot = inv(p.t0, p.t1, t);
    g.strokeStyle = rgbS(mixC(p.c, [190, 248, 255], hot), .9); g.lineWidth = p.w; g.beginPath(); g.moveTo(px, py); g.lineTo(x + .1, y); g.stroke(); }
  g.restore();
}
// ---------- title block ----------
function drawTitle(g, t) {
  if (t < T17 - .05) return; const dk = E.ioC(inv(T20, T20 + .6, t));
  // plate, seam, shafts (only before docking)
  const plate = E.outC(inv(T17 - .1, T17 + .3, t)) * (1 - E.ioC(inv(T20, T20 + .5, t)));
  if (plate > 0) { g.save(); g.globalAlpha = plate; g.translate(W / 2, TB - 40); g.scale(1, .34); g.fillStyle = radial(g, 0, 0, 980, [[0, 'rgba(4,2,14,.8)'], [.55, 'rgba(4,2,14,.55)'], [1, 'rgba(4,2,14,0)']]); g.fillRect(-1000, -1000, 2000, 2000); g.restore(); }
  const seamA = E.outE(inv(T17, T17 + .3, t)) * (1 - E.ioS(inv(T18 + .25, T19 + .4, t))) * (1 - dk);
  if (seamA > 0) { const Ls = 1560 * E.outE(inv(T17, T17 + .3, t)); g.save(); g.globalCompositeOperation = 'lighter';
    g.fillStyle = linear(g, W / 2 - Ls / 2, 0, W / 2 + Ls / 2, 0, [[0, 'rgba(255,190,80,0)'], [.5, `rgba(255,220,140,${.95 * seamA})`], [1, 'rgba(255,190,80,0)']]); g.fillRect(W / 2 - Ls / 2, SEAM - 2, Ls, 4);
    g.save(); g.translate(W / 2, SEAM); g.scale(Ls / 120, 1); g.fillStyle = radial(g, 0, 0, 60, [[0, `rgba(255,170,60,${.42 * seamA})`], [1, 'rgba(255,160,40,0)']]); g.fillRect(-60, -60, 120, 120); g.restore();
    // light shafts
    const sh = E.outC(inv(T17, T17 + .2, t)) * (1 - E.ioS(inv(T18 + .1, T19, t))) + .9 * pulse(t, T18, 4) * (t > T18);
    TG.forEach((G, i) => { const x = TLX + G.cx, a = clamp(.5 * sh * (.65 + .35 * nz(t * 12, i)) * seamA * 1.2); if (a <= .01) return; const bw = G.w * lerp(.45, .8, hsh(i + 4)), bh = lerp(380, 700, hsh(i + 9));
      g.globalAlpha = a; g.drawImage(SHAFT, x - bw / 2, SEAM - bh, bw, bh + 6); g.globalAlpha = 1; });
    g.restore(); }
  // shockwave at the slam
  const q = t - T18; if (q > 0 && q < .65) { const v = q / .65, rx = 120 + 1300 * E.outC(v); g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,225,150,${.9 * (1 - v)})`; g.lineWidth = 14 * (1 - v); g.beginPath(); g.ellipse(W / 2, SEAM, rx, rx * .2, 0, 0, TAU); g.stroke(); g.restore();
    const r = rng(1818); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 60; i++) { const x0 = TLX + r() * TW, vx = (r() - .5) * 700, vy = -300 - r() * 700, life = .4 + r() * .3; if (q > life) continue; glowDot(g, x0 + vx * q, SEAM + vy * q + 1600 * q * q, 7, '#ffd890', 1 - q / life); } g.restore(); }
  // glyphs → offscreen (for glint)
  const tx = TTX; tx.setTransform(1, 0, 0, 1, 0, 0); tx.clearRect(0, 0, W, H); tx.save();
  const scl = lerp(1, .4, dk); tx.translate(lerp(TLX, 70, dk), lerp(TB, 108, dk)); tx.scale(scl, scl);
  if (t < T18 + .01) { tx.beginPath(); tx.rect(-3000, -3000, 9000, 3000 + SEAM - TB); tx.clip(); }
  TG.forEach((G, i) => {
    let dy = 0, sx = 1, sy = 1;
    if (t < T18) { const u = inv(T17 + i * .035, T18, t); const e = .4 * u + .6 * u * u * u; dy = 205 * (1 - e); sy = 1 + .16 * Math.sin(u * Math.PI) * u; sx = 1 / Math.sqrt(sy); }
    else { const qq = t - T18 - i * .012; if (qq > 0) { const d = Math.exp(-qq * 8) * Math.cos(qq * 30); sy = 1 - .2 * d; sx = 1 + .12 * d; } else { sy = .8; sx = 1.12; } }
    dy += Math.sin(t * 2.2 + i * .7) * 2.5 * inv(T18 + .3, T18 + .8, t) * (1 - dk);
    tx.save(); tx.translate(G.cx, dy); tx.scale(sx, sy); tx.drawImage(G.cv, -G.cv.width / 2, -G.by); tx.restore();
  });
  tx.restore();
  for (const [g0, dur] of [[GLINT, .5], [T20 + .65, .45]]) { const gu = inv(g0, g0 + dur, t); if (gu <= 0 || gu >= 1) continue;
    const L0 = lerp(TLX, 70, dk) - 260 * scl, L1 = lerp(TLX, 70, dk) + (TW + 260) * scl, bx = lerp(L0, L1, E.ioS(gu)), by = lerp(TB, 108, dk), hw = 110 * scl;
    tx.save(); tx.globalCompositeOperation = 'source-atop'; tx.fillStyle = linear(tx, bx - hw, by - 160 * scl, bx + hw, by + 60 * scl, [[0, 'rgba(255,255,240,0)'], [.5, 'rgba(255,255,245,.9)'], [1, 'rgba(255,255,240,0)']]); tx.fillRect(0, 0, W, H); tx.restore(); }
  g.drawImage(TTC, 0, 0);
  // subtitle typewriter
  if (t > T19 && SUBL) { const n = Math.floor((t - T19) / .022), ss = lerp(1, .58, dk), lx = lerp(W / 2 - SUBL.w / 2, 72, dk), ly = lerp(TB + 86, 152, dk);
    g.save(); g.translate(lx, ly); g.scale(ss, ss); g.font = F(700, 40); g.textBaseline = 'alphabetic'; g.shadowColor = '#5ef2ff'; g.shadowBlur = 14;
    SUBL.chars.forEach((c, i) => { if (i >= n) return; const fresh = i >= n - 2 && n < SUBL.chars.length; g.fillStyle = fresh ? '#ffffff' : '#7ff4ff'; g.fillText(c.ch, c.x, 0); });
    const cur = SUBL.chars[Math.min(n, SUBL.chars.length - 1)]; if (t < T19 + .95 && (Math.floor(t * 8) % 2 || n < SUBL.chars.length)) { g.fillStyle = '#7ff4ff'; const cx = n >= SUBL.chars.length ? SUBL.w + 8 : cur.x; g.fillRect(cx, -32, 18, 36); }
    g.restore(); }
}
// ---------- captions ----------
function drawCaption(g, t) {
  if (t < CAPT || t > T27 + .25) return; const out = 1 - inv(T27, T27 + .2, t); const str = '盯着你的眼睛越多，压力越大';
  g.save(); g.globalAlpha = out; const bw = 760, x = W / 2, y = 990;
  const pa = E.outC(clamp((t - CAPT) / .2)); g.fillStyle = `rgba(6,4,20,${.7 * pa})`; rr(g, x - bw / 2 * pa, y - 44, bw * pa, 70, 35); g.fill(); g.strokeStyle = `rgba(255,70,110,${.6 * pa})`; g.lineWidth = 2; g.stroke();
  drawEye(g, x - bw / 2 + 52, y - 9, 22 * pa, pa, x, y - 400, out, true);
  kText(g, str, x + 24, y + 4, 38, { alpha: out, weight: 900, align: 'center', color: (i) => i >= 4 && i <= 7 ? '#ff6a8a' : i >= 9 ? '#ff3a5c' : '#f2f6ff', shadow: 'rgba(0,0,0,.7)', sBlur: 10,
    fn: (i) => { const u = clamp((t - CAPT - .05 - i * .022) / .2); return { a: u, dy: (1 - E.outB(u)) * 16 }; } });
  g.restore();
}
function mouseIcon(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#e8eefc'; g.beginPath(); g.ellipse(0, 0, 16, 10, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(9, -9, 6, 0, TAU); g.fill(); g.beginPath(); g.ellipse(17, 2, 7, 6, 0, 0, TAU); g.fill();
  g.strokeStyle = '#e8eefc'; g.lineWidth = 2.2; g.lineCap = 'round'; g.beginPath(); g.moveTo(-15, 3); g.quadraticCurveTo(-30, 10, -34, -4); g.stroke(); g.fillStyle = '#ff7aa0'; g.beginPath(); g.arc(9, -9, 3, 0, TAU); g.fill(); g.fillStyle = '#10081e'; g.beginPath(); g.arc(19, 0, 1.6, 0, TAU); g.fill(); g.restore(); }
function drawFootnote(g, t) {
  if (t < T31) return; const u = E.outC(clamp((t - T31) / .3)); const str = '最早来自 1908 年的老鼠实验 · 任务越难，最佳压力越低';
  g.save(); g.globalAlpha = u; g.translate(0, (1 - u) * 24); g.font = F(700, 27); const tw = g.measureText(str).width, bw = tw + 110, x = W / 2, y = 1012;
  g.fillStyle = 'rgba(6,4,20,.74)'; rr(g, x - bw / 2, y - 30, bw, 58, 29); g.fill(); g.strokeStyle = 'rgba(220,235,255,.28)'; g.lineWidth = 1.5; g.stroke();
  mouseIcon(g, x - bw / 2 + 44, y + 2, .9); g.fillStyle = 'rgba(232,240,255,.94)'; g.textBaseline = 'middle'; g.fillText(str, x - bw / 2 + 84, y + 1); g.restore();
}
function drawZzz(g, t, wk) {
  const a = E.outC(inv(REW1 + .1, REW1 + .4, t)) * (1 - E.outC(inv(ZIP0 - .15, ZIP0, t))); if (a <= 0) return; const [hx, hy] = P(wk.x + 6, curY(wk.x) - 60);
  g.save(); g.font = F(900, 30); g.fillStyle = '#9fd2ff'; g.shadowColor = '#4aa8ff'; g.shadowBlur = 12;
  for (let k = 0; k < 3; k++) { const ph = (((t - REW1) * .8 + k / 3) % 1 + 1) % 1; g.globalAlpha = a * Math.sin(ph * Math.PI); g.save(); g.translate(hx + 14 + ph * 46 + Math.sin(ph * 7) * 6, hy - ph * 80); g.scale(.55 + ph * .7, .55 + ph * .7); g.fillText('Z', 0, 0); g.restore(); }
  g.restore();
}
// ---------- the scene ----------
function sceneT(g, t) {
  const c = camT(t); CAM.x = c.x; CAM.y = c.y; CAM.z = c.z; const S = curveState(t), ck = S.ck;
  const cr = Math.max(1 - ck, .75 * E.ioS(inv(T30, CRASH2 + .2, t)));
  EYE_MUL = 1 - E.outC(inv(T24, T24 + .16, t));
  const wk = walker(t); const [lx, ly] = P(wk.x, curY(wk.x) - 40); const look = [lx, ly]; const lit = .18 + .1 * ck;
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  drawSky(g, t, 1, cr); drawMoon(g, t, 1 - .78 * E.ioS(inv(T24, T26, t)), look);
  drawLayerImg(g, IMG.farB, DD.far, 1);
  drawLayerImg(g, IMG.farL, DD.far, lit * (1 + .25 * beatPulse(t, 6)), 'lighter');
  drawEyesLayer(g, L_FAR, DD.far, t, look, 12, 8, .9);
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, 'rgba(60,20,110,0)'], [.6, `rgba(${lerp(70, 90, cr) | 0},${lerp(25, 10, cr) | 0},${lerp(120, 40, cr) | 0},.38)`], [1, 'rgba(20,6,40,.5)']]); g.fillRect(0, 0, W, H);
  drawTraffic(g, t, .3);
  drawLayerImg(g, IMG.midB, DD.mid, 1);
  drawLayerImg(g, IMG.midL, DD.mid, lit * (1 + .3 * beatPulse(t, 6)), 'lighter');
  drawBills(g, t, look, lit); drawEyesLayer(g, L_MID, DD.mid, t, look, 16, 10);
  g.fillStyle = 'rgba(30,12,60,.22)'; g.fillRect(0, 0, W, H);
  drawNear(g, t, 1, lit, look);
  if (cr > 0) { g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .25 * cr; g.fillStyle = '#ff6a80'; g.fillRect(0, 0, W, H); g.restore(); }
  if (ck > 0) { g.fillStyle = `rgba(5,3,16,${.42 * ck})`; g.fillRect(0, 0, W, H); }
  zoneFill(g, t, S); drawAxes(g, t, S);
  wireT(g, t, S);
  drawStar(g, t);
  // rewind ghosts
  if (t > T26 && t < REW1 + .12) { for (let k = 5; k >= 1; k--) { const tt = t - k * .035; if (tt < T26 - .05) continue; GHX.setTransform(1, 0, 0, 1, 0, 0); GHX.clearRect(0, 0, W, H); drawWalker(GHX, tt);
      GHX.globalCompositeOperation = 'source-atop'; GHX.fillStyle = k % 2 ? '#ff4fd8' : '#4fe9ff'; GHX.fillRect(0, 0, W, H); GHX.globalCompositeOperation = 'source-over';
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .5 * (1 - k / 6); g.drawImage(GHC, 0, 0); g.restore(); } }
  if (t > T26) { const wl = 1 - sstep(-ZB - 40, -ZB + 40, wk.x), wr = sstep(ZB - 40, ZB + 40, wk.x); const col = wk.mode === 'fall' ? '#ff3a5c' : wl > .5 ? '#4aa8ff' : wr > .5 ? '#ff3a5c' : '#ffc040'; const [fx, fy] = P(wk.x, wireY(wk.x, t)); glowDot(g, fx, fy, 70, col, .55); }
  drawWalker(g, t);
  drawZzz(g, t, wk);
  drawTicks(g, t, look); drawFlyers(g, t);
  drawDust(g, t, 1 - .5 * ck);
  drawQP(g, t);
  drawTitle(g, t);
  drawCaption(g, t);
  zoneLabel(g, t, REW1 + .05, -700, -330, '压力太小', '懒散', C_BLUE, false);
  zoneLabel(g, t, T28 + .06, 0, -880, '刚刚好', '巅峰', C_GOLD, false);
  zoneLabel(g, t, CRASH2, 720, -330, '压力太大', '崩盘', C_RED, true);
  drawFootnote(g, t);
}
// ---------- post (after shake, before bloom) ----------
function postT(g, t) {
  if (t > T16 && t < T16 + .3) zoomBlur(g, 470, 380, .05 * (1 - inv(T16, T16 + .3, t)), 6);
  if (t > T18 && t < T18 + .32) zoomBlur(g, W / 2, TB - 50, .07 * (1 - inv(T18, T18 + .32, t)), 7);
  if (t > T30 && t < T30 + .3) zoomBlur(g, W / 2, H / 2, .05 * (1 - inv(T30, T30 + .3, t)), 6);
  // HUD returns for bar 8
  if (t > T26) { const u = t - T26; drawHUD(g, t, 1490, 64, (u < .14 ? (hsh(Math.floor(t * 60)) > .4 ? 1 : .3) : 1) * E.outC(clamp(u / .2))); }
  // VHS rewind
  const vu = t - T26; if (vu > 0 && vu < .45) { const vk = vu < .3 ? 1 : 1 - (vu - .3) / .15;
    TX.clearRect(0, 0, W, H); TX.drawImage(C, 0, 0); const fr = Math.floor(t * 30); let y = 0, bi = 0;
    while (y < H) { const bh = 18 + Math.floor(hsh(fr * 13 + bi) * 70); const dx = ((hsh(fr * 7 + bi * 3) - .5) * 70 + Math.sin(y * .02 + t * 40) * 10) * vk; g.drawImage(TMP, 0, y, W, bh, dx, y, W, bh); y += bh; bi++; }
    g.save(); g.fillStyle = `rgba(0,0,0,${.28 * vk})`; for (let yy = 0; yy < H; yy += 4) g.fillRect(0, yy, W, 2);
    const ny = (vu * 2800) % (H + 160) - 80; g.globalCompositeOperation = 'lighter'; g.globalAlpha = .5 * vk; g.beginPath(); g.rect(0, ny, W, 54); g.clip(); g.drawImage(GRAIN, 0, ny - 200, W, 600); g.restore();
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(40,70,140,${.22 * vk})`; g.fillRect(0, 0, W, H); g.restore();
    if (Math.floor(t * 8) % 2 === 0 || vu < .3) { g.save(); g.globalAlpha = vk; g.fillStyle = '#f2f6ff'; g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 8; const ix = W / 2 - 70, iy = 128;
      for (const o of [0, 46]) { g.beginPath(); g.moveTo(ix + o, iy); g.lineTo(ix + o + 44, iy - 26); g.lineTo(ix + o + 44, iy + 26); g.closePath(); g.fill(); }
      g.font = F(900, 40); g.fillText('REW', ix + 106, iy + 15); g.restore(); } }
  flash(g, .22 * pulse(t, T28, 9) * (t > T28), '#ffd36a');
  if (t > CRASH2) vignette(g, .5 * E.outC(inv(CRASH2, CRASH2 + .3, t)) * (.8 + .2 * beatPulse(t, 5)), '255,30,70');
}
