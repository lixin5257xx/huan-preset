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
    bossStatus, //项目状态
} from '@/views/constant/project'
import { MdCheckmark } from '@vicons/ionicons4'
import { AlertCircleOutline } from '@vicons/ionicons5'
const props = defineProps(['row'])

const projectList = ref([])
projectList.value = props.row.status_log_tree;
// // 审核状态 (11:待审核;20: 审核通过，21: 审核不通过
let statusMap: any = {
    21: 'project-status project-red',
    20: 'project-status project-green',
    11: 'project-status project-gray',
}
let pointMap: any = {
    21: 'point point-red',
    20: 'point point-green',
    11: 'point point-gray',
}
</script>

<template>
    <span>
        <div class="project-box">
            <div class="status-box">
                <span :class="[pointMap[row.boss_status]]"></span>
                <span class="project-status">
                    {{ bossStatus[row.boss_status] }}
                </span>
            </div>

        </div>
    </span>
    <!-- <span class="project-box">

        <n-popover placement="right" trigger="hover">
            <template #trigger>
                <div>
                    <div class="status-box">
                        <span :class="[pointMap[row.status]]"></span>
                        <span class="project-status">
                            {{ bossStatus[row.status] }}
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
                        <div class="status-bottom">
                            <div class="status-bottom-left">{{ item.error_msg }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </n-popover>
    </span> -->
    <n-tooltip trigger="hover" v-if="(row.boss_status == 20 || row.boss_status == 21) && row.not_pass_msg">
        <template #trigger>
            <span class="project-status" style="color: #f5222d; width: auto; margin-left: 3px;">
                <AlertCircleOutline class="icon-danger" style="margin-left: 3px;"></AlertCircleOutline>
            </span>
        </template>
        <div>
            驳回原因：{{ row.not_pass_msg }}
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