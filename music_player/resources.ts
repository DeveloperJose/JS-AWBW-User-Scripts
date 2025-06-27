/**
 * @file All external resources used by this userscript like URLs and convenience functions for those URLs.
 */
import { getAllPlayingCONames, getCurrentGameDay, SpecialCOs } from "../shared/awbw_game";
import { getAllCONames, AW_DS_ONLY_COs, isBlackHoleCO } from "../shared/awbw_globals";
import { GameType, RandomThemeType, ThemeType, musicSettings } from "./music_settings";

/**
 * List of possible URLs to download music files from
 */

const CANDIDATE_BASE_URLS = ["https://developerjose.netlify.app", "https://awbw-devj.duckdns.org"];

/**
 * Base URL where all the files needed for this script are located.
 */
let BASE_URL: string;

/**
 * Finds a working base URL from a list of candidates
 */
export async function getWorkingBaseURL() {
  for (const url of CANDIDATE_BASE_URLS) {
    try {
      const res = await fetch(`${url}/img/music-player-icon.png`, { method: "HEAD" });
      if (res.ok) {
        BASE_URL = url;
        return url;
      }
    } catch {
      // ignore errors and try next
    }
  }
  return false;
}

const getURLForMusicFile = (fname: string) => `${BASE_URL}/music/${fname}`;

/**
 * Image URL for static music player icon
 */
export const getNeutralImgURL = () => `${BASE_URL}/img/music-player-icon.png`;

/**
 * Image URL for animated music player icon.
 */
export const getPlayingImgURL = () => `${BASE_URL}/img/music-player-playing.gif`;

/**
 * URL for the JSON file containing the hashes for all the music files.
 */
export const getHashesJSONURL = () => `${BASE_URL}/music/hashes.json`;

/**
 * URLs for the special themes that are not related to specific COs.
 * @enum {string}
 */
export const enum SpecialTheme {
  Victory = "t-victory.ogg",
  Defeat = "t-defeat.ogg",
  Maintenance = "t-maintenance.ogg",
  COSelect = "t-co-select.ogg",
  // ModeSelect = "t-mode-select.ogg",
}

/**
 * Enumeration of all game sound effects. The values are the filenames for the sounds.
 * @enum {string}
 */
export enum GameSFX {
  coGoldRush = "co-gold-rush",

  powerActivateAllyCOP = "power-activate-ally-cop",
  powerActivateAllySCOP = "power-activate-ally-scop",
  powerActivateBHCOP = "power-activate-bh-cop",
  powerActivateBHSCOP = "power-activate-bh-scop",
  powerActivateAW1COP = "power-activate-aw1-cop",

  powerSCOPAvailable = "power-scop-available",
  powerCOPAvailable = "power-cop-available",

  tagBreakAlly = "tag-break-ally",
  tagBreakBH = "tag-break-bh",
  tagSwap = "tag-swap",

  unitAttackPipeSeam = "unit-attack-pipe-seam",
  unitCaptureAlly = "unit-capture-ally",
  unitCaptureEnemy = "unit-capture-enemy",
  unitCaptureProgress = "unit-capture-progress",
  unitMissileHit = "unit-missile-hit",
  unitMissileSend = "unit-missile-send",
  unitHide = "unit-hide",
  unitUnhide = "unit-unhide",
  unitSupply = "unit-supply",
  unitTrap = "unit-trap",
  unitLoad = "unit-load",
  unitUnload = "unit-unload",
  unitExplode = "unit-explode",

  uiCursorMove = "ui-cursor-move",
  uiInvalid = "ui-invalid",
  uiMenuOpen = "ui-menu-open",
  uiMenuClose = "ui-menu-close",
  uiMenuMove = "ui-menu-move",
  uiUnitSelect = "ui-unit-select",
}

/**
 * Enumeration of all the unit movement sounds. The values are the filenames for the sounds.
 * @enum {string}
 */
