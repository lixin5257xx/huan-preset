<template>
    <div class="content">
        <n-grid item-responsive :cols="24">
            <n-grid-item :offset="2" :span="18" style="background: #fff;padding:25px;border-radius: 8px;">
                <h5>
                    <b>{{ !route.query.id ? '新建模板' : '模板信息' }} </b>
                </h5>
                <n-form ref="formRef" :model="model" :rules="rules" label-placement="left"
                    require-mark-placement="right-hanging" style="margin-left:100px;" label-width="100px">
                    <n-form-item label="模板名称" path="name">
                        <n-grid :col="24">
                            <n-gi :span="12">
                                <n-input v-model:value="model.name" placeholder="请输入模板名称" maxlength="60" />
                            </n-gi>
                        </n-grid>
                    </n-form-item>
                    <n-form-item label="是否广播" path="broadcast_flag">
                        <n-grid :cols="1" :y-gap="10">
                            <n-gi>
                                <n-radio-group v-model:value="model.broadcast_flag">
                                    <n-radio :value="item.value" :key="item.value" v-for="item in broadcast_flag">{{
                                        item.label
                                    }}</n-radio>
                                </n-radio-group>
                            </n-gi>
                        </n-grid>
                    </n-form-item>
                    <!-- 打开方式 -->
                    <n-form-item label="打开方式" path="jump_type" :show-feedback="false">
                        <n-radio-group v-model:value="model.jump_type">
                            <n-space>
                                <n-radio style="height: 32px;" :value="item.value" :key="item.value"
                                    v-for="item in JumpList">{{ item.label }}</n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <!-- APP包名 -->
                    <n-form-item style="margin-left: 100px;">
                        <n-grid :cols="24">
                            <n-gi :span="12">
                                <n-input :show-button="false" v-model:value="model.package_name" clearable maxlength="80"
                                    placeholder="请输入APP包名" />
                            </n-gi>
                        </n-grid>
                    </n-form-item>
                    <!-- APP类名 -->
                    <n-form-item style="margin-left: 100px;">
                        <n-grid :cols="24">
                            <n-gi :span="12">
                                <n-input :show-button="false" v-model:value="model.class_name" clearable maxlength="80"
                                    placeholder="请输入APP类名" />
                            </n-gi>
                        </n-grid>
                    </n-form-item>
                    <!-- APP action -->
                    <n-form-item style="margin-left: 100px;">
                        <n-grid :cols="24">
                            <n-gi :span="12">
                                <n-input :show-button="false" v-model:value="model.intent_action" clearable maxlength="80"
                                    placeholder="请输入APP启动Action" />
                            </n-gi>
                        </n-grid>
                    </n-form-item>
                    <!-- APP地址 -->
                    <n-form-item style="margin-left: 100px;">
                        <n-grid :cols="24">
                            <n-gi :span="12">
                                <n-input :show-button="false" v-model:value="model.action_url" clearable maxlength="500"
                                    placeholder="请输入APP地址" />
                            </n-gi>
                        </n-grid>
                    </n-form-item>
                    <!-- 参数名称 -->
                    <n-form-item style="margin-left: 100px;" :key="index" v-for="(item, index) in model.parameter">
                        <ParamsList v-model="model.parameter[index]" :index="index" :length="model.parameter.length"
                            @addParams="addParams" @minuParams="minuParams"></ParamsList>
                    </n-form-item>
                    <!-- 按键 -->
                    <n-form-item style="margin-left: 100px;">
                        <n-radio-group v-model:value="model.control_list_copy" @update:value="changeScreenShot">
                            <n-space>
                                <n-grid>
                                    <n-gi>
                                        <AddKey v-model="model.control_list_copy"></AddKey>
                                    </n-gi>
                                </n-grid>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item label="描述" path="msg">
                        <n-input v-model:value="model.msg" placeholder="请输入描述" type="textarea" maxlength="200"
                            style="width:50%" :autosize="{
                                minRows: 3
                            }" />
                    </n-form-item>


                </n-form>
            </n-grid-item>
            <n-grid-item :offset="2" :span="18" style="margin-top: 20px;">
                <!-- 操作按钮 -->
                <div style="display: flex; justify-content: center;">
                    <n-button :text="true" :loading="model.click_state" class="btn-txt" @click="goBack">取消</n-button>
                    <n-button type="warning" v-permissions="submitCode" class="btn-submit" @click.prevent="submit"
                        v-preventReClick :loading="model.click_state">
                        保存并关闭</n-button>
                </div>
            </n-grid-item>
        </n-grid>

        <n-icon size="160px" :depth="5" class="bg_icon_2">
            <ReceiptAdd20Regular />
        </n-icon>
    </div>
