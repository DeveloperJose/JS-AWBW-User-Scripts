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
        name: "Improved AWBW Music Player",
        namespace: "https://awbw.amarriner.com/",
        version: versions.musicPlayer,
        description:
          "An improved version of the comprehensive audio player that attempts to recreate the cart experience with more sound effects, more music, and more customizability.",
        author: "Original by twiggy_, updated by DeveloperJose",
        match: [
          "https://awbw.amarriner.com/*?games_id=*",
          "https://awbw.amarriner.com/*?replays_id=*",
          "https://awbw.amarriner.com/*editmap*",
        ],
        icon: "https://awbw.amarriner.com/favicon.ico",
        license: "MIT",
      },
      proxyScript: proxyScript,
      metajs: true,
    }),
  ],
});
