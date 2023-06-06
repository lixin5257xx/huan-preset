<script setup lang="ts">
import { reactive, useAttrs, ref, computed, watch } from 'vue'
import { sortBy, cloneDeep, constant } from 'lodash'
import dayjs from 'dayjs'
const props = defineProps(['show', 'loading'])
const emits = defineEmits(['update:show', "submit", 'update:loading'])
// 响应 material_list 同步到父组件
const formNotPassRef: any = ref(null)
let modelRules = {
    modify_order_cause: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入修改原因',
    },
}
var showChangeModel: any = computed({
    get: () => {
        return props.show;
    },
    set: (val) => {
        emits("update:show", val);
    },
});
var loading: any = computed({
    get: () => {
        return props.loading;
    },
    set: (val) => {
        emits("update:loading", val);
    },
});
//   modelReactive
const changeModel = reactive({
    modify_order_cause: '',
})
//   取消
const cancelCallback = () => {
    showChangeModel.value = false
    loading.value = false
    changeModel.modify_order_cause = ''
    checkArray.value = []
    tagList.forEach(item => {
        item.checked = false
    })
}
//   弹窗提交
const submitCallback = () => {
    if (checkArray.value.length == 0) {
        window.$message.error('请选择修改原因！')
        return false
    }
    if (!changeModel.modify_order_cause.trim()) {
        window.$message.error('请输入修改原因！')
        return false
    }
    const modify_msg = checkArray.value.join(',') + changeModel.modify_order_cause
    formNotPassRef.value.validate((error: any) => {
        if (!error) {
            showChangeModel.value = false
            loading.value = true
            emits('submit', modify_msg)
        }
    })
}
const checkArray = ref([])
const tagList = [
    {
        label: '客户改单：项目周期/订单增改/撤单等调整',
        value: '客户改单：项目周期/订单增改/撤单等调整',
    },
    {
        label: '折前单价/折后单价调整',
        value: '折前单价/折后单价调整',
    },
    {
        label: '项目返点/框架返点调整',
        value: '项目返点/框架返点调整',
    },
    {
        label: '合同调整',
        value: '合同调整',
    },
    {
        label: '项目名称/广告主/区域/广告位/媒体/投放模式/邮件凭证等调整',
        value: '项目名称/广告主/区域/广告位/媒体/投放模式/邮件凭证等调整',
    },
    {
        label: '项目基本和统计信息：如备注，KPI类型，录屏要求等调整',
        value: '项目基本和统计信息：如备注，KPI类型，录屏要求等调整',
    }
]
const handelGetCheckBox = (value: any) => {
    checkArray.value = value
}
</script>
<template>
    <!-- 改单原因弹窗 -->
    <n-modal v-model:show="showChangeModel" :auto-focus="false" :display-directive="'show'" :mask-closable="false">
        <n-card style="width: 600px" title="改单原因" :bordered="false" size="huge" role="dialog" aria-modal="true"
            class="changeReason">
            <p style="margin-bottom:10px;color:#999;font-size: 16px">请选择真实的修改内容，审核时可见，更多内容请在下方补充</p>
            <n-checkbox-group style="margin-bottom:10px;" @update:value="handelGetCheckBox" :value="checkArray">
                <n-grid :y-gap="1" :cols="1">
                    <n-gi v-for="item in tagList">
                        <n-checkbox :value="item.value"  :label="item.label" />
                    </n-gi>

                </n-grid>
            </n-checkbox-group>

            <n-form ref="formNotPassRef" :rules="modelRules" :model="changeModel" label-placement="left"
                label-width="100px" :show-feedback="true">
                <n-form-item label="" path="modify_order_cause">
                    <n-grid :cols="24">
                        <n-gi :span="24">
                            <n-input style="width: 550px" v-model:value="changeModel.modify_order_cause"
                                placeholder="更多内容在此补充，限制200字" type="textarea" v-emoji :maxlength="200" :autosize="{
                                    minRows: 5,
                                }" />
                        </n-gi>
                    </n-grid>
                </n-form-item>
            </n-form>
            <div class="project-footer">
                <n-button :text="true" class="btn-txt" @click="cancelCallback">取消</n-button>
                <n-button type="warning" style="margin-left: 10px" @click.prevent="submitCallback" v-preventReClick
                    :disabled="false" :loading="loading">
                    <span>确定修改并保存</span>
                </n-button>
            </div>
        </n-card>
    </n-modal>
</template>
<style scoped>
.project-footer {
    display: flex;
    justify-content: center;
    margin: 10px auto 30px;
}
</style>