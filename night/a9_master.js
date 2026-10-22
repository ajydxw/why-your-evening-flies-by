// ================= master =================
const ACT = [];
function renderActs(g, t) { // returns post-fx params
  let fx = { bl: .4, ca: 0, fl: 0 };
  if (t < Q(36)) { drawS2a(g, t); fx.fl = .5 * Math.exp(-(t - Q(32)) * 8) + (t > Q(34) ? .35 * Math.exp(-(t - Q(34)) * 10) : 0); fx.ca = t > Q(34) ? 14 * Math.exp(-(t - Q(34)) * 7) : 0; }
  else if (t < Q(42)) { drawS2b(g, t); fx.fl = .4 * Math.exp(-(t - Q(36)) * 10) + (t > Q(40) ? .35 * Math.exp(-(t - Q(40)) * 10) : 0); }
  else if (t < Q(48)) { drawS2c(g, t); fx.bl = .35; }
  else if (t < Q(56)) { drawS2d(g, t); fx.fl = .35 * Math.exp(-(t - Q(48)) * 10) + (t > Q(52) ? .3 * Math.exp(-(t - Q(52)) * 12) : 0) + (t > Q(53) ? .25 * Math.exp(-(t - Q(53)) * 10) : 0); fx.ca = t > Q(52) ? 10 * Math.exp(-(t - Q(52)) * 7) : 0; }
  else if (t < Q(60)) { drawS2e(g, t); fx.fl = .3 * Math.exp(-(t - Q(56)) * 10); }
  else if (t < Q(64)) { drawS2f(g, t); fx.ca = t > Q(60) ? 12 * Math.exp(-(t - Q(60)) * 7) : 0; }
  else if (typeof drawS3 === 'function') fx = drawS3(g, t, fx) || fx;
  return fx;
}
function renderAt(t) {
  const g = X; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  if (t < T.tShat) { renderOpen(t); return; }
  const fx = renderActs(g, t);
  const sh = shakeAt(t, SHAKES); if (sh.x || sh.y) { TX.setTransform(1, 0, 0, 1, 0, 0); TX.clearRect(0, 0, W, H); TX.drawImage(C, 0, 0); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(TMP, sh.x, sh.y); }
  if (t < T.tShat + .7) { g.save(); const s = 1.04; g.translate(960, 540); g.scale(s, s); g.translate(-960, -540); explodeOut(g, SH_T, t, T.tShat); g.restore(); fx.fl += .4 * Math.exp(-(t - T.tShat) * 8); }
  g.setTransform(1, 0, 0, 1, 0, 0); g.filter = 'none'; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  bloom(g, fx.bl, 10); if (fx.ca > .3) chroma(g, fx.ca, .3); flash(g, fx.fl); if (fx.blk) flash(g, fx.blk, '#000');
  vignette(g, .6); grain(g, t, .085);
}
const SHAKES = [[Q(160), 24, .45], [Q(163), 10, .3], [Q(173), 8, .3], [Q(176) + .12, 8, .3], [Q(178), 10, .3], [Q(128), 30, .55], [Q(129), 20, .4], [Q(131), 6, .25], [Q(131.5), 6, .25], [Q(132), 7, .25], [Q(140), 16, .4], [Q(146), 8, .3], [Q(148), 8, .3], [Q(150), 9, .3], [Q(152), 5, .2], [Q(153), 5, .2], [Q(154), 6, .2], [Q(155), 6, .2], [Q(156), 7, .2], [Q(157), 8, .2], [Q(102), 8, .3], [Q(116), 16, .4], [Q(120), 18, .4], [Q(124), 10, .3], [Q(125), 10, .3], [Q(126), 10, .3], [Q(74), 12, .3], [Q(78), 14, .35], [Q(85), 12, .3], [Q(90), 20, .4], [Q(94), 16, .5], [Q(34), 22, .4], [Q(52), 14, .35], [Q(53), 10, .3], [Q(54), 16, .35], [Q(60), 18, .4]];
window.renderAt = renderAt;
let INIT = [];
document.fonts.load(F(900, 100)).then(() => document.fonts.load(F(700, 100))).then(() => { buildText(); buildShatter(); INIT.forEach(f => f()); window.READY = 1; }).catch(e => { window.ERR = String(e && e.stack || e); });