export enum MovementSFX {
  moveBCopterLoop = "move-bcopter",
  moveBCopterOneShot = "move-bcopter-rolloff",
  moveInfLoop = "move-inf",
  moveMechLoop = "move-mech",
  moveNavalLoop = "move-naval",
  movePiperunnerLoop = "move-piperunner",
  movePlaneLoop = "move-plane",
  movePlaneOneShot = "move-plane-rolloff",
  moveSubLoop = "move-sub",
  moveTCopterLoop = "move-tcopter",
  moveTCopterOneShot = "move-tcopter-rolloff",
  moveTiresHeavyLoop = "move-tires-heavy",
  moveTiresHeavyOneShot = "move-tires-heavy-rolloff",
  moveTiresLightLoop = "move-tires-light",
  moveTiresLightOneShot = "move-tires-light-rolloff",
  moveTreadHeavyLoop = "move-tread-heavy",
  moveTreadHeavyOneShot = "move-tread-heavy-rolloff",
  moveTreadLightLoop = "move-tread-light",
  moveTreadLightOneShot = "move-tread-light-rolloff",
}

/**
 * Map that takes unit names as keys and gives you the filename for that unit movement sound.
 */
const onMovementStartMap = new Map([
  ["APC", MovementSFX.moveTreadLightLoop],
  ["Anti-Air", MovementSFX.moveTreadLightLoop],
  ["Artillery", MovementSFX.moveTreadLightLoop],
  ["B-Copter", MovementSFX.moveBCopterLoop],
  ["Battleship", MovementSFX.moveNavalLoop],
  ["Black Boat", MovementSFX.moveNavalLoop],
  ["Black Bomb", MovementSFX.movePlaneLoop],
  ["Bomber", MovementSFX.movePlaneLoop],
  ["Carrier", MovementSFX.moveNavalLoop],
  ["Cruiser", MovementSFX.moveNavalLoop],
  ["Fighter", MovementSFX.movePlaneLoop],
  ["Infantry", MovementSFX.moveInfLoop],
  ["Lander", MovementSFX.moveNavalLoop],
  ["Md.Tank", MovementSFX.moveTreadHeavyLoop],
  ["Mech", MovementSFX.moveMechLoop],
  ["Mega Tank", MovementSFX.moveTreadHeavyLoop],
  ["Missile", MovementSFX.moveTiresHeavyLoop],
  ["Neotank", MovementSFX.moveTreadHeavyLoop],
  ["Piperunner", MovementSFX.movePiperunnerLoop],
  ["Recon", MovementSFX.moveTiresLightLoop],
  ["Rocket", MovementSFX.moveTiresHeavyLoop],
  ["Stealth", MovementSFX.movePlaneLoop],
  ["Sub", MovementSFX.moveSubLoop],
  ["T-Copter", MovementSFX.moveTCopterLoop],
  ["Tank", MovementSFX.moveTreadLightLoop],
]);

/**
 * Map that takes unit names as keys and gives you the filename to play when that unit has stopped moving, if any.
 */
const onMovementRolloffMap = new Map([
  ["APC", MovementSFX.moveTreadLightOneShot],
  ["Anti-Air", MovementSFX.moveTreadLightOneShot],
  ["Artillery", MovementSFX.moveTreadLightOneShot],
  ["B-Copter", MovementSFX.moveBCopterOneShot],
  ["Black Bomb", MovementSFX.movePlaneOneShot],
  ["Bomber", MovementSFX.movePlaneOneShot],
  ["Fighter", MovementSFX.movePlaneOneShot],
  ["Md.Tank", MovementSFX.moveTreadHeavyOneShot],
  ["Mega Tank", MovementSFX.moveTreadHeavyOneShot],
  ["Missile", MovementSFX.moveTiresHeavyOneShot],
  ["Neotank", MovementSFX.moveTreadHeavyOneShot],
  ["Recon", MovementSFX.moveTiresLightOneShot],
  ["Rocket", MovementSFX.moveTiresHeavyOneShot],
  ["Stealth", MovementSFX.movePlaneOneShot],
  ["T-Copter", MovementSFX.moveTCopterOneShot],
  ["Tank", MovementSFX.moveTreadLightOneShot],
]);

