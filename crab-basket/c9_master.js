// ================= master =================
const SHAKES = [[Q(3), 8, .2], [Q(3.35), 26, .45], [Q(8), 10, .3], [Q(12), 6, .2], [Q(13), 24, .45], [Q(15), 14, .35], [TE, 28, .5], [LT[0], 18, .35], [LT[1], 18, .35], [LT[2], 20, .35], [LT[3], 26, .45], [Q(21), 10, .3],
  [Q(24), 10, .25], [Q(24) + .22, 16, .3], [Q(25.5), 8, .25], [Q(25.5) + .45, 12, .3], [Q(27), 8, .25], [Q(27) + .36, 12, .3], [Q(28), 6, .25], [Q(29.5), 12, .3]];
const FLASHES = [[Q(4), .85, .3], [TE, .7, .22], [LT[0], .22, .2], [LT[1], .22, .2], [LT[2], .22, .2], [LT[3], .3, .25], [Q(24), .75, .22], [Q(25.5), .7, .22], [Q(27), .7, .22], [Q(28), .35, .25]];
const CHROMA = [[Q(3.35), 10, .35], [Q(4), 12, .3], [Q(13), 10, .35], [Q(15), 6, .3], [TE, 14, .4], [LT[0], 10, .3], [LT[1], 10, .3], [LT[2], 10, .3], [LT[3], 14, .35], [Q(21), 6, .3], [Q(24), 8, .25], [Q(25.5), 8, .25], [Q(27), 8, .25], [Q(29.5), 6, .25]];
SHAKES.push([SLAP1, 14, .35], [Q(34.25), 8, .25], [Q(38.5), 10, .3], [S2Q, 6, .25], [Q(52.55), 10, .3], [Q(54), 8, .3], [Q(56.2), 10, .35],
  [S3READ, 8, .25], ...S3FLOOD.map(x => [x, 4, .2]), [S3NO, 10, .3], [Q(69.6), 14, .4], [Q(74.6), 8, .25], [Q(75.25), 16, .4], [Q(77.55), 6, .2], [L1SL, 10, .3], [Q(86.9), 10, .3],
  [L2SNAP, 8, .3], [L2S[0], 10, .3], [L2S[1], 10, .3], [L2SNAPC, 18, .4], [L2CAP, 10, .3], ...L3CU.map(x => [x, 8, .3]), [L3S[0], 10, .3], [L3S[1], 14, .35],
  [BK1, 22, .45], [BKL, 12, .3], [BKT, 20, .45], [Q(137.3), 8, .25], [KEEPS, 12, .3], [Z3UP, 6, .3], [Z3C2, 8, .25], [E_CAP[1], 8, .25], [GRIP, 10, .35], [E_LAND, 10, .3]);
FLASHES.push([SLAP1, .3, .22], [Q(69.6), .25, .22], [Q(75.25), .3, .22], [L2SNAPC, .4, .22], [BK1, .7, .25], [BKT, .45, .25], [KEEPS, .2, .2], [GRIP, .35, .25]);
CHROMA.push([SLAP1, 8, .3], [Q(56.2), 6, .3], [Q(69.6), 10, .35], [Q(75.25), 10, .35], [L2SNAPC, 12, .35], [L3S[1], 8, .3], [BK1, 14, .4], [BKT, 10, .35]);
function renderAt(t) {
  const g = X; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none';
  if (t < Q(4) + .1) { const cf = t >= Q(4) - .04; if (cf) sceneBasket(g, t); sceneHand(g, t, cf ? 1 - inv(Q(4) - .04, Q(4) + .1, t) : 1); }
  else if (t < Q(16)) sceneBasket(g, t);
  else if (t < Q(24)) sceneReveal(g, t);
  else if (t < Q(28)) scenePreview(g, t);
  else if (t < S1 - PUSH) sceneCards(g, t);
  else if (t < S1) { const e = E.inE(inv(S1 - PUSH, S1, t)); g.save(); rowCam(g, 0, e); sceneCards(g, t); g.restore(); const xf = inv(.72, 1, e); if (xf > 0) { g.save(); g.globalAlpha = xf; scene1(g, S1); g.restore(); } }
  else renderMain(g, t);
  if (t >= Q(24) && t < Q(178.8)) drawBadge(g, t);
  const sk = shakeAt(t, SHAKES);
  if (Math.abs(sk.x) + Math.abs(sk.y) > .3) { TX.clearRect(0, 0, W, H); TX.drawImage(C, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.save(); g.translate(W / 2 + sk.x, H / 2 + sk.y); g.rotate(sk.r); g.scale(1.03, 1.03); g.drawImage(TMP, -W / 2, -H / 2); g.restore(); }
  bloom(g, t < Q(4) ? .55 : t < Q(16) ? .3 : t < Q(24) ? lerp(.42, .75, inv(TE + .15, LT[0], t)) : .32, 10);
  chroma(g, hits(t, CHROMA), .3);
  flash(g, hits(t, FLASHES));
  vignette(g, t < Q(16) ? .72 : .55);
  grain(g, t, .07);
  g.restore();
}
window.renderAt = renderAt;
(async () => {
  try { await document.fonts.load(F(900, 100)); await document.fonts.load(F(700, 100)); await document.fonts.load(F(500, 100)); buildReveal(); buildCards(); window.READY = 1; }
  catch (e) { window.ERR = e.message + '\n' + e.stack; }
})();
