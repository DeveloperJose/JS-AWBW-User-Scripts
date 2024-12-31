/**
 * @file Type definitions for Advance Wars By Web. Not complete by any means, just what I've needed so far.
 */

/**
 * All the player information for the current game.
 */
declare const playersInfo: PlayerInfo[];

/**
 * All the unit information for the current game.
 */
declare const unitsInfo: UnitInfo[];

/**
 * All the player IDs for the current game.
 */
declare const playerKeys: number[];

/**
 * All the building information for the current game.
 * buildingsInfo[x][y] is the building at (x, y).
 */
declare const buildingsInfo: BuildingInfo[][];

/**
 * The number of columns of this map.
 */
declare const maxX: number;

/**
 * The number of rows of this map.
 */
declare const maxY: number;

/**
 * Whether game animations are enabled or not.
 */
declare const gameAnims: boolean;

/**
 * The current game day.
 */
declare const gameDay: number;

declare const gameEndDate: string;

declare const replay: Object;

interface TagInfo {
  co_max_power: number;
  co_max_spower: number;
  co_name: string;
  players_co_id: number;
  players_co_image: string;
  players_co_max_power: number;
  players_co_max_spower: number;
  players_co_power: number;
  players_co_power_on: string;
  players_id: number;
}

declare const tagsInfo: TagInfo[];

/**
 * Information about a player's current game state.
 */
interface PlayerInfo {
  cities: number;
  co_max_power: number;
  co_max_spower: number;
  co_name: string;
  countries_code: string;
  countries_name: string;
  labs: number;
  numProperties: number;
  other_buildings: Object;
  players_co_id: number;
  players_co_image: string;
  players_co_max_power: number;
  players_co_max_spower: number;
  players_co_power: number;
  players_co_power_on: string;
  players_countries_id: number;
  /**
   * Whether the player has been eliminated or not.
   * Y if eliminated, N if not.
   */
  players_eliminated: string;
  players_funds: number;
  players_id: number;
  players_income: number;
  players_order: number;
  players_team: string;
  players_turn_clock: number;
  players_turn_start: number;
  towers: number;
  users_username: string;
}

interface UnitInfo {
  units_id: number;
  units_fuel: number;
  units_name: string;
  units_moved: number; // 0 or 1
  units_players_id: number;
  units_x: number;
  units_y: number;
}

interface BuildingInfo {
  buildings_capture: number;
  buildings_games_id: number;
  buildings_id: number;
  buildings_last_capture: number;
  buildings_last_updated: string;
  buildings_players_id: string;
  buildings_team: string;
  buildings_x: number;
  buildings_y: number;
  // countries_code: any;
  // countries_id: any;
  // countries_name: string;
  is_occupied: boolean;
  terrain_defense: string;
  terrain_id: number;
  terrain_name: string;
}

declare let mapClick: (e: Event, e1: Event) => void;
declare let swapCosDisplay: (playerId: number) => void;

/**
 * Function called when the cursor is moved in the game.
 * @param cursorX - The x coordinate of the cursor inside the game grid.
 * @param cursorY - The y coordinate of the cursor inside the game grid.
 */
declare let updateCursor: (cursorX: number, cursorY: number) => void;

interface ShowEventScreenData {
  username: string;
  text: string;
}
declare let showEventScreen: (event: ShowEventScreenData) => void;

/**
 * Function called when the action menu is opened.
 * @param menu - The menu that was opened.
 * @param x - The x coordinate of the menu.
 * @param y - The y coordinate of the menu.
 */
declare let openMenu: (menu: HTMLDivElement, x: number, y: number) => void;

/**
 * Function called when the action menu is closed.
 */
declare let closeMenu: () => void;

declare let resetAttack: () => void;

interface UnitClickData {
  el: HTMLSpanElement;
  id: string;
  type: string;

  // These only appear when clicking a unit that isn't waited
  info?: UnitInfo;
  path?: number[];
}

/**
 * Function called when a unit is clicked.
 */
declare let unitClickHandler: (clicked: UnitClickData) => void;

/**
 * Function called when a unit is waited.
 * @param unitId - ID of the unit that was waited.
 */
declare let waitUnit: (unitId: number) => void;

interface PathInfo {
  x: number;
  y: number;
  unit_visible: boolean;
}

