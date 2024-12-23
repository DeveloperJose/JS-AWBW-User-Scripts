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
 * @property {Object} other_buildings -
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

/**
 * @typedef {Object} BuildingInfo
 * @property {string} terrain_name
 * @property {number} buildings_id
 */

/**
 * @typedef SeamResponse
 * @property {string} action
 * @property {UnitInfo} attacker
 * @property {Object} newMoveCosts
 * @property {number} seamHp
 * @property {number} seamTerrainId
 * @property {number} seamX
 * @property {number} seamY
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
export let gamemap = document.querySelector("#gamemap");
export let gamemapContainer = document.querySelector("#gamemap-container");
export let zoomInBtn = document.querySelector("#zoom-in");
export let zoomOutBtn = document.querySelector("#zoom-out");
export let zoomLevel = document.querySelector(".zoom-level");
export let cursor = document.querySelector("#cursor");
export let eventUsername = document.querySelector(".event-username");

export let supplyIcon = document.querySelector(".supply-icon");
export let trappedIcon = document.querySelector(".trapped-icon");
export let targetIcon = document.querySelector(".target-icon");
export let explosionIcon = document.querySelector(".destroy-icon");

export let replayOpenBtn = document.querySelector(".replay-open");
export let replayCloseBtn = document.querySelector(".replay-close");
export let replayForwardBtn = document.querySelector(".replay-forward");
export let replayForwardActionBtn = document.querySelector(".replay-forward-action");
export let replayBackwardBtn = document.querySelector(".replay-backward");
export let replayBackwardActionBtn = document.querySelector(".replay-backward-action");
export let replayDaySelectorCheckBox = document.querySelector(".replay-day-selector");

// ============================== AWBW Page Global Variables ==============================
/* global maxX, maxY */
/* global playersInfo, playerKeys, currentTurn */
/* global unitsInfo */
/* global buildingsInfo */
/* global gameAnims, animIcon */

/**
 * The number of columns of this map.
 * @type {number}
 */
export let mapCols = typeof maxX !== "undefined" ? maxX : -1;

/**
 * The number of rows of this map.
 * @type {number}
 */
export let mapRows = typeof maxY !== "undefined" ? maxY : -1;

/**
 * Whether game animations are enabled or not.
 * @type {boolean}
 */
export let gameAnimations = typeof gameAnims !== "undefined" ? gameAnims : false;

// ============================== My Own Computed AWBW Variables and Functions ==============================
/**
 * The amount of time between the silo launch animation and the hit animation in milliseconds.
 * @type {number}
 */
export let siloDelayMS = gameAnimations ? 3000 : 0;

/**
 * The amount of time between an attack animation starting and the attack finishing in milliseconds.
 */
export let attackDelayMS = gameAnimations ? 1000 : 0;

/**
 * Are we in the map editor?
 */
export let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;

/**
 * Gets the username of the person logged in to the website.
 * @type {string}
 */
export let myName = document
  .querySelector("#profile-menu")
  .getElementsByClassName("dropdown-menu-link")[0]
  .href.split("username=")[1];

/**
 * The HTML node for the game menu, the little bar with all the icons.
 * @type {Element}
 */
