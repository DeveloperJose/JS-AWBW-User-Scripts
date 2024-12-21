// ==UserScript==
// @name AWBW Music Player (DeveloperJose Edition)
// @description A comprehensive audio player that attempts to recreate the cart experience. Modified from the original script so now the music won't change if the next CO is the same as the previous CO.
// @version 2.0.8
// @author Original by twiggy_, modified by DeveloperJose
// @homepage https://github.com/DeveloperJose/JS-AWBW-User-Scripts#readme
// @supportURL https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @match https://awbw.amarriner.com/*?games_id=*
// @match https://awbw.amarriner.com/*?replays_id=*
// @match https://awbw.amarriner.com/*editmap*
// @icon https://awbw.amarriner.com/favicon.ico
// @license MIT
// @namespace https://awbw.amarriner.com/
// ==/UserScript==

/******/ var __webpack_modules__ = ({

/***/ 343:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Context Menu */
.cls-context-menu-link {
  display: block;
  padding: 20px;
  background: #ececec;
}

.cls-context-menu {
  position: absolute;
  display: none;
  width: 175px;
  height: 347px;
  padding-top: 4px;
}

.cls-context-menu ul,
#context-menu li {
  list-style: none;
  margin: 0;
  padding: 0;
  background: white;
}

.cls-context-menu {
  border: 1px solid #888888 !important;
}
.cls-context-menu li {
  border: 1px solid #888888;
}
.cls-context-menu li:last-child {
  border: none;
}
.cls-context-menu li a {
  display: block;
  padding: 5px 10px;
  text-decoration: none;
  color: blue;
}
.cls-context-menu li a:hover {
  background: blue;
  color: #fff;
}

/* Input Range */
:root {
  --shadow-len: -60px;
}
input[type="range"] {
  margin: auto;
  -webkit-appearance: none;
  position: relative;
  overflow: hidden;
  height: 25px;
  cursor: pointer;
  border-radius: 0; /* iOS */
}

::-webkit-slider-runnable-track {
  background: #ddd;
}

/*
     * 1. Set to 0 width and remove border for a slider without a thumb
     * 2. Shadow is negative the full width of the input and has a spread
     *    of the width of the input.
     */
::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px; /* 1 */
  height: 25px;
  background: #fff;
  box-shadow: -200px 0 0 200px #0066cc; /* 2 */
  border: 2px solid #888888; /* 1 */
  clip-path: inset(0px 0px 0px let(--shadow-len));
}

::-moz-range-track {
  height: 25px;
  background: #888888;
}

::-moz-range-thumb {
  background: #fff;
  height: 25px;
  width: 20px;
  border: 3px solid #888888;
  border-radius: 0 !important;
  box-shadow: -200px 0 0 200px #0066cc;
  box-sizing: border-box;
  clip-path: inset(0px 0px 0px let(--shadow-len));
}

::-ms-fill-lower {
  background: #0066cc;
}

::-ms-thumb {
  background: #fff;
  border: 3px solid #999;
  height: 25px;
  width: 20px;
  box-sizing: border-box;
}

::-ms-ticks-after {
  display: none;
}

::-ms-ticks-before {
  display: none;
}

::-ms-track {
  background: #888888;
  color: transparent;
  height: 25px;
  border: none;
}

::-ms-tooltip {
  display: none;
}

.theme-radio-btn {
  height: 14px;
  width: 14px;
}

.theme-radio-btn:hover {
  cursor: pointer;
}

#shuffle-button {
  font-family: "Nova Square", cursive;
  line-height: 25px;
}

.shuffle-button-enabled {
  color: white;
  background: #0066cc;
  border: 2px solid #0066cc;
}

.shuffle-button-enabled:hover {
  cursor: pointer;
}

.shuffle-button-enabled:active {
  color: black;
  background: white;
  border: 2px solid #888888;
}

.shuffle-button-disabled {
  color: white;
  background: #888888;
  border: 2px solid #888888;
}

.blob {
  animation: shine 1.5s ease-in-out infinite;
  animation-fill-mode: forwards;
  animation-direction: alternate;
}

