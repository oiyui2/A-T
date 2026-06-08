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

let pw = 560;
let ph = 430;
let px = width / 2 - pw / 2;
let py = height / 2 - ph / 2;

// 탭 버튼
durationBtn = createButton("TIMER");
styleTimerTabBtn(durationBtn, true);
durationBtn.position(px + 48, py + 34);
durationBtn.size(220, 42);
durationBtn.mousePressed(function() {
timerMode = "duration";
updateTabStyle();
playValidClickSound();
});

deadlineBtn = createButton("DEADLINE");
styleTimerTabBtn(deadlineBtn, false);
deadlineBtn.position(px + 292, py + 34);
deadlineBtn.size(220, 42);
deadlineBtn.mousePressed(function() {
timerMode = "deadline";
updateTabStyle();
playValidClickSound();
});

// 시 / 분 / 초 입력 그룹
let rowY = py + 156;

let groupGap = 156;
let centerX = px + pw / 2;
let hourX = centerX - groupGap;
let minX = centerX;
let secX = centerX + groupGap;

// 시
hourMinusBtn = createButton("-");
styleStepperButton(hourMinusBtn);
hourMinusBtn.position(hourX - 58, rowY);
hourMinusBtn.size(38, 42);
hourMinusBtn.mousePressed(function() {
adjustTimerValue("hour", -1);
playValidClickSound();
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
playValidClickSound();
});

// 분
minMinusBtn = createButton("-");
styleStepperButton(minMinusBtn);
minMinusBtn.position(minX - 58, rowY);
minMinusBtn.size(38, 42);
minMinusBtn.mousePressed(function() {
adjustTimerValue("min", -5);
playValidClickSound();
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
playValidClickSound();
});

// 초
secMinusBtn = createButton("-");
styleStepperButton(secMinusBtn);
secMinusBtn.position(secX - 58, rowY);
secMinusBtn.size(38, 42);
secMinusBtn.mousePressed(function() {
adjustTimerValue("sec", -10);
playValidClickSound();
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
playValidClickSound();
});

// 빠른 설정 버튼
let quickY = py + 252;

createQuickTimerButton("5분", 5 * 60, px + 76, quickY);
createQuickTimerButton("15분", 15 * 60, px + 196, quickY);
createQuickTimerButton("25분", 25 * 60, px + 316, quickY);
createQuickTimerButton("50분", 50 * 60, px + 436, quickY);

// 설정 버튼
timerConfirmBtn = createButton("SET TIMER");
styleSciButton(timerConfirmBtn, "#5fffe0");
timerConfirmBtn.position(px + 180, py + 356);
timerConfirmBtn.size(200, 48);
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
let pw = 560;
let ph = 430;
let px = width / 2 - pw / 2;
let py = height / 2 - ph / 2;

noStroke();
fill(0, 4, 12, 150);
rect(0, 0, width, height);

drawingContext.shadowBlur = 28;
drawingContext.shadowColor = "#5fffe0";

noStroke();
fill(5, 18, 34, 246);
rect(px, py, pw, ph, 8);

stroke(95, 255, 224, 185);
strokeWeight(1.5);
noFill();
rect(px, py, pw, ph, 8);

drawingContext.shadowBlur = 0;

stroke(95, 255, 224, 135);
strokeWeight(1);
line(px + 24, py + 22, px + 118, py + 22);
line(px + pw - 24, py + ph - 22, px + pw - 118, py + ph - 22);

noStroke();
textFont("Orbitron");
fill(235, 255, 252);
textAlign(CENTER, CENTER);
textStyle(BOLD);
textSize(24);
text("TIME MODULE", px + pw / 2, py - 28);

textStyle(NORMAL);
textFont("Share Tech Mono");
fill(160, 255, 238);
textSize(14);
text("Link focus time to the selected mission.", px + pw / 2, py + 105);

// 시 / 분 / 초 라벨
fill(220, 255, 248);
textSize(15);

text("시", px + pw / 2 - 116, py + 138);
text("분", px + pw / 2 + 40, py + 138);
text("초", px + pw / 2 + 196, py + 138);

