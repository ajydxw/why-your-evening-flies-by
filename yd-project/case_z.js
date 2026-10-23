// ---------- shot table + section hooks ----------
const fnOr = f => typeof f === 'function' ? f : null;
const SHOTS = [
  [B_0, shot1A], [P1B, shot1B], [Q(35.5), shot1C], [Q(39), shot1D],
  [Q(40), fnOr(typeof shot2A !== 'undefined' && shot2A)], [Q(42), fnOr(typeof shot2B !== 'undefined' && shot2B)], [Q(43), fnOr(typeof shot2C !== 'undefined' && shot2C)], [Q(44.5), fnOr(typeof shot2E !== 'undefined' && shot2E)], [Q(46), fnOr(typeof shot2D !== 'undefined' && shot2D)],
  [Q(48), fnOr(typeof shot3A !== 'undefined' && shot3A)], [Q(52), fnOr(typeof shot3B !== 'undefined' && shot3B)], [Q(53), fnOr(typeof shot3C !== 'undefined' && shot3C)],
  [Q(56), fnOr(typeof shot4A !== 'undefined' && shot4A)], [Q(58), fnOr(typeof shot4B !== 'undefined' && shot4B)], [Q(59), fnOr(typeof shot4C !== 'undefined' && shot4C)], [Q(62), fnOr(typeof shot4D !== 'undefined' && shot4D)],
];
const CASE_CUTS = [Q(40), Q(48), Q(56)];
function sceneB(g, t) {
  let s = null; for (const sh of SHOTS) if (t >= sh[0]) s = sh;
  if (s && s[1]) s[1](g, t); else { g.fillStyle = '#05040c'; g.fillRect(0, 0, W, H); txt(g, 'TODO ' + t.toFixed(2), 960, 540, 60, '#555', 900, 'center'); }
}
function postB(g, t) {
  for (const sh of SHOTS) { const u = t - sh[0]; if (sh[0] <= B_0 + .01 || u < 0 || u > .16) continue; const big = CASE_CUTS.some(c => Math.abs(c - sh[0]) < .01); sliceGlitch(g, t, (1 - u / .16) * (big ? 1 : .55), Math.round(sh[0] * 10)); }
  for (const c of CASE_CUTS) { const u = c - t; if (u > 0 && u < .2) sliceGlitch(g, t, .9 * (1 - u / .2), 7); }
  const red = sstep(.66, .78, dotU(t)); if (red > 0) vignette(g, .5 * red * (.75 + .25 * heartK(t)), '255,30,70');
  if (window.postCase) window.postCase(g, t);
  caseTag(g, t);
  drawCard(g, t, clamp(inv(B_0 + TRD * .78, B_0 + TRD, t)));
}
function overB(g, t) {
  if (t >= B_0 + TRD) return; const k = E.ioC(inv(B_0 + .03, B_0 + TRD, t)), a = 1 - inv(B_0 + TRD * .8, B_0 + TRD, t);
  const x = lerp(0, CARD.x, k), y = lerp(0, CARD.y, k), w = lerp(W, CARD.w, k), h = lerp(H, CARD.h, k), r = lerp(0, 16, k);
  g.save(); g.globalAlpha = a; g.shadowColor = 'rgba(0,0,0,.75)'; g.shadowBlur = 60 * k; g.shadowOffsetY = 20 * k; rr(g, x, y, w, h, r); g.fillStyle = '#000'; g.fill(); g.shadowColor = 'transparent';
  g.save(); rr(g, x, y, w, h, r); g.clip(); g.drawImage(SNAP, x, y, w, h); g.restore();
  g.strokeStyle = `rgba(235,245,255,${.8 * k})`; g.lineWidth = 3; rr(g, x, y, w, h, r); g.stroke(); g.restore();
}
function buildCaseSection() {
  HALL = buildHall(); PAPER = buildPaper(); DESK = buildDesk(); buildBooks();
  for (const f of [typeof build2 !== 'undefined' && build2, typeof build3 !== 'undefined' && build3, typeof build4 !== 'undefined' && build4, typeof buildCF !== 'undefined' && buildCF]) if (f) f();
  buildPhase();
}
// hits
SHAKES.push([B_0, 6, .3], [Q(33.3), 5, .25], [Q(34), 14, .35], [Q(35), 24, .5], [Q(36), 18, .45], [Q(36.5), 7, .3], [Q(37), 7, .3], [Q(37.5), 7, .3], [Q(38), 20, .45], [Q(38 + 1 / 3), 8, .25], [Q(38 + 2 / 3), 8, .25], [Q(39.5), 16, .4], [Q(40), 8, .3]);
FLASHES.push([B_0, .22, .14], [Q(34), .12, .1], [Q(35), .3, .2], [Q(38), .22, .18]);
CHROMA.push([B_0, 10, .35], [Q(34), 6, .25], [Q(35), 16, .5], [Q(35.5), 8, .3], [Q(36), 10, .35], [Q(38), 14, .4], [Q(39), 8, .3], [Q(39.5), 10, .35], [Q(40), 14, .4]);
const BLOOMS = [typeof bloomCase2 !== 'undefined' && bloomCase2, typeof bloomCase3 !== 'undefined' && bloomCase3, typeof bloomCase4 !== 'undefined' && bloomCase4].filter(Boolean);
window.bloomB = t => { for (const f of BLOOMS) { const v = f(t); if (v) return v; } return PAPER_BLOOM(t); };
window.sceneB = sceneB; window.postB = postB; window.overB = overB; window.buildCaseSection = buildCaseSection;
window.B_0 = B_0; window.TRD = TRD; window.SNX = SNX;
})();
