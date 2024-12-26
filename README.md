# AWBW Custom User Scripts
This repo contains the code for my custom user scripts for Advance Wars by Web (AWBW) written mainly in [Typescript](https://www.typescriptlang.org/).

If you are a developer, you might be interested in my [AWBW Types File](./shared/awbw_types.d.ts) which although incomplete basically serves as an unofficial API and can be easily extended.

The code in this repo is in active development, the latest stable versions can be installed here https://greasyfork.org/en/users/1399453-developerjose

This project is managed with [npm](https://www.npmjs.com/), all code is formatted using [prettier](https://prettier.io), checked with [ESLint](https://eslint.org/), and documented with [JSDoc](https://jsdoc.app/) conventions and formatting.

I am using [rollup.js](https://rollupjs.org/) so I can modularize code across many files and then bundle them into a single userscript, making everything easier to organize and read when writing code instead of having a huge single file for each project.

# File Structure
* **dist/** - Contains all the final bundled userscripts with filenames ending in **.user.js**
* **shared/** - Contains all shared code between all my userscripts. It's basically an unofficial AWBW API. See [./shared/README.md](./shared/README.md) for more information.
* **<SCRIPT_NAME>/** - Source code directory for each script. Each script has a **main.js** file which is the base file used to bundle everything together.
* **.prettierrc** - Configuration for [prettier](https://prettier.io).
* **eslint.config.mjs** - Configuration for [ESLint](https://eslint.org/).
* **package.json** - NPM package configuration for this project.
* **rollup.config.js** - Configuration used to build all scripts with [rollup.js](https://rollupjs.org/).
* **tsconfig.json** - Configuration used for [Typescript](https://www.typescriptlang.org/).

# Script List
## 1. Improved AWBW Music Player
Directory: **music_player/**

This is a major code refactoring and update to twiggy_'s original AWBW Music Player 2.0.8 script (https://greasyfork.org/en/scripts/459630-awbw-music-player). I have rewritten the original code fully in Typescript with some improvements, split the code into modules, and documented everything more in depth.

Below are the changes from the original script:
* Added sound effects: subs and stealths hiding and unhiding, CO and Super CO Power becoming available, units getting trapped, loaded missile silos being launched, units making progress capturing a property, pipe seams getting attacked (prepare to be surprised)
* Added the option to switch between AW1, AW2, AW:Dual Strike, and AW:Reboot Camp soundtracks. Note that in AW1 there are no special power themes.
* Each song will continue where it left off the last time it played instead of always starting at the beginning. This means when a turn change happens, if the next CO is the same as the previous CO the music won't restart.
* Fixed issues where some replay controls weren't updating the music properly.
* Added cursor moving sound effects to design map page. 

![Picture of the music player icon on the browser](./AWBW_Music_Player_1.png)

![Picture of the music player settings](./AWBW_Music_Player_2.png)

## 2. AWBW Highlight Cursor Coordinates
Directory: **highlight_cursor_coordinates/**

Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.

![Picture of the added coordinates next to the map](./AWBW_Highlight_Coordinates.png)

![Animated picture demonstrating the cursor moving and highlighting the coordinates](./AWBW_Highlight_Coordinates_Long.gif)