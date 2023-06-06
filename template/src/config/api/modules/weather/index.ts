import { Get, Post, TResult } from '../../request'
import qs from 'qs'
// 获取任务弹窗天气信息（天气弹窗页使用）
export const GetAlterWeatherApi = (params?: any): TResult<any> => {
  return Get(`/client/task/find/alter/weather?${qs.stringify(params)}`)
}

// 获取任务落地页天气信息（天气落地页使用）
export const GetInfoWeatherApi = (params?: any): TResult<any> => {
  return Get(`/client/task/find/info/weather?${qs.stringify(params)}`)
}
