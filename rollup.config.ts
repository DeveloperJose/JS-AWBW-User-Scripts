import postcss from "rollup-plugin-postcss";
import metablock from "rollup-plugin-userscript-metablock";
import esbuild from "rollup-plugin-esbuild";
import { defineConfig } from "rollup";

import path from "path";
import { versions } from "./shared/config.js";

// Until https://github.com/FlandreDaisuki/rollup-plugin-userscript-metablock gets updated
import { MetaValues } from "updated-rollup-plugin-userscript-metablock";

/**
 * Creates the rollup configuration for a given userscript.
 * @param inputDir - The directory containing the userscript's main.js and metadata.json.
 * @param outputDir - The directory to output the userscript. Defaults to "./dist".
 * @returns - Configuration object for rollup.
 */
function createUserscriptRollUpConfig(inputDir: string, outputDir = "./dist") {
  return defineConfig({
    input: path.join(inputDir, "main.ts"),
    output: {
      file: path.join(outputDir, `awbw_${inputDir}.user.js`),
      format: "iife",
      name: "awbw_" + inputDir,
      globals: {
        howler: "Howl",
        "spark-md5": "SparkMD5",
        "can-autoplay": "canAutoplay",
      },
    },
    external: ["howler", "spark-md5", "can-autoplay"],
    plugins: [
      esbuild(),
      postcss(),
      metablock({
        file: path.join(inputDir, "metadata.json"),
        manager: "tampermonkey",
        validator: "error",
        override: {
          version: versions.get(inputDir),
          supportURL: "https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues",
          namespace: "https://awbw.amarriner.com/",
          contributionURL: "https://ko-fi.com/developerjose",
          license: "MIT",
          unwrap: true,
        } as MetaValues,
      }),
    ],
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (commandLineArgs: any) => {
  if (commandLineArgs.configInputDir) return createUserscriptRollUpConfig(commandLineArgs.configInputDir);
  return [
    createUserscriptRollUpConfig("music_player"),
    createUserscriptRollUpConfig("highlight_cursor_coordinates"),
    // createUserscriptRollUpConfig("emotes"),
  ];
};
