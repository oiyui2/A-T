// 타이머 및 네비게이션 DOM 변수들
let inputBox, addButton, completeButton, fullscreenButton, loadButton, resetAllButton;
let resultButton, saveImageButton, musicPageButton, restartButton, backToMainButton, stopMusicButton;
let navHomeBtn, navTodoBtn, navMusicBtn, musicToggleBtn;
let hourInput, minInput, secInput, durationBtn, deadlineBtn, timerConfirmBtn;
let hourMinusBtn, hourPlusBtn, minMinusBtn, minPlusBtn, secMinusBtn, secPlusBtn;
let quickButtons = [];
let panelElements = [];

// ============================================================
// UI 빌더 및 스타일링
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
    if (e.key === "Enter") addTodo();
  });

  addButton = createButton("추가");
  styleButton(addButton, "#A478C0");
  addButton.mousePressed(addTodo);

  completeButton = createButton("오늘 할 일 시작");
  styleButton(completeButton, "#e8578a");
  completeButton.mousePressed(goToMainPage);

  fullscreenButton = createButton("전체화면");
  styleButton(fullscreenButton, "#5f6fbf");
  fullscreenButton.mousePressed(() => { fullscreen(!fullscreen()); resizeCanvas(windowWidth, windowHeight); });

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
  saveImageButton.mousePressed(() => saveCanvas("2DO_오늘의_완료기록", "png"));

  musicPageButton = createButton("곡 플레이 화면");
  styleButton(musicPageButton, "#7c5cbf");
  musicPageButton.mousePressed(() => { currentPage = "music"; showOnlyMusicUI(); });

  restartButton = createButton("새 할 일 시작");
  styleButton(restartButton, "#5f6fbf");
  restartButton.mousePressed(restartProgram);
}

function buildMusicPageUI() {
  backToMainButton = createButton("결과 화면으로");
  styleButton(backToMainButton, "#7c5cbf");
  backToMainButton.mousePressed(() => { stopAllSongs(); currentPage = "result"; showOnlyResultUI(); });

  stopMusicButton = createButton("노래 멈추기");
  styleButton(stopMusicButton, "#555");
  stopMusicButton.mousePressed(stopAllSongs);
  
  musicToggleBtn = createButton("🔊 곡 재생: 켜짐");  
  styleButton(musicToggleBtn, "#5cb85c");
  musicToggleBtn.mousePressed(toggleMusicEnabled);
}

function buildNavBar() {
  navHomeBtn = createButton("🏠 홈"); styleNavButton(navHomeBtn); navHomeBtn.mousePressed(navToHome);
  navTodoBtn = createButton("✅ 투두"); styleNavButton(navTodoBtn); navTodoBtn.mousePressed(navToTodo);
  navMusicBtn = createButton("🎵 곡 재생"); styleNavButton(navMusicBtn); navMusicBtn.mousePressed(navToMusic);
}

// ============================================================
// UI 가시성 및 배치 제어
// ============================================================
function hideAllUI() {
  let elements = [inputBox, addButton, completeButton, fullscreenButton, loadButton, resetAllButton,
                  resultButton, saveImageButton, musicPageButton, restartButton, backToMainButton, stopMusicButton, musicToggleBtn];
  elements.forEach(el => { if(el) el.hide(); });
  closeTimerPanelDOM();
  timerPanelOpen = false;
  timerPanelIndex = -1;
}

function showOnlyInputUI() { hideAllUI(); [inputBox, addButton, completeButton, fullscreenButton, loadButton, resetAllButton].forEach(el => { if(el) el.show(); }); }
function showOnlyMainUI() { hideAllUI(); if(resultButton) resultButton.show(); }
function showOnlyResultUI() { hideAllUI(); [saveImageButton, musicPageButton, restartButton, resetAllButton].forEach(el => { if(el) el.show(); }); }
function showOnlyMusicUI() { hideAllUI(); [backToMainButton, stopMusicButton, musicToggleBtn].forEach(el => { if(el) el.show(); }); }

