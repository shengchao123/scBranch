
/* eslint-disable */
import { api } from '@/request/api.js'
import { isEmpty } from '@u/validate'

const state = {
  userLimit: [],
  userName: '',
  styleSetting: [],
  avatarBgImg: '', // 头像背景图
  homeBg: '', // 首页背景图
  shortcuts: [],
  primaryColor: '#518CFC',
  isShowShortcut: false
}

const mutations = {
  SET_USER_NAME: (state, content) => {
    state.userName = content
  },
  SET_USER_LIMIT: (state, content) => {
    state.userLimit = content
  },
  SET_STYLE_SETTING: (state, styleSetting) => {
    state.styleSetting = styleSetting
  },
  SET_AVATAR_BG_IMG: (state, avatarBgImg) => {
    state.avatarBgImg = avatarBgImg
  },
  SET_HOME_BG_IMG: (state, homeBg) => {
    state.homeBg = homeBg
  },
  SET_SHORTCUT: (state, shortcuts) => {
    state.shortcuts = shortcuts
  },
  SET_SHORTCUT_STATUS: (state, isShowShortcut) => {
    state.isShowShortcut = isShowShortcut === '1'
  },
  SET_PRIMARY_COLOR: (state, primaryColor) => {
    state.primaryColor = primaryColor
  }
}

const actions = {
  // 用户权限
  setUserLimitList ({ commit }, content) {
    api.findUserAuth().then(res => {
      let authList = res?.content?.authList
      if (authList) {
        authList = authList.map(item => {
          if (item && item.apiUrl.indexOf('/') !== 0) {
            return '/' + item.apiUrl
          }
          return item.apiUrl
        })
      }

      if (authList === null || authList === 'null') authList = ['all']
      commit('SET_USER_LIMIT', authList)
    })
  },

  // 设置主题中其它内容
  commitThemes({ commit }, theme) {
    commit('SET_AVATAR_BG_IMG', theme.avatarBgImg)
    commit('SET_HOME_BG_IMG', theme.homeBg)
    commit('SET_PRIMARY_COLOR', theme.colorPrimary)
  },
  // 设置主题
  setTheme ({ dispatch, commit }, theme) {
    dispatch('commitThemes', theme)
    const wipeKeys = ['avatarBgImg', 'homeBg']
    for (const key in theme) {
      if (!wipeKeys.includes(key)) {
        setCssProperty('--' + key, theme[key])
      }
    }
  },
  // 获取用户设置配置
  setUserConfig ({ dispatch, commit }) {
    api.findUserConfig({}).then(res => {
      if (!res || res.isError) return
      const { systemSetting, menuSetting, styleSetting } = res.content

      if (!isEmpty(styleSetting)) {
        const sidebarStatus = styleSetting[1].components[0].componentValue === '1'
        const fixedHeader = styleSetting[1].components[1].componentValue === '1'
        commit('app/SET_COLLAPSE_SIDEBAR', sidebarStatus, { root: true })
        commit('app/SET_FIXED_HEADER', fixedHeader, { root: true })

        styleSetting[2].components[0].options = styleSetting[2].components[0].options.map(item => {
          item.value = JSON.parse(item.value)
          if (item.isCheck || item.isDefault) {
            dispatch('commitThemes', item.value)
            dispatch('setTheme', item.value)
          }
          return item
        })
        commit('SET_STYLE_SETTING', styleSetting)
      }

      if (!isEmpty(systemSetting)) {
        commit('SET_SHORTCUT_STATUS', systemSetting[0].settingValue)
      }

      if (!isEmpty(menuSetting)) {
        commit('SET_SHORTCUT', menuSetting)
        window.localStorage.setItem('shortcutIds', menuSetting.map(item => item.id))
      } else {
        window.localStorage.removeItem('shortcutIds')
        commit('SET_SHORTCUT', [])
      }
    })
  }
}

function setCssProperty (color, val) {
  document.getElementsByTagName('body')[0].style.setProperty(color, val)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
