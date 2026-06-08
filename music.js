// 음악 화면 / 곡 재생 관련 함수
// ============================================================

function goToMusicPage() {
currentPage = "music";
showOnlyMusicUI();
}

function goBackToResultPage() {
stopAllSongs();

currentPage = "result";
showOnlyResultUI();
}


// ============================================================
// 음악 화면
// ============================================================

function drawMusicPage() {
drawGradientBG(color(20, 10, 50), color(60, 20, 80));

fill(255);
textStyle(BOLD);
textSize(min(width, height) * 0.06);
text("Song", width * 0.12, height * 0.10);

textSize(24);
text("곡 이름", width * 0.28, height * 0.17);
text("필요 캐릭터 개수", width * 0.68, height * 0.17);

textStyle(NORMAL);
fill(220, 210, 255);
textSize(20);
text("보유한 캐릭터 개수: " + inventoryCount + "개", width * 0.78, height * 0.10);

for (let i = 0; i < songs.length; i++) {
drawSongRow(i);
}

fill(220, 210, 255);
textSize(15);
text("캐릭터를 모을수록 더 많은 곡을 플레이할 수 있습니다.", width / 2, height - 35);
}

function drawSongRow(i) {
let y = height * 0.26 + i * 64;
let song = songs[i];
let canPlay = inventoryCount >= song.need;

noStroke();

if (canPlay) {
fill(190, 180, 215, 220);
} else {
fill(120, 115, 140, 170);
}

rect(width * 0.08, y - 22, width * 0.80, 44, 22);

fill(255);
triangle(width * 0.11, y - 10, width * 0.11, y + 10, width * 0.125, y);

textAlign(LEFT, CENTER);
textSize(20);
fill(255);
text(song.title, width * 0.18, y);

textAlign(CENTER, CENTER);
text(song.need + "개", width * 0.68, y);

if (!canPlay) {
fill(255, 180, 200);
textSize(16);
text("잠김", width * 0.82, y);
} else if (currentSongIndex === i) {
fill(180, 255, 200);
textSize(16);
text("Now playing ...", width * 0.82, y);
}

textAlign(CENTER, CENTER);
}

function handleMusicClick() {
for (let i = 0; i < songs.length; i++) {
let y = height * 0.26 + i * 64;
let song = songs[i];

let inside =
mouseX > width * 0.08 &&
mouseX < width * 0.88 &&
mouseY > y - 22 &&
mouseY < y + 22;

if (inside) {
// 잠긴 곡이면 클릭해도 재생 안 됨
if (inventoryCount < song.need) {
console.log("아직 잠긴 곡입니다.");
return;
}

playSong(i);
return;
}
}
}

function playSong(index) {
if (!musicEnabled) {
console.log("곡 재생이 꺼져 있습니다. (상단/하단 토글로 켜기)");
return;
}

if (typeof userStartAudio === "function") {
userStartAudio();
}

stopLayeredMusic();

// 현재 재생 중인 모든 곡 멈추기
for (let i = 0; i < songSounds.length; i++) {
if (songSounds[i] && songSounds[i].isPlaying()) {
songSounds[i].stop();
}
}

// 음악 파일이 없어도 선택 상태는 바뀌게 함
currentSongIndex = index;

// 음악 파일이 있으면 재생
if (songSounds[index]) {
songSounds[index].play();
} else {
console.log("음악 파일이 아직 없습니다. 표시만 변경합니다.");
}
}

function stopAllSongs() {
for (let i = 0; i < songSounds.length; i++) {
if (songSounds[i] && songSounds[i].isPlaying()) {
songSounds[i].stop();
}
}

stopLayeredMusic();
currentSongIndex = -1;
}

// ============================================================
// 할 일 완료 레이어 음악
// ============================================================

function selectLayeredMusicForCurrentRun() {
if (layeredMusicSets.length === 0) return;

stopLayeredMusic();
currentLayeredMusicSetIndex = inventoryCount % layeredMusicSets.length;
ensureLayeredMusicSetLoaded(getCurrentLayeredMusicSet());
layeredMusicActiveCount = 0;
layeredMusicStarted = false;
}

function getCurrentLayeredMusicSet() {
if (layeredMusicSets.length === 0) return null;
return layeredMusicSets[currentLayeredMusicSetIndex % layeredMusicSets.length];
}

function startLayeredMusicIfNeeded() {
if (!musicEnabled) return;

let musicSet = getCurrentLayeredMusicSet();
if (!musicSet) return;
ensureLayeredMusicSetLoaded(musicSet);
if (musicSet.tracks.length === 0) return;
if (!isLayeredMusicSetLoaded(musicSet)) return;

if (typeof userStartAudio === "function") {
userStartAudio();
}

for (let track of musicSet.tracks) {
if (!track) continue;

if (!track.isPlaying()) {
track.setVolume(0);
track.loop(0, 1, 0, 0, musicSet.loopSec);
}
}

layeredMusicStarted = true;
}

function ensureLayeredMusicSetLoaded(musicSet) {
if (!musicSet || musicSet.tracks.length > 0) return;

for (let path of musicSet.trackPaths || []) {
musicSet.tracks.push(loadSound(path));
}
}

function syncLayeredMusicToProgress() {
let musicSet = getCurrentLayeredMusicSet();
if (!musicSet) return;
ensureLayeredMusicSetLoaded(musicSet);
if (musicSet.tracks.length === 0) return;

if (!musicEnabled) {
muteLayeredMusic();
return;
}

startLayeredMusicIfNeeded();
if (!isLayeredMusicSetLoaded(musicSet)) return;

let activeCount = getUnlockedLayerCount(musicSet.tracks.length);
layeredMusicActiveCount = activeCount;

for (let i = 0; i < musicSet.tracks.length; i++) {
let track = musicSet.tracks[i];
if (!track) continue;

let targetVolume = i < activeCount ? 0.75 : 0;
track.setVolume(targetVolume, 0.25);
}
}

function isLayeredMusicSetLoaded(musicSet) {
for (let track of musicSet.tracks) {
if (!track) return false;
if (track.isLoaded && !track.isLoaded()) return false;
}

return true;
}

function getUnlockedLayerCount(trackCount) {
if (todoList.length <= 0 || trackCount <= 0) return 0;

let doneCount = countDone();
if (doneCount <= 0) return 0;
if (doneCount >= todoList.length) return trackCount;

return constrain(ceil((doneCount / todoList.length) * trackCount), 1, trackCount);
}

function muteLayeredMusic() {
let musicSet = getCurrentLayeredMusicSet();
if (!musicSet) return;

for (let track of musicSet.tracks) {
if (track) {
track.setVolume(0, 0.15);
}
}
}

function stopLayeredMusic() {
for (let musicSet of layeredMusicSets) {
for (let track of musicSet.tracks) {
if (track && track.isPlaying()) {
track.stop();
}
}
}

layeredMusicStarted = false;
layeredMusicActiveCount = 0;
}
