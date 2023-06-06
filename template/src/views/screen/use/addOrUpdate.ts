import { ref, reactive, nextTick, Ref } from 'vue'
import { FormInst, FormItemRule } from 'naive-ui'
import {
  AddScreenApi,
  UpdataScreenApi,
  GetSysDictApi,
  GetTemplateAllApi,
} from '@/config/api/index'
import { showStyle, brands, timeVerification } from '../../constant/screen'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { format } from 'path'
export const useState = () => {
  const formRef = ref<FormInst | null>(null)
  const closeTimeInput: any = ref([])
  const taskNameStatus = ref(false)

  const model = ref({
    id: '',
    // 上传文件ID
    module_id: null,
    weather_alert_image_list: [
      {
        path: '',
      },
    ],
    weather_info_image_list: [
      {
        path: '',
      },
    ],
    weather_info_content: '',
    weather_city_cid: '',
    // 展示场景
    ad_type: 1,
    // 自动播放
    auto_play: 1,
    package_name: null,
    //开播类型
    broadcast_type: 2,
    // 是否预约
    corner_type: 1,
    // 图片时长
    poll_time: 8,
    // 电视台
    record_prev_jump: '',
    // 预约文案
    appointment_corner_text: '',
    // 弹窗位置
    corner_location: 1,
    // 弹窗x轴偏移量值
    corner_offset_x: null,
    // 弹窗y轴偏移量值
    corner_offset_y: null,
    // 点击支持
    click_type: 1,
    web_url: '',
    video_url: '',
    // 广告来源
    ad_source_id: '',
    // 来源位置
    ad_source_location: 4,
    close_button_time: null,
    // 关闭按钮出现时间
    close_button_time_long: -1,
    screenshot: 0,
    scene_change: 1,
    screenshot_time_long: '',
    item_list: [
      {
        brand: 'TCL',
        baidu_flag: 1,
        module_id: null,
      },
    ],
    task_record_time: null,
    sinatv_type: 0,
    delay_second: null,
    task_name: '',
    task_name_left: '',
    task_name_right: '',
    description: '',
    // 是否显示倒计时
    count_down: 1,
    nestedValue: {
      corner_offset_x: null,
      corner_offset_y: null,
    },
    closeObj: {
      close_button_time: null,
    },
    screen_shot_list: <any>[null],
    material_list: [
      {
        path: '',
      },
    ],
    click_position: '',
    // click_params: {
    //   jump_type: 1,
    //   package_name: '',
    //   class_name: '',
    //   intent_action: '',
    //   action_url: '',
    //   web_url: '',
    //   parameter: [
    //     {
    //       key: '',
    //       value: '',
    //       type: null,
    //     },
    //   ],
    // },
    show_time: null,
    // 标准时间
    real_time_flag: 0,
    // 播放剧目
    click_app_template_id: null,
    // 应用直达
    click_template_id: null,
    // 点击状态
    click_state: false,
  })
  const rules = {
    ad_type: {
      required: true,
    },
    task_name_left: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入录屏名称',
    },
    auto_play: {
      required: true,
      type: 'number',
    },
    module_id: {
      required: true,
      type: 'number',
      trigger: ['blur', 'input'],
      message: '请输入绑定ID',
    },
    package_name: {
      required: true,
      trigger: ['change'],
      message: '请选择应用',
    },
    click_app_template_id: {
      required: true,
      type: 'number',
      trigger: ['change'],
      message: '请选择开始播放的剧目',
    },
    record_prev_jump: {
      required: true,
      trigger: ['change'],
      message: '请选择开始播放的电视台',
    },
    weather_info_content: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入落地页文案',
    },
    weather_city_cid: {
      required: true,
      trigger: ['change'],
      message: '请搜索或下拉选择城市',
    },
    ad_source_location: {
      required: true,
      trigger: 'change',
      message: '请选择来源位置',
      type: 'number',
    },
    corner_type: {
      required: true,
      trigger: 'change',
      type: 'number',
    },
    click_type: {
      required: true,
      trigger: 'change',
      type: 'number',
    },
    broadcast_type: {
      required: true,
      trigger: 'change',
      type: 'number',
    },
    poll_time: {
      type: 'number',
      required: true,
      trigger: ['input', 'blur'],
      validator(rule: FormItemRule, value: string) {
        if (value === '' || value === null) {
          return new Error('请输入图片时长')
        } else if (!/^[0-9]+$/.test(value)) {
          return new Error('请输入1-99正整数')
        }
        return true
      },
    },
    task_record_time: {
      required: true,
      trigger: ['blur', 'change'],
      validator(rule: FormItemRule, value: string) {
        if (value === '' || value === null) {
          return new Error('请选择录屏时间')
        } else if (
          model.value.sinatv_type == 1 &&
          (model.value.delay_second === '' || model.value.delay_second === null)
        ) {
          return new Error('请输入延迟时间')
        }
        return true
      },
    },
    sinatv_type: {
      required: true,
      type: 'number',
      trigger: ['blur', 'change'],
      message: '请选择是否直播',
    },
    // 弹窗位置
    corner_location: {
      required: true,
      type: 'number',
      trigger: 'change',
      message: '请选择弹窗位置',
    },
    appointment_corner_text: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入预约文案',
    },
    web_url: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入WEB页面地址',
      // validator(rule: FormItemRule, value: string) {
      //   if (value === "" || value === null) {
      //     return new Error("请输入WEB页面地址");
      //   } else if (!/^(http|https|ftp):\/\/.*$/.test(value)) {
      //     return new Error("请输入正确的WEB页面地址");
      //   }
      //   return true;
      // },
    },
    video_url: {
      required: true,
      trigger: ['blur', 'input'],
      validator: (rule: FormItemRule, value: string) => {
        if (!value) {
          return new Error('请输入播放视频地址')
        }
        return true
      },
    },
    click_template_id: {
      required: true,
      trigger: 'change',
      message: '请选择应用直达',
      type: 'number',
    },
    click_position: {
      required: true,
      type: 'number',
      trigger: ['blur', 'input'],
      message: '请输入素材点击',
    },
    // click_params: {
    //   jump_type: {
    //     required: true,
    //     type: 'number',
    //     trigger: 'change',
    //   },
    // },
    close_button_time_long: {
      required: true,
      trigger: 'change',
      message: '请选择关闭按钮出现时间',
      type: 'number',
    },
    screenshot: {
      required: true,
    },
    scene_change: {
      required: true,
      type: 'number',
    },
    count_down: {
      required: true,
      type: 'number',
    },
    nestedValue: {
      corner_offset_x: {
        required: true,
        trigger: ['blur', 'input'],
        type: 'number',
        validator(rule: FormItemRule, value: string) {
          if (value === '' || value === null) {
            return new Error('请输入X坐标比例')
          } else if (!/^[0-9]+$/.test(value)) {
            return new Error('请输入0-100正整数')
          }
          return true
        },
      },
      corner_offset_y: {
        required: true,
        trigger: ['blur', 'input'],
        type: 'number',
        validator(rule: FormItemRule, value: string) {
          if (value === '' || value === null) {
            return new Error('请输入X坐标比例')
          } else if (!/^[0-9]+$/.test(value)) {
            return new Error('请输入0-100正整数')
          }
          return true
        },
      },
    },
    closeObj: {
      close_button_time: {
        required: true,
        type: 'number',
        trigger: ['blur', 'input'],
        validator(rule: FormItemRule, value: string) {
          if (value === '' || value === null) {
            return new Error('请输入关闭按钮时间')
          } else if (!/^[0-9]+$/.test(value)) {
            return new Error('请输入0-600正整数')
          }
          return true
        },
      },
    },
  }
  const generalOptions: any = ref([])
  const appOptions: any = ref([])
  const cornerOptions: any = ref([])
  const cityOptions: any = ref([])
  const cornerInput: any = ref('')
  const uploadState: Ref<boolean> = ref(true)
  const tempOptions: any = ref([])
  const addType: any = ref('')
  // 0无  1图片 2视频
  const uploadType: Ref<number> = ref(0)
  return {
    model,
    rules,
    generalOptions,
    appOptions,
    cornerOptions,
    cityOptions,
    formRef,
    closeTimeInput,
    taskNameStatus,
    cornerInput,
    uploadState,
    tempOptions,
    addType,
    uploadType,
  }
}
export const useTimeLongRule = {
  required: true,
  type: ['number', 'string'],
  trigger: ['blur', 'input'],
  validator: (rule: FormItemRule, value: string) => {
    if (value === '' || value === null) {
      return new Error('请输入截图时间')
    } else if (!/^[0-9]+$/.test(value)) {
      return new Error('请输入0-100正整数')
    }
    return true
  },
}
export const useUploadRule = {
  required: true,
  trigger: ['blur', 'input', 'change'],
  validator: (rule: FormItemRule, value: string) => {
    if (!value) {
      return new Error('请输入素材地址或上传素材')
    } else if (!/\w(\.gif|\.jpeg|\.png|\.jpg|\.mp4)$/i.test(value)) {
      return new Error('输入的素材地址无法解析文件类型，请先下载再上传文件')
    }
    return true
  },
}

