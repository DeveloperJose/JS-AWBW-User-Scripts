/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
 */
import {
  addSettingsChangeListener,
  musicSettings as musicSettings,
  GameType,
  RandomThemeType,
  SettingsKey,
} from "./music_settings";
import { NodeID, CustomMenuSettingsUI, GroupType } from "../shared/custom_ui";
import { ScriptName } from "../shared/config";
import { getCurrentPageType, PageType } from "../shared/awbw_page";
import { getCurrentDocument } from "./iframe";
import { preloadAllCommonAudio } from "./music/preloading";
import { logInfo } from "./utils";
import { getNeutralImgURL, getPlayingImgURL } from "./resources";

enum Name {
  Volume = "Music Volume",
  SFX_Volume = "SFX Volume",
  UI_Volume = "UI Volume",

  No_Random = "Off",
  All_Random = "All Soundtracks",
  Current_Random = "Current Soundtrack",
  Shuffle = "Shuffle",

  Capture_Progress = "Capture Progress SFX",
  Pipe_Seam_SFX = "Pipe Seam Attack SFX",
  Restart_Themes = "Restart Themes Every Turn",
  Autoplay_Pages = "Autoplay Music Outside Of Game Pages",
  Random_Loop_Toggle = "Loop Random Songs Until Turn Changes",
  SFX_Pages = "Play Sound Effects Outside Of Game Pages",
  Alternate_Themes = "Alternate Themes",
  Seamless_Loops = "Seamless Loops In Mirror Matches",
  PlayIntros = "Play CO Intros Every Turn",

  Alternate_Day = "Alternate Themes Start On Day",

  Add_Override = "Add",
  Override_Table = "Overrides",

  Excluded_Table = "Excluded Random Themes",
}

enum Description {
  Volume = "Adjust the volume of the CO theme music, power activations, and power themes.",
  SFX_Volume = "Adjust the volume of the unit movement, tag swap, captures, and other unit sounds.",
  UI_Volume = "Adjust the volume of the UI sound effects like moving your cursor, opening menus, and selecting units.",

  AW1 = "Play the Advance Wars 1 soundtrack. There are no power themes just like the cartridge!",
  AW2 = "Play the Advance Wars 2 soundtrack. Very classy like Md Tanks.",
  DS = "Play the Advance Wars: Dual Strike soundtrack. A bit better quality than with the DS speakers though.",
  RBC = "Play the Advance Wars: Re-Boot Camp soundtrack. Even the new power themes are here now!",

  No_Random = "Play the music depending on who the current CO is.",
  All_Random = "Play random music every turn from all soundtracks.",
  Current_Random = "Play random music every turn from the current soundtrack.",
  Shuffle = "Changes the current theme to a new random one.",

  SFX_Pages = "Play sound effects on other pages like 'Your Games', 'Profile', or during maintenance.",
  Capture_Progress = "Play a sound effect when a unit makes progress capturing a property.",
  Pipe_Seam_SFX = "Play a sound effect when a pipe seam is attacked.",

  Autoplay_Pages = "Autoplay music on other pages like 'Your Games', 'Profile', or during maintenance.",
  Restart_Themes = "Restart themes at the beginning of each turn (including replays). If disabled, themes will continue from where they left off previously.",
  Seamless_Loops = "Seamlessly loop the music when playing in mirror matches. If enabled, the music will not restart when the turn changes when both players are using the same CO.",
  PlayIntros = "Play CO intros every new turn. If disabled, the intro will only play once at the start of the game.",
  Random_Loop_Toggle = "Loop random songs until a turn change happens. If disabled, when a random song ends a new random song will be chosen immediately even if the turn hasn't changed yet.",

  Alternate_Themes = "Play alternate themes like the Re-Boot Camp factory themes after a certain day. Enable this to be able to select what day alternate themes start.",
  Alternate_Day = "After what day should alternate themes like the Re-Boot Camp factory themes start playing? Can you find all the hidden themes?",

