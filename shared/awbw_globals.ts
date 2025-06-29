/**
 * @file Global variables exposed by Advance Wars By Web's JS code and other useful constants.
 */

import { getCurrentPageType, PageType } from "./awbw_page";

// ============================== Advance Wars Stuff ==============================

/**
 * List of Orange Star COs, stored in a set for more efficient lookups.
 */
const ORANGE_STAR_COs = new Set(["andy", "max", "sami", "nell", "hachi", "jake", "rachel"]);

/**
 * List of Blue Moon COs, stored in a set for more efficient lookups.
 */
const BLUE_MOON_COs = new Set(["olaf", "grit", "colin", "sasha"]);

/**
 * List of Green Earth COs, stored in a set for more efficient lookups.
 */
const GREEN_EARTH_COs = new Set(["eagle", "drake", "jess", "javier"]);

/**
 * List of Yellow Comet COs, stored in a set for more efficient lookups.
 */
const YELLOW_COMET_COs = new Set(["kanbei", "sonja", "sensei", "grimm"]);

/**
 * List of Black Hole COs, stored in a set for more efficient lookups.
 * @constant
 */
const BLACK_HOLE_COs = new Set([
  "flak",
  "lash",
  "adder",
  "hawke",
  "sturm",
  "jugger",
  "koal",
  "kindle",
  "vonbolt",
  "bh",
]);

/**
 * List of COs that are only available in Advance Wars 2, stored in a set for more efficient lookups.
 */
export const AW2_ONLY_COs = new Set(["hachi", "colin", "sensei", "jess", "flak", "adder", "lash", "hawke"]);

/**
 * List of COs that are only available in Dual Strike, stored in a set for more efficient lookups.
 */
export const AW_DS_ONLY_COs = new Set([
  "jake",
  "rachel",
  "sasha",
  "javier",
  "grimm",
  "kindle",
  "jugger",
  "koal",
  "vonbolt",
]);

export const AW_RBC_ONLY_COs = new Set([
  "andy",
  "nell",
  "sami",
  "max",
  "hachi",
  "olaf",
  "grit",
  "colin",
  "kanbei",
  "sonja",
  "sensei",
  "eagle",
  "drake",
  "jess",
  "flak",
  "lash",
  "adder",
  "hawke",
  "sturm",
]);

/**
 * List of all COs in the game.
 */
export function getAllCONames(properCase = false) {
  if (!properCase)
    return [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
  const allCOs = [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
  allCOs[allCOs.indexOf("vonbolt")] = "Von Bolt";
  return allCOs.map((co) => co[0].toUpperCase() + co.slice(1));
}

// ============================== AWBW Page Global Variables ==============================
/**
 * The number of columns of this map.
 */
export function getMapColumns() {
  if (getCurrentPageType() === PageType.MapEditor) return designMapEditor.map.maxX;
  return typeof maxX !== "undefined" ? maxX : typeof map_width !== "undefined" ? map_width : -1;
}

/**
 * The number of rows of this map.
 */
export function getMapRows() {
  if (getCurrentPageType() === PageType.MapEditor) return designMapEditor.map.maxY;
  return typeof maxY !== "undefined" ? maxY : typeof map_height !== "undefined" ? map_height : -1;
}

/**
 * Whether game animations are enabled or not.
 */
export function areAnimationsEnabled() {
  return typeof gameAnims !== "undefined" ? gameAnims : false;
}

/**
 * Determines if the given CO is an ally or a part of Black Hole.
 * @param coName - Name of the CO to check.
 * @returns - True if the given CO is part of Black Hole.
 */
export function isBlackHoleCO(coName: string) {
  // Convert to internal format just in case
  coName = coName.toLowerCase().replaceAll(" ", "");
  return BLACK_HOLE_COs.has(coName);
}

/**
 * Randomly selects a CO from the list of all COs.
 * @returns - The name of the randomly selected CO.
 */
export function getRandomCO(excludedCOs: Set<string>) {
  const COs = new Set(getAllCONames());
  for (const co of excludedCOs) COs.delete(co);

  // No COs available, play the map editor music
  if (COs.size === 0) return "map-editor";

  // Only one CO available, return it
  if (COs.size === 1) return [...COs][0];

  return [...COs][Math.floor(Math.random() * COs.size)];
}
