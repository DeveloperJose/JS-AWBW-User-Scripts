/**
 * @file This file contains all the AWBW website handlers that will intercept clicks and any relevant functions of the website.
 */
import {
  replayForwardBtn,
  replayForwardActionBtn,
  replayBackwardBtn,
  replayBackwardActionBtn,
  replayOpenBtn,
  replayCloseBtn,
  replayDaySelectorCheckBox,
  canPlayerActivateSuperCOPower,
  canPlayerActivateCOPower,
  gameAnimations,
  getMyID,
  isPlayerSpectator,
  siloDelayMS,
  attackDelayMS,
  isValidBuilding,
  getBuildingInfo,
  getBuildingDiv,
  moveDivToOffset,
  isValidUnit,
  getUnitName,
  getUnitInfoFromCoords,
} from "../shared/awbw_site";
import {
  playThemeSong,
  playSFX,
  stopMovementSound,
  playMovementSound,
  stopThemeSong,
} from "./music";
import { musicPlayerSettings } from "./music_settings";
import { GameSFX } from "./resources";
import { isBlackHoleCO } from "../shared/awbw_site";

/**
 * @callback ahCursorMove
 * @param {number} cursorX -
 * @param {number} cursorY -
 */

/**
 * How long to wait in milliseconds before we register a cursor movement.
 * Used to prevent overwhelming the user with too many cursor movement sound effects.
 * @constant
 * @type {number}
 */
const CURSOR_THRESHOLD_MS = 25;

/**
 * Date representing when we last moved the game cursor.
 * @type {number}
 */
let lastCursorCall = Date.now();

const MenuClickType = {
  None: "None",
  Unit: "Unit",
  MenuItem: "MenuItem",
};

let menuItemClick = MenuClickType.None;
let menuOpen = false;

let visibilityMap = new Map();
let movementResponseMap = new Map();

/**
 * Add all handlers that will intercept clicks and functions on the website
 */
