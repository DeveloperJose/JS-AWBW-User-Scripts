// ==UserScript==
// @name        Improved AWBW Music Player
// @description An improved version of the comprehensive audio player that attempts to recreate the cart experience with more sound effects, more music, and more customizability.
// @namespace   https://awbw.amarriner.com/
// @author      DeveloperJose, _twiggy
// @match       https://awbw.amarriner.com/*?games_id=*
// @match       https://awbw.amarriner.com/*editmap*
// @icon        https://developerjose.netlify.app/img/music-player-icon.png
// @version     3.0.0
// @supportURL  https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @license     MIT
// @grant       none
// ==/UserScript==

var awbw_music_player = (function (exports) {
  "use strict";

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === "undefined") {
      return;
    }

    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";

    if (insertAt === "top") {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$1 =
    '/* This file is used to style the music player settings */\n\n.cls-settings-menu {\n  display: none;\n  /* display: flex; */\n  top: 40px;\n  flex-direction: column;\n  width: 850px;\n  border: black 1px solid;\n}\n\n.cls-settings-menu label {\n  width: 100%;\n  font-size: 13px;\n  background-color: #d6e0ed;\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n\n.cls-settings-menu .cls-horizontal-box {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  align-items: center;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  height: 100%;\n  width: 100%;\n}\n\n.cls-settings-menu .cls-horizontal-box[id$="random-themes"],\n.cls-settings-menu .cls-horizontal-box[id$="soundtrack"] {\n  justify-content: center;\n}\n\n.cls-settings-menu .cls-vertical-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  height: 100%;\n  /* width: 100%; */\n}\n\n.cls-settings-menu-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  width: 100%;\n}\n\n/* Puts the checkbox next to the label */\n.cls-settings-menu .cls-vertical-box[id$="effects"] {\n  align-items: center;\n  align-self: center;\n}\n\n.cls-settings-menu .cls-vertical-box label {\n  background-color: white;\n  font-size: 12px;\n}\n\n.cls-settings-menu image {\n  vertical-align: middle;\n}\n\n.cls-settings-menu label[id$="version"] {\n  width: 100%;\n  font-size: 10px;\n  color: #888888;\n  background-color: #f0f0f0;\n}\n\n.cls-settings-menu .co_caret {\n  position: absolute;\n  top: 28px;\n  left: 25px;\n  border: none;\n  z-index: 110;\n}\n\n.cls-settings-menu .co_portrait {\n  border-color: #009966;\n  z-index: 100;\n  border: 2px solid;\n  vertical-align: middle;\n  align-self: center;\n}\n\n.cls-settings-menu input[type="range"][id$="themes-start-on-day"] {\n  --c: rgb(168, 73, 208); /* active color */\n}\n';
  styleInject(css_248z$1);

  var css_248z =
    '/* \n * CSS Custom Range Slider\n * https://www.sitepoint.com/css-custom-range-slider/ \n */\n\n.cls-settings-menu input[type="range"] {\n  --c: rgb(53 57 60); /* active color */\n  --l: 15px; /* line thickness*/\n  --h: 30px; /* thumb height */\n  --w: 15px; /* thumb width */\n\n  /* width: 100%; */\n  height: var(--h); /* needed for Firefox*/\n  --_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  background: none;\n  cursor: pointer;\n  overflow: hidden;\n  display: inline-block;\n}\n.cls-settings-menu input:focus-visible,\n.cls-settings-menu input:hover {\n  --p: 25%;\n}\n\n/* chromium */\n.cls-settings-menu input[type="range" i]::-webkit-slider-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n/* Firefox */\n.cls-settings-menu input[type="range"]::-moz-range-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n@supports not (color: color-mix(in srgb, red, red)) {\n  .cls-settings-menu input {\n    --_c: var(--c);\n  }\n}\n';
  styleInject(css_248z);

  /**
   * @file Constants, variables, and functions that come from analyzing the web pages of AWBW.
   */
  /**
   * Are we in the map editor?
   */
  function getIsMapEditor() {
    return window.location.href.indexOf("editmap.php?") > -1;
  }
  function getIsMaintenance() {
    return document.querySelector("#server-maintenance-alert") !== null;
  }
  function getIsMovePlanner() {
    return window.location.href.indexOf("moveplanner.php") > -1;
  }
  function getCoordsDiv() {
    return document.querySelector("#coords");
  }
  function getReplayControls() {
    return document.querySelector(".replay-controls");
  }
  function getReplayOpenBtn() {
    return document.querySelector(".replay-open");
  }
  function getReplayCloseBtn() {
    return document.querySelector(".replay-close");
  }
  function getReplayForwardBtn() {
    return document.querySelector(".replay-forward");
  }
  function getReplayForwardActionBtn() {
    return document.querySelector(".replay-forward-action");
  }
  function getReplayBackwardBtn() {
    return document.querySelector(".replay-backward");
  }
  function getReplayBackwardActionBtn() {
    return document.querySelector(".replay-backward-action");
  }
  function getReplayDaySelectorCheckBox() {
    return document.querySelector(".replay-day-selector");
  }
  /**
   * The HTML node for the unit build menu.
   * Specifically works in the Move Planner.
   * @returns The HTML node for the unit build menu.
   */
  function getBuildMenu() {
    return document.querySelector("#build-menu");
  }
  /**
   * The HTML node for the game menu, the little bar with all the icons.
   */
  function getMenu() {
    if (getIsMaintenance()) return document.querySelector("#main");
    if (getIsMapEditor()) return document.querySelector("#replay-misc-controls");
    if (getIsMovePlanner()) return document.querySelector("#map-controls-container");
    return document.querySelector("#game-map-menu")?.parentNode;
  }
  // ============================== Useful Page Utilities ==============================
  /**
   * Gets the HTML div element for the given building, if it exists.
   * @param buildingID - The ID of the building.
   * @returns - The HTML div element for the building, or null if it does not exist.
   */
  function getBuildingDiv(buildingID) {
    return document.querySelector(`.game-building[data-building-id='${buildingID}']`);
  }
  function getAllDamageSquares() {
    return Array.from(document.getElementsByClassName("dmg-square"));
  }
  /**
   * How much time in milliseconds to let pass between animation steps for {@link moveDivToOffset}.
   * The lower, the faster the "animation" will play.
   * @constant
   */
  const moveAnimationDelayMS = 5;
  /**
   * Animates the movement of a div element through moving it by a certain number of pixels in each direction at each step.
   * @param div - The div element to animate.
   * @param dx - Number of pixels to move left/right (column) at each step
   * @param dy - Number of pixels to move up/down (row) at each step
   * @param steps - Number of steps to take
   * @param followUpAnimations - Any additional animations to play after this one finishes.
   */
  function moveDivToOffset(div, dx, dy, steps, ...followUpAnimations) {
    if (steps <= 1) {
      if (!followUpAnimations || followUpAnimations.length === 0) return;
      const nextSet = followUpAnimations.shift()?.then;
      if (!nextSet) return;
      moveDivToOffset(div, nextSet[0], nextSet[1], nextSet[2], ...followUpAnimations);
      return;
    }
    setTimeout(() => moveDivToOffset(div, dx, dy, steps - 1, ...followUpAnimations), moveAnimationDelayMS);
    let left = parseFloat(div.style.left);
    let top = parseFloat(div.style.top);
    left += dx;
    top += dy;
    div.style.left = left + "px";
    div.style.top = top + "px";
  }
  /**
   * Adds an observer to the cursor coordinates so we can replicate the "updateCursor" function outside of game.php
   * @param onCursorMove - The function to call when the cursor moves.
   */
  function addUpdateCursorObserver(onCursorMove) {
    // We want to catch when div textContent is changed
    const coordsDiv = getCoordsDiv();
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") return;
        if (!mutation.target) return;
        if (!mutation.target.textContent) return;
        // (X, Y)
        let coordsText = mutation.target.textContent;
        // Remove parentheses and split by comma
        coordsText = coordsText.substring(1, coordsText.length - 1);
        const splitCoords = coordsText.split(",");
        const cursorX = Number(splitCoords[0]);
        const cursorY = Number(splitCoords[1]);
        onCursorMove(cursorX, cursorY);
      }
    });
    observer.observe(coordsDiv, { childList: true });
  }

  /**
   * @file Global variables exposed by Advance Wars By Web's JS code and other useful constants.
   */
  // ============================== Advance Wars Stuff ==============================
  /**
   * List of Orange Star COs, stored in a set for more efficient lookups.
   */
  const ORANGE_STAR_COs = new Set(["andy", "max", "sami", "nell", "hachi", "jake", "rachel"]);
  /**
   * List of Blue Moon COs, stored in a set for more efficient lookups.
   */
  const BLUE_MOON_COs = new Set(["olaf", "grit", "colin", "sasha"]);
  /**
   * List of Green Earth COs, stored in a set for more efficient lookups.
   */
  const GREEN_EARTH_COs = new Set(["eagle", "drake", "jess", "javier"]);
  /**
   * List of Yellow Comet COs, stored in a set for more efficient lookups.
   */
  const YELLOW_COMET_COs = new Set(["kanbei", "sonja", "sensei", "grimm"]);
  /**
   * List of Black Hole COs, stored in a set for more efficient lookups.
   * @constant
   */
  const BLACK_HOLE_COs = new Set(["flak", "lash", "adder", "hawke", "sturm", "jugger", "koal", "kindle", "vonbolt"]);
  /**
   * List of COs that are only available in Advance Wars 2, stored in a set for more efficient lookups.
   */
  const AW2_ONLY_COs = new Set(["hachi", "colin", "sensei", "jess", "flak", "adder", "lash", "hawke"]);
  /**
   * List of COs that are only available in Dual Strike, stored in a set for more efficient lookups.
   */
  const AW_DS_ONLY_COs = new Set(["jake", "rachel", "sasha", "javier", "grimm", "kindle", "jugger", "koal", "vonbolt"]);
  /**
   * List of all COs in the game.
   */
  function getAllCONames(properCase = false) {
    if (!properCase)
      return [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    const allCOs = [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    allCOs[allCOs.indexOf("vonbolt")] = "Von Bolt";
    return allCOs.map((co) => co[0].toUpperCase() + co.slice(1));
  }
  /**
   * Whether game animations are enabled or not.
   */
  function areAnimationsEnabled() {
    return typeof gameAnims !== "undefined" ? gameAnims : false;
  }
  /**
   * Determines if the given CO is an ally or a part of Black Hole.
   * @param coName - Name of the CO to check.
   * @returns - True if the given CO is part of Black Hole.
   */
  function isBlackHoleCO(coName) {
    // Convert to internal format just in case
    coName = coName.toLowerCase().replaceAll(" ", "");
    return BLACK_HOLE_COs.has(coName);
  }
  /**
   * Randomly selects a CO from the list of all COs.
   * @returns - The name of the randomly selected CO.
   */
  function getRandomCO() {
    const COs = getAllCONames();
    COs.push("map-editor");
    return COs[Math.floor(Math.random() * COs.length)];
  }

  /**
   * @file Constants, functions, and variables related to the game state in Advance Wars By Web.
   *  A lot of useful information came from game.js and the code at the bottom of each game page.
   */
  /**
   * Enum for the different states a CO Power can be in.
   * @enum {string}
   */
  var COPowerEnum;
  (function (COPowerEnum) {
    COPowerEnum["NoPower"] = "N";
    COPowerEnum["COPower"] = "Y";
    COPowerEnum["SuperCOPower"] = "S";
  })(COPowerEnum || (COPowerEnum = {}));
  /**
   * The amount of time between the silo launch animation and the hit animation in milliseconds.
   * Copied from game.js
   */
  const siloDelayMS = areAnimationsEnabled() ? 3000 : 0;
  /**
   * The amount of time between an attack animation starting and the attack finishing in milliseconds.
   * Copied from game.js
   */
  const attackDelayMS = areAnimationsEnabled() ? 1000 : 0;
  /**
   * Gets the username of the person logged in to the website.
   */
  function getMyUsername() {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu) return null;
    const link = profileMenu.getElementsByClassName("dropdown-menu-link")[0];
    return link.href.split("username=")[1];
  }
  /**
   * The player ID for the person logged in to the website.
   * Singleton set and returned by {@link getMyID}
   */
  let myID = -1;
  /**
   * Gets the ID of the person logged in to the website.
   * @returns - The player ID of the person logged in to the website.
   */
  function getMyID() {
    if (myID < 0) {
      getAllPlayersInfo().forEach((entry) => {
        if (entry.users_username === getMyUsername()) {
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
  function getPlayerInfo(pid) {
    if (getIsMaintenance()) return null;
    return playersInfo[pid];
  }
  /**
   * Gets a list of all the player info data for all players in the current game.
   * @returns - List of player info data for all players in the current game.
   */
  function getAllPlayersInfo() {
    if (getIsMaintenance()) return [];
    return Object.values(playersInfo);
  }
  /**
   * Determines if the given player is a spectator based on their ID.
   * @param pid - Player ID who we want to check.
   * @returns True if the player is a spectator, false if they are playing in this game.
   */
  function isPlayerSpectator(pid) {
    if (getIsMaintenance()) return false;
    return !playerKeys.includes(pid);
  }
  /**
   * Checks if the given player is able to activate a regular CO Power.
   * @param pid - Player ID for whom we want to check.
   * @returns - True if the player can activate a regular CO Power.
   */
  function canPlayerActivateCOPower(pid) {
    const info = getPlayerInfo(pid);
    if (!info) return false;
    return info.players_co_power >= info.players_co_max_power;
  }
  /**
   * Checks if the given player is able to activate a Super CO Power.
   * @param pid - Player ID for whom we want to check.
   * @returns - True if the player can activate a Super CO Power.
   */
  function canPlayerActivateSuperCOPower(pid) {
    const info = getPlayerInfo(pid);
    if (!info) return false;
    return info.players_co_power >= info.players_co_max_spower;
  }
  /**
   * Gets the internal info object for the given building.
   * @param x - X coordinate of the building.
   * @param y - Y coordinate of the building.
   * @returns - The info for that building at its current state.
   */
  function getBuildingInfo(x, y) {
    return buildingsInfo[x][y];
  }
  /**
   * Checks if we are currently in replay mode.
   * @returns - True if we are in replay mode.
   */
  function isReplayActive() {
    if (getIsMaintenance() || getIsMapEditor()) return false;
    // Check if replay mode is open by checking if the replay section is set to display
    const replayControls = getReplayControls();
    const replayOpen = replayControls.style.display !== "none";
    return replayOpen;
  }
  /**
   * Checks if the game has ended.
   * @returns - True if the game has ended.
   */
  function hasGameEnded() {
    if (getIsMaintenance() || getIsMapEditor()) return false;
    // Count how many players are still in the game
    const numberOfRemainingPlayers = Object.values(playersInfo).filter(
      (info) => info.players_eliminated === "N",
    ).length;
    return numberOfRemainingPlayers === 1;
  }
  /**
   * Gets the current day in the game, also works properly in replay mode.
   * In the map editor, we consider it to be day 1.
   * @returns - The current day in the game.
   */
  function getCurrentGameDay() {
    if (getIsMaintenance() || getIsMapEditor()) return 1;
    if (!isReplayActive()) return gameDay;
    const replayData = Object.values(replay);
    if (replayData.length === 0) return gameDay;
    const lastData = replayData[replayData.length - 1];
    if (typeof lastData === "undefined") return gameDay;
    if (typeof lastData.day === "undefined") return gameDay;
    return lastData.day;
  }
  /**
   * Useful variables related to the player currently playing this turn.
   */
  class currentPlayer {
    /**
     * Get the internal info object containing the state of the current player.
     */
    static get info() {
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
     * Determine if the current player has been eliminated from the game.
     * @returns - True if the current player has been eliminated.
     */
    static get isEliminated() {
      return this.info?.players_eliminated === "Y";
    }
    /**
     * Gets the name of the CO for the current player.
     * If the game has ended, it will return "victory" or "defeat".
     * If we are in the map editor, it will return "map-editor".
     * @returns - The name of the CO for the current player.
     */
    static get coName() {
      if (getIsMapEditor()) return "map-editor";
      // Check if we are eliminated even if the game has not ended
      const myID = getMyID();
      const myInfo = getPlayerInfo(myID);
      const myLoss = myInfo?.players_eliminated === "Y";
      if (myLoss) return "defeat";
      // Play victory/defeat themes after the game ends for everyone
      if (hasGameEnded()) {
        if (isPlayerSpectator(myID)) return "victory";
        return myLoss ? "defeat" : "victory";
      }
      return this.info?.co_name;
    }
  }
  /**
   * Determine who all the COs of the game are and return a list of their names.
   * @returns - List with the names of each CO in the game.
   */
  function getAllPlayingCONames() {
    if (getIsMapEditor()) return new Set(["map-editor"]);
    const allPlayers = new Set(getAllPlayersInfo().map((info) => info.co_name));
    const allTagPlayers = getAllTagCONames();
    return new Set([...allPlayers, ...allTagPlayers]);
  }
  /**
   * Checks if the game is a tag game with 2 COs per team.
   * @returns - True if the game is a tag game.
   */
  function isTagGame() {
    return typeof tagsInfo !== "undefined" && tagsInfo;
  }
  /**
   * If the game is a tag game, get the names of all secondary COs that are part of the tags.
   * @returns - Set with the names of each secondary CO in the tag.
   */
  function getAllTagCONames() {
    if (!isTagGame()) return new Set();
    return new Set(Object.values(tagsInfo).map((tag) => tag.co_name));
  }
  /**
   * Gets the internal info object for the given unit.
   * @param unitId - ID of the unit for whom we want to get the current info state.
   * @returns - The info for that unit at its current state.
   */
  function getUnitInfo(unitId) {
    return unitsInfo[unitId];
  }
  /**
   * Gets the name of the given unit or null if the given unit is invalid.
   * @param unitId - ID of the unit for whom we want to get the name.
   * @returns - Name of the unit.
   */
  function getUnitName(unitId) {
    return getUnitInfo(unitId)?.units_name;
  }
  /**
   * Try to get the unit info for the unit at the given coordinates, if any.
   * @param x - X coordinate to get the unit info from.
   * @param y - Y coordinate to get the unit info from.
   * @returns - The info for the unit at the given coordinates or null if there is no unit there.
   */
  function getUnitInfoFromCoords(x, y) {
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
  function isValidUnit(unitId) {
    return unitId !== undefined && unitsInfo[unitId] !== undefined;
  }
  /**
   * Checks if the given unit has moved this turn.
   * @param unitId - ID of the unit we want to check.
   * @returns - True if the unit is valid and it has moved this turn.
   */
  function hasUnitMovedThisTurn(unitId) {
    return isValidUnit(unitId) && getUnitInfo(unitId)?.units_moved === 1;
  }

  /**
   * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
   * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
   */
  /**
   * Enum that represents which game we want the music player to use for its music.
   * @enum {string}
   */
  var SettingsGameType;
  (function (SettingsGameType) {
    SettingsGameType["AW1"] = "AW1";
    SettingsGameType["AW2"] = "AW2";
    SettingsGameType["RBC"] = "RBC";
    SettingsGameType["DS"] = "DS";
  })(SettingsGameType || (SettingsGameType = {}));
  /**
   * Enum that represents music theme types like regular or power.
   * @enum {string}
   */
  var SettingsThemeType;
  (function (SettingsThemeType) {
    SettingsThemeType["REGULAR"] = "REGULAR";
    SettingsThemeType["CO_POWER"] = "CO_POWER";
    SettingsThemeType["SUPER_CO_POWER"] = "SUPER_CO_POWER";
  })(SettingsThemeType || (SettingsThemeType = {}));
  /**
   * Gets the theme type enum corresponding to the CO Power state for the current CO.
   * @returns {SettingsThemeType} The SettingsThemeType enum for the current CO Power state.
   */
  function getCurrentThemeType() {
    const currentPowerState = currentPlayer?.coPowerState;
    if (currentPowerState === "Y") return SettingsThemeType.CO_POWER;
    if (currentPowerState === "S") return SettingsThemeType.SUPER_CO_POWER;
    return SettingsThemeType.REGULAR;
  }
  /**
   * String used as the key for storing settings in LocalStorage
   * @constant
   */
  const STORAGE_KEY = "musicPlayerSettings";
  /**
   * List of listener functions that will be called anytime settings are changed.
   */
  const onSettingsChangeListeners = [];
  /**
   * Adds a new listener function that will be called whenever a setting changes.
   * @param fn - The function to call when a setting changes.
   */
  function addSettingsChangeListener(fn) {
    onSettingsChangeListeners.push(fn);
  }
  /**
   * The music player settings' current internal state.
   * DO NOT EDIT __ prefix variables, use the properties!
   */
  class musicPlayerSettings {
    // User configurable settings
    static __isPlaying = false;
    static __volume = 0.5;
    static __sfxVolume = 0.5;
    static __uiVolume = 0.5;
    static __gameType = SettingsGameType.DS;
    static __alternateThemeDay = 15;
    static __randomThemes = false;
    static __captureProgressSFX = true;
    static __pipeSeamSFX = true;
    static __overrideList = new Map();
    // Non-user configurable settings
    static __themeType = SettingsThemeType.REGULAR;
    static __currentRandomCO = getRandomCO();
    static __isLoaded = false;
    static toJSON() {
      return JSON.stringify({
        isPlaying: this.__isPlaying,
        volume: this.__volume,
        sfxVolume: this.__sfxVolume,
        uiVolume: this.__uiVolume,
        gameType: this.__gameType,
        alternateThemeDay: this.__alternateThemeDay,
        randomThemes: this.__randomThemes,
        captureProgressSFX: this.__captureProgressSFX,
        pipeSeamSFX: this.__pipeSeamSFX,
        overrideList: Array.from(this.__overrideList.entries()),
      });
    }
    static fromJSON(json) {
      // Only keep and set settings that are in the current version of musicPlayerSettings
      const savedSettings = JSON.parse(json);
      for (let key in this) {
        key = key.substring(2); // Remove the __ prefix
        if (Object.hasOwn(savedSettings, key)) {
          // Special case for the overrideList, it's a Map
          if (key === "overrideList") {
            this.__overrideList = new Map(savedSettings[key]);
            continue;
          }
          // For all other settings, just set them with the setter function
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this[key] = savedSettings[key];
          // console.debug("[MP] Loading", key, "as", savedSettings[key]);
        }
      }
      this.__isLoaded = true;
    }
    static set isPlaying(val) {
      if (this.__isPlaying === val) return;
      this.__isPlaying = val;
      this.onSettingChangeEvent("isPlaying");
    }
    static get isPlaying() {
      return this.__isPlaying;
    }
    static set volume(val) {
      if (this.__volume === val) return;
      this.__volume = val;
      this.onSettingChangeEvent("volume");
    }
    static get volume() {
      return this.__volume;
    }
    static set sfxVolume(val) {
      if (this.__sfxVolume === val) return;
      this.__sfxVolume = val;
      this.onSettingChangeEvent("sfxVolume");
    }
    static get sfxVolume() {
      return this.__sfxVolume;
    }
    static set uiVolume(val) {
      if (this.__uiVolume === val) return;
      this.__uiVolume = val;
      this.onSettingChangeEvent("uiVolume");
    }
    static get uiVolume() {
      return this.__uiVolume;
    }
    static set gameType(val) {
      if (this.__gameType === val) return;
      this.__gameType = val;
      this.onSettingChangeEvent("gameType");
    }
    static get gameType() {
      return this.__gameType;
    }
    static set alternateThemeDay(val) {
      if (this.__alternateThemeDay === val) return;
      this.__alternateThemeDay = val;
      this.onSettingChangeEvent("alternateThemeDay");
    }
    static get alternateThemeDay() {
      return this.__alternateThemeDay;
    }
    static set captureProgressSFX(val) {
      // if (this.__captureProgressSFX === val) return;
      this.__captureProgressSFX = val;
      this.onSettingChangeEvent("captureProgressSFX");
    }
    static get captureProgressSFX() {
      return this.__captureProgressSFX;
    }
    static set pipeSeamSFX(val) {
      // if (this.__pipeSeamSFX === val) return;
      this.__pipeSeamSFX = val;
      this.onSettingChangeEvent("pipeSeamSFX");
    }
    static get pipeSeamSFX() {
      return this.__pipeSeamSFX;
    }
    static set overrideList(val) {
      this.__overrideList = new Map([...val.entries()].sort());
      this.onSettingChangeEvent("overrideList");
    }
    static get overrideList() {
      return this.__overrideList;
    }
    static addOverride(coName, gameType) {
      this.__overrideList.set(coName, gameType);
      this.__overrideList = new Map([...this.__overrideList.entries()].sort());
      this.onSettingChangeEvent("addOverride");
    }
    static removeOverride(coName) {
      this.__overrideList.delete(coName);
      this.__overrideList = new Map([...this.__overrideList.entries()].sort());
      this.onSettingChangeEvent("removeOverride");
    }
    static getOverride(coName) {
      return this.__overrideList.get(coName);
    }
    // ************* Non-user configurable settings from here on
    static set themeType(val) {
      if (this.__themeType === val) return;
      this.__themeType = val;
      this.onSettingChangeEvent("themeType");
    }
    static get themeType() {
      return this.__themeType;
    }
    static set randomThemes(val) {
      if (this.__randomThemes === val) return;
      this.__randomThemes = val;
      this.onSettingChangeEvent("randomThemes");
    }
    static get randomThemes() {
      return this.__randomThemes;
    }
    static get currentRandomCO() {
      return this.__currentRandomCO;
    }
    static set currentRandomCO(val) {
      // Make sure we don't get the same CO twice in a row
      while (this.__currentRandomCO === val) {
        val = getRandomCO();
      }
      this.__currentRandomCO = val;
      this.onSettingChangeEvent("currentRandomCO");
    }
    static onSettingChangeEvent(key) {
      onSettingsChangeListeners.forEach((fn) => fn(key, !this.__isLoaded));
    }
  }
  /**
   * Loads the music player settings stored in the local storage.
   */
  function loadSettingsFromLocalStorage() {
    let storageData = localStorage.getItem(STORAGE_KEY);
    // Store defaults if nothing or undefined is stored
    if (!storageData || storageData === "undefined") {
      console.log("[AWBW Music Player] No saved settings found, storing defaults");
      storageData = updateSettingsInLocalStorage();
    }
    musicPlayerSettings.fromJSON(storageData);
    // Tell everyone we just loaded the settings
    onSettingsChangeListeners.forEach((fn) => fn("all", true));
    // From now on, any setting changes will be saved and any listeners will be called
    addSettingsChangeListener(onSettingsChange$2);
    console.debug("[Music Player] Settings loaded from storage:", storageData);
  }
  function onSettingsChange$2(_key, _isFirstLoad) {
    // We can't save the non-configurable settings
    if (_key === "themeType" || _key === "currentRandomCO") return "";
    // Save all settings otherwise
    updateSettingsInLocalStorage();
  }
  /**
   * Saves the current music player settings in the local storage.
   */
  function updateSettingsInLocalStorage() {
    const jsonSettings = musicPlayerSettings.toJSON();
    localStorage.setItem(STORAGE_KEY, jsonSettings);
    console.debug("[Music Player] Saving settings...", jsonSettings);
    return jsonSettings;
  }

  /**
   * @file All external resources used by this userscript like URLs and convenience functions for those URLs.
   */
  /**
   * Base URL where all the files needed for this script are located.
   * @constant {string}
   */
  const BASE_URL = "https://developerjose.netlify.app";
  /**
   * Base URL where all the music files are located.
   * @constant {string}
   */
  const BASE_MUSIC_URL = BASE_URL + "/music";
  /**
   * Base URL where all sound effect files are located.
   * @constant {string}
   */
  const BASE_SFX_URL = BASE_MUSIC_URL + "/sfx";
  /**
   * Image URL for static music player icon
   * @constant {string}
   */
  const NEUTRAL_IMG_URL = BASE_URL + "/img/music-player-icon.png";
  /**
   * Image URL for animated music player icon.
   * @constant {string}
   */
  const PLAYING_IMG_URL = BASE_URL + "/img/music-player-playing.gif";
  /**
   * URL for the victory theme music.
   * @constant {string}
   */
  const VICTORY_THEME_URL = BASE_MUSIC_URL + "/t-victory.ogg";
  /**
   * URL for the defeat theme music.
   * @constant {string}
   */
  const DEFEAT_THEME_URL = BASE_MUSIC_URL + "/t-defeat.ogg";
  /**
   * URL for the maintenance theme music.
   * @constant {string}
   */
  const MAINTENANCE_THEME_URL = BASE_MUSIC_URL + "/t-maintenance.ogg";
  /**
   * Enumeration of all game sound effects. The values are the filenames for the sounds.
   * @enum {string}
   */
  var GameSFX;
  (function (GameSFX) {
    GameSFX["coGoldRush"] = "co-gold-rush";
    GameSFX["powerActivateAllyCOP"] = "power-activate-ally-cop";
    GameSFX["powerActivateAllySCOP"] = "power-activate-ally-scop";
    GameSFX["powerActivateBHCOP"] = "power-activate-bh-cop";
    GameSFX["powerActivateBHSCOP"] = "power-activate-bh-scop";
    GameSFX["powerActivateAW1COP"] = "power-activate-aw1-cop";
    GameSFX["powerSCOPAvailable"] = "power-scop-available";
    GameSFX["powerCOPAvailable"] = "power-cop-available";
    GameSFX["tagBreakAlly"] = "tag-break-ally";
    GameSFX["tagBreakBH"] = "tag-break-bh";
    GameSFX["tagSwap"] = "tag-swap";
    GameSFX["unitAttackPipeSeam"] = "unit-attack-pipe-seam";
    GameSFX["unitCaptureAlly"] = "unit-capture-ally";
    GameSFX["unitCaptureEnemy"] = "unit-capture-enemy";
    GameSFX["unitCaptureProgress"] = "unit-capture-progress";
    GameSFX["unitMissileHit"] = "unit-missile-hit";
    GameSFX["unitMissileSend"] = "unit-missile-send";
    GameSFX["unitHide"] = "unit-hide";
    GameSFX["unitUnhide"] = "unit-unhide";
    GameSFX["unitSupply"] = "unit-supply";
    GameSFX["unitTrap"] = "unit-trap";
    GameSFX["unitLoad"] = "unit-load";
    GameSFX["unitUnload"] = "unit-unload";
    GameSFX["unitExplode"] = "unit-explode";
    GameSFX["uiCursorMove"] = "ui-cursor-move";
    GameSFX["uiInvalid"] = "ui-invalid";
    GameSFX["uiMenuOpen"] = "ui-menu-open";
    GameSFX["uiMenuClose"] = "ui-menu-close";
    GameSFX["uiMenuMove"] = "ui-menu-move";
    GameSFX["uiUnitSelect"] = "ui-unit-select";
  })(GameSFX || (GameSFX = {}));
  /**
   * Enumeration of all the unit movement sounds. The values are the filenames for the sounds.
   * @enum {string}
   */
  var MovementSFX;
  (function (MovementSFX) {
    MovementSFX["moveBCopterLoop"] = "move-bcopter";
    MovementSFX["moveBCopterOneShot"] = "move-bcopter-rolloff";
    MovementSFX["moveInfLoop"] = "move-inf";
    MovementSFX["moveMechLoop"] = "move-mech";
    MovementSFX["moveNavalLoop"] = "move-naval";
    MovementSFX["movePiperunnerLoop"] = "move-piperunner";
    MovementSFX["movePlaneLoop"] = "move-plane";
    MovementSFX["movePlaneOneShot"] = "move-plane-rolloff";
    MovementSFX["moveSubLoop"] = "move-sub";
    MovementSFX["moveTCopterLoop"] = "move-tcopter";
    MovementSFX["moveTCopterOneShot"] = "move-tcopter-rolloff";
    MovementSFX["moveTiresHeavyLoop"] = "move-tires-heavy";
    MovementSFX["moveTiresHeavyOneShot"] = "move-tires-heavy-rolloff";
    MovementSFX["moveTiresLightLoop"] = "move-tires-light";
    MovementSFX["moveTiresLightOneShot"] = "move-tires-light-rolloff";
    MovementSFX["moveTreadHeavyLoop"] = "move-tread-heavy";
    MovementSFX["moveTreadHeavyOneShot"] = "move-tread-heavy-rolloff";
    MovementSFX["moveTreadLightLoop"] = "move-tread-light";
    MovementSFX["moveTreadLightOneShot"] = "move-tread-light-rolloff";
  })(MovementSFX || (MovementSFX = {}));
  /**
   * Map that takes unit names as keys and gives you the filename for that unit movement sound.
   */
  const onMovementStartMap = new Map([
    ["APC", MovementSFX.moveTreadLightLoop],
    ["Anti-Air", MovementSFX.moveTreadLightLoop],
    ["Artillery", MovementSFX.moveTreadLightLoop],
    ["B-Copter", MovementSFX.moveBCopterLoop],
    ["Battleship", MovementSFX.moveNavalLoop],
    ["Black Boat", MovementSFX.moveNavalLoop],
    ["Black Bomb", MovementSFX.movePlaneLoop],
    ["Bomber", MovementSFX.movePlaneLoop],
    ["Carrier", MovementSFX.moveNavalLoop],
    ["Cruiser", MovementSFX.moveNavalLoop],
    ["Fighter", MovementSFX.movePlaneLoop],
    ["Infantry", MovementSFX.moveInfLoop],
    ["Lander", MovementSFX.moveNavalLoop],
    ["Md. Tank", MovementSFX.moveTreadHeavyLoop],
    ["Mech", MovementSFX.moveMechLoop],
    ["Mega Tank", MovementSFX.moveTreadHeavyLoop],
    ["Missile", MovementSFX.moveTiresHeavyLoop],
    ["Neotank", MovementSFX.moveTreadHeavyLoop],
    ["Piperunner", MovementSFX.movePiperunnerLoop],
    ["Recon", MovementSFX.moveTiresLightLoop],
    ["Rocket", MovementSFX.moveTiresHeavyLoop],
    ["Stealth", MovementSFX.movePlaneLoop],
    ["Sub", MovementSFX.moveSubLoop],
    ["T-Copter", MovementSFX.moveTCopterLoop],
    ["Tank", MovementSFX.moveTreadLightLoop],
  ]);
  /**
   * Map that takes unit names as keys and gives you the filename to play when that unit has stopped moving, if any.
   */
  const onMovementRolloffMap = new Map([
    ["APC", MovementSFX.moveTreadLightOneShot],
    ["Anti-Air", MovementSFX.moveTreadLightOneShot],
    ["Artillery", MovementSFX.moveTreadLightOneShot],
    ["B-Copter", MovementSFX.moveBCopterOneShot],
    ["Black Bomb", MovementSFX.movePlaneOneShot],
    ["Bomber", MovementSFX.movePlaneOneShot],
    ["Fighter", MovementSFX.movePlaneOneShot],
    ["Md. Tank", MovementSFX.moveTreadHeavyOneShot],
    ["Mega Tank", MovementSFX.moveTreadHeavyOneShot],
    ["Missile", MovementSFX.moveTiresHeavyOneShot],
    ["Neotank", MovementSFX.moveTreadHeavyOneShot],
    ["Recon", MovementSFX.moveTiresLightOneShot],
    ["Rocket", MovementSFX.moveTiresHeavyOneShot],
    ["Stealth", MovementSFX.movePlaneOneShot],
    ["T-Copter", MovementSFX.moveTCopterOneShot],
    ["Tank", MovementSFX.moveTreadLightOneShot],
  ]);
  /**
   * Map that takes a game type and gives you a set of CO names that have alternate themes for that game type.
   */
  const alternateThemes = new Map([
    [SettingsGameType.AW1, new Set(["sturm"])],
    [SettingsGameType.AW2, new Set(["sturm"])],
    [SettingsGameType.RBC, new Set(["andy", "olaf", "eagle", "drake", "grit", "kanbei", "sonja", "sturm"])],
    [SettingsGameType.DS, new Set(["sturm", "vonbolt"])],
  ]);
  /**
   * Set of CO names that have special loops for their music.
   */
  const specialLoops = new Set(["vonbolt"]);
  /**
   * Determines the filename for the alternate music to play given a specific CO and other settings (if any).
   * @param coName - Name of the CO whose music to use.
   * @param gameType - Which game soundtrack to use.
   * @param themeType - Which type of music whether regular or power.
   * @returns - The filename of the alternate music to play given the parameters, if any.
   */
  function getAlternateMusicFilename(coName, gameType, themeType) {
    // Check if this CO has an alternate theme
    if (!alternateThemes.has(gameType)) return;
    const alternateThemesSet = alternateThemes.get(gameType);
    const faction = isBlackHoleCO(coName) ? "bh" : "ally";
    // RBC individual CO power themes -> RBC shared factory themes
    const isPowerActive = themeType !== SettingsThemeType.REGULAR;
    if (gameType === SettingsGameType.RBC && isPowerActive) {
      return `t-${faction}-${themeType}`;
    }
    // No alternate theme or it's a power
    if (!alternateThemesSet?.has(coName) || isPowerActive) {
      return;
    }
    // Andy -> Clone Andy
    if (coName === "andy" && gameType == SettingsGameType.RBC) {
      return isPowerActive ? "t-clone-andy-cop" : "t-clone-andy";
    }
    // All other alternate themes
    return `t-${coName}-2`;
  }
  /**
   * Determines the filename for the music to play given a specific CO and other settings.
   * @param coName - Name of the CO whose music to use.
   * @param gameType - Which game soundtrack to use.
   * @param themeType - Which type of music whether regular or power.
   * @returns - The filename of the music to play given the parameters.
   */
  function getMusicFilename(coName, gameType, themeType, useAlternateTheme) {
    // Check if we want to play the map editor theme
    if (coName === "map-editor") return "t-map-editor";
    // Check if we need to play an alternate theme
    if (useAlternateTheme) {
      const alternateFilename = getAlternateMusicFilename(coName, gameType, themeType);
      if (alternateFilename) return alternateFilename;
    }
    // Regular theme, either no power or we are in AW1 where there's no power themes.
    const isPowerActive = themeType !== SettingsThemeType.REGULAR;
    if (!isPowerActive || gameType === SettingsGameType.AW1) {
      return `t-${coName}`;
    }
    // For RBC, we play the new power themes (if they are not in the DS games obviously)
    const isCOInRBC = !AW_DS_ONLY_COs.has(coName);
    if (gameType === SettingsGameType.RBC && isCOInRBC) {
      return `t-${coName}-cop`;
    }
    // For all other games, play the ally or black hole themes during the CO and Super CO powers
    const faction = isBlackHoleCO(coName) ? "bh" : "ally";
    return `t-${faction}-${themeType}`;
  }
  /**
   * Determines the URL for the music to play given a specific CO, and optionally, some specific settings.
   * The settings will be loaded from the current saved settings if they aren't specified.
   *
   * @param coName - Name of the CO whose music to use.
   * @param gameType - (Optional) Which game soundtrack to use.
   * @param themeType - (Optional) Which type of music to use whether regular or power.
   * @param useAlternateTheme - (Optional) Whether to use the alternate theme for the given CO.
   * @returns - The complete URL of the music to play given the parameters.
   */
  function getMusicURL(coName, gameType, themeType, useAlternateTheme) {
    // Override optional parameters with current settings if not provided
    if (gameType === null || gameType === undefined) gameType = musicPlayerSettings.gameType;
    if (themeType === null || themeType === undefined) themeType = musicPlayerSettings.themeType;
    if (useAlternateTheme === null || useAlternateTheme === undefined) {
      useAlternateTheme = getCurrentGameDay() >= musicPlayerSettings.alternateThemeDay;
    }
    // Convert name to internal format
    coName = coName.toLowerCase().replaceAll(" ", "");
    // Check if we want to play the victory or defeat theme
    if (coName === "victory") return VICTORY_THEME_URL;
    if (coName === "defeat") return DEFEAT_THEME_URL;
    // First apply player overrides, that way we can override their overrides later...
    const overrideType = musicPlayerSettings.getOverride(coName);
    if (overrideType) gameType = overrideType;
    // Override the game type to a higher game if the CO is not available in the current game.
    if (gameType !== SettingsGameType.DS && AW_DS_ONLY_COs.has(coName)) gameType = SettingsGameType.DS;
    if (gameType === SettingsGameType.AW1 && AW2_ONLY_COs.has(coName)) gameType = SettingsGameType.AW2;
    let gameDir = gameType;
    if (!gameDir.startsWith("AW")) gameDir = "AW_" + gameDir;
    const filename = getMusicFilename(coName, gameType, themeType, useAlternateTheme);
    const url = `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`;
    return url.toLowerCase().replaceAll("_", "-").replaceAll(" ", "");
  }
  /**
   * Gets the name of the CO from the given URL, if any.
   * @param url - URL to get the CO name from.
   * @returns - The name of the CO from the given URL.
   */
  function getCONameFromURL(url) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    // Remove t- prefix and .ogg extension
    const coName = filename.split(".")[0].substring(2);
    return coName;
  }
  /**
   * Gets the URL for the given sound effect.
   * @param sfx - Sound effect enum to use.
   * @returns - The URL of the given sound effect.
   */
  function getSoundEffectURL(sfx) {
    return `${BASE_SFX_URL}/${sfx}.ogg`;
  }
  /**
   * Gets the URL to play when the given unit starts to move.
   * @param unitName - Name of the unit.
   * @returns - The URL of the given unit's movement start sound.
   */
  function getMovementSoundURL(unitName) {
    return `${BASE_SFX_URL}/${onMovementStartMap.get(unitName)}.ogg`;
  }
  /**
   * Getes the URL to play when the given unit stops moving, if any.
   * @param unitName - Name of the unit.
   * @returns - The URL of the given unit's movement stop sound, if any, or null otherwise.
   */
  function getMovementRollOffURL(unitName) {
    return `${BASE_SFX_URL}/${onMovementRolloffMap.get(unitName)}.ogg`;
  }
  /**
   * Checks if the given unit plays a sound when it stops moving.
   * @param unitName - Name of the unit.
   * @returns - True if the given unit has a sound to play when it stops moving.
   */
  function hasMovementRollOff(unitName) {
    return onMovementRolloffMap.has(unitName);
  }
  /**
   * Checks if the given URL has a special loop to play after the music finishes.
   * @param srcURL - URL of the music to check.
   * @returns - True if the given URL has a special loop to play after the audio finishes.
   */
  function hasSpecialLoop(srcURL) {
    const coName = getCONameFromURL(srcURL);
    return specialLoops.has(coName);
  }
  /**
   * Gets all the URLs for the music of all currently playing COs for the current game settings.
   * Includes the regular and alternate themes for each CO (if any).
   * @returns - Set with all the URLs for current music of all currently playing COs.
   */
  function getCurrentThemeURLs() {
    const coNames = getAllPlayingCONames();
    const audioList = new Set();
    coNames.forEach((name) => {
      const regularURL = getMusicURL(name, musicPlayerSettings.gameType, SettingsThemeType.REGULAR, false);
      const powerURL = getMusicURL(name, musicPlayerSettings.gameType, SettingsThemeType.CO_POWER, false);
      const superPowerURL = getMusicURL(name, musicPlayerSettings.gameType, SettingsThemeType.SUPER_CO_POWER, false);
      const alternateURL = getMusicURL(name, musicPlayerSettings.gameType, musicPlayerSettings.themeType, true);
      audioList.add(regularURL);
      audioList.add(alternateURL);
      audioList.add(powerURL);
      audioList.add(superPowerURL);
      if (specialLoops.has(name)) audioList.add(regularURL.replace(".ogg", "-loop.ogg"));
    });
    return audioList;
  }
  /**
   * Gets all the URLs for the music of all currently playing COs for ALL possible game settings.
   * Includes the regular and alternate themes for each CO (if any).
   * @returns - Set with all the URLs for all the music of all currently playing COs.
   */
  function getAllCurrentThemesExtraAudioURLs() {
    const audioURLs = new Set();
    const coNames = getAllPlayingCONames();
    for (const gameType in SettingsGameType) {
      for (const themeType in SettingsThemeType) {
        const gameTypeEnum = gameType;
        const themeTypeEnum = themeType;
        coNames?.forEach((name) => audioURLs.add(getMusicURL(name, gameTypeEnum, themeTypeEnum)));
      }
    }
    return audioURLs;
  }
  /**
   * Gets a list of the URLs for all sound effects the music player might ever use.
   * These include game effects, UI effects, and unit movement sounds.
   * @returns - Set with all the URLs for all the music player sound effects.
   */
  function getAllSoundEffectURLs() {
    const allSoundURLs = new Set();
    for (const sfx of Object.values(GameSFX)) {
      allSoundURLs.add(getSoundEffectURL(sfx));
    }
    for (const unitName of onMovementStartMap.keys()) {
      allSoundURLs.add(getMovementSoundURL(unitName));
    }
    for (const unitName of onMovementRolloffMap.keys()) {
      allSoundURLs.add(getMovementRollOffURL(unitName));
    }
    return allSoundURLs;
  }

  /**
   * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
   */
  var CustomInputType;
  (function (CustomInputType) {
    CustomInputType["Radio"] = "radio";
    CustomInputType["Checkbox"] = "checkbox";
    CustomInputType["Button"] = "button";
  })(CustomInputType || (CustomInputType = {}));
  var GroupType;
  (function (GroupType) {
    GroupType["Vertical"] = "cls-vertical-box";
    GroupType["Horizontal"] = "cls-horizontal-box";
  })(GroupType || (GroupType = {}));
  var MenuPosition;
  (function (MenuPosition) {
    MenuPosition["Left"] = "settings-left";
    MenuPosition["Center"] = "settings-center";
    MenuPosition["Right"] = "settings-right";
  })(MenuPosition || (MenuPosition = {}));
  function sanitize(str) {
    return str.toLowerCase().replaceAll(" ", "-");
  }
  /**
   * A class that represents a custom menu UI that can be added to the AWBW page.
   */
  class CustomMenuSettingsUI {
    /**
     * The root element or parent of the custom menu.
     */
    parent;
    /**
     * A map that contains the important nodes of the menu.
     * The keys are the names of the children, and the values are the elements themselves.
     * Allows for easy access to any element in the menu.
     */
    groups = new Map();
    /**
     * A map that contains the group types for each group in the menu.
     * The keys are the names of the groups, and the values are the types of the groups.
     */
    groupTypes = new Map();
    /**
     * An array of all the input elements in the menu.
     */
    inputElements = [];
    /**
     * An array of all the button elements in the menu.
     */
    buttonElements = [];
    /**
     * A boolean that represents whether the settings menu is open or not.
     */
    isSettingsMenuOpen = false;
    /**
     * A string used to prefix the IDs of the elements in the menu.
     */
    prefix = "";
    /**
     * Text to be displayed when hovering over the main button.
     */
    parentHoverText = "";
    tableMap = new Map();
    /**
     * Creates a new Custom Menu UI, to add it to AWBW you need to call {@link addToAWBWPage}.
     * @param prefix - A string used to prefix the IDs of the elements in the menu.
     * @param buttonImageURL - The URL of the image to be used as the button.
     * @param hoverText - The text to be displayed when hovering over the button.
     */
    constructor(prefix, buttonImageURL, hoverText = "") {
      this.prefix = prefix;
      this.parentHoverText = hoverText;
      this.parent = document.createElement("div");
      this.parent.id = `${prefix}-parent`;
      this.parent.classList.add("game-tools-btn");
      this.parent.style.width = "34px";
      this.parent.style.height = "30px";
      this.parent.style.borderLeft = "none";
      if (getIsMapEditor()) {
        this.parent.style.borderTop = "none";
      }
      // Hover text
      const hoverSpan = document.createElement("span");
      hoverSpan.id = `${prefix}-hover-span`;
      hoverSpan.classList.add("game-tools-btn-text", "small_text");
      hoverSpan.innerText = hoverText;
      this.parent.appendChild(hoverSpan);
      this.groups.set("hover", hoverSpan);
      // Button Background
      const bgDiv = document.createElement("div");
      bgDiv.id = `${prefix}-background`;
      bgDiv.classList.add("game-tools-bg");
      bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
      this.parent.appendChild(bgDiv);
      this.groups.set("bg", bgDiv);
      // Reset hover text for parent button
      bgDiv.addEventListener("mouseover", () => this.setHoverText(this.parentHoverText));
      bgDiv.addEventListener("mouseout", () => this.setHoverText(""));
      // Button
      const btnLink = document.createElement("a");
      btnLink.id = `${prefix}-link`;
      btnLink.classList.add("norm2");
      bgDiv.appendChild(btnLink);
      const btnImg = document.createElement("img");
      btnImg.id = `${prefix}-link-img`;
      btnImg.src = buttonImageURL;
      btnLink.appendChild(btnImg);
      this.groups.set("img", btnImg);
      // Context Menu
      const contextMenu = document.createElement("div");
      contextMenu.id = `${prefix}-settings`;
      contextMenu.classList.add("cls-settings-menu");
      this.parent.appendChild(contextMenu);
      this.groups.set("settings-parent", contextMenu);
      const contextMenuBoxesContainer = document.createElement("div");
      contextMenuBoxesContainer.id = `${prefix}-settings-container`;
      contextMenuBoxesContainer.classList.add("cls-horizontal-box");
      contextMenu.appendChild(contextMenuBoxesContainer);
      this.groups.set("settings", contextMenuBoxesContainer);
      // Context Menu 3 Boxes
      const leftBox = document.createElement("div");
      leftBox.id = `${prefix}-settings-left`;
      leftBox.classList.add("cls-settings-menu-box");
      leftBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(leftBox);
      this.groups.set(MenuPosition.Left, leftBox);
      const centerBox = document.createElement("div");
      centerBox.id = `${prefix}-settings-center`;
      centerBox.classList.add("cls-settings-menu-box");
      centerBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(centerBox);
      this.groups.set(MenuPosition.Center, centerBox);
      const rightBox = document.createElement("div");
      rightBox.id = `${prefix}-settings-right`;
      rightBox.classList.add("cls-settings-menu-box");
      rightBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(rightBox);
      this.groups.set(MenuPosition.Right, rightBox);
      // Enable right-click to open and close the context menu
      this.parent.addEventListener("contextmenu", (event) => {
        const element = event.target;
        if (element.id.startsWith(prefix)) {
          event.preventDefault();
          this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
          if (this.isSettingsMenuOpen) {
            this.openContextMenu();
          } else {
            this.closeContextMenu();
          }
        }
      });
      // Close settings menu whenever the user clicks anywhere outside the player
      document.addEventListener("click", (event) => {
        let elmnt = event.target;
        // Find the first parent that has an ID if the element doesn't have one
        if (!elmnt.id) {
          while (!elmnt.id) {
            elmnt = elmnt.parentNode;
            // Break if we reach the top of the document or this element isn't properly connected
            if (!elmnt) break;
          }
        }
        // Most likely this element is part of our UI and was created with JS and not properly connected so don't close
        if (!elmnt) return;
        // Check if we are in the music player or the overlib overDiv, so we don't close the menu
        if (elmnt.id.startsWith(prefix) || elmnt.id === "overDiv") return;
        // Close the menu if we clicked outside of it
        // console.debug("[MP] Clicked on: ", elmnt.id);
        this.closeContextMenu();
      });
    }
    /**
     * Adds the custom menu to the AWBW page.
     */
    addToAWBWPage() {
      getMenu()?.appendChild(this.parent);
    }
    getGroup(groupName) {
      const container = this.groups.get(groupName);
      if (!container) return;
      if (container.style.display === "none") container.style.display = "flex";
      return container;
    }
    /**
     * Changes the hover text of the main button.
     * @param text - The text to be displayed when hovering over the button.
     * @param replaceParent - Whether to replace the current hover text for the main button or not.
     */
    setHoverText(text, replaceParent = false) {
      const hoverSpan = this.groups.get("hover");
      if (!hoverSpan) return;
      if (replaceParent) this.parentHoverText = text;
      hoverSpan.innerText = text;
      hoverSpan.style.display = text === "" ? "none" : "block";
    }
    /**
     * Sets the progress of the UI by coloring the background of the main button.
     * @param progress - A number between 0 and 100 representing the percentage of the progress bar to fill.
     */
    setProgress(progress) {
      const bgDiv = this.groups.get("bg");
      if (!bgDiv) return;
      bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff " + String(progress) + "% , #888888 0%)";
    }
    /**
     * Sets the image of the main button.
     * @param imageURL - The URL of the image to be used on the button.
     */
    setImage(imageURL) {
      const btnImg = this.groups.get("img");
      btnImg.src = imageURL;
    }
    /**
     * Adds an event listener to the main button.
     * @param type - The type of event to listen for.
     * @param listener - The function to be called when the event is triggered.
     */
    addEventListener(type, listener) {
      const div = this.groups.get("bg");
      div?.addEventListener(type, listener);
    }
    /**
     * Opens the context (right-click) menu.
     */
    openContextMenu() {
      const contextMenu = this.groups.get("settings-parent");
      if (!contextMenu) return;
      contextMenu.style.display = "flex";
      this.isSettingsMenuOpen = true;
    }
    /**
     * Closes the context (right-click) menu.
     */
    closeContextMenu() {
      const contextMenu = this.groups.get("settings-parent");
      if (!contextMenu) return;
      contextMenu.style.display = "none";
      this.isSettingsMenuOpen = false;
      // Check if we have a CO selector and need to hide it
      const overDiv = document.querySelector("#overDiv");
      const hasCOSelector = this.groups.has("co-selector");
      if (overDiv && hasCOSelector) {
        overDiv.style.visibility = "hidden";
      }
    }
    /**
     * Adds an input slider to the context menu.
     * @param name - The name of the slider.
     * @param min - The minimum value of the slider.
     * @param max - The maximum value of the slider.
     * @param step - The step value of the slider.
     * @param hoverText - The text to be displayed when hovering over the slider.
     * @param position - The position of the slider in the context menu.
     * @returns - The slider element.
     */
    addSlider(name, min, max, step, hoverText = "", position = MenuPosition.Center) {
      const container = this.getGroup(position);
      if (!container) return;
      // Slider label
      const label = document.createElement("label");
      container?.appendChild(label);
      // Slider
      const slider = document.createElement("input");
      slider.id = `${this.prefix}-${sanitize(name)}`;
      slider.type = "range";
      slider.min = String(min);
      slider.max = String(max);
      slider.step = String(step);
      this.inputElements.push(slider);
      // Set the label to the current value of the slider
      slider.addEventListener("input", (_e) => {
        let displayValue = slider.value;
        if (max === 1) displayValue = Math.round(parseFloat(displayValue) * 100) + "%";
        label.innerText = `${name}: ${displayValue}`;
      });
      container?.appendChild(slider);
      // Hover text
      slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
      slider.addEventListener("mouseout", () => this.setHoverText(""));
      return slider;
    }
    addGroup(groupName, type = GroupType.Horizontal, position = MenuPosition.Center) {
      const contextMenu = this.getGroup(position);
      if (!contextMenu) return;
      // Label for the group
      const groupLabel = document.createElement("label");
      groupLabel.innerText = groupName;
      contextMenu?.appendChild(groupLabel);
      // Group container
      const group = document.createElement("div");
      group.id = `${this.prefix}-${sanitize(groupName)}`;
      group.classList.add(type);
      contextMenu?.appendChild(group);
      this.groups.set(groupName, group);
      this.groupTypes.set(groupName, type);
      return group;
    }
    addRadioButton(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, CustomInputType.Radio);
    }
    addCheckbox(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, CustomInputType.Checkbox);
    }
    addButton(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, CustomInputType.Button);
    }
    /**
     * Adds an input to the context menu in a specific group.
     * @param name - The name of the input.
     * @param groupName - The name of the group the input belongs to.
     * @param hoverText - The text to be displayed when hovering over the input.
     * @param type - The type of input to be added.
     * @returns - The input element.
     */
    addInput(name, groupName, hoverText = "", type) {
      // Check if the group already exists
      const groupDiv = this.getGroup(groupName);
      const groupType = this.groupTypes.get(groupName);
      if (!groupDiv || !groupType) return;
      // Container for input and label
      const inputBox = document.createElement("div");
      const otherType = groupType === GroupType.Horizontal ? GroupType.Vertical : GroupType.Horizontal;
      inputBox.classList.add(otherType);
      groupDiv.appendChild(inputBox);
      // Hover text
      inputBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
      inputBox.addEventListener("mouseout", () => this.setHoverText(""));
      // Create button or a different type of input
      let input;
      if (type === CustomInputType.Button) {
        input = this.createButton(name, inputBox);
      } else {
        input = this.createInput(name, inputBox);
      }
      // Set the rest of the shared input properties
      input.type = type;
      input.name = groupName;
      return input;
    }
    createButton(name, inputBox) {
      // Buttons don't need a separate label
      const input = document.createElement("button");
      input.innerText = name;
      inputBox.appendChild(input);
      this.buttonElements.push(input);
      return input;
    }
    createInput(name, inputBox) {
      // Create the input and a label for it
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.innerText = name;
      // Input first, then label
      inputBox.appendChild(input);
      inputBox.appendChild(label);
      // Propagate label clicks to the input
      label.addEventListener("click", () => input.click());
      this.inputElements.push(input);
      return input;
    }
    /**
     * Adds a special version label to the context menu.
     * @param version - The version to be displayed.
     */
    addVersion(version) {
      const contextMenu = this.groups.get("settings-parent");
      const versionDiv = document.createElement("label");
      versionDiv.id = this.prefix + "-version";
      versionDiv.innerText = `Version: ${version} (DeveloperJose Edition)`;
      contextMenu?.appendChild(versionDiv);
    }
    addTable(name, rows, columns, groupName, hoverText = "") {
      const groupDiv = this.getGroup(groupName);
      if (!groupDiv) return;
      const table = document.createElement("table");
      table.classList.add("cls-settings-table");
      groupDiv.appendChild(table);
      // Hover text
      table.addEventListener("mouseover", () => this.setHoverText(hoverText));
      table.addEventListener("mouseout", () => this.setHoverText(""));
      const tableData = {
        table,
        rows,
        columns,
      };
      this.tableMap.set(name, tableData);
      return table;
    }
    addItemToTable(name, item) {
      const tableData = this.tableMap.get(name);
      if (!tableData) return;
      const table = tableData.table;
      // Check if we need to create the first row
      if (table.rows.length === 0) table.insertRow();
      // Check if the row is full
      const maxItemsPerRow = tableData.columns;
      const currentItemsInRow = table.rows[table.rows.length - 1].cells.length;
      if (currentItemsInRow >= maxItemsPerRow) table.insertRow();
      // Add the item to the last row
      const currentRow = table.rows[table.rows.length - 1];
      const cell = currentRow.insertCell();
      cell.appendChild(item);
    }
    clearTable(name) {
      const tableData = this.tableMap.get(name);
      if (!tableData) return;
      const table = tableData.table;
      table.innerHTML = "";
    }
    /**
     * Calls the input event on all input elements in the menu.
     * Useful for updating the labels of all the inputs.
     */
    updateAllInputLabels() {
      const event = new Event("input");
      this.inputElements.forEach((input) => {
        input.dispatchEvent(event);
      });
    }
    /**
     * Adds a CO selector to the context menu. Only one CO selector can be added to the menu.
     * @param groupName - The name of the group the CO selector should be added to.
     * @param hoverText - The text to be displayed when hovering over the CO selector.
     * @param onClickFn - The function to be called when a CO is selected from the selector.
     * @returns - The CO selector element.
     */
    addCOSelector(groupName, hoverText = "", onClickFn) {
      const groupDiv = this.getGroup(groupName);
      if (!groupDiv) return;
      const coSelector = document.createElement("a");
      coSelector.classList.add("game-tools-btn");
      coSelector.href = "javascript:void(0)";
      const imgCaret = this.createCOSelectorCaret();
      const imgCO = this.createCOPortraitImage("andy");
      coSelector.appendChild(imgCaret);
      coSelector.appendChild(imgCO);
      // Hover text
      coSelector.addEventListener("mouseover", () => this.setHoverText(hoverText));
      coSelector.addEventListener("mouseout", () => this.setHoverText(""));
      // Update UI
      this.groups.set("co-selector", coSelector);
      this.groups.set("co-portrait", imgCO);
      groupDiv?.appendChild(coSelector);
      // Sort all the COs alphabetically, get their proper names
      const allCOs = getAllCONames(true).sort();
      // Prepare the CO selector HTML with overlib (style taken from AWBW)
      let allColumnsHTML = "";
      for (let i = 0; i < 7; i++) {
        const startIDX = i * 4;
        const endIDX = startIDX + 4;
        const templateFn = (coName) => this.createCOSelectorItem(coName);
        const currentColumnHTML = allCOs.slice(startIDX, endIDX).map(templateFn).join("");
        allColumnsHTML += `<td><table>${currentColumnHTML}</table></td>`;
      }
      const selectorInnerHTML = `<table><tr>${allColumnsHTML}</tr></table>`;
      const selectorTitle = `<img src=terrain/ani/blankred.gif height=16 width=1 align=absmiddle>Select CO`;
      // Make the CO selector that will appear when the user clicks on the CO portrait
      coSelector.onclick = () => {
        return overlib(selectorInnerHTML, STICKY, CAPTION, selectorTitle, OFFSETY, 25, OFFSETX, -322, CLOSECLICK);
      };
      // Listen for clicks on the CO selector
      addCOSelectorListener((coName) => this.onCOSelectorClick(coName));
      addCOSelectorListener(onClickFn);
      return coSelector;
    }
    createCOSelectorItem(coName) {
      const location = "javascript:void(0)";
      const internalName = coName.toLowerCase().replaceAll(" ", "");
      const imgSrc = `terrain/ani/aw2${internalName}.png?v=1`;
      const onClickFn = `awbw_music_player.notifyCOSelectorListeners('${internalName}');`;
      return (
        `<tr>` +
        `<td class=borderwhite><img class=co_portrait src=${imgSrc}></td>` +
        `<td class=borderwhite align=center valign=center>` +
        `<span class=small_text>` +
        `<a onclick="${onClickFn}" href=${location}>${coName}</a></b>` +
        `</span>` +
        `</td>` +
        `</tr>`
      );
    }
    createCOSelectorCaret() {
      const imgCaret = document.createElement("img");
      imgCaret.classList.add("co_caret");
      imgCaret.src = "terrain/co_down_caret.gif";
      return imgCaret;
    }
    createCOPortraitImage(coName) {
      const imgCO = document.createElement("img");
      imgCO.classList.add("co_portrait");
      imgCO.src = `terrain/ani/aw2${coName}.png?v=1`;
      // Allows other icons to be used
      if (!getAllCONames().includes(coName)) {
        imgCO.src = `terrain/${coName}`;
      }
      return imgCO;
    }
    createCOPortraitImageWithText(coName, text) {
      const div = document.createElement("div");
      div.classList.add("cls-vertical-box");
      // CO picture
      const coImg = this.createCOPortraitImage(coName);
      div.appendChild(coImg);
      // Text
      const coLabel = document.createElement("label");
      coLabel.textContent = text;
      div.appendChild(coLabel);
      return div;
    }
    onCOSelectorClick(coName) {
      // Hide the CO selector
      const overDiv = document.querySelector("#overDiv");
      overDiv.style.visibility = "hidden";
      // Change the CO portrait
      const imgCO = this.groups.get("co-portrait");
      imgCO.src = `terrain/ani/aw2${coName}.png?v=1`;
    }
  }
  const coSelectorListeners = [];
  function addCOSelectorListener(listener) {
    coSelectorListeners.push(listener);
  }
  function notifyCOSelectorListeners(coName) {
    coSelectorListeners.forEach((listener) => listener(coName));
  }

  /**
   * @file Constants and other project configuration settings that could be used by any scripts.
   */

  /**
   * The version numbers of the userscripts.
   * @constant {Object.<string, string>}
   */
  const versions = {
    music_player: "3.0.0",
    highlight_cursor_coordinates: "1.0.2",
  };

  /**
   * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
   */
  // Listen for setting changes to update the menu UI
  addSettingsChangeListener(onSettingsChange$1);
  /**
   * Event handler for when the music button is clicked that turns the music ON/OFF.
   * @param _event - Click event handler, not used.
   */
  function onMusicBtnClick(_event) {
    musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
  }
  /**
   * Event handler that is triggered whenever the settings of the music player are changed.
   * Updates the music player settings UI (context menu) so it matches the internal settings when the settings change.
   *
   * The context menu is the menu that appears when you right-click the player that shows you options.
   * This function ensures that the internal settings are reflected properly on the UI.
   * @param key - Name of the setting that changed, matches the name of the property in {@link musicPlayerSettings}.
   * @param isFirstLoad - Whether this is the first time the settings are being loaded.
   */
  function onSettingsChange$1(key, isFirstLoad) {
    // We are loading settings stored in LocalStorage, so set the initial values of all inputs.
    // Only do this once, when the settings are first loaded, otherwise it's infinite recursion.
    if (isFirstLoad) {
      if (volumeSlider) volumeSlider.value = musicPlayerSettings.volume.toString();
      if (sfxVolumeSlider) sfxVolumeSlider.value = musicPlayerSettings.sfxVolume.toString();
      if (uiVolumeSlider) uiVolumeSlider.value = musicPlayerSettings.uiVolume.toString();
      if (daySlider) daySlider.value = musicPlayerSettings.alternateThemeDay.toString();
      const radio = gameTypeRadioMap.get(musicPlayerSettings.gameType);
      if (radio) radio.checked = true;
      radioNormal.checked = !musicPlayerSettings.randomThemes;
      radioRandom.checked = musicPlayerSettings.randomThemes;
      captProgressBox.checked = musicPlayerSettings.captureProgressSFX;
      pipeSeamBox.checked = musicPlayerSettings.pipeSeamSFX;
      // Update all labels
      musicPlayerUI.updateAllInputLabels();
    }
    // Sort overrides again if we are loading the settings for the first time, or if the override list changed
    if (key === "all" || key === "addOverride" || key === "removeOverride") {
      clearAndRepopulateOverrideList();
      if (musicPlayerSettings.overrideList.size === 0) {
        const noOverrides = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No overrides set yet...");
        musicPlayerUI.addItemToTable(Name.Override_Table, noOverrides);
      }
    }
    shuffleBtn.disabled = !musicPlayerSettings.randomThemes;
    const currentSounds = getIsMovePlanner() ? "Sound Effects" : "Tunes";
    // Update UI
    if (musicPlayerSettings.isPlaying) {
      musicPlayerUI.setHoverText(`Stop ${currentSounds}`, true);
      musicPlayerUI.setImage(PLAYING_IMG_URL);
    } else {
      musicPlayerUI.setHoverText(`Play ${currentSounds}`, true);
      musicPlayerUI.setImage(NEUTRAL_IMG_URL);
    }
  }
  /**
   * Parses the value of an input event as a float.
   * @param event - Input event to parse the value from.
   * @returns - The parsed float value of the input event.
   */
  const parseInputFloat = (event) => parseFloat(event.target.value);
  /**
   * Parses the value of an input event as an integer.
   * @param event  - Input event to parse the value from.
   * @returns - The parsed integer value of the input event.
   */
  const parseInputInt = (event) => parseInt(event.target.value);
  /************************************ Create the music player UI *************************************/
  const musicPlayerUI = new CustomMenuSettingsUI("music-player", NEUTRAL_IMG_URL, "Play Tunes");
  // Determine who will catch when the user clicks the play/stop button
  musicPlayerUI.addEventListener("click", onMusicBtnClick);
  var Name;
  (function (Name) {
    Name["Volume"] = "Music Volume";
    Name["SFX_Volume"] = "SFX Volume";
    Name["UI_Volume"] = "UI Volume";
    Name["Alternate_Day"] = "Alternate Themes Start On Day";
    Name["Shuffle"] = "Shuffle";
    Name["Capture_Progress"] = "Capture Progress SFX";
    Name["Pipe_Seam_SFX"] = "Pipe Seam Attack SFX";
    Name["Add_Override"] = "Add";
    Name["Override_Table"] = "Overrides";
  })(Name || (Name = {}));
  var Description;
  (function (Description) {
    Description["Volume"] = "Adjust the volume of the CO theme music, power activations, and power themes.";
    Description["SFX_Volume"] = "Adjust the volume of the unit movement, tag swap, captures, and other unit sounds.";
    Description["UI_Volume"] =
      "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.";
    Description["Alternate_Day"] =
      "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?";
    Description["AW1"] = "Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!";
    Description["AW2"] = "Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.";
    Description["DS"] =
      "Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though.";
    Description["RBC"] = "Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!";
    Description["Normal_Themes"] = "Play the music depending on who the current CO is.";
    Description["Random_Themes"] = "Play random music every turn.";
    Description["Shuffle"] = "Changes the current theme to a new random one.";
    Description["Capture_Progress"] = "Play a sound effect when a unit makes progress capturing a property.";
    Description["Pipe_Seam_SFX"] = "Play a sound effect when a pipe seam is attacked.";
    Description["Add_Override"] = "Adds an override for a specific CO so it always plays a specific soundtrack.";
    Description["Remove_Override"] = "Removes the override for this specific CO.";
  })(Description || (Description = {}));
  /* ************************************ Left Menu ************************************ */
  const LEFT = MenuPosition.Left;
  /* **** Group: Volume sliders **** */
  const volumeSlider = musicPlayerUI.addSlider(Name.Volume, 0, 1, 0.005, Description.Volume, LEFT);
  const sfxVolumeSlider = musicPlayerUI.addSlider(Name.SFX_Volume, 0, 1, 0.005, Description.SFX_Volume, LEFT);
  const uiVolumeSlider = musicPlayerUI.addSlider(Name.UI_Volume, 0, 1, 0.005, Description.UI_Volume, LEFT);
  volumeSlider?.addEventListener("input", (event) => (musicPlayerSettings.volume = parseInputFloat(event)));
  sfxVolumeSlider?.addEventListener("input", (event) => (musicPlayerSettings.sfxVolume = parseInputFloat(event)));
  uiVolumeSlider?.addEventListener("input", (event) => (musicPlayerSettings.uiVolume = parseInputFloat(event)));
  /* **** Group: Soundtrack radio buttons (AW1, AW2, DS, RBC) AKA GameType **** */
  const soundtrackGroup = "Soundtrack";
  musicPlayerUI.addGroup(soundtrackGroup, GroupType.Horizontal, LEFT);
  // Radio buttons
  const gameTypeRadioMap = new Map();
  for (const gameType of Object.values(SettingsGameType)) {
    const description = Description[gameType];
    const radio = musicPlayerUI.addRadioButton(gameType, soundtrackGroup, description);
    gameTypeRadioMap.set(gameType, radio);
    radio.addEventListener("click", (_e) => (musicPlayerSettings.gameType = gameType));
  }
  /* **** Group: Random themes radio buttons **** */
  const randomGroup = "Random Themes";
  musicPlayerUI.addGroup(randomGroup, GroupType.Horizontal, LEFT);
  // Radio buttons
  const radioNormal = musicPlayerUI.addRadioButton("Off", randomGroup, Description.Normal_Themes);
  const radioRandom = musicPlayerUI.addRadioButton("On", randomGroup, Description.Random_Themes);
  radioNormal.addEventListener("click", (_e) => (musicPlayerSettings.randomThemes = false));
  radioRandom.addEventListener("click", (_e) => (musicPlayerSettings.randomThemes = true));
  // Random theme shuffle button
  const shuffleBtn = musicPlayerUI.addButton(Name.Shuffle, randomGroup, Description.Shuffle);
  shuffleBtn.addEventListener("click", (_e) => (musicPlayerSettings.currentRandomCO = getRandomCO()));
  /* **** Group: Sound effect toggle checkboxes **** */
  const toggleGroup = "Sound Effects";
  musicPlayerUI.addGroup(toggleGroup, GroupType.Vertical, LEFT);
  // Checkboxes
  const captProgressBox = musicPlayerUI.addCheckbox(Name.Capture_Progress, toggleGroup, Description.Capture_Progress);
  const pipeSeamBox = musicPlayerUI.addCheckbox(Name.Pipe_Seam_SFX, toggleGroup, Description.Pipe_Seam_SFX);
  captProgressBox.addEventListener("click", (_e) => (musicPlayerSettings.captureProgressSFX = captProgressBox.checked));
  pipeSeamBox.addEventListener("click", (_e) => (musicPlayerSettings.pipeSeamSFX = pipeSeamBox.checked));
  /* **** Group: Day slider **** */
  const daySlider = musicPlayerUI.addSlider(Name.Alternate_Day, 0, 30, 1, Description.Alternate_Day, LEFT);
  daySlider?.addEventListener("input", (event) => (musicPlayerSettings.alternateThemeDay = parseInputInt(event)));
  /* ************************************ Right Menu ************************************ */
  const RIGHT = MenuPosition.Right;
  /* **** Group: Override Themes **** */
  const addOverrideGroup = "Override Themes";
  musicPlayerUI.addGroup(addOverrideGroup, GroupType.Horizontal, RIGHT);
  // CO selector
  let currentSelectedCO = "andy";
  function onCOSelectorClick(coName) {
    currentSelectedCO = coName;
  }
  musicPlayerUI.addCOSelector(addOverrideGroup, Description.Add_Override, onCOSelectorClick);
  // Game type radio buttons
  const overrideGameTypeRadioMap = new Map();
  for (const gameType of Object.values(SettingsGameType)) {
    const radio = musicPlayerUI.addRadioButton(gameType, addOverrideGroup, Description.Add_Override);
    overrideGameTypeRadioMap.set(gameType, radio);
    radio.checked = true;
  }
  // Add override button
  const overrideBtn = musicPlayerUI.addButton(Name.Add_Override, addOverrideGroup, Description.Add_Override);
  overrideBtn.addEventListener("click", (_e) => {
    // Get the selected game type
    let currentGameType;
    for (const [gameType, radio] of overrideGameTypeRadioMap) {
      if (radio.checked) currentGameType = gameType;
    }
    // Add the override
    if (!currentGameType) return;
    musicPlayerSettings.addOverride(currentSelectedCO, currentGameType);
  });
  /* **** Group: Override List **** */
  const overrideListGroup = "Current Overrides (Click to Remove)";
  musicPlayerUI.addGroup(overrideListGroup, GroupType.Horizontal, RIGHT);
  const overrideDivMap = new Map();
  const tableRows = 4;
  const tableCols = 7;
  musicPlayerUI.addTable(Name.Override_Table, tableRows, tableCols, overrideListGroup, Description.Remove_Override);
  function addOverrideDisplayDiv(coName, gameType) {
    const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, gameType);
    displayDiv.addEventListener("click", () => {
      musicPlayerSettings.removeOverride(coName);
    });
    overrideDivMap.set(coName, displayDiv);
    musicPlayerUI.addItemToTable(Name.Override_Table, displayDiv);
    return displayDiv;
  }
  function clearAndRepopulateOverrideList() {
    overrideDivMap.forEach((div) => div.remove());
    overrideDivMap.clear();
    musicPlayerUI.clearTable(Name.Override_Table);
    for (const [coName, gameType] of musicPlayerSettings.overrideList) {
      addOverrideDisplayDiv(coName, gameType);
    }
  }
  /* ************************************ Version ************************************ */
  musicPlayerUI.addVersion(versions.music_player);

  /**
   * The URL of the current theme that is playing.
   */
  let currentThemeKey = "";
  /**
   * Map containing the audio players for all preloaded themes and sound effects.
   * The keys are the preloaded audio URLs.
   */
  const urlAudioMap = new Map();
  /**
   * Map containing the audio players for all units.
   * The keys are the unit IDs.
   */
  const unitIDAudioMap = new Map();
  /**
   * Map containing the special loop URLs for themes that have them. These get added after the original theme ends.
   * The keys are the original theme URLs.
   * The values are the special loop URLs to play after the original theme ends.
   */
  const specialLoopMap = new Map();
  /**
   * If set to true, calls to playMusic() will set a timer for {@link delayThemeMS} milliseconds after which the music will play again.
   */
  let currentlyDelaying = false;
  /**
   * Timeout ID for the timer that switches the current theme when it ends for a new random one.
   */
  let randomThemeTimeout;
  function setRandomThemeTimeout(nextTheme) {
    if (!nextTheme.duration) {
      console.error("[AWBW Music Player] Duration is 0, can't set timeout! Please report this bug!", nextTheme);
      return;
    }
    // Clear the previous timeout if it exists
    if (randomThemeTimeout) clearTimeout(randomThemeTimeout);
    // Set a new timeout for the next theme
    const songDurationMS = nextTheme.duration * 1000;
    randomThemeTimeout = setTimeout(() => {
      musicPlayerSettings.currentRandomCO = getRandomCO();
      randomThemeTimeout = null;
      playThemeSong(true);
    }, songDurationMS);
  }
  /**
   * Event handler that pauses an audio as soon as it gets loaded.
   * @param event - The event that triggered this handler. Usually "canplaythrough".
   */
  function whenAudioLoadsPauseIt(event) {
    event.target.pause();
  }
  /**
   * Event handler that plays an audio as soon as it gets loaded.
   * Only plays the audio if it's the current theme.
   * @param event - The event that triggered this handler. Usually "canplaythrough".
   */
  function whenAudioLoadsPlayIt(event) {
    const audio = event.target;
    audio.volume = musicPlayerSettings.volume;
    // if (audio.src === currentThemeKey) audio.play();
    playThemeSong();
  }
  function createNewThemeAudio(srcURL) {
    const audio = new Audio(srcURL);
    if (hasSpecialLoop(srcURL)) {
      audio.loop = false;
      audio.addEventListener("ended", (_event) => {
        const loopURL = srcURL.replace(".ogg", "-loop.ogg");
        specialLoopMap.set(srcURL, loopURL);
        playThemeSong();
      });
    }
    if (urlAudioMap.has(srcURL)) {
      console.error("[AWBW Music Player] Race Condition! Please report this bug!", srcURL);
    }
    urlAudioMap.set(srcURL, audio);
    return audio;
  }
  // Listen for setting changes to update the internal variables accordingly
  addSettingsChangeListener(onSettingsChange);
  /**
   * Changes the current song to the given new song, stopping the old song if necessary.
   * @param srcURL - URL of song to play.
   * @param startFromBeginning - Whether to start from the beginning.
   */
  function playMusicURL(srcURL, startFromBeginning = false) {
    if (!musicPlayerSettings.isPlaying) return;
    // This song has a special loop, and it's time to play it
    const specialLoopURL = specialLoopMap.get(srcURL);
    if (specialLoopURL) srcURL = specialLoopURL;
    // We want to play a new song, so pause the previous one and save the new current song
    if (srcURL !== currentThemeKey) {
      stopThemeSong();
      currentThemeKey = srcURL;
      console.log("[AWBW Music Player] Now Playing: ", srcURL);
    }
    // The song isn't preloaded or invalid, load it and play it when it loads
    const nextSong = urlAudioMap.get(srcURL);
    if (!nextSong) {
      console.debug("[AWBW Music Player] Loading new song", srcURL);
      const audio = createNewThemeAudio(srcURL);
      audio.addEventListener("canplaythrough", whenAudioLoadsPlayIt, { once: true });
      return;
    }
    // Restart the song if requested
    if (startFromBeginning) nextSong.currentTime = 0;
    // Loop all themes except for the special ones
    nextSong.loop = !hasSpecialLoop(srcURL);
    // Play the song.
    nextSong.volume = musicPlayerSettings.volume;
    nextSong.play();
    // We aren't playing random themes, and if we are, we are already waiting for the next song to start
    if (!musicPlayerSettings.randomThemes || randomThemeTimeout) return;
    // We are playing random themes, and there is no timer to switch to the next song yet so set one if possible
    if (nextSong.duration > 0) {
      setRandomThemeTimeout(nextSong);
      return;
    }
    // Duration isn't loaded yet, so wait until it is to set the timeout
    const eventType = "loadedmetadata";
    nextSong.addEventListener(eventType, (e) => setRandomThemeTimeout(e.target), { once: true });
  }
  /**
   * Plays the given sound by creating a new instance of it.
   * @param srcURL - URL of the sound to play.
   * @param volume - Volume at which to play this sound.
   */
  function playOneShotURL(srcURL, volume) {
    if (!musicPlayerSettings.isPlaying) return;
    const soundInstance = new Audio(srcURL);
    soundInstance.currentTime = 0;
    soundInstance.volume = volume;
    soundInstance.play();
  }
  /**
   * Plays the appropriate music based on the settings and the current game state.
   * Determines the music automatically so just call this anytime the game state changes.
   * @param startFromBeginning - Whether to start the song from the beginning or resume from the previous spot.
   */
  function playThemeSong(startFromBeginning = false) {
    if (!musicPlayerSettings.isPlaying) return;
    // Someone wants us to delay playing the theme, so wait a little bit then play
    // Ignore all calls to play() while delaying, we are guaranteed to play eventually
    if (currentlyDelaying) return;
    let coName = currentPlayer.coName;
    if (!coName) coName = "map-editor";
    // Don't randomize the victory and defeat themes
    const isEndTheme = coName === "victory" || coName === "defeat";
    if (musicPlayerSettings.randomThemes && !isEndTheme) {
      coName = musicPlayerSettings.currentRandomCO;
    }
    playMusicURL(getMusicURL(coName), startFromBeginning);
  }
  /**
   * Stops the current music if there's any playing.
   * Optionally, you can also delay the start of the next theme.
   * @param delayMS - Time to delay before we start the next theme.
   */
  function stopThemeSong(delayMS = 0) {
    // Delay the next theme if needed
    if (delayMS > 0) {
      // Delay until I say so
      setTimeout(() => {
        currentlyDelaying = false;
        playThemeSong();
      }, delayMS);
      currentlyDelaying = true;
    }
    // Clear the timeout that switches random songs
    if (randomThemeTimeout) {
      clearTimeout(randomThemeTimeout);
      randomThemeTimeout = null;
    }
    // Can't stop if there's no loaded music
    if (!urlAudioMap.has(currentThemeKey)) return;
    // Can't stop if we are already paused
    const currentTheme = urlAudioMap.get(currentThemeKey);
    if (!currentTheme || currentTheme.paused) return;
    console.debug("[AWBW Music Player] Pausing: ", currentTheme.src);
    // The song hasn't finished loading, so stop it as soon as it does
    if (currentTheme.readyState !== HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      currentTheme.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
      return;
    }
    // The song is loaded and playing, so pause it
    currentTheme.pause();
  }
  /**
   * Plays the movement sound of the given unit.
   * @param unitId - The ID of the unit who is moving.
   */
  function playMovementSound(unitId) {
    if (!musicPlayerSettings.isPlaying) return;
    // The audio hasn't been preloaded for this unit
    if (!unitIDAudioMap.has(unitId)) {
      const unitName = getUnitName(unitId);
      const movementSoundURL = getMovementSoundURL(unitName);
      unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
    }
    // Restart the audio and then play it
    const movementAudio = unitIDAudioMap.get(unitId);
    if (!movementAudio) return;
    movementAudio.currentTime = 0;
    movementAudio.loop = false;
    movementAudio.volume = musicPlayerSettings.sfxVolume;
    movementAudio.play();
  }
  /**
   * Stops the movement sound of a given unit if it's playing.
   * @param unitId - The ID of the unit whose movement sound will be stopped.
   * @param rolloff - (Optional) Whether to play the rolloff sound or not, defaults to true.
   */
  function stopMovementSound(unitId, rolloff = true) {
    // Can't stop if there's nothing playing
    if (!musicPlayerSettings.isPlaying) return;
    // Can't stop if the unit doesn't have any sounds
    if (!unitIDAudioMap.has(unitId)) return;
    // Can't stop if the sound is already stopped
    const movementAudio = unitIDAudioMap.get(unitId);
    if (!movementAudio || movementAudio.paused) return;
    // The audio hasn't finished loading, so pause when it does
    if (movementAudio.readyState != HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      movementAudio.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
      return;
    }
    // The audio is loaded and playing, so pause it
    movementAudio.pause();
    movementAudio.currentTime = 0;
    // If unit has rolloff, play it
    if (!rolloff) return;
    const unitName = getUnitName(unitId);
    if (hasMovementRollOff(unitName)) {
      const audioURL = getMovementRollOffURL(unitName);
      playOneShotURL(audioURL, musicPlayerSettings.sfxVolume);
    }
  }
  /**
   * Plays the given sound effect.
   * @param sfx - Specific {@link GameSFX} to play.
   */
  function playSFX(sfx) {
    if (!musicPlayerSettings.isPlaying) return;
    // Check the user settings to see if we should play this sound effect
    if (!musicPlayerSettings.captureProgressSFX && sfx === GameSFX.unitCaptureProgress) return;
    if (!musicPlayerSettings.pipeSeamSFX && sfx === GameSFX.unitAttackPipeSeam) return;
    const sfxURL = getSoundEffectURL(sfx);
    // Figure out which volume to use
    let vol = musicPlayerSettings.sfxVolume;
    if (sfx.startsWith("ui")) {
      vol = musicPlayerSettings.uiVolume;
    } else if (sfx.startsWith("power")) {
      vol = musicPlayerSettings.volume;
    }
    // This sound effect hasn't been loaded yet
    if (!urlAudioMap.has(sfxURL)) {
      urlAudioMap.set(sfxURL, new Audio(sfxURL));
    }
    // The sound is loaded, so play it
    const audio = urlAudioMap.get(sfxURL);
    if (!audio) return;
    audio.volume = vol;
    audio.currentTime = 0;
    audio.play();
  }
  /**
   * Stops all music, sound effects, and audios.
   */
  function stopAllSounds() {
    // Stop music
    stopThemeSong();
    // Stop unit sounds
    stopAllMovementSounds();
    // Mute sound effects
    for (const audio of urlAudioMap.values()) {
      audio.volume = 0;
    }
  }
  /**
   * Stops all movement sounds of all units.
   */
  function stopAllMovementSounds() {
    for (const unitId of unitIDAudioMap.keys()) {
      stopMovementSound(unitId, false);
    }
  }
  /**
   * Preloads the current game COs' themes and common sound effect audios.
   * Run this first so we can start the player almost immediately!
   * @param afterPreloadFunction - Function to run after the audio is pre-loaded.
   */
  function preloadAllCommonAudio(afterPreloadFunction) {
    // Preload the themes of the COs in this match
    const audioList = getCurrentThemeURLs();
    // Preload the most common UI sounds that might play right after the page loads
    audioList.add(getSoundEffectURL(GameSFX.uiCursorMove));
    audioList.add(getSoundEffectURL(GameSFX.uiUnitSelect));
    preloadAudios(audioList, afterPreloadFunction);
    console.debug("[AWBW Music Player] Pre-loading common audio", audioList);
  }
  /**
   * Preloads the current game CO's themes for ALL game versions and ALL sound effect audios.
   * Run this after the common audios since we have more time to get things ready for these.
   * @param afterPreloadFunction - Function to run after the audio is pre-loaded.
   */
  function preloadAllExtraAudio(afterPreloadFunction) {
    if (getIsMapEditor()) return;
    // Preload ALL sound effects
    let audioList = getAllSoundEffectURLs();
    // Preload all the current COs themes for all game versions
    audioList = new Set([...audioList, ...getAllCurrentThemesExtraAudioURLs()]);
    console.debug("[AWBW Music Player] Pre-loading extra audio", audioList);
    preloadAudios(audioList, afterPreloadFunction);
  }
  /**
   * Preloads the given list of songs and adds them to the {@link urlAudioMap}.
   * @param audioURLs - Set of URLs of songs to preload.
   * @param afterPreloadFunction - Function to call after all songs are preloaded.
   */
  function preloadAudios(audioURLs, afterPreloadFunction = () => {}) {
    // Event handler for when an audio is loaded
    let numLoadedAudios = 0;
    const onAudioPreload = (event) => {
      const audio = event.target;
      numLoadedAudios++;
      // Update UI
      const loadPercentage = (numLoadedAudios / audioURLs.size) * 100;
      musicPlayerUI.setProgress(loadPercentage);
      // All the audio from the list has been loaded
      if (numLoadedAudios >= audioURLs.size) {
        numLoadedAudios = 0;
        if (afterPreloadFunction) afterPreloadFunction();
      }
      if (event.type === "error") {
        let msg = `[AWBW Music Player] Could not pre-load: ${audio.src}, code=${audio.networkState}.`;
        msg += "(This might not be a problem, the music and sound effects may still play normally.)";
        console.error(msg);
        urlAudioMap.delete(audio.src);
        return;
      }
      // TODO: Debugging purposes
      // if (hasSpecialLoop(audio.src)) audio.currentTime = audio.duration * 0.94;
      if (!urlAudioMap.has(audio.src)) {
        console.error("[AWBW Music Player] Race condition on pre-load! Please report this bug!", audio.src);
      }
    };
    // Pre-load all audios in the list
    audioURLs.forEach((url) => {
      // This audio has already been loaded before, so skip it
      if (urlAudioMap.has(url)) {
        numLoadedAudios++;
        return;
      }
      const audio = createNewThemeAudio(url);
      audio.addEventListener("canplaythrough", onAudioPreload, { once: true });
      audio.addEventListener("error", onAudioPreload, { once: true });
    });
  }
  // const allThemesPreloaded = false;
  /**
   * Updates the internal audio components to match the current music player settings when the settings change.
   * @param key - Key of the setting which has been changed.
   * @param isFirstLoad - Whether this is the first time the settings are being loaded.
   */
  function onSettingsChange(key, isFirstLoad) {
    // Don't do anything if this is the first time the settings are being loaded
    if (isFirstLoad) return;
    switch (key) {
      case "addOverride":
      case "removeOverride":
      case "overrideList":
      case "currentRandomCO":
      case "isPlaying":
        if (musicPlayerSettings.isPlaying) {
          playThemeSong();
        } else {
          stopAllSounds();
        }
        break;
      case "gameType":
      case "alternateThemeDay":
        setTimeout(() => playThemeSong(), 500);
        break;
      case "themeType": {
        const restartMusic = musicPlayerSettings.themeType !== SettingsThemeType.REGULAR;
        playThemeSong(restartMusic);
        break;
      }
      case "randomThemes":
        // Back to normal themes
        if (!musicPlayerSettings.randomThemes) {
          playThemeSong();
          return;
        }
        // We want a new random theme
        musicPlayerSettings.currentRandomCO = getRandomCO();
        playThemeSong(true);
        // Preload all themes if we are going to play random themes
        // TODO:
        // if (!allThemesPreloaded) {
        //   console.log("[AWBW Music Player] Pre-loading all themes since random themes are enabled");
        //   let audioList = getAllThemeURLs();
        //   allThemesPreloaded = true;
        //   preloadAudios(audioList, () => console.log("[AWBW Music Player] All themes have been pre-loaded!"));
        // }
        break;
      case "volume": {
        // Adjust the volume of the current theme
        const currentTheme = urlAudioMap.get(currentThemeKey);
        if (currentTheme) currentTheme.volume = musicPlayerSettings.volume;
        break;
      }
    }
  }

  /**
   * @file Functions used by Advance Wars By Web to handle game actions.
   */
  // export function getCursorMoveFn() {
  //   if (getIsMapEditor()) {
  //     return typeof designMapEditor !== "undefined" ? designMapEditor.updateCursor : null;
  //   }
  //   return typeof updateCursor !== "undefined" ? updateCursor : null;
  // }
  function getQueryTurnFn() {
    return typeof queryTurn !== "undefined" ? queryTurn : null;
  }
  function getShowEventScreenFn() {
    return typeof showEventScreen !== "undefined" ? showEventScreen : null;
  }
  function getOpenMenuFn() {
    return typeof openMenu !== "undefined" ? openMenu : null;
  }
  function getCloseMenuFn() {
    return typeof closeMenu !== "undefined" ? closeMenu : null;
  }
  function getCreateDamageSquaresFn() {
    return typeof createDamageSquares !== "undefined" ? createDamageSquares : null;
  }
  function getUnitClickFn() {
    return typeof unitClickHandler !== "undefined" ? unitClickHandler : null;
  }
  function getWaitFn() {
    return typeof waitUnit !== "undefined" ? waitUnit : null;
  }
  function getAnimUnitFn() {
    return typeof animUnit !== "undefined" ? animUnit : null;
  }
  function getAnimExplosionFn() {
    return typeof animExplosion !== "undefined" ? animExplosion : null;
  }
  function getFogFn() {
    return typeof updateAirUnitFogOnMove !== "undefined" ? updateAirUnitFogOnMove : null;
  }
  function getFireFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Fire : null;
  }
  function getAttackSeamFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.AttackSeam : null;
  }
  function getMoveFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Move : null;
  }
  function getCaptFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Capt : null;
  }
  function getBuildFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Build : null;
  }
  function getLoadFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Load : null;
  }
  function getUnloadFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Unload : null;
  }
  function getSupplyFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Supply : null;
  }
  function getRepairFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Repair : null;
  }
  function getHideFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Hide : null;
  }
  function getUnhideFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Unhide : null;
  }
  function getJoinFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Join : null;
  }
  function getLaunchFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Launch : null;
  }
  function getNextTurnFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.NextTurn : null;
  }
  function getPowerFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Power : null;
  }

  /**
   * @file This file contains all the AWBW website handlers that will intercept clicks and any relevant functions of the website.
   */
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
  /**
   * The last known X coordinate of the cursor.
   */
  let lastCursorX = -1;
  /**
   * The last known Y coordinate of the cursor.
   */
  let lastCursorY = -1;
  var MenuOpenType;
  (function (MenuOpenType) {
    MenuOpenType["None"] = "None";
    MenuOpenType["DamageSquare"] = "DamageSquare";
    MenuOpenType["Regular"] = "Regular";
    MenuOpenType["UnitSelect"] = "UnitSelect";
  })(MenuOpenType || (MenuOpenType = {}));
  let currentMenuType = MenuOpenType.None;
  /**
   * Map of unit IDs to their visibility status. Used to check if a unit that was visible disappeared in the fog.
   */
  const visibilityMap = new Map();
  /**
   * Map of unit IDs to their movement responses. Used to check if a unit got trapped.
   */
  const movementResponseMap = new Map();
  const clickedDamageSquaresMap = new Map();
  // Store a copy of all the original functions we are going to override
  const ahQueryTurn = getQueryTurnFn();
  const ahShowEventScreen = getShowEventScreenFn();
  // let ahSwapCosDisplay = getSwapCosDisplayFn();
  const ahOpenMenu = getOpenMenuFn();
  const ahCloseMenu = getCloseMenuFn();
  const ahCreateDamageSquares = getCreateDamageSquaresFn();
  // let ahResetAttack = getResetAttackFn();
  const ahUnitClick = getUnitClickFn();
  const ahWait = getWaitFn();
  const ahAnimUnit = getAnimUnitFn();
  const ahAnimExplosion = getAnimExplosionFn();
  const ahFog = getFogFn();
  const ahFire = getFireFn();
  const ahAttackSeam = getAttackSeamFn();
  const ahMove = getMoveFn();
  const ahCapt = getCaptFn();
  const ahBuild = getBuildFn();
  const ahLoad = getLoadFn();
  const ahUnload = getUnloadFn();
  const ahSupply = getSupplyFn();
  const ahRepair = getRepairFn();
  const ahHide = getHideFn();
  const ahUnhide = getUnhideFn();
  const ahJoin = getJoinFn();
  const ahLaunch = getLaunchFn();
  const ahNextTurn = getNextTurnFn();
  // let ahElimination = getEliminationFn();
  const ahPower = getPowerFn();
  // let ahGameOver = getGameOverFn();
  /**
   * Intercept functions and add our own handlers to the website.
   */
  function addHandlers() {
    if (getIsMaintenance()) return;
    // Global handlers
    addUpdateCursorObserver(onCursorMove);
    // Specific page handlers
    if (getIsMapEditor()) {
      return;
    }
    if (getIsMovePlanner()) {
      addMovePlannerHandlers();
      return;
    }
    // game.php handlers
    addReplayHandlers();
    addGameHandlers();
  }
  function addMovePlannerHandlers() {
    getBuildMenu().addEventListener("click", (event) => {
      onOpenMenu(event.target, 0, 0);
    });
    closeMenu = onCloseMenu;
  }
  /**
   * Syncs the music with the game state. Also randomizes the COs if needed.
   * @param playDelayMS - The delay in milliseconds before the theme song starts playing.
   */
  function refreshMusicForNextTurn(playDelayMS = 0) {
    // It's a new turn, so we need to clear the visibility map, randomize COs, and play the theme song
    visibilityMap.clear();
    musicPlayerSettings.currentRandomCO = getRandomCO();
    setTimeout(() => {
      musicPlayerSettings.themeType = getCurrentThemeType();
      playThemeSong();
    }, playDelayMS);
  }
  /**
   * Add all handlers that will intercept clicks and functions when watching a replay.
   */
  function addReplayHandlers() {
    const replayForwardActionBtn = getReplayForwardActionBtn();
    const replayBackwardActionBtn = getReplayBackwardActionBtn();
    const replayForwardBtn = getReplayForwardBtn();
    const replayBackwardBtn = getReplayBackwardBtn();
    const replayOpenBtn = getReplayOpenBtn();
    const replayCloseBtn = getReplayCloseBtn();
    const replayDaySelectorCheckBox = getReplayDaySelectorCheckBox();
    // Keep the music in sync
    const syncMusic = () => setTimeout(playThemeSong, 500);
    replayBackwardActionBtn.addEventListener("click", syncMusic);
    replayForwardActionBtn.addEventListener("click", syncMusic);
    // Stop all movement sounds when we are going fast
    // Randomize COs when we move a full turn
    const replayChangeTurn = () => refreshMusicForNextTurn(500);
    replayForwardBtn.addEventListener("click", replayChangeTurn);
    replayBackwardBtn.addEventListener("click", replayChangeTurn);
    replayOpenBtn.addEventListener("click", replayChangeTurn);
    replayCloseBtn.addEventListener("click", replayChangeTurn);
    replayDaySelectorCheckBox.addEventListener("click", replayChangeTurn);
  }
  /**
   * Add all handlers that will intercept clicks and functions during a game.
   */
  function addGameHandlers() {
    // updateCursor = onCursorMove;
    queryTurn = onQueryTurn;
    showEventScreen = onShowEventScreen;
    openMenu = onOpenMenu;
    closeMenu = onCloseMenu;
    createDamageSquares = onCreateDamageSquares;
    unitClickHandler = onUnitClick;
    waitUnit = onUnitWait;
    animUnit = onAnimUnit;
    animExplosion = onAnimExplosion;
    updateAirUnitFogOnMove = onFogUpdate;
    actionHandlers.Fire = onFire;
    actionHandlers.AttackSeam = onAttackSeam;
    actionHandlers.Move = onMove;
    actionHandlers.Capt = onCapture;
    actionHandlers.Build = onBuild;
    actionHandlers.Load = onLoad;
    actionHandlers.Unload = onUnload;
    actionHandlers.Supply = onSupply;
    actionHandlers.Repair = onRepair;
    actionHandlers.Hide = onHide;
    actionHandlers.Unhide = onUnhide;
    actionHandlers.Join = onJoin;
    actionHandlers.Launch = onLaunch;
    actionHandlers.NextTurn = onNextTurn;
    // actionHandlers.Elimination = onElimination;
    actionHandlers.Power = onPower;
    // actionHandlers.GameOver = onGameOver;
  }
  function onCursorMove(cursorX, cursorY) {
    // ahCursorMove?.apply(ahCursorMove, [cursorX, cursorY]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Cursor Move", cursorX, cursorY);
    const dx = Math.abs(cursorX - lastCursorX);
    const dy = Math.abs(cursorY - lastCursorY);
    const cursorMoved = dx >= 1 || dy >= 1;
    const timeSinceLastCursorCall = Date.now() - lastCursorCall;
    // Don't play the sound if we moved the cursor too quickly
    if (timeSinceLastCursorCall < CURSOR_THRESHOLD_MS) return;
    if (cursorMoved) {
      playSFX(GameSFX.uiCursorMove);
      lastCursorCall = Date.now();
    }
    lastCursorX = cursorX;
    lastCursorY = cursorY;
  }
  function onQueryTurn(gameId, turn, turnPId, turnDay, replay, initial) {
    const result = ahQueryTurn?.apply(ahQueryTurn, [gameId, turn, turnPId, turnDay, replay, initial]);
    if (!musicPlayerSettings.isPlaying) return result;
    // console.log("[MP] Query Turn", gameId, turn, turnPId, turnDay, replay, initial);
    refreshMusicForNextTurn();
    return result;
  }
  function onShowEventScreen(event) {
    ahShowEventScreen?.apply(ahShowEventScreen, [event]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Show Event Screen", event);
    playThemeSong();
  }
  function onOpenMenu(menu, x, y) {
    ahOpenMenu?.apply(openMenu, [menu, x, y]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Open Menu", menu, x, y);
    currentMenuType = MenuOpenType.Regular;
    playSFX(GameSFX.uiMenuOpen);
    const menuOptions = document.getElementsByClassName("menu-option");
    for (let i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseenter", (_e) => playSFX(GameSFX.uiMenuMove));
      menuOptions[i].addEventListener("click", (event) => {
        const target = event.target;
        if (!target) return;
        // Check if we clicked on a unit we cannot buy
        if (target.classList.contains("forbidden")) {
          playSFX(GameSFX.uiInvalid);
          return;
        }
        currentMenuType = MenuOpenType.None;
        playSFX(GameSFX.uiMenuOpen);
      });
    }
  }
  function onCloseMenu() {
    ahCloseMenu?.apply(closeMenu, []);
    if (!musicPlayerSettings.isPlaying) return;
    const isMenuOpen = currentMenuType !== MenuOpenType.None;
    // console.debug("[MP] CloseMenu", currentMenuType, isMenuOpen);
    if (isMenuOpen) {
      playSFX(GameSFX.uiMenuClose);
      clickedDamageSquaresMap.clear();
      currentMenuType = MenuOpenType.None;
    }
  }
  function onCreateDamageSquares(attackerUnit, unitsInRange, movementInfo, movingUnit) {
    ahCreateDamageSquares?.apply(createDamageSquares, [attackerUnit, unitsInRange, movementInfo, movingUnit]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Create Damage Squares", attackerUnit, unitsInRange, movementInfo, movingUnit);
    // Hook up to all new damage squares
    for (const damageSquare of getAllDamageSquares()) {
      damageSquare.addEventListener("click", (event) => {
        if (!event.target) return;
        const targetSpan = event.target;
        playSFX(GameSFX.uiMenuOpen);
        // If we have clicked this before, then this click is to finalize the attack so no more open menu
        if (clickedDamageSquaresMap.has(targetSpan)) {
          currentMenuType = MenuOpenType.None;
          clickedDamageSquaresMap.clear();
          return;
        }
        // If we haven't clicked this before, then consider it like opening a menu
        currentMenuType = MenuOpenType.DamageSquare;
        clickedDamageSquaresMap.set(targetSpan, true);
      });
    }
  }
  function onUnitClick(clicked) {
    ahUnitClick?.apply(unitClickHandler, [clicked]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Unit Click", clicked);
    // Check if we clicked on a waited unit or an enemy unit, if so, no more actions can be taken
    const unitInfo = getUnitInfo(Number(clicked.id));
    const myID = getMyID();
    const isUnitWaited = hasUnitMovedThisTurn(unitInfo.units_id);
    const isMyUnit = unitInfo.units_players_id === myID;
    const canActionsBeTaken = !isUnitWaited && isMyUnit;
    // If action can be taken, then we can cancel out of that action
    currentMenuType = canActionsBeTaken ? MenuOpenType.UnitSelect : MenuOpenType.None;
    playSFX(GameSFX.uiUnitSelect);
  }
  function onUnitWait(unitId) {
    ahWait?.apply(waitUnit, [unitId]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Wait", unitId, getUnitName(unitId));
    // Check if we stopped because we got trapped
    if (movementResponseMap.has(unitId)) {
      const response = movementResponseMap.get(unitId);
      if (response?.trapped) {
        playSFX(GameSFX.unitTrap);
      }
      stopMovementSound(unitId, !response?.trapped);
      movementResponseMap.delete(unitId);
      return;
    }
    stopMovementSound(unitId);
  }
  function onAnimUnit(path, unitId, unitSpan, unitTeam, viewerTeam, i) {
    ahAnimUnit?.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] AnimUnit", path, unitId, unitSpan, unitTeam, viewerTeam, i);
    // Only check if valid
    if (!isValidUnit(unitId) || !path || !i) return;
    // Don't go outside the bounds of the path
    if (i >= path.length) return;
    // The unit disappeared already, no need to stop its sound again
    if (visibilityMap.has(unitId)) return;
    // A visible unit just disappeared
    const unitVisible = path[i].unit_visible;
    if (!unitVisible) {
      visibilityMap.set(unitId, unitVisible);
      // Stop the sound after a little delay, giving more time to react to it
      setTimeout(() => stopMovementSound(unitId, false), 1000);
    }
  }
  function onAnimExplosion(unit) {
    ahAnimExplosion?.apply(animExplosion, [unit]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("Exploded", unit);
    const unitId = unit.units_id;
    const unitFuel = unit.units_fuel;
    let sfx = GameSFX.unitExplode;
    if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
      sfx = GameSFX.unitMissileHit;
    }
    playSFX(sfx);
    stopMovementSound(unitId, false);
  }
  function onFogUpdate(x, y, mType, neighbours, unitVisible, change, delay) {
    ahFog?.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Fog", x, y, mType, neighbours, unitVisible, change, delay);
    const unitInfo = getUnitInfoFromCoords(x, y);
    if (!unitInfo) return;
    if (change === "Add") {
      setTimeout(() => stopMovementSound(unitInfo.units_id, true), delay);
    }
  }
  function onFire(response) {
    if (!musicPlayerSettings.isPlaying) {
      ahFire?.apply(actionHandlers.Fire, [response]);
      return;
    }
    // console.debug("[MP] Fire", response);
    const attackerID = response.copValues.attacker.playerId;
    const defenderID = response.copValues.defender.playerId;
    // stopMovementSound(response.attacker.units_id, false);
    // stopMovementSound(response.defender.units_id, false);
    // Let the user hear a confirmation sound
    // if (currentPlayer.info.players_id == attackerID) {
    //   playSFX(gameSFX.uiMenuOpen);
    // }
    // Calculate charge before attack
    const couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
    const couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
    const couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
    const couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);
    // Let the attack proceed normally
    ahFire?.apply(actionHandlers.Fire, [response]);
    // Check if the attack gave enough charge for a power to either side
    // Give it a little bit of time for the animation if needed
    const delay = areAnimationsEnabled() ? 750 : 0;
    const canAttackerActivateSCOPAfter = canPlayerActivateSuperCOPower(attackerID);
    const canAttackerActivateCOPAfter = canPlayerActivateCOPower(attackerID);
    const canDefenderActivateSCOPAfter = canPlayerActivateSuperCOPower(defenderID);
    const canDefenderActivateCOPAfter = canPlayerActivateCOPower(defenderID);
    const madeSCOPAvailable =
      (!couldAttackerActivateSCOPBefore && canAttackerActivateSCOPAfter) ||
      (!couldDefenderActivateSCOPBefore && canDefenderActivateSCOPAfter);
    const madeCOPAvailable =
      (!couldAttackerActivateCOPBefore && canAttackerActivateCOPAfter) ||
      (!couldDefenderActivateCOPBefore && canDefenderActivateCOPAfter);
    setTimeout(() => {
      if (madeSCOPAvailable) playSFX(GameSFX.powerSCOPAvailable);
      else if (madeCOPAvailable) playSFX(GameSFX.powerCOPAvailable);
    }, delay);
  }
  /**
   * Moves a div back and forth to create a wiggle effect.
   * @param div - The div to wiggle.
   * @param startDelay - The delay in milliseconds before the wiggle starts.
   */
  function wiggleTile(div, startDelay = 0) {
    const stepsX = 12;
    const stepsY = 4;
    const deltaX = 0.2;
    const deltaY = 0.05;
    const wiggleAnimation = () => {
      moveDivToOffset(
        div,
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
    setTimeout(wiggleAnimation, startDelay);
  }
  function onAttackSeam(response) {
    ahAttackSeam?.apply(actionHandlers.AttackSeam, [response]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] AttackSeam", response);
    const seamWasDestroyed = response.seamHp <= 0;
    // Pipe wiggle animation
    if (areAnimationsEnabled()) {
      const x = response.seamX;
      const y = response.seamY;
      const pipeSeamInfo = getBuildingInfo(x, y);
      const pipeSeamDiv = getBuildingDiv(pipeSeamInfo.buildings_id);
      // Subtract how long the wiggle takes so it matches the sound a bit better
      const wiggleDelay = seamWasDestroyed ? 0 : attackDelayMS;
      wiggleTile(pipeSeamDiv, wiggleDelay);
    }
    if (seamWasDestroyed) {
      playSFX(GameSFX.unitAttackPipeSeam);
      playSFX(GameSFX.unitExplode);
      return;
    }
    setTimeout(() => playSFX(GameSFX.unitAttackPipeSeam), attackDelayMS);
  }
  function onMove(response, loadFlag) {
    ahMove?.apply(actionHandlers.Move, [response, loadFlag]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Move", response, loadFlag);
    const unitId = response.unit.units_id;
    movementResponseMap.set(unitId, response);
    const movementDist = response.path.length;
    stopMovementSound(unitId, false);
    if (movementDist > 1) {
      playMovementSound(unitId);
    }
  }
  function onCapture(data) {
    ahCapt?.apply(actionHandlers.Capt, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Capt", data);
    // They didn't finish the capture
    const finishedCapture = data.newIncome != null;
    if (!finishedCapture) {
      playSFX(GameSFX.unitCaptureProgress);
      return;
    }
    // The unit is done capping this property
    const myID = getMyID();
    const isSpectator = isPlayerSpectator(myID);
    // Don't use triple equals blindly here because the types are different
    // buildings_team (string) == id (number)
    const isMyCapture = data.buildingInfo.buildings_team === myID.toString() || isSpectator;
    const sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
    playSFX(sfx);
  }
  function onBuild(data) {
    ahBuild?.apply(actionHandlers.Build, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Build", data);
    const myID = getMyID();
    const isMyBuild = data.newUnit.units_players_id == myID;
    const isReplay = isReplayActive();
    if (!isMyBuild || isReplay) playSFX(GameSFX.unitSupply);
  }
  function onLoad(data) {
    ahLoad?.apply(actionHandlers.Load, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Load", data);
    playSFX(GameSFX.unitLoad);
  }
  function onUnload(data) {
    ahUnload?.apply(actionHandlers.Unload, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Unload", data);
    playSFX(GameSFX.unitUnload);
  }
  function onSupply(data) {
    ahSupply?.apply(actionHandlers.Supply, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Supply", data);
    // We could play the sfx for each supplied unit in the list
    // but instead we decided to play the supply sound once.
    playSFX(GameSFX.unitSupply);
  }
  function onRepair(data) {
    ahRepair?.apply(actionHandlers.Repair, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Repair", data);
    playSFX(GameSFX.unitSupply);
  }
  function onHide(data) {
    ahHide?.apply(actionHandlers.Hide, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Hide", data);
    playSFX(GameSFX.unitHide);
    stopMovementSound(data.unitId);
  }
  function onUnhide(data) {
    ahUnhide?.apply(actionHandlers.Unhide, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Unhide", data);
    playSFX(GameSFX.unitUnhide);
    stopMovementSound(data.unitId);
  }
  function onJoin(data) {
    ahJoin?.apply(actionHandlers.Join, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Join", data);
    stopMovementSound(data.joinID);
    stopMovementSound(data.joinedUnit.units_id);
  }
  function onLaunch(data) {
    ahLaunch?.apply(actionHandlers.Launch, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Launch", data);
    playSFX(GameSFX.unitMissileSend);
    setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
  }
  function onNextTurn(data) {
    ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] NextTurn", data);
    if (data.swapCos) {
      playSFX(GameSFX.tagSwap);
    }
    refreshMusicForNextTurn();
  }
  function onPower(data) {
    ahPower?.apply(actionHandlers.Power, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.debug("[MP] Power", data);
    // Remember, these are in title case with spaces like "Colin" or "Von Bolt"
    const coName = data.coName;
    const isBH = isBlackHoleCO(coName);
    const isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;
    // Update the theme type
    musicPlayerSettings.themeType = isSuperCOPower ? SettingsThemeType.SUPER_CO_POWER : SettingsThemeType.CO_POWER;
    switch (musicPlayerSettings.gameType) {
      case SettingsGameType.AW1:
        // Advance Wars 1 will use the same sound for both CO and Super CO power activations
        playSFX(GameSFX.powerActivateAW1COP);
        stopThemeSong(4500);
        return;
      case SettingsGameType.AW2:
      case SettingsGameType.DS:
      case SettingsGameType.RBC: {
        // Super CO Power
        if (isSuperCOPower) {
          const sfx = isBH ? GameSFX.powerActivateBHSCOP : GameSFX.powerActivateAllySCOP;
          const delay = isBH ? 1916 : 1100;
          playSFX(sfx);
          stopThemeSong(delay);
          break;
        }
        // Regular CO Power
        const sfx = isBH ? GameSFX.powerActivateBHCOP : GameSFX.powerActivateAllyCOP;
        const delay = isBH ? 1019 : 881;
        playSFX(sfx);
        stopThemeSong(delay);
        break;
      }
    }
    // Colin's gold rush SFX for AW2, DS, and RBC
    if (coName === "Colin" && !isSuperCOPower) {
      setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
    }
  }

  /**
   * @file Main script that loads everything for the AWBW Improved Music Player userscript.
   *
   * @TODO - More map editor sound effects
   * @TODO - Add unwrap to rollup
   */
  // Add our CSS to the page using rollup-plugin-postcss
  /******************************************************************
   * SCRIPT ENTRY (MAIN FUNCTION)
   ******************************************************************/
  function main() {
    console.debug("[AWBW Improved Music Player] Script starting...");
    musicPlayerUI.addToAWBWPage();
    addHandlers();
    if (getIsMovePlanner()) {
      console.log("[AWBW Improved Music Player] Move Planner detected");
      musicPlayerSettings.isPlaying = true;
      musicPlayerUI.setProgress(100);
      return;
    }
    if (getIsMaintenance()) {
      console.log("[AWBW Improved Music Player] Maintenance mode is active, playing relaxing music...");
      musicPlayerSettings.isPlaying = true;
      musicPlayerUI.setProgress(100);
      musicPlayerUI.openContextMenu();
      playMusicURL(MAINTENANCE_THEME_URL);
      return;
    }
    loadSettingsFromLocalStorage();
    preloadAllCommonAudio(() => {
      console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");
      // Set dynamic settings based on the current game state
      // Lastly, update the UI to reflect the current settings
      musicPlayerSettings.themeType = getCurrentThemeType();
      musicPlayerUI.updateAllInputLabels();
      playThemeSong();
      preloadAllExtraAudio(() => {
        console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
        playThemeSong();
      });
    });
  }
  main();

  exports.main = main;
  exports.notifyCOSelectorListeners = notifyCOSelectorListeners;

  return exports;
})({});
