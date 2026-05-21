
// ============================================================
//  전역 변수 (Global Variables)
// ============================================================

let currentPage = "input";   // "input" 또는 "checklist"
let todoList = [];            // 할 일 목록 배열
let inputBox;                 // p5 input 요소
let addButton;                // 추가 버튼
let startButton;              // 시작 버튼
let stars = [];               // 별똥별 배열

// ============================================================
//  1. setup() — 프로그램 초기 설정
// ============================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  // 별똥별 초기 생성
  for (let i = 0; i < 30; i++) {
    stars.push(createStar());
  }

  // 입력 페이지 UI 생성
  buildInputPage();
}

// ============================================================
//  2. draw() — 매 프레임 화면 그리기
// ============================================================

function draw() {
  if (currentPage === "input") {
    drawInputPage();
  } else {
    drawChecklistPage();
  }

  // 마우스 따라다니는 별똥별 (양쪽 페이지 공통)
  drawStars();
}

// ============================================================
//  3. 별똥별 관련 함수
// ============================================================

// 별 하나 생성
function createStar() {
  return {
    x: random(width),
    y: random(height),
    size: random(2, 5),
    speed: random(0.5, 2),
    brightness: random(150, 255)
  };
}

// 별똥별 그리기 + 마우스 방향으로 이동
function drawStars() {
  noStroke();
  for (let s of stars) {
    // 마우스 방향으로 살짝 끌려감
    s.x += (mouseX - s.x) * 0.005 * s.speed;
    s.y += (mouseY - s.y) * 0.005 * s.speed;

    // 반짝임 효과
    let flicker = sin(frameCount * 0.05 + s.brightness) * 40;
    fill(255, 255, 200, s.brightness + flicker);
    ellipse(s.x, s.y, s.size);
  }
}

// ============================================================
//  4. 입력 페이지 (Page 1) — UI 생성
// ============================================================

function buildInputPage() {
  // 텍스트 입력창
  inputBox = createInput("");
  inputBox.attribute("placeholder", "할 일을 입력하세요...");
  inputBox.style("font-size", "18px");
  inputBox.style("padding", "10px 16px");
  inputBox.style("border", "2px solid #7c5cbf");
  inputBox.style("border-radius", "12px");
  inputBox.style("outline", "none");
  inputBox.style("width", "300px");
  inputBox.style("background", "rgba(255,255,255,0.9)");
  positionInputUI();

  // Enter 키로도 추가 가능
  inputBox.elt.addEventListener("keydown", function(e) {
    if (e.key === "Enter") addTodo();
  });

  // [추가] 버튼
  addButton = createButton("➕ 추가");
  styleButton(addButton, "#7c5cbf");
  addButton.mousePressed(addTodo);

  // [시작하기] 버튼
  startButton = createButton("🚀 시작하기!");
  styleButton(startButton, "#e8578a");
  startButton.mousePressed(goToChecklist);

  positionInputUI();
}

// 입력 페이지 UI 위치 조정
function positionInputUI() {
  let cx = width / 2;
  let cy = height / 2;
  if (inputBox) inputBox.position(cx - 155, cy - 20);
  if (addButton) addButton.position(cx + 165, cy - 22);
  if (startButton) startButton.position(cx - 75, cy + 40);
}

// 버튼 공통 스타일
function styleButton(btn, bgColor) {
  btn.style("font-size", "16px");
  btn.style("padding", "10px 20px");
  btn.style("border", "none");
  btn.style("border-radius", "12px");
  btn.style("background", bgColor);
  btn.style("color", "white");
  btn.style("cursor", "pointer");
  btn.style("font-weight", "bold");
}

// ============================================================
//  5. 입력 페이지 (Page 1) — 화면 그리기
// ============================================================

function drawInputPage() {
  // 그라데이션 배경
  drawGradientBG(color(20, 10, 50), color(60, 20, 80));

  // 제목
  fill(255);
  noStroke();
  textSize(32);
  text("🎵 오늘의 할 일을 입력하세요", width / 2, height / 2 - 120);

  // 이미 추가된 할 일 미리보기
  textSize(16);
  fill(200, 180, 255);
  for (let i = 0; i < todoList.length; i++) {
    text("• " + todoList[i].title, width / 2, height / 2 + 100 + i * 28);
  }

  // 안내 문구
  if (todoList.length === 0) {
    fill(150, 130, 180);
    textSize(14);
    text("할 일을 추가하면 여기에 표시됩니다", width / 2, height / 2 + 110);
  }
}

// ============================================================
//  6. 할 일 추가 함수
// ============================================================

function addTodo() {
  let text = inputBox.value().trim();    // 입력값 가져오기
  if (text === "") return;               // 빈 값이면 무시

  // 할 일 객체 생성 → 배열에 추가
  todoList.push({
    title: text,      // 할 일 내용
    done: false        // 완료 여부 (기본: 미완료)
  });

  inputBox.value("");   // 입력창 비우기
  inputBox.elt.focus();  // 커서 다시 입력창으로
}

// ============================================================
//  7. 페이지 전환 함수 — 입력 → 체크리스트
// ============================================================

function goToChecklist() {
  if (todoList.length === 0) return;  // 할 일이 없으면 전환 안 함

  // 입력 페이지 UI 숨기기
  inputBox.hide();
  addButton.hide();
  startButton.hide();

  currentPage = "checklist";
}

