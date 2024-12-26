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
// @grant       none
// ==/UserScript==

(function () {
  "use strict";

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (typeof document === "undefined") {
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

  var css_248z =
    '/* Context Menu */\r\n.cls-context-menu-link {\r\n  display: block;\r\n  padding: 20px;\r\n  background: #ececec;\r\n}\r\n\r\n.cls-context-menu {\r\n  position: absolute;\r\n  display: none;\r\n  width: 175px;\r\n  height: 347px;\r\n  padding-top: 4px;\r\n}\r\n\r\n.cls-context-menu ul,\r\n#context-menu li {\r\n  list-style: none;\r\n  margin: 0;\r\n  padding: 0;\r\n  background: white;\r\n}\r\n\r\n.cls-context-menu {\r\n  border: 1px solid #888888 !important;\r\n}\r\n.cls-context-menu li {\r\n  border: 1px solid #888888;\r\n}\r\n.cls-context-menu li:last-child {\r\n  border: none;\r\n}\r\n.cls-context-menu li a {\r\n  display: block;\r\n  padding: 5px 10px;\r\n  text-decoration: none;\r\n  color: blue;\r\n}\r\n.cls-context-menu li a:hover {\r\n  background: blue;\r\n  color: #fff;\r\n}\r\n\r\n/* Input Range */\r\n:root {\r\n  --shadow-len: -60px;\r\n}\r\ninput[type="range"] {\r\n  margin: auto;\r\n  -webkit-appearance: none;\r\n  position: relative;\r\n  overflow: hidden;\r\n  height: 25px;\r\n  cursor: pointer;\r\n  border-radius: 0; /* iOS */\r\n}\r\n\r\n::-webkit-slider-runnable-track {\r\n  background: #ddd;\r\n}\r\n\r\n/*\r\n     * 1. Set to 0 width and remove border for a slider without a thumb\r\n     * 2. Shadow is negative the full width of the input and has a spread\r\n     *    of the width of the input.\r\n     */\r\n::-webkit-slider-thumb {\r\n  -webkit-appearance: none;\r\n  width: 20px; /* 1 */\r\n  height: 25px;\r\n  background: #fff;\r\n  box-shadow: -200px 0 0 200px #0066cc; /* 2 */\r\n  border: 2px solid #888888; /* 1 */\r\n  clip-path: inset(0px 0px 0px let(--shadow-len));\r\n}\r\n\r\n::-moz-range-track {\r\n  height: 25px;\r\n  background: #888888;\r\n}\r\n\r\n::-moz-range-thumb {\r\n  background: #fff;\r\n  height: 25px;\r\n  width: 20px;\r\n  border: 3px solid #888888;\r\n  border-radius: 0 !important;\r\n  box-shadow: -200px 0 0 200px #0066cc;\r\n  box-sizing: border-box;\r\n  clip-path: inset(0px 0px 0px let(--shadow-len));\r\n}\r\n\r\n::-ms-fill-lower {\r\n  background: #0066cc;\r\n}\r\n\r\n::-ms-thumb {\r\n  background: #fff;\r\n  border: 3px solid #999;\r\n  height: 25px;\r\n  width: 20px;\r\n  box-sizing: border-box;\r\n}\r\n\r\n::-ms-ticks-after {\r\n  display: none;\r\n}\r\n\r\n::-ms-ticks-before {\r\n  display: none;\r\n}\r\n\r\n::-ms-track {\r\n  background: #888888;\r\n  color: transparent;\r\n  height: 25px;\r\n  border: none;\r\n}\r\n\r\n::-ms-tooltip {\r\n  display: none;\r\n}\r\n\r\n.theme-radio-btn {\r\n  height: 14px;\r\n  width: 14px;\r\n}\r\n\r\n.theme-radio-btn:hover {\r\n  cursor: pointer;\r\n}\r\n\r\n#shuffle-button {\r\n  font-family: "Nova Square", cursive;\r\n  line-height: 25px;\r\n}\r\n\r\n.shuffle-button-enabled {\r\n  color: white;\r\n  background: #0066cc;\r\n  border: 2px solid #0066cc;\r\n}\r\n\r\n.shuffle-button-enabled:hover {\r\n  cursor: pointer;\r\n}\r\n\r\n.shuffle-button-enabled:active {\r\n  color: black;\r\n  background: white;\r\n  border: 2px solid #888888;\r\n}\r\n\r\n.shuffle-button-disabled {\r\n  color: white;\r\n  background: #888888;\r\n  border: 2px solid #888888;\r\n}\r\n\r\n.blob {\r\n  animation: shine 1.5s ease-in-out infinite;\r\n  animation-fill-mode: forwards;\r\n  animation-direction: alternate;\r\n}\r\n\r\n#version-link {\r\n  color: #0066cc;\r\n  font-weight: bold;\r\n  text-decoration: underline;\r\n}\r\n';
  styleInject(css_248z);

  const ORANGE_STAR_COs = new Set(["andy", "max", "sami", "nell", "hachi"]);
  const BLUE_MOON_COs = new Set(["olaf", "grit", "colin", "sasha"]);
  const GREEN_EARTH_COs = new Set(["eagle", "drake", "jess", "javier"]);
  const YELLOW_COMET_COs = new Set(["kanbei", "sonja", "sensei", "grim"]);
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
  new Set([
    ...ORANGE_STAR_COs,
    ...BLUE_MOON_COs,
    ...GREEN_EARTH_COs,
    ...YELLOW_COMET_COs,
    ...BLACK_HOLE_COs,
  ]);
  typeof maxX !== "undefined" ? maxX : -1;
  typeof maxY !== "undefined" ? maxY : -1;
  let gameAnimations = typeof gameAnims !== "undefined" ? gameAnims : false;
  function isBlackHoleCO(coName) {
    return BLACK_HOLE_COs.has(coName.toLowerCase());
  }

  document.querySelector("#gamemap");
  document.querySelector("#gamemap-container");
  document.querySelector("#zoom-in");
  document.querySelector("#zoom-out");
  document.querySelector(".zoom-level");
  document.querySelector("#cursor");
  document.querySelector(".event-username");
  document.querySelector(".supply-icon");
  document.querySelector(".trapped-icon");
  document.querySelector(".target-icon");
  document.querySelector(".destroy-icon");
  let replayOpenBtn = document.querySelector(".replay-open");
  let replayCloseBtn = document.querySelector(".replay-close");
  let replayForwardBtn = document.querySelector(".replay-forward");
  let replayForwardActionBtn = document.querySelector(".replay-forward-action");
  let replayBackwardBtn = document.querySelector(".replay-backward");
  let replayBackwardActionBtn = document.querySelector(".replay-backward-action");
  let replayDaySelectorCheckBox = document.querySelector(".replay-day-selector");
  let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;
  let menu = isMapEditor
    ? document.querySelector("#replay-misc-controls")
    : document.querySelector("#game-map-menu")?.parentNode;
  function getBuildingDiv(buildingID) {
    return document.querySelector(`.game-building[data-building-id='${buildingID}']`);
  }
  let moveAnimationDelayMS = 5;
  function moveDivToOffset(div, dx, dy, steps, ...followUpAnimations) {
    if (steps <= 1) {
      if (followUpAnimations.length > 0) {
        let nextSet = followUpAnimations.shift().then;
        moveDivToOffset(div, nextSet[0], nextSet[1], nextSet[2], ...followUpAnimations);
      }
      return;
    }
    setTimeout(
      () => moveDivToOffset(div, dx, dy, steps - 1, ...followUpAnimations),
      moveAnimationDelayMS,
    );
    let left = parseFloat(div.style.left);
    let top = parseFloat(div.style.top);
    left += dx;
    top += dy;
    div.style.left = left + "px";
    div.style.top = top + "px";
  }

  var COPowerEnum;
  (function (COPowerEnum) {
    COPowerEnum["NoPower"] = "N";
    COPowerEnum["COPower"] = "Y";
    COPowerEnum["SuperCOPower"] = "S";
  })(COPowerEnum || (COPowerEnum = {}));
  let siloDelayMS = gameAnimations ? 3000 : 0;
  let attackDelayMS = gameAnimations ? 1000 : 0;
  let myName = document
    .querySelector("#profile-menu")
    .getElementsByClassName("dropdown-menu-link")[0]
    .href.split("username=")[1];
  let myID = -1;
  function getMyID() {
    if (myID < 0) {
      getAllPlayersInfo().forEach((entry) => {
        if (entry.users_username === myName) {
          myID = entry.players_id;
        }
      });
    }
    return myID;
  }
  function getPlayerInfo(pid) {
    return playersInfo[pid];
  }
  function getAllPlayersInfo() {
    return Object.values(playersInfo);
  }
  function isPlayerSpectator(pid) {
    return !playerKeys.includes(pid);
  }
  function canPlayerActivateCOPower(pid) {
    let info = getPlayerInfo(pid);
    return info.players_co_power >= info.players_co_max_power;
  }
  function canPlayerActivateSuperCOPower(pid) {
    let info = getPlayerInfo(pid);
    return info.players_co_power >= info.players_co_max_spower;
  }
  function isValidBuilding(x, y) {
    return buildingsInfo[x] && buildingsInfo[x][y];
  }
  function getBuildingInfo(x, y) {
    return buildingsInfo[x][y];
  }
  function getCurrentClickData() {
    if (!currentClick) return null;
    return currentClick;
  }
  class currentPlayer {
    static get info() {
      if (typeof currentTurn === "undefined") return null;
      return getPlayerInfo(currentTurn);
    }
    static get isPowerActivated() {
      return this?.coPowerState !== COPowerEnum.NoPower;
    }
    static get coPowerState() {
      return this.info?.players_co_power_on;
    }
    static get coName() {
      return this.info?.co_name;
    }
  }
  function getAllPlayingCONames() {
    if (isMapEditor) return new Set(["map-editor"]);
    return new Set(getAllPlayersInfo().map((info) => info.co_name));
  }
  function getUnitInfo(unitId) {
    return unitsInfo[unitId];
  }
  function getUnitName(unitId) {
    return getUnitInfo(unitId)?.units_name;
  }
  function getUnitInfoFromCoords(x, y) {
    return Object.values(unitsInfo)
      .filter((info) => info.units_x == x && info.units_y == y)
      .pop();
  }
  function isValidUnit(unitId) {
    return unitId !== undefined && unitsInfo[unitId] !== undefined;
  }

  var SettingsGameType;
  (function (SettingsGameType) {
    SettingsGameType["AW1"] = "AW1";
    SettingsGameType["AW2"] = "AW2";
    SettingsGameType["AW_RBC"] = "AW_RBC";
    SettingsGameType["AW_DS"] = "AW_DS";
  })(SettingsGameType || (SettingsGameType = {}));
  var SettingsThemeType;
  (function (SettingsThemeType) {
    SettingsThemeType["REGULAR"] = "REGULAR";
    SettingsThemeType["CO_POWER"] = "CO_POWER";
    SettingsThemeType["SUPER_CO_POWER"] = "SUPER_CO_POWER";
  })(SettingsThemeType || (SettingsThemeType = {}));
  function getCurrentThemeType() {
    let currentPowerState = currentPlayer?.coPowerState;
    if (currentPowerState === "Y") return SettingsThemeType.CO_POWER;
    if (currentPowerState === "S") return SettingsThemeType.SUPER_CO_POWER;
    return SettingsThemeType.REGULAR;
  }
  const STORAGE_KEY = "musicPlayerSettings";
  const onSettingsChangeListeners = [];
  function addSettingsChangeListener(fn) {
    onSettingsChangeListeners.push(fn);
  }
  class musicPlayerSettings {
    static __isPlaying = false;
    static __volume = 0.5;
    static __sfxVolume = 0.35;
    static __uiVolume = 0.425;
    static __gameType = SettingsGameType.AW_DS;
    static __alternateThemeDay = 5;
    static __themeType = SettingsThemeType.REGULAR;
    static toJSON() {
      return JSON.stringify({
        isPlaying: this.__isPlaying,
        volume: this.__volume,
        sfxVolume: this.__sfxVolume,
        uiVolume: this.__uiVolume,
        gameType: this.__gameType,
        alternateThemeDay: this.__alternateThemeDay,
      });
    }
    static fromJSON(json) {
      let savedSettings = JSON.parse(json);
      for (let key in this) {
        key = key.substring(2);
        if (Object.hasOwn(savedSettings, key)) {
          this[key] = savedSettings[key];
        }
      }
    }
    static set isPlaying(val) {
      this.__isPlaying = val;
      this.onSettingChangeEvent("isPlaying");
    }
    static get isPlaying() {
      return this.__isPlaying;
    }
    static set volume(val) {
      if (val === this.__volume) return;
      this.__volume = val;
      this.onSettingChangeEvent("volume");
    }
    static get volume() {
      return this.__volume;
    }
    static set sfxVolume(val) {
      if (val === this.__sfxVolume) return;
      this.__sfxVolume = val;
      this.onSettingChangeEvent("sfxVolume");
    }
    static get sfxVolume() {
      return this.__sfxVolume;
    }
    static set uiVolume(val) {
      if (val === this.__uiVolume) return;
      this.__uiVolume = val;
      this.onSettingChangeEvent("uiVolume");
    }
    static get uiVolume() {
      return this.__uiVolume;
    }
    static set gameType(val) {
      if (val === this.__gameType) return;
      this.__gameType = val;
      this.onSettingChangeEvent("gameType");
    }
    static get gameType() {
      return this.__gameType;
    }
    static set themeType(val) {
      if (val === this.__themeType) return;
      this.__themeType = val;
      this.onSettingChangeEvent("themeType");
    }
    static get themeType() {
      return this.__themeType;
    }
    static set alternateThemeDay(val) {
      if (val === this.__alternateThemeDay) return;
      this.__alternateThemeDay = val;
      this.onSettingChangeEvent("alternateThemeDay");
    }
    static get alternateThemeDay() {
      return this.__alternateThemeDay;
    }
    static onSettingChangeEvent(key) {
      onSettingsChangeListeners.forEach((fn) => fn(key));
    }
  }
  function loadSettingsFromLocalStorage() {
    let storageData = localStorage.getItem(STORAGE_KEY);
    if (!storageData || storageData === "undefined") {
      console.log("No settings found, storing defaults");
      storageData = updateSettingsInLocalStorage();
    }
    console.log("Loading settings", storageData);
    musicPlayerSettings.fromJSON(storageData);
    addSettingsChangeListener(updateSettingsInLocalStorage);
  }
  function updateSettingsInLocalStorage() {
    let jsonSettings = musicPlayerSettings.toJSON();
    console.log("Saving settings...", jsonSettings);
    localStorage.setItem(STORAGE_KEY, jsonSettings);
    return jsonSettings;
  }

  const BASE_URL = "https://developerjose.netlify.app";
  const BASE_MUSIC_URL = BASE_URL + "/music";
  const BASE_SFX_URL = BASE_MUSIC_URL + "/sfx";
  const NEUTRAL_IMG_URL = BASE_URL + "/img/music-player-icon.png";
  const PLAYING_IMG_URL = BASE_URL + "/img/music-player-playing.gif";
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
    GameSFX["uiMenuOpen"] = "ui-menu-open";
    GameSFX["uiMenuClose"] = "ui-menu-close";
    GameSFX["uiMenuMove"] = "ui-menu-move";
    GameSFX["uiUnitSelect"] = "ui-unit-select";
  })(GameSFX || (GameSFX = {}));
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
  const alternateThemes = new Map([
    [SettingsGameType.AW1, new Set(["sturm", "vonbolt"])],
    [SettingsGameType.AW2, new Set(["sturm", "vonbolt"])],
    [
      SettingsGameType.AW_RBC,
      new Set(["andy", "olaf", "eagle", "drake", "grit", "kanbei", "sonja", "sturm", "vonbolt"]),
    ],
    [SettingsGameType.AW_DS, new Set(["sturm", "vonbolt"])],
  ]);
  function getAlternateMusicFilename(coName, gameType, themeType) {
    coName = coName.toLowerCase();
    let alternateThemesSet = alternateThemes.get(gameType);
    let faction = isBlackHoleCO(coName) ? "bh" : "ally";
    let isPowerActive = themeType !== SettingsThemeType.REGULAR;
    if (gameType === SettingsGameType.AW_RBC && isPowerActive) {
      return `t-${faction}-${themeType}`;
    }
    if (!alternateThemesSet.has(coName)) {
      return `t-${coName}`;
    }
    if (coName === "andy" && gameType == SettingsGameType.AW_RBC) {
      return isPowerActive ? "t-clone-andy-cop" : "t-clone-andy";
    }
    return `t-${coName}-2`;
  }
  function getMusicFilename(coName, gameType, themeType) {
    if (coName === "map-editor") return "t-map-editor";
    let useAlternateTheme = gameDay >= musicPlayerSettings.alternateThemeDay;
    if (useAlternateTheme) {
      return getAlternateMusicFilename(coName, gameType, themeType);
    }
    let isPowerActive = themeType !== SettingsThemeType.REGULAR;
    if (!isPowerActive || gameType === SettingsGameType.AW1) {
      return `t-${coName}`;
    }
    if (gameType === SettingsGameType.AW_RBC) {
      return `t-${coName}-cop`;
    }
    let faction = isBlackHoleCO(coName) ? "bh" : "ally";
    return `t-${faction}-${themeType}`;
  }
  function getMusicURL(coName, gameType = null, themeType = null) {
    if (gameType === null) gameType = musicPlayerSettings.gameType;
    if (themeType === null) themeType = musicPlayerSettings.themeType;
    let gameDir = gameType;
    let filename = getMusicFilename(coName, gameType, themeType);
    let url = `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`;
    return url.toLowerCase().replaceAll("_", "-").replaceAll(" ", "");
  }
  function getSoundEffectURL(sfx) {
    return `${BASE_SFX_URL}/${sfx}.ogg`;
  }
  function getMovementSoundURL(unitName) {
    return `${BASE_SFX_URL}/${onMovementStartMap.get(unitName)}.ogg`;
  }
  function getMovementRollOffURL(unitName) {
    return `${BASE_SFX_URL}/${onMovementRolloffMap.get(unitName)}.ogg`;
  }
  function hasMovementRollOff(unitName) {
    return onMovementRolloffMap.has(unitName);
  }
  function getAllSoundEffectURLS() {
    let allSoundURLs = new Set();
    for (let sfx of Object.values(GameSFX)) {
      allSoundURLs.add(getSoundEffectURL(sfx));
    }
    for (let unitName of onMovementStartMap.keys()) {
      allSoundURLs.add(getMovementSoundURL(unitName));
    }
    for (let unitName of onMovementRolloffMap.keys()) {
      allSoundURLs.add(getMovementRollOffURL(unitName));
    }
    return allSoundURLs;
  }

  class CustomMenuSettingsUI {
    _parent;
    _children = new Map();
    constructor(prefix, buttonImageURL, hoverText = "") {
      this._parent = document.createElement("div");
      this._parent.id = prefix + "-parent";
      this._parent.classList.add("game-tools-btn");
      this._parent.style.width = "34px";
      this._parent.style.height = "30px";
      this._parent.style.borderLeft = "none";
      let hoverSpan = document.createElement("span");
      hoverSpan.id = prefix + "-hover-span";
      hoverSpan.classList.add("game-tools-btn-text", "small_text");
      hoverSpan.innerText = hoverText;
      this._parent.appendChild(hoverSpan);
      this._children.set("hover", hoverSpan);
      let bgDiv = document.createElement("div");
      bgDiv.id = prefix + "-background";
      bgDiv.classList.add("game-tools-bg");
      bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
      this._parent.appendChild(bgDiv);
      this._children.set("bg", bgDiv);
      let btnLink = document.createElement("a");
      btnLink.id = prefix + "-link";
      btnLink.classList.add("norm2");
      bgDiv.appendChild(btnLink);
      let btnImg = document.createElement("img");
      btnImg.id = prefix + "-link-img";
      btnImg.style.verticalAlign = "middle";
      btnImg.src = buttonImageURL;
      btnLink.appendChild(btnImg);
      this._children.set("img", btnImg);
    }
    addToAWBWPage() {
      menu.appendChild(this._parent);
    }
    setHoverText(text) {
      let hoverSpan = this._children.get("hover");
      hoverSpan.innerText = text;
    }
    setProgress(progress) {
      let bgDiv = this._children.get("bg");
      bgDiv.style.backgroundImage =
        "linear-gradient(to right, #ffffff " + String(progress) + "% , #888888 0%)";
    }
    setImage(imageURL) {
      let btnImg = this._children.get("img");
      btnImg.src = imageURL;
    }
    addClickHandler(handler) {
      this._parent.addEventListener("click", handler);
    }
  }

  const musicPlayerUI = new CustomMenuSettingsUI("music-player", NEUTRAL_IMG_URL, "Play Tunes");
  musicPlayerUI.addClickHandler(onMusicBtnClick);
  addSettingsChangeListener(onSettingsChange$1);
  function onMusicBtnClick(_event) {
    musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
  }
  function onSettingsChange$1(key) {
    if (key != "isPlaying") return;
    if (musicPlayerSettings.isPlaying) {
      musicPlayerUI.setHoverText("Stop Tunes");
      musicPlayerUI.setImage(PLAYING_IMG_URL);
    } else {
      musicPlayerUI.setHoverText("Play Tunes");
      musicPlayerUI.setImage(NEUTRAL_IMG_URL);
    }
  }

  let currentThemeKey = "";
  const urlAudioMap = new Map();
  const unitIDAudioMap = new Map();
  let currentlyDelaying = false;
  let delayThemeMS = 0;
  addSettingsChangeListener(onSettingsChange);
  function playThemeSong(startFromBeginning = false) {
    if (!musicPlayerSettings.isPlaying) return;
    if (currentlyDelaying) return;
    if (delayThemeMS > 0) {
      setTimeout(() => {
        currentlyDelaying = false;
        playThemeSong();
      }, delayThemeMS);
      delayThemeMS = 0;
      currentlyDelaying = true;
      return;
    }
    let coName = isMapEditor ? "map-editor" : currentPlayer.coName;
    playMusicURL(getMusicURL(coName), startFromBeginning);
  }
  function stopThemeSong(delayMS = 0) {
    if (delayMS > 0) delayThemeMS = delayMS;
    if (!urlAudioMap.has(currentThemeKey)) return;
    let currentTheme = urlAudioMap.get(currentThemeKey);
    if (currentTheme.paused) return;
    if (currentTheme.readyState !== HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      currentTheme.addEventListener("canplaythrough", (e) => e.target.pause(), {
        once: true,
      });
      return;
    }
    console.log("[AWBW Improved Music Player] Pausing: ", currentTheme.src);
    currentTheme.pause();
  }
  function playMovementSound(unitId) {
    if (!musicPlayerSettings.isPlaying) return;
    if (!unitIDAudioMap.has(unitId)) {
      let unitName = getUnitName(unitId);
      let movementSoundURL = getMovementSoundURL(unitName);
      unitIDAudioMap.set(unitId, new Audio(movementSoundURL));
    }
    let movementAudio = unitIDAudioMap.get(unitId);
    movementAudio.currentTime = 0;
    movementAudio.loop = false;
    movementAudio.volume = musicPlayerSettings.sfxVolume;
    movementAudio.play();
  }
  function stopMovementSound(unitId, rolloff = true) {
    if (!musicPlayerSettings.isPlaying) return;
    if (!unitIDAudioMap.has(unitId)) return;
    let movementAudio = unitIDAudioMap.get(unitId);
    if (movementAudio.paused) return;
    if (movementAudio.readyState != HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      movementAudio.addEventListener("play", (event) => event.target.pause(), {
        once: true,
      });
      return;
    }
    movementAudio.pause();
    movementAudio.currentTime = 0;
    if (!rolloff) return;
    let unitName = getUnitName(unitId);
    if (hasMovementRollOff(unitName)) {
      let audioURL = getMovementRollOffURL(unitName);
      playOneShotURL(audioURL, musicPlayerSettings.sfxVolume);
    }
  }
  function playSFX(sfx) {
    if (!musicPlayerSettings.isPlaying) return;
    let sfxURL = getSoundEffectURL(sfx);
    let vol = musicPlayerSettings.sfxVolume;
    if (sfx.startsWith("sfx-ui")) {
      vol = musicPlayerSettings.uiVolume;
    }
    if (!urlAudioMap.has(sfxURL)) {
      urlAudioMap.set(sfxURL, new Audio(sfxURL));
    }
    let audio = urlAudioMap.get(sfxURL);
    audio.volume = vol;
    audio.currentTime = 0;
    audio.play();
  }
  function stopAllSounds() {
    stopThemeSong();
    for (let unitId of unitIDAudioMap.keys()) {
      stopMovementSound(unitId, false);
    }
    for (let audio of urlAudioMap.values()) {
      audio.volume = 0;
    }
  }
  function preloadAllCommonAudio(afterPreloadFunction) {
    let coNames = getAllPlayingCONames();
    let audioList = new Set();
    coNames.forEach((name) => audioList.add(getMusicURL(name)));
    audioList.add(getSoundEffectURL(GameSFX.uiCursorMove));
    audioList.add(getSoundEffectURL(GameSFX.uiUnitSelect));
    preloadAudios(audioList, afterPreloadFunction);
  }
  function preloadAllExtraAudio(afterPreloadFunction) {
    if (isMapEditor) return;
    let audioList = getAllSoundEffectURLS();
    let coNames = getAllPlayingCONames();
    for (const gameType in SettingsGameType) {
      for (const themeType in SettingsThemeType) {
        const gameTypeEnum = gameType;
        const themeTypeEnum = themeType;
        coNames.forEach((name) => audioList.add(getMusicURL(name, gameTypeEnum, themeTypeEnum)));
      }
    }
    preloadAudios(audioList, afterPreloadFunction);
  }
  function preloadAudios(audioURLs, afterPreloadFunction) {
    let numLoadedAudios = 0;
    let onLoadAudio = (event) => {
      let audio = event.target;
      numLoadedAudios++;
      let loadPercentage = (numLoadedAudios / audioURLs.size) * 100;
      musicPlayerUI.setProgress(loadPercentage);
      if (event.type !== "error") {
        urlAudioMap.set(audio.src, audio);
      } else {
        console.log("Could not pre-load: ", audio.src);
      }
      if (numLoadedAudios >= audioURLs.size) {
        numLoadedAudios = 0;
        if (afterPreloadFunction) afterPreloadFunction();
      }
    };
    audioURLs.forEach((url) => {
      if (urlAudioMap.has(url)) {
        numLoadedAudios++;
        return;
      }
      let audio = new Audio(url);
      audio.addEventListener("canplaythrough", onLoadAudio, { once: true });
      audio.addEventListener("error", onLoadAudio, { once: true });
    });
  }
  function playMusicURL(srcURL, startFromBeginning = false) {
    if (!musicPlayerSettings.isPlaying) return;
    let currentTheme = urlAudioMap.get(currentThemeKey);
    let nextTheme = currentTheme;
    if (srcURL !== currentThemeKey) {
      stopThemeSong();
      currentThemeKey = srcURL;
      if (!urlAudioMap.has(srcURL)) {
        urlAudioMap.set(srcURL, new Audio(srcURL));
      }
      nextTheme = urlAudioMap.get(srcURL);
    }
    if (startFromBeginning) nextTheme.currentTime = 0;
    console.log("[AWBW Improved Music Player] Now Playing: ", srcURL);
    nextTheme.volume = musicPlayerSettings.volume;
    nextTheme.loop = true;
    nextTheme.play();
  }
  function playOneShotURL(srcURL, volume) {
    if (!musicPlayerSettings.isPlaying) return;
    let soundInstance = new Audio(srcURL);
    soundInstance.currentTime = 0;
    soundInstance.volume = volume;
    soundInstance.play();
  }
  function onSettingsChange(key) {
    switch (key) {
      case "isPlaying":
        if (musicPlayerSettings.isPlaying) {
          playThemeSong();
        } else {
          stopAllSounds();
        }
        break;
      case "gameType":
      case "alternateThemeDay":
        playThemeSong();
        break;
      case "themeType":
        let restartMusic = musicPlayerSettings.themeType !== SettingsThemeType.REGULAR;
        playThemeSong(restartMusic);
        break;
      case "volume": {
        let currentTheme = urlAudioMap.get(currentThemeKey);
        if (currentTheme) currentTheme.volume = musicPlayerSettings.volume;
        break;
      }
    }
  }

  let ahCursorMove =
    typeof updateCursor !== "undefined"
      ? updateCursor
      : typeof designMapEditor !== "undefined"
        ? designMapEditor.updateCursor
        : null;
  let ahOpenMenu = typeof openMenu !== "undefined" ? openMenu : null;
  let ahCloseMenu = typeof closeMenu !== "undefined" ? closeMenu : null;
  typeof resetAttack !== "undefined" ? resetAttack : null;
  let ahUnitClick = typeof unitClickHandler !== "undefined" ? unitClickHandler : null;
  let ahWait = typeof waitUnit !== "undefined" ? waitUnit : null;
  let ahAnimUnit = typeof animUnit !== "undefined" ? animUnit : null;
  let ahAnimExplosion = typeof animExplosion !== "undefined" ? animExplosion : null;
  let ahFog = typeof updateAirUnitFogOnMove !== "undefined" ? updateAirUnitFogOnMove : null;
  let ahFire = typeof actionHandlers !== "undefined" ? actionHandlers.Fire : null;
  let ahAttackSeam = typeof actionHandlers !== "undefined" ? actionHandlers.AttackSeam : null;
  let ahMove = typeof actionHandlers !== "undefined" ? actionHandlers.Move : null;
  let ahCapt = typeof actionHandlers !== "undefined" ? actionHandlers.Capt : null;
  let ahBuild = typeof actionHandlers !== "undefined" ? actionHandlers.Build : null;
  let ahLoad = typeof actionHandlers !== "undefined" ? actionHandlers.Load : null;
  let ahUnload = typeof actionHandlers !== "undefined" ? actionHandlers.Unload : null;
  let ahSupply = typeof actionHandlers !== "undefined" ? actionHandlers.Supply : null;
  let ahRepair = typeof actionHandlers !== "undefined" ? actionHandlers.Repair : null;
  let ahHide = typeof actionHandlers !== "undefined" ? actionHandlers.Hide : null;
  let ahUnhide = typeof actionHandlers !== "undefined" ? actionHandlers.Unhide : null;
  let ahJoin = typeof actionHandlers !== "undefined" ? actionHandlers.Join : null;
  let ahLaunch = typeof actionHandlers !== "undefined" ? actionHandlers.Launch : null;
  let ahNextTurn = typeof actionHandlers !== "undefined" ? actionHandlers.NextTurn : null;
  let ahElimination = typeof actionHandlers !== "undefined" ? actionHandlers.Elimination : null;
  let ahPower = typeof actionHandlers !== "undefined" ? actionHandlers.Power : null;
  let ahGameOver = typeof actionHandlers !== "undefined" ? actionHandlers.GameOver : null;

  const CURSOR_THRESHOLD_MS = 25;
  let lastCursorCall = Date.now();
  let lastCursorX = -1;
  let lastCursorY = -1;
  var MenuClickType;
  (function (MenuClickType) {
    MenuClickType[(MenuClickType["None"] = 0)] = "None";
    MenuClickType[(MenuClickType["Unit"] = 1)] = "Unit";
    MenuClickType[(MenuClickType["MenuItem"] = 2)] = "MenuItem";
  })(MenuClickType || (MenuClickType = {}));
  let menuItemClick = MenuClickType.None;
  let menuOpen = false;
  let visibilityMap = new Map();
  let movementResponseMap = new Map();
  function onCursorMove(cursorX, cursorY) {
    ahCursorMove.apply(ahCursorMove, [cursorX, cursorY]);
    if (!musicPlayerSettings.isPlaying) return;
    let dx = Math.abs(cursorX - lastCursorX);
    let dy = Math.abs(cursorY - lastCursorY);
    let cursorMoved = dx >= 1 || dy >= 1;
    let timeSinceLastCursorCall = Date.now() - lastCursorCall;
    if (timeSinceLastCursorCall < CURSOR_THRESHOLD_MS) return;
    if (cursorMoved) {
      playSFX(GameSFX.uiCursorMove);
      lastCursorCall = Date.now();
    }
    lastCursorX = cursorX;
    lastCursorY = cursorY;
  }
  function syncSettingsToMusic() {
    visibilityMap.clear();
    musicPlayerSettings.themeType = getCurrentThemeType();
    playThemeSong();
  }
  function addGameHandlers() {
    if (isMapEditor) {
      designMapEditor.updateCursor = onCursorMove;
      return;
    } else {
      updateCursor = onCursorMove;
    }
    let refreshMusic = () => setTimeout(syncSettingsToMusic, 500);
    replayForwardBtn.addEventListener("click", refreshMusic);
    replayForwardActionBtn.addEventListener("click", refreshMusic);
    replayBackwardBtn.addEventListener("click", refreshMusic);
    replayBackwardActionBtn.addEventListener("click", refreshMusic);
    replayOpenBtn.addEventListener("click", refreshMusic);
    replayCloseBtn.addEventListener("click", refreshMusic);
    replayDaySelectorCheckBox.addEventListener("click", refreshMusic);
    openMenu = (menu, x, y) => {
      ahOpenMenu?.apply(openMenu, [menu, x, y]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Open Menu", menu, x, y);
      let menuOptions = document.getElementsByClassName("menu-option");
      for (var i = 0; i < menuOptions.length; i++) {
        menuOptions[i].addEventListener("mouseenter", (_event) => {
          playSFX(GameSFX.uiMenuMove);
        });
        menuOptions[i].addEventListener(
          "click",
          (_event) => (menuItemClick = MenuClickType.MenuItem),
        );
      }
      menuOpen = true;
      playSFX(GameSFX.uiMenuOpen);
    };
    closeMenu = () => {
      ahCloseMenu?.apply(closeMenu, []);
      console.log("CloseMenu", menuOpen, menuItemClick);
      if (!musicPlayerSettings.isPlaying) return;
      let confirmedAction = menuOpen && menuItemClick === MenuClickType.MenuItem;
      let canceledAction = menuOpen && menuItemClick === MenuClickType.None;
      let canceledUnitAction =
        !menuOpen && getCurrentClickData()?.type === "unit" && menuItemClick !== MenuClickType.None;
      console.log(
        "Actions",
        confirmedAction,
        canceledAction,
        canceledUnitAction,
        getCurrentClickData()?.type,
      );
      if (confirmedAction) {
        menuItemClick = MenuClickType.None;
      } else if (canceledAction || canceledUnitAction) {
        menuItemClick = MenuClickType.None;
      }
      menuOpen = false;
    };
    unitClickHandler = (clicked) => {
      ahUnitClick?.apply(unitClickHandler, [clicked]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Unit Click", clicked);
      menuItemClick = MenuClickType.Unit;
      playSFX(GameSFX.uiUnitSelect);
    };
    waitUnit = (unitId) => {
      ahWait?.apply(waitUnit, [unitId]);
      if (!musicPlayerSettings.isPlaying) return;
      stopMovementSound(unitId);
      if (movementResponseMap.has(unitId)) {
        let response = movementResponseMap.get(unitId);
        if (response?.trapped) {
          playSFX(GameSFX.unitTrap);
        }
        movementResponseMap.delete(unitId);
      }
    };
    animUnit = (path, unitId, unitSpan, unitTeam, viewerTeam, i) => {
      ahAnimUnit?.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);
      console.log("AnimUnit", path, unitId, unitSpan, unitTeam, viewerTeam, i);
      if (!musicPlayerSettings.isPlaying) return;
      if (!isValidUnit(unitId) || !path || !i) return;
      if (i >= path.length) return;
      if (visibilityMap.has(unitId)) return;
      let unitVisible = path[i].unit_visible;
      if (!unitVisible) {
        visibilityMap.set(unitId, unitVisible);
        setTimeout(() => stopMovementSound(unitId, false), 1000);
      }
    };
    animExplosion = (unit) => {
      ahAnimExplosion?.apply(animExplosion, [unit]);
      if (!musicPlayerSettings.isPlaying) return;
      let unitId = unit.units_id;
      let unitFuel = unit.units_fuel;
      let sfx = GameSFX.unitExplode;
      if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
        sfx = GameSFX.unitMissileHit;
      }
      playSFX(sfx);
      stopMovementSound(unitId, false);
    };
    updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change, delay) => {
      ahFog?.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Fog", x, y, mType, neighbours, unitVisible, change, delay);
      let unitInfo = getUnitInfoFromCoords(x, y);
      if (!unitInfo) return;
      if (change === "Add") {
        setTimeout(() => stopMovementSound(unitInfo.units_id, false), delay);
      }
    };
    actionHandlers.Fire = (response) => {
      if (!musicPlayerSettings.isPlaying) {
        ahFire?.apply(actionHandlers.Fire, [response]);
        return;
      }
      console.log("Fire", response);
      let attackerID = response.copValues.attacker.playerId;
      let defenderID = response.copValues.defender.playerId;
      let couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
      let couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
      let couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
      let couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);
      ahFire?.apply(actionHandlers.Fire, [response]);
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
          playSFX(GameSFX.powerSCOPAvailable);
        } else if (madeCOPAvailable) {
          playSFX(GameSFX.powerCOPAvailable);
        }
      }, delay);
    };
    actionHandlers.AttackSeam = (response) => {
      ahAttackSeam?.apply(actionHandlers.AttackSeam, [response]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("AttackSeam", response);
      if (gameAnimations) {
        let x = response.seamX;
        let y = response.seamY;
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
      if (response.seamHp <= 0) {
        playSFX(GameSFX.unitAttackPipeSeam);
        playSFX(GameSFX.unitExplode);
        return;
      }
      setTimeout(() => playSFX(GameSFX.unitAttackPipeSeam), attackDelayMS);
    };
    actionHandlers.Move = (response, loadFlag) => {
      ahMove?.apply(actionHandlers.Move, [response, loadFlag]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Move", response);
      let unitId = response.unit.units_id;
      movementResponseMap.set(unitId, response);
      var movementDist = response.path.length;
      if (movementDist > 1) {
        playMovementSound(unitId);
      }
    };
    actionHandlers.Capt = (captData) => {
      ahCapt?.apply(actionHandlers.Capt, [captData]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Capt", captData);
      let isValid = captData != undefined;
      if (!isValid) return;
      let finishedCapture = captData.newIncome != null;
      if (!finishedCapture) {
        playSFX(GameSFX.unitCaptureProgress);
        return;
      }
      let myID = getMyID();
      let isSpectator = isPlayerSpectator(myID);
      console.log(isSpectator, captData.buildingInfo.buildings_team, myID);
      let isMyCapture = isSpectator || captData.buildingInfo.buildings_team == myID;
      let sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
      playSFX(sfx);
    };
    actionHandlers.Build = (data) => {
      ahBuild?.apply(actionHandlers.Build, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Build", data);
      let myID = getMyID();
      let isMyBuild = data.newUnit.units_players_id == myID;
      if (!isMyBuild) playSFX(GameSFX.unitSupply);
    };
    actionHandlers.Load = (data) => {
      ahLoad?.apply(actionHandlers.Load, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Load", data);
      playSFX(GameSFX.unitLoad);
    };
    actionHandlers.Unload = (unloadData) => {
      ahUnload?.apply(actionHandlers.Unload, [unloadData]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Unload", unloadData);
      playSFX(GameSFX.unitUnload);
    };
    actionHandlers.Supply = (data) => {
      ahSupply?.apply(actionHandlers.Supply, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Supply", data);
      playSFX(GameSFX.unitSupply);
    };
    actionHandlers.Repair = (data) => {
      ahRepair?.apply(actionHandlers.Repair, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Repair", data);
      playSFX(GameSFX.unitSupply);
    };
    actionHandlers.Hide = (data) => {
      ahHide?.apply(actionHandlers.Hide, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Hide", data);
      playSFX(GameSFX.unitHide);
      stopMovementSound(data.unitId);
    };
    actionHandlers.Unhide = (data) => {
      ahUnhide?.apply(actionHandlers.Unhide, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Unhide", data);
      playSFX(GameSFX.unitUnhide);
      stopMovementSound(data.unitId);
    };
    actionHandlers.Join = (data) => {
      ahJoin?.apply(actionHandlers.Join, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Join", data);
      stopMovementSound(data.joinID);
      stopMovementSound(data.joinedUnit.units_id);
    };
    actionHandlers.Launch = (data) => {
      ahLaunch?.apply(actionHandlers.Launch, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Launch", data);
      playSFX(GameSFX.unitMissileSend);
      setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
    };
    actionHandlers.NextTurn = (data) => {
      ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("NextTurn", data);
      if (data.swapCos) {
        playSFX(GameSFX.tagSwap);
      }
      syncSettingsToMusic();
    };
    actionHandlers.Elimination = (data) => {
      ahElimination?.apply(actionHandlers.Elimination, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Elimination", data);
      debugger;
    };
    actionHandlers.Power = (data) => {
      ahPower?.apply(actionHandlers.Power, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Power", data);
      let coName = data.coName;
      let isAW1 = musicPlayerSettings.gameType === SettingsGameType.AW1;
      let isBH = isBlackHoleCO(coName);
      let isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;
      musicPlayerSettings.themeType = isSuperCOPower
        ? SettingsThemeType.SUPER_CO_POWER
        : SettingsThemeType.CO_POWER;
      if (isAW1) {
        playSFX(GameSFX.powerActivateAW1COP);
        stopThemeSong(4500);
        return;
      }
      if (isSuperCOPower) {
        let sfx = isBH ? GameSFX.powerActivateBHSCOP : GameSFX.powerActivateAllySCOP;
        playSFX(sfx);
        stopThemeSong(850);
        return;
      }
      let sfx = isBH ? GameSFX.powerActivateBHCOP : GameSFX.powerActivateAllyCOP;
      playSFX(sfx);
      stopThemeSong(500);
      if (coName === "colin") {
        console.log("Colin's Gold Rush");
        setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
      }
    };
    actionHandlers.GameOver = () => {
      ahGameOver?.apply(actionHandlers.GameOver, []);
      if (!musicPlayerSettings.isPlaying) return;
      debugger;
    };
  }

  console.log("Running main script for AWBW Improved Music Player!", musicPlayerSettings);
  musicPlayerUI.addToAWBWPage();
  addGameHandlers();
  preloadAllCommonAudio(() => {
    console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");
    loadSettingsFromLocalStorage();
    musicPlayerSettings.themeType = getCurrentThemeType();
    preloadAllExtraAudio(() => {
      console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
    });
  });
})();
