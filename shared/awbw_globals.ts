/**
 * @file Global variables exposed by Advance Wars By Web's JS code and other useful constants.
 */

// ============================== Advance Wars Stuff ==============================
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
]);

// ============================== AWBW Page Global Variables ==============================
/**
 * The number of columns of this map.
 */
export let mapCols = typeof maxX !== "undefined" ? maxX : -1;

/**
 * The number of rows of this map.
 */
export let mapRows = typeof maxY !== "undefined" ? maxY : -1;

/**
 * Whether game animations are enabled or not.
 */
export let gameAnimations = typeof gameAnims !== "undefined" ? gameAnims : false;

/**
 * Determines if the given CO is an ally or a part of Black Hole.
 * @param coName - Name of the CO to check.
 * @returns - True if the given CO is part of Black Hole.
 */
export function isBlackHoleCO(coName: string) {
  return BLACK_HOLE_COs.has(coName.toLowerCase());
}
