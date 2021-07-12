<template>
  <div class="waterfall-container app-container">
    <el-card shadow="hover" header="瀑布屏" class="mb15">
      <div class="waterfall-first">
        <div v-for="v in 30" :key="v" v-waves class="waterfall-first-item">
          <div class="w100 h100 flex">
            <span class="flex-margin">{{ v }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
});
</script>
<style lang="scss">
@import '@/styles/variables.scss';
.waterfall-container {
  .waterfall-first {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(188px, 1fr));
    grid-gap: 0.25em;
    grid-auto-flow: row dense;
    grid-auto-rows: 20px;
    .waterfall-first-item {
      width: 100%;
      background: $menuActiveText;
      color: #ffffff;
      transition: all 0.3s ease;
      border-radius: 3px;
      &:nth-of-type(3n + 1) {
        grid-row: auto / span 5;
      }
      &:nth-of-type(3n + 2) {
        grid-row: auto / span 6;
      }
      &:nth-of-type(3n + 3) {
        grid-row: auto / span 8;
      }
      &:hover {
        box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
        transition: all 0.3s ease;
        cursor: pointer;
      }
    }
  }
}
</style>
