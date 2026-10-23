// ================= CASE 02 · 领导站你身后 (Q40 → Q48) =================
const SCR = { x: 560, y: 110, w: 960, h: 570 };
const DOC = ['本周工作总结', '1. 完成客户 A 方案初稿，已发送确认；', '2. 复盘上线数据，转化率提升 12%；', '3. 下周计划：推进推进客护 B 的的方安'];
const SQUIG = [[8, 12], [12, 14], [17, 19], [19, 21]];
const T2 = Q(40), TL2 = T2 + .1, TL3 = TL2 + 19 / 26;
let OFFICE = null, OFFICE_W = null;
function build2() {
  OFFICE = (() => { const c = mk(W, H), g = c.getContext('2d');
    g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#0b0f2a'], [.62, '#131a3e'], [.64, '#0a0c1e'], [1, '#05060f']]); g.fillRect(0, 0, W, H);
    const r = rng(2024); g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 70; i++) { const x = r() * W, y = 40 + r() * 600, rad = 18 + r() * 60, col = [CYN, '#ff5ad8', '#ffc46b', '#8f86ff', '#ff6a5a'][Math.floor(r() * 5)]; g.globalAlpha = .1 + r() * .16; g.fillStyle = radial(g, x, y, rad, [[0, col], [.7, col], [1, 'rgba(0,0,0,0)']]); g.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    g.restore();
    g.fillStyle = 'rgba(20,26,60,.9)'; for (const x of [0, 480, 960, 1440, 1920]) g.fillRect(x - 10, 0, 20, 690);
    g.fillRect(0, 300, W, 10);
    g.fillStyle = linear(g, 0, 690, 0, H, [[0, '#1a1f44'], [1, '#07081a']]); g.fillRect(0, 690, W, H - 690);
    g.fillStyle = 'rgba(160,190,255,.25)'; g.fillRect(0, 690, W, 2);
    g.fillStyle = radial(g, 1040, 700, 700, [[0, 'rgba(180,200,255,.14)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 600, W, 480);
    return c; })();
}
function l3n(t) {
  if (t < TL3) return 0; if (t < Q(42)) return Math.min(7, (t - TL3) * 26);
  if (t < Q(44.5)) return 7 + 14 * clamp((t - Q(42) - .04) / .62);
  return 21 - 17 * E.ioS(clamp((t - Q(44.5) - .05) / .5));
}
function speedAt(t) { if (t < Q(42)) return 96; if (t < Q(44.5)) return Math.round(lerp(96, 23, E.outC(inv(Q(42), Q(43), t)))); return 19; }
function drawDoc(g, t) {
  const { x, y, w, h } = SCR; g.save(); rr(g, x, y, w, h, 6); g.clip();
  g.fillStyle = '#c9cede'; g.fillRect(x, y, w, h);
  g.fillStyle = '#26345e'; g.fillRect(x, y, w, 40); [0, 1, 2].forEach(i => { g.fillStyle = ['#ff5f57', '#febc2e', '#28c840'][i]; g.beginPath(); g.arc(x + 22 + i * 22, y + 20, 7, 0, TAU); g.fill(); });
  txt(g, '周报_终版_改3.docx', x + w / 2, y + 28, 21, '#e8eeff', 700, 'center');
  g.fillStyle = '#e9ecf5'; g.fillRect(x, y + 40, w, 46); for (let i = 0; i < 11; i++) { g.fillStyle = 'rgba(60,70,110,.28)'; rr(g, x + 18 + i * 44, y + 50, 30, 26, 6); g.fill(); }
  const sp = speedAt(t), bad = sp < 60, chip = `打字速度 ${sp} 字/分`; const cw = tw(g, chip, 20, 900) + 34;
  fillRR(g, x + w - cw - 16, y + 48, cw, 30, 15, bad ? '#e0243f' : '#1f9d6b'); txt(g, chip, x + w - 16 - cw / 2, y + 70, 20, '#fff', 900, 'center');
  g.fillStyle = '#f6f7fb'; g.shadowColor = 'rgba(0,0,0,.25)'; g.shadowBlur = 12; g.fillRect(x + 80, y + 104, w - 160, h); g.shadowBlur = 0;
  const lx = x + 140, ly = [y + 170, y + 240, y + 296, y + 352];
  txt(g, DOC[0], lx, ly[0], 40, '#14172c', 900);
  txt(g, DOC[1], lx, ly[1], 30, '#20243c', 700);
  const n2 = t < TL2 ? 0 : Math.min(19, (t - TL2) * 26); txt(g, typedN(DOC[2], n2), lx, ly[2], 30, '#20243c', 700);
  const n3 = l3n(t), s3 = typedN(DOC[3], n3); txt(g, s3, lx, ly[3], 30, '#20243c', 700);
  g.font = F(700, 30); const cs = chars(DOC[3]), px = i => lx + g.measureText(cs.slice(0, i).join('')).width;
  for (const [a, b] of SQUIG) { if (n3 < b + .6 || t > Q(44.5) && n3 < b) continue; const x0 = px(a), x1 = px(b); g.strokeStyle = '#e0243f'; g.lineWidth = 2.6; g.beginPath(); for (let xx = x0; xx <= x1; xx += 2) { const yy = ly[3] + 9 + Math.sin(xx * .55) * 3; xx === x0 ? g.moveTo(xx, yy) : g.lineTo(xx, yy); } g.stroke(); }
  const cl = n2 < 19 ? [lx + tw(g, typedN(DOC[2], n2), 30, 700), ly[2]] : [lx + tw(g, s3, 30, 700), ly[3]];
  if (Math.floor(t * 3.6) % 2 === 0 || (t > TL2 && t < TL3 + .3) || (t > Q(42) && t < Q(42.9))) { g.fillStyle = '#2a5cff'; g.fillRect(cl[0] + 3, cl[1] - 28, 3, 36); }
  g.restore();
  return { lx, ly, cl };
}
function drawMonitor(g, t) {
  fillRR(g, SCR.x - 22, SCR.y - 22, SCR.w + 44, SCR.h + 44, 14, '#0c0e1e', 'rgba(127,244,255,.35)', 2);
  g.fillStyle = '#0c0e1e'; g.fillRect(1010, SCR.y + SCR.h + 22, 60, 70); g.beginPath(); g.ellipse(1040, SCR.y + SCR.h + 96, 170, 18, 0, 0, TAU); g.fill();
  const d = drawDoc(g, t);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 1040, 400, 900, [[0, 'rgba(150,180,255,.10)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H); g.restore();
  return d;
}
function speedHUD(g, t, a) {
  if (a <= 0) return; const sp = speedAt(t), bad = sp < 60, col = bad ? '#ff2d55' : '#38e0a0'; g.save(); g.globalAlpha = a; g.translate(1690, 262);
  fillRR(g, -200, -120, 400, 240, 20, 'rgba(10,6,22,.82)', col, 3);
  txt(g, '打字速度', -170, -66, 30, 'rgba(230,236,255,.85)', 900); txt(g, '字/分', 170, 86, 26, 'rgba(230,236,255,.7)', 700, 'right');
  g.shadowColor = col; g.shadowBlur = 20; txt(g, String(sp), 40, 82, 120, col, 900, 'right');
  if (bad) { g.fillStyle = col; poly(g, [[110, -10], [160, -10], [135, 30]]); g.fill(); g.fillRect(126, -60, 18, 52); }
  g.restore();
}
function bossShade(g, a) { g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = a; g.fillStyle = linear(g, W, 0, 300, 0, [[0, '#24102c'], [.55, '#6a5a90'], [1, '#ffffff']]); g.fillRect(0, 0, W, H); g.restore(); }
function bossIn(t) { return E.outC(inv(Q(41), Q(41) + .45, t)); }
function shot2A(g, t) {
  g.drawImage(OFFICE, 0, 0); const z = lerp(1, 1.05, E.ioS(inv(T2, Q(42), t)));
  g.save(); g.translate(960, 500); g.scale(z, z); g.translate(-960, -500);
  drawMonitor(g, t);
  // keyboard glow on desk
  g.save(); g.translate(1040, 870); g.transform(1, 0, -.3, .4, 0, 0); fillRR(g, -470, -150, 940, 300, 22, '#0b0d22', 'rgba(127,244,255,.4)', 2);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { const on = hsh(c * 7 + r * 31 + Math.floor(t * 18)) > .84 && t < Q(41.45); fillRR(g, -448 + c * 64, -128 + r * 64, 56, 56, 9, on ? 'rgba(140,250,255,.85)' : 'rgba(34,40,88,.95)'); } g.restore();
  // boss shadow over the monitor
  const bk = bossIn(t); if (bk > 0) { g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = .75 * bk; g.fillStyle = linear(g, 1700, 0, 700, 0, [[0, '#1a0a20'], [.6, '#5a4a80'], [1, '#ffffff']]); g.fillRect(0, 0, W, H); g.restore(); }
  // protagonist over-shoulder
  g.save(); g.translate(360, 1185); const s = 210, frz = t > Q(41.2) ? 1 : 0; g.rotate(-.04 + .01 * Math.sin(t * 2) * (1 - frz)); silo(g, backShape(s, .1, 1.05, frz ? 6 : nz(t * 4, 2) * 5), { rim: '#a6f9ff', blur: 22, dx: 3, dy: -3 }); scarfB(g, s, t); g.restore();
  // boss
  if (bk > 0) { const bx = lerp(2200, 1660, bk), s2 = 150; g.save(); g.translate(bx, 1250); silo(g, standShape(s2), { rim: '#ff6a8a', blur: 26, dx: -4, dy: -2, ra: .85 });
    redEyes(g, -12, -6.48 * s2, s2, E.outB(clamp((t - Q(41.15)) / .16)), 1, .22); g.restore(); }
  g.restore();
  bubble(g, 1390, 330, '没事，我就看看。', 40, popK(t, Q(41.5)), 1600, 300);
}
function shot2B(g, t) {
  g.drawImage(OFFICE, 0, 0); const u = t - Q(42), zk = E.outE(clamp(u / .18)), z = lerp(1.05, 2.0, zk) * (1 + .03 * pulse(t, Q(42), 8));
  g.save(); viewTo(g, [lerp(960, 990, zk), lerp(500, 440, zk)], [lerp(960, 1010, zk), lerp(500, 600, zk)], z);
  const d = drawMonitor(g, t);
  g.restore(); bossShade(g, .85); speedHUD(g, t, clamp(u / .15));
  // red eyes reflected on the glass
  g.save(); g.globalCompositeOperation = 'lighter'; for (const ex of [1500, 1590]) glowDot(g, ex + nz(t * 3, 1) * 6, 250, 70, 'rgba(255,40,70,1)', .28); g.restore();
}
// ---- keyboard macro: Backspace abuse ----
const KROWS = [['8', '9', '0', '-', '=', ['Backspace', 2.1]], ['I', 'O', 'P', '[', ']', ['\\', 1.4]], ['K', 'L', ';', '\'', ['Enter', 2.3]], [',', '.', '/', ['Shift', 2.8]]];
const BS_T = [0, 1, 2, 3, 4, 5].map(i => Q(43) + i * BEAT / 4);
function shot2C(g, t) {
  const u = t - Q(43), np = BS_T.filter(x => t >= x).length, heat = clamp(np / 6 + .1 * inv(BS_T[5], Q(44.5), t));
  g.fillStyle = radial(g, 960, 600, 1200, [[0, mixHex('#141838', '#3a0c14', heat)], [1, '#04040c']]); g.fillRect(0, 0, W, H);
  const lp = BS_T.reduce((a, x) => t >= x ? x : a, -9), pk = t - lp < .07 ? E.outC((t - lp) / .07) : Math.max(0, 1 - (t - lp - .07) / .06);
  const z = 2.0 + .06 * pulse(t, lp, 9) + .12 * E.ioS(clamp(u / 1.5));
  g.save(); g.translate(960, 600); g.scale(z, z); g.transform(1, 0, -.42, .6, 0, 0); g.translate(-640, -40);
  let bsC = null;
  KROWS.forEach((row, ri) => { let x = ri * 30; row.forEach(k => { const lab = typeof k === 'string' ? k : k[0], kw = (typeof k === 'string' ? 1 : k[1]) * 100 - 12, y = ri * 100; const isBS = lab === 'Backspace';
    const press = isBS ? pk : 0; const col = isBS ? mixHex('#1a1f44', '#ff2d3a', heat) : '#151a38';
    g.fillStyle = '#06070f'; rr(g, x, y + 14, kw, 86, 14); g.fill();
    fillRR(g, x, y + press * 12, kw, 82, 14, col, isBS ? `rgba(255,${Math.round(lerp(240, 90, heat))},${Math.round(lerp(255, 90, heat))},.9)` : 'rgba(127,244,255,.35)', isBS ? 3 : 1.5);
    txt(g, lab, x + 16, y + press * 12 + 34, isBS ? 26 : 26, isBS ? '#ffffff' : 'rgba(220,235,255,.7)', 900);
    if (isBS) { g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + kw - 30, y + press * 12 + 56); g.lineTo(x + kw - 80, y + press * 12 + 56); g.moveTo(x + kw - 66, y + press * 12 + 44); g.lineTo(x + kw - 80, y + press * 12 + 56); g.lineTo(x + kw - 66, y + press * 12 + 68); g.stroke(); bsC = [x + kw / 2, y + 40, kw]; }
    x += kw + 12; }); });
  g.restore();
  // map backspace center to screen (approx through same transform)
  const kx = 960 + z * ((bsC[0] - 640) + -.42 * (bsC[1] - 40)), ky = 600 + z * .6 * (bsC[1] - 40);
  if (heat > .3) { g.save(); g.globalCompositeOperation = 'lighter'; glowDot(g, kx, ky, 300 * heat, 'rgba(255,60,40,1)', .55 * heat); g.restore(); }
  // impact rings
  for (const bt0 of BS_T) { const v = t - bt0; if (v < 0 || v > .22) continue; g.save(); g.strokeStyle = `rgba(255,220,200,${1 - v / .22})`; g.lineWidth = 6; g.beginPath(); g.ellipse(kx, ky, 120 + v * 1400, (120 + v * 1400) * .45, 0, 0, TAU); g.stroke(); g.restore(); }
  // finger
  const fy = ky - 60 - 260 * (1 - pk) - 80 * (t < BS_T[0]); g.save(); g.translate(kx + 40, fy); g.rotate(-.5);
  silo(g, gg => { gg.beginPath(); rr(gg, -44, -250, 88, 290, 44); gg.fill(); gg.beginPath(); rr(gg, -70, -430, 300, 230, 90); gg.fill();
    for (let i = 0; i < 3; i++) { gg.beginPath(); rr(gg, 40 + i * 62, -260, 66, 120, 33); gg.fill(); } gg.beginPath(); rr(gg, 0, -900, 230, 520, 80); gg.fill(); }, { rim: '#ffb0a0', blur: 18, dx: -3, dy: 2 }); g.restore();
  // smoke
  if (t > Q(43.35)) { const r = rng(7); g.save(); for (let i = 0; i < 26; i++) { const st = Q(43.35) + r() * 1.0, v = t - st; if (v < 0) continue; const life = 1.2; if (v > life) continue;
    const x = kx + (r() - .5) * 140 + Math.sin(v * 3 + i) * 40 * v, y = ky - 40 - v * (260 + r() * 200), rad = 30 + v * 110; g.globalAlpha = .28 * (1 - v / life) * clamp(v / .1); g.fillStyle = radial(g, x, y, rad, [[0, 'rgba(200,200,215,1)'], [1, 'rgba(200,200,215,0)']]); g.fillRect(x - rad, y - rad, rad * 2, rad * 2); } g.restore(); }
  // counter
  const cnt = np === 0 ? 0 : Math.max(np, Math.round(58 * E.outC(inv(BS_T[0], Q(44.3), t))));
  g.save(); g.translate(1530, 260); const ck = 1 + .25 * pulse(t, lp, 10); g.scale(ck, ck); g.shadowColor = '#ff2d55'; g.shadowBlur = 24; txt(g, '退格键', 0, -64, 40, '#ffd0d8', 900, 'center'); txt(g, '×' + cnt, 0, 50, 120, '#ffffff', 900, 'center'); g.restore();
}
function shot2E(g, t) {
  g.drawImage(OFFICE, 0, 0); const u = t - Q(44.5), z = lerp(1.6, 1.8, E.ioS(clamp(u / 1.5)));
  g.save(); viewTo(g, [900, 440], [1000, 600], z);
  drawMonitor(g, t);
  g.restore(); bossShade(g, .85); speedHUD(g, t, 1);
  if (t > Q(45)) { g.save(); g.globalAlpha = clamp((t - Q(45)) / .1) * .55; g.fillStyle = '#0a0410'; g.fillRect(0, 0, W, H); g.restore(); }
  stamp(g, t, Q(45), 1000, 620, '打字速度：-80%', '#ff2d55', 96, -.1);
}
function shot2D(g, t) {
  const u = t - Q(46);
  g.drawImage(OFFICE, 0, 0); g.fillStyle = 'rgba(4,4,14,.55)'; g.fillRect(0, 0, W, H);
  const z = lerp(1.0, 1.06, E.ioS(clamp(u / 2)));
  g.save(); g.translate(960, 700); g.scale(z, z); g.translate(-960, -700);
  // small desk + monitor + protagonist (lower-left)
  fillRR(g, 250, 820, 560, 40, 8, '#1a1f44', 'rgba(127,244,255,.3)', 1.5); g.fillStyle = '#0d1030'; g.fillRect(290, 860, 26, 220); g.fillRect(744, 860, 26, 220);
  fillRR(g, 400, 640, 300, 180, 8, '#0c0e1e', 'rgba(127,244,255,.4)', 2); fillRR(g, 412, 652, 276, 156, 4, '#cfd5e6'); g.fillStyle = '#26345e'; g.fillRect(412, 652, 276, 16);
  g.fillStyle = '#20243c'; [[440, 700, 140], [440, 730, 200], [440, 760, 30]].forEach(([x, y, w]) => g.fillRect(x, y, w, 7)); if (Math.floor(t * 3.6) % 2 === 0) { g.fillStyle = '#2a5cff'; g.fillRect(474, 752, 3, 16); }
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 550, 720, 420, [[0, 'rgba(150,180,255,.22)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(100, 300, 900, 780); g.restore();
  const shr = 1 - .22 * E.outB(clamp((t - Q(47.25)) / .3)), s = 62;
  g.save(); g.translate(560, 960); g.scale(shr, shr); silo(g, backShape(s, .2, 1), { rim: '#a6f9ff', blur: 16 }); scarfB(g, s, t);
  if (t > Q(47.25)) { const dk = clamp((t - Q(47.25)) / .2), dy = 30 * clamp((t - Q(47.4)) / .6); g.save(); g.globalAlpha = dk; g.translate(48, backHeadY(s, .2) - 20 + dy); g.scale(2, 2); g.fillStyle = '#7fd8ff'; g.shadowColor = '#7fd8ff'; g.shadowBlur = 10; g.beginPath(); g.moveTo(0, -22); g.quadraticCurveTo(14, 0, 0, 10); g.quadraticCurveTo(-14, 0, 0, -22); g.fill(); g.restore(); }
  g.restore();
  // giant boss
  const s2 = 156, bx = 1290 + 10 * Math.sin(t * .8); g.save(); g.translate(bx, 1180);
  silo(g, standShape(s2, { arm: .55 }), { rim: '#ff6a8a', blur: 30, dx: -5, dy: -2, ra: .9 });
  // coffee mug
  g.save(); g.translate(-.15 * s2 - 60, -4.75 * s2); fillRR(g, -40, -54, 80, 96, 10, '#e9ecf5'); g.strokeStyle = '#e9ecf5'; g.lineWidth = 10; g.beginPath(); g.arc(-44, -6, 22, Math.PI * .5, Math.PI * 1.5); g.stroke(); txt(g, 'BOSS', 0, 4, 22, '#c0122e', 900, 'center');
  g.strokeStyle = 'rgba(220,230,255,.35)'; g.lineWidth = 4; for (let i = 0; i < 3; i++) { g.beginPath(); for (let k = 0; k <= 12; k++) { const yy = -64 - k * 9, xx = -20 + i * 20 + Math.sin(k * .7 + t * 4 + i) * 7; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.restore();
  redEyes(g, -14, -6.48 * s2, s2, E.outB(clamp((t - Q(46.5)) / .18)), 1, .22);
  g.restore();
  g.restore();
  bubble(g, 890, 170, '嗯？怎么不打了？', 54, popK(t, Q(47)), 1150, 200);
}
function bloomCase2(t) { if (t >= Q(42) && t < Q(43)) return .22; if (t >= Q(44.5) && t < Q(46)) return .22; if (t >= Q(40) && t < Q(42)) return .35; return 0; }
SHAKES.push([Q(41), 8, .35], [Q(41.5), 4, .25], [Q(42), 20, .45], [Q(45), 16, .4], [Q(46), 6, .3], [Q(46.5), 6, .3], [Q(47), 8, .3], [Q(47.25), 5, .25]); BS_T.forEach((x, i) => SHAKES.push([x, 12 + i * 2, .2]));
FLASHES.push([Q(42), .24, .18], [Q(45), .12, .12]);
CHROMA.push([Q(41), 6, .3], [Q(42), 14, .45], [Q(43), 8, .3], [Q(44.5), 8, .3], [Q(45), 10, .35], [Q(46), 8, .3], [Q(47.75), 12, .3]);
