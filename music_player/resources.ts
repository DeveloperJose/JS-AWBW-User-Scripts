/**
 * @file All external resources used by this userscript like URLs and convenience functions for those URLs.
 */
import { getAllPlayingCONames, getCurrentGameDay } from "../shared/awbw_game";
import { getAllCONames, AW_DS_ONLY_COs, isBlackHoleCO, AW2_ONLY_COs } from "../shared/awbw_globals";
import { SettingsGameType, SettingsThemeType, musicSettings } from "./music_settings";

/**
 * Base URL where all the files needed for this script are located.
 * @constant {string}
 */
const BASE_URL = "https://developerjose.netlify.app";

/**
 * Base URL where all the music files are located.
 * @constant {string}
 */
const BASE_MUSIC_URL = BASE_URL + "/music";

/**
 * Base URL where all sound effect files are located.
 * @constant {string}
 */
const BASE_SFX_URL = BASE_MUSIC_URL + "/sfx";

/**
 * Image URL for static music player icon
 * @constant {string}
 */
export const NEUTRAL_IMG_URL = BASE_URL + "/img/music-player-icon.png";

/**
 * Image URL for animated music player icon.
 * @constant {string}
 */
export const PLAYING_IMG_URL = BASE_URL + "/img/music-player-playing.gif";

/**
 * URLs for the special themes that are not related to specific COs.
 * @enum {string}
 */
export const enum SpecialTheme {
  Victory = BASE_MUSIC_URL + "/t-victory.ogg",
  Defeat = BASE_MUSIC_URL + "/t-defeat.ogg",
  Maintenance = BASE_MUSIC_URL + "/t-maintenance.ogg",
  COSelect = BASE_MUSIC_URL + "/t-co-select.ogg",
  ModeSelect = BASE_MUSIC_URL + "/t-mode-select.ogg",
}

/**
 * Enumeration of all game sound effects. The values are the filenames for the sounds.
 * @enum {string}
 */
export enum GameSFX {
  coGoldRush = "co-gold-rush",

  powerActivateAllyCOP = "power-activate-ally-cop",
  powerActivateAllySCOP = "power-activate-ally-scop",
  powerActivateBHCOP = "power-activate-bh-cop",
  powerActivateBHSCOP = "power-activate-bh-scop",
  powerActivateAW1COP = "power-activate-aw1-cop",

  powerSCOPAvailable = "power-scop-available",
  powerCOPAvailable = "power-cop-available",

  tagBreakAlly = "tag-break-ally",
  tagBreakBH = "tag-break-bh",
  tagSwap = "tag-swap",

  unitAttackPipeSeam = "unit-attack-pipe-seam",
  unitCaptureAlly = "unit-capture-ally",
  unitCaptureEnemy = "unit-capture-enemy",
  unitCaptureProgress = "unit-capture-progress",
  unitMissileHit = "unit-missile-hit",
  unitMissileSend = "unit-missile-send",
  unitHide = "unit-hide",
  unitUnhide = "unit-unhide",
  unitSupply = "unit-supply",
  unitTrap = "unit-trap",
  unitLoad = "unit-load",
  unitUnload = "unit-unload",
  unitExplode = "unit-explode",

  uiCursorMove = "ui-cursor-move",
  uiInvalid = "ui-invalid",
  uiMenuOpen = "ui-menu-open",
  uiMenuClose = "ui-menu-close",
  uiMenuMove = "ui-menu-move",
  uiUnitSelect = "ui-unit-select",
}

/**
 * Enumeration of all the unit movement sounds. The values are the filenames for the sounds.
 * @enum {string}
 */
export enum MovementSFX {
  moveBCopterLoop = "move-bcopter",
  moveBCopterOneShot = "move-bcopter-rolloff",
  moveInfLoop = "move-inf",
  moveMechLoop = "move-mech",
  moveNavalLoop = "move-naval",
  movePiperunnerLoop = "move-piperunner",
  movePlaneLoop = "move-plane",
  movePlaneOneShot = "move-plane-rolloff",
  moveSubLoop = "move-sub",
  moveTCopterLoop = "move-tcopter",
  moveTCopterOneShot = "move-tcopter-rolloff",
  moveTiresHeavyLoop = "move-tires-heavy",
  moveTiresHeavyOneShot = "move-tires-heavy-rolloff",
  moveTiresLightLoop = "move-tires-light",
  moveTiresLightOneShot = "move-tires-light-rolloff",
  moveTreadHeavyLoop = "move-tread-heavy",
  moveTreadHeavyOneShot = "move-tread-heavy-rolloff",
  moveTreadLightLoop = "move-tread-light",
  moveTreadLightOneShot = "move-tread-light-rolloff",
}

