import { musicSettings } from "../music_settings";
import { GameSFX, getSoundEffectURL } from "../resources";
import { audioMap, getVolumeForURL, audioIDMap } from "./core";
import { preloadURL } from "./preloading";

/**
 * Plays the given sound effect.
 * @param sfx - Specific {@link GameSFX} to play.
 */
export async function playSFX(sfx: GameSFX) {
  if (!musicSettings.isPlaying) return;

  // Check the user settings to see if we should play this sound effect
  if (!musicSettings.captureProgressSFX && sfx === GameSFX.unitCaptureProgress) return;
  if (!musicSettings.pipeSeamSFX && sfx === GameSFX.unitAttackPipeSeam) return;

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
  // audio.fade(0, musicSettings.sfxVolume, audio.duration() * 1000);
}
