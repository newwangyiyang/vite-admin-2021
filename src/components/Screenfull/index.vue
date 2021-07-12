<template>
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="click" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import screenfull from 'screenfull';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'Screenfull',
  setup() {
    const isFullscreen = ref<boolean>();
    const methods = {
      click() {
        if (!screenfull.isEnabled) {
          ElMessage({
            message: 'you browser can not work',
            type: 'warning',
          });
          return false;
        }
        screenfull.toggle();
      },
      change() {
        const sf: any = screenfull;
        isFullscreen.value = sf.isFullscreen;
      },
      init() {
        if (screenfull.isEnabled) {
          screenfull.on('change', methods.change);
        }
      },
      destroy() {
        if (screenfull.isEnabled) {
          screenfull.off('change', methods.change);
        }
      },
    };
    onMounted(() => {
      methods.init();
    });
    onBeforeUnmount(() => {
      methods.destroy();
    });
    return {
      isFullscreen,
      ...methods,
    };
  },
});
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
