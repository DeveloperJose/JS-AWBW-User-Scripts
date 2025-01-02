/**
 * @file Main script that loads everything for the AWBW Highlight Cursor Coordinates userscript.
 */

import { getMapColumns, getMapRows } from "../shared/awbw_globals";
import { getResizeMapFn } from "../shared/awbw_handlers";
import {
  addUpdateCursorObserver,
  getCurrentZoomLevel,
  getGamemap,
  getGamemapContainer,
  getIsMaintenance,
  getIsMapEditor,
  getIsMovePlanner,
  getZoomInBtn,
  getZoomOutBtn,
} from "../shared/awbw_page";
import { CustomMenuSettingsUI } from "../shared/custom_ui";
import { getMaximizeBtn } from "../shared/other_userscripts";

/********************** AWBW Stuff ***********************/
const gamemap = getGamemap();
const gamemapContainer = getGamemapContainer();
const zoomInBtn = getZoomInBtn();
const zoomOutBtn = getZoomOutBtn();

let ahResizeMap = getResizeMapFn();

/********************** Script Variables & Functions ***********************/
const CURSOR_THRESHOLD_MS = 30;
const FONT_SIZE = 9;
const PREFIX = "highlight_cursor_coordinates";
const BUTTON_IMG_URL = "https://awbw.amarriner.com/terrain/unit_select.gif";

let isEnabled = true;
let previousHighlight: HTMLElement[] = [];
let isMaximizeToggled = false;
let lastCursorCall = Date.now();
let lastCursorX = -1;
let lastCursorY = -1;
const currentSquares = new Array<HTMLElement>();

/**
 * Where should we place the highlight cursor coordinates UI?
 */
function getMenu() {
  if (getIsMapEditor()) return document.querySelector("#design-map-controls-container")?.children[1];
  if (getIsMovePlanner()) return document.querySelector("#map-controls-container");

  return document.querySelector("#game-menu-controls")?.children[0];
}

function setHighlight(node: HTMLElement, highlight: boolean) {
  if (!isEnabled) return;

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

function onZoomChangeEvent(_event?: MouseEvent, zoom: number = -1) {
  if (!isEnabled) return;
  if (zoom < 0) {
    zoom = getCurrentZoomLevel();
  }

  const padding = 16 * zoom;
  gamemapContainer.style.paddingBottom = padding + "px";
  gamemapContainer.style.paddingLeft = padding + "px";
}

function onCursorMove(cursorX: number, cursorY: number) {
  if (!isEnabled) return;

  // Get cursor row and column indices then the span
  const highlightRow = document.getElementById("grid-spot-row-" + cursorY);
  const highlightCol = document.getElementById("grid-spot-col-" + cursorX);
  const dx = Math.abs(cursorX - lastCursorX);
  const dy = Math.abs(cursorY - lastCursorY);
  const cursorMoved = dx >= 1 || dy >= 1;
  const timeSinceLastCursorCall = Date.now() - lastCursorCall;

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

function onResizeMap(num: number, btnName: string) {
  ahResizeMap?.apply(ahResizeMap, [num, btnName]);
  if (!isEnabled) return;
  addHighlightBoxesAroundMapEdges();
}

function clearHighlightBoxes() {
  if (currentSquares.length > 0) {
    currentSquares.forEach((element) => element.remove());
  }
  gamemapContainer.style.paddingBottom = "0px";
  gamemapContainer.style.paddingLeft = "0px";
}

function addHighlightBoxesAroundMapEdges() {
  const mapRows = getMapRows();
  const mapCols = getMapColumns();
  console.debug("[AWBW Highlight Cursor Coordinates] Adding highlight boxes", mapRows, mapCols);

  const spotSpanTemplate = document.createElement("span");
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

  // Clear previous squares
  clearHighlightBoxes();

  // Create squares
  for (let row = 0; row < mapRows; row++) {
    const spotSpan = spotSpanTemplate.cloneNode(true) as HTMLSpanElement;
    spotSpan.id = "grid-spot-row-" + row;
    spotSpan.style.top = row * 16 + "px";
    spotSpan.textContent = row.toString().padStart(2, "0");
    gamemap.appendChild(spotSpan);
    currentSquares.push(spotSpan);
  }

  for (let col = 0; col < mapCols; col++) {
    const spotSpan = spotSpanTemplate.cloneNode(true) as HTMLSpanElement;
    spotSpan.id = "grid-spot-col-" + col;
    spotSpan.style.left = col * 16 + "px";
    spotSpan.textContent = col.toString().padStart(2, "0");
    gamemap.appendChild(spotSpan);
    currentSquares.push(spotSpan);
  }

  onZoomChangeEvent();
}

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
function main() {
  if (getIsMaintenance()) {
    console.log("[AWBW Highlight Cursor Coordinates] Maintenance mode is active, not loading script...");
    return;
  }
  // designmap.php, wait until designerMapEditor is loaded to run script
  const isMapEditorAndNotLoaded = getIsMapEditor() && !designMapEditor?.loaded;
  if (isMapEditorAndNotLoaded) {
    const interval = setInterval(() => {
      if (designMapEditor.loaded) {
        ahResizeMap = getResizeMapFn();
        main();
        clearInterval(interval);
      }
    }, 1000);
    return;
  }

  // Intercept AWBW functions (global)
  addUpdateCursorObserver(onCursorMove);

  // Intercept designmap functions
  if (getIsMapEditor()) {
    designMapEditor.resizeMap = onResizeMap;
  }

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

  // Add highlight boxes around map edges
  addHighlightBoxesAroundMapEdges();

  // Create UI button to toggle highlight boxes
  const customUI = new CustomMenuSettingsUI(PREFIX, BUTTON_IMG_URL, "Disable Highlight Cursor Coordinates");
  customUI.addEventListener("click", () => {
    isEnabled = !isEnabled;
    const hoverText = isEnabled ? "Disable Highlight Cursor Coordinates" : "Enable Highlight Cursor Coordinates";
    customUI.setHoverText(hoverText, true);

    if (isEnabled) addHighlightBoxesAroundMapEdges();
    else clearHighlightBoxes();
  });
  customUI.addToAWBWPage(getMenu() as HTMLElement, true);
  customUI.setProgress(100);

  if (getIsMapEditor() || getIsMovePlanner()) customUI.parent.style.height = "31px";

  console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
}
main();
