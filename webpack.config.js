const path = require("path");
const { UserscriptPlugin } = require("webpack-userscript");

module.exports = {
  mode: "none",
  entry: {
    music_player: { import: "./music_player/main.js", filename: "./awbw_music_player.js" },
  },
  output: {
    module: true,
    library: {
      type: "module",
    },
  },
  optimization: {
    minimize: false,
    usedExports: true,
    concatenateModules: true,
  },
  experiments: {
    outputModule: true,
  },
  devServer: {
    port: "12345",
  },
  plugins: [
    new UserscriptPlugin({
      headers: {
        name: "AWBW Music Player (DeveloperJose Edition)",
        namespace: "https://awbw.amarriner.com/",
        version: "2.0.8",
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
      proxyScript: {
        baseURL: "http://127.0.0.1:12345",
        filename: "[basename].proxy.user.js",
      },
    }),
  ],
};
