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
  drawGradientBG(color(0, 5, 12), color(0, 20, 25));

  textAlign(CENTER, CENTER);

  drawingContext.shadowBlur = 22;
  drawingContext.shadowColor = "#5fffe0";

  textFont("Orbitron");
  textStyle(BOLD);
  fill(95, 255, 224);
  textSize(min(width, height) * 0.052);
  text("SPACE SIGNAL ARCHIVE", width / 2, height * 0.13);

  drawingContext.shadowBlur = 0;

  textStyle(NORMAL);
  textFont("Share Tech Mono");
  fill(190, 255, 245);
  textSize(18);
  text("ENTITY COLLECTION UNLOCKS ADDITIONAL SIGNALS", width / 2, height * 0.20);

  fill(220, 210, 255);
  textSize(18);
  text("COLLECTED ENTITIES : " + inventoryCount, width / 2, height * 0.25);

  drawSignalPanel();

  for (let i = 0; i < songs.length; i++) {
    drawSongRow(i);
  }

  textFont("sans-serif");
  textStyle(NORMAL);
}

function drawSignalPanel() {
  let panelX = width * 0.04;
  let panelY = height * 0.30;
  let panelW = width * 0.92;
  let panelH = height * 0.50;

  drawingContext.shadowBlur = 18;
  drawingContext.shadowColor = "#5fffe0";

  noStroke();
  fill(0, 18, 22, 150);
  rect(panelX, panelY, panelW, panelH, 10);

  noFill();
  stroke(95, 255, 224, 160);
  strokeWeight(1.5);
  rect(panelX, panelY, panelW, panelH, 10);

  // 모서리 장식
  stroke(95, 255, 224, 220);
  strokeWeight(2);

  line(panelX + 18, panelY + 18, panelX + 90, panelY + 18);
  line(panelX + 18, panelY + 18, panelX + 18, panelY + 80);

  line(panelX + panelW - 18, panelY + 18, panelX + panelW - 90, panelY + 18);
  line(panelX + panelW - 18, panelY + 18, panelX + panelW - 18, panelY + 80);

  line(panelX + 18, panelY + panelH - 18, panelX + 90, panelY + panelH - 18);
  line(panelX + 18, panelY + panelH - 18, panelX + 18, panelY + panelH - 80);

  line(panelX + panelW - 18, panelY + panelH - 18, panelX + panelW - 90, panelY + panelH - 18);
  line(panelX + panelW - 18, panelY + panelH - 18, panelX + panelW - 18, panelY + panelH - 80);

  drawingContext.shadowBlur = 0;

  textFont("Share Tech Mono");
  textAlign(LEFT, CENTER);
  fill(95, 255, 224);
  textSize(18);
  text("SIGNAL NAME", panelX + 70, panelY + 48);

  textAlign(CENTER, CENTER);
  text("REQUIRED ENTITY", panelX + panelW * 0.62, panelY + 48);

  textAlign(RIGHT, CENTER);
  text("STATUS", panelX + panelW - 80, panelY + 48);

  stroke(95, 255, 224, 80);
  strokeWeight(1);
  line(panelX + 55, panelY + 75, panelX + panelW - 55, panelY + 75);
}

function drawSongRow(i) {
  let panelX = width * 0.04;
  let panelY = height * 0.30;
  let panelW = width * 0.92;

  let rowX = panelX + 55;
  let rowW = panelW - 110;
  let rowH = 52;
  let y = panelY + 112 + i * 62;

  let song = songs[i];
  let canPlay = inventoryCount >= song.need;
  let isPlaying = currentSongIndex === i;

  let hover = mouseX > rowX && mouseX < rowX + rowW && mouseY > y - rowH / 2 && mouseY < y + rowH / 2;

  drawingContext.shadowBlur = hover || isPlaying ? 20 : 8;
  drawingContext.shadowColor = isPlaying ? "#5fffe0" : "#5fffe0";

  noStroke();

  if (isPlaying) {
    fill(0, 80, 72, 210);
  } else if (canPlay) {
    fill(0, 30, 36, 190);
  } else {
    fill(25, 25, 35, 165);
  }

  rect(rowX, y - rowH / 2, rowW, rowH, 6);

  noFill();
  stroke(canPlay ? color(95, 255, 224, 170) : color(120, 120, 150, 120));
  strokeWeight(1.3);
  rect(rowX, y - rowH / 2, rowW, rowH, 6);

  drawingContext.shadowBlur = 0;

  // 신호 아이콘
  textFont("Share Tech Mono");
  textAlign(CENTER, CENTER);
  textSize(16);

  if (canPlay) {
    fill(95, 255, 224);
    text("▶", rowX + 36, y);
  } else {
    fill(160, 160, 180);
    text("■", rowX + 36, y);
  }

  // 신호 번호 + 곡 이름
  textAlign(LEFT, CENTER);
  textSize(18);
  fill(canPlay ? color(235, 255, 252) : color(160, 160, 180));
  text("[ SIGNAL " + nf(i + 1, 2) + " ]  " + song.title, rowX + 75, y);

  // 필요 캐릭터
  textAlign(CENTER, CENTER);
  fill(canPlay ? color(190, 255, 245) : color(150, 150, 170));
  text(song.need + " ENTITY", panelX + panelW * 0.62, y);

  // 상태
  textAlign(RIGHT, CENTER);
  if (!canPlay) {
    fill(255, 120, 160);
    text("ACCESS DENIED", panelX + panelW - 80, y);
  } else if (isPlaying) {
    fill(150, 255, 190);
    text("SIGNAL RECEIVING", panelX + panelW - 80, y);
  } else {
    fill(95, 255, 224);
    text("READY", panelX + panelW - 80, y);
  }

  textAlign(CENTER, CENTER);
  textFont("sans-serif");
}

function handleMusicClick() {
  let panelX = width * 0.04;
  let panelY = height * 0.30;
  let panelW = width * 0.92;

  let rowX = panelX + 55;
  let rowW = panelW - 110;
  let rowH = 52;

  for (let i = 0; i < songs.length; i++) {
    let y = panelY + 112 + i * 62;
    let song = songs[i];

    let inside =
      mouseX > rowX &&
      mouseX < rowX + rowW &&
      mouseY > y - rowH / 2 &&
      mouseY < y + rowH / 2;

    if (inside) {
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

  for (let i = 0; i < songSounds.length; i++) {
    if (songSounds[i] && songSounds[i].isPlaying()) {
      songSounds[i].stop();
    }
  }

  currentSongIndex = index;

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
