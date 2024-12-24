// ==UserScript==
// @name AWBW Highlight Cursor Coordinates
// @description Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.
// @version 1.0.2
// @author DeveloperJose
// @supportURL https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @match https://awbw.amarriner.com/*?games_id=*
// @match https://awbw.amarriner.com/*?replays_id=*
// @icon https://awbw.amarriner.com/terrain/unit_select.gif
// @license MIT
// @namespace https://awbw.amarriner.com/
// ==/UserScript==

new Map(),
  new Set(["flak", "lash", "adder", "hawke", "sturm", "jugger", "koal", "kindle", "vonbolt"]);
let gamemap = document.querySelector("#gamemap"),
  gamemapContainer = document.querySelector("#gamemap-container"),
  zoomInBtn = document.querySelector("#zoom-in"),
  zoomOutBtn = document.querySelector("#zoom-out"),
  zoomLevel = document.querySelector(".zoom-level"),
  cursor = document.querySelector("#cursor"),
  mapCols =
    (document.querySelector(".event-username"),
    document.querySelector(".supply-icon"),
    document.querySelector(".trapped-icon"),
    document.querySelector(".target-icon"),
    document.querySelector(".destroy-icon"),
    document.querySelector(".replay-open"),
    document.querySelector(".replay-close"),
    document.querySelector(".replay-forward"),
    document.querySelector(".replay-forward-action"),
    document.querySelector(".replay-backward"),
    document.querySelector(".replay-backward-action"),
    document.querySelector(".replay-day-selector"),
    "undefined" != typeof maxX ? maxX : -1),
  mapRows = "undefined" != typeof maxY ? maxY : -1,
  isMapEditor =
    ("undefined" != typeof gameAnims && gameAnims,
    window.location.href.indexOf("editmap.php?") > -1);
document
  .querySelector("#profile-menu")
  .getElementsByClassName("dropdown-menu-link")[0]
  .href.split("username=")[1],
  isMapEditor
    ? document.querySelector("#replay-misc-controls")
    : document.querySelector("#game-map-menu");
let maximizeBtn = document.getElementsByClassName("AWBWMaxmiseButton")[0];
let previousHighlight = null,
  isMaximizeToggled = !1,
  lastCursorCall = Date.now(),
  spotSpanTemplate = document.createElement("span");
function setHighlight(node, highlight) {
  let fontWeight = "",
    color = "",
    backgroundColor = "";
  highlight && ((fontWeight = "bold"), (color = "#FFFFFF"), (backgroundColor = "#FF0000")),
    (node.style.fontWeight = fontWeight),
    (node.style.color = color),
    (node.style.backgroundColor = backgroundColor);
}
function onZoomChangeEvent(_pointerEvent = null, zoom = null) {
  null === zoom && (zoom = parseFloat(zoomLevel.textContent));
  let padding = 16 * zoom;
  (gamemapContainer.style.paddingBottom = padding + "px"),
    (gamemapContainer.style.paddingLeft = padding + "px");
}
(spotSpanTemplate.style.width = "16px"),
  (spotSpanTemplate.style.height = "16px"),
  (spotSpanTemplate.style.left = "-16px"),
  (spotSpanTemplate.style.top = 16 * mapRows + "px"),
  (spotSpanTemplate.style.fontFamily = "monospace"),
  (spotSpanTemplate.style.position = "absolute"),
  (spotSpanTemplate.style.fontSize = "11px"),
  (spotSpanTemplate.style.zIndex = "100");
let oldUpdateCursor = updateCursor;
if (
  ((updateCursor = function () {
    if ((oldUpdateCursor.apply(window.updateCursor, arguments), Date.now() - lastCursorCall <= 30))
      return void (lastCursorCall = Date.now());
    let cursorRow = Math.abs(Math.ceil(parseInt(cursor.style.top) / 16)),
      cursorCol = Math.abs(Math.ceil(parseInt(cursor.style.left) / 16)),
      highlightRow = document.getElementById("grid-spot-row-" + cursorRow),
      highlightCol = document.getElementById("grid-spot-col-" + cursorCol);
    null != previousHighlight &&
      (setHighlight(previousHighlight[0], !1), setHighlight(previousHighlight[1], !1)),
      setHighlight(highlightRow, !0),
      setHighlight(highlightCol, !0),
      (previousHighlight = [highlightRow, highlightCol]),
      (lastCursorCall = Date.now());
  }),
  null != zoomInBtn && (zoomInBtn.onclick = onZoomChangeEvent),
  null != zoomOutBtn && (zoomOutBtn.onclick = onZoomChangeEvent),
  null != maximizeBtn)
) {
  console.log("AWBW Highlight Cursor Coordinates script found AWBW Maximize script");
  let old_fn = maximizeBtn.onclick;
  maximizeBtn.onclick = (event) => {
    old_fn(event),
      (isMaximizeToggled = !isMaximizeToggled),
      onZoomChangeEvent(event, isMaximizeToggled ? 3 : null);
  };
}
onZoomChangeEvent();
for (let row = 0; row < mapRows; row++) {
  let spotSpan = spotSpanTemplate.cloneNode(!0);
  (spotSpan.id = "grid-spot-row-" + row),
    (spotSpan.style.top = 16 * row + "px"),
    (spotSpan.textContent = row),
    gamemap.appendChild(spotSpan);
}
for (let col = 0; col < mapCols; col++) {
  let spotSpan = spotSpanTemplate.cloneNode(!0);
  (spotSpan.id = "grid-spot-col-" + col),
    (spotSpan.style.left = 16 * col + "px"),
    (spotSpan.textContent = col),
    gamemap.appendChild(spotSpan);
}
console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
