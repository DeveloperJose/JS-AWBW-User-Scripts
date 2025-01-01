/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
 */
import { NEUTRAL_IMG_URL, PLAYING_IMG_URL } from "./resources";
import { addSettingsChangeListener, musicPlayerSettings, SettingsGameType } from "./music_settings";
import { MenuPosition, CustomMenuSettingsUI, GroupType } from "../shared/custom_ui";
import { versions } from "../shared/config";
import { getRandomCO } from "../shared/awbw_globals";

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
    if (volumeSlider) volumeSlider.value = musicPlayerSettings.volume.toString();

    if (sfxVolumeSlider) sfxVolumeSlider.value = musicPlayerSettings.sfxVolume.toString();

    if (uiVolumeSlider) uiVolumeSlider.value = musicPlayerSettings.uiVolume.toString();

    if (daySlider) daySlider.value = musicPlayerSettings.alternateThemeDay.toString();

    let radio = gameTypeRadioMap.get(musicPlayerSettings.gameType);
    if (radio) radio.checked = true;

    radioNormal.checked = !musicPlayerSettings.randomThemes;
    radioRandom.checked = musicPlayerSettings.randomThemes;

    captProgressBox.checked = musicPlayerSettings.captureProgressSFX;
    pipeSeamBox.checked = musicPlayerSettings.pipeSeamSFX;

    // Update all labels
    musicPlayerUI.updateAllInputLabels();
  }

  // Sort overrides again if we are loading the settings for the first time, or if the override list changed
  if (key === "all" || key === "addOverride" || key === "removeOverride") {
    clearAndRepopulateOverrideList();
  }

  shuffleBtn.disabled = !musicPlayerSettings.randomThemes;

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

enum Name {
  Volume = "Music Volume",
  SFX_Volume = "SFX Volume",
  UI_Volume = "UI Volume",
  Alternate_Day = "Alternate Themes Start On Day",
  Shuffle = "Shuffle",
  Capture_Progress = "Capture Progress SFX",
  Pipe_Seam_SFX = "Pipe Seam Attack SFX",
  Add_Override = "Add",
  Override_Table = "Overrides",
}

enum Description {
  Volume = "Adjust the volume of the CO theme music, power activations, and power themes.",
  SFX_Volume = "Adjust the volume of the unit movement, tag swap, captures, and other unit sounds.",
  UI_Volume = "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.",
  Alternate_Day = "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?",
  AW1 = "Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!",
  AW2 = "Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.",
  DS = "Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though.",
  RBC = "Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!",
  Normal_Themes = "Play the music depending on who the current CO is.",
  Random_Themes = "Play random music every turn.",
  Shuffle = "Changes the current theme to a new random one.",
  Capture_Progress = "Play a sound effect when a unit makes progress capturing a property.",
  Pipe_Seam_SFX = "Play a sound effect when a pipe seam is attacked.",
  Add_Override = "Adds an override for a specific CO so it always plays a specific soundtrack.",
  Remove_Override = "Removes the override for this specific CO.",
}

/* ************************************ Left Menu ************************************ */
const LEFT = MenuPosition.Left;

/* **** Group: Volume sliders **** */
let volumeSlider = musicPlayerUI.addSlider(Name.Volume, 0, 1, 0.005, Description.Volume, LEFT);
let sfxVolumeSlider = musicPlayerUI.addSlider(Name.SFX_Volume, 0, 1, 0.005, Description.SFX_Volume, LEFT);
let uiVolumeSlider = musicPlayerUI.addSlider(Name.UI_Volume, 0, 1, 0.005, Description.UI_Volume, LEFT);
volumeSlider?.addEventListener("input", (event) => (musicPlayerSettings.volume = parseInputFloat(event)));
sfxVolumeSlider?.addEventListener("input", (event) => (musicPlayerSettings.sfxVolume = parseInputFloat(event)));
uiVolumeSlider?.addEventListener("input", (event) => (musicPlayerSettings.uiVolume = parseInputFloat(event)));

/* **** Group: Day slider **** */
let daySlider = musicPlayerUI.addSlider(Name.Alternate_Day, 0, 30, 1, Description.Alternate_Day, LEFT);
daySlider?.addEventListener("input", (event) => (musicPlayerSettings.alternateThemeDay = parseInputInt(event)));

/* **** Group: Soundtrack radio buttons (AW1, AW2, DS, RBC) AKA GameType **** */
const soundtrackGroup = "Soundtrack";
musicPlayerUI.addGroup(soundtrackGroup, GroupType.Horizontal, LEFT);

