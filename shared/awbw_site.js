/*
 * Constants, functions, and computed variables that come from analyzing the web pages of AWBW.
 * Another way to think of this file is that it represents the AWBW "API".
 */
/********************** AWBW Page Elements ***********************/
// More can be easily found here https://awbw.amarriner.com/js/lib/game.js?1733945699
export let gamemap = document.querySelector("#gamemap");
export let gamemapContainer = document.querySelector("#gamemap-container");
export let zoomInBtn = document.querySelector("#zoom-in");
export let zoomOutBtn = document.querySelector("#zoom-out")
export let zoomLevel = document.querySelector(".zoom-level");
export let cursor = document.querySelector("#cursor");

/********************** AWBW Page Variables ***********************/
/* global maxX, maxY */
export let mapCols = maxX;
export let mapRows = maxY;

/********************** AWBW Computed Variables ***********************/
export let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;