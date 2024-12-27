/**
 * @file This file contains all the AWBW website handlers that will intercept clicks and any relevant functions of the website.
 */
import {
  canPlayerActivateSuperCOPower,
  canPlayerActivateCOPower,
  getMyID,
  isPlayerSpectator,
  siloDelayMS,
  attackDelayMS,
  isValidBuilding,
  getBuildingInfo,
  isValidUnit,
  getUnitName,
  getUnitInfoFromCoords,
  COPowerEnum,
} from "../shared/awbw_game";
import {
  getIsMapEditor,
  getReplayBackwardActionBtn,
  getReplayBackwardBtn,
  getReplayCloseBtn,
  getReplayDaySelectorCheckBox,
  getReplayForwardActionBtn,
  getReplayForwardBtn,
  getReplayOpenBtn,
  moveDivToOffset,
} from "../shared/awbw_page";
import { getBuildingDiv } from "../shared/awbw_page";

import { areAnimationsEnabled, getRandomCO } from "../shared/awbw_globals";
import { playThemeSong, playSFX, stopMovementSound, playMovementSound, stopThemeSong } from "./music";
import { getCurrentThemeType, musicPlayerSettings, SettingsGameType, SettingsThemeType } from "./music_settings";
import { GameSFX } from "./resources";
import { isBlackHoleCO } from "../shared/awbw_globals";
import {
  getAnimExplosionFn,
  getAnimUnitFn,
  getAttackSeamFn,
  getBuildFn,
  getCaptFn,
  getCloseMenuFn,
  getCursorMoveFn,
  getEliminationFn,
  getFireFn,
  getFogFn,
  getGameOverFn,
  getHideFn,
  getJoinFn,
  getLaunchFn,
  getLoadFn,
  getMoveFn,
  getNextTurnFn,
  getOpenMenuFn,
  getPowerFn,
  getRepairFn,
  getResetAttackFn,
  getSupplyFn,
  getSwapCosDisplayFn,
  getUnhideFn,
  getUnitClickFn,
  getUnloadFn,
  getWaitFn,
} from "../shared/awbw_handlers";

/**
 * How long to wait in milliseconds before we register a cursor movement.
 * Used to prevent overwhelming the user with too many cursor movement sound effects.
 * @constant
 */
const CURSOR_THRESHOLD_MS = 25;

/**
 * Date representing when we last moved the game cursor.
 */
let lastCursorCall = Date.now();

/**
 * The last known X coordinate of the cursor.
 */
let lastCursorX = -1;

/**
 * The last known Y coordinate of the cursor.
 */
let lastCursorY = -1;

enum MenuClickType {
  None,
  Unit,
  MenuItem,
}

let menuItemClick = MenuClickType.None;
let menuOpen = false;

/**
 * Map of unit IDs to their visibility status. Used to check if a unit that was visible disappeared in the fog.
 */
let visibilityMap: Map<number, boolean> = new Map();

/**
 * Map of unit IDs to their movement responses. Used to check if a unit got trapped.
 */
let movementResponseMap: Map<number, MoveResponse> = new Map();

// Store a copy of all the original functions we are going to override
let ahCursorMove = getCursorMoveFn();
let ahSwapCosDisplay = getSwapCosDisplayFn();
let ahOpenMenu = getOpenMenuFn();
let ahCloseMenu = getCloseMenuFn();
let ahResetAttack = getResetAttackFn();
let ahUnitClick = getUnitClickFn();
let ahWait = getWaitFn();
let ahAnimUnit = getAnimUnitFn();
let ahAnimExplosion = getAnimExplosionFn();
let ahFog = getFogFn();
let ahFire = getFireFn();
let ahAttackSeam = getAttackSeamFn();
let ahMove = getMoveFn();
let ahCapt = getCaptFn();
let ahBuild = getBuildFn();
let ahLoad = getLoadFn();
let ahUnload = getUnloadFn();
let ahSupply = getSupplyFn();
let ahRepair = getRepairFn();
let ahHide = getHideFn();
let ahUnhide = getUnhideFn();
let ahJoin = getJoinFn();
let ahLaunch = getLaunchFn();
let ahNextTurn = getNextTurnFn();
let ahElimination = getEliminationFn();
let ahPower = getPowerFn();
let ahGameOver = getGameOverFn();

