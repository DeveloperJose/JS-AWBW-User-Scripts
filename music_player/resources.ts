/**
 * @file All external resources used by this userscript like URLs and convenience functions for those URLs.
 */
import { isBlackHoleCO } from "../shared/awbw_globals";
import { isMapEditor } from "../shared/awbw_page";
import {
  SettingsGameType,
  SettingsThemeType,
  getCurrentThemeType,
  musicPlayerSettings,
} from "./music_settings";

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
 * Enumeration of all game sound effects. The values are the filenames for the sounds.
 * @enum {string}
 */
export enum GameSFX {
  powerActivateAllyCOP = "power-activate-ally-cop",
  powerActivateAllySCOP = "power-activate-ally-scop",
  powerActivateBHCOP = "power-activate-bh-cop",
  powerActivateBHSCOP = "power-activate-bh-scop",
  powerActivateAW1COP = "power-activate-aw1-cop",

  powerSCOPAvailable = "power-scop-available",
  powerCOPAvailable = "power-cop-available",

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
) {
  // Check if we want to play the map editor theme
  if (coName === "map-editor") return "t-map-editor";

  // Regular theme
  let isPowerActive = themeType !== SettingsThemeType.REGULAR;
  if (!isPowerActive) {
    return `t-${coName}`;
  }

  // For AW1, we play the regular themes
  if (gameType === SettingsGameType.AW1) {
    return `t-${coName}`;
  }

  // For RBC, we play the new power themes
  if (gameType === SettingsGameType.AW_RBC) {
    return `t-${coName}-cop`;
  }
  // For all other games, play the ally or black hole themes during the CO and Super CO powers
  let faction = isBlackHoleCO(coName) ? "bh" : "ally";
  return `t-${faction}-${themeType}`;
}

/**
 * Determines the URL for the music to play given a specific CO, and optionally, some specific settings.
 * The settings will be loaded from the current saved settings if they aren't specified.
 *
 * @param coName - Name of the CO whose music to use.
 * @param gameType - (Optional) Which game soundtrack to use.
 * @param themeType - (Optional) Which type of music to use whether regular or power.
 * @returns - The complete URL of the music to play given the parameters.
 */
export function getMusicURL(
  coName: string,
  gameType: SettingsGameType = null,
  themeType: SettingsThemeType = null,
) {
  if (gameType === null) gameType = musicPlayerSettings.gameType;
  if (themeType === null) themeType = musicPlayerSettings.themeType;

  let gameDir = gameType;
  let filename = getMusicFilename(coName, gameType, themeType);
  let url = `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`;
  return url.toLowerCase().replaceAll("_", "-");
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
 * Gets a list of the URLs for all sound effects the music player might ever use.
 * These include game effects, UI effects, and unit movement sounds.
 * @returns - Set with all the URLs for all the music player sound effects.
 */
export function getAllSoundEffectURLS() {
  let allSoundURLs = new Set<string>();
  for (let sfx of Object.values(GameSFX)) {
    allSoundURLs.add(getSoundEffectURL(sfx));
  }
  for (let unitName of onMovementStartMap.keys()) {
    allSoundURLs.add(getMovementSoundURL(unitName));
  }
  for (let unitName of onMovementRolloffMap.keys()) {
    allSoundURLs.add(getMovementRollOffURL(unitName));
  }
  return allSoundURLs;
}
