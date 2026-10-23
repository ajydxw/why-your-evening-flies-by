// ================= ⑦ 伸手 (FIN – end) =================
const E_CAP = [Q(162), Q(164)], E_PUSH = Q(165.4), GRIP = Q(168), E_LAND = Q(169.4), E_HAND = Q(170), E_DORM = Q(171.5), E_OUT = Q(179), E_Q = Q(181), E_SIGN = Q(184.5), E_END = Q(188);
const SKY_D = [[0, '#140c22'], [.45, '#3a2140'], [.66, '#8a3f45'], [.85, '#f08a4e'], [1, '#ffdba2']];
const DAWN = { sky: SKY_D, skyGlow: 'rgba(255,170,100,.4)', ground: '#140b09', ray: '255,206,150', rayA: 1.4, dust: '#ffe6c0', tint: 'rgba(110,60,20,.1)', inGlow: 'rgba(255,190,120,.2)',
  pre: g => { glowDot(g, 700, 190, 1100, 'rgba(255,160,80,.45)'); g.fillStyle = radial(g, 700, 205, 120, [[0, '#fffbe8'], [.6, '#ffe2a0'], [1, '#ffb768']]); g.beginPath(); g.arc(700, 205, 112, 0, TAU); g.fill(); glowDot(g, 700, 190, 320, 'rgba(255,230,170,.6)'); } };
