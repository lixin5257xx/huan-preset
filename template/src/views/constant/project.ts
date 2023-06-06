/*
 * @Description: Do not edit
 * @Author: 文件创建人：任亮
 * @Date: 2022-10-31 19:45:24
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-05-11 10:03:34
 */
//项目类型
export const projectTypeList = [
  {
    name: '直投',
    value: 1,
    describe: `广告投放平台<br/>直接创建广告`,
    img: '',
  },
  {
    name: '程序化',
    value: 2,
    describe: `广告投放平台<br/>提供流量`,
    img: '',
  },
]
// 交易类型

export const transTypeList = [
  {
    label: 'PDB',
    value: 2,
  },
  {
    label: 'PD',
    value: 1,
  },
]
// 类型
export const projectType = [
  {
    label: '直投',
    value: '1',
  },
  {
    label: '程序化',
    value: '2',
  },
]
// 类型
export const projectTypeMap: any = {
  1: '直投',
  2: '程序化',
}
// 项目状态
export const projectStatus = [
  {
    label:'调整中',
    value:'10',
  },
  {
    label: '待审核',
    value: '11',
  },
  {
    label: '审核通过',
    value: '20'
  },
  {
    label: '审核不通过',
    value: '21',
  },
  {
    label: '已结束',
    value: '30',
  },

]

// 业务双计参数
export const businessDoubleCountingList = [
  {
    label: '无',
    value: '1',
  },
  {
    label: '双计',
    value: '2',
  },
]
// 业务结算参数
export const settlementList = [
  {
    label: '未结算',
    value: '1',
  },
  {
    label: '结算',
    value: '2',
  },
]

// 订单状态
export const orderStatus = [
  {
    label: '待执行',
    value: '1',
  },
  {
    label: '投放中',
    value: '2',
  },
  {
    label: '已完成',
    value: '4',
  },
  {
    label: '已撤单',
    value: '-1',
  },
  {
    label: '已驳回',
    value: '31',
  },
]

// 订单状态
export const orderStatusMap: any = {
  1: '待执行',
  2: '投放中',
  4: '已完成',
  5: '已撤单',
  31: '已驳回',
}

// 项目状态
export const projectStatusMap: any = {
  10: '调整中',
  11: '待审核',
  20: '审核通过',
  21: '审核不通过',
  30: '已结束',
}
// BOSS送审状态
export const bossStatus: any = {
  10: '待审核',
  20: '审核通过',
  21: '审核不通过',
}
// 是否对公返点
export const returnPointFlagOptions = [
  {
    label: '是',
    value: 'true',
  },
  {
    label: '否',
    value: 'false',
  },
]
// 是否对公返点
export const syncOption = [
  {
    label: '已同步',
    value: 'true',
  },
  {
    label: '未同步',
    value: 'false',
  },
]
// 是否对公返点
export const syncType: any = {
  true: '已同步',
  false: '未同步',
  null: '',
}
// 业务双计参数
export const bosStatusList = [
  {
    label: '审核通过并推送至BOS系统',
    value: '1',
  },
  {
    label: '不通过',
    value: '2',
  },
]

// 客户类型
export const customerTypeOption: any = [
  {
    label: '代理',
    value: 1,
  },
  {
    label: '直客',
    value: 2,
  },
]
// 是否涉及资金往来（1、涉及；2、不涉及）
export const isTransactions: any = {
  1: '涉及',
  0: '不涉及',
}
// 合同类型（1、主合同；2、保密合同；3、补充协议）
export const contractType: any = {
  1: '主合同',
  2: '保密合同',
  3: '补充协议',
}
