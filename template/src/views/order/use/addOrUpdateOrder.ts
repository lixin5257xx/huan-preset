/*
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-01-16 10:07:17
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-06-05 19:02:34
 * @FilePath: \operation-web\src\views\order\use\addOrUpdateOrder.ts
 * @Description:
 *
 * Copyright (c) 2023 by lixinxin lixinxin@huan.tv, All Rights Reserved.
 */
import {
  ref,
  reactive,
  nextTick,
  Ref,
  h,
  RendererElement,
  RendererNode,
  VNode,
} from 'vue'
import { FormInst, FormItemRule } from 'naive-ui'
import {
  GetSysDictApi,
  GetOrderTemplateApi,
  UploadImportTemplateApi,
  GetShowStyleApi,
  GetSubjectListApi,
  getProductLineListApi,
  updateOrderApi,
  saveOrderApi,
  getOrderInfoApi,
} from '@api'
import { startOfDay, add, set, format } from 'date-fns/esm'

import { sortBy, cloneDeep, constant } from 'lodash'
import dayjs from 'dayjs'
import contants from './contants'
import { goAnchor } from '@/utils/index'
import { isUpdateSusceptible } from '@utils'

interface optionList {
  label?: string | number
  value?: string | number
}
interface MODELTYPE {
  id: number | null
  subject_id: number | null
  name: string
  type: string
  play_type: number | null
  brand: string | null
  product_name: string | null
  ad_space: string | null
  kpi_msg: string | null
  remarks_html: string | null
  remarks_text: string | null
  coo_time: any
  materials_ids: string | null
  file: any
  status: number | null
  kpi_type: number | null
  push_time_start: string | null
  push_time_end: string | null
  showUploadTable: boolean
  file_upload_flag: boolean
  out_time1_day_flag: boolean
  click_state: boolean
  advertiser_name: string
  industry_name: string
  advertiser_product_ids: any
  first_pass: number | string
}
var showSceneDefault = 'OTT-开机开屏'
// 项目列表
const projectList: any = ref([])

// 已选的项目名称
const subjectName = ref('')
// 已选媒体名称
const brandName = ref('')
// 已选广告位名称
const adSpaceName = ref('')
// 媒体list
const channelList: any = ref([])
// 广告位List
const advertiserList: any = ref([])
// 是否修改过名称
const taskNameStatus = ref(false)
// 行业list
const industryNamelist = ref([])

