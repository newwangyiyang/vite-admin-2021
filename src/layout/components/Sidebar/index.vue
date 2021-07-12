<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permissionRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import Logo from './Logo.vue';
import SidebarItem from './SidebarItem.vue';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  setup() {
    const store = useStore();
    const route = useRoute();
    const permissionRoutes = computed(() => store.getters.permission_routes);
    const activeMenu = computed(() => {
      const { meta, path } = route;
      return meta.activeMenu ? meta.activeMenu : path;
    });
    const showLogo = store.getters.settings.sidebarLogo;
    const isCollapse = computed(() => !store.getters.sidebar.opened);
    return {
      permissionRoutes,
      activeMenu,
      isCollapse,
      showLogo,
    };
  },
});
</script>
