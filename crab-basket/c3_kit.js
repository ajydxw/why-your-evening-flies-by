// ================= KIT: people, light, speech, card-row transitions =================
// ---- master timeline (beats) ----
const S1 = Q(32), S1E = Q(41), S2 = Q(44), S2E = Q(57.5), S3 = Q(60.5), S3E = Q(71), WHY = Q(73.5);
const SC_T = [[S1, S1E], [S2, S2E], [S3, S3E]];
const PUSH = .55; // card push-in duration (s)
const HAIR = '#1d1e26';
// ---------- person (bust, front view). origin = neck base ----------
function drawPerson(g, x, y, s, o = {}) {
  const P = Object.assign({ body: CY, bodyD: CYD, skin: '#f2c8a4', skinD: '#c48b67', hair: HAIR, style: 'short', brow: 0, mouth: 'flat', eyes: 'open', look: [0, 0], tilt: 0, lean: 0, blush: 0, flush: 0, outfit: 'hoodie', raise: 0, glasses: false, tie: null }, o);
  g.save(); g.translate(x, y); g.rotate(P.lean); g.scale(s, s); g.lineCap = 'round'; g.lineJoin = 'round';
  if (P.style === 'bob' || P.style === 'long') { // hair behind
    g.save(); g.translate(0, -40); g.rotate(P.tilt); g.translate(0, 40);
    g.fillStyle = P.hair; g.beginPath();
    if (P.style === 'bob') { g.moveTo(-96, -150); g.bezierCurveTo(-104, -80, -100, -40, -86, -30); g.lineTo(86, -30); g.bezierCurveTo(100, -40, 104, -80, 96, -150); }
    else { g.moveTo(-94, -150); g.bezierCurveTo(-110, -40, -120, 40, -128, 90); g.lineTo(128, 90); g.bezierCurveTo(120, 40, 110, -40, 94, -150); }
    g.closePath(); g.fill(); g.restore();
  }
  // torso
  g.beginPath(); g.moveTo(-70, -6); g.bezierCurveTo(-162, 2, -204, 50, -214, 150); g.lineTo(-238, 640); g.lineTo(238, 640); g.lineTo(214, 150); g.bezierCurveTo(204, 50, 162, 2, 70, -6); g.closePath();
  g.fillStyle = linear(g, -238, 0, 238, 0, [[0, P.bodyD], [.3, P.body], [.72, P.body], [1, P.bodyD]]); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.16)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-150, 110); g.quadraticCurveTo(-140, 300, -156, 640); g.moveTo(150, 110); g.quadraticCurveTo(140, 300, 156, 640); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.1)'; g.beginPath(); g.ellipse(-120, 60, 70, 26, -.35, 0, TAU); g.fill();
  if (P.outfit === 'hoodie') {
    g.fillStyle = P.bodyD; g.beginPath(); g.ellipse(0, 6, 104, 40, 0, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 6; g.beginPath(); g.moveTo(-26, 26); g.lineTo(-30, 120); g.moveTo(26, 26); g.lineTo(30, 124); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.7)'; rr(g, -36, 116, 12, 22, 5); g.fill(); rr(g, 24, 120, 12, 22, 5); g.fill();
  } else if (P.outfit === 'shirt') {
    g.fillStyle = P.shirt || '#e9edf2'; g.beginPath(); g.moveTo(-62, -4); g.lineTo(0, 90); g.lineTo(62, -4); g.closePath(); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(-64, -8); g.lineTo(-6, 40); g.lineTo(-40, 70); g.closePath(); g.fill(); g.beginPath(); g.moveTo(64, -8); g.lineTo(6, 40); g.lineTo(40, 70); g.closePath(); g.fill();
    if (P.tie) { g.fillStyle = P.tie; g.beginPath(); g.moveTo(-12, 34); g.lineTo(12, 34); g.lineTo(20, 190); g.lineTo(0, 214); g.lineTo(-20, 190); g.closePath(); g.fill(); }
  } else if (P.outfit === 'blouse') {
    g.fillStyle = P.skinD; g.beginPath(); g.moveTo(-58, -6); g.quadraticCurveTo(0, 90, 58, -6); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,240,210,.85)'; g.lineWidth = 4; g.beginPath(); g.moveTo(-46, 4); g.quadraticCurveTo(0, 70, 46, 4); g.stroke();
    g.fillStyle = '#fff3d8'; g.beginPath(); g.arc(0, 52, 7, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 4; g.beginPath(); g.moveTo(-60, -2); g.lineTo(-34, 640); g.moveTo(60, -2); g.lineTo(34, 640); g.stroke();
  } else { // tee
    g.fillStyle = P.bodyD; g.beginPath(); g.moveTo(-60, -6); g.quadraticCurveTo(0, 60, 60, -6); g.quadraticCurveTo(0, 36, -60, -6); g.fill();
  }
  if (P.badge) { g.save(); g.translate(-120, 150); g.fillStyle = GOLD; g.shadowColor = GOLD; g.shadowBlur = 20 * P.badge; rr(g, -50, -22, 100, 44, 10); g.fill(); g.shadowBlur = 0; g.fillStyle = '#3a2600'; g.font = F(900, 28); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('组长', 0, 1); g.restore(); }
  // raised arm (viewer's right)
  if (P.raise > 0) {
    const r = E.outB(clamp(P.raise)), hx = lerp(200, 250, r), hy = lerp(360, -330, r), ex = lerp(230, 290, r), ey = lerp(330, -40, r);
    g.strokeStyle = P.bodyD; g.lineWidth = 84; g.beginPath(); g.moveTo(170, 90); g.quadraticCurveTo(ex, ey, hx, hy + 60); g.stroke();
    g.strokeStyle = P.body; g.lineWidth = 70; g.stroke();
    g.save(); g.translate(hx, hy); g.rotate(.12 + .05 * Math.sin(r * 9)); g.fillStyle = P.skin; rr(g, -34, -30, 68, 78, 26); g.fill();
    for (let i = 0; i < 4; i++) { rr(g, -30 + i * 16, -86 + Math.abs(i - 1.5) * 8, 14, 64, 7); g.fill(); } rr(g, -56, -6, 30, 18, 9); g.fill(); g.restore();
  }
  // neck
  g.fillStyle = linear(g, 0, -70, 0, 10, [[0, P.skinD], [1, P.skinD]]); rr(g, -28, -66, 56, 76, 22); g.fill();
  g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(0, -46, 30, 12, 0, 0, TAU); g.fill();
  // head
  g.save(); g.translate(0, -40); g.rotate(P.tilt); g.translate(0, 40);
  g.fillStyle = P.skin; g.beginPath(); g.ellipse(-72, -122, 13, 20, 0, 0, TAU); g.ellipse(72, -122, 13, 20, 0, 0, TAU); g.fill();
  g.fillStyle = radial(g, -22, -158, 150, [[0, '#fff1e2'], [.25, P.skin], [1, P.skinD]]); g.beginPath(); g.ellipse(0, -128, 72, 84, 0, 0, TAU); g.fill();
  if (P.flush > 0) { g.fillStyle = `rgba(255,40,30,${.55 * P.flush})`; g.beginPath(); g.ellipse(0, -128, 72, 84, 0, 0, TAU); g.fill(); }
  const lx = P.look[0] * 9, ly = P.look[1] * 7;
  if (P.blush > 0) { g.fillStyle = `rgba(255,120,120,${.35 * P.blush})`; g.beginPath(); g.ellipse(-44, -98, 15, 9, 0, 0, TAU); g.ellipse(44, -98, 15, 9, 0, 0, TAU); g.fill(); }
  for (const sd of [-1, 1]) { // eyes
    const ex = sd * 27 + lx, ey = -124 + ly; g.fillStyle = '#1b1411'; g.strokeStyle = '#1b1411'; g.lineWidth = 4.5;
    if (P.eyes === 'happy') { g.beginPath(); g.arc(ex, ey + 4, 9, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    else if (P.eyes === 'closed') { g.beginPath(); g.moveTo(ex - 9, ey + 2); g.quadraticCurveTo(ex, ey + 7, ex + 9, ey + 2); g.stroke(); }
    else if (P.eyes === 'wide') { g.fillStyle = '#fff'; g.beginPath(); g.arc(ex, ey, 12, 0, TAU); g.fill(); g.lineWidth = 2.5; g.stroke(); g.fillStyle = '#1b1411'; g.beginPath(); g.arc(ex + lx * .2, ey + ly * .2, 5, 0, TAU); g.fill(); }
    else if (P.eyes === 'half' || P.eyes === 'down') {
      const dy = P.eyes === 'down' ? 5 : 1; g.beginPath(); g.ellipse(ex, ey + dy, 7.5, 6, 0, 0, Math.PI); g.fill();
      g.lineWidth = 4; g.beginPath(); g.moveTo(ex - 10, ey + dy); g.lineTo(ex + 10, ey + dy - (P.eyes === 'half' ? sd * 1.5 : 0)); g.stroke();
    } else { g.beginPath(); g.ellipse(ex, ey, 7.5, 9.5, 0, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(ex + 2.5, ey - 3.5, 2.6, 0, TAU); g.fill(); }
    const b = P.brow, bi = typeof b === 'number' ? b : b[sd > 0 ? 1 : 0]; g.strokeStyle = P.hair === '#cfd3da' ? '#8d929b' : P.hair; g.lineWidth = 6;
    g.beginPath(); g.moveTo(sd * 13 + lx, -149 + 8 * bi + ly * .5); g.lineTo(sd * 41 + lx, -152 - 5 * bi + ly * .5); g.stroke();
  }
  g.strokeStyle = P.skinD; g.lineWidth = 3.5; g.beginPath(); g.moveTo(-3 + lx * .5, -110); g.quadraticCurveTo(7 + lx * .5, -98, -3 + lx * .5, -95); g.stroke();
  const mx = lx * .5, my = -76 + ly * .3; g.strokeStyle = '#6b2f25'; g.fillStyle = '#5a1f1c'; g.lineWidth = 4.5;
  switch (P.mouth) {
    case 'smile': g.beginPath(); g.arc(mx, my - 12, 17, .22 * Math.PI, .78 * Math.PI); g.stroke(); break;
    case 'grin': g.beginPath(); g.moveTo(mx - 25, my - 8); g.quadraticCurveTo(mx, my + 26, mx + 25, my - 8); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(mx - 21, my - 6); g.lineTo(mx + 21, my - 6); g.lineTo(mx + 17, my + 1); g.lineTo(mx - 17, my + 1); g.closePath(); g.fill(); break;
    case 'smirk': g.beginPath(); g.moveTo(mx - 16, my); g.quadraticCurveTo(mx + 4, my + 4, mx + 21, my - 10); g.stroke(); break;
    case 'frown': g.beginPath(); g.arc(mx, my + 14, 15, 1.25 * Math.PI, 1.75 * Math.PI); g.stroke(); break;
    case 'o': g.beginPath(); g.ellipse(mx, my, 8, 10, 0, 0, TAU); g.fill(); break;
    case 'open': g.beginPath(); g.ellipse(mx, my, 15, 11, 0, 0, TAU); g.fill(); break;
    case 'tight': g.beginPath(); g.moveTo(mx - 9, my + 1); g.lineTo(mx + 9, my + 1); g.stroke(); break;
    default: g.beginPath(); g.moveTo(mx - 14, my); g.lineTo(mx + 14, my); g.stroke();
  }
  if (P.glasses) { g.strokeStyle = '#20232b'; g.lineWidth = 4.5; rr(g, -50 + lx, -140 + ly, 44, 32, 10); g.stroke(); rr(g, 6 + lx, -140 + ly, 44, 32, 10); g.stroke(); g.beginPath(); g.moveTo(-6 + lx, -126 + ly); g.lineTo(6 + lx, -126 + ly); g.stroke(); }
  // hair front
  g.fillStyle = linear(g, 0, -220, 0, -110, [[0, lighten(P.hair)], [1, P.hair]]);
  const cap = () => { g.beginPath(); g.moveTo(-78, -112); g.bezierCurveTo(-86, -196, -40, -224, 0, -224); g.bezierCurveTo(40, -224, 86, -196, 78, -112); };
  if (P.style === 'short') { cap(); g.lineTo(70, -150); g.lineTo(46, -166); g.lineTo(30, -156); g.lineTo(6, -172); g.lineTo(-14, -160); g.lineTo(-36, -170); g.lineTo(-54, -154); g.lineTo(-70, -150); g.closePath(); g.fill(); }
  else if (P.style === 'spiky') { g.beginPath(); g.moveTo(-80, -116); const sp = [[-92, -190], [-62, -186], [-60, -238], [-28, -208], [-6, -252], [18, -212], [46, -244], [56, -196], [92, -196], [80, -116]]; sp.forEach(p => g.lineTo(p[0], p[1])); g.lineTo(66, -158); g.lineTo(20, -168); g.lineTo(-30, -160); g.lineTo(-70, -150); g.closePath(); g.fill(); }
  else if (P.style === 'bob') { cap(); g.lineTo(84, -60); g.lineTo(66, -60); g.quadraticCurveTo(64, -140, 20, -164); g.quadraticCurveTo(-40, -150, -66, -132); g.lineTo(-70, -60); g.lineTo(-84, -60); g.closePath(); g.fill(); }
  else if (P.style === 'side') { cap(); g.lineTo(72, -146); g.quadraticCurveTo(10, -150, -30, -176); g.quadraticCurveTo(-60, -160, -72, -140); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,255,255,.15)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-30, -176); g.quadraticCurveTo(-10, -205, 20, -218); g.stroke(); }
  else if (P.style === 'long') { cap(); g.lineTo(74, -100); g.quadraticCurveTo(50, -170, 2, -186); g.quadraticCurveTo(-50, -170, -74, -100); g.closePath(); g.fill(); }
  else if (P.style === 'gray') { g.fillStyle = P.hair; g.beginPath(); g.ellipse(-70, -150, 18, 40, -.2, 0, TAU); g.ellipse(70, -150, 18, 40, .2, 0, TAU); g.fill(); g.beginPath(); g.ellipse(0, -204, 52, 16, 0, 0, TAU); g.fill(); }
  if (P.rim) { g.strokeStyle = P.rim; g.lineWidth = 6; g.globalAlpha = P.rimA ?? .8; g.beginPath(); g.ellipse(0, -128, 72, 84, 0, P.rimSide > 0 ? -1.1 : Math.PI - .4, P.rimSide > 0 ? .4 : Math.PI + 1.1); g.stroke(); g.globalAlpha = 1; }
  g.restore();
  g.restore();
}
function lighten(c) { if (c[0] !== '#' || c.length !== 7) return c; const n = parseInt(c.slice(1), 16), r = Math.min(255, (n >> 16) + 40), gg = Math.min(255, ((n >> 8) & 255) + 40), b = Math.min(255, (n & 255) + 46); return `rgb(${r},${gg},${b})`; }
const P_LIN = { body: CY, bodyD: CYD, style: 'short' };
const P_PENG = { body: YEL, bodyD: YELD, style: 'spiky', hair: '#3a2617', skin: '#f0c098', skinD: '#c08560' };
const P_WANG = { body: PUR, bodyD: PURD, style: 'bob', hair: '#2a1d36', outfit: 'blouse', skin: '#f4cdb0', skinD: '#c7907a' };
const P_LIU = { body: '#5fcf93', bodyD: '#2d8a5c', style: 'side', hair: '#24201c', outfit: 'shirt', shirt: '#dff7ea', tie: '#1f6b47' };
const P_BOSS = { body: '#4a5060', bodyD: '#2a2e38', style: 'gray', hair: '#cfd3da', outfit: 'shirt', tie: '#a33a3a', glasses: true, skin: '#eec3a0' };
const P_A = { body: '#7b8aa6', bodyD: '#465269', style: 'side', hair: '#2b2420', outfit: 'shirt', shirt: '#d9e1ee' };
const P_B = { body: '#b07a52', bodyD: '#6e4a30', style: 'long', hair: '#3b2a22', outfit: 'tee' };
// ---------- per-layer lighting ----------
const PL = mk(W, H), PLX = PL.getContext('2d');
function lit(g, draw, light) {
  PLX.setTransform(1, 0, 0, 1, 0, 0); PLX.globalCompositeOperation = 'source-over'; PLX.globalAlpha = 1; PLX.clearRect(0, 0, W, H);
  PLX.setTransform(g.getTransform()); draw(PLX); PLX.globalCompositeOperation = 'source-atop'; light(PLX); PLX.globalCompositeOperation = 'source-over';
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(PL, 0, 0); g.restore();
}
const FILL = (L, st) => { L.fillStyle = st; L.fillRect(-6000, -6000, 12000, 12000); };
// darkness everywhere except a soft circle
function lightHole(g, x, y, R, dark, col = '4,6,11') { if (dark <= 0) return; g.fillStyle = radial(g, x, y, R * 1.5, [[0, `rgba(${col},0)`], [.55, `rgba(${col},${dark * .08})`], [1, `rgba(${col},${dark})`]]); g.fillRect(-4000, -4000, 8000, 8000); }
// ---------- speech ----------
function who(g, name, col, x, y, t0, t, t1, align = 'left') {
  const a = inv(t0, t0 + .18, t) * (t1 ? 1 - inv(t1 - .18, t1, t) : 1); if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = F(900, 30);
  const w = g.measureText(name).width + 40, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, dy = 10 * (1 - E.outC(inv(t0, t0 + .3, t)));
  rr(g, x0, y - 23 + dy, w, 46, 23); g.fillStyle = col; g.fill(); g.fillStyle = 'rgba(10,10,14,.9)'; g.textBaseline = 'middle'; g.fillText(name, x0 + 20, y + 2 + dy); g.restore();
}
function typeT(g, str, x, y, size, t0, t, o = {}) { // typewriter (per char pop)
  if (t < t0) return; const out = o.t1 ? inv(o.t1 - .2, o.t1, t) : 0; if (out >= 1) return; const cps = o.cps || 14;
  return kText(g, str, x, y, size, { align: o.align || 'left', color: o.color || '#fff', weight: o.weight || 900, alpha: (o.alpha ?? 1) * (1 - out), shadow: o.shadow ?? 'rgba(0,0,0,.8)', sBlur: 20, track: o.track || 0, stroke: o.stroke,
    fn: (i) => { const k = inv(t0 + i / cps, t0 + i / cps + .08, t); return { a: k, s: 1 + .25 * (1 - k) }; } });
}
function danmaku(g, list, t) {
  for (const [s, t0, y, size, v, col] of list) {
    if (t < t0) continue; g.font = F(900, size); const w = g.measureText(s).width, x = W + 40 - v * (t - t0); if (x < -w - 40) continue;
    g.save(); g.globalAlpha = .96; g.lineJoin = 'round'; g.lineWidth = size * .14; g.strokeStyle = 'rgba(0,0,0,.85)'; g.strokeText(s, x, y); g.fillStyle = col || '#fff'; g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 16; g.fillText(s, x, y); g.restore();
  }
}
function sceneTag(g, str, t0, t1, t) { tagT(g, str, 68, 160, t0, t1, t, { size: 34, col: '#cfe6f0', bg: 'rgba(6,10,18,.62)' }); }
function bokeh(g, seed, n, cols, a = 1, t = 0) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H, R = 30 + r() * 110, c = cols[(r() * cols.length) | 0]; glowDot(g, x + Math.sin(t * .3 + i) * 10, y, R, c, a * (.4 + .6 * r())); } }
// ---------- card row (cards scene layout) ----------
const XS = [470, 960, 1450], RT = [-.06, .02, .065], LBL = ['宿舍 · “别卷了”', '会议桌下 · “坐下”', '群聊 · 已读 7'], SMAX = W / 524;
const CHK = [S1E + 1.05, S2E + 1.05, S3E + 1.05], TYPE = ['① 明着拉', '② 为你好', '③ 无声孤立'];
const FRZ = [null, null, null];
function cardPose(i, t, damp = 1) { return { x: XS[i], y: 455 + 6 * Math.sin(t * 1.7 + i * 2) * damp, r: RT[i] + .006 * Math.sin(t * 1.3 + i) * damp }; }
function rowCam(g, i, e) { const S = Math.exp(Math.log(SMAX) * e), f = (S - 1) / (SMAX - 1); g.translate(960, 540); g.rotate(-RT[i] * f); g.scale(S, S); g.translate(-lerp(960, XS[i], f), -lerp(540, 455, f)); }
function rowBG(g) {
  g.fillStyle = radial(g, 960, 480, 1200, [[0, '#141d2c'], [1, '#04060a']]); g.fillRect(-200, -200, W + 400, H + 400);
  g.save(); g.strokeStyle = 'rgba(140,170,220,.05)'; g.lineWidth = 1; for (let x = 0; x <= W; x += 80) { g.beginPath(); g.moveTo(x, -200); g.lineTo(x, H + 200); g.stroke(); } for (let y = 0; y <= H; y += 80) { g.beginPath(); g.moveTo(-200, y); g.lineTo(W + 200, y); g.stroke(); } g.restore();
}
function drawCardImg(g, img, P, sc = 1, dim = 0) {
  g.save(); g.translate(P.x, P.y); g.rotate(P.r); g.scale(sc, sc);
  g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40; g.shadowOffsetY = 18; g.fillStyle = '#eef2f7'; rr(g, -276, -162, 552, 324, 12); g.fill(); g.shadowColor = 'transparent';
  g.drawImage(img, -262, -148, 524, 296); if (dim > 0) { g.fillStyle = `rgba(6,8,14,${dim})`; g.fillRect(-262, -148, 524, 296); } g.restore();
}
function drawCheckLabel(g, i, t) {
  g.save(); g.font = F(700, 38); const tw_ = g.measureText(LBL[i]).width, bx = XS[i] - (tw_ + 62) / 2, ly = 700;
  const c = inv(CHK[i], CHK[i] + .22, t), p = hit(t, CHK[i], .6), bs = 44 * (1 + .35 * p);
  g.save(); g.translate(bx + 22, ly - 13);
  if (c > 0) { g.fillStyle = GOLD; g.shadowColor = GOLD; g.shadowBlur = 10 + 40 * p; rr(g, -bs / 2, -bs / 2, bs, bs, 8); g.fill(); g.shadowBlur = 0; g.strokeStyle = '#2a1a00'; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round';
    const k1 = clamp(c * 2), k2 = clamp(c * 2 - 1); g.beginPath(); g.moveTo(-12, 0); g.lineTo(lerp(-12, -3, k1), lerp(0, 10, k1)); if (k2 > 0) g.lineTo(lerp(-3, 14, k2), lerp(10, -12, k2)); g.stroke(); }
  else { g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 4; rr(g, -bs / 2, -bs / 2, bs, bs, 8); g.stroke(); }
  g.restore(); g.fillStyle = c > 0 ? '#ffe2a6' : '#e8eef6'; g.fillText(LBL[i], bx + 62, ly); g.restore();
}
function cardImgAt(i, t) { if (i === 2 && t >= S2E && t < S3E - .01) return getPRE3(); return FRZ[i] && t >= SC_T[i][1] - .01 ? FRZ[i] : CARDS[i]; }
// o: {focus, e (0 row … 1 full), dim}
function rowScene(g, t, o = {}) {
  const f = o.focus ?? -1, e = o.e || 0;
  g.save(); if (f >= 0 && e > 0) rowCam(g, f, e);
  rowBG(g);
  for (let i = 0; i < 3; i++) { drawCardImg(g, cardImgAt(i, t), cardPose(i, t, i === f ? 1 - e : 1), 1, i === f ? 0 : (o.dim || 0) * (t >= SC_T[i][1] ? 0 : 1)); drawCheckLabel(g, i, t); }
  g.restore();
}
function getFRZ(i) { if (!FRZ[i]) { const c = mk(W, H), cg = c.getContext('2d'); SCENES[i](cg, SC_T[i][1] - .02); FRZ[i] = c; } return FRZ[i]; }
// row segment between scene i end and scene i+1 start (or WHY)
function rowSegment(g, t, i) {
  const a = SC_T[i][1], shrink = E.ioE(inv(a, a + .6, t)); getFRZ(i);
  const nx = i < 2 ? SC_T[i + 1][0] : 1e9, push = i < 2 ? E.inE(inv(nx - PUSH, nx, t)) : 0;
  if (push > 0) { rowScene(g, t, { focus: i + 1, e: push }); const xf = inv(.72, 1, push); if (xf > 0) { g.save(); g.globalAlpha = xf; SCENES[i + 1](g, nx); g.restore(); } }
  else rowScene(g, t, { focus: i, e: 1 - shrink, dim: .35 });
  if (push <= 0) slamT(g, TYPE[i], 960, 925, 104, CHK[i] + .2, t, { color: (k) => k < 1 ? '#fff' : GOLD, stroke: ['#1a1000', 10] });
}
// phone body; draws screen content via fn in screen coords (-290..290, -580..580)
function phone(g, x, y, rot, s, fn) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 60; g.shadowOffsetY = 30; rr(g, -310, -600, 620, 1200, 64); g.fillStyle = '#0d1016'; g.fill(); g.shadowColor = 'transparent';
  g.strokeStyle = '#2d3443'; g.lineWidth = 6; g.stroke();
  g.save(); rr(g, -290, -580, 580, 1160, 50); g.clip(); fn(g); g.restore();
  g.fillStyle = '#05070a'; rr(g, -70, -566, 140, 34, 17); g.fill();
  g.restore();
}
function avatar(g, x, y, r, ch, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.font = F(900, r * .95); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(ch, x, y + 2); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; }
function msgL(g, y, ch, col, txt, a = 1, sc = 1) { // incoming message; returns height
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(-230, y); g.scale(sc, sc); avatar(g, 0, 0, 30, ch, col); g.font = F(500, 34); const w = g.measureText(txt).width + 44; g.fillStyle = '#262d39'; rr(g, 45, -34, w, 68, 20); g.fill(); g.fillStyle = '#d5dbe5'; g.fillText(txt, 67, 12); g.restore();
}