// ============================================================
//  8. 체크리스트 페이지 (Page 2) — 화면 그리기
// ============================================================

function drawChecklistPage() {
  // 완료 비율에 따라 배경색 변화
  let doneCount = countDone();
  let ratio = doneCount / todoList.length;

  // 배경: 미완수=어두움 → 완수=밝음
  let bgA = lerpColor(color(20, 10, 50), color(30, 60, 100), ratio);
  let bgB = lerpColor(color(60, 20, 80), color(100, 60, 150), ratio);
  drawGradientBG(bgA, bgB);

  // 제목
  fill(255);
  noStroke();
  textSize(28);
  text("📋 할 일 체크리스트", width / 2, 60);

  // 게이지 바
  drawGauge(ratio);

  // 할 일 목록 그리기
  drawTodoItems();

  // 미니 캐릭터 (오른쪽 하단)
  drawMiniCharacter(ratio);

  // 뒤로가기 안내
  fill(150, 130, 180);
  textSize(13);
  text("[ B ] 키를 누르면 입력 페이지로 돌아갑니다", width / 2, height - 30);
}

// ============================================================
//  9. 게이지 바 그리기
// ============================================================

function drawGauge(ratio) {
  let barW = 400;
  let barH = 24;
  let bx = width / 2 - barW / 2;
  let by = 100;

  // 배경 바
  fill(50, 30, 80);
  noStroke();
  rect(bx, by, barW, barH, 12);

  // 채워진 부분
  let fillColor = lerpColor(color(200, 80, 80), color(100, 220, 150), ratio);
  fill(fillColor);
  rect(bx, by, barW * ratio, barH, 12);

  // 퍼센트 텍스트
  fill(255);
  textSize(14);
  text(floor(ratio * 100) + "% 완료", width / 2, by + barH / 2);
}

// ============================================================
// 10. 할 일 항목 그리기 (클릭 가능한 체크박스)
// ============================================================

function drawTodoItems() {
  let startY = 160;
  let itemH = 50;

  for (let i = 0; i < todoList.length; i++) {
    let y = startY + i * itemH;
    let todo = todoList[i];
    let cx = width / 2;          // 중앙 정렬 기준
    let boxX = cx - 220;         // 체크박스 X 위치

    // 체크박스 (사각형)
    stroke(180, 150, 220);
    strokeWeight(2);
    if (todo.done) {
      fill(100, 220, 150);       // 완료 → 초록
    } else {
      fill(40, 20, 60);          // 미완료 → 어두운색
    }
    rect(boxX, y - 12, 24, 24, 6);

    // 체크 표시 (✓)
    if (todo.done) {
      stroke(255);
      strokeWeight(3);
      line(boxX + 5, y, boxX + 10, y + 7);
      line(boxX + 10, y + 7, boxX + 20, y - 6);
    }

    // 할 일 텍스트
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(18);
    if (todo.done) {
      fill(150, 220, 180);       // 완료 → 연초록
    } else {
      fill(230, 210, 255);       // 미완료 → 연보라
    }
    text(todo.title, boxX + 36, y);

    // 삭제 버튼 (X)
    textAlign(CENTER, CENTER);
    fill(200, 100, 100, 180);
    textSize(16);
    text("✕", cx + 220, y);
  }

  textAlign(CENTER, CENTER);  // 정렬 복원
}

// ============================================================
// 11. 상태 텍스트 (임시)
// ============================================================

function drawCharacter(ratio) {
  

  // 상태 텍스트
  fill(200, 180, 255);
  textSize(12);
  noStroke();
  if (ratio >= 0.8) {
    text("🎶 신나요!", cx, cy + 55);
  } else if (ratio >= 0.3) {
    text("😊 성장 중!", cx, cy + 55);
  } else {
    text("😴 졸려요...", cx, cy + 55);
  }
}

// ============================================================
// 12. 마우스 클릭 — 체크/삭제 처리
// ============================================================

function mousePressed() {
  if (currentPage !== "checklist") return;

  let startY = 160;
  let itemH = 50;
  let cx = width / 2;

  for (let i = 0; i < todoList.length; i++) {
    let y = startY + i * itemH;
    let boxX = cx - 220;

    // 체크박스 클릭 영역
    if (mouseX > boxX && mouseX < boxX + 24 &&
        mouseY > y - 12 && mouseY < y + 12) {
      todoList[i].done = !todoList[i].done;  // 토글
      return;
    }

    // 삭제(✕) 클릭 영역
    if (mouseX > cx + 205 && mouseX < cx + 235 &&
        mouseY > y - 12 && mouseY < y + 12) {
      todoList.splice(i, 1);  // 배열에서 제거
      return;
    }
  }
}

// ============================================================
// 13. 키보드 입력 — 페이지 뒤로가기
// ============================================================

function keyPressed() {
  if (key === "b" || key === "B") {
    if (currentPage === "checklist") {
      currentPage = "input";
      inputBox.show();
      addButton.show();
      startButton.show();
      positionInputUI();
    }
  }
}

// ============================================================
// 14. 완료된 할 일 개수 세기
// ============================================================

function countDone() {
  let count = 0;
  for (let todo of todoList) {
    if (todo.done) count++;
  }
  return count;
}

// ============================================================
// 15. 그라데이션 배경 그리기
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
// 16. 창 크기 변경 대응
// ============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionInputUI();
}
