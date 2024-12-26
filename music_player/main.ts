/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @todo Add shuffle
 * @todo CSS from code to .css file
 * @todo More settings
 * @todo Finish documentation
 */

// Add our CSS to the page using rollup-plugin-postcss
import "./style.css";
import "./style_sliders.css";

import { musicPlayerUI } from "./music_player_menu";
import { preloadAllCommonAudio, preloadAllExtraAudio } from "./music";
import { getCurrentThemeType, loadSettingsFromLocalStorage, musicPlayerSettings } from "./music_settings";
import { addGameHandlers } from "./handlers";
import { isMapEditor } from "../shared/awbw_page";

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
musicPlayerUI.addToAWBWPage();
addGameHandlers();

preloadAllCommonAudio(() => {
  console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");

  loadSettingsFromLocalStorage();
  musicPlayerSettings.themeType = getCurrentThemeType();

  preloadAllExtraAudio(() => {
    console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
  });
});