function positionUI() {
  let bw = 120, gap = 10, by = 20;
  let startX = width / 2 - (bw * 3 + gap * 2) / 2;
  [navHomeBtn, navTodoBtn, navMusicBtn].forEach((btn, i) => { if(btn){ btn.size(bw, 42); btn.position(startX + (bw + gap) * i, by); } });

  let active = "rgba(124,92,191,0.95)", idle = "rgba(255,255,255,0.12)";
  if(navHomeBtn) navHomeBtn.style("background", currentPage === "input" ? active : idle);
  if(navTodoBtn) navTodoBtn.style("background", currentPage === "main" ? active : idle);
  if(navMusicBtn) navMusicBtn.style("background", currentPage === "music" ? active : idle);
  
  if (currentPage === "input") {
    let inputW = min(500, width * 0.45), inputH = 42, addW = 105, g = 14;
    let groupX = width * 0.36 - (inputW + g + addW) / 2;
    if(inputBox) { inputBox.size(inputW, inputH); inputBox.position(groupX, height * 0.34); }
    if(addButton) { addButton.size(addW, inputH); addButton.position(groupX + inputW + g, height * 0.34); }
    if(completeButton) { completeButton.size(230, 58); completeButton.position(width * 0.36 - 115, height * 0.48); }
    if(loadButton) { loadButton.size(260, 58); loadButton.position(width * 0.36 - 130, height * 0.59); }
    if(resetAllButton) { resetAllButton.size(210, 58); resetAllButton.position(width * 0.36 - 105, height * 0.70); }
    if(fullscreenButton) fullscreenButton.position(width - 150, 30);
  } else if (currentPage === "main") {
    if(resultButton) resultButton.position(width - 190, height - 80);
  } else if (currentPage === "result") {
    if(saveImageButton) saveImageButton.position(width / 2 - 320, height * 0.88); 
    if(musicPageButton) musicPageButton.position(width / 2 - 145, height * 0.88);
    if(restartButton) restartButton.position(width / 2 + 25, height * 0.88); 
    if(resetAllButton) resetAllButton.position(width / 2 + 175, height * 0.88);
  } else if (currentPage === "music") {
    if(musicToggleBtn) { musicToggleBtn.size(180, 56); musicToggleBtn.position(width - 520, height - 84); }
    if(stopMusicButton) { stopMusicButton.size(150, 56); stopMusicButton.position(width - 350, height - 84); }
    if(backToMainButton) { backToMainButton.size(150, 56); backToMainButton.position(width - 180, height - 84); }
  }
}

function getTodoLayout() {
  let denom = max(todoList.length - 1, 1);
  let rowGap = max(52, min(70, (height * 0.48) / denom));
  return { listX: width * 0.58, listY: height * 0.30, listW: width * 0.23, rowGap: rowGap, boxSize: 24 };
}

// ============================================================
// 스타일 헬퍼 및 부속 타이머 UI 생성
// ============================================================
function styleButton(btn, bgColor) {
  btn.style("font-size", "16px"); btn.style("padding", "12px 20px"); btn.style("border", "none");
  btn.style("border-radius", "12px"); btn.style("background", bgColor); btn.style("color", "white");
  btn.style("cursor", "pointer"); btn.style("font-weight", "bold"); addHoverEffect(btn);  
}

function styleNavButton(btn) {
  btn.style("font-size", "15px"); btn.style("border", "none"); btn.style("border-radius", "999px");
  btn.style("background", "rgba(255,255,255,0.12)"); btn.style("color", "white"); btn.style("cursor", "pointer");
  btn.style("font-weight", "bold"); addHoverEffect(btn, 1.10);
}

function addHoverEffect(btn, scaleAmt = 1.08) {
  btn.style("transition", "transform 0.12s ease, box-shadow 0.12s ease");
  btn.mouseOver(() => { btn.style("transform", "scale(" + scaleAmt + ")"); btn.style("box-shadow", "0 6px 18px rgba(0,0,0,0.35)"); });
  btn.mouseOut(() => { btn.style("transform", "scale(1.0)"); btn.style("box-shadow", "none"); });
}

