// 타이머 관련 함수
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
