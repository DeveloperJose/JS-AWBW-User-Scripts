/**
 * @file Functions for pre-loading audio files.
 */
import { logInfo } from "../utils";
import { loadMusicFromDB } from "../db";
import { musicPlayerUI } from "../music_ui";
import { getCurrentThemeURLs, getSoundEffectURL, GameSFX, getAllAudioURLs } from "../resources";
import { logError, logDebug } from "../utils";
import { audioMap, getVolumeForURL } from "./core";

/**
 * Set of URLs that are queued to be pre-loaded.
 * This is used to prevent pre-loading the same URL multiple times while waiting for promises.
 */
export const urlQueue = new Set<string>();

/**
 * Map containing the promises for all the audios that are currently being pre-loaded.
 * The keys are the URLs of the audios.
 */
export const promiseMap = new Map<string, Promise<Howl>>();

/**
 * Creates a new audio player for the given URL and stores it in the {@link audioMap}.
 * @param srcURL - URL of the audio to create a player for.
 * @returns - The new audio player.
 */
function createNewAudio(srcURL: string, cacheURL: string) {
  const audioInMap = audioMap.get(srcURL);
  if (audioInMap) {
    logError("Race Condition! Please report this bug!", srcURL);
    return audioInMap;
  }

  // Shared audio settings for all audio players
  const audio = new Howl({
    src: [cacheURL],
    format: ["ogg"],
    volume: getVolumeForURL(srcURL),
    // Redundant event listeners to ensure the audio is always at the correct volume
    onplay: (_id) => audio.volume(getVolumeForURL(srcURL)),
    onload: (_id) => audio.volume(getVolumeForURL(srcURL)),
    onseek: (_id) => audio.volume(getVolumeForURL(srcURL)),
    onpause: (_id) => audio.volume(getVolumeForURL(srcURL)),
    onloaderror: (_id, error) => logError("Error loading audio:", srcURL, error),
    onplayerror: (_id, error) => logError("Error playing audio:", srcURL, error),
  });
  audioMap.set(srcURL, audio);
  return audio;
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
      logInfo(`Could not pre-load: ${url}. This might not be a problem, the audio may still play normally later.`);
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

  if (numLoadedAudios >= audioURLs.size) {
    if (afterPreloadFunction) afterPreloadFunction();
  }
}

/**
 * Pre-loads the audio from the given URL and returns a promise that resolves with an audio player.
 * If the audio is not in the database, it will be loaded from the original URL.
 * @param srcURL - URL of the audio to preload.
 * @returns - Promise that resolves with the audio player of the audio in the database or the original URL.
 */
export async function preloadURL(srcURL: string) {
  // We already have this audio loaded
  const audio = audioMap.get(srcURL);
  if (audio) return audio;

  // Someone is trying to preload this audio, so we'll wait for it to finish
  if (urlQueue.has(srcURL)) {
    const storedPromise = promiseMap.get(srcURL);
    if (!storedPromise) return Promise.reject(`No promise found for ${srcURL}, please report this bug!`);
    return storedPromise;
  }
  urlQueue.add(srcURL);

  // Preload the audio from the database if possible
  const promise = loadMusicFromDB(srcURL).then(
    (localCacheURL: string) => createNewAudio(srcURL, localCacheURL),
    (reason) => {
      logDebug(reason, srcURL);
      return createNewAudio(srcURL, srcURL);
    },
  );
  promiseMap.set(srcURL, promise);
  return promise;
}
