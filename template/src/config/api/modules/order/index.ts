/*
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-01-31 18:04:50
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-05-05 11:08:38
 * @FilePath: \operation-web\src\config\api\modules\order\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by lixinxin lixinxin@huan.tv, All Rights Reserved.
 */
import { Get, Post, TResult } from '../../request'
import qs from 'qs'

// 获取模板列表
export const GetOrderListApi = (params: any): TResult<any> => {
  //   return Get(`/click/template/page`, { params })
  return Get(`/order/page`, { params })
}

/**
 * 撤单
 * @param options
 */
export const handelSubmitCancelApi = (params: any): TResult<any> => {
  return Post('/order/updateStatus', { params })
}

// 下载订单模板
export const GetOrderTemplateApi = (): TResult<any> => {
  return Get('/order/findTemplateUrl')
}

// 计划-模板导入 新增
export const UploadImportTemplateApi = (params: any) => {
  return Post(`/order/readSchedule`, {
    params,
    isForm: true,
  })
}

// 获取广告来源
export const GetShowStyleApi = (params: any): TResult<any> => {
  return Get(`/sys-dict/tree?${qs.stringify(params)}`)
}

/**
 * 修改名称
 * @param options
 */
export const OrderUpdateNameApi = (params: any): TResult<any> => {
  return Post('/order/updateName', { params })
}

/**
 * 删除订单列表
 * @param options
 */
export const OrderListDeleteApi = (params: any): TResult<any> => {
  return Post('/order/del', { params })
}

/**
 * 获取项目列表
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13941
 * @param options
 */
export const GetSubjectListApi = (params?: any): TResult<any> => {
  return Get(`/subject/list?${qs.stringify(params)}`)
}

/**
 * 新增
 * @param options
 */
export const saveOrderApi = (params: any): TResult<any> => {
  return Post('/order/save', { params })
}
/**
 * 获取详情
 * @param options
 */
export const getOrderInfoApi = (params: any): TResult<any> => {
  return Get(`/order/info?${qs.stringify(params)}`)
}
/**
 * 修改
 * @param options
 */
export const updateOrderApi = (params: any): TResult<any> => {
  return Post('/order/update', { params })
}
// 获取当前广告主下的产品线
export const getProductLineListApi = (params: any): TResult<any> => {
  return Get(`/advertiser/list?${qs.stringify(params)}`)
}
