<template>
    <div class="add-project marketing">
        <!-- <n-back-top :right="100" /> -->
        <n-grid item-responsive :cols="24">
            <n-grid-item :offset="2" :span="18">
                <n-form ref="formRef" :model="model" label-placement="left" require-mark-placement="right-hanging"
                    label-width="105px">
                    <div class="block-item" v-if="status == 30">
                        <h5>归属日期</h5>
                        <n-form-item label="日期" :show-require-mark="true">
                            <n-grid :cols="24">
                                <n-gi :span="5">
                                    <n-date-picker v-model:value="model.finance_time" :is-date-disabled="dateDisabled"
                                        type="date" />
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                    </div>
                    <div class="block-item">
                        <h5>凭证内容</h5>
                        <template v-if="isSkeleton">
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" height="100px" />
                                </n-space>
                            </n-form-item>
                        </template>
                        <template v-if="!isSkeleton">

                            <n-form-item label="合同">
                                <n-grid :cols="24">
                                    <n-gi :span="18">
                                        <n-select style="width: 450px;display: inline-block;margin-right: 20px"
                                            v-model:value="model.contract_id" label-field="name" filterable value-field="id"
                                            placeholder="下拉选择合同" :options="contractList" clearable
                                            @update:value="contractChange" />
                                        <n-button text type="warning" v-show="model.contract_id"
                                            @click="showContractDetails">
                                            详情</n-button>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item label="下单公司">
                                <n-grid :cols="24">
                                    <n-gi :span="18">
                                        <span class="form-span" v-show="model.contract_id">{{ model.company_name }}</span>
                                        <span v-show="!model.contract_id" class="tips_text">请选择合同</span>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item label="公司主体">
                                <n-grid :cols="24">
                                    <n-gi :span="18">
                                        <span class="form-span" v-show="model.contract_id">{{ model.company_body_name
                                        }}</span>
                                        <span v-show="!model.contract_id" class="tips_text">请选择合同</span>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>

                            <n-form-item path="email_image" class="email_image">
                                <template #label>
                                    邮件截图
                                    <Tooltip>
                                        <div class="question-box">
                                            <!-- 触发器 -->
                                            <QuestionCircle20Regular></QuestionCircle20Regular>
                                        </div>
                                        <!-- 内容 -->
                                        <template #header>
                                            <p>请上传客户下单原始邮件截图</p>
                                        </template>
                                    </Tooltip>
                                </template>
                                <n-grid :cols="24">
                                    <n-gi :span="18">
                                        <n-upload v-model:file-list="model.email_image" :action="uploadAction"
                                            list-type="image-card" @finish="uploadFinish" :headers="actionHeaders"
                                            @change="handleUploadChange" @before-upload="imageUpload" :max="10"
                                            @remove="removeImage" accept="image/*">
                                        </n-upload>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                        </template>

                    </div>


                    <div class="block-item marketing-price">
                        <h5>单价返点</h5>
                        <template v-if="isSkeleton">
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" height="500px" />
                                </n-space>
                            </n-form-item>
                        </template>
                        <template v-if="!isSkeleton">
                        <n-form-item label=" " path="file" id="file">
                            <div class="upload-box">
                                <n-upload ref="batchTemplateUpload" accept=".xlsx" :show-file-list="false"
                                    :show-preview-button="false" @change="handleUploadFile"
                                    style="display: flex; align-items: center;margin-bottom: 4px;">
                                    <n-button text tag="a" class="down-temp">导入</n-button>
                                </n-upload>
                            </div>
                            <div class="upload-box">
                                <n-button text tag="a" class="down-temp" @click="downLoadTemplate">导出排期文件</n-button>
                            </div>
                            <Tooltip>
                                <div class="question-box">
                                    <!-- 触发器 -->
                                    <QuestionCircle20Regular></QuestionCircle20Regular>
                                </div>

                                <!-- 内容 -->
                                <template #header>
                                    <p>
                                        首次导出，折前单价、折后单价、返点方式、项目返点、政策返点需要编辑后导入系统；导入后再导出，为已补充后的内容
                                    </p>
                                </template>
                            </Tooltip>
                        </n-form-item>
                        <n-form-item label=" " class="importExecl">
                            <n-data-table :columns="templateColumns" :data="templateData" :pagination="paginationReactive"
                                :bordered="false" :scroll-x="scrollWidth" class="table-head-gray">
                            </n-data-table>
                        </n-form-item>
                    </template>

                </div>
            </n-form>
            <!-- 操作按钮 -->
            <div style="display: flex; justify-content: center;margin-bottom: 10px">
                <n-button :text="true" class="btn-txt" @click="goBack">取消</n-button>
                <n-button type="warning" :loading="submitLoading" class="btn-submit" @click.prevent="submitCallback"
                    v-preventReClick>
                    保存</n-button>
            </div>
        </n-grid-item>
    </n-grid>
