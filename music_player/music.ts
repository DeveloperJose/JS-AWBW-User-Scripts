import { getAllPlayingCONames, getUnitName, currentPlayer } from "../shared/awbw_game";
import { musicPlayerUI } from "./menu_ui";
import {
  getMusicURL,
  getMovementSoundURL,
  getMovementRollOffURL,
  hasMovementRollOff,
  getSoundEffectURL,
  getAllSoundEffectURLs,
  GameSFX,
  getAllThemeURLs,
} from "./resources";
import {
  musicPlayerSettings,
  addSettingsChangeListener,
  SettingsGameType,
  SettingsThemeType,
  getCurrentThemeType,
} from "./music_settings";
import { getRandomCO } from "../shared/awbw_globals";
import { getIsMapEditor } from "../shared/awbw_page";

/**
 * The URL of the current theme that is playing.
 */
let currentThemeKey = "";

/**
 * Map containing the audio players for all preloaded themes and sound effects.
 * The keys are the preloaded audio URLs.
 */
const urlAudioMap: Map<string, HTMLAudioElement> = new Map();

/**
 * Map containing the audio players for all units.
 * The keys are the unit IDs.
 */
const unitIDAudioMap: Map<number, HTMLAudioElement> = new Map();

/**
 * If set to true, calls to playMusic() will set a timer for {@link delayThemeMS} milliseconds after which the music will play again.
 */
let currentlyDelaying = false;

/**
 * If delaying (see {@link currentlyDelaying}), this determines how long to wait before playing music again in milliseconds.
 */
let delayThemeMS = 0;

let onAudioLoadPauseIt = (event: Event) => (event.target as HTMLAudioElement).pause();

// Listen for setting changes to update the internal variables accordingly
addSettingsChangeListener(onSettingsChange);

/**
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 * @param startFromBeginning - Whether to start the song from the beginning or resume from the previous spot.
 */
export function playThemeSong(startFromBeginning = false) {
  if (!musicPlayerSettings.isPlaying) return;

  // Someone wants us to delay playing the theme, so wait a little bit then play
  // Ignore all calls to play() while delaying, we are guaranteed to play eventually
  if (currentlyDelaying) return;
  if (delayThemeMS > 0) {
    // Delay until I say so
    setTimeout(() => {
      currentlyDelaying = false;
      playThemeSong();
    }, delayThemeMS);

    delayThemeMS = 0;
    currentlyDelaying = true;
    return;
  }

  let coName = currentPlayer.coName;
  if (!coName) coName = "map-editor";

  // Don't randomize the victory and defeat themes
  let isEndTheme = coName === "victory" || coName === "defeat";
  if (musicPlayerSettings.randomThemes && !isEndTheme) {
    coName = musicPlayerSettings.currentRandomCO;
  }
  playMusicURL(getMusicURL(coName), startFromBeginning);
}

/**
 * Stops the current music if there's any playing.
 * Optionally, you can also delay the start of the next theme.
 * @param delayMS - Time to delay before we start the next theme.
 */
export function stopThemeSong(delayMS: number = 0) {
  // Delay the next theme if needed
  if (delayMS > 0) delayThemeMS = delayMS;

  // Can't stop if there's no loaded music
  if (!urlAudioMap.has(currentThemeKey)) return;

  // Can't stop if we are already paused
  let currentTheme = urlAudioMap.get(currentThemeKey);
  if (!currentTheme || currentTheme.paused) return;

  // The song hasn't finished loading, so stop it as soon as it does
  if (currentTheme.readyState !== HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
    currentTheme.addEventListener("canplaythrough", onAudioLoadPauseIt, { once: true });
    return;
  }

  // The song is loaded and playing, so pause it
  console.log("[AWBW Improved Music Player] Pausing: ", currentTheme.src);
  currentTheme.pause();
}

/**
 * Plays the movement sound of the given unit.
 * @param unitId - The ID of the unit who is moving.
 */
export function playMovementSound(unitId: number) {
  if (!musicPlayerSettings.isPlaying) return;

  // The audio hasn't been preloaded for this unit
  if (!unitIDAudioMap.has(unitId)) {
    let unitName = getUnitName(unitId);
    let movementSoundURL = getMovementSoundURL(unitName);
    unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
  }

  // Restart the audio and then play it
  let movementAudio = unitIDAudioMap.get(unitId);
  if (!movementAudio) return;
  movementAudio.currentTime = 0;
  movementAudio.loop = false;
  movementAudio.volume = musicPlayerSettings.sfxVolume;
  movementAudio.play();
}

