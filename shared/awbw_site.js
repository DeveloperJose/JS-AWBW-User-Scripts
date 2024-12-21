/*
 * Constants, functions, and computed variables that come from analyzing the web pages of AWBW.
 * Another way to think of this file is that it represents the AWBW "API".
 */
/********************** AWBW Page Elements ***********************/
// More can be easily found here https://awbw.amarriner.com/js/lib/game.js?1733945699
export let gamemap = document.querySelector("#gamemap");
export let gamemapContainer = document.querySelector("#gamemap-container");
export let zoomInBtn = document.querySelector("#zoom-in");
export let zoomOutBtn = document.querySelector("#zoom-out");
export let zoomLevel = document.querySelector(".zoom-level");
export let cursor = document.querySelector("#cursor");
export let eventUsername = document.querySelector(".event-username");

export let replayOpenBtn = document.querySelector(".replay-open");
export let replayCloseBtn = document.querySelector(".replay-close");
export let replayForwardBtn = document.querySelector(".replay-forward");
export let replayForwardActionBtn = document.querySelector(".replay-forward-action");
export let replayBackwardBtn = document.querySelector(".replay-backward");
export let replayBackwardActionBtn = document.querySelector(".replay-backward-action");
export let replayDaySelectorCheckBox = document.querySelector(".replay-day-selector");

/********************** AWBW Page Variables ***********************/
/* global maxX, maxY, gameAnims */
/* global playersInfo, unitsInfo, currentTurn */
/* global playerKeys */
export let mapCols = maxX;
export let mapRows = maxY;
export let gameAnimations = gameAnims;

/********************** AWBW Computed Variables ***********************/
export let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;
export let myName = document
  .querySelector("#profile-menu")
  .getElementsByClassName("dropdown-menu-link")[0]
  .href.split("username=")[1];

export let menu = isMapEditor
  ? document.querySelector("#replay-misc-controls")
  : document.querySelector("#game-map-menu").parentNode;

let myID = null;
export function getMyID() {
  if (myID === null) {
    Object.values(playersInfo).forEach((entry) => {
      if (entry.users_username === myName) {
        myID = entry.players_id;
      }
    });
  }
  return myID;
}

export function isPlayerSpectator(pid) {
  return !playerKeys.includes(pid);
}

export function canPlayerActivateCOPower(pid) {
  let info = playersInfo[pid];
  return info.players_co_power >= info.players_co_max_power;
}

export function canPlayerActivateSuperCOPower(pid) {
  let info = playersInfo[pid];
  return info.players_co_power >= info.players_co_max_spower;
}

/**
 * Useful variables related to the current turn's player.
 */
export const currentPlayer = {
  /**
   * Get the internal info object containing the state of the current player.
   */
  get info() {
    return playersInfo[currentTurn];
  },

  /**
   * Whether a CO Power or Super CO Power is activated
   */
  get isPowerActivated() {
    return this.coPowerState !== "N";
  },

  /**
   * The state of the CO Power represented as a single letter.
   * N = No Power
   * Y = CO Power
   * S = Super CO Power
   */
  get coPowerState() {
    return this.info.players_co_power_on;
  },

  /**
   * The name of the current CO.
   */
  get coName() {
    return this.info.co_name;
  },
};

/**
 * Determine who all the COs of the match are and return a list of their names.
 * @returns List with the names of each CO in the match.
 */
export function getAllCONames() {
  let coNames = [];
  Object.keys(playersInfo).forEach((playerID) => {
    coNames.push(playersInfo[playerID]["co_name"]);
  });
  return coNames;
}

export function getUnitInfo(unitID) {
  return unitsInfo[unitID];
}

export function getUnitName(unitID) {
  return getUnitInfo(unitID)?.units_name;
}

export function isValidUnit(unitID) {
  return unitID !== undefined && unitsInfo[unitID] !== undefined;
}

export function hasUnitMovedThisTurn(unitID) {
  return isValidUnit(unitID) && getUnitInfo(unitID)?.units_moved == 1;
}
