// ================= SECTION E · Q128 → Q160 「破局方案」 =================
const ELEV = [[E_0, 0], [Q(134), 1], [Q(142), 2], [Q(149), 3], [Q(157), 4]];
function eLev(t) { let v = 0; for (const [t0, l] of ELEV) { if (t < t0) break; v = lerp(v, l, E.ioC(clamp((t - t0) / .8))); } return v; }
const EC_C = ['#2a0a1e', '#1a2f6a', '#21509a', '#3474c4', '#4f98e6'], EC_E = ['#0a0410', '#08122e', '#0c2552', '#143a78', '#1e5aa8'];
const palAt = (arr, v) => { const i = Math.min(3, Math.floor(clamp(v, 0, 4))), f = clamp(v, 0, 4) - i; return mixHex(arr[i], arr[i + 1], f); };
function eBG(g, t, cx = 960, cy = 460) {
  const v = eLev(t); g.fillStyle = radial(g, cx, cy, 1400, [[0, palAt(EC_C, v)], [1, palAt(EC_E, v)]]); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 46; i++) { const ph = (t * (.02 + hsh(i) * .03) + hsh(i * 5)) % 1, x = hsh(i * 9) * W + Math.sin(t * .5 + i) * 30, y = H + 40 - ph * (H + 80);
    glowDot(g, x, y, 10 + hsh(i * 3) * 14, v < 1 ? '#ff7a9a' : '#cfe8ff', (.08 + .07 * v) * Math.sin(ph * Math.PI)); }
  return v;
}
const ETAG = (g, t, t0, t1, n, name) => tagX(g, t - t0 - .02, E.inC(clamp((t - t1) / .2)), '破局方案 · ' + n, name, '#2f7dff', 'rgba(60,150,255,.85)', '#7cc4ff');
function eyeSlash(g, x, y, r, col = '#fff') { g.save(); g.strokeStyle = col; g.lineWidth = r * .16; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - r, y); g.quadraticCurveTo(x, y - r * .9, x + r, y); g.quadraticCurveTo(x, y + r * .9, x - r, y); g.stroke();
  g.fillStyle = col; g.beginPath(); g.arc(x, y, r * .3, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x - r * .9, y + r * .8); g.lineTo(x + r * .9, y - r * .8); g.stroke(); g.restore(); }