/**
 * Intercept functions and add our own handlers to the website.
 */
export function addHandlers() {
  if (getIsMapEditor()) {
    addMapEditorHandlers();
    return;
  }
  addReplayHandlers();
  addGameHandlers();
}

/**
 * Add all handlers that will intercept clicks and functions on the map editor.
 */
function addMapEditorHandlers() {
  designMapEditor.updateCursor = onCursorMove;
}

/**
 * Syncs the music with the game state. Also randomizes the COs if needed.
 * @param playDelayMS - The delay in milliseconds before the theme song starts playing.
 */
function refreshMusic(playDelayMS = 0) {
  visibilityMap.clear();
  musicPlayerSettings.currentRandomCO = getRandomCO();
  musicPlayerSettings.themeType = getCurrentThemeType();
  setTimeout(playThemeSong, playDelayMS);
}

/**
 * Add all handlers that will intercept clicks and functions when watching a replay.
 */
function addReplayHandlers() {
  const replayForwardActionBtn = getReplayForwardActionBtn();
  const replayBackwardActionBtn = getReplayBackwardActionBtn();
  const replayForwardBtn = getReplayForwardBtn();
  const replayBackwardBtn = getReplayBackwardBtn();
  const replayOpenBtn = getReplayOpenBtn();
  const replayCloseBtn = getReplayCloseBtn();
  const replayDaySelectorCheckBox = getReplayDaySelectorCheckBox();

  // Keep the music in sync when moving one step at a time
  const replaySyncMusic = () => setTimeout(playThemeSong, 500);
  replayBackwardActionBtn.addEventListener("click", replaySyncMusic);
  replayForwardActionBtn.addEventListener("click", replaySyncMusic);

  // This makes sure when randomizing the COs, the music changes as well
  const replayChangeTurn = () => refreshMusic(500);
  replayForwardBtn.addEventListener("click", replayChangeTurn);
  replayBackwardBtn.addEventListener("click", replayChangeTurn);
  replayOpenBtn.addEventListener("click", replayChangeTurn);
  replayCloseBtn.addEventListener("click", replayChangeTurn);
  replayDaySelectorCheckBox.addEventListener("click", replayChangeTurn);
}

/**
 * Add all handlers that will intercept clicks and functions during a game.
 */
function addGameHandlers() {
  updateCursor = onCursorMove;
  openMenu = onOpenMenu;
  closeMenu = onCloseMenu;
  unitClickHandler = onUnitClick;
  waitUnit = onUnitWait;
  animUnit = onAnimUnit;
  animExplosion = onAnimExplosion;
  updateAirUnitFogOnMove = onFogUpdate;

  actionHandlers.Fire = onFire;
  actionHandlers.AttackSeam = onAttackSeam;
  actionHandlers.Move = onMove;
  actionHandlers.Capt = onCapture;
  actionHandlers.Build = onBuild;
  actionHandlers.Load = onLoad;
  actionHandlers.Unload = onUnload;
  actionHandlers.Supply = onSupply;
  actionHandlers.Repair = onRepair;
  actionHandlers.Hide = onHide;
  actionHandlers.Unhide = onUnhide;
  actionHandlers.Join = onJoin;
  actionHandlers.Launch = onLaunch;
  actionHandlers.NextTurn = onNextTurn;
  actionHandlers.Elimination = onElimination;
  actionHandlers.Power = onPower;
  actionHandlers.GameOver = onGameOver;
}

