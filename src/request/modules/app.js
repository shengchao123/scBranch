import request from '../index'
import { getGlobalParams } from '@u/login'
import axios from 'axios'
import { Message } from 'element-ui'

export function findSubstantiveOrganizationTreeByUser () { // 商城项目右上角组织树
  return request({
    url: '/organization/org/findSubstantiveOrganizationTreeByUser',
    method: 'post',
    data: {}
  })
}

export function findLoginUriAndSsoDomain () { // 获取登录地址域名
  return request({
    url: '/setting/oauth/findLoginUriAndSsoDomain',
    method: 'post',
    data: {}
  })
}

export function findSysMenuByModuleCode (params) { // 获取菜单列表
  return request({
    url: '/setting/sysMenu/findSysMenuByModuleCode',
    method: 'post',
    data: {
      orgId: getGlobalParams('orgId'),
      ...params
    }
  })
}
export function findDistrictTree () { // 获取省市区地址信息
  return request({
    url: '/setting/district/findDistrictTree',
    method: 'post',
    data: {}
  })
}
// —————————————— 上传企业 Logo
const uploadUrls = new Map([
  ['a', '/api/file/fileUpload/uploadAvatar'], // 上传头像
  ['e', '/api/file/fileUpload/uploadExcel'], // 上传 excel
  ['l', '/api/file/fileUpload/uploadLogo'], // 上传 企业 logo
  ['m', '/api/file/fileUpload/uploadMaterial'] // 上传素材
])

// ——————————————————  上传文件接口
// a: 头像，l: 公司 logo，m: 素材上传
// 素材上传 type: 2: 图片，3: 视频，4: 音频
export function uploadFile (config) { // 上传图片
  const temConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
      authToken: getGlobalParams('access_token'),
      masterOrgId: getGlobalParams('masterOrgId'),
      moduleCode: getGlobalParams('moduleCode'),
      appCode: getGlobalParams('appCode')
    }
  }

  const formData = new FormData()
  formData.append('files', config.file)

  if (config.uploadType === 'm') {
    formData.append('type', config.fileType)
  }
  const url = uploadUrls.get(config.uploadType)

  return new Promise((resolve, reject) => {
    axios.post(url, formData, temConfig).then(res => {
      if (res.data.code === 10000) {
        const filePaths = res.data.content.filePaths
        resolve(filePaths)
      } else {
        Message.error('资源上传失败，请稍后重新上传')
      }
    })
  })
}

// ———————————————— 大视频上传到阿里云

export function exportExcel (params, url = '/api/crm/export/exportGrowthRecord') { // 导出表格
  const temConfig = {
    headers: {
      'Content-Type': 'application/json; application/octet-stream',
      authToken: getGlobalParams('access_token'),
      masterOrgId: getGlobalParams('masterOrgId'),
      moduleCode: getGlobalParams('moduleCode'),
      appCode: getGlobalParams('appCode')
    },
    responseType: 'arraybuffer'
  }
  return new Promise((resolve, reject) => {
    axios.post(url, params, temConfig).then(res => {
      if (res.status === 200) {
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
          // word文档为application/msword,pdf文档为application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8
        })
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        const fname = res.headers['content-disposition'].split('=')[1] // 下载文件的名字
        link.href = objectUrl
        link.setAttribute('download', decodeURI(fname))
        document.body.appendChild(link)
        link.click()
      } else {
        Message({
          type: 'error',
          message: '导出失败'
        })
      }
    })
  })
}
