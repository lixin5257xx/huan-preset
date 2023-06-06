<template>
    <div class="contract-details">
        <!-- 营销服务配置弹窗 -->
        <n-modal v-model:show="isShow" id="servicesStatus" :auto-focus="false" preset="card" title="合同详情"
            style="width: 1000px;" :bordered="false">
            <div class="contract-box">
                <div class="contract-title">
                    {{ formData.name }}（合同编号：{{ formData.contract_no }}，起始时间：{{ formData.due_starttime }}）
                    <!-- {{ formData.name }}（合同编号：{{ formData.contract_no }}，起始时间：{{
                        dayjs(formData.due_starttime).format('YYYY-MM-DD') }}） -->
                </div>
                <n-watermark :content="store.users.name" cross class="wate-box" selectable :font-size="14" :line-height="18"
                    :width="240" :height="138" :x-offset="12" :y-offset="50" :rotate="-12" font-color="rgba(128, 128, 128, .2)">
                    <n-form :show-feedback="false" ref="servicesStatusFormRef" class="wate-form-box" label-placement="left">
                        <n-grid :cols="24" :x-gap="24">
                            <n-form-item-gi :span="item.span" v-for="item in formLabel" :label="item.label">
                                <!-- 是否涉及资金往来 -->
                                <template v-if="item.key == 'transactions'">
                                    {{ isTransactions[formData[item.key]] }}
                                </template>
                                <!-- 合同类型 -->
                                <template v-if="item.key == 'type'">
                                    {{ contractType[formData[item.key]] }}
                                </template>
                                <!-- 合同有效期 -->
                                <template v-if="item.key == 'due_starttime'">
                                    {{ formData.due_starttime }} 至 {{ formData.due_endtime }}
                                    <!-- {{ dayjs(formData.due_starttime).format('YYYY-MM-DD') }} 至 {{
                                        dayjs(formData.due_endtime).format('YYYY-MM-DD') }} -->

                                </template>

                                <template v-else>
                                    {{ formData[item.key] }}
                                </template>
                            </n-form-item-gi>
                        </n-grid>
                    </n-form>
                </n-watermark>
            </div>

            <template #footer>
                <div class="project-footer">
                    <n-button type="warning" @click="closeShow">关闭</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, defineExpose } from 'vue'
import { downLoadFile } from "@utils";
import useStore from '@/config/pinia'
import dayjs from 'dayjs'
import {
    GetContractInfoApi
} from '@/config/api'
import { cloneDeep } from 'lodash'
import { isTransactions, contractType } from '@/views/constant/project'
const props = defineProps(['id']);
const emits = defineEmits(['closeShow']);
const store = useStore()

const formLabel = ref([
    { label: '公司主体：', key: "company_body_name", span: 12 },
    { label: '主体类型：', key: "customer_type_name", span: 12 },
    { label: '合同编号：', key: "contract_no", span: 12 },
    { label: '所在部门：', key: "dept_name", span: 12 },
    { label: '涉及资金往来：', key: "transactions", span: 12 },
    { label: '申请人：', key: "applicant", span: 12 },
    { label: '合同名称：', key: "name", span: 12 },
    { label: '合同负责人：', key: "author", span: 12 },
    { label: '对方公司名称：', key: "provider_type_name", span: 12 },
    { label: '合同属性：', key: "type", span: 12 },
    { label: '合同收支类型：', key: "trade_type_name", span: 12 },
    { label: '合同业务类型：', key: "provider_type_name", span: 12 },
    { label: '供应商类型：', key: "provider_type_name", span: 12 },
    { label: '结算方式：', key: "settlement_name", span: 12 },
    { label: '合同金额：', key: "annex", span: 12 },
    { label: '税点（单位:%）：', key: "annex", span: 12 },
    { label: '合同有效期：', key: "due_starttime", span: 12 },
    { label: '合同摘要：', key: "annex", span: 12 },
    { label: '合同备注：', key: "annex", span: 12 },
    { label: '印章：', key: "stamp_name", span: 12 },
    { label: '用印份数：', key: "annex", span: 12 },
    { label: '结算描述：', key: "annex", span: 12 },
])

const formData: any = ref({
    companyEntityName: '',
})
const isShow = ref(false);

const openShow = () => {
    isShow.value = true;
    getContractDetails()
}

const getContractDetails = async () => {
    let tempRes = await GetContractInfoApi({
        id: props.id
    })
    if (tempRes.code == 200) {
        formData.value = cloneDeep(tempRes.data)
    }
}

const closeShow = () => {
    isShow.value = false;
    emits('closeShow');
}

defineExpose({
    openShow,
    closeShow
})
</script>

<style scoped>
#servicesStatus {
    width: 800px;
    height: 600px;
}

#servicesStatus .n-select {
    font-size: 12px !important;
    margin: 0 0 5px;
}

#servicesStatus .percentage {
    bottom: 15px;
    color: #999;
    font-size: 12px !important;
    left: 215px;
    position: absolute;
}

.contract-title {
    width: 930px;
    margin-bottom: 10px;
}

.project-footer {
    display: flex;
    justify-content: end;
}

.wate-box {
    position: relative;
    margin-top: 20px;
}

.wate-form-box {
    position: relative;
}

.contract-box {
    overflow-x: hidden;
    overflow-y: auto;
}

.contract-box :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}
</style>