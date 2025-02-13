/**
 * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
 */
import { getCurrentDocument } from "../music_player/iframe";
import { getCOImagePrefix } from "./awbw_game";
import { getAllCONames } from "./awbw_globals";
import { getCurrentPageType, PageType } from "./awbw_page";
import { checkIfUpdateIsAvailable, homepageURLs, ScriptName, updateURLs, versions } from "./config";

export enum CustomInputType {
  Radio = "radio",
  Checkbox = "checkbox",
  Button = "button",
}

export enum GroupType {
  Vertical = "cls-vertical-box",
  Horizontal = "cls-horizontal-box",
}

function sanitize(str: string) {
  return str.toLowerCase().replaceAll(" ", "-");
}

interface TableData {
  table: HTMLTableElement;
  rows: number;
  columns: number;
}

export enum NodeID {
  Parent = "parent",
  Hover = "hover",
  Background = "background",
  Button_Image = "button-image",

  Settings = "settings",
  Settings_Left = "settings-left",
  Settings_Center = "settings-center",
  Settings_Right = "settings-right",

  Version = "version",
  CO_Selector = "co-selector",
  CO_Portrait = "co-portrait",
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
  prefix: ScriptName;

  /**
   * A boolean that represents whether an update is available for the script.
   */
  private isUpdateAvailable = false;

  /**
   * Text to be displayed when hovering over the main button.
   */
  private parentHoverText = "";

  /**
   * A map that contains the tables in the menu.
   * The keys are the names of the tables, and the values are the table elements.
   */
  private tableMap: Map<string, TableData> = new Map();

