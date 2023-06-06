<!--
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-05-31 09:31:13
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-06-01 17:20:57
 * @FilePath: \operation-web\src\views\project\components\s2Table.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <SheetComponent ref="s2" :dataCfg="dataCfg" :options="options" :themeCfg="themeCfg" />
</template>

<script setup lang="ts">
import type { S2DataConfig, S2Options } from '@antv/s2';
import { SheetComponent } from '@antv/s2-vue';
import { defineComponent, reactive, shallowRef } from 'vue';
import "@antv/s2-vue/dist/style.min.css";

let props = defineProps(['dataCfg', 'options','themeCfg']);

const s2DataConfig = {
    fields: {
        rows: ['province'],
        columns: ['type'],
        values: ['number'],
    },
    meta: [
        {
            field: 'number',
            name: '数量',
        },
        {
            field: 'province',
            name: '省份',
        },
        {
            field: 'city',
            name: '城市',
        },
        {
            field: 'type',
            name: '类别',
        },
        {
            field: 'sub_type',
            name: '子类别',
        },
    ],
    data: [],
};
const rawOptions: S2Options = {
    width: 1100,
    height: 300,
    interaction: {
        enableCopy: true,
        // copyWithHeader:true,
    },
};

const s2 = shallowRef();
const dataCfg = shallowRef(props.dataCfg);
const options = reactive(props.options);

</script>

<style scoped></style>