function openTimerPanel(index) {
  if (timerPanelOpen && timerPanelIndex === index) { closeTimerPanel(); return; }
  timerPanelOpen = true; timerPanelIndex = index; timerMode = "duration";
  let t = todoList[index].timer;
  if (t.mode !== null && t.totalSec > 0) {
    timerHour = Math.floor(t.totalSec / 3600); timerMin = Math.floor((t.totalSec % 3600) / 60); timerSec = Math.floor(t.totalSec % 60);
  } else {
    timerHour = 0; timerMin = 25; timerSec = 0;
  }
  closeTimerPanelDOM();
  let pw = 520, ph = 420, px = width / 2 - pw / 2, py = height / 2 - ph / 2;

  durationBtn = createButton("⏱ 타이머"); styleTimerTabBtn(durationBtn, true); durationBtn.position(px + 40, py + 34); durationBtn.size(200, 44);
  durationBtn.mousePressed(() => { timerMode = "duration"; updateTabStyle(); });
  deadlineBtn = createButton("🕐 종료 시각"); styleTimerTabBtn(deadlineBtn, false); deadlineBtn.position(px + 280, py + 34); deadlineBtn.size(200, 44);
  deadlineBtn.mousePressed(() => { timerMode = "deadline"; updateTabStyle(); });

  let rowY = py + 150, hourX = px + 95, minX = px + 260, secX = px + 425;
  hourMinusBtn = createButton("-"); styleStepperButton(hourMinusBtn); hourMinusBtn.position(hourX - 58, rowY); hourMinusBtn.mousePressed(() => adjustTimerValue("hour", -1));
  hourInput = createInput(str(timerHour)); styleTimerInput(hourInput); hourInput.position(hourX - 15, rowY); hourInput.size(70, 42);
  hourPlusBtn = createButton("+"); styleStepperButton(hourPlusBtn); hourPlusBtn.position(hourX + 62, rowY); hourPlusBtn.mousePressed(() => adjustTimerValue("hour", 1));

  minMinusBtn = createButton("-"); styleStepperButton(minMinusBtn); minMinusBtn.position(minX - 58, rowY); minMinusBtn.mousePressed(() => adjustTimerValue("min", -5));
  minInput = createInput(str(timerMin)); styleTimerInput(minInput); minInput.position(minX - 15, rowY); minInput.size(70, 42);
  minPlusBtn = createButton("+"); styleStepperButton(minPlusBtn); minPlusBtn.position(minX + 62, rowY); minPlusBtn.mousePressed(() => adjustTimerValue("min", 5));

  secMinusBtn = createButton("-"); styleStepperButton(secMinusBtn); secMinusBtn.position(secX - 58, rowY); secMinusBtn.mousePressed(() => adjustTimerValue("sec", -10));
  secInput = createInput(str(timerSec)); styleTimerInput(secInput); secInput.position(secX - 15, rowY); secInput.size(70, 42);
  secPlusBtn = createButton("+"); styleStepperButton(secPlusBtn); secPlusBtn.position(secX + 62, rowY); secPlusBtn.mousePressed(() => adjustTimerValue("sec", 10));

  createQuickTimerButton("5분", 5 * 60, px + 55, py + 245);
  createQuickTimerButton("15분", 15 * 60, px + 160, py + 245);
  createQuickTimerButton("25분", 25 * 60, px + 265, py + 245);
  createQuickTimerButton("50분", 50 * 60, px + 370, py + 245);

  timerConfirmBtn = createButton("✓ 설정하기"); styleButton(timerConfirmBtn, "#5cb85c"); timerConfirmBtn.position(px + 150, py + 335); timerConfirmBtn.size(220, 54);
  timerConfirmBtn.mousePressed(confirmTimerSetting);

  panelElements = [durationBtn, deadlineBtn, hourMinusBtn, hourInput, hourPlusBtn, minMinusBtn, minInput, minPlusBtn, secMinusBtn, secInput, secPlusBtn, timerConfirmBtn, ...quickButtons];
}

function closeTimerPanel() { timerPanelOpen = false; timerPanelIndex = -1; closeTimerPanelDOM(); }
function closeTimerPanelDOM() { panelElements.forEach(el => { if (el) el.remove(); }); panelElements = []; quickButtons = []; }
function styleTimerTabBtn(btn, active) { btn.style("font-size", "13px"); btn.style("padding", "8px 14px"); btn.style("border", "none"); btn.style("border-radius", "8px"); btn.style("cursor", "pointer"); btn.style("font-weight", "bold"); btn.style("color", "white"); btn.style("background", active ? "#7c5cbf" : "#3a2a5a"); addHoverEffect(btn, 1.05); }
function styleTimerInput(inp) { inp.style("font-size", "18px"); inp.style("text-align", "center"); inp.style("padding", "4px"); inp.style("border", "2px solid #7c5cbf"); inp.style("border-radius", "8px"); inp.style("background", "rgba(255,255,255,0.95)"); inp.style("color", "#222"); inp.style("outline", "none"); inp.attribute("type", "number"); inp.attribute("min", "0"); }
function styleStepperButton(btn) { btn.style("font-size", "20px"); btn.style("width", "34px"); btn.style("height", "36px"); btn.style("border", "none"); btn.style("border-radius", "8px"); btn.style("background", "#3a2a5a"); btn.style("color", "white"); btn.style("cursor", "pointer"); btn.style("font-weight", "bold"); addHoverEffect(btn, 1.12); }

function createQuickTimerButton(label, sec, x, y) {
  let btn = createButton(label);
  btn.style("font-size", "13px"); btn.style("padding", "8px 12px"); btn.style("border", "none"); btn.style("border-radius", "999px");
  btn.style("background", "#6b4aa0"); btn.style("color", "white"); btn.style("cursor", "pointer"); btn.style("font-weight", "bold");
  btn.position(x, y); btn.size(58, 34); addHoverEffect(btn, 1.1);
  btn.mousePressed(() => { timerHour = Math.floor(sec / 3600); timerMin = Math.floor((sec % 3600) / 60); timerSec = Math.floor(sec % 60); syncTimerInputs(); });
  quickButtons.push(btn);
}

function updateTabStyle() { if (durationBtn && deadlineBtn) { durationBtn.style("background", timerMode === "duration" ? "#7c5cbf" : "#3a2a5a"); deadlineBtn.style("background", timerMode === "deadline" ? "#7c5cbf" : "#3a2a5a"); } }
function syncTimerInputs() { if (hourInput) hourInput.value(timerHour); if (minInput) minInput.value(timerMin); if (secInput) secInput.value(timerSec); }
