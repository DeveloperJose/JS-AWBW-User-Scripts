/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
 */

import { menu } from "./awbw_page";

const FONT_SIZE = "13px";

export class CustomMenuSettingsUI {
  root: HTMLDivElement;
  childrenMap: Map<string, HTMLElement> = new Map();
  private isSettingsMenuOpen = false;
  private prefix = "";

  constructor(prefix: string, buttonImageURL: string, hoverText = "") {
    this.prefix = prefix;
    this.root = document.createElement("div");
    this.root.id = prefix + "-parent";
    this.root.classList.add("game-tools-btn");
    this.root.style.width = "34px";
    this.root.style.height = "30px";
    this.root.style.borderLeft = "none";

    // Hover text
    let hoverSpan = document.createElement("span");
    hoverSpan.id = prefix + "-hover-span";
    hoverSpan.classList.add("game-tools-btn-text", "small_text");
    hoverSpan.innerText = hoverText;
    this.root.appendChild(hoverSpan);
    this.childrenMap.set("hover", hoverSpan);

    // Button BG
    let bgDiv = document.createElement("div");
    bgDiv.id = prefix + "-background";
    bgDiv.classList.add("game-tools-bg");
    bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
    this.root.appendChild(bgDiv);
    this.childrenMap.set("bg", bgDiv);

    // Button
    let btnLink = document.createElement("a");
    btnLink.id = prefix + "-link";
    btnLink.classList.add("norm2");
    bgDiv.appendChild(btnLink);

    let btnImg = document.createElement("img") as HTMLImageElement;
    btnImg.id = prefix + "-link-img";
    // btnImg.style.verticalAlign = "middle";
    btnImg.src = buttonImageURL;
    btnLink.appendChild(btnImg);
    this.childrenMap.set("img", btnImg);

    // Context Menu
    let contextMenu = document.createElement("div");
    contextMenu.id = prefix + "-context-menu";
    contextMenu.classList.add("cls-context-menu");
    this.root.appendChild(contextMenu);
    this.childrenMap.set("context-menu", contextMenu);

    // Enable right-click to open and close the context menu
    this.root.addEventListener("contextmenu", (event) => {
      let element = event.target as HTMLElement;
      if (element.id.startsWith(prefix)) {
        event.preventDefault();
        this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
        if (this.isSettingsMenuOpen) {
          this.openContextMenu();
        } else {
          this.closeContextMenu();
        }
      }
    });

    // Close settings menu whenever the user clicks anywhere outside the player
    document.addEventListener("click", (event) => {
      let elmnt = event.target as HTMLElement;
      if (elmnt.id.startsWith(prefix)) return;
      this.closeContextMenu();
    });
  }

  addToAWBWPage() {
    menu.appendChild(this.root);
  }

  setHoverText(text: string) {
    let hoverSpan = this.childrenMap.get("hover");
    hoverSpan.innerText = text;
  }

  /**
   * Sets the progress of the UI by coloring the background of the main button.
   * @param progress A number between 0 and 100 representing the percentage of the progress bar to fill.
   */
  setProgress(progress: number) {
    let bgDiv = this.childrenMap.get("bg");
    bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff " + String(progress) + "% , #888888 0%)";
  }

  setImage(imageURL: string) {
    let btnImg = this.childrenMap.get("img") as HTMLImageElement;
    btnImg.src = imageURL;
  }

  addEventListener(type: string, listener: (event: Event) => void) {
    let div = this.childrenMap.get("bg");
    div.addEventListener(type, listener);
  }

  openContextMenu() {
    let contextMenu = this.childrenMap.get("context-menu");
    contextMenu.style.display = "flex";
    this.isSettingsMenuOpen = true;
  }

  closeContextMenu() {
    let contextMenu = this.childrenMap.get("context-menu");
    contextMenu.style.display = "none";
    this.isSettingsMenuOpen = false;
  }

  addSlider(name: string, min: number, max: number, step: number, hoverText = "") {
    let contextMenu = this.childrenMap.get("context-menu");

    // Slider label
    let label = document.createElement("label");
    contextMenu.appendChild(label);

    // Then slider
    let id = name.toLowerCase().replace(" ", "-");
    let slider = document.createElement("input");
    slider.id = `${this.prefix}-${id}-slider`;
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.step = String(step);

    // Set the label to the current value of the slider
    slider.addEventListener("input", (e) => {
      let displayValue = slider.value;
      if (max === 1) displayValue = Math.round(parseFloat(displayValue) * 100) + "%";

      label.innerText = `${name}: ${displayValue}`;
    });
    contextMenu.appendChild(slider);

    // Hover text
    slider.addEventListener("mouseover", () => {
      this.setHoverText(hoverText);
    });
    slider.addEventListener("mouseout", () => {
      this.setHoverText("");
    });
    return slider;
  }

  addRadioButton(name: string, groupName: string, hoverText = "") {
    const contextMenu = this.childrenMap.get("context-menu");
    // Check if the group already exists
    if (!this.childrenMap.has(groupName)) {
      const groupLabel = document.createElement("label");
      groupLabel.innerText = groupName;
      contextMenu.appendChild(groupLabel);

      const group = document.createElement("div");
      group.classList.add("cls-horizontal-box");
      this.childrenMap.set(groupName, group);
      contextMenu.appendChild(group);
    }
    const radioGroupDiv = this.childrenMap.get(groupName);
    const radioBox = document.createElement("div");
    radioBox.classList.add("cls-vertical-box");

    // Radio button
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = groupName;
    radioBox.appendChild(radio);

    // Radio button label
    const label = document.createElement("label");
    label.innerText = name;
    radioBox.appendChild(label);

    // Hover text
    radioBox.addEventListener("mouseover", () => {
      this.setHoverText(hoverText);
    });
    radioBox.addEventListener("mouseout", () => {
      this.setHoverText("");
    });

    radioGroupDiv.appendChild(radioBox);
    return radio;
  }

  addVersion(version: string) {
    let contextMenu = this.childrenMap.get("context-menu");

    let versionDiv = document.createElement("label");
    versionDiv.id = this.prefix + "-version";
    // versionDiv.classList.add("cls-context-menu-version");
    versionDiv.innerText = `VERSION: ${version}`;
    contextMenu.appendChild(versionDiv);
  }
}
