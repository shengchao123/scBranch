import Layout from '@/layout'
export default [
  {
    path: '/platform-manage',
    component: Layout,
    redirect: '/platform-manage/main/organization-list',
    name: 'PlatformManage',
    meta: {
      title: '平台管理'
    },
    children: [
      {
        path: 'main',
        component: () => import('@v/platform-manage/index.vue'),
        children: [
          {
            path: 'organization-list',
            name: 'OrganizationList',
            component: () => import('@v/platform-manage/organization/org/Table.vue'),
            meta: { title: '组织管理' }
          },
          {
            path: 'role',
            name: 'Role',
            component: () => import('@v/platform-manage/role/Table.vue'),
            meta: { title: '角色管理' }
          },
          {
            path: 'user',
            name: 'User',
            component: () => import('@v/platform-manage/user/Table.vue'),
            meta: { title: '用户管理' }
          }
        ]
      }
    ]
  },
  {
    path: '/platform/other',
    component: Layout,
    children: [
      {
        path: 'freeze-users',
        component: () => import('@v/platform-manage/FreezeUsers.vue'),
        name: 'FreezeUsers',
        meta: { title: '冻结用户管理' }
      },
      {
        path: 'log-manage',
        component: () => import('@v/platform-manage/LogManage'),
        name: 'LogManage',
        meta: { title: '日志管理' }
      },
      {
        path: 'org-label',
        name: 'OrgLabel',
        component: () => import('@v/platform-manage/organization/label/Table.vue'),
        meta: { title: '组织标签管理' }
      },
      {
        path: 'org-type',
        name: 'OrgType',
        component: () => import('@v/platform-manage/organization/type/Table.vue'),
        meta: { title: '组织类型管理' }
      },
      {
        path: 'organization-info',
        name: 'OrganizationInfo',
        component: () => import('@v/platform-manage/organization/org/detail/index.vue'),
        meta: { title: '组织详情', activeMenu: 'OrganizationList' }
      },
      {
        path: 'type-detail',
        name: 'TypeDetail',
        component: () => import('@v/platform-manage/organization/type/TypeDetail.vue'),
        meta: { title: '组织类型详情', activeMenu: 'OrgType' }
      },
      {
        path: 'label-detail',
        name: 'LabelDetail',
        component: () => import('@v/platform-manage/organization/label/LabelDetail.vue'),
        meta: { title: '组织标签详情', activeMenu: 'OrgLabel' }
      },
      {
        path: 'role-limit',
        name: 'RoleLimit',
        component: () => import('@v/platform-manage/role/Limit.vue'),
        meta: { title: '权限设置', activeMenu: 'Role' }
      }
    ]
  }
]
