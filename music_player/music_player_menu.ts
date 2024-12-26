/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of the music player UI.
 */
import { isMapEditor } from "../shared/awbw_page";
import { menu } from "../shared/awbw_page";
import { NEUTRAL_IMG_URL, PLAYING_IMG_URL } from "./resources";
import { addSettingsMenuToMusicPlayer } from "./settings_menu";
import { addSettingsChangeListener, musicPlayerSettings } from "./music_settings";
import { CustomMenuSettingsUI } from "../shared/custom_ui";

// Create the music player UI
export const musicPlayerUI = new CustomMenuSettingsUI(
  "music-player",
  NEUTRAL_IMG_URL,
  "Play Tunes",
);

// Determine who will catch when the user clicks the play/stop button
musicPlayerUI.addClickHandler(onMusicBtnClick);

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
 * @param key - Name of the setting that changed, matches the name of the property in {@link musicPlayerSettings}.
 */
function onSettingsChange(key: string) {
  if (key != "isPlaying") return;

  // Update UI
  if (musicPlayerSettings.isPlaying) {
    musicPlayerUI.setHoverText("Stop Tunes");
    musicPlayerUI.setImage(PLAYING_IMG_URL);
  } else {
    musicPlayerUI.setHoverText("Play Tunes");
    musicPlayerUI.setImage(NEUTRAL_IMG_URL);
  }
}
