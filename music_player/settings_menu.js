import { isMapEditor } from "../shared/awbw_site";

import { versions } from "../shared/config.js";
import { on } from "../shared/utils.js";

import { musicPlayerSettings } from "./music_settings.js";

let isMenuOpen = false;

/**
 * Adds the right-click context menu with the music player settings to the given node.
 * @param {*} musicPlayerDiv  The node whose right click will open the context menu.
 */
export function addSettingsMenuToMusicPlayer(musicPlayerDiv) {
  // Add context menu to music player
  musicPlayerDiv.appendChild(contextMenu);

  // Enable right-click to open and close settings menu
  musicPlayerDiv.oncontextmenu = function (e) {
    let elmnt = e.target;
    if (elmnt.id.startsWith("music-player")) {
      e.preventDefault();
      isMenuOpen = !isMenuOpen;

      if (isMenuOpen) {
        openSettingsMenu();
      } else {
        closeSettingsMenu();
      }
    }
  };

  // Close settings menu whenever the user clicks anywhere outside the player
  on(document, "click", function (e) {
    if (e.target.id.startsWith("music-player-")) return;
    closeSettingsMenu();
  });
}

/**
 * Updates the music player settings menu (context menu) so it matches the internal settings.
 *
 * The context menu is the menu that appears when you right-click the player that shows you options.
 * This function ensures that the internal settings are reflected properly on the UI.
 * Use this every time you load new settings internally and need to update the UI.
 */
export function syncSettingsToUI() {
  volumeSlider.value = musicPlayerSettings.volume;
  sfxVolumeSlider.value = musicPlayerSettings.sfxVolume;
  uiVolumeSlider.value = musicPlayerSettings.uiVolume;
}

/**
 * Opens the music player settings menu.
 */
function openSettingsMenu() {
  contextMenu.style.display = "block";
}

/**
 * Closes the music player settings menu.
 */
function closeSettingsMenu() {
  contextMenu.style.display = "none";
}

/********************** Custom Context Menu **********************/
let contextMenu = document.createElement("div");
contextMenu.id = "music-player-context-menu";
contextMenu.classList.add("cls-context-menu");
contextMenu.style.position = "absolute";
contextMenu.style.height = "76px";
contextMenu.style.paddingTop = "0px";
contextMenu.style.paddingBottom = isMapEditor ? "0px" : "4px";
contextMenu.style.height = "347px";
contextMenu.style.width = "175px";
contextMenu.style.top = "37px";

/********************** Volume Slider **********************/
const volumeSlider = document.createElement("input");
volumeSlider.id = "music-player-vol-slider";
volumeSlider.type = "range";
volumeSlider.max = "1";
volumeSlider.min = "0";
volumeSlider.step = "0.01";
volumeSlider.value = musicPlayerSettings.volume;

on(volumeSlider, "input", (val) => {
  musicPlayerSettings.volume = val.target.value;
});

let volumeSliderFlexContainer = document.createElement("div");
volumeSliderFlexContainer.id = "music-player-vol-slider-flex-container";
volumeSliderFlexContainer.style.display = "flex";
volumeSliderFlexContainer.style.flexDirection = "row";
volumeSliderFlexContainer.style.marginBottom = "3.5px";
volumeSliderFlexContainer.style.alignItems = "center";
volumeSliderFlexContainer.style.backgroundColor = "#F0F0F0";

let volumeSliderSpanDiv = document.createElement("div");
volumeSliderSpanDiv.id = "music-player-vol-slider-div";
volumeSliderSpanDiv.style.display = "inline-block";
volumeSliderSpanDiv.style.width = "100%";
volumeSliderSpanDiv.style.textAlign = "center";

let volumeSliderSpan = document.createElement("span");
volumeSliderSpan.id = "music-player-vol-slider-desc";
volumeSliderSpan.textContent = "Music Volume";
volumeSliderSpan.style.fontSize = "13px";

volumeSliderFlexContainer.appendChild(volumeSliderSpanDiv);
volumeSliderSpanDiv.appendChild(volumeSliderSpan);
contextMenu.appendChild(volumeSliderFlexContainer);
contextMenu.appendChild(volumeSlider);

