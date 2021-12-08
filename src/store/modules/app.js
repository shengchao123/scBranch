import { api } from '@/request/api.js'
import { getGlobalParams } from '@u/login'
import { isEmpty } from '@u/validate'
import { recursionRemoveNullChild } from '@u/tool.js'

// NOTE: 可以自定义菜单
// import temSystem from './system.json'
// {
//   "pageUrl": "/task-overview",
//   "name": "任务完成情况",
//   "icon": "icon-icon_shouye"
// }
const state = {
  isFixedHeader: false, // 固定头部
  isCollapseSidebar: false, // 收起侧边栏
  tagViews: [], // 标题栏
  orgs: [], // 右上角组织列表
  currentOrg: { // 当前选中的组织
    id: '',
    name: ''
  },
  loginUrl: '',
  systemMenu: [], // 系统菜单
  districtTree: [], // 系统菜单
  pagePaths: [] // 系统菜单包含内容
}

const mutations = {
  // 设置是否收折叠导航条
  SET_COLLAPSE_SIDEBAR: (state, isOpened) => {
    state.isCollapseSidebar = isOpened
  },
  // 设置是否固定头部
  SET_FIXED_HEADER: (state, fixedHeader) => {
    state.isFixedHeader = fixedHeader
  },
  // 设置系统菜单
  SET_SYSTEM_MENU: (state, systemMenu) => {
    state.systemMenu = systemMenu
  },
  COMMIT_PATHS: (state, systemMenu) => {
    recursion(systemMenu)
    state.pagePaths = temPaths
  },
  // 设置当前选中的组织
  SET_CURRENT_ORG: (state, content) => {
    state.currentOrg = content
  },
  // 设置组织列表
  SET_ORGS: (state, content) => {
    state.orgs = content
  },
  // 设置地址信息
  SET_DISTRICT_TREE: (state, content) => {
    state.districtTree = recursionRemoveNullChild(content)
  },
  // 设置登录地址
  SET_LOGIN_DOMAIN: (state, content) => {
    state.loginUrl = content
  }
}

const actions = {
  // 获取系统菜单
  setSystemMenu ({ commit }, moduleRoleId) {
    const params = {
      moduleRoleId: moduleRoleId || getGlobalParams('moduleRoleId')
    }
    api.findSysMenuByModuleCode(params).then(res => {
      if (!res || res.isError) return
      commit('SET_SYSTEM_MENU', res.content)
      commit('COMMIT_PATHS', res.content)
    })
  },
  // 获取省市区地址信息
  setDistrictTree ({ commit }) {
    api.findDistrictTree().then(res => {
      if (!res || res.isError) return
      commit('SET_DISTRICT_TREE', res.content)
    })
  },
  // 设置登录跳转信息
  setFindLoginUriAndSsoDomain ({ commit }) {
    api.findLoginUriAndSsoDomain().then(res => {
      if (!res || res.isError) return
      commit('SET_LOGIN_DOMAIN', res.content.loginUri)
    })
  },
  // 设置组织树
  setOrgs ({ commit }, content) {
    api.findSubstantiveOrganizationTreeByUser().then(res => {
      if (!res || res.isError) return
      commit('SET_ORGS', [res.content])
      if (isEmpty(state.currentOrg.id)) {
        const currentOrg = {
          id: res.content.id,
          name: res.content.name
        }
        commit('SET_CURRENT_ORG', currentOrg)
      }
    })
  }
}
const temPaths = []
export function recursion (children) {
  if (!children) {
    return
  }
  children.forEach(item => {
    temPaths.push(item.pageUrl)
    recursion(item.children)
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
