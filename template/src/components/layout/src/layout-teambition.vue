<!--TB布局-->
<template>
    <div class="layout-teambition">
        <n-config-provider class="layout-config-provider-box" :locale="zhCN" :date-locale="dateZhCN">
            <div class="layout-navigation">
                <div class="logo">
                    <img src="../../../assets/images/logo.png" />
                </div>
                <div class="menu-box">
                    <n-menu v-model:value="menuAction" :options="menuOption" :indent="24"
                        :default-expanded-keys="['projectsAndScree', 'system']" @update:value="menuUpdate" />
                </div>
                <div class="user-box">
                    <n-icon size="22" color="#fd8e31">
                        <User />
                    </n-icon>
                    <div class="user-info">
                        <div>
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <p class="user-name">{{ userInfo.name }}</p>
                                </template>
                                {{ userInfo.name }}
                            </n-tooltip>
                            <p class="user-id">ID：{{ userInfo.id }}</p>
                        </div>
                    </div>
                    <n-button class="special-btn" size="medium" @click="loginOut" text>
                        <template #icon>
                            <a title="退出">
                                <n-icon size="20" color="#c5c5c5">
                                    <ExitOutline />
                                </n-icon>
                            </a>
                        </template>
                    </n-button>
                </div>
            </div>
            <div class="layout-main">
                <div class="layout-inherit-flex-box">
                    <div class="layout-header">
                        <div class="bread-crumb">
                            <n-breadcrumb separator=">">
                                <n-breadcrumb-item v-for="item in bread" @click="breadJumpPage(item)">{{ item.label
                                }}</n-breadcrumb-item>
                            </n-breadcrumb>
                        </div>
                        <div class="bread-back" @click="toBack" v-if="isBack">返回</div>
                    </div>
                </div>
                <div class="layout-content">
                    <router-view />
                </div>
            </div>
        </n-config-provider>
    </div>
</template>

<script setup lang="ts">
import { ExitOutline } from '@vicons/ionicons5'
import { User } from '@vicons/fa'
import { useMenuOption } from '../config/layout.config';
import useStore from "@/config/pinia";
import { ref, watch, onMounted, reactive, nextTick } from 'vue';
import { useRouter } from "vue-router";
import { zhCN, dateZhCN } from 'naive-ui'

const menuOption = useMenuOption();
const router = useRouter();

// 面包屑携带返回按钮
let isBack: any = ref(false)
let bread: any = ref([]);
let routerMenu: any = ref('');//用于当前路由复选菜单栏赋值
let menuAction = ref('');
let backName: any = ref(''); //返回页面的url
let backContent: any = reactive({
    name: null,
    queryParams: null
})
const store = useStore();
const userInfo = store.getUserInfo;

/**
 * 菜单选中改变 跳转页面
 * @param key
 * @param item
 */
const menuUpdate = (key: string) => {
    router.push({
        name: key
    })
}

/**
 * 点击面包屑跳转页面
 */
const breadJumpPage = (item) => {
    console.log('item', item)
    if (!item.hasOwnProperty('name') || !item.name) return;
    router.push({
        name: item.name,
        query: item.queryParams
    })
}

/**
 * 同步菜单，面包屑状态
 */
const syncStatus = () => {
    const { meta } = router.currentRoute.value
    nextTick(() => {
        bread.value = meta.bread;
    })
    routerMenu.value = meta.menu;
    if (meta.menu) {
        menuAction.value = routerMenu.value;
    }
    isBack.value = meta.back || false
    backName.value = meta.backName || ''
}

// 返回上一页
const toBack = () => {
   if (backName.value) {
        router.push({
            name: backName.value
        })
    } else {
        router.go(-1)
    }
}

//退出
const loginOut = () => {
    store.loginOut();
    router.push('/login');
}

watch(
    () => router.currentRoute.value,
    () => {
        syncStatus()
    }
)

onMounted(() => {
    syncStatus();
})
</script>

<style scoped>
.layout-config-provider-box {
    width: 100vw;
    display: flex;
    font-family: PingFangSC-Regular, PingFang SC;
}

.layout-inherit-flex-box {
    display: flex;
}

.layout-teambition {
    display: flex;
}

.layout-navigation {
    width: 200px;
    box-shadow: 0 0px 5px 1px rgb(57 66 60 / 20%);
    height: 100vh;
    margin-right: 2px;
    display: flex;
    flex-direction: column;
}

.layout-main {
    flex: 1;
    flex-direction: column;
    overflow: auto;
}

.layout-header {
    flex: 1;
    height: 60px;
    line-height: 60px;
    margin-bottom: 1px;
    box-shadow: 0 0px 5px 1px rgb(57 66 60 / 20%);
    display: inline-flex;
    background: #fff;
    justify-content: space-between;
    align-items: center;
}

.layout-content {
    height: calc(100vh - 70px);
    overflow: auto;
}

.layout-content>div {
    padding: 0px 20px;
    background: var(--theme-bg-color);
}

.logo {
    line-height: 60px;
    display: block;
    text-align: center;
    font-weight: 600;
    margin-left: -6px;
}

.logo img {
    width: 70%;
}

.menu-box {
    flex: 1;
}

.user-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 18px 18px;
    font-size: 12px;
}

.user-info {
    display: flex;
    flex-direction: column;
    width: 104px;
    padding: 0px 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-name {
    font-size: 14px;
}

.user-id {
    font-size: 12px;
    color: #CCCCCC;
}

.user-info p {
    line-height: 18px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.bread-crumb {
    margin-left: 20px;
}

.bread-back {
    margin-right: 30px;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    cursor: pointer;
}

.bread-back:hover {
    color: var(--theme-color);
}

.layout-main {
    background: #fafafa;
}
</style>