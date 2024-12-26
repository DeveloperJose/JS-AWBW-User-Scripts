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

  const ORANGE_STAR_COs = new Set(["andy", "max", "sami", "nell", "hachi"]);
  const BLUE_MOON_COs = new Set(["olaf", "grit", "colin", "sasha"]);
  const GREEN_EARTH_COs = new Set(["eagle", "drake", "jess", "javier"]);
  const YELLOW_COMET_COs = new Set(["kanbei", "sonja", "sensei", "grimm"]);
  const BLACK_HOLE_COs = new Set(["flak", "lash", "adder", "hawke", "sturm", "jugger", "koal", "kindle", "vonbolt"]);
  new Set([...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs]);
  let mapCols = typeof maxX !== "undefined" ? maxX : -1;
  let mapRows = typeof maxY !== "undefined" ? maxY : -1;
  typeof gameAnims !== "undefined" ? gameAnims : false;

  let ahCursorMove =
    typeof updateCursor !== "undefined"
      ? updateCursor
      : typeof designMapEditor !== "undefined"
        ? designMapEditor.updateCursor
        : null;
  typeof swapCosDisplay !== "undefined" ? swapCosDisplay : null;
  typeof openMenu !== "undefined" ? openMenu : null;
  typeof closeMenu !== "undefined" ? closeMenu : null;
  typeof resetAttack !== "undefined" ? resetAttack : null;
  typeof unitClickHandler !== "undefined" ? unitClickHandler : null;
  typeof waitUnit !== "undefined" ? waitUnit : null;
  typeof animUnit !== "undefined" ? animUnit : null;
  typeof animExplosion !== "undefined" ? animExplosion : null;
  typeof updateAirUnitFogOnMove !== "undefined" ? updateAirUnitFogOnMove : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Fire : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.AttackSeam : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Move : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Capt : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Build : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Load : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Unload : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Supply : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Repair : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Hide : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Unhide : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Join : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Launch : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.NextTurn : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Elimination : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.Power : null;
  typeof actionHandlers !== "undefined" ? actionHandlers.GameOver : null;

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
  isMapEditor ? document.querySelector("#replay-misc-controls") : document.querySelector("#game-map-menu")?.parentNode;

  let maximizeBtn = document.getElementsByClassName("AWBWMaxmiseButton")[0];

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
  function setHighlight(node, highlight) {
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
  function onZoomChangeEvent(_event, zoom = -1) {
    if (zoom < 0) {
      zoom = parseFloat(zoomLevel.textContent);
    }
    let padding = 16 * zoom;
    gamemapContainer.style.paddingBottom = padding + "px";
    gamemapContainer.style.paddingLeft = padding + "px";
  }
  updateCursor = (cursorX, cursorY) => {
    ahCursorMove.apply(updateCursor, [cursorX, cursorY]);
    let cursorRow = Math.abs(Math.ceil(parseInt(cursor.style.top) / 16));
    let cursorCol = Math.abs(Math.ceil(parseInt(cursor.style.left) / 16));
    let highlightRow = document.getElementById("grid-spot-row-" + cursorRow);
    let highlightCol = document.getElementById("grid-spot-col-" + cursorCol);
    let dx = Math.abs(cursorX - lastCursorX);
    let dy = Math.abs(cursorY - lastCursorY);
    let cursorMoved = dx >= 1 || dy >= 1;
    let timeSinceLastCursorCall = Date.now() - lastCursorCall;
    if (timeSinceLastCursorCall < CURSOR_THRESHOLD_MS) return;
    if (cursorMoved) {
      if (previousHighlight.length > 0) {
        setHighlight(previousHighlight[0], false);
        setHighlight(previousHighlight[1], false);
      }
      setHighlight(highlightRow, true);
      setHighlight(highlightCol, true);
      previousHighlight = [highlightRow, highlightCol];
      lastCursorCall = Date.now();
    }
    lastCursorX = cursorX;
    lastCursorY = cursorY;
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
})();
