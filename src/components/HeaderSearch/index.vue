<template>
  <div :class="['header-search', { show: show }]">
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <template v-if="options.length > 0">
        <el-option
          v-for="item in options"
          :key="item.item.path"
          :value="item.item.path"
          :label="item.item.title.join(' > ')"
        />
      </template>
    </el-select>
  </div>
</template>

<script lang="ts">
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations
import { defineComponent, reactive, ref, toRefs, nextTick, watch, onMounted } from 'vue';
import Fuse from 'fuse.js';
import path from 'path-browserify';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { CommonRecord } from '@/types';
interface StateRef {
  search: string;
  searchPool: CommonRecord[];
  options: CommonRecord[];
  show: boolean;
  fuse: Fuse<{}> | undefined;
  routes: CommonRecord[];
}
export default defineComponent({
  name: 'HeaderSearch',
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive<StateRef>({
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined,
      routes: store.getters.permission_routes,
    });
    const headerSearchSelect = ref();
    let fuse: Fuse<{}> | null = null;
    const methods = {
      click() {
        state.show = !state.show;
        if (state.show) {
          headerSearchSelect.value && headerSearchSelect.value.focus();
        }
      },
      close() {
        headerSearchSelect.value && headerSearchSelect.value.blur();
        state.options = [];
        state.show = false;
      },
      change(val: CommonRecord) {
        router.push(val);
        state.search = '';
        state.options = [];
        nextTick(() => {
          state.show = false;
        });
      },
      initFuse(list: CommonRecord[]) {
        fuse = new Fuse(list, {
          shouldSort: true,
          threshold: 0.4,
          location: 0,
          distance: 100,
          minMatchCharLength: 1,
          keys: [
            {
              name: 'title',
              weight: 0.7,
            },
            {
              name: 'path',
              weight: 0.3,
            },
          ],
        });
      },
      // Filter out the routes that can be displayed in the sidebar
      // And generate the internationalized title
      generateRoutes(routes: CommonRecord[], basePath = '/', prefixTitle: string[] = []) {
        let res: CommonRecord[] = [];

        for (const router of routes) {
          // skip hidden router
          if (router.hidden) {
            continue;
          }

          const data: {
            path: string;
            title: string[];
          } = {
            path: path.resolve(basePath, router.path),
            title: [...prefixTitle],
          };

          if (router.meta && router.meta.title) {
            data.title = [...data.title, router.meta.title];

            if (router.redirect !== 'noRedirect') {
              // only push the routes with title
              // special case: need to exclude parent router without redirect
              res.push(data);
            }
          }

          // recursive child routes
          if (router.children) {
            const tempRoutes = this.generateRoutes(router.children, data.path, data.title);
            if (tempRoutes.length >= 1) {
              res = [...res, ...tempRoutes];
            }
          }
        }
        return res;
      },
      querySearch(query: string) {
        if (query !== '') {
          state.options = fuse?.search(query) ?? [];
        } else {
          state.options = [];
        }
      },
    };
    watch(
      () => state.routes,
      (nextVal) => {
        state.searchPool = methods.generateRoutes(nextVal);
      },
    );
    watch(
      () => state.searchPool,
      (list) => {
        methods.initFuse(list);
      },
    );
    watch(
      () => state.show,
      (show) => {
        if (show) {
          document.body.addEventListener('click', methods.close);
        } else {
          document.body.removeEventListener('click', methods.close);
        }
      },
    );
    onMounted(() => {
      state.searchPool = methods.generateRoutes(state.routes);
    });
    return {
      ...toRefs(state),
      ...methods,
      headerSearchSelect,
    };
  },
});
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep(.el-input__inner) {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
