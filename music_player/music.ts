/**
 * @file All the music-related functions for the music player.
 */

// Type definitions for Howler
// Until howler gets modernized (https://github.com/goldfire/howler.js/pull/1518)
import Howl from "../howler/howl";

import { getUnitName, currentPlayer } from "../shared/awbw_game";
import {
  getMusicURL,
  getMovementSoundURL,
  getMovementRollOffURL,
  hasMovementRollOff,
  getSoundEffectURL,
  GameSFX,
  hasSpecialLoop,
  getCurrentThemeURLs,
  getAllAudioURLs,
  SpecialTheme,
} from "./resources";
import { musicSettings, addSettingsChangeListener, SettingsThemeType } from "./music_settings";
import { getRandomCO } from "../shared/awbw_globals";

import { isGamePageAndActive } from "../shared/awbw_page";
import { musicPlayerUI } from "./music_ui";
import { loadMusicFromDB } from "./db";
import { logError, log, logDebug } from "./utils";

/**
 * The URL of the current theme that is playing.
 */
let currentThemeKey = "";

/**
 * Map containing the audio players for all themes and SFX.
 * The keys are the audio URLs.
 */
const audioMap: Map<string, Howl> = new Map();

/**
 * Set of URLs that are queued to be pre-loaded.
 * This is used to prevent pre-loading the same URL multiple times while waiting for promises.
 */
const urlQueue = new Set<string>();

/**
 * Map containing the audio players for all units.
 * The keys are the unit IDs.
 */
const unitIDAudioMap: Map<number, HTMLAudioElement> = new Map();

/**
 * Map containing the special loop URLs for themes that have them. These get added after the original theme ends.
 * The keys are the original theme URLs.
 * The values are the special loop URLs to play after the original theme ends.
 */
const specialLoopMap = new Map<string, string>();

/**
 * Number of loops that the current theme has done.
 */
let currentLoops = 0;

/**
 * If set to true, calls to playMusic() will set a timer for {@link delayThemeMS} milliseconds after which the music will play again.
 */
let currentlyDelaying = false;

// Listen for setting changes to update the internal variables accordingly
addSettingsChangeListener(onSettingsChange);

/**
 * Event handler that pauses an audio as soon as it gets loaded.
 * @param event - The event that triggered this handler. Usually "canplaythrough".
 */
function whenAudioLoadsPauseIt(event: Event) {
  (event.target as HTMLAudioElement).pause();
}

/**
 * Event handler that gets called when a theme ends or loops.
 * @param srcURL - URL of the theme that ended or looped.
 */
function onThemeEndOrLoop(srcURL: string) {
  currentLoops++;

  if (currentThemeKey !== srcURL) {
    logError("Playing more than one theme at a time! Please report this bug!", srcURL);
    return;
  }

  // The song has a special loop, so mark it in the special loop map as having done one loop
  if (hasSpecialLoop(srcURL)) {
    const loopURL = srcURL.replace(".ogg", "-loop.ogg");
    specialLoopMap.set(srcURL, loopURL);
    playThemeSong();
  }

  if (srcURL === SpecialTheme.Victory || srcURL === SpecialTheme.Defeat) {
    if (currentLoops >= 5) playMusicURL(SpecialTheme.COSelect);
  }

  // The song ended and we are playing random themes, so switch to the next random theme
  if (musicSettings.randomThemes) {
    musicSettings.currentRandomCO = getRandomCO();
    playThemeSong();
  }
}

/**
 * Event handler that gets called when a theme starts playing.
 * @param audio - The audio player that started playing.
 * @param srcURL - URL of the theme that started playing.
 */
