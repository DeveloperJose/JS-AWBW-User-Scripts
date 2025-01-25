import { getCurrentPageType } from "../shared/awbw_page";
import { log, logError } from "./utils";

export function getCurrentDocument() {
  const iframe = document.querySelector("iframe");
  if (!iframe) return window.document;

  const href = iframe.contentDocument?.location.href ?? iframe.src;
  if (href === null || href === "" || href === "about:blank") return window.document;

  return iframe.contentDocument ?? window.document;
}

export function initializeIFrame(init_fn: () => void) {
  const hasFrame = document.querySelector("iframe");
  if (hasFrame) return;

  const iframe = document.createElement("iframe");
  // iframe.src = window.location.href;
  iframe.name = "main";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  document.body.appendChild(iframe);
  document.body.style.width = "100%";
  document.body.style.height = "100%";
  if (document.body.parentElement) {
    document.body.parentElement.style.width = "100%";
    document.body.parentElement.style.height = "100%";
  }

  // When the page changes, hijack the links so they change the iframe instead of opening a new page
  iframe.addEventListener("load", (event) => onIFrameLoad(event, init_fn));
  hijackLinks(window.document);
  init_fn();
}

function onIFrameLoad(event: Event, initFn: () => void) {
  const iframe = event.target as HTMLIFrameElement;
  const href = iframe.contentDocument?.location.href ?? iframe.src;
  log("Iframe loaded, hijacking links.", getCurrentPageType(), href);
  if (href === null || href === "" || href === "about:blank") return;

  for (const child of Array.from(document.body.children)) {
    if (child === iframe) continue;
    child.remove();
  }

  window.history.pushState({}, "", href);
  iframe.contentWindow?.history.pushState({}, "", href);

  hijackLinks(iframe.contentDocument);
  initFn();
}

const hijackLinks = (doc: Document | null) => {
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
    // if (link.href.includes("game.php") || link.name.includes("game")) {
    //   link.target = "_top";
    //   continue;
    // }
    link.target = "main";
  }
};
