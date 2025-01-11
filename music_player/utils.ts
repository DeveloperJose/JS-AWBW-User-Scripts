/**
 * @file Utility functions for the music player that don't fit anywhere else specifically.
 */

/**
 * Logs a message to the console with the prefix "[AWBW Improved Music Player]"
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(message: any, ...args: any[]): void {
  console.log("[AWBW Improved Music Player]", message, ...args);
}

/**
 * Logs a warning message to the console with the prefix "[AWBW Improved Music Player]"
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logError(message: any, ...args: any[]): void {
  console.error("[AWBW Improved Music Player]", message, ...args);
}

/**
 * Logs a debug message to the console with the prefix "[AWBW Improved Music Player]"
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logDebug(message: any, ...args: any[]): void {
  console.debug("[AWBW Improved Music Player]", message, ...args);
}
