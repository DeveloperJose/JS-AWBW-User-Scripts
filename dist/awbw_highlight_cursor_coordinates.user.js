// ==UserScript==
// @name        AWBW Highlight Cursor Coordinates
// @description Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.
// @namespace   https://awbw.amarriner.com/
// @author      DeveloperJose
// @match       https://awbw.amarriner.com/game.php*
// @match       https://awbw.amarriner.com/moveplanner.php*
// @match       https://awbw.amarriner.com/*editmap*
// @icon        https://awbw.amarriner.com/terrain/unit_select.gif
// @version     2.0.0
// @supportURL  https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @license     MIT
// @grant       none
// ==/UserScript==

(function () {
  "use strict";

  /**
   * @file Constants, variables, and functions that come from analyzing the web pages of AWBW.
   */
  /**
   * Are we in the map editor?
   */
  function getIsMapEditor() {
    return window.location.href.indexOf("editmap.php?") > -1;
  }
  function getIsMaintenance() {
    return document.querySelector("#server-maintenance-alert") !== null;
  }
  function getIsMovePlanner() {
    return window.location.href.indexOf("moveplanner.php") > -1;
  }
  // ============================== AWBW Page Elements ==============================
  function getGamemap() {
    return document.querySelector("#gamemap");
  }
  function getGamemapContainer() {
    return document.querySelector("#gamemap-container");
  }
  function getZoomInBtn() {
    return document.querySelector("#zoom-in");
  }
  function getZoomOutBtn() {
    return document.querySelector("#zoom-out");
  }
  // export function getZoomLevel() {
  //   return document.querySelector(".zoom-level") as HTMLElement;
  // }
  function getCurrentZoomLevel() {
    const storedScale = localStorage.getItem("scale") || "1";
    return parseFloat(storedScale);
  }
  function getCoordsDiv() {
    return document.querySelector("#coords");
  }
  /**
   * Adds an observer to the cursor coordinates so we can replicate the "updateCursor" function outside of game.php
   * @param onCursorMove - The function to call when the cursor moves.
   */
  function addUpdateCursorObserver(onCursorMove) {
    // We want to catch when div textContent is changed
    const coordsDiv = getCoordsDiv();
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") return;
        if (!mutation.target) return;
        if (!mutation.target.textContent) return;
        // (X, Y)
        let coordsText = mutation.target.textContent;
        // Remove parentheses and split by comma
        coordsText = coordsText.substring(1, coordsText.length - 1);
        const splitCoords = coordsText.split(",");
        const cursorX = Number(splitCoords[0]);
        const cursorY = Number(splitCoords[1]);
        onCursorMove(cursorX, cursorY);
      }
    });
    observer.observe(coordsDiv, { childList: true });
  }

  /**
   * @file Global variables exposed by Advance Wars By Web's JS code and other useful constants.
   */
  // ============================== Advance Wars Stuff ==============================
  /**
   * List of Orange Star COs, stored in a set for more efficient lookups.
   */
  const ORANGE_STAR_COs = new Set(["andy", "max", "sami", "nell", "hachi", "jake", "rachel"]);
  /**
   * List of Blue Moon COs, stored in a set for more efficient lookups.
   */
  const BLUE_MOON_COs = new Set(["olaf", "grit", "colin", "sasha"]);
  /**
   * List of Green Earth COs, stored in a set for more efficient lookups.
   */
  const GREEN_EARTH_COs = new Set(["eagle", "drake", "jess", "javier"]);
  /**
   * List of Yellow Comet COs, stored in a set for more efficient lookups.
   */
  const YELLOW_COMET_COs = new Set(["kanbei", "sonja", "sensei", "grimm"]);
  /**
   * List of Black Hole COs, stored in a set for more efficient lookups.
   * @constant
   */
  const BLACK_HOLE_COs = new Set(["flak", "lash", "adder", "hawke", "sturm", "jugger", "koal", "kindle", "vonbolt"]);
  /**
   * List of all COs in the game.
   */
  function getAllCONames(properCase = false) {
    if (!properCase)
      return [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    const allCOs = [...ORANGE_STAR_COs, ...BLUE_MOON_COs, ...GREEN_EARTH_COs, ...YELLOW_COMET_COs, ...BLACK_HOLE_COs];
    allCOs[allCOs.indexOf("vonbolt")] = "Von Bolt";
    return allCOs.map((co) => co[0].toUpperCase() + co.slice(1));
  }
  // ============================== AWBW Page Global Variables ==============================
  /**
   * The number of columns of this map.
   */
  function getMapColumns() {
    if (getIsMapEditor()) return designMapEditor.map.maxX;
    return typeof maxX !== "undefined" ? maxX : typeof map_width !== "undefined" ? map_width : -1;
  }
  /**
   * The number of rows of this map.
   */
  function getMapRows() {
    if (getIsMapEditor()) return designMapEditor.map.maxY;
    return typeof maxY !== "undefined" ? maxY : typeof map_height !== "undefined" ? map_height : -1;
  }

  /**
   * @file Functions used by Advance Wars By Web to handle game actions.
   */
  // export function getCursorMoveFn() {
  //   if (getIsMapEditor()) {
  //     return typeof designMapEditor !== "undefined" ? designMapEditor.updateCursor : null;
  //   }
  //   return typeof updateCursor !== "undefined" ? updateCursor : null;
  // }
  function getResizeMapFn() {
    return typeof designMapEditor !== "undefined" ? designMapEditor.resizeMap : null;
  }

  /**
   * @file This file contains all the functions and variables relevant to the creation and behavior of a custom UI.
   */
  var CustomInputType;
  (function (CustomInputType) {
    CustomInputType["Radio"] = "radio";
    CustomInputType["Checkbox"] = "checkbox";
    CustomInputType["Button"] = "button";
  })(CustomInputType || (CustomInputType = {}));
  var GroupType;
  (function (GroupType) {
    GroupType["Vertical"] = "cls-vertical-box";
    GroupType["Horizontal"] = "cls-horizontal-box";
  })(GroupType || (GroupType = {}));
  var MenuPosition;
  (function (MenuPosition) {
    MenuPosition["Left"] = "settings-left";
    MenuPosition["Center"] = "settings-center";
    MenuPosition["Right"] = "settings-right";
  })(MenuPosition || (MenuPosition = {}));
  function sanitize(str) {
    return str.toLowerCase().replaceAll(" ", "-");
  }
  /**
   * A class that represents a custom menu UI that can be added to the AWBW page.
   */
  class CustomMenuSettingsUI {
    /**
     * The root element or parent of the custom menu.
     */
    parent;
    /**
     * A map that contains the important nodes of the menu.
     * The keys are the names of the children, and the values are the elements themselves.
     * Allows for easy access to any element in the menu.
     */
    groups = new Map();
    /**
     * A map that contains the group types for each group in the menu.
     * The keys are the names of the groups, and the values are the types of the groups.
     */
    groupTypes = new Map();
    /**
     * An array of all the input elements in the menu.
     */
    inputElements = [];
    /**
     * An array of all the button elements in the menu.
     */
    buttonElements = [];
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
    parentHoverText = "";
    tableMap = new Map();
    /**
     * Creates a new Custom Menu UI, to add it to AWBW you need to call {@link addToAWBWPage}.
     * @param prefix - A string used to prefix the IDs of the elements in the menu.
     * @param buttonImageURL - The URL of the image to be used as the button.
     * @param hoverText - The text to be displayed when hovering over the button.
     */
    constructor(prefix, buttonImageURL, hoverText = "") {
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
      const btnImg = document.createElement("img");
      btnImg.id = `${prefix}-link-img`;
      btnImg.src = buttonImageURL;
      btnLink.appendChild(btnImg);
      this.groups.set("img", btnImg);
      // Context Menu
      const contextMenu = document.createElement("div");
      contextMenu.id = `${prefix}-settings`;
      contextMenu.classList.add("cls-settings-menu");
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
        const element = event.target;
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
        let elmnt = event.target;
        // Find the first parent that has an ID if the element doesn't have one
        if (!elmnt.id) {
          while (!elmnt.id) {
            elmnt = elmnt.parentNode;
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
    addToAWBWPage(div, prepend = false) {
      if (!prepend) {
        div.appendChild(this.parent);
        this.parent.style.borderLeft = "none";
        return;
      }
      div.prepend(this.parent);
      this.parent.style.borderRight = "none";
    }
    getGroup(groupName) {
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
    setHoverText(text, replaceParent = false) {
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
    setProgress(progress) {
      const bgDiv = this.groups.get("bg");
      if (!bgDiv) return;
      bgDiv.style.backgroundImage = "linear-gradient(to right, #ffffff " + String(progress) + "% , #888888 0%)";
    }
    /**
     * Sets the image of the main button.
     * @param imageURL - The URL of the image to be used on the button.
     */
    setImage(imageURL) {
      const btnImg = this.groups.get("img");
      btnImg.src = imageURL;
    }
    /**
     * Adds an event listener to the main button.
     * @param type - The type of event to listen for.
     * @param listener - The function to be called when the event is triggered.
     */
    addEventListener(type, listener) {
      const div = this.groups.get("bg");
      div?.addEventListener(type, listener);
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
      const overDiv = document.querySelector("#overDiv");
      const hasCOSelector = this.groups.has("co-selector");
      if (overDiv && hasCOSelector) {
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
    addSlider(name, min, max, step, hoverText = "", position = MenuPosition.Center) {
      const container = this.getGroup(position);
      if (!container) return;
      // Slider label
      const label = document.createElement("label");
      container?.appendChild(label);
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
      container?.appendChild(slider);
      // Hover text
      slider.addEventListener("mouseover", () => this.setHoverText(hoverText));
      slider.addEventListener("mouseout", () => this.setHoverText(""));
      return slider;
    }
    addGroup(groupName, type = GroupType.Horizontal, position = MenuPosition.Center) {
      const contextMenu = this.getGroup(position);
      if (!contextMenu) return;
      // Label for the group
      const groupLabel = document.createElement("label");
      groupLabel.innerText = groupName;
      contextMenu?.appendChild(groupLabel);
      // Group container
      const group = document.createElement("div");
      group.id = `${this.prefix}-${sanitize(groupName)}`;
      group.classList.add(type);
      contextMenu?.appendChild(group);
      this.groups.set(groupName, group);
      this.groupTypes.set(groupName, type);
      return group;
    }
    addRadioButton(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, CustomInputType.Radio);
    }
    addCheckbox(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, CustomInputType.Checkbox);
    }
    addButton(name, groupName, hoverText = "") {
      return this.addInput(name, groupName, hoverText, CustomInputType.Button);
    }
    /**
     * Adds an input to the context menu in a specific group.
     * @param name - The name of the input.
     * @param groupName - The name of the group the input belongs to.
     * @param hoverText - The text to be displayed when hovering over the input.
     * @param type - The type of input to be added.
     * @returns - The input element.
     */
    addInput(name, groupName, hoverText = "", type) {
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
      inputBox.addEventListener("mouseover", () => this.setHoverText(hoverText));
      inputBox.addEventListener("mouseout", () => this.setHoverText(""));
      // Create button or a different type of input
      let input;
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
    createButton(name, inputBox) {
      // Buttons don't need a separate label
      const input = document.createElement("button");
      input.innerText = name;
      inputBox.appendChild(input);
      this.buttonElements.push(input);
      return input;
    }
    createInput(name, inputBox) {
      // Create the input and a label for it
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.innerText = name;
      // Input first, then label
      inputBox.appendChild(input);
      inputBox.appendChild(label);
      // Propagate label clicks to the input
      label.addEventListener("click", () => input.click());
      this.inputElements.push(input);
      return input;
    }
    /**
     * Adds a special version label to the context menu.
     * @param version - The version to be displayed.
     */
    addVersion(version) {
      const contextMenu = this.groups.get("settings-parent");
      const versionDiv = document.createElement("label");
      versionDiv.id = this.prefix + "-version";
      versionDiv.innerText = `Version: ${version} (DeveloperJose Edition)`;
      contextMenu?.appendChild(versionDiv);
    }
    addTable(name, rows, columns, groupName, hoverText = "") {
      const groupDiv = this.getGroup(groupName);
      if (!groupDiv) return;
      const table = document.createElement("table");
      table.classList.add("cls-settings-table");
      groupDiv.appendChild(table);
      // Hover text
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
    addItemToTable(name, item) {
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
    clearTable(name) {
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
    addCOSelector(groupName, hoverText = "", onClickFn) {
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
        const templateFn = (coName) => this.createCOSelectorItem(coName);
        const currentColumnHTML = allCOs.slice(startIDX, endIDX).map(templateFn).join("");
        allColumnsHTML += `<td><table>${currentColumnHTML}</table></td>`;
      }
      const selectorInnerHTML = `<table><tr>${allColumnsHTML}</tr></table>`;
      const selectorTitle = `<img src=terrain/ani/blankred.gif height=16 width=1 align=absmiddle>Select CO`;
      // Make the CO selector that will appear when the user clicks on the CO portrait
      coSelector.onclick = () => {
        return overlib(selectorInnerHTML, STICKY, CAPTION, selectorTitle, OFFSETY, 25, OFFSETX, -322, CLOSECLICK);
      };
      return coSelector;
    }
    createCOSelectorItem(coName) {
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
    createCOSelectorCaret() {
      const imgCaret = document.createElement("img");
      imgCaret.classList.add("co_caret");
      imgCaret.src = "terrain/co_down_caret.gif";
      return imgCaret;
    }
    createCOPortraitImage(coName) {
      const imgCO = document.createElement("img");
      imgCO.classList.add("co_portrait");
      imgCO.src = `terrain/ani/aw2${coName}.png?v=1`;
      // Allows other icons to be used
      if (!getAllCONames().includes(coName)) {
        imgCO.src = `terrain/${coName}`;
      }
      return imgCO;
    }
    createCOPortraitImageWithText(coName, text) {
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
    onCOSelectorClick(coName) {
      // Hide the CO selector
      const overDiv = document.querySelector("#overDiv");
      overDiv.style.visibility = "hidden";
      // Change the CO portrait
      const imgCO = this.groups.get("co-portrait");
      imgCO.src = `terrain/ani/aw2${coName}.png?v=1`;
    }
  }

  /**
   * @file Constants, functions, and computed variables that come from other userscripts.
   *  These are useful when we want to have better synergy with other userscripts.
   */
  /**
   * The button that is used to enter maximization mode or exit it for the AWBW Maximize Extension
   */
  function getMaximizeBtn() {
    return document.getElementsByClassName("AWBWMaxmiseButton")[0];
  }

  /**
   * @file Main script that loads everything for the AWBW Highlight Cursor Coordinates userscript.
   */
  /********************** AWBW Stuff ***********************/
  const gamemap = getGamemap();
  const gamemapContainer = getGamemapContainer();
  const zoomInBtn = getZoomInBtn();
  const zoomOutBtn = getZoomOutBtn();
  let ahResizeMap = getResizeMapFn();
  /********************** Script Variables & Functions ***********************/
  const CURSOR_THRESHOLD_MS = 30;
  const FONT_SIZE = 9;
  const PREFIX = "highlight_cursor_coordinates";
  const BUTTON_IMG_URL = "https://awbw.amarriner.com/terrain/unit_select.gif";
  let isEnabled = true;
  let previousHighlight = [];
  let isMaximizeToggled = false;
  let lastCursorCall = Date.now();
  let lastCursorX = -1;
  let lastCursorY = -1;
  const currentSquares = new Array();
  /**
   * Where should we place the highlight cursor coordinates UI?
   */
  function getMenu() {
    if (getIsMapEditor()) return document.querySelector("#design-map-controls-container")?.children[1];
    if (getIsMovePlanner()) return document.querySelector("#map-controls-container");
    return document.querySelector("#game-menu-controls")?.children[0];
  }
  function setHighlight(node, highlight) {
    if (!isEnabled) return;
    if (!node) {
      console.error("[AWBW Highlight Cursor Coordinates] Node is null, something isn't right.");
      return;
    }
    let fontWeight = "";
    let color = "";
    let backgroundColor = "";
    if (highlight) {
      fontWeight = "bold";
      color = "#FFFFFF";
      backgroundColor = "#FF0000";
    }
    node.style.fontWeight = fontWeight;
    node.style.color = color;
    node.style.backgroundColor = backgroundColor;
  }
  function onZoomChangeEvent(_event, zoom = -1) {
    if (!isEnabled) return;
    if (zoom < 0) {
      zoom = getCurrentZoomLevel();
    }
    const padding = 16 * zoom;
    gamemapContainer.style.paddingBottom = padding + "px";
    gamemapContainer.style.paddingLeft = padding + "px";
  }
  function onCursorMove(cursorX, cursorY) {
    if (!isEnabled) return;
    // Get cursor row and column indices then the span
    const highlightRow = document.getElementById("grid-spot-row-" + cursorY);
    const highlightCol = document.getElementById("grid-spot-col-" + cursorX);
    const dx = Math.abs(cursorX - lastCursorX);
    const dy = Math.abs(cursorY - lastCursorY);
    const cursorMoved = dx >= 1 || dy >= 1;
    const timeSinceLastCursorCall = Date.now() - lastCursorCall;
    if (!highlightRow || !highlightCol) {
      console.error("[AWBW Highlight Cursor Coordinates] Highlight row or column is null, something isn't right.");
      return;
    }
    // Don't play the sound if we moved the cursor too quickly
    if (timeSinceLastCursorCall < CURSOR_THRESHOLD_MS) return;
    if (cursorMoved) {
      // Remove highlight for previous
      if (previousHighlight.length > 0) {
        setHighlight(previousHighlight[0], false);
        setHighlight(previousHighlight[1], false);
      }
      // Highlight current
      setHighlight(highlightRow, true);
      setHighlight(highlightCol, true);
      previousHighlight = [highlightRow, highlightCol];
      lastCursorCall = Date.now();
    }
    lastCursorX = cursorX;
    lastCursorY = cursorY;
  }
  function onResizeMap(num, btnName) {
    ahResizeMap?.apply(ahResizeMap, [num, btnName]);
    if (!isEnabled) return;
    addHighlightBoxesAroundMapEdges();
  }
  function clearHighlightBoxes() {
    if (currentSquares.length > 0) {
      currentSquares.forEach((element) => element.remove());
    }
    gamemapContainer.style.paddingBottom = "0px";
    gamemapContainer.style.paddingLeft = "0px";
  }
  function addHighlightBoxesAroundMapEdges() {
    const mapRows = getMapRows();
    const mapCols = getMapColumns();
    console.debug("[AWBW Highlight Cursor Coordinates] Adding highlight boxes", mapRows, mapCols);
    const spotSpanTemplate = document.createElement("span");
    spotSpanTemplate.style.width = "16px";
    spotSpanTemplate.style.height = "16px";
    spotSpanTemplate.style.left = "-16px";
    spotSpanTemplate.style.top = mapRows * 16 + "px";
    spotSpanTemplate.style.fontFamily = "monospace";
    spotSpanTemplate.style.position = "absolute";
    spotSpanTemplate.style.fontSize = FONT_SIZE + "px";
    spotSpanTemplate.style.zIndex = "100";
    spotSpanTemplate.style.alignContent = "center";
    // spotSpanTemplate.style.backgroundImage = "url(https://awbw.amarriner.com/terrain/ani/plain.gif)";
    // spotSpanTemplate.style.visibility = "hidden";
    // Clear previous squares
    clearHighlightBoxes();
    // Create squares
    for (let row = 0; row < mapRows; row++) {
      const spotSpan = spotSpanTemplate.cloneNode(true);
      spotSpan.id = "grid-spot-row-" + row;
      spotSpan.style.top = row * 16 + "px";
      spotSpan.textContent = row.toString().padStart(2, "0");
      gamemap.appendChild(spotSpan);
      currentSquares.push(spotSpan);
    }
    for (let col = 0; col < mapCols; col++) {
      const spotSpan = spotSpanTemplate.cloneNode(true);
      spotSpan.id = "grid-spot-col-" + col;
      spotSpan.style.left = col * 16 + "px";
      spotSpan.textContent = col.toString().padStart(2, "0");
      gamemap.appendChild(spotSpan);
      currentSquares.push(spotSpan);
    }
    onZoomChangeEvent();
  }
  /******************************************************************
   * SCRIPT ENTRY (MAIN FUNCTION)
   ******************************************************************/
  function main() {
    if (getIsMaintenance()) {
      console.log("[AWBW Highlight Cursor Coordinates] Maintenance mode is active, not loading script...");
      return;
    }
    // Hide by default on map editor and move planner
    if (getIsMapEditor() || getIsMovePlanner()) {
      isEnabled = false;
    }
    // designmap.php, wait until designerMapEditor is loaded to run script
    const isMapEditorAndNotLoaded = getIsMapEditor() && !designMapEditor?.loaded;
    if (isMapEditorAndNotLoaded) {
      const interval = setInterval(() => {
        if (designMapEditor.loaded) {
          ahResizeMap = getResizeMapFn();
          main();
          clearInterval(interval);
        }
      }, 1000);
      return;
    }
    // Intercept AWBW functions (global)
    addUpdateCursorObserver(onCursorMove);
    // Intercept designmap functions
    if (getIsMapEditor()) {
      designMapEditor.resizeMap = onResizeMap;
    }
    if (zoomInBtn != null) zoomInBtn.addEventListener("click", onZoomChangeEvent);
    if (zoomOutBtn != null) zoomOutBtn.addEventListener("click", onZoomChangeEvent);
    // Synergize with AWBW Maximize if that script is running as well
    const maximizeBtn = getMaximizeBtn();
    if (maximizeBtn != null) {
      console.log("[AWBW Highlight Cursor Coordinates] Found AWBW Maximize script and connected to it.");
      maximizeBtn.addEventListener("click", (event) => {
        isMaximizeToggled = !isMaximizeToggled;
        onZoomChangeEvent(event, isMaximizeToggled ? 3.0 : -1);
      });
    }
    // Scale to current zoom level
    onZoomChangeEvent();
    // Add highlight boxes around map edges
    if (isEnabled) addHighlightBoxesAroundMapEdges();
    // Create UI button to toggle highlight boxes
    const customUI = new CustomMenuSettingsUI(PREFIX, BUTTON_IMG_URL, "Disable Highlight Cursor Coordinates");
    customUI.addEventListener("click", () => {
      isEnabled = !isEnabled;
      const hoverText = isEnabled ? "Disable Highlight Cursor Coordinates" : "Enable Highlight Cursor Coordinates";
      customUI.setHoverText(hoverText, true);
      if (isEnabled) addHighlightBoxesAroundMapEdges();
      else clearHighlightBoxes();
    });
    customUI.addToAWBWPage(getMenu(), true);
    customUI.setProgress(100);
    if (getIsMapEditor() || getIsMovePlanner()) {
      customUI.parent.style.height = "31px";
    }
    console.log("[AWBW Highlight Cursor Coordinates] Script loaded!");
  }
  main();
})();
