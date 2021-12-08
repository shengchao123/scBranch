import { api } from '@/request/api.js'

const state = {
  platformOrg: {
    id: '',
    name: ''
  },
  orgs: [],
  organizationClass: [],
  organizationLabel: []
}

const mutations = {
  SET_CURRENT_ORGANIZATION: (state, content) => {
    state.platformOrg = content
  },
  SET_ORGS: (state, content) => {
    state.orgs = content
  },
  SET_ORGANIZATION_CLASS: (state, content) => {
    state.organizationClass = content
  },
  SET_ORGANIZATION_LABEL: (state, content) => {
    state.organizationLabel = content
  }
}

const actions = {
  setOrganizationClass ({ commit }, content) {
    api.findOrgClassEnList().then(res => {
      if (res.isError) return
      commit('SET_ORGANIZATION_CLASS', res.content)
    })
  },
  setPlatformTree ({ commit }, content) {
    api.platformFindOrganizationFilterTree().then(res => {
      if (res.isError) return
      const currentOrg = {
        id: res.content.id,
        name: res.content.name
      }
      commit('SET_CURRENT_ORGANIZATION', currentOrg)
      commit('SET_ORGS', [res.content])
    })
  },
  setOrganizationLabel ({ commit }, content) {
    api.findOrgLabelEnList().then(res => {
      if (res.isError) return
      commit('SET_ORGANIZATION_LABEL', res.content)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
