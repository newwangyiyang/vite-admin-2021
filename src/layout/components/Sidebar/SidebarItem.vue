<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
          <template #title>
            <span v-if="onlyOneChild.meta.title">{{ onlyOneChild.meta.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" />
        <span v-if="item.meta.title">{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import path from 'path-browserify';
import { isExternal } from '@/utils/validate';
import Item from './Item.vue';
import AppLink from './Link.vue';
import useFixIOS from './useFixIOS';
import { CommonRecord } from '@/types';

export default defineComponent({
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const onlyOneChild = ref<CommonRecord | null>(null);
    const subMenu = ref();
    useFixIOS(subMenu.value);
    const methods = {
      resolvePath(routePath: string) {
        if (isExternal(routePath)) {
          return routePath;
        }
        if (isExternal(props.basePath)) {
          return props.basePath;
        }
        return path.resolve(props.basePath, routePath);
      },
      hasOneShowingChild(children: CommonRecord[] = [], parent: {}) {
        const showingChildren = children.filter((item) => {
          if (item.hidden) {
            return false;
          } else {
            // Temp set(will be used if only has one showing child)
            onlyOneChild.value = item;
            return true;
          }
        });

        // When there is only one child router, the child router is displayed by default
        if (showingChildren.length === 1) {
          return true;
        }

        // Show parent if there are no child router to display
        if (showingChildren.length === 0) {
          onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
          return true;
        }

        return false;
      },
    };

    return {
      subMenu,
      onlyOneChild,
      ...methods,
    };
  },
});
</script>
