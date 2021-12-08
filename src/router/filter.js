import router from '../router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { api } from '@/request/api.js'
// import { goLogin, setCiphertext, getGlobalParams, setGlobalParams } from '@u/login'
import config from '@/config.js'
import { clearPending } from '@/request/cancel.js'
import { escapeUrl } from '@/utils/tool.js'

const tokenErrorSubCode = ['CODE_INVALID', 'NOT_GENERATE']

router.beforeEach(async (to, from, next) => {
  // 清除队列中的请求
  clearPending()
  // start progress bar
  NProgress.start()

  document.title = config.title + '-' + to.meta.title
  if (to.query.auth_code) {
    const formData = new FormData()
    let splitKey = '?'
    if (location.href.includes('&auth_code=')) {
      splitKey = '&auth_code='
    }
    formData.append('code', to.query.auth_code)
    formData.append('redirect_uri', location.href.split(splitKey)[0])
    api.getToken(formData).then(res => {
      if (tokenErrorSubCode.includes(res.subCode)) {
        // goLogin()
        return
      }
      // setCiphertext(res.content)
      if (to.path !== '/' && to.path !== '/home') {
        // 分离删除 auth_code
        let targetPath = to.fullPath.split('&auth_code=')[0]
        targetPath = escapeUrl(targetPath)
        // 跳转过来的系统，orgId 替换
        const { resetOrgId, moduleRoleId } = to.query
        if (resetOrgId) {
          // setGlobalParams('orgId', resetOrgId)
          // setGlobalParams('moduleRoleId', moduleRoleId)
        }
        next(targetPath)
      } else {
        next('/')
      }
    })
  } else {
    // if (getGlobalParams('access_token')) {
    //   // 跳转过来的系统，orgId 替换
    //   const { resetOrgId, moduleRoleId } = to.query
    //   if (resetOrgId) {
    //     setGlobalParams('orgId', resetOrgId)
    //     setGlobalParams('moduleRoleId', moduleRoleId)
    //   }
    //   next()
    // } else {
    //   goLogin()
    // }
  }
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done()
})