/**
 * Map that takes a game type and gives you a set of CO names that have alternate themes for that game type.
 */
const alternateThemes = new Map([
  [GameType.AW1, new Set(["sturm"])],
  [GameType.AW2, new Set(["sturm"])],
  [GameType.DS, new Set(["sturm", "vonbolt"])],
  [GameType.RBC, new Set(["andy", "olaf", "eagle", "drake", "grit", "kanbei", "sonja", "sturm"])],
]);

const introThemes = new Map([
  [GameType.AW1, new Set([])],
  [GameType.AW2, new Set(["andy", "colin", "grit", "hachi", "jess", "kanbei", "lash", "olaf", "mode-select"])],
  [GameType.DS, new Set(["jess", "rachel"])],
  [GameType.RBC, new Set([])],
]);

/**
 * Determines the filename for the alternate music to play given a specific CO and other settings (if any).
 * @param coName - Name of the CO whose music to use.
 * @param gameType - Which game soundtrack to use.
 * @param themeType - Which type of music whether regular or power.
 * @returns - The filename of the alternate music to play given the parameters, if any.
 */
function getAlternateMusicFilename(coName: string, gameType: GameType, themeType: ThemeType) {
  // Check if this CO has an alternate theme
  if (!alternateThemes.has(gameType)) return;
  const alternateThemesSet = alternateThemes.get(gameType);

  const faction = isBlackHoleCO(coName) ? "bh" : "ally";

  // RBC individual CO power themes -> RBC shared factory themes
  const isPowerActive = themeType !== ThemeType.REGULAR;
  if (gameType === GameType.RBC && isPowerActive) {
    return `t-${faction}-${themeType}`;
  }

  // No alternate theme or it's a power
  if (!alternateThemesSet?.has(coName) || isPowerActive) {
    return;
  }

  // Andy -> Clone Andy
  if (coName === "andy" && gameType == GameType.RBC) {
    return isPowerActive ? "t-clone-andy-cop-intro" : "t-clone-andy";
  }

  // All other alternate themes
  return `t-${coName}-2`;
}

/**
 * Determines the filename for the music to play given a specific CO and other settings.
 * @param coName - Name of the CO whose music to use.
 * @param actualGameType - Which game soundtrack to use (must be valid for given CO).
 * @param requestedGameType - Which game soundtrack the user has selected (might not exist for given CO)
 * @param themeType - Which type of music whether regular or power.
 * @returns - The filename of the music to play given the parameters.
 */
function getMusicFilename(
  coName: string,
  requestedGameType: GameType,
  actualGameType: GameType,
  themeType: ThemeType,
  useAlternateTheme: boolean,
) {
  const hasIntro = introThemes.get(actualGameType)?.has(coName);
  // Check if we want to play the map editor theme
  if (coName === SpecialCOs.MapEditor) return "t-map-editor";
  if (coName === SpecialCOs.ModeSelect) return hasIntro ? "t-mode-select-intro" : "t-mode-select";

  // Check if we need to play an alternate theme
  if (useAlternateTheme) {
    const alternateFilename = getAlternateMusicFilename(coName, actualGameType, themeType);
    if (alternateFilename) return alternateFilename;
  }

  // Regular theme, either no power or we are in AW1 where there's no power themes.
  // We only skip if AW1 mode is enabled and there's no random themes
  const isPowerActive = themeType !== ThemeType.REGULAR;
  const skipPowerTheme = requestedGameType === GameType.AW1 && musicSettings.randomThemesType === RandomThemeType.NONE;
  if (!isPowerActive || skipPowerTheme) {
    return hasIntro ? `t-${coName}-intro` : `t-${coName}`;
  }

  // For RBC, we play the new power themes (if they are not in the DS games obviously)
  const isCOInRBC = !AW_DS_ONLY_COs.has(coName);
  if (requestedGameType === GameType.RBC && isCOInRBC) {
    return `t-${coName}-cop-intro`;
  }

  // For all other games, play the ally or black hole themes during the CO and Super CO powers
  const faction = isBlackHoleCO(coName) ? "bh" : "ally";
  return `t-${faction}-${themeType}`;
}

