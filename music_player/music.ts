import { getAllPlayingCONames, getUnitName, currentPlayer } from "../shared/awbw_game";
import { musicPlayerUI } from "./music_ui";
import {
  getMusicURL,
  getMovementSoundURL,
  getMovementRollOffURL,
  hasMovementRollOff,
  getSoundEffectURL,
  getAllSoundEffectURLs,
  GameSFX,
  getAllThemeURLs,
  getCurrentThemeURLs,
  getCONameFromURL,
  hasSpecialLoop,
  getAllCurrentThemesExtraAudioURLs,
} from "./resources";
import {
  musicPlayerSettings,
  addSettingsChangeListener,
  SettingsGameType,
  SettingsThemeType,
  getCurrentThemeType,
} from "./music_settings";
import { getAllCONames, getRandomCO } from "../shared/awbw_globals";
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
 * Map containing the special loop URLs for themes that have them. These get added after the original theme ends.
 * The keys are the original theme URLs.
 * The values are the special loop URLs to play after the original theme ends.
 */
const specialLoopMap = new Map<string, string>();

/**
 * If set to true, calls to playMusic() will set a timer for {@link delayThemeMS} milliseconds after which the music will play again.
 */
let currentlyDelaying = false;

/**
 * Timeout ID for the timer that switches the current theme when it ends for a new random one.
 */
let randomThemeTimeout: number | null;

function setRandomThemeTimeout(nextTheme: HTMLAudioElement) {
  if (!nextTheme.duration) {
    console.error("[AWBW Music Player] Duration is 0, can't set timeout! Please report this bug!", nextTheme);
    return;
  }

  // Clear the previous timeout if it exists
  if (randomThemeTimeout) clearTimeout(randomThemeTimeout);

  // Set a new timeout for the next theme
  const songDurationMS = nextTheme.duration * 1000;
  randomThemeTimeout = setTimeout(() => {
    musicPlayerSettings.currentRandomCO = getRandomCO();
    randomThemeTimeout = null;
    playThemeSong(true);
  }, songDurationMS);
}

/**
 * Event handler that pauses an audio as soon as it gets loaded.
 * @param event - The event that triggered this handler. Usually "canplaythrough".
 */
function whenAudioLoadsPauseIt(event: Event) {
  (event.target as HTMLAudioElement).pause();
}

/**
 * Event handler that plays an audio as soon as it gets loaded.
 * Only plays the audio if it's the current theme.
 * @param event - The event that triggered this handler. Usually "canplaythrough".
 */
function whenAudioLoadsPlayIt(event: Event) {
  let audio = event.target as HTMLAudioElement;
  audio.volume = musicPlayerSettings.volume;
  // if (audio.src === currentThemeKey) audio.play();
  playThemeSong();
}

function createNewThemeAudio(srcURL: string) {
  let audio = new Audio(srcURL);
  if (hasSpecialLoop(srcURL)) {
    audio.loop = false;
    audio.addEventListener("ended", (event) => {
      const loopURL = srcURL.replace(".ogg", "-loop.ogg");
      specialLoopMap.set(srcURL, loopURL);
      playThemeSong();
    });
  }
  if (urlAudioMap.has(srcURL)) {
    console.error("[AWBW Music Player] Race Condition! Please report this bug!", srcURL);
  }
  urlAudioMap.set(srcURL, audio);
  return audio;
}

// Listen for setting changes to update the internal variables accordingly
addSettingsChangeListener(onSettingsChange);

/**
 * Changes the current song to the given new song, stopping the old song if necessary.
 * @param srcURL - URL of song to play.
 * @param startFromBeginning - Whether to start from the beginning.
 */
