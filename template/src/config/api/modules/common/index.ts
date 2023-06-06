/*
 * @Description: Do not edit
 * @Author: 文件创建人：任亮
 * @Date: 2022-10-25 14:39:16
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-06-05 16:06:50
 */
import { Post, TResult, Get } from "../../request";
import { rasEncrypt } from "@utils";
import qs from 'qs'
/**
 * 登陆
 * @param options
 */
export const loginApi = (params: any): TResult<any> => {
  return Post('/oauth/token', { params , isAuth: true })
}

/**
 * 用户登出
 */
export const loginOutApi = (): TResult<any> => {
  return Get('/oauth/revokeToken')
}

/**
 * 发送验证码
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13886
 */
 export const SendCaptchaCodeApi = (email: string): TResult<any> => {
  return Get(`/user/sendCode?email=${email}`,{isToken:false })
}
/**
 * 重置密码
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13871
 */
 export const ChangePasswordApi = (params: any): TResult<any> => {
  return Post('/user/updatePasswordByCode', { params,isToken:false })
}

/**
 * 详细
 * @param options
 */
export const getUserInfoApi = (params: any): TResult<any> => {
  return Get('/oauth/info', { params })
}

// 获取所有权限集合
export const getSysMenuListApi = (params: any): TResult<any> => {
  return Get(`/sysMenu/list`,{params});
};

// 保存或者修改自定义列头
export const updateColumnsApi = (params: any): TResult<any> => {
  return Post(`/custom/save`, { params });
};
// 自定义列查询
export const getColumnsInfoApi = (params: any): TResult<any> => {
  return Get(`/custom/find`, { params });
};

/**
 * 字典查询
 * @params AD_SOURCE-广告来源字典库 ; APP_PACKET-应用包名 DSP - dsp ；
 * SUPERVISE_COMPANY：监测公司
 */
export const getSysDictListApi = (params: any): TResult<any> => {
    return Get("/sys-dict",{params});
};

// 区域模块列表
export const getRegionListApi = (params:any): TResult<any> => {
  return Get("/region/list",{params});
};

// 根据token 获取区域列表
export const getParentRegionListApi = (params:any): TResult<any> => {
    return Get("/region/parentListByUser",{params});
};


// 公司模块列表
export const getCompanyListApi = (): TResult<any> => {
    return Get("/company/list");
};

// 广告主列表
export const getAdvertiserListApi = (): TResult<any> => {
    return Get("/advertiser/list");
};

// 文件上传
export const uploadFileApi = (params:any): TResult<any> => {
    return Post("/upload/file",{params,isForm:true});
};
// 文件批量上传
export const uploadFileBatchApi = (params: any, isForm: boolean = false): TResult<any> => {
    return Post("/upload/file/batch",{ params, isForm });
};

/**
 * 改单记录列表
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13941
 * @param options
 */
export const GetSubjectTaskPageApi = (params: any): TResult<any> => {
    return Get(`/update-log/page?${qs.stringify(params)}`)
}
/**
 * 改单记录详情
 * http://api-center-bigdata.huan.tv/project/681/interface/api/13941
 * @param options
 */
export const GetSubjectTaskInfoApi = (params: any): TResult<any> => {
    return Get(`/update-log/info?${qs.stringify(params)}`)
}