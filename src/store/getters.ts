import { StoreStateTypes } from '.';

export default {
  // app
  sidebar: (state: StoreStateTypes) => state.app.sidebar,
  device: (state: StoreStateTypes) => state.app.device,
  // settings
  settings: (state: StoreStateTypes) => state.settings,
  // user
  token: (state: StoreStateTypes) => state.user.token,
  avatar: (state: StoreStateTypes) => state.user.avatar,
  name: (state: StoreStateTypes) => state.user.name,
  roles: (state: StoreStateTypes) => state.user.roles,
  // router
  permission_routes: (state: StoreStateTypes) => state.permission.routes,
  // tag-views
  visitedViews: (state: StoreStateTypes) => state.tagsView.visitedViews,
  cachedViews: (state: StoreStateTypes) => state.tagsView.cachedViews,
};
