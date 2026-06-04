// UI / 화면 그리기 / 성장 경로 / 결과 화면
// ============================================================

function buildInputPageUI() {
  inputBox = createInput("");
  inputBox.attribute("placeholder", "할 일을 입력하세요");
  inputBox.style("font-size", "18px");
  inputBox.style("padding", "12px 22px");
  inputBox.style("box-sizing", "border-box");
  inputBox.style("border", "1.5px solid #5fffe0");
  inputBox.style("border-radius", "4px");
  inputBox.style("outline", "none");
  inputBox.style("background", "rgba(0, 12, 12, 0.72)");
  inputBox.style("color", "#5fffe0");
  inputBox.style("font-family", "'Share Tech Mono', monospace");
  inputBox.style("box-shadow", "0 0 14px rgba(95,255,224,0.45), inset 0 0 14px rgba(95,255,224,0.12)");

  inputBox.elt.addEventListener("keydown", function(e) {
    if (e.key === "Enter") addTodo();
  });

  addButton = createButton("추가");
  styleSciButton(addButton, "#5fffe0");
  addButton.mousePressed(addTodo);

  completeButton = createButton("▷ 오늘 할 일 시작");
  styleSciButton(completeButton, "#5fffe0");
  completeButton.mousePressed(goToMainPage);

  fullscreenButton = createButton("⛶ 전체화면");
  styleSciButton(fullscreenButton, "#5fffe0");
  fullscreenButton.mousePressed(turnOnFullscreen);

  loadButton = createButton("▣ 저장 기록 불러오기");
  styleSciButton(loadButton, "#b47cff");
  loadButton.mousePressed(loadProgress);

  resetAllButton = createButton("▤ 전체 초기화");
  styleSciButton(resetAllButton, "#4bb8ff");
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
  navHomeBtn = createButton("HOME");
  styleNavButton(navHomeBtn);
  navHomeBtn.mousePressed(navToHome);

  navTodoBtn = createButton("TO DO");
  styleNavButton(navTodoBtn);
  navTodoBtn.mousePressed(navToTodo);

  navDexBtn = createButton("INVENTORY");
  styleNavButton(navDexBtn);
  navDexBtn.mousePressed(navToDex);

  navMusicBtn = createButton("SONG");
  styleNavButton(navMusicBtn);
  navMusicBtn.mousePressed(navToMusic);
}

