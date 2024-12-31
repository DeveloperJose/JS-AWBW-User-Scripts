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
   * @file Global variables exposed by Advance Wars By Web's JS code and other useful constants.
   */
  // ============================== Advance Wars Stuff ==============================
  /**
   * List of Orange Star COs, stored in a set for more efficient lookups.
   */
  // ============================== AWBW Page Global Variables ==============================
  /**
   * The number of columns of this map.
   */
  function getMapColumns() {
    return typeof maxX !== "undefined" ? maxX : -1;
  }
  /**
   * The number of rows of this map.
   */
  function getMapRows() {
    return typeof maxY !== "undefined" ? maxY : -1;
  }

  /**
   * @file Constants, variables, and functions that come from analyzing the web pages of AWBW.
   */
  /**
   * Are we in the map editor?
   */
  function getIsMapEditor() {
    return window.location.href.indexOf("editmap.php?") > -1;
  }
  function getIsMaintenance() {
    return document.querySelector("#server-maintenance-alert") !== null;
  }
  // ============================== AWBW Page Elements ==============================
  function getGamemap() {
    return document.querySelector("#gamemap");
  }
  function getGamemapContainer() {
    return document.querySelector("#gamemap-container");
  }
  function getZoomInBtn() {
    return document.querySelector("#zoom-in");
  }
  function getZoomOutBtn() {
    return document.querySelector("#zoom-out");
  }
  function getZoomLevel() {
    return document.querySelector(".zoom-level");
  }
  function getCursor() {
    return document.querySelector("#cursor");
  }

  /**
   * @file Functions used by Advance Wars By Web to handle game actions.
   */
  function getCursorMoveFn() {
    if (getIsMapEditor()) {
      return typeof designMapEditor !== "undefined" ? designMapEditor.updateCursor : null;
    }
    return typeof updateCursor !== "undefined" ? updateCursor : null;
  }

  /**
   * @file Constants, functions, and computed variables that come from other userscripts.
   *  These are useful when we want to have better synergy with other userscripts.
   */
  /**
   * The button that is used to enter maximization mode or exit it for the AWBW Maximize Extension
   */
  function getMaximizeBtn() {
    return document.getElementsByClassName("AWBWMaxmiseButton")[0];
  }

  /**
   * @file Main script that loads everything for the AWBW Highlight Cursor Coordinates userscript.
   */
  /********************** AWBW Stuff ***********************/
  const mapRows = getMapRows();
  const mapCols = getMapColumns();
  const cursor = getCursor();
  const gamemap = getGamemap();
  const gamemapContainer = getGamemapContainer();
  const zoomInBtn = getZoomInBtn();
  const zoomOutBtn = getZoomOutBtn();
  const ahCursorMove = getCursorMoveFn();
  /********************** Script Variables & Functions ***********************/
  const CURSOR_THRESHOLD_MS = 30;
  const FONT_SIZE = 9;
  let previousHighlight = [];
  let isMaximizeToggled = false;
  let lastCursorCall = Date.now();
  let lastCursorX = -1;
  let lastCursorY = -1;
  let spotSpanTemplate = document.createElement("span");
  spotSpanTemplate.style.width = "16px";
  spotSpanTemplate.style.height = "16px";
  spotSpanTemplate.style.left = "-16px";
  spotSpanTemplate.style.top = mapRows * 16 + "px";
  spotSpanTemplate.style.fontFamily = "monospace";
  spotSpanTemplate.style.position = "absolute";
  spotSpanTemplate.style.fontSize = FONT_SIZE + "px";
  spotSpanTemplate.style.zIndex = "100";
  spotSpanTemplate.style.alignContent = "center";
  // spotSpanTemplate.style.backgroundImage = "url(https://awbw.amarriner.com/terrain/ani/plain.gif)";
  // spotSpanTemplate.style.visibility = "hidden";
  function setHighlight(node, highlight) {
    if (!node) {
      console.error("[AWBW Highlight Cursor Coordinates] Node is null, something isn't right.");
      return;
    }
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
  function onZoomChangeEvent(_event, zoom = -1) {
    if (zoom < 0) {
      const zoomLevelText = getZoomLevel().textContent;
      if (zoomLevelText !== null) {
        zoom = parseFloat(zoomLevelText);
      }
    }
    let padding = 16 * zoom;
    gamemapContainer.style.paddingBottom = padding + "px";
    gamemapContainer.style.paddingLeft = padding + "px";
  }
  function onCursorMove(cursorX, cursorY) {
    ahCursorMove?.apply(updateCursor, [cursorX, cursorY]);
    // Get cursor row and column indices then the span
    let cursorRow = Math.abs(Math.ceil(parseInt(cursor.style.top) / 16));
    let cursorCol = Math.abs(Math.ceil(parseInt(cursor.style.left) / 16));
    let highlightRow = document.getElementById("grid-spot-row-" + cursorRow);
    let highlightCol = document.getElementById("grid-spot-col-" + cursorCol);
    let dx = Math.abs(cursorX - lastCursorX);
    let dy = Math.abs(cursorY - lastCursorY);
    let cursorMoved = dx >= 1 || dy >= 1;
    let timeSinceLastCursorCall = Date.now() - lastCursorCall;
    if (!highlightRow || !highlightCol) {
      console.error("[AWBW Highlight Cursor Coordinates] Highlight row or column is null, something isn't right.");
      return;
    }
    // Don't play the sound if we moved the cursor too quickly
    if (timeSinceLastCursorCall < CURSOR_THRESHOLD_MS) return;
    if (cursorMoved) {
      // Remove highlight for previous
      if (previousHighlight.length > 0) {
        setHighlight(previousHighlight[0], false);
        setHighlight(previousHighlight[1], false);
      }
      // Highlight current
      setHighlight(highlightRow, true);
      setHighlight(highlightCol, true);
      previousHighlight = [highlightRow, highlightCol];
      lastCursorCall = Date.now();
    }
    lastCursorX = cursorX;
    lastCursorY = cursorY;
  }
  /******************************************************************
   * SCRIPT ENTRY (MAIN FUNCTION)
   ******************************************************************/
  function main() {
    if (getIsMaintenance()) {
      console.log("[AWBW Highlight Cursor Coordinates] Maintenance mode is active, not loading script...");
      return;
    }
    // Intercept AWBW functions
    updateCursor = onCursorMove;
    if (zoomInBtn != null) zoomInBtn.addEventListener("click", onZoomChangeEvent);
    if (zoomOutBtn != null) zoomOutBtn.addEventListener("click", onZoomChangeEvent);
    // Synergize with AWBW Maximize if that script is running as well
    const maximizeBtn = getMaximizeBtn();
    if (maximizeBtn != null) {
      console.log("[AWBW Highlight Cursor Coordinates] Found AWBW Maximize script and connected to it.");
      maximizeBtn.addEventListener("click", (event) => {
        isMaximizeToggled = !isMaximizeToggled;
        onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : -1);
      });
    }
    // Scale to current zoom level
    onZoomChangeEvent();
    // Create squares
    for (let row = 0; row < mapRows; row++) {
      let spotSpan = spotSpanTemplate.cloneNode(true);
      spotSpan.id = "grid-spot-row-" + row;
      spotSpan.style.top = row * 16 + "px";
      spotSpan.textContent = row.toString().padStart(2, "0");
      gamemap.appendChild(spotSpan);
    }
    for (let col = 0; col < mapCols; col++) {
      let spotSpan = spotSpanTemplate.cloneNode(true);
      spotSpan.id = "grid-spot-col-" + col;
      spotSpan.style.left = col * 16 + "px";
      spotSpan.textContent = col.toString().padStart(2, "0");
      gamemap.appendChild(spotSpan);
    }
    console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
  }
  main();
})();
