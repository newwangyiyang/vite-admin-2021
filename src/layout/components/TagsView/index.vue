<template>
  <div id="tags-view-container" ref="el" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" :tag="tag" @scroll="handleScroll">
      <div ref="sortEl">
        <router-link
          v-for="(tagItem, index) in visitedViews"
          v-slot="{ navigate }"
          :key="tagItem.path"
          custom
          :to="{ path: tagItem.path, query: tagItem.query, fullPath: tagItem.fullPath }"
        >
          <span
            :ref="
              (el) => {
                if (el) tag[index] = el;
              }
            "
            :class="isActive(tagItem) ? 'active tags-view-item' : 'tags-view-item'"
            :data-path="tagItem.path"
            :data-full-path="tagItem.fullPath"
            @click="navigate"
            @contextmenu.prevent="openMenu(tagItem, $event)"
          >
            {{ tagItem.title }}
            <span v-if="!isAffix(tagItem)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tagItem)" />
          </span>
        </router-link>
      </div>
    </scroll-pane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, toRefs, nextTick, onMounted, watch } from 'vue';
import path from 'path-browserify';
import ScrollPane from './ScrollPane.vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { CommonRecord } from '@/types';
import Sortable from 'sortablejs';

interface StateReactive {
  visible: boolean;
  top: number;
  left: number;
  selectedTag: CommonRecord;
  affixTags: CommonRecord[];
  visitedViews: ComputedRef<CommonRecord[]>;
  routes: ComputedRef<CommonRecord[]>;
}
export default defineComponent({
  name: 'TagsView',
  components: { ScrollPane },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const state = reactive<StateReactive>({
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      visitedViews: computed(() => store.getters.visitedViews),
      routes: computed(() => store.getters.permission_routes),
    });
    const tag = ref([]);
    const scrollPane = ref();
    const el = ref();
    const sortEl = ref();
    let sortTagsviewRef: any = null;
    const methods = {
      isActive(routeParams: CommonRecord) {
        return routeParams.path === route.path;
      },
      isAffix(tag: CommonRecord) {
        return tag.meta && tag.meta.affix;
      },
      filterAffixTags(routes: CommonRecord[], basePath = '/') {
        let tags: CommonRecord[] = [];
        routes.forEach((route) => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path);
            tags.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta },
            });
          }
          if (route.children) {
            const tempTags = methods.filterAffixTags(route.children, route.path);
            if (tempTags.length >= 1) {
              tags = [...tags, ...tempTags];
            }
          }
        });
        return tags;
      },
      initTags() {
        const affixTags = (state.affixTags = methods.filterAffixTags(state.routes));
        for (const tag of affixTags) {
          // Must have tag name
          if (tag.name) {
            store.dispatch('tagsView/addVisitedView', tag);
          }
        }
      },
      addTags() {
        const { name } = route;
        if (name) {
          store.dispatch('tagsView/addView', route);
        }
        return false;
      },
      moveToCurrentTag() {
        const tags: any = tag.value;
        nextTick(() => {
          for (const tag of tags) {
            if (tag.dataset.path === route.path) {
              scrollPane.value.moveToTarget(tag);
              // when query is different then update
              if (tag.dataset.fullPath !== route.fullPath) {
                store.dispatch('tagsView/updateVisitedView', route);
              }
              break;
            }
          }
        });
      },
      refreshSelectedTag(view: CommonRecord) {
        store.dispatch('tagsView/delCachedView', view).then(() => {
          const { fullPath } = view;
          nextTick(() => {
            router.replace({
              path: '/redirect' + fullPath,
            });
          });
        });
      },
      closeSelectedTag(view: CommonRecord) {
        store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
          if (methods.isActive(view)) {
            methods.toLastView(visitedViews, view);
          }
        });
      },
      closeOthersTags() {
        router.push(state.selectedTag);
        store.dispatch('tagsView/delOthersViews', state.selectedTag).then(() => {
          methods.moveToCurrentTag();
        });
      },
      closeAllTags(view: CommonRecord) {
        store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
          if (state.affixTags.some((tag) => tag.path === view.path)) {
            return;
          }
          methods.toLastView(visitedViews, view);
        });
      },
      toLastView(visitedViews: CommonRecord[], view: CommonRecord) {
        const latestView = visitedViews.slice(-1)[0];
        if (latestView) {
          router.push(latestView.fullPath);
        } else {
          // now the default is to redirect to the home page if there is no tags-view,
          // you can adjust it according to your needs.
          if (view.name === 'Dashboard') {
            // to reload home page
            router.replace({ path: '/redirect' + view.fullPath });
          } else {
            router.push('/');
          }
        }
      },
      openMenu(tag: CommonRecord, e: CommonRecord) {
        const menuMinWidth = 105;
        const offsetLeft = el.value.getBoundingClientRect().left; // container margin left
        const offsetWidth = el.value.offsetWidth; // container width
        const maxLeft = offsetWidth - menuMinWidth; // left boundary
        const left = e.clientX - offsetLeft + 15; // 15: margin right

        if (left > maxLeft) {
          state.left = maxLeft;
        } else {
          state.left = left;
        }

        state.top = e.clientY;
        state.visible = true;
        state.selectedTag = tag;
      },
      closeMenu() {
        state.visible = false;
      },
      handleScroll() {
        methods.closeMenu();
      },
      initSortTagsView() {
        sortTagsviewRef = Sortable.create(sortEl.value, {
          animation: 300,
          dataIdAttr: 'data-path',
          onEnd: () => {
            sortTagsviewRef.toArray().forEach((val: CommonRecord) => {
              // TODO: 排序后可增加逻辑处理
            });
          },
        });
      },
    };
    watch(
      () => route.path,
      () => {
        methods.addTags();
        methods.moveToCurrentTag();
      },
    );
    watch(
      () => state.visible,
      (visible) => {
        if (visible) {
          document.body.addEventListener('click', methods.closeMenu);
        } else {
          document.body.removeEventListener('click', methods.closeMenu);
        }
      },
    );
    onMounted(() => {
      methods.initTags();
      methods.addTags();
      nextTick(() => {
        methods.initSortTagsView();
      });
    });
    return {
      ...toRefs(state),
      ...methods,
      scrollPane,
      sortEl,
      tag,
      el,
    };
  },
});
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      transition: all 0.3s;
      &:hover {
        border-color: #42b983;
        color: #42b983;
      }
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
