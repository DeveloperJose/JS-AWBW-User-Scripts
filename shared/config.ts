/**
 * @file Constants and other project configuration settings that could be used by any scripts.
 */

/**
 * The names of the userscripts.
 */
export enum ScriptName {
  None = "none",
  MusicPlayer = "music_player",
  HighlightCursorCoordinates = "highlight_cursor_coordinates",
}

/**
 * The version numbers of the userscripts.
 */
export const versions = new Map<string, string>([
  [ScriptName.MusicPlayer, "4.7.5"],
  [ScriptName.HighlightCursorCoordinates, "2.2.2"],
]);

/**
 * The URLs to check for updates for each userscript.
 */
export const updateURLs = new Map<string, string>([
  [ScriptName.MusicPlayer, "https://update.greasyfork.org/scripts/518170/Improved%20AWBW%20Music%20Player.user.js"],
  [
    ScriptName.HighlightCursorCoordinates,
    "https://update.greasyfork.org/scripts/520884/AWBW%20Highlight%20Cursor%20Coordinates.user.js",
  ],
]);

export const homepageURLs = new Map<string, string>([
  [ScriptName.MusicPlayer, "https://greasyfork.org/en/scripts/518170-improved-awbw-music-player"],
  [ScriptName.HighlightCursorCoordinates, "https://greasyfork.org/en/scripts/520884-awbw-highlight-cursor-coordinates"],
]);

/**
 * Checks for updates for the specified script.
 * @param scriptName - The name of the script to check for updates
 * @returns - A promise that resolves with the latest version of the script
 */
export function checkIfUpdateIsAvailable(scriptName: ScriptName) {
  return new Promise<boolean>((resolve, reject) => {
    // Get the update URL
    const updateURL = updateURLs.get(scriptName);
    if (!updateURL) return reject(`Failed to get the update URL for the script.`);

    return fetch(updateURL)
      .then((response) => response.text())
      .then((text) => {
        if (!text) return reject(`Failed to get the HTML from the update URL for the script.`);

        // Get the latest version of the script from the userscript metadata
        const latestVersion = text.match(/@version\s+([0-9.]+)/)?.[1];
        if (!latestVersion) return reject(`Failed to get the latest version of the script.`);

        // Check if the latest version is newer than the current version
        const currentVersion = versions.get(scriptName);
        if (!currentVersion) return reject(`Failed to get the current version of the script.`);

        // Check if the version numbers are in the correct format
        const currentVersionParts = currentVersion.split(".");
        const latestVersionParts = latestVersion.split(".");
        const hasThreeParts = currentVersionParts.length === 3 && latestVersionParts.length === 3;
        if (!hasThreeParts) return reject(`The version number of the script is not in the correct format.`);

        // Compare the version numbers by their parts
        return resolve(
          parseInt(currentVersionParts[0]) < parseInt(latestVersionParts[0]) ||
            parseInt(currentVersionParts[1]) < parseInt(latestVersionParts[1]) ||
            parseInt(currentVersionParts[2]) < parseInt(latestVersionParts[2]),
        );
      })
      .catch((reason) => reject(reason));
  });
}
