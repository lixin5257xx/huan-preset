/*
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-01-16 10:07:17
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-05-18 10:33:53
 * @FilePath: \operation-web\src\views\order\use\order.ts
 * @Description:
 *
 * Copyright (c) 2023 by lixinxin lixinxin@huan.tv, All Rights Reserved.
 */
import { ref, reactive, nextTick, Ref } from 'vue'
import { handelSubmitCancelApi } from '@/config/api/index'
interface CANCELTYPE {
  id: number | null
  withdraw_msg: string
  name: string
}
const cancelLoading = ref(false)
export const useState = () => {
  const cancelReactive: CANCELTYPE = reactive({
    id: null,
    withdraw_msg: '',
    name: '',
  })
  return {
    cancelReactive,
  }
}

export const useCancelModel = (
  cancelReactive: CANCELTYPE,
  getData: any,
  resetPaginationPage: any
) => {
  const isPreview = ref(false)
  const resetModel = () => {
    cancelReactive.id = null
    cancelReactive.withdraw_msg = ''
    cancelReactive.name = ''
    isPreview.value = false
  }
  const handelSubmitCancel = async () => {
    if(!cancelReactive.withdraw_msg.trim()){
        window.$message.error('请输入撤单原因!')
        return false
    }
    cancelLoading.value = true
    handelSubmitCancelApi({
      withdraw_msg: cancelReactive.withdraw_msg,
      id: cancelReactive.id,
      status: -1,
    })
      .then((res) => {
        cancelLoading.value = false
        if (res.code == 200) {
          window.$message.success('撤单成功')
          resetModel()
          getData()
          resetPaginationPage()
        }
      })
      .catch((res) => {
        cancelLoading.value = false
      })
  }
  const handelCancelPreview = () => {
    resetModel()
  }
  return {
    isPreview,
    cancelLoading,
    handelSubmitCancel,
    handelCancelPreview,
  }
}
