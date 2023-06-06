import layout from '@/components/layout/index.vue'
import useStore from '@/config/pinia'

const routers: Object[] = [
  {
    path: '/',
    name: 'index',
    redirect: 'redirectPath',
    component: layout,
    children: [
      {
        path: '/permissions',
        name: 'permissions',
        meta: {
          menu: 'permissions',
          bread: [
            {
              label: '无权限',
              name: 'permissions',
            },
          ],
        },
        component: () => import('@/views/permissions/permissions.vue'),
      },
      {
        path: '/overivew',
        // @ts-ignore
        //这里两个用于路由守卫 权限判断使用
        meta: {
          code: 'overivew',
          overivew: '@/views/overivew/overivew.vue',
        },
        name: 'overivew',
        component: () => import('@/views/overivew/overivew.vue'),
      },
      {
        path: '/demo',
        meta: {
          code: 'demo',
          overivew: '@/views/demo/demo.vue',
        },
        component: () => import('@/views/demo/demo.vue'),
      },
      {
        path: '/resize',
        meta: {
          code: 'resize',
        },
        component: () => import('@/views/demo/resize-table-header-demo.vue'),
      },
      {
        path: '/project',
        name: 'project',
        meta: {
          code: 'subject:page',
          menu: 'project',
          bread: [
            {
              label: '项目',
              name: 'project',
            },
          ],
        },
        component: () => import('@/views/project/project.vue'),
      },
      {
        path: '/project/addProject',
        name: 'addProject',
        meta: {
          menu: 'project',
          back: true,
          code: ['subject:save', 'subject:update', 'subject:info'],
          backName: 'project',
          bread: [
            {
              label: '项目',
              name: 'project',
            },
            {
              label: '新建项目',
              name: 'addProject',
            },
          ],
        },
        component: () => import('@/views/project/addProject.vue'),
      },
      {
        path: '/project/MarketingServer',
        name: 'MarketingServer',
        meta: {
          menu: 'project',
          back: true,
          code: ['subject:sell', 'subject:voucherInfo'],
          backName: 'project',
          bread: [
            {
              label: '项目',
              name: 'project',
            },
            {
              label: '项目名称',
              name: 'project',
            },
            {
              label: '营销服务配置',
              name: 'MarketingServer',
            },
          ],
        },
        component: () =>
          import('@/views/project/components/MarketingServer.vue'),
      },
      {
        path: '/project/projectChangeTake',
        name: 'projectChangeTake',
        meta: {
          menu: 'project',
          back: true,
          code: ['subject:updateLog'],
          backName: 'project',
          query: {
            id: 'projectId', //key 指代这个页面需要的参数名，projectId指代上一页的query参数
            name: 'name',
          },
          bread: [
            {
              label: '项目',
              name: 'project',
            },
            {
              label: '项目名称',
              name: 'project',
            },
            {
              label: '修改记录',
              name: 'projectChangeTake',
            },
          ],
        },
        component: () => import('@/views/project/projectChangeTake.vue'),
      },
      {
        path: '/project/projectChangeTakeInfo',
        name: 'projectChangeTakeInfo',
        meta: {
          menu: 'project',
          back: true,
          code: ['subject:updateLog'],
          backName: 'projectChangeTake',
          bread: [
            {
              label: '项目',
              name: 'project',
            },
            {
              label: '改单记录',
              name: 'projectChangeTake',
            },
            {
              label: '改单记录详情',
            },
          ],
        },
        component: () => import('@/views/project/projectChangeTakeInfo.vue'),
      },
      {
        path: '/screen',
        name: 'screen',
        meta: {
          code: 'record-screen:page',
          menu: 'screen',
          bread: [
            {
              label: '录屏',
              name: 'screen',
            },
          ],
        },
        component: () => import('@/views/screen/screen.vue'),
      },
      {
        path: '/screen/addOrUpdate',
        name: 'screenAddOrUpdate',
        meta: {
          menu: 'screen',
          code: [
            'record-screen:save',
            'record-screen:update',
            'record-screen:getId',
          ], //两者有其一 即可进入
          back: true,
          backName: 'screen',
          bread: [
            {
              label: '录屏',
              name: 'screen',
            },
            {
              label: '新建录屏',
              name: 'screenAddOrUpdate',
            },
          ],
        },
        component: () => import('@/views/screen/addOrUpdate.vue'),
      },
      {
        path: '/screenTemplate',
        name: 'screenTemplate',
        meta: {
          code: 'click-template:page',
          menu: 'screenTemplate',
          bread: [
            {
              label: '录屏模板',
              name: 'screenTemplate',
            },
          ],
        },
        component: () => import('@/views/screen/screenTemplate.vue'),
      },
      {
        path: '/screenTemplate/addOrUpdateTemp',
        name: 'temPaddOrUpdate',
        meta: {
          menu: 'screenTemplate',
          back: true,
          code: [
            'record-screen:save',
            'record-screen:update',
            'click-template:info',
          ],
          backName: 'screenTemplate',
          bread: [
            {
              label: '录屏模板',
              name: 'screen',
            },
            {
              label: '新建录屏',
              name: 'temPaddOrUpdate',
            },
          ],
        },
        component: () => import('@/views/screen/addOrUpdateTemp.vue'),
      },
      {
        path: '/user',
        name: 'user',
        meta: {
          code: 'user:page',
          menu: 'user',
          bread: [
            {
              label: '账户',
              name: 'user',
            },
          ],
        },
        component: () => import('@/views/user/user.vue'),
      },
      {
        path: '/user/addUser',
        name: 'addUser',
        meta: {
          menu: 'user',
          back: true,
          code: ['user:save', 'user:update', 'user:info'],
          backName: 'user',
          bread: [
            {
              label: '账户',
              name: 'user',
            },
            {
              label: '新建账户',
              name: 'addUser',
            },
          ],
        },
        component: () => import('@/views/user/addUser.vue'),
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          code: 'role:page',
          menu: 'role',
          bread: [
            {
              label: '角色',
              name: 'role',
            },
          ],
        },
        component: () => import('@/views/role/role.vue'),
      },
      {
        path: '/role/addRole',
        name: 'addRole',
        meta: {
          menu: 'role',
          back: true,
          code: ['role:save', 'role:update', 'role:info'],
          backName: 'role',
          bread: [
            {
              label: '角色',
              name: 'role',
            },
            {
              label: '新建角色',
              name: 'addRole',
            },
          ],
        },
        component: () => import('@/views/role/addRole.vue'),
      },
      {
        path: '/demo/tree',
        name: 'tree',
        meta: {
          menu: 'role',
          back: true,
          code: ['role:save', 'role:update'],
          backName: 'role',
          bread: [
            {
              label: '角色',
              name: 'role',
            },
            {
              label: '新建角色',
              name: 'addRole',
            },
          ],
        },
        component: () => import('@/views/demo/tree.vue'),
      },
      {
        path: '/demo/treeThree',
        name: 'tree',
        meta: {
          menu: 'role',
          back: true,
          code: ['role:save', 'role:update'],
          backName: 'role',
          bread: [
            {
              label: '角色',
              name: 'role',
            },
            {
              label: '新建角色',
              name: 'addRole',
            },
          ],
        },
        component: () => import('@/views/demo/treeThree.vue'),
      },
      {
        path: '/order',
        name: 'order',
        meta: {
          code: 'order:page',
          menu: 'order',
          bread: [
            {
              label: '订单',
              name: 'order',
            },
          ],
        },
        component: () => import('@/views/order/order.vue'),
      },
      {
        path: '/order/addOrUpdateOrder',
        name: 'addOrUpdateOrder',
        meta: {
          menu: 'order',
          back: true,
          code: ['order:save', 'order:update', 'order:info'],
          backName: 'order',
          bread: [
            {
              label: '订单',
              name: 'order',
            },
            {
              label: '新建订单',
              name: 'addOrUpdateOrder',
            },
          ],
        },
        component: () => import('@/views/order/addOrUpdateOrder.vue'),
      },
      {
        path: '/orderTake',
        name: 'orderTake',
        meta: {
          code: 'order:updateLog',
          menu: 'order',
          back: true,
          backName: 'order',
          query: {
            id: 'pid', //key 指代这个页面需要的参数名，pid指代上一页的query参数
            name: 'name',
          },
          bread: [
            {
              label: '订单',
              name: 'order',
            },
            {
              label: '新建订单',
              name: 'order',
            },
            {
              label: '改单记录',
            },
          ],
        },
        component: () => import('@/views/order/orderChangeTake.vue'),
      },
      {
        path: '/orderTake/orderTakeInfo',
        name: 'orderTakeInfo',
        meta: {
          menu: 'order',
          back: true,
          backName: 'orderTake',
          code: ['order:save', 'order:update', 'order:info'],
          bread: [
            {
              label: '订单',
              name: 'order',
            },
            {
              label: '新建订单',
              name: 'orderTake',
            },
            {
              label: '改单记录',
            },
          ],
        },
        component: () => import('@/views/order/orderChangeTakeInfo.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
  },
]

/**
 * 根据当前用户code 返回出第一个可以跳转的页面
 */
const getUserPermissNextPath = () => {
  let { getPower } = useStore()
  const nextPage: any = (routers as any)[0].children.find((page) => {
    let code: any = page.meta?.code || ''
    if (typeof code == 'string' && code.includes('page')) {
      return getPower(code)
    }
  })
  return nextPage == undefined ? '/permissions' : nextPage.path
}

export { routers, getUserPermissNextPath }
