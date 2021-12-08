import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { getGlobalParams, goLogin } from '@u/login.js'
import { removePending, addPending } from './cancel.js'
import { urls } from './urls'

const pendingWhiteList = []

const service = axios.create({
  withCredentials: true,
  timeout: 10000
})

// 获取本地请求头需要的参数
const headersKeys = {
  authToken: 'access_token',
  masterOrgId: 'masterOrgId',
  moduleCode: 'moduleCode',
  appCode: 'appCode'
}

service.interceptors.request.use(
  config => {
    if (!pendingWhiteList.includes(config.url)) {
      removePending(config) // 在请求开始前，对之前的请求做检查取消操作
      addPending(config) // 将当前请求添加到 pending 中
    }

    // 代理匹配，sso 是认证中心代理，api 是正常请求代理
    if (config.url.search('/sso/') === -1) {
      config.url = '/api' + config.url
    }
    for (const key in headersKeys) {
      config.headers[key] = getGlobalParams(headersKeys[key]) || ''
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 报错锁
let errorLock = false

service.interceptors.response.use(
  response => {
    removePending(response) // 在请求结束后，移除本次请求
    errorLock = false
    const res = response.data
    const resType = response.config.responseType
    const types = ['blob', 'arraybuffer']

    // 返回数据流，直接返回
    if (types.includes(resType)) return response
    // 错误处理
    res.isError = res.code !== 10000
    return res
  },
  error => {
    if (axios.isCancel(error)) {
      console.log('【重复请求】repeated request: ' + error.message)
      return { isError: true }
    }
    // 报错锁，保证报错只显示一次
    if (errorLock) return { isError: true }
    // 没有错误返回
    const res = error.response

    if (res.status !== 401) {
      Message.error(errorMap.get(res.status))
      errorLock = true
      return { isError: true }
    }

    const errorSubCode = error?.response?.data?.subCode ?? null
    const subCodes = ['TOKEN_EXPIRED', 'TOKEN_NULL']

    if (subCodes.includes(errorSubCode)) {
      MessageBox.confirm(
        '您的登录已过期，请重新登录',
        {
          confirmButtonText: '重新登录',
          showClose: false,
          center: true,
          showCancelButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }
      ).then(() => {
        goLogin()
      })
      errorLock = true
    }
  }
)

const errorMap = new Map([
  [400, '错误请求'],
  [401, '登录过期，请重新登录'],
  [403, '请求拒绝访问'],
  [404, '请求错误，无法找到资源'],
  [405, '请求方法不被允许'],
  [408, '请求超时'],
  [500, '服务端报错'],
  [501, '网络未实现'],
  [502, '网络错误'],
  [503, '服务不可用'],
  [504, '网络超时'],
  [505, 'http 版本不支持该请求']
])

export default service
