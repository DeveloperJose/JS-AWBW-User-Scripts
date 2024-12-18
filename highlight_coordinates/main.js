/********************** AWBW Variables ***********************/
let gameMap = document.getElementById("gamemap");
let gameMapContainer = document.getElementById("gamemap-container");
let zoomInBtn = document.getElementById("zoom-in");
let zoomOutBtn = document.getElementById("zoom-out");
let mapCols = maxX;
let mapRows = maxY;

// Intercepted action handlers
let oldUpdateCursor = updateCursor;

/********************** Script Variables ***********************/
const CURSOR_THRESHOLD_MS = 30;
let previousHighlight = null;
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

/********************** Userscript Variables (for other custom scripts that might interfere with this one) ***********************/
let maximizeBtn = document.getElementsByClassName("AWBWMaxmiseButton")[0];
let isMaximizeToggled = false;

/********************** Functions **********************/
function onZoomChangeEvent(eventPointer = null, zoom = null) {
  if (zoom == null) {
    zoom = parseFloat(zoomLevel.textContent);
  }

  let padding = 16 * zoom;

  gameMapContainer.style.paddingBottom = padding + "px";
  gameMapContainer.style.paddingLeft = padding + "px";
}

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/

if (zoomInBtn != null) {
  zoomInBtn.onclick = onZoomChangeEvent;
}

if (zoomOutBtn != null) {
  zoomOutBtn.onclick = onZoomChangeEvent;
}

if (maximizeBtn != null) {
  console.log("AWBW Numbered Grid script found AWBW Maximize script");
  old_fn = maximizeBtn.onclick;
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
  gameMap.appendChild(spotSpan);
}

for (let col = 0; col < mapCols; col++) {
  let spotSpan = spotSpanTemplate.cloneNode(true);
  spotSpan.id = "grid-spot-col-" + col;
  spotSpan.style.left = col * 16 + "px";
  spotSpan.textContent = col;
  gameMap.appendChild(spotSpan);
}

// Override updateCursor() function
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
