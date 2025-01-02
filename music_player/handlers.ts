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
  currentPlayer,
  hasGameEnded,
  isReplayActive,
  getUnitInfo,
  hasUnitMovedThisTurn,
} from "../shared/awbw_game";
import {
  getAllDamageSquares,
  getCoordsDiv,
  getIsMaintenance,
  getIsMapEditor,
  getIsMovePlanner,
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
import {
  playThemeSong,
  playSFX,
  stopMovementSound,
  playMovementSound,
  stopThemeSong,
  stopAllMovementSounds,
} from "./music";
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
  getCreateDamageSquaresFn,
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
  getQueryTurnFn,
  getRepairFn,
  getResetAttackFn,
  getShowEventScreenFn,
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

enum MenuOpenType {
  None = "None",
  DamageSquare = "DamageSquare",
  Regular = "Regular",
  UnitSelect = "UnitSelect",
}

let currentMenuType = MenuOpenType.None;

/**
 * Map of unit IDs to their visibility status. Used to check if a unit that was visible disappeared in the fog.
 */
let visibilityMap: Map<number, boolean> = new Map();

/**
 * Map of unit IDs to their movement responses. Used to check if a unit got trapped.
 */
let movementResponseMap: Map<number, MoveResponse> = new Map();

let clickedDamageSquaresMap: Map<HTMLSpanElement, boolean> = new Map();

// Store a copy of all the original functions we are going to override
let ahCursorMove = getCursorMoveFn();
let ahQueryTurn = getQueryTurnFn();
let ahShowEventScreen = getShowEventScreenFn();
// let ahSwapCosDisplay = getSwapCosDisplayFn();
let ahOpenMenu = getOpenMenuFn();
let ahCloseMenu = getCloseMenuFn();
let ahCreateDamageSquares = getCreateDamageSquaresFn();
// let ahResetAttack = getResetAttackFn();
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
// let ahElimination = getEliminationFn();
let ahPower = getPowerFn();
// let ahGameOver = getGameOverFn();

/**
 * Intercept functions and add our own handlers to the website.
 */
export function addHandlers() {
  if (getIsMaintenance()) return;

  if (getIsMapEditor()) {
    addMapEditorHandlers();
    return;
  }

  if (getIsMovePlanner()) {
    addMovePlannerHandlers();
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

function addMovePlannerHandlers() {
  closeMenu = onCloseMenu;

  // updateCursor
  const coordsDiv = getCoordsDiv();
  // Catch when div textContent is changed
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type !== "childList") return;
      if (!mutation.target) return;
      if (!mutation.target.textContent) return;

      // (X, Y)
      let coordsText = mutation.target.textContent;

      // Remove parentheses and split by comma
      coordsText = coordsText.substring(1, coordsText.length - 1);
      const splitCoords = coordsText.split(",");

      const cursorX = Number(splitCoords[0]);
      const cursorY = Number(splitCoords[1]);
      onCursorMove(cursorX, cursorY);
    }
  });
  observer.observe(coordsDiv, { childList: true });
}

/**
 * Syncs the music with the game state. Also randomizes the COs if needed.
 * @param playDelayMS - The delay in milliseconds before the theme song starts playing.
 */