// ---- E1 · 遮住记分牌 ----
const SCRN = [{ x: 420, y: 370, r: .07, n: '分数' }, { x: 960, y: 340, r: 0, n: '观众' }, { x: 1500, y: 370, r: -.07, n: '后果' }];
const SCRW = 400, SCRH = 230, COVER_T = [Q(132), Q(132.5), Q(133)], SCR_IN = [E_0 + .05, Q(128.25), Q(128.5)], SCR_HIT = [Q(129), Q(130), Q(131)];
function scrContent(g, i, t) {
  if (i === 0) { const sc = ['59', '61', '48', '72', '55', '63'][Math.floor(t * 7) % 6]; txt(g, sc, -30, 62, 150, '#ff4060', 900, 'center'); txt(g, '分', 90, 58, 44, '#ff8fa0', 900); txt(g, '/ 150', 90, 0, 26, 'rgba(255,150,170,.7)', 700); }
  else if (i === 1) { for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const x = -141 + c * 94 + r * 20, y = -36 + r * 86, bl = hsh(Math.floor(t * 3) + r * 4 + c) > .85 ? .15 : 1; g.fillStyle = r ? '#14020a' : '#22040f'; g.beginPath(); g.arc(x, y + 8, 36, 0, TAU); g.fill(); g.fillRect(x - 44, y + 34, 88, 60); redEyes(g, x, y + 2, 150, bl, 1, .13); } }
  else { warnIcon(g, -118, 4, 46, RED); txt(g, '挂科？', -50, -14, 50, '#ffd6de', 900); txt(g, '被骂？丢人？', -50, 50, 34, '#ff8fa0', 900); }
}
function shotCover(g, t) {
  const v = eBG(g, t), z = 1 + .04 * inv(E_0, Q(136), t);
  g.save(); g.translate(960, 600); g.scale(z, z); g.translate(-960, -600);
  const head = [960, 1190 + backHeadY(200, .35)];
  // task card (focus)
  const sp = E.outC(inv(Q(133.5), Q(134.2), t)), tk = 1 + .16 * E.outB(clamp((t - Q(133.5)) / .35));
  if (sp > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 960, 570, 420, [[0, `rgba(255,220,140,${.35 * sp})`], [1, 'rgba(255,220,140,0)']]); g.fillRect(500, 200, 920, 800); g.restore(); }
  g.save(); g.translate(960, 572); g.scale(tk, tk); g.shadowColor = `rgba(255,210,110,${.4 + .5 * sp})`; g.shadowBlur = 20 + 30 * sp; fillRR(g, -170, -50, 340, 100, 16, '#f4f7ff'); g.shadowBlur = 0;
  txt(g, '任务', -128, 14, 40, '#1a2050', 900); g.fillStyle = 'rgba(30,40,90,.25)'; g.fillRect(-30, -16, 170, 9); g.fillRect(-30, 8, 120, 9); g.restore();
  // tension lines screen → head
  SCRN.forEach((S, i) => { const ct = COVER_T[i]; if (t < SCR_IN[i] + .1) return; const snap = t > ct ? clamp((t - ct) / .3) : 0; if (snap >= 1) return;
    g.save(); g.globalAlpha *= (1 - snap) * .8; g.strokeStyle = '#ff2d55'; g.lineWidth = 3; g.shadowColor = '#ff2d55'; g.shadowBlur = 10; g.setLineDash([12, 10]); g.lineDashOffset = -t * 120;
    const x0 = S.x, y0 = S.y + SCRH / 2, mx = lerp(x0, head[0], .5) + nz(t * 8, i) * 30, my = lerp(y0, head[1], .5) + 60; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(mx, my, head[0] + (i - 1) * 40, head[1] - 40); g.stroke(); g.restore(); });
  // screens
  SCRN.forEach((S, i) => { if (t < SCR_IN[i]) return; const k = E.outB(clamp((t - SCR_IN[i]) / .25)), hp = pulse(t, SCR_HIT[i], 5), ct = COVER_T[i], cov = t >= ct;
    const jit = cov ? 0 : 3 + 6 * hp, s = k * (1 + .1 * hp + .015 * beatPulse(t, 6)) * (cov ? lerp(1.05, .96, E.outC(clamp((t - ct) / .4))) : 1);
    g.save(); g.translate(S.x + nz(t * 25, i) * jit, S.y + nz(t * 21, i + 3) * jit); g.rotate(S.r); g.scale(s, s);
    if (!cov || t - ct < .06) { g.shadowColor = '#ff2d55'; g.shadowBlur = 30 + 40 * hp; fillRR(g, -SCRW / 2, -SCRH / 2, SCRW, SCRH, 18, 'rgba(46,4,18,.94)', '#ff2d55', 4); g.shadowBlur = 0;
      g.save(); rr(g, -SCRW / 2, -SCRH / 2, SCRW, SCRH, 18); g.clip(); scrContent(g, i, t); g.restore(); chipPill(g, -SCRW / 2 + 56, -SCRH / 2 - 4, S.n, 24, 1, '#e0243f', null, '#fff'); }
    if (t >= ct - .2) { const u = t - (ct - .2), ck = E.outB(clamp(u / .2)), dy = (1 - ck) * -520, rot = (1 - ck) * .3 * (i - 1 || 1);
      g.save(); g.translate(0, dy); g.rotate(rot + [-.05, .03, .06][i]); g.shadowColor = 'rgba(60,150,255,.9)'; g.shadowBlur = 30; g.fillStyle = linear(g, 0, -SCRH / 2, 0, SCRH / 2, [[0, '#3d8bff'], [1, '#1f55d6']]); rr(g, -SCRW / 2 - 14, -SCRH / 2 - 14, SCRW + 28, SCRH + 28, 22); g.fill(); g.shadowBlur = 0;
      g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3; rr(g, -SCRW / 2 - 2, -SCRH / 2 - 2, SCRW + 4, SCRH + 4, 16); g.stroke(); eyeSlash(g, -70, 0, 46); txt(g, '不看', 10, 22, 64, '#ffffff', 900); g.restore();
      if (u > .2 && u < .6) { const q = (u - .2) / .4, r = rng(i * 17 + 3); for (let j = 0; j < 16; j++) { const a = r() * TAU, d = 230 + 160 * E.outC(q) * r(); glowDot(g, Math.cos(a) * d * .9, Math.sin(a) * d * .55, 10, '#bfe0ff', .8 * (1 - q)); } } }
    g.restore(); });
  // protagonist (back view)
  const dn = lerp(.35, 0, sstep(Q(134.4), Q(135.4), t));
  g.save(); g.translate(960, 1190); silo(g, backShape(200, dn, 1.02), { rim: v > .6 ? '#d8f0ff' : '#ffb0c0', blur: 22, dx: 0, dy: -3 }); scarfB(g, 200, t); g.restore();
  g.restore();
  ETAG(g, t, E_0, Q(135.6), '01', '遮住记分牌');
  bigParts(g, t, Q(134), [['只看', '#ffffff'], ['任务', '#ffd36a', 'rgba(255,196,64,.9)'], ['，不看', '#ffffff'], ['结果', '#9fb4d8']], 960, 150, 96);
}

