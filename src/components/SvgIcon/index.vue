<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-bind="$attrs" />
  <svg v-else :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { isExternal } from '@/utils/validate';

export default defineComponent({
  name: 'SvgIcon',
  inheritAttrs: false,
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return {
      isExternal: computed(() => isExternal(props.iconClass)),
      iconName: computed(() => `#icon-${props.iconClass}`),
      svgClass: computed(() => (props.className ? 'svg-icon ' + props.className : 'svg-icon')),
      styleExternalIcon: computed(() => ({
        mask: `url(${props.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`,
      })),
    };
  },
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
