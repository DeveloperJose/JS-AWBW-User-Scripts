/**
 * @file Main script that loads everything for the AWBW Improved Music Player userscript.
 *
 * @TODO - More map editor sound effects
 */

import canAutoplay, { CheckResponse } from "can-autoplay";

// Add our CSS to the page using rollup-plugin-postcss
import "../shared/style.css";
import "../shared/style_sliders.css";

import { initializeMusicPlayerUI, musicPlayerUI } from "./music_ui";
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
import { logDebug, logInfo, logError } from "./utils";
import { checkHashesInDB, openDB } from "./db";
import { addThemeListeners, playMusicURL, playOrPauseWhenWindowFocusChanges, playThemeSong } from "./music/co_themes";
import { preloadAllCommonAudio } from "./music/preloading";
import { initializeIFrame } from "./iframe";

/******************************************************************
 * MODULE EXPORTS
 ******************************************************************/
// Exporting this function is necessary for the CO Selector to work
export { notifyCOSelectorListeners as notifyCOSelectorListeners };

/******************************************************************
 * Functions
 ******************************************************************/

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
    // We have switched pages
    if (getCurrentPageType() !== PageType.LiveQueue) {
      clearInterval(addPlayerIntervalID);
      return;
    }

    if (!addMusicFn()) return;

    // We don't need to add the music player anymore
    clearInterval(addPlayerIntervalID);

    // Now we need to check if we need to pause/resume the music because the player left/rejoined
    // We will do this indefinitely until eventually the player accepts a match or leaves the page
    const checkInterval = window.setInterval(() => {
      // We have switched pages
      if (getCurrentPageType() !== PageType.LiveQueue) {
        clearInterval(checkInterval);
        playThemeSong();
        return;
      }

      // If we are still in the CO select, play the CO Select music
      // Otherwise play whatever is currently set
      if (checkStillActiveFn()) playMusicURL(SpecialTheme.COSelect);
      else playThemeSong();
    }, 500);
  }, 500);
}

/**
 * The ID of the timeout that checks for new music files every minute.
 */
let setHashesTimeoutID: number | undefined;

/**
 * Preloads all themes and audio files, plays the theme song, and checks for new music files every minute.
 */
function preloadThemes() {
  addThemeListeners();
  preloadAllCommonAudio(() => {
    logInfo("All common audio has been pre-loaded!");

    // Set dynamic settings based on the current game state
    // Lastly, update the UI to reflect the current settings
    musicSettings.themeType = getCurrentThemeType();
    musicPlayerUI.updateAllInputLabels();
    playThemeSong();
    setTimeout(playThemeSong, 500);

    // Check for new music files every minute
    if (!setHashesTimeoutID) {
      const checkHashesMS = 1000 * 60 * 1;
      const checkHashesFn = () => {
        checkHashesInDB()
          .then(() => logInfo("All music files have been checked for updates."))
          .catch((reason) => logError("Could not check for music file updates:", reason));

        setHashesTimeoutID = window.setTimeout(checkHashesFn, checkHashesMS);
      };
      checkHashesFn();
    }
    musicPlayerUI.checkIfNewVersionAvailable();

    // preloadAllAudio(() => {
    //   log("All other audio has been pre-loaded!");
    // });
  });
}

/**
 * Initializes the music player script by setting everything up.
 */
