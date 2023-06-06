<template>
    <n-form-item label="导入" path="file" id="file">
        <template #label>
            导入
            <Tooltip>
                <div class="question-box">
                    <!-- 触发器 -->
                    <QuestionCircle20Regular></QuestionCircle20Regular>
                </div>
                <!-- 内容 -->
                <template #header>
                    <p>请先下载模板，按照模板提醒填入排期数据后导入文件</p>
                </template>
            </Tooltip>
        </template>
        <template v-if="modelType != 'take'">
            <n-button :disabled="editDisabled" text tag="a" class="down-temp" @click="downTemplate">下载模板</n-button>
            <div class="upload-box">
                <n-upload :disabled="editDisabled" ref="batchTemplateUpload" accept=".xlsx" :show-file-list="false"
                    :show-preview-button="false" @change="handleUploadFile" style="display: flex; align-items: center">
                    <n-button text tag="a" class="down-temp">导入</n-button>
                </n-upload>
            </div>
            <div class="upload-box" v-if="modelType == 'update'">
                <n-button text tag="a" class="down-temp" @click="downLoadTemplate(model.file_path)">已导入文件下载</n-button>
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
    <n-form-item label=" " v-if="modelType == 'take' || model.showUploadTable" class="importExecl">
        <n-watermark :content="user.name" cross :font-size="16" :line-height="16" :width="192" :height="128" :x-offset="12"
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
} from 'vue'
import { QuestionCircle20Regular } from '@vicons/fluent'
import {
    UploadImportTemplateApi,
    GetOrderTemplateApi,
    uploadFileApi,
} from '@api'
import { downLoadFile } from '@/utils'
import Tooltip from '@/components/toolTip/index.vue'
import useStore from '@/config/pinia'
import dayjs from 'dayjs'
const batchTemplateUpload = ref()
const templateColumns = ref([])
const templateData = ref([])

const store = useStore()
const user = store.users
const scrollWidth = ref(2000)
const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100, 300, 500],
    showSizePicker: true,
    showQuickJumper: true,
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
const props = defineProps([
    'model',
    'formRef',
    'modelType',
    'schedule',
    'oldSchedule',
    'newFileUrl',
    'oldFileUrl',
    'config'
])
defineExpose({
    paginationReactive,
})
const emits = defineEmits(['updateTime'])
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

const initTable = (type, oldSchedule, schedule) => {
    if (props.modelType == 'take') {
        console.log(schedule)
        console.log(oldSchedule)
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
        props.model.showUploadTable = true
        props.model.file = {}

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

if (props.modelType != 'take') {
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
onMounted(() => { })
const downTemplate = async () => {
    let { data } = await GetOrderTemplateApi()
    downLoadFile(data)
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
const uploadFile = async (model: any) => {
    await uploadFileApi({ file: model.file }).then((res) => {
        model.file_path = res.data.path
        model.fileName = res.data.file_name

    })
}
const handleUploadFile = async (
    options: Promise<boolean | void> | boolean | void
) => {
    console.log('options', options)
    console.log('options', options.file.file)
    try {
        await UploadImportTemplateApi({
            file: options.file.file
        }).then((res) => {
            console.log('res', res)
            if (res.code == 200) {
                props.model.showUploadTable = true
                window.$message.success('导入成功!')
                props.model.file = options.file.file
                props.formRef.validate()
                props.model.file_upload_flag = true
                uploadFile(props.model)
                //   this.form.direct_daily_amount_rule_file = raw
                //   this.pagination.planId = res.data.monitor_file_flag
                //   this.form.monitor_file_name = res.data.monitor_file_name //N已导入模板名称
                //   this.$emit('uploadImportExeclEchoName', res.data.monitor_file_name) //调用父组件数据更新方法
                //   this.getExeclList({ planId: this.pagination.planId }) //获取列表数据
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
                // res.data.coo_start_time = '2020-04-21'
                // res.data.coo_end_time = '2020-04-25'
                emits('updateTime', {
                    coo_start_time: dayjs(res.data.push_time_start).format(
                        'YYYY-MM-DD'
                    ),
                    coo_end_time: dayjs(res.data.push_time_end).format(
                        'YYYY-MM-DD'
                    ),
                })
            } else {
                /* const errorMessage = `
                      ${res.message}:\n
                      ${res.data[0].err_message.join(',\n')}
                    `
                        window.$message.error({
                            type: 'error',
                            message: errorMessage,
                        })*/
            }
        })
    } catch (e) {
        console.log('执行失败')
    }
    clearFilesUpload()
}

const editDisabled = computed(() => {
    if (props.modelType != 'take') {
        return (
            (props.model.status == 4 && props.model.out_time1_day_flag) ||
            props.model.status == -1
        )
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
