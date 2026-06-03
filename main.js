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
  } else if (currentPage === "result") {
    drawResultPage();
  } else if (currentPage === "music") {
    drawMusicPage();
  }

  positionUI();
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
function createStar() {
return {
x: random(width),
y: random(height),
size: random(2, 5),
speed: random(0.05, 2),
brightness: random(150, 255)
};
}

function drawStars() {
noStroke();

for (let s of stars) {
s.x += (mouseX - s.x) * 0.005 * s.speed;
s.y += (mouseY - s.y) * 0.005 * s.speed;

let flicker = sin(frameCount * 0.05 + s.brightness) * 40;
fill(255, 255, 200, s.brightness + flicker);
ellipse(s.x, s.y, s.size);
}
}

function drawGradientBG(c1, c2) {
noStroke();

for (let y = 0; y < height; y++) {
let inter = map(y, 0, height, 0, 1);
fill(lerpColor(c1, c2, inter));
rect(0, y, width, 1);
}

drawStars();
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
}

