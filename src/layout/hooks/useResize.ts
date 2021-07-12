import { useStore } from 'vuex';
import { onBeforeMount, onBeforeUnmount, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const { body } = document;
const WIDTH = 992; // refer to Bootstrap's responsive design

const useResize = () => {
  const store = useStore();
  const route = useRoute();
  const device = computed(() => store.getters.device);
  const sidebar = computed(() => store.getters.sidebar);
  watch(
    () => route.path,
    () => {
      if (device.value === 'mobile' && sidebar.value.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false });
      }
    },
  );
  const methods = {
    $_isMobile() {
      const rect = body.getBoundingClientRect();
      return rect.width - 1 < WIDTH;
    },
    $_resizeHandler() {
      if (!document.hidden) {
        const isMobile = methods.$_isMobile();
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop');
        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true });
        }
      }
    },
  };
  onBeforeMount(() => {
    window.addEventListener('resize', methods.$_resizeHandler);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', methods.$_resizeHandler);
  });
  onMounted(() => {
    const isMobile = methods.$_isMobile();
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile');
      store.dispatch('app/closeSideBar', { withoutAnimation: true });
    }
  });
};

export default useResize;
