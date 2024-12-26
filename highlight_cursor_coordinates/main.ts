/**
 * @file Main script that loads everything for the AWBW Highlight Cursor Coordinates userscript.
 */
import { mapRows, mapCols } from "../shared/awbw_globals";
import { ahCursorMove } from "../shared/awbw_handlers";
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
const FONT_SIZE = 9;
let previousHighlight: HTMLElement[] = [];
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

/********************** Script Functions **********************/
function setHighlight(node: HTMLElement, highlight: boolean) {
  if (!node) {
    console.log("[AWBW Highlight Cursor Coordinates] Node is null, something isn't right.");
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

function onZoomChangeEvent(_event: MouseEvent, zoom: number = -1) {
  if (zoom < 0) {
    zoom = parseFloat(zoomLevel.textContent);
  }

  let padding = 16 * zoom;
  gamemapContainer.style.paddingBottom = padding + "px";
  gamemapContainer.style.paddingLeft = padding + "px";
}

/********************** Intercepted Action Handlers ***********************/
updateCursor = (cursorX, cursorY) => {
  ahCursorMove.apply(updateCursor, [cursorX, cursorY]);

  // Get cursor row and column indices then the span
  let cursorRow = Math.abs(Math.ceil(parseInt(cursor.style.top) / 16));
  let cursorCol = Math.abs(Math.ceil(parseInt(cursor.style.left) / 16));
  let highlightRow = document.getElementById("grid-spot-row-" + cursorRow);
  let highlightCol = document.getElementById("grid-spot-col-" + cursorCol);
  let dx = Math.abs(cursorX - lastCursorX);
  let dy = Math.abs(cursorY - lastCursorY);
  let cursorMoved = dx >= 1 || dy >= 1;
  let timeSinceLastCursorCall = Date.now() - lastCursorCall;

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
  spotSpan.textContent = row.toString().padStart(2, "0");
  gamemap.appendChild(spotSpan);
}

for (let col = 0; col < mapCols; col++) {
  let spotSpan = spotSpanTemplate.cloneNode(true) as HTMLSpanElement;
  spotSpan.id = "grid-spot-col-" + col;
  spotSpan.style.left = col * 16 + "px";
  spotSpan.textContent = col.toString().padStart(2, "0");
  gamemap.appendChild(spotSpan);
}

console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
