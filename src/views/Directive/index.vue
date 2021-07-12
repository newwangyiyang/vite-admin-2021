<template>
  <div class="app-container directive-wrap">
    <!-- v-drag-dialog -->
    <div v-drag-dialog @dragDialog="dragDialog">
      <el-button type="primary" @click="open = true">open-dialog</el-button>
      <el-dialog v-model="open" title="提示" width="30%">
        <span>这是一段信息</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="open = false">取 消</el-button>
            <el-button type="primary" @click="open = false">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- v-draggable -->
    <div
      v-draggable="{
        trigger: '.drag-el',
        body: '.drag-el',
      }"
      class="drag-el w-32 h-32 bg-blue-400 rounded-md mt-5"
    ></div>
    <sticky :stickyTop="84">
      <div class="w-20 h-20 bg-red-400 rounded" />
    </sticky>
    <el-button v-permission="['admin']" type="warning" class="mt-10">admin</el-button>
    <div v-if="defer(50)" class="w-36 h-36 bg-yellow-300 rounded-md"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import useDeferred from '@/hooks/useDeferred';
import Sticky from '@/components/Sticky/index.vue';

export default defineComponent({
  name: 'Directive',
  components: {
    Sticky,
  },
  setup() {
    const state = reactive({
      open: false,
    });
    const { defer } = useDeferred(60);
    const methods = {
      dragDialog() {
        console.log('dragDialog');
      },
    };
    return {
      ...toRefs(state),
      ...methods,
      defer,
    };
  },
});
</script>
<style lang="scss">
.directive-wrap {
  height: 200vh;
  overflow-y: auto;
}
</style>
