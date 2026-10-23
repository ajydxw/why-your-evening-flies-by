// ================= SECTION D · Q96 → Q128 「大脑里发生了什么」 =================
// ---- shared helpers ----
function callout(g, t, t0, ax, ay, ex, ey, x1, col = '#9fd0ff') {
  if (t < t0) return; const k = E.ioC(clamp((t - t0) / .28)), k1 = clamp(k * 2), k2 = clamp(k * 2 - 1);
  g.save(); g.strokeStyle = col; g.lineWidth = 3; g.shadowColor = col; g.shadowBlur = 10; g.lineCap = 'round';
  g.beginPath(); g.moveTo(ax, ay); g.lineTo(lerp(ax, ex, k1), lerp(ay, ey, k1)); if (k2 > 0) g.lineTo(lerp(ex, x1, k2), ey); g.stroke();
  g.fillStyle = col; g.beginPath(); g.arc(ax, ay, 7, 0, TAU); g.fill(); g.restore();
}
function bigParts(g, t, t0, parts, x, y, size, o = {}) { // multi-colour punch-in line
  if (t < t0) return; const u = t - t0, k = clamp(u / .2), out = o.t1 != null ? E.inC(clamp((t - o.t1) / .25)) : 0; if (out >= 1) return;
  const s = lerp(1.6, 1, E.outE(k)) * (1 + .04 * Math.exp(-u * 10) * Math.sin(u * 50)), tot = parts.reduce((a, p) => a + tw(g, p[0], size), 0);
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= clamp(k * 2) * (1 - out); let cx = -tot / 2;
  for (const [str, col, gl] of parts) { if (u < .3) { const sp = 12 * (1 - u / .3); g.save(); g.globalCompositeOperation = 'lighter'; txt(g, str, cx - sp, 0, size, 'rgba(255,40,90,.7)', 900); txt(g, str, cx + sp, 0, size, 'rgba(40,230,255,.7)', 900); g.restore(); }
    g.save(); g.shadowColor = gl || 'rgba(0,0,0,.85)'; g.shadowBlur = 30; txt(g, str, cx, 0, size, col, 900); g.restore(); cx += tw(g, str, size); }
  g.restore();
}
function chipPill(g, x, y, str, size, k, fill, stroke, col, o = {}) { // centred pill, k = pop
  if (k <= 0) return; const w = tw(g, str, size) + size * 1.3, h = size * 1.75;
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(Math.max(.001, k), Math.max(.001, k)); g.globalAlpha *= clamp(k * 1.5) * (o.a ?? 1);
  if (o.glow) { g.shadowColor = o.glow; g.shadowBlur = 22; } fillRR(g, -w / 2, -h / 2, w, h, h / 2, fill, stroke, 3); g.shadowBlur = 0;
  txt(g, str, 0, size * .36, size, col, 900, 'center');
  if (o.strike) { const sk = clamp(o.strike); g.strokeStyle = '#ff2d55'; g.lineWidth = size * .16; g.lineCap = 'round'; g.beginPath(); g.moveTo(-w / 2 + 10, 0); g.lineTo(-w / 2 + 10 + (w - 20) * sk, 0); g.stroke(); }
  g.restore();
}
const DRAWS = t => Math.floor(t * 30);

// ---- D1 · brain ----
const BR = { x: 1080, y: 520 };
const BR_OUT = (() => { const p = []; for (let i = 0; i < 180; i++) { const th = i / 180 * TAU, sy = Math.sin(th), cx = Math.cos(th);
  const top = sy < 0, ry = top ? 285 : 215, lump = top || cx < -.3 ? 1 + .03 * Math.sin(th * 11 + .5) + .018 * Math.sin(th * 19 + 2) : 1 + .012 * Math.sin(th * 13);
  let x = 440 * cx * lump, y = ry * sy * lump; if (!top && cx < 0) y *= lerp(1, .82, -cx); p.push([x, y]); } return p; })();
const BR_CB = (() => { const p = []; for (let i = 0; i < 60; i++) { const th = i / 60 * TAU; p.push([300 + 150 * Math.cos(th) * (1 + .03 * Math.sin(th * 9)), 175 + 88 * Math.sin(th)]); } return p; })();
const BR_SQ = (() => { const r = rng(5150), a = []; for (let i = 0; i < 26; i++) { let x = (r() - .5) * 760, y = (r() - .62) * 440, ang = r() * TAU; const pts = [[x, y]];
  for (let j = 0; j < 7; j++) { ang += (r() - .5) * 2.4; x += Math.cos(ang) * 46; y += Math.sin(ang) * 40; pts.push([x, y]); } a.push(pts); } return a; })();
const PFC_N = [[-372, -98], [-300, -186], [-312, -28], [-212, -126], [-388, 40], [-236, -8]];
const PFC_E = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 5], [0, 4]];
const PFC_OFF = [Q(101), Q(101.5), Q(102), Q(102.5), Q(103), Q(103.5)];
const AMY = [-58, 112];
function smoothPath(g, pts, close) { g.beginPath(); g.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
  const n = pts.length; for (let i = 1; i < (close ? n + 1 : n - 1); i++) { const p = pts[i % n], q = pts[(i + 1) % n]; g.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); } if (close) g.closePath(); }