let model: any = reactive({
  id: null,
  name: '',
  subject_id: null,
  type: null,
  play_type: null,
  brand: null,
  product_name: null,
  ad_space: null,
  kpi_msg: '',
  remarks_html: '',
  remarks_text: '',
  coo_time: [],
  materials_ids: null,
  file: null,
  status: null,
  kpi_type: null,
  push_time_start: '',
  push_time_end: '',
  showUploadTable: false,
  file_upload_flag: false,
  out_time1_day_flag: false,
  click_state: false,
  // 广告主
  advertiser_name: '',
  // 行业
  industry_name: '',
  // 产品线
  advertiser_product_ids: [],
  // 是否审核通过（未通过：0；通过：1）
  first_pass: 0,
})
var oldModel: any = reactive({
  id: null,
  name: '',
  subject_id: null,
  type: null,
  play_type: null,
  brand: null,
  product_name: null,
  ad_space: null,
  kpi_msg: '',
  remarks_html: '',
  remarks_text: '',
  coo_time: [],
  materials_ids: null,
  file: null,
  status: null,
  kpi_type: null,
  push_time_start: '',
  push_time_end: '',
  showUploadTable: false,
  file_upload_flag: false,
  out_time1_day_flag: false,
  click_state: false,
  // 广告主
  advertiser_name: '',
  // 行业
  industry_name: '',
  // 产品线
  advertiser_product_ids: [],
  //  是否审核通过（未通过：0；通过：1）
  first_pass: 0,
})
const updateOrderName = () => {
  if (!taskNameStatus.value) {
    model.name = `${dayjs().format('MM_DD')}${subjectName.value ? '_' : ''}${
      subjectName.value
    }${brandName.value ? '_' : ''}${brandName.value}${
      adSpaceName.value ? '_' : ''
    }${adSpaceName.value}`
  }
}
export const useState = () => {
  const selProjectOption = ref(null)
  let modelRules = {
    modify_order_cause: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入修改原因',
    },
  }
  let rules = {
    subject_id: {
      required: true,
      type: 'number',
      trigger: ['blur', 'change'],
      message: '请选择项目！',
    },
    advertiser_product_ids: {
      required: true,
      type: 'array',
      trigger: ['blur', 'change'],
      message: '请选择产品线！',
    },
    type: {
      key: 'type',
      required: true,
      trigger: ['blur', 'change'],
      message: '请选择项投放模式！',
    },
    brand: {
      required: true,
      type: 'string',
      trigger: ['blur', 'change'],
      message: '请选择媒体！',
    },
    product_name: {
      required: true,
      type: 'string',
      trigger: ['blur', 'change'],
      message: '请选择产品名称！',
    },
    ad_space: {
      required: true,
      type: 'string',
      trigger: ['blur', 'change'],
      message: '请选择广告位！',
    },
    play_type: {
      required: true,
      type: 'number',
      trigger: ['blur', 'change'],
      message: '请选择交易类型！',
    },
    kpi_type: {
      required: true,
      type: 'array',
      trigger: ['blur', 'change'],
      message: '请选择KPI类型！',
    },
    kpi_msg: {
      required: true,
      trigger: ['blur', 'input'],
      message: '考核KPI不能为空！',
    },
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入订单名称',
    },
    coo_time: {
      required: true,
      type: 'array',
      trigger: ['blur', 'input'],
      validator(rule: FormItemRule, value: string) {
        if (value === '' || value === null) {
          return new Error('请选择订单周期！')
        } else if (
          (selProjectOption.value &&
            value[0] <
              dayjs(selProjectOption.value.coo_start_time).valueOf()) ||
          (selProjectOption.value &&
            value[1] > dayjs(selProjectOption.value.coo_end_time).valueOf())
        ) {
          return new Error('订单周期必须在所属项目周期内!')
        }
        return true
      },
    },
    materials_ids: {
      required: true,
      type: 'array',
      trigger: ['blur', 'change'],
      message: '请选择素材！',
    },
    file: {
      required: true,
      type: 'any',
      trigger: ['change'],
      message: '请上传文件！',
    },
  }

  const formRef = ref<any>(null)
  return {
    model,
    rules,
    modelRules,
    formRef,
    selProjectOption,
    taskNameStatus,
  }
}

