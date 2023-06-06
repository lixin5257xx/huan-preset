import { Get, Post, TResult } from '../../request'
import qs from 'qs'
//录屏


/**
 * 角色列表 用于筛选
 * @param options
 */
export const getRoleListApi = (): TResult<any> => {
  return Get('/role/list')
}
/**
 * 角色列表 分页
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13776
 * @param options
 */
 export const getRolesApi = (params: any): TResult<any> => {
  return Get('/role/page', { params })
}

/**
 * 角色删除
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13786
 * @param options
 */
 export const deleteRolesApi = (params: any): TResult<any> => {
  return Post('/role/del', { params })
}

/**
 * 角色权限code列表
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13786
 * @param options
 */
 export const getMenuIdListApi = (): TResult<any> => {
  return Get('/sysMenu/list')
}

/**
 * 新增角色
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13771
 * @param options
 */
 export const saveRolesApi = (params: any): TResult<any> => {
  return Post('/role/save', { params })
}
/**
 * 详情
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13781
 * @param options
 */
 export const getRoleDetailsApi = (params: any): TResult<any> => {
  return Get('/role/info', { params })
}
/**
 * 编辑角色
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13766
 * @param options
 */
 export const updateRolesApi = (params: any): TResult<any> => {
  return Post('/role/update', { params })
}