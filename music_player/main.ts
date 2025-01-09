/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @TODO - More map editor sound effects
 */
// Add our CSS to the page using rollup-plugin-postcss
import "./style.css";
import "./style_sliders.css";

import { musicPlayerUI } from "./music_ui";
import {
  playMusicURL,
  playOrPauseWhenWindowFocusChanges,
  playThemeSong,
  preloadAllCommonAudio,
  preloadAllExtraAudio,
} from "./music";
import {
  allowSettingsToBeSaved,
  getCurrentThemeType,
  loadSettingsFromLocalStorage,
  musicSettings,
} from "./music_settings";
import { addHandlers } from "./handlers";
import {
  getLiveQueueBlockerPopup,
  getLiveQueueSelectPopup,
  isLiveQueue,
  isMaintenance,
  isMapEditor,
  isMovePlanner,
  isYourGames,
} from "../shared/awbw_page";
import { SpecialTheme } from "./resources";
import { notifyCOSelectorListeners } from "../shared/custom_ui";

/**
 * Where should we place the music player UI?
 */
function getMenu() {
  if (isMaintenance()) return document.querySelector("#main");
  if (isMapEditor()) return document.querySelector("#replay-misc-controls");
  if (isMovePlanner()) return document.querySelector("#map-controls-container");
  if (isYourGames()) return document.querySelector("#main");
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
  musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;
  musicPlayerUI.setProgress(100);

  // Load settings from local storage but don't allow saving yet
  loadSettingsFromLocalStorage();

  if (isLiveQueue()) {
    console.log("[AWBW Improved Music Player] Live Queue detected...");

    const intervalID = setInterval(() => {
      // Check if the parent popup is created and visible
      const blockerPopup = getLiveQueueBlockerPopup();
      console.log("blockerPopup", blockerPopup);
      if (!blockerPopup) return;
      if (blockerPopup.style.display === "none") return;

      // Now make sure the internal popup is created
      const popup = getLiveQueueSelectPopup();
      console.log("popup", popup);
      if (!popup) return;

      // Get the div with "Match starts in ...."
      const box = popup.querySelector(".flex.row.hv-center");
      console.log("box", box);
      if (!box) return;

      // Prepend the music player UI to the box
      musicPlayerUI.addToAWBWPage(box as HTMLElement, true);
      playMusicURL(SpecialTheme.COSelect);
      allowSettingsToBeSaved();
      playOrPauseWhenWindowFocusChanges();

      // No need to keep checking
      clearInterval(intervalID);
    }, 500);
    return;
  }

  // Add the music player UI to the page and the necessary event handlers
  musicPlayerUI.addToAWBWPage(getMenu() as HTMLElement, isYourGames());
  addHandlers();

  if (isMaintenance()) {
    console.log("[AWBW Improved Music Player] Maintenance mode detected, playing music...");
    musicPlayerUI.parent.style.borderLeft = "";
    musicPlayerUI.openContextMenu();
    playMusicURL(SpecialTheme.Maintenance);
    allowSettingsToBeSaved();
    playOrPauseWhenWindowFocusChanges();
    return;
  }

  if (isMovePlanner()) {
    console.log("[AWBW Improved Music Player] Move Planner detected");
    musicSettings.isPlaying = true;
    allowSettingsToBeSaved();
    return;
  }

  if (isYourGames()) {
    console.log("[AWBW Improved Music Player] Your Games detected, playing music...");
    musicPlayerUI.parent.style.borderRight = "";
    playMusicURL(SpecialTheme.ModeSelect);
    allowSettingsToBeSaved();
    playOrPauseWhenWindowFocusChanges();
    return;
  }

  if (isMapEditor()) {
    musicPlayerUI.parent.style.borderTop = "none";
    playOrPauseWhenWindowFocusChanges();
  }

  // game.php or designmap.php from now on
  allowSettingsToBeSaved();
  preloadAllCommonAudio(() => {
    console.log("[AWBW Improved Music Player] All common audio has been pre-loaded!");

    // Set dynamic settings based on the current game state
    // Lastly, update the UI to reflect the current settings
    musicSettings.themeType = getCurrentThemeType();
    musicPlayerUI.updateAllInputLabels();
    playThemeSong();

    preloadAllExtraAudio(() => {
      console.log("[AWBW Improved Music Player] All extra audio has been pre-loaded!");
      playThemeSong();
    });
  });
}

main();