function onCursorMove(cursorX: number, cursorY: number) {
  ahCursorMove?.apply(ahCursorMove, [cursorX, cursorY]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Cursor Move", cursorX, cursorY);

  let dx = Math.abs(cursorX - lastCursorX);
  let dy = Math.abs(cursorY - lastCursorY);
  let cursorMoved = dx >= 1 || dy >= 1;
  let timeSinceLastCursorCall = Date.now() - lastCursorCall;

  // Don't play the sound if we moved the cursor too quickly
  if (timeSinceLastCursorCall < CURSOR_THRESHOLD_MS) return;

  if (cursorMoved) {
    playSFX(GameSFX.uiCursorMove);
    lastCursorCall = Date.now();
  }
  lastCursorX = cursorX;
  lastCursorY = cursorY;
}

function onOpenMenu(menu: HTMLDivElement, x: number, y: number) {
  ahOpenMenu?.apply(openMenu, [menu, x, y]);
  if (!musicPlayerSettings.isPlaying) return;
  console.debug("[MP] Open Menu", menu, x, y);

  menuOpen = true;
  playSFX(GameSFX.uiMenuOpen);

  let menuOptions = document.getElementsByClassName("menu-option");
  for (var i = 0; i < menuOptions.length; i++) {
    menuOptions[i].addEventListener("mouseenter", (_e) => playSFX(GameSFX.uiMenuMove));
    menuOptions[i].addEventListener("click", (_e) => {
      menuOpen = false;
      playSFX(GameSFX.uiMenuOpen);
    });
  }
}

function onCloseMenu() {
  ahCloseMenu?.apply(closeMenu, []);
  if (!musicPlayerSettings.isPlaying) return;
  console.debug("[MP] CloseMenu", menuOpen);

  // let confirmedAction = menuOpen && menuItemClick === MenuClickType.MenuItem;
  // let canceledAction = menuOpen && menuItemClick === MenuClickType.None;
  // let canceledUnitAction = !menuOpen && getCurrentClickData()?.type === "unit" && menuItemClick !== MenuClickType.None;
  // // console.debug(
  // //   "Actions",
  // //   confirmedAction,
  // //   canceledAction,
  // //   canceledUnitAction,
  // //   getCurrentClickData()?.type,
  // // );
  // if (confirmedAction) {
  //   // playSFX(GameSFX.uiMenuOpen);
  //   menuItemClick = MenuClickType.None;
  // } else if (canceledAction || canceledUnitAction) {
  //   // playSFX(GameSFX.uiMenuClose);
  //   menuItemClick = MenuClickType.None;
  // }
  // menuOpen = false;
  menuOpen = false;
}

function onUnitClick(clicked: any) {
  ahUnitClick?.apply(unitClickHandler, [clicked]);
  if (!musicPlayerSettings.isPlaying) return;
  console.debug("[MP] Unit Click", clicked);

  menuItemClick = MenuClickType.Unit;
  playSFX(GameSFX.uiUnitSelect);
}

function onUnitWait(unitId: number) {
  ahWait?.apply(waitUnit, [unitId]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Wait", unitId, getUnitName(unitId));

  stopMovementSound(unitId);
  // Check if we stopped because we got trapped
  if (movementResponseMap.has(unitId)) {
    let response = movementResponseMap.get(unitId);
    if (response?.trapped) {
      playSFX(GameSFX.unitTrap);
    }
    movementResponseMap.delete(unitId);
  }
}

function onAnimUnit(
  path: PathInfo[],
  unitId: number,
  unitSpan: HTMLSpanElement,
  unitTeam: number,
  viewerTeam: number,
  i: number,
) {
  ahAnimUnit?.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] AnimUnit", path, unitId, unitSpan, unitTeam, viewerTeam, i);

  // Only check if valid
  if (!isValidUnit(unitId) || !path || !i) return;
  // Don't go outside the bounds of the path
  if (i >= path.length) return;
  // The unit disappeared already, no need to stop its sound again
  if (visibilityMap.has(unitId)) return;
  // A visible unit just disappeared
  let unitVisible = path[i].unit_visible;
  if (!unitVisible) {
    visibilityMap.set(unitId, unitVisible);
    // Stop the sound after a little delay, giving more time to react to it
    setTimeout(() => stopMovementSound(unitId, false), 1000);
  }
}

function onAnimExplosion(unit: UnitInfo) {
  ahAnimExplosion?.apply(animExplosion, [unit]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("Exploded", unit);

  let unitId = unit.units_id;
  let unitFuel = unit.units_fuel;
  let sfx = GameSFX.unitExplode;
  if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
    sfx = GameSFX.unitMissileHit;
  }
  playSFX(sfx);
  stopMovementSound(unitId, false);
}

function onFogUpdate(
  x: number,
  y: number,
  mType: any,
  neighbours: any[],
  unitVisible: boolean,
  change: string,
  delay: number,
) {
  ahFog?.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Fog", x, y, mType, neighbours, unitVisible, change, delay);

  let unitInfo = getUnitInfoFromCoords(x, y);
  if (!unitInfo) return;
  if (change === "Add") {
    setTimeout(() => stopMovementSound(unitInfo.units_id, false), delay);
  }
}

function onFire(response: FireResponse) {
  if (!musicPlayerSettings.isPlaying) {
    ahFire?.apply(actionHandlers.Fire, [response]);
    return;
  }
  // console.debug("[MP] Fire", response);

  let attackerID = response.copValues.attacker.playerId;
  let defenderID = response.copValues.defender.playerId;
  // Let the user hear a confirmation sound
  // if (currentPlayer.info.players_id == attackerID) {
  //   playSFX(gameSFX.uiMenuOpen);
  // }

  // Calculate charge before attack
  let couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
  let couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
  let couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
  let couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);

  // Let the attack proceed normally
  ahFire?.apply(actionHandlers.Fire, [response]);

  // Check if the attack gave enough charge for a power to either side
  // Give it a little bit of time for the animation if needed
  var delay = areAnimationsEnabled() ? 750 : 0;
  let canAttackerActivateSCOPAfter = canPlayerActivateSuperCOPower(attackerID);
  let canAttackerActivateCOPAfter = canPlayerActivateCOPower(attackerID);
  let canDefenderActivateSCOPAfter = canPlayerActivateSuperCOPower(defenderID);
  let canDefenderActivateCOPAfter = canPlayerActivateCOPower(defenderID);
  let madeSCOPAvailable =
    (!couldAttackerActivateSCOPBefore && canAttackerActivateSCOPAfter) ||
    (!couldDefenderActivateSCOPBefore && canDefenderActivateSCOPAfter);
  let madeCOPAvailable =
    (!couldAttackerActivateCOPBefore && canAttackerActivateCOPAfter) ||
    (!couldDefenderActivateCOPBefore && canDefenderActivateCOPAfter);

  setTimeout(() => {
    if (madeSCOPAvailable) playSFX(GameSFX.powerSCOPAvailable);
    else if (madeCOPAvailable) playSFX(GameSFX.powerCOPAvailable);
  }, delay);
}

