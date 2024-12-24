/**
 * @file Functions used by Advance Wars By Web to handle game actions.
 */

/**
 * Function called when the cursor moves.
 */
export let ahCursorMove = updateCursor;
export let ahOpenMenu = openMenu;
export let ahCloseMenu = closeMenu;
// export let ahResetCreatedTiles = resetCreatedTiles;
// export let ahResetAttack = resetAttack;
export let ahUnitClick = unitClickHandler;
export let ahWait = waitUnit;
export let ahAnimUnit = animUnit;
export let ahExplodeAnim = animExplosion;
export let ahFog = updateAirUnitFogOnMove;

export let ahFire = actionHandlers.Fire;
export let ahAttackSeam = actionHandlers.AttackSeam;
export let ahMove = actionHandlers.Move;
export let ahCapt = actionHandlers.Capt;
export let ahBuild = actionHandlers.Build;
export let ahLoad = actionHandlers.Load;
export let ahUnload = actionHandlers.Unload;
export let ahSupply = actionHandlers.Supply;
export let ahRepair = actionHandlers.Repair;
export let ahHide = actionHandlers.Hide;
export let ahUnhide = actionHandlers.Unhide;
export let ahJoin = actionHandlers.Join;
// let ahDelete = actionHandlers.Delete;
// let ahExplode = actionHandlers.Explode;
export let ahLaunch = actionHandlers.Launch;
export let ahNextTurn = actionHandlers.NextTurn;
export let ahElimination = actionHandlers.Elimination;
export let ahPower = actionHandlers.Power;
// let ahSetDraw = actionHandlers.SetDraw;
// let ahResign = actionHandlers.Resign;
export let ahGameOver = actionHandlers.GameOver;
