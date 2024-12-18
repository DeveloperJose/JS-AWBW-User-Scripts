const { merge } = require("webpack-merge");
const common = require("../webpack.common.js");
const { UserscriptPlugin } = require("webpack-userscript");

module.exports = merge(common, {
  entry: {
    music_player: { import: "./highlight_coordinates/main.js", filename: "./awbw_highlight_cursor_coordinates.js" },
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        name: "AWBW Highlight Cursor Coordinates",
        namespace: "https://awbw.amarriner.com/",
        version: "1.0.1",
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
      proxyScript: {
        baseURL: "http://127.0.0.1:12345",
        filename: "[basename].proxy.user.js",
      },
    }),
  ],
});
