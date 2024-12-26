/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
 */

class CustomMenuSettingsUI {
  _parent: HTMLDivElement;
  _children: Map<string, HTMLElement> = new Map();

  constructor(prefix: string, hover_text = "") {
    this._parent = document.createElement("div");
    this._parent.id = prefix + "-parent";
    this._parent.classList.add("game-tools-btn");
    this._parent.style.width = "34px";
    this._parent.style.height = "30px";

    // Hover text
    let hoverSpan = document.createElement("span");
    hoverSpan.id = prefix + "-hover-span";
    hoverSpan.classList.add("game-tools-btn-text", "small_text");
    hoverSpan.innerText = hover_text;
    this._parent.appendChild(hoverSpan);
    this._children.set("hover", hoverSpan);

    // Button BG

    // Button
  }

  setHoverText(text: string) {
    let hoverSpan = this._children.get("hover");
    hoverSpan.innerText = text;
  }
}
