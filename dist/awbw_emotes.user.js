// ==UserScript==
// @name       AWBW Emotes
// @namespace  https://awbw.amarriner.com/
// @author     DeveloperJose
// @match      https://awbw.amarriner.com/game.php*
// @supportURL https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues
// @license    MIT
// @unwrap
// @grant      none
// ==/UserScript==

(function () {
  "use strict";

  /**
   * @file Constants, variables, and functions that come from analyzing the web pages of AWBW.
   */
  /**
   * Are we in the map editor?
   */
  function getIsMaintenance() {
    return document.querySelector("#server-maintenance-alert") !== null;
  }

  /**
   * @file Global variables exposed by Advance Wars By Web's JS code and other useful constants.
   */
  /**
   * Whether game animations are enabled or not.
   */
  function areAnimationsEnabled() {
    return typeof gameAnims !== "undefined" ? gameAnims : false;
  }

  /**
   * @file Constants, functions, and variables related to the game state in Advance Wars By Web.
   *  A lot of useful information came from game.js and the code at the bottom of each game page.
   */
  /**
   * Enum for the different states a CO Power can be in.
   * @enum {string}
   */
  var COPowerEnum;
  (function (COPowerEnum) {
    COPowerEnum["NoPower"] = "N";
    COPowerEnum["COPower"] = "Y";
    COPowerEnum["SuperCOPower"] = "S";
  })(COPowerEnum || (COPowerEnum = {}));
  /**
   * The amount of time between the silo launch animation and the hit animation in milliseconds.
   * Copied from game.js
   */
  areAnimationsEnabled() ? 3000 : 0;
  /**
   * The amount of time between an attack animation starting and the attack finishing in milliseconds.
   * Copied from game.js
   */
  areAnimationsEnabled() ? 1000 : 0;
  /**
   * Gets the username of the person logged in to the website.
   */
  function getMyUsername() {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu) return null;
    const link = profileMenu.getElementsByClassName("dropdown-menu-link")[0];
    return link.href.split("username=")[1];
  }
  /**
   * The player ID for the person logged in to the website.
   * Singleton set and returned by {@link getMyID}
   */
  let myID = -1;
  /**
   * Gets the ID of the person logged in to the website.
   * @returns - The player ID of the person logged in to the website.
   */
  function getMyID() {
    if (myID < 0) {
      getAllPlayersInfo().forEach((entry) => {
        if (entry.users_username === getMyUsername()) {
          myID = entry.players_id;
        }
      });
    }
    return myID;
  }
  /**
   * Gets a list of all the player info data for all players in the current game.
   * @returns - List of player info data for all players in the current game.
   */
  function getAllPlayersInfo() {
    if (getIsMaintenance()) return [];
    return Object.values(playersInfo);
  }

  const BASE_URL = "https://677695d6b0b77423838205b0--developerjose.netlify.app";
  const EMOTE_API_URL = `${BASE_URL}/.netlify/functions/emotes`;
  let emotesInterval;
  function sendEmote(emote) {
    const message = {
      emote: emote,
      gameId: gameId,
      playerId: getMyID(),
    };
    fetch(EMOTE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: message }),
    }).then((response) => {
      console.log("SendResp", response);
    });
    console.log(`Sending emote: ${message}`);
  }
  function fetchEmotes() {
    console.log("Fetching emotes...");
    fetch(EMOTE_API_URL)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error(error);
        clearInterval(emotesInterval);
      });
  }
  const p = document.querySelector("#game-menu-controls");
  const button = document.createElement("button");
  button.textContent = "Send emote";
  button.addEventListener("click", () => sendEmote("👋"));
  p.appendChild(button);
  // emotesInterval = setInterval(fetchEmotes, 10000);
  emotesInterval = -1;
  fetchEmotes();
})();
