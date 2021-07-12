import { onMounted } from 'vue';
import { useStore } from 'vuex';
const useFixIOS = (subMenu: any) => {
  const store = useStore();
  const device = store.getters.device;
  const fixBugIniOS = () => {
    const $subMenu = subMenu;
    if ($subMenu) {
      const handleMouseleave = $subMenu.handleMouseleave;
      $subMenu.handleMouseleave = (e: MouseEvent) => {
        if (device === 'mobile') {
          return;
        }
        handleMouseleave(e);
      };
    }
  };
  onMounted(() => {
    fixBugIniOS();
  });
};

export default useFixIOS;
