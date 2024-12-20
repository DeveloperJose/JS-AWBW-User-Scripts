/**
 *
 */
export var on = (() => {
  if (window.addEventListener) {
    return (target, type, listener) => {
      target.addEventListener(type, listener, false);
    };
  } else {
    return (object, sEvent, fpNotify) => {
      object.attachEvent("on" + sEvent, fpNotify);
    };
  }
})();
