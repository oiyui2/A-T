// ============================================================
// 전역 변수
// ============================================================

let currentPage = "input"; // "input" 또는 "main"

let img;
let angleSpeed = 0.05;

// 캐릭터 인터랙션
let clickEffect = 1;
let glowSize = 0;

// 할 일 관련
let todoList = [];
let inputBox;
let addButton;
let completeButton;

// 타이머 패널 상태
let timerPanelOpen = false;
let timerPanelIndex = -1;
let timerMode = "duration";

// 타이머 입력값
let timerHour = 0;
let timerMin = 0;
let timerSec = 0;

// 패널 내 DOM 요소
let hourInput, minInput, secInput;
let durationBtn, deadlineBtn, timerConfirmBtn;
let hourMinusBtn, hourPlusBtn;
let minMinusBtn, minPlusBtn;
let secMinusBtn, secPlusBtn;
let quickButtons = [];
let panelElements = [];

// 패널티 연출
let penaltyList = [];

// 별똥별
let stars = [];

// 사운드 레이어 기반
let soundReady = false;
let bgmLayers = [];
let activeBgmLayerCount = 0;

// ============================================================
// preload
// ============================================================

function preload() {
}

// ============================================================
// setup
// ============================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  buildInputPage();

  for (let i = 0; i < 30; i++) {
    stars.push(createStar());
  }

  setupBgmLayers();
}

// ============================================================
// draw
// ============================================================

function draw() {
  if (currentPage === "input") {
    drawInputPage();
  } else if (currentPage === "main") {
    drawMainPage();
  }

  drawStars();
}

// ============================================================
// 1페이지 UI 생성
// ============================================================

function buildInputPage() {
  inputBox = createInput("");
  inputBox.attribute("placeholder", "할 일을 입력하세요");
  inputBox.style("font-size", "18px");
  inputBox.style("padding", "12px 16px");
  inputBox.style("border", "2px solid #7c5cbf");
  inputBox.style("border-radius", "12px");
  inputBox.style("outline", "none");
  inputBox.style("width", "320px");
  inputBox.style("background", "rgba(255,255,255,0.95)");
  inputBox.style("color", "#222");

  inputBox.elt.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  addButton = createButton("추가");
  styleButton(addButton, "#A478C0");
  addButton.mousePressed(addTodo);

  completeButton = createButton("입력 완료");
  styleButton(completeButton, "#e8578a");
  completeButton.mousePressed(goToMainPage);

  positionInputUI();
}

// ============================================================
// 버튼 스타일
// ============================================================

function styleButton(btn, bgColor) {
  btn.style("font-size", "16px");
  btn.style("padding", "12px 20px");
  btn.style("border", "none");
  btn.style("border-radius", "12px");
  btn.style("background", bgColor);
  btn.style("color", "white");
  btn.style("cursor", "pointer");
  btn.style("font-weight", "bold");
}

// ============================================================
// 1페이지 UI 위치
// ============================================================

function positionInputUI() {
  let cx = width / 2;
  let cy = height / 2;

  if (inputBox) inputBox.position(cx - 210, cy - 20);
  if (addButton) addButton.position(cx + 135, cy - 20);
  if (completeButton) completeButton.position(cx - 60, cy + 55);
}

// ============================================================
// 1페이지 그리기
// ============================================================

function drawInputPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));

  noStroke();
  fill(255);
  textSize(34);
  text("오늘의 할 일을 입력하세요", width / 2, height / 2 - 140);

  fill(220, 210, 255);
  textSize(16);
  text(
    "할 일을 입력한 뒤, 입력 완료 버튼을 누르면 체크리스트 화면으로 넘어갑니다.",
    width / 2,
    height / 2 - 95
  );

  if (todoList.length === 0) {
    fill(170, 150, 200);
    textSize(16);
    text("아직 입력된 할 일이 없습니다.", width / 2, height / 2 + 130);
  } else {
    fill(255);
    textSize(18);
    for (let i = 0; i < todoList.length; i++) {
      text(todoList[i].title, width / 2, height / 2 + 125 + i * 30);
    }
  }
}

// ============================================================
// 별똥별 관련 함수
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

// ============================================================
// 배경 음악 레이어 기반
// ============================================================

function setupBgmLayers() {
  if (typeof p5 === "undefined" || typeof p5.Oscillator === "undefined") {
    console.log("p5.sound 라이브러리가 연결되어 있지 않습니다.");
    return;
  }

  let configs = [
    { freq: 110, type: "sine", amp: 0.035 },
    { freq: 165, type: "triangle", amp: 0.025 },
    { freq: 220, type: "sine", amp: 0.02 },
    { freq: 277, type: "triangle", amp: 0.018 },
    { freq: 330, type: "sine", amp: 0.015 }
  ];

  for (let c of configs) {
    let osc = new p5.Oscillator(c.type);
    osc.freq(c.freq);
    osc.amp(0);
    osc.start();

    bgmLayers.push({
      osc: osc,
      targetAmp: c.amp,
      active: false
    });
  }
}

