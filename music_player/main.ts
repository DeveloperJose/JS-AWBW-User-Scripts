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
 * Initializes the music player script by setting everything up.
 */
export function initializeMusicPlayer() {
  initializeMusicPlayerUI();

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
      // playOrPauseWhenWindowFocusChanges();
      break;
    default:
      musicSettings.randomThemesType = RandomThemeType.NONE;
      playMusicURL(SpecialTheme.ModeSelect);
      // playOrPauseWhenWindowFocusChanges();
      break;
  }

  allowSettingsToBeSaved();
}

/**
 * Whether the music player has been initialized or not.
 */
let mainFunctionExecuted = false;

/**
 * Main function that initializes everything depending on the browser autoplay settings.
 */
export function main() {
  if (mainFunctionExecuted) {
    initializeMusicPlayer();
    return;
  }

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
    })
    .finally(() => (mainFunctionExecuted = true));
}

/******************************************************************
 * SCRIPT ENTRY (MAIN FUNCTION)
 ******************************************************************/
// Load settings from local storage but don't allow saving yet
loadSettingsFromLocalStorage();

// Only run the script if we are the top window and not inside the iframe
if (self === top) {
  // Open the database for caching music files first
  // No matter what happens, we will initialize the music player
  log("Opening database to cache music files.");
  openDB()
    .then(() => log("Database opened successfully. Ready to cache music files."))
    .catch((reason) => logDebug(`Database Error: ${reason}. Will not be able to cache music files locally.`))
    .finally(() => {
      // Always run game pages without iframes
      if (getCurrentPageType() === PageType.ActiveGame) {
        main();
        return;
      }

      const hasFrame = document.querySelector("iframe");
      if (hasFrame) return;

      for (const child of Array.from(document.body.children)) {
        if (child.id.startsWith("music")) continue;
        if (child.tagName === "SCRIPT") continue;
        child.remove();
      }

      const iframe = document.createElement("iframe");
      iframe.src = window.location.href;
      iframe.name = "main";
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      document.body.appendChild(iframe);
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      if (document.body.parentElement) {
        document.body.parentElement.style.width = "100%";
        document.body.parentElement.style.height = "100%";
      }

      // When the page changes, hijack the links so they change the iframe
      // instead of opening a new page and also re-add the music player UI
      iframe.addEventListener("load", (_e) => {
        log("Iframe loaded, hijacking links.", getCurrentPageType());
        const href = iframe.contentDocument?.location.href ?? iframe.src;
        window.history.pushState({}, "", href);
        iframe.contentWindow?.history.pushState({}, "", href);

        hijackLinks();
        main();
      });

      const hijackLinks = () => {
        const doc = iframe.contentDocument;
        const links = doc?.querySelectorAll("a");
        if (!links) {
          logError("Could not find any links to hijack.");
          return;
        }

        for (const link of Array.from(links)) {
          if (link.href.includes("game.php") || link.name.includes("game")) {
            link.target = "_top";
            continue;
          }
          link.target = "main";

          // for (const child of Array.from(link.querySelectorAll("a"))) {
          //   if (child.href.includes("game.php") || link.name.includes("game") ) continue;
          // }
        }
      };
    });
}
