// ================= CASE 03 · 做图毁于微操 (Q48 → Q56) =================
const CA3 = { x: 64, y: 112, w: 1496, h: 928 }, PST = { x: 512, y: 176, w: 600, h: 800 };
const CAT = [[372, 392], [384, 430], [392, 470], [384, 505], [366, 532], [392, 575], [420, 640], [440, 710], [436, 770], [470, 788], [520, 782], [548, 758], [546, 728], [530, 740], [512, 762], [470, 776], [410, 794], [300, 798], [190, 794], [164, 770], [160, 710], [180, 640], [208, 575], [234, 532], [216, 505], [208, 470], [216, 430], [228, 392], [262, 428], [300, 440], [338, 428]];
const SLASH = [[338, 428], [352, 470], [430, 452], [280, 560], [500, 610], [170, 650], [470, 720], [90, 770], [560, 610], [30, 520]];
let POSTER = null, APPUI = null, CATPATH = null;
function catSpline() { const n = CAT.length, pts = [], seg = []; let L = 0;
  for (let i = 0; i < n; i++) { const p0 = CAT[(i - 1 + n) % n], p1 = CAT[i], p2 = CAT[(i + 1) % n], p3 = CAT[(i + 2) % n];
    for (let k = 0; k < 16; k++) { const u = k / 16, u2 = u * u, u3 = u2 * u; const f = (a, b, c, d) => .5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
      const p = [f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]; if (pts.length) L += Math.hypot(p[0] - pts[pts.length - 1][0], p[1] - pts[pts.length - 1][1]); pts.push(p); seg.push(i); if (k === 0) CAT[i].s = L; } }
  pts.push(CAT[0].slice()); L += Math.hypot(CAT[0][0] - pts[pts.length - 2][0], CAT[0][1] - pts[pts.length - 2][1]); seg.push(n);
  return { pts, seg, L, gapI: (n - 1) * 16 }; }
