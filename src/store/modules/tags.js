const state = {
  tagViews: [], // 标题栏
  cachedViews: []
}

const mutations = {
  ADD_TAG_VIEWS: (state, content) => {
    if (state.tagViews.some(v => v.path === content.path)) return
    state.tagViews.push(
      Object.assign({}, content, {
        title: content.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: (state, content) => {
    if (state.cachedViews.includes(content.name)) return
    if (!content.meta.noCache) {
      state.cachedViews.push(content.name)
    }
  },
  DEL_TAG_VIEWS: (state, content) => {
    for (const [i, v] of state.tagViews.entries()) {
      if (v.path === content.path) {
        state.tagViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, content) => {
    const index = state.cachedViews.indexOf(content.name)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  DEL_OTHERS_TAG_VIEWS: (state, content) => {
    state.tagViews = state.tagViews.filter(v => {
      return v.meta.affix || v.path === content.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, content) => {
    const index = state.cachedViews.indexOf(content.name)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      state.cachedViews = []
    }
  },

  DEL_ALL_TAG_VIEWS: state => {
    // keep affix tags
    const affixTags = state.tagViews.filter(tag => tag.meta.affix)
    state.tagViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },

  UPDATE_TAG_VIEWS: (state, content) => {
    for (let v of state.tagViews) {
      if (v.path === content.path) {
        v = Object.assign(v, content)
        break
      }
    }
  }

}

const actions = {
  addView ({ dispatch }, tag) {
    dispatch('addVisitedView', tag)
    dispatch('addCachedView', tag)
  },
  addVisitedView ({ commit }, tag) {
    commit('ADD_TAG_VIEWS', tag)
  },
  addCachedView ({ commit }, tag) {
    commit('ADD_CACHED_VIEW', tag)
  },
  delView ({ dispatch, state }, tag) {
    return new Promise(resolve => {
      dispatch('delVisitedView', tag)
      dispatch('delCachedView', tag)
      resolve({
        tagViews: [...state.tagViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delVisitedView ({ commit, state }, tag) {
    return new Promise(resolve => {
      commit('DEL_TAG_VIEWS', tag)
      resolve([...state.tagViews])
    })
  },
  delCachedView ({ commit, state }, tag) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', tag)
      resolve([...state.cachedViews])
    })
  },
  delOthersViews ({ dispatch, state }, tag) {
    return new Promise(resolve => {
      dispatch('delOthersVisitedViews', tag)
      dispatch('delOthersCachedViews', tag)
      resolve({
        tagViews: [...state.tagViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delOthersVisitedViews ({ commit, state }, tag) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_TAG_VIEWS', tag)
      resolve([...state.tagViews])
    })
  },
  delOthersCachedViews ({ commit, state }, tag) {
    return new Promise(resolve => {
      commit('DEL_OTHERS_CACHED_VIEWS', tag)
      resolve([...state.cachedViews])
    })
  },

  delAllViews ({ dispatch, state }, tag) {
    return new Promise(resolve => {
      dispatch('delAllVisitedViews', tag)
      dispatch('delAllCachedViews', tag)
      resolve({
        tagViews: [...state.tagViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  delAllVisitedViews ({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_TAG_VIEWS')
      resolve([...state.tagViews])
    })
  },
  delAllCachedViews ({ commit, state }) {
    return new Promise(resolve => {
      commit('DEL_ALL_CACHED_VIEWS')
      resolve([...state.cachedViews])
    })
  },
  updateVisitedView ({ commit }, tag) {
    commit('UPDATE_TAG_VIEWS', tag)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
