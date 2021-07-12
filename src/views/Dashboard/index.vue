<template>
  <div class="app-container">
    <div class="h-72">
      <v-chart :option="option" />
    </div>
    <div class="mt-5 flex justify-center">
      <pan-thumb width="100px" height="100px" image="https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191">
        <span>wyy</span>
      </pan-thumb>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PanThumb from '@/components/PanThumb/index.vue';
import getLineOption from '@/echarts/line';
export default defineComponent({
  name: 'Home',
  components: {
    PanThumb,
  },
  setup() {
    return {
      option: getLineOption(true),
    };
  },
});
</script>
