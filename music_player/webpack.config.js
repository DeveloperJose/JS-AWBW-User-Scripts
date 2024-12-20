const { merge } = require("webpack-merge");
const { UserscriptPlugin } = require("webpack-userscript");

const common = require("../webpack.common.js");
const { proxyScript, versions } = require("../shared/config");

module.exports = merge(common, {
  entry: {
    music_player: { import: "./music_player/main.js", filename: "./awbw_music_player.js" },
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        name: "AWBW Music Player (DeveloperJose Edition)",
        namespace: "https://awbw.amarriner.com/",
        version: versions.musicPlayer,
        description:
          "A comprehensive audio player that attempts to recreate the cart experience. Modified from the original script so now the music won't change if the next CO is the same as the previous CO.",
        author: "Original by twiggy_, modified by DeveloperJose",
        match: [
          "https://awbw.amarriner.com/*?games_id=*",
          "https://awbw.amarriner.com/*?replays_id=*",
          "https://awbw.amarriner.com/*editmap*",
        ],
        icon: "https://awbw.amarriner.com/favicon.ico",
        license: "MIT",
      },
      proxyScript: proxyScript,
    }),
  ],
});
