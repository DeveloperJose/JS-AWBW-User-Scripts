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
let replayForwardBtn = document.querySelector(".replay-forward");
let replayBackwardBtn = document.querySelector(".replay-backward");
let replayDaySelectorCheckBox = document.querySelector(".replay-day-selector");

/********************** AWBW Page Variables ***********************/
/* global maxX, maxY, playersInfo, currentTurn */
let mapCols = (/* unused pure expression or super */ null && (maxX));
let mapRows = (/* unused pure expression or super */ null && (maxY));

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

/**
 * Determine who the current CO is and return their name.
 * @returns String with the name of the current CO.
 */
function getCurrentCOName() {
  return playersInfo[currentTurn]["co_name"];
}

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
} // preloadThemes();
// musicPlayerSettings.currentSFX.onloadedmetadata = function () {
//   musicPlayerSettings.currentSFX.loop = false;
//   musicPlayerSettings.currentSFX.play();
// };

;// ./shared/utils.js
/**
 *
 */
var on = (() => {
  if (window.addEventListener) {
    return (target, type, listener) => {
      target.addEventListener(type, listener, false);
    };
  } else {
    return (object, sEvent, fpNotify) => {
      object.attachEvent("on" + sEvent, fpNotify);
    };
  }
})();

;// ./music_player/music_settings.js
const STORAGE_KEY = "musicPlayerSettings";

const GAME_TYPE = Object.freeze({
  AW1: "AW1",
  AW2: "AW2",
  AW_RBC: "AW_RBC",
  AW_DS: "AW_DS",
});

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
  // TODO: Powers

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
      console.log(
        "[AWBW Improved Music Player] Loaded setting:" + regularKey + "=" + savedSettings[key],
      );
      musicPlayerSettings[regularKey] = savedSettings[key];
    }
  }

  // From now on, any setting changes will be saved
  addSettingsChangeListener(updateSettingsInLocalStorage);
}

/**
 * Saves the current music player settings in the local storage.
 */
function updateSettingsInLocalStorage() {
  console.log(
    "[AWBW Improved Music Player] Saving settings:" + JSON.stringify(musicPlayerSettings),
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(musicPlayerSettings));
}

;// ./music_player/resources.js


/*
 * All external resources used by this userscript like URLs.
 */
const BASE_URL = "https://devj.surge.sh/music";
const neutralImgLink = "https://macroland.one/img/music-player-icon.png";
const playingImgLink = "https://macroland.one/img/music-player-playing.gif";

