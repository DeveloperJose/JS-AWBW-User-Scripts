<template>
  <div class="cls-co-selector">
    <a class="game-tools-btn" href="javascript:void(0)" @click="onClick">
      <img class="co_caret" :src="caretURL" style="z-index: 300" />
      <img class="co_portrait" :src="baseURL + coPrefix + coName + '.png?v=1'" />
    </a>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getCOImagePrefix } from "../awbw_game";
import { getAllCONames } from "../awbw_globals";

export default Vue.extend({
  name: "COSelector",
  data() {
    return {
      coPrefix: getCOImagePrefix(),
      coName: "andy",
      isOpen: false,
      baseURL: "https://awbw.amarriner.com/terrain/ani/",
      caretURL: "https://awbw.amarriner.com/terrain/co_down_caret.gif",
    };
  },
  methods: {
    changeCO(name: string, prefix?: string) {
      this.coName = name;
      if (!prefix) prefix = getCOImagePrefix();
      this.coPrefix = prefix;
    },
    onClick() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.showOverlib();
      } else {
        this.hideOverlib();
      }
    },
    createOverlibHTML() {
      // Sort all the COs alphabetically, get their proper names
      const allCOs = getAllCONames(true).sort();
      let allColumnsHTML = "";
      for (let i = 0; i < 7; i++) {
        const startIDX = i * 4;
        const endIDX = startIDX + 4;
        const templateFn = (coName: string) => this.createOverlibItemHTML(coName);
        const currentColumnHTML = allCOs.slice(startIDX, endIDX).map(templateFn).join("");
        allColumnsHTML += `<td><table>${currentColumnHTML}</table></td>`;
      }
      const selectorInnerHTML = `<table><tr>${allColumnsHTML}</tr></table>`;
      const selectorTitle = `<img src=terrain/ani/blankred.gif height=16 width=1 align=absmiddle>Select CO`;
      return overlib(selectorInnerHTML, STICKY, CAPTION, selectorTitle, OFFSETY, 25, OFFSETX, -322, CLOSECLICK);
    },
    createOverlibItemHTML(coName: string) {
      const location = "javascript:void(0)";
      const internalName = coName.toLowerCase().replaceAll(" ", "");

      const imgSrc = `terrain/ani/${this.coPrefix}${internalName}.png?v=1`;
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
    },
    createOverDiv() {
      let overDiv = document.querySelector("#overDiv") as HTMLElement;
      if (overDiv) return overDiv;

      overDiv = document.createElement("div");
      overDiv.id = "overDiv";
      overDiv.style.visibility = "hidden";
      overDiv.style.position = "absolute";
      overDiv.style.zIndex = "2000";
      document.body.prepend(overDiv);
      return overDiv;
    },
    showOverlib() {
      const ret = this.createOverlibHTML();
      const overdiv = document.querySelector("#overDiv") as HTMLDivElement;
      if (overdiv) overdiv.style.zIndex = "1000";
      return ret;
    },
    hideOverlib() {
      // Hide the CO selector
      const overDiv = document.querySelector("#overDiv") as HTMLDivElement;
      overDiv.style.visibility = "hidden";
    },
    onCOSelected(coName: string) {
      this.hideOverlib();
      this.changeCO(coName);
    },
  },
  mounted() {
    addCOSelectorListener((coName) => this.onCOSelected(coName));
    const overDiv = this.createOverDiv();
    const overDivObserver = new MutationObserver(() => {
      if (overDiv.style.visibility === "visible") this.isOpen = true;
      else this.isOpen = false;
    });
    overDivObserver.observe(overDiv, { attributes: true });
  },
});

type COSelectorListener = (coName: string) => void;

const coSelectorListeners: COSelectorListener[] = [];
export function addCOSelectorListener(listener: COSelectorListener) {
  coSelectorListeners.push(listener);
}

export function notifyCOSelectorListeners(coName: string) {
  coSelectorListeners.forEach((listener) => listener(coName));
}
</script>

<style lang="css">
.cls-co-selector .co_caret {
  position: absolute;
  top: 28px;
  left: 25px;
  border: none;
  z-index: 30;
}

.cls-co-selector .co_portrait {
  border-color: #009966;
  z-index: 30;
  border: 2px solid;
  vertical-align: middle;
  align-self: center;
}
</style>