// Radio buttons
const gameTypeRadioMap: Map<SettingsGameType, HTMLInputElement> = new Map();
for (const gameType of Object.values(SettingsGameType)) {
  let description = Description[gameType as keyof typeof Description];
  let radio = musicPlayerUI.addRadioButton(gameType, soundtrackGroup, description);
  gameTypeRadioMap.set(gameType, radio);
  radio.addEventListener("click", (_e) => (musicPlayerSettings.gameType = gameType));
}

/* **** Group: Random themes radio buttons **** */
const randomGroup = "Random Themes";
musicPlayerUI.addGroup(randomGroup, GroupType.Horizontal, LEFT);

// Radio buttons
let radioNormal = musicPlayerUI.addRadioButton("Off", randomGroup, Description.Normal_Themes);
let radioRandom = musicPlayerUI.addRadioButton("On", randomGroup, Description.Random_Themes);
radioNormal.addEventListener("click", (_e) => (musicPlayerSettings.randomThemes = false));
radioRandom.addEventListener("click", (_e) => (musicPlayerSettings.randomThemes = true));

// Random theme shuffle button
let shuffleBtn = musicPlayerUI.addButton(Name.Shuffle, randomGroup, Description.Shuffle);
shuffleBtn.addEventListener("click", (_e) => (musicPlayerSettings.currentRandomCO = getRandomCO()));

/* **** Group: Sound effect toggle checkboxes **** */
const toggleGroup = "Sound Effects";
musicPlayerUI.addGroup(toggleGroup, GroupType.Vertical, LEFT);

// Checkboxes
let captProgressBox = musicPlayerUI.addCheckbox(Name.Capture_Progress, toggleGroup, Description.Capture_Progress);
let pipeSeamBox = musicPlayerUI.addCheckbox(Name.Pipe_Seam_SFX, toggleGroup, Description.Pipe_Seam_SFX);
captProgressBox.addEventListener("click", (_e) => (musicPlayerSettings.captureProgressSFX = captProgressBox.checked));
pipeSeamBox.addEventListener("click", (_e) => (musicPlayerSettings.pipeSeamSFX = pipeSeamBox.checked));

/* ************************************ Right Menu ************************************ */
const RIGHT = MenuPosition.Right;

/* **** Group: Override Themes **** */
const addOverrideGroup = "Override Themes";
musicPlayerUI.addGroup(addOverrideGroup, GroupType.Horizontal, RIGHT);

// CO selector
let currentSelectedCO = "andy";
function onCOSelectorClick(coName: string) {
  currentSelectedCO = coName;
}
musicPlayerUI.addCOSelector(addOverrideGroup, Description.Add_Override, onCOSelectorClick);

// Game type radio buttons
const overrideGameTypeRadioMap = new Map<SettingsGameType, HTMLInputElement>();
for (const gameType of Object.values(SettingsGameType)) {
  let radio = musicPlayerUI.addRadioButton(gameType, addOverrideGroup, Description.Add_Override);
  overrideGameTypeRadioMap.set(gameType, radio);
  radio.checked = true;
}

// Add override button
const overrideBtn = musicPlayerUI.addButton(Name.Add_Override, addOverrideGroup, Description.Add_Override);
overrideBtn.addEventListener("click", (_e) => {
  // Get the selected game type
  let currentGameType: SettingsGameType | undefined;
  for (const [gameType, radio] of overrideGameTypeRadioMap) {
    if (radio.checked) currentGameType = gameType;
  }
  // Add the override
  if (!currentGameType) return;
  musicPlayerSettings.addOverride(currentSelectedCO, currentGameType);
});

/* **** Group: Override List **** */
const overrideListGroup = "Current Overrides (Click to Remove)";
musicPlayerUI.addGroup(overrideListGroup, GroupType.Horizontal, RIGHT);

const overrideDivMap = new Map<string, HTMLDivElement>();
const tableRows = 4;
const tableCols = 7;
musicPlayerUI.addTable(Name.Override_Table, tableRows, tableCols, overrideListGroup, Description.Remove_Override);

function addOverrideDisplayDiv(coName: string, gameType: SettingsGameType) {
  const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, gameType);

  displayDiv.addEventListener("click", () => {
    musicPlayerSettings.removeOverride(coName);
  });

  overrideDivMap.set(coName, displayDiv);
  musicPlayerUI.addItemToTable(Name.Override_Table, displayDiv);
  return displayDiv;
}

function clearAndRepopulateOverrideList() {
  overrideDivMap.forEach((div) => div.remove());
  overrideDivMap.clear();
  musicPlayerUI.clearTable(Name.Override_Table);
  for (const [coName, gameType] of musicPlayerSettings.overrideList) {
    addOverrideDisplayDiv(coName, gameType);
  }
}

/* ************************************ Version ************************************ */
musicPlayerUI.addVersion(versions.music_player);
