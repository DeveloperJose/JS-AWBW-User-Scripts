/**
 * @file Debugging functions and utilities.
 */

import { getAllCONames } from "../shared/awbw_globals";
import { GameType, musicSettings } from "./music_settings";

let debugOverrides = false;

export function toggleDebugOverrides() {
  debugOverrides = !debugOverrides;

  if (debugOverrides) {
    for (const coName of getAllCONames()) {
      musicSettings.addOverride(coName, GameType.AW1);
      musicSettings.addExcludedRandomTheme(coName);
    }
  } else {
    for (const coName of getAllCONames()) {
      musicSettings.removeOverride(coName);
      musicSettings.removeExcludedRandomTheme(coName);
    }
  }
}
