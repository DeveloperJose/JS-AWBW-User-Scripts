export const STORAGE_KEY = "musicPlayerSettings";

export const GAME_TYPE = Object.freeze({
  AW1: "aw1",
  AW2: "aw2",
  AWDS: "awds",
  AWRBC: "awrbc",
});

const onSettingsChangeListeners = [];

export function addSettingsChangeListener(fn) {
  onSettingsChangeListeners.push(fn);
}

export const musicPlayerSettings = {
  __isPlaying: false,
  __volume: 0.5,
  __sfxVolume: 0.35,
  __uiVolume: 0.425,
  __gameType: GAME_TYPE.AWDS,
  // TODO: Shuffle
  // TODO: Alternate Themes
  // TODO: Powers

  set isPlaying(val) {
    this.__isPlaying = val;
    this.onSettingChangeEvent("isPlaying");
  },

  get isPlaying() {
    return this.__isPlaying;
  },

  set volume(val) {
    this.__volume = val;
    this.onSettingChangeEvent("volume");
  },

  get volume() {
    return this.__volume;
  },

  set sfxVolume(val) {
    this.__sfxVolume = val;
    this.onSettingChangeEvent("sfxVolume");
  },

  get sfxVolume() {
    return this.__sfxVolume;
  },

  set uiVolume(val) {
    this.__uiVolume = val;
    this.onSettingChangeEvent("uiVolume");
  },
  get uiVolume() {
    return this.__uiVolume;
  },

  set gameType(val) {
    // TODO: Validate
    this.__gameType = val;
    this.onSettingChangeEvent("gameType");
  },
  get gameType() {
    return this.__gameType;
  },

  onSettingChangeEvent(key) {
    onSettingsChangeListeners.forEach((fn) => fn(key));
  },
};

/**
 * Loads the music player settings stored in the local storage.
 */
export function loadSettingsFromLocalStorage() {
  let storageData = localStorage.getItem(STORAGE_KEY);

  // Store defaults if nothing is stored
  if (storageData === null) {
    updateSettingsInLocalStorage();
  }

  // Only keep and set settings that are in the current version
  // Only keep internal __vars
  let savedSettings = JSON.parse(storageData);
  for (let key in musicPlayerSettings) {
    if (Object.hasOwn(savedSettings, key) && key.startsWith("__")) {
      // Key without __ prefix
      let regularKey = key.substring(2);
      console.log(
        "[AWBW Improved Music Player] Loaded setting:" + regularKey + "=" + savedSettings[key],
      );
      musicPlayerSettings[regularKey] = savedSettings[key];
    }
  }

  // From now on, any setting changes will be saved
  addSettingsChangeListener(updateSettingsInLocalStorage);
}

/**
 * Saves the current music player settings in the local storage.
 */
function updateSettingsInLocalStorage() {
  console.log(
    "[AWBW Improved Music Player] Saving settings:" + JSON.stringify(musicPlayerSettings),
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(musicPlayerSettings));
}
