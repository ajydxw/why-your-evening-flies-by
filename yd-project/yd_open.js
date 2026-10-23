// ================= 《越想赢，越会输》 开头 · 版本3 霓虹走钢丝 =================
const Q = bt;
const T_IGN = Q(0), B2 = Q(4), B3 = Q(8), SLIP = Q(12), TQ1 = Q(13), TQ2 = Q(14), TQ3 = Q(15), B5 = Q(16);
const HA2 = Q(1), HA3 = Q(2), HA4 = Q(3);
let EYE_MUL = 1; // title section closes every eye in the city
const CA = 620, CS = 400, FOC = 1000;
const curY = x => -CA * Math.exp(-((x / CS) ** 2));
function hits(t, L) { let a = 0; for (const [t0, v, d] of L) { const u = t - t0; if (u >= 0 && u < d) a += v * Math.pow(1 - u / d, 2); } return a; }
const pulse = (t, t0, k = 6) => t < t0 ? 0 : Math.exp(-(t - t0) * k);
function beatPulse(t, k = 7) { const b = (t - PH) / BEAT; if (b < 0) return 0; return Math.exp(-(b - Math.floor(b)) * BEAT * k); }
// ---------- arc length along the curve ----------
const ARC = (() => { const xs = [], ss = []; let s = 0, px = -1600, py = curY(-1600); for (let x = -1600; x <= 1600; x += 2) { const y = curY(x); s += Math.hypot(x - px, y - py); xs.push(x); ss.push(s); px = x; py = y; } return { xs, ss }; })();
function sAtX(x) { const i = clamp(Math.round((x + 1600) / 2), 0, ARC.xs.length - 1); return ARC.ss[i]; }
function xAtS(s) { const a = ARC.ss; let lo = 0, hi = a.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (a[m] < s) lo = m; else hi = m; } const f = (s - a[lo]) / Math.max(1e-6, a[hi] - a[lo]); return lerp(ARC.xs[lo], ARC.xs[hi], clamp(f)); }
const S0 = sAtX(-640), SP = sAtX(-16);
function walkS(t, smooth) { const k = (t - T_IGN) / BEAT; if (k <= 0) return S0 - (smooth ? 0 : 0); if (k >= 12) return SP; const i = Math.floor(k), f = k - i; const e = smooth ? f : E.ioS(clamp((f - .22) / .78)); return lerp(S0, SP, (i + e) / 12); }
// wire tremble (grows through bar 3)
function trembleAmp(t) { return t < B3 ? (t > HA3 && t < B2 ? 15 * Math.exp(-(t - HA3) * 3.2) : 0) : t < SLIP ? 7 * E.inC(inv(B3, SLIP, t)) + 1.5 : 10 * Math.exp(-(t - SLIP) * 2.2) + (t > Q(30) ? 9 * Math.exp(-(t - Q(30)) * 2.4) : 0); }
function wireY(x, t) {
  let y = curY(x); const A = trembleAmp(t); if (A > 0) { const wx = walker(t).x; y += A * Math.sin((x - wx) * .045 - t * 31) * Math.exp(-Math.abs(x - wx) / 260); }
  return y;
}
// ---------- walker ----------
const SLIDE0 = SLIP + .42, SLIDE1 = TQ3 + .25, XEND = 585;
function hangX(t) { if (t >= Q(30)) return slide2(t); if (t < SLIP + .22) return lerp(-16, 34, E.outC(inv(SLIP, SLIP + .22, t))); if (t < SLIDE0) return lerp(34, 62, inv(SLIP + .22, SLIDE0, t)); const u = inv(SLIDE0, SLIDE1, t); return lerp(62, XEND, u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2.4) / 2); }
function walker(t) {
  if (t >= Q(26)) return walkerT(t);
  if (t < SLIP) { const s = walkS(t, false), x = xAtS(s); const k = Math.max(0, (t - T_IGN) / BEAT); return { x, y: curY(x), mode: 'walk', k, ph: k - Math.floor(k), leg: Math.floor(k) % 2 }; }
  const x = hangX(t); return { x, y: curY(x), mode: 'fall', u: t - SLIP };
}
function hangSpeed(t) { return (hangX(t + .02) - hangX(t - .02)) / .04; }
// ---------- camera ----------
let CAM = { x: 0, y: 0, z: 1 };
const sc = dd => FOC / (FOC / CAM.z + dd);
const P = (wx, wy, dd = 0) => { const s = sc(dd); return [W / 2 + (wx - CAM.x) * s, H / 2 + (wy - CAM.y) * s, s]; };
function camFollow(t) {
  const xs = xAtS(walkS(Math.min(t, SLIP), true)), ys = curY(xs); let z, tx, ty;
  if (t < HA4) { const u = inv(HA3, HA4, t); z = lerp(6.6, 6.1, E.outC(u)); tx = 900; ty = 610; }
  else if (t < B2) { const u = E.outC(inv(HA4, B2, t)); z = lerp(6.1, 2.9, u); tx = lerp(900, 820, u); ty = lerp(610, 690, u); }
  else { const u = E.ioS(inv(Q(6), SLIP, t)); z = lerp(2.8, 2.25, u); const v = E.ioS(inv(Q(6) - .3, B3 + .5, t)); tx = lerp(820, 1080, v); ty = lerp(690, 760, v); }
  z *= 1 + .05 * pulse(t, Q(6), 5) + .035 * pulse(t, B3, 5) + .012 * beatPulse(t, 8) * (t > B3 && t < SLIP);
  return { x: xs + (W / 2 - tx) / z, y: ys - (ty - H / 2) / z, z };
}
function camAt(t) {
  const f = camFollow(t); if (t < SLIP) return f;
  const p0 = camFollow(SLIP); const punch = E.outC(inv(SLIP, SLIP + .1, t)) * (1 - E.ioS(inv(SLIP + .25, SLIP + .6, t)));
  const p = E.ioC(inv(SLIP + .22, TQ3 + .05, t)); const drift = inv(TQ3, B5 + .5, t);
  const z = lerp(p0.z * (1 + .14 * punch), lerp(.9, .86, drift), p);
  const hx = hangX(t), fx = lerp(p0.x, hx + 60, inv(SLIP, SLIP + .5, t) * .6);
  return { x: lerp(fx, 30, p), y: lerp(p0.y + 12 * punch, -318, p), z };
}
// ---------- city generation ----------
const PAL = ['#5ef2ff', '#ff5ad8', '#ffc46b', '#8f86ff', '#5ef2ff', '#b8f8ff'];
function genLayer(seed, x0, x1, o) {
  const r = rng(seed), B = []; let x = x0;
  while (x < x1) {
    const w = lerp(o.wmin, o.wmax, r()), h = lerp(o.hmin, o.hmax, Math.pow(r(), 1.3)) * (1 - .25 * Math.exp(-((x / 900) ** 2)) * (o.dip || 0));
    const b = { x, w, h, tone: r(), win: [], neon: r() < o.neonP ? PAL[Math.floor(r() * 4)] : null, ant: r() < .45, step: r() < .35 ? lerp(.55, .8, r()) : 0, bill: null };
    const pitchX = o.cw + o.gx, pitchY = o.ch + o.gy, cols = Math.max(1, Math.floor((w - 16) / pitchX)), rows = Math.floor((h - 30) / pitchY);
    const ox = (w - cols * pitchX + o.gx) / 2; const dens = lerp(.18, .62, r()), colBias = Math.floor(r() * PAL.length);
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const wy = -h + 26 + j * pitchY; if (b.step && j < rows * .18 && (i < cols * .25 || i > cols * .75)) continue;
      if (r() < dens) b.win.push({ x: x + ox + i * pitchX, y: wy, c: r() < .75 ? PAL[colBias] : PAL[Math.floor(r() * PAL.length)], a: lerp(.35, 1, r()), d: r(), eye: r(), ej: r(), bl: r() });
    }
    B.push(b); x += w + lerp(o.gap[0], o.gap[1], r());
  }
  return B;
}
const L_FAR = genLayer(11, -7600, 7600, { wmin: 140, wmax: 340, hmin: 260, hmax: 1150, cw: 12, ch: 8, gx: 12, gy: 16, gap: [-30, 30], neonP: .25, dip: .3 });
const L_MID = genLayer(23, -5200, 5200, { wmin: 150, wmax: 320, hmin: 220, hmax: 900, cw: 16, ch: 10, gx: 12, gy: 14, gap: [10, 70], neonP: .4, dip: .2 });
const L_NEAR = genLayer(37, -2900, 2900, { wmin: 170, wmax: 330, hmin: 140, hmax: 560, cw: 24, ch: 14, gx: 16, gy: 18, gap: [40, 160], neonP: .55, dip: .35 });
const DD = { far: 2600, mid: 1150, near: 430 };
// billboards on mid layer that switch to eyes
const BILLS = (() => { const r = rng(5), out = []; for (const b of L_MID) if (b.h > 500 && r() < .28) out.push({ b, u: lerp(.15, .5, r()), w: b.w * .8, hue: Math.floor(r() * 3), te: Q(9 + Math.floor(r() * 3)) + r() * .2 }); return out; })();
// eye timing: share of windows opened by beat
const EYE_SHARE = [[Q(4), 0], [Q(4.05), .06], [Q(5), .16], [Q(6), .3], [Q(7), .48], [Q(8), .62], [Q(9), .74], [Q(10), .86], [Q(11), .96], [Q(12), 1]];
function eyeOpenT(rank) { for (let i = 1; i < EYE_SHARE.length; i++) if (rank < EYE_SHARE[i][1]) { return EYE_SHARE[i - 1][0] + .02; } return 1e9; }
function precomputeEyes(L, share) { for (const b of L) for (const w of b.win) { w.isEye = w.eye < share; if (w.isEye) w.et = eyeOpenT(w.ej) + w.bl * .14; } }
precomputeEyes(L_MID, .55); precomputeEyes(L_NEAR, .5); precomputeEyes(L_FAR, .35);
// ---------- prerendered layer images ----------
function layerImg(L, x0, x1, hmax, scale, tint, lit) {
  const cw = Math.ceil((x1 - x0) * scale), ch = Math.ceil((hmax + 140) * scale), cv = mk(cw, ch), g = cv.getContext('2d');
  g.scale(scale, scale); g.translate(-x0, hmax + 140);
  for (const b of L) {
    if (!lit) {
      const top = -b.h; g.fillStyle = linear(g, 0, top, 0, 0, [[0, tint[0]], [1, tint[1]]]);
      g.fillRect(b.x, top, b.w, b.h); if (b.step) g.fillRect(b.x + b.w * .25, top - b.h * (1 - b.step) * .3, b.w * .5, b.h * (1 - b.step) * .3 + 2);
      if (b.ant) { g.fillRect(b.x + b.w * .5 - 2, top - 60, 4, 60); }
      g.fillStyle = 'rgba(255,255,255,.035)'; g.fillRect(b.x, top, 3, b.h);
    } else {
      for (const w of b.win) { if (w.isEye) continue; g.globalAlpha = w.a * .9; g.fillStyle = w.c; g.fillRect(w.x, w.y, lit.cw, lit.ch); }
      g.globalAlpha = 1;
      if (b.neon) { g.fillStyle = b.neon; g.globalAlpha = .9; g.fillRect(b.x + 2, -b.h, 3, b.h); g.fillRect(b.x, -b.h, b.w, 3); g.globalAlpha = 1; }
    }
  }
  return { cv, x0, scale, hmax: hmax + 140 };
}
let IMG = {};
function buildCity() {
  IMG.farB = layerImg(L_FAR, -7600, 7800, 1250, .38, ['#1b1748', '#120f32'], null);
  IMG.farL = layerImg(L_FAR, -7600, 7800, 1250, .38, null, { cw: 12, ch: 8 });
  IMG.midB = layerImg(L_MID, -5200, 5400, 980, .78, ['#100f33', '#0a0a22'], null);
  IMG.farB.ground = '#120f32'; IMG.midB.ground = '#0a0a22';
  IMG.midL = layerImg(L_MID, -5200, 5400, 980, .78, null, { cw: 16, ch: 10 });
}
function drawLayerImg(g, I, dd, alpha = 1, op = 'source-over', clipR = null) {
  if (alpha <= .003) return; const s = sc(dd), k = s / I.scale; const [sx, sy] = P(I.x0, -I.hmax, dd);
  g.save(); g.globalAlpha = alpha; g.globalCompositeOperation = op;
  if (clipR) { const [ax] = P(clipR[0], 0, dd), [bx] = P(clipR[1], 0, dd); g.beginPath(); g.rect(ax, 0, bx - ax, H); g.clip(); }
  g.drawImage(I.cv, sx, sy, I.cv.width * k, I.cv.height * k);
  if (I.ground && op === 'source-over') { const [, gy] = P(0, 0, dd); g.fillStyle = I.ground; g.fillRect(0, gy - 1, W, H - gy + 2); }
  g.restore();
}
// ---------- eyes ----------
function eyeShape(g, x, y, w, h) { g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x, y - h * 2, x + w, y); g.quadraticCurveTo(x, y + h * 2, x - w, y); g.closePath(); }
function drawEye(g, x, y, w, open, lx, ly, a = 1, big = false) {
  if (open <= .02 || a <= .01) return; const h = w * .42 * open;
  const dx = lx - x, dy = ly - y, dl = Math.hypot(dx, dy) + 1e-6, ir = w * .46;
  const ix = x + dx / dl * w * .32 * Math.min(1, dl / 300), iy = y + dy / dl * h * .5 * Math.min(1, dl / 300);
  g.save(); g.globalAlpha = a;
  if (w < 5) { g.fillStyle = '#ff2b4e'; g.fillRect(x - w, y - Math.max(.8, h * .6), w * 2, Math.max(1.4, h * 1.2)); g.restore(); return; }
  eyeShape(g, x, y, w, h); g.fillStyle = big ? 'rgba(255,220,230,.92)' : '#ffd9e2'; g.fill(); g.save(); g.clip();
  g.fillStyle = radial(g, ix, iy, ir, [[0, '#ffe07a'], [.35, '#ff3c55'], [1, '#7a0420']]); g.beginPath(); g.arc(ix, iy, ir, 0, TAU); g.fill();
  g.fillStyle = '#12030a'; g.beginPath(); g.arc(ix, iy, ir * .42, 0, TAU); g.fill();
  g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(ix - ir * .25, iy - ir * .3, ir * .16, 0, TAU); g.fill();
  g.restore();
  g.lineWidth = Math.max(1, w * .09); g.strokeStyle = '#ff3a5c'; eyeShape(g, x, y, w, h); g.stroke();
  g.restore();
}
function eyeOpenAmt(t, et, bl) { if (t < et) return 0; let o = E.outB(clamp((t - et) / .2)); const p = 2.6 + bl * 3, ph = ((t - et) % p) / p; if (ph > .93) o *= Math.abs(Math.cos((ph - .93) / .07 * Math.PI)); return o; }
function drawEyesLayer(g, L, dd, t, look, cw, ch, a = 1) {
  const s = sc(dd), ew = cw * .78 * s; if (ew < .8) return;
  for (const b of L) {
    const [bx] = P(b.x, 0, dd), [bx2] = P(b.x + b.w, 0, dd); if (bx2 < -20 || bx > W + 20) continue;
    for (const w of b.win) {
      if (!w.isEye || t < w.et) continue; const [x, y] = P(w.x + cw / 2, w.y + ch / 2, dd);
      const o = eyeOpenAmt(t, w.et, w.bl);
      if (ew > 3) { g.fillStyle = 'rgba(8,4,14,.9)'; g.fillRect(x - cw * s / 2, y - ch * s / 2, cw * s, ch * s); }
      drawEye(g, x, y, ew, o * EYE_MUL, look[0], look[1], a);
    }
  }
}
// ---------- near layer (live) ----------
function drawNear(g, t, wake, lit, look) {
  const dd = DD.near, s = sc(dd); const cw = 24, ch = 14;
  for (const b of L_NEAR) {
    const [x0, y0] = P(b.x, -b.h, dd), [x1, yG] = P(b.x + b.w, 0, dd); if (x1 < -40 || x0 > W + 40) continue;
    g.fillStyle = linear(g, 0, y0, 0, yG, [[0, '#0b0b26'], [1, '#05050f']]); g.fillRect(x0, y0, x1 - x0, H - y0 + 50);
    if (b.step) { const [sx0, sy0] = P(b.x + b.w * .25, -b.h - b.h * (1 - b.step) * .3, dd), [sx1] = P(b.x + b.w * .75, 0, dd); g.fillRect(sx0, sy0, sx1 - sx0, y0 - sy0 + 1); }
    if (b.ant) { const [ax, ay] = P(b.x + b.w * .5, -b.h - 80, dd); g.fillStyle = '#0b0b26'; g.fillRect(ax - 2 * s, ay, 4 * s, 80 * s); const bl = .5 + .5 * Math.sin(t * 3 + b.x); glowDot(g, ax, ay, 18 * s, '#ff3355', .35 + .65 * bl * wake); }
    g.fillStyle = 'rgba(255,255,255,.025)'; for (let fy = -b.h + 30; fy < 0; fy += 32) { const [, ly] = P(0, fy, dd); g.fillRect(x0, ly, x1 - x0, Math.max(1, 1.5 * s)); }
    g.fillStyle = linear(g, x0, 0, x1, 0, [[0, 'rgba(255,80,200,.07)'], [.3, 'rgba(0,0,0,0)'], [1, 'rgba(80,200,255,.05)']]); g.fillRect(x0, y0, x1 - x0, H - y0);
    // rim light
    g.fillStyle = 'rgba(120,200,255,.10)'; g.fillRect(x0, y0, 2.5 * s, yG - y0);
    if (b.neon) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .85 * wake * lit; g.shadowColor = b.neon; g.shadowBlur = 16; g.fillStyle = b.neon; g.fillRect(x0 + 3 * s, y0, 3 * s, yG - y0); g.fillRect(x0, y0, x1 - x0, 3 * s); g.restore(); }
    const bp = 1 + .3 * beatPulse(t, 6);
    for (const w of b.win) {
      const [wx, wy] = P(w.x, w.y, dd); if (wx < -30 || wx > W + 30) continue;
      const on = clamp((t - (T_IGN + .06 + Math.abs(w.x - (-640)) / 3200 + w.d * .3)) / .06);
      const al = w.a * on * lit * (w.isEye && t >= w.et ? 0 : 1); if (al <= .01) continue;
      g.globalAlpha = clamp(al * .85 * bp, 0, 1); g.fillStyle = w.c; g.fillRect(wx, wy, cw * s, ch * s);
    }
    g.globalAlpha = 1;
  }
  drawEyesLayer(g, L_NEAR, dd, t, look, cw, ch);
}
// ---------- billboards ----------
function drawBills(g, t, look, lit) {
  const dd = DD.mid, s = sc(dd);
  for (const B of BILLS) {
    const bw = B.w, bh = bw * .62, wx = B.b.x + (B.b.w - bw) / 2, wy = -B.b.h * (1 - B.u);
    const [x, y] = P(wx, wy, dd); if (x > W + 50 || x + bw * s < -50) continue; const w = bw * s, h = bh * s;
    const on = clamp((t - T_IGN - .6 - B.u) / .2); if (on <= 0) continue;
    g.save(); g.globalAlpha = on; g.fillStyle = '#050510'; g.fillRect(x - 2, y - 2, w + 4, h + 4);
    const cols = [['#2a0f5a', '#d23cff'], ['#06304a', '#24e0ff'], ['#3a1030', '#ff7a3c']][B.hue];
    const isEye = t >= B.te;
    if (!isEye) { g.fillStyle = linear(g, x, y, x + w, y + h, [[0, cols[0]], [1, cols[1]]]); g.globalAlpha = on * (.55 + .2 * lit); g.fillRect(x, y, w, h); g.globalAlpha = on * .5; g.fillStyle = '#fff'; for (let i = 0; i < 3; i++) g.fillRect(x + w * .12, y + h * (.3 + i * .18), w * (.6 - i * .15), h * .06); }
    else { g.fillStyle = 'rgba(40,0,10,.95)'; g.fillRect(x, y, w, h); const o = eyeOpenAmt(t, B.te, .4); drawEye(g, x + w / 2, y + h / 2, w * .36, o * EYE_MUL, look[0], look[1], 1, true); }
    g.globalAlpha = .18 * on; g.fillStyle = '#000'; for (let yy = 0; yy < h; yy += 3) g.fillRect(x, y + yy, w, 1);
    g.restore();
  }
}
// ---------- sky ----------
const STARS = (() => { const r = rng(77), a = []; for (let i = 0; i < 260; i++) a.push([r() * W, r() * H * .6, r() * 1.6 + .3, r()]); return a; })();
function drawSky(g, t, wake, crash) {
  const [, hz] = P(0, 0, DD.far);
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#04041a'], [clamp(hz / H - .35, .05, .9), '#0e0a33'], [clamp(hz / H - .05, .1, .95), mixHex('#3c1160', '#3a0a26', crash)], [1, '#12061f']]);
  g.fillRect(0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'lighter';
  g.globalAlpha = .55 * wake; g.fillStyle = radial(g, W / 2, hz, 1100, [[0, `rgba(255,${lerp(70, 40, crash) | 0},${lerp(200, 80, crash) | 0},${lerp(.5, .55, crash)})`], [.5, 'rgba(120,40,200,.15)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H);
  for (const [x, y, r, p] of STARS) { g.globalAlpha = (.25 + .5 * Math.abs(Math.sin(t * (1 + p * 2) + p * 9))) * wake; g.fillStyle = '#cfe8ff'; g.fillRect(x, y, r, r); }
  g.restore();
}
// moon that becomes a giant eye
const MOON_EYE = Q(9);
function drawMoon(g, t, wake, look) {
  const s = sc(6000) / sc(6000) ; const [mx, my] = P(2200, -2300, 4200); const r = 150 * sc(4200) / .23;
  if (mx < -r * 2 || mx > W + r * 2) return;
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = wake;
  g.fillStyle = radial(g, mx, my, r * 3.2, [[0, 'rgba(255,120,210,.35)'], [.4, 'rgba(140,60,255,.12)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(mx - r * 3.2, my - r * 3.2, r * 6.4, r * 6.4); g.restore();
  const op = (t < MOON_EYE ? 0 : E.outB(clamp((t - MOON_EYE) / .35))) * EYE_MUL;
  g.save(); g.globalAlpha = wake; g.beginPath(); g.arc(mx, my, r, 0, TAU); g.fillStyle = radial(g, mx - r * .3, my - r * .3, r * 1.3, [[0, '#ffe9f6'], [.6, '#ffb3df'], [1, '#c060c8']]); g.fill();
  g.globalAlpha = wake * .25; g.fillStyle = '#a04aa8'; for (const [a, b, c] of [[-.3, .2, .18], [.35, -.25, .12], [.1, .45, .1]]) { g.beginPath(); g.arc(mx + a * r, my + b * r, c * r, 0, TAU); g.fill(); }
  if (op > 0) { g.globalAlpha = 1; g.save(); g.beginPath(); g.arc(mx, my, r, 0, TAU); g.clip(); g.fillStyle = `rgba(120,0,40,${.55 * op})`; g.fillRect(mx - r, my - r, 2 * r, 2 * r); g.restore(); drawEye(g, mx, my, r * .92, op, look[0], look[1], 1, true); }
  g.lineWidth = 3; g.strokeStyle = `rgba(255,190,240,${.35 * wake})`; g.beginPath(); g.arc(mx, my, r * 1.18, 0, TAU); g.stroke();
  g.restore();
}
// ---------- traffic ----------
const CARS = (() => { const r = rng(91), a = []; for (let i = 0; i < 70; i++) a.push({ lane: Math.floor(r() * 4), off: r() * 9000, v: lerp(260, 520, r()) * (r() < .5 ? 1 : -1), c: r() < .5 ? '#ff4a6a' : '#fff3c4' }); return a; })();
function drawTraffic(g, t, wake) {
  const dd = 800; g.save(); g.globalCompositeOperation = 'lighter';
  for (const c of CARS) {
    const y = -260 - c.lane * 110, x = ((c.off + c.v * t) % 9000 + 9000) % 9000 - 4500; const [sx, sy, s] = P(x, y, dd); if (sx < -100 || sx > W + 100) continue;
    const len = Math.abs(c.v) * .09 * s * 2; g.globalAlpha = .7 * wake; g.strokeStyle = c.c; g.lineWidth = 2.2 * s; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx - Math.sign(c.v) * len, sy); g.stroke(); glowDot(g, sx, sy, 9 * s, c.c, .6 * wake);
  }
  g.restore();
}
// ---------- neon signs ----------
const SIGNS = [
  { s: '为什么', x: 150, y: 250, size: 120, c: '#5ef2ff', t: Q(8) },
  { s: '你', x: 545, y: 250, size: 120, c: '#ff5ad8', t: Q(9) },
  { s: '越想', x: 150, y: 560, size: 120, c: '#5ef2ff', t: Q(10) },
  { s: '赢', x: 470, y: 640, size: 300, c: '#ffc44d', t: Q(11), big: 1 }];
function neonOn(t, t0, seed) { if (t < t0) return 0; const u = t - t0; if (u < .16) return hsh(Math.floor(t * 60) + seed) > .45 ? 1 : .15; return .93 + .07 * nz(t * 18, seed); }
function neonText(g, str, x, y, size, col, a, frame) {
  if (a <= .01) return; g.save(); g.font = F(900, size); g.textBaseline = 'alphabetic'; const w = g.measureText(str).width;
  if (frame) { g.globalAlpha = a * .9; g.lineWidth = size * .028; g.strokeStyle = '#ff3d6a'; g.shadowColor = '#ff3d6a'; g.shadowBlur = 30; rr(g, x - size * .14, y - size * 1.0, w + size * .28, size * 1.18, size * .12); g.stroke(); }
  g.globalAlpha = a; g.shadowColor = col; g.shadowBlur = size * .35; g.fillStyle = col; g.fillText(str, x, y); g.shadowBlur = size * .12; g.fillText(str, x, y);
  g.shadowBlur = 0; g.globalAlpha = a * .75; g.lineWidth = size * .018; g.strokeStyle = 'rgba(255,255,255,.95)'; g.strokeText(str, x, y);
  g.globalAlpha = a * .5; g.fillStyle = 'rgba(255,255,255,.9)'; g.save(); g.beginPath(); g.rect(x - 10, y - size, w + 20, size * .45); g.clip(); g.fillText(str, x, y); g.restore();
  g.restore(); return w;
}
function drawSigns(g, t) {
  if (t > B3 - .1) { const a = clamp((t - B3 + .1) / .3) * (1 - clamp((t - SLIP - .2) / .5)); if (a > 0) { g.save(); g.globalAlpha = .55 * a; g.fillStyle = radial(g, 430, 400, 620, [[0, 'rgba(5,3,18,.85)'], [.6, 'rgba(5,3,18,.4)'], [1, 'rgba(5,3,18,0)']]); g.fillRect(0, 0, W, H); g.restore(); } }
  const ref = camAt(Q(10)); const dx = (ref.x - CAM.x) * sc(160) * .35, dy = (ref.y - CAM.y) * sc(160) * .2;
  for (let i = 0; i < SIGNS.length; i++) {
    const S = SIGNS[i]; let a = neonOn(t, S.t, i * 13); if (a <= 0) continue;
    let ox = dx, oy = dy + (1 - E.outB(clamp((t - S.t) / .3))) * -40, rot = 0;
    if (t > SLIP) {
      if (S.big) { const u = t - SLIP; a *= u < .3 ? (hsh(Math.floor(t * 50)) > .5 ? 1 : .1) : Math.max(0, 1 - (u - .3) * 2.5) * .9; const fu = Math.max(0, u - .18); oy += 1500 * fu * fu; rot = .9 * fu * fu + .25 * fu; ox += 60 * fu; }
      else { const u = t - SLIP - .12 - i * .08; if (u > 0) a *= u < .15 ? (hsh(Math.floor(t * 50) + i) > .5 ? .8 : .1) : Math.max(0, 1 - (u - .15) * 4); }
    }
    if (a <= .01) continue;
    g.save(); g.translate(S.x + ox, S.y + oy); g.rotate(rot);
    if (!S.big) { g.globalAlpha = .35 * a; g.strokeStyle = '#9aa6c8'; g.lineWidth = 2; g.beginPath(); g.moveTo(20, -S.size * .9); g.lineTo(20, -S.size * .9 - 700); g.moveTo(S.size * 1.2, -S.size * .9); g.lineTo(S.size * 1.2, -S.size * .9 - 700); g.stroke(); }
    neonText(g, S.s, 0, 0, S.size, S.c, a, S.big);
    g.restore();
  }
  // short-circuit sparks from 赢
  if (t > SLIP && t < SLIP + 1.6) { const S = SIGNS[3]; sparkBurst(g, t, SLIP, S.x + 160 + dx, S.y - 160 + dy, 90, 1100, 77); sparkBurst(g, t, SLIP + .14, S.x + 60 + dx, S.y - 40 + dy, 50, 900, 78); }
}
function sparkBurst(g, t, t0, x, y, n, sp, seed) {
  const u = t - t0; if (u < 0 || u > 1.4) return; const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const a = r() * TAU, v = sp * (.3 + r() * .7), life = .5 + r() * .8; if (u > life) { r(); continue; } const px = x + Math.cos(a) * v * u, py = y + Math.sin(a) * v * u + 1300 * u * u;
    const k = 1 - u / life; g.strokeStyle = `rgba(255,${180 + 70 * r() | 0},120,${k})`; g.lineWidth = 2.5; g.beginPath(); g.moveTo(px, py); g.lineTo(px - Math.cos(a) * v * .025, py - (Math.sin(a) * v + 2600 * u) * .025); g.stroke(); }
  g.restore();
}
// ---------- wire ----------
function drawWire(g, t) {
  const front = lerp(-1150, 1700, E.outC(inv(T_IGN, T_IGN + 1.5, t))); if (t < T_IGN) return;
  const pts = []; const z = CAM.z; const xa = CAM.x - W / 2 / z - 50, xb = CAM.x + W / 2 / z + 50;
  for (let x = Math.max(-1500, xa); x <= Math.min(1500, xb, front); x += Math.max(1.5, 6 / z)) { const [sx, sy] = P(x, wireY(x, t)); pts.push([sx, sy, x]); }
  if (pts.length < 2) return;
  const path = (a = 0, b = pts.length) => { g.beginPath(); for (let i = a; i < b; i++) i === a ? g.moveTo(pts[i][0], pts[i][1]) : g.lineTo(pts[i][0], pts[i][1]); };
  const crashX = t > SLIP ? hangX(t) : -1e9; const iC = pts.findIndex(p => p[2] > -10), iH = pts.findIndex(p => p[2] > crashX);
  const lw = clamp(z * 1.3, 1.6, 4.2), bp = 1 + .4 * beatPulse(t, 6);
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
  const seg = (col, a, b) => { if (b - a < 2) return; path(a, b); g.strokeStyle = col; g.globalAlpha = .18 * bp; g.lineWidth = lw * 9; g.stroke(); g.globalAlpha = .45; g.lineWidth = lw * 3.2; g.stroke(); g.globalAlpha = 1; g.lineWidth = lw; g.strokeStyle = '#eaffff'; g.stroke(); };
  if (t > SLIP && iC >= 0) { seg('#4fe9ff', 0, iC + 1); const e = iH < 0 ? pts.length : iH; seg('#ff2d55', iC, e + 1); seg('#ff4060', iC, e + 1); seg('#4fe9ff', e, pts.length); }
  else seg('#4fe9ff', 0, pts.length);
  // ignition head
  if (t < T_IGN + 1.6) { const [hx, hy] = P(front, curY(front)); glowDot(g, hx, hy, 90, '#bff8ff', 1 - inv(T_IGN + 1, T_IGN + 1.6, t)); glowDot(g, hx, hy, 26, '#ffffff', 1); }
  g.restore();
}
// ---------- the walker ----------
function limb(g, pts, w, col) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); }
const BODY = '#07081a', RIM = '#7ff4ff';
function drawFigure(g, parts, z) {
  // rim glow pass then body pass
  for (const pass of [0, 1]) {
    g.save(); if (pass === 0) { g.shadowColor = RIM; g.shadowBlur = 14; g.translate(-1.2, -.8); }
    const col = pass === 0 ? RIM : BODY;
    for (const p of parts) { if (p.type === 'l') limb(g, p.pts, p.w + (pass ? 0 : 1.6), col); else { g.fillStyle = col; g.beginPath(); g.arc(p.x, p.y, p.r + (pass ? 0 : .8), 0, TAU); g.fill(); } }
    g.restore();
  }
}
function drawWalker(g, t) {
  if (t < T_IGN) return; const wk = walker(t); const [sx, sy, s] = P(wk.x, wireY(wk.x, t));
  g.save(); g.translate(sx, sy); g.scale(s, s);
  const ang = Math.atan2(curY(wk.x + 1) - curY(wk.x - 1), 2);
  if (wk.mode === 'walk') {
    const ph = wk.ph, st = E.ioS(clamp((ph - .22) / .78)), sw = Math.sin(st * Math.PI);
    const slE = t > HA3 && t < B2 ? Math.exp(-(t - HA3) * 2.4) : 0, slF = t > HA3 && t < B2 ? E.outC(clamp((t - HA3) / .1)) * (1 - E.ioS(inv(HA3 + .28, HA3 + .6, t))) : 0;
    const bal = (wk.nerv || 0) * .32 * Math.sin(t * 13.5) + slE * .8 * Math.sin((t - HA3) * 12.5 + .5) + Math.sin(t * 2.3) * .08 + (t > B3 && t < SLIP ? Math.sin(t * 9.5) * .2 * inv(B3, SLIP, t) : 0) + Math.sin(t * 5.1) * .03;
    const SLO = wk.slouch || 0, TRI = wk.tri || 0;
    const bob = -sw * 2.5 + 7 * slF + SLO * 5; const lean = .06 + bal * .35 - .18 * slF + SLO * .32;
    const fA = lerp(-9, 9, st), fB = lerp(9, -9, st); const front = wk.leg ? fA : fB, back = wk.leg ? fB : fA;
    const hip = [lean * 26, -27 + bob], sh = [hip[0] + lean * 18, -45 + bob], hd = [sh[0] + 1, -53 + bob];
    const footY = x => x * Math.tan(ang);
    const legP = (fx, lift, dr = 0) => [hip, [lerp(hip[0], fx, .5) + 3 + dr * .3, -13 + bob - lift * 4 + dr * .2], [fx + dr * .5, footY(fx) - lift * 5 + dr]];
    g.rotate(0);
    // pole
    const pa = bal * .9 + Math.tan(ang) * .2, px = sh[0] + 2, py = -37 + bob - TRI * 26;
    const parts = [];
    parts.push({ type: 'l', pts: legP(back, 0), w: 6.5 }, { type: 'l', pts: legP(front, sw * (1 - slF), 15 * slF), w: 6.5 });
    parts.push({ type: 'l', pts: [hip, sh], w: 11 }, { type: 'c', x: hd[0], y: hd[1], r: 6.2 });
    const hand1 = [px - Math.cos(pa) * 14, py - Math.sin(pa) * 14], hand2 = [px + Math.cos(pa) * 14, py + Math.sin(pa) * 14];
    parts.push({ type: 'l', pts: [sh, [sh[0] - 8 - TRI * 3, -38 + bob - TRI * 14], hand1], w: 4.5 }, { type: 'l', pts: [sh, [sh[0] + 9 + TRI * 3, -38 + bob - TRI * 14], hand2], w: 4.5 });
    // scarf
    const sc1 = [sh[0] - 2, -48 + bob]; const fl = t * 9; const scarf = [sc1]; for (let i = 1; i <= 5; i++) scarf.push([sc1[0] - i * 5.5, sc1[1] + i * 1.2 + Math.sin(fl - i * .9) * i * .9]);
    g.save(); g.strokeStyle = '#ff4fcf'; g.shadowColor = '#ff4fcf'; g.shadowBlur = 10; g.lineWidth = 3.4; g.lineCap = 'round'; g.beginPath(); scarf.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); g.restore();
    drawFigure(g, parts, s);
    drawPole(g, px, py, pa, 1);
  } else {
    const u = wk.u, hangK = E.ioS(inv(.16, .46, u)), spd = hangSpeed(t);
    const trail = clamp(-spd * .0009, -.85, 0) * hangK; const swing = Math.sin(u * 7) * .25 * Math.exp(-Math.max(0, t - (wk.se ?? SLIDE1)) * 1.5) * hangK;
    if (hangK < 1) { // slipping: lean back, foot kicks
      const k = E.outC(inv(0, .16, u)); g.save(); g.rotate(-.5 * k - .9 * hangK);
      const hip = [-4 * k, -27], sh = [-10 * k, -45], hd = [-12 * k, -53];
      drawFigure(g, [{ type: 'l', pts: [hip, [-2, -13], [-6, 0]], w: 6.5 }, { type: 'l', pts: [hip, [10, -22 - 6 * k], [22 * k + 4, -26 * k]], w: 6.5 }, { type: 'l', pts: [hip, sh], w: 11 }, { type: 'c', x: hd[0], y: hd[1], r: 6.2 },
        { type: 'l', pts: [sh, [sh[0] - 8, -58], [sh[0] - 4, -70]], w: 4.5 }, { type: 'l', pts: [sh, [sh[0] + 10, -56], [sh[0] + 18, -64]], w: 4.5 }], s);
      g.restore();
    }
    if (hangK > 0) {
      g.save(); g.globalAlpha = hangK; g.rotate(trail + swing);
      const sh = [0, 14], hip = [0, 32], hd = [5, 6];
      const lk = Math.sin(u * 9) * 4;
      drawFigure(g, [{ type: 'l', pts: [[-3, 0], [-5, 7], sh], w: 4.5 }, { type: 'l', pts: [[3, 0], [5, 7], sh], w: 4.5 }, { type: 'l', pts: [sh, hip], w: 11 }, { type: 'c', x: hd[0], y: hd[1] + 3, r: 6.2 },
        { type: 'l', pts: [hip, [-3 + lk, 45], [-8 + lk, 58]], w: 6.5 }, { type: 'l', pts: [hip, [4 - lk, 46], [3 - lk, 59]], w: 6.5 }], s);
      g.restore();
    }
  }
  g.restore();
  // falling pole
  if (wk.mode === 'fall') {
    const u = wk.u - .12; if (u > 0 && u < 2.5) { const x0 = wk.x0 ?? -16, [px, py, s2] = P(x0 + 40 * u + 10, curY(x0) - 37 + 1500 * u * u - 200 * u); g.save(); g.translate(px, py); g.scale(s2, s2); drawPole(g, 0, 0, .3 + u * 7, 1); g.restore(); }
    // hand sparks
    if (t > SLIDE0 - .1) handSparks(g, t);
  }
}
function drawPole(g, px, py, pa, a) {
  g.save(); g.globalAlpha = a; g.lineCap = 'round'; const L = 68, x1 = px - Math.cos(pa) * L, y1 = py - Math.sin(pa) * L, x2 = px + Math.cos(pa) * L, y2 = py + Math.sin(pa) * L;
  g.strokeStyle = '#1a1d38'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
  g.strokeStyle = 'rgba(127,244,255,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x1, y1 - 1); g.lineTo(x2, y2 - 1); g.stroke();
  g.globalCompositeOperation = 'lighter'; for (const [x, y, c] of [[x1, y1, '#5ef2ff'], [x2, y2, '#ff5ad8']]) { g.fillStyle = radial(g, x, y, 9, [[0, '#fff'], [.3, c], [1, 'rgba(0,0,0,0)']]); g.fillRect(x - 9, y - 9, 18, 18); }
  g.restore();
}
function handSparks(g, t) {
  g.save(); g.globalCompositeOperation = 'lighter'; const dt = 1 / 240;
  for (let te = Math.max(SLIDE0 - .1, t - .7); te < t; te += dt) {
    const i = Math.round(te / dt), r1 = hsh(i), r2 = hsh(i + 3.3), r3 = hsh(i + 7.7); const spd = hangSpeed(te); if (spd < 60) continue; if (r3 > clamp(spd / 900)) continue;
    const hx = hangX(te), hy = curY(hx), u = t - te, life = .25 + r1 * .45; if (u > life) continue;
    const vx = -spd * (.15 + r2 * .5) + (r1 - .5) * 260, vy = -150 - r2 * 320; const x = hx + vx * u, y = hy + vy * u + 1400 * u * u;
    const [sx, sy, s] = P(x, y); const k = 1 - u / life; g.strokeStyle = `rgba(255,${150 + 100 * r2 | 0},${80 + 80 * r1 | 0},${k})`; g.lineWidth = Math.max(1.2, 2.4 * s);
    const [qx, qy] = P(x - vx * .02, y - (vy + 2800 * u) * .02); g.beginPath(); g.moveTo(sx, sy); g.lineTo(qx, qy); g.stroke();
  }
  const hx = hangX(t); const [sx, sy, s] = P(hx, curY(hx)); const spd = hangSpeed(t); if (spd > 40) { glowDot(g, sx, sy, 60 * s, '#ffb070', clamp(spd / 600)); glowDot(g, sx, sy, 18 * s, '#ffffff', clamp(spd / 600)); }
  g.restore();
}
// ---------- foreground particles ----------
const DUST = (() => { const r = rng(55), a = []; for (let i = 0; i < 90; i++) a.push([r() * 6000 - 3000, -r() * 1400, r() * 300 - 200, r(), r()]); return a; })();
function drawDust(g, t, wake) {
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [x, y, dd, p, q] of DUST) { const [sx, sy, s] = P(x + Math.sin(t * .4 + p * 9) * 30, y + Math.cos(t * .3 + q * 7) * 20 - t * 12, dd); if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue; const r = (dd < 0 ? 5 : 2.2) * s; glowDot(g, sx, sy, r * 3, p < .5 ? '#9ff6ff' : '#ff9be6', (.25 + .35 * q) * wake); }
  g.restore();
}
// ---------- question text ----------
function drawQuestion(g, t) {
  if (t < TQ1 - .05) return; const x = 470;
  kText(g, '却反而', x, 268, 92, { weight: 900, align: 'center', color: '#eef3ff', shadow: 'rgba(0,0,0,.8)', sBlur: 30, track: .06,
    fn: (i) => { const u = clamp((t - TQ1 - i * .07) / .32); return { a: E.outC(u), dy: (1 - E.outC(u)) * 50, s: 1 + (1 - E.outB(u)) * .3 }; } });
  if (t < TQ2 - .05) return; const g2 = clamp((t - TQ3) / .5);
  kText(g, '容易输？', x, 455, 158, { weight: 900, align: 'center', track: .02, shadow: 'rgba(0,0,0,.85)', sBlur: 36,
    color: (i) => i === 2 ? '#ff3150' : '#ffffff',
    fn: (i) => { const u = clamp((t - TQ2 - i * .045) / .22); const gl = i === 2 && t > TQ3 && t < TQ3 + .35 ? 1 : 0; return { a: u > 0 ? 1 : 0, s: lerp(2.2, 1, E.outE(u)), dx: gl * (hsh(Math.floor(t * 40)) - .5) * 40, dy: gl * (hsh(Math.floor(t * 40) + 2) - .5) * 14 }; } });
  // red underline sweep under 输
  const u = E.outE(clamp((t - TQ3) / .3)); if (u > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = '#ff3150'; g.shadowColor = '#ff3150'; g.shadowBlur = 20; g.fillRect(x - 250, 490, 500 * u, 7); g.restore(); }
}
// ---------- shot B: the city opens its eyes (Q4–Q6) ----------
const EB0 = B2, EB1 = Q(6), EPULL = Q(5.5);
const FAC = (() => { const r = rng(303), m = {}; for (let j = -12; j <= 12; j++) for (let i = -16; i <= 16; i++) m[i + ',' + j] = { c: PAL[Math.floor(r() * PAL.length)], a: lerp(.45, 1, r()), lit: r() < .7, ring: Math.max(Math.abs(i), Math.abs(j)), d: Math.hypot(i, j * 1.5), j: r(), bl: r() }; return m; })();
function facEyeT(i, j, c) { if (i === 0 && j === 0) return EB0 + .05; if (c.ring === 1) { const order = [[1, 0], [-1, 0], [0, -1], [0, 1], [1, 1], [-1, -1], [1, -1], [-1, 1]]; const k = order.findIndex(o => o[0] === i && o[1] === j); return Q(4.5) + k * BEAT / 4 * .9 + c.j * .03; } return c.j < .8 ? EPULL + c.d * .022 + c.j * .08 : 1e9; }
function shotEye(g, t) {
  const u = t - EB0, pull = E.inC(inv(EPULL, EB1, t)); const Z = lerp(1, 1.1, inv(EB0, EPULL, t)) * lerp(1, .26, pull);
  const cx = W / 2 + 40 * (1 - pull), cy = H / 2 - 20 * (1 - pull), PX = 300 * Z, PY = 190 * Z, WW = 220 * Z, WH = 124 * Z;
  g.fillStyle = '#07061a'; g.fillRect(0, 0, W, H);
  g.fillStyle = radial(g, cx, cy, 1100, [[0, '#191545'], [1, '#07061a']]); g.fillRect(0, 0, W, H);
  const look = [-1400, -1000];
  const nI = Math.ceil(W / 2 / PX) + 1, nJ = Math.ceil(H / 2 / PY) + 1;
  for (let j = -nJ; j <= nJ; j++) for (let i = -nI; i <= nI; i++) {
    const c = FAC[i + ',' + j]; if (!c) continue; const x = cx + i * PX, y = cy + j * PY;
    g.fillStyle = 'rgba(255,255,255,.03)'; g.fillRect(x - PX / 2, y + PY / 2 - 2 * Z, PX, 2 * Z);
    const et = facEyeT(i, j, c), isE = t >= et;
    if (!isE) { if (c.lit) { g.globalAlpha = c.a * (1 + .2 * beatPulse(t, 6)); g.fillStyle = c.c; g.fillRect(x - WW / 2, y - WH / 2, WW, WH); g.globalAlpha = 1; } else { g.fillStyle = '#0c0b28'; g.fillRect(x - WW / 2, y - WH / 2, WW, WH); } continue; }
    const o = eyeOpenAmt(t, et, c.bl);
    g.fillStyle = '#12020a'; g.fillRect(x - WW / 2, y - WH / 2, WW, WH); glowDot(g, x, y, WW * .9, '#ff2a50', .35 * o);
    // hero eye first stares at camera, then snaps to the walker
    let lk = look; if (i === 0 && j === 0) { const sn = E.outE(inv(EB0 + .45, EB0 + .6, t)); lk = [lerp(x, look[0], sn), lerp(y + 1, look[1], sn)]; }
    drawEye(g, x, y, WW * .44, o, lk[0], lk[1], 1, true);
    if (i === 0 && j === 0 && o > .5 && Z > .6) { // walker reflected in the pupil
      const w = WW * .44, h = w * .42 * o, dx = lk[0] - x, dy = lk[1] - y, dl = Math.hypot(dx, dy) + 1e-6, ir = w * .46;
      const ix = x + dx / dl * w * .32 * Math.min(1, dl / 300), iy = y + dy / dl * h * .5 * Math.min(1, dl / 300);
      g.save(); g.beginPath(); g.arc(ix, iy, ir * .42, 0, TAU); g.clip(); g.globalAlpha = .85 * (o - .5) * 2; g.strokeStyle = '#7ff4ff'; g.lineWidth = Math.max(1, ir * .03);
      g.beginPath(); g.moveTo(ix - ir * .5, iy + ir * .25); g.quadraticCurveTo(ix, iy - ir * .05, ix + ir * .5, iy + ir * .05); g.stroke();
      g.fillStyle = '#7ff4ff'; g.fillRect(ix - ir * .02, iy - ir * .16, ir * .04, ir * .14); g.beginPath(); g.arc(ix, iy - ir * .19, ir * .035, 0, TAU); g.fill(); g.fillRect(ix - ir * .15, iy - ir * .11, ir * .3, ir * .015);
      g.restore();
    }
  }
  // neon column strips
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = -nI; i <= nI; i++) { if ((i + 40) % 3) continue; const x = cx + (i + .5) * PX; g.fillStyle = i % 2 ? 'rgba(255,90,216,.5)' : 'rgba(94,242,255,.5)'; g.shadowColor = g.fillStyle; g.shadowBlur = 14; g.fillRect(x - 2 * Z, 0, 4 * Z, H); } g.restore();
}
// ---------- bar 1 hook: 4 beats · 4 shots (macro ignition → vertigo → near-slip → pull-back) ----------
const HB_T = [Q(-1.15), Q(0), Q(1), Q(2), Q(2.5), Q(3), Q(3.5)];
const BPM_K = [[Q(0), 96], [Q(1), 124], [Q(2), 163], [Q(3), 148]];
function bpmAt(t) { let v = 72, prev = 72; for (const [t0, b] of BPM_K) { if (t >= t0) v = lerp(prev, b, E.outC(clamp((t - t0) / .22))); prev = b; } return v; }
function ecgAt(tt) { let y = .03 * nz(tt * 37, 5); for (const h of HB_T) { const u = tt - h; if (u < -.06 || u > .4) continue; const A = .55 + .45 * clamp((bpmAt(h + .3) - 72) / 90);
  y += A * (-.18 * Math.exp(-(((u + .022) / .009) ** 2)) + Math.exp(-((u / .01) ** 2)) - .42 * Math.exp(-(((u - .026) / .011) ** 2)) + .24 * Math.exp(-(((u - .2) / .05) ** 2))); } return y; }
