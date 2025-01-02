/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @TODO - More map editor sound effects
 * @TODO - Add unwrap to rollup
 */
// Add our CSS to the page using rollup-plugin-postcss
import "./style.css";
import "./style_sliders.css";

import { musicPlayerUI } from "./music_ui";
import { playMusicURL, playThemeSong, preloadAllCommonAudio, preloadAllExtraAudio } from "./music";
import { getCurrentThemeType, loadSettingsFromLocalStorage, musicPlayerSettings } from "./music_settings";
import { addHandlers } from "./handlers";
import { getIsMaintenance, getIsMapEditor, getIsMovePlanner } from "../shared/awbw_page";
import { MAINTENANCE_THEME_URL } from "./resources";
import { notifyCOSelectorListeners } from "../shared/custom_ui";

/**
 * Where should we place the music player UI?
 */
function getMenu() {
  if (getIsMaintenance()) return document.querySelector("#main");
  if (getIsMapEditor()) return document.querySelector("#replay-misc-controls");
  if (getIsMovePlanner()) return document.querySelector("#map-controls-container");
  return document.querySelector("#game-map-menu")?.parentNode;
}

/******************************************************************
 * MODULE EXPORTS
 ******************************************************************/
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

  if (getIsMaintenance()) {
    console.log("[AWBW Improved Music Player] Maintenance mode is active, playing relaxing music...");
    musicPlayerSettings.isPlaying = true;
    musicPlayerUI.setProgress(100);
    musicPlayerUI.openContextMenu();
    playMusicURL(MAINTENANCE_THEME_URL);
    return;
  }

  if (getIsMapEditor()) {
    musicPlayerUI.parent.style.borderTop = "none";
  }

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
