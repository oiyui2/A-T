// ============================================================
// p5.js 기본 생명주기 함수들
// ============================================================

function preload() {
  characters[0] = [loadImage("images/1단계불.png"), loadImage("images/2단계불.png"), loadImage("images/3단계불.png"), loadImage("images/4단계불.png"), loadImage("images/5단계불.png")];
  characters[1] = [loadImage("images/1단계구름.png"), loadImage("images/2단계구름.png"), loadImage("images/3단계구름.png"), loadImage("images/4단계구름.png"), loadImage("images/5단계구름.png")];
  characters[2] = [loadImage("images/1단계유령.png"), loadImage("images/2단계유령.png"), loadImage("images/3단계유령.png"), loadImage("images/4단계유령.png"), loadImage("images/5단계유령.png")];
  characters[3] = [loadImage("images/1단계구.png"), loadImage("images/2단계구.png"), loadImage("images/3단계구.png"), loadImage("images/4단계구.png"), loadImage("images/5단계구.png")];
  songSounds[0] = loadSound("sounds/song1.mp3");
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

  positionUI();
}

// ============================================================
// 화면별 드로잉 함수 
// ============================================================

function drawInputPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));
  fill(255); textStyle(BOLD); textSize(min(width, height) * 0.060); text("2DO", width / 2, height * 0.10);
  textStyle(NORMAL); textSize(min(width, height) * 0.028); text("할 일을 완수할수록 캐릭터가 성장하는 투두리스트", width / 2, height * 0.17);
  fill(220, 210, 255); textSize(min(width, height) * 0.020); text("오늘의 할 일을 최소 4개, 최대 8개까지 입력하세요.", width / 2, height * 0.24);
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

  if (todoList.length === 0) {
    fill(170, 150, 200); textAlign(LEFT, CENTER); textSize(15); text("아직 입력된 할 일이 없습니다.", boxX - boxW / 2 + 24, boxY + 90); textAlign(CENTER, CENTER); return;
  }
  textAlign(LEFT, CENTER); textSize(15);
  for (let i = 0; i < todoList.length; i++) { fill(255); text((i + 1) + ". " + todoList[i].title, boxX - boxW / 2 + 24, boxY + 86 + i * 26); }
  textAlign(CENTER, CENTER);
}

function drawMainPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));
  updateTimers();
  updateFinalBurstState();

  stroke(220, 210, 255, 120); strokeWeight(1); line(width * 0.03, height * 0.13, width * 0.97, height * 0.13);
  drawMainCharacter();
  drawTodoPanel();
  drawGrowthPath();
  drawMovingCharacterOnPath();

  fill(220, 210, 255); noStroke(); textSize(16); text("시계 버튼을 눌러 목표 시간을 설정하고, 재생 버튼으로 타이머를 시작하세요.", width / 2, height - 35);
  if (timerPanelOpen) drawTimerPanel();
}

function drawMainCharacter() {
  let doneCount = countDone(), stageIndex = getStageIndex(doneCount, todoList.length);
  let charX = width * 0.22, charY = height * 0.42, charSize = min(width, height) * 0.68;
  let angle = 0, squash = 1, stretch = 1;

  clickEffect = lerp(clickEffect, 1, 0.08);
  if (characterAnimating) {
    angle = sin(frameCount * angleSpeed) * radians(6);
    squash = 1 + cos(frameCount * angleSpeed * 2) * 0.03; stretch = 1 / squash;
  }
  noStroke(); fill(200, 210, 220, 90); ellipse(charX, charY + charSize * 0.2, charSize * 0.58, charSize * 0.08);
  push(); translate(charX, charY); rotate(angle); scale(stretch * clickEffect, squash / clickEffect);
  image(getCurrentCharacterImage(stageIndex), 0, 0, charSize, charSize); pop();

  fill(220, 210, 255); noStroke(); textSize(22); text("현재 " + (stageIndex + 1) + "단계", charX, charY + charSize * 0.38);
  if (!characterAnimating) { fill(255, 180, 200); textSize(16); text("타이머 종료로 캐릭터가 멈췄습니다.", charX, charY + charSize * 0.46); }
}

