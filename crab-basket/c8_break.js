// ================= ⑥ 破局 (BRK – FIN) =================
const BK1 = Q(124), BKL = Q(125), BKN = Q(125.3), BKT = Q(126), BKS = Q(126.8), Z1 = Q(128), Z2 = Q(140), Z3 = Q(152), FIN = Q(160);
function warmGrade(g, k, c0 = '#e08a40', c1 = '#3a1000') { if (k <= 0) return; g.save(); g.globalCompositeOperation = 'soft-light'; g.globalAlpha = clamp(k); g.fillStyle = linear(g, 0, 0, 0, H, [[0, c0], [1, c1]]); g.fillRect(0, 0, W, H); g.restore(); }
const SKY_N = [[0, '#06060a'], [.62, '#221a20'], [1, '#7a6052']];
// ---------- auto-tomy: the cyan crab drops its gripped leg ----------
function autoPre(t) {
  const c = Object.assign({ s: 1 }, CYAN);
  const tug = [[Q(121), .55], [Q(122), .8], [Q(123), 1]].reduce((s, [t0, a]) => { const u = (t - t0) / .42; return s + (u < 0 || u > 1 ? 0 : a * Math.sin(Math.PI * u) * Math.pow(1 - u, .4)); }, 0);
  const st = inv(BRK, BK1, t), shv = st * st;
  const gx = 1150 + 5 * nz(t * 4, 3), gy = 330 + 38 * tug + 5 * Math.sin(t * 31) * shv;
  c.x = 1050 + 3 * nz(t * 6, 1) + 3 * Math.sin(t * 37) * shv; c.y = 150 + 15 * tug - 8 * shv; c.rot = -.15 - .09 * tug + .04 * Math.sin(t * 8.5);
  const L = legsRest(t * 15, 9);
  L[5] = toLocal(c, gx + 2, gy - 11); c.legs = L;
  c.cl = [-98 + 10 * Math.sin(t * 9), -128 + 12 * Math.sin(t * 7)]; c.cr = [42 + 8 * Math.sin(t * 8 + 1), -162 + 10 * Math.sin(t * 6.5)];
  c.openL = .5 + .3 * Math.sin(t * 9); c.openR = .5 + .3 * Math.sin(t * 8);
  const dec = E.ioS(inv(Q(122.6), Q(123.3), t));
  c.look = mix2([.55, .8], [-.75, -.6], dec); c.brow = lerp(-.7, .9, dec);
  return { c, claw: { x: gx, y: gy, ang: -1.38 + .05 * tug, open: .04, s: 1.35 }, tug };
}
let AUTO0 = null;
function autoState(t) {
  if (t < BK1) { const S = autoPre(t); S.seg = null; return S; }
  if (!AUTO0) { const P = autoPre(BK1 - .001), hp = crabPt(P.c, ...HIP[5]), tp = crabPt(P.c, ...P.c.legs[5]); AUTO0 = { P, v: [lerp(hp[0], tp[0], .42) - tp[0], lerp(hp[1], tp[1], .42) - tp[1]] }; }
  const P0 = AUTO0.P, u = t - BK1, c = Object.assign({ s: 1 }, CYAN);
  // claw recoils + sinks, still holding the severed piece
  const fall = E.inQ(inv(BK1, BK1 + 1.05, t)), rec = E.outC(inv(BK1, BK1 + .12, t)), dA = .55 * E.outC(inv(BK1, BK1 + .7, t)) + .12 * Math.sin(u * 9) * Math.exp(-u * 3);
  const claw = { x: P0.claw.x + 26 * rec + 40 * fall, y: P0.claw.y + 46 * rec + 640 * fall, ang: P0.claw.ang + dA, open: .04 + .1 * rec, s: 1.35 };
  const tip = [claw.x + Math.cos(claw.ang) * 2 + 2, claw.y + Math.sin(claw.ang) * 11 - 11], fl = dA + .7 * Math.sin(u * 13) * Math.exp(-u * 4), cs = Math.cos(fl), sn = Math.sin(fl);
  const seg = [tip, [tip[0] + AUTO0.v[0] * cs - AUTO0.v[1] * sn, tip[1] + AUTO0.v[0] * sn + AUTO0.v[1] * cs]];
  // jump + backflip to the rim
  const p = inv(BK1 + .03, BKL, t), x1 = 760, y1 = 112;
  if (t < BKL) {
    c.x = lerp(P0.c.x, x1, E.ioS(p)); c.y = lerp(P0.c.y, y1, p) - 170 * 4 * p * (1 - p); c.rot = lerp(P0.c.rot, 0, p) - TAU * E.ioS(p);
    c.legs = legsRest(t * 20, 3).map(([a, b]) => [a * .72, b * .72]); c.cl = [-62, -96]; c.cr = [62, -96]; c.openL = c.openR = .15; c.look = [-.6, -.8]; c.brow = .9;
  } else {
    const w = t - BKL; c.x = x1; c.y = y1 + 2 * Math.sin(w * 3); c.rot = .02 * Math.sin(w * 2.1);
    c.legs = legsRest(w * 3, 2 * Math.exp(-w * 2) + .8);
    const lk = E.ioS(inv(BKL + .25, BKL + .6, t)) * (1 - E.ioS(inv(BKL + 1.0, BKL + 1.35, t)));
    c.look = mix2([-.3, -.95], [.75, .55], lk); c.brow = lerp(.85, .2, lk);
    const ready = E.outB(inv(BKL + 1.1, BKL + 1.5, t));
    c.cl = mix2([-80, -104], [-92, -138], ready); c.cr = mix2([80, -104], [92, -138], ready); c.openL = c.openR = .3 + .2 * ready;
  }
  c.legs[5] = [76, 40, 'stump'];
  c.sq = hit(t, BKL, .4);
  return { c, claw, seg, fall };
}
function autoCam(t) {
  const a = E.ioS(inv(BRK, BK1, t)), pre = [lerp(1105, 1090, a), 200, lerp(1.78, 1.98, a)];
  const k = E.outC(inv(BK1 + .02, BKL, t)), k2 = E.ioS(inv(BKL, Z1, t)), mid = [900, 120, 1.3], end = [1080, 250, 1.08];
  const punch = 1 + .05 * hit(t, BK1, .3);
  return [lerp(lerp(pre[0], mid[0], k), end[0], k2), lerp(lerp(pre[1], mid[1], k), end[1], k2), lerp(lerp(pre[2], mid[2], k), end[2], k2) * punch];
}
function drawSeg(g, seg) { // severed leg piece
  const [a, b] = seg; g.lineCap = 'round';
  g.strokeStyle = CYD; g.lineWidth = 13; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
  g.strokeStyle = CY; g.lineWidth = 6.5; g.stroke(); g.fillStyle = '#eafffb'; g.beginPath(); g.arc(b[0], b[1], 6, 0, TAU); g.fill();
}
function sceneAuto(g, t) {
  const warm = .1 + .28 * E.ioS(inv(BK1, BKT, t));
  g.fillStyle = '#05060a'; g.fillRect(0, 0, W, H);
  const [cx, cy, s] = autoCam(t), S = autoState(t), c = S.c;
  g.save(); cam(g, cx, cy, s);
  drawBasket(g, t, { sky: SKY_N, skyGlow: `rgba(255,190,130,${.12 + .2 * warm})`, ray: '255,214,160', rayA: .6 + warm, dust: '#ffe2bc', tint: 'rgba(90,50,20,.08)', inGlow: 'rgba(255,190,130,.12)' });
  // regrow bud glow, then the crab
  g.save(); if (c.sq > 0) { g.translate(c.x, c.y + 60); g.scale(1 + c.sq * .14, 1 - c.sq * .16); g.translate(-c.x, -c.y - 60); }
  drawCrab(g, c.x, c.y, c); g.restore();
  if (S.seg) drawSeg(g, S.seg);
  bigClaw(g, S.claw.x, S.claw.y, S.claw.s, S.claw.open, S.claw.ang);
  if (t >= BKN) { const sp = crabPt(c, 76, 40), k = E.outC(inv(BKN, BKN + .5, t)); glowDot(g, sp[0], sp[1], 40 + 10 * Math.sin(t * 6), `rgba(180,255,248,${.75 * k})`); }
  // break fx: shell bits
  const u = t - BK1;
  if (u >= 0 && u < .9) { const r = rng(44), B = AUTO0 ? [AUTO0.P.claw.x + AUTO0.v[0], AUTO0.P.claw.y - 11 + AUTO0.v[1]] : [0, 0];
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) { const a = r() * TAU, v = 120 + r() * 320, x = B[0] + Math.cos(a) * v * u, y = B[1] + Math.sin(a) * v * u + 500 * u * u; g.globalAlpha = 1 - u / .9; g.fillStyle = r() < .5 ? CYL : '#fff'; g.save(); g.translate(x, y); g.rotate(u * 9 * (r() - .5)); g.fillRect(-4, -2, 8 + 6 * r(), 4); g.restore(); }
    g.strokeStyle = `rgba(255,255,255,${1 - u / .35})`; g.lineWidth = 3; if (u < .35) for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + .3, r0 = 14 + 90 * E.outC(u / .35); g.beginPath(); g.moveTo(B[0] + Math.cos(a) * r0 * .5, B[1] + Math.sin(a) * r0 * .5); g.lineTo(B[0] + Math.cos(a) * r0, B[1] + Math.sin(a) * r0); g.stroke(); }
    g.restore(); }
  // landing dust
  const w = t - BKL; if (w >= 0 && w < 1) { const r = rng(61); for (let i = 0; i < 18; i++) { const sd = i % 2 ? 1 : -1, x = 760 + sd * (40 + r() * 40) + sd * (60 + r() * 160) * w, y = 176 - (40 + r() * 120) * w + 260 * w * w; g.globalAlpha = (1 - w) * .85; g.fillStyle = r() < .5 ? '#e8d2a8' : '#9a8460'; g.fillRect(x - 4, y - 1.5, 8 + r() * 5, 3); } g.globalAlpha = 1; }
  g.restore();
  warmGrade(g, warm);
  // 咔
  if (AUTO0 && u >= 0 && u < .5) { const B = [AUTO0.P.claw.x + AUTO0.v[0], AUTO0.P.claw.y - 11 + AUTO0.v[1]], ac = autoCam(BK1), sx = 960 + (B[0] - ac[0]) * ac[2] + 210, sy = 540 + (B[1] - ac[1]) * ac[2] - 30;
    burst(g, sx, sy, E.outB(inv(BK1, BK1 + .14, t)) * (1 - E.inC(inv(BK1 + .3, BK1 + .48, t))) * 1.35, '咔！', '#fff3c4', '#d0301f'); }
  // captions
  rise(g, '被钳住的时候，', 110, 200, 60, Q(120.8), t, { align: 'left', t1: BK1 + .25 });
  rise(g, '有的螃蟹会——', 110, 300, 60, Q(122.2), t, { align: 'left', t1: BK1 + .25, color: '#ffd9a8' });
  const dim = E.ioS(inv(BKT - .5, BKT, t)); if (dim > 0) { g.fillStyle = linear(g, 700, 0, W, 0, [[0, 'rgba(14,6,2,0)'], [.35, `rgba(14,6,2,${.62 * dim})`], [1, `rgba(14,6,2,${.8 * dim})`]]); g.fillRect(0, 0, W, H); }
  const fa = inv(BKN, BKN + .3, t) * (1 - inv(Z1 - .25, Z1, t));
  if (fa > 0) kText(g, '＊螃蟹遇险时会主动断肢逃生，断肢还能再长出来。', 960, 1030, 32, { align: 'center', weight: 500, color: '#f3e2cc', alpha: fa * .9, shadow: 'rgba(0,0,0,.9)', sBlur: 12 });
  if (t >= BKT - .2) glowDot(g, 1330, 440, 520, `rgba(255,180,90,${.3 * E.outC(inv(BKT, BKT + .4, t))})`);
  slamT(g, '破局', 1330, 560, 270, BKT, t, { color: () => linear(g, 0, -240, 0, 20, [[0, '#fff8de'], [.5, GOLD], [1, '#ff9338']]), stroke: ['rgba(40,14,0,.85)', 14], from: 2.6 });
  rise(g, '三招，不被拉回去。', 1330, 700, 60, BKS, t, { color: '#ffe6c4' });
  // badge-safe: fade in from the black of ⑤
  const fi = 1 - E.ioS(inv(BRK, BRK + .5, t)); if (fi > 0) { g.fillStyle = `rgba(0,0,0,${fi})`; g.fillRect(0, 0, W, H); }
}
// ---------- shared 招 layout ----------
function zhaoBG(g, t, lift = 0) {
  g.fillStyle = radial(g, 960, 480, 1300, [[0, '#2c1b10'], [.6, '#140c07'], [1, '#060403']]); g.fillRect(0, 0, W, H);
  bokeh(g, 77, 16, ['rgba(255,190,110,.16)', 'rgba(255,140,80,.1)', 'rgba(255,230,170,.09)'], .8, t);
  const r = rng(5); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 46; i++) { const sp = 18 + r() * 40 + lift * 160, x = r() * W + 24 * Math.sin(t * .5 + i), y = H + 20 - ((r() * (H + 40) + t * sp) % (H + 40)); g.globalAlpha = (.25 + .5 * r()) * (.6 + .4 * Math.sin(t * 3 + i)); g.fillStyle = r() < .6 ? GOLD : '#ff9a5c'; g.beginPath(); g.arc(x, y, 1.2 + r() * 2.2, 0, TAU); g.fill(); }
  g.restore();
}
function zhaoHead(g, num, title, sub, x, y, t0, t1, t, o = {}) {
  const a = inv(t0, t0 + .25, t) * (1 - inv(t1 - .3, t1, t)); if (a <= 0) return;
  const dx = -50 * (1 - E.outC(inv(t0, t0 + .4, t))), dy = -50 * E.inC(inv(t1 - .3, t1, t));
  g.save(); g.globalAlpha = a; g.translate(dx, dy); g.font = F(900, 40); const w = g.measureText(num).width + 60;
  rr(g, x, y - 34, w, 68, 34); g.fillStyle = GOLD; g.shadowColor = 'rgba(255,190,90,.7)'; g.shadowBlur = 26; g.fill(); g.shadowBlur = 0;
  g.fillStyle = '#2a1600'; g.textBaseline = 'middle'; g.fillText(num, x + 30, y + 2); g.restore();
  slamT(g, title, x, y + (o.ty || 164), o.size || 120, t0 + .3, t, { align: 'left', t1, from: 1.5, color: o.color || '#fff', stroke: ['rgba(30,10,0,.6)', 10] });
  if (sub) rise(g, sub, x, y + (o.sy || 254), 46, t0 + .95, t, { align: 'left', t1, color: '#e9cfae' });
}
// ---------- phone screens ----------
const CMP_TXT = ['立个 flag：', '今年必须考下证！💪', '大家监督我！'].map(s => Array.from(s)), CMP_T0 = Q(128.75), CMP_CPS = 15, DEL_T0 = Q(131.3), DEL_CPS = 30;
const CMP_N = CMP_TXT.reduce((s, c) => s + c.length, 0);
const GHOST = [['又立 flag 了？😂', Q(130.45)], ['三天打鱼两天晒网～', Q(131.0)]];
function cmpCount(t) { const typed = Math.min(CMP_N, Math.floor(Math.max(0, t - CMP_T0) * CMP_CPS)), del = Math.min(typed, Math.floor(Math.max(0, t - DEL_T0) * DEL_CPS)); return [typed, del, typed - del]; }
function keyboard(g, t, hot) {
  g.fillStyle = '#1b2029'; g.fillRect(-290, 150, 580, 430);
  const rows = [10, 9, 9, 5]; let id = 0;
  rows.forEach((n, ri) => { const y = 176 + ri * 92; for (let i = 0; i < n; i++) {
    let w = 50, x = -270 + i * 54 + (10 - n) * 27; if (ri === 2 && (i === 0 || i === n - 1)) { w = 68; x = i === 0 ? -270 : 202; } if (ri === 2 && i > 0 && i < n - 1) x = -194 + (i - 1) * 56;
    if (ri === 3) { const ws = [92, 62, 206, 62, 92]; x = -270 + ws.slice(0, i).reduce((s, v) => s + v + 6, 0); w = ws[i]; }
    const isDel = ri === 2 && i === n - 1, on = hot === 'del' ? isDel : hot === id;
    rr(g, x, y, w, 76, 10); g.fillStyle = on ? (isDel ? '#ff6b5a' : '#5c6678') : (isDel || ri === 3 && i !== 2 ? '#2c3340' : '#3a4250'); g.fill();
    if (isDel) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 18, y + 38); g.lineTo(x + 30, y + 26); g.lineTo(x + 54, y + 26); g.lineTo(x + 54, y + 50); g.lineTo(x + 30, y + 50); g.closePath(); g.stroke(); }
    id++; } });
}
function composeScreen(g, t) {
  g.fillStyle = '#12161d'; g.fillRect(-290, -580, 580, 1160);
  const [typed, del, n] = cmpCount(t), has = n > 0;
  g.fillStyle = '#9aa3b2'; g.font = F(500, 32); g.fillText('取消', -250, -468);
  rr(g, 150, -506, 110, 56, 12); g.fillStyle = has ? '#07c160' : '#24352b'; g.fill(); g.fillStyle = has ? '#fff' : '#5f7266'; g.font = F(700, 30); g.textAlign = 'center'; g.fillText('发表', 205, -467); g.textAlign = 'left';
  g.font = F(500, 42); let left = n, y = -370, cx = -240, cy = -370;
  if (n === 0) { g.fillStyle = '#4a5262'; g.fillText('这一刻的想法……', -240, -370); }
  for (let i = 0; i < CMP_TXT.length && left > 0; i++) { const k = Math.min(left, CMP_TXT[i].length), s = CMP_TXT[i].slice(0, k).join(''); g.fillStyle = '#e8edf5'; g.fillText(s, -240, y); cx = -240 + g.measureText(s).width; cy = y; left -= k; y += 64; }
  const typing = t > CMP_T0 && typed < CMP_N || (t > DEL_T0 && n > 0);
  if (typing || Math.sin(t * 11) > 0) { g.fillStyle = '#07c160'; g.fillRect(cx + 4, cy - 38, 4, 48); }
  g.strokeStyle = '#2c3442'; g.lineWidth = 3; g.setLineDash([10, 8]); rr(g, -240, -110, 160, 160, 16); g.stroke(); g.setLineDash([]);
  g.strokeStyle = '#4a5466'; g.lineWidth = 5; g.beginPath(); g.moveTo(-160, -60); g.lineTo(-160, 0); g.moveTo(-190, -30); g.lineTo(-130, -30); g.stroke();
  g.fillStyle = '#7c8698'; g.font = F(500, 28); g.fillText('谁可以看', -240, 104); g.textAlign = 'right'; g.fillText('公开  ›', 250, 104); g.textAlign = 'left';
  const hot = t > DEL_T0 && del < typed ? 'del' : (t > CMP_T0 && typed < CMP_N ? (typed * 7) % 33 : -1);
  keyboard(g, t, hot);
}
const CHK0 = Q(132.9), CHKD = 2.3, CHKN = 23, chkT = d => CHK0 + CHKD * Math.pow(d / (CHKN - 1), .72);
function checkMark(g, x, y, s, k) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = '#fff'; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); const e = clamp(k * 1.6); g.moveTo(-14, 0); if (e < .4) g.lineTo(-14 + 10 * e / .4, 10 * e / .4); else { g.lineTo(-4, 10); g.lineTo(-4 + 20 * (e - .4) / .6, 10 - 24 * (e - .4) / .6); } g.stroke(); g.restore(); }
function checkinScreen(g, t) {
  g.fillStyle = '#12161d'; g.fillRect(-290, -580, 580, 1160);
  g.fillStyle = '#1b212b'; g.fillRect(-290, -580, 580, 120); g.fillStyle = '#fff'; g.font = F(900, 40); g.textAlign = 'center'; g.fillText('打卡', 0, -495);
  rr(g, -125, -432, 250, 52, 26); g.fillStyle = 'rgba(255,210,122,.12)'; g.fill(); g.strokeStyle = 'rgba(255,210,122,.7)'; g.lineWidth = 2; g.stroke();
  g.fillStyle = GOLD; g.font = F(700, 28); g.fillText('🔒 仅自己可见', 0, -396); g.textAlign = 'left';
  g.fillStyle = '#fff'; g.font = F(900, 48); g.fillText('考证计划', -245, -306); g.fillStyle = '#7c8698'; g.font = F(500, 26); g.fillText('每天 2 小时 · 不发朋友圈', -245, -262);
  const x0 = -254, y0 = -190, P = 74; g.font = F(500, 22); g.fillStyle = '#5d6676'; g.textAlign = 'center';
  '一二三四五六日'.split('').forEach((d, i) => g.fillText(d, x0 + 32 + i * P, y0 - 14)); g.textAlign = 'left';
  let n = 0;
  for (let d = 0; d < 28; d++) {
    const x = x0 + (d % 7) * P, y = y0 + Math.floor(d / 7) * P, k = d < CHKN ? inv(chkT(d), chkT(d) + .16, t) : 0; if (k > 0) n++;
    const s = k > 0 ? 1 + .25 * Math.sin(Math.PI * k) : 1;
    g.save(); g.translate(x + 32, y + 32); g.scale(s, s);
    rr(g, -32, -32, 64, 64, 14); g.fillStyle = k > 0 ? linear(g, 0, -32, 0, 32, [[0, '#5ff0e6'], [1, CYD]]) : '#1f2530'; g.fill();
    if (k > 0) checkMark(g, 0, 0, 1, k); else { g.fillStyle = '#4a5262'; g.font = F(500, 22); g.textAlign = 'center'; g.fillText(String(d + 1), 0, 8); g.textAlign = 'left'; }
    if (d === CHKN && t > chkT(CHKN - 1) + .2) { g.strokeStyle = `rgba(255,210,122,${.5 + .5 * Math.sin(t * 7)})`; g.lineWidth = 4; rr(g, -32, -32, 64, 64, 14); g.stroke(); }
    g.restore();
  }
  const done = inv(chkT(CHKN - 1), chkT(CHKN - 1) + .3, t), pop = 1 + .18 * Math.sin(Math.PI * done);
  g.fillStyle = '#9aa3b2'; g.font = F(500, 30); g.fillText('已连续打卡', -245, 186);
  g.save(); g.translate(-245, 330); g.scale(pop, pop); g.fillStyle = done > 0 ? GOLD : CY; if (done > 0) { g.shadowColor = GOLD; g.shadowBlur = 30 * done; } g.font = F(900, 140); g.fillText(String(n), 0, 0); const nw = g.measureText(String(n)).width; g.shadowBlur = 0; g.font = F(700, 48); g.fillStyle = '#e8edf5'; g.fillText('天', nw + 14, -4); if (done > 0) { g.globalAlpha = done; g.font = F(700, 64); g.fillText('🔥', nw + 76, -10); } g.restore();
  g.fillStyle = 'rgba(255,255,255,.08)'; rr(g, -245, 400, 490, 14, 7); g.fill(); g.fillStyle = CY; rr(g, -245, 400, 490 * n / 30, 14, 7); g.fill();
  g.fillStyle = '#5d6676'; g.font = F(500, 24); g.fillText('距离考试还有 7 天', -245, 460);
}
function certificate(g, x, y, w, h) {
  g.save(); g.translate(x, y); g.fillStyle = linear(g, 0, 0, 0, h, [[0, '#fff8e6'], [1, '#efdcb2']]); g.fillRect(0, 0, w, h);
  g.strokeStyle = '#c99a3c'; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20); g.lineWidth = 2; g.strokeRect(20, 20, w - 40, h - 40);
  g.textAlign = 'center'; g.fillStyle = '#8a5a12'; g.font = F(900, 46); g.fillText('资格证书', w / 2, 92); g.font = F(500, 18); g.fillStyle = '#b08a4a'; g.fillText('CERTIFICATE', w / 2, 120);
  g.fillStyle = '#5a3c10'; g.font = F(700, 32); g.fillText('林  默', w / 2, 176); g.fillStyle = 'rgba(90,60,16,.35)'; g.fillRect(w / 2 - 100, 186, 200, 2);
  g.fillStyle = 'rgba(90,60,16,.3)'; for (let i = 0; i < 2; i++) g.fillRect(70, 214 + i * 18, w - 140 - i * 60, 6);
  g.fillStyle = 'rgba(200,40,30,.85)'; g.beginPath(); g.arc(w - 80, h - 66, 38, 0, TAU); g.fill(); g.strokeStyle = 'rgba(255,220,200,.6)'; g.lineWidth = 3; g.beginPath(); g.arc(w - 80, h - 66, 30, 0, TAU); g.stroke();
  g.fillStyle = '#fff'; g.font = F(900, 20); g.fillText('合格', w - 80, h - 59);
  g.fillStyle = '#e0a83a'; g.beginPath(); g.arc(70, h - 70, 26, 0, TAU); g.fill(); g.fillStyle = '#c0392b'; g.beginPath(); g.moveTo(56, h - 50); g.lineTo(50, h - 18); g.lineTo(64, h - 28); g.lineTo(72, h - 16); g.lineTo(76, h - 48); g.fill();
  g.textAlign = 'left'; g.restore();
}
const RP = [['浩', '#8a6ad8', '浩', '运气真好。', '归功运气'], ['凯', '#3f8fd8', '凯', '考这个有啥用？', '泼冷水'], ['鹏', YEL, '大鹏', '嗯。', '敷衍'], ['杰', '#e08a3c', '阿杰', '太强了！！你怎么复习的？', '真心']];
const RPT = [Q(142), Q(143), Q(144), Q(145)], SCAN = Q(146), RPOUT = Q(147.3), KEEP = Q(148.2), KEEPS = Q(149);
function postScreen(g, t) {
  g.fillStyle = '#12161d'; g.fillRect(-290, -580, 580, 1160);
  avatar(g, -238, -392, 34, '林', CY); g.fillStyle = '#8fb4ff'; g.font = F(900, 32); g.fillText('林默', -190, -402);
  g.fillStyle = '#e8edf5'; g.font = F(500, 36); g.fillText('考过了！🎉', -190, -356);
  certificate(g, -190, -320, 440, 300);
  g.fillStyle = '#5d6676'; g.font = F(500, 24); g.fillText('刚刚', -190, 24);
  const nC = RPT.filter(x => t >= x).length;
  g.fillStyle = '#1d232d'; rr(g, -190, 50, 440, 30 + 52 * Math.max(nC, .4), 10); g.fill();
  RP.forEach((r, i) => { const k = inv(RPT[i], RPT[i] + .25, t); if (k <= 0) return; g.globalAlpha = k; g.font = F(700, 26); g.fillStyle = '#8fb4ff'; g.fillText(r[2] + '：', -170, 98 + i * 52); const nw = g.measureText(r[2] + '：').width; g.font = F(500, 26); g.fillStyle = '#e8edf5'; g.fillText(r[3], -170 + nw, 98 + i * 52); g.globalAlpha = 1; });
  g.fillStyle = '#1b212b'; g.fillRect(-290, -580, 580, 120); g.fillStyle = '#fff'; g.font = F(900, 40); g.textAlign = 'center'; g.fillText('朋友圈', 0, -495); g.textAlign = 'left';
  g.fillStyle = '#8b95a7'; g.font = F(500, 40); g.fillText('‹', -260, -495);
}
function ghostBubble(g, x, y, txt, a, sc, t) {
  if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(sc, sc); g.setLineDash([10, 8]); g.lineDashOffset = -t * 24; g.strokeStyle = 'rgba(255,214,180,.6)'; g.lineWidth = 3;
  g.beginPath(); g.arc(0, 0, 30, 0, TAU); g.stroke(); g.fillStyle = 'rgba(255,214,180,.6)'; g.font = F(900, 30); g.textAlign = 'center'; g.fillText('?', 0, 11); g.textAlign = 'left';
  g.font = F(500, 36); const w = g.measureText(txt).width + 44; rr(g, 46, -36, w, 72, 22); g.fillStyle = 'rgba(255,240,220,.05)'; g.fill(); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#e3cdb8'; g.fillText(txt, 68, 13); g.restore();
}
function replyCard(g, i, t) {
  const r = RP[i], k = inv(RPT[i], RPT[i] + .3, t); if (k <= 0) return;
  const sc = inv(SCAN + i * .18, SCAN + i * .18 + .2, t), bad = i < 3, out = bad ? E.inC(inv(RPOUT + i * .1, RPOUT + i * .1 + .6, t)) : 0; if (out >= 1) return;
  const mv = bad ? 0 : E.ioC(inv(RPOUT + .1, KEEP - .1, t));
  const x = 1040 + 90 * (1 - E.outC(k)) + 420 * out, y = lerp(590 + i * 108, 590, mv), s = (bad ? 1 : 1 + .06 * mv) * (.9 + .1 * E.outB(k));
  g.save(); g.globalAlpha = clamp(k * 2) * (1 - out); g.translate(x, y); g.rotate(out * .12); g.scale(s, s);
  const gray = bad ? sc : 0, glow = bad ? 0 : sc;
  if (glow > 0) { g.shadowColor = GOLD; g.shadowBlur = 40 * glow; }
  rr(g, 0, -46, 700, 92, 22); g.fillStyle = gray > 0 ? `rgba(${lerp(32, 40, gray) | 0},${lerp(38, 40, gray) | 0},${lerp(50, 44, gray) | 0},.95)` : 'rgba(30,36,48,.95)'; g.fill(); g.shadowBlur = 0;
  if (glow > 0) { g.strokeStyle = `rgba(255,210,122,${glow})`; g.lineWidth = 3; rr(g, 0, -46, 700, 92, 22); g.stroke(); }
  g.globalAlpha *= 1 - .55 * gray;
  avatar(g, 50, 0, 30, r[0], gray > .5 ? '#6a6e78' : r[1]);
  g.font = F(700, 24); g.fillStyle = gray > .5 ? '#8a8e98' : '#8fb4ff'; g.fillText(r[2], 96, -12);
  g.font = F(700, 36); g.fillStyle = gray > .5 ? '#9a9ea8' : '#f2f5fa'; g.fillText(r[3], 96, 30);
  g.restore();
  if (sc > 0 && out < 1) { const ta = clamp(sc * 2) * (1 - out), tx = x + 700 * s - 18, col = bad ? '#ff8a7a' : GOLD;
    g.save(); g.globalAlpha = ta; g.translate(tx, y - 38); g.rotate(bad ? .08 : -.06); g.scale(lerp(1.6, 1, E.outC(sc)), lerp(1.6, 1, E.outC(sc))); g.font = F(900, 28); const w = g.measureText(r[4]).width + 30;
    rr(g, -w, -22, w, 44, 10); g.fillStyle = bad ? 'rgba(60,14,10,.9)' : 'rgba(60,40,6,.92)'; g.fill(); g.strokeStyle = col; g.lineWidth = 2.5; g.stroke(); g.fillStyle = col; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(r[4], -15, 1); g.restore(); }
  if (!bad && t > KEEP - .2) { const hk = E.outB(inv(KEEP - .2, KEEP + .15, t)); g.save(); g.translate(x + 760 * s, y); heart(g, 0, 0, 1.3 * hk, '#ff5d7a'); g.restore(); glowDot(g, x + 760 * s, y, 90, `rgba(255,93,122,${.4 * hk})`); }
}
function zhaoPhone(g, t) {
  const enter = E.outC(inv(Z1 - .05, Z1 + .5, t)), exit = E.inC(inv(Z3 - .05, Z3 + .4, t)); if (exit >= 1) return;
  const x = lerp(-420, 560, enter) - 1000 * exit, y = 590 + 8 * Math.sin(t * 1.3), rot = -.025 + .006 * Math.sin(t * 1.1);
  const sw1 = E.ioE(inv(Q(132.3), Q(132.3) + .4, t)), sw2 = E.ioE(inv(Z2 + .1, Z2 + .5, t));
  glowDot(g, x, y, 700, 'rgba(255,170,90,.14)');
  phone(g, x, y, rot, .74, pg => {
    const scr = [[composeScreen, 0], [checkinScreen, 1], [postScreen, 2]], pos = sw1 + sw2;
    for (const [fn, i] of scr) { const off = i - pos; if (Math.abs(off) >= 1) continue; pg.save(); pg.translate(580 * off, 0); fn(pg, t); pg.restore(); }
  });
}
function scene6z(g, t) { // 招一 / 招二 (shared phone)
  zhaoBG(g, t);
  zhaoPhone(g, t);
  zhaoHead(g, '招一', '先做，后说', null, 1040, 236, Z1 + .1, Z2 - .05, t);
  if (t < Z2) {
    const ga = inv(Q(130.2), Q(130.2) + .25, t) * (1 - inv(DEL_T0, DEL_T0 + .3, t));
    if (ga > 0) kText(g, '还没发，就已经能猜到评论：', 836, 590, 30, { weight: 500, color: '#c9b49e', alpha: ga, shadow: null });
    GHOST.forEach(([s, t0], i) => { const k = inv(t0, t0 + .3, t), o = E.inC(inv(DEL_T0 + i * .12, DEL_T0 + i * .12 + .45, t)); ghostBubble(g, 866 + 40 * o, 680 + i * 112 - 50 * o, s, clamp(k * 2) * (1 - o), .9 + .1 * E.outB(k), t); });
    rise(g, '目标藏起来，', 1040, 720, 64, Q(136.4), t, { align: 'left', t1: Z2 - .05, color: '#e9cfae' });
    slamT(g, '进度自己知道。', 1040, 880, 92, Q(137.3), t, { align: 'left', t1: Z2 - .05, color: (i) => i >= 2 && i <= 3 ? GOLD : '#fff', stroke: ['rgba(30,10,0,.6)', 10] });
  } else {
    zhaoHead(g, '招二', '好消息测试', '发个好消息，看看反应：', 1040, 236, Z2 + .05, Z3 - .05, t);
    // scan beam
    const sk = inv(SCAN - .05, SCAN + .75, t); if (sk > 0 && sk < 1) { const y = lerp(520, 960, E.ioS(sk)); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linear(g, 0, y - 60, 0, y + 6, [[0, 'rgba(255,210,122,0)'], [1, 'rgba(255,210,122,.32)']]); g.fillRect(1010, y - 60, 790, 66); g.fillStyle = 'rgba(255,230,170,.9)'; g.fillRect(1010, y, 790, 3); g.restore(); }
    for (let i = 0; i < 4; i++) replyCard(g, i, t);
    rise(g, '真心替你高兴、还追问细节的——', 1040, 770, 46, KEEP, t, { align: 'left', t1: Z3 - .05, color: '#e9cfae' });
    slamT(g, '留下。', 1040, 930, 140, KEEPS, t, { align: 'left', t1: Z3 - .05, color: () => linear(g, 0, -120, 0, 10, [[0, '#fff3cf'], [1, GOLD]]), stroke: ['rgba(40,14,0,.8)', 12] });
  }
}
// ---------- 招三: the circle moves up ----------
const Z3OUT = Q(153.2), Z3NEW = Q(154.2), Z3UP = Q(155.2), Z3C1 = Q(156), Z3C2 = Q(156.9);
const OLD = [['鹏', YEL, 1], ['浩', '#8a6ad8', 1], ['杰', '#e08a3c', 0], ['凯', '#3f8fd8', 1], ['雯', '#4caf7a', 0], ['王', PUR, 0]];
const NEWF = [[0, '师', '导师'], [1, '研', '研友'], [3, '跑', '跑友']];
function scene6c(g, t) {
  const up = E.ioC(inv(Z3UP, Z3UP + 1.1, t));
  zhaoBG(g, t, up);
  zhaoPhone(g, t);
  zhaoHead(g, '招三', '换个圈', null, 130, 236, Z3 + .1, FIN - .05, t, { size: 120 });
  const ap = E.outC(inv(Z3 + .15, Z3 + .7, t)), cx = 1000, cy = 610 - 100 * up + 6 * Math.sin(t * 1.4), R1 = 175, R2 = 320;
  if (ap <= 0) return;
  g.save(); g.globalAlpha = ap; g.translate(cx, cy); g.scale(.85 + .15 * ap, .85 + .15 * ap);
  if (up > 0) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const xx = (i - 4) * 80 + 14 * Math.sin(t * 1.2 + i); g.fillStyle = linear(g, 0, 420, 0, -520, [[0, 'rgba(255,200,110,0)'], [.5, `rgba(255,200,110,${(.06 + .04 * Math.sin(t * 3 + i)) * up})`], [1, 'rgba(255,200,110,0)']]); g.fillRect(xx - 20, -520, 40, 940); } g.restore(); }
  glowDot(g, 0, 0, 420, `rgba(255,170,90,${.16 + .14 * up})`);
  g.strokeStyle = 'rgba(255,220,170,.32)'; g.lineWidth = 2.5; g.beginPath(); g.arc(0, 0, R1, 0, TAU); g.stroke();
  const oa = inv(Z3OUT - .3, Z3OUT + .2, t); if (oa > 0) { g.save(); g.globalAlpha *= oa; g.setLineDash([12, 12]); g.lineDashOffset = t * 20; g.strokeStyle = 'rgba(255,220,170,.22)'; g.beginPath(); g.arc(0, 0, R2, 0, TAU); g.stroke(); g.restore(); }
  const pos = []; let j = 0;
  OLD.forEach(([ch, col, mv], i) => { const a0 = -Math.PI / 2 + i * TAU / 6; let r = R1, a = a0, s = 1, al = 1;
    if (mv) { const k = E.ioC(inv(Z3OUT + j * .14, Z3OUT + j * .14 + .75, t)); r = lerp(R1, R2, k); a = a0 + .32 * k; s = lerp(1, .8, k); al = lerp(1, .55, k); j++; }
    pos.push([r * Math.cos(a), r * Math.sin(a), ch, col, s, al, mv]); });
  NEWF.forEach(([slot, ch, lb], i) => { const a = -Math.PI / 2 + slot * TAU / 6, k = E.outC(inv(Z3NEW + i * .15, Z3NEW + i * .15 + .6, t)); if (k <= 0) return; const x = lerp(a < -1 ? 0 : 900 * Math.cos(a), R1 * Math.cos(a), k), y = lerp(-700, R1 * Math.sin(a), k); pos.push([x, y, ch, GOLD, 1, k, 2, lb, k]); });
  // links
  for (const p of pos) { g.save(); g.globalAlpha *= p[5] * .8; g.strokeStyle = p[6] === 1 ? 'rgba(255,220,170,.25)' : p[6] === 2 ? 'rgba(255,210,122,.6)' : 'rgba(255,220,170,.4)'; g.lineWidth = p[6] === 2 ? 3 : 2; if (p[6] === 1) g.setLineDash([8, 10]); g.beginPath(); g.moveTo(0, 0); g.lineTo(p[0], p[1]); g.stroke(); g.restore(); }
  for (const p of pos) { const [x, y, ch, col, s, al, kind, lb, k] = p; g.save(); g.globalAlpha *= al; g.translate(x, y); g.scale(s, s);
    if (kind === 2) { glowDot(g, 0, 0, 90, `rgba(255,200,110,${.6 * k})`); g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 44, 0, TAU); g.stroke(); avatar(g, 0, 0, 38, ch, '#e0a040'); g.font = F(700, 26); g.fillStyle = GOLD; g.textAlign = 'center'; g.fillText(lb, 0, 82); g.textAlign = 'left'; }
    else avatar(g, 0, 0, 38, ch, col);
    g.restore(); }
  glowDot(g, 0, 0, 160, 'rgba(47,216,207,.45)'); g.strokeStyle = CYL; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 64, 0, TAU); g.stroke(); avatar(g, 0, 0, 56, '林', CY);
  if (up > 0) { const r = rng(9); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 26; i++) { const x = (r() - .5) * 700, ph = (t * (.6 + r() * .6) + r()) % 1; g.globalAlpha = up * (1 - ph) * .8; g.fillStyle = r() < .5 ? GOLD : '#fff2d0'; g.beginPath(); g.arc(x, 380 - ph * 700, 1.5 + 2 * r(), 0, TAU); g.fill(); } g.restore(); }
  g.restore();
  rise(g, '不是删掉谁，', 130, 640, 64, Z3C1, t, { align: 'left', color: '#e9cfae', t1: FIN - .05 });
  slamT(g, '是让圈子往上走。', 1800, 800, 66, Z3C2, t, { align: 'right', t1: FIN - .05, color: (i) => i >= 5 ? GOLD : '#fff', stroke: ['rgba(30,10,0,.6)', 10] });
  const wf = E.inQ(inv(FIN - .55, FIN, t)); if (wf > 0) { g.fillStyle = `rgba(255,232,190,${wf})`; g.fillRect(0, 0, W, H); }
}
function scene6(g, t) { if (t < Z1) sceneAuto(g, t); else if (t < Z3) scene6z(g, t); else scene6c(g, t); }
