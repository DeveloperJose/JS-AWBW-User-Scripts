/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
 */
import { isMapEditor, menu } from "../shared/awbw_site";
import { neutralImgLink, playingImgLink } from "./resources";
import { addSettingsMenuToMusicPlayer } from "./settings_menu";
import { addSettingsChangeListener, musicPlayerSettings } from "./music_settings";
import { on } from "../shared/utils";

// Listen for setting changes to update the menu UI
addSettingsChangeListener(onSettingsChange);

/**
 * Adds the music player to the game menu.
 */
export function addMusicPlayerMenu() {
  addSettingsMenuToMusicPlayer(musicPlayerDiv);
  menu.appendChild(musicPlayerDiv);
}

/**
 * Sets the loading progress for the music player.
 * Used when preloading audio.
 * @param {number} percentage Integer from 0 to 100 representing the progress of loading the music player.
 */
export function setMusicPlayerLoadPercentage(percentage) {
  musicPlayerDivBackground.style.backgroundImage =
    "linear-gradient(to right, #ffffff " + String(percentage) + "% , #888888 0%)";
}

/**
 * Event handler for when the music button is clicked that turns the music ON/OFF.
 * @param {*} _e - Click event handler, not used.
 */
function onMusicBtnClick(_e) {
  musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
}

/**
 * Event handler that is triggered whenever the settings of the music player are changed.
 * @param {string} key - Name of the setting that changed, matches the name of the property in {@link musicPlayerSettings}.
 */
function onSettingsChange(key) {
  if (key != "isPlaying") {
    return;
  }

  // Update UI
  if (musicPlayerSettings.isPlaying) {
    musicPlayerDivBackgroundImg.src = playingImgLink;
    musicPlayerDivHoverSpan.innerText = "Stop Tunes";
    musicPlayerDivBackground.style.backgroundColor = "#e1e1e1";
  } else {
    musicPlayerDivBackgroundImg.src = neutralImgLink;
    musicPlayerDivHoverSpan.innerText = "Play Tunes";
    musicPlayerDivBackground.style.backgroundColor = "#ffffff";
  }
}

/********************** Music Player Menu **********************/
const musicPlayerDiv = document.createElement("div");
musicPlayerDiv.id = "music-player-parent";
musicPlayerDiv.classList.add("game-tools-btn");
musicPlayerDiv.classList.add("cls-context-menu-root");
musicPlayerDiv.style.width = "34px";
musicPlayerDiv.style.height = "30px";
musicPlayerDiv.style.border = isMapEditor ? "none" : "1px solid #888888";
musicPlayerDiv.style.borderLeft = isMapEditor ? "1px solid #888888" : "0px";

const musicPlayerDivHoverSpan = document.createElement("span");
musicPlayerDivHoverSpan.id = "adji-hover-span";
musicPlayerDivHoverSpan.classList.add("game-tools-btn-text");
musicPlayerDivHoverSpan.classList.add("small_text");
musicPlayerDivHoverSpan.classList.add("cls-context-menu-root");
musicPlayerDivHoverSpan.innerText = "Play Tunes";

const musicPlayerDivBackground = document.createElement("div");
musicPlayerDivBackground.id = "music-player-background";
musicPlayerDivBackground.classList.add("game-tools-bg");
musicPlayerDivBackground.classList.add("cls-context-menu-root");
musicPlayerDivBackground.style.backgroundImage =
  "linear-gradient(to right, #ffffff 0% , #888888 0%)";
// #0066CC

const musicPlayerDivBackgroundSpan = document.createElement("span");
musicPlayerDivBackgroundSpan.id = "music-player-background-span";
musicPlayerDivBackgroundSpan.classList.add("norm2");
musicPlayerDivBackgroundSpan.classList.add("cls-context-menu-root");

const musicPlayerDivBackgroundLink = document.createElement("a");
musicPlayerDivBackgroundLink.id = "music-player-background-link";
musicPlayerDivBackgroundLink.classList.add("norm2");
musicPlayerDivBackgroundLink.classList.add("cls-context-menu-root");

const musicPlayerDivBackgroundImg = document.createElement("img");
musicPlayerDivBackgroundImg.id = "music-player-background-link";
musicPlayerDivBackgroundImg.classList.add("cls-context-menu-root");
musicPlayerDivBackgroundImg.src = neutralImgLink;
musicPlayerDivBackgroundImg.style.verticalAlign = "middle";
musicPlayerDivBackgroundImg.style.width = "17px";
musicPlayerDivBackgroundImg.style.height = "17px";

musicPlayerDiv.appendChild(musicPlayerDivBackground);
musicPlayerDiv.appendChild(musicPlayerDivHoverSpan);
musicPlayerDivBackground.appendChild(musicPlayerDivBackgroundSpan);
musicPlayerDivBackgroundSpan.appendChild(musicPlayerDivBackgroundLink);
musicPlayerDivBackgroundLink.appendChild(musicPlayerDivBackgroundImg);

// Determine who will catch when the user clicks the play/stop button
on(musicPlayerDivBackground, "click", onMusicBtnClick);
