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

import { musicPlayerUI } from "./music_player_menu";
import { preloadAllCommonAudio, preloadAllExtraAudio } from "./music";
import { getCurrentThemeType, loadSettingsFromLocalStorage, musicPlayerSettings } from "./music_settings";
import { addGameHandlers } from "./handlers";
import { isMapEditor } from "../shared/awbw_page";

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
addGameHandlers();
musicPlayerUI.addToAWBWPage();

preloadAllCommonAudio(() => {
  console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");

  loadSettingsFromLocalStorage();
  musicPlayerSettings.themeType = getCurrentThemeType();

  preloadAllExtraAudio(() => {
    console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
  });
});