function styleNavButton(btn) {
  btn.style("font-size", "15px");
  btn.style("border", "1.5px solid rgba(95,255,224,0.85)");
  btn.style("border-radius", "4px");
  btn.style("background", "rgba(0, 20, 22, 0.72)");
  btn.style("color", "#5fffe0");
  btn.style("cursor", "pointer");
  btn.style("font-weight", "700");
  btn.style("font-family", "'Orbitron', 'Share Tech Mono', monospace");
  btn.style("letter-spacing", "1px");
  btn.style("box-shadow", "0 0 12px rgba(95,255,224,0.45), inset 0 0 12px rgba(95,255,224,0.12)");
  btn.style("backdrop-filter", "blur(3px)");
  addHoverEffect(btn, 1.06);
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

function navToDex() {
  closeTimerPanel();
  currentPage = "dex";
  showOnlyDexUI();
}

function navToMusic() {
  closeTimerPanel();
  currentPage = "music";
  showOnlyMusicUI();
}

function positionNav() {
  let bw = 135;
  let gap = 12;
  let by = 22;
  let totalW = bw * 4 + gap * 3;
  let startX = width / 2 - totalW / 2;

  navHomeBtn.size(bw, 46);
  navTodoBtn.size(bw, 46);
  navDexBtn.size(bw, 46);
  navMusicBtn.size(bw, 46);

  navHomeBtn.position(startX, by);
  navTodoBtn.position(startX + (bw + gap), by);
  navDexBtn.position(startX + (bw + gap) * 2, by);
  navMusicBtn.position(startX + (bw + gap) * 3, by);
}

function updateNavHighlight() {
  let activeBg = "rgba(95,255,224,0.22)";
  let idleBg = "rgba(0, 20, 22, 0.72)";

  let activeShadow = "0 0 20px rgba(95,255,224,0.95), inset 0 0 18px rgba(95,255,224,0.25)";
  let idleShadow = "0 0 12px rgba(95,255,224,0.45), inset 0 0 12px rgba(95,255,224,0.12)";

  navHomeBtn.style("background", currentPage === "input" ? activeBg : idleBg);
  navTodoBtn.style("background", currentPage === "main" ? activeBg : idleBg);
  navDexBtn.style("background", currentPage === "dex" ? activeBg : idleBg);
  navMusicBtn.style("background", currentPage === "music" ? activeBg : idleBg);

  navHomeBtn.style("box-shadow", currentPage === "input" ? activeShadow : idleShadow);
  navTodoBtn.style("box-shadow", currentPage === "main" ? activeShadow : idleShadow);
  navDexBtn.style("box-shadow", currentPage === "dex" ? activeShadow : idleShadow);
  navMusicBtn.style("box-shadow", currentPage === "music" ? activeShadow : idleShadow);
}

function addHoverEffect(btn, scaleAmt) {
  let s = scaleAmt || 1.08;
  btn.style("transition", "transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease");
  btn.style("transform-origin", "center center");

  btn.mouseOver(function() {
    btn.style("transform", "scale(" + s + ")");
    btn.style("filter", "brightness(1.15)");
  });

  btn.mouseOut(function() {
    btn.style("transform", "scale(1.0)");
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

function styleSciButton(btn, glowColor) {
  btn.style("font-size", "17px");
  btn.style("padding", "12px 20px");
  btn.style("border", "1.5px solid " + glowColor);
  btn.style("border-radius", "4px");
  btn.style("background", "rgba(0, 12, 12, 0.72)");
  btn.style("color", glowColor);
  btn.style("cursor", "pointer");
  btn.style("font-weight", "700");
  btn.style("font-family", "'Share Tech Mono', monospace");
  btn.style("letter-spacing", "1px");
  btn.style("white-space", "nowrap");
  btn.style("line-height", "1");
  btn.style("display", "flex");
  btn.style("align-items", "center");
  btn.style("justify-content", "center");
  btn.style("box-shadow", "0 0 14px " + glowColor + "66, inset 0 0 16px " + glowColor + "22");
  btn.style("backdrop-filter", "blur(3px)");
  addHoverEffect(btn, 1.04);
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

  if (loginInput) loginInput.hide();
  if (loginButton) loginButton.hide();

  if (navHomeBtn) navHomeBtn.hide();
  if (navTodoBtn) navTodoBtn.hide();
  if (navDexBtn) navDexBtn.hide();
  if (navMusicBtn) navMusicBtn.hide();

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

function showNavButtons() {
  navHomeBtn.show();
  navTodoBtn.show();
  navDexBtn.show();
  navMusicBtn.show();
}

function showOnlyInputUI() {
  hideAllUI();
  showNavButtons();

  inputBox.show();
  addButton.show();
  completeButton.show();
  fullscreenButton.show();
  loadButton.show();
  resetAllButton.show();
}

function showOnlyMainUI() {
  hideAllUI();
  showNavButtons();

  resultButton.show();
}

function showOnlyDexUI() {
  hideAllUI();
  showNavButtons();
}

function showOnlyResultUI() {
  hideAllUI();
  showNavButtons();

  saveImageButton.show();
  musicPageButton.show();
  restartButton.show();
  resetAllButton.show();
}

function showOnlyMusicUI() {
  hideAllUI();
  showNavButtons();

  backToMainButton.show();
  stopMusicButton.show();
  musicToggleBtn.show();
}

function positionUI() {
  if (currentPage !== "intro" && currentPage !== "login" && currentPage !== "radar") {
    positionNav();
    updateNavHighlight();
  }

  if (currentPage === "input") {
    let inputW = min(560, width * 0.38);
    let inputH = 58;
    let addW = 120;
    let gap = 14;

    let groupW = inputW + gap + addW;
    let groupX = width * 0.43 - groupW / 2;
    let inputY = height * 0.38;

    inputBox.size(inputW, inputH);
    addButton.size(addW, inputH);

    inputBox.position(groupX, inputY);
    addButton.position(groupX + inputW + gap, inputY);

    completeButton.size(360, 62);
    loadButton.size(360, 62);
    resetAllButton.size(360, 62);

    completeButton.position(width * 0.43 - 180, height * 0.52);
    loadButton.position(width * 0.43 - 180, height * 0.62);
    resetAllButton.position(width * 0.43 - 180, height * 0.72);

    fullscreenButton.size(180, 54);
    fullscreenButton.position(width - 210, 32);
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
  drawGradientBG(color(0, 5, 12), color(0, 20, 25));

  textFont("Orbitron");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  drawingContext.shadowBlur = 22;
  drawingContext.shadowColor = "#5fffe0";

  fill(95, 255, 224);
  textSize(min(width, height) * 0.060);
  text("MISSION CONTROL SYSTEM", width / 2, height * 0.14);

  textStyle(NORMAL);
  textSize(min(width, height) * 0.024);
  fill(190, 255, 245);
  text("Today Mission", width / 2, height * 0.23);

  drawingContext.shadowBlur = 0;
  textFont("sans-serif");

  drawInputTodoPreview();

  if (messageText !== "") {
    fill(255, 130, 160);
    textFont("Share Tech Mono");
    textSize(16);
    text(messageText, width / 2, height * 0.82);
    textFont("sans-serif");
  }
}

function drawInputTodoPreview() {
  let boxW = min(390, width * 0.26);
  let boxH = 360;
  let boxX = width * 0.76;
  let boxY = height * 0.34;

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "#5fffe0";

  noStroke();
  fill(0, 20, 22, 160);
  rect(boxX - boxW / 2, boxY, boxW, boxH, 10);

  noFill();
  stroke(95, 255, 224, 190);
  strokeWeight(1.5);
  rect(boxX - boxW / 2, boxY, boxW, boxH, 10);

  stroke(95, 255, 224, 220);
  strokeWeight(2);

  let x1 = boxX - boxW / 2;
  let x2 = boxX + boxW / 2;
  let y1 = boxY;
  let y2 = boxY + boxH;

  line(x1 + 18, y1 + 18, x1 + 75, y1 + 18);
  line(x1 + 18, y1 + 18, x1 + 18, y1 + 75);
  line(x2 - 18, y1 + 18, x2 - 75, y1 + 18);
  line(x2 - 18, y1 + 18, x2 - 18, y1 + 75);
  line(x1 + 18, y2 - 18, x1 + 75, y2 - 18);
  line(x1 + 18, y2 - 18, x1 + 18, y2 - 75);
  line(x2 - 18, y2 - 18, x2 - 75, y2 - 18);
  line(x2 - 18, y2 - 18, x2 - 18, y2 - 75);

  drawingContext.shadowBlur = 0;

  textFont("Share Tech Mono");
  textAlign(LEFT, CENTER);

  fill(95, 255, 224);
  textSize(20);
  text("입력한 할 일", x1 + 32, boxY + 48);

  textAlign(RIGHT, CENTER);
  fill(190, 255, 245);
  textSize(16);
  text(todoList.length + " / 8개", x2 - 32, boxY + 48);

  stroke(95, 255, 224, 90);
  strokeWeight(1);
  line(x1 + 32, boxY + 76, x2 - 32, boxY + 76);

  if (todoList.length === 0) {
    textAlign(CENTER, CENTER);
    fill(210, 255, 250);
    textSize(16);
    text("아직 입력된 할 일이 없습니다.", boxX, boxY + boxH / 2 + 20);
    textFont("sans-serif");
    return;
  }

  textAlign(LEFT, CENTER);
  textSize(15);

  for (let i = 0; i < todoList.length; i++) {
    let y = boxY + 105 + i * 30;
    fill(255);
    text((i + 1) + ". " + todoList[i].title, x1 + 32, y);
  }

  textFont("sans-serif");
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
