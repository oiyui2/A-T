
// ============================================================
// 2DO sketch.js
// 기본 BGM + 8개 음악 stem 동기화 레이어 반영 버전
// ============================================================

let currentPage = "input";

let characters = [];
let selectedCharacterIndex = 0;
let loadedFromSave = false;

let angleSpeed = 0.05;
let clickEffect = 1;
let characterAnimating = true;
let finalBurst = 0;

let stars = [];

let baseBgm;
let musicStems = [];

const BASE_BGM_FILE = "bgm.mp3";
const STEM_FILES = [
  "track1.mp3",
  "track2.mp3",
  "track3.mp3",
  "track4.mp3",
  "track5.mp3",
  "track6.mp3",
  "track7.mp3",
  "track8.mp3"
];

const MIN_TODO_COUNT = 4;
const MAX_TODO_COUNT = 8;
const BASE_BGM_VOLUME = 0.35;
const STEM_VOLUME = 0.85;
const MUSIC_FADE_SEC = 0.45;
const SYNC_CHECK_INTERVAL_FRAMES = 120;
const SYNC_TOLERANCE_SEC = 0.06;
const AUDIO_LOOP_SECONDS = 0;

let musicStarted = false;
let musicEnabled = true;
let lastAppliedStemCount = -1;
let lastSyncCheckFrame = 0;

let todoList = [];
let inputBox;
let addButton;
let completeButton;
let fullscreenButton;
let loadButton;
let resetAllButton;
let messageText = "";

let pathNodes = [];

let resultButton;
let saveImageButton;
let musicPageButton;
let restartButton;
let backToMainButton;
let stopMusicButton;
let inventoryCount = 0;
let rewardClaimed = false;

let timerPanelOpen = false;
let timerPanelIndex = -1;
let timerMode = "duration";
let timerHour = 0;
let timerMin = 0;
let timerSec = 0;
let hourInput, minInput, secInput;
let durationBtn, deadlineBtn, timerConfirmBtn;
let hourMinusBtn, hourPlusBtn, minMinusBtn, minPlusBtn, secMinusBtn, secPlusBtn;
let quickButtons = [];
let panelElements = [];
let penaltyList = [];

let creatorNames = "박서정, 오유현";
let creatorSchool = "";

let navHomeBtn, navTodoBtn, navMusicBtn;
let musicToggleBtn;

function preload() {
  characters[0] = [loadImage("1단계불.png"), loadImage("2단계불.png"), loadImage("3단계불.png"), loadImage("4단계불.png"), loadImage("5단계불.png")];
  characters[1] = [loadImage("1단계구름.png"), loadImage("2단계구름.png"), loadImage("3단계구름.png"), loadImage("4단계구름.png"), loadImage("5단계구름.png")];
  characters[2] = [loadImage("1단계유령.png"), loadImage("2단계유령.png"), loadImage("3단계유령.png"), loadImage("4단계유령.png"), loadImage("5단계유령.png")];
  characters[3] = [loadImage("1단계구.png"), loadImage("2단계구.png"), loadImage("3단계구.png"), loadImage("4단계구.png"), loadImage("5단계구.png")];
  baseBgm = loadSound(BASE_BGM_FILE);
  for (let i = 0; i < STEM_FILES.length; i++) musicStems[i] = loadSound(STEM_FILES[i]);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);
  loadInventory();
  for (let i = 0; i < 30; i++) stars.push(createStar());
  buildInputPageUI();
  buildMainPageUI();
  buildResultPageUI();
  buildMusicPageUI();
  buildNavBar();
  showOnlyInputUI();
}

function draw() {
  if (currentPage === "input") drawInputPage();
  else if (currentPage === "main") drawMainPage();
  else if (currentPage === "result") drawResultPage();
  else if (currentPage === "music") drawMusicPage();
  updateLayeredMusicByTodoProgress(false);
  maintainMusicSync();
  positionUI();
}

function buildInputPageUI() {
  inputBox = createInput("");
  inputBox.attribute("placeholder", "할 일을 입력하세요");
  inputBox.style("font-size", "16px");
  inputBox.style("padding", "6px 16px");
  inputBox.style("box-sizing", "border-box");
  inputBox.style("border", "2px solid #7c5cbf");
  inputBox.style("border-radius", "12px");
  inputBox.style("outline", "none");
  inputBox.style("width", "320px");
  inputBox.style("background", "rgba(255,255,255,0.95)");
  inputBox.style("color", "#222");
  inputBox.elt.addEventListener("keydown", e => { if (e.key === "Enter") addTodo(); });
  addButton = createButton("추가"); styleButton(addButton, "#A478C0"); addButton.mousePressed(addTodo);
  completeButton = createButton("오늘 할 일 시작"); styleButton(completeButton, "#e8578a"); completeButton.mousePressed(goToMainPage);
  fullscreenButton = createButton("전체화면"); styleButton(fullscreenButton, "#5f6fbf"); fullscreenButton.mousePressed(turnOnFullscreen);
  loadButton = createButton("저장 기록 불러오기"); styleButton(loadButton, "#9a7ac7"); loadButton.mousePressed(loadProgress);
  resetAllButton = createButton("전체 초기화"); styleButton(resetAllButton, "#555"); resetAllButton.mousePressed(resetAllData);
}

function buildMainPageUI() { resultButton = createButton("오늘 결과 보기"); styleButton(resultButton, "#e8578a"); resultButton.mousePressed(goToResultPage); }

function buildResultPageUI() {
  saveImageButton = createButton("결과 이미지 저장"); styleButton(saveImageButton, "#e8578a"); saveImageButton.mousePressed(downloadResultImage);
  musicPageButton = createButton("곡 플레이 화면"); styleButton(musicPageButton, "#7c5cbf"); musicPageButton.mousePressed(goToMusicPage);
  restartButton = createButton("새 할 일 시작"); styleButton(restartButton, "#5f6fbf"); restartButton.mousePressed(restartProgram);
}

function buildMusicPageUI() {
  backToMainButton = createButton("결과 화면으로"); styleButton(backToMainButton, "#7c5cbf"); backToMainButton.mousePressed(goBackToResultPage);
  stopMusicButton = createButton("음악 정지"); styleButton(stopMusicButton, "#555"); stopMusicButton.mousePressed(stopAllSongs);
  musicToggleBtn = createButton("🔊 음악: 켜짐"); styleButton(musicToggleBtn, "#5cb85c"); musicToggleBtn.mousePressed(toggleMusicEnabled);
}

