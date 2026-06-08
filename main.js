// p5.js 기본 실행 함수 / 클릭 처리 / 공통 계산 / 배경
// ============================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  loadInventory();
  loadLayeredMusicSets();

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
  updateHomeMusicForPage();

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
// 클릭 처리
// ============================================================

function mousePressed() {
  if (currentPage === "main") {
    if (isClickOnCharacterLogUI()) {
      if (characterLogInput) characterLogInput.elt.focus();
      return;
    }

    if (timerPanelOpen) {
      let px = width / 2 - 560 / 2;
      let py = height / 2 - 430 / 2;

      if (mouseX < px || mouseX > px + 560 || mouseY < py || mouseY > py + 430) {
        closeTimerPanel();
        playValidClickSound();
        return;
      }
    }

    if (handleCharacterClick()) return;
    if (handleChecklistClick()) return;
    if (handleTimerClicks()) return;

  } else if (currentPage === "music") {
    handleMusicClick();
  } else if (currentPage === "dex") {
    handleDexClick();
  }
}

function handleCharacterClick() {
  let charX = width * 0.22;
  let charY = height * 0.42;
  let charSize = min(width, height) * 0.68;

  let d = dist(mouseX, mouseY, charX, charY);
  let pathPos = getCharacterPathPosition();
  let pathD = dist(mouseX, mouseY, pathPos.x, pathPos.y);

  if (d < charSize * 0.42 || pathD < 100) {
    clickEffect = 1.2;
    openCharacterLogInput();
    playValidClickSound();
    return true;
  }

  return false;
}

function handleChecklistClick() {
  for (let i = 0; i < todoList.length; i++) {
    let m = getTodoRowMetrics(i);
    let boxSize = m.layout.boxSize;

    if (
      mouseX > m.checkX - boxSize / 2 &&
      mouseX < m.checkX + boxSize / 2 &&
      mouseY > m.y - boxSize / 2 &&
      mouseY < m.y + boxSize / 2
    ) {
      todoList[i].done = !todoList[i].done;
      clickEffect = 1.15;
      todoListShake = 8;
      characterAnimating = true;

      if (todoList[i].done) {
        completionSequence++;
        todoList[i].completedOrder = completionSequence;
      } else {
        todoList[i].completedOrder = null;
      }

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

      syncLayeredMusicToProgress();
      saveProgress();
      playValidClickSound();
      return true;
    }
  }

  return false;
}

function openCharacterLogInput() {
  if (currentPage !== "main") return;

  closeCharacterLogInput();

  characterLogIndex = getCurrentLogPathIndex();
  let pos = getMainCharacterLogPosition();

  characterLogInput = createInput("");
  characterLogInput.attribute("placeholder", "로그 입력하기");
  characterLogInput.style("font-size", "14px");
  characterLogInput.style("padding", "8px 12px");
  characterLogInput.style("border", "none");
  characterLogInput.style("border-radius", "8px");
  characterLogInput.style("background", "rgba(255,255,255,0.96)");
  characterLogInput.style("color", "#222");
  characterLogInput.style("outline", "none");
  characterLogInput.style("font-family", "sans-serif");
  characterLogInput.style("box-shadow", "0 10px 28px rgba(0,0,0,0.22)");
  characterLogInput.style("z-index", "30");
  let groupW = 300;
  let groupX = constrain(pos.x - groupW / 2, 18, width - groupW - 18);
  let groupY = constrain(pos.y + min(width, height) * 0.24, 92, height - 92);

  characterLogInput.position(groupX, groupY);
  characterLogInput.size(220, 36);
  characterLogInput.mousePressed(function() {
    characterLogInput.elt.focus();
  });

  characterLogButton = createButton("LOG");
  characterLogButton.style("border", "none");
  characterLogButton.style("border-radius", "8px");
  characterLogButton.style("background", "rgba(255,255,255,0.96)");
  characterLogButton.style("color", "#222");
  characterLogButton.style("font-weight", "700");
  characterLogButton.style("font-family", "'Share Tech Mono', monospace");
  characterLogButton.style("box-shadow", "0 10px 28px rgba(0,0,0,0.22)");
  characterLogButton.style("cursor", "pointer");
  characterLogButton.style("z-index", "31");
  characterLogButton.position(groupX + 228, groupY);
  characterLogButton.size(72, 36);
  characterLogButton.mousePressed(submitCharacterLog);

  characterLogInput.elt.addEventListener("keydown", function(e) {
    if (e.key === "Enter") submitCharacterLog();
  });

  characterLogInput.elt.focus();
}

function submitCharacterLog() {
  if (!characterLogInput) return;

  let textValue = characterLogInput.value().trim();
  if (textValue === "") return;

  characterLogs.push({
    index: characterLogIndex,
    text: textValue,
    createdAt: new Date().toISOString()
  });

  activeSpeechText = textValue;
  activeSpeechUntil = millis() + 10000;

  closeCharacterLogInput();
  saveProgress();
}

function closeCharacterLogInput() {
  if (characterLogInput) {
    characterLogInput.remove();
    characterLogInput = null;
  }

  if (characterLogButton) {
    characterLogButton.remove();
    characterLogButton = null;
  }
}

function isClickOnCharacterLogUI() {
  if (!characterLogInput && !characterLogButton) return false;

  if (characterLogInput) {
    let r = characterLogInput.elt.getBoundingClientRect();
    let x = r.left;
    let y = r.top;
    let w = r.width;
    let h = r.height;

    if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
      return true;
    }
  }

  if (characterLogButton) {
    let r = characterLogButton.elt.getBoundingClientRect();
    let x = r.left;
    let y = r.top;
    let w = r.width;
    let h = r.height;

    if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
      return true;
    }
  }

  return false;
}

function getCurrentLogPathIndex() {
  if (todoList.length <= 0) return 0;
  return constrain(countDone(), 0, todoList.length - 1);
}

function getMainCharacterLogPosition() {
  return {
    x: width * 0.22,
    y: height * 0.42
  };
}

function handleTimerClicks() {
  for (let i = 0; i < todoList.length; i++) {
    let m = getTodoRowMetrics(i);

    if (dist(mouseX, mouseY, m.timerX, m.y) < 20) {
      openTimerPanel(i);
      playValidClickSound();
      return true;
    }

    if (isMouseInRect(m.deleteX - 24, m.y - 17, 48, 34)) {
      deleteTodoItem(i);
      playValidClickSound();
      return true;
    }

    let t = todoList[i].timer;

    if (t.mode === "duration" && !t.running && !t.finished) {
      if (dist(mouseX, mouseY, m.playX, m.y) < 20) {
        startTimer(i);
        playValidClickSound();
        return true;
      }
    }
  }

  return false;
}

function deleteTodoItem(index) {
  if (timerPanelOpen && timerPanelIndex === index) {
    closeTimerPanel();
  }

  todoList.splice(index, 1);

  if (timerPanelOpen && timerPanelIndex > index) {
    timerPanelIndex--;
  }

  createPathNodes();
  syncLayeredMusicToProgress();
  saveProgress();
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
// 별 효과
// ============================================================

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

// ============================================================
// 배경
// ============================================================

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

// ============================================================
// 키 입력
// ============================================================

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
