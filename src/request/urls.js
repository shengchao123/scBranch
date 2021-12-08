
export const fileHost = 'https://hzslzx.oss-cn-hangzhou.aliyuncs.com/' // 文件显示地址

// export const aliOssConfig = {
//   region: 'oss-cn-hangzhou',
//   // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式来进行API访问
//   accessKeyId: 'LTAI4GDGpRzW9FYmSkdtPU3h',
//   accessKeySecret: 'tCwBOjdC8YHUDuG8020eAKi3yqvzeS',
//   bucket: 'hzslzx'
// }
export const urls = {

  // ------------ 组织管理
  findSysMenuByModuleCode: '/setting/sysMenu/findSysMenuByModuleCode',
  findSysModuleRoleEnableList: '/setting/sysModuleRole/findSysModuleRoleEnableList',
  findOrganizationFilterTree: '/organization/org/findOrganizationFilterTree',
  findOrganizationFullTree: '/organization/org/findOrganizationFullTree',
  findOrganizationTreeByOrgId: '/organization/org/findOrganizationTreeByOrgId',
  findOrgClassEnList: '/organization/orgClass/findOrgClassEnList',
  findOrgLabelEnList: '/organization/orgLabel/findOrgLabelEnList',
  findOrganizationPage: '/organization/org/findOrganizationPage',
  findOrganizationById: '/organization/org/findOrganizationById',
  updateOrganizationCheck: '/organization/org/updateOrganizationCheck',
  updateOrganization: '/organization/org/updateOrganization',
  insertOrganizationCheckName: '/organization/org/insertOrganizationCheckName',
  deleteOrganization: '/organization/org/deleteOrganization',
  batchDeleteOrganization: '/organization/org/batchDeleteOrganization',
  insertOrganization: '/organization/org/insertOrganization',
  updateUserFilterOrg: '/organization/userFilterOrg/updateUserFilterOrg',
  findUserFilterOrg: '/organization/userFilterOrg/findUserFilterOrg',
  findOrganizationFilterDepartmentTree: '/organization/org/findOrganizationFilterDepartmentTree',

  findOrgClassList: '/organization/orgClass/findOrgClassList', // 组织类型列表
  insertOrgClassReq: '/organization/orgClass/insertOrgClass', // 新增组织类型
  deleteOrgClass: '/organization/orgClass/deleteOrgClass', // 删除组织类型
  updateOrgClass: '/organization/orgClass/updateOrgClass', // 更新组织类型
  findOrgClassById: '/organization/orgClass/findOrgClassById', // 获取组织类型详情
  findOrgClassRelatedOrganizationsPage: '/organization/orgClass/findOrgClassRelatedOrganizationsPage', // 获取组织类型详情

  findOrgLabelPage: '/organization/orgLabel/findOrgLabelPage', // 组织标签分页
  findOrgLabelByOrgId: '/organization/orgLabel/findOrgLabelByOrgId', // 获取标签详情
  insertOrgLabel: '/organization/orgLabel/insertOrgLabel', // 新增组织标签
  deleteOrgLabel: '/organization/orgLabel/deleteOrgLabel', // 删除组织标签
  updateOrgLabel: '/organization/orgLabel/updateOrgLabel', // 更新组织标签
  findOrgLabelById: '/organization/orgLabel/findOrgLabelById', // 更新组织标签
  findOrgLabelRelatedOrganizationsPage: '/organization/orgLabel/findOrgLabelRelatedOrganizationsPage', // 查找标签相关组织

  // ------------- 角色管理
  findRolePageByOrgId: '/authentication/role/findRolePageByOrgId',
  findCanUseRoleListByOrgId: '/authentication/role/findCanUseRoleListByOrgId',
  insertGeneralRole: '/authentication/role/insertGeneralRole',
  deleteRoleByIds: '/authentication/role/deleteRoleByIds',
  deleteRoleById: '/authentication/role/deleteRoleById',
  disableRole: '/authentication/role/disableRole',
  enableRole: '/authentication/role/enableRole',
  updateRole: '/authentication/role/updateRole',
  copyRole: '/authentication/role/copyRole',
  findAuthenticationGroupByModuleCode: '/authentication/auth/findAuthenticationGroupByModuleCode',
  findAuthenticationGroupByRoleId: '/authentication/auth/findAuthenticationGroupByRoleId',
  findOrgSysModuleApplication: '/organization/OrgRelSysModule/findOrgSysModuleApplication', // 根据顶级组织ID、模块编号获取应用列表
  setRoleDetails: '/authentication/auth/setRoleDetails',

  // ------------ 用户管理
  insertUser: '/user/user/insertUser',
  findUserInfoById: '/user/user/findUserInfoById',
  findUserAuth: '/user/user/findUserAuth',
  updateUserInfo: '/user/user/updateUserInfo',
  findUserInfo: '/user/user/findUserInfo',
  restPassword: '/user/user/restPassword',
  updateUserStatus: '/user/user/updateUserStatus',
  deleteUser: '/user/user/deleteUser',

  // ------------ 冻结用户管理
  findUserFrozenRecordByPage: '/user/userFrozenRecord/findUserFrozenRecordByPage',
  findUserHistoryFrozenRecordByPage: '/user/userFrozenRecord/findUserHistoryFrozenRecordByPage',
  unfreezeUser: '/user/userFrozenRecord/unfreezeUser',

  // ------------ 用户日志管理
  userLogPage: '/log/userLog/userLogPage'
}
