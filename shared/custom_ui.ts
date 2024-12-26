/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
 */

import { menu } from "./awbw_page";

export class CustomMenuSettingsUI {
  _parent: HTMLDivElement;
  _children: Map<string, HTMLElement> = new Map();

  constructor(prefix: string, buttonImageURL: string, hoverText = "") {
    this._parent = document.createElement("div");
    this._parent.id = prefix + "-parent";
    this._parent.classList.add("game-tools-btn");
    this._parent.style.width = "34px";
    this._parent.style.height = "30px";
    this._parent.style.borderLeft = "none";

    // Hover text
    let hoverSpan = document.createElement("span");
    hoverSpan.id = prefix + "-hover-span";
    hoverSpan.classList.add("game-tools-btn-text", "small_text");
    hoverSpan.innerText = hoverText;
    this._parent.appendChild(hoverSpan);
    this._children.set("hover", hoverSpan);

    // Button BG
    let bgDiv = document.createElement("div");
    bgDiv.id = prefix + "-background";
    bgDiv.classList.add("game-tools-bg");
    bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
    this._parent.appendChild(bgDiv);
    this._children.set("bg", bgDiv);

    // Button
    let btnLink = document.createElement("a");
    btnLink.id = prefix + "-link";
    btnLink.classList.add("norm2");
    bgDiv.appendChild(btnLink);

    let btnImg = document.createElement("img") as HTMLImageElement;
    btnImg.id = prefix + "-link-img";
    btnImg.style.verticalAlign = "middle";
    btnImg.src = buttonImageURL;
    btnLink.appendChild(btnImg);
    this._children.set("img", btnImg);
  }

  addToAWBWPage() {
    menu.appendChild(this._parent);
  }

  setHoverText(text: string) {
    let hoverSpan = this._children.get("hover");
    hoverSpan.innerText = text;
  }

  /**
   * Sets the progress of the UI by coloring the background of the main button.
   * @param progress A number between 0 and 100 representing the percentage of the progress bar to fill.
   */
  setProgress(progress: number) {
    let bgDiv = this._children.get("bg");
    bgDiv.style.backgroundImage =
      "linear-gradient(to right, #ffffff " + String(progress) + "% , #888888 0%)";
  }

  setImage(imageURL: string) {
    let btnImg = this._children.get("img") as HTMLImageElement;
    btnImg.src = imageURL;
  }

  addClickHandler(handler: (event: Event) => void) {
    this._parent.addEventListener("click", handler);
  }
}
