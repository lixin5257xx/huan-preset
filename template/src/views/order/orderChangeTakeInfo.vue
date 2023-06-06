<template>
    <div class="order-content">
        <takeInfo :config="config" @goBack="goBack">
            <template #schedule>
                <importExeclEcho v-if="isInitEnd" :modelType="type" :old-schedule="config.oldDetail['schedule']"
                    :schedule="config.newDetail['schedule']" :new-file-url="config.newDetail['file_path']"
                    :old-file-url="config.oldDetail['file_path']" ref="importRef"></importExeclEcho>
            </template>
            <template #take-bg-icon>
                <n-icon size="160px" :depth="5" class="bg_icon">
                    <DocumentQueueAdd24Regular />
                </n-icon>
            </template>
           
        </takeInfo>
        <!-- <n-grid item-responsive :cols="24">
            <n-grid-item :offset="2" :span="18">
                <div class="sensitive-tips">
                    <n-alert class="sensitive-alert" title="本次修改涉及敏感内容，具体原因请看下方" type="default" :bordered="false">
                        <template #icon>
                            <n-icon color="#E02020">
                                <IosWarning />
                            </n-icon>
                        </template>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin
                        gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor.
                        Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum,
                        nulla luctus pharetra vulputate, felis tellus
                    </n-alert>
                </div>
                <n-form ref="formRef" :model="model" label-placement="left" require-mark-placement="right-hanging"
                    label-width="100px" v-if="isInitEnd">
                    <div class="block-item" v-for="block in blockList">
                        <h5 :id="block.id">{{ block.label }}</h5>
                        <template v-for="item in block.children">
                            <template v-if="item.id == 'schedule'">
                                <importExeclEcho :formRef="formRef" :modelType="type" :old-schedule="oldDetail[item.id]"
                                    :schedule="newDetail[item.id]" :new-file-url="newDetail['file_path']"
                                    :old-file-url="oldDetail['file_path']" ref="importRef"></importExeclEcho>
                            </template>
                            <n-form-item v-else :path="item.path" :id="item.id" :label="item.label">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <div class="sel-box">
                                            <template v-if="isEqual(newDetail[item.id], oldDetail[item.id])">
                                                <div class="take-not">
                                                    {{ showTitleRender(newDetail, item.id) }}
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div style="margin-top: 8px">
                                                    <div class="take-not new-data">
                                                        {{ showTitleRender(newDetail, item.id) }}
                                                    </div>
                                                    <div class="take-not old-data">
                                                        {{ showTitleRender(oldDetail, item.id) }}
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                        </template>
                    </div>
                    <div style="display: flex; justify-content: center;margin-bottom: 10px">
                        <n-button type="warning" @click="goBack">关闭</n-button>
                    </div>
                </n-form>
            </n-grid-item>
            <n-grid-item :span="3">
                <div class='anchor-box'>
                    <AnchorLink :list="anchorArrList" type="block" :top="88" affix :show-rail="showRail"></AnchorLink>
                </div>
            </n-grid-item>
        </n-grid>
        <n-icon size="200px" :depth="5" class="bg_icon">
            <DocumentQueueAdd24Regular />
        </n-icon> -->
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, onDeactivated, nextTick } from 'vue'
import {
    useRouter,
    useRoute,
    Router
} from 'vue-router'
import {
    useCancel,
} from './use/addOrUpdateOrder'
import { IosWarning } from '@vicons/ionicons4'
import { GetSubjectTaskInfoApi } from '@api'
import takeInfo from '@/components/take-info/index.vue'
import { projectType, transTypeList } from '../constant'
import Tooltip from '@/components/toolTip/index.vue'
import AnchorLink from '@/components/anchor-link/index.vue'
import { startOfDay, add, set, format } from 'date-fns/esm'
import importExeclEcho from './components/importExeclEcho.vue'
import { DocumentQueueAdd24Regular } from '@vicons/fluent'
import dayjs from 'dayjs'
import { isEqual } from 'lodash'

const isInitEnd = ref(false);

