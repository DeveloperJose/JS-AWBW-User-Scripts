/**
 * @file Constants, variables, and functions that come from analyzing the web pages of AWBW.
 */

// ============================== AWBW Page Elements ==============================
export let gamemap: HTMLElement = document.querySelector("#gamemap");
export let gamemapContainer: HTMLElement = document.querySelector("#gamemap-container");
export let zoomInBtn: HTMLElement = document.querySelector("#zoom-in");
export let zoomOutBtn: HTMLElement = document.querySelector("#zoom-out");
export let zoomLevel: HTMLElement = document.querySelector(".zoom-level");
export let cursor: HTMLElement = document.querySelector("#cursor");
export let eventUsername: HTMLElement = document.querySelector(".event-username");

export let supplyIcon: HTMLElement = document.querySelector(".supply-icon");
export let trappedIcon: HTMLElement = document.querySelector(".trapped-icon");
export let targetIcon: HTMLElement = document.querySelector(".target-icon");
export let explosionIcon: HTMLElement = document.querySelector(".destroy-icon");

export let replayOpenBtn: HTMLElement = document.querySelector(".replay-open");
export let replayCloseBtn: HTMLElement = document.querySelector(".replay-close");
export let replayForwardBtn: HTMLElement = document.querySelector(".replay-forward");
export let replayForwardActionBtn: HTMLElement = document.querySelector(".replay-forward-action");
export let replayBackwardBtn: HTMLElement = document.querySelector(".replay-backward");
export let replayBackwardActionBtn: HTMLElement = document.querySelector(".replay-backward-action");
export let replayDaySelectorCheckBox: HTMLElement = document.querySelector(".replay-day-selector");

/**
 * Are we in the map editor?
 */

export let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;

/**
 * The HTML node for the game menu, the little bar with all the icons.
 */
export let menu = isMapEditor
  ? document.querySelector("#replay-misc-controls")
  : document.querySelector("#game-map-menu")?.parentNode;

// ============================== Useful Page Utilities ==============================

/**
 * Gets the HTML div element for the given building, if it exists.
 * @param buildingID - The ID of the building.
 * @returns - The HTML div element for the building, or null if it does not exist.
 */
export function getBuildingDiv(buildingID: number): HTMLDivElement {
  return document.querySelector(`.game-building[data-building-id='${buildingID}']`);
}

/**
 * How much time in milliseconds to let pass between animation steps for {@link moveDivToOffset}.
 * The lower, the faster the "animation" will play.
 */
let moveAnimationDelayMS = 5;

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
  ...followUpAnimations: DivAnimationData[]
) {
  if (steps <= 1) {
    if (followUpAnimations.length > 0) {
      let nextSet = followUpAnimations.shift().then;
      moveDivToOffset(div, nextSet[0], nextSet[1], nextSet[2], ...followUpAnimations);
    }
    return;
  }

  setTimeout(
    () => moveDivToOffset(div, dx, dy, steps - 1, ...followUpAnimations),
    moveAnimationDelayMS,
  );
  let left = parseFloat(div.style.left);
  let top = parseFloat(div.style.top);
  left += dx;
  top += dy;
  div.style.left = left + "px";
  div.style.top = top + "px";
}
