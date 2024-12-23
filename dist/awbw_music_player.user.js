// ==UserScript==
// @name Improved AWBW Music Player
// @description An improved version of the comprehensive audio player that attempts to recreate the cart experience with more sound effects, more music, and more customizability.
// @version 3.0.0
// @author Original by twiggy_, updated by DeveloperJose
// @supportURL https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @match https://awbw.amarriner.com/game.php?games_id=*
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
var __dirname = "/";
/**
 * @file Constants and other project configuration settings that could be used by any scripts.
 */
let distPath = __dirname + "/../dist/dist";
const proxyScript = {
  baseURL: "file://" + distPath,
  filename: "[basename].proxy.user.js",
};
__webpack_unused_export__ = proxyScript;

const versions = {
  musicPlayer: "3.0.0",
  highlightCoordinates: "1.0.2",
};
exports.e = versions;


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
let gamemap = document.querySelector("#gamemap");
let gamemapContainer = document.querySelector("#gamemap-container");
let zoomInBtn = document.querySelector("#zoom-in");
let zoomOutBtn = document.querySelector("#zoom-out");
let zoomLevel = document.querySelector(".zoom-level");
let cursor = document.querySelector("#cursor");
let eventUsername = document.querySelector(".event-username");

let supplyIcon = document.querySelector(".supply-icon");
let trappedIcon = document.querySelector(".trapped-icon");
let targetIcon = document.querySelector(".target-icon");
let explosionIcon = document.querySelector(".destroy-icon");

let replayOpenBtn = document.querySelector(".replay-open");
let replayCloseBtn = document.querySelector(".replay-close");
let replayForwardBtn = document.querySelector(".replay-forward");
let replayForwardActionBtn = document.querySelector(".replay-forward-action");
let replayBackwardBtn = document.querySelector(".replay-backward");
let replayBackwardActionBtn = document.querySelector(".replay-backward-action");
let replayDaySelectorCheckBox = document.querySelector(".replay-day-selector");

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
let mapCols = typeof maxX !== "undefined" ? maxX : -1;

/**
 * The number of rows of this map.
 * @type {number}
 */
let mapRows = typeof maxY !== "undefined" ? maxY : -1;

/**
 * Whether game animations are enabled or not.
 * @type {boolean}
 */
let gameAnimations = typeof gameAnims !== "undefined" ? gameAnims : false;

// ============================== My Own Computed AWBW Variables and Functions ==============================
/**
 * The amount of time between the silo launch animation and the hit animation in milliseconds.
 * @type {number}
 */
let siloDelayMS = gameAnimations ? 3000 : 0;

/**
 * The amount of time between an attack animation starting and the attack finishing in milliseconds.
 */
let attackDelayMS = gameAnimations ? 1000 : 0;

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
 *
 * @param {*} x
 * @param {*} y
 * @returns
 */