export const useHandle = (
  model: MODELTYPE,
  formRef: any,
  projectList: any,
  selProjectOption: any,
  filePathList: any,
  taskNameStatus: any
) => {
  const productLineList: any = ref([])

  const flags = reactive({
    type: '',
  })
  const isShowChoice = (coo_time: any) => {
    if (!coo_time) return false
    return model.status == 2
  }
  const updateTime = (params: any) => {
    console.log('params', params)
    model.push_time_start = params.coo_start_time
    model.push_time_end = params.coo_end_time
    model.coo_time = [model.push_time_start, model.push_time_end]
  }
  //   重置表单
  const resetModel = () => {
    model.product_name = showSceneDefault
    updateOrderName()
    model.brand = 'MT_TCL'
    model.ad_space = null
    model.kpi_msg = ''
    model.remarks_html = ''
    model.remarks_text = ''
    model.coo_time = []
    model.materials_ids = null
    model.file = null
    model.status = null
    model.kpi_type = null
    model.push_time_start = ''
    model.push_time_end = ''
    model.play_type = 2
    model.showUploadTable = false
    model.click_state = false
    // 产品线
    model.advertiser_product_ids = []
    model.industry_name = ''
  }
  const subject_old_id = ref()
  //   选择项目
  const handleChangeProject = (e: any) => {
    console.log('e', e)
    if (subject_old_id.value === e) return false
    subject_old_id.value = e
    const selOption = projectList.value.filter((item: any) => {
      if (item.id == e) {
        flags.type = item.type.toString().split(',')
        if (flags.type.length == 1) {
          model.type = flags.type[0]
        } else {
          model.type = ''
        }
      }
      return item.id == e
    })
    if (selOption.length > 0) {
      selProjectOption.value = selOption[0]
      subjectName.value = selProjectOption.value.name
      console.log('selProjectOption', selProjectOption.value)
      const advertiser_info = selProjectOption.value.advertiser_info
      //   素材
      filePathList.value = selProjectOption.value.materials
      //   广告主
      model.advertiser_name = advertiser_info.advertiser.name
      //   产品线
      productLineList.value = advertiser_info.advertiser_products || []
    } else {
      filePathList.value = []
      selProjectOption.value = null
      model.advertiser_name = ''
      productLineList.value = []
      subjectName.value = ''
    }
    resetModel()
  }
  //   修改媒体
  const handleChangeBrand = (e: any) => {
    const selOption = channelList.value.filter((item: any) => {
      return item.value == e
    })
    if (selOption.length > 0) {
      //   行业
      brandName.value = selOption[0].label
    } else {
      brandName.value = ''
    }
    updateOrderName()
  }
  const handleChangeAdSpace = (e) => {
    const selOption = advertiserList.value.filter((item: any) => {
      return item.value == e
    })
    if (selOption.length > 0) {
      //   行业
      adSpaceName.value = selOption[0].name
    } else {
      adSpaceName.value = ''
    }
    updateOrderName()
  }
  const handleChangeProductLine = (e: any) => {
    console.log('e', e)
    const selOption = e.map((item: any) => {
      return productLineList.value.filter((productItem: any) => {
        return item == productItem.id
      })
    })

    console.log('selOption', selOption)
    if (selOption.length > 0) {
      //   行业
      //   model.industry_name = selOption[0].industry
      let industryArr = []
      industryArr = selOption.map((item: any) => {
        const sel = item[0]
        console.log('sel', sel)
        return `${sel.name}：${sel.industry}`
      })
      console.log('industryArr', industryArr)
      model.industry_name = industryArr.join('，')
      industryNamelist.value = industryArr
    } else {
      model.industry_name = ''
      industryNamelist.value = []
    }
  }
  // 录屏名称是否修改
  const changeOrderName = (v: string | [string, string]) => {
    taskNameStatus.value = true
  }
  return {
    flags,
    isShowChoice,
    handleChangeProject,
    handleChangeProductLine,
    productLineList,
    updateTime,
    changeOrderName,
    handleChangeBrand,
    handleChangeAdSpace,
    industryNamelist,
  }
}

export const useMounted = (model: any, taskNameStatus: any, route: any) => {
  const showStyle: any = ref([])
  const filePathList: any = ref([])
  const kpiTypeList: any = ref([])
  //   获取项目
  const getProjectList = async () => {
    let { data, code } = await GetSubjectListApi({
      status_open_flag: true,
      subjectId: route.query.id ? model.subject_id : '',
    })
    if (code == 200) {
      projectList.value = data
    }
    return data
  }

  //   获取媒体
  const getChannelList = async () => {
    let tempRes = await GetSysDictApi({ type: 'MT' })
    if (tempRes.code == 200) {
      tempRes.data.forEach((item: any) => {
        item.label = item.name
      })
      channelList.value = [...tempRes.data]
      model.brand = 'MT_TCL'
      brandName.value = 'TCL'
      console.log('999')
      updateOrderName()
    }
  }
  // 获取产品名称
  const getShowStyle = async () => {
    let tempRes = await GetShowStyleApi({ type: 'ADVERTISING' })
    if (tempRes.code == 200) {
      tempRes.data.forEach((item: any) => {
        item.label = item.name
      })
      model.product_name = showSceneDefault
      showStyle.value = [...tempRes.data]
      getAdvertiserList(model.product_name)
    }
  }

  //   获取广告位
  const getAdvertiserList = async (e: any) => {
    const adList = showStyle.value.filter((item: any) => {
      return item.value == e
    })
    advertiserList.value = adList.length > 0 ? adList[0].sub_list : []
  }
  //   获取KPI
  const getKpiTypeList = async () => {
    let tempRes = await GetSysDictApi({ type: 'KPI_TYPE' })
    if (tempRes.code == 200) {
      tempRes.data.forEach((item: any) => {
        item.label = item.name
      })
      kpiTypeList.value = [...tempRes.data]
    }
  }
  const handleChangeAdType = (e: any) => {
    getAdvertiserList(e)
    model.ad_space = null
  }
  return {
    getProjectList,
    projectList,
    filePathList,
    channelList,
    advertiserList,
    showStyle,
    kpiTypeList,
    getChannelList,
    getShowStyle,
    getKpiTypeList,
    handleChangeAdType,
  }
}

