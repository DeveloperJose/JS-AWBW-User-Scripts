/********************** AWBW Variables ***********************/
console.log("[AWBW Improved Music Player] Script loaded!");

import {
  replayBackwardBtn,
  replayDaySelectorCheckBox,
  replayForwardBtn,
} from "../shared/awbw_site";
import { on } from "../shared/utils";
import { addMusicPlayerMenu } from "./music_player_menu";
import { playMovementSound, playMusic, preloadCommonAudio, stopMovementSound } from "./music";
import { musicPlayerSettings } from "./music_settings";
import { loadSettingsFromLocalStorage } from "./music_settings";
import "./style.css";

function addReplayHandlers() {
  if (replayForwardBtn != null) {
    on(replayForwardBtn, "click", setTimeout(playMusic, 500));
  }

  if (replayBackwardBtn != null) {
    on(replayBackwardBtn, "click", setTimeout(playMusic, 500));
  }

  if (replayDaySelectorCheckBox != null) {
    on(replayDaySelectorCheckBox, "click", setTimeout(playMusic, 500));
  }
}

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
addMusicPlayerMenu();
loadSettingsFromLocalStorage();
preloadCommonAudio();
addReplayHandlers();

// Action Handlers
/* global unitsInfo */

/* global updateCursor:writeable */
let ahCursorMove = updateCursor;
let lastCursorCall = Date.now();
const CURSOR_THRESHOLD = 30;

updateCursor = function () {
  ahCursorMove.apply(updateCursor, arguments);
  if (!musicPlayerSettings.isPlaying) return;

  if (Date.now() - lastCursorCall > CURSOR_THRESHOLD) {
    // playOneShot(uiCursorMove, uiVolume);
  }
  lastCursorCall = Date.now();
};

/* global openMenu:writeable */
let ahOpenMenu = openMenu;
let menuItemClick = false;
let menuOpen = false;
openMenu = function () {
  ahOpenMenu.apply(openMenu, arguments);
  if (!musicPlayerSettings.isPlaying) return;

  let menuOptions = document.getElementsByClassName("menu-option");

  for (var i = 0; i < menuOptions.length; i++) {
    menuOptions[i].addEventListener("mouseover", function (e) {
      if (e.target !== this) {
        return;
      }
      // playOneShot(uiMenuMove, uiVolume);
    });

    on(menuOptions[i], "click", function () {
      menuItemClick = true;
    });
  }

  menuOpen = true;

  // playOneShot(uiMenuOpen, uiVolume);
};

/* global closeMenu:writeable */
let ahCloseMenu = closeMenu;
closeMenu = function () {
  ahCloseMenu.apply(closeMenu, arguments);
  if (!musicPlayerSettings.isPlaying) return;

  if (menuItemClick && menuOpen) {
    // playOneShot(uiMenuOpen, uiVolume);
  }
  if (!menuItemClick && menuOpen) {
    // playOneShot(uiMenuClose, uiVolume);
  }

  menuOpen = false;
  menuItemClick = false;
};

/* global unitClickHandler:writeable */
let ahUnitClick = unitClickHandler;
unitClickHandler = function () {
  ahUnitClick.apply(unitClickHandler, arguments);
  if (!musicPlayerSettings.isPlaying) return;
  // playOneShot(uiUnitClick, uiVolume);
};

/* global waitUnit:writeable */
let ahWait = waitUnit;
waitUnit = function () {
  ahWait.apply(waitUnit, arguments);
  debugger;

  let isValid =
    arguments[0] !== undefined &&
    unitsInfo[arguments[0]] !== undefined &&
    unitsInfo[arguments[0]].units_moved;
  if (isValid) {
    stopMovementSound(arguments[0]);
  }
};

/* global joinUnits:writeable */
let ahJoin = joinUnits;
joinUnits = function () {
  ahJoin.apply(joinUnits, arguments);
  debugger;
  stopMovementSound();
};

/* global updateAirUnitFogOnMove:writeable */
let ahFog = updateAirUnitFogOnMove;
updateAirUnitFogOnMove = function () {
  ahFog.apply(updateAirUnitFogOnMove, arguments);

  if (!musicPlayerSettings.isPlaying) return;

  if (arguments[5] === "Add") {
    // setTimeout(() => {
    //   if (movementSFX != null) {
    //     stopMovementSound(movingUnit);
    //   }
    // }, arguments[6]);
  }
};

/* global hideUnit:writeable */
let ahHide = hideUnit;
hideUnit = function () {
  ahHide.apply(hideUnit, arguments);
  stopMovementSound();
};

/* global animExplosion:writeable */
let ahExplode = animExplosion;
animExplosion = function () {
  ahExplode.apply(animExplosion, arguments);
  // playOneShot(actionUnitExplode, sfxVolume);
};

/* global actionHandlers:writeable */
let ahMove = actionHandlers.Move;
actionHandlers.Move = function () {
  ahMove.apply(actionHandlers.Move, arguments);
  debugger;

  stopMovementSound();
  var movementDist = arguments[0].path.length;
  if (movementDist > 1) {
    var unitType = unitsInfo[arguments[0].unit.units_id].units_name;
    playMovementSound(unitType);
  }
};

let ahLoad = actionHandlers.Load;
actionHandlers.Load = function () {
  ahLoad.apply(actionHandlers.Load, arguments);
  // playOneShot(actionLoadSFX, sfxVolume);
};

let ahUnload = actionHandlers.Unload;
actionHandlers.Unload = function () {
  ahUnload.apply(actionHandlers.Unload, arguments);
  // playOneShot(actionUnloadSFX, sfxVolume);
};

let ahCapt = actionHandlers.Capt;
actionHandlers.Capt = function () {
  ahCapt.apply(actionHandlers.Capt, arguments);

  // if (
  //   (arguments[0].newIncome != undefined || arguments[0].newIncome != null) &&
  //   playerKeys.includes(myID)
  // ) {
  //   if (
  //     arguments[0].buildingInfo.buildings_team != null &&
  //     arguments[0].buildingInfo.buildings_team != myID
  //   ) {
  //     playOneShot(actionCaptEnemySFX, sfxVolume);
  //   } else if (
  //     arguments[0].buildingInfo.buildings_team != null &&
  //     arguments[0].buildingInfo.buildings_team == myID
  //   ) {
  //     playOneShot(actionCaptAllySFX, sfxVolume);
  //   }
  // } else if (
  //   (arguments[0].newIncome != undefined || arguments[0].newIncome != null) &&
  //   !playerKeys.includes(myID)
  // ) {
  //   if (arguments[0].buildingInfo.buildings_team != null) {
  //     playOneShot(actionCaptAllySFX, sfxVolume);
  //   }
  // }
};
let ahSupply = actionHandlers.Supply;
actionHandlers.Supply = function () {
  ahSupply.apply(actionHandlers.Supply, arguments);
  // playOneShot(actionSupplyRepair, sfxVolume);
};

let ahRepair = actionHandlers.Repair;
actionHandlers.Repair = function () {
  ahRepair.apply(actionHandlers.Repair, arguments);
  // playOneShot(actionSupplyRepair, sfxVolume);
};

let ahBuild = actionHandlers.Build;
actionHandlers.Build = function () {
  ahBuild.apply(actionHandlers.Build, arguments);

  // if (!playerKeys.includes(myID)) {
  //   playOneShot(actionSupplyRepair, sfxVolume);
  // }
};
