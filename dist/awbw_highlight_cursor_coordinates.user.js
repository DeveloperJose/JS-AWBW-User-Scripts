// ==UserScript==
// @name AWBW Highlight Cursor Coordinates
// @description Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.
// @version 1.0.2
// @author DeveloperJose
// @supportURL https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @match https://awbw.amarriner.com/*?games_id=*
// @match https://awbw.amarriner.com/*?replays_id=*
// @icon https://awbw.amarriner.com/terrain/unit_select.gif
// @license MIT
// @namespace https://awbw.amarriner.com/
// ==/UserScript==

var __webpack_exports__ = {};

;// ./shared/awbw_site.js
/**
 * @file Constants, functions, and computed variables that come from analyzing the web pages of AWBW.
 *  Another way to think of this file is that this file represents the AWBW "API".
 *  A lot of useful information came from game.js and the code at the bottom of each game page.
 */

// ============================== JSDoc TypeDefs ==============================
/**
 * @typedef {Object} PlayerInfo
 * @property {number} cities - Number of cities owned by the player.
 * @property {number} co_max_power - Number of funds in damage needed for CO Power activation.
 * @property {number} co_max_spower - Number of funds in damage needed for Super CO Power activation.
 * @property {string} co_name -
 * @property {string} countries_code -
 * @property {string} countries_name -
 * @property {number} labs -
 * @property {number} numProperties -
 * @property {*} other_buildings -
 * @property {number} players_co_id -
 * @property {string} players_co_image - Filename for CO image.
 * @property {number} players_co_max_power -
 * @property {number} players_co_max_spower -
 * @property {number} players_co_power - Current power charge in terms of funds of damage received and given.
 * @property {string} players_co_power_on - String representing our power state. N = No power, Y = CO Power, S = Super CO Power.
 * @property {number} players_countries_id -
 * @property {string} players_eliminated - String representing if the player has been eliminated from the game. "Y" or "N".
 * @property {number} players_funds -
 * @property {number} players_id - ID of the player.
 * @property {number} players_income -
 * @property {number} players_order -
 * @property {string} players_team -
 * @property {number} players_turn_clock -
 * @property {number} players_turn_start -
 * @property {number} towers -
 * @property {string} users_username - Username of the player
 */

/**
 * @typedef {Object} UnitInfo
 * @property {string} units_name - Name of this unit.
 * @property {number} units_moved - Whether this unit has moved (1) or not (0) represented as a number.
 */

// ============================== Advance Wars Stuff ==============================

/**
 * @constant
 * List of Black Hole COs, stored in a set for more efficient lookups.
 */
const BLACK_HOLE_CO_LIST = new Set([
  "flak",
  "lash",
  "adder",
  "hawke",
  "sturm",
  "jugger",
  "koal",
  "kindle",
  "vonbolt",
]);

// ============================== AWBW Page Elements ==============================
let gamemap = document.querySelector("#gamemap");
let gamemapContainer = document.querySelector("#gamemap-container");
let zoomInBtn = document.querySelector("#zoom-in");
let zoomOutBtn = document.querySelector("#zoom-out");
let zoomLevel = document.querySelector(".zoom-level");
let cursor = document.querySelector("#cursor");
let eventUsername = document.querySelector(".event-username");

let replayOpenBtn = document.querySelector(".replay-open");
let replayCloseBtn = document.querySelector(".replay-close");
let replayForwardBtn = document.querySelector(".replay-forward");
let replayForwardActionBtn = document.querySelector(".replay-forward-action");
let replayBackwardBtn = document.querySelector(".replay-backward");
let replayBackwardActionBtn = document.querySelector(".replay-backward-action");
let replayDaySelectorCheckBox = document.querySelector(".replay-day-selector");

// ============================== AWBW Page Global Variables ==============================
/* global maxX, maxY, gameAnims */
/* global playersInfo, playerKeys, unitsInfo, currentTurn */

/**
 * The number of columns of this map.
 * @type {number}
 */
let mapCols = maxX;

/**
 * The number of rows of this map.
 * @type {number}
 */
let mapRows = maxY;

/**
 * Whether game animations are enabled or not.
 * @type {boolean}
 */
let gameAnimations = (/* unused pure expression or super */ null && (gameAnims));

/**
 * The amount of time between the silo launch animation and the hit animation in milliseconds.
 * @type {number}
 */
let siloDelayMS = (/* unused pure expression or super */ null && (gameAnimations ? 3000 : 0));

// ============================== My Own Computed AWBW Variables and Functions ==============================

/**
 * Are we in the map editor?
 */
let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;

/**
 * Gets the username of the person logged in to the website.
 * @type {string}
 */
