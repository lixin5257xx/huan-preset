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
    orderStatusMap, //项目状态
} from '@/views/constant/project'
const props = defineProps(['row'])
const projectList = ref([])
let statusMap: any = {
    1: 'order-status order-gray',
    2: 'order-status order-blue',
    9: 'order-status order-red',
    4: 'order-status order-green',
    31: 'order-status order-red',
}
let pointMap: any = {
    1: 'point point-gray',
    2: 'point point-blue',
    9: 'point point-red',
    4: 'point point-green',
    31: 'point point-red',
}
</script>

<template>
    <div class="status-box">
        <span :class="[pointMap[row.status]]"></span>
        <span class="order-status">
            {{ row.status == -1 ? '已撤单' : orderStatusMap[row.status] }}
        </span>
    </div>
</template>
    

<style scoped>

.status-list-box {
    width: 250px;
    max-height: 380px;
    border-radius: 10px;
    overflow-y: auto;
    background: #fff;
    padding: 20px 20px;
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
    display: flex;
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
</style>