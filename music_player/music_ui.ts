/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
 */
import { NEUTRAL_IMG_URL, PLAYING_IMG_URL } from "./resources";
import { addSettingsChangeListener, musicPlayerSettings, SettingsGameType } from "./music_settings";
import { CustomMenuSettingsUI } from "../shared/custom_ui";
import { versions } from "../shared/config";

// Listen for setting changes to update the menu UI
addSettingsChangeListener(onSettingsChange);

/**
 * Event handler for when the music button is clicked that turns the music ON/OFF.
 * @param _event - Click event handler, not used.
 */
function onMusicBtnClick(_event: Event) {
  musicPlayerSettings.isPlaying = !musicPlayerSettings.isPlaying;
}

/**
 * Event handler that is triggered whenever the settings of the music player are changed.
 * Updates the music player settings UI (context menu) so it matches the internal settings when the settings change.
 *
 * The context menu is the menu that appears when you right-click the player that shows you options.
 * This function ensures that the internal settings are reflected properly on the UI.
 * @param key - Name of the setting that changed, matches the name of the property in {@link musicPlayerSettings}.
 * @param isFirstLoad - Whether this is the first time the settings are being loaded.
 */
function onSettingsChange(key: string, isFirstLoad: boolean) {
  // We are loading settings stored in LocalStorage, so set the initial values of all inputs.
  // Only do this once, when the settings are first loaded, otherwise it's infinite recursion.
  if (isFirstLoad) {
    volumeSlider.value = musicPlayerSettings.volume.toString();
    sfxVolumeSlider.value = musicPlayerSettings.sfxVolume.toString();
    uiVolumeSlider.value = musicPlayerSettings.uiVolume.toString();
    daySlider.value = musicPlayerSettings.alternateThemeDay.toString();

    // Check the radio button that matches the current game type
    let radio = gameTypeRadioMap.get(musicPlayerSettings.gameType);
    if (radio) radio.checked = true;

    // Check the radio button that matches the current random themes setting
    radioNormal.checked = !musicPlayerSettings.randomThemes;
    radioRandom.checked = musicPlayerSettings.randomThemes;
    musicPlayerUI.updateAllInputLabels();
  }

  // Update UI
  if (musicPlayerSettings.isPlaying) {
    musicPlayerUI.setHoverText("Stop Tunes", true);
    musicPlayerUI.setImage(PLAYING_IMG_URL);
  } else {
    musicPlayerUI.setHoverText("Play Tunes", true);
    musicPlayerUI.setImage(NEUTRAL_IMG_URL);
  }
}

/**
 * Parses the value of an input event as a float.
 * @param event - Input event to parse the value from.
 * @returns - The parsed float value of the input event.
 */
const parseInputFloat = (event: Event): number => parseFloat((event.target as HTMLInputElement).value);

/**
 * Parses the value of an input event as an integer.
 * @param event  - Input event to parse the value from.
 * @returns - The parsed integer value of the input event.
 */
const parseInputInt = (event: Event): number => parseInt((event.target as HTMLInputElement).value);

/************************************ Create the music player UI *************************************/
export const musicPlayerUI = new CustomMenuSettingsUI("music-player", NEUTRAL_IMG_URL, "Play Tunes");

// Determine who will catch when the user clicks the play/stop button
musicPlayerUI.addEventListener("click", onMusicBtnClick);

enum InputName {
  Volume = "Music Volume",
  SFX_Volume = "SFX Volume",
  UI_Volume = "UI Volume",
  Alternate_Day = "Alternate Themes Start On Day",
}

enum InputDescription {
  Volume = "Adjust the volume of the CO theme music.",
  SFX_Volume = "Adjust the volume of the unit movement, CO power, and other misc. sound effects.",
  UI_Volume = "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.",
  Alternate_Day = "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?",
  AW1 = "Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!",
  AW2 = "Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.",
  DS = "Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though.",
  RBC = "Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!",
  Normal_Themes = "Play the music depending on who the current CO is.",
  Random_Themes = "Play random music every turn.",
}

// Volume sliders
let volumeSlider = musicPlayerUI.addSlider(InputName.Volume, 0, 1, 0.005, InputDescription.Volume);
let sfxVolumeSlider = musicPlayerUI.addSlider(InputName.SFX_Volume, 0, 1, 0.005, InputDescription.SFX_Volume);
let uiVolumeSlider = musicPlayerUI.addSlider(InputName.UI_Volume, 0, 1, 0.005, InputDescription.UI_Volume);
volumeSlider.addEventListener("input", (event) => (musicPlayerSettings.volume = parseInputFloat(event)));
sfxVolumeSlider.addEventListener("input", (event) => (musicPlayerSettings.sfxVolume = parseInputFloat(event)));
uiVolumeSlider.addEventListener("input", (event) => (musicPlayerSettings.uiVolume = parseInputFloat(event)));

// Day slider
let daySlider = musicPlayerUI.addSlider(InputName.Alternate_Day, 0, 30, 1, InputDescription.Alternate_Day);
daySlider.addEventListener("input", (event) => (musicPlayerSettings.alternateThemeDay = parseInputInt(event)));

// GameType radio buttons
const gameTypeRadioMap: Map<SettingsGameType, HTMLInputElement> = new Map();

for (const gameType of Object.values(SettingsGameType)) {
  let description = InputDescription[gameType as keyof typeof InputDescription];
  let radio = musicPlayerUI.addRadioButton(gameType, "Soundtrack", description);
  gameTypeRadioMap.set(gameType, radio);

  // Set the game type when the radio button is clicked.
  // By adding the event to the parent, we allow the user to also click the label to select the radio button.
  radio.parentElement?.addEventListener("input", (_e) => (musicPlayerSettings.gameType = gameType));
}

// Random themes radio buttons
let radioNormal = musicPlayerUI.addRadioButton("Off", "Random Themes", InputDescription.Normal_Themes);
let radioRandom = musicPlayerUI.addRadioButton("On", "Random Themes", InputDescription.Random_Themes);
radioNormal.parentElement?.addEventListener("input", (_e) => (musicPlayerSettings.randomThemes = false));
radioRandom.parentElement?.addEventListener("input", (_e) => (musicPlayerSettings.randomThemes = true));

// Toggles

// Version
musicPlayerUI.addVersion(versions.music_player);
