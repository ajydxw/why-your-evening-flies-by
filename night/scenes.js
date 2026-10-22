// ================= shared props =================
function drawClock(g, x, y, r, hours, o = {}) {
  const { face = '#eef1f5', rim = '#262b35', tick = '#2a2f3a', sec = null, spin = 0, drip = 0, secCol = '#e0484d', shadow = true, ghosts = null } = o;
  g.save(); g.translate(x, y);
  if (shadow) { g.save(); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = r * .25; g.shadowOffsetY = r * .08; g.fillStyle = rim; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.restore(); }
  g.fillStyle = rim; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill();
  // drips (melting)
  if (drip > 0) {
    const D = [[1.28, 1.0, .9], [1.62, 1.6, 1.15], [1.95, .75, .8], [2.25, .45, .7]];
    D.forEach(([a, len, wd], i) => {
      const L = r * .55 * len * E.ioS(clamp(drip * (1.1 - i * .12))), bx = Math.cos(a) * r * .9, by = Math.sin(a) * r * .9, w = r * .11 * wd;
      g.fillStyle = rim; g.beginPath(); g.moveTo(bx - w * 1.6, by - w); g.quadraticCurveTo(bx - w * .7, by + L * .5, bx - w * .55, by + L); g.arc(bx, by + L, w * .8, Math.PI, 0, true); g.quadraticCurveTo(bx + w * .7, by + L * .5, bx + w * 1.6, by - w); g.fill();
      g.fillStyle = face; g.beginPath(); g.moveTo(bx - w * .9, by - w * 1.4); g.quadraticCurveTo(bx - w * .35, by + L * .45, bx - w * .25, by + L - w * .2); g.arc(bx, by + L - w * .2, w * .38, Math.PI, 0, true); g.quadraticCurveTo(bx + w * .35, by + L * .45, bx + w * .9, by - w * 1.4); g.fill();
    });
  }
  g.fillStyle = face; g.beginPath(); g.arc(0, 0, r * .9, 0, TAU); g.fill();
  g.fillStyle = 'rgba(0,0,0,.06)'; g.beginPath(); g.arc(0, r * .05, r * .9, 0, TAU); g.arc(0, -r * .02, r * .86, 0, TAU, true); g.fill();
  for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, big = i % 5 == 0; g.strokeStyle = tick; g.lineWidth = big ? r * .035 : r * .012; g.beginPath(); g.moveTo(Math.cos(a) * r * (big ? .7 : .78), Math.sin(a) * r * (big ? .7 : .78)); g.lineTo(Math.cos(a) * r * .84, Math.sin(a) * r * .84); g.stroke(); }
  const hand = (ang, len, wd, col, tail = .15) => { g.save(); g.rotate(ang); g.strokeStyle = col; g.lineCap = 'round'; g.lineWidth = wd; g.beginPath(); g.moveTo(0, r * tail); g.lineTo(0, -len); g.stroke(); g.restore(); };
  const hA = (hours % 12) / 12 * TAU, mA = (hours % 1) * TAU;
  if (spin > 0) { // blurred fan
    for (let i = 0; i < 14; i++) { g.globalAlpha = .1; hand(mA - i * .22 * spin, r * .72, r * .05, rim, 0); }
    g.globalAlpha = .18; g.fillStyle = rim; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r * .72, mA - Math.PI / 2 - 3 * spin, mA - Math.PI / 2); g.fill();
    g.globalAlpha = 1; hand(hA, r * .45, r * .07, rim); hand(mA, r * .72, r * .045, rim);
  } else {
    hand(hA, r * .45, r * .07, rim); if (!o.noMin) hand(mA, r * .72, r * .045, rim);
  }
  if (ghosts) ghosts.forEach(([a, al]) => { g.globalAlpha = al; hand(a, r * .8, r * .018, secCol, .22); }); g.globalAlpha = 1;
  if (sec != null) hand(sec, r * .8, r * .018, secCol, .22);
  g.fillStyle = secCol; g.beginPath(); g.arc(0, 0, r * .05, 0, TAU); g.fill();
  g.restore();
}