function onAttackSeam(response: SeamResponse) {
  ahAttackSeam?.apply(actionHandlers.AttackSeam, [response]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] AttackSeam", response);

  // Pipe wiggle animation
  if (areAnimationsEnabled()) {
    let x = response.seamX;
    let y = response.seamY;
    if (!isValidBuilding(x, y)) return;

    let pipeSeamInfo = getBuildingInfo(x, y);
    let pipeSeamDiv = getBuildingDiv(pipeSeamInfo.buildings_id);
    let stepsX = 12;
    let stepsY = 4;
    let deltaX = 0.2;
    let deltaY = 0.05;
    let wiggleAnimation = () => {
      moveDivToOffset(
        pipeSeamDiv,
        deltaX,
        0,
        stepsX,
        { then: [0, -deltaY, stepsY] },
        { then: [-deltaX * 2, 0, stepsX] },
        { then: [deltaX * 2, 0, stepsX] },
        { then: [0, -deltaY, stepsY] },
        { then: [-deltaX * 2, 0, stepsX] },
        { then: [deltaX * 2, 0, stepsX] },
        { then: [0, deltaY, stepsY] },
        { then: [-deltaX * 2, 0, stepsX] },
        { then: [deltaX, 0, stepsX] },
        { then: [0, deltaY, stepsY] },
      );
    };
    // Subtract how long the wiggle takes so it matches the sound a bit better
    setTimeout(wiggleAnimation, attackDelayMS);
  }
  if (response.seamHp <= 0) {
    playSFX(GameSFX.unitAttackPipeSeam);
    playSFX(GameSFX.unitExplode);
    return;
  }
  setTimeout(() => playSFX(GameSFX.unitAttackPipeSeam), attackDelayMS);
}