function drawTodoPanel() {
  let layout = getTodoLayout();
  fill(255); noStroke(); textAlign(LEFT, CENTER); textSize(30); text("할 일 리스트", layout.listX, layout.listY - 105);
  fill(220, 210, 255); textSize(18); text(countDone() + " / " + todoList.length + " 완료", layout.listX, layout.listY - 65);

  for (let i = 0; i < todoList.length; i++) {
    let y = layout.listY + i * layout.rowGap, todo = todoList[i], boxSize = layout.boxSize;
    stroke(230); strokeWeight(1.5); fill(255); rect(layout.listX, y - boxSize / 2, boxSize, boxSize);
    if (todo.done) { stroke(120, 255, 170); strokeWeight(3); line(layout.listX + 5, y, layout.listX + 11, y + 7); line(layout.listX + 11, y + 7, layout.listX + 20, y - 7); }
    stroke(220, 210, 255, 160); strokeWeight(1); line(layout.listX + 42, y, layout.listX + layout.listW, y);
    noStroke(); fill(todo.done ? color(170, 220, 180) : color(255)); textSize(20); text(todo.title, layout.listX + 48, y - 18);

    drawTimerBox(i, layout.listX + layout.listW + 38, y);
    let t = todo.timer;
    if (t.mode !== null && t.totalSec > 0) {
      if (t.running || t.finished || t.expired) drawTimerRing(i, layout.listX + layout.listW + 100, y);
      else if (t.mode === "duration") drawPlayButton(layout.listX + layout.listW + 100, y);
    }
  }
  textAlign(CENTER, CENTER);
}

function drawTimerBox(index, x, y) {
  let sz = 22, t = todoList[index].timer;
  stroke(180, 160, 220); strokeWeight(1.5); fill(t.mode !== null ? color(80, 60, 130) : color(40, 25, 70)); rect(x - sz / 2, y - sz / 2, sz, sz, 5);
  noFill(); stroke(220, 200, 255); strokeWeight(1.2); ellipse(x, y, sz * 0.7); line(x, y, x, y - sz * 0.22); line(x, y, x + sz * 0.18, y + sz * 0.05);
  if (t.mode !== null && t.totalSec > 0) { noStroke(); fill(200, 180, 255); textAlign(CENTER, CENTER); textSize(9); text(formatTime(t.totalSec), x, y + sz * 0.7); }
}

function drawPlayButton(x, y) {
  let sz = 20; noStroke(); fill(80, 200, 140); ellipse(x, y, sz * 1.4);
  fill(255); triangle(x - sz * 0.22, y - sz * 0.3, x - sz * 0.22, y + sz * 0.3, x + sz * 0.35, y);
}

function drawTimerRing(index, x, y) {
  let t = todoList[index].timer, sz = 36, ratio = t.totalSec > 0 ? t.remainSec / t.totalSec : 0;
  noFill(); stroke(60, 40, 100); strokeWeight(4); ellipse(x, y, sz);
  let progressColor = t.expired ? color(255, 80, 80) : (ratio < 0.2 ? color(255, 180, 60) : color(100, 220, 180));
  stroke(progressColor); strokeWeight(4); arc(x, y, sz, sz, -HALF_PI, -HALF_PI + TWO_PI * ratio);
  noStroke(); textAlign(CENTER, CENTER); textSize(9);
  if (t.expired) { fill(255, 100, 100); text("초과!", x, y); }
  else if (t.finished) { fill(120, 255, 170); text("완료!", x, y); }
  else { fill(220); text(formatTime(Math.ceil(t.remainSec)), x, y); }

  for (let p of penaltyList) {
    if (p.index !== index) continue;
    let elapsed = frameCount - p.startFrame; if (elapsed > 60) continue;
    noFill(); stroke(255, 60, 60, map(elapsed, 0, 60, 200, 0)); strokeWeight(3); ellipse(x, y, map(elapsed, 0, 60, 40, 80));
  }
}

