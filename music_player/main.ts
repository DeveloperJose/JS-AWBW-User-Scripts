/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @TODO - More map editor sound effects
 */

import canAutoplay, { CheckResponse } from "can-autoplay";

// Add our CSS to the page using rollup-plugin-postcss
import "../shared/style.css";
import "../shared/style_sliders.css";

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
import { getLiveQueueBlockerPopup, getLiveQueueSelectPopup, getCurrentPageType, PageType } from "../shared/awbw_page";
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
  switch (getCurrentPageType()) {
    case PageType.Maintenance:
      return document.querySelector("#main");
    case PageType.MapEditor:
      return document.querySelector("#replay-misc-controls");
    case PageType.MovePlanner:
      return document.querySelector("#map-controls-container");
    case PageType.ActiveGame:
      return document.querySelector("#game-map-menu")?.parentNode;
    // case PageType.LiveQueue:
    // case PageType.MainPage:
    default:
      return document.querySelector("#nav-options");
  }
}

/**
 * Adjust the music player for the Live Queue page.
 */
function onLiveQueue() {
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
    musicSettings.randomThemesType = RandomThemeType.NONE;
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

function preloadThemes() {
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
 * Whether the music player has been initialized or not.
 */
let isMusicPlayerInitialized = false;

/**
 * Initializes the music player script by setting everything up.
 */
export function initializeMusicPlayer() {
  if (isMusicPlayerInitialized) return;
  isMusicPlayerInitialized = true;

  const currentPageType = getCurrentPageType();

  // Override the saved setting for autoplay if we are on a different page than an active game page
  if (currentPageType !== PageType.ActiveGame) musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;

  log("Initializing music player for page type:", currentPageType);
  addHandlers();

  switch (currentPageType) {
    case PageType.LiveQueue:
      return onLiveQueue();
    case PageType.Maintenance:
      musicPlayerUI.openContextMenu();
      musicSettings.randomThemesType = RandomThemeType.NONE;
      playMusicURL(SpecialTheme.Maintenance);
      break;
    case PageType.MovePlanner:
      musicSettings.isPlaying = true;
      break;
    // case PageType.MainPage:
    //   return;
    case PageType.ActiveGame:
      preloadThemes();
      break;
    case PageType.MapEditor:
      preloadThemes();
      playOrPauseWhenWindowFocusChanges();
      break;
    default:
      musicSettings.randomThemesType = RandomThemeType.NONE;
      playMusicURL(SpecialTheme.ModeSelect);
      playOrPauseWhenWindowFocusChanges();
      break;
  }

  allowSettingsToBeSaved();
}

/**
 * Initializes and adds the music player UI to the page.
 */
export function initializeUI() {
  musicPlayerUI.setProgress(100);
  let prepend = false;

  // Make adjustments to the UI based on the page we are on
  switch (getCurrentPageType()) {
    case PageType.LiveQueue:
      return;
    case PageType.ActiveGame:
      break;
    case PageType.MapEditor:
      musicPlayerUI.parent.style.borderTop = "none";
      break;
    case PageType.Maintenance:
      musicPlayerUI.parent.style.borderLeft = "";
      break;
    default:
      musicPlayerUI.parent.style.border = "none";
      musicPlayerUI.parent.style.backgroundColor = "#0000";
      musicPlayerUI.setProgress(-1);
      prepend = true;
      break;
  }
  // Add the music player UI to the page
  musicPlayerUI.addToAWBWPage(getMenu() as HTMLElement, prepend);
}

/**
 * Main function that initializes everything depending on the browser autoplay settings.
 */
export function main() {
  // Load settings from local storage but don't allow saving yet
  loadSettingsFromLocalStorage();

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
