import {
  ref,
  onMounted,
  nextTick,
  reactive,
  computed,
  onDeactivated,
} from 'vue'
import {
  useRouter,
  useRoute,
  Router,
  RouteLocationNormalized,
} from 'vue-router'
import { cloneDeep, uniqueId } from 'lodash'
import { DownLoadBlobFile } from '@utils'
import useStore from '@/config/pinia'
import dayjs from 'dayjs'
import { Post, TResult, Get } from '@/config/api/request'
import {
  getSubSellInfoApi,
  getSubSellPriceInfoApi,
  UploadSubTemplateApi,
  uploadFileApi,
  GetContractListApi,
  GetEmployeeListApi,
  updateSubSellSaveApi,
  ExportSubTemplateApi,
} from '@/config/api'
import { isUpdateSusceptible } from '@utils'

const contractList: any = ref([])
const first_pass = ref(0)

const model: any = reactive({
  finance_time: null,
  company_body_name: '',
  company_name: null,
  contract_id: null,
  email_image: [],
  submit_email_image: [],
})
var oldModel: any = reactive({
  finance_time: null,
  company_body_name: '',
  company_name: null,
  contract_id: null,
  email_image: [],
  submit_email_image: [],
})
const scrollWidth = ref(1500)

const templateData = ref([])
const oldTemplateData = ref([])
const projectId = ref()
const projectStatus = ref()
const projectStartTime = ref()
const projectEndTime = ref()
// 防重复提交loading
const submitLoading = ref(false)
// 敏感弹出框
const showChangeOrderModel = ref(false)
export const useState = (
  id: any,
  status: any,
  coo_time_between: any,
  firstPass: any
) => {
  const arr = coo_time_between.split('至')
  console.log('arr', arr)
  projectId.value = id || ''
  projectStatus.value = status || ''
  projectStartTime.value = arr.length > 1 ? dayjs(arr[0].trim()).valueOf() : ''
  projectEndTime.value = arr.length > 1 ? dayjs(arr[1].trim()).valueOf() : ''
  first_pass.value = firstPass || 0
  console.log('model.first_pass', first_pass.value)
  const nowDay = dayjs(new Date()).valueOf()
  //   model.finance_time = nowDay
  //   oldModel.finance_time = nowDay
  const dateDisabled = (ts: number) => {
    const date = new Date(ts).getTime()
    return date < projectEndTime.value || date > new Date().getTime()
  }
  return {
    model,
    submitLoading,
    projectId,
    projectStatus,
    projectStartTime,
    projectEndTime,
    contractList,
    showChangeOrderModel,
    dateDisabled,
  }
}

export const useSubmit = (router: any) => {
  const submitCallback = async () => {
    if (!model.finance_time && projectStatus.value == 30) {
      window.$message.error('请选择归属日期')
      return false
    }
    const params = {
      contract_id: model.contract_id,
      subject_id: projectId.value,
      finance_time:
        projectStatus.value == 30
          ? dayjs(model.finance_time).format('YYYY-MM-DD')
          : '',
      email_image: model.submit_email_image.map((item: any) => {
        return item.url
      }),
      shell_list: templateData.value,
    }
    const keys = [
      'company_body_name',
      'company_name',
      'contract_id',
      'submit_email_image',
    ]

    // 检查敏感信息修改
    if (first_pass.value == 1 && isUpdateSusceptible(oldModel, model, keys)) {
      console.log('检测到敏感信息')
      showChangeOrderModel.value = true
      return false
    } else {
      submitLoading.value = true
      updateSubSellSaveApi(params)
        .then((res) => {
          if (res.code == 200) {
            window.$message.success('保存成功')
            model.email_image = []
            model.submit_email_image = []
            router.push({
              name: 'project',
            })
          }
          submitLoading.value = false
        })
        .catch(() => {
          submitLoading.value = false
        })
    }
  }
  //获取修改原因
  const handelSubmitReason = async (modify_msg: any) => {
    const params = {
      contract_id: model.contract_id,
      subject_id: projectId.value,
      email_image: model.submit_email_image.map((item: any) => {
        return item.url
      }),
      shell_list: templateData.value,
      modify_order_cause: modify_msg,
    }
    if (submitLoading.value) {
      return false
    }
    submitLoading.value = true
    let tempRes = await updateSubSellSaveApi(params)
    if (tempRes.code == 200) {
      model.email_image = []
      model.submit_email_image = []
      window.$message.success('保存成功')
      router.push({
        name: 'project',
      })
    }
    submitLoading.value = false
  }
  return {
    handelSubmitReason,
    submitCallback,
  }
}

export const useDetails = () => {
  let contractDetailsRef: any = ref(null)

  const showContractDetails = () => {
    contractDetailsRef.value.openShow()
  }
  return {
    contractDetailsRef,
    showContractDetails,
  }
}