let myName = document
  .querySelector("#profile-menu")
  .getElementsByClassName("dropdown-menu-link")[0]
  .href.split("username=")[1];

/**
 * The HTML node for the game menu, the little bar with all the icons.
 * @type {Element}
 */
let menu = isMapEditor
  ? document.querySelector("#replay-misc-controls")
  : document.querySelector("#game-map-menu").parentNode;

/**
 * The player ID for the person logged in to the website.
 * Singleton set and returned by {@link getMyID}
 * @type {number}
 */
let myID = null;

/**
 * Gets the ID of the person logged in to the website.
 * @returns {number} The player ID of the person logged in to the website.
 */
function getMyID() {
  if (myID === null) {
    getAllPlayersInfo().forEach((entry) => {
      if (entry.users_username === myName) {
        myID = entry.players_id;
      }
    });
  }
  return myID;
}

/**
 * Gets the player info data for the given user ID or null if the user ID is not part of the game.
 * @param {number} pid - Player ID whose info we will get.
 * @returns {PlayerInfo} - The info for that given player or null if such ID is not present in the game.
 */
function getPlayerInfo(pid) {
  return playersInfo[pid];
}

/**
 * Gets a list of all the player info data for all players in the current game.
 * @returns {PlayerInfo[]} - List of player info data for all players in the current game.
 */
function getAllPlayersInfo() {
  return Object.values(playersInfo);
}

/**
 * Determines if the given player is a spectator based on their ID.
 * @param {number} pid - Player ID who we want to check.
 * @returns True if the player is a spectator, false if they are playing in this game.
 */
function isPlayerSpectator(pid) {
  return !playerKeys.includes(pid);
}

/**
 * Checks if the given player is able to activate a regular CO Power.
 * @param {number} pid - Player ID for whom we want to check.
 * @returns True if the player can activate a regular CO Power.
 */
function canPlayerActivateCOPower(pid) {
  let info = getPlayerInfo(pid);
  return info.players_co_power >= info.players_co_max_power;
}

/**
 * Checks if the given player is able to activate a Super CO Power.
 * @param {number} pid - Player ID for whom we want to check.
 * @returns True if the player can activate a Super CO Power.
 */
function canPlayerActivateSuperCOPower(pid) {
  let info = getPlayerInfo(pid);
  return info.players_co_power >= info.players_co_max_spower;
}

/**
 * Useful variables related to the player currently playing this turn.
 */
const currentPlayer = {
  /**
   * Get the internal info object containing the state of the current player.
   * @type {PlayerInfo}
   */
  get info() {
    return getPlayerInfo(currentTurn);
  },

  /**
   * Determine whether a CO Power or Super CO Power is activated for the current player.
   * @returns True if a regular CO power or a Super CO Power is activated.
   */
  get isPowerActivated() {
    return this.coPowerState !== "N";
  },

  /**
   * Gets state of the CO Power for the current player represented as a single letter.
   * @returns {string} "N" if no power, "Y" if regular CO Power, "S" if Super CO Power.
   */
  get coPowerState() {
    return this.info.players_co_power_on;
  },

  /**
   * Gets the name of the CO for the current player.
   */
  get coName() {
    return this.info.co_name;
  },
};

/**
 * Determine who all the COs of the match are and return a list of their names.
 * @returns {string[]} List with the names of each CO in the match.
 */
function getAllCONames() {
  return getAllPlayersInfo().map((info) => info.co_name);
}

/**
 * Determines if the given CO is an ally or a part of Black Hole.
 * @param {string} coName - Name of the CO to check.
 * @returns True if the given CO is part of Black Hole.
 */
function isBlackHoleCO(coName) {
  return BLACK_HOLE_CO_LIST.has(coName.toLowerCase());
}

/**
 * Gets the internal info object for the given unit.
 * @param {number} unitID - ID of the unit for whom we want to get the current info state.
 * @returns {UnitInfo} - The info for that unit at its current state.
 */
function getUnitInfo(unitID) {
  return unitsInfo[unitID];
}

/**
 * Gets the name of the given unit or null if the given unit is invalid.
 * @param {number} unitID - ID of the unit for whom we want to get the name.
 * @returns String of the unit name.
 */
function getUnitName(unitID) {
  return getUnitInfo(unitID)?.units_name;
}

/**
 * Checks if the given unit is a valid unit.
 * A unit is valid when we can find its info in the current game state.
 * @param {number} unitID - ID of the unit we want to check.
 * @returns True if the given unit is valid.
 */
function isValidUnit(unitID) {
  return unitID !== undefined && unitsInfo[unitID] !== undefined;
}

/**
 * Checks if the given unit has moved this turn.
 * @param {number} unitID - ID of the unit we want to check.
 * @returns True if the unit is valid and it has moved this turn.
 */