function onMove(response: MoveResponse, loadFlag: any) {
  ahMove?.apply(actionHandlers.Move, [response, loadFlag]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Move", response, loadFlag);

  let unitId = response.unit.units_id;
  movementResponseMap.set(unitId, response);
  var movementDist = response.path.length;
  if (movementDist > 1) {
    playMovementSound(unitId);
  }
}

function onCapture(data: CaptureData) {
  ahCapt?.apply(actionHandlers.Capt, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Capt", data);

  // They didn't finish the capture
  let finishedCapture = data.newIncome != null;
  if (!finishedCapture) {
    playSFX(GameSFX.unitCaptureProgress);
    return;
  }
  // The unit is done capping this property
  let myID = getMyID();
  let isSpectator = isPlayerSpectator(myID);

  // Don't use triple equals here because the types are different
  // buildings_team (string) == id (number)
  let isMyCapture = data.buildingInfo.buildings_team == myID || isSpectator;
  let sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
  playSFX(sfx);
}

function onBuild(data: BuildData) {
  ahBuild?.apply(actionHandlers.Build, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Build", data);

  let myID = getMyID();
  let isMyBuild = data.newUnit.units_players_id == myID;
  if (!isMyBuild) playSFX(GameSFX.unitSupply);
}

function onLoad(data: LoadData) {
  ahLoad?.apply(actionHandlers.Load, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Load", data);

  playSFX(GameSFX.unitLoad);
}

function onUnload(data: UnloadData) {
  ahUnload?.apply(actionHandlers.Unload, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Unload", data);

  playSFX(GameSFX.unitUnload);
}

function onSupply(data: SupplyData) {
  ahSupply?.apply(actionHandlers.Supply, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Supply", data);

  // We could play the sfx for each supplied unit in the list
  // but instead we decided to play the supply sound once.
  playSFX(GameSFX.unitSupply);
}

function onRepair(data: RepairData) {
  ahRepair?.apply(actionHandlers.Repair, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Repair", data);

  playSFX(GameSFX.unitSupply);
}

function onHide(data: HideData) {
  ahHide?.apply(actionHandlers.Hide, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Hide", data);
  playSFX(GameSFX.unitHide);

  stopMovementSound(data.unitId);
}

function onUnhide(data: UnhideData) {
  ahUnhide?.apply(actionHandlers.Unhide, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Unhide", data);

  playSFX(GameSFX.unitUnhide);
  stopMovementSound(data.unitId);
}

function onJoin(data: JoinData) {
  ahJoin?.apply(actionHandlers.Join, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Join", data);

  stopMovementSound(data.joinID);
  stopMovementSound(data.joinedUnit.units_id);
}

function onLaunch(data: LaunchData) {
  ahLaunch?.apply(actionHandlers.Launch, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Launch", data);

  playSFX(GameSFX.unitMissileSend);
  setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
}

function onNextTurn(data: NextTurnData) {
  ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] NextTurn", data);

  if (data.swapCos) {
    playSFX(GameSFX.tagSwap);
  }
  refreshMusic();
}

function onElimination(data: EliminationData) {
  ahElimination?.apply(actionHandlers.Elimination, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Elimination", data);
}

function onPower(data: PowerData) {
  ahPower?.apply(actionHandlers.Power, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  //console.debug("[MP] Power", data);

  // Match name to our internal name format
  let coName = data.coName.toLowerCase().replaceAll(" ", "");
  let isBH = isBlackHoleCO(coName);
  let isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;
  // Update the theme type
  musicPlayerSettings.themeType = isSuperCOPower ? SettingsThemeType.SUPER_CO_POWER : SettingsThemeType.CO_POWER;
  switch (musicPlayerSettings.gameType) {
    case SettingsGameType.AW1:
      // Advance Wars 1 will use the same sound for both CO and Super CO power activations
      playSFX(GameSFX.powerActivateAW1COP);
      stopThemeSong(4500);
      return;
    case SettingsGameType.AW2:
    case SettingsGameType.DS:
      // Super CO Power
      if (isSuperCOPower) {
        let sfx = isBH ? GameSFX.powerActivateBHSCOP : GameSFX.powerActivateAllySCOP;
        playSFX(sfx);
        stopThemeSong(850);
        break;
      }
      // Regular CO Power
      let sfx = isBH ? GameSFX.powerActivateBHCOP : GameSFX.powerActivateAllyCOP;
      playSFX(sfx);
      stopThemeSong(500);
      break;
    case SettingsGameType.RBC:
      break;
  }
  // Colin's gold rush SFX for AW2, DS, and RBC
  if (coName === "colin") {
    setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
  }
}

function onGameOver() {
  ahGameOver?.apply(actionHandlers.GameOver, []);
  if (!musicPlayerSettings.isPlaying) return;

  playThemeSong(true);
}
