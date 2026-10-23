// ================= dispatch for the main film (after the opening) =================
const SCENES = [scene1, scene2, scene3];
function renderMain(g, t) {
  if (t < S1E) scene1(g, t);
  else if (t < S2) rowSegment(g, t, 0);
  else if (t < S2E) scene2(g, t);
  else if (t < S3) rowSegment(g, t, 1);
  else if (t < S3E) scene3(g, t);
  else if (t < WHY) rowSegment(g, t, 2);
  else if (t < BRK) sceneWhy(g, t);
  else if (t < FIN) scene6(g, t);
  else scene7(g, t);
}
