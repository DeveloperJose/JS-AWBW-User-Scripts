/**
 * @file All external resources used by this userscript like URLs and convenience functions for those URLs.
 */
import { isBlackHoleCO } from "../shared/awbw_globals";
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
 * Enumeration of all game sound effects. The values for the keys are the filenames.
 * @enum {string}
 */
export enum GameSFX {
  actionSuperCOPowerAvailable = "sfx-action-super-co-power-available",
  actionCOPowerAvailable = "sfx-action-co-power-available",
  actionAllyActivateSCOP = "sfx-action-ally-activate-scop",
  actionBHActivateSCOP = "sfx-action-bh-activate-scop",

  actionCaptureAlly = "sfx-action-capture-ally",
  actionCaptureEnemy = "sfx-action-capture-enemy",
  actionCaptureProgress = "sfx-action-capture-progress",
  actionMissileHit = "sfx-action-missile-hit",
  actionMissileSend = "sfx-action-missile-send",
  actionUnitAttackPipeSeam = "sfx-action-unit-attack-pipe-seam",
  actionUnitHide = "sfx-action-unit-hide",
  actionUnitUnhide = "sfx-action-unit-unhide",
  actionUnitSupply = "sfx-action-unit-supply",
  actionUnitTrap = "sfx-action-unit-trap",
  actionUnitLoad = "sfx-action-unit-load",
  actionUnitUnload = "sfx-action-unit-unload",
  actionUnitExplode = "sfx-action-unit-explode",

  uiCursorMove = "sfx-ui-cursor-move",
  uiMenuOpen = "sfx-ui-menu-open",
  uiMenuClose = "sfx-ui-menu-close",
  uiMenuMove = "sfx-ui-menu-move",
  uiUnitSelect = "sfx-ui-unit-select",
}

/**
 * Enumeration of all the unit movement sounds. The values are the URLs for the sounds.
 * @enum {string}
 */
export enum MovementSFX {
  moveBCopterLoop = BASE_SFX_URL + "/move_bcopter.ogg",
  moveBCopterOneShot = BASE_SFX_URL + "/move_bcopter_rolloff.ogg",
  moveInfLoop = BASE_SFX_URL + "/move_inf.ogg",
  moveMechLoop = BASE_SFX_URL + "/move_mech.ogg",
  moveNavalLoop = BASE_SFX_URL + "/move_naval.ogg",
  movePiperunnerLoop = BASE_SFX_URL + "/move_piperunner.ogg",
  movePlaneLoop = BASE_SFX_URL + "/move_plane.ogg",
  movePlaneOneShot = BASE_SFX_URL + "/move_plane_rolloff.ogg",
  moveSubLoop = BASE_SFX_URL + "/move_sub.ogg",
  moveTCopterLoop = BASE_SFX_URL + "/move_tcopter.ogg",
  moveTCopterOneShot = BASE_SFX_URL + "/move_tcopter_rolloff.ogg",
  moveTiresHeavyLoop = BASE_SFX_URL + "/move_tires_heavy.ogg",
  moveTiresHeavyOneShot = BASE_SFX_URL + "/move_tires_heavy_rolloff.ogg",
  moveTiresLightLoop = BASE_SFX_URL + "/move_tires_light.ogg",
  moveTiresLightOneShot = BASE_SFX_URL + "/move_tires_light_rolloff.ogg",
  moveTreadHeavyLoop = BASE_SFX_URL + "/move_tread_heavy.ogg",
  moveTreadHeavyOneShot = BASE_SFX_URL + "/move_tread_heavy_rolloff.ogg",
  moveTreadLightLoop = BASE_SFX_URL + "/move_tread_light.ogg",
  moveTreadLightOneShot = BASE_SFX_URL + "/move_tread_light_rolloff.ogg",
}

/**
 * Map that takes unit names as keys and gives you the URL for that unit movement sound.
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
 * Map that takes unit names as keys and gives you the URL to play when that unit has stopped moving, if any.
 */
const onMovmentRolloffMap = new Map([
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
  let isPowerActive = themeType !== SettingsThemeType.REGULAR;

  // Regular theme
  if (!isPowerActive) {
    return `t-${coName}`;
  }

  // For RBC, we play the new power themes
  if (gameType === SettingsGameType.AW_RBC) {
    return `t-${coName}-cop`;
  }
  // For all other games, play the ally or black hole themes
  // during the CO and Super CO powers
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
  if (gameType === null) {
    gameType = musicPlayerSettings.gameType;
  }

  if (themeType === null) {
    themeType = getCurrentThemeType();
  }

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
  return onMovementStartMap.get(unitName);
}

/**
 * Getes the URL to play when the given unit stops moving, if any.
 * @param unitName - Name of the unit.
 * @returns - The URL of the given unit's movement stop sound, if any, or null otherwise.
 */
export function getMovementRollOffURL(unitName: string) {
  return onMovmentRolloffMap.get(unitName);
}

/**
 * Checks if the given unit plays a sound when it stops moving.
 * @param unitName - Name of the unit.
 * @returns - True if the given unit has a sound to play when it stops moving.
 */
export function hasMovementRollOff(unitName: string) {
  return onMovmentRolloffMap.has(unitName);
}

/**
 * Gets a list of the URLs for all sound effects the music player might ever use.
 * These include game effects, UI effects, and unit movement sounds.
 * @returns - List with all the URLs for all the music player sound effects.
 */
export function getAllSoundEffectURLS() {
  let sfx = Object.values(GameSFX).map(getSoundEffectURL);
  let moreSFX = Object.values(MovementSFX);
  return sfx.concat(moreSFX);
}
