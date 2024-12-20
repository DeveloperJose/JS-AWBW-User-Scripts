import { musicPlayerSettings } from "./music_settings";

/*
 * All external resources used by this userscript like URLs.
 */
export const BASE_URL = "https://devj.surge.sh/music";
export const neutralImgLink = "https://macroland.one/img/music-player-icon.png";
export const playingImgLink = "https://macroland.one/img/music-player-playing.gif";

export const movementSFX = {
  moveBCopterLoop: "https://macroland.one/movement/move_bcopter.wav",
  moveBCopterOneShot: "https://macroland.one/movement/move_bcopter_rolloff.wav",
  moveInfLoop: "https://macroland.one/movement/move_inf.wav",
  moveMechLoop: "https://macroland.one/movement/move_mech.wav",
  moveNavalLoop: "https://macroland.one/movement/move_naval.wav",
  movePiperunnerLoop: "https://macroland.one/movement/move_piperunner.wav",
  movePlaneLoop: "https://macroland.one/movement/move_plane.wav",
  movePlaneOneShot: "https://macroland.one/movement/move_plane_rolloff.wav",
  moveSubLoop: "https://macroland.one/movement/move_sub.wav",
  moveTCopterLoop: "https://macroland.one/movement/move_tcopter.wav",
  moveTCopterOneShot: "https://macroland.one/movement/move_tcopter_rolloff.wav",
  moveTiresHeavyLoop: "https://macroland.one/movement/move_tires_heavy.wav",
  moveTiresHeavyOneShot: "https://macroland.one/movement/move_tires_heavy_rolloff.wav",
  moveTiresLightLoop: "https://macroland.one/movement/move_tires_light.wav",
  moveTiresLightOneShot: "https://macroland.one/movement/move_tires_light_rolloff.wav",
  moveTreadHeavyLoop: "https://macroland.one/movement/move_tread_heavy.wav",
  moveTreadHeavyOneShot: "https://macroland.one/movement/move_tread_heavy_rolloff.wav",
  moveTreadLightLoop: "https://macroland.one/movement/move_tread_light.wav",
  moveTreadLightOneShot: "https://macroland.one/movement/move_tread_light_rolloff.wav",
};

export const onMovementStartMap = new Map([
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

export const onMovementRollOffMap = new Map([
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

export const gameSFX = {
  actionLoadSFX: "https://macroland.one/game/action_load.wav",
  actionUnloadSFX: "https://macroland.one/game/action_unload.wav",
  actionCaptAllySFX: "https://macroland.one/game/capture_ally.wav",
  actionCaptEnemySFX: "https://macroland.one/game/capture_enemy.wav",
  actionUnitExplode: "https://macroland.one/game/unit_explode.wav",
  actionSupplyRepair: "https://macroland.one/game/action_resupply_repair.wav",
};

export const uiSFX = {
  uiCursorMove: "https://macroland.one/game/ui_cursormove.wav",
  uiMenuOpen: "https://macroland.one/game/ui_openmenu.wav",
  uiMenuClose: "https://macroland.one/game/ui_closemenu.wav",
  uiMenuMove: "https://macroland.one/game/ui_menumove.wav",
  uiUnitClick: "https://macroland.one/game/ui_unitclick.wav",
  powerSCOPIntro: "https://macroland.one/game/power_co_scop.wav",
  powerBHSCOPIntro: "https://macroland.one/game/power_bh_scop.wav",
};

export function getMusicURL(coName) {
  return `${BASE_URL}/${musicPlayerSettings.gameType}/t-${coName}.ogg`;
}
