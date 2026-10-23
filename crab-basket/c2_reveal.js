// ================= G: 螃蟹效应 reveal (Q16 – Q24) =================
let FREEZE = null, SHARDS = [], PARTS = [], DEBRIS = [], TPOS = [], CRK_O = [1500, 560];
const PCOL = ['#ffe6a8', '#ffffff', '#8ff7f1', '#ff9a5c'], DCOL = ['#9fb6c9', '#a8977a', '#ff6b3d', '#2fd8cf', '#ffd27a'];
const TCY = 490; // title visual center y (baseline 600)
function getFreeze() { if (!FREEZE) { FREEZE = mk(W, H); sceneBasket(FREEZE.getContext('2d'), Q(16)); } return FREEZE; }
function buildReveal() {
  const [cx, cyy, s] = bCam(Q(16)); CRK_O = [W / 2 + (980 - cx) * s, H / 2 + (810 - cyy) * s];
  const r = rng(42), seeds = [];
  for (let i = 0; i < 46; i++) seeds.push([r() * W, r() * H]);
  for (let i = 0; i < 34; i++) { const a = r() * TAU, d = Math.pow(r(), 1.6) * 520; seeds.push([CRK_O[0] + Math.cos(a) * d, CRK_O[1] + Math.sin(a) * d * .8]); }
  SHARDS = voronoi(seeds, 0, 0, W, H).filter(P => P.length > 2).map(P => {
    const S = polyInfo(P), dx = S.cx - CRK_O[0], dy = S.cy - CRK_O[1], d = Math.hypot(dx, dy) || 1;
    S.dir = [dx / d, dy / d]; S.d = d; S.sp = 380 + r() * 700 + 500 * Math.max(0, 1 - d / 900); S.rs = (r() - .5) * 3.2; S.life = .45 + r() * .4; return S;
  });
  // title particles
  const c = mk(W, H), g = c.getContext('2d'), L = layout(g, '螃蟹效应', 290, 900, .06), x0 = 960 - L.w / 2;
  TPOS = L.chars.map(ch => ({ ch: ch.ch, x: x0 + ch.x + ch.w / 2, w: ch.w }));
  g.font = F(900, 290); g.fillStyle = '#fff'; L.chars.forEach(ch => g.fillText(ch.ch, x0 + ch.x, 600));
  const d = g.getImageData(0, 0, W, H).data, q = rng(7), gs = () => Math.sqrt(-2 * Math.log(q() + 1e-9)) * Math.cos(TAU * q()); PARTS = [];
  for (let y = 290; y < 690; y += 6) for (let x = 0; x < W; x += 6) {
    if (d[(y * W + x) * 4 + 3] < 128) continue; let ci = 0; for (let i = 0; i < 4; i++) if (x >= x0 + L.chars[i].x - 8) ci = i;
    const gx = gs() * 230, gy = gs() * 170, sx = CRK_O[0] + gx, sy = CRK_O[1] + gy, a = Math.atan2(gy, gx) + (q() - .5) * .7, sp = 700 + q() * 1900;
    PARTS.push({ tx: x + (q() - .5) * 3, ty: y + (q() - .5) * 3, ci, sx, sy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, w: .5 + (q() - .3) * 1.2, grp: Math.floor(q() * 4), dl: q() * .12 });
  }
  DEBRIS = []; for (let i = 0; i < 420; i++) { const a = q() * TAU, dd = Math.pow(q(), .7) * 700, sp = 600 + q() * 1800; DEBRIS.push({ x: CRK_O[0] + Math.cos(a) * dd * .9, y: CRK_O[1] + Math.sin(a) * dd * .6, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 200, len: 8 + q() * 34, th: 1.5 + q() * 4, r0: q() * TAU, rs: (q() - .5) * 18, life: .6 + q() * 1.1, col: Math.floor(q() * 5) }); }
}
function partPos(p, t) {
  const u = Math.max(0, t - TE), e = (1 - Math.exp(-3.2 * u)) / 3.2; let x = p.sx + p.vx * e, y = p.sy + p.vy * e;
  const ang = p.w * (1 - Math.exp(-2 * u)), dx = x - 960, dy = y - 520, cs = Math.cos(ang), sn = Math.sin(ang); x = 960 + dx * cs - dy * sn; y = 520 + dx * sn + dy * cs;
  const k = E.inC(inv(TE + p.dl, LT[p.ci], t)); return [lerp(x, p.tx, k), lerp(y, p.ty, k)];
}
function drawCracks(g, reach, a = 1, flick = 1) {
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  for (const pass of [0, 1]) {
    g.strokeStyle = pass ? `rgba(255,214,160,${.8 * a})` : `rgba(255,120,40,${.42 * a * flick})`; g.lineWidth = pass ? 1.8 : 8; g.beginPath();
    for (const S of SHARDS) { const P = S.P; for (let i = 0; i < P.length; i++) {
      const A = P[i], B = P[(i + 1) % P.length]; if ((A[0] <= 1 && B[0] <= 1) || (A[0] >= W - 1 && B[0] >= W - 1) || (A[1] <= 1 && B[1] <= 1) || (A[1] >= H - 1 && B[1] >= H - 1)) continue;
      const da = Math.hypot(A[0] - CRK_O[0], A[1] - CRK_O[1]), db = Math.hypot(B[0] - CRK_O[0], B[1] - CRK_O[1]); if (reach <= Math.min(da, db)) continue;
      const [N, Fp, dn, df] = da < db ? [A, B, da, db] : [B, A, db, da], k = clamp((reach - dn) / Math.max(1, df - dn));
      g.moveTo(N[0], N[1]); g.lineTo(lerp(N[0], Fp[0], k), lerp(N[1], Fp[1], k));
    } }
    g.stroke();
  }
  g.restore();
}
function revealBG(g, t, a = 1) {
  g.fillStyle = radial(g, 960, 520, 1250, [[0, '#0d1d3a'], [1, '#020409']]); g.fillRect(0, 0, W, H);
  const ri = inv(TE, LT[0], t) * a; if (ri <= 0) return;
  g.save(); g.translate(960, TCY); g.rotate(t * .14); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 20; i++) { const a0 = i / 20 * TAU; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1500, a0, a0 + .085); g.closePath(); g.fillStyle = radial(g, 0, 0, 1400, [[0, 'rgba(0,0,0,0)'], [.12, i % 2 ? `rgba(255,200,110,${.13 * ri})` : `rgba(80,230,220,${.09 * ri})`], [1, 'rgba(0,0,0,0)']]); g.fill(); }
  g.restore();
  glowDot(g, 960, TCY, 900, `rgba(255,150,60,${.16 * ri})`);
}
const TGRAD = g => linear(g, 0, -250, 0, 40, [[0, '#fffbe8'], [.45, '#ffd36b'], [1, '#ff6a3d']]);
function drawTitleChars(g, t, o = {}) {
  g.save(); g.font = F(900, 290); g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
  const br = o.static ? 0 : .008 * Math.sin(t * 2.6);
  TPOS.forEach((c, i) => {
    const u = o.static ? 9 : t - LT[i]; if (u < -.005) return;
    const s = 1 + .34 * Math.exp(-u * 7.5) * Math.cos(u * 15) + br;
    g.save(); g.translate(c.x, TCY); g.scale(s, s); g.translate(0, 600 - TCY);
    if (u < .7) { const dx = 26 * Math.exp(-u * 6), a = .6 * Math.exp(-u * 4); g.globalCompositeOperation = 'lighter'; g.globalAlpha = a; g.fillStyle = '#00e1ff'; g.fillText(c.ch, -c.w / 2 - dx, 0); g.fillStyle = '#ff2448'; g.fillText(c.ch, -c.w / 2 + dx, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; }
    g.shadowColor = 'rgba(255,110,30,.85)'; g.shadowBlur = o.blur ?? 46; g.lineWidth = 14; g.strokeStyle = '#2a0c04'; g.strokeText(c.ch, -c.w / 2, 0);
    g.shadowBlur = 0; g.fillStyle = TGRAD(g); g.fillText(c.ch, -c.w / 2, 0);
    if (u < .3) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.exp(-u * 12); g.fillStyle = '#fff'; g.fillText(c.ch, -c.w / 2, 0); }
    g.restore();
  });
  g.restore();
}
function landFx(g, t) {
  g.save(); g.globalCompositeOperation = 'lighter';
  TPOS.forEach((c, i) => {
    const u = t - LT[i]; if (u < 0 || u > .7) return; const k = u / .55;
    if (k < 1) { g.strokeStyle = `rgba(255,214,120,${1 - k})`; g.lineWidth = 16 * (1 - k); g.beginPath(); g.arc(c.x, TCY, 60 + 520 * E.outC(k), 0, TAU); g.stroke(); }
    g.fillStyle = `rgba(255,220,150,${.55 * Math.exp(-u * 5)})`; g.beginPath(); g.ellipse(c.x, TCY, 700, 7, 0, 0, TAU); g.fill();
    const r = rng(i + 30); for (let j = 0; j < 22; j++) { const a = r() * TAU, sp = 500 + r() * 900, e = (1 - Math.exp(-4 * u)) / 4, x = c.x + Math.cos(a) * (60 + sp * e), y = TCY + Math.sin(a) * (60 + sp * e) * .8, L = 14 * Math.exp(-u * 4);
      g.strokeStyle = j % 3 ? `rgba(255,210,130,${1 - u / .7})` : `rgba(140,250,240,${1 - u / .7})`; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x - Math.cos(a) * L * 3, y - Math.sin(a) * L * 2.4); g.stroke(); }
  });
  g.restore();
}
function drawParts(g, t) {
  if (t > LT[3] + .05) return;
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.globalAlpha = inv(TE, TE + .05, t) * lerp(.42, .9, inv(TE + .12, TE + .7, t));
  for (let grp = 0; grp < 4; grp++) {
    g.strokeStyle = PCOL[grp]; g.lineWidth = grp === 1 ? 2 : 2.8; g.beginPath();
    for (const p of PARTS) { if (p.grp !== grp || t > LT[p.ci] + .02) continue; const [x, y] = partPos(p, t), [x0, y0] = partPos(p, t - .03); g.moveTo(x0, y0); g.lineTo(x + .01, y); }
    g.stroke();
  }
  g.restore();
}
function drawDebris(g, u) {
  if (u > 1.8) return; g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  for (let c = 0; c < 5; c++) { g.strokeStyle = DCOL[c]; for (const b of DEBRIS) { if (b.col !== c || u > b.life) continue; const e = (1 - Math.exp(-2.4 * u)) / 2.4, x = b.x + b.vx * e, y = b.y + b.vy * e + 160 * u * u, a = b.r0 + b.rs * u, L = b.len / 2;
    g.globalAlpha = (1 - u / b.life) * .85; g.lineWidth = b.th; g.beginPath(); g.moveTo(x - Math.cos(a) * L, y - Math.sin(a) * L); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke(); } }
  g.restore();
}
function drawBadgePill(g, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; rr(g, 68, 34, 264, 76, 38); g.fillStyle = 'rgba(6,10,18,.74)'; g.fill(); g.strokeStyle = 'rgba(255,210,122,.6)'; g.lineWidth = 2; g.stroke(); g.restore(); }
function drawBadge(g, t) { drawBadgePill(g, 1); g.save(); g.translate(200, 72); g.scale(.16, .16); g.translate(-960, -TCY); drawTitleChars(g, t, { static: true, blur: 10 }); g.restore(); }
function sceneReveal(g, t) {
  if (t < TE) {
    const k = inv(Q(16), TE, t), z = 1 + .035 * E.inC(k);
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    g.save(); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
    g.filter = `saturate(${1 - .65 * k}) brightness(${1 - .5 * k})`; g.drawImage(getFreeze(), 0, 0); g.filter = 'none';
    drawCracks(g, 60 + 1900 * E.outC(k), clamp(k * 4), .7 + .3 * Math.sin(t * 60));
    glowDot(g, CRK_O[0], CRK_O[1], 260 + 200 * k, `rgba(255,170,80,${.5 * k})`);
    g.restore(); return;
  }
  const u = t - TE, fl = E.ioE(inv(Q(23), Q(23.8), t)), oa = 1 - inv(Q(23), Q(23.35), t);
  revealBG(g, t, oa);
  if (oa < 1) { g.fillStyle = `rgba(4,6,10,${1 - oa})`; g.fillRect(0, 0, W, H); }
  if (u < 1) { // freeze shatters outward
    const fr = getFreeze();
    for (const S of SHARDS) { const e = S.sp * (1 - Math.exp(-3 * u)) / 3, a = 1 - inv(.08, S.life, u); if (a <= 0) continue;
      drawShard(g, fr, S, S.cx + S.dir[0] * e, S.cy + S.dir[1] * e + 220 * u * u, S.rs * u, 1 + .2 * u, 1, a * .9, ['rgba(255,200,120,.9)', 2.5]); }
  }
  drawDebris(g, u); drawParts(g, t);
  if (oa > 0 && t > Q(21.3)) { // ghost basket
    const k = E.outC(inv(Q(21.5) - .1, Q(21.5) + .5, t)), s = .92 + .08 * k; g.save(); g.globalAlpha = .16 * k * oa; g.translate(960, 560); g.scale(s, s); g.strokeStyle = '#8ff7f1'; g.lineWidth = 3; g.setLineDash([14, 12]);
    g.beginPath(); g.moveTo(-430, -330); g.lineTo(430, -330); g.lineTo(330, 330); g.quadraticCurveTo(0, 360, -330, 330); g.closePath(); g.stroke(); g.setLineDash([]); g.lineWidth = 2;
    for (let j = 1; j < 9; j++) { const y = -330 + j * 73, w = lerp(430, 330, j / 9); g.beginPath(); g.moveTo(-w, y); g.lineTo(w, y); g.stroke(); } g.restore();
  }
  drawBadgePill(g, inv(Q(23.5), Q(23.9), t));
  g.save(); if (fl > 0) { const s = lerp(1, .16, fl); g.translate(lerp(960, 200, fl), lerp(TCY, 72, fl)); g.scale(s, s); g.translate(-960, -TCY); }
  drawTitleChars(g, t, { blur: lerp(46, 12, fl) }); g.restore();
  landFx(g, t);
  if (oa > 0) {
    g.save(); g.globalAlpha = oa;
    const sk = inv(Q(19.5), Q(20.2), t); if (sk > 0) {
      const sx = lerp(520, 1400, E.ioC(sk)); g.save(); g.beginPath(); g.rect(0, 640, sx, 100); g.clip();
      kText(g, 'CRAB MENTALITY', 960, 712, 44, { align: 'center', weight: 700, track: .45, color: '#8ff7f1', shadow: 'rgba(40,230,220,.6)', sBlur: 18 }); g.restore();
      if (sk < 1) { g.globalCompositeOperation = 'lighter'; g.fillStyle = linear(g, sx - 60, 0, sx + 4, 0, [[0, 'rgba(140,250,240,0)'], [1, 'rgba(200,255,250,.9)']]); g.fillRect(sx - 60, 664, 64, 64); g.globalCompositeOperation = 'source-over'; }
    }
    slamT(g, '有人想往上爬，身边的人就把他拉回来。', 960, 840, 66, Q(21), t, { color: (i) => i >= 3 && i <= 5 ? '#6ff3ea' : i >= 7 && i <= 10 ? '#ff8a5c' : '#fff' });
    tagT(g, '民间比喻 · 常用来形容人际关系', 960, 935, Q(22), 99, t, { align: 'center', size: 30, col: 'rgba(255,220,170,.85)' });
    g.restore();
  }
}

