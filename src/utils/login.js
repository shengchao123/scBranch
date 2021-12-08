// import { api } from '@/request/api.js'
// import config from '@/config.js'
// import store from '@/store'

// export function logout () {
//   api.logout().then(res => {
//     goLogin()
//   })
// }

// export function goLogin () {
//   const loginUrl = store.state.app.loginUrl
//   if (!loginUrl) {
//     api.findLoginUriAndSsoDomain().then(res => {
//       if (!res || res.isError) return
//       store.commit('app/SET_LOGIN_DOMAIN', res.content.loginUri)
//       jumpToLogin()
//     })
//     return
//   }

//   jumpToLogin()
// }
// // 跳转重新登录
// function jumpToLogin () {
//   const masterOrgId = getGlobalParams('masterOrgId')
//   if (process.env.NODE_ENV === 'development') return
//   window.location.href = `${store.state.app.loginUrl}initialization?redirect_uri=${config.abbreviation}&masterOrgId=${masterOrgId}`
// }

// // 跳转其它系统
// export function jumpOtherApp (abbreviation, page) {
//   if (!page) return console.log('必要信息没传')

//   const masterOrgId = getGlobalParams('masterOrgId')
//   const needParams = `resetOrgId=${getGlobalParams('orgId')}&moduleRoleId=${getGlobalParams('moduleRoleId')}`

//   page += (page.includes('?') ? '&' : '?') + needParams
//   page = page.replace(/&/g, 'A1B2C3')
//   const otherAppUrl = `${store.state.app.loginUrl}initialization?redirect_uri=${abbreviation}&masterOrgId=${masterOrgId}&page=${page}`
//   window.open(otherAppUrl)
// }

// // 获取后台存在本地的参数
// export function getGlobalParams (args) {
//   const ciphertext = localStorage.getItem(config.localStorageKey)
//   if (!ciphertext) return
//   const temData = window.atob(ciphertext)
//   const params = JSON.parse(temData)
//   const returnData = {}
//   if (args instanceof Array) {
//     args.forEach(item => {
//       returnData[item] = params[item]
//     })
//     return returnData
//   }
//   if (typeof args === 'string') {
//     return params[args]
//   }
//   return params
// }

// // 存储修改全局参数
// export function setGlobalParams (key, value) {
//   const temData = window.atob(localStorage.getItem(config.localStorageKey))
//   const params = JSON.parse(temData)
//   params[key] = value
//   const ciphertext = window.btoa(JSON.stringify(params))
//   localStorage.setItem(config.localStorageKey, ciphertext)
// }
// // 存储请求所需要的值
// export function setCiphertext (res) {
//   const params = {}
//   config.localKeys.forEach(key => {
//     params[key] = res[key] || ''
//   })
//   window.localStorage.setItem('loginTime', new Date().getTime())
//   const ciphertext = window.btoa(JSON.stringify(params))
//   localStorage.setItem(config.localStorageKey, ciphertext)
// }
