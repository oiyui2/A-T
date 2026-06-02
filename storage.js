// 저장 / 불러오기 / 초기화
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

normalizeTodoTimers();

// 저장 기록은 바로 메인 화면으로 넘기지 않고,
// 입력 화면에서 목록을 다시 확인한 뒤 시작할 수 있게 함
currentPage = "input";
loadedFromSave = true;
messageText = "저장된 기록을 불러왔습니다.";

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

// 저장 후 다시 불러올 때 millis() 기준이 달라지므로 실행 중인 타이머는 멈춘 상태로 복원
if (todo.timer.running) {
todo.timer.running = false;
}
}
}

function saveInventory() {
localStorage.setItem("twoDoInventoryCount", inventoryCount);
}

function loadInventory() {
let savedCount = localStorage.getItem("twoDoInventoryCount");

if (savedCount === null) {
inventoryCount = 0;
} else {
inventoryCount = int(savedCount);
}
}

// 새 할 일 시작: 오늘 할 일 기록만 삭제, 보유 캐릭터 개수는 유지
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

localStorage.removeItem("twoDoProgress");

currentPage = "input";
showOnlyInputUI();
}

// 전체 초기화: 오늘 할 일 + 보유 캐릭터 개수까지 전부 삭제
function resetAllData() {
stopAllSongs();
todoList = [];
inventoryCount = 0;
messageText = "전체 기록이 초기화되었습니다.";
rewardClaimed = false;
finalBurst = 0;
characterAnimating = true;
currentSongIndex = -1;
timerPanelOpen = false;
timerPanelIndex = -1;
penaltyList = [];
loadedFromSave = false;

closeTimerPanelDOM();

localStorage.removeItem("twoDoProgress");
localStorage.removeItem("twoDoInventoryCount");

currentPage = "input";
showOnlyInputUI();
}


// ============================================================
