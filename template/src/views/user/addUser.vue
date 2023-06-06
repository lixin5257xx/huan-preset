<template>
    <div class="content">
        <n-grid item-responsive :cols="24">
            <n-grid-item :offset="2" :span="18" style="border-radius: 8px">
                <n-form ref="formRef" :model="model" :rules="rules" label-placement="left"
                    require-mark-placement="right-hanging" label-width="100px">
                    <div class="block-item">
                        <h5><span>{{ route.query.type == "update" ? '编辑账户' : '新建账户' }} </span></h5>
                        <!-- 展示场景 -->
                        <n-form-item label="账户名称" path="name">
                            <n-grid :cols="24">
                                <n-gi :span="24">
                                    <n-input style="width: 450px" v-model:value="model.name" clearable placeholder="请输入账户名称"
                                        maxlength="20" />
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="电子邮箱" path="email">
                            <n-grid :cols="24">
                                <n-gi :span="24">
                                    <n-input style="width: 450px" v-model:value="model.email" clearable
                                        placeholder="请输入电子邮箱" maxlength="40" />
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="手机" path="phone">
                            <n-grid :cols="24">
                                <n-gi :span="24">
                                    <n-input style="width: 450px" v-model:value="model.phone" clearable placeholder="请输入手机号"
                                        maxlength="13" />
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item v-if="route.query.type != 'update'" label="设置密码" path="password">
                            <n-grid :cols="24">
                                <n-gi :span="24">
                                    <n-input style="width: 450px" v-model:value="model.password" clearable
                                        placeholder="请输入密码" maxlength="40" />
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="描述" path="des" style="margin-bottom: 16px">
                            <n-grid :cols="24">
                                <n-gi :span="24">
                                    <n-input style="width: 450px" v-model:value="model.des" placeholder="请输入描述"
                                        type="textarea" v-emoji maxlength="100" :autosize="{
                                            minRows: 3
                                        }" />
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                    </div>
                    <div class="block-item">
                        <h5>权限设置</h5>
                        <n-form-item label="角色" path="role_id">
                            <n-select style="width: 450px" v-model:value="model.role_id" class="select-role"
                                placeholder="下拉选择角色" :options="roleList" clearable filterable />
                            <n-button size="medium" text class="text-orange-left" @click="jumpRole">
                                新建角色
                            </n-button>
                        </n-form-item>
                        <n-form-item label="销售区域" path="region_type">
                            <n-grid :cols="24">
                                <n-gi :span="18">
                                    <n-radio-group v-model:value="model.region_type" @update:value="updateRegionType">
                                        <n-radio :value="1">不限</n-radio>
                                        <n-radio :value="2">自定义</n-radio>
                                    </n-radio-group>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item v-if="model.region_type == 2" label="自定义区域" path="region_list">
                            <n-grid :cols="24">
                                <n-gi :span="24">
                                    <cascadeTree :data="companyList" v-model="model.region_list" placeholder="请输入销售区域"
                                        :cascaderOption="cascaderOption"></cascadeTree>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="职级" path="rank">
                            <n-grid :cols="24">
                                <n-gi :span="18">
                                    <n-radio-group v-model:value="model.rank">
                                        <n-radio :value="-1">不限</n-radio>
                                        <n-radio :value="1">职员</n-radio>
                                        <n-radio :value="2">负责人</n-radio>
                                    </n-radio-group>
                                </n-gi>
                            </n-grid>
                        </n-form-item>
                        <n-form-item label="程序化" path="auto_flag">
                            <n-grid :cols="24">
                                <n-gi :span="18">
                                    <n-radio-group v-model:value="model.auto_flag">
                                        <n-radio :value="1">是&nbsp;&nbsp;&nbsp;</n-radio>
                                        <n-radio :value="0">否</n-radio>
                                    </n-radio-group>
                                </n-gi>
                            </n-grid>
                        </n-form-item>

                    </div>
                </n-form>
            </n-grid-item>
            <n-grid-item :offset="2" :span="18" style="margin-top: 20px;">
                <div style="display: flex; justify-content: center">
                    <n-button :loading="submitLoading" :text="true" class="btn-txt" @click="goBack">取消</n-button>
                    <n-button :loading="submitLoading" type="warning" v-permissions="submitCode" class="btn-submit"
                        @click.prevent="submit" v-preventReClick :disabled="false">
                        保存并关闭</n-button>
                </div>
            </n-grid-item>
        </n-grid>
        <n-icon size="140px" :depth="5" class="bg_icon">
            <AddReactionOutlined />
        </n-icon>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { AddReactionOutlined } from '@vicons/material'
