import request from '../index'
import { urls } from '../urls'
import { getGlobalParams } from '@u/login'

export function findSysModuleRoleEnableList (params) { // 通过组织查找所属角色列表
  return request({
    url: urls.findSysModuleRoleEnableList,
    method: 'post',
    data: {
      moduleCode: getGlobalParams('moduleCode')
    }
  })
}

export function platformFindOrganizationFilterTree () { // 非商城模块右上角组织树
  return request({
    url: '/organization/org/findOrganizationFilterTree',
    method: 'post',
    data: {
      orgId: getGlobalParams('orgId')
    }
  })
}

export function findOrganizationFullTree (params) { // 获取组织结构树
  return request({
    url: urls.findOrganizationFullTree,
    method: 'post',
    data: {
      ...params
    }
  })
}
export function findOrganizationTreeByOrgId (params) { // 根据组织id获取组织树
  return request({
    url: urls.findOrganizationTreeByOrgId,
    method: 'post',
    data: {
      orgId: getGlobalParams('orgId'),
      ...params
    }
  })
}
export function findOrgClassEnList () { // 获取组织类别
  return request({
    url: urls.findOrgClassEnList,
    method: 'post',
    data: {}
  })
}
export function findOrgLabelEnList () { // 获取组织标签
  return request({
    url: urls.findOrgLabelEnList,
    method: 'post',
    data: {}
  })
}
export function findOrganizationPage (params) { // 获取组织分页数据
  return request({
    url: urls.findOrganizationPage,
    method: 'post',
    data: {
      ...params
    }
  })
}
export function findOrganizationById (params) { // 获取组织信息
  return request({
    url: urls.findOrganizationById,
    method: 'post',
    data: params
  })
}
export function updateOrganizationCheck (params) { // 更新组织信息
  return request({
    url: urls.updateOrganizationCheck,
    method: 'post',
    data: params
  })
}
export function updateOrganization (params) { // 更新组织信息
  return request({
    url: urls.updateOrganization,
    method: 'post',
    data: params
  })
}
export function insertOrganizationCheckName (params) { // 新增组织信息查询名字是否重复
  return request({
    url: urls.insertOrganizationCheckName,
    method: 'post',
    data: params
  })
}
export function deleteOrganization (params) { // 删除组织信息
  return request({
    url: urls.deleteOrganization,
    method: 'post',
    data: params
  })
}
export function batchDeleteOrganization (params) { // 批量删除组织
  return request({
    url: urls.batchDeleteOrganization,
    method: 'post',
    data: params
  })
}

export function insertOrganization (params) { // 新增组织
  return request({
    url: urls.insertOrganization,
    method: 'post',
    data: params
  })
}

export function updateUserFilterOrg (params) { // 更新用户组织树
  return request({
    url: urls.updateUserFilterOrg,
    method: 'post',
    data: params
  })
}
export function findUserFilterOrg (params) { // 查找用户组织
  return request({
    url: urls.findUserFilterOrg,
    method: 'post',
    data: params
  })
}
export function findOrganizationFilterDepartmentTree (params) { // 查找用户组织
  return request({
    url: urls.findOrganizationFilterDepartmentTree,
    method: 'post',
    data: {}
  })
}
export function findOrgClassList (params) { // 组织类型列表
  return request({
    url: urls.findOrgClassList,
    method: 'post',
    data: {}
  })
}
export function insertOrgClassReq (params) { // 新增组织类型
  return request({
    url: urls.insertOrgClassReq,
    method: 'post',
    data: params
  })
}
export function deleteOrgClass (params) { // 删除组织类型
  return request({
    url: urls.deleteOrgClass,
    method: 'post',
    data: params
  })
}
export function findOrgClassById (params) { // 删除组织类型
  return request({
    url: urls.findOrgClassById,
    method: 'post',
    data: params
  })
}
export function findOrgClassRelatedOrganizationsPage (params) { // 删除组织类型
  return request({
    url: urls.findOrgClassRelatedOrganizationsPage,
    method: 'post',
    data: params
  })
}
export function updateOrgClass (params) { // 更新组织类型
  return request({
    url: urls.updateOrgClass,
    method: 'post',
    data: params
  })
}
export function findOrgLabelPage (params) { // 获取标签分页
  return request({
    url: urls.findOrgLabelPage,
    method: 'post',
    data: params
  })
}
export function findOrgLabelByOrgId (params) { // 获取标签详情
  return request({
    url: urls.findOrgLabelByOrgId,
    method: 'post',
    data: params
  })
}
export function insertOrgLabel (params) { // 新增组织标签
  return request({
    url: urls.insertOrgLabel,
    method: 'post',
    data: params
  })
}
export function deleteOrgLabel (params) { // 删除组织标签
  return request({
    url: urls.deleteOrgLabel,
    method: 'post',
    data: params
  })
}
export function updateOrgLabel (params) { // 更新组织标签
  return request({
    url: urls.updateOrgLabel,
    method: 'post',
    data: params
  })
}
export function findOrgLabelById (params) { // 获取标签详情
  return request({
    url: urls.findOrgLabelById,
    method: 'post',
    data: params
  })
}
export function findOrgLabelRelatedOrganizationsPage (params) { // 查找标签相关组织
  return request({
    url: urls.findOrgLabelRelatedOrganizationsPage,
    method: 'post',
    data: params
  })
}

