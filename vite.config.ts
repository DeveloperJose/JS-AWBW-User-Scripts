import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
// import babel from "@rollup/plugin-babel";

import { metablock } from "vite-plugin-userscript";
import { libInjectCss } from "vite-plugin-lib-inject-css";

import path from "path";
import { versions } from "./shared/config.js";

export default defineConfig((_commandLineArgs: object) => {
  // Get the inputDir from the command line arguments
  let inputDir = "";
  process.argv.forEach((arg) => {
    if (!arg.startsWith("--inputDir=")) return;
    inputDir = arg.slice("--inputDir=".length);
  });
  // console.log(inputDir);

  return {
    build: {
      cssMinify: false,
      minify: false,
      emptyOutDir: false,
      lib: {
        entry: path.join(inputDir, "main.ts"),
        fileName: (_format, _entryName) => `awbw_${inputDir}.user.js`,
        name: "awbw_" + inputDir,
        formats: ["iife"],
      },
      rollupOptions: {
        external: ["howler", "spark-md5", "can-autoplay", "vue"],
        output: {
          format: "iife",
          globals: {
            howler: "Howl",
            "spark-md5": "SparkMD5",
            "can-autoplay": "canAutoplay",
            vue: "Vue",
          },
        },
      },
    },
    plugins: [
      // babel({
      //   presets: [["@babel/preset-env", { targets: "defaults" }]],
      // }),
      libInjectCss(),
      vue(),
      metablock({
        file: path.join(inputDir, "metadata.json5"),
        manager: "tampermonkey",
        validator: "error",
        override: {
          version: versions.get(inputDir),
          supportURL: "https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues",
          namespace: "https://awbw.amarriner.com/",
          contributionURL: "https://ko-fi.com/developerjose",
          license: "MIT",
          unwrap: true,
        },
      }),
    ],
  };
});
