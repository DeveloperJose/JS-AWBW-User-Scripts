/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
 */
import { getAllCONames } from "./awbw_globals";
import { isGamePageAndActive } from "./awbw_page";

export enum CustomInputType {
  Radio = "radio",
  Checkbox = "checkbox",
  Button = "button",
}

export enum GroupType {
  Vertical = "cls-vertical-box",
  Horizontal = "cls-horizontal-box",
}

export enum MenuPosition {
  Left = "settings-left",
  Center = "settings-center",
  Right = "settings-right",
}

function sanitize(str: string) {
  return str.toLowerCase().replaceAll(" ", "-");
}

interface TableData {
  table: HTMLTableElement;
  rows: number;
  columns: number;
}

/**
 * A class that represents a custom menu UI that can be added to the AWBW page.
 */
export class CustomMenuSettingsUI {
  /**
   * The root element or parent of the custom menu.
   */
  parent: HTMLDivElement;

  /**
   * A map that contains the important nodes of the menu.
   * The keys are the names of the children, and the values are the elements themselves.
   * Allows for easy access to any element in the menu.
   */
  groups: Map<string, HTMLElement> = new Map();

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
  isSettingsMenuOpen = false;

  /**
   * A string used to prefix the IDs of the elements in the menu.
   */
  prefix = "";

  /**
   * Text to be displayed when hovering over the main button.
   */
  private parentHoverText = "";

  private tableMap: Map<string, TableData> = new Map();

  /**
   * Creates a new Custom Menu UI, to add it to AWBW you need to call {@link addToAWBWPage}.
   * @param prefix - A string used to prefix the IDs of the elements in the menu.
   * @param buttonImageURL - The URL of the image to be used as the button.
   * @param hoverText - The text to be displayed when hovering over the button.
   */
  constructor(prefix: string, buttonImageURL: string, hoverText = "") {
    this.prefix = prefix;
    this.parentHoverText = hoverText;

    this.parent = document.createElement("div");
    this.parent.id = `${prefix}-parent`;
    this.parent.classList.add("game-tools-btn");
    this.parent.style.width = "34px";
    this.parent.style.height = "30px";

    // Hover text
    const hoverSpan = document.createElement("span");
    hoverSpan.id = `${prefix}-hover-span`;
    hoverSpan.classList.add("game-tools-btn-text", "small_text");
    hoverSpan.innerText = hoverText;
    this.parent.appendChild(hoverSpan);
    this.groups.set("hover", hoverSpan);

    // Button Background
    const bgDiv = document.createElement("div");
    bgDiv.id = `${prefix}-background`;
    bgDiv.classList.add("game-tools-bg");
    bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
    this.parent.appendChild(bgDiv);
    this.groups.set("bg", bgDiv);

    // Reset hover text for parent button
    bgDiv.addEventListener("mouseover", () => this.setHoverText(this.parentHoverText));
    bgDiv.addEventListener("mouseout", () => this.setHoverText(""));

    // Button
    const btnLink = document.createElement("a");
    btnLink.id = `${prefix}-link`;
    btnLink.classList.add("norm2");
    bgDiv.appendChild(btnLink);

    const btnImg = document.createElement("img") as HTMLImageElement;
    btnImg.id = `${prefix}-link-img`;
    btnImg.src = buttonImageURL;
    btnLink.appendChild(btnImg);
    this.groups.set("img", btnImg);

    // Context Menu
    const contextMenu = document.createElement("div");
    contextMenu.id = `${prefix}-settings`;
    contextMenu.classList.add("cls-settings-menu");
    contextMenu.style.zIndex = "20";
    this.parent.appendChild(contextMenu);
    this.groups.set("settings-parent", contextMenu);

    const contextMenuBoxesContainer = document.createElement("div");
    contextMenuBoxesContainer.id = `${prefix}-settings-container`;
    contextMenuBoxesContainer.classList.add("cls-horizontal-box");
    contextMenu.appendChild(contextMenuBoxesContainer);
    this.groups.set("settings", contextMenuBoxesContainer);

    // Context Menu 3 Boxes
    const leftBox = document.createElement("div");
    leftBox.id = `${prefix}-settings-left`;
    leftBox.classList.add("cls-settings-menu-box");
    leftBox.style.display = "none";
    contextMenuBoxesContainer.appendChild(leftBox);
    this.groups.set(MenuPosition.Left, leftBox);

    const centerBox = document.createElement("div");
    centerBox.id = `${prefix}-settings-center`;
    centerBox.classList.add("cls-settings-menu-box");
    centerBox.style.display = "none";
    contextMenuBoxesContainer.appendChild(centerBox);
    this.groups.set(MenuPosition.Center, centerBox);

    const rightBox = document.createElement("div");
    rightBox.id = `${prefix}-settings-right`;
    rightBox.classList.add("cls-settings-menu-box");
    rightBox.style.display = "none";
    contextMenuBoxesContainer.appendChild(rightBox);
    this.groups.set(MenuPosition.Right, rightBox);

    // Enable right-click to open and close the context menu
    this.parent.addEventListener("contextmenu", (event) => {
      const element = event.target as HTMLElement;
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

      // Find the first parent that has an ID if the element doesn't have one
      if (!elmnt.id) {
        while (!elmnt.id) {
          elmnt = elmnt.parentNode as HTMLElement;
          // Break if we reach the top of the document or this element isn't properly connected
          if (!elmnt) break;
        }
      }

      // Most likely this element is part of our UI and was created with JS and not properly connected so don't close
      if (!elmnt) return;

      // Check if we are in the music player or the overlib overDiv, so we don't close the menu
      if (elmnt.id.startsWith(prefix) || elmnt.id === "overDiv") return;

      // Close the menu if we clicked outside of it
      // console.debug("[MP] Clicked on: ", elmnt.id);
      this.closeContextMenu();
    });
  }

