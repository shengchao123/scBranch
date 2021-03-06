import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './directives.js'
import '@/router/filter.js'
import '@/plugins'
import '@/request/api.js'
import '@/components'
import '@/utils'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
