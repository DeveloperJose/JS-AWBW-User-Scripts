// ==UserScript==
// @name AWBW Highlight Cursor Coordinates
// @description Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.
// @version 1.0.1
// @author DeveloperJose
// @homepage https://github.com/DeveloperJose/JS-AWBW-User-Scripts#readme
// @supportURL https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @match https://awbw.amarriner.com/*?games_id=*
// @match https://awbw.amarriner.com/*?replays_id=*
// @icon https://awbw.amarriner.com/terrain/unit_select.gif
// @license MIT
// @namespace https://awbw.amarriner.com/
// ==/UserScript==

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
let zoomOutBtn = document.querySelector("#zoom-out")
let zoomLevel = document.querySelector(".zoom-level");
let cursor = document.querySelector("#cursor");

/********************** AWBW Page Variables ***********************/
/* global maxX, maxY */
let mapCols = maxX;
let mapRows = maxY;

/********************** AWBW Computed Variables ***********************/
let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;
;// ./shared/other_userscripts.js
/*
 * Constants, functions, and computed variables that come from other userscripts.
 * These are useful when we want to have better synergy with other userscripts.
 */

/********************** AWBW Maximize ***********************/
let maximizeBtn = document.getElementsByClassName("AWBWMaxmiseButton")[0];

;// ./highlight_coordinates/main.js
/********************** AWBW Variables ***********************/
console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");




/********************** Script Variables ***********************/
const CURSOR_THRESHOLD_MS = 30;
let previousHighlight = null;
let lastCursorCall = Date.now();
let isMaximizeToggled = false;

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

/********************** Script Functions **********************/
function onZoomChangeEvent(_pointerEvent = null, zoom = null) {
  if (zoom == null) {
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

