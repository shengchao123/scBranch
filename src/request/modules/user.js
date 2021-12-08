import request from '../index'
import { getGlobalParams } from '@u/login'
import settings from '@/config.js'

export function getToken (params) { // 获取 token
  params.append('appid', 'browser')
  params.append('grant_type', 'authorization_code')
  params.append('abbreviation', settings.abbreviation)
  return request({
    url: '/sso/auth/oauth/token',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: params
  })
}

export function logout () { // 退出登录
  const formData = new FormData()
  formData.append('access_token', getGlobalParams('access_token'))
  return request({
    url: '/sso/auth/logout',
    method: 'post',
    data: formData
  })
}

export function findUserAuth (params) { // 用户登录的操作权限列表
  return request({
    url: '/user/user/findUserAuth',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function findUserConfig (params) { // 获取用户设置
  return request({
    url: '/user/userConfig/findUserConfig',
    method: 'post',
    data: {
      moduleRoleId: getGlobalParams('moduleRoleId')
    }
  })
}

export function updateModuleUserInfoById (params) { // 更新用户信息
  return request({
    url: '/user/user/updateModuleUserInfoById',
    method: 'post',
    data: params
  })
}

export function updateUserPassword (params) { // 更新用户密码
  return request({
    url: '/user/user/updateUserPassword',
    method: 'post',
    data: params
  })
}

export function findUserInfoById (params) { // 获取用户信息
  return request({
    url: '/user/user/findUserInfoById',
    method: 'post',
    data: params
  })
}

export function saveUserMenuSetting (params) { // 保存用户快捷菜单设置
  return request({
    url: '/user/userMenuSetting/saveUserMenuSetting4Batch',
    method: 'post',
    data: params
  })
}

export function updateShortcutStatus (params) { // 用户快捷菜单设置
  return request({
    url: '/user/userSysSetting/updateShortcutStatus',
    method: 'post',
    data: params
  })
}

export function userLogsByCurrentLogin (params) { // 用户当前登录后的操作日志
  return request({
    url: '/log/userLog/userLogsByCurrentLogin',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function updateModuleCustom (params) { // 更新主题设置
  return request({
    url: '/user/userModuleCustom/updateModuleCustom',
    method: 'post',
    data: params
  })
}
