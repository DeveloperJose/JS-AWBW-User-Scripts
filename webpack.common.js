const { devPort } = require("./shared/config");

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
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
