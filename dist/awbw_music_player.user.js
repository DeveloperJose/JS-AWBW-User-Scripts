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

var __webpack_modules__ = {
    343: (module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.d(__webpack_exports__, { A: () => __WEBPACK_DEFAULT_EXPORT__ });
      var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(601),
        _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default =
          __webpack_require__.n(
            _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__,
          ),
        _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(314),
        ___CSS_LOADER_EXPORT___ = __webpack_require__.n(
          _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__,
        )()(
          _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default(),
        );
      ___CSS_LOADER_EXPORT___.push([
        module.id,
        '/* Context Menu */\n.cls-context-menu-link {\n  display: block;\n  padding: 20px;\n  background: #ececec;\n}\n\n.cls-context-menu {\n  position: absolute;\n  display: none;\n  width: 175px;\n  height: 347px;\n  padding-top: 4px;\n}\n\n.cls-context-menu ul,\n#context-menu li {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  background: white;\n}\n\n.cls-context-menu {\n  border: 1px solid #888888 !important;\n}\n.cls-context-menu li {\n  border: 1px solid #888888;\n}\n.cls-context-menu li:last-child {\n  border: none;\n}\n.cls-context-menu li a {\n  display: block;\n  padding: 5px 10px;\n  text-decoration: none;\n  color: blue;\n}\n.cls-context-menu li a:hover {\n  background: blue;\n  color: #fff;\n}\n\n/* Input Range */\n:root {\n  --shadow-len: -60px;\n}\ninput[type="range"] {\n  margin: auto;\n  -webkit-appearance: none;\n  position: relative;\n  overflow: hidden;\n  height: 25px;\n  cursor: pointer;\n  border-radius: 0; /* iOS */\n}\n\n::-webkit-slider-runnable-track {\n  background: #ddd;\n}\n\n/*\n     * 1. Set to 0 width and remove border for a slider without a thumb\n     * 2. Shadow is negative the full width of the input and has a spread\n     *    of the width of the input.\n     */\n::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 20px; /* 1 */\n  height: 25px;\n  background: #fff;\n  box-shadow: -200px 0 0 200px #0066cc; /* 2 */\n  border: 2px solid #888888; /* 1 */\n  clip-path: inset(0px 0px 0px let(--shadow-len));\n}\n\n::-moz-range-track {\n  height: 25px;\n  background: #888888;\n}\n\n::-moz-range-thumb {\n  background: #fff;\n  height: 25px;\n  width: 20px;\n  border: 3px solid #888888;\n  border-radius: 0 !important;\n  box-shadow: -200px 0 0 200px #0066cc;\n  box-sizing: border-box;\n  clip-path: inset(0px 0px 0px let(--shadow-len));\n}\n\n::-ms-fill-lower {\n  background: #0066cc;\n}\n\n::-ms-thumb {\n  background: #fff;\n  border: 3px solid #999;\n  height: 25px;\n  width: 20px;\n  box-sizing: border-box;\n}\n\n::-ms-ticks-after {\n  display: none;\n}\n\n::-ms-ticks-before {\n  display: none;\n}\n\n::-ms-track {\n  background: #888888;\n  color: transparent;\n  height: 25px;\n  border: none;\n}\n\n::-ms-tooltip {\n  display: none;\n}\n\n.theme-radio-btn {\n  height: 14px;\n  width: 14px;\n}\n\n.theme-radio-btn:hover {\n  cursor: pointer;\n}\n\n#shuffle-button {\n  font-family: "Nova Square", cursive;\n  line-height: 25px;\n}\n\n.shuffle-button-enabled {\n  color: white;\n  background: #0066cc;\n  border: 2px solid #0066cc;\n}\n\n.shuffle-button-enabled:hover {\n  cursor: pointer;\n}\n\n.shuffle-button-enabled:active {\n  color: black;\n  background: white;\n  border: 2px solid #888888;\n}\n\n.shuffle-button-disabled {\n  color: white;\n  background: #888888;\n  border: 2px solid #888888;\n}\n\n.blob {\n  animation: shine 1.5s ease-in-out infinite;\n  animation-fill-mode: forwards;\n  animation-direction: alternate;\n}\n\n#version-link {\n  color: #0066cc;\n  font-weight: bold;\n  text-decoration: underline;\n}\n',
        "",
      ]);
      const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
    },
    314: (module) => {
      module.exports = function (cssWithMappingToString) {
        var list = [];
        return (
          (list.toString = function () {
            return this.map(function (item) {
              var content = "",
                needLayer = void 0 !== item[5];
              return (
                item[4] && (content += "@supports (".concat(item[4], ") {")),
                item[2] && (content += "@media ".concat(item[2], " {")),
                needLayer &&
                  (content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {")),
                (content += cssWithMappingToString(item)),
                needLayer && (content += "}"),
                item[2] && (content += "}"),
                item[4] && (content += "}"),
                content
              );
            }).join("");
          }),
          (list.i = function (modules, media, dedupe, supports, layer) {
            "string" == typeof modules && (modules = [[null, modules, void 0]]);
            var alreadyImportedModules = {};
            if (dedupe)
              for (var k = 0; k < this.length; k++) {
                var id = this[k][0];
                null != id && (alreadyImportedModules[id] = !0);
              }
            for (var _k = 0; _k < modules.length; _k++) {
              var item = [].concat(modules[_k]);
              (dedupe && alreadyImportedModules[item[0]]) ||
                (void 0 !== layer &&
                  (void 0 === item[5] ||
                    (item[1] = "@layer"
                      .concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {")
                      .concat(item[1], "}")),
                  (item[5] = layer)),
                media &&
                  (item[2]
                    ? ((item[1] = "@media ".concat(item[2], " {").concat(item[1], "}")),
                      (item[2] = media))
                    : (item[2] = media)),
                supports &&
                  (item[4]
                    ? ((item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}")),
                      (item[4] = supports))
                    : (item[4] = "".concat(supports))),
                list.push(item));
            }
          }),
          list
        );
      };
    },
    601: (module) => {
      module.exports = function (i) {
        return i[1];
      };
    },
    72: (module) => {
      var stylesInDOM = [];
      function getIndexByIdentifier(identifier) {
        for (var result = -1, i = 0; i < stylesInDOM.length; i++)
          if (stylesInDOM[i].identifier === identifier) {
            result = i;
            break;
          }
        return result;
      }
      function modulesToDom(list, options) {
        for (var idCountMap = {}, identifiers = [], i = 0; i < list.length; i++) {
          var item = list[i],
            id = options.base ? item[0] + options.base : item[0],
            count = idCountMap[id] || 0,
            identifier = "".concat(id, " ").concat(count);
          idCountMap[id] = count + 1;
          var indexByIdentifier = getIndexByIdentifier(identifier),
            obj = {
              css: item[1],
              media: item[2],
              sourceMap: item[3],
              supports: item[4],
              layer: item[5],
            };
          if (-1 !== indexByIdentifier)
            stylesInDOM[indexByIdentifier].references++,
              stylesInDOM[indexByIdentifier].updater(obj);
          else {
            var updater = addElementStyle(obj, options);
            (options.byIndex = i), stylesInDOM.splice(i, 0, { identifier, updater, references: 1 });
          }
          identifiers.push(identifier);
        }
        return identifiers;
      }
      function addElementStyle(obj, options) {
        var api = options.domAPI(options);
        api.update(obj);
        return function (newObj) {
          if (newObj) {
            if (
              newObj.css === obj.css &&
              newObj.media === obj.media &&
              newObj.sourceMap === obj.sourceMap &&
              newObj.supports === obj.supports &&
              newObj.layer === obj.layer
            )
              return;
            api.update((obj = newObj));
          } else api.remove();
        };
      }
      module.exports = function (list, options) {
        var lastIdentifiers = modulesToDom((list = list || []), (options = options || {}));
        return function (newList) {
          newList = newList || [];
          for (var i = 0; i < lastIdentifiers.length; i++) {
            var index = getIndexByIdentifier(lastIdentifiers[i]);
            stylesInDOM[index].references--;
          }
          for (
            var newLastIdentifiers = modulesToDom(newList, options), _i = 0;
            _i < lastIdentifiers.length;
            _i++
          ) {
            var _index = getIndexByIdentifier(lastIdentifiers[_i]);
            0 === stylesInDOM[_index].references &&
              (stylesInDOM[_index].updater(), stylesInDOM.splice(_index, 1));
          }
          lastIdentifiers = newLastIdentifiers;
        };
      };
    },
    659: (module) => {
      var memo = {};
      module.exports = function (insert, style) {
        var target = (function (target) {
          if (void 0 === memo[target]) {
            var styleTarget = document.querySelector(target);
            if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement)
              try {
                styleTarget = styleTarget.contentDocument.head;
              } catch (e) {
                styleTarget = null;
              }
            memo[target] = styleTarget;
          }
          return memo[target];
        })(insert);
        if (!target)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
          );
        target.appendChild(style);
      };
    },
    540: (module) => {
      module.exports = function (options) {
        var element = document.createElement("style");
        return (
          options.setAttributes(element, options.attributes),
          options.insert(element, options.options),
          element
        );
      };
    },
    56: (module, __unused_webpack_exports, __webpack_require__) => {
      module.exports = function (styleElement) {
        var nonce = __webpack_require__.nc;
        nonce && styleElement.setAttribute("nonce", nonce);
      };
    },
    825: (module) => {
      module.exports = function (options) {
        if ("undefined" == typeof document)
          return { update: function () {}, remove: function () {} };
        var styleElement = options.insertStyleElement(options);
        return {
          update: function (obj) {
            !(function (styleElement, options, obj) {
              var css = "";
              obj.supports && (css += "@supports (".concat(obj.supports, ") {")),
                obj.media && (css += "@media ".concat(obj.media, " {"));
              var needLayer = void 0 !== obj.layer;
              needLayer &&
                (css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {")),
                (css += obj.css),
                needLayer && (css += "}"),
                obj.media && (css += "}"),
                obj.supports && (css += "}");
              var sourceMap = obj.sourceMap;
              sourceMap &&
                "undefined" != typeof btoa &&
                (css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(
                  btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))),
                  " */",
                )),
                options.styleTagTransform(css, styleElement, options.options);
            })(styleElement, options, obj);
          },
          remove: function () {
            !(function (styleElement) {
              if (null === styleElement.parentNode) return !1;
              styleElement.parentNode.removeChild(styleElement);
            })(styleElement);
          },
        };
      };
    },
    113: (module) => {
      module.exports = function (css, styleElement) {
        if (styleElement.styleSheet) styleElement.styleSheet.cssText = css;
        else {
          for (; styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
          styleElement.appendChild(document.createTextNode(css));
        }
      };
    },
    373: (__unused_webpack_module, exports) => {
      exports.e = { musicPlayer: "3.0.0", highlightCoordinates: "1.0.2" };
    },
  },
  __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (void 0 !== cachedModule) return cachedModule.exports;
  var module = (__webpack_module_cache__[moduleId] = { id: moduleId, exports: {} });
  return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), module.exports;
}
(__webpack_require__.n = (module) => {
  var getter = module && module.__esModule ? () => module.default : () => module;
  return __webpack_require__.d(getter, { a: getter }), getter;
}),
  (__webpack_require__.d = (exports, definition) => {
    for (var key in definition)
      __webpack_require__.o(definition, key) &&
        !__webpack_require__.o(exports, key) &&
        Object.defineProperty(exports, key, { enumerable: !0, get: definition[key] });
  }),
  (__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)),
  (__webpack_require__.nc = void 0);
