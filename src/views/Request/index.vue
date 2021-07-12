<template>
  <div v-loading="loading" class="app-container h-full">
    <ul>
      <li v-for="item in list" :key="item.id">
        <a :href="item.url" class="text-red-400 underline leading-8 truncate w-96 inline-block">{{
          item.description || '~~~'
        }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';

import { requestDemo } from '@/api/website';

export default defineComponent({
  setup() {
    const state = reactive({
      list: [],
      loading: true,
    });
    const methods = {
      initData() {
        requestDemo().then((res) => {
          if (res.data) {
            state.list = res.data;
            state.loading = false;
            ElMessage.success('接口请求成功～');
          }
        });
      },
    };
    onMounted(methods.initData);

    return {
      ...toRefs(state),
    };
  },
});
</script>