/**
 * Determines the URL for the music to play given a specific CO, and optionally, some specific settings.
 * The settings will be loaded from the current saved settings if they aren't specified.
 *
 * @param coName - Name of the CO whose music to use.
 * @param gameType - (Optional) Which game soundtrack to use.
 * @param themeType - (Optional) Which type of music to use whether regular or power.
 * @param useAlternateTheme - (Optional) Whether to use the alternate theme for the given CO.
 * @returns - The complete URL of the music to play given the parameters.
 */
export function getMusicURL(coName: string, gameType?: GameType, themeType?: ThemeType, useAlternateTheme?: boolean) {
  // Override optional parameters with current settings if not provided
  if (gameType === null || gameType === undefined) gameType = musicSettings.gameType;
  if (themeType === null || themeType === undefined) themeType = musicSettings.themeType;
  if (useAlternateTheme === null || useAlternateTheme === undefined) {
    useAlternateTheme = getCurrentGameDay() >= musicSettings.alternateThemeDay && musicSettings.alternateThemes;
  }

  // Convert name to internal format
  coName = coName.toLowerCase().replaceAll(" ", "");

  // Check if we want to play a special theme;
  if (coName === SpecialCOs.Victory) return getURLForMusicFile(SpecialTheme.Victory);
  if (coName === SpecialCOs.Defeat) return getURLForMusicFile(SpecialTheme.Defeat);
  if (coName === SpecialCOs.Maintenance) return getURLForMusicFile(SpecialTheme.Maintenance);
  if (coName === SpecialCOs.COSelect) return getURLForMusicFile(SpecialTheme.COSelect);

  if (
    coName === SpecialCOs.ModeSelect ||
    coName === SpecialCOs.MainPage ||
    coName === SpecialCOs.LiveQueue ||
    coName === SpecialCOs.Default
  )
    coName = SpecialCOs.ModeSelect;

  // First apply player overrides, that way we can override their overrides later...
  const overrideType = musicSettings.getOverride(coName);
  if (overrideType) gameType = overrideType;
  const requestedGameType = gameType;
  // Override the game type to a higher game if the CO is not in the current soundtrack
  if (gameType !== GameType.DS && AW_DS_ONLY_COs.has(coName)) gameType = GameType.DS;

  // These special themes vary depending on the game type
  const isSpecialCO = coName === SpecialCOs.MapEditor || coName === SpecialCOs.ModeSelect;

  // All AW1 COs except the special COs will use the AW2 music
  if (gameType === GameType.AW1 && !isSpecialCO) gameType = GameType.AW2;

  const filename = getMusicFilename(coName, requestedGameType, gameType, themeType, useAlternateTheme);

  let gameDir = gameType as string;
  if (!gameDir.startsWith("AW")) gameDir = "AW_" + gameDir;

  const url = getURLForMusicFile(`${gameDir}/${filename}.ogg`);
  return url.toLowerCase().replaceAll("_", "-").replaceAll(" ", "");
}

/**
 * Gets the name of the CO from the given URL, if any.
 * @param url - URL to get the CO name from.
 * @returns - The name of the CO from the given URL.
 */
export function getCONameFromURL(url: string) {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];

  // Remove t- prefix and .ogg extension
  const coName = filename.split(".")[0].substring(2);
  return coName;
}

/**
 * Gets the URL for the given sound effect.
 * @param sfx - Sound effect enum to use.
 * @returns - The URL of the given sound effect.
 */
export function getSoundEffectURL(sfx: GameSFX) {
  return `${BASE_URL}/music/sfx/${sfx}.ogg`;
}

/**
 * Gets the URL to play when the given unit starts to move.
 * @param unitName - Name of the unit.
 * @returns - The URL of the given unit's movement start sound.
 */
