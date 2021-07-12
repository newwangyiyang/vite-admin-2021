import { asyncRoutes, constantRoutes } from '@/router';
import { CommonRecord } from '@/types';
import { ActionContext, Module } from 'vuex';
import { StoreStateTypes } from '..';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: string[], route: CommonRecord) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: CommonRecord[], roles: string[]) {
  const res: CommonRecord[] = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

export interface PermissionState {
  routes: CommonRecord[];
  addRoutes: CommonRecord[];
}
const state: PermissionState = {
  routes: [],
  addRoutes: [],
};

const mutations = {
  SET_ROUTES: (state: PermissionState, routes: CommonRecord[]) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes as any);
  },
};

type PermissionActionContext = ActionContext<PermissionState, StoreStateTypes>;
const actions = {
  generateRoutes({ commit }: PermissionActionContext, roles: string[]) {
    return new Promise((resolve) => {
      let accessedRoutes;
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  },
};

const permissionStore: Module<PermissionState, StoreStateTypes> = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default permissionStore;
