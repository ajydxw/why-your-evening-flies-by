// ================= C–F dispatch / post / exports =================
const CUTS_CF = () => CUTS_C.concat(typeof CUTS_D !== 'undefined' ? CUTS_D : [], typeof CUTS_E !== 'undefined' ? CUTS_E : [], typeof CUTS_F !== 'undefined' ? CUTS_F : []);
const SEC_CUTS = [C_0, D_0, E_0, F_0];
function sceneC(g, t) {
  if (t < D_0) sceneCsec(g, t);
  else if (t < E_0 && typeof sceneDsec !== 'undefined') sceneDsec(g, t);
  else if (t < F_0 && typeof sceneEsec !== 'undefined') sceneEsec(g, t);
  else if (typeof sceneFsec !== 'undefined') sceneFsec(g, t);
  else { g.fillStyle = '#05040c'; g.fillRect(0, 0, W, H); txt(g, 'TODO ' + t.toFixed(2), 960, 540, 60, '#555', 900, 'center'); }
}
function cardOpts(t) {
  const an = anchorAt(t), o = { u: an.u, bpm: an.b };
  if (t >= Q(71.5) && t < Q(80)) { o.trem = t > Q(78) ? 2.2 + 3 * inv(Q(78), Q(80), t) : 1; o.glitch = t > Q(79); }
  if ((t >= Q(72) && t < Q(81)) || (t >= Q(92) && t < D_0)) o.head = 230;
  if (t >= E_0) o.cool = clamp(inv(E_0, Q(158), t));
  if (t >= Q(160)) o.head = 130;
  o.over = (g, M) => { c2Overlay(g, t, M); c4Overlay(g, t, M); };
  return o;
}
function postC(g, t) {
  const cuts = CUTS_CF();
  for (const c of cuts) { const u = t - c; if (u >= 0 && u < .16) sliceGlitch(g, t, (1 - u / .16) * .6, Math.round(c * 10)); }
  for (const c of SEC_CUTS) { const u = t - c; if (u >= 0 && u < .2 && c !== F_0) sliceGlitch(g, t, (1 - u / .2), Math.round(c * 10) + 3); const v = c - t; if (v > 0 && v < .18 && c !== F_0) sliceGlitch(g, t, .8 * (1 - v / .18), 9); }
  const cs = cardState(t), o = cardOpts(t);
  if (cs.a > 0 && t < E_0) { const red = sstep(.66, .78, o.u) * (cs.kz > .5 ? .6 : 1); if (red > 0) vignette(g, .5 * red * (.75 + .25 * heartK(t)), '255,30,70'); }
  if (typeof postD !== 'undefined') postD(g, t);
  if (typeof postE !== 'undefined') postE(g, t);
  if (typeof postF !== 'undefined') postF(g, t);
  let M = null; if (cs.a > 0) M = chartBox(g, t, cs.B, Object.assign(o, { a: cs.a }));
  if (t > Q(95.5) && t < D_0 && M && M.dot) { const k = inv(Q(95.5), D_0, t); zoomInto(g, M.dot[0], M.dot[1], E.inC(k)); flash(g, E.inC(inv(Q(95.75), D_0, t)), '#fff2cc'); }
}
function overC(g, t) { if (typeof overF !== 'undefined') overF(g, t); }
function bloomC(t) { if (t < Q(66)) return .4; if (t < Q(70)) return .32; if (t < Q(80)) return .42; if (t < Q(88)) return .38; if (t < D_0) return .45; return typeof bloomDEF !== 'undefined' ? bloomDEF(t) : .4; }
function finalBlack(g, t) {
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const a1 = E.ioS(inv(BLACK0 + .12, BLACK0 + .7, t)), a2 = E.ioS(inv(BLACK0 + .62, BLACK0 + 1.2, t));
  txt(g, '你不是不行，', 960, 500, 84, '#ffffff', 700, 'center', a1);
  txt(g, '只是太想赢。', 960, 640, 84, '#ffffff', 700, 'center', a2);
}
function buildCF() { buildC(); if (typeof buildD !== 'undefined') buildD(); if (typeof buildE !== 'undefined') buildE(); if (typeof buildF !== 'undefined') buildF(); }
window.sceneC = sceneC; window.postC = postC; window.overC = overC; window.bloomC = bloomC; window.finalBlack = finalBlack; window.C_0 = C_0; window.BLACK0 = BLACK0;