</div>
<contractDetails ref="contractDetailsRef" :id="model.contract_id" />
<!-- 改单原因弹窗 -->
<changeReason v-model:show="showChangeOrderModel" @submit="handelSubmitReason"></changeReason></template>
<script setup lang="ts">
import { onMounted, ref, reactive, watchEffect, Ref, nextTick } from 'vue'

import { useRouter, useRoute } from 'vue-router'

import {
    useState,
    useSubmit,
    useDetails,
    useTable,
    useHandel,
    useUploadImg,
    useUploadFile,
    useMounted
} from '../use/marketingServer'
import contractDetails from './contractDetails.vue'
import Tooltip from '@/components/toolTip/index.vue'
import changeReason from '@/components/changeReason/changeReason.vue'
import { QuestionCircle20Regular } from '@vicons/fluent'
import { cloneDeep, uniqueId } from 'lodash'
const isSkeleton = ref(true)
const router: any = useRouter()
const route: any = useRoute()
const formRef: any = ref(null);
const { id, status, coo_time_between, first_pass } = route.query
const { model, contractList, showChangeOrderModel, dateDisabled, submitLoading } = useState(id, status, coo_time_between, first_pass)
const { contractChange } = useHandel()
const { submitCallback, handelSubmitReason } = useSubmit(router)
const { contractDetailsRef, showContractDetails } = useDetails()
const { templateColumns, templateData, scrollWidth } = useTable()
const { imageUpload, removeImage, handleUploadChange, uploadAction, actionHeaders, uploadFinish } = useUploadImg()
const { getContractList, getSallDetails, getSellPriceInfo } = useMounted(isSkeleton)
const { handleUploadFile, batchTemplateUpload, downLoadTemplate } = useUploadFile(route)
const goBack = () => {
    model.email_image = []
    model.submit_email_image = []
    router.push({
        name: 'project',
    })
}
// let submitCode = route.query.id ? 'subject:update' : 'subject:save';

const paginationReactive = reactive({
    page: 1,
    pageSize: 10,
    pageSizes: [10, 20, 50, 100, 150],
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


onMounted(async () => {
    const content = document.querySelectorAll('.layout-content')
    content[0].scrollTop = 0
    route.meta.bread[1].label = route.query.name;
    getContractList()
    // 获取营销服务配置详情
    getSallDetails()
    // 获取单价返点详情
    getSellPriceInfo()
})

</script>

<style scoped>
.add-project {
    background: #fafafa !important;
    padding-bottom: 50px !important;
    margin: var(--theme-box-margin);
}

.add-project :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.project-footer {
    display: flex;
    justify-content: end;
}

.add-project h5 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
    margin: 0 0 25px 0;
}

.tips_text {
    color: #c2c2c2;
    font-size: 14px;
    position: relative;
}

.marketing :deep(.n-form-item) {
    margin-left: 100px !important;
}

.form-span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    position: relative;
    top: -2px;
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
}

.select-box {
    width: 150px;
    display: inline-block;
    margin-left: 10px;
}

.question-box {
    align-items: center;
    justify-content: center;
    margin-top: 6px;
    z-index: 999;
    width: 20px;
    display: inline-block;
}

.question-box {
    color: #999999 !important;
}

.email_image .question-box {
    margin-top: 3px;
}

.marketing-price .n-upload {
    width: 40px;
    display: inline-block;
}
</style>