function heartPath(g, x, y, s) { g.beginPath(); g.moveTo(x, y + s * .5); g.bezierCurveTo(x - s * 1.15, y - s * .25, x - s * .5, y - s * 1.05, x, y - s * .35); g.bezierCurveTo(x + s * .5, y - s * 1.05, x + s * 1.15, y - s * .25, x, y + s * .5); g.closePath(); }
function drawHUD(g, t, x, y, a = 1) {
  if (a <= .01) return; const bpm = bpmAt(t), hot = clamp((bpm - 90) / 70);
  const col = hot > .8 ? '#ff3a5c' : hot > .4 ? '#ff5ad8' : '#5ef2ff';
  const AL0 = t > Q(30) ? Q(30.5) : HA3; const alarm = t > AL0 && t < AL0 + .7 ? (Math.floor((t - AL0) * 14) % 2 ? 1 : .3) : 1;
  const Wp = 380, Hp = 150; g.save(); g.translate(x, y); g.globalAlpha = a;
  g.fillStyle = hot > .8 && t > HA3 ? 'rgba(60,4,20,.6)' : 'rgba(8,6,30,.55)'; rr(g, 0, 0, Wp, Hp, 12); g.fill();
  g.strokeStyle = col; g.lineWidth = 3; g.shadowColor = col; g.shadowBlur = 12;
  for (const [cx, cy, sx, sy] of [[0, 0, 1, 1], [Wp, 0, -1, 1], [0, Hp, 1, -1], [Wp, Hp, -1, -1]]) { g.beginPath(); g.moveTo(cx, cy + sy * 24); g.lineTo(cx, cy); g.lineTo(cx + sx * 24, cy); g.stroke(); }
  let hp = 0; for (const h of HB_T) hp = Math.max(hp, pulse(t, h, 9)); g.fillStyle = col; heartPath(g, 36, 40, 15 * (1 + .45 * hp)); g.fill();
  g.shadowBlur = 0; g.font = F(700, 26); g.fillStyle = 'rgba(225,238,255,.92)'; g.textBaseline = 'alphabetic'; g.fillText('心率', 62, 50);
  g.font = F(700, 17); g.fillStyle = 'rgba(225,238,255,.6)'; g.fillText('BPM', 124, 50);
  g.globalAlpha = a * alarm; g.font = F(900, 78); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 22; g.fillText(String(Math.round(bpm)), 22, 132); g.shadowBlur = 0;
  if (t > AL0 && t < AL0 + .9) { g.font = F(900, 30); g.fillText('!', 158, 128); }
  g.globalAlpha = a; const x0 = 190, x1 = Wp - 18, yc = 92, amp = 46, win = 1.35, n = 96;
  g.beginPath(); for (let i = 0; i <= n; i++) { const f = i / n, tt = t - win * (1 - f), yy = yc - ecgAt(tt) * amp; i ? g.lineTo(lerp(x0, x1, f), yy) : g.moveTo(lerp(x0, x1, f), yy); }
  g.lineJoin = 'round'; g.strokeStyle = col; g.globalAlpha = a * .35; g.lineWidth = 8; g.stroke(); g.globalAlpha = a; g.lineWidth = 2.6; g.strokeStyle = '#ffffff'; g.stroke();
  glowDot(g, x1, yc - ecgAt(t) * amp, 16, col, a); g.globalAlpha = a * .25; g.fillStyle = col; g.fillRect(x0, yc + 40, x1 - x0, 1.5);
  g.restore();
}
// --- A1 · macro: the boot lands, the cable ignites (0 → Q1) ---
const MAC_BOKEH = (() => { const r = rng(808), a = []; for (let i = 0; i < 80; i++) { const z = r(); a.push({ x: r() * 2300 - 190, y: r() * 1300 - 110, r: lerp(16, 120, z * z), c: PAL[Math.floor(r() * PAL.length)], a: lerp(.3, .85, r()), d: r(), z }); } return a; })();
const MAC_A = Math.atan2(395 - 905, 2120), MCX = 840;
const macY = x => lerp(905, 395, (x + 100) / 2120);
function macSag(t) { if (t < T_IGN) return 0; const u = t - T_IGN; return 30 * (1 - Math.exp(-u * 7) * Math.cos(u * 26)) * (1 - .25 * inv(.2, .7, u)); }
function shotMacro(g, t) {
  const u = t - T_IGN, push = E.outC(clamp(t / HA2)), S = lerp(1.02, 1.16, push), rot = lerp(-.03, .015, push);
  const CY = macY(MCX), sag = macSag(t), wy = x => macY(x) + sag * Math.exp(-(((x - MCX) / 460) ** 2));
  g.fillStyle = '#05041a'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(MCX, CY); g.rotate(rot); g.scale(S, S); g.translate(-MCX, -CY);
  g.fillStyle = linear(g, 0, -150, 0, H + 150, [[0, '#0b0930'], [.55, '#2b1058'], [1, '#160723']]); g.fillRect(-400, -400, W + 800, H + 800);
  const on0 = u > 0 ? 1 : 0;
  g.save(); g.globalCompositeOperation = 'lighter';
  g.globalAlpha = .5 * on0 * clamp(u * 3); g.fillStyle = radial(g, MCX, H + 200, 1300, [[0, 'rgba(255,60,190,.55)'], [.5, 'rgba(120,40,220,.18)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(-400, -400, W + 800, H + 800);
  for (const b of MAC_BOKEH) {
    const on = u > 0 ? clamp((u * 5200 - Math.abs(b.x - MCX)) / 360) : 0, bx = b.x - push * 90 * (1 - b.z), by = b.y + Math.sin(t * .9 + b.d * 9) * 8;
    const al = b.a * (1 + .3 * beatPulse(t, 6) * on);
    if (on < 1) { g.globalAlpha = al * .16 * (1 - on); g.fillStyle = '#6c5bb0'; g.beginPath(); g.arc(bx, by, b.r, 0, TAU); g.fill(); }
    if (on > 0) { g.globalAlpha = al * .42 * on; g.fillStyle = b.c; g.beginPath(); g.arc(bx, by, b.r * (1 + .15 * (1 - on)), 0, TAU); g.fill(); g.globalAlpha = al * .5 * on; g.lineWidth = Math.max(1.5, b.r * .07); g.strokeStyle = b.c; g.stroke(); }
  }
  // wind streaks
  for (let i = 0; i < 14; i++) { const r1 = hsh(i * 3.1), sp = lerp(1800, 3600, r1), x = ((r1 * 4000 + t * sp) % 2600) - 300, y = hsh(i * 7.7) * H; g.globalAlpha = .06 + .08 * hsh(i); g.fillStyle = '#cfe8ff'; g.fillRect(x, y, 160 + 200 * r1, 1.5); }
  g.restore();
  // cable
  const pts = []; for (let x = -300; x <= 2300; x += 12) pts.push([x, wy(x)]);
  const path = (xa, xb) => { g.beginPath(); let f = 1; for (const [x, y] of pts) { if (x < xa || x > xb) continue; f ? g.moveTo(x, y) : g.lineTo(x, y); f = 0; } };
  g.lineCap = 'round'; path(-300, 2300); g.strokeStyle = '#151532'; g.lineWidth = 18; g.stroke();
  g.save(); g.translate(0, -5); path(-300, 2300); g.strokeStyle = 'rgba(190,205,255,.28)'; g.lineWidth = 2.5; g.stroke(); g.restore();
  if (u > 0) {
    const fr = MCX + u * 6800, fl = MCX - u * 3400;
    g.save(); g.globalCompositeOperation = 'lighter'; path(fl, fr);
    g.strokeStyle = '#4fe9ff'; g.globalAlpha = .16 * (1 + .5 * beatPulse(t, 6)); g.lineWidth = 70; g.stroke(); g.globalAlpha = .5; g.lineWidth = 24; g.stroke(); g.globalAlpha = 1; g.lineWidth = 7; g.strokeStyle = '#effeff'; g.stroke();
    for (const hx of [fr, fl]) if (hx > -200 && hx < 2200) { glowDot(g, hx, wy(hx), 160, '#bff8ff', .9); glowDot(g, hx, wy(hx), 40, '#ffffff', 1); }
    // anamorphic flare + contact bloom
    const k = Math.exp(-u * 5.5); g.globalAlpha = k; g.fillStyle = linear(g, -300, 0, W + 300, 0, [[0, 'rgba(80,230,255,0)'], [.38, 'rgba(80,230,255,.55)'], [.44, 'rgba(255,255,255,1)'], [.5, 'rgba(80,230,255,.55)'], [1, 'rgba(80,230,255,0)']]);
    g.fillRect(-300, CY + sag - 3, W + 600, 6); g.globalAlpha = 1; glowDot(g, MCX, CY + sag, 520, '#7ff4ff', .85 * k); glowDot(g, MCX, CY + sag, 120, '#ffffff', k);
    // shockwave ring along the cable plane
    const ws = E.outC(clamp(u / .55)); if (ws < 1) { g.save(); g.translate(MCX, CY + sag); g.rotate(MAC_A); g.strokeStyle = '#9ff6ff'; g.globalAlpha = .75 * (1 - ws); g.lineWidth = 7 * (1 - ws) + 1; g.beginPath(); g.ellipse(0, 0, 40 + 1500 * ws, (40 + 1500 * ws) * .22, 0, 0, TAU); g.stroke(); g.restore(); }
    // electric arcs crawling from the contact point
    if (u < .5) { const fi = Math.floor(t * 30); g.strokeStyle = '#dffcff'; g.shadowColor = '#5ef2ff'; g.shadowBlur = 16; g.lineWidth = 3; g.globalAlpha = 1 - u / .5;
      for (let a = 0; a < 7; a++) { const ang = hsh(fi * 13 + a) * TAU, L = lerp(90, 330, hsh(fi * 7 + a * 3)); g.beginPath(); g.moveTo(MCX, CY + sag); for (let s = 1; s <= 7; s++) { const f = s / 7; g.lineTo(MCX + Math.cos(ang) * L * f + (hsh(fi + a * 11 + s) - .5) * 60, CY + sag + Math.sin(ang) * L * f * .6 + (hsh(fi + a * 5 + s * 3) - .5) * 60); } g.stroke(); } }
    g.restore();
    sparkBurst(g, t, T_IGN, MCX, CY + sag, 80, 1500, 91);
  }
  // boot + trouser leg
  const fdy = t < T_IGN ? -150 * (1 - E.inC(clamp(t / T_IGN))) : sag - 4;
  g.save(); g.translate(MCX - 10, CY + fdy - 9); g.rotate(MAC_A);
  const fl2 = Math.sin(t * 13) * 6 + Math.sin(t * 21) * 3;
  g.beginPath(); g.moveTo(-178, -168); g.lineTo(-72, -170); g.lineTo(-40 + fl2 * .4, -1200); g.lineTo(-330, -1200); g.closePath(); g.fillStyle = '#070818'; g.fill();
  g.save(); g.beginPath(); g.moveTo(-178, -168); g.lineTo(-330, -1200); g.strokeStyle = RIM; g.shadowColor = RIM; g.shadowBlur = 18; g.lineWidth = 5; g.stroke(); g.restore();
  g.beginPath(); g.moveTo(-182, -170); g.quadraticCurveTo(-120, -186 + fl2, -64, -172); g.lineTo(-60, -150); g.lineTo(-180, -150); g.closePath(); g.fillStyle = '#0c0d24'; g.fill();
  g.beginPath(); g.moveTo(-200, -4); g.lineTo(212, -4); g.quadraticCurveTo(252, -22, 222, -62); g.quadraticCurveTo(168, -108, 40, -120); g.lineTo(-58, -168); g.lineTo(-172, -172); g.quadraticCurveTo(-222, -100, -200, -4); g.closePath();
  g.fillStyle = '#0a0b22'; g.fill(); g.save(); g.clip();
  g.fillStyle = linear(g, 0, -170, 0, 0, [[0, 'rgba(0,0,0,0)'], [.7, 'rgba(0,0,0,0)'], [1, u > 0 ? 'rgba(90,235,255,.55)' : 'rgba(90,120,200,.15)']]); g.fillRect(-260, -180, 520, 180);
  g.restore();
  g.save(); g.strokeStyle = RIM; g.shadowColor = RIM; g.shadowBlur = 14; g.lineWidth = 4; g.beginPath(); g.moveTo(-172, -172); g.quadraticCurveTo(-222, -100, -200, -4); g.stroke();
  g.beginPath(); g.moveTo(-58, -168); g.lineTo(40, -120); g.quadraticCurveTo(168, -108, 222, -62); g.stroke();
  g.strokeStyle = '#ff4fcf'; g.shadowColor = '#ff4fcf'; g.lineWidth = 6; g.beginPath(); g.moveTo(-160, -58); g.quadraticCurveTo(0, -30, 150, -78); g.stroke();
  g.fillStyle = '#1b1d40'; g.shadowBlur = 0; g.fillRect(-200, -26, 420, 22); g.fillStyle = RIM; g.globalAlpha = .9; g.fillRect(-196, -28, 416, 3); g.restore();
  g.restore();
  g.restore();
}
// --- A2 · straight down: the drop (Q1 → Q2) ---
const DOWN_B = (() => { const r = rng(4242), a = []; for (let gx = -9; gx <= 9; gx++) for (let gy = -6; gy <= 6; gy++) { const n = r() < .4 ? 2 : 1; for (let k = 0; k < n; k++) { const w = lerp(16, n === 2 ? 22 : 36, r()), d = lerp(16, 36, r()); const cx = gx * 56 + lerp(-6, 6, r()) + (n === 2 ? (k ? 13 : -13) : 0), cy = gy * 56 + lerp(-6, 6, r());
  a.push({ x0: cx - w / 2, x1: cx + w / 2, y0: cy - d / 2, y1: cy + d / 2, h: lerp(25, 235, Math.pow(r(), 1.5)), c: PAL[Math.floor(r() * PAL.length)], neon: r() < .3 ? PAL[Math.floor(r() * 4)] : null, dens: r() }); } } return a.sort((p, q) => p.h - q.h); })();
const DN_CARS = (() => { const r = rng(515), a = []; for (let i = 0; i < 90; i++) a.push({ ax: r() < .5, line: Math.floor(r() * 19) - 9, off: r() * 1000, v: lerp(30, 70, r()) * (r() < .5 ? 1 : -1), c: r() < .5 ? '#ff4a6a' : '#fff3c4' }); return a; })();
function shotDown(g, t) {
  const u = inv(HA2, HA3, t), Hc = lerp(250, 400, E.ioS(u)), th = .5 + lerp(0, .14, E.outC(u)), f = 900, cxw = 20 + 26 * u, cyw = -14 * u;
  const cs = Math.cos(th), sn = Math.sin(th);
  const pr = (x, y, s) => { const dx = x - cxw, dy = y - cyw; return [W / 2 + (dx * cs - dy * sn) * s, H / 2 + (dx * sn + dy * cs) * s]; };
  g.fillStyle = '#06041a'; g.fillRect(0, 0, W, H);
  const sg = f / Hc;
  // streets + traffic on the ground
  g.save(); g.lineWidth = Math.max(1, 5 * sg); g.strokeStyle = 'rgba(120,60,200,.35)';
  for (let i = -10; i <= 10; i++) { const v = i * 56 + 28; let [a1, b1] = pr(v, -400, sg), [a2, b2] = pr(v, 400, sg); g.beginPath(); g.moveTo(a1, b1); g.lineTo(a2, b2); [a1, b1] = pr(-600, v, sg); [a2, b2] = pr(600, v, sg); g.moveTo(a1, b1); g.lineTo(a2, b2); g.stroke(); }
  g.globalCompositeOperation = 'lighter';
  for (const c of DN_CARS) { const p = ((c.off + c.v * t * 6) % 1000 + 1000) % 1000 - 500, v = c.line * 56 + 28; const [x1, y1] = c.ax ? pr(v, p, sg) : pr(p, v, sg), [x2, y2] = c.ax ? pr(v, p - Math.sign(c.v) * 14, sg) : pr(p - Math.sign(c.v) * 14, v, sg); g.strokeStyle = c.c; g.globalAlpha = .8; g.lineWidth = Math.max(1.2, 2.2 * sg); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  g.restore();
  // buildings, lowest first; walls lean toward the vanishing point
  const shade = ['#191442', '#120f35', '#0c0a27', '#161139'];
  for (const b of DOWN_B) {
    const sr = f / (Hc - b.h), C4 = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]];
    const R = C4.map(([x, y]) => pr(x, y, sr)); if (Math.max(...R.map(p => p[0])) < -60 || Math.min(...R.map(p => p[0])) > W + 60 || Math.max(...R.map(p => p[1])) < -60 || Math.min(...R.map(p => p[1])) > H + 60) continue;
    const G4 = C4.map(([x, y]) => pr(x, y, sg)); const vis = [cyw < b.y0, cxw > b.x1, cyw > b.y1, cxw < b.x0];
    for (let i = 0; i < 4; i++) { if (!vis[i]) continue; const j = (i + 1) % 4;
      g.beginPath(); g.moveTo(R[i][0], R[i][1]); g.lineTo(R[j][0], R[j][1]); g.lineTo(G4[j][0], G4[j][1]); g.lineTo(G4[i][0], G4[i][1]); g.closePath(); g.fillStyle = shade[i]; g.fill();
      const fl = Math.floor(b.h / 7); g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = b.c;
      for (let k = 1; k < fl; k++) { if (hsh(b.x0 * 3 + k * 1.7 + i) > .35 + b.dens * .5) continue; const z = b.h - k * 7, s2 = f / (Hc - z); const [p1x, p1y] = pr(C4[i][0], C4[i][1], s2), [p2x, p2y] = pr(C4[j][0], C4[j][1], s2); const ws = 2.2 * s2;
        g.globalAlpha = .55 * (1 - k / fl * .6); g.lineWidth = ws * .9; g.setLineDash([ws * 1.3, ws]); g.beginPath(); g.moveTo(lerp(p1x, p2x, .08), lerp(p1y, p2y, .08)); g.lineTo(lerp(p1x, p2x, .92), lerp(p1y, p2y, .92)); g.stroke(); }
      g.restore(); g.setLineDash([]);
    }
    g.beginPath(); R.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = '#221b52'; g.fill();
    if (b.neon) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = b.neon; g.shadowColor = b.neon; g.shadowBlur = 12; g.lineWidth = Math.max(1, .9 * sr); g.globalAlpha = .9; g.stroke(); g.restore(); }
    else { g.fillStyle = 'rgba(255,255,255,.05)'; const [qx, qy] = pr((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, sr); g.fillRect(qx - 3 * sr, qy - 2 * sr, 6 * sr, 4 * sr); }
    const [ax, ay] = pr(b.x0 + 3, b.y0 + 3, sr); if (b.h > 150) glowDot(g, ax, ay, 4 * sr, '#ff3355', .5 + .5 * Math.sin(t * 6 + b.x0));
  }
  // depth haze: the street far below glows, the void pulls
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, W / 2, H / 2, 520, [[0, 'rgba(255,60,170,.22)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H); g.restore();
  g.fillStyle = radial(g, W / 2, H / 2, 900, [[0, 'rgba(6,3,24,.45)'], [.5, 'rgba(6,3,24,.12)'], [1, 'rgba(6,3,24,0)']]); g.fillRect(0, 0, W, H);
  zoomBlur(g, W / 2, H / 2, .035 + .05 * E.ioS(u), 6);
  // the wire + walker seen from above (fixed size: the city falls away beneath him)
  const wa = -.42, wob = Math.sin((t - HA2) * 8.5) * .1 + Math.sin(t * 3.1) * .03, ox = W / 2 + 30, oy = H / 2 + 10;
  g.save(); g.translate(ox, oy); g.rotate(wa);
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.strokeStyle = '#4fe9ff'; g.globalAlpha = .18; g.lineWidth = 46; g.beginPath(); g.moveTo(-2000, 0); g.lineTo(2000, 0); g.stroke(); g.globalAlpha = .5; g.lineWidth = 15; g.stroke(); g.globalAlpha = 1; g.lineWidth = 5; g.strokeStyle = '#effeff'; g.stroke(); g.restore();
  g.save(); g.rotate(-wa); g.fillStyle = radial(g, 0, 0, 330, [[0, 'rgba(4,2,16,.6)'], [1, 'rgba(4,2,16,0)']]); g.fillRect(-330, -330, 660, 660); g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = '#4fe9ff'; g.globalAlpha = .5; g.lineWidth = 15; g.beginPath(); g.moveTo(-400, 0); g.lineTo(400, 0); g.stroke(); g.globalAlpha = 1; g.lineWidth = 5; g.strokeStyle = '#effeff'; g.stroke(); g.restore();
  g.scale(1.9, 1.9);
  const st = E.ioS(clamp((t - HA2) / BEAT / .78)), fa = lerp(-34, 34, st);
  g.fillStyle = BODY; g.strokeStyle = RIM; g.lineWidth = 3; g.shadowColor = RIM; g.shadowBlur = 10;
  for (const fx of [fa, -fa]) { g.beginPath(); g.ellipse(fx, 0, 30, 11, 0, 0, TAU); g.fill(); g.stroke(); }
  g.rotate(wob);
  // scarf trailing behind
  g.save(); g.strokeStyle = '#ff4fcf'; g.shadowColor = '#ff4fcf'; g.shadowBlur = 14; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(-6, -4); for (let i = 1; i <= 7; i++) g.lineTo(-6 - i * 22, -4 + Math.sin(t * 12 - i * .9) * i * 3.2); g.stroke(); g.restore();
  // pole across, arms, shoulders, head
  g.save(); g.lineCap = 'round'; g.strokeStyle = '#1a1d38'; g.lineWidth = 9; g.beginPath(); g.moveTo(16, -235); g.lineTo(16, 235); g.stroke(); g.strokeStyle = 'rgba(127,244,255,.65)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(12, -235); g.lineTo(12, 235); g.stroke();
  g.globalCompositeOperation = 'lighter'; for (const [py, c] of [[-235, '#5ef2ff'], [235, '#ff5ad8']]) { g.fillStyle = radial(g, 16, py, 34, [[0, '#fff'], [.3, c], [1, 'rgba(0,0,0,0)']]); g.fillRect(-18, py - 34, 68, 68); } g.restore();
  g.lineWidth = 14; g.lineCap = 'round'; g.strokeStyle = BODY; g.beginPath(); g.moveTo(0, -40); g.lineTo(16, -70); g.moveTo(0, 40); g.lineTo(16, 70); g.stroke();
  g.beginPath(); g.ellipse(0, 0, 26, 50, 0, 0, TAU); g.fill(); g.stroke();
  g.beginPath(); g.arc(5, 0, 24, 0, TAU); g.fillStyle = '#0b0c22'; g.fill(); g.stroke();
  g.shadowBlur = 0; g.fillStyle = 'rgba(160,240,255,.35)'; g.beginPath(); g.arc(-2, -8, 9, 0, TAU); g.fill();
  g.restore();
}
// ---------- main ----------
const SHAKES = [[T_IGN + .05, 12, .5], [HA2, 8, .3], [HA3, 24, .5], [HA4, 6, .3], [EB0, 10, .3], [EB1, 8, .3], [Q(8), 5, .25], [Q(9), 9, .35], [Q(10), 6, .25], [Q(11), 12, .4], [SLIP, 30, .55], [TQ2, 14, .4], [TQ3, 10, .35]];
const FLASHES = [[T_IGN, .3, .22], [HA2, .14, .12], [HA3, .12, .12], [EB1, .15, .15], [Q(11), .18, .2], [SLIP, .5, .25], [TQ2, .22, .2]];
const CHROMA = [[T_IGN, 10, .4], [HA2, 8, .3], [HA3, 15, .45], [EB0, 7, .3], [EB1, 9, .3], [Q(9), 6, .3], [Q(11), 9, .35], [SLIP, 16, .5], [TQ2, 8, .3], [TQ3, 12, .4]];
function scene(g, t) {
  const c = camAt(t); CAM.x = c.x; CAM.y = c.y; CAM.z = c.z;
  const wake = E.outC(inv(T_IGN, T_IGN + 1.3, t)), crash = E.ioS(inv(SLIP, SLIP + .6, t));
  const lit = 1 - .82 * crash, wk = walker(t); const [lx, ly] = P(wk.x, curY(wk.x) - 40);
  const look = [lx, ly];
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H); if (t < T_IGN - .001) return;
  drawSky(g, t, wake, crash); drawMoon(g, t, wake, look);
  // far
  const R = Math.max(0, (t - T_IGN - .04) * 3600);
  drawLayerImg(g, IMG.farB, DD.far, wake);
  drawLayerImg(g, IMG.farL, DD.far, wake * lit * (1 + .25 * beatPulse(t, 6)), 'lighter', [-640 - R, -640 + R]);
  drawEyesLayer(g, L_FAR, DD.far, t, look, 12, 8, .9);
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, 'rgba(60,20,110,0)'], [.6, `rgba(${crash > .5 ? '90,10,40' : '70,25,120'},.38)`], [1, 'rgba(20,6,40,.5)']]); g.fillRect(0, 0, W, H);
  drawTraffic(g, t, wake * (1 - .7 * crash));
  drawLayerImg(g, IMG.midB, DD.mid, wake);
  drawLayerImg(g, IMG.midL, DD.mid, wake * lit * (1 + .3 * beatPulse(t, 6)), 'lighter', [-640 - R * .8, -640 + R * .8]);
  drawBills(g, t, look, lit); drawEyesLayer(g, L_MID, DD.mid, t, look, 16, 10);
  g.fillStyle = 'rgba(30,12,60,.22)'; g.fillRect(0, 0, W, H);
  drawNear(g, t, wake, lit, look);
  drawSigns(g, t);
  drawWire(g, t); drawWalker(g, t);
  if (t > HA3 && t < HA3 + 1.2) { const [fx, fy] = P(wk.x + 6, wireY(wk.x, t)); sparkBurst(g, t, HA3, fx, fy, 46, 820, 66); }
  drawDust(g, t, wake);
  drawQuestion(g, t);
  // red wash after crash
  if (crash > 0) { g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .25 * crash; g.fillStyle = '#ff6a80'; g.fillRect(0, 0, W, H); g.restore(); }
}
let FORCE_A = false;
function renderAt(t) {
  if (window.sceneB && t >= B_0 && t < B_0 + TRD) { FORCE_A = true; renderCore(t); FORCE_A = false; SNX.clearRect(0, 0, W, H); SNX.drawImage(C, 0, 0); }
  renderCore(t);
}
function renderCore(t) {
  const g = X; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  EYE_MUL = 1; const inC = !!window.sceneC && t >= window.C_0 && !FORCE_A, inB = !inC && !!window.sceneB && t >= B_0 && !FORCE_A;
  if (window.finalBlack && t >= window.BLACK0) { window.finalBlack(g, t); g.restore(); return; }
  if (t < HA2) shotMacro(g, t); else if (t < HA3) shotDown(g, t); else if (t >= EB0 && t < EB1) shotEye(g, t); else if (inC) sceneC(g, t); else if (inB) sceneB(g, t); else if (t >= B5) sceneT(g, t); else scene(g, t);
  if (t < B2) drawHUD(g, t, 1490, 64, t < T_IGN ? .75 : (t - T_IGN < .12 ? (hsh(Math.floor(t * 60)) > .4 ? 1 : .3) : 1) * (1 - clamp((t - B2 + .06) / .06)));
  const sk = shakeAt(t, SHAKES); const trem = t > B3 && t < SLIP ? 3.5 * inv(B3, SLIP, t) : 0;
  const ex = sk.x + nz(t * 22, 3) * trem, ey = sk.y + nz(t * 25, 8) * trem;
  const rot = sk.r - (t < B2 ? .07 * E.outC(inv(HA3, HA3 + .1, t)) * (1 - E.ioS(inv(HA3 + .3, HA4 + .25, t))) : 0) + (t > B3 && t < SLIP ? .006 * Math.sin(t * 1.9) * inv(B3, SLIP, t) : 0) - .035 * E.outC(inv(SLIP, SLIP + .25, t)) * (1 - E.ioS(inv(SLIP + .3, TQ2, t)));
  const shM = Math.abs(ex) + Math.abs(ey) + Math.abs(rot) * 500, shS = t >= B5 ? 1 + .04 * clamp(shM / 8) : 1.04;
  if (shM > .3) { TX.clearRect(0, 0, W, H); TX.drawImage(C, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.save(); g.translate(W / 2 + ex, H / 2 + ey); g.rotate(rot); g.scale(shS, shS); g.drawImage(TMP, -W / 2, -H / 2); g.restore(); }
  if (t > EPULL && t < EB1) zoomBlur(g, W / 2, H / 2, .22 * E.inC(inv(EPULL, EB1, t)), 8);
  if (t > SLIP && t < SLIP + .35) zoomBlur(g, W / 2, H / 2, .06 * (1 - inv(SLIP, SLIP + .35, t)), 6);
  if (inC) postC(g, t); else if (inB) postB(g, t); else if (t >= B5) postT(g, t);
  bloom(g, inC ? window.bloomC(t) : inB && window.bloomB ? window.bloomB(t) : .5, 10);
  chroma(g, hits(t, CHROMA), .3);
  flash(g, hits(t, FLASHES), '#bff6ff');
  vignette(g, .62);
  if (t > HA3 && t < B2) vignette(g, .55 * Math.exp(-(t - HA3) * 3), '255,30,70');
  if (inB) overB(g, t); if (inC) overC(g, t);
  grain(g, t, .06);
  // tail fade for preview
  if (t > PREV_END) flash(g, inv(PREV_END, PREV_END + .45, t), '#000');
  g.restore();
}
window.renderAt = renderAt;
(async () => { try { await document.fonts.load(F(900, 100)); await document.fonts.load(F(700, 100)); buildCity(); if (window.buildTitleSection) buildTitleSection(); if (window.buildCaseSection) buildCaseSection(); window.READY = 1; } catch (e) { window.ERR = e.message + '\n' + e.stack; } })();