function endCam(t) {
  const a = E.ioS(inv(FIN, E_PUSH, t)), b = E.ioC(inv(E_PUSH, E_PUSH + 1.25, t)), c = E.ioS(inv(E_LAND, E_HAND, t));
  const w = [lerp(960, 940, a), lerp(390, 370, a), lerp(.95, 1.0, a)], n = [900, 232, 1.7], f = [945, 200, 1.6];
  return [lerp(lerp(w[0], n[0], b), f[0], c), lerp(lerp(w[1], n[1], b), f[1], c), lerp(lerp(w[2], n[2], b), f[2], c)];
}
const rimLegs = (c, x, sp = 1) => [[x - 112 * sp, 180], [x - 132 * sp, 184], [x - 96 * sp, 190], [x + 78 * sp, 186], [x + 104 * sp, 190], [x + 64 * sp, 192]].map(p => toLocal(c, p[0], p[1]));
function endCrabs(t) {
  const cy = Object.assign({ s: 1, brow: .1 }, CYAN), og = { s: .95, brow: -.5, look: [0, -1] };
  // --- cyan on the rim (regrown leg = a little shorter)
  const walk = E.ioS(inv(Q(164), E_PUSH, t)), lean = E.ioC(inv(E_PUSH + .1, Q(166.8), t)), pull = E.ioC(inv(GRIP + .15, E_LAND, t)), rel = E.outC(inv(E_LAND + .1, E_LAND + .5, t));
  cy.x = lerp(700, 852, walk) - 42 * pull; cy.y = 112 + 18 * lean * (1 - pull) + 2 * Math.sin(t * 2); cy.rot = .82 * lean * (1 - pull) - .18 * Math.sin(Math.PI * pull);
  const L = legsRest(t * (walk > 0 && walk < 1 ? 12 : 3), walk > 0 && walk < 1 ? 11 : 1.5); L[5] = [L[5][0] * .8, L[5][1] * .8];
  if (lean > 0) { const R = rimLegs(cy, cy.x); for (let i = 0; i < 6; i++) L[i] = mix2(L[i], i === 5 ? [R[i][0] * .9, R[i][1] * .9] : R[i], lean * (1 - rel)); }
  cy.legs = L;
  const lookSky = 1 - E.ioS(inv(Q(161.3), Q(161.9), t));
  cy.look = mix2([.25, .85], [-.1, -1], lookSky); cy.cl = [-82, -104 + 3 * Math.sin(t * 2)]; cy.cr = [82, -104]; cy.openL = cy.openR = .3;
  // --- orange climbs the inside wall
  const slip = hit(t, Q(163), .5), cl = inv(FIN, Q(166), t);
  let ox = 905 + 6 * Math.sin(t * 5), oy = lerp(660, 430, E.ioS(cl)) + 45 * slip, orot = .04 * Math.sin(t * 4);
  og.legs = legsRest(t * 9, 12 * (1 - pull)); og.cl = [-74 + 12 * Math.sin(t * 6), -126 + 14 * Math.sin(t * 5)]; og.cr = [70, -128 + 10 * Math.sin(t * 6 + 2)]; og.openL = og.openR = .5;
  og.brow = slip > .1 ? -.9 : -.5;
  // --- reach & grip
  const G0 = [893, 262], reach = E.ioC(inv(Q(166.2), GRIP, t)), wig = (1 - reach) * 14;
  if (t >= E_PUSH) {
    const top = [G0[0] + 6, G0[1] - 8 - 60 * (1 - reach)], bot = [G0[0] - 6, G0[1] + 8 + 50 * (1 - reach)];
    let G = G0;
    if (pull > 0) { ox = lerp(905, 1060, E.ioS(pull)); oy = lerp(430, 112, pull) - 150 * Math.sin(Math.PI * pull) * pull; orot = -.35 * Math.sin(Math.PI * pull); G = [lerp(G0[0], 950, pull), lerp(G0[1], 60, pull) - 40 * Math.sin(Math.PI * pull)]; }
    const ct = pull > 0 ? [G[0] + 6, G[1] - 8] : [top[0] + wig * Math.sin(t * 9), top[1]], ot = pull > 0 ? [G[0] - 6, G[1] + 8] : [bot[0] + wig * Math.sin(t * 8 + 1), bot[1]];
    const cyR = toLocal(cy, ...ct); cy.cr = mix2(mix2([82, -104], cyR, E.outC(inv(E_PUSH + .3, E_PUSH + .9, t))), [82, -104], rel);
    og.x = ox; og.y = oy; og.rot = orot; const ogL = toLocal(og, ...ot); og.cl = mix2(mix2(og.cl, ogL, E.outC(inv(E_PUSH + .5, Q(166.8), t))), [-82, -104], rel);
    const shut = E.outC(inv(GRIP - .06, GRIP + .04, t)) * (1 - rel); cy.openR = lerp(.65, .05, shut); og.openL = lerp(.65, .05, shut);
    cy.look = mix2([.35, .9], [.9, .1], E.ioS(inv(E_LAND, E_LAND + .4, t))); og.look = mix2([-.2, -1], [-.9, -.1], E.ioS(inv(E_LAND, E_LAND + .4, t)));
    og.brow = lerp(og.brow, -.25, E.outC(inv(GRIP, GRIP + .3, t))); cy.brow = lerp(.6, -.1, rel);
    if (pull >= 1) { og.legs = legsRest(t * 3, 1.5); og.sq = hit(t, E_LAND, .4); }
    const jy = E.outC(inv(E_LAND + .2, E_LAND + .5, t)); if (jy > 0) { cy.joy = og.joy = jy; if (jy > .5) { cy.brow = og.brow = undefined; } }
  }
  og.x = ox; og.y = oy; og.rot = orot;
  return { cy, og, pull, rel };
}
function scene7basket(g, t) {
  g.fillStyle = '#0a0608'; g.fillRect(0, 0, W, H);
  const [cx, cyy, s] = endCam(t), S = endCrabs(t), T = t;
  g.save(); cam(g, cx, cyy, s);
  drawBasket(g, t, DAWN);
  PILE.forEach(([x, y, r, ph], j) => drawCrab(g, x, y, { x, y, rot: r, s: CS * .95, legs: legsRest(T * 3 + ph, 3), look: [clamp((S.og.x - x) / 300, -1, 1), -.9], cl: [-82, -96 + 4 * Math.sin(T * 2 + j)], cr: [82, -96], openL: .3, openR: .3, brow: -.2 }));
  const og = S.og; g.save(); if (og.sq > 0) { g.translate(og.x, og.y + 60); g.scale(1 + og.sq * .12, 1 - og.sq * .14); g.translate(-og.x, -og.y - 60); } drawCrab(g, og.x, og.y, og); g.restore();
  drawCrab(g, S.cy.x, S.cy.y, S.cy);
  // grip glow
  const gk = inv(GRIP - .05, GRIP + .1, t) * (1 - inv(E_LAND + .2, E_LAND + .6, t));
  if (gk > 0) { const p = crabPt(S.cy, ...S.cy.cr); glowDot(g, p[0], p[1], 120 + 30 * Math.sin(t * 8), `rgba(255,214,140,${.75 * gk})`);
    const u = t - GRIP; if (u > 0 && u < .7) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,226,170,${1 - u / .7})`; g.lineWidth = 5 * (1 - u / .7); g.beginPath(); g.arc(p[0], p[1], 16 + 170 * E.outC(u / .7), 0, TAU); g.stroke();
      const r = rng(17); for (let i = 0; i < 14; i++) { const a = r() * TAU, d = (40 + r() * 140) * E.outC(u / .7); g.globalAlpha = 1 - u / .7; g.fillStyle = r() < .5 ? GOLD : '#fff'; g.beginPath(); g.arc(p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d, 2 + 2 * r(), 0, TAU); g.fill(); } g.restore(); } }
  if (t > E_LAND + .25) { const k = E.outB(inv(E_LAND + .25, E_LAND + .55, t)); heart(g, 945, -30 - 10 * Math.sin(t * 3), 2.4 * k, '#ff6d86'); glowDot(g, 945, -30, 60, `rgba(255,110,134,${.4 * k})`); }
  g.restore();
  warmGrade(g, .22, '#ffb060', '#401600');
  const fo = inv(Q(165.2), E_PUSH + .2, t);
  rise(g, '爬出去之后，', 1420, 160, 64, E_CAP[0], t, { color: '#ffe8cc', t1: E_PUSH + .2 });
  slamT(g, '记得伸手。', 1420, 300, 124, E_CAP[1], t, { t1: E_PUSH + .2, color: (i) => i >= 2 && i <= 3 ? GOLD : '#fff', stroke: ['rgba(40,12,0,.7)', 12] });
  const fi = 1 - E.ioS(inv(FIN, FIN + .6, t)); if (fi > 0) { g.fillStyle = `rgba(255,232,190,${fi})`; g.fillRect(0, 0, W, H); }
}
// ---------- the human echo: two hands (backlit silhouette, wrist grip) ----------
function claspParts() {
  const skin = [], P = () => { const q = new Path2D(); skin.push(q); return q; };
  const cap = (x0, y0, x1, y1, r) => { const q = P(), a = Math.atan2(y1 - y0, x1 - x0), n = a + Math.PI / 2; q.moveTo(x0 + Math.cos(n) * r, y0 + Math.sin(n) * r); q.arc(x0, y0, r, n, n + Math.PI); q.arc(x1, y1, r, n + Math.PI, n + TAU); q.closePath(); };
  const dot = (x, y, r) => { const q = P(); q.arc(x, y, r, 0, TAU); };
  let q = P(); q.moveTo(-340, -64); q.quadraticCurveTo(-160, -50, -40, -44); q.lineTo(-40, 44); q.quadraticCurveTo(-160, 50, -340, 64); q.closePath();
  q = P(); q.moveTo(340, -66); q.quadraticCurveTo(160, -52, 40, -46); q.lineTo(40, 46); q.quadraticCurveTo(160, 52, 340, 66); q.closePath();
  q = P(); q.moveTo(-50, -46); q.bezierCurveTo(10, -70, 100, -70, 132, -46); q.bezierCurveTo(146, -10, 140, 40, 118, 62); q.lineTo(-30, 50); q.closePath();
  [[18, 56], [46, 64], [74, 64], [100, 58]].forEach(([x, y]) => dot(x, y, 15)); cap(-20, -50, 66, -76, 17);
  q = P(); q.moveTo(50, 46); q.bezierCurveTo(-10, 70, -100, 70, -132, 46); q.bezierCurveTo(-146, 10, -140, -40, -118, -62); q.lineTo(30, -50); q.closePath();
  [[-18, -56], [-46, -64], [-74, -64], [-100, -58]].forEach(([x, y]) => dot(x, y, 15)); cap(20, 50, -66, 76, 17);
  const slA = new Path2D(), slB = new Path2D();
  slA.moveTo(-1900, -104); slA.lineTo(-300, -84); slA.quadraticCurveTo(-268, 0, -300, 84); slA.lineTo(-1900, 104); slA.closePath();
  slB.moveTo(1900, -108); slB.lineTo(300, -88); slB.quadraticCurveTo(268, 0, 300, 88); slB.lineTo(1900, 108); slB.closePath();
  return { skin, slA, slB };
}
let CLASP = null;
function drawClasp(g, cx, cy, s, rot, t, sun = 1) {
  if (!CLASP) CLASP = claspParts();
  const { skin, slA, slB } = CLASP;
  g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(s, s); g.lineJoin = 'round';
  // rim light (stroke under the fills = thin bright edge) + bloom
  g.save(); g.shadowColor = `rgba(255,214,150,${.9 * sun})`; g.shadowBlur = 60;
  g.lineWidth = 9; g.strokeStyle = 'rgba(255,236,196,.95)'; g.stroke(slA); g.stroke(slB); skin.forEach(q => g.stroke(q)); g.restore();
  g.fillStyle = linear(g, 0, -80, 0, 80, [[0, '#4a2a1c'], [.5, '#2c160e'], [1, '#1c0d08']]); skin.forEach(q => g.fill(q));
  g.fillStyle = linear(g, 0, -90, 0, 90, [[0, '#1d6866'], [.45, '#0f3c3d'], [1, '#082224']]); g.fill(slA);
  g.fillStyle = linear(g, 0, -90, 0, 90, [[0, '#7a5a14'], [.45, '#4a3408'], [1, '#2a1c04']]); g.fill(slB);
  // cuff seams + sleeve sheen
  g.strokeStyle = 'rgba(120,255,240,.35)'; g.lineWidth = 4; g.beginPath(); g.moveTo(-360, -86); g.quadraticCurveTo(-330, 0, -360, 86); g.stroke();
  g.strokeStyle = 'rgba(255,220,120,.35)'; g.beginPath(); g.moveTo(360, -90); g.quadraticCurveTo(330, 0, 360, 90); g.stroke();
  g.fillStyle = 'rgba(140,255,245,.18)'; g.fillRect(-1900, -92, 1560, 10); g.fillStyle = 'rgba(255,226,140,.18)'; g.fillRect(340, -96, 1560, 10);
  // knuckle / finger separations (faint warm fill-light)
  g.strokeStyle = 'rgba(255,190,140,.30)'; g.lineWidth = 3.5; g.lineCap = 'round';
  for (const sg of [1, -1]) { [32, 60, 87].forEach(x => { g.beginPath(); g.moveTo(sg * x, sg * -8); g.quadraticCurveTo(sg * (x + 4), sg * 30, sg * (x - 2), sg * 66); g.stroke(); });
    g.beginPath(); g.moveTo(sg * -6, sg * -40); g.quadraticCurveTo(sg * 60, sg * -60, sg * 128, sg * -40); g.stroke(); }
  g.strokeStyle = 'rgba(255,214,160,.45)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-40, -20); g.quadraticCurveTo(0, 0, 40, 20); g.stroke();
  g.restore();
}
function sceneHands(g, t) {
  const u = t - E_HAND, D = E_DORM - E_HAND, k = E.ioS(inv(0, D, u));
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#2a1430'], [.38, '#8a3a3e'], [.7, '#f08a4e'], [1, '#ffcf8f']]); g.fillRect(0, 0, W, H);
  const sx = 1000, sy = 560 - 30 * k;
  glowDot(g, sx, sy, 1100, 'rgba(255,170,90,.55)');
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const a = i * TAU / 14 + .1 * t; g.fillStyle = linear(g, sx, sy, sx + Math.cos(a) * 1300, sy + Math.sin(a) * 1300, [[0, 'rgba(255,230,170,.18)'], [1, 'rgba(255,230,170,0)']]); g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(a - .05) * 1800, sy + Math.sin(a - .05) * 1800); g.lineTo(sx + Math.cos(a + .05) * 1800, sy + Math.sin(a + .05) * 1800); g.closePath(); g.fill(); } g.restore();
  g.fillStyle = radial(g, sx, sy, 250, [[0, '#fffdf2'], [.55, '#fff0c4'], [.85, '#ffd48a'], [1, 'rgba(255,190,110,0)']]); g.beginPath(); g.arc(sx, sy, 250, 0, TAU); g.fill();
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linear(g, 0, sy - 6, 0, sy + 6, [[0, 'rgba(255,240,200,0)'], [.5, 'rgba(255,240,200,.55)'], [1, 'rgba(255,240,200,0)']]); g.fillRect(0, sy - 6, W, 12); g.restore();
  bokeh(g, 23, 14, ['rgba(255,220,160,.28)', 'rgba(255,160,90,.2)'], .9, t);
  drawClasp(g, 985 + 10 * k, 590 - 60 * k, 1.55 + .1 * k, .84 - .05 * k, t);
  glowDot(g, sx, sy, 300, 'rgba(255,240,200,.25)');
  vignette(g, .55);
  const fi = 1 - inv(0, .14, u); if (fi > 0) { g.fillStyle = `rgba(255,236,200,${fi * .85})`; g.fillRect(0, 0, W, H); }
}
// ---------- dorm, warm ----------
function zipCard(g, x, y, s, sent) {
  g.save(); g.translate(x, y); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; g.shadowOffsetY = 12; rr(g, -270, -70, 540, 140, 22); g.fillStyle = '#f7f3ec'; g.fill(); g.shadowColor = 'transparent';
  g.fillStyle = '#f3b33d'; rr(g, -245, -46, 84, 96, 10); g.fill(); g.fillStyle = '#d58f1c'; g.beginPath(); g.moveTo(-185, -46); g.lineTo(-161, -46); g.lineTo(-161, -22); g.closePath(); g.fill();
  g.fillStyle = '#6a4508'; for (let i = 0; i < 5; i++) g.fillRect(-207 + (i % 2) * 8, -40 + i * 12, 8, 7); g.font = F(900, 20); g.textAlign = 'center'; g.fillText('ZIP', -203, 38); g.textAlign = 'left';
  g.fillStyle = '#1d2430'; g.font = F(900, 34); g.fillText('考证资料合集.zip', -140, -8); g.fillStyle = '#7a8496'; g.font = F(500, 24); g.fillText('2.3 GB', -140, 32);
  if (sent > 0) { g.globalAlpha = sent; g.fillStyle = '#07a556'; g.font = F(700, 26); g.textAlign = 'right'; g.fillText('已发送 ✓', 245, 32); g.textAlign = 'left'; }
  g.restore();
}
function sceneDorm(g, t) {
  const u = t - E_DORM, z = 1.02 + .04 * E.ioS(inv(0, E_OUT - E_DORM, u)), ans = Q(175.5), cardT = Q(176.5), ring = Q(177.3);
  const happy = t > ring - .1;
  g.save(); cam(g, 960, 560, z);
  dormRoom(g, t, { lin: false, lamp: 1.5, glow: .6, peng: [1470, 520, 1.0], pengF: { mouth: happy ? 'grin' : (t > Q(172.3) && t < Q(174.2) ? (Math.sin(t * 24) > 0 ? 'o' : 'smile') : 'smile'), eyes: happy ? 'happy' : 'open', brow: happy ? 0 : -.35, look: [-1, .15], tilt: .07 + .04 * Math.sin(t * 1.7) } , screen: 'pass' });
  lit(g, L => drawPerson(L, 430, 690, 1.05, Object.assign({}, P_LIN, { mouth: t > ans && t < ans + .9 ? (Math.sin(t * 22) > 0 ? 'open' : 'smile') : 'smile', eyes: happy ? 'happy' : 'open', look: [1, -.1], tilt: -.05, brow: 0 })),
    L => { FILL(L, linear(L, 0, 0, 900, 0, [[0, 'rgba(255,170,90,.18)'], [1, 'rgba(255,210,150,.08)']])); });
  g.restore();
  warmGrade(g, .5, '#ffb050', '#4a1a00');
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 420, 560, 900, [[0, 'rgba(255,170,90,.22)'], [1, 'rgba(255,170,90,0)']]); g.fillRect(0, 0, W, H); g.restore();
  // dialogue
  who(g, '大鹏', YEL, 1000, 170, Q(172), t, E_OUT);
  typeT(g, '那个证……', 1000, 270, 58, Q(172.3), t, { color: '#fff1d6', weight: 700, cps: 7, t1: E_OUT });
  typeT(g, '你怎么复习的？', 1000, 350, 58, Q(173.1), t, { color: '#fff1d6', weight: 700, cps: 9, t1: E_OUT });
  who(g, '林默', CY, 120, 180, ans - .1, t, E_OUT);
  typeT(g, '来，资料发你。', 120, 280, 62, ans, t, { color: '#c8fbf6', weight: 700, cps: 9, t1: E_OUT });
  // file flies from Lin to 大鹏
  const fk = inv(cardT, cardT + .7, t);
  if (fk > 0) { const e = E.ioC(fk), x = lerp(520, 1220, e), y = lerp(620, 700, e) - 160 * Math.sin(Math.PI * e), s = .55 + .45 * E.outB(inv(cardT, cardT + .25, t)) - .1 * Math.sin(Math.PI * e);
    zipCard(g, x, y + 4 * Math.sin(t * 2), s, inv(cardT + .7, cardT + .9, t)); }
  // warm light ring
  const rk = inv(ring, ring + 1.6, t); if (rk > 0 && rk < 1) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,214,150,${.6 * (1 - rk)})`; g.lineWidth = 30 * (1 - rk) + 4; g.beginPath(); g.arc(1220, 700, 40 + 1400 * E.outC(rk), 0, TAU); g.stroke(); g.restore(); }
  if (t > ring) glowDot(g, 960, 540, 1200, `rgba(255,200,130,${.18 * E.outC(inv(ring, ring + 1, t))})`);
  const fo = E.ioS(inv(E_OUT, Q(180.5), t)); if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }
  const fi = 1 - inv(E_DORM, E_DORM + .12, t); if (fi > 0) { g.fillStyle = `rgba(255,236,200,${fi * .6})`; g.fillRect(0, 0, W, H); }
}
function sceneQuestion(g, t) {
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  glowDot(g, 960, 540, 700, `rgba(255,120,70,${.07 * inv(E_Q, E_Q + 1.5, t)})`);
  typeT(g, '你有没有，当过别人的那只钳子？', 960, 575, 80, E_Q, t, { align: 'center', weight: 900, cps: 8, color: (i) => i >= 12 && i <= 13 ? ORG : '#fff', shadow: false });
  rise(g, '没有盖子的竹篓', 960, 770, 42, E_SIGN, t, { color: 'rgba(255,210,122,.8)', track: .3, shadow: false });
  const lk = E.ioS(inv(E_SIGN + .2, E_SIGN + 1.2, t)); if (lk > 0) { g.fillStyle = 'rgba(255,210,122,.45)'; g.fillRect(960 - 220 - 120 * lk, 756, 120 * lk, 2); g.fillRect(960 + 220, 756, 120 * lk, 2); }
  const fo = E.ioS(inv(E_END - .9, E_END - .05, t)); if (fo > 0) { g.fillStyle = `rgba(0,0,0,${fo})`; g.fillRect(0, 0, W, H); }
}
function scene7(g, t) { if (t < E_HAND) scene7basket(g, t); else if (t < E_DORM) sceneHands(g, t); else if (t < Q(180.6)) sceneDorm(g, t); else sceneQuestion(g, t); }
