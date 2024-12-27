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
import { playThemeSong, preloadAllCommonAudio, preloadAllExtraAudio } from "./music";
import { getCurrentThemeType, loadSettingsFromLocalStorage, musicPlayerSettings } from "./music_settings";
import { addHandlers } from "./handlers";

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
console.debug("[AWBW Improved Music Player] Script starting...");
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
  });
});
