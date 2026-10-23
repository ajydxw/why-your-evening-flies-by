// ================= ④-3 老友群 · 无声孤立 (S3 – S3E) =================
const S3SEND = Q(61), S3READ = Q(61.75), S3TYPE = Q(62.15), S3STK = Q(62.6), S3FLOOD = [Q(62.95), Q(63.2), Q(63.45), Q(63.7), Q(63.95)], S3CAP = Q(63.55);
const S3MO = Q(64.5), S3CNT = Q(64.95), S3CMT = Q(65.6), S3NO = Q(66.4), S3CU = Q(67.5);
const FRIENDS = [['杰', '#e08a3c'], ['雯', '#4caf7a'], ['浩', '#8a6ad8'], ['凯', '#3f8fd8'], ['美', '#e0609a'], ['东', '#c9a23a'], ['晴', '#5cc0c9']];
function sticker(g, x, y, s) { // laughing meme sticker
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#fff1c2'; rr(g, -100, -100, 200, 200, 24); g.fill();
  g.fillStyle = radial(g, -18, -40, 90, [[0, '#ffe27a'], [1, '#f5b81c']]); g.beginPath(); g.arc(0, -18, 64, 0, TAU); g.fill();
  g.strokeStyle = '#6b3d00'; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round';
  for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 38, -44); g.lineTo(sd * 18, -34); g.lineTo(sd * 38, -24); g.stroke(); }
  g.fillStyle = '#7a1f14'; g.beginPath(); g.moveTo(-34, -6); g.quadraticCurveTo(0, 2, 34, -6); g.quadraticCurveTo(28, 34, 0, 36); g.quadraticCurveTo(-28, 34, -34, -6); g.fill();
  g.fillStyle = '#ff7a7a'; g.beginPath(); g.ellipse(0, 24, 16, 9, 0, 0, TAU); g.fill();
  g.fillStyle = '#6fc3ff'; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 52, -30); g.quadraticCurveTo(sd * 76, -6, sd * 64, 4); g.quadraticCurveTo(sd * 50, 0, sd * 52, -30); g.fill(); }
  g.fillStyle = '#6b3d00'; g.font = F(900, 40); g.textAlign = 'center'; g.fillText('哈哈哈', 0, 86); g.textAlign = 'left'; g.restore();
}
function linBubble(g, y, txt, sc) {
  if (sc <= 0) return; g.save(); g.translate(250, y); g.scale(sc, sc); g.font = F(700, 40); const w = g.measureText(txt).width + 56;
  rr(g, -w, -42, w, 84, 24); g.fillStyle = CY; g.shadowColor = 'rgba(47,216,207,.6)'; g.shadowBlur = 24; g.fill(); g.shadowBlur = 0; g.fillStyle = '#04302d'; g.fillText(txt, -w + 28, 14); g.restore();
}
function chatScreen(g, t) {
  g.fillStyle = '#141921'; g.fillRect(-290, -580, 580, 1160);
  const it = [
    { h: 105, a: .55, d: (y) => msgL(g, y, '杰', '#e08a3c', '好久没聚了啊') },
    { h: 105, a: .55, d: (y) => msgL(g, y, '雯', '#4caf7a', '想你们了😭') },
    { h: 105, a: .55, d: (y) => msgL(g, y, '浩', '#8a6ad8', '找个时间！') },
    { h: 90, d: (y) => { g.fillStyle = '#5d6676'; g.font = F(500, 26); g.textAlign = 'center'; g.fillText('今天 07:12', 0, y + 9); g.textAlign = 'left'; } },
    { h: 165, t0: S3SEND, d: (y, k) => { linBubble(g, y - 30, '今天跑了 8 公里 🏃', E.outB(k));
      const ra = inv(S3READ, S3READ + .12, t); if (ra > 0) { g.globalAlpha = ra; g.fillStyle = '#8a94a6'; g.font = F(500, 28); g.textAlign = 'right'; g.fillText('已读 7', 250, y + 52); g.textAlign = 'left'; g.globalAlpha = 1; } } },
    { h: 250, t0: S3STK, d: (y, k) => { g.save(); const s = E.outB(k); g.translate(-230, y - 85); g.scale(s, s); g.translate(230, -(y - 85)); avatar(g, -230, y - 85, 30, '浩', '#8a6ad8'); sticker(g, -75, y, 1.05); g.restore(); } },
    { h: 105, t0: S3FLOOD[0], d: (y, k) => msgL(g, y, '杰', '#e08a3c', '哈哈哈哈哈😂', 1, E.outB(k)) },
    { h: 105, t0: S3FLOOD[1], d: (y, k) => msgL(g, y, '雯', '#4caf7a', '笑死我了', 1, E.outB(k)) },
    { h: 105, t0: S3FLOOD[2], d: (y, k) => msgL(g, y, '凯', '#3f8fd8', '这图绝了', 1, E.outB(k)) },
    { h: 105, t0: S3FLOOD[3], d: (y, k) => msgL(g, y, '杰', '#e08a3c', '周六人齐了吧？', 1, E.outB(k)) },
    { h: 105, t0: S3FLOOD[4], d: (y, k) => msgL(g, y, '雯', '#4caf7a', '齐了！就等烤串🍢', 1, E.outB(k)) },
  ];
  let tot = 0; const gr = it.map(o => { const k = o.t0 === undefined ? 1 : inv(o.t0, o.t0 + .26, t); tot += o.h * E.outC(k); return k; });
  const shift = Math.max(0, -390 + tot - 410); let y = -390 - shift;
  it.forEach((o, i) => { const k = gr[i]; if (k <= 0) return; const hh = o.h * E.outC(k); if (y + hh > -470 && y < 470) { g.save(); g.globalAlpha = o.a ?? 1; o.d(y + o.h / 2, inv(0, .7, k)); g.restore(); } y += hh; });
  // typing indicator
  const ta = inv(S3TYPE, S3TYPE + .1, t) * (1 - inv(S3STK - .05, S3STK + .05, t));
  if (ta > 0) { g.save(); g.globalAlpha = ta; g.fillStyle = 'rgba(38,45,57,.95)'; rr(g, -260, 372, 250, 46, 23); g.fill(); g.fillStyle = '#9aa5b8'; g.font = F(500, 24); g.fillText('浩 正在输入', -238, 403);
    for (let j = 0; j < 3; j++) { g.globalAlpha = ta * (.35 + .65 * (.5 + .5 * Math.sin(t * 12 - j * 1.1))); g.beginPath(); g.arc(-80 + j * 18, 395, 4.5, 0, TAU); g.fill(); } g.restore(); }
  g.fillStyle = '#1b212b'; g.fillRect(-290, -580, 580, 150); g.fillStyle = '#fff'; g.font = F(900, 42); g.textAlign = 'center'; g.fillText('老友局（8）', 0, -478);
  g.fillStyle = '#8b95a7'; g.font = F(500, 40); g.textAlign = 'left'; g.fillText('‹', -260, -478);
  g.fillStyle = '#1c222c'; g.fillRect(-290, 430, 580, 150); g.fillStyle = '#262d39'; rr(g, -250, 465, 420, 70, 35); g.fill();
  g.strokeStyle = '#5d6676'; g.lineWidth = 3; g.beginPath(); g.arc(218, 500, 22, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(208, 500); g.lineTo(228, 500); g.moveTo(218, 490); g.lineTo(218, 510); g.stroke();
}
function tinyP(g, x, y, s, col, o = {}) { // chibi bust for photos (origin neck)
  g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round';
  if (o.arm) { g.strokeStyle = col; g.lineWidth = 24; g.beginPath(); g.moveTo(40, 34); g.quadraticCurveTo(78, 0, 70, -70); g.stroke(); g.fillStyle = o.skin || '#f2c8a4'; g.beginPath(); g.arc(70, -76, 13, 0, TAU); g.fill();
    g.strokeStyle = '#d9c39a'; g.lineWidth = 4; g.beginPath(); g.moveTo(66, -70); g.lineTo(84, -150); g.stroke(); for (let j = 0; j < 3; j++) { g.fillStyle = ['#a8471f', '#7b3d1c', '#c35a2b'][j]; g.beginPath(); g.ellipse(80 - j * 3.6, -140 + j * 16, 9, 7, 0, 0, TAU); g.fill(); } }
  if (o.long) { g.fillStyle = o.hair || '#1d1e26'; rr(g, -44, -70, 88, 96, 30); g.fill(); }
  g.fillStyle = col; g.beginPath(); g.moveTo(-64, 130); g.bezierCurveTo(-64, 22, -42, 2, 0, 2); g.bezierCurveTo(42, 2, 64, 22, 64, 130); g.closePath(); g.fill();
  g.fillStyle = o.skin || '#f2c8a4'; g.beginPath(); g.arc(0, -36, 38, 0, TAU); g.fill();
  g.fillStyle = o.hair || '#1d1e26'; g.beginPath(); g.arc(0, -40, 41, Math.PI * 1.03, -0.03); g.quadraticCurveTo(18, -56, -40, -40); g.fill();
  g.strokeStyle = '#2a1a10'; g.lineWidth = 4.5; for (const sd of [-1, 1]) { g.beginPath(); g.arc(sd * 14, -34, 6.5, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
  g.beginPath(); g.arc(0, -24, 13, .15 * Math.PI, .85 * Math.PI); g.stroke();
  g.fillStyle = 'rgba(255,120,120,.35)'; for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(sd * 24, -22, 7, 4, 0, 0, TAU); g.fill(); }
  g.restore();
}
const BBQ = [[62, 168, .5, 0, {}], [148, 160, .52, 3, { arm: 1 }], [236, 166, .5, 4, { long: 1, hair: '#3b2a22' }], [318, 162, .5, 5, {}], [104, 258, .6, 1, { long: 1, hair: '#2a1d16' }], [214, 262, .62, 2, { arm: 1 }], [324, 258, .6, 6, { long: 1 }]];
function bbqPhoto(g, x, y, w, h, t) { // photo local 450x340 scaled to w,h
  g.save(); g.translate(x, y); g.scale(w / 450, h / 340); rr(g, 0, 0, 450, 340, 10); g.clip();
  g.fillStyle = linear(g, 0, 0, 0, 340, [[0, '#1b2246'], [.55, '#6a3d4e'], [1, '#c06a3c']]); g.fillRect(0, 0, 450, 340);
  for (let i = 0; i < 7; i++) glowDot(g, 40 + i * 65, 46 + 18 * Math.sin(i * .9 + 1) * 0 + 14 * Math.pow((i - 3) / 3, 2), 34, 'rgba(255,200,110,.75)');
  g.strokeStyle = 'rgba(30,20,20,.7)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 40); g.quadraticCurveTo(225, 100, 450, 40); g.stroke();
  for (let i = 0; i < 9; i++) { const u = i / 8, xx = u * 450, yy = 40 + 4 * u * (1 - u) * 30; g.fillStyle = '#ffe2a0'; g.beginPath(); g.arc(xx, yy + 6, 4.5, 0, TAU); g.fill(); }
  g.save(); g.globalAlpha = .25; g.fillStyle = '#d9d4e0'; for (let i = 0; i < 4; i++) { const yy = 230 - ((t * 30 + i * 60) % 240); g.beginPath(); g.ellipse(30 + 10 * Math.sin(yy * .05 + i), yy, 20 + i * 4, 12, 0, 0, TAU); g.fill(); } g.restore();
  BBQ.forEach(([px, py, s, ci, o]) => tinyP(g, px, py, s, FRIENDS[ci][1], o));
  g.fillStyle = '#3a2418'; g.fillRect(0, 312, 450, 28); g.fillStyle = 'rgba(255,170,90,.5)'; g.fillRect(0, 312, 450, 3);
  for (let i = 0; i < 6; i++) { g.fillStyle = ['#3e7a4a', '#9a5a2a', '#c8d6e0'][i % 3]; g.fillRect(40 + i * 70, 290 - (i % 2) * 6, 12, 24 + (i % 2) * 6); }
  glowDot(g, 225, 330, 160, 'rgba(255,140,60,.35)');
  g.restore();
}
function momentsScreen(g, t) {
  g.fillStyle = '#12161d'; g.fillRect(-290, -580, 580, 1160);
  const PX = -200, PY = -300, PW = 450, PH = 340;
  avatar(g, -238, -362, 34, '杰', '#e08a3c'); g.fillStyle = '#8fb4ff'; g.font = F(900, 32); g.fillText('阿杰', -190, -372);
  g.fillStyle = '#e8edf5'; g.font = F(500, 32); g.fillText('周末烧烤，人齐了！🍖', -190, -328);
  bbqPhoto(g, PX + 10, PY, PW - 20, PH * (PW - 20) / PW, t);
  const pH = PH * (PW - 20) / PW;
  // count tags
  BBQ.forEach((b, i) => { const k = inv(S3CNT + i * .085, S3CNT + i * .085 + .18, t); if (k <= 0) return; const sx = PX + 10 + b[0] * (PW - 20) / 450, sy = PY + (b[1] - 92 * b[2] * 1.4) * pH / 340, s = E.outB(k);
    g.save(); g.translate(sx, sy); g.scale(s, s); g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.arc(0, 0, 15, 0, TAU); g.fill(); g.fillStyle = '#1a1f2a'; g.font = F(900, 20); g.textAlign = 'center'; g.fillText(String(i + 1), 0, 7); g.textAlign = 'left'; g.restore(); });
  // ghost of Lin in the gap
  const gk = inv(S3NO, S3NO + .3, t); if (gk > 0) { const gx = PX + 10 + 398 * (PW - 20) / 450, gy = PY + 164 * pH / 340, s = .5 * (PW - 20) / 450;
    g.save(); g.translate(gx, gy); g.scale(s, s); g.globalAlpha = gk * (.75 + .25 * Math.sin(t * 9)); g.setLineDash([10, 9]); g.lineDashOffset = -t * 30; g.strokeStyle = CY; g.lineWidth = 5; g.shadowColor = CY; g.shadowBlur = 14;
    g.beginPath(); g.arc(0, -36, 38, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(-64, 130); g.bezierCurveTo(-64, 22, -42, 2, 0, 2); g.bezierCurveTo(42, 2, 64, 22, 64, 130); g.stroke(); g.restore(); }
  // likes + comment
  const ly = PY + pH + 40; g.fillStyle = '#5d6676'; g.font = F(500, 24); g.fillText('1 小时前', -190, ly);
  g.fillStyle = '#1d232d'; rr(g, -190, ly + 22, 450, 70 + 100 * E.outC(inv(S3CMT, S3CMT + .3, t)), 10); g.fill();
  g.fillStyle = '#8fb4ff'; g.font = F(500, 26); g.fillText('♡ 雯，浩，凯，美，东，晴', -170, ly + 66);
  const ck = inv(S3CMT, S3CMT + .3, t);
  if (ck > 0) { g.save(); g.globalAlpha = ck; g.translate(0, 12 * (1 - E.outC(ck))); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(-180, ly + 88, 430, 1.5);
    g.font = F(700, 28); g.fillStyle = '#8fb4ff'; g.fillText('雯：', -170, ly + 130); g.fillStyle = '#e8edf5'; g.font = F(500, 28); g.fillText('林默现在是大忙人，', -112, ly + 130);
    const hk = E.ioC(inv(S3CMT + .4, S3CMT + .75, t)); g.font = F(500, 28); const hw = g.measureText('就不叫他了😂').width;
    if (hk > 0) { g.fillStyle = 'rgba(255,90,70,.38)'; g.fillRect(-114, ly + 150, hw * hk + 6, 30); }
    g.fillStyle = '#e8edf5'; g.fillText('就不叫他了😂', -112, ly + 172); g.restore(); }
  g.fillStyle = '#1b212b'; g.fillRect(-290, -580, 580, 120); g.fillStyle = '#fff'; g.font = F(900, 40); g.textAlign = 'center'; g.fillText('朋友圈', 0, -495); g.textAlign = 'left';
  g.fillStyle = '#8b95a7'; g.font = F(500, 40); g.fillText('‹', -260, -495);
}
function chatBG(g, t) {
  g.fillStyle = radial(g, 960, 540, 1100, [[0, '#121826'], [1, '#05070b']]); g.fillRect(0, 0, W, H);
  const r = rng(12); for (let i = 0; i < 14; i++) glowDot(g, r() * W + 14 * Math.sin(t * .4 + i), r() * H, 40 + r() * 90, `rgba(${r() < .5 ? '120,170,255' : '255,180,120'},${.08 + .1 * r()})`);
}
function scene3(g, t) {
  g.save();
  if (t < S3CU) {
    chatBG(g, t);
    const mv = E.ioC(inv(S3 + .05, Q(61.5), t)), zm = E.ioS(inv(S3MO, S3MO + .9, t));
    const px = lerp(960, 1270, mv), py = lerp(560, 600, mv) + zm * 80, ps = lerp(1, .97, mv) + zm * .2 + .015 * (t - S3), rot = lerp(-.035, -.018, mv) + zm * .018;
    const sw = E.ioE(inv(S3MO, S3MO + .38, t));
    phone(g, px, py, rot, ps, (pg) => {
      if (sw < 1) { pg.save(); pg.translate(-580 * sw, 0); chatScreen(pg, t); pg.restore(); }
      if (sw > 0) { pg.save(); pg.translate(580 * (1 - sw), 0); momentsScreen(pg, t); pg.restore(); }
    });
    sceneTag(g, '场景三 · 老友群', S3 + .25, S3MO, t);
    slamT(g, '已读 7，', 150, 470, 128, S3READ, t, { align: 'left', t1: S3MO, color: (i) => i === 3 ? '#ff5a4a' : '#e9eef6' });
    slamT(g, '却没人接你的话。', 150, 640, 80, S3CAP, t, { align: 'left', t1: S3MO });
    rise(g, '“人齐了”——', 150, 420, 58, Q(65.95), t, { align: 'left', color: '#aab4c4', t1: S3CU });
    slamT(g, '只是不再算上你。', 150, 570, 86, S3NO, t, { align: 'left', t1: S3CU + .1, color: (i) => i >= 2 && i <= 6 ? '#7ff3ea' : '#fff' });
  } else { // 3C Lin CU, cold phone uplight
    const u = t - S3CU, z = 1 + .05 * E.ioS(inv(0, S3E - S3CU, u)), sl = inv(Q(69.6), Q(69.6) + .25, t);
    g.fillStyle = linear(g, 0, 0, W, 0, [[0, '#06080e'], [.6, '#0b111c'], [1, '#0e1624']]); g.fillRect(0, 0, W, H);
    g.save(); cam(g, 1180, 560, z);
    g.fillStyle = '#0d1522'; rr(g, 1020, 90, 760, 560, 10); g.fill();
    const r = rng(8); for (let i = 0; i < 26; i++) glowDot(g, 1040 + r() * 720, 300 + r() * 330, 10 + r() * 40, `rgba(${r() < .6 ? '120,170,255' : '255,200,140'},${.15 + .2 * r()})`);
    g.strokeStyle = '#05080e'; g.lineWidth = 16; rr(g, 1020, 90, 760, 560, 10); g.stroke(); g.beginPath(); g.moveTo(1400, 90); g.lineTo(1400, 650); g.stroke();
    lit(g, L => {
      drawPerson(L, 1320, 790, 2.0, Object.assign({}, P_LIN, { eyes: sl > .5 ? 'half' : 'down', brow: lerp(-.45, -.75, sl), mouth: 'tight', look: [0, .6], tilt: -.03 }));
    }, L => {
      FILL(L, linear(L, 0, 200, 0, 1080, [[0, 'rgba(2,4,12,.72)'], [.42, 'rgba(6,14,30,.42)'], [.7, 'rgba(30,80,150,.16)'], [1, 'rgba(110,180,240,.14)']]));
      L.fillStyle = radial(L, 1320, 640, 380, [[0, 'rgba(160,215,255,.16)'], [1, 'rgba(160,215,255,0)']]); L.fillRect(0, 0, W, H);
    });
    glowDot(g, 1320, 1180, 620, 'rgba(90,170,255,.16)', .9 + .1 * Math.sin(t * 7));
    g.restore();
    rise(g, '你没做错什么。', 150, 420, 74, S3CU + .25, t, { align: 'left' });
    rise(g, '他们只会说：', 150, 580, 54, Q(69), t, { align: 'left', color: '#aab4c4' });
    slamT(g, '“你变了。”', 140, 760, 140, Q(69.6), t, { align: 'left', color: (i) => i === 2 || i === 3 ? '#ff6f61' : '#fff', stroke: ['#000', 10] });
  }
  g.restore();
}
// pre-send card image for row view (so the push-in crossfade matches)
let PRE3 = null; function getPRE3() { if (!PRE3) { const c = mk(W, H), cg = c.getContext('2d'); scene3(cg, S3); PRE3 = c; } return PRE3; }
