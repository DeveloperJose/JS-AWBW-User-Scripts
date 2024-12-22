/**
 * @file All external resources used by this userscript like URLs and convenience functions for those URLs.
 */
import { isBlackHoleCO } from "../shared/awbw_site";
import { GAME_TYPE, THEME_TYPE, getCurrentThemeType, musicPlayerSettings } from "./music_settings";

/**
 * @constant
 * Base URL where all the files needed for this script are located.
 */
const BASE_URL = "https://devj.surge.sh";

/**
 * @constant
 * Base URL where all the music files are located.
 */
const BASE_URL_MUSIC = BASE_URL + "/music";

/**
 * @constant
 * Base URL where all sound effect files are located.
 */
const BASE_URL_SFX = BASE_URL_MUSIC + "/sfx";

/**
 * @constant
 * Image URL for static music player icon
 */
export const neutralImgLink = BASE_URL + "/img/music-player-icon.png";

/**
 * @constant
 * Image URL for animated music player icon.
 */
export const playingImgLink = BASE_URL + "/img/music-player-playing.gif";

/**
 * Enumeration of all game sound effects. The values for the keys are the filenames.
 * @enum {string}
 */
export const gameSFX = {
  actionSuperCOPowerAvailable: "sfx-action-super-co-power-available",
  actionCOPowerAvailable: "sfx-action-co-power-available",
  actionAllyActivateSCOP: "sfx-action-ally-activate-scop",
  actionBHActivateSCOP: "sfx-action-bh-activate-scop",
  actionCaptureAlly: "sfx-action-capture-ally",
  actionCaptureEnemy: "sfx-action-capture-enemy",
  actionCaptureProgress: "sfx-action-capture-progress",
  actionMissileHit: "sfx-action-missile-hit",
  actionMissileSend: "sfx-action-missile-send",
  actionUnitHide: "sfx-action-unit-hide",
  actionUnitUnhide: "sfx-action-unit-unhide",
  actionUnitSupply: "sfx-action-unit-supply",
  actionUnitTrap: "sfx-action-unit-trap",
  actionUnitLoad: "sfx-action-unit-load",
  actionUnitUnload: "sfx-action-unit-unload",
  actionUnitExplode: "sfx-action-unit-explode",
  uiCursorMove: "sfx-ui-cursor-move",
  uiMenuOpen: "sfx-ui-menu-open",
  uiMenuClose: "sfx-ui-menu-close",
  uiMenuMove: "sfx-ui-menu-move",
  uiUnitSelect: "sfx-ui-unit-select",
};

/**
 * @constant
 * List of all the URLs for all unit movement sounds.
 */
const movementSFX = {
  moveBCopterLoop: BASE_URL_SFX + "/move_bcopter.ogg",
  moveBCopterOneShot: BASE_URL_SFX + "/move_bcopter_rolloff.ogg",
  moveInfLoop: BASE_URL_SFX + "/move_inf.ogg",
  moveMechLoop: BASE_URL_SFX + "/move_mech.ogg",
  moveNavalLoop: BASE_URL_SFX + "/move_naval.ogg",
  movePiperunnerLoop: BASE_URL_SFX + "/move_piperunner.ogg",
  movePlaneLoop: BASE_URL_SFX + "/move_plane.ogg",
  movePlaneOneShot: BASE_URL_SFX + "/move_plane_rolloff.ogg",
  moveSubLoop: BASE_URL_SFX + "/move_sub.ogg",
  moveTCopterLoop: BASE_URL_SFX + "/move_tcopter.ogg",
  moveTCopterOneShot: BASE_URL_SFX + "/move_tcopter_rolloff.ogg",
  moveTiresHeavyLoop: BASE_URL_SFX + "/move_tires_heavy.ogg",
  moveTiresHeavyOneShot: BASE_URL_SFX + "/move_tires_heavy_rolloff.ogg",
  moveTiresLightLoop: BASE_URL_SFX + "/move_tires_light.ogg",
  moveTiresLightOneShot: BASE_URL_SFX + "/move_tires_light_rolloff.ogg",
  moveTreadHeavyLoop: BASE_URL_SFX + "/move_tread_heavy.ogg",
  moveTreadHeavyOneShot: BASE_URL_SFX + "/move_tread_heavy_rolloff.ogg",
  moveTreadLightLoop: BASE_URL_SFX + "/move_tread_light.ogg",
  moveTreadLightOneShot: BASE_URL_SFX + "/move_tread_light_rolloff.ogg",
};

/**
 * Map that takes unit names as keys and gives you the URL for that unit movement sound.
 */