</template>
<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { ReceiptAdd20Regular } from '@vicons/fluent'
import { JumpList, broadcast_flag } from '../constant/screen'
import AddKey from './components/addKey.vue'
import ParamsList from './components/paramsList.vue'
import { GetTempDetailsApi } from '@/config/api/index'
import { useState, useSave, useMounted, useHandle } from './use/addOrUpdateTemp'
import { useRouter, useRoute } from "vue-router";

let { model, rules, formRef } = useState()
let { submit } = useSave(model, formRef)
let {
    changeScreenShot,
    addParams,
    minuParams,
} = useHandle(model)
let { getAdSourceList } = useMounted()
const router = useRouter();
const route = useRoute();

const goBack = () => {
    router.push({
        name: 'screenTemplate'
    });
};

route.meta.bread[route.meta.bread.length - 1].label = route.query.id ? "编辑模板" : "新建模板";
const submitCode = route.query.id ? 'click-template:update' : 'click-template:save'

onMounted(() => {
    getAdSourceList()
    getDetail()

})

const getDetail = async () => {
    const id: any = route.query.id
    if (id) {
        model.value.id = id;
        let { data, code } = await GetTempDetailsApi({
            id: id
        })
        if (code == 200) {
            model.value = Object.assign(model.value, data)
            model.value.control_list_copy = model.value.control_list.length > 0 ? model.value.control_list : [null]
        }
    }

}

</script>

<style scoped>
.laout-content {
    background: #fafafa;
}

.content {
    background: #fafafa !important;
    padding-bottom: 50px !important;
    margin: var(--theme-box-margin);
}

.content h5,
.content h5 b {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
    margin: 0 0 25px;
}

.content h5 b {
    display: inline-block;
    margin: 0 0 3px;
}

.input-warp-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
}

.input-txt {
    width: 40px;
    height: 30px;
    border: none;
    outline: none;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #262626;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.input-box {
    padding: 0 15px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 3px;
}

.input-box:hover {
    border: 1px solid #fa8c16;
}

.input-box .left,
.input-box .right {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #262626;
}

.n-space {
    align-items: center;
}

.content :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.content :deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab) {
    border: none;
    background: none;
    border-bottom: 1px solid rgb(239, 239, 245);
}

.content :deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab.n-tabs-tab--active) {
    border-bottom: 1px solid #fa8c16;
}

.content :deep(.n-base-close:hover) {
    color: #595959;
}

.content :deep(.model-id .n-form-item-feedback-wrapper) {
    grid-column: span 8 / span 8;
    margin-left: calc(((100% - 476px) / 8) * 2 + 136px);
}

.content :deep(.input-txt .n-input-wrapper) {
    padding: 0 !important;
}

.content :deep(.input-txt .n-input__input-el) {
    width: 40px;
    height: 30px;
    border: none !important;
    outline: none;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #262626;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-image: none !important;
    border-image-width: 0 !important;
}

.question-box {
    position: absolute;
    font-size: 14px;
    z-index: 999;
    left: -42px;
    top: 7px;
    width: 20px;
}

.add-icon-box,
.question-box {
    color: #999999 !important;
}
</style>



