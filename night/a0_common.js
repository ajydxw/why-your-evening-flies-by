// ================= ACTS: common helpers =================
const Q = bt, RED = '#ff5a5a', CREAM = '#f4e6c8', SKY = '#9fc2ff';
function rise(g, str, x, y, size, t0, t, o = {}) { // per-char rise-in, optional fade out at o.t1
  const out = o.t1 ? inv(o.t1 - .2, o.t1, t) : 0; if (t < t0 || out >= 1) return; const st = o.stag ?? .03;
  return kText(g, str, x, y, size, { align: o.align || 'center', color: o.color || '#fff', weight: o.weight || 900, alpha: (o.alpha ?? 1) * (1 - out), shadow: o.shadow === undefined ? 'rgba(0,0,0,.75)' : o.shadow, sBlur: 26, track: o.track || 0,
    fn: (i) => { const k = inv(t0 + i * st, t0 + i * st + .32, t); return { a: k, dy: (o.dy ?? 26) * (1 - E.outC(k)) }; } });
}
function slamT(g, str, x, y, size, t0, t, o = {}) { // lands exactly at t0
  const k = inv(t0 - .13, t0, t); if (k <= 0) return; const out = o.t1 ? inv(o.t1 - .18, o.t1, t) : 0; if (out >= 1) return;
  const s = lerp(o.from || 2.1, 1, E.inC(k)) * (1 + (t > t0 ? .05 * Math.exp(-(t - t0) * 9) : 0));
  g.save(); g.translate(x, y); g.scale(s, s); kText(g, str, 0, 0, size, { align: o.align || 'center', color: o.color || '#fff', weight: 900, alpha: clamp(k * 2.5) * (1 - out) * (o.alpha ?? 1), shadow: 'rgba(0,0,0,.8)', sBlur: 30, track: o.track || 0 }); g.restore();
}
function subT(g, str, t0, t1, t, o = {}) { const a = inv(t0, t0 + .2, t) * (1 - inv(t1 - .2, t1, t)); if (a <= 0) return; const y = o.y || 1000;
  g.save(); g.globalAlpha = a; g.fillStyle = linear(g, 0, y - 130, 0, y + 80, [[0, 'rgba(0,0,0,0)'], [.55, 'rgba(0,0,0,.55)'], [1, 'rgba(0,0,0,.6)']]); g.fillRect(0, y - 130, W, 210); g.restore();
  sub(g, str, t0, t1, t, Object.assign({ size: 58, y }, o)); }
