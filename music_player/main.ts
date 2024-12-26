/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @todo Edit DS/MapTheme with Audacity
 * @todo DS character themes for AW1/AW2/AW_RBC
 * @todo Add shuffle
 * @todo Alternate themes
 * @todo Factory themes for RBC
 * @todo CSS from code to .css file
 * @todo More settings
 * @todo Finish documentation
 */

// Add our CSS to the page using rollup-plugin-postcss
import "./style.css";

import { addMusicPlayerMenu } from "./music_player_menu";
import { preloadAllCommonAudio, preloadAllExtraAudio } from "./music";
import {
  getCurrentThemeType,
  loadSettingsFromLocalStorage,
  musicPlayerSettings,
} from "./music_settings";
import { addGameHandlers } from "./handlers";
import { isMapEditor } from "../shared/awbw_page";

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
console.log("Running main script for AWBW Improved Music Player!", musicPlayerSettings);
addMusicPlayerMenu();
addGameHandlers();

preloadAllCommonAudio(() => {
  console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");

  loadSettingsFromLocalStorage();
  musicPlayerSettings.themeType = getCurrentThemeType();

  preloadAllExtraAudio(() => {
    console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
  });
});
