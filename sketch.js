
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

// ============================================================
// preload
// ============================================================

function preload() {
  img = loadImage("1단계불.png");
}

// ============================================================
// setup
// ============================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  textAlign(CENTER, CENTER);

  buildInputPage();
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

  inputBox.elt.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      addTodo();
    }
  });

  addButton = createButton("추가");
  styleButton(addButton, "#7c5cbf");
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
      text("• " + todoList[i].title, width / 2, height / 2 + 120 + i * 30);
    }
  }
}

// ============================================================
// 할 일 추가
// ============================================================

function addTodo() {
  let textValue = inputBox.value().trim();

  if (textValue === "") return;

  todoList.push({
    title: textValue,
    done: false
  });

  inputBox.value("");
  inputBox.elt.focus();
}

// ============================================================
// 입력 완료 → 메인 화면
// ============================================================

function goToMainPage() {
  if (todoList.length === 0) return;

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

  drawTopGuideLine();
  drawCharacter();
  drawChecklist();
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
// 캐릭터 그리기
// ============================================================

function drawCharacter() {
  clickEffect = lerp(clickEffect, 1, 0.08);
  glowSize = lerp(glowSize, 0, 0.08);

  let charX = width * 0.22;
  let charY = height * 0.38;
  let charSize = min(width, height) * 0.30;

  let bounce = sin(frameCount * angleSpeed);
  let angle = bounce * radians(7);

  let squash = 1 + cos(frameCount * angleSpeed * 2) * 0.03;
  let stretch = 1 / squash;

  // 그림자
  noStroke();
  fill(200, 210, 220, 120);
  ellipse(
    charX,
    charY + charSize * 0.46,
    charSize * 0.75 * stretch,
    charSize * 0.08
  );

  // glow 효과
  if (glowSize > 1) {
    noFill();
    stroke(255, 220, 120, 110);
    strokeWeight(8);
    ellipse(charX, charY, glowSize, glowSize);
  }

  // 캐릭터
  push();
  translate(charX, charY);
  rotate(angle);
  scale(stretch * clickEffect, squash / clickEffect);
  image(img, 0, 0, charSize, charSize);
  pop();

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

    // 체크박스
    stroke(230);
    strokeWeight(1.5);
    fill(255);
    rect(listX, y - boxSize / 2, boxSize, boxSize);

    // 체크 표시
    if (todo.done) {
      stroke(120, 255, 170);
      strokeWeight(3);
      line(
        listX + boxSize * 0.2,
        y,
        listX + boxSize * 0.45,
        y + boxSize * 0.25
      );
      line(
        listX + boxSize * 0.45,
        y + boxSize * 0.25,
        listX + boxSize * 0.85,
        y - boxSize * 0.35
      );
    }

    // 선
    stroke(220, 210, 255, 180);
    strokeWeight(1);
    line(listX + boxSize + 12, y, listX + listW, y);

    // 텍스트
    noStroke();
    textSize(min(width, height) * 0.017);

    if (todo.done) {
      fill(170, 220, 180);
    } else {
      fill(255);
    }

    text(todo.title, listX + boxSize + 16, y - boxSize * 0.9);

    // 삭제 x
    fill(255, 170, 170);
    text("x", listX + listW + 18, y);
  }

  textAlign(CENTER, CENTER);
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
// 마우스 클릭 처리
// ============================================================

function mousePressed() {
  if (currentPage === "main") {
    handleCharacterClick();
    handleChecklistClick();
  }
}

// ============================================================
// 캐릭터 클릭
// ============================================================

function handleCharacterClick() {
  let charX = width * 0.22;
  let charY = height * 0.38;
  let charSize = min(width, height) * 0.30;

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

    // 체크박스 클릭
    if (
      mouseX > listX &&
      mouseX < listX + boxSize &&
      mouseY > y - boxSize / 2 &&
      mouseY < y + boxSize / 2
    ) {
      todoList[i].done = !todoList[i].done;
      return;
    }

    // 삭제 버튼 클릭
    if (
      mouseX > listX + listW + 5 &&
      mouseX < listX + listW + 30 &&
      mouseY > y - 15 &&
      mouseY < y + 15
    ) {
      todoList.splice(i, 1);
      return;
    }
  }
}

// ============================================================
// 창 크기 변경 대응
// ============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionInputUI();
}