function build3() {
  CATPATH = catSpline();
  POSTER = (() => { const c = mk(PST.w, PST.h), g = c.getContext('2d');
    g.fillStyle = linear(g, 0, 0, 0, 520, [[0, '#1b0b3a'], [.45, '#5a1a6e'], [.85, '#ff4f8b'], [1, '#ffb36b']]); g.fillRect(0, 0, 600, 520);
    const r = rng(3); for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,255,255,${.3 + r() * .6})`; g.fillRect(r() * 600, r() * 300, 2, 2); }
    g.save(); g.beginPath(); g.arc(300, 470, 170, 0, TAU); g.clip(); g.fillStyle = linear(g, 0, 300, 0, 640, [[0, '#fff36b'], [.5, '#ff9a5a'], [1, '#ff3a8c']]); g.fillRect(100, 280, 400, 380);
    g.fillStyle = '#ff4f8b'; for (let k = 0; k < 7; k++) { const y = 470 + k * 15, hh = 3 + k * 1.6; g.fillStyle = mixHex('#ff6f9b', '#ff3f86', k / 7); g.fillRect(100, y, 400, hh); } g.restore();
    g.fillStyle = '#2a0b4a'; poly(g, [[0, 520], [0, 470], [70, 430], [130, 470], [200, 410], [260, 500], [330, 520]]); g.fill(); poly(g, [[260, 520], [380, 440], [450, 480], [520, 420], [600, 470], [600, 520]]); g.fill();
    g.fillStyle = '#12052a'; g.fillRect(0, 520, 600, 280);
    g.strokeStyle = 'rgba(255,79,207,.85)'; g.lineWidth = 2; g.shadowColor = '#ff4fcf'; g.shadowBlur = 8;
    for (let k = 0; k < 9; k++) { const y = 520 + Math.pow(k / 8, 1.8) * 280; g.beginPath(); g.moveTo(0, y); g.lineTo(600, y); g.stroke(); }
    for (let k = -10; k <= 10; k++) { g.beginPath(); g.moveTo(300 + k * 18, 520); g.lineTo(300 + k * 120, 800); g.stroke(); }
    g.shadowBlur = 0;
    txt(g, '夏日 · 霓虹', 300, 128, 84, '#fff', 900, 'center'); g.save(); g.globalCompositeOperation = 'lighter'; g.shadowColor = '#ff4fcf'; g.shadowBlur = 30; txt(g, '夏日 · 霓虹', 300, 128, 84, 'rgba(255,79,207,.5)', 900, 'center'); g.restore();
    txt(g, 'SUMMER NEON FESTIVAL · 08.08', 300, 172, 22, '#ffd6f2', 700, 'center');
    g.fillStyle = '#06030e'; g.beginPath(); CATPATH.pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill();
    g.fillStyle = '#ffd34a'; for (const ex of [272, 328]) { g.beginPath(); g.ellipse(ex, 482, 9, 12, 0, 0, TAU); g.fill(); } g.fillStyle = '#06030e'; for (const ex of [272, 328]) g.fillRect(ex - 2, 472, 4, 20);
    return c; })();
  APPUI = (() => { const c = mk(W, H), g = c.getContext('2d');
    g.fillStyle = '#1b1d28'; g.fillRect(0, 0, W, 36); ['文件', '编辑', '图像', '图层', '文字', '选择', '滤镜', '视图', '窗口', '帮助'].forEach((m, i) => txt(g, m, 70 + i * 74, 25, 18, '#c9cede', 700));
    g.fillStyle = '#232634'; g.fillRect(0, 36, W, 40); for (let i = 0; i < 9; i++) fillRR(g, 80 + i * 56, 44, 40, 24, 5, 'rgba(255,255,255,.08)');
    g.fillStyle = '#181a24'; g.fillRect(0, 76, W, 36);
    g.fillStyle = '#232634'; g.fillRect(0, 112, 64, 928);
    for (let i = 0; i < 14; i++) { const y = 132 + i * 52, on = i === 3; fillRR(g, 12, y, 40, 40, 8, on ? '#3d6dff' : 'rgba(255,255,255,.06)'); g.strokeStyle = on ? '#fff' : 'rgba(220,226,240,.55)'; g.lineWidth = 2.5; g.beginPath();
      if (i === 3) { g.moveTo(24, y + 30); g.lineTo(32, y + 10); g.lineTo(40, y + 30); g.moveTo(32, y + 10); g.lineTo(32, y + 22); } else if (i % 3 === 0) g.rect(22, y + 10, 20, 20); else if (i % 3 === 1) g.arc(32, y + 20, 10, 0, TAU); else { g.moveTo(22, y + 30); g.lineTo(42, y + 10); } g.stroke(); }
    g.fillStyle = '#232634'; g.fillRect(1560, 112, 360, 928); g.fillStyle = '#1b1d28'; g.fillRect(1560, 112, 360, 40); txt(g, '图层', 1580, 140, 20, '#e6e9f5', 900);
    const LAY = ['文字 · 夏日霓虹', '猫咪（抠图中）', '网格', '背景 · 夕阳'];
    LAY.forEach((l, i) => { const y = 160 + i * 68; fillRR(g, 1570, y, 340, 60, 8, i === 1 ? 'rgba(61,109,255,.45)' : 'rgba(255,255,255,.04)'); fillRR(g, 1582, y + 8, 60, 44, 4, ['#5a1a6e', '#06030e', '#ff4fcf', '#ff9a5a'][i]); txt(g, l, 1656, y + 38, 19, '#dfe3f0', 700); });
    g.fillStyle = '#1b1d28'; g.fillRect(1560, 446, 360, 40); txt(g, '历史记录', 1580, 474, 20, '#e6e9f5', 900);
    g.fillStyle = '#14151d'; g.fillRect(0, 1040, W, 40);
    return c; })();
}
const HIST = ['打开文件', '复制图层'].concat(Array.from({ length: 35 }, (_, i) => '钢笔：添加锚点 #' + (i + 1)), ['画笔：误触描边']);
const UNDO_T = Array.from({ length: 37 }, (_, i) => Q(53) + .08 + (Q(55.3) - Q(53) - .08) * Math.sqrt(i / 36));
const undoN = t => UNDO_T.filter(x => t >= x).length;
const SLIP3 = Q(52);
function view3(t) {
  const G = [355, 410], S1 = [PST.x + G[0], PST.y + G[1]], T = [812, 560];
  let z = 1, k = 0; if (t < SLIP3) { k = E.ioC(inv(Q(49), Q(49) + .4, t)); z = lerp(1, 6, k); } else if (t < Q(53)) { k = 1 - E.outE(clamp((t - SLIP3 - .1) / .35)); z = lerp(1, 6, k); }
  const tx = lerp(S1[0], T[0], k), ty = lerp(S1[1], T[1], k); return { ox: tx - G[0] * z, oy: ty - G[1] * z, z };
}
function drawCatPath(g, V, frac, anchorsN, t, col = '#3ad6ff') {
  const P = CATPATH, mp = p => [V.ox + p[0] * V.z, V.oy + p[1] * V.z]; const nmax = Math.floor(frac * P.gapI);
  if (nmax > 1) { g.save(); g.strokeStyle = col; g.lineWidth = 2.4; g.shadowColor = col; g.shadowBlur = 6; g.beginPath(); for (let i = 0; i <= nmax; i++) { const q = mp(P.pts[i]); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); } g.stroke(); g.restore(); }
  g.save(); for (let i = 0; i < Math.min(anchorsN, CAT.length); i++) { if (i * 16 > nmax + .5) break; const q = mp(CAT[i]); const sz = 7; g.fillStyle = i === 0 ? col : '#ffffff'; g.strokeStyle = '#0a1a40'; g.lineWidth = 1.5; g.fillRect(q[0] - sz / 2, q[1] - sz / 2, sz, sz); g.strokeRect(q[0] - sz / 2, q[1] - sz / 2, sz, sz); } g.restore();
  return mp;
}
function penCursor(g, x, y, s = 1) {
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-.6); g.fillStyle = '#ffffff'; g.strokeStyle = '#0a0c18'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(0, 0); g.lineTo(-14, 30); g.lineTo(-10, 52); g.lineTo(10, 52); g.lineTo(14, 30); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 26); g.stroke(); g.beginPath(); g.arc(0, 30, 4, 0, TAU); g.fillStyle = '#0a0c18'; g.fill();
  fillRR(g, -13, 56, 26, 16, 3, '#ffffff', '#0a0c18', 3); g.restore();
}
function appFrame(g, t, V, progress, progCol) {
  g.drawImage(APPUI, 0, 0);
  const zl = Math.round(V.z * 100) + '%';
  fillRR(g, 70, 80, 420, 32, 6, '#2b2e3e'); txt(g, '海报_终版_改7.psd @ ' + zl + ' (猫咪, RGB/8)', 86, 103, 18, '#e6e9f5', 700); xIcon(g, 470, 96, 5, '#9aa0b8', 2);
  // history
  const k = undoN(t), act = HIST.length - 1 - k, slip = t >= SLIP3, rows = 9, top = clamp(act - 6, 0, HIST.length - rows);
  g.save(); g.beginPath(); g.rect(1560, 486, 360, 300); g.clip();
  for (let r = 0; r < rows; r++) { const i = top + r, y = 492 + r * 32; if (i >= HIST.length) break; if (!slip && i === HIST.length - 1) continue; const undone = i > act, on = i === act || (!slip && i === HIST.length - 2 && act === HIST.length - 1);
    if (on) fillRR(g, 1566, y, 348, 30, 5, 'rgba(61,109,255,.6)'); txt(g, HIST[i], 1584, y + 22, 18, undone ? 'rgba(200,205,225,.3)' : i === HIST.length - 1 ? '#ff6a84' : '#dfe3f0', 700); }
  g.restore();
  // status bar
  txt(g, zl, 80, 1067, 18, '#c9cede', 700);
  txt(g, '抠图进度', 190, 1067, 18, '#c9cede', 700); fillRR(g, 276, 1052, 260, 16, 8, 'rgba(255,255,255,.1)'); fillRR(g, 276, 1052, Math.max(16, 260 * progress), 16, 8, progCol); txt(g, Math.round(progress * 100) + '%', 548, 1067, 18, progCol, 900);
  txt(g, '已耗时 3 小时 12 分', 640, 1067, 18, '#c9cede', 700);
}
function canvas3(g, V) { g.save(); g.beginPath(); g.rect(CA3.x, CA3.y, CA3.w, CA3.h); g.clip(); g.fillStyle = '#2b2d3a'; g.fillRect(CA3.x, CA3.y, CA3.w, CA3.h);
  g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 30; g.fillStyle = '#000'; g.fillRect(V.ox, V.oy, PST.w * V.z, PST.h * V.z); g.restore();
  g.imageSmoothingEnabled = V.z < 2; g.drawImage(POSTER, V.ox, V.oy, PST.w * V.z, PST.h * V.z); g.imageSmoothingEnabled = true; }
function shot3A(g, t) {
  const V = view3(t); g.fillStyle = '#2b2d3a'; g.fillRect(0, 0, W, H); canvas3(g, V);
  const frac = lerp(.62, 1, E.ioS(inv(Q(48), Q(49), t))), an = Math.floor(frac * (CAT.length - 1)) + 1;
  const mp = drawCatPath(g, V, frac, an, t);
  // rubber band from the last anchor to the pen cursor
  const st = mp(CAT[0]), last = mp(CAT[CAT.length - 1]), ap = E.ioS(inv(Q(49.2), Q(51.95), t)), amp = 1.5 + 18 * E.inQ(inv(Q(50), Q(52), t));
  const cx = lerp(last[0] + 240, st[0] + 10, ap) + nz(t * 23, 3) * amp, cy = lerp(last[1] + 220, st[1] + 8, ap) + nz(t * 27, 6) * amp;
  if (t > Q(49)) { g.save(); g.strokeStyle = '#3ad6ff'; g.lineWidth = 2; g.setLineDash([10, 7]); g.lineDashOffset = -t * 40; g.beginPath(); g.moveTo(last[0], last[1]); g.lineTo(cx, cy); g.stroke(); g.restore();
    const ring = .5 + .5 * Math.sin(t * 9); g.save(); g.strokeStyle = `rgba(255,214,74,${.5 + .5 * ring})`; g.lineWidth = 3; g.beginPath(); g.arc(st[0], st[1], 18 + 6 * ring, 0, TAU); g.stroke(); g.restore(); }
  g.restore();
  appFrame(g, t, V, .99, '#3d6dff');
  if (t > Q(49.35)) { const k = popK(t, Q(49.35), .25); g.save(); g.translate(st[0] + 40, st[1] - 120); g.scale(k, k); fillRR(g, -10, -40, 210, 64, 32, '#ffd34a'); txt(g, '最后一笔', 95, 6, 34, '#2a1a00', 900, 'center'); g.fillStyle = '#ffd34a'; poly(g, [[0, 10], [26, 18], [-30, 100]]); g.fill(); g.restore(); }
  penCursor(g, cx, cy, t > Q(49) ? 1.3 : 1);
  notif(g, t, Q(50), 140, '客户', '好了吗？急用！');
  notif(g, t, Q(51), 272, '老板', '在吗？客户在催', '#e08a24');
  notif(g, t, Q(51.5), 404, '客户', '？？？');
}
function shot3B(g, t) {
  const V = view3(t); g.fillStyle = '#2b2d3a'; g.fillRect(0, 0, W, H); canvas3(g, V);
  const mp = drawCatPath(g, V, 1, CAT.length, t);
  const sk = clamp((t - SLIP3) / .1), n = SLASH.length, m = 1 + sk * (n - 1);
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round'; const pts = []; for (let i = 0; i < Math.ceil(m); i++) pts.push(mp(SLASH[i])); if (m % 1 > 0 && Math.ceil(m) < n) { const a = mp(SLASH[Math.floor(m)]), b = mp(SLASH[Math.ceil(m)]), f = m % 1; pts[pts.length - 1] = [lerp(a[0], b[0], f), lerp(a[1], b[1], f)]; }
  for (const [lw, col] of [[22 * V.z, 'rgba(20,0,10,.85)'], [13 * V.z, '#ff2d55']]) { g.strokeStyle = col; g.lineWidth = Math.min(lw, 160); g.shadowColor = '#ff2d55'; g.shadowBlur = col === '#ff2d55' ? 20 : 0; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); }
  g.restore(); g.restore();
  appFrame(g, t, V, .99, '#ff2d55');
  const cp = pts[pts.length - 1]; penCursor(g, cp[0], cp[1], 1.3);
  notif(g, t, Q(50), 140, '客户', '好了吗？急用！'); notif(g, t, Q(51), 272, '老板', '在吗？客户在催', '#e08a24'); notif(g, t, Q(51.5), 404, '客户', '？？？');
}
function keycap(g, x, y, w, h, label, press, col = '#20243f', size = 64) {
  const d = 26, p = press * 18; g.save();
  g.fillStyle = 'rgba(0,0,0,.6)'; g.filter = 'blur(12px)'; g.fillRect(x + 10, y + d + 18, w, h); g.filter = 'none';
  fillRR(g, x, y + d, w, h, 22, mixHex(col, '#000', .5));
  fillRR(g, x, y + p, w, h, 22, col, 'rgba(160,240,255,.7)', 3);
  g.fillStyle = 'rgba(255,255,255,.08)'; rr(g, x + 14, y + p + 10, w - 28, h * .45, 14); g.fill();
  g.shadowColor = CYN; g.shadowBlur = 14; txt(g, label, x + w / 2, y + p + h / 2 + size * .36, size, '#eafcff', 900, 'center'); g.restore();
}
function shot3C(g, t) {
  const V = view3(t), k = undoN(t); g.fillStyle = '#2b2d3a'; g.fillRect(0, 0, W, H); canvas3(g, V);
  if (k === 0) { const mp = drawCatPath(g, V, 1, CAT.length, t); g.save(); g.lineJoin = 'round'; g.strokeStyle = '#ff2d55'; g.lineWidth = 13; g.shadowColor = '#ff2d55'; g.shadowBlur = 20; g.beginPath(); SLASH.forEach((p, i) => { const q = mp(p); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.stroke(); g.restore(); }
  else { const an = Math.max(0, CAT.length - (k - 1)); if (an > 1) drawCatPath(g, V, (an - 1) / (CAT.length - 1), an, t); }
  g.restore();
  appFrame(g, t, V, .99 * (1 - k / 37), k > 30 ? '#ff2d55' : '#3d6dff');
  notif(g, t, Q(50), 140, '客户', '好了吗？急用！'); notif(g, t, Q(51), 272, '老板', '在吗？客户在催', '#e08a24'); notif(g, t, Q(51.5), 404, '客户', '？？？');
  // foreground Ctrl + Z
  g.save(); g.fillStyle = linear(g, 0, 600, 0, H, [[0, 'rgba(4,4,12,0)'], [1, 'rgba(4,4,12,.85)']]); g.fillRect(0, 600, W, 480); g.restore();
  const lp = UNDO_T.reduce((a, x) => t >= x ? x : a, -9), dt = t - lp, zp = dt < .035 ? 1 : Math.max(0, 1 - (dt - .035) / .05);
  const ki = E.outB(clamp((t - Q(53)) / .25)); g.save(); g.translate(0, (1 - ki) * 400);
  keycap(g, 230, 770, 300, 200, 'Ctrl', t > Q(53) + .05 ? 1 : 0, '#20243f', 62); txt(g, '+', 590, 905, 90, '#ffffff', 900, 'center'); keycap(g, 650, 770, 200, 200, 'Z', zp, k > 30 ? '#5a1020' : '#20243f', 96);
  g.restore();
  const ck = 1 + .3 * pulse(t, lp, 12); g.save(); g.translate(925, 870); g.scale(ck, ck); g.shadowColor = '#3ad6ff'; g.shadowBlur = 24; txt(g, '×' + k, 0, 40, 130, '#ffffff', 900, 'left'); g.restore();
  // toast
  if (t > Q(55.3)) { const tk = E.outB(clamp((t - Q(55.3)) / .25)), str = '已撤销到：打开文件'; const w = tw(g, str, 54) + 110; g.save(); g.translate(812, 440); g.scale(tk, tk); g.shadowColor = '#ffd34a'; g.shadowBlur = 30; fillRR(g, -w / 2, -52, w, 104, 52, 'rgba(10,10,20,.94)', '#ffd34a', 4); g.shadowBlur = 0; txt(g, str, 0, 19, 54, '#ffd34a', 900, 'center'); g.restore(); }
}
function bloomCase3(t) { return t >= Q(48) && t < Q(56) ? .3 : 0; }
SHAKES.push([Q(49), 4, .3], [Q(50), 16, .4], [Q(51), 6, .25], [Q(51.5), 8, .3], [SLIP3, 30, .55], [Q(55.3), 10, .35]); UNDO_T.slice(0, 12).forEach((x, i) => SHAKES.push([x, 6 - i * .4, .15]));
FLASHES.push([Q(50), .16, .15], [SLIP3, .35, .22]);
CHROMA.push([Q(48), 12, .4], [Q(50), 12, .4], [SLIP3, 18, .5], [Q(53), 8, .3], [Q(55.3), 8, .3], [Q(55.75), 14, .3]);