// ---- E2 · 只盯下一步 ----
const MT = { x0: 600, x1: 1980, base: 1090, px: 1480, py: 190 }, NSTEP = 8;
const STX = i => 640 + i * (MT.px - 640) / NSTEP, STY = i => 1010 - i * (1010 - MT.py) / NSTEP;
const MT_L = (() => { const r = rng(919), a = []; for (let i = 0; i <= 160; i++) { const s = i / 160; let x = lerp(MT.x0, MT.px, s), y = lerp(MT.base, MT.py, Math.pow(s, .92));
  if (i > 0 && i < 160) { y += (r() - .5) * 46 * Math.sin(s * Math.PI); x += (r() - .5) * 20; } a.push([x, y]); } return a; })();
const ST_L = (() => { const P = [[MT.x0, MT.base], [STX(0) - 40, MT.base]]; let x = STX(0) - 40; for (let i = 0; i < NSTEP; i++) { P.push([x, STY(i)]); x = STX(i + 1); P.push([x, STY(i)]); } P.push([MT.px, MT.py]);
  const L = []; let tot = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(d); tot += d; }
  const out = []; for (let k = 0; k <= 160; k++) { let s = k / 160 * tot, i = 0; while (i < L.length - 1 && s > L[i]) { s -= L[i]; i++; } const f = clamp(s / L[i]); out.push([lerp(P[i][0], P[i + 1][0], f), lerp(P[i][1], P[i + 1][1], f)]); } return out; })();