function stampT(g, str, x, y, t0, t, o = {}) {
  const k = inv(t0 - .12, t0, t); if (k <= 0) return; const out = o.t1 ? inv(o.t1 - .2, o.t1, t) : 0; if (out >= 1) return;
  const s = lerp(2.8, 1, E.inC(k)), col = o.color || RED, size = o.size || 84;
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -.12); g.scale(s, s); g.globalAlpha = clamp(k * 3) * (1 - out) * .95;
  g.font = F(900, size); const w = g.measureText(str).width + size * .9, h = size * 1.45;
  g.fillStyle = 'rgba(20,6,10,.45)'; rr(g, -w / 2, -h / 2, w, h, size * .18); g.fill();
  g.strokeStyle = col; g.lineWidth = size * .09; rr(g, -w / 2, -h / 2, w, h, size * .18); g.stroke(); g.lineWidth = size * .03; rr(g, -w / 2 + size * .15, -h / 2 + size * .15, w - size * .3, h - size * .3, size * .1); g.stroke();
  g.fillStyle = col; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = col; g.shadowBlur = 20; g.fillText(str, 0, size * .05); g.restore();
}
function tagT(g, str, x, y, t0, t1, t, o = {}) { // small citation / label pill
  const a = inv(t0, t0 + .25, t) * (1 - inv(t1 - .25, t1, t)); if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = F(700, o.size || 30); const w = g.measureText(str).width + 40, h = (o.size || 30) * 1.7;
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x; rr(g, x0, y - h / 2, w, h, h / 2); g.fillStyle = o.bg || 'rgba(0,0,0,.45)'; g.fill(); g.strokeStyle = o.col || 'rgba(255,214,160,.6)'; g.lineWidth = 1.5; g.stroke();
  g.fillStyle = o.col || '#ffd9a0'; g.textBaseline = 'middle'; g.fillText(str, x0 + 20, y + 1); g.restore();
}
function orb(g, x, y, r, a = 1, col = AMB) { if (a <= 0) return; glowDot(g, x, y, r * 3.2, col === AMB ? `rgba(255,178,63,${.55 * a})` : `rgba(160,200,255,${.5 * a})`); g.save(); g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(x - r * .3, y - r * .3, r * .35, 0, TAU); g.fill(); g.restore(); }
function bgDeep(g, t, c0 = '#16112c', c1 = '#05040b', grid = 0) {
  g.fillStyle = radial(g, 960, 520, 1250, [[0, c0], [1, c1]]); g.fillRect(0, 0, W, H);
  if (grid) { g.save(); g.globalAlpha = grid; g.strokeStyle = 'rgba(150,170,255,.12)'; g.lineWidth = 1; for (let x = 0; x <= W; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore(); }
  const r = rng(77); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 60; i++) { const x = (r() * W + t * 8 * (r() - .5) * 3 + W * 2) % W, y = (r() * H - t * 6 * r() + H * 3) % H; g.globalAlpha = .08 + .2 * r(); g.fillStyle = r() < .6 ? '#ffcf8a' : '#9fc2ff'; g.beginPath(); g.arc(x, y, .8 + r() * 2, 0, TAU); g.fill(); } g.restore();
}
function drawRulerBar(g, x, y, len, h, label, o = {}) { // centered
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(o.s || 1, o.s || 1); g.globalAlpha *= (o.a ?? 1);
  const half = (side) => { // side -1 left half, 1 right half, 0 whole
    g.save(); if (side) { const sp = (o.split || 0); g.translate(side * sp * 60, sp * 30 * (side > 0 ? 1 : .4)); g.rotate(side * sp * .12); } if (side) { const cx = o.crackX || 0; g.beginPath(); if (side < 0) { g.moveTo(-len, -h); g.lineTo(cx + 8, -h); for (let i = 0; i <= 6; i++) g.lineTo(cx + (i % 2 ? -14 : 12), -h / 2 + h * i / 6); g.lineTo(cx, h); g.lineTo(-len, h); } else { g.moveTo(len, -h); g.lineTo(cx + 8, -h); for (let i = 0; i <= 6; i++) g.lineTo(cx + (i % 2 ? -14 : 12), -h / 2 + h * i / 6); g.lineTo(cx, h); g.lineTo(len, h); } g.closePath(); g.clip(); }
    g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; g.shadowOffsetY = 12; rr(g, -len / 2, -h / 2, len, h, 12); g.fillStyle = o.col || CREAM; g.fill(); g.shadowColor = 'transparent';
    g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(-len / 2 + 8, -h / 2 + 6, len - 16, 5); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(-len / 2 + 8, h / 2 - 10, len - 16, 6);
    g.strokeStyle = '#4a3a28'; g.lineWidth = 2; const step = o.step || 18, n = Math.floor(len / step); for (let i = 1; i < n; i++) { const xx = -len / 2 + i * step, L = i % 10 == 0 ? h * .42 : i % 5 == 0 ? h * .3 : h * .17; g.beginPath(); g.moveTo(xx, -h / 2); g.lineTo(xx, -h / 2 + L); g.stroke(); }
    if (label) { g.font = F(900, h * .42); g.fillStyle = '#2a1e12'; g.textBaseline = 'middle'; g.textAlign = 'center'; g.fillText(label, o.labelX || 0, h * .2); }
    if (o.glow) { g.globalCompositeOperation = 'lighter'; g.fillStyle = `rgba(255,190,90,${o.glow * .35})`; rr(g, -len / 2, -h / 2, len, h, 12); g.fill(); }
    g.restore();
  };
  if (o.crack) { half(-1); half(1); g.strokeStyle = `rgba(40,10,10,${o.crack})`; g.lineWidth = 3; } else half(0);
  g.restore();
}
function chapterBand(g, t, t0, n, title, small) { // overlay card landing on t0, lasting 2 beats
  const a = inv(t0 - .16, t0, t), b = inv(t0 + BEAT * 1.6, t0 + BEAT * 2, t); if (a <= 0 || b >= 1) return;
  const h = 440 * E.outE(a) * (1 - E.inC(b)), y0 = 540 - h / 2; g.save();
  g.fillStyle = 'rgba(6,5,14,.9)'; g.fillRect(0, y0, W, h); g.beginPath(); g.rect(0, y0, W, h); g.clip();
  glowDot(g, 960, 540, 900, 'rgba(255,170,70,.18)');
  const sx = -((t - t0) * 160) % 36; g.strokeStyle = 'rgba(255,200,120,.5)'; g.lineWidth = 2; for (let x = sx; x < W; x += 18) { const L = Math.round((x - sx) / 18) % 5 ? 14 : 30; g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y0 + L); g.moveTo(x, y0 + h); g.lineTo(x, y0 + h - L); g.stroke(); }
  const k = E.outB(inv(t0 - .05, t0 + .3, t)); g.save(); g.translate(620, 540); g.scale(k, k); g.rotate((1 - k) * -1.2); g.strokeStyle = AMB; g.lineWidth = 8; g.shadowColor = AMB; g.shadowBlur = 30; g.beginPath(); g.arc(0, 0, 120, 0, TAU); g.stroke();
  g.font = F(900, 150); g.fillStyle = AMB; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(n), 0, 10); g.restore();
  rise(g, small, 800, 445, 44, t0 + .05, t, { align: 'left', color: '#ffd9a0', weight: 700 });
  slamT(g, title, 790, 610, 170, t0 + .1, t, { align: 'left' });
  g.restore();
}
function drawEye(g, x, y, s, look, blink = 0) { // look: -1 left-up .. 1 right-up
  g.save(); g.translate(x, y); g.scale(s, s); const op = 1 - blink;
  g.beginPath(); g.moveTo(-90, 0); g.quadraticCurveTo(0, -70 * op, 90, 0); g.quadraticCurveTo(0, 70 * op, -90, 0); g.closePath(); g.fillStyle = '#f4f6fb'; g.fill(); g.save(); g.clip();
  const px = look * 34, py = -14; g.fillStyle = '#3d6fb8'; g.beginPath(); g.arc(px, py, 34, 0, TAU); g.fill(); g.fillStyle = '#0b0d16'; g.beginPath(); g.arc(px, py, 17, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(px - 9, py - 10, 7, 0, TAU); g.fill(); g.restore();
  g.strokeStyle = '#c9d3e6'; g.lineWidth = 5; g.beginPath(); g.moveTo(-90, 0); g.quadraticCurveTo(0, -70 * op, 90, 0); g.quadraticCurveTo(0, 70 * op, -90, 0); g.stroke(); g.restore();
}
function drawPhoneIcon(g, x, y, s, t, lit = 1, idx = 2) {
  g.save(); g.translate(x, y); g.scale(s, s); if (lit > 0) glowDot(g, 0, 0, 160, `rgba(150,195,255,${.35 * lit})`);
  rr(g, -40, -76, 80, 152, 14); g.fillStyle = '#15171f'; g.fill(); g.save(); rr(g, -35, -71, 70, 142, 10); g.clip(); drawCard(g, -35, -71, 70, 142, idx, t); g.fillStyle = `rgba(0,0,0,${.6 * (1 - lit)})`; g.fillRect(-36, -72, 72, 144); g.restore(); g.restore();
}
function drawJar(g, x, y, w, h, n, t, o = {}) { // bottom-center anchored at (x,y); n orbs inside
  g.save(); g.translate(x, y); g.rotate(o.rot || 0);
  const r = o.r || 9, cols = Math.max(1, Math.floor((w - 24) / (r * 2.2))), rr0 = rng(o.seed || 3);
  for (let i = 0; i < n; i++) { const c = i % cols, row = Math.floor(i / cols); const ox = -((cols - 1) * r * 2.2) / 2 + c * r * 2.2 + (row % 2) * r * .6 + (rr0() - .5) * 3, oy = -16 - r - row * r * 1.95; orb(g, ox, oy, r, 1); }
  if (o.falling) o.falling.forEach(([fx, fy, fa]) => orb(g, fx, fy, r, fa));
  g.strokeStyle = 'rgba(200,225,255,.75)'; g.lineWidth = 5; g.beginPath(); g.moveTo(-w / 2, -h); g.lineTo(-w / 2, -24); g.quadraticCurveTo(-w / 2, 0, -w / 2 + 24, 0); g.lineTo(w / 2 - 24, 0); g.quadraticCurveTo(w / 2, 0, w / 2, -24); g.lineTo(w / 2, -h); g.stroke();
  g.fillStyle = 'rgba(180,210,255,.08)'; g.fillRect(-w / 2, -h, w, h - 4); g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-w / 2 + 18, -h + 20); g.lineTo(-w / 2 + 18, -40); g.stroke();
  rr(g, -w / 2 - 12, -h - 22, w + 24, 26, 10); g.fillStyle = 'rgba(200,225,255,.35)'; g.fill();
  g.restore();
}
const LAYC = mk(W, H), LX = LAYC.getContext('2d');
function layer(g, a, fn) { if (a <= 0.003) return; if (a >= .997) { fn(g); return; } LX.setTransform(1, 0, 0, 1, 0, 0); LX.globalAlpha = 1; LX.globalCompositeOperation = 'source-over'; LX.filter = 'none'; LX.clearRect(0, 0, W, H); fn(LX); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.drawImage(LAYC, 0, 0); g.restore(); }
function layerT(g, a, fn) { if (a <= 0.003) return; if (a >= .997) { fn(g); return; } LX.setTransform(1, 0, 0, 1, 0, 0); LX.globalAlpha = 1; LX.globalCompositeOperation = 'source-over'; LX.filter = 'none'; LX.clearRect(0, 0, W, H); LX.setTransform(g.getTransform()); fn(LX); LX.setTransform(1, 0, 0, 1, 0, 0); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.drawImage(LAYC, 0, 0); g.restore(); }
function hexA(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
function bead(g, x, y, r, col, a = 1, glow = .6) { if (a <= .003 || r <= .5) return; if (glow) glowDot(g, x, y, r * 3.2, hexA(col, .5 * glow * a));
  g.save(); g.globalAlpha = a; g.fillStyle = radial(g, x - r * .35, y - r * .4, r * 1.5, [[0, '#ffffff'], [.22, col], [1, col]]); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  g.fillStyle = radial(g, x, y, r, [[.55, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.35)']]); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.ellipse(x - r * .38, y - r * .42, r * .26, r * .16, -.6, 0, TAU); g.fill(); g.restore(); }
function thread(g, x0, x1, y, a = 1, col = 'rgba(255,228,190,.65)', w = 3) { if (a <= 0 || x1 <= x0) return; g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo((x0 + x1) / 2, y + Math.min(26, (x1 - x0) * .02), x1, y); g.stroke();
  g.fillStyle = col; [x0, x1].forEach(x => { g.beginPath(); g.arc(x, y, w * 2.2, 0, TAU); g.fill(); }); g.restore(); }
function bubble(g, str, x, y, t0, t1, t, o = {}) { // speech bubble; tail toward (o.tx,o.ty)
  const a = inv(t0 - .12, t0 + .1, t), out = t1 ? inv(t1 - .15, t1, t) : 0; if (a <= 0 || out >= 1) return;
  const s = E.outB(a) * (1 - .2 * out), size = o.size || 52; g.save(); g.globalAlpha = 1 - out; g.translate(x, y); g.scale(s, s); g.font = F(900, size);
  const w = g.measureText(str).width + size * 1.5, h = size * 2.1, tx = (o.tx ?? x) - x, ty = (o.ty ?? y + 200) - y, bx = clamp(tx * .5, -w / 2 + h * .7, w / 2 - h * .7);
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 26; g.shadowOffsetY = 10; g.fillStyle = o.bg || '#fdfaf4';
  g.beginPath(); g.moveTo(bx - 22, h / 2 - 6); g.lineTo(tx * .45, Math.max(h / 2 + 30, ty * .55)); g.lineTo(bx + 22, h / 2 - 6); g.fill(); rr(g, -w / 2, -h / 2, w, h, h / 2); g.fill(); g.shadowColor = 'transparent';
  g.fillStyle = o.col || '#1d1a2a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(str, 0, size * .06); g.restore(); }
function cloudB(g, x, y, w, h, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = '#fdfaf4'; g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 26; g.shadowOffsetY = 10;
  const n = 9; g.beginPath(); for (let i = 0; i < n; i++) { const an = i / n * TAU; g.moveTo(x + Math.cos(an) * w * .42 + h * .3, y + Math.sin(an) * h * .36); g.arc(x + Math.cos(an) * w * .42, y + Math.sin(an) * h * .36, h * .3, 0, TAU); } g.fill(); g.beginPath(); g.ellipse(x, y, w * .45, h * .4, 0, 0, TAU); g.fill();
  [[.32, .62, .09], [.42, .78, .055]].forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + w * dx, y + h * dy, h * r * 1.6, 0, TAU); g.fill(); }); g.restore(); }