export const useSubmit = (
  model: any,
  formRef: any,
  type: any,
  router: any,
  showChangeOrderModel: any,
  flags: any
) => {
  const create = () => {
    window.$notification.destroyAll()
    formRef.value.validate((error: any) => {
      if (error) {
        const data = error.map((item: any) => {
          return {
            name: item[0].field,
            value: contants.order[item[0].field],
            message: item[0].message,
          }
        })
        let resultList: VNode<
          RendererNode,
          RendererElement,
          { [key: string]: any }
        >[] = []
        window.$notification['error']({
          content: '请检查以下选项',
          meta: () => {
            data.forEach((item) => {
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
                          default: () => `${item.value}`,
                        }
                      ),
                      h(
                        'div',
                        {
                          onClick: () => {
                            goAnchor('#' + item.name)
                          },
                          className: 'error-content',
                        },
                        {
                          default: () => `1、${item.message}`,
                        }
                      ),
                    ],
                  }
                )
              )
            })
            return resultList
          },
        })
      } else {
        model.click_state = true
        let formModel = cloneDeep(model)
        formModel.push_time_start = dayjs(formModel.coo_time[0]).format(
          'YYYY-MM-DD'
        )
        formModel.push_time_end = dayjs(formModel.coo_time[1]).format(
          'YYYY-MM-DD'
        )
        delete formModel.coo_time
        saveOrderApi(formModel)
          .then((res) => {
            if (res.code != 200) {
              model.click_state = false
              return
            }
            window.$message.success('新增成功')
            //    重置所有基础选项
            if (flags.type.length == 1) {
              model.type = flags.type[0]
            } else {
              model.type = null
            }

            model.name = null
            model.play_type = null
            model.brand = null
            model.product_name = null
            model.ad_space = null
            model.kpi_msg = ''
            model.remarks_html = ''
            model.remarks_text = ''
            model.coo_time = []
            model.materials_ids = null
            model.file = null
            model.status = null
            model.kpi_type = null
            model.push_time_start = ''
            model.push_time_end = ''
            model.showUploadTable = false
            model.file_upload_flag = false
            model.out_time1_day_flag = false
            model.click_state = false
          })
          .catch(() => {
            model.click_state = false
          })
      }
    })
  }
  const submit = () => {
    window.$notification.destroyAll()
    formRef.value.validate((error: any) => {
      if (error) {
        const data = error.map((item: any) => {
          return {
            name: item[0].field,
            value: contants.order[item[0].field],
            message: item[0].message,
          }
        })
        let resultList: VNode<
          RendererNode,
          RendererElement,
          { [key: string]: any }
        >[] = []
        window.$notification['error']({
          content: '请检查以下选项',
          meta: () => {
            data.forEach((item) => {
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
                          default: () => `${item.value}`,
                        }
                      ),
                      h(
                        'div',
                        {
                          onClick: () => {
                            goAnchor('#' + item.name)
                          },
                          className: 'error-content',
                        },
                        {
                          default: () => `1、${item.message}`,
                        }
                      ),
                    ],
                  }
                )
              )
            })
            return resultList
          },
        })
      } else {
        let formModel = cloneDeep(model)
        formModel.push_time_start = dayjs(formModel.coo_time[0]).format(
          'YYYY-MM-DD'
        )
        formModel.push_time_end = dayjs(formModel.coo_time[1]).format(
          'YYYY-MM-DD'
        )
        delete formModel.coo_time

        if (type.value == 'update') {
          const keys = [
            'subject_id',
            'advertiser_name',
            'advertiser_product_ids',
            'industry_name',
            'type',
            'play_type',
            'brand',
            'product_name',
            'ad_space',
            'kpi_type',
            'remarks_html',
            'file_path',
            'coo_time',
            'name',
          ]

          // 检查敏感信息修改
          if (
            model.first_pass == 1 &&
            isUpdateSusceptible(oldModel, model, keys)
          ) {
            console.log('检测到敏感信息')
            showChangeOrderModel.value = true
            return false
          } else {
            model.click_state = true
            updateOrderApi(formModel)
              .then((res) => {
                if (res.code != 200) {
                  model.click_state = false
                  return
                }
                window.$message.success('更新成功')
                router.push('/order')
              })
              .catch(() => {
                model.click_state = false
              })
          }
        } else {
          model.click_state = true
          saveOrderApi(formModel)
            .then((res) => {
              if (res.code != 200) {
                model.click_state = false
                return
              }
              window.$message.success('新增成功')
              router.push('/order')
            })
            .catch(() => {
              model.click_state = false
            })
        }
      }
    })
  }
  const handelSubmitReason = (modify_msg: any) => {
    let formModel = cloneDeep(model)
    formModel.push_time_start = dayjs(formModel.coo_time[0]).format(
      'YYYY-MM-DD'
    )
    formModel.push_time_end = dayjs(formModel.coo_time[1]).format('YYYY-MM-DD')
    delete formModel.coo_time
    if (modify_msg) {
      formModel.modify_order_cause = modify_msg
      model.click_state = true
      updateOrderApi(formModel)
        .then((res) => {
          if (res.code != 200) {
            model.click_state = false
            return
          }
          window.$message.success('更新成功')
          router.push('/order')
        })
        .catch(() => {
          model.click_state = false
        })
      showChangeOrderModel.value = false
    }
  }
  return {
    create,
    submit,
    handelSubmitReason,
  }
}

