// ================= OPENING A–F: hand → basket (0 – Q16) =================
const CS = .9, REL = [[-122, 180], [122, 180], [0, 168]], RESTP = [[830, 900], [1130, 900], [980, 958]], CLAMP = [Q(12.4), Q(12.55), Q(12.7)], GLOWT = [Q(14), Q(14.5), Q(15)];
const PILE = [[650, 925, -.3, 1.1], [785, 968, .15, 2.3], [1180, 970, -.12, 3.7], [1322, 920, .3, 5.2]];
const tw = t => t < Q(14) ? t : Q(14) + (t - Q(14)) * .25; // slow-mo clock for wiggles

// ---------- A/B: reaching hand ----------
function sceneHand(g, t, alpha = 1) {
  g.save(); g.globalAlpha = alpha;
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#080b11'], [1, '#020305']]); g.fillRect(0, 0, W, H);
  const hb = heartbeat(t, [Q(0), Q(1), Q(2), Q(2.5)]);
  const push = lerp(1, 1.1, E.ioS(inv(0, Q(3.3), t))) * (1 + .014 * hb);
  g.save(); cam(g, 960, 470, push);
  const rec = E.outC(inv(Q(3.35), Q(3.95), t)), sw = 270 * (1 - .6 * rec), sy = 96 - 40 * rec, br = (1 - .55 * rec) * (.88 + .12 * hb);
  g.save(); g.globalCompositeOperation = 'lighter';
  g.beginPath(); g.moveTo(960 - sw, sy); g.lineTo(960 + sw, sy); g.lineTo(960 + sw * 2.1, 1150); g.lineTo(960 - sw * 2.1, 1150); g.closePath();
  g.fillStyle = linear(g, 0, sy, 0, 1100, [[0, `rgba(255,210,150,${.24 * br})`], [.6, `rgba(255,190,130,${.06 * br})`], [1, 'rgba(255,190,130,0)']]); g.fill();
  glowDot(g, 960, sy, 640 * (1 - .4 * rec), `rgba(255,214,160,${.3 * br})`);
  g.fillStyle = `rgba(255,248,230,${br})`; rr(g, 960 - sw, sy - 6, sw * 2, 12, 6); g.fill();
  glowDot(g, 960, sy, 170, `rgba(255,255,240,${.5 * br})`);
  const r = rng(5); for (let i = 0; i < 110; i++) {
    const yy = sy + 20 + ((r() * 900 - t * (10 + 20 * r())) % 900 + 900) % 900, spread = sw * (1 + 1.1 * (yy - sy) / 1050), xx = 960 + (r() - .5) * 2 * spread + Math.sin(t * .8 + i) * 8;
    g.globalAlpha = alpha * (.2 + .5 * r()) * br * (.5 + .5 * Math.sin(t * 2.3 + i * 1.7)); g.fillStyle = '#ffe2b8'; g.beginPath(); g.arc(xx, yy, .8 + r() * 1.8, 0, TAU); g.fill();
  }
  g.restore();
  const yk = t => 430 * E.outE(inv(Q(3.35) - .02, Q(3.35) + .3, t));
  const rs = E.ioS(inv(0, Q(3), t)), yank = yk(t), pre = 16 * E.ioS(inv(Q(3) + .05, Q(3.33), t)) * (1 - inv(Q(3.35), Q(3.4), t));
  const strain = clamp(.3 + .7 * rs) * (1 - .6 * inv(Q(3.35), Q(3.7), t));
  const hx = 960 + 3 * nz(t * 7, 2) * strain, hy = lerp(900, 330, rs) - pre + yank;
  drawReachHand(g, hx, hy, strain, t, (1 - .7 * rec) * (.6 + .4 * rs));
  const FD = [[-.03, [-420, 360], [-72, 205]], [0, [2340, 430], [80, 300]], [.035, [640, 1550], [-14, 455]]];
  for (const [d, o, gp] of FD) {
    const fk = E.outE(inv(Q(3) - .17 + d, Q(3) + d, t)); if (fk <= 0) continue;
    const ox = o[0], oy = hy + o[1], gx = hx + gp[0], gy = hy + gp[1], x = lerp(ox, gx, fk), y = lerp(oy, gy, fk), dl = Math.hypot(gx - ox, gy - oy);
    const s = 1.05 * (1 + .14 * hit(t, Q(3) + d, .22)) * (1 + .05 * Math.sin(t * 40) * inv(Q(3.3), Q(3.4), t) * (1 - inv(Q(3.6), Q(3.8), t)));
    drawFist(g, x, y, s, ORD, '#5c1c0c', x - (gx - ox) / dl * 900, y - (gy - oy) / dl * 900);
  }
  g.restore();
  g.fillStyle = radial(g, 960, 540, 1150, [[0, 'rgba(0,0,0,0)'], [.5, 'rgba(0,0,0,0)'], [1, `rgba(50,0,0,${.4 * hb})`]]); g.fillRect(0, 0, W, H);
  g.restore();
  const v = yank - yk(t - 1 / 30); if (v > 3 && alpha >= 1) motionBlurY(g, -v * .9, 8);
}

