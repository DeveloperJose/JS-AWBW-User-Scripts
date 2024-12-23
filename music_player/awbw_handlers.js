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
} from "../shared/awbw_site";
import {
  playThemeSong,
  playSFX,
  stopMovementSound,
  playMovementSound,
  stopThemeSong,
} from "./music";
import { musicPlayerSettings } from "./music_settings";
import { gameSFX } from "./resources";
import { isBlackHoleCO } from "../shared/awbw_site";

/**
 * @callback ahCursorMove
 * @param {number} cursorX -
 * @param {number} cursorY -
 */

/**
 * How long to wait in milliseconds before we register a cursor movement.
 * Used to prevent overwhelming the user with too many cursor movement sound effects.
 * @type {number}
 */
const CURSOR_THRESHOLD_MS = 25;

/**
 * Date representing when we last moved the game cursor.
 * @type {number}
 */
let lastCursorCall = Date.now();

/**
 * Add all handlers that will intercept clicks and functions on the website
 */
export function addSiteHandlers() {
  // Replay Handlers
  let refreshMusic = () => setTimeout(playThemeSong, 500);
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
  /* global animExplosion:writeable */
  /* global updateAirUnitFogOnMove:writeable */
  /* global actionHandlers:writeable */

  let ahOpenMenu = openMenu;
  let ahCursorMove = updateCursor;
  let ahCloseMenu = closeMenu;
  let ahUnitClick = unitClickHandler;
  let ahWait = waitUnit;
  // Catches both actionHandlers.Delete and actionHandlers.Explode
  let ahExplodeAnim = animExplosion;
  let ahFog = updateAirUnitFogOnMove;
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
      playSFX(gameSFX.uiCursorMove);
    }
    lastCursorCall = Date.now();
  };

  let menuItemClick = false;
  let menuOpen = false;

  /**
   * Function called when the action menu is opened after you move a unit.
   * @param {HTMLDivElement} menu -
   * @param {number} x -
   * @param {number} y -
   */
  openMenu = (menu, x, y) => {
    ahOpenMenu.apply(openMenu, [menu, x, y]);
    if (!musicPlayerSettings.isPlaying) return;

    console.log("menu open: " + menu + "," + x + "," + y);
    let menuOptions = document.getElementsByClassName("menu-option");

    for (var i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseover", (event) => {
        if (event.target !== this) return;
        playSFX(gameSFX.uiMenuMove);
      });

      menuOptions[i].addEventListener("click", (_event) => (menuItemClick = true));
    }

    menuOpen = true;
    playSFX(gameSFX.uiMenuOpen);
  };

  /**
   * Function called when the action menu is closed after you select an action or cancel.
   */
  closeMenu = () => {
    ahCloseMenu.apply(closeMenu, []);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("menu closed");

    if (menuItemClick && menuOpen) {
      playSFX(gameSFX.uiMenuOpen);
    }
    if (!menuItemClick && menuOpen) {
      playSFX(gameSFX.uiMenuClose);
    }

    menuOpen = false;
    menuItemClick = false;
  };

  unitClickHandler = (clicked) => {
    ahUnitClick.apply(unitClickHandler, [clicked]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.uiUnitSelect);
  };

  let movementResponseMap = new Map();
  waitUnit = (unitID) => {
    ahWait.apply(waitUnit, [unitID]);
    stopMovementSound(unitID);

    if (movementResponseMap.has(unitID)) {
      let response = movementResponseMap.get(unitID);
      if (response.trapped) {
        playSFX(gameSFX.actionUnitTrap);
      }
      movementResponseMap.delete(unitID);
    }
  };

  /**
   * @param {import("../shared/awbw_site").UnitInfo} unit - Unit info for the unit that will explode.
   */
  animExplosion = (unit) => {
    ahExplodeAnim.apply(animExplosion, [unit]);
    let sfx =
      unit?.units_name === "Black Bomb" ? gameSFX.actionMissileHit : gameSFX.actionUnitExplode;
    console.log("Exploded", unit);
    playSFX(sfx);
  };

  updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change) => {
    ahFog.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change]);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;

    var delay = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    if (change === "Add") {
      // setTimeout(() => stopMovementSound(), delay);
    }
  };

  actionHandlers.Fire = (fireResponse) => {
    if (!musicPlayerSettings.isPlaying) {
      ahFire.apply(actionHandlers.Fire, [fireResponse]);
      return;
    }

    let attackerID = fireResponse.copValues.attacker.playerId;
    let defenderID = fireResponse.copValues.defender.playerId;

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
        playSFX(gameSFX.actionSuperCOPowerAvailable);
      } else if (madeCOPAvailable) {
        playSFX(gameSFX.actionCOPowerAvailable);
      }
    }, delay);
  };

  actionHandlers.AttackSeam = (seamResponse) => {
    ahAttackSeam.apply(actionHandlers.AttackSeam, [seamResponse]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Pipe seam", seamResponse);
    playSFX(gameSFX.actionUnitAttackPipeSeam);
  };

  actionHandlers.Move = (moveResponse, loadFlag) => {
    ahMove.apply(actionHandlers.Move, [moveResponse, loadFlag]);
    if (!musicPlayerSettings.isPlaying) return;

    let unitID = moveResponse.unit.units_id;
    movementResponseMap.set(unitID, moveResponse);

    var movementDist = moveResponse.path.length;
    if (movementDist > 1) {
      playMovementSound(unitID);
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
      playSFX(gameSFX.actionCaptureProgress);
      return;
    }

    // The unit is done capping this property
    let myID = getMyID();
    let isSpectator = isPlayerSpectator(myID);
    let isMyCapture = isSpectator || captData?.buildingInfo.buildings_team === myID;
    let sfx = isMyCapture ? gameSFX.actionCaptureAlly : gameSFX.actionCaptureEnemy;
    playSFX(sfx);
  };

  actionHandlers.Build = (buildData) => {
    ahBuild.apply(actionHandlers.Build, [buildData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitSupply);
  };

  actionHandlers.Load = (loadData) => {
    ahLoad.apply(actionHandlers.Load, [loadData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitLoad);
  };

  actionHandlers.Unload = (unloadData) => {
    ahUnload.apply(actionHandlers.Unload, [unloadData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitUnload);
  };

  actionHandlers.Supply = (supplyRes) => {
    ahSupply.apply(actionHandlers.Supply, [supplyRes]);
    if (!musicPlayerSettings.isPlaying) return;

    // We could play the sfx for each supplied unit in the list
    // but instead we decided to play the supply sound once.
    playSFX(gameSFX.actionUnitSupply);
  };

  actionHandlers.Repair = (repairData) => {
    ahRepair.apply(actionHandlers.Repair, [repairData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitSupply);
  };

  actionHandlers.Hide = (hideData) => {
    ahHide.apply(actionHandlers.Hide, [hideData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitHide);
  };

  actionHandlers.Unhide = (unhideData) => {
    ahUnhide.apply(actionHandlers.Unhide, [unhideData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitUnhide);
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

    playSFX(gameSFX.actionMissileSend);
    setTimeout(() => playSFX(gameSFX.actionMissileHit), siloDelayMS);
  };

  actionHandlers.NextTurn = (nextTurnRes) => {
    ahNextTurn.apply(actionHandlers.NextTurn, [nextTurnRes]);
    if (!musicPlayerSettings.isPlaying) return;

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
      let sfx = isBH ? gameSFX.actionBHActivateSCOP : gameSFX.actionAllyActivateSCOP;
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
