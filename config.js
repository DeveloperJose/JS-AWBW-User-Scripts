const devPort = "12345";
exports.devPort = devPort;

const proxyScript = {
  baseURL: "http://127.0.0.1:" + devPort,
  filename: "[basename].proxy.user.js",
};
exports.proxyScript = proxyScript;
