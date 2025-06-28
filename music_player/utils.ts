/**
 * @file Utility functions for the music player that don't fit anywhere else specifically.
 */

/**
 * Logs a message to the console with the prefix "[AWBW Improved Music Player]"
 * @param message - The message to log
 * @param args - Additional arguments to log
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logInfo(message: any, ...args: any[]): void {
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

/**
 * Determines if the current browser is Firefox
 * @returns - True if the current browser is Firefox, false otherwise
 */
export function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
}

/**
 * Makes it so multiple successive calls to a function within a specified period of time only call the function once.
 * https://stackoverflow.com/questions/72205837/safe-type-debounce-function-in-typescript
 * @param ms - The number of milliseconds within which to debounce the function.
 * @param callback - The function to debounce.
 * @param immediate - Whether to call the function immediately or after the debounce period.
 * @returns - The debounced function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(ms: number, callback: T, immediate = false) {
  // This is a number in the browser and an object in Node.js,
  // so we'll use the ReturnType utility to cover both cases.
  let timeout: ReturnType<typeof window.setTimeout> | number | null;

  return function <U>(this: U, ...args: Parameters<typeof callback>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    const later = () => {
      timeout = null;

      if (!immediate) {
        callback.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;

    if (typeof timeout === "number") {
      window.clearTimeout(timeout);
    }

    timeout = window.setTimeout(later, ms);

    if (callNow) {
      callback.apply(context, args);
    }
  };
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;

    const valA = (a as Record<string, unknown>)[key];
    const valB = (b as Record<string, unknown>)[key];

    if (!deepEqual(valA, valB)) return false;
  }

  return true;
}
