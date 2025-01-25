import { getUnitName } from "../../shared/awbw_game";
import { musicSettings } from "../music_settings";
import { getMovementSoundURL, hasMovementRollOff, getMovementRollOffURL } from "../resources";
import { logError } from "../utils";
import { playOneShotURL } from "./core";

/**
 * Map containing the audio players for all units.
 * The keys are the unit IDs.
 */
const unitIDAudioMap: Map<number, HTMLAudioElement> = new Map();

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
    if (!movementSoundURL) {
      logError("No movement sound for", unitName);
      return;
    }
    // logDebug("Creating new audio player for:", unitId, unitName, movementSoundURL);
    unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
  }

  // Restart the audio and then play it
  const movementAudio = unitIDAudioMap.get(unitId);
  if (!movementAudio) return;
  movementAudio.currentTime = 0;
  movementAudio.loop = false;
  movementAudio.volume = musicSettings.sfxVolume;
  movementAudio.play();
  // logDebug("Movement sound for", unitId, "is playing", movementAudio);
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
 * Stops all movement sounds of all units.
 */
export function stopAllMovementSounds() {
  for (const unitId of unitIDAudioMap.keys()) {
    stopMovementSound(unitId, false);
  }
}

/**
 * Event handler that pauses an audio as soon as it gets loaded.
 * @param event - The event that triggered this handler. Usually "canplaythrough".
 */
function whenAudioLoadsPauseIt(event: Event) {
  (event.target as HTMLAudioElement).pause();
}
