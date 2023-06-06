/*
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2022-07-20 09:51:48
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-05-22 09:54:01
 * @FilePath: \operation-web\src\main.ts
 * @Description:
 *
 * Copyright (c) 2022 by lixinxin lixinxin@huan.tv, All Rights Reserved.
 */
// @ts-ignore
import { app } from '@/config/vue/app'
import './assets/css/index.css'
// @ts-ignore
//加载指令
import '@/config/directive'
//加载全局配置
import '@/config/global/permissions'
// @ts-ignore
import { naive } from '@/config/ui/index'
// @ts-ignore
import { router } from '@/config/router/router'
import { createPinia } from 'pinia'
import '@/config/css/theme.css'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

const isProduction = process.env.NODE_ENV === 'production'
isProduction &&
  Sentry.init({
    app,
    dsn: 'https://39648063fdcd4df3b876a29a93dcb53f@o1144349.ingest.sentry.io/6312335',
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
    ],
    tracesSampleRate: 0.2,
    release: 'operation@1.5.0',
    ignoreErrors: [
      'Failed to fetch',
      'NetworkError when attempting to fetch resource.',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Loading chunk',
      'Unable to preload CSS for',
      'Request aborted',
    ],
  })
// throw new Error('test Sentry')
const pinia = createPinia()

app.use(naive).use(router).use(pinia).mount('#app')