const movementSFX = {
  moveBCopterLoop: "https://macroland.one/movement/move_bcopter.wav",
  moveBCopterOneShot: "https://macroland.one/movement/move_bcopter_rolloff.wav",
  moveInfLoop: "https://macroland.one/movement/move_inf.wav",
  moveMechLoop: "https://macroland.one/movement/move_mech.wav",
  moveNavalLoop: "https://macroland.one/movement/move_naval.wav",
  movePiperunnerLoop: "https://macroland.one/movement/move_piperunner.wav",
  movePlaneLoop: "https://macroland.one/movement/move_plane.wav",
  movePlaneOneShot: "https://macroland.one/movement/move_plane_rolloff.wav",
  moveSubLoop: "https://macroland.one/movement/move_sub.wav",
  moveTCopterLoop: "https://macroland.one/movement/move_tcopter.wav",
  moveTCopterOneShot: "https://macroland.one/movement/move_tcopter_rolloff.wav",
  moveTiresHeavyLoop: "https://macroland.one/movement/move_tires_heavy.wav",
  moveTiresHeavyOneShot: "https://macroland.one/movement/move_tires_heavy_rolloff.wav",
  moveTiresLightLoop: "https://macroland.one/movement/move_tires_light.wav",
  moveTiresLightOneShot: "https://macroland.one/movement/move_tires_light_rolloff.wav",
  moveTreadHeavyLoop: "https://macroland.one/movement/move_tread_heavy.wav",
  moveTreadHeavyOneShot: "https://macroland.one/movement/move_tread_heavy_rolloff.wav",
  moveTreadLightLoop: "https://macroland.one/movement/move_tread_light.wav",
  moveTreadLightOneShot: "https://macroland.one/movement/move_tread_light_rolloff.wav",
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

const gameSFX = {
  actionLoadSFX: "https://macroland.one/game/action_load.wav",
  actionUnloadSFX: "https://macroland.one/game/action_unload.wav",
  actionCaptAllySFX: "https://macroland.one/game/capture_ally.wav",
  actionCaptEnemySFX: "https://macroland.one/game/capture_enemy.wav",
  actionUnitExplode: "https://macroland.one/game/unit_explode.wav",
  actionSupplyRepair: "https://macroland.one/game/action_resupply_repair.wav",
};

const uiSFX = {
  uiCursorMove: "https://macroland.one/game/ui_cursormove.wav",
  uiMenuOpen: "https://macroland.one/game/ui_openmenu.wav",
  uiMenuClose: "https://macroland.one/game/ui_closemenu.wav",
  uiMenuMove: "https://macroland.one/game/ui_menumove.wav",
  uiUnitClick: "https://macroland.one/game/ui_unitclick.wav",
  powerSCOPIntro: "https://macroland.one/game/power_co_scop.wav",
  powerBHSCOPIntro: "https://macroland.one/game/power_bh_scop.wav",
};

// const AW1_CO_LIST = new Map([
//   "andy",
//   "max",
//   "sami",
//   "olaf",
//   "grit",
//   "eagle",
//   "drake",
//   "sturm"
// ]);

// const AW2_CO_LIST = new Map([
//   "hachi",
//   "nell",
//   "colin",
//   "sensei",
//   "flak",
//   "lash",
//   "adder",
//   "hawke"
// ]);

// const AWDS_CO_LIST = new Map([
//   "jake",
//   "rachel",
//   "sasha",
//   "javier",
//   "jugger",
//   "koal",
//   "kindle",
//   "von_bolt"
// ]);

// const BLACK_HOLE_CO_LIST = new Map([
//   "flak",
//   "lash",
//   "adder",
//   "hawke",
//   "sturm",
//   "jugger",
//   "koal",
//   "kindle",
//   "von_bolt"
// ]);

// const CO_LIST_FOR_GAME_TYPE = new Map([
//   [GAME_TYPE.AW1, AW1_CO_LIST],
//   [GAME_TYPE.AW2, AW2_CO_LIST],
//   [GAME_TYPE.AW_RBC, AW2_CO_LIST],
//   [GAME_TYPE.AW_DS, AWDS_CO_LIST]
// ]);

function getMusicURL(coName, gameType = null) {
  if (gameType === null) {
    gameType = musicPlayerSettings.gameType.toLowerCase();
  }
  let filename = "t-" + coName;
  return `${BASE_URL}/${gameType}/${filename}.ogg`;
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





// Set default audio settings
const currentTheme = new Audio();
const currentSFX = new Audio();
const currentUI = new Audio();
currentSFX.loop = true;

// Always play any music that finishes loading
currentTheme.onloadedmetadata = function () {
  currentTheme.play();
};

// Listen for setting changes to update the internal variables accordingly
addSettingsChangeListener(music_onSettingsChange);

/**
 * Plays the appropriate music based on the settings and the current game state.
 * Determines the music automatically so just call this anytime the game state changes.
 */
function playMusic() {
  if (!musicPlayerSettings.isPlaying) return;
  let coName = isMapEditor ? "map-editor" : getCurrentCOName();
  playCOTheme(coName);
}

/**
 * Stops all music if there's any playing.
 */
function stopMusic() {
  currentTheme.pause();
}

/**
 * Plays the movement sound of the given unit.
 * @param {*} unitType String containing the name of the unit.
 */
function playMovementSound(unitType) {
  if (!musicPlayerSettings.isPlaying) {
    return;
  }
  currentSFX.src = onMovementStartMap.get(unitType);
  currentSFX.currentTime = 0;
  currentSFX.volume = musicPlayerSettings.sfxVolume;
  currentSFX.play();
}

/**
 * Stops any movement sound currently playing.
 * Optionally plays a rolloff sound afterwards if a unit is provided.
 * @param {*} unitType (Optional) String containing the name of the unit for rolloff.
 */
function stopMovementSound(unitType = null) {
  // Can't stop if there's nothing playing
  if (!musicPlayerSettings.isPlaying || currentSFX.paused) {
    return;
  }

  currentSFX.currentTime = 0;
  currentSFX.pause();

  if (unitType !== null) {
    let audioURL = onMovementRollOffMap.get(unitType);
    playOneShotURL(audioURL, musicPlayerSettings.sfxVolume);
  }
}

/**
 * Preloads the current game COs' themes and common sound effect audios.
 */
function preloadCommonAudio() {
  let audioList = [];

  // Preload the themes of the COs in this match
  // We preload the themes for each game version
  let coNames = isMapEditor ? ["map-editor"] : getAllCONames();
  for (let gameType in GAME_TYPE) {
    audioList.push(coNames.map(getMusicURL, gameType));
  }

  // Preload SFX
  for (let key in movementSFX) {
    audioList.push(movementSFX[key]);
  }
  for (let key in gameSFX) {
    audioList.push(gameSFX[key]);
  }
  for (let key in uiSFX) {
    audioList.push(uiSFX[key]);
  }

  preloadAudioList(audioList);
}

function playMusicURL(srcURL, loop = false) {
  if (srcURL === currentTheme.src) {
    if (currentTheme.paused) {
      currentTheme.play();
    }
    return;
  }
  currentTheme.src = srcURL;
  currentTheme.loop = loop;
  console.log("Now Playing:" + srcURL);
}

function playOneShotURL(srcURL, volume) {
  let soundInstance = new Audio(srcURL);
  soundInstance.currentTime = 0;
  soundInstance.volume = volume;
  soundInstance.play();
}

function playCOTheme(coName) {
  coName = coName.toLowerCase();
  let srcURL = getMusicURL(coName);
  playMusicURL(srcURL, true);
}

function preloadAudioList(audioList) {
  // Only unique audios, remove duplicates
  audioList = new Set(audioList);

  let numLoadedAudios = 1;
  let onLoadAudio = function () {
    numLoadedAudios++;
    let loadPercentage = (numLoadedAudios / audioList.size) * 100;
    setMusicPlayerLoadPercentage(loadPercentage);

    if (numLoadedAudios >= audioList.size) {
      console.log("[AWBW Improved Music Player] All audio has been pre-loaded!");
    }
  };

  audioList.forEach((url) => {
    let audio = new Audio();
    audio.addEventListener("canplaythrough", onLoadAudio, false);
    audio.src = url;
  });
}

/**
 * Updates the internal audio components to match the current music player settings when the settings change.
 *
 * @param {*} _key Key of the setting which has been changed.
 */
function music_onSettingsChange(key) {
  currentTheme.volume = musicPlayerSettings.volume;
  currentSFX.volume = musicPlayerSettings.sfxVolume;
  currentUI.volume = musicPlayerSettings.uiVolume;

  switch (key) {
    case "isPlaying":
      if (musicPlayerSettings.isPlaying) {
        playMusic();
      } else {
        stopMusic();
      }
      break;
    case "gameType":
      console.log("new game type");
      playMusic();
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








function addReplayHandlers() {
  if (replayForwardBtn != null) {
    on(replayForwardBtn, "click", () => setTimeout(playMusic, 500));
  }

  if (replayBackwardBtn != null) {
    on(replayBackwardBtn, "click", () => setTimeout(playMusic, 500));
  }

  if (replayDaySelectorCheckBox != null) {
    on(replayDaySelectorCheckBox, "click", () => setTimeout(playMusic, 500));
  }
}

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
addMusicPlayerMenu();
loadSettingsFromLocalStorage();
preloadCommonAudio();
addReplayHandlers();

// Action Handlers
/* global unitsInfo */

/* global updateCursor:writeable */
let ahCursorMove = updateCursor;
let lastCursorCall = Date.now();
const CURSOR_THRESHOLD = 30;

updateCursor = function () {
  ahCursorMove.apply(updateCursor, arguments);
  if (!musicPlayerSettings.isPlaying) return;

  if (Date.now() - lastCursorCall > CURSOR_THRESHOLD) {
    // playOneShot(uiCursorMove, uiVolume);
  }
  lastCursorCall = Date.now();
};

/* global openMenu:writeable */
let ahOpenMenu = openMenu;
let menuItemClick = false;
let menuOpen = false;
openMenu = function () {
  ahOpenMenu.apply(openMenu, arguments);
  if (!musicPlayerSettings.isPlaying) return;

  let menuOptions = document.getElementsByClassName("menu-option");

  for (var i = 0; i < menuOptions.length; i++) {
    menuOptions[i].addEventListener("mouseover", function (e) {
      if (e.target !== this) {
        return;
      }
      // playOneShot(uiMenuMove, uiVolume);
    });

    on(menuOptions[i], "click", function () {
      menuItemClick = true;
    });
  }

  menuOpen = true;

  // playOneShot(uiMenuOpen, uiVolume);
};

/* global closeMenu:writeable */
let ahCloseMenu = closeMenu;
closeMenu = function () {
  ahCloseMenu.apply(closeMenu, arguments);
  if (!musicPlayerSettings.isPlaying) return;

  if (menuItemClick && menuOpen) {
    // playOneShot(uiMenuOpen, uiVolume);
  }
  if (!menuItemClick && menuOpen) {
    // playOneShot(uiMenuClose, uiVolume);
  }

  menuOpen = false;
  menuItemClick = false;
};

/* global unitClickHandler:writeable */
let ahUnitClick = unitClickHandler;
unitClickHandler = function () {
  ahUnitClick.apply(unitClickHandler, arguments);
  if (!musicPlayerSettings.isPlaying) return;
  // playOneShot(uiUnitClick, uiVolume);
};

/* global waitUnit:writeable */
let ahWait = waitUnit;
waitUnit = function () {
  ahWait.apply(waitUnit, arguments);
  debugger;

  let isValid =
    arguments[0] !== undefined &&
    unitsInfo[arguments[0]] !== undefined &&
    unitsInfo[arguments[0]].units_moved;
  if (isValid) {
    stopMovementSound(arguments[0]);
  }
};

/* global joinUnits:writeable */
let ahJoin = joinUnits;
joinUnits = function () {
  ahJoin.apply(joinUnits, arguments);
  debugger;
  stopMovementSound();
};

/* global updateAirUnitFogOnMove:writeable */
let ahFog = updateAirUnitFogOnMove;
updateAirUnitFogOnMove = function () {
  ahFog.apply(updateAirUnitFogOnMove, arguments);

  if (!musicPlayerSettings.isPlaying) return;

  if (arguments[5] === "Add") {
    // setTimeout(() => {
    //   if (movementSFX != null) {
    //     stopMovementSound(movingUnit);
    //   }
    // }, arguments[6]);
  }
};

/* global hideUnit:writeable */
let ahHide = hideUnit;
hideUnit = function () {
  ahHide.apply(hideUnit, arguments);
  stopMovementSound();
};

/* global animExplosion:writeable */
let ahExplode = animExplosion;
animExplosion = function () {
  ahExplode.apply(animExplosion, arguments);
  // playOneShot(actionUnitExplode, sfxVolume);
};

/* global actionHandlers:writeable */
let ahMove = actionHandlers.Move;
actionHandlers.Move = function () {
  ahMove.apply(actionHandlers.Move, arguments);
  debugger;

  stopMovementSound();
  var movementDist = arguments[0].path.length;
  if (movementDist > 1) {
    var unitType = unitsInfo[arguments[0].unit.units_id].units_name;
    playMovementSound(unitType);
  }
};

let ahLoad = actionHandlers.Load;
actionHandlers.Load = function () {
  ahLoad.apply(actionHandlers.Load, arguments);
  // playOneShot(actionLoadSFX, sfxVolume);
};

let ahUnload = actionHandlers.Unload;
actionHandlers.Unload = function () {
  ahUnload.apply(actionHandlers.Unload, arguments);
  // playOneShot(actionUnloadSFX, sfxVolume);
};

let ahCapt = actionHandlers.Capt;
actionHandlers.Capt = function () {
  ahCapt.apply(actionHandlers.Capt, arguments);

  // if (
  //   (arguments[0].newIncome != undefined || arguments[0].newIncome != null) &&
  //   playerKeys.includes(myID)
  // ) {
  //   if (
  //     arguments[0].buildingInfo.buildings_team != null &&
  //     arguments[0].buildingInfo.buildings_team != myID
  //   ) {
  //     playOneShot(actionCaptEnemySFX, sfxVolume);
  //   } else if (
  //     arguments[0].buildingInfo.buildings_team != null &&
  //     arguments[0].buildingInfo.buildings_team == myID
  //   ) {
  //     playOneShot(actionCaptAllySFX, sfxVolume);
  //   }
  // } else if (
  //   (arguments[0].newIncome != undefined || arguments[0].newIncome != null) &&
  //   !playerKeys.includes(myID)
  // ) {
  //   if (arguments[0].buildingInfo.buildings_team != null) {
  //     playOneShot(actionCaptAllySFX, sfxVolume);
  //   }
  // }
};
let ahSupply = actionHandlers.Supply;
actionHandlers.Supply = function () {
  ahSupply.apply(actionHandlers.Supply, arguments);
  // playOneShot(actionSupplyRepair, sfxVolume);
};

let ahRepair = actionHandlers.Repair;
actionHandlers.Repair = function () {
  ahRepair.apply(actionHandlers.Repair, arguments);
  // playOneShot(actionSupplyRepair, sfxVolume);
};

let ahBuild = actionHandlers.Build;
actionHandlers.Build = function () {
  ahBuild.apply(actionHandlers.Build, arguments);

  // if (!playerKeys.includes(myID)) {
  //   playOneShot(actionSupplyRepair, sfxVolume);
  // }
};

