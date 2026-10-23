// ================= CASE 01 · 考场失忆 (Q32 → Q40) =================
const HF = 120, HZ = 420, HCY = 6.2;
const prj = (X, Y, Z) => [960 + X * HF / Z, HZ + (HCY - Y) * HF / Z];
const quad3 = (g, pts) => poly(g, pts.map(p => prj(p[0], p[1], p[2])));
const ROWS = [4.4, 3.5, 2.6, 1.7], COLS = [-7.6, -2.6, 2.6, 7.6];
const LIGHTS = []; for (const xr of [[-8, -5], [-1.5, 1.5], [5, 8]]) for (const zr of [[1.5, 2.0], [2.75, 3.25], [4.0, 4.45]]) LIGHTS.push([xr, zr]);
let HALL = null;
function buildHall() {
  const c = mk(W, H), g = c.getContext('2d'), ZN = .9, ZF = 5.5, XR = 13, YC = 11.2;
  g.fillStyle = '#05060f'; g.fillRect(0, 0, W, H);
  quad3(g, [[-XR, 0, ZN], [XR, 0, ZN], [XR, 0, ZF], [-XR, 0, ZF]]); g.fillStyle = linear(g, 0, 540, 0, H, [[0, '#181d44'], [1, '#090b20']]); g.fill();
  quad3(g, [[-XR, YC, ZN], [XR, YC, ZN], [XR, YC, ZF], [-XR, YC, ZF]]); g.fillStyle = linear(g, 0, 0, 0, 320, [[0, '#05061a'], [1, '#121638']]); g.fill();
  quad3(g, [[-XR, 0, ZN], [-XR, 0, ZF], [-XR, YC, ZF], [-XR, YC, ZN]]); g.fillStyle = linear(g, 0, 0, 680, 0, [[0, '#0a0c24'], [1, '#171c44']]); g.fill();
  quad3(g, [[XR, 0, ZN], [XR, 0, ZF], [XR, YC, ZF], [XR, YC, ZN]]); g.fillStyle = linear(g, W, 0, 1240, 0, [[0, '#080a1e'], [1, '#141938']]); g.fill();
  quad3(g, [[-XR, 0, ZF], [XR, 0, ZF], [XR, YC, ZF], [-XR, YC, ZF]]); g.fillStyle = linear(g, 0, 300, 0, 560, [[0, '#1c2250'], [1, '#141a40']]); g.fill();
  // floor tiles
  g.strokeStyle = 'rgba(140,170,255,.075)'; g.lineWidth = 1.5;
  for (let z = 1; z <= ZF; z += .45) { const a = prj(-XR, 0, z), b = prj(XR, 0, z); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
  for (let x = -XR; x <= XR + .01; x += 1.625) { const a = prj(x, 0, ZN), b = prj(x, 0, ZF); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
  // windows (left wall) + light shafts
  for (const z0 of [1.15, 2.45, 3.75]) { const z1 = z0 + .95;
    quad3(g, [[-XR, 4.2, z0], [-XR, 4.2, z1], [-XR, 9.3, z1], [-XR, 9.3, z0]]); g.fillStyle = 'rgba(120,175,255,.55)'; g.fill(); g.strokeStyle = 'rgba(200,230,255,.5)'; g.lineWidth = 3; g.stroke();
    const m1 = prj(-XR, 4.2, (z0 + z1) / 2), m2 = prj(-XR, 9.3, (z0 + z1) / 2); g.beginPath(); g.moveTo(m1[0], m1[1]); g.lineTo(m2[0], m2[1]); g.stroke();
    g.save(); g.globalCompositeOperation = 'lighter'; quad3(g, [[-XR, 4.2, z0], [-XR, 4.2, z1], [-3, 0, z1 + .3], [-3, 0, z0 + .3]]); g.fillStyle = 'rgba(110,160,255,.05)'; g.fill(); g.restore(); }
  // door + clock (right side)
  quad3(g, [[XR, 0, 4.4], [XR, 0, 5.2], [XR, 7.6, 5.2], [XR, 7.6, 4.4]]); g.fillStyle = '#1e2552'; g.fill(); g.strokeStyle = 'rgba(127,244,255,.25)'; g.lineWidth = 2; g.stroke();
  // blackboard + banner
  quad3(g, [[-6.2, 3.3, ZF], [6.2, 3.3, ZF], [6.2, 8.1, ZF], [-6.2, 8.1, ZF]]); g.fillStyle = '#28305c'; g.fill();
  quad3(g, [[-6, 3.5, ZF], [6, 3.5, ZF], [6, 7.9, ZF], [-6, 7.9, ZF]]); g.fillStyle = '#0d2a2c'; g.fill();
  const bc = prj(0, 6.6, ZF); txt(g, '期末考试', bc[0], bc[1], 30, 'rgba(235,245,240,.78)', 700, 'center'); txt(g, '考试时间　9:00 — 11:00', bc[0], bc[1] + 30, 15, 'rgba(235,245,240,.6)', 700, 'center');
  quad3(g, [[-7.2, 8.6, ZF], [7.2, 8.6, ZF], [7.2, 10.3, ZF], [-7.2, 10.3, ZF]]); g.fillStyle = '#b3142f'; g.fill();
  const bn = prj(0, 9.2, ZF); g.save(); g.shadowColor = 'rgba(255,200,90,.6)'; g.shadowBlur = 8; txt(g, '沉着应考　诚信考试', bn[0], bn[1], 25, '#ffd76a', 900, 'center'); g.restore();
  const ck = prj(9.6, 8.6, ZF); g.fillStyle = '#e8ecf8'; g.beginPath(); g.arc(ck[0], ck[1], 19, 0, TAU); g.fill(); g.strokeStyle = '#2a3156'; g.lineWidth = 3; g.stroke();
  g.lineCap = 'round'; g.beginPath(); g.moveTo(ck[0], ck[1]); g.lineTo(ck[0], ck[1] - 13); g.moveTo(ck[0], ck[1]); g.lineTo(ck[0] + 9, ck[1] + 4); g.stroke();
  // ceiling light panels
  for (const [xr, zr] of LIGHTS) { quad3(g, [[xr[0], YC - .02, zr[0]], [xr[1], YC - .02, zr[0]], [xr[1], YC - .02, zr[1]], [xr[0], YC - .02, zr[1]]]); g.fillStyle = '#e6f8ff'; g.fill(); }
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [xr, zr] of LIGHTS) { const p = prj((xr[0] + xr[1]) / 2, YC, (zr[0] + zr[1]) / 2), z = (zr[0] + zr[1]) / 2; g.fillStyle = radial(g, p[0], p[1], 900 / z, [[0, 'rgba(150,210,255,.22)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(p[0] - 900 / z, p[1] - 900 / z, 1800 / z, 1800 / z); }
  g.restore();
  return c;
}
function drawDesk(g, X, Zs) {
  const z0 = Zs + .3, z1 = Zs + .8, x0 = X - 1.3, x1 = X + 1.3, s = HF / Zs;
  g.strokeStyle = '#151b44'; g.lineWidth = Math.max(2, .09 * s); g.lineCap = 'butt';
  for (const [lx, lz] of [[x0 + .12, z0], [x1 - .12, z0], [x0 + .12, z1], [x1 - .12, z1]]) { const a = prj(lx, 0, lz), b = prj(lx, 2.6, lz); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
  quad3(g, [[x0, 2.6, z0], [x1, 2.6, z0], [x1, 3, z0], [x0, 3, z0]]); g.fillStyle = '#1a2152'; g.fill();
  quad3(g, [[x0, 3, z0], [x1, 3, z0], [x1, 3, z1], [x0, 3, z1]]); g.fillStyle = '#2c3674'; g.fill(); g.strokeStyle = 'rgba(127,244,255,.32)'; g.lineWidth = 1.4; g.stroke();
  quad3(g, [[X - .6, 3.01, z0 + .08], [X + .5, 3.01, z0 + .06], [X + .55, 3.01, z1 - .06], [X - .55, 3.01, z1 - .05]]); g.fillStyle = 'rgba(226,233,255,.82)'; g.fill();
}
function drawStudent(g, t, X, Zs, i, hero) {
  const [hx, hy] = prj(X, 2.25, Zs), s = HF / Zs;
  g.save(); g.translate(hx, hy);
  if (hero) { g.scale(1, 1 + .01 * Math.sin(t * 3.1)); silo(g, backShape(s, 0, 1.02), { rim: '#a6f9ff', blur: 22, dx: -2.8, dy: -2.2 }); scarfB(g, s, t); }
  else { const d = .8 + .12 * nz(t * .8, i), hd = nz(t * 2.4, i + 9) * .05 * s; silo(g, backShape(s, d, 1, hd), { ra: .7, blur: 10 }); }
  g.restore();
  const a = prj(X - .88, 2.2, Zs - .24), b = prj(X + .88, 2.85, Zs - .24);
  fillRR(g, a[0], b[1], b[0] - a[0], a[1] - b[1], .12 * s, '#0e1236', 'rgba(127,244,255,.22)', 1.2);
}
function drawProctor(g, t) {
  const Xp = -5.15 + .3 * Math.sin(t * .7), Zp = 3.05, [fx, fy] = prj(Xp, 0, Zp), s = HF / Zp;
  g.save(); g.translate(fx, fy); silo(g, standShape(s), { ra: .75, blur: 12 });
  const op = 1 - .9 * Math.max(0, 1 - Math.abs(((t * .9) % 2.2) - 1.1) * 12);
  redEyes(g, Math.sin(t * 1.1) * .09 * s, -6.48 * s, s, op, .95, .21); g.restore();
}
// hologram "brain · formula library" above the protagonist
const HOLO = { x: 873, y: 152, w: 540, h: 288 };
const HSH = [262, 336, 410];
const HBOOKS = (() => { const r = rng(515), a = []; for (let row = 0; row < 3; row++) { let x = 0, n = 0; while (x < 460) { const hero = row === 1 && n === 9, w = hero ? 26 : 13 + r() * 13, h = hero ? 60 : 34 + r() * 20;
  a.push({ row, x, w, h, c: hero ? GOLD : [CYN, '#8f86ff', '#ff5ad8', BLU, '#7fffd4'][Math.floor(r() * 5)], hero, tl: r() < .2 ? (r() - .5) * .3 : 0 }); x += w + 3; n++; } }
  a.forEach((b, i) => b.i = i); return a; })();
const HB0 = Q(32.25), HB1 = Q(33.25);
function holo(g, t) {
  const ok = E.outB(clamp((t - Q(32.15)) / .3)); if (ok <= 0) return; const { x, y, w, h } = HOLO, fl = blinkOn(t, Q(32.15), 5);
  const hx = 1143, hy = 497;
  g.save(); g.globalAlpha = fl;
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linear(g, 0, y + h, 0, hy, [[0, 'rgba(94,242,255,.16)'], [1, 'rgba(94,242,255,.02)']]);
  poly(g, [[hx - 34, hy], [hx + 34, hy], [x + w / 2 + 150 * ok, y + h], [x + w / 2 - 150 * ok, y + h]]); g.fill(); g.restore();
  g.translate(x + w / 2, y + h); g.scale(ok, ok); g.translate(-(x + w / 2), -(y + h));
  fillRR(g, x, y, w, h, 16, 'rgba(8,26,64,.82)', 'rgba(94,242,255,.8)', 2.5);
  g.save(); rr(g, x, y, w, h, 16); g.clip(); g.fillStyle = 'rgba(94,242,255,.06)'; for (let yy = y; yy < y + h; yy += 5) g.fillRect(x, yy, w, 2); g.restore();
  txt(g, '大脑 · 公式库', x + 26, y + 46, 28, '#bff8ff', 900);
  const n = Math.round(1 + 99 * E.inQ(inv(HB0, HB1, t))); txt(g, '复习 ×' + n, x + w - 26, y + 46, 28, '#ffffff', 900, 'right');
  g.fillStyle = 'rgba(94,242,255,.7)'; for (const sy of HSH) g.fillRect(x + 30, sy + 2, w - 60, 3);
  const N = HBOOKS.length;
  for (const b of HBOOKS) { const bt0 = lerp(HB0, HB1, Math.pow(b.i / (N - 1), .85)), k = E.outB(clamp((t - bt0) / .16)); if (k <= 0) continue;
    const bx = x + 40 + b.x, by = HSH[b.row];
    g.save(); g.translate(bx + b.w / 2, by); g.rotate(b.tl); g.scale(1, k);
    g.globalCompositeOperation = 'lighter'; g.fillStyle = b.hero ? 'rgba(255,196,64,.75)' : b.c; g.globalAlpha = fl * (b.hero ? 1 : .42); g.fillRect(-b.w / 2, -b.h, b.w, b.h);
    g.globalAlpha = fl * .9; g.strokeStyle = b.hero ? '#ffe3a0' : b.c; g.lineWidth = 1.5; g.strokeRect(-b.w / 2, -b.h, b.w, b.h); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(-b.w / 2 + 3, -b.h + 6, b.w - 6, 2); g.fillRect(-b.w / 2 + 3, -12, b.w - 6, 2);
    g.restore(); }
  g.restore();
  stamp(g, t, Q(33.3), x + w - 150, y + h / 2 + 26, '倒背如流', GOLD, 46, -.13, checkIcon);
}
function shot1A(g, t) {
  const z = lerp(1.03, 1.16, E.ioS(inv(B_0, Q(34), t)));
  g.save(); g.translate(1110, 470); g.scale(z, z); g.translate(-1110, -470);
  g.drawImage(HALL, 0, 0);
  for (let r = 0; r < 4; r++) { const Zs = ROWS[r]; COLS.forEach(X => drawDesk(g, X, Zs)); COLS.forEach((X, c) => drawStudent(g, t, X, Zs, r * 4 + c, r === 3 && c === 2)); if (r === 1) drawProctor(g, t); }
  holo(g, t);
  g.restore();
}
// ---- exam paper ----
const PW = 1240, PPH = 1560; let PAPER = null, PAPER_HL = null, DESK = null;
function buildPaper() {
  const c = mk(PW, PPH), g = c.getContext('2d');
  g.fillStyle = '#e1e4ee'; g.fillRect(0, 0, PW, PPH);
  const r = rng(77); for (let i = 0; i < 1600; i++) { g.fillStyle = r() < .5 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.5)'; g.fillRect(r() * PW, r() * PPH, 1 + r() * 3, 1); }
  g.strokeStyle = 'rgba(30,40,80,.35)'; g.lineWidth = 2; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(96, 0); g.lineTo(96, PPH); g.stroke(); g.setLineDash([]);
  chars('密封线内不要答题').forEach((ch, i) => txt(g, ch, 58, 380 + i * 40, 22, 'rgba(40,50,90,.45)', 700, 'center'));
  txt(g, '2025 年 期末考试　数学（A 卷）', PW / 2 + 48, 122, 54, '#16182c', 900, 'center');
  txt(g, '考试时间：120 分钟　　满分：150 分', PW / 2 + 48, 176, 26, '#5a5e74', 700, 'center');
  g.fillStyle = '#16182c'; g.fillRect(150, 206, PW - 220, 3);
  txt(g, '姓名：＿＿＿＿＿　班级：＿＿＿＿　考号：＿＿＿＿＿＿', 160, 262, 26, '#3a3e56', 700);
  txt(g, '一、填空题（每题 5 分，共 30 分）', 160, 350, 34, '#16182c', 900);
  const q = '1. 一元二次方程 ax² + bx + c = 0（a ≠ 0）的求根公式是：'; txt(g, q, 160, 432, 36, '#16182c', 700);
  g.font = F(700, 36); const pre = q.slice(0, q.indexOf('求根公式')); const x0 = 160 + g.measureText(pre).width; PAPER_HL = { x0, x1: x0 + g.measureText('求根公式').width, y: 432 };
  txt(g, 'x =', 230, 532, 44, '#16182c', 700); g.fillStyle = '#16182c'; g.fillRect(318, 540, 540, 3);
  txt(g, '2. 已知 sin α = 3/5，α 为锐角，则 cos 2α = ＿＿＿＿＿＿。', 160, 650, 36, '#16182c', 700);
  txt(g, '3. 等差数列 {aₙ} 中，a₃ = 7，a₇ = 19，则公差 d = ＿＿＿＿。', 160, 750, 36, '#16182c', 700);
  g.fillStyle = '#c9ccd8'; [[160, 830, 880], [160, 880, 620], [160, 970, 940], [160, 1020, 760], [160, 1070, 520]].forEach(([x, y, w]) => { rr(g, x, y, w, 18, 9); g.fill(); });
  txt(g, '二、解答题（共 120 分）', 160, 1170, 34, '#16182c', 900);
  g.fillStyle = '#c9ccd8'; [[160, 1210, 900], [160, 1260, 700], [160, 1310, 960], [160, 1360, 480]].forEach(([x, y, w]) => { rr(g, x, y, w, 18, 9); g.fill(); });
  txt(g, '第 1 页（共 4 页）', PW / 2 + 48, PPH - 40, 22, '#6a6e84', 700, 'center');
  return c;
}
function buildDesk() {
  const c = mk(W, H), g = c.getContext('2d'); g.fillStyle = linear(g, 0, 0, W, H, [[0, '#1c2046'], [1, '#0a0b1e']]); g.fillRect(0, 0, W, H);
  const r = rng(31); g.lineWidth = 2; for (let i = 0; i < 70; i++) { const y0 = r() * H * 1.2 - 100, a = r() * 30; g.strokeStyle = `rgba(150,170,255,${.02 + r() * .035})`; g.beginPath(); for (let x = -20; x <= W + 20; x += 40) { const y = y0 + x * .18 + Math.sin(x * .004 + i) * a; x < 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  g.fillStyle = radial(g, 960, 420, 1100, [[0, 'rgba(170,205,255,.16)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H);
  return c;
}
const PAPX = 1030, PAPY = 58, PAPS = .9, PAPR = -.035;
function paperPt(px, py) { const c = Math.cos(PAPR), s = Math.sin(PAPR), x0 = (px - PW / 2) * PAPS, y0 = py * PAPS; return [PAPX + c * x0 - s * y0, PAPY + s * x0 + c * y0]; }
function drawPaperAt(g, k = 1, extra = null) {
  const cx = PAPX, cy = PAPY + 560; g.save(); g.translate(cx, cy); g.scale(k, k); g.rotate((k - 1) * -.1); g.translate(-cx, -cy);
  g.translate(PAPX, PAPY); g.rotate(PAPR); g.scale(PAPS, PAPS);
  g.save(); g.shadowColor = 'rgba(0,0,0,.65)'; g.shadowBlur = 30 + 60 * (k - 1); g.shadowOffsetX = 10 + 120 * (k - 1); g.shadowOffsetY = 16 + 160 * (k - 1); g.fillStyle = '#eceef4'; g.fillRect(-PW / 2, 0, PW, PPH); g.restore();
  g.drawImage(PAPER, -PW / 2, 0); if (extra) { g.translate(-PW / 2, 0); extra(g); }
  g.restore();
}
function paperLight(g) { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = radial(g, 900, 470, 1250, [[0, '#ffffff'], [.5, '#d6dbec'], [1, '#6c7598']]); g.fillRect(0, 0, W, H); g.restore(); }
function viewTo(g, f, to, z) { g.translate(to[0], to[1]); g.scale(z, z); g.translate(-f[0], -f[1]); }
function penHand(g, tip, ang, tr = 0, t = 0) {
  const x = tip[0] + nz(t * 31, 4) * tr, y = tip[1] + nz(t * 29, 7) * tr;
  g.save(); g.translate(x, y); g.rotate(ang);
  // pen (along +x from tip)
  g.fillStyle = '#c9d2e8'; poly(g, [[0, 0], [34, -7], [34, 7]]); g.fill();
  silo(g, gg => { gg.beginPath(); rr(gg, 32, -11, 330, 22, 9); gg.fill(); }, { ra: .9, blur: 10 });
  g.fillStyle = PINK; g.fillRect(300, -11, 16, 22);
  // hand
  silo(g, gg => { gg.beginPath(); gg.ellipse(150, 18, 82, 50, .2, 0, TAU); gg.fill(); gg.beginPath(); gg.ellipse(90, 6, 40, 20, -.1, 0, TAU); gg.fill(); gg.beginPath(); rr(gg, 170, -10, 420, 150, 70); gg.fill(); }, { ra: .9, blur: 16 });
  g.restore();
}
function ghost(g, dx, dy, a) { if (a <= .01) return; TX.clearRect(0, 0, W, H); TX.drawImage(g.canvas, 0, 0); g.save(); g.globalAlpha = a; g.drawImage(TMP, dx, dy); g.globalAlpha = a * .7; g.drawImage(TMP, -dx * .7, -dy * .7); g.restore(); }
function captionPill(g, t, t0, str, y = 990, col = '#ffffff', bg = 'rgba(8,6,24,.82)') {
  if (t < t0) return; const k = E.outC(clamp((t - t0) / .22)); const w = tw(g, str, 38) + 80;
  g.save(); g.globalAlpha = k; g.translate(0, (1 - k) * 20); fillRR(g, W / 2 - w / 2, y - 36, w, 72, 36, bg, 'rgba(255,255,255,.22)', 1.5); txt(g, str, W / 2, y + 13, 38, col, 900, 'center'); g.restore();
}
const P1B = Q(34) - .14;
const PAPER_BLOOM = t => (t >= P1B && t < Q(35.5)) || (t >= Q(39) && t < Q(40)) ? .18 : .5;
function shot1B(g, t) {
  g.drawImage(DESK, 0, 0);
  const land = Q(34), fk = t < land ? 1 + .38 * E.inQ(1 - inv(P1B, land, t)) : 1 + .006 * Math.exp(-(t - land) * 9) * Math.sin((t - land) * 50);
  const hit = Q(35), zk = E.outE(clamp((t - hit) / .16)), push = lerp(1, 1.08, E.ioS(inv(land, hit, t)));
  const f = paperPt(560, 420), to = [lerp(f[0], 940, zk), lerp(f[1], 470, zk)];
  g.save(); viewTo(g, f, to, push * (1 + .85 * zk) * (1 + .03 * pulse(t, hit, 8)));
  drawPaperAt(g, fk, pg => { if (t > hit) { const w = (PAPER_HL.x1 - PAPER_HL.x0 + 16) * E.outC(clamp((t - hit - .04) / .2)); pg.save(); pg.globalCompositeOperation = 'multiply'; pg.fillStyle = 'rgba(255,60,90,.75)'; pg.fillRect(PAPER_HL.x0 - 8, PAPER_HL.y - 38, w, 50); pg.restore();
    pg.save(); pg.strokeStyle = '#e0243f'; pg.lineWidth = 5; pg.lineCap = 'round'; pg.beginPath(); pg.moveTo(PAPER_HL.x0 - 8, PAPER_HL.y + 16); pg.lineTo(PAPER_HL.x0 - 8 + w, PAPER_HL.y + 16); pg.stroke(); pg.restore(); } });
  if (t < land + .3) { const u = t - land; if (u > 0) { const r = rng(12); g.save(); for (let i = 0; i < 40; i++) { const a = r() * TAU, sp = 300 + r() * 700, side = paperPt(r() < .5 ? 0 : PW, r() * 1000);
    g.fillStyle = `rgba(210,225,255,${.5 * (1 - u / .3)})`; g.beginPath(); g.arc(side[0] + Math.cos(a) * sp * u, side[1] + Math.sin(a) * sp * u, 2 + r() * 3, 0, TAU); g.fill(); } g.restore(); } }
  const hk = E.outC(inv(land + .1, land + .5, t)), tip0 = paperPt(900, 575), tip1 = paperPt(330, 560);
  const tip = [lerp(tip0[0] + 260, tip0[0], hk), lerp(tip0[1] + 300, tip0[1], hk)]; const tp = t > hit ? [lerp(tip[0], tip1[0], E.ioC(inv(hit + .1, hit + .9, t))), lerp(tip[1], tip1[1], E.ioC(inv(hit + .1, hit + .9, t)))] : tip;
  penHand(g, tp, .75, t > hit ? 4 : .6, t);
  g.restore(); paperLight(g);
  if (t > hit) { const dv = clamp((t - hit) / .15) * (1 - .4 * inv(hit + .6, hit + 1.1, t)); ghost(g, 12 * Math.sin((t - hit) * 7) * dv + 8 * dv, 4 * dv, .26 * dv); }
  captionPill(g, t, hit + .06, '看到题目的那一秒');
}
// ---- brain shelf ----
const SHELF_Y = [400, 635, 870], SX0 = 150, SX1 = 1770;
const FORMULAS = ['勾股定理', '韦达定理', '余弦定理', '正弦定理', '等差数列', '等比数列', '诱导公式', '和差化积', '倍角公式', '换底公式', '点到直线', '二项式', '均值不等式', '向量积', '导数公式', '对数运算', '圆的方程', '椭圆方程', '抛物线', '双曲线', '三角函数', '排列组合', '古典概型', '扇形面积', '球的体积', '弧长公式', '斜率公式', '平方差', '完全平方', '因式分解', '一次函数', '二次函数', '反比例', '指数函数', '集合运算', '绝对值', '判别式', '辅助角', '海伦公式', '中点公式', '距离公式', '周期公式', '求导法则', '积分表', '数学归纳', '复数运算', '期望方差', '正态分布', '线性回归', '立体几何', '空间向量', '射影定理', '切线方程', '三视图', '对称轴', '顶点式', '交点式', '配方法', '十字相乘', '韦恩图', '真值表', '充要条件', '单调性', '奇偶性', '零点定理', '夹角公式', '投影向量', '数列求和', '错位相减', '裂项相消'];
let BOOKS = [], HERO = null;
function buildBooks() {
  const r = rng(808), pal = ['#2b3a8c', '#1f6f8b', '#5a2d8c', '#8c2d5a', '#2d8c6a', '#3d4fa8', '#6b3fa0', '#a33b62', '#1d5c9e', '#265f5a']; let fi = 0; BOOKS = [];
  for (let row = 0; row < 3; row++) { let x = SX0 + 10; while (true) { const hero = row === 1 && !HERO && x > 860; const w = hero ? 92 : Math.round(50 + r() * 26), h = hero ? 222 : Math.round(150 + r() * 52); if (x + w > SX1 - 10) break;
    const name = hero ? '求根公式' : FORMULAS[fi++ % FORMULAS.length], c = mk(w + 8, h + 8), bg = c.getContext('2d'), col = hero ? GOLD : pal[Math.floor(r() * pal.length)];
    bg.translate(4, 4); bg.fillStyle = hero ? linear(bg, 0, 0, w, 0, [[0, '#b8862a'], [.4, '#ffd770'], [1, '#c8922a']]) : linear(bg, 0, 0, w, 0, [[0, mixHex(col, '#000', .35)], [.35, col], [1, mixHex(col, '#000', .45)]]); rr(bg, 0, 0, w, h, 5); bg.fill();
    bg.fillStyle = hero ? 'rgba(90,50,0,.55)' : 'rgba(255,255,255,.22)'; bg.fillRect(4, 12, w - 8, 4); bg.fillRect(4, h - 18, w - 8, 4);
    const cs = chars(name), fs = Math.min(hero ? 34 : 25, (h - 50) / cs.length); cs.forEach((ch, i) => txt(bg, ch, w / 2, 30 + fs * .9 + i * fs * 1.04, fs, hero ? '#4a2a00' : 'rgba(240,244,255,.92)', 900, 'center'));
    const b = { row, x, w, h, c, hero, seed: r(), name }; BOOKS.push(b); if (hero) HERO = b; x += w + Math.round(2 + r() * 5); } }
  // hero dust particles
  const hc = HERO.c, d = hc.getContext('2d').getImageData(0, 0, hc.width, hc.height).data, P = [], rr2 = rng(99);
  for (let y = 0; y < hc.height; y += 7) for (let x = 0; x < hc.width; x += 7) { const i = (y * hc.width + x) * 4; if (d[i + 3] < 100) continue; P.push({ x: x - 4, y: y - 4, col: `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`, vx: (rr2() - .5) * 700, vy: -200 - rr2() * 600, vr: rr2() }); }
  HERO.parts = P;
  // fall schedule
  const FT = [Q(36.5), Q(37), Q(37.5)];
  for (const b of BOOKS) { if (b.hero) continue; const rowB = BOOKS.filter(o => o.row === b.row && !o.hero);
    if (b.row === 1) { const d2 = Math.abs(b.x - HERO.x); const order = rowB.filter(o => Math.abs(o.x - HERO.x) < d2).length; b.ft = FT[1] + order * .045; b.dir = b.x < HERO.x ? -1 : 1; }
    else { const j = rowB.indexOf(b); b.dir = b.row === 0 ? 1 : -1; b.ft = FT[b.row] + (b.dir > 0 ? j : rowB.length - 1 - j) * .024; } }
}
const H_DIE = Q(38);
function drawBook(g, b, t) {
  const by = SHELF_Y[b.row], hop = 10 * pulse(t, Q(36), 7) * Math.abs(Math.sin((t - Q(36)) * 30 + b.seed * 6));
  if (b.hero) { if (t >= H_DIE) return; const wob = t > Q(37.55) ? Math.sin(t * 46) * .035 * inv(Q(37.55), H_DIE, t) : 0;
    g.save(); g.translate(b.x + b.w / 2, by); g.rotate(wob); glowDot(g, 0, -b.h / 2, 190, 'rgba(255,196,64,1)', .32 + .2 * Math.sin(t * 5)); g.drawImage(b.c, -b.w / 2 - 4, -b.h - 4 - hop);
    if (t > Q(37.7)) { g.strokeStyle = '#2a1500'; g.lineWidth = 3; g.beginPath(); const k = inv(Q(37.7), H_DIE, t); g.moveTo(-b.w / 2 + 10, -b.h * .7); g.lineTo(-4, -b.h * .55); g.lineTo(12, -b.h * .62); g.lineTo(b.w / 2 * k, -b.h * (.62 - .2 * k)); g.stroke(); }
    g.restore(); return; }
  const v = t - b.ft; if (v < 0) { g.drawImage(b.c, b.x - 4, by - b.h - 4 - hop); return; }
  const px = b.dir > 0 ? b.x + b.w : b.x, T1 = .15; let ang, dx = 0, dy = 0;
  if (v < T1) ang = .55 * E.inQ(v / T1); else { const w = v - T1; ang = .55 + 5.5 * w; dx = 260 * w; dy = 2600 * w * w; }
  if (by + dy - b.h > H + 200) return;
  g.save(); g.translate(px + dx * b.dir, by + dy); g.rotate(ang * b.dir); g.drawImage(b.c, (b.dir > 0 ? -b.w : 0) - 4, -b.h - 4); g.restore();
}
function shot1C(g, t) {
  const hot = E.outC(inv(Q(36), Q(36.4), t));
  neuralBG(g, t, hot);
  const z = lerp(1.06, 1.0, E.outC(inv(Q(35.5), Q(36), t))) * (1 + .02 * pulse(t, Q(36), 6));
  g.save(); g.translate(960, 560); g.scale(z, z); g.translate(-960, -560);
  for (const y of SHELF_Y) { g.fillStyle = '#2a2350'; g.fillRect(SX0 - 30, y, SX1 - SX0 + 60, 24); g.fillStyle = 'rgba(160,150,255,.5)'; g.fillRect(SX0 - 30, y, SX1 - SX0 + 60, 3); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(SX0 - 30, y + 24, SX1 - SX0 + 60, 18); }
  const fallen = [], stand = [];
  for (const b of BOOKS) (b.ft !== undefined && t > b.ft + .15 ? fallen : stand).push(b);
  stand.forEach(b => drawBook(g, b, t)); fallen.forEach(b => drawBook(g, b, t));
  if (t >= H_DIE) { const u = t - H_DIE, ox = HERO.x + 4, oy = SHELF_Y[1] - HERO.h - 4; g.save();
    glowDot(g, HERO.x + HERO.w / 2, SHELF_Y[1] - HERO.h / 2, 420, '#ffc440', .9 * Math.exp(-u * 5));
    for (const p of HERO.parts) { const x = ox + p.x + p.vx * u, y = oy + p.y + p.vy * u + 1400 * u * u; g.globalAlpha = clamp(1 - u / (.6 + p.vr * .5)); if (g.globalAlpha <= 0) continue; g.fillStyle = p.col; g.fillRect(x, y, 7 - u * 4, 7 - u * 4); }
    g.restore(); }
  g.restore();
  txt(g, '大脑 · 公式库', 960, 128, 46, '#e6ecff', 900, 'center');
  const st = t < Q(36) ? '状态：正常' : '状态：压力过载', bl = t < Q(36) ? 1 : (Math.floor((t - Q(36)) * 7) % 2 ? .45 : 1);
  g.save(); g.globalAlpha = bl; const sw = tw(g, st, 30) + 60; fillRR(g, 960 - sw / 2, 150, sw, 50, 25, t < Q(36) ? 'rgba(20,90,110,.6)' : 'rgba(200,20,50,.85)'); txt(g, st, 960, 186, 30, '#fff', 900, 'center'); g.restore();
  for (let k = 0; k < 3; k++) { const t0 = Q(38 + k / 3); popup(g, 960 - 70 + k * 70, 560 - 50 + k * 60, E.outB(clamp((t - t0) / .16)), '错误', '公式.docx 已丢失', '找不到该文件。它可能已被移动、重命名或删除。'); }
}
// ---- answer line: blank ----
const SCRIB = (() => { const r = rng(64), a = []; let x = 0; for (let i = 0; i < 90; i++) { x += 4 + r() * 9; a.push([x, (r() - .5) * 46 + Math.sin(i * .9) * 14]); } return a; })();
function shot1D(g, t) {
  const t0 = Q(39), u = t - t0; g.drawImage(DESK, 0, 0);
  const f = paperPt(560, 505), z = lerp(2.25, 2.55, E.outC(clamp(u / .7)));
  g.save(); viewTo(g, f, [930, 520], z);
  drawPaperAt(g, 1, pg => { const n = Math.floor(clamp(u / .55) * SCRIB.length); pg.save(); pg.strokeStyle = '#1d2a6a'; pg.lineWidth = 3.2; pg.lineJoin = 'round'; pg.lineCap = 'round'; pg.beginPath();
    for (let i = 0; i < n; i++) { const [sx, sy] = SCRIB[i]; const x = 340 + sx * (i % 2 ? 1 : .96), y = 505 + sy * .6; i ? pg.lineTo(x, y) : pg.moveTo(x, y); } pg.stroke(); pg.restore(); });
  const n = Math.floor(clamp(u / .55) * SCRIB.length), lp = SCRIB[Math.max(0, n - 1)], tip = paperPt(340 + lp[0], 505 + lp[1] * .6);
  penHand(g, tip, .75, 2.2 + 3 * (u > .4), t);
  g.restore(); paperLight(g);
  // stopwatch
  const sk = E.outB(clamp(u / .2)); g.save(); g.translate(1640, 104); g.scale(sk, sk);
  fillRR(g, -170, -44, 340, 88, 44, 'rgba(10,8,26,.85)', 'rgba(255,90,110,.6)', 2);
  g.strokeStyle = '#ff5a74'; g.lineWidth = 4; g.beginPath(); g.arc(-122, 4, 22, 0, TAU); g.stroke(); g.fillStyle = '#ff5a74'; g.fillRect(-128, -30, 12, 8);
  g.beginPath(); g.moveTo(-122, 4); g.lineTo(-122 + 14 * Math.sin(t * 9), 4 - 14 * Math.cos(t * 9)); g.stroke();
  txt(g, '剩余', -86, 15, 26, 'rgba(255,220,226,.8)', 700); txt(g, u < .45 ? '59:41' : '59:40', 112, 19, 44, '#ffffff', 900, 'right'); g.restore();
  // big red ？
  const qk = popK(t, Q(39.5), .2); if (qk > 0) { g.save(); g.translate(960 + nz(t * 40, 2) * 6, 470 + nz(t * 37, 5) * 6); g.rotate(.08); g.scale(qk, qk); g.shadowColor = '#ff2d55'; g.shadowBlur = 40; txt(g, '？', 0, 150, 420, '#ff2d55', 900, 'center'); g.restore(); }
}