function toggleMusicEnabled() {
  musicEnabled = !musicEnabled;
  if (musicEnabled) { musicToggleBtn.html("🔊 음악: 켜짐"); musicToggleBtn.style("background", "#5cb85c"); startLayeredMusicIfNeeded(); }
  else { musicToggleBtn.html("🔇 음악: 꺼짐"); musicToggleBtn.style("background", "#999"); }
  updateLayeredMusicByTodoProgress(true);
}

function buildNavBar() {
  navHomeBtn = createButton("🏠 홈"); styleNavButton(navHomeBtn); navHomeBtn.mousePressed(navToHome);
  navTodoBtn = createButton("✅ 투두"); styleNavButton(navTodoBtn); navTodoBtn.mousePressed(navToTodo);
  navMusicBtn = createButton("🎵 곡 재생"); styleNavButton(navMusicBtn); navMusicBtn.mousePressed(navToMusic);
}

function styleNavButton(btn) { btn.style("font-size", "15px"); btn.style("border", "none"); btn.style("border-radius", "999px"); btn.style("background", "rgba(255,255,255,0.12)"); btn.style("color", "white"); btn.style("cursor", "pointer"); btn.style("font-weight", "bold"); addHoverEffect(btn, 1.10); }
function navToHome() { closeTimerPanel(); currentPage = "input"; showOnlyInputUI(); }
function navToTodo() {
  if (todoList.length < MIN_TODO_COUNT) { messageText = "투두 화면은 할 일을 4개 이상 입력해야 들어갈 수 있어요."; currentPage = "input"; showOnlyInputUI(); return; }
  if (todoList.length > MAX_TODO_COUNT) { messageText = "할 일은 최대 8개까지만 입력할 수 있어요."; currentPage = "input"; showOnlyInputUI(); return; }
  if (pathNodes.length === 0) { if (!loadedFromSave) selectedCharacterIndex = floor(random(characters.length)); rewardClaimed = false; finalBurst = 0; characterAnimating = true; createPathNodes(); }
  currentPage = "main"; showOnlyMainUI(); startLayeredMusicIfNeeded(); updateLayeredMusicByTodoProgress(true); saveProgress();
}
function navToMusic() { closeTimerPanel(); currentPage = "music"; showOnlyMusicUI(); startLayeredMusicIfNeeded(); updateLayeredMusicByTodoProgress(true); }
function positionNav() { let bw = 120, gap = 10, by = 20, totalW = bw * 3 + gap * 2, startX = width / 2 - totalW / 2; navHomeBtn.size(bw, 42); navTodoBtn.size(bw, 42); navMusicBtn.size(bw, 42); navHomeBtn.position(startX, by); navTodoBtn.position(startX + bw + gap, by); navMusicBtn.position(startX + (bw + gap) * 2, by); }
function updateNavHighlight() { let active = "rgba(124,92,191,0.95)", idle = "rgba(255,255,255,0.12)"; navHomeBtn.style("background", currentPage === "input" ? active : idle); navTodoBtn.style("background", currentPage === "main" ? active : idle); navMusicBtn.style("background", currentPage === "music" ? active : idle); }
function addHoverEffect(btn, scaleAmt) { let s = scaleAmt || 1.08; btn.style("transition", "transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease"); btn.style("transform-origin", "center center"); btn.mouseOver(() => { btn.style("transform", "scale(" + s + ")"); btn.style("box-shadow", "0 6px 18px rgba(0,0,0,0.35)"); btn.style("filter", "brightness(1.08)"); }); btn.mouseOut(() => { btn.style("transform", "scale(1.0)"); btn.style("box-shadow", "none"); btn.style("filter", "brightness(1.0)"); }); }
function styleButton(btn, bgColor) { btn.style("font-size", "16px"); btn.style("padding", "12px 20px"); btn.style("border", "none"); btn.style("border-radius", "12px"); btn.style("background", bgColor); btn.style("color", "white"); btn.style("cursor", "pointer"); btn.style("font-weight", "bold"); addHoverEffect(btn); }

function hideAllUI() {
  for (let el of [inputBox, addButton, completeButton, fullscreenButton, loadButton, resetAllButton, resultButton, saveImageButton, musicPageButton, restartButton, backToMainButton, stopMusicButton, musicToggleBtn]) if (el) el.hide();
  closeTimerPanelDOM(); timerPanelOpen = false; timerPanelIndex = -1;
}
function showOnlyInputUI() { hideAllUI(); inputBox.show(); addButton.show(); completeButton.show(); fullscreenButton.show(); loadButton.show(); resetAllButton.show(); }
function showOnlyMainUI() { hideAllUI(); resultButton.show(); }
function showOnlyResultUI() { hideAllUI(); saveImageButton.show(); musicPageButton.show(); restartButton.show(); resetAllButton.show(); }
function showOnlyMusicUI() { hideAllUI(); backToMainButton.show(); stopMusicButton.show(); musicToggleBtn.show(); }

function positionUI() {
  positionNav(); updateNavHighlight();
  if (currentPage === "input") {
    let inputW = min(500, width * 0.45), inputH = 42, addW = 105, gap = 14, groupW = inputW + gap + addW, groupX = width * 0.36 - groupW / 2, inputY = height * 0.34;
    inputBox.size(inputW, inputH); addButton.size(addW, inputH); inputBox.position(groupX, inputY); addButton.position(groupX + inputW + gap, inputY);
    completeButton.size(230, 58); loadButton.size(260, 58); resetAllButton.size(210, 58);
    completeButton.position(width * 0.36 - 115, height * 0.48); loadButton.position(width * 0.36 - 130, height * 0.59); resetAllButton.position(width * 0.36 - 105, height * 0.70); fullscreenButton.position(width - 150, 30);
  }
  if (currentPage === "main") resultButton.position(width - 190, height - 80);
  if (currentPage === "result") { saveImageButton.position(width / 2 - 320, height * 0.88); musicPageButton.position(width / 2 - 145, height * 0.88); restartButton.position(width / 2 + 25, height * 0.88); resetAllButton.position(width / 2 + 175, height * 0.88); }
  if (currentPage === "music") { musicToggleBtn.size(180, 56); stopMusicButton.size(150, 56); backToMainButton.size(150, 56); musicToggleBtn.position(width - 520, height - 84); stopMusicButton.position(width - 350, height - 84); backToMainButton.position(width - 180, height - 84); }
}

