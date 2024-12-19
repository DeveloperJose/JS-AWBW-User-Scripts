/********************** AWBW Variables ***********************/
console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");

import * as awbw_site from "../shared/awbw_site";
import * as other_scripts from "../shared/other_userscripts";

/********************** Script Variables ***********************/
const CURSOR_THRESHOLD_MS = 30;
let previousHighlight = null;
let isMaximizeToggled = false;
let lastCursorCall = Date.now();

let spotSpanTemplate = document.createElement("span");
spotSpanTemplate.style.width = "16px";
spotSpanTemplate.style.height = "16px";
spotSpanTemplate.style.left = "-16px";
spotSpanTemplate.style.top = awbw_site.mapRows * 16 + "px";
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
  if (zoom == null) {
    zoom = parseFloat(awbw_site.zoomLevel.textContent);
  }

  let padding = 16 * zoom;
  awbw_site.gamemapContainer.style.paddingBottom = padding + "px";
  awbw_site.gamemapContainer.style.paddingLeft = padding + "px";
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
  let cursorRow = Math.abs(Math.ceil(parseInt(awbw_site.cursor.style.top) / 16));
  let cursorCol = Math.abs(Math.ceil(parseInt(awbw_site.cursor.style.left) / 16));
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

if (awbw_site.zoomInBtn != null) {
  awbw_site.zoomInBtn.onclick = onZoomChangeEvent;
}

if (awbw_site.zoomOutBtn != null) {
  awbw_site.zoomOutBtn.onclick = onZoomChangeEvent;
}

// Synergize with AWBW Maximize if that script is running as well
if (other_scripts.maximizeBtn != null) {
  console.log("AWBW Highlight Cursor Coordinates script found AWBW Maximize script");
  let old_fn = other_scripts.maximizeBtn.onclick;
  other_scripts.maximizeBtn.onclick = (event) => {
    old_fn(event);
    isMaximizeToggled = !isMaximizeToggled;
    onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : null);
  };
}

// Scale to current zoom level
onZoomChangeEvent();

// Create squares
for (let row = 0; row < awbw_site.mapRows; row++) {
  let spotSpan = spotSpanTemplate.cloneNode(true);
  spotSpan.id = "grid-spot-row-" + row;
  spotSpan.style.top = row * 16 + "px";
  spotSpan.textContent = row;
  awbw_site.gamemap.appendChild(spotSpan);
}

for (let col = 0; col < awbw_site.mapCols; col++) {
  let spotSpan = spotSpanTemplate.cloneNode(true);
  spotSpan.id = "grid-spot-col-" + col;
  spotSpan.style.left = col * 16 + "px";
  spotSpan.textContent = col;
  awbw_site.gamemap.appendChild(spotSpan);
}
