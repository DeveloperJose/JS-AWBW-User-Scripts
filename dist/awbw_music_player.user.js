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
  typeof maxX !== "undefined" ? maxX : -1;
  typeof maxY !== "undefined" ? maxY : -1;
  let gameAnimations = typeof gameAnims !== "undefined" ? gameAnims : false;
  function isBlackHoleCO(coName) {
    return BLACK_HOLE_COs.has(coName.toLowerCase());
  }

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
      return getPlayerInfo(currentTurn);
    }
    static get isPowerActivated() {
      return this.coPowerState !== COPowerEnum.NoPower;
    }
    static get coPowerState() {
      return this.info.players_co_power_on;
    }
    static get coName() {
      return this.info.co_name;
    }
  }
  function getAllCONames() {
    return getAllPlayersInfo().map((info) => info.co_name);
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
    let currentPowerState = currentPlayer.coPowerState;
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
    static set(key, value) {
      if (key in this) {
        this[key] = value;
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
      this.__volume = val;
      this.onSettingChangeEvent("volume");
    }
    static get volume() {
      return this.__volume;
    }
    static set sfxVolume(val) {
      this.__sfxVolume = val;
      this.onSettingChangeEvent("sfxVolume");
    }
    static get sfxVolume() {
      return this.__sfxVolume;
    }
    static set uiVolume(val) {
      this.__uiVolume = val;
      this.onSettingChangeEvent("uiVolume");
    }
    static get uiVolume() {
      return this.__uiVolume;
    }
    static set gameType(val) {
      this.__gameType = val;
      this.onSettingChangeEvent("gameType");
    }
    static get gameType() {
      return this.__gameType;
    }
    static onSettingChangeEvent(key) {
      onSettingsChangeListeners.forEach((fn) => fn(key));
    }
  }
  function loadSettingsFromLocalStorage() {
    let storageData = localStorage.getItem(STORAGE_KEY);
    if (storageData === null) {
      updateSettingsInLocalStorage();
    }
    let savedSettings = JSON.parse(storageData);
    for (let key in musicPlayerSettings) {
      if (Object.hasOwn(savedSettings, key) && key.startsWith("__")) {
        let regularKey = key.substring(2);
        musicPlayerSettings.set(regularKey, savedSettings[key]);
      }
    }
    addSettingsChangeListener(updateSettingsInLocalStorage);
  }
  function updateSettingsInLocalStorage() {
    let jsonSettings = JSON.stringify(musicPlayerSettings);
    localStorage.setItem(STORAGE_KEY, jsonSettings);
  }

  const BASE_URL = "https://developerjose.netlify.app";
  const BASE_MUSIC_URL = BASE_URL + "/music";
  const BASE_SFX_URL = BASE_MUSIC_URL + "/sfx";
  const NEUTRAL_IMG_URL = BASE_URL + "/img/music-player-icon.png";
  const PLAYING_IMG_URL = BASE_URL + "/img/music-player-playing.gif";
  var GameSFX;
  (function (GameSFX) {
    GameSFX["actionSuperCOPowerAvailable"] = "sfx-action-super-co-power-available";
    GameSFX["actionCOPowerAvailable"] = "sfx-action-co-power-available";
    GameSFX["actionAllyActivateSCOP"] = "sfx-action-ally-activate-scop";
    GameSFX["actionBHActivateSCOP"] = "sfx-action-bh-activate-scop";
    GameSFX["actionCaptureAlly"] = "sfx-action-capture-ally";
    GameSFX["actionCaptureEnemy"] = "sfx-action-capture-enemy";
    GameSFX["actionCaptureProgress"] = "sfx-action-capture-progress";
    GameSFX["actionMissileHit"] = "sfx-action-missile-hit";
    GameSFX["actionMissileSend"] = "sfx-action-missile-send";
    GameSFX["actionUnitAttackPipeSeam"] = "sfx-action-unit-attack-pipe-seam";
    GameSFX["actionUnitHide"] = "sfx-action-unit-hide";
    GameSFX["actionUnitUnhide"] = "sfx-action-unit-unhide";
    GameSFX["actionUnitSupply"] = "sfx-action-unit-supply";
    GameSFX["actionUnitTrap"] = "sfx-action-unit-trap";
    GameSFX["actionUnitLoad"] = "sfx-action-unit-load";
    GameSFX["actionUnitUnload"] = "sfx-action-unit-unload";
    GameSFX["actionUnitExplode"] = "sfx-action-unit-explode";
    GameSFX["uiCursorMove"] = "sfx-ui-cursor-move";
    GameSFX["uiMenuOpen"] = "sfx-ui-menu-open";
    GameSFX["uiMenuClose"] = "sfx-ui-menu-close";
    GameSFX["uiMenuMove"] = "sfx-ui-menu-move";
    GameSFX["uiUnitSelect"] = "sfx-ui-unit-select";
  })(GameSFX || (GameSFX = {}));
  var MovementSFX;
  (function (MovementSFX) {
    MovementSFX["moveBCopterLoop"] = "https://developerjose.netlify.app/music/sfx/move_bcopter.ogg";
    MovementSFX["moveBCopterOneShot"] =
      "https://developerjose.netlify.app/music/sfx/move_bcopter_rolloff.ogg";
    MovementSFX["moveInfLoop"] = "https://developerjose.netlify.app/music/sfx/move_inf.ogg";
    MovementSFX["moveMechLoop"] = "https://developerjose.netlify.app/music/sfx/move_mech.ogg";
    MovementSFX["moveNavalLoop"] = "https://developerjose.netlify.app/music/sfx/move_naval.ogg";
    MovementSFX["movePiperunnerLoop"] =
      "https://developerjose.netlify.app/music/sfx/move_piperunner.ogg";
    MovementSFX["movePlaneLoop"] = "https://developerjose.netlify.app/music/sfx/move_plane.ogg";
    MovementSFX["movePlaneOneShot"] =
      "https://developerjose.netlify.app/music/sfx/move_plane_rolloff.ogg";
    MovementSFX["moveSubLoop"] = "https://developerjose.netlify.app/music/sfx/move_sub.ogg";
    MovementSFX["moveTCopterLoop"] = "https://developerjose.netlify.app/music/sfx/move_tcopter.ogg";
    MovementSFX["moveTCopterOneShot"] =
      "https://developerjose.netlify.app/music/sfx/move_tcopter_rolloff.ogg";
    MovementSFX["moveTiresHeavyLoop"] =
      "https://developerjose.netlify.app/music/sfx/move_tires_heavy.ogg";
    MovementSFX["moveTiresHeavyOneShot"] =
      "https://developerjose.netlify.app/music/sfx/move_tires_heavy_rolloff.ogg";
    MovementSFX["moveTiresLightLoop"] =
      "https://developerjose.netlify.app/music/sfx/move_tires_light.ogg";
    MovementSFX["moveTiresLightOneShot"] =
      "https://developerjose.netlify.app/music/sfx/move_tires_light_rolloff.ogg";
    MovementSFX["moveTreadHeavyLoop"] =
      "https://developerjose.netlify.app/music/sfx/move_tread_heavy.ogg";
    MovementSFX["moveTreadHeavyOneShot"] =
      "https://developerjose.netlify.app/music/sfx/move_tread_heavy_rolloff.ogg";
    MovementSFX["moveTreadLightLoop"] =
      "https://developerjose.netlify.app/music/sfx/move_tread_light.ogg";
    MovementSFX["moveTreadLightOneShot"] =
      "https://developerjose.netlify.app/music/sfx/move_tread_light_rolloff.ogg";
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
  const onMovmentRolloffMap = new Map([
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
  function getMusicFilename(coName, gameType, themeType) {
    let isPowerActive = themeType !== SettingsThemeType.REGULAR;
    if (!isPowerActive) {
      return `t-${coName}`;
    }
    if (gameType === SettingsGameType.AW_RBC) {
      return `t-${coName}-cop`;
    }
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
    let url = `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`;
    return url.toLowerCase().replaceAll("_", "-");
  }
  function getSoundEffectURL(sfx) {
    return `${BASE_SFX_URL}/${sfx}.ogg`;
  }
  function getMovementSoundURL(unitName) {
    return onMovementStartMap.get(unitName);
  }
  function getMovementRollOffURL(unitName) {
    return onMovmentRolloffMap.get(unitName);
  }
  function hasMovementRollOff(unitName) {
    return onMovmentRolloffMap.has(unitName);
  }
  function getAllSoundEffectURLS() {
    let sfx = Object.values(GameSFX).map(getSoundEffectURL);
    let moreSFX = Object.values(MovementSFX);
    return sfx.concat(moreSFX);
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

  let isSettingsMenuOpen = false;
  addSettingsChangeListener(onSettingsChange$2);
  function addSettingsMenuToMusicPlayer(musicPlayerDiv) {
    musicPlayerDiv.appendChild(contextMenu);
    musicPlayerDiv.addEventListener("contextmenu", (e) => {
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
    });
    document.addEventListener("click", (event) => {
      let elmnt = event.target;
      if (elmnt.id.startsWith("music-player-")) return;
      closeSettingsMenu();
    });
  }
  function onSettingsChange$2(_key) {
    volumeSlider.value = musicPlayerSettings.volume.toString();
    sfxVolumeSlider.value = musicPlayerSettings.sfxVolume.toString();
    uiVolumeSlider.value = musicPlayerSettings.uiVolume.toString();
    gameTypeSelectorSpan.value = musicPlayerSettings.gameType;
  }
  function openSettingsMenu() {
    contextMenu.style.display = "block";
  }
  function closeSettingsMenu() {
    contextMenu.style.display = "none";
  }
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
  const volumeSlider = document.createElement("input");
  volumeSlider.id = "music-player-vol-slider";
  volumeSlider.type = "range";
  volumeSlider.max = "1";
  volumeSlider.min = "0";
  volumeSlider.step = "0.01";
  volumeSlider.value = musicPlayerSettings.volume.toString();
  volumeSlider.addEventListener("input", (val) => {
    musicPlayerSettings.volume = parseFloat(val.target.value);
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
  const sfxVolumeSlider = document.createElement("input");
  sfxVolumeSlider.id = "music-player-vol-sfx-slider";
  sfxVolumeSlider.type = "range";
  sfxVolumeSlider.max = "1";
  sfxVolumeSlider.min = "0";
  sfxVolumeSlider.step = "0.01";
  sfxVolumeSlider.value = musicPlayerSettings.sfxVolume.toString();
  sfxVolumeSlider.addEventListener("input", (val) => {
    musicPlayerSettings.sfxVolume = parseFloat(val.target.value);
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
  const uiVolumeSlider = document.createElement("input");
  uiVolumeSlider.id = "music-player-vol-ui-slider";
  uiVolumeSlider.type = "range";
  uiVolumeSlider.max = "1";
  uiVolumeSlider.min = "0";
  uiVolumeSlider.step = "0.01";
  uiVolumeSlider.value = musicPlayerSettings.uiVolume.toString();
  uiVolumeSlider.addEventListener("input", (val) => {
    musicPlayerSettings.uiVolume = parseFloat(val.target.value);
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
  for (let key in SettingsGameType) {
    let gameTypeOption = document.createElement("option");
    gameTypeOption.id = "music-player-game-type-option-" + key;
    let gameTypeOptionText = document.createTextNode(key);
    gameTypeOption.appendChild(gameTypeOptionText);
    gameTypeSelectorSpan.appendChild(gameTypeOption);
  }
  themeSliderFlexContainer.appendChild(gameTypeSelectorSpan);
  let versionDiv = document.createElement("div");
  versionDiv.id = "music-player-version-number-div";
  versionDiv.style.width = "100%";
  versionDiv.style.marginTop = "5px";
  versionDiv.style.backgroundColor = "#F0F0F0";
  let versionSpan = document.createElement("span");
  versionSpan.id = "music-player-version-number";
  versionSpan.textContent = "VERSION: " + versions.music_player;
  versionSpan.style.fontSize = "9px";
  versionSpan.style.color = "#888888";
  versionDiv.appendChild(versionSpan);
  contextMenu.appendChild(versionDiv);

  function addMusicPlayerMenu() {
    addSettingsMenuToMusicPlayer(musicPlayerDiv);
    menu.appendChild(musicPlayerDiv);
  }
  function setMusicPlayerLoadPercentage(percentage) {
    musicPlayerDivBackground.style.backgroundImage =
      "linear-gradient(to right, #ffffff " + String(percentage) + "% , #888888 0%)";
  }
  function onMusicBtnClick(_event) {
    musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
  }
  function onSettingsChange$1(key) {
    if (key != "isPlaying") return;
    if (musicPlayerSettings.isPlaying) {
      musicPlayerDivBackgroundImg.src = PLAYING_IMG_URL;
      musicPlayerDivHoverSpan.innerText = "Stop Tunes";
      musicPlayerDivBackground.style.backgroundColor = "#e1e1e1";
    } else {
      musicPlayerDivBackgroundImg.src = NEUTRAL_IMG_URL;
      musicPlayerDivHoverSpan.innerText = "Play Tunes";
      musicPlayerDivBackground.style.backgroundColor = "#ffffff";
    }
  }
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
  musicPlayerDivBackgroundImg.src = NEUTRAL_IMG_URL;
  musicPlayerDivBackgroundImg.style.verticalAlign = "middle";
  musicPlayerDivBackgroundImg.style.width = "17px";
  musicPlayerDivBackgroundImg.style.height = "17px";
  musicPlayerDiv.appendChild(musicPlayerDivBackground);
  musicPlayerDiv.appendChild(musicPlayerDivHoverSpan);
  musicPlayerDivBackground.appendChild(musicPlayerDivBackgroundSpan);
  musicPlayerDivBackgroundSpan.appendChild(musicPlayerDivBackgroundLink);
  musicPlayerDivBackgroundLink.appendChild(musicPlayerDivBackgroundImg);
  addSettingsChangeListener(onSettingsChange$1);
  musicPlayerDivBackground.addEventListener("click", onMusicBtnClick);

  let currentThemeKey = "";
  const urlAudioMap = new Map();
  const unitIDAudioMap = new Map();
  let currentlyDelaying = false;
  let delayThemeMS = 0;
  addSettingsChangeListener(onSettingsChange);
  function playThemeSong() {
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
    playMusicURL(getMusicURL(coName), true);
  }
  function stopThemeSong(delayMS = 0) {
    if (delayMS > 0) delayThemeMS = delayMS;
    if (!urlAudioMap.has(currentThemeKey)) return;
    let currentTheme = urlAudioMap.get(currentThemeKey);
    if (currentTheme.paused) return;
    if (currentTheme.readyState !== HTMLAudioElement.prototype.HAVE_ENOUGH_DATA) {
      currentTheme.addEventListener("play", (event) => event.target.pause(), {
        once: true,
      });
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
    let coNames = isMapEditor ? ["map-editor"] : getAllCONames();
    let audioList = coNames.map((name) => getMusicURL(name));
    audioList.push(getSoundEffectURL(GameSFX.uiCursorMove));
    audioList.push(getSoundEffectURL(GameSFX.uiUnitSelect));
    preloadAudios(audioList, afterPreloadFunction);
  }
  function preloadAllExtraAudio(afterPreloadFunction) {
    if (isMapEditor) return;
    let audioList = getAllSoundEffectURLS();
    let coNames = getAllCONames();
    for (let gameType in SettingsGameType) {
      for (let themeType in SettingsThemeType) {
        let gameList = coNames.map((name) => getMusicURL(name, gameType, themeType));
        audioList = audioList.concat(gameList);
      }
    }
    preloadAudios(audioList, afterPreloadFunction);
  }
  function preloadAudios(audioURLs, afterPreloadFunction) {
    let uniqueURLs = new Set(audioURLs);
    let numLoadedAudios = 0;
    let onLoadAudio = (event) => {
      numLoadedAudios++;
      let loadPercentage = (numLoadedAudios / uniqueURLs.size) * 100;
      setMusicPlayerLoadPercentage(loadPercentage);
      if (event.type !== "error") {
        let audio = event.target;
        urlAudioMap.set(audio.src, audio);
      }
      if (numLoadedAudios >= uniqueURLs.size) {
        if (afterPreloadFunction) afterPreloadFunction();
      }
    };
    let onLoadAudioError = (event) => {
      onLoadAudio(event);
    };
    audioURLs.forEach((url) => {
      if (urlAudioMap.has(url)) {
        numLoadedAudios++;
        return;
      }
      let audio = new Audio(url);
      audio.addEventListener("loadedmetadata", onLoadAudio, false);
      audio.addEventListener("error", onLoadAudioError, false);
    });
  }
  function playMusicURL(srcURL, loop = true) {
    if (!musicPlayerSettings.isPlaying) return;
    let currentTheme = urlAudioMap.get(currentThemeKey);
    if (srcURL === currentThemeKey) {
      if (currentTheme.paused) currentTheme.play();
      return;
    }
    stopThemeSong();
    currentThemeKey = srcURL;
    console.log("[AWBW Improved Music Player] Now Playing: " + srcURL);
    if (!urlAudioMap.has(srcURL)) {
      urlAudioMap.set(srcURL, new Audio(srcURL));
    }
    currentTheme = urlAudioMap.get(srcURL);
    currentTheme.volume = musicPlayerSettings.volume;
    currentTheme.loop = loop;
    currentTheme.play();
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
        playThemeSong();
        break;
      case "volume": {
        let currentTheme = urlAudioMap.get(currentThemeKey);
        if (currentTheme) {
          currentTheme.volume = musicPlayerSettings.volume;
        }
        break;
      }
    }
  }

  let ahCursorMove = updateCursor;
  let ahOpenMenu = openMenu;
  let ahCloseMenu = closeMenu;
  let ahUnitClick = unitClickHandler;
  let ahWait = waitUnit;
  let ahAnimUnit = animUnit;
  let ahExplodeAnim = animExplosion;
  let ahFog = updateAirUnitFogOnMove;
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
  let ahLaunch = actionHandlers.Launch;
  let ahNextTurn = actionHandlers.NextTurn;
  let ahElimination = actionHandlers.Elimination;
  let ahPower = actionHandlers.Power;
  let ahGameOver = actionHandlers.GameOver;

  const CURSOR_THRESHOLD_MS = 25;
  let lastCursorCall = Date.now();
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
  function addSiteHandlers() {
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
    updateCursor = (cursorX, cursorY) => {
      ahCursorMove.apply(updateCursor, [cursorX, cursorY]);
      if (!musicPlayerSettings.isPlaying) return;
      if (Date.now() - lastCursorCall > CURSOR_THRESHOLD_MS) {
        playSFX(GameSFX.uiCursorMove);
      }
      lastCursorCall = Date.now();
    };
    openMenu = (menu, x, y) => {
      ahOpenMenu.apply(openMenu, [menu, x, y]);
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
      ahCloseMenu.apply(closeMenu, []);
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
        playSFX(GameSFX.uiMenuOpen);
        menuItemClick = MenuClickType.None;
      } else if (canceledAction || canceledUnitAction) {
        playSFX(GameSFX.uiMenuClose);
        menuItemClick = MenuClickType.None;
      }
      menuOpen = false;
    };
    unitClickHandler = (clicked) => {
      ahUnitClick.apply(unitClickHandler, [clicked]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Unit Click", clicked);
      menuItemClick = MenuClickType.Unit;
      playSFX(GameSFX.uiUnitSelect);
    };
    waitUnit = (unitId) => {
      ahWait.apply(waitUnit, [unitId]);
      if (!musicPlayerSettings.isPlaying) return;
      stopMovementSound(unitId);
      if (movementResponseMap.has(unitId)) {
        let response = movementResponseMap.get(unitId);
        if (response.trapped) {
          playSFX(GameSFX.actionUnitTrap);
        }
        movementResponseMap.delete(unitId);
      }
    };
    animUnit = (path, unitId, unitSpan, unitTeam, viewerTeam, i) => {
      ahAnimUnit.apply(animUnit, [path, unitId, unitSpan, unitTeam, viewerTeam, i]);
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
      ahExplodeAnim.apply(animExplosion, [unit]);
      if (!musicPlayerSettings.isPlaying) return;
      let unitId = unit.units_id;
      let unitFuel = unit.units_fuel;
      let sfx = GameSFX.actionUnitExplode;
      if (getUnitName(unitId) === "Black Bomb" && unitFuel > 0) {
        sfx = GameSFX.actionMissileHit;
      }
      playSFX(sfx);
      stopMovementSound(unitId, false);
    };
    updateAirUnitFogOnMove = (x, y, mType, neighbours, unitVisible, change, delay) => {
      ahFog.apply(updateAirUnitFogOnMove, [x, y, mType, neighbours, unitVisible, change, delay]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Fog", x, y, mType, neighbours, unitVisible, change, delay);
      let unitInfo = getUnitInfoFromCoords(x, y);
      if (change === "Add") {
        setTimeout(() => stopMovementSound(unitInfo.units_id, false), delay);
      }
    };
    actionHandlers.Fire = (response) => {
      if (!musicPlayerSettings.isPlaying) {
        ahFire.apply(actionHandlers.Fire, [response]);
        return;
      }
      console.log("Fire", response);
      let attackerID = response.copValues.attacker.playerId;
      let defenderID = response.copValues.defender.playerId;
      let couldAttackerActivateSCOPBefore = canPlayerActivateSuperCOPower(attackerID);
      let couldAttackerActivateCOPBefore = canPlayerActivateCOPower(attackerID);
      let couldDefenderActivateSCOPBefore = canPlayerActivateSuperCOPower(defenderID);
      let couldDefenderActivateCOPBefore = canPlayerActivateCOPower(defenderID);
      ahFire.apply(actionHandlers.Fire, [response]);
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
          playSFX(GameSFX.actionSuperCOPowerAvailable);
        } else if (madeCOPAvailable) {
          playSFX(GameSFX.actionCOPowerAvailable);
        }
      }, delay);
    };
    actionHandlers.AttackSeam = (response) => {
      ahAttackSeam.apply(actionHandlers.AttackSeam, [response]);
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
        playSFX(GameSFX.actionUnitAttackPipeSeam);
        playSFX(GameSFX.actionUnitExplode);
        return;
      }
      setTimeout(() => playSFX(GameSFX.actionUnitAttackPipeSeam), attackDelayMS);
    };
    actionHandlers.Move = (response, loadFlag) => {
      ahMove.apply(actionHandlers.Move, [response, loadFlag]);
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
      ahCapt.apply(actionHandlers.Capt, [captData]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Capt", captData);
      let isValid = captData != undefined;
      if (!isValid) return;
      let finishedCapture = captData.newIncome != null;
      if (!finishedCapture) {
        playSFX(GameSFX.actionCaptureProgress);
        return;
      }
      let myID = getMyID();
      let isSpectator = isPlayerSpectator(myID);
      console.log(isSpectator, captData.buildingInfo.buildings_team, myID);
      let isMyCapture = isSpectator || captData.buildingInfo.buildings_team == myID;
      let sfx = isMyCapture ? GameSFX.actionCaptureAlly : GameSFX.actionCaptureEnemy;
      playSFX(sfx);
    };
    actionHandlers.Build = (data) => {
      ahBuild.apply(actionHandlers.Build, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Build", data);
      let myID = getMyID();
      let isMyBuild = data.newUnit.units_players_id == myID;
      if (!isMyBuild) playSFX(GameSFX.actionUnitSupply);
    };
    actionHandlers.Load = (data) => {
      ahLoad.apply(actionHandlers.Load, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Load", data);
      playSFX(GameSFX.actionUnitLoad);
    };
    actionHandlers.Unload = (unloadData) => {
      ahUnload.apply(actionHandlers.Unload, [unloadData]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Unload", unloadData);
      playSFX(GameSFX.actionUnitUnload);
    };
    actionHandlers.Supply = (data) => {
      ahSupply.apply(actionHandlers.Supply, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Supply", data);
      playSFX(GameSFX.actionUnitSupply);
    };
    actionHandlers.Repair = (data) => {
      ahRepair.apply(actionHandlers.Repair, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Repair", data);
      playSFX(GameSFX.actionUnitSupply);
    };
    actionHandlers.Hide = (data) => {
      ahHide.apply(actionHandlers.Hide, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Hide", data);
      playSFX(GameSFX.actionUnitHide);
      stopMovementSound(data.unitId);
    };
    actionHandlers.Unhide = (data) => {
      ahUnhide.apply(actionHandlers.Unhide, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Unhide", data);
      playSFX(GameSFX.actionUnitUnhide);
      stopMovementSound(data.unitId);
    };
    actionHandlers.Join = (data) => {
      ahJoin.apply(actionHandlers.Join, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Join", data);
      stopMovementSound(data.joinID);
      stopMovementSound(data.joinedUnit.units_id);
    };
    actionHandlers.Launch = (data) => {
      ahLaunch.apply(actionHandlers.Launch, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Launch", data);
      playSFX(GameSFX.actionMissileSend);
      setTimeout(() => playSFX(GameSFX.actionMissileHit), siloDelayMS);
    };
    actionHandlers.NextTurn = (data) => {
      ahNextTurn.apply(actionHandlers.NextTurn, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("NextTurn", data);
      visibilityMap.clear();
      playThemeSong();
    };
    actionHandlers.Elimination = (data) => {
      ahElimination.apply(actionHandlers.Elimination, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Elimination", data);
      debugger;
    };
    actionHandlers.Power = (data) => {
      ahPower.apply(actionHandlers.Power, [data]);
      if (!musicPlayerSettings.isPlaying) return;
      console.log("Power", data);
      let coName = data.coName;
      let isSuperCOPower = data.coPower === COPowerEnum.SuperCOPower;
      let isBH = isBlackHoleCO(coName);
      if (isSuperCOPower) {
        let sfx = isBH ? GameSFX.actionBHActivateSCOP : GameSFX.actionAllyActivateSCOP;
        playSFX(sfx);
        stopThemeSong(2500);
      }
    };
    actionHandlers.GameOver = () => {
      ahGameOver.apply(actionHandlers.GameOver, []);
      if (!musicPlayerSettings.isPlaying) return;
      debugger;
    };
  }

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

  addMusicPlayerMenu();
  addSiteHandlers();
  preloadAllCommonAudio(() => {
    console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");
    loadSettingsFromLocalStorage();
    preloadAllExtraAudio(() => {
      console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
    });
  });
})();
