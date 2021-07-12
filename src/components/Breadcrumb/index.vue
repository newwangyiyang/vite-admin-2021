<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeMount } from 'vue';
import { compile } from 'path-to-regexp';
import { useRoute, useRouter } from 'vue-router';
import { CommonRecord } from '@/types';

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const levelList = ref<CommonRecord[]>([]);
    const methods = {
      getBreadcrumb() {
        // only show routes with meta.title
        let matched: any = route.matched.filter((item) => item.meta && item.meta.title);
        const first = matched[0];

        if (!methods.isDashboard(first)) {
          matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(matched);
        }
        levelList.value = matched.filter(
          (item: CommonRecord) => item.meta && item.meta.title && item.meta.breadcrumb !== false,
        );
      },
      isDashboard(route: CommonRecord) {
        const name = route && route.name;
        if (!name) {
          return false;
        }
        return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
      },
      pathCompile(path: string) {
        // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
        const { params } = route;
        let toPath = compile(path);
        return toPath(params);
      },
      handleLink(item: CommonRecord) {
        const { redirect, path } = item;
        if (redirect) {
          router.push(redirect);
          return;
        }
        router.push(methods.pathCompile(path));
      },
    };
    watch(() => route.path, methods.getBreadcrumb);
    onBeforeMount(() => methods.getBreadcrumb());
    return {
      levelList,
      ...methods,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
