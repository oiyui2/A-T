// p5.js 기본 실행 함수 / 클릭 처리 / 공통 계산 / 배경
// ============================================================

function setup() {
createCanvas(windowWidth, windowHeight);
imageMode(CENTER);
textAlign(CENTER, CENTER);

loadInventory();

for (let i = 0; i < 30; i++) {
stars.push(createStar());
}

buildInputPageUI();
buildMainPageUI();
buildResultPageUI();
buildMusicPageUI();
buildNavBar();
buildLoginUI();

introStartTime = millis();
showOnlyIntroUI();

}


// ============================================================
// draw
// ============================================================

function draw() {
  if (currentPage === "intro") {
    drawIntroPage();
  } else if (currentPage === "radar") {
    drawRadarPage();
  } else if (currentPage === "login") {
    drawLoginPage();
  } else if (currentPage === "input") {
    drawInputPage();
  } else if (currentPage === "main") {
    drawMainPage();
  } else if (currentPage === "dex") {
    drawDexPage();
  } else if (currentPage === "result") {
    drawResultPage();
  } else if (currentPage === "music") {
    drawMusicPage();
  }

  positionUI();

  if (currentPage === "login") {
    loginInput.show();
    loginButton.show();

    loginInput.position(width / 2 - 250, height * 0.60);
    loginInput.size(350, 54);

    loginButton.position(width / 2 + 115, height * 0.60);
    loginButton.size(135, 54);
}
}

// ============================================================
// UI 생성
// ============================================================
function mousePressed() {
if (currentPage === "main") {
if (timerPanelOpen) {
let px = width / 2 - 520 / 2;
let py = height / 2 - 420 / 2;

if (mouseX < px || mouseX > px + 520 || mouseY < py || mouseY > py + 420) {
closeTimerPanel();
return;
}
}

handleCharacterClick();
handleChecklistClick();
handleTimerClicks();
} else if (currentPage === "music") {
handleMusicClick();
}
}

function handleCharacterClick() {
let charX = width * 0.22;
let charY = height * 0.42;
let charSize = min(width, height) * 0.68;

let d = dist(mouseX, mouseY, charX, charY);

if (d < charSize * 0.42) {
clickEffect = 1.2;
}
}

function handleChecklistClick() {
let layout = getTodoLayout();

let listX = layout.listX;
let listY = layout.listY;
let boxSize = layout.boxSize;
let gap = layout.rowGap;

for (let i = 0; i < todoList.length; i++) {
let y = listY + i * gap;

if (
mouseX > listX &&
mouseX < listX + boxSize &&
mouseY > y - boxSize / 2 &&
mouseY < y + boxSize / 2
) {
todoList[i].done = !todoList[i].done;
clickEffect = 1.15;
characterAnimating = true;

if (todoList[i].timer) {
let t = todoList[i].timer;

if (todoList[i].done && t.running) {
t.running = false;
t.finished = true;
t.expired = false;
}
}

if (countDone() === todoList.length) {
finalBurst = 1;
}

saveProgress();

return;
}
}
}

function handleTimerClicks() {
let layout = getTodoLayout();

let listX = layout.listX;
let listY = layout.listY;
let listW = layout.listW;
let gap = layout.rowGap;

let timerBoxX = listX + listW + 38;
let playX = listX + listW + 100;

for (let i = 0; i < todoList.length; i++) {
let y = listY + i * gap;

if (dist(mouseX, mouseY, timerBoxX, y) < 16) {
openTimerPanel(i);
return;
}

let t = todoList[i].timer;

if (t.mode === "duration" && !t.running && !t.finished) {
if (dist(mouseX, mouseY, playX, y) < 18) {
startTimer(i);
return;
}
}
}
}


// ============================================================
// 계산 함수
// ============================================================

function countDone() {
let count = 0;

for (let todo of todoList) {
if (todo.done) {
count++;
}
}

return count;
}

function getStageIndex(doneCount, totalCount) {
if (totalCount <= 0) return 0;

let stageIndex = floor((doneCount * 4) / totalCount);
stageIndex = constrain(stageIndex, 0, 4);

return stageIndex;
}

function getCurrentCharacterImage(stageIndex) {
return characters[selectedCharacterIndex][stageIndex];
}

function formatTime(sec) {
let h = Math.floor(sec / 3600);
let m = Math.floor((sec % 3600) / 60);
let s = Math.floor(sec % 60);

if (h > 0) {
return nf(h, 1) + ":" + nf(m, 2) + ":" + nf(s, 2);
} else {
return nf(m, 2) + ":" + nf(s, 2);
}
}