function isValidBuilding(x, y) {
  return buildingsInfo[x] && buildingsInfo[x][y];
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @returns {BuildingInfo}
 */
function getBuildingInfo(x, y) {
  return buildingsInfo[x][y];
}

/**
 *
 * @param {*} buildingID
 * @returns {HTMLDivElement}
 */
function getBuildingDiv(buildingID) {
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
function moveDivToOffset(div, dx, dy, steps, ...options) {
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
function playAnimationIcon(icon, delay, animation, x, y, offsetX, offsetY) {
  return animIcon(icon, delay, animation, x, y, offsetX, offsetY);
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
 * @param {number} unitId - ID of the unit for whom we want to get the current info state.
 * @returns {UnitInfo} - The info for that unit at its current state.
 */
function getUnitInfo(unitId) {
  return unitsInfo[unitId];
}

/**
 * Gets the name of the given unit or null if the given unit is invalid.
 * @param {number} unitId - ID of the unit for whom we want to get the name.
 * @returns String of the unit name.
 */
function getUnitName(unitId) {
  return getUnitInfo(unitId)?.units_name;
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @returns {UnitInfo}
 */
function getUnitInfoFromCoords(x, y) {
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
function isValidUnit(unitId) {
  return unitId !== undefined && unitsInfo[unitId] !== undefined;
}

/**
 * Checks if the given unit has moved this turn.
 * @param {number} unitId - ID of the unit we want to check.
 * @returns True if the unit is valid and it has moved this turn.
 */
function hasUnitMovedThisTurn(unitId) {
  return isValidUnit(unitId) && getUnitInfo(unitId)?.units_moved === 1;
}

;// ./music_player/music_settings.js
/**
 * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
 * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
 */



/**
 * Enum that represents which game we want the music player to use for its music.
 * @readonly
 * @enum {string}
 */
const GAME_TYPE = Object.freeze({
  AW1: "AW1",
  AW2: "AW2",
  AW_RBC: "AW_RBC",
  AW_DS: "AW_DS",
});

/**
 * Enum that represents music theme types like regular or power.
 * @readonly
 * @enum {string}
 */
const THEME_TYPE = Object.freeze({
  REGULAR: "REGULAR",
  CO_POWER: "CO_POWER",
  SUPER_CO_POWER: "SUPER_CO_POWER",
});

/**
 * Map that takes a given coPowerState from a player and returns the appropriate theme type enum.
 */
const coPowerStateToThemeType = new Map([
  ["N", THEME_TYPE.REGULAR],
  ["Y", THEME_TYPE.CO_POWER],
  ["S", THEME_TYPE.SUPER_CO_POWER],
]);

/**
 * Gets the theme type enum corresponding to the CO Power state for the current CO.
 * @returns {THEME_TYPE} The THEME_TYPE enum for the current CO Power state.
 */
function getCurrentThemeType() {
  let currentCOPowerState = currentPlayer.coPowerState;
  return coPowerStateToThemeType.get(currentCOPowerState);
}

/**
 * String used as the key for storing settings in LocalStorage
 */
const STORAGE_KEY = "musicPlayerSettings";

/**
 * List of listener functions that will be called anytime settings are changed.
 */
const onSettingsChangeListeners = [];

/**
 * Adds a new listener function that will be called whenever a setting changes.
 * @param {*} fn Function to call when a setting changes.
 */
function addSettingsChangeListener(fn) {
  onSettingsChangeListeners.push(fn);
}

/**
 * The music player settings' current internal state.
 * DO NOT EDIT __ prefix variables, use the properties!
 */
const musicPlayerSettings = {
  __isPlaying: false,
  __volume: 0.5,
  __sfxVolume: 0.35,
  __uiVolume: 0.425,
  __gameType: GAME_TYPE.AW_DS,

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
    /** @todo: Validate */
    this.__gameType = val;
    this.onSettingChangeEvent("gameType");
  },
  /**
   * @type {GAME_TYPE}
   */
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
/**
 * @file All external resources used by this userscript like URLs and convenience functions for those URLs.
 */



/**
 * @constant
 * Base URL where all the files needed for this script are located.
 */
const BASE_URL = "https://developerjose.netlify.app";

/**
 * @constant
 * Base URL where all the music files are located.
 */
const BASE_URL_MUSIC = BASE_URL + "/music";

/**
 * @constant
 * Base URL where all sound effect files are located.
 */
const BASE_URL_SFX = BASE_URL_MUSIC + "/sfx";

/**
 * @constant
 * Image URL for static music player icon
 */
const neutralImgLink = BASE_URL + "/img/music-player-icon.png";

/**
 * @constant
 * Image URL for animated music player icon.
 */
const playingImgLink = BASE_URL + "/img/music-player-playing.gif";

/**
 * Enumeration of all game sound effects. The values for the keys are the filenames.
 * @enum {string}
 */
const gameSFX = {
  actionSuperCOPowerAvailable: "sfx-action-super-co-power-available",
  actionCOPowerAvailable: "sfx-action-co-power-available",
  actionAllyActivateSCOP: "sfx-action-ally-activate-scop",
  actionBHActivateSCOP: "sfx-action-bh-activate-scop",

  actionCaptureAlly: "sfx-action-capture-ally",
  actionCaptureEnemy: "sfx-action-capture-enemy",
  actionCaptureProgress: "sfx-action-capture-progress",
  actionMissileHit: "sfx-action-missile-hit",
  actionMissileSend: "sfx-action-missile-send",
  actionUnitAttackPipeSeam: "sfx-action-unit-attack-pipe-seam",
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

/**
 * @constant
 * List of all the URLs for all unit movement sounds.
 */
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

/**
 * Map that takes unit names as keys and gives you the URL for that unit movement sound.
 */
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

/**
 * Map that takes unit names as keys and gives you the URL to play when that unit has stopped moving, if any.
 */
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

/**
 * Determines the filename for the music to play given a specific CO and other settings.
 * @param {string} coName - Name of the CO whose music to use.
 * @param {GAME_TYPE} gameType - Which game soundtrack to use.
 * @param {THEME_TYPE} themeType - Which type of music whether regular or power.
 * @returns The filename of the music to play given the parameters.
 */
function getMusicFilename(coName, gameType, themeType) {
  let isPowerActive = themeType !== THEME_TYPE.REGULAR;

  // Regular theme
  if (!isPowerActive) {
    return `t-${coName}`;
  }

  // For RBC, we play the new power themes
  if (gameType === GAME_TYPE.AW_RBC) {
    return `t-${coName}-cop`;
  }
  // For all other games, play the ally or black hole themes
  // during the CO and Super CO powers
  let faction = isBlackHoleCO(coName) ? "bh" : "ally";
  return `t-${faction}-${themeType}`;
}

/**
 * Determines the URL for the music to play given a specific CO, and optionally, some specific settings.
 * The settings will be loaded from the current saved settings if they aren't specified.
 *
 * @param {string} coName - Name of the CO whose music to use.
 * @param {GAME_TYPE} gameType - (Optional) Which game soundtrack to use.
 * @param {THEME_TYPE} themeType - (Optional) Which type of music to use whether regular or power.
 * @returns The complete URL of the music to play given the parameters.
 */
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

/**
 * Gets the URL for the given sound effect.
 * @param {string} sfx - String key for the sound effect to use.
 * @returns The URL of the given sound effect key.
 */
function getSoundEffectURL(sfx) {
  return `${BASE_URL_SFX}/${sfx}.ogg`;
}

/**
 * Gets the URL to play when the given unit starts to move.
 * @param {string} unitName - Name of the unit.
 * @returns The URL of the given unit's movement start sound.
 */
function getMovementSoundURL(unitName) {
  return onMovementStartMap.get(unitName);
}

/**
 * Getes the URL to play when the given unit stops moving, if any.
 * @param {string} unitName - Name of the unit.
 * @returns The URL of the given unit's movement stop sound, if any, or null otherwise.
 */
function getMovementRollOffURL(unitName) {
  return onMovementRollOffMap.get(unitName);
}

/**
 * Checks if the given unit plays a sound when it stops moving.
 * @param {string} unitName - Name of the unit.
 * @returns True if the given unit has a sound to play when it stops moving.
 */
function hasMovementRollOff(unitName) {
  return onMovementRollOffMap.has(unitName);
}

/**
 * Gets a list of the URLs for all sound effects the music player might ever use.
 * These include game effects, UI effects, and unit movement sounds.
 * @returns List with all the URLs for all the music player sound effects.
 */
function getAllSoundEffectURLS() {
  let sfx = Object.values(gameSFX).map(getSoundEffectURL);
  let moreSFX = Object.values(movementSFX);
  return sfx.concat(moreSFX);
}

// EXTERNAL MODULE: ./shared/config.js
var config = __webpack_require__(373);
;// ./music_player/settings_menu.js
/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of the music player settings UI.
 */






/**
 * Is the settings context menu (right-click) currently open?
 * Used to close the right-click settings menu when you right-click twice
 */
let isSettingsMenuOpen = false;

// Listen for setting changes to update the settings UI
addSettingsChangeListener(onSettingsChange);

/**
 * Adds the right-click context menu with the music player settings to the given node.
 * @param {Element} musicPlayerDiv - The node whose right click will open the context menu.
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
  document.addEventListener("click", (event) => {
    if (event.target.id.startsWith("music-player-")) return;
    closeSettingsMenu();
  });
}

/**
 * Event handler that is triggered whenever the settings of the music player are changed.
 * Updates the music player settings UI (context menu) so it matches the internal settings when the settings change.
 *
 * The context menu is the menu that appears when you right-click the player that shows you options.
 * This function ensures that the internal settings are reflected properly on the UI.
 * @param {string} key - Name of the setting that changed, matches the name of the property in {@link musicPlayerSettings}.
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

volumeSlider.addEventListener("input", (val) => {
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
sfxVolumeSlider.addEventListener("input", (val) => {
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

uiVolumeSlider.addEventListener("input", (val) => {
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
gameTypeSelectorSpan.addEventListener("change", () => {
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
versionSpan.textContent = "VERSION: " + config/* versions */.e.musicPlayer;
versionSpan.style.fontSize = "9px";
versionSpan.style.color = "#888888";

versionDiv.appendChild(versionSpan);
contextMenu.appendChild(versionDiv);

;// ./music_player/music_player_menu.js
/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
 */





/**
 * Adds the music player to the game menu.
 */
function addMusicPlayerMenu() {
  addSettingsMenuToMusicPlayer(musicPlayerDiv);
  menu.appendChild(musicPlayerDiv);
}

/**
 * Sets the loading progress for the music player.
 * Used when preloading audio.
 * @param {number} percentage Integer from 0 to 100 representing the progress of loading the music player.
 */
function setMusicPlayerLoadPercentage(percentage) {
  musicPlayerDivBackground.style.backgroundImage =
    "linear-gradient(to right, #ffffff " + String(percentage) + "% , #888888 0%)";
}

/**
 * Event handler for when the music button is clicked that turns the music ON/OFF.
 * @param {*} _e - Click event handler, not used.
 */
function onMusicBtnClick(_e) {
  musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
}

/**
 * Event handler that is triggered whenever the settings of the music player are changed.
 * @param {string} key - Name of the setting that changed, matches the name of the property in {@link musicPlayerSettings}.
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

// Listen for setting changes to update the menu UI
addSettingsChangeListener(music_player_menu_onSettingsChange);

// Determine who will catch when the user clicks the play/stop button
musicPlayerDivBackground.addEventListener("click", onMusicBtnClick);

;// ./music_player/music.js





/**
 * The URL of the current theme that is playing.
 */
let currentThemeKey = "";

/**
 * Map containing the audio players for all preloaded themes and sound effects.
 * The keys are the preloaded audio URLs.
 * @type {Map.<string, HTMLAudioElement>}
 */
const urlAudioMap = new Map();

/**
 * Map containing the audio players for all units.
 * The keys are the unit IDs.
 * @type {Map.<number, HTMLAudioElement>}
 */
const unitIDAudioMap = new Map();

/**
 * If set to true, calls to playMusic() will set a timer for {@link delayThemeMS} milliseconds after which the music will play again.
 */
let currentlyDelaying = false;

/**
 * If delaying (see {@link currentlyDelaying}), this determines how long to wait before playing music again in milliseconds.
 */
let delayThemeMS = 0;

// Listen for setting changes to update the internal variables accordingly
addSettingsChangeListener(music_onSettingsChange);

/**
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 */
function playThemeSong() {
  if (!musicPlayerSettings.isPlaying) return;

  // Someone wants us to delay playing the theme, so wait a little bit then play
  // Ignore all calls to play() while delaying, we are guaranteed to play eventually
  if (currentlyDelaying) return;
  if (delayThemeMS > 0) {
    // Delay until I say so
    setTimeout(() => {
      currentlyDelaying = false;
      playThemeSong();
    }, delayThemeMS);

    delayThemeMS = 0;
    currentlyDelaying = true;
    return;
  }
  let coName = isMapEditor ? "map-editor" : currentPlayer.coName;
  playMusicURL(getMusicURL(coName), true);
}

/**
 * Stops the current music if there's any playing.
 * Optionally, you can also delay the start of the next theme.
 * @param {number} delayMS - (Optional) Time to delay before we start the next theme.
 */
function stopThemeSong(delayMS = 0) {
  if (!musicPlayerSettings.isPlaying) return;

  // Delay the next theme if needed
  if (delayMS > 0) delayThemeMS = delayMS;

  // Can't stop if there's no loaded music
  if (!urlAudioMap.has(currentThemeKey)) return;

  // Can't stop if we are already paused
  let currentTheme = urlAudioMap.get(currentThemeKey);
  if (currentTheme.paused) return;

  // The song hasn't finished loading, so stop it as soon as it does
  if (currentTheme.readyState !== HTMLAudioElement.HAVE_ENOUGH_DATA) {
    currentTheme.addEventListener("play", (event) => event.target.pause(), { once: true });
    return;
  }

  // The song is loaded and playing, so pause it
  currentTheme.pause();
}

/**
 * Plays the movement sound of the given unit.
 * @param {number} unitId - The ID of the unit who is moving.
 */
function playMovementSound(unitId) {
  if (!musicPlayerSettings.isPlaying) return;

  // The audio hasn't been preloaded for this unit
  if (!unitIDAudioMap.has(unitId)) {
    let unitName = getUnitName(unitId);
    let movementSoundURL = getMovementSoundURL(unitName);
    unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
  }

  // Restart the audio and then play it
  let movementAudio = unitIDAudioMap.get(unitId);
  movementAudio.currentTime = 0;
  movementAudio.loop = false;
  movementAudio.volume = musicPlayerSettings.sfxVolume;
  movementAudio.play();
}

/**
 * Stops the movement sound of a given unit if it's playing.
 * @param {number} unitId - The ID of the unit whose movement sound will be stopped.
 */
function stopMovementSound(unitId, rolloff = true) {
  // Can't stop if there's nothing playing
  if (!musicPlayerSettings.isPlaying) return;

  // Can't stop if the unit doesn't have any sounds
  if (!unitIDAudioMap.has(unitId)) return;

  // Can't stop if the sound is already stopped
  let movementAudio = unitIDAudioMap.get(unitId);
  if (movementAudio.paused) return;

  // The audio hasn't finished loading, so pause when it does
  if (movementAudio.readyState != HTMLAudioElement.HAVE_ENOUGH_DATA) {
    movementAudio.addEventListener("play", (event) => event.target.pause(), { once: true });
    return;
  }

  // The audio is loaded and playing, so pause it
  movementAudio.pause();
  movementAudio.currentTime = 0;

  // If unit has rolloff, play it
  if (!rolloff) return;
  let unitName = getUnitName(unitId);
  if (hasMovementRollOff(unitName)) {
    let audioURL = getMovementRollOffURL(unitName);
    playOneShotURL(audioURL, musicPlayerSettings.sfxVolume);
  }
}

/**
 * Plays the given sound effect.
 * @param {string} sfx - String representing a key in {@link gameSFX}.
 */
function playSFX(sfx) {
  if (!musicPlayerSettings.isPlaying) return;

  let sfxURL = getSoundEffectURL(sfx);

  // Figure out which volume to use
  let vol = musicPlayerSettings.sfxVolume;
  if (sfx.startsWith("sfx-ui")) {
    vol = musicPlayerSettings.uiVolume;
  }

  // This sound effect hasn't been loaded yet
  if (!urlAudioMap.has(sfxURL)) {
    urlAudioMap.set(sfxURL, new Audio(sfxURL));
  }

  // The sound is loaded, so play it
  let audio = urlAudioMap.get(sfxURL);
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
  for (let unitId in Object.keys(unitIDAudioMap)) {
    stopMovementSound(unitId, false);
  }

  // Mute sound effects
  for (let sfxURL in Object.keys(urlAudioMap)) {
    sfxURL.volume = 0;
  }
}

/**
 * Preloads the current game COs' themes and common sound effect audios.
 * Run this first so we can start the player almost immediately!
 * @param {*} afterPreloadFunction - Function to run after the audio is pre-loaded.
 */
function preloadCommonAudio(afterPreloadFunction) {
  // Preload the themes of the COs in this match
  let coNames = isMapEditor ? ["map-editor"] : getAllCONames();
  let audioList = coNames.map((name) => getMusicURL(name));

  // Preload the most common UI sounds that might play right after the page loads
  audioList.push(getSoundEffectURL(gameSFX.uiCursorMove));
  audioList.push(getSoundEffectURL(gameSFX.uiUnitSelect));

  preloadList(audioList, afterPreloadFunction);
}

/**
 * Preloads the current game CO's themes for ALL game versions and ALL sound effect audios.
 * Run this after the common audios since we have more time to get things ready for these.
 * @param {*} afterPreloadFunction - Function to run after the audio is pre-loaded.
 */
function preloadExtraAudio(afterPreloadFunction) {
  if (isMapEditor) return;

  // Preload ALL sound effects
  let audioList = getAllSoundEffectURLS();

  // We preload the themes for each game version
  let coNames = getAllCONames();
  for (let gameType in GAME_TYPE) {
    for (let themeType in THEME_TYPE) {
      let gameList = coNames.map((name) => getMusicURL(name, gameType, themeType));
      audioList = audioList.concat(gameList);
    }
  }

  preloadList(audioList, afterPreloadFunction);
}

/**
 * Preloads the given list of songs and adds them to the {@link urlAudioMap}.
 * @param {string[]} audioList - List of URLs of songs to preload.
 * @param {*} afterPreloadFunction - Function to call after all songs are preloaded.
 */
function preloadList(audioList, afterPreloadFunction) {
  // Only unique audios, remove duplicates
  audioList = new Set(audioList);

  // Event handler for when an audio is loaded
  let numLoadedAudios = 0;
  let onLoadAudio = (event) => {
    // Update UI
    numLoadedAudios++;
    let loadPercentage = (numLoadedAudios / audioList.size) * 100;
    setMusicPlayerLoadPercentage(loadPercentage);

    // If the audio loaded properly, then add it to our map
    if (event.type !== "error") {
      urlAudioMap.set(event.target.src, event.target);
    }

    // All the audio from the list has been loaded
    if (numLoadedAudios >= audioList.size) {
      if (afterPreloadFunction) afterPreloadFunction();
    }
  };

  // Event handler when an audio isn't able to be loaded
  let onLoadAudioError = (event) => {
    // console.log("[AWBW Improved Music Player] Could not pre-load: ", event.target.src);
    onLoadAudio(event);
  };

  // Pre-load all audios in the list
  audioList.forEach((url) => {
    // This audio has already been loaded before, so skip it
    if (urlAudioMap.has(url)) {
      numLoadedAudios++;
      return;
    }
    let audio = new Audio(url);
    audio.addEventListener("loadedmetadata", onLoadAudio, false);
    audio.addEventListener("error", onLoadAudioError, false);
  });
}

/**
 * Changes the current song to the given new song, stopping the old song if necessary.
 * @param {string} srcURL - URL of song to play.
 * @param {boolean} loop - (Optional) Whether to loop the music or not, defaults to true.
 */
function playMusicURL(srcURL, loop = true) {
  if (!musicPlayerSettings.isPlaying) return;

  // We want to play the same song we already are playing
  let currentTheme = urlAudioMap.get(currentThemeKey);
  if (srcURL === currentThemeKey) {
    // The song was paused, so resume it
    if (currentTheme.paused) currentTheme.play();
    return;
  }

  // We want to play a new song, so pause the previous one
  stopThemeSong();

  // This is now the current song
  currentThemeKey = srcURL;
  console.log("[AWBW Improved Music Player] Now Playing: " + srcURL);

  // The song isn't preloaded
  if (!urlAudioMap.has(srcURL)) {
    urlAudioMap.set(srcURL, new Audio(srcURL));
  }

  // Play the song
  currentTheme = urlAudioMap.get(srcURL);
  currentTheme.volume = musicPlayerSettings.volume;
  currentTheme.loop = loop;
  currentTheme.play();
}

/**
 * Plays the given sound by creating a new instance of it.
 * @param {string} srcURL - URL of the sound to play.
 * @param {number} volume - Volume at which to play this sound.
 */
function playOneShotURL(srcURL, volume) {
  if (!musicPlayerSettings.isPlaying) return;

  let soundInstance = new Audio(srcURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
}

/**
 * Updates the internal audio components to match the current music player settings when the settings change.
 *
 * @param {*} _key - Key of the setting which has been changed.
 */
function music_onSettingsChange(key) {
  switch (key) {
    case "isPlaying":
      if (musicPlayerSettings.isPlaying) {
        playThemeSong();
      } else {
        stopAllSounds();
      }
      break;
    case "gameType":
      playThemeSong();
      break;
    case "volume": {
      // Adjust the volume of the current theme
      let currentTheme = urlAudioMap.get(currentThemeKey);
      if (currentTheme) {
        currentTheme.volume = musicPlayerSettings.volume;
      }
      break;
    }
  }
}

;// ./music_player/awbw_handlers.js
/**
 * @file This file contains all the AWBW website handlers that will intercept clicks and any relevant functions of the website.
 */






/**
 * @callback ahCursorMove
 * @param {number} cursorX -
 * @param {number} cursorY -
 */

/**
 * How long to wait in milliseconds before we register a cursor movement.
 * Used to prevent overwhelming the user with too many cursor movement sound effects.
 * @type {number}
 */
const CURSOR_THRESHOLD_MS = 25;

/**
 * Date representing when we last moved the game cursor.
 * @type {number}
 */
let lastCursorCall = Date.now();

let menuItemClick = false;
let menuOpen = false;

let visibilityMap = new Map();
let movementResponseMap = new Map();

/**
 * Add all handlers that will intercept clicks and functions on the website
 */
function addSiteHandlers() {
  // Replay Handlers
  let refreshMusic = () => {
    setTimeout(playThemeSong, 500);
    visibilityMap.clear();
  };
  replayForwardBtn.addEventListener("click", refreshMusic);
  replayForwardActionBtn.addEventListener("click", refreshMusic);
  replayBackwardBtn.addEventListener("click", refreshMusic);
  replayBackwardActionBtn.addEventListener("click", refreshMusic);
  replayOpenBtn.addEventListener("click", refreshMusic);
  replayCloseBtn.addEventListener("click", refreshMusic);
  replayDaySelectorCheckBox.addEventListener("click", refreshMusic);

  // Action Handlers
  /* global updateCursor:writeable */
  /* global openMenu:writeable */
  /* global closeMenu:writeable */
  /* global unitClickHandler:writeable */
  /* global waitUnit:writeable */
  /* global animUnit:writeable */
  /* global animExplosion:writeable */
  /* global updateAirUnitFogOnMove:writeable */

  let ahOpenMenu = openMenu;
  let ahCursorMove = updateCursor;
  let ahCloseMenu = closeMenu;
  let ahUnitClick = unitClickHandler;
  let ahWait = waitUnit;
  let ahAnimUnit = animUnit;
  let ahExplodeAnim = animExplosion;
  let ahFog = updateAirUnitFogOnMove;

  // Catches both actionHandlers.Delete and actionHandlers.Explode
  /* global actionHandlers:writeable */
  let ahFire = actionHandlers.Fire;
  let ahAttackSeam = actionHandlers.AttackSeam;
  let ahMove = actionHandlers.Move;
  let ahCapt = actionHandlers.Capt;
  let ahBuild = actionHandlers.Build;
  let ahLoad = actionHandlers.Load;
  let ahUnload = actionHandlers.Unload;
  let ahSupply = actionHandlers.Supply;
  let ahRepair = actionHandlers.Repair;
  let ahHide = actionHandlers.Hide;
  let ahUnhide = actionHandlers.Unhide;
  let ahJoin = actionHandlers.Join;
  // let ahDelete = actionHandlers.Delete;
  // let ahExplode = actionHandlers.Explode;
  let ahLaunch = actionHandlers.Launch;
  let ahNextTurn = actionHandlers.NextTurn;
  let ahElimination = actionHandlers.Elimination;
  let ahPower = actionHandlers.Power;
  // let ahSetDraw = actionHandlers.SetDraw;
  // let ahResign = actionHandlers.Resign;
  let ahGameOver = actionHandlers.GameOver;

  /**
   * Function called when the cursor is moved in the game.
   * @param {number} cursorX - The x coordinate of the cursor inside the game grid.
   * @param {number} cursorY - The y coordinate of the cursor inside the game grid.
   */
  updateCursor = (cursorX, cursorY) => {
    ahCursorMove.apply(updateCursor, [cursorX, cursorY]);
    if (!musicPlayerSettings.isPlaying) return;

    if (Date.now() - lastCursorCall > CURSOR_THRESHOLD_MS) {
      playSFX(gameSFX.uiCursorMove);
    }
    lastCursorCall = Date.now();
  };

  /**
   * Function called when the action menu is opened after you move a unit.
   * @param {HTMLDivElement} menu -
   * @param {number} x -
   * @param {number} y -
   */
  openMenu = (menu, x, y) => {
    ahOpenMenu.apply(openMenu, [menu, x, y]);
    if (!musicPlayerSettings.isPlaying) return;

    let menuOptions = document.getElementsByClassName("menu-option");
    for (var i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseenter", (_event) => {
        playSFX(gameSFX.uiMenuMove);
      });

      menuOptions[i].addEventListener("click", (_event) => (menuItemClick = true));
    }

    menuOpen = true;
    playSFX(gameSFX.uiMenuOpen);
  };

  /**
   * Function called when the action menu is closed after you select an action or cancel.
   */
  closeMenu = () => {
    ahCloseMenu.apply(closeMenu, []);
    if (!musicPlayerSettings.isPlaying) return;

    console.log("close menu", menuOpen, menuItemClick);
    if (menuOpen && !menuItemClick) {
      playSFX(gameSFX.uiMenuClose);
    } else if (menuOpen && menuItemClick) {
      playSFX(gameSFX.uiMenuOpen);
    } else if (menuItemClick) {
      playSFX(gameSFX.uiMenuClose);
    }

    menuOpen = false;
    menuItemClick = false;
  };

  unitClickHandler = (clicked) => {
    ahUnitClick.apply(unitClickHandler, [clicked]);
    if (!musicPlayerSettings.isPlaying) return;
    menuItemClick = true;
    playSFX(gameSFX.uiUnitSelect);
  };

  waitUnit = (unitId) => {
    ahWait.apply(waitUnit, [unitId]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.log("Wait", unitId, getUnitName(unitId));

    stopMovementSound(unitId);
    // Check if we stopped because we got trapped
    if (movementResponseMap.has(unitId)) {
      let response = movementResponseMap.get(unitId);
      if (response.trapped) {
        playSFX(gameSFX.actionUnitTrap);
      }
      movementResponseMap.delete(unitId);
    }
  };

  animUnit = (path, unitId, unitSpan, unitTeam, viewerTeam, i) => {
    ahAnimUnit.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);

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

  /**
   * @param {import("../shared/awbw_site").UnitInfo} unit - Unit info for the unit that will explode.
   */
  animExplosion = (unit) => {
    ahExplodeAnim.apply(animExplosion, [unit]);
    if (!musicPlayerSettings.isPlaying) return;

    // console.log("Exploded", unit);
    let unitId = unit.units_id;
    let unitFuel = unit.units_fuel;
    let sfx = gameSFX.actionUnitExplode;
    if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
      sfx = gameSFX.actionMissileHit;
    }
    playSFX(sfx);
    stopMovementSound(unitId, false);
  };

  updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change, delay) => {
    ahFog.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
    if (!musicPlayerSettings.isPlaying) return;

    let unitInfo = getUnitInfoFromCoords(x, y);
    if (change === "Add") {
      setTimeout(() => stopMovementSound(unitInfo.units_id, false), delay);
    }
  };

  actionHandlers.Fire = (fireResponse) => {
    if (!musicPlayerSettings.isPlaying) {
      ahFire.apply(actionHandlers.Fire, [fireResponse]);
      return;
    }

    let attackerID = fireResponse.copValues.attacker.playerId;
    let defenderID = fireResponse.copValues.defender.playerId;

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

  /**
   * @param {import("../shared/awbw_site").SeamResponse} seamResponse
   */
  actionHandlers.AttackSeam = (seamResponse) => {
    ahAttackSeam.apply(actionHandlers.AttackSeam, [seamResponse]);
    if (!musicPlayerSettings.isPlaying) return;
    // console.log("Pipe seam", seamResponse);

    // Pipe wiggle animation
    if (gameAnimations) {
      let x = seamResponse.seamX;
      let y = seamResponse.seamY;
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
      setTimeout(wiggleAnimation, attackDelayMS);
    }

    if (seamResponse.seamHp <= 0) {
      playSFX(gameSFX.actionUnitAttackPipeSeam);
      playSFX(gameSFX.actionUnitExplode);
      return;
    }
    setTimeout(() => playSFX(gameSFX.actionUnitAttackPipeSeam), attackDelayMS);
  };

  actionHandlers.Move = (moveResponse, loadFlag) => {
    ahMove.apply(actionHandlers.Move, [moveResponse, loadFlag]);
    if (!musicPlayerSettings.isPlaying) return;

    let unitId = moveResponse.unit.units_id;
    movementResponseMap.set(unitId, moveResponse);
    // console.log("Move", moveResponse);

    var movementDist = moveResponse.path.length;
    if (movementDist > 1) {
      playMovementSound(unitId);
    }
  };

  actionHandlers.Capt = (captData) => {
    ahCapt.apply(actionHandlers.Capt, [captData]);
    if (!musicPlayerSettings.isPlaying) return;

    let isValid = captData != undefined;
    if (!isValid) return;

    // They didn't finish the capture
    let finishedCapture = captData.newIncome != null;
    if (!finishedCapture) {
      playSFX(gameSFX.actionCaptureProgress);
      return;
    }

    // The unit is done capping this property
    let myID = getMyID();
    let isSpectator = isPlayerSpectator(myID);
    let isMyCapture = isSpectator || captData?.buildingInfo.buildings_team === myID;
    let sfx = isMyCapture ? gameSFX.actionCaptureAlly : gameSFX.actionCaptureEnemy;
    playSFX(sfx);
  };

  actionHandlers.Build = (buildData) => {
    ahBuild.apply(actionHandlers.Build, [buildData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitSupply);
  };

  actionHandlers.Load = (loadData) => {
    ahLoad.apply(actionHandlers.Load, [loadData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitLoad);
  };

  actionHandlers.Unload = (unloadData) => {
    ahUnload.apply(actionHandlers.Unload, [unloadData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitUnload);
  };

  actionHandlers.Supply = (supplyRes) => {
    ahSupply.apply(actionHandlers.Supply, [supplyRes]);
    if (!musicPlayerSettings.isPlaying) return;

    // We could play the sfx for each supplied unit in the list
    // but instead we decided to play the supply sound once.
    playSFX(gameSFX.actionUnitSupply);
  };

  actionHandlers.Repair = (repairData) => {
    ahRepair.apply(actionHandlers.Repair, [repairData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitSupply);
  };

  actionHandlers.Hide = (hideData) => {
    ahHide.apply(actionHandlers.Hide, [hideData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitHide);
    // console.log("Hide", hideData, hideData.unitId, hideData.unitID);
    stopMovementSound(hideData.unitId);
  };

  actionHandlers.Unhide = (unhideData) => {
    ahUnhide.apply(actionHandlers.Unhide, [unhideData]);
    if (!musicPlayerSettings.isPlaying) return;
    playSFX(gameSFX.actionUnitUnhide);
    stopMovementSound(unhideData.unitId);
  };

  actionHandlers.Join = (joinData) => {
    ahJoin.apply(actionHandlers.Join, [joinData]);
    if (!musicPlayerSettings.isPlaying) return;
    stopMovementSound(joinData.joinID);
    stopMovementSound(joinData.joinedUnit.units_id);
  };

  // actionHandlers.Delete = (deleteData) => {
  //   ahDelete.apply(actionHandlers.Delete, [deleteData]);
  // };

  // actionHandlers.Explode = (data) => {
  //   ahExplode.apply(actionHandlers.Explode, [data]);
  // };

  actionHandlers.Launch = (data) => {
    ahLaunch.apply(actionHandlers.Launch, [data]);
    if (!musicPlayerSettings.isPlaying) return;

    playSFX(gameSFX.actionMissileSend);
    setTimeout(() => playSFX(gameSFX.actionMissileHit), siloDelayMS);
  };

  actionHandlers.NextTurn = (nextTurnRes) => {
    ahNextTurn.apply(actionHandlers.NextTurn, [nextTurnRes]);
    if (!musicPlayerSettings.isPlaying) return;

    visibilityMap.clear();
    playThemeSong();
  };

  actionHandlers.Elimination = (eliminationRes) => {
    ahElimination.apply(actionHandlers.Elimination, [eliminationRes]);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;
  };

  actionHandlers.Power = (powerRes) => {
    ahPower.apply(actionHandlers.Power, [powerRes]);
    if (!musicPlayerSettings.isPlaying) return;

    let coName = powerRes.coName;
    let isSuperCOPower = powerRes.coPower === "S";
    let isBH = isBlackHoleCO(coName);

    if (isSuperCOPower) {
      let sfx = isBH ? gameSFX.actionBHActivateSCOP : gameSFX.actionAllyActivateSCOP;
      playSFX(sfx);
      stopThemeSong(2500);
    }
  };

  // actionHandlers.SetDraw = (drawData) => {
  //   ahSetDraw.apply(actionHandlers.SetDraw, [drawData]);
  //   debugger;
  // };

  // actionHandlers.Resign = (resignRes) => {
  //   ahResign.apply(actionHandlers.Resign, [resignRes]);
  //   debugger;
  // }

  actionHandlers.GameOver = () => {
    ahGameOver.apply(actionHandlers.GameOver, []);
    if (!musicPlayerSettings.isPlaying) return;

    debugger;
  };
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
/**
 * @file AWBW Improved Music Player's main script that loads everything.
 *
 * @todo Edit DS/MapTheme with Audacity
 * @todo DS character themes for AW1/AW2/AW_RBC
 * @todo Add shuffle
 * @todo Alternate themes
 * @todo Factory themes for RBC
 * @todo CSS from code to .css file
 * @todo More settings
 * @todo Finish documentation
 */






// Add our CSS to the page using webpack


/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
addMusicPlayerMenu();
addSiteHandlers();
preloadCommonAudio(() => {
  console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");

  loadSettingsFromLocalStorage();

  preloadExtraAudio(() => {
    console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
  });
});

