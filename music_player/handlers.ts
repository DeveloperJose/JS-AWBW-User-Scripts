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
  getCurrentClickData,
  COPowerEnum,
} from "../shared/awbw_game";
import { gamemap, isMapEditor, moveDivToOffset } from "../shared/awbw_page";
import { getBuildingDiv } from "../shared/awbw_page";
import {
  ahAnimUnit,
  ahAttackSeam,
  ahBuild,
  ahCapt,
  ahCloseMenu,
  ahCursorMove,
  ahElimination,
  ahAnimExplosion,
  ahFire,
  ahFog,
  ahGameOver,
  ahHide,
  ahJoin,
  ahLaunch,
  ahLoad,
  ahMove,
  ahNextTurn,
  ahOpenMenu,
  ahPower,
  ahRepair,
  ahSupply,
  ahUnhide,
  ahUnitClick,
  ahUnload,
  ahWait,
  ahResetAttack,
} from "../shared/awbw_handlers";
import { gameAnimations } from "../shared/awbw_globals";
import {
  replayForwardBtn,
  replayForwardActionBtn,
  replayBackwardBtn,
  replayBackwardActionBtn,
  replayOpenBtn,
  replayCloseBtn,
  replayDaySelectorCheckBox,
} from "../shared/awbw_page";
import {
  playThemeSong,
  playSFX,
  stopMovementSound,
  playMovementSound,
  stopThemeSong,
} from "./music";
import {
  getCurrentThemeType,
  musicPlayerSettings,
  SettingsGameType,
  SettingsThemeType,
} from "./music_settings";
import { GameSFX } from "./resources";
import { isBlackHoleCO } from "../shared/awbw_globals";

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

let lastCursorX = -1;
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