export function playMusicURL(srcURL: string, startFromBeginning: boolean = false) {
  if (!musicPlayerSettings.isPlaying) return;

  // This song has a special loop, and it's time to play it
  let specialLoopURL = specialLoopMap.get(srcURL);
  if (specialLoopURL) srcURL = specialLoopURL;

  // We want to play a new song, so pause the previous one and save the new current song
  if (srcURL !== currentThemeKey) {
    stopThemeSong();
    currentThemeKey = srcURL;
    console.log("[AWBW Music Player] Now Playing: ", srcURL);
  }

  // The song isn't preloaded or invalid, load it and play it when it loads
  let nextSong = urlAudioMap.get(srcURL);
  if (!nextSong) {
    console.debug("[AWBW Music Player] Loading new song", srcURL);
    let audio = createNewThemeAudio(srcURL);
    audio.addEventListener("canplaythrough", whenAudioLoadsPlayIt, { once: true });
    return;
  }

  // Restart the song if requested
  if (startFromBeginning) nextSong.currentTime = 0;

  // Loop all themes except for the special ones
  nextSong.loop = !hasSpecialLoop(srcURL);

  // Play the song.
  nextSong.volume = musicPlayerSettings.volume;
  nextSong.play();

  // We aren't playing random themes, and if we are, we are already waiting for the next song to start
  if (!musicPlayerSettings.randomThemes || randomThemeTimeout) return;

  // We are playing random themes, and there is no timer to switch to the next song yet so set one if possible
  if (nextSong.duration > 0) {
    setRandomThemeTimeout(nextSong);
    return;
  }

  // Duration isn't loaded yet, so wait until it is to set the timeout
  const eventType = "loadedmetadata";
  nextSong.addEventListener(eventType, (e) => setRandomThemeTimeout(e.target as HTMLAudioElement), { once: true });
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
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 * @param startFromBeginning - Whether to start the song from the beginning or resume from the previous spot.
 */
export function playThemeSong(startFromBeginning = false) {
  if (!musicPlayerSettings.isPlaying) return;

  // Someone wants us to delay playing the theme, so wait a little bit then play
  // Ignore all calls to play() while delaying, we are guaranteed to play eventually
  if (currentlyDelaying) return;

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
  if (delayMS > 0) {
    // Delay until I say so
    setTimeout(() => {
      currentlyDelaying = false;
      playThemeSong();
    }, delayMS);

    currentlyDelaying = true;
  }

  // Clear the timeout that switches random songs
  if (randomThemeTimeout) {
    clearTimeout(randomThemeTimeout);
    randomThemeTimeout = null;
  }

  // Can't stop if there's no loaded music
  if (!urlAudioMap.has(currentThemeKey)) return;

  // Can't stop if we are already paused
  let currentTheme = urlAudioMap.get(currentThemeKey);
  if (!currentTheme || currentTheme.paused) return;
  console.debug("[AWBW Music Player] Pausing: ", currentTheme.src);

  // The song hasn't finished loading, so stop it as soon as it does
  if (currentTheme.readyState !== HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
    currentTheme.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
    return;
  }

  // The song is loaded and playing, so pause it
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
    movementAudio.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
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

  // Check the user settings to see if we should play this sound effect
  if (!musicPlayerSettings.captureProgressSFX && sfx === GameSFX.unitCaptureProgress) return;
  if (!musicPlayerSettings.pipeSeamSFX && sfx === GameSFX.unitAttackPipeSeam) return;

  let sfxURL = getSoundEffectURL(sfx);

  // Figure out which volume to use
  let vol = musicPlayerSettings.sfxVolume;

  if (sfx.startsWith("ui")) {
    vol = musicPlayerSettings.uiVolume;
  } else if (sfx.startsWith("power")) {
    vol = musicPlayerSettings.volume;
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
  stopAllMovementSounds();

  // Mute sound effects
  for (let audio of urlAudioMap.values()) {
    audio.volume = 0;
  }
}

/**
 * Stops all movement sounds of all units.
 */
export function stopAllMovementSounds() {
  for (let unitId of unitIDAudioMap.keys()) {
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
  let audioList = getCurrentThemeURLs();

  // Preload the most common UI sounds that might play right after the page loads
  audioList.add(getSoundEffectURL(GameSFX.uiCursorMove));
  audioList.add(getSoundEffectURL(GameSFX.uiUnitSelect));

  preloadAudios(audioList, afterPreloadFunction);
  console.debug("[AWBW Music Player] Pre-loading common audio", audioList);
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

  // Preload all the current COs themes for all game versions
  audioList = new Set([...audioList, ...getAllCurrentThemesExtraAudioURLs()]);

  console.debug("[AWBW Music Player] Pre-loading extra audio", audioList);
  preloadAudios(audioList, afterPreloadFunction);
}

/**
 * Preloads the given list of songs and adds them to the {@link urlAudioMap}.
 * @param audioURLs - Set of URLs of songs to preload.
 * @param afterPreloadFunction - Function to call after all songs are preloaded.
 */
function preloadAudios(audioURLs: Set<string>, afterPreloadFunction = () => {}) {
  // Event handler for when an audio is loaded
  let numLoadedAudios = 0;
  let onAudioPreload = (event: Event) => {
    let audio = event.target as HTMLAudioElement;
    numLoadedAudios++;

    // Update UI
    let loadPercentage = (numLoadedAudios / audioURLs.size) * 100;
    musicPlayerUI.setProgress(loadPercentage);

    // All the audio from the list has been loaded
    if (numLoadedAudios >= audioURLs.size) {
      numLoadedAudios = 0;
      if (afterPreloadFunction) afterPreloadFunction();
    }

    if (event.type === "error") {
      let msg = `[AWBW Music Player] Could not pre-load: ${audio.src}, code=${audio.networkState}.`;
      msg += "(This might not be a problem, the music and sound effects may still play normally.)";
      console.error(msg);
      urlAudioMap.delete(audio.src);
      return;
    }

    // TODO: Debugging purposes
    // if (hasSpecialLoop(audio.src)) audio.currentTime = audio.duration * 0.94;

    if (!urlAudioMap.has(audio.src)) {
      console.error("[AWBW Music Player] Race condition on pre-load! Please report this bug!", audio.src);
    }
  };

  // Pre-load all audios in the list
  audioURLs.forEach((url) => {
    // This audio has already been loaded before, so skip it
    if (urlAudioMap.has(url)) {
      numLoadedAudios++;
      return;
    }
    let audio = createNewThemeAudio(url);
    audio.addEventListener("canplaythrough", onAudioPreload, { once: true });
    audio.addEventListener("error", onAudioPreload, { once: true });
  });
}

let allThemesPreloaded = false;
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
      // Back to normal themes
      if (!musicPlayerSettings.randomThemes) {
        playThemeSong();
        return;
      }

      // We want a new random theme
      musicPlayerSettings.currentRandomCO = getRandomCO();
      playThemeSong(true);

      // Preload all themes if we are going to play random themes
      // TODO:
      // if (!allThemesPreloaded) {
      //   console.log("[AWBW Music Player] Pre-loading all themes since random themes are enabled");
      //   let audioList = getAllThemeURLs();
      //   allThemesPreloaded = true;
      //   preloadAudios(audioList, () => console.log("[AWBW Music Player] All themes have been pre-loaded!"));
      // }
      break;
    case "volume": {
      // Adjust the volume of the current theme
      let currentTheme = urlAudioMap.get(currentThemeKey);
      if (currentTheme) currentTheme.volume = musicPlayerSettings.volume;
      break;
    }
  }
}
