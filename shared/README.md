# Shared JS Code
This folder contains code that is shared and used by all my userscripts.

File Directory:
* **awbw_game.ts** - Constants, functions, and variables related to the game state in Advance Wars By Web. A lot of useful information came from game.js and the code at the bottom of each game page.
* **awbw_globals.ts** - Global variables exposed by Advance Wars By Web's JS code and other useful constants.
* **awbw_handlers.ts** - Functions used by Advance Wars By Web to handle game actions. I intercept a lot of these in my scripts, storing a copy of the old functions and overriding them with new ones that call the old functions.
* **awbw_page.ts** - Constants, variables, and functions that come from analyzing the web pages of AWBW. Mostly dealing with HTML Elements.
* **awbw_types.d.ts** - Type definitions for Advance Wars By Web. Not complete by any means, just what I've needed so far.
* **custom_ui.ts** - A class that makes it easier to create a menu button and a right-click settings menu for my scripts.
* **config.js** - Constants and other project configuration settings that could be used by any scripts.
* **other_userscripts.js** - Constants, functions, and computed variables that come from other userscripts to improve synergy with my userscripts when relevant.