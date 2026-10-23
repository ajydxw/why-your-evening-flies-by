// ================= CASE SECTION · Q32 → Q64 「崩盘现场」 =================
(() => {
const B_0 = Q(32), TRD = .58, B_END = Q(64);
const SNAP = mk(W, H), SNX = SNAP.getContext('2d');
const PINK = '#ff4fcf', RED = '#ff2d55', GOLD = '#ffc440', CYN = '#5ef2ff', BLU = '#46a5ff', WHT = '#f4f7ff';
const U_PEAK = .49, U_RED = .835, U_START = .784;
const CARD = { x: 1448, y: 806, w: 428, h: 236 };
const CASES = [
  { t0: Q(32), hit: Q(35), n: '01', name: '考场失忆', b0: 78, b1: 152 },
  { t0: Q(40), hit: Q(42), n: '02', name: '领导站你身后', b0: 84, b1: 158 },
  { t0: Q(48), hit: Q(50), n: '03', name: '做图毁于微操', b0: 82, b1: 164 },
  { t0: Q(56), hit: Q(58), n: '04', name: '重要汇报哑火', b0: 88, b1: 172 },
];
const caseIdx = t => t >= Q(56) ? 3 : t >= Q(48) ? 2 : t >= Q(40) ? 1 : 0;
// ---------- small helpers ----------
const chars = s => Array.from(s);
const typed = (s, k) => { const a = chars(s); return a.slice(0, Math.max(0, Math.floor(clamp(k) * a.length + 1e-6))).join(''); };
const typedN = (s, n) => chars(s).slice(0, Math.max(0, Math.floor(n))).join('');
function txt(g, s, x, y, size, col, wt = 900, al = 'left', a = 1) { if (a <= 0) return; g.save(); g.globalAlpha *= clamp(a); g.font = F(wt, size); g.textAlign = al; g.textBaseline = 'alphabetic'; g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
function tw(g, s, size, wt = 900) { g.save(); g.font = F(wt, size); const w = g.measureText(s).width; g.restore(); return w; }
function poly(g, pts) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); }
function fillRR(g, x, y, w, h, r, fill, stroke, lw = 2) { rr(g, x, y, w, h, Math.min(r, w / 2, h / 2)); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
const popK = (t, t0, d = .22) => t < t0 ? 0 : E.outB(clamp((t - t0) / d));
const fadeK = (t, t0, d = .15) => clamp((t - t0) / d);
const blinkOn = (t, t0, seed = 1) => { const u = t - t0; if (u < 0) return 0; if (u > .14) return 1; return hsh(Math.floor(t * 60) + seed) > .4 ? 1 : .2; };
// silhouette with rim light: shape(g) must build + fill its own sub-paths
function silo(g, shape, o = {}) {
  const rim = o.rim || RIM, dx = o.dx ?? -2.2, dy = o.dy ?? -1.6, blur = o.blur ?? 14;
  g.save(); g.globalAlpha *= (o.ra ?? .95); g.shadowColor = rim; g.shadowBlur = blur; g.fillStyle = rim; g.translate(dx, dy); shape(g); g.restore();
  g.save(); g.fillStyle = o.body || BODY; shape(g); g.restore();
}
// seated figure seen from behind. origin = hips, s = px per unit (shoulders ≈ 1.9u wide)
function backShape(s, down = 0, wide = 1, headDx = 0) {
  return g => {
    const hw = .95 * s * wide, sh = -1.75 * s;
    g.beginPath(); g.moveTo(-hw * .8, .35 * s);
    g.bezierCurveTo(-hw * .92, sh * .4, -hw * 1.1, sh * .8, -hw * .74, sh);
    g.quadraticCurveTo(-hw * .32, sh * 1.075, 0, sh * 1.07); g.quadraticCurveTo(hw * .32, sh * 1.075, hw * .74, sh);
    g.bezierCurveTo(hw * 1.1, sh * .8, hw * .92, sh * .4, hw * .8, .35 * s); g.closePath(); g.fill();
    const hy = sh - .62 * s + down * .46 * s;
    g.beginPath(); rr(g, -.19 * s + headDx * .5, hy, .38 * s, sh - hy + .1 * s, .1 * s); g.fill();
    g.beginPath(); g.ellipse(headDx, hy, .43 * s, .47 * s, 0, 0, TAU); g.fill();
  };
}
function backHeadY(s, down = 0) { return -1.75 * s - .62 * s + down * .46 * s; }
// pink scarf = protagonist identity
function scarfB(g, s, t, back = true) {
  const sh = -1.75 * s; g.save(); g.shadowColor = PINK; g.shadowBlur = 16; g.fillStyle = PINK;
  g.beginPath(); rr(g, -.42 * s, sh - .22 * s, .84 * s, .3 * s, .14 * s); g.fill();
  if (back) { const w = Math.sin(t * 5.3) * .06 * s; g.beginPath(); g.moveTo(.12 * s, sh); g.quadraticCurveTo(.3 * s + w, sh + .5 * s, .2 * s + w * 2, sh + 1.05 * s); g.lineTo(.42 * s + w * 2, sh + 1.0 * s); g.quadraticCurveTo(.46 * s + w, sh + .45 * s, .34 * s, sh - .02 * s); g.closePath(); g.fill(); }
  g.restore();
}
// standing figure facing camera, origin = feet center, s = px/unit (height ≈ 7u)
function standShape(s, o = {}) {
  const arm = o.arm || 0;
  return g => {
    g.beginPath(); g.ellipse(0, -6.45 * s, .5 * s, .56 * s, 0, 0, TAU); g.fill();
    g.beginPath(); rr(g, -.22 * s, -6.1 * s, .44 * s, .6 * s, .1 * s); g.fill();
    g.beginPath(); g.moveTo(-1.0 * s, -5.45 * s); g.quadraticCurveTo(0, -5.72 * s, 1.0 * s, -5.45 * s);
    g.quadraticCurveTo(1.15 * s, -4.4 * s, .78 * s, -3.2 * s); g.lineTo(-.78 * s, -3.2 * s); g.quadraticCurveTo(-1.15 * s, -4.4 * s, -1.0 * s, -5.45 * s); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-.76 * s, -3.3 * s); g.lineTo(-.62 * s, 0); g.lineTo(-.12 * s, 0); g.lineTo(0, -2.6 * s); g.lineTo(.12 * s, 0); g.lineTo(.62 * s, 0); g.lineTo(.76 * s, -3.3 * s); g.closePath(); g.fill();
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * .95 * s, -5.35 * s); g.quadraticCurveTo(sd * 1.32 * s, -4.4 * s, sd * (1.18 - (sd > 0 ? arm : 0)) * s, -3.3 * s + (sd > 0 ? -arm * 1.1 * s : 0)); g.lineTo(sd * (.92 - (sd > 0 ? arm : 0)) * s, -3.35 * s + (sd > 0 ? -arm * 1.1 * s : 0)); g.quadraticCurveTo(sd * 1.02 * s, -4.4 * s, sd * .7 * s, -5.2 * s); g.closePath(); g.fill(); }
  };
}
function redEyes(g, x, y, s, open = 1, a = 1, sep = .2) {
  if (open <= .02 || a <= 0) return; g.save();
  for (const sd of [-1, 1]) { const ex = x + sd * sep * s, w = .14 * s, h = .07 * s * open;
    glowDot(g, ex, y, s * .55, 'rgba(255,40,70,.9)', .55 * a);
    g.globalAlpha = a; g.fillStyle = '#ff2d55'; g.shadowColor = '#ff2d55'; g.shadowBlur = 12; g.beginPath(); g.ellipse(ex, y, w, Math.max(.5, h), 0, 0, TAU); g.fill();
    g.fillStyle = '#ffe0e6'; g.shadowBlur = 0; g.beginPath(); g.ellipse(ex, y, w * .35, Math.max(.3, h * .5), 0, 0, TAU); g.fill(); }
  g.restore();
}
// icons (drawn, no glyph dependence)
function warnIcon(g, x, y, r, col = RED) { g.save(); g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); rr(g, x - r * .12, y - r * .58, r * .24, r * .72, r * .1); g.fill(); g.beginPath(); g.arc(x, y + r * .42, r * .14, 0, TAU); g.fill(); g.restore(); }
function xIcon(g, x, y, r, col = '#fff', lw = 3) { g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r, y - r); g.lineTo(x + r, y + r); g.moveTo(x + r, y - r); g.lineTo(x - r, y + r); g.stroke(); g.restore(); }
function checkIcon(g, x, y, r, col = GOLD, lw = 6) { g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x - r, y); g.lineTo(x - r * .3, y + r * .7); g.lineTo(x + r, y - r * .7); g.stroke(); g.restore(); }
// error dialog
function popup(g, cx, cy, k, title, msg, sub, a = 1) {
  if (k <= 0) return; const w = 780, h = 290; g.save(); g.globalAlpha = a * clamp(k * 3); g.translate(cx, cy); g.scale(.82 + .18 * k, .82 + .18 * k); g.translate(-w / 2, -h / 2);
  g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40; g.shadowOffsetY = 14; fillRR(g, 0, 0, w, h, 14, '#eef0f6'); g.shadowColor = 'transparent';
  g.save(); rr(g, 0, 0, w, h, 14); g.clip(); g.fillStyle = '#e0243f'; g.fillRect(0, 0, w, 54); g.restore();
  txt(g, title, 26, 37, 26, '#fff', 700); xIcon(g, w - 34, 27, 9, '#fff', 3.5);
  warnIcon(g, 78, 134, 36);
  txt(g, msg, 136, 152, 50, '#15172a', 900); txt(g, sub, 136, 196, 23, '#4a4e66', 700);
  fillRR(g, w - 340, h - 70, 150, 50, 10, '#e0243f'); txt(g, '确定', w - 265, h - 36, 24, '#fff', 700, 'center');
  fillRR(g, w - 175, h - 70, 150, 50, 10, '#d4d7e2'); txt(g, '重试', w - 100, h - 36, 24, '#2a2d40', 700, 'center');
  g.restore();
}
// speech bubble (tail points to tx,ty)
function bubble(g, x, y, str, size, k, tx, ty, o = {}) {
  if (k <= 0) return; const pad = size * .6, w = tw(g, str, size, 900) + pad * 2, h = size * 1.75;
  g.save(); g.globalAlpha = clamp(k * 3); g.translate(x, y); g.scale(k, k);
  g.shadowColor = o.glow || 'rgba(0,0,0,.5)'; g.shadowBlur = 26; g.fillStyle = o.fill || '#f6f7ff';
  rr(g, -w / 2, -h / 2, w, h, h / 2); g.fill();
  const ax = clamp(tx - x, -w / 2 + h * .6, w / 2 - h * .6), dir = ty > y ? 1 : -1;
  g.beginPath(); g.moveTo(ax - size * .45, dir * h * .38); g.lineTo((tx - x) * .55 / k, (ty - y) * .55 / k); g.lineTo(ax + size * .45, dir * h * .38); g.closePath(); g.fill();
  g.shadowBlur = 0; txt(g, str, 0, size * .36, size, o.col || '#14162a', 900, 'center'); g.restore();
}
// chat notification card sliding from the right
function notif(g, t, t0, y, who, msg, col = RED) {
  if (t < t0) return; const u = t - t0, k = E.outB(clamp(u / .3)), w = 560, h = 112, x = W - 28 - w + (1 - k) * (w + 60);
  g.save(); g.globalAlpha = clamp(u / .08); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 30; g.shadowOffsetY = 10;
  fillRR(g, x, y, w, h, 18, 'rgba(250,251,255,.97)'); g.shadowColor = 'transparent';
  g.fillStyle = col; g.beginPath(); g.arc(x + 58, y + h / 2, 34, 0, TAU); g.fill(); txt(g, who.slice(0, 1), x + 58, y + h / 2 + 13, 34, '#fff', 900, 'center');
  txt(g, who, x + 110, y + 44, 24, '#5a5f78', 700); txt(g, msg, x + 110, y + 88, 34, '#121428', 900);
  const bd = Math.floor(u * 6) % 2 === 0 || u > 1 ? 1 : .4; g.globalAlpha = bd; g.fillStyle = RED; g.beginPath(); g.arc(x + w - 30, y + 28, 10, 0, TAU); g.fill();
  g.restore();
}
// rubber stamp
function stamp(g, t, t0, x, y, str, col, size = 64, rot = -.12, icon = null) {
  if (t < t0) return; const u = t - t0, k = clamp(u / .16), s = lerp(2.4, 1, E.outE(k)) * (1 + .06 * Math.exp(-u * 12) * Math.sin(u * 60));
  const w = tw(g, str, size) + size * 1.1 + (icon ? size * 1.1 : 0), h = size * 1.7;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = clamp(k * 1.5);
  g.shadowColor = col; g.shadowBlur = 18; g.strokeStyle = col; g.lineWidth = size * .1; rr(g, -w / 2, -h / 2, w, h, size * .22); g.stroke();
  g.lineWidth = size * .035; rr(g, -w / 2 + size * .16, -h / 2 + size * .16, w - size * .32, h - size * .32, size * .14); g.stroke();
  const ox = icon ? size * .55 : 0; txt(g, str, ox, size * .36, size, col, 900, 'center');
  if (icon) icon(g, -w / 2 + size * .95, 0, size * .38, col, size * .12);
  g.restore();
}
// horizontal slice glitch of the current canvas
function sliceGlitch(g, t, amt, seed = 1, colorize = true) {
  if (amt <= .01) return; TX.clearRect(0, 0, W, H); TX.drawImage(g.canvas, 0, 0); const fr = Math.floor(t * 30);
  let y = 0, i = 0; while (y < H) { const bh = 10 + Math.floor(hsh(fr * 17 + i * 3 + seed) * 90), r = hsh(fr * 5 + i * 11 + seed);
    if (r < .55) { const dx = (hsh(fr * 9 + i + seed * 3) - .5) * 260 * amt; g.drawImage(TMP, 0, y, W, bh, dx, y, W, bh);
      if (colorize && r < .18) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .35 * amt; g.fillStyle = r < .09 ? '#ff2d6a' : '#2de8ff'; g.fillRect(0, y, W, bh); g.restore(); } }
    y += bh; i++; }
}
// neural background (brain scenes)
const NEU = (() => { const r = rng(4242), n = []; for (let i = 0; i < 70; i++) n.push([r() * 2100 - 90, r() * 1200 - 60, r() * 4 + 2, r()]); const e = [];
  for (let i = 0; i < n.length; i++) for (let j = i + 1; j < n.length; j++) { const d = Math.hypot(n[i][0] - n[j][0], n[i][1] - n[j][1]); if (d < 260 && r() < .55) e.push([i, j, r()]); } return { n, e }; })();
