// ================= 没有盖子的竹篓 · common =================
const Q = bt;
const CY = '#2fd8cf', CYD = '#15867f', CYL = '#b4fff8', ORG = '#ff6b3d', ORD = '#a8361a', ORL = '#ffb08a', GOLD = '#ffd27a',
  SKIN = '#f0c6a0', SKIND = '#b98463', YEL = '#ffc93c', YELD = '#b8820e', PUR = '#9a6cf0', PURD = '#563895', RED = '#ff4b3e', INK = '#0b0f16';
const TE = Q(16.6), LT = [Q(17.5), Q(18), Q(18.5), Q(19)];
const hit = (t, t0, d = .3) => { const u = t - t0; return u < 0 || u > d ? 0 : Math.pow(1 - u / d, 2); };
const hits = (t, L) => L.reduce((s, [t0, a, d]) => s + a * hit(t, t0, d), 0);

// ---------- text ----------
function rise(g, str, x, y, size, t0, t, o = {}) {
  const out = o.t1 ? inv(o.t1 - .22, o.t1, t) : 0; if (t < t0 || out >= 1) return; const st = o.stag ?? .035;
  return kText(g, str, x, y, size, { align: o.align || 'center', color: o.color || '#fff', weight: o.weight || 900, alpha: (o.alpha ?? 1) * (1 - out), shadow: o.shadow === undefined ? 'rgba(0,0,0,.8)' : o.shadow, sBlur: 26, track: o.track || 0, stroke: o.stroke,
    fn: (i) => { const k = inv(t0 + i * st, t0 + i * st + .3, t); return { a: k, dy: (o.dy ?? 30) * (1 - E.outC(k)) - out * 20 }; } });
}
function slamT(g, str, x, y, size, t0, t, o = {}) { // lands exactly at t0
  const k = inv(t0 - .13, t0, t); if (k <= 0) return; const out = o.t1 ? inv(o.t1 - .2, o.t1, t) : 0; if (out >= 1) return;
  const u = t - t0, s = lerp(o.from || 2.2, 1, E.inC(k)) * (1 + (u > 0 ? .07 * Math.exp(-u * 8) * Math.cos(u * 34) : 0)) * (1 + out * .08);
  g.save(); g.translate(x, y); g.scale(s, s);
  kText(g, str, 0, 0, size, { align: o.align || 'center', color: o.color || '#fff', weight: o.weight || 900, alpha: clamp(k * 2.5) * (1 - out) * (o.alpha ?? 1), shadow: o.shadow ?? 'rgba(0,0,0,.85)', sBlur: o.sBlur ?? 30, track: o.track || 0, stroke: o.stroke });
  g.restore();
}
function stampT(g, str, x, y, t0, t, o = {}) {
  const k = inv(t0 - .12, t0, t); if (k <= 0) return; const out = o.t1 ? inv(o.t1 - .2, o.t1, t) : 0; if (out >= 1) return;
  const s = lerp(2.8, 1, E.inC(k)), col = o.color || RED, size = o.size || 84;
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -.12); g.scale(s, s); g.globalAlpha = clamp(k * 3) * (1 - out) * .95;
  g.font = F(900, size); const w = g.measureText(str).width + size * .9, h = size * 1.45;
  g.fillStyle = 'rgba(20,6,10,.5)'; rr(g, -w / 2, -h / 2, w, h, size * .18); g.fill();
  g.strokeStyle = col; g.lineWidth = size * .09; rr(g, -w / 2, -h / 2, w, h, size * .18); g.stroke(); g.lineWidth = size * .03; rr(g, -w / 2 + size * .15, -h / 2 + size * .15, w - size * .3, h - size * .3, size * .1); g.stroke();
  g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = col; g.shadowBlur = 20; g.fillText(str, 0, size * .05); g.restore();
}
function tagT(g, str, x, y, t0, t1, t, o = {}) {
  const a = inv(t0, t0 + .25, t) * (1 - inv(t1 - .25, t1, t)); if (a <= 0) return; const sz = o.size || 30; g.save(); g.globalAlpha = a; g.font = F(700, sz);
  const w = g.measureText(str).width + 44, h = sz * 1.75, x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x, dy = 14 * (1 - E.outC(inv(t0, t0 + .35, t)));
  rr(g, x0, y - h / 2 + dy, w, h, h / 2); g.fillStyle = o.bg || 'rgba(0,0,0,.5)'; g.fill(); g.strokeStyle = o.col || 'rgba(255,214,160,.6)'; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = o.col || '#ffd9a0'; g.textBaseline = 'middle'; g.fillText(str, x0 + 22, y + 1 + dy); g.restore();
}