const MT_R = (() => { const r = rng(313), a = []; for (let i = 1; i <= 60; i++) { const s = i / 60; a.push([lerp(MT.px, MT.x1, s) + (r() - .5) * 14, lerp(MT.py, MT.base, Math.pow(s, .8)) + (r() - .5) * 40 * Math.sin(s * Math.PI)]); } return a; })();
function shotSteps(g, t) {
  const v = eBG(g, t, 1300, 300), u = t - Q(136), loom = 1 + .05 * E.outC(clamp(u / 1.4)) + .01 * Math.sin(t * 30) * pulse(t, Q(137), 3);
  const mk2 = E.ioC(inv(Q(138), Q(138.8), t)), foc = sstep(Q(138.9), Q(139.3), t), stepI = t >= Q(143) ? 1 : 0, sx2 = lerp((STX(0) + STX(1)) / 2, (STX(1) + STX(2)) / 2, E.ioC(inv(Q(143), Q(143.5), t))), sy2 = lerp(STY(0), STY(1), E.ioC(inv(Q(143), Q(143.5), t)));
  g.save(); g.translate(1300, 1090); g.scale(loom, loom); g.translate(-1300, -1090);
  // mountain body
  g.beginPath(); g.moveTo(MT.x0, MT.base + 60); MT_L.forEach((p, i) => { const sI = Math.min(160, i), q = ST_L[sI], lk = clamp(mk2 * 1.6 - (1 - i / 160) * .6); g.lineTo(lerp(p[0], q[0], lk), lerp(p[1], q[1], lk)); }); MT_R.forEach(p => g.lineTo(p[0], p[1])); g.lineTo(MT.x1, MT.base + 60); g.closePath();
  g.fillStyle = linear(g, 0, MT.py, 0, MT.base, [[0, mixHex('#6a1a44', '#3a64b0', v / 2)], [.5, mixHex('#3a0c28', '#1c3a7a', v / 2)], [1, mixHex('#16061a', '#0a1636', v / 2)]]); g.fill();
  g.save(); g.clip(); g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 3; for (let k = 0; k < 14; k++) { const yy = MT.py + 60 + k * 62; g.beginPath(); g.moveTo(MT.x0, yy + 30); for (let x = MT.x0; x <= MT.x1; x += 60) g.lineTo(x, yy + Math.sin(x * .01 + k) * 14); g.stroke(); }
  g.fillStyle = radial(g, MT.px, MT.py + 40, 300, [[0, 'rgba(255,255,255,.18)'], [1, 'rgba(255,255,255,0)']]); g.fillRect(MT.px - 300, MT.py - 40, 600, 400); g.restore();
  g.beginPath(); g.moveTo(MT.x0, MT.base + 60); MT_L.forEach((p, i) => { const q = ST_L[Math.min(160, i)], lk = clamp(mk2 * 1.6 - (1 - i / 160) * .6); g.lineTo(lerp(p[0], q[0], lk), lerp(p[1], q[1], lk)); }); MT_R.forEach(p => g.lineTo(p[0], p[1])); g.lineTo(MT.x1, MT.base + 60);
  g.save(); g.strokeStyle = mixHex('#ff5a78', '#9fd0ff', clamp(v)); g.lineWidth = 4; g.shadowColor = g.strokeStyle; g.shadowBlur = 14; g.stroke(); g.restore();
  // summit flag
  g.save(); g.strokeStyle = '#dfe8ff'; g.lineWidth = 5; g.beginPath(); g.moveTo(MT.px, MT.py); g.lineTo(MT.px, MT.py - 110); g.stroke(); const fw = Math.sin(t * 6) * 8; g.fillStyle = '#ff4060'; poly(g, [[MT.px, MT.py - 110], [MT.px + 90, MT.py - 90 + fw], [MT.px, MT.py - 66]]); g.fill(); g.restore();
  g.save(); g.globalAlpha *= 1 - .6 * foc; txt(g, '整篇报告', MT.px + 110, MT.py - 66, 40, '#ffd6de', 900, 'left'); txt(g, '10000 字', MT.px + 110, MT.py - 20, 28, 'rgba(255,200,210,.7)', 700, 'left'); g.restore();
  // step labels
  if (mk2 > .9) for (let i = 0; i < NSTEP; i++) { const a = (i === 0 ? 0 : .35 * (1 - foc * .6)) * fadeK(t, Q(138.8) + i * .05, .2), x = (STX(i) + STX(i + 1)) / 2; if (i > 1 || (i === 1 && t < Q(143))) txt(g, ['写第一行', '写第二行', '第三行', '第四行', '……', '……', '……', '……'][i], x, STY(i) - 16, 24, 'rgba(220,230,255,.9)', 700, 'center', a); }
  // focus: darken all but next step
  if (foc > 0) { g.save(); g.fillStyle = radial(g, sx2, sy2 - 60, 520, [[0, 'rgba(2,4,14,0)'], [.35, 'rgba(2,4,14,0)'], [1, `rgba(2,4,14,${.6 * foc})`]]); g.fillRect(-200, -200, W + 400, H + 400); g.restore();
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = foc; g.fillStyle = linear(g, 0, 0, 0, sy2, [[0, 'rgba(255,220,140,0)'], [1, 'rgba(255,220,140,.32)']]); poly(g, [[sx2 - 60, -100], [sx2 + 60, -100], [sx2 + 150, sy2], [sx2 - 150, sy2]]); g.fill(); g.restore();
    const lx0 = stepI ? STX(1) : STX(0), lx1 = stepI ? STX(2) : STX(1), ly = stepI ? STY(1) : STY(0);
    g.save(); g.strokeStyle = '#ffd36a'; g.lineWidth = 7; g.shadowColor = '#ffc440'; g.shadowBlur = 22; g.globalAlpha *= foc; g.beginPath(); g.moveTo(lx0, ly); g.lineTo(lx1, ly); g.stroke(); g.restore();
    const lab = stepI ? '写第二行' : '写第一行', jy = stepI ? E.ioC(inv(Q(143.4), Q(143.9), t)) : E.ioC(inv(Q(141), Q(141.5), t)); chipPill(g, (lx0 + lx1) / 2, ly - 54 - 230 * jy, lab, 30, popK(t, stepI ? Q(143.1) : Q(139.1)), '#ffc440', '#fff2c0', '#2a1800', { glow: 'rgba(255,196,64,.9)' });
    if (t >= Q(141.6)) { const ck = popK(t, Q(141.6)); g.save(); g.translate((STX(0) + STX(1)) / 2 + 70, STY(0) - 30); g.scale(ck, ck); checkIcon(g, 0, 0, 22, '#7dffb0', 7); g.restore(); } }
  // climber (small front figure)
  const jk = E.ioC(inv(Q(141), Q(141.5), t)), j2 = E.ioC(inv(Q(143.4), Q(143.9), t));
  let fx = lerp(520, (STX(0) + STX(1)) / 2 - 10, jk), fy = lerp(1090, STY(0), jk) - Math.sin(jk * Math.PI) * 70; fx = lerp(fx, (STX(1) + STX(2)) / 2 - 10, j2); fy = lerp(fy, STY(1), j2) - Math.sin(j2 * Math.PI) * 60;
  g.save(); g.translate(fx, fy); silo(g, standShape(28), { rim: '#d8ecff', blur: 14, dx: 0, dy: -2 }); scarfF(g, 28, t); g.restore();
  if (t > Q(137) && t < Q(138.6)) bubble(g, 640, 760, '太大了…', 34, popK(t, Q(137)) * (1 - clamp((t - Q(138.3)) / .2)), 540, 880);
  g.restore();
  ETAG(g, t, Q(136), Q(143.6), '02', '只盯下一步');
  bigParts(g, t, Q(140), [['下一步：', '#ffffff'], ['写第一行', '#ffd36a', 'rgba(255,196,64,.9)']], 900, 150, 100);
}