export const useTable = () => {
  const templateColumns = ref([
    {
      title: '媒体',
      key: 'brand_name',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '产品名称',
      key: 'product_name_name',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '广告位',
      key: 'ad_space_name',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '市场',
      key: 'market',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '折前单价',
      key: 'price',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '折后单价',
      key: 'discount_price',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '项目返点方式',
      key: 'return_point_type',
      minWidth: 120,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '项目返点',
      key: 'return_point_name',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '框架返点方式',
      key: 'policy_return_point_type',
      minWidth: 120,
      width: 120,
      customStatus: 'left',
    },
    {
      title: '框架返点',
      key: 'policy_return_point_name',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
    {
      title: '策略',
      key: 'strategy',
      minWidth: 100,
      width: 100,
      customStatus: 'left',
    },
  ])
  return {
    templateColumns,
    templateData,
    scrollWidth,
  }
}

export const useHandel = () => {
  const contractChange = (id: any) => {
    let info = contractList.value.find((item: any) => item.id == id)
    if (info) {
      model.company_body_name = info.company_body_name
      model.company_name = info.company_name
    }
  }
  return {
    contractChange,
  }
}
const upload = async (file: any) => {
  return await uploadFileApi({ file: file.file }).then((res) => {
    file.status = 'finished'
    file.url = res.data.path
    file.name = res.data.file_name
    return file
  })
}
export const useUploadImg = () => {
  const uploadRef = ref()
  const imageUpload = ({ file }) => {
    console.log('file', file)
    const size = file.file.size
    const maxSize = 1024 * 1024 * 15
    if (size > maxSize) {
      window.$message.error('图片最大限制15MB，请重新上传!')
      return false
    }
    return true
    // return false
  }

  const removeImage = (options) => {
    model.submit_email_image = model.submit_email_image.filter((item) => {
      return item.url != options.file.url
    })
  }
  const handleUploadChange = (data: any) => {
    model.email_image = data.fileList
  }
  const uploadAction = import.meta.env.VITE_API_HOST + '/upload/file'
  //   const uploadAction = '/upload/file'
  const store = useStore()
  const users = store.tokenData
  const actionHeaders = {
    Authorization: `bearer ${users['access_token']}`,
  }
  const uploadFinish = (options: any) => {
    const { response } = options.event.currentTarget
    const { code, data } = JSON.parse(response)
    if (code == 200) {
      model.submit_email_image.push({
        status: 'finished',
        url: data.path,
        name: data.file_name,
      })
    }
  }
  return {
    imageUpload,
    removeImage,
    uploadRef,
    uploadAction,
    uploadFinish,
    handleUploadChange,
    actionHeaders,
  }
}

export const useMounted = (isSkeleton: any) => {
  var n = 0
  const updateSkeleton = () => {
    n++
    if (n == 3) {
      n = 0
      isSkeleton.value = false
    }
  }
  // 合同列表
  const getContractList = async () => {
    let tempRes = await GetContractListApi()
    if (tempRes.code == 200) {
      contractList.value = [...tempRes.data]
      updateSkeleton()
    }
  }

  const getSallDetails = async () => {
    let { data, code } = await getSubSellInfoApi({
      id: projectId.value,
    })
    if (code == 200) {
      const imgArr = data.email_image || []
      model.contract_id = data.contract_id
      model.company_body_name = data.company_body_name
      model.company_name = data.company_body_name
      model.email_image = imgArr.map((item: any) => {
        return {
          url: item,
          status: 'finished',
          id: item,
        }
      })
      model.submit_email_image = imgArr.map((item: any) => {
        return {
          url: item,
          status: 'finished',
        }
      })
      // 保存一份数据，最后用来比较敏感信息
      oldModel = cloneDeep(model)
      updateSkeleton()
    }
  }
  const getSellPriceInfo = async () => {
    let { data, code } = await getSubSellPriceInfoApi({
      id: projectId.value,
    })
    if (code == 200) {
      templateData.value = data.shell_list || []
      oldTemplateData.value = data.shell_list || []
      updateSkeleton()
    }
  }
  return {
    getContractList,
    getSallDetails,
    getSellPriceInfo,
  }
}

export const useUploadFile = (route: any) => {
  const batchTemplateUpload = ref()
  /**
   * 清除上传文件
   */
  const clearFilesUpload = () => {
    batchTemplateUpload.value.clear()
  }
  //   导入
  const handleUploadFile = async (
    options: Promise<boolean | void> | boolean | void
  ) => {
    console.log('options', options)
    console.log('options', options.file.file)
    try {
      await UploadSubTemplateApi({
        file: options.file.file,
        subjectId: projectId.value,
      }).then((res) => {
        if (res.code == 200) {
          console.log('res.data.shell_list', res.data.shell_list)
          // props.model.showUploadTable = true
          window.$message.success('导入成功!')
          templateData.value = res.data.shell_list
          scrollWidth.value = res.data.head.length * 160
        }
      })
    } catch (e) {
      console.log('执行失败')
    }
    clearFilesUpload()
  }
  //   导出
  const downLoadTemplate = async () => {
    await ExportSubTemplateApi({
      subjectId: projectId.value,
    }).then((res) => {
      DownLoadBlobFile(
        res,
        `${route.query.name}_${projectId.value}_单价返点.xlsx`
      )
    })
  }
  return {
    batchTemplateUpload,
    handleUploadFile,
    downLoadTemplate,
  }
}
