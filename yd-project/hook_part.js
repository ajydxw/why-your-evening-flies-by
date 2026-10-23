// ---------- bar 1 hook: 4 beats · 4 shots (macro ignition → vertigo → near-slip → pull-back) ----------
const HB_T = [Q(-1.15), Q(0), Q(1), Q(2), Q(2.5), Q(3), Q(3.5)];
const BPM_K = [[Q(0), 96], [Q(1), 124], [Q(2), 163], [Q(3), 148]];
function bpmAt(t) { let v = 72, prev = 72; for (const [t0, b] of BPM_K) { if (t >= t0) v = lerp(prev, b, E.outC(clamp((t - t0) / .22))); prev = b; } return v; }
function ecgAt(tt) { let y = .03 * nz(tt * 37, 5); for (const h of HB_T) { const u = tt - h; if (u < -.06 || u > .4) continue; const A = .55 + .45 * clamp((bpmAt(h + .3) - 72) / 90);
  y += A * (-.18 * Math.exp(-(((u + .022) / .009) ** 2)) + Math.exp(-((u / .01) ** 2)) - .42 * Math.exp(-(((u - .026) / .011) ** 2)) + .24 * Math.exp(-(((u - .2) / .05) ** 2))); } return y; }
function heartPath(g, x, y, s) { g.beginPath(); g.moveTo(x, y + s * .5); g.bezierCurveTo(x - s * 1.15, y - s * .25, x - s * .5, y - s * 1.05, x, y - s * .35); g.bezierCurveTo(x + s * .5, y - s * 1.05, x + s * 1.15, y - s * .25, x, y + s * .5); g.closePath(); }
function drawHUD(g, t, x, y, a = 1) {
  if (a <= .01) return; const bpm = bpmAt(t), hot = clamp((bpm - 90) / 70);
  const col = hot > .8 ? '#ff3a5c' : hot > .4 ? '#ff5ad8' : '#5ef2ff';
  const alarm = t > HA3 && t < HA3 + .7 ? (Math.floor((t - HA3) * 14) % 2 ? 1 : .3) : 1;
  const Wp = 380, Hp = 150; g.save(); g.translate(x, y); g.globalAlpha = a;
  g.fillStyle = hot > .8 && t > HA3 ? 'rgba(60,4,20,.6)' : 'rgba(8,6,30,.55)'; rr(g, 0, 0, Wp, Hp, 12); g.fill();
  g.strokeStyle = col; g.lineWidth = 3; g.shadowColor = col; g.shadowBlur = 12;
  for (const [cx, cy, sx, sy] of [[0, 0, 1, 1], [Wp, 0, -1, 1], [0, Hp, 1, -1], [Wp, Hp, -1, -1]]) { g.beginPath(); g.moveTo(cx, cy + sy * 24); g.lineTo(cx, cy); g.lineTo(cx + sx * 24, cy); g.stroke(); }
  let hp = 0; for (const h of HB_T) hp = Math.max(hp, pulse(t, h, 9)); g.fillStyle = col; heartPath(g, 36, 40, 15 * (1 + .45 * hp)); g.fill();
  g.shadowBlur = 0; g.font = F(700, 26); g.fillStyle = 'rgba(225,238,255,.92)'; g.textBaseline = 'alphabetic'; g.fillText('心率', 62, 50);
  g.font = F(700, 17); g.fillStyle = 'rgba(225,238,255,.6)'; g.fillText('BPM', 124, 50);
  g.globalAlpha = a * alarm; g.font = F(900, 78); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 22; g.fillText(String(Math.round(bpm)), 22, 132); g.shadowBlur = 0;
  if (t > HA3 && t < HA3 + .7) { g.font = F(900, 30); g.fillText('!', 158, 128); }
  g.globalAlpha = a; const x0 = 190, x1 = Wp - 18, yc = 92, amp = 46, win = 1.35, n = 96;
  g.beginPath(); for (let i = 0; i <= n; i++) { const f = i / n, tt = t - win * (1 - f), yy = yc - ecgAt(tt) * amp; i ? g.lineTo(lerp(x0, x1, f), yy) : g.moveTo(lerp(x0, x1, f), yy); }
  g.lineJoin = 'round'; g.strokeStyle = col; g.globalAlpha = a * .35; g.lineWidth = 8; g.stroke(); g.globalAlpha = a; g.lineWidth = 2.6; g.strokeStyle = '#ffffff'; g.stroke();
  glowDot(g, x1, yc - ecgAt(t) * amp, 16, col, a); g.globalAlpha = a * .25; g.fillStyle = col; g.fillRect(x0, yc + 40, x1 - x0, 1.5);
  g.restore();
}
// --- A1 · macro: the boot lands, the cable ignites (0 → Q1) ---
const MAC_BOKEH = (() => { const r = rng(808), a = []; for (let i = 0; i < 80; i++) { const z = r(); a.push({ x: r() * 2300 - 190, y: r() * 1300 - 110, r: lerp(16, 120, z * z), c: PAL[Math.floor(r() * PAL.length)], a: lerp(.3, .85, r()), d: r(), z }); } return a; })();
const MAC_A = Math.atan2(395 - 905, 2120), MCX = 840;
const macY = x => lerp(905, 395, (x + 100) / 2120);
function macSag(t) { if (t < T_IGN) return 0; const u = t - T_IGN; return 30 * (1 - Math.exp(-u * 7) * Math.cos(u * 26)) * (1 - .25 * inv(.2, .7, u)); }
function shotMacro(g, t) {
  const u = t - T_IGN, push = E.outC(clamp(t / HA2)), S = lerp(1.02, 1.16, push), rot = lerp(-.03, .015, push);
  const CY = macY(MCX), sag = macSag(t), wy = x => macY(x) + sag * Math.exp(-(((x - MCX) / 460) ** 2));
  g.fillStyle = '#05041a'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(MCX, CY); g.rotate(rot); g.scale(S, S); g.translate(-MCX, -CY);
  g.fillStyle = linear(g, 0, -150, 0, H + 150, [[0, '#0b0930'], [.55, '#2b1058'], [1, '#160723']]); g.fillRect(-400, -400, W + 800, H + 800);
  const on0 = u > 0 ? 1 : 0;
  g.save(); g.globalCompositeOperation = 'lighter';
  g.globalAlpha = .5 * on0 * clamp(u * 3); g.fillStyle = radial(g, MCX, H + 200, 1300, [[0, 'rgba(255,60,190,.55)'], [.5, 'rgba(120,40,220,.18)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(-400, -400, W + 800, H + 800);
  for (const b of MAC_BOKEH) {
    const on = u > 0 ? clamp((u * 5200 - Math.abs(b.x - MCX)) / 360) : 0, bx = b.x - push * 90 * (1 - b.z), by = b.y + Math.sin(t * .9 + b.d * 9) * 8;
    const al = b.a * (1 + .3 * beatPulse(t, 6) * on);
    if (on < 1) { g.globalAlpha = al * .16 * (1 - on); g.fillStyle = '#6c5bb0'; g.beginPath(); g.arc(bx, by, b.r, 0, TAU); g.fill(); }
    if (on > 0) { g.globalAlpha = al * .42 * on; g.fillStyle = b.c; g.beginPath(); g.arc(bx, by, b.r * (1 + .15 * (1 - on)), 0, TAU); g.fill(); g.globalAlpha = al * .5 * on; g.lineWidth = Math.max(1.5, b.r * .07); g.strokeStyle = b.c; g.stroke(); }
  }
  // wind streaks
  for (let i = 0; i < 14; i++) { const r1 = hsh(i * 3.1), sp = lerp(1800, 3600, r1), x = ((r1 * 4000 + t * sp) % 2600) - 300, y = hsh(i * 7.7) * H; g.globalAlpha = .06 + .08 * hsh(i); g.fillStyle = '#cfe8ff'; g.fillRect(x, y, 160 + 200 * r1, 1.5); }
  g.restore();
  // cable
  const pts = []; for (let x = -300; x <= 2300; x += 12) pts.push([x, wy(x)]);
  const path = (xa, xb) => { g.beginPath(); let f = 1; for (const [x, y] of pts) { if (x < xa || x > xb) continue; f ? g.moveTo(x, y) : g.lineTo(x, y); f = 0; } };
  g.lineCap = 'round'; path(-300, 2300); g.strokeStyle = '#151532'; g.lineWidth = 18; g.stroke();
  g.save(); g.translate(0, -5); path(-300, 2300); g.strokeStyle = 'rgba(190,205,255,.28)'; g.lineWidth = 2.5; g.stroke(); g.restore();
  if (u > 0) {
    const fr = MCX + u * 6800, fl = MCX - u * 3400;
    g.save(); g.globalCompositeOperation = 'lighter'; path(fl, fr);
    g.strokeStyle = '#4fe9ff'; g.globalAlpha = .16 * (1 + .5 * beatPulse(t, 6)); g.lineWidth = 70; g.stroke(); g.globalAlpha = .5; g.lineWidth = 24; g.stroke(); g.globalAlpha = 1; g.lineWidth = 7; g.strokeStyle = '#effeff'; g.stroke();
    for (const hx of [fr, fl]) if (hx > -200 && hx < 2200) { glowDot(g, hx, wy(hx), 160, '#bff8ff', .9); glowDot(g, hx, wy(hx), 40, '#ffffff', 1); }
    // anamorphic flare + contact bloom
    const k = Math.exp(-u * 5.5); g.globalAlpha = k; g.fillStyle = linear(g, -300, 0, W + 300, 0, [[0, 'rgba(80,230,255,0)'], [.38, 'rgba(80,230,255,.55)'], [.44, 'rgba(255,255,255,1)'], [.5, 'rgba(80,230,255,.55)'], [1, 'rgba(80,230,255,0)']]);
    g.fillRect(-300, CY + sag - 3, W + 600, 6); g.globalAlpha = 1; glowDot(g, MCX, CY + sag, 520, '#7ff4ff', .85 * k); glowDot(g, MCX, CY + sag, 120, '#ffffff', k);
    // shockwave ring along the cable plane
    const ws = E.outC(clamp(u / .55)); if (ws < 1) { g.save(); g.translate(MCX, CY + sag); g.rotate(MAC_A); g.strokeStyle = '#9ff6ff'; g.globalAlpha = .75 * (1 - ws); g.lineWidth = 7 * (1 - ws) + 1; g.beginPath(); g.ellipse(0, 0, 40 + 1500 * ws, (40 + 1500 * ws) * .22, 0, 0, TAU); g.stroke(); g.restore(); }
    // electric arcs crawling from the contact point
    if (u < .5) { const fi = Math.floor(t * 30); g.strokeStyle = '#dffcff'; g.shadowColor = '#5ef2ff'; g.shadowBlur = 16; g.lineWidth = 3; g.globalAlpha = 1 - u / .5;
      for (let a = 0; a < 7; a++) { const ang = hsh(fi * 13 + a) * TAU, L = lerp(90, 330, hsh(fi * 7 + a * 3)); g.beginPath(); g.moveTo(MCX, CY + sag); for (let s = 1; s <= 7; s++) { const f = s / 7; g.lineTo(MCX + Math.cos(ang) * L * f + (hsh(fi + a * 11 + s) - .5) * 60, CY + sag + Math.sin(ang) * L * f * .6 + (hsh(fi + a * 5 + s * 3) - .5) * 60); } g.stroke(); } }
    g.restore();
    sparkBurst(g, t, T_IGN, MCX, CY + sag, 80, 1500, 91);
  }
  // boot + trouser leg
  const fdy = t < T_IGN ? -150 * (1 - E.inC(clamp(t / T_IGN))) : sag - 4;
  g.save(); g.translate(MCX - 10, CY + fdy - 9); g.rotate(MAC_A);
  const fl2 = Math.sin(t * 13) * 6 + Math.sin(t * 21) * 3;
  g.beginPath(); g.moveTo(-178, -168); g.lineTo(-72, -170); g.lineTo(-40 + fl2 * .4, -1200); g.lineTo(-330, -1200); g.closePath(); g.fillStyle = '#070818'; g.fill();
  g.save(); g.beginPath(); g.moveTo(-178, -168); g.lineTo(-330, -1200); g.strokeStyle = RIM; g.shadowColor = RIM; g.shadowBlur = 18; g.lineWidth = 5; g.stroke(); g.restore();
  g.beginPath(); g.moveTo(-182, -170); g.quadraticCurveTo(-120, -186 + fl2, -64, -172); g.lineTo(-60, -150); g.lineTo(-180, -150); g.closePath(); g.fillStyle = '#0c0d24'; g.fill();
  g.beginPath(); g.moveTo(-200, -4); g.lineTo(212, -4); g.quadraticCurveTo(252, -22, 222, -62); g.quadraticCurveTo(168, -108, 40, -120); g.lineTo(-58, -168); g.lineTo(-172, -172); g.quadraticCurveTo(-222, -100, -200, -4); g.closePath();
  g.fillStyle = '#0a0b22'; g.fill(); g.save(); g.clip();
  g.fillStyle = linear(g, 0, -170, 0, 0, [[0, 'rgba(0,0,0,0)'], [.7, 'rgba(0,0,0,0)'], [1, u > 0 ? 'rgba(90,235,255,.55)' : 'rgba(90,120,200,.15)']]); g.fillRect(-260, -180, 520, 180);
  g.restore();
  g.save(); g.strokeStyle = RIM; g.shadowColor = RIM; g.shadowBlur = 14; g.lineWidth = 4; g.beginPath(); g.moveTo(-172, -172); g.quadraticCurveTo(-222, -100, -200, -4); g.stroke();
  g.beginPath(); g.moveTo(-58, -168); g.lineTo(40, -120); g.quadraticCurveTo(168, -108, 222, -62); g.stroke();
  g.strokeStyle = '#ff4fcf'; g.shadowColor = '#ff4fcf'; g.lineWidth = 6; g.beginPath(); g.moveTo(-160, -58); g.quadraticCurveTo(0, -30, 150, -78); g.stroke();
  g.fillStyle = '#1b1d40'; g.shadowBlur = 0; g.fillRect(-200, -26, 420, 22); g.fillStyle = RIM; g.globalAlpha = .9; g.fillRect(-196, -28, 416, 3); g.restore();
  g.restore();
  g.restore();
}
// --- A2 · straight down: the drop (Q1 → Q2) ---
const DOWN_B = (() => { const r = rng(4242), a = []; for (let gx = -9; gx <= 9; gx++) for (let gy = -6; gy <= 6; gy++) { const n = r() < .4 ? 2 : 1; for (let k = 0; k < n; k++) { const w = lerp(16, n === 2 ? 22 : 36, r()), d = lerp(16, 36, r()); const cx = gx * 56 + lerp(-6, 6, r()) + (n === 2 ? (k ? 13 : -13) : 0), cy = gy * 56 + lerp(-6, 6, r());
  a.push({ x0: cx - w / 2, x1: cx + w / 2, y0: cy - d / 2, y1: cy + d / 2, h: lerp(25, 235, Math.pow(r(), 1.5)), c: PAL[Math.floor(r() * PAL.length)], neon: r() < .3 ? PAL[Math.floor(r() * 4)] : null, dens: r() }); } } return a.sort((p, q) => p.h - q.h); })();
const DN_CARS = (() => { const r = rng(515), a = []; for (let i = 0; i < 90; i++) a.push({ ax: r() < .5, line: Math.floor(r() * 19) - 9, off: r() * 1000, v: lerp(30, 70, r()) * (r() < .5 ? 1 : -1), c: r() < .5 ? '#ff4a6a' : '#fff3c4' }); return a; })();
function shotDown(g, t) {
  const u = inv(HA2, HA3, t), Hc = lerp(250, 400, E.ioS(u)), th = .5 + lerp(0, .14, E.outC(u)), f = 900, cxw = 20 + 26 * u, cyw = -14 * u;
  const cs = Math.cos(th), sn = Math.sin(th);
  const pr = (x, y, s) => { const dx = x - cxw, dy = y - cyw; return [W / 2 + (dx * cs - dy * sn) * s, H / 2 + (dx * sn + dy * cs) * s]; };
  g.fillStyle = '#06041a'; g.fillRect(0, 0, W, H);
  const sg = f / Hc;
  // streets + traffic on the ground
  g.save(); g.lineWidth = Math.max(1, 5 * sg); g.strokeStyle = 'rgba(120,60,200,.35)';
  for (let i = -10; i <= 10; i++) { const v = i * 56 + 28; let [a1, b1] = pr(v, -400, sg), [a2, b2] = pr(v, 400, sg); g.beginPath(); g.moveTo(a1, b1); g.lineTo(a2, b2); [a1, b1] = pr(-600, v, sg); [a2, b2] = pr(600, v, sg); g.moveTo(a1, b1); g.lineTo(a2, b2); g.stroke(); }
  g.globalCompositeOperation = 'lighter';
  for (const c of DN_CARS) { const p = ((c.off + c.v * t * 6) % 1000 + 1000) % 1000 - 500, v = c.line * 56 + 28; const [x1, y1] = c.ax ? pr(v, p, sg) : pr(p, v, sg), [x2, y2] = c.ax ? pr(v, p - Math.sign(c.v) * 14, sg) : pr(p - Math.sign(c.v) * 14, v, sg); g.strokeStyle = c.c; g.globalAlpha = .8; g.lineWidth = Math.max(1.2, 2.2 * sg); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
  g.restore();
  // buildings, lowest first; walls lean toward the vanishing point
  const shade = ['#191442', '#120f35', '#0c0a27', '#161139'];
  for (const b of DOWN_B) {
    const sr = f / (Hc - b.h), C4 = [[b.x0, b.y0], [b.x1, b.y0], [b.x1, b.y1], [b.x0, b.y1]];
    const R = C4.map(([x, y]) => pr(x, y, sr)); if (Math.max(...R.map(p => p[0])) < -60 || Math.min(...R.map(p => p[0])) > W + 60 || Math.max(...R.map(p => p[1])) < -60 || Math.min(...R.map(p => p[1])) > H + 60) continue;
    const G4 = C4.map(([x, y]) => pr(x, y, sg)); const vis = [cyw < b.y0, cxw > b.x1, cyw > b.y1, cxw < b.x0];
    for (let i = 0; i < 4; i++) { if (!vis[i]) continue; const j = (i + 1) % 4;
      g.beginPath(); g.moveTo(R[i][0], R[i][1]); g.lineTo(R[j][0], R[j][1]); g.lineTo(G4[j][0], G4[j][1]); g.lineTo(G4[i][0], G4[i][1]); g.closePath(); g.fillStyle = shade[i]; g.fill();
      const fl = Math.floor(b.h / 7); g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = b.c;
      for (let k = 1; k < fl; k++) { if (hsh(b.x0 * 3 + k * 1.7 + i) > .35 + b.dens * .5) continue; const z = b.h - k * 7, s2 = f / (Hc - z); const [p1x, p1y] = pr(C4[i][0], C4[i][1], s2), [p2x, p2y] = pr(C4[j][0], C4[j][1], s2); const ws = 2.2 * s2;
        g.globalAlpha = .55 * (1 - k / fl * .6); g.lineWidth = ws * .9; g.setLineDash([ws * 1.3, ws]); g.beginPath(); g.moveTo(lerp(p1x, p2x, .08), lerp(p1y, p2y, .08)); g.lineTo(lerp(p1x, p2x, .92), lerp(p1y, p2y, .92)); g.stroke(); }
      g.restore(); g.setLineDash([]);
    }
    g.beginPath(); R.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = '#221b52'; g.fill();
    if (b.neon) { g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = b.neon; g.shadowColor = b.neon; g.shadowBlur = 12; g.lineWidth = Math.max(1, .9 * sr); g.globalAlpha = .9; g.stroke(); g.restore(); }
    else { g.fillStyle = 'rgba(255,255,255,.05)'; const [qx, qy] = pr((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, sr); g.fillRect(qx - 3 * sr, qy - 2 * sr, 6 * sr, 4 * sr); }
    const [ax, ay] = pr(b.x0 + 3, b.y0 + 3, sr); if (b.h > 150) glowDot(g, ax, ay, 4 * sr, '#ff3355', .5 + .5 * Math.sin(t * 6 + b.x0));
  }
  // depth haze: the street far below glows, the void pulls
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = radial(g, W / 2, H / 2, 520, [[0, 'rgba(255,60,170,.22)'], [1, 'rgba(0,0,0,0)']]); g.fillRect(0, 0, W, H); g.restore();
  g.fillStyle = radial(g, W / 2, H / 2, 900, [[0, 'rgba(6,3,24,.45)'], [.5, 'rgba(6,3,24,.12)'], [1, 'rgba(6,3,24,0)']]); g.fillRect(0, 0, W, H);
  zoomBlur(g, W / 2, H / 2, .035 + .05 * E.ioS(u), 6);
  // the wire + walker seen from above (fixed size: the city falls away beneath him)
  const wa = -.42, wob = Math.sin((t - HA2) * 8.5) * .1 + Math.sin(t * 3.1) * .03, ox = W / 2 + 30, oy = H / 2 + 10;
  g.save(); g.translate(ox, oy); g.rotate(wa);
  g.save(); g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.strokeStyle = '#4fe9ff'; g.globalAlpha = .18; g.lineWidth = 46; g.beginPath(); g.moveTo(-2000, 0); g.lineTo(2000, 0); g.stroke(); g.globalAlpha = .5; g.lineWidth = 15; g.stroke(); g.globalAlpha = 1; g.lineWidth = 5; g.strokeStyle = '#effeff'; g.stroke(); g.restore();
  const st = E.ioS(clamp((t - HA2) / BEAT / .78)), fa = lerp(-34, 34, st);
  g.fillStyle = BODY; g.strokeStyle = RIM; g.lineWidth = 3; g.shadowColor = RIM; g.shadowBlur = 10;
  for (const fx of [fa, -fa]) { g.beginPath(); g.ellipse(fx, 0, 30, 11, 0, 0, TAU); g.fill(); g.stroke(); }
  g.rotate(wob);
  // scarf trailing behind
  g.save(); g.strokeStyle = '#ff4fcf'; g.shadowColor = '#ff4fcf'; g.shadowBlur = 14; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(-6, -4); for (let i = 1; i <= 7; i++) g.lineTo(-6 - i * 22, -4 + Math.sin(t * 12 - i * .9) * i * 3.2); g.stroke(); g.restore();
  // pole across, arms, shoulders, head
  g.save(); g.lineCap = 'round'; g.strokeStyle = '#1a1d38'; g.lineWidth = 9; g.beginPath(); g.moveTo(16, -360); g.lineTo(16, 360); g.stroke(); g.strokeStyle = 'rgba(127,244,255,.65)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(12, -360); g.lineTo(12, 360); g.stroke();
  g.globalCompositeOperation = 'lighter'; for (const [py, c] of [[-360, '#5ef2ff'], [360, '#ff5ad8']]) { g.fillStyle = radial(g, 16, py, 34, [[0, '#fff'], [.3, c], [1, 'rgba(0,0,0,0)']]); g.fillRect(-18, py - 34, 68, 68); } g.restore();
  g.lineWidth = 14; g.lineCap = 'round'; g.strokeStyle = BODY; g.beginPath(); g.moveTo(0, -40); g.lineTo(16, -70); g.moveTo(0, 40); g.lineTo(16, 70); g.stroke();
  g.beginPath(); g.ellipse(0, 0, 26, 50, 0, 0, TAU); g.fill(); g.stroke();
  g.beginPath(); g.arc(5, 0, 24, 0, TAU); g.fillStyle = '#0b0c22'; g.fill(); g.stroke();
  g.restore();
}
