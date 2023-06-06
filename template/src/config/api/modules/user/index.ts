import { Get, Post, TResult } from '../../request'
import qs from 'qs'
//录屏


/**
 * 用户列表
 * @param options
 */
export const getUserListApi = (params: any): TResult<any> => {
  return Get('/user/page', { params })
}
/**
 * 用户删除
 * @param options
 */
export const deleteUsersApi = (params: any): TResult<any> => {
  return Post('/user/del', { params })
}
/**
 * 用户修改状态
 * @param options
 */
export const updateUsersStatusApi = (params: any): TResult<any> => {
  return Post('/user/updateStatus', { params })
}
/**
 * 重置密码
 * @param options
 */
export const resetPassApi = (params: any): TResult<any> => {
  return Post('/user/resetPassword', { params })
}

/**
 * 新增
 * @param options
 */
export const saveUserApi = (params: any): TResult<any> => {
  return Post('/user/save', { params })
}
/**
 * 修改
 * @param options
 */
export const updateUserApi = (params: any): TResult<any> => {
  return Post('/user/update', { params })
}
/**
 * 详情
 * @param options
 */
export const getUserDetailsApi = (params: any): TResult<any> => {
  return Get('/user/info', { params })
}