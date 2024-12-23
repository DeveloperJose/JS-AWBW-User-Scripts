/**
 * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
 * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
 */

import { currentPlayer } from "../shared/awbw_game";

/**
 * Enum that represents which game we want the music player to use for its music.
 * @enum {string}
 */
export enum SettingsGameType {
  AW1 = "AW1",
  AW2 = "AW2",
  AW_RBC = "AW_RBC",
  AW_DS = "AW_DS",
}

/**
 * Enum that represents music theme types like regular or power.
 * @enum {string}
 */
export enum SettingsThemeType {
  REGULAR = "REGULAR",
  CO_POWER = "CO_POWER",
  SUPER_CO_POWER = "SUPER_CO_POWER",
}

/**
 * Gets the theme type enum corresponding to the CO Power state for the current CO.
 * @returns {SettingsThemeType} The SettingsThemeType enum for the current CO Power state.
 */
export function getCurrentThemeType() {
  let currentPowerState = currentPlayer.coPowerState;
  if (currentPowerState === "Y") return SettingsThemeType.CO_POWER;
  if (currentPowerState === "S") return SettingsThemeType.SUPER_CO_POWER;

  return SettingsThemeType.REGULAR;
}

/**
 * String used as the key for storing settings in LocalStorage
 * @constant
 */
const STORAGE_KEY = "musicPlayerSettings";

/**
 * List of listener functions that will be called anytime settings are changed.
 */
const onSettingsChangeListeners: ((key: string) => void)[] = [];

/**
 * Adds a new listener function that will be called whenever a setting changes.
 * @param {(string) => void} fn - The function to call when a setting changes.
 */
export function addSettingsChangeListener(fn: (key: string) => void) {
  onSettingsChangeListeners.push(fn);
}

/**
 * The music player settings' current internal state.
 * DO NOT EDIT __ prefix variables, use the properties!
 */
export abstract class musicPlayerSettings {
  private static __isPlaying = false;
  private static __volume = 0.5;
  private static __sfxVolume = 0.35;
  private static __uiVolume = 0.425;
  private static __gameType = SettingsGameType.AW_DS;

  static set(key: any, value: any) {
    if (key in this) {
      (this as any)[key] = value;
    }
  }

  static set isPlaying(val: boolean) {
    this.__isPlaying = val;
    this.onSettingChangeEvent("isPlaying");
  }

  static get isPlaying() {
    return this.__isPlaying;
  }

  static set volume(val: number) {
    this.__volume = val;
    this.onSettingChangeEvent("volume");
  }

  static get volume() {
    return this.__volume;
  }

  static set sfxVolume(val: number) {
    this.__sfxVolume = val;
    this.onSettingChangeEvent("sfxVolume");
  }

  static get sfxVolume() {
    return this.__sfxVolume;
  }

  static set uiVolume(val: number) {
    this.__uiVolume = val;
    this.onSettingChangeEvent("uiVolume");
  }

  static get uiVolume() {
    return this.__uiVolume;
  }

  static set gameType(val: SettingsGameType) {
    this.__gameType = val;
    this.onSettingChangeEvent("gameType");
  }
  static get gameType() {
    return this.__gameType;
  }

  static onSettingChangeEvent(key: string) {
    onSettingsChangeListeners.forEach((fn) => fn(key));
  }
}

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
      musicPlayerSettings.set(regularKey, savedSettings[key]);
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
