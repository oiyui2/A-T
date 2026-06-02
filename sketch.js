// ============================================================
// 2DO - 캐릭터 성장형 투두리스트 + 캐릭터 수집 + 곡 해금
// ============================================================
//
// AI 도움 사용 부분:
// - 전체 화면 구조(input/main/result/music) 분리
// - 별 배경 효과와 타이머 패널 병합
// - 캐릭터 성장 경로 및 결과 화면 저장 기능 구성
// - localStorage를 이용한 저장/불러오기/초기화 기능 구성
// - 할 일 리스트 UI 배치 조정
// - 메인 캐릭터 / 하단 이동 캐릭터 크기 및 위치 조정
//
// ============================================================


// 전역 변수
// ============================================================

let currentPage = "input";
// "input" : 할 일 입력 화면
// "main" : 캐릭터 성장 + 할 일 체크 화면
// "result" : 오늘 결과 저장 화면
// "music" : 곡 플레이 화면

// 캐릭터 이미지
// characters[캐릭터번호][성장단계]
let characters = [];
let selectedCharacterIndex = 0;
let loadedFromSave = false;

// 캐릭터 애니메이션
let angleSpeed = 0.05;
let clickEffect = 1;
let characterAnimating = true;
let finalBurst = 0;

// 별 배경
let stars = [];

let songSounds = [];

// 할 일 관련
let todoList = [];
let inputBox;
let addButton;
let completeButton;
let fullscreenButton;
let loadButton;
let resetAllButton;
let messageText = "";

// 성장 경로
let pathNodes = [];

// 결과 / 저장 / 화면 이동 버튼
let resultButton;
let saveImageButton;
let musicPageButton;
let restartButton;
let backToMainButton;
let stopMusicButton;
let inventoryCount = 0;
let rewardClaimed = false;

// 타이머 패널 상태
let timerPanelOpen = false;
let timerPanelIndex = -1;
let timerMode = "duration";

// 타이머 입력값
let timerHour = 0;
let timerMin = 0;
let timerSec = 0;

// 타이머 패널 DOM 요소
let hourInput, minInput, secInput;
let durationBtn, deadlineBtn, timerConfirmBtn;
let hourMinusBtn, hourPlusBtn;
let minMinusBtn, minPlusBtn;
let secMinusBtn, secPlusBtn;
let quickButtons = [];
let panelElements = [];

// 타이머 초과 연출
let penaltyList = [];

// 곡 목록
let songs = [
{ title: "별빛 산책", need: 1 },
{ title: "달 조각 왈츠", need: 2 },
{ title: "구름 위의 리듬", need: 3 },
{ title: "밤바다 드럼", need: 4 },
{ title: "마지막 행성의 노래", need: 5 },
{ title: "숨겨진 멜로디", need: 7 }
];

let currentSongIndex = -1;

// 제작자 정보
let creatorNames = "박서정, 오유현";
let creatorSchool = "";


// 상단 내비게이션 버튼
let navHomeBtn, navTodoBtn, navMusicBtn;

// 곡 재생 여부(소리 on/off) 토글
let musicEnabled = true;
let musicToggleBtn;



// ============================================================
// preload
// ============================================================

function preload() {
// 0번 캐릭터: 불
characters[0] = [
loadImage("1단계불.png"),
loadImage("2단계불.png"),
loadImage("3단계불.png"),
loadImage("4단계불.png"),
loadImage("5단계불.png")
];

// 1번 캐릭터: 구름
characters[1] = [
loadImage("1단계구름.png"),
loadImage("2단계구름.png"),
loadImage("3단계구름.png"),
loadImage("4단계구름.png"),
loadImage("5단계구름.png")
];

// 2번 캐릭터: 유령
characters[2] = [
loadImage("1단계유령.png"),
loadImage("2단계유령.png"),
loadImage("3단계유령.png"),
loadImage("4단계유령.png"),
loadImage("5단계유령.png")
];

// 3번 캐릭터: 구
characters[3] = [
loadImage("1단계구.png"),
loadImage("2단계구.png"),
loadImage("3단계구.png"),
loadImage("4단계구.png"),
loadImage("5단계구.png")
];

songSounds[0] = loadSound("song1.mp3");
// songSounds[1] = loadSound("song2.mp3");
// songSounds[2] = loadSound("song3.mp3");
// songSounds[3] = loadSound("song4.mp3");
// songSounds[4] = loadSound("song5.mp3");
// songSounds[5] = loadSound("song6.mp3");
}

// ============================================================
// setup
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

showOnlyInputUI();

}


// ============================================================
// draw
// ============================================================