import { getRegionListApi, getRoleListApi, saveUserApi, getUserDetailsApi, updateUserApi } from '@/config/api'
import { useRouter, useRoute } from 'vue-router'
import {
    powerList
} from '../constant/user'
import userInfo from './use/user'
import cascadeTree from '@/components/cascader-tree/index.vue'

// 初始化配置文件
const cascaderOption = reactive({
    parentName: "销售区域",
    childrenName: "销售组",
    nodeKey: "id",
    valueKey: "id",
    childrenKey: "sub_list",
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

const router: any = useRouter()
const route: any = useRoute()
let roleList = ref([]);
let companyList = ref([]);
const formRef: any = ref(null);
let { model, rules } = userInfo;
let submitLoading = ref(false);

let id: any = 0;
let type: any = '';
let roleid: any = 0;

const goBack = () => {
    router.push({
        name: 'user',
    })
}

let submitCode = route.query.type == 'update' ? 'user:update' : 'user:save';

const submit = () => {
    submitLoading.value = true;
    formRef.value.validate((error) => {
        if (error) {
            window.$notification['error']({
                content: '错误提示',
                meta: '有未填项，请检查后填写',
                duration: 3000,
            })
            submitLoading.value = false;
        } else {
            if (type == 'update') {
                updateUserApi(model).then(res => {
                    window.$message.success('更新账户成功');
                    router.push('/user');
                }).catch(() => {
                    submitLoading.value = false;
                })
            } else {
                saveUserApi(model).then(res => {
                    window.$message.success('新增账户成功');
                    router.push('/user');
                }).catch(() => {
                    submitLoading.value = false;
                })
            }
        }
    })
}

const getRoleListData = () => {
    getRoleListApi().then(res => {
        roleList.value = res.data.map((item: any) => {
            return {
                label: item.name,
                value: item.id,
            };
        });
        roleList.value = roleList.value.reverse() //反转角色筛选数据
    })
}

/**
 * 获取公司列表
 */
const getCompanyList = () => {
    getRegionListApi({
        lev:2
    }).then(res => {
        companyList.value = res.data;
    })
}

const jumpRole = () => {
    router.push({
        name: 'addRole',
    })
}

const updateRegionType = (value: string | number | boolean) => {
    if (value == 1) {
        model.region_list = [];
    }
}

const init = async () => {
    id = route.query.id;
    type = route.query.type;
    roleid = route.query.roleid;
    if (type == 'update') {
        getDetail(id);
    }
    if (roleid != undefined && roleid != null) {
        model.role_id = Number(roleid);
    }

}

const getDetail = (id: number) => {
    getUserDetailsApi({ id }).then(({ data }) => {
        model = Object.assign(model, data)
        model.region_list = data.region_id_list;
        model.region_type = data.region_id_list.length ? 2 : 1;
    })
}

onMounted(() => {
    route.meta.bread[route.meta.bread.length - 1].label = route.query.type == 'update' ?
        '编辑账户' : '新建账户';
    getRoleListData();
    getCompanyList();
    init();
})

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

.content :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.content :deep(.n-form-item) {
    margin-left: 100px !important;
}

.content h5 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
    margin: 0 0 25px 0;
}

.select-role {
    width: 80%;
    display: inline-block;
    margin-right: 20px;
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
