// ================= ④-1 宿舍 · 室友  (S1 – S1E) =================
const S1LT = [[S1, 1300, .1], [Q(35.6), 820, .56], [Q(39.4), 520, .8], [Q(40.4), 300, .94]];
function stepLight(t, L) { let R = L[0][1], D = L[0][2], fl = 0; for (let i = 1; i < L.length; i++) { const k = E.outE(inv(L[i][0], L[i][0] + .4, t)); R = lerp(R, L[i][1], k); D = lerp(D, L[i][2], k); fl += hit(t, L[i][0], .3); } return [R, D, fl]; }
const SLAP1 = Q(33.5);
function laptop(g, glow = 1, scr) {
  g.fillStyle = '#20252e'; g.beginPath(); g.moveTo(730, 690); g.lineTo(1260, 690); g.lineTo(1300, 760); g.lineTo(690, 760); g.closePath(); g.fill();
  g.fillStyle = '#1a1e26'; rr(g, 750, 370, 490, 330, 16); g.fill();
  g.fillStyle = linear(g, 0, 386, 0, 684, [[0, '#10243a'], [1, '#0a1626']]); rr(g, 766, 386, 458, 298, 8); g.fill();
  if (scr === 'pass') { g.textAlign = 'center'; g.fillStyle = '#9fc0d6'; g.font = F(700, 38); g.fillText('考试成绩', 995, 452);
    g.fillStyle = GOLD; g.shadowColor = GOLD; g.shadowBlur = 26; g.font = F(900, 104); g.fillText('已通过', 995, 590); g.shadowBlur = 0;
    g.fillStyle = 'rgba(255,255,255,.12)'; rr(g, 840, 638, 310, 12, 6); g.fill(); g.fillStyle = GOLD; rr(g, 840, 638, 310, 12, 6); g.fill(); g.textAlign = 'left';
    glowDot(g, 995, 540, 560, 'rgba(255,200,90,.13)', glow); return; }
  g.textAlign = 'center'; g.fillStyle = '#9fc0d6'; g.font = F(700, 38); g.fillText('考证倒计时', 995, 452);
  g.fillStyle = CY; g.shadowColor = CY; g.shadowBlur = 24; g.font = F(900, 150); g.fillText('23', 965, 610); g.shadowBlur = 0; g.font = F(700, 50); g.fillStyle = '#d6f6f3'; g.fillText('天', 1088, 606);
  g.fillStyle = 'rgba(255,255,255,.12)'; rr(g, 840, 638, 310, 12, 6); g.fill(); g.fillStyle = CY; rr(g, 840, 638, 310 * .68, 12, 6); g.fill(); g.textAlign = 'left';
  glowDot(g, 995, 540, 560, 'rgba(47,216,207,.13)', glow);
}
function dormRoom(g, t, o = {}) {
  g.fillStyle = linear(g, 0, 0, 0, 760, [[0, '#1f2938'], [1, '#141b27']]); g.fillRect(-300, -300, W + 600, 1060);
  // shelf + poster
  g.fillStyle = '#18202c'; g.fillRect(560, 120, 560, 16); g.fillRect(560, 250, 560, 14);
  const r0 = rng(21); let bx = 580; while (bx < 1090) { const w = 18 + r0() * 22, h = 70 + r0() * 50; g.fillStyle = ['#3b4a63', '#5b3a3a', '#2f5450', '#6a5a3a', '#44405e'][(r0() * 5) | 0]; g.fillRect(bx, 120 - h, w, h); bx += w + 3; }
  g.save(); g.translate(1150, 300); g.rotate(.04); g.fillStyle = '#26303f'; g.fillRect(0, 0, 90, 120); g.fillStyle = 'rgba(255,200,120,.25)'; g.font = F(900, 40); g.fillText('拼', 24, 70); g.restore();
  g.fillStyle = '#0a1424'; rr(g, 1290, 60, 500, 410, 8); g.fill();
  const r = rng(3); for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(255,${200 + r() * 55 | 0},150,${.2 + .45 * r()})`; g.fillRect(1300 + r() * 470, 300 + r() * 160, 4 + r() * 8, 4 + r() * 10); }
  g.strokeStyle = '#2c3748'; g.lineWidth = 12; rr(g, 1290, 60, 500, 410, 8); g.stroke(); g.lineWidth = 8; g.beginPath(); g.moveTo(1540, 60); g.lineTo(1540, 470); g.moveTo(1290, 265); g.lineTo(1790, 265); g.stroke();
  if (o.peng) drawPerson(g, o.peng[0], o.peng[1], o.peng[2], Object.assign({}, P_PENG, o.pengF || {}));
  g.fillStyle = linear(g, 0, 740, 0, 1080, [[0, '#57483a'], [.06, '#3d3229'], [1, '#17120e']]); g.fillRect(-300, 740, W + 600, 640);
  g.fillStyle = 'rgba(255,230,190,.18)'; g.fillRect(-300, 740, W + 600, 4);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, 430, 800, 560, [[0, 'rgba(255,190,110,.3)'], [1, 'rgba(255,190,110,0)']]); g.fillRect(0, 300, 1100, 780); g.restore();
  g.strokeStyle = '#2b2f38'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(170, 770); g.lineTo(130, 520); g.lineTo(250, 400); g.stroke();
  g.fillStyle = '#2b2f38'; g.beginPath(); g.ellipse(170, 775, 80, 18, 0, 0, TAU); g.fill();
  g.save(); g.translate(262, 404); g.rotate(.5); g.fillStyle = '#353a45'; g.beginPath(); g.moveTo(-50, -30); g.lineTo(50, -30); g.lineTo(80, 40); g.lineTo(-80, 40); g.closePath(); g.fill(); g.fillStyle = '#ffe9c4'; g.beginPath(); g.ellipse(0, 40, 80, 14, 0, 0, TAU); g.fill(); g.restore();
  glowDot(g, 300, 460, 220, 'rgba(255,200,130,.4)', o.lamp ?? 1);
  // books + mug on desk
  g.fillStyle = '#2d3a52'; g.fillRect(1290, 812, 190, 30); g.fillStyle = '#5a3434'; g.fillRect(1300, 786, 170, 26); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(1300, 800, 170, 3);
  laptop(g, o.glow ?? 1, o.screen);
  if (o.lin !== false) drawLinBack(g, 500, 640, 1);
  if (o.bucket !== undefined && o.bucket[0] > -1000) { const [by, sq] = o.bucket; drawBucket(g, 1480, 870 + by, sq); }
}
function scene1(g, t) {
  g.save();
  const [R, D, fl] = stepLight(t, S1LT), dk = clamp(D + fl * .35 * (.5 + .5 * Math.sin(t * 90)));
  if (t < Q(34)) { // 1A wide: working → chicken slam
    const z = 1 + .05 * E.ioS(inv(S1, Q(34), t)), set = 1 + .06 * (1 - E.outC(inv(S1, S1 + .5, t)));
    g.save(); cam(g, 960, 540, z * set);
    const drop = E.inC(inv(SLAP1 - .3, SLAP1, t)), by = t < SLAP1 - .3 ? -2000 : (1 - drop) * -900, sq = hit(t, SLAP1, .28);
    dormRoom(g, t, { bucket: [by, sq] });
    const wd = E.inC(inv(Q(33.95), Q(34), t));
    if (t > SLAP1 - .3) drawFist(g, 1625 + wd * 300, 690 + by + sq * 30 - wd * 200, 1.15, YEL, YELD, 2300, 300 + by);
    lightHole(g, 560, 600, R, dk);
    g.restore();
    burst(g, 1745, 610, E.outB(inv(SLAP1, SLAP1 + .14, t)) * (1 - inv(Q(33.9), Q(34), t)), '啪！');
    sceneTag(g, '场景一 · 室友', S1 + .25, Q(40.8), t);
  } else if (t < Q(35.6)) { // 1B 大鹏 MS
    const u = t - Q(34), z = 1.03 - .03 * E.outC(inv(0, 1.2, u));
    g.fillStyle = linear(g, 0, 0, 0, H, [[0, '#1b2230'], [1, '#0c1018']]); g.fillRect(0, 0, W, H);
    g.save(); cam(g, 960, 540, z);
    g.fillStyle = '#0e131c'; g.fillRect(-100, -100, W + 200, H + 200);
    g.fillStyle = linear(g, 0, 60, 0, 1080, [[0, '#9fb4cc'], [.5, '#5f7590'], [1, '#2a3646']]); g.fillRect(1010, 60, 500, 1100);
    g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(1010, 60, 500, 6); g.fillStyle = '#1c2431'; g.fillRect(990, 40, 24, 1100); g.fillRect(1506, 40, 24, 1100); g.fillRect(990, 40, 540, 24);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linear(g, 1010, 0, 600, 0, [[0, 'rgba(150,180,220,.16)'], [1, 'rgba(150,180,220,0)']]); g.beginPath(); g.moveTo(1010, 60); g.lineTo(1010, 1100); g.lineTo(300, 1100); g.closePath(); g.fill(); g.restore();
    g.fillStyle = '#151b26'; rr(g, 1640, 200, 220, 300, 6); g.fill(); g.fillStyle = 'rgba(255,190,110,.18)'; g.font = F(900, 60); g.fillText('NBA', 1690, 380);
    glowDot(g, 300, 760, 700, 'rgba(255,190,110,.22)');
    const talk = u > .15 && u < 1.0 ? (Math.sin(u * 26) > 0 ? 'open' : 'grin') : 'grin';
    lit(g, L => drawPerson(L, 1260, 600, 1.45, Object.assign({}, P_PENG, { mouth: talk, eyes: u > 1 ? 'happy' : 'open', brow: -.2, look: [-.6, .2], tilt: -.05 + .03 * Math.sin(u * 3) })),
      L => { FILL(L, linear(L, 900, 0, 1700, 0, [[0, 'rgba(255,180,100,.14)'], [.55, 'rgba(10,14,24,.1)'], [1, 'rgba(160,190,230,.25)']])); });
    g.restore();
    who(g, '大鹏', YEL, 140, 300, Q(34) + .05, t);
    slamT(g, '别卷了，', 140, 470, 132, Q(34.25), t, { align: 'left', color: YEL, stroke: ['#2a1a00', 12] });
    rise(g, '五排三缺一，就等你！', 140, 600, 66, Q(34.85), t, { align: 'left' });
    sceneTag(g, '场景一 · 室友', S1 + .25, Q(40.8), t);
  } else if (t < Q(37.6)) { // 1C wide: light shrinks, Lin answers
    const u = t - Q(35.6), z = 1.06 + .08 * E.ioS(inv(0, 1.45, u));
    g.save(); cam(g, 880, 560, z);
    dormRoom(g, t, { bucket: [0, 0], peng: [1800, 440, 1.0], pengF: { mouth: 'grin', look: [-1, .3] } });
    lightHole(g, 560, 600, R, dk);
    g.restore();
    who(g, '林默', CY, 300, 230, Q(35.95), t);
    typeT(g, '今晚得做完……', 300, 330, 66, Q(36.05), t, { color: '#c8fbf6', weight: 700, cps: 7 });
    sceneTag(g, '场景一 · 室友', S1 + .25, Q(40.8), t);
  } else if (t < Q(39.4)) { // 1D 大鹏 CU
    const u = t - Q(37.6), z = 1 + .05 * E.ioS(inv(0, 1.3, u));
    g.fillStyle = linear(g, 0, 0, W, 0, [[0, '#0a0d14'], [1, '#1a1a22']]); g.fillRect(0, 0, W, H);
    bokeh(g, 31, 10, ['rgba(255,190,110,.25)', 'rgba(120,160,255,.15)'], .7, t);
    g.save(); cam(g, 1250, 600, z);
    lit(g, L => drawPerson(L, 1330, 760, 2.2, Object.assign({}, P_PENG, { mouth: u > .2 && u < .75 ? (Math.sin(u * 24) > 0 ? 'open' : 'smirk') : 'smirk', eyes: 'half', brow: [.5, -.35], look: [-.7, .3], tilt: .06 })),
      L => { FILL(L, linear(L, 800, 0, 1800, 0, [[0, 'rgba(255,170,90,.12)'], [.6, 'rgba(8,10,18,.25)'], [1, 'rgba(8,10,18,.7)']])); });
    g.restore();
    who(g, '大鹏', YEL, 130, 330, Q(37.6) + .05, t);
    rise(g, '你这么卷，', 130, 450, 80, Q(37.8), t, { align: 'left' });
    slamT(g, '显得我们很废。', 130, 630, 136, Q(38.5), t, { align: 'left', color: (i) => i === 4 || i === 5 ? '#ff7d5e' : YEL, stroke: ['#2a1200', 12] });
  } else { // 1E dark wide + barrage
    const u = t - Q(39.4), z = 1.0 + .05 * E.ioS(inv(0, 1.2, u));
    g.save(); cam(g, 900, 560, z, -.01);
    dormRoom(g, t, { bucket: [0, 0], peng: [1800, 440, 1.0], pengF: { mouth: 'smirk', eyes: 'half', look: [-1, .3] }, lamp: .7 });
    lightHole(g, 540, 610, R, dk);
    g.restore();
    danmaku(g, [['图啥呢', Q(39.5), 190, 46, 2300, 'rgba(255,255,255,.75)'], ['读书有啥用', Q(39.6), 330, 84, 1450, '#fff'], ['卷王来了', Q(39.8), 900, 42, 2400, 'rgba(255,255,255,.7)'],
      ['差不多得了', Q(39.95), 560, 92, 1350, YEL], ['又开始了', Q(40.15), 460, 48, 2200, 'rgba(255,255,255,.7)'], ['装什么学霸', Q(40.3), 790, 104, 1300, '#ff8a6a'], ['合群点', Q(40.45), 250, 46, 2300, 'rgba(255,255,255,.7)'], ['至于吗', Q(40.6), 990, 44, 2200, 'rgba(255,255,255,.7)']], t);
  }
  g.restore();
}