// ---- E3 · 延长呼气 ----
function breathR(t) { if (t < Q(144)) return 170; if (t < Q(147)) return lerp(170, 330, E.ioS(inv(Q(144), Q(147), t))); return lerp(330, 170, E.ioS(inv(Q(147), Q(152), t))); }
function ecg(g, t, x0, x1, y, bpm, col, amp = 60) { // scrolling ECG trace
  const per = 60 / bpm, pxs = 260, sh = t * pxs; g.save(); g.strokeStyle = col; g.lineWidth = 4; g.shadowColor = col; g.shadowBlur = 12; g.lineJoin = 'round'; g.beginPath();
  for (let x = x0; x <= x1; x += 3) { const tt = (x - x0 + sh) / pxs, f = (tt % per) / per; let v = 0; if (f > .3 && f < .34) v = -.25; else if (f >= .34 && f < .37) v = 1; else if (f >= .37 && f < .41) v = -.45; else if (f > .55 && f < .65) v = .18 * Math.sin((f - .55) / .1 * Math.PI);
    const yy = y - v * amp; x === x0 ? g.moveTo(x, yy) : g.lineTo(x, yy); }
  g.globalAlpha *= 1; g.stroke(); g.restore(); }
function shotBreath(g, t) {
  const v = eBG(g, t, 960, 600), R = breathR(t), ins = t < Q(147), an = anchorAt(t);
  // ring
  const cx = 960, cy = 640, col = ins ? '#7fe8ff' : '#7cb8ff';
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, cx, cy, R * 1.25, [[0, 'rgba(120,200,255,.0)'], [.7, 'rgba(120,200,255,.10)'], [1, 'rgba(120,200,255,0)']]); g.fillRect(cx - R * 1.4, cy - R * 1.4, R * 2.8, R * 2.8); g.restore();
  g.save(); g.strokeStyle = col; g.lineWidth = 8; g.shadowColor = col; g.shadowBlur = 30; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();
  g.globalAlpha = .35; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R + 26, 0, TAU); g.stroke(); g.restore();
  // progress arc on outer ring
  const pk = ins ? inv(Q(144), Q(147), t) : inv(Q(147), Q(152), t); g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 6; g.lineCap = 'round'; g.shadowColor = col; g.shadowBlur = 16; g.beginPath(); g.arc(cx, cy, R + 26, -Math.PI / 2, -Math.PI / 2 + TAU * pk); g.stroke(); g.restore();
  // figure (front), shoulders rise on inhale
  const bk = (R - 170) / 160; g.save(); g.translate(960, 1080); g.scale(1 + .02 * bk, 1 + .03 * bk); silo(g, standShape(70), { rim: '#d8ecff', blur: 20, dx: 0, dy: -3 }); scarfF(g, 70, t); g.restore();
  // left: phase + count
  const bn = ins ? Math.min(3, Math.floor((t - Q(144)) / BEAT) + 1) : Math.min(5, Math.floor((t - Q(147)) / BEAT) + 1), lk = fadeK(t, Q(144) + .05, .2);
  g.save(); g.globalAlpha *= lk; txt(g, ins ? '吸气' : '呼气', 150, 560, 96, ins ? '#bff3ff' : '#cfe0ff', 900);
  const nk = pulse(t, ins ? Q(144) + (bn - 1) * BEAT : Q(147) + (bn - 1) * BEAT, 5); g.save(); g.translate(250, 720); g.scale(1 + .25 * nk, 1 + .25 * nk); txt(g, String(bn), 0, 0, 150, '#ffffff', 900, 'center'); g.restore();
  txt(g, ins ? '/ 3 拍' : '/ 5 拍', 340, 712, 40, 'rgba(220,235,255,.75)', 900);
  for (let i = 0; i < 8; i++) { const t0 = Q(144) + i * BEAT, on = t >= t0, x = 150 + i * 62, inh = i < 3; fillRR(g, x, 800, 50, 20, 10, on ? (inh ? '#7fe8ff' : '#7cb8ff') : 'rgba(200,220,255,.18)'); }
  txt(g, '吸', 150 + 62, 860, 26, 'rgba(191,243,255,.8)', 900, 'center'); txt(g, '呼', 150 + 62 * 5, 860, 26, 'rgba(207,224,255,.8)', 900, 'center'); g.restore();
  // right: heart + bpm + ecg
  const hx = 1540, hy = 470, hk = heartK(t); g.save(); g.globalAlpha *= fadeK(t, Q(144.5), .25);
  g.fillStyle = an.b > 110 ? '#ff5a78' : '#ffd36a'; g.shadowColor = g.fillStyle; g.shadowBlur = 24; heartPath(g, hx - 150, hy - 30, 46 * (1 + .25 * hk)); g.fill(); g.shadowBlur = 0;
  txt(g, String(Math.round(an.b)), hx - 90, hy + 10, 110, '#ffffff', 900); txt(g, 'BPM', hx - 80 + tw(g, String(Math.round(an.b)), 110), hy + 6, 32, 'rgba(225,238,255,.7)', 900);
  if (t > Q(147.3)) { for (let k = 0; k < 3; k++) { const on = (Math.floor((t - Q(147.3)) * 3) - k) % 3 === 0; g.fillStyle = on ? '#ffd36a' : 'rgba(255,211,106,.3)'; poly(g, [[hx + 210, hy - 64 + k * 26], [hx + 250, hy - 64 + k * 26], [hx + 230, hy - 44 + k * 26]]); g.fill(); } }
  ecg(g, t, 1240, 1820, 620, an.b, an.b > 110 ? '#ff7a90' : '#9fe0ff', 56); g.restore();
  ETAG(g, t, Q(144), Q(151.6), '03', '延长呼气');
  bigParts(g, t, Q(148), [['呼气', '#9fe0ff'], ['比', '#ffffff'], ['吸气', '#9fe0ff'], ['长', '#ffffff']], 960, 150, 88);
  bigParts(g, t, Q(150), [['→ 心跳降档', '#ffd36a', 'rgba(255,196,64,.9)']], 960, 250, 68);
}

