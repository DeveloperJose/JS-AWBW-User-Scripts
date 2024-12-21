import {
  canPlayerActivateCOPower,
  canPlayerActivateSuperCOPower,
  gameAnimations,
  getMyID,
  isPlayerSpectator,
  replayBackwardActionBtn,
  replayBackwardBtn,
  replayCloseBtn,
  replayDaySelectorCheckBox,
  replayForwardActionBtn,
  replayForwardBtn,
  replayOpenBtn,
} from "../shared/awbw_site";
import { on } from "../shared/utils";
import { addMusicPlayerMenu } from "./music_player_menu";
import {
  playMovementSound,
  stopMovementSound,
  playMusic,
  playSFX,
  preloadCommonAudio,
  stopMusic,
} from "./music";
import { musicPlayerSettings } from "./music_settings";
import { loadSettingsFromLocalStorage } from "./music_settings";
import { gameSFX, isBlackHoleCO } from "./resources";

// Add our CSS to the page using webpack
import "./style.css";

function addReplayHandlers() {
  let refreshMusic = () => setTimeout(playMusic, 500);

  on(replayForwardBtn, "click", refreshMusic);
  on(replayForwardActionBtn, "click", refreshMusic);
  on(replayBackwardBtn, "click", refreshMusic);
  on(replayBackwardActionBtn, "click", refreshMusic);
  on(replayOpenBtn, "click", refreshMusic);
  on(replayCloseBtn, "click", refreshMusic);
  on(replayDaySelectorCheckBox, "click", refreshMusic);
}

// Action Handlers

/* global updateCursor:writeable */
let ahCursorMove = updateCursor;
let lastCursorCall = Date.now();
const CURSOR_THRESHOLD = 25;

updateCursor = (cursorX, cursorY) => {
  ahCursorMove.apply(updateCursor, [cursorX, cursorY]);
  if (!musicPlayerSettings.isPlaying) return;

  if (Date.now() - lastCursorCall > CURSOR_THRESHOLD) {
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
};

let ahMove = actionHandlers.Move;
actionHandlers.Move = (moveResponse, loadFlag) => {
  ahMove.apply(actionHandlers.Move, [moveResponse, loadFlag]);
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
  playSFX(gameSFX.actionCaptureProgress);

  let isValid = captData != undefined && captData.newIncome != null;
  if (!isValid) return;

  let myID = getMyID();
  let isSpectator = isPlayerSpectator(myID);
  let isMyCapture = isSpectator || captData?.buildingInfo.buildings_team == myID;

  let sfx = isMyCapture ? gameSFX.actionCaptureAlly : gameSFX.actionCaptureEnemy;
  playSFX(sfx);
};

let ahBuild = actionHandlers.Build;
actionHandlers.Build = (buildData) => {
  ahBuild.apply(actionHandlers.Build, [buildData]);
  playSFX(gameSFX.actionUnitSupply);
};

let ahLoad = actionHandlers.Load;
actionHandlers.Load = (loadData) => {
  ahLoad.apply(actionHandlers.Load, [loadData]);
  playSFX(gameSFX.actionUnitLoad);
};

let ahUnload = actionHandlers.Unload;
actionHandlers.Unload = (unloadData) => {
  ahUnload.apply(actionHandlers.Unload, [unloadData]);
  playSFX(gameSFX.actionUnitUnload);
};

let ahSupply = actionHandlers.Supply;
actionHandlers.Supply = (supplyRes) => {
  ahSupply.apply(actionHandlers.Supply, [supplyRes]);

  // We could play the sfx for each supplied unit in the list
  // but instead we decided to play the supply sound once.
  playSFX(gameSFX.actionUnitSupply);
};

let ahRepair = actionHandlers.Repair;
actionHandlers.Repair = (repairData) => {
  ahRepair.apply(actionHandlers.Repair, [repairData]);
  playSFX(gameSFX.actionUnitSupply);
};

let ahHide = actionHandlers.Hide;
actionHandlers.Hide = (hideData) => {
  ahHide.apply(actionHandlers.Hide, [hideData]);
  playSFX(gameSFX.actionUnitHide);
};

let ahUnhide = actionHandlers.Unhide;
actionHandlers.Unhide = (unhideData) => {
  ahUnhide.apply(actionHandlers.Unhide, [unhideData]);
  playSFX(gameSFX.actionUnitUnhide);
};

let ahJoin = actionHandlers.Join;
actionHandlers.Join = (joinData) => {
  ahJoin.apply(actionHandlers.Join, [joinData]);
  stopMovementSound(joinData.joinID);
};

let ahExplodeAnim = animExplosion;
animExplosion = (unit) => {
  ahExplodeAnim.apply(animExplosion, [unit]);
  playSFX(gameSFX.actionUnitExplode);
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
  playSFX(gameSFX.actionMissleSend);

  var siloDelay = gameAnimations ? 3000 : 0;
  setTimeout(() => playSFX(gameSFX.actionMissileHit), siloDelay);
};

let ahNextTurn = actionHandlers.NextTurn;
actionHandlers.NextTurn = (nextTurnRes) => {
  ahNextTurn.apply(actionHandlers.NextTurn, [nextTurnRes]);
  playMusic();
};

let ahElimination = actionHandlers.Elimination;
actionHandlers.Elimination = (eliminationRes) => {
  ahElimination.apply(actionHandlers.Elimination, [eliminationRes]);
  debugger;
};

let ahPower = actionHandlers.Power;
actionHandlers.Power = (powerRes) => {
  ahPower.apply(actionHandlers.Power, [powerRes]);

  let coName = powerRes.coName;
  let isSuperCOPower = powerRes.coPower === "S";
  let isBH = isBlackHoleCO(coName);

  if (isSuperCOPower) {
    let sfx = isBH ? gameSFX.actionBHActivateSCOP : gameSFX.actionAllyActivateSCOP;
    playSFX(sfx);
    stopMusic(2500);
  }
};

let ahSetDraw = actionHandlers.SetDraw;
actionHandlers.SetDraw = (drawData) => {
  ahSetDraw.apply(actionHandlers.SetDraw, [drawData]);
  debugger;
};

// let ahResign = actionHandlers.Resign;
// actionHandlers.Resign = (resignRes) => {
//   ahResign.apply(actionHandlers.Resign, [resignRes]);
//   debugger;
// }

let ahGameOver = actionHandlers.GameOver;
actionHandlers.GameOver = () => {
  ahGameOver.apply(actionHandlers.GameOver, []);
  debugger;
};

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
console.log("Script");
function afterPreload() {
  console.log("[AWBW Improved Music Player] All audio has been pre-loaded!");

  addMusicPlayerMenu();
  addReplayHandlers();
  loadSettingsFromLocalStorage();

  // TODO: Temporary
  // Better to play music after preloading audio
  // Play the music after letting everything load a bit
  playMusic();
  // setTimeout(() => playMusic(), 500);
}

preloadCommonAudio(afterPreload);
