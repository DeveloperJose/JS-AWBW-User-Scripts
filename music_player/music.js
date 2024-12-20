import { getCurrentCOName, getAllCONames, isMapEditor } from "../shared/awbw_site";
import { setMusicPlayerLoadPercentage } from "./music_player_menu";
import {
  gameSFX,
  getMusicURL,
  movementSFX,
  onMovementRollOffMap,
  onMovementStartMap,
  uiSFX,
} from "./resources";
import { musicPlayerSettings, addSettingsChangeListener } from "./music_settings";

// Set default audio settings
const currentTheme = new Audio();
const currentSFX = new Audio();
const currentUI = new Audio();
currentSFX.loop = true;

// Always play any music that finishes loading
currentTheme.onloadedmetadata = function () {
  currentTheme.play();
};

// Listen for setting changes to update the internal variables accordingly
addSettingsChangeListener(onSettingsChange);

/**
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 */
export function playMusic() {
  if (!musicPlayerSettings.isPlaying) return;
  let coName = isMapEditor ? "map-editor" : getCurrentCOName();
  playCOTheme(coName);
}

/**
 * Stops all music if there's any playing.
 */
export function stopMusic() {
  currentTheme.pause();
}

/**
 * Plays the movement sound of the given unit.
 * @param {*} unitType String containing the name of the unit.
 */
export function playMovementSound(unitType) {
  if (!musicPlayerSettings.isPlaying) {
    return;
  }
  currentSFX.src = onMovementStartMap.get(unitType);
  currentSFX.currentTime = 0;
  currentSFX.volume = musicPlayerSettings.sfxVolume;
  currentSFX.play();
}

/**
 * Stops any movement sound currently playing.
 * Optionally plays a rolloff sound afterwards if a unit is provided.
 * @param {*} unitType (Optional) String containing the name of the unit for rolloff.
 */
export function stopMovementSound(unitType = null) {
  // Can't stop if there's nothing playing
  if (!musicPlayerSettings.isPlaying || currentSFX.paused) {
    return;
  }

  currentSFX.currentTime = 0;
  currentSFX.pause();

  if (unitType !== null) {
    let audioURL = onMovementRollOffMap.get(unitType);
    playOneShotURL(audioURL, musicPlayerSettings.sfxVolume);
  }
}

/**
 * Preloads the current game COs' themes and common sound effect audios.
 */
export function preloadCommonAudio() {
  // Preload CO Themes
  let coNames = [];
  if (isMapEditor === false) {
    coNames = getAllCONames();
  } else {
    coNames.push("map-editor");
  }
  let audioList = coNames.map(getMusicURL);

  // Preload SFX
  for (let key in movementSFX) {
    audioList.push(movementSFX[key]);
  }
  for (let key in gameSFX) {
    audioList.push(gameSFX[key]);
  }
  for (let key in uiSFX) {
    audioList.push(uiSFX[key]);
  }

  preloadAudioList(audioList);
}

function playMusicURL(srcURL, loop = false) {
  if (srcURL === currentTheme.src) {
    if (currentTheme.paused) {
      currentTheme.play();
    }
    return;
  }
  currentTheme.src = srcURL;
  currentTheme.loop = loop;
}

function playOneShotURL(srcURL, volume) {
  let soundInstance = new Audio(srcURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
}

function playCOTheme(coName) {
  coName = coName.toLowerCase();
  let srcURL = getMusicURL(coName);
  playMusicURL(srcURL, true);
}

function preloadAudioList(audioList) {
  // Only unique audios, remove duplicates
  audioList = new Set(audioList);

  let numLoadedAudios = 1;
  let onLoadAudio = function () {
    numLoadedAudios++;
    let loadPercentage = (numLoadedAudios / audioList.size) * 100;
    setMusicPlayerLoadPercentage(loadPercentage);

    if (numLoadedAudios >= audioList.size) {
      console.log("[AWBW Improved Music Player] All audio has been pre-loaded!");
    }
  };

  audioList.forEach((url) => {
    let audio = new Audio();
    audio.addEventListener("canplaythrough", onLoadAudio, false);
    audio.src = url;
  });
}

/**
 * Updates the internal audio components to match the current music player settings when the settings change.
 *
 * @param {*} _key Key of the setting which has been changed.
 */
function onSettingsChange(key) {
  currentTheme.volume = musicPlayerSettings.volume;
  currentSFX.volume = musicPlayerSettings.sfxVolume;
  currentUI.volume = musicPlayerSettings.uiVolume;

  if (key !== "isPlaying") {
    return;
  }

  if (musicPlayerSettings.isPlaying) {
    playMusic();
  } else {
    stopMusic();
  }
}
