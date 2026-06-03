function getUserKey(baseKey) {
  if (!userId || userId.trim() === "") {
    return baseKey + "_guest";
  }

  return baseKey + "_" + userId.trim();
}

function saveProgress() {
  let saveData = {
    todoList: todoList,
    selectedCharacterIndex: selectedCharacterIndex,
    rewardClaimed: rewardClaimed
  };

  localStorage.setItem(getUserKey("twoDoProgress"), JSON.stringify(saveData));
}

function loadProgress() {
  let rawData = localStorage.getItem(getUserKey("twoDoProgress"));

  if (rawData === null) {
    messageText = "이 아이디에 저장된 기록이 없습니다.";
    return;
  }

  let saveData = JSON.parse(rawData);

  todoList = saveData.todoList || [];
  selectedCharacterIndex = saveData.selectedCharacterIndex || 0;
  rewardClaimed = saveData.rewardClaimed || false;

  normalizeTodoTimers();

  currentPage = "input";
  loadedFromSave = true;
  messageText = userId + "님의 저장 기록을 불러왔습니다.";

  showOnlyInputUI();
}

function normalizeTodoTimers() {
  for (let todo of todoList) {
    if (!todo.timer) {
      todo.timer = {
        mode: null,
        totalSec: 0,
        remainSec: 0,
        running: false,
        finished: false,
        expired: false,
        startedAt: 0
      };
    }

    if (todo.timer.running) {
      todo.timer.running = false;
    }
  }
}

function saveInventory() {
  localStorage.setItem(getUserKey("twoDoInventoryCount"), inventoryCount);
}

function loadInventory() {
  let savedCount = localStorage.getItem(getUserKey("twoDoInventoryCount"));

  if (savedCount === null) {
    inventoryCount = 0;
  } else {
    inventoryCount = int(savedCount);
  }
}

function restartProgram() {
  stopAllSongs();
  todoList = [];
  messageText = "";
  rewardClaimed = false;
  finalBurst = 0;
  characterAnimating = true;
  currentSongIndex = -1;
  timerPanelOpen = false;
  timerPanelIndex = -1;
  penaltyList = [];
  loadedFromSave = false;

  closeTimerPanelDOM();

  localStorage.removeItem(getUserKey("twoDoProgress"));

  currentPage = "input";
  showOnlyInputUI();
}

function resetAllData() {
  stopAllSongs();
  todoList = [];
  inventoryCount = 0;
  messageText = "이 아이디의 전체 기록이 초기화되었습니다.";
  rewardClaimed = false;
  finalBurst = 0;
  characterAnimating = true;
  currentSongIndex = -1;
  timerPanelOpen = false;
  timerPanelIndex = -1;
  penaltyList = [];
  loadedFromSave = false;

  closeTimerPanelDOM();

  localStorage.removeItem(getUserKey("twoDoProgress"));
  localStorage.removeItem(getUserKey("twoDoInventoryCount"));

  currentPage = "input";
  showOnlyInputUI();
}
