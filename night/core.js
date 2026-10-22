'use strict';
const W = 1920, H = 1080;
const C = document.getElementById('cv'); C.width = W; C.height = H;
const X = C.getContext('2d');
const BEAT = 60 / 84.15, PH = 0.145; const bt = k => PH + k * BEAT;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const inv = (a, b, v) => clamp((v - a) / (b - a));
const TAU = Math.PI * 2;
const E = {
  inC: t => t * t * t, outC: t => 1 - Math.pow(1 - t, 3), ioC: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outE: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t), inE: t => t <= 0 ? 0 : Math.pow(2, 10 * t - 10),
  ioE: t => t <= 0 ? 0 : t >= 1 ? 1 : t < .5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  outB: t => { const c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  ioQ: t => t < .5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2, outQ: t => 1 - Math.pow(1 - t, 5), inQ: t => t ** 5,
  outEl: t => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -9 * t) * Math.sin((t * 8 - .75) * TAU / 3) + 1,
  ioS: t => t * t * (3 - 2 * t)
};
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hsh(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function nz(t, seed = 0) { const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f); return lerp(hsh(i + seed * 71.3), hsh(i + 1 + seed * 71.3), u) * 2 - 1; }
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const F = (w, s) => `${w} ${s}px "Noto Sans SC"`;
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function radial(ctx, x, y, r, stops) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function linear(ctx, x0, y0, x1, y1, stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g; }
function glowDot(ctx, x, y, r, col, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.fillStyle = radial(ctx, x, y, r, [[0, col], [1, 'rgba(0,0,0,0)']]); ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore(); }

// ---------- buffers ----------
const BUF = mk(W, H), BX = BUF.getContext('2d');
const TMP = mk(W, H), TX = TMP.getContext('2d');
const SM = mk(480, 270), SX = SM.getContext('2d');
const SM2 = mk(480, 270), SX2 = SM2.getContext('2d');
const GRAIN = (() => { const c = mk(512, 512), g = c.getContext('2d'), d = g.createImageData(512, 512), r = rng(9); for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; })();

// ---------- post fx ----------
function bloom(ctx, amt = .5, rad = 10, thr = 'contrast(1.9) brightness(0.75)') {
  SX.save(); SX.filter = thr; SX.clearRect(0, 0, 480, 270); SX.drawImage(ctx.canvas, 0, 0, 480, 270); SX.restore();
  SX2.save(); SX2.clearRect(0, 0, 480, 270); SX2.filter = `blur(${rad}px)`; SX2.drawImage(SM, 0, 0); SX2.restore();
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = amt; ctx.drawImage(SM2, 0, 0, W, H); ctx.globalAlpha = amt * .6; SX.save(); SX.filter = `blur(${rad * 3}px)`; SX.clearRect(0, 0, 480, 270); SX.drawImage(SM2, 0, 0); SX.restore(); ctx.drawImage(SM, 0, 0, W, H); ctx.restore();
}
function grain(ctx, t, a = .07) { ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = a; const ox = Math.floor(hsh(Math.floor(t * 30)) * 512), oy = Math.floor(hsh(Math.floor(t * 30) + 7) * 512); for (let x = -ox; x < W; x += 512) for (let y = -oy; y < H; y += 512) ctx.drawImage(GRAIN, x, y); ctx.restore(); }
function vignette(ctx, a = .55, col = '0,0,0') { ctx.save(); ctx.fillStyle = radial(ctx, W / 2, H / 2, 1150, [[0, `rgba(${col},0)`], [.55, `rgba(${col},0)`], [1, `rgba(${col},${a})`]]); ctx.fillRect(0, 0, W, H); ctx.restore(); }
function flash(ctx, a, col = '#fff') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
const CH = [mk(W, H), mk(W, H), mk(W, H)];
function chroma(ctx, amt, ang = 0) {
  if (amt < .3) return;
  TX.clearRect(0, 0, W, H); TX.drawImage(ctx.canvas, 0, 0);
  const cols = ['#f00', '#0f0', '#00f'], off = [-1, 0, 1];
  ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) { const c = CH[i].getContext('2d'); c.globalCompositeOperation = 'source-over'; c.drawImage(TMP, 0, 0); c.globalCompositeOperation = 'multiply'; c.fillStyle = cols[i]; c.fillRect(0, 0, W, H); ctx.drawImage(CH[i], off[i] * amt * Math.cos(ang), off[i] * amt * Math.sin(ang)); }
  ctx.restore();
}
function zoomBlur(ctx, cx, cy, amt, n = 8) { // radial streak
  if (amt < .002) return; TX.clearRect(0, 0, W, H); TX.drawImage(ctx.canvas, 0, 0);
  ctx.save(); for (let i = 1; i <= n; i++) { const s = 1 + amt * i / n; ctx.globalAlpha = .5 / i * 1.6; ctx.setTransform(s, 0, 0, s, cx * (1 - s), cy * (1 - s)); ctx.drawImage(TMP, 0, 0); } ctx.restore();
}
function motionBlurX(ctx, dx, n = 10) { if (Math.abs(dx) < 1) return; TX.clearRect(0, 0, W, H); TX.drawImage(ctx.canvas, 0, 0); ctx.save(); for (let i = 1; i <= n; i++) { ctx.globalAlpha = 1 / (i + 1); ctx.drawImage(TMP, dx * i / n, 0); } ctx.restore(); }
function motionBlurY(ctx, dy, n = 10) { if (Math.abs(dy) < 1) return; TX.clearRect(0, 0, W, H); TX.drawImage(ctx.canvas, 0, 0); ctx.save(); for (let i = 1; i <= n; i++) { ctx.globalAlpha = 1 / (i + 1); ctx.drawImage(TMP, 0, dy * i / n); } ctx.restore(); }