function drawTimerPanel() {
  let pw = 520, ph = 420, px = width / 2 - pw / 2, py = height / 2 - ph / 2;
  noStroke(); fill(0, 0, 0, 120); rect(0, 0, width, height);
  fill(30, 15, 60, 245); rect(px, py, pw, ph, 22);
  stroke(160, 130, 220); strokeWeight(1.5); noFill(); rect(px, py, pw, ph, 22);
  noStroke(); fill(255); textAlign(CENTER, CENTER); textSize(22); text("타이머 설정", px + pw / 2, py - 28);
  fill(190, 175, 230); textSize(14); text("완료할 시간을 정하면 체크리스트와 연결됩니다.", px + pw / 2, py + 105);
  fill(220, 200, 255); textSize(15); text("시", px + 135, py + 135); text("분", px + 300, py + 135); text("초", px + 465, py + 135);
  fill(180, 160, 220); textSize(12); text(timerMode === "duration" ? "예: 25분 동안 집중하기" : "입력한 오늘의 시각까지 자동 카운트다운됩니다.", px + pw / 2, py + ph - 78);
}

function drawGrowthPath() {
  if (pathNodes.length === 0) return;
  stroke(210, 210, 230); strokeWeight(3); noFill(); beginShape();
  for (let p of pathNodes) vertex(p.x, p.y);
  endShape();
  for (let i = 0; i < pathNodes.length; i++) {
    let p = pathNodes[i], isDone = i < countDone();
    fill(isDone ? [180, 255, 200] : 255); stroke(isDone ? [180, 255, 200] : 200); strokeWeight(2); ellipse(p.x, p.y, 16, 16);
    noStroke(); fill(220, 210, 255); textSize(12); text(i + 1, p.x, p.y + 24);
  }
}

function drawMovingCharacterOnPath() {
  let doneCount = countDone(), stageIndex = getStageIndex(doneCount, todoList.length), pos = getCharacterPathPosition();
  let angle = characterAnimating ? sin(frameCount * 0.05) * radians(5) : 0;
  push(); translate(pos.x, pos.y); rotate(angle); image(getCurrentCharacterImage(stageIndex), 0, 0, 360, 360); pop();
  if (doneCount === todoList.length && todoList.length > 0) {
    finalBurst = min(finalBurst + 1, 55); noStroke();
    for (let i = 9; i > 0; i--) { fill(180, 220, 255, map(i, 9, 0, 0, 120)); ellipse(pos.x, pos.y, i * finalBurst * 0.45, i * finalBurst * 0.45); }
    stroke(255, 230, 250, 150); strokeWeight(2);
    for (let i = 0; i < 12; i++) { let a = TWO_PI / 12 * i; line(pos.x + cos(a) * 35, pos.y + sin(a) * 35, pos.x + cos(a) * (finalBurst * 2.1), pos.y + sin(a) * (finalBurst * 2.1)); }
  }
}

function drawResultPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));
  let doneCount = countDone(), totalCount = todoList.length, percent = totalCount > 0 ? floor((doneCount / totalCount) * 100) : 0;
  fill(255); textStyle(BOLD); textSize(min(width, height) * 0.065); text("오늘의 완료 기록", width / 2, height * 0.13);
  textStyle(NORMAL); fill(220, 210, 255); textSize(min(width, height) * 0.032); text("완료한 할 일: " + doneCount + " / " + totalCount, width / 2, height * 0.25); text("완료율: " + percent + "%", width / 2, height * 0.31);
  if (percent === 100) { fill(180, 255, 200); text("오늘의 캐릭터를 획득했습니다!", width / 2, height * 0.38); }
  else { fill(255, 180, 200); text("완료율 100%가 되면 캐릭터를 획득할 수 있습니다.", width / 2, height * 0.38); }
  image(getCurrentCharacterImage(getStageIndex(doneCount, totalCount)), width / 2, height * 0.56, min(width, height) * 0.28, min(width, height) * 0.28);
  fill(255); textSize(min(width, height) * 0.027); text("보유한 캐릭터 개수: " + inventoryCount + "개", width / 2, height * 0.76);
  fill(220, 210, 255); textSize(16); text("이 화면은 이미지로 저장할 수 있습니다.", width / 2, height * 0.82); text("제작자: " + creatorNames, width / 2, height * 0.86);
  if (creatorSchool !== "") text("소속: " + creatorSchool, width / 2, height * 0.89);
}