function turnOnFullscreen() { fullscreen(true); resizeCanvas(windowWidth, windowHeight); }

function drawInputPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));
  fill(255); textStyle(BOLD); textSize(min(width, height) * 0.060); text("2DO", width / 2, height * 0.10);
  textStyle(NORMAL); textSize(min(width, height) * 0.028); text("할 일을 완수할수록 캐릭터가 성장하는 투두리스트", width / 2, height * 0.17);
  fill(220, 210, 255); textSize(min(width, height) * 0.020); text("오늘의 할 일을 최소 4개, 최대 8개까지 입력하세요. 완료도에 따라 음악 트랙이 점점 더해집니다.", width / 2, height * 0.24);
  fill(255); textSize(min(width, height) * 0.024); text("현재 입력된 할 일: " + todoList.length + "개", width / 2, height * 0.78);
  if (messageText !== "") { fill(255, 180, 200); textSize(min(width, height) * 0.018); text(messageText, width / 2, height * 0.83); }
  drawInputTodoPreview();
  fill(220, 210, 255); textSize(16); textAlign(RIGHT, CENTER); text(creatorNames, width - 40, height - 40); textAlign(CENTER, CENTER);
}

function drawInputTodoPreview() {
  let boxW = min(330, width * 0.24), boxH = 310, boxX = width * 0.79, boxY = height * 0.30;
  noStroke(); fill(255, 255, 255, 35); rect(boxX - boxW / 2, boxY, boxW, boxH, 18);
  fill(255); textAlign(LEFT, CENTER); textSize(20); text("입력한 할 일", boxX - boxW / 2 + 24, boxY + 42);
  fill(220, 210, 255); textSize(14); textAlign(RIGHT, CENTER); text(todoList.length + " / 8개", boxX + boxW / 2 - 24, boxY + 42);
  if (todoList.length === 0) { fill(170, 150, 200); textAlign(LEFT, CENTER); textSize(15); text("아직 입력된 할 일이 없습니다.", boxX - boxW / 2 + 24, boxY + 90); textAlign(CENTER, CENTER); return; }
  textAlign(LEFT, CENTER); textSize(15); fill(255);
  for (let i = 0; i < todoList.length; i++) text((i + 1) + ". " + todoList[i].title, boxX - boxW / 2 + 24, boxY + 86 + i * 26);
  textAlign(CENTER, CENTER);
}

function addTodo() {
  let textValue = inputBox.value().trim();
  if (textValue === "") { messageText = "할 일을 입력해주세요."; return; }
  if (todoList.length >= MAX_TODO_COUNT) { messageText = "할 일은 최대 8개까지만 입력할 수 있습니다."; inputBox.value(""); return; }
  todoList.push({ title: textValue, done: false, timer: { mode: null, totalSec: 0, remainSec: 0, running: false, finished: false, expired: false, startedAt: 0 } });
  loadedFromSave = false; messageText = ""; inputBox.value(""); inputBox.elt.focus(); saveProgress();
}

function goToMainPage() {
  if (todoList.length < MIN_TODO_COUNT) { messageText = "최소 4개 이상 입력해야 시작할 수 있습니다."; return; }
  if (todoList.length > MAX_TODO_COUNT) { messageText = "할 일은 최대 8개까지만 입력할 수 있습니다."; return; }
  if (!loadedFromSave) selectedCharacterIndex = floor(random(characters.length));
  rewardClaimed = false; currentPage = "main"; characterAnimating = true; finalBurst = 0; createPathNodes(); showOnlyMainUI(); startLayeredMusicIfNeeded(); updateLayeredMusicByTodoProgress(true); saveProgress();
}

function drawMainPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80)); updateTimers(); updateFinalBurstState(); drawTopGuideLine(); drawMainCharacter(); drawTodoPanel(); drawGrowthPath(); drawMovingCharacterOnPath(); drawMainInfoText(); if (timerPanelOpen) drawTimerPanel();
}
function drawTopGuideLine() { stroke(220, 210, 255, 120); strokeWeight(1); line(width * 0.03, height * 0.13, width * 0.97, height * 0.13); }
function drawMainInfoText() { fill(220, 210, 255); noStroke(); textSize(16); text("시계 버튼을 눌러 목표 시간을 설정하고, 재생 버튼으로 타이머를 시작하세요.", width / 2, height - 35); }
function drawMainCharacter() {
  let doneCount = countDone(), stageIndex = getStageIndex(doneCount, todoList.length), charX = width * 0.22, charY = height * 0.42, charSize = min(width, height) * 0.68;
  let angle = 0, squash = 1, stretch = 1; clickEffect = lerp(clickEffect, 1, 0.08);
  if (characterAnimating) { let bounce = sin(frameCount * angleSpeed); angle = bounce * radians(6); squash = 1 + cos(frameCount * angleSpeed * 2) * 0.03; stretch = 1 / squash; }
  noStroke(); fill(200, 210, 220, 90); ellipse(charX, charY + charSize * 0.2, charSize * 0.58, charSize * 0.08);
  push(); translate(charX, charY); rotate(angle); scale(stretch * clickEffect, squash / clickEffect); image(getCurrentCharacterImage(stageIndex), 0, 0, charSize, charSize); pop();
  fill(220, 210, 255); noStroke(); textSize(22); text("현재 " + (stageIndex + 1) + "단계", charX, charY + charSize * 0.38);
  if (!characterAnimating) { fill(255, 180, 200); textSize(16); text("타이머 종료로 캐릭터가 멈췄습니다.", charX, charY + charSize * 0.46); }
}

