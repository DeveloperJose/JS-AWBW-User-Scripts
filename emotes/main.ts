import { getMyID } from "../shared/awbw_game";

const BASE_URL = "https://677695d6b0b77423838205b0--developerjose.netlify.app";
const EMOTE_API_URL = `${BASE_URL}/.netlify/functions/emotes`;
let emotesInterval: number;

function sendEmote(emote: string) {
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

const p = document.querySelector("#game-menu-controls") as HTMLElement;
const button = document.createElement("button");
button.textContent = "Send emote";
button.addEventListener("click", () => sendEmote("👋"));
p.appendChild(button);

// emotesInterval = setInterval(fetchEmotes, 10000);
emotesInterval = -1;
fetchEmotes();