function drawMusicPage() {
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));
  fill(255); textStyle(BOLD); textSize(min(width, height) * 0.06); text("Song", width * 0.12, height * 0.10);
  textSize(24); text("곡 이름", width * 0.28, height * 0.17); text("필요 캐릭터 개수", width * 0.68, height * 0.17);
  textStyle(NORMAL); fill(220, 210, 255); textSize(20); text("보유한 캐릭터 개수: " + inventoryCount + "개", width * 0.78, height * 0.10);
  for (let i = 0; i < songs.length; i++) {
    let y = height * 0.26 + i * 64, song = songs[i], canPlay = inventoryCount >= song.need;
    noStroke(); fill(canPlay ? [190, 180, 215, 220] : [120, 115, 140, 170]); rect(width * 0.08, y - 22, width * 0.80, 44, 22);
    fill(255); triangle(width * 0.11, y - 10, width * 0.11, y + 10, width * 0.125, y);
    textAlign(LEFT, CENTER); textSize(20); fill(255); text(song.title, width * 0.18, y);
    textAlign(CENTER, CENTER); text(song.need + "개", width * 0.68, y);
    if (!canPlay) { fill(255, 180, 200); textSize(16); text("잠김", width * 0.82, y); }
    else if (currentSongIndex === i) { fill(180, 255, 200); textSize(16); text("Now playing ...", width * 0.82, y); }
  }
  fill(220, 210, 255); textSize(15); text("캐릭터를 모을수록 더 많은 곡을 플레이할 수 있습니다.", width / 2, height - 35);
}

function drawGradientBG(c1, c2) {
  noStroke(); for (let y = 0; y < height; y++) { fill(lerpColor(c1, c2, map(y, 0, height, 0, 1))); rect(0, y, width, 1); }
  noStroke(); for (let s of stars) {
    s.x += (mouseX - s.x) * 0.005 * s.speed; s.y += (mouseY - s.y) * 0.005 * s.speed;
    fill(255, 255, 200, s.brightness + sin(frameCount * 0.05 + s.brightness) * 40); ellipse(s.x, s.y, s.size);
  }
}

// ============================================================
// 마우스 인터랙션 이벤트 핸들러
// ============================================================

function mousePressed() {
  if (currentPage === "main") {
    if (timerPanelOpen) {
      let pw = 520, ph = 420;
      if (mouseX < width/2 - pw/2 || mouseX > width/2 + pw/2 || mouseY < height/2 - ph/2 || mouseY > height/2 + ph/2) { closeTimerPanel(); return; }
    }
    let charSize = min(width, height) * 0.68;
    if (dist(mouseX, mouseY, width * 0.22, height * 0.42) < charSize * 0.42) clickEffect = 1.2;

    let layout = getTodoLayout();
    for (let i = 0; i < todoList.length; i++) {
      let y = layout.listY + i * layout.rowGap;
      if (mouseX > layout.listX && mouseX < layout.listX + layout.boxSize && mouseY > y - layout.boxSize / 2 && mouseY < y + layout.boxSize / 2) {
        todoList[i].done = !todoList[i].done; clickEffect = 1.15; characterAnimating = true;
        if (todoList[i].timer && todoList[i].done && todoList[i].timer.running) { todoList[i].timer.running = false; todoList[i].timer.finished = true; }
        if (countDone() === todoList.length) finalBurst = 1;
        saveProgress(); return;
      }
      if (dist(mouseX, mouseY, layout.listX + layout.listW + 38, y) < 16) { openTimerPanel(i); return; }
      if (todoList[i].timer.mode === "duration" && !todoList[i].timer.running && !todoList[i].timer.finished) {
        if (dist(mouseX, mouseY, layout.listX + layout.listW + 100, y) < 18) { startTimer(i); return; }
      }
    }
  } else if (currentPage === "music") {
    for (let i = 0; i < songs.length; i++) {
      let y = height * 0.26 + i * 64;
      if (mouseX > width * 0.08 && mouseX < width * 0.88 && mouseY > y - 22 && mouseY < y + 22) {
        if (inventoryCount >= songs[i].need) playSong(i);
        return;
      }
    }
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); if (currentPage === "main") createPathNodes(); if (timerPanelOpen) { let idx = timerPanelIndex; closeTimerPanelDOM(); timerPanelOpen = false; openTimerPanel(idx); } }