export const useSave = (
  model: any,
  formRef: any,
  taskNameStatus: any,
  uploadState: Ref<boolean>,
  addType: any,
  uploadType: Ref<number>
) => {
  const router = useRouter()
  const submit = (e: any) => {
    formRef.value?.validate(async (errors: any) => {
      if (!errors) {
        const weather_alert_image_list =
          model.value.weather_alert_image_list || []
        const weather_info_image_list =
          model.value.weather_info_image_list || []
        let alterVideoItem: any = []
        let infoVideoItem: any = []
        weather_alert_image_list.forEach((item: any) => {
          const type = item.path.substring(item.path.length - 3)
          if (['mp4'].includes(type.toLowerCase())) {
            alterVideoItem.push(type)
          }
        })
        weather_info_image_list.forEach((item: any) => {
          const type = item.path.substring(item.path.length - 3)
          if (['mp4'].includes(type.toLowerCase())) {
            infoVideoItem.push(type)
          }
        })
        if (!uploadState.value) {
          window.$message.error('输入的视频素材地址有误，请重新输入！')
          return false
        }

        if (alterVideoItem.length > 0 || infoVideoItem.length > 0) {
          window.$message.error('天气预报暂不支持视频素材！')
          return false
        }

        const shotList = model.value.screen_shot_list
        // 校验截图自定义重复
        if (shotList && shotList.length != [...new Set(shotList)].length) {
          window.$message.error('截图时间不可重复！')
          return false
        }
        // 校验子任务重复
        const item_list = model.value.item_list
        for (var x = 0; x < item_list.length; x++) {
          for (var y = 0; y < item_list.length; y++) {
            if (
              item_list[x].brand == item_list[y].brand &&
              item_list[x].baidu_flag == item_list[y].baidu_flag &&
              x != y
            ) {
              const brand = brands.filter((item) => {
                return item.value == item_list[x].brand
              })
              const timeVeri = timeVerification.filter((item) => {
                return item.value == item_list[x].baidu_flag
              })
              window.$message.error(
                `${brand[0].label}${timeVeri[0].label}校验时间的子任务重复`
              )
              return false
            }
          }
        }
        if ([2, 5].includes(model.value.ad_type)) {
          let arr = item_list.filter((item: any) => {
            return !item.module_id
          })
          if (arr.length > 0) {
            const styleItem = showStyle.filter((item) => {
              return item.value == model.value.ad_type
            })
            window.$message.error(
              `当场景为${styleItem[0].label}时，绑定ID必须填写！`
            )
            return false
          }
        }
        // if (typeof model.value.click_params == 'object') {
        //   model.value.click_params = JSON.stringify(model.value.click_params)
        // }
        model.value.screenshot_time_long = JSON.stringify(
          model.value.screen_shot_list
        )
        // model.value.screen_shot_list.join(",");
        if (![-1, 0, 5, 10, 15].includes(model.value.close_button_time_long)) {
          model.value.close_button_time_long =
            model.value.closeObj.close_button_time
        }
        // model.value.item_list.forEach((item: any) => {
        //   if (![200].includes(item.status)) {
        //     delete item.id;
        //     // delete item.device_id;
        //     // delete item.folder_path;
        //     // delete item.name;
        //     // delete item.status;
        //   }
        // });

        if ([4].includes(model.value.corner_location)) {
          model.value.corner_offset_x = model.value.nestedValue.corner_offset_x
          model.value.corner_offset_y = model.value.nestedValue.corner_offset_y
        }
        model.value.task_name =
          model.value.task_name_left + model.value.task_name_right
        // delete model.value.screen_shot_list

        if (['update'].includes(addType.value)) {
          // 更新
          model.value.click_state = true //开启禁止双击模式
          updataModel()
        } else if (['copy'].includes(addType.value)) {
          // 复制
          model.value.click_state = true //开启禁止双击模式
          delete model.value.id
          addModel()
        } else {
          // 新增
          model.value.click_state = true //开启禁止双击模式
          addModel()
        }
      } else {
        window.$notification['error']({
          content: '错误提示',
          meta: '有未填项，请检查后填写',
          duration: 3000,
        })
      }
    })
  }

  const addModel = async () => {
    try {
      const { data, code } = await AddScreenApi(model.value)
      if (code == 200) {
        if (['copy'].includes(addType.value)) {
          window.$message.success('复制成功')
        } else {
          window.$message.success('新增成功')
        }
        router.push({
          name: 'screen',
        })
      } else {
        model.value.click_state = false //失败时关闭禁止双击模式
      }
    } catch {
      //   model.value.click_params = JSON.parse(model.value.click_params)
      model.value.click_state = false //失败时关闭禁止双击模式
    }
  }
  const updataModel = async () => {
    try {
      const { data, code } = await UpdataScreenApi(model.value)
      if (code == 200) {
        window.$message.success('编辑成功')
        router.push({
          name: 'screen',
        })
      } else {
        model.value.click_state = false //失败时关闭禁止双击模式
      }
    } catch {
      //   model.value.click_params = JSON.parse(model.value.click_params)
      model.value.click_state = false //失败时关闭禁止双击模式
    }
  }

  const changeStyle = (value: any) => {
    formRef.value?.restoreValidation()
    resetModel(model)
    if (!taskNameStatus.value) {
      const styleItem = showStyle.filter((item) => {
        return item.value == value
      })
      model.value.task_name_left = `${styleItem[0].label}`
      model.value.task_name_right = model.value.task_record_time
        ? `_${dayjs(model.value.task_record_time).format('MM_DD_HH:mm:ss')}`
        : ''
    }
  }
  const resetModel = (model: any) => {
    model.value.module_id = null
    model.value.fileUrl = null
    model.value.corner_location = 1
    model.value.click_address = ''
    model.value.poll_time = ''
    uploadState.value = true
    model.value.material_list = [
      {
        path: '',
      },
    ]
    model.value.click_type = 1
    model.value.corner_type = 1
    model.value.broadcast_type = 2
    model.value.package_name = null
    model.value.record_prev_jump = null
    model.value.click_template_id = null
    model.value.click_app_template_id = null
    model.value.weather_alert_image_list = [
      {
        path: '',
      },
    ]
    model.value.weather_info_image_list = [
      {
        path: '',
      },
    ]
    model.value.weather_info_content = null
    model.value.weather_city_cid = 'BJ0000'
    uploadType.value = 0
    // model.value.click_params = {
    //   jump_type: 1,
    //   package_name: '',
    //   class_name: '',
    //   intent_action: '',
    //   action_url: '',
    //   web_url: '',
    //   parameter: [
    //     {
    //       key: '',
    //       value: '',
    //       type: null,
    //     },
    //   ],
    // }
  }

  return {
    changeStyle,
    submit,
  }
}