function onCursorMove(cursorX: number, cursorY: number) {
  // Call the original cursor move function
  ahCursorMove.apply(ahCursorMove, [cursorX, cursorY]);

  if (!musicPlayerSettings.isPlaying) return;
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

/**
 * Syncs the current settings to the music player settings.
 */
function syncSettingsToMusic() {
  visibilityMap.clear();
  musicPlayerSettings.themeType = getCurrentThemeType();
  playThemeSong();
}

/**
 * Add all handlers that will intercept clicks and functions on the website
 */
export function addGameHandlers() {
  if (isMapEditor) {
    designMapEditor.updateCursor = onCursorMove;
    return;
  } else {
    updateCursor = onCursorMove;
  }

  // Replay Handlers
  let refreshMusic = () => setTimeout(syncSettingsToMusic, 500);
  replayForwardBtn.addEventListener("click", refreshMusic);
  replayForwardActionBtn.addEventListener("click", refreshMusic);
  replayBackwardBtn.addEventListener("click", refreshMusic);
  replayBackwardActionBtn.addEventListener("click", refreshMusic);
  replayOpenBtn.addEventListener("click", refreshMusic);
  replayCloseBtn.addEventListener("click", refreshMusic);
  replayDaySelectorCheckBox.addEventListener("click", refreshMusic);

  openMenu = (menu, x, y) => {
    ahOpenMenu?.apply(openMenu, [menu, x, y]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Open Menu", menu, x, y);

    let menuOptions = document.getElementsByClassName("menu-option");
    for (var i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseenter", (_event) => {
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

  closeMenu = () => {
    ahCloseMenu?.apply(closeMenu, []);
    console.log("CloseMenu", menuOpen, menuItemClick);
    if (!musicPlayerSettings.isPlaying) return;

    let confirmedAction = menuOpen && menuItemClick === MenuClickType.MenuItem;
    let canceledAction = menuOpen && menuItemClick === MenuClickType.None;
    let canceledUnitAction =
      !menuOpen && getCurrentClickData()?.type === "unit" && menuItemClick !== MenuClickType.None;

    console.log(
      "Actions",
      confirmedAction,
      canceledAction,
      canceledUnitAction,
      getCurrentClickData()?.type,
    );

    if (confirmedAction) {
      // playSFX(GameSFX.uiMenuOpen);
      menuItemClick = MenuClickType.None;
    } else if (canceledAction || canceledUnitAction) {
      // playSFX(GameSFX.uiMenuClose);
      menuItemClick = MenuClickType.None;
    }

    menuOpen = false;
  };

  unitClickHandler = (clicked) => {
    ahUnitClick?.apply(unitClickHandler, [clicked]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Unit Click", clicked);

    menuItemClick = MenuClickType.Unit;
    playSFX(GameSFX.uiUnitSelect);
  };

  waitUnit = (unitId) => {
    ahWait?.apply(waitUnit, [unitId]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.log("Wait", unitId, getUnitName(unitId));

    stopMovementSound(unitId);
    // Check if we stopped because we got trapped
    if (movementResponseMap.has(unitId)) {
      let response = movementResponseMap.get(unitId);
      if (response?.trapped) {
        playSFX(GameSFX.unitTrap);
      }
      movementResponseMap.delete(unitId);
    }
  };

  animUnit = (path, unitId, unitSpan, unitTeam, viewerTeam, i) => {
    ahAnimUnit?.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);
    console.log("AnimUnit", path, unitId, unitSpan, unitTeam, viewerTeam, i);

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

  animExplosion = (unit) => {
    ahAnimExplosion?.apply(animExplosion, [unit]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.log("Exploded", unit);

    let unitId = unit.units_id;
    let unitFuel = unit.units_fuel;
    let sfx = GameSFX.unitExplode;
    if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
      sfx = GameSFX.unitMissileHit;
    }
    playSFX(sfx);
    stopMovementSound(unitId, false);
  };

  updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change, delay) => {
    ahFog?.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Fog", x, y, mType, neighbours, unitVisible, change, delay);

    let unitInfo = getUnitInfoFromCoords(x, y);
    if (!unitInfo) return;

    if (change === "Add") {
      setTimeout(() => stopMovementSound(unitInfo.units_id, false), delay);
    }
  };

  actionHandlers.Fire = (response) => {
    if (!musicPlayerSettings.isPlaying) {
      ahFire?.apply(actionHandlers.Fire, [response]);
      return;
    }
    console.log("Fire", response);

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
        playSFX(GameSFX.powerSCOPAvailable);
      } else if (madeCOPAvailable) {
        playSFX(GameSFX.powerCOPAvailable);
      }
    }, delay);
  };

  actionHandlers.AttackSeam = (response) => {
    ahAttackSeam?.apply(actionHandlers.AttackSeam, [response]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("AttackSeam", response);

    // Pipe wiggle animation
    if (gameAnimations) {
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
  };

  actionHandlers.Move = (response, loadFlag) => {
    ahMove?.apply(actionHandlers.Move, [response, loadFlag]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Move", response);

    let unitId = response.unit.units_id;
    movementResponseMap.set(unitId, response);

    var movementDist = response.path.length;
    if (movementDist > 1) {
      playMovementSound(unitId);
    }
  };

  actionHandlers.Capt = (captData) => {
    ahCapt?.apply(actionHandlers.Capt, [captData]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Capt", captData);

    let isValid = captData != undefined;
    if (!isValid) return;

    // They didn't finish the capture
    let finishedCapture = captData.newIncome != null;
    if (!finishedCapture) {
      playSFX(GameSFX.unitCaptureProgress);
      return;
    }

    // The unit is done capping this property
    let myID = getMyID();
    let isSpectator = isPlayerSpectator(myID);
    console.log(isSpectator, captData.buildingInfo.buildings_team, myID);
    // buildings_team (string) == id (number)
    let isMyCapture = isSpectator || captData.buildingInfo.buildings_team == myID;
    let sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
    playSFX(sfx);
  };

  actionHandlers.Build = (data) => {
    ahBuild?.apply(actionHandlers.Build, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Build", data);

    let myID = getMyID();
    let isMyBuild = data.newUnit.units_players_id == myID;
    if (!isMyBuild) playSFX(GameSFX.unitSupply);
  };

  actionHandlers.Load = (data) => {
    ahLoad?.apply(actionHandlers.Load, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Load", data);
    playSFX(GameSFX.unitLoad);
  };

  actionHandlers.Unload = (unloadData) => {
    ahUnload?.apply(actionHandlers.Unload, [unloadData]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Unload", unloadData);
    playSFX(GameSFX.unitUnload);
  };

  actionHandlers.Supply = (data) => {
    ahSupply?.apply(actionHandlers.Supply, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Supply", data);

    // We could play the sfx for each supplied unit in the list
    // but instead we decided to play the supply sound once.
    playSFX(GameSFX.unitSupply);
  };

  actionHandlers.Repair = (data) => {
    ahRepair?.apply(actionHandlers.Repair, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Repair", data);
    playSFX(GameSFX.unitSupply);
  };

  actionHandlers.Hide = (data) => {
    ahHide?.apply(actionHandlers.Hide, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Hide", data);
    playSFX(GameSFX.unitHide);
    stopMovementSound(data.unitId);
  };

  actionHandlers.Unhide = (data) => {
    ahUnhide?.apply(actionHandlers.Unhide, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Unhide", data);
    playSFX(GameSFX.unitUnhide);
    stopMovementSound(data.unitId);
  };

  actionHandlers.Join = (data) => {
    ahJoin?.apply(actionHandlers.Join, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Join", data);
    stopMovementSound(data.joinID);
    stopMovementSound(data.joinedUnit.units_id);
  };

  actionHandlers.Launch = (data) => {
    ahLaunch?.apply(actionHandlers.Launch, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Launch", data);

    playSFX(GameSFX.unitMissileSend);
    setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
  };

  actionHandlers.NextTurn = (data) => {
    ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("NextTurn", data);
    syncSettingsToMusic();
  };

  actionHandlers.Elimination = (data) => {
    ahElimination?.apply(actionHandlers.Elimination, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Elimination", data);

    debugger;
  };

  actionHandlers.Power = (data) => {
    ahPower?.apply(actionHandlers.Power, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.log("Power", data);

    let coName = data.coName;
    let isAW1 = musicPlayerSettings.gameType === SettingsGameType.AW1;
    let isBH = isBlackHoleCO(coName);
    let isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;

    // Update the theme type
    musicPlayerSettings.themeType = isSuperCOPower
      ? SettingsThemeType.SUPER_CO_POWER
      : SettingsThemeType.CO_POWER;

    if (isAW1) {
      playSFX(GameSFX.powerActivateAW1COP);
      stopThemeSong(4500);
      return;
    }

    if (isSuperCOPower) {
      let sfx = isBH ? GameSFX.powerActivateBHSCOP : GameSFX.powerActivateAllySCOP;
      playSFX(sfx);
      stopThemeSong(850);
      return;
    }

    // Regular CO Power
    let sfx = isBH ? GameSFX.powerActivateBHCOP : GameSFX.powerActivateAllyCOP;
    playSFX(GameSFX.powerActivateAW1COP);
    stopThemeSong(500);
  };

  actionHandlers.GameOver = () => {
    ahGameOver?.apply(actionHandlers.GameOver, []);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;
  };
}
