// 品牌
export const brands = [
  {
    label: 'TCL',
    value: 'TCL',
  },
  {
    label: '长虹',
    value: 'CH',
  },
  {
    label: '东芝',
    value: 'DZ',
  },
  {
    label: '三洋',
    value: 'SY',
  },
]
// 品牌字典
export const brandsMap: any = {
  TCL: 'TCL',
  CH: '长虹',
  DZ: '东芝',
  SY: '三洋',
}
// 时间校验
export const timeVerification = [
  {
    label: '需要',
    value: 1,
  },
  {
    label: '不需要',
    value: 0,
  },
]
export const timeVerificationMap: any = {
  1: '需要',
  0: '不需要',
}
// 展示场景
export const showStyle = [
  {
    label: '开机',
    value: 1,
  },
  {
    label: '贴片',
    value: 2,
  },
  {
    label: '弹窗',
    value: 3,
  },
  {
    label: '屏保',
    value: 4,
  },
  {
    label: '首页焦点',
    value: 5,
  },
  {
    label: '开屏',
    value: 6,
  },
  {
    label: '换肤',
    value: 8,
  },
  {
    label: '霸屏',
    value: 9,
  },
  {
    label: '天气预报',
    value: 10,
  },
]

export const showStyleMap: any = {
  1: '开机',
  2: '贴片',
  3: '弹窗',
  4: '屏保',
  5: '首页焦点',
  6: '开屏',
  8: '换肤',
  9: '霸屏',
  10: '天气预报',
}

// 百度时间
export const baiduFlagMap: any = {
  0: '不需要时间校验',
  1: '需要时间校验',
}
// 来源位置
export const sourcePosition = [
  {
    label: '右下',
    value: 4,
  },
  {
    label: '左下',
    value: 3,
  },
  {
    label: '右上',
    value: 2,
  },
  {
    label: '左上',
    value: 1,
  },
]
// 弹框位置
export const alertPosition = [
  {
    label: '右下',
    value: 1,
  },
  {
    label: '居中',
    value: 2,
  },
  {
    label: '左下',
    value: 3,
  },
  {
    label: '底部居中',
    value: 5,
  },
  {
    label: '自定义',
    value: 4,
  },
]
// 开机点击支持
export const openSourceClick = [
  {
    label: '不支持',
    value: 1,
  },
  {
    label: 'Web页面',
    value: 2,
  },
  {
    label: '应用直达',
    value: 3,
  },
  {
    label: '播放视频',
    value: 4,
  },
]
// 点击支持
export const sourceClick = [
  {
    label: '不支持',
    value: 1,
  },
  {
    label: 'Web页面',
    value: 2,
  },
  {
    label: '应用直达',
    value: 3,
  },
]
// 是否预约
export const broadcastType = [
  {
    label: '电视直播',
    value: 1,
  },
  {
    label: '影视点播',
    value: 2,
  },
]
// 是否预约
export const makeAnAppointment = [
  {
    label: '否',
    value: 1,
  },
  {
    label: '是',
    value: 2,
  },
]
// 是否截图
export const screenShot = [
  {
    label: '不需要',
    value: 0,
  },
  {
    label: '默认截图',
    value: 1,
  },
  {
    label: '自定义',
    value: 2,
  },
]
// 远近景切换
export const farNear = [
  {
    label: '不限',
    value: 1,
  },
  {
    label: '先远后近',
    value: 2,
  },
  {
    label: '先近后远',
    value: 3,
  },
]
// 关闭按钮出现时间
export const closeTime = [
  {
    label: '不可关闭',
    value: -1,
  },
  {
    label: '0秒之后',
    value: 0,
  },
  {
    label: '5秒之后',
    value: 5,
  },
  {
    label: '10秒之后',
    value: 10,
  },
  {
    label: '15秒之后',
    value: 15,
  },
  {
    label: '自定义',
    value: -2,
  },
]

export const count_down = [
  {
    label: '显示',
    value: 1,
  },
  {
    label: '不显示',
    value: 0,
  },
]

export const auto_play = [
  {
    label: '播放',
    value: 1,
  },
  {
    label: '不播放',
    value: 0,
  },
]
//录屏状态
export const screenStatus = [
  {
    label: '准备录制',
    value: 100,
  },
  {
    label: '录制中',
    value: 200,
  },
  {
    label: '录制成功',
    value: 300,
  },
  {
    label: '录制失败',
    value: 400,
  },
]
export const screenStatusMap: any = {
  100: '准备录制',
  200: '录制中',
  300: '录制成功',
  400: '录制失败',
}
// 打开方式
export const JumpList = [
  {
    label: 'URL',
    value: 1,
  },
  {
    label: 'Action',
    value: 2,
  },
  {
    label: 'Activity',
    value: 3,
  },
]
// 参数类型
export const parameterOptions = [
  {
    label: 'Boolean:布尔',
    value: 'Boolean',
  },
  {
    label: 'String:字符串',
    value: 'String',
  },
  {
    label: 'Byte:字节',
    value: 'Byte',
  },
  {
    label: 'Char:字符',
    value: 'Char',
  },
  {
    label: 'CharSequence:序列',
    value: 'CharSequence',
  },
  {
    label: 'Int:整数',
    value: 'Int',
  },
  {
    label: 'Long:长整数',
    value: 'Long',
  },
  {
    label: 'Short:短整数',
    value: 'Short',
  },
  {
    label: 'Float:单精度浮点',
    value: 'Float',
  },
  {
    label: 'Double:双精度浮点',
    value: 'Double',
  },
]

export const keyOptions = [
  {
    label: '上键',
    value: '19',
  },
  {
    label: '下键',
    value: '20',
  },
  {
    label: '左键',
    value: '21',
  },
  {
    label: '右键',
    value: '22',
  },
  {
    label: '确认键',
    value: '23',
  },
]
// 真实时间标识（1：是；0：否）
export const real_time_flag = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
]
// 是否直播（1：是；0：否）
export const sinatvType = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
]

// 广播标识（1，是；0，否）
export const broadcast_flag = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
]
// 优先执行（ 1，是；0，否；）
export const fast_flag_map = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
]