  Add_Override = "Adds an override for a specific CO so it always plays a specific soundtrack or to exclude it when playing random themes.",
  Override_Radio = "Only play songs from ",
  Remove_Override = "Removes the override for this specific CO.",

  Add_Excluded = "Add an override for a specific CO to exclude their themes when playing random themes.",
}

/**
 * Where should we place the music player UI?
 */
function getMenu() {
  const doc = getCurrentDocument();

  switch (getCurrentPageType()) {
    case PageType.Maintenance:
      return doc.querySelector("#main");
    case PageType.MapEditor:
      return doc.querySelector("#replay-misc-controls");
    case PageType.MovePlanner:
      return doc.querySelector("#map-controls-container");
    case PageType.ActiveGame:
      return doc.querySelector("#game-map-menu")?.parentNode;
    // case PageType.LiveQueue:
    // case PageType.MainPage:
    default:
      return doc.querySelector("#nav-options");
  }
}

/**
 * Event handler for when the music button is clicked that turns the music ON/OFF.
 * @param _event - Click event handler, not used.
 */
function onMusicBtnClick(_event: Event) {
  // log("Music button clicked", musicSettings);
  musicSettings.isPlaying = !musicSettings.isPlaying;
}

// CO selector
let currentSelectedCO = "andy";
function onCOSelectorClick(coName: string) {
  currentSelectedCO = coName;
}

/**
 * Event handler that is triggered whenever the settings of the music player are changed.
 * Updates the music player settings UI (context menu) so it matches the internal settings when the settings change.
 *
 * The context menu is the menu that appears when you right-click the player that shows you options.
 * This function ensures that the internal settings are reflected properly on the UI.
 * @param key - Name of the setting that changed, matches the name of the property in {@link musicSettings}.
 * @param isFirstLoad - Whether this is the first time the settings are being loaded.
 */
