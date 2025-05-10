/**
 * @file IndexedDB database for caching music files.
 */
import SparkMD5 from "spark-md5";
import { logError } from "./utils";
import { getHashesJSONURL } from "./resources";

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
 * A set of listeners that are called when a music file is replaced in the database.
 */
const replacementListeners = new Set<(url: string) => void>();

/**
 * Adds a listener that is called when a music file is replaced in the database.
 * @param fn - The listener to add
 */
export function addDatabaseReplacementListener(fn: (url: string) => void) {
  replacementListeners.add(fn);
}

/**
 * Opens the IndexedDB database for caching music files.
 * @param onOpenOrError - Optional callback for when the database is opened or an error occurs when opening it.
 */
export function openDB() {
  const request = indexedDB.open(dbName, dbVersion);

  return new Promise<void>((resolve, reject) => {
    request.onerror = (event) => reject(event);

    request.onupgradeneeded = (event) => {
      if (!event.target) return reject("No target for database upgrade.");
      // logDebug("Database upgrade needed. Creating object store.");
      const newDB = (event.target as IDBOpenDBRequest).result;
      newDB.createObjectStore("music");
    };

    request.onsuccess = (event) => {
      if (!event.target) return reject("No target for database success.");

      db = (event.target as IDBOpenDBRequest).result;
      db.onerror = (event) => {
        reject(`Error accessing database: ${event}`);
      };

      resolve();
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

  return new Promise<string>((resolve, reject) => {
    // If the database is not open, just fallback to the original URL
    if (!db) return reject("Database is not open.");

    const transaction = db.transaction("music", "readonly");
    const store = transaction.objectStore("music");
    const request = store.get(srcURL);
    request.onsuccess = (event) => {
      urlQueue.delete(srcURL);

      // The music file is not in the database, wait for it to be stored and return the new blob URL
      const blob = (event.target as IDBRequest).result;
      if (!blob) {
        return storeURLInDB(srcURL)
          .then((blob: Blob) => resolve(URL.createObjectURL(blob)))
          .catch((reason) => reject(reason));
      }

      const url = URL.createObjectURL(blob);
      resolve(url);
    };
    request.onerror = (event) => {
      urlQueue.delete(srcURL);
      reject(event);
    };
  });
}

/**
 * Stores the given blob in the database with the given URL.
 * @param url - The URL to store the blob under
 * @param blob - The blob to store
 */
function storeBlobInDB(url: string, blob: Blob) {
  return new Promise<Blob>((resolve, reject) => {
    if (!db) return reject("Database not open.");
    if (!url || url === "") return reject("Invalid URL.");

    const transaction = db.transaction("music", "readwrite");
    const store = transaction.objectStore("music");
    const request = store.put(blob, url);

    request.onsuccess = () => {
      resolve(blob);
      replacementListeners.forEach((fn) => fn(url));
    };

    request.onerror = (event) => reject(event);
  });
}

/**
 * Stores the music file at the given URL in the database.
 * @param url - The URL of the music file to store
 */
function storeURLInDB(url: string) {
  if (!db) return Promise.reject("Database not open.");
  if (!url || url === "") return Promise.reject("Invalid URL.");

  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => storeBlobInDB(url, blob));
  // .catch((reason) => logError("Error fetching music file to store in database:", reason));
}

/**
 * Compares the hashes of the music files stored in the database against the hashes stored on the server.
 * If a hash is different, the music file is replaced in the database.
 * @returns - A promise that resolves when the hashes have been compared
 */
export function checkHashesInDB() {
  if (!db) return Promise.reject("Database not open.");

  // Get the hashes stored in the server
  // logDebug("Fetching hashes from server to compare against local music files.");
  return fetch(getHashesJSONURL())
    .then((response) => response.json())
    .then((hashes) => compareHashesAndReplaceIfNeeded(hashes));
  // .catch((reason) => logError("Error fetching hashes from server:", reason));
}

/**
 * Calculates the MD5 hash of the given blob.
 * @param blob - The blob to calculate the hash of
 * @returns - A promise that resolves with the MD5 hash of the blob
 */
function getBlobMD5(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
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
  return new Promise<void>((resolve, reject) => {
    if (!db) return reject("Database not open.");
    if (!hashesJson) return reject("No hashes found in server.");

    // Get all the blobs stored in the database
    const transaction = db.transaction("music", "readonly");
    const store = transaction.objectStore("music");
    const request = store.openCursor();

    request.onerror = (event) => reject(event);

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;

      // All entries have been checked
      if (!cursor) return resolve();

      const url = cursor.key as string;
      const blob = cursor.value as Blob;
      const serverHash = hashesJson[url] as string;
      cursor.continue();

      // logDebug("Checking hash for", url);

      if (!serverHash) {
        //logDebug("No hash found in server for", url);
        return;
      }

      getBlobMD5(blob)
        .then((hash) => {
          if (hash === serverHash) return;
          // The hash is different, so we need to replace the song
          return storeURLInDB(url);
        })
        .catch((reason) => logError(`Error storing new version of ${url} in database: ${reason}`));
    };
  });
}
