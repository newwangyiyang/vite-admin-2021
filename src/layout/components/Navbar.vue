<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item" />
      </template>

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item> Home </el-dropdown-item>
            </router-link>
            <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item divided command="logout">
              <span style="display: block">Log Out</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumb from '@/components/Breadcrumb/index.vue';
import Hamburger from '@/components/Hamburger/index.vue';
import Search from '@/components/HeaderSearch/index.vue';
import Screenfull from '@/components/Screenfull/index.vue';

export default defineComponent({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    Search,
    Screenfull,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const methods = {
      toggleSideBar() {
        store.dispatch('app/toggleSideBar');
      },
      handleCommand(command: string) {
        if (command === 'logout') {
          methods.logout();
        }
      },
      async logout() {
        await store.dispatch('user/logout');
        router.push(`/login?redirect=${route.fullPath}`);
      },
    };
    return {
      ...methods,
      sidebar: computed(() => store.getters.sidebar),
      avatar: computed(() => store.getters.avatar),
      device: computed(() => store.getters.device),
    };
  },
});
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    :deep(.el-dropdown) {
      margin-right: 30px;
      display: inline-block;
      padding: 5px 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
