# AWBW Custom User Scripts
This repo contains the code for my custom user scripts for Advance Wars by Web.

The code in this repo is in active development, the latest stable versions can be installed here https://greasyfork.org/en/users/1399453-developerjose

This project is managed with [npm](https://www.npmjs.com/). All code is formatted using [prettier](https://prettier.io), checked with [ESLint](https://eslint.org/), and documented with [JSDoc](https://jsdoc.app/) conventions and formatting.

I am using [webpack](https://webpack.js.org/) so I can have code across many files and then bundle them into a single userscript, making everything easier to organize and read when writing code instead of having a huge single file for each project.

I configured npm to use PowerShell with the command ```npm config set script-shell powershell``` to properly run my npm scripts like ```npm build``` since I am running them on Windows 11.

# File Structure
* **dist/** - Contains all the final bundled userscripts with filenames ending in **.user.js**
* **shared/** - Contains all shared code between all my userscripts. See [./shared/README.md](./shared/README.md) for more information.
* **<SCRIPT_NAME>/** - Source code directory for each script. Each script has a **main.js** file which is the base file used to bundle everything together.
* **.prettierrc** - Configuration for [prettier](https://prettier.io).
* **eslint.config.mjs** - Configuration for [ESLint](https://eslint.org/).
* **package.json** - NPM package configuration for this project.
* **webpack.common.js** - Webpack configuration shared by all userscripts which is then merged with each specific script's configuration with [webpack-merge](https://www.npmjs.com/package/webpack-merge).

# Script List
## 1) Improved AWBW Music Player
Directory: **music_player/**

This is a major code refactoring and update to twiggy_'s original AWBW Music Player 2.0.8 script (https://greasyfork.org/en/scripts/459630-awbw-music-player) with the following changes:
* Added sound effects: subs and stealths hiding and unhiding, CO and Super CO Power becoming available, units getting trapped, loaded missile silos being launched, units making progress capturing a property,
* Added the option to switch between AW1, AW2, AW:Dual Strike, and AW:Reboot Camp soundtracks.
* When a turn change happens, if the next CO is the same as the previous CO the music won't restart.
* Each song will continue where it left off the last time it played instead of always starting at the beginning.
* If you change the turn with the turn selector checkbox (the one with the numbers) the music will change accordingly as well. Before it only changed the music if you used the turn selector arrows to go forward/backward.

![Picture of the music player icon on the browser](./AWBW_Music_Player_1.png)

![Picture of the music player settings](./AWBW_Music_Player_2.png)

## 2) AWBW Highlight User Coordinates
Directory: **highlight_coordinates/**

Displays and better highlights the coordinates of your cursor by adding numbered rows and columns next to the map in Advance Wars by Web.

![Picture of the added coordinates next to the map](./AWBW_Highlight_Coordinates.png)