/********************** SFX Volume Slider **********************/
const sfxVolumeSlider = document.createElement("input");
sfxVolumeSlider.id = "music-player-vol-sfx-slider";
sfxVolumeSlider.type = "range";
sfxVolumeSlider.max = "1";
sfxVolumeSlider.min = "0";
sfxVolumeSlider.step = "0.01";
sfxVolumeSlider.value = musicPlayerSettings.sfxVolume;
on(sfxVolumeSlider, "input", (val) => {
  musicPlayerSettings.sfxVolume = val.target.value;
});

let sfxVolumeSliderFlexContainer = document.createElement("div");
sfxVolumeSliderFlexContainer.id = "music-player-vol-sfx-slider-flex-container";
sfxVolumeSliderFlexContainer.style.display = "flex";
sfxVolumeSliderFlexContainer.style.flexDirection = "row";
sfxVolumeSliderFlexContainer.style.marginBottom = "3.5px";
sfxVolumeSliderFlexContainer.style.marginTop = "3.5px";
sfxVolumeSliderFlexContainer.style.alignItems = "center";

let sfxVolumeSliderSpanDiv = document.createElement("div");
sfxVolumeSliderSpanDiv.id = "music-player-vol-sfx-slider-div";
sfxVolumeSliderSpanDiv.style.display = "inline-block";
sfxVolumeSliderSpanDiv.style.width = "100%";
sfxVolumeSliderSpanDiv.style.textAlign = "center";

let sfxVolumeSliderSpan = document.createElement("span");
sfxVolumeSliderSpan.id = "music-player-vol-sfx-slider-desc";
sfxVolumeSliderSpan.textContent = "SFX Volume";
sfxVolumeSliderSpan.style.fontSize = "13px";

sfxVolumeSliderFlexContainer.appendChild(sfxVolumeSliderSpanDiv);
sfxVolumeSliderSpanDiv.appendChild(sfxVolumeSliderSpan);
contextMenu.appendChild(sfxVolumeSliderFlexContainer);
contextMenu.appendChild(sfxVolumeSlider);

/********************** UI Volume Slider **********************/
const uiVolumeSlider = document.createElement("input");
uiVolumeSlider.id = "music-player-vol-ui-slider";
uiVolumeSlider.type = "range";
uiVolumeSlider.max = "1";
uiVolumeSlider.min = "0";
uiVolumeSlider.step = "0.01";
uiVolumeSlider.value = musicPlayerSettings.uiVolume;

on(uiVolumeSlider, "input", (val) => {
  musicPlayerSettings.uiVolume = val.target.value;
});

let uiVolumeSliderFlexContainer = document.createElement("div");
uiVolumeSliderFlexContainer.id = "music-player-vol-ui-slider-flex-container";
uiVolumeSliderFlexContainer.style.display = "flex";
uiVolumeSliderFlexContainer.style.flexDirection = "row";
uiVolumeSliderFlexContainer.style.marginBottom = "3.5px";
uiVolumeSliderFlexContainer.style.marginTop = "3.5px";
uiVolumeSliderFlexContainer.style.alignItems = "center";

let uiVolumeSliderSpanDiv = document.createElement("div");
uiVolumeSliderSpanDiv.id = "music-player-vol-ui-slider-div";
uiVolumeSliderSpanDiv.style.display = "inline-block";
uiVolumeSliderSpanDiv.style.width = "100%";
uiVolumeSliderSpanDiv.style.textAlign = "center";

let uiVolumeSliderSpan = document.createElement("span");
uiVolumeSliderSpan.id = "music-player-vol-ui-slider-desc";
uiVolumeSliderSpan.textContent = "Interface Volume";
uiVolumeSliderSpan.style.fontSize = "13px";

uiVolumeSliderFlexContainer.appendChild(uiVolumeSliderSpanDiv);
uiVolumeSliderSpanDiv.appendChild(uiVolumeSliderSpan);
contextMenu.appendChild(uiVolumeSliderFlexContainer);
contextMenu.appendChild(uiVolumeSlider);

/********************** Version **********************/
let versionDiv = document.createElement("div");
versionDiv.id = "music-player-version-number-div";
versionDiv.style.width = "100%";
versionDiv.style.marginTop = "5px";
versionDiv.style.backgroundColor = "#F0F0F0";

let versionSpan = document.createElement("span");
versionSpan.id = "music-player-version-number";
versionSpan.textContent = "VERSION: " + versions.musicPlayer;
versionSpan.style.fontSize = "9px";
versionSpan.style.color = "#888888";

versionDiv.appendChild(versionSpan);
contextMenu.appendChild(versionDiv);
