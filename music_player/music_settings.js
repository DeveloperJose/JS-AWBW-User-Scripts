/**
 * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
 * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
 */

import { currentPlayer } from "../shared/awbw_site";

/**
 * Enum that represents which game we want the music player to use for its music.
 * @readonly
 * @enum {string}
 */
export const GAME_TYPE = Object.freeze({
  AW1: "AW1",
  AW2: "AW2",
  AW_RBC: "AW_RBC",
  AW_DS: "AW_DS",
});

/**
 * Enum that represents music theme types like regular or power.
 * @readonly
 * @enum {string}
 */
export const THEME_TYPE = Object.freeze({
  REGULAR: "REGULAR",
  CO_POWER: "CO_POWER",
  SUPER_CO_POWER: "SUPER_CO_POWER",
});

/**
 * Map that takes a given coPowerState from a player and returns the appropriate theme type enum.
 */
const coPowerStateToThemeType = new Map([
  ["N", THEME_TYPE.REGULAR],
  ["Y", THEME_TYPE.CO_POWER],
  ["S", THEME_TYPE.SUPER_CO_POWER],
]);

/**
 * Gets the theme type enum corresponding to the CO Power state for the current CO.
 * @returns {THEME_TYPE} The THEME_TYPE enum for the current CO Power state.
 */
export function getCurrentThemeType() {
  let currentCOPowerState = currentPlayer.coPowerState;
  return coPowerStateToThemeType.get(currentCOPowerState);
}

/**
 * String used as the key for storing settings in LocalStorage
 */
const STORAGE_KEY = "musicPlayerSettings";

/**
 * List of listener functions that will be called anytime settings are changed.
 */
const onSettingsChangeListeners = [];

/**
 * Adds a new listener function that will be called whenever a setting changes.
 * @param {*} fn Function to call when a setting changes.
 */
export function addSettingsChangeListener(fn) {
  onSettingsChangeListeners.push(fn);
}

/**
 * The music player settings' current internal state.
 * DO NOT EDIT __ prefix variables, use the properties!
 */
export const musicPlayerSettings = {
  __isPlaying: false,
  __volume: 0.5,
  __sfxVolume: 0.35,
  __uiVolume: 0.425,
  __gameType: GAME_TYPE.AW_DS,

  set isPlaying(val) {
    this.__isPlaying = val;
    this.onSettingChangeEvent("isPlaying");
  },

  get isPlaying() {
    return this.__isPlaying;
  },

  set volume(val) {
    this.__volume = val;
    this.onSettingChangeEvent("volume");
  },

  get volume() {
    return this.__volume;
  },

  set sfxVolume(val) {
    this.__sfxVolume = val;
    this.onSettingChangeEvent("sfxVolume");
  },

  get sfxVolume() {
    return this.__sfxVolume;
  },

  set uiVolume(val) {
    this.__uiVolume = val;
    this.onSettingChangeEvent("uiVolume");
  },
  get uiVolume() {
    return this.__uiVolume;
  },

  set gameType(val) {
    /** @todo: Validate */
    this.__gameType = val;
    this.onSettingChangeEvent("gameType");
  },
  /**
   * @type {GAME_TYPE}
   */
  get gameType() {
    return this.__gameType;
  },

  onSettingChangeEvent(key) {
    onSettingsChangeListeners.forEach((fn) => fn(key));
  },
};

/**
 * Loads the music player settings stored in the local storage.
 */
export function loadSettingsFromLocalStorage() {
  let storageData = localStorage.getItem(STORAGE_KEY);

  // Store defaults if nothing is stored
  if (storageData === null) {
    updateSettingsInLocalStorage();
  }

  // Only keep and set settings that are in the current version
  // Only keep internal __vars
  let savedSettings = JSON.parse(storageData);
  for (let key in musicPlayerSettings) {
    if (Object.hasOwn(savedSettings, key) && key.startsWith("__")) {
      // Key without __ prefix
      let regularKey = key.substring(2);
      musicPlayerSettings[regularKey] = savedSettings[key];
    }
  }

  // From now on, any setting changes will be saved and any listeners will be called
  addSettingsChangeListener(updateSettingsInLocalStorage);
}

/**
 * Saves the current music player settings in the local storage.
 */
function updateSettingsInLocalStorage() {
  let jsonSettings = JSON.stringify(musicPlayerSettings);
  localStorage.setItem(STORAGE_KEY, jsonSettings);
}
