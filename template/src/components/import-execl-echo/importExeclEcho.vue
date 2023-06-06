<template>
    <n-form-item label="导入" path="file" id="file">
        <template #label>
            {{config.label}}
            <Tooltip v-if="config.tips.isShowLabelTips">
                <div class="question-box">
                    <!-- 触发器 -->
                    <QuestionCircle20Regular></QuestionCircle20Regular>
                </div>
                <!-- 内容 -->
                <template #header>
                    <p>{{config.tips.content}}</p>
                </template>
            </Tooltip>
        </template>
        <template v-if="config.modelType != 'take'">
            <n-button :disabled="editDisabled" text tag="a" class="down-temp" @click="downTemplate">{{config.downTemplate.label}}</n-button>
            <div class="upload-box">
                <n-upload :disabled="editDisabled" ref="batchTemplateUpload" accept=".xlsx" :show-file-list="false"
                    :show-preview-button="false" @change="handleUploadFile" style="display: flex; align-items: center">
                    <n-button text tag="a" class="down-temp">{{config.importTemplate.label}}</n-button>
                </n-upload>
            </div>
            <div class="upload-box" v-if="config.modelType == 'update'">
                <n-button text tag="a" class="down-temp" @click="downLoadTemplate(config.filePath)">{{config.downImportedTemplate.label}}</n-button>
            </div>
        </template>
        <template v-else>
            <div class="importExecl">
                <template v-if="oldFileUrl == newFileUrl">
                    <n-button text tag="a" class="take-not" @click="downLoadTemplate(oldFileUrl)">
                        <div class="take-not">
                            {{ oldFileUrl.split('/')[oldFileUrl.split('/').length - 1] }}
                        </div>
                    </n-button>
                </template>
                <template v-else>
                    <n-button text tag="a" class="take-not new-data" @click="downLoadTemplate(newFileUrl)">
                        <div class="take-not new-data">
                            {{ newFileUrl.split('/')[newFileUrl.split('/').length - 1] }}
                        </div>
                    </n-button>
                    <n-button text tag="a" class="take-not old-data" style="margin-top: -2px"
                        @click="downLoadTemplate(oldFileUrl)">
                        <div class="take-not old-data">
                            {{ oldFileUrl.split('/')[oldFileUrl.split('/').length - 1] }}
                        </div>
                    </n-button>
                </template>
            </div>
        </template>
    </n-form-item>
    <n-form-item label=" " v-if="config.modelType == 'take' || config.showUploadTable" class="importExecl">
        <n-watermark :content="config.showWatermark ?  user.name : ''" cross :font-size="16" :line-height="16" :width="192" :height="128" :x-offset="12"
            :y-offset="28" :rotate="-15">
            <n-data-table class="table-head-gray" :disabled="editDisabled" :columns="templateColumns" :data="templateData"
                :pagination="paginationReactive" :bordered="false" :scroll-x="scrollWidth">
            </n-data-table>
        </n-watermark>
    </n-form-item>
</template>

<script setup lang="ts">
import {
    ref,
    reactive,
    watch,
    computed,
    onMounted,
    watchEffect,
    h,
    defineExpose,
} from 'vue'
import { QuestionCircle20Regular } from '@vicons/fluent'
import { downLoadFile } from '@/utils'
import Tooltip from '@/components/toolTip/index.vue'
import useStore from '@/config/pinia'
import { useConfig } from './config/config.ts'
const batchTemplateUpload = ref()
const templateColumns = ref([])
const templateData = ref([])

const store = useStore()
const user = store.users
const scrollWidth = ref(2000);
const props = defineProps([
  'formRef',
  'schedule',
  'oldSchedule',
  'newFileUrl',
  'oldFileUrl',
  'config',
])
const config = useConfig(props.config);
const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100, 300, 500],
    showSizePicker: true,
    showQuickJumper: true,
    disabled:config.editDisabled,
    onChange: (page: number) => {
        paginationReactive.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        console.log(document.querySelectorAll('.n-select-menu'))
        document.querySelectorAll('.n-select-menu')[0].style.display = 'none'
        if (pageSize >= 50) {
            setTimeout(() => {
                paginationReactive.pageSize = pageSize
                paginationReactive.page = 1
            }, 500)
        } else {
            paginationReactive.pageSize = pageSize
            paginationReactive.page = 1
        }
    },
})

const emits = defineEmits(['handleUploadFile','downTemplate'])

