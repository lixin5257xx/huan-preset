import _ from 'lodash'
import { ref } from 'vue'
import {
  Delete24Regular,
  ChevronDoubleUp20Filled,
  VideoSwitch24Regular,
} from '@vicons/fluent'
import { LockOpenRound, LockOutlined } from '@vicons/material'

export const MODULAR_LIST = [
  {
    icon: Delete24Regular,
    label: '删除',
    prompt: '确定删除吗',
    key: 'delete',
    emitsKey: 'deleteClickOk',
  },
  {
    icon: ChevronDoubleUp20Filled,
    label: '优先执行',
    prompt: '确定优先执行吗',
    key: 'priority',
    emitsKey: 'fastClickOk',
  },
  {
    icon: VideoSwitch24Regular,
    label: '批量重录',
    prompt: '确定批量重录吗',
    key: 'record',
    emitsKey: 'recordClickOk',
  },
  {
    icon: LockOutlined,
    label: '冻结',
    prompt: '确定冻结吗',
    key: 'frozen',
    emitsKey: 'frozenClickOk',
  },
  {
    icon: LockOpenRound,
    label: '激活',
    prompt: '确定激活吗',
    key: 'activation',
    emitsKey: 'activationClickOk',
  },
]
/**
 * 初始化获取配置
 * 用于做兜底判断保证参数传参的简化性
 */
export function useBulk(options) {
  const moduleSource = ref(_.cloneDeep(MODULAR_LIST))
  const moduleList: any = ref([])
  if (_.isEmpty(options)) {
    return moduleList
  }
  moduleSource.value.forEach((item) => {
    if (options.hasOwnProperty(item.key)) {
      moduleList.value.push(Object.assign(item, options[item.key]))
    }
  })
  return moduleList
}

/**
 * 初始化返回emits 数组
 * @param options
 */
export function useEmit() {
  let moduleEmits = MODULAR_LIST.map((emits) => {
    return emits.emitsKey
  })
  return [...moduleEmits, 'closeClick', 'update:modelValue']
}
