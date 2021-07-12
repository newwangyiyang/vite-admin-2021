import { ref, onMounted, onBeforeMount } from 'vue';

export default function (count = 10) {
  const displayPriority = ref<number>(0);
  let requestID: number | null = null;
  const methods = {
    runDisplayPriority() {
      const step = () => {
        // 屏幕每次刷新执行
        requestID = requestAnimationFrame(() => {
          displayPriority.value++;
          if (displayPriority.value < count) {
            step();
          }
        });
      };
      step();
    },
    defer(priority: number) {
      return displayPriority.value >= priority;
    },
  };
  onMounted(() => {
    methods.runDisplayPriority();
  });
  onBeforeMount(() => {
    if (requestID) {
      cancelAnimationFrame(requestID);
    }
  });
  return {
    ...methods,
  };
}