export let menu = isMapEditor
  ? document.querySelector("#replay-misc-controls")
  : document.querySelector("#game-map-menu")?.parentNode;

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
export function getMyID() {
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
export function getPlayerInfo(pid) {
  return playersInfo[pid];
}

/**
 * Gets a list of all the player info data for all players in the current game.
 * @returns {PlayerInfo[]} - List of player info data for all players in the current game.
 */
export function getAllPlayersInfo() {
  return Object.values(playersInfo);
}

/**
 * Determines if the given player is a spectator based on their ID.
 * @param {number} pid - Player ID who we want to check.
 * @returns True if the player is a spectator, false if they are playing in this game.
 */
export function isPlayerSpectator(pid) {
  return !playerKeys.includes(pid);
}

/**
 * Checks if the given player is able to activate a regular CO Power.
 * @param {number} pid - Player ID for whom we want to check.
 * @returns True if the player can activate a regular CO Power.
 */
export function canPlayerActivateCOPower(pid) {
  let info = getPlayerInfo(pid);
  return info.players_co_power >= info.players_co_max_power;
}

/**
 * Checks if the given player is able to activate a Super CO Power.
 * @param {number} pid - Player ID for whom we want to check.
 * @returns True if the player can activate a Super CO Power.
 */
export function canPlayerActivateSuperCOPower(pid) {
  let info = getPlayerInfo(pid);
  return info.players_co_power >= info.players_co_max_spower;
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @returns
 */
export function isValidBuilding(x, y) {
  return buildingsInfo[x] && buildingsInfo[x][y];
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @returns {BuildingInfo}
 */
export function getBuildingInfo(x, y) {
  return buildingsInfo[x][y];
}

/**
 *
 * @param {*} buildingID
 * @returns {HTMLDivElement}
 */
export function getBuildingDiv(buildingID) {
  return document.querySelector(`.game-building[data-building-id='${buildingID}']`);
}

/**
 * How much time in milliseconds to let pass between animation steps for {@link moveDivToOffset}.
 * The lower, the faster the "animation" will play.
 */
let moveAnimationDelayMS = 5;

/**
 *
 * @param {*} div
 * @param {*} dx Number of pixels to move left/right (column) at each step
 * @param {*} dy Number of pixels to move up/down (row) at each step
 * @param {*} steps Number of steps to take
 */
export function moveDivToOffset(div, dx, dy, steps, ...options) {
  if (steps <= 1) {
    if (options.length > 0) {
      let nextSet = options.shift().then;
      moveDivToOffset(div, nextSet[0], nextSet[1], nextSet[2], ...options);
    }
    return;
  }

  setTimeout(() => moveDivToOffset(div, dx, dy, steps - 1, ...options), moveAnimationDelayMS);
  let left = parseFloat(div.style.left);
  let top = parseFloat(div.style.top);
  left += dx;
  top += dy;
  div.style.left = left + "px";
  div.style.top = top + "px";
}

/**
 *
 * @param {*} icon
 * @param {*} delay
 * @param {*} animation
 * @param {*} x
 * @param {*} y
 * @param {*} offsetX
 * @param {*} offsetY
 * @returns
 */
export function playAnimationIcon(icon, delay, animation, x, y, offsetX, offsetY) {
  return animIcon(icon, delay, animation, x, y, offsetX, offsetY);
}

/**
 * Useful variables related to the player currently playing this turn.
 */
export const currentPlayer = {
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
export function getAllCONames() {
  return getAllPlayersInfo().map((info) => info.co_name);
}

/**
 * Determines if the given CO is an ally or a part of Black Hole.
 * @param {string} coName - Name of the CO to check.
 * @returns True if the given CO is part of Black Hole.
 */
export function isBlackHoleCO(coName) {
  return BLACK_HOLE_CO_LIST.has(coName.toLowerCase());
}

/**
 * Gets the internal info object for the given unit.
 * @param {number} unitId - ID of the unit for whom we want to get the current info state.
 * @returns {UnitInfo} - The info for that unit at its current state.
 */
export function getUnitInfo(unitId) {
  return unitsInfo[unitId];
}

/**
 * Gets the name of the given unit or null if the given unit is invalid.
 * @param {number} unitId - ID of the unit for whom we want to get the name.
 * @returns String of the unit name.
 */
export function getUnitName(unitId) {
  return getUnitInfo(unitId)?.units_name;
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @returns {UnitInfo}
 */
export function getUnitInfoFromCoords(x, y) {
  return Object.values(unitsInfo)
    .filter((info) => info.units_x == x && info.units_y == y)
    .pop();
}

/**
 * Checks if the given unit is a valid unit.
 * A unit is valid when we can find its info in the current game state.
 * @param {number} unitId - ID of the unit we want to check.
 * @returns True if the given unit is valid.
 */
export function isValidUnit(unitId) {
  return unitId !== undefined && unitsInfo[unitId] !== undefined;
}

/**
 * Checks if the given unit has moved this turn.
 * @param {number} unitId - ID of the unit we want to check.
 * @returns True if the unit is valid and it has moved this turn.
 */
export function hasUnitMovedThisTurn(unitId) {
  return isValidUnit(unitId) && getUnitInfo(unitId)?.units_moved === 1;
}
