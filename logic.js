// ============================================================
// 전역 변수 및 상태 관리
// ============================================================
let currentPage = "input"; // "input", "main", "result", "music"

// 캐릭터 및 애니메이션 관련
let characters = [];
let selectedCharacterIndex = 0;
let loadedFromSave = false;
let angleSpeed = 0.05;
let clickEffect = 1;
let characterAnimating = true;
let finalBurst = 0;

// 배경 및 환경 효과
let stars = [];
let songSounds = [];

// 할 일 데이터
let todoList = [];
let messageText = "";
let pathNodes = [];
let rewardClaimed = false;
let inventoryCount = 0;

// 타이머 패널 상태 및 입력값
let timerPanelOpen = false;
let timerPanelIndex = -1;
let timerMode = "duration"; // "duration", "deadline"
let timerHour = 0;
let timerMin = 0;
let timerSec = 0;

// 타이머 패널 페널티 연출
let penaltyList = [];

// 오디오 토글 상태
let musicEnabled = true;
let currentSongIndex = -1;

// 곡 목록 및 제작자 정보
let songs = [
  { title: "별빛 산책", need: 1 },
  { title: "달 조각 왈츠", need: 2 },
  { title: "구름 위의 리듬", need: 3 },
  { title: "밤바다 드럼", need: 4 },
  { title: "마지막 행성의 노래", need: 5 },
  { title: "숨겨진 멜로디", need: 7 }
];
let creatorNames = "박서정, 오유현";
let creatorSchool = "";

// ============================================================
// 핵심 계산 및 데이터 로직 함수
// ============================================================

function countDone() {
  let count = 0;
  for (let todo of todoList) {
    if (todo.done) count++;
  }
  return count;
}

function getStageIndex(doneCount, totalCount) {
  if (totalCount <= 0) return 0;
  let stageIndex = floor((doneCount * 4) / totalCount);
  return constrain(stageIndex, 0, 4);
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

function getCharacterPathPosition() {
  if (pathNodes.length === 0) {
    return { x: width * 0.20, y: height * 0.70 };
  }
  let idx = constrain(countDone(), 0, pathNodes.length - 1);
  return { x: pathNodes[idx].x, y: pathNodes[idx].y - 80 };
}

function updateTimers() {
  let runningExists = false;
  let expiredExists = false;

  for (let i = 0; i < todoList.length; i++) {
    let todo = todoList[i];
    let t = todo.timer;
    if (!t) continue;

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

  if (expiredExists) {
    characterAnimating = false;
  } else if (runningExists) {
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
  penaltyList.push({ index: index, startFrame: frameCount });
  saveProgress();
}

function updateFinalBurstState() {
  if (countDone() !== todoList.length) {
    finalBurst = 0;
  }
}

function createStar() {
  return {
    x: random(width),
    y: random(height),
    size: random(2, 5),
    speed: random(0.05, 2),
    brightness: random(150, 255)
  };
}

// ============================================================
// Storage (저장/불러오기/초기화) 로직
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

  for (let todo of todoList) {
    if (!todo.timer) {
      todo.timer = { mode: null, totalSec: 0, remainSec: 0, running: false, finished: false, expired: false, startedAt: 0 };
    }
    if (todo.timer.running) todo.timer.running = false;
  }

  currentPage = "input";
  loadedFromSave = true;
  messageText = "저장된 기록을 불러왔습니다.";
  showOnlyInputUI();
}

function saveInventory() {
  localStorage.setItem("twoDoInventoryCount", inventoryCount);
}

function loadInventory() {
  let savedCount = localStorage.getItem("twoDoInventoryCount");
  inventoryCount = (savedCount === null) ? 0 : int(savedCount);
}
