<script setup lang="ts">
import { onMounted, ref, reactive, computed, Ref, nextTick } from 'vue'
import { AlertCircleOutline, Close } from '@vicons/ionicons5'
import { useRouter, useRoute } from 'vue-router'
import {
    UpdateStatusApi
} from '@api'
import dayjs from 'dayjs'
const props = defineProps(['show', 'project_status_model'])
const emits = defineEmits(['update:show', "update:project_status_model", "getProjectData"])
var examineStatus: any = computed({
    get: () => {
        return props.show;
    },
    set: (val) => {
        emits("update:show", val);
    },
});
var project_status_model: any = computed({
    get: () => {
        return props.project_status_model;
    },
    set: (val) => {
        emits("update:project_status_model", val);
    },
});
const project_status_columns: any = [
    {
        title: '产品名称',
        key: 'product_name',
        width: 100,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '广告位',
        key: 'ad_space_name',
        width: 180,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '投放量(CPM)',
        key: 'cpm',
        width: 150,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '折前单价(元)',
        key: 'price',
        width: 120,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '折前预估收入(元)',
        key: 'estimate_income',
        width: 140,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '折后单价(元)',
        key: 'discount_price',
        width: 120,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '折后预估收入(元)',
        key: 'discount_estimate_income',
        width: 140,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '项目返点方式',
        key: 'return_point_type',
        width: 140,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '项目返点(元)',
        key: 'return_point_price',
        width: 150,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '框架返点方式',
        key: 'policy_return_point_type',
        width: 120,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '框架返点(元)',
        key: 'policy_return_point_price',
        width: 140,
        ellipsis: {
            tooltip: true,
        },
    },
]
const btnLoading = ref(false)
// 项目信息审核提交
const passStateUpdate = (id: any, status: any) => {
    console.log('project_status_model', project_status_model)
    const project_status_modelRef = project_status_model.value.project_status_modelRef
    let parmas = {
        id: id,
        status: status, //根据弹窗隐藏状态判断true就是驳回，false通过
        not_pass_msg: project_status_modelRef.not_pass_msg, //根据弹窗隐藏状态判断true就是带驳回信息，false驳回信息为空
    }
    if (status == 2 && !project_status_modelRef.not_pass_msg) {
        window.$message.error('请输入不通过原因')
        return false
    }
    btnLoading.value = true;
    UpdateStatusApi(parmas).then(() => {
        project_status_modelRef.not_pass_msg = ''
        window.$message.success('审核成功')
        emits('getProjectData')
        btnLoading.value = false;
        examineStatus.value = false //关闭弹窗
    }).catch(() => {
        btnLoading.value = false;
        examineStatus.value = false //关闭弹窗
    })
}
const afterLeave = () => {
    project_status_model.value.project_status_modelRef.not_pass_msg = ''
}
const handelClose = () => {
    if (btnLoading.value) return false
    examineStatus.value = false
}
</script>
<template>
    <!-- BOSS送审详情弹窗 -->
    <n-modal class="boss-alert" @after-leave="afterLeave" v-model:show="examineStatus" :mask-closable="false"
        style="width:1200px;">
        <n-card title="BOS送审详情" :bordered="false" size="huge" role="dialog" aria-modal="true" class="updateStatus previews">
            <template #header-extra>
                <div class="close-box" @click="handelClose">
                    <n-icon size="28" :depth="2">
                        <Close></Close>
                    </n-icon>
                </div>
            </template>
            <n-form ref="projectStatusModelRef" class="examine-box" label-width="100px"
                :model="project_status_model.project_status_modelRef" label-placement="left">
                <n-grid :cols="24" :x-gap="24">
                    <n-form-item-gi :span="24" v-if="false">
                        <h5 class="alert-title">改单记录</h5>
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" v-if="false">
                        <div class="record-box">
                            <div class="record-list">
                                <div class="name">2023-05-04 22:22:22 操作人A </div>
                                <div class="msg">
                                    我是原因，原因的字数可能很多，可能很少。我是原因，原因的字数可能很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因
                                </div>
                                <div class="tips-box">
                                    <div class="tips red">冲抵</div>
                                    <div class="tips blue">单价</div>
                                    <div class="tips origin">返点</div>
                                    <div class="tips gray">普通</div>
                                </div>

                            </div>
                            <div class="record-list">
                                <div class="name">2023-05-04 22:22:22 操作人A </div>
                                <div class="msg">
                                    我是原因，原因的字数可能很多，可能很少。我是原因，原因的字数可能很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因
                                </div>
                                <div class="tips-box">
                                    <div class="tips red">冲抵</div>
                                    <div class="tips blue">单价</div>
                                    <div class="tips origin">返点</div>
                                    <div class="tips gray">普通</div>
                                </div>

                            </div>
                            <div class="record-list">
                                <div class="name">2023-05-04 22:22:22 操作人A </div>
                                <div class="msg">
                                    我是原因，原因的字数可能很多，可能很少。我是原因，原因的字数可能很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因
                                </div>
                                <div class="tips-box">
                                    <div class="tips red">冲抵</div>
                                    <div class="tips blue">单价</div>
                                    <div class="tips origin">返点</div>
                                    <div class="tips gray">普通</div>
                                </div>

                            </div>
                            <div class="record-list">
                                <div class="name">2023-05-04 22:22:22 操作人A </div>
                                <div class="msg">
                                    我是原因，原因的字数可能很多，可能很少。我是原因，原因的字数可能很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因
                                </div>
                                <div class="tips-box">
                                    <div class="tips red">冲抵</div>
                                    <div class="tips blue">单价</div>
                                </div>

                            </div>
                            <div class="record-list">
                                <div class="name">2023-05-04 22:22:22 操作人A </div>
                                <div class="msg">
                                    我是原因，原因的字数可能很多，可能很少。我是原因，原因的字数可能很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因
                                </div>
                                <div class="tips-box">
                                    <div class="tips red">冲抵</div>
                                    <div class="tips blue">单价</div>
                                    <div class="tips origin">返点</div>
                                </div>

                            </div>
                            <div class="record-list">
                                <div class="name">2023-05-04 22:22:22 操作人A </div>
                                <div class="msg">
                                    我是原因，原因的字数可能很多，可能很少。我是原因，原因的字数可能很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因很多，可能很少我是原因
                                </div>
                                <div class="tips-box">
                                    <div class="tips gray">普通</div>
                                </div>

                            </div>
                        </div>
                    </n-form-item-gi>
                    <n-form-item-gi :span="24">
                        <h5 class="alert-title">项目概览</h5>
                    </n-form-item-gi>
                    <n-form-item-gi label="项目ID：" :span="12">
                        {{ project_status_model.project_status_modelRef.id }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="投放量级：">
                        {{ project_status_model.project_status_modelRef.put_level }}
                    </n-form-item-gi>
                    <n-form-item-gi label="项目名称：" :span="12">
                        {{ project_status_model.project_status_modelRef.name }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="投放单价：">
                        {{ project_status_model.project_status_modelRef.put_price_unit }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="项目周期：">
                        {{ dayjs(project_status_model.project_status_modelRef.coo_start_time).format('YYYY-MM-DD') }} 至
                        {{
                            dayjs(project_status_model.project_status_modelRef.coo_end_time).format('YYYY-MM-DD') }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="投放金额：">
                        {{ project_status_model.project_status_modelRef.put_price_all }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="下单日期：">
                        {{ project_status_model.project_status_modelRef.push_time }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="预估总量：">
                        {{ project_status_model.project_status_modelRef.forecast_all_count }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="预估收入：">
                        {{ project_status_model.project_status_modelRef.forecast_income }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="24">
                        <h5 class="alert-title">凭证信息</h5>
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="合同：">
                        {{ project_status_model.project_status_modelRef.contract }}
                    </n-form-item-gi>

                    <n-form-item-gi :span="12" label="下单公司：">
                        {{ project_status_model.project_status_modelRef.company_name }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="12" label="公司主体：">
                        {{ project_status_model.project_status_modelRef.company_body_name }}
                    </n-form-item-gi>
                    <n-form-item-gi :span="24" label="邮件截图：">
                        <n-image-group>
                            <n-space>
                                <n-image v-for="item in project_status_model.project_status_modelRef.email_image" width="80"
                                    :src="item" />
                            </n-space>
                        </n-image-group>
                    </n-form-item-gi>
                    <n-form-item-gi :span="24">
                        <h5 class="alert-title">订单内容</h5>
                    </n-form-item-gi>
                    <n-form-item-gi :span="24">
                        <n-data-table :columns="project_status_columns" :scroll-x="1500" class="table-head-gray"
                            :data="project_status_model.project_status_modelRef.subject_schedule_list" :bordered="false"
                            :single-line="true" />
                    </n-form-item-gi>

                    <n-form-item-gi :span="24">
                        <h5 class="alert-title">审核意见</h5>
                    </n-form-item-gi>
                    <n-form-item-gi :span="24">
                        <n-grid>
                            <n-gi :span="24">
                                <n-input style="height:100px;"
                                    v-model:value="project_status_model.project_status_modelRef.not_pass_msg"
                                    placeholder="如审核不通过请务必输入原因" type="textarea" v-emoji maxlength="100" :autosize="{
                                        minRows: 3,
                                    }" />
                            </n-gi>
                        </n-grid>
                    </n-form-item-gi>
                </n-grid>
            </n-form>
            <div class="project-footer">
                <n-button type="error" v-permissions="'subject:updateStatus'" :loading="btnLoading"
                    @click="passStateUpdate(project_status_model.project_status_modelRef.id, 21)">不通过</n-button>
                <n-button type="warning" style="margin-left: 10px" @click.prevent="passStateUpdate(project_status_model.project_status_modelRef.id, 20)
                    " v-permissions="'subject:updateStatus'" v-preventReClick :loading="btnLoading">
                    通过并送审至BOS系统</n-button>
            </div>
        </n-card>
    </n-modal>
</template>
<style scoped>
.close-box {
    float: right;
    margin-left: 10px;
    cursor: pointer;
    color: #000;
}

.record-box {
    max-height: 160px;
    overflow-y: auto;
}

.record-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
}

.record-list .tips-box {
    width: 220px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
}

.record-list .tips {
    padding: 0 10px;
    height: 22px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin-left: 8px;
}

.record-list .tips.red {
    background: rgba(224, 32, 32, 0.1);
    color: #E02020;
}


.record-list .tips.blue {
    background: #E6F7FF;
    border-radius: 2px;
    color: #1890FF;
}

.record-list .tips.origin {
    background: rgba(250, 140, 22, 0.10);
    border-radius: 2px;
    color: #FA8C16;
}

.record-list .tips.gray {
    background: rgba(245, 245, 245, 1);
    border-radius: 2px;
    color: rgba(144, 147, 153, 1);
}

.record-list .name {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 22px;
}

.record-list .msg {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    margin-left: 10px;
    width: 700px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}

.examine-box :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}</style>
    