// ---------- camera ----------
function cam(ctx, cx, cy, s, rot = 0, sx = 0, sy = 0) { // world point (cx,cy) to screen center
  ctx.translate(W / 2 + sx, H / 2 + sy); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(-cx, -cy);
}
function shakeAt(t, hits) { let x = 0, y = 0, r = 0; for (const [t0, a, d = .45] of hits) { const u = t - t0; if (u < 0 || u > d) continue; const k = a * Math.pow(1 - u / d, 2); x += nz(u * 38, t0) * k; y += nz(u * 41, t0 + 3) * k; r += nz(u * 30, t0 + 5) * k * .0012; } return { x, y, r }; }

// ---------- text ----------
function layout(ctx, str, size, weight = 900, track = 0) {
  ctx.font = F(weight, size); const out = []; let x = 0;
  for (const ch of str) { const w = ctx.measureText(ch).width; out.push({ ch, x, w }); x += w + track * size; }
  return { chars: out, w: x - track * size, size, weight };
}
// draw a line with per-char transform callback fn(i,n)->{dx,dy,s,a,rot,sy}
function kText(ctx, str, x, y, size, opt = {}) {
  const { weight = 900, color = '#fff', align = 'left', track = 0, fn = null, shadow = 'rgba(0,0,0,.55)', sBlur = 24, stroke = null } = opt;
  const L = layout(ctx, str, size, weight, track); let x0 = x; if (align === 'center') x0 = x - L.w / 2; else if (align === 'right') x0 = x - L.w;
  ctx.save(); ctx.font = F(weight, size); ctx.textBaseline = 'alphabetic';
  L.chars.forEach((c, i) => {
    const col = typeof color === 'function' ? color(i, c.ch) : color;
    const p = fn ? fn(i, L.chars.length, c) : {}; const a = p.a ?? 1; if (a <= 0.001) return;
    ctx.save(); ctx.globalAlpha = a * (opt.alpha ?? 1); ctx.translate(x0 + c.x + c.w / 2 + (p.dx || 0), y + (p.dy || 0)); ctx.rotate(p.rot || 0); ctx.scale((p.s ?? 1) * (p.sx ?? 1), (p.s ?? 1) * (p.sy ?? 1));
    if (shadow) { ctx.shadowColor = shadow; ctx.shadowBlur = sBlur; ctx.shadowOffsetY = 6; }
    if (stroke) { ctx.lineWidth = stroke[1]; ctx.strokeStyle = stroke[0]; ctx.lineJoin = 'round'; ctx.strokeText(c.ch, -c.w / 2, -size * .0); }
    ctx.fillStyle = col; ctx.fillText(c.ch, -c.w / 2, 0); ctx.restore();
  });
  ctx.restore(); return L;
}

