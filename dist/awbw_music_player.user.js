// ==UserScript==
// @name        Improved AWBW Music Player
// @description An improved version of the comprehensive audio player that attempts to recreate the cart experience with more sound effects, more music, and more customizability.
// @namespace   https://awbw.amarriner.com/
// @author      DeveloperJose, _twiggy
// @match       https://awbw.amarriner.com/game.php*
// @match       https://awbw.amarriner.com/moveplanner.php*
// @match       https://awbw.amarriner.com/*editmap*
// @match       https://awbw.amarriner.com/yourgames.php*
// @match       https://awbw.amarriner.com/yourturn.php*
// @match       https://awbw.amarriner.com/live_queue.php*
// @icon        https://developerjose.netlify.app/img/music-player-icon.png
// @require     https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js
// @require     https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js
// @require     https://cdn.jsdelivr.net/npm/can-autoplay@3.0.2/build/can-autoplay.min.js
// @version     4.7.6
// @supportURL  https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @license     MIT
// @unwrap
// @grant       none
// ==/UserScript==

var awbw_music_player = (function (exports, canAutoplay, Howl, SparkMD5) {
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
    '/* This file is used to style the music player settings */\n\n.cls-settings-menu {\n  display: none;\n  /* display: flex; */\n  top: 40px;\n  flex-direction: column;\n  width: 850px;\n  border: black 1px solid;\n}\n\n.cls-settings-menu label {\n  background-color: white;\n  font-size: 12px;\n}\n\n.cls-settings-menu .cls-group-box > label {\n  width: 100%;\n  font-size: 13px;\n  background-color: #d6e0ed;\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n\n.cls-settings-menu .cls-vertical-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  align-items: center;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  height: 100%;\n  width: 100%;\n  position: relative;\n}\n\n.cls-settings-menu .cls-horizontal-box {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  align-items: center;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  height: 100%;\n  width: 100%;\n  position: relative;\n}\n\n/* Puts the checkbox next to the label */\n.cls-settings-menu .cls-vertical-box[id$="extra-options"] {\n  align-items: center;\n  align-self: center;\n}\n\n.cls-settings-menu .cls-vertical-box[id$="extra-options"] .cls-horizontal-box {\n  width: 100%;\n  justify-content: center;\n}\n\n.cls-settings-menu .cls-horizontal-box[id$="random-themes"],\n.cls-settings-menu .cls-horizontal-box[id$="soundtrack"] {\n  justify-content: center;\n}\n\n.cls-settings-menu-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  padding-left: 5px;\n  padding-right: 5px;\n  padding-top: 1px;\n  padding-bottom: 1px;\n  width: 100%;\n}\n\n.cls-settings-menu image {\n  vertical-align: middle;\n}\n\n.cls-settings-menu label[id$="version"] {\n  width: 100%;\n  font-size: 10px;\n  color: #888888;\n  background-color: #f0f0f0;\n}\n\n.cls-settings-menu a[id$="update"] {\n  font-size: 12px;\n  background-color: #ff0000;\n  color: white;\n  width: 100%;\n}\n.cls-settings-menu .co_caret {\n  position: absolute;\n  top: 28px;\n  left: 25px;\n  border: none;\n  z-index: 110;\n}\n\n.cls-settings-menu .co_portrait {\n  border-color: #009966;\n  z-index: 100;\n  border: 2px solid;\n  vertical-align: middle;\n  align-self: center;\n}\n\n.cls-settings-menu input[type="range"][id$="themes-start-on-day"] {\n  --c: rgb(168, 73, 208); /* active color */\n}\n';
  styleInject(css_248z$1);

  var css_248z =
    '/* \n * CSS Custom Range Slider\n * https://www.sitepoint.com/css-custom-range-slider/ \n */\n\n.cls-settings-menu input[type="range"] {\n  --c: rgb(53 57 60); /* active color */\n  --l: 15px; /* line thickness*/\n  --h: 30px; /* thumb height */\n  --w: 15px; /* thumb width */\n\n  width: 100%;\n  height: var(--h); /* needed for Firefox*/\n  --_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  background: none;\n  cursor: pointer;\n  overflow: hidden;\n  display: inline-block;\n}\n.cls-settings-menu input:focus-visible,\n.cls-settings-menu input:hover {\n  --p: 25%;\n}\n\n/* chromium */\n.cls-settings-menu input[type="range" i]::-webkit-slider-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n/* Firefox */\n.cls-settings-menu input[type="range"]::-moz-range-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n@supports not (color: color-mix(in srgb, red, red)) {\n  .cls-settings-menu input {\n    --_c: var(--c);\n  }\n}\n';
  styleInject(css_248z);

  /**
   * @file Constants, variables, and functions that come from analyzing the web pages of AWBW.
   *
   * querySelector()
   * . = class
   * # = id
   */
  /**
   * Are we in the map editor?
   */
  function isMapEditor() {
    return window.location.href.indexOf("editmap.php?") > -1;
  }
  function isMaintenance() {
    return document.querySelector("#server-maintenance-alert") !== null;
  }
  function isMovePlanner() {
    return window.location.href.indexOf("moveplanner.php") > -1;
  }
  function isYourGames() {
    return window.location.href.indexOf("yourgames.php") > -1 || window.location.href.indexOf("yourturn.php") > -1;
  }
  function isGamePageAndActive() {
    return window.location.href.indexOf("game.php") > -1 && !isMaintenance();
  }
  function isLiveQueue() {
    return window.location.href.indexOf("live_queue.php") > -1;
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
  function getConnectionErrorDiv() {
    return document.querySelector(".connection-error-msg");
  }
  function getLiveQueueSelectPopup() {
    return document.querySelector("#live-queue-select-popup");
  }
  function getLiveQueueBlockerPopup() {
    return document.querySelector(".live-queue-blocker-popup");
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
    window.setTimeout(() => moveDivToOffset(div, dx, dy, steps - 1, ...followUpAnimations), moveAnimationDelayMS);
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
    if (!coordsDiv) return;
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
  function getRandomCO(excludedCOs) {
    const COs = new Set(getAllCONames());
    for (const co of excludedCOs) COs.delete(co);
    // No COs available, play the map editor music
    if (COs.size === 0) return "map-editor";
    // Only one CO available, return it
    if (COs.size === 1) return [...COs][0];
    return [...COs][Math.floor(Math.random() * COs.size)];
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
    if (!isGamePageAndActive()) return -1;
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
    if (!isGamePageAndActive()) return null;
    return playersInfo[pid];
  }
  /**
   * Gets a list of all the player info data for all players in the current game.
   * @returns - List of player info data for all players in the current game.
   */
  function getAllPlayersInfo() {
    if (!isGamePageAndActive()) return [];
    return Object.values(playersInfo);
  }
  /**
   * Determines if the given player is a spectator based on their ID.
   * @param pid - Player ID who we want to check.
   * @returns True if the player is a spectator, false if they are playing in this game.
   */
  function isPlayerSpectator(pid) {
    if (!isGamePageAndActive()) return false;
    return !playerKeys.includes(pid);
  }
  /**
   * Checks if the given player is able to activate a regular CO Power.
   * @param pid - Player ID for whom we want to check.
   * @returns - True if the player can activate a regular CO Power.
   */
  function canPlayerActivateCOPower(pid) {
    if (!isGamePageAndActive()) return false;
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
    if (!isGamePageAndActive()) return false;
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
    if (!isGamePageAndActive()) return null;
    return buildingsInfo[x][y];
  }
  /**
   * Checks if we are currently in replay mode.
   * @returns - True if we are in replay mode.
   */
  function isReplayActive() {
    if (!isGamePageAndActive()) return false;
    // Check if replay mode is open by checking if the replay section is set to display
    const replayControls = getReplayControls();
    const replayOpen = replayControls.style.display !== "none";
    return replayOpen && Object.keys(replay).length > 0;
  }
  /**
   * Checks if the game has ended.
   * @returns - True if the game has ended.
   */
  function hasGameEnded() {
    if (!isGamePageAndActive()) return false;
    // Count how many players are still in the game
    const numberOfRemainingPlayers = Object.values(playersInfo).filter(
      (info) => info.players_eliminated === "N",
    ).length;
    return numberOfRemainingPlayers === 1;
  }
  function getCOImagePrefix() {
    if (typeof coTheme === "undefined") return "aw2";
    return coTheme;
  }
  function getServerTimeZone() {
    if (!isGamePageAndActive()) return "-05:00";
    if (typeof serverTimezone === "undefined") return "-05:00";
    if (!serverTimezone) return "-05:00";
    return serverTimezone;
  }
  function didGameEndToday() {
    if (!hasGameEnded()) return false;
    const serverTimezone = parseInt(getServerTimeZone());
    // In server time
    const endDate = new Date(gameEndDate);
    // Convert now to the server timezone
    // https://stackoverflow.com/questions/68500998/converting-to-local-time-using-utc-time-zone-format-in-javascript
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() / 60;
    const difference = +serverTimezone + timezoneOffset;
    const nowAdjustedToServer = new Date(now.getTime() + difference * 3600000);
    // Check if more than 24 hours have passed since the game ended
    const oneDayMilliseconds = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    // logDebug(nowAdjustedToServer.getTime() - endDate.getTime(), oneDayMilliseconds);
    return nowAdjustedToServer.getTime() - endDate.getTime() < oneDayMilliseconds;
  }
  /**
   * Gets the current day in the game, also works properly in replay mode.
   * In the map editor, we consider it to be day 1.
   * @returns - The current day in the game.
   */
  function getCurrentGameDay() {
    if (!isGamePageAndActive()) return 1;
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
      if (!isGamePageAndActive()) return null;
      if (typeof currentTurn === "undefined") return null;
      return getPlayerInfo(currentTurn);
    }
    /**
     * Determine whether a CO Power or Super CO Power is activated for the current player.
     * @returns - True if a regular CO power or a Super CO Power is activated.
     */
    static get isPowerActivated() {
      if (!isGamePageAndActive()) return false;
      return this?.coPowerState !== COPowerEnum.NoPower;
    }
    /**
     * Gets state of the CO Power for the current player represented as a single letter.
     * @returns - The state of the CO Power for the current player.
     */
    static get coPowerState() {
      if (!isGamePageAndActive()) return COPowerEnum.NoPower;
      return this.info?.players_co_power_on;
    }
    /**
     * Determine if the current player has been eliminated from the game.
     * @returns - True if the current player has been eliminated.
     */
    static get isEliminated() {
      if (!isGamePageAndActive()) return false;
      return this.info?.players_eliminated === "Y";
    }
    /**
     * Gets the name of the CO for the current player.
     * If the game has ended, it will return "victory" or "defeat".
     * If we are in the map editor, it will return "map-editor".
     * @returns - The name of the CO for the current player.
     */
    static get coName() {
      if (isMapEditor()) return "map-editor";
      if (isMaintenance()) return "maintenance";
      if (!isGamePageAndActive()) return null;
      const myID = getMyID();
      const myInfo = getPlayerInfo(myID);
      const myWin = myInfo?.players_eliminated === "N";
      const myLoss = myInfo?.players_eliminated === "Y";
      const endedToday = didGameEndToday();
      const isSpectator = isPlayerSpectator(myID);
      const endGameTheme = isSpectator || myWin ? "victory" : "defeat";
      // Play victory/defeat themes after the game ends for everyone
      if (hasGameEnded()) {
        // We were watching or playing a game that just ended or ended today
        if (endedToday) return endGameTheme;
        // The game ended more than a day ago and we just opened it or closed the replay
        if (!isReplayActive()) return "co-select";
        // The game ended more than a day ago and we are watching the replay
        return endGameTheme;
      }
      // The game has not ended, but we already lost
      if (myLoss) return "defeat";
      // The game has not ended
      return this.info?.co_name;
    }
  }
  /**
   * Determine who all the COs of the game are and return a list of their names.
   * @returns - List with the names of each CO in the game.
   */
  function getAllPlayingCONames() {
    if (isMapEditor()) return new Set(["map-editor"]);
    if (!isGamePageAndActive()) return new Set();
    const allPlayers = new Set(getAllPlayersInfo().map((info) => info.co_name));
    const allTagPlayers = getAllTagCONames();
    return new Set([...allPlayers, ...allTagPlayers]);
  }
  /**
   * Checks if the game is a tag game with 2 COs per team.
   * @returns - True if the game is a tag game.
   */
  function isTagGame() {
    if (!isGamePageAndActive()) return false;
    return typeof tagsInfo !== "undefined" && tagsInfo;
  }
  /**
   * If the game is a tag game, get the names of all secondary COs that are part of the tags.
   * @returns - Set with the names of each secondary CO in the tag.
   */
  function getAllTagCONames() {
    if (!isGamePageAndActive() || !isTagGame()) return new Set();
    return new Set(Object.values(tagsInfo).map((tag) => tag.co_name));
  }
  /**
   * Gets the internal info object for the given unit.
   * @param unitId - ID of the unit for whom we want to get the current info state.
   * @returns - The info for that unit at its current state.
   */
  function getUnitInfo(unitId) {
    if (!isGamePageAndActive()) return null;
    return unitsInfo[unitId];
  }
  /**
   * Gets the name of the given unit or null if the given unit is invalid.
   * @param unitId - ID of the unit for whom we want to get the name.
   * @returns - Name of the unit.
   */
  function getUnitName(unitId) {
    if (!isGamePageAndActive()) return null;
    return getUnitInfo(unitId)?.units_name;
  }
  /**
   * Try to get the unit info for the unit at the given coordinates, if any.
   * @param x - X coordinate to get the unit info from.
   * @param y - Y coordinate to get the unit info from.
   * @returns - The info for the unit at the given coordinates or null if there is no unit there.
   */
  function getUnitInfoFromCoords(x, y) {
    if (!isGamePageAndActive()) return null;
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
    if (!isGamePageAndActive()) return false;
    return unitId !== undefined && unitsInfo[unitId] !== undefined;
  }
  /**
   * Checks if the given unit has moved this turn.
   * @param unitId - ID of the unit we want to check.
   * @returns - True if the unit is valid and it has moved this turn.
   */
  function hasUnitMovedThisTurn(unitId) {
    if (!isGamePageAndActive()) return false;
    return isValidUnit(unitId) && getUnitInfo(unitId)?.units_moved === 1;
  }
  function addConnectionErrorObserver(onConnectionError) {
    const connectionErrorDiv = getConnectionErrorDiv();
    if (!connectionErrorDiv) return;
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") return;
        if (!mutation.target) return;
        if (!mutation.target.textContent) return;
        const closeMsg = mutation.target.textContent;
        onConnectionError(closeMsg);
      }
    });
    observer.observe(connectionErrorDiv, { childList: true });
  }

  /**
   * @file Utility functions for the music player that don't fit anywhere else specifically.
   */
  /**
   * Logs a message to the console with the prefix "[AWBW Improved Music Player]"
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function log(message, ...args) {
    console.log("[AWBW Improved Music Player]", message, ...args);
  }
  /**
   * Logs a warning message to the console with the prefix "[AWBW Improved Music Player]"
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function logError(message, ...args) {
    console.error("[AWBW Improved Music Player]", message, ...args);
  }
  /**
   * Logs a debug message to the console with the prefix "[AWBW Improved Music Player]"
   * @param message - The message to log
   * @param args - Additional arguments to log
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function logDebug(message, ...args) {
    console.debug("[AWBW Improved Music Player]", message, ...args);
  }

  /**
   * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
   * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
   */
  /**
   * Enum that represents which game we want the music player to use for its music.
   * @enum {string}
   */
  var GameType;
  (function (GameType) {
    GameType["AW1"] = "AW1";
    GameType["AW2"] = "AW2";
    GameType["RBC"] = "RBC";
    GameType["DS"] = "DS";
  })(GameType || (GameType = {}));
  /**
   * Enum that represents music theme types like regular or power.
   * @enum {string}
   */
  var ThemeType;
  (function (ThemeType) {
    ThemeType["REGULAR"] = "REGULAR";
    ThemeType["CO_POWER"] = "CO_POWER";
    ThemeType["SUPER_CO_POWER"] = "SUPER_CO_POWER";
  })(ThemeType || (ThemeType = {}));
  /**
   * Enum that represents different options for random themes.
   * @enum {string}
   */
  var RandomThemeType;
  (function (RandomThemeType) {
    RandomThemeType["NONE"] = "NONE";
    RandomThemeType["ALL_THEMES"] = "ALL_THEMES";
    RandomThemeType["CURRENT_SOUNDTRACK"] = "CURRENT_SOUNDTRACK";
  })(RandomThemeType || (RandomThemeType = {}));
  /**
   * Gets the theme type enum corresponding to the CO Power state for the current CO.
   * @returns - The SettingsThemeType enum for the current CO Power state.
   */
  function getCurrentThemeType() {
    const currentPowerState = currentPlayer?.coPowerState;
    if (currentPowerState === "Y") return ThemeType.CO_POWER;
    if (currentPowerState === "S") return ThemeType.SUPER_CO_POWER;
    return ThemeType.REGULAR;
  }
  /**
   * Gets a random game type from the SettingsGameType enum.
   * @returns - A random game type from the SettingsGameType enum.
   */
  function getRandomGameType(excludedGameTypes = new Set()) {
    const gameTypes = Object.values(GameType).filter((gameType) => !excludedGameTypes.has(gameType));
    return gameTypes[Math.floor(Math.random() * gameTypes.length)];
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
   * Enum that represents the keys for the music player settings.
   * @enum {number}
   */
  var SettingsKey;
  (function (SettingsKey) {
    SettingsKey[(SettingsKey["IS_PLAYING"] = 0)] = "IS_PLAYING";
    SettingsKey[(SettingsKey["VOLUME"] = 1)] = "VOLUME";
    SettingsKey[(SettingsKey["SFX_VOLUME"] = 2)] = "SFX_VOLUME";
    SettingsKey[(SettingsKey["UI_VOLUME"] = 3)] = "UI_VOLUME";
    SettingsKey[(SettingsKey["GAME_TYPE"] = 4)] = "GAME_TYPE";
    SettingsKey[(SettingsKey["ALTERNATE_THEMES"] = 5)] = "ALTERNATE_THEMES";
    SettingsKey[(SettingsKey["ALTERNATE_THEME_DAY"] = 6)] = "ALTERNATE_THEME_DAY";
    SettingsKey[(SettingsKey["RANDOM_THEMES_TYPE"] = 7)] = "RANDOM_THEMES_TYPE";
    SettingsKey[(SettingsKey["CAPTURE_PROGRESS_SFX"] = 8)] = "CAPTURE_PROGRESS_SFX";
    SettingsKey[(SettingsKey["PIPE_SEAM_SFX"] = 9)] = "PIPE_SEAM_SFX";
    SettingsKey[(SettingsKey["OVERRIDE_LIST"] = 10)] = "OVERRIDE_LIST";
    SettingsKey[(SettingsKey["RESTART_THEMES"] = 11)] = "RESTART_THEMES";
    SettingsKey[(SettingsKey["AUTOPLAY_ON_OTHER_PAGES"] = 12)] = "AUTOPLAY_ON_OTHER_PAGES";
    SettingsKey[(SettingsKey["EXCLUDED_RANDOM_THEMES"] = 13)] = "EXCLUDED_RANDOM_THEMES";
    // Non-user configurable settings
    SettingsKey[(SettingsKey["THEME_TYPE"] = 14)] = "THEME_TYPE";
    SettingsKey[(SettingsKey["CURRENT_RANDOM_CO"] = 15)] = "CURRENT_RANDOM_CO";
    // Special keys that don't match specific variables
    SettingsKey[(SettingsKey["ALL"] = 16)] = "ALL";
    SettingsKey[(SettingsKey["ADD_OVERRIDE"] = 17)] = "ADD_OVERRIDE";
    SettingsKey[(SettingsKey["REMOVE_OVERRIDE"] = 18)] = "REMOVE_OVERRIDE";
    SettingsKey[(SettingsKey["ADD_EXCLUDED"] = 19)] = "ADD_EXCLUDED";
    SettingsKey[(SettingsKey["REMOVE_EXCLUDED"] = 20)] = "REMOVE_EXCLUDED";
  })(SettingsKey || (SettingsKey = {}));
  /**
   * The music player settings' current internal state.
   * DO NOT EDIT __ prefix variables, use the properties!
   */
  class musicSettings {
    // User configurable settings
    static __isPlaying = false;
    static __volume = 0.5;
    static __sfxVolume = 0.4;
    static __uiVolume = 0.4;
    static __gameType = GameType.DS;
    static __alternateThemes = true;
    static __alternateThemeDay = 15;
    static __randomThemesType = RandomThemeType.NONE;
    static __captureProgressSFX = true;
    static __pipeSeamSFX = true;
    static __overrideList = new Map();
    static __restartThemes = false;
    static __autoplayOnOtherPages = true;
    static __excludedRandomThemes = new Set();
    // Non-user configurable settings
    static __themeType = ThemeType.REGULAR;
    static __currentRandomCO = "";
    static __currentRandomGameType = GameType.DS;
    static __isLoaded = false;
    static toJSON() {
      return JSON.stringify({
        isPlaying: this.__isPlaying,
        volume: this.__volume,
        sfxVolume: this.__sfxVolume,
        uiVolume: this.__uiVolume,
        gameType: this.__gameType,
        alternateThemes: this.__alternateThemes,
        alternateThemeDay: this.__alternateThemeDay,
        randomThemesType: this.__randomThemesType,
        captureProgressSFX: this.__captureProgressSFX,
        pipeSeamSFX: this.__pipeSeamSFX,
        overrideList: Array.from(this.__overrideList.entries()),
        restartThemes: this.__restartThemes,
        autoplayOnOtherPages: this.__autoplayOnOtherPages,
        excludedRandomThemes: Array.from(this.__excludedRandomThemes),
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
          if (key === "excludedRandomThemes") {
            this.__excludedRandomThemes = new Set(savedSettings[key]);
            continue;
          }
          // For all other settings, just set them with the setter function
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this[key] = savedSettings[key];
          // debug("Loading", key, "as", savedSettings[key]);
        }
      }
      this.__isLoaded = true;
    }
    static set isPlaying(val) {
      if (this.__isPlaying === val) return;
      this.__isPlaying = val;
      this.onSettingChangeEvent(SettingsKey.IS_PLAYING);
    }
    static get isPlaying() {
      return this.__isPlaying;
    }
    static set volume(val) {
      if (this.__volume === val) return;
      this.__volume = val;
      this.onSettingChangeEvent(SettingsKey.VOLUME);
    }
    static get volume() {
      return this.__volume;
    }
    static set sfxVolume(val) {
      if (this.__sfxVolume === val) return;
      this.__sfxVolume = val;
      this.onSettingChangeEvent(SettingsKey.SFX_VOLUME);
    }
    static get sfxVolume() {
      return this.__sfxVolume;
    }
    static set uiVolume(val) {
      if (this.__uiVolume === val) return;
      this.__uiVolume = val;
      this.onSettingChangeEvent(SettingsKey.UI_VOLUME);
    }
    static get uiVolume() {
      return this.__uiVolume;
    }
    static set gameType(val) {
      if (this.__gameType === val) return;
      this.__gameType = val;
      // The user wants this game type, so override whatever random game type we had before
      this.__currentRandomGameType = val;
      this.onSettingChangeEvent(SettingsKey.GAME_TYPE);
    }
    static get gameType() {
      return this.__gameType;
    }
    static set alternateThemes(val) {
      if (this.__alternateThemes === val) return;
      this.__alternateThemes = val;
      this.onSettingChangeEvent(SettingsKey.ALTERNATE_THEMES);
    }
    static get alternateThemes() {
      return this.__alternateThemes;
    }
    static set alternateThemeDay(val) {
      if (this.__alternateThemeDay === val) return;
      this.__alternateThemeDay = val;
      this.onSettingChangeEvent(SettingsKey.ALTERNATE_THEME_DAY);
    }
    static get alternateThemeDay() {
      return this.__alternateThemeDay;
    }
    static set captureProgressSFX(val) {
      // if (this.__captureProgressSFX === val) return;
      this.__captureProgressSFX = val;
      this.onSettingChangeEvent(SettingsKey.CAPTURE_PROGRESS_SFX);
    }
    static get captureProgressSFX() {
      return this.__captureProgressSFX;
    }
    static set pipeSeamSFX(val) {
      // if (this.__pipeSeamSFX === val) return;
      this.__pipeSeamSFX = val;
      this.onSettingChangeEvent(SettingsKey.PIPE_SEAM_SFX);
    }
    static get pipeSeamSFX() {
      return this.__pipeSeamSFX;
    }
    static set overrideList(val) {
      this.__overrideList = new Map([...val.entries()].sort());
      this.onSettingChangeEvent(SettingsKey.OVERRIDE_LIST);
    }
    static get overrideList() {
      return this.__overrideList;
    }
    static addOverride(coName, gameType) {
      this.__overrideList.set(coName, gameType);
      this.__overrideList = new Map([...this.__overrideList.entries()].sort());
      this.onSettingChangeEvent(SettingsKey.ADD_OVERRIDE);
    }
    static removeOverride(coName) {
      this.__overrideList.delete(coName);
      this.__overrideList = new Map([...this.__overrideList.entries()].sort());
      this.onSettingChangeEvent(SettingsKey.REMOVE_OVERRIDE);
    }
    static getOverride(coName) {
      return this.__overrideList.get(coName);
    }
    static get restartThemes() {
      return this.__restartThemes;
    }
    static set restartThemes(val) {
      if (this.__restartThemes === val) return;
      this.__restartThemes = val;
      this.onSettingChangeEvent(SettingsKey.RESTART_THEMES);
    }
    static get autoplayOnOtherPages() {
      return this.__autoplayOnOtherPages;
    }
    static set autoplayOnOtherPages(val) {
      if (this.__autoplayOnOtherPages === val) return;
      this.__autoplayOnOtherPages = val;
      this.onSettingChangeEvent(SettingsKey.AUTOPLAY_ON_OTHER_PAGES);
    }
    static get excludedRandomThemes() {
      return this.__excludedRandomThemes;
    }
    static set excludedRandomThemes(val) {
      this.__excludedRandomThemes = val;
      this.onSettingChangeEvent(SettingsKey.EXCLUDED_RANDOM_THEMES);
    }
    static addExcludedRandomTheme(theme) {
      this.__excludedRandomThemes.add(theme);
      this.onSettingChangeEvent(SettingsKey.ADD_EXCLUDED);
    }
    static removeExcludedRandomTheme(theme) {
      this.__excludedRandomThemes.delete(theme);
      this.onSettingChangeEvent(SettingsKey.REMOVE_EXCLUDED);
    }
    // ************* Non-user configurable settings from here on
    static set themeType(val) {
      if (this.__themeType === val) return;
      this.__themeType = val;
      this.onSettingChangeEvent(SettingsKey.THEME_TYPE);
    }
    static get themeType() {
      return this.__themeType;
    }
    static set randomThemesType(val) {
      if (this.__randomThemesType === val) return;
      this.__randomThemesType = val;
      this.onSettingChangeEvent(SettingsKey.RANDOM_THEMES_TYPE);
    }
    static get randomThemesType() {
      return this.__randomThemesType;
    }
    static get currentRandomCO() {
      if (!this.__currentRandomCO || this.__currentRandomCO == "") this.randomizeCO();
      return this.__currentRandomCO;
    }
    static randomizeCO() {
      const excludedCOs = new Set([...this.__excludedRandomThemes, this.__currentRandomCO]);
      this.__currentRandomCO = getRandomCO(excludedCOs);
      // Randomize soundtrack EXCEPT we don't allow AW1 during power themes
      const isPower = this.themeType !== ThemeType.REGULAR;
      const excludedSoundtracks = new Set();
      if (isPower) excludedSoundtracks.add(GameType.AW1);
      this.__currentRandomGameType = getRandomGameType(excludedSoundtracks);
      this.onSettingChangeEvent(SettingsKey.CURRENT_RANDOM_CO);
    }
    static onSettingChangeEvent(key) {
      onSettingsChangeListeners.forEach((fn) => fn(key, !this.__isLoaded));
    }
    static get currentRandomGameType() {
      return this.__currentRandomGameType;
    }
  }
  /**
   * Loads the music player settings stored in the local storage.
   */
  function loadSettingsFromLocalStorage() {
    let storageData = localStorage.getItem(STORAGE_KEY);
    // Store defaults if nothing or undefined is stored
    if (!storageData || storageData === "undefined") {
      log("No saved settings found, storing defaults");
      storageData = updateSettingsInLocalStorage();
    }
    musicSettings.fromJSON(storageData);
    // Tell everyone we just loaded the settings
    onSettingsChangeListeners.forEach((fn) => fn(SettingsKey.ALL, true));
    logDebug("Settings loaded from storage:", storageData);
  }
  function allowSettingsToBeSaved() {
    // From now on, any setting changes will be saved and any listeners will be called
    addSettingsChangeListener(onSettingsChange$2);
  }
  function onSettingsChange$2(key, _isFirstLoad) {
    // We can't save the non-configurable settings
    if (key === SettingsKey.THEME_TYPE || key === SettingsKey.CURRENT_RANDOM_CO) return "";
    // Save all settings otherwise
    updateSettingsInLocalStorage();
  }
  /**
   * Saves the current music player settings in the local storage.
   */
  function updateSettingsInLocalStorage() {
    const jsonSettings = musicSettings.toJSON();
    localStorage.setItem(STORAGE_KEY, jsonSettings);
    logDebug("Saving settings...", jsonSettings);
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
   * URL for the JSON file containing the hashes for all the music files.
   * @constant {string}
   */
  const HASH_JSON_URL = BASE_MUSIC_URL + "/hashes.json";
  /**
   * URLs for the special themes that are not related to specific COs.
   * @enum {string}
   */
  var SpecialTheme;
  (function (SpecialTheme) {
    SpecialTheme["Victory"] = "https://developerjose.netlify.app/music/t-victory.ogg";
    SpecialTheme["Defeat"] = "https://developerjose.netlify.app/music/t-defeat.ogg";
    SpecialTheme["Maintenance"] = "https://developerjose.netlify.app/music/t-maintenance.ogg";
    SpecialTheme["COSelect"] = "https://developerjose.netlify.app/music/t-co-select.ogg";
    SpecialTheme["ModeSelect"] = "https://developerjose.netlify.app/music/t-mode-select.ogg";
  })(SpecialTheme || (SpecialTheme = {}));
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
    ["Md.Tank", MovementSFX.moveTreadHeavyLoop],
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
    [GameType.AW1, new Set(["sturm"])],
    [GameType.AW2, new Set(["sturm"])],
    [GameType.RBC, new Set(["andy", "olaf", "eagle", "drake", "grit", "kanbei", "sonja", "sturm"])],
    [GameType.DS, new Set(["sturm", "vonbolt"])],
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
    const isPowerActive = themeType !== ThemeType.REGULAR;
    if (gameType === GameType.RBC && isPowerActive) {
      return `t-${faction}-${themeType}`;
    }
    // No alternate theme or it's a power
    if (!alternateThemesSet?.has(coName) || isPowerActive) {
      return;
    }
    // Andy -> Clone Andy
    if (coName === "andy" && gameType == GameType.RBC) {
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
    const isPowerActive = themeType !== ThemeType.REGULAR;
    if (!isPowerActive || gameType === GameType.AW1) {
      return `t-${coName}`;
    }
    // For RBC, we play the new power themes (if they are not in the DS games obviously)
    const isCOInRBC = !AW_DS_ONLY_COs.has(coName);
    if (gameType === GameType.RBC && isCOInRBC) {
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
    if (gameType === null || gameType === undefined) gameType = musicSettings.gameType;
    if (themeType === null || themeType === undefined) themeType = musicSettings.themeType;
    if (useAlternateTheme === null || useAlternateTheme === undefined) {
      useAlternateTheme = getCurrentGameDay() >= musicSettings.alternateThemeDay && musicSettings.alternateThemes;
    }
    // Convert name to internal format
    coName = coName.toLowerCase().replaceAll(" ", "");
    // Check if we want to play a special theme;
    if (coName === "victory") return "https://developerjose.netlify.app/music/t-victory.ogg" /* SpecialTheme.Victory */;
    if (coName === "defeat") return "https://developerjose.netlify.app/music/t-defeat.ogg" /* SpecialTheme.Defeat */;
    if (coName === "co-select")
      return "https://developerjose.netlify.app/music/t-co-select.ogg" /* SpecialTheme.COSelect */;
    if (coName === "mode-select")
      return "https://developerjose.netlify.app/music/t-mode-select.ogg" /* SpecialTheme.ModeSelect */;
    if (coName === "maintenance")
      return "https://developerjose.netlify.app/music/t-maintenance.ogg" /* SpecialTheme.Maintenance */;
    // First apply player overrides, that way we can override their overrides later...
    const overrideType = musicSettings.getOverride(coName);
    if (overrideType) gameType = overrideType;
    // This needs to go BEFORE overriding the game type
    const filename = getMusicFilename(coName, gameType, themeType, useAlternateTheme);
    // Override the game type to a higher game if the CO is not in the current soundtrack
    // We do this AFTER getting the filename so the getMusicFilename function has the correct gameType
    // Since we only need the correct gameType for the music directory
    if (gameType !== GameType.DS && AW_DS_ONLY_COs.has(coName)) gameType = GameType.DS;
    if (gameType === GameType.AW1 && AW2_ONLY_COs.has(coName)) gameType = GameType.AW2;
    let gameDir = gameType;
    if (!gameDir.startsWith("AW")) gameDir = "AW_" + gameDir;
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
    const sfx = onMovementStartMap.get(unitName);
    if (!sfx) return "";
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
      const regularURL = getMusicURL(name, musicSettings.gameType, ThemeType.REGULAR, false);
      const powerURL = getMusicURL(name, musicSettings.gameType, ThemeType.CO_POWER, false);
      const superPowerURL = getMusicURL(name, musicSettings.gameType, ThemeType.SUPER_CO_POWER, false);
      const alternateURL = getMusicURL(name, musicSettings.gameType, musicSettings.themeType, true);
      audioList.add(regularURL);
      audioList.add(alternateURL);
      audioList.add(powerURL);
      audioList.add(superPowerURL);
      if (specialLoops.has(name)) audioList.add(regularURL.replace(".ogg", "-loop.ogg"));
    });
    return audioList;
  }

  /**
   * @file Constants and other project configuration settings that could be used by any scripts.
   */
  /**
   * The names of the userscripts.
   */
  var ScriptName;
  (function (ScriptName) {
    ScriptName["None"] = "none";
    ScriptName["MusicPlayer"] = "music_player";
    ScriptName["HighlightCursorCoordinates"] = "highlight_cursor_coordinates";
  })(ScriptName || (ScriptName = {}));
  /**
   * The version numbers of the userscripts.
   */
  const versions = new Map([
    [ScriptName.MusicPlayer, "4.7.6"],
    [ScriptName.HighlightCursorCoordinates, "2.2.2"],
  ]);
  /**
   * The URLs to check for updates for each userscript.
   */
  const updateURLs = new Map([
    [ScriptName.MusicPlayer, "https://update.greasyfork.org/scripts/518170/Improved%20AWBW%20Music%20Player.meta.js"],
    [
      ScriptName.HighlightCursorCoordinates,
      "https://update.greasyfork.org/scripts/520884/AWBW%20Highlight%20Cursor%20Coordinates.meta.js",
    ],
  ]);
  const homepageURLs = new Map([
    [ScriptName.MusicPlayer, "https://greasyfork.org/en/scripts/518170-improved-awbw-music-player"],
    [
      ScriptName.HighlightCursorCoordinates,
      "https://greasyfork.org/en/scripts/520884-awbw-highlight-cursor-coordinates",
    ],
  ]);
  /**
   * Checks for updates for the specified script.
   * @param scriptName - The name of the script to check for updates
   * @returns - A promise that resolves with the latest version of the script
   */
  function checkIfUpdateIsAvailable(scriptName) {
    return new Promise((resolve, reject) => {
      // Get the update URL
      const updateURL = updateURLs.get(scriptName);
      if (!updateURL) return reject(`Failed to get the update URL for the script.`);
      return fetch(updateURL)
        .then((response) => response.text())
        .then((text) => {
          if (!text) return reject(`Failed to get the HTML from the update URL for the script.`);
          // Get the latest version of the script from the userscript metadata
          const latestVersion = text.match(/@version\s+([0-9.]+)/)?.[1];
          if (!latestVersion) return reject(`Failed to get the latest version of the script.`);
          // Check if the latest version is newer than the current version
          const currentVersion = versions.get(scriptName);
          if (!currentVersion) return reject(`Failed to get the current version of the script.`);
          // Check if the version numbers are in the correct format
          const currentVersionParts = currentVersion.split(".");
          const latestVersionParts = latestVersion.split(".");
          const hasThreeParts = currentVersionParts.length === 3 && latestVersionParts.length === 3;
          if (!hasThreeParts) return reject(`The version number of the script is not in the correct format.`);
          logDebug(`Current version: ${currentVersion}, Latest version: ${latestVersion}`);
          // Compare the version numbers by their parts
          return resolve(
            parseInt(currentVersionParts[0]) < parseInt(latestVersionParts[0]) ||
              parseInt(currentVersionParts[1]) < parseInt(latestVersionParts[1]) ||
              parseInt(currentVersionParts[2]) < parseInt(latestVersionParts[2]),
          );
        })
        .catch((reason) => reject(reason));
    });
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
    prefix;
    /**
     * A boolean that represents whether an update is available for the script.
     */
    isUpdateAvailable = false;
    /**
     * Text to be displayed when hovering over the main button.
     */
    parentHoverText = "";
    /**
     * A map that contains the tables in the menu.
     * The keys are the names of the tables, and the values are the table elements.
     */
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
      contextMenu.style.zIndex = "20";
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
    addToAWBWPage(div, prepend = false) {
      if (!prepend) {
        div.appendChild(this.parent);
        this.parent.style.borderLeft = "none";
        return;
      }
      div.prepend(this.parent);
      this.parent.style.borderRight = "none";
    }
    hasSettings() {
      const hasLeftMenu = this.groups.get(MenuPosition.Left)?.style.display !== "none";
      const hasCenterMenu = this.groups.get(MenuPosition.Center)?.style.display !== "none";
      const hasRightMenu = this.groups.get(MenuPosition.Right)?.style.display !== "none";
      return hasLeftMenu || hasCenterMenu || hasRightMenu;
    }
    getGroup(groupName) {
      const container = this.groups.get(groupName);
      // Unhide group
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
      if (this.isUpdateAvailable) text += " (New Update Available!)";
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
      if (progress < 0) {
        bgDiv.style.backgroundImage = "";
        return;
      }
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
    addEventListener(type, listener, options = false) {
      const div = this.groups.get("bg");
      div?.addEventListener(type, listener, options);
    }
    /**
     * Opens the context (right-click) menu.
     */
    openContextMenu() {
      const contextMenu = this.groups.get("settings-parent");
      if (!contextMenu) return;
      // No settings so don't open the menu
      const hasVersion = this.groups.get("version")?.style.display !== "none";
      if (!this.hasSettings() && !hasVersion) return;
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
      if (overDiv && hasCOSelector && isGamePageAndActive()) {
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
      const contextMenu = this.getGroup(position);
      if (!contextMenu) return;
      // Container for the slider and label
      const sliderBox = document.createElement("div");
      sliderBox.classList.add("cls-vertical-box");
      sliderBox.classList.add("cls-group-box");
      contextMenu?.appendChild(sliderBox);
      // Slider label
      const label = document.createElement("label");
      sliderBox?.appendChild(label);
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
      sliderBox?.appendChild(slider);
      // Hover text
      slider.title = hoverText;
      slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
      slider.addEventListener("mouseout", () => this.setHoverText(""));
      return slider;
    }
    addGroup(groupName, type = GroupType.Horizontal, position = MenuPosition.Center) {
      const contextMenu = this.getGroup(position);
      if (!contextMenu) return;
      // Container for the label and group inner container
      const groupBox = document.createElement("div");
      groupBox.classList.add("cls-vertical-box");
      groupBox.classList.add("cls-group-box");
      contextMenu?.appendChild(groupBox);
      // Label for the group
      const groupLabel = document.createElement("label");
      groupLabel.innerText = groupName;
      groupBox?.appendChild(groupLabel);
      // Group container
      const group = document.createElement("div");
      group.id = `${this.prefix}-${sanitize(groupName)}`;
      group.classList.add(type);
      groupBox?.appendChild(group);
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
      inputBox.title = hoverText;
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
    addVersion() {
      const version = versions.get(this.prefix);
      if (!version) return;
      const contextMenu = this.groups.get("settings-parent");
      const versionDiv = document.createElement("label");
      versionDiv.id = this.prefix + "-version";
      versionDiv.innerText = `Version: ${version} (DeveloperJose Edition)`;
      contextMenu?.appendChild(versionDiv);
      this.groups.set("version", versionDiv);
    }
    checkIfNewVersionAvailable() {
      const currentVersion = versions.get(this.prefix);
      const updateURL = updateURLs.get(this.prefix);
      const homepageURL = homepageURLs.get(this.prefix) || "";
      if (!currentVersion || !updateURL) return;
      checkIfUpdateIsAvailable(this.prefix)
        .then((isUpdateAvailable) => {
          this.isUpdateAvailable = isUpdateAvailable;
          log("Checking if a new version is available...", isUpdateAvailable);
          if (!isUpdateAvailable) return;
          const contextMenu = this.groups.get("settings-parent");
          const versionDiv = document.createElement("a");
          versionDiv.id = this.prefix + "-update";
          versionDiv.href = homepageURL;
          versionDiv.target = "_blank";
          versionDiv.innerText = `(!) Update Available: Please click here to open the update page in a new tab. (!)`;
          contextMenu?.append(versionDiv.cloneNode(true));
          if (this.hasSettings()) contextMenu?.prepend(versionDiv);
        })
        .catch((error) => logError(error));
    }
    addTable(name, rows, columns, groupName, hoverText = "") {
      const groupDiv = this.getGroup(groupName);
      if (!groupDiv) return;
      const table = document.createElement("table");
      table.classList.add("cls-settings-table");
      groupDiv.appendChild(table);
      // Hover text
      table.title = hoverText;
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
      coSelector.title = hoverText;
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
      const coPrefix = getCOImagePrefix();
      const imgSrc = `terrain/ani/${coPrefix}${internalName}.png?v=1`;
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
      const coPrefix = getCOImagePrefix();
      imgCO.src = `terrain/ani/${coPrefix}${coName}.png?v=1`;
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
      const coPrefix = getCOImagePrefix();
      imgCO.src = `terrain/ani/${coPrefix}${coName}.png?v=1`;
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
   * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
   */
  // Listen for setting changes to update the menu UI
  addSettingsChangeListener(onSettingsChange$1);
  /**
   * Event handler for when the music button is clicked that turns the music ON/OFF.
   * @param _event - Click event handler, not used.
   */
  function onMusicBtnClick(_event) {
    musicSettings.isPlaying = !musicSettings.isPlaying;
  }
  /**
   * Event handler that is triggered whenever the settings of the music player are changed.
   * Updates the music player settings UI (context menu) so it matches the internal settings when the settings change.
   *
   * The context menu is the menu that appears when you right-click the player that shows you options.
   * This function ensures that the internal settings are reflected properly on the UI.
   * @param key - Name of the setting that changed, matches the name of the property in {@link musicSettings}.
   * @param isFirstLoad - Whether this is the first time the settings are being loaded.
   */
  function onSettingsChange$1(key, isFirstLoad) {
    // We are loading settings stored in LocalStorage, so set the initial values of all inputs.
    // Only do this once, when the settings are first loaded, otherwise it's infinite recursion.
    if (isFirstLoad) {
      if (volumeSlider) volumeSlider.value = musicSettings.volume.toString();
      if (sfxVolumeSlider) sfxVolumeSlider.value = musicSettings.sfxVolume.toString();
      if (uiVolumeSlider) uiVolumeSlider.value = musicSettings.uiVolume.toString();
      if (daySlider) daySlider.value = musicSettings.alternateThemeDay.toString();
      const selectedGameTypeRadio = gameTypeRadioMap.get(musicSettings.gameType);
      if (selectedGameTypeRadio) selectedGameTypeRadio.checked = true;
      const selectedRandomTypeRadio = randomRadioMap.get(musicSettings.randomThemesType);
      if (selectedRandomTypeRadio) selectedRandomTypeRadio.checked = true;
      captProgressBox.checked = musicSettings.captureProgressSFX;
      pipeSeamBox.checked = musicSettings.pipeSeamSFX;
      restartThemesBox.checked = musicSettings.restartThemes;
      autoplayPagesBox.checked = musicSettings.autoplayOnOtherPages;
      alternateThemesBox.checked = musicSettings.alternateThemes;
      // Update all labels
      musicPlayerUI.updateAllInputLabels();
    }
    // Sort overrides again if we are loading the settings for the first time, or if the override list changed
    if (key === SettingsKey.ALL || key === SettingsKey.ADD_OVERRIDE || key === SettingsKey.REMOVE_OVERRIDE) {
      clearAndRepopulateOverrideList();
      if (musicSettings.overrideList.size === 0) {
        const noOverrides = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No overrides set yet...");
        musicPlayerUI.addItemToTable(Name.Override_Table, noOverrides);
      }
    }
    if (key === SettingsKey.ALL || key === SettingsKey.ADD_EXCLUDED || key === SettingsKey.REMOVE_EXCLUDED) {
      clearAndRepopulateExcludedList();
      if (musicSettings.excludedRandomThemes.size === 0) {
        const noExcluded = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No themes excluded yet...");
        musicPlayerUI.addItemToTable(Name.Excluded_Table, noExcluded);
      }
    }
    // Update UI
    const canUpdateDaySlider = daySlider?.parentElement && isGamePageAndActive();
    if (canUpdateDaySlider) daySlider.parentElement.style.display = alternateThemesBox.checked ? "flex" : "none";
    if (shuffleBtn) shuffleBtn.disabled = musicSettings.randomThemesType === RandomThemeType.NONE;
    // Update player image and hover text
    const currentSounds = isMovePlanner() ? "Sound Effects" : "Tunes";
    if (musicSettings.isPlaying) {
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
  /**
   * The music player UI for the settings.
   */
  const musicPlayerUI = new CustomMenuSettingsUI(ScriptName.MusicPlayer, NEUTRAL_IMG_URL, "Play Tunes");
  // Determine who will catch when the user clicks the play/stop button
  musicPlayerUI.addEventListener("click", onMusicBtnClick);
  var Name;
  (function (Name) {
    Name["Volume"] = "Music Volume";
    Name["SFX_Volume"] = "SFX Volume";
    Name["UI_Volume"] = "UI Volume";
    Name["No_Random"] = "Off";
    Name["All_Random"] = "All Soundtracks";
    Name["Current_Random"] = "Current Soundtrack";
    Name["Shuffle"] = "Shuffle";
    Name["Capture_Progress"] = "Capture Progress SFX";
    Name["Pipe_Seam_SFX"] = "Pipe Seam Attack SFX";
    Name["Restart_Themes"] = "Restart Themes Every Turn";
    Name["Autoplay_Pages"] = "Autoplay Music On Other Pages";
    Name["Alternate_Themes"] = "Alternate Themes";
    Name["Alternate_Day"] = "Alternate Themes Start On Day";
    Name["Add_Override"] = "Add";
    Name["Override_Table"] = "Overrides";
    Name["Excluded_Table"] = "Excluded Random Themes";
  })(Name || (Name = {}));
  var Description;
  (function (Description) {
    Description["Volume"] = "Adjust the volume of the CO theme music, power activations, and power themes.";
    Description["SFX_Volume"] = "Adjust the volume of the unit movement, tag swap, captures, and other unit sounds.";
    Description["UI_Volume"] =
      "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.";
    Description["AW1"] = "Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!";
    Description["AW2"] = "Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.";
    Description["DS"] =
      "Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though.";
    Description["RBC"] = "Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!";
    Description["No_Random"] = "Play the music depending on who the current CO is.";
    Description["All_Random"] = "Play random music every turn from all soundtracks.";
    Description["Current_Random"] = "Play random music every turn from the current soundtrack.";
    Description["Shuffle"] = "Changes the current theme to a new random one.";
    Description["Capture_Progress"] = "Play a sound effect when a unit makes progress capturing a property.";
    Description["Pipe_Seam_SFX"] = "Play a sound effect when a pipe seam is attacked.";
    Description["Restart_Themes"] =
      "Restart themes at the beginning of each turn (including replays). If disabled, themes will continue from where they left off previously.";
    Description["Autoplay_Pages"] = "Autoplay music on other pages like your games or during maintenance.";
    Description["Alternate_Themes"] =
      "Play alternate themes like the Re-Boot Camp factory themes after a certain day. Enable this to be able to select what day alternate themes start.";
    Description["Alternate_Day"] =
      "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?";
    Description["Add_Override"] =
      "Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes.";
    Description["Override_Radio"] = "Only play songs from ";
    Description["Remove_Override"] = "Removes the override for this specific CO.";
    Description["Add_Excluded"] =
      "Add an override for a specific CO to exclude their themes when playing random themes.";
  })(Description || (Description = {}));
  /* ************************************ Left Menu ************************************ */
  const LEFT = MenuPosition.Left;
  /* **** Group: Volume sliders **** */
  const volumeSlider = musicPlayerUI.addSlider(Name.Volume, 0, 1, 0.005, Description.Volume, LEFT);
  const sfxVolumeSlider = musicPlayerUI.addSlider(Name.SFX_Volume, 0, 1, 0.005, Description.SFX_Volume, LEFT);
  const uiVolumeSlider = musicPlayerUI.addSlider(Name.UI_Volume, 0, 1, 0.005, Description.UI_Volume, LEFT);
  volumeSlider?.addEventListener("input", (event) => (musicSettings.volume = parseInputFloat(event)));
  sfxVolumeSlider?.addEventListener("input", (event) => (musicSettings.sfxVolume = parseInputFloat(event)));
  uiVolumeSlider?.addEventListener("input", (event) => (musicSettings.uiVolume = parseInputFloat(event)));
  /* **** Group: Soundtrack radio buttons (AW1, AW2, DS, RBC) AKA GameType **** */
  const soundtrackGroup = "Soundtrack";
  const soundtrackGroupDiv = musicPlayerUI.addGroup(soundtrackGroup, GroupType.Horizontal, LEFT);
  // Radio buttons
  const gameTypeRadioMap = new Map();
  for (const gameType of Object.values(GameType)) {
    const description = Description[gameType];
    const radio = musicPlayerUI.addRadioButton(gameType, soundtrackGroup, description);
    gameTypeRadioMap.set(gameType, radio);
    radio.addEventListener("click", (_e) => (musicSettings.gameType = gameType));
  }
  /* **** Group: Random themes radio buttons **** */
  const randomGroup = "Random Themes";
  const randomGroupDiv = musicPlayerUI.addGroup(randomGroup, GroupType.Horizontal, LEFT);
  // Radio buttons
  const radioNormal = musicPlayerUI.addRadioButton(Name.No_Random, randomGroup, Description.No_Random);
  const radioAllRandom = musicPlayerUI.addRadioButton(Name.All_Random, randomGroup, Description.All_Random);
  const radioCurrentRandom = musicPlayerUI.addRadioButton(Name.Current_Random, randomGroup, Description.Current_Random);
  radioNormal.addEventListener("click", (_e) => (musicSettings.randomThemesType = RandomThemeType.NONE));
  radioAllRandom.addEventListener("click", (_e) => (musicSettings.randomThemesType = RandomThemeType.ALL_THEMES));
  radioCurrentRandom.addEventListener(
    "click",
    (_e) => (musicSettings.randomThemesType = RandomThemeType.CURRENT_SOUNDTRACK),
  );
  const randomRadioMap = new Map([
    [RandomThemeType.NONE, radioNormal],
    [RandomThemeType.ALL_THEMES, radioAllRandom],
    [RandomThemeType.CURRENT_SOUNDTRACK, radioCurrentRandom],
  ]);
  // Random theme shuffle button
  const shuffleBtn = musicPlayerUI.addButton(Name.Shuffle, randomGroup, Description.Shuffle);
  shuffleBtn.addEventListener("click", (_e) => musicSettings.randomizeCO());
  /* **** Group: Sound effect toggle checkboxes **** */
  const toggleGroup = "Extra Options";
  musicPlayerUI.addGroup(toggleGroup, GroupType.Vertical, LEFT);
  // Checkboxes
  const captProgressBox = musicPlayerUI.addCheckbox(Name.Capture_Progress, toggleGroup, Description.Capture_Progress);
  const pipeSeamBox = musicPlayerUI.addCheckbox(Name.Pipe_Seam_SFX, toggleGroup, Description.Pipe_Seam_SFX);
  const restartThemesBox = musicPlayerUI.addCheckbox(Name.Restart_Themes, toggleGroup, Description.Restart_Themes);
  const autoplayPagesBox = musicPlayerUI.addCheckbox(Name.Autoplay_Pages, toggleGroup, Description.Autoplay_Pages);
  const alternateThemesBox = musicPlayerUI.addCheckbox(
    Name.Alternate_Themes,
    toggleGroup,
    Description.Alternate_Themes,
  );
  captProgressBox.addEventListener("click", (_e) => (musicSettings.captureProgressSFX = captProgressBox.checked));
  pipeSeamBox.addEventListener("click", (_e) => (musicSettings.pipeSeamSFX = pipeSeamBox.checked));
  restartThemesBox.addEventListener("click", (_e) => (musicSettings.restartThemes = restartThemesBox.checked));
  autoplayPagesBox.addEventListener("click", (_e) => (musicSettings.autoplayOnOtherPages = autoplayPagesBox.checked));
  alternateThemesBox.addEventListener("click", (_e) => (musicSettings.alternateThemes = alternateThemesBox.checked));
  /* **** Group: Day slider **** */
  const daySlider = musicPlayerUI.addSlider(Name.Alternate_Day, 0, 30, 1, Description.Alternate_Day, LEFT);
  daySlider?.addEventListener("input", (event) => (musicSettings.alternateThemeDay = parseInputInt(event)));
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
  if (isGamePageAndActive()) musicPlayerUI.addCOSelector(addOverrideGroup, Description.Add_Override, onCOSelectorClick);
  // Game type radio buttons
  const overrideGameTypeRadioMap = new Map();
  for (const gameType of Object.values(GameType)) {
    const radio = musicPlayerUI.addRadioButton(gameType, addOverrideGroup, Description.Override_Radio + gameType);
    overrideGameTypeRadioMap.set(gameType, radio);
    radio.checked = true;
  }
  const excludeRadio = musicPlayerUI.addRadioButton("Exclude Random", addOverrideGroup, Description.Add_Excluded);
  // Add override button
  const overrideBtn = musicPlayerUI.addButton(Name.Add_Override, addOverrideGroup, Description.Add_Override);
  overrideBtn.addEventListener("click", (_e) => {
    // Check if it's an exclude
    if (excludeRadio.checked) {
      musicSettings.addExcludedRandomTheme(currentSelectedCO);
      return;
    }
    // Get the selected game type
    let currentGameType;
    for (const [gameType, radio] of overrideGameTypeRadioMap) {
      if (radio.checked) currentGameType = gameType;
    }
    // Add the override
    if (!currentGameType) return;
    musicSettings.addOverride(currentSelectedCO, currentGameType);
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
    displayDiv.addEventListener("click", (_event) => {
      musicSettings.removeOverride(coName);
    });
    overrideDivMap.set(coName, displayDiv);
    musicPlayerUI.addItemToTable(Name.Override_Table, displayDiv);
    return displayDiv;
  }
  function clearAndRepopulateOverrideList() {
    overrideDivMap.forEach((div) => div.remove());
    overrideDivMap.clear();
    musicPlayerUI.clearTable(Name.Override_Table);
    for (const [coName, gameType] of musicSettings.overrideList) {
      addOverrideDisplayDiv(coName, gameType);
    }
  }
  /* **** Group: Not Randomized List **** */
  const excludedListGroup = "Themes Excluded From Randomizer (Click to Remove)";
  musicPlayerUI.addGroup(excludedListGroup, GroupType.Horizontal, RIGHT);
  const excludedListDivMap = new Map();
  musicPlayerUI.addTable(Name.Excluded_Table, tableRows, tableCols, excludedListGroup, Description.Remove_Override);
  function addExcludedDisplayDiv(coName) {
    const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, "");
    displayDiv.addEventListener("click", (_event) => {
      musicSettings.removeExcludedRandomTheme(coName);
    });
    excludedListDivMap.set(coName, displayDiv);
    musicPlayerUI.addItemToTable(Name.Excluded_Table, displayDiv);
    return displayDiv;
  }
  function clearAndRepopulateExcludedList() {
    excludedListDivMap.forEach((div) => div.remove());
    excludedListDivMap.clear();
    musicPlayerUI.clearTable(Name.Excluded_Table);
    for (const coName of musicSettings.excludedRandomThemes) addExcludedDisplayDiv(coName);
  }
  /* ************************************ Version ************************************ */
  musicPlayerUI.addVersion();
  /* ************************************ Disable or hide things in other pages ************************************ */
  if (!isGamePageAndActive()) {
    const parent = musicPlayerUI.getGroup("settings-parent");
    if (parent) parent.style.width = "475px";
    const rightGroup = musicPlayerUI.getGroup(RIGHT);
    if (rightGroup) rightGroup.style.display = "none";
    if (captProgressBox?.parentElement) captProgressBox.parentElement.style.display = "none";
    if (pipeSeamBox?.parentElement) pipeSeamBox.parentElement.style.display = "none";
    if (restartThemesBox?.parentElement) restartThemesBox.parentElement.style.display = "none";
    if (alternateThemesBox?.parentElement) alternateThemesBox.parentElement.style.display = "none";
    if (daySlider?.parentElement) daySlider.parentElement.style.display = "none";
    if (!isMapEditor() && !isMaintenance()) {
      if (soundtrackGroupDiv?.parentElement) soundtrackGroupDiv.parentElement.style.display = "none";
      if (randomGroupDiv?.parentElement) randomGroupDiv.parentElement.style.display = "none";
    }
  }

  /**
   * @file IndexedDB database for caching music files.
   */
  /**
   * The IndexedDB database for caching music files.
   */
  let db = null;
  /**
   * The name of the database.
   */
  const dbName = "awbw_music_player";
  /**
   * The version of the database.
   * This should be incremented whenever the database schema changes.
   */
  const dbVersion = 1.0;
  /**
   * A set of URLs that are queued to be stored in the database.
   * This is used to prevent storing the same URL multiple times while waiting for promises.
   */
  const urlQueue$1 = new Set();
  /**
   * A set of listeners that are called when a music file is replaced in the database.
   */
  const replacementListeners = new Set();
  /**
   * Adds a listener that is called when a music file is replaced in the database.
   * @param fn - The listener to add
   */
  function addDatabaseReplacementListener(fn) {
    replacementListeners.add(fn);
  }
  /**
   * Opens the IndexedDB database for caching music files.
   * @param onOpenOrError - Optional callback for when the database is opened or an error occurs when opening it.
   */
  function openDB() {
    const request = indexedDB.open(dbName, dbVersion);
    return new Promise((resolve, reject) => {
      request.onerror = (event) => reject(event);
      request.onupgradeneeded = (event) => {
        if (!event.target) return reject("No target for database upgrade.");
        // logDebug("Database upgrade needed. Creating object store.");
        const newDB = event.target.result;
        newDB.createObjectStore("music");
      };
      request.onsuccess = (event) => {
        if (!event.target) return reject("No target for database success.");
        db = event.target.result;
        db.onerror = (event) => {
          reject(`Error accessing database: ${event}`);
        };
        resolve();
      };
    });
  }
  /**
   * Attempts to load the music file at the given URL from the database.
   * @param srcURL - The URL of the music file to load
   * @returns - A promise that resolves with the URL of the local music file, or rejects with a reason
   */
  function loadMusicFromDB(srcURL) {
    if (!srcURL || srcURL === "") return Promise.reject("Invalid URL.");
    if (urlQueue$1.has(srcURL)) return Promise.reject("URL is already queued for storage.");
    urlQueue$1.add(srcURL);
    return new Promise((resolve, reject) => {
      // If the database is not open, just fallback to the original URL
      if (!db) return reject("Database is not open.");
      const transaction = db.transaction("music", "readonly");
      const store = transaction.objectStore("music");
      const request = store.get(srcURL);
      request.onsuccess = (event) => {
        urlQueue$1.delete(srcURL);
        // The music file is not in the database, wait for it to be stored and return the new blob URL
        const blob = event.target.result;
        if (!blob) {
          return storeURLInDB(srcURL)
            .then((blob) => resolve(URL.createObjectURL(blob)))
            .catch((reason) => reject(reason));
        }
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      request.onerror = (event) => {
        urlQueue$1.delete(srcURL);
        reject(event);
      };
    });
  }
  /**
   * Stores the given blob in the database with the given URL.
   * @param url - The URL to store the blob under
   * @param blob - The blob to store
   */
  function storeBlobInDB(url, blob) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not open.");
      if (!url || url === "") return reject("Invalid URL.");
      const transaction = db.transaction("music", "readwrite");
      const store = transaction.objectStore("music");
      const request = store.put(blob, url);
      request.onsuccess = () => {
        resolve(blob);
        replacementListeners.forEach((fn) => fn(url));
      };
      request.onerror = (event) => reject(event);
    });
  }
  /**
   * Stores the music file at the given URL in the database.
   * @param url - The URL of the music file to store
   */
  function storeURLInDB(url) {
    if (!db) return Promise.reject("Database not open.");
    if (!url || url === "") return Promise.reject("Invalid URL.");
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => storeBlobInDB(url, blob));
    // .catch((reason) => logError("Error fetching music file to store in database:", reason));
  }
  /**
   * Compares the hashes of the music files stored in the database against the hashes stored on the server.
   * If a hash is different, the music file is replaced in the database.
   * @returns - A promise that resolves when the hashes have been compared
   */
  function checkHashesInDB() {
    if (!db) return Promise.reject("Database not open.");
    // Get the hashes stored in the server
    // logDebug("Fetching hashes from server to compare against local music files.");
    return fetch(HASH_JSON_URL)
      .then((response) => response.json())
      .then((hashes) => compareHashesAndReplaceIfNeeded(hashes));
    // .catch((reason) => logError("Error fetching hashes from server:", reason));
  }
  /**
   * Calculates the MD5 hash of the given blob.
   * @param blob - The blob to calculate the hash of
   * @returns - A promise that resolves with the MD5 hash of the blob
   */
  function getBlobMD5(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event?.target?.result) return reject("FileReader did not load the blob.");
        const md5 = SparkMD5.ArrayBuffer.hash(event.target.result);
        resolve(md5);
      };
      reader.onerror = (event) => reject(event);
      reader.readAsArrayBuffer(blob);
    });
  }
  /**
   * Compares the hashes of the music files stored in the database against the json object of hashes provided.
   * @param hashesJson - The JSON object of hashes to compare against.
   */
  function compareHashesAndReplaceIfNeeded(hashesJson) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not open.");
      if (!hashesJson) return reject("No hashes found in server.");
      // Get all the blobs stored in the database
      const transaction = db.transaction("music", "readonly");
      const store = transaction.objectStore("music");
      const request = store.openCursor();
      request.onerror = (event) => reject(event);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        // All entries have been checked
        if (!cursor) return resolve();
        const url = cursor.key;
        const blob = cursor.value;
        const serverHash = hashesJson[url];
        cursor.continue();
        // logDebug("Checking hash for", url);
        if (!serverHash) {
          logDebug("No hash found in server for", url);
          return;
        }
        getBlobMD5(blob)
          .then((hash) => {
            if (hash === serverHash) return;
            // The hash is different, so we need to replace the song
            return storeURLInDB(url);
          })
          .catch((reason) => logError(`Error storing new version of ${url} in database: ${reason}`));
      };
    });
  }

  /**
   * @file All the music-related functions for the music player.
   */
  // Type definitions for Howler
  // Until howler gets modernized (https://github.com/goldfire/howler.js/pull/1518)
  // TODO: DEBUGGING
  // window.setInterval(() => {
  //   for (const key of audioMap.keys()) {
  //     const audio = audioMap.get(key);
  //     if (!audio) continue;
  //     const count = audio._getSoundIds().length;
  //     if (count > 1) {
  //       const playingCount = audio._getSoundIds().filter((id) => audio.playing(id)).length;
  //       if (playingCount > 1) logDebug("Multiple instances of", key, count, playingCount);
  //     }
  //   }
  // }, 500);
  /**
   * The URL of the current theme that is playing.
   */
  let currentThemeKey = "";
  /**
   * Map containing the audio players for all themes and SFX.
   * The keys are the audio URLs.
   */
  const audioMap = new Map();
  const audioIDMap = new Map();
  /**
   * Set of URLs that are queued to be pre-loaded.
   * This is used to prevent pre-loading the same URL multiple times while waiting for promises.
   */
  const urlQueue = new Set();
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
   * Number of loops that the current theme has done.
   */
  let currentLoops = 0;
  /**
   * If set to true, calls to playMusic() will set a timer for {@link delayThemeMS} milliseconds after which the music will play again.
   */
  let currentlyDelaying = false;
  // Listen for setting changes to update the internal variables accordingly
  addSettingsChangeListener(onSettingsChange);
  // Listens for when the database downloads a new song
  addDatabaseReplacementListener((url) => {
    const audio = audioMap.get(url);
    if (!audio) return;
    // Song update due to hash change
    log("A new version of", url, " is available. Replacing the old version.");
    if (audio.playing()) audio.stop();
    urlQueue.delete(url);
    audioMap.delete(url);
    audioIDMap.delete(url);
    preloadURL(url)
      .catch((reason) => logError(reason))
      .finally(() => playThemeSong());
  });
  /**
   * Event handler that pauses an audio as soon as it gets loaded.
   * @param event - The event that triggered this handler. Usually "canplaythrough".
   */
  function whenAudioLoadsPauseIt(event) {
    event.target.pause();
  }
  /**
   * Event handler that gets called when a theme ends or loops.
   * @param srcURL - URL of the theme that ended or looped.
   */
  function onThemeEndOrLoop(srcURL) {
    currentLoops++;
    if (currentThemeKey !== srcURL) {
      logError("Playing more than one theme at a time! Please report this bug!", srcURL);
      return;
    }
    // The song has a special loop, so mark it in the special loop map as having done one loop
    if (hasSpecialLoop(srcURL)) {
      const loopURL = srcURL.replace(".ogg", "-loop.ogg");
      specialLoopMap.set(srcURL, loopURL);
      playThemeSong();
    }
    if (
      srcURL === "https://developerjose.netlify.app/music/t-victory.ogg" /* SpecialTheme.Victory */ ||
      srcURL === "https://developerjose.netlify.app/music/t-defeat.ogg" /* SpecialTheme.Defeat */
    ) {
      if (currentLoops >= 5)
        playMusicURL("https://developerjose.netlify.app/music/t-co-select.ogg" /* SpecialTheme.COSelect */);
    }
    // The song ended and we are playing random themes, so switch to the next random theme
    if (musicSettings.randomThemesType !== RandomThemeType.NONE) {
      musicSettings.randomizeCO();
      playThemeSong();
    }
  }
  /**
   * Event handler that gets called when a theme starts playing.
   * @param audio - The audio player that started playing.
   * @param srcURL - URL of the theme that started playing.
   */
  function onThemePlay(audio, srcURL) {
    currentLoops = 0;
    audio.volume(getVolumeForURL(srcURL));
    // We start from the beginning if any of these conditions are met:
    // 1. The user wants to restart themes
    // 2. It's a power theme
    // 3. We are starting a new random theme
    // AND we are on the game page AND the song has played for a bit
    const isPowerTheme = musicSettings.themeType !== ThemeType.REGULAR;
    const isRandomTheme = musicSettings.randomThemesType !== RandomThemeType.NONE;
    const shouldRestart = musicSettings.restartThemes || isPowerTheme || isRandomTheme;
    const currentPosition = audio.seek();
    if (shouldRestart && isGamePageAndActive() && currentPosition > 0.1) {
      audio.seek(0);
    }
    // The current theme is not this one, so pause this one and let the other one play
    // This check makes sure we aren't playing more than one song at the same time
    if (currentThemeKey !== srcURL && audio.playing()) {
      audio.pause();
      playThemeSong();
    }
    // There's multiple instances this sound playing so stop the extra ones
    const audioID = audioIDMap.get(srcURL);
    if (!audioID) return;
    for (const id of audio._getSoundIds()) {
      if (id !== audioID) audio.stop(id);
    }
  }
  /**
   * Pre-loads the audio from the given URL and returns a promise that resolves with an audio player.
   * If the audio is not in the database, it will be loaded from the original URL.
   * @param srcURL - URL of the audio to preload.
   * @returns - Promise that resolves with the audio player of the audio in the database or the original URL.
   */
  function preloadURL(srcURL) {
    // Someone already tried to preload this audio
    if (urlQueue.has(srcURL)) return Promise.reject(`Cannot preload ${srcURL}, it is already queued for pre-loading.`);
    urlQueue.add(srcURL);
    // We already have this audio loaded
    if (audioMap.has(srcURL)) return Promise.reject(`Cannot preload ${srcURL}, it is already pre-loaded.`);
    // Preload the audio from the database if possible
    return loadMusicFromDB(srcURL).then(
      (localCacheURL) => createNewAudio(srcURL, localCacheURL),
      (reason) => {
        logDebug(reason, srcURL);
        return createNewAudio(srcURL, srcURL);
      },
    );
    /**
     * Creates a new audio player for the given URL.
     * @param srcURL - URL of the audio to create a player for.
     * @returns - The new audio player.
     */
    function createNewAudio(srcURL, cacheURL) {
      const audioInMap = audioMap.get(srcURL);
      if (audioInMap !== undefined) {
        logError("Race Condition! Please report this bug!", srcURL);
        return audioInMap;
      }
      // Shared audio settings for all audio players
      const audio = new Howl({
        src: [cacheURL],
        format: ["ogg"],
        volume: getVolumeForURL(srcURL),
        // Redundant event listeners to ensure the audio is always at the correct volume
        onplay: (_id) => audio.volume(getVolumeForURL(srcURL)),
        onload: (_id) => audio.volume(getVolumeForURL(srcURL)),
        onseek: (_id) => audio.volume(getVolumeForURL(srcURL)),
        onpause: (_id) => audio.volume(getVolumeForURL(srcURL)),
        onloaderror: (_id, error) => logError("Error loading audio:", srcURL, error),
        onplayerror: (_id, error) => logError("Error playing audio:", srcURL, error),
      });
      audioMap.set(srcURL, audio);
      // Sound Effects
      if (srcURL.includes("sfx")) return audio;
      // Themes
      audio.on("play", () => onThemePlay(audio, srcURL));
      audio.on("load", () => playThemeSong());
      audio.on("end", () => onThemeEndOrLoop(srcURL));
      return audio;
    }
  }
  /**
   * Changes the current song to the given new song, stopping the old song if necessary.
   * @param srcURL - URL of song to play.
   * @param startFromBeginning - Whether to start from the beginning.
   */
  function playMusicURL(srcURL) {
    // This song has a special loop, and it's time to play it
    const specialLoopURL = specialLoopMap.get(srcURL);
    if (specialLoopURL) srcURL = specialLoopURL;
    // We want to play a new song, so pause the previous one and save the new current song
    if (srcURL !== currentThemeKey) {
      stopThemeSong();
      currentThemeKey = srcURL;
    }
    // The song isn't loaded yet, so create a new audio player for it
    if (!audioMap.has(srcURL)) {
      // No one else is preloading this audio, so preload it
      if (!urlQueue.has(srcURL)) preloadURL(srcURL).catch((reason) => logError(reason));
      return;
    }
    const nextSong = audioMap.get(srcURL);
    if (!nextSong) return;
    // Loop all themes except for the special ones
    nextSong.loop(!hasSpecialLoop(srcURL));
    nextSong.volume(getVolumeForURL(srcURL));
    // Play the song if it's not already playing
    if (!nextSong.playing() && musicSettings.isPlaying) {
      log("Now Playing: ", srcURL, " | Cached? =", nextSong._src !== srcURL);
      const newID = nextSong.play();
      if (!newID) return;
      audioIDMap.set(srcURL, newID);
    }
  }
  /**
   * Plays the given sound by creating a new instance of it.
   * @param srcURL - URL of the sound to play.
   * @param volume - Volume at which to play this sound.
   */
  function playOneShotURL(srcURL, volume) {
    if (!musicSettings.isPlaying) return;
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
  function playThemeSong() {
    if (!musicSettings.isPlaying) return;
    // Someone wants us to delay playing the theme, so wait a little bit then play
    // Ignore all calls to play() while delaying, we are guaranteed to play eventually
    if (currentlyDelaying) return;
    let gameType = undefined;
    let coName = currentPlayer.coName;
    // Don't randomize the victory and defeat themes
    const isEndTheme = coName === "victory" || coName === "defeat";
    const isRandomTheme = musicSettings.randomThemesType !== RandomThemeType.NONE;
    if (isRandomTheme && !isEndTheme) {
      coName = musicSettings.currentRandomCO;
      // The user wants the random themes from all soundtracks, so randomize the game type
      if (musicSettings.randomThemesType === RandomThemeType.ALL_THEMES) gameType = musicSettings.currentRandomGameType;
    }
    // For pages with no COs that aren't using the random themes, play the stored theme if any.
    if (!coName) {
      if (!currentThemeKey || currentThemeKey === "") return;
      playMusicURL(currentThemeKey);
      return;
    }
    playMusicURL(getMusicURL(coName, gameType));
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
      window.setTimeout(() => {
        currentlyDelaying = false;
        playThemeSong();
      }, delayMS);
      currentlyDelaying = true;
    }
    // Can't stop if there's no loaded music
    if (!audioMap.has(currentThemeKey)) return;
    // Can't stop if we are already paused
    const currentTheme = audioMap.get(currentThemeKey);
    if (!currentTheme) return;
    // The song is loaded and playing, so pause it
    logDebug("Pausing: ", currentThemeKey);
    currentTheme.pause();
  }
  /**
   * Plays the movement sound of the given unit.
   * @param unitId - The ID of the unit who is moving.
   */
  function playMovementSound(unitId) {
    if (!musicSettings.isPlaying) return;
    // The audio hasn't been preloaded for this unit
    if (!unitIDAudioMap.has(unitId)) {
      const unitName = getUnitName(unitId);
      if (!unitName) return;
      const movementSoundURL = getMovementSoundURL(unitName);
      if (!movementSoundURL) {
        logError("No movement sound for", unitName);
        return;
      }
      // logDebug("Creating new audio player for:", unitId, unitName, movementSoundURL);
      unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
    }
    // Restart the audio and then play it
    const movementAudio = unitIDAudioMap.get(unitId);
    if (!movementAudio) return;
    movementAudio.currentTime = 0;
    movementAudio.loop = false;
    movementAudio.volume = musicSettings.sfxVolume;
    movementAudio.play();
    // logDebug("Movement sound for", unitId, "is playing", movementAudio);
  }
  /**
   * Stops the movement sound of a given unit if it's playing.
   * @param unitId - The ID of the unit whose movement sound will be stopped.
   * @param rolloff - (Optional) Whether to play the rolloff sound or not, defaults to true.
   */
  function stopMovementSound(unitId, rolloff = true) {
    // Can't stop if there's nothing playing
    if (!musicSettings.isPlaying) return;
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
    const unitName = getUnitName(unitId);
    if (!rolloff || !unitName) return;
    if (hasMovementRollOff(unitName)) {
      const audioURL = getMovementRollOffURL(unitName);
      playOneShotURL(audioURL, musicSettings.sfxVolume);
    }
  }
  /**
   * Plays the given sound effect.
   * @param sfx - Specific {@link GameSFX} to play.
   */
  function playSFX(sfx) {
    if (!musicSettings.isPlaying) return;
    // Check the user settings to see if we should play this sound effect
    if (!musicSettings.captureProgressSFX && sfx === GameSFX.unitCaptureProgress) return;
    if (!musicSettings.pipeSeamSFX && sfx === GameSFX.unitAttackPipeSeam) return;
    const sfxURL = getSoundEffectURL(sfx);
    // This sound effect hasn't been loaded yet
    if (!audioMap.has(sfxURL)) {
      preloadURL(sfxURL)
        .then(() => playSFX(sfx))
        .catch((reason) => logError(reason));
      return;
    }
    // The sound is loaded, so play it
    const audio = audioMap.get(sfxURL);
    if (!audio) return;
    audio.volume(getVolumeForURL(sfxURL));
    audio.seek(0);
    // No need to start another instance if it's already playing
    if (audio.playing()) return;
    const newID = audio.play();
    if (!newID) return;
    audioIDMap.set(sfxURL, newID);
    // audio.fade(0, musicSettings.sfxVolume, audio.duration() * 1000);
  }
  /**
   * Stops all music, sound effects, and audios.
   */
  function stopAllSounds() {
    // Stop current music
    stopThemeSong();
    // Stop unit sounds
    stopAllMovementSounds();
    // Stop all other music, just for redundancy
    for (const audio of audioMap.values()) {
      if (audio.playing()) audio.pause();
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
    logDebug("Pre-loading common audio", audioList);
    preloadAudioList(audioList, afterPreloadFunction);
  }
  /**
   * Preloads the given list of songs and adds them to the {@link urlAudioMap}.
   * @param audioURLs - Set of URLs of songs to preload.
   * @param afterPreloadFunction - Function to call after all songs are preloaded.
   */
  function preloadAudioList(audioURLs, afterPreloadFunction = () => {}) {
    // Event handler for when an audio is loaded
    let numLoadedAudios = 0;
    const onAudioPreload = (action, url) => {
      numLoadedAudios++;
      // Update UI
      const loadPercentage = (numLoadedAudios / audioURLs.size) * 100;
      musicPlayerUI.setProgress(loadPercentage);
      // All the audio from the list has been loaded
      if (numLoadedAudios >= audioURLs.size) {
        numLoadedAudios = 0;
        if (afterPreloadFunction) afterPreloadFunction();
      }
      if (action === "error") {
        log(`Could not pre-load: ${url}. This might not be a problem, the audio may still play normally later.`);
        audioMap.delete(url);
        return;
      }
      // TODO: Debugging purposes
      // if (hasSpecialLoop(audio.src)) audio.currentTime = audio.duration * 0.94;
      if (!audioMap.has(url)) {
        logError("Race condition on pre-load! Please report this bug!", url);
      }
    };
    // Pre-load all audios in the list
    audioURLs.forEach((url) => {
      // This audio has already been loaded before, so skip it
      if (audioMap.has(url)) {
        numLoadedAudios++;
        return;
      }
      // Try to get the audio from the cache, if not, load it from the original URL
      preloadURL(url)
        .then((audio) => {
          audio.once("load", () => onAudioPreload("load", url));
          audio.once("loaderror", () => onAudioPreload("error", url));
        })
        .catch((_reason) => onAudioPreload("error", url));
    });
  }
  /**
   * Gets the volume for the given URL based on the type of audio it is.
   * @param url - URL of the audio to get the volume for.
   * @returns - The volume to play the audio at.
   */
  function getVolumeForURL(url) {
    if (url.startsWith("blob:") || !url.startsWith("https://")) {
      logError("Blob URL when trying to get volume for", url);
      return musicSettings.volume;
    }
    if (url.includes("sfx")) {
      if (url.includes("ui")) return musicSettings.uiVolume;
      if (url.includes("power") && !url.includes("available")) return musicSettings.volume;
      return musicSettings.sfxVolume;
    }
    return musicSettings.volume;
  }
  /**
   * Adds event listeners to play or pause the music when the window focus changes.
   */
  function playOrPauseWhenWindowFocusChanges() {
    window.addEventListener("blur", () => {
      if (musicSettings.isPlaying) stopAllSounds();
    });
    window.addEventListener("focus", () => {
      if (musicSettings.isPlaying) playThemeSong();
    });
  }
  /**
   * Updates the internal audio components to match the current music player settings when the settings change.
   * @param key - Key of the setting which has been changed.
   * @param isFirstLoad - Whether this is the first time the settings are being loaded.
   */
  function onSettingsChange(key, isFirstLoad) {
    // Don't do anything if this is the first time the settings are being loaded
    if (isFirstLoad) return;
    switch (key) {
      case SettingsKey.ADD_OVERRIDE:
      case SettingsKey.REMOVE_OVERRIDE:
      case SettingsKey.OVERRIDE_LIST:
      case SettingsKey.CURRENT_RANDOM_CO:
      case SettingsKey.IS_PLAYING:
        // case "restartThemes":
        if (musicSettings.isPlaying) {
          playThemeSong();
        } else {
          stopAllSounds();
        }
        break;
      case SettingsKey.GAME_TYPE:
      case SettingsKey.ALTERNATE_THEME_DAY:
      case SettingsKey.ALTERNATE_THEMES:
        window.setTimeout(() => playThemeSong(), 500);
        break;
      case SettingsKey.THEME_TYPE: {
        // const restartMusic = musicSettings.themeType !== SettingsThemeType.REGULAR;
        playThemeSong();
        break;
      }
      case SettingsKey.REMOVE_EXCLUDED:
        if (musicSettings.excludedRandomThemes.size === 27) {
          musicSettings.randomizeCO();
        }
        playThemeSong();
        break;
      case SettingsKey.EXCLUDED_RANDOM_THEMES:
      case SettingsKey.ADD_EXCLUDED:
        if (musicSettings.excludedRandomThemes.has(musicSettings.currentRandomCO)) {
          musicSettings.randomizeCO();
        }
        playThemeSong();
        break;
      case SettingsKey.RANDOM_THEMES_TYPE: {
        // Back to normal themes
        const randomThemes = musicSettings.randomThemesType !== RandomThemeType.NONE;
        if (!randomThemes) {
          playThemeSong();
          return;
        }
        // We want a new random theme
        musicSettings.randomizeCO();
        playThemeSong();
        break;
      }
      case SettingsKey.VOLUME: {
        // Adjust the volume of the current theme
        const currentTheme = audioMap.get(currentThemeKey);
        if (currentTheme) currentTheme.volume(musicSettings.volume);
        // Adjust the volume once we can
        if (!currentTheme) {
          const intervalID = window.setInterval(() => {
            const currentTheme = audioMap.get(currentThemeKey);
            if (currentTheme) {
              currentTheme.volume(musicSettings.volume);
              clearInterval(intervalID);
            }
          });
        }
        // Adjust all theme volumes
        for (const srcURL of audioMap.keys()) {
          const audio = audioMap.get(srcURL);
          if (audio) audio.volume(getVolumeForURL(srcURL));
        }
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
  function getShowEndGameScreenFn() {
    return typeof showEndGameScreen !== "undefined" ? showEndGameScreen : null;
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
  function getEliminationFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Elimination : null;
  }
  function getPowerFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Power : null;
  }
  function getGameOverFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.GameOver : null;
  }
  function getResignFn() {
    return typeof actionHandlers !== "undefined" ? actionHandlers.Resign : null;
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
  /**
   * Enum representing the type of menu that is currently open, if any.
   * @enum {string}
   */
  var MenuOpenType;
  (function (MenuOpenType) {
    MenuOpenType["None"] = "None";
    MenuOpenType["DamageSquare"] = "DamageSquare";
    MenuOpenType["Regular"] = "Regular";
    MenuOpenType["UnitSelect"] = "UnitSelect";
  })(MenuOpenType || (MenuOpenType = {}));
  /**
   * The current type of menu that is open, if any.
   */
  let currentMenuType = MenuOpenType.None;
  /**
   * Map of unit IDs to their visibility status. Used to check if a unit that was visible disappeared in the fog.
   */
  const visibilityMap = new Map();
  /**
   * Map of unit IDs to their movement responses. Used to check if a unit got trapped.
   */
  const movementResponseMap = new Map();
  /**
   * Map of damage squares that have been clicked.
   * Used to check if the user clicked on a damage square twice to finalize an attack.
   */
  const clickedDamageSquaresMap = new Map();
  /* **Store a copy of all the original functions we are going to override** */
  const ahQueryTurn = getQueryTurnFn();
  const ahShowEventScreen = getShowEventScreenFn();
  const ahShowEndGameScreen = getShowEndGameScreenFn();
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
  const ahElimination = getEliminationFn();
  const ahPower = getPowerFn();
  const ahGameOver = getGameOverFn();
  const ahResign = getResignFn();
  /**
   * Intercept functions and add our own handlers to the website.
   */
  function addHandlers() {
    if (isMaintenance()) return;
    // Global handlers
    addUpdateCursorObserver(onCursorMove);
    // Specific page handlers
    if (isMapEditor()) {
      return;
    }
    if (isMovePlanner()) {
      return;
    }
    if (isGamePageAndActive()) {
      addReplayHandlers();
      addGameHandlers();
      return;
    }
  }
  /**
   * Syncs the music with the game state. Does not randomize the COs.
   */
  function syncMusic() {
    musicSettings.themeType = getCurrentThemeType();
    playThemeSong();
    window.setTimeout(() => {
      playThemeSong();
    }, 500);
  }
  /**
   * Refreshes everything needed for the music when finishing a turn. Also randomizes the COs if needed.
   * @param playDelayMS - The delay in milliseconds before the theme song starts playing.
   */
  function refreshMusicForNextTurn(playDelayMS = 0) {
    // It's a new turn, so we need to clear the visibility map, randomize COs, and play the theme song
    visibilityMap.clear();
    musicSettings.randomizeCO();
    musicSettings.themeType = getCurrentThemeType();
    window.setTimeout(() => {
      musicSettings.themeType = getCurrentThemeType();
      playThemeSong();
      window.setTimeout(playThemeSong, 250);
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
    // Keep the music in sync, we do not need to handle turn changes because onQueryTurn will handle that
    replayBackwardActionBtn.addEventListener("click", syncMusic);
    replayForwardActionBtn.addEventListener("click", syncMusic);
    replayForwardBtn.addEventListener("click", syncMusic);
    replayBackwardBtn.addEventListener("click", syncMusic);
    replayDaySelectorCheckBox.addEventListener("change", syncMusic);
    replayCloseBtn.addEventListener("click", syncMusic);
    // Stop all movement sounds when we go backwards on action, open a replay, or close a replay
    replayBackwardActionBtn.addEventListener("click", stopAllMovementSounds);
    replayOpenBtn.addEventListener("click", stopAllMovementSounds);
    replayCloseBtn.addEventListener("click", stopAllMovementSounds);
    // onQueryTurn isn't called when closing the replay viewer, so change the music for the turn change here
    replayCloseBtn.addEventListener("click", () => refreshMusicForNextTurn(500));
  }
  /**
   * Add all handlers that will intercept clicks and functions during a game.
   */
  function addGameHandlers() {
    // updateCursor = onCursorMove;
    queryTurn = onQueryTurn;
    showEventScreen = onShowEventScreen;
    showEndGameScreen = onShowEndGameScreen;
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
    actionHandlers.Elimination = onElimination;
    actionHandlers.Power = onPower;
    actionHandlers.GameOver = onGameOver;
    actionHandlers.Resign = onResign;
    addConnectionErrorObserver(onConnectionError);
  }
  function onCursorMove(cursorX, cursorY) {
    // ahCursorMove?.apply(ahCursorMove, [cursorX, cursorY]);
    if (!musicSettings.isPlaying) return;
    // debug("Cursor Move", cursorX, cursorY);
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
    if (!musicSettings.isPlaying) return result;
    // log("Query Turn", gameId, turn, turnPId, turnDay, replay, initial);
    refreshMusicForNextTurn(250);
    return result;
  }
  function onShowEventScreen(event) {
    ahShowEventScreen?.apply(ahShowEventScreen, [event]);
    if (!musicSettings.isPlaying) return;
    // debug("Show Event Screen", event);
    if (hasGameEnded()) {
      refreshMusicForNextTurn();
      return;
    }
    playThemeSong();
    window.setTimeout(playThemeSong, 500);
  }
  function onShowEndGameScreen(event) {
    ahShowEndGameScreen?.apply(ahShowEndGameScreen, [event]);
    if (!musicSettings.isPlaying) return;
    // debug("Show End Game Screen", event);
    refreshMusicForNextTurn();
  }
  function onOpenMenu(menu, x, y) {
    ahOpenMenu?.apply(openMenu, [menu, x, y]);
    if (!musicSettings.isPlaying) return;
    // debug("Open Menu", menu, x, y);
    currentMenuType = MenuOpenType.Regular;
    playSFX(GameSFX.uiMenuOpen);
    const menuOptions = document.getElementsByClassName("menu-option");
    for (let i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseenter", (_e) => playSFX(GameSFX.uiMenuMove));
      menuOptions[i].addEventListener("click", (event) => {
        const target = event.target;
        if (!target) return;
        // Check if we clicked on a unit we cannot buy
        if (
          target.classList.contains("forbidden") ||
          target.parentElement?.classList.contains("forbidden") ||
          target.parentElement?.parentElement?.classList.contains("forbidden") ||
          target.parentElement?.parentElement?.parentElement?.classList.contains("forbidden")
        ) {
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
    if (!musicSettings.isPlaying) return;
    const isMenuOpen = currentMenuType !== MenuOpenType.None;
    // debug("CloseMenu", currentMenuType, isMenuOpen);
    if (isMenuOpen) {
      playSFX(GameSFX.uiMenuClose);
      clickedDamageSquaresMap.clear();
      currentMenuType = MenuOpenType.None;
    }
  }
  function onCreateDamageSquares(attackerUnit, unitsInRange, movementInfo, movingUnit) {
    ahCreateDamageSquares?.apply(createDamageSquares, [attackerUnit, unitsInRange, movementInfo, movingUnit]);
    if (!musicSettings.isPlaying) return;
    // debug("Create Damage Squares", attackerUnit, unitsInRange, movementInfo, movingUnit);
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
    if (!musicSettings.isPlaying) return;
    // debug("Unit Click", clicked);
    // Check if we clicked on a waited unit or an enemy unit, if so, no more actions can be taken
    const unitInfo = getUnitInfo(Number(clicked.id));
    if (!unitInfo) return;
    const myID = getMyID();
    const isUnitWaited = hasUnitMovedThisTurn(unitInfo.units_id);
    const isMyUnit = unitInfo?.units_players_id === myID;
    const isMyTurn = currentTurn === myID;
    const canActionsBeTaken = !isUnitWaited && isMyUnit && isMyTurn && !isReplayActive();
    // If action can be taken, then we can cancel out of that action
    currentMenuType = canActionsBeTaken ? MenuOpenType.UnitSelect : MenuOpenType.None;
    playSFX(GameSFX.uiUnitSelect);
  }
  function onUnitWait(unitId) {
    ahWait?.apply(waitUnit, [unitId]);
    if (!musicSettings.isPlaying) return;
    // debug("Wait", unitId, getUnitName(unitId));
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
    if (!musicSettings.isPlaying) return;
    // debug("AnimUnit", path, unitId, unitSpan, unitTeam, viewerTeam, i);
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
      window.setTimeout(() => stopMovementSound(unitId, false), 1000);
    }
  }
  function onAnimExplosion(unit) {
    ahAnimExplosion?.apply(animExplosion, [unit]);
    if (!musicSettings.isPlaying) return;
    // debug("Exploded", unit);
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
    if (!musicSettings.isPlaying) return;
    // debug("Fog", x, y, mType, neighbours, unitVisible, change, delay);
    const unitInfo = getUnitInfoFromCoords(x, y);
    if (!unitInfo) return;
    if (change === "Add") {
      window.setTimeout(() => stopMovementSound(unitInfo.units_id, true), delay);
    }
  }
  function onFire(response) {
    if (!musicSettings.isPlaying) {
      ahFire?.apply(actionHandlers.Fire, [response]);
      return;
    }
    // debug("Fire", response);
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
    window.setTimeout(() => {
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
    window.setTimeout(wiggleAnimation, startDelay);
  }
  function onAttackSeam(response) {
    ahAttackSeam?.apply(actionHandlers.AttackSeam, [response]);
    if (!musicSettings.isPlaying) return;
    // debug("AttackSeam", response);
    const seamWasDestroyed = response.seamHp <= 0;
    // Pipe wiggle animation
    if (areAnimationsEnabled()) {
      const x = response.seamX;
      const y = response.seamY;
      const pipeSeamInfo = getBuildingInfo(x, y);
      if (!pipeSeamInfo) return;
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
    window.setTimeout(() => playSFX(GameSFX.unitAttackPipeSeam), attackDelayMS);
  }
  function onMove(response, loadFlag) {
    ahMove?.apply(actionHandlers.Move, [response, loadFlag]);
    if (!musicSettings.isPlaying) return;
    // debug("Move", response, loadFlag);
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
    if (!musicSettings.isPlaying) return;
    // debug("Capt", data);
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
    if (!musicSettings.isPlaying) return;
    // debug("Build", data);
    const myID = getMyID();
    const isMyBuild = data.newUnit.units_players_id == myID;
    const isReplay = isReplayActive();
    if (!isMyBuild || isReplay) playSFX(GameSFX.unitSupply);
  }
  function onLoad(data) {
    ahLoad?.apply(actionHandlers.Load, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Load", data);
    playSFX(GameSFX.unitLoad);
  }
  function onUnload(data) {
    ahUnload?.apply(actionHandlers.Unload, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Unload", data);
    playSFX(GameSFX.unitUnload);
  }
  function onSupply(data) {
    ahSupply?.apply(actionHandlers.Supply, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Supply", data);
    // We could play the sfx for each supplied unit in the list
    // but instead we decided to play the supply sound once.
    playSFX(GameSFX.unitSupply);
  }
  function onRepair(data) {
    ahRepair?.apply(actionHandlers.Repair, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Repair", data);
    playSFX(GameSFX.unitSupply);
  }
  function onHide(data) {
    ahHide?.apply(actionHandlers.Hide, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Hide", data);
    playSFX(GameSFX.unitHide);
    stopMovementSound(data.unitId);
  }
  function onUnhide(data) {
    ahUnhide?.apply(actionHandlers.Unhide, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Unhide", data);
    playSFX(GameSFX.unitUnhide);
    stopMovementSound(data.unitId);
  }
  function onJoin(data) {
    ahJoin?.apply(actionHandlers.Join, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Join", data);
    stopMovementSound(data.joinID);
    stopMovementSound(data.joinedUnit.units_id);
  }
  function onLaunch(data) {
    ahLaunch?.apply(actionHandlers.Launch, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Launch", data);
    playSFX(GameSFX.unitMissileSend);
    window.setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
  }
  function onNextTurn(data) {
    ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("NextTurn", data);
    if (data.swapCos) {
      playSFX(GameSFX.tagSwap);
    }
    refreshMusicForNextTurn();
  }
  function onElimination(data) {
    ahElimination?.apply(actionHandlers.Elimination, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Elimination", data);
    // Play the elimination sound
    refreshMusicForNextTurn();
  }
  function onGameOver() {
    ahGameOver?.apply(actionHandlers.GameOver, []);
    if (!musicSettings.isPlaying) return;
    // debug("GameOver");
    refreshMusicForNextTurn();
  }
  function onResign(data) {
    ahResign?.apply(actionHandlers.Resign, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Resign", data);
    refreshMusicForNextTurn();
  }
  function onPower(data) {
    ahPower?.apply(actionHandlers.Power, [data]);
    if (!musicSettings.isPlaying) return;
    // debug("Power", data);
    // Remember, these are in title case with spaces like "Colin" or "Von Bolt"
    const coName = data.coName;
    const isBH = isBlackHoleCO(coName);
    const isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;
    // Update the theme type
    musicSettings.themeType = isSuperCOPower ? ThemeType.SUPER_CO_POWER : ThemeType.CO_POWER;
    switch (musicSettings.gameType) {
      case GameType.AW1:
        // Advance Wars 1 will use the same sound for both CO and Super CO power activations
        playSFX(GameSFX.powerActivateAW1COP);
        stopThemeSong(4500);
        return;
      case GameType.AW2:
      case GameType.DS:
      case GameType.RBC: {
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
      window.setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
    }
  }
  function onConnectionError(closeMsg) {
    closeMsg = closeMsg.toLowerCase();
    if (closeMsg.includes("connected to another game")) stopThemeSong();
  }

  /**
   * @file Main script that loads everything for the AWBW Improved Music Player userscript.
   *
   * @TODO - More map editor sound effects
   */
  /******************************************************************
   * Functions
   ******************************************************************/
  /**
   * Where should we place the music player UI?
   */
  function getMenu() {
    if (isMaintenance()) return document.querySelector("#main");
    if (isMapEditor()) return document.querySelector("#replay-misc-controls");
    if (isMovePlanner()) return document.querySelector("#map-controls-container");
    if (isYourGames()) return document.querySelector("#nav-options");
    return document.querySelector("#game-map-menu")?.parentNode;
  }
  /**
   * Adjust the music player for the Live Queue page.
   */
  function onLiveQueue() {
    log("Live Queue detected...");
    const addMusicFn = () => {
      // Check if the parent popup is created and visible
      const blockerPopup = getLiveQueueBlockerPopup();
      if (!blockerPopup) return false;
      if (blockerPopup.style.display === "none") return false;
      // Now make sure the internal popup is created
      const popup = getLiveQueueSelectPopup();
      if (!popup) return false;
      // Get the div with "Match starts in ...."
      const box = popup.querySelector(".flex.row.hv-center");
      if (!box) return false;
      // Prepend the music player UI to the box
      musicPlayerUI.addToAWBWPage(box, true);
      musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;
      playMusicURL("https://developerjose.netlify.app/music/t-co-select.ogg" /* SpecialTheme.COSelect */);
      allowSettingsToBeSaved();
      playOrPauseWhenWindowFocusChanges();
      return true;
    };
    const checkStillActiveFn = () => {
      const blockerPopup = getLiveQueueBlockerPopup();
      return blockerPopup?.style.display !== "none";
    };
    const addPlayerIntervalID = window.setInterval(() => {
      if (!addMusicFn()) return;
      // We don't need to add the music player anymore
      clearInterval(addPlayerIntervalID);
      // Now we need to check if we need to pause/resume the music because the player left/rejoined
      // We will do this indefinitely until eventually the player accepts a match or leaves the page
      window.setInterval(() => {
        // We are still in the CO select, play the music
        if (checkStillActiveFn()) playThemeSong();
        // We are not in the CO select, stop the music
        else stopThemeSong();
      }, 500);
    }, 500);
  }
  /**
   * Adjust the music player for the maintenance page.
   */
  function onMaintenance() {
    log("Maintenance detected, playing music...");
    musicPlayerUI.openContextMenu();
    musicSettings.randomThemesType = RandomThemeType.NONE;
    playMusicURL("https://developerjose.netlify.app/music/t-maintenance.ogg" /* SpecialTheme.Maintenance */);
    allowSettingsToBeSaved();
  }
  /**
   * Adjust the music player for the Move Planner page.
   */
  function onMovePlanner() {
    log("Move Planner detected");
    musicSettings.isPlaying = true;
    allowSettingsToBeSaved();
  }
  /**
   * Adjust the music player for the Your Games and Your Turn pages.
   */
  function onIsYourGames() {
    log("Your Games detected, playing music...");
    playMusicURL("https://developerjose.netlify.app/music/t-mode-select.ogg" /* SpecialTheme.ModeSelect */);
    allowSettingsToBeSaved();
    playOrPauseWhenWindowFocusChanges();
  }
  /**
   * Adjust the music player for the map editor page.
   */
  function onMapEditor() {
    playOrPauseWhenWindowFocusChanges();
  }
  /**
   * Whether the music player has been initialized or not.
   */
  let isMusicPlayerInitialized = false;
  /**
   * Initializes the music player script by setting everything up.
   */
  function initializeMusicPlayer() {
    if (isMusicPlayerInitialized) return;
    isMusicPlayerInitialized = true;
    // Override the saved setting for autoplay if we are on a different page than the main game page
    if (!isGamePageAndActive()) musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;
    // Handle pages that aren't the main game page or the map editor
    addHandlers();
    if (isLiveQueue()) return onLiveQueue();
    if (isMaintenance()) return onMaintenance();
    if (isMovePlanner()) return onMovePlanner();
    if (isYourGames()) return onIsYourGames();
    // game.php or designmap.php from now on
    if (isMapEditor()) onMapEditor();
    allowSettingsToBeSaved();
    preloadAllCommonAudio(() => {
      log("All common audio has been pre-loaded!");
      // Set dynamic settings based on the current game state
      // Lastly, update the UI to reflect the current settings
      musicSettings.themeType = getCurrentThemeType();
      musicPlayerUI.updateAllInputLabels();
      playThemeSong();
      // Check for new music files every minute
      const checkHashesMS = 1000 * 60 * 1;
      const checkHashesFn = () => {
        checkHashesInDB()
          .then(() => log("All music files have been checked for updates."))
          .catch((reason) => logError("Could not check for music file updates:", reason));
        window.setTimeout(checkHashesFn, checkHashesMS);
      };
      checkHashesFn();
      musicPlayerUI.checkIfNewVersionAvailable();
      // preloadAllAudio(() => {
      //   log("All other audio has been pre-loaded!");
      // });
    });
  }
  /**
   * Initializes and adds the music player UI to the page.
   */
  function initializeUI() {
    // Add the music player UI to the page and the necessary event handlers
    if (!isLiveQueue()) musicPlayerUI.addToAWBWPage(getMenu(), isYourGames());
    musicPlayerUI.setProgress(100);
    // Make adjustments to the UI based on the page we are on
    if (isYourGames()) {
      musicPlayerUI.parent.style.border = "none";
      musicPlayerUI.parent.style.backgroundColor = "#0000";
      musicPlayerUI.setProgress(-1);
    }
    if (isMapEditor()) {
      musicPlayerUI.parent.style.borderTop = "none";
    }
    if (isMaintenance()) {
      musicPlayerUI.parent.style.borderLeft = "";
    }
  }
  /**
   * Main function that initializes everything depending on the browser autoplay settings.
   */
  function main() {
    // Load settings from local storage but don't allow saving yet
    loadSettingsFromLocalStorage();
    initializeUI();
    const ifCanAutoplay = () => {
      initializeMusicPlayer();
    };
    const ifCannotAutoplay = () => {
      // Listen for any clicks
      musicPlayerUI.addEventListener("click", () => initializeMusicPlayer(), { once: true });
      document.querySelector("body")?.addEventListener("click", () => initializeMusicPlayer(), { once: true });
    };
    // Check if we can autoplay
    canAutoplay
      .audio()
      .then((response) => {
        const result = response.result;
        logDebug("Script starting, does your browser allow you to auto-play:", result);
        if (result) ifCanAutoplay();
        else ifCannotAutoplay();
      })
      .catch((reason) => {
        logDebug("Script starting, could not check your browser allows auto-play so assuming no: ", reason);
        ifCannotAutoplay();
      });
  }
  /******************************************************************
   * SCRIPT ENTRY (MAIN FUNCTION)
   ******************************************************************/
  // Open the database for caching music files first
  // No matter what happens, we will initialize the music player
  log("Opening database to cache music files.");
  openDB()
    .then(() => log("Database opened successfully. Ready to cache music files."))
    .catch((reason) => logDebug(`Database Error: ${reason}. Will not be able to cache music files locally.`))
    .finally(main);

  exports.initializeMusicPlayer = initializeMusicPlayer;
  exports.initializeUI = initializeUI;
  exports.main = main;
  exports.notifyCOSelectorListeners = notifyCOSelectorListeners;

  return exports;
})({}, canAutoplay, Howl, SparkMD5);
