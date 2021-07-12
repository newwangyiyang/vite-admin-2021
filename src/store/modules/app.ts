import Cookies from 'js-cookie';
import { Action, ActionContext, Module } from 'vuex';
import { StoreStateTypes } from '..';
export interface AppState {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
  device: string;
}
export enum SidebarStatus {
  open = '1',
  close = '0',
}

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!Number(Cookies.get('sidebarStatus')) : true,
    withoutAnimation: false,
  },
  device: 'desktop',
};

const mutations = {
  TOGGLE_SIDEBAR: (state: AppState) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', SidebarStatus.open);
    } else {
      Cookies.set('sidebarStatus', SidebarStatus.close);
    }
  },
  CLOSE_SIDEBAR: (state: AppState, withoutAnimation: boolean) => {
    Cookies.set('sidebarStatus', SidebarStatus.close);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state: AppState, device: string) => {
    state.device = device;
  },
};

type AppActionContext = ActionContext<AppState, StoreStateTypes>;
const actions = {
  toggleSideBar({ commit }: AppActionContext) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }: AppActionContext, { withoutAnimation }: { withoutAnimation: boolean }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }: AppActionContext, device: string) {
    commit('TOGGLE_DEVICE', device);
  },
};

const appStore: Module<AppState, StoreStateTypes> = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default appStore;