function unlockSoundOnce() {
  if (soundReady) return;

  if (typeof userStartAudio === "function") {
    userStartAudio();
  }

  soundReady = true;
}

function updateBgmLayers() {
  if (!soundReady) return;
  if (bgmLayers.length === 0) return;

  let completedCount = 0;

  for (let todo of todoList) {
    if (todo.done) {
      completedCount++;
    }
  }

  let nextLayerCount = constrain(completedCount, 0, bgmLayers.length);

  if (nextLayerCount === activeBgmLayerCount) return;

  activeBgmLayerCount = nextLayerCount;

  for (let i = 0; i < bgmLayers.length; i++) {
    let layer = bgmLayers[i];

    if (i < activeBgmLayerCount) {
      layer.active = true;
      layer.osc.amp(layer.targetAmp, 1.2);
    } else {
      layer.active = false;
      layer.osc.amp(0, 1.2);
    }
  }
}

function stopAllBgmLayers() {
  for (let layer of bgmLayers) {
    layer.osc.amp(0, 0.8);
    layer.active = false;
  }

  activeBgmLayerCount = 0;
}

// ============================================================
// 할 일 추가
// ============================================================

function addTodo() {
  let textValue = inputBox.value().trim();

  if (textValue === "") return;

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

  inputBox.value("");
  inputBox.elt.focus();
}

// ============================================================
// 입력 완료 → 메인 화면
// ============================================================

function goToMainPage() {
  if (todoList.length === 0) return;

  unlockSoundOnce();

  currentPage = "main";

  inputBox.hide();
  addButton.hide();
  completeButton.hide();
}

// ============================================================
// 2페이지 그리기
// ============================================================

function drawMainPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));

  updateTimers();
  updateBgmLayers();

  drawTopGuideLine();
  drawChecklist();

  if (timerPanelOpen) {
    drawTimerPanel();
  }
}

// ============================================================
// 상단 가이드 라인
// ============================================================

function drawTopGuideLine() {
  stroke(220, 210, 255, 120);
  strokeWeight(1);
  line(width * 0.03, height * 0.14, width * 0.97, height * 0.14);
}

// ============================================================
// 체크리스트 그리기
// ============================================================

function drawChecklist() {
  let listX = width * 0.58;
  let listY = height * 0.23;
  let listW = width * 0.26;

  let boxSize = min(width, height) * 0.028;
  let gap = min(height * 0.075, 55);

  noStroke();
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(min(width, height) * 0.022);
  text("할 일 체크리스트", listX, listY - gap * 0.8);

  for (let i = 0; i < todoList.length; i++) {
    let y = listY + i * gap;
    let todo = todoList[i];

    stroke(230);
    strokeWeight(1.5);
    fill(255);
    rect(listX, y - boxSize / 2, boxSize, boxSize);

    if (todo.done) {
      stroke(120, 255, 170);
      strokeWeight(3);
      line(listX + boxSize * 0.2, y, listX + boxSize * 0.45, y + boxSize * 0.25);
      line(listX + boxSize * 0.45, y + boxSize * 0.25, listX + boxSize * 0.85, y - boxSize * 0.35);
    }

    stroke(220, 210, 255, 180);
    strokeWeight(1);
    line(listX + boxSize + 12, y, listX + listW, y);

    noStroke();
    textSize(min(width, height) * 0.017);
    fill(todo.done ? color(170, 220, 180) : 255);
    text(todo.title, listX + boxSize + 16, y - boxSize * 0.9);

    fill(255, 170, 170);
    textAlign(CENTER, CENTER);
    text("x", listX + listW + 18, y);
    textAlign(LEFT, CENTER);

    drawTimerBox(i, listX + listW + 50, y);

    let t = todo.timer;

    if (t.mode !== null && t.totalSec > 0) {
      if (t.running || t.finished || t.expired) {
        drawTimerRing(i, listX + listW + 120, y);
      } else if (t.mode === "duration") {
        drawPlayButton(i, listX + listW + 120, y);
      }
    }
  }

  textAlign(CENTER, CENTER);
}

// ============================================================
// 타이머 박스
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

// ============================================================
// 타이머 패널 열기
// ============================================================

