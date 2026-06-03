// ============================================================
// 전역 변수
// ============================================================

let currentPage = "intro";
// "intro" : 오프닝 화면
// "login" : 아이디 입력 화면
// "input" : 할 일 입력 화면
// "main" : 캐릭터 성장 + 할 일 체크 화면
// "result" : 오늘 결과 저장 화면
// "music" : 곡 플레이 화면

let introStartTime = 0;
let introDuration = 5000;

let loginInput;
let loginButton;
let userId = "";
let loginMessage = "";

let spaceBg;

// 캐릭터 이미지
let characters = [];
let selectedCharacterIndex = 0;
let loadedFromSave = false;

// 캐릭터 애니메이션
let angleSpeed = 0.05;
let clickEffect = 1;
let characterAnimating = true;
let finalBurst = 0;

// 별 배경
let stars = [];

let songSounds = [];

// 할 일 관련
let todoList = [];
let inputBox;
let addButton;
let completeButton;
let fullscreenButton;
let loadButton;
let resetAllButton;
let messageText = "";

// 성장 경로
let pathNodes = [];

// 결과 / 저장 / 화면 이동 버튼
let resultButton;
let saveImageButton;
let musicPageButton;
let restartButton;
let backToMainButton;
let stopMusicButton;
let inventoryCount = 0;
let rewardClaimed = false;
let navDexBtn;

// 타이머 패널 상태
let timerPanelOpen = false;
let timerPanelIndex = -1;
let timerMode = "duration";

// 타이머 입력값
let timerHour = 0;
let timerMin = 0;
let timerSec = 0;

// 타이머 패널 DOM 요소
let hourInput, minInput, secInput;
let durationBtn, deadlineBtn, timerConfirmBtn;
let hourMinusBtn, hourPlusBtn;
let minMinusBtn, minPlusBtn;
let secMinusBtn, secPlusBtn;
let quickButtons = [];
let panelElements = [];

// 타이머 초과 연출
let penaltyList = [];

// 곡 목록
let songs = [
  { title: "별빛 산책", need: 1 },
  { title: "달 조각 왈츠", need: 2 },
  { title: "구름 위의 리듬", need: 3 },
  { title: "밤바다 드럼", need: 4 },
  { title: "마지막 행성의 노래", need: 5 },
  { title: "숨겨진 멜로디", need: 7 }
];

let currentSongIndex = -1;

// 제작자 정보
let creatorNames = "박서정, 오유현";
let creatorSchool = "";

// 상단 내비게이션 버튼
let navHomeBtn, navTodoBtn, navMusicBtn;

// 곡 재생 여부 토글
let musicEnabled = true;
let musicToggleBtn;

let radarStartTime = 0;
let radarDuration = 8000;

let radarDots = [
  { angle: 20, dist: 0.35 },
  { angle: 75, dist: 0.62 },
  { angle: 130, dist: 0.48 },
  { angle: 190, dist: 0.70 },
  { angle: 245, dist: 0.40 },
  { angle: 300, dist: 0.58 },
  { angle: 340, dist: 0.78 }
];

let radarMessage = "미확인 생명체 탐색중...";
let radarCurrentChar = 0;
let radarTypeSpeed = 3;

// 인트로 Initializing 효과
let introInitDots = 0;
let introInitMaxDots = 3;
let introDoneShown = false;
