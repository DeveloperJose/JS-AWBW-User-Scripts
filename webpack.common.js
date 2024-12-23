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
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
