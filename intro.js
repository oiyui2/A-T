let introLines = [
  "2DO ORBITAL TASK GROWTH SYSTEM",
  "",
  "이 서비스는 오늘의 할 일을 기록하고,",
  "완료한 만큼 캐릭터가 성장하는 투두리스트입니다.",
  "",
  "작은 할 일 하나가 캐릭터의 진화로 이어지고,",
  "완료 기록은 나만의 성장 로그로 저장됩니다.",
  "",
  "Mission Crew : 박서정, 오유현",
  "",
  "Initializing Todo Growth System.... Done"
];

let currentLine = 0;
let currentChar = 0;
let typeSpeed = 2;

function showOnlyIntroUI() {
  hideAllUI();
}

function drawIntroPage() {
  background(0);

  drawIntroStars();
  drawCRTOverlay();

  fill(67, 224, 192);
  textFont("Share Tech Mono");
  textAlign(LEFT, TOP);
  textSize(28);

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "#43e0c0";

  updateIntroTyping();

  let startX = width * 0.13;
  let startY = height * 0.16;
  let lineH = 42;

  for (let i = 0; i <= currentLine && i < introLines.length; i++) {
    let lineText = introLines[i];

    if (i === currentLine) {
      lineText = introLines[i].substring(0, currentChar);
    }

    text(lineText, startX, startY + i * lineH);
  }

  drawingContext.shadowBlur = 0;

  fill(67, 224, 192, 180);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("System will move to login page soon...", width / 2, height * 0.88);

  if (millis() - introStartTime > introDuration) {
    currentPage = "login";
    showOnlyLoginUI();
  }

  textFont("sans-serif");
}

function updateIntroTyping() {
  if (frameCount % typeSpeed !== 0) return;
  if (currentLine >= introLines.length) return;

  currentChar++;

  if (currentChar > introLines[currentLine].length) {
    currentLine++;
    currentChar = 0;
  }
}

function drawIntroStars() {
  noStroke();

  for (let i = 0; i < 90; i++) {
    let x = (i * 137 + frameCount * 0.15) % width;
    let y = (i * 73) % height;
    let a = 80 + sin(frameCount * 0.04 + i) * 60;

    fill(120, 255, 230, a);
    ellipse(x, y, 1.5, 1.5);
  }
}

function drawCRTOverlay() {
  noStroke();

  for (let y = 0; y < height; y += 4) {
    fill(0, 0, 0, 35);
    rect(0, y, width, 2);
  }

  fill(67, 224, 192, 10);
  rect(0, 0, width, height);
}
