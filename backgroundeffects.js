function drawSpaceRings3D(g) {
  g.push();

  let planetX = width * 0.28;
  let planetY = height * 0.02;

  g.translate(planetX, planetY, 0);
  g.rotateX(PI / 2.6);
  g.rotateZ(frameCount * 0.002);

  g.noFill();
  g.stroke(120, 220, 255, 90);
  g.strokeWeight(1.2);

  let r1 = min(width, height) * 0.20;
  let r2 = min(width, height) * 0.27;

  g.ellipse(0, 0, r1 * 2.2, r1 * 0.62);
  g.ellipse(0, 0, r2 * 2.1, r2 * 0.55);

  g.pop();
}


