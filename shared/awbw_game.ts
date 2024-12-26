/**
 * @file Constants, functions, and variables related to the game state in Advance Wars By Web.
 *  A lot of useful information came from game.js and the code at the bottom of each game page.
 */

import { gameAnimations } from "./awbw_globals";
import { isMapEditor } from "./awbw_page";

/**
 * Enum for the different states a CO Power can be in.
 * @enum {string}
 */
export enum COPowerEnum {
  NoPower = "N",
  COPower = "Y",
  SuperCOPower = "S",
}

/**
 * The amount of time between the silo launch animation and the hit animation in milliseconds.
 * Copied from game.js
 */
export let siloDelayMS = gameAnimations ? 3000 : 0;

/**
 * The amount of time between an attack animation starting and the attack finishing in milliseconds.
 * Copied from game.js
 */
export let attackDelayMS = gameAnimations ? 1000 : 0;

/**
 * Gets the username of the person logged in to the website.
 */
export let myName = (
  document
    .querySelector("#profile-menu")
    .getElementsByClassName("dropdown-menu-link")[0] as HTMLAnchorElement
).href.split("username=")[1];

/**
 * The player ID for the person logged in to the website.
 * Singleton set and returned by {@link getMyID}
 */
let myID: number = -1;

/**
 * Gets the ID of the person logged in to the website.
 * @returns - The player ID of the person logged in to the website.
 */
export function getMyID() {
  if (myID < 0) {
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
 * @param pid - Player ID whose info we will get.
 * @returns - The info for that given player or null if such ID is not present in the game.
 */
export function getPlayerInfo(pid: number): PlayerInfo {
  return playersInfo[pid];
}

/**
 * Gets a list of all the player info data for all players in the current game.
 * @returns - List of player info data for all players in the current game.
 */
export function getAllPlayersInfo() {
  return Object.values(playersInfo);
}

/**
 * Determines if the given player is a spectator based on their ID.
 * @param pid - Player ID who we want to check.
 * @returns True if the player is a spectator, false if they are playing in this game.
 */
export function isPlayerSpectator(pid: number) {
  return !playerKeys.includes(pid);
}

/**
 * Checks if the given player is able to activate a regular CO Power.
 * @param pid - Player ID for whom we want to check.
 * @returns - True if the player can activate a regular CO Power.
 */
export function canPlayerActivateCOPower(pid: number) {
  let info = getPlayerInfo(pid);
  return info.players_co_power >= info.players_co_max_power;
}

/**
 * Checks if the given player is able to activate a Super CO Power.
 * @param pid - Player ID for whom we want to check.
 * @returns - True if the player can activate a Super CO Power.
 */
export function canPlayerActivateSuperCOPower(pid: number) {
  let info = getPlayerInfo(pid);
  return info.players_co_power >= info.players_co_max_spower;
}

/**
 * Determines if there is a building at the given coordinates.
 * @param x - X coordinate to check.
 * @param y - Y coordinate to check.
 * @returns - True if there is a building at the given coordinates.
 */
export function isValidBuilding(x: number, y: number) {
  return buildingsInfo[x] && buildingsInfo[x][y];
}

/**
 * Gets the internal info object for the given building.
 * @param x - X coordinate of the building.
 * @param y - Y coordinate of the building.
 * @returns - The info for that building at its current state.
 */
export function getBuildingInfo(x: number, y: number) {
  return buildingsInfo[x][y];
}

/**
 * Gets the data of the current building or unit clicked by the user if any.
 * @returns - Data of the current building or unit clicked by the user.
 */
export function getCurrentClickData() {
  if (!currentClick) return null;
  return currentClick;
}

/**
 * Useful variables related to the player currently playing this turn.
 */
export abstract class currentPlayer {
  /**
   * Get the internal info object containing the state of the current player.
   */
  static get info(): PlayerInfo {
    if (typeof currentTurn === "undefined") return null;
    return getPlayerInfo(currentTurn);
  }

  /**
   * Determine whether a CO Power or Super CO Power is activated for the current player.
   * @returns - True if a regular CO power or a Super CO Power is activated.
   */
  static get isPowerActivated() {
    return this?.coPowerState !== COPowerEnum.NoPower;
  }

  /**
   * Gets state of the CO Power for the current player represented as a single letter.
   * @returns - The state of the CO Power for the current player.
   */
  static get coPowerState() {
    return this.info?.players_co_power_on;
  }

  /**
   * Gets the name of the CO for the current player.
   */
  static get coName() {
    return this.info?.co_name;
  }
}

/**
 * Determine who all the COs of the game are and return a list of their names.
 * @returns - List with the names of each CO in the game.
 */
export function getAllPlayingCONames() {
  if (isMapEditor) return new Set(["map-editor"]);
  return new Set(getAllPlayersInfo().map((info) => info.co_name));
}

/**
 * Gets the internal info object for the given unit.
 * @param unitId - ID of the unit for whom we want to get the current info state.
 * @returns - The info for that unit at its current state.
 */
export function getUnitInfo(unitId: number) {
  return unitsInfo[unitId];
}

/**
 * Gets the name of the given unit or null if the given unit is invalid.
 * @param unitId - ID of the unit for whom we want to get the name.
 * @returns - Name of the unit.
 */
export function getUnitName(unitId: number) {
  return getUnitInfo(unitId)?.units_name;
}

/**
 * Try to get the unit info for the unit at the given coordinates, if any.
 * @param x - X coordinate to get the unit info from.
 * @param y - Y coordinate to get the unit info from.
 * @returns - The info for the unit at the given coordinates or null if there is no unit there.
 */
export function getUnitInfoFromCoords(x: number, y: number) {
  return Object.values(unitsInfo)
    .filter((info) => info.units_x == x && info.units_y == y)
    .pop();
}

/**
 * Checks if the given unit is a valid unit.
 * A unit is valid when we can find its info in the current game state.
 * @param unitId - ID of the unit we want to check.
 * @returns - True if the given unit is valid.
 */
export function isValidUnit(unitId: number) {
  return unitId !== undefined && unitsInfo[unitId] !== undefined;
}

/**
 * Checks if the given unit has moved this turn.
 * @param unitId - ID of the unit we want to check.
 * @returns - True if the unit is valid and it has moved this turn.
 */
export function hasUnitMovedThisTurn(unitId: any) {
  return isValidUnit(unitId) && getUnitInfo(unitId)?.units_moved === HasUnitMoved.Yes;
}
