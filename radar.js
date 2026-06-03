function drawRadarPage() {
  if (navHomeBtn) navHomeBtn.hide();
  if (navTodoBtn) navTodoBtn.hide();
  if (navMusicBtn) navMusicBtn.hide();

  background(0);

  drawIntroStars();
  drawCRTOverlay();
  drawRadarGrid();
  drawRadar();
  drawRadarText();

  if (millis() - radarStartTime > radarDuration) {
    currentPage = "login";
    showOnlyLoginUI();
  }
}

function drawRadarGrid() {
  stroke(0, 255, 80, 55);
  strokeWeight(1);

  let gap = 55;

  for (let x = 0; x < width; x += gap) {
    line(x, 0, x, height);
  }

  for (let y = 0; y < height; y += gap) {
    line(0, y, width, y);
  }
}

function drawRadar() {
  let cx = width / 2;
  let cy = height / 2;
  let r = min(width, height) * 0.32;

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "#00ff66";

  noFill();
  stroke(0, 255, 80, 180);
  strokeWeight(2);

  ellipse(cx, cy, r * 2);
  ellipse(cx, cy, r * 1.45);
  ellipse(cx, cy, r * 0.85);
  ellipse(cx, cy, r * 0.35);

  for (let i = 0; i < 8; i++) {
    let a = TWO_PI / 8 * i;
    line(cx, cy, cx + cos(a) * r, cy + sin(a) * r);
  }

  for (let i = 0; i < 80; i++) {
    let a = TWO_PI / 80 * i;
    line(cx + cos(a) * r, cy + sin(a) * r, cx + cos(a) * (r + 10), cy + sin(a) * (r + 10));
  }

  let sweepAngle = frameCount * 0.035;
  let beamWidth = radians(36);

  noStroke();

  for (let i = 0; i < 30; i++) {
    let a1 = sweepAngle - beamWidth * (i / 30);
    let a2 = sweepAngle - beamWidth * ((i + 1) / 30);

    fill(0, 255, 80, map(i, 0, 30, 120, 0));

    beginShape();
    vertex(cx, cy);
    vertex(cx + cos(a1) * r, cy + sin(a1) * r);
    vertex(cx + cos(a2) * r, cy + sin(a2) * r);
    endShape(CLOSE);
  }

  for (let dot of radarDots) {
    let dotAngle = radians(dot.angle);
    let dotX = cx + cos(dotAngle) * r * dot.dist;
    let dotY = cy + sin(dotAngle) * r * dot.dist;

    let diff = abs(angleDifference(sweepAngle, dotAngle));
    let hit = diff < radians(8);

    if (hit) {
      fill(255, 255, 80, 240);
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = "#ffff66";
      ellipse(dotX, dotY, 14, 14);

      noFill();
      stroke(255, 255, 80, 180);
      strokeWeight(2);
      ellipse(dotX, dotY, 32 + sin(frameCount * 0.4) * 6);
    } else {
      drawingContext.shadowBlur = 8;
      drawingContext.shadowColor = "#00ff66";
      fill(0, 255, 80, 70);
      noStroke();
      ellipse(dotX, dotY, 7, 7);
    }
  }

  drawingContext.shadowBlur = 0;

  drawStaticNoise();
}

function drawRadarText() {
  fill(67, 224, 192);
  textFont("Share Tech Mono");
  textAlign(CENTER, CENTER);

  drawingContext.shadowBlur = 16;
  drawingContext.shadowColor = "#43e0c0";

  textSize(32);
  text("UNKNOWN LIFEFORM SCANNING", width / 2, height * 0.12);

  if (frameCount % radarTypeSpeed === 0 && radarCurrentChar < radarMessage.length) {
    radarCurrentChar++;
  }

  textSize(30);
  let shown = radarMessage.substring(0, radarCurrentChar);
  text(shown, width / 2, height * 0.84);

  if (frameCount % 45 < 25) {
    text("█", width / 2 + textWidth(shown) / 2 + 18, height * 0.84);
  }

  textSize(16);
  fill(67, 224, 192, 150);
  text("SIGNAL DETECTION : 7 OBJECTS / STATUS : ANALYZING", width / 2, height * 0.90);

  textAlign(RIGHT, CENTER);
  textSize(14);
  text("Press F to skip radar sequence", width - 40, height - 40);

  drawingContext.shadowBlur = 0;
  textFont("sans-serif");
}

function angleDifference(a, b) {
  return (a - b + PI) % TWO_PI - PI;
}

function drawStaticNoise() {
  noStroke();

  for (let i = 0; i < 130; i++) {
    fill(120, 255, 230, random(10, 65));
    rect(random(width), random(height), random(1, 4), random(1, 3));
  }

  if (frameCount % 18 === 0) {
    fill(67, 224, 192, 35);
    rect(0, random(height), width, random(2, 8));
  }
}
