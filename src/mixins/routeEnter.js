// NOTE: 所有一级菜单页面，要混入此路由拦截，用以判断是否有权限进入
import store from '@/store'

const route = {
  beforeRouteEnter (to, from, next) {
    // 判断菜单有没有权利进入
    if (store.state.app.pagePaths.includes(to.path)) {
      next()
    } else {
      next('/*')
    }
  }
}

export default route
