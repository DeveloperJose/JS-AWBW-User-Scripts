const { devPort } = require("./config");

module.exports = {
  mode: "production",
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
    port: devPort,
  }
};
