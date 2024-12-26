/**
 * @file Functions used by Advance Wars By Web to handle game actions.
 */

export {
  ahCursorMove,
  ahOpenMenu,
  ahCloseMenu,
  ahResetAttack,
  ahUnitClick,
  ahWait,
  ahAnimUnit,
  ahAnimExplosion,
  ahFog,
  ahFire,
  ahAttackSeam,
  ahMove,
  ahCapt,
  ahBuild,
  ahLoad,
  ahUnload,
  ahSupply,
  ahRepair,
  ahHide,
  ahUnhide,
  ahJoin,
  ahLaunch,
  ahNextTurn,
  ahElimination,
  ahPower,
  ahGameOver,
};

let ahCursorMove =
  typeof updateCursor !== "undefined"
    ? updateCursor
    : typeof designMapEditor !== "undefined"
      ? designMapEditor.updateCursor
      : null;

let ahOpenMenu = typeof openMenu !== "undefined" ? openMenu : null;
let ahCloseMenu = typeof closeMenu !== "undefined" ? closeMenu : null;
//  let ahResetCreatedTiles = typeof resetCreatedTiles !== "undefined" ? resetCreatedTiles : null;
let ahResetAttack = typeof resetAttack !== "undefined" ? resetAttack : null;
let ahUnitClick = typeof unitClickHandler !== "undefined" ? unitClickHandler : null;
let ahWait = typeof waitUnit !== "undefined" ? waitUnit : null;
let ahAnimUnit = typeof animUnit !== "undefined" ? animUnit : null;
let ahAnimExplosion = typeof animExplosion !== "undefined" ? animExplosion : null;
let ahFog = typeof updateAirUnitFogOnMove !== "undefined" ? updateAirUnitFogOnMove : null;

let ahFire = typeof actionHandlers !== "undefined" ? actionHandlers.Fire : null;
let ahAttackSeam = typeof actionHandlers !== "undefined" ? actionHandlers.AttackSeam : null;
let ahMove = typeof actionHandlers !== "undefined" ? actionHandlers.Move : null;
let ahCapt = typeof actionHandlers !== "undefined" ? actionHandlers.Capt : null;
let ahBuild = typeof actionHandlers !== "undefined" ? actionHandlers.Build : null;
let ahLoad = typeof actionHandlers !== "undefined" ? actionHandlers.Load : null;
let ahUnload = typeof actionHandlers !== "undefined" ? actionHandlers.Unload : null;
let ahSupply = typeof actionHandlers !== "undefined" ? actionHandlers.Supply : null;
let ahRepair = typeof actionHandlers !== "undefined" ? actionHandlers.Repair : null;
let ahHide = typeof actionHandlers !== "undefined" ? actionHandlers.Hide : null;
let ahUnhide = typeof actionHandlers !== "undefined" ? actionHandlers.Unhide : null;
let ahJoin = typeof actionHandlers !== "undefined" ? actionHandlers.Join : null;
// let ahDelete = actionHandlers.Delete ?? null;
// let ahExplode = actionHandlers.Explode ?? null;
let ahLaunch = typeof actionHandlers !== "undefined" ? actionHandlers.Launch : null;
let ahNextTurn = typeof actionHandlers !== "undefined" ? actionHandlers.NextTurn : null;
let ahElimination = typeof actionHandlers !== "undefined" ? actionHandlers.Elimination : null;
let ahPower = typeof actionHandlers !== "undefined" ? actionHandlers.Power : null;
// let ahSetDraw = actionHandlers.SetDraw ?? null;
// let ahResign = actionHandlers.Resign ?? null;
let ahGameOver = typeof actionHandlers !== "undefined" ? actionHandlers.GameOver : null;
