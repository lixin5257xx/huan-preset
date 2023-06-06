/*
 * @Description: Do not edit
 * @Author: 文件创建人：任亮
 * @Date: 2022-11-01 11:10:13
 */
import { Get, Post, TResult } from '../../request'
import qs from 'qs'
//项目

/**
 * 列表
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13941
 * @param options
 */
export const GetSubjectPageApi = (params: any): TResult<any> => {
  return Post('/subject/page', { params })
}
/**
 * 新增
 * @param options
 */
export const saveSubjectApi = (params: any): TResult<any> => {
  return Post('/subject/save', { params })
}
/**
 * 获取详情
 * @param options
 */
export const getSubjectInfoApi = (params: any): TResult<any> => {
  return Post('/subject/info', { params })
}
/**
 * 修改
 * @param options
 */
export const updateSubjectApi = (params: any): TResult<any> => {
  return Post('/subject/update', { params })
}

// 获取下单来源
export const GetRegionIdListApi = (): TResult<any> => {
  return Get(`/region/list`)
}

// 获取下单公司
export const GetOrderCompanyListApi = (): TResult<any> => {
  return Get(`/company/list`)
}

// 获取广告主列表
export const GetAdvertiserListApi = (): TResult<any> => {
  return Get('/advertiser/list')
}
// 获取所属行业
export const GetProjectInfoApi = (params: any): TResult<any> => {
  return Get(`/sys-dict?${qs.stringify(params)}`)
}
// 删除项目
export const DeleteProjectApi = (params: any): TResult<any> => {
  return Post('/subject/del', { params })
}
// 获取项目审核详情
// http://api-center-bigdata.huan.tv/project/681/interface/api/13961
export const GetExamineInfoApi = (params: any): TResult<any> => {
  return Get(`/subject/examine-info?${qs.stringify(params)}`)
}
// 修改项目状态
// http://api-center-bigdata.huan.tv/project/681/interface/api/13931
export const UpdateStatusApi = (params: any): TResult<any> => {
  return Post('/subject/updateStatus', { params })
}

// 获得用户接口
// http://api-center-bigdata.huan.tv/mock/681/api/user/list
export const GetUsersListApi = (): TResult<any> => {
  return Get('/user/list')
}

// 营销服务-添加
// http://api-center-bigdata.huan.tv/project/681/interface/api/13971
export const SubmitServicesApi = (params: any): TResult<any> => {
  return Post('/subject/sell-save', { params })
}
// 营销服务-详情
// http://api-center-bigdata.huan.tv/project/681/interface/api/13971
export const GetServiceInfoApi = (params: any): TResult<any> => {
  return Post('/subject/sell-info', { params })
}
// crm服务-详情
// http://api-center-bigdata.huan.tv/project/681/interface/api/14301
export const GetBossCheckInfoApi = (params: any): TResult<any> => {
  return Get(`/subject/boss-check-info?${qs.stringify(params)}`)
}
// crm服务-同步
// http://api-center-bigdata.huan.tv/project/681/interface/api/14306
export const SubmitCrmApi = (params: any): TResult<any> => {
  return Post('/subject/crm-sync', { params })
}
/**
 * 预览
 * @param options
 */
export const GetSubjectMaterialsApi = (params: any): TResult<any> => {
  return Post('/subject/materials', { params })
}
// 合同列表
// https://api-center-bigdata.huan.tv/project/681/interface/api/14366
export const GetContractListApi = (): TResult<any> => {
  return Get(`/contract/list`)
}
// 合同详情
// https://api-center-bigdata.huan.tv/project/681/interface/api/14366
export const GetContractInfoApi = (params: any): TResult<any> => {
  return Get(`/contract/info?${qs.stringify(params)}`)
}
// 员工列表
// https://api-center-bigdata.huan.tv/project/681/interface/api/14369
export const GetEmployeeListApi = (): TResult<any> => {
  return Get(`/employee/list`)
}
// 下单部门列表
// https://api-center-bigdata.huan.tv/project/681/interface/api/13916
export const GetregionListApi = (): TResult<any> => {
  return Get(`/region/list`)
}
// 凭证详情信息
// https://api-center-bigdata.huan.tv/project/681/interface/api/14396
export const GetvoucherInfoApi = (params: any): TResult<any> => {
  return Post(`/subject/voucher-info`, { params })
}
// 订单详情信息
// https://api-center-bigdata.huan.tv/project/681/interface/api/14396
export const GetOvervieworderInfoApi = (params: any): TResult<any> => {
  return Post(`/subject/overview-order-info`, { params })
}
// BOSS推送记录
// https://api-center-bigdata.huan.tv/project/681/interface/api/14402
export const GetBossPushLogInfoApi = (params: any): TResult<any> => {
  return Post(`/subject/boss-push-log`, { params })
}
// 获取批量导入物料模板
// https://api-center-bigdata.huan.tv/project/681/interface/api/14402
export const GetFindUploadTemplateApi = (): TResult<any> => {
  return Get(`/subject/findUploadFileTemplateUrl`)
}

// 营销服务-详情(凭证内容)
export const getSubSellInfoApi = (params: any): TResult<any> => {
  return Post('/subject/sell-info', { params })
}
// 营销服务-详情(单价返点)
export const getSubSellPriceInfoApi = (params: any): TResult<any> => {
  return Post('/subject/sell-price-info', { params })
}
// 营销服务-添加-编辑
export const updateSubSellSaveApi = (params: any): TResult<any> => {
  return Post('/subject/sell-save', { params })
}
// 营销服务-导入
export const UploadSubTemplateApi = (params: any) => {
  return Post(`/subject/sellUpload`, {
    params,
    isForm: true,
  })
}
// 营销服务-导出
export const ExportSubTemplateApi = (params: any) => {
  return Get(`/subject/selloutFile?${qs.stringify(params)}`, {
    isBuff: true,
  })
}

// 获取公司主体列表
// https://api-center-bigdata.huan.tv/project/681/interface/api/14465
export const GetCompanyBodyNameListApi = (): TResult<any> => {
  return Get(`/contract/company-body-name/list`)
}

// 获取公司列表
// https://api-center-bigdata.huan.tv/project/681/interface/api/14465
export const GetCompanyNameListApi = (): TResult<any> => {
  return Get(`/contract/company-name/list`)
}
