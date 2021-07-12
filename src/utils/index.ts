/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (typeof document.addEventListener === 'function') {
    return function (element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function (element: any, event: any, handler: any) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (typeof document.removeEventListener === 'function') {
    return function (element: any, event: any, handler: any) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function (element: any, event: any, handler: any) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();