// ---------- crab ----------
const HIP = [[-48, -18], [-56, 2], [-50, 22], [48, -18], [56, 2], [50, 22]], SHO = [[-34, -30], [34, -30]];
function legsRest(ph = 0, amp = 0) {
  const B = [[124, -42], [142, 12], [122, 66]], out = [];
  for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { const w = amp * Math.sin(ph + i * 2.1 + (sd > 0 ? Math.PI : 0)); out.push([sd * (B[i][0] + w * .3), B[i][1] + w]); }
  return out;
}
function drawPincer(g, x, y, ang, sc, open, col, dk, lt, glow) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(sc, sc);
  const up = new Path2D(), lo = new Path2D(), palm = new Path2D();
  palm.ellipse(-42, 0, 34, 26, 0, 0, TAU);
  up.moveTo(-24, -20); up.quadraticCurveTo(6, -30 - open * 22, 19, -3 - open * 18); up.quadraticCurveTo(2, -8 - open * 8, -18, -4); up.closePath();
  lo.moveTo(-24, 18); lo.quadraticCurveTo(4, 23 + open * 20, 15, 4 + open * 16); lo.quadraticCurveTo(0, 8 + open * 7, -18, 6); lo.closePath();
  if (glow) { g.lineWidth = 13; g.lineJoin = 'round'; g.stroke(lo); g.stroke(up); g.stroke(palm); }
  else {
    g.fillStyle = dk; g.fill(lo);
    const gr = g.createLinearGradient(0, -30, 0, 26); gr.addColorStop(0, lt); gr.addColorStop(.45, col); gr.addColorStop(1, dk);
    g.fillStyle = gr; g.fill(palm); g.fill(up);
    g.strokeStyle = dk; g.lineWidth = 3; g.lineJoin = 'round'; g.stroke(palm); g.stroke(up); g.stroke(lo);
    g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.ellipse(-48, -12, 14, 6, -.2, 0, TAU); g.fill();
  }
  g.restore();
}
// o: s, col, dk, lt, rot, legs[6], cl/cr [x,y] local grip targets, openL/openR, look [dx,dy], brow (-1 worried..1 angry), glow, glowCol
function drawCrab(g, x, y, o = {}) {
  const s = o.s ?? .9, col = o.col || ORG, dk = o.dk || ORD, lt = o.lt || ORL;
  const legs = o.legs || legsRest(o.ph || 0, o.amp ?? 0);
  const CL = [o.cl || [-80, -100], o.cr || [80, -100]], OP = [o.openL ?? .35, o.openR ?? .35];
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); g.lineCap = 'round'; g.lineJoin = 'round';
  const passes = (o.glow || 0) > .01 ? [1, 0] : [0];
  for (const G of passes) {
    g.save();
    if (G) { const gc = o.glowCol || '#ff2a1a'; g.globalAlpha *= clamp(o.glow); g.strokeStyle = gc; g.shadowColor = gc; g.shadowBlur = 34; }
    legs.forEach((tp, k) => {
      if (!tp) return;
      if (tp[2] === 'stump') { const hp = HIP[k]; g.beginPath(); g.moveTo(hp[0], hp[1]); g.lineTo(tp[0], tp[1]); if (G) { g.lineWidth = 25; g.stroke(); } else { g.strokeStyle = dk; g.lineWidth = 15; g.stroke(); g.strokeStyle = col; g.lineWidth = 8; g.stroke(); g.fillStyle = '#eafffb'; g.beginPath(); g.arc(tp[0], tp[1], 6, 0, TAU); g.fill(); g.strokeStyle = dk; g.lineWidth = 2.5; g.stroke(); } return; }
      const hp = HIP[k], sd = k < 3 ? -1 : 1, dx = tp[0] - hp[0], dy = tp[1] - hp[1], len = Math.hypot(dx, dy) || 1;
      let px = -dy / len, py = dx / len; if (px * sd * .6 - py * .8 < 0) { px = -px; py = -py; }
      const bend = clamp(48 - len * .17, 6, 40), kx = (hp[0] + tp[0]) / 2 + px * bend, ky = (hp[1] + tp[1]) / 2 + py * bend;
      g.beginPath(); g.moveTo(hp[0], hp[1]); g.lineTo(kx, ky); g.lineTo(tp[0], tp[1]);
      if (G) { g.lineWidth = 25; g.stroke(); } else { g.strokeStyle = dk; g.lineWidth = 13; g.stroke(); g.strokeStyle = col; g.lineWidth = 6.5; g.stroke(); g.fillStyle = dk; g.beginPath(); g.arc(kx, ky, 6.5, 0, TAU); g.fill(); }
    });
    if (G) { g.lineWidth = 14; g.beginPath(); g.ellipse(0, 0, 68, 48, 0, 0, TAU); g.stroke(); }
    else {
      g.fillStyle = col; g.strokeStyle = dk; g.lineWidth = 2;
      for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + sd * (.72 + i * .33); g.beginPath(); g.moveTo(Math.cos(a - .1) * 66, Math.sin(a - .1) * 46); g.lineTo(Math.cos(a) * 80, Math.sin(a) * 58); g.lineTo(Math.cos(a + .1) * 66, Math.sin(a + .1) * 46); g.closePath(); g.fill(); g.stroke(); }
      g.fillStyle = radial(g, -20, -24, 104, [[0, lt], [.45, col], [1, dk]]); g.beginPath(); g.ellipse(0, 0, 68, 48, 0, 0, TAU); g.fill(); g.strokeStyle = dk; g.lineWidth = 3; g.stroke();
      if ((o.joy || 0) > 0) { const j = o.joy; g.strokeStyle = `rgba(40,10,0,${.5 * j})`; g.lineWidth = 4.5; g.beginPath(); g.arc(0, -10 + 4 * (1 - j), 22, Math.PI * (.5 - .32 * j), Math.PI * (.5 + .32 * j)); g.stroke(); g.fillStyle = `rgba(255,120,130,${.35 * j})`; for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(sd * 40, 4, 11, 6, 0, 0, TAU); g.fill(); } }
      else { g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 3; g.beginPath(); g.arc(0, 12, 32, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); g.beginPath(); g.arc(0, 30, 18, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }
      g.fillStyle = 'rgba(255,255,255,.28)'; g.beginPath(); g.ellipse(-24, -20, 22, 9, -.3, 0, TAU); g.fill();
    }
    for (let j = 0; j < 2; j++) {
      const sd = j ? 1 : -1, sh = SHO[j], T = CL[j], dx = T[0] - sh[0], dy = T[1] - sh[1], len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
      const wl = Math.min(len * .7, 74), wx = T[0] - ux * wl, wy = T[1] - uy * wl; let px = -uy, py = ux; if (px * sd < 0) { px = -px; py = -py; }
      const bx = (sh[0] + wx) / 2 + px * 20, by = (sh[1] + wy) / 2 + py * 20;
      g.beginPath(); g.moveTo(sh[0], sh[1]); g.quadraticCurveTo(bx, by, wx, wy);
      if (G) { g.lineWidth = 30; g.stroke(); } else { g.strokeStyle = dk; g.lineWidth = 18; g.stroke(); g.strokeStyle = col; g.lineWidth = 10; g.stroke(); }
      drawPincer(g, T[0], T[1], Math.atan2(uy, ux), 1, OP[j], col, dk, lt, G);
    }
    if (!G) for (const sd of [-1, 1]) {
      g.strokeStyle = dk; g.lineWidth = 6; g.beginPath(); g.moveTo(sd * 15, -40); g.lineTo(sd * 20, -58); g.stroke();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(sd * 20, -63, 10.5, 0, TAU); g.fill(); g.strokeStyle = dk; g.lineWidth = 2.5; g.stroke();
      const lk = o.look || [0, -1];
      if ((o.joy || 0) > .5) { g.strokeStyle = '#111'; g.lineWidth = 4.2; g.beginPath(); g.arc(sd * 20, -58, 6.8, Math.PI * 1.12, Math.PI * 1.88); g.stroke(); }
      else { g.fillStyle = '#111'; g.beginPath(); g.arc(sd * 20 + lk[0] * 4, -63 + lk[1] * 4, 5.2, 0, TAU); g.fill(); }
      if (o.brow !== undefined) { const b = o.brow; g.strokeStyle = '#1a0d08'; g.lineWidth = 4.5; g.beginPath(); g.moveTo(sd * 10, -78 + 7 * b); g.lineTo(sd * 32, -80 - 6 * b); g.stroke(); }
    }
    g.restore();
  }
  g.restore();
}
const CYAN = { col: CY, dk: CYD, lt: CYL };
function crabPt(c, lx, ly) { const s = c.s ?? .9, r = c.rot || 0, cs = Math.cos(r), sn = Math.sin(r); return [c.x + (lx * cs - ly * sn) * s, c.y + (lx * sn + ly * cs) * s]; }
function toLocal(c, wx, wy) { const s = c.s ?? .9, r = -(c.rot || 0), dx = (wx - c.x) / s, dy = (wy - c.y) / s; return [dx * Math.cos(r) - dy * Math.sin(r), dx * Math.sin(r) + dy * Math.cos(r)]; }

