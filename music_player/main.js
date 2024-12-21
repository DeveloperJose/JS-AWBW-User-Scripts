import {
  getMyID,
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
  playMusic,
  playSFXSound,
  playUISound,
  preloadCommonAudio,
  stopMovementSound,
} from "./music";
import { musicPlayerSettings } from "./music_settings";
import { loadSettingsFromLocalStorage } from "./music_settings";
import "./style.css";
import { gameSFX, uiSFX } from "./resources";

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
/* global unitsInfo */

/* global updateCursor:writeable */
let ahCursorMove = updateCursor;
let lastCursorCall = Date.now();
const CURSOR_THRESHOLD = 30;

updateCursor = function () {
  ahCursorMove.apply(updateCursor, arguments);
  if (!musicPlayerSettings.isPlaying) return;

  if (Date.now() - lastCursorCall > CURSOR_THRESHOLD) {
    playUISound(uiSFX.uiCursorMove);
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
      playUISound(uiSFX.uiMenuMove);
    });

    on(menuOptions[i], "click", function () {
      menuItemClick = true;
    });
  }

  menuOpen = true;
  playUISound(uiSFX.uiMenuOpen);
};

/* global closeMenu:writeable */
let ahCloseMenu = closeMenu;
closeMenu = function () {
  ahCloseMenu.apply(closeMenu, arguments);
  if (!musicPlayerSettings.isPlaying) return;

  if (menuItemClick && menuOpen) {
    playUISound(uiSFX.uiMenuOpen);
  }
  if (!menuItemClick && menuOpen) {
    playUISound(uiSFX.uiMenuClose);
  }

  menuOpen = false;
  menuItemClick = false;
};

/* global unitClickHandler:writeable */
let ahUnitClick = unitClickHandler;
unitClickHandler = function () {
  ahUnitClick.apply(unitClickHandler, arguments);
  if (!musicPlayerSettings.isPlaying) return;
  playUISound(uiSFX.uiUnitClick);
};

/* global waitUnit:writeable */
let ahWait = waitUnit;
waitUnit = (unitID) => {
  ahWait.apply(waitUnit, [unitID]);

  let isValid =
    unitID !== undefined && unitsInfo[unitID] !== undefined && unitsInfo[unitID].units_moved;
  if (isValid) {
    let unitType = unitsInfo[unitID].units_name;
    stopMovementSound(unitType);
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
    setTimeout(() => {
      if (movementSFX != null) {
        stopMovementSound(movingUnit);
      }
    }, arguments[6]);
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
  playSFXSound(gameSFX.actionUnitExplode);
};

/* global actionHandlers:writeable */
let ahMove = actionHandlers.Move;
actionHandlers.Move = function () {
  ahMove.apply(actionHandlers.Move, arguments);

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
  playSFXSound(gameSFX.actionLoadSFX);
};

let ahUnload = actionHandlers.Unload;
actionHandlers.Unload = function () {
  ahUnload.apply(actionHandlers.Unload, arguments);
  playSFXSound(gameSFX.actionUnloadSFX);
};

let ahCapt = actionHandlers.Capt;
actionHandlers.Capt = function () {
  ahCapt.apply(actionHandlers.Capt, arguments);
  let myID = getMyID();

  if (
    (arguments[0].newIncome != undefined || arguments[0].newIncome != null) &&
    playerKeys.includes(myID)
  ) {
    if (
      arguments[0].buildingInfo.buildings_team != null &&
      arguments[0].buildingInfo.buildings_team != myID
    ) {
      playSFXSound(gameSFX.actionCaptEnemySFX);
    } else if (
      arguments[0].buildingInfo.buildings_team != null &&
      arguments[0].buildingInfo.buildings_team == myID
    ) {
      playSFXSound(gameSFX.actionCaptAllySFX);
    }
  } else if (
    (arguments[0].newIncome != undefined || arguments[0].newIncome != null) &&
    !playerKeys.includes(myID)
  ) {
    if (arguments[0].buildingInfo.buildings_team != null) {
      playSFXSound(gameSFX.actionCaptAllySFX);
    }
  }
};
let ahSupply = actionHandlers.Supply;
actionHandlers.Supply = function () {
  ahSupply.apply(actionHandlers.Supply, arguments);
  playSFXSound(gameSFX.actionSupplyRepair);
};

let ahRepair = actionHandlers.Repair;
actionHandlers.Repair = function () {
  ahRepair.apply(actionHandlers.Repair, arguments);
  playSFXSound(gameSFX.actionSupplyRepair);
};

let ahBuild = actionHandlers.Build;
actionHandlers.Build = function () {
  ahBuild.apply(actionHandlers.Build, arguments);

  playSFXSound(gameSFX.actionSupplyRepair);
};

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
addMusicPlayerMenu();
preloadCommonAudio();
addReplayHandlers();

// Wait a bit before loading the settings for everything else to load
// That way we can auto-play properly
setTimeout(() => loadSettingsFromLocalStorage(), 500);
