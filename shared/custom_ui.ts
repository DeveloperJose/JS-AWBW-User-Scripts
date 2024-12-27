/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
 */

import { getMenu } from "./awbw_page";

/**
 * A class that represents a custom menu UI that can be added to the AWBW page.
 */
export class CustomMenuSettingsUI {
  /**
   * The root element or parent of the custom menu.
   */
  root: HTMLDivElement;

  /**
   * A map that contains the important nodes of the menu.
   * The keys are the names of the children, and the values are the elements themselves.
   * Allows for easy access to any element in the menu.
   */
  menuElements: Map<string, HTMLElement> = new Map();

  /**
   * An array of all the input elements in the menu.
   */
  inputElements: Array<HTMLInputElement> = [];

  /**
   * A boolean that represents whether the settings menu is open or not.
   */
  private isSettingsMenuOpen = false;

  /**
   * A string used to prefix the IDs of the elements in the menu.
   */
  private prefix = "";

  /**
   * Text to be displayed when hovering over the main button.
   */
  private parentHoverText = "";

  /**
   * Creates a new Custom Menu UI, to add it to AWBW you need to call {@link addToAWBWPage}.
   * @param prefix - A string used to prefix the IDs of the elements in the menu.
   * @param buttonImageURL - The URL of the image to be used as the button.
   * @param hoverText - The text to be displayed when hovering over the button.
   */
  constructor(prefix: string, buttonImageURL: string, hoverText = "") {
    this.prefix = prefix;
    this.parentHoverText = hoverText;

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
    this.menuElements.set("hover", hoverSpan);

    // Button BG
    let bgDiv = document.createElement("div");
    bgDiv.id = prefix + "-background";
    bgDiv.classList.add("game-tools-bg");
    bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
    this.root.appendChild(bgDiv);
    this.menuElements.set("bg", bgDiv);

    // Reset hover text for parent button
    bgDiv.addEventListener("mouseover", () => this.setHoverText(this.parentHoverText));
    bgDiv.addEventListener("mouseout", () => this.setHoverText(""));

    // Button
    let btnLink = document.createElement("a");
    btnLink.id = prefix + "-link";
    btnLink.classList.add("norm2");
    bgDiv.appendChild(btnLink);

    let btnImg = document.createElement("img") as HTMLImageElement;
    btnImg.id = prefix + "-link-img";
    btnImg.src = buttonImageURL;
    btnLink.appendChild(btnImg);
    this.menuElements.set("img", btnImg);

    // Context Menu
    let contextMenu = document.createElement("div");
    contextMenu.id = prefix + "-context-menu";
    contextMenu.classList.add("cls-context-menu");
    this.root.appendChild(contextMenu);
    this.menuElements.set("context-menu", contextMenu);

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

  /**
   * Adds the custom menu to the AWBW page.
   */
  addToAWBWPage() {
    getMenu()?.appendChild(this.root);
  }

  /**
   * Changes the hover text of the main button.
   * @param text - The text to be displayed when hovering over the button.
   * @param replaceParent - Whether to replace the current hover text for the main button or not.
   */
  setHoverText(text: string, replaceParent = false) {
    let hoverSpan = this.menuElements.get("hover");
    if (!hoverSpan) return;
    hoverSpan.innerText = text;

    if (replaceParent) this.parentHoverText = text;
  }

  /**
   * Sets the progress of the UI by coloring the background of the main button.
   * @param progress - A number between 0 and 100 representing the percentage of the progress bar to fill.
   */
  setProgress(progress: number) {
    let bgDiv = this.menuElements.get("bg");
    if (!bgDiv) return;
    bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff " + String(progress) + "% , #888888 0%)";
  }

  /**
   * Sets the image of the main button.
   * @param imageURL - The URL of the image to be used on the button.
   */
  setImage(imageURL: string) {
    let btnImg = this.menuElements.get("img") as HTMLImageElement;
    btnImg.src = imageURL;
  }

  /**
   * Adds an event listener to the main button.
   * @param type - The type of event to listen for.
   * @param listener - The function to be called when the event is triggered.
   */
  addEventListener(type: string, listener: (event: Event) => void) {
    let div = this.menuElements.get("bg");
    div?.addEventListener(type, listener);
  }

  /**
   * Opens the context (right-click) menu.
   */
  openContextMenu() {
    let contextMenu = this.menuElements.get("context-menu");
    if (!contextMenu) return;
    contextMenu.style.display = "flex";
    this.isSettingsMenuOpen = true;
  }

  /**
   * Closes the context (right-click) menu.
   */
  closeContextMenu() {
    let contextMenu = this.menuElements.get("context-menu");
    if (!contextMenu) return;
    contextMenu.style.display = "none";
    this.isSettingsMenuOpen = false;
  }

  /**
   * Adds an input slider to the context menu.
   * @param name - The name of the slider.
   * @param min - The minimum value of the slider.
   * @param max - The maximum value of the slider.
   * @param step - The step value of the slider.
   * @param hoverText - The text to be displayed when hovering over the slider.
   * @returns - The slider element.
   */
  addSlider(name: string, min: number, max: number, step: number, hoverText = "") {
    let contextMenu = this.menuElements.get("context-menu");

    // Slider label
    let id = name.toLowerCase().replace(" ", "-");
    let label = document.createElement("label");
    label.id = this.prefix + "-" + id + "-label";
    contextMenu?.appendChild(label);

    // Then slider
    let slider = document.createElement("input");
    slider.id = `${this.prefix}-${id}-slider`;
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.step = String(step);
    this.inputElements.push(slider);

    // Set the label to the current value of the slider
    slider.addEventListener("input", (e) => {
      let displayValue = slider.value;
      if (max === 1) displayValue = Math.round(parseFloat(displayValue) * 100) + "%";

      label.innerText = `${name}: ${displayValue}`;
    });
    contextMenu?.appendChild(slider);

    // Hover text
    slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
    slider.addEventListener("mouseout", () => this.setHoverText(""));
    return slider;
  }

  /**
   * Adds a radio button to the context menu in a specific group.
   * @param name - The name of the radio button.
   * @param groupName - The name of the group the radio button belongs to.
   * @param hoverText - The text to be displayed when hovering over the radio button.
   * @returns - The radio button element.
   */
  addRadioButton(name: string, groupName: string, hoverText = "") {
    const contextMenu = this.menuElements.get("context-menu");
    let id = name.toLowerCase().replace(" ", "-");
    // Check if the group already exists
    if (!this.menuElements.has(groupName)) {
      const groupLabel = document.createElement("label");
      groupLabel.id = this.prefix + "-" + groupName + "-label";
      groupLabel.innerText = groupName;
      contextMenu?.appendChild(groupLabel);

      const group = document.createElement("div");
      group.id = this.prefix + "-" + groupName;
      group.classList.add("cls-horizontal-box");
      this.menuElements.set(groupName, group);
      contextMenu?.appendChild(group);
    }
    const radioGroupDiv = this.menuElements.get(groupName);

    // Container for radio button and label
    const radioBox = document.createElement("div");
    radioBox.id = this.prefix + "-" + id;
    radioBox.classList.add("cls-vertical-box");

    // Hover text
    radioBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
    radioBox.addEventListener("mouseout", () => this.setHoverText(""));

    // Radio button
    const radio = document.createElement("input");
    radio.id = this.prefix + "-" + id + "-radio";
    radio.type = "radio";
    radio.name = groupName;
    radioBox.appendChild(radio);
    this.inputElements.push(radio);

    // Radio button label
    const label = document.createElement("label");
    label.id = this.prefix + "-" + id + "-label";
    label.innerText = name;
    radioBox.appendChild(label);
    radioGroupDiv?.appendChild(radioBox);

    return radio;
  }

  /**
   * Adds a special version label to the context menu.
   * @param version - The version to be displayed.
   */
  addVersion(version: string) {
    let contextMenu = this.menuElements.get("context-menu");
    let versionDiv = document.createElement("label");
    versionDiv.id = this.prefix + "-version";
    versionDiv.innerText = `VERSION: ${version}`;
    contextMenu?.appendChild(versionDiv);
  }

  /**
   * Calls the input event on all input elements in the menu.
   * Useful for updating the labels of all the inputs.
   */
  updateAllInputLabels() {
    const event = new Event("input");
    this.inputElements.forEach((input) => {
      input.dispatchEvent(event);
    });
  }
}
