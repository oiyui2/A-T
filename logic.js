// ============================================================
// 전역 변수 및 상태 관리
// ============================================================
let currentPage = "input"; 

let characters = [];
let selectedCharacterIndex = 0;
let loadedFromSave = false;
let angleSpeed = 0.05;
let clickEffect = 1;
let characterAnimating = true;
let finalBurst = 0;

let stars = [];
let songSounds = [];

let todoList = [];
let messageText = "";
let pathNodes = [];
let rewardClaimed = false;
let inventoryCount = 0;

let timerPanelOpen = false;
let timerPanelIndex = -1;
let timerMode = "duration"; 
let timerHour = 0;
let timerMin = 0;
let timerSec = 0;

let penaltyList = [];

let musicEnabled = true;
let currentSongIndex = -1;

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
  if (characters[selectedCharacterIndex] && characters[selectedCharacterIndex][stageIndex]) {
    return characters[selectedCharacterIndex][stageIndex];
  }
  return null;
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
// [추가] 인터랙션 및 상태 변경 비즈니스 로직 함수들
// ============================================================
function addTodo() {
  if (!inputBox) return;
  let val = inputBox.value().trim();
  if (val === "") {
    messageText = "할 일을 입력해 주세요.";
    return;
  }
  if (todoList.length >= 8) {
    messageText = "할 일은 최대 8개까지 생성할 수 있습니다.";
    return;
  }
  todoList.push({
    title: val,
    done: false,
    timer: { mode: null, totalSec: 0, remainSec: 0, running: false, finished: false, expired: false, startedAt: 0 }
  });
  inputBox.value("");
  messageText = "'" + val + "'이(가) 추가되었습니다.";
  saveProgress();
}

function goToMainPage() {
  if (todoList.length < 4) {
    messageText = "최소 4개 이상의 할 일을 입력해야 시작할 수 있습니다.";
    return;
  }
  currentPage = "main";
  messageText = "";
  createPathNodes();
  showOnlyMainUI();
}

function goToResultPage() {
  currentPage = "result";
  let doneCount = countDone();
  if (doneCount === todoList.length && todoList.length > 0 && !rewardClaimed) {
    inventoryCount++;
    rewardClaimed = true;
    saveInventory();
  }
  saveProgress();
  showOnlyResultUI();
}

function restartProgram() {
  todoList = [];
  rewardClaimed = false;
  currentPage = "input";
  messageText = "새로운 하루를 시작합니다!";
  saveProgress();
  showOnlyInputUI();
}

function resetAllData() {
  if (confirm("모든 투두리스트와 보유 캐릭터 데이터가 삭제됩니다. 초기화하시겠습니까?")) {
    localStorage.clear();
    todoList = [];
    inventoryCount = 0;
    rewardClaimed = false;
    currentPage = "input";
    messageText = "전체 데이터가 초기화되었습니다.";
    showOnlyInputUI();
  }
}

function navToHome() { stopAllSongs(); currentPage = "input"; showOnlyInputUI(); }
function navToTodo() { stopAllSongs(); if(todoList.length >= 4) { currentPage = "main"; createPathNodes(); showOnlyMainUI(); } else { messageText = "할 일을 4개 이상 입력해 주세요."; showOnlyInputUI(); } }
function navToMusic() { if (countDone() === todoList.length && todoList.length > 0) { currentPage = "music"; showOnlyMusicUI(); } else { alert("오늘의 할 일을 모두 끝내고 결과 화면을 거쳐야 음악실에 입장할 수 있습니다!"); } }

function adjustTimerValue(type, amt) {
  if (type === "hour") timerHour = max(0, timerHour + amt);
  if (type === "min") timerMin = max(0, timerMin + amt);
  if (type === "sec") timerSec = max(0, timerSec + amt);
  syncTimerInputs();
}

function confirmTimerSetting() {
  if (timerPanelIndex === -1) return;
  
  // DOM 입력값 동기화
  if (hourInput) timerHour = int(hourInput.value()) || 0;
  if (minInput) timerMin = int(minInput.value()) || 0;
  if (secInput) timerSec = int(secInput.value()) || 0;

  let total = timerHour * 3600 + timerMin * 60 + timerSec;
  if (total <= 0) {
    alert("시간을 0초 이상으로 설정해 주세요.");
    return;
  }

  let t = todoList[timerPanelIndex].timer;
  t.mode = timerMode;
  t.totalSec = total;
  t.remainSec = total;
  t.running = false;
  t.finished = false;
  t.expired = false;

  closeTimerPanel();
  saveProgress();
}

function startTimer(index) {
  let t = todoList[index].timer;
  if (t.mode === null || t.totalSec <= 0) return;
  t.running = true;
  t.startedAt = millis();
  characterAnimating = true;
}

function playSong(index) {
  stopAllSongs();
  currentSongIndex = index;
  if (musicEnabled && songSounds[index]) {
    songSounds[index].loop();
  }
}

function stopAllSongs() {
  currentSongIndex = -1;
  for (let sound of songSounds) {
    if (sound && sound.isPlaying()) sound.stop();
  }
}

function toggleMusicEnabled() {
  musicEnabled = !musicEnabled;
  if (musicToggleBtn) {
    musicToggleBtn.html(musicEnabled ? "🔊 곡 재생: 켜짐" : "🔇 곡 재생: 꺼짐");
  }
  if (!musicEnabled) {
    if (currentSongIndex !== -1 && songSounds[currentSongIndex]) {
      songSounds[currentSongIndex].pause();
    }
  } else {
    if (currentSongIndex !== -1 && songSounds[currentSongIndex] && !songSounds[currentSongIndex].isPlaying()) {
      songSounds[currentSongIndex].loop();
    }
  }
}

// ============================================================
// Storage (저장/불러오기) 로직
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
      todo.timer = { mode: null, totalSec: 0, remainSec:
