import { syncSettingsToUI } from "./settings_menu";
import { playMusic, stopMusic, syncSettingsToMusicPlayer } from "./music";

export const STORAGE_KEY = "musicPlayerSettings";

export const GAME_TYPE = Object.freeze({
  AW1: "aw1",
  AW2: "aw2",
  AWDS: "awds",
  AWRBC: "awrbc",
});

export const musicPlayerSettings = {
  __isPlaying: false,
  __volume: 0.5,
  __sfxVolume: 0.35,
  __uiVolume: 0.425,
  __gameType: GAME_TYPE.AWDS,

  // TODO: Shuffle
  // TODO: Alternate Themes
  // TODO: Powers

  set isPlaying(val) {
    this.__isPlaying = val;
    this.onSettingChangeEvent();

    if (this.__isPlaying) {
      playMusic();
    } else {
      stopMusic();
    }
  },

  get isPlaying() {
    return this.__isPlaying;
  },

  set volume(val) {
    this.__volume = val;
    this.onSettingChangeEvent();
  },

  get volume() {
    return this.__volume;
  },

  set sfxVolume(val) {
    this.__sfxVolume = val;
    this.onSettingChangeEvent();
  },

  get sfxVolume() {
    return this.__sfxVolume;
  },

  set uiVolume(val) {
    this.__uiVolume = val;
    this.onSettingChangeEvent();
  },
  get uiVolume() {
    return this.__uiVolume;
  },

  set gameType(val) {
    // TODO: Validate
    this.__gameType = val;
    this.onSettingChangeEvent();
  },
  get gameType() {
    return this.__gameType;
  },

  onSettingChangeEvent() {
    syncSettingsToMusicPlayer();
    syncSettingsToUI();
  },
};

/**
 * Loads the music player settings stored in the local storage.
 */
export function loadSettingsFromLocalStorage() {
  let storageData = localStorage.getItem(STORAGE_KEY);
  if (storageData != null) {
    let savedSettings = JSON.parse(storageData);

    // Only keep and set settings that are in the current version
    for (let key in musicPlayerSettings) {
      if (Object.hasOwn(savedSettings, key)) {
        musicPlayerSettings[key] = savedSettings[key];
      }
    }

    syncSettingsToMusicPlayer();
    syncSettingsToUI();
  }
  updateSettingsInLocalStorage();
}

/**
 * Saves the current music player settings in the local storage.
 */
function updateSettingsInLocalStorage() {
  debugger;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(musicPlayerSettings));
}