// ---------- basket world ----------
function basketPath(g) { g.beginPath(); g.moveTo(440, 200); g.lineTo(1480, 200); g.lineTo(1340, 972); g.quadraticCurveTo(960, 1010, 580, 972); g.closePath(); }
function drawBasket(g, t, o = {}) {
  g.fillStyle = linear(g, 0, -700, 0, 205, o.sky || [[0, '#070b11'], [.62, '#2a3c4e'], [1, '#8da6ba']]); g.fillRect(-1600, -1400, 5120, 1605);
  glowDot(g, 960, 190, 1000, o.skyGlow || 'rgba(160,195,225,.28)');
  if (o.pre) o.pre(g);
  g.fillStyle = o.ground || '#05080c'; g.fillRect(-1600, 205, 5120, 1800);
  g.fillStyle = radial(g, 960, 1000, 700, [[0, 'rgba(0,0,0,.7)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(200, 800, 1520, 400);
  g.save(); basketPath(g); g.clip();
  g.fillStyle = '#100b06'; g.fillRect(400, 190, 1120, 840);
  const SP = 58, RH = 29, PITCH = 34, SW = 15, sAt = y => (lerp(1480, 1340, (y - 200) / 780) - lerp(440, 580, (y - 200) / 780)) / 1040;
  for (let m = -10; m <= 10; m++) { // stakes behind (seen in the gaps)
    const xt = 960 + m * SP * sAt(200), xb = 960 + m * SP * sAt(1000), w = SW * .5;
    g.beginPath(); g.moveTo(xt - w, 190); g.lineTo(xt + w, 190); g.lineTo(xb + w * .8, 1010); g.lineTo(xb - w * .8, 1010); g.closePath(); g.fillStyle = '#3c2c16'; g.fill();
  }
  for (let j = 0; j < 24; j++) {
    const y0 = 208 + j * PITCH, y1 = y0 + RH; if (y0 > 1000) break; const sc = sAt(y0 + RH / 2), f = (y0 + RH / 2 - 200) / 780, xl = lerp(440, 580, f), xr = lerp(1480, 1340, f);
    g.fillStyle = linear(g, 0, y0, 0, y1, [[0, '#dcc08a'], [.2, '#c7a76d'], [.62, '#9a7a46'], [1, '#5a4324']]); rr(g, xl - 40, y0, xr - xl + 80, RH, 10); g.fill();
    g.fillStyle = 'rgba(255,246,220,.22)'; g.fillRect(xl - 40, y0 + 4, xr - xl + 80, 2);
    g.fillStyle = 'rgba(70,45,15,.22)'; g.fillRect(xl - 40, y0 + RH * .58, xr - xl + 80, 1.5); g.fillRect(xl - 40, y0 + RH * .76, xr - xl + 80, 1);
    for (let n = 0; n < 4; n++) { const nx = xl + (xr - xl) * hsh(j * 7 + n * 3.1); g.fillStyle = 'rgba(60,38,12,.45)'; g.fillRect(nx, y0 + 2, 2.5, RH - 4); g.fillStyle = 'rgba(255,240,200,.25)'; g.fillRect(nx + 2.5, y0 + 2, 1.5, RH - 4); }
    for (let m = -10; m <= 10; m++) {
      const xc = 960 + m * SP * sc, w = SW * sc, sh = 34 * sc;
      if ((j + m) & 1) { // weaver passes over the stake: bulge highlight
        g.fillStyle = linear(g, xc - sh, 0, xc + sh, 0, [[0, 'rgba(255,236,190,0)'], [.5, 'rgba(255,236,190,.2)'], [1, 'rgba(255,236,190,0)']]); g.fillRect(xc - sh, y0, sh * 2, RH);
      } else { // stake passes over the weaver: weaver dives into shadow
        g.fillStyle = linear(g, xc - sh, 0, xc + sh, 0, [[0, 'rgba(25,14,4,0)'], [.5, 'rgba(25,14,4,.62)'], [1, 'rgba(25,14,4,0)']]); g.fillRect(xc - sh, y0, sh * 2, RH);
        g.fillStyle = linear(g, xc - w / 2, 0, xc + w / 2, 0, [[0, '#c9a86e'], [.4, '#a8874f'], [1, '#5e4526']]); rr(g, xc - w / 2, y0 - 4, w, RH + 8, 5); g.fill();
        g.fillStyle = 'rgba(255,244,214,.3)'; g.fillRect(xc - w / 2 + 2, y0 - 2, 1.6, RH + 4);
      }
    }
  }
  g.fillStyle = linear(g, 0, 200, 0, 1000, [[0, 'rgba(10,12,16,0)'], [.45, 'rgba(10,12,16,.32)'], [1, 'rgba(4,5,8,.8)']]); g.fillRect(400, 190, 1120, 840);
  g.fillStyle = linear(g, 440, 0, 1480, 0, [[0, 'rgba(0,0,0,.6)'], [.22, 'rgba(0,0,0,0)'], [.78, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.6)']]); g.fillRect(400, 190, 1120, 840);
  g.fillStyle = o.tint || 'rgba(40,70,105,.07)'; g.fillRect(400, 190, 1120, 840);
  g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 960, 230, 620, [[0, o.inGlow || 'rgba(150,185,215,.17)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(400, 190, 1120, 840); g.globalCompositeOperation = 'source-over';
  g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(960, 978, 430, 48, 0, 0, TAU); g.fill();
  g.restore();
  g.save(); rr(g, 416, 176, 1088, 48, 24); g.fillStyle = linear(g, 0, 176, 0, 224, [[0, '#e6cb94'], [.4, '#b08e58'], [1, '#43301a']]); g.fill(); g.clip();
  g.strokeStyle = 'rgba(40,28,16,.4)'; g.lineWidth = 4; for (let x = 400; x < 1520; x += 24) { g.beginPath(); g.moveTo(x, 178); g.lineTo(x + 18, 224); g.stroke(); }
  g.fillStyle = 'rgba(255,250,235,.35)'; g.fillRect(416, 180, 1088, 5); g.restore();
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) {
    const x = 620 + i * 130 + Math.sin(t * .4 + i) * 30, w = 40 + 30 * hsh(i);
    g.beginPath(); g.moveTo(x - w * .4 + 200, -300); g.lineTo(x + w * .4 + 200, -300); g.lineTo(x + w * 1.6, 1000); g.lineTo(x - w * 1.6, 1000); g.closePath();
    g.fillStyle = linear(g, 0, -300, 0, 1000, [[0, `rgba(${o.ray || '190,220,255'},0)`], [.35, `rgba(${o.ray || '190,220,255'},${(.05 + .03 * Math.sin(t * .9 + i * 2)) * (o.rayA ?? 1)})`], [1, `rgba(${o.ray || '190,220,255'},0)`]]); g.fill();
  }
  const r = rng(21); for (let i = 0; i < 70; i++) { const x = 480 + r() * 960, y = 220 + ((r() * 760 - tw(t) * (6 + r() * 10)) % 760 + 760) % 760; g.globalAlpha = .15 + .35 * r() * (.6 + .4 * Math.sin(t * 3 + i)); g.fillStyle = o.dust || '#cfe2f5'; g.beginPath(); g.arc(x, y, .8 + r() * 1.6, 0, TAU); g.fill(); }
  g.restore();
}

// ---------- crab choreography ----------
function legKneePt(k, tp, u) {
  const hp = HIP[k], sd = k < 3 ? -1 : 1, dx = tp[0] - hp[0], dy = tp[1] - hp[1], len = Math.hypot(dx, dy) || 1;
  let px = -dy / len, py = dx / len; if (px * sd * .6 - py * .8 < 0) { px = -px; py = -py; }
  const bend = clamp(48 - len * .17, 6, 40), kx = (hp[0] + tp[0]) / 2 + px * bend, ky = (hp[1] + tp[1]) / 2 + py * bend;
  return [lerp(tp[0], kx, u), lerp(tp[1], ky, u)];
}
function pulledLegs(ph, amp, pull = 1) {
  const L = legsRest(ph, amp);
  L[2] = [lerp(L[2][0], -116, pull), lerp(L[2][1], 92, pull) + Math.sin(ph * 1.7) * 4 * pull];
  L[5] = [lerp(L[5][0], 116, pull), lerp(L[5][1], 92, pull) + Math.sin(ph * 1.9 + 1) * 4 * pull];
  return L;
}
function grabPts(cy, i) {
  const L = cy.legs;
  if (i === 0) return [crabPt(cy, ...L[2]), crabPt(cy, ...legKneePt(2, L[2], .4))];
  if (i === 1) return [crabPt(cy, ...legKneePt(5, L[5], .4)), crabPt(cy, ...L[5])];
  return [crabPt(cy, -30, 42), crabPt(cy, 30, 42)];
}
function pullerGrip(P, cy, i, k = 1, rl = [-80, -100], rr2 = [80, -100], ro = .5) {
  const [a, b] = grabPts(cy, i), la = toLocal(P, ...a), lb = toLocal(P, ...b);
  P.cl = [lerp(rl[0], la[0], k), lerp(rl[1], la[1], k)]; P.cr = [lerp(rr2[0], lb[0], k), lerp(rr2[1], lb[1], k)]; P.openL = P.openR = lerp(ro, 0, k);
}
const mix2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
function crabsAt(t) {
  const T = tw(t), cyan = Object.assign({ s: CS, brow: -.6, look: [0, -1] }, CYAN), P = [0, 1, 2].map(() => ({ s: CS, brow: .45, look: [0, -1] }));
  if (t < Q(10)) {
    const k = E.ioC(inv(Q(7), Q(7.75), t)), rel = inv(Q(7.55), Q(8.1), t), er = E.ioS(rel);
    const tug = 18 * (hit(t, Q(5), .45) + hit(t, Q(6), .45) + .6 * hit(t, Q(4.5), .35) + .6 * hit(t, Q(5.5), .35) + .6 * hit(t, Q(6.5), .35)) * (1 - k);
    cyan.x = 980 + 5 * nz(T * 3, 1); cyan.y = lerp(430, 760, k) + tug; cyan.rot = .06 * nz(T * 2.2, 2) * (1 - er * .6);
    cyan.legs = pulledLegs(T * 9, lerp(11, 2.5, er), 1 - er);
    const reach = 1 - er, sag = t > Q(8) ? .5 + .5 * Math.sin(T * 1.6) : 0;
    cyan.cl = mix2([-80, -100 + 4 * sag], [-72 + 6 * Math.sin(T * 6), -128 + 8 * Math.sin(T * 5)], reach);
    cyan.cr = mix2([80, -100 + 4 * sag], [40 + 5 * Math.sin(T * 7), -158 + 10 * Math.sin(T * 6.5)], reach);
    cyan.openL = lerp(.3, .5 + .3 * Math.sin(T * 6), reach); cyan.openR = lerp(.3, .55 + .35 * Math.sin(T * 7 + 1), reach); cyan.brow = -.75;
    for (let i = 0; i < 3; i++) {
      const p = P[i], rp = [RESTP[i][0] - 980, RESTP[i][1] - 760];
      p.x = cyan.x + lerp(REL[i][0], rp[0], k) + 3 * nz(T * 3, i + 5); p.y = cyan.y + lerp(REL[i][1], rp[1], k) - tug * .5 + 4 * k * (1 - k);
      p.rot = [-.14, .14, 0][i] * (1 - er) + .05 * nz(T * 2, i + 9);
      p.legs = legsRest(T * 8 + i, 5 * (1 - er) + 2); pullerGrip(p, cyan, i, 1 - er);
      if (rel > .5) p.look = [clamp((cyan.x - p.x) / 200, -1, 1), -.8];
    }
  } else if (t < Q(14)) {
    const ck = inv(Q(10), Q(12), t), strain = E.outC(inv(Q(12), Q(12.9), t)), yk = E.outE(inv(Q(13) - .03, Q(13) + .42, t));
    const yPre = t < Q(12) ? lerp(760, 300, E.ioS(ck)) : 300 - 22 * strain + 3 * Math.sin(t * 40) * strain * (1 - yk);
    const land = t > Q(13) + .3 ? 10 * Math.exp(-(t - Q(13) - .3) * 9) * Math.sin((t - Q(13) - .3) * 34) : 0;
    cyan.x = 980 + 6 * Math.sin(T * 6.5) * (ck < 1 ? 1 : .3); cyan.y = lerp(yPre, 730, yk) + land; cyan.rot = .04 * Math.sin(T * 6.5) * (1 - yk) + .05 * nz(T * 2, 3) * yk;
    const ph = T * 13, amp = t < Q(12) ? 16 * Math.sin(Math.PI * Math.min(1, ck * 1.1)) + 4 : 7, pullK = E.outC(inv(CLAMP[0] - .05, CLAMP[0] + .1, t));
    cyan.legs = pulledLegs(ph, amp, pullK);
    const hook = E.outC(inv(Q(11.75), Q(12), t)) * (1 - inv(Q(13) - .05, Q(13) + .1, t)), fl = inv(Q(13) - .05, Q(13) + .2, t);
    const c0l = [-72, -118 - 28 * Math.max(0, Math.sin(ph * .5))], c0r = [72, -118 - 28 * Math.max(0, -Math.sin(ph * .5))];
    const rimL = toLocal(cyan, cyan.x - 55, 196), rimR = toLocal(cyan, cyan.x + 55, 196);
    const fL = [-64, -140 + 10 * Math.sin(T * 7)], fR = [46, -168 + 12 * Math.sin(T * 6 + 1)];
    cyan.cl = mix2(mix2(c0l, rimL, hook), fL, fl * (1 - hook)); cyan.cr = mix2(mix2(c0r, rimR, hook), fR, fl * (1 - hook));
    cyan.openL = cyan.openR = lerp(lerp(.45, .05, hook), .7, fl * (1 - hook)); cyan.brow = t > Q(12) && t < Q(13) ? .2 : -.8;
    for (let i = 0; i < 3; i++) {
      const p = P[i], st = Q(10.5) + i * .15, ak = inv(st, CLAMP[i], t), e = E.ioC(ak), tg = [cyan.x + REL[i][0], cyan.y + REL[i][1]];
      p.rot = [-.14, .14, 0][i] + .04 * nz(T * 3, i);
      const gk = E.outC(inv(CLAMP[i] - .07, CLAMP[i], t));
      p.x = lerp(RESTP[i][0], tg[0], e); p.y = lerp(RESTP[i][1], tg[1], e);
      p.legs = legsRest(T * 14 + i * 2, ak > 0 && ak < 1 ? 14 : 4);
      pullerGrip(p, cyan, i, gk, [-70, -125 - 22 * e], [70, -125 - 22 * e], .85 * Math.min(1, ak * 4));
      p.brow = .6;
    }
  } else {
    cyan.x = 980 + 4 * Math.sin(T * 6); cyan.y = 730 + 6 * Math.sin(T * 4.4); cyan.rot = .05 * nz(T * 2, 3);
    cyan.legs = pulledLegs(T * 13, 9, 1); cyan.cl = [-64, -140 + 10 * Math.sin(T * 7)]; cyan.cr = [46, -168 + 12 * Math.sin(T * 6 + 1)];
    cyan.openL = .5 + .25 * Math.sin(T * 7); cyan.openR = .6 + .3 * Math.sin(T * 6); cyan.brow = -.85;
    for (let i = 0; i < 3; i++) {
      const p = P[i]; p.x = cyan.x + REL[i][0]; p.y = cyan.y + REL[i][1] + 5 * Math.sin(T * 5 + i); p.rot = [-.14, .14, 0][i] + .04 * nz(T * 3, i);
      p.legs = legsRest(T * 10 + i, 4); pullerGrip(p, cyan, i, 1); p.brow = .75;
      p.glow = E.outC(inv(GLOWT[i] - .05, GLOWT[i] + .25, t)) * (.85 + .15 * Math.sin(t * 9 + i * 2));
    }
  }
  const pile = PILE.map(([x, y, r, ph], j) => ({ x: x + 2 * nz(T * .8, j), y, rot: r + .03 * nz(T, j + 20), s: CS * .95, legs: legsRest(T * 3 + ph, 3), look: [clamp((cyan.x - x) / 300, -1, 1), -.8], cl: [-82, -96 + 4 * Math.sin(T * 2 + j)], cr: [82, -96], openL: .3, openR: .3, brow: .1 }));
  return { cyan, P, pile };
}
function bCam(t) {
  if (t < Q(7)) { const k = E.ioC(inv(Q(4), Q(7), t)); return [lerp(1016, 980, k), lerp(288, 520, k), Math.exp(lerp(Math.log(4), Math.log(1.3), k)), 0]; }
  if (t < Q(14) - .12) { const k = E.ioC(inv(Q(7), Q(8), t)), ce = E.ioS(inv(Q(10), Q(12.4), t)) * (1 - E.ioS(inv(Q(13), Q(13.8), t)) * .5); return [lerp(980, 960, k), lerp(520, 560, k) - 30 * ce, lerp(1.3, .9, k) * (1 + .06 * ce), 0]; }
  const ce = .5, e0 = [960, 560 - 30 * ce, .9 * (1 + .06 * ce)], k = E.ioE(inv(Q(14) - .12, Q(14) + .4, t)), z = E.ioS(inv(Q(14), Q(16), t));
  return [lerp(e0[0], 560, k), lerp(e0[1], 790, k), lerp(e0[2], 1.4, k) * (1 + .12 * z), -.025 * k];
}
function rimDust(g, t) {
  for (const [t0, n, sp] of [[Q(12), 16, 1], [Q(13), 22, 1.4]]) {
    const u = t - t0; if (u < 0 || u > 1.1) continue; const r = rng(Math.floor(t0 * 100));
    for (let i = 0; i < n; i++) {
      const side = i % 2 ? 1 : -1, x0 = 980 + side * 55 + (r() - .5) * 30, vx = (r() - .5) * 220 * sp, vy = -(60 + r() * 180) * sp, x = x0 + vx * u, y = 196 + vy * u + 700 * u * u;
      g.globalAlpha = clamp(1 - u / 1.1) * .9; g.fillStyle = r() < .5 ? '#d9c8a4' : '#8a7a5c'; g.save(); g.translate(x, y); g.rotate(u * 8 * (r() - .5)); g.fillRect(-4, -1.5, 8 + r() * 6, 3); g.restore();
    }
  }
  g.globalAlpha = 1;
}
function clampFx(g, t, S) {
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) {
    const u = t - CLAMP[i]; if (u < 0 || u > .35) continue; const k = u / .35;
    for (const pt of grabPts(S.cyan, i)) { g.strokeStyle = `rgba(255,190,140,${1 - k})`; g.lineWidth = 6 * (1 - k); g.beginPath(); g.arc(pt[0], pt[1], 10 + 60 * E.outC(k), 0, TAU); g.stroke(); glowDot(g, pt[0], pt[1], 60, `rgba(255,170,110,${.6 * (1 - k)})`); }
  }
  g.restore();
}
function drawHUD(g, t) {
  const a = inv(Q(10) - .1, Q(10) + .2, t) * (1 - inv(Q(14) - .25, Q(14), t)); if (a <= 0) return;
  const red = t >= Q(13) - .02, snap = E.outC(inv(Q(13) - .03, Q(13) + .2, t)), roll = .62 * E.outC(inv(Q(12), Q(12.95), t)) * (1 - snap), hk = hit(t, Q(13), .45);
  g.save(); g.globalAlpha = a; g.translate(1660 + nz(t * 40, 4) * 10 * hk, 108 + 20 * (1 - E.outC(inv(Q(10) - .1, Q(10) + .3, t)))); g.scale(1.3 * (1 + .15 * hk), 1.3 * (1 + .15 * hk));
  rr(g, -190, -46, 300, 92, 22); g.fillStyle = red ? `rgba(60,6,6,${.65 + .3 * hk})` : 'rgba(6,12,20,.62)'; g.fill(); g.strokeStyle = red ? RED : 'rgba(170,210,240,.5)'; g.lineWidth = 2.5; g.stroke();
  g.font = F(700, 42); g.fillStyle = red ? '#ffb3a8' : '#cfe0ee'; g.textBaseline = 'middle'; g.fillText('逃出：', -165, 2);
  g.save(); rr(g, 10, -36, 76, 72, 12); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill(); g.clip(); g.font = F(900, 60); g.textAlign = 'center'; g.fillStyle = red ? RED : '#fff';
  if (red) { g.shadowColor = RED; g.shadowBlur = 20; } g.fillText('0', 48, 4 - roll * 72); g.fillText('1', 48, 4 + 72 - roll * 72); g.restore();
  g.restore();
}
function sceneBasket(g, t) {
  g.fillStyle = '#05080c'; g.fillRect(0, 0, W, H);
  const [cx, cyy, s, r] = bCam(t), S = crabsAt(t);
  g.save(); cam(g, cx, cyy, s, r);
  drawBasket(g, t);
  S.pile.forEach(c => drawCrab(g, c.x, c.y, c));
  drawCrab(g, S.cyan.x, S.cyan.y, S.cyan);
  S.P.forEach(p => drawCrab(g, p.x, p.y, p));
  rimDust(g, t); clampFx(g, t, S);
  g.restore();
  const fk = E.ioS(inv(Q(14) - .12, Q(14) + .4, t)); if (fk > 0) { g.fillStyle = linear(g, 0, 0, 1250, 0, [[0, `rgba(3,5,9,${.82 * fk})`], [.6, `rgba(3,5,9,${.5 * fk})`], [1, 'rgba(3,5,9,0)']]); g.fillRect(0, 0, 1250, H); }
  slamT(g, '这个竹篓，没有盖子。', 960, 132, 86, Q(8), t, { t1: Q(10) - .05, color: (i) => i >= 5 && i <= 8 ? GOLD : '#fff' });
  slamT(g, '却没有一只，爬得出去。', 960, 1018, 80, Q(13), t, { t1: Q(14) - .02, color: (i) => i >= 1 && i <= 4 ? ORG : '#fff' });
  if (t >= Q(14) - .05) {
    rise(g, '因为拉住它的——', 120, 430, 76, Q(14), t, { align: 'left' });
    slamT(g, '是同伴。', 116, 700, 216, Q(15), t, { align: 'left', from: 2.6, color: () => linear(g, 0, -210, 0, 20, [[0, '#ffd8b8'], [.45, ORG], [1, '#c22a14']]), stroke: ['rgba(30,4,0,.7)', 10] });
  }
  drawHUD(g, t);
}