defineExpose({
  paginationReactive,
})

const renderCol = (id, index) => {
    let colIndex =
        (paginationReactive.page - 1) * paginationReactive.pageSize + index
    let old = props.oldSchedule.cols
    let newd = props.schedule.cols
    let newData = newd[colIndex]
        ? newd[colIndex][id]
            ? newd[colIndex][id]
            : ''
        : ''
    let oldData = old[colIndex]
        ? old[colIndex][id]
            ? old[colIndex][id]
            : ''
        : ''
    if (oldData == newData) {
        return h('span', { class: 'take-not' }, newd[colIndex][id])
    } else {
        let result = []
        if (newData) {
            result.push(
                h(
                    Tooltip,
                    { class: 'take-not new-data' },
                    {
                        trigger: () => newData,
                        default: () => {
                            return h('div', { class: 'take-not new-data' }, newData)
                        },
                        header: () => newData,
                    }
                )
            )
        }
        if (oldData) {
            result.push(
                h(
                    Tooltip,
                    { class: 'take-not old-data' },
                    {
                        trigger: () => oldData,
                        default: () => {
                            return h('div', { class: 'take-not old-data' }, oldData)
                        },
                        header: () => oldData,
                    }
                )
            )
        }
        return result
    }
}

const upLoadSuccess = (res:any) => {
  templateData.value = res.data.cols
  templateColumns.value = res.data.head.map((item: any) => {
    return {
      title: item,
      key: item,
      ellipsis: {
        tooltip: true,
      },
    }
  })
  scrollWidth.value = res.data.head.length * 160
}

const initTable = (type, oldSchedule, schedule) => {
    if (config.modelType == 'take') {
        let colums = []
        colums = schedule.head.map((item) => {
            return {
                title: item,
                key: item,
                type: 'new',
                ellipsis: {
                    tooltip: true,
                },
                render: (row, index) => {
                    return renderCol(item, index)
                },
            }
        })
        oldSchedule.head.forEach((item) => {
            if (!schedule.head.includes(item)) {
                colums.push({
                    title: () => {
                        return h('div', { class: 'take-not old-data' }, item)
                    },
                    key: item,
                    type: 'old',
                    ellipsis: {
                        tooltip: true,
                    },
                    render: (row, index) => {
                        return renderCol(item, index)
                    },
                })
            }
        })
        templateColumns.value = colums
        templateData.value = schedule.cols
    }
}

const createData = (data) => {
    if (data.head) {
        templateData.value = data.cols
        templateColumns.value = data.head.map((item: any) => {
            return {
                title: item,
                key: item,
                ellipsis: {
                    tooltip: true,
                },
            }
        })
        scrollWidth.value = data.head.length * 160
    }
}

if (config.modelType != 'take') {
    watch(
        () => props.schedule,
        (newValue) => {
            createData(newValue)
        },
        {
            immediate: true, // 深度监听
            deep: true,
        }
    )
} else {
    watchEffect(() => {
        initTable('take', props.oldSchedule, props.schedule)
    })
}
onMounted(() => {
  createData(props.schedule)
})
const downTemplate = async () => {
    emits('downTemplate');
}

const downLoadTemplate = async (url) => {
    downLoadFile(url)
}
/**
 * 清除上传文件
 */
const clearFilesUpload = () => {
    batchTemplateUpload.value.clear()
}

const handleUploadFile =  (
    options: Promise<boolean | void> | boolean | void
) => {
    emits("handleUploadFile",options)
}

const editDisabled = computed(() => {
    if (config.modelType != 'take') {
      console.log(config.editDisabled);
      return config.editDisabled;
    }
})
</script>

<style scoped>
.question-box {
    align-items: center;
    justify-content: center;
    margin-bottom: 2px;
    z-index: 999;
    width: 18px;
    display: inline-block;
    height:18px;
}

.question-box {
    color: #999999 !important;
}

.down-temp {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fa8c16;
    cursor: pointer;
    margin-right: 10px;
}

.upload-box {
    display: flex;
    align-items: center;
    width: 38px;
}
</style>
<style>
.importExecl .take-not {
    font-size: 14px;
    line-height: 18px;
    height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.importExecl .old-data {
    display: block;
    background-color: #f0f0f0;
    text-decoration: line-through;
    cursor: pointer;
}

.importExecl .new-data {
    background-color: #fef2e4;
    cursor: pointer;
}
</style>
