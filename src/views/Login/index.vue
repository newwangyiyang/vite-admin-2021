<template>
  <div class="login-wrap relative">
    <div class="absolute top-16 left-36 text-xl text-blue-400 select-none">{{ author }}</div>
    <div
      class="
        absolute
        top-1/2
        left-1/2
        z-20
        transform
        -translate-x-1/2 -translate-y-1/2
        w-1/3
        shadow
        bg-white
        py-6
        px-12
        rounded
      "
    >
      <div class="text-center text-2xl text-gray-600 mb-4">{{ title }}</div>
      <el-tabs v-model="activeName" stretch>
        <el-tab-pane label="账号登陆" name="account">
          <account />
        </el-tab-pane>
        <el-tab-pane label="手机号登陆" name="phone">配置管理</el-tab-pane>
      </el-tabs>
    </div>
    <copyright />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import Copyright from '@/components/Copyright/index.vue';
import Account from './components/Account.vue';
import settings from '@/settings';
export default defineComponent({
  name: 'Login',
  components: {
    Copyright,
    Account,
  },
  setup() {
    const state = reactive({
      activeName: 'account',
    });
    const { title, author } = settings;
    return {
      ...toRefs(state),
      title,
      author,
    };
  },
});
</script>
<style lang="scss" scoped src="./index.scss" />
