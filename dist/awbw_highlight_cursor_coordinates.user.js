// ==UserScript==
// @name        AWBW Highlight Cursor Coordinates
// @description Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.
// @namespace   https://awbw.amarriner.com/
// @author      DeveloperJose
// @match       https://awbw.amarriner.com/*?games_id=*
// @match       https://awbw.amarriner.com/*?replays_id=*
// @icon        https://awbw.amarriner.com/terrain/unit_select.gif
// @version     1.0.2
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

  // ============================== AWBW Page Elements ==============================
  let gamemap = document.querySelector("#gamemap");
  let gamemapContainer = document.querySelector("#gamemap-container");
  let zoomInBtn = document.querySelector("#zoom-in");
  let zoomOutBtn = document.querySelector("#zoom-out");
  let zoomLevel = document.querySelector(".zoom-level");
  let cursor = document.querySelector("#cursor");
  document.querySelector(".event-username");

  document.querySelector(".supply-icon");
  document.querySelector(".trapped-icon");
  document.querySelector(".target-icon");
  document.querySelector(".destroy-icon");

  document.querySelector(".replay-open");
  document.querySelector(".replay-close");
  document.querySelector(".replay-forward");
  document.querySelector(".replay-forward-action");
  document.querySelector(".replay-backward");
  document.querySelector(".replay-backward-action");
  document.querySelector(".replay-day-selector");

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
  typeof gameAnims !== "undefined" ? gameAnims : false;

  /**
   * Are we in the map editor?
   */
  let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;

  /**
   * Gets the username of the person logged in to the website.
   * @type {string}
   */
  document
    .querySelector("#profile-menu")
    .getElementsByClassName("dropdown-menu-link")[0]
    .href.split("username=")[1];

  /**
   * The HTML node for the game menu, the little bar with all the icons.
   * @type {Element}
   */
  isMapEditor
    ? document.querySelector("#replay-misc-controls")
    : document.querySelector("#game-map-menu")?.parentNode;

  /**
   * @file Constants, functions, and computed variables that come from other userscripts.
   *  These are useful when we want to have better synergy with other userscripts.
   */

  /**
   * The button that is used to enter maximization mode or exit it for the AWBW Maximize Extension
   */
  let maximizeBtn = document.getElementsByClassName("AWBWMaxmiseButton")[0];

  /**
   * @file Main script that loads everything for the AWBW Highlight Cursor Coordinates userscript.
   */

  /********************** Script Variables ***********************/
  const CURSOR_THRESHOLD_MS = 30;
  let previousHighlight = null;
  let isMaximizeToggled = false;
  let lastCursorCall = Date.now();

  let spotSpanTemplate = document.createElement("span");
  spotSpanTemplate.style.width = "16px";
  spotSpanTemplate.style.height = "16px";
  spotSpanTemplate.style.left = "-16px";
  spotSpanTemplate.style.top = mapRows * 16 + "px";
  spotSpanTemplate.style.fontFamily = "monospace";
  spotSpanTemplate.style.position = "absolute";
  spotSpanTemplate.style.fontSize = "11px";
  spotSpanTemplate.style.zIndex = "100";
  // spotSpanTemplate.style.visibility = "hidden";

  /********************** Script Functions **********************/
  function setHighlight(node, highlight) {
    let fontWeight = "";
    let color = "";
    let backgroundColor = "";

    if (highlight) {
      fontWeight = "bold";
      color = "#FFFFFF";
      backgroundColor = "#FF0000";
    }
    node.style.fontWeight = fontWeight;
    node.style.color = color;
    node.style.backgroundColor = backgroundColor;
  }

  function onZoomChangeEvent(_pointerEvent = null, zoom = null) {
    if (zoom === null) {
      zoom = parseFloat(zoomLevel.textContent);
    }

    let padding = 16 * zoom;
    gamemapContainer.style.paddingBottom = padding + "px";
    gamemapContainer.style.paddingLeft = padding + "px";
  }

  /********************** Intercepted Action Handlers ***********************/
  /* global updateCursor:writeable */
  let oldUpdateCursor = updateCursor;

  updateCursor = function () {
    oldUpdateCursor.apply(window.updateCursor, arguments);

    if (Date.now() - lastCursorCall <= CURSOR_THRESHOLD_MS) {
      lastCursorCall = Date.now();
      return;
    }

    // Get cursor row and column indices then the span
    let cursorRow = Math.abs(Math.ceil(parseInt(cursor.style.top) / 16));
    let cursorCol = Math.abs(Math.ceil(parseInt(cursor.style.left) / 16));
    let highlightRow = document.getElementById("grid-spot-row-" + cursorRow);
    let highlightCol = document.getElementById("grid-spot-col-" + cursorCol);

    // Remove highlight for previous
    if (previousHighlight != null) {
      setHighlight(previousHighlight[0], false);
      setHighlight(previousHighlight[1], false);
    }

    // Highlight current
    setHighlight(highlightRow, true);
    setHighlight(highlightCol, true);
    previousHighlight = [highlightRow, highlightCol];

    lastCursorCall = Date.now();
  };

  /******************************************************************
   * SCRIPT ENTRY (MAIN FUNCTION)
   ******************************************************************/
  if (zoomInBtn != null) {
    zoomInBtn.onclick = onZoomChangeEvent;
  }

  if (zoomOutBtn != null) {
    zoomOutBtn.onclick = onZoomChangeEvent;
  }

  // Synergize with AWBW Maximize if that script is running as well
  if (maximizeBtn != null) {
    console.log("AWBW Highlight Cursor Coordinates script found AWBW Maximize script");
    let old_fn = maximizeBtn.onclick;
    maximizeBtn.onclick = (event) => {
      old_fn(event);
      isMaximizeToggled = !isMaximizeToggled;
      onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : null);
    };
  }

  // Scale to current zoom level
  onZoomChangeEvent();

  // Create squares
  for (let row = 0; row < mapRows; row++) {
    let spotSpan = spotSpanTemplate.cloneNode(true);
    spotSpan.id = "grid-spot-row-" + row;
    spotSpan.style.top = row * 16 + "px";
    spotSpan.textContent = row;
    gamemap.appendChild(spotSpan);
  }

  for (let col = 0; col < mapCols; col++) {
    let spotSpan = spotSpanTemplate.cloneNode(true);
    spotSpan.id = "grid-spot-col-" + col;
    spotSpan.style.left = col * 16 + "px";
    spotSpan.textContent = col;
    gamemap.appendChild(spotSpan);
  }

  console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
})();