// ---- E4 · 换个说法 ----
function miniBrain(g, x, y, s, col, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s); smoothPath(g, BR_OUT, true); g.fillStyle = 'rgba(10,20,50,.85)'; g.fill(); g.strokeStyle = col; g.lineWidth = 10; g.shadowColor = col; g.shadowBlur = 30; g.stroke();
  g.save(); smoothPath(g, BR_OUT, true); g.clip(); g.globalAlpha *= .6; g.lineWidth = 9; g.shadowBlur = 0; for (const sq of BR_SQ.slice(0, 14)) { smoothPath(g, sq, false); g.stroke(); } g.restore(); g.restore(); }
function shotReframe(g, t) {
  const v = eBG(g, t, 900, 500), an = anchorAt(t), hk = heartK(t), fx = 600, s = 78;
  // heart → brain signal
  const hp = [fx, 1080 - 4.55 * s], bp = [1400, 470];
  g.save(); g.setLineDash([10, 12]); g.lineDashOffset = -t * 80; g.strokeStyle = 'rgba(220,235,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(hp[0] + 40, hp[1]); g.quadraticCurveTo(1100, 760, bp[0] - 120, bp[1] + 60); g.stroke(); g.restore();
  if (PHASE) { for (let k = 0; k < 3; k++) { const per = 60 / an.b, ph = ((t - Q(152)) / (per * 2) + k / 3) % 1, q = 1 - ph, x = q * q * (hp[0] + 40) + 2 * q * ph * 1100 + ph * ph * (bp[0] - 120), y = q * q * hp[1] + 2 * q * ph * 760 + ph * ph * (bp[1] + 60); glowDot(g, x, y, 20, t >= Q(156) ? '#ffd36a' : '#ff7a90', .8); } }
  // figure + glowing heart
  g.save(); g.translate(fx, 1080); silo(g, standShape(s), { rim: '#d8ecff', blur: 20, dx: 0, dy: -3 }); scarfF(g, s, t); g.restore();
  glowDot(g, hp[0] + 14, hp[1], 70 + 40 * hk, '#ff5a78', .7); g.fillStyle = '#ff5a78'; heartPath(g, hp[0] + 14, hp[1] + 4, 20 * (1 + .3 * hk)); g.fill();
  // BPM readout (same before/after)
  g.save(); g.globalAlpha *= fadeK(t, Q(152.6), .2); txt(g, '心跳', 120, 640, 32, 'rgba(225,238,255,.7)', 900); txt(g, String(Math.round(an.b)), 120, 740, 96, '#ffffff', 900); txt(g, 'BPM', 120 + tw(g, String(Math.round(an.b)), 96) + 10, 736, 30, 'rgba(225,238,255,.7)', 900);
  if (t >= Q(155.5)) chipPill(g, 210, 810, '一样快', 30, popK(t, Q(155.5)), 'rgba(20,40,90,.9)', '#9fd0ff', '#e8f4ff'); g.restore();
  // thought bubble
  const bx = 820, by = 330, sw = t >= Q(155) ? 1 : 0, sk = E.outC(clamp((t - Q(154)) / .25)), crum = clamp((t - Q(154.5)) / .4);
  const str = sw ? '我好兴奋！' : '我好紧张…', bk = sw ? popK(t, Q(155), .3) : popK(t, Q(152.5)) * (1 - clamp((t - Q(154.75)) / .2));
  if (bk > 0) { const shk = !sw && t > Q(154.5) ? 6 : 0; g.save(); g.translate(nz(t * 30, 2) * shk, nz(t * 27, 5) * shk);
    bubble(g, bx, by, str, 72, bk, fx + 30, 1080 - 6.9 * s, { fill: sw ? '#ffd36a' : '#f6f7ff', glow: sw ? 'rgba(255,196,64,.9)' : 'rgba(0,0,0,.5)', col: sw ? '#3a2200' : '#1a1c34' });
    if (!sw && sk > 0) { const w = tw(g, str, 72); g.save(); g.strokeStyle = '#ff2d55'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx - w / 2 - 10, by); g.lineTo(bx - w / 2 - 10 + (w + 20) * sk, by); g.stroke(); g.restore(); }
    g.restore(); }
  if (sw && t < Q(156)) { const u = (t - Q(155)) / .6; if (u < 1) for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, d = 200 + 260 * E.outC(u); glowDot(g, bx + Math.cos(a) * d * 1.4, by + Math.sin(a) * d * .6, 14, '#ffe08a', 1 - u); } }
  // brain + interpretation label
  const fl = E.ioC(inv(Q(156), Q(156.4), t)), bcol = fl < .5 ? '#ff5a78' : '#ffd36a';
  txt(g, '大脑的解读', bp[0], 230, 32, 'rgba(225,238,255,.7)', 900, 'center', fadeK(t, Q(153), .2));
  miniBrain(g, bp[0], bp[1], .42, bcol, fadeK(t, Q(152.8), .3)); if (fl < .5 && t > Q(153)) { const bl = .5 + .5 * Math.sin((t - Q(153)) * 14); glowDot(g, bp[0] - 20, bp[1] + 40, 60, '#ff2d55', .6 * bl); }
  if (t >= Q(153)) { const sy = Math.abs(Math.cos(fl * Math.PI)), lab = fl < .5 ? '威胁！' : '挑战！'; g.save(); g.translate(bp[0], 730); g.scale(popK(t, Q(153)), Math.max(.02, sy) * popK(t, Q(153)));
    chipPill(g, 0, 0, lab, 52, 1, fl < .5 ? 'rgba(80,6,24,.95)' : '#ffc440', fl < .5 ? '#ff2d55' : '#fff2c0', fl < .5 ? '#ffd6de' : '#2a1800', { glow: fl < .5 ? 'rgba(255,40,80,.9)' : 'rgba(255,196,64,.9)' }); g.restore(); }
  // corner tip
  if (t >= Q(152.5) && t < F_0) { const k = E.outC(clamp((t - Q(152.5)) / .3)) * (1 - clamp((t - Q(159.4)) / .3)), str2 = '压力太小？给自己设个倒计时', w = tw(g, str2, 28) + 100;
    g.save(); g.globalAlpha *= k; g.translate(0, (1 - k) * 20); fillRR(g, 50, 980, w, 60, 30, 'rgba(8,20,50,.8)', 'rgba(160,200,255,.35)', 2); g.strokeStyle = '#9fd0ff'; g.lineWidth = 4; g.beginPath(); g.arc(92, 1010, 16, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(92, 1010); g.lineTo(92, 1000); g.moveTo(92, 1010); g.lineTo(100, 1014); g.stroke();
    txt(g, str2, 124, 1020, 28, '#dbe9ff', 700); g.restore(); }
  ETAG(g, t, Q(152), Q(156.8), '04', '换个说法');
  bigParts(g, t, Q(157), [['心跳没变，', '#ffffff'], ['大脑的解读变了', '#ffd36a', 'rgba(255,196,64,.9)']], 960, 150, 84);
}
// ---- dispatch ----
function sceneEsec(g, t) { if (t < Q(136)) shotCover(g, t); else if (t < Q(144)) shotSteps(g, t); else if (t < Q(152)) shotBreath(g, t); else shotReframe(g, t); }
const CUTS_E = [Q(136), Q(144), Q(152)];
SHAKES.push([E_0, 8, .3], [Q(129), 6, .25], [Q(130), 6, .25], [Q(131), 7, .25], [Q(132), 16, .35], [Q(132.5), 12, .3], [Q(133), 14, .3], [Q(136), 6, .3], [Q(137), 10, .6], [Q(138), 6, .4], [Q(141.5), 6, .25], [Q(144), 5, .3], [Q(152), 5, .3], [Q(154), 8, .3], [Q(155), 6, .25]);
FLASHES.push([Q(132), .16, .15], [Q(134), .14, .25], [Q(142), .12, .25], [Q(155), .14, .2], [Q(157), .18, .3]);
CHROMA.push([E_0, 8, .3], [Q(132), 10, .3], [Q(133), 8, .3], [Q(136), 6, .3]);
