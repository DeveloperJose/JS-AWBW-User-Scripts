/**
 * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
 * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
 */

import { currentPlayer } from "../shared/awbw_game";
import { getRandomCO } from "../shared/awbw_globals";
import { logInfo, logDebug } from "./utils";

/**
 * Enum that represents which game we want the music player to use for its music.
 * @enum {string}
 */
export enum GameType {
  AW1 = "AW1",
  AW2 = "AW2",
  RBC = "RBC",
  DS = "DS",
}

/**
 * Enum that represents music theme types like regular or power.
 * @enum {string}
 */
export enum ThemeType {
  REGULAR = "REGULAR",
  CO_POWER = "CO_POWER",
  SUPER_CO_POWER = "SUPER_CO_POWER",
}

/**
 * Enum that represents different options for random themes.
 * @enum {string}
 */
export enum RandomThemeType {
  NONE = "NONE",
  ALL_THEMES = "ALL_THEMES",
  CURRENT_SOUNDTRACK = "CURRENT_SOUNDTRACK",
}

/**
 * Gets the theme type enum corresponding to the CO Power state for the current CO.
 * @returns - The SettingsThemeType enum for the current CO Power state.
 */
export function getCurrentThemeType() {
  const currentPowerState = currentPlayer?.coPowerState;
  if (currentPowerState === "Y") return ThemeType.CO_POWER;
  if (currentPowerState === "S") return ThemeType.SUPER_CO_POWER;

  return ThemeType.REGULAR;
}

/**
 * Gets a random game type from the SettingsGameType enum.
 * @returns - A random game type from the SettingsGameType enum.
 */
export function getRandomGameType(excludedGameTypes = new Set<GameType>()) {
  const gameTypes = Object.values(GameType).filter((gameType) => !excludedGameTypes.has(gameType));
  return gameTypes[Math.floor(Math.random() * gameTypes.length)];
}

/**
 * String used as the key for storing settings in LocalStorage
 * @constant
 */
const STORAGE_KEY = "musicPlayerSettings";

/**
 * Function signature for a listener function that will be called whenever a setting changes.
 */
type SettingsChangeListener = (key: SettingsKey, isFirstLoad: boolean) => void;

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
 * Enum that represents the keys for the music player settings.
 * @enum {number}
 */
export enum SettingsKey {
  IS_PLAYING,
  VOLUME,
  SFX_VOLUME,
  UI_VOLUME,
  GAME_TYPE,
  ALTERNATE_THEMES,
  ALTERNATE_THEME_DAY,
  RANDOM_THEMES_TYPE,
  CAPTURE_PROGRESS_SFX,
  PIPE_SEAM_SFX,
  OVERRIDE_LIST,
  RESTART_THEMES,
  AUTOPLAY_ON_OTHER_PAGES,
  EXCLUDED_RANDOM_THEMES,

  // Non-user configurable settings
  THEME_TYPE,
  CURRENT_RANDOM_CO,

  // Special keys that don't match specific variables
  ALL,
  ADD_OVERRIDE,
  REMOVE_OVERRIDE,
  ADD_EXCLUDED,
  REMOVE_EXCLUDED,
}

/**
 * The music player settings' current internal state.
 * DO NOT EDIT __ prefix variables, use the properties!
 */
export abstract class musicSettings {
  // User configurable settings
  private static __isPlaying = false;
  private static __volume = 0.5;
  private static __sfxVolume = 0.4;
  private static __uiVolume = 0.4;
  private static __gameType = GameType.DS;
  private static __alternateThemes = true;
  private static __alternateThemeDay = 15;
  private static __randomThemesType = RandomThemeType.NONE;
  private static __captureProgressSFX = true;
  private static __pipeSeamSFX = true;
  private static __overrideList = new Map<string, GameType>();
  private static __restartThemes = false;
  private static __autoplayOnOtherPages = true;
  private static __excludedRandomThemes = new Set<string>();

