import Vue from 'vue'
import { urls, fileHost } from './urls'
import * as user from './modules/user'
import * as app from './modules/app'
import * as msg from './modules/msg'
// TODO: 【初始化】：5.是否启用平台管理
import * as platform from './modules/platform'
export const api = {
  ...platform,
  ...user,
  ...app,
  ...msg
}

Vue.prototype.$fileHost = fileHost
Vue.prototype.$api = api
Vue.prototype.$urls = urls