// ================= H: preview vignettes (Q24 – Q28) =================
function drawLinBack(g, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.moveTo(-340, 540); g.bezierCurveTo(-340, 260, -250, 150, -120, 120); g.lineTo(120, 120); g.bezierCurveTo(250, 150, 340, 260, 340, 540); g.closePath();
  g.fillStyle = linear(g, -340, 0, 340, 0, [[0, '#0a3f3c'], [.5, CYD], [.82, '#1cb0a8'], [1, '#62efe6']]); g.fill();
  g.strokeStyle = 'rgba(0,30,30,.5)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-180, 300); g.quadraticCurveTo(-150, 420, -200, 540); g.moveTo(170, 300); g.quadraticCurveTo(150, 420, 200, 540); g.stroke();
  g.beginPath(); g.moveTo(-160, 136); g.quadraticCurveTo(0, 40, 160, 136); g.quadraticCurveTo(0, 290, -160, 136); g.fillStyle = '#0d5652'; g.fill();
  g.fillStyle = '#b9845f'; rr(g, -55, 30, 110, 110, 30); g.fill();
  g.fillStyle = '#d29a74'; g.beginPath(); g.ellipse(-114, 0, 20, 32, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(114, 0, 20, 32, 0, 0, TAU); g.fill();
  g.fillStyle = radial(g, -30, -60, 170, [[0, '#2c2d36'], [1, '#111218']]); g.beginPath(); g.arc(0, -20, 118, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(120,255,245,.5)'; g.lineWidth = 6; g.beginPath(); g.arc(0, -20, 115, -1.0, .45); g.stroke();
  g.restore();
}
function drawBucket(g, x, y, sq) {
  g.save(); g.translate(x, y); g.scale(1 + sq * .14, 1 - sq * .14);
  g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(0, 4, 150, 22, 0, 0, TAU); g.fill();
  const r = rng(8); for (let i = 0; i < 9; i++) { const cx = -110 + i * 28 + (r() - .5) * 10, cy = -262 - r() * 40; g.fillStyle = i % 2 ? '#c06a22' : '#a3561a'; g.beginPath(); g.ellipse(cx, cy, 34 + r() * 10, 26 + r() * 8, (r() - .5) * 1.2, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,210,140,.45)'; g.beginPath(); g.ellipse(cx - 8, cy - 8, 12, 6, -.4, 0, TAU); g.fill(); }
  g.beginPath(); g.moveTo(-140, -250); g.lineTo(140, -250); g.lineTo(105, 0); g.lineTo(-105, 0); g.closePath(); g.save(); g.clip();
  g.fillStyle = '#efe8dc'; g.fillRect(-150, -260, 300, 270); g.fillStyle = '#cf3a2b';
  for (let i = -4; i <= 4; i += 2) { g.beginPath(); g.moveTo(i * 31 - 15, -250); g.lineTo(i * 31 + 15, -250); g.lineTo(i * 23 + 11, 0); g.lineTo(i * 23 - 11, 0); g.closePath(); g.fill(); }
  g.fillStyle = linear(g, -140, 0, 140, 0, [[0, 'rgba(0,0,0,.45)'], [.4, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.5)']]); g.fillRect(-150, -260, 300, 270);
  g.fillStyle = '#fff6e6'; g.beginPath(); g.arc(0, -125, 52, 0, TAU); g.fill(); g.fillStyle = '#cf3a2b'; g.font = F(900, 36); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('炸鸡', 0, -123);
  g.restore(); g.fillStyle = '#e4dccd'; g.beginPath(); g.ellipse(0, -250, 142, 16, 0, Math.PI, TAU); g.fill();
  g.restore();
}
function burst(g, x, y, s, str, col = '#ffe36b', tc = '#d0301f') {
  if (s <= 0) return; g.save(); g.translate(x, y); g.rotate(-.12); g.scale(s, s); g.beginPath();
  for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, R = i % 2 ? 78 : 132 + 14 * hsh(i); i ? g.lineTo(Math.cos(a) * R, Math.sin(a) * R * .8) : g.moveTo(Math.cos(a) * R, Math.sin(a) * R * .8); }
  g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = '#1a0d05'; g.lineWidth = 6; g.stroke();
  g.font = F(900, 92); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tc; g.strokeStyle = '#fff'; g.lineWidth = 8; g.strokeText(str, 0, 4); g.fillText(str, 0, 4); g.restore();
}
function drawDorm(g, u, clean) {
  if (clean) u = 1.4;
  g.save();
  g.fillStyle = linear(g, 0, 0, 0, 760, [[0, '#1f2938'], [1, '#141b27']]); g.fillRect(0, 0, W, 760);
  g.fillStyle = '#0a1424'; rr(g, 1290, 60, 500, 410, 8); g.fill();
  const r = rng(3); for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(255,${200 + r() * 55 | 0},150,${.2 + .45 * r()})`; g.fillRect(1300 + r() * 470, 300 + r() * 160, 4 + r() * 8, 4 + r() * 10); }
  g.strokeStyle = '#2c3748'; g.lineWidth = 12; rr(g, 1290, 60, 500, 410, 8); g.stroke(); g.lineWidth = 8; g.beginPath(); g.moveTo(1540, 60); g.lineTo(1540, 470); g.moveTo(1290, 265); g.lineTo(1790, 265); g.stroke();
  g.fillStyle = linear(g, 0, 740, 0, 1080, [[0, '#57483a'], [.06, '#3d3229'], [1, '#17120e']]); g.fillRect(0, 740, W, 340);
  g.fillStyle = 'rgba(255,230,190,.18)'; g.fillRect(0, 740, W, 4);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 430, 800, 560, [[0, 'rgba(255,190,110,.3)'], [1, 'rgba(255,190,110,0)']]); g.fillRect(0, 300, 1100, 780); g.restore();
  g.strokeStyle = '#2b2f38'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(170, 770); g.lineTo(130, 520); g.lineTo(250, 400); g.stroke();
  g.fillStyle = '#2b2f38'; g.beginPath(); g.ellipse(170, 775, 80, 18, 0, 0, TAU); g.fill();
  g.save(); g.translate(262, 404); g.rotate(.5); g.fillStyle = '#353a45'; g.beginPath(); g.moveTo(-50, -30); g.lineTo(50, -30); g.lineTo(80, 40); g.lineTo(-80, 40); g.closePath(); g.fill(); g.fillStyle = '#ffe9c4'; g.beginPath(); g.ellipse(0, 40, 80, 14, 0, 0, TAU); g.fill(); g.restore();
  glowDot(g, 300, 460, 220, 'rgba(255,200,130,.4)');
  g.fillStyle = '#20252e'; g.beginPath(); g.moveTo(730, 690); g.lineTo(1260, 690); g.lineTo(1300, 760); g.lineTo(690, 760); g.closePath(); g.fill();
  g.fillStyle = '#1a1e26'; rr(g, 750, 370, 490, 330, 16); g.fill();
  g.fillStyle = linear(g, 0, 386, 0, 684, [[0, '#10243a'], [1, '#0a1626']]); rr(g, 766, 386, 458, 298, 8); g.fill();
  g.textAlign = 'center'; g.fillStyle = '#9fc0d6'; g.font = F(700, 38); g.fillText('考证倒计时', 995, 452);
  g.fillStyle = CY; g.shadowColor = CY; g.shadowBlur = 24; g.font = F(900, 150); g.fillText('23', 965, 610); g.shadowBlur = 0; g.font = F(700, 50); g.fillStyle = '#d6f6f3'; g.fillText('天', 1088, 606);
  g.fillStyle = 'rgba(255,255,255,.12)'; rr(g, 840, 638, 310, 12, 6); g.fill(); g.fillStyle = CY; rr(g, 840, 638, 310 * .68, 12, 6); g.fill(); g.textAlign = 'left';
  glowDot(g, 995, 540, 560, 'rgba(47,216,207,.13)');
  drawLinBack(g, 500, 640, 1);
  const lit = inv(.28, .34, u);
  g.save(); g.translate(1110, 900); g.scale(1, .5); g.rotate(-.3); g.fillStyle = '#111419'; rr(g, -70, -130, 140, 260, 18); g.fill(); g.fillStyle = lit > 0 ? `rgba(150,205,255,${.3 + .6 * lit})` : '#0b0d12'; rr(g, -60, -120, 120, 240, 12); g.fill(); g.restore();
  if (lit > 0) glowDot(g, 1110, 900, 260, `rgba(150,205,255,${.35 * lit})`);
  const drop = E.inC(inv(.04, .22, u)), by = (1 - drop) * -560, sq = clean ? 0 : hit(u, .22, .28);
  drawBucket(g, 1480, 870 + by, sq);
  drawFist(g, 1625, 690 + by + sq * 30, 1.15, YEL, YELD, 2300, 300 + by);
  burst(g, 1745, 610, E.outB(inv(.22, .36, u)), '啪！');
  const ny = lerp(-130, 140, E.outB(inv(.28, .46, u)));
  if (u > .28) { g.save(); g.translate(600, ny); rr(g, -400, -64, 800, 128, 32); g.fillStyle = 'rgba(28,34,46,.95)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 2; g.stroke();
    g.fillStyle = YEL; g.beginPath(); g.arc(-322, 0, 40, 0, TAU); g.fill(); g.fillStyle = '#3a2a00'; g.font = F(900, 38); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('鹏', -322, 2);
    g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff'; g.font = F(900, 34); g.fillText('大鹏', -262, -12); g.fillStyle = '#8f9bb0'; g.font = F(500, 26); g.fillText('刚刚', 300, -12);
    g.fillStyle = '#e6ebf3'; g.font = F(700, 40); g.fillText('五排三缺一！就等你了', -262, 40); g.restore(); }
  slamT(g, '“别卷了”', 1490, 400, 150, .52, u, { color: YEL, stroke: ['#2a1a00', 12] });
  g.restore();
}
function drawTable(g, u, clean) {
  if (clean) u = 1.4;
  g.save();
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#0c1016'], [.6, '#161c26'], [1, '#0b0e13']]); g.fillRect(0, 0, W, H);
  g.fillStyle = '#0d1117'; g.fillRect(0, 935, W, 145); g.fillStyle = 'rgba(150,180,220,.07)'; g.fillRect(0, 935, W, 3);
  const chair = (x) => { g.strokeStyle = '#1d222b'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, 760); g.lineTo(x, 900); g.moveTo(x - 150, 940); g.lineTo(x, 900); g.lineTo(x + 150, 940); g.moveTo(x - 60, 950); g.lineTo(x, 900); g.lineTo(x + 60, 952); g.stroke(); g.fillStyle = '#1d222b'; rr(g, x - 170, 700, 340, 60, 20); g.fill(); };
  chair(420); chair(1580); chair(960);
  g.fillStyle = PURD; rr(g, 300, 300, 260, 160, 30); g.fill(); g.fillStyle = '#2a2330'; rr(g, 340, 440, 70, 470, 30); g.fill(); rr(g, 450, 440, 70, 470, 30); g.fill(); g.fillStyle = '#121014'; rr(g, 320, 890, 110, 44, 20); g.fill(); rr(g, 440, 890, 110, 44, 20); g.fill();
  g.fillStyle = '#3a404c'; rr(g, 1480, 300, 90, 610, 34); g.fill(); rr(g, 1600, 300, 90, 610, 34); g.fill(); g.fillStyle = '#111'; rr(g, 1460, 890, 130, 46, 20); g.fill(); rr(g, 1590, 890, 130, 46, 20); g.fill();
  const rs = E.outC(inv(0, .3, u)), tug = E.outE(inv(.42, .6, u)), hemY = lerp(lerp(480, 322, rs), 440, tug), fk = E.outE(inv(.16, .34, u));
  g.fillStyle = linear(g, 860, 0, 1060, 0, [[0, '#1d2a42'], [.5, '#2d4166'], [1, '#1a2640']]); rr(g, 858, hemY, 96, 930 - hemY, 34); g.fill(); rr(g, 966, hemY, 96, 930 - hemY, 34); g.fill();
  g.fillStyle = '#dfe4ea'; rr(g, 840, 900, 124, 46, 20); g.fill(); rr(g, 956, 900, 124, 46, 20); g.fill();
  const dip = 30 * tug;
  g.beginPath(); g.moveTo(790, 0); g.lineTo(1130, 0); g.lineTo(1130, hemY + 30); g.quadraticCurveTo(870, hemY + 30 + dip * 2.2, 790, hemY + 30 + dip * .6); g.closePath();
  g.fillStyle = linear(g, 790, 0, 1130, 0, [[0, CYD], [.5, CY], [1, CYD]]); g.fill();
  g.strokeStyle = 'rgba(0,50,48,.55)'; g.lineWidth = 3; for (let i = 0; i < 18; i++) { const x = 800 + i * 18.5; g.beginPath(); g.moveTo(x, hemY - 10 + dip * .3 * (1 - i / 18)); g.lineTo(x, hemY + 28 + dip * (1.3 - i / 14) * .9); g.stroke(); }
  g.fillStyle = 'rgba(0,40,40,.4)'; g.fillRect(790, hemY - 14, 340, 4);
  if (fk > 0) drawFist(g, lerp(380, 868, fk), hemY + 30 + dip * 1.2, 1.05, PUR, PURD, lerp(-200, 380, fk), 330);
  g.fillStyle = '#16171c'; g.fillRect(0, 0, W, 254); g.fillStyle = linear(g, 0, 250, 0, 300, [[0, '#5e4d3e'], [1, '#2a221c']]); g.fillRect(0, 250, W, 48); g.fillStyle = 'rgba(255,230,200,.25)'; g.fillRect(0, 252, W, 3);
  g.fillStyle = '#23262d'; g.fillRect(180, 298, 26, 640); g.fillRect(1740, 298, 26, 640);
  slamT(g, '“坐下”', 1450, 640, 170, .5, u, { color: '#bb9bff', stroke: ['#1d0f3a', 12] });
  rise(g, '（小声）', 1450, 730, 46, .62, u, { color: '#a7afc0', weight: 700 });
  g.restore();
}
function drawChat(g, u, clean) {
  if (clean) u = 1.4;
  g.save();
  g.fillStyle = radial(g, 960, 540, 1100, [[0, '#121826'], [1, '#05070b']]); g.fillRect(0, 0, W, H);
  const r = rng(12); for (let i = 0; i < 14; i++) glowDot(g, r() * W, r() * H, 40 + r() * 90, `rgba(${r() < .5 ? '120,170,255' : '255,180,120'},${.08 + .1 * r()})`);
  g.save(); g.translate(960, 560); g.rotate(-.035);
  rr(g, -310, -600, 620, 1200, 64); g.fillStyle = '#0d1016'; g.fill(); g.strokeStyle = '#2d3443'; g.lineWidth = 6; g.stroke();
  g.save(); rr(g, -290, -580, 580, 1160, 50); g.clip(); g.fillStyle = '#141921'; g.fillRect(-290, -580, 580, 1160);
  g.fillStyle = '#1b212b'; g.fillRect(-290, -580, 580, 150); g.fillStyle = '#fff'; g.font = F(900, 42); g.textAlign = 'center'; g.fillText('老友局（8）', 0, -478);
  g.fillStyle = '#8b95a7'; g.font = F(500, 40); g.textAlign = 'left'; g.fillText('‹', -260, -478);
  const msg = (y, av, ac, txt) => { g.fillStyle = ac; g.beginPath(); g.arc(-230, y, 30, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.font = F(900, 28); g.textAlign = 'center'; g.fillText(av, -230, y + 10); g.textAlign = 'left'; g.font = F(500, 34); const w = g.measureText(txt).width + 44; g.fillStyle = '#262d39'; rr(g, -185, y - 34, w, 68, 20); g.fill(); g.fillStyle = '#d5dbe5'; g.fillText(txt, -163, y + 12); };
  g.globalAlpha = .55; msg(-350, '杰', '#e08a3c', '好久没聚了啊'); msg(-245, '雯', '#4caf7a', '想你们了😭'); msg(-140, '浩', '#8a6ad8', '找个时间！'); g.globalAlpha = 1;
  g.fillStyle = '#5d6676'; g.font = F(500, 26); g.textAlign = 'center'; g.fillText('今天 07:12', 0, -40);
  const bk = E.outB(inv(.03, .2, u)); if (bk > 0) { g.save(); g.translate(250, 60); g.scale(bk, bk); g.font = F(700, 40); const w = g.measureText('今天跑了 8 公里').width + 56; rr(g, -w, -42, w, 84, 24); g.fillStyle = CY; g.shadowColor = 'rgba(47,216,207,.6)'; g.shadowBlur = 24; g.fill(); g.shadowBlur = 0; g.fillStyle = '#04302d'; g.textAlign = 'left'; g.fillText('今天跑了 8 公里', -w + 28, 14); g.restore(); }
  const ra = inv(.18, .26, u); if (ra > 0) { g.globalAlpha = ra; g.fillStyle = '#7d8796'; g.font = F(500, 28); g.textAlign = 'right'; g.fillText('已读 7', 250, 145); g.globalAlpha = 1; }
  g.fillStyle = '#1c222c'; g.fillRect(-290, 430, 580, 150); g.fillStyle = '#262d39'; rr(g, -250, 465, 420, 70, 35); g.fill();
  g.restore(); g.restore();
  stampT(g, '已读 7', 1330, 690, .36, u, { size: 110, rot: -.16 });
  g.restore();
}
let CARDS = null;
function buildCards() { CARDS = [drawDorm, drawTable, drawChat].map(fn => { const c = mk(960, 540), g = c.getContext('2d'); g.scale(.5, .5); fn(g, 0, true); return c; }); }
const PV_T = [Q(24), Q(25.5), Q(27)];
function scenePreview(g, t) {
  const idx = t < PV_T[1] ? 0 : t < PV_T[2] ? 1 : 2, u = t - PV_T[idx], pz = 1 + .1 * (1 - E.outC(inv(0, .45, u)));
  g.save(); g.translate(960, 540); g.scale(pz, pz); g.translate(-960, -540); [drawDorm, drawTable, drawChat][idx](g, u, false); g.restore();
  const TM = [[.42, .68, .6, .74], [.42, .68, .6, .74], [.3, .52, .46, .6]][idx], CP = [[[-700, 1450], [300, 880], -.8], [[2600, 1350], [1220, 800], -2.45], [[2550, 1500], [1240, 860], -2.4]][idx];
  const ck = E.ioC(inv(TM[0], TM[1], u)), cl = E.inC(inv(TM[2], TM[3], u));
  if (ck > 0) drawClawSil(g, lerp(CP[0][0], CP[1][0], ck), lerp(CP[0][1], CP[1][1], ck), CP[2], 3.3, lerp(.95, .02, cl), .62 * inv(TM[0], TM[0] + .1, u));
}
// ================= I: three cards (Q28 – end) =================
function sceneCards(g, t) {
  g.fillStyle = radial(g, 960, 480, 1200, [[0, '#141d2c'], [1, '#04060a']]); g.fillRect(0, 0, W, H);
  g.save(); g.strokeStyle = 'rgba(140,170,220,.05)'; g.lineWidth = 1; for (let x = 0; x <= W; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore();
  const XS = [470, 960, 1450], RT = [-.06, .02, .065], LB = ['宿舍 · “别卷了”', '会议桌下 · “坐下”', '群聊 · 已读 7'], PT = [Q(30), Q(30.5), Q(31)];
  for (let i = 0; i < 3; i++) {
    const t0 = Q(28) + .02 + i * .09, k = inv(t0, t0 + .55, t); if (k <= 0) continue; const e = E.outB(k), y = 455 + (1 - e) * 900 + 6 * Math.sin(t * 1.7 + i * 2), rot = lerp(RT[i] + (i - 1) * .5, RT[i], e) + .006 * Math.sin(t * 1.3 + i), sc = lerp(.7, 1, clamp(e));
    g.save(); g.translate(XS[i], y); g.rotate(rot); g.scale(sc, sc);
    g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40; g.shadowOffsetY = 18; g.fillStyle = '#eef2f7'; rr(g, -276, -162, 552, 324, 12); g.fill(); g.shadowColor = 'transparent';
    g.drawImage(CARDS[i], -262, -148, 524, 296); g.restore();
    const la = inv(t0 + .25, t0 + .5, t); if (la <= 0) continue;
    g.save(); g.globalAlpha = la; g.font = F(700, 38); const tw_ = g.measureText(LB[i]).width, bx = XS[i] - (tw_ + 62) / 2, ly = 700 + 14 * (1 - E.outC(la));
    const p = hit(t, PT[i], .5), bs = 44 * (1 + .35 * p);
    g.save(); g.translate(bx + 22, ly - 13); g.strokeStyle = p > .02 ? GOLD : 'rgba(255,255,255,.75)'; g.lineWidth = 4; if (p > .02) { g.shadowColor = GOLD; g.shadowBlur = 30 * p; } rr(g, -bs / 2, -bs / 2, bs, bs, 8); g.stroke(); g.restore();
    g.fillStyle = '#e8eef6'; g.fillText(LB[i], bx + 62, ly); g.restore();
  }
  rise(g, '它就藏在你身边。', 960, 175, 86, Q(28) + .1, t);
  slamT(g, '这三个场景，你中过几个？', 960, 930, 84, Q(29.5), t, { color: (i) => i >= 9 && i <= 10 ? GOLD : '#fff' });
}