const model = reactive({
    id: null,
    name: '',
    subject_id: null,
    type: null,
    play_type: null,
    brand: null,
    product_name: null,
    ad_space: [],
    kpi_msg: '',
    remarks: '',
    coo_time: [dayjs().valueOf(), dayjs().add(1, 'day').valueOf()],
    materials_ids: null,
    file: null,
    status: null,
    kpi_type: null,
    push_time_start: '',
    push_time_end: '',
    showUploadTable: false,
    file_upload_flag: false,
    out_time1_day_flag: false,
    click_state: false,
})
const blockList = ref([
    {
        label: "所属项目", id: 'orderProject', children: [
            { path: "subject_name", id: "subject_name", label: "项目名称" },
            { path: "advertiser_name", id: "advertiser_name", label: "广告主" },
            { path: "advertiser_name", id: "advertiser_name", label: "产品线" },
            { path: "advertiser_industry", id: "advertiser_industry", label: "行业" },
        ]
    },
    {
        label: "基本信息", id: 'orderBase', children: [
            {
                path: "type_name", label: "投放模式", id: "type_name"
            },
            {
                label: "交易类型", path: "play_type_name", id: "play_type_name"
            },
            {
                label: "媒体", path: "brand_name", id: "brand_name"
            },
            {
                label: "产品名称", path: "product_name", id: "product_name"
            },
            {
                label: "广告位", path: "ad_space", id: "ad_space"
            },
            {
                label: "策略", path: "kpi_type_name", id: "kpi_type_name"
            },
            {
                label: "备注", path: "remarks_text", id: "remarks_text"
            },
        ]
    },
    {
        label: "排期与监测", id: 'orderScheduling', children: [
            {
                id: 'schedule',
                noFormItem: true
            },
            {
                label: "订单周期", path: "coo_time", id: "coo_time"
            },
        ]
    },
    {
        label: "订单名称", id: 'orderName', children: [
            { label: "订单名称", path: "name", id: "name" },
            { label: "订单状态", path: "status_name", id: "status_name" }
        ]
    },
])

const config = reactive({
    takeTipsProps: {
        content: '123',//原因
    },
    formProps: {
        model,
        labelWidth:'210px'
    },
    blockList: [],
    newDetail: {},
    oldDetail: {},
    anchorLinkProps: {},
})
const type = ref()
const router: Router = useRouter()
const route: any = useRoute()
const importRef = ref(null)


const goBack = () => {
    router.push({
        name: 'orderTake',
    })
}

const showTitleRender = (data, id) => {
    if (data) {
        if (data[id] instanceof Array) {
            return data[id].join('、')
        }
        return data[id];
    }
    return ''
}

const anchorArrList = ref([
    {
        name: '所属项目',
        children: [
            {
                selector: '#orderProject',
                name: '项目名称',
                active: true
            }
        ],
    },
    {
        name: '订单',
        children: [
            {
                selector: '#orderBase',
                name: '基本信息',
            },
            {
                selector: '#orderScheduling',
                name: '排期与监测',
            },
            {
                selector: '#orderName',
                name: '订单名称',
            },
        ],
    },
])
const showRail = ref(true)

const getDetail = (id) => {
    let option = {
        id,
        type: 'order',
    }
    GetSubjectTaskInfoApi(option).then(res => {
        if (res.code == 200) {
            config.newDetail = res.data.new_detail;
            config.newDetail['coo_time'] = `${config.newDetail.push_time_start} 至 ${config.newDetail.push_time_end}`
            config.oldDetail = res.data.old_detail;
            config.oldDetail['coo_time'] = `${config.oldDetail.push_time_start} 至 ${config.oldDetail.push_time_end}`
            isInitEnd.value = true;
            if (config.newDetail['type_name'] && config.newDetail['type_name'] == '直投') {
                blockList.value[1].children.splice(1, 1);
            }
        }
    })
}
onMounted(() => {
    if (route.query.id) {
        getDetail(route.query.id);
    }
    route.meta.bread[route.meta.bread.length - 1].label = `改单详情:${route.query.time}`
    route.meta.bread[1].label = `${route.query.name}`
    type.value = 'take'
    config.blockList = blockList.value
})

onDeactivated(() => {
    window.$notification.destroyAll()
})
</script>