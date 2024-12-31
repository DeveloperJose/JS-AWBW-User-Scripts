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
export function getZoomLevel() {
  return document.querySelector(".zoom-level") as HTMLElement;
}
export function getCursor() {
  return document.querySelector("#cursor") as HTMLElement;
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
 * The HTML node for the game menu, the little bar with all the icons.
 */
export function getMenu() {
  if (getIsMaintenance()) return document.querySelector("#main");
  if (getIsMapEditor()) return document.querySelector("#replay-misc-controls");
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

declare var overlib: any;
declare const STICKY: number;
declare const CAPTION: number;
declare const OFFSETY: number;
declare const OFFSETX: number;
declare const CLOSECLICK: number;

export function debug() {
  console.log("wpadfs");
}

function global3() {
  console.log("global3");
}
export function createCOSelector() {
  // let location = document.location.href;
  let location = "javascript:void(0)";
  global3();

  const coSelector = document.createElement("a");
  coSelector.id = "music-player-co-selector";
  coSelector.classList.add("game-tools-btn");
  coSelector.href = "javascript:void(0)";
  coSelector.onclick = () => {
    console.log("overlib");
    return overlib(
      `<table><tr><td><table>
      <tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2adder.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text>
      <a onclick="window.test2();" href=${location}&new_co_id=11&amp;change_co=1>Adder</a></b></span></td></tr>

      <tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2andy.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text>
      <a href=${location}&amp;new_co_id=1&amp;change_co=1>Andy</a></b></span></td></tr>
      
      <tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2colin.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text>
      <a href=${location}&amp;new_co_id=15&amp;change_co=1>Colin</a></b></span></td></tr>
      
      <tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2drake.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=5&amp;change_co=1>Drake</a></b></span></td></tr></table></td><td valign=top><table><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2eagle.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=10&amp;change_co=1>Eagle</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2flak.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=25&amp;change_co=1>Flak</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2grimm.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=20&amp;change_co=1>Grimm</a></b></span></td></tr><tr><td class=borderblue><img class=co_portrait src=terrain/ani/aw2grit.png?v=1></td><td class=borderblue align=center valign=center><span class=small_text><b>Grit</a></b></span></td></tr></table></td><td valign=top><table><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2hachi.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=17&amp;change_co=1>Hachi</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2hawke.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=12&amp;change_co=1>Hawke</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2jake.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=22&amp;change_co=1>Jake</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2javier.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=27&amp;change_co=1>Javier</a></b></span></td></tr></table></td><td valign=top><table><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2jess.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=14&amp;change_co=1>Jess</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2jugger.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=26&amp;change_co=1>Jugger</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2kanbei.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=3&amp;change_co=1>Kanbei</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2kindle.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=23&amp;change_co=1>Kindle</a></b></span></td></tr></table></td><td valign=top><table><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2koal.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=21&amp;change_co=1>Koal</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2lash.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=16&amp;change_co=1>Lash</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2max.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=7&amp;change_co=1>Max</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2nell.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=24&amp;change_co=1>Nell</a></b></span></td></tr></table></td><td valign=top><table><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2olaf.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=9&amp;change_co=1>Olaf</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2rachel.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=28&amp;change_co=1>Rachel</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2sami.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=8&amp;change_co=1>Sami</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2sasha.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=19&amp;change_co=1>Sasha</a></b></span></td></tr></table></td><td valign=top><table><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2sensei.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=13&amp;change_co=1>Sensei</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2sonja.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=18&amp;change_co=1>Sonja</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2sturm.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=29&amp;change_co=1>Sturm</a></b></span></td></tr><tr><td class=borderwhite><img class=co_portrait src=terrain/ani/aw2vonbolt.png?v=1></td><td class=borderwhite align=center valign=center><span class=small_text><a href=${location}&amp;new_co_id=30&amp;change_co=1>Von Bolt</a></b></span></td></tr></table></td><td valign=top><table></table></td></tr></table>`,
      STICKY,
      CAPTION,
      "<img src=terrain/ani/blankred.gif height=16 width=1 align=absmiddle>Select CO",
      OFFSETY,
      25,
      OFFSETX,
      -322,
      CLOSECLICK,
    );
  };

  const imgCaret = document.createElement("img");
  imgCaret.id = "music-player-co-caret";
  imgCaret.src = "terrain/co_down_caret.gif";
  imgCaret.style.position = "absolute";
  imgCaret.style.top = "28px";
  imgCaret.style.left = "25px";
  imgCaret.style.border = "none";
  imgCaret.style.zIndex = "110";

  const imgCO = document.createElement("img");
  imgCO.id = "music-player-co-portrait";
  imgCO.src = "terrain/ani/aw2andy.png?v=1";
  imgCO.style.position = "absolute";
  imgCO.style.top = "0px";
  imgCO.style.left = "0px";
  imgCO.style.borderColor = "#009966";
  imgCO.style.zIndex = "100";
  imgCO.style.border = "2";
  // imgCO.align = "absmiddle";
  imgCO.style.verticalAlign = "middle";
  imgCO.classList.add("co_portrait");

  coSelector.appendChild(imgCaret);
  coSelector.appendChild(imgCO);
  return coSelector;
}