export function addSiteHandlers() {
  // Replay Handlers
  let refreshMusic = () => {
    setTimeout(playThemeSong, 500);
    visibilityMap.clear();
  };
  replayForwardBtn.addEventListener("click", refreshMusic);
  replayForwardActionBtn.addEventListener("click", refreshMusic);
  replayBackwardBtn.addEventListener("click", refreshMusic);
  replayBackwardActionBtn.addEventListener("click", refreshMusic);
  replayOpenBtn.addEventListener("click", refreshMusic);
  replayCloseBtn.addEventListener("click", refreshMusic);
  replayDaySelectorCheckBox.addEventListener("click", refreshMusic);

  // Action Handlers
  /* global updateCursor:writeable */
  /* global openMenu:writeable */
  /* global closeMenu:writeable */
  /* global unitClickHandler:writeable */
  /* global waitUnit:writeable */
  /* global animUnit:writeable */
  /* global animExplosion:writeable */
  /* global updateAirUnitFogOnMove:writeable */

  let ahOpenMenu = openMenu;
  let ahCursorMove = updateCursor;
  let ahCloseMenu = closeMenu;
  let ahUnitClick = unitClickHandler;
  let ahWait = waitUnit;
  let ahAnimUnit = animUnit;
  let ahExplodeAnim = animExplosion;
  let ahFog = updateAirUnitFogOnMove;

  // Catches both actionHandlers.Delete and actionHandlers.Explode
  /* global actionHandlers:writeable */
  let ahFire = actionHandlers.Fire;
  let ahAttackSeam = actionHandlers.AttackSeam;
  let ahMove = actionHandlers.Move;
  let ahCapt = actionHandlers.Capt;
  let ahBuild = actionHandlers.Build;
  let ahLoad = actionHandlers.Load;
  let ahUnload = actionHandlers.Unload;
  let ahSupply = actionHandlers.Supply;
  let ahRepair = actionHandlers.Repair;
  let ahHide = actionHandlers.Hide;
  let ahUnhide = actionHandlers.Unhide;
  let ahJoin = actionHandlers.Join;
  // let ahDelete = actionHandlers.Delete;
  // let ahExplode = actionHandlers.Explode;
  let ahLaunch = actionHandlers.Launch;
  let ahNextTurn = actionHandlers.NextTurn;
  let ahElimination = actionHandlers.Elimination;
  let ahPower = actionHandlers.Power;
  // let ahSetDraw = actionHandlers.SetDraw;
  // let ahResign = actionHandlers.Resign;
  let ahGameOver = actionHandlers.GameOver;

  /**
   * Function called when the cursor is moved in the game.
   * @param {number} cursorX - The x coordinate of the cursor inside the game grid.
   * @param {number} cursorY - The y coordinate of the cursor inside the game grid.
   */
  updateCursor = (cursorX, cursorY) => {
    ahCursorMove.apply(updateCursor, [cursorX, cursorY]);
    if (!musicPlayerSettings.isPlaying) return;

    if (Date.now() - lastCursorCall > CURSOR_THRESHOLD_MS) {
      playSFX(GameSFX.uiCursorMove);
    }
    lastCursorCall = Date.now();
  };

  /**
   * Function called when the action menu is opened after you move a unit.
   * @param {HTMLDivElement} menu -
   * @param {number} x -
   * @param {number} y -
   */
  openMenu = (menu, x, y) => {
    ahOpenMenu.apply(openMenu, [menu, x, y]);
    if (!musicPlayerSettings.isPlaying) return;

    let menuOptions = document.getElementsByClassName("menu-option");
    console.log("Open menu", menuOptions[0]);
    for (var i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseenter", (_event) => {
        console.log("Listener", _event);
        playSFX(GameSFX.uiMenuMove);
      });

      menuOptions[i].addEventListener(
        "click",
        (_event) => (menuItemClick = MenuClickType.MenuItem),
      );
    }

    menuOpen = true;
    playSFX(GameSFX.uiMenuOpen);
  };

  /**
   * Function called when the action menu is closed after you select an action or cancel.
   */
  closeMenu = () => {
    ahCloseMenu.apply(closeMenu, []);
    console.log("CloseMenu", menuOpen, menuItemClick);
    if (!musicPlayerSettings.isPlaying) return;

    if (menuOpen && !menuItemClick) {
      playSFX(GameSFX.uiMenuClose);
    } else if (menuOpen && menuItemClick) {
      playSFX(GameSFX.uiMenuOpen);
    } else if (menuItemClick) {
      playSFX(GameSFX.uiMenuClose);
    }

    menuOpen = false;
    menuItemClick = MenuClickType.None;
  };

  unitClickHandler = (clicked) => {
    ahUnitClick.apply(unitClickHandler, [clicked]);
    if (!musicPlayerSettings.isPlaying) return;
    menuItemClick = MenuClickType.Unit;

    playSFX(GameSFX.uiUnitSelect);
  };

  waitUnit = (unitId) => {
    ahWait.apply(waitUnit, [unitId]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.log("Wait", unitId, getUnitName(unitId));

    stopMovementSound(unitId);
    // Check if we stopped because we got trapped
    if (movementResponseMap.has(unitId)) {
      let response = movementResponseMap.get(unitId);
      if (response.trapped) {
        playSFX(GameSFX.actionUnitTrap);
      }
      movementResponseMap.delete(unitId);
    }
  };

  animUnit = (path, unitId, unitSpan, unitTeam, viewerTeam, i) => {
    ahAnimUnit.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);

    if (!musicPlayerSettings.isPlaying) return;
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
  };

  /**
   * @param {import("../shared/awbw_site").UnitInfo} unit - Unit info for the unit that will explode.
   */
  animExplosion = (unit) => {
    ahExplodeAnim.apply(animExplosion, [unit]);
    if (!musicPlayerSettings.isPlaying) return;

    // console.log("Exploded", unit);
    let unitId = unit.units_id;
    let unitFuel = unit.units_fuel;
    let sfx = GameSFX.actionUnitExplode;
    if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
      sfx = GameSFX.actionMissileHit;
    }
    playSFX(sfx);
    stopMovementSound(unitId, false);
  };

  updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change, delay) => {
    ahFog.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
    if (!musicPlayerSettings.isPlaying) return;

    let unitInfo = getUnitInfoFromCoords(x, y);
    if (change === "Add") {
      setTimeout(() => stopMovementSound(unitInfo.units_id, false), delay);
    }
  };

  actionHandlers.Fire = (fireResponse) => {
    if (!musicPlayerSettings.isPlaying) {
      ahFire.apply(actionHandlers.Fire, [fireResponse]);
      return;
    }

    let attackerID = fireResponse.copValues.attacker.playerId;
    let defenderID = fireResponse.copValues.defender.playerId;

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
    ahFire.apply(actionHandlers.Fire, [fireResponse]);

    // Check if the attack gave enough charge for a power to either side
    // Give it a little bit of time for the animation if needed
    var delay = gameAnimations ? 750 : 0;
    setTimeout(() => {
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

      if (madeSCOPAvailable) {
        playSFX(GameSFX.actionSuperCOPowerAvailable);
      } else if (madeCOPAvailable) {
        playSFX(GameSFX.actionCOPowerAvailable);
      }
    }, delay);
  };

  /**
   * @param {import("../shared/awbw_site").SeamResponse} seamResponse
   */
  actionHandlers.AttackSeam = (seamResponse) => {
    ahAttackSeam.apply(actionHandlers.AttackSeam, [seamResponse]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.log("Pipe seam", seamResponse);

    // Pipe wiggle animation
    if (gameAnimations) {
      let x = seamResponse.seamX;
      let y = seamResponse.seamY;
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
      setTimeout(wiggleAnimation, attackDelayMS);
    }

    if (seamResponse.seamHp <= 0) {
      playSFX(GameSFX.actionUnitAttackPipeSeam);
      playSFX(GameSFX.actionUnitExplode);
      return;
    }
    setTimeout(() => playSFX(GameSFX.actionUnitAttackPipeSeam), attackDelayMS);
  };

  actionHandlers.Move = (moveResponse, loadFlag) => {
    ahMove.apply(actionHandlers.Move, [moveResponse, loadFlag]);
    if (!musicPlayerSettings.isPlaying) return;

    let unitId = moveResponse.unit.units_id;
    movementResponseMap.set(unitId, moveResponse);
    // console.log("Move", moveResponse);

    var movementDist = moveResponse.path.length;
    if (movementDist > 1) {
      playMovementSound(unitId);
    }
  };

  actionHandlers.Capt = (captData) => {
    ahCapt.apply(actionHandlers.Capt, [captData]);
    if (!musicPlayerSettings.isPlaying) return;

    let isValid = captData != undefined;
    if (!isValid) return;

    // They didn't finish the capture
    let finishedCapture = captData.newIncome != null;
    if (!finishedCapture) {
      playSFX(GameSFX.actionCaptureProgress);
      return;
    }

    // The unit is done capping this property
    let myID = getMyID();
    let isSpectator = isPlayerSpectator(myID);
    console.log(isSpectator, captData.buildingInfo.buildings_team, myID);
    // buildings_team (string) == id (number)
    let isMyCapture = isSpectator || captData.buildingInfo.buildings_team == myID;
    let sfx = isMyCapture ? GameSFX.actionCaptureAlly : GameSFX.actionCaptureEnemy;
    playSFX(sfx);
  };

  actionHandlers.Build = (buildData) => {
    ahBuild.apply(actionHandlers.Build, [buildData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(GameSFX.actionUnitSupply);
  };

  actionHandlers.Load = (loadData) => {
    ahLoad.apply(actionHandlers.Load, [loadData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(GameSFX.actionUnitLoad);
  };

  actionHandlers.Unload = (unloadData) => {
    ahUnload.apply(actionHandlers.Unload, [unloadData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(GameSFX.actionUnitUnload);
  };

  actionHandlers.Supply = (supplyRes) => {
    ahSupply.apply(actionHandlers.Supply, [supplyRes]);
    if (!musicPlayerSettings.isPlaying) return;

    // We could play the sfx for each supplied unit in the list
    // but instead we decided to play the supply sound once.
    playSFX(GameSFX.actionUnitSupply);
  };

  actionHandlers.Repair = (repairData) => {
    ahRepair.apply(actionHandlers.Repair, [repairData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(GameSFX.actionUnitSupply);
  };

  actionHandlers.Hide = (hideData) => {
    ahHide.apply(actionHandlers.Hide, [hideData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(GameSFX.actionUnitHide);
    // console.log("Hide", hideData, hideData.unitId, hideData.unitID);
    stopMovementSound(hideData.unitId);
  };

  actionHandlers.Unhide = (unhideData) => {
    ahUnhide.apply(actionHandlers.Unhide, [unhideData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(GameSFX.actionUnitUnhide);
    stopMovementSound(unhideData.unitId);
  };

  actionHandlers.Join = (joinData) => {
    ahJoin.apply(actionHandlers.Join, [joinData]);
    if (!musicPlayerSettings.isPlaying) return;
    stopMovementSound(joinData.joinID);
    stopMovementSound(joinData.joinedUnit.units_id);
  };

  // actionHandlers.Delete = (deleteData) => {
  //   ahDelete.apply(actionHandlers.Delete, [deleteData]);
  // };

  // actionHandlers.Explode = (data) => {
  //   ahExplode.apply(actionHandlers.Explode, [data]);
  // };

  actionHandlers.Launch = (data) => {
    ahLaunch.apply(actionHandlers.Launch, [data]);
    if (!musicPlayerSettings.isPlaying) return;

    playSFX(GameSFX.actionMissileSend);
    setTimeout(() => playSFX(GameSFX.actionMissileHit), siloDelayMS);
  };

  actionHandlers.NextTurn = (nextTurnRes) => {
    ahNextTurn.apply(actionHandlers.NextTurn, [nextTurnRes]);
    if (!musicPlayerSettings.isPlaying) return;

    visibilityMap.clear();
    playThemeSong();
  };

  actionHandlers.Elimination = (eliminationRes) => {
    ahElimination.apply(actionHandlers.Elimination, [eliminationRes]);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;
  };

  actionHandlers.Power = (powerRes) => {
    ahPower.apply(actionHandlers.Power, [powerRes]);
    if (!musicPlayerSettings.isPlaying) return;

    let coName = powerRes.coName;
    let isSuperCOPower = powerRes.coPower === "S";
    let isBH = isBlackHoleCO(coName);

    if (isSuperCOPower) {
      let sfx = isBH ? GameSFX.actionBHActivateSCOP : GameSFX.actionAllyActivateSCOP;
      playSFX(sfx);
      stopThemeSong(2500);
    }
  };

  // actionHandlers.SetDraw = (drawData) => {
  //   ahSetDraw.apply(actionHandlers.SetDraw, [drawData]);
  //   debugger;
  // };

  // actionHandlers.Resign = (resignRes) => {
  //   ahResign.apply(actionHandlers.Resign, [resignRes]);
  //   debugger;
  // }

  actionHandlers.GameOver = () => {
    ahGameOver.apply(actionHandlers.GameOver, []);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;
  };
}
