// ================= SECTIONS C–F · shared · Q64 → end =================
const C_0 = Q(64), D_0 = Q(96), E_0 = Q(128), F_0 = Q(160), FADE0 = 128.8, BLACK0 = 131.6, END_T = 134.2;
const FULLB = { x: 24, y: 24, w: W - 48, h: H - 48 };
let C_SNAP = false; // true while pre-rendering snapshots (no stamps / tags)
// anchor = dot on the curve (u) + heart rate (b). [t0, t1, u, bpm, ease]
const AK = [
  [C_0 - .02, C_0 + .25, .86, 184], [Q(65), Q(65) + .35, .885, 189, E.outB], [Q(67), Q(67) + .35, .91, 193, E.outB], [Q(69), Q(69) + .35, .935, 197, E.outB],
  [Q(71.5), Q(71.5) + .3, .965, 203, E.outB], [Q(78), Q(79.5), .975, 211, E.inC],
  [Q(80), Q(80) + .62, .13, 68, E.ioC], [Q(81), Q(87.4), .1, 60, E.ioS], [Q(87.5), Q(87.5) + .2, .17, 76, E.outB],
  [Q(88.3), Q(92), .49, 92, E.ioS], [Q(92.3), Q(95.5), .49, 84, E.ioS],
  [Q(96.3), Q(97.8), .74, 128, E.ioC], [Q(98), Q(98) + .35, .86, 166, E.outB], [Q(104), Q(110), .91, 182, E.ioS],
  [Q(127.5), Q(127.9), .86, 158], [Q(134), Q(134) + .5, .76, 138, E.outB], [Q(142), Q(142) + .5, .66, 118, E.outB],
  [Q(147), Q(152), .57, 98, E.ioS], [Q(157), Q(157) + .5, .49, 96, E.outB], [Q(160), Q(168), .49, 78, E.ioS],
];
function anchorAt(t) { let u = U_RED, b = 194; for (const [t0, t1, u1, b1, ez] of AK) { if (t < t0) break; const k = (ez || E.ioC)(inv(t0, t1, t)); u = lerp(u, u1, k); b = lerp(b, b1, k); } return { u, b }; }
const DHITS = [Q(65), Q(67), Q(69), Q(71.5), Q(92), Q(98), Q(134), Q(142), Q(152), Q(157)];
const lastHit = t => { let h = -9; for (const x of DHITS) if (t >= x) h = x; return h; };
// card placement over time → { B, a, kz }
const lerpBox = (A, Bx, k) => ({ x: lerp(A.x, Bx.x, k), y: lerp(A.y, Bx.y, k), w: lerp(A.w, Bx.w, k), h: lerp(A.h, Bx.h, k) });
function cardState(t) {
  let k = 0, a = 1;
  if (t < Q(72)) k = 0;
  else if (t < Q(80.7)) k = E.ioC(inv(Q(72), Q(72) + .6, t));
  else if (t < Q(92)) k = 1 - E.ioC(inv(Q(80.7), Q(80.7) + .5, t));
  else if (t < D_0) k = E.ioC(inv(Q(92.2), Q(92.2) + .6, t));
  else if (t < E_0) { k = 0; a = E.outB(clamp((t - Q(96.4)) / .3)) * (1 - clamp((t - Q(111.6)) / .2)); }
  else if (t < Q(168)) { k = E.ioC(inv(Q(167), Q(168), t)); a = E.outB(clamp((t - Q(128.3)) / .3)); }
  else { k = 0; a = 0; }
  return { B: lerpBox(CARD, FULLB, k), a: clamp(a, 0, 1.2), kz: k };
}
// generalized curve card (B = box). returns mapping
function chartBox(g, t, B, o = {}) {
  const a = o.a ?? 1, kz = clamp((B.h - CARD.h) / (FULLB.h - CARD.h)), ts = lerp(1, 2.3, kz), lw = lerp(1, 2.2, kz);
  const pk = o.pk ?? .49, wd = o.wd ?? .196, zl = pk - .162, zr = pk + .162, u = o.u ?? .49;
  const zc = u < zl ? C_BLUE : u > zr ? C_RED : C_GOLD, hot = u > zr, hk = heartK(t);
  const base = B.y + B.h - 54 * ts, top = B.y + 64 * ts + (o.head || 0) * kz, x0 = B.x + 26 * ts, x1 = B.x + B.w - 26 * ts;
  const cy = v => base - (base - top) * Math.exp(-(((v - pk) / wd) ** 2)), pt = v => [lerp(x0, x1, v), cy(v)];
  const M = { pt, cy, x0, x1, base, top, ts, lw, B, kz, zl, zr, pk };
  if (a <= 0) return M;
  g.save(); g.globalAlpha = clamp(a);
  const bgA = lerp(.78, 1, kz), cool = o.cool || 0;
  const bg = hot ? `rgba(${lerp(46, 10, cool) | 0},${lerp(4, 14, cool) | 0},${lerp(18, 40, cool) | 0},${bgA})` : `rgba(${lerp(8, 8, cool) | 0},${lerp(6, 16, cool) | 0},${lerp(30, 44, cool) | 0},${bgA})`;
  fillRR(g, B.x, B.y, B.w, B.h, lerp(16, 22, kz), bg, 'rgba(200,220,255,.22)', 1.5);
  if (kz > .02) { g.save(); rr(g, B.x, B.y, B.w, B.h, 22); g.clip(); g.globalAlpha *= kz * .5; g.strokeStyle = 'rgba(160,190,255,.07)'; g.lineWidth = 1.5;
    for (let gx = B.x + 60; gx < B.x + B.w; gx += 80) { g.beginPath(); g.moveTo(gx, B.y); g.lineTo(gx, B.y + B.h); g.stroke(); }
    for (let gy = B.y + 60; gy < B.y + B.h; gy += 80) { g.beginPath(); g.moveTo(B.x, gy); g.lineTo(B.x + B.w, gy); g.stroke(); } g.restore(); }
  g.save(); g.strokeStyle = rgbS(zc, .9); g.lineWidth = 3 * lw; g.shadowColor = rgbS(zc, 1); g.shadowBlur = 10;
  const cl = 20 * ts; for (const [cx, cy2, sx, sy] of [[B.x, B.y, 1, 1], [B.x + B.w, B.y, -1, 1], [B.x, B.y + B.h, 1, -1], [B.x + B.w, B.y + B.h, -1, -1]]) { g.beginPath(); g.moveTo(cx, cy2 + sy * cl); g.lineTo(cx, cy2); g.lineTo(cx + sx * cl, cy2); g.stroke(); }
  g.restore();
  // header
  const bpm = Math.round(o.bpm ?? 80), bs = String(bpm), gl = o.glitch && hsh(Math.floor(t * 30)) > .6;
  g.fillStyle = hot ? '#ff3a5c' : u < zl ? '#7cc4ff' : '#ffd36a'; heartPath(g, B.x + 32 * ts, B.y + 32 * ts, 11 * ts * (1 + .4 * hk)); g.fill();
  txt(g, gl ? String(bpm + 80 + Math.floor(hsh(t * 7) * 99)) : bs, B.x + 52 * ts + (gl ? 6 : 0), B.y + 44 * ts, 30 * ts, hot ? '#ff5a74' : '#dff6ff', 900);
  txt(g, 'BPM', B.x + 52 * ts + tw(g, bs, 30 * ts) + 6 * ts, B.y + 44 * ts, 15 * ts, 'rgba(225,238,255,.6)', 700);
  txt(g, '压力 → 表现', B.x + B.w - 22 * ts, B.y + 42 * ts, 19 * ts, 'rgba(225,238,255,.55)', 700, 'right');
  // curve
  g.fillStyle = 'rgba(225,238,255,.18)'; g.fillRect(x0 - 4 * ts, base, x1 - x0 + 8 * ts, 1.5 * lw);
  const segs = [[0, zl, C_BLUE], [zl, zr, C_GOLD], [zr, 1, C_RED]], hl = o.hl || [1, 1, 1];
  segs.forEach(([u0, u1, col], si) => {
    g.beginPath(); for (let i = 0; i <= 48; i++) { const p = pt(lerp(u0, u1, i / 48)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
    const pe = pt(u1), ps = pt(u0); g.save(); g.lineTo(pe[0], base); g.lineTo(ps[0], base); g.closePath(); g.fillStyle = rgbS(col, .16 * hl[si]); g.fill(); g.restore();
    g.beginPath(); for (let i = 0; i <= 48; i++) { const p = pt(lerp(u0, u1, i / 48)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
    g.save(); g.globalAlpha *= lerp(.35, 1, hl[si]); g.strokeStyle = rgbS(col, 1); g.lineWidth = 4 * lw; g.lineCap = 'round'; g.shadowColor = rgbS(col, 1); g.shadowBlur = 8 * lw; g.stroke(); g.restore(); });
  if (!o.noLabels) { const ly = B.y + B.h - 20 * ts;
    txt(g, '懒散', pt(zl / 2)[0], ly, 20 * ts, rgbS(C_BLUE, .95 * hl[0]), 900, 'center'); txt(g, '巅峰', pt(pk)[0], ly, 20 * ts, rgbS(C_GOLD, .95 * hl[1]), 900, 'center'); txt(g, '崩盘', pt((zr + 1) / 2)[0], ly, 20 * ts, rgbS(C_RED, .95 * hl[2]), 900, 'center'); }
  if (o.under) o.under(g, M);
  // dot
  if (!o.noDot) {
    let [dx, dy] = pt(clamp(u, 0, 1)); const tr = (o.trem || 0) * ts; dx += nz(t * 41, 3) * tr; dy += nz(t * 37, 9) * tr;
    const hp = pulse(t, lastHit(t), 4);
    glowDot(g, dx, dy, (34 + 20 * hk * hot) * ts, rgbS(zc, 1), .8);
    g.strokeStyle = rgbS(zc, 1); g.lineWidth = 3 * lw; g.beginPath(); g.arc(dx, dy, (13 + 3 * hk) * ts, 0, TAU); g.stroke();
    if (hp > .01) { g.save(); g.globalAlpha *= hp; g.lineWidth = 3 * lw; g.beginPath(); g.arc(dx, dy, (13 + (1 - hp) * 60) * ts, 0, TAU); g.stroke(); g.restore(); }
    g.fillStyle = '#fff'; g.beginPath(); g.arc(dx, dy, 8 * ts, 0, TAU); g.fill();
    if (!o.noPill) { const pw = 92 * ts, py = dy - 50 * ts, pc = hot ? '#ff2d55' : '#f4f7ff'; fillRR(g, dx - pw / 2, py - 17 * ts, pw, 34 * ts, 17 * ts, pc); g.fillStyle = pc; poly(g, [[dx - 7 * ts, py + 15 * ts], [dx + 7 * ts, py + 15 * ts], [dx, py + 25 * ts]]); g.fill();
      txt(g, '你在这', dx, py + 8 * ts, 20 * ts, hot ? '#fff' : '#14162a', 900, 'center'); }
    M.dot = [dx, dy];
  }
  if (o.over) o.over(g, M);
  g.restore(); return M;
}
// generalized tag (top-left): pill + big name
function tagX(g, u, out, pill, name, pc = '#e0243f', glowC = 'rgba(255,40,70,.8)', ulc = '#ff2d55') {
  if (out >= 1 || u < 0 || C_SNAP) return; g.save(); g.translate(-out * 700, 0); g.globalAlpha = 1 - out * .6;
  g.save(); g.globalAlpha *= clamp(u / .2); g.fillStyle = radial(g, 160, 110, 560, [[0, 'rgba(4,3,14,.6)'], [.55, 'rgba(4,3,14,.32)'], [1, 'rgba(4,3,14,0)']]); g.fillRect(0, 0, 780, 420); g.restore();
  const pk = E.outB(clamp(u / .25)), pw = tw(g, pill, 26) + 46;
  g.save(); g.translate(64, 60); g.scale(Math.max(.001, pk), 1); g.shadowColor = glowC; g.shadowBlur = 18; fillRR(g, 0, 0, pw, 46, 23, pc); g.restore();
  txt(g, pill, 87, 93, 26, '#fff', 900, 'left', clamp((pk - .5) * 3));
  const k = clamp((u - .1) / .3), sh = typed(name, k), glc = k > 0 && k < 1 ? GLY[Math.floor(hsh(Math.floor(u * 40) + 3) * GLY.length)] : '';
  g.save(); g.shadowColor = 'rgba(0,0,0,.85)'; g.shadowBlur = 18;
  if (u < .5) { g.save(); g.globalCompositeOperation = 'lighter'; txt(g, sh, 60, 190, 76, 'rgba(255,40,90,.7)', 900); txt(g, sh, 68, 190, 76, 'rgba(40,230,255,.7)', 900); g.restore(); }
  txt(g, sh, 64, 190, 76, '#ffffff', 900); if (glc) txt(g, glc, 64 + tw(g, sh, 76) + 4, 190, 76, ulc, 900);
  g.restore();
  const ul = E.outC(clamp((u - .28) / .3)) * tw(g, name, 76); g.fillStyle = ulc; g.shadowColor = ulc; g.shadowBlur = 12; g.fillRect(64, 208, ul, 7);
  g.restore();
}
// big in-scene line: slams in (scale + split), optional shake-free glow
function bigLine(g, t, t0, str, x, y, size, col, o = {}) {
  if (t < t0) return; const u = t - t0, k = clamp(u / (o.d || .2)), out = o.t1 != null ? E.inC(clamp((t - o.t1) / (o.od || .25))) : 0; if (out >= 1) return;
  const s = o.soft ? lerp(.92, 1, E.outC(k)) : lerp(1.7, 1, E.outE(k)) * (1 + .04 * Math.exp(-u * 10) * Math.sin(u * 50));
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= (o.soft ? E.outC(k) : clamp(k * 2)) * (1 - out);
  if (!o.soft && u < .3) { const sp = 14 * (1 - u / .3); g.save(); g.globalCompositeOperation = 'lighter'; txt(g, str, -sp, 0, size, 'rgba(255,40,90,.75)', 900, o.al || 'center'); txt(g, str, sp, 0, size, 'rgba(40,230,255,.75)', 900, o.al || 'center'); g.restore(); }
  g.shadowColor = o.glow || 'rgba(0,0,0,.8)'; g.shadowBlur = o.blur ?? 30; txt(g, str, 0, 0, size, col, o.wt || 900, o.al || 'center');
  if (o.glow2) { g.shadowColor = o.glow2; g.shadowBlur = 50; txt(g, str, 0, 0, size, col, o.wt || 900, o.al || 'center'); }
  g.restore();
}
function zoomInto(g, x, y, k) { if (k <= 0) return; TX.clearRect(0, 0, W, H); TX.drawImage(g.canvas, 0, 0); const s = 1 + 14 * k * k * k; g.save(); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.translate(x, y); g.scale(s, s); g.translate(-x, -y); g.drawImage(TMP, 0, 0); g.restore(); }

// ================= SECTION C · Q64 → Q96 =================
// ---- C1a 绝杀罚球打铁 ----
const CROWD_C = (() => { const r = rng(616), a = []; for (let row = 0; row < 4; row++) for (let x = -20; x < 1960; x += 40 + r() * 16) a.push([x, 300 + row * 62 + r() * 10, 13 + row * 2.5 + r() * 3, r()]); return a; })();
const BALL0 = C_0 + .1;
function ballPos(t) {
  if (t < BALL0) return [722, 330];
  if (t < Q(65)) { const v = inv(BALL0, Q(65), t), p = 1 - Math.pow(1 - v, 1.5); return [lerp(722, 1428, p), lerp(330, 392, p) - 4 * 170 * p * (1 - p)]; }
  const p = (t - Q(65)) / BEAT; if (p < 1.05) return [1428 - 420 * p, 392 - 300 * p + 900 * p * p];
  const q = p - 1.05; return [1428 - 441 - 300 * q, 1100 - 400 * q + 900 * q * q];
}
function ball(g, x, y, r, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.shadowColor = 'rgba(255,140,40,.8)'; g.shadowBlur = 24; g.fillStyle = radial(g, -r * .35, -r * .35, r * 1.4, [[0, '#ffb15a'], [.6, '#f06a14'], [1, '#8a2c05']]); g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = 'rgba(30,8,0,.85)'; g.lineWidth = r * .09; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.moveTo(-r, 0); g.lineTo(r, 0); g.moveTo(0, -r); g.lineTo(0, r); g.stroke();
  g.beginPath(); g.arc(-r * 1.25, 0, r * .9, -.75, .75); g.stroke(); g.beginPath(); g.arc(r * 1.25, 0, r * .9, Math.PI - .75, Math.PI + .75); g.stroke(); g.restore(); }
function shotHoop(g, t) {
  const u = t - C_0, z = lerp(1.0, 1.07, E.ioS(clamp(u / (2 * BEAT)))) * (1 + .025 * pulse(t, Q(65), 7));
  g.fillStyle = radial(g, 1100, 300, 1400, [[0, '#2a1450'], [.5, '#120a2c'], [1, '#04030c']]); g.fillRect(0, 0, W, H);
  g.save(); g.translate(1150, 450); g.scale(z, z); g.translate(-1150, -450);
  // crowd
  for (const [x, y, r, s] of CROWD_C) { g.fillStyle = `rgba(${10 + s * 14 | 0},8,${30 + s * 20 | 0},1)`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.beginPath(); rr(g, x - r * 1.5, y + r * .7, r * 3, r * 3, r); g.fill();
    const op = clamp((u - .2 - s * .5) / .1); if (op > 0 && s > .25) redEyes(g, x, y, r * 3, op, .85, .17); }
  g.fillStyle = linear(g, 0, 250, 0, 620, [[0, 'rgba(4,3,12,0)'], [1, 'rgba(8,6,24,.9)']]); g.fillRect(0, 250, W, 380);
  // spotlights
  g.save(); g.globalCompositeOperation = 'lighter'; for (const [sx, ex] of [[640, 700], [1480, 1430]]) { g.fillStyle = linear(g, sx, -50, ex, 1000, [[0, 'rgba(190,210,255,.22)'], [1, 'rgba(190,210,255,0)']]); poly(g, [[sx - 50, -50], [sx + 50, -50], [ex + 260, 1080], [ex - 260, 1080]]); g.fill(); } g.restore();
  // floor
  g.fillStyle = linear(g, 0, 620, 0, H, [[0, '#1a0f2a'], [1, '#2a1630']]); g.fillRect(-200, 620, W + 400, 600);
  g.strokeStyle = 'rgba(94,242,255,.45)'; g.lineWidth = 4; g.shadowColor = CYN; g.shadowBlur = 10; g.beginPath(); g.moveTo(-200, 760); g.lineTo(2200, 700); g.moveTo(560, 1080); g.quadraticCurveTo(820, 780, 1280, 720); g.stroke(); g.shadowBlur = 0;
  // scoreboard
  g.save(); g.translate(960, 22); g.scale(.78, .78); fillRR(g, -300, 0, 600, 160, 18, 'rgba(6,6,20,.92)', 'rgba(127,244,255,.5)', 2);
  txt(g, '主队', -210, 52, 26, '#9fb3d9', 700, 'center'); txt(g, '客队', 210, 52, 26, '#9fb3d9', 700, 'center');
  txt(g, '98', -210, 128, 70, '#ffffff', 900, 'center'); txt(g, '99', 210, 128, 70, '#ffffff', 900, 'center');
  const bl = Math.floor(t * 4) % 2 ? 1 : .35; txt(g, '0.0', 0, 118, 76, `rgba(255,45,85,${bl})`, 900, 'center'); g.restore();
  // hoop
  g.save(); g.translate(1520, 0);
  fillRR(g, -170, 150, 340, 230, 8, 'rgba(160,200,255,.08)', 'rgba(230,240,255,.85)', 5); g.strokeStyle = 'rgba(255,80,60,.9)'; g.lineWidth = 5; g.strokeRect(-62, 262, 124, 92);
  g.fillStyle = '#1a1d36'; g.fillRect(-12, 380, 24, 300);
  const rk = pulse(t, Q(65), 9) * 14 * Math.sin((t - Q(65)) * 60);
  g.strokeStyle = 'rgba(235,240,255,.75)'; g.lineWidth = 2.5; for (let i = 0; i <= 6; i++) { const x0 = -88 + i * 29; g.beginPath(); g.moveTo(x0, 398 + rk * .3); g.lineTo(-44 + i * 15 + nz(t * 6, i) * 4, 500); g.stroke(); }
  g.strokeStyle = '#ff7a2a'; g.shadowColor = '#ff7a2a'; g.shadowBlur = 16; g.lineWidth = 9; g.beginPath(); g.ellipse(0, 396 + rk, 92, 16, 0, 0, TAU); g.stroke(); g.restore();
  // shooter
  g.save(); g.translate(640, 1060); const s = 100;
  const hand = t < BALL0 ? [722 - 640, 330 - 1060] : [lerp(722, 700, E.outC(inv(BALL0, BALL0 + .3, t))) - 640, lerp(330, 360, E.outC(inv(BALL0, BALL0 + .3, t))) + 420 * E.ioC(inv(Q(65.4), Q(66), t)) - 1060];
  silo(g, gg => { standShape(s)(gg); gg.lineCap = 'round'; gg.lineWidth = .36 * s; gg.strokeStyle = gg.fillStyle; gg.beginPath(); gg.moveTo(.78 * s, -5.3 * s); gg.quadraticCurveTo(1.1 * s, -6.4 * s, hand[0], hand[1]); gg.stroke(); gg.beginPath(); gg.arc(hand[0], hand[1], .26 * s, 0, TAU); gg.fill(); }, { rim: '#d8ecff', blur: 20, dx: 0, dy: -4 }); scarfF(g, s, t); g.restore();
  // ball (+ motion trail)
  const bp = ballPos(t); if (t < Q(65)) for (let i = 1; i < 5; i++) { const q = ballPos(t - i * .03); g.globalAlpha = .12 * (5 - i) / 4; ball(g, q[0], q[1], 34, t * 9); g.globalAlpha = 1; }
  ball(g, bp[0], bp[1], 34, t * (t < Q(65) ? 9 : -14));
  g.restore();
  // CLANG
  if (t > Q(65) && !C_SNAP) { const k = popK(t, Q(65), .18), a = 1 - inv(Q(65.6), Q(66), t); g.save(); g.globalAlpha = a; g.translate(1330, 300); g.rotate(-.18); g.scale(k, k);
    g.strokeStyle = '#ffd36a'; g.lineWidth = 7; g.lineCap = 'round'; for (let i = 0; i < 9; i++) { const an = i / 9 * TAU; g.beginPath(); g.moveTo(Math.cos(an) * 90, Math.sin(an) * 60); g.lineTo(Math.cos(an) * 150, Math.sin(an) * 100); g.stroke(); }
    txt(g, '铛！', 0, 40, 110, '#ffd36a', 900, 'center'); g.restore(); }
  if (!C_SNAP) stamp(g, t, Q(65) + .06, 1010, 600, '崩', RED, 150, -.14);
  tagX(g, t - C_0 - .02, E.inC(clamp((t - Q(66)) / .2)), '崩盘连击 · ×1', '绝杀罚球打铁');
}
// ---- C1b 面试卡壳 ----
function shotInterview(g, t) {
  const u = t - Q(66), z = lerp(1.0, 1.08, E.ioS(clamp(u / (2 * BEAT)))) * (1 + .03 * pulse(t, Q(67), 7));
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#1a1c3c'], [.6, '#0c0d24'], [1, '#05050f']]); g.fillRect(0, 0, W, H);
  g.save(); g.translate(960, 520); g.scale(z, z); g.translate(-960, -520);
  // blinds
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(150,180,255,${.05 + .02 * (i % 2)})`; g.fillRect(260, 90 + i * 34, 1400, 16); } g.restore();
  // interviewers
  const xs = [600, 960, 1320];
  xs.forEach((x, i) => { g.save(); g.translate(x, 905 + (i === 1 ? -10 : 0)); silo(g, standShape(86), { rim: '#9fb6ff', blur: 14, dx: 0, dy: -3 }); g.restore();
    redEyes(g, x, 905 - 6.45 * 86 + 4, 86 * 1.5, clamp((u - .1 - i * .06) / .1), .95, .2); });
  // table
  g.fillStyle = linear(g, 0, 640, 0, 760, [[0, '#2a2e58'], [1, '#14162e']]); poly(g, [[220, 650], [1700, 650], [1820, 770], [100, 770]]); g.fill();
  g.fillStyle = 'rgba(180,200,255,.25)'; g.fillRect(220, 648, 1480, 3);
  xs.forEach(x => { fillRR(g, x - 78, 600, 156, 46, 6, '#e9ecf6'); txt(g, '面试官', x, 633, 24, '#22264a', 900, 'center'); });
  g.fillStyle = '#0a0b1c'; g.fillRect(100, 770, 1720, 400);
  // protagonist (back)
  g.save(); g.translate(560, 1180); const s = 170; silo(g, backShape(s, .15), { rim: '#d8ecff', blur: 22 }); scarfB(g, s, t); g.restore();
  g.restore();
  bubble(g, 960, 300, '请介绍一下自己', 50, popK(t, Q(66) + .05, .22), 960, 380);
  if (!C_SNAP) {
    const say = u < .72 ? typed('我、我叫……', inv(Q(66) + .42, Q(66) + .66, t)) : '……';
    if (u > .4) { const k = popK(t, Q(66) + .4, .16); bubble(g, 760, 600, say || ' ', 54, k * (u > .72 ? 1 + .06 * pulse(t, Q(67), 10) : 1), 600, 760, { glow: u > .72 ? 'rgba(255,45,85,.8)' : null }); }
    if (u > .72) { for (let i = 0; i < 3; i++) { const k = popK(t, Q(67) + .04 + i * .07, .2); g.save(); g.globalAlpha = clamp(k); g.translate(420 + i * 110, 520 - i * 40 - 30 * (u - .72)); g.rotate(-.25 + i * .25); g.scale(k, k); txt(g, '?', 0, 0, 120 - i * 18, RED, 900, 'center'); g.restore(); } }
    stamp(g, t, Q(67) + .06, 1260, 470, '崩', RED, 150, .1);
  }
  tagX(g, t - Q(66) - .02, E.inC(clamp((t - Q(68)) / .2)), '崩盘连击 · ×2', '面试卡壳');
}
// ---- C1c 消息改 20 遍 ----
const DRAFTS = ['在吗', '在吗？', '在干嘛呀', '最近怎么样', '哈哈 在吗', '那个……', '你睡了吗', '嗨～', '好久不见！', '在吗在吗', '今天天气不错', '吃了吗', '在？', '嗯……', '突然想到你', '没事 就问问', '你在忙吗', '晚安？', '早！', '在吗'];
const MSG_SEND = Q(69);
function shotMsg(g, t) {
  const u = t - Q(68), z = lerp(1.04, 1.0, E.ioS(clamp(u / (2 * BEAT)))) * (1 + .03 * pulse(t, MSG_SEND, 7));
  g.fillStyle = radial(g, 960, 520, 1200, [[0, '#1b1640'], [1, '#05040e']]); g.fillRect(0, 0, W, H);
  // bokeh
  for (let i = 0; i < 18; i++) glowDot(g, (hsh(i * 3.1) * 2100 + t * 14 * (i % 3)) % 2100 - 90, hsh(i * 7.7) * 1080, 60 + hsh(i) * 80, i % 2 ? '#ff4fcf' : '#5e7bff', .12);
  g.save(); g.translate(960, 540); g.scale(z, z); g.rotate(-.035); g.translate(-960, -540);
  const PX = 700, PY = 40, PWd = 520, PHt = 1060;
  g.save(); g.shadowColor = 'rgba(120,140,255,.5)'; g.shadowBlur = 60; fillRR(g, PX - 14, PY - 14, PWd + 28, PHt + 28, 64, '#0c0e1e'); g.restore();
  fillRR(g, PX - 14, PY - 14, PWd + 28, PHt + 28, 64, null, 'rgba(200,215,255,.35)', 2);
  g.save(); rr(g, PX, PY, PWd, PHt, 52); g.clip(); g.fillStyle = '#eef0f7'; g.fillRect(PX, PY, PWd, PHt);
  g.fillStyle = '#f8f9fd'; g.fillRect(PX, PY, PWd, 150); g.fillStyle = '#dfe3ee'; g.fillRect(PX, PY + 150, PWd, 2);
  g.fillStyle = PINK; g.beginPath(); g.arc(PX + 80, PY + 98, 32, 0, TAU); g.fill(); txt(g, 'TA', PX + 80, PY + 108, 26, '#fff', 900, 'center');
  txt(g, 'TA ♡', PX + 128, PY + 96, 32, '#15172a', 900); const typing = t > MSG_SEND + .1 && t < Q(69.85) && Math.floor(t * 5) % 2 === 0;
  txt(g, typing ? '对方正在输入…' : '在线', PX + 128, PY + 130, 20, typing ? '#2b7bff' : '#8a8fa6', 700);
  txt(g, '昨天 23:41', PX + PWd / 2, PY + 210, 20, '#9aa0b8', 700, 'center');
  fillRR(g, PX + 30, PY + 240, 300, 74, 22, '#ffffff'); txt(g, '今天好累呀～', PX + 56, PY + 288, 30, '#1a1c30', 700);
  // sent bubble
  if (t > MSG_SEND) { const k = E.outB(clamp((t - MSG_SEND) / .28)), y = lerp(PY + 880, PY + 380, E.outC(clamp((t - MSG_SEND) / .28)));
    g.save(); g.globalAlpha = clamp(k * 2); fillRR(g, PX + PWd - 30 - 170, y, 170, 74, 22, '#ff5fc8'); txt(g, '在吗', PX + PWd - 30 - 85, y + 48, 32, '#fff', 900, 'center'); g.restore();
    if (t > Q(69.55)) txt(g, '已读', PX + PWd - 34, PY + 482, 20, '#8a8fa6', 700, 'right'); }
  // edit counter + input
  const n = t < MSG_SEND ? Math.min(20, 1 + Math.floor(19 * Math.pow(clamp(u / (MSG_SEND - Q(68) - .05)), 1.35))) : 20;
  const dr = t < MSG_SEND ? DRAFTS[n - 1] : '', sub = t < MSG_SEND ? (n % 2 ? typed(dr, (t * 9) % 1 * 1.6) : dr) : '';
  fillRR(g, PX, PY + PHt - 190, PWd, 190, 0, '#f8f9fd');
  fillRR(g, PX + 24, PY + PHt - 160, PWd - 140, 76, 38, '#ffffff', '#cfd4e2', 2); txt(g, sub + (Math.floor(t * 6) % 2 ? '|' : ''), PX + 54, PY + PHt - 110, 32, '#15172a', 700);
  g.fillStyle = t > MSG_SEND - .05 && t < MSG_SEND + .12 ? '#ff2d8a' : '#2b7bff'; g.beginPath(); g.arc(PX + PWd - 64, PY + PHt - 122, 38, 0, TAU); g.fill();
  g.fillStyle = '#fff'; poly(g, [[PX + PWd - 82, PY + PHt - 140], [PX + PWd - 44, PY + PHt - 122], [PX + PWd - 82, PY + PHt - 104], [PX + PWd - 74, PY + PHt - 122]]); g.fill();
  g.restore();
  // counter chip (outside the screen, big)
  const ck = popK(t, Q(68) + .05, .2), bump = 1 + .12 * pulse(t, Q(68) + .05 + Math.floor((u - .05) * 30) / 30, 30);
  g.save(); g.translate(PX + PWd + 120, PY + 640); g.rotate(.06); g.scale(ck * bump, ck * bump); fillRR(g, -10, -62, 330, 96, 48, 'rgba(224,36,63,.95)'); txt(g, '已修改 ' + n + ' 次', 155, 4, 44, '#fff', 900, 'center'); g.restore();
  g.restore();
  // crossed-out draft history (left)
  if (t < MSG_SEND + .5) for (let k = 0; k < n - 1; k++) { const age = n - 1 - k, y = 930 - age * 58, a = clamp(1 - age / 11) * (1 - clamp((t - MSG_SEND) / .3)); if (a <= 0 || y < 260) continue;
    const str = DRAFTS[k], w = tw(g, str, 40); g.save(); g.globalAlpha = a; txt(g, str, 560, y, 40, 'rgba(230,235,255,.8)', 900, 'right'); g.fillStyle = '#ff2d55'; g.fillRect(560 - w - 6, y - 14, w + 12, 5); g.restore(); }
  // thumb
  g.save(); g.translate(1330 + 20 * Math.sin(t * 17) * (t < MSG_SEND ? 1 : 0), 1060); g.rotate(-.5); silo(g, gg => { gg.beginPath(); gg.ellipse(0, 0, 70, 150, 0, 0, TAU); gg.fill(); }, { rim: '#c6d2ff', blur: 18 }); g.restore();
  if (!C_SNAP) stamp(g, t, MSG_SEND + .1, 1420, 330, '崩', RED, 150, -.1);
  tagX(g, t - Q(68) - .02, E.inC(clamp((t - Q(70)) / .2)), '崩盘连击 · ×3', '消息改了 20 遍');
}
// ---- C1d triptych ----
let SNAPS_C = [];
const TRIP = [[Q(70), '绝杀打铁', 1080], [Q(70.5), '面试卡壳', 900], [Q(71), '消息改20遍', 960]];
function shotTrip(g, t) {
  g.fillStyle = radial(g, 960, 540, 1200, [[0, '#3a0818'], [1, '#08020a']]); g.fillRect(0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 36; i++) { const an = i / 36 * TAU + t * .2; g.strokeStyle = 'rgba(255,45,85,.06)'; g.lineWidth = 30; g.beginPath(); g.moveTo(960, 540); g.lineTo(960 + Math.cos(an) * 1400, 540 + Math.sin(an) * 1400); g.stroke(); } g.restore();
  const pw = 430, ph = 600, gap = 40, x0 = (W - 3 * pw - 2 * gap) / 2 - 40, y0 = 118, all = pulse(t, Q(71.5), 6);
  TRIP.forEach(([t0, lab, cx], i) => { if (t < t0) return; const u = t - t0, k = E.outE(clamp(u / .18)), s = lerp(1.35, 1, k) * (1 + .05 * all), r = lerp(i === 1 ? .12 : -.12, [-.03, .015, .035][i], k);
    const px = x0 + i * (pw + gap) + pw / 2, py = y0 + ph / 2; g.save(); g.translate(px, py); g.rotate(r); g.scale(s, s); g.globalAlpha = clamp(k * 2);
    g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 40; g.fillStyle = '#f4f6ff'; g.fillRect(-pw / 2 - 12, -ph / 2 - 12, pw + 24, ph + 90); g.shadowBlur = 0;
    const sw = 1080 * pw / ph; g.drawImage(SNAPS_C[i], cx - sw / 2, 0, sw, 1080, -pw / 2, -ph / 2, pw, ph);
    g.fillStyle = `rgba(255,30,70,${.18 + .2 * all})`; g.fillRect(-pw / 2, -ph / 2, pw, ph);
    txt(g, lab, 0, ph / 2 + 56, 36, '#16182c', 900, 'center'); g.restore();
    stamp(g, t, t0 + .08, px + (i - 1) * 10, py + 30, '崩', RED, 100 * (1 + .1 * all), [-.18, .12, -.08][i]); });
  if (t > Q(71.5)) { const k = popK(t, Q(71.5), .2); g.save(); g.translate(880, 940); g.scale(k, k); txt(g, '连崩 ×3', 0, 30, 92, '#ffffff', 900, 'center'); g.restore(); }
}
// ---- C2 full chart (behind = frozen triptych) ----
const CHIPS = ['考场失忆', '领导站你身后', '做图毁于微操', '重要汇报哑火', '绝杀罚球打铁', '面试卡壳', '消息改了20遍'];
function c2Overlay(g, t, M) {
  if (t < Q(72.6) || t > Q(81)) return; const fa = 1 - clamp((t - Q(80.05)) / .3); g.save(); g.globalAlpha *= M.kz;
  // hazard stripes in red zone
  const hz = sstep(Q(77.9), Q(78.2), t) * fa; if (hz > 0) { g.save(); g.beginPath(); for (let i = 0; i <= 40; i++) { const p = M.pt(lerp(M.zr, 1, i / 40)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } g.lineTo(M.x1, M.base); g.lineTo(M.pt(M.zr)[0], M.base); g.closePath(); g.clip();
    g.globalAlpha *= hz * (.35 + .25 * (Math.floor(t * 6) % 2)); g.fillStyle = '#ff2d55'; for (let x = M.pt(M.zr)[0] - 600 + (t * 120) % 80; x < M.x1 + 80; x += 80) { poly(g, [[x, M.base], [x + 40, M.base], [x + 640, M.base - 600], [x + 600, M.base - 600]]); g.fill(); } g.restore(); }
  // chip pile on the dot
  const [dx, dy] = M.dot || M.pt(.965), scat = t > Q(80) ? t - Q(80) : 0;
  CHIPS.forEach((c, i) => { const t0 = Q(72.75) + i * BEAT * .5; if (t < t0) return; const u = t - t0, k = clamp(u / .16), fall = E.outB(k);
    let x = dx + [-30, 26, -16, 30, -36, 12, -6][i] * M.ts * .7, y = dy - 80 * M.ts - i * 25 * M.ts * 1.04; const tr = (t > Q(78) ? 6 : 2) * fa;
    x += nz(t * 30, i) * tr; y += nz(t * 27, i + 5) * tr - (1 - fall) * 300;
    if (scat > 0) { const vx = (hsh(i * 3) - .2) * 1500, vy = -600 - hsh(i * 7) * 600; x += vx * scat; y += vy * scat + 2600 * scat * scat; }
    const w = tw(g, c, 13 * M.ts) + 30 * M.ts * .9; g.save(); g.translate(x, y); g.rotate(([-.06, .05, -.03, .07, -.05, .03, -.02][i]) + scat * (hsh(i) - .5) * 9); g.globalAlpha *= clamp(k * 3);
    fillRR(g, -w / 2, -18 * M.ts * .9, w, 36 * M.ts * .9, 9 * M.ts, 'rgba(70,6,22,.95)', '#ff2d55', 3); txt(g, c, 0, 5 * M.ts, 13 * M.ts, '#ffd6de', 900, 'center'); g.restore(); });
  // overload tag
  if (t > Q(78) && fa > 0) { const bl = Math.floor(t * 8) % 2 ? 1 : .5; g.save(); g.globalAlpha *= bl * fa; const ox = M.pt(.895)[0], oy = M.base - 34 * M.ts, ow = tw(g, 'OVERLOAD', 16 * M.ts) + 26 * M.ts; fillRR(g, ox - ow / 2, oy - 22 * M.ts, ow, 32 * M.ts, 8 * M.ts, 'rgba(30,0,10,.92)', '#ff2d55', 3); txt(g, 'OVERLOAD', ox, oy, 16 * M.ts, '#ff2d55', 900, 'center'); g.restore(); }
  g.restore();
  g.save(); g.globalAlpha *= M.kz;
  bigLine(g, t, Q(76), '不是你不行，', 960, 210, 92, '#ffffff', { t1: Q(80), od: .2 });
  bigLine(g, t, Q(77), '是压力过载', 960, 360, 136, '#ff2d55', { t1: Q(80), od: .2, glow2: 'rgba(255,45,85,.9)' });
  g.restore();
}
// ---- C3 沙发摸鱼 ----
const CAL = [[Q(81), 30], [Q(83), 29], [Q(84), 26], [Q(85), 21], [Q(85.5), 17], [Q(86), 12], [Q(86.5), 7], [Q(87), 3], [Q(87.25), 2], [Q(87.5), 1]];
const calIdx = t => { let i = 0; CAL.forEach((c, k) => { if (t >= c[0]) i = k; }); return i; };
const CALX = 250, CALY = 150, CALW = 330, CALH = 380;
function calPage(g, n, x, y, w, h, red) {
  fillRR(g, x, y, w, h, 14, red ? '#fff1f3' : '#f1f3fa'); g.save(); rr(g, x, y, w, h, 14); g.clip(); g.fillStyle = red ? '#ff2d55' : '#2b6cff'; g.fillRect(x, y, w, 86); g.restore();
  txt(g, red ? '明天截止！' : '离截止还有', x + w / 2, y + 58, 34, '#fff', 900, 'center');
  txt(g, String(n), x + w / 2 - (n >= 10 ? 26 : 30), y + 270, 180, red ? '#ff2d55' : '#14182e', 900, 'center'); txt(g, '天', x + w / 2 + (n >= 10 ? 104 : 62), y + 268, 44, red ? '#ff2d55' : '#48507a', 900, 'center');
}
function sofaFigure(g, t) {
  const br = Math.sin(t * 2.2) * 3, k = clamp((t - Q(87.5)) / .12) * (1 - clamp((t - Q(87.5) - .4) / .3)) * 30;
  const sh = gg => { gg.beginPath(); gg.ellipse(735, 600 - k, 50, 54, -.3, 0, TAU); gg.fill();
    gg.beginPath(); rr(gg, 760, 600 + br * .3 - k * .6, 320, 100 + br, 46); gg.fill();
    gg.lineCap = 'round'; gg.lineWidth = 62; gg.beginPath(); gg.moveTo(1060, 660); gg.lineTo(1170, 590); gg.lineTo(1290, 670); gg.stroke();
    gg.lineWidth = 30; gg.beginPath(); gg.moveTo(830, 630); gg.lineTo(800, 520 - k); gg.stroke(); };
  silo(g, sh, { rim: '#9ac4ff', blur: 20, dx: 0, dy: -4 });
  g.save(); g.shadowColor = PINK; g.shadowBlur = 14; g.fillStyle = PINK; g.beginPath(); rr(g, 762, 586 - k * .6, 40, 74, 16); g.fill(); g.beginPath(); g.moveTo(790, 650); g.quadraticCurveTo(830 + Math.sin(t * 3) * 6, 700, 860, 724); g.lineTo(880, 706); g.quadraticCurveTo(840, 680, 806, 640); g.fill(); g.restore();
  // phone
  g.save(); g.translate(790, 470 - k); g.rotate(.5); fillRR(g, -34, -50, 68, 100, 10, '#0b0d1c', 'rgba(200,220,255,.5)', 2);
  const sc = Math.floor((t - Q(81)) / BEAT * 2); fillRR(g, -28, -44, 56, 88, 6, ['#5ef2ff', '#ff6ad5', '#ffd36a', '#7c8cff'][((sc % 4) + 4) % 4]); g.restore();
  glowDot(g, 790, 480 - k, 240, 'rgba(120,220,255,.55)', .55 + .25 * pulse(t, Q(81) + Math.floor((t - Q(81)) / (BEAT / 2)) * BEAT / 2, 8));
}
function shotSofa(g, t) {
  const i = calIdx(t), n = CAL[i][1], day = i % 2 === 1, dk = clamp((t - CAL[i][0]) / .15), red = n === 1;
  const sky = day ? mixHex('#0a1440', '#69a8ff', dk) : mixHex('#69a8ff', '#0a1440', i === 0 ? 1 : dk);
  const z = lerp(1.0, 1.06, E.ioS(inv(Q(80), Q(88), t)));
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#0d1838'], [.7, '#08102a'], [1, '#04060f']]); g.fillRect(0, 0, W, H);
  g.save(); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
  // window (day/night cycles with each page)
  g.save(); fillRR(g, 860, 110, 380, 330, 10, sky); g.save(); rr(g, 860, 110, 380, 330, 10); g.clip();
  if (day) glowDot(g, 1140, 190, 160, '#fff6c8', .9 * dk); else { g.fillStyle = '#dfe8ff'; g.beginPath(); g.arc(1150, 190, 34, 0, TAU); g.fill(); g.fillStyle = sky; g.beginPath(); g.arc(1166, 180, 30, 0, TAU); g.fill(); }
  g.fillStyle = day ? 'rgba(40,70,140,.5)' : 'rgba(10,14,40,.95)'; for (let k = 0; k < 9; k++) g.fillRect(860 + k * 44, 330 - hsh(k) * 90, 36, 200); g.restore();
  g.strokeStyle = '#1a2246'; g.lineWidth = 14; g.strokeRect(860, 110, 380, 330); g.beginPath(); g.moveTo(1050, 110); g.lineTo(1050, 440); g.moveTo(860, 275); g.lineTo(1240, 275); g.stroke(); g.restore();
  if (day) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .18 * dk; g.fillStyle = linear(g, 1050, 440, 900, 1080, [[0, '#9cc8ff'], [1, 'rgba(0,0,0,0)']]); poly(g, [[860, 440], [1240, 440], [1100, 1080], [520, 1080]]); g.fill(); g.restore(); }
  // calendar + flying pages
  g.fillStyle = '#1a2246'; g.fillRect(CALX + 40, CALY - 30, CALW - 80, 22); for (let k = 0; k < 6; k++) { g.fillStyle = '#c6cde6'; g.beginPath(); g.arc(CALX + 60 + k * 42, CALY - 2, 7, 0, TAU); g.fill(); }
  g.save(); g.shadowColor = red ? 'rgba(255,45,85,.9)' : 'rgba(0,0,0,.5)'; g.shadowBlur = red ? 50 + 30 * Math.sin(t * 20) : 24; calPage(g, n, CALX, CALY, CALW, CALH, red); g.restore();
  for (let k = 1; k <= i; k++) { const tf = CAL[k][0], u = t - tf; if (u < 0 || u > 1.4) continue; const r = rng(k * 13), vx = 900 + r() * 700, vy = -250 - r() * 300, sp = (r() - .3) * 7;
    g.save(); g.translate(CALX + CALW / 2 + vx * u, CALY + CALH / 2 + vy * u + 700 * u * u); g.rotate(sp * u); const fc = Math.cos(u * 6 + r() * 3); g.scale(1 - u * .35, Math.max(.06, Math.abs(fc)) * (1 - u * .35)); g.globalAlpha = 1 - clamp((u - 1) / .4);
    if (fc >= 0) calPage(g, CAL[k - 1][1], -CALW / 2, -CALH / 2, CALW, CALH, false); else { fillRR(g, -CALW / 2, -CALH / 2, CALW, CALH, 18, '#d9deef'); g.fillStyle = 'rgba(40,60,120,.18)'; for (let j = 0; j < 5; j++) g.fillRect(-CALW / 2 + 30, -CALH / 2 + 60 + j * 38, CALW - 60, 4); } g.restore(); }
  // sofa
  g.fillStyle = '#1c1a44'; fillRR(g, 560, 560, 820, 200, 60, '#22205a'); fillRR(g, 520, 640, 900, 220, 40, '#1b1948'); fillRR(g, 500, 600, 130, 280, 50, '#262463'); fillRR(g, 1310, 600, 130, 280, 50, '#262463');
  g.fillStyle = '#100f2c'; g.fillRect(560, 860, 30, 50); g.fillRect(1350, 860, 30, 50);
  g.strokeStyle = 'rgba(150,180,255,.25)'; g.lineWidth = 3; rr(g, 560, 560, 820, 200, 60); g.stroke();
  sofaFigure(g, t);
  // floating dopamine bits from phone
  for (let k = 0; k < 10; k++) { const t0 = Q(81) + k * BEAT * .5, u = t - t0; if (u < 0 || u > 1.6) continue; const x = 800 + (hsh(k) - .5) * 160 + u * 40 * (k % 2 ? 1 : -1), y = 440 - u * 170;
    g.save(); g.globalAlpha = (1 - u / 1.6) * clamp(u / .1); if (k % 3 === 0) { g.fillStyle = PINK; heartPath(g, x, y, 18); g.fill(); } else txt(g, k % 3 === 1 ? '+1' : '▶', x, y, 28, k % 3 === 1 ? '#ffd36a' : '#5ef2ff', 900, 'center'); g.restore(); }
  g.restore();
  // caption + fish
  bigLine(g, t, Q(82), '压力太小 → 摸鱼', 1560, 250, 74, '#7cc4ff', { glow2: 'rgba(70,165,255,.8)', t1: Q(87.5), od: .2 });
  if (t > Q(82.2) && t < Q(88)) { const fx = 1360 + ((t - Q(82.2)) * 160) % 420, fy = 360 + Math.sin(t * 4) * 16, wg = Math.sin(t * 14) * .25; g.save(); g.globalAlpha = clamp((t - Q(82.2)) / .3) * (1 - clamp((t - Q(87.5)) / .2)); g.translate(fx, fy); g.strokeStyle = '#7cc4ff'; g.shadowColor = '#46a5ff'; g.shadowBlur = 14; g.lineWidth = 5; g.lineJoin = 'round';
    g.beginPath(); g.ellipse(0, 0, 46, 24, 0, 0, TAU); g.stroke(); g.save(); g.rotate(wg); poly(g, [[-44, 0], [-80, -24], [-80, 24]]); g.stroke(); g.restore(); g.fillStyle = '#7cc4ff'; g.beginPath(); g.arc(22, -6, 5, 0, TAU); g.fill(); g.restore(); }
  if (red) { const a = .25 * (Math.floor(t * 10) % 2); flash(g, a, '#ff2d55'); }
}
// ---- C4 截止前一晚 ----
const CHECK = ['第一章', '第二章', '数据图表', '结论', '参考文献'], CHK_T = [Q(89), Q(89.5), Q(90), Q(90.5), Q(91)];
function shotNight(g, t) {
  const u = t - Q(88), z = lerp(1.08, 1.0, E.outC(clamp(u / 1.2))) * (1 + .02 * beatPulse(t, 7));
  g.fillStyle = radial(g, 1180, 420, 1300, [[0, '#2a1a10'], [.5, '#120c14'], [1, '#040308']]); g.fillRect(0, 0, W, H);
  g.save(); g.translate(1000, 560); g.scale(z, z); g.translate(-1000, -560);
  // lamp cone
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linear(g, 560, 100, 760, 800, [[0, 'rgba(255,200,120,.35)'], [1, 'rgba(255,200,120,0)']]); poly(g, [[520, 140], [600, 140], [980, 860], [220, 860]]); g.fill(); g.restore();
  g.save(); g.strokeStyle = '#2a2440'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(420, 860); g.lineTo(470, 420); g.lineTo(560, 150); g.stroke(); fillRR(g, 500, 110, 130, 60, 26, '#3a3050'); g.restore(); glowDot(g, 560, 160, 120, '#ffd59a', .9);
  // desk
  g.fillStyle = linear(g, 0, 840, 0, H, [[0, '#2c2030'], [1, '#120c16']]); g.fillRect(0, 850, W, 240); g.fillStyle = 'rgba(255,200,140,.25)'; g.fillRect(0, 848, W, 3);
  // laptop screen
  const SX0 = 900, SY0 = 330, SW = 620, SH = 400, prog = clamp(E.ioS(inv(Q(88.3), Q(91.6), t)));
  g.save(); g.shadowColor = 'rgba(255,210,140,.6)'; g.shadowBlur = 50; fillRR(g, SX0 - 14, SY0 - 14, SW + 28, SH + 28, 16, '#151320'); g.restore();
  g.save(); rr(g, SX0, SY0, SW, SH, 8); g.clip(); g.fillStyle = '#f6f2ea'; g.fillRect(SX0, SY0, SW, SH);
  const off = (u * 260) % 44; for (let k = 0; k < 12; k++) { const yy = SY0 + 40 + k * 44 - off, w = 120 + hsh(k + Math.floor(u * 260 / 44)) * 420; g.fillStyle = k === 0 ? '#2b2b3a' : '#b9b3a8'; rr(g, SX0 + 36, yy, w, 14, 7); g.fill(); }
  g.fillStyle = '#e8e2d6'; g.fillRect(SX0, SY0 + SH - 56, SW, 56); fillRR(g, SX0 + 24, SY0 + SH - 36, SW - 180, 16, 8, '#d0c8ba'); fillRR(g, SX0 + 24, SY0 + SH - 36, (SW - 180) * prog, 16, 8, '#ffb43a');
  txt(g, Math.round(prog * 100) + '%', SX0 + SW - 24, SY0 + SH - 20, 30, '#2b2b3a', 900, 'right'); g.restore();
  g.fillStyle = '#1b1828'; poly(g, [[SX0 - 60, 860], [SX0 + SW + 60, 860], [SX0 + SW + 20, 820], [SX0 - 20, 820]]); g.fill();
  // protagonist (back), typing
  g.save(); g.translate(860, 1130); const s = 150, ty = Math.sin(t * 46) * 3; g.translate(0, ty); silo(g, backShape(s, -.1, 1.02), { rim: '#ffd9a8', blur: 22 }); scarfB(g, s, t * 3); g.restore();
  for (const sd of [-1, 1]) { g.save(); g.translate(860 + sd * 150, 900 + Math.sin(t * 50 + sd) * 6); silo(g, gg => { gg.beginPath(); gg.ellipse(0, 0, 50, 26, sd * .3, 0, TAU); gg.fill(); }, { rim: '#ffd9a8', blur: 12 }); g.restore(); }
  // typing sparks
  for (let k = 0; k < 14; k++) { const ph = (t * 2.2 + k / 14) % 1, x = 860 + (hsh(k) - .5) * 360, y = 880 - ph * 260; glowDot(g, x, y, 14, '#ffc440', .8 * (1 - ph)); }
  g.restore();
  // clock pill
  const mins = Math.floor(lerp(23 * 60, 29 * 60 + 58, E.ioS(inv(Q(88.2), Q(91.8), t)))), hh = Math.floor(mins / 60) % 24, mm = mins % 60;
  g.save(); g.globalAlpha = popK(t, Q(88) + .05, .2); fillRR(g, 64, 60, 290, 46, 23, '#e0243f'); txt(g, '截止前一晚', 87 + 122, 93, 26, '#fff', 900, 'center');
  txt(g, String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'), 64, 220, 120, '#ffffff', 900); g.restore();
  // efficiency meter
  const ef = clamp(E.ioS(inv(Q(88.5), Q(91), t)) * 1.18, 0, 1.18), boom = t > Q(91);
  g.save(); g.translate(64, 300); txt(g, '效率', 0, 40, 36, '#ffd36a', 900); fillRR(g, 90, 12, 380, 34, 17, 'rgba(255,255,255,.1)', 'rgba(255,211,106,.5)', 2);
  g.save(); rr(g, 90, 12, 380, 34, 17); g.clip(); g.fillStyle = linear(g, 90, 0, 470, 0, [[0, '#ffb43a'], [1, '#ff4fcf']]); g.fillRect(90, 12, 380 * Math.min(1, ef), 34); g.restore();
  if (boom) { const k = popK(t, Q(91), .2); g.save(); g.translate(500, 30); g.rotate(-.08); g.scale(k, k); fillRR(g, -6, -40, 210, 80, 18, '#ffc440'); txt(g, '爆表！', 99, 16, 50, '#2a1400', 900, 'center'); g.restore(); }
  g.restore();
  // checklist holo
  g.save(); g.translate(1560, 150); fillRR(g, 0, 0, 300, 380, 18, 'rgba(20,14,8,.7)', 'rgba(255,196,64,.45)', 2); txt(g, 'TO-DO', 26, 50, 28, '#ffd36a', 900);
  CHECK.forEach((c, k) => { const y = 100 + k * 58, on = t >= CHK_T[k]; fillRR(g, 26, y - 26, 36, 36, 8, on ? '#ffc440' : 'rgba(255,255,255,.08)', 'rgba(255,211,106,.6)', 2);
    if (on) { const pk = popK(t, CHK_T[k], .18); g.save(); g.translate(44, y - 8); g.scale(pk, pk); checkIcon(g, 0, 0, 12, '#2a1400', 5); g.restore(); if (t - CHK_T[k] < .4) glowDot(g, 44, y - 8, 70 * (1 - (t - CHK_T[k]) / .4), '#ffc440', .9); }
    txt(g, c, 80, y + 2, 30, on ? '#fff1d0' : 'rgba(255,240,210,.5)', 900); if (on) { g.fillStyle = 'rgba(255,211,106,.7)'; g.fillRect(80, y - 8, tw(g, c, 30) * clamp((t - CHK_T[k]) / .15), 3); } });
  g.restore();
}
function c4Overlay(g, t, M) {
  if (t < Q(92.6) || t >= D_0) return; g.save(); g.globalAlpha *= M.kz;
  bigLine(g, t, Q(93), '最好的状态，在中间', 960, 250, 116, '#ffd36a', { glow2: 'rgba(255,196,64,.85)' });
  const [px, py] = M.pt(M.pk);
  for (const [t0, sd, lab, col] of [[Q(94), -1, '太松', C_BLUE], [Q(94.5), 1, '太紧', C_RED]]) { if (t < t0) continue; const k = E.outB(clamp((t - t0) / .3)), x = px + sd * lerp(820, 330, k), y = py + 250;
    g.save(); g.globalAlpha *= clamp(k * 2); g.strokeStyle = rgbS(col, 1); g.fillStyle = rgbS(col, 1); g.lineWidth = 8; g.lineCap = 'round'; g.shadowColor = rgbS(col, 1); g.shadowBlur = 16;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x - sd * 150, y); g.stroke(); poly(g, [[x - sd * 176, y], [x - sd * 140, y - 22], [x - sd * 140, y + 22]]); g.fill();
    txt(g, lab, x + sd * 70, y + 20, 54, rgbS(col, 1), 900, 'center'); g.restore(); }
  if (t > Q(95)) { const p = pulse(t, Q(95), 2.5); glowDot(g, px, py, 260 + 200 * (1 - p), '#ffd36a', .6 * p + .2); }
  g.restore();
}
// ---- C dispatch ----
function sceneCsec(g, t) {
  if (t < Q(66)) shotHoop(g, t); else if (t < Q(68)) shotInterview(g, t); else if (t < Q(70)) shotMsg(g, t);
  else if (t < Q(80)) shotTrip(g, t < Q(73) ? t : Q(73));
  else if (t < Q(88)) shotSofa(g, t); else shotNight(g, t);
}
const CUTS_C = [Q(66), Q(68), Q(70), Q(88)];
function buildC() {
  C_SNAP = true; SNAPS_C = [[shotHoop, Q(65.3)], [shotInterview, Q(67.3)], [shotMsg, Q(69.4)]].map(([f, tt]) => { const c = mk(W, H), cg = c.getContext('2d'); f(cg, tt); return c; }); C_SNAP = false;
}
SHAKES.push([C_0, 10, .3], [Q(65), 22, .45], [Q(66), 8, .3], [Q(67), 18, .4], [Q(68), 8, .3], [Q(69), 16, .4], [Q(70), 12, .3], [Q(70.5), 12, .3], [Q(71), 12, .3], [Q(71.5), 22, .5], [Q(76), 6, .3], [Q(77), 20, .45], [Q(79), 8, .9], [Q(80), 10, .3], [Q(87.5), 18, .4], [Q(88), 10, .3], [Q(91), 10, .3], [Q(92), 8, .3]);
FLASHES.push([C_0, .25, .15], [Q(65), .25, .18], [Q(67), .2, .15], [Q(69), .2, .15], [Q(71.5), .2, .15], [Q(77), .22, .18], [Q(88), .3, .2]);
CHROMA.push([C_0, 12, .35], [Q(65), 16, .45], [Q(66), 8, .3], [Q(67), 14, .4], [Q(68), 8, .3], [Q(69), 12, .4], [Q(70), 10, .3], [Q(71.5), 16, .45], [Q(77), 16, .45], [Q(79), 10, .6], [Q(80), 12, .35], [Q(87.5), 12, .35], [Q(88), 10, .3]);