function onThemePlay(audio: Howl, srcURL: string) {
  currentLoops = 0;
  audio.volume(getVolumeForURL(srcURL));

  // We start from the beginning if any of these conditions are met:
  // 1. The user wants to restart themes
  // 2. It's a power theme
  // 3. We are starting a new random theme
  // AND we are on the game page AND the song has played for a bit
  const isPowerTheme = musicSettings.themeType !== SettingsThemeType.REGULAR;
  const shouldRestart = musicSettings.restartThemes || isPowerTheme || musicSettings.randomThemes;
  const currentPosition = audio.seek() as number;
  if (shouldRestart && isGamePageAndActive() && currentPosition > 0.1) {
    // logDebug("Restart2", shouldRestart, currentPosition);
    audio.seek(0);
  }

  // The current theme is not this one, so pause this one and let the other one play
  // This check makes sure we aren't playing more than one song at the same time
  if (currentThemeKey !== srcURL && audio.playing()) {
    audio.pause();
    playThemeSong();
  }
}

/**
 * Pre-loads the audio from the given URL and returns a promise that resolves with an audio player.
 * If the audio is not in the database, it will be loaded from the original URL.
 * @param srcURL - URL of the audio to preload.
 * @returns - Promise that resolves with the audio player of the audio in the database or the original URL.
 */
function preloadURL(srcURL: string) {
  // Someone already tried to preload this audio
  if (urlQueue.has(srcURL)) return Promise.reject(`Cannot preload ${srcURL}, it is already queued for preloading.`);
  urlQueue.add(srcURL);

  // We already have this audio loaded
  if (audioMap.has(srcURL)) return Promise.reject(`Cannot preload ${srcURL}, it is already preloaded.`);

  // Preload the audio from the database if possible
  // logDebug("Loading new song", srcURL);
  return loadMusicFromDB(srcURL).then(
    (localCacheURL: string) => createNewAudio(srcURL, localCacheURL),
    (reason: string) => {
      logDebug(reason, srcURL);
      return createNewAudio(srcURL, srcURL);
    },
  );

  /**
   * Creates a new audio player for the given URL.
   * @param srcURL - URL of the audio to create a player for.
   * @returns - The new audio player.
   */
  function createNewAudio(srcURL: string, cacheURL: string) {
    const audioInMap = audioMap.get(srcURL);
    if (audioInMap !== undefined) {
      logError("Race Condition! Please report this bug!", srcURL);
      return audioInMap;
    }

    // logDebug("Creating new audio player for:", srcURL, cacheURL);

    // Shared audio settings for all audio players
    const audio = new Howl({
      src: [cacheURL],
      format: ["ogg"],
      onloaderror: (_id, error) => logError("Error loading audio:", srcURL, error),
      onplayerror: (_id, error) => logError("Error playing audio:", srcURL, error),
    });
    audioMap.set(srcURL, audio);

    // Sound Effects
    if (srcURL.includes("sfx")) {
      audio.volume(srcURL.includes("ui") ? musicSettings.uiVolume : musicSettings.sfxVolume);
      return audio;
    }

    // Themes
    audio.volume(getVolumeForURL(srcURL));
    audio.on("play", () => onThemePlay(audio, srcURL));
    audio.on("load", () => playThemeSong());
    audio.on("end", () => onThemeEndOrLoop(srcURL));

    return audio;
  }
}

/**
 * Changes the current song to the given new song, stopping the old song if necessary.
 * @param srcURL - URL of song to play.
 * @param startFromBeginning - Whether to start from the beginning.
 */
export function playMusicURL(srcURL: string) {
  // This song has a special loop, and it's time to play it
  const specialLoopURL = specialLoopMap.get(srcURL);
  if (specialLoopURL) srcURL = specialLoopURL;

  // We want to play a new song, so pause the previous one and save the new current song
  if (srcURL !== currentThemeKey) {
    stopThemeSong();
    currentThemeKey = srcURL;
  }

  // The song isn't loaded yet, so create a new audio player for it
  if (!audioMap.has(srcURL)) {
    // No one else is preloading this audio, so preload it
    if (!urlQueue.has(srcURL)) preloadURL(srcURL).catch((reason) => logError(reason));
    return;
  }

  const nextSong = audioMap.get(srcURL);
  if (!nextSong) return;

  // Loop all themes except for the special ones
  nextSong.loop(!hasSpecialLoop(srcURL));
  nextSong.volume(getVolumeForURL(srcURL));

  // Play the song if it's not already playing
  if (!nextSong.playing() && musicSettings.isPlaying) {
    log("Now Playing: ", srcURL, " | Cached? =", nextSong._src !== srcURL);
    nextSong.play();
  }
}