/**
 * Stops the movement sound of a given unit if it's playing.
 * @param unitId - The ID of the unit whose movement sound will be stopped.
 * @param rolloff - (Optional) Whether to play the rolloff sound or not, defaults to true.
 */
export function stopMovementSound(unitId: number, rolloff = true) {
  // Can't stop if there's nothing playing
  if (!musicPlayerSettings.isPlaying) return;

  // Can't stop if the unit doesn't have any sounds
  if (!unitIDAudioMap.has(unitId)) return;

  // Can't stop if the sound is already stopped
  let movementAudio = unitIDAudioMap.get(unitId);
  if (!movementAudio || movementAudio.paused) return;

  // The audio hasn't finished loading, so pause when it does
  if (movementAudio.readyState != HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
    movementAudio.addEventListener("canplaythrough", onAudioLoadPauseIt, { once: true });
    return;
  }

  // The audio is loaded and playing, so pause it
  movementAudio.pause();
  movementAudio.currentTime = 0;

  // If unit has rolloff, play it
  if (!rolloff) return;
  let unitName = getUnitName(unitId);
  if (hasMovementRollOff(unitName)) {
    let audioURL = getMovementRollOffURL(unitName);
    playOneShotURL(audioURL, musicPlayerSettings.sfxVolume);
  }
}

/**
 * Plays the given sound effect.
 * @param sfx - Specific {@link GameSFX} to play.
 */
export function playSFX(sfx: GameSFX) {
  if (!musicPlayerSettings.isPlaying) return;

  let sfxURL = getSoundEffectURL(sfx);

  // Figure out which volume to use
  let vol = musicPlayerSettings.sfxVolume;
  if (sfx.startsWith("sfx-ui")) {
    vol = musicPlayerSettings.uiVolume;
  }

  // This sound effect hasn't been loaded yet
  if (!urlAudioMap.has(sfxURL)) {
    urlAudioMap.set(sfxURL, new Audio(sfxURL));
  }

  // The sound is loaded, so play it
  let audio = urlAudioMap.get(sfxURL);
  if (!audio) return;
  audio.volume = vol;
  audio.currentTime = 0;
  audio.play();
}

/**
 * Stops all music, sound effects, and audios.
 */
export function stopAllSounds() {
  // Stop music
  stopThemeSong();

  // Stop unit sounds
  for (let unitId of unitIDAudioMap.keys()) {
    stopMovementSound(unitId, false);
  }

  // Mute sound effects
  for (let audio of urlAudioMap.values()) {
    audio.volume = 0;
  }
}

/**
 * Preloads the current game COs' themes and common sound effect audios.
 * Run this first so we can start the player almost immediately!
 * @param afterPreloadFunction - Function to run after the audio is pre-loaded.
 */
export function preloadAllCommonAudio(afterPreloadFunction: () => void) {
  // Preload the themes of the COs in this match
  let coNames = getAllPlayingCONames();
  let audioList = new Set<string>();
  coNames.forEach((name) => audioList.add(getMusicURL(name)));

  // Preload the most common UI sounds that might play right after the page loads
  audioList.add(getSoundEffectURL(GameSFX.uiCursorMove));
  audioList.add(getSoundEffectURL(GameSFX.uiUnitSelect));

  // console.log("Preloading common");
  preloadAudios(audioList, afterPreloadFunction);
}

/**
 * Preloads the current game CO's themes for ALL game versions and ALL sound effect audios.
 * Run this after the common audios since we have more time to get things ready for these.
 * @param afterPreloadFunction - Function to run after the audio is pre-loaded.
 */
export function preloadAllExtraAudio(afterPreloadFunction: () => void) {
  if (getIsMapEditor()) return;

  // Preload ALL sound effects
  let audioList = getAllSoundEffectURLs();

  // We preload the themes for each game version
  let coNames = getAllPlayingCONames();
  for (const gameType in SettingsGameType) {
    for (const themeType in SettingsThemeType) {
      const gameTypeEnum = gameType as SettingsGameType;
      const themeTypeEnum = themeType as SettingsThemeType;
      coNames.forEach((name) => audioList.add(getMusicURL(name, gameTypeEnum, themeTypeEnum)));
    }
  }

  // console.log("Preloading extra");
  preloadAudios(audioList, afterPreloadFunction);
}

/**
 * Preloads the given list of songs and adds them to the {@link urlAudioMap}.
 * @param audioURLs - Set of URLs of songs to preload.
 * @param afterPreloadFunction - Function to call after all songs are preloaded.
 */
