<template>
  <div class="app-container">
    <div>Admin</div>
    <el-button class="mt-5" @click="changeRoles">changeRoles</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  setup() {
    const store = useStore();
    const methods = {
      changeRoles() {
        store.dispatch('user/changeRoles', ['editor']);
      },
    };
    return {
      ...methods,
    };
  },
});
</script>
