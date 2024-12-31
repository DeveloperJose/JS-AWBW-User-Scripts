/**
 * @file Functions used by Advance Wars By Web to handle game actions.
 */

import { getIsMapEditor } from "./awbw_page";

export function getCursorMoveFn() {
  if (getIsMapEditor()) {
    return typeof designMapEditor !== "undefined" ? designMapEditor.updateCursor : null;
  }
  return typeof updateCursor !== "undefined" ? updateCursor : null;
}

export function getShowEventScreenFn() {
  return typeof showEventScreen !== "undefined" ? showEventScreen : null;
}

export function getSwapCosDisplayFn() {
  return typeof swapCosDisplay !== "undefined" ? swapCosDisplay : null;
}

export function getOpenMenuFn() {
  return typeof openMenu !== "undefined" ? openMenu : null;
}

export function getCloseMenuFn() {
  return typeof closeMenu !== "undefined" ? closeMenu : null;
}

export function getResetAttackFn() {
  return typeof resetAttack !== "undefined" ? resetAttack : null;
}

export function getUnitClickFn() {
  return typeof unitClickHandler !== "undefined" ? unitClickHandler : null;
}

export function getWaitFn() {
  return typeof waitUnit !== "undefined" ? waitUnit : null;
}

export function getAnimUnitFn() {
  return typeof animUnit !== "undefined" ? animUnit : null;
}

export function getAnimExplosionFn() {
  return typeof animExplosion !== "undefined" ? animExplosion : null;
}

export function getFogFn() {
  return typeof updateAirUnitFogOnMove !== "undefined" ? updateAirUnitFogOnMove : null;
}

export function getFireFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Fire : null;
}

export function getAttackSeamFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.AttackSeam : null;
}

export function getMoveFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Move : null;
}

export function getCaptFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Capt : null;
}

export function getBuildFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Build : null;
}

export function getLoadFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Load : null;
}

export function getUnloadFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Unload : null;
}

export function getSupplyFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Supply : null;
}

export function getRepairFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Repair : null;
}

export function getHideFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Hide : null;
}

export function getUnhideFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Unhide : null;
}

export function getJoinFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Join : null;
}

export function getLaunchFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Launch : null;
}

export function getNextTurnFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.NextTurn : null;
}

export function getEliminationFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Elimination : null;
}

export function getPowerFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.Power : null;
}

export function getGameOverFn() {
  return typeof actionHandlers !== "undefined" ? actionHandlers.GameOver : null;
}
