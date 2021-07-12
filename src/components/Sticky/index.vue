<template>
  <div ref="el" :style="{ height: height + 'px', zIndex: zIndex }">
    <div
      :class="className"
      :style="{
        top: isSticky ? stickyTop + 'px' : '',
        zIndex: zIndex,
        position: position,
        width: width,
        height: height + 'px',
      }"
    >
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onActivated, onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue';
/** nav + tagsView => 84px */
interface StateIF {
  active: boolean;
  position: string;
  width: string | number | undefined;
  height: string | number | undefined;
  isSticky: boolean;
}
export default defineComponent({
  name: 'Sticky',
  props: {
    stickyTop: {
      type: Number,
      default: 84,
    },
    zIndex: {
      type: Number,
      default: 1,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const el = ref();
    const state = reactive<StateIF>({
      active: false,
      position: '',
      width: undefined,
      height: undefined,
      isSticky: false,
    });
    const methods = {
      sticky() {
        if (state.active) {
          return;
        }
        state.position = 'fixed';
        state.active = true;
        state.width = state.width + 'px';
        state.isSticky = true;
      },
      handleReset() {
        if (!state.active) {
          return;
        }
        methods.reset();
      },
      reset() {
        state.position = '';
        state.width = 'auto';
        state.active = false;
        state.isSticky = false;
      },
      handleScroll() {
        const width = el.value.getBoundingClientRect().width;
        state.width = width || 'auto';
        const offsetTop = el.value.getBoundingClientRect().top;
        if (offsetTop < props.stickyTop) {
          methods.sticky();
          return;
        }
        methods.handleReset();
      },
      handleResize() {
        if (state.isSticky) {
          state.width = el.value.getBoundingClientRect().width + 'px';
        }
      },
    };
    onMounted(() => {
      state.height = el.value.getBoundingClientRect().height;
      window.addEventListener('scroll', methods.handleScroll);
      window.addEventListener('resize', methods.handleResize);
    });
    onActivated(() => {
      methods.handleScroll();
    });
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', methods.handleScroll);
      window.removeEventListener('resize', methods.handleResize);
    });
    return {
      ...toRefs(state),
      ...methods,
      el,
    };
  },
});
</script>
