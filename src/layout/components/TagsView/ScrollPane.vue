<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import { CommonRecord } from '@/types';
import { computed, defineComponent, reactive, ref, toRefs } from 'vue';
const tagAndTagSpacing = 4; // tagAndTagSpacing

export default defineComponent({
  name: 'ScrollPane',
  props: {
    tag: {
      default: () => [],
      type: Array,
    },
  },
  emits: ['scroll'],
  setup(props, { emit }) {
    const state = reactive({
      left: 0,
    });
    const scrollContainer = ref();
    const scrollWrapper = computed(() => scrollContainer.value.wrap);
    const methods = {
      handleScroll(e: CommonRecord) {
        const eventDelta = e.wheelDelta || -e.deltaY * 40;
        const $scrollWrapper = scrollWrapper;
        $scrollWrapper.value.scrollLeft = $scrollWrapper.value.scrollLeft + eventDelta / 4;
      },
      emitScroll() {
        emit('scroll');
      },
      moveToTarget(currentTag: CommonRecord) {
        const $container = scrollContainer.value;
        const $containerWidth = $container.$el.offsetWidth;
        const $scrollWrapper = scrollWrapper.value;
        const tagList = props.tag;

        let firstTag = null;
        let lastTag = null;

        // find first tag and last tag
        if (tagList.length > 0) {
          firstTag = tagList[0];
          lastTag = tagList[tagList.length - 1];
        }
        if (firstTag === currentTag) {
          $scrollWrapper.scrollLeft = 0;
        } else if (lastTag === currentTag) {
          $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
        } else {
          // find preTag and nextTag
          const currentIndex = tagList.findIndex((item) => item === currentTag);
          const prevTag: any = tagList[currentIndex - 1];
          const nextTag: any = tagList[currentIndex + 1];
          // the tag's offsetLeft after of nextTag
          const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + tagAndTagSpacing;
          // the tag's offsetLeft before of prevTag
          const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagAndTagSpacing;
          if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
            $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
          } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
            $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
          }
        }
      },
    };
    return {
      ...toRefs(state),
      ...methods,
      scrollContainer,
    };
  },
});
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  :deep(.el-scrollbar__bar) {
    bottom: 0px;
  }
  :deep(.el-scrollbar__wrap) {
    height: 49px;
  }
}
</style>