function getTodoLayout() { let rowGap = min(70, (height * 0.48) / max(todoList.length - 1, 1)); rowGap = max(rowGap, 52); return { listX: width * 0.58, listY: height * 0.30, listW: width * 0.23, rowGap, boxSize: 24 }; }
function drawTodoPanel() {
  let layout = getTodoLayout(), listX = layout.listX, listY = layout.listY, listW = layout.listW, rowGap = layout.rowGap, boxSize = layout.boxSize;
  fill(255); noStroke(); textAlign(LEFT, CENTER); textSize(30); text("할 일 리스트", listX, listY - 105); fill(220, 210, 255); textSize(18); text(countDone() + " / " + todoList.length + " 완료", listX, listY - 65);
  for (let i = 0; i < todoList.length; i++) {
    let y = listY + i * rowGap, todo = todoList[i];
    stroke(230); strokeWeight(1.5); fill(255); rect(listX, y - boxSize / 2, boxSize, boxSize);
    if (todo.done) { stroke(120, 255, 170); strokeWeight(3); line(listX + 5, y, listX + 11, y + 7); line(listX + 11, y + 7, listX + 20, y - 7); }
    stroke(220, 210, 255, 160); strokeWeight(1); line(listX + 42, y, listX + listW, y);
    noStroke(); fill(todo.done ? color(170, 220, 180) : color(255)); textSize(20); text(todo.title, listX + 48, y - 18);
    drawTimerBox(i, listX + listW + 38, y);
    let t = todo.timer;
    if (t.mode !== null && t.totalSec > 0) { if (t.running || t.finished || t.expired) drawTimerRing(i, listX + listW + 100, y); else if (t.mode === "duration") drawPlayButton(i, listX + listW + 100, y); }
  }
  textAlign(CENTER, CENTER);
}

function drawTimerBox(index, x, y) { let sz = 22, t = todoList[index].timer; stroke(180, 160, 220); strokeWeight(1.5); fill(t.mode !== null ? color(80, 60, 130) : color(40, 25, 70)); rect(x - sz / 2, y - sz / 2, sz, sz, 5); noFill(); stroke(220, 200, 255); strokeWeight(1.2); ellipse(x, y, sz * 0.7); line(x, y, x, y - sz * 0.22); line(x, y, x + sz * 0.18, y + sz * 0.05); if (t.mode !== null && t.totalSec > 0) { noStroke(); fill(200, 180, 255); textAlign(CENTER, CENTER); textSize(9); text(formatTime(t.totalSec), x, y + sz * 0.7); } }
function drawPlayButton(index, x, y) { let sz = 20; noStroke(); fill(80, 200, 140); ellipse(x, y, sz * 1.4); fill(255); triangle(x - sz * 0.22, y - sz * 0.3, x - sz * 0.22, y + sz * 0.3, x + sz * 0.35, y); }
function drawTimerRing(index, x, y) { let t = todoList[index].timer, sz = 36, ratio = t.totalSec > 0 ? t.remainSec / t.totalSec : 0; noFill(); stroke(60, 40, 100); strokeWeight(4); ellipse(x, y, sz); stroke(t.expired ? color(255, 80, 80) : ratio < 0.2 ? color(255, 180, 60) : color(100, 220, 180)); strokeWeight(4); noFill(); arc(x, y, sz, sz, -HALF_PI, -HALF_PI + TWO_PI * ratio); noStroke(); textAlign(CENTER, CENTER); textSize(9); if (t.expired) { fill(255, 100, 100); text("초과!", x, y); } else if (t.finished) { fill(120, 255, 170); text("완료!", x, y); } else { fill(220); text(formatTime(Math.ceil(t.remainSec)), x, y); } drawPenaltyEffect(index, x, y); }
function drawPenaltyEffect(index, x, y) { for (let p of penaltyList) { if (p.index !== index) continue; let elapsed = frameCount - p.startFrame; if (elapsed > 60) continue; let alpha = map(elapsed, 0, 60, 200, 0), ringSize = map(elapsed, 0, 60, 40, 80); noFill(); stroke(255, 60, 60, alpha); strokeWeight(3); ellipse(x, y, ringSize); } }

