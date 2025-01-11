/**
 * @file IndexedDB database for caching music files.
 */
import SparkMD5 from "spark-md5";
import { HASH_JSON_URL } from "./resources";
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

/**
 * Compares the hashes of the music files stored in the database against the hashes stored on the server.
 * If a hash is different, the music file is replaced in the database.
 * @returns - A promise that resolves when the hashes have been compared
 */
export function checkHashesInDB() {
  if (!db) return;

  // Get the hashes stored in the server
  // logDebug("Fetching hashes from server to compare against local music files.");
  fetch(HASH_JSON_URL)
    .then((response) => response.json())
    .then((hashes) => compareHashesAndReplaceIfNeeded(hashes))
    .catch((reason) => logError("Error fetching hashes from server:", reason));
}

/**
 * Calculates the MD5 hash of the given blob.
 * @param blob - The blob to calculate the hash of
 * @returns - A promise that resolves with the MD5 hash of the blob
 */
function getBlobMD5(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event?.target?.result) return reject("FileReader did not load the blob.");
      const md5 = SparkMD5.ArrayBuffer.hash(event.target.result as ArrayBuffer);
      resolve(md5);
    };
    reader.onerror = (event) => reject(event);
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * Compares the hashes of the music files stored in the database against the json object of hashes provided.
 * @param hashesJson - The JSON object of hashes to compare against.
 */
function compareHashesAndReplaceIfNeeded(hashesJson: { [key: string]: string }) {
  if (!db) return;
  if (!hashesJson) {
    logError("No hashes found in server response.");
    return;
  }

  // Get all the blobs stored in the database
  const transaction = db.transaction("music", "readonly");
  const store = transaction.objectStore("music");
  const request = store.openCursor();

  request.onerror = (event) => {
    logError("Error checking hashes in database:", event);
  };

  request.onsuccess = (event) => {
    const cursor = (event.target as IDBRequest).result;
    if (!cursor) return;

    const url = cursor.key;
    const blob = cursor.value;
    const serverHash = hashesJson[url] as string;
    if (!serverHash) {
      logDebug("No hash found in server for", url);
      cursor.continue();
      return;
    }

    getBlobMD5(blob)
      .then((hash) => {
        if (hash === serverHash) return;
        // The hash is different, so we need to replace the song
        log("A new version of", url, " is available. Replacing the old version.");
        storeURLInDB(url);
      })
      .catch((reason) => logError("Error getting MD5 hash for blob:", reason));

    cursor.continue();
  };
}
