/**
 *
 */
export var on = (() => {
  if (window.addEventListener) {
    return (target, type, listener) => {
      if (target === null) {
        console.log(
          "[AWBW Improved Music Player] Could not add event listener: " + target + "/" + type,
        );
        return;
      }
      target.addEventListener(type, listener, false);
    };
  } else {
    return (object, sEvent, fpNotify) => {
      if (object === null) {
        console.log(
          "[AWBW Improved Music Player] Could not add event listener: " + object + "/" + sEvent,
        );
        return;
      }
      object.attachEvent("on" + sEvent, fpNotify);
    };
  }
})();