  // Non-user configurable settings
  private static __themeType = ThemeType.REGULAR;
  private static __currentRandomCO: string = "";
  private static __currentRandomGameType = GameType.DS;
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
      randomThemesType: this.__randomThemesType,
      captureProgressSFX: this.__captureProgressSFX,
      pipeSeamSFX: this.__pipeSeamSFX,
      overrideList: Array.from(this.__overrideList.entries()),
      restartThemes: this.__restartThemes,
      autoplayOnOtherPages: this.__autoplayOnOtherPages,
      excludedRandomThemes: Array.from(this.__excludedRandomThemes),
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
        if (key === "excludedRandomThemes") {
          this.__excludedRandomThemes = new Set(savedSettings[key]);
          continue;
        }
        // For all other settings, just set them with the setter function
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)[key] = savedSettings[key];
        // debug("Loading", key, "as", savedSettings[key]);
      }
    }
    this.__isLoaded = true;
  }

  static set isPlaying(val: boolean) {
    if (this.__isPlaying === val) return;
    this.__isPlaying = val;
    this.onSettingChangeEvent(SettingsKey.IS_PLAYING);
  }

  static get isPlaying() {
    return this.__isPlaying;
  }

  static set volume(val: number) {
    if (this.__volume === val) return;
    this.__volume = val;
    this.onSettingChangeEvent(SettingsKey.VOLUME);
  }

  static get volume() {
    return this.__volume;
  }

  static set sfxVolume(val: number) {
    if (this.__sfxVolume === val) return;
    this.__sfxVolume = val;
    this.onSettingChangeEvent(SettingsKey.SFX_VOLUME);
  }

  static get sfxVolume() {
    return this.__sfxVolume;
  }

  static set uiVolume(val: number) {
    if (this.__uiVolume === val) return;
    this.__uiVolume = val;
    this.onSettingChangeEvent(SettingsKey.UI_VOLUME);
  }

  static get uiVolume() {
    return this.__uiVolume;
  }

  static set gameType(val: GameType) {
    if (this.__gameType === val) return;
    this.__gameType = val;
    // The user wants this game type, so override whatever random game type we had before
    this.__currentRandomGameType = val;
    this.onSettingChangeEvent(SettingsKey.GAME_TYPE);
  }
  static get gameType() {
    return this.__gameType;
  }

  static set alternateThemes(val: boolean) {
    if (this.__alternateThemes === val) return;
    this.__alternateThemes = val;
    this.onSettingChangeEvent(SettingsKey.ALTERNATE_THEMES);
  }

  static get alternateThemes() {
    return this.__alternateThemes;
  }

  static set alternateThemeDay(val: number) {
    if (this.__alternateThemeDay === val) return;
    this.__alternateThemeDay = val;
    this.onSettingChangeEvent(SettingsKey.ALTERNATE_THEME_DAY);
  }

  static get alternateThemeDay() {
    return this.__alternateThemeDay;
  }

  static set captureProgressSFX(val: boolean) {
    // if (this.__captureProgressSFX === val) return;
    this.__captureProgressSFX = val;
    this.onSettingChangeEvent(SettingsKey.CAPTURE_PROGRESS_SFX);
  }

  static get captureProgressSFX() {
    return this.__captureProgressSFX;
  }

  static set pipeSeamSFX(val: boolean) {
    // if (this.__pipeSeamSFX === val) return;
    this.__pipeSeamSFX = val;
    this.onSettingChangeEvent(SettingsKey.PIPE_SEAM_SFX);
  }

  static get pipeSeamSFX() {
    return this.__pipeSeamSFX;
  }

  private static set overrideList(val: Map<string, GameType>) {
    this.__overrideList = new Map([...val.entries()].sort());
    this.onSettingChangeEvent(SettingsKey.OVERRIDE_LIST);
  }

  static get overrideList() {
    return this.__overrideList;
  }

  static addOverride(coName: string, gameType: GameType) {
    this.__overrideList.set(coName, gameType);
    this.__overrideList = new Map([...this.__overrideList.entries()].sort());
    this.onSettingChangeEvent(SettingsKey.ADD_OVERRIDE);
  }

  static removeOverride(coName: string) {
    this.__overrideList.delete(coName);
    this.__overrideList = new Map([...this.__overrideList.entries()].sort());
    this.onSettingChangeEvent(SettingsKey.REMOVE_OVERRIDE);
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
    this.onSettingChangeEvent(SettingsKey.RESTART_THEMES);
  }

  static get autoplayOnOtherPages() {
    return this.__autoplayOnOtherPages;
  }

  static set autoplayOnOtherPages(val: boolean) {
    if (this.__autoplayOnOtherPages === val) return;
    this.__autoplayOnOtherPages = val;
    this.onSettingChangeEvent(SettingsKey.AUTOPLAY_ON_OTHER_PAGES);
  }

  static get excludedRandomThemes() {
    return this.__excludedRandomThemes;
  }

  static set excludedRandomThemes(val: Set<string>) {
    this.__excludedRandomThemes = val;
    this.onSettingChangeEvent(SettingsKey.EXCLUDED_RANDOM_THEMES);
  }

  static addExcludedRandomTheme(theme: string) {
    this.__excludedRandomThemes.add(theme);
    this.onSettingChangeEvent(SettingsKey.ADD_EXCLUDED);
  }

  static removeExcludedRandomTheme(theme: string) {
    this.__excludedRandomThemes.delete(theme);
    this.onSettingChangeEvent(SettingsKey.REMOVE_EXCLUDED);
  }

  // ************* Non-user configurable settings from here on

  static set themeType(val: ThemeType) {
    if (this.__themeType === val) return;
    this.__themeType = val;
    this.onSettingChangeEvent(SettingsKey.THEME_TYPE);
  }

  static get themeType() {
    return this.__themeType;
  }

  static set randomThemesType(val: RandomThemeType) {
    if (this.__randomThemesType === val) return;
    this.__randomThemesType = val;
    this.onSettingChangeEvent(SettingsKey.RANDOM_THEMES_TYPE);
  }

  static get randomThemesType() {
    return this.__randomThemesType;
  }

  static get currentRandomCO() {
    if (!this.__currentRandomCO || this.__currentRandomCO == "") this.randomizeCO();
    return this.__currentRandomCO as string;
  }

  static randomizeCO() {
    const excludedCOs = new Set([...this.__excludedRandomThemes, this.__currentRandomCO]);
    this.__currentRandomCO = getRandomCO(excludedCOs);

    // Randomize soundtrack EXCEPT we don't allow AW1 during power themes
    const isPower = this.themeType !== ThemeType.REGULAR;
    const excludedSoundtracks = new Set<GameType>();
    if (isPower) excludedSoundtracks.add(GameType.AW1);
    this.__currentRandomGameType = getRandomGameType(excludedSoundtracks);

    this.onSettingChangeEvent(SettingsKey.CURRENT_RANDOM_CO);
  }

  static onSettingChangeEvent(key: SettingsKey) {
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
    logInfo("No saved settings found, storing defaults");
    storageData = updateSettingsInLocalStorage();
  }
  musicSettings.fromJSON(storageData);

  // Tell everyone we just loaded the settings
  onSettingsChangeListeners.forEach((fn) => fn(SettingsKey.ALL, true));
  logDebug("Settings loaded from storage:", storageData);
}

/**
 * Allows the music player settings to be saved in the local storage.
 */
export function allowSettingsToBeSaved() {
  // From now on, any setting changes will be saved and any listeners will be called
  addSettingsChangeListener(onSettingsChange);
}

function onSettingsChange(key: SettingsKey, _isFirstLoad: boolean) {
  // We can't save the non-configurable settings
  if (key === SettingsKey.THEME_TYPE || key === SettingsKey.CURRENT_RANDOM_CO) return "";

  // Save all settings otherwise
  updateSettingsInLocalStorage();
}

/**
 * Saves the current music player settings in the local storage.
 */
function updateSettingsInLocalStorage() {
  const jsonSettings = musicSettings.toJSON();
  localStorage.setItem(STORAGE_KEY, jsonSettings);
  logDebug("Saving settings...", jsonSettings);
  return jsonSettings;
}