function openTimerPanel(index) {
  if (timerPanelOpen && timerPanelIndex === index) { closeTimerPanel(); return; }
  timerPanelOpen = true; timerPanelIndex = index; timerMode = "duration";
  let t = todoList[index].timer;
  if (t.mode !== null && t.totalSec > 0) { timerHour = Math.floor(t.totalSec / 3600); timerMin = Math.floor((t.totalSec % 3600) / 60); timerSec = Math.floor(t.totalSec % 60); } else { timerHour = 0; timerMin = 25; timerSec = 0; }
  closeTimerPanelDOM();
  let pw = 520, ph = 420, px = width / 2 - pw / 2, py = height / 2 - ph / 2;
  durationBtn = createButton("⏱ 타이머"); styleTimerTabBtn(durationBtn, true); durationBtn.position(px + 40, py + 34); durationBtn.size(200, 44); durationBtn.mousePressed(() => { timerMode = "duration"; updateTabStyle(); });
  deadlineBtn = createButton("🕐 종료 시각"); styleTimerTabBtn(deadlineBtn, false); deadlineBtn.position(px + 280, py + 34); deadlineBtn.size(200, 44); deadlineBtn.mousePressed(() => { timerMode = "deadline"; updateTabStyle(); });
  let rowY = py + 150, hourX = px + 95, minX = px + 260, secX = px + 425;
  hourMinusBtn = createButton("-"); styleStepperButton(hourMinusBtn); hourMinusBtn.position(hourX - 58, rowY); hourMinusBtn.size(38, 42); hourMinusBtn.mousePressed(() => adjustTimerValue("hour", -1));
  hourInput = createInput(str(timerHour)); styleTimerInput(hourInput); hourInput.position(hourX - 15, rowY); hourInput.size(70, 42);
  hourPlusBtn = createButton("+"); styleStepperButton(hourPlusBtn); hourPlusBtn.position(hourX + 62, rowY); hourPlusBtn.size(38, 42); hourPlusBtn.mousePressed(() => adjustTimerValue("hour", 1));
  minMinusBtn = createButton("-"); styleStepperButton(minMinusBtn); minMinusBtn.position(minX - 58, rowY); minMinusBtn.size(38, 42); minMinusBtn.mousePressed(() => adjustTimerValue("min", -5));
  minInput = createInput(str(timerMin)); styleTimerInput(minInput); minInput.position(minX - 15, rowY); minInput.size(70, 42);
  minPlusBtn = createButton("+"); styleStepperButton(minPlusBtn); minPlusBtn.position(minX + 62, rowY); minPlusBtn.size(38, 42); minPlusBtn.mousePressed(() => adjustTimerValue("min", 5));
  secMinusBtn = createButton("-"); styleStepperButton(secMinusBtn); secMinusBtn.position(secX - 58, rowY); secMinusBtn.size(38, 42); secMinusBtn.mousePressed(() => adjustTimerValue("sec", -10));
  secInput = createInput(str(timerSec)); styleTimerInput(secInput); secInput.position(secX - 15, rowY); secInput.size(70, 42);
  secPlusBtn = createButton("+"); styleStepperButton(secPlusBtn); secPlusBtn.position(secX + 62, rowY); secPlusBtn.size(38, 42); secPlusBtn.mousePressed(() => adjustTimerValue("sec", 10));
  let quickY = py + 245; createQuickTimerButton("5분", 5 * 60, px + 55, quickY); createQuickTimerButton("15분", 15 * 60, px + 160, quickY); createQuickTimerButton("25분", 25 * 60, px + 265, quickY); createQuickTimerButton("50분", 50 * 60, px + 370, quickY);
  timerConfirmBtn = createButton("✓ 설정하기"); styleButton(timerConfirmBtn, "#5cb85c"); timerConfirmBtn.position(px + 150, py + 335); timerConfirmBtn.size(220, 54); timerConfirmBtn.mousePressed(confirmTimerSetting);
  panelElements = [durationBtn, deadlineBtn, hourMinusBtn, hourInput, hourPlusBtn, minMinusBtn, minInput, minPlusBtn, secMinusBtn, secInput, secPlusBtn, timerConfirmBtn, ...quickButtons];
}
function closeTimerPanel() { timerPanelOpen = false; timerPanelIndex = -1; closeTimerPanelDOM(); }
function closeTimerPanelDOM() { for (let el of panelElements) if (el) el.remove(); panelElements = []; quickButtons = []; }
function drawTimerPanel() { let pw = 520, ph = 420, px = width / 2 - pw / 2, py = height / 2 - ph / 2; noStroke(); fill(0, 0, 0, 120); rect(0, 0, width, height); fill(30, 15, 60, 245); rect(px, py, pw, ph, 22); stroke(160, 130, 220); strokeWeight(1.5); noFill(); rect(px, py, pw, ph, 22); noStroke(); fill(255); textAlign(CENTER, CENTER); textSize(22); text("타이머 설정", px + pw / 2, py - 28); fill(190, 175, 230); textSize(14); text("완료할 시간을 정하면 체크리스트와 연결됩니다.", px + pw / 2, py + 105); fill(220, 200, 255); textSize(15); text("시", px + 135, py + 135); text("분", px + 300, py + 135); text("초", px + 465, py + 135); fill(180, 160, 220); textSize(12); text(timerMode === "duration" ? "예: 25분 동안 집중하기" : "입력한 오늘의 시각까지 자동 카운트다운됩니다.", px + pw / 2, py + ph - 78); }
function confirmTimerSetting() { readTimerInputs(); let totalSec = timerHour * 3600 + timerMin * 60 + timerSec; if (totalSec <= 0) return; if (timerMode === "duration") setTimerDuration(timerPanelIndex, totalSec); else setTimerDeadline(timerPanelIndex, timerHour, timerMin, timerSec); closeTimerPanel(); saveProgress(); }
function setTimerDuration(index, totalSec) { let t = todoList[index].timer; Object.assign(t, { mode: "duration", totalSec, remainSec: totalSec, running: false, finished: false, expired: false, startedAt: 0 }); }
function setTimerDeadline(index, h, m, s) { let now = new Date(), target = new Date(); target.setHours(h, m, s, 0); if (target <= now) target.setDate(target.getDate() + 1); let diffSec = Math.floor((target - now) / 1000), t = todoList[index].timer; Object.assign(t, { mode: "deadline", totalSec: diffSec, remainSec: diffSec, running: true, finished: false, expired: false, startedAt: millis() }); characterAnimating = true; }
function startTimer(index) { let t = todoList[index].timer; if (t.mode !== "duration" || t.running || t.finished) return; t.running = true; t.startedAt = millis(); characterAnimating = true; saveProgress(); }
function updateTimers() { let runningExists = false, expiredExists = false; for (let i = 0; i < todoList.length; i++) { let todo = todoList[i], t = todo.timer; if (!t) continue; if (t.expired && !todo.done) expiredExists = true; if (!t.running) continue; if (todo.done) { t.running = false; t.finished = true; t.expired = false; continue; } runningExists = true; let elapsed = (millis() - t.startedAt) / 1000; t.remainSec = max(0, t.totalSec - elapsed); if (t.remainSec <= 0) { checkTimerExpired(i); expiredExists = true; } } if (expiredExists) characterAnimating = false; else if (runningExists) characterAnimating = true; }
function checkTimerExpired(index) { let t = todoList[index].timer; if (t.expired) return; t.running = false; t.finished = true; t.expired = true; t.remainSec = 0; characterAnimating = false; triggerPenalty(index); saveProgress(); }
function triggerPenalty(index) { penaltyList.push({ index, startFrame: frameCount }); }
function styleTimerTabBtn(btn, active) { btn.style("font-size", "13px"); btn.style("padding", "8px 14px"); btn.style("border", "none"); btn.style("border-radius", "8px"); btn.style("cursor", "pointer"); btn.style("font-weight", "bold"); btn.style("color", "white"); btn.style("background", active ? "#7c5cbf" : "#3a2a5a"); addHoverEffect(btn, 1.05); }
function styleTimerInput(inp) { inp.style("font-size", "18px"); inp.style("text-align", "center"); inp.style("padding", "4px"); inp.style("border", "2px solid #7c5cbf"); inp.style("border-radius", "8px"); inp.style("background", "rgba(255,255,255,0.95)"); inp.style("color", "#222"); inp.style("outline", "none"); inp.attribute("type", "number"); inp.attribute("min", "0"); }
function styleStepperButton(btn) { btn.style("font-size", "20px"); btn.style("width", "34px"); btn.style("height", "36px"); btn.style("border", "none"); btn.style("border-radius", "8px"); btn.style("background", "#3a2a5a"); btn.style("color", "white"); btn.style("cursor", "pointer"); btn.style("font-weight", "bold"); addHoverEffect(btn, 1.12); }
function createQuickTimerButton(label, sec, x, y) { let btn = createButton(label); btn.style("font-size", "13px"); btn.style("padding", "8px 12px"); btn.style("border", "none"); btn.style("border-radius", "999px"); btn.style("background", "#6b4aa0"); btn.style("color", "white"); btn.style("cursor", "pointer"); btn.style("font-weight", "bold"); btn.position(x, y); btn.size(58, 34); addHoverEffect(btn, 1.1); btn.mousePressed(() => { timerHour = Math.floor(sec / 3600); timerMin = Math.floor((sec % 3600) / 60); timerSec = Math.floor(sec % 60); syncTimerInputs(); }); quickButtons.push(btn); }
function adjustTimerValue(unit, amount) { readTimerInputs(); if (unit === "hour") timerHour = constrain(timerHour + amount, 0, 99); else if (unit === "min") { timerMin += amount; while (timerMin >= 60) { timerMin -= 60; timerHour = constrain(timerHour + 1, 0, 99); } while (timerMin < 0) { if (timerHour > 0) { timerHour--; timerMin += 60; } else { timerMin = 0; break; } } } else if (unit === "sec") { timerSec += amount; while (timerSec >= 60) { timerSec -= 60; timerMin++; } while (timerSec < 0) { if (timerMin > 0) { timerMin--; timerSec += 60; } else if (timerHour > 0) { timerHour--; timerMin = 59; timerSec += 60; } else { timerSec = 0; break; } } while (timerMin >= 60) { timerMin -= 60; timerHour = constrain(timerHour + 1, 0, 99); } } syncTimerInputs(); }
function readTimerInputs() { timerHour = constrain(int(hourInput.value()) || 0, 0, 99); timerMin = constrain(int(minInput.value()) || 0, 0, 59); timerSec = constrain(int(secInput.value()) || 0, 0, 59); }
function syncTimerInputs() { if (hourInput) hourInput.value(timerHour); if (minInput) minInput.value(timerMin); if (secInput) secInput.value(timerSec); }
function updateTabStyle() { if (durationBtn && deadlineBtn) { durationBtn.style("background", timerMode === "duration" ? "#7c5cbf" : "#3a2a5a"); deadlineBtn.style("background", timerMode === "deadline" ? "#7c5cbf" : "#3a2a5a"); } }

