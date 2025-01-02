/**
 * @file Constants, variables, and functions that come from analyzing the web pages of AWBW.
 */

/**
 * Are we in the map editor?
 */
export function getIsMapEditor() {
  return window.location.href.indexOf("editmap.php?") > -1;
}

export function getIsMaintenance() {
  return document.querySelector("#server-maintenance-alert") !== null;
}

export function getIsMovePlanner() {
  return window.location.href.indexOf("moveplanner.php") > -1;
}

// ============================== AWBW Page Elements ==============================
export function getGamemap() {
  return document.querySelector("#gamemap") as HTMLElement;
}

export function getGamemapContainer() {
  return document.querySelector("#gamemap-container") as HTMLElement;
}
export function getZoomInBtn() {
  return document.querySelector("#zoom-in") as HTMLElement;
}
export function getZoomOutBtn() {
  return document.querySelector("#zoom-out") as HTMLElement;
}
// export function getZoomLevel() {
//   return document.querySelector(".zoom-level") as HTMLElement;
// }

export function getCurrentZoomLevel() {
  const storedScale = localStorage.getItem("scale") || "1";
  return parseFloat(storedScale);
}

export function getCursorImg() {
  return document.querySelector("#cursor") as HTMLElement;
}

export function getCoordsDiv() {
  return document.querySelector("#coords") as HTMLElement;
}

export function getEventUsername() {
  return document.querySelector(".event-username") as HTMLElement;
}

export function getReplayControls() {
  return document.querySelector(".replay-controls") as HTMLElement;
}

export function getSupplyIcon() {
  return document.querySelector(".supply-icon") as HTMLElement;
}
export function getTrappedIcon() {
  return document.querySelector(".trapped-icon") as HTMLElement;
}
export function getTargetIcon() {
  return document.querySelector(".target-icon") as HTMLElement;
}
export function getExplosionIcon() {
  return document.querySelector(".destroy-icon") as HTMLElement;
}

export function getReplayOpenBtn() {
  return document.querySelector(".replay-open") as HTMLElement;
}
export function getReplayCloseBtn() {
  return document.querySelector(".replay-close") as HTMLElement;
}
export function getReplayForwardBtn() {
  return document.querySelector(".replay-forward") as HTMLElement;
}
export function getReplayForwardActionBtn() {
  return document.querySelector(".replay-forward-action") as HTMLElement;
}
export function getReplayBackwardBtn() {
  return document.querySelector(".replay-backward") as HTMLElement;
}
export function getReplayBackwardActionBtn() {
  return document.querySelector(".replay-backward-action") as HTMLElement;
}
export function getReplayDaySelectorCheckBox() {
  return document.querySelector(".replay-day-selector") as HTMLElement;
}

/**
 * The HTML node for the unit build menu.
 * Specifically works in the Move Planner.
 * @returns The HTML node for the unit build menu.
 */
export function getBuildMenu() {
  return document.querySelector("#build-menu") as HTMLElement;
}

/**
 * The HTML node for the game menu, the little bar with all the icons.
 */
export function getMenu() {
  if (getIsMaintenance()) return document.querySelector("#main");
  if (getIsMapEditor()) return document.querySelector("#replay-misc-controls");
  if (getIsMovePlanner()) return document.querySelector("#map-controls-container");
  return document.querySelector("#game-map-menu")?.parentNode;
}
// ============================== Useful Page Utilities ==============================

/**
 * Gets the HTML div element for the given building, if it exists.
 * @param buildingID - The ID of the building.
 * @returns - The HTML div element for the building, or null if it does not exist.
 */
export function getBuildingDiv(buildingID: number) {
  return document.querySelector(`.game-building[data-building-id='${buildingID}']`) as HTMLDivElement;
}

export function getAllDamageSquares() {
  return Array.from(document.getElementsByClassName("dmg-square"));
}

/**
 * How much time in milliseconds to let pass between animation steps for {@link moveDivToOffset}.
 * The lower, the faster the "animation" will play.
 * @constant
 */
const moveAnimationDelayMS = 5;

/**
 * A follow-up animation to play after the current one finishes.
 */
interface FollowUpAnimation {
  /**
   * The next animation to play, as [dx, dy, steps].
   */
  then: [number, number, number];
}

/**
 * Animates the movement of a div element through moving it by a certain number of pixels in each direction at each step.
 * @param div - The div element to animate.
 * @param dx - Number of pixels to move left/right (column) at each step
 * @param dy - Number of pixels to move up/down (row) at each step
 * @param steps - Number of steps to take
 * @param followUpAnimations - Any additional animations to play after this one finishes.
 */

export function moveDivToOffset(
  div: HTMLDivElement,
  dx: number,
  dy: number,
  steps: number,
  ...followUpAnimations: FollowUpAnimation[]
) {
  if (steps <= 1) {
    if (!followUpAnimations || followUpAnimations.length === 0) return;
    let nextSet = followUpAnimations.shift()?.then;
    if (!nextSet) return;
    moveDivToOffset(div, nextSet[0], nextSet[1], nextSet[2], ...followUpAnimations);
    return;
  }

  setTimeout(() => moveDivToOffset(div, dx, dy, steps - 1, ...followUpAnimations), moveAnimationDelayMS);
  let left = parseFloat(div.style.left);
  let top = parseFloat(div.style.top);
  left += dx;
  top += dy;
  div.style.left = left + "px";
  div.style.top = top + "px";
}

/**
 * Adds an observer to the cursor coordinates so we can replicate the "updateCursor" function outside of game.php
 * @param onCursorMove - The function to call when the cursor moves.
 */
export function addUpdateCursorObserver(onCursorMove: (cursorX: number, cursorY: number) => void) {
  // We want to catch when div textContent is changed
  const coordsDiv = getCoordsDiv();
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
