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
    '/* Context Menu */\n.cls-context-menu {\n  /* display: none; */\n  display: flex;\n  top: 40px;\n  flex-direction: column;\n  width: 275px;\n}\n\n.cls-context-menu label {\n  width: 100%;\n  font-size: 14px;\n  background-color: #dedede;\n  padding-top: 5px;\n  padding-bottom: 5px;\n}\n\n.cls-context-menu .cls-horizontal-box {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-evenly;\n  padding-left: 10px;\n  padding-right: 10px;\n}\n\n.cls-context-menu .cls-vertical-box label {\n  background-color: white;\n  font-size: 12px;\n}\n\n.cls-context-menu .cls-vertical-box {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-evenly;\n  padding-left: 10px;\n  padding-right: 10px;\n  width: 100%;\n}\n\n.cls-context-menu image {\n  vertical-align: middle;\n}\n\n.cls-context-menu label[id$="version"] {\n  width: 100%;\n  font-size: 9px;\n  color: #888888;\n  background-color: #f0f0f0;\n}\n';
  styleInject(css_248z$1);

  var css_248z =
    '/* \n * CSS Custom Range Slider\n * https://www.sitepoint.com/css-custom-range-slider/ \n */\n\n.cls-context-menu input[type="range"] {\n  --c: rgb(73, 140, 208); /* active color */\n  --l: 15px; /* line thickness*/\n  --h: 30px; /* thumb height */\n  --w: 20px; /* thumb width */\n\n  width: 90%;\n  height: var(--h); /* needed for Firefox*/\n  --_c: color-mix(in srgb, var(--c), #000 var(--p, 0%));\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  background: none;\n  cursor: pointer;\n  overflow: hidden;\n  display: inline-block;\n}\n.cls-context-menu input:focus-visible,\n.cls-context-menu input:hover {\n  --p: 25%;\n}\n\n/* chromium */\n.cls-context-menu input[type="range" i]::-webkit-slider-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n/* Firefox */\n.cls-context-menu input[type="range"]::-moz-range-thumb {\n  height: var(--h);\n  width: var(--w);\n  background: var(--_c);\n  border-image: linear-gradient(90deg, var(--_c) 50%, #ababab 0) 0 1 / calc(50% - var(--l) / 2) 100vw/0 100vw;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: 0.3s;\n}\n@supports not (color: color-mix(in srgb, red, red)) {\n  .cls-context-menu input {\n    --_c: var(--c);\n  }\n}\n';
  styleInject(css_248z);

  const ORANGE_STAR_COs = new Set(["andy", "max", "sami", "nell", "hachi"]);
  const BLUE_MOON_COs = new Set(["olaf", "grit", "colin", "sasha"]);
  const GREEN_EARTH_COs = new Set(["eagle", "drake", "jess", "javier"]);
  const YELLOW_COMET_COs = new Set(["kanbei", "sonja", "sensei", "grimm"]);
  const BLACK_HOLE_COs = new Set(["flak", "lash", "adder", "hawke", "sturm", "jugger", "koal", "kindle", "vonbolt"]);
  const AW2_ONLY_COs = new Set(["hachi", "colin", "sensei", "jess", "flak", "adder", "lash", "hawke"]);
  const AW_DS_ONLY_COs = new Set(["jake", "rachel", "sasha", "javier", "grimm", "kindle", "jugger", "koal", "vonbolt"]);
  function getAllCONames() {
    return [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
  }
  function areAnimationsEnabled() {
    return typeof gameAnims !== "undefined" ? gameAnims : false;
  }
  function isBlackHoleCO(coName) {
    coName = coName.toLowerCase().replaceAll(" ", "");
    return BLACK_HOLE_COs.has(coName);
  }
  function getRandomCO() {
    const COs = getAllCONames();
    COs.push("map-editor");
    return COs[Math.floor(Math.random() * COs.length)];
  }

  function getIsMapEditor() {
    return window.location.href.indexOf("editmap.php?") > -1;
  }
  function getIsMaintenance() {
    return document.querySelector("#server-maintenance-alert") !== null;
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
  function getMenu() {
    if (getIsMaintenance()) return document.querySelector("#main");
    if (getIsMapEditor()) return document.querySelector("#replay-misc-controls");
    return document.querySelector("#game-map-menu")?.parentNode;
  }
  function getBuildingDiv(buildingID) {
    return document.querySelector(`.game-building[data-building-id='${buildingID}']`);
  }
  const moveAnimationDelayMS = 5;
  function moveDivToOffset(div, dx, dy, steps, ...followUpAnimations) {
    if (steps <= 1) {
      if (!followUpAnimations || followUpAnimations.length === 0) return;
      let nextSet = followUpAnimations.shift()?.then;
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

  var COPowerEnum;
  (function (COPowerEnum) {
    COPowerEnum["NoPower"] = "N";
    COPowerEnum["COPower"] = "Y";
    COPowerEnum["SuperCOPower"] = "S";
  })(COPowerEnum || (COPowerEnum = {}));
  let siloDelayMS = areAnimationsEnabled() ? 3000 : 0;
  let attackDelayMS = areAnimationsEnabled() ? 1000 : 0;
  function getMyUsername() {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu) return null;
    const link = profileMenu.getElementsByClassName("dropdown-menu-link")[0];
    return link.href.split("username=")[1];
  }
  let myID = -1;
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
  function getPlayerInfo(pid) {
    if (getIsMaintenance()) return null;
    return playersInfo[pid];
  }
  function getAllPlayersInfo() {
    if (getIsMaintenance()) return [];
    return Object.values(playersInfo);
  }
  function isPlayerSpectator(pid) {
    if (getIsMaintenance()) return false;
    return !playerKeys.includes(pid);
  }
  function canPlayerActivateCOPower(pid) {
    let info = getPlayerInfo(pid);
    if (!info) return false;
    return info.players_co_power >= info.players_co_max_power;
  }
  function canPlayerActivateSuperCOPower(pid) {
    let info = getPlayerInfo(pid);
    if (!info) return false;
    return info.players_co_power >= info.players_co_max_spower;
  }
  function getBuildingInfo(x, y) {
    return buildingsInfo[x][y];
  }
  function isReplayActive() {
    if (getIsMaintenance()) return false;
    const replayControls = getReplayControls();
    let replayOpen = replayControls.style.display !== "none";
    return replayOpen;
  }
  function hasGameEnded() {
    if (getIsMaintenance()) return false;
    let numberOfRemainingPlayers = Object.values(playersInfo).filter((info) => info.players_eliminated === "N").length;
    return numberOfRemainingPlayers === 1;
  }
  function getCurrentGameDay() {
    if (getIsMaintenance()) return -1;
    if (!isReplayActive()) return gameDay;
    let replayData = Object.values(replay);
    if (replayData.length === 0) return gameDay;
    let lastData = replayData[replayData.length - 1];
    if (typeof lastData === "undefined") return gameDay;
    if (typeof lastData.day === "undefined") return gameDay;
    return lastData.day;
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
    static get isEliminated() {
      return this.info?.players_eliminated === "Y";
    }
    static get coName() {
      if (getIsMapEditor()) return "map-editor";
      let myID = getMyID();
      let myInfo = getPlayerInfo(myID);
      let myLoss = myInfo?.players_eliminated === "Y";
      if (myLoss) return "defeat";
      if (hasGameEnded()) {
        if (isPlayerSpectator(myID)) return "victory";
        return myLoss ? "defeat" : "victory";
      }
      return this.info?.co_name;
    }
  }
  function getAllPlayingCONames() {
    if (getIsMapEditor()) return new Set(["map-editor"]);
    let allPlayers = new Set(getAllPlayersInfo().map((info) => info.co_name));
    let allTagPlayers = getAllTagCONames();
    return new Set([...allPlayers, ...allTagPlayers]);
  }
  function isTagGame() {
    return typeof tagsInfo !== "undefined" && tagsInfo;
  }
  function getAllTagCONames() {
    if (!isTagGame()) return new Set();
    return new Set(Object.values(tagsInfo).map((tag) => tag.co_name));
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
    SettingsGameType["RBC"] = "RBC";
    SettingsGameType["DS"] = "DS";
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
    static __gameType = SettingsGameType.DS;
    static __alternateThemeDay = 15;
    static __randomThemes = false;
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
    static set themeType(val) {
      if (this.__themeType === val) return;
      this.__themeType = val;
      this.onSettingChangeEvent("themeType");
    }
    static get themeType() {
      return this.__themeType;
    }
    static set alternateThemeDay(val) {
      if (this.__alternateThemeDay === val) return;
      this.__alternateThemeDay = val;
      this.onSettingChangeEvent("alternateThemeDay");
    }
    static get alternateThemeDay() {
      return this.__alternateThemeDay;
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
  function loadSettingsFromLocalStorage() {
    let storageData = localStorage.getItem(STORAGE_KEY);
    if (!storageData || storageData === "undefined") {
      console.log("[AWBW Music Player] No saved settings found, storing defaults");
      storageData = updateSettingsInLocalStorage();
    }
    musicPlayerSettings.fromJSON(storageData);
    onSettingsChangeListeners.forEach((fn) => fn("all", true));
    addSettingsChangeListener(onSettingsChange$2);
    console.debug("[MP] Settings loaded from storage:", storageData);
  }
  function onSettingsChange$2(_key, _isFirstLoad) {
    if (_key === "themeType" || _key === "currentRandomCO") return "";
    updateSettingsInLocalStorage();
  }
  function updateSettingsInLocalStorage() {
    let jsonSettings = musicPlayerSettings.toJSON();
    localStorage.setItem(STORAGE_KEY, jsonSettings);
    console.debug("[MP] Saving settings...", jsonSettings);
    return jsonSettings;
  }

  const BASE_URL = "https://developerjose.netlify.app";
  const BASE_MUSIC_URL = BASE_URL + "/music";
  const BASE_SFX_URL = BASE_MUSIC_URL + "/sfx";
  const NEUTRAL_IMG_URL = BASE_URL + "/img/music-player-icon.png";
  const PLAYING_IMG_URL = BASE_URL + "/img/music-player-playing.gif";
  const VICTORY_THEME_URL = BASE_MUSIC_URL + "/t-victory.ogg";
  const DEFEAT_THEME_URL = BASE_MUSIC_URL + "/t-defeat.ogg";
  const MAINTENANCE_THEME_URL = BASE_MUSIC_URL + "/t-maintenance.ogg";
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
    [SettingsGameType.AW1, new Set(["sturm"])],
    [SettingsGameType.AW2, new Set(["sturm"])],
    [SettingsGameType.RBC, new Set(["andy", "olaf", "eagle", "drake", "grit", "kanbei", "sonja", "sturm"])],
    [SettingsGameType.DS, new Set(["sturm", "vonbolt"])],
  ]);
  const specialLoops = new Set(["vonbolt"]);
  function getAlternateMusicFilename(coName, gameType, themeType) {
    if (!alternateThemes.has(gameType)) return;
    let alternateThemesSet = alternateThemes.get(gameType);
    let faction = isBlackHoleCO(coName) ? "bh" : "ally";
    let isPowerActive = themeType !== SettingsThemeType.REGULAR;
    if (gameType === SettingsGameType.RBC && isPowerActive) {
      return `t-${faction}-${themeType}`;
    }
    if (!alternateThemesSet?.has(coName) || isPowerActive) {
      return;
    }
    if (coName === "andy" && gameType == SettingsGameType.RBC) {
      return isPowerActive ? "t-clone-andy-cop" : "t-clone-andy";
    }
    return `t-${coName}-2`;
  }
  function getMusicFilename(coName, gameType, themeType, useAlternateTheme) {
    if (coName === "map-editor") return "t-map-editor";
    if (useAlternateTheme) {
      let alternateFilename = getAlternateMusicFilename(coName, gameType, themeType);
      if (alternateFilename) return alternateFilename;
    }
    let isPowerActive = themeType !== SettingsThemeType.REGULAR;
    if (!isPowerActive || gameType === SettingsGameType.AW1) {
      return `t-${coName}`;
    }
    let isCOInRBC = !AW_DS_ONLY_COs.has(coName);
    if (gameType === SettingsGameType.RBC && isCOInRBC) {
      return `t-${coName}-cop`;
    }
    let faction = isBlackHoleCO(coName) ? "bh" : "ally";
    return `t-${faction}-${themeType}`;
  }
  function getMusicURL(coName, gameType, themeType, useAlternateTheme) {
    if (!gameType) gameType = musicPlayerSettings.gameType;
    if (!themeType) themeType = musicPlayerSettings.themeType;
    if (!useAlternateTheme) useAlternateTheme = getCurrentGameDay() >= musicPlayerSettings.alternateThemeDay;
    coName = coName.toLowerCase().replaceAll(" ", "");
    if (coName === "victory") return VICTORY_THEME_URL;
    if (coName === "defeat") return DEFEAT_THEME_URL;
    if (gameType !== SettingsGameType.DS && AW_DS_ONLY_COs.has(coName)) gameType = SettingsGameType.DS;
    if (gameType === SettingsGameType.AW1 && AW2_ONLY_COs.has(coName)) gameType = SettingsGameType.AW2;
    let gameDir = gameType;
    if (!gameDir.startsWith("AW")) gameDir = "AW_" + gameDir;
    let filename = getMusicFilename(coName, gameType, themeType, useAlternateTheme);
    let url = `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`;
    return url.toLowerCase().replaceAll("_", "-").replaceAll(" ", "");
  }
  function getCONameFromURL(url) {
    let parts = url.split("/");
    let filename = parts[parts.length - 1];
    let coName = filename.split(".")[0].split("t-")[1];
    return coName;
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
  function hasSpecialLoop(srcURL) {
    let coName = getCONameFromURL(srcURL);
    return specialLoops.has(coName);
  }
  function getCurrentThemeURLs() {
    let coNames = getAllPlayingCONames();
    let audioList = new Set();
    coNames.forEach((name) => {
      let regularURL = getMusicURL(name, musicPlayerSettings.gameType, SettingsThemeType.REGULAR, false);
      let powerURL = getMusicURL(name, musicPlayerSettings.gameType, SettingsThemeType.CO_POWER, false);
      let superPowerURL = getMusicURL(name, musicPlayerSettings.gameType, SettingsThemeType.SUPER_CO_POWER, false);
      let alternateURL = getMusicURL(name, musicPlayerSettings.gameType, musicPlayerSettings.themeType, true);
      audioList.add(regularURL);
      audioList.add(alternateURL);
      audioList.add(powerURL);
      audioList.add(superPowerURL);
      if (specialLoops.has(name)) audioList.add(regularURL.replace(".ogg", "-loop.ogg"));
    });
    return audioList;
  }
  function getAllCurrentThemesExtraAudioURLs() {
    let audioURLs = new Set();
    let coNames = getAllPlayingCONames();
    for (const gameType in SettingsGameType) {
      for (const themeType in SettingsThemeType) {
        const gameTypeEnum = gameType;
        const themeTypeEnum = themeType;
        coNames?.forEach((name) => audioURLs.add(getMusicURL(name, gameTypeEnum, themeTypeEnum)));
      }
    }
    return audioURLs;
  }
  function getAllSoundEffectURLs() {
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
  function getAllThemeURLs() {
    let allSoundURLs = new Set();
    for (let coName of getAllCONames()) {
      for (let gameType of Object.values(SettingsGameType)) {
        for (let themeType of Object.values(SettingsThemeType)) {
          let url = getMusicURL(coName, gameType, themeType, false);
          let alternateURL = getMusicURL(coName, gameType, themeType, true);
          allSoundURLs.add(url);
          allSoundURLs.add(alternateURL);
          if (themeType === SettingsThemeType.REGULAR && specialLoops.has(coName))
            allSoundURLs.add(url.replace(".ogg", "-loop.ogg"));
        }
      }
    }
    return allSoundURLs;
  }

  class CustomMenuSettingsUI {
    root;
    menuElements = new Map();
    inputElements = [];
    isSettingsMenuOpen = false;
    prefix = "";
    parentHoverText = "";
    constructor(prefix, buttonImageURL, hoverText = "") {
      this.prefix = prefix;
      this.parentHoverText = hoverText;
      this.root = document.createElement("div");
      this.root.id = prefix + "-parent";
      this.root.classList.add("game-tools-btn");
      this.root.style.width = "34px";
      this.root.style.height = "30px";
      this.root.style.borderLeft = "none";
      let hoverSpan = document.createElement("span");
      hoverSpan.id = prefix + "-hover-span";
      hoverSpan.classList.add("game-tools-btn-text", "small_text");
      hoverSpan.innerText = hoverText;
      this.root.appendChild(hoverSpan);
      this.menuElements.set("hover", hoverSpan);
      let bgDiv = document.createElement("div");
      bgDiv.id = prefix + "-background";
      bgDiv.classList.add("game-tools-bg");
      bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
      this.root.appendChild(bgDiv);
      this.menuElements.set("bg", bgDiv);
      bgDiv.addEventListener("mouseover", () => this.setHoverText(this.parentHoverText));
      bgDiv.addEventListener("mouseout", () => this.setHoverText(""));
      let btnLink = document.createElement("a");
      btnLink.id = prefix + "-link";
      btnLink.classList.add("norm2");
      bgDiv.appendChild(btnLink);
      let btnImg = document.createElement("img");
      btnImg.id = prefix + "-link-img";
      btnImg.src = buttonImageURL;
      btnLink.appendChild(btnImg);
      this.menuElements.set("img", btnImg);
      let contextMenu = document.createElement("div");
      contextMenu.id = prefix + "-context-menu";
      contextMenu.classList.add("cls-context-menu");
      this.root.appendChild(contextMenu);
      this.menuElements.set("context-menu", contextMenu);
      this.root.addEventListener("contextmenu", (event) => {
        let element = event.target;
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
      document.addEventListener("click", (event) => {
        let elmnt = event.target;
        if (elmnt.id.startsWith(prefix)) return;
        this.closeContextMenu();
      });
    }
    addToAWBWPage() {
      getMenu()?.appendChild(this.root);
    }
    setHoverText(text, replaceParent = false) {
      let hoverSpan = this.menuElements.get("hover");
      if (!hoverSpan) return;
      hoverSpan.innerText = text;
      if (replaceParent) this.parentHoverText = text;
    }
    setProgress(progress) {
      let bgDiv = this.menuElements.get("bg");
      if (!bgDiv) return;
      bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff " + String(progress) + "% , #888888 0%)";
    }
    setImage(imageURL) {
      let btnImg = this.menuElements.get("img");
      btnImg.src = imageURL;
    }
    addEventListener(type, listener) {
      let div = this.menuElements.get("bg");
      div?.addEventListener(type, listener);
    }
    openContextMenu() {
      let contextMenu = this.menuElements.get("context-menu");
      if (!contextMenu) return;
      contextMenu.style.display = "flex";
      this.isSettingsMenuOpen = true;
    }
    closeContextMenu() {
      let contextMenu = this.menuElements.get("context-menu");
      if (!contextMenu) return;
      contextMenu.style.display = "none";
      this.isSettingsMenuOpen = false;
    }
    addSlider(name, min, max, step, hoverText = "") {
      let contextMenu = this.menuElements.get("context-menu");
      let id = name.toLowerCase().replace(" ", "-");
      let label = document.createElement("label");
      label.id = this.prefix + "-" + id + "-label";
      contextMenu?.appendChild(label);
      let slider = document.createElement("input");
      slider.id = `${this.prefix}-${id}-slider`;
      slider.type = "range";
      slider.min = String(min);
      slider.max = String(max);
      slider.step = String(step);
      this.inputElements.push(slider);
      slider.addEventListener("input", (e) => {
        let displayValue = slider.value;
        if (max === 1) displayValue = Math.round(parseFloat(displayValue) * 100) + "%";
        label.innerText = `${name}: ${displayValue}`;
      });
      contextMenu?.appendChild(slider);
      slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
      slider.addEventListener("mouseout", () => this.setHoverText(""));
      return slider;
    }
    addRadioButton(name, groupName, hoverText = "") {
      const contextMenu = this.menuElements.get("context-menu");
      let id = name.toLowerCase().replace(" ", "-");
      if (!this.menuElements.has(groupName)) {
        const groupLabel = document.createElement("label");
        groupLabel.id = this.prefix + "-" + groupName + "-label";
        groupLabel.innerText = groupName;
        contextMenu?.appendChild(groupLabel);
        const group = document.createElement("div");
        group.id = this.prefix + "-" + groupName;
        group.classList.add("cls-horizontal-box");
        this.menuElements.set(groupName, group);
        contextMenu?.appendChild(group);
      }
      const radioGroupDiv = this.menuElements.get(groupName);
      const radioBox = document.createElement("div");
      radioBox.id = this.prefix + "-" + id;
      radioBox.classList.add("cls-vertical-box");
      radioBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
      radioBox.addEventListener("mouseout", () => this.setHoverText(""));
      const radio = document.createElement("input");
      radio.id = this.prefix + "-" + id + "-radio";
      radio.type = "radio";
      radio.name = groupName;
      radioBox.appendChild(radio);
      this.inputElements.push(radio);
      const label = document.createElement("label");
      label.id = this.prefix + "-" + id + "-label";
      label.innerText = name;
      radioBox.appendChild(label);
      radioGroupDiv?.appendChild(radioBox);
      return radio;
    }
    addVersion(version) {
      let contextMenu = this.menuElements.get("context-menu");
      let versionDiv = document.createElement("label");
      versionDiv.id = this.prefix + "-version";
      versionDiv.innerText = `VERSION: ${version}`;
      contextMenu?.appendChild(versionDiv);
    }
    updateAllInputLabels() {
      const event = new Event("input");
      this.inputElements.forEach((input) => {
        input.dispatchEvent(event);
      });
    }
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

  addSettingsChangeListener(onSettingsChange$1);
  function onMusicBtnClick(_event) {
    musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
  }
  function onSettingsChange$1(key, isFirstLoad) {
    if (isFirstLoad) {
      volumeSlider.value = musicPlayerSettings.volume.toString();
      sfxVolumeSlider.value = musicPlayerSettings.sfxVolume.toString();
      uiVolumeSlider.value = musicPlayerSettings.uiVolume.toString();
      daySlider.value = musicPlayerSettings.alternateThemeDay.toString();
      let radio = gameTypeRadioMap.get(musicPlayerSettings.gameType);
      if (radio) radio.checked = true;
      radioNormal.checked = !musicPlayerSettings.randomThemes;
      radioRandom.checked = musicPlayerSettings.randomThemes;
      musicPlayerUI.updateAllInputLabels();
    }
    if (musicPlayerSettings.isPlaying) {
      musicPlayerUI.setHoverText("Stop Tunes", true);
      musicPlayerUI.setImage(PLAYING_IMG_URL);
    } else {
      musicPlayerUI.setHoverText("Play Tunes", true);
      musicPlayerUI.setImage(NEUTRAL_IMG_URL);
    }
  }
  const parseInputFloat = (event) => parseFloat(event.target.value);
  const parseInputInt = (event) => parseInt(event.target.value);
  const musicPlayerUI = new CustomMenuSettingsUI("music-player", NEUTRAL_IMG_URL, "Play Tunes");
  musicPlayerUI.addEventListener("click", onMusicBtnClick);
  var InputName;
  (function (InputName) {
    InputName["Volume"] = "Music Volume";
    InputName["SFX_Volume"] = "SFX Volume";
    InputName["UI_Volume"] = "UI Volume";
    InputName["Alternate_Day"] = "Alternate Themes Start On Day";
  })(InputName || (InputName = {}));
  var InputDescription;
  (function (InputDescription) {
    InputDescription["Volume"] = "Adjust the volume of the CO theme music.";
    InputDescription["SFX_Volume"] = "Adjust the volume of the unit movement, CO power, and other misc. sound effects.";
    InputDescription["UI_Volume"] =
      "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.";
    InputDescription["Alternate_Day"] =
      "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?";
    InputDescription["AW1"] = "Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!";
    InputDescription["AW2"] = "Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.";
    InputDescription["DS"] =
      "Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though.";
    InputDescription["RBC"] = "Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!";
    InputDescription["Normal_Themes"] = "Play the music depending on who the current CO is.";
    InputDescription["Random_Themes"] = "Play random music every turn.";
  })(InputDescription || (InputDescription = {}));
  let volumeSlider = musicPlayerUI.addSlider(InputName.Volume, 0, 1, 0.005, InputDescription.Volume);
  let sfxVolumeSlider = musicPlayerUI.addSlider(InputName.SFX_Volume, 0, 1, 0.005, InputDescription.SFX_Volume);
  let uiVolumeSlider = musicPlayerUI.addSlider(InputName.UI_Volume, 0, 1, 0.005, InputDescription.UI_Volume);
  volumeSlider.addEventListener("input", (event) => (musicPlayerSettings.volume = parseInputFloat(event)));
  sfxVolumeSlider.addEventListener("input", (event) => (musicPlayerSettings.sfxVolume = parseInputFloat(event)));
  uiVolumeSlider.addEventListener("input", (event) => (musicPlayerSettings.uiVolume = parseInputFloat(event)));
  let daySlider = musicPlayerUI.addSlider(InputName.Alternate_Day, 0, 30, 1, InputDescription.Alternate_Day);
  daySlider.addEventListener("input", (event) => (musicPlayerSettings.alternateThemeDay = parseInputInt(event)));
  const gameTypeRadioMap = new Map();
  for (const gameType of Object.values(SettingsGameType)) {
    let description = InputDescription[gameType];
    let radio = musicPlayerUI.addRadioButton(gameType, "Soundtrack", description);
    gameTypeRadioMap.set(gameType, radio);
    radio.parentElement?.addEventListener("input", (_e) => (musicPlayerSettings.gameType = gameType));
  }
  let radioNormal = musicPlayerUI.addRadioButton("Off", "Random Themes", InputDescription.Normal_Themes);
  let radioRandom = musicPlayerUI.addRadioButton("On", "Random Themes", InputDescription.Random_Themes);
  radioNormal.parentElement?.addEventListener("input", (_e) => (musicPlayerSettings.randomThemes = false));
  radioRandom.parentElement?.addEventListener("input", (_e) => (musicPlayerSettings.randomThemes = true));
  musicPlayerUI.addVersion(versions.music_player);

  let currentThemeKey = "";
  const urlAudioMap = new Map();
  const unitIDAudioMap = new Map();
  let currentlyDelaying = false;
  let randomThemeTimeout;
  function whenAudioLoadsPauseIt(event) {
    event.target.pause();
  }
  function whenAudioLoadsPlayIt(event) {
    let audio = event.target;
    audio.volume = musicPlayerSettings.volume;
    playThemeSong();
  }
  const specialLoopMap = new Map();
  function createNewThemeAudio(srcURL) {
    let audio = new Audio(srcURL);
    if (hasSpecialLoop(srcURL)) {
      console.log("[AWBW Music Player] Special loop detected: ", srcURL);
      audio.loop = false;
      audio.addEventListener("ended", (event) => {
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
  addSettingsChangeListener(onSettingsChange);
  function playMusicURL(srcURL, startFromBeginning = false) {
    if (!musicPlayerSettings.isPlaying) return;
    let specialLoopURL = specialLoopMap.get(srcURL);
    if (specialLoopURL) srcURL = specialLoopURL;
    if (srcURL !== currentThemeKey) {
      stopThemeSong();
      currentThemeKey = srcURL;
      console.log("[AWBW Music Player] Now Playing: ", srcURL);
    }
    let nextTheme = urlAudioMap.get(srcURL);
    if (!nextTheme) {
      console.debug("[AWBW Music Player] Loading new song", srcURL);
      let audio = createNewThemeAudio(srcURL);
      audio.addEventListener("canplaythrough", whenAudioLoadsPlayIt, { once: true });
      return;
    }
    if (startFromBeginning) nextTheme.currentTime = 0;
    nextTheme.loop = !hasSpecialLoop(srcURL);
    if (musicPlayerSettings.randomThemes && !randomThemeTimeout) {
      const songDurationMS = nextTheme.duration * 1000;
      randomThemeTimeout = setTimeout(() => {
        musicPlayerSettings.currentRandomCO = getRandomCO();
        randomThemeTimeout = null;
        playThemeSong(true);
      }, songDurationMS);
    }
    nextTheme.volume = musicPlayerSettings.volume;
    nextTheme.play();
  }
  function playOneShotURL(srcURL, volume) {
    if (!musicPlayerSettings.isPlaying) return;
    let soundInstance = new Audio(srcURL);
    soundInstance.currentTime = 0;
    soundInstance.volume = volume;
    soundInstance.play();
  }
  function playThemeSong(startFromBeginning = false) {
    if (!musicPlayerSettings.isPlaying) return;
    if (currentlyDelaying) return;
    let coName = currentPlayer.coName;
    if (!coName) coName = "map-editor";
    let isEndTheme = coName === "victory" || coName === "defeat";
    if (musicPlayerSettings.randomThemes && !isEndTheme) {
      coName = musicPlayerSettings.currentRandomCO;
    }
    playMusicURL(getMusicURL(coName), startFromBeginning);
  }
  function stopThemeSong(delayMS = 0) {
    if (delayMS > 0) {
      setTimeout(() => {
        currentlyDelaying = false;
        playThemeSong();
      }, delayMS);
      currentlyDelaying = true;
    }
    if (randomThemeTimeout) {
      clearTimeout(randomThemeTimeout);
      randomThemeTimeout = null;
    }
    if (!urlAudioMap.has(currentThemeKey)) return;
    let currentTheme = urlAudioMap.get(currentThemeKey);
    if (!currentTheme || currentTheme.paused) return;
    console.debug("[AWBW Music Player] Pausing: ", currentTheme.src);
    if (currentTheme.readyState !== HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      currentTheme.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
      return;
    }
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
    if (!movementAudio) return;
    movementAudio.currentTime = 0;
    movementAudio.loop = false;
    movementAudio.volume = musicPlayerSettings.sfxVolume;
    movementAudio.play();
  }
  function stopMovementSound(unitId, rolloff = true) {
    if (!musicPlayerSettings.isPlaying) return;
    if (!unitIDAudioMap.has(unitId)) return;
    let movementAudio = unitIDAudioMap.get(unitId);
    if (!movementAudio || movementAudio.paused) return;
    if (movementAudio.readyState != HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      movementAudio.addEventListener("canplaythrough", whenAudioLoadsPauseIt, { once: true });
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
    if (sfx.startsWith("ui")) {
      vol = musicPlayerSettings.uiVolume;
    } else if (sfx.startsWith("power")) {
      vol = musicPlayerSettings.volume;
    }
    if (!urlAudioMap.has(sfxURL)) {
      urlAudioMap.set(sfxURL, new Audio(sfxURL));
    }
    let audio = urlAudioMap.get(sfxURL);
    if (!audio) return;
    audio.volume = vol;
    audio.currentTime = 0;
    audio.play();
  }
  function stopAllSounds() {
    stopThemeSong();
    stopAllMovementSounds();
    for (let audio of urlAudioMap.values()) {
      audio.volume = 0;
    }
  }
  function stopAllMovementSounds() {
    for (let unitId of unitIDAudioMap.keys()) {
      stopMovementSound(unitId, false);
    }
  }
  function preloadAllCommonAudio(afterPreloadFunction) {
    let audioList = getCurrentThemeURLs();
    audioList.add(getSoundEffectURL(GameSFX.uiCursorMove));
    audioList.add(getSoundEffectURL(GameSFX.uiUnitSelect));
    preloadAudios(audioList, afterPreloadFunction);
    console.debug("[AWBW Music Player] Pre-loading common audio", audioList);
  }
  function preloadAllExtraAudio(afterPreloadFunction) {
    if (getIsMapEditor()) return;
    let audioList = getAllSoundEffectURLs();
    audioList = new Set([...audioList, ...getAllCurrentThemesExtraAudioURLs()]);
    console.debug("[AWBW Music Player] Pre-loading extra audio", audioList);
    preloadAudios(audioList, afterPreloadFunction);
  }
  function preloadAudios(audioURLs, afterPreloadFunction = () => {}) {
    let numLoadedAudios = 0;
    let onAudioPreload = (event) => {
      let audio = event.target;
      numLoadedAudios++;
      let loadPercentage = (numLoadedAudios / audioURLs.size) * 100;
      musicPlayerUI.setProgress(loadPercentage);
      if (numLoadedAudios >= audioURLs.size) {
        numLoadedAudios = 0;
        if (afterPreloadFunction) afterPreloadFunction();
      }
      if (event.type === "error") {
        console.debug("[AWBW Music Player] Could not pre-load: ", audio.src, ", code=", audio.networkState);
        return;
      }
      if (!urlAudioMap.has(audio.src)) {
        console.error("[AWBW Music Player] Race condition on pre-load! Please report this bug!", audio.src);
      }
    };
    audioURLs.forEach((url) => {
      if (urlAudioMap.has(url)) {
        numLoadedAudios++;
        return;
      }
      let audio = createNewThemeAudio(url);
      audio.addEventListener("canplaythrough", onAudioPreload, { once: true });
      audio.addEventListener("error", onAudioPreload, { once: true });
    });
  }
  let allThemesPreloaded = false;
  function onSettingsChange(key, isFirstLoad) {
    if (isFirstLoad) return;
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
        setTimeout(() => playThemeSong(), 500);
        break;
      case "themeType":
        let restartMusic = musicPlayerSettings.themeType !== SettingsThemeType.REGULAR;
        playThemeSong(restartMusic);
        break;
      case "randomThemes":
        if (!musicPlayerSettings.randomThemes) {
          playThemeSong();
          return;
        }
        if (!allThemesPreloaded) {
          console.log("[AWBW Music Player] Pre-loading all themes since random themes are enabled");
          let audioList = getAllThemeURLs();
          allThemesPreloaded = true;
          preloadAudios(audioList, () => console.log("[AWBW Music Player] All themes have been pre-loaded!"));
        }
        if (randomThemeTimeout) {
          clearTimeout(randomThemeTimeout);
          randomThemeTimeout = null;
        }
        musicPlayerSettings.currentRandomCO = getRandomCO();
        playThemeSong(true);
        break;
      case "volume": {
        let currentTheme = urlAudioMap.get(currentThemeKey);
        if (currentTheme) currentTheme.volume = musicPlayerSettings.volume;
        break;
      }
    }
  }

  function getCursorMoveFn() {
    if (getIsMapEditor()) {
      return typeof designMapEditor !== "undefined" ? designMapEditor.updateCursor : null;
    }
    return typeof updateCursor !== "undefined" ? updateCursor : null;
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
  MenuClickType.None;
  let menuOpen = false;
  let visibilityMap = new Map();
  let movementResponseMap = new Map();
  let ahCursorMove = getCursorMoveFn();
  let ahShowEventScreen = getShowEventScreenFn();
  let ahOpenMenu = getOpenMenuFn();
  let ahCloseMenu = getCloseMenuFn();
  let ahUnitClick = getUnitClickFn();
  let ahWait = getWaitFn();
  let ahAnimUnit = getAnimUnitFn();
  let ahAnimExplosion = getAnimExplosionFn();
  let ahFog = getFogFn();
  let ahFire = getFireFn();
  let ahAttackSeam = getAttackSeamFn();
  let ahMove = getMoveFn();
  let ahCapt = getCaptFn();
  let ahBuild = getBuildFn();
  let ahLoad = getLoadFn();
  let ahUnload = getUnloadFn();
  let ahSupply = getSupplyFn();
  let ahRepair = getRepairFn();
  let ahHide = getHideFn();
  let ahUnhide = getUnhideFn();
  let ahJoin = getJoinFn();
  let ahLaunch = getLaunchFn();
  let ahNextTurn = getNextTurnFn();
  let ahPower = getPowerFn();
  function addHandlers() {
    if (getIsMapEditor()) {
      addMapEditorHandlers();
      return;
    }
    addReplayHandlers();
    addGameHandlers();
  }
  function addMapEditorHandlers() {
    designMapEditor.updateCursor = onCursorMove;
  }
  function refreshMusic(playDelayMS = 0) {
    stopAllMovementSounds();
    visibilityMap.clear();
    musicPlayerSettings.currentRandomCO = getRandomCO();
    setTimeout(() => {
      musicPlayerSettings.themeType = getCurrentThemeType();
      playThemeSong();
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
    const replayChangeTurn = () => refreshMusic(500);
    replayBackwardActionBtn.addEventListener("click", replayChangeTurn);
    replayForwardActionBtn.addEventListener("click", replayChangeTurn);
    replayForwardBtn.addEventListener("click", replayChangeTurn);
    replayBackwardBtn.addEventListener("click", replayChangeTurn);
    replayOpenBtn.addEventListener("click", replayChangeTurn);
    replayCloseBtn.addEventListener("click", replayChangeTurn);
    replayDaySelectorCheckBox.addEventListener("click", replayChangeTurn);
  }
  function addGameHandlers() {
    updateCursor = onCursorMove;
    showEventScreen = onShowEventScreen;
    openMenu = onOpenMenu;
    closeMenu = onCloseMenu;
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
    actionHandlers.Power = onPower;
  }
  function onCursorMove(cursorX, cursorY) {
    ahCursorMove?.apply(ahCursorMove, [cursorX, cursorY]);
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
  function onShowEventScreen(event) {
    ahShowEventScreen?.apply(ahShowEventScreen, [event]);
    if (!musicPlayerSettings.isPlaying) return;
    playThemeSong();
  }
  function onOpenMenu(menu, x, y) {
    ahOpenMenu?.apply(openMenu, [menu, x, y]);
    if (!musicPlayerSettings.isPlaying) return;
    menuOpen = true;
    playSFX(GameSFX.uiMenuOpen);
    let menuOptions = document.getElementsByClassName("menu-option");
    for (var i = 0; i < menuOptions.length; i++) {
      menuOptions[i].addEventListener("mouseenter", (_e) => playSFX(GameSFX.uiMenuMove));
      menuOptions[i].addEventListener("click", (_e) => {
        menuOpen = false;
        playSFX(GameSFX.uiMenuOpen);
      });
    }
  }
  function onCloseMenu() {
    ahCloseMenu?.apply(closeMenu, []);
    if (!musicPlayerSettings.isPlaying) return;
    if (menuOpen) {
      playSFX(GameSFX.uiMenuClose);
    }
    menuOpen = false;
    stopAllMovementSounds();
  }
  function onUnitClick(clicked) {
    ahUnitClick?.apply(unitClickHandler, [clicked]);
    if (!musicPlayerSettings.isPlaying) return;
    MenuClickType.Unit;
    playSFX(GameSFX.uiUnitSelect);
  }
  function onUnitWait(unitId) {
    ahWait?.apply(waitUnit, [unitId]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Wait", unitId, getUnitName(unitId));
    if (movementResponseMap.has(unitId)) {
      let response = movementResponseMap.get(unitId);
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
    if (!isValidUnit(unitId) || !path || !i) return;
    if (i >= path.length) return;
    if (visibilityMap.has(unitId)) return;
    let unitVisible = path[i].unit_visible;
    if (!unitVisible) {
      visibilityMap.set(unitId, unitVisible);
      setTimeout(() => stopMovementSound(unitId, false), 1000);
    }
  }
  function onAnimExplosion(unit) {
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
  }
  function onFogUpdate(x, y, mType, neighbours, unitVisible, change, delay) {
    ahFog?.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Fog", x, y, mType, neighbours, unitVisible, change, delay);
    let unitInfo = getUnitInfoFromCoords(x, y);
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
    console.debug("[MP] Fire", response);
    let attackerID = response.copValues.attacker.playerId;
    let defenderID = response.copValues.defender.playerId;
    stopMovementSound(response.attacker.units_id, false);
    stopMovementSound(response.defender.units_id, false);
    let couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
    let couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
    let couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
    let couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);
    ahFire?.apply(actionHandlers.Fire, [response]);
    var delay = areAnimationsEnabled() ? 750 : 0;
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
    setTimeout(() => {
      if (madeSCOPAvailable) playSFX(GameSFX.powerSCOPAvailable);
      else if (madeCOPAvailable) playSFX(GameSFX.powerCOPAvailable);
    }, delay);
  }
  function wiggleTile(div, startDelay = 0) {
    let stepsX = 12;
    let stepsY = 4;
    let deltaX = 0.2;
    let deltaY = 0.05;
    let wiggleAnimation = () => {
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
    let seamWasDestroyed = response.seamHp <= 0;
    if (areAnimationsEnabled()) {
      let x = response.seamX;
      let y = response.seamY;
      let pipeSeamInfo = getBuildingInfo(x, y);
      let pipeSeamDiv = getBuildingDiv(pipeSeamInfo.buildings_id);
      let wiggleDelay = seamWasDestroyed ? 0 : attackDelayMS;
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
    console.debug("[MP] Move", response, loadFlag);
    let unitId = response.unit.units_id;
    movementResponseMap.set(unitId, response);
    var movementDist = response.path.length;
    if (movementDist > 1) {
      stopMovementSound(unitId, false);
      playMovementSound(unitId);
    }
  }
  function onCapture(data) {
    ahCapt?.apply(actionHandlers.Capt, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Capt", data);
    let finishedCapture = data.newIncome != null;
    if (!finishedCapture) {
      playSFX(GameSFX.unitCaptureProgress);
      return;
    }
    let myID = getMyID();
    let isSpectator = isPlayerSpectator(myID);
    let isMyCapture = data.buildingInfo.buildings_team == myID || isSpectator;
    let sfx = isMyCapture ? GameSFX.unitCaptureAlly : GameSFX.unitCaptureEnemy;
    playSFX(sfx);
  }
  function onBuild(data) {
    ahBuild?.apply(actionHandlers.Build, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Build", data);
    let myID = getMyID();
    let isMyBuild = data.newUnit.units_players_id == myID;
    if (!isMyBuild) playSFX(GameSFX.unitSupply);
  }
  function onLoad(data) {
    ahLoad?.apply(actionHandlers.Load, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Load", data);
    playSFX(GameSFX.unitLoad);
  }
  function onUnload(data) {
    ahUnload?.apply(actionHandlers.Unload, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Unload", data);
    playSFX(GameSFX.unitUnload);
  }
  function onSupply(data) {
    ahSupply?.apply(actionHandlers.Supply, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Supply", data);
    playSFX(GameSFX.unitSupply);
  }
  function onRepair(data) {
    ahRepair?.apply(actionHandlers.Repair, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Repair", data);
    playSFX(GameSFX.unitSupply);
  }
  function onHide(data) {
    ahHide?.apply(actionHandlers.Hide, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Hide", data);
    playSFX(GameSFX.unitHide);
    stopMovementSound(data.unitId);
  }
  function onUnhide(data) {
    ahUnhide?.apply(actionHandlers.Unhide, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Unhide", data);
    playSFX(GameSFX.unitUnhide);
    stopMovementSound(data.unitId);
  }
  function onJoin(data) {
    ahJoin?.apply(actionHandlers.Join, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Join", data);
    stopMovementSound(data.joinID);
    stopMovementSound(data.joinedUnit.units_id);
  }
  function onLaunch(data) {
    ahLaunch?.apply(actionHandlers.Launch, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Launch", data);
    playSFX(GameSFX.unitMissileSend);
    setTimeout(() => playSFX(GameSFX.unitMissileHit), siloDelayMS);
  }
  function onNextTurn(data) {
    ahNextTurn?.apply(actionHandlers.NextTurn, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] NextTurn", data);
    if (data.swapCos) {
      playSFX(GameSFX.tagSwap);
    }
    refreshMusic();
  }
  function onPower(data) {
    ahPower?.apply(actionHandlers.Power, [data]);
    if (!musicPlayerSettings.isPlaying) return;
    console.debug("[MP] Power", data);
    let coName = data.coName;
    let isBH = isBlackHoleCO(coName);
    let isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;
    musicPlayerSettings.themeType = isSuperCOPower ? SettingsThemeType.SUPER_CO_POWER : SettingsThemeType.CO_POWER;
    switch (musicPlayerSettings.gameType) {
      case SettingsGameType.AW1:
        playSFX(GameSFX.powerActivateAW1COP);
        stopThemeSong(4500);
        return;
      case SettingsGameType.AW2:
      case SettingsGameType.DS:
      case SettingsGameType.RBC:
        if (isSuperCOPower) {
          let sfx = isBH ? GameSFX.powerActivateBHSCOP : GameSFX.powerActivateAllySCOP;
          playSFX(sfx);
          stopThemeSong(950);
          break;
        }
        let sfx = isBH ? GameSFX.powerActivateBHCOP : GameSFX.powerActivateAllyCOP;
        playSFX(sfx);
        stopThemeSong(1200);
        break;
    }
    if (coName === "Colin" && !isSuperCOPower) {
      setTimeout(() => playSFX(GameSFX.coGoldRush), 800);
    }
  }

  function main() {
    console.debug("[AWBW Improved Music Player] Script starting...");
    musicPlayerUI.addToAWBWPage();
    if (getIsMaintenance()) {
      console.log("[AWBW Improved Music Player] Maintenance mode is active, playing relaxing music...");
      musicPlayerSettings.isPlaying = true;
      playMusicURL(MAINTENANCE_THEME_URL);
      return;
    }
    addHandlers();
    loadSettingsFromLocalStorage();
    preloadAllCommonAudio(() => {
      console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");
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
})();