function openTimerPanel(index) {
  unlockSoundOnce();

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

  let px = width / 2 - 180;
  let py = height / 2 - 145;

  durationBtn = createButton("⏱ 시간 설정");
  styleTimerTabBtn(durationBtn, true);
  durationBtn.position(px + 24, py + 24);
  durationBtn.size(140, 36);
  durationBtn.mousePressed(() => {
    timerMode = "duration";
    updateTabStyle();
  });

  deadlineBtn = createButton("🕐 종료 시각");
  styleTimerTabBtn(deadlineBtn, false);
  deadlineBtn.position(px + 196, py + 24);
  deadlineBtn.size(140, 36);
  deadlineBtn.mousePressed(() => {
    timerMode = "deadline";
    updateTabStyle();
  });

  let rowY = py + 100;

  hourMinusBtn = createButton("-");
  styleStepperButton(hourMinusBtn);
  hourMinusBtn.position(px + 38, rowY);
  hourMinusBtn.mousePressed(() => adjustTimerValue("hour", -1));

  hourInput = createInput(str(timerHour));
  styleTimerInput(hourInput);
  hourInput.position(px + 78, rowY);
  hourInput.size(54, 36);

  hourPlusBtn = createButton("+");
  styleStepperButton(hourPlusBtn);
  hourPlusBtn.position(px + 140, rowY);
  hourPlusBtn.mousePressed(() => adjustTimerValue("hour", 1));

  minMinusBtn = createButton("-");
  styleStepperButton(minMinusBtn);
  minMinusBtn.position(px + 38, rowY + 58);
  minMinusBtn.mousePressed(() => adjustTimerValue("min", -5));

  minInput = createInput(str(timerMin));
  styleTimerInput(minInput);
  minInput.position(px + 78, rowY + 58);
  minInput.size(54, 36);

  minPlusBtn = createButton("+");
  styleStepperButton(minPlusBtn);
  minPlusBtn.position(px + 140, rowY + 58);
  minPlusBtn.mousePressed(() => adjustTimerValue("min", 5));

  secMinusBtn = createButton("-");
  styleStepperButton(secMinusBtn);
  secMinusBtn.position(px + 200, rowY + 58);
  secMinusBtn.mousePressed(() => adjustTimerValue("sec", -10));

  secInput = createInput(str(timerSec));
  styleTimerInput(secInput);
  secInput.position(px + 240, rowY + 58);
  secInput.size(54, 36);

  secPlusBtn = createButton("+");
  styleStepperButton(secPlusBtn);
  secPlusBtn.position(px + 302, rowY + 58);
  secPlusBtn.mousePressed(() => adjustTimerValue("sec", 10));

  createQuickTimerButton("5분", 5 * 60, px + 32, py + 220);
  createQuickTimerButton("15분", 15 * 60, px + 102, py + 220);
  createQuickTimerButton("25분", 25 * 60, px + 172, py + 220);
  createQuickTimerButton("50분", 50 * 60, px + 242, py + 220);

  timerConfirmBtn = createButton("✔ 설정하기");
  styleButton(timerConfirmBtn, "#5cb85c");
  timerConfirmBtn.position(px + 96, py + 262);
  timerConfirmBtn.size(168, 42);
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

// ============================================================
// 타이머 패널 닫기
// ============================================================

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

// ============================================================
// 타이머 패널 배경 그리기
// ============================================================

function drawTimerPanel() {
  let px = width / 2 - 180;
  let py = height / 2 - 145;
  let pw = 360;
  let ph = 330;

  noStroke();
  fill(0, 0, 0, 120);
  rect(0, 0, width, height);

  noStroke();
  fill(30, 15, 60, 245);
  rect(px, py, pw, ph, 18);

  stroke(160, 130, 220);
  strokeWeight(1.5);
  noFill();
  rect(px, py, pw, ph, 18);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("타이머 설정", px + pw / 2, py - 24);

  fill(190, 175, 230);
  textSize(12);
  text("완료할 시간을 정하면 체크리스트와 연결됩니다.", px + pw / 2, py + 78);

  fill(220, 200, 255);
  textSize(13);
  text("시", px + 105, py + 94);
  text("분", px + 105, py + 152);
  text("초", px + 267, py + 152);

  fill(180, 160, 220);
  textSize(11);

  if (timerMode === "duration") {
    text("예: 25분 동안 집중하기", px + pw / 2, py + ph - 50);
  } else {
    text("입력한 오늘의 시각까지 자동 카운트다운됩니다.", px + pw / 2, py + ph - 50);
  }

  textAlign(CENTER, CENTER);
}

// ============================================================
// 타이머 설정 확인
// ============================================================

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
}

// ============================================================
// "~동안" 모드 설정
// ============================================================

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

// ============================================================
// "~까지" 모드 설정
// ============================================================

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
}

// ============================================================
// 플레이 버튼으로 타이머 시작
// ============================================================

function startTimer(index) {
  let t = todoList[index].timer;

  if (t.mode !== "duration") return;
  if (t.running || t.finished) return;

  t.running = true;
  t.startedAt = millis();
}

