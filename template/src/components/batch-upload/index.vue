<template>
    <div class="batch-upload">
      <n-upload v-if="fileList.length < 5 && !props.isContrast" @before-upload="fileUpload" :file-list="fileList"
                :show-file-list="false" style="display: inline-block; height: 34px;line-height: 34px"
                :accept="props.accept" multiple :default-upload="false">
        <n-button :disabled="props.isDisabled" type="warning" text>上传文件</n-button>
      </n-upload>
      <div v-if="fileList.length <= 5" class="file-show">
        <template v-for="(item,index) in ratioList">
          <div class="file-list-div">
            <div v-if="isUpdate(index)">
              <div>
                <n-ellipsis style="max-width: 300px;font-size: 14px;">
                  <span class="file-name-show old-data">{{ showName('old',index) }}</span>
                </n-ellipsis>
                <n-button text class="btn" style="font-size: 18px; vertical-align: text-bottom;"
                          @click="downLoadFile(item.url)">
                  <n-icon>
                    <Download />
                  </n-icon>
                </n-button>
                <n-ellipsis style="max-width: 300px;font-size: 14px;">
                  <span class="file-name-show new-data">{{ showName('new',index) }}</span>
                </n-ellipsis>
                <n-button text class="btn" style="font-size: 18px; vertical-align: text-bottom;"
                          @click="downLoadFile(item.url)">
                  <n-icon>
                    <Download />
                  </n-icon>
                </n-button>
              </div>
            </div>
            <div v-else>
              <n-ellipsis class="file-name-show"  style="max-width: 300px;font-size: 14px;">
                {{ item.file_name }}
              </n-ellipsis>
              <n-button text class="btn" style="font-size: 18px; vertical-align: text-bottom;"
                        @click="downLoadFile(item.path)">
                <n-icon>
                  <Download />
                </n-icon>
              </n-button>
              <n-button  v-if="!props.isContrast" :disabled="props.isDisabled" text class="btn"
                         style="font-size: 20px; vertical-align: text-bottom;"
                         @click="removeFile(index)">
                <n-icon>
                  <Delete16Regular />
                </n-icon>
              </n-button>
            </div>
          </div>
        </template>
      </div>

    </div>
</template>
<script setup lang="ts">
import {defineProps, defineEmits, ref, onMounted} from 'vue'
import { downLoadFile } from '@/utils'
const props = defineProps(['fileList','isDisabled','accept','fileUpload','isContrast','contrastFileList','valueKey']);
const emits = defineEmits(['update:fileList','handBatchUpload']);
import { Download, Upload } from '@vicons/tabler'
import {
  Delete16Regular,
} from '@vicons/fluent'
import {isEqual} from 'lodash'
let fileList = props.fileList;
let contrastFileList = props.contrastFileList;
let ratioList = props.fileList;
let toUploadList = [];
let uploadTimeOut = null;
const goBack = () => {
  emits('goBack');
}

const removeFile = (index:number) => {
  fileList.splice(index,1);
  emits('update:fileList',fileList);
}

const fileUpload = ({ file }: any) => {
  toUploadList.push(file.file);
  if (uploadTimeOut) {
    clearTimeout(uploadTimeOut);
  }
  uploadTimeOut = setTimeout(() => {
    emits('handBatchUpload',toUploadList,props.valueKey)
    toUploadList = [];
  }, 300)
  return false;
}

const isUpdate = (index:number) => {
  return  (props.isContrast &&  !isEqual(fileList[index].url, contrastFileList[index].url));
}

const showName = (type:string,index:number) => {
  return type == 'old' ? props.contrastFileList[index] ? props.contrastFileList[index].file_name : ' ' :
      props.fileList[index] ? props.fileList[index].file_name : '';
}

const init  = () => {
  if(props.isContrast ){
    ratioList = fileList.length >= contrastFileList.length ? fileList : contrastFileList;
  }
}

onMounted(()=>{
  init();
})

</script>

<style scoped>
.file-show {
  display: inline-flex;
  flex-direction: column;
}
.file-list-div{
  display: inline-flex;
  align-items: center;
  height: 30px;
}
.file-name-show {
  white-space: nowrap;
  overflow: hidden;
  max-width: 300px;
  text-overflow: ellipsis;
  display: inline-block;
  flex: inherit;
  font-size: 14px;
  color: #000000;
  margin-right: 4px;
}
.btn {
  margin-right: 10px;
}
.old-data{
  display: inline-block;
  background-color: #f0f0f0;
  text-decoration: line-through;
  padding: 0px 2px;
}
.new-data{
  display: inline-block;
  background-color: #fef2e4;
  padding: 0px 2px;
}
</style>