export const useHandle = (
  model: any,
  taskNameStatus: Ref<boolean>,
  closeTimeInput: any,
  cornerInput: any,
  uploadState: Ref<boolean>,
  uploadType: Ref<number>
) => {
  // 关闭按钮
  const changeCloseTime = (value: number) => {
    if ([6].includes(value)) {
      nextTick(() => {
        closeTimeInput.value[5].focus()
      })
    } else {
      model.value.closeObj.close_button_time = null
    }
  }
  const changeCornerType = (e: number) => {
    console.log('e', e)
    console.log('[1].includes(e)', [1].includes(e))
    if ([1].includes(e)) {
      model.value.click_app_template_id = null
    } else {
      model.value.record_prev_jump = null
    }
  }

  const ChangeAppointment = (value: number) => {
    if ([1].includes(value)) {
      model.value.appointment_corner_text = ''
    } else {
      nextTick(() => {
        if(cornerInput.value){
            cornerInput.value.focus()
        }
      })
    }
  }
  // 是否截图
  const changeScreenShot = (value: string) => {
    model.value.screen_shot_list = [null]
  }
  // 录屏名称
  const setName = () => {
    model.value.task_name_left = `${showStyle[0].label}`
  }
  // 录屏名称是否修改
  const changeTaskName = (v: string | [string, string]) => {
    taskNameStatus.value = true
  }
  // 点击支持
  const changeClickType = (v: string) => {
    model.value.web_url = ''
    model.value.click_position = ''
    model.value.video_url = ''
    model.value.click_template_id = null
    // model.value.click_params = {
    //   jump_type: 1,
    //   package_name: '',
    //   class_name: '',
    //   intent_action: '',
    //   action_url: '',
    //   web_url: '',
    //   parameter: [
    //     {
    //       key: '',
    //       value: '',
    //       type: null,
    //     },
    //   ],
    // }
  }
  // 弹框位置
  const changeCornerLocation = (v: string) => {
    model.value.nestedValue = {
      corner_offset_x: null,
      corner_offset_y: null,
    }
  }
  const addParams = () => {
    // model.value.click_params.parameter.push({
    //   key: '',
    //   value: '',
    //   type: null,
    // })
  }
  const minuParams = (index: number) => {
    // model.value.click_params.parameter.splice(index, 1)
  }

  const changeUpload = () => {
    model.value.click_position = ''
  }
  const getUploadState = (state: boolean) => {
    uploadState.value = state
  }
  const getRecordTime = (value: number | null, formatValue: string | null) => {
    model.value.task_name_right = value
      ? `_${dayjs(value).format('MM_DD_HH:mm:ss')}`
      : ''
  }
  //   标准时间
  const changeStandardTime = (value: any) => {
    let now = new Date()
    if ([1].includes(value)) {
      model.value.task_record_time = `${dayjs(now).format(
        'YYYY-MM-DD HH:mm:ss'
      )}`
      model.value.task_name_right = `_${dayjs(now).format('MM_DD_HH:mm:ss')}`
    } else {
      model.value.task_record_time = null
      model.value.task_name_right = ''
    }
  }
  const handleSearch = (pattern: string, prefix: string) => {
    console.log('pattern', pattern)
    console.log('prefix', prefix)
  }
  //   获取上传文件类型
  const getUploadType = (type: string) => {
    if (['mp4'].includes(type.toLowerCase())) {
      uploadType.value = 2
    } else if (['peg', 'jpg', 'png', 'gif'].includes(type.toLowerCase())) {
      uploadType.value = 1
      model.value.auto_play = 1
    } else {
      uploadType.value = 0
    }
  }
  return {
    changeCloseTime,
    changeScreenShot,
    changeTaskName,
    setName,
    changeCornerLocation,
    changeClickType,
    changeStandardTime,
    addParams,
    minuParams,
    changeUpload,
    changeCornerType,
    ChangeAppointment,
    getUploadState,
    getRecordTime,
    handleSearch,
    getUploadType,
  }
}