// ============================================================
let lastMouseX = 0;
let lastMouseY = 0;
let mouseMovingPower = 0;

function createStar() {
  return {
    x: random(width),
    y: random(height),
    homeX: random(width),
    homeY: random(height),
    size: random(1.5, 4),
    speed: random(0.01, 0.04),
    twinkle: random(TWO_PI),
    tailX: 0,
    tailY: 0
  };
}

function drawStars() {
  let mouseMove = dist(mouseX, mouseY, lastMouseX, lastMouseY);

  if (mouseMove > 2) {
    mouseMovingPower = min(mouseMovingPower + 0.06, 1);
  } else {
    mouseMovingPower = max(mouseMovingPower - 0.02, 0);
  }

  lastMouseX = mouseX;
  lastMouseY = mouseY;

  noStroke();

  for (let s of stars) {
    let d = dist(s.x, s.y, mouseX, mouseY);
    let pullRange = 380;
    let pullStrength = map(constrain(d, 0, pullRange), 0, pullRange, 0.08, 0);

    if (mouseMovingPower > 0.05 && d < pullRange) {
      s.tailX = s.x;
      s.tailY = s.y;

      s.x = lerp(s.x, mouseX, pullStrength * mouseMovingPower);
      s.y = lerp(s.y, mouseY, pullStrength * mouseMovingPower);
    } else {
      s.x = lerp(s.x, s.homeX, s.speed);
      s.y = lerp(s.y, s.homeY, s.speed);
    }

    let alpha = 130 + sin(frameCount * 0.04 + s.twinkle) * 70;

    if (mouseMovingPower > 0.1 && d < pullRange) {
      stroke(255, 255, 255, 80 * mouseMovingPower);
      strokeWeight(1);
      line(s.tailX, s.tailY, s.x, s.y);
      noStroke();

      fill(255, 255, 255, alpha + 50);
      ellipse(s.x, s.y, s.size * 1.5);
    } else {
      fill(255, 255, 255, alpha);
      ellipse(s.x, s.y, s.size);
    }
  }
}

function drawGradientBG(c1, c2) {
  if (typeof spaceBg !== "undefined" && spaceBg) {
    imageMode(CORNER);
    image(spaceBg, 0, 0, width, height);
    imageMode(CENTER);

    noStroke();
    fill(0, 0, 0, 95);
    rect(0, 0, width, height);
  } else {
    noStroke();

    for (let y = 0; y < height; y++) {
      let inter = map(y, 0, height, 0, 1);
      fill(lerpColor(c1, c2, inter));
      rect(0, y, width, 1);
    }
  }

  drawStars();
  drawScanLines();
  drawSystemHud();
}


// ============================================================
// 창 크기 변경 대응
// ============================================================

function windowResized() {
resizeCanvas(windowWidth, windowHeight);

if (currentPage === "main") {
createPathNodes();
}

if (timerPanelOpen) {
let currentIndex = timerPanelIndex;
closeTimerPanelDOM();
timerPanelOpen = false;
openTimerPanel(currentIndex);
  }
}
function keyPressed() {
  if (key === "f" || key === "F") {
    if (currentPage === "intro") {
      currentPage = "radar";
      radarStartTime = millis();
      radarCurrentChar = 0;
      hideAllUI();
    } else if (currentPage === "radar") {
      currentPage = "login";
      showOnlyLoginUI();
    }
  }
  function drawScanLines() {
  noStroke();

  for (let y = 0; y < height; y += 4) {
    fill(0, 0, 0, 28);
    rect(0, y, width, 2);
  }

  fill(95, 255, 224, 8);
  rect(0, 0, width, height);
}

function drawSystemHud() {
  if (currentPage === "intro" || currentPage === "radar" || currentPage === "login") return;

  textFont("Share Tech Mono");
  textAlign(LEFT, CENTER);
  textSize(14);

  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = "#5fffe0";

  fill(95, 255, 224, 165);
  text("DATE : 2090.09.21", 32, height - 78);
  text("MISSION STATUS : ACTIVE", 32, height - 54);
  text("CREW : PARK / OH", 32, height - 30);

  textAlign(RIGHT, CENTER);
  text("SIGNAL STRENGTH : 97%", width - 32, height - 54);
  text("SYSTEM : 2DO ORBITAL TASK", width - 32, height - 30);

  drawingContext.shadowBlur = 0;
  textFont("sans-serif");
}
}

