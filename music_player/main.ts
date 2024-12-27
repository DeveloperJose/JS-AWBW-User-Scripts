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

import { musicPlayerUI } from "./menu_ui";
import { preloadAllCommonAudio, preloadAllExtraAudio } from "./music";
import { getCurrentThemeType, loadSettingsFromLocalStorage, musicPlayerSettings } from "./music_settings";
import { addHandlers } from "./handlers";

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
console.debug("[AWBW Improved Music Player] Script starting...");
addHandlers();
musicPlayerUI.addToAWBWPage();

preloadAllCommonAudio(() => {
  console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");

  loadSettingsFromLocalStorage();
  musicPlayerSettings.themeType = getCurrentThemeType();

  preloadAllExtraAudio(() => {
    console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
  });
});
