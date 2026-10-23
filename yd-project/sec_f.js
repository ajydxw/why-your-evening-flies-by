// ================= SECTION F · Q160 → end 「刚刚好」 =================
let ANS_X = null;
function buildF() { const c = mk(10, 10), g = c.getContext('2d'); g.font = F(700, 36);
  ANS_X = [330, 160 + g.measureText('2. 已知 sin α = 3/5，α 为锐角，则 cos 2α = ').width + 18, 160 + g.measureText('3. 等差数列 {aₙ} 中，a₃ = 7，a₇ = 19，则公差 d = ').width + 22]; }
const ANS = [['(−b ± √(b² − 4ac)) / 2a', 526, Q(160.7), Q(162), 40], ['7/25', 644, Q(162.6), Q(163.3), 40], ['3', 744, Q(164), Q(164.3), 40]];
function ansW(g, i) { return tw(g, ANS[i][0], ANS[i][4], 700); }
function shotExam(g, t) {
  g.drawImage(DESK, 0, 0); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 1000, 420, 1100, [[0, 'rgba(255,200,120,.16)'], [1, 'rgba(255,200,120,0)']]); g.fillRect(0, 0, W, H); g.restore();
  const u = t - F_0, prog = E.ioS(inv(Q(160.5), Q(165), t)), z = lerp(1.24, 1.16, E.outC(clamp(u / 3))) * (1 + .1 * E.ioS(inv(Q(165.5), Q(168), t)));
  const f = paperPt(600, lerp(520, 690, prog)), to = [lerp(900, 940, prog), lerp(560, 540, prog)];
  g.save(); viewTo(g, f, to, z);
  drawPaperAt(g, 1, pg => {
    // gentle gold highlight on 「求根公式」 (echo of case 01)
    const hk = E.outC(clamp((t - Q(160.2)) / .4)); if (hk > 0) { pg.save(); pg.globalCompositeOperation = 'multiply'; pg.fillStyle = 'rgba(255,214,110,.8)'; pg.fillRect(PAPER_HL.x0 - 8, PAPER_HL.y - 38, (PAPER_HL.x1 - PAPER_HL.x0 + 16) * hk, 50); pg.restore(); }
    ANS.forEach(([s, y, t0, t1, sz], i) => { if (t < t0) return; const k = clamp((t - t0) / (t1 - t0)), w = ansW(pg, i), x = ANS_X[i];
      pg.save(); pg.beginPath(); pg.rect(x - 10, y - 60, (w + 20) * k, 90); pg.clip(); txt(pg, s, x, y, sz, '#1f3c9a', 700); pg.restore();
      if (t >= t1 + .1) { const ck = popK(t, t1 + .1, .25); pg.save(); pg.translate(x + w + 50, y - 14); pg.scale(ck, ck); pg.shadowColor = 'rgba(255,190,60,.9)'; pg.shadowBlur = 14; checkIcon(pg, 0, 0, 26, '#e8a512', 8); pg.restore(); } });
  });
  // pen follows writing
  let tip; { let i = ANS.findIndex(a => t < a[3]); if (i < 0) i = 2; const [s, y, t0, t1] = ANS[i], x = ANS_X[i], w = ansW(g, i);
    if (t >= t0 && t < t1) { const k = (t - t0) / (t1 - t0); tip = paperPt(x + w * k, y - 8 + Math.sin(k * 40) * 6); }
    else { const pi = Math.max(0, i - 1), pw = ansW(g, pi), a = t < t0 && i > 0 ? paperPt(ANS_X[pi] + pw + 90, ANS[pi][1] - 4) : paperPt(x + 600, y + 200), b = paperPt(x, y - 8), k = t < t0 ? E.ioC(inv(i > 0 ? ANS[pi][3] + .35 : F_0, t0, t)) : 1;
      tip = t >= ANS[2][3] ? (() => { const e0 = paperPt(ANS_X[2] + ansW(g, 2) + 90, ANS[2][1] - 4), e1 = paperPt(ANS_X[2] + 420, ANS[2][1] + 160), q = E.ioC(inv(ANS[2][3] + .4, ANS[2][3] + 1.2, t)); return [lerp(e0[0], e1[0], q), lerp(e0[1], e1[1], q)]; })() : [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; } }
  penHand(g, tip, .75, .3, t);
  g.restore(); paperLight(g);
  // calm gold motes
  for (let i = 0; i < 24; i++) { const ph = (t * .05 + hsh(i * 7)) % 1; glowDot(g, hsh(i * 3) * W, H - ph * H, 12, '#ffd78a', .25 * Math.sin(ph * Math.PI)); }
  // state pill above the card
  if (t >= Q(165)) { const k = popK(t, Q(165), .3), x = CARD.x + CARD.w / 2, y = CARD.y - 46; g.save(); g.globalAlpha *= 1 - clamp((t - Q(166.8)) / .25); chipPill(g, x, y, '状态：刚刚好', 32, k, '#ffc440', '#fff2c0', '#2a1800', { glow: 'rgba(255,196,64,.95)' }); g.restore(); }
}
// ---- F2/F3 · ridge ----
const STARS = (() => { const r = rng(2024), a = []; for (let i = 0; i < 90; i++) a.push([r() * W, r() * 520, .6 + r() * 1.8, r() * 9, FADE0 + .1 + r() * 2.4]); return a; })();
const FAR1 = (() => { const r = rng(55), a = []; for (let x = -40; x <= W + 40; x += 40) a.push([x, 640 + 70 * Math.sin(x * .004 + 1) + 40 * Math.sin(x * .011) + (r() - .5) * 20]); return a; })();
const FAR2 = (() => { const r = rng(56), a = []; for (let x = -40; x <= W + 40; x += 40) a.push([x, 760 + 60 * Math.sin(x * .005 + 3) + 30 * Math.sin(x * .013 + 1) + (r() - .5) * 16]); return a; })();
const RPK = { x: 960, y: 470 };
function ridgeY(x) { const d = (x - RPK.x) / 560; return RPK.y + (1130 - RPK.y) * (1 - Math.exp(-d * d)) + 26 * Math.sin(x * .021) * Math.min(1, Math.abs(d) * 2) + 14 * Math.sin(x * .057 + 1) * Math.min(1, Math.abs(d) * 3); }
function fTime(t) { return t < FADE0 ? t : FADE0 + (t - FADE0) * lerp(1, .25, clamp((t - FADE0) / 1.5)); }
function shotRidge(g, t) {
  const te = fTime(t), M = chartBox(g, t, FULLB, { u: .49, bpm: 78, cool: 1, head: 130, a: 0 }), m0 = E.ioC(inv(Q(168.15), Q(169.3), t)), mk = E.ioC(inv(Q(168.5), Q(170.2), t));
  const zo = lerp(1, .95, E.ioS(inv(Q(169), Q(176), t))), sun = sstep(Q(173), Q(176.5), t);
  // sky
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, mixHex('#060a1e', '#0b1838', sun)], [.45, mixHex('#0d1840', '#1e3a78', sun)], [.75, mixHex('#1a2a5a', '#e89a5a', sun * .85)], [1, mixHex('#141c40', '#f0c070', sun)]]); g.fillRect(0, 0, W, H);
  if (m0 < 1) { g.save(); g.globalAlpha = 1 - m0; g.fillStyle = '#080a24'; g.fillRect(0, 0, W, H); g.restore(); }
  g.save(); g.translate(960, 700); g.scale(zo, zo); g.translate(-960, -700);
  // stars (go out one by one in the fade)
  for (const [x, y, r, ph, off] of STARS) { let a = m0 * (.45 + .45 * Math.sin(te * 1.7 + ph)) * (1 - .5 * sun); if (t > off) { const u = t - off; if (u > .25) continue; a *= 1 + 2 * (1 - u / .25); a *= 1 - u / .25; } glowDot(g, x, y, r * 5, '#e8f0ff', a); g.fillStyle = `rgba(255,255,255,${clamp(a)})`; g.fillRect(x - r / 2, y - r / 2, r, r); }
  // sunrise glow behind the summit
  if (sun > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, RPK.x, RPK.y + 60, 900, [[0, `rgba(255,200,120,${.55 * sun})`], [.4, `rgba(255,150,90,${.22 * sun})`], [1, 'rgba(255,150,90,0)']]); g.fillRect(0, 0, W, H); g.restore(); }
  // far ranges
  [[FAR1, '#1a2a5c', '#3a4a7a'], [FAR2, '#111c44', '#2a3460']].forEach(([P, c0, c1]) => { g.save(); g.globalAlpha = m0; g.beginPath(); g.moveTo(-60, H + 40); P.forEach(p => g.lineTo(p[0], p[1] + (1 - mk) * 300)); g.lineTo(W + 60, H + 40); g.closePath(); g.fillStyle = mixHex(c0, c1, sun * .6); g.fill(); g.restore(); });
  // main ridge: bell curve → mountain
  const yAt = x => { const u = (x - M.x0) / (M.x1 - M.x0), bell = M.cy(clamp(u, 0, 1)) + (u < 0 || u > 1 ? 0 : 0); return lerp(bell, ridgeY(x), mk); };
  g.beginPath(); g.moveTo(-60, H + 60); for (let x = -60; x <= W + 60; x += 12) g.lineTo(x, x < M.x0 || x > M.x1 ? lerp(M.base, ridgeY(x), mk) : yAt(x)); g.lineTo(W + 60, H + 60); g.closePath();
  g.save(); g.globalAlpha = m0; g.fillStyle = linear(g, 0, RPK.y, 0, H, [[0, '#121a3c'], [1, '#05070f']]); g.fill(); g.restore();
  g.save(); g.strokeStyle = mixHex('#ffc440', '#ffe2a0', sun); g.lineWidth = lerp(8, 4, mk); g.shadowColor = '#ffc440'; g.shadowBlur = 18; g.globalAlpha = lerp(.0, 1, m0) * lerp(1, .85, mk); g.beginPath(); for (let x = -60; x <= W + 60; x += 12) { const y = x < M.x0 || x > M.x1 ? lerp(M.base, ridgeY(x), mk) : yAt(x); x === -60 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); g.restore();
  const px = RPK.x, py = yAt(px);
  // dot → seated figure
  const fig = E.ioS(inv(Q(169.6), Q(170.4), t)), dotA = 1 - fig;
  if (dotA > 0) { glowDot(g, px, py, 80, '#ffc440', dotA); g.fillStyle = `rgba(255,255,255,${dotA})`; g.beginPath(); g.arc(px, py, 16, 0, TAU); g.fill(); }
  if (fig > 0) { glowDot(g, px, py - 50, 190, '#ffc440', .35 * fig * (1 - .4 * clamp((t - Q(176)) / 1))); g.save(); g.globalAlpha = fig; g.translate(px, py + 6); silo(g, backShape(46, .05, 1.05), { rim: '#ffe2a0', blur: 18, dx: 0, dy: -2 }); scarfB(g, 46, te * 1.6); g.restore(); }
  // wind streaks + snow
  const wk = sstep(Q(170.5), Q(171.2), t);
  if (wk > 0) { g.save(); g.globalAlpha = wk; for (let i = 0; i < 16; i++) { const sp = 900 + hsh(i) * 700, y = 120 + hsh(i * 3) * 700, len = 120 + hsh(i * 5) * 260, x = W + 300 - ((te * sp + hsh(i * 7) * 3000) % (W + 900)); g.strokeStyle = `rgba(230,240,255,${.08 + .1 * hsh(i * 11)})`; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + len / 2, y - 8, x + len, y); g.stroke(); }
    for (let i = 0; i < 50; i++) { const sp = 300 + hsh(i * 13) * 300, x = W + 50 - ((te * sp + hsh(i * 17) * 4000) % (W + 100)), y = (hsh(i * 19) * 900 + te * 40 + Math.sin(te * 2 + i) * 20) % 900; glowDot(g, x, y + 60, 5, '#ffffff', .35); } g.restore(); }
  g.restore();
  // orb rises → star
  if (t >= Q(176)) { const k = E.ioC(inv(Q(176), Q(177.6), t)), sx = px, sy = lerp(py - 60, 190, k) * zo + 700 * (1 - zo), tw2 = .8 + .2 * Math.sin(te * 5), out = t > 130.9 ? clamp((t - 130.9) / .4) : 0;
    for (let j = 1; j <= 8; j++) { const kk = clamp(k - j * .04); if (kk <= 0 || k >= 1) continue; glowDot(g, sx, lerp(py - 60, 190, kk) * zo + 700 * (1 - zo), 30, '#ffd78a', .25 * (1 - j / 9)); }
    const sa = 1 - out; glowDot(g, sx, sy, (110 + 60 * k) * tw2, '#ffd36a', .9 * sa); g.save(); g.translate(sx, sy); g.globalAlpha = sa; g.fillStyle = '#fff6d8'; g.shadowColor = '#ffc440'; g.shadowBlur = 30; const L = (26 + 40 * k) * tw2, w = 6 + 4 * k;
    g.beginPath(); g.moveTo(0, -L); g.quadraticCurveTo(w * .4, -w * .4, L, 0); g.quadraticCurveTo(w * .4, w * .4, 0, L); g.quadraticCurveTo(-w * .4, w * .4, -L, 0); g.quadraticCurveTo(-w * .4, -w * .4, 0, -L); g.fill(); g.restore(); }
  // full-card overlay at the hand-off
  if (m0 < 1) chartBox(g, t, FULLB, { u: .49, bpm: 78, cool: 1, head: 130, a: 1 - m0, noLabels: mk > .05 });
  // lines
  if (t < Q(176.3)) bigLine(g, t, Q(172), '压力不是敌人', 960, 230, 112, '#ffffff', { soft: true, d: .6, glow: 'rgba(255,190,90,.6)', t1: Q(175.6), od: .6 });
  if (t >= Q(177.4)) { const a = E.ioS(clamp((t - Q(177.4)) / .9)) * (1 - E.ioS(clamp((t - 130.2) / .7))), y = 830 + 14 * (1 - a), p1 = '它只是需要，', p2 = '刚刚好。', s1 = tw(g, p1, 76, 700), s2 = tw(g, p2, 76, 700), x0 = 960 - (s1 + s2) / 2;
    g.save(); g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 24; txt(g, p1, x0, y, 76, '#ffffff', 700, 'left', a); g.shadowColor = 'rgba(255,190,60,.9)'; g.shadowBlur = 30; txt(g, p2, x0 + s1, y, 76, '#ffd36a', 700, 'left', a); g.restore(); }
}
function sceneFsec(g, t) { if (t < Q(168)) shotExam(g, t); else shotRidge(g, t); }
const CUTS_F = [];
function overF(g, t) { if (t < FADE0) return; const a = E.ioS(inv(FADE0, BLACK0 - .05, t)); g.save(); g.fillStyle = `rgba(0,0,0,${.97 * a})`; g.fillRect(0, 0, W, H); g.restore(); }
SHAKES.push([Q(162.1), 3, .2]);
FLASHES.push([F_0, .22, .35], [Q(176), .08, .4]);