// ---------- shards ----------
function clipPoly(poly, nx, ny, c) { // keep n·p <= c
  const out = []; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; const da = nx * a[0] + ny * a[1] - c, db = nx * b[0] + ny * b[1] - c; if (da <= 0) out.push(a); if ((da <= 0) !== (db <= 0)) { const k = da / (da - db); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); } } return out;
}
function voronoi(seeds, x0, y0, x1, y1) {
  return seeds.map((s, i) => { let P = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; for (let j = 0; j < seeds.length; j++) { if (j === i) continue; const o = seeds[j], nx = o[0] - s[0], ny = o[1] - s[1]; const mx = (o[0] + s[0]) / 2, my = (o[1] + s[1]) / 2; P = clipPoly(P, nx, ny, nx * mx + ny * my); if (!P.length) break; } return P; });
}
function polyInfo(P) { let cx = 0, cy = 0; P.forEach(p => { cx += p[0]; cy += p[1]; }); cx /= P.length; cy /= P.length; let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9; P.forEach(p => { bx0 = Math.min(bx0, p[0]); by0 = Math.min(by0, p[1]); bx1 = Math.max(bx1, p[0]); by1 = Math.max(by1, p[1]); }); return { P, cx, cy, bx: Math.floor(bx0) - 1, by: Math.floor(by0) - 1, bw: Math.ceil(bx1 - bx0) + 3, bh: Math.ceil(by1 - by0) + 3 }; }
// draw one shard of source image src: polygon info S at transform (px,py,rot,sc,flip)
function drawShard(ctx, src, S, px, py, rot, sc, flip = 1, alpha = 1, edge = null) {
  if (alpha <= 0.003) return; ctx.save(); ctx.globalAlpha = alpha; ctx.translate(px, py); ctx.rotate(rot); ctx.scale(sc * flip, sc);
  ctx.beginPath(); S.P.forEach((p, i) => i ? ctx.lineTo(p[0] - S.cx, p[1] - S.cy) : ctx.moveTo(p[0] - S.cx, p[1] - S.cy)); ctx.closePath();
  ctx.save(); ctx.clip(); const bx = Math.max(0, S.bx), by = Math.max(0, S.by), bw = Math.min(src.width - bx, S.bw), bh = Math.min(src.height - by, S.bh); if (bw > 0 && bh > 0) ctx.drawImage(src, bx, by, bw, bh, bx - S.cx, by - S.cy, bw, bh); ctx.restore();
  if (edge) { ctx.lineWidth = edge[1] / sc; ctx.strokeStyle = edge[0]; ctx.stroke(); }
  ctx.restore();
}
// triangulated text into shards
function shardText(lines, cell = 30, seed = 1) {
  const cv = mk(W, H), g = cv.getContext('2d'); let bx0 = W, by0 = H, bx1 = 0, by1 = 0;
  lines.forEach(L => { const lay = kText(g, L.str, L.x, L.y, L.size, L.opt || {}); const x0 = (L.opt && L.opt.align === 'center') ? L.x - lay.w / 2 : L.x; bx0 = Math.min(bx0, x0 - 20); bx1 = Math.max(bx1, x0 + lay.w + 20); by0 = Math.min(by0, L.y - L.size * 1.0); by1 = Math.max(by1, L.y + L.size * .3); });
  const d = g.getImageData(0, 0, W, H).data; const r = rng(seed); const nx = Math.ceil((bx1 - bx0) / cell), ny = Math.ceil((by1 - by0) / cell);
  const pt = []; for (let j = 0; j <= ny; j++) { pt[j] = []; for (let i = 0; i <= nx; i++) { const ed = (i == 0 || j == 0 || i == nx || j == ny); pt[j][i] = [bx0 + i * cell + (ed ? 0 : (r() - .5) * cell * .8), by0 + j * cell + (ed ? 0 : (r() - .5) * cell * .8)]; } }
  const alphaAt = (x, y) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return 0; return d[(y * W + x) * 4 + 3]; };
  const tris = []; for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = pt[j][i], b = pt[j][i + 1], c = pt[j + 1][i + 1], e = pt[j + 1][i]; const T2 = (r() < .5) ? [[a, b, c], [a, c, e]] : [[a, b, e], [b, c, e]];
    for (const T of T2) { let hit = 0; for (let s = 0; s < 9; s++) { const u = r(), v = r() * (1 - u); const x = T[0][0] + (T[1][0] - T[0][0]) * u + (T[2][0] - T[0][0]) * v, y = T[0][1] + (T[1][1] - T[0][1]) * u + (T[2][1] - T[0][1]) * v; if (alphaAt(x, y) > 30) { hit = 1; break; } } if (hit) { const S = polyInfo(T); S.r1 = r(); S.r2 = r(); S.r3 = r(); S.r4 = r(); tris.push(S); } }
  }
  return { cv, tris, box: [bx0, by0, bx1, by1] };
}
