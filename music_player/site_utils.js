export let isMapEditor = window.location.href.indexOf("editmap.php?") > -1;
export let myName = document
  .querySelector("#profile-menu")
  .getElementsByClassName("dropdown-menu-link")[0]
  .href.split("username=")[1];
export let myID = -1;
