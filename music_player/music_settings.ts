/**
 * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
 * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
 */

import { currentPlayer } from "../shared/awbw_game";
import { getRandomCO } from "../shared/awbw_globals";
import { broadcastChannel } from "./iframe";
import { logInfo, logDebug, debounce, logError } from "./utils";

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
type SettingsChangeListener = (key: SettingsKey, value: unknown, isFirstLoad: boolean) => void;

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
  IS_PLAYING = "isPlaying",
  VOLUME = "volume",
  SFX_VOLUME = "sfxVolume",
  UI_VOLUME = "uiVolume",
  GAME_TYPE = "gameType",
  ALTERNATE_THEMES = "alternateThemes",
  ALTERNATE_THEME_DAY = "alternateThemeDay",
  RANDOM_THEMES_TYPE = "randomThemesType",
  CAPTURE_PROGRESS_SFX = "captureProgressSFX",
  PIPE_SEAM_SFX = "pipeSeamSFX",
  OVERRIDE_LIST = "overrideList",
  RESTART_THEMES = "restartThemes",
  AUTOPLAY_ON_OTHER_PAGES = "autoplayOnOtherPages",
  EXCLUDED_RANDOM_THEMES = "excludedRandomThemes",
  LOOP_RANDOM_SONGS_UNTIL_TURN_CHANGE = "loopRandomSongsUntilTurnChange",
  SFX_ON_OTHER_PAGES = "sfxOnOtherPages",
  SEAMLESS_LOOPS_IN_MIRRORS = "seamlessLoopsInMirrors",

  // Non-user configurable settings
  THEME_TYPE = "themeType",
  CURRENT_RANDOM_CO = "currentRandomCO",

  // Special keys that don't match specific variables
  ALL = "all",
  ADD_OVERRIDE = "addOverride",
  REMOVE_OVERRIDE = "removeOverride",
  ADD_EXCLUDED = "addExcluded",
  REMOVE_EXCLUDED = "removeExcluded",
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
  private static __loopRandomSongsUntilTurnChange = false;
  private static __sfxOnOtherPages = true;
  private static __seamlessLoopsInMirrors = true;

  // Non-user configurable settings
  private static __themeType = ThemeType.REGULAR;
  private static __currentRandomCO: string = "";
  private static __currentRandomGameType = GameType.DS;
  public static isLoaded = false;
  public static saveChanges = false;

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
      loopRandomSongsUntilTurnChange: this.__loopRandomSongsUntilTurnChange,
      sfxOnOtherPages: this.__sfxOnOtherPages,
      seamlessLoopsInMirrors: this.__seamlessLoopsInMirrors,
    });
  }

  static runWithoutSavingSettings(fn: () => void) {
    this.isLoaded = false;
    this.saveChanges = false;
    fn();
    this.isLoaded = true;
    this.saveChanges = true;
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
      else {
        logDebug("Tried to load an invalid settings key:", key);
      }
    }
    this.isLoaded = true;
    broadcastChannel.addEventListener("message", onStorageBroadcast);
  }

  static set isPlaying(val: boolean) {
    if (this.__isPlaying === val) return;
    this.__isPlaying = val;
    this.onSettingChangeEvent(SettingsKey.IS_PLAYING, val);
  }

  static get isPlaying() {
    return this.__isPlaying;
  }

  static set volume(val: number) {
    if (this.__volume === val) return;
    this.__volume = val;
    this.onSettingChangeEvent(SettingsKey.VOLUME, val);
  }

  static get volume() {
    return this.__volume;
  }

  static set sfxVolume(val: number) {
    if (this.__sfxVolume === val) return;
    this.__sfxVolume = val;
    this.onSettingChangeEvent(SettingsKey.SFX_VOLUME, val);
  }

  static get sfxVolume() {
    return this.__sfxVolume;
  }

  static set uiVolume(val: number) {
    if (this.__uiVolume === val) return;
    this.__uiVolume = val;
    this.onSettingChangeEvent(SettingsKey.UI_VOLUME, val);
  }

  static get uiVolume() {
    return this.__uiVolume;
  }

  static set gameType(val: GameType) {
    if (this.__gameType === val) return;
    this.__gameType = val;
    // The user wants this game type, so override whatever random game type we had before
    this.__currentRandomGameType = val;
    this.onSettingChangeEvent(SettingsKey.GAME_TYPE, val);
  }
  static get gameType() {
    return this.__gameType;
  }

  static set alternateThemes(val: boolean) {
    if (this.__alternateThemes === val) return;
    this.__alternateThemes = val;
    this.onSettingChangeEvent(SettingsKey.ALTERNATE_THEMES, val);
  }

  static get alternateThemes() {
    return this.__alternateThemes;
  }

  static set alternateThemeDay(val: number) {
    if (this.__alternateThemeDay === val) return;
    this.__alternateThemeDay = val;
    this.onSettingChangeEvent(SettingsKey.ALTERNATE_THEME_DAY, val);
  }

  static get alternateThemeDay() {
    return this.__alternateThemeDay;
  }

  static set captureProgressSFX(val: boolean) {
    // if (this.__captureProgressSFX === val) return;
    this.__captureProgressSFX = val;
    this.onSettingChangeEvent(SettingsKey.CAPTURE_PROGRESS_SFX, val);
  }

  static get captureProgressSFX() {
    return this.__captureProgressSFX;
  }

  static set pipeSeamSFX(val: boolean) {
    // if (this.__pipeSeamSFX === val) return;
    this.__pipeSeamSFX = val;
    this.onSettingChangeEvent(SettingsKey.PIPE_SEAM_SFX, val);
  }

  static get pipeSeamSFX() {
    return this.__pipeSeamSFX;
  }

  private static set overrideList(val: Map<string, GameType>) {
    this.__overrideList = new Map([...val.entries()].sort());
    this.onSettingChangeEvent(SettingsKey.OVERRIDE_LIST, val);
  }

  static get overrideList() {
    return this.__overrideList;
  }

  static addOverride(coName: string, gameType: GameType) {
    this.__overrideList.set(coName, gameType);
    this.__overrideList = new Map([...this.__overrideList.entries()].sort());
    this.onSettingChangeEvent(SettingsKey.ADD_OVERRIDE, [coName, gameType]);
  }

  static removeOverride(coName: string) {
    if (!this.__overrideList.has(coName)) return;
    this.__overrideList.delete(coName);
    this.__overrideList = new Map([...this.__overrideList.entries()].sort());
    this.onSettingChangeEvent(SettingsKey.REMOVE_OVERRIDE, coName);
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
    this.onSettingChangeEvent(SettingsKey.RESTART_THEMES, val);
  }

  static get autoplayOnOtherPages() {
    return this.__autoplayOnOtherPages;
  }

  static set autoplayOnOtherPages(val: boolean) {
    if (this.__autoplayOnOtherPages === val) return;
    this.__autoplayOnOtherPages = val;
    this.onSettingChangeEvent(SettingsKey.AUTOPLAY_ON_OTHER_PAGES, val);
  }

  static get excludedRandomThemes() {
    return this.__excludedRandomThemes;
  }

  static set excludedRandomThemes(val: Set<string>) {
    this.__excludedRandomThemes = val;
    this.onSettingChangeEvent(SettingsKey.EXCLUDED_RANDOM_THEMES, val);
  }

  static addExcludedRandomTheme(theme: string) {
    this.__excludedRandomThemes.add(theme);
    this.onSettingChangeEvent(SettingsKey.ADD_EXCLUDED, theme);
  }

  static removeExcludedRandomTheme(theme: string) {
    if (!this.__excludedRandomThemes.has(theme)) return;
    this.__excludedRandomThemes.delete(theme);
    this.onSettingChangeEvent(SettingsKey.REMOVE_EXCLUDED, theme);
  }

  static get loopRandomSongsUntilTurnChange() {
    return this.__loopRandomSongsUntilTurnChange;
  }

  static set loopRandomSongsUntilTurnChange(val: boolean) {
    if (this.__loopRandomSongsUntilTurnChange === val) return;
    this.__loopRandomSongsUntilTurnChange = val;
    this.onSettingChangeEvent(SettingsKey.LOOP_RANDOM_SONGS_UNTIL_TURN_CHANGE, val);
  }

  static get sfxOnOtherPages() {
    return this.__sfxOnOtherPages;
  }

  static set sfxOnOtherPages(val: boolean) {
    if (this.__sfxOnOtherPages === val) return;
    this.__sfxOnOtherPages = val;
    this.onSettingChangeEvent(SettingsKey.SFX_ON_OTHER_PAGES, val);
  }

  static get seamlessLoopsInMirrors() {
    return this.__seamlessLoopsInMirrors;
  }

  static set seamlessLoopsInMirrors(val: boolean) {
    if (this.__seamlessLoopsInMirrors === val) return;
    this.__seamlessLoopsInMirrors = val;
  }

  // ************* Non-user configurable settings from here on

  static set themeType(val: ThemeType) {
    if (this.__themeType === val) return;
    this.__themeType = val;
    this.onSettingChangeEvent(SettingsKey.THEME_TYPE, val);
  }

  static get themeType() {
    return this.__themeType;
  }

  static set randomThemesType(val: RandomThemeType) {
    if (this.__randomThemesType === val) return;
    this.__randomThemesType = val;
    this.onSettingChangeEvent(SettingsKey.RANDOM_THEMES_TYPE, val);
  }

  static get randomThemesType() {
    return this.__randomThemesType;
  }

  static get currentRandomCO() {
    if (!this.__currentRandomCO || this.__currentRandomCO == "") this.randomizeCO();
    return this.__currentRandomCO as string;
  }

  static get currentRandomGameType() {
    return this.__currentRandomGameType;
  }

  static randomizeCO() {
    const excludedCOs = new Set([...this.__excludedRandomThemes, this.__currentRandomCO]);
    this.__currentRandomCO = getRandomCO(excludedCOs);

    // Randomize soundtrack EXCEPT we don't allow AW1 during power themes
    const isPower = this.themeType !== ThemeType.REGULAR;
    const excludedSoundtracks = new Set<GameType>();
    if (isPower) excludedSoundtracks.add(GameType.AW1);
    this.__currentRandomGameType = getRandomGameType(excludedSoundtracks);

    this.onSettingChangeEvent(SettingsKey.CURRENT_RANDOM_CO, null);
  }

  static onSettingChangeEvent(key: SettingsKey, value: unknown) {
    onSettingsChangeListeners.forEach((fn) => fn(key, value, !this.isLoaded));
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
    updateSettingsInLocalStorage();
    storageData = localStorage.getItem(STORAGE_KEY);
    if (!storageData) {
      logError("Failed to store default settings in local storage");
      return;
    }
  }
  musicSettings.fromJSON(storageData);

  // Tell everyone we just loaded the settings
  onSettingsChangeListeners.forEach((fn) => fn(SettingsKey.ALL, null, true));
  logDebug("Settings loaded from storage:", storageData);

  addSettingsChangeListener(onSettingsChange);
}