// 하단 설명
fill(150, 220, 232);
textSize(12);

if (timerMode === "duration") {
text("Example: 25 minutes of focused orbit.", px + pw / 2, py + ph - 94);
} else {
text("Countdown runs until today's selected time.", px + pw / 2, py + ph - 94);
}

textFont("sans-serif");
textStyle(NORMAL);
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
playValidClickSound();
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
btn.style("border", "1.3px solid rgba(95,255,224,0.78)");
btn.style("border-radius", "4px");
btn.style("cursor", "pointer");
btn.style("font-weight", "700");
btn.style("font-family", "'Share Tech Mono', monospace");
btn.style("letter-spacing", "1px");
btn.style("color", active ? "#ffffff" : "#9fffee");
btn.style("background", active ? "rgba(95,255,224,0.22)" : "rgba(4,18,32,0.82)");
btn.style("box-shadow", active ? "0 0 16px rgba(95,255,224,0.70), inset 0 0 14px rgba(95,255,224,0.20)" : "inset 0 0 12px rgba(95,255,224,0.08)");
addHoverEffect(btn, 1.05);
}

function styleTimerInput(inp) {
inp.style("font-size", "18px");
inp.style("text-align", "center");
inp.style("padding", "4px");
inp.style("border", "1.5px solid rgba(95,255,224,0.88)");
inp.style("border-radius", "4px");
inp.style("background", "rgba(2, 12, 24, 0.92)");
inp.style("color", "#5fffe0");
inp.style("outline", "none");
inp.style("font-family", "'Share Tech Mono', monospace");
inp.style("box-shadow", "inset 0 0 12px rgba(95,255,224,0.18)");
inp.attribute("type", "number");
inp.attribute("min", "0");
}

function styleStepperButton(btn) {
btn.style("font-size", "20px");
btn.style("width", "34px");
btn.style("height", "36px");
btn.style("border", "1.2px solid rgba(95,255,224,0.8)");
btn.style("border-radius", "4px");
btn.style("background", "rgba(4,18,32,0.82)");
btn.style("color", "#5fffe0");
btn.style("cursor", "pointer");
btn.style("font-weight", "bold");
btn.style("box-shadow", "inset 0 0 10px rgba(95,255,224,0.12)");
addHoverEffect(btn, 1.12);
}

function createQuickTimerButton(label, sec, x, y) {
let btn = createButton(label);

btn.style("font-size", "13px");
btn.style("padding", "8px 12px");
btn.style("border", "1.2px solid rgba(180,124,255,0.8)");
btn.style("border-radius", "4px");
btn.style("background", "rgba(18,14,42,0.86)");
btn.style("color", "#d6c2ff");
btn.style("cursor", "pointer");
btn.style("font-weight", "bold");
btn.style("font-family", "'Share Tech Mono', monospace");
btn.style("box-shadow", "inset 0 0 10px rgba(180,124,255,0.14)");
btn.position(x, y);
btn.size(58, 34);

addHoverEffect(btn, 1.1);

btn.mousePressed(function() {
timerHour = Math.floor(sec / 3600);
timerMin = Math.floor((sec % 3600) / 60);
timerSec = Math.floor(sec % 60);
syncTimerInputs();
playValidClickSound();

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
let activeBg = "rgba(95,255,224,0.22)";
let idleBg = "rgba(4,18,32,0.82)";
let activeShadow = "0 0 16px rgba(95,255,224,0.70), inset 0 0 14px rgba(95,255,224,0.20)";
let idleShadow = "inset 0 0 12px rgba(95,255,224,0.08)";

durationBtn.style("background", timerMode === "duration" ? activeBg : idleBg);
deadlineBtn.style("background", timerMode === "deadline" ? activeBg : idleBg);
durationBtn.style("color", timerMode === "duration" ? "#ffffff" : "#9fffee");
deadlineBtn.style("color", timerMode === "deadline" ? "#ffffff" : "#9fffee");
durationBtn.style("box-shadow", timerMode === "duration" ? activeShadow : idleShadow);
deadlineBtn.style("box-shadow", timerMode === "deadline" ? activeShadow : idleShadow);
}
}