#version-link {
  color: #0066cc;
  font-weight: bold;
  text-decoration: underline;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 314:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 601:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 72:
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 659:
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 540:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 825:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ 113:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 373:
/***/ ((__unused_webpack_module, exports) => {

var __webpack_unused_export__;
const devPort = "12345";
__webpack_unused_export__ = devPort;

const proxyScript = {
  baseURL: "http://127.0.0.1:" + devPort,
  filename: "[basename].proxy.user.js",
};
__webpack_unused_export__ = proxyScript;

const versions = {
  musicPlayer: "2.0.8",
  highlightCoordinates: "1.0.1",
};
exports.e4 = versions;


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ (() => {
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		var getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/nonce */
/******/ (() => {
/******/ 	__webpack_require__.nc = undefined;
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// ./shared/awbw_site.js
/*
 * Constants, functions, and computed variables that come from analyzing the web pages of AWBW.
 * Another way to think of this file is that it represents the AWBW "API".
 */
/********************** AWBW Page Elements ***********************/
// More can be easily found here https://awbw.amarriner.com/js/lib/game.js?1733945699
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

/********************** AWBW Page Variables ***********************/
/* global maxX, maxY, gameAnims */
/* global playersInfo, unitsInfo, currentTurn */
/* global playerKeys */
let mapCols = (/* unused pure expression or super */ null && (maxX));
let mapRows = (/* unused pure expression or super */ null && (maxY));
let gameAnimations = gameAnims;

/********************** AWBW Computed Variables ***********************/
let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;
let myName = document
  .querySelector("#profile-menu")
  .getElementsByClassName("dropdown-menu-link")[0]
  .href.split("username=")[1];

let menu = isMapEditor
  ? document.querySelector("#replay-misc-controls")
  : document.querySelector("#game-map-menu").parentNode;

let myID = null;
function getMyID() {
  if (myID === null) {
    Object.values(playersInfo).forEach((entry) => {
      if (entry.users_username === myName) {
        myID = entry.players_id;
      }
    });
  }
  return myID;
}

function isPlayerSpectator(pid) {
  return !playerKeys.includes(pid);
}

function canPlayerActivateCOPower(pid) {
  let info = playersInfo[pid];
  return info.players_co_power >= info.players_co_max_power;
}

function canPlayerActivateSuperCOPower(pid) {
  let info = playersInfo[pid];
  return info.players_co_power >= info.players_co_max_spower;
}

/**
 * Useful variables related to the current turn's player.
 */
const currentPlayer = {
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
function getAllCONames() {
  let coNames = [];
  Object.keys(playersInfo).forEach((playerID) => {
    coNames.push(playersInfo[playerID]["co_name"]);
  });
  return coNames;
}

function getUnitInfo(unitID) {
  return unitsInfo[unitID];
}

function getUnitName(unitID) {
  return getUnitInfo(unitID)?.units_name;
}

function isValidUnit(unitID) {
  return unitID !== undefined && unitsInfo[unitID] !== undefined;
}

function hasUnitMovedThisTurn(unitID) {
  return isValidUnit(unitID) && getUnitInfo(unitID)?.units_moved == 1;
}

;// ./shared/utils.js
/**
 *
 */
var on = (() => {
  if (window.addEventListener) {
    return (target, type, listener) => {
      if (target === null) {
        console.log(
          "[AWBW Improved Music Player] Could not add event listener: " + target + "/" + type,
        );
        return;
      }
      target.addEventListener(type, listener, false);
    };
  } else {
    return (object, sEvent, fpNotify) => {
      if (object === null) {
        console.log(
          "[AWBW Improved Music Player] Could not add event listener: " + object + "/" + sEvent,
        );
        return;
      }
      object.attachEvent("on" + sEvent, fpNotify);
    };
  }
})();

;// ./music_player/music_settings.js


const STORAGE_KEY = "musicPlayerSettings";

// Enums
// Keys and values must match exactly for it to work properly
// It's the easiest solution

const GAME_TYPE = Object.freeze({
  AW1: "AW1",
  AW2: "AW2",
  AW_RBC: "AW_RBC",
  AW_DS: "AW_DS",
});

const THEME_TYPE = Object.freeze({
  REGULAR: "REGULAR",
  CO_POWER: "CO_POWER",
  SUPER_CO_POWER: "SUPER_CO_POWER",
});

const coPowerStateToThemeType = new Map([
  ["N", THEME_TYPE.REGULAR],
  ["Y", THEME_TYPE.CO_POWER],
  ["S", THEME_TYPE.SUPER_CO_POWER],
]);

function getCurrentThemeType() {
  let currentCOPowerState = currentPlayer.coPowerState;
  return coPowerStateToThemeType.get(currentCOPowerState);
}

const onSettingsChangeListeners = [];
function addSettingsChangeListener(fn) {
  onSettingsChangeListeners.push(fn);
}

const musicPlayerSettings = {
  __isPlaying: false,
  __volume: 0.5,
  __sfxVolume: 0.35,
  __uiVolume: 0.425,
  __gameType: GAME_TYPE.AW_DS,

  // TODO: Shuffle
  // TODO: Alternate Themes

  set isPlaying(val) {
    this.__isPlaying = val;
    this.onSettingChangeEvent("isPlaying");
  },

  get isPlaying() {
    return this.__isPlaying;
  },

  set volume(val) {
    this.__volume = val;
    this.onSettingChangeEvent("volume");
  },

  get volume() {
    return this.__volume;
  },

  set sfxVolume(val) {
    this.__sfxVolume = val;
    this.onSettingChangeEvent("sfxVolume");
  },

  get sfxVolume() {
    return this.__sfxVolume;
  },

  set uiVolume(val) {
    this.__uiVolume = val;
    this.onSettingChangeEvent("uiVolume");
  },
  get uiVolume() {
    return this.__uiVolume;
  },

  set gameType(val) {
    // TODO: Validate
    this.__gameType = val;
    this.onSettingChangeEvent("gameType");
  },
  get gameType() {
    return this.__gameType;
  },

  onSettingChangeEvent(key) {
    onSettingsChangeListeners.forEach((fn) => fn(key));
  },
};

/**
 * Loads the music player settings stored in the local storage.
 */
function loadSettingsFromLocalStorage() {
  let storageData = localStorage.getItem(STORAGE_KEY);

  // Store defaults if nothing is stored
  if (storageData === null) {
    updateSettingsInLocalStorage();
  }

  // Only keep and set settings that are in the current version
  // Only keep internal __vars
  let savedSettings = JSON.parse(storageData);
  for (let key in musicPlayerSettings) {
    if (Object.hasOwn(savedSettings, key) && key.startsWith("__")) {
      // Key without __ prefix
      let regularKey = key.substring(2);
      musicPlayerSettings[regularKey] = savedSettings[key];
    }
  }

  // From now on, any setting changes will be saved and any listeners will be called
  addSettingsChangeListener(updateSettingsInLocalStorage);
}

/**
 * Saves the current music player settings in the local storage.
 */
function updateSettingsInLocalStorage() {
  let jsonSettings = JSON.stringify(musicPlayerSettings);
  localStorage.setItem(STORAGE_KEY, jsonSettings);
}

;// ./music_player/resources.js


/*
 * All external resources used by this userscript like URLs.
 *
 * TODO:
 *  -DS/MapEditor, edit music
 */
const BASE_URL = "https://devj.surge.sh";
const BASE_URL_MUSIC = BASE_URL + "/music";
const BASE_URL_SFX = BASE_URL_MUSIC + "/sfx";

const neutralImgLink = BASE_URL + "/img/music-player-icon.png";
const playingImgLink = BASE_URL + "/img/music-player-playing.gif";

const gameSFX = {
  actionSuperCOPowerAvailable: "sfx-action-super-co-power-available",
  actionCOPowerAvailable: "sfx-action-co-power-available",
  actionAllyActivateSCOP: "sfx-action-ally-activate-scop",
  actionBHActivateSCOP: "sfx-action-bh-activate-scop",
  actionCaptureAlly: "sfx-action-capture-ally",
  actionCaptureEnemy: "sfx-action-capture-enemy",
  actionCaptureProgress: "sfx-action-capture-progress",
  actionMissileHit: "sfx-action-missile-hit",
  actionMissleSend: "sfx-action-missile-send",
  actionUnitHide: "sfx-action-unit-hide",
  actionUnitUnhide: "sfx-action-unit-unhide",
  actionUnitSupply: "sfx-action-unit-supply",
  actionUnitTrap: "sfx-action-unit-trap",
  actionUnitLoad: "sfx-action-unit-load",
  actionUnitUnload: "sfx-action-unit-unload",
  actionUnitExplode: "sfx-action-unit-explode",
  uiCursorMove: "sfx-ui-cursor-move",
  uiMenuOpen: "sfx-ui-menu-open",
  uiMenuClose: "sfx-ui-menu-close",
  uiMenuMove: "sfx-ui-menu-move",
  uiUnitSelect: "sfx-ui-unit-select",
};

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

function isBlackHoleCO(coName) {
  return BLACK_HOLE_CO_LIST.has(coName.toLowerCase());
}

const movementSFX = {
  moveBCopterLoop: BASE_URL_SFX + "/move_bcopter.ogg",
  moveBCopterOneShot: BASE_URL_SFX + "/move_bcopter_rolloff.ogg",
  moveInfLoop: BASE_URL_SFX + "/move_inf.ogg",
  moveMechLoop: BASE_URL_SFX + "/move_mech.ogg",
  moveNavalLoop: BASE_URL_SFX + "/move_naval.ogg",
  movePiperunnerLoop: BASE_URL_SFX + "/move_piperunner.ogg",
  movePlaneLoop: BASE_URL_SFX + "/move_plane.ogg",
  movePlaneOneShot: BASE_URL_SFX + "/move_plane_rolloff.ogg",
  moveSubLoop: BASE_URL_SFX + "/move_sub.ogg",
  moveTCopterLoop: BASE_URL_SFX + "/move_tcopter.ogg",
  moveTCopterOneShot: BASE_URL_SFX + "/move_tcopter_rolloff.ogg",
  moveTiresHeavyLoop: BASE_URL_SFX + "/move_tires_heavy.ogg",
  moveTiresHeavyOneShot: BASE_URL_SFX + "/move_tires_heavy_rolloff.ogg",
  moveTiresLightLoop: BASE_URL_SFX + "/move_tires_light.ogg",
  moveTiresLightOneShot: BASE_URL_SFX + "/move_tires_light_rolloff.ogg",
  moveTreadHeavyLoop: BASE_URL_SFX + "/move_tread_heavy.ogg",
  moveTreadHeavyOneShot: BASE_URL_SFX + "/move_tread_heavy_rolloff.ogg",
  moveTreadLightLoop: BASE_URL_SFX + "/move_tread_light.ogg",
  moveTreadLightOneShot: BASE_URL_SFX + "/move_tread_light_rolloff.ogg",
};

const onMovementStartMap = new Map([
  ["APC", movementSFX.moveTreadLightLoop],
  ["Anti-Air", movementSFX.moveTreadLightLoop],
  ["Artillery", movementSFX.moveTreadLightLoop],
  ["B-Copter", movementSFX.moveBCopterLoop],
  ["Battleship", movementSFX.moveNavalLoop],
  ["Black Boat", movementSFX.moveNavalLoop],
  ["Black Bomb", movementSFX.movePlaneLoop],
  ["Bomber", movementSFX.movePlaneLoop],
  ["Carrier", movementSFX.moveNavalLoop],
  ["Cruiser", movementSFX.moveNavalLoop],
  ["Fighter", movementSFX.movePlaneLoop],
  ["Infantry", movementSFX.moveInfLoop],
  ["Lander", movementSFX.moveNavalLoop],
  ["Md. Tank", movementSFX.moveTreadHeavyLoop],
  ["Mech", movementSFX.moveMechLoop],
  ["Mega Tank", movementSFX.moveTreadHeavyLoop],
  ["Missile", movementSFX.moveTiresHeavyLoop],
  ["Neotank", movementSFX.moveTreadHeavyLoop],
  ["Piperunner", movementSFX.movePiperunnerLoop],
  ["Recon", movementSFX.moveTiresLightLoop],
  ["Rocket", movementSFX.moveTiresHeavyLoop],
  ["Stealth", movementSFX.movePlaneLoop],
  ["Sub", movementSFX.moveSubLoop],
  ["T-Copter", movementSFX.moveTCopterLoop],
  ["Tank", movementSFX.moveTreadLightLoop],
]);

const onMovementRollOffMap = new Map([
  ["APC", movementSFX.moveTreadLightOneShot],
  ["Anti-Air", movementSFX.moveTreadLightOneShot],
  ["Artillery", movementSFX.moveTreadLightOneShot],
  ["B-Copter", movementSFX.moveBCopterOneShot],
  ["Black Bomb", movementSFX.movePlaneOneShot],
  ["Bomber", movementSFX.movePlaneOneShot],
  ["Fighter", movementSFX.movePlaneOneShot],
  ["Md. Tank", movementSFX.moveTreadHeavyOneShot],
  ["Mega Tank", movementSFX.moveTreadHeavyOneShot],
  ["Missile", movementSFX.moveTiresHeavyOneShot],
  ["Neotank", movementSFX.moveTreadHeavyOneShot],
  ["Recon", movementSFX.moveTiresLightOneShot],
  ["Rocket", movementSFX.moveTiresHeavyOneShot],
  ["Stealth", movementSFX.movePlaneOneShot],
  ["T-Copter", movementSFX.moveTCopterOneShot],
  ["Tank", movementSFX.moveTreadLightOneShot],
]);

function getMusicFilename(coName, gameType, themeType) {
  let isPowerActive = themeType !== THEME_TYPE.REGULAR;

  // Regular theme
  if (!isPowerActive) {
    return `t-${coName}`;
  }

  // For RBC, we play the new power themes
  // TODO: RBC factory themes
  if (gameType === GAME_TYPE.AW_RBC) {
    return `t-${coName}-cop`;
  }
  // For all other games, play the ally or black hole themes
  // during the CO and Super CO powers
  let faction = isBlackHoleCO(coName) ? "bh" : "ally";
  return `t-${faction}-${themeType}`;
}

function getMusicURL(coName, gameType = null, themeType = null) {
  if (gameType === null) {
    gameType = musicPlayerSettings.gameType;
  }

  if (themeType === null) {
    themeType = getCurrentThemeType();
  }

  let gameDir = gameType;
  let filename = getMusicFilename(coName, gameType, themeType);
  let url = `${BASE_URL_MUSIC}/${gameDir}/${filename}.ogg`;
  return url.toLowerCase().replaceAll("_", "-");
}

function getSoundEffectURL(sfx) {
  return `${BASE_URL_SFX}/${sfx}.ogg`;
}

function getMovementSoundURL(unitName) {
  return onMovementStartMap.get(unitName);
}

function getMovementRollOffURL(unitName) {
  return onMovementRollOffMap.get(unitName);
}

function hasMovementRollOff(unitName) {
  return onMovementRollOffMap.has(unitName);
}

// TODO: Should we preload SFX?
function getAllSoundEffectURLS() {
  let sfx = Object.values(gameSFX).map(getSoundEffectURL);
  let moreSFX = Object.values(movementSFX);
  return sfx.concat(moreSFX);
  // return [];
}

// EXTERNAL MODULE: ./shared/config.js
var config = __webpack_require__(373);
;// ./music_player/settings_menu.js







// Used to close the right-click settings menu when you right-click twice
let isSettingsMenuOpen = false;

// Listen for setting changes to update the settings UI
addSettingsChangeListener(onSettingsChange);

/**
 * Adds the right-click context menu with the music player settings to the given node.
 * @param {*} musicPlayerDiv The node whose right click will open the context menu.
 */
function addSettingsMenuToMusicPlayer(musicPlayerDiv) {
  // Add context menu to music player
  musicPlayerDiv.appendChild(contextMenu);

  // Enable right-click to open and close settings menu
  musicPlayerDiv.oncontextmenu = function (e) {
    let elmnt = e.target;
    if (elmnt.id.startsWith("music-player")) {
      e.preventDefault();
      isSettingsMenuOpen = !isSettingsMenuOpen;

      if (isSettingsMenuOpen) {
        openSettingsMenu();
      } else {
        closeSettingsMenu();
      }
    }
  };

  // Close settings menu whenever the user clicks anywhere outside the player
  on(document, "click", function (e) {
    if (e.target.id.startsWith("music-player-")) return;
    closeSettingsMenu();
  });
}

/**
 * Updates the music player settings menu (context menu) so it matches the internal settings when the settings change.
 *
 * The context menu is the menu that appears when you right-click the player that shows you options.
 * This function ensures that the internal settings are reflected properly on the UI.
 * @param {*} _key Key of the setting which has been changed.
 */
function onSettingsChange(_key) {
  volumeSlider.value = musicPlayerSettings.volume;
  sfxVolumeSlider.value = musicPlayerSettings.sfxVolume;
  uiVolumeSlider.value = musicPlayerSettings.uiVolume;
  gameTypeSelectorSpan.value = musicPlayerSettings.gameType;
}

/**
 * Opens the music player settings menu.
 */
function openSettingsMenu() {
  contextMenu.style.display = "block";
}

/**
 * Closes the music player settings menu.
 */
function closeSettingsMenu() {
  contextMenu.style.display = "none";
}

/********************** Custom Context Menu **********************/
let contextMenu = document.createElement("div");
contextMenu.id = "music-player-context-menu";
contextMenu.classList.add("cls-context-menu");
contextMenu.style.position = "absolute";
contextMenu.style.height = "76px";
contextMenu.style.paddingTop = "0px";
contextMenu.style.paddingBottom = isMapEditor ? "0px" : "4px";
contextMenu.style.height = "347px";
contextMenu.style.width = "175px";
contextMenu.style.top = "37px";

/********************** Volume Slider **********************/
const volumeSlider = document.createElement("input");
volumeSlider.id = "music-player-vol-slider";
volumeSlider.type = "range";
volumeSlider.max = "1";
volumeSlider.min = "0";
volumeSlider.step = "0.01";
volumeSlider.value = musicPlayerSettings.volume;

on(volumeSlider, "input", (val) => {
  musicPlayerSettings.volume = val.target.value;
});

let volumeSliderFlexContainer = document.createElement("div");
volumeSliderFlexContainer.id = "music-player-vol-slider-flex-container";
volumeSliderFlexContainer.style.display = "flex";
volumeSliderFlexContainer.style.flexDirection = "row";
volumeSliderFlexContainer.style.marginBottom = "3.5px";
volumeSliderFlexContainer.style.alignItems = "center";
volumeSliderFlexContainer.style.backgroundColor = "#F0F0F0";

let volumeSliderSpanDiv = document.createElement("div");
volumeSliderSpanDiv.id = "music-player-vol-slider-div";
volumeSliderSpanDiv.style.display = "inline-block";
volumeSliderSpanDiv.style.width = "100%";
volumeSliderSpanDiv.style.textAlign = "center";

let volumeSliderSpan = document.createElement("span");
volumeSliderSpan.id = "music-player-vol-slider-desc";
volumeSliderSpan.textContent = "Music Volume";
volumeSliderSpan.style.fontSize = "13px";

volumeSliderFlexContainer.appendChild(volumeSliderSpanDiv);
volumeSliderSpanDiv.appendChild(volumeSliderSpan);
contextMenu.appendChild(volumeSliderFlexContainer);
contextMenu.appendChild(volumeSlider);

/********************** SFX Volume Slider **********************/
const sfxVolumeSlider = document.createElement("input");
sfxVolumeSlider.id = "music-player-vol-sfx-slider";
sfxVolumeSlider.type = "range";
sfxVolumeSlider.max = "1";
sfxVolumeSlider.min = "0";
sfxVolumeSlider.step = "0.01";
sfxVolumeSlider.value = musicPlayerSettings.sfxVolume;
on(sfxVolumeSlider, "input", (val) => {
  musicPlayerSettings.sfxVolume = val.target.value;
});

let sfxVolumeSliderFlexContainer = document.createElement("div");
sfxVolumeSliderFlexContainer.id = "music-player-vol-sfx-slider-flex-container";
sfxVolumeSliderFlexContainer.style.display = "flex";
sfxVolumeSliderFlexContainer.style.flexDirection = "row";
sfxVolumeSliderFlexContainer.style.marginBottom = "3.5px";
sfxVolumeSliderFlexContainer.style.marginTop = "3.5px";
sfxVolumeSliderFlexContainer.style.alignItems = "center";

let sfxVolumeSliderSpanDiv = document.createElement("div");
sfxVolumeSliderSpanDiv.id = "music-player-vol-sfx-slider-div";
sfxVolumeSliderSpanDiv.style.display = "inline-block";
sfxVolumeSliderSpanDiv.style.width = "100%";
sfxVolumeSliderSpanDiv.style.textAlign = "center";

let sfxVolumeSliderSpan = document.createElement("span");
sfxVolumeSliderSpan.id = "music-player-vol-sfx-slider-desc";
sfxVolumeSliderSpan.textContent = "SFX Volume";
sfxVolumeSliderSpan.style.fontSize = "13px";

sfxVolumeSliderFlexContainer.appendChild(sfxVolumeSliderSpanDiv);
sfxVolumeSliderSpanDiv.appendChild(sfxVolumeSliderSpan);
contextMenu.appendChild(sfxVolumeSliderFlexContainer);
contextMenu.appendChild(sfxVolumeSlider);

/********************** UI Volume Slider **********************/
const uiVolumeSlider = document.createElement("input");
uiVolumeSlider.id = "music-player-vol-ui-slider";
uiVolumeSlider.type = "range";
uiVolumeSlider.max = "1";
uiVolumeSlider.min = "0";
uiVolumeSlider.step = "0.01";
uiVolumeSlider.value = musicPlayerSettings.uiVolume;

on(uiVolumeSlider, "input", (val) => {
  musicPlayerSettings.uiVolume = val.target.value;
});

let uiVolumeSliderFlexContainer = document.createElement("div");
uiVolumeSliderFlexContainer.id = "music-player-vol-ui-slider-flex-container";
uiVolumeSliderFlexContainer.style.display = "flex";
uiVolumeSliderFlexContainer.style.flexDirection = "row";
uiVolumeSliderFlexContainer.style.marginBottom = "3.5px";
uiVolumeSliderFlexContainer.style.marginTop = "3.5px";
uiVolumeSliderFlexContainer.style.alignItems = "center";

let uiVolumeSliderSpanDiv = document.createElement("div");
uiVolumeSliderSpanDiv.id = "music-player-vol-ui-slider-div";
uiVolumeSliderSpanDiv.style.display = "inline-block";
uiVolumeSliderSpanDiv.style.width = "100%";
uiVolumeSliderSpanDiv.style.textAlign = "center";

let uiVolumeSliderSpan = document.createElement("span");
uiVolumeSliderSpan.id = "music-player-vol-ui-slider-desc";
uiVolumeSliderSpan.textContent = "Interface Volume";
uiVolumeSliderSpan.style.fontSize = "13px";

uiVolumeSliderFlexContainer.appendChild(uiVolumeSliderSpanDiv);
uiVolumeSliderSpanDiv.appendChild(uiVolumeSliderSpan);
contextMenu.appendChild(uiVolumeSliderFlexContainer);
contextMenu.appendChild(uiVolumeSlider);

/********************** Game Type **********************/
let themeFlexContainer = document.createElement("div");
themeFlexContainer.id = "music-player-theme-slider-flex-container";
themeFlexContainer.style.display = "flex";
themeFlexContainer.style.flexDirection = "row";
themeFlexContainer.style.marginTop = "5.5px";
themeFlexContainer.style.alignItems = "center";
themeFlexContainer.style.backgroundColor = "#F0F0F0";
contextMenu.appendChild(themeFlexContainer);

let themeSpanDiv = document.createElement("div");
themeSpanDiv.id = "music-player-theme-slider-div";
themeSpanDiv.style.display = "inline-block";
themeSpanDiv.style.width = "100%";
themeSpanDiv.style.textAlign = "center";
themeFlexContainer.appendChild(themeSpanDiv);

let themeSpan = document.createElement("span");
themeSpan.id = "music-player-theme-slider-desc";
themeSpan.textContent = "Game Soundtrack";
themeSpan.style.fontSize = "13px";
themeSpanDiv.appendChild(themeSpan);

let themeSliderFlexContainer = document.createElement("div");
themeSliderFlexContainer.id = "music-player-classic-slider-flex-container";
themeSliderFlexContainer.style.display = "flex";
themeSliderFlexContainer.style.flexDirection = "row";
themeSliderFlexContainer.style.marginTop = "5.5px";
themeSliderFlexContainer.style.alignItems = "center";
themeSliderFlexContainer.style.justifyContent = "space-around";
contextMenu.appendChild(themeSliderFlexContainer);

let gameTypeSelectorSpan = document.createElement("select");
gameTypeSelectorSpan.id = "music-player-game-type-selector";
gameTypeSelectorSpan.value = musicPlayerSettings.gameType;
on(gameTypeSelectorSpan, "change", () => {
  let newGameType = gameTypeSelectorSpan.value;
  musicPlayerSettings.gameType = newGameType;
});

for (let key in GAME_TYPE) {
  let gameTypeOption = document.createElement("option");
  gameTypeOption.id = "music-player-game-type-option-" + key;

  let gameTypeOptionText = document.createTextNode(key);
  gameTypeOptionText.id = "music-player-game-type-option-name-" + key;

  gameTypeOption.appendChild(gameTypeOptionText);
  gameTypeSelectorSpan.appendChild(gameTypeOption);
}

themeSliderFlexContainer.appendChild(gameTypeSelectorSpan);

/********************** Version **********************/
let versionDiv = document.createElement("div");
versionDiv.id = "music-player-version-number-div";
versionDiv.style.width = "100%";
versionDiv.style.marginTop = "5px";
versionDiv.style.backgroundColor = "#F0F0F0";

let versionSpan = document.createElement("span");
versionSpan.id = "music-player-version-number";
versionSpan.textContent = "VERSION: " + config/* versions */.e4.musicPlayer;
versionSpan.style.fontSize = "9px";
versionSpan.style.color = "#888888";

versionDiv.appendChild(versionSpan);
contextMenu.appendChild(versionDiv);

;// ./music_player/music_player_menu.js






// Listen for setting changes to update the menu UI
addSettingsChangeListener(music_player_menu_onSettingsChange);

/**
 * Adds the music player to the game menu.
 */
function addMusicPlayerMenu() {
  addSettingsMenuToMusicPlayer(musicPlayerDiv);
  menu.appendChild(musicPlayerDiv);
}

/**
 * Sets the loading progress for the music player. Used when preloading audio.
 * @param {*} percentage Integer from 0 to 100 representing the progress of loading the music player.
 */
function setMusicPlayerLoadPercentage(percentage) {
  musicPlayerDivBackground.style.backgroundImage =
    "linear-gradient(to right, #ffffff " + String(percentage) + "% , #888888 0%)";
}

/**
 * Event handler for when the music button is clicked that turns the music ON/OFF.
 */
function onMusicBtnClick(_e) {
  musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
}

/**
 *
 * @param {*} key
 */
function music_player_menu_onSettingsChange(key) {
  if (key != "isPlaying") {
    return;
  }

  // Update UI
  if (musicPlayerSettings.isPlaying) {
    musicPlayerDivBackgroundImg.src = playingImgLink;
    musicPlayerDivHoverSpan.innerText = "Stop Tunes";
    musicPlayerDivBackground.style.backgroundColor = "#e1e1e1";
  } else {
    musicPlayerDivBackgroundImg.src = neutralImgLink;
    musicPlayerDivHoverSpan.innerText = "Play Tunes";
    musicPlayerDivBackground.style.backgroundColor = "#ffffff";
  }
}

/********************** Music Player Menu **********************/
const musicPlayerDiv = document.createElement("div");
musicPlayerDiv.id = "music-player-parent";
musicPlayerDiv.classList.add("game-tools-btn");
musicPlayerDiv.classList.add("cls-context-menu-root");
musicPlayerDiv.style.width = "34px";
musicPlayerDiv.style.height = "30px";
musicPlayerDiv.style.border = isMapEditor ? "none" : "1px solid #888888";
musicPlayerDiv.style.borderLeft = isMapEditor ? "1px solid #888888" : "0px";

const musicPlayerDivHoverSpan = document.createElement("span");
musicPlayerDivHoverSpan.id = "adji-hover-span";
musicPlayerDivHoverSpan.classList.add("game-tools-btn-text");
musicPlayerDivHoverSpan.classList.add("small_text");
musicPlayerDivHoverSpan.classList.add("cls-context-menu-root");
musicPlayerDivHoverSpan.innerText = "Play Tunes";

const musicPlayerDivBackground = document.createElement("div");
musicPlayerDivBackground.id = "music-player-background";
musicPlayerDivBackground.classList.add("game-tools-bg");
musicPlayerDivBackground.classList.add("cls-context-menu-root");
musicPlayerDivBackground.style.backgroundImage =
  "linear-gradient(to right, #ffffff 0% , #888888 0%)";
// #0066CC

const musicPlayerDivBackgroundSpan = document.createElement("span");
musicPlayerDivBackgroundSpan.id = "music-player-background-span";
musicPlayerDivBackgroundSpan.classList.add("norm2");
musicPlayerDivBackgroundSpan.classList.add("cls-context-menu-root");

const musicPlayerDivBackgroundLink = document.createElement("a");
musicPlayerDivBackgroundLink.id = "music-player-background-link";
musicPlayerDivBackgroundLink.classList.add("norm2");
musicPlayerDivBackgroundLink.classList.add("cls-context-menu-root");

const musicPlayerDivBackgroundImg = document.createElement("img");
musicPlayerDivBackgroundImg.id = "music-player-background-link";
musicPlayerDivBackgroundImg.classList.add("cls-context-menu-root");
musicPlayerDivBackgroundImg.src = neutralImgLink;
musicPlayerDivBackgroundImg.style.verticalAlign = "middle";
musicPlayerDivBackgroundImg.style.width = "17px";
musicPlayerDivBackgroundImg.style.height = "17px";

musicPlayerDiv.appendChild(musicPlayerDivBackground);
musicPlayerDiv.appendChild(musicPlayerDivHoverSpan);
musicPlayerDivBackground.appendChild(musicPlayerDivBackgroundSpan);
musicPlayerDivBackgroundSpan.appendChild(musicPlayerDivBackgroundLink);
musicPlayerDivBackgroundLink.appendChild(musicPlayerDivBackgroundImg);

// Determine who will catch when the user clicks the play/stop button
on(musicPlayerDivBackground, "click", onMusicBtnClick);

;// ./music_player/music.js





/**
 *
 */
let delayThemeMS = 0;
let currentlyDelaying = false;

/**
 *
 */
let currentThemeKey = "";

/**
 *
 */
const urlAudioMap = new Map();

/**
 *
 */
const unitIDAudioMap = new Map();

// Listen for setting changes to update the internal variables accordingly
addSettingsChangeListener(music_onSettingsChange);

function playMusicURL(srcURL, loop = false) {
  let currentTheme = urlAudioMap.get(currentThemeKey);

  // We want to play the same song we already are playing
  if (srcURL === currentThemeKey) {
    // The song was paused, so resume it
    if (currentTheme.paused) currentTheme.play();
    return;
  }

  // We want to play a new song, so pause the previous one (if exists)
  currentTheme?.pause();

  // Start new theme
  console.log("[AWBW Improved Music Player] Now Playing: " + srcURL);
  currentThemeKey = srcURL;
  currentTheme = urlAudioMap.get(srcURL);
  currentTheme.volume = musicPlayerSettings.volume;
  currentTheme.loop = loop;
  currentTheme.play();
}

function playOneShotURL(srcURL, volume) {
  let soundInstance = new Audio(srcURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
}

function playCOTheme(coName) {
  let srcURL = getMusicURL(coName);
  playMusicURL(srcURL, true);
}

/**
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 */
function playMusic() {
  if (!musicPlayerSettings.isPlaying) return;

  // Someone wants us to delay playing the theme, so wait a little bit then play
  // Ignore all calls to play() while delaying, we are guaranteed to play eventually
  if (currentlyDelaying) return;
  if (delayThemeMS > 0) {
    // Delay until I say so
    setTimeout(() => {
      currentlyDelaying = false;
      playMusic();
    }, delayThemeMS);

    delayThemeMS = 0;
    currentlyDelaying = true;
    return;
  }
  let coName = isMapEditor ? "map-editor" : currentPlayer.coName;
  playCOTheme(coName);
}

/**
 * Stops all music if there's any playing.
 * Optionally, you can also delay the start of the next theme.
 * @param {*} delayMS (Optional) Time to delay before we start the next theme.
 */
function stopMusic(delayMS = 0) {
  delayThemeMS = delayMS;

  let currentTheme = urlAudioMap.get(currentThemeKey);
  currentTheme?.pause();
}

/**
 * Plays the movement sound of the given unit.
 * @param {*} unitID The ID of the unit who is moving.
 */
function playMovementSound(unitID) {
  if (!musicPlayerSettings.isPlaying) return;

  if (!unitIDAudioMap.has(unitID)) {
    let unitName = getUnitName(unitID);
    let movementSoundURL = getMovementSoundURL(unitName);
    unitIDAudioMap.set(unitID, new Audio(movementSoundURL));
  }

  let movementAudio = unitIDAudioMap.get(unitID);
  movementAudio.currentTime = 0;
  movementAudio.loop = true;
  movementAudio.volume = musicPlayerSettings.sfxVolume;
  movementAudio.play();
  console.log("Moving: ", unitID, ",", movementAudio.src);
}

/**
 * Stops the movement sound of a given unit if it's playing.
 * @param {*} unitID The ID of the unit whose movement sound will be stopped.
 */
function stopMovementSound(unitID) {
  // Can't stop if there's nothing playing or nothing to be played
  if (!musicPlayerSettings.isPlaying || !unitIDAudioMap.has(unitID)) return;

  // Can't stop if the sound is already stopped
  let movementAudio = unitIDAudioMap.get(unitID);
  if (movementAudio.paused) return;

  // Stop sound
  console.log("Pausing", unitID, ",", movementAudio.src);
  movementAudio.pause();
  movementAudio.currentTime = 0;

  // If unit has rolloff, play it
  let unitName = getUnitName(unitID);
  if (hasMovementRollOff(unitName)) {
    let audioURL = getMovementRollOffURL(unitName);
    playOneShotURL(audioURL, musicPlayerSettings.sfxVolume);
  }
}

function playSFX(sfx) {
  if (!musicPlayerSettings.isPlaying) return;

  // Figure out which volume to use
  let sfxURL = getSoundEffectURL(sfx);
  let vol = musicPlayerSettings.sfxVolume;
  if (sfx.startsWith("sfx-ui")) {
    vol = musicPlayerSettings.uiVolume;
  }
  playOneShotURL(sfxURL, vol);
}

/**
 * Preloads the current game COs' themes and common sound effect audios.
 * @param {*} afterPreloadFunction Function to run after the audio is pre-loaded.
 */
function preloadCommonAudio(afterPreloadFunction) {
  // Preload the themes of the COs in this match
  // We preload the themes for each game version
  let audioList = [];
  let coNames = isMapEditor ? ["map-editor"] : getAllCONames();
  for (let gameType in GAME_TYPE) {
    for (let themeType in THEME_TYPE) {
      let gameList = coNames.map((name) => getMusicURL(name, gameType, themeType));
      audioList = audioList.concat(gameList);
    }
  }

  // Preload SFX
  audioList = audioList.concat(getAllSoundEffectURLS());

  // Only unique audios, remove duplicates
  audioList = new Set(audioList);

  let numLoadedAudios = 0;
  let onLoadAudio = function () {
    numLoadedAudios++;
    let loadPercentage = (numLoadedAudios / audioList.size) * 100;
    setMusicPlayerLoadPercentage(loadPercentage);

    if (numLoadedAudios >= audioList.size) {
      if (afterPreloadFunction) afterPreloadFunction();
    }
  };

  let onLoadAudioError = (event) => {
    onLoadAudio();
    console.log("[AWBW Improved Music Player] Could not pre-load: " + event.target.src);
  };

  audioList.forEach((url) => {
    let audio = new Audio(url);
    urlAudioMap.set(url, audio);
    audio.addEventListener("loadedmetadata", onLoadAudio, false);
    audio.addEventListener("error", onLoadAudioError, false);
  });
}

/**
 * Updates the internal audio components to match the current music player settings when the settings change.
 *
 * @param {*} _key Key of the setting which has been changed.
 */
function music_onSettingsChange(key) {
  switch (key) {
    case "isPlaying":
      if (musicPlayerSettings.isPlaying) {
        playMusic();
      } else {
        stopMusic();
      }
      break;
    case "gameType":
      playMusic();
      break;
    case "volume": {
      // Adjust the volume of the current theme
      let currentTheme = urlAudioMap.get(currentThemeKey);
      if (currentTheme) {
        currentTheme.volume = musicPlayerSettings.volume;
      }
      break;
    }
    case "sfxVolume":
      // Very rare for these sound effects to be playing when messing with the settings
      // but just in case adjust the volume as well
      unitIDAudioMap.forEach((unitAudio) => {
        unitAudio.volume = musicPlayerSettings.sfxVolume;
      });
      break;
  }
}

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./music_player/style.css
var style = __webpack_require__(343);
;// ./music_player/style.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(style/* default */.A, options);




       /* harmony default export */ const music_player_style = (style/* default */.A && style/* default */.A.locals ? style/* default */.A.locals : undefined);

;// ./music_player/main.js








// Add our CSS to the page using webpack


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

/* global updateCursor:writeable */
let ahCursorMove = updateCursor;
let lastCursorCall = Date.now();
const CURSOR_THRESHOLD = 25;

updateCursor = (cursorX, cursorY) => {
  ahCursorMove.apply(updateCursor, [cursorX, cursorY]);
  if (!musicPlayerSettings.isPlaying) return;

  if (Date.now() - lastCursorCall > CURSOR_THRESHOLD) {
    playSFX(gameSFX.uiCursorMove);
  }
  lastCursorCall = Date.now();
};

/* global openMenu:writeable */
let ahOpenMenu = openMenu;
let menuItemClick = false;
let menuOpen = false;
openMenu = (menu, x, y) => {
  ahOpenMenu.apply(openMenu, [menu, x, y]);
  if (!musicPlayerSettings.isPlaying) return;

  console.log("menu open: " + menu + "," + x + "," + y);
  let menuOptions = document.getElementsByClassName("menu-option");

  for (var i = 0; i < menuOptions.length; i++) {
    menuOptions[i].addEventListener("mouseover", function (e) {
      if (e.target !== this) {
        return;
      }
      playSFX(gameSFX.uiMenuMove);
    });

    on(menuOptions[i], "click", function () {
      menuItemClick = true;
    });
  }

  menuOpen = true;
  playSFX(gameSFX.uiMenuOpen);
};

/* global closeMenu:writeable */
let ahCloseMenu = closeMenu;
closeMenu = () => {
  ahCloseMenu.apply(closeMenu, []);
  if (!musicPlayerSettings.isPlaying) return;
  console.log("menu closed");

  if (menuItemClick && menuOpen) {
    playSFX(gameSFX.uiMenuOpen);
  }
  if (!menuItemClick && menuOpen) {
    playSFX(gameSFX.uiMenuClose);
  }

  menuOpen = false;
  menuItemClick = false;
};

/* global unitClickHandler:writeable */
let ahUnitClick = unitClickHandler;
unitClickHandler = (clicked) => {
  ahUnitClick.apply(unitClickHandler, [clicked]);
  if (!musicPlayerSettings.isPlaying) return;
  playSFX(gameSFX.uiUnitSelect);
};

/* global waitUnit:writeable */
let movementResponseMap = new Map();
let ahWait = waitUnit;
waitUnit = (unitID) => {
  ahWait.apply(waitUnit, [unitID]);
  stopMovementSound(unitID);

  if (movementResponseMap.has(unitID)) {
    let response = movementResponseMap.get(unitID);
    if (response.trapped) {
      playSFX(gameSFX.actionUnitTrap);
    }
    movementResponseMap.delete(unitID);
  }
};

/* global updateAirUnitFogOnMove:writeable */
let ahFog = updateAirUnitFogOnMove;
updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change) => {
  ahFog.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change]);

  if (!musicPlayerSettings.isPlaying) return;
  debugger;

  var delay = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  if (change === "Add") {
    // setTimeout(() => stopMovementSound(), delay);
  }
};

/* global actionHandlers:writeable */
let ahFire = actionHandlers.Fire;
actionHandlers.Fire = (fireResponse) => {
  let attackerID = fireResponse.copValues.attacker.playerId;
  let defenderID = fireResponse.copValues.defender.playerId;

  // Calculate charge before attack
  let couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
  let couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
  let couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
  let couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);

  // Let the attack proceed normally
  ahFire.apply(actionHandlers.Fire, [fireResponse]);

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
      playSFX(gameSFX.actionSuperCOPowerAvailable);
    } else if (madeCOPAvailable) {
      playSFX(gameSFX.actionCOPowerAvailable);
    }
  }, delay);
};

let ahAttackSeam = actionHandlers.AttackSeam;
actionHandlers.AttackSeam = (seamResponse) => {
  ahAttackSeam.apply(actionHandlers.AttackSeam, [seamResponse]);
};

let ahMove = actionHandlers.Move;
actionHandlers.Move = (moveResponse, loadFlag) => {
  ahMove.apply(actionHandlers.Move, [moveResponse, loadFlag]);
  let unitID = moveResponse.unit.units_id;
  movementResponseMap.set(unitID, moveResponse);

  var movementDist = moveResponse.path.length;
  if (movementDist > 1) {
    playMovementSound(unitID);
  }
};

let ahCapt = actionHandlers.Capt;
actionHandlers.Capt = (captData) => {
  ahCapt.apply(actionHandlers.Capt, [captData]);
  playSFX(gameSFX.actionCaptureProgress);

  let isValid = captData != undefined && captData.newIncome != null;
  if (!isValid) return;

  let myID = getMyID();
  let isSpectator = isPlayerSpectator(myID);
  let isMyCapture = isSpectator || captData?.buildingInfo.buildings_team == myID;

  let sfx = isMyCapture ? gameSFX.actionCaptureAlly : gameSFX.actionCaptureEnemy;
  playSFX(sfx);
};

let ahBuild = actionHandlers.Build;
actionHandlers.Build = (buildData) => {
  ahBuild.apply(actionHandlers.Build, [buildData]);
  playSFX(gameSFX.actionUnitSupply);
};

let ahLoad = actionHandlers.Load;
actionHandlers.Load = (loadData) => {
  ahLoad.apply(actionHandlers.Load, [loadData]);
  playSFX(gameSFX.actionUnitLoad);
};

let ahUnload = actionHandlers.Unload;
actionHandlers.Unload = (unloadData) => {
  ahUnload.apply(actionHandlers.Unload, [unloadData]);
  playSFX(gameSFX.actionUnitUnload);
};

let ahSupply = actionHandlers.Supply;
actionHandlers.Supply = (supplyRes) => {
  ahSupply.apply(actionHandlers.Supply, [supplyRes]);

  // We could play the sfx for each supplied unit in the list
  // but instead we decided to play the supply sound once.
  playSFX(gameSFX.actionUnitSupply);
};

let ahRepair = actionHandlers.Repair;
actionHandlers.Repair = (repairData) => {
  ahRepair.apply(actionHandlers.Repair, [repairData]);
  playSFX(gameSFX.actionUnitSupply);
};

let ahHide = actionHandlers.Hide;
actionHandlers.Hide = (hideData) => {
  ahHide.apply(actionHandlers.Hide, [hideData]);
  playSFX(gameSFX.actionUnitHide);
};

let ahUnhide = actionHandlers.Unhide;
actionHandlers.Unhide = (unhideData) => {
  ahUnhide.apply(actionHandlers.Unhide, [unhideData]);
  playSFX(gameSFX.actionUnitUnhide);
};

let ahJoin = actionHandlers.Join;
actionHandlers.Join = (joinData) => {
  ahJoin.apply(actionHandlers.Join, [joinData]);
  stopMovementSound(joinData.joinID);
};

let ahExplodeAnim = animExplosion;
animExplosion = (unit) => {
  ahExplodeAnim.apply(animExplosion, [unit]);
  playSFX(gameSFX.actionUnitExplode);
};

// let ahDelete = actionHandlers.Delete;
// actionHandlers.Delete = (deleteData) => {
//   ahDelete.apply(actionHandlers.Delete, [deleteData]);
//   playSFX(gameSFX.actionUnitExplode);
// };

// let ahExplode = actionHandlers.Explode;
// actionHandlers.Explode = (data) => {
//   ahExplode.apply(actionHandlers.Explode, [data]);
// };

let ahLaunch = actionHandlers.Launch;
actionHandlers.Launch = (data) => {
  ahLaunch.apply(actionHandlers.Launch, [data]);
  playSFX(gameSFX.actionMissleSend);

  var siloDelay = gameAnimations ? 3000 : 0;
  setTimeout(() => playSFX(gameSFX.actionMissileHit), siloDelay);
};

let ahNextTurn = actionHandlers.NextTurn;
actionHandlers.NextTurn = (nextTurnRes) => {
  ahNextTurn.apply(actionHandlers.NextTurn, [nextTurnRes]);
  playMusic();
};

let ahElimination = actionHandlers.Elimination;
actionHandlers.Elimination = (eliminationRes) => {
  ahElimination.apply(actionHandlers.Elimination, [eliminationRes]);
  debugger;
};

let ahPower = actionHandlers.Power;
actionHandlers.Power = (powerRes) => {
  ahPower.apply(actionHandlers.Power, [powerRes]);

  let coName = powerRes.coName;
  let isSuperCOPower = powerRes.coPower === "S";
  let isBH = isBlackHoleCO(coName);

  if (isSuperCOPower) {
    let sfx = isBH ? gameSFX.actionBHActivateSCOP : gameSFX.actionAllyActivateSCOP;
    playSFX(sfx);
    stopMusic(2500);
  }
};

let ahSetDraw = actionHandlers.SetDraw;
actionHandlers.SetDraw = (drawData) => {
  ahSetDraw.apply(actionHandlers.SetDraw, [drawData]);
  debugger;
};

// let ahResign = actionHandlers.Resign;
// actionHandlers.Resign = (resignRes) => {
//   ahResign.apply(actionHandlers.Resign, [resignRes]);
//   debugger;
// }

let ahGameOver = actionHandlers.GameOver;
actionHandlers.GameOver = () => {
  ahGameOver.apply(actionHandlers.GameOver, []);
  debugger;
};

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
console.log("Script");
function afterPreload() {
  console.log("[AWBW Improved Music Player] All audio has been pre-loaded!");

  addMusicPlayerMenu();
  addReplayHandlers();
  loadSettingsFromLocalStorage();

  // TODO: Temporary
  // Better to play music after preloading audio
  // Play the music after letting everything load a bit
  playMusic();
  // setTimeout(() => playMusic(), 500);
}

preloadCommonAudio(afterPreload);

