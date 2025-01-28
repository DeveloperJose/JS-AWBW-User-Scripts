/**
 * @file This file contains functions for managing the music player iframe that is used to play music on the website without reloading pages.
 *
 * Note that game.php pages are not included as certain important variables don't work properly without
 *  re-running several JS scripts which would slow down the page loading.
 */

import { logError } from "./utils";

/**
 * The name of the iframe element used for page navigation outside of the game.php pages.
 */
export const IFRAME_ID = "music-player-iframe";

/**
 * The broadcast channel used to communicate with other tabs.
 * This is used to sync settings between tabs and to only have one tab play music at a time.
 */
export const broadcastChannel = new BroadcastChannel("awbw-music-player");

/**
 * Whether the iframe is currently active and displaying a page.
 * @returns True if the iframe is active, false otherwise.
 */
export function isIFrameActive() {
  const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
  if (!iframe) return false;

  const href = iframe.contentDocument?.location.href ?? iframe.src;
  return href !== null && href !== "" && href !== "about:blank";
}

/**
 * Gets the current active window object, either the main window or the iframe window.
 * @returns The current window object.
 */
export function getCurrentWindow() {
  if (!isIFrameActive()) return window;
  const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
  return iframe?.contentWindow ?? window;
}

/**
 * Gets the current active document object, either the main document or the iframe document.
 * @returns The current document object.
 */
export function getCurrentDocument() {
  if (!isIFrameActive()) return window.document;
  const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
  return iframe?.contentDocument ?? window.document;
}

/**
 * Creates and initializes the iframe element for the music player.
 * @param init_fn - The function to run when the iframe loads a new page.
 */
export function initializeIFrame(init_fn: () => void) {
  const hasFrame = document.getElementById(IFRAME_ID);
  if (hasFrame) return;

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.id = IFRAME_ID;
  iframe.name = IFRAME_ID;
  document.body.appendChild(iframe);

  // When the page changes, hijack the links so they change the iframe instead of opening a new page
  iframe.addEventListener("load", (event) => onIFrameLoad(event, init_fn));
  hijackLinks(window.document);
  init_fn();

  // When the page history changes, update the iframe accordingly or hard reload the page if it's a game.php page
  window.addEventListener("popstate", (event) => {
    // logDebug("Popstate event", window.location);
    const href = window.location.href;
    const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
    if (!iframe || href.includes("game.php")) {
      window.location.reload();
      return;
    }

    iframe.src = href;
    const state = event.state;
    if (!state || !state.scrollX || !state.scrollY) return;
    window.scrollTo(state.scrollX, state.scrollY);
  });
}

/**
 * Event handler for when the iframe loads a new page.
 * @param event - The event object.
 * @param initFn - The function to run when the iframe loads a new page.
 */
function onIFrameLoad(event: Event, initFn: () => void) {
  const iframe = event.target as HTMLIFrameElement;
  if (!iframe || !iframe.contentDocument) return;

  const href = iframe.contentDocument.location.href ?? iframe.src;
  if (href === null || href === "" || href === "about:blank") return;

  // Remove all other elements from the page
  for (const child of Array.from(document.body.children)) {
    if (child === iframe) continue;
    if (child.id === "overDiv") continue;
    child.remove();
  }

  // The iframe is now the page
  iframe.style.display = "block";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  document.body.style.width = "100%";
  document.body.style.height = "100%";
  document.body.style.overflow = "hidden";
  if (document.body.parentElement) {
    document.body.parentElement.style.width = "100%";
    document.body.parentElement.style.height = "100%";
  }

  // Save scroll position and update page title
  const state = { scrollX: window.scrollX, scrollY: window.scrollY };
  window.history.pushState(state, "", href);
  document.title = iframe.contentDocument.title;

  // logDebug("Iframe loaded, hijacking links.", href);
  hijackLinks(iframe.contentDocument);
  initFn();
}

/**
 * Given a document, goes through all the links and changes their target to the iframe.
 * @param doc - The document to hijack the links in.
 */
function hijackLinks(doc: Document | null) {
  if (!doc) {
    logError("Could not find the document to hijack links.");
    return;
  }

  const links = doc.querySelectorAll("a");
  if (!links) {
    logError("Could not find any links to hijack.");
    return;
  }

  for (const link of Array.from(links)) {
    // Game links will not be hijacked
    const isGamePageLink =
      link.href.includes("game.php") || (link.classList.contains("anchor") && link.name.includes("game_"));

    const isJSLink = link.href.startsWith("javascript:");
    if (isJSLink) continue;
    else if (link.href === "") continue;
    else if (isGamePageLink) link.target = "_top";
    else link.target = IFRAME_ID;
  }
}