/**
 * Map that takes unit names as keys and gives you the filename for that unit movement sound.
 */
const onMovementStartMap = new Map([
  ["APC", MovementSFX.moveTreadLightLoop],
  ["Anti-Air", MovementSFX.moveTreadLightLoop],
  ["Artillery", MovementSFX.moveTreadLightLoop],
  ["B-Copter", MovementSFX.moveBCopterLoop],
  ["Battleship", MovementSFX.moveNavalLoop],
  ["Black Boat", MovementSFX.moveNavalLoop],
  ["Black Bomb", MovementSFX.movePlaneLoop],
  ["Bomber", MovementSFX.movePlaneLoop],
  ["Carrier", MovementSFX.moveNavalLoop],
  ["Cruiser", MovementSFX.moveNavalLoop],
  ["Fighter", MovementSFX.movePlaneLoop],
  ["Infantry", MovementSFX.moveInfLoop],
  ["Lander", MovementSFX.moveNavalLoop],
  ["Md. Tank", MovementSFX.moveTreadHeavyLoop],
  ["Mech", MovementSFX.moveMechLoop],
  ["Mega Tank", MovementSFX.moveTreadHeavyLoop],
  ["Missile", MovementSFX.moveTiresHeavyLoop],
  ["Neotank", MovementSFX.moveTreadHeavyLoop],
  ["Piperunner", MovementSFX.movePiperunnerLoop],
  ["Recon", MovementSFX.moveTiresLightLoop],
  ["Rocket", MovementSFX.moveTiresHeavyLoop],
  ["Stealth", MovementSFX.movePlaneLoop],
  ["Sub", MovementSFX.moveSubLoop],
  ["T-Copter", MovementSFX.moveTCopterLoop],
  ["Tank", MovementSFX.moveTreadLightLoop],
]);

/**
 * Map that takes unit names as keys and gives you the filename to play when that unit has stopped moving, if any.
 */
const onMovementRolloffMap = new Map([
  ["APC", MovementSFX.moveTreadLightOneShot],
  ["Anti-Air", MovementSFX.moveTreadLightOneShot],
  ["Artillery", MovementSFX.moveTreadLightOneShot],
  ["B-Copter", MovementSFX.moveBCopterOneShot],
  ["Black Bomb", MovementSFX.movePlaneOneShot],
  ["Bomber", MovementSFX.movePlaneOneShot],
  ["Fighter", MovementSFX.movePlaneOneShot],
  ["Md. Tank", MovementSFX.moveTreadHeavyOneShot],
  ["Mega Tank", MovementSFX.moveTreadHeavyOneShot],
  ["Missile", MovementSFX.moveTiresHeavyOneShot],
  ["Neotank", MovementSFX.moveTreadHeavyOneShot],
  ["Recon", MovementSFX.moveTiresLightOneShot],
  ["Rocket", MovementSFX.moveTiresHeavyOneShot],
  ["Stealth", MovementSFX.movePlaneOneShot],
  ["T-Copter", MovementSFX.moveTCopterOneShot],
  ["Tank", MovementSFX.moveTreadLightOneShot],
]);

/**
 * Map that takes a game type and gives you a set of CO names that have alternate themes for that game type.
 */
const alternateThemes = new Map([
  [SettingsGameType.AW1, new Set(["sturm"])],
  [SettingsGameType.AW2, new Set(["sturm"])],
  [SettingsGameType.RBC, new Set(["andy", "olaf", "eagle", "drake", "grit", "kanbei", "sonja", "sturm"])],
  [SettingsGameType.DS, new Set(["sturm", "vonbolt"])],
]);

/**
 * Set of CO names that have special loops for their music.
 */
const specialLoops = new Set(["vonbolt"]);

/**
 * Determines the filename for the alternate music to play given a specific CO and other settings (if any).
 * @param coName - Name of the CO whose music to use.
 * @param gameType - Which game soundtrack to use.
 * @param themeType - Which type of music whether regular or power.
 * @returns - The filename of the alternate music to play given the parameters, if any.
 */
function getAlternateMusicFilename(coName: string, gameType: SettingsGameType, themeType: SettingsThemeType) {
  // Check if this CO has an alternate theme
  if (!alternateThemes.has(gameType)) return;
  const alternateThemesSet = alternateThemes.get(gameType);

  const faction = isBlackHoleCO(coName) ? "bh" : "ally";

  // RBC individual CO power themes -> RBC shared factory themes
  const isPowerActive = themeType !== SettingsThemeType.REGULAR;
  if (gameType === SettingsGameType.RBC && isPowerActive) {
    return `t-${faction}-${themeType}`;
  }

  // No alternate theme or it's a power
  if (!alternateThemesSet?.has(coName) || isPowerActive) {
    return;
  }

  // Andy -> Clone Andy
  if (coName === "andy" && gameType == SettingsGameType.RBC) {
    return isPowerActive ? "t-clone-andy-cop" : "t-clone-andy";
  }

  // All other alternate themes
  return `t-${coName}-2`;
}

