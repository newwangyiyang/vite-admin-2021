import { on } from '@/utils';
import store from '@/store';
import { CommonRecord } from '@/types';

function checkPermission(el: HTMLElement, binding: CommonRecord) {
  const { value } = binding;
  const roles = store.getters && store.getters.roles;

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value;

      const hasPermission = roles.some((role: string) => {
        return permissionRoles.includes(role);
      });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`);
  }
}

export const draggable = {
  mounted: (el: HTMLElement, binding: CommonRecord, vnode: CommonRecord) => {
    let triggerDom = document.querySelector(binding.value.trigger);
    triggerDom.style.cursor = 'move';
    let bodyDom = document.querySelector(binding.value.body);
    let pageX = 0;
    let pageY = 0;
    let transformX = 0;
    let transformY = 0;
    let canMove = false;
    const handleMousedown = (e: any) => {
      let transform: RegExpExecArray | string | null = /\(.*\)/.exec(bodyDom.style.transform);
      if (transform) {
        transform = transform[0].slice(1, transform[0].length - 1);
        let splitxy = transform.split('px, ');
        transformX = parseFloat(splitxy[0]);
        transformY = parseFloat(splitxy[1].split('px')[0]);
      }
      pageX = e.pageX;
      pageY = e.pageY;
      canMove = true;
    };
    const handleMousemove = (e: any) => {
      let xOffset = e.pageX - pageX + transformX;
      let yOffset = e.pageY - pageY + transformY;
      if (canMove) bodyDom.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    };
    const handleMouseup = (e: any) => {
      canMove = false;
    };
    on(triggerDom, 'mousedown', handleMousedown);
    on(document, 'mousemove', handleMousemove);
    on(document, 'mouseup', handleMouseup);
  },
  updated: (el: HTMLElement, binding: CommonRecord, vnode: CommonRecord) => {
    if (!binding.value.recover) return;
    let bodyDom = document.querySelector(binding.value.body);
    bodyDom.style.transform = '';
  },
};

export const permission = {
  mounted(el: HTMLElement, binding: CommonRecord) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: CommonRecord) {
    checkPermission(el, binding);
  },
};

export const dragDialog = {
  created(el: any, binding: CommonRecord, vnode: CommonRecord) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');
    dialogHeaderEl.style.cssText += ';cursor:move;';
    dragDom.style.cssText += ';top:0px;';

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function () {
      return (dom: any, attr: any) => getComputedStyle(dom, undefined)[attr];
    })();

    dialogHeaderEl.onmousedown = (e: any) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      const dragDomWidth = dragDom.offsetWidth;
      const dragDomHeight = dragDom.offsetHeight;

      const screenWidth = document.body.clientWidth;
      const screenHeight = document.body.clientHeight;

      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight;

      // 获取到的值带px 正则匹配替换
      let styL: string | number = getStyle(dragDom, 'left');
      let styT: string | number = getStyle(dragDom, 'top');

      if (styL.includes('%')) {
        styL = Number(document.body.clientWidth) * (Number(styL.replace(/\%/g, '')) / 100);
        styT = Number(document.body.clientHeight) * (Number(styT.replace(/\%/g, '')) / 100);
      } else {
        styL = Number(styL.replace(/\px/g, ''));
        styT = Number(styT.replace(/\px/g, ''));
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft;
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop;
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + (styL as number)}px;top:${top + (styT as number)}px;`;

        // emit onDrag event
        vnode?.props?.onDragDialog();
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
};