// ============================================================
// 매 프레임 타이머 갱신
// ============================================================

function updateTimers() {
  for (let i = 0; i < todoList.length; i++) {
    let todo = todoList[i];
    let t = todo.timer;

    if (!t.running) continue;

    if (todo.done) {
      t.running = false;
      t.finished = true;
      t.expired = false;
      continue;
    }

    let elapsed = (millis() - t.startedAt) / 1000;
    t.remainSec = max(0, t.totalSec - elapsed);

    if (t.remainSec <= 0) {
      checkTimerExpired(i);
    }
  }
}

// ============================================================
// 시간 초과 판정
// ============================================================

function checkTimerExpired(index) {
  let t = todoList[index].timer;

  if (t.expired) return;

  t.running = false;
  t.finished = true;
  t.expired = true;
  t.remainSec = 0;

  triggerPenalty(index);
}

// ============================================================
// 패널티 발동
// ============================================================

function triggerPenalty(index) {
  penaltyList.push({
    index: index,
    startFrame: frameCount
  });

  console.log("⚠️ 패널티 발동: " + todoList[index].title);
}

// ============================================================
// 플레이 버튼 그리기
// ============================================================

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

// ============================================================
// 타이머 원형 그래프
// ============================================================

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

// ============================================================
// 패널티 시각 경고 연출
// ============================================================

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
// 타이머 관련 클릭 처리
// ============================================================

function handleTimerClicks() {
  let listX = width * 0.58;
  let listY = height * 0.23;
  let listW = width * 0.26;
  let gap = min(height * 0.075, 55);

  let timerBoxX = listX + listW + 50;
  let playX = listX + listW + 120;

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
// 마우스 클릭 처리
// ============================================================

function mousePressed() {
  unlockSoundOnce();

  if (currentPage === "main") {
    if (timerPanelOpen) {
      let px = width / 2 - 180;
      let py = height / 2 - 145;

      if (mouseX < px || mouseX > px + 360 || mouseY < py || mouseY > py + 330) {
        closeTimerPanel();
        return;
      }
    }

    handleCharacterClick();
    handleChecklistClick();
    handleTimerClicks();
  }
}

// ============================================================
// 캐릭터 클릭
// ============================================================

function handleCharacterClick() {
  let charX = width * 0.22;
  let charY = height * 0.38;
  let charSize = min(width, height) * 0.3;

  let d = dist(mouseX, mouseY, charX, charY);

  if (d < charSize * 0.42) {
    clickEffect = 1.2;
    glowSize = charSize * 0.7;
  }
}

// ============================================================
// 체크리스트 클릭
// ============================================================

function handleChecklistClick() {
  let listX = width * 0.58;
  let listY = height * 0.23;
  let listW = width * 0.26;

  let boxSize = min(width, height) * 0.028;
  let gap = min(height * 0.075, 55);

  for (let i = 0; i < todoList.length; i++) {
    let y = listY + i * gap;

    if (
      mouseX > listX &&
      mouseX < listX + boxSize &&
      mouseY > y - boxSize / 2 &&
      mouseY < y + boxSize / 2
    ) {
      todoList[i].done = !todoList[i].done;
      unlockSoundOnce();
      updateBgmLayers();
      return;
    }

    if (
      mouseX > listX + listW + 5 &&
      mouseX < listX + listW + 30 &&
      mouseY > y - 15 &&
      mouseY < y + 15
    ) {
      todoList.splice(i, 1);
      updateBgmLayers();
      return;
    }
  }
}

// ============================================================
// 그라데이션 배경
// ============================================================

function drawGradientBG(c1, c2) {
  noStroke();

  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    fill(lerpColor(c1, c2, inter));
    rect(0, y, width, 1);
  }
}

// ============================================================
// 시간 포맷 유틸리티
// ============================================================

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
// 타이머 탭 버튼 스타일
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

  btn.mousePressed(() => {
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
  if (hourInput) {
    hourInput.value(timerHour);
  }

  if (minInput) {
    minInput.value(timerMin);
  }

  if (secInput) {
    secInput.value(timerSec);
  }
}

function updateTabStyle() {
  if (durationBtn && deadlineBtn) {
    durationBtn.style("background", timerMode === "duration" ? "#7c5cbf" : "#3a2a5a");
    deadlineBtn.style("background", timerMode === "deadline" ? "#7c5cbf" : "#3a2a5a");
  }
}

// ============================================================
// 창 크기 변경 대응
// ============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionInputUI();

  if (timerPanelOpen) {
    let currentIndex = timerPanelIndex;
    closeTimerPanelDOM();
    timerPanelOpen = false;
    openTimerPanel(currentIndex);
  }
}
