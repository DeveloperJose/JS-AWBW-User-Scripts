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

/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./highlight_coordinates/main.js":
/*!***************************************!*\
  !*** ./highlight_coordinates/main.js ***!
  \***************************************/
/***/ (() => {

eval("/********************** AWBW Variables ***********************/\r\nlet gameMap = document.getElementById(\"gamemap\");\r\nlet gameMapContainer = document.getElementById(\"gamemap-container\");\r\nlet zoomInBtn = document.getElementById(\"zoom-in\");\r\nlet zoomOutBtn = document.getElementById(\"zoom-out\");\r\nlet mapCols = maxX;\r\nlet mapRows = maxY;\r\n\r\n// Intercepted action handlers\r\nlet oldUpdateCursor = updateCursor;\r\n\r\n/********************** Script Variables ***********************/\r\nconst CURSOR_THRESHOLD_MS = 30;\r\nlet previousHighlight = null;\r\nlet lastCursorCall = Date.now();\r\n\r\nlet spotSpanTemplate = document.createElement(\"span\");\r\nspotSpanTemplate.style.width = \"16px\";\r\nspotSpanTemplate.style.height = \"16px\";\r\nspotSpanTemplate.style.left = \"-16px\";\r\nspotSpanTemplate.style.top = mapRows * 16 + \"px\";\r\nspotSpanTemplate.style.fontFamily = \"monospace\";\r\nspotSpanTemplate.style.position = \"absolute\";\r\nspotSpanTemplate.style.fontSize = \"11px\";\r\nspotSpanTemplate.style.zIndex = \"100\";\r\n// spotSpanTemplate.style.visibility = \"hidden\";\r\n\r\nfunction setHighlight(node, highlight) {\r\n  let fontWeight = \"\";\r\n  let color = \"\";\r\n  let backgroundColor = \"\";\r\n\r\n  if (highlight) {\r\n    fontWeight = \"bold\";\r\n    color = \"#FFFFFF\";\r\n    backgroundColor = \"#FF0000\";\r\n  }\r\n  node.style.fontWeight = fontWeight;\r\n  node.style.color = color;\r\n  node.style.backgroundColor = backgroundColor;\r\n}\r\n\r\n/********************** Userscript Variables (for other custom scripts that might interfere with this one) ***********************/\r\nlet maximizeBtn = document.getElementsByClassName(\"AWBWMaxmiseButton\")[0];\r\nlet isMaximizeToggled = false;\r\n\r\n/********************** Functions **********************/\r\nfunction onZoomChangeEvent(eventPointer = null, zoom = null) {\r\n  if (zoom == null) {\r\n    zoom = parseFloat(zoomLevel.textContent);\r\n  }\r\n\r\n  let padding = 16 * zoom;\r\n\r\n  gameMapContainer.style.paddingBottom = padding + \"px\";\r\n  gameMapContainer.style.paddingLeft = padding + \"px\";\r\n}\r\n\r\n/******************************************************************\r\n * SCRIPT ENTRY (MAIN FUNCTION)\r\n ******************************************************************/\r\n\r\nif (zoomInBtn != null) {\r\n  zoomInBtn.onclick = onZoomChangeEvent;\r\n}\r\n\r\nif (zoomOutBtn != null) {\r\n  zoomOutBtn.onclick = onZoomChangeEvent;\r\n}\r\n\r\nif (maximizeBtn != null) {\r\n  console.log(\"AWBW Numbered Grid script found AWBW Maximize script\");\r\n  old_fn = maximizeBtn.onclick;\r\n  maximizeBtn.onclick = (event) => {\r\n    old_fn(event);\r\n    isMaximizeToggled = !isMaximizeToggled;\r\n    onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : null);\r\n  };\r\n}\r\n\r\n// Scale to current zoom level\r\nonZoomChangeEvent();\r\n\r\n// Create squares\r\nfor (let row = 0; row < mapRows; row++) {\r\n  let spotSpan = spotSpanTemplate.cloneNode(true);\r\n  spotSpan.id = \"grid-spot-row-\" + row;\r\n  spotSpan.style.top = row * 16 + \"px\";\r\n  spotSpan.textContent = row;\r\n  gameMap.appendChild(spotSpan);\r\n}\r\n\r\nfor (let col = 0; col < mapCols; col++) {\r\n  let spotSpan = spotSpanTemplate.cloneNode(true);\r\n  spotSpan.id = \"grid-spot-col-\" + col;\r\n  spotSpan.style.left = col * 16 + \"px\";\r\n  spotSpan.textContent = col;\r\n  gameMap.appendChild(spotSpan);\r\n}\r\n\r\n// Override updateCursor() function\r\nupdateCursor = function () {\r\n  oldUpdateCursor.apply(updateCursor, arguments);\r\n\r\n  if (Date.now() - lastCursorCall <= CURSOR_THRESHOLD_MS) {\r\n    lastCursorCall = Date.now();\r\n    return;\r\n  }\r\n\r\n  // Get cursor row and column indices then the span\r\n  let cursorRow = Math.abs(Math.ceil(parseInt(cursor.style.top) / 16));\r\n  let cursorCol = Math.abs(Math.ceil(parseInt(cursor.style.left) / 16));\r\n  let highlightRow = document.getElementById(\"grid-spot-row-\" + cursorRow);\r\n  let highlightCol = document.getElementById(\"grid-spot-col-\" + cursorCol);\r\n\r\n  // Remove highlight for previous\r\n  if (previousHighlight != null) {\r\n    setHighlight(previousHighlight[0], false);\r\n    setHighlight(previousHighlight[1], false);\r\n  }\r\n\r\n  // Highlight current\r\n  setHighlight(highlightRow, true);\r\n  setHighlight(highlightCol, true);\r\n  previousHighlight = [highlightRow, highlightCol];\r\n\r\n  lastCursorCall = Date.now();\r\n};\r\n\n\n//# sourceURL=webpack://js-awbw-user-scripts/./highlight_coordinates/main.js?");

/***/ })

/******/ });
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = {};
/******/ __webpack_modules__["./highlight_coordinates/main.js"]();
/******/ 