function hasUnitMovedThisTurn(unitID) {
  return isValidUnit(unitID) && getUnitInfo(unitID)?.units_moved === 1;
}

;// ./shared/other_userscripts.js
/**
 * @file Constants, functions, and computed variables that come from other userscripts.
 *  These are useful when we want to have better synergy with other userscripts.
 */

/**
 * The button that is used to enter maximization mode or exit it for the AWBW Maximize Extension
 */
let maximizeBtn = document.getElementsByClassName("AWBWMaxmiseButton")[0];

;// ./highlight_coordinates/main.js
/**
 * AWBW Highlight Cursor Coordinates
 * main.js - Main script that loads everything
 */




/********************** Script Variables ***********************/
const CURSOR_THRESHOLD_MS = 30;
let previousHighlight = null;
let isMaximizeToggled = false;
let lastCursorCall = Date.now();

let spotSpanTemplate = document.createElement("span");
spotSpanTemplate.style.width = "16px";
spotSpanTemplate.style.height = "16px";
spotSpanTemplate.style.left = "-16px";
spotSpanTemplate.style.top = mapRows * 16 + "px";
spotSpanTemplate.style.fontFamily = "monospace";
spotSpanTemplate.style.position = "absolute";
spotSpanTemplate.style.fontSize = "11px";
spotSpanTemplate.style.zIndex = "100";
// spotSpanTemplate.style.visibility = "hidden";

/********************** Script Functions **********************/
function setHighlight(node, highlight) {
  let fontWeight = "";
  let color = "";
  let backgroundColor = "";

  if (highlight) {
    fontWeight = "bold";
    color = "#FFFFFF";
    backgroundColor = "#FF0000";
  }
  node.style.fontWeight = fontWeight;
  node.style.color = color;
  node.style.backgroundColor = backgroundColor;
}

function onZoomChangeEvent(_pointerEvent = null, zoom = null) {
  if (zoom === null) {
    zoom = parseFloat(zoomLevel.textContent);
  }

  let padding = 16 * zoom;
  gamemapContainer.style.paddingBottom = padding + "px";
  gamemapContainer.style.paddingLeft = padding + "px";
}

/********************** Intercepted Action Handlers ***********************/
/* global updateCursor:writeable */
let oldUpdateCursor = updateCursor;

updateCursor = function () {
  oldUpdateCursor.apply(window.updateCursor, arguments);

  if (Date.now() - lastCursorCall <= CURSOR_THRESHOLD_MS) {
    lastCursorCall = Date.now();
    return;
  }

  // Get cursor row and column indices then the span
  let cursorRow = Math.abs(Math.ceil(parseInt(cursor.style.top) / 16));
  let cursorCol = Math.abs(Math.ceil(parseInt(cursor.style.left) / 16));
  let highlightRow = document.getElementById("grid-spot-row-" + cursorRow);
  let highlightCol = document.getElementById("grid-spot-col-" + cursorCol);

  // Remove highlight for previous
  if (previousHighlight != null) {
    setHighlight(previousHighlight[0], false);
    setHighlight(previousHighlight[1], false);
  }

  // Highlight current
  setHighlight(highlightRow, true);
  setHighlight(highlightCol, true);
  previousHighlight = [highlightRow, highlightCol];

  lastCursorCall = Date.now();
};

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
if (zoomInBtn != null) {
  zoomInBtn.onclick = onZoomChangeEvent;
}

if (zoomOutBtn != null) {
  zoomOutBtn.onclick = onZoomChangeEvent;
}

// Synergize with AWBW Maximize if that script is running as well
if (maximizeBtn != null) {
  console.log("AWBW Highlight Cursor Coordinates script found AWBW Maximize script");
  let old_fn = maximizeBtn.onclick;
  maximizeBtn.onclick = (event) => {
    old_fn(event);
    isMaximizeToggled = !isMaximizeToggled;
    onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : null);
  };
}

// Scale to current zoom level
onZoomChangeEvent();

// Create squares
for (let row = 0; row < mapRows; row++) {
  let spotSpan = spotSpanTemplate.cloneNode(true);
  spotSpan.id = "grid-spot-row-" + row;
  spotSpan.style.top = row * 16 + "px";
  spotSpan.textContent = row;
  gamemap.appendChild(spotSpan);
}

for (let col = 0; col < mapCols; col++) {
  let spotSpan = spotSpanTemplate.cloneNode(true);
  spotSpan.id = "grid-spot-col-" + col;
  spotSpan.style.left = col * 16 + "px";
  spotSpan.textContent = col;
  gamemap.appendChild(spotSpan);
}

console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");