function onSettingsChange(key: SettingsKey, _value: unknown, isFirstLoad: boolean) {
  const musicPlayerUI = getMusicPlayerUI();
  // We are loading settings stored in LocalStorage, so set the initial values of all inputs.
  // Only do this once, when the settings are first loaded, otherwise it's infinite recursion.
  if (isFirstLoad) {
    if (volumeSlider) volumeSlider.value = musicSettings.volume.toString();
    if (sfxVolumeSlider) sfxVolumeSlider.value = musicSettings.sfxVolume.toString();
    if (uiVolumeSlider) uiVolumeSlider.value = musicSettings.uiVolume.toString();
    if (daySlider) daySlider.value = musicSettings.alternateThemeDay.toString();

    const selectedGameTypeRadio = gameTypeRadioMap.get(musicSettings.gameType);
    if (selectedGameTypeRadio) selectedGameTypeRadio.checked = true;

    const selectedRandomTypeRadio = randomRadioMap.get(musicSettings.randomThemesType);
    if (selectedRandomTypeRadio) selectedRandomTypeRadio.checked = true;

    if (captProgressBox) captProgressBox.checked = musicSettings.captureProgressSFX;
    if (pipeSeamBox) pipeSeamBox.checked = musicSettings.pipeSeamSFX;
    if (seamlessLoopsBox) seamlessLoopsBox.checked = musicSettings.seamlessLoopsInMirrors;
    if (restartThemesBox) restartThemesBox.checked = musicSettings.restartThemes;
    if (autoplayPagesBox) autoplayPagesBox.checked = musicSettings.autoplayOnOtherPages;
    if (loopToggle) loopToggle.checked = musicSettings.loopRandomSongsUntilTurnChange;
    if (introsBox) introsBox.checked = musicSettings.playIntroEveryTurn;
    if (uiSFXPagesBox) uiSFXPagesBox.checked = musicSettings.sfxOnOtherPages;
    if (alternateThemesBox) alternateThemesBox.checked = musicSettings.alternateThemes;

    // Update all labels
    musicPlayerUI.updateAllInputLabels();
  }

  // Sort overrides again if we are loading the settings for the first time, or if the override list changed
  if (key === SettingsKey.ALL || key === SettingsKey.ADD_OVERRIDE || key === SettingsKey.REMOVE_OVERRIDE) {
    clearAndRepopulateOverrideList();
    if (musicSettings.overrideList.size === 0) {
      const noOverrides = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No overrides set yet...");
      musicPlayerUI.addItemToTable(Name.Override_Table, noOverrides);
    }
  }

  if (key === SettingsKey.ALL || key === SettingsKey.ADD_EXCLUDED || key === SettingsKey.REMOVE_EXCLUDED) {
    clearAndRepopulateExcludedList();
    if (musicSettings.excludedRandomThemes.size === 0) {
      const noExcluded = musicPlayerUI.createCOPortraitImageWithText("followlist.gif", "No themes excluded yet...");
      musicPlayerUI.addItemToTable(Name.Excluded_Table, noExcluded);
    }
  }

  if (key === SettingsKey.GAME_TYPE && !isFirstLoad) {
    preloadAllCommonAudio(() => logInfo("Preloaded common audio for", _value));
  }

  // Update UI
  const canUpdateDaySlider = daySlider?.parentElement && getCurrentPageType() === PageType.ActiveGame;
  if (canUpdateDaySlider && daySlider?.parentElement)
    daySlider.parentElement.style.display = alternateThemesBox?.checked ? "flex" : "none";
  if (shuffleBtn) shuffleBtn.disabled = musicSettings.randomThemesType === RandomThemeType.NONE;

  // Update player image and hover text
  let currentSounds = getCurrentPageType() === PageType.MovePlanner ? "Sound Effects" : "Tunes";
  currentSounds += "\n(Right-Click for Settings)";
  if (musicSettings.isPlaying) {
    musicPlayerUI.setHoverText(`Stop ${currentSounds}`, true);
    musicPlayerUI.setImage(getPlayingImgURL());
  } else {
    musicPlayerUI.setHoverText(`Play ${currentSounds}`, true);
    musicPlayerUI.setImage(getNeutralImgURL());
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

let volumeSlider: HTMLInputElement | undefined;
let sfxVolumeSlider: HTMLInputElement | undefined;
let uiVolumeSlider: HTMLInputElement | undefined;
let daySlider: HTMLInputElement | undefined;

let gameTypeRadioMap: Map<GameType, HTMLInputElement>;
let randomRadioMap: Map<RandomThemeType, HTMLInputElement>;

let shuffleBtn: HTMLButtonElement | undefined;
let overrideBtn: HTMLButtonElement | undefined;

let uiSFXPagesBox: HTMLInputElement | undefined;
let captProgressBox: HTMLInputElement | undefined;
let pipeSeamBox: HTMLInputElement | undefined;
let autoplayPagesBox: HTMLInputElement | undefined;
let seamlessLoopsBox: HTMLInputElement | undefined;
let restartThemesBox: HTMLInputElement | undefined;
let loopToggle: HTMLInputElement | undefined;
let introsBox: HTMLInputElement | undefined;
let alternateThemesBox: HTMLInputElement | undefined;

let radioNormal: HTMLInputElement | undefined;
let radioAllRandom: HTMLInputElement | undefined;
let radioCurrentRandom: HTMLInputElement | undefined;
let excludeRadio: HTMLInputElement | undefined;

let overrideGameTypeRadioMap: Map<GameType, HTMLInputElement> | undefined;
let overrideDivMap: Map<string, HTMLDivElement> | undefined;
let excludedListDivMap: Map<string, HTMLDivElement> | undefined;

/**
 * The music player UI for the settings.
 */
let __musicPlayerUI: CustomMenuSettingsUI;
export function getMusicPlayerUI() {
  if (__musicPlayerUI) return __musicPlayerUI;
  __musicPlayerUI = new CustomMenuSettingsUI(ScriptName.MusicPlayer, getNeutralImgURL(), "Play Tunes");
  const musicPlayerUI = __musicPlayerUI;

  /* ************************************ Left Menu ************************************ */
  const LEFT = NodeID.Settings_Left;

  /* **** Group: Volume sliders **** */
  volumeSlider = musicPlayerUI.addSlider(Name.Volume, 0, 1, 0.005, Description.Volume, LEFT);
  sfxVolumeSlider = musicPlayerUI.addSlider(Name.SFX_Volume, 0, 1, 0.005, Description.SFX_Volume, LEFT);
  uiVolumeSlider = musicPlayerUI.addSlider(Name.UI_Volume, 0, 1, 0.005, Description.UI_Volume, LEFT);

  /* **** Group: Soundtrack radio buttons (AW1, AW2, DS, RBC) AKA GameType **** */
  const soundtrackGroupID = "Soundtrack";
  musicPlayerUI.addGroup(soundtrackGroupID, GroupType.Horizontal, LEFT);

  // Radio buttons
  gameTypeRadioMap = new Map();
  for (const gameType of Object.values(GameType)) {
    const description = Description[gameType as keyof typeof Description];
    const radio = musicPlayerUI.addRadioButton(gameType, soundtrackGroupID, description);
    gameTypeRadioMap.set(gameType, radio);
  }

  /* **** Group: Random themes radio buttons **** */
  const randomGroupID = "Random Themes";
  musicPlayerUI.addGroup(randomGroupID, GroupType.Horizontal, LEFT);

  // Radio buttons
  radioNormal = musicPlayerUI.addRadioButton(Name.No_Random, randomGroupID, Description.No_Random);
  radioAllRandom = musicPlayerUI.addRadioButton(Name.All_Random, randomGroupID, Description.All_Random);
  radioCurrentRandom = musicPlayerUI.addRadioButton(Name.Current_Random, randomGroupID, Description.Current_Random);

  randomRadioMap = new Map<RandomThemeType, HTMLInputElement>([
    [RandomThemeType.NONE, radioNormal],
    [RandomThemeType.ALL_THEMES, radioAllRandom],
    [RandomThemeType.CURRENT_SOUNDTRACK, radioCurrentRandom],
  ]);

  // Random theme shuffle button
  shuffleBtn = musicPlayerUI.addButton(Name.Shuffle, randomGroupID, Description.Shuffle);

  /* **** Group: SFX Options **** */
  const sfxGroupID = "Sound Effect (SFX) Options";
  musicPlayerUI.addGroup(sfxGroupID, GroupType.Vertical, LEFT);
  uiSFXPagesBox = musicPlayerUI.addCheckbox(Name.SFX_Pages, sfxGroupID, Description.SFX_Pages);
  captProgressBox = musicPlayerUI.addCheckbox(Name.Capture_Progress, sfxGroupID, Description.Capture_Progress);
  pipeSeamBox = musicPlayerUI.addCheckbox(Name.Pipe_Seam_SFX, sfxGroupID, Description.Pipe_Seam_SFX);

  /* **** Group: Music Options **** */
  const musicGroupID = "Music Options";
  musicPlayerUI.addGroup(musicGroupID, GroupType.Vertical, LEFT);

  // Checkboxes
  autoplayPagesBox = musicPlayerUI.addCheckbox(Name.Autoplay_Pages, musicGroupID, Description.Autoplay_Pages);
  seamlessLoopsBox = musicPlayerUI.addCheckbox(Name.Seamless_Loops, musicGroupID, Description.Seamless_Loops);
  restartThemesBox = musicPlayerUI.addCheckbox(Name.Restart_Themes, musicGroupID, Description.Restart_Themes);
  loopToggle = musicPlayerUI.addCheckbox(Name.Random_Loop_Toggle, musicGroupID, Description.Random_Loop_Toggle);
  introsBox = musicPlayerUI.addCheckbox(Name.PlayIntros, musicGroupID, Description.PlayIntros);

  alternateThemesBox = musicPlayerUI.addCheckbox(Name.Alternate_Themes, musicGroupID, Description.Alternate_Themes);

  /* **** Group: Day slider **** */
  daySlider = musicPlayerUI.addSlider(Name.Alternate_Day, 0, 30, 1, Description.Alternate_Day, LEFT);

  /* ************************************ Right Menu ************************************ */
  const RIGHT = NodeID.Settings_Right;

  /* **** Group: Override Themes **** */
  const addOverrideGroupID = "Override Themes";
  musicPlayerUI.addGroup(addOverrideGroupID, GroupType.Horizontal, RIGHT);

  // TODO:
  musicPlayerUI.addCOSelector(addOverrideGroupID, Description.Add_Override, onCOSelectorClick);

  // Game type radio buttons
  overrideGameTypeRadioMap = new Map<GameType, HTMLInputElement>();
  for (const gameType of Object.values(GameType)) {
    const radio = musicPlayerUI.addRadioButton(gameType, addOverrideGroupID, Description.Override_Radio + gameType);
    overrideGameTypeRadioMap.set(gameType, radio);
    radio.checked = true;
  }
  excludeRadio = musicPlayerUI.addRadioButton("Exclude Random", addOverrideGroupID, Description.Add_Excluded);

  // Add override button
  overrideBtn = musicPlayerUI.addButton(Name.Add_Override, addOverrideGroupID, Description.Add_Override);

  /* **** Group: Override List **** */
  const overrideListGroupID = "Current Overrides (Click to Remove)";
  musicPlayerUI.addGroup(overrideListGroupID, GroupType.Horizontal, RIGHT);

  overrideDivMap = new Map<string, HTMLDivElement>();
  const tableRows = 4;
  const tableCols = 7;
  musicPlayerUI.addTable(Name.Override_Table, tableRows, tableCols, overrideListGroupID, Description.Remove_Override);

  /* **** Group: Not Randomized List **** */
  const excludedListGroupID = "Themes Excluded From Randomizer (Click to Remove)";
  musicPlayerUI.addGroup(excludedListGroupID, GroupType.Horizontal, RIGHT);

  excludedListDivMap = new Map<string, HTMLDivElement>();
  musicPlayerUI.addTable(Name.Excluded_Table, tableRows, tableCols, excludedListGroupID, Description.Remove_Override);

  /* ************************************ Version ************************************ */
  musicPlayerUI.addVersion();
  addMusicUIListeners();
  return musicPlayerUI;
}
/* ************************************ Event Listeners ************************************ */

/**
 * Initializes the music player UI based on the current page type.
 */
export function initializeMusicPlayerUI() {
  const musicPlayerUI = getMusicPlayerUI();

  // logInfo("Initializing music player UI", getCurrentPageType());
  musicPlayerUI.setProgress(100);

  // Make adjustments to the UI based on the page we are on
  let prepend = false;
  switch (getCurrentPageType()) {
    // case PageType.LiveQueue:
    //   return;
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

function addMusicUIListeners() {
  const musicPlayerUI = getMusicPlayerUI();
  // Determine who will catch when the user clicks the play/stop button
  musicPlayerUI.addEventListener("click", onMusicBtnClick);

  // Listen for setting changes to update the menu UI
  addSettingsChangeListener(onSettingsChange);

  volumeSlider?.addEventListener("input", (event) => (musicSettings.volume = parseInputFloat(event)));
  sfxVolumeSlider?.addEventListener("input", (event) => (musicSettings.sfxVolume = parseInputFloat(event)));
  uiVolumeSlider?.addEventListener("input", (event) => (musicSettings.uiVolume = parseInputFloat(event)));

  radioNormal?.addEventListener("click", (_e) => (musicSettings.randomThemesType = RandomThemeType.NONE));
  radioAllRandom?.addEventListener("click", (_e) => (musicSettings.randomThemesType = RandomThemeType.ALL_THEMES));
  radioCurrentRandom?.addEventListener(
    "click",
    (_e) => (musicSettings.randomThemesType = RandomThemeType.CURRENT_SOUNDTRACK),
  );

  for (const gameType of Object.values(GameType)) {
    const radio = gameTypeRadioMap.get(gameType);
    radio?.addEventListener("click", (_e) => (musicSettings.gameType = gameType));
  }

  shuffleBtn?.addEventListener("click", (_e) => musicSettings.randomizeCO());

  captProgressBox?.addEventListener(
    "click",
    (_e) => (musicSettings.captureProgressSFX = (_e.target as HTMLInputElement).checked),
  );
  pipeSeamBox?.addEventListener("click", (_e) => (musicSettings.pipeSeamSFX = (_e.target as HTMLInputElement).checked));
  restartThemesBox?.addEventListener(
    "click",
    (_e) => (musicSettings.restartThemes = (_e.target as HTMLInputElement).checked),
  );
  autoplayPagesBox?.addEventListener(
    "click",
    (_e) => (musicSettings.autoplayOnOtherPages = (_e.target as HTMLInputElement).checked),
  );
  loopToggle?.addEventListener(
    "click",
    (_e) => (musicSettings.loopRandomSongsUntilTurnChange = (_e.target as HTMLInputElement).checked),
  );
  uiSFXPagesBox?.addEventListener(
    "click",
    (_e) => (musicSettings.sfxOnOtherPages = (_e.target as HTMLInputElement).checked),
  );
  alternateThemesBox?.addEventListener(
    "click",
    (_e) => (musicSettings.alternateThemes = (_e.target as HTMLInputElement).checked),
  );
  seamlessLoopsBox?.addEventListener(
    "click",
    (_e) => (musicSettings.seamlessLoopsInMirrors = (_e.target as HTMLInputElement).checked),
  );
  introsBox?.addEventListener(
    "click",
    (_e) => (musicSettings.playIntroEveryTurn = (_e.target as HTMLInputElement).checked),
  );

  daySlider?.addEventListener("input", (event) => (musicSettings.alternateThemeDay = parseInputInt(event)));

  overrideBtn?.addEventListener("click", (_e) => {
    if (!overrideGameTypeRadioMap) return;
    // Check if it's an exclude
    if (excludeRadio?.checked) {
      musicSettings.addExcludedRandomTheme(currentSelectedCO);
      return;
    }

    // Get the selected game type
    let currentGameType: GameType | undefined;
    for (const [gameType, radio] of overrideGameTypeRadioMap) {
      if (radio.checked) currentGameType = gameType;
    }
    // Add the override
    if (!currentGameType) return;
    musicSettings.addOverride(currentSelectedCO, currentGameType);
  });
}

function addOverrideDisplayDiv(coName: string, gameType: GameType) {
  if (!overrideDivMap) return;
  const musicPlayerUI = getMusicPlayerUI();
  const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, gameType);

  displayDiv.addEventListener("click", (_event) => {
    musicSettings.removeOverride(coName);
  });

  overrideDivMap.set(coName, displayDiv);
  musicPlayerUI.addItemToTable(Name.Override_Table, displayDiv);
  return displayDiv;
}

function clearAndRepopulateOverrideList() {
  if (!overrideDivMap) return;
  const musicPlayerUI = getMusicPlayerUI();
  overrideDivMap.forEach((div) => div.remove());
  overrideDivMap.clear();
  musicPlayerUI.clearTable(Name.Override_Table);
  for (const [coName, gameType] of musicSettings.overrideList) {
    addOverrideDisplayDiv(coName, gameType);
  }
}

function addExcludedDisplayDiv(coName: string) {
  if (!excludedListDivMap) return;
  const musicPlayerUI = getMusicPlayerUI();
  const displayDiv = musicPlayerUI.createCOPortraitImageWithText(coName, "");

  displayDiv.addEventListener("click", (_event) => {
    musicSettings.removeExcludedRandomTheme(coName);
  });

  excludedListDivMap.set(coName, displayDiv);
  musicPlayerUI.addItemToTable(Name.Excluded_Table, displayDiv);
  return displayDiv;
}

function clearAndRepopulateExcludedList() {
  if (!excludedListDivMap) return;
  const musicPlayerUI = getMusicPlayerUI();
  excludedListDivMap.forEach((div) => div.remove());
  excludedListDivMap.clear();
  musicPlayerUI.clearTable(Name.Excluded_Table);
  for (const coName of musicSettings.excludedRandomThemes) addExcludedDisplayDiv(coName);
}
