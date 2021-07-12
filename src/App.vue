<template>
  <router-view v-show="!isLockScreen" />
  <lock-screen v-if="settings.enableLockScreen" :isLockScreen="isLockScreen" @changeIsLockScreen="changeIsLockScreen" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useStore } from 'vuex';
import LockScreen from '@/components/LockScreen/index.vue';
export default defineComponent({
  name: 'App',
  components: {
    LockScreen,
  },
  setup() {
    const store = useStore();
    const state = reactive({
      isLockScreen: false,
    });
    const settings = store.getters.settings;
    const methods = {
      changeIsLockScreen(locked: boolean) {
        state.isLockScreen = locked;
      },
    };
    return {
      ...toRefs(state),
      ...methods,
      settings: computed(() => settings),
    };
  },
});
</script>