  /**
   * Adds the custom menu to the AWBW page.
   */
  addToAWBWPage(div: HTMLElement, prepend = false) {
    if (!prepend) {
      div.appendChild(this.parent);
      this.parent.style.borderLeft = "none";
      return;
    }
    div.prepend(this.parent);
    this.parent.style.borderRight = "none";
  }

  getGroup(groupName: string) {
    const container = this.groups.get(groupName);
    // Unhide group
    if (!container) return;
    if (container.style.display === "none") container.style.display = "flex";
    return container;
  }

  /**
   * Changes the hover text of the main button.
   * @param text - The text to be displayed when hovering over the button.
   * @param replaceParent - Whether to replace the current hover text for the main button or not.
   */
  setHoverText(text: string, replaceParent = false) {
    const hoverSpan = this.groups.get("hover");
    if (!hoverSpan) return;
    if (replaceParent) this.parentHoverText = text;
    hoverSpan.innerText = text;
    hoverSpan.style.display = text === "" ? "none" : "block";
  }

  /**
   * Sets the progress of the UI by coloring the background of the main button.
   * @param progress - A number between 0 and 100 representing the percentage of the progress bar to fill.
   */
  setProgress(progress: number) {
    const bgDiv = this.groups.get("bg");
    if (!bgDiv) return;
    if (progress < 0) {
      bgDiv.style.backgroundImage = "";
      return;
    }
    bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff " + String(progress) + "% , #888888 0%)";
  }

  /**
   * Sets the image of the main button.
   * @param imageURL - The URL of the image to be used on the button.
   */
  setImage(imageURL: string) {
    const btnImg = this.groups.get("img") as HTMLImageElement;
    btnImg.src = imageURL;
  }

  /**
   * Adds an event listener to the main button.
   * @param type - The type of event to listen for.
   * @param listener - The function to be called when the event is triggered.
   */
  addEventListener(type: string, listener: (event: Event) => void, options: boolean | AddEventListenerOptions = false) {
    const div = this.groups.get("bg");
    div?.addEventListener(type, listener, options);
  }