function createPathNodes() { pathNodes = []; let startX = width * 0.16, endX = width * 0.84, baseY = height * 0.83; for (let i = 0; i < todoList.length; i++) pathNodes.push({ x: map(i, 0, max(todoList.length - 1, 1), startX, endX), y: baseY + sin(i * 1.1) * 28 }); }
function drawGrowthPath() { if (pathNodes.length === 0) return; stroke(210, 210, 230); strokeWeight(3); noFill(); beginShape(); for (let p of pathNodes) vertex(p.x, p.y); endShape(); for (let i = 0; i < pathNodes.length; i++) { let p = pathNodes[i]; if (i < countDone()) { fill(180, 255, 200); stroke(180, 255, 200); } else { fill(255); stroke(200); } strokeWeight(2); ellipse(p.x, p.y, 16, 16); noStroke(); fill(220, 210, 255); textSize(12); text(i + 1, p.x, p.y + 24); } }
function drawMovingCharacterOnPath() { let doneCount = countDone(), stageIndex = getStageIndex(doneCount, todoList.length), pos = getCharacterPathPosition(), angle = characterAnimating ? sin(frameCount * 0.05) * radians(5) : 0; push(); translate(pos.x, pos.y); rotate(angle); image(getCurrentCharacterImage(stageIndex), 0, 0, 360, 360); pop(); if (doneCount === todoList.length && todoList.length > 0) drawFinalEvolutionEffect(pos.x, pos.y); }
function getCharacterPathPosition() { let doneCount = countDone(); if (pathNodes.length === 0) return { x: width * 0.20, y: height * 0.70 }; let idx = constrain(doneCount, 0, pathNodes.length - 1); return { x: pathNodes[idx].x, y: pathNodes[idx].y - 80 }; }
function drawFinalEvolutionEffect(x, y) { finalBurst = min(finalBurst + 1, 55); noStroke(); for (let i = 9; i > 0; i--) { fill(180, 220, 255, map(i, 9, 0, 0, 120)); ellipse(x, y, i * finalBurst * 0.45, i * finalBurst * 0.45); } stroke(255, 230, 250, 150); strokeWeight(2); for (let i = 0; i < 12; i++) { let angle = TWO_PI / 12 * i, len = finalBurst * 2.1; line(x + cos(angle) * 35, y + sin(angle) * 35, x + cos(angle) * len, y + sin(angle) * len); } }
function updateFinalBurstState() { if (countDone() !== todoList.length) finalBurst = 0; }

function goToResultPage() { currentPage = "result"; closeTimerPanel(); if (countDone() === todoList.length && todoList.length > 0 && rewardClaimed === false) { inventoryCount++; rewardClaimed = true; saveInventory(); } showOnlyResultUI(); saveProgress(); }
function drawResultPage() { drawGradientBG(color(20, 10, 50), color(60, 20, 80)); let doneCount = countDone(), totalCount = todoList.length, percent = totalCount > 0 ? floor((doneCount / totalCount) * 100) : 0, stageIndex = getStageIndex(doneCount, totalCount); fill(255); textStyle(BOLD); textSize(min(width, height) * 0.065); text("오늘의 완료 기록", width / 2, height * 0.13); textStyle(NORMAL); fill(220, 210, 255); textSize(min(width, height) * 0.032); text("완료한 할 일: " + doneCount + " / " + totalCount, width / 2, height * 0.25); text("완료율: " + percent + "%", width / 2, height * 0.31); fill(percent === 100 ? color(180, 255, 200) : color(255, 180, 200)); text(percent === 100 ? "오늘의 캐릭터를 획득했습니다!" : "완료율 100%가 되면 캐릭터를 획득할 수 있습니다.", width / 2, height * 0.38); image(getCurrentCharacterImage(stageIndex), width / 2, height * 0.56, min(width, height) * 0.28, min(width, height) * 0.28); fill(255); textSize(min(width, height) * 0.027); text("보유한 캐릭터 개수: " + inventoryCount + "개", width / 2, height * 0.76); fill(220, 210, 255); textSize(16); text("이 화면은 이미지로 저장할 수 있습니다.", width / 2, height * 0.82); textSize(15); text("제작자: " + creatorNames, width / 2, height * 0.86); if (creatorSchool !== "") text("소속: " + creatorSchool, width / 2, height * 0.89); }
function downloadResultImage() { saveCanvas("2DO_오늘의_완료기록", "png"); }
function goToMusicPage() { currentPage = "music"; showOnlyMusicUI(); startLayeredMusicIfNeeded(); updateLayeredMusicByTodoProgress(true); }
function goBackToResultPage() { currentPage = "result"; showOnlyResultUI(); }

