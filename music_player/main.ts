/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @TODO - More map editor sound effects
 */
// Add our CSS to the page using rollup-plugin-postcss
import "./style.css";
import "./style_sliders.css";

import { musicPlayerUI } from "./music_ui";
import { playMusicURL, playThemeSong, preloadAllCommonAudio, preloadAllExtraAudio } from "./music";
import { getCurrentThemeType, loadSettingsFromLocalStorage, musicPlayerSettings } from "./music_settings";
import { addHandlers } from "./handlers";
import { getIsMaintenance, getIsMapEditor, getIsMovePlanner, getIsYourGames } from "../shared/awbw_page";
import { SpecialTheme } from "./resources";
import { notifyCOSelectorListeners } from "../shared/custom_ui";

/**
 * Where should we place the music player UI?
 */
function getMenu() {
  if (getIsMaintenance()) return document.querySelector("#main");
  if (getIsMapEditor()) return document.querySelector("#replay-misc-controls");
  if (getIsMovePlanner()) return document.querySelector("#map-controls-container");
  if (getIsYourGames()) return document.querySelector("#left-side-menu-container");
  return document.querySelector("#game-map-menu")?.parentNode;
}

/******************************************************************
 * MODULE EXPORTS
 ******************************************************************/
// Exporting this function is necessary for the CO Selector to work
export { notifyCOSelectorListeners as notifyCOSelectorListeners };

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
export function main() {
  console.debug("[AWBW Improved Music Player] Script starting...");
  musicPlayerUI.addToAWBWPage(getMenu() as HTMLElement);
  addHandlers();

  if (getIsMovePlanner()) {
    console.log("[AWBW Improved Music Player] Move Planner detected");
    musicPlayerSettings.isPlaying = true;
    musicPlayerUI.setProgress(100);
    return;
  }

  if (getIsMaintenance() || getIsYourGames()) {
    console.log("[AWBW Improved Music Player] Maintenance mode or Your Games detected, playing music...");
    musicPlayerSettings.isPlaying = true;
    musicPlayerUI.setProgress(100);
    musicPlayerUI.openContextMenu();
    const theme = getIsMaintenance() ? SpecialTheme.Maintenance : SpecialTheme.ModeSelect;
    playMusicURL(theme);
    return;
  }

  if (getIsMapEditor()) {
    musicPlayerUI.parent.style.borderTop = "none";
  }

  // Map editor and game.php pages so allow settings to be saved
  loadSettingsFromLocalStorage();
  preloadAllCommonAudio(() => {
    console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");

    // Set dynamic settings based on the current game state
    // Lastly, update the UI to reflect the current settings
    musicPlayerSettings.themeType = getCurrentThemeType();
    musicPlayerUI.updateAllInputLabels();
    playThemeSong();

    preloadAllExtraAudio(() => {
      console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
      playThemeSong();
    });
  });
}

main();