  /**
   * Opens the context (right-click) menu.
   */
  openContextMenu() {
    const contextMenu = this.groups.get("settings-parent");
    if (!contextMenu) return;
    // No settings so don't open the menu
    const hasLeftMenu = this.groups.get(MenuPosition.Left)?.style.display !== "none";
    const hasCenterMenu = this.groups.get(MenuPosition.Center)?.style.display !== "none";
    const hasRightMenu = this.groups.get(MenuPosition.Right)?.style.display !== "none";
    if (!hasLeftMenu && !hasCenterMenu && !hasRightMenu) return;

    contextMenu.style.display = "flex";
    this.isSettingsMenuOpen = true;
  }

  /**
   * Closes the context (right-click) menu.
   */
  closeContextMenu() {
    const contextMenu = this.groups.get("settings-parent");
    if (!contextMenu) return;
    contextMenu.style.display = "none";
    this.isSettingsMenuOpen = false;

    // Check if we have a CO selector and need to hide it
    const overDiv = document.querySelector("#overDiv") as HTMLDivElement;
    const hasCOSelector = this.groups.has("co-selector");
    if (overDiv && hasCOSelector && isGamePageAndActive()) {
      overDiv.style.visibility = "hidden";
    }
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
  addSlider(name: string, min: number, max: number, step: number, hoverText = "", position = MenuPosition.Center) {
    const contextMenu = this.getGroup(position);
    if (!contextMenu) return;

    // Container for the slider and label
    const sliderBox = document.createElement("div");
    sliderBox.classList.add("cls-vertical-box");
    sliderBox.classList.add("cls-group-box");
    contextMenu?.appendChild(sliderBox);

    // Slider label
    const label = document.createElement("label");
    sliderBox?.appendChild(label);

    // Slider
    const slider = document.createElement("input");
    slider.id = `${this.prefix}-${sanitize(name)}`;
    slider.type = "range";
    slider.min = String(min);
    slider.max = String(max);
    slider.step = String(step);
    this.inputElements.push(slider);

    // Set the label to the current value of the slider
    slider.addEventListener("input", (_e) => {
      let displayValue = slider.value;
      if (max === 1) displayValue = Math.round(parseFloat(displayValue) * 100) + "%";

      label.innerText = `${name}: ${displayValue}`;
    });
    sliderBox?.appendChild(slider);

    // Hover text
    slider.title = hoverText;
    slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
    slider.addEventListener("mouseout", () => this.setHoverText(""));
    return slider;
  }

  addGroup(groupName: string, type: GroupType = GroupType.Horizontal, position = MenuPosition.Center) {
    const contextMenu = this.getGroup(position);
    if (!contextMenu) return;

    // Container for the label and group inner container
    const groupBox = document.createElement("div");
    groupBox.classList.add("cls-vertical-box");
    groupBox.classList.add("cls-group-box");
    contextMenu?.appendChild(groupBox);

    // Label for the group
    const groupLabel = document.createElement("label");
    groupLabel.innerText = groupName;
    groupBox?.appendChild(groupLabel);

    // Group container
    const group = document.createElement("div");
    group.id = `${this.prefix}-${sanitize(groupName)}`;
    group.classList.add(type);
    groupBox?.appendChild(group);

    this.groups.set(groupName, group);
    this.groupTypes.set(groupName, type);
    return group;
  }

  addRadioButton(name: string, groupName: string, hoverText = "") {
    return this.addInput(name, groupName, hoverText, CustomInputType.Radio) as HTMLInputElement;
  }

  addCheckbox(name: string, groupName: string, hoverText = "") {
    return this.addInput(name, groupName, hoverText, CustomInputType.Checkbox) as HTMLInputElement;
  }

  addButton(name: string, groupName: string, hoverText = "") {
    return this.addInput(name, groupName, hoverText, CustomInputType.Button) as HTMLButtonElement;
  }

  /**
   * Adds an input to the context menu in a specific group.
   * @param name - The name of the input.
   * @param groupName - The name of the group the input belongs to.
   * @param hoverText - The text to be displayed when hovering over the input.
   * @param type - The type of input to be added.
   * @returns - The input element.
   */
  private addInput(name: string, groupName: string, hoverText = "", type: CustomInputType) {
    // Check if the group already exists
    const groupDiv = this.getGroup(groupName);
    const groupType = this.groupTypes.get(groupName);
    if (!groupDiv || !groupType) return;

    // Container for input and label
    const inputBox = document.createElement("div");
    const otherType = groupType === GroupType.Horizontal ? GroupType.Vertical : GroupType.Horizontal;
    inputBox.classList.add(otherType);
    groupDiv.appendChild(inputBox);

    // Hover text
    inputBox.title = hoverText;
    inputBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
    inputBox.addEventListener("mouseout", () => this.setHoverText(""));

    // Create button or a different type of input
    let input: HTMLInputElement | HTMLButtonElement;
    if (type === CustomInputType.Button) {
      input = this.createButton(name, inputBox);
    } else {
      input = this.createInput(name, inputBox);
    }

    // Set the rest of the shared input properties
    input.type = type;
    input.name = groupName;
    return input;
  }

  createButton(name: string, inputBox: HTMLDivElement) {
    // Buttons don't need a separate label
    const input = document.createElement("button");
    input.innerText = name;
    inputBox.appendChild(input);
    this.buttonElements.push(input as HTMLButtonElement);
    return input;
  }

  createInput(name: string, inputBox: HTMLDivElement) {
    // Create the input and a label for it
    const input = document.createElement("input");
    const label = document.createElement("label");
    label.innerText = name;

    // Input first, then label
    inputBox.appendChild(input);
    inputBox.appendChild(label);

    // Propagate label clicks to the input
    label.addEventListener("click", () => input.click());
    this.inputElements.push(input as HTMLInputElement);
    return input;
  }

  /**
   * Adds a special version label to the context menu.
   * @param version - The version to be displayed.
   */
  addVersion(version: string) {
    const contextMenu = this.groups.get("settings-parent");
    const versionDiv = document.createElement("label");
    versionDiv.id = this.prefix + "-version";
    versionDiv.innerText = `Version: ${version} (DeveloperJose Edition)`;
    contextMenu?.appendChild(versionDiv);
  }

  addTable(name: string, rows: number, columns: number, groupName: string, hoverText = "") {
    const groupDiv = this.getGroup(groupName);
    if (!groupDiv) return;

    const table = document.createElement("table");
    table.classList.add("cls-settings-table");
    groupDiv.appendChild(table);

    // Hover text
    table.title = hoverText;
    table.addEventListener("mouseover", () => this.setHoverText(hoverText));
    table.addEventListener("mouseout", () => this.setHoverText(""));

    const tableData = {
      table,
      rows,
      columns,
    };

    this.tableMap.set(name, tableData);
    return table;
  }

  addItemToTable(name: string, item: HTMLElement) {
    const tableData = this.tableMap.get(name);
    if (!tableData) return;

    const table = tableData.table;

    // Check if we need to create the first row
    if (table.rows.length === 0) table.insertRow();

    // Check if the row is full
    const maxItemsPerRow = tableData.columns;
    const currentItemsInRow = table.rows[table.rows.length - 1].cells.length;
    if (currentItemsInRow >= maxItemsPerRow) table.insertRow();

    // Add the item to the last row
    const currentRow = table.rows[table.rows.length - 1];
    const cell = currentRow.insertCell();
    cell.appendChild(item);
  }

  clearTable(name: string) {
    const tableData = this.tableMap.get(name);
    if (!tableData) return;

    const table = tableData.table;
    table.innerHTML = "";
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

  /**
   * Adds a CO selector to the context menu. Only one CO selector can be added to the menu.
   * @param groupName - The name of the group the CO selector should be added to.
   * @param hoverText - The text to be displayed when hovering over the CO selector.
   * @param onClickFn - The function to be called when a CO is selected from the selector.
   * @returns - The CO selector element.
   */
  addCOSelector(groupName: string, hoverText = "", onClickFn: (coName: string) => void) {
    const groupDiv = this.getGroup(groupName);
    if (!groupDiv) return;

    const coSelector = document.createElement("a");
    coSelector.classList.add("game-tools-btn");
    coSelector.href = "javascript:void(0)";

    const imgCaret = this.createCOSelectorCaret();
    const imgCO = this.createCOPortraitImage("andy");
    coSelector.appendChild(imgCaret);
    coSelector.appendChild(imgCO);

    // Hover text
    coSelector.title = hoverText;
    coSelector.addEventListener("mouseover", () => this.setHoverText(hoverText));
    coSelector.addEventListener("mouseout", () => this.setHoverText(""));

    // Update UI
    this.groups.set("co-selector", coSelector);
    this.groups.set("co-portrait", imgCO);
    groupDiv?.appendChild(coSelector);

    // Sort all the COs alphabetically, get their proper names
    const allCOs = getAllCONames(true).sort();

    // Prepare the CO selector HTML with overlib (style taken from AWBW)
    let allColumnsHTML = "";
    for (let i = 0; i < 7; i++) {
      const startIDX = i * 4;
      const endIDX = startIDX + 4;
      const templateFn = (coName: string) => this.createCOSelectorItem(coName);
      const currentColumnHTML = allCOs.slice(startIDX, endIDX).map(templateFn).join("");
      allColumnsHTML += `<td><table>${currentColumnHTML}</table></td>`;
    }
    const selectorInnerHTML = `<table><tr>${allColumnsHTML}</tr></table>`;
    const selectorTitle = `<img src=terrain/ani/blankred.gif height=16 width=1 align=absmiddle>Select CO`;

    // Make the CO selector that will appear when the user clicks on the CO portrait
    coSelector.onclick = () => {
      return overlib(selectorInnerHTML, STICKY, CAPTION, selectorTitle, OFFSETY, 25, OFFSETX, -322, CLOSECLICK);
    };

    // Listen for clicks on the CO selector
    addCOSelectorListener((coName) => this.onCOSelectorClick(coName));
    addCOSelectorListener(onClickFn);
    return coSelector;
  }

  private createCOSelectorItem(coName: string) {
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
  }

  private createCOSelectorCaret() {
    const imgCaret = document.createElement("img");
    imgCaret.classList.add("co_caret");
    imgCaret.src = "terrain/co_down_caret.gif";
    return imgCaret;
  }

  createCOPortraitImage(coName: string) {
    const imgCO = document.createElement("img");
    imgCO.classList.add("co_portrait");
    imgCO.src = `terrain/ani/aw2${coName}.png?v=1`;

    // Allows other icons to be used
    if (!getAllCONames().includes(coName)) {
      imgCO.src = `terrain/${coName}`;
    }
    return imgCO;
  }

  createCOPortraitImageWithText(coName: string, text: string) {
    const div = document.createElement("div");
    div.classList.add("cls-vertical-box");

    // CO picture
    const coImg = this.createCOPortraitImage(coName);
    div.appendChild(coImg);

    // Text
    const coLabel = document.createElement("label");
    coLabel.textContent = text;
    div.appendChild(coLabel);
    return div;
  }

  private onCOSelectorClick(coName: string) {
    // Hide the CO selector
    const overDiv = document.querySelector("#overDiv") as HTMLDivElement;
    overDiv.style.visibility = "hidden";

    // Change the CO portrait
    const imgCO = this.groups.get("co-portrait") as HTMLImageElement;
    imgCO.src = `terrain/ani/aw2${coName}.png?v=1`;
  }
}

type COSelectorListener = (coName: string) => void;

const coSelectorListeners: COSelectorListener[] = [];
export function addCOSelectorListener(listener: COSelectorListener) {
  coSelectorListeners.push(listener);
}

export function notifyCOSelectorListeners(coName: string) {
  coSelectorListeners.forEach((listener) => listener(coName));
}
