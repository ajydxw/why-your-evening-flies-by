// ================= ④-2 会议室 · 为你好  (S2 – S2E) =================
const S2Q = Q(45.3), S2UP = Q(46.2), S2TB = Q(47), S2WH = Q(49), S2SIT = Q(51.5), S2LIU = Q(52), S2CAL = Q(53.5), S2PRO = Q(54.5);
function backSil(g, x, y, s, rim = 'rgba(160,190,230,.5)') {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#06080c';
  g.beginPath(); g.moveTo(-70, -6); g.bezierCurveTo(-170, 0, -214, 60, -224, 170); g.lineTo(-250, 700); g.lineTo(250, 700); g.lineTo(224, 170); g.bezierCurveTo(214, 60, 170, 0, 70, -6); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(0, -126, 76, 88, 0, 0, TAU); g.fill(); g.fillRect(-30, -60, 60, 70);
  g.strokeStyle = rim; g.lineWidth = 5; g.beginPath(); g.ellipse(0, -126, 76, 88, 0, -1.2, .1); g.stroke(); g.beginPath(); g.moveTo(80, -4); g.bezierCurveTo(170, 4, 210, 60, 222, 170); g.stroke();
  g.restore();
}
function meetingRoom(g, t, o = {}) {
  g.fillStyle = linear(g, 0, 0, 0, 700, [[0, '#1a2130'], [1, '#121824']]); g.fillRect(-400, -400, W + 800, 1200);
  for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(255,255,255,.025)'; g.fillRect(-200 + i * 280, 0, 6, 700); }
  // projection screen
  g.fillStyle = '#0b0f16'; rr(g, 540, 60, 840, 330, 10); g.fill();
  g.fillStyle = linear(g, 0, 76, 0, 374, [[0, '#24364f'], [1, '#162436']]); rr(g, 556, 76, 808, 298, 6); g.fill();
  g.fillStyle = '#dfe9f5'; g.font = F(900, 46); g.textAlign = 'left'; g.fillText('新项目 · 启动会', 600, 150);
  g.fillStyle = 'rgba(180,210,240,.5)'; g.font = F(500, 26); g.fillText('负责人：？', 600, 196);
  const bars = [.4, .55, .5, .72, .9]; bars.forEach((b, i) => { g.fillStyle = i === 4 ? GOLD : 'rgba(120,180,240,.55)'; g.fillRect(1010 + i * 62, 350 - 150 * b, 40, 150 * b); });
  glowDot(g, 960, 230, 700, 'rgba(110,160,230,.12)');
  const ppl = [[300, P_A], [620, P_WANG], [960, P_LIN], [1300, P_LIU], [1620, P_B]];
  ppl.forEach(([x, P], i) => {
    const f = (o.faces && o.faces[i]) || {}, up = i === 2 ? (o.linUp || 0) : 0;
    drawPerson(g, x, 560 - up * 90 + (o.linDown && i === 2 ? o.linDown * 40 : 0), .62, Object.assign({}, P, f));
  });
  // table
  g.fillStyle = linear(g, 0, 650, 0, 800, [[0, '#4a3a2c'], [.15, '#3a2d22'], [1, '#221a14']]); g.beginPath(); g.moveTo(-300, 650); g.lineTo(W + 300, 650); g.lineTo(W + 300, 820); g.lineTo(-300, 820); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,230,200,.2)'; g.fillRect(-300, 650, W + 600, 3); g.fillStyle = '#16110d'; g.fillRect(-300, 820, W + 600, 400);
  [300, 620, 960, 1300, 1620].forEach((x, i) => { g.fillStyle = 'rgba(230,236,245,.85)'; g.save(); g.translate(x - 40, 700); g.rotate(-.05 + i * .02); g.fillRect(-60, -20, 120, 70); g.restore(); g.fillStyle = '#e8e2d6'; rr(g, x + 70, 680, 34, 42, 6); g.fill(); });
  if (o.spot !== undefined) lightHole(g, o.spot[0], o.spot[1], o.spot[2], o.spot[3]);
}
function scene2(g, t) {
  g.save();
  if (t < S2TB) { // 2A wide: who leads?
    const u = t - S2, z = 1 + .04 * E.ioS(inv(0, S2TB - S2, t - S2)) + .04 * E.outC(inv(S2UP, S2TB, t)), set = 1 + .06 * (1 - E.outC(inv(0, .5, u)));
    const silent = inv(S2Q + .1, S2Q + .3, t), up = E.outB(inv(S2UP, S2UP + .45, t));
    const down = { eyes: 'down', mouth: 'tight' }, atLin = (d) => ({ eyes: 'open', look: [d, 0] });
    const faces = [0, 1, 2, 3, 4].map(i => up > .05 ? (i === 2 ? { eyes: 'open', brow: .25, mouth: 'tight', look: [0, -.3] } : atLin(i < 2 ? 1 : -1)) : silent > .5 ? down : { look: [0, 0] });
    g.save(); cam(g, lerp(960, 960, up), lerp(540, 520, up), z * set);
    meetingRoom(g, t, { faces, linUp: up });
    backSil(g, 150, 1010, 1.45);
    g.restore();
    who(g, '总监', '#cfd3da', 960, 800, S2 + .3, t, S2UP, 'center');
    rise(g, '这个新项目，', 960, 885, 62, S2 + .4, t, { t1: S2UP });
    slamT(g, '谁来带队？', 960, 1000, 112, S2Q, t, { t1: S2UP });
    sceneTag(g, '场景二 · 会议室', S2 + .25, S2TB, t);
  } else if (t < S2WH) { // 2B under the table
    const u = t - S2TB; g.save(); const z = 1 + .04 * E.outC(inv(0, 1.2, u)); cam(g, 960, 540, z); drawTable(g, u, false); g.restore();
  } else if (t < S2LIU) { // 2C whisper two-shot
    const u = t - S2WH, z = 1.02 + .06 * E.ioS(inv(0, S2LIU - S2WH, u)), sink = E.ioC(inv(S2SIT, S2SIT + .5, t));
    g.fillStyle = linear(g, 0, 0, W, 0, [[0, '#0f1420'], [1, '#141a28']]); g.fillRect(0, 0, W, H);
    bokeh(g, 52, 12, ['rgba(110,160,230,.2)', 'rgba(255,220,180,.12)'], .8, t);
    g.save(); cam(g, 980, 560, z);
    const talking = (t > Q(49.25) && t < Q(49.8)) || (t > Q(49.95) && t < Q(50.6)) || (t > Q(50.75) && t < Q(51.4));
    lit(g, L => {
      drawPerson(L, 1300, 640 + sink * 130, 1.35, Object.assign({}, P_LIN, { eyes: sink > .3 ? 'down' : u > .4 ? 'open' : 'open', look: [-.7, .2], brow: -.55, mouth: sink > .3 ? 'tight' : 'flat', tilt: -.04 - .06 * sink }));
      drawPerson(L, 660, 700, 1.3, Object.assign({}, P_WANG, { lean: .2, tilt: .12, eyes: 'half', brow: -.25, mouth: talking && Math.sin(t * 30) > 0 ? 'o' : 'tight', look: [.8, .3] }));
    }, L => { FILL(L, linear(L, 300, 0, 1700, 0, [[0, 'rgba(120,80,200,.16)'], [.5, 'rgba(10,12,20,.15)'], [1, 'rgba(10,12,20,.35)']])); });
    g.restore();
    who(g, '王姐（小声）', PUR, 760, 150, S2WH + .1, t);
    const wo = { color: '#e2d6ff', weight: 700, cps: 11, align: 'left' };
    typeT(g, '坐下。', 760, 260, 60, Q(49.25), t, wo);
    typeT(g, '枪打出头鸟，', 760, 350, 60, Q(49.95), t, wo);
    typeT(g, '做砸了，你背锅。', 760, 440, 60, Q(50.75), t, Object.assign({}, wo, { color: (i) => i >= 4 && i <= 6 ? '#ff9b8a' : '#e2d6ff' }));
  } else if (t < S2CAL) { // 2D wide: 小刘 raises hand
    const u = t - S2LIU, z = 1.08 - .04 * E.outC(inv(0, 1, u)), rs = inv(Q(52.2), Q(52.55), t);
    const faces = [{ look: [1, 0] }, { eyes: 'half', look: [1, 0], mouth: 'tight' }, { eyes: 'down', brow: -.4, mouth: 'tight' }, { raise: rs, eyes: rs > .5 ? 'open' : 'open', mouth: rs > .3 ? 'open' : 'flat', brow: .2, look: [0, -.4] }, { look: [-1, 0] }];
    g.save(); cam(g, 1040, 520, z);
    meetingRoom(g, t, { faces, linDown: 1, spot: [1300, 380, lerp(1600, 520, E.outC(rs)), lerp(.1, .62, rs)] });
    backSil(g, 150, 1010, 1.45);
    g.restore();
    who(g, '小刘', '#5fcf93', 1430, 150, Q(52.35), t);
    slamT(g, '我来！', 1430, 290, 120, Q(52.55), t, { align: 'left', color: '#7dffb6', stroke: ['#06301a', 12] });
  } else if (t < S2PRO) { // 2E calendar flip
    const u = t - S2CAL, k = inv(.05, .85, u);
    g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#151b27'], [1, '#0a0d13']]); g.fillRect(0, 0, W, H);
    const months = ['3月', '3月', '4月', '4月', '4月', '5月', '5月', '5月', '6月', '6月', '6月', '6月'], days = [12, 26, 3, 15, 27, 6, 18, 29, 4, 9, 11, 12];
    const idx = Math.min(11, Math.floor(E.ioS(k) * 12)), cal = (gg, m, d) => {
      gg.fillStyle = '#f3efe7'; rr(gg, -230, -270, 460, 560, 18); gg.fill(); gg.fillStyle = '#d8453a'; rr(gg, -230, -270, 460, 130, 18); gg.fill(); gg.fillRect(-230, -170, 460, 30);
      gg.fillStyle = '#fff'; gg.font = F(900, 70); gg.textAlign = 'center'; gg.fillText(m, 0, -180); gg.fillStyle = '#20232b'; gg.font = F(900, 250); gg.fillText(String(d), 0, 160); gg.fillStyle = '#8a8f99'; gg.font = F(700, 36); gg.fillText('星期' + '一二三四五六日'[d % 7], 0, 240); gg.textAlign = 'left';
    };
    g.save(); g.translate(640, 560); g.rotate(-.03);
    g.fillStyle = '#2a2f3a'; g.fillRect(-12, -330, 24, 60);
    g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 40; cal(g, months[Math.min(11, idx + 1)], days[Math.min(11, idx + 1)]); g.shadowColor = 'transparent';
    const fr = (E.ioS(k) * 12) % 1; if (idx < 11) { g.save(); g.translate(0, -270); g.rotate(-fr * 1.4); g.translate(fr * 200, -fr * 300); g.globalAlpha = 1 - fr * .8; g.translate(0, 270); cal(g, months[idx], days[idx]); g.restore(); }
    g.restore();
    slamT(g, '三个月后', 1380, 620, 150, Q(54), t, { color: '#fff', stroke: ['#000', 10] });
  } else { // 2F promotion + caption
    const u = t - S2PRO, pan = E.ioC(inv(Q(55.4), Q(56.2), t)), z = lerp(1.0, 1.28, pan) + .02 * u, cx = lerp(900, 1500, pan), cy = lerp(540, 620, pan);
    g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#2c2a2a'], [1, '#141316']]); g.fillRect(0, 0, W, H);
    g.save(); cam(g, cx, cy, z);
    for (let i = 0; i < 5; i++) { g.fillStyle = linear(g, 0, 40, 0, 620, [[0, 'rgba(255,214,150,.35)'], [1, 'rgba(255,214,150,.05)']]); g.fillRect(-200 + i * 480, 40, 380, 600); }
    g.fillStyle = '#1b1a1e'; g.fillRect(-400, 640, W + 800, 800);
    drawPerson(g, 260, 860, .8, Object.assign({}, P_A, { eyes: 'happy', mouth: 'smile' }));
    drawPerson(g, 1120, 870, .8, Object.assign({}, P_B, { eyes: 'happy', mouth: 'smile' }));
    drawPerson(g, 700, 660, 1.25, Object.assign({}, P_LIU, { eyes: 'happy', mouth: 'grin', badge: .6 + .4 * Math.sin(t * 6), blush: .5 }));
    lit(g, L => {
      drawPerson(L, 1500, 780, .85, Object.assign({}, P_WANG, { eyes: 'half', mouth: 'smile', look: [-1, 0] }));
      drawPerson(L, 1760, 800, .85, Object.assign({}, P_LIN, { eyes: 'down', mouth: 'tight', brow: -.4 }));
    }, L => FILL(L, 'rgba(10,12,22,.55)'));
    g.restore();
    const r = rng(77); for (let i = 0; i < 90; i++) { const x0 = r() * W, sp = 180 + r() * 260, y = -40 + ((u + r() * 3) * sp) % 1200, x = x0 + Math.sin(u * 3 + i) * 30; if (u * sp < r() * 200) continue; g.save(); g.translate(x, y); g.rotate(u * (2 + r() * 4) + i); g.scale(1, Math.cos(u * 6 + i)); g.fillStyle = [GOLD, '#ff6b8a', CY, '#7dffb6', '#fff'][i % 5]; g.fillRect(-7, -4, 14, 8); g.restore(); }
    tagT(g, '三个月后 · 小刘升任组长', 960, 90, S2PRO, Q(55.4), t, { align: 'center', size: 34 });
    const dim = E.ioS(inv(Q(55.7), Q(56.1), t)); if (dim > 0) { g.fillStyle = `rgba(4,5,9,${.62 * dim})`; g.fillRect(0, 0, W, H); }
    rise(g, '她是真心为你好——', 960, 250, 72, Q(55.0), t, {});
    slamT(g, '她自己，也从没举过手。', 960, 560, 118, Q(56.2), t, { color: (i) => i >= 7 && i <= 9 ? GOLD : '#fff', stroke: ['#000', 10] });
  }
  g.restore();
}
