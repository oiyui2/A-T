function drawDexPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));

  fill(255);
  textFont("Share Tech Mono");
  textAlign(CENTER, CENTER);
  textSize(42);
  text("CHARACTER RADAR DEX", width / 2, height * 0.14);

  fill(220, 210, 255);
  textSize(20);
  text("보유 캐릭터: " + inventoryCount + " / ?", width / 2, height * 0.20);

  drawDexRadar();
  drawDexExplorationPopup();

  textFont("sans-serif");
}

function drawDexRadar() {
  let cx = width / 2;
  let cy = height * 0.56;
  let r = min(width, height) * 0.30;

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "#43e0c0";

  noFill();
  stroke(67, 224, 192, 170);
  strokeWeight(2);

  ellipse(cx, cy, r * 2);
  ellipse(cx, cy, r * 1.45);
  ellipse(cx, cy, r * 0.85);
  ellipse(cx, cy, r * 0.35);

  for (let i = 0; i < 8; i++) {
    let a = TWO_PI / 8 * i;
    line(cx, cy, cx + cos(a) * r, cy + sin(a) * r);
  }

  let sweepAngle = frameCount * 0.035;
  let beamWidth = radians(36);

  noStroke();

  for (let i = 0; i < 30; i++) {
    let a1 = sweepAngle - beamWidth * (i / 30);
    let a2 = sweepAngle - beamWidth * ((i + 1) / 30);

    fill(67, 224, 192, map(i, 0, 30, 95, 0));

    beginShape();
    vertex(cx, cy);
    vertex(cx + cos(a1) * r, cy + sin(a1) * r);
    vertex(cx + cos(a2) * r, cy + sin(a2) * r);
    endShape(CLOSE);
  }

  for (let i = 0; i < min(inventoryCount, radarDots.length); i++) {
    let pos = getDexNodePosition(i);
    let a = pos.angle;
    let x = pos.x;
    let y = pos.y;

    let diff = abs(angleDifference(sweepAngle, a));
    let hit = diff < radians(8);

    let charIndex = i % characters.length;
    let img = characters[charIndex][4];

    noStroke();

    if (hit) {
      fill(67, 224, 192, 95);
      ellipse(x, y, 118 + sin(frameCount * 0.4) * 8, 118 + sin(frameCount * 0.4) * 8);
    } else {
      fill(67, 224, 192, 35);
      ellipse(x, y, 100, 100);
    }

    image(img, x, y, 90, 90);

    fill(180, 255, 220);
  textFont("Share Tech Mono");
  textSize(13);
  textAlign(CENTER, CENTER);
  text("UNLOCKED", x, y + 62);
  }

  drawUnknownDexDots(cx, cy, r, sweepAngle);

  drawingContext.shadowBlur = 0;
}

function drawUnknownDexDots(cx, cy, r, sweepAngle) {
  let unknownDots = [
    { angle: 8, dist: 0.76, size: 9 },
    { angle: 26, dist: 0.88, size: 7 },
    { angle: 48, dist: 0.69, size: 8 },
    { angle: 72, dist: 0.82, size: 6 },
    { angle: 96, dist: 0.74, size: 9 },
    { angle: 118, dist: 0.91, size: 7 },
    { angle: 142, dist: 0.77, size: 8 },
    { angle: 168, dist: 0.86, size: 6 },
    { angle: 196, dist: 0.71, size: 9 },
    { angle: 219, dist: 0.90, size: 7 },
    { angle: 244, dist: 0.78, size: 8 },
    { angle: 263, dist: 0.93, size: 6 },
    { angle: 287, dist: 0.70, size: 9 },
    { angle: 312, dist: 0.84, size: 7 },
    { angle: 338, dist: 0.76, size: 8 },
    { angle: 354, dist: 0.90, size: 6 },
    { angle: 37, dist: 0.47, size: 7 },
    { angle: 154, dist: 0.52, size: 6 },
    { angle: 231, dist: 0.49, size: 7 },
    { angle: 326, dist: 0.55, size: 6 }
  ];

  for (let i = 0; i < unknownDots.length; i++) {
    let dot = unknownDots[i];
    let a = radians(dot.angle);
    let x = cx + cos(a) * r * dot.dist;
    let y = cy + sin(a) * r * dot.dist;

    let diff = abs(angleDifference(sweepAngle, a));
    let hit = diff < radians(7);

    noStroke();

    if (hit) {
      drawingContext.shadowBlur = 22;
      drawingContext.shadowColor = "#ffff66";
      fill(255, 255, 120, 230);
      ellipse(x, y, dot.size + 7, dot.size + 7);

      noFill();
      stroke(255, 255, 120, 150);
      strokeWeight(2);
      ellipse(x, y, 28 + sin(frameCount * 0.4) * 5);
    } else {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = "#43e0c0";
      fill(67, 224, 192, 150);
      ellipse(x, y, dot.size, dot.size);
    }
  }

  drawingContext.shadowBlur = 0;
}

