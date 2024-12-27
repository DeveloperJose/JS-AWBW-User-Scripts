/**
 * @file Constants, functions, and computed variables that come from other userscripts.
 *  These are useful when we want to have better synergy with other userscripts.
 */

/**
 * The button that is used to enter maximization mode or exit it for the AWBW Maximize Extension
 */
export function getMaximizeBtn() {
  return document.getElementsByClassName("AWBWMaxmiseButton")[0] as HTMLDivElement;
}
