import { ref, reactive, nextTick, Ref } from 'vue'
import { FormInst, FormItemRule } from 'naive-ui'
import { AddTempApi, UpdataTempApi } from '@/config/api/index'
import { showStyle, brands, timeVerification } from '../../constant/screen'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { format } from 'path'
export const useState = () => {
  const formRef = ref<FormInst | null>(null)
  const closeTimeInput: any = ref([])
  const taskNameStatus = ref(false)

  const model = ref({
    id: null,
    name: null,
    // 按键
    control_list: [],
    control_list_copy: [null],
    jump_type: 1,
    package_name: '',
    class_name: '',
    intent_action: '',
    action_url: '',
    parameter: [
      {
        key: '',
        value: '',
        type: null,
      },
    ],
    msg: '',
    broadcast_flag:0,
    // 点击状态
    click_state:false
  })
  const rules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入模板名称',
    },
    broadcast_flag:{
        type: 'number',
        required: true,
        trigger: ['change'],
    },
    jump_type: {
      type: 'number',
      required: true,
      trigger: ['change'],
    },
  }
  const generalOptions: any = ref([])
  const appOptions: any = ref([])
  const cornerOptions: any = ref([])
  const cornerInput: any = ref('')
  const uploadState: Ref<boolean> = ref(true)
  const tempOptions: any = ref([])
  return {
    model,
    rules,
    generalOptions,
    appOptions,
    cornerOptions,
    formRef,
    closeTimeInput,
    taskNameStatus,
    cornerInput,
    uploadState,
    tempOptions,
  }
}

export const useSave = (model: any, formRef: any) => {
  const router = useRouter()
  const submit = (e: any) => {
    formRef.value?.validate(async (errors: any) => {
      if (!errors) {
        model.value.control_list = []
        model.value.control_list_copy.forEach((item: any) => {
          if (item) {
            model.value.control_list.push(item)
          }
        })
        // 新增
        if (!model.value.id) {
          model.value.click_state = true //开启禁止双击模式
          addModel()
        } else {
          model.value.click_state = true //开启禁止双击模式
          updataModel()
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
      const { data, code } = await AddTempApi(model.value)
      if (code == 200) {
        window.$message.success('新增成功')
        router.push({
          name: 'screenTemplate',
        })
      } else{
        model.value.click_state = false //失败时关闭禁止双击模式
      }
    } catch {
      model.value.click_params = JSON.parse(model.value.click_params)
      model.value.click_state = false //失败时关闭禁止双击模式
    }
  }
  const updataModel = async () => {
    const { data, code } = await UpdataTempApi(model.value)
    if (code == 200) {
      window.$message.success('编辑成功')
      router.push({
        name: 'screenTemplate',
      })
    } else {
      model.value.click_state = false //失败时关闭禁止双击模式
    }
  }
  return {
    submit,
  }
}

export const useMounted = () => {
  const getAdSourceList = async () => {}
  const getTempList = async () => {}
  return {
    getAdSourceList,
    getTempList,
  }
}

export const useHandle = (model: any) => {
  // 是否截图
  const changeScreenShot = (value: string) => {
    model.value.screen_shot_list = [null]
  }

  const addParams = () => {
    model.value.parameter.push({
      key: '',
      value: '',
      type: null,
    })
  }
  const minuParams = (index: number) => {
    model.value.parameter.splice(index, 1)
  }

  return {
    changeScreenShot,
    addParams,
    minuParams,
  }
}
