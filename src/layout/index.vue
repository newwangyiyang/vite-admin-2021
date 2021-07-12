<template>
  <div :class="classObj">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="['main-container', { hasTagsView: needTagsView }]">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" id="tags-view-container" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from '@vue/runtime-core';
import { useStore } from 'vuex';
import useResize from './hooks/useResize';
import { Sidebar, Navbar, TagsView, AppMain } from './components';

export default defineComponent({
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      sidebar: computed(() => store.getters.sidebar),
      device: computed(() => store.getters.device),
      fixedHeader: computed(() => store.getters.settings.fixedHeader),
      needTagsView: computed(() => store.getters.settings.needTagsView),
    });
    useResize();
    const methods = {
      handleClickOutside() {
        store.dispatch('app/closeSideBar', { withoutAnimation: false });
      },
    };
    return {
      ...toRefs(state),
      ...methods,
      classObj: computed(() => ({
        'app-wrapper': true,
        hideSidebar: !state.sidebar.opened,
        openSidebar: state.sidebar.opened,
        withoutAnimation: state.sidebar.withoutAnimation,
        mobile: state.device === 'mobile',
      })),
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
