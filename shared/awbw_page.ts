/**
 * @file Constants, variables, and functions that come from analyzing the web pages of AWBW.
 *
 * querySelector()
 * . = class
 * # = id
 */

import { getCurrentDocument } from "../music_player/iframe";

/**
 * The type of page we are currently on.
 */
export enum PageType {
  Maintenance = "Maintenance",
  ActiveGame = "ActiveGame",
  MapEditor = "MapEditor",
  MovePlanner = "MovePlanner",
  LiveQueue = "LiveQueue",
  MainPage = "MainPage",

  Default = "Default", // For all other pages
}

/**
 * Gets the current page type based on the URL.
 * @returns - The current page type.
 */
export function getCurrentPageType(): PageType {
  const doc = getCurrentDocument();
  const isMaintenance = doc.querySelector("#server-maintenance-alert") !== null;
  if (isMaintenance) return PageType.Maintenance;

  if (doc.location.href.indexOf("game.php") > -1) return PageType.ActiveGame;
  if (doc.location.href.indexOf("editmap.php?") > -1) return PageType.MapEditor;
  if (doc.location.href.indexOf("moveplanner.php") > -1) return PageType.MovePlanner;
  if (doc.location.href.indexOf("live_queue.php") > -1) return PageType.LiveQueue;
  if (doc.location.href === "https://awbw.amarriner.com/") return PageType.MainPage;
  return PageType.Default;
}

// ============================== AWBW Page Elements ==============================
export function getGamemap() {
  return getCurrentDocument().querySelector("#gamemap") as HTMLElement;
}

export function getGamemapContainer() {
  return getCurrentDocument().querySelector("#gamemap-container") as HTMLElement;
}
export function getZoomInBtn() {
  return getCurrentDocument().querySelector("#zoom-in") as HTMLElement;
}
export function getZoomOutBtn() {
  return getCurrentDocument().querySelector("#zoom-out") as HTMLElement;
}
// export function getZoomLevel() {
//   return getCurrentDocument().querySelector(".zoom-level") as HTMLElement;
// }

export function getCurrentZoomLevel() {
  const storedScale = localStorage.getItem("scale") || "1";
  return parseFloat(storedScale);
}

export function getCursorImg() {
  return getCurrentDocument().querySelector("#cursor") as HTMLElement;
}

export function getCoordsDiv() {
  return getCurrentDocument().querySelector("#coords") as HTMLElement;
}

export function getEventUsername() {
  return getCurrentDocument().querySelector(".event-username") as HTMLElement;
}

export function getReplayControls() {
  return getCurrentDocument().querySelector(".replay-controls") as HTMLElement;
}

export function getSupplyIcon() {
  return getCurrentDocument().querySelector(".supply-icon") as HTMLElement;
}
export function getTrappedIcon() {
  return getCurrentDocument().querySelector(".trapped-icon") as HTMLElement;
}
export function getTargetIcon() {
  return getCurrentDocument().querySelector(".target-icon") as HTMLElement;
}
export function getExplosionIcon() {
  return getCurrentDocument().querySelector(".destroy-icon") as HTMLElement;
}

export function getReplayOpenBtn() {
  return getCurrentDocument().querySelector(".replay-open") as HTMLElement;
}
export function getReplayCloseBtn() {
  return getCurrentDocument().querySelector(".replay-close") as HTMLElement;
}
export function getReplayForwardBtn() {
  return getCurrentDocument().querySelector(".replay-forward") as HTMLElement;
}
export function getReplayForwardActionBtn() {
  return getCurrentDocument().querySelector(".replay-forward-action") as HTMLElement;
}
export function getReplayBackwardBtn() {
  return getCurrentDocument().querySelector(".replay-backward") as HTMLElement;
}
export function getReplayBackwardActionBtn() {
  return getCurrentDocument().querySelector(".replay-backward-action") as HTMLElement;
}
export function getReplayDaySelectorCheckBox() {
  return getCurrentDocument().querySelector(".replay-day-selector") as HTMLElement;
}

export function getConnectionErrorDiv() {
  return getCurrentDocument().querySelector(".connection-error-msg") as HTMLElement;
}

export function getLiveQueueSelectPopup() {
  return getCurrentDocument().querySelector("#live-queue-select-popup") as HTMLElement;
}

export function getLiveQueueBlockerPopup() {
  return getCurrentDocument().querySelector(".live-queue-blocker-popup") as HTMLElement;
}

/**
 * The HTML node for the unit build menu.
 * Specifically works in the Move Planner.
 * @returns The HTML node for the unit build menu.
 */
export function getBuildMenu() {
  return getCurrentDocument().querySelector("#build-menu") as HTMLElement;
}

// ============================== Useful Page Utilities ==============================

/**
 * Gets the HTML div element for the given building, if it exists.
 * @param buildingID - The ID of the building.
 * @returns - The HTML div element for the building, or null if it does not exist.
 */
export function getBuildingDiv(buildingID: number) {
  return getCurrentDocument().querySelector(`.game-building[data-building-id='${buildingID}']`) as HTMLDivElement;
}

export function getAllDamageSquares() {
  return Array.from(getCurrentDocument().getElementsByClassName("dmg-square"));
}

/**
 * Adds an observer to the cursor coordinates so we can replicate the "updateCursor" function outside of game.php
 * @param onCursorMove - The function to call when the cursor moves.
 */
export function addUpdateCursorObserver(onCursorMove: (cursorX: number, cursorY: number) => void) {
  // We want to catch when div textContent is changed
  const coordsDiv = getCoordsDiv();
  if (!coordsDiv) return;

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type !== "childList") return;
      if (!mutation.target) return;
      if (!mutation.target.textContent) return;

      // (X, Y)
      let coordsText = mutation.target.textContent;

      // Remove parentheses and split by comma
      coordsText = coordsText.substring(1, coordsText.length - 1);
      const splitCoords = coordsText.split(",");

      const cursorX = Number(splitCoords[0]);
      const cursorY = Number(splitCoords[1]);
      onCursorMove(cursorX, cursorY);
    }
  });
  observer.observe(coordsDiv, { childList: true });
}