export const useDetail = (
  model: any,
  route: any,
  taskNameStatus: any,
  projectList: any,
  selProjectOption: any,
  filePathList: any,
  showStyle: any,
  advertiserList: any,
  importRef: any,
  productLineList: any,
  isSkeleton: any
) => {
  // 获取详情后 返回当前已选项目下的内容
  const setDetailFilePathList = () => {
    const selOption = projectList.value.filter((item: any) => {
      return item.id == model.subject_id
    })
    if (selOption.length > 0) {
      selProjectOption.value = selOption[0]
      const { materials, advertiser_info } = selProjectOption.value
      filePathList.value = materials
      model.advertiser_name = advertiser_info.advertiser.name
      productLineList.value = advertiser_info.advertiser_products || []
      const advertiserProductList = model.advertiser_product_ids.map(
        (item: any) => {
          return productLineList.value.filter((productLineItem: any) => {
            return item == productLineItem.id
          })
        }
      )
      console.log('selAdOption[0]', advertiserProductList)

      industryNamelist.value = advertiserProductList.map((item) => {
        const sel = item[0]
        return `${sel.name}：${sel.industry}`
      })
      //   industryNamelist.value =
    } else {
      filePathList.value = []
      selProjectOption.value = null
    }
  }
  const tableSchedule = reactive({
    cols: null,
    head: null,
  })
  const getDetail = async () => {
    const id: any = route.query.id
    const type: any = route.query.type
    if (id) {
      //   paginationReactive.disabled = true
      let { data, code } = await getOrderInfoApi({
        id: id,
      })
      if (code == 200) {
        model = Object.assign(model, data)
        model.file_upload_flag = false
        model.status = data.status
        // 录屏名称不跟随展示场景修改
        taskNameStatus.value = data.status
        model.out_time1_day_flag = data.out_time1_day_flag
        model.name = data.name
        model.id = id
        model.type = data.type.toString()
        model.subject_id = data.subject_id
        model.advertiser_name = data.advertiser_name
        model.advertiser_product_ids = data.advertiser_product_ids
        model.play_type = data.play_type != null ? Number(data.play_type) : null
        model.brand = data.brand
        model.product_name = data.product_name
        model.ad_space = data.ad_space
        model.kpi_msg = data.kpi_msg
        model.kpi_type = data.kpi_type
        model.remarks_html = data.remarks_html
        model.remarks_text = data.remarks_text
        model.coo_time = [
          dayjs(data.push_time_start).valueOf(),
          dayjs(data.push_time_end).valueOf(),
        ]
        // model.materials_ids = data.materials_ids

        model.push_time_start = data.push_time_start
        model.showUploadTable = data.showUploadTable
        model.file_path = data.file_path
        model.first_pass = data.first_pass || 0
        tableSchedule.head = data.schedule.head
        tableSchedule.cols = data.schedule.cols
        const adList = showStyle.value.filter((item: any) => {
          return item.value == model.product_name
        })
        advertiserList.value = adList.length > 0 ? adList[0].sub_list : []
        // 这里是处理已删除项目后订单项目丢失时的逻辑，传订单已存的项目名称进行查询，返回项目失效的状态
        let parmas = {
          subject_id: model.subject_id,
        }
        await GetSubjectListApi(parmas).then((res) => {
          if (res.code == 200) {
            projectList.value = res.data.map((item: any) => {
              item.name = `${item.name}（ID：${item.id}，周期：${dayjs(
                item.coo_start_time
              ).format('YYYY-MM-DD')} 至 ${dayjs(item.coo_end_time).format(
                'YYYY-MM-DD'
              )}）`
              return item
            })
          }
        })
        setDetailFilePathList()
        // 保存一份数据，最后用来比较敏感信息
        oldModel = cloneDeep(model)
        isSkeleton.value = false
        nextTick(() => {
          console.log('importRef', importRef.value)
          importRef.value.paginationReactive.disabled =
            (model.status == 4 && model.out_time1_day_flag) ||
            model.status == -1
              ? true
              : false
        })
      }
    }
  }
  return {
    getDetail,
    tableSchedule,
  }
}

