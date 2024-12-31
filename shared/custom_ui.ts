/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
 */

import { getAllCONames } from "./awbw_globals";
import { getMenu } from "./awbw_page";

export enum CustomInputType {
  Radio = "radio",
  Checkbox = "checkbox",
  Button = "button",
}

export enum GroupType {
  Vertical = "cls-vertical-box",
  Horizontal = "cls-horizontal-box",
}

export enum ContextMenuPosition {
  Left = "context-menu-left",
  Center = "context-menu-center",
  Right = "context-menu-right",
}

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
   * A map that contains the group types for each group in the menu.
   * The keys are the names of the groups, and the values are the types of the groups.
   */
  groupTypes: Map<string, GroupType> = new Map();

  /**
   * An array of all the input elements in the menu.
   */
  inputElements: Array<HTMLInputElement> = [];

  /**
   * An array of all the button elements in the menu.
   */
  buttonElements: Array<HTMLButtonElement> = [];

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
    this.menuElements.set("context-menu-parent", contextMenu);

    let contextMenuBoxesContainer = document.createElement("div");
    contextMenuBoxesContainer.id = prefix + "-context-menu-boxes";
    contextMenuBoxesContainer.classList.add("cls-horizontal-box");
    contextMenu.appendChild(contextMenuBoxesContainer);
    this.menuElements.set("context-menu", contextMenuBoxesContainer);

    // Context Menu 3 Boxes
    let leftBox = document.createElement("div");
    leftBox.id = prefix + "-context-menu-left";
    leftBox.classList.add("cls-context-menu-box");
    contextMenuBoxesContainer.appendChild(leftBox);
    this.menuElements.set(ContextMenuPosition.Left, leftBox);

    let centerBox = document.createElement("div");
    centerBox.id = prefix + "-context-menu-center";
    centerBox.classList.add("cls-context-menu-box");
    contextMenuBoxesContainer.appendChild(centerBox);
    this.menuElements.set(ContextMenuPosition.Center, centerBox);

    let rightBox = document.createElement("div");
    rightBox.id = prefix + "-context-menu-right";
    rightBox.classList.add("cls-context-menu-box");
    contextMenuBoxesContainer.appendChild(rightBox);
    this.menuElements.set(ContextMenuPosition.Right, rightBox);

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
   * @param position - The position of the slider in the context menu.
   * @returns - The slider element.
   */
  addSlider(
    name: string,
    min: number,
    max: number,
    step: number,
    hoverText = "",
    position = ContextMenuPosition.Center,
  ) {
    let contextMenu = this.menuElements.get(position);

    // Slider label
    let id = name.toLowerCase().replaceAll(" ", "-");
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

  getGroupOrAddIfNeeded(
    groupName: string,
    type: GroupType = GroupType.Horizontal,
    position = ContextMenuPosition.Center,
  ) {
    const contextMenu = this.menuElements.get(position);
    if (this.menuElements.has(groupName)) return this.menuElements.get(groupName);

    const groupLabel = document.createElement("label");
    const id = (this.prefix + "-" + groupName).toLowerCase().replaceAll(" ", "-");
    groupLabel.id = id + "-label";
    groupLabel.innerText = groupName;
    contextMenu?.appendChild(groupLabel);

    const group = document.createElement("div");
    group.id = id;
    group.classList.add(type);
    this.menuElements.set(groupName, group);
    contextMenu?.appendChild(group);

    let otherType = type === GroupType.Horizontal ? GroupType.Vertical : GroupType.Horizontal;
    this.groupTypes.set(groupName, otherType);
    return group;
  }

  addRadioButton(name: string, groupName: string, hoverText = "", position = ContextMenuPosition.Center) {
    return this.addInput(name, groupName, hoverText, CustomInputType.Radio, position) as HTMLInputElement;
  }

  addCheckbox(name: string, groupName: string, hoverText = "", position = ContextMenuPosition.Center) {
    return this.addInput(name, groupName, hoverText, CustomInputType.Checkbox, position) as HTMLInputElement;
  }

  addButton(name: string, groupName: string, hoverText = "", position = ContextMenuPosition.Center) {
    return this.addInput(name, groupName, hoverText, CustomInputType.Button, position) as HTMLButtonElement;
  }

  /**
   * Adds an input to the context menu in a specific group.
   * @param name - The name of the input.
   * @param groupName - The name of the group the input belongs to.
   * @param hoverText - The text to be displayed when hovering over the input.
   * @param type - The type of input to be added.
   * @param position - The position of the input in the context menu.
   * @returns - The input element.
   */
  private addInput(
    name: string,
    groupName: string,
    hoverText = "",
    type: CustomInputType,
    position: ContextMenuPosition,
  ) {
    const contextMenu = this.menuElements.get(position);
    let id = name.toLowerCase().replaceAll(" ", "-");

    // Check if the group already exists
    const groupDiv = this.getGroupOrAddIfNeeded(groupName, GroupType.Horizontal, position);
    const groupType = this.groupTypes.get(groupName);

    // Container for input and label
    const inputBox = document.createElement("div");
    inputBox.id = this.prefix + "-" + id;
    if (groupType) inputBox.classList.add(groupType);

    // Hover text
    inputBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
    inputBox.addEventListener("mouseout", () => this.setHoverText(""));

    // Create button or a different type of input
    let input: HTMLInputElement | HTMLButtonElement;
    if (type === CustomInputType.Button) {
      // Buttons don't need a separate label
      input = document.createElement("button");
      input.innerText = name;
      inputBox.appendChild(input);
      this.buttonElements.push(input as HTMLButtonElement);
    } else {
      // Create a label for all other inputs
      input = document.createElement("input");
      const label = document.createElement("label");
      label.id = this.prefix + "-" + id + "-label";
      label.innerText = name;

      // Input first, then label
      inputBox.appendChild(input);
      inputBox.appendChild(label);

      // Propagate label clicks to the input
      label.addEventListener("click", () => {
        input.click();
      });
      this.inputElements.push(input as HTMLInputElement);
    }

    // Set the rest of the shared input properties
    input.id = this.prefix + "-" + id + "-" + type;
    input.type = type;
    input.name = groupName;
    groupDiv?.appendChild(inputBox);
    return input;
  }

  /**
   * Adds a special version label to the context menu.
   * @param version - The version to be displayed.
   */
  addVersion(version: string) {
    let contextMenu = this.menuElements.get("context-menu-parent");
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

type COSelectorListener = (coName: string) => void;

const coSelectorListeners: COSelectorListener[] = [
  (coName: string) => {
    console.log(coName, "selected");
  },
];
export function addCOSelectorListener(listener: COSelectorListener) {
  coSelectorListeners.push(listener);
}

export function notifyCOSelectorListeners(coName: string) {
  coSelectorListeners.forEach((listener) => listener(coName));
}

export function createCOSelector() {
  const template = (coName: string) => {
    const location = "javascript:void(0)";
    const internalName = coName.toLowerCase().replaceAll(" ", "");
    const imgSrc = `terrain/ani/aw2${internalName}.png?v=1`;
    const onClickFn = `awbw_music_player.notifyCOSelectorListeners('${internalName}');`;

    return (
      `<tr>` +
      `<td class=borderwhite><img class=co_portrait src=${imgSrc}></td>` +
      `<td class=borderwhite align=center valign=center>` +
      `<span class=small_text>` +
      `<a onclick="${onClickFn}" href=${location}>${coName}</a></b>` +
      `</span>` +
      `</td>` +
      `</tr>`
    );
  };

  const coSelector = document.createElement("a");
  coSelector.id = "music-player-co-selector";
  coSelector.classList.add("game-tools-btn");
  coSelector.href = "javascript:void(0)";

  const allCOs = getAllCONames(true).sort();
  let columnHTML = "";
  for (let i = 0; i < 7; i++) {
    const startIDX = i * 4;
    const endIDX = startIDX + 4;
    columnHTML += "<td><table>" + allCOs.slice(startIDX, endIDX).map(template).join("") + "</table></td>";
  }
  const innerHTML = `<table><tr>${columnHTML}</tr></table>`;

  coSelector.onclick = () => {
    return overlib(
      innerHTML,
      STICKY,
      CAPTION,
      "<img src=terrain/ani/blankred.gif height=16 width=1 align=absmiddle>Select CO",
      OFFSETY,
      25,
      OFFSETX,
      -322,
      CLOSECLICK,
    );
  };

  const imgCaret = document.createElement("img");
  imgCaret.id = "music-player-co-caret";
  imgCaret.src = "terrain/co_down_caret.gif";
  imgCaret.style.position = "absolute";
  imgCaret.style.top = "28px";
  imgCaret.style.left = "25px";
  imgCaret.style.border = "none";
  imgCaret.style.zIndex = "110";

  const imgCO = document.createElement("img");
  imgCO.id = "music-player-co-portrait";
  imgCO.src = "terrain/ani/aw2andy.png?v=1";
  imgCO.style.position = "absolute";
  imgCO.style.top = "0px";
  imgCO.style.left = "0px";
  imgCO.style.borderColor = "#009966";
  imgCO.style.zIndex = "100";
  imgCO.style.border = "2";
  // imgCO.align = "absmiddle";
  imgCO.style.verticalAlign = "middle";
  imgCO.classList.add("co_portrait");

  coSelector.appendChild(imgCaret);
  coSelector.appendChild(imgCO);
  return coSelector;
}
