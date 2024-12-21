import { getAllCONames, isMapEditor, getUnitName, currentPlayer } from "../shared/awbw_site";
import { setMusicPlayerLoadPercentage } from "./music_player_menu";
import {
  getMusicURL,
  getMovementSoundURL,
  getMovementRollOffURL,
  hasMovementRollOff,
  getSoundEffectURL,
  getAllSoundEffectURLS,
} from "./resources";
import {
  musicPlayerSettings,
  addSettingsChangeListener,
  GAME_TYPE,
  THEME_TYPE,
} from "./music_settings";

/**
 *
 */
let delayThemeMS = 0;
let currentlyDelaying = false;

/**
 *
 */
let currentThemeKey = "";

/**
 *
 */
const urlAudioMap = new Map();

/**
 *
 */
const unitIDAudioMap = new Map();

// Listen for setting changes to update the internal variables accordingly
addSettingsChangeListener(onSettingsChange);

function playMusicURL(srcURL, loop = false) {
  let currentTheme = urlAudioMap.get(currentThemeKey);

  // We want to play the same song we already are playing
  if (srcURL === currentThemeKey) {
    // The song was paused, so resume it
    if (currentTheme.paused) currentTheme.play();
    return;
  }

  // We want to play a new song, so pause the previous one (if exists)
  currentTheme?.pause();

  // Start new theme
  console.log("[AWBW Improved Music Player] Now Playing: " + srcURL);
  currentThemeKey = srcURL;
  currentTheme = urlAudioMap.get(srcURL);
  currentTheme.volume = musicPlayerSettings.volume;
  currentTheme.loop = loop;
  currentTheme.play();
}

function playOneShotURL(srcURL, volume) {
  let soundInstance = new Audio(srcURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
}

function playCOTheme(coName) {
  let srcURL = getMusicURL(coName);
  playMusicURL(srcURL, true);
}

/**
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 */
export function playMusic() {
  if (!musicPlayerSettings.isPlaying) return;

  // Someone wants us to delay playing the theme, so wait a little bit then play
  // Ignore all calls to play() while delaying, we are guaranteed to play eventually
  if (currentlyDelaying) return;
  if (delayThemeMS > 0) {
    // Delay until I say so
    setTimeout(() => {
      currentlyDelaying = false;
      playMusic();
    }, delayThemeMS);

    delayThemeMS = 0;
    currentlyDelaying = true;
    return;
  }
  let coName = isMapEditor ? "map-editor" : currentPlayer.coName;
  playCOTheme(coName);
}

/**
 * Stops all music if there's any playing.
 * Optionally, you can also delay the start of the next theme.
 * @param {*} delayMS (Optional) Time to delay before we start the next theme.
 */
export function stopMusic(delayMS = 0) {
  delayThemeMS = delayMS;

  let currentTheme = urlAudioMap.get(currentThemeKey);
  currentTheme?.pause();
}

/**
 * Plays the movement sound of the given unit.
 * @param {*} unitID The ID of the unit who is moving.
 */
export function playMovementSound(unitID) {
  if (!musicPlayerSettings.isPlaying) return;

  if (!unitIDAudioMap.has(unitID)) {
    let unitName = getUnitName(unitID);
    let movementSoundURL = getMovementSoundURL(unitName);
    unitIDAudioMap.set(unitID, new Audio(movementSoundURL));
  }

  let movementAudio = unitIDAudioMap.get(unitID);
  movementAudio.currentTime = 0;
  movementAudio.loop = true;
  movementAudio.volume = musicPlayerSettings.sfxVolume;
  movementAudio.play();
  console.log("Moving: ", unitID, ",", movementAudio.src);
}

/**
 * Stops the movement sound of a given unit if it's playing.
 * @param {*} unitID The ID of the unit whose movement sound will be stopped.
 */
export function stopMovementSound(unitID) {
  // Can't stop if there's nothing playing or nothing to be played
  if (!musicPlayerSettings.isPlaying || !unitIDAudioMap.has(unitID)) return;

  // Can't stop if the sound is already stopped
  let movementAudio = unitIDAudioMap.get(unitID);
  if (movementAudio.paused) return;

  // Stop sound
  console.log("Pausing", unitID, ",", movementAudio.src);
  movementAudio.pause();
  movementAudio.currentTime = 0;

  // If unit has rolloff, play it
  let unitName = getUnitName(unitID);
  if (hasMovementRollOff(unitName)) {
    let audioURL = getMovementRollOffURL(unitName);
    playOneShotURL(audioURL, musicPlayerSettings.sfxVolume);
  }
}

export function playSFX(sfx) {
  if (!musicPlayerSettings.isPlaying) return;

  // Figure out which volume to use
  let sfxURL = getSoundEffectURL(sfx);
  let vol = musicPlayerSettings.sfxVolume;
  if (sfx.startsWith("sfx-ui")) {
    vol = musicPlayerSettings.uiVolume;
  }
  playOneShotURL(sfxURL, vol);
}

/**
 * Preloads the current game COs' themes and common sound effect audios.
 * @param {*} afterPreloadFunction Function to run after the audio is pre-loaded.
 */
export function preloadCommonAudio(afterPreloadFunction) {
  // Preload the themes of the COs in this match
  // We preload the themes for each game version
  let audioList = [];
  let coNames = isMapEditor ? ["map-editor"] : getAllCONames();
  for (let gameType in GAME_TYPE) {
    for (let themeType in THEME_TYPE) {
      let gameList = coNames.map((name) => getMusicURL(name, gameType, themeType));
      audioList = audioList.concat(gameList);
    }
  }

  // Preload SFX
  audioList = audioList.concat(getAllSoundEffectURLS());

  // Only unique audios, remove duplicates
  audioList = new Set(audioList);

  let numLoadedAudios = 0;
  let onLoadAudio = function () {
    numLoadedAudios++;
    let loadPercentage = (numLoadedAudios / audioList.size) * 100;
    setMusicPlayerLoadPercentage(loadPercentage);

    if (numLoadedAudios >= audioList.size) {
      if (afterPreloadFunction) afterPreloadFunction();
    }
  };

  let onLoadAudioError = (event) => {
    onLoadAudio();
    console.log("[AWBW Improved Music Player] Could not pre-load: " + event.target.src);
  };

  audioList.forEach((url) => {
    let audio = new Audio(url);
    urlAudioMap.set(url, audio);
    audio.addEventListener("loadedmetadata", onLoadAudio, false);
    audio.addEventListener("error", onLoadAudioError, false);
  });
}

/**
 * Updates the internal audio components to match the current music player settings when the settings change.
 *
 * @param {*} _key Key of the setting which has been changed.
 */
function onSettingsChange(key) {
  switch (key) {
    case "isPlaying":
      if (musicPlayerSettings.isPlaying) {
        playMusic();
      } else {
        stopMusic();
      }
      break;
    case "gameType":
      playMusic();
      break;
    case "volume": {
      // Adjust the volume of the current theme
      let currentTheme = urlAudioMap.get(currentThemeKey);
      if (currentTheme) {
        currentTheme.volume = musicPlayerSettings.volume;
      }
      break;
    }
    case "sfxVolume":
      // Very rare for these sound effects to be playing when messing with the settings
      // but just in case adjust the volume as well
      unitIDAudioMap.forEach((unitAudio) => {
        unitAudio.volume = musicPlayerSettings.sfxVolume;
      });
      break;
  }
}