function draw() {
if (currentPage === "input") {
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

inputBox.elt.addEventListener("keydown", function(e) {
if (e.key === "Enter") {
addTodo();
}
});

addButton = createButton("추가");
styleButton(addButton, "#A478C0");
addButton.mousePressed(addTodo);

completeButton = createButton("오늘 할 일 시작");
styleButton(completeButton, "#e8578a");
completeButton.mousePressed(goToMainPage);

fullscreenButton = createButton("전체화면");
styleButton(fullscreenButton, "#5f6fbf");
fullscreenButton.mousePressed(turnOnFullscreen);

loadButton = createButton("저장 기록 불러오기");
styleButton(loadButton, "#9a7ac7");
loadButton.mousePressed(loadProgress);

resetAllButton = createButton("전체 초기화");
styleButton(resetAllButton, "#555");
resetAllButton.mousePressed(resetAllData);
}

function buildMainPageUI() {
resultButton = createButton("오늘 결과 보기");
styleButton(resultButton, "#e8578a");
resultButton.mousePressed(goToResultPage);
}

function buildResultPageUI() {
saveImageButton = createButton("결과 이미지 저장");
styleButton(saveImageButton, "#e8578a");
saveImageButton.mousePressed(downloadResultImage);

musicPageButton = createButton("곡 플레이 화면");
styleButton(musicPageButton, "#7c5cbf");
musicPageButton.mousePressed(goToMusicPage);

restartButton = createButton("새 할 일 시작");
styleButton(restartButton, "#5f6fbf");
restartButton.mousePressed(restartProgram);
}

function buildMusicPageUI() {
backToMainButton = createButton("결과 화면으로");
styleButton(backToMainButton, "#7c5cbf");
backToMainButton.mousePressed(goBackToResultPage);

stopMusicButton = createButton("노래 멈추기");
styleButton(stopMusicButton, "#555");
stopMusicButton.mousePressed(stopAllSongs);

musicToggleBtn = createButton("🔊 곡 재생: 켜짐");
styleButton(musicToggleBtn, "#5cb85c");
musicToggleBtn.mousePressed(toggleMusicEnabled);
}

function toggleMusicEnabled() {
musicEnabled = !musicEnabled;
if (musicEnabled) {
musicToggleBtn.html("🔊 곡 재생: 켜짐");
musicToggleBtn.style("background", "#5cb85c");
} else {
musicToggleBtn.html("🔇 곡 재생: 꺼짐");
musicToggleBtn.style("background", "#999");
stopAllSongs();
}
}

function buildNavBar() {
navHomeBtn = createButton("🏠 홈");
styleNavButton(navHomeBtn);
navHomeBtn.mousePressed(navToHome);

navTodoBtn = createButton("✅ 투두");
styleNavButton(navTodoBtn);
navTodoBtn.mousePressed(navToTodo);

navMusicBtn = createButton("🎵 곡 재생");
styleNavButton(navMusicBtn);
navMusicBtn.mousePressed(navToMusic);
}

function styleNavButton(btn) {
btn.style("font-size", "15px");
btn.style("border", "none");
btn.style("border-radius", "999px");
btn.style("background", "rgba(255,255,255,0.12)");
btn.style("color", "white");
btn.style("cursor", "pointer");
btn.style("font-weight", "bold");
addHoverEffect(btn, 1.10);
}

function navToHome() {
closeTimerPanel();
currentPage = "input";
showOnlyInputUI();
}

function navToTodo() {
if (todoList.length < 4) {
messageText = "투두 화면은 할 일을 4개 이상 입력해야 들어갈 수 있어요.";
currentPage = "input";
showOnlyInputUI();
return;
}
if (pathNodes.length === 0) {
if (!loadedFromSave) selectedCharacterIndex = floor(random(characters.length));
rewardClaimed = false;
finalBurst = 0;
characterAnimating = true;
createPathNodes();
}
currentPage = "main";
showOnlyMainUI();
saveProgress();
}

function navToMusic() {
closeTimerPanel();
currentPage = "music";
showOnlyMusicUI();
}

function positionNav() {
let bw = 120, gap = 10, by = 20;
let totalW = bw * 3 + gap * 2;
let startX = width / 2 - totalW / 2;

navHomeBtn.size(bw, 42);
navTodoBtn.size(bw, 42);
navMusicBtn.size(bw, 42);

navHomeBtn.position(startX, by);
navTodoBtn.position(startX + (bw + gap), by);
navMusicBtn.position(startX + (bw + gap) * 2, by);
}

function updateNavHighlight() {
let active = "rgba(124,92,191,0.95)";
let idle = "rgba(255,255,255,0.12)";
navHomeBtn.style("background", currentPage === "input" ? active : idle);
navTodoBtn.style("background", currentPage === "main" ? active : idle);
navMusicBtn.style("background", currentPage === "music" ? active : idle);
}


function addHoverEffect(btn, scaleAmt) {
let s = scaleAmt || 1.08;
btn.style("transition", "transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease");
btn.style("transform-origin", "center center");
btn.mouseOver(function() {
btn.style("transform", "scale(" + s + ")");
btn.style("box-shadow", "0 6px 18px rgba(0,0,0,0.35)");
btn.style("filter", "brightness(1.08)");
});
btn.mouseOut(function() {
btn.style("transform", "scale(1.0)");
btn.style("box-shadow", "none");
btn.style("filter", "brightness(1.0)");
});
}

function styleButton(btn, bgColor) {
btn.style("font-size", "16px");
btn.style("padding", "12px 20px");
btn.style("border", "none");
btn.style("border-radius", "12px");
btn.style("background", bgColor);
btn.style("color", "white");
btn.style("cursor", "pointer");
btn.style("font-weight", "bold");
addHoverEffect(btn);
}


// ============================================================
// UI 보이기 / 숨기기
// ============================================================

function hideAllUI() {
if (inputBox) inputBox.hide();
if (addButton) addButton.hide();
if (completeButton) completeButton.hide();
if (fullscreenButton) fullscreenButton.hide();
if (loadButton) loadButton.hide();
if (resetAllButton) resetAllButton.hide();

if (resultButton) resultButton.hide();

if (saveImageButton) saveImageButton.hide();
if (musicPageButton) musicPageButton.hide();
if (restartButton) restartButton.hide();

if (backToMainButton) backToMainButton.hide();
if (stopMusicButton) stopMusicButton.hide();
if (musicToggleBtn) musicToggleBtn.hide();
closeTimerPanelDOM();
timerPanelOpen = false;
timerPanelIndex = -1;
}

function showOnlyInputUI() {
hideAllUI();

inputBox.show();
addButton.show();
completeButton.show();
fullscreenButton.show();
loadButton.show();
resetAllButton.show();
}

function showOnlyMainUI() {
hideAllUI();

resultButton.show();
}

function showOnlyResultUI() {
hideAllUI();

saveImageButton.show();
musicPageButton.show();
restartButton.show();
resetAllButton.show();
}

function showOnlyMusicUI() {
hideAllUI();

backToMainButton.show();
stopMusicButton.show();
musicToggleBtn.show();
}

function positionUI() {
positionNav();
updateNavHighlight();

if (currentPage === "input") {
// 왼쪽 입력 영역
let inputW = min(500, width * 0.45);
let inputH = 42;
let addW = 105;
let gap = 14;

// 전체 중앙보다 살짝 왼쪽으로 이동
let groupW = inputW + gap + addW;
let groupX = width * 0.36 - groupW / 2;
let inputY = height * 0.34;

inputBox.size(inputW, inputH);
addButton.size(addW, inputH);

inputBox.position(groupX, inputY);
addButton.position(groupX + inputW + gap, inputY);

// 버튼들도 왼쪽 입력 영역 기준으로 정렬
completeButton.size(230, 58);
loadButton.size(260, 58);
resetAllButton.size(210, 58);

completeButton.position(width * 0.36 - 115, height * 0.48);
loadButton.position(width * 0.36 - 130, height * 0.59);
resetAllButton.position(width * 0.36 - 105, height * 0.70);

fullscreenButton.position(width - 150, 30);
}

if (currentPage === "main") {
resultButton.position(width - 190, height - 80);
}

if (currentPage === "result") {
saveImageButton.position(width / 2 - 320, height * 0.88);
musicPageButton.position(width / 2 - 145, height * 0.88);
restartButton.position(width / 2 + 25, height * 0.88);
resetAllButton.position(width / 2 + 175, height * 0.88);
}

if (currentPage === "music") {
musicToggleBtn.size(180, 56);
stopMusicButton.size(150, 56);
backToMainButton.size(150, 56);

musicToggleBtn.position(width - 520, height - 84);
stopMusicButton.position(width - 350, height - 84);
backToMainButton.position(width - 180, height - 84);
}

}
// ============================================================
// 전체화면
// ============================================================

function turnOnFullscreen() {
fullscreen(true);
resizeCanvas(windowWidth, windowHeight);
}


// ============================================================
// 입력 화면
// ============================================================

function drawInputPage() {
drawGradientBG(color(20, 10, 50), color(60, 20, 80));

// 제목
fill(255);
textStyle(BOLD);
textSize(min(width, height) * 0.060);
text("2DO", width / 2, height * 0.10);

// 부제목
textStyle(NORMAL);
textSize(min(width, height) * 0.028);
text(
"할 일을 완수할수록 캐릭터가 성장하는 투두리스트",
width / 2,
height * 0.17
);

// 안내문
fill(220, 210, 255);
textSize(min(width, height) * 0.020);
text(
"오늘의 할 일을 최소 4개, 최대 8개까지 입력하세요.",
width / 2,
height * 0.24
);

// 현재 개수
fill(255);
textSize(min(width, height) * 0.024);
text(
"현재 입력된 할 일: " + todoList.length + "개",
width / 2,
height * 0.78
);

// 메시지
if (messageText !== "") {
fill(255, 180, 200);
textSize(min(width, height) * 0.018);
text(messageText, width / 2, height * 0.83);
}

drawInputTodoPreview();

// 제작자
fill(220, 210, 255);
textSize(16);
textAlign(RIGHT, CENTER);
text(creatorNames, width - 40, height - 40);
textAlign(CENTER, CENTER);
}
function drawInputTodoPreview() {
// 오른쪽 목록 박스 위치 조정
let boxW = min(330, width * 0.24);
let boxH = 310;

// 기존보다 오른쪽으로 이동
let boxX = width * 0.79;
let boxY = height * 0.30;

// 목록 박스
noStroke();
fill(255, 255, 255, 35);
rect(boxX - boxW / 2, boxY, boxW, boxH, 18);

// 제목
fill(255);
textAlign(LEFT, CENTER);
textSize(20);
text("입력한 할 일", boxX - boxW / 2 + 24, boxY + 42);

// 개수
fill(220, 210, 255);
textSize(14);
textAlign(RIGHT, CENTER);
text(todoList.length + " / 8개", boxX + boxW / 2 - 24, boxY + 42);

if (todoList.length === 0) {
fill(170, 150, 200);
textAlign(LEFT, CENTER);
textSize(15);
text("아직 입력된 할 일이 없습니다.", boxX - boxW / 2 + 24, boxY + 90);
textAlign(CENTER, CENTER);
return;
}

// 할 일 목록
textAlign(LEFT, CENTER);
textSize(15);

for (let i = 0; i < todoList.length; i++) {
let y = boxY + 86 + i * 26;

fill(255);
text((i + 1) + ". " + todoList[i].title, boxX - boxW / 2 + 24, y);
}

textAlign(CENTER, CENTER);
}
function addTodo() {
let textValue = inputBox.value().trim();

if (textValue === "") {
messageText = "할 일을 입력해주세요.";
return;
}

if (todoList.length >= 8) {
messageText = "할 일은 최대 8개까지만 입력할 수 있습니다.";
inputBox.value("");
return;
}

todoList.push({
title: textValue,
done: false,
timer: {
mode: null,
totalSec: 0,
remainSec: 0,
running: false,
finished: false,
expired: false,
startedAt: 0
}
});

loadedFromSave = false;
messageText = "";
inputBox.value("");
inputBox.elt.focus();

saveProgress();
}

function goToMainPage() {
if (todoList.length < 4) {
messageText = "최소 4개 이상 입력해야 시작할 수 있습니다.";
return;
}

// 저장 기록을 불러온 상태가 아니면 새 캐릭터 랜덤 선택
if (!loadedFromSave) {
selectedCharacterIndex = floor(random(characters.length));
}

rewardClaimed = false;
currentPage = "main";
characterAnimating = true;
finalBurst = 0;

createPathNodes();
showOnlyMainUI();

saveProgress();
}


// ============================================================
// 메인 화면
// ============================================================

function drawMainPage() {
drawGradientBG(color(20, 10, 50), color(60, 20, 80));

updateTimers();
updateFinalBurstState();

drawTopGuideLine();
drawMainCharacter();
drawTodoPanel();
drawGrowthPath();
drawMovingCharacterOnPath();
drawMainInfoText();

if (timerPanelOpen) {
drawTimerPanel();
}
}

function drawTopGuideLine() {
stroke(220, 210, 255, 120);
strokeWeight(1);
line(width * 0.03, height * 0.13, width * 0.97, height * 0.13);
}

function drawMainInfoText() {
fill(220, 210, 255);
noStroke();
textSize(16);
text("시계 버튼을 눌러 목표 시간을 설정하고, 재생 버튼으로 타이머를 시작하세요.", width / 2, height - 35);
}

function drawMainCharacter() {
let doneCount = countDone();
let stageIndex = getStageIndex(doneCount, todoList.length);

let charX = width * 0.22;
let charY = height * 0.42;

// 기존 min(width, height) * 0.34의 2배
let charSize = min(width, height) * 0.68;

let angle = 0;
let squash = 1;
let stretch = 1;

clickEffect = lerp(clickEffect, 1, 0.08);

if (characterAnimating) {
let bounce = sin(frameCount * angleSpeed);
angle = bounce * radians(6);
squash = 1 + cos(frameCount * angleSpeed * 2) * 0.03;
stretch = 1 / squash;
}

noStroke();
fill(200, 210, 220, 90);
ellipse(charX, charY + charSize * 0.2, charSize * 0.58, charSize * 0.08);

push();
translate(charX, charY);
rotate(angle);
scale(stretch * clickEffect, squash / clickEffect);
image(getCurrentCharacterImage(stageIndex), 0, 0, charSize, charSize);
pop();

fill(220, 210, 255);
noStroke();
textSize(22);
text("현재 " + (stageIndex + 1) + "단계", charX, charY + charSize * 0.38);

if (!characterAnimating) {
fill(255, 180, 200);
textSize(16);
text("타이머 종료로 캐릭터가 멈췄습니다.", charX, charY + charSize * 0.46);
}
}


// ============================================================
// 할 일 리스트 UI
// ============================================================

function getTodoLayout() {
let listX = width * 0.58;
let listY = height * 0.30;
let listW = width * 0.23;

// 할 일이 많을 때도 화면 안에 들어오도록 줄 간격 자동 조절
let rowGap = min(70, (height * 0.48) / max(todoList.length - 1, 1));
rowGap = max(rowGap, 52);

return {
listX: listX,
listY: listY,
listW: listW,
rowGap: rowGap,
boxSize: 24
};
}

function drawTodoPanel() {
let layout = getTodoLayout();

let listX = layout.listX;
let listY = layout.listY;
let listW = layout.listW;
let rowGap = layout.rowGap;
let boxSize = layout.boxSize;

fill(255);
noStroke();
textAlign(LEFT, CENTER);
textSize(30);
text("할 일 리스트", listX, listY - 105);

fill(220, 210, 255);
textSize(18);
text(countDone() + " / " + todoList.length + " 완료", listX, listY - 65);

for (let i = 0; i < todoList.length; i++) {
let y = listY + i * rowGap;
let todo = todoList[i];

stroke(230);
strokeWeight(1.5);
fill(255);
rect(listX, y - boxSize / 2, boxSize, boxSize);

if (todo.done) {
stroke(120, 255, 170);
strokeWeight(3);
line(listX + 5, y, listX + 11, y + 7);
line(listX + 11, y + 7, listX + 20, y - 7);
}

stroke(220, 210, 255, 160);
strokeWeight(1);
line(listX + 42, y, listX + listW, y);

noStroke();
fill(todo.done ? color(170, 220, 180) : color(255));
textSize(20);
text(todo.title, listX + 48, y - 18);

drawTimerBox(i, listX + listW + 38, y);

let t = todo.timer;

if (t.mode !== null && t.totalSec > 0) {
if (t.running || t.finished || t.expired) {
drawTimerRing(i, listX + listW + 100, y);
} else if (t.mode === "duration") {
drawPlayButton(i, listX + listW + 100, y);
}
}
}

textAlign(CENTER, CENTER);
}


// ============================================================
// 타이머 UI
// ============================================================

function drawTimerBox(index, x, y) {
let sz = 22;
let t = todoList[index].timer;

stroke(180, 160, 220);
strokeWeight(1.5);
fill(t.mode !== null ? color(80, 60, 130) : color(40, 25, 70));
rect(x - sz / 2, y - sz / 2, sz, sz, 5);

noFill();
stroke(220, 200, 255);
strokeWeight(1.2);
ellipse(x, y, sz * 0.7);
line(x, y, x, y - sz * 0.22);
line(x, y, x + sz * 0.18, y + sz * 0.05);

if (t.mode !== null && t.totalSec > 0) {
noStroke();
fill(200, 180, 255);
textAlign(CENTER, CENTER);
textSize(9);
text(formatTime(t.totalSec), x, y + sz * 0.7);
}
}

function drawPlayButton(index, x, y) {
let sz = 20;

noStroke();
fill(80, 200, 140);
ellipse(x, y, sz * 1.4);

fill(255);
triangle(
x - sz * 0.22, y - sz * 0.3,
x - sz * 0.22, y + sz * 0.3,
x + sz * 0.35, y
);
}

function drawTimerRing(index, x, y) {
let t = todoList[index].timer;
let sz = 36;
let ratio = t.totalSec > 0 ? t.remainSec / t.totalSec : 0;

noFill();
stroke(60, 40, 100);
strokeWeight(4);
ellipse(x, y, sz);

let progressColor;

if (t.expired) {
progressColor = color(255, 80, 80);
} else if (ratio < 0.2) {
progressColor = color(255, 180, 60);
} else {
progressColor = color(100, 220, 180);
}

stroke(progressColor);
strokeWeight(4);
noFill();
arc(x, y, sz, sz, -HALF_PI, -HALF_PI + TWO_PI * ratio);

noStroke();
textAlign(CENTER, CENTER);
textSize(9);

if (t.expired) {
fill(255, 100, 100);
text("초과!", x, y);
} else if (t.finished) {
fill(120, 255, 170);
text("완료!", x, y);
} else {
fill(220);
text(formatTime(Math.ceil(t.remainSec)), x, y);
}

drawPenaltyEffect(index, x, y);
}

function drawPenaltyEffect(index, x, y) {
for (let p of penaltyList) {
if (p.index !== index) continue;

let elapsed = frameCount - p.startFrame;

if (elapsed > 60) continue;

let alpha = map(elapsed, 0, 60, 200, 0);
let ringSize = map(elapsed, 0, 60, 40, 80);

noFill();
stroke(255, 60, 60, alpha);
strokeWeight(3);
ellipse(x, y, ringSize);
}
}


// ============================================================
// 타이머 패널
// ============================================================

function openTimerPanel(index) {
if (timerPanelOpen && timerPanelIndex === index) {
closeTimerPanel();
return;
}

timerPanelOpen = true;
timerPanelIndex = index;
timerMode = "duration";

let t = todoList[index].timer;

if (t.mode !== null && t.totalSec > 0) {
timerHour = Math.floor(t.totalSec / 3600);
timerMin = Math.floor((t.totalSec % 3600) / 60);
timerSec = Math.floor(t.totalSec % 60);
} else {
timerHour = 0;
timerMin = 25;
timerSec = 0;
}

closeTimerPanelDOM();

// 패널 크기 넓힘
let pw = 520;
let ph = 420;
let px = width / 2 - pw / 2;
let py = height / 2 - ph / 2;

// 탭 버튼
durationBtn = createButton("⏱ 타이머");
styleTimerTabBtn(durationBtn, true);
durationBtn.position(px + 40, py + 34);
durationBtn.size(200, 44);
durationBtn.mousePressed(function() {
timerMode = "duration";
updateTabStyle();
});

deadlineBtn = createButton("🕐 종료 시각");
styleTimerTabBtn(deadlineBtn, false);
deadlineBtn.position(px + 280, py + 34);
deadlineBtn.size(200, 44);
deadlineBtn.mousePressed(function() {
timerMode = "deadline";
updateTabStyle();
});

// 시 / 분 / 초 입력 그룹
let rowY = py + 150;

let hourX = px + 95;
let minX = px + 260;
let secX = px + 425;

// 시
hourMinusBtn = createButton("-");
styleStepperButton(hourMinusBtn);
hourMinusBtn.position(hourX - 58, rowY);
hourMinusBtn.size(38, 42);
hourMinusBtn.mousePressed(function() {
adjustTimerValue("hour", -1);
});

hourInput = createInput(str(timerHour));
styleTimerInput(hourInput);
hourInput.position(hourX - 15, rowY);
hourInput.size(70, 42);

hourPlusBtn = createButton("+");
styleStepperButton(hourPlusBtn);
hourPlusBtn.position(hourX + 62, rowY);
hourPlusBtn.size(38, 42);
hourPlusBtn.mousePressed(function() {
adjustTimerValue("hour", 1);
});

// 분
minMinusBtn = createButton("-");
styleStepperButton(minMinusBtn);
minMinusBtn.position(minX - 58, rowY);
minMinusBtn.size(38, 42);
minMinusBtn.mousePressed(function() {
adjustTimerValue("min", -5);
});

minInput = createInput(str(timerMin));
styleTimerInput(minInput);
minInput.position(minX - 15, rowY);
minInput.size(70, 42);

minPlusBtn = createButton("+");
styleStepperButton(minPlusBtn);
minPlusBtn.position(minX + 62, rowY);
minPlusBtn.size(38, 42);
minPlusBtn.mousePressed(function() {
adjustTimerValue("min", 5);
});

// 초
secMinusBtn = createButton("-");
styleStepperButton(secMinusBtn);
secMinusBtn.position(secX - 58, rowY);
secMinusBtn.size(38, 42);
secMinusBtn.mousePressed(function() {
adjustTimerValue("sec", -10);
});

secInput = createInput(str(timerSec));
styleTimerInput(secInput);
secInput.position(secX - 15, rowY);
secInput.size(70, 42);

secPlusBtn = createButton("+");
styleStepperButton(secPlusBtn);
secPlusBtn.position(secX + 62, rowY);
secPlusBtn.size(38, 42);
secPlusBtn.mousePressed(function() {
adjustTimerValue("sec", 10);
});

// 빠른 설정 버튼
let quickY = py + 245;

createQuickTimerButton("5분", 5 * 60, px + 55, quickY);
createQuickTimerButton("15분", 15 * 60, px + 160, quickY);
createQuickTimerButton("25분", 25 * 60, px + 265, quickY);
createQuickTimerButton("50분", 50 * 60, px + 370, quickY);

// 설정 버튼
timerConfirmBtn = createButton("✓ 설정하기");
styleButton(timerConfirmBtn, "#5cb85c");
timerConfirmBtn.position(px + 150, py + 335);
timerConfirmBtn.size(220, 54);
timerConfirmBtn.mousePressed(confirmTimerSetting);

panelElements = [
durationBtn, deadlineBtn,
hourMinusBtn, hourInput, hourPlusBtn,
minMinusBtn, minInput, minPlusBtn,
secMinusBtn, secInput, secPlusBtn,
timerConfirmBtn,
...quickButtons
];
}

function closeTimerPanel() {
timerPanelOpen = false;
timerPanelIndex = -1;
closeTimerPanelDOM();
}

function closeTimerPanelDOM() {
for (let el of panelElements) {
if (el) {
el.remove();
}
}

panelElements = [];
quickButtons = [];
}

function drawTimerPanel() {
let pw = 520;
let ph = 420;
let px = width / 2 - pw / 2;
let py = height / 2 - ph / 2;

noStroke();
fill(0, 0, 0, 120);
rect(0, 0, width, height);

noStroke();
fill(30, 15, 60, 245);
rect(px, py, pw, ph, 22);

stroke(160, 130, 220);
strokeWeight(1.5);
noFill();
rect(px, py, pw, ph, 22);

noStroke();
fill(255);
textAlign(CENTER, CENTER);
textSize(22);
text("타이머 설정", px + pw / 2, py - 28);

fill(190, 175, 230);
textSize(14);
text("완료할 시간을 정하면 체크리스트와 연결됩니다.", px + pw / 2, py + 105);

// 시 / 분 / 초 라벨
fill(220, 200, 255);
textSize(15);

text("시", px + 135, py + 135);
text("분", px + 300, py + 135);
text("초", px + 465, py + 135);

// 하단 설명
fill(180, 160, 220);
textSize(12);

if (timerMode === "duration") {
text("예: 25분 동안 집중하기", px + pw / 2, py + ph - 78);
} else {
text("입력한 오늘의 시각까지 자동 카운트다운됩니다.", px + pw / 2, py + ph - 78);
}
}
function confirmTimerSetting() {
readTimerInputs();

let totalSec = timerHour * 3600 + timerMin * 60 + timerSec;

if (totalSec <= 0) return;

if (timerMode === "duration") {
setTimerDuration(timerPanelIndex, totalSec);
} else {
setTimerDeadline(timerPanelIndex, timerHour, timerMin, timerSec);
}

closeTimerPanel();
saveProgress();
}

function setTimerDuration(index, totalSec) {
let t = todoList[index].timer;

t.mode = "duration";
t.totalSec = totalSec;
t.remainSec = totalSec;
t.running = false;
t.finished = false;
t.expired = false;
t.startedAt = 0;
}

function setTimerDeadline(index, h, m, s) {
let now = new Date();
let target = new Date();

target.setHours(h, m, s, 0);

if (target <= now) {
target.setDate(target.getDate() + 1);
}

let diffSec = Math.floor((target - now) / 1000);

let t = todoList[index].timer;

t.mode = "deadline";
t.totalSec = diffSec;
t.remainSec = diffSec;
t.running = true;
t.finished = false;
t.expired = false;
t.startedAt = millis();

characterAnimating = true;
}

function startTimer(index) {
let t = todoList[index].timer;

if (t.mode !== "duration") return;
if (t.running || t.finished) return;

t.running = true;
t.startedAt = millis();

characterAnimating = true;
saveProgress();
}

function updateTimers() {
let runningExists = false;
let expiredExists = false;

for (let i = 0; i < todoList.length; i++) {
let todo = todoList[i];
let t = todo.timer;

if (!t) continue;

// 이미 초과된 타이머가 있고 아직 완료 체크가 안 됐으면 캐릭터 멈춤 유지
if (t.expired && !todo.done) {
expiredExists = true;
}

if (!t.running) continue;

if (todo.done) {
t.running = false;
t.finished = true;
t.expired = false;
continue;
}

runningExists = true;

let elapsed = (millis() - t.startedAt) / 1000;
t.remainSec = max(0, t.totalSec - elapsed);

if (t.remainSec <= 0) {
checkTimerExpired(i);
expiredExists = true;
}
}

// 하나라도 시간 초과된 할 일이 있으면 캐릭터 멈춤
if (expiredExists) {
characterAnimating = false;
}
// 초과된 건 없고 실행 중인 타이머만 있으면 캐릭터 움직임
else if (runningExists) {
characterAnimating = true;
}
}

function checkTimerExpired(index) {
let t = todoList[index].timer;

if (t.expired) return;

t.running = false;
t.finished = true;
t.expired = true;
t.remainSec = 0;

characterAnimating = false;
triggerPenalty(index);
saveProgress();
}

function triggerPenalty(index) {
penaltyList.push({
index: index,
startFrame: frameCount
});
}


// ============================================================
// 타이머 스타일 함수
// ============================================================

function styleTimerTabBtn(btn, active) {
btn.style("font-size", "13px");
btn.style("padding", "8px 14px");
btn.style("border", "none");
btn.style("border-radius", "8px");
btn.style("cursor", "pointer");
btn.style("font-weight", "bold");
btn.style("color", "white");
btn.style("background", active ? "#7c5cbf" : "#3a2a5a");
addHoverEffect(btn, 1.05);
}

function styleTimerInput(inp) {
inp.style("font-size", "18px");
inp.style("text-align", "center");
inp.style("padding", "4px");
inp.style("border", "2px solid #7c5cbf");
inp.style("border-radius", "8px");
inp.style("background", "rgba(255,255,255,0.95)");
inp.style("color", "#222");
inp.style("outline", "none");
inp.attribute("type", "number");
inp.attribute("min", "0");
}

function styleStepperButton(btn) {
btn.style("font-size", "20px");
btn.style("width", "34px");
btn.style("height", "36px");
btn.style("border", "none");
btn.style("border-radius", "8px");
btn.style("background", "#3a2a5a");
btn.style("color", "white");
btn.style("cursor", "pointer");
btn.style("font-weight", "bold");
addHoverEffect(btn, 1.12);
}

function createQuickTimerButton(label, sec, x, y) {
let btn = createButton(label);

btn.style("font-size", "13px");
btn.style("padding", "8px 12px");
btn.style("border", "none");
btn.style("border-radius", "999px");
btn.style("background", "#6b4aa0");
btn.style("color", "white");
btn.style("cursor", "pointer");
btn.style("font-weight", "bold");
btn.position(x, y);
btn.size(58, 34);

addHoverEffect(btn, 1.1);

btn.mousePressed(function() {
timerHour = Math.floor(sec / 3600);
timerMin = Math.floor((sec % 3600) / 60);
timerSec = Math.floor(sec % 60);
syncTimerInputs();

});

quickButtons.push(btn);
}

function adjustTimerValue(unit, amount) {
readTimerInputs();

if (unit === "hour") {
timerHour = constrain(timerHour + amount, 0, 99);
} else if (unit === "min") {
timerMin += amount;

while (timerMin >= 60) {
timerMin -= 60;
timerHour = constrain(timerHour + 1, 0, 99);
}

while (timerMin < 0) {
if (timerHour > 0) {
timerHour--;
timerMin += 60;
} else {
timerMin = 0;
break;
}
}
} else if (unit === "sec") {
timerSec += amount;

while (timerSec >= 60) {
timerSec -= 60;
timerMin++;
}

while (timerSec < 0) {
if (timerMin > 0) {
timerMin--;
timerSec += 60;
} else if (timerHour > 0) {
timerHour--;
timerMin = 59;
timerSec += 60;
} else {
timerSec = 0;
break;
}
}

while (timerMin >= 60) {
timerMin -= 60;
timerHour = constrain(timerHour + 1, 0, 99);
}
}

syncTimerInputs();
}

function readTimerInputs() {
timerHour = constrain(int(hourInput.value()) || 0, 0, 99);
timerMin = constrain(int(minInput.value()) || 0, 0, 59);
timerSec = constrain(int(secInput.value()) || 0, 0, 59);
}

function syncTimerInputs() {
if (hourInput) hourInput.value(timerHour);
if (minInput) minInput.value(timerMin);
if (secInput) secInput.value(timerSec);
}

function updateTabStyle() {
if (durationBtn && deadlineBtn) {
durationBtn.style("background", timerMode === "duration" ? "#7c5cbf" : "#3a2a5a");
deadlineBtn.style("background", timerMode === "deadline" ? "#7c5cbf" : "#3a2a5a");
}
}


// ============================================================
// 성장 경로
// ============================================================

function createPathNodes() {
pathNodes = [];

let startX = width * 0.16;
let endX = width * 0.84;
let baseY = height * 0.83;

for (let i = 0; i < todoList.length; i++) {
let x = map(i, 0, max(todoList.length - 1, 1), startX, endX);
let yOffset = sin(i * 1.1) * 28;
let y = baseY + yOffset;

pathNodes.push({ x: x, y: y });
}
}

function drawGrowthPath() {
if (pathNodes.length === 0) return;

stroke(210, 210, 230);
strokeWeight(3);
noFill();

beginShape();
for (let p of pathNodes) {
vertex(p.x, p.y);
}
endShape();

for (let i = 0; i < pathNodes.length; i++) {
let p = pathNodes[i];

if (i < countDone()) {
fill(180, 255, 200);
stroke(180, 255, 200);
} else {
fill(255);
stroke(200);
}

strokeWeight(2);
ellipse(p.x, p.y, 16, 16);

noStroke();
fill(220, 210, 255);
textSize(12);
text(i + 1, p.x, p.y + 24);
}
}

function drawMovingCharacterOnPath() {
let doneCount = countDone();
let stageIndex = getStageIndex(doneCount, todoList.length);
let pos = getCharacterPathPosition();

let angle = 0;

if (characterAnimating) {
angle = sin(frameCount * 0.05) * radians(5);
}

push();
translate(pos.x, pos.y);
rotate(angle);

// 하단 이동 캐릭터: 기존 90에서 360으로 4배 확대
image(getCurrentCharacterImage(stageIndex), 0, 0, 360, 360);

pop();

if (doneCount === todoList.length && todoList.length > 0) {
drawFinalEvolutionEffect(pos.x, pos.y);
}
}

function getCharacterPathPosition() {
let doneCount = countDone();

if (pathNodes.length === 0) {
return { x: width * 0.20, y: height * 0.70 };
}

let idx = constrain(doneCount, 0, pathNodes.length - 1);

return {
x: pathNodes[idx].x,

// 캐릭터가 커졌기 때문에 위로 올림
y: pathNodes[idx].y - 80
};
}

function drawFinalEvolutionEffect(x, y) {
finalBurst = min(finalBurst + 1, 55);

noStroke();

for (let i = 9; i > 0; i--) {
let alpha = map(i, 9, 0, 0, 120);
fill(180, 220, 255, alpha);
ellipse(x, y, i * finalBurst * 0.45, i * finalBurst * 0.45);
}

stroke(255, 230, 250, 150);
strokeWeight(2);

for (let i = 0; i < 12; i++) {
let angle = TWO_PI / 12 * i;
let len = finalBurst * 2.1;
line(
x + cos(angle) * 35,
y + sin(angle) * 35,
x + cos(angle) * len,
y + sin(angle) * len
);
}
}

function updateFinalBurstState() {
if (countDone() !== todoList.length) {
finalBurst = 0;
}
}


// ============================================================
// 결과 화면
// ============================================================

function goToResultPage() {
currentPage = "result";
closeTimerPanel();

if (
countDone() === todoList.length &&
todoList.length > 0 &&
rewardClaimed === false
) {
inventoryCount++;
rewardClaimed = true;
saveInventory();
}

showOnlyResultUI();
saveProgress();
}

function drawResultPage() {
drawGradientBG(color(20, 10, 50), color(60, 20, 80));

let doneCount = countDone();
let totalCount = todoList.length;
let percent = totalCount > 0 ? floor((doneCount / totalCount) * 100) : 0;
let stageIndex = getStageIndex(doneCount, totalCount);

fill(255);
textStyle(BOLD);
textSize(min(width, height) * 0.065);
text("오늘의 완료 기록", width / 2, height * 0.13);

textStyle(NORMAL);
fill(220, 210, 255);
textSize(min(width, height) * 0.032);
text("완료한 할 일: " + doneCount + " / " + totalCount, width / 2, height * 0.25);
text("완료율: " + percent + "%", width / 2, height * 0.31);

if (percent === 100) {
fill(180, 255, 200);
text("오늘의 캐릭터를 획득했습니다!", width / 2, height * 0.38);
} else {
fill(255, 180, 200);
text("완료율 100%가 되면 캐릭터를 획득할 수 있습니다.", width / 2, height * 0.38);
}

image(
getCurrentCharacterImage(stageIndex),
width / 2,
height * 0.56,
min(width, height) * 0.28,
min(width, height) * 0.28
);

fill(255);
textSize(min(width, height) * 0.027);
text("보유한 캐릭터 개수: " + inventoryCount + "개", width / 2, height * 0.76);

fill(220, 210, 255);
textSize(16);
text("이 화면은 이미지로 저장할 수 있습니다.", width / 2, height * 0.82);

textSize(15);
text("제작자: " + creatorNames, width / 2, height * 0.86);

if (creatorSchool !== "") {
text("소속: " + creatorSchool, width / 2, height * 0.89);
}
}

function downloadResultImage() {
saveCanvas("2DO_오늘의_완료기록", "png");
}

function goToMusicPage() {
currentPage = "music";
showOnlyMusicUI();
}

function goBackToResultPage() {
stopAllSongs();

currentPage = "result";
showOnlyResultUI();
}


// ============================================================
// 음악 화면
// ============================================================

function drawMusicPage() {
drawGradientBG(color(20, 10, 50), color(60, 20, 80));

fill(255);
textStyle(BOLD);
textSize(min(width, height) * 0.06);
text("Song", width * 0.12, height * 0.10);

textSize(24);
text("곡 이름", width * 0.28, height * 0.17);
text("필요 캐릭터 개수", width * 0.68, height * 0.17);

textStyle(NORMAL);
fill(220, 210, 255);
textSize(20);
text("보유한 캐릭터 개수: " + inventoryCount + "개", width * 0.78, height * 0.10);

for (let i = 0; i < songs.length; i++) {
drawSongRow(i);
}

fill(220, 210, 255);
textSize(15);
text("캐릭터를 모을수록 더 많은 곡을 플레이할 수 있습니다.", width / 2, height - 35);
}

function drawSongRow(i) {
let y = height * 0.26 + i * 64;
let song = songs[i];
let canPlay = inventoryCount >= song.need;

noStroke();

if (canPlay) {
fill(190, 180, 215, 220);
} else {
fill(120, 115, 140, 170);
}

rect(width * 0.08, y - 22, width * 0.80, 44, 22);

fill(255);
triangle(width * 0.11, y - 10, width * 0.11, y + 10, width * 0.125, y);

textAlign(LEFT, CENTER);
textSize(20);
fill(255);
text(song.title, width * 0.18, y);

textAlign(CENTER, CENTER);
text(song.need + "개", width * 0.68, y);

if (!canPlay) {
fill(255, 180, 200);
textSize(16);
text("잠김", width * 0.82, y);
} else if (currentSongIndex === i) {
fill(180, 255, 200);
textSize(16);
text("Now playing ...", width * 0.82, y);
}

textAlign(CENTER, CENTER);
}

function handleMusicClick() {
for (let i = 0; i < songs.length; i++) {
let y = height * 0.26 + i * 64;
let song = songs[i];

let inside =
mouseX > width * 0.08 &&
mouseX < width * 0.88 &&
mouseY > y - 22 &&
mouseY < y + 22;

if (inside) {
// 잠긴 곡이면 클릭해도 재생 안 됨
if (inventoryCount < song.need) {
console.log("아직 잠긴 곡입니다.");
return;
}

playSong(i);
return;
}
}
}

function playSong(index) {
if (!musicEnabled) {
console.log("곡 재생이 꺼져 있습니다. (상단/하단 토글로 켜기)");
return;
}

if (typeof userStartAudio === "function") {
userStartAudio();
}

// 브라우저 오디오 활성화
if (typeof userStartAudio === "function") {
userStartAudio();
}

// 현재 재생 중인 모든 곡 멈추기
for (let i = 0; i < songSounds.length; i++) {
if (songSounds[i] && songSounds[i].isPlaying()) {
songSounds[i].stop();
}
}

// 음악 파일이 없어도 선택 상태는 바뀌게 함
currentSongIndex = index;

// 음악 파일이 있으면 재생
if (songSounds[index]) {
songSounds[index].play();
} else {
console.log("음악 파일이 아직 없습니다. 표시만 변경합니다.");
}
}

function stopAllSongs() {
for (let i = 0; i < songSounds.length; i++) {
if (songSounds[i] && songSounds[i].isPlaying()) {
songSounds[i].stop();
}
}

currentSongIndex = -1;
}

// ============================================================
// 클릭 처리
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
// 저장 / 불러오기 / 초기화
// ============================================================

function saveProgress() {
let saveData = {
todoList: todoList,
selectedCharacterIndex: selectedCharacterIndex,
rewardClaimed: rewardClaimed
};

localStorage.setItem("twoDoProgress", JSON.stringify(saveData));
}

function loadProgress() {
let rawData = localStorage.getItem("twoDoProgress");

if (rawData === null) {
messageText = "저장된 기록이 없습니다.";
return;
}

let saveData = JSON.parse(rawData);

todoList = saveData.todoList || [];
selectedCharacterIndex = saveData.selectedCharacterIndex || 0;
rewardClaimed = saveData.rewardClaimed || false;

normalizeTodoTimers();

// 저장 기록은 바로 메인 화면으로 넘기지 않고,
// 입력 화면에서 목록을 다시 확인한 뒤 시작할 수 있게 함
currentPage = "input";
loadedFromSave = true;
messageText = "저장된 기록을 불러왔습니다.";

showOnlyInputUI();
}

function normalizeTodoTimers() {
for (let todo of todoList) {
if (!todo.timer) {
todo.timer = {
mode: null,
totalSec: 0,
remainSec: 0,
running: false,
finished: false,
expired: false,
startedAt: 0
};
}

// 저장 후 다시 불러올 때 millis() 기준이 달라지므로 실행 중인 타이머는 멈춘 상태로 복원
if (todo.timer.running) {
todo.timer.running = false;
}
}
}

function saveInventory() {
localStorage.setItem("twoDoInventoryCount", inventoryCount);
}

function loadInventory() {
let savedCount = localStorage.getItem("twoDoInventoryCount");

if (savedCount === null) {
inventoryCount = 0;
} else {
inventoryCount = int(savedCount);
}
}

// 새 할 일 시작: 오늘 할 일 기록만 삭제, 보유 캐릭터 개수는 유지
function restartProgram() {
stopAllSongs();
todoList = [];
messageText = "";
rewardClaimed = false;
finalBurst = 0;
characterAnimating = true;
currentSongIndex = -1;
timerPanelOpen = false;
timerPanelIndex = -1;
penaltyList = [];
loadedFromSave = false;

closeTimerPanelDOM();

localStorage.removeItem("twoDoProgress");

currentPage = "input";
showOnlyInputUI();
}

// 전체 초기화: 오늘 할 일 + 보유 캐릭터 개수까지 전부 삭제
function resetAllData() {
stopAllSongs();
todoList = [];
inventoryCount = 0;
messageText = "전체 기록이 초기화되었습니다.";
rewardClaimed = false;
finalBurst = 0;
characterAnimating = true;
currentSongIndex = -1;
timerPanelOpen = false;
timerPanelIndex = -1;
penaltyList = [];
loadedFromSave = false;

closeTimerPanelDOM();

localStorage.removeItem("twoDoProgress");
localStorage.removeItem("twoDoInventoryCount");

currentPage = "input";
showOnlyInputUI();
}


// ============================================================
// 배경 + 별 효과
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
