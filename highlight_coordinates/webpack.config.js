const { merge } = require("webpack-merge");
const { UserscriptPlugin } = require("webpack-userscript");

const common = require("../webpack.common.js");
const { proxyScript, versions } = require("../shared/config");

module.exports = merge(common, {
  entry: {
    music_player: {
      import: "./highlight_coordinates/main.js",
      filename: "./awbw_highlight_cursor_coordinates.js",
    },
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        name: "AWBW Highlight Cursor Coordinates",
        namespace: "https://awbw.amarriner.com/",
        version: versions.highlightCoordinates,
        description:
          "Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.",
        author: "DeveloperJose",
        match: [
          "https://awbw.amarriner.com/*?games_id=*",
          "https://awbw.amarriner.com/*?replays_id=*",
        ],
        icon: "https://awbw.amarriner.com/terrain/unit_select.gif",
        license: "MIT",
      },
      proxyScript: proxyScript,
    }),
  ],
});