function refreshMusicForNextTurn(playDelayMS = 0) {
  // It's a new turn, so we need to clear the visibility map, randomize COs, and play the theme song
  visibilityMap.clear();
  musicPlayerSettings.currentRandomCO = getRandomCO();
  setTimeout(() => {
    musicPlayerSettings.themeType = getCurrentThemeType();
    playThemeSong();
  }, playDelayMS);
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

  // Keep the music in sync
  const syncMusic = () => setTimeout(playThemeSong, 500);
  replayBackwardActionBtn.addEventListener("click", syncMusic);
  replayForwardActionBtn.addEventListener("click", syncMusic);

  // Stop all movement sounds when we are going fast
  // Randomize COs when we move a full turn
  const replayChangeTurn = () => refreshMusicForNextTurn(500);
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
  queryTurn = onQueryTurn;
  showEventScreen = onShowEventScreen;
  openMenu = onOpenMenu;
  closeMenu = onCloseMenu;
  createDamageSquares = onCreateDamageSquares;
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
  // actionHandlers.Elimination = onElimination;
  actionHandlers.Power = onPower;
  // actionHandlers.GameOver = onGameOver;
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

function onQueryTurn(
  gameId: number,
  turn: number,
  turnPId: number,
  turnDay: number,
  replay: ReplayObject[],
  initial: boolean,
) {
  let result = ahQueryTurn?.apply(ahQueryTurn, [gameId, turn, turnPId, turnDay, replay, initial]);
  if (!musicPlayerSettings.isPlaying) return result;
  // console.log("[MP] Query Turn", gameId, turn, turnPId, turnDay, replay, initial);

  refreshMusicForNextTurn();
  return result;
}

function onShowEventScreen(event: ShowEventScreenData) {
  ahShowEventScreen?.apply(ahShowEventScreen, [event]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Show Event Screen", event);
  playThemeSong();
}

function onOpenMenu(menu: HTMLDivElement, x: number, y: number) {
  ahOpenMenu?.apply(openMenu, [menu, x, y]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Open Menu", menu, x, y);

  currentMenuType = MenuOpenType.Regular;
  playSFX(GameSFX.uiMenuOpen);

  let menuOptions = document.getElementsByClassName("menu-option");
  for (var i = 0; i < menuOptions.length; i++) {
    menuOptions[i].addEventListener("mouseenter", (_e) => playSFX(GameSFX.uiMenuMove));
    menuOptions[i].addEventListener("click", (event) => {
      const target = event.target as HTMLDivElement;
      if (!target) return;

      // Check if we clicked on a unit we cannot buy
      if (target.classList.contains("forbidden")) {
        playSFX(GameSFX.uiInvalid);
        return;
      }
      currentMenuType = MenuOpenType.None;
      playSFX(GameSFX.uiMenuOpen);
    });
  }
}

function onCloseMenu() {
  ahCloseMenu?.apply(closeMenu, []);
  if (!musicPlayerSettings.isPlaying) return;

  const isMenuOpen = currentMenuType !== MenuOpenType.None;
  // console.debug("[MP] CloseMenu", currentMenuType, isMenuOpen);
  if (isMenuOpen) {
    playSFX(GameSFX.uiMenuClose);
    clickedDamageSquaresMap.clear();
    currentMenuType = MenuOpenType.None;
  }
}

function onCreateDamageSquares(attackerUnit: UnitInfo, unitsInRange: UnitInfo[], movementInfo: any, movingUnit: any) {
  ahCreateDamageSquares?.apply(createDamageSquares, [attackerUnit, unitsInRange, movementInfo, movingUnit]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Create Damage Squares", attackerUnit, unitsInRange, movementInfo, movingUnit);

  // Hook up to all new damage squares
  for (const damageSquare of getAllDamageSquares()) {
    damageSquare.addEventListener("click", (event) => {
      if (!event.target) return;
      const targetSpan = event.target as HTMLSpanElement;
      playSFX(GameSFX.uiMenuOpen);

      // If we have clicked this before, then this click is to finalize the attack so no more open menu
      if (clickedDamageSquaresMap.has(targetSpan)) {
        currentMenuType = MenuOpenType.None;
        clickedDamageSquaresMap.clear();
        return;
      }
      // If we haven't clicked this before, then consider it like opening a menu
      currentMenuType = MenuOpenType.DamageSquare;
      clickedDamageSquaresMap.set(targetSpan, true);
    });
  }
}

function onUnitClick(clicked: UnitClickData) {
  ahUnitClick?.apply(unitClickHandler, [clicked]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Unit Click", clicked);

  // Check if we clicked on a waited unit or an enemy unit, if so, no more actions can be taken
  const unitInfo = getUnitInfo(Number(clicked.id));
  const myID = getMyID();
  const isUnitWaited = hasUnitMovedThisTurn(unitInfo.units_id);
  const isMyUnit = unitInfo.units_players_id === myID;
  const canActionsBeTaken = !isUnitWaited && isMyUnit;

  // If action can be taken, then we can cancel out of that action
  currentMenuType = canActionsBeTaken ? MenuOpenType.UnitSelect : MenuOpenType.None;

  playSFX(GameSFX.uiUnitSelect);
}

function onUnitWait(unitId: number) {
  ahWait?.apply(waitUnit, [unitId]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Wait", unitId, getUnitName(unitId));

  // Check if we stopped because we got trapped
  if (movementResponseMap.has(unitId)) {
    let response = movementResponseMap.get(unitId);
    if (response?.trapped) {
      playSFX(GameSFX.unitTrap);
    }
    stopMovementSound(unitId, !response?.trapped);
    movementResponseMap.delete(unitId);
    return;
  }
  stopMovementSound(unitId);
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
    setTimeout(() => stopMovementSound(unitInfo.units_id, true), delay);
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
  // stopMovementSound(response.attacker.units_id, false);
  // stopMovementSound(response.defender.units_id, false);

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

/**
 * Moves a div back and forth to create a wiggle effect.
 * @param div - The div to wiggle.
 * @param startDelay - The delay in milliseconds before the wiggle starts.
 */
function wiggleTile(div: HTMLDivElement, startDelay = 0) {
  let stepsX = 12;
  let stepsY = 4;
  let deltaX = 0.2;
  let deltaY = 0.05;
  let wiggleAnimation = () => {
    moveDivToOffset(
      div,
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
  setTimeout(wiggleAnimation, startDelay);
}

function onAttackSeam(response: SeamResponse) {
  ahAttackSeam?.apply(actionHandlers.AttackSeam, [response]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] AttackSeam", response);
  let seamWasDestroyed = response.seamHp <= 0;

  // Pipe wiggle animation
  if (areAnimationsEnabled()) {
    let x = response.seamX;
    let y = response.seamY;
    let pipeSeamInfo = getBuildingInfo(x, y);
    let pipeSeamDiv = getBuildingDiv(pipeSeamInfo.buildings_id);

    // Subtract how long the wiggle takes so it matches the sound a bit better
    let wiggleDelay = seamWasDestroyed ? 0 : attackDelayMS;
    wiggleTile(pipeSeamDiv, wiggleDelay);
  }
  if (seamWasDestroyed) {
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
  stopMovementSound(unitId, false);

  if (movementDist > 1) {
    playMovementSound(unitId);
  }
}

function onCapture(data: CaptureData) {
  ahCapt?.apply(actionHandlers.Capt, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Capt", data);

  // They didn't finish the capture
  let finishedCapture = data.newIncome != null;
  if (!finishedCapture) {
    playSFX(GameSFX.unitCaptureProgress);
    return;
  }
  // The unit is done capping this property
  let myID = getMyID();
  let isSpectator = isPlayerSpectator(myID);

  // Don't use triple equals blindly here because the types are different
  // buildings_team (string) == id (number)
  let isMyCapture = data.buildingInfo.buildings_team === myID.toString() || isSpectator;
  let sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
  playSFX(sfx);
}

function onBuild(data: BuildData) {
  ahBuild?.apply(actionHandlers.Build, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Build", data);

  let myID = getMyID();
  let isMyBuild = data.newUnit.units_players_id == myID;
  let isReplay = isReplayActive();
  if (!isMyBuild || isReplay) playSFX(GameSFX.unitSupply);
}

function onLoad(data: LoadData) {
  ahLoad?.apply(actionHandlers.Load, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Load", data);

  playSFX(GameSFX.unitLoad);
}

function onUnload(data: UnloadData) {
  ahUnload?.apply(actionHandlers.Unload, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Unload", data);

  playSFX(GameSFX.unitUnload);
}

function onSupply(data: SupplyData) {
  ahSupply?.apply(actionHandlers.Supply, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Supply", data);

  // We could play the sfx for each supplied unit in the list
  // but instead we decided to play the supply sound once.
  playSFX(GameSFX.unitSupply);
}

function onRepair(data: RepairData) {
  ahRepair?.apply(actionHandlers.Repair, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Repair", data);

  playSFX(GameSFX.unitSupply);
}

function onHide(data: HideData) {
  ahHide?.apply(actionHandlers.Hide, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Hide", data);
  playSFX(GameSFX.unitHide);

  stopMovementSound(data.unitId);
}

function onUnhide(data: UnhideData) {
  ahUnhide?.apply(actionHandlers.Unhide, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Unhide", data);

  playSFX(GameSFX.unitUnhide);
  stopMovementSound(data.unitId);
}

function onJoin(data: JoinData) {
  ahJoin?.apply(actionHandlers.Join, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Join", data);

  stopMovementSound(data.joinID);
  stopMovementSound(data.joinedUnit.units_id);
}

function onLaunch(data: LaunchData) {
  ahLaunch?.apply(actionHandlers.Launch, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Launch", data);

  playSFX(GameSFX.unitMissileSend);
  setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
}

function onNextTurn(data: NextTurnData) {
  ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] NextTurn", data);

  if (data.swapCos) {
    playSFX(GameSFX.tagSwap);
  }

  refreshMusicForNextTurn();
}

function onPower(data: PowerData) {
  ahPower?.apply(actionHandlers.Power, [data]);
  if (!musicPlayerSettings.isPlaying) return;
  // console.debug("[MP] Power", data);

  // Remember, these are in title case with spaces like "Colin" or "Von Bolt"
  let coName = data.coName;
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
    case SettingsGameType.RBC:
      // Super CO Power
      if (isSuperCOPower) {
        let sfx = isBH ? GameSFX.powerActivateBHSCOP : GameSFX.powerActivateAllySCOP;
        let delay = isBH ? 1916 : 1100;
        playSFX(sfx);
        stopThemeSong(delay);
        break;
      }
      // Regular CO Power
      let sfx = isBH ? GameSFX.powerActivateBHCOP : GameSFX.powerActivateAllyCOP;
      let delay = isBH ? 1019 : 881;
      playSFX(sfx);
      stopThemeSong(delay);
      break;
  }
  // Colin's gold rush SFX for AW2, DS, and RBC
  if (coName === "Colin" && !isSuperCOPower) {
    setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
  }
}
