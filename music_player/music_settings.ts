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
  RBC = "RBC",
  DS = "DS",
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
  let currentPowerState = currentPlayer?.coPowerState;
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
  // User configurable settings
  private static __isPlaying = false;
  private static __volume = 0.5;
  private static __sfxVolume = 0.35;
  private static __uiVolume = 0.425;
  private static __gameType = SettingsGameType.DS;
  private static __alternateThemeDay = 5;

  // Non-user configurable settings
  private static __themeType = SettingsThemeType.REGULAR;

  static toJSON() {
    return JSON.stringify({
      isPlaying: this.__isPlaying,
      volume: this.__volume,
      sfxVolume: this.__sfxVolume,
      uiVolume: this.__uiVolume,
      gameType: this.__gameType,
      alternateThemeDay: this.__alternateThemeDay,
    });
  }

  static fromJSON(json: string) {
    // Only keep and set settings that are in the current version of musicPlayerSettings
    let savedSettings = JSON.parse(json);
    for (let key in this) {
      key = key.substring(2); // Remove the __ prefix
      if (Object.hasOwn(savedSettings, key)) {
        (this as any)[key] = savedSettings[key];
        // console.log("Loading", key, "as", savedSettings[key]);
      }
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
    if (val === this.__volume) return;
    this.__volume = val;
    this.onSettingChangeEvent("volume");
  }

  static get volume() {
    return this.__volume;
  }

  static set sfxVolume(val: number) {
    if (val === this.__sfxVolume) return;
    this.__sfxVolume = val;
    this.onSettingChangeEvent("sfxVolume");
  }

  static get sfxVolume() {
    return this.__sfxVolume;
  }

  static set uiVolume(val: number) {
    if (val === this.__uiVolume) return;
    this.__uiVolume = val;
    this.onSettingChangeEvent("uiVolume");
  }

  static get uiVolume() {
    return this.__uiVolume;
  }

  static set gameType(val: SettingsGameType) {
    if (val === this.__gameType) return;
    this.__gameType = val;
    this.onSettingChangeEvent("gameType");
  }
  static get gameType() {
    return this.__gameType;
  }

  static set themeType(val: SettingsThemeType) {
    if (val === this.__themeType) return;
    this.__themeType = val;
    this.onSettingChangeEvent("themeType");
  }

  static get themeType() {
    return this.__themeType;
  }

  static set alternateThemeDay(val: number) {
    if (val === this.__alternateThemeDay) return;
    this.__alternateThemeDay = val;
    this.onSettingChangeEvent("alternateThemeDay");
  }

  static get alternateThemeDay() {
    return this.__alternateThemeDay;
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

  // Store defaults if nothing or undefined is stored
  if (!storageData || storageData === "undefined") {
    // console.log("No settings found, storing defaults");
    storageData = updateSettingsInLocalStorage();
  }

  // console.log("Loading settings", storageData);
  musicPlayerSettings.fromJSON(storageData);

  // From now on, any setting changes will be saved and any listeners will be called
  addSettingsChangeListener(updateSettingsInLocalStorage);
}

/**
 * Saves the current music player settings in the local storage.
 */
function updateSettingsInLocalStorage() {
  let jsonSettings = musicPlayerSettings.toJSON();
  localStorage.setItem(STORAGE_KEY, jsonSettings);
  // console.log("Saving settings...", jsonSettings);
  return jsonSettings;
}
