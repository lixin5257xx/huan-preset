/*
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-01-05 16:13:28
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-05-10 19:33:55
 * @FilePath: \operation-web\src\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
/**
 * 此工具类 为了方便以后使用，只写一次，整体项目如有需要 所有工具或简化函数添加此处
 * 用处：将融合进loadsh 和 自定义函数导出新的loadsh 对象以供使用
 */
import { cloneDeep,isEqual } from 'lodash'
import JSEncrypt from 'jsencrypt'
const encryptor = new JSEncrypt()
import { h } from 'vue'
import { NDropdown, NButton, NIcon } from 'naive-ui'
import { MoreVertical16Regular } from '@vicons/fluent'

let isCopy;
/**
 * 是否为null字符的判断
 * return true 正确不等于空 false 空
 */

const isNullCheck = (value: any) => {
  if (value == null && value == undefined && value == '') {
    return false
  }
  return true
}

const setLocalData = (name = '', value = '') => {
  localStorage.setItem(name, JSON.stringify(value))
}

const getLocalData = (name = '') => {
  return localStorage.getItem(name)
    ? JSON.parse(<string>localStorage.getItem(name))
    : ''
}

/**
 * 下载文件专用函数
 * @param url 下载地址
 * @param name  生成的文件名 需要携带文件类型后缀
 */
const downLoadFile = (data, name = '文件', type = 'url') => {
  try {
    let url = type == 'url' ? data : ''
    let blob
    if (type == 'blob') {
      blob = new Blob([data])
      let urls = URL || webkitURL
      url = urls.createObjectURL(blob)
    }
    if (navigator.msSaveOrOpenBlob) {
      //ie edge 兼容
      navigator.msSaveOrOpenBlob(blob, name)
      return
    }
    const a = document.createElement('a') // 创建a标签
    a.setAttribute('download', name) // download属性
    a.setAttribute('href', url) // href链接
    a.click() // 自执行点击事件
  } catch (e) {
    console.log('下载失败')
  }
}

const DownLoadBlobFile = (res: any, fileName = '模板.xlsx') => {
  let blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  })
  const elink = document.createElement('a')
  if ('download' in elink) {
    // 非IE下载
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  }
}
/**
 * Ras加密函数
 * @param params 需要加密的参数
 * @return  params 返回一个新的参数
 */
const rasEncrypt = (params: any) => {
  const publicKeyBase64 =
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGxlGv1TLH/xWkW6HZcTuowJqUHGjYpDcMsURmEAxn0MtaObpfXKfqK/y0HSMNww3EXCCmBdtD3hQ4Gjfkx5X35PRBEIAgymoJaoLMj6YTsEDLnHyDraBOJJlVeJRQVMAmo9MdO5vtSshoZnDph6Azn2aJKabBtKEc1I2TCUexUwIDAQAB'
  encryptor.setPublicKey(publicKeyBase64)
  return encryptor.encrypt(cloneDeep(params))
}

const getAnthorTop = (selector: any) => {
  let top = 0
  const scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop
  if (typeof selector === 'number') {
    top = selector - scrollTop
  } else {
    const anchor = document.querySelector(selector) || { offsetTop: 0 }
    top = anchor.offsetTop - scrollTop - 90
  }
  return top
}
// 锚点跳转
const goAnchor = (selector: any, scrollSelector?: any) => {
  const element: any = document.querySelector(
    scrollSelector ? scrollSelector : '.layout-content'
  )
  const top = getAnthorTop(selector)
  element.scrollTo({ top, behavior: 'smooth' })
}

function arraysEqual(a, b) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

//常规数组转更多数组
function btnListToMoreList(result, moduleList, btnClick, row) {
  let moreResult = []
  let deepResult = Object.assign([], result)
  let deepModuleList = Object.assign([], moduleList)
  if (result.length == 0 || result.length <= 3) {
    return result
  }
  let moreList = deepModuleList.splice(3, deepModuleList.length)
  moreResult = deepResult.splice(0, 3)
  moreResult.push(
    h(
      NDropdown,
      {
        options: moreList.map((item) => {
          return {
            key: item.name,
            label: item.label,
            name: item.name,
            icon: () => h(NIcon, { component: item.component }),
          }
        }),
        onSelect: (value) => {
          btnClick({ name: value }, row)
        },
      },
      {
        default: () =>
          h(
            NButton,
            {
              text: true,
              tag: 'a',
              title: '更多',
              style: {
                fontSize: '18px',
                marginRight: '18px',
                verticalAlign: 'middle',
              },
            },
            {
              default: () =>
                h(
                  NIcon,
                  {},
                  {
                    default: () => h(MoreVertical16Regular),
                  }
                ),
            }
          ),
      }
    )
  )
  return moreResult
}

/**
 * 判断是否修改敏感信息
 * @param oldForm
 * @param newForm
 * @param keyList
 * @return true 等于修改了敏感信息，false反之
 */
function isUpdateSusceptible(oldForm, newForm, keyList) {
  let isUpdate = keyList.findIndex((item) => {
    return (
      oldForm[item]?.length != newForm[item]?.length ||
      !isEqual(oldForm[item], newForm[item])
    )
  })
  return isUpdate != -1
}
// 复制功能
function handelCopy(val: any) {
  if(isCopy){
    clearTimeout(isCopy);
  }
  isCopy =  setTimeout(()=>{
    navigator.clipboard.writeText(val).then(() => {
      window.$message.success('复制成功')
    })
  },300)
}
export {
  downLoadFile,
  DownLoadBlobFile,
  isNullCheck,
  setLocalData,
  getLocalData,
  rasEncrypt,
  goAnchor,
  arraysEqual,
  btnListToMoreList,
  isUpdateSusceptible,
  handelCopy, 
}