function drawMusicPage() { drawGradientBG(color(20, 10, 50), color(60, 20, 80)); let doneCount = countDone(), activeStemCount = getActiveStemCount(); fill(255); textStyle(BOLD); textSize(min(width, height) * 0.055); text("Layer Music", width / 2, height * 0.10); textStyle(NORMAL); fill(220, 210, 255); textSize(20); text("완료한 할 일: " + doneCount + " / " + todoList.length, width / 2, height * 0.17); text("현재 활성화된 트랙: " + activeStemCount + " / " + musicStems.length, width / 2, height * 0.22); drawBaseBgmRow(); for (let i = 0; i < musicStems.length; i++) drawStemRow(i); fill(220, 210, 255); textSize(15); text("기본 배경음악은 항상 흐르고, 완료율에 따라 8개의 트랙이 단계적으로 더해집니다.", width / 2, height - 35); }
function drawBaseBgmRow() { let x = width * 0.12, y = height * 0.30, w = width * 0.76, h = 44; noStroke(); fill(110, 90, 170, 220); rect(x, y - h / 2, w, h, 22); fill(255); textAlign(LEFT, CENTER); textSize(18); text("기본 배경음악", x + 28, y); textAlign(CENTER, CENTER); fill(220, 210, 255); text(BASE_BGM_FILE, width / 2, y); textAlign(RIGHT, CENTER); fill(musicEnabled ? color(180, 255, 200) : color(255, 180, 200)); text(musicEnabled ? "ON" : "MUTE", x + w - 28, y); textAlign(CENTER, CENTER); }
function drawStemRow(i) { let activeStemCount = getActiveStemCount(), isActive = i < activeStemCount, x = width * 0.12, y = height * 0.38 + i * 48, w = width * 0.76, h = 36; noStroke(); fill(isActive ? color(190, 180, 215, 230) : color(80, 75, 105, 170)); rect(x, y - h / 2, w, h, 18); fill(255); textAlign(LEFT, CENTER); textSize(16); text("Track " + (i + 1), x + 28, y); textAlign(CENTER, CENTER); fill(220, 210, 255); text(STEM_FILES[i], width / 2, y); textAlign(RIGHT, CENTER); fill(isActive ? color(180, 255, 200) : color(255, 180, 200)); text(isActive ? "ON" : "대기", x + w - 28, y); textAlign(CENTER, CENTER); }
function handleMusicClick() { startLayeredMusicIfNeeded(); updateLayeredMusicByTodoProgress(true); }
function playSong(index) { startLayeredMusicIfNeeded(); updateLayeredMusicByTodoProgress(true); }
function stopAllSongs() { stopLayeredMusic(); }

function mousePressed() { startLayeredMusicIfNeeded(); updateLayeredMusicByTodoProgress(true); if (currentPage === "main") { if (timerPanelOpen) { let px = width / 2 - 520 / 2, py = height / 2 - 420 / 2; if (mouseX < px || mouseX > px + 520 || mouseY < py || mouseY > py + 420) { closeTimerPanel(); return; } } handleCharacterClick(); handleChecklistClick(); handleTimerClicks(); } else if (currentPage === "music") handleMusicClick(); }
function handleCharacterClick() { let charX = width * 0.22, charY = height * 0.42, charSize = min(width, height) * 0.68; if (dist(mouseX, mouseY, charX, charY) < charSize * 0.42) clickEffect = 1.2; }
function handleChecklistClick() { let layout = getTodoLayout(), listX = layout.listX, listY = layout.listY, boxSize = layout.boxSize, gap = layout.rowGap; for (let i = 0; i < todoList.length; i++) { let y = listY + i * gap; if (mouseX > listX && mouseX < listX + boxSize && mouseY > y - boxSize / 2 && mouseY < y + boxSize / 2) { todoList[i].done = !todoList[i].done; startLayeredMusicIfNeeded(); updateLayeredMusicByTodoProgress(true); clickEffect = 1.15; characterAnimating = true; if (todoList[i].timer) { let t = todoList[i].timer; if (todoList[i].done && t.running) { t.running = false; t.finished = true; t.expired = false; } } if (countDone() === todoList.length) finalBurst = 1; saveProgress(); return; } } }
function handleTimerClicks() { let layout = getTodoLayout(), listX = layout.listX, listY = layout.listY, listW = layout.listW, gap = layout.rowGap, timerBoxX = listX + listW + 38, playX = listX + listW + 100; for (let i = 0; i < todoList.length; i++) { let y = listY + i * gap; if (dist(mouseX, mouseY, timerBoxX, y) < 16) { openTimerPanel(i); return; } let t = todoList[i].timer; if (t.mode === "duration" && !t.running && !t.finished && dist(mouseX, mouseY, playX, y) < 18) { startTimer(i); return; } } }

function countDone() { let count = 0; for (let todo of todoList) if (todo.done) count++; return count; }
function getStageIndex(doneCount, totalCount) { if (totalCount <= 0) return 0; return constrain(floor((doneCount * 4) / totalCount), 0, 4); }
function getCurrentCharacterImage(stageIndex) { return characters[selectedCharacterIndex][stageIndex]; }
function formatTime(sec) { let h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60); return h > 0 ? nf(h, 1) + ":" + nf(m, 2) + ":" + nf(s, 2) : nf(m, 2) + ":" + nf(s, 2); }

function saveProgress() { localStorage.setItem("twoDoProgress", JSON.stringify({ todoList, selectedCharacterIndex, rewardClaimed })); }
function loadProgress() { let rawData = localStorage.getItem("twoDoProgress"); if (rawData === null) { messageText = "저장된 기록이 없습니다."; return; } let saveData = JSON.parse(rawData); todoList = saveData.todoList || []; selectedCharacterIndex = saveData.selectedCharacterIndex || 0; rewardClaimed = saveData.rewardClaimed || false; normalizeTodoTimers(); currentPage = "input"; loadedFromSave = true; messageText = "저장된 기록을 불러왔습니다."; showOnlyInputUI(); updateLayeredMusicByTodoProgress(true); }
function normalizeTodoTimers() { for (let todo of todoList) { if (!todo.timer) todo.timer = { mode: null, totalSec: 0, remainSec: 0, running: false, finished: false, expired: false, startedAt: 0 }; if (todo.timer.running) todo.timer.running = false; } }
function saveInventory() { localStorage.setItem("twoDoInventoryCount", inventoryCount); }
function loadInventory() { let savedCount = localStorage.getItem("twoDoInventoryCount"); inventoryCount = savedCount === null ? 0 : int(savedCount); }
function restartProgram() { stopAllSongs(); todoList = []; messageText = ""; rewardClaimed = false; finalBurst = 0; characterAnimating = true; timerPanelOpen = false; timerPanelIndex = -1; penaltyList = []; loadedFromSave = false; closeTimerPanelDOM(); localStorage.removeItem("twoDoProgress"); currentPage = "input"; showOnlyInputUI(); }
function resetAllData() { stopAllSongs(); todoList = []; inventoryCount = 0; messageText = "전체 기록이 초기화되었습니다."; rewardClaimed = false; finalBurst = 0; characterAnimating = true; timerPanelOpen = false; timerPanelIndex = -1; penaltyList = []; loadedFromSave = false; closeTimerPanelDOM(); localStorage.removeItem("twoDoProgress"); localStorage.removeItem("twoDoInventoryCount"); currentPage = "input"; showOnlyInputUI(); }

