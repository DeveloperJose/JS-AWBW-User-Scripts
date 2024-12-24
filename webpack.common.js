const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  output: {
    module: true,
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimize: true,
    usedExports: true,
    concatenateModules: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            //beautify: true,
            semicolons: true,
          },
          mangle: false,
          compress: {
            module: true,
            unused: true,
            dead_code: true,
            // drop_console: true,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.(js)$/,
      //   exclude: /node_modules/,
      //   use: ["babel-loader"],
      // },
    ],
  },
  // resolve: {
  //   extensions: ["*", ".js"],
  // },
};