export const useMounted = (
  generalOptions: any,
  appOptions: any,
  cornerOptions: any,
  cityOptions: any,
  model: any,
  tempOptions: any
) => {
  const getAdSourceList = async () => {
    // let data = [{ "name": "dolor nostrud", "value": "pariatur dolor" }]
    let adRes = await GetSysDictApi({
      type: 'AD_SOURCE',
    })
    if (adRes.code == 200) {
      adRes.data.forEach((item: any) => {
        item.label = item.name
      })
      generalOptions.value = [...adRes.data]
      model.value.ad_source_id = model.value.ad_source_id
        ? model.value.ad_source_id
        : '广告'
    }
    let appRes = await GetSysDictApi({
      type: 'APP_PACKET',
    })
    if (appRes.code == 200) {
      appRes.data.forEach((item: any) => {
        item.label = item.name
      })
      appOptions.value = [...appRes.data]
    }
    let cornerRes = await GetSysDictApi({
      type: 'TV_START_SHELL',
    })
    if (cornerRes.code == 200) {
      cornerRes.data.forEach((item: any) => {
        item.label = item.name
      })
      cornerOptions.value = [...cornerRes.data]
    }
    let cityRes = await GetSysDictApi({
      type: 'CITY',
    })

    if (cityRes.code == 200) {
      cityRes.data.forEach((item: any) => {
        item.label = item.name
      })
      cityOptions.value = [...cityRes.data]
      model.value.weather_city_cid = model.value.weather_city_cid
        ? model.value.weather_city_cid
        : 'BJ0000'
    }
  }
  const getTempList = async () => {
    let tempRes = await GetTemplateAllApi({})
    if (tempRes.code == 200) {
      tempRes.data.forEach((item: any) => {
        item.label = item.name
        item.value = item.id
      })
      tempOptions.value = [...tempRes.data]
    }
  }
  return {
    getAdSourceList,
    getTempList,
  }
}
