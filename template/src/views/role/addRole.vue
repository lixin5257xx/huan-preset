<template>
    <div class="content">
        <n-grid item-responsive :cols="24">
            <n-grid-item :offset="2" :span="18" style="background: #fff; padding: 25px; border-radius: 8px">
                <n-form ref="formRef" :model="model" :rules="rules" label-placement="left"
                    require-mark-placement="right-hanging" label-width="100px">
                    <h5><span v-if='route.query.type == "update"'>编辑角色</span><span v-else>新建角色</span></h5>
                    <!-- 展示场景 -->
                    <n-form-item label="角色名称" path="name">
                        <n-grid :cols="24">
                            <n-gi :span="24">
                                <n-input style="width: 450px" v-emoji v-model:value="model.name" clearable
                                    placeholder="请输入角色名称" maxlength="20" />
                            </n-gi>
                        </n-grid>
                    </n-form-item>

                    <n-form-item label="权限" path="menu_id_list">
                        <n-grid :cols="24">
                            <n-gi :span="24">
                                <RoleList v-if="menuIdList.length > 0" :data="menuIdList" v-model="model.menu_id_list"
                                    placeholder="请输入权限名称" :cascaderOption="cascaderOption"></RoleList>
                            </n-gi>
                        </n-grid>
                    </n-form-item>

                    <n-form-item label="描述" path="des" style="margin-bottom: 16px">
                        <n-grid :cols="24">
                            <n-gi :span="24">
                                <n-input style="width: 450px" v-model:value="model.des" placeholder="请输入描述" type="textarea"
                                    v-emoji maxlength="100" :autosize="{
                                        minRows: 3,
                                    }" />
                            </n-gi>
                        </n-grid>
                    </n-form-item>


                </n-form>
            </n-grid-item>
            <n-grid-item :offset="2" :span="18" style="margin-top: 20px;">
                <!-- 操作按钮 -->
                <div style="display: flex; justify-content: center">
                    <n-button :loading="submitLoading" :text="true" class="btn-txt" @click="goBack">取消</n-button>
                    <n-button :loading="submitLoading" type="warning" v-permissions="submitCode" style="margin-left: 10px"
                        @click.prevent="submit" v-preventReClick :disabled="false">
                        保存并关闭</n-button>
                </div>
            </n-grid-item>
        </n-grid>
        <n-icon size="140px" :depth="5" class="bg_icon">
            <RibbonAdd20Regular />
        </n-icon>
    </div>
</template>
<script setup lang="ts">
import { onMounted, onBeforeMount, ref, reactive } from "vue";
import { RibbonAdd20Regular } from '@vicons/fluent'
import {
    getMenuIdListApi,
    getRoleDetailsApi,
    saveRolesApi,
    updateRolesApi
} from "@/config/api";
import { useRouter, useRoute } from "vue-router";
import roleInfo from "./use/role";
import RoleList from '@/components/cascader-three/index.vue'

// 级联选择
const cascaderOption = reactive({
    parentName: "角色权限",
    childrenName: "",
    nodeKey: "id",
    valueKey: "id",
    childrenKey: "sub_list", //查询子列表字段
    childrenParentIdKey: "parent_id",
    childrenIdKey: "id",
    childrenLabel: "name",
    parentIdKey: "id",
    parentLabel: "name",
    label: "name",
    banCheckedParent: false,
    showTag: false,
    merge: false,
    search: false,
    disabled: false,
    threeName: "",
    code: "perms"
})

const router: any = useRouter();
const route: any = useRoute();
let { childrenParentIdKey, childrenKey, nodeKey, code } = cascaderOption
let menuIdList = ref([]);

const menu_id_list = ref([]) // 已选中的权限
const flatList = ref([]) // 选择权限code列表
const selectCitiesList = ref([]) //已选菜单权限列表
const formRef: any = ref(null);
let { model, rules } = roleInfo;
let submitLoading = ref(false);

let id: any = 0;
let submitCode: any = route.query.type == "update" ? "role:update" : "role:save";

const goBack = () => {
    router.push({
        name: "role",
    });
};

onMounted(async () => {
    route.meta.bread[route.meta.bread.length - 1].label =
        route.query.type == "update" ? "编辑角色" : "新建角色";
    let id = route.query.id;
    if (route.query.type == "update") {
        await getDetail(id);
    } else {
        getMenuIdList()
    }
});
// 树形化角色列表
const updateFlatList = (menuIdList: any[]) => {
    menuIdList.forEach((item: any) => {
        if (!item[childrenKey]) {
            flatList.value.push(item)
            return
        }
        updateFlatList(item[childrenKey])
    })
}
/**
 * 获取用户权限列表
 */
const getMenuIdList = () => {
    getMenuIdListApi().then((res) => {
        menuIdList.value = res.data;
        updateFlatList(menuIdList.value)
    });
}

//提交 
const submit = () => {
    submitLoading.value = true;
    formRef.value.validate((error: any) => {
        if (error) {
            window.$notification['error']({
                content: '错误提示',
                meta: '有未填项，请检查后填写',
                duration: 3000,
            })
            submitLoading.value = false;
        } else {
            if (route.query.type == "update") {
                updateRolesApi(model).then((res) => {
                    window.$message.success("更新角色成功");
                    router.push("/role");
                }).catch(() => {
                    submitLoading.value = false;
                });
            } else {
                saveRolesApi(model).then((res) => {
                    window.$message.success("新增角色成功");
                    router.push("/role");
                }).catch(() => {
                    submitLoading.value = false;
                });
            }
        }
    });
};

// 获取角色详情数据
const getDetail = (id: number) => {
    getRoleDetailsApi({ id }).then(({ data }) => {
        model = Object.assign(model, data);
    }).then(() => {
        getMenuIdList()
    });
};
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

