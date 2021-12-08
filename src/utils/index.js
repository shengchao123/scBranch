import Vue from 'vue'
import bus from '@u/bus.js'

import { hasAuth } from './auth'
import { isEmpty } from './validate'
import { deleteObjectEmptyAttr } from './tool.js'

Vue.use(bus)
Vue.prototype.$hasAuth = hasAuth
Vue.prototype.$isEmpty = isEmpty
Vue.prototype.$deleteObjectEmptyAttr = deleteObjectEmptyAttr