new Map();
const BLACK_HOLE_COs = new Set([
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
document.querySelector("#gamemap"),
  document.querySelector("#gamemap-container"),
  document.querySelector("#zoom-in"),
  document.querySelector("#zoom-out"),
  document.querySelector(".zoom-level"),
  document.querySelector("#cursor"),
  document.querySelector(".event-username"),
  document.querySelector(".supply-icon"),
  document.querySelector(".trapped-icon"),
  document.querySelector(".target-icon"),
  document.querySelector(".destroy-icon");
let replayOpenBtn = document.querySelector(".replay-open"),
  replayCloseBtn = document.querySelector(".replay-close"),
  replayForwardBtn = document.querySelector(".replay-forward"),
  replayForwardActionBtn = document.querySelector(".replay-forward-action"),
  replayBackwardBtn = document.querySelector(".replay-backward"),
  replayBackwardActionBtn = document.querySelector(".replay-backward-action"),
  replayDaySelectorCheckBox = document.querySelector(".replay-day-selector"),
  gameAnimations =
    ("undefined" != typeof maxX && maxX,
    "undefined" != typeof maxY && maxY,
    "undefined" != typeof gameAnims && gameAnims),
  siloDelayMS = gameAnimations ? 3e3 : 0,
  attackDelayMS = gameAnimations ? 1e3 : 0,
  isMapEditor = window.location.href.indexOf("editmap.php?") > -1,
  myName = document
    .querySelector("#profile-menu")
    .getElementsByClassName("dropdown-menu-link")[0]
    .href.split("username=")[1],
  menu = isMapEditor
    ? document.querySelector("#replay-misc-controls")
    : document.querySelector("#game-map-menu")?.parentNode,
  myID = null;
function getMyID() {
  return (
    null === myID &&
      getAllPlayersInfo().forEach((entry) => {
        entry.users_username === myName && (myID = entry.players_id);
      }),
    myID
  );
}
function getPlayerInfo(pid) {
  return playersInfo[pid];
}
function getAllPlayersInfo() {
  return Object.values(playersInfo);
}
function canPlayerActivateCOPower(pid) {
  let info = getPlayerInfo(pid);
  return info.players_co_power >= info.players_co_max_power;
}
function canPlayerActivateSuperCOPower(pid) {
  let info = getPlayerInfo(pid);
  return info.players_co_power >= info.players_co_max_spower;
}
function moveDivToOffset(div, dx, dy, steps, ...options) {
  if (steps <= 1) {
    if (options.length > 0) {
      let nextSet = options.shift().then;
      moveDivToOffset(div, nextSet[0], nextSet[1], nextSet[2], ...options);
    }
    return;
  }
  setTimeout(() => moveDivToOffset(div, dx, dy, steps - 1, ...options), 5);
  let left = parseFloat(div.style.left),
    top = parseFloat(div.style.top);
  (left += dx), (top += dy), (div.style.left = left + "px"), (div.style.top = top + "px");
}
const currentPlayer = {
  get info() {
    return getPlayerInfo(currentTurn);
  },
  get isPowerActivated() {
    return "N" !== this.coPowerState;
  },
  get coPowerState() {
    return this.info.players_co_power_on;
  },
  get coName() {
    return this.info.co_name;
  },
};
function getAllCONames() {
  return getAllPlayersInfo().map((info) => info.co_name);
}
function isBlackHoleCO(coName) {
  return BLACK_HOLE_COs.has(coName.toLowerCase());
}
function getUnitInfo(unitId) {
  return unitsInfo[unitId];
}
function getUnitName(unitId) {
  return getUnitInfo(unitId)?.units_name;
}
function isValidUnit(unitId) {
  return void 0 !== unitId && void 0 !== unitsInfo[unitId];
}
const SettingsGameType = Object.freeze({
    AW1: "AW1",
    AW2: "AW2",
    AW_RBC: "AW_RBC",
    AW_DS: "AW_DS",
  }),
  SettingsThemeType = Object.freeze({
    REGULAR: "REGULAR",
    CO_POWER: "CO_POWER",
    SUPER_CO_POWER: "SUPER_CO_POWER",
  });
const onSettingsChangeListeners = [];
function addSettingsChangeListener(fn) {
  onSettingsChangeListeners.push(fn);
}
const musicPlayerSettings = {
  __isPlaying: !1,
  __volume: 0.5,
  __sfxVolume: 0.35,
  __uiVolume: 0.425,
  __gameType: SettingsGameType.AW_DS,
  set isPlaying(val) {
    (this.__isPlaying = val), this.onSettingChangeEvent("isPlaying");
  },
  get isPlaying() {
    return this.__isPlaying;
  },
  set volume(val) {
    (this.__volume = val), this.onSettingChangeEvent("volume");
  },
  get volume() {
    return this.__volume;
  },
  set sfxVolume(val) {
    (this.__sfxVolume = val), this.onSettingChangeEvent("sfxVolume");
  },
  get sfxVolume() {
    return this.__sfxVolume;
  },
  set uiVolume(val) {
    (this.__uiVolume = val), this.onSettingChangeEvent("uiVolume");
  },
  get uiVolume() {
    return this.__uiVolume;
  },
  set gameType(val) {
    (this.__gameType = val), this.onSettingChangeEvent("gameType");
  },
  get gameType() {
    return this.__gameType;
  },
  onSettingChangeEvent(key) {
    onSettingsChangeListeners.forEach((fn) => fn(key));
  },
};
function updateSettingsInLocalStorage() {
  let jsonSettings = JSON.stringify(musicPlayerSettings);
  localStorage.setItem("musicPlayerSettings", jsonSettings);
}
const BASE_URL = "https://developerjose.netlify.app",
  BASE_MUSIC_URL = BASE_URL + "/music",
  BASE_SFX_URL = BASE_MUSIC_URL + "/sfx",
  NEUTRAL_IMG_URL = BASE_URL + "/img/music-player-icon.png",
  PLAYING_IMG_URL = BASE_URL + "/img/music-player-playing.gif",
  GameSFX = {
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
  },
  MovementSFX = {
    moveBCopterLoop: BASE_SFX_URL + "/move_bcopter.ogg",
    moveBCopterOneShot: BASE_SFX_URL + "/move_bcopter_rolloff.ogg",
    moveInfLoop: BASE_SFX_URL + "/move_inf.ogg",
    moveMechLoop: BASE_SFX_URL + "/move_mech.ogg",
    moveNavalLoop: BASE_SFX_URL + "/move_naval.ogg",
    movePiperunnerLoop: BASE_SFX_URL + "/move_piperunner.ogg",
    movePlaneLoop: BASE_SFX_URL + "/move_plane.ogg",
    movePlaneOneShot: BASE_SFX_URL + "/move_plane_rolloff.ogg",
    moveSubLoop: BASE_SFX_URL + "/move_sub.ogg",
    moveTCopterLoop: BASE_SFX_URL + "/move_tcopter.ogg",
    moveTCopterOneShot: BASE_SFX_URL + "/move_tcopter_rolloff.ogg",
    moveTiresHeavyLoop: BASE_SFX_URL + "/move_tires_heavy.ogg",
    moveTiresHeavyOneShot: BASE_SFX_URL + "/move_tires_heavy_rolloff.ogg",
    moveTiresLightLoop: BASE_SFX_URL + "/move_tires_light.ogg",
    moveTiresLightOneShot: BASE_SFX_URL + "/move_tires_light_rolloff.ogg",
    moveTreadHeavyLoop: BASE_SFX_URL + "/move_tread_heavy.ogg",
    moveTreadHeavyOneShot: BASE_SFX_URL + "/move_tread_heavy_rolloff.ogg",
    moveTreadLightLoop: BASE_SFX_URL + "/move_tread_light.ogg",
    moveTreadLightOneShot: BASE_SFX_URL + "/move_tread_light_rolloff.ogg",
  },
  onMovementStartMap = new Map([
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
  ]),
  onMovmentRolloffMap = new Map([
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
function getMusicURL(coName, gameType = null, themeType = null) {
  null === gameType && (gameType = musicPlayerSettings.gameType),
    null === themeType &&
      (themeType = (function () {
        let currentPowerState = currentPlayer.coPowerState;
        return "Y" === currentPowerState
          ? SettingsThemeType.CO_POWER
          : "S" === currentPowerState
            ? SettingsThemeType.SUPER_CO_POWER
            : SettingsThemeType.REGULAR;
      })());
  let gameDir = gameType,
    filename = (function (coName, gameType, themeType) {
      return themeType !== SettingsThemeType.REGULAR
        ? gameType === SettingsGameType.AW_RBC
          ? `t-${coName}-cop`
          : `t-${isBlackHoleCO(coName) ? "bh" : "ally"}-${themeType}`
        : `t-${coName}`;
    })(coName, gameType, themeType);
  return `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`.toLowerCase().replaceAll("_", "-");
}
function getSoundEffectURL(sfx) {
  return `${BASE_SFX_URL}/${sfx}.ogg`;
}
var config = __webpack_require__(373);
let isSettingsMenuOpen = !1;
function addSettingsMenuToMusicPlayer(musicPlayerDiv) {
  musicPlayerDiv.appendChild(contextMenu),
    (musicPlayerDiv.oncontextmenu = function (e) {
      e.target.id.startsWith("music-player") &&
        (e.preventDefault(),
        (isSettingsMenuOpen = !isSettingsMenuOpen),
        isSettingsMenuOpen ? (contextMenu.style.display = "block") : closeSettingsMenu());
    }),
    document.addEventListener("click", (event) => {
      event.target.id.startsWith("music-player-") || closeSettingsMenu();
    });
}
function closeSettingsMenu() {
  contextMenu.style.display = "none";
}
addSettingsChangeListener(function (_key) {
  (volumeSlider.value = musicPlayerSettings.volume),
    (sfxVolumeSlider.value = musicPlayerSettings.sfxVolume),
    (uiVolumeSlider.value = musicPlayerSettings.uiVolume),
    (gameTypeSelectorSpan.value = musicPlayerSettings.gameType);
});
let contextMenu = document.createElement("div");
(contextMenu.id = "music-player-context-menu"),
  contextMenu.classList.add("cls-context-menu"),
  (contextMenu.style.position = "absolute"),
  (contextMenu.style.height = "76px"),
  (contextMenu.style.paddingTop = "0px"),
  (contextMenu.style.paddingBottom = isMapEditor ? "0px" : "4px"),
  (contextMenu.style.height = "347px"),
  (contextMenu.style.width = "175px"),
  (contextMenu.style.top = "37px");
const volumeSlider = document.createElement("input");
(volumeSlider.id = "music-player-vol-slider"),
  (volumeSlider.type = "range"),
  (volumeSlider.max = "1"),
  (volumeSlider.min = "0"),
  (volumeSlider.step = "0.01"),
  (volumeSlider.value = musicPlayerSettings.volume),
  volumeSlider.addEventListener("input", (val) => {
    musicPlayerSettings.volume = val.target.value;
  });
let volumeSliderFlexContainer = document.createElement("div");
(volumeSliderFlexContainer.id = "music-player-vol-slider-flex-container"),
  (volumeSliderFlexContainer.style.display = "flex"),
  (volumeSliderFlexContainer.style.flexDirection = "row"),
  (volumeSliderFlexContainer.style.marginBottom = "3.5px"),
  (volumeSliderFlexContainer.style.alignItems = "center"),
  (volumeSliderFlexContainer.style.backgroundColor = "#F0F0F0");
let volumeSliderSpanDiv = document.createElement("div");
(volumeSliderSpanDiv.id = "music-player-vol-slider-div"),
  (volumeSliderSpanDiv.style.display = "inline-block"),
  (volumeSliderSpanDiv.style.width = "100%"),
  (volumeSliderSpanDiv.style.textAlign = "center");
let volumeSliderSpan = document.createElement("span");
(volumeSliderSpan.id = "music-player-vol-slider-desc"),
  (volumeSliderSpan.textContent = "Music Volume"),
  (volumeSliderSpan.style.fontSize = "13px"),
  volumeSliderFlexContainer.appendChild(volumeSliderSpanDiv),
  volumeSliderSpanDiv.appendChild(volumeSliderSpan),
  contextMenu.appendChild(volumeSliderFlexContainer),
  contextMenu.appendChild(volumeSlider);
const sfxVolumeSlider = document.createElement("input");
(sfxVolumeSlider.id = "music-player-vol-sfx-slider"),
  (sfxVolumeSlider.type = "range"),
  (sfxVolumeSlider.max = "1"),
  (sfxVolumeSlider.min = "0"),
  (sfxVolumeSlider.step = "0.01"),
  (sfxVolumeSlider.value = musicPlayerSettings.sfxVolume),
  sfxVolumeSlider.addEventListener("input", (val) => {
    musicPlayerSettings.sfxVolume = val.target.value;
  });
let sfxVolumeSliderFlexContainer = document.createElement("div");
(sfxVolumeSliderFlexContainer.id = "music-player-vol-sfx-slider-flex-container"),
  (sfxVolumeSliderFlexContainer.style.display = "flex"),
  (sfxVolumeSliderFlexContainer.style.flexDirection = "row"),
  (sfxVolumeSliderFlexContainer.style.marginBottom = "3.5px"),
  (sfxVolumeSliderFlexContainer.style.marginTop = "3.5px"),
  (sfxVolumeSliderFlexContainer.style.alignItems = "center");
let sfxVolumeSliderSpanDiv = document.createElement("div");
(sfxVolumeSliderSpanDiv.id = "music-player-vol-sfx-slider-div"),
  (sfxVolumeSliderSpanDiv.style.display = "inline-block"),
  (sfxVolumeSliderSpanDiv.style.width = "100%"),
  (sfxVolumeSliderSpanDiv.style.textAlign = "center");
let sfxVolumeSliderSpan = document.createElement("span");
(sfxVolumeSliderSpan.id = "music-player-vol-sfx-slider-desc"),
  (sfxVolumeSliderSpan.textContent = "SFX Volume"),
  (sfxVolumeSliderSpan.style.fontSize = "13px"),
  sfxVolumeSliderFlexContainer.appendChild(sfxVolumeSliderSpanDiv),
  sfxVolumeSliderSpanDiv.appendChild(sfxVolumeSliderSpan),
  contextMenu.appendChild(sfxVolumeSliderFlexContainer),
  contextMenu.appendChild(sfxVolumeSlider);
const uiVolumeSlider = document.createElement("input");
(uiVolumeSlider.id = "music-player-vol-ui-slider"),
  (uiVolumeSlider.type = "range"),
  (uiVolumeSlider.max = "1"),
  (uiVolumeSlider.min = "0"),
  (uiVolumeSlider.step = "0.01"),
  (uiVolumeSlider.value = musicPlayerSettings.uiVolume),
  uiVolumeSlider.addEventListener("input", (val) => {
    musicPlayerSettings.uiVolume = val.target.value;
  });
let uiVolumeSliderFlexContainer = document.createElement("div");
(uiVolumeSliderFlexContainer.id = "music-player-vol-ui-slider-flex-container"),
  (uiVolumeSliderFlexContainer.style.display = "flex"),
  (uiVolumeSliderFlexContainer.style.flexDirection = "row"),
  (uiVolumeSliderFlexContainer.style.marginBottom = "3.5px"),
  (uiVolumeSliderFlexContainer.style.marginTop = "3.5px"),
  (uiVolumeSliderFlexContainer.style.alignItems = "center");
let uiVolumeSliderSpanDiv = document.createElement("div");
(uiVolumeSliderSpanDiv.id = "music-player-vol-ui-slider-div"),
  (uiVolumeSliderSpanDiv.style.display = "inline-block"),
  (uiVolumeSliderSpanDiv.style.width = "100%"),
  (uiVolumeSliderSpanDiv.style.textAlign = "center");
let uiVolumeSliderSpan = document.createElement("span");
(uiVolumeSliderSpan.id = "music-player-vol-ui-slider-desc"),
  (uiVolumeSliderSpan.textContent = "Interface Volume"),
  (uiVolumeSliderSpan.style.fontSize = "13px"),
  uiVolumeSliderFlexContainer.appendChild(uiVolumeSliderSpanDiv),
  uiVolumeSliderSpanDiv.appendChild(uiVolumeSliderSpan),
  contextMenu.appendChild(uiVolumeSliderFlexContainer),
  contextMenu.appendChild(uiVolumeSlider);
let themeFlexContainer = document.createElement("div");
(themeFlexContainer.id = "music-player-theme-slider-flex-container"),
  (themeFlexContainer.style.display = "flex"),
  (themeFlexContainer.style.flexDirection = "row"),
  (themeFlexContainer.style.marginTop = "5.5px"),
  (themeFlexContainer.style.alignItems = "center"),
  (themeFlexContainer.style.backgroundColor = "#F0F0F0"),
  contextMenu.appendChild(themeFlexContainer);
let themeSpanDiv = document.createElement("div");
(themeSpanDiv.id = "music-player-theme-slider-div"),
  (themeSpanDiv.style.display = "inline-block"),
  (themeSpanDiv.style.width = "100%"),
  (themeSpanDiv.style.textAlign = "center"),
  themeFlexContainer.appendChild(themeSpanDiv);
let themeSpan = document.createElement("span");
(themeSpan.id = "music-player-theme-slider-desc"),
  (themeSpan.textContent = "Game Soundtrack"),
  (themeSpan.style.fontSize = "13px"),
  themeSpanDiv.appendChild(themeSpan);
let themeSliderFlexContainer = document.createElement("div");
(themeSliderFlexContainer.id = "music-player-classic-slider-flex-container"),
  (themeSliderFlexContainer.style.display = "flex"),
  (themeSliderFlexContainer.style.flexDirection = "row"),
  (themeSliderFlexContainer.style.marginTop = "5.5px"),
  (themeSliderFlexContainer.style.alignItems = "center"),
  (themeSliderFlexContainer.style.justifyContent = "space-around"),
  contextMenu.appendChild(themeSliderFlexContainer);
let gameTypeSelectorSpan = document.createElement("select");
(gameTypeSelectorSpan.id = "music-player-game-type-selector"),
  (gameTypeSelectorSpan.value = musicPlayerSettings.gameType),
  gameTypeSelectorSpan.addEventListener("change", () => {
    let newGameType = gameTypeSelectorSpan.value;
    musicPlayerSettings.gameType = newGameType;
  });
for (let key in SettingsGameType) {
  let gameTypeOption = document.createElement("option");
  gameTypeOption.id = "music-player-game-type-option-" + key;
  let gameTypeOptionText = document.createTextNode(key);
  (gameTypeOptionText.id = "music-player-game-type-option-name-" + key),
    gameTypeOption.appendChild(gameTypeOptionText),
    gameTypeSelectorSpan.appendChild(gameTypeOption);
}
themeSliderFlexContainer.appendChild(gameTypeSelectorSpan);
let versionDiv = document.createElement("div");
(versionDiv.id = "music-player-version-number-div"),
  (versionDiv.style.width = "100%"),
  (versionDiv.style.marginTop = "5px"),
  (versionDiv.style.backgroundColor = "#F0F0F0");
let versionSpan = document.createElement("span");
(versionSpan.id = "music-player-version-number"),
  (versionSpan.textContent = "VERSION: " + config.e.musicPlayer),
  (versionSpan.style.fontSize = "9px"),
  (versionSpan.style.color = "#888888"),
  versionDiv.appendChild(versionSpan),
  contextMenu.appendChild(versionDiv);
const musicPlayerDiv = document.createElement("div");
(musicPlayerDiv.id = "music-player-parent"),
  musicPlayerDiv.classList.add("game-tools-btn"),
  musicPlayerDiv.classList.add("cls-context-menu-root"),
  (musicPlayerDiv.style.width = "34px"),
  (musicPlayerDiv.style.height = "30px"),
  (musicPlayerDiv.style.border = isMapEditor ? "none" : "1px solid #888888"),
  (musicPlayerDiv.style.borderLeft = isMapEditor ? "1px solid #888888" : "0px");
const musicPlayerDivHoverSpan = document.createElement("span");
(musicPlayerDivHoverSpan.id = "adji-hover-span"),
  musicPlayerDivHoverSpan.classList.add("game-tools-btn-text"),
  musicPlayerDivHoverSpan.classList.add("small_text"),
  musicPlayerDivHoverSpan.classList.add("cls-context-menu-root"),
  (musicPlayerDivHoverSpan.innerText = "Play Tunes");
const musicPlayerDivBackground = document.createElement("div");
(musicPlayerDivBackground.id = "music-player-background"),
  musicPlayerDivBackground.classList.add("game-tools-bg"),
  musicPlayerDivBackground.classList.add("cls-context-menu-root"),
  (musicPlayerDivBackground.style.backgroundImage =
    "linear-gradient(to right, #ffffff 0% , #888888 0%)");
const musicPlayerDivBackgroundSpan = document.createElement("span");
(musicPlayerDivBackgroundSpan.id = "music-player-background-span"),
  musicPlayerDivBackgroundSpan.classList.add("norm2"),
  musicPlayerDivBackgroundSpan.classList.add("cls-context-menu-root");
const musicPlayerDivBackgroundLink = document.createElement("a");
(musicPlayerDivBackgroundLink.id = "music-player-background-link"),
  musicPlayerDivBackgroundLink.classList.add("norm2"),
  musicPlayerDivBackgroundLink.classList.add("cls-context-menu-root");
const musicPlayerDivBackgroundImg = document.createElement("img");
(musicPlayerDivBackgroundImg.id = "music-player-background-link"),
  musicPlayerDivBackgroundImg.classList.add("cls-context-menu-root"),
  (musicPlayerDivBackgroundImg.src = NEUTRAL_IMG_URL),
  (musicPlayerDivBackgroundImg.style.verticalAlign = "middle"),
  (musicPlayerDivBackgroundImg.style.width = "17px"),
  (musicPlayerDivBackgroundImg.style.height = "17px"),
  musicPlayerDiv.appendChild(musicPlayerDivBackground),
  musicPlayerDiv.appendChild(musicPlayerDivHoverSpan),
  musicPlayerDivBackground.appendChild(musicPlayerDivBackgroundSpan),
  musicPlayerDivBackgroundSpan.appendChild(musicPlayerDivBackgroundLink),
  musicPlayerDivBackgroundLink.appendChild(musicPlayerDivBackgroundImg),
  addSettingsChangeListener(function (key) {
    "isPlaying" == key &&
      (musicPlayerSettings.isPlaying
        ? ((musicPlayerDivBackgroundImg.src = PLAYING_IMG_URL),
          (musicPlayerDivHoverSpan.innerText = "Stop Tunes"),
          (musicPlayerDivBackground.style.backgroundColor = "#e1e1e1"))
        : ((musicPlayerDivBackgroundImg.src = NEUTRAL_IMG_URL),
          (musicPlayerDivHoverSpan.innerText = "Play Tunes"),
          (musicPlayerDivBackground.style.backgroundColor = "#ffffff")));
  }),
  musicPlayerDivBackground.addEventListener("click", function (_e) {
    musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
  });
let currentThemeKey = "";
const urlAudioMap = new Map(),
  unitIDAudioMap = new Map();
let currentlyDelaying = !1,
  delayThemeMS = 0;
function playThemeSong() {
  if (!musicPlayerSettings.isPlaying) return;
  if (currentlyDelaying) return;
  if (delayThemeMS > 0)
    return (
      setTimeout(() => {
        (currentlyDelaying = !1), playThemeSong();
      }, delayThemeMS),
      (delayThemeMS = 0),
      void (currentlyDelaying = !0)
    );
  !(function (srcURL, loop = !0) {
    if (!musicPlayerSettings.isPlaying) return;
    let currentTheme = urlAudioMap.get(currentThemeKey);
    if (srcURL === currentThemeKey) return void (currentTheme.paused && currentTheme.play());
    stopThemeSong(),
      (currentThemeKey = srcURL),
      console.log("[AWBW Improved Music Player] Now Playing: " + srcURL),
      urlAudioMap.has(srcURL) || urlAudioMap.set(srcURL, new Audio(srcURL));
    (currentTheme = urlAudioMap.get(srcURL)),
      (currentTheme.volume = musicPlayerSettings.volume),
      (currentTheme.loop = loop),
      currentTheme.play();
  })(getMusicURL(isMapEditor ? "map-editor" : currentPlayer.coName), !0);
}
function stopThemeSong(delayMS = 0) {
  if (!musicPlayerSettings.isPlaying) return;
  if ((delayMS > 0 && (delayThemeMS = delayMS), !urlAudioMap.has(currentThemeKey))) return;
  let currentTheme = urlAudioMap.get(currentThemeKey);
  currentTheme.paused ||
    (currentTheme.readyState === HTMLAudioElement.HAVE_ENOUGH_DATA
      ? currentTheme.pause()
      : currentTheme.addEventListener("play", (event) => event.target.pause(), { once: !0 }));
}
function playMovementSound(unitId) {
  if (!musicPlayerSettings.isPlaying) return;
  if (!unitIDAudioMap.has(unitId)) {
    let movementSoundURL = (function (unitName) {
      return onMovementStartMap.get(unitName);
    })(getUnitName(unitId));
    unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
  }
  let movementAudio = unitIDAudioMap.get(unitId);
  (movementAudio.currentTime = 0),
    (movementAudio.loop = !1),
    (movementAudio.volume = musicPlayerSettings.sfxVolume),
    movementAudio.play();
}
function stopMovementSound(unitId, rolloff = !0) {
  if (!musicPlayerSettings.isPlaying) return;
  if (!unitIDAudioMap.has(unitId)) return;
  let movementAudio = unitIDAudioMap.get(unitId);
  if (movementAudio.paused) return;
  if (movementAudio.readyState != HTMLAudioElement.HAVE_ENOUGH_DATA)
    return void movementAudio.addEventListener("play", (event) => event.target.pause(), {
      once: !0,
    });
  if ((movementAudio.pause(), (movementAudio.currentTime = 0), !rolloff)) return;
  let unitName = getUnitName(unitId);
  if (
    (function (unitName) {
      return onMovmentRolloffMap.has(unitName);
    })(unitName)
  ) {
    let audioURL = (function (unitName) {
      return onMovmentRolloffMap.get(unitName);
    })(unitName);
    !(function (srcURL, volume) {
      if (!musicPlayerSettings.isPlaying) return;
      let soundInstance = new Audio(srcURL);
      (soundInstance.currentTime = 0), (soundInstance.volume = volume), soundInstance.play();
    })(audioURL, musicPlayerSettings.sfxVolume);
  }
}
function playSFX(sfx) {
  if (!musicPlayerSettings.isPlaying) return;
  let sfxURL = getSoundEffectURL(sfx),
    vol = musicPlayerSettings.sfxVolume;
  sfx.startsWith("sfx-ui") && (vol = musicPlayerSettings.uiVolume),
    urlAudioMap.has(sfxURL) || urlAudioMap.set(sfxURL, new Audio(sfxURL));
  let audio = urlAudioMap.get(sfxURL);
  (audio.volume = vol), (audio.currentTime = 0), audio.play();
}
function preloadExtraAudio(afterPreloadFunction) {
  if (isMapEditor) return;
  let audioList = (function () {
      let sfx = Object.values(GameSFX).map(getSoundEffectURL),
        moreSFX = Object.values(MovementSFX);
      return sfx.concat(moreSFX);
    })(),
    coNames = getAllCONames();
  for (let gameType in SettingsGameType)
    for (let themeType in SettingsThemeType) {
      let gameList = coNames.map((name) => getMusicURL(name, gameType, themeType));
      audioList = audioList.concat(gameList);
    }
  preloadList(audioList, afterPreloadFunction);
}
function preloadList(audioList, afterPreloadFunction) {
  audioList = new Set(audioList);
  let numLoadedAudios = 0,
    onLoadAudio = (event) => {
      numLoadedAudios++;
      let loadPercentage = (numLoadedAudios / audioList.size) * 100;
      var percentage;
      (percentage = loadPercentage),
        (musicPlayerDivBackground.style.backgroundImage =
          "linear-gradient(to right, #ffffff " + String(percentage) + "% , #888888 0%)"),
        "error" !== event.type && urlAudioMap.set(event.target.src, event.target),
        numLoadedAudios >= audioList.size && afterPreloadFunction && afterPreloadFunction();
    },
    onLoadAudioError = (event) => {
      onLoadAudio(event);
    };
  audioList.forEach((url) => {
    if (urlAudioMap.has(url)) return void numLoadedAudios++;
    let audio = new Audio(url);
    audio.addEventListener("loadedmetadata", onLoadAudio, !1),
      audio.addEventListener("error", onLoadAudioError, !1);
  });
}
addSettingsChangeListener(function (key) {
  switch (key) {
    case "isPlaying":
      musicPlayerSettings.isPlaying
        ? playThemeSong()
        : (function () {
            stopThemeSong();
            for (let unitId in Object.keys(unitIDAudioMap)) stopMovementSound(unitId, !1);
            for (let sfxURL in Object.keys(urlAudioMap)) sfxURL.volume = 0;
          })();
      break;
    case "gameType":
      playThemeSong();
      break;
    case "volume": {
      let currentTheme = urlAudioMap.get(currentThemeKey);
      currentTheme && (currentTheme.volume = musicPlayerSettings.volume);
      break;
    }
  }
});
let lastCursorCall = Date.now();
const MenuClickType_None = "None",
  MenuClickType_Unit = "Unit",
  MenuClickType_MenuItem = "MenuItem";
let menuItemClick = MenuClickType_None,
  menuOpen = !1,
  visibilityMap = new Map(),
  movementResponseMap = new Map();
var injectStylesIntoStyleTag = __webpack_require__(72),
  injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag),
  styleDomAPI = __webpack_require__(825),
  styleDomAPI_default = __webpack_require__.n(styleDomAPI),
  insertBySelector = __webpack_require__(659),
  insertBySelector_default = __webpack_require__.n(insertBySelector),
  setAttributesWithoutAttributes = __webpack_require__(56),
  setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes),
  insertStyleElement = __webpack_require__(540),
  insertStyleElement_default = __webpack_require__.n(insertStyleElement),
  styleTagTransform = __webpack_require__(113),
  styleTagTransform_default = __webpack_require__.n(styleTagTransform),
  style = __webpack_require__(343),
  options = {};
(options.styleTagTransform = styleTagTransform_default()),
  (options.setAttributes = setAttributesWithoutAttributes_default()),
  (options.insert = insertBySelector_default().bind(null, "head")),
  (options.domAPI = styleDomAPI_default()),
  (options.insertStyleElement = insertStyleElement_default());
injectStylesIntoStyleTag_default()(style.A, options);
style.A && style.A.locals && style.A.locals;
addSettingsMenuToMusicPlayer(musicPlayerDiv),
  menu.appendChild(musicPlayerDiv),
  (function () {
    let refreshMusic = () => {
      setTimeout(playThemeSong, 500), visibilityMap.clear();
    };
    replayForwardBtn.addEventListener("click", refreshMusic),
      replayForwardActionBtn.addEventListener("click", refreshMusic),
      replayBackwardBtn.addEventListener("click", refreshMusic),
      replayBackwardActionBtn.addEventListener("click", refreshMusic),
      replayOpenBtn.addEventListener("click", refreshMusic),
      replayCloseBtn.addEventListener("click", refreshMusic),
      replayDaySelectorCheckBox.addEventListener("click", refreshMusic);
    let ahOpenMenu = openMenu,
      ahCursorMove = updateCursor,
      ahCloseMenu = closeMenu,
      ahUnitClick = unitClickHandler,
      ahWait = waitUnit,
      ahAnimUnit = animUnit,
      ahExplodeAnim = animExplosion,
      ahFog = updateAirUnitFogOnMove,
      ahFire = actionHandlers.Fire,
      ahAttackSeam = actionHandlers.AttackSeam,
      ahMove = actionHandlers.Move,
      ahCapt = actionHandlers.Capt,
      ahBuild = actionHandlers.Build,
      ahLoad = actionHandlers.Load,
      ahUnload = actionHandlers.Unload,
      ahSupply = actionHandlers.Supply,
      ahRepair = actionHandlers.Repair,
      ahHide = actionHandlers.Hide,
      ahUnhide = actionHandlers.Unhide,
      ahJoin = actionHandlers.Join,
      ahLaunch = actionHandlers.Launch,
      ahNextTurn = actionHandlers.NextTurn,
      ahElimination = actionHandlers.Elimination,
      ahPower = actionHandlers.Power,
      ahGameOver = actionHandlers.GameOver;
    (updateCursor = (cursorX, cursorY) => {
      ahCursorMove.apply(updateCursor, [cursorX, cursorY]),
        musicPlayerSettings.isPlaying &&
          (Date.now() - lastCursorCall > 25 && playSFX(GameSFX.uiCursorMove),
          (lastCursorCall = Date.now()));
    }),
      (openMenu = (menu, x, y) => {
        if ((ahOpenMenu.apply(openMenu, [menu, x, y]), !musicPlayerSettings.isPlaying)) return;
        let menuOptions = document.getElementsByClassName("menu-option");
        console.log("Open menu", menuOptions[0]);
        for (var i = 0; i < menuOptions.length; i++)
          menuOptions[i].addEventListener("mouseenter", (_event) => {
            console.log("Listener", _event), playSFX(GameSFX.uiMenuMove);
          }),
            menuOptions[i].addEventListener(
              "click",
              (_event) => (menuItemClick = MenuClickType_MenuItem),
            );
        (menuOpen = !0), playSFX(GameSFX.uiMenuOpen);
      }),
      (closeMenu = () => {
        ahCloseMenu.apply(closeMenu, []),
          console.log("CloseMenu", menuOpen, menuItemClick),
          musicPlayerSettings.isPlaying &&
            (menuOpen && !menuItemClick
              ? playSFX(GameSFX.uiMenuClose)
              : menuOpen && menuItemClick
                ? playSFX(GameSFX.uiMenuOpen)
                : menuItemClick && playSFX(GameSFX.uiMenuClose),
            (menuOpen = !1),
            (menuItemClick = MenuClickType_None));
      }),
      (unitClickHandler = (clicked) => {
        ahUnitClick.apply(unitClickHandler, [clicked]),
          musicPlayerSettings.isPlaying &&
            ((menuItemClick = MenuClickType_Unit), playSFX(GameSFX.uiUnitSelect));
      }),
      (waitUnit = (unitId) => {
        if (
          (ahWait.apply(waitUnit, [unitId]),
          musicPlayerSettings.isPlaying &&
            (stopMovementSound(unitId), movementResponseMap.has(unitId)))
        ) {
          movementResponseMap.get(unitId).trapped && playSFX(GameSFX.actionUnitTrap),
            movementResponseMap.delete(unitId);
        }
      }),
      (animUnit = (path, unitId, unitSpan, unitTeam, viewerTeam, i) => {
        if (
          (ahAnimUnit.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]),
          !musicPlayerSettings.isPlaying)
        )
          return;
        if (!isValidUnit(unitId) || !path || !i) return;
        if (i >= path.length) return;
        if (visibilityMap.has(unitId)) return;
        let unitVisible = path[i].unit_visible;
        unitVisible ||
          (visibilityMap.set(unitId, unitVisible),
          setTimeout(() => stopMovementSound(unitId, !1), 1e3));
      }),
      (animExplosion = (unit) => {
        if ((ahExplodeAnim.apply(animExplosion, [unit]), !musicPlayerSettings.isPlaying)) return;
        let unitId = unit.units_id,
          unitFuel = unit.units_fuel,
          sfx = GameSFX.actionUnitExplode;
        "Black Bomb" === getUnitName(unitId) && unitFuel > 0 && (sfx = GameSFX.actionMissileHit),
          playSFX(sfx),
          stopMovementSound(unitId, !1);
      }),
      (updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change, delay) => {
        if (
          (ahFog.apply(updateAirUnitFogOnMove, [
            x,
            y,
            mType,
            neighbours,
            unitVisible,
            change,
            delay,
          ]),
          !musicPlayerSettings.isPlaying)
        )
          return;
        let unitInfo = (function (x, y) {
          return Object.values(unitsInfo)
            .filter((info) => info.units_x == x && info.units_y == y)
            .pop();
        })(x, y);
        "Add" === change && setTimeout(() => stopMovementSound(unitInfo.units_id, !1), delay);
      }),
      (actionHandlers.Fire = (fireResponse) => {
        if (!musicPlayerSettings.isPlaying)
          return void ahFire.apply(actionHandlers.Fire, [fireResponse]);
        let attackerID = fireResponse.copValues.attacker.playerId,
          defenderID = fireResponse.copValues.defender.playerId,
          couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID),
          couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID),
          couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID),
          couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);
        ahFire.apply(actionHandlers.Fire, [fireResponse]),
          setTimeout(
            () => {
              let canAttackerActivateSCOPAfter = canPlayerActivateSuperCOPower(attackerID),
                canAttackerActivateCOPAfter = canPlayerActivateCOPower(attackerID),
                canDefenderActivateSCOPAfter = canPlayerActivateSuperCOPower(defenderID),
                canDefenderActivateCOPAfter = canPlayerActivateCOPower(defenderID),
                madeCOPAvailable =
                  (!couldAttackerActivateCOPBefore && canAttackerActivateCOPAfter) ||
                  (!couldDefenderActivateCOPBefore && canDefenderActivateCOPAfter);
              (!couldAttackerActivateSCOPBefore && canAttackerActivateSCOPAfter) ||
              (!couldDefenderActivateSCOPBefore && canDefenderActivateSCOPAfter)
                ? playSFX(GameSFX.actionSuperCOPowerAvailable)
                : madeCOPAvailable && playSFX(GameSFX.actionCOPowerAvailable);
            },
            gameAnimations ? 750 : 0,
          );
      }),
      (actionHandlers.AttackSeam = (seamResponse) => {
        if (
          (ahAttackSeam.apply(actionHandlers.AttackSeam, [seamResponse]),
          musicPlayerSettings.isPlaying)
        ) {
          if (gameAnimations) {
            let x = seamResponse.seamX,
              y = seamResponse.seamY;
            if (
              !(function (x, y) {
                return buildingsInfo[x] && buildingsInfo[x][y];
              })(x, y)
            )
              return;
            let pipeSeamInfo = (function (x, y) {
                return buildingsInfo[x][y];
              })(x, y),
              pipeSeamDiv =
                ((buildingID = pipeSeamInfo.buildings_id),
                document.querySelector(`.game-building[data-building-id='${buildingID}']`)),
              stepsX = 12,
              stepsY = 4,
              deltaX = 0.2,
              deltaY = 0.05;
            setTimeout(() => {
              moveDivToOffset(
                pipeSeamDiv,
                deltaX,
                0,
                stepsX,
                { then: [0, -deltaY, stepsY] },
                { then: [2 * -deltaX, 0, stepsX] },
                { then: [2 * deltaX, 0, stepsX] },
                { then: [0, -deltaY, stepsY] },
                { then: [2 * -deltaX, 0, stepsX] },
                { then: [2 * deltaX, 0, stepsX] },
                { then: [0, deltaY, stepsY] },
                { then: [2 * -deltaX, 0, stepsX] },
                { then: [deltaX, 0, stepsX] },
                { then: [0, deltaY, stepsY] },
              );
            }, attackDelayMS);
          }
          var buildingID;
          if (seamResponse.seamHp <= 0)
            return (
              playSFX(GameSFX.actionUnitAttackPipeSeam), void playSFX(GameSFX.actionUnitExplode)
            );
          setTimeout(() => playSFX(GameSFX.actionUnitAttackPipeSeam), attackDelayMS);
        }
      }),
      (actionHandlers.Move = (moveResponse, loadFlag) => {
        if (
          (ahMove.apply(actionHandlers.Move, [moveResponse, loadFlag]),
          !musicPlayerSettings.isPlaying)
        )
          return;
        let unitId = moveResponse.unit.units_id;
        movementResponseMap.set(unitId, moveResponse),
          moveResponse.path.length > 1 && playMovementSound(unitId);
      }),
      (actionHandlers.Capt = (captData) => {
        if ((ahCapt.apply(actionHandlers.Capt, [captData]), !musicPlayerSettings.isPlaying)) return;
        if (!(null != captData)) return;
        if (!(null != captData.newIncome)) return void playSFX(GameSFX.actionCaptureProgress);
        let myID = getMyID(),
          isSpectator = ((pid = myID), !playerKeys.includes(pid));
        var pid;
        console.log(isSpectator, captData.buildingInfo.buildings_team, myID),
          playSFX(
            isSpectator || captData.buildingInfo.buildings_team == myID
              ? GameSFX.actionCaptureAlly
              : GameSFX.actionCaptureEnemy,
          );
      }),
      (actionHandlers.Build = (buildData) => {
        ahBuild.apply(actionHandlers.Build, [buildData]),
          musicPlayerSettings.isPlaying && playSFX(GameSFX.actionUnitSupply);
      }),
      (actionHandlers.Load = (loadData) => {
        ahLoad.apply(actionHandlers.Load, [loadData]),
          musicPlayerSettings.isPlaying && playSFX(GameSFX.actionUnitLoad);
      }),
      (actionHandlers.Unload = (unloadData) => {
        ahUnload.apply(actionHandlers.Unload, [unloadData]),
          musicPlayerSettings.isPlaying && playSFX(GameSFX.actionUnitUnload);
      }),
      (actionHandlers.Supply = (supplyRes) => {
        ahSupply.apply(actionHandlers.Supply, [supplyRes]),
          musicPlayerSettings.isPlaying && playSFX(GameSFX.actionUnitSupply);
      }),
      (actionHandlers.Repair = (repairData) => {
        ahRepair.apply(actionHandlers.Repair, [repairData]),
          musicPlayerSettings.isPlaying && playSFX(GameSFX.actionUnitSupply);
      }),
      (actionHandlers.Hide = (hideData) => {
        ahHide.apply(actionHandlers.Hide, [hideData]),
          musicPlayerSettings.isPlaying &&
            (playSFX(GameSFX.actionUnitHide), stopMovementSound(hideData.unitId));
      }),
      (actionHandlers.Unhide = (unhideData) => {
        ahUnhide.apply(actionHandlers.Unhide, [unhideData]),
          musicPlayerSettings.isPlaying &&
            (playSFX(GameSFX.actionUnitUnhide), stopMovementSound(unhideData.unitId));
      }),
      (actionHandlers.Join = (joinData) => {
        ahJoin.apply(actionHandlers.Join, [joinData]),
          musicPlayerSettings.isPlaying &&
            (stopMovementSound(joinData.joinID), stopMovementSound(joinData.joinedUnit.units_id));
      }),
      (actionHandlers.Launch = (data) => {
        ahLaunch.apply(actionHandlers.Launch, [data]),
          musicPlayerSettings.isPlaying &&
            (playSFX(GameSFX.actionMissileSend),
            setTimeout(() => playSFX(GameSFX.actionMissileHit), siloDelayMS));
      }),
      (actionHandlers.NextTurn = (nextTurnRes) => {
        ahNextTurn.apply(actionHandlers.NextTurn, [nextTurnRes]),
          musicPlayerSettings.isPlaying && (visibilityMap.clear(), playThemeSong());
      }),
      (actionHandlers.Elimination = (eliminationRes) => {
        ahElimination.apply(actionHandlers.Elimination, [eliminationRes]),
          musicPlayerSettings.isPlaying;
      }),
      (actionHandlers.Power = (powerRes) => {
        if ((ahPower.apply(actionHandlers.Power, [powerRes]), !musicPlayerSettings.isPlaying))
          return;
        let coName = powerRes.coName,
          isSuperCOPower = "S" === powerRes.coPower,
          isBH = isBlackHoleCO(coName);
        if (isSuperCOPower) {
          playSFX(isBH ? GameSFX.actionBHActivateSCOP : GameSFX.actionAllyActivateSCOP),
            stopThemeSong(2500);
        }
      }),
      (actionHandlers.GameOver = () => {
        ahGameOver.apply(actionHandlers.GameOver, []), musicPlayerSettings.isPlaying;
      });
  })(),
  (function (afterPreloadFunction) {
    let audioList = (isMapEditor ? ["map-editor"] : getAllCONames()).map((name) =>
      getMusicURL(name),
    );
    audioList.push(getSoundEffectURL(GameSFX.uiCursorMove)),
      audioList.push(getSoundEffectURL(GameSFX.uiUnitSelect)),
      preloadList(audioList, afterPreloadFunction);
  })(() => {
    console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!"),
      (function () {
        let storageData = localStorage.getItem("musicPlayerSettings");
        null === storageData && updateSettingsInLocalStorage();
        let savedSettings = JSON.parse(storageData);
        for (let key in musicPlayerSettings)
          if (Object.hasOwn(savedSettings, key) && key.startsWith("__")) {
            let regularKey = key.substring(2);
            musicPlayerSettings[regularKey] = savedSettings[key];
          }
        addSettingsChangeListener(updateSettingsInLocalStorage);
      })(),
      preloadExtraAudio(() => {
        console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
      });
  });
