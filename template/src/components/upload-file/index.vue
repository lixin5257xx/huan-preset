<template>
  <div class="upload-box">
    <n-form-item-gi v-for="(item, index) in material_list" :path="`${props.pathName}.[${index}].path`"
                    :rule="useUploadRule">
      <div class="upload-cont upload-cont-list">
        <n-input v-if="props.uptype == 'text'" v-model:value="item.path" placeholder="请输入素材地址或点击上传按钮上传素材"
                 style="width: 450px !important;" @blur="inputBlur(item)" maxlength="500" v-emoji />
        <div style="width:90px;">
          <n-upload v-bind="attrs" :show-file-list="props.uptype != 'text'" @change="uploadChange"
                    @error="uploadError(index)" @finish="uploadFinish(index)" @before-upload="uploadBefore"
                    @preview="uploadPreview" @remove="uploadRemove" @update:file-list="uploadFileList"
                    :custom-request="customRequest" :disabled="item.loading">
            <n-button size="medium" @click="selIndex(index)" type="warning" ghost :loading="item.loading">上传
            </n-button>
          </n-upload>
        </div>
        <div class="add-icon-box" v-if="props.add">
          <n-icon @click="add" v-if="material_list.length - 1 == index && material_list.length < props.limit"
                  style="margin-right:5px;">
            <AddCircle32Regular />
          </n-icon>
          <n-icon @click="minu(index)" v-if="material_list.length > 1">
            <MinusCircleOutlined style />
          </n-icon>
        </div>
      </div>
    </n-form-item-gi>
  </div>
</template>

<script setup lang="ts">
import { reactive, useAttrs, ref, computed, watch } from 'vue'
import type { UploadCustomRequestOptions } from 'naive-ui'
import { useUploadRule } from '@views/screen/use/addOrUpdate'
import { ParseVideoDurationApi } from '@/config/api/index'
import { cloneDeep } from "lodash";
import type { UploadFileInfo } from 'naive-ui'
import {
  AddCircle32Regular
} from '@vicons/fluent'
import {
  MinusCircleOutlined
} from '@vicons/antd'
const props = defineProps(['uptype', 'api', 'modelValue', 'add', 'index', 'material_list', 'formRef', 'limit', "pathName", "userType"])
const emits = defineEmits(['change', 'error', 'finish', 'before', 'preview', 'remove', 'fileList', 'update:modelValue', 'update:material_list', 'add', 'minu', 'getUploadState',
  'getUploadType'])
const attrs = useAttrs()
// 响应 material_list 同步到父组件
const material_list = computed({
  get: () => {
    return props.material_list
  },
  set: (val) => {
    emits('update:material_list', val)
  }
})
// 当前点击的第几个
let thisIndex = 0

const selIndex = (index: number) => {
  thisIndex = index
}
// 上传文件只要有改变就会触发
const uploadChange = (options: any) => {
  emits('change', options)
}
// 上传出错
const uploadError = (index: number) => {
  material_list.value[index].loading = false
}
// 完成
const uploadFinish = (index: number) => {
  emits('getUploadState', true)
  material_list.value[index].loading = false
  material_list.value[index] = Object.assign(material_list.value[index], uploadFile)
  props.formRef.restoreValidation();
  inputBlur(uploadFile)
  emits('finish', uploadFile)
}
// 上传之前
const uploadBefore = (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  const maxLength = 1024 * 1024 * 100
  const size: any = data.file.file?.size
  const type: any = data.file.file?.type
  console.log('file', data.file)
  console.log('fileList', data.fileList)
  if (!['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'video/mp4'].includes(type)) {
    if ([2, 3].includes(props.userType)) {
      window.$message.error('只允许上传”JPG/PNG/GIF”格式文件')
    } else {
      window.$message.error('只允许上传”JPG/PNG/GIF/MP4”格式文件')
    }

    return false
  }
  if (size > maxLength) {
    window.$message.error('单个视频小于100MB，请重新上传')
    return false
  }
  material_list.value[thisIndex].loading = true
  return true
}
// 预览
const uploadPreview = (options: any) => {
  emits('preview', options)
}
// 移除
const uploadRemove = (options: any) => {
  emits('remove', options)
}
//上传更新会触发
const uploadFileList = (options: any) => {
  emits('fileList', options)
}
let uploadFile: any = reactive({
  path: "",
  time_long: "",
  type: "",
  use_type: 1
})
// 自定义上传
const customRequest = async ({
                               file,
                               data,
                               headers,
                               withCredentials,
                               action,
                               onFinish,
                               onError,
                               onProgress
                             }: UploadCustomRequestOptions) => {
  const formData = new FormData()
  console.log('自定义')
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(
          key,
          data[key as keyof UploadCustomRequestOptions['data']]
      )
    })
  }
  formData.append('file', file.file as File)
  try {
    let res = await props.api(formData)
    console.log('props.userType', props.userType)
    if (res.code == '200') {
      uploadFile.path = res.data.path
      uploadFile.time_long = res.data.time_long
      uploadFile.type = res.data.type
      uploadFile.use_type = props.userType
      onFinish()
    }

  } catch {
    onError()
  }

}

const add = () => {
  material_list.value.push({
    path: ''
  })
  emits('add')
}
const minu = (index: any) => {
  material_list.value.splice(index, 1)
  emits('minu')
}
// 校验input
const inputBlur = async (item: any) => {
  const type = item.path.substring(item.path.length - 3);
  console.log('type', type)
  emits('getUploadType', type)
  item.use_type = props.userType
  // mp4类型，解析视频时长
  if (["mp4"].includes(type.toLowerCase())) {
    try {
      const { code, data } = await ParseVideoDurationApi({
        path: item.path
      })
      if (code == '200') {
        item.time_long = data.time_long
        item.type = data.type
      }
      emits('getUploadState', true)
    } catch {
      emits('getUploadState', false)
      console.log('错误了')
    }

  } else if (["jpg", "png", "gif"].includes(type.toLowerCase())) {
    emits('getUploadState', true)
    item.type = 2
  }

}

</script>

<style>
.upload-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
}

.upload-box .n-input {
  width: 100% !important;
}

.n-upload {
  margin-left: 10px;
}

.upload-cont {
  display: flex;
  flex-direction: row;
}

.upload-cont-list {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}

.upload-cont-list:nth-last-of-type(1) {
  margin-bottom: 0px;
}

.add-icon-box {
  display: flex;
  align-items: center;
  margin-left: 8px;
  width: 50px;
  font-size: 22px;
  color: #999;
  font-weight: normal;
}

@media screen and (max-width: 1600px) {
  .upload-cont-list {
    display: flex;
    flex-direction: row;
  }
}

.n-icon {
  cursor: pointer;
}
</style>