function drawBrain(g, t, hot, rev) {
  const stc = mixHex('#8cc4ff', '#ff4d6d', hot), dim = mixHex('#2a3c80', '#6a1030', hot);
  g.save(); g.translate(BR.x, BR.y);
  // reveal clip (scan line from top)
  const ry = lerp(-330, 480, rev); g.save(); g.beginPath(); g.rect(-700, -400, 1400, ry + 400); g.clip();
  // brainstem + cerebellum
  g.save(); g.beginPath(); g.moveTo(150, 170); g.bezierCurveTo(170, 260, 180, 340, 200, 420); g.lineTo(262, 420); g.bezierCurveTo(250, 330, 250, 250, 262, 170); g.closePath();
  g.fillStyle = mixHex('#0d1640', '#2a0818', hot); g.fill(); g.strokeStyle = stc; g.globalAlpha = .7; g.lineWidth = 3; g.stroke(); g.restore();
  smoothPath(g, BR_CB, true); g.fillStyle = mixHex('#101a4a', '#300a1c', hot); g.fill(); g.save(); g.clip(); g.strokeStyle = dim; g.lineWidth = 3; for (let k = 0; k < 7; k++) { g.beginPath(); g.ellipse(300, 175 + k * 22 - 70, 150, 30, 0, 0, Math.PI); g.stroke(); } g.restore();
  g.save(); g.strokeStyle = stc; g.lineWidth = 3.5; g.shadowColor = stc; g.shadowBlur = 12; smoothPath(g, BR_CB, true); g.stroke(); g.restore();
  // cerebrum
  smoothPath(g, BR_OUT, true); g.fillStyle = radial(g, -80, -60, 560, [[0, mixHex('#1c2a78', '#5a1030', hot)], [.7, mixHex('#0e1648', '#2a0818', hot)], [1, mixHex('#080c2c', '#160410', hot)]]); g.fill();
  g.save(); smoothPath(g, BR_OUT, true); g.clip();
  g.strokeStyle = dim; g.lineWidth = 4; g.lineCap = 'round'; for (const s of BR_SQ) { smoothPath(g, s, false); g.stroke(); }
  // central + lateral sulcus
  g.strokeStyle = mixHex('#4b6cd0', '#b02a50', hot); g.lineWidth = 6; g.beginPath(); g.moveTo(30, -290); g.bezierCurveTo(0, -200, 40, -110, -10, 10); g.stroke();
  g.beginPath(); g.moveTo(-250, 120); g.bezierCurveTo(-120, 40, 40, 30, 190, -40); g.stroke();
  // PFC glow region
  const on = PFC_OFF.filter(x => t < x).length / 6, flick = t > Q(100) && t < Q(101) ? (hsh(DRAWS(t)) > .3 ? 1 : .4) : 1;
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .55 * on * flick * clamp((t - Q(97)) / .3); g.fillStyle = radial(g, -300, -80, 260, [[0, 'rgba(90,200,255,.6)'], [1, 'rgba(90,200,255,0)']]); g.fillRect(-640, -400, 700, 700); g.restore();
  g.restore();
  g.save(); g.strokeStyle = stc; g.lineWidth = 4.5; g.shadowColor = stc; g.shadowBlur = 16; smoothPath(g, BR_OUT, true); g.stroke(); g.restore();
  // PFC circuit
  const lit = i => t >= Q(97) + i * .07 && t < PFC_OFF[i];
  g.save(); g.lineWidth = 3; for (const [a, b] of PFC_E) { const A = PFC_N[a], B = PFC_N[b], both = lit(a) && lit(b); g.strokeStyle = both ? `rgba(120,230,255,${.75 * flick})` : 'rgba(110,120,160,.25)'; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.stroke(); } g.restore();
  PFC_N.forEach(([x, y], i) => { const t0 = Q(97) + i * .07; if (t < t0) { g.fillStyle = 'rgba(110,120,160,.35)'; g.beginPath(); g.arc(x, y, 10, 0, TAU); g.fill(); return; }
    if (lit(i)) { const pk = E.outB(clamp((t - t0) / .2)); glowDot(g, x, y, 46 * pk, '#7fe8ff', .9 * flick); g.fillStyle = '#eaffff'; g.beginPath(); g.arc(x, y, 12 * pk, 0, TAU); g.fill(); }
    else { const u = t - PFC_OFF[i]; g.fillStyle = 'rgba(90,96,130,.6)'; g.beginPath(); g.arc(x, y, 11, 0, TAU); g.fill();
      if (u < .45) { const k = u / .45; glowDot(g, x, y, 70 * (1 - k), '#ffffff', 1 - k); const r = rng(i * 31 + 7); g.strokeStyle = `rgba(255,220,160,${1 - k})`; g.lineWidth = 3; for (let j = 0; j < 7; j++) { const a = r() * TAU, d0 = 14 + 50 * k, d1 = d0 + 18 * (1 - k); g.beginPath(); g.moveTo(x + Math.cos(a) * d0, y + Math.sin(a) * d0); g.lineTo(x + Math.cos(a) * d1, y + Math.sin(a) * d1); g.stroke(); } }
      g.strokeStyle = 'rgba(160,170,200,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 6, y - 6); g.lineTo(x + 6, y + 6); g.moveTo(x + 6, y - 6); g.lineTo(x - 6, y + 6); g.stroke(); } });
  // amygdala
  const al = t >= Q(98), fl = al ? .5 + .5 * Math.sin((t - Q(98)) * TAU * 2 / BEAT) : 0, [mx, my] = AMY;
  if (al) { for (let k = 0; k < 6; k++) { const t0 = Q(98) + k * BEAT * .5; for (let rep = 0; rep < 12; rep++) { const tt = t0 + rep * BEAT * 3; const u = (t - tt) / .9; if (u < 0 || u > 1) continue; g.save(); g.strokeStyle = `rgba(255,45,85,${.7 * (1 - u)})`; g.lineWidth = 6 * (1 - u) + 1; g.beginPath(); g.arc(mx, my, 30 + 420 * E.outC(u), 0, TAU); g.stroke(); g.restore(); } } }
  glowDot(g, mx, my, al ? 120 + 50 * fl : 50, al ? '#ff2d55' : '#8fa8ff', al ? .7 + .3 * fl : .5);
  g.save(); g.translate(mx, my); g.rotate(-.5); g.beginPath(); g.ellipse(0, 0, 34, 21, 0, 0, TAU); g.fillStyle = al ? mixHex('#ff2d55', '#ffd0d8', fl) : '#7d8fd8'; g.shadowColor = al ? '#ff2d55' : '#7d8fd8'; g.shadowBlur = 24; g.fill(); g.restore();
  g.restore(); // clip
  // scan line
  if (rev < 1) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linear(g, 0, ry - 30, 0, ry + 4, [[0, 'rgba(120,220,255,0)'], [1, 'rgba(160,235,255,.9)']]); g.fillRect(-620, ry - 30, 1240, 34); g.restore(); }
  g.restore();
}
function shotBrain(g, t) {
  const hot = sstep(Q(98.5), Q(103.6), t), u = t - D_0, z = lerp(1.1, 1, E.outC(clamp(u / 1.4))) * lerp(1, 1.06, sstep(Q(100), Q(104), t)) * (1 + .012 * beatPulse(t, 7));
  neuralBG(g, t, hot, .55 + .45 * hot);
  if (t > Q(98)) { const fl = .5 + .5 * Math.sin((t - Q(98)) * TAU * 2 / BEAT); vignette(g, .35 + .25 * fl, '255,20,60'); }
  g.save(); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
  drawBrain(g, t, hot, E.ioS(clamp(u / .85)));
  // amygdala → PFC hijack pulses
  if (t > Q(99)) { const P0 = [BR.x + AMY[0], BR.y + AMY[1]], P2 = [BR.x - 300, BR.y - 90], P1 = [BR.x - 140, BR.y + 160];
    for (let k = 0; k < 10; k++) { const ph = ((t - Q(99)) * 1.3 + k / 10) % 1, a = clamp((t - Q(99)) / .3) * (t < Q(103.6) ? 1 : 1 - clamp((t - Q(103.6)) / .3)); const q = 1 - ph;
      const x = q * q * P0[0] + 2 * q * ph * P1[0] + ph * ph * P2[0], y = q * q * P0[1] + 2 * q * ph * P1[1] + ph * ph * P2[1]; glowDot(g, x, y, 22, '#ff3a64', a * .9); } }
  g.restore();
  const ws = (x, y) => [960 + (x - 960) * z, 540 + (y - 540) * z];
  // PFC callout (top-left)
  const pa = ws(BR.x + PFC_N[0][0], BR.y + PFC_N[0][1]);
  callout(g, t, Q(97.1), pa[0], pa[1], 600, 330, 70, '#8fe3ff');
  bigLine(g, t, Q(97.25), '前额叶', 70, 250, 84, '#bff3ff', { al: 'left', glow: 'rgba(60,200,255,.8)' });
  txt(g, '负责 思考 / 记忆 / 精细动作', 74, 308, 36, 'rgba(225,240,255,.88)', 700, 'left', fadeK(t, Q(97.45), .2));
  ['思考', '记忆', '精细动作'].forEach((s, i) => { const off = PFC_OFF[i * 2 + 1], dead = t >= off; const x = [134, 290, 488][i];
    chipPill(g, x, 400, s, 34, popK(t, Q(97.6) + i * .12), dead ? 'rgba(40,40,60,.9)' : 'rgba(20,70,110,.92)', dead ? 'rgba(150,150,170,.5)' : '#7fe8ff', dead ? 'rgba(170,170,190,.7)' : '#e8fbff', { strike: dead ? (t - off) / .18 : 0, glow: dead ? null : 'rgba(80,220,255,.6)' }); });
  // amygdala callout (bottom-left)
  const aa = ws(BR.x + AMY[0], BR.y + AMY[1]);
  callout(g, t, Q(98.15), aa[0], aa[1], 760, 900, 300, '#ff5a78');
  bigLine(g, t, Q(98.3), '杏仁核', 300, 880, 84, '#ff5a78', { al: 'left', glow: 'rgba(255,40,80,.9)' });
  if (t > Q(98.5)) { const bl = Math.floor((t - Q(98.5)) / (BEAT / 2)) % 2 ? 1 : .55; txt(g, '拉响警报！', 304, 960, 44, '#ffd6de', 900, 'left', fadeK(t, Q(98.5), .12) * bl); warnIcon(g, 600, 945, 22, RED); }
  if (t >= Q(103.5)) stamp(g, t, Q(103.5), 330, 520, '前额叶 · 掉线', '#ff2d55', 54, -.1);
}

// ---- D2 · stress hormones + working memory ----
const SLOT = { x0: 226, y: 430, w: 340, h: 200, gap: 36 };
const slotX = i => SLOT.x0 + i * (SLOT.w + SLOT.gap);
const WORRY = [['万一失败？', Q(106), 1], ['别人怎么看？', Q(107), 2], ['来不及了！', Q(108), 3], ['我是不是不行？', Q(109), 0]];
const MOLS = (() => { const r = rng(777), a = []; for (let i = 0; i < 26; i++) a.push([r() * 1920, r(), r(), r() < .5 ? '皮质醇' : '肾上腺素']); return a; })();
function floodLevel(t) { return lerp(1120, 760, E.outC(inv(Q(104), Q(105.6), t))) - 70 * sstep(Q(108.6), Q(110), t); }
function drawFlood(g, t, lv) {
  if (lv >= H + 20) return;
  const wave = x => lv + 14 * Math.sin(x / 120 + t * 3.1) + 8 * Math.sin(x / 47 - t * 4.3);
  g.save(); g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 20) g.lineTo(x, wave(x)); g.lineTo(W, H); g.closePath();
  g.fillStyle = linear(g, 0, lv - 20, 0, H, [[0, 'rgba(255,40,80,.5)'], [.4, 'rgba(160,10,50,.55)'], [1, 'rgba(60,0,20,.75)']]); g.fill(); g.clip();
  for (const [x0, a, b, nm] of MOLS) { const x = x0 + Math.sin(t * .8 + a * 9) * 40, y = lv + 60 + b * (H - lv) + Math.sin(t * 1.3 + a * 5) * 20, r = 16 + a * 12;
    g.save(); g.translate(x, y); g.rotate(t * (a - .5)); g.strokeStyle = 'rgba(255,160,180,.55)'; g.lineWidth = 3; g.beginPath(); for (let k = 0; k < 6; k++) { const an = k / 6 * TAU; k ? g.lineTo(Math.cos(an) * r, Math.sin(an) * r) : g.moveTo(r, 0); } g.closePath(); g.stroke(); g.restore(); }
  for (let i = 0; i < 30; i++) { const ph = (t * (.3 + hsh(i) * .4) + hsh(i * 3)) % 1, x = hsh(i * 7) * W, y = lerp(H, lv, ph); glowDot(g, x, y, 8, '#ff8fa8', .5 * (1 - ph)); }
  g.restore();
  g.save(); g.strokeStyle = '#ff6a8a'; g.lineWidth = 4; g.shadowColor = '#ff2d55'; g.shadowBlur = 16; g.beginPath(); for (let x = 0; x <= W; x += 20) x ? g.lineTo(x, wave(x)) : g.moveTo(x, wave(x)); g.stroke(); g.restore();
}
function taskCard(g, x, y, w, h, a = 1, gl = 0) {
  g.save(); g.globalAlpha *= a; g.shadowColor = 'rgba(255,200,90,.8)'; g.shadowBlur = 28; fillRR(g, x, y, w, h, 18, '#f4f7ff'); g.shadowBlur = 0;
  txt(g, '题目', x + w / 2 + (gl ? (hsh(DRAWS(gl)) - .5) * 14 : 0), y + 92, 64, '#1a2050', 900, 'center');
  g.fillStyle = 'rgba(30,40,90,.22)'; for (let k = 0; k < 3; k++) g.fillRect(x + 40, y + 122 + k * 22, w - 80 - k * 50, 9); g.restore();
}
function worryCard(g, t, str, x, y, w, h, t0) {
  const jit = 2 + 4 * sstep(Q(109), Q(110), t), jx = nz(t * 20, x) * jit, jy = nz(t * 23, y) * jit, hit = Math.exp(-(t - t0) * 6);
  g.save(); g.translate(jx, jy); g.shadowColor = '#ff2d55'; g.shadowBlur = 24 + 30 * hit; fillRR(g, x, y, w, h, 18, 'rgba(56,4,20,.96)', '#ff2d55', 4); g.shadowBlur = 0;
  const fs = Math.min(50, (w - 40) / Array.from(str).length); g.save(); g.globalCompositeOperation = 'lighter'; txt(g, str, x + w / 2 - 4, y + h / 2 + fs * .36, fs, 'rgba(255,40,90,.6)', 900, 'center'); txt(g, str, x + w / 2 + 4, y + h / 2 + fs * .36, fs, 'rgba(40,230,255,.5)', 900, 'center'); g.restore();
  txt(g, str, x + w / 2, y + h / 2 + fs * .36, fs, '#ffe2e8', 900, 'center'); warnIcon(g, x + 34, y + 32, 14, RED); g.restore();
}
function shotMemory(g, t) {
  const u = t - Q(104); neuralBG(g, t, 1, .9);
  g.save(); const z = lerp(1.06, 1, E.outC(clamp(u / 1.2))); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
  drawFlood(g, t, floodLevel(t));
  // hormone tags
  [['皮质醇 ↑', Q(104.3), 210], ['肾上腺素 ↑', Q(104.8), 470]].forEach(([s, t0, x]) => chipPill(g, x, 120, s, 38, popK(t, t0), 'rgba(90,6,30,.92)', '#ff2d55', '#ffd6de', { glow: 'rgba(255,40,80,.8)', rot: -.03 }));
  txt(g, '压力激素 · 涌入', 700, 134, 30, 'rgba(255,200,210,.8)', 700, 'left', fadeK(t, Q(105), .2));
  // header
  const full = t >= Q(109), hk = fadeK(t, Q(105), .2), cnt = (t >= Q(105.5) ? 1 : 0) + WORRY.filter(w => t >= w[1]).length - (full ? 1 : 0);
  g.save(); g.globalAlpha *= hk; txt(g, '工作记忆', 226, 400, 40, full ? '#ff5a78' : '#cfe0ff', 900);
  const cs = `${Math.min(cnt, 4)} / 4`, bl = full ? (Math.floor((t - Q(109)) * 6) % 2 ? 1 : .5) : 1; txt(g, full ? '已满！ ' + cs : cs, 1694, 400, 36, full ? '#ff2d55' : 'rgba(207,224,255,.8)', 900, 'right', bl); g.restore();
  // slots
  for (let i = 0; i < 4; i++) { const k = popK(t, Q(105) + i * .06), x = slotX(i); if (k <= 0) continue;
    g.save(); g.translate(x + SLOT.w / 2, SLOT.y + SLOT.h / 2); g.scale(k, k); g.setLineDash([14, 10]); g.strokeStyle = full ? 'rgba(255,60,90,.8)' : 'rgba(190,210,255,.45)'; g.lineWidth = 3; rr(g, -SLOT.w / 2, -SLOT.h / 2, SLOT.w, SLOT.h, 20); g.stroke(); g.setLineDash([]);
    txt(g, String(i + 1), -SLOT.w / 2 + 16, -SLOT.h / 2 + 34, 24, 'rgba(190,210,255,.5)', 900); g.restore(); }
  // task card
  if (t >= Q(105.5)) { const k = E.outB(clamp((t - Q(105.5)) / .25)); let x = slotX(0) + 10, y = SLOT.y + 10 - (1 - k) * 400, rot = 0, a = clamp(k * 3);
    if (t > Q(109)) { const v = t - Q(109); x += 600 * v + 120 * v * v; y += -260 * v + 900 * v * v; rot = v * 4.2; y = Math.min(y, floodLevel(t) + 90 + 30 * v); a = 1 - clamp((v - 1.2) / 1); }
    g.save(); g.translate(x + 160, y + 90); g.rotate(rot); taskCard(g, -160, -90, 320, 180, a, t > Q(109) ? t : 0); g.restore(); }
  // worries
  for (const [s, t0, i] of WORRY) { if (t < t0) continue; const k = E.outB(clamp((t - t0) / .2)); let x = slotX(i) + 10, y = SLOT.y + 10;
    if (i === 0) x -= (1 - E.outC(clamp((t - t0 + .12) / .22))) * 900; else y -= (1 - k) * 520;
    worryCard(g, t, s, x, y, 320, 180, t0); if (t - t0 < .25) { glowDot(g, x + 160, y + 90, 260, '#ff2d55', .6 * (1 - (t - t0) / .25)); } }
  g.restore();
  bigParts(g, t, Q(110), [['工作记忆被', '#ffffff'], ['“担心”', '#ff3a5c', 'rgba(255,30,70,.9)'], ['占满了', '#ffffff']], 960, 260, 96);
}

// ---- D3 · split: simple vs fine tasks ----
const PNL = [{ x: 40, y: 40, w: 900, h: 1000 }, { x: 980, y: 40, w: 900, h: 1000 }];
const CUR = [{ pk: .7, wd: .25, col: '#5ef2ff', c3: [94, 242, 255] }, { pk: .27, wd: .15, col: '#ff4fcf', c3: [255, 79, 207] }];
const MB = { x: 200, y: 430, w: 1520, h: 480 };
function curveIn(g, B, c, prog, a = 1, o = {}) { // performance curve in box B
  const base = B.y + B.h, top = B.y + 30, cy = v => base - (base - top) * Math.exp(-(((v - c.pk) / c.wd) ** 2)), pt = v => [lerp(B.x, B.x + B.w, v), cy(v)];
  if (a <= 0 || prog <= 0) return pt; g.save(); g.globalAlpha *= a;
  g.beginPath(); for (let i = 0; i <= 80; i++) { const p = pt(prog * i / 80); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } const pe = pt(prog);
  g.save(); g.lineTo(pe[0], base); g.lineTo(B.x, base); g.closePath(); g.fillStyle = linear(g, 0, top, 0, base, [[0, rgbS(c.c3, .28)], [1, rgbS(c.c3, .02)]]); g.fill(); g.restore();
  g.beginPath(); for (let i = 0; i <= 80; i++) { const p = pt(prog * i / 80); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
  g.strokeStyle = c.col; g.lineWidth = o.lw || 7; g.lineCap = 'round'; g.shadowColor = c.col; g.shadowBlur = 16; g.stroke(); g.restore(); return pt;
}
function axes(g, B, a, sz = 26) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.strokeStyle = 'rgba(220,232,255,.55)'; g.lineWidth = 3; g.lineCap = 'round';
  g.beginPath(); g.moveTo(B.x - 20, B.y - 10); g.lineTo(B.x - 20, B.y + B.h + 10); g.lineTo(B.x + B.w + 30, B.y + B.h + 10); g.stroke();
  g.fillStyle = 'rgba(220,232,255,.55)'; poly(g, [[B.x + B.w + 44, B.y + B.h + 10], [B.x + B.w + 26, B.y + B.h], [B.x + B.w + 26, B.y + B.h + 20]]); g.fill(); poly(g, [[B.x - 20, B.y - 24], [B.x - 30, B.y - 6], [B.x - 10, B.y - 6]]); g.fill();
  txt(g, '压力 →', B.x + B.w + 30, B.y + B.h + 10 + sz * 1.5, sz, 'rgba(220,232,255,.75)', 700, 'right'); txt(g, '表现', B.x, B.y - 10, sz, 'rgba(220,232,255,.75)', 700, 'left'); g.restore(); }
function limbP(g, x, y, a, l) { return [x + Math.sin(a) * l, y + Math.cos(a) * l]; }
function stickFig(g, x, y, s, P) { // P: tor, a1,a2 (arm), b1,b2 (other arm), l1,l2, m1,m2 (legs) — angles from straight down
  const L = 78 * s, sh = [x + Math.sin(P.tor) * L, y - Math.cos(P.tor) * L], hd = [sh[0] + Math.sin(P.tor) * 34 * s, sh[1] - Math.cos(P.tor) * 34 * s];
  const seg = (o, a1, a2, l) => { const m = limbP(g, o[0], o[1], a1, l), e = limbP(g, m[0], m[1], a2, l); g.beginPath(); g.moveTo(o[0], o[1]); g.lineTo(m[0], m[1]); g.lineTo(e[0], e[1]); g.stroke(); return e; };
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = BODY; g.fillStyle = BODY; g.shadowColor = RIM; g.shadowBlur = 14; g.lineWidth = 22 * s;
  seg([x, y], P.m1, P.m2, 46 * s); seg(sh, P.b1, P.b2, 36 * s);
  g.beginPath(); g.moveTo(x, y); g.lineTo(sh[0], sh[1]); g.lineWidth = 30 * s; g.stroke(); g.lineWidth = 22 * s;
  seg([x, y], P.l1, P.l2, 46 * s); const hand = seg(sh, P.a1, P.a2, 36 * s);
  g.beginPath(); g.arc(hd[0], hd[1], 25 * s, 0, TAU); g.fill(); g.restore(); return { sh, hand };
}
function illoSimple(g, t, B, a) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; const ox = B.x, oy = B.y;
  // sprinter
  const ph = t * TAU * 1.9, sx = ox + 250, sy = oy + 400 + Math.abs(Math.sin(ph)) * -10;
  g.save(); g.strokeStyle = 'rgba(94,242,255,.35)'; g.lineWidth = 4; for (let k = 0; k < 5; k++) { const yy = oy + 300 + k * 34, l = 80 + hsh(k) * 90, xx = ox + 40 + ((t * 600 + k * 70) % 120); g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + l, yy); g.stroke(); } g.restore();
  g.fillStyle = 'rgba(94,242,255,.25)'; g.fillRect(ox + 60, oy + 500, 380, 4);
  stickFig(g, sx, sy, 1, { tor: .42, a1: -1.0 * Math.sin(ph) + .2, a2: -1.0 * Math.sin(ph) + 1.6, b1: 1.0 * Math.sin(ph) + .2, b2: 1.0 * Math.sin(ph) + 1.6, l1: .8 * Math.sin(ph) + .1, l2: .8 * Math.sin(ph) - .6 - .5 * Math.max(0, Math.cos(ph)), m1: -.8 * Math.sin(ph) + .1, m2: -.8 * Math.sin(ph) - .6 - .5 * Math.max(0, -Math.cos(ph)) });
  // box lifter
  const lk = .5 - .5 * Math.cos(t * TAU * .9), lx = ox + 650, ly = oy + 410;
  const P = stickFig(g, lx, ly, 1, { tor: 0, a1: lerp(2.3, 2.95, lk), a2: lerp(3.6, 3.05, lk), b1: lerp(-2.3, -2.95, lk), b2: lerp(-3.6, -3.05, lk), l1: .18, l2: .02, m1: -.18, m2: -.02 });
  const bx = lx, by = P.hand[1] - 62; g.save(); g.shadowColor = 'rgba(255,196,64,.7)'; g.shadowBlur = 18; fillRR(g, bx - 62, by - 10, 124, 74, 8, '#c98b3a', '#ffd38a', 3); g.restore(); g.strokeStyle = 'rgba(80,40,0,.5)'; g.lineWidth = 6; g.beginPath(); g.moveTo(bx - 62, by + 22); g.lineTo(bx + 62, by + 22); g.stroke();
  [[ox + 790, oy + 450], [ox + 790, oy + 390]].forEach(([x, y]) => { fillRR(g, x - 45, y - 28, 90, 60, 6, '#9a6a2c', '#e0b070', 2); });
  g.fillStyle = 'rgba(94,242,255,.25)'; g.fillRect(ox + 520, oy + 500, 330, 4);
  chipPill(g, ox + 250, oy + 560, '冲刺跑', 28, popK(t, Q(113)), 'rgba(10,50,70,.9)', '#5ef2ff', '#e8fbff');
  chipPill(g, ox + 650, oy + 560, '搬箱子', 28, popK(t, Q(113.25)), 'rgba(10,50,70,.9)', '#5ef2ff', '#e8fbff');
  g.restore();
}
function illoFine(g, t, B, a, shake) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; const ox = B.x, oy = B.y;
  // needle (vertical) with eye
  const nx = ox + 290, ny0 = oy + 210, ny1 = oy + 500;
  g.save(); g.shadowColor = 'rgba(200,230,255,.8)'; g.shadowBlur = 12; g.fillStyle = linear(g, nx - 10, 0, nx + 10, 0, [[0, '#8a94b0'], [.5, '#f4f8ff'], [1, '#7a84a0']]);
  g.beginPath(); g.moveTo(nx - 11, ny0 + 20); g.quadraticCurveTo(nx - 11, ny0, nx, ny0); g.quadraticCurveTo(nx + 11, ny0, nx + 11, ny0 + 20); g.lineTo(nx + 6, ny1 - 40); g.lineTo(nx, ny1); g.lineTo(nx - 6, ny1 - 40); g.closePath(); g.fill(); g.restore();
  g.fillStyle = '#120a20'; g.beginPath(); g.ellipse(nx, ny0 + 30, 4, 16, 0, 0, TAU); g.fill();
  // thread tip jitter grows with stress
  const jit = 3 + shake * 46, tx = nx - 34 + nz(t * 9, 3) * jit, ty = ny0 + 30 + nz(t * 11, 8) * jit;
  g.save(); g.strokeStyle = '#ff4fcf'; g.lineWidth = 5; g.lineCap = 'round'; g.shadowColor = '#ff4fcf'; g.shadowBlur = 10; g.beginPath(); g.moveTo(ox + 40, oy + 470); g.bezierCurveTo(ox + 120, oy + 380, tx - 120, ty + 60, tx, ty); g.stroke(); g.restore();
  // fingers holding the thread
  g.save(); g.translate(tx - 70, ty + 26); g.rotate(-.5); fillRR(g, -40, -18, 80, 36, 18, '#e8b8a0'); fillRR(g, -30, 8, 70, 30, 15, '#d8a890'); g.restore();
  if (t >= Q(119)) { const k = popK(t, Q(119), .18); g.save(); g.translate(nx + 60, ny0 + 20); g.scale(k, k); xIcon(g, 0, 0, 34, '#ff2d55', 9); g.restore(); }
  // puzzle board
  const px = ox + 560, py = oy + 250; g.save(); g.shadowColor = 'rgba(255,79,207,.6)'; g.shadowBlur = 18; fillRR(g, px, py, 280, 200, 14, '#141a2e', '#ff8fe0', 3); g.restore();
  txt(g, 'x² − 5x + 6 = 0', px + 140, py + 70, 30, '#f4f7ff', 700, 'center'); const qs = shake > .5 ? '???' : 'x = ?'; txt(g, qs, px + 140, py + 140, 44, shake > .5 ? '#ff5a78' : '#ffd36a', 900, 'center');
  if (shake > .5) for (let k = 0; k < 3; k++) txt(g, '?', px + 30 + k * 110 + nz(t * 5, k) * 8, py - 10 + nz(t * 6, k + 4) * 8, 40, 'rgba(255,90,120,.8)', 900, 'center');
  chipPill(g, ox + 290, oy + 560, '穿针', 28, popK(t, Q(117)), 'rgba(60,10,50,.9)', '#ff4fcf', '#ffe8f8');
  chipPill(g, ox + 700, oy + 560, '解难题', 28, popK(t, Q(117.25)), 'rgba(60,10,50,.9)', '#ff4fcf', '#ffe8f8');
  g.restore();
}
function dotOn(g, pt, u, col, r = 20) { const [x, y] = pt(u); glowDot(g, x, y, r * 2.6, col, .9); g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, r * .55, 0, TAU); g.fill(); g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke(); return [x, y]; }
function shotSplit(g, t) {
  const mg = E.ioC(inv(Q(120), Q(120.9), t));
  g.fillStyle = radial(g, 960, 520, 1300, [[0, '#141634'], [.6, '#0a0b22'], [1, '#04040c']]); g.fillRect(0, 0, W, H);
  for (let s = 0; s < 2; s++) { const P = PNL[s], t0 = s ? Q(116) : Q(112), k = E.outC(clamp((t - t0) / .45)); if (k <= 0) continue; const c = CUR[s];
    const dx = (1 - k) * (s ? 1 : -1) * 1000;
    g.save(); g.translate(dx, 0); g.globalAlpha *= 1 - mg;
    g.save(); g.shadowColor = rgbS(c.c3, .4); g.shadowBlur = 30; fillRR(g, P.x, P.y, P.w, P.h, 26, s ? 'rgba(40,10,40,.85)' : 'rgba(8,30,48,.85)', rgbS(c.c3, .5), 2); g.restore();
    txt(g, s ? '精细任务' : '简单任务', P.x + 56, P.y + 96, 60, c.col, 900); txt(g, s ? '需要 稳 · 准 · 想' : '需要 力气 · 速度', P.x + 56 + tw(g, s ? '精细任务' : '简单任务', 60) + 26, P.y + 92, 28, 'rgba(225,235,255,.65)', 700);
    if (s === 0) illoSimple(g, t, { x: P.x, y: P.y - 40 }, 1); else illoFine(g, t, { x: P.x, y: P.y - 40 }, 1, sstep(Q(118.7), Q(119), t));
    g.restore(); }
  // curves (panel → merged box)
  const pts = [];
  for (let s = 0; s < 2; s++) { const P = PNL[s], c = CUR[s], t0 = s ? Q(118) : Q(114); if (t < t0) { pts.push(null); continue; }
    const pb = { x: P.x + 90, y: P.y + 690, w: P.w - 180, h: 250 }, B = lerpBox(pb, MB, mg), slide = s ? 1 : -1, k0 = E.outC(clamp((t - (s ? Q(116) : Q(112))) / .45));
    B.x += (1 - k0) * slide * 1000;
    axes(g, B, (1 - mg) * clamp((t - t0) / .3), 24);
    const prog = E.ioS(clamp((t - t0) / .7)), pt = curveIn(g, B, c, prog, s ? 1 : 1 - .55 * sstep(Q(124), Q(124.6), t), { lw: lerp(6, 9, mg) }); pts.push(pt);
    if (mg < 1 && prog >= 1) { const [px, py] = pt(c.pk); g.save(); g.globalAlpha *= (1 - mg) * fadeK(t, t0 + .7, .2); g.setLineDash([8, 8]); g.strokeStyle = rgbS(c.c3, .6); g.lineWidth = 2; g.beginPath(); g.moveTo(px, py); g.lineTo(px, B.y + B.h); g.stroke(); g.setLineDash([]);
      txt(g, '最佳', px, py - 22, 24, c.col, 900, 'center'); g.restore(); }
    // dots sweeping right
    if (mg < 1) { const ds = s ? Q(118.6) : Q(114.6), du = s ? lerp(.06, .58, E.ioS(inv(ds, Q(119.1), t))) : lerp(.06, c.pk, E.ioS(inv(ds, Q(115.2), t)));
      if (t > ds) { g.save(); g.globalAlpha *= 1 - mg; dotOn(g, pt, du, s && du > .4 ? '#ff2d55' : '#ffd36a', 16); g.restore(); } }
  }
  // captions
  if (mg < 1) { g.save(); g.globalAlpha *= 1 - mg;
    bigLine(g, t, Q(115), '多点压力，更好', PNL[0].x + PNL[0].w / 2, 662, 62, '#ffd36a', { glow: 'rgba(255,196,64,.8)' });
    bigLine(g, t, Q(119), '一点压力，就崩', PNL[1].x + PNL[1].w / 2, 662, 62, '#ff5a78', { glow: 'rgba(255,40,80,.9)' });
    if (t >= Q(119)) stamp(g, t, Q(119.1), PNL[1].x + PNL[1].w - 130, 870, '崩', '#ff2d55', 64, .12);
    g.restore(); }
  // merged view
  if (mg > 0) mergedView(g, t, mg, pts);
}
const FINE_CH = [['考试', .1, Q(122)], ['面试', .19, Q(122.5)], ['汇报', .36, Q(123)], ['罚球', .45, Q(123.5)]];
function mergedView(g, t, mg, pts) {
  axes(g, MB, mg, 30);
  if (!pts[0] || !pts[1]) return; const ka = fadeK(t, Q(120.9), .3), ptS = pts[0], ptF = pts[1];
  // labels at peaks
  const [sx, sy] = ptS(CUR[0].pk), [fx, fy] = ptF(CUR[1].pk), dim = sstep(Q(124), Q(124.6), t);
  chipPill(g, sx, sy - 52, '简单任务', 34, popK(t, Q(121)), 'rgba(8,40,56,.92)', '#5ef2ff', '#e8fbff', { a: 1 - .6 * dim });
  chipPill(g, fx + 40, fy - 52, '精细任务', 34, popK(t, Q(121.25)), 'rgba(56,8,46,.92)', '#ff4fcf', '#ffe8f8');
  // fine-task chips landing on the curve
  for (const [s, u, t0] of FINE_CH) { if (t < t0) continue; const k = E.outB(clamp((t - t0) / .25)), [x, y] = ptF(u); chipPill(g, x, y - 44 - (1 - k) * 300, s, 30, clamp(k * 1.2), 'rgba(40,10,40,.92)', '#ff8fe0', '#ffe8f8', { a: 1 - .5 * sstep(Q(125.5), Q(126), t) }); glowDot(g, x, y, 22, '#ff4fcf', .8 * clamp(k)); }
  // pin 「你的任务」
  if (t >= Q(124)) { const k = E.outB(clamp((t - Q(124)) / .3)), py = fy - 30 - (1 - k) * 500, sw = pulse(t, Q(124) + .2, 4);
    if (sw > 0) { g.save(); g.strokeStyle = `rgba(255,211,106,${sw})`; g.lineWidth = 5; g.beginPath(); g.ellipse(fx, fy, 40 + (1 - sw) * 200, 12 + (1 - sw) * 50, 0, 0, TAU); g.stroke(); g.restore(); }
    g.save(); g.translate(fx, py); g.shadowColor = 'rgba(255,196,64,.9)'; g.shadowBlur = 30; g.fillStyle = '#ffc440'; g.beginPath(); g.arc(0, -70, 42, Math.PI * .8, Math.PI * .2); g.lineTo(0, 0); g.closePath(); g.fill(); g.shadowBlur = 0; g.fillStyle = '#3a2400'; g.beginPath(); g.arc(0, -72, 16, 0, TAU); g.fill(); g.restore();
    chipPill(g, fx, py - 150, '你的任务', 40, popK(t, Q(124.15)), '#ffc440', '#fff2c0', '#2a1800', { glow: 'rgba(255,196,64,.9)' }); }
  // pressure marker slides left; dot follows
  if (t >= Q(125.9)) { const k = E.ioC(inv(Q(126), Q(127.4), t)), u = lerp(.82, CUR[1].pk, k), col = u > .45 ? '#ff2d55' : '#ffd36a';
    const ax = lerp(MB.x, MB.x + MB.w, u), ay = MB.y + MB.h + 10; g.save(); g.globalAlpha *= fadeK(t, Q(125.9), .2);
    g.strokeStyle = col; g.lineWidth = 6; g.lineCap = 'round'; g.shadowColor = col; g.shadowBlur = 14; g.beginPath(); g.moveTo(ax + 110, ay + 46); g.lineTo(ax + 20, ay + 46); g.stroke(); poly(g, [[ax, ay + 46], [ax + 26, ay + 32], [ax + 26, ay + 60]]); g.fillStyle = col; g.fill(); g.shadowBlur = 0;
    txt(g, '松一点', ax + 130, ay + 58, 34, col, 900, 'left'); g.restore(); dotOn(g, ptF, u, col, 18); }
  bigLine(g, t, Q(125), '越精细，越要松', 960, 170, 110, '#ffffff', { glow2: 'rgba(255,79,207,.7)' });
}

