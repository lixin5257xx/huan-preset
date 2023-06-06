<script setup lang="ts">
import {
    reactive,
    ref,
    h,
    onMounted,
    RendererElement,
    RendererNode,
    VNode,
    Ref,
    watchEffect,
} from 'vue'
import { NButton, NIcon, useDialog, NTooltip, NPopover } from 'naive-ui'
// 引用筛选项默认值
import {
    projectStatusMap, //项目状态
} from '@/views/constant/project'
import { MdCheckmark } from '@vicons/ionicons4'
import { AlertCircleOutline } from '@vicons/ionicons5'
const props = defineProps(['row'])

const projectList = ref([])
// 审核状态 (10: 调整中，11:待审核;20: 审核通过，21: 审核不通过，30: 已结束
projectList.value = props.row.status_log_tree;
let statusMap: any = {
    10: 'project-status status-gray',
    11: 'project-status status-gray',
    20: 'project-status status-green',
    21: 'project-status status-red',
    30: 'project-status status-gray',
}
let pointMap: any = {
    10: 'point point-gray',
    11: 'point point-gray',
    20: 'point point-green',
    21: 'point point-red',
    30: 'point point-gray',
}
</script>

<template>
    <span class="project-box">

        <n-popover placement="right" trigger="hover">
            <template #trigger>
                <div>
                    <div class="status-box">
                        <span :class="[pointMap[row.status]]"></span>
                        <span class="project-status">
                            {{ projectStatusMap[row.status] }}
                        </span>
                    </div>

                </div>
            </template>
            <div class="large-text">
                <div class="status-list-box">
                    <div class="status-list" v-for="item in projectList">
                        <div class="status-top">
                            <div class="status-left">{{ item.title }}</div>
                            <div :class="['status-name', statusMap[item.status]]">{{ item.status_name }}</div>
                        </div>
                        <div class="status-bottom">
                            <div class="status-bottom-left">{{ item.operation_user_name }}</div>
                            <div class="status-bottom-time">{{ item.create_time }}</div>
                        </div>
                        <div class="status-bottom" v-if="item.error_msg">
                            <div class="status-bottom-left">审核意见：{{ item.error_msg }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </n-popover>
    </span>
    <!-- 审核 -->
    <n-tooltip trigger="hover" v-if="(row.status == 20 || row.status == 21) && row.not_pass_msg">
        <template #trigger>
            <!-- color: #f5222d; -->
            <span class="project-status project-icon-box" :style="{ color: row.status == 20 ? '#666666' : '#f5222d;' }">
                <AlertCircleOutline class="icon-danger" style="margin-left: 3px;"></AlertCircleOutline>
            </span>
        </template>
        <div>
            审核意见：{{ row.not_pass_msg }}
        </div>
    </n-tooltip>
    <!-- 调整中 -->
    <n-tooltip trigger="hover" v-if="row.status == 10" class="project-popover">
        <template #trigger>
            <span class="project-status project-icon-box" style="color: #666666; ">
                <AlertCircleOutline color="#999999;" class="icon-danger" style="margin-left: 3px;"></AlertCircleOutline>
            </span>
        </template>
        <div class="msg-box">
            <div class="msg-list" v-for="item in row.supplement_data_list">
                <span>{{ item.data_name }}</span>
                <img src="@/assets/images/s-right.png" class="icon-right" v-if="item.complete_flag" />
                <img src="@/assets/images/s-error.png" class="icon-right" v-else />
            </div>
        </div>
    </n-tooltip>
</template>
    

<style scoped>
.status-list-box {
    width: 250px;
    max-height: 380px;
    border-radius: 10px;
    background: #fff;
    padding: 20px 20px;
}

.project-box {
    display: inline-block;
}

.project-icon-box {
    width: auto;
    margin-left: 3px;
    margin-top: 2px;
}

.status-list {
    margin-bottom: 16px;
}

.status-list:nth-last-of-type(1) {
    margin-bottom: 0;
}

.status-list .status-top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 4px;
}

.status-list .status-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
    margin-bottom: 6px;
}

.status-bottom-left,
.status-bottom-time {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 16px;
}

.status-left {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #666666;
    line-height: 16px;
}

.status-name {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 16px;
}

.status-green {
    color: #52C41A;
}

.status-red {
    color: #E02020;
}

.status-box {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
}

.point {
    width: 6px;
    height: 6px;
    display: block;
    border-radius: 50%;
    margin-right: 4px;
}

.point-gray {

    background: #8C8C8C;
}

.point-green {
    background: #52C41A;
}

.point-red {
    background: #E02020;
}

.point-blue {
    background: #1890FF;
}

.msg-list {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fff;
    display: flex;
    flex-direction: row;
}

.icon-msg {
    width: 18px;
    height: 18px;
}

.icon-right {
    width: 12px;
    height: 12px;
    margin-left: 3px;
    margin-top: 5px;
}

.msg-icon-box {
    margin-top: 3px;
}
</style>