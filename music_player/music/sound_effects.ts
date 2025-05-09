/**
 * @file Functions for playing sound effects.
 */

import { musicSettings } from "../music_settings";
import { GameSFX, getSoundEffectURL } from "../resources";
import { audioMap, getVolumeForURL, audioIDMap } from "./core";
import { preloadURL } from "./preloading";

const currentPlayingSFX = new Map<GameSFX, Howl>();
const powerActivationSFX = new Set([
  GameSFX.powerActivateAllyCOP,
  GameSFX.powerActivateAllySCOP,
  GameSFX.powerActivateBHCOP,
  GameSFX.powerActivateBHSCOP,
  GameSFX.powerActivateAW1COP,
]);

/**
 * Plays the given sound effect.
 * @param sfx - Specific {@link GameSFX} to play.
 */
export async function playSFX(sfx: GameSFX) {
  if (!musicSettings.isPlaying) return;

  // Check the user settings to see if we should play this sound effect
  if (!musicSettings.captureProgressSFX && sfx === GameSFX.unitCaptureProgress) return;
  if (!musicSettings.pipeSeamSFX && sfx === GameSFX.unitAttackPipeSeam) return;

  // Clear up finished SFXs from list
  currentPlayingSFX.forEach((valAudio, valType) => {
    if (!valAudio.playing()) currentPlayingSFX.delete(valType);
  });

  // Don't play power available if we are activating a power
  if (sfx === GameSFX.powerCOPAvailable || sfx === GameSFX.powerSCOPAvailable) {
    let isActivatingPower = false;
    currentPlayingSFX.forEach((valAudio, valType) => {
      if (valAudio.playing() && powerActivationSFX.has(valType)) isActivatingPower = true;
    });
    if (isActivatingPower) return;
  }

  const sfxURL = getSoundEffectURL(sfx);

  // Get the sound if it's loaded, otherwise load it
  const audio = audioMap.get(sfxURL) ?? (await preloadURL(sfxURL));

  audio.volume(getVolumeForURL(sfxURL));
  audio.seek(0);

  // No need to start another instance if it's already playing
  if (audio.playing()) return;

  const newID = audio.play();

  if (!newID) return;
  audioIDMap.set(sfxURL, newID);
  currentPlayingSFX.set(sfx, audio);
  // audio.fade(0, musicSettings.sfxVolume, audio.duration() * 1000);
}

export function stopSFX(sfx: GameSFX) {
  if (!musicSettings.isPlaying) return;
  const sfxURL = getSoundEffectURL(sfx);
  const audio = audioMap.get(sfxURL);

  // Can't stop if it's not playing
  if (!audio || !audio.playing()) return;

  audio.stop();
}
