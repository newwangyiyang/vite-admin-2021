import defaultSettings from '@/settings';
import { ActionContext, Module } from 'vuex';
import { StoreStateTypes } from '..';
const { showSettings, fixedHeader, sidebarLogo, needTagsView, enableLockScreen } = defaultSettings;

export interface SettingsState {
  showSettings: boolean;
  fixedHeader: boolean;
  sidebarLogo: boolean;
  needTagsView: boolean;
  enableLockScreen: boolean;
}
const state: SettingsState = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  needTagsView: needTagsView,
  enableLockScreen: enableLockScreen,
};
interface ChangeSettingsParams {
  key: string;
  value: boolean;
}
const mutations = {
  CHANGE_SETTING: (state: SettingsState, { key, value }: ChangeSettingsParams) => {
    if (state.hasOwnProperty(key)) {
      const k = key as keyof SettingsState;
      state[k] = value;
    }
  },
  CHANGE_FIXED_HEADER(state: SettingsState, value: boolean) {
    state.fixedHeader = value;
  },
};

type SettingsActionContext = ActionContext<SettingsState, StoreStateTypes>;
const actions = {
  changeSetting({ commit }: SettingsActionContext, data: ChangeSettingsParams) {
    commit('CHANGE_SETTING', data);
  },
  changeFixedHeader({ commit }: SettingsActionContext, value: boolean) {
    commit('CHANGE_FIXED_HEADER', value);
  },
};

const SettingsStore: Module<SettingsState, StoreStateTypes> = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default SettingsStore;