// ---- dispatch ----
function sceneDsec(g, t) { if (t < Q(104)) shotBrain(g, t); else if (t < Q(112)) shotMemory(g, t); else shotSplit(g, t); }
const CUTS_D = [Q(104), Q(112)];
function bloomDEF(t) { if (t < Q(104)) return .48; if (t < Q(112)) return .42; if (t < E_0) return .4; if (t < F_0) return .4 + .08 * inv(E_0, F_0, t); return .5; }
SHAKES.push([D_0, 10, .3], [Q(98), 16, .5], [Q(101), 6, .25], [Q(101.5), 6, .25], [Q(102), 7, .25], [Q(102.5), 7, .25], [Q(103), 8, .25], [Q(103.5), 14, .4], [Q(104), 10, .3],
  [Q(106), 14, .35], [Q(107), 14, .35], [Q(108), 16, .35], [Q(109), 26, .5], [Q(110), 10, .3], [Q(112), 8, .3], [Q(116), 8, .3], [Q(119), 16, .4], [Q(124), 14, .35], [Q(125), 8, .3]);
FLASHES.push([Q(98), .22, .18], [Q(103.5), .2, .15], [Q(109), .25, .18], [Q(119), .18, .15], [Q(124), .2, .2]);
CHROMA.push([D_0, 10, .3], [Q(98), 14, .4], [Q(103.5), 12, .35], [Q(104), 10, .3], [Q(106), 10, .3], [Q(107), 10, .3], [Q(108), 10, .3], [Q(109), 18, .45], [Q(110), 10, .3], [Q(112), 8, .3], [Q(119), 12, .35]);
