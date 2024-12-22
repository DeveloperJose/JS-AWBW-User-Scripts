/**
 * @file Constants and other project configuration settings that could be used by any scripts.
 */
const devPort = "12345";
exports.devPort = devPort;

const proxyScript = {
  baseURL: "http://127.0.0.1:" + devPort,
  filename: "[basename].proxy.user.js",
};
exports.proxyScript = proxyScript;

const versions = {
  musicPlayer: "2.0.8",
  highlightCoordinates: "1.0.1",
};
exports.versions = versions;
