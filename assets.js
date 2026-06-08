function preload() {
// 0번 캐릭터: 불
characters[0] = [
loadImage("images/1단계불.png"),
loadImage("images/2단계불.png"),
loadImage("images/3단계불.png"),
loadImage("images/4단계불.png"),
loadImage("images/5단계불.png")
];
spaceBg = loadImage("images/space-bg.jpg");
// 1번 캐릭터: 구름
characters[1] = [
loadImage("images/1단계구름.png"),
loadImage("images/2단계구름.png"),
loadImage("images/3단계구름.png"),
loadImage("images/4단계구름.png"),
loadImage("images/5단계구름.png")
];

// 2번 캐릭터: 유령
characters[2] = [
loadImage("images/1단계유령.png"),
loadImage("images/2단계유령.png"),
loadImage("images/3단계유령.png"),
loadImage("images/4단계유령.png"),
loadImage("images/5단계유령.png")
];

// 3번 캐릭터: 구
characters[3] = [
loadImage("images/1단계구.png"),
loadImage("images/2단계구.png"),
loadImage("images/3단계구.png"),
loadImage("images/4단계구.png"),
loadImage("images/5단계구.png")
];

loadLayeredMusicSets();
loadExtraSoundAssets();

for (let set of layeredMusicSets) {
  ensureLayeredMusicSetLoaded(set);
}

}

function loadSongSounds() {
songSounds[0] = loadSound("sounds/2do3-BigRideEdit_140_SnareSplash_FX_4bars.wav");
}

function loadExtraSoundAssets() {
homeMusicSound = loadSound("sounds/Untitled_2026_6_9__1206.mp3");
clickSound = loadSound("sounds/ksjsbwuil-digital-click-3-513897.mp3");

extraSoundAssets = [
loadSound("sounds/song1.mp3"),
loadSound("sounds/back_drop-dark-ambient-liminal-background-music-subliminal-voices-197604%20%281%29.mp3"),
loadSound("sounds/%EC%84%B1%EC%9A%B4%EC%9D%98%20%EC%88%A8%EA%B2%B0.mp3"),
loadSound("sounds/%EC%84%B1%EC%9A%B4%EC%9D%98%20%EC%88%A8%EA%B2%B0%20%281%29.mp3")
];
}

function loadLayeredMusicSets() {
layeredMusicSets = [
{
name: "2do1",
loopSec: 29.5,
tracks: [
],
trackPaths: [
"sounds/2do1 - 1.synth.wav",
"sounds/2do1 - 2.piano line.wav",
"sounds/2do1 - 3.wav",
"sounds/2do1 - 4.wav",
"sounds/2do1 - 5.fx.wav",
"sounds/2do1 - 6.Rain_FX.wav",
"sounds/2do1 - 7.wav",
"sounds/2do1 - 8.wav",
"sounds/2do1 - 9.piano.code.wav"
]
},
{
name: "2do2",
loopSec: 115.2,
tracks: [
],
trackPaths: [
"sounds/2do2 - 1.synthline.wav",
"sounds/2do2 - 2.noise.wav",
"sounds/2do2 - 3.code.wav",
"sounds/2do2 - 4.subline.wav",
"sounds/2do2 - 5.choir.wav",
"sounds/2do2 - 6.noise.wav",
"sounds/2do2 - 7.beat.wav",
"sounds/2do2 - 8.wav"
]
},
{
name: "2do3",
loopSec: 32,
tracks: [
],
trackPaths: [
"sounds/2do3-BigRideEdit_140_SnareSplash_FX_4bars.wav",
"sounds/2do3- Instrument.wav",
"sounds/2do3- Instrument 2.wav",
"sounds/2do3 - Instrument 3.wav",
"sounds/2do3- Instrument 4.wav",
"sounds/2do3- MAB_80_C%23min_ReverseKey_03_1bar.wav",
"sounds/2do3- Voice_Audio 3.wav",
"sounds/2do3- Voice_Audio 4.wav"
]
},
{
name: "\ubc24\ubc14\ub2e4 \ub4dc\ub7fc",
tracks: [
],
trackPaths: [
"sounds/back_drop-dark-ambient-liminal-background-music-subliminal-voices-197604%20%281%29.mp3"
]
},
{
name: "\ub9c8\uc9c0\ub9c9 \ud589\uc131\uc758 \ub178\ub798",
tracks: [
],
trackPaths: [
"sounds/%EC%84%B1%EC%9A%B4%EC%9D%98%20%EC%88%A8%EA%B2%B0.mp3"
]
},
{
name: "\uc228\uaca8\uc9c4 \uba5c\ub85c\ub514",
tracks: [
],
trackPaths: [
"sounds/%EC%84%B1%EC%9A%B4%EC%9D%98%20%EC%88%A8%EA%B2%B0%20%281%29.mp3"
]
}
];
}
