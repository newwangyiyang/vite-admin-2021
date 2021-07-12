import { reactive } from 'vue';

// 缓存当前取消队列
const cancelQueue = reactive<Function[]>([]);
// canCelToken回调
const cancelCallback = (data: string | number) => {
  if (!cancelQueue.length) return;
  for (const callabck of cancelQueue) {
    callabck(data);
  }
};
export default () => ({
  cancelQueue,
  cancelCallback,
});