/**
 * Plays the given sound by creating a new instance of it.
 * @param srcURL - URL of the sound to play.
 * @param volume - Volume at which to play this sound.
 */
function playOneShotURL(srcURL: string, volume: number) {
  if (!musicSettings.isPlaying) return;

  const soundInstance = new Audio(srcURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
}

/**
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 * @param startFromBeginning - Whether to start the song from the beginning or resume from the previous spot.
 */
export function playThemeSong() {
  if (!musicSettings.isPlaying) return;

  // Someone wants us to delay playing the theme, so wait a little bit then play
  // Ignore all calls to play() while delaying, we are guaranteed to play eventually
  if (currentlyDelaying) return;

  let gameType = undefined;
  let coName = currentPlayer.coName;

  // Don't randomize the victory and defeat themes
  const isEndTheme = coName === "victory" || coName === "defeat";
  if (musicSettings.randomThemes && !isEndTheme) {
    coName = musicSettings.currentRandomCO;
    gameType = musicSettings.currentRandomGameType;
  }

  if (!coName) {
    if (!currentThemeKey || currentThemeKey === "") return;
    playMusicURL(currentThemeKey);
    return;
  }

  playMusicURL(getMusicURL(coName, gameType));
}

/**
 * Stops the current music if there's any playing.
 * Optionally, you can also delay the start of the next theme.
 * @param delayMS - Time to delay before we start the next theme.
 */
export function stopThemeSong(delayMS: number = 0) {
  // Delay the next theme if needed
  if (delayMS > 0) {
    // Delay until I say so
    setTimeout(() => {
      currentlyDelaying = false;
      playThemeSong();
    }, delayMS);

    currentlyDelaying = true;
  }

  // Can't stop if there's no loaded music
  if (!audioMap.has(currentThemeKey)) return;

  // Can't stop if we are already paused
  const currentTheme = audioMap.get(currentThemeKey);
  if (!currentTheme) return;

  // The song is loaded and playing, so pause it
  logDebug("Pausing: ", currentThemeKey);
  currentTheme.pause();
}

/**
 * Plays the movement sound of the given unit.
 * @param unitId - The ID of the unit who is moving.
 */
export function playMovementSound(unitId: number) {
  if (!musicSettings.isPlaying) return;

  // The audio hasn't been preloaded for this unit
  if (!unitIDAudioMap.has(unitId)) {
    const unitName = getUnitName(unitId);
    if (!unitName) return;
    const movementSoundURL = getMovementSoundURL(unitName);
    unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
  }

  // Restart the audio and then play it
  const movementAudio = unitIDAudioMap.get(unitId);
  if (!movementAudio) return;
  movementAudio.currentTime = 0;
  movementAudio.loop = false;
  movementAudio.volume = musicSettings.sfxVolume;
  movementAudio.play();
}

/**
 * Stops the movement sound of a given unit if it's playing.
 * @param unitId - The ID of the unit whose movement sound will be stopped.
 * @param rolloff - (Optional) Whether to play the rolloff sound or not, defaults to true.
 */
export function stopMovementSound(unitId: number, rolloff = true) {
  // Can't stop if there's nothing playing
  if (!musicSettings.isPlaying) return;

  // Can't stop if the unit doesn't have any sounds
  if (!unitIDAudioMap.has(unitId)) return;

  // Can't stop if the sound is already stopped
  const movementAudio = unitIDAudioMap.get(unitId);
  if (!movementAudio || movementAudio.paused) return;

  // The audio hasn't finished loading, so pause when it does
  if (movementAudio.readyState != HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
    movementAudio.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
    return;
  }

  // The audio is loaded and playing, so pause it
  movementAudio.pause();
  movementAudio.currentTime = 0;

  // If unit has rolloff, play it
  const unitName = getUnitName(unitId);
  if (!rolloff || !unitName) return;

  if (hasMovementRollOff(unitName)) {
    const audioURL = getMovementRollOffURL(unitName);
    playOneShotURL(audioURL, musicSettings.sfxVolume);
  }
}

/**
 * Plays the given sound effect.
 * @param sfx - Specific {@link GameSFX} to play.
 */
export function playSFX(sfx: GameSFX) {
  if (!musicSettings.isPlaying) return;

  // Check the user settings to see if we should play this sound effect
  if (!musicSettings.captureProgressSFX && sfx === GameSFX.unitCaptureProgress) return;
  if (!musicSettings.pipeSeamSFX && sfx === GameSFX.unitAttackPipeSeam) return;

  const sfxURL = getSoundEffectURL(sfx);

  // This sound effect hasn't been loaded yet
  if (!audioMap.has(sfxURL)) {
    preloadURL(sfxURL)
      .then(() => playSFX(sfx))
      .catch((reason) => logError(reason));
    return;
  }

  // The sound is loaded, so play it
  const audio = audioMap.get(sfxURL);
  if (!audio) return;
  audio.volume(getVolumeForURL(sfxURL));
  audio.seek(0);
  audio.play();
}

/**
 * Stops all music, sound effects, and audios.
 */
export function stopAllSounds() {
  // Stop current music
  stopThemeSong();

  // Stop unit sounds
  stopAllMovementSounds();

  // Stop all other music, just for redundancy
  for (const audio of audioMap.values()) {
    if (audio.playing()) audio.pause();
  }
}

/**
 * Stops all movement sounds of all units.
 */
export function stopAllMovementSounds() {
  for (const unitId of unitIDAudioMap.keys()) {
    stopMovementSound(unitId, false);
  }
}

/**
 * Preloads the current game COs' themes and common sound effect audios.
 * Run this first so we can start the player almost immediately!
 * @param afterPreloadFunction - Function to run after the audio is pre-loaded.
 */
export function preloadAllCommonAudio(afterPreloadFunction: () => void) {
  // Preload the themes of the COs in this match
  const audioList = getCurrentThemeURLs();

  // Preload the most common UI sounds that might play right after the page loads
  audioList.add(getSoundEffectURL(GameSFX.uiCursorMove));
  audioList.add(getSoundEffectURL(GameSFX.uiUnitSelect));

  logDebug("Pre-loading common audio", audioList);
  preloadAudioList(audioList, afterPreloadFunction);
}

/**
 * Preloads all the audio that the music player will need.
 * Run this after the common audios since we have more time to get things ready for these.
 * @param afterPreloadFunction - Function to run after the audio is pre-loaded.
 */
export function preloadAllAudio(afterPreloadFunction: () => void) {
  const audioList = getAllAudioURLs();
  logDebug("Pre-loading extra audio", audioList);
  preloadAudioList(audioList, afterPreloadFunction);
}

/**
 * Preloads the given list of songs and adds them to the {@link urlAudioMap}.
 * @param audioURLs - Set of URLs of songs to preload.
 * @param afterPreloadFunction - Function to call after all songs are preloaded.
 */
function preloadAudioList(audioURLs: Set<string>, afterPreloadFunction = () => {}) {
  // Event handler for when an audio is loaded
  let numLoadedAudios = 0;
  const onAudioPreload = (action: string, url: string) => {
    numLoadedAudios++;

    // Update UI
    const loadPercentage = (numLoadedAudios / audioURLs.size) * 100;
    musicPlayerUI.setProgress(loadPercentage);

    // All the audio from the list has been loaded
    if (numLoadedAudios >= audioURLs.size) {
      numLoadedAudios = 0;
      if (afterPreloadFunction) afterPreloadFunction();
    }

    if (action === "error") {
      log(`Could not pre-load: ${url}. This might not be a problem, the audio may still play normally later.`);
      audioMap.delete(url);
      return;
    }

    // TODO: Debugging purposes
    // if (hasSpecialLoop(audio.src)) audio.currentTime = audio.duration * 0.94;

    if (!audioMap.has(url)) {
      logError("Race condition on pre-load! Please report this bug!", url);
    }
  };

  // Pre-load all audios in the list
  audioURLs.forEach((url) => {
    // This audio has already been loaded before, so skip it
    if (audioMap.has(url)) {
      numLoadedAudios++;
      return;
    }

    // Try to get the audio from the cache, if not, load it from the original URL
    preloadURL(url)
      .then((audio) => {
        audio.once("load", () => onAudioPreload("load", url));
        audio.once("loaderror", () => onAudioPreload("error", url));
      })
      .catch((_reason) => onAudioPreload("error", url));
  });
}

/**
 * Gets the volume for the given URL based on the type of audio it is.
 * @param url - URL of the audio to get the volume for.
 * @returns - The volume to play the audio at.
 */
function getVolumeForURL(url: string) {
  if (url.includes("sfx")) {
    if (url.includes("ui")) return musicSettings.uiVolume;
    if (url.includes("power")) return musicSettings.volume;
    return musicSettings.sfxVolume;
  }
  return musicSettings.volume;
}

/**
 * Adds event listeners to play or pause the music when the window focus changes.
 */
export function playOrPauseWhenWindowFocusChanges() {
  window.addEventListener("blur", () => {
    if (musicSettings.isPlaying) stopAllSounds();
  });
  window.addEventListener("focus", () => {
    if (musicSettings.isPlaying) playThemeSong();
  });
}

/**
 * Updates the internal audio components to match the current music player settings when the settings change.
 * @param key - Key of the setting which has been changed.
 * @param isFirstLoad - Whether this is the first time the settings are being loaded.
 */
function onSettingsChange(key: string, isFirstLoad: boolean) {
  // Don't do anything if this is the first time the settings are being loaded
  if (isFirstLoad) return;

  switch (key) {
    case "addOverride":
    case "removeOverride":
    case "overrideList":
    case "currentRandomCO":
    case "isPlaying":
      // case "restartThemes":
      if (musicSettings.isPlaying) {
        playThemeSong();
      } else {
        stopAllSounds();
      }
      break;
    case "gameType":
    case "alternateThemeDay":
    case "alternateThemes":
      setTimeout(() => playThemeSong(), 500);
      break;
    case "themeType": {
      // const restartMusic = musicSettings.themeType !== SettingsThemeType.REGULAR;
      playThemeSong();
      break;
    }
    case "randomThemes":
      // Back to normal themes
      if (!musicSettings.randomThemes) {
        playThemeSong();
        return;
      }

      // We want a new random theme
      musicSettings.currentRandomCO = getRandomCO();
      playThemeSong();
      break;
    case "volume": {
      // Adjust the volume of the current theme
      const currentTheme = audioMap.get(currentThemeKey);
      if (currentTheme) currentTheme.volume(musicSettings.volume);

      // Adjust the volume once we can
      if (!currentTheme) {
        const intervalID = window.setInterval(() => {
          const currentTheme = audioMap.get(currentThemeKey);
          if (currentTheme) {
            currentTheme.volume(musicSettings.volume);
            clearInterval(intervalID);
          }
        });
      }

      // Adjust all theme volumes
      for (const audio of audioMap.values()) {
        audio.volume(getVolumeForURL(audio._src as string));
      }
      break;
    }
  }
}
