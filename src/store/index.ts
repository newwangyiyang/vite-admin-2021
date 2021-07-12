import { createStore } from 'vuex';
import getters from './getters';
import { AppState } from './modules/app';
import { PermissionState } from './modules/permission';
import { SettingsState } from './modules/settings';
import { TagsViewState } from './modules/tagsView';
import { UserState } from './modules/user';

// store 顶级接口
export interface StoreStateTypes {
  app: AppState;
  permission: PermissionState;
  settings: SettingsState;
  tagsView: TagsViewState;
  user: UserState;
}

// Vite supports importing multiple modules from the file system using the special import.meta.glob function
// see https://cn.vitejs.dev/guide/features.html#glob-import
const modulesFiles = import.meta.globEager('./modules/*.ts');
const pathList: string[] = [];

for (const path in modulesFiles) {
  pathList.push(path);
}

const modules = pathList.reduce((modules: { [x: string]: any }, modulePath: string) => {
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1');
  const value = modulesFiles[modulePath];
  modules[moduleName] = value.default;
  return modules;
}, {});

const store = createStore<StoreStateTypes>({ modules, getters });

export default store;
