import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import type {RouterOptions}  from 'vue-router'
import { routers, getUserPermissNextPath } from './index'
import useStore from '@/config/pinia'
import { getLocalData } from '@utils'
import { errorHandler } from '@/errorHandler/handle'

function initRouter(routes: RouteRecordRaw[] = routers) {
  return createRouter({
    history: createWebHashHistory(),
    routes,
  } as RouterOptions)
}

const router = initRouter(routers)

router.beforeEach((to, from, next) => {
  window.$notification.destroyAll()
  const store = useStore()
  const isLogin = getLocalData('users') || false
  let { fullPath } = to;
  const NOT_TOKEN_PATH = ['/login', '/weather', '/weatherDetails', '/demo']
  if (fullPath.indexOf('?') > -1) {
    fullPath = fullPath.substring(0, fullPath.indexOf('?'))
  }
  if (NOT_TOKEN_PATH.includes(fullPath)) {
    return next()
  } else if (!isLogin) {
    return next({
      path: '/login',
    })
  } else if (fullPath == '/permissions') {
    next()
  } else if (fullPath == '/redirectPath') {
    return next({
      path: getUserPermissNextPath(),
    })
  } else {
    const code = to.meta['code'] || ''
    if (store.getPower(code) || code == '') {
      // 如果跳转的目标页 需要参数 并且 上一页有参数，并且当前页面参数没有
      if(to.meta['query'] && Object.keys(from.query).length != 0 && Object.keys(to.query) == 0){
        for (const queryKey in to.meta['query']) {
          to.query[queryKey] = from.query[to.meta.query[queryKey]];
        }
        return next({path:to.path,query:to.query})
      }
      return next()
    } else {
      return next({
        path: '/permissions',
      })
    }
  }
})

router.onError((error, to) => {
  errorHandler.getErrorCodeHandler(error.message);
})

export { router, initRouter }
