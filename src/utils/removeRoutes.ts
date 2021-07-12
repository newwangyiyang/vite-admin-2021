import { reactive } from 'vue';

// 缓存当前路由队列
const asyncRouteQueue = reactive<Function[]>([]);

// canCelToken回调
const removeRoutesCb = () => {
  if (!asyncRouteQueue.length) return;
  for (const callabck of asyncRouteQueue) {
    callabck();
  }
};

export default () => ({
  removeRoutesCb,
  asyncRouteQueue,
});