// ================= OFFICE =================
const OFF = (() => { const r = rng(31); return { dust: Array.from({ length: 70 }, () => [r() * 1900, r() * 1000, r(), r(), r()]) }; })();
function drawOffice(g, t, o = {}) {
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#56657b'], [1, '#353f4f']]); g.fillRect(-600, -300, W + 1200, H + 600);
  // blinds window
  g.fillStyle = '#2c3440'; g.fillRect(70, 150, 380, 500); g.fillStyle = linear(g, 0, 160, 0, 640, [[0, '#cfd9e4'], [1, '#9db0c4']]); g.fillRect(88, 168, 344, 464);
  for (let y = 176; y < 630; y += 24) { g.fillStyle = 'rgba(70,86,106,.55)'; g.fillRect(88, y, 344, 9); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(88, y + 9, 344, 2); }
  g.fillStyle = 'rgba(200,220,240,.06)'; g.beginPath(); g.moveTo(432, 168); g.lineTo(1100, 420); g.lineTo(1100, 900); g.lineTo(432, 632); g.fill();
  // fluorescent
  const fl = (hsh(Math.floor(t * 24) + 3) > .93) ? .6 : 1;
  g.fillStyle = '#2a313c'; g.fillRect(540, 24, 840, 30); g.fillStyle = `rgba(232,246,255,${fl})`; g.fillRect(556, 46, 808, 10);
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .16 * fl; g.fillStyle = linear(g, 0, 50, 0, 1000, [[0, 'rgba(210,235,255,1)'], [1, 'rgba(210,235,255,0)']]); g.beginPath(); g.moveTo(556, 56); g.lineTo(1364, 56); g.lineTo(1700, 1080); g.lineTo(220, 1080); g.fill(); g.restore();
  // partition
  g.fillStyle = '#465264'; g.fillRect(-600, 600, W + 1200, 200); g.fillStyle = '#6a778a'; g.fillRect(-600, 596, W + 1200, 10);
  for (let x = -560; x < W + 600; x += 18) { g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(x, 606, 2, 190); }
  // clock
  const cx = 960, cy = 300;
  drawClock(g, cx, cy, 150, o.hours ?? 15.78, { face: '#e6eaef', rim: '#232832', sec: o.sec, drip: o.drip || 0, ghosts: o.ghosts });
  // desk
  g.fillStyle = '#7b7365'; g.fillRect(-600, 770, W + 1200, 26); g.fillStyle = '#4a463f'; g.fillRect(-600, 796, W + 1200, 400); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-600, 796, W + 1200, 14);
  // monitor
  g.fillStyle = '#23262d'; g.beginPath(); g.moveTo(1240, 745); g.lineTo(1320, 745); g.lineTo(1345, 772); g.lineTo(1215, 772); g.fill(); g.fillRect(1268, 700, 24, 50);
  rr(g, 1070, 470, 420, 260, 12); g.fillStyle = '#1d2027'; g.fill();
  g.fillStyle = '#a8c3db'; g.fillRect(1086, 486, 388, 228);
  g.strokeStyle = 'rgba(40,70,100,.35)'; g.lineWidth = 1.5; for (let x = 1086; x < 1474; x += 48) { g.beginPath(); g.moveTo(x, 486); g.lineTo(x, 714); g.stroke(); } for (let y = 486; y < 714; y += 19) { g.beginPath(); g.moveTo(1086, y); g.lineTo(1474, y); g.stroke(); }
  g.fillStyle = 'rgba(60,110,160,.5)'; g.fillRect(1086, 486, 388, 19);
  g.fillStyle = '#f2d56b'; g.save(); g.translate(1478, 500); g.rotate(.12); g.fillRect(0, 0, 54, 54); g.restore(); g.fillStyle = '#9fd8b4'; g.save(); g.translate(1470, 560); g.rotate(-.08); g.fillRect(0, 0, 50, 50); g.restore();
  // mug (cold)
  rr(g, 1560, 690, 70, 82, 10); g.fillStyle = '#c9cfd8'; g.fill(); g.strokeStyle = '#c9cfd8'; g.lineWidth = 10; g.beginPath(); g.arc(1632, 728, 20, -1.2, 1.2); g.stroke();
  // papers
  g.fillStyle = '#d9dde3'; g.save(); g.translate(1640, 760); g.rotate(-.05); g.fillRect(0, 0, 200, 12); g.restore();
  drawWorker(g, t, o);
  // dust in light
  g.save(); g.globalCompositeOperation = 'lighter'; OFF.dust.forEach(([x, y, a, b, c]) => { const yy = (y + t * 10 * (a + .3)) % 1000, xx = x + Math.sin(t * .5 + b * 9) * 20; g.globalAlpha = .25 * c; g.fillStyle = '#e8f2ff'; g.beginPath(); g.arc(xx, yy, 1.5 + c * 2.5, 0, TAU); g.fill(); }); g.restore();
}
function drawWorker(g, t, o) {
  const bob = Math.sin(t * 1.3) * .03 + (o.nod || 0);
  // chair
  g.fillStyle = '#20252e'; rr(g, 560, 560, 46, 260, 18); g.fill(); rr(g, 560, 800, 230, 30, 12); g.fill(); g.fillRect(660, 828, 18, 200);
  // torso (back to the left, facing right)
  g.fillStyle = '#7d8aa0';
  g.beginPath(); g.moveTo(640, 820); g.bezierCurveTo(600, 720, 615, 610, 690, 585); g.bezierCurveTo(745, 568, 800, 590, 812, 640); g.bezierCurveTo(822, 700, 800, 770, 790, 820); g.closePath(); g.fill();
  g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.moveTo(640, 820); g.bezierCurveTo(600, 720, 615, 610, 690, 585); g.bezierCurveTo(660, 650, 655, 740, 680, 820); g.fill();
  // far arm resting on desk
  g.fillStyle = '#6f7b90'; rr(g, 760, 742, 210, 34, 17); g.fill(); g.fillStyle = '#cdb3a1'; g.beginPath(); g.ellipse(975, 758, 26, 17, 0, 0, TAU); g.fill();
  // head
  g.save(); g.translate(800, 545); g.rotate(-.18 + bob);
  g.fillStyle = '#cdb3a1'; g.beginPath(); g.ellipse(0, 0, 60, 66, 0, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(52, -6); g.quadraticCurveTo(72, 6, 56, 18); g.fill(); // nose
  g.fillStyle = '#2a2e38'; g.beginPath(); g.moveTo(-62, 12); g.bezierCurveTo(-74, -50, -30, -84, 14, -72); g.bezierCurveTo(52, -62, 66, -36, 60, -22); g.bezierCurveTo(30, -40, 0, -30, -14, -6); g.bezierCurveTo(-22, 10, -38, 30, -62, 12); g.fill();
  g.fillStyle = '#b89c8b'; g.beginPath(); g.ellipse(-20, 8, 11, 15, 0, 0, TAU); g.fill(); // ear
  // eye half-lidded
  const yawn = o.yawn || 0, blink = (hsh(Math.floor(t * 1.7)) > .85 && (t * 1.7) % 1 < .25) ? 1 : 0;
  g.strokeStyle = '#2a2e38'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(26, -8); g.lineTo(44, -6 + blink * 2); g.stroke();
  g.lineWidth = 3; g.globalAlpha = .6; g.beginPath(); g.moveTo(25, -15); g.quadraticCurveTo(36, -19, 46, -14); g.stroke(); g.globalAlpha = 1;
  g.fillStyle = 'rgba(60,40,50,.18)'; g.beginPath(); g.ellipse(34, 4, 12, 4, .1, 0, TAU); g.fill(); // eyebag
  g.fillStyle = '#7a5552'; g.beginPath(); g.ellipse(40, 34, 6 + yawn * 4, 2 + yawn * 12, 0, 0, TAU); g.fill();
  g.restore();
  // near arm propping chin
  g.fillStyle = '#7d8aa0'; g.beginPath(); g.moveTo(735, 615); g.quadraticCurveTo(770, 700, 842, 760); g.lineTo(872, 742); g.quadraticCurveTo(808, 680, 790, 610); g.fill();
  g.save(); g.translate(856, 750); g.rotate(-1.75 + bob * .5); g.fillStyle = '#7d8aa0'; rr(g, -18, -18, 170, 36, 18); g.fill(); g.restore();
  g.fillStyle = '#cdb3a1'; g.beginPath(); g.ellipse(846 + Math.sin(bob) * 20, 598, 26, 30, -.3, 0, TAU); g.fill();
}

// ================= BEDROOM =================
const BED = (() => {
  const r = rng(77); const B = []; let x = 1060;
  while (x < 1740) { const w = 60 + r() * 70, h = 150 + r() * 270; B.push({ x, w, h, win: [] }); x += w + 4 + r() * 10; }
  B.forEach((b, bi) => { for (let yy = 610 - b.h + 16; yy < 600; yy += 24) for (let xx = b.x + 10; xx < b.x + b.w - 12; xx += 20) { if (r() < .25) continue; const ord = (xx - 1060) / 680; const off = r() > .94 ? 2 : .06 + .62 * ord + .3 * r(); const tone = r(); b.win.push([xx, yy, off, tone]); } });
  const stars = Array.from({ length: 60 }, () => [1070 + r() * 660, 130 + r() * 300, r(), r()]);
  return { B, stars };
})();
function moonPos(p) { const a = [1135, 470], b = [1380, 120], c = [1690, 330]; const u = p; return [(1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * b[0] + u * u * c[0], (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * b[1] + u * u * c[1]]; }
function drawBedroom(g, t, s = {}) {
  const p = s.p ?? 0;
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#2c2348'], [1, '#191530']]); g.fillRect(-700, -400, W + 1400, H + 800);
  // window
  g.fillStyle = '#120e20'; g.fillRect(1040, 100, 720, 530);
  g.save(); g.beginPath(); g.rect(1060, 120, 680, 490); g.clip();
  g.fillStyle = linear(g, 0, 120, 0, 610, [[0, lerpC('#0b1434', '#070c24', p)], [1, lerpC('#25356a', '#151f44', p)]]); g.fillRect(1060, 120, 680, 490);
  BED.stars.forEach(([x, y, a, b]) => { g.globalAlpha = .3 + .5 * (.5 + .5 * Math.sin(t * 2 + b * 20)); g.fillStyle = '#fff'; g.fillRect(x, y, 2, 2); }); g.globalAlpha = 1;
  const [mx, my] = moonPos(p); glowDot(g, mx, my, 140, 'rgba(220,230,255,.35)'); g.fillStyle = '#f4f1e6'; g.beginPath(); g.arc(mx, my, 30, 0, TAU); g.fill(); g.fillStyle = 'rgba(180,180,200,.35)'; g.beginPath(); g.arc(mx - 8, my - 6, 7, 0, TAU); g.arc(mx + 10, my + 8, 5, 0, TAU); g.fill();
  if (s.trail) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 26; i++) { const q = p - i * .012; if (q < 0) break; const [ax, ay] = moonPos(q); g.globalAlpha = .1 * (1 - i / 26); g.fillStyle = '#e8eeff'; g.beginPath(); g.arc(ax, ay, 28, 0, TAU); g.fill(); } g.restore(); }
  BED.B.forEach(b => { g.fillStyle = '#101530'; g.fillRect(b.x, 610 - b.h, b.w, b.h); g.fillStyle = 'rgba(120,140,200,.08)'; g.fillRect(b.x, 610 - b.h, 3, b.h); });
  g.save(); g.globalCompositeOperation = 'lighter';
  BED.B.forEach(b => b.win.forEach(([x, y, off, tone]) => { const on = clamp((off - p) * 60); if (on <= 0) return; const col = tone < .7 ? `rgba(255,196,110,${.85 * on})` : tone < .9 ? `rgba(255,226,170,${.8 * on})` : `rgba(140,200,255,${.8 * on})`; g.fillStyle = col; g.fillRect(x, y, 11, 13); }));
  g.restore();
  g.restore();
  g.strokeStyle = '#120e20'; g.lineWidth = 14; g.beginPath(); g.moveTo(1400, 120); g.lineTo(1400, 610); g.moveTo(1060, 365); g.lineTo(1740, 365); g.stroke();
  g.fillStyle = '#100c1c'; g.fillRect(1030, 620, 740, 22);
  // curtains
  [[990, 1080, 1], [1720, 1830, -1]].forEach(([a, b, d]) => { g.fillStyle = linear(g, a, 0, b, 0, [[0, '#3a2a58'], [.5, '#4a3670'], [1, '#2e2148']]); g.beginPath(); g.moveTo(a, 80); g.lineTo(b, 80); g.bezierCurveTo(b - d * 10, 400, b + d * 20, 600, b - d * 5, 900); g.lineTo(a, 900); g.fill(); });
  // wall clock
  const hrs = s.hours ?? (21 + 4 * p);
  drawClock(g, 840, 300, 78, hrs, { face: '#f2e9da', rim: '#2a2033', spin: s.spin || 0, sec: null, secCol: '#e8a04a' });
  // lamp light pool
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 250, 520, 760, [[0, 'rgba(255,170,80,.34)'], [.5, 'rgba(255,140,70,.10)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(-500, -300, 1600, 1600); g.restore();
  // nightstand
  g.fillStyle = '#3a2838'; g.fillRect(110, 650, 280, 260); g.fillStyle = '#4b3447'; g.fillRect(100, 640, 300, 20); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(130, 700, 240, 4); g.fillStyle = '#c9a36f'; g.fillRect(240, 740, 30, 6);
  // lamp
  g.fillStyle = '#5a4a40'; g.fillRect(238, 570, 14, 72); g.beginPath(); g.ellipse(245, 640, 46, 9, 0, 0, TAU); g.fill();
  g.fillStyle = linear(g, 0, 470, 0, 575, [[0, '#ffe0a8'], [1, '#f0a85a']]); g.beginPath(); g.moveTo(195, 470); g.lineTo(295, 470); g.lineTo(330, 575); g.lineTo(160, 575); g.fill();
  glowDot(g, 245, 560, 220, 'rgba(255,190,110,.55)');
  // mug + steam
  rr(g, 318, 588, 52, 54, 8); g.fillStyle = '#e8dccd'; g.fill(); g.strokeStyle = '#e8dccd'; g.lineWidth = 7; g.beginPath(); g.arc(372, 612, 14, -1.2, 1.2); g.stroke();
  const st = s.steam ?? 1; if (st > 0) { g.save(); g.strokeStyle = 'rgba(255,240,220,.5)'; g.lineWidth = 4; g.lineCap = 'round'; for (let i = 0; i < 3; i++) { g.globalAlpha = st * (.6 - i * .12); g.beginPath(); for (let k = 0; k <= 20; k++) { const yy = 580 - k * 6, xx = 334 + i * 12 + Math.sin(k * .5 - t * 3 + i * 2) * 7 * (k / 20 + .3); k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.restore(); }
  // bed
  g.fillStyle = '#251b33'; g.fillRect(400, 760, 1420, 46); g.fillRect(420, 806, 26, 80); g.fillRect(1780, 806, 26, 80);
  g.fillStyle = '#e9e2f0'; g.fillRect(410, 690, 1400, 74);
  g.fillStyle = '#d2c7e3'; g.beginPath(); g.ellipse(520, 672, 132, 40, -.05, 0, TAU); g.fill();
  drawLying(g, t, s);
  // blanket
  g.fillStyle = linear(g, 0, 600, 0, 800, [[0, '#d6926e'], [1, '#8a5466']]);
  g.beginPath(); g.moveTo(600, 770); g.bezierCurveTo(600, 690, 640, 650, 700, 646); g.bezierCurveTo(820, 640, 950, 630, 1080, 640); g.bezierCurveTo(1200, 640, 1240, 590, 1320, 596); g.bezierCurveTo(1400, 600, 1440, 650, 1560, 650); g.bezierCurveTo(1660, 650, 1700, 630, 1760, 650); g.lineTo(1830, 700); g.lineTo(1830, 790); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,220,180,.45)'; g.lineWidth = 4; g.beginPath(); g.moveTo(700, 648); g.bezierCurveTo(820, 642, 950, 632, 1080, 642); g.bezierCurveTo(1200, 642, 1240, 592, 1320, 598); g.stroke();
  g.strokeStyle = 'rgba(120,60,80,.25)'; g.lineWidth = 3; [880, 1040, 1180, 1450, 1620].forEach(x => { g.beginPath(); g.moveTo(x, 660); g.quadraticCurveTo(x + 30, 720, x + 10, 780); g.stroke(); });
  // phone glow over the face (drawn after blanket)
  drawPhoneSide(g, t, s);
}
function lerpC(a, b, t) { const pa = [1, 3, 5].map(i => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.substr(i, 2), 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], t))).join(',')})`; }
function drawLying(g, t, s) {
  // head on pillow, face up-right
  g.save(); g.translate(560, 625); g.rotate(-.35);
  g.fillStyle = '#e2b79c'; g.beginPath(); g.ellipse(0, 0, 58, 64, 0, 0, TAU); g.fill();
  g.beginPath(); g.moveTo(48, -20); g.quadraticCurveTo(70, -8, 52, 6); g.fill();
  g.fillStyle = '#2a2236'; g.beginPath(); g.moveTo(-58, 20); g.bezierCurveTo(-76, -50, -24, -86, 18, -74); g.bezierCurveTo(48, -66, 60, -46, 54, -34); g.bezierCurveTo(22, -46, -4, -36, -16, -10); g.bezierCurveTo(-24, 10, -36, 36, -58, 20); g.fill();
  g.fillStyle = '#c99c83'; g.beginPath(); g.ellipse(-16, 6, 10, 14, 0, 0, TAU); g.fill();
  // eye open, staring
  g.fillStyle = '#1e1a26'; g.beginPath(); g.ellipse(30, -18, 6, 7, 0, 0, TAU); g.fill(); g.fillStyle = '#dff0ff'; g.beginPath(); g.arc(32, -20, 2.2, 0, TAU); g.fill();
  g.strokeStyle = '#1e1a26'; g.lineWidth = 3; g.beginPath(); g.moveTo(22, -30); g.quadraticCurveTo(32, -34, 42, -28); g.stroke();
  g.fillStyle = '#9c6d64'; g.beginPath(); g.ellipse(38, 24, 7, 2.5, -.3, 0, TAU); g.fill();
  g.restore();
  // arms up to phone
  const ph = s.phonePos || [700, 470];
  g.strokeStyle = '#46598c'; g.lineCap = 'round'; g.lineWidth = 40; g.beginPath(); g.moveTo(660, 690); g.quadraticCurveTo(720, 620, ph[0] + 10, ph[1] + 70); g.stroke();
  g.strokeStyle = '#3c4d7c'; g.lineWidth = 36; g.beginPath(); g.moveTo(720, 700); g.quadraticCurveTo(790, 600, ph[0] + 40, ph[1] + 40); g.stroke();
}
function drawPhoneSide(g, t, s) {
  const [px, py] = s.phonePos || [700, 470]; const fl = s.flick ?? 1;
  g.save(); g.globalCompositeOperation = 'lighter';
  g.globalAlpha = .55 * fl; g.fillStyle = linear(g, px, py, 560, 620, [[0, 'rgba(170,210,255,.9)'], [1, 'rgba(170,210,255,0)']]);
  g.beginPath(); g.moveTo(px - 40, py + 20); g.lineTo(px + 30, py + 50); g.lineTo(640, 720); g.lineTo(470, 600); g.closePath(); g.fill();
  g.globalAlpha = .9 * fl; g.fillStyle = radial(g, 590, 600, 120, [[0, 'rgba(160,205,255,.55)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(450, 470, 280, 260);
  g.restore();
  g.save(); g.translate(px, py); g.rotate(.6); rr(g, -26, -50, 52, 100, 9); g.fillStyle = '#1b1e28'; g.fill(); g.strokeStyle = 'rgba(170,210,255,.9)'; g.lineWidth = 2.5; g.stroke(); g.restore();
  g.fillStyle = '#e2b79c'; g.beginPath(); g.ellipse(px + 4, py + 52, 15, 12, .4, 0, TAU); g.fill(); g.beginPath(); g.ellipse(px + 40, py + 26, 14, 12, .4, 0, TAU); g.fill();
  glowDot(g, px - 10, py + 30, 90, 'rgba(160,205,255,.5)', fl);
}

// ================= PHONE CLOSE-UP =================
const CARDS = [
  { bg: ['#ff8a7a', '#ffc36b'], ic: 'cat' }, { bg: ['#2ec4b6', '#1b6f8a'], ic: 'bowl' }, { bg: ['#7b5cff', '#ff5ca8'], ic: 'pad' },
  { bg: ['#3a86ff', '#14d2ff'], ic: 'dance' }, { bg: ['#ff6b3d', '#6a3df0'], ic: 'mtn' }, { bg: ['#ffd23f', '#ff8f1f'], ic: 'haha' }];
function drawCard(g, x, y, w, h, idx, t) {
  const c = CARDS[((idx % CARDS.length) + CARDS.length) % CARDS.length];
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = linear(g, x, y, x + w * .4, y + h, [[0, c.bg[0]], [1, c.bg[1]]]); g.fillRect(x, y, w, h);
  const cx = x + w / 2, cy = y + h * .42, k = w / 500, wob = Math.sin(t * 6 + idx) * 6 * k;
  g.fillStyle = 'rgba(255,255,255,.92)'; g.strokeStyle = 'rgba(255,255,255,.92)'; g.lineCap = 'round'; g.lineJoin = 'round';
  if (c.ic === 'cat') { g.beginPath(); g.arc(cx, cy + wob, 95 * k, 0, TAU); g.fill(); g.beginPath(); g.moveTo(cx - 85 * k, cy - 40 * k + wob); g.lineTo(cx - 70 * k, cy - 140 * k + wob); g.lineTo(cx - 15 * k, cy - 85 * k + wob); g.moveTo(cx + 85 * k, cy - 40 * k + wob); g.lineTo(cx + 70 * k, cy - 140 * k + wob); g.lineTo(cx + 15 * k, cy - 85 * k + wob); g.fill(); g.fillStyle = c.bg[0]; g.beginPath(); g.arc(cx - 35 * k, cy + wob, 12 * k, 0, TAU); g.arc(cx + 35 * k, cy + wob, 12 * k, 0, TAU); g.fill(); }
  if (c.ic === 'bowl') { g.beginPath(); g.arc(cx, cy, 120 * k, 0, Math.PI); g.fill(); g.lineWidth = 12 * k; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(cx - 40 * k + i * 40 * k, cy - 30 * k); g.quadraticCurveTo(cx - 60 * k + i * 40 * k, cy - 80 * k + wob, cx - 40 * k + i * 40 * k, cy - 130 * k); g.stroke(); } }
  if (c.ic === 'pad') { rr(g, cx - 140 * k, cy - 60 * k, 280 * k, 130 * k, 60 * k); g.fill(); g.fillStyle = c.bg[0]; g.fillRect(cx - 95 * k, cy - 8 * k, 60 * k, 16 * k); g.fillRect(cx - 73 * k, cy - 30 * k, 16 * k, 60 * k); g.beginPath(); g.arc(cx + 60 * k, cy - 15 * k, 13 * k, 0, TAU); g.arc(cx + 95 * k, cy + 15 * k, 13 * k, 0, TAU); g.fill(); }
  if (c.ic === 'dance') { g.lineWidth = 22 * k; g.beginPath(); g.arc(cx, cy - 100 * k, 32 * k, 0, TAU); g.fill(); g.beginPath(); g.moveTo(cx, cy - 60 * k); g.lineTo(cx, cy + 40 * k); g.moveTo(cx, cy - 40 * k); g.lineTo(cx - 70 * k, cy - 90 * k + wob * 2); g.moveTo(cx, cy - 40 * k); g.lineTo(cx + 70 * k, cy - 10 * k - wob * 2); g.moveTo(cx, cy + 40 * k); g.lineTo(cx - 50 * k, cy + 120 * k); g.moveTo(cx, cy + 40 * k); g.lineTo(cx + 60 * k, cy + 110 * k); g.stroke(); }
  if (c.ic === 'mtn') { g.beginPath(); g.arc(cx + 60 * k, cy - 70 * k, 40 * k, 0, TAU); g.fill(); g.beginPath(); g.moveTo(cx - 170 * k, cy + 90 * k); g.lineTo(cx - 50 * k, cy - 50 * k); g.lineTo(cx + 20 * k, cy + 20 * k); g.lineTo(cx + 80 * k, cy - 20 * k); g.lineTo(cx + 170 * k, cy + 90 * k); g.fill(); }
  if (c.ic === 'haha') { g.font = F(900, 110 * k); g.textAlign = 'center'; g.fillText('哈哈哈', cx, cy + 20 * k + wob); g.font = F(900, 70 * k); g.fillText('哈哈哈哈', cx, cy + 110 * k); }
  // UI
  g.fillStyle = 'rgba(255,255,255,.9)'; const ux = x + w - 60 * k; [0, 1, 2].forEach(i => { g.beginPath(); g.arc(ux, y + h * .55 + i * 95 * k, 24 * k, 0, TAU); g.fill(); g.fillRect(ux - 20 * k, y + h * .55 + i * 95 * k + 34 * k, 40 * k, 8 * k); });
  g.fillStyle = 'rgba(255,255,255,.85)'; rr(g, x + 34 * k, y + h * .8, 260 * k, 22 * k, 11 * k); g.fill(); g.fillStyle = 'rgba(255,255,255,.55)'; rr(g, x + 34 * k, y + h * .8 + 40 * k, 340 * k, 18 * k, 9 * k); g.fill();
  g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x, y + h - 8 * k, w, 4 * k); g.fillStyle = '#fff'; g.fillRect(x, y + h - 8 * k, w * ((t * .4 + idx * .3) % 1), 4 * k);
  g.restore();
}
// big phone in hand, s: {idx, k (swipe 0..1), trail:[...], thumb}
function drawPhoneCU(g, t, s = {}) {
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#1a1530'], [1, '#0c0a18']]); g.fillRect(-800, -600, W + 1600, H + 1200);
  // bokeh
  g.save(); g.globalCompositeOperation = 'lighter'; [[260, 260, 160, 'rgba(255,170,80,.18)'], [1640, 200, 120, 'rgba(255,200,120,.12)'], [1500, 860, 200, 'rgba(120,150,255,.10)'], [380, 880, 140, 'rgba(255,140,90,.12)']].forEach(([x, y, r, c]) => { g.fillStyle = radial(g, x, y, r, [[0, c], [.8, c], [1, 'rgba(0,0,0,0)']]); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }); g.restore();
  const PW = 520, PHh = 1040, px = 960 - PW / 2, py = 40;
  g.save(); g.translate(960, 560); g.rotate(-.05); g.translate(-960, -560);
  // light spill
  glowDot(g, 960, 560, 900, 'rgba(140,180,255,.22)');
  g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 60; rr(g, px - 18, py - 18, PW + 36, PHh + 36, 70); g.fillStyle = '#15171f'; g.fill(); g.restore();
  rr(g, px - 18, py - 18, PW + 36, PHh + 36, 70); g.strokeStyle = '#3b4050'; g.lineWidth = 4; g.stroke();
  g.save(); rr(g, px, py, PW, PHh, 54); g.clip();
  const k = s.k || 0, idx = s.idx || 0;
  drawCard(g, px, py - k * PHh, PW, PHh, idx, t); if (k > 0) drawCard(g, px, py + (1 - k) * PHh, PW, PHh, idx + 1, t);
  // status bar
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(px, py, PW, 60); g.fillStyle = '#fff'; g.font = F(700, 26); g.textAlign = 'left'; g.fillText(s.clock || '21:00', px + 48, py + 42);
  const bat = s.bat ?? .78; g.strokeStyle = '#fff'; g.lineWidth = 2.5; rr(g, px + PW - 100, py + 22, 46, 22, 5); g.stroke(); g.fillStyle = bat < .2 ? '#ff4d4d' : '#fff'; g.fillRect(px + PW - 96, py + 26, 38 * bat, 14); g.fillRect(px + PW - 52, py + 28, 4, 10);
  g.restore();
  g.restore();
  // swipe trail
  if (s.trail && s.trail.length > 1) { g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round'; for (const [lw, a] of [[60, .12], [30, .3], [12, .9]]) { g.strokeStyle = `rgba(255,178,63,${a})`; g.lineWidth = lw; g.beginPath(); s.trail.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); } g.restore(); }
  // hand: fingers wrap left edge, palm bottom-right, thumb over screen
  const [tx, ty] = s.thumb || [1080, 820];
  g.save(); g.translate(960, 560); g.rotate(-.05); g.translate(-960, -560);
  [[640, 0], [700, 1], [770, 2], [845, 3]].forEach(([y, i]) => { g.fillStyle = i % 2 ? '#d29d80' : '#dcab8e'; rr(g, 650, y, 74, 64, 30); g.fill(); g.fillStyle = 'rgba(255,230,215,.35)'; g.beginPath(); g.ellipse(706, y + 30, 10, 18, 0, 0, TAU); g.fill(); });
  g.fillStyle = '#d6a385'; g.beginPath(); g.moveTo(1100, 1200); g.bezierCurveTo(1120, 1010, 1180, 930, 1250, 900); g.bezierCurveTo(1320, 960, 1360, 1080, 1360, 1200); g.fill();
  g.restore();
  g.save(); g.lineCap = 'round'; g.strokeStyle = '#e2ad8f'; g.lineWidth = 104; g.beginPath(); g.moveTo(1290, 1160); g.bezierCurveTo(1290, 1020, tx + 70, ty + 140, tx + 12, ty + 30); g.stroke();
  g.strokeStyle = 'rgba(120,60,40,.16)'; g.lineWidth = 5; g.beginPath(); g.moveTo(1250, 1120); g.bezierCurveTo(1240, 1010, tx + 40, ty + 150, tx - 20, ty + 60); g.stroke();
  g.fillStyle = '#f0c7ae'; g.beginPath(); g.ellipse(tx + 8, ty + 18, 30, 38, -.35, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(tx + 2, ty + 10, 12, 16, -.35, 0, TAU); g.fill(); g.restore();
}

// ================= TOP-DOWN =================
function drawTopDown(g, t, s = {}) {
  g.fillStyle = '#1b1424'; g.fillRect(-2000, -2000, 6000, 6000);
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 3; for (let x = -1200; x < 3200; x += 90) { g.beginPath(); g.moveTo(x, -1500); g.lineTo(x, 2600); g.stroke(); }
  // lamp glow on nightstand
  g.fillStyle = '#3a2838'; g.fillRect(260, -60, 230, 230); glowDot(g, 380, 60, 520, 'rgba(255,170,80,.35)'); g.fillStyle = '#ffd59a'; g.beginPath(); g.arc(380, 60, 58, 0, TAU); g.fill();
  // rug + slippers
  g.fillStyle = '#2b2036'; rr(g, 380, 880, 1160, 380, 40); g.fill(); g.fillStyle = '#5a4a6e'; [[430, 960], [480, 975]].forEach(([x, y]) => { rr(g, x - 20, y - 46, 40, 92, 20); g.fill(); });
  // right nightstand + digital clock
  g.fillStyle = '#3a2838'; g.fillRect(1430, -60, 230, 230); rr(g, 1470, 10, 150, 80, 14); g.fillStyle = '#0d0b14'; g.fill(); g.font = F(900, 50); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ff6a5a'; g.shadowColor = '#ff4a3a'; g.shadowBlur = 16; g.fillText(s.clock || '00:46', 1545, 52); g.shadowBlur = 0; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  // bed
  g.fillStyle = '#251b33'; g.fillRect(530, -160, 860, 1500); g.fillStyle = '#e6deef'; g.fillRect(550, -140, 820, 1460);
  g.fillStyle = '#d4c9e6'; rr(g, 700, -90, 520, 190, 70); g.fill();
  // person (face up)
  g.fillStyle = '#46598c'; g.beginPath(); g.ellipse(960, 330, 200, 110, 0, 0, TAU); g.fill();
  g.fillStyle = '#e2b79c'; g.beginPath(); g.ellipse(960, 150, 82, 96, 0, 0, TAU); g.fill();
  g.fillStyle = '#2a2236'; g.beginPath(); g.ellipse(960, 96, 96, 70, 0, Math.PI, TAU); g.fill(); g.beginPath(); g.ellipse(960, 92, 92, 52, 0, 0, Math.PI); g.fill();
  g.fillStyle = '#1e1a26'; g.beginPath(); g.ellipse(928, 160, 9, 10, 0, 0, TAU); g.ellipse(992, 160, 9, 10, 0, 0, TAU); g.fill(); g.fillStyle = '#dff0ff'; g.beginPath(); g.arc(931, 164, 3, 0, TAU); g.arc(995, 164, 3, 0, TAU); g.fill();
  g.fillStyle = '#9c6d64'; g.beginPath(); g.ellipse(960, 212, 12, 4, 0, 0, TAU); g.fill();
  // blanket
  g.fillStyle = linear(g, 0, 380, 0, 1300, [[0, '#d6926e'], [1, '#8a5466']]); g.beginPath(); g.moveTo(560, 400); g.bezierCurveTo(760, 370, 1160, 370, 1360, 400); g.lineTo(1360, 1330); g.lineTo(560, 1330); g.fill();
  g.strokeStyle = 'rgba(255,220,180,.35)'; g.lineWidth = 5; g.beginPath(); g.moveTo(560, 402); g.bezierCurveTo(760, 372, 1160, 372, 1360, 402); g.stroke();
  // arms
  g.strokeStyle = '#3c4d7c'; g.lineCap = 'round'; g.lineWidth = 46; g.beginPath(); g.moveTo(800, 330); g.quadraticCurveTo(820, 470, 905, 500); g.moveTo(1120, 330); g.quadraticCurveTo(1100, 470, 1015, 500); g.stroke();
  // phone (screen facing up at us)
  const px = 960, py = 470;
  glowDot(g, px, py, 380, 'rgba(150,195,255,.35)'); glowDot(g, 960, 170, 160, 'rgba(160,205,255,.35)');
  rr(g, px - 44, py - 84, 88, 168, 14); g.fillStyle = '#15171f'; g.fill();
  g.save(); rr(g, px - 39, py - 79, 78, 158, 11); g.clip(); drawCard(g, px - 39, py - 79, 78, 158, s.idx || 2, t); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(px - 40, py - 80, 80, 160); g.restore();
  g.fillStyle = '#e2b79c'; [[-50, 30], [-50, 55], [50, 30], [50, 55]].forEach(([dx, dy]) => { g.beginPath(); g.ellipse(px + dx, py + dy, 13, 11, 0, 0, TAU); g.fill(); });
  // swipe trace blob (10cm)
  const n = s.traces || 0; if (n > 0) { const r = rng(5); g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    for (let i = 0; i < n; i++) { const x = px + 10 + (r() - .5) * 26, y0 = py + 50 + (r() - .5) * 10, y1 = py - 50 + (r() - .5) * 10; g.strokeStyle = `rgba(255,178,63,${.055})`; g.lineWidth = 4 + r() * 4; g.beginPath(); g.moveTo(x, y0); g.quadraticCurveTo(x - 8, py, x + (r() - .5) * 8, y1); g.stroke(); }
    glowDot(g, px + 10, py, 110, `rgba(255,170,60,${Math.min(.4, n / 300)})`); g.restore(); }
  // thumb
  g.fillStyle = '#efc2a6'; g.beginPath(); g.ellipse(px + 30, py + 70 - (s.thumbUp || 0) * 100, 15, 22, 0, 0, TAU); g.fill();
}