/**
 * Function called when a unit is moved along a given path.
 * @param path - Array with path the unit will move along.
 * @param unitId - The ID of the unit that will move.
 * @param unitSpan - The span of the unit that will move.
 * @param unitTeam - The team of the unit that will move.
 * @param viewerTeam - The team of the viewer.
 * @param i - The index of the path the unit is currently at.
 */
declare let animUnit: (
  path: PathInfo[],
  unitId: number,
  unitSpan: HTMLSpanElement,
  unitTeam: number,
  viewerTeam: number,
  i: number,
) => void;

/**
 * Function called when a unit explodes.
 * Can be from a unit being destroyed, deleted, or a black bomb exploding.
 * @param unit - The unit that exploded.
 */
declare let animExplosion: (unit: UnitInfo) => void;

/**
 * Function called when a unit moves in fog.
 */
declare let updateAirUnitFogOnMove: (
  x: number,
  y: number,
  mType: any, // TODO
  neighbours: any[], // TODO
  unitVisible: boolean,
  change: string,
  delay: number,
) => void;

interface COPValues {
  attacker: { playerId: number; copValue: number; tagValue: number };
  defender: { playerId: number; copValue: number; tagValue: number };
}

interface FireResponse {
  attacker: UnitInfo;
  copValues: COPValues;
  defender: UnitInfo;
}

interface SeamResponse {
  attacker: UnitInfo;
  newMoveCosts: Object;
  seamHp: number;
  seamTerrainId: number;
  seamX: number;
  seamY: number;
}

interface PathInfo {
  unit_visible: boolean;
  x: number;
  y: number;
}

interface MoveResponse {
  discovered: boolean;
  dist: number;
  path: PathInfo[];
  trapped: boolean;
  unit: UnitInfo;
}

interface CaptureDataBuildingInfo {
  buildings_capture: number;
  buildings_id: number;
  // buildings_team: any;
  buildings_x: number;
  buildings_y: number;
}

interface CaptureData {
  newIncome: number;
  buildingInfo: CaptureDataBuildingInfo;
}

interface BuildData {
  discovered: boolean;
  newUnit: UnitInfo;
}

interface LoadData {}

interface UnloadData {}

interface SupplyData {}

interface RepairData {}

interface HideData {
  unitId: number;
  vision: boolean;
}

interface UnhideData {
  unitId: number;
}

interface JoinData {
  joinID: number;
  joinedUnit: UnitInfo;
}

interface DeleteData {}

interface ExplodeData {}

interface LaunchData {}

interface NextTurnData {
  action: string;
  day: number;
  nextFunds: number;
  nextPId: number;
  nextTimer: number;
  nextTurnStart: string;
  nextWeather: string;
  repaired: { units_id: number; units_hit_points: number }[];
  supplied: string[];
  swapCos: boolean;
}

interface EliminationData {
  playerId: number;
}

interface PowerData {
  coName: string;
  coPower: string;
}

interface DrawData {}

interface ResignData {}

/**
 * Unit action handlers for the game.
 */
declare let actionHandlers: {
  Fire: (response: FireResponse) => void;
  AttackSeam: (response: SeamResponse) => void;
  Move: (response: MoveResponse, loadFlag: any) => void;
  Capt: (data: CaptureData) => void;
  Build: (data: BuildData) => void;
  Load: (data: LoadData) => void;
  Unload: (data: UnloadData) => void;
  Supply: (data: SupplyData) => void;
  Repair: (data: RepairData) => void;
  Hide: (data: HideData) => void;
  Unhide: (data: UnhideData) => void;
  Join: (data: JoinData) => void;
  Delete: (data: DeleteData) => void;
  Explode: (data: ExplodeData) => void;
  Launch: (data: LaunchData) => void;
  NextTurn: (data: NextTurnData) => void;
  Elimination: (data: EliminationData) => void;
  Power: (data: PowerData) => void;
  SetDraw: (data: DrawData) => void;
  Resign: (data: ResignData) => void;
  GameOver: () => void;
};

interface CurrentClickData {
  el: HTMLDivElement;
  id: number;
  info: BuildingInfo | UnitInfo;
  type: string;
}

declare let currentClick: CurrentClickData | null;

/**
 * The ID of the player currently playing this turn.
 */
declare let currentTurn: number;

/**
 * Vue instance for the map editor.
 */
interface MapEditorVue {
  updateCursor: (x: number, y: number) => void;
}
declare let designMapEditor: MapEditorVue;