  /**
   * Creates a new Custom Menu UI, to add it to AWBW you need to call {@link addToAWBWPage}.
   * @param prefix - A string used to prefix the IDs of the elements in the menu.
   * @param buttonImageURL - The URL of the image to be used as the button.
   * @param hoverText - The text to be displayed when hovering over the button.
   */
  constructor(prefix: ScriptName, buttonImageURL: string, hoverText = "") {
    this.prefix = prefix;
    this.parentHoverText = hoverText;

    this.parent = document.createElement("div");
    this.parent.classList.add("game-tools-btn");
    this.parent.style.width = "34px";
    this.parent.style.height = "30px";
    this.setNodeID(this.parent, NodeID.Parent);

    // Hover text
    const hoverSpan = document.createElement("span");
    hoverSpan.classList.add("game-tools-btn-text", "small_text");
    hoverSpan.innerText = hoverText;
    this.parent.appendChild(hoverSpan);
    this.setNodeID(hoverSpan, NodeID.Hover);

    // Button Background
    const bgDiv = document.createElement("div");
    bgDiv.classList.add("game-tools-bg");
    bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff 0% , #888888 0%)";
    this.parent.appendChild(bgDiv);
    this.setNodeID(bgDiv, NodeID.Background);

    // Reset hover text for parent button
    bgDiv.addEventListener("mouseover", () => this.setHoverText(this.parentHoverText));
    bgDiv.addEventListener("mouseout", () => this.setHoverText(""));

    // Button
    const btnLink = document.createElement("a");
    btnLink.classList.add("norm2");
    bgDiv.appendChild(btnLink);

    const btnImg = document.createElement("img") as HTMLImageElement;
    btnImg.src = buttonImageURL;
    btnLink.appendChild(btnImg);
    this.setNodeID(btnImg, NodeID.Button_Image);

    // Context Menu
    const contextMenu = document.createElement("div");
    // contextMenu.id = `${prefix}-settings`;
    contextMenu.classList.add("cls-settings-menu");
    contextMenu.style.zIndex = "30";
    this.parent.appendChild(contextMenu);
    this.setNodeID(contextMenu, NodeID.Settings);

    const contextMenuBoxesContainer = document.createElement("div");
    // contextMenuBoxesContainer.id = `${prefix}-settings-container`;
    contextMenuBoxesContainer.classList.add("cls-horizontal-box");
    contextMenu.appendChild(contextMenuBoxesContainer);
    // this.groups.set("settings", contextMenuBoxesContainer);

    // Context Menu 3 Boxes
    const leftBox = document.createElement("div");
    // leftBox.id = `${prefix}-settings-left`;
    leftBox.classList.add("cls-settings-menu-box");
    leftBox.style.display = "none";
    contextMenuBoxesContainer.appendChild(leftBox);
    // this.groups.set(MenuPosition.Left, leftBox);
    this.setNodeID(leftBox, NodeID.Settings_Left);

    const centerBox = document.createElement("div");
    // centerBox.id = `${prefix}-settings-center`;
    centerBox.classList.add("cls-settings-menu-box");
    centerBox.style.display = "none";
    contextMenuBoxesContainer.appendChild(centerBox);
    this.setNodeID(centerBox, NodeID.Settings_Center);
    // this.groups.set(MenuPosition.Center, centerBox);

    const rightBox = document.createElement("div");
    // rightBox.id = `${prefix}-settings-right`;
    rightBox.classList.add("cls-settings-menu-box");
    rightBox.style.display = "none";
    contextMenuBoxesContainer.appendChild(rightBox);
    this.setNodeID(rightBox, NodeID.Settings_Right);
    // this.groups.set(MenuPosition.Right, rightBox);

    // Right-click context menu
    document.addEventListener("contextmenu", (event: Event) => {
      const element = event.target as HTMLElement;
      // logDebug("ContextMenu", event, element, this.isSettingsMenuOpen);
      if (!element.id.startsWith(this.prefix)) return;

      event.stopImmediatePropagation();
      event.preventDefault();
      this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
      if (this.isSettingsMenuOpen) {
        this.openContextMenu();
      } else {
        this.closeContextMenu();
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
      if (elmnt.id.startsWith(this.prefix) || elmnt.id === "overDiv") return;

      // Close the menu if we clicked outside of it
      // console.debug("[MP] Closing becase clicked on: ", elmnt.id);
      this.closeContextMenu();
    });
  }

  setNodeID(node: HTMLElement, id: NodeID) {
    node.id = `${this.prefix}_${id}`;
  }

  getNodeByID(id: NodeID) {
    const fullID = `${this.prefix}_${id}`;
    const node = getCurrentDocument().getElementById(fullID) ?? this.parent.querySelector(`#${fullID}`);
    if (!node) {
      if (id !== NodeID.CO_Selector) console.log(`[DeveloperJose] Node with ID ${fullID} not found.`);
      return null;
    }

    const isSettingsSubMenu =
      id === NodeID.Settings_Left || id === NodeID.Settings_Center || id === NodeID.Settings_Right;
    const isHidden = node.style.display === "none";
    const hasChildren = node.children.length > 0;
    if (isSettingsSubMenu && isHidden && hasChildren) {
      node.style.display = "flex";
    }

    return node;
  }

  /**
   * Adds the custom menu to the AWBW page.
   */
  addToAWBWPage(div: HTMLElement, prepend = false) {
    if (!div) {
      console.error("[DeveloperJose] Parent div is null, cannot add custom menu to the page.");
      return;
    }

    if (!prepend) {
      div.appendChild(this.parent);
      this.parent.style.borderLeft = "none";
      return;
    }

    div.prepend(this.parent);
    this.parent.style.borderRight = "none";
  }

  hasSettings() {
    const hasLeftMenu = this.getNodeByID(NodeID.Settings_Left)?.style.display !== "none";
    const hasCenterMenu = this.getNodeByID(NodeID.Settings_Center)?.style.display !== "none";
    const hasRightMenu = this.getNodeByID(NodeID.Settings_Right)?.style.display !== "none";
    return hasLeftMenu || hasCenterMenu || hasRightMenu;
  }

  getGroup(groupName: string) {
    return this.groups.get(groupName);
  }

  /**
   * Changes the hover text of the main button.
   * @param text - The text to be displayed when hovering over the button.
   * @param replaceParent - Whether to replace the current hover text for the main button or not.
   */
  setHoverText(text: string, replaceParent = false) {
    const hoverSpan = this.getNodeByID(NodeID.Hover) as HTMLSpanElement;
    if (!hoverSpan) return;
    if (replaceParent) this.parentHoverText = text;

    if (this.isUpdateAvailable) text += " (New Update Available!)";
    hoverSpan.innerText = text;
    hoverSpan.style.display = text === "" ? "none" : "block";
  }

  /**
   * Sets the progress of the UI by coloring the background of the main button.
   * @param progress - A number between 0 and 100 representing the percentage of the progress bar to fill.
   */
  setProgress(progress: number) {
    const bgDiv = this.getNodeByID(NodeID.Background) as HTMLDivElement;
    if (!bgDiv) return;
    if (progress <= 0 || progress >= 100) {
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
    const btnImg = this.getNodeByID(NodeID.Button_Image) as HTMLImageElement;
    btnImg.src = imageURL;
  }

  /**
   * Adds an event listener to the main button.
   * @param type - The type of event to listen for.
   * @param listener - The function to be called when the event is triggered.
   */
  addEventListener(type: string, listener: (event: Event) => void, options: boolean | AddEventListenerOptions = false) {
    const div = this.getNodeByID(NodeID.Background);
    div?.addEventListener(type, listener, options);
  }

  /**
   * Opens the context (right-click) menu.
   */
  openContextMenu() {
    const contextMenu = this.getNodeByID(NodeID.Settings);
    if (!contextMenu) return;

    // No settings so don't open the menu
    const hasVersion = this.getNodeByID(NodeID.Version)?.style.display !== "none";
    if (!this.hasSettings() && !hasVersion) return;

    contextMenu.style.display = "flex";
    this.isSettingsMenuOpen = true;
    // logDebug("Opening context menu...", this.hasSettings(), hasVersion, contextMenu);
  }

  /**
   * Closes the context (right-click) menu.
   */
  closeContextMenu() {
    const contextMenu = this.getNodeByID(NodeID.Settings);
    if (!contextMenu) return;
    // logDebug("Closing context menu...");
    contextMenu.style.display = "none";
    this.isSettingsMenuOpen = false;

    // Check if we have a CO selector and need to hide it
    const overDiv = document.querySelector("#overDiv") as HTMLDivElement;
    const hasCOSelector = this.getNodeByID(NodeID.CO_Selector) !== null;
    const isGamePageAndActive = getCurrentPageType() === PageType.ActiveGame;
    if (overDiv && hasCOSelector && isGamePageAndActive) {
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
  addSlider(
    name: string,
    min: number,
    max: number,
    step: number,
    hoverText = "",
    position: NodeID = NodeID.Settings_Center,
  ) {
    const submenu = this.getNodeByID(position);
    if (!submenu) return;

    // Container for the slider and label
    const sliderBox = document.createElement("div");
    sliderBox.classList.add("cls-vertical-box");
    sliderBox.classList.add("cls-group-box");
    submenu?.appendChild(sliderBox);

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

  addGroup(groupName: string, type: GroupType = GroupType.Horizontal, position = NodeID.Settings_Center) {
    const submenu = this.getNodeByID(position);
    if (!submenu) return;
    if (this.groups.has(groupName)) return this.groups.get(groupName);

    // Container for the label and group inner container
    const groupBox = document.createElement("div");
    groupBox.classList.add("cls-vertical-box");
    groupBox.classList.add("cls-group-box");
    submenu?.appendChild(groupBox);

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
    label.appendChild(input);
    label.appendChild(document.createTextNode(name));

    // inputBox.appendChild(input);
    inputBox.appendChild(label);

    this.inputElements.push(input as HTMLInputElement);
    return input;
  }

  /**
   * Adds a special version label to the context menu.
   * @param version - The version to be displayed.
   */
  addVersion() {
    const version = versions.get(this.prefix);
    if (!version) return;

    const contextMenu = this.getNodeByID(NodeID.Settings);
    const versionDiv = document.createElement("label");
    // versionDiv.id = this.prefix + "-version";
    versionDiv.innerText = `Version: ${version} (DeveloperJose Edition)`;
    contextMenu?.appendChild(versionDiv);
    // this.groups.set("version", versionDiv);
    this.setNodeID(versionDiv, NodeID.Version);
  }

  checkIfNewVersionAvailable() {
    const currentVersion = versions.get(this.prefix);
    const updateURL = updateURLs.get(this.prefix);
    const homepageURL = homepageURLs.get(this.prefix) || "";
    if (!currentVersion || !updateURL) return;

    checkIfUpdateIsAvailable(this.prefix)
      .then((isUpdateAvailable) => {
        this.isUpdateAvailable = isUpdateAvailable;
        console.log("[DeveloperJose] Checking if a new version is available...", isUpdateAvailable);
        if (!isUpdateAvailable) return;

        const contextMenu = this.getNodeByID(NodeID.Settings);
        const versionDiv = document.createElement("a");
        versionDiv.id = this.prefix + "-update";
        versionDiv.href = homepageURL;
        versionDiv.target = "_blank";
        versionDiv.innerText = `(!) Update Available: Please click here to open the update page in a new tab. (!)`;
        contextMenu?.append(versionDiv.cloneNode(true));

        if (this.hasSettings()) contextMenu?.prepend(versionDiv);
      })
      .catch((error) => console.error(error));
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
    this.setNodeID(coSelector, NodeID.CO_Selector);
    this.setNodeID(imgCO, NodeID.CO_Portrait);
    // this.groups.set("co-selector", coSelector);
    // this.groups.set("co-portrait", imgCO);
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
      const ret = overlib(selectorInnerHTML, STICKY, CAPTION, selectorTitle, OFFSETY, 25, OFFSETX, -322, CLOSECLICK);
      const overdiv = document.querySelector("#overDiv") as HTMLDivElement;
      if (overdiv) overdiv.style.zIndex = "1000";
      return ret;
    };

    // Listen for clicks on the CO selector
    addCOSelectorListener((coName) => this.onCOSelectorClick(coName));
    addCOSelectorListener(onClickFn);
    return coSelector;
  }

  private createCOSelectorItem(coName: string) {
    const location = "javascript:void(0)";
    const internalName = coName.toLowerCase().replaceAll(" ", "");

    const coPrefix = getCOImagePrefix();
    const imgSrc = `terrain/ani/${coPrefix}${internalName}.png?v=1`;
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
    imgCaret.style.zIndex = "300";
    return imgCaret;
  }

  createCOPortraitImage(coName: string) {
    const imgCO = document.createElement("img");
    imgCO.classList.add("co_portrait");

    const coPrefix = getCOImagePrefix();
    imgCO.src = `terrain/ani/${coPrefix}${coName}.png?v=1`;

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
    const imgCO = this.getNodeByID(NodeID.CO_Portrait) as HTMLImageElement;
    const coPrefix = getCOImagePrefix();
    imgCO.src = `terrain/ani/${coPrefix}${coName}.png?v=1`;
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