function neuralBG(g, t, hot = 0, a = 1) {
  g.fillStyle = radial(g, W / 2, H * .45, 1250, [[0, mixHex('#1a1450', '#3a0a26', hot)], [.6, mixHex('#0b0a26', '#1c0614', hot)], [1, '#04030c']]); g.fillRect(0, 0, W, H);
  g.save(); g.globalAlpha = a; g.lineWidth = 1.4;
  for (const [i, j, s] of NEU.e) { const A = NEU.n[i], B = NEU.n[j]; g.strokeStyle = hot > .5 ? `rgba(255,70,110,${.10 + .08 * s})` : `rgba(120,140,255,${.10 + .08 * s})`; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke();
    const ph = (t * (.35 + s * .5) + s * 7) % 1; if (s > .6) glowDot(g, lerp(A[0], B[0], ph), lerp(A[1], B[1], ph), 10, hot > .5 ? '#ff4a70' : '#8fa0ff', .6); }
  for (const [x, y, r, s] of NEU.n) glowDot(g, x, y, r * 4, hot > .5 ? '#ff5a7a' : '#7d8cff', .35 + .25 * Math.sin(t * 2 + s * 9));
  g.restore();
}
// ---------- mini curve card + case tag (permanent overlays) ----------
function dotU(t) {
  if (t >= B_END) return anchorAt(t).u;
  const i = caseIdx(t), c = CASES[i], ts = i === 0 ? B_0 + TRD : c.t0 + .06, from = i === 0 ? U_START : U_RED;
  if (t >= c.hit) return lerp(U_PEAK, U_RED, E.outB(clamp((t - c.hit) / .42)));
  return lerp(from, U_PEAK, E.ioC(inv(ts, ts + .45, t)));
}
function bpmB(t) {
  if (t >= B_END) return anchorAt(t).b;
  const i = caseIdx(t), c = CASES[i], prev = i === 0 ? 166 : CASES[i - 1].b1, ts = i === 0 ? B_0 + TRD : c.t0 + .06;
  let b = t >= c.hit ? lerp(c.b0, c.b1, E.outC(clamp((t - c.hit) / .5))) : lerp(prev, c.b0, E.ioC(inv(ts, ts + .5, t)));
  if (i === 3) b += 22 * E.inC(inv(Q(59), Q(63), t));
  return b;
}
let PHASE = null; const PH_R = 240;
function buildPhase() { const n = Math.ceil((136 - B_0) * PH_R); PHASE = new Float32Array(n + 1); let p = 0; for (let i = 0; i <= n; i++) { PHASE[i] = p; p += bpmB(B_0 + i / PH_R) / 60 / PH_R; } }
const heartK = t => { if (!PHASE) return 0; const i = clamp(Math.round((t - B_0) * PH_R), 0, PHASE.length - 1), f = PHASE[i] % 1; return Math.exp(-f * 7); };
const zoneCol = u => u < .328 ? C_BLUE : u > .652 ? C_RED : C_GOLD;
const cardPt = u => [CARD.x + 26 + u * (CARD.w - 52), CARD.y + CARD.h - 54 + curY(lerp(AX0, AX1, u)) * .19];
function drawCard(g, t, a) {
  if (a <= 0) return; const { x, y, w, h } = CARD, u = dotU(t), zc = zoneCol(u), hot = u > .652, hk = heartK(t);
  g.save(); g.globalAlpha = a;
  fillRR(g, x, y, w, h, 16, hot ? 'rgba(46,4,18,.78)' : 'rgba(8,6,30,.78)', 'rgba(200,220,255,.22)', 1.5);
  g.save(); g.strokeStyle = rgbS(zc, .9); g.lineWidth = 3; g.shadowColor = rgbS(zc, 1); g.shadowBlur = 10;
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { g.beginPath(); g.moveTo(cx, cy + sy * 20); g.lineTo(cx, cy); g.lineTo(cx + sx * 20, cy); g.stroke(); }
  g.restore();
  // header: heart + bpm
  g.fillStyle = hot ? '#ff3a5c' : '#5ef2ff'; heartPath(g, x + 32, y + 32, 11 * (1 + .4 * hk)); g.fill();
  txt(g, String(Math.round(bpmB(t))), x + 52, y + 44, 30, hot ? '#ff5a74' : '#dff6ff', 900); txt(g, 'BPM', x + 52 + tw(g, String(Math.round(bpmB(t))), 30) + 6, y + 44, 15, 'rgba(225,238,255,.6)', 700);
  txt(g, '压力 → 表现', x + w - 22, y + 42, 19, 'rgba(225,238,255,.55)', 700, 'right');
  // curve segments
  const by = y + h - 54; g.fillStyle = 'rgba(225,238,255,.18)'; g.fillRect(x + 22, by, w - 44, 1.5);
  const segs = [[0, .328, C_BLUE], [.328, .652, C_GOLD], [.652, 1, C_RED]];
  for (const [u0, u1, col] of segs) { g.beginPath(); for (let i = 0; i <= 40; i++) { const p = cardPt(lerp(u0, u1, i / 40)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
    const pe = cardPt(u1), ps = cardPt(u0); g.save(); g.lineTo(pe[0], by); g.lineTo(ps[0], by); g.closePath(); g.fillStyle = rgbS(col, .16); g.fill(); g.restore();
    g.beginPath(); for (let i = 0; i <= 40; i++) { const p = cardPt(lerp(u0, u1, i / 40)); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
    g.strokeStyle = rgbS(col, 1); g.lineWidth = 4; g.lineCap = 'round'; g.shadowColor = rgbS(col, 1); g.shadowBlur = 8; g.stroke(); g.shadowBlur = 0; }
  txt(g, '懒散', cardPt(.15)[0], y + h - 20, 20, rgbS(C_BLUE, .95), 900, 'center');
  txt(g, '巅峰', cardPt(.49)[0], y + h - 20, 20, rgbS(C_GOLD, .95), 900, 'center');
  txt(g, '崩盘', cardPt(.84)[0], y + h - 20, 20, rgbS(C_RED, .95), 900, 'center');
  // dot
  const [dx, dy] = cardPt(clamp(u, 0, 1)); const i = caseIdx(t), hp = pulse(t, CASES[i].hit, 4);
  glowDot(g, dx, dy, 34 + 20 * hk * hot, rgbS(zc, 1), .8);
  g.strokeStyle = rgbS(zc, 1); g.lineWidth = 3; g.beginPath(); g.arc(dx, dy, 13 + 3 * hk, 0, TAU); g.stroke();
  if (hp > .01) { g.save(); g.globalAlpha = a * hp; g.lineWidth = 3; g.beginPath(); g.arc(dx, dy, 13 + (1 - hp) * 60, 0, TAU); g.stroke(); g.restore(); }
  g.fillStyle = '#fff'; g.beginPath(); g.arc(dx, dy, 8, 0, TAU); g.fill();
  // 你在这 pill
  const pw = 92, py = dy - 50; fillRR(g, dx - pw / 2, py - 17, pw, 34, 17, hot ? '#ff2d55' : '#f4f7ff'); g.fillStyle = hot ? '#ff2d55' : '#f4f7ff'; poly(g, [[dx - 7, py + 15], [dx + 7, py + 15], [dx, py + 25]]); g.fill();
  txt(g, '你在这', dx, py + 8, 20, hot ? '#fff' : '#14162a', 900, 'center');
  g.restore();
}
const GLY = '#%@&*$?!01';
function drawTag(g, c, u, out) {
  if (out >= 1) return; g.save(); g.translate(-out * 640, 0); g.globalAlpha = 1 - out * .6;
  const pk = E.outB(clamp(u / .25)), ps = '崩盘现场 · CASE ' + c.n, pw = tw(g, ps, 26) + 46;
  g.save(); g.translate(64, 60); g.scale(Math.max(.001, pk), 1); g.shadowColor = 'rgba(255,40,70,.8)'; g.shadowBlur = 18; fillRR(g, 0, 0, pw, 46, 23, '#e0243f'); g.restore();
  txt(g, ps, 87, 93, 26, '#fff', 900, 'left', clamp((pk - .5) * 3));
  const k = clamp((u - .1) / .34), n = chars(c.name).length, sh = typed(c.name, k), gl = k > 0 && k < 1 ? GLY[Math.floor(hsh(Math.floor(u * 40) + 3) * GLY.length)] : '';
  const tx = 64, ty = 190, base = tw(g, sh, 76);
  g.save(); g.shadowColor = 'rgba(0,0,0,.85)'; g.shadowBlur = 18;
  const jit = u < .55 ? 1 : (u % 1.7 > 1.62 ? 1 : 0);
  if (jit) { g.save(); g.globalCompositeOperation = 'lighter'; txt(g, sh, tx - 4, ty, 76, 'rgba(255,40,90,.8)', 900); txt(g, sh, tx + 4, ty, 76, 'rgba(40,230,255,.8)', 900); g.restore(); }
  txt(g, sh, tx, ty, 76, '#ffffff', 900); if (gl) txt(g, gl, tx + base + 4, ty, 76, '#ff2d55', 900);
  g.restore();
  const ul = E.outC(clamp((u - .3) / .3)) * tw(g, c.name, 76); g.fillStyle = '#ff2d55'; g.shadowColor = '#ff2d55'; g.shadowBlur = 12; g.fillRect(tx, ty + 18, ul, 7);
  g.restore();
}
function caseTag(g, t) {
  if (t > B_0 + TRD * .6) { g.save(); g.globalAlpha = clamp((t - B_0 - TRD * .6) / .2); g.fillStyle = radial(g, 160, 110, 560, [[0, 'rgba(4,3,14,.62)'], [.55, 'rgba(4,3,14,.35)'], [1, 'rgba(4,3,14,0)']]); g.fillRect(0, 0, 760, 420); g.restore(); }
  for (let i = 0; i < 4; i++) { const c = CASES[i], st = i === 0 ? B_0 + TRD * .7 : c.t0 + .04, nx = i < 3 ? CASES[i + 1].t0 : 1e9;
    if (t < st || t > nx + .3) continue; drawTag(g, c, t - st, E.inC(clamp((t - nx) / .24))); }
}
