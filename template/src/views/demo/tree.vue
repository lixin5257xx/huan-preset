<!--
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2022-11-01 11:27:50
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2022-11-01 14:02:52
 * @FilePath: \operation-web\src\views\demo\tree.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by lixinxin lixinxin@huan.tv, All Rights Reserved. 
-->
<!--选择城市样例  -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
// 引用city组件
import City from '@/components/cascader-tree/index.vue'
// city数据
import { cityList } from '@/components/cascader-tree/index.d'
// 初始化选中的城市
const regions_ids = ref([])
// 选择城市列表
const selectCitiesList = ref([])
// 初始化配置文件
const cascaderOption = reactive({
    parentName: "省份",
    childrenName: "城市",
    nodeKey: "id",
    valueKey: "id",
    childrenKey: "children",
    childrenParentIdKey: "parent_id",
    childrenIdKey: "id",
    childrenLabel: "name",
    parentIdKey: "id",
    parentLabel: "name",
    label: "name",
    banCheckedParent: false,
    showTag: true,
    merge: false,
    search: false,
    disabled: false
})
// 获取选中的cityCode
const cityShowNode = (e: any) => {
    console.log('选中的city', e.map((item: any) => {
        return item.region_code
    }))
}

</script>
<template>
    <div class="screen"></div>
    <City :data="cityList" v-model="regions_ids" placeholder="请输入省市名称" :cascaderOption="cascaderOption"
        @showNode="cityShowNode"></City>
</template>

<style scoped>
.screen {}
</style>
