// ================= S5: triple failure, quadrant, ribbon folds (k128–160) =================
const SHD = (() => { const r = rng(55), a = []; for (let i = 0; i < 150; i++) { const an = r() * TAU; a.push({ an, sp: 300 + r() * 1300, rot: r() * TAU, vr: (r() - .5) * 14, w: 30 + r() * 120, h: 14 + r() * 40, y0: (r() - .5) * 420, col: r() < .8 ? CREAM : '#ffd59a' }); } return a; })();
function drawS5a(g, t) { // k128–130 smash
  bgDeep(g, t, '#2a0f18', '#060308', .1); const u = t - Q(128);
  g.save(); SHD.forEach(s => { const d = s.sp * (1 - Math.exp(-u * 3.2)), x = 960 + Math.cos(s.an) * d, y = 540 + s.y0 * .3 + Math.sin(s.an) * d * .8 + 120 * u * u, a = 1 - inv(1.2, 1.9, u); if (a <= 0) return;
    g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(s.rot + s.vr * (1 - Math.exp(-u * 2))); g.fillStyle = s.col; g.fillRect(-s.w / 2, -s.h / 2, s.w, s.h); g.strokeStyle = '#4a3a28'; g.lineWidth = 2; for (let xx = -s.w / 2 + 8; xx < s.w / 2; xx += 12) { g.beginPath(); g.moveTo(xx, -s.h / 2); g.lineTo(xx, -s.h / 2 + s.h * .35); g.stroke(); } g.restore(); });
  g.restore();
  if (u < .5) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(255,220,180,${1 - u * 2})`; g.lineWidth = 30 * (1 - u * 2); g.beginPath(); g.arc(960, 540, 100 + u * 1800, 0, TAU); g.stroke(); g.restore(); }
  slamT(g, '三把尺子，', 960, 450, 150, Q(128) + .1, t);
  slamT(g, '同时失灵。', 960, 660, 200, Q(129), t, { color: RED });
}
function gauge(g, x, y, r, v, title, read, a, hot) {
  if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y);
  g.fillStyle = 'rgba(10,8,22,.7)'; g.beginPath(); g.arc(0, 0, r + 30, Math.PI, TAU); g.lineTo(r + 30, 40); g.lineTo(-r - 30, 40); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,214,160,.35)'; g.lineWidth = 2; g.stroke();
  const gr = g.createLinearGradient(-r, 0, r, 0); gr.addColorStop(0, '#ff5a5a'); gr.addColorStop(.5, '#ffb23f'); gr.addColorStop(1, '#7ee0a8'); g.strokeStyle = gr; g.lineWidth = 22; g.beginPath(); g.arc(0, 0, r - 14, Math.PI, TAU); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 3; for (let i = 0; i <= 10; i++) { const an = Math.PI + i / 10 * Math.PI, L = i % 5 ? 14 : 28; g.beginPath(); g.moveTo(Math.cos(an) * (r - 34), Math.sin(an) * (r - 34)); g.lineTo(Math.cos(an) * (r - 34 - L), Math.sin(an) * (r - 34 - L)); g.stroke(); }
  kText(g, '没过多久', -r + 10, 34, 26, { align: 'center', color: '#ffb0a8', weight: 700, shadow: null }); kText(g, '很久', r - 10, 34, 26, { align: 'center', color: '#a8f0c8', weight: 700, shadow: null });
  const an = Math.PI + clamp(v, -.03, 1.03) * Math.PI; g.save(); g.rotate(an); g.shadowColor = hot ? RED : 'rgba(0,0,0,.5)'; g.shadowBlur = hot ? 24 : 10; g.fillStyle = hot ? '#ff6b6b' : '#fff'; g.beginPath(); g.moveTo(0, -8); g.lineTo(r - 40, 0); g.lineTo(0, 8); g.closePath(); g.fill(); g.restore();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 14, 0, TAU); g.fill();
  kText(g, title, 0, -r - 60, 54, { align: 'center', color: '#fff' });
  if (read) kText(g, read, 0, 120, 48, { align: 'center', color: hot ? RED : '#ffd9a0', alpha: hot ? 1 : 0 });
  g.restore();
}
function drawS5b(g, t) { // k130–134 gauges drop to ~0
  bgDeep(g, t, '#1d1230', '#05040b', .2);
  rise(g, '三把尺子的读数：', 960, 160, 56, Q(130) + .02, t, { color: '#ffd9a0', weight: 700 });
  [['① 注意力', '数到：≈ 0'], ['② 距离', '移动：10 厘米'], ['③ 回忆', '记忆点：0 个']].forEach(([ti, rd], i) => { const ta = Q(130) + i * .12, a = E.outB(inv(ta, ta + .3, t)), td = Q(131 + i * .5);
    const v = t < td - .2 ? .82 + .05 * Math.sin(t * 7 + i * 2) : lerp(.82, .03, E.outB(inv(td - .2, td + .1, t))) + (t > td ? .03 * Math.sin((t - td) * 30) * Math.exp(-(t - td) * 6) : 0);
    g.save(); g.translate(400 + i * 560, 560); g.scale(a, a); gauge(g, 0, 0, 220, v, ti, rd, clamp(a), t > td); g.restore(); });
  subT(g, '三把尺子一起报告：没过多久', Q(132.5), Q(134) - .03, t);
}
const QP = [['旅行', '当时一晃 · 回味很长', 560, 330, 135, '#4cc9f0'], ['上班盯着钟', '当时难熬 · 回头空白', 1360, 770, 137, '#b9a7e8'], ['刷手机的夜晚', '当时一晃 · 回头也空白', 520, 800, 139, '#ff5a5a']];
function drawS5c(g, t) { // k134–144 experience vs recall quadrant
  bgDeep(g, t, '#17122c', '#05040b', .25);
  rise(g, '"当时的感觉"和"回头的感觉"，是两回事', 960, 105, 50, Q(134) + .02, t, { color: '#ffd9a0', weight: 700 });
  const cx = 960, cy = 560, ax = E.outE(inv(Q(134), Q(134) + .6, t));
  const ev = inv(Q(140), Q(140) + .3, t); if (ev > 0) { g.save(); g.fillStyle = `rgba(255,70,70,${.13 * ev + .04 * ev * Math.sin(t * 8)})`; g.fillRect(cx - 660, cy, 660, 380); g.restore(); }
  g.save(); g.strokeStyle = 'rgba(220,225,255,.8)'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx - 680 * ax, cy); g.lineTo(cx + 680 * ax, cy); g.moveTo(cx, cy - 380 * ax); g.lineTo(cx, cy + 380 * ax); g.stroke(); g.restore();
  const la = inv(Q(134) + .3, Q(134) + .7, t);
  kText(g, '← 当时觉得快', cx - 670, cy - 22, 36, { color: '#cfd8ee', weight: 700, alpha: la }); kText(g, '当时觉得慢 →', cx + 670, cy - 22, 36, { align: 'right', color: '#cfd8ee', weight: 700, alpha: la });
  kText(g, '↑ 回头觉得长', cx + 20, cy - 350, 36, { color: '#cfd8ee', weight: 700, alpha: la }); kText(g, '↓ 回头觉得短', cx + 20, cy + 370, 36, { color: '#cfd8ee', weight: 700, alpha: la });
  QP.forEach(([lb, cap, x, y, k, col], i) => { const t0 = Q(k), p = inv(t0 - .1, t0 + .15, t); if (p <= 0) return; const s = E.outB(p);
    if (t > t0) { const u = t - t0; g.save(); g.strokeStyle = hexA(col, Math.max(0, .7 - u)); g.lineWidth = 4; g.beginPath(); g.arc(x, y, 40 + u * 220, 0, TAU); g.stroke(); g.restore(); }
    const pul = i == 2 && t > Q(140) ? 1 + .12 * Math.sin(t * 9) : 1; bead(g, x, y, 34 * s * pul, col, 1, i == 2 ? 1 : .6);
    g.save(); g.translate(x, y); g.scale(s, s); kText(g, lb, 0, -62, 54, { align: 'center', color: '#fff' }); kText(g, cap, 0, 90, 34, { align: 'center', color: i == 2 ? '#ffb0a8' : '#ffd9a0', weight: 700, alpha: inv(t0 + .1, t0 + .35, t) }); g.restore(); });
  stampT(g, '双重蒸发', 800, 645, Q(140), t, { size: 70, rot: -.1 });
  subT(g, '当时觉得快，回头又觉得短——时间被"蒸发"了两次', Q(141.5), Q(144) - .03, t);
}
const FB = [146, 148, 150, 152, 153, 154, 155, 156, 157], RDO = ['4 小时', '2 小时', '1 小时', '30 分钟', '15 分钟', '8 分钟', '4 分钟', '2 分钟', '1 分钟', '30 秒'], FTAG = ['① 注意力：没在数', '② 距离：没挪窝', '③ 回忆：没记住'];
function ribbonSeg(g, xa, xb, y, h, n, back) { if (xb - xa < .5) return; g.save(); const gr = g.createLinearGradient(xa, 0, xb, 0); gr.addColorStop(0, back ? '#b07a2c' : '#ffb23f'); gr.addColorStop(1, back ? '#5a3fb8' : '#8a6bff'); g.fillStyle = gr; g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 20; g.shadowOffsetY = 8; rr(g, xa, y - h / 2, xb - xa, h, Math.min(10, (xb - xa) / 2)); g.fill(); g.shadowColor = 'transparent';
  g.strokeStyle = 'rgba(30,15,40,.35)'; g.lineWidth = 2; const step = Math.max(6, 37.5 / Math.pow(2, n)); for (let x = xa + step; x < xb - 1; x += step) { g.beginPath(); g.moveTo(x, y - h / 2); g.lineTo(x, y - h / 2 + h * .22); g.stroke(); }
  g.strokeStyle = 'rgba(255,255,255,.35)'; for (let i = 1; i <= Math.min(n, 9); i++) { const yy = y + h / 2 - i * (h / (n + 1)) * .6; g.beginPath(); g.moveTo(xa + 4, yy); g.lineTo(xb - 4, yy); g.stroke(); } g.restore(); }
function drawS5d(g, t) { // k144–160 the 4 hours get folded away
  bgDeep(g, t, '#1a1230', '#05040b', .15);
  let n = 0; FB.forEach(k => { if (t >= Q(k)) n++; }); const nk = FB[n], u = nk ? E.ioC(inv(Q(nk) - .3, Q(nk), t)) : 0;
  const L0 = 1500, Ln = L0 / Math.pow(2, n), h = 90 * (1 + n * .1), y = 520, collapse = E.inE(inv(Q(158.5), Q(159.6), t)), sc = 1 - collapse;
  rise(g, '这是你真实的 4 小时', 960, 250, 64, Q(144) + .02, t, { t1: Q(146) - .3 });
  g.save(); g.translate(960, y); g.scale(sc, sc); g.translate(-960, -y);
  if (n == 0 && u == 0) { const k = E.outE(inv(Q(144), Q(144) + .5, t)); ribbonSeg(g, 960 - L0 / 2, 960 - L0 / 2 + L0 * k, y, h, 0); ['21:00', '22:00', '23:00', '00:00', '01:00'].forEach((s, i) => kText(g, s, 960 - L0 / 2 + i * L0 / 4, y - 70, 34, { align: 'center', color: '#ffd9a0', weight: 700, alpha: inv(Q(144) + .2 + i * .08, Q(144) + .4 + i * .08, t) })); }
  else { const x0 = lerp(960 - Ln / 2, 960 - Ln / 4, u), px = x0 + Ln / 2, c = Math.cos(Math.PI * u);
    ribbonSeg(g, x0, px, y, h, n);
    if (u > 0) { g.save(); g.translate(px, y); g.scale(c, 1 + .08 * Math.sin(Math.PI * u)); g.translate(-px, -y); ribbonSeg(g, px, px + Ln / 2, y, h, n, c < 0); g.restore(); }
    else ribbonSeg(g, px, px + Ln / 2, y, h, n); }
  if (collapse > 0) glowDot(g, 960, y, 300 * collapse + 40, `rgba(255,200,120,${collapse})`);
  g.restore();
  const tg = n >= 1 && n <= 3 ? FTAG[n - 1] : null; if (tg) { const tf = Q(FB[n - 1]); const a = inv(tf, tf + .15, t) * (1 - inv(Q(FB[n]) - .25, Q(FB[n]) - .05, t)); tagT(g, `被折一半 ← ${tg}`, 960, 330, tf, Q(FB[n]) - .05, t, { align: 'center', size: 40, col: '#ffb0a8' }); }
  const tf = n ? Q(FB[n - 1]) : Q(144), bump = 1 + .28 * Math.exp(-(t - tf) * 10), ra = inv(Q(144) + .3, Q(144) + .6, t) * (1 - collapse);
  if (ra > 0) { g.save(); g.translate(960, 760); g.scale(bump, bump); kText(g, RDO[n], 0, 50, 150, { align: 'center', alpha: ra, color: n >= 3 ? RED : n ? AMB : '#fff' }); g.restore(); }
  rise(g, '最后——', 960, 300, 90, Q(158), t, { color: '#fff' });
}
function drawS5(g, t, fx) {
  if (t < Q(130)) { drawS5a(g, t); fx.fl = .9 * Math.exp(-(t - Q(128)) * 6) + (t > Q(129) ? .35 * Math.exp(-(t - Q(129)) * 9) : 0); fx.ca = 18 * Math.exp(-(t - Q(128)) * 5) + (t > Q(129) ? 12 * Math.exp(-(t - Q(129)) * 7) : 0); fx.bl = .6; }
  else if (t < Q(134)) { drawS5b(g, t); fx.fl = .2 * Math.exp(-(t - Q(130)) * 10); [131, 131.5, 132].forEach(k => { if (t > Q(k)) fx.ca += 6 * Math.exp(-(t - Q(k)) * 9); }); }
  else if (t < Q(144)) { drawS5c(g, t); fx.fl = .25 * Math.exp(-(t - Q(134)) * 10) + (t > Q(140) ? .3 * Math.exp(-(t - Q(140)) * 9) : 0); fx.ca = t > Q(140) ? 12 * Math.exp(-(t - Q(140)) * 7) : 0; }
  else if (t < Q(160)) { drawS5d(g, t); fx.fl = .25 * Math.exp(-(t - Q(144)) * 10); FB.forEach(k => { if (t > Q(k)) fx.fl += .12 * Math.exp(-(t - Q(k)) * 12); }); fx.bl = .5; fx.ca = 10 * inv(Q(158.5), Q(160), t); }
  else if (typeof drawS6 === 'function') return drawS6(g, t, fx);
  return fx;
}
