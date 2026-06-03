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

  for (let i = 0; i < radarDots.length; i++) {
    let dot = radarDots[i];
    let a = radians(dot.angle);
    let x = cx + cos(a) * r * dot.dist;
    let y = cy + sin(a) * r * dot.dist;

    if (i < inventoryCount) {
      let charIndex = i % characters.length;
      let img = characters[charIndex][4];

      noStroke();
      fill(67, 224, 192, 45);
      ellipse(x, y, 100, 100);

      image(img, x, y, 90, 90);

      fill(180, 255, 220);
      textSize(13);
      text("UNLOCKED", x, y + 62);
    } else {
      noStroke();
      fill(67, 224, 192, 80);
      ellipse(x, y, 12, 12);

      fill(180, 255, 220, 120);
      textSize(13);
      text("LOCKED", x, y + 28);
    }
  }

  drawingContext.shadowBlur = 0;
}
