/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @todo Normalize sound levels
 * @todo Custom settings for each CO if wanted
 * @todo Shuffle button?
 */

// Add our CSS to the page using rollup-plugin-postcss
import "./style.css";
import "./style_sliders.css";

import { musicPlayerUI } from "./music_ui";
import { playMusicURL, playThemeSong, preloadAllCommonAudio, preloadAllExtraAudio } from "./music";
import { getCurrentThemeType, loadSettingsFromLocalStorage, musicPlayerSettings } from "./music_settings";
import { addHandlers } from "./handlers";
import { getIsMaintenance } from "../shared/awbw_page";
import { MAINTENANCE_THEME_URL } from "./resources";
import { hasGameEnded } from "../shared/awbw_game";

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
function main() {
  console.debug("[AWBW Improved Music Player] Script starting...");

  if (getIsMaintenance()) {
    console.log("[AWBW Improved Music Player] Maintenance mode is active, playing relaxing music...");
    musicPlayerSettings.isPlaying = true;
    playMusicURL(MAINTENANCE_THEME_URL);
    return;
  }

  addHandlers();
  loadSettingsFromLocalStorage();
  musicPlayerUI.addToAWBWPage();

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