export function initializeMusicPlayer() {
  const currentPageType = getCurrentPageType();
  // logInfo("Initializing music player for page type:", currentPageType);

  // Live queue page has a special music player
  if (currentPageType === PageType.LiveQueue) return onLiveQueue();

  // Override the saved setting for autoplay if we are on a different page than an active game page
  if (currentPageType !== PageType.ActiveGame) musicSettings.isPlaying = musicSettings.autoplayOnOtherPages;

  switch (currentPageType) {
    case PageType.Maintenance:
      musicPlayerUI.openContextMenu();
      break;
    case PageType.MovePlanner:
      musicSettings.isPlaying = true;
      break;
    case PageType.ActiveGame:
      // {
      //   if (isIFrameActive()) {
      //     for (const scriptSrc of [
      //       // "js/overlib_mini_minify.js?v=1.0",
      //       // "js/tinyqueue.js",
      //       // "js/axios.js",
      //       // "js/vue.min.js",
      //       // "js/lib/animate_weather.js",
      //       // "terrain/tilesets.js",
      //       // "js/lib/map_renderer.js",
      //       // "js/lib/game.js",
      //       // "js/lib/draw_movement.js",
      //       "js/lib/gameReplay.js",
      //       // "js/lib/calculator_new.js",
      //       // "js/lib/game_shortcuts.js",
      //     ]) {
      //       const gameShortcuts = document.createElement("script");
      //       gameShortcuts.src = scriptSrc;
      //       gameShortcuts.addEventListener("load", () => {
      //         const scripts = Array.from(getCurrentDocument().querySelectorAll("script"));
      //         for (const script of Array.from(scripts)) {
      //           if (script.src !== "") continue;
      //           if (!script.innerHTML.includes("let playersInfo =")) continue;

      //           const newScript = document.createElement("script");
      //           newScript.innerHTML = script.innerHTML;
      //           newScript.innerHTML = newScript.innerHTML.replaceAll("const", "let");

      //           if (typeof playersInfo !== "undefined") {
      //             newScript.innerHTML = newScript.innerHTML.replaceAll("const", "");
      //             newScript.innerHTML = newScript.innerHTML.replaceAll("let", "");
      //           }

      //           document.body.appendChild(newScript);
      //         }
      //       });
      //       document.body.appendChild(gameShortcuts);
      //       gameJSLoaded = true;
      //     }
      //   }
      // }
      break;
    // case PageType.MapEditor:
    //   break;
  }
  preloadThemes();
  allowSettingsToBeSaved();
  initializeMusicPlayerUI();
  addHandlers();
}

/**
 * Whether the autoplay settings have been checked already.
 */
let autoplayChecked = false;

/**
 * Main function that initializes everything depending on the browser autoplay settings.
 */
export function checkAutoplayThenInitialize() {
  if (autoplayChecked) {
    initializeMusicPlayer();
    return;
  }
  autoplayChecked = true;

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

/**
 * Main function that begins the script.
 */
function main() {
  // Only run the script if we are the top window and not inside the iframe
  // Also only run the script if we are on a .php page
  if (self !== top) return;

  const isMainPage = getCurrentPageType() === PageType.MainPage;
  if (!isMainPage && !window.location.href.includes(".php")) return;

  // Load settings from local storage but don't allow saving yet
  loadSettingsFromLocalStorage();

  // Open the database for caching music files first
  // No matter what happens, we will initialize the music player
  logInfo("Opening database to cache music files.");
  openDB()
    .then(() => logInfo("Database opened successfully. Ready to cache music files."))
    .catch((reason) => logDebug(`Database Error: ${reason}. Will not be able to cache music files locally.`))
    .finally(() => {
      // Always run maintenance pages without iframes
      if (getCurrentPageType() === PageType.Maintenance) {
        checkAutoplayThenInitialize();

        // The site is currently down for daily maintenance. Please try again in 2m 24s.
        const maintenanceDiv = document.querySelector("#server-maintenance-alert");
        const currentText = maintenanceDiv?.textContent;
        const minutes = currentText?.match(/\d+m/)?.[0].replace("m", "") ?? 0;
        const seconds = currentText?.match(/\d+s/)?.[0].replace("s", "") ?? 0;
        logInfo("Maintenance page detected. Will try again in", minutes, "minutes and", seconds, "seconds.");
        return;
      }

      initializeIFrame(checkAutoplayThenInitialize);
    });
}

/******************************************************************
 * SCRIPT ENTRY
 ******************************************************************/
main();