function getDexNodePosition(index) {
  let cx = width / 2;
  let cy = height * 0.56;
  let r = min(width, height) * 0.30;
  let dot = radarDots[index];
  let a = radians(dot.angle);

  return {
    x: cx + cos(a) * r * dot.dist,
    y: cy + sin(a) * r * dot.dist,
    angle: a
  };
}

function handleDexClick() {
  if (dexPopupRecordIndex >= 0) {
    dexPopupRecordIndex = -1;
    playValidClickSound();
    return;
  }

  for (let i = 0; i < min(inventoryCount, radarDots.length); i++) {
    let pos = getDexNodePosition(i);

    if (dist(mouseX, mouseY, pos.x, pos.y) < 58) {
      dexPopupRecordIndex = i;
      playValidClickSound();
      return;
    }
  }
}

function drawDexExplorationPopup() {
  if (dexPopupRecordIndex < 0) return;

  let record = explorationRecords[dexPopupRecordIndex];
  if (!record) return;

  let pw = min(760, width * 0.72);
  let ph = min(520, height * 0.72);
  let px = width / 2 - pw / 2;
  let py = height / 2 - ph / 2;

  noStroke();
  fill(0, 5, 12, 165);
  rect(0, 0, width, height);

  drawingContext.shadowBlur = 24;
  drawingContext.shadowColor = "#5fffe0";
  fill(5, 18, 34, 246);
  rect(px, py, pw, ph, 8);
  noFill();
  stroke(95, 255, 224, 180);
  strokeWeight(1.4);
  rect(px, py, pw, ph, 8);
  drawingContext.shadowBlur = 0;

  textFont("Orbitron");
  textStyle(BOLD);
  noStroke();
  fill(235, 255, 252);
  textAlign(LEFT, CENTER);
  textSize(24);
  text("EXPLORATION LOG", px + 32, py + 42);

  textFont("Share Tech Mono");
  textStyle(NORMAL);
  fill(160, 255, 238);
  textSize(14);
  text("Completion " + record.completionRate + "%  /  Entity #" + (dexPopupRecordIndex + 1), px + 34, py + 74);

  drawExplorationRoute(record, px + 44, py + 128, pw - 88, ph - 180);

  fill(255, 130, 160);
  textAlign(RIGHT, CENTER);
  textSize(13);
  text("click panel to close", px + pw - 28, py + ph - 24);
}

function drawExplorationRoute(record, x, y, w, h) {
  let todos = record.todos || [];
  if (todos.length === 0) return;

  let nodeGap = h / max(todos.length - 1, 1);
  let nodePositions = [];

  stroke(95, 255, 224, 110);
  strokeWeight(2);
  noFill();
  beginShape();

  for (let i = 0; i < todos.length; i++) {
    let px = x + (i % 2) * min(80, w * 0.12);
    let py = y + i * nodeGap;
    nodePositions.push({ x: px, y: py });
    vertex(px, py);
  }

  endShape();

  for (let i = 0; i < todos.length; i++) {
    let todo = todos[i];
    let pos = nodePositions[i];

    noStroke();
    fill(95, 255, 224);
    ellipse(pos.x, pos.y, 13, 13);

    fill(235, 255, 252);
    textAlign(LEFT, CENTER);
    textSize(15);
    text((i + 1) + ". " + todo.title, pos.x + 24, pos.y);

    let logs = getRecordLogsForIndex(record, todo.index);
    for (let j = 0; j < logs.length; j++) {
      fill(255, 190, 220);
      textSize(13);
      text('"' + logs[j].text + '"', pos.x + 44, pos.y + 22 + j * 18);
    }
  }
}

function getRecordLogsForIndex(record, index) {
  let logs = [];

  for (let log of record.logs || []) {
    if (log.index === index) logs.push(log);
  }

  return logs;
}
