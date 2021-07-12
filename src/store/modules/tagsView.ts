import { ActionContext, Module } from 'vuex';
import { StoreStateTypes } from '..';

type ViewRecord = Record<string, any>;
export interface TagsViewState {
  visitedViews: ViewRecord[];
  cachedViews: ViewRecord[];
}
const state: TagsViewState = {
  visitedViews: [],
  cachedViews: [],
};

const mutations = {
  ADD_VISITED_VIEW: (state: TagsViewState, view: ViewRecord) => {
    if (state.visitedViews.some((v) => v.path === view.path)) return;
    state.visitedViews.push({ ...view, title: view.meta.title || 'no-name' });
  },
  ADD_CACHED_VIEW: (state: TagsViewState, view: ViewRecord) => {
    if (state.cachedViews.includes(view.name)) return;
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name);
    }
  },

  DEL_VISITED_VIEW: (state: TagsViewState, view: ViewRecord) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  DEL_CACHED_VIEW: (state: TagsViewState, view: ViewRecord) => {
    const index = state.cachedViews.indexOf(view.name);
    index > -1 && state.cachedViews.splice(index, 1);
  },

  DEL_OTHERS_VISITED_VIEWS: (state: TagsViewState, view: ViewRecord) => {
    state.visitedViews = state.visitedViews.filter((v) => {
      return v.meta.affix || v.path === view.path;
    });
  },
  DEL_OTHERS_CACHED_VIEWS: (state: TagsViewState, view: ViewRecord) => {
    const index = state.cachedViews.indexOf(view.name);
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1);
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = [];
    }
  },

  DEL_ALL_VISITED_VIEWS: (state: TagsViewState) => {
    // keep affix tags
    const affixTags = state.visitedViews.filter((tag) => tag.meta.affix);
    state.visitedViews = affixTags;
  },
  DEL_ALL_CACHED_VIEWS: (state: TagsViewState) => {
    state.cachedViews = [];
  },

  UPDATE_VISITED_VIEW: (state: TagsViewState, view: ViewRecord) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  },
};

type TagsViewActionContext = ActionContext<TagsViewState, StoreStateTypes>;
const actions = {
  addView({ dispatch }: TagsViewActionContext, view: ViewRecord) {
    dispatch('addVisitedView', view);
    dispatch('addCachedView', view);
  },
  addVisitedView({ commit }: TagsViewActionContext, view: ViewRecord) {
    commit('ADD_VISITED_VIEW', view);
  },
  addCachedView({ commit }: TagsViewActionContext, view: ViewRecord) {
    commit('ADD_CACHED_VIEW', view);
  },

  delView({ dispatch, state }: TagsViewActionContext, view: ViewRecord) {
    return new Promise((resolve) => {
      dispatch('delVisitedView', view);
      dispatch('delCachedView', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delVisitedView({ commit, state }: TagsViewActionContext, view: ViewRecord) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEW', view);
      resolve([...state.visitedViews]);
    });
  },
  delCachedView({ commit, state }: TagsViewActionContext, view: ViewRecord) {
    return new Promise((resolve) => {
      commit('DEL_CACHED_VIEW', view);
      resolve([...state.cachedViews]);
    });
  },

  delOthersViews({ dispatch, state }: TagsViewActionContext, view: ViewRecord) {
    return new Promise((resolve) => {
      dispatch('delOthersVisitedViews', view);
      dispatch('delOthersCachedViews', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delOthersVisitedViews({ commit, state }: TagsViewActionContext, view: ViewRecord) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_VISITED_VIEWS', view);
      resolve([...state.visitedViews]);
    });
  },
  delOthersCachedViews({ commit, state }: TagsViewActionContext, view: ViewRecord) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_CACHED_VIEWS', view);
      resolve([...state.cachedViews]);
    });
  },

  delAllViews({ dispatch, state }: TagsViewActionContext, view: ViewRecord) {
    return new Promise((resolve) => {
      dispatch('delAllVisitedViews', view);
      dispatch('delAllCachedViews', view);
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews],
      });
    });
  },
  delAllVisitedViews({ commit, state }: TagsViewActionContext) {
    return new Promise((resolve) => {
      commit('DEL_ALL_VISITED_VIEWS');
      resolve([...state.visitedViews]);
    });
  },
  delAllCachedViews({ commit, state }: TagsViewActionContext) {
    return new Promise((resolve) => {
      commit('DEL_ALL_CACHED_VIEWS');
      resolve([...state.cachedViews]);
    });
  },

  updateVisitedView({ commit }: TagsViewActionContext, view: ViewRecord) {
    commit('UPDATE_VISITED_VIEW', view);
  },
};

const tagsViewStore: Module<TagsViewState, StoreStateTypes> = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default tagsViewStore;
