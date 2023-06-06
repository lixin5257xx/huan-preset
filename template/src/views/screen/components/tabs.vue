<template>
    <n-tabs
        type="card"
        :addable="item_list.length < 8"
        pane-class="pane-tabs"
        @add="addTabs"
        v-model:value="tabValue"
        @close="closeTabs"
    >
        <n-tab-pane
            :name="index"
            :key="index"
            :tab="`任务${index + 1}`"
            :closable="item_list.length > 1"
            v-for="(item, index) in item_list"
        >
            <div class="tab-box">
                <n-form-item label="品牌" :show-require-mark="true" label-width="80px">
                    <n-radio-group v-model:value="item.brand">
                        <n-radio
                            v-for="bItem in brands"
                            style="min-width:100px;"
                            :value="bItem.value"
                        >{{ bItem.label }}</n-radio>
                    </n-radio-group>
                </n-form-item>
                <n-form-item label="时间校验" :show-require-mark="true" label-width="80px">
                    <n-radio-group v-model:value="item.baidu_flag">
                        <n-radio
                            v-for="tItem in timeVerification"
                            style="min-width:100px;"
                            :value="tItem.value"
                        >{{ tItem.label }}</n-radio>
                    </n-radio-group>
                </n-form-item>
                <!-- 绑定ID -->
                <n-form-item label-width="80px" label="绑定ID">
                    <n-input-number
                        :show-button="false"
                        v-model:value="item.module_id"
                        clearable
                        max="9999999999"
                        placeholder="请输入绑定ID"
                    />
                </n-form-item>
            </div>
        </n-tab-pane>
    </n-tabs>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useDialog } from 'naive-ui'
import { brands, timeVerification } from '../../constant/screen'
let props = defineProps(['modelValue', 'id'])
let emits = defineEmits(['update:modelValue'])
const dialog = useDialog()
const tabValue = ref(0);
const item_list = computed({
    get: () => {
        return props.modelValue
    },
    set: (val) => {
        emits('update:modelValue', val)
    }
})
const addTabs = () => {
    item_list.value.push({
        brand: "TCL",
        baidu_flag: 1,
        module_id: null
    });

    const newValue = item_list.value.length - 1
    tabValue.value = newValue
};
const closeTabs = (name: number) => {
    const tabVal = tabValue.value;
    if (props.id) {
        console.log('我是编辑')
        dialog.warning({
            title: '提示',
            content: `确认删除任务${name + 1}吗`,
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
                item_list.value.splice(name, 1);
                if (tabVal >= name) {
                    if (tabVal == 0 && name == 0) {
                        tabValue.value = 0;
                    } else {
                        tabValue.value = tabVal - 1;
                    }
                }
            }
        })
    } else {
        item_list.value.splice(name, 1);
        if (tabVal >= name) {
            if (tabVal == 0 && name == 0) {
                tabValue.value = 0;
            } else {
                tabValue.value = tabVal - 1;
            }
        }
    }
};

</script>
<style scoped>
.n-tab-pane {
    padding-top: 0;
}
.tab-box {
    background: #fafafa;
    padding: 20px 0 0 20px;
}
</style>