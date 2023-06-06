<!-- 提示组件 -->
<script lang="ts" setup>
import { useAttrs } from "vue";
// 所有props的实例
const attrs = useAttrs()
</script>
<template>
    <n-tooltip v-bind="attrs">
        <template #trigger>
            <slot></slot>
        </template>
        <slot name="header"></slot>
    </n-tooltip>
</template>
<style >
.ant-tooltip-inner p {
    white-space: break-spaces;
}
.ant-tooltip-inner {
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 400px;
}
</style>