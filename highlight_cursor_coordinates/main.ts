/**
 * @file Main script that loads everything for the AWBW Highlight Cursor Coordinates userscript.
 */
import { mapRows, mapCols } from "../shared/awbw_globals";
import {
  gamemap,
  gamemapContainer,
  zoomInBtn,
  zoomOutBtn,
  zoomLevel,
  cursor,
} from "../shared/awbw_page";
import { maximizeBtn } from "../shared/other_userscripts";

/********************** Script Variables ***********************/
const CURSOR_THRESHOLD_MS = 30;
let previousHighlight: HTMLElement[] = [];
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
function setHighlight(node: HTMLElement, highlight: boolean) {
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

function onZoomChangeEvent(_event: MouseEvent, zoom: number = -1) {
  if (zoom < 0) {
    zoom = parseFloat(zoomLevel.textContent);
  }

  let padding = 16 * zoom;
  gamemapContainer.style.paddingBottom = padding + "px";
  gamemapContainer.style.paddingLeft = padding + "px";
}

/********************** Intercepted Action Handlers ***********************/
let oldUpdateCursor = updateCursor;

updateCursor = function () {
  oldUpdateCursor.apply(updateCursor, arguments);

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
  zoomInBtn.addEventListener("click", onZoomChangeEvent);
}

if (zoomOutBtn != null) {
  zoomOutBtn.addEventListener("click", onZoomChangeEvent);
}

// Synergize with AWBW Maximize if that script is running as well
if (maximizeBtn != null) {
  console.log("AWBW Highlight Cursor Coordinates script found AWBW Maximize script");
  maximizeBtn.addEventListener("click", (event) => {
    isMaximizeToggled = !isMaximizeToggled;
    onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : -1);
  });
  // let old_fn = maximizeBtn.onclick;
  // maximizeBtn.onclick = (h, event) => {
  //   old_fn(h, event);
  //   isMaximizeToggled = !isMaximizeToggled;
  //   onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : null);
  // };
}

// Scale to current zoom level
onZoomChangeEvent(null);

// Create squares
for (let row = 0; row < mapRows; row++) {
  let spotSpan = spotSpanTemplate.cloneNode(true) as HTMLSpanElement;
  spotSpan.id = "grid-spot-row-" + row;
  spotSpan.style.top = row * 16 + "px";
  spotSpan.textContent = row.toString();
  gamemap.appendChild(spotSpan);
}

for (let col = 0; col < mapCols; col++) {
  let spotSpan = spotSpanTemplate.cloneNode(true) as HTMLSpanElement;
  spotSpan.id = "grid-spot-col-" + col;
  spotSpan.style.left = col * 16 + "px";
  spotSpan.textContent = col.toString();
  gamemap.appendChild(spotSpan);
}

console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
