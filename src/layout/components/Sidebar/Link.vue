<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { isExternal } from '@/utils/validate';

export default defineComponent({
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isExternalPath = computed(() => isExternal(props.to));
    const type = computed(() => (isExternalPath.value ? 'a' : 'router-link'));
    const linkProps = (to) => {
      return isExternalPath.value
        ? {
            href: to,
            target: '_blank',
            rel: 'noopener',
          }
        : {
            to: to,
          };
    };
    return {
      isExternalPath,
      type,
      linkProps,
    };
  },
});
</script>