export const useCancel = (router: any) => {
  const goBack = () => {
    router.push({
      name: 'order',
    })
  }
  return { goBack }
}

export const useModel = (model: any, router: any) => {
  const showChangeOrderModel = ref(false)
  //   modelReactive
  const changeModel = reactive({
    modify_order_cause: '',
  })
  //   取消
  const cancelCallback = () => {
    showChangeOrderModel.value = false
    changeModel.modify_order_cause = ''
  }
  //   弹窗提交
  const submitCallback = () => {}
  return {
    showChangeOrderModel,
    changeModel,
    cancelCallback,
    submitCallback,
  }
}

export const useEdit = (model: any) => {
  const toolbarKeys = [
    'bold',
    // 'clearStyle',
    'color',
    // 'bgColor',
    '|',
    // 菜单组，包含多个菜单
    // {
    //     key: 'group-image', // 必填，要以 group 开头
    //     title: '图片', // 必填
    //     iconSvg: '<svg></svg>',
    //     menuKeys: ['uploadImage',
    //         'insertImage',
    //         'deleteImage',
    //         'editImage',
    //         'viewImageLink']
    // },
    // {
    //     key: 'group-video',
    //     title: '视频',
    //     iconSvg: '',
    //     menuKeys: ['insertVideo',
    //         'uploadVideo']
    // },
    // {
    //     key: 'group-link',
    //     title: '链接',
    //     menuKeys: ['insertLink', 'editLink', 'unLink', 'viewLink']
    // },
    // {
    //     key: 'group-table',
    //     title: '表格',
    //     menuKeys: ['insertTable',
    //         'deleteTable',
    //         'insertTableRow',
    //         'deleteTableRow',
    //         'insertTableCol',
    //         'deleteTableCol',
    //         'tableHeader',
    //         'tableFullWidth']
    // },
    // 'divider', //分割线
    // 'emotion', //表情
    // 'blockquote', //引用
    // 'headerSelect', //标题
    // 'redo', //重做
    // 'undo', //撤销
    // 'fullScreen' //全屏
  ]
  const getRemarks = (val: any) => {
    model.remarks_html = val
    // model.remarks_text = val
  }
  const getRemarksText = (val: any) => {
    model.remarks_text = val
  }
  return {
    toolbarKeys,
    getRemarks,
    getRemarksText,
  }
}
