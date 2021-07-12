<template>
  <section class="app-main">
    <router-view #default="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" key="key" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AppMain',
  setup() {
    const store = useStore();
    const route = useRoute();
    return {
      cachedViews: computed(() => store.getters.cachedViews),
      key: computed(() => route.fullPath),
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  // width: 100%;
  // position: relative;
  // overflow: hidden;
  // background-color: #f8f8f8;
  // box-sizing: border-box;
  position: absolute;
  background-color: #f8f8f8;
  /* slider width 210 */
  left: 0;
  width: 100%;
  overflow: auto;
  height: calc(100vh - 50px);
}

.fixed-header + .app-main {
  top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    // padding-right: 15px;
    padding-right: 0px;
  }
}
</style>
