<template>
  <i v-if="isElIcon" :class="[icon, 'sub-el-icon']" />
  <svg-icon v-else :icon-class="icon" />
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return {
      isElIcon: computed(() => props.icon.includes('el-icon')),
    };
  },
});
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
