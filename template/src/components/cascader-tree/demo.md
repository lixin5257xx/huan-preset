<!--选择城市样例  -->
<script lang="ts" setup>
import { ref, reactive } from 'vue'
// 引用city组件
import City from '@/components/cityTree/index.vue'
// city数据
import { cityList } from '@/components/cityTree/index.d'
// 初始化选中的城市
const regions_ids = ref([])
// 选择城市列表
const selectCitiesList = ref([])
// 初始化配置文件
const cascaderOption = reactive({
    parentName: "省份",
    childrenName: "城市",
    childrenKey: "children",
    nodeKey: "region_code",
    valueKey: "region_code",
    parentLabel: "region_name",
    label: "region_name",
    search: true,
    showTag: true,
    disabled: false,
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
    <City
        :data="cityList"
        v-model="regions_ids"
        placeholder="请输入省市名称"
        :cascaderOption="cascaderOption"
        @showNode="cityShowNode"
    ></City>
</template>

<style scoped>
.screen {
}
</style>
