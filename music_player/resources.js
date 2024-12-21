import { GAME_TYPE, THEME_TYPE, getCurrentThemeType, musicPlayerSettings } from "./music_settings";

/*
 * All external resources used by this userscript like URLs.
 *
 * TODO:
 *  -DS/MapEditor, edit music
 */
const BASE_URL = "https://devj.surge.sh";
const BASE_URL_MUSIC = BASE_URL + "/music";
const BASE_URL_SFX = BASE_URL_MUSIC + "/sfx";

export const neutralImgLink = BASE_URL + "/img/music-player-icon.png";
export const playingImgLink = BASE_URL + "/img/music-player-playing.gif";

export const gameSFX = {
  actionSuperCOPowerAvailable: "sfx-action-super-co-power-available",
  actionCOPowerAvailable: "sfx-action-co-power-available",
  actionAllyActivateSCOP: "sfx-action-ally-activate-scop",
  actionBHActivateSCOP: "sfx-action-bh-activate-scop",
  actionCaptureAlly: "sfx-action-capture-ally",
  actionCaptureEnemy: "sfx-action-capture-enemy",
  actionCaptureProgress: "sfx-action-capture-progress",
  actionMissileHit: "sfx-action-missile-hit",
  actionMissleSend: "sfx-action-missile-send",
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

const BLACK_HOLE_CO_LIST = new Set([
  "flak",
  "lash",
  "adder",
  "hawke",
  "sturm",
  "jugger",
  "koal",
  "kindle",
  "vonbolt",
]);

export function isBlackHoleCO(coName) {
  return BLACK_HOLE_CO_LIST.has(coName.toLowerCase());
}

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

function getMusicFilename(coName, gameType, themeType) {
  let isPowerActive = themeType !== THEME_TYPE.REGULAR;

  // Regular theme
  if (!isPowerActive) {
    return `t-${coName}`;
  }

  // For RBC, we play the new power themes
  // TODO: RBC factory themes
  if (gameType === GAME_TYPE.AW_RBC) {
    return `t-${coName}-cop`;
  }
  // For all other games, play the ally or black hole themes
  // during the CO and Super CO powers
  let faction = isBlackHoleCO(coName) ? "bh" : "ally";
  return `t-${faction}-${themeType}`;
}

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

export function getSoundEffectURL(sfx) {
  return `${BASE_URL_SFX}/${sfx}.ogg`;
}

export function getMovementSoundURL(unitName) {
  return onMovementStartMap.get(unitName);
}

export function getMovementRollOffURL(unitName) {
  return onMovementRollOffMap.get(unitName);
}

export function hasMovementRollOff(unitName) {
  return onMovementRollOffMap.has(unitName);
}

// TODO: Should we preload SFX?
export function getAllSoundEffectURLS() {
  let sfx = Object.values(gameSFX).map(getSoundEffectURL);
  let moreSFX = Object.values(movementSFX);
  return sfx.concat(moreSFX);
  // return [];
}
