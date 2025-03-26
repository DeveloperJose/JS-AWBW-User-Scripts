/**
 * @file Core functions and variables for playing audio.
 */

import { musicSettings } from "../music_settings";
import { logError } from "../utils";

// TODO: DEBUGGING
// window.setInterval(() => {
//   for (const key of audioMap.keys()) {
//     const audio = audioMap.get(key);
//     if (!audio) continue;
//     const count = audio._getSoundIds().length;
//     if (count > 1) {
//       const playingCount = audio._getSoundIds().filter((id) => audio.playing(id)).length;
//       if (playingCount > 1) logDebug("Multiple instances of", key, count, playingCount);
//     }
//   }
// }, 500);

/**
 * Map containing the audio players for all themes and SFX.
 * The keys are the audio URLs.
 */
export const audioMap: Map<string, Howl> = new Map();

/**
 * Map containing the Howler Sound IDs for all themes and SFX.
 * The keys are the audio URLs. The values are the Sound IDs.
 * This is used to stop extra instances of the same audio from playing.
 */
export const audioIDMap: Map<string, number> = new Map();

/**
 * Plays the given sound by creating a new instance of it.
 * @param srcURL - URL of the sound to play.
 * @param volume - Volume at which to play this sound.
 */
export function playOneShotURL(srcURL: string, volume: number) {
  if (!musicSettings.isPlaying) return;

  const soundInstance = new Audio(srcURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
}

/**
 * Gets the volume for the given URL based on the type of audio it is.
 * @param url - URL of the audio to get the volume for.
 * @returns - The volume to play the audio at.
 */
export function getVolumeForURL(url: string) {
  if (url.startsWith("blob:") || !url.startsWith("https://")) {
    logError("Blob URL when trying to get volume for", url);
    return musicSettings.volume;
  }

  if (url.includes("sfx")) {
    if (url.includes("ui")) return musicSettings.uiVolume;
    if (url.includes("power") && !url.includes("available")) return musicSettings.volume;
    return musicSettings.sfxVolume;
  }
  return musicSettings.volume;
}
