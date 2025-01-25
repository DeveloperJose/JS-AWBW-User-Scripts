// ==UserScript==
// @name            Improved AWBW Music Player
// @description     An improved version of the comprehensive audio player that attempts to recreate the cart experience with more sound effects, more music, and more customizability.
// @namespace       https://awbw.amarriner.com/
// @author          DeveloperJose, _twiggy
// @match           https://awbw.amarriner.com/*
// @icon            https://developerjose.netlify.app/img/music-player-icon.png
// @require         https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js
// @require         https://cdn.jsdelivr.net/npm/spark-md5@3.0.2/spark-md5.min.js
// @require         https://cdn.jsdelivr.net/npm/can-autoplay@3.0.2/build/can-autoplay.min.js
// @run-at          document-end
// @version         4.8.0
// @supportURL      https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @contributionURL https://ko-fi.com/developerjose
// @license         MIT
// @unwrap
// @grant           none
// ==/UserScript==

var awbw_music_player = (function (exports, canAutoplay, SparkMD5) {
  "use strict";

  function styleInject(css, ref) {
    if (ref === undefined) ref = {};
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

  var PageType = /* @__PURE__ */ ((PageType2) => {
    PageType2["Maintenance"] = "Maintenance";
    PageType2["ActiveGame"] = "ActiveGame";
    PageType2["MapEditor"] = "MapEditor";
    PageType2["MovePlanner"] = "MovePlanner";
    PageType2["LiveQueue"] = "LiveQueue";
    PageType2["MainPage"] = "MainPage";
    PageType2["Default"] = "Default";
    return PageType2;
  })(PageType || {});
  function getCurrentPageType() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    const isMaintenance = document.querySelector("#server-maintenance-alert") !== null;
    if (isMaintenance) return "Maintenance" /* Maintenance */;
    if (document.location.href.indexOf("game.php") > -1) return "ActiveGame" /* ActiveGame */;
    if (document.location.href.indexOf("editmap.php?") > -1) return "MapEditor" /* MapEditor */;
    if (document.location.href.indexOf("moveplanner.php") > -1) return "MovePlanner" /* MovePlanner */;
    if (document.location.href.indexOf("live_queue.php") > -1) return "LiveQueue" /* LiveQueue */;
    if (document.location.href === "https://awbw.amarriner.com") return "MainPage" /* MainPage */;
    return "Default" /* Default */;
  }
  function getCoordsDiv() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector("#coords");
  }
  function getReplayControls() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".replay-controls");
  }
  function getReplayOpenBtn() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".replay-open");
  }
  function getReplayCloseBtn() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".replay-close");
  }
  function getReplayForwardBtn() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".replay-forward");
  }
  function getReplayForwardActionBtn() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".replay-forward-action");
  }
  function getReplayBackwardBtn() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".replay-backward");
  }
  function getReplayBackwardActionBtn() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".replay-backward-action");
  }
  function getReplayDaySelectorCheckBox() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".replay-day-selector");
  }
  function getConnectionErrorDiv() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".connection-error-msg");
  }
  function getLiveQueueSelectPopup() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector("#live-queue-select-popup");
  }
  function getLiveQueueBlockerPopup() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(".live-queue-blocker-popup");
  }
  function getBuildingDiv(buildingID) {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return document.querySelector(`.game-building[data-building-id='${buildingID}']`);
  }
  function getAllDamageSquares() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    return Array.from(document.getElementsByClassName("dmg-square"));
  }
  const moveAnimationDelayMS = 5;
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
  function addUpdateCursorObserver(onCursorMove) {
    const coordsDiv = getCoordsDiv();
    if (!coordsDiv) return;
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") return;
        if (!mutation.target) return;
        if (!mutation.target.textContent) return;
        let coordsText = mutation.target.textContent;
        coordsText = coordsText.substring(1, coordsText.length - 1);
        const splitCoords = coordsText.split(",");
        const cursorX = Number(splitCoords[0]);
        const cursorY = Number(splitCoords[1]);
        onCursorMove(cursorX, cursorY);
      }
    });
    observer.observe(coordsDiv, { childList: true });
  }

  const ORANGE_STAR_COs = /* @__PURE__ */ new Set(["andy", "max", "sami", "nell", "hachi", "jake", "rachel"]);
  const BLUE_MOON_COs = /* @__PURE__ */ new Set(["olaf", "grit", "colin", "sasha"]);
  const GREEN_EARTH_COs = /* @__PURE__ */ new Set(["eagle", "drake", "jess", "javier"]);
  const YELLOW_COMET_COs = /* @__PURE__ */ new Set(["kanbei", "sonja", "sensei", "grimm"]);
  const BLACK_HOLE_COs = /* @__PURE__ */ new Set([
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
  const AW2_ONLY_COs = /* @__PURE__ */ new Set(["hachi", "colin", "sensei", "jess", "flak", "adder", "lash", "hawke"]);
  const AW_DS_ONLY_COs = /* @__PURE__ */ new Set([
    "jake",
    "rachel",
    "sasha",
    "javier",
    "grimm",
    "kindle",
    "jugger",
    "koal",
    "vonbolt",
  ]);
  function getAllCONames(properCase = false) {
    if (!properCase)
      return [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    const allCOs = [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    allCOs[allCOs.indexOf("vonbolt")] = "Von Bolt";
    return allCOs.map((co) => co[0].toUpperCase() + co.slice(1));
  }
  function areAnimationsEnabled() {
    return typeof gameAnims !== "undefined" ? gameAnims : false;
  }
  function isBlackHoleCO(coName) {
    coName = coName.toLowerCase().replaceAll(" ", "");
    return BLACK_HOLE_COs.has(coName);
  }
  function getRandomCO(excludedCOs) {
    const COs = new Set(getAllCONames());
    for (const co of excludedCOs) COs.delete(co);
    if (COs.size === 0) return "map-editor";
    if (COs.size === 1) return [...COs][0];
    return [...COs][Math.floor(Math.random() * COs.size)];
  }

  var COPowerEnum = /* @__PURE__ */ ((COPowerEnum2) => {
    COPowerEnum2["NoPower"] = "N";
    COPowerEnum2["COPower"] = "Y";
    COPowerEnum2["SuperCOPower"] = "S";
    return COPowerEnum2;
  })(COPowerEnum || {});
  const siloDelayMS = areAnimationsEnabled() ? 3e3 : 0;
  const attackDelayMS = areAnimationsEnabled() ? 1e3 : 0;
  function getMyUsername() {
    const document = window.document.querySelector("iframe")?.contentDocument ?? window.document;
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu) return null;
    const link = profileMenu.getElementsByClassName("dropdown-menu-link")[0];
    return link.href.split("username=")[1];
  }
  let myID = -1;
  function getMyID() {
    if (getCurrentPageType() !== PageType.ActiveGame) return -1;
    if (myID < 0) {
      getAllPlayersInfo().forEach((entry) => {
        if (entry.users_username === getMyUsername()) {
          myID = entry.players_id;
        }
      });
    }
    return myID;
  }
  function getPlayerInfo(pid) {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    if (typeof playersInfo === "undefined") return null;
    return playersInfo[pid];
  }
  function getAllPlayersInfo() {
    if (getCurrentPageType() !== PageType.ActiveGame) return [];
    if (typeof playersInfo === "undefined") return [];
    return Object.values(playersInfo);
  }
  function isPlayerSpectator(pid) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    if (typeof playerKeys === "undefined") return false;
    return !playerKeys.includes(pid);
  }
  function canPlayerActivateCOPower(pid) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    const info = getPlayerInfo(pid);
    if (!info) return false;
    return info.players_co_power >= info.players_co_max_power;
  }
  function canPlayerActivateSuperCOPower(pid) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    const info = getPlayerInfo(pid);
    if (!info) return false;
    return info.players_co_power >= info.players_co_max_spower;
  }
  function getBuildingInfo(x, y) {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    if (typeof buildingsInfo === "undefined") return null;
    return buildingsInfo[x][y];
  }
  function isReplayActive() {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    const replayControls = getReplayControls();
    if (!replayControls) return false;
    const replayOpen = replayControls.style.display !== "none";
    return replayOpen && Object.keys(replay).length > 0;
  }
  function hasGameEnded() {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    if (typeof playersInfo === "undefined") return false;
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
    if (getCurrentPageType() !== PageType.ActiveGame) return "-05:00";
    if (typeof serverTimezone === "undefined") return "-05:00";
    if (!serverTimezone) return "-05:00";
    return serverTimezone;
  }
  function didGameEndToday() {
    if (!hasGameEnded()) return false;
    const serverTimezone2 = parseInt(getServerTimeZone());
    const endDate = new Date(gameEndDate);
    const now = /* @__PURE__ */ new Date();
    const timezoneOffset = now.getTimezoneOffset() / 60;
    const difference = +serverTimezone2 + timezoneOffset;
    const nowAdjustedToServer = new Date(now.getTime() + difference * 36e5);
    const oneDayMilliseconds = 24 * 60 * 60 * 1e3;
    return nowAdjustedToServer.getTime() - endDate.getTime() < oneDayMilliseconds;
  }
  function getCurrentGameDay() {
    if (getCurrentPageType() !== PageType.ActiveGame) return 1;
    if (typeof gameDay === "undefined") return 1;
    if (!isReplayActive()) return gameDay;
    const replayData = Object.values(replay);
    if (replayData.length === 0) return gameDay;
    const lastData = replayData[replayData.length - 1];
    if (typeof lastData === "undefined") return gameDay;
    if (typeof lastData.day === "undefined") return gameDay;
    return lastData.day;
  }
  class currentPlayer {
    /**
     * Get the internal info object containing the state of the current player.
     */
    static get info() {
      if (getCurrentPageType() !== PageType.ActiveGame) return null;
      if (typeof currentTurn === "undefined") return null;
      return getPlayerInfo(currentTurn);
    }
    /**
     * Determine whether a CO Power or Super CO Power is activated for the current player.
     * @returns - True if a regular CO power or a Super CO Power is activated.
     */
    static get isPowerActivated() {
      if (getCurrentPageType() !== PageType.ActiveGame) return false;
      return this?.coPowerState !== "N" /* NoPower */;
    }
    /**
     * Gets state of the CO Power for the current player represented as a single letter.
     * @returns - The state of the CO Power for the current player.
     */
    static get coPowerState() {
      if (getCurrentPageType() !== PageType.ActiveGame) return "N" /* NoPower */;
      return this.info?.players_co_power_on;
    }
    /**
     * Determine if the current player has been eliminated from the game.
     * @returns - True if the current player has been eliminated.
     */
    static get isEliminated() {
      if (getCurrentPageType() !== PageType.ActiveGame) return false;
      return this.info?.players_eliminated === "Y";
    }
    /**
     * Gets the name of the CO for the current player.
     * If the game has ended, it will return "victory" or "defeat".
     * If we are in the map editor, it will return "map-editor".
     * @returns - The name of the CO for the current player.
     */
    static get coName() {
      if (getCurrentPageType() === PageType.MapEditor) return "map-editor";
      if (getCurrentPageType() === PageType.Maintenance) return "maintenance";
      if (getCurrentPageType() !== PageType.ActiveGame) return null;
      const myID2 = getMyID();
      const myInfo = getPlayerInfo(myID2);
      const myWin = myInfo?.players_eliminated === "N";
      const myLoss = myInfo?.players_eliminated === "Y";
      const endedToday = didGameEndToday();
      const isSpectator = isPlayerSpectator(myID2);
      const endGameTheme = isSpectator || myWin ? "victory" : "defeat";
      if (hasGameEnded()) {
        if (endedToday) return endGameTheme;
        if (!isReplayActive()) return "co-select";
        return endGameTheme;
      }
      if (myLoss) return "defeat";
      return this.info?.co_name;
    }
  }
  function getAllPlayingCONames() {
    if (getCurrentPageType() === PageType.MapEditor) return /* @__PURE__ */ new Set(["map-editor"]);
    if (getCurrentPageType() !== PageType.ActiveGame) return /* @__PURE__ */ new Set();
    const allPlayers = new Set(getAllPlayersInfo().map((info) => info.co_name));
    const allTagPlayers = getAllTagCONames();
    return /* @__PURE__ */ new Set([...allPlayers, ...allTagPlayers]);
  }
  function isTagGame() {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    return typeof tagsInfo !== "undefined" && tagsInfo;
  }
  function getAllTagCONames() {
    if (getCurrentPageType() !== PageType.ActiveGame || !isTagGame()) return /* @__PURE__ */ new Set();
    if (typeof tagsInfo === "undefined") return /* @__PURE__ */ new Set();
    return new Set(Object.values(tagsInfo).map((tag) => tag.co_name));
  }
  function getUnitInfo(unitId) {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    if (typeof unitsInfo === "undefined") return null;
    return unitsInfo[unitId];
  }
  function getUnitName(unitId) {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    return getUnitInfo(unitId)?.units_name;
  }
  function getUnitInfoFromCoords(x, y) {
    if (getCurrentPageType() !== PageType.ActiveGame) return null;
    if (typeof unitsInfo === "undefined") return null;
    return Object.values(unitsInfo)
      .filter((info) => info.units_x == x && info.units_y == y)
      .pop();
  }
  function isValidUnit(unitId) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
    if (typeof unitsInfo === "undefined") return false;
    return unitId !== undefined && unitsInfo[unitId] !== undefined;
  }
  function hasUnitMovedThisTurn(unitId) {
    if (getCurrentPageType() !== PageType.ActiveGame) return false;
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

  function log(message, ...args) {
    console.log("[AWBW Improved Music Player]", message, ...args);
  }
  function logError(message, ...args) {
    console.error("[AWBW Improved Music Player]", message, ...args);
  }
  function logDebug(message, ...args) {
    console.debug("[AWBW Improved Music Player]", message, ...args);
  }

  var __defProp$1 = Object.defineProperty;
  var __defNormalProp$1 = (obj, key, value) =>
    key in obj
      ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value })
      : (obj[key] = value);
  var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  var GameType = /* @__PURE__ */ ((GameType2) => {
    GameType2["AW1"] = "AW1";
    GameType2["AW2"] = "AW2";
    GameType2["RBC"] = "RBC";
    GameType2["DS"] = "DS";
    return GameType2;
  })(GameType || {});
  var ThemeType = /* @__PURE__ */ ((ThemeType2) => {
    ThemeType2["REGULAR"] = "REGULAR";
    ThemeType2["CO_POWER"] = "CO_POWER";
    ThemeType2["SUPER_CO_POWER"] = "SUPER_CO_POWER";
    return ThemeType2;
  })(ThemeType || {});
  var RandomThemeType = /* @__PURE__ */ ((RandomThemeType2) => {
    RandomThemeType2["NONE"] = "NONE";
    RandomThemeType2["ALL_THEMES"] = "ALL_THEMES";
    RandomThemeType2["CURRENT_SOUNDTRACK"] = "CURRENT_SOUNDTRACK";
    return RandomThemeType2;
  })(RandomThemeType || {});
  function getCurrentThemeType() {
    const currentPowerState = currentPlayer?.coPowerState;
    if (currentPowerState === "Y") return "CO_POWER" /* CO_POWER */;
    if (currentPowerState === "S") return "SUPER_CO_POWER" /* SUPER_CO_POWER */;
    return "REGULAR" /* REGULAR */;
  }
  function getRandomGameType(excludedGameTypes = /* @__PURE__ */ new Set()) {
    const gameTypes = Object.values(GameType).filter((gameType) => !excludedGameTypes.has(gameType));
    return gameTypes[Math.floor(Math.random() * gameTypes.length)];
  }
  const STORAGE_KEY = "musicPlayerSettings";
  const onSettingsChangeListeners = [];
  function addSettingsChangeListener(fn) {
    onSettingsChangeListeners.push(fn);
  }
  var SettingsKey = /* @__PURE__ */ ((SettingsKey2) => {
    SettingsKey2[(SettingsKey2["IS_PLAYING"] = 0)] = "IS_PLAYING";
    SettingsKey2[(SettingsKey2["VOLUME"] = 1)] = "VOLUME";
    SettingsKey2[(SettingsKey2["SFX_VOLUME"] = 2)] = "SFX_VOLUME";
    SettingsKey2[(SettingsKey2["UI_VOLUME"] = 3)] = "UI_VOLUME";
    SettingsKey2[(SettingsKey2["GAME_TYPE"] = 4)] = "GAME_TYPE";
    SettingsKey2[(SettingsKey2["ALTERNATE_THEMES"] = 5)] = "ALTERNATE_THEMES";
    SettingsKey2[(SettingsKey2["ALTERNATE_THEME_DAY"] = 6)] = "ALTERNATE_THEME_DAY";
    SettingsKey2[(SettingsKey2["RANDOM_THEMES_TYPE"] = 7)] = "RANDOM_THEMES_TYPE";
    SettingsKey2[(SettingsKey2["CAPTURE_PROGRESS_SFX"] = 8)] = "CAPTURE_PROGRESS_SFX";
    SettingsKey2[(SettingsKey2["PIPE_SEAM_SFX"] = 9)] = "PIPE_SEAM_SFX";
    SettingsKey2[(SettingsKey2["OVERRIDE_LIST"] = 10)] = "OVERRIDE_LIST";
    SettingsKey2[(SettingsKey2["RESTART_THEMES"] = 11)] = "RESTART_THEMES";
    SettingsKey2[(SettingsKey2["AUTOPLAY_ON_OTHER_PAGES"] = 12)] = "AUTOPLAY_ON_OTHER_PAGES";
    SettingsKey2[(SettingsKey2["EXCLUDED_RANDOM_THEMES"] = 13)] = "EXCLUDED_RANDOM_THEMES";
    SettingsKey2[(SettingsKey2["THEME_TYPE"] = 14)] = "THEME_TYPE";
    SettingsKey2[(SettingsKey2["CURRENT_RANDOM_CO"] = 15)] = "CURRENT_RANDOM_CO";
    SettingsKey2[(SettingsKey2["ALL"] = 16)] = "ALL";
    SettingsKey2[(SettingsKey2["ADD_OVERRIDE"] = 17)] = "ADD_OVERRIDE";
    SettingsKey2[(SettingsKey2["REMOVE_OVERRIDE"] = 18)] = "REMOVE_OVERRIDE";
    SettingsKey2[(SettingsKey2["ADD_EXCLUDED"] = 19)] = "ADD_EXCLUDED";
    SettingsKey2[(SettingsKey2["REMOVE_EXCLUDED"] = 20)] = "REMOVE_EXCLUDED";
    return SettingsKey2;
  })(SettingsKey || {});
  class musicSettings {
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
      const savedSettings = JSON.parse(json);
      for (let key in this) {
        key = key.substring(2);
        if (Object.hasOwn(savedSettings, key)) {
          if (key === "overrideList") {
            this.__overrideList = new Map(savedSettings[key]);
            continue;
          }
          if (key === "excludedRandomThemes") {
            this.__excludedRandomThemes = new Set(savedSettings[key]);
            continue;
          }
          this[key] = savedSettings[key];
        }
      }
      this.__isLoaded = true;
    }
    static set isPlaying(val) {
      if (this.__isPlaying === val) return;
      this.__isPlaying = val;
      this.onSettingChangeEvent(0 /* IS_PLAYING */);
    }
    static get isPlaying() {
      return this.__isPlaying;
    }
    static set volume(val) {
      if (this.__volume === val) return;
      this.__volume = val;
      this.onSettingChangeEvent(1 /* VOLUME */);
    }
    static get volume() {
      return this.__volume;
    }
    static set sfxVolume(val) {
      if (this.__sfxVolume === val) return;
      this.__sfxVolume = val;
      this.onSettingChangeEvent(2 /* SFX_VOLUME */);
    }
    static get sfxVolume() {
      return this.__sfxVolume;
    }
    static set uiVolume(val) {
      if (this.__uiVolume === val) return;
      this.__uiVolume = val;
      this.onSettingChangeEvent(3 /* UI_VOLUME */);
    }
    static get uiVolume() {
      return this.__uiVolume;
    }
    static set gameType(val) {
      if (this.__gameType === val) return;
      this.__gameType = val;
      this.__currentRandomGameType = val;
      this.onSettingChangeEvent(4 /* GAME_TYPE */);
    }
    static get gameType() {
      return this.__gameType;
    }
    static set alternateThemes(val) {
      if (this.__alternateThemes === val) return;
      this.__alternateThemes = val;
      this.onSettingChangeEvent(5 /* ALTERNATE_THEMES */);
    }
    static get alternateThemes() {
      return this.__alternateThemes;
    }
    static set alternateThemeDay(val) {
      if (this.__alternateThemeDay === val) return;
      this.__alternateThemeDay = val;
      this.onSettingChangeEvent(6 /* ALTERNATE_THEME_DAY */);
    }
    static get alternateThemeDay() {
      return this.__alternateThemeDay;
    }
    static set captureProgressSFX(val) {
      this.__captureProgressSFX = val;
      this.onSettingChangeEvent(8 /* CAPTURE_PROGRESS_SFX */);
    }
    static get captureProgressSFX() {
      return this.__captureProgressSFX;
    }
    static set pipeSeamSFX(val) {
      this.__pipeSeamSFX = val;
      this.onSettingChangeEvent(9 /* PIPE_SEAM_SFX */);
    }
    static get pipeSeamSFX() {
      return this.__pipeSeamSFX;
    }
    static set overrideList(val) {
      this.__overrideList = new Map([...val.entries()].sort());
      this.onSettingChangeEvent(10 /* OVERRIDE_LIST */);
    }
    static get overrideList() {
      return this.__overrideList;
    }
    static addOverride(coName, gameType) {
      this.__overrideList.set(coName, gameType);
      this.__overrideList = new Map([...this.__overrideList.entries()].sort());
      this.onSettingChangeEvent(17 /* ADD_OVERRIDE */);
    }
    static removeOverride(coName) {
      this.__overrideList.delete(coName);
      this.__overrideList = new Map([...this.__overrideList.entries()].sort());
      this.onSettingChangeEvent(18 /* REMOVE_OVERRIDE */);
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
      this.onSettingChangeEvent(11 /* RESTART_THEMES */);
    }
    static get autoplayOnOtherPages() {
      return this.__autoplayOnOtherPages;
    }
    static set autoplayOnOtherPages(val) {
      if (this.__autoplayOnOtherPages === val) return;
      this.__autoplayOnOtherPages = val;
      this.onSettingChangeEvent(12 /* AUTOPLAY_ON_OTHER_PAGES */);
    }
    static get excludedRandomThemes() {
      return this.__excludedRandomThemes;
    }
    static set excludedRandomThemes(val) {
      this.__excludedRandomThemes = val;
      this.onSettingChangeEvent(13 /* EXCLUDED_RANDOM_THEMES */);
    }
    static addExcludedRandomTheme(theme) {
      this.__excludedRandomThemes.add(theme);
      this.onSettingChangeEvent(19 /* ADD_EXCLUDED */);
    }
    static removeExcludedRandomTheme(theme) {
      this.__excludedRandomThemes.delete(theme);
      this.onSettingChangeEvent(20 /* REMOVE_EXCLUDED */);
    }
    // ************* Non-user configurable settings from here on
    static set themeType(val) {
      if (this.__themeType === val) return;
      this.__themeType = val;
      this.onSettingChangeEvent(14 /* THEME_TYPE */);
    }
    static get themeType() {
      return this.__themeType;
    }
    static set randomThemesType(val) {
      if (this.__randomThemesType === val) return;
      this.__randomThemesType = val;
      this.onSettingChangeEvent(7 /* RANDOM_THEMES_TYPE */);
    }
    static get randomThemesType() {
      return this.__randomThemesType;
    }
    static get currentRandomCO() {
      if (!this.__currentRandomCO || this.__currentRandomCO == "") this.randomizeCO();
      return this.__currentRandomCO;
    }
    static randomizeCO() {
      const excludedCOs = /* @__PURE__ */ new Set([...this.__excludedRandomThemes, this.__currentRandomCO]);
      this.__currentRandomCO = getRandomCO(excludedCOs);
      const isPower = this.themeType !== "REGULAR"; /* REGULAR */
      const excludedSoundtracks = /* @__PURE__ */ new Set();
      if (isPower) excludedSoundtracks.add("AW1" /* AW1 */);
      this.__currentRandomGameType = getRandomGameType(excludedSoundtracks);
      this.onSettingChangeEvent(15 /* CURRENT_RANDOM_CO */);
    }
    static onSettingChangeEvent(key) {
      onSettingsChangeListeners.forEach((fn) => fn(key, !this.__isLoaded));
    }
    static get currentRandomGameType() {
      return this.__currentRandomGameType;
    }
  }
  // User configurable settings
  __publicField$1(musicSettings, "__isPlaying", false);
  __publicField$1(musicSettings, "__volume", 0.5);
  __publicField$1(musicSettings, "__sfxVolume", 0.4);
  __publicField$1(musicSettings, "__uiVolume", 0.4);
  __publicField$1(musicSettings, "__gameType", "DS" /* DS */);
  __publicField$1(musicSettings, "__alternateThemes", true);
  __publicField$1(musicSettings, "__alternateThemeDay", 15);
  __publicField$1(musicSettings, "__randomThemesType", "NONE" /* NONE */);
  __publicField$1(musicSettings, "__captureProgressSFX", true);
  __publicField$1(musicSettings, "__pipeSeamSFX", true);
  __publicField$1(musicSettings, "__overrideList", /* @__PURE__ */ new Map());
  __publicField$1(musicSettings, "__restartThemes", false);
  __publicField$1(musicSettings, "__autoplayOnOtherPages", true);
  __publicField$1(musicSettings, "__excludedRandomThemes", /* @__PURE__ */ new Set());
  // Non-user configurable settings
  __publicField$1(musicSettings, "__themeType", "REGULAR" /* REGULAR */);
  __publicField$1(musicSettings, "__currentRandomCO", "");
  __publicField$1(musicSettings, "__currentRandomGameType", "DS" /* DS */);
  __publicField$1(musicSettings, "__isLoaded", false);
  function loadSettingsFromLocalStorage() {
    let storageData = localStorage.getItem(STORAGE_KEY);
    if (!storageData || storageData === "undefined") {
      log("No saved settings found, storing defaults");
      storageData = updateSettingsInLocalStorage();
    }
    musicSettings.fromJSON(storageData);
    onSettingsChangeListeners.forEach((fn) => fn(16 /* ALL */, true));
    logDebug("Settings loaded from storage:", storageData);
  }
  function allowSettingsToBeSaved() {
    addSettingsChangeListener(onSettingsChange$2);
  }
  function onSettingsChange$2(key, _isFirstLoad) {
    if (key === 14 /* THEME_TYPE */ || key === 15 /* CURRENT_RANDOM_CO */) return "";
    updateSettingsInLocalStorage();
  }
  function updateSettingsInLocalStorage() {
    const jsonSettings = musicSettings.toJSON();
    localStorage.setItem(STORAGE_KEY, jsonSettings);
    logDebug("Saving settings...", jsonSettings);
    return jsonSettings;
  }

  const BASE_URL = "https://developerjose.netlify.app";
  const BASE_MUSIC_URL = BASE_URL + "/music";
  const BASE_SFX_URL = BASE_MUSIC_URL + "/sfx";
  const NEUTRAL_IMG_URL = BASE_URL + "/img/music-player-icon.png";
  const PLAYING_IMG_URL = BASE_URL + "/img/music-player-playing.gif";
  const HASH_JSON_URL = BASE_MUSIC_URL + "/hashes.json";
  var SpecialTheme = ((SpecialTheme2) => {
    SpecialTheme2["Victory"] = BASE_MUSIC_URL + "/t-victory.ogg";
    SpecialTheme2["Defeat"] = BASE_MUSIC_URL + "/t-defeat.ogg";
    SpecialTheme2["Maintenance"] = BASE_MUSIC_URL + "/t-maintenance.ogg";
    SpecialTheme2["COSelect"] = BASE_MUSIC_URL + "/t-co-select.ogg";
    SpecialTheme2["ModeSelect"] = BASE_MUSIC_URL + "/t-mode-select.ogg";
    return SpecialTheme2;
  })(SpecialTheme || {});
  var GameSFX = /* @__PURE__ */ ((GameSFX2) => {
    GameSFX2["coGoldRush"] = "co-gold-rush";
    GameSFX2["powerActivateAllyCOP"] = "power-activate-ally-cop";
    GameSFX2["powerActivateAllySCOP"] = "power-activate-ally-scop";
    GameSFX2["powerActivateBHCOP"] = "power-activate-bh-cop";
    GameSFX2["powerActivateBHSCOP"] = "power-activate-bh-scop";
    GameSFX2["powerActivateAW1COP"] = "power-activate-aw1-cop";
    GameSFX2["powerSCOPAvailable"] = "power-scop-available";
    GameSFX2["powerCOPAvailable"] = "power-cop-available";
    GameSFX2["tagBreakAlly"] = "tag-break-ally";
    GameSFX2["tagBreakBH"] = "tag-break-bh";
    GameSFX2["tagSwap"] = "tag-swap";
    GameSFX2["unitAttackPipeSeam"] = "unit-attack-pipe-seam";
    GameSFX2["unitCaptureAlly"] = "unit-capture-ally";
    GameSFX2["unitCaptureEnemy"] = "unit-capture-enemy";
    GameSFX2["unitCaptureProgress"] = "unit-capture-progress";
    GameSFX2["unitMissileHit"] = "unit-missile-hit";
    GameSFX2["unitMissileSend"] = "unit-missile-send";
    GameSFX2["unitHide"] = "unit-hide";
    GameSFX2["unitUnhide"] = "unit-unhide";
    GameSFX2["unitSupply"] = "unit-supply";
    GameSFX2["unitTrap"] = "unit-trap";
    GameSFX2["unitLoad"] = "unit-load";
    GameSFX2["unitUnload"] = "unit-unload";
    GameSFX2["unitExplode"] = "unit-explode";
    GameSFX2["uiCursorMove"] = "ui-cursor-move";
    GameSFX2["uiInvalid"] = "ui-invalid";
    GameSFX2["uiMenuOpen"] = "ui-menu-open";
    GameSFX2["uiMenuClose"] = "ui-menu-close";
    GameSFX2["uiMenuMove"] = "ui-menu-move";
    GameSFX2["uiUnitSelect"] = "ui-unit-select";
    return GameSFX2;
  })(GameSFX || {});
  const onMovementStartMap = /* @__PURE__ */ new Map([
    ["APC", "move-tread-light" /* moveTreadLightLoop */],
    ["Anti-Air", "move-tread-light" /* moveTreadLightLoop */],
    ["Artillery", "move-tread-light" /* moveTreadLightLoop */],
    ["B-Copter", "move-bcopter" /* moveBCopterLoop */],
    ["Battleship", "move-naval" /* moveNavalLoop */],
    ["Black Boat", "move-naval" /* moveNavalLoop */],
    ["Black Bomb", "move-plane" /* movePlaneLoop */],
    ["Bomber", "move-plane" /* movePlaneLoop */],
    ["Carrier", "move-naval" /* moveNavalLoop */],
    ["Cruiser", "move-naval" /* moveNavalLoop */],
    ["Fighter", "move-plane" /* movePlaneLoop */],
    ["Infantry", "move-inf" /* moveInfLoop */],
    ["Lander", "move-naval" /* moveNavalLoop */],
    ["Md.Tank", "move-tread-heavy" /* moveTreadHeavyLoop */],
    ["Mech", "move-mech" /* moveMechLoop */],
    ["Mega Tank", "move-tread-heavy" /* moveTreadHeavyLoop */],
    ["Missile", "move-tires-heavy" /* moveTiresHeavyLoop */],
    ["Neotank", "move-tread-heavy" /* moveTreadHeavyLoop */],
    ["Piperunner", "move-piperunner" /* movePiperunnerLoop */],
    ["Recon", "move-tires-light" /* moveTiresLightLoop */],
    ["Rocket", "move-tires-heavy" /* moveTiresHeavyLoop */],
    ["Stealth", "move-plane" /* movePlaneLoop */],
    ["Sub", "move-sub" /* moveSubLoop */],
    ["T-Copter", "move-tcopter" /* moveTCopterLoop */],
    ["Tank", "move-tread-light" /* moveTreadLightLoop */],
  ]);
  const onMovementRolloffMap = /* @__PURE__ */ new Map([
    ["APC", "move-tread-light-rolloff" /* moveTreadLightOneShot */],
    ["Anti-Air", "move-tread-light-rolloff" /* moveTreadLightOneShot */],
    ["Artillery", "move-tread-light-rolloff" /* moveTreadLightOneShot */],
    ["B-Copter", "move-bcopter-rolloff" /* moveBCopterOneShot */],
    ["Black Bomb", "move-plane-rolloff" /* movePlaneOneShot */],
    ["Bomber", "move-plane-rolloff" /* movePlaneOneShot */],
    ["Fighter", "move-plane-rolloff" /* movePlaneOneShot */],
    ["Md. Tank", "move-tread-heavy-rolloff" /* moveTreadHeavyOneShot */],
    ["Mega Tank", "move-tread-heavy-rolloff" /* moveTreadHeavyOneShot */],
    ["Missile", "move-tires-heavy-rolloff" /* moveTiresHeavyOneShot */],
    ["Neotank", "move-tread-heavy-rolloff" /* moveTreadHeavyOneShot */],
    ["Recon", "move-tires-light-rolloff" /* moveTiresLightOneShot */],
    ["Rocket", "move-tires-heavy-rolloff" /* moveTiresHeavyOneShot */],
    ["Stealth", "move-plane-rolloff" /* movePlaneOneShot */],
    ["T-Copter", "move-tcopter-rolloff" /* moveTCopterOneShot */],
    ["Tank", "move-tread-light-rolloff" /* moveTreadLightOneShot */],
  ]);
  const alternateThemes = /* @__PURE__ */ new Map([
    [GameType.AW1, /* @__PURE__ */ new Set(["sturm"])],
    [GameType.AW2, /* @__PURE__ */ new Set(["sturm"])],
    [GameType.RBC, /* @__PURE__ */ new Set(["andy", "olaf", "eagle", "drake", "grit", "kanbei", "sonja", "sturm"])],
    [GameType.DS, /* @__PURE__ */ new Set(["sturm", "vonbolt"])],
  ]);
  const specialLoops = /* @__PURE__ */ new Set(["vonbolt"]);
  function getAlternateMusicFilename(coName, gameType, themeType) {
    if (!alternateThemes.has(gameType)) return;
    const alternateThemesSet = alternateThemes.get(gameType);
    const faction = isBlackHoleCO(coName) ? "bh" : "ally";
    const isPowerActive = themeType !== ThemeType.REGULAR;
    if (gameType === GameType.RBC && isPowerActive) {
      return `t-${faction}-${themeType}`;
    }
    if (!alternateThemesSet?.has(coName) || isPowerActive) {
      return;
    }
    if (coName === "andy" && gameType == GameType.RBC) {
      return isPowerActive ? "t-clone-andy-cop" : "t-clone-andy";
    }
    return `t-${coName}-2`;
  }
  function getMusicFilename(coName, gameType, themeType, useAlternateTheme) {
    if (coName === "map-editor") return "t-map-editor";
    if (useAlternateTheme) {
      const alternateFilename = getAlternateMusicFilename(coName, gameType, themeType);
      if (alternateFilename) return alternateFilename;
    }
    const isPowerActive = themeType !== ThemeType.REGULAR;
    if (!isPowerActive || gameType === GameType.AW1) {
      return `t-${coName}`;
    }
    const isCOInRBC = !AW_DS_ONLY_COs.has(coName);
    if (gameType === GameType.RBC && isCOInRBC) {
      return `t-${coName}-cop`;
    }
    const faction = isBlackHoleCO(coName) ? "bh" : "ally";
    return `t-${faction}-${themeType}`;
  }
  function getMusicURL(coName, gameType, themeType, useAlternateTheme) {
    if (gameType === null || gameType === undefined) gameType = musicSettings.gameType;
    if (themeType === null || themeType === undefined) themeType = musicSettings.themeType;
    if (useAlternateTheme === null || useAlternateTheme === undefined) {
      useAlternateTheme = getCurrentGameDay() >= musicSettings.alternateThemeDay && musicSettings.alternateThemes;
    }
    coName = coName.toLowerCase().replaceAll(" ", "");
    if (coName === "victory") return SpecialTheme.Victory;
    if (coName === "defeat") return SpecialTheme.Defeat;
    if (coName === "co-select") return SpecialTheme.COSelect;
    if (coName === "mode-select") return SpecialTheme.ModeSelect;
    if (coName === "maintenance") return SpecialTheme.Maintenance;
    const overrideType = musicSettings.getOverride(coName);
    if (overrideType) gameType = overrideType;
    const filename = getMusicFilename(coName, gameType, themeType, useAlternateTheme);
    if (gameType !== GameType.DS && AW_DS_ONLY_COs.has(coName)) gameType = GameType.DS;
    if (gameType === GameType.AW1 && AW2_ONLY_COs.has(coName)) gameType = GameType.AW2;
    let gameDir = gameType;
    if (!gameDir.startsWith("AW")) gameDir = "AW_" + gameDir;
    const url = `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`;
    return url.toLowerCase().replaceAll("_", "-").replaceAll(" ", "");
  }
  function getCONameFromURL(url) {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const coName = filename.split(".")[0].substring(2);
    return coName;
  }
  function getSoundEffectURL(sfx) {
    return `${BASE_SFX_URL}/${sfx}.ogg`;
  }
  function getMovementSoundURL(unitName) {
    const sfx = onMovementStartMap.get(unitName);
    if (!sfx) return "";
    return `${BASE_SFX_URL}/${onMovementStartMap.get(unitName)}.ogg`;
  }
  function getMovementRollOffURL(unitName) {
    return `${BASE_SFX_URL}/${onMovementRolloffMap.get(unitName)}.ogg`;
  }
  function hasMovementRollOff(unitName) {
    return onMovementRolloffMap.has(unitName);
  }
  function hasSpecialLoop(srcURL) {
    const coName = getCONameFromURL(srcURL);
    return specialLoops.has(coName);
  }
  function getCurrentThemeURLs() {
    const coNames = getAllPlayingCONames();
    const audioList = /* @__PURE__ */ new Set();
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

  var ScriptName = /* @__PURE__ */ ((ScriptName2) => {
    ScriptName2["None"] = "none";
    ScriptName2["MusicPlayer"] = "music_player";
    ScriptName2["HighlightCursorCoordinates"] = "highlight_cursor_coordinates";
    return ScriptName2;
  })(ScriptName || {});
  const versions = /* @__PURE__ */ new Map([
    ["music_player" /* MusicPlayer */, "4.8.0"],
    ["highlight_cursor_coordinates" /* HighlightCursorCoordinates */, "2.3.0"],
  ]);
  const updateURLs = /* @__PURE__ */ new Map([
    [
      "music_player" /* MusicPlayer */,
      "https://update.greasyfork.org/scripts/518170/Improved%20AWBW%20Music%20Player.meta.js",
    ],
    [
      "highlight_cursor_coordinates" /* HighlightCursorCoordinates */,
      "https://update.greasyfork.org/scripts/520884/AWBW%20Highlight%20Cursor%20Coordinates.meta.js",
    ],
  ]);
  const homepageURLs = /* @__PURE__ */ new Map([
    ["music_player" /* MusicPlayer */, "https://greasyfork.org/en/scripts/518170-improved-awbw-music-player"],
    [
      "highlight_cursor_coordinates" /* HighlightCursorCoordinates */,
      "https://greasyfork.org/en/scripts/520884-awbw-highlight-cursor-coordinates",
    ],
  ]);
  function checkIfUpdateIsAvailable(scriptName) {
    const isGreater = (a, b) => {
      return a.localeCompare(b, undefined, { numeric: true }) === 1;
    };
    return new Promise((resolve, reject) => {
      const updateURL = updateURLs.get(scriptName);
      if (!updateURL) return reject(`Failed to get the update URL for the script.`);
      return fetch(updateURL)
        .then((response) => response.text())
        .then((text) => {
          if (!text) return reject(`Failed to get the HTML from the update URL for the script.`);
          const latestVersion = text.match(/@version\s+([0-9.]+)/)?.[1];
          if (!latestVersion) return reject(`Failed to get the latest version of the script.`);
          const currentVersion = versions.get(scriptName);
          if (!currentVersion) return reject(`Failed to get the current version of the script.`);
          const currentVersionParts = currentVersion.split(".");
          const latestVersionParts = latestVersion.split(".");
          const hasThreeParts = currentVersionParts.length === 3 && latestVersionParts.length === 3;
          if (!hasThreeParts) return reject(`The version number of the script is not in the correct format.`);
          const isUpdateAvailable = isGreater(latestVersion, currentVersion);
          logDebug(`Current version: ${currentVersion}, latest: ${latestVersion}, update needed: ${isUpdateAvailable}`);
          return resolve(isUpdateAvailable);
        })
        .catch((reason) => reject(reason));
    });
  }

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) =>
    key in obj
      ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
      : (obj[key] = value);
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var GroupType = /* @__PURE__ */ ((GroupType2) => {
    GroupType2["Vertical"] = "cls-vertical-box";
    GroupType2["Horizontal"] = "cls-horizontal-box";
    return GroupType2;
  })(GroupType || {});
  var MenuPosition = /* @__PURE__ */ ((MenuPosition2) => {
    MenuPosition2["Left"] = "settings-left";
    MenuPosition2["Center"] = "settings-center";
    MenuPosition2["Right"] = "settings-right";
    return MenuPosition2;
  })(MenuPosition || {});
  function sanitize(str) {
    return str.toLowerCase().replaceAll(" ", "-");
  }
  class CustomMenuSettingsUI {
    /**
     * Creates a new Custom Menu UI, to add it to AWBW you need to call {@link addToAWBWPage}.
     * @param prefix - A string used to prefix the IDs of the elements in the menu.
     * @param buttonImageURL - The URL of the image to be used as the button.
     * @param hoverText - The text to be displayed when hovering over the button.
     */
    constructor(prefix, buttonImageURL, hoverText = "") {
      /**
       * The root element or parent of the custom menu.
       */
      __publicField(this, "parent");
      /**
       * A map that contains the important nodes of the menu.
       * The keys are the names of the children, and the values are the elements themselves.
       * Allows for easy access to any element in the menu.
       */
      __publicField(this, "groups", /* @__PURE__ */ new Map());
      /**
       * A map that contains the group types for each group in the menu.
       * The keys are the names of the groups, and the values are the types of the groups.
       */
      __publicField(this, "groupTypes", /* @__PURE__ */ new Map());
      /**
       * An array of all the input elements in the menu.
       */
      __publicField(this, "inputElements", []);
      /**
       * An array of all the button elements in the menu.
       */
      __publicField(this, "buttonElements", []);
      /**
       * A boolean that represents whether the settings menu is open or not.
       */
      __publicField(this, "isSettingsMenuOpen", false);
      /**
       * A string used to prefix the IDs of the elements in the menu.
       */
      __publicField(this, "prefix");
      /**
       * A boolean that represents whether an update is available for the script.
       */
      __publicField(this, "isUpdateAvailable", false);
      /**
       * Text to be displayed when hovering over the main button.
       */
      __publicField(this, "parentHoverText", "");
      /**
       * A map that contains the tables in the menu.
       * The keys are the names of the tables, and the values are the table elements.
       */
      __publicField(this, "tableMap", /* @__PURE__ */ new Map());
      this.prefix = prefix;
      this.parentHoverText = hoverText;
      this.parent = document.createElement("div");
      this.parent.id = `${prefix}-parent`;
      this.parent.classList.add("game-tools-btn");
      this.parent.style.width = "34px";
      this.parent.style.height = "30px";
      const hoverSpan = document.createElement("span");
      hoverSpan.id = `${prefix}-hover-span`;
      hoverSpan.classList.add("game-tools-btn-text", "small_text");
      hoverSpan.innerText = hoverText;
      this.parent.appendChild(hoverSpan);
      this.groups.set("hover", hoverSpan);
      const bgDiv = document.createElement("div");
      bgDiv.id = `${prefix}-background`;
      bgDiv.classList.add("game-tools-bg");
      bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
      this.parent.appendChild(bgDiv);
      this.groups.set("bg", bgDiv);
      bgDiv.addEventListener("mouseover", () => this.setHoverText(this.parentHoverText));
      bgDiv.addEventListener("mouseout", () => this.setHoverText(""));
      const btnLink = document.createElement("a");
      btnLink.id = `${prefix}-link`;
      btnLink.classList.add("norm2");
      bgDiv.appendChild(btnLink);
      const btnImg = document.createElement("img");
      btnImg.id = `${prefix}-link-img`;
      btnImg.src = buttonImageURL;
      btnLink.appendChild(btnImg);
      this.groups.set("img", btnImg);
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
      const leftBox = document.createElement("div");
      leftBox.id = `${prefix}-settings-left`;
      leftBox.classList.add("cls-settings-menu-box");
      leftBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(leftBox);
      this.groups.set("settings-left" /* Left */, leftBox);
      const centerBox = document.createElement("div");
      centerBox.id = `${prefix}-settings-center`;
      centerBox.classList.add("cls-settings-menu-box");
      centerBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(centerBox);
      this.groups.set("settings-center" /* Center */, centerBox);
      const rightBox = document.createElement("div");
      rightBox.id = `${prefix}-settings-right`;
      rightBox.classList.add("cls-settings-menu-box");
      rightBox.style.display = "none";
      contextMenuBoxesContainer.appendChild(rightBox);
      this.groups.set("settings-right" /* Right */, rightBox);
      this.addContextMenuHandlers();
    }
    addContextMenuHandlers() {
      this.parent.addEventListener("contextmenu", (event) => {
        event.stopImmediatePropagation();
        const element = event.target;
        if (element.id.startsWith(this.prefix)) {
          event.preventDefault();
          this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
          if (this.isSettingsMenuOpen) {
            this.openContextMenu();
          } else {
            this.closeContextMenu();
          }
        }
      });
      document.addEventListener("click", (event) => {
        let elmnt = event.target;
        if (!elmnt.id) {
          while (!elmnt.id) {
            elmnt = elmnt.parentNode;
            if (!elmnt) break;
          }
        }
        if (!elmnt) return;
        if (elmnt.id.startsWith(this.prefix) || elmnt.id === "overDiv") return;
        this.closeContextMenu();
      });
    }
    /**
     * Adds the custom menu to the AWBW page.
     */
    addToAWBWPage(div, prepend = false) {
      if (!div) {
        logError("Parent div is null, cannot add custom menu to the page.");
        return;
      }
      if (!prepend) {
        div.appendChild(this.parent);
        this.parent.style.borderLeft = "none";
        return;
      }
      div.prepend(this.parent);
      this.parent.style.borderRight = "none";
      this.addContextMenuHandlers();
    }
    hasSettings() {
      const hasLeftMenu = this.groups.get("settings-left" /* Left */)?.style.display !== "none";
      const hasCenterMenu = this.groups.get("settings-center" /* Center */)?.style.display !== "none";
      const hasRightMenu = this.groups.get("settings-right" /* Right */)?.style.display !== "none";
      return hasLeftMenu || hasCenterMenu || hasRightMenu;
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
      const overDiv = document.querySelector("#overDiv");
      const hasCOSelector = this.groups.has("co-selector");
      const isGamePageAndActive = getCurrentPageType() === PageType.ActiveGame;
      if (overDiv && hasCOSelector && isGamePageAndActive) {
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
    addSlider(name, min, max, step, hoverText = "", position = "settings-center" /* Center */) {
      const contextMenu = this.getGroup(position);
      if (!contextMenu) return;
      const sliderBox = document.createElement("div");
      sliderBox.classList.add("cls-vertical-box");
      sliderBox.classList.add("cls-group-box");
      contextMenu?.appendChild(sliderBox);
      const label = document.createElement("label");
      sliderBox?.appendChild(label);
      const slider = document.createElement("input");
      slider.id = `${this.prefix}-${sanitize(name)}`;
      slider.type = "range";
      slider.min = String(min);
      slider.max = String(max);
      slider.step = String(step);
      this.inputElements.push(slider);
      slider.addEventListener("input", (_e) => {
        let displayValue = slider.value;
        if (max === 1) displayValue = Math.round(parseFloat(displayValue) * 100) + "%";
        label.innerText = `${name}: ${displayValue}`;
      });
      sliderBox?.appendChild(slider);
      slider.title = hoverText;
      slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
      slider.addEventListener("mouseout", () => this.setHoverText(""));
      return slider;
    }
    addGroup(groupName, type = "cls-horizontal-box" /* Horizontal */, position = "settings-center" /* Center */) {
      const contextMenu = this.getGroup(position);
      if (!contextMenu) return;
      const groupBox = document.createElement("div");
      groupBox.classList.add("cls-vertical-box");
      groupBox.classList.add("cls-group-box");
      contextMenu?.appendChild(groupBox);
      const groupLabel = document.createElement("label");
      groupLabel.innerText = groupName;
      groupBox?.appendChild(groupLabel);
      const group = document.createElement("div");
      group.id = `${this.prefix}-${sanitize(groupName)}`;
      group.classList.add(type);
      groupBox?.appendChild(group);
      this.groups.set(groupName, group);
      this.groupTypes.set(groupName, type);
      return group;
    }
    addRadioButton(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, "radio" /* Radio */);
    }
    addCheckbox(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, "checkbox" /* Checkbox */);
    }
    addButton(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, "button" /* Button */);
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
      const groupDiv = this.getGroup(groupName);
      const groupType = this.groupTypes.get(groupName);
      if (!groupDiv || !groupType) return;
      const inputBox = document.createElement("div");
      const otherType =
        groupType === "cls-horizontal-box" /* Horizontal */
          ? "cls-vertical-box" /* Vertical */
          : "cls-horizontal-box"; /* Horizontal */
      inputBox.classList.add(otherType);
      groupDiv.appendChild(inputBox);
      inputBox.title = hoverText;
      inputBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
      inputBox.addEventListener("mouseout", () => this.setHoverText(""));
      let input;
      if (type === "button" /* Button */) {
        input = this.createButton(name, inputBox);
      } else {
        input = this.createInput(name, inputBox);
      }
      input.type = type;
      input.name = groupName;
      return input;
    }
    createButton(name, inputBox) {
      const input = document.createElement("button");
      input.innerText = name;
      inputBox.appendChild(input);
      this.buttonElements.push(input);
      return input;
    }
    createInput(name, inputBox) {
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.innerText = name;
      inputBox.appendChild(input);
      inputBox.appendChild(label);
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
      if (table.rows.length === 0) table.insertRow();
      const maxItemsPerRow = tableData.columns;
      const currentItemsInRow = table.rows[table.rows.length - 1].cells.length;
      if (currentItemsInRow >= maxItemsPerRow) table.insertRow();
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
      coSelector.title = hoverText;
      coSelector.addEventListener("mouseover", () => this.setHoverText(hoverText));
      coSelector.addEventListener("mouseout", () => this.setHoverText(""));
      this.groups.set("co-selector", coSelector);
      this.groups.set("co-portrait", imgCO);
      groupDiv?.appendChild(coSelector);
      const allCOs = getAllCONames(true).sort();
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
      coSelector.onclick = () => {
        return overlib(selectorInnerHTML, STICKY, CAPTION, selectorTitle, OFFSETY, 25, OFFSETX, -322, CLOSECLICK);
      };
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
      return `<tr><td class=borderwhite><img class=co_portrait src=${imgSrc}></td><td class=borderwhite align=center valign=center><span class=small_text><a onclick="${onClickFn}" href=${location}>${coName}</a></b></span></td></tr>`;
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
      if (!getAllCONames().includes(coName)) {
        imgCO.src = `terrain/${coName}`;
      }
      return imgCO;
    }
    createCOPortraitImageWithText(coName, text) {
      const div = document.createElement("div");
      div.classList.add("cls-vertical-box");
      const coImg = this.createCOPortraitImage(coName);
      div.appendChild(coImg);
      const coLabel = document.createElement("label");
      coLabel.textContent = text;
      div.appendChild(coLabel);
      return div;
    }
    onCOSelectorClick(coName) {
      const overDiv = document.querySelector("#overDiv");
      overDiv.style.visibility = "hidden";
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

  function getCurrentDocument() {
    const iframe = document.querySelector("iframe");
    if (!iframe) return window.document;
    const href = iframe.contentDocument?.location.href ?? iframe.src;
    if (href === null || href === "" || href === "about:blank") return window.document;
    return iframe.contentDocument ?? window.document;
  }
  function initializeIFrame(init_fn) {
    const hasFrame = document.querySelector("iframe");
    if (hasFrame) return;
    const iframe = document.createElement("iframe");
    iframe.name = "main";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    document.body.appendChild(iframe);
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    if (document.body.parentElement) {
      document.body.parentElement.style.width = "100%";
      document.body.parentElement.style.height = "100%";
    }
    iframe.addEventListener("load", (event) => onIFrameLoad(event, init_fn));
    hijackLinks(window.document);
    init_fn();
  }
  function onIFrameLoad(event, initFn) {
    const iframe = event.target;
    const href = iframe.contentDocument?.location.href ?? iframe.src;
    log("Iframe loaded, hijacking links.", getCurrentPageType(), href);
    if (href === null || href === "" || href === "about:blank") return;
    for (const child of Array.from(document.body.children)) {
      if (child === iframe) continue;
      child.remove();
    }
    window.history.pushState({}, "", href);
    iframe.contentWindow?.history.pushState({}, "", href);
    hijackLinks(iframe.contentDocument);
    initFn();
  }
  const hijackLinks = (doc) => {
    if (!doc) {
      logError("Could not find the document to hijack links.");
      return;
    }
    const links = doc.querySelectorAll("a");
    if (!links) {
      logError("Could not find any links to hijack.");
      return;
    }
    for (const link of Array.from(links)) {
      link.target = "main";
    }
  };

  function getMenu() {
    const doc = getCurrentDocument();
    switch (getCurrentPageType()) {
      case PageType.Maintenance:
        return doc.querySelector("#main");
      case PageType.MapEditor:
        return doc.querySelector("#replay-misc-controls");
      case PageType.MovePlanner:
        return doc.querySelector("#map-controls-container");
      case PageType.ActiveGame:
        return doc.querySelector("#game-map-menu")?.parentNode;
      // case PageType.LiveQueue:
      // case PageType.MainPage:
      default:
        return doc.querySelector("#nav-options");
    }
  }
  function onMusicBtnClick(_event) {
    log("Music button clicked", musicSettings);
    musicSettings.isPlaying = !musicSettings.isPlaying;
  }
  function onSettingsChange$1(key, isFirstLoad) {
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
      musicPlayerUI.updateAllInputLabels();
    }
    if (key === SettingsKey.ALL || key === SettingsKey.ADD_OVERRIDE || key === SettingsKey.REMOVE_OVERRIDE) {
      clearAndRepopulateOverrideList();
      if (musicSettings.overrideList.size === 0) {
        const noOverrides = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No overrides set yet...");
        musicPlayerUI.addItemToTable("Overrides" /* Override_Table */, noOverrides);
      }
    }
    if (key === SettingsKey.ALL || key === SettingsKey.ADD_EXCLUDED || key === SettingsKey.REMOVE_EXCLUDED) {
      clearAndRepopulateExcludedList();
      if (musicSettings.excludedRandomThemes.size === 0) {
        const noExcluded = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No themes excluded yet...");
        musicPlayerUI.addItemToTable("Excluded Random Themes" /* Excluded_Table */, noExcluded);
      }
    }
    const canUpdateDaySlider = daySlider?.parentElement && getCurrentPageType() === PageType.ActiveGame;
    if (canUpdateDaySlider) daySlider.parentElement.style.display = alternateThemesBox.checked ? "flex" : "none";
    if (shuffleBtn) shuffleBtn.disabled = musicSettings.randomThemesType === RandomThemeType.NONE;
    const currentSounds = getCurrentPageType() === PageType.MovePlanner ? "Sound Effects" : "Tunes";
    if (musicSettings.isPlaying) {
      musicPlayerUI.setHoverText(`Stop ${currentSounds}`, true);
      musicPlayerUI.setImage(PLAYING_IMG_URL);
    } else {
      musicPlayerUI.setHoverText(`Play ${currentSounds}`, true);
      musicPlayerUI.setImage(NEUTRAL_IMG_URL);
    }
  }
  const parseInputFloat = (event) => parseFloat(event.target.value);
  const parseInputInt = (event) => parseInt(event.target.value);
  const musicPlayerUI = new CustomMenuSettingsUI(ScriptName.MusicPlayer, NEUTRAL_IMG_URL, "Play Tunes");
  function initializeMusicPlayerUI() {
    musicPlayerUI.setProgress(100);
    let prepend = false;
    switch (getCurrentPageType()) {
      case PageType.LiveQueue:
        return;
      case PageType.ActiveGame:
        break;
      case PageType.MapEditor:
        musicPlayerUI.parent.style.borderTop = "none";
        break;
      case PageType.Maintenance:
        musicPlayerUI.parent.style.borderLeft = "";
        break;
      default:
        musicPlayerUI.parent.style.border = "none";
        musicPlayerUI.parent.style.backgroundColor = "#0000";
        musicPlayerUI.setProgress(-1);
        prepend = true;
        break;
    }
    musicPlayerUI.addToAWBWPage(getMenu(), prepend);
    musicPlayerUI.addEventListener("click", onMusicBtnClick);
    if (getCurrentPageType() !== PageType.ActiveGame) {
      const parent = musicPlayerUI.getGroup("settings-parent");
      if (parent) parent.style.width = "475px";
      const rightGroup = musicPlayerUI.getGroup(RIGHT);
      if (rightGroup) rightGroup.style.display = "none";
      if (captProgressBox?.parentElement) captProgressBox.parentElement.style.display = "none";
      if (pipeSeamBox?.parentElement) pipeSeamBox.parentElement.style.display = "none";
      if (restartThemesBox?.parentElement) restartThemesBox.parentElement.style.display = "none";
      if (alternateThemesBox?.parentElement) alternateThemesBox.parentElement.style.display = "none";
      if (daySlider?.parentElement) daySlider.parentElement.style.display = "none";
    }
  }
  addSettingsChangeListener(onSettingsChange$1);
  var Description = /* @__PURE__ */ ((Description2) => {
    Description2["Volume"] = "Adjust the volume of the CO theme music, power activations, and power themes.";
    Description2["SFX_Volume"] = "Adjust the volume of the unit movement, tag swap, captures, and other unit sounds.";
    Description2["UI_Volume"] =
      "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.";
    Description2["AW1"] = "Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!";
    Description2["AW2"] = "Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.";
    Description2["DS"] =
      "Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though.";
    Description2["RBC"] = "Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!";
    Description2["No_Random"] = "Play the music depending on who the current CO is.";
    Description2["All_Random"] = "Play random music every turn from all soundtracks.";
    Description2["Current_Random"] = "Play random music every turn from the current soundtrack.";
    Description2["Shuffle"] = "Changes the current theme to a new random one.";
    Description2["Capture_Progress"] = "Play a sound effect when a unit makes progress capturing a property.";
    Description2["Pipe_Seam_SFX"] = "Play a sound effect when a pipe seam is attacked.";
    Description2["Restart_Themes"] =
      "Restart themes at the beginning of each turn (including replays). If disabled, themes will continue from where they left off previously.";
    Description2["Autoplay_Pages"] = "Autoplay music on other pages like your games or during maintenance.";
    Description2["Alternate_Themes"] =
      "Play alternate themes like the Re-Boot Camp factory themes after a certain day. Enable this to be able to select what day alternate themes start.";
    Description2["Alternate_Day"] =
      "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?";
    Description2["Add_Override"] =
      "Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes.";
    Description2["Override_Radio"] = "Only play songs from ";
    Description2["Remove_Override"] = "Removes the override for this specific CO.";
    Description2["Add_Excluded"] =
      "Add an override for a specific CO to exclude their themes when playing random themes.";
    return Description2;
  })(Description || {});
  const LEFT = MenuPosition.Left;
  const volumeSlider = musicPlayerUI.addSlider(
    "Music Volume" /* Volume */,
    0,
    1,
    5e-3,
    "Adjust the volume of the CO theme music, power activations, and power themes." /* Volume */,
    LEFT,
  );
  const sfxVolumeSlider = musicPlayerUI.addSlider(
    "SFX Volume" /* SFX_Volume */,
    0,
    1,
    5e-3,
    "Adjust the volume of the unit movement, tag swap, captures, and other unit sounds." /* SFX_Volume */,
    LEFT,
  );
  const uiVolumeSlider = musicPlayerUI.addSlider(
    "UI Volume" /* UI_Volume */,
    0,
    1,
    5e-3,
    "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units." /* UI_Volume */,
    LEFT,
  );
  volumeSlider?.addEventListener("input", (event) => (musicSettings.volume = parseInputFloat(event)));
  sfxVolumeSlider?.addEventListener("input", (event) => (musicSettings.sfxVolume = parseInputFloat(event)));
  uiVolumeSlider?.addEventListener("input", (event) => (musicSettings.uiVolume = parseInputFloat(event)));
  const soundtrackGroup = "Soundtrack";
  musicPlayerUI.addGroup(soundtrackGroup, GroupType.Horizontal, LEFT);
  const gameTypeRadioMap = /* @__PURE__ */ new Map();
  for (const gameType of Object.values(GameType)) {
    const description = Description[gameType];
    const radio = musicPlayerUI.addRadioButton(gameType, soundtrackGroup, description);
    gameTypeRadioMap.set(gameType, radio);
    radio.addEventListener("click", (_e) => (musicSettings.gameType = gameType));
  }
  const randomGroup = "Random Themes";
  musicPlayerUI.addGroup(randomGroup, GroupType.Horizontal, LEFT);
  const radioNormal = musicPlayerUI.addRadioButton(
    "Off" /* No_Random */,
    randomGroup,
    "Play the music depending on who the current CO is." /* No_Random */,
  );
  const radioAllRandom = musicPlayerUI.addRadioButton(
    "All Soundtracks" /* All_Random */,
    randomGroup,
    "Play random music every turn from all soundtracks." /* All_Random */,
  );
  const radioCurrentRandom = musicPlayerUI.addRadioButton(
    "Current Soundtrack" /* Current_Random */,
    randomGroup,
    "Play random music every turn from the current soundtrack." /* Current_Random */,
  );
  radioNormal.addEventListener("click", (_e) => (musicSettings.randomThemesType = RandomThemeType.NONE));
  radioAllRandom.addEventListener("click", (_e) => (musicSettings.randomThemesType = RandomThemeType.ALL_THEMES));
  radioCurrentRandom.addEventListener(
    "click",
    (_e) => (musicSettings.randomThemesType = RandomThemeType.CURRENT_SOUNDTRACK),
  );
  const randomRadioMap = /* @__PURE__ */ new Map([
    [RandomThemeType.NONE, radioNormal],
    [RandomThemeType.ALL_THEMES, radioAllRandom],
    [RandomThemeType.CURRENT_SOUNDTRACK, radioCurrentRandom],
  ]);
  const shuffleBtn = musicPlayerUI.addButton(
    "Shuffle" /* Shuffle */,
    randomGroup,
    "Changes the current theme to a new random one." /* Shuffle */,
  );
  shuffleBtn.addEventListener("click", (_e) => musicSettings.randomizeCO());
  const toggleGroup = "Extra Options";
  musicPlayerUI.addGroup(toggleGroup, GroupType.Vertical, LEFT);
  const captProgressBox = musicPlayerUI.addCheckbox(
    "Capture Progress SFX" /* Capture_Progress */,
    toggleGroup,
    "Play a sound effect when a unit makes progress capturing a property." /* Capture_Progress */,
  );
  const pipeSeamBox = musicPlayerUI.addCheckbox(
    "Pipe Seam Attack SFX" /* Pipe_Seam_SFX */,
    toggleGroup,
    "Play a sound effect when a pipe seam is attacked." /* Pipe_Seam_SFX */,
  );
  const restartThemesBox = musicPlayerUI.addCheckbox(
    "Restart Themes Every Turn" /* Restart_Themes */,
    toggleGroup,
    "Restart themes at the beginning of each turn (including replays). If disabled, themes will continue from where they left off previously." /* Restart_Themes */,
  );
  const autoplayPagesBox = musicPlayerUI.addCheckbox(
    "Autoplay Music On Other Pages" /* Autoplay_Pages */,
    toggleGroup,
    "Autoplay music on other pages like your games or during maintenance." /* Autoplay_Pages */,
  );
  const alternateThemesBox = musicPlayerUI.addCheckbox(
    "Alternate Themes" /* Alternate_Themes */,
    toggleGroup,
    "Play alternate themes like the Re-Boot Camp factory themes after a certain day. Enable this to be able to select what day alternate themes start." /* Alternate_Themes */,
  );
  captProgressBox.addEventListener("click", (_e) => (musicSettings.captureProgressSFX = captProgressBox.checked));
  pipeSeamBox.addEventListener("click", (_e) => (musicSettings.pipeSeamSFX = pipeSeamBox.checked));
  restartThemesBox.addEventListener("click", (_e) => (musicSettings.restartThemes = restartThemesBox.checked));
  autoplayPagesBox.addEventListener("click", (_e) => (musicSettings.autoplayOnOtherPages = autoplayPagesBox.checked));
  alternateThemesBox.addEventListener("click", (_e) => (musicSettings.alternateThemes = alternateThemesBox.checked));
  const daySlider = musicPlayerUI.addSlider(
    "Alternate Themes Start On Day" /* Alternate_Day */,
    0,
    30,
    1,
    "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?" /* Alternate_Day */,
    LEFT,
  );
  daySlider?.addEventListener("input", (event) => (musicSettings.alternateThemeDay = parseInputInt(event)));
  const RIGHT = MenuPosition.Right;
  const addOverrideGroup = "Override Themes";
  musicPlayerUI.addGroup(addOverrideGroup, GroupType.Horizontal, RIGHT);
  let currentSelectedCO = "andy";
  function onCOSelectorClick(coName) {
    currentSelectedCO = coName;
  }
  if (getCurrentPageType() === PageType.ActiveGame) {
    musicPlayerUI.addCOSelector(
      addOverrideGroup,
      "Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes." /* Add_Override */,
      onCOSelectorClick,
    );
  }
  const overrideGameTypeRadioMap = /* @__PURE__ */ new Map();
  for (const gameType of Object.values(GameType)) {
    const radio = musicPlayerUI.addRadioButton(
      gameType,
      addOverrideGroup,
      "Only play songs from " /* Override_Radio */ + gameType,
    );
    overrideGameTypeRadioMap.set(gameType, radio);
    radio.checked = true;
  }
  const excludeRadio = musicPlayerUI.addRadioButton(
    "Exclude Random",
    addOverrideGroup,
    "Add an override for a specific CO to exclude their themes when playing random themes." /* Add_Excluded */,
  );
  const overrideBtn = musicPlayerUI.addButton(
    "Add" /* Add_Override */,
    addOverrideGroup,
    "Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes." /* Add_Override */,
  );
  overrideBtn.addEventListener("click", (_e) => {
    if (excludeRadio.checked) {
      musicSettings.addExcludedRandomTheme(currentSelectedCO);
      return;
    }
    let currentGameType;
    for (const [gameType, radio] of overrideGameTypeRadioMap) {
      if (radio.checked) currentGameType = gameType;
    }
    if (!currentGameType) return;
    musicSettings.addOverride(currentSelectedCO, currentGameType);
  });
  const overrideListGroup = "Current Overrides (Click to Remove)";
  musicPlayerUI.addGroup(overrideListGroup, GroupType.Horizontal, RIGHT);
  const overrideDivMap = /* @__PURE__ */ new Map();
  const tableRows = 4;
  const tableCols = 7;
  musicPlayerUI.addTable(
    "Overrides" /* Override_Table */,
    tableRows,
    tableCols,
    overrideListGroup,
    "Removes the override for this specific CO." /* Remove_Override */,
  );
  function addOverrideDisplayDiv(coName, gameType) {
    const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, gameType);
    displayDiv.addEventListener("click", (_event) => {
      musicSettings.removeOverride(coName);
    });
    overrideDivMap.set(coName, displayDiv);
    musicPlayerUI.addItemToTable("Overrides" /* Override_Table */, displayDiv);
    return displayDiv;
  }
  function clearAndRepopulateOverrideList() {
    overrideDivMap.forEach((div) => div.remove());
    overrideDivMap.clear();
    musicPlayerUI.clearTable("Overrides" /* Override_Table */);
    for (const [coName, gameType] of musicSettings.overrideList) {
      addOverrideDisplayDiv(coName, gameType);
    }
  }
  const excludedListGroup = "Themes Excluded From Randomizer (Click to Remove)";
  musicPlayerUI.addGroup(excludedListGroup, GroupType.Horizontal, RIGHT);
  const excludedListDivMap = /* @__PURE__ */ new Map();
  musicPlayerUI.addTable(
    "Excluded Random Themes" /* Excluded_Table */,
    tableRows,
    tableCols,
    excludedListGroup,
    "Removes the override for this specific CO." /* Remove_Override */,
  );
  function addExcludedDisplayDiv(coName) {
    const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, "");
    displayDiv.addEventListener("click", (_event) => {
      musicSettings.removeExcludedRandomTheme(coName);
    });
    excludedListDivMap.set(coName, displayDiv);
    musicPlayerUI.addItemToTable("Excluded Random Themes" /* Excluded_Table */, displayDiv);
    return displayDiv;
  }
  function clearAndRepopulateExcludedList() {
    excludedListDivMap.forEach((div) => div.remove());
    excludedListDivMap.clear();
    musicPlayerUI.clearTable("Excluded Random Themes" /* Excluded_Table */);
    for (const coName of musicSettings.excludedRandomThemes) addExcludedDisplayDiv(coName);
  }
  musicPlayerUI.addVersion();

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

  let db = null;
  const dbName = "awbw_music_player";
  const dbVersion = 1;
  const urlQueue$1 = /* @__PURE__ */ new Set();
  const replacementListeners = /* @__PURE__ */ new Set();
  function addDatabaseReplacementListener(fn) {
    replacementListeners.add(fn);
  }
  function openDB() {
    const request = indexedDB.open(dbName, dbVersion);
    return new Promise((resolve, reject) => {
      request.onerror = (event) => reject(event);
      request.onupgradeneeded = (event) => {
        if (!event.target) return reject("No target for database upgrade.");
        const newDB = event.target.result;
        newDB.createObjectStore("music");
      };
      request.onsuccess = (event) => {
        if (!event.target) return reject("No target for database success.");
        db = event.target.result;
        db.onerror = (event2) => {
          reject(`Error accessing database: ${event2}`);
        };
        resolve();
      };
    });
  }
  function loadMusicFromDB(srcURL) {
    if (!srcURL || srcURL === "") return Promise.reject("Invalid URL.");
    if (urlQueue$1.has(srcURL)) return Promise.reject("URL is already queued for storage.");
    urlQueue$1.add(srcURL);
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database is not open.");
      const transaction = db.transaction("music", "readonly");
      const store = transaction.objectStore("music");
      const request = store.get(srcURL);
      request.onsuccess = (event) => {
        urlQueue$1.delete(srcURL);
        const blob = event.target.result;
        if (!blob) {
          return storeURLInDB(srcURL)
            .then((blob2) => resolve(URL.createObjectURL(blob2)))
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
  function storeURLInDB(url) {
    if (!db) return Promise.reject("Database not open.");
    if (!url || url === "") return Promise.reject("Invalid URL.");
    return fetch(url)
      .then((response) => response.blob())
      .then((blob) => storeBlobInDB(url, blob));
  }
  function checkHashesInDB() {
    if (!db) return Promise.reject("Database not open.");
    return fetch(HASH_JSON_URL)
      .then((response) => response.json())
      .then((hashes) => compareHashesAndReplaceIfNeeded(hashes));
  }
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
  function compareHashesAndReplaceIfNeeded(hashesJson) {
    return new Promise((resolve, reject) => {
      if (!db) return reject("Database not open.");
      if (!hashesJson) return reject("No hashes found in server.");
      const transaction = db.transaction("music", "readonly");
      const store = transaction.objectStore("music");
      const request = store.openCursor();
      request.onerror = (event) => reject(event);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (!cursor) return resolve();
        const url = cursor.key;
        const blob = cursor.value;
        const serverHash = hashesJson[url];
        cursor.continue();
        if (!serverHash) {
          logDebug("No hash found in server for", url);
          return;
        }
        getBlobMD5(blob)
          .then((hash) => {
            if (hash === serverHash) return;
            return storeURLInDB(url);
          })
          .catch((reason) => logError(`Error storing new version of ${url} in database: ${reason}`));
      };
    });
  }

  const audioMap = /* @__PURE__ */ new Map();
  const audioIDMap = /* @__PURE__ */ new Map();
  function playOneShotURL(srcURL, volume) {
    if (!musicSettings.isPlaying) return;
    const soundInstance = new Audio(srcURL);
    soundInstance.currentTime = 0;
    soundInstance.volume = volume;
    soundInstance.play();
  }
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

  const urlQueue = /* @__PURE__ */ new Set();
  const promiseMap = /* @__PURE__ */ new Map();
  function createNewAudio(srcURL, cacheURL) {
    const audioInMap = audioMap.get(srcURL);
    if (audioInMap) {
      logError("Race Condition! Please report this bug!", srcURL);
      return audioInMap;
    }
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
    return audio;
  }
  function preloadAllCommonAudio(afterPreloadFunction) {
    const audioList = getCurrentThemeURLs();
    audioList.add(getSoundEffectURL(GameSFX.uiCursorMove));
    audioList.add(getSoundEffectURL(GameSFX.uiUnitSelect));
    logDebug("Pre-loading common audio", audioList);
    preloadAudioList(audioList, afterPreloadFunction);
  }
  function preloadAudioList(audioURLs, afterPreloadFunction = () => {}) {
    let numLoadedAudios = 0;
    const onAudioPreload = (action, url) => {
      numLoadedAudios++;
      const loadPercentage = (numLoadedAudios / audioURLs.size) * 100;
      musicPlayerUI.setProgress(loadPercentage);
      if (numLoadedAudios >= audioURLs.size) {
        numLoadedAudios = 0;
        if (afterPreloadFunction) afterPreloadFunction();
      }
      if (action === "error") {
        log(`Could not pre-load: ${url}. This might not be a problem, the audio may still play normally later.`);
        audioMap.delete(url);
        return;
      }
      if (!audioMap.has(url)) {
        logError("Race condition on pre-load! Please report this bug!", url);
      }
    };
    audioURLs.forEach((url) => {
      if (audioMap.has(url)) {
        numLoadedAudios++;
        return;
      }
      preloadURL(url)
        .then((audio) => {
          audio.once("load", () => onAudioPreload("load", url));
          audio.once("loaderror", () => onAudioPreload("error", url));
        })
        .catch((_reason) => onAudioPreload("error", url));
    });
  }
  async function preloadURL(srcURL) {
    const audio = audioMap.get(srcURL);
    if (audio) return audio;
    if (urlQueue.has(srcURL)) {
      const storedPromise = promiseMap.get(srcURL);
      if (!storedPromise) return Promise.reject(`No promise found for ${srcURL}, please report this bug!`);
      return storedPromise;
    }
    urlQueue.add(srcURL);
    const promise = loadMusicFromDB(srcURL).then(
      (localCacheURL) => createNewAudio(srcURL, localCacheURL),
      (reason) => {
        logDebug(reason, srcURL);
        return createNewAudio(srcURL, srcURL);
      },
    );
    promiseMap.set(srcURL, promise);
    return promise;
  }

  const unitIDAudioMap = /* @__PURE__ */ new Map();
  function playMovementSound(unitId) {
    if (!musicSettings.isPlaying) return;
    if (!unitIDAudioMap.has(unitId)) {
      const unitName = getUnitName(unitId);
      if (!unitName) return;
      const movementSoundURL = getMovementSoundURL(unitName);
      if (!movementSoundURL) {
        logError("No movement sound for", unitName);
        return;
      }
      unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
    }
    const movementAudio = unitIDAudioMap.get(unitId);
    if (!movementAudio) return;
    movementAudio.currentTime = 0;
    movementAudio.loop = false;
    movementAudio.volume = musicSettings.sfxVolume;
    movementAudio.play();
  }
  function stopMovementSound(unitId, rolloff = true) {
    if (!musicSettings.isPlaying) return;
    if (!unitIDAudioMap.has(unitId)) return;
    const movementAudio = unitIDAudioMap.get(unitId);
    if (!movementAudio || movementAudio.paused) return;
    if (movementAudio.readyState != HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      movementAudio.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
      return;
    }
    movementAudio.pause();
    movementAudio.currentTime = 0;
    const unitName = getUnitName(unitId);
    if (!rolloff || !unitName) return;
    if (hasMovementRollOff(unitName)) {
      const audioURL = getMovementRollOffURL(unitName);
      playOneShotURL(audioURL, musicSettings.sfxVolume);
    }
  }
  function stopAllMovementSounds() {
    for (const unitId of unitIDAudioMap.keys()) {
      stopMovementSound(unitId, false);
    }
  }
  function whenAudioLoadsPauseIt(event) {
    event.target.pause();
  }

  let currentThemeURL = "";
  let currentLoops = 0;
  const specialLoopMap = /* @__PURE__ */ new Map();
  addSettingsChangeListener(onSettingsChange);
  addDatabaseReplacementListener((url) => {
    const audio = audioMap.get(url);
    if (!audio) return;
    log("A new version of", url, " is available. Replacing the old version.");
    if (audio.playing()) audio.stop();
    urlQueue.delete(url);
    promiseMap.delete(url);
    audioMap.delete(url);
    audioIDMap.delete(url);
    preloadURL(url)
      .catch((reason) => logError(reason))
      .finally(() => playThemeSong());
  });
  let currentlyDelaying = false;
  async function playMusicURL(srcURL) {
    const specialLoopURL = specialLoopMap.get(srcURL);
    if (specialLoopURL) srcURL = specialLoopURL;
    if (srcURL !== currentThemeURL) {
      stopThemeSong();
      currentThemeURL = srcURL;
    }
    const nextSong = audioMap.get(srcURL) ?? (await preloadURL(srcURL));
    nextSong.loop(!hasSpecialLoop(srcURL));
    nextSong.volume(getVolumeForURL(srcURL));
    nextSong.on("play", () => onThemePlay(nextSong, srcURL));
    nextSong.on("load", () => playThemeSong());
    nextSong.on("end", () => onThemeEndOrLoop(srcURL));
    if (!nextSong.playing() && musicSettings.isPlaying) {
      log("Now Playing: ", srcURL, " | Cached? =", nextSong._src !== srcURL);
      const newID = nextSong.play();
      if (!newID) return;
      audioIDMap.set(srcURL, newID);
    }
  }
  function playThemeSong() {
    if (!musicSettings.isPlaying) return;
    if (currentlyDelaying) return;
    let gameType = undefined;
    let coName = currentPlayer.coName;
    const isEndTheme = coName === "victory" || coName === "defeat";
    const isRandomTheme = musicSettings.randomThemesType !== RandomThemeType.NONE;
    if (isRandomTheme && !isEndTheme) {
      coName = musicSettings.currentRandomCO;
      if (musicSettings.randomThemesType === RandomThemeType.ALL_THEMES) gameType = musicSettings.currentRandomGameType;
    }
    if (!coName) {
      if (!currentThemeURL || currentThemeURL === "") return;
      playMusicURL(currentThemeURL);
      return;
    }
    playMusicURL(getMusicURL(coName, gameType));
  }
  function stopThemeSong(delayMS = 0) {
    if (delayMS > 0) {
      window.setTimeout(() => {
        currentlyDelaying = false;
        playThemeSong();
      }, delayMS);
      currentlyDelaying = true;
    }
    const currentTheme = audioMap.get(currentThemeURL);
    if (!currentTheme) return;
    logDebug("Pausing: ", currentThemeURL);
    currentTheme.pause();
  }
  function stopAllSounds() {
    stopThemeSong();
    stopAllMovementSounds();
    for (const audio of audioMap.values()) {
      if (audio.playing()) audio.pause();
    }
  }
  function onThemePlay(audio, srcURL) {
    currentLoops = 0;
    audio.volume(getVolumeForURL(srcURL));
    const isPowerTheme = musicSettings.themeType !== ThemeType.REGULAR;
    const isRandomTheme = musicSettings.randomThemesType !== RandomThemeType.NONE;
    const shouldRestart = musicSettings.restartThemes || isPowerTheme || isRandomTheme;
    const currentPosition = audio.seek();
    const isGamePageActive = getCurrentPageType() === PageType.ActiveGame;
    if (shouldRestart && isGamePageActive && currentPosition > 0.1) {
      audio.seek(0);
    }
    if (currentThemeURL !== srcURL && audio.playing()) {
      audio.pause();
      playThemeSong();
    }
    const audioID = audioIDMap.get(srcURL);
    if (!audioID) return;
    for (const id of audio._getSoundIds()) {
      if (id !== audioID) audio.stop(id);
    }
  }
  function onThemeEndOrLoop(srcURL) {
    currentLoops++;
    if (currentThemeURL !== srcURL) {
      logError("Playing more than one theme at a time! Please report this bug!", srcURL);
      return;
    }
    if (hasSpecialLoop(srcURL)) {
      const loopURL = srcURL.replace(".ogg", "-loop.ogg");
      specialLoopMap.set(srcURL, loopURL);
      playThemeSong();
    }
    if (srcURL === SpecialTheme.Victory || srcURL === SpecialTheme.Defeat) {
      if (currentLoops >= 5) playMusicURL(SpecialTheme.COSelect);
    }
    if (musicSettings.randomThemesType !== RandomThemeType.NONE) {
      musicSettings.randomizeCO();
      playThemeSong();
    }
  }
  function playOrPauseWhenWindowFocusChanges() {
    window.addEventListener("blur", () => {
      if (musicSettings.isPlaying) stopAllSounds();
    });
    window.addEventListener("focus", () => {
      if (musicSettings.isPlaying) playThemeSong();
    });
  }
  function onSettingsChange(key, isFirstLoad) {
    if (isFirstLoad) return;
    switch (key) {
      case SettingsKey.ADD_OVERRIDE:
      case SettingsKey.REMOVE_OVERRIDE:
      case SettingsKey.OVERRIDE_LIST:
      case SettingsKey.CURRENT_RANDOM_CO:
      case SettingsKey.IS_PLAYING:
        return musicSettings.isPlaying ? playThemeSong() : stopAllSounds();
      case SettingsKey.GAME_TYPE:
      case SettingsKey.ALTERNATE_THEME_DAY:
      case SettingsKey.ALTERNATE_THEMES:
        return window.setTimeout(() => playThemeSong(), 500);
      case SettingsKey.THEME_TYPE:
        return playThemeSong();
      case SettingsKey.REMOVE_EXCLUDED:
        if (musicSettings.excludedRandomThemes.size === 27) musicSettings.randomizeCO();
        return playThemeSong();
      case SettingsKey.EXCLUDED_RANDOM_THEMES:
      case SettingsKey.ADD_EXCLUDED:
        if (musicSettings.excludedRandomThemes.has(musicSettings.currentRandomCO)) musicSettings.randomizeCO();
        return playThemeSong();
      case SettingsKey.RANDOM_THEMES_TYPE: {
        const randomThemes = musicSettings.randomThemesType !== RandomThemeType.NONE;
        if (!randomThemes) return playThemeSong();
        musicSettings.randomizeCO();
        playThemeSong();
        return;
      }
      case SettingsKey.VOLUME: {
        const currentTheme = audioMap.get(currentThemeURL);
        if (currentTheme) currentTheme.volume(musicSettings.volume);
        if (!currentTheme) {
          const intervalID = window.setInterval(() => {
            const currentTheme2 = audioMap.get(currentThemeURL);
            if (currentTheme2) {
              currentTheme2.volume(musicSettings.volume);
              clearInterval(intervalID);
            }
          });
        }
        for (const srcURL of audioMap.keys()) {
          const audio = audioMap.get(srcURL);
          if (audio) audio.volume(getVolumeForURL(srcURL));
        }
        return;
      }
    }
  }

  async function playSFX(sfx) {
    if (!musicSettings.isPlaying) return;
    if (!musicSettings.captureProgressSFX && sfx === GameSFX.unitCaptureProgress) return;
    if (!musicSettings.pipeSeamSFX && sfx === GameSFX.unitAttackPipeSeam) return;
    const sfxURL = getSoundEffectURL(sfx);
    const audio = audioMap.get(sfxURL) ?? (await preloadURL(sfxURL));
    audio.volume(getVolumeForURL(sfxURL));
    audio.seek(0);
    if (audio.playing()) return;
    const newID = audio.play();
    if (!newID) return;
    audioIDMap.set(sfxURL, newID);
  }

  const CURSOR_THRESHOLD_MS = 25;
  let lastCursorCall = Date.now();
  let lastCursorX = -1;
  let lastCursorY = -1;
  let currentMenuType = "None"; /* None */
  const visibilityMap = /* @__PURE__ */ new Map();
  const movementResponseMap = /* @__PURE__ */ new Map();
  const clickedDamageSquaresMap = /* @__PURE__ */ new Map();
  let ahQueryTurn;
  let ahShowEventScreen;
  let ahShowEndGameScreen;
  let ahOpenMenu;
  let ahCloseMenu;
  let ahCreateDamageSquares;
  let ahUnitClick;
  let ahWait;
  let ahAnimUnit;
  let ahAnimExplosion;
  let ahFog;
  let ahFire;
  let ahAttackSeam;
  let ahMove;
  let ahCapt;
  let ahBuild;
  let ahLoad;
  let ahUnload;
  let ahSupply;
  let ahRepair;
  let ahHide;
  let ahUnhide;
  let ahJoin;
  let ahLaunch;
  let ahNextTurn;
  let ahElimination;
  let ahPower;
  let ahGameOver;
  let ahResign;
  function addHandlers() {
    ahQueryTurn = null;
    ahShowEventScreen = null;
    ahShowEndGameScreen = null;
    ahOpenMenu = null;
    ahCloseMenu = null;
    ahCreateDamageSquares = null;
    ahUnitClick = null;
    ahWait = null;
    ahAnimUnit = null;
    ahAnimExplosion = null;
    ahFog = null;
    ahFire = null;
    ahAttackSeam = null;
    ahMove = null;
    ahCapt = null;
    ahBuild = null;
    ahLoad = null;
    ahUnload = null;
    ahSupply = null;
    ahRepair = null;
    ahHide = null;
    ahUnhide = null;
    ahJoin = null;
    ahLaunch = null;
    ahNextTurn = null;
    ahElimination = null;
    ahPower = null;
    ahGameOver = null;
    ahResign = null;
    const currentPageType = getCurrentPageType();
    if (currentPageType === PageType.Maintenance) return;
    addUpdateCursorObserver(onCursorMove);
    switch (currentPageType) {
      case PageType.ActiveGame:
        addReplayHandlers();
        addGameHandlers();
        return;
      case PageType.MapEditor:
        return;
      case PageType.MovePlanner:
        return;
    }
  }
  function syncMusic() {
    musicSettings.themeType = getCurrentThemeType();
    playThemeSong();
    window.setTimeout(() => {
      playThemeSong();
    }, 500);
  }
  function refreshMusicForNextTurn(playDelayMS = 0) {
    visibilityMap.clear();
    musicSettings.randomizeCO();
    musicSettings.themeType = getCurrentThemeType();
    window.setTimeout(() => {
      musicSettings.themeType = getCurrentThemeType();
      playThemeSong();
      window.setTimeout(playThemeSong, 250);
    }, playDelayMS);
  }
  function addReplayHandlers() {
    const replayForwardActionBtn = getReplayForwardActionBtn();
    const replayBackwardActionBtn = getReplayBackwardActionBtn();
    const replayForwardBtn = getReplayForwardBtn();
    const replayBackwardBtn = getReplayBackwardBtn();
    const replayOpenBtn = getReplayOpenBtn();
    const replayCloseBtn = getReplayCloseBtn();
    const replayDaySelectorCheckBox = getReplayDaySelectorCheckBox();
    replayBackwardActionBtn.addEventListener("click", syncMusic);
    replayForwardActionBtn.addEventListener("click", syncMusic);
    replayForwardBtn.addEventListener("click", syncMusic);
    replayBackwardBtn.addEventListener("click", syncMusic);
    replayDaySelectorCheckBox.addEventListener("change", syncMusic);
    replayCloseBtn.addEventListener("click", syncMusic);
    replayBackwardActionBtn.addEventListener("click", stopAllMovementSounds);
    replayOpenBtn.addEventListener("click", stopAllMovementSounds);
    replayCloseBtn.addEventListener("click", stopAllMovementSounds);
    replayCloseBtn.addEventListener("click", () => refreshMusicForNextTurn(500));
    replayOpenBtn.addEventListener("click", () => {
      if (ahQueryTurn !== null) return;
      ahQueryTurn = getQueryTurnFn();
      queryTurn = onQueryTurn;
    });
  }
  function addGameHandlers() {
    ahShowEventScreen = getShowEventScreenFn();
    ahShowEndGameScreen = getShowEndGameScreenFn();
    ahOpenMenu = getOpenMenuFn();
    ahCloseMenu = getCloseMenuFn();
    ahCreateDamageSquares = getCreateDamageSquaresFn();
    ahUnitClick = getUnitClickFn();
    ahWait = getWaitFn();
    ahAnimUnit = getAnimUnitFn();
    ahAnimExplosion = getAnimExplosionFn();
    ahFog = getFogFn();
    ahFire = getFireFn();
    ahAttackSeam = getAttackSeamFn();
    ahMove = getMoveFn();
    ahCapt = getCaptFn();
    ahBuild = getBuildFn();
    ahLoad = getLoadFn();
    ahUnload = getUnloadFn();
    ahSupply = getSupplyFn();
    ahRepair = getRepairFn();
    ahHide = getHideFn();
    ahUnhide = getUnhideFn();
    ahJoin = getJoinFn();
    ahLaunch = getLaunchFn();
    ahNextTurn = getNextTurnFn();
    ahElimination = getEliminationFn();
    ahPower = getPowerFn();
    ahGameOver = getGameOverFn();
    ahResign = getResignFn();
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
    if (!musicSettings.isPlaying) return;
    const dx = Math.abs(cursorX - lastCursorX);
    const dy = Math.abs(cursorY - lastCursorY);
    const cursorMoved = dx >= 1 || dy >= 1;
    const timeSinceLastCursorCall = Date.now() - lastCursorCall;
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
    refreshMusicForNextTurn(250);
    return result;
  }
  function onShowEventScreen(event) {
    ahShowEventScreen?.apply(ahShowEventScreen, [event]);
    if (!musicSettings.isPlaying) return;
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
    refreshMusicForNextTurn();
  }
  function onOpenMenu(menu, x, y) {
    ahOpenMenu?.apply(openMenu, [menu, x, y]);
    if (!musicSettings.isPlaying) return;
    currentMenuType = "Regular" /* Regular */;
    playSFX(GameSFX.uiMenuOpen);
    const menuOptions = document.getElementsByClassName("menu-option");
    for (let i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseenter", (_e) => playSFX(GameSFX.uiMenuMove));
      menuOptions[i].addEventListener("click", (event) => {
        const target = event.target;
        if (!target) return;
        if (
          target.classList.contains("forbidden") ||
          target.parentElement?.classList.contains("forbidden") ||
          target.parentElement?.parentElement?.classList.contains("forbidden") ||
          target.parentElement?.parentElement?.parentElement?.classList.contains("forbidden")
        ) {
          playSFX(GameSFX.uiInvalid);
          return;
        }
        currentMenuType = "None" /* None */;
        playSFX(GameSFX.uiMenuOpen);
      });
    }
  }
  function onCloseMenu() {
    ahCloseMenu?.apply(closeMenu, []);
    if (!musicSettings.isPlaying) return;
    const isMenuOpen = currentMenuType !== "None"; /* None */
    if (isMenuOpen) {
      playSFX(GameSFX.uiMenuClose);
      clickedDamageSquaresMap.clear();
      currentMenuType = "None" /* None */;
    }
  }
  function onCreateDamageSquares(attackerUnit, unitsInRange, movementInfo, movingUnit) {
    ahCreateDamageSquares?.apply(createDamageSquares, [attackerUnit, unitsInRange, movementInfo, movingUnit]);
    if (!musicSettings.isPlaying) return;
    for (const damageSquare of getAllDamageSquares()) {
      damageSquare.addEventListener("click", (event) => {
        if (!event.target) return;
        const targetSpan = event.target;
        playSFX(GameSFX.uiMenuOpen);
        if (clickedDamageSquaresMap.has(targetSpan)) {
          currentMenuType = "None" /* None */;
          clickedDamageSquaresMap.clear();
          return;
        }
        currentMenuType = "DamageSquare" /* DamageSquare */;
        clickedDamageSquaresMap.set(targetSpan, true);
      });
    }
  }
  function onUnitClick(clicked) {
    ahUnitClick?.apply(unitClickHandler, [clicked]);
    if (!musicSettings.isPlaying) return;
    const unitInfo = getUnitInfo(Number(clicked.id));
    if (!unitInfo) return;
    const myID = getMyID();
    const isUnitWaited = hasUnitMovedThisTurn(unitInfo.units_id);
    const isMyUnit = unitInfo?.units_players_id === myID;
    const isMyTurn = currentTurn === myID;
    const canActionsBeTaken = !isUnitWaited && isMyUnit && isMyTurn && !isReplayActive();
    currentMenuType = canActionsBeTaken ? "UnitSelect" /* UnitSelect */ : "None" /* None */;
    playSFX(GameSFX.uiUnitSelect);
  }
  function onUnitWait(unitId) {
    ahWait?.apply(waitUnit, [unitId]);
    if (!musicSettings.isPlaying) return;
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
    if (!isValidUnit(unitId) || !path || !i) return;
    if (i >= path.length) return;
    if (visibilityMap.has(unitId)) return;
    const unitVisible = path[i].unit_visible;
    if (!unitVisible) {
      visibilityMap.set(unitId, unitVisible);
      window.setTimeout(() => stopMovementSound(unitId, false), 1e3);
    }
  }
  function onAnimExplosion(unit) {
    ahAnimExplosion?.apply(animExplosion, [unit]);
    if (!musicSettings.isPlaying) return;
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
    const attackerID = response.copValues.attacker.playerId;
    const defenderID = response.copValues.defender.playerId;
    const couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
    const couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
    const couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
    const couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);
    ahFire?.apply(actionHandlers.Fire, [response]);
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
        { then: [0, -0.05, stepsY] },
        { then: [-0.2 * 2, 0, stepsX] },
        { then: [deltaX * 2, 0, stepsX] },
        { then: [0, -0.05, stepsY] },
        { then: [-0.2 * 2, 0, stepsX] },
        { then: [deltaX * 2, 0, stepsX] },
        { then: [0, deltaY, stepsY] },
        { then: [-0.2 * 2, 0, stepsX] },
        { then: [deltaX, 0, stepsX] },
        { then: [0, deltaY, stepsY] },
      );
    };
    window.setTimeout(wiggleAnimation, startDelay);
  }
  function onAttackSeam(response) {
    ahAttackSeam?.apply(actionHandlers.AttackSeam, [response]);
    if (!musicSettings.isPlaying) return;
    const seamWasDestroyed = response.seamHp <= 0;
    if (areAnimationsEnabled()) {
      const x = response.seamX;
      const y = response.seamY;
      const pipeSeamInfo = getBuildingInfo(x, y);
      if (!pipeSeamInfo) return;
      const pipeSeamDiv = getBuildingDiv(pipeSeamInfo.buildings_id);
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
    const finishedCapture = data.newIncome != null;
    if (!finishedCapture) {
      playSFX(GameSFX.unitCaptureProgress);
      return;
    }
    const myID = getMyID();
    const isSpectator = isPlayerSpectator(myID);
    const isMyCapture = data.buildingInfo.buildings_team === myID.toString() || isSpectator;
    const sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
    playSFX(sfx);
  }
  function onBuild(data) {
    ahBuild?.apply(actionHandlers.Build, [data]);
    if (!musicSettings.isPlaying) return;
    const myID = getMyID();
    const isMyBuild = data.newUnit.units_players_id == myID;
    const isReplay = isReplayActive();
    if (!isMyBuild || isReplay) playSFX(GameSFX.unitSupply);
  }
  function onLoad(data) {
    ahLoad?.apply(actionHandlers.Load, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitLoad);
  }
  function onUnload(data) {
    ahUnload?.apply(actionHandlers.Unload, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitUnload);
  }
  function onSupply(data) {
    ahSupply?.apply(actionHandlers.Supply, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitSupply);
  }
  function onRepair(data) {
    ahRepair?.apply(actionHandlers.Repair, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitSupply);
  }
  function onHide(data) {
    ahHide?.apply(actionHandlers.Hide, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitHide);
    stopMovementSound(data.unitId);
  }
  function onUnhide(data) {
    ahUnhide?.apply(actionHandlers.Unhide, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitUnhide);
    stopMovementSound(data.unitId);
  }
  function onJoin(data) {
    ahJoin?.apply(actionHandlers.Join, [data]);
    if (!musicSettings.isPlaying) return;
    stopMovementSound(data.joinID);
    stopMovementSound(data.joinedUnit.units_id);
  }
  function onLaunch(data) {
    ahLaunch?.apply(actionHandlers.Launch, [data]);
    if (!musicSettings.isPlaying) return;
    playSFX(GameSFX.unitMissileSend);
    window.setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
  }
  function onNextTurn(data) {
    ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
    if (!musicSettings.isPlaying) return;
    if (data.swapCos) {
      playSFX(GameSFX.tagSwap);
    }
    refreshMusicForNextTurn();
  }
  function onElimination(data) {
    ahElimination?.apply(actionHandlers.Elimination, [data]);
    if (!musicSettings.isPlaying) return;
    refreshMusicForNextTurn();
  }
  function onGameOver() {
    ahGameOver?.apply(actionHandlers.GameOver, []);
    if (!musicSettings.isPlaying) return;
    refreshMusicForNextTurn();
  }
  function onResign(data) {
    ahResign?.apply(actionHandlers.Resign, [data]);
    if (!musicSettings.isPlaying) return;
    refreshMusicForNextTurn();
  }
  function onPower(data) {
    ahPower?.apply(actionHandlers.Power, [data]);
    if (!musicSettings.isPlaying) return;
    const coName = data.coName;
    const isBH = isBlackHoleCO(coName);
    const isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;
    musicSettings.themeType = isSuperCOPower ? ThemeType.SUPER_CO_POWER : ThemeType.CO_POWER;
    switch (musicSettings.gameType) {
      case GameType.AW1:
        playSFX(GameSFX.powerActivateAW1COP);
        return;
      case GameType.AW2:
      case GameType.DS:
      case GameType.RBC: {
        if (isSuperCOPower) {
          const sfx2 = isBH ? GameSFX.powerActivateBHSCOP : GameSFX.powerActivateAllySCOP;
          const delay2 = isBH ? 1916 : 1100;
          playSFX(sfx2);
          stopThemeSong(delay2);
          break;
        }
        const sfx = isBH ? GameSFX.powerActivateBHCOP : GameSFX.powerActivateAllyCOP;
        const delay = isBH ? 1019 : 881;
        playSFX(sfx);
        stopThemeSong(delay);
        break;
      }
    }
    if (coName === "Colin" && !isSuperCOPower) {
      window.setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
    }
  }
  function onConnectionError(closeMsg) {
    closeMsg = closeMsg.toLowerCase();
    if (closeMsg.includes("connected to another game")) stopThemeSong();
  }

  function onLiveQueue() {
    const addMusicFn = () => {
      const blockerPopup = getLiveQueueBlockerPopup();
      if (!blockerPopup) return false;
      if (blockerPopup.style.display === "none") return false;
      const popup = getLiveQueueSelectPopup();
      if (!popup) return false;
      const box = popup.querySelector(".flex.row.hv-center");
      if (!box) return false;
      musicPlayerUI.addToAWBWPage(box, true);
      musicSettings.randomThemesType = RandomThemeType.NONE;
      playMusicURL(SpecialTheme.COSelect);
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
      clearInterval(addPlayerIntervalID);
      window.setInterval(() => {
        if (checkStillActiveFn()) playThemeSong();
      }, 500);
    }, 500);
  }
  let setHashesTimeoutID;
  function preloadThemes() {
    preloadAllCommonAudio(() => {
      log("All common audio has been pre-loaded!");
      musicSettings.themeType = getCurrentThemeType();
      musicPlayerUI.updateAllInputLabels();
      playThemeSong();
      if (!setHashesTimeoutID) {
        const checkHashesMS = 1e3 * 60 * 1;
        const checkHashesFn = () => {
          checkHashesInDB()
            .then(() => log("All music files have been checked for updates."))
            .catch((reason) => logError("Could not check for music file updates:", reason));
          setHashesTimeoutID = window.setTimeout(checkHashesFn, checkHashesMS);
        };
        checkHashesFn();
      }
      musicPlayerUI.checkIfNewVersionAvailable();
    });
  }
  function initializeMusicPlayer() {
    initializeMusicPlayerUI();
    const currentPageType = getCurrentPageType();
    if (currentPageType !== PageType.ActiveGame) musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;
    log("Initializing music player for page type:", currentPageType);
    addHandlers();
    switch (currentPageType) {
      case PageType.LiveQueue:
        return onLiveQueue();
      case PageType.Maintenance:
        musicPlayerUI.openContextMenu();
        musicSettings.randomThemesType = RandomThemeType.NONE;
        playMusicURL(SpecialTheme.Maintenance);
        break;
      case PageType.MovePlanner:
        musicSettings.isPlaying = true;
        break;
      // case PageType.MainPage:
      //   return;
      case PageType.ActiveGame:
        preloadThemes();
        break;
      case PageType.MapEditor:
        preloadThemes();
        break;
      default:
        musicSettings.randomThemesType = RandomThemeType.NONE;
        playMusicURL(SpecialTheme.ModeSelect);
        break;
    }
    allowSettingsToBeSaved();
  }
  let mainFunctionExecuted = false;
  function main() {
    if (mainFunctionExecuted) {
      initializeMusicPlayer();
      return;
    }
    const ifCanAutoplay = () => {
      initializeMusicPlayer();
    };
    const ifCannotAutoplay = () => {
      musicPlayerUI.addEventListener("click", () => initializeMusicPlayer(), { once: true });
      document.querySelector("body")?.addEventListener("click", () => initializeMusicPlayer(), { once: true });
    };
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
      })
      .finally(() => (mainFunctionExecuted = true));
  }
  loadSettingsFromLocalStorage();
  if (self === top) {
    log("Opening database to cache music files.");
    openDB()
      .then(() => log("Database opened successfully. Ready to cache music files."))
      .catch((reason) => logDebug(`Database Error: ${reason}. Will not be able to cache music files locally.`))
      .finally(() => {
        initializeIFrame(main);
        main();
      });
  }

  exports.initializeMusicPlayer = initializeMusicPlayer;
  exports.main = main;
  exports.notifyCOSelectorListeners = notifyCOSelectorListeners;

  return exports;
})({}, canAutoplay, SparkMD5);
