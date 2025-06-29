/**
 * @file Functions for playing, managing, and stopping any music tracks including CO themes.
 */
import { currentPlayer } from "../../shared/awbw_game";
import { getCurrentPageType, PageType } from "../../shared/awbw_page";
import { addDatabaseReplacementListener } from "../db";
import { addSettingsChangeListener, musicSettings, RandomThemeType, SettingsKey, ThemeType } from "../music_settings";
import {
  getCONameFromURL,
  getGameTypeFromURL,
  getMusicURL,
  getValidGameTypeForCO,
  hasIntroTheme,
  hasPreloopTheme,
  SpecialTheme,
} from "../resources";
import { SpecialCOs } from "../../shared/awbw_game";
import { logInfo, logDebug, logError, debounce } from "../utils";
import { audioIDMap, audioMap, getVolumeForURL } from "./core";
import { needsPreloading, preloadURL, promiseMap, urlQueue } from "./preloading";
import { stopAllMovementSounds } from "./unit_movement";
import { broadcastChannel } from "../iframe";
import { getMusicPlayerUI } from "../music_ui";

/**
 * The URL of the current theme that is playing.
 */
let currentThemeURL = "";

/**
 * Number of loops that the current theme has done.
 */
let currentLoops = 0;

/**
 * Map containing the URLs for themes that have intros. These get added after the original intro ends.
 * The keys are the intro theme URLs.
 * The values are the loop or preloop URLs to play after the intro ends.
 */
export const specialIntroMap = new Map<string, string>();

/**
 * Map containing the URLS for themes that have preloops. These get populated after the preloop ends.
 * The keys are the preloop theme URLs.
 * The values are the loop URLs to play after the preloop ends.
 */
export const specialPreloopMap = new Map<string, string>();

/**
 * If set to true, calls to playMusic() will set a timer after which the music will play again.
 */
let currentlyDelaying = false;

/** ID for timeout currently delaying the music player from playing */
let currentDelayTimeoutID = -1;

/**
 * Changes the current song to the given new song, stopping the old song if necessary.
 * @param srcURL - URL of song to play.
 * @param startFromBeginning - Whether to start from the beginning.
 */
export async function playMusicURL(srcURL: string) {
  // This song has an intro that finished playing
  const specialLoopURL = specialIntroMap.get(srcURL);
  if (specialLoopURL) {
    //if (srcURL.includes("-cop")) specialIntroMap.delete(srcURL);
    srcURL = specialLoopURL;
  }

  const preloopURL = specialPreloopMap.get(srcURL);
  if (preloopURL) {
    srcURL = preloopURL;
  }

  const sameSongRequest = srcURL === currentThemeURL;
  // We want to play a new song, so pause the previous one and save the new current song
  if (!sameSongRequest) {
    stopThemeSong();
    currentThemeURL = srcURL;
  }

  // Get the audio player for the song, or preload it if it's not loaded yet
  let nextSong = audioMap.get(srcURL);
  let preloaded = true;
  if (!nextSong) {
    preloaded = false;
    const useProgress = getMusicPlayerUI().visualProgress === 100;
    if (useProgress) getMusicPlayerUI().setProgress(0);
    nextSong = await preloadURL(srcURL);
    if (useProgress) getMusicPlayerUI().setProgress(100);
  }

  // Loop all themes except for the intros and preloops
  const dontLoop = srcURL.includes("-intro") || srcURL.includes("-preloop");
  nextSong.loop(!dontLoop);
  nextSong.volume(getVolumeForURL(srcURL));

  // Make sure the theme has the proper event handlers and that they only have one
  nextSong.off("play", null, null);
  nextSong.off("load", null, null);
  nextSong.off("end", null, null);
  nextSong.on("play", () => onThemePlay(nextSong, srcURL));
  nextSong.on("load", () => playThemeSong());
  nextSong.on("end", () => onThemeEndOrLoop(srcURL));

  // Play the song if it's not already playing
  if (!musicSettings.isPlaying) return;
  if (nextSong.playing()) return;

  if (!sameSongRequest) {
    logInfo("Now Playing: ", srcURL, " | Cached? =", nextSong._src !== srcURL, " | Preloaded? =", preloaded);
  }

  const newID = nextSong.play();
  if (!newID) return;
  audioIDMap.set(srcURL, newID);
}