const onMovementStartMap = new Map([
  ["APC", movementSFX.moveTreadLightLoop],
  ["Anti-Air", movementSFX.moveTreadLightLoop],
  ["Artillery", movementSFX.moveTreadLightLoop],
  ["B-Copter", movementSFX.moveBCopterLoop],
  ["Battleship", movementSFX.moveNavalLoop],
  ["Black Boat", movementSFX.moveNavalLoop],
  ["Black Bomb", movementSFX.movePlaneLoop],
  ["Bomber", movementSFX.movePlaneLoop],
  ["Carrier", movementSFX.moveNavalLoop],
  ["Cruiser", movementSFX.moveNavalLoop],
  ["Fighter", movementSFX.movePlaneLoop],
  ["Infantry", movementSFX.moveInfLoop],
  ["Lander", movementSFX.moveNavalLoop],
  ["Md. Tank", movementSFX.moveTreadHeavyLoop],
  ["Mech", movementSFX.moveMechLoop],
  ["Mega Tank", movementSFX.moveTreadHeavyLoop],
  ["Missile", movementSFX.moveTiresHeavyLoop],
  ["Neotank", movementSFX.moveTreadHeavyLoop],
  ["Piperunner", movementSFX.movePiperunnerLoop],
  ["Recon", movementSFX.moveTiresLightLoop],
  ["Rocket", movementSFX.moveTiresHeavyLoop],
  ["Stealth", movementSFX.movePlaneLoop],
  ["Sub", movementSFX.moveSubLoop],
  ["T-Copter", movementSFX.moveTCopterLoop],
  ["Tank", movementSFX.moveTreadLightLoop],
]);

/**
 * Map that takes unit names as keys and gives you the URL to play when that unit has stopped moving, if any.
 */
const onMovementRollOffMap = new Map([
  ["APC", movementSFX.moveTreadLightOneShot],
  ["Anti-Air", movementSFX.moveTreadLightOneShot],
  ["Artillery", movementSFX.moveTreadLightOneShot],
  ["B-Copter", movementSFX.moveBCopterOneShot],
  ["Black Bomb", movementSFX.movePlaneOneShot],
  ["Bomber", movementSFX.movePlaneOneShot],
  ["Fighter", movementSFX.movePlaneOneShot],
  ["Md. Tank", movementSFX.moveTreadHeavyOneShot],
  ["Mega Tank", movementSFX.moveTreadHeavyOneShot],
  ["Missile", movementSFX.moveTiresHeavyOneShot],
  ["Neotank", movementSFX.moveTreadHeavyOneShot],
  ["Recon", movementSFX.moveTiresLightOneShot],
  ["Rocket", movementSFX.moveTiresHeavyOneShot],
  ["Stealth", movementSFX.movePlaneOneShot],
  ["T-Copter", movementSFX.moveTCopterOneShot],
  ["Tank", movementSFX.moveTreadLightOneShot],
]);

/**
 * Determines the filename for the music to play given a specific CO and other settings.
 * @param {string} coName - Name of the CO whose music to use.
 * @param {GAME_TYPE} gameType - Which game soundtrack to use.
 * @param {THEME_TYPE} themeType - Which type of music whether regular or power.
 * @returns The filename of the music to play given the parameters.
 */
function getMusicFilename(coName, gameType, themeType) {
  let isPowerActive = themeType !== THEME_TYPE.REGULAR;

  // Regular theme
  if (!isPowerActive) {
    return `t-${coName}`;
  }

  // For RBC, we play the new power themes
  if (gameType === GAME_TYPE.AW_RBC) {
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
 * @param {string} coName - Name of the CO whose music to use.
 * @param {GAME_TYPE} gameType - (Optional) Which game soundtrack to use.
 * @param {THEME_TYPE} themeType - (Optional) Which type of music to use whether regular or power.
 * @returns The complete URL of the music to play given the parameters.
 */
export function getMusicURL(coName, gameType = null, themeType = null) {
  if (gameType === null) {
    gameType = musicPlayerSettings.gameType;
  }

  if (themeType === null) {
    themeType = getCurrentThemeType();
  }

  let gameDir = gameType;
  let filename = getMusicFilename(coName, gameType, themeType);
  let url = `${BASE_URL_MUSIC}/${gameDir}/${filename}.ogg`;
  return url.toLowerCase().replaceAll("_", "-");
}

/**
 * Gets the URL for the given sound effect.
 * @param {string} sfx - String key for the sound effect to use.
 * @returns The URL of the given sound effect key.
 */
export function getSoundEffectURL(sfx) {
  return `${BASE_URL_SFX}/${sfx}.ogg`;
}

/**
 * Gets the URL to play when the given unit starts to move.
 * @param {string} unitName - Name of the unit.
 * @returns The URL of the given unit's movement start sound.
 */
export function getMovementSoundURL(unitName) {
  return onMovementStartMap.get(unitName);
}

/**
 * Getes the URL to play when the given unit stops moving, if any.
 * @param {string} unitName - Name of the unit.
 * @returns The URL of the given unit's movement stop sound, if any, or null otherwise.
 */
export function getMovementRollOffURL(unitName) {
  return onMovementRollOffMap.get(unitName);
}

/**
 * Checks if the given unit plays a sound when it stops moving.
 * @param {string} unitName - Name of the unit.
 * @returns True if the given unit has a sound to play when it stops moving.
 */
export function hasMovementRollOff(unitName) {
  return onMovementRollOffMap.has(unitName);
}

/**
 * Gets a list of the URLs for all sound effects the music player might ever use.
 * These include game effects, UI effects, and unit movement sounds.
 * @returns List with all the URLs for all the music player sound effects.
 */
export function getAllSoundEffectURLS() {
  let sfx = Object.values(gameSFX).map(getSoundEffectURL);
  let moreSFX = Object.values(movementSFX);
  return sfx.concat(moreSFX);
}
