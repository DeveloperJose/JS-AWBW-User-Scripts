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

  let mapCols = typeof maxX !== "undefined" ? maxX : -1;
  let mapRows = typeof maxY !== "undefined" ? maxY : -1;
  typeof gameAnims !== "undefined" ? gameAnims : false;

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
  let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;
  isMapEditor
    ? document.querySelector("#replay-misc-controls")
    : document.querySelector("#game-map-menu")?.parentNode;

  let maximizeBtn = document.getElementsByClassName("AWBWMaxmiseButton")[0];

  const CURSOR_THRESHOLD_MS = 30;
  let previousHighlight = [];
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
  function onZoomChangeEvent(_event, zoom = -1) {
    if (zoom < 0) {
      zoom = parseFloat(zoomLevel.textContent);
    }
    let padding = 16 * zoom;
    gamemapContainer.style.paddingBottom = padding + "px";
    gamemapContainer.style.paddingLeft = padding + "px";
  }
  let oldUpdateCursor = updateCursor;
  updateCursor = function () {
    oldUpdateCursor.apply(updateCursor, arguments);
    if (Date.now() - lastCursorCall <= CURSOR_THRESHOLD_MS) {
      lastCursorCall = Date.now();
      return;
    }
    let cursorRow = Math.abs(Math.ceil(parseInt(cursor.style.top) / 16));
    let cursorCol = Math.abs(Math.ceil(parseInt(cursor.style.left) / 16));
    let highlightRow = document.getElementById("grid-spot-row-" + cursorRow);
    let highlightCol = document.getElementById("grid-spot-col-" + cursorCol);
    if (previousHighlight != null) {
      setHighlight(previousHighlight[0], false);
      setHighlight(previousHighlight[1], false);
    }
    setHighlight(highlightRow, true);
    setHighlight(highlightCol, true);
    previousHighlight = [highlightRow, highlightCol];
    lastCursorCall = Date.now();
  };
  if (zoomInBtn != null) {
    zoomInBtn.addEventListener("click", onZoomChangeEvent);
  }
  if (zoomOutBtn != null) {
    zoomOutBtn.addEventListener("click", onZoomChangeEvent);
  }
  if (maximizeBtn != null) {
    console.log("AWBW Highlight Cursor Coordinates script found AWBW Maximize script");
    maximizeBtn.addEventListener("click", (event) => {
      isMaximizeToggled = !isMaximizeToggled;
      onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : -1);
    });
  }
  onZoomChangeEvent();
  for (let row = 0; row < mapRows; row++) {
    let spotSpan = spotSpanTemplate.cloneNode(true);
    spotSpan.id = "grid-spot-row-" + row;
    spotSpan.style.top = row * 16 + "px";
    spotSpan.textContent = row.toString();
    gamemap.appendChild(spotSpan);
  }
  for (let col = 0; col < mapCols; col++) {
    let spotSpan = spotSpanTemplate.cloneNode(true);
    spotSpan.id = "grid-spot-col-" + col;
    spotSpan.style.left = col * 16 + "px";
    spotSpan.textContent = col.toString();
    gamemap.appendChild(spotSpan);
  }
  console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
})();