/**
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 */
export function playThemeSong() {
  if (!musicSettings.isPlaying) return;

  // Someone wants us to delay playing the theme, so wait a little bit then play
  // Ignore all calls to play() while delaying, we are guaranteed to play eventually
  if (currentlyDelaying) return;

  let gameType = undefined;
  let coName = currentPlayer.coName;

  if (getCurrentPageType() === PageType.Maintenance) coName = SpecialCOs.Maintenance;
  else if (getCurrentPageType() === PageType.MapEditor) coName = SpecialCOs.MapEditor;
  else if (getCurrentPageType() === PageType.MainPage) coName = SpecialCOs.MainPage;
  else if (getCurrentPageType() === PageType.LiveQueue) coName = SpecialCOs.LiveQueue;
  else if (getCurrentPageType() === PageType.Default) coName = SpecialCOs.Default;

  // Don't randomize during victory and defeat themes
  const isEndTheme = coName === SpecialCOs.Victory || coName === SpecialCOs.Defeat || coName === SpecialCOs.COSelect;
  const isRandomTheme = musicSettings.randomThemesType !== RandomThemeType.NONE;
  if (isRandomTheme && !isEndTheme) {
    coName = musicSettings.currentRandomCO;

    // The user wants the random themes from all soundtracks, so randomize the game type
    if (musicSettings.randomThemesType === RandomThemeType.ALL_THEMES) gameType = musicSettings.currentRandomGameType;
  }

  // log("Playing theme for: ", coName, " | Game Type: ", gameType);

  // For pages with no COs that aren't using the random themes, play the stored theme if any.
  if (!coName) {
    if (!currentThemeURL || currentThemeURL === "") return;
    playMusicURL(currentThemeURL);
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
    if (currentlyDelaying) {
      clearTimeout(currentDelayTimeoutID);
    }
    currentlyDelaying = true;
    // Delay until I say so
    currentDelayTimeoutID = window.setTimeout(() => clearThemeDelay(), delayMS);
  }

  // Can't stop if there's no loaded music
  const currentTheme = audioMap.get(currentThemeURL);
  if (!currentTheme) return;

  // The song is loaded and playing, so pause it
  logDebug("Pausing: ", currentThemeURL);
  currentTheme.pause();
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
 * Event handler that gets called when a theme starts playing.
 * @param audio - The audio player that started playing.
 * @param srcURL - URL of the theme that started playing.
 */
export function onThemePlay(audio: Howl, srcURL: string) {
  currentLoops = 0;
  audio.volume(getVolumeForURL(srcURL));

  // Preload the normal looping song and any others if we still need to, this makes everything play seamlessly
  const coName = getCONameFromURL(srcURL);
  const requestedGameType = getGameTypeFromURL(srcURL);
  const loopURL = srcURL.replace("-intro", "").replace("-preloop", "");
  const introURL = loopURL.replace(".ogg", "-intro.ogg");
  const preloopURL = loopURL.replace(".ogg", "-preloop.ogg");
  const preloadURLs = [];
  if (needsPreloading(loopURL)) preloadURLs.push(loopURL);
  if (hasIntroTheme(coName, requestedGameType) && needsPreloading(introURL)) preloadURLs.push(introURL);
  if (hasPreloopTheme(coName, requestedGameType) && needsPreloading(preloopURL)) preloadURLs.push(preloopURL);

  // Progress bar for audio preloading
  const preloadPromises = preloadURLs.map((url) => preloadURL(url));
  const total = preloadURLs.length;
  let completed = 0;

  const useProgress = getMusicPlayerUI().visualProgress === 100;
  if (total > 0) {
    if (useProgress) getMusicPlayerUI().setProgress(0);

    for (const url of preloadURLs) {
      const p = preloadURL(url).finally(() => {
        if (!useProgress) return;
        completed++;
        const percent = Math.round((completed / total) * 100);
        getMusicPlayerUI().setProgress(percent);
      });

      preloadPromises.push(p);
    }

    // Optional: if you want to wait for all to finish before continuing
    Promise.allSettled(preloadPromises).then(() => {
      if (!useProgress) return;
      getMusicPlayerUI().setProgress(100);
    });
  }

  // Tell all other music players to pause
  broadcastChannel.postMessage("pause");

  // We start from the beginning if any of these conditions are met:
  // 1. The user wants to restart themes
  // 2. It's a power theme
  // 3. We are starting a new random theme
  // AND we are on the game page AND the song has played for a bit
  const isRandomTheme = musicSettings.randomThemesType !== RandomThemeType.NONE;
  const isPowerTheme = musicSettings.themeType !== ThemeType.REGULAR;
  // const isIntro = srcURL.includes("-intro");
  // const isPreloop = srcURL.includes("-preloop");
  const shouldRestart = musicSettings.restartThemes || isPowerTheme || isRandomTheme;
  const currentPosition = audio.seek() as number;
  const isGamePageActive = getCurrentPageType() === PageType.ActiveGame;
  if (shouldRestart && isGamePageActive && currentPosition > 0.1) {
    audio.seek(0);
  }

  // The current theme is not this one, so pause this one and let the other one play
  // This check makes sure we aren't playing more than one song at the same time
  if (currentThemeURL !== srcURL && audio.playing()) {
    audio.pause();
    playThemeSong();
  }

  // There are multiple instances of this sound playing so stop the extra ones
  const audioID = audioIDMap.get(srcURL);
  if (!audioID) return;
  for (const id of audio._getSoundIds()) {
    if (id !== audioID) audio.stop(id);
  }
}

/**
 * Event handler that gets called when a theme ends or loops.
 * @param srcURL - URL of the theme that ended or looped.
 */
export function onThemeEndOrLoop(srcURL: string) {
  currentLoops++;

  if (currentThemeURL !== srcURL) {
    //logDebug("Playing more than one theme at a time!", currentThemeURL, "!==", srcURL);
    return;
  }

  const coName = getCONameFromURL(srcURL);
  const gameType = getValidGameTypeForCO(coName, getGameTypeFromURL(srcURL));

  // The song has an intro, so mark it in the special intro map as having done the intro
  if (srcURL.includes("-intro")) {
    let loopURL;
    // Check if we should go into preloop or loop song
    if (hasPreloopTheme(coName, gameType)) {
      loopURL = srcURL.replace("-intro", "-preloop");
    } else {
      loopURL = srcURL.replace("-intro", "");
    }
    specialIntroMap.set(srcURL, loopURL);
    playThemeSong();
  }

  // The song has a preloop, so mark it in the map as having already been completed
  if (srcURL.includes("-preloop")) {
    const loopURL = srcURL.replace("-preloop", "");
    specialPreloopMap.set(srcURL, loopURL);
    playThemeSong();
  }

  // Always restart power intros (I think?)
  let hasIntro = false;
  specialIntroMap.values().forEach((val) => {
    if (val == srcURL) hasIntro = true;
  });

  if (hasIntro && srcURL.includes("-cop")) {
    specialIntroMap.delete(srcURL);
  }

  if (srcURL === SpecialTheme.Victory || srcURL === SpecialTheme.Defeat) {
    if (currentLoops >= 5) playMusicURL(SpecialTheme.COSelect);
  }

  // The song ended and we are playing random themes, so switch to the next random theme if
  // the user does not want to loop the current song until the turn changes
  if (musicSettings.randomThemesType !== RandomThemeType.NONE && !musicSettings.loopRandomSongsUntilTurnChange) {
    // This is an intro or preloop, don't randomize until we get to the actual theme
    if (srcURL.includes("-intro") || srcURL.includes("-preloop")) {
      return;
    }
    musicSettings.randomizeCO();
    playThemeSong();
  }
}

/**
 * Updates the internal audio components to match the current music player settings when the settings change.
 * @param key - Key of the setting which has been changed.
 * @param _value - New value of the setting.
 * @param isFirstLoad - Whether this is the first time the settings are being loaded.
 */
function onSettingsChange(key: SettingsKey, _value: unknown, isFirstLoad: boolean) {
  // Don't do anything if this is the first time the settings are being loaded
  if (isFirstLoad) return;

  switch (key) {
    case SettingsKey.ADD_OVERRIDE:
    case SettingsKey.REMOVE_OVERRIDE:
    case SettingsKey.OVERRIDE_LIST:
    case SettingsKey.CURRENT_RANDOM_CO:
    case SettingsKey.IS_PLAYING:
      return musicSettings.isPlaying ? playThemeSong() : stopAllSounds();

    case SettingsKey.GAME_TYPE:
    case SettingsKey.ALTERNATE_THEME_DAY:
    case SettingsKey.ALTERNATE_THEMES:
      return window.setTimeout(() => playThemeSong(), 500);

    case SettingsKey.THEME_TYPE:
      return playThemeSong();

    case SettingsKey.REMOVE_EXCLUDED:
      if (musicSettings.excludedRandomThemes.size === 27) musicSettings.randomizeCO();
      return playThemeSong();

    case SettingsKey.EXCLUDED_RANDOM_THEMES:
    case SettingsKey.ADD_EXCLUDED:
      if (musicSettings.excludedRandomThemes.has(musicSettings.currentRandomCO)) musicSettings.randomizeCO();
      return playThemeSong();

    case SettingsKey.RANDOM_THEMES_TYPE: {
      // Back to normal themes
      const randomThemes = musicSettings.randomThemesType !== RandomThemeType.NONE;
      if (!randomThemes) return playThemeSong();

      // We want a new random theme
      musicSettings.randomizeCO();
      playThemeSong();
      return;
    }

    case SettingsKey.VOLUME: {
      // Adjust the volume of the current theme
      const currentTheme = audioMap.get(currentThemeURL);
      if (currentTheme) currentTheme.volume(musicSettings.volume);
      // logDebug("Volume changed to: ", musicSettings.volume, currentTheme);

      // Adjust the volume once we can
      if (!currentTheme) {
        const intervalID = window.setInterval(() => {
          const currentTheme = audioMap.get(currentThemeURL);
          if (currentTheme) {
            currentTheme.volume(musicSettings.volume);
            window.clearInterval(intervalID);
          }
        });
      }

      // Adjust all theme volumes
      for (const srcURL of audioMap.keys()) {
        const audio = audioMap.get(srcURL);
        if (audio) audio.volume(getVolumeForURL(srcURL));
      }
      return;
    }
  }
}

export const restartTheme = debounce(300, __restartTheme, true);
function __restartTheme() {
  const currentTheme = audioMap.get(currentThemeURL);
  if (!currentTheme) return;

  currentTheme.seek(0);
}

export function clearThemeDelay() {
  currentlyDelaying = false;
  clearTimeout(currentDelayTimeoutID);
  playThemeSong();
}

/**
 * Adds listeners for settings changes and database updates.
 */
export function addThemeListeners() {
  // Listen for setting changes to update the internal variables accordingly
  addSettingsChangeListener(onSettingsChange);

  // Listens for when the database downloads a new song
  addDatabaseReplacementListener((url) => {
    const audio = audioMap.get(url);
    if (!audio) return;
    logInfo("A new version of", url, " is available. Replacing the old version.");

    // Pause the song while we switch to the new version
    if (audio.playing()) audio.stop();

    // Clear queues and promises when the database is updated. This allows us to re-load the audio.
    urlQueue.delete(url);
    promiseMap.delete(url);

    // Clear maps to prevent anyone else from using those audios
    audioMap.delete(url);
    audioIDMap.delete(url);

    preloadURL(url)
      .catch((reason) => logError(reason))
      .finally(() => playThemeSong());
  });
}
addThemeListeners();
