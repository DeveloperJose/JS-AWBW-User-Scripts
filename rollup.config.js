import postcss from "rollup-plugin-postcss";
import metablock from "rollup-plugin-userscript-metablock";
import typescript from "@rollup/plugin-typescript";

import path from "path";
import { versions } from "./shared/config.js";

// Until howler gets modernized (https://github.com/goldfire/howler.js/pull/1518)
// We'll need to do this
import { fileURLToPath, URL } from "node:url";
const externalId = fileURLToPath(new URL("./howler/howl", import.meta.url));

/**
 * Creates the rollup configuration for a given userscript.
 * @param {string} inputDir - The directory containing the userscript's main.js and metadata.json.
 * @param {string} outputDir - The directory to output the userscript. Defaults to "./dist".
 * @returns - Configuration object for rollup.
 */
function createUserscriptRollUpConfig(inputDir, outputDir = "./dist") {
  return {
    input: path.join(inputDir, "main.ts"),
    output: {
      file: path.join(outputDir, `awbw_${inputDir}.user.js`),
      format: "iife",
      name: "awbw_" + inputDir,
      globals: {
        [externalId]: "Howl",
        "spark-md5": "SparkMD5",
        "can-autoplay": "canAutoplay",
      },
    },
    external: ["../howler/howl", "spark-md5", "can-autoplay"],
    plugins: [
      typescript(),
      postcss(),
      metablock({
        file: path.join(inputDir, "metadata.json"),
        override: {
          version: versions[inputDir],
          supportURL: "https://github.com/DeveloperJose/JS-AWBW-User-Scripts/issues",
          namespace: "https://awbw.amarriner.com/",
          license: "MIT",
          unwrap: true,
        },
      }),
    ],
  };
}

export default (commandLineArgs) => {
  if (commandLineArgs.configInputDir) return createUserscriptRollUpConfig(commandLineArgs.configInputDir);
  return [
    createUserscriptRollUpConfig("music_player"),
    createUserscriptRollUpConfig("highlight_cursor_coordinates"),
    // createUserscriptRollUpConfig("emotes"),
  ];
};
