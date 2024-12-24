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

  /**
   * @file Constants, functions, and computed variables that come from analyzing the web pages of AWBW.
   *  Another way to think of this file is that this file represents the AWBW "API".
   *  A lot of useful information came from game.js and the code at the bottom of each game page.
   */

  /**
   * List of Black Hole COs, stored in a set for more efficient lookups.
   * @constant
   */
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

  // ============================== AWBW Page Elements ==============================
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
  typeof maxX !== "undefined" ? maxX : -1;

  /**
   * The number of rows of this map.
   * @type {number}
   */
  typeof maxY !== "undefined" ? maxY : -1;

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
    return BLACK_HOLE_COs.has(coName.toLowerCase());
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
   * @file This file contains the state of the music player settings and the saving/loading functionality, no UI functionality.
   * Note: For Enums in pure JS we just have objects where the keys and values match, it's the easiest solution
   */

  /**
   * Enum that represents which game we want the music player to use for its music.
   * @enum {string}
   */
  const SettingsGameType = Object.freeze({
    AW1: "AW1",
    AW2: "AW2",
    AW_RBC: "AW_RBC",
    AW_DS: "AW_DS",
  });

  /**
   * Enum that represents music theme types like regular or power.
   * @enum {string}
   */
  const SettingsThemeType = Object.freeze({
    REGULAR: "REGULAR",
    CO_POWER: "CO_POWER",
    SUPER_CO_POWER: "SUPER_CO_POWER",
  });

  /**
   * Gets the theme type enum corresponding to the CO Power state for the current CO.
   * @returns {SettingsThemeType} The THEME_TYPE enum for the current CO Power state.
   */
  function getCurrentThemeType() {
    let currentPowerState = currentPlayer.coPowerState;
    if (currentPowerState === "Y") return SettingsThemeType.CO_POWER;
    if (currentPowerState === "S") return SettingsThemeType.SUPER_CO_POWER;

    return SettingsThemeType.REGULAR;
  }

  /**
   * @constant
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
    __gameType: SettingsGameType.AW_DS,

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
     * @type {SettingsGameType}
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
   * @reaodnly
   * @constant {string}
   */
  const BASE_SFX_URL = BASE_MUSIC_URL + "/sfx";

  /**
   * Image URL for static music player icon
   * @reaodnly
   * @constant {string}
   */
  const NEUTRAL_IMG_URL = BASE_URL + "/img/music-player-icon.png";

  /**
   * Image URL for animated music player icon.
   * @reaodnly
   * @constant {string}
   */
  const PLAYING_IMG_URL = BASE_URL + "/img/music-player-playing.gif";

  /**
   * Enumeration of all game sound effects. The values for the keys are the filenames.
   * @enum {string}
   */
  const GameSFX = {
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
   * Enumeration of all the unit movement sounds. The values are the URLs for the sounds.
   * @enum {string}
   */
  const MovementSFX = {
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
  };

  /**
   * Map that takes unit names as keys and gives you the URL for that unit movement sound.
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
   * Map that takes unit names as keys and gives you the URL to play when that unit has stopped moving, if any.
   */
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

  /**
   * Determines the filename for the music to play given a specific CO and other settings.
   * @param {string} coName - Name of the CO whose music to use.
   * @param {SettingsGameType} gameType - Which game soundtrack to use.
   * @param {SettingsThemeType} themeType - Which type of music whether regular or power.
   * @returns The filename of the music to play given the parameters.
   */
  function getMusicFilename(coName, gameType, themeType) {
    let isPowerActive = themeType !== SettingsThemeType.REGULAR;

    // Regular theme
    if (!isPowerActive) {
      return `t-${coName}`;
    }

    // For RBC, we play the new power themes
    if (gameType === SettingsGameType.AW_RBC) {
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
   * @param {SettingsGameType} gameType - (Optional) Which game soundtrack to use.
   * @param {SettingsThemeType} themeType - (Optional) Which type of music to use whether regular or power.
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
    let url = `${BASE_MUSIC_URL}/${gameDir}/${filename}.ogg`;
    return url.toLowerCase().replaceAll("_", "-");
  }

  /**
   * Gets the URL for the given sound effect.
   * @param {string} sfx - String key for the sound effect to use.
   * @returns The URL of the given sound effect key.
   */
  function getSoundEffectURL(sfx) {
    return `${BASE_SFX_URL}/${sfx}.ogg`;
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
    return onMovmentRolloffMap.get(unitName);
  }

  /**
   * Checks if the given unit plays a sound when it stops moving.
   * @param {string} unitName - Name of the unit.
   * @returns True if the given unit has a sound to play when it stops moving.
   */
  function hasMovementRollOff(unitName) {
    return onMovmentRolloffMap.has(unitName);
  }

  /**
   * Gets a list of the URLs for all sound effects the music player might ever use.
   * These include game effects, UI effects, and unit movement sounds.
   * @returns List with all the URLs for all the music player sound effects.
   */
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

  /**
   * @file This file contains all the functions and variables relevant to the creation and behavior of the music player settings UI.
   */

  /**
   * Is the settings context menu (right-click) currently open?
   * Used to close the right-click settings menu when you right-click twice
   */
  let isSettingsMenuOpen = false;

  // Listen for setting changes to update the settings UI
  addSettingsChangeListener(onSettingsChange$2);

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
  function onSettingsChange$2(_key) {
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

  for (let key in SettingsGameType) {
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
  versionSpan.textContent = "VERSION: " + versions.musicPlayer;
  versionSpan.style.fontSize = "9px";
  versionSpan.style.color = "#888888";

  versionDiv.appendChild(versionSpan);
  contextMenu.appendChild(versionDiv);

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
  function onSettingsChange$1(key) {
    if (key != "isPlaying") return;

    // Update UI
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
  musicPlayerDivBackgroundImg.src = NEUTRAL_IMG_URL;
  musicPlayerDivBackgroundImg.style.verticalAlign = "middle";
  musicPlayerDivBackgroundImg.style.width = "17px";
  musicPlayerDivBackgroundImg.style.height = "17px";

  musicPlayerDiv.appendChild(musicPlayerDivBackground);
  musicPlayerDiv.appendChild(musicPlayerDivHoverSpan);
  musicPlayerDivBackground.appendChild(musicPlayerDivBackgroundSpan);
  musicPlayerDivBackgroundSpan.appendChild(musicPlayerDivBackgroundLink);
  musicPlayerDivBackgroundLink.appendChild(musicPlayerDivBackgroundImg);

  // Listen for setting changes to update the menu UI
  addSettingsChangeListener(onSettingsChange$1);

  // Determine who will catch when the user clicks the play/stop button
  musicPlayerDivBackground.addEventListener("click", onMusicBtnClick);

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
  addSettingsChangeListener(onSettingsChange);

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
   * @param {string} sfx - String representing a key in {@link GameSFX}.
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
    audioList.push(getSoundEffectURL(GameSFX.uiCursorMove));
    audioList.push(getSoundEffectURL(GameSFX.uiUnitSelect));

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
    for (let gameType in SettingsGameType) {
      for (let themeType in SettingsThemeType) {
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
        // Adjust the volume of the current theme
        let currentTheme = urlAudioMap.get(currentThemeKey);
        if (currentTheme) {
          currentTheme.volume = musicPlayerSettings.volume;
        }
        break;
      }
    }
  }

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
   * @constant
   * @type {number}
   */
  const CURSOR_THRESHOLD_MS = 25;

  /**
   * Date representing when we last moved the game cursor.
   * @type {number}
   */
  let lastCursorCall = Date.now();

  const MenuClickType = {
    None: "None",
    Unit: "Unit",
    MenuItem: "MenuItem",
  };

  let menuItemClick = MenuClickType.None;
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
        playSFX(GameSFX.uiCursorMove);
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
      console.log("Open menu", menuOptions[0]);
      for (var i = 0; i < menuOptions.length; i++) {
        menuOptions[i].addEventListener("mouseenter", (_event) => {
          console.log("Listener", _event);
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

    /**
     * Function called when the action menu is closed after you select an action or cancel.
     */
    closeMenu = () => {
      ahCloseMenu.apply(closeMenu, []);
      console.log("CloseMenu", menuOpen, menuItemClick);
      if (!musicPlayerSettings.isPlaying) return;

      if (menuOpen && !menuItemClick) {
        playSFX(GameSFX.uiMenuClose);
      } else if (menuOpen && menuItemClick) {
        playSFX(GameSFX.uiMenuOpen);
      } else if (menuItemClick) {
        playSFX(GameSFX.uiMenuClose);
      }

      menuOpen = false;
      menuItemClick = MenuClickType.None;
    };

    unitClickHandler = (clicked) => {
      ahUnitClick.apply(unitClickHandler, [clicked]);
      if (!musicPlayerSettings.isPlaying) return;
      menuItemClick = MenuClickType.Unit;

      playSFX(GameSFX.uiUnitSelect);
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
          playSFX(GameSFX.actionUnitTrap);
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
          playSFX(GameSFX.actionSuperCOPowerAvailable);
        } else if (madeCOPAvailable) {
          playSFX(GameSFX.actionCOPowerAvailable);
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
        playSFX(GameSFX.actionUnitAttackPipeSeam);
        playSFX(GameSFX.actionUnitExplode);
        return;
      }
      setTimeout(() => playSFX(GameSFX.actionUnitAttackPipeSeam), attackDelayMS);
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
        playSFX(GameSFX.actionCaptureProgress);
        return;
      }

      // The unit is done capping this property
      let myID = getMyID();
      let isSpectator = isPlayerSpectator(myID);
      console.log(isSpectator, captData.buildingInfo.buildings_team, myID);
      // buildings_team (string) == id (number)
      let isMyCapture = isSpectator || captData.buildingInfo.buildings_team == myID;
      let sfx = isMyCapture ? GameSFX.actionCaptureAlly : GameSFX.actionCaptureEnemy;
      playSFX(sfx);
    };

    actionHandlers.Build = (buildData) => {
      ahBuild.apply(actionHandlers.Build, [buildData]);
      if (!musicPlayerSettings.isPlaying) return;
      playSFX(GameSFX.actionUnitSupply);
    };

    actionHandlers.Load = (loadData) => {
      ahLoad.apply(actionHandlers.Load, [loadData]);
      if (!musicPlayerSettings.isPlaying) return;
      playSFX(GameSFX.actionUnitLoad);
    };

    actionHandlers.Unload = (unloadData) => {
      ahUnload.apply(actionHandlers.Unload, [unloadData]);
      if (!musicPlayerSettings.isPlaying) return;
      playSFX(GameSFX.actionUnitUnload);
    };

    actionHandlers.Supply = (supplyRes) => {
      ahSupply.apply(actionHandlers.Supply, [supplyRes]);
      if (!musicPlayerSettings.isPlaying) return;

      // We could play the sfx for each supplied unit in the list
      // but instead we decided to play the supply sound once.
      playSFX(GameSFX.actionUnitSupply);
    };

    actionHandlers.Repair = (repairData) => {
      ahRepair.apply(actionHandlers.Repair, [repairData]);
      if (!musicPlayerSettings.isPlaying) return;
      playSFX(GameSFX.actionUnitSupply);
    };

    actionHandlers.Hide = (hideData) => {
      ahHide.apply(actionHandlers.Hide, [hideData]);
      if (!musicPlayerSettings.isPlaying) return;
      playSFX(GameSFX.actionUnitHide);
      // console.log("Hide", hideData, hideData.unitId, hideData.unitID);
      stopMovementSound(hideData.unitId);
    };

    actionHandlers.Unhide = (unhideData) => {
      ahUnhide.apply(actionHandlers.Unhide, [unhideData]);
      if (!musicPlayerSettings.isPlaying) return;
      playSFX(GameSFX.actionUnitUnhide);
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

      playSFX(GameSFX.actionMissileSend);
      setTimeout(() => playSFX(GameSFX.actionMissileHit), siloDelayMS);
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
        let sfx = isBH ? GameSFX.actionBHActivateSCOP : GameSFX.actionAllyActivateSCOP;
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

  /**
   * @file Main script that loads everything for the AWBW Improved Music Player userscript.
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
})();
