import Vue from 'vue'
import Router from 'vue-router'

// TODO: 【初始化】：6.是否启用平台管理
// import platform from './platform'

Vue.use(Router)

// 动态读取 modules 中文件
let configRouters = []
const modulesFiles = require.context('./modules', true, /\.js$/)
modulesFiles.keys().forEach(key => {
  const temRouters = modulesFiles(key).default
  configRouters = configRouters.concat(temRouters)
  console.log(configRouters)
})

const constantRoutes = [
  // ...platform,
  ...configRouters
]

// 路由跳转抛出异常
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