/**
 * Allows the music player settings to be saved in the local storage.
 */
export function allowSettingsToBeSaved() {
  // From now on, any setting changes will be saved and any listeners will be called
  musicSettings.saveChanges = true;
}

function onSettingsChange(key: SettingsKey, value: unknown, _isFirstLoad: boolean) {
  // We can't save the non-configurable settings
  if (key === SettingsKey.THEME_TYPE || key === SettingsKey.CURRENT_RANDOM_CO) return;

  if (!musicSettings.saveChanges) return;

  // Save all settings otherwise
  updateSettingsInLocalStorage();

  // Broadcast the settings change to all other tabs
  broadcastChannel.postMessage({ type: "settings", key: key, value: value });
}

/**
 * Saves the current music player settings in the local storage.
 */
const updateSettingsInLocalStorage = debounce(500, __updateSettingsInLocalStorage);
function __updateSettingsInLocalStorage() {
  const jsonSettings = musicSettings.toJSON();
  localStorage.setItem(STORAGE_KEY, jsonSettings);
  logDebug("Saving settings...", jsonSettings);
  return;
}

function onStorageBroadcast(event: MessageEvent) {
  if (event.data.type !== "settings") return;
  const key = event.data.key as SettingsKey;
  const value = event.data.value;

  logDebug("Received settings change:", key, value);
  musicSettings.runWithoutSavingSettings(() => {
    switch (key) {
      case SettingsKey.VOLUME:
        musicSettings.volume = value as number;
        break;
      case SettingsKey.SFX_VOLUME:
        musicSettings.sfxVolume = value as number;
        break;
      case SettingsKey.UI_VOLUME:
        musicSettings.uiVolume = value as number;
        break;
      case SettingsKey.THEME_TYPE:
        musicSettings.themeType = value as ThemeType;
        break;
      case SettingsKey.GAME_TYPE:
        musicSettings.gameType = value as GameType;
        break;
      case SettingsKey.ALTERNATE_THEMES:
        musicSettings.alternateThemes = value as boolean;
        break;
      case SettingsKey.ALTERNATE_THEME_DAY:
        musicSettings.alternateThemeDay = value as number;
        break;
      case SettingsKey.RANDOM_THEMES_TYPE:
        musicSettings.randomThemesType = value as RandomThemeType;
        break;
      case SettingsKey.CAPTURE_PROGRESS_SFX:
        musicSettings.captureProgressSFX = value as boolean;
        break;
      case SettingsKey.PIPE_SEAM_SFX:
        musicSettings.pipeSeamSFX = value as boolean;
        break;
      case SettingsKey.RESTART_THEMES:
        musicSettings.restartThemes = value as boolean;
        break;
      case SettingsKey.AUTOPLAY_ON_OTHER_PAGES:
        musicSettings.autoplayOnOtherPages = value as boolean;
        break;
      case SettingsKey.ADD_OVERRIDE:
        musicSettings.addOverride(value[0], value[1]);
        break;
      case SettingsKey.REMOVE_OVERRIDE:
        musicSettings.removeOverride(value as string);
        break;
      case SettingsKey.ADD_EXCLUDED:
        musicSettings.addExcludedRandomTheme(value as string);
        break;
      case SettingsKey.REMOVE_EXCLUDED:
        musicSettings.removeExcludedRandomTheme(value as string);
        break;
      case SettingsKey.LOOP_RANDOM_SONGS_UNTIL_TURN_CHANGE:
        musicSettings.loopRandomSongsUntilTurnChange = value as boolean;
        break;
      case SettingsKey.SFX_ON_OTHER_PAGES:
        musicSettings.sfxOnOtherPages = value as boolean;
        break;
      case SettingsKey.SEAMLESS_LOOPS_IN_MIRRORS:
        musicSettings.seamlessLoopsInMirrors = value as boolean;
        break;
      case SettingsKey.IS_PLAYING:
      case SettingsKey.OVERRIDE_LIST:
      case SettingsKey.EXCLUDED_RANDOM_THEMES:
      case SettingsKey.ALL:
      case SettingsKey.CURRENT_RANDOM_CO:
        break;
      default:
        logError("Forgot to handle a settings key:", key);
    }
  });
}