function preloadAudios(audioURLs: Set<string>, afterPreloadFunction = () => {}) {
  // console.log("preloadAudios", audioURLs);

  // Event handler for when an audio is loaded
  let numLoadedAudios = 0;
  let onAudioPreload = (event: Event) => {
    let audio = event.target as HTMLAudioElement;
    // console.log("onAudioLoad", event);

    // Update UI
    numLoadedAudios++;
    let loadPercentage = (numLoadedAudios / audioURLs.size) * 100;
    musicPlayerUI.setProgress(loadPercentage);

    // If the audio loaded properly, then add it to our map
    if (event.type !== "error") {
      urlAudioMap.set(audio.src, audio);
    } else {
      console.log("[AWBW Improved Music Player] Could not pre-load: ", audio.src);
    }

    // All the audio from the list has been loaded
    if (numLoadedAudios >= audioURLs.size) {
      numLoadedAudios = 0;
      if (afterPreloadFunction) afterPreloadFunction();
    }
  };

  // Pre-load all audios in the list
  audioURLs.forEach((url) => {
    // This audio has already been loaded before, so skip it
    if (urlAudioMap.has(url)) {
      // console.log("Skipping", url);
      numLoadedAudios++;
      return;
    }
    let audio = new Audio(url);
    audio.addEventListener("canplaythrough", onAudioPreload, { once: true });
    audio.addEventListener("error", onAudioPreload, { once: true });
  });
}

/**
 * Changes the current song to the given new song, stopping the old song if necessary.
 * @param srcURL - URL of song to play.
 * @param startFromBeginning - Whether to start from the beginning.
 */
function playMusicURL(srcURL: string, startFromBeginning: boolean = false) {
  if (!musicPlayerSettings.isPlaying) return;
  let previousSongURL = currentThemeKey;

  // We want to play a new song, so pause the previous one and mark it as the current song
  if (srcURL !== currentThemeKey) {
    stopThemeSong();
    currentThemeKey = srcURL;
  }

  // The song isn't preloaded
  if (!urlAudioMap.has(srcURL)) {
    let audio = new Audio(srcURL);
    urlAudioMap.set(srcURL, audio);

    let onAudioLoadPlayIfStillValid = (event: Event) => {
      let audio = event.target as HTMLAudioElement;
      audio.volume = musicPlayerSettings.volume;
      audio.loop = true;
      if (audio.src === currentThemeKey) audio.play();
    };
    audio.addEventListener("canplaythrough", onAudioLoadPlayIfStillValid, { once: true });
    return;
  }

  let nextTheme = urlAudioMap.get(srcURL);
  if (!nextTheme) return;

  // Restart the song if requested
  if (startFromBeginning) nextTheme.currentTime = 0;

  if (previousSongURL !== srcURL) {
    console.log("[AWBW Improved Music Player] Now Playing: ", srcURL);
  }

  // Play the song
  nextTheme.volume = musicPlayerSettings.volume;
  nextTheme.loop = true;
  nextTheme.play();
}

/**
 * Plays the given sound by creating a new instance of it.
 * @param srcURL - URL of the sound to play.
 * @param volume - Volume at which to play this sound.
 */
function playOneShotURL(srcURL: string, volume: number) {
  if (!musicPlayerSettings.isPlaying) return;

  let soundInstance = new Audio(srcURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
}

/**
 * Updates the internal audio components to match the current music player settings when the settings change.
 * @param _key - Key of the setting which has been changed.
 */
function onSettingsChange(key: string) {
  switch (key) {
    case "isPlaying":
      if (musicPlayerSettings.isPlaying) {
        playThemeSong();
      } else {
        stopAllSounds();
      }
      break;
    case "gameType":
    case "alternateThemeDay":
      setTimeout(() => playThemeSong(), 500);
      break;
    case "themeType":
      let restartMusic = musicPlayerSettings.themeType !== SettingsThemeType.REGULAR;
      playThemeSong(restartMusic);
      break;
    case "randomThemes":
      if (musicPlayerSettings.randomThemes) {
        console.log("[AWBW Improved Music Player] Pre-loading all themes since random themes are enabled");
        let audioList = getAllThemeURLs();
        preloadAudios(audioList, () => console.log("[AWBW Improved Music Player] All themes have been pre-loaded!"));
      }
      musicPlayerSettings.currentRandomCO = getRandomCO();
      playThemeSong();
      break;
    case "volume": {
      // Adjust the volume of the current theme
      let currentTheme = urlAudioMap.get(currentThemeKey);
      if (currentTheme) currentTheme.volume = musicPlayerSettings.volume;
      break;
    }
  }
}
