/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @TODO - More map editor sound effects
 */

import canAutoplay, { CheckResponse } from "can-autoplay";

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
  RandomThemeType,
} from "./music_settings";
import { addHandlers } from "./handlers";
import {
  getLiveQueueBlockerPopup,
  getLiveQueueSelectPopup,
  isGamePageAndActive,
  isLiveQueue,
  isMaintenance,
  isMapEditor,
  isMovePlanner,
  isYourGames,
} from "../shared/awbw_page";
import { SpecialTheme } from "./resources";
import { notifyCOSelectorListeners } from "../shared/custom_ui";
import { logDebug, log, logError } from "./utils";
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
    musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;
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
  musicPlayerUI.openContextMenu();
  musicSettings.randomThemesType = RandomThemeType.NONE;
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

  playMusicURL(SpecialTheme.ModeSelect);
  allowSettingsToBeSaved();
  playOrPauseWhenWindowFocusChanges();
}

/**
 * Adjust the music player for the map editor page.
 */
function onMapEditor() {
  playOrPauseWhenWindowFocusChanges();
}

/**
 * Whether the music player has been initialized or not.
 */
let isMusicPlayerInitialized = false;

/**
 * Initializes the music player script by setting everything up.
 */
export function initializeMusicPlayer() {
  if (isMusicPlayerInitialized) return;
  isMusicPlayerInitialized = true;

  // Load settings from local storage but don't allow saving yet
  loadSettingsFromLocalStorage();

  // Override the saved setting for autoplay if we are on a different page than the main game page
  if (!isGamePageAndActive()) musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;

  // Handle pages that aren't the main game page or the map editor
  addHandlers();
  if (isLiveQueue()) return onLiveQueue();
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

    // Check for new music files every minute
    const checkHashesMS = 1000 * 60 * 1;
    const checkHashesFn = () => {
      checkHashesInDB()
        .then(() => log("All music files have been checked for updates."))
        .catch((reason) => logError("Could not check for music file updates:", reason));

      window.setTimeout(checkHashesFn, checkHashesMS);
    };
    checkHashesFn();
    musicPlayerUI.checkIfNewVersionAvailable();

    // preloadAllAudio(() => {
    //   log("All other audio has been pre-loaded!");
    // });
  });
}

/**
 * Initializes and adds the music player UI to the page.
 */
export function initializeUI() {
  // Add the music player UI to the page and the necessary event handlers
  if (!isLiveQueue()) musicPlayerUI.addToAWBWPage(getMenu() as HTMLElement, isYourGames());
  musicPlayerUI.setProgress(100);

  // Make adjustments to the UI based on the page we are on
  if (isYourGames()) {
    musicPlayerUI.parent.style.border = "none";
    musicPlayerUI.parent.style.backgroundColor = "#0000";
    musicPlayerUI.setProgress(-1);
  }

  if (isMapEditor()) {
    musicPlayerUI.parent.style.borderTop = "none";
  }

  if (isMaintenance()) {
    musicPlayerUI.parent.style.borderLeft = "";
  }
}

/**
 * Main function that initializes everything depending on the browser autoplay settings.
 */
export function main() {
  initializeUI();

  const ifCanAutoplay = () => {
    initializeMusicPlayer();
  };

  const ifCannotAutoplay = () => {
    // Listen for any clicks
    musicPlayerUI.addEventListener("click", () => initializeMusicPlayer(), { once: true });
    document.querySelector("body")?.addEventListener("click", () => initializeMusicPlayer(), { once: true });
  };

  // Check if we can autoplay
  canAutoplay
    .audio()
    .then((response: CheckResponse) => {
      const result = response.result;
      logDebug("Script starting, does your browser allow you to auto-play:", result);

      if (result) ifCanAutoplay();
      else ifCannotAutoplay();
    })
    .catch((reason) => {
      logDebug("Script starting, could not check your browser allows auto-play so assuming no: ", reason);
      ifCannotAutoplay();
    });
}

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
// Open the database for caching music files first
// No matter what happens, we will initialize the music player
log("Opening database to cache music files.");
openDB()
  .then(() => log("Database opened successfully. Ready to cache music files."))
  .catch((reason) => logDebug(`Database Error: ${reason}. Will not be able to cache music files locally.`))
  .finally(main);
