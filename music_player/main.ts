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
  stopThemeSong,
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
import { logDebug, log, isFirefox } from "./utils";
import { checkHashesInDB, openDB } from "./db";

/******************************************************************
 * MODULE EXPORTS
 ******************************************************************/
// Exporting this function is necessary for the CO Selector to work
export { notifyCOSelectorListeners as notifyCOSelectorListeners };

/******************************************************************
 * Functions
 ******************************************************************/

/**
 * Where should we place the music player UI?
 */
function getMenu() {
  if (isMaintenance()) return document.querySelector("#main");
  if (isMapEditor()) return document.querySelector("#replay-misc-controls");
  if (isMovePlanner()) return document.querySelector("#map-controls-container");
  if (isYourGames()) return document.querySelector("#nav-options");
  return document.querySelector("#game-map-menu")?.parentNode;
}

/**
 * Adjust the music player for the Live Queue page.
 */
function onLiveQueue() {
  log("Live Queue detected...");

  const addMusicFn = () => {
    // Check if the parent popup is created and visible
    const blockerPopup = getLiveQueueBlockerPopup();
    if (!blockerPopup) return false;
    if (blockerPopup.style.display === "none") return false;

    // Now make sure the internal popup is created
    const popup = getLiveQueueSelectPopup();
    if (!popup) return false;

    // Get the div with "Match starts in ...."
    const box = popup.querySelector(".flex.row.hv-center");
    if (!box) return false;

    // Prepend the music player UI to the box
    musicPlayerUI.addToAWBWPage(box as HTMLElement, true);
    playMusicURL(SpecialTheme.COSelect);
    allowSettingsToBeSaved();
    playOrPauseWhenWindowFocusChanges();
    return true;
  };

  const checkStillActiveFn = () => {
    const blockerPopup = getLiveQueueBlockerPopup();
    return blockerPopup?.style.display !== "none";
  };

  const addPlayerIntervalID = window.setInterval(() => {
    if (!addMusicFn()) return;

    // We don't need to add the music player anymore
    clearInterval(addPlayerIntervalID);

    // Now we need to check if we need to pause/resume the music because the player left/rejoined
    // We will do this indefinitely until eventually the player accepts a match or leaves the page
    window.setInterval(() => {
      // We are still in the CO select, play the music
      if (checkStillActiveFn()) playThemeSong();
      // We are not in the CO select, stop the music
      else stopThemeSong();
    }, 500);
  }, 500);
}

/**
 * Adjust the music player for the maintenance page.
 */
function onMaintenance() {
  log("Maintenance detected, playing music...");
  musicPlayerUI.parent.style.borderLeft = "";
  musicPlayerUI.openContextMenu();
  musicSettings.randomThemes = false;
  playMusicURL(SpecialTheme.Maintenance);
  allowSettingsToBeSaved();
}

/**
 * Adjust the music player for the Move Planner page.
 */
function onMovePlanner() {
  log("Move Planner detected");
  musicSettings.isPlaying = true;
  allowSettingsToBeSaved();
}

/**
 * Adjust the music player for the Your Games and Your Turn pages.
 */
function onIsYourGames() {
  log("Your Games detected, playing music...");
  musicPlayerUI.parent.style.border = "none";
  musicPlayerUI.parent.style.backgroundColor = "#0000";
  musicPlayerUI.setProgress(-1);
  playMusicURL(SpecialTheme.ModeSelect);
  allowSettingsToBeSaved();
  playOrPauseWhenWindowFocusChanges();
}

/**
 * Adjust the music player for the map editor page.
 */
function onMapEditor() {
  musicPlayerUI.parent.style.borderTop = "none";
  playOrPauseWhenWindowFocusChanges();
}

/**
 * Initializes the music player script by setting everything up.
 */
export function main() {
  musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;
  musicPlayerUI.setProgress(100);

  // Load settings from local storage but don't allow saving yet
  loadSettingsFromLocalStorage();

  // Live queue has the music player hidden until the player is in the CO select, so stop here
  if (isLiveQueue()) return onLiveQueue();

  // Add the music player UI to the page and the necessary event handlers
  musicPlayerUI.addToAWBWPage(getMenu() as HTMLElement, isYourGames());
  addHandlers();

  // Handle pages that aren't the main game page or the map editor
  if (isMaintenance()) return onMaintenance();
  if (isMovePlanner()) return onMovePlanner();
  if (isYourGames()) return onIsYourGames();

  // game.php or designmap.php from now on
  if (isMapEditor()) onMapEditor();
  allowSettingsToBeSaved();

  preloadAllCommonAudio(() => {
    log("All common audio has been pre-loaded!");

    // Set dynamic settings based on the current game state
    // Lastly, update the UI to reflect the current settings
    musicSettings.themeType = getCurrentThemeType();
    musicPlayerUI.updateAllInputLabels();
    playThemeSong();

    // Firefox doesn't support autoplay, so we need to pause the music
    if (isFirefox()) {
      musicSettings.isPlaying = false;
    }

    checkHashesInDB();

    // preloadAllAudio(() => {
    //   log("All other audio has been pre-loaded!");
    // });
  });
}

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
logDebug("Script starting...");

// Open the database for caching music files first
// No matter what happens, we will call main() after this
openDB().then(main, main);
