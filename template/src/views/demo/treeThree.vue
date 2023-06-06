<!--
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2022-11-01 11:27:50
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2022-11-07 17:08:12
 * @FilePath: \operation-web\src\views\demo\treeThree.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by lixinxin lixinxin@huan.tv, All Rights Reserved. 
-->
<!--选择城市样例  -->
<script lang="ts" setup>
import { ref, reactive, onMounted, unref } from 'vue'
import { uniqBy } from 'lodash'
// 引用city组件
import City from '@/components/cascader-three/index.vue'
// city数据
import { cityList } from '@/components/cascader-three/index.d'



// 初始化选中的城市
const regions_ids = ref([])
// 选择城市列表
const selectCitiesList = ref([])
// 初始化配置文件
const cascaderOption = reactive({
    parentName: "角色权限",
    childrenName: "",
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
    disabled: false,
    threeName: "",
    code: "code"
})
// 获取选中的cityCode
const cityShowNode = (keys: any, nodes: any) => {
    console.log('选中的key', keys)
    console.log('选中的List', nodes)
    regions_ids.value = keys
    selectCitiesList.value = nodes
}
const codeList = ref([])
let { childrenParentIdKey, childrenKey, nodeKey, code } = cascaderOption
const getCodeList = () => {
    codeList.value = []
    selectCitiesList.value.forEach(item => {
        if (item[childrenParentIdKey]) {
            let parentNode = flatList.value.filter(flat => {
                return flat[nodeKey] == item[childrenParentIdKey]
            })
            console.log('parentNode', parentNode)
            console.log('parentNode[0][childrenParentIdKey]', parentNode[0][childrenParentIdKey])
            if (parentNode[0][childrenParentIdKey]) {
                let parentsNode = flatList.value.filter(flat => {
                    return flat[nodeKey] == parentNode[0][childrenParentIdKey]
                })
                codeList.value.push(parentsNode[0])
            }
            codeList.value.push(parentNode[0])
        }
        codeList.value.push(item)
    })
    // let submitCodeList = uniqBy(codeList.value, 'id')
    let submitCodeList = codeList.value.map(item => {
        return item.code
    })
    console.log('codeList', submitCodeList.join(','))
}
const handleSubmit = () => {
    getCodeList()
}
const flatList = ref([])
const updateFlatList = (menuIdList: any) => {
    menuIdList.forEach((item: any) => {
        if (!item[childrenKey]) {
            flatList.value.push(item)
            return
        }
        updateFlatList(item[childrenKey])
    })
}
onMounted(() => {
    updateFlatList(cityList)
    console.log('flatList', flatList.value)
})
</script>
<template>
    <div class="screen"></div>
    <City :data="cityList" v-model="regions_ids" placeholder="请输入省市名称" :cascaderOption="cascaderOption"
        @handleSelectChange="cityShowNode"></City>
    <n-button type="success" @click="handleSubmit">
        确定
    </n-button>
</template>

<style scoped>
.screen {}
</style>
