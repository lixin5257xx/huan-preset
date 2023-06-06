import { Get, Post, TResult } from '../../request'
import qs from 'qs'
//录屏

/**
 * 列表
 * @param options
 */
export const recordScreenPageApi = (params: any): TResult<any> => {
  return Post('/record-screen/page', { params })
}

/**
 * 预览
 * @param options
 */
export const recordScreenPreviewApi = (params: any): TResult<any> => {
  return Get('/record-screen/preview', { params })
}

/**
 * 重录
 * @param options
 */
export const recordScreenRemakeApi = (params: any): TResult<any> => {
  return Post('/record-screen/remake', { params })
}

/**
 * 删除
 * @param options
 */
export const recordScreenDeleteApi = (params: any): TResult<any> => {
  return Post('/record-screen/delete', { params })
}
/**
 * 优先执行
 * @param options
 */
export const recordScreenFastFlagApi = (params: any): TResult<any> => {
  return Post('/record-screen/update/fastFlag', { params })
}

// 上传
export const uploadMaterialFileApi = (
  params: any,
  isForm: boolean = false
): TResult<any> => {
  return Post(`/upload/material`, { params, isForm })
}
// 批量上传
export const uploadMaterialBatchFileApi = (
  params: any,
  isForm: boolean = false
): TResult<any> => {
  return Post(`/upload/material/batch`, { params, isForm })
}
// 物料导入（Excel文件）
export const uploadMaterialsExcelFileApi = (
  params: any,
  isForm: boolean = false
): TResult<any> => {
  return Post(`/subject/upload-materials-excel`, { params, isForm })
}
// 新增录屏
export const AddScreenApi = (params: any): TResult<any> => {
  return Post(`/record-screen/save`, { params })
}
// 编辑录屏
export const UpdataScreenApi = (params: any): TResult<any> => {
  return Post(`/record-screen/update`, { params })
}
// 查询录屏详情
export const GetScreenDetailsApi = (params: any): TResult<any> => {
  return Get(`/record-screen/getId?${qs.stringify(params)}`)
}

// 获取广告来源
export const GetSysDictApi = (params: any): TResult<any> => {
  return Get(`/sys-dict?${qs.stringify(params)}`)
}
// 解析视频
export const ParseVideoDurationApi = (params: any): TResult<any> => {
  return Post(`/upload/parse-video-duration?${qs.stringify(params)}`)
}
// 获取模板列表
export const GetTempListApi = (params: any): TResult<any> => {
  return Get(`/click/template/page`, { params })
}

// 获取模板列表全部数据
export const GetTemplateAllApi = (params: any): TResult<any> => {
  return Get(`/click/template/all`)
}

/**
 * 删除录屏模板
 * @param options
 */
export const TempListDeleteApi = (params: any): TResult<any> => {
  return Post('/click/template/delete/batch', { params })
}

// 新增模板
export const AddTempApi = (params: any): TResult<any> => {
  return Post(`/click/template/save`, { params })
}
// 编辑模板
export const UpdataTempApi = (params: any): TResult<any> => {
  return Post(`/click/template/update`, { params })
}
// 查询模板详情
export const GetTempDetailsApi = (params: any): TResult<any> => {
  return Get(`/click/template/info?${qs.stringify(params)}`)
}
