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
import { on } from "../shared/utils";
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
  on(replayForwardBtn, "click", refreshMusic);
  on(replayForwardActionBtn, "click", refreshMusic);
  on(replayBackwardBtn, "click", refreshMusic);
  on(replayBackwardActionBtn, "click", refreshMusic);
  on(replayOpenBtn, "click", refreshMusic);
  on(replayCloseBtn, "click", refreshMusic);
  on(replayDaySelectorCheckBox, "click", refreshMusic);

  // Action Handlers
  /* global updateCursor:writeable */
  let ahCursorMove = updateCursor;
  updateCursor = (cursorX, cursorY) => {
    ahCursorMove.apply(updateCursor, [cursorX, cursorY]);
    if (!musicPlayerSettings.isPlaying) return;

    if (Date.now() - lastCursorCall > CURSOR_THRESHOLD_MS) {
      playSFX(gameSFX.uiCursorMove);
    }
    lastCursorCall = Date.now();
  };

  /* global openMenu:writeable */
  let ahOpenMenu = openMenu;
  let menuItemClick = false;
  let menuOpen = false;
  openMenu = (menu, x, y) => {
    ahOpenMenu.apply(openMenu, [menu, x, y]);
    if (!musicPlayerSettings.isPlaying) return;

    console.log("menu open: " + menu + "," + x + "," + y);
    let menuOptions = document.getElementsByClassName("menu-option");

    for (var i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseover", function (e) {
        if (e.target !== this) {
          return;
        }
        playSFX(gameSFX.uiMenuMove);
      });

      on(menuOptions[i], "click", function () {
        menuItemClick = true;
      });
    }

    menuOpen = true;
    playSFX(gameSFX.uiMenuOpen);
  };

  /* global closeMenu:writeable */
  let ahCloseMenu = closeMenu;
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

  /* global unitClickHandler:writeable */
  let ahUnitClick = unitClickHandler;
  unitClickHandler = (clicked) => {
    ahUnitClick.apply(unitClickHandler, [clicked]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.uiUnitSelect);
  };

  /* global waitUnit:writeable */
  let movementResponseMap = new Map();
  let ahWait = waitUnit;
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

  /* global animExplosion:writeable */
  // Catches both actionHandlers.Delete and actionHandlers.Explode
  let ahExplodeAnim = animExplosion;
  animExplosion = (unit) => {
    ahExplodeAnim.apply(animExplosion, [unit]);
    playSFX(gameSFX.actionUnitExplode);

    /** @todo Black bombs */
  };

  /* global updateAirUnitFogOnMove:writeable */
  let ahFog = updateAirUnitFogOnMove;
  updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change) => {
    ahFog.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change]);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;

    var delay = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
    if (change === "Add") {
      // setTimeout(() => stopMovementSound(), delay);
    }
  };

  /* global actionHandlers:writeable */
  let ahFire = actionHandlers.Fire;
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

  let ahAttackSeam = actionHandlers.AttackSeam;
  actionHandlers.AttackSeam = (seamResponse) => {
    ahAttackSeam.apply(actionHandlers.AttackSeam, [seamResponse]);
    if (!musicPlayerSettings.isPlaying) return;

    // TODO:
    // playSFX(gameSFX.actionUnitExplode);
  };

  let ahMove = actionHandlers.Move;
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

  let ahCapt = actionHandlers.Capt;
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

  let ahBuild = actionHandlers.Build;
  actionHandlers.Build = (buildData) => {
    ahBuild.apply(actionHandlers.Build, [buildData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitSupply);
  };

  let ahLoad = actionHandlers.Load;
  actionHandlers.Load = (loadData) => {
    ahLoad.apply(actionHandlers.Load, [loadData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitLoad);
  };

  let ahUnload = actionHandlers.Unload;
  actionHandlers.Unload = (unloadData) => {
    ahUnload.apply(actionHandlers.Unload, [unloadData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitUnload);
  };

  let ahSupply = actionHandlers.Supply;
  actionHandlers.Supply = (supplyRes) => {
    ahSupply.apply(actionHandlers.Supply, [supplyRes]);
    if (!musicPlayerSettings.isPlaying) return;

    // We could play the sfx for each supplied unit in the list
    // but instead we decided to play the supply sound once.
    playSFX(gameSFX.actionUnitSupply);
  };

  let ahRepair = actionHandlers.Repair;
  actionHandlers.Repair = (repairData) => {
    ahRepair.apply(actionHandlers.Repair, [repairData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitSupply);
  };

  let ahHide = actionHandlers.Hide;
  actionHandlers.Hide = (hideData) => {
    ahHide.apply(actionHandlers.Hide, [hideData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitHide);
  };

  let ahUnhide = actionHandlers.Unhide;
  actionHandlers.Unhide = (unhideData) => {
    ahUnhide.apply(actionHandlers.Unhide, [unhideData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitUnhide);
  };

  let ahJoin = actionHandlers.Join;
  actionHandlers.Join = (joinData) => {
    ahJoin.apply(actionHandlers.Join, [joinData]);
    if (!musicPlayerSettings.isPlaying) return;
    stopMovementSound(joinData.joinID);
  };

  // let ahDelete = actionHandlers.Delete;
  // actionHandlers.Delete = (deleteData) => {
  //   ahDelete.apply(actionHandlers.Delete, [deleteData]);
  //   playSFX(gameSFX.actionUnitExplode);
  // };

  // let ahExplode = actionHandlers.Explode;
  // actionHandlers.Explode = (data) => {
  //   ahExplode.apply(actionHandlers.Explode, [data]);
  // };

  let ahLaunch = actionHandlers.Launch;
  actionHandlers.Launch = (data) => {
    ahLaunch.apply(actionHandlers.Launch, [data]);
    if (!musicPlayerSettings.isPlaying) return;

    playSFX(gameSFX.actionMissileSend);
    setTimeout(() => playSFX(gameSFX.actionMissileHit), siloDelayMS);
  };

  let ahNextTurn = actionHandlers.NextTurn;
  actionHandlers.NextTurn = (nextTurnRes) => {
    ahNextTurn.apply(actionHandlers.NextTurn, [nextTurnRes]);
    if (!musicPlayerSettings.isPlaying) return;

    playThemeSong();
  };

  let ahElimination = actionHandlers.Elimination;
  actionHandlers.Elimination = (eliminationRes) => {
    ahElimination.apply(actionHandlers.Elimination, [eliminationRes]);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;
  };

  let ahPower = actionHandlers.Power;
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

  // let ahSetDraw = actionHandlers.SetDraw;
  // actionHandlers.SetDraw = (drawData) => {
  //   ahSetDraw.apply(actionHandlers.SetDraw, [drawData]);
  //   debugger;
  // };

  // let ahResign = actionHandlers.Resign;
  // actionHandlers.Resign = (resignRes) => {
  //   ahResign.apply(actionHandlers.Resign, [resignRes]);
  //   debugger;
  // }

  let ahGameOver = actionHandlers.GameOver;
  actionHandlers.GameOver = () => {
    ahGameOver.apply(actionHandlers.GameOver, []);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;
  };
}