function createStar() { return { x: random(width), y: random(height), size: random(2, 5), speed: random(0.05, 2), brightness: random(150, 255) }; }
function drawStars() { noStroke(); for (let s of stars) { s.x += (mouseX - s.x) * 0.005 * s.speed; s.y += (mouseY - s.y) * 0.005 * s.speed; let flicker = sin(frameCount * 0.05 + s.brightness) * 40; fill(255, 255, 200, s.brightness + flicker); ellipse(s.x, s.y, s.size); } }
function drawGradientBG(c1, c2) { noStroke(); for (let y = 0; y < height; y++) { let inter = map(y, 0, height, 0, 1); fill(lerpColor(c1, c2, inter)); rect(0, y, width, 1); } drawStars(); }
function windowResized() { resizeCanvas(windowWidth, windowHeight); if (currentPage === "main") createPathNodes(); if (timerPanelOpen) { let currentIndex = timerPanelIndex; closeTimerPanelDOM(); timerPanelOpen = false; openTimerPanel(currentIndex); } }

function startLayeredMusicIfNeeded() {
  if (!musicEnabled || musicStarted || !isLayeredMusicLoaded()) return;
  if (typeof userStartAudio === "function") userStartAudio();
  let loopSec = getMusicLoopSeconds();
  startLoopedSound(baseBgm, BASE_BGM_VOLUME, loopSec);
  for (let i = 0; i < musicStems.length; i++) startLoopedSound(musicStems[i], 0, loopSec);
  musicStarted = true; lastAppliedStemCount = -1; updateLayeredMusicByTodoProgress(true);
}
function startLoopedSound(soundFile, volume, loopSec) { if (!soundFile) return; soundFile.stop(); soundFile.setVolume(volume); if (loopSec > 0) soundFile.loop(0, 1, volume, 0, loopSec); else { soundFile.loop(); soundFile.setVolume(volume); } }
function stopLayeredMusic() { if (baseBgm) baseBgm.stop(); for (let i = 0; i < musicStems.length; i++) if (musicStems[i]) musicStems[i].stop(); musicStarted = false; lastAppliedStemCount = -1; }
function isLayeredMusicLoaded() { if (!baseBgm || !baseBgm.isLoaded()) return false; for (let i = 0; i < musicStems.length; i++) if (!musicStems[i] || !musicStems[i].isLoaded()) return false; return true; }
function getMusicLoopSeconds() { if (AUDIO_LOOP_SECONDS > 0) return AUDIO_LOOP_SECONDS; let durations = []; if (baseBgm && baseBgm.isLoaded()) durations.push(baseBgm.duration()); for (let i = 0; i < musicStems.length; i++) if (musicStems[i] && musicStems[i].isLoaded()) durations.push(musicStems[i].duration()); if (durations.length === 0) return 0; let shortest = min(durations); if (!isFinite(shortest) || shortest <= 0) return 0; return shortest; }
function getActiveStemCount() { let doneCount = countDone(), totalCount = todoList.length, stemCount = musicStems.length; if (totalCount <= 0 || stemCount <= 0 || doneCount <= 0) return 0; if (doneCount >= totalCount) return stemCount; return constrain(ceil((doneCount / totalCount) * stemCount), 0, stemCount); }
function updateLayeredMusicByTodoProgress(forceUpdate) { if (!musicStarted) return; let activeStemCount = getActiveStemCount(); if (!forceUpdate && activeStemCount === lastAppliedStemCount) return; if (baseBgm) baseBgm.setVolume(musicEnabled ? BASE_BGM_VOLUME : 0, MUSIC_FADE_SEC); for (let i = 0; i < musicStems.length; i++) { let targetVolume = musicEnabled && i < activeStemCount ? STEM_VOLUME : 0; if (musicStems[i]) musicStems[i].setVolume(targetVolume, MUSIC_FADE_SEC); } lastAppliedStemCount = activeStemCount; }
function maintainMusicSync() { if (!musicStarted || !isLayeredMusicLoaded()) return; if (frameCount - lastSyncCheckFrame < SYNC_CHECK_INTERVAL_FRAMES) return; lastSyncCheckFrame = frameCount; if (!baseBgm.isPlaying()) { restartAllLayersInSync(); return; } let loopSec = getMusicLoopSeconds(); if (loopSec <= 0) return; let baseTime = baseBgm.currentTime() % loopSec; for (let i = 0; i < musicStems.length; i++) { let stem = musicStems[i]; if (!stem) continue; if (!stem.isPlaying()) { restartStemAtTime(stem, baseTime, loopSec); continue; } let stemTime = stem.currentTime() % loopSec, diff = getLoopTimeDiff(baseTime, stemTime, loopSec); if (diff > SYNC_TOLERANCE_SEC) stem.jump(baseTime); } }
function restartAllLayersInSync() { if (!isLayeredMusicLoaded()) return; let loopSec = getMusicLoopSeconds(); stopLayeredMusic(); startLoopedSound(baseBgm, musicEnabled ? BASE_BGM_VOLUME : 0, loopSec); for (let i = 0; i < musicStems.length; i++) startLoopedSound(musicStems[i], 0, loopSec); musicStarted = true; lastAppliedStemCount = -1; updateLayeredMusicByTodoProgress(true); }
function restartStemAtTime(stem, cueTime, loopSec) { if (!stem) return; stem.stop(); stem.setVolume(0); if (loopSec > 0) { stem.loop(0, 1, 0, 0, loopSec); stem.jump(cueTime); } else stem.loop(); }
function getLoopTimeDiff(a, b, loopSec) { let diff = abs(a - b); if (loopSec > 0) diff = min(diff, loopSec - diff); return diff; }
