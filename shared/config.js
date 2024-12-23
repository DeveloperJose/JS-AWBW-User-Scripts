/**
 * @file Constants and other project configuration settings that could be used by any scripts.
 */
let distPath = __dirname + "/../dist/dist";
const proxyScript = {
  baseURL: "file://" + distPath,
  filename: "[basename].proxy.user.js",
};
exports.proxyScript = proxyScript;

const versions = {
  musicPlayer: "3.0.0",
  highlightCoordinates: "1.0.2",
};
exports.versions = versions;