// ---------- hands / fists ----------
function drawFist(g, x, y, s, sl, sld, fx, fy, skin = '#e3ae88') {
  const dx = x - fx, dy = y - fy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, px = -uy, py = ux, ang = Math.atan2(uy, ux);
  const wB = 150 * s, wW = 104 * s, ex = x - ux * 44 * s, ey = y - uy * 44 * s;
  g.beginPath(); g.moveTo(fx + px * wB / 2, fy + py * wB / 2); g.lineTo(ex + px * wW / 2, ey + py * wW / 2); g.lineTo(ex - px * wW / 2, ey - py * wW / 2); g.lineTo(fx - px * wB / 2, fy - py * wB / 2); g.closePath();
  g.fillStyle = linear(g, fx + px * wB / 2, fy + py * wB / 2, fx - px * wB / 2, fy - py * wB / 2, [[0, sld], [.4, sl], [1, sld]]); g.fill();
  g.save(); g.translate(ex, ey); g.rotate(ang); g.fillStyle = sld; rr(g, -30 * s, -wW / 2 - 5 * s, 32 * s, wW + 10 * s, 9 * s); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(-28 * s + i * 5 * s, -wW / 2); g.lineTo(-28 * s + i * 5 * s, wW / 2); g.stroke(); } g.restore();
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.fillStyle = linear(g, 0, -44, 0, 44, [[0, '#f6cfaa'], [.5, skin], [1, '#a8714f']]); rr(g, -50, -44, 100, 88, 32); g.fill(); g.strokeStyle = '#8f5a3c'; g.lineWidth = 3; g.stroke();
  for (let i = 0; i < 4; i++) { const yy = -33 + i * 22; g.fillStyle = linear(g, 14, 0, 60, 0, [[0, skin], [1, '#f3c9a3']]); rr(g, 14, yy - 10, 44, 21, 10); g.fill(); g.stroke(); }
  g.save(); g.rotate(.25); g.fillStyle = '#eebf97'; rr(g, -30, -50, 62, 24, 12); g.fill(); g.stroke(); g.restore();
  g.restore();
}
function drawReachHand(g, x, y, strain, t, light = 1) {
  const bx = x + 40, by = 1380, wT = 132, wB = 200;
  g.save(); g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x - wT / 2, y + 30); g.bezierCurveTo(x - wT / 2 - 14, y + 380, bx - wB / 2, by - 320, bx - wB / 2, by); g.lineTo(bx + wB / 2, by); g.bezierCurveTo(bx + wB / 2, by - 320, x + wT / 2 + 14, y + 380, x + wT / 2, y + 30); g.closePath();
  g.fillStyle = linear(g, x - 110, 0, x + 110, 0, [[0, '#0b4f4b'], [.3, CYD], [.55, CY], [.75, '#1fa79f'], [1, '#0b4f4b']]); g.fill();
  g.strokeStyle = 'rgba(4,40,38,.6)'; g.lineWidth = 5; for (let i = 0; i < 4; i++) { const yy = y + 140 + i * 120; g.beginPath(); g.moveTo(x - 58, yy); g.quadraticCurveTo(x - 4, yy + 26, x + 52, yy - 8); g.stroke(); }
  g.fillStyle = linear(g, 0, y - 600, 0, y + 200, [[0, `rgba(255,220,160,${.45 * light})`], [1, 'rgba(255,220,160,0)']]); g.globalCompositeOperation = 'lighter'; g.fill(); g.globalCompositeOperation = 'source-over';
  // cuff
  g.fillStyle = '#0f6d68'; rr(g, x - wT / 2 - 6, y - 6, wT + 12, 50, 14); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 3; for (let i = 1; i < 14; i++) { const xx = x - wT / 2 + i * wT / 14; g.beginPath(); g.moveTo(xx, y); g.lineTo(xx, y + 40); g.stroke(); }
  const sk = linear(g, 0, y - 230, 0, y + 10, [[0, '#ffe6c6'], [.45, SKIN], [1, '#b07a58']]);
  const tr = (i) => nz(t * 11, i + 3) * .035 * strain;
  const FX = [-37, -12, 13, 37], FA = [-.3, -.1, .1, .3], FL = [86, 102, 97, 78], FW = [26, 27, 26, 23];
  for (let i = 0; i < 4; i++) {
    g.save(); g.translate(x + FX[i], y - 90); g.rotate(FA[i] * (1 + strain * .45) + tr(i)); const L = FL[i] * (1 + strain * .04), w = FW[i];
    g.fillStyle = sk; rr(g, -w / 2, -L, w, L + 16, w / 2); g.fill(); g.strokeStyle = SKIND; g.lineWidth = 2.5; g.stroke();
    g.fillStyle = 'rgba(255,240,225,.7)'; rr(g, -w / 2 + 5, -L + 4, w - 10, 17, 7); g.fill();
    g.strokeStyle = 'rgba(150,95,65,.45)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-w / 2 + 6, -L * .45); g.quadraticCurveTo(0, -L * .45 + 4, w / 2 - 6, -L * .45); g.stroke(); g.restore();
  }
  g.fillStyle = sk; rr(g, x - 54, y - 112, 108, 122, 36); g.fill(); g.strokeStyle = SKIND; g.lineWidth = 2.5; g.stroke();
  g.strokeStyle = 'rgba(150,95,65,.35)'; g.lineWidth = 2; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(x + FX[i], y - 92, 7, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
  g.save(); g.translate(x - 46, y - 44); g.rotate(-.72 - strain * .18 + tr(5)); g.fillStyle = sk; rr(g, -14, -70, 28, 82, 14); g.fill(); g.strokeStyle = SKIND; g.lineWidth = 2.5; g.stroke(); g.fillStyle = 'rgba(255,240,225,.7)'; rr(g, -9, -66, 18, 18, 7); g.fill(); g.restore();
  if (light > 0) { glowDot(g, x, y - 170, 200, `rgba(255,205,140,${.28 * light})`); }
  g.restore();
}
function drawClawSil(g, x, y, ang, sc, open, a) { // giant shadow claw sweeping across frame
  if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(ang); g.scale(sc, sc);
  g.strokeStyle = '#03050a'; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(-74, 0); g.quadraticCurveTo(-240, 40, -520, 10); g.stroke();
  drawPincer(g, 0, 0, 0, 1, open, '#03050a', '#03050a', '#0a0f18', 0); g.restore();
}
function heartbeat(t, list) { let v = 0; for (const t0 of list) { v += Math.exp(-Math.pow((t - t0) / .05, 2)) + .6 * Math.exp(-Math.pow((t - t0 - .2) / .05, 2)); } return v; }
