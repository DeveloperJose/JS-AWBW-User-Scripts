/**
 * @file IndexedDB database for caching music files.
 */

import { log, logDebug, logError } from "./utils";

/**
 * Callback for when a music file is successfully loaded from the database.
 * @param localCacheURL - The URL of the local music file.
 */
export type LoadSuccessCallback = (localCacheURL: string) => void;

/**
 * Callback for when a music file fails to load from the database.
 * @param reason - The reason the music file failed to load.
 */
export type LoadErrorCallback = (reason: string) => void;

/**
 * The IndexedDB database for caching music files.
 */
let db: IDBDatabase | null = null;

/**
 * The name of the database.
 */
const dbName = "awbw_music_player";

/**
 * The version of the database.
 * This should be incremented whenever the database schema changes.
 */
const dbVersion = 1.0;

/**
 * A set of URLs that are queued to be stored in the database.
 * This is used to prevent storing the same URL multiple times while waiting for promises.
 */
const urlQueue = new Set<string>();

/**
 * Opens the IndexedDB database for caching music files.
 * @param onOpenOrError - Optional callback for when the database is opened or an error occurs when opening it.
 */
export function openDB() {
  log("Opening database to cache music files.");
  const request = indexedDB.open(dbName, dbVersion);

  return new Promise<void>((resolve: () => void, reject: () => void) => {
    request.onerror = (event) => {
      logError("Error opening database, will not be able to cache music files locally.", event);
      reject();
    };

    request.onupgradeneeded = (event) => {
      if (!event.target) return;
      logDebug("Database upgrade needed. Creating object store.");
      const newDB = (event.target as IDBOpenDBRequest).result;
      newDB.createObjectStore("music");
    };

    request.onsuccess = (event) => {
      if (!event.target) return;
      log("Database opened successfully. Ready to cache music files.");
      db = (event.target as IDBOpenDBRequest).result;
      resolve();

      db.onerror = (event) => {
        logError("Error accessing database.", event);
      };
    };
  });
}

/**
 * Attempts to load the music file at the given URL from the database.
 * @param srcURL - The URL of the music file to load
 * @returns - A promise that resolves with the URL of the local music file, or rejects with a reason
 */
export function loadMusicFromDB(srcURL: string) {
  if (!srcURL || srcURL === "") return Promise.reject("Invalid URL.");
  if (urlQueue.has(srcURL)) return Promise.reject("URL is already queued for storage.");

  urlQueue.add(srcURL);
  return new Promise((resolve: LoadSuccessCallback, reject: LoadErrorCallback) => {
    // If the database is not open, just fallback to the original URL
    if (!db) return reject("Database is not open.");

    const transaction = db.transaction("music", "readonly");
    const store = transaction.objectStore("music");
    const request = store.get(srcURL);
    request.onsuccess = (event) => {
      urlQueue.delete(srcURL);
      const blob = (event.target as IDBRequest).result;

      // The music file is not in the database, tell the caller to fallback to the original URL
      // We will save the file in the background for next time
      if (!blob) {
        storeURLInDB(srcURL);
        return reject("Music file not found in database, downloading for next time.");
      }

      const url = URL.createObjectURL(blob);
      resolve(url);
    };
    request.onerror = (event) => {
      urlQueue.delete(srcURL);
      reject(event.type);
    };
  });
}

/**
 * Stores the given blob in the database with the given URL.
 * @param url - The URL to store the blob under
 * @param blob - The blob to store
 */
function storeBlobInDB(url: string, blob: Blob) {
  if (!db || !url || url === "") return;

  const transaction = db.transaction("music", "readwrite");
  const store = transaction.objectStore("music");
  const request = store.put(blob, url);

  // request.onsuccess = () => {
  //   logDebug("Music file stored in database:", url);
  // };

  request.onerror = (event) => {
    logError("Error storing music file in database:", event);
  };
}

/**
 * Stores the music file at the given URL in the database.
 * @param url - The URL of the music file to store
 */
function storeURLInDB(url: string) {
  if (!db || !url || url === "") return;

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => storeBlobInDB(url, blob))
    .catch((reason) => logError("Error fetching music file to store in database:", reason));
}
