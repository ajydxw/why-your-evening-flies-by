// ================= CASE 04 · 重要汇报哑火 (Q56 → Q64) =================
const SCR4 = { x: 700, y: 110, w: 1040, h: 580 }, SLIDE_T = [Q(56), Q(56.5), Q(57), Q(57.5)], SLIDE_PG = ['01', '02', '05', '11'];
let STAGE4 = null, SLC = null, SLCB = null, HEROC = null;
const WORDS = ['首先', '数据显示', '同比增长', '因此', '我们发现', '综上', '第一', '第二', '关键在于', '我们建议', '下一步', '预算', '风险', '用户', '转化率', '核心结论', '目标', '落地', '优先级', '资源', '协同', '复盘', '总结', '谢谢'];
const HERO4 = 15, TL = i => [270 + (i % 6) * 234, 230 + ((i / 6) | 0) * 150, 210, 120];
const DIE4 = (() => { const r = rng(44), ord = [...Array(24).keys()].filter(i => i !== HERO4);
  for (let i = ord.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ord[i], ord[j]] = [ord[j], ord[i]]; }
  const T = new Array(24); ord.forEach((w, i) => T[w] = Q(59.1) + (Q(61.5) - Q(59.1)) * Math.pow(i / (ord.length - 1), .62)); T[HERO4] = Q(61.85); return { ord: [...ord, HERO4], T }; })();
