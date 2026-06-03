function drawDexPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));

  fill(255);
  textFont("Share Tech Mono");
  textAlign(CENTER, CENTER);
  textSize(42);
  text("CHARACTER RADAR DEX", width / 2, height * 0.14);

  fill(220, 210, 255);
  textSize(20);
  text("보유 캐릭터: " + inventoryCount + " / 7", width / 2, height * 0.20);

  drawDexRadar();

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

  // 돌아가는 레이더 빔
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

  // 도감 점 / 캐릭터
  for (let i = 0; i < radarDots.length; i++) {
    let dot = radarDots[i];
    let a = radians(dot.angle);
    let x = cx + cos(a) * r * dot.dist;
    let y = cy + sin(a) * r * dot.dist;

    let diff = abs(angleDifference(sweepAngle, a));
    let hit = diff < radians(8);

    if (i < inventoryCount) {
      let charIndex = i % characters.length;
      let img = characters[charIndex][4];

      // 보유 캐릭터: 캐릭터는 계속 보이고, 레이더가 닿으면 바탕 원만 깜빡
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
      textSize(13);
      text("UNLOCKED", x, y + 62);

    } else {
      // 미보유 캐릭터: 점만 있다가 레이더가 닿으면 깜빡
      noStroke();

      if (hit) {
        drawingContext.shadowBlur = 25;
        drawingContext.shadowColor = "#ffff66";
        fill(255, 255, 80, 240);
        ellipse(x, y, 16, 16);

        noFill();
        stroke(255, 255, 80, 180);
        strokeWeight(2);
        ellipse(x, y, 32 + sin(frameCount * 0.4) * 6);
        drawingContext.shadowBlur = 18;
        drawingContext.shadowColor = "#43e0c0";
      } else {
        fill(67, 224, 192, 80);
        ellipse(x, y, 12, 12);
      }

      noStroke();
      fill(180, 255, 220, 120);
      textSize(13);
      text("LOCKED", x, y + 28);
    }
  }

  drawingContext.shadowBlur = 0;
}
