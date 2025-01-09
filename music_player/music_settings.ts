/**
 * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
 * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
 */

import { currentPlayer } from "../shared/awbw_game";
import { getRandomCO } from "../shared/awbw_globals";

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
 * @returns - The SettingsThemeType enum for the current CO Power state.
 */
export function getCurrentThemeType() {
  const currentPowerState = currentPlayer?.coPowerState;
  if (currentPowerState === "Y") return SettingsThemeType.CO_POWER;
  if (currentPowerState === "S") return SettingsThemeType.SUPER_CO_POWER;

  return SettingsThemeType.REGULAR;
}

/**
 * Gets a random game type from the SettingsGameType enum.
 * @returns - A random game type from the SettingsGameType enum.
 */
export function getRandomGameType() {
  return Object.values(SettingsGameType)[Math.floor(Math.random() * Object.keys(SettingsGameType).length)];
}

/**
 * String used as the key for storing settings in LocalStorage
 * @constant
 */
const STORAGE_KEY = "musicPlayerSettings";

/**
 * Function signature for a listener function that will be called whenever a setting changes.
 */
type SettingsChangeListener = (key: string, isFirstLoad: boolean) => void;

/**
 * List of listener functions that will be called anytime settings are changed.
 */
const onSettingsChangeListeners: SettingsChangeListener[] = [];

/**
 * Adds a new listener function that will be called whenever a setting changes.
 * @param fn - The function to call when a setting changes.
 */
export function addSettingsChangeListener(fn: SettingsChangeListener) {
  onSettingsChangeListeners.push(fn);
}

/**
 * The music player settings' current internal state.
 * DO NOT EDIT __ prefix variables, use the properties!
 */
export abstract class musicSettings {
  // User configurable settings
  private static __isPlaying = false;
  private static __volume = 0.5;
  private static __sfxVolume = 0.5;
  private static __uiVolume = 0.5;
  private static __gameType = SettingsGameType.DS;
  private static __alternateThemes = true;
  private static __alternateThemeDay = 15;
  private static __randomThemes = false;
  private static __captureProgressSFX = true;
  private static __pipeSeamSFX = true;
  private static __overrideList = new Map<string, SettingsGameType>();
  private static __restartThemes = false;

  // Non-user configurable settings
  private static __themeType = SettingsThemeType.REGULAR;
  private static __currentRandomCO = getRandomCO();
  private static __currentRandomGameType = SettingsGameType.DS;
  private static __isLoaded = false;

  static toJSON() {
    return JSON.stringify({
      isPlaying: this.__isPlaying,
      volume: this.__volume,
      sfxVolume: this.__sfxVolume,
      uiVolume: this.__uiVolume,
      gameType: this.__gameType,
      alternateThemes: this.__alternateThemes,
      alternateThemeDay: this.__alternateThemeDay,
      randomThemes: this.__randomThemes,
      captureProgressSFX: this.__captureProgressSFX,
      pipeSeamSFX: this.__pipeSeamSFX,
      overrideList: Array.from(this.__overrideList.entries()),
      restartThemes: this.__restartThemes,
    });
  }

  static fromJSON(json: string) {
    // Only keep and set settings that are in the current version of musicPlayerSettings
    const savedSettings = JSON.parse(json);
    for (let key in this) {
      key = key.substring(2); // Remove the __ prefix
      if (Object.hasOwn(savedSettings, key)) {
        // Special case for the overrideList, it's a Map
        if (key === "overrideList") {
          this.__overrideList = new Map(savedSettings[key]);
          continue;
        }
        // For all other settings, just set them with the setter function
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[key] = savedSettings[key];
        // console.debug("[MP] Loading", key, "as", savedSettings[key]);
      }
    }
    this.__isLoaded = true;
  }

  static set isPlaying(val: boolean) {
    if (this.__isPlaying === val) return;
    this.__isPlaying = val;
    this.onSettingChangeEvent("isPlaying");
  }

  static get isPlaying() {
    return this.__isPlaying;
  }

  static set volume(val: number) {
    if (this.__volume === val) return;
    this.__volume = val;
    this.onSettingChangeEvent("volume");
  }

  static get volume() {
    return this.__volume;
  }

  static set sfxVolume(val: number) {
    if (this.__sfxVolume === val) return;
    this.__sfxVolume = val;
    this.onSettingChangeEvent("sfxVolume");
  }

  static get sfxVolume() {
    return this.__sfxVolume;
  }

  static set uiVolume(val: number) {
    if (this.__uiVolume === val) return;
    this.__uiVolume = val;
    this.onSettingChangeEvent("uiVolume");
  }

  static get uiVolume() {
    return this.__uiVolume;
  }

