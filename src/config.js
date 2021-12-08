module.exports = {

  // TODO: 【初始化】：1.页面标题， 2.项目别名，跟管理员后台创建的应用统一设定, 3.本地加密参数 key，项目别名前加 slzx_
  title: '项目标题',
  abbreviation: 'base',
  localStorageKey: 'slzx_base',
  // 存入本地数据的 key
  localKeys: ['masterOrgId', 'moduleCode', 'moduleRoleId', 'appCode', 'orgId', 'access_token', 'first'],
  // layout 配置项
  navbar: {
    // 是否显示组织选择
    showOrg: true,
    // 右侧显示栏目
    rightItems: Object.freeze([
      {
        name: 'LogManage', // 日志管理
        icon: 'icon_rizhi'
      },
      {
        name: 'NoticeManage', // 通知中心
        icon: 'icon_notice'
      },
      {
        name: 'ThemeSet', // 主题管理
        icon: 'icon_zhuti'
      }
    ])
  },

  // 项目初始化需要发起请求
  request: [
    // 'user/setUserConfig',
    // 'user/setUserLimitList',
    // 'app/setOrgs',
    // 'app/setDistrictTree',
    // 'app/setFindLoginUriAndSsoDomain',
    // 'app/setSystemMenu',
    // 'platform/setPlatformTree'
  ],

  // 项目运行端口2
  port: 9527,
  // 项目请求代理地址
  proxy: {
    api: 'http://172.168.102.3:8000',
    sso: 'http://172.168.102.3:9020'
  }
}
