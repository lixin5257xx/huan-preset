import axios, { AxiosRequestConfig, Method } from 'axios'
import { h, VNode } from 'vue'
import type { RendererElement, RendererNode } from 'vue'
import useStore from '@/config/pinia'
import { downLoadFile } from '@utils'
export type TResult<T = any> = Promise<{
  data: T
  code: number | string
  count?: number
  msg: string
}>

const request = axios.create({
  baseURL: import.meta.env.VITE_API_HOST as string,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

request.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (res: any) => {
    const store = useStore()
    const { code, message } = res.data || {}
    if (code) {
      switch (Number(code)) {
        case 200:
          return res.data
        case 4010: {
          // 登录过期
          if (!store.isRemove) {
            window.location.href = '/#/login'
            store.loginOut()
          }
          return Promise.reject(res.data)
        }
        case 4100: {
          let resultList: VNode<
            RendererNode,
            RendererElement,
            { [key: string]: any }
          >[] = []
          let messageList: any = []
          window.$notification['error']({
            content: res.data.message,
            meta: () => {
              res.data.data.forEach((item) => {
                item.err_message.forEach((mes) => {
                  console.log('mes')
                  messageList.push(
                    h(
                      'div',
                      {
                        className: 'error-msg-content',
                      },
                      {
                        default: () => `${mes}`,
                      }
                    )
                  )
                })
                resultList.push(
                  h(
                    'div',
                    {
                      className: 'error-msg',
                    },
                    {
                      default: () => [
                        h(
                          'p',
                          {
                            className: 'error-title',
                          },
                          {
                            default: () => `${item.field}`,
                          }
                        ),
                        ...messageList,
                      ],
                    }
                  )
                )
              })
              return resultList
            },
          })
          return res.data
        }
        default:
          window.$notification['error']({
            content: '错误提示',
            meta:()=>{
                return  h('span',{style:'word-wrap:break-word'},{default:()=>
                        message || '服务器错误'
               })
            },
            duration: 3000,
          })
          return Promise.reject(res.data)
      }
    }
    return res.data
  },
  (err) => {
    switch (err?.response?.status) {
      default:
        {
          window.$notification['error']({
            content: '错误提示',
            meta: '服务器错误',
            duration: 3000,
          })
        }
        break
    }
    return Promise.reject(err.response)
  }
)

interface RequestOptions extends Partial<AxiosRequestConfig> {
  isAuth?: boolean
  isToken?: boolean
  isBuff?: boolean
  urlFields?: string[]
  isForm?: boolean
  transformParams?: (params: any) => any
}

const createMethod =
  (method: Method = 'get') =>
  (url: string, options?: RequestOptions) => {
    const store = useStore()
    let {
      urlFields,
      isAuth = false,
      isToken = true,
      isForm = false,
      isBuff = false,
      headers = {},
      params,
      transformParams,
      ...args
    } = options || {}
    let responseType = 'json'
    let data = ['get'].includes(method) ? { params } : { data: params }
    // 处理formdata形式
    if (isForm) {
      const formParams = new FormData()
      for (const key in params) {
        formParams.append(key, params[key])
      }
      data.data = formParams
      headers = Object.assign({}, options?.headers, {
        'Content-Type': 'multipart/form-data',
      })
    }
    //接口增加权限token
    if (isToken) {
      const users = store.tokenData
      if (users && users['access_token']) {
        headers = Object.assign({}, options?.headers, {
          Authorization: `bearer ${users['access_token']}`,
        })
      }
    }

    if (isAuth) {
      headers = Object.assign({}, options?.headers, {
        Authorization:
          'Basic YWRfb3BlcmF0aW9uX2lkOmJnZmQ5MDM1NjRwbG9tZ3Jldzgwamg1Njd5dXBsbw==',
      })
    }
    if (isBuff) {
      responseType = 'blob'
    }
    if (typeof transformParams === 'function') {
      data = transformParams(params)
    }
    // 过滤URl参数
    if (urlFields) {
      for (const key of urlFields) {
        url = url.replace(new RegExp(`:${key}`), (params as any)[key])
      }
    }
    return request(url, {
      method,
      responseType,
      headers,
      ...data,
      ...args,
    } as any) as Promise<any>
  }

export const Post = createMethod('post')
export const Get = createMethod('get')
export const Delete = createMethod('delete')
export const Put = createMethod('put')

export default request