export function getMovementSoundURL(unitName: string) {
  const sfx = onMovementStartMap.get(unitName);
  if (!sfx) return "";

  return `${BASE_URL}/music/sfx/${onMovementStartMap.get(unitName)}.ogg`;
}

/**
 * Getes the URL to play when the given unit stops moving, if any.
 * @param unitName - Name of the unit.
 * @returns - The URL of the given unit's movement stop sound, if any, or null otherwise.
 */
export function getMovementRollOffURL(unitName: string) {
  return `${BASE_URL}/music/sfx/${onMovementRolloffMap.get(unitName)}.ogg`;
}

/**
 * Checks if the given unit plays a sound when it stops moving.
 * @param unitName - Name of the unit.
 * @returns - True if the given unit has a sound to play when it stops moving.
 */
export function hasMovementRollOff(unitName: string) {
  return onMovementRolloffMap.has(unitName);
}

/**
 * Gets all the URLs for the music of all currently playing COs for the current game settings.
 * Includes the regular and alternate themes for each CO (if any).
 * @returns - Set with all the URLs for current music of all currently playing COs.
 */
export function getCurrentThemeURLs(): Set<string> {
  const coNames = getAllPlayingCONames();
  const audioList = new Set<string>();

  coNames.add(SpecialCOs.MapEditor);
  coNames.add(SpecialCOs.ModeSelect);
  coNames.forEach((name) => {
    const regularURL = getMusicURL(name, musicSettings.gameType, ThemeType.REGULAR, false);
    const powerURL = getMusicURL(name, musicSettings.gameType, ThemeType.CO_POWER, false);
    const superPowerURL = getMusicURL(name, musicSettings.gameType, ThemeType.SUPER_CO_POWER, false);
    const alternateURL = getMusicURL(name, musicSettings.gameType, musicSettings.themeType, true);
    audioList.add(regularURL);
    audioList.add(alternateURL);
    audioList.add(powerURL);
    audioList.add(superPowerURL);
    if (regularURL.includes("-intro")) audioList.add(regularURL.replace("-intro", ""));
    if (powerURL.includes("-intro")) audioList.add(powerURL.replace("-intro", ""));
  });
  return audioList;
}

/**
 * Gets a list of the URLs for all sound effects the music player might ever use.
 * These include game effects, UI effects, and unit movement sounds.
 * @returns - Set with all the URLs for all the music player sound effects.
 */
function getAllSoundEffectURLs() {
  const allSoundURLs = new Set<string>();
  for (const sfx of Object.values(GameSFX)) {
    allSoundURLs.add(getSoundEffectURL(sfx));
  }

  // for (const unitName of onMovementStartMap.keys()) {
  //   allSoundURLs.add(getMovementSoundURL(unitName));
  // }
  // for (const unitName of onMovementRolloffMap.keys()) {
  //   allSoundURLs.add(getMovementRollOffURL(unitName));
  // }

  return allSoundURLs;
}

/**
 * Gets a list of the URLs for all the audio the music player might ever use.
 * @returns - Set with all the URLs for all the audio.
 */
export function getAllAudioURLs() {
  // Sound effects
  const allSoundURLs = getAllSoundEffectURLs();

  // Themes
  const coNames = getAllCONames();
  coNames.push(SpecialCOs.MapEditor);
  coNames.push(SpecialCOs.ModeSelect);
  for (const coName of coNames) {
    for (const gameType of Object.values(GameType)) {
      for (const themeType of Object.values(ThemeType)) {
        const url = getMusicURL(coName, gameType, themeType, false);
        if (url.includes("-intro")) {
          allSoundURLs.add(url.replace("-intro", ""));
        }
        const alternateURL = getMusicURL(coName, gameType, themeType, true);
        allSoundURLs.add(url);
        allSoundURLs.add(alternateURL);
      }
    }
  }

  // Special themes
  allSoundURLs.add(SpecialTheme.COSelect);
  allSoundURLs.add(SpecialTheme.Maintenance);
  allSoundURLs.add(SpecialTheme.Victory);
  allSoundURLs.add(SpecialTheme.Defeat);
  return allSoundURLs;
}