  static set gameType(val: SettingsGameType) {
    if (this.__gameType === val) return;
    this.__gameType = val;
    // The user wants this game type, so override whatever random game type we had before
    this.__currentRandomGameType = val;
    this.onSettingChangeEvent("gameType");
  }
  static get gameType() {
    return this.__gameType;
  }

  static set alternateThemes(val: boolean) {
    if (this.__alternateThemes === val) return;
    this.__alternateThemes = val;
    this.onSettingChangeEvent("alternateThemes");
  }

  static get alternateThemes() {
    return this.__alternateThemes;
  }

  static set alternateThemeDay(val: number) {
    if (this.__alternateThemeDay === val) return;
    this.__alternateThemeDay = val;
    this.onSettingChangeEvent("alternateThemeDay");
  }

  static get alternateThemeDay() {
    return this.__alternateThemeDay;
  }

  static set captureProgressSFX(val: boolean) {
    // if (this.__captureProgressSFX === val) return;
    this.__captureProgressSFX = val;
    this.onSettingChangeEvent("captureProgressSFX");
  }

  static get captureProgressSFX() {
    return this.__captureProgressSFX;
  }

  static set pipeSeamSFX(val: boolean) {
    // if (this.__pipeSeamSFX === val) return;
    this.__pipeSeamSFX = val;
    this.onSettingChangeEvent("pipeSeamSFX");
  }

  static get pipeSeamSFX() {
    return this.__pipeSeamSFX;
  }

  private static set overrideList(val: Map<string, SettingsGameType>) {
    this.__overrideList = new Map([...val.entries()].sort());
    this.onSettingChangeEvent("overrideList");
  }

  static get overrideList() {
    return this.__overrideList;
  }

  static addOverride(coName: string, gameType: SettingsGameType) {
    this.__overrideList.set(coName, gameType);
    this.__overrideList = new Map([...this.__overrideList.entries()].sort());
    this.onSettingChangeEvent("addOverride");
  }

  static removeOverride(coName: string) {
    this.__overrideList.delete(coName);
    this.__overrideList = new Map([...this.__overrideList.entries()].sort());
    this.onSettingChangeEvent("removeOverride");
  }

  static getOverride(coName: string) {
    return this.__overrideList.get(coName);
  }

  static get restartThemes() {
    return this.__restartThemes;
  }

  static set restartThemes(val: boolean) {
    if (this.__restartThemes === val) return;
    this.__restartThemes = val;
    this.onSettingChangeEvent("restartThemes");
  }

  // ************* Non-user configurable settings from here on

  static set themeType(val: SettingsThemeType) {
    if (this.__themeType === val) return;
    this.__themeType = val;
    this.onSettingChangeEvent("themeType");
  }

  static get themeType() {
    return this.__themeType;
  }

  static set randomThemes(val: boolean) {
    if (this.__randomThemes === val) return;
    this.__randomThemes = val;
    this.onSettingChangeEvent("randomThemes");
  }

  static get randomThemes() {
    return this.__randomThemes;
  }

  static get currentRandomCO() {
    return this.__currentRandomCO;
  }

  static set currentRandomCO(val: string) {
    // Make sure we don't get the same CO twice in a row
    while (this.__currentRandomCO === val) {
      val = getRandomCO();
    }
    this.__currentRandomCO = val;
    this.__currentRandomGameType = getRandomGameType();
    this.onSettingChangeEvent("currentRandomCO");
  }

  static onSettingChangeEvent(key: string) {
    onSettingsChangeListeners.forEach((fn) => fn(key, !this.__isLoaded));
  }

  static get currentRandomGameType() {
    return this.__currentRandomGameType;
  }
}

/**
 * Loads the music player settings stored in the local storage.
 */
export function loadSettingsFromLocalStorage() {
  let storageData = localStorage.getItem(STORAGE_KEY);

  // Store defaults if nothing or undefined is stored
  if (!storageData || storageData === "undefined") {
    console.log("[AWBW Music Player] No saved settings found, storing defaults");
    storageData = updateSettingsInLocalStorage();
  }
  musicSettings.fromJSON(storageData);

  // Tell everyone we just loaded the settings
  onSettingsChangeListeners.forEach((fn) => fn("all", true));

  // From now on, any setting changes will be saved and any listeners will be called
  addSettingsChangeListener(onSettingsChange);
  console.debug("[Music Player] Settings loaded from storage:", storageData);
}

function onSettingsChange(_key: string, _isFirstLoad: boolean) {
  // We can't save the non-configurable settings
  if (_key === "themeType" || _key === "currentRandomCO") return "";

  // Save all settings otherwise
  updateSettingsInLocalStorage();
}

/**
 * Saves the current music player settings in the local storage.
 */
function updateSettingsInLocalStorage() {
  const jsonSettings = musicSettings.toJSON();
  localStorage.setItem(STORAGE_KEY, jsonSettings);
  console.debug("[Music Player] Saving settings...", jsonSettings);
  return jsonSettings;
}
