/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
 */
import { isMapEditor } from "../shared/awbw_page";
import { menu } from "../shared/awbw_page";
import { NEUTRAL_IMG_URL, PLAYING_IMG_URL } from "./resources";
import { addSettingsChangeListener, musicPlayerSettings, SettingsGameType } from "./music_settings";
import { CustomMenuSettingsUI } from "../shared/custom_ui";
import { versions } from "../shared/config";
import { getRandomCO } from "../shared/awbw_globals";

// Listen for setting changes to update the menu UI
addSettingsChangeListener(onSettingsChange);

/**
 * Event handler for when the music button is clicked that turns the music ON/OFF.
 * @param _event - Click event handler, not used.
 */
function onMusicBtnClick(_event: MouseEvent) {
  musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
}

/**
 * Event handler that is triggered whenever the settings of the music player are changed.
 * Updates the music player settings UI (context menu) so it matches the internal settings when the settings change.
 *
 * The context menu is the menu that appears when you right-click the player that shows you options.
 * This function ensures that the internal settings are reflected properly on the UI.
 * @param key - Name of the setting that changed, matches the name of the property in {@link musicPlayerSettings}.
 */
function onSettingsChange(key: string) {
  // Set the values of the sliders to match the settings
  volumeSlider.value = musicPlayerSettings.volume.toString();
  sfxVolumeSlider.value = musicPlayerSettings.sfxVolume.toString();
  uiVolumeSlider.value = musicPlayerSettings.uiVolume.toString();
  daySlider.value = musicPlayerSettings.alternateThemeDay.toString();

  // Trigger the event listeners for the sliders to update the labels
  const event = new Event("input");
  volumeSlider.dispatchEvent(event);
  sfxVolumeSlider.dispatchEvent(event);
  uiVolumeSlider.dispatchEvent(event);
  daySlider.dispatchEvent(event);

  // Check the radio button that matches the current game type
  let radio = radioMap.get(musicPlayerSettings.gameType);
  radio.checked = true;
  radio.dispatchEvent(event);

  // Check the radio button that matches the current random themes setting
  radioNormal.checked = !musicPlayerSettings.randomThemes;
  radioRandom.checked = musicPlayerSettings.randomThemes;
  if (musicPlayerSettings.randomThemes) {
    radioRandom.dispatchEvent(event);
  } else {
    radioNormal.dispatchEvent(event);
  }

  // Update UI
  if (musicPlayerSettings.isPlaying) {
    musicPlayerUI.setHoverText("Stop Tunes");
    musicPlayerUI.setImage(PLAYING_IMG_URL);
  } else {
    musicPlayerUI.setHoverText("Play Tunes");
    musicPlayerUI.setImage(NEUTRAL_IMG_URL);
  }
}

// Create the music player UI
export const musicPlayerUI = new CustomMenuSettingsUI("music-player", NEUTRAL_IMG_URL, "Play Tunes");

// Determine who will catch when the user clicks the play/stop button
musicPlayerUI.addEventListener("click", onMusicBtnClick);

// Volume sliders
let volumeSlider = musicPlayerUI.addSlider("Music Volume", 0, 1, 0.005, "Adjust the volume of the CO theme music.");
let sfxVolumeSlider = musicPlayerUI.addSlider(
  "SFX Volume",
  0,
  1,
  0.005,
  "Adjust the volume of the unit movement and CO power sound effects.",
);
let uiVolumeSlider = musicPlayerUI.addSlider(
  "UI Volume",
  0,
  1,
  0.005,
  "Adjust the volume of the UI sound effects like moving your cursor, opening menus, selecting units.",
);

volumeSlider.addEventListener("input", (val) => {
  musicPlayerSettings.volume = parseFloat((val.target as HTMLInputElement).value);
});

sfxVolumeSlider.addEventListener("input", (val) => {
  musicPlayerSettings.sfxVolume = parseFloat((val.target as HTMLInputElement).value);
});

uiVolumeSlider.addEventListener("input", (val) => {
  musicPlayerSettings.uiVolume = parseFloat((val.target as HTMLInputElement).value);
});

// Day slider
let daySlider = musicPlayerUI.addSlider(
  "Alternate Themes Start On Day",
  0,
  30,
  1,
  "After what day should alternate themes start playing? Can you find all the hidden themes?",
);
daySlider.addEventListener("input", (val) => {
  musicPlayerSettings.alternateThemeDay = parseInt((val.target as HTMLInputElement).value);
});

// GameType radio buttons
const radioMap: Map<SettingsGameType, HTMLInputElement> = new Map();
const hoverDescriptions = new Map([
  [SettingsGameType.AW1, "Play the GBA Advance Wars 1 soundtrack"],
  [SettingsGameType.AW2, "Play the GBA Advance Wars 2 soundtrack"],
  [SettingsGameType.DS, "Play the Nintendo DS Advance Wars: Dual Strike soundtrack"],
  [SettingsGameType.RBC, "Play the Nintendo Switch Advance Wars: Re-Boot Camp soundtrack"],
]);
for (const gameType of Object.values(SettingsGameType)) {
  let radio = musicPlayerUI.addRadioButton(gameType, "Soundtrack", hoverDescriptions.get(gameType));
  radioMap.set(gameType, radio);

  // Allows label to also be clicked to change the radio button
  radio.parentElement.addEventListener("input", (_event) => {
    musicPlayerSettings.gameType = gameType;
  });
}

// Random
let radioNormal = musicPlayerUI.addRadioButton(
  "Off",
  "Random Themes",
  "Play the music depending on who the current CO is.",
);
let radioRandom = musicPlayerUI.addRadioButton("On", "Random Themes", "Play random music every turn.");
radioNormal.parentElement.addEventListener("input", (_event) => {
  musicPlayerSettings.randomThemes = false;
});
radioRandom.parentElement.addEventListener("input", (_event) => {
  musicPlayerSettings.randomThemes = true;
});

// Version
musicPlayerUI.addVersion(versions.music_player);