// ----------------------- 用户角色管理
export function rolePage (params) { // 角色分页
  return request({
    url: urls.findRolePageByOrgId,
    method: 'post',
    data: {
      ...params
    }
  })
}
export function roleListByOrgId (params) { // 通过组织查找所属角色列表
  return request({
    url: urls.findCanUseRoleListByOrgId,
    method: 'post',
    data: params
  })
}

export function insertGeneralRole (params) { // 新增普通角色
  return request({
    url: urls.insertGeneralRole,
    method: 'post',
    data: params
  })
}
export function deleteRoleByIds (params) { // 删除角色
  return request({
    url: urls.deleteRoleByIds,
    method: 'post',
    data: params
  })
}
export function deleteRoleById (params) { // 删除单个角色
  return request({
    url: urls.deleteRoleById,
    method: 'post',
    data: params
  })
}
export function disableRole (params) { // 禁用角色
  return request({
    url: urls.disableRole,
    method: 'post',
    data: params
  })
}
export function enableRole (params) { // 启用角色
  return request({
    url: urls.enableRole,
    method: 'post',
    data: params
  })
}
export function updateRole (params) {
  return request({
    url: urls.updateRole,
    method: 'post',
    data: params
  })
}
export function copyRole (params) {
  return request({
    url: urls.copyRole,
    method: 'post',
    data: params
  })
}
export function roleLimitTree (params) {
  return request({
    url: urls.findAuthenticationGroupByModuleCode,
    method: 'post',
    data: {
      moduleCode: getGlobalParams('moduleCode'),
      ...params
    }
  })
}
export function roleLimitById (params) {
  return request({
    url: urls.findAuthenticationGroupByRoleId,
    method: 'post',
    data: params
  })
}

export function findOrgSysModuleApplication (params) {
  return request({
    url: urls.findOrgSysModuleApplication,
    method: 'post',
    data: {
      ...params
    }
  })
}

export function setRoleLimit (params) {
  return request({
    url: '/authentication/auth/setRoleDetails',
    method: 'post',
    data: params
  })
}

export function checkRoleName (params) { // 验证角色名
  return request({
    url: '/authentication/role/checkRoleName',
    method: 'post',
    data: {
      orgId: getGlobalParams('orgId'),
      ...params
    }
  })
}

// 用户管理
export function insertUser (params) {
  return request({
    url: urls.insertUser,
    method: 'post',
    data: params
  })
}
export function updateUserInfo (params) {
  return request({
    url: urls.updateUserInfo,
    method: 'post',
    data: params
  })
}
export function getUserPagingData (params) {
  return request({
    url: urls.findUserInfo,
    method: 'post',
    data: {
      ...params
    }
  })
}
export function restPassword (params) {
  return request({
    url: urls.restPassword,
    method: 'post',
    data: params
  })
}
export function findUserAuth (params) {
  return request({
    url: urls.findUserAuth,
    method: 'post',
    data: {}
  })
}
export function findUserInfoById (params) {
  return request({
    url: urls.findUserInfoById,
    method: 'post',
    data: params
  })
}

export function updateUserStatus (params) {
  return request({
    url: urls.updateUserStatus,
    method: 'post',
    data: params
  })
}
export function deleteUser (params) {
  return request({
    url: urls.deleteUser,
    method: 'post',
    data: params
  })
}

export function removeManagerByUser (params) {
  return request({
    url: urls.removeManagerByUser,
    method: 'post',
    data: params
  })
}

export function findUserFrozenRecordByPage (params) {
  return request({
    url: urls.findUserFrozenRecordByPage,
    method: 'post',
    data: params
  })
}
export function findUserHistoryFrozenRecordByPage (params) {
  return request({
    url: urls.findUserHistoryFrozenRecordByPage,
    method: 'post',
    data: params
  })
}
export function userLogPage (params) {
  return request({
    url: urls.userLogPage,
    method: 'post',
    data: params
  })
}
export function unfreezeUser (params) {
  return request({
    url: urls.unfreezeUser,
    method: 'post',
    data: params
  })
}