/**
 * Determines the filename for the music to play given a specific CO and other settings.
 * @param coName - Name of the CO whose music to use.
 * @param gameType - Which game soundtrack to use.
 * @param themeType - Which type of music whether regular or power.
 * @returns - The filename of the music to play given the parameters.
 */
function getMusicFilename(
  coName: string,
  gameType: SettingsGameType,
  themeType: SettingsThemeType,
  useAlternateTheme: boolean,
) {
  // Check if we want to play the map editor theme
  if (coName === "map-editor") return "t-map-editor";

  // Check if we need to play an alternate theme
  if (useAlternateTheme) {
    const alternateFilename = getAlternateMusicFilename(coName, gameType, themeType);
    if (alternateFilename) return alternateFilename;
  }

  // Regular theme, either no power or we are in AW1 where there's no power themes.
  const isPowerActive = themeType !== SettingsThemeType.REGULAR;
  if (!isPowerActive || gameType === SettingsGameType.AW1) {
    return `t-${coName}`;
  }

  // For RBC, we play the new power themes (if they are not in the DS games obviously)
  const isCOInRBC = !AW_DS_ONLY_COs.has(coName);
  if (gameType === SettingsGameType.RBC && isCOInRBC) {
    return `t-${coName}-cop`;
  }
  // For all other games, play the ally or black hole themes during the CO and Super CO powers
  const faction = isBlackHoleCO(coName) ? "bh" : "ally";
  return `t-${faction}-${themeType}`;
}

/**
 * Determines the URL for the music to play given a specific CO, and optionally, some specific settings.
 * The settings will be loaded from the current saved settings if they aren't specified.
 *
 * @param coName - Name of the CO whose music to use.
 * @param gameType - (Optional) Which game soundtrack to use.
 * @param themeType - (Optional) Which type of music to use whether regular or power.
 * @param useAlternateTheme - (Optional) Whether to use the alternate theme for the given CO.
 * @returns - The complete URL of the music to play given the parameters.
 */
export function getMusicURL(
  coName: string,
  gameType?: SettingsGameType,
  themeType?: SettingsThemeType,
  useAlternateTheme?: boolean,
) {
  // Override optional parameters with current settings if not provided
  if (gameType === null || gameType === undefined) gameType = musicSettings.gameType;
  if (themeType === null || themeType === undefined) themeType = musicSettings.themeType;
  if (useAlternateTheme === null || useAlternateTheme === undefined) {
    useAlternateTheme = getCurrentGameDay() >= musicSettings.alternateThemeDay && musicSettings.alternateThemes;
  }

  // Convert name to internal format
  coName = coName.toLowerCase().replaceAll(" ", "");

  // Check if we want to play a special theme;
  if (coName === "victory") return SpecialTheme.Victory;
  if (coName === "defeat") return SpecialTheme.Defeat;
  if (coName === "co-select") return SpecialTheme.COSelect;
  if (coName === "mode-select") return SpecialTheme.ModeSelect;
  if (coName === "maintenance") return SpecialTheme.Maintenance;

  // First apply player overrides, that way we can override their overrides later...
  const overrideType = musicSettings.getOverride(coName);
  if (overrideType) gameType = overrideType;

  // Override the game type to a higher game if the CO is not available in the current game.
  if (gameType !== SettingsGameType.DS && AW_DS_ONLY_COs.has(coName)) gameType = SettingsGameType.DS;
  if (gameType === SettingsGameType.AW1 && AW2_ONLY_COs.has(coName)) gameType = SettingsGameType.AW2;

  let gameDir = gameType as string;
  if (!gameDir.startsWith("AW")) gameDir = "AW_" + gameDir;

  const filename = getMusicFilename(coName, gameType, themeType, useAlternateTheme);
  const url = `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`;
  return url.toLowerCase().replaceAll("_", "-").replaceAll(" ", "");
}

/**
 * Gets the name of the CO from the given URL, if any.
 * @param url - URL to get the CO name from.
 * @returns - The name of the CO from the given URL.
 */
export function getCONameFromURL(url: string) {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];

  // Remove t- prefix and .ogg extension
  const coName = filename.split(".")[0].substring(2);
  return coName;
}