const FRZ4 = Q(63);
function build4() {
  SLC = mk(SCR4.w, SCR4.h); SLCB = mk(SCR4.w, SCR4.h);
  STAGE4 = (() => { const c = mk(W, H), g = c.getContext('2d');
    g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#06071a'], [.62, '#0b0d2a'], [.63, '#151840'], [1, '#07081c']]); g.fillRect(0, 0, W, H);
    // wall panels
    g.strokeStyle = 'rgba(120,140,255,.06)'; g.lineWidth = 2; for (let x = 40; x < W; x += 160) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 670); g.stroke(); }
    // stage lip
    g.fillStyle = linear(g, 0, 676, 0, 760, [[0, '#2a2f66'], [1, '#0a0b22']]); g.fillRect(0, 676, W, 84); g.fillStyle = 'rgba(127,244,255,.35)'; g.fillRect(0, 676, W, 2);
    // screen glow on wall
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 1220, 400, 820, [[0, 'rgba(120,170,255,.28)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, 900); g.restore();
    // floor reflection of screen
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 1220, 720, 600, [[0, 'rgba(120,170,255,.18)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(400, 676, 1600, 300); g.restore();
    return c; })();
  HEROC = (() => { const c = mk(220, 130), g = c.getContext('2d'); fillRR(g, 5, 5, 210, 120, 18, 'rgba(70,46,8,.95)', '#ffd34a', 4); txt(g, '核心结论', 110, 82, 44, '#ffe9a6', 900, 'center'); return c; })();
}
// ---------- slides ----------
function slideHead(g, n, title) { g.fillStyle = '#2b5cff'; g.fillRect(60, 56, 10, 62); txt(g, n, 92, 112, 58, '#2b5cff', 900); txt(g, title, 92 + tw(g, n, 58) + 22, 110, 50, '#141a3a', 900); g.fillStyle = 'rgba(20,26,58,.12)'; g.fillRect(60, 140, 920, 3); }
function drawSlide(g, i, u) {
  const w = SCR4.w, h = SCR4.h; g.fillStyle = linear(g, 0, 0, w, h, [[0, '#f7f9ff'], [1, '#dde4fb']]); g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(43,92,255,.08)'; g.beginPath(); g.arc(w - 40, h + 40, 300, 0, TAU); g.fill();
  if (i === 0) {
    g.fillStyle = '#2b5cff'; g.fillRect(0, 0, 26, h); fillRR(g, 80, 70, 60, 60, 12, '#2b5cff'); txt(g, 'Q3', 110, 110, 26, '#fff', 900, 'center');
    txt(g, '2025 年第三季度', 90, 250, 54, '#2b5cff', 900); txt(g, '业务汇报', 86, 380, 120, '#141a3a', 900);
    g.fillStyle = '#ffb020'; g.fillRect(92, 410, 120, 8); txt(g, '汇报人：小王', 92, 480, 34, '#4a5070', 700);
  } else if (i === 1) {
    slideHead(g, '', '目录 CONTENTS'); const items = [['01', '数据回顾'], ['02', '问题分析'], ['03', '核心结论']];
    items.forEach(([n, s], k) => { const kk = E.outC(clamp((u - k * .06) / .18)), y = 230 + k * 105; g.save(); g.globalAlpha = kk; g.translate((1 - kk) * 40, 0);
      g.fillStyle = k === 2 ? '#ffb020' : '#2b5cff'; g.beginPath(); g.arc(130, y, 34, 0, TAU); g.fill(); txt(g, n, 130, y + 12, 30, '#fff', 900, 'center'); txt(g, s, 190, y + 16, 46, '#141a3a', 900); g.restore(); });
  } else if (i === 2) {
    slideHead(g, '01', '数据回顾'); const B = [.38, .46, .52, .61, .74, .92], gx = 110, gy = 500;
    g.strokeStyle = 'rgba(20,26,58,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(gx - 20, gy); g.lineTo(940, gy); g.stroke();
    B.forEach((b, k) => { const kk = E.outB(clamp((u - k * .035) / .22)), bh = 300 * b * kk, x = gx + k * 135; g.fillStyle = k === 5 ? '#2b5cff' : '#9fb3ff'; g.fillRect(x, gy - bh, 78, bh); txt(g, 'M' + (k + 1), x + 39, gy + 36, 22, '#4a5070', 700, 'center'); });
    const lk = clamp((u - .15) / .25); g.strokeStyle = '#ffb020'; g.lineWidth = 5; g.beginPath(); B.forEach((b, k) => { if (k / 5 > lk) return; const x = gx + 39 + k * 135, y = gy - 300 * b - 26; k ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke();
    if (u > .3) { const k2 = E.outB(clamp((u - .3) / .2)); g.save(); g.translate(880, 170); g.scale(k2, k2); fillRR(g, -80, -34, 160, 68, 34, '#ffb020'); txt(g, '+23%', 0, 14, 38, '#fff', 900, 'center'); g.restore(); }
  } else {
    slideHead(g, '03', '核心结论'); const L = ['聚焦高价值客户', '砍掉低效渠道', '预算向复购倾斜'];
    L.forEach((s, k) => { const kk = E.outC(clamp((u - .04 - k * .07) / .16)), y = 240 + k * 110; g.save(); g.globalAlpha = kk; g.translate((1 - kk) * 50, 0);
      fillRR(g, 90, y - 46, 860, 86, 16, 'rgba(43,92,255,.08)'); g.fillStyle = '#2b5cff'; g.beginPath(); g.arc(140, y - 3, 28, 0, TAU); g.fill(); txt(g, '①②③'[k], 140, y + 9, 34, '#fff', 900, 'center'); txt(g, s, 196, y + 14, 44, '#141a3a', 900); g.restore(); });
  }
  txt(g, SLIDE_PG[i] + ' / 12', w - 40, h - 26, 22, '#8a90aa', 700, 'right');
}
// draw the projection screen with push transitions
function screen4(g, t, x, y, w, h, opt = {}) {
  let i = 0; for (let k = 0; k < SLIDE_T.length; k++) if (t >= SLIDE_T[k]) i = k; if (opt.fix != null) i = opt.fix;
  const u = t - SLIDE_T[i], tr = opt.fix == null && i > 0 ? E.ioC(clamp(u / .14)) : 1;
  const sg = SLC.getContext('2d'); drawSlide(sg, i, opt.fix != null ? 2 : u);
  g.save(); g.shadowColor = opt.glow || 'rgba(140,190,255,.7)'; g.shadowBlur = 60; g.fillStyle = '#000'; g.fillRect(x - 8, y - 8, w + 16, h + 16); g.restore();
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  if (tr < 1) { const bg = SLCB.getContext('2d'); drawSlide(bg, i - 1, 2); g.drawImage(SLCB, x - tr * w, y, w, h);
    g.globalAlpha = .35; g.drawImage(SLC, x + (1 - tr) * w + 30, y, w, h); g.globalAlpha = 1; }
  g.drawImage(SLC, x + (1 - tr) * w, y, w, h);
  if (opt.dim) { g.fillStyle = `rgba(4,6,20,${opt.dim})`; g.fillRect(x, y, w, h); }
  g.restore();
  g.strokeStyle = 'rgba(20,24,50,1)'; g.lineWidth = 8; g.strokeRect(x - 4, y - 4, w + 8, h + 8);
  return i;
}
// front-facing scarf (protagonist identity)
function scarfF(g, s, t) {
  g.save(); g.shadowColor = PINK; g.shadowBlur = 16; g.fillStyle = PINK;
  g.beginPath(); rr(g, -.46 * s, -5.74 * s, .92 * s, .32 * s, .15 * s); g.fill();
  const w = Math.sin(t * 4.1) * .04 * s; g.beginPath(); g.moveTo(.08 * s, -5.5 * s); g.quadraticCurveTo(.22 * s + w, -5.0 * s, .16 * s + w * 2, -4.35 * s); g.lineTo(.4 * s + w * 2, -4.4 * s); g.quadraticCurveTo(.42 * s + w, -5.0 * s, .34 * s, -5.52 * s); g.closePath(); g.fill();
  g.restore();
}
// audience back-of-heads row (foreground)
function audBacks(g, t, y, s, xs, rim = '#a6f9ff', blur = 0) {
  if (blur) g.filter = `blur(${blur}px)`;
  xs.forEach((x, k) => { g.save(); g.translate(x, y + (k % 2) * 14); silo(g, backShape(s * (1 + (k % 3) * .05), 0, 1, (k % 2 ? -.06 : .05) * s), { rim, blur: 12, dx: 0, dy: -3, ra: .7 }); g.restore(); });
  g.filter = 'none';
}
// ---------- shots ----------
function shot4A(g, t) {
  const u = t - Q(56), z = lerp(1, 1.07, E.ioS(clamp(u / 1.45)));
  g.save(); g.translate(1060, 480); g.scale(z, z); g.translate(-1060, -480);
  g.drawImage(STAGE4, 0, 0); const i = screen4(g, t, SCR4.x, SCR4.y, SCR4.w, SCR4.h);
  // laser dot
  const lp = i === 2 ? [SCR4.x + 870, SCR4.y + 190] : i === 3 ? [SCR4.x + 200 + 40 * Math.sin(t * 3), SCR4.y + 255 + 6 * Math.sin(t * 7)] : [SCR4.x + 520, SCR4.y + 330];
  if (i > 0) { glowDot(g, lp[0] + nz(t * 9, 3) * 4, lp[1] + nz(t * 9, 5) * 4, 22, 'rgba(255,40,70,1)', .9); g.fillStyle = '#fff'; g.beginPath(); g.arc(lp[0], lp[1], 4, 0, TAU); g.fill(); }
  // presenter (confident) left of screen
  const s = 92, px = 470, py = 900, gest = .35 + .25 * Math.sin(u * 5);
  g.save(); g.translate(px, py); g.fillStyle = radial(g, 0, 0, 180, [[0, 'rgba(0,0,0,.5)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(-200, -40, 400, 80);
  silo(g, standShape(s, { arm: gest }), { rim: '#bfe6ff', blur: 18, dx: 3, dy: -2 }); scarfF(g, s, t);
  g.restore();
  audBacks(g, t, 1200, 104, [40, 320, 610, 890, 1180, 1480, 1780], '#9fd6ff');
  g.restore();
  captionPill(g, t, Q(57.5) + .05, '讲到最关键的一页', 990);
}
function shot4B(g, t) {
  const u = t - Q(58), z = lerp(1.0, 1.08, E.outC(clamp(u / .7)));
  g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#04040e'], [1, '#0b0c24']]); g.fillRect(0, 0, W, H);
  g.save(); g.translate(1060, 520); g.scale(z, z); g.translate(-1060, -520);
  // light from screen behind camera
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 1060, 560, 900, [[0, 'rgba(110,150,255,.16)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H); g.restore();
  const ROWS4 = [[300, 34, 15], [410, 46, 12], [560, 64, 9], [770, 92, 7]];
  ROWS4.forEach(([y, s, n], r) => {
    const sp = W * 1.15 / n, ox = (r % 2) * sp * .5 - W * .075;
    const pts = []; for (let k = 0; k < n; k++) { const x = ox + (k + .5) * sp + nz(k * 7 + r, 2) * sp * .1; pts.push(x); }
    pts.forEach((x, k) => { g.save(); g.translate(x, y + 5.0 * s); silo(g, standShape(s * (.95 + .1 * hsh(k + r * 20))), { rim: '#6f86d8', blur: 10, dx: 0, dy: -2, ra: .55, body: '#090a1c' }); g.restore(); });
    // seat backs
    g.fillStyle = mixHex('#0c0d26', '#141739', r / 3); pts.forEach(x => { g.beginPath(); rr(g, x - s * 1.25, y + 2.1 * s, s * 2.5, s * 3, s * .4); g.fill(); });
    g.fillStyle = 'rgba(120,150,255,.12)'; pts.forEach(x => g.fillRect(x - s * 1.1, y + 2.1 * s, s * 2.2, 2));
    // red eyes wave from center
    pts.forEach((x, k) => { const d = Math.hypot((x - 1060) / 960, (r - 3) * .25), te = Q(58) + .02 + d * .16 + hsh(k * 3 + r) * .05;
      const op = E.outB(clamp((t - te) / .1)); redEyes(g, x, y - 6.48 * s + 5.0 * s + .02 * s, s, op, 1, .2); });
  });
  g.restore();
  // presenter back, foreground left
  const s = 250; g.save(); g.translate(320 + nz(t * 3, 9) * 3, 1400); silo(g, backShape(s, 0, 1.05), { rim: '#ff7aa8', blur: 22, dx: 4, dy: -3, ra: .8 }); scarfB(g, s, t); g.restore();
  captionPill(g, t, Q(58.35), '全场都在等你开口', 990);
}
function shot4C(g, t) {
  const hot = sstep(Q(59), Q(61.8), t); neuralBG(g, t, hot, .9);
  const alive = DIE4.T.filter(x => x > t).length;
  // header
  txt(g, '脑内词库', 960, 168, 58, '#ffffff', 900, 'center');
  const blink = Math.floor(t * 4) % 2; txt(g, alive > 1 ? '正在检索可用表达' + '…'.repeat(1 + Math.floor(t * 6) % 3) : '检索失败', 960, 206, 26, alive > 1 ? 'rgba(160,190,255,.8)' : '#ff4d6d', 700, 'center', blink || alive > 1 ? 1 : .5);
  // cursor target
  let ni = DIE4.ord.findIndex(w => DIE4.T[w] > t), cur = null;
  if (ni >= 0) { const tgt = DIE4.ord[ni], pv = ni > 0 ? DIE4.ord[ni - 1] : null, a = TL(tgt), c1 = [a[0] + 105, a[1] + 60];
    const t0 = ni > 0 ? DIE4.T[pv] : Q(59), t1 = DIE4.T[tgt] - Math.min(.05, (DIE4.T[tgt] - t0) * .3), c0 = pv != null ? [TL(pv)[0] + 105, TL(pv)[1] + 60] : [960, 560];
    const k = E.ioC(inv(t0, t1, t)); cur = { x: lerp(c0[0], c1[0], k), y: lerp(c0[1], c1[1], k), tgt, k }; }
  for (let i = 0; i < 24; i++) {
    const [x, y, w, h] = TL(i), d = t - DIE4.T[i], hero = i === HERO4, cx = x + w / 2, cy = y + h / 2;
    if (d < 0) { // alive
      const tg = cur && cur.tgt === i && cur.k > .8, trem = hero && t > Q(61.5) ? 6 * inv(Q(61.5), Q(61.85), t) : 0, fl = Math.sin(t * 2 + i) * 3;
      g.save(); g.translate(cx + nz(t * 40, i) * trem, cy + fl + nz(t * 37, i + 9) * trem); const sc = tg ? 1.05 : 1; g.scale(sc, sc);
      g.shadowColor = hero ? 'rgba(255,211,74,.8)' : 'rgba(127,244,255,.55)'; g.shadowBlur = tg ? 30 : 16;
      fillRR(g, -w / 2, -h / 2, w, h, 18, hero ? 'rgba(70,46,8,.95)' : 'rgba(16,26,76,.9)', hero ? '#ffd34a' : 'rgba(127,244,255,.85)', hero ? 4 : 2.5); g.shadowBlur = 0;
      txt(g, WORDS[i], 0, 15, chars(WORDS[i]).length > 3 ? 38 : 44, hero ? '#ffe9a6' : '#eaf6ff', 900, 'center'); g.restore();
    } else if (!hero) {
      g.save(); g.setLineDash([10, 8]); g.strokeStyle = 'rgba(150,160,220,.16)'; g.lineWidth = 2; rr(g, x + 6, y + 6, w - 12, h - 12, 16); g.stroke(); g.restore();
      if (d < .42) { const on = d < .12 ? (Math.floor(d * 70) % 2) : 1, fk = clamp((d - .1) / .3);
        g.save(); g.globalAlpha = on * (1 - E.inC(fk)); g.translate(cx, cy + 34 * E.inC(fk)); g.rotate((hsh(i) - .5) * .25 * fk);
        fillRR(g, -w / 2, -h / 2, w, h, 18, mixHex('#5a1020', '#1a1a26', fk), '#ff2d55', 2.5);
        g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-w * .3, -h / 2); g.lineTo(-w * .05, -h * .05); g.lineTo(-w * .18, h * .2); g.lineTo(w * .08, h / 2); g.stroke();
        txt(g, WORDS[i], 0, 15, chars(WORDS[i]).length > 3 ? 38 : 44, mixHex('#ff8fa3', '#555a70', fk), 900, 'center'); g.restore();
        const r = rng(i * 13 + 5); g.save(); g.globalCompositeOperation = 'lighter'; for (let p = 0; p < 12; p++) { const an = r() * TAU, v = 160 + r() * 260, px = cx + Math.cos(an) * v * d, py = cy + Math.sin(an) * v * d + 600 * d * d, a = 1 - d / .42;
          g.fillStyle = p % 3 ? `rgba(255,60,90,${a})` : `rgba(255,230,240,${a})`; g.fillRect(px - 2.5, py - 2.5, 5, 5); } g.restore(); }
    } else { // hero shatter
      g.save(); g.setLineDash([10, 8]); g.strokeStyle = 'rgba(255,211,74,.22)'; g.lineWidth = 2; rr(g, x + 6, y + 6, w - 12, h - 12, 16); g.stroke(); g.restore();
      if (d < .6) { const r = rng(77); for (let a = 0; a < 4; a++) for (let b = 0; b < 3; b++) { const pw = 55, ph = 43, sx = 5 + a * 52.5, sy = 5 + b * 40, ox = sx + pw / 2 - 110, oy = sy + ph / 2 - 65, an = Math.atan2(oy, ox) + (r() - .5) * .8, v = 300 + r() * 500;
        g.save(); g.globalAlpha = 1 - d / .6; g.translate(cx + ox + Math.cos(an) * v * d, cy + oy + Math.sin(an) * v * d + 900 * d * d); g.rotate((r() - .5) * 8 * d); g.drawImage(HEROC, sx, sy, pw, ph, -pw / 2, -ph / 2, pw, ph); g.restore(); }
        glowDot(g, cx, cy, 260 * (1 - d / .6), 'rgba(255,211,74,1)', .6 * (1 - d / .6)); }
    }
  }
  // retrieval cursor
  if (cur) { const a = TL(cur.tgt), hero = cur.tgt === HERO4; g.save(); g.strokeStyle = hero ? '#ffd34a' : '#ffffff'; g.shadowColor = g.strokeStyle; g.shadowBlur = 16; g.lineWidth = 4;
    const bw = lerp(150, a[2] + 26, cur.k), bh = lerp(110, a[3] + 26, cur.k), L = 26; const x0 = cur.x - bw / 2, y0 = cur.y - bh / 2;
    [[x0, y0, 1, 1], [x0 + bw, y0, -1, 1], [x0, y0 + bh, 1, -1], [x0 + bw, y0 + bh, -1, -1]].forEach(([px, py, sx, sy]) => { g.beginPath(); g.moveTo(px + sx * L, py); g.lineTo(px, py); g.lineTo(px, py + sy * L); g.stroke(); });
    g.restore(); }
  // counter
  const lastD = DIE4.T.reduce((a, x) => t >= x ? Math.max(a, x) : a, -9), ck = 1 + .25 * pulse(t, lastD, 14), low = alive <= 6;
  g.save(); g.translate(960, 905); g.scale(ck, ck); const s1 = '可用词汇 ', s2 = alive + ' / 24', w1 = tw(g, s1, 48), w2 = tw(g, s2, 64), x0 = -(w1 + w2) / 2;
  fillRR(g, x0 - 36, -58, w1 + w2 + 72, 92, 46, 'rgba(6,6,20,.8)', low ? 'rgba(255,45,85,.8)' : 'rgba(127,244,255,.4)', 2);
  txt(g, s1, x0, 8, 48, '#cfd8ff', 900); g.shadowColor = low ? '#ff2d55' : '#7ff4ff'; g.shadowBlur = 18; txt(g, s2, x0 + w1, 12, 64, low ? '#ff4d6d' : '#ffffff', 900); g.restore();
  // pre-cut: red fade
  if (t > Q(61.85)) { g.fillStyle = `rgba(30,0,8,${.5 * inv(Q(61.85), Q(62), t)})`; g.fillRect(0, 0, W, H); }
}
function subtitle4(g, str, x, y, size, a = 1) {
  if (!str || a <= 0) return; g.save(); g.globalAlpha = a; g.font = F(900, size); g.textAlign = 'center'; g.lineJoin = 'round';
  g.strokeStyle = 'rgba(0,0,0,.9)'; g.lineWidth = size * .2; g.strokeText(str, x, y); g.fillStyle = '#ffffff'; g.fillText(str, x, y); g.restore();
}
function shot4D(g, t) {
  const frz = t >= FRZ4, ph = (t - FRZ4) % .36, tt = frz ? FRZ4 - .03 + (ph < .1 ? ph * .5 : 0) : t, u = tt - Q(62);
  g.fillStyle = '#05050f'; g.fillRect(0, 0, W, H);
  const z = lerp(1.0, 1.1, E.ioS(clamp(u / 1.1)));
  g.save(); g.translate(820, 560); g.scale(z, z); g.translate(-820, -560);
  // background: dim screen with core conclusions
  g.save(); g.filter = 'blur(5px)'; screen4(g, tt, 1060, 70, 820, 457, { fix: 3, dim: .45, glow: 'rgba(140,190,255,.4)' }); g.restore();
  g.fillStyle = linear(g, 0, 640, 0, H, [[0, 'rgba(5,5,15,0)'], [1, 'rgba(5,5,15,.9)']]); g.fillRect(0, 600, W, 480);
  // spotlight
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linear(g, 820, 0, 820, 900, [[0, 'rgba(200,220,255,.20)'], [1, 'rgba(200,220,255,0)']]);
  poly(g, [[700, -20], [940, -20], [1180, 1080], [460, 1080]]); g.fill(); g.fillStyle = radial(g, 820, 560, 420, [[0, 'rgba(170,190,255,.22)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(300, 100, 1040, 980); g.restore();
  // protagonist
  const s = 150, hx = nz(tt * 13, 3) * 2.5, hy = nz(tt * 11, 6) * 1.5;
  g.save(); g.translate(820 + hx, 1540 + hy); silo(g, standShape(s, { arm: .25 }), { rim: '#d8ecff', blur: 22, dx: 0, dy: -4 }); scarfF(g, s, tt);
  // sweat
  if (u > .25) { const dk = clamp((u - .25) / .2), dy = 70 * clamp((u - .35) / .9); g.save(); g.globalAlpha = dk; g.translate(-.42 * s, -6.7 * s + dy); g.scale(1.8, 1.8); g.fillStyle = '#7fd8ff'; g.shadowColor = '#7fd8ff'; g.shadowBlur = 10; g.beginPath(); g.moveTo(0, -22); g.quadraticCurveTo(14, 0, 0, 10); g.quadraticCurveTo(-14, 0, 0, -22); g.fill(); g.restore(); }
  g.restore();
  // mic + stand (in front of chin)
  g.save(); g.lineCap = 'round'; g.strokeStyle = '#1b1e38'; g.lineWidth = 14; g.beginPath(); g.moveTo(870, 1100); g.lineTo(862, 790); g.quadraticCurveTo(858, 720, 838, 690); g.stroke();
  g.strokeStyle = 'rgba(190,220,255,.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(864, 1100); g.lineTo(856, 790); g.quadraticCurveTo(852, 722, 832, 692); g.stroke();
  g.translate(830 + hx, 662 + hy); g.rotate(.35); fillRR(g, -15, 0, 30, 46, 8, '#2a2f52', 'rgba(200,220,255,.35)', 1.5);
  g.shadowColor = 'rgba(180,210,255,.6)'; g.shadowBlur = 14; g.fillStyle = linear(g, -26, -50, 26, 0, [[0, '#6a7299'], [1, '#22263f']]); g.beginPath(); g.ellipse(0, -18, 26, 30, 0, 0, TAU); g.fill(); g.shadowBlur = 0;
  g.strokeStyle = 'rgba(220,235,255,.5)'; g.lineWidth = 1.5; g.save(); g.beginPath(); g.ellipse(0, -18, 26, 30, 0, 0, TAU); g.clip(); for (let k = -4; k <= 4; k++) { g.beginPath(); g.moveTo(k * 6.5, -50); g.lineTo(k * 6.5, 14); g.stroke(); g.beginPath(); g.moveTo(-30, -18 + k * 7); g.lineTo(30, -18 + k * 7); g.stroke(); } g.restore();
  g.strokeStyle = 'rgba(220,235,255,.75)'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(0, -18, 26, 30, 0, 0, TAU); g.stroke();
  g.restore();
  g.restore();
  // foreground audience (blurred)
  audBacks(g, tt, 1330, 110, [130, 1240, 1640], '#7f9cff', 6);
  // mic level meter: flatline
  g.save(); g.translate(120, 880); fillRR(g, 0, 0, 330, 84, 14, 'rgba(6,6,20,.72)', 'rgba(127,244,255,.3)', 1.5); txt(g, 'MIC', 22, 52, 26, '#7ff4ff', 900);
  for (let k = 0; k < 14; k++) { const lv = u < .05 ? 0 : (k < 1 ? .15 + .1 * Math.abs(nz(tt * 20, k)) : 0) + (tt > Q(62.05) && tt < Q(62.5) && k < 3 ? .3 * Math.abs(nz(tt * 30, k)) : 0) + (tt > Q(62.6) && tt < Q(62.95) && k < 4 ? .35 * Math.abs(nz(tt * 30, k + 4)) : 0); const hh = 8 + 50 * lv;
    g.fillStyle = lv > .05 ? '#7ff4ff' : 'rgba(127,244,255,.2)'; g.fillRect(90 + k * 16, 42 - hh / 2, 10, hh); } g.restore();
  // subtitle
  const s1 = typed('嗯……', inv(Q(62.05), Q(62.05) + .22, tt)), s2 = typed('那个……', inv(Q(62.6), Q(62.6) + .22, tt));
  subtitle4(g, s1 + s2, 960, 1000, 66);
  if (frz) { // buffering freeze
    const fk = clamp((t - FRZ4) / .12); g.fillStyle = `rgba(4,4,12,${.4 * fk})`; g.fillRect(0, 0, W, H);
    if (ph < .1) sliceGlitch(g, t, .55, Math.floor((t - FRZ4) / .36) + 40);
    g.save(); g.globalAlpha = fk; g.translate(960, 520); fillRR(g, -90, -90, 180, 180, 40, 'rgba(6,6,18,.6)');
    for (let k = 0; k < 12; k++) { const an = k / 12 * TAU, on = ((Math.floor(t * 16) - k) % 12 + 12) % 12; g.fillStyle = `rgba(255,255,255,${clamp(1 - on / 9)})`; g.beginPath(); g.arc(Math.cos(an) * 52, Math.sin(an) * 52, 8, 0, TAU); g.fill(); }
    txt(g, '缓冲中…', 0, 140, 34, '#ffffff', 900, 'center'); g.restore(); }
}
function bloomCase4(t) { if (t >= Q(56) && t < Q(58)) return .32; if (t >= Q(58) && t < Q(59)) return .3; if (t >= Q(59) && t < Q(62)) return .34; if (t >= Q(62)) return .26; return 0; }
SHAKES.push([Q(56), 6, .3], [Q(58), 26, .5], [Q(58.35), 6, .25], [Q(59), 10, .35], [Q(61.85), 30, .55], [Q(62), 12, .4], [FRZ4, 18, .35]);
DIE4.ord.slice(0, 8).forEach(w => SHAKES.push([DIE4.T[w], 5, .14]));
FLASHES.push([Q(58), .3, .2], [Q(61.85), .4, .25], [FRZ4, .12, .1]);
CHROMA.push([Q(56), 10, .35], [Q(57), 5, .2], [Q(58), 18, .5], [Q(59), 10, .35], [Q(61.85), 20, .5], [Q(62), 12, .4], [FRZ4, 14, .4]);