/**
 * Gets the URL for the given sound effect.
 * @param sfx - Sound effect enum to use.
 * @returns - The URL of the given sound effect.
 */
export function getSoundEffectURL(sfx: GameSFX) {
  return `${BASE_SFX_URL}/${sfx}.ogg`;
}

/**
 * Gets the URL to play when the given unit starts to move.
 * @param unitName - Name of the unit.
 * @returns - The URL of the given unit's movement start sound.
 */
export function getMovementSoundURL(unitName: string) {
  return `${BASE_SFX_URL}/${onMovementStartMap.get(unitName)}.ogg`;
}

/**
 * Getes the URL to play when the given unit stops moving, if any.
 * @param unitName - Name of the unit.
 * @returns - The URL of the given unit's movement stop sound, if any, or null otherwise.
 */
export function getMovementRollOffURL(unitName: string) {
  return `${BASE_SFX_URL}/${onMovementRolloffMap.get(unitName)}.ogg`;
}

/**
 * Checks if the given unit plays a sound when it stops moving.
 * @param unitName - Name of the unit.
 * @returns - True if the given unit has a sound to play when it stops moving.
 */
export function hasMovementRollOff(unitName: string) {
  return onMovementRolloffMap.has(unitName);
}

/**
 * Checks if the given URL has a special loop to play after the music finishes.
 * @param srcURL - URL of the music to check.
 * @returns - True if the given URL has a special loop to play after the audio finishes.
 */
export function hasSpecialLoop(srcURL: string) {
  const coName = getCONameFromURL(srcURL);
  return specialLoops.has(coName);
}

/**
 * Gets all the URLs for the music of all currently playing COs for the current game settings.
 * Includes the regular and alternate themes for each CO (if any).
 * @returns - Set with all the URLs for current music of all currently playing COs.
 */
export function getCurrentThemeURLs(): Set<string> {
  const coNames = getAllPlayingCONames();
  const audioList = new Set<string>();

  coNames.forEach((name) => {
    const regularURL = getMusicURL(name, musicSettings.gameType, SettingsThemeType.REGULAR, false);
    const powerURL = getMusicURL(name, musicSettings.gameType, SettingsThemeType.CO_POWER, false);
    const superPowerURL = getMusicURL(name, musicSettings.gameType, SettingsThemeType.SUPER_CO_POWER, false);
    const alternateURL = getMusicURL(name, musicSettings.gameType, musicSettings.themeType, true);
    audioList.add(regularURL);
    audioList.add(alternateURL);
    audioList.add(powerURL);
    audioList.add(superPowerURL);
    if (specialLoops.has(name)) audioList.add(regularURL.replace(".ogg", "-loop.ogg"));
  });
  return audioList;
}

/**
 * Gets a list of the URLs for all sound effects the music player might ever use.
 * These include game effects, UI effects, and unit movement sounds.
 * @returns - Set with all the URLs for all the music player sound effects.
 */
function getAllSoundEffectURLs() {
  const allSoundURLs = new Set<string>();
  for (const sfx of Object.values(GameSFX)) {
    allSoundURLs.add(getSoundEffectURL(sfx));
  }
  for (const unitName of onMovementStartMap.keys()) {
    allSoundURLs.add(getMovementSoundURL(unitName));
  }
  for (const unitName of onMovementRolloffMap.keys()) {
    allSoundURLs.add(getMovementRollOffURL(unitName));
  }
  return allSoundURLs;
}

/**
 * Gets a list of the URLs for all the audio the music player might ever use.
 * @returns - Set with all the URLs for all the audio.
 */
export function getAllAudioURLs() {
  // Sound effects
  const allSoundURLs = getAllSoundEffectURLs();

  // Themes
  for (const coName of getAllCONames()) {
    for (const gameType of Object.values(SettingsGameType)) {
      for (const themeType of Object.values(SettingsThemeType)) {
        const url = getMusicURL(coName, gameType, themeType, false);
        if (themeType === SettingsThemeType.REGULAR && specialLoops.has(coName)) {
          allSoundURLs.add(url.replace(".ogg", "-loop.ogg"));
        }
        const alternateURL = getMusicURL(coName, gameType, themeType, true);
        allSoundURLs.add(url);
        allSoundURLs.add(alternateURL);
      }
    }
  }

  // Special themes
  allSoundURLs.add(SpecialTheme.COSelect);
  allSoundURLs.add(SpecialTheme.ModeSelect);
  allSoundURLs.add(SpecialTheme.Maintenance);
  allSoundURLs.add(SpecialTheme.Victory);
  allSoundURLs.add(SpecialTheme.Defeat);
  return allSoundURLs;
}
