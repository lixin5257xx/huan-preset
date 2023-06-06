<template>
    <div class="project">
        <wTable :config="config" ref="wtable" @filterClickOK="filterClickOK" @filterClickCancel="filterClickCancel"
            @searchTagChange="searchTagChange" @searchClearClick="searchClearClick" @searchTagClose="searchTagClose"
            @searchInputChange="searchInputChange" @searchInputEnter="searchInputEnter" @addClick="handleAddProject"
            @initEnd="initEnd">
        </wTable>
        <bulkOperations v-model="config.tableOption.checkedRowKeys" :options="blukModuleOption"
            @deleteClickOk="deleteClickOk" />
        <!-- 素材预览 -->
        <n-modal v-model:show="isPreview" :auto-focus="false" preset="card" style="width: 812px"
            class="Previews project-preview">
            <template #header>
                <n-tooltip placement="bottom" trigger="hover">
                    <template #trigger>
                        {{ perviewActive.modalTitle }}
                    </template>
                    <span> {{ perviewActive.modalTitle }} </span>
                </n-tooltip>
            </template>
            <div class="preview-title">
                <div class="preview-title-ul">
                    <div class="cont" v-if="perviewActive.pathParams.time_long">时长:{{ perviewActive.pathParams.time_long
                    }}</div>
                    <div class="cont" v-if="perviewActive.pathParams.dow_page_url">落地页:<span class="color-blue"
                            @click.prevent="handelCopy(perviewActive.pathParams.dow_page_url)">复制</span></div>
                    <div class="cont">素材地址:<span class="color-blue"
                            @click.prevent="handelCopy(perviewActive.pathParams.path)">复制</span></div>
                </div>
                <span class="preview-title-span">{{ perviewActive.currentIndex + 1 }}/{{
                    materialsList.length
                }}</span>
            </div>
            <div class="perview-box">
                <div class="perview-show">
                    <video class="perview-materials" controls v-if="perviewActive.active?.type == 1"
                        :src="perviewActive.active?.path" />
                    <img v-else class="perview-materials" :src="perviewActive.active.path" />
                </div>
                <div class="perview-list">
                    <ul class="perview-list-ul">
                        <li v-for="(item, index) in materialsList" :class="perviewActive.currentIndex == index
                            ? 'active-item'
                            : 'unactive-item'
                            ">
                            <img @click="perviewActiveClick(item, index)" class="perview-img" :src="item.thumbnail_path" />
                        </li>
                    </ul>
                </div>
            </div>
        </n-modal>
        <!-- 预览 -->
        <n-modal v-model:show="previewStatus" :auto-focus="false" preset="card" class="updateStatus previews">
            <n-card :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-tabs type="line">
                    <n-tab-pane name="project" tab="项目信息">
                        <n-form :show-feedback="false" class="examine-box" :model="crm_status_model.crm_status_modelRef"
                            label-placement="left" label-width="100px">
                            <n-grid :cols="24" :x-gap="24">
                                <n-form-item-gi :span="24">
                                    <h2 class="alert-title">项目概览</h2>
                                </n-form-item-gi>
                                <n-form-item-gi :span="12" v-for="item in previewList" :key="item.value">
                                    <template v-if="item.value == 'settle_kpi_html'">
                                        <div class="cell-item">
                                            <div class="info-item-div">
                                                <p class="info-label">{{ item.title }}：</p>
                                                <p class="info-value"
                                                    v-html="crm_status_model.crm_status_modelRef[item.value]"></p>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="cell-item" v-else>
                                        <div class="info-item-div">
                                            <p class="info-label">{{ item.title }}：</p>
                                            <p class="info-value">
                                                {{ crm_status_model.crm_status_modelRef[item.value] }}
                                            </p>
                                        </div>
                                    </div>
                                </n-form-item-gi>
                                <template v-if="getPower('subject:voucherInfo')">
                                    <n-form-item-gi :span="24">
                                        <h2 class="alert-title">凭证信息</h2>
                                    </n-form-item-gi>
                                    <n-form-item-gi :span="24" label="合同：">
                                        {{ crm_status_model.crm_status_modelRef.contract_name }}
                                    </n-form-item-gi>
                                    <n-form-item-gi :span="12" label="下单公司：">
                                        {{ crm_status_model.crm_status_modelRef.company_name }}
                                    </n-form-item-gi>
                                    <n-form-item-gi :span="12" label="公司主体：">
                                        {{ crm_status_model.crm_status_modelRef.company_body_name }}
                                    </n-form-item-gi>
                                    <n-form-item-gi :span="24">
                                        <div class="cell-item">
                                            <div class="info-item-div">
                                                <p class="info-label">邮件截图：</p>
                                                <p class="info-value" style="display: inline-flex;align-items: flex-start">
                                                    <n-image-group>
                                                        <n-image
                                                            v-for="item in crm_status_model.crm_status_modelRef.email_image"
                                                            width="80" :src="item" />
                                                    </n-image-group>
                                                </p>
                                            </div>
                                        </div>
                                    </n-form-item-gi>
                                </template>
                                <template v-if="getPower('subject:overviewOrderInfo')">
                                    <n-form-item-gi :span="24">
                                        <h2 class="alert-title">订单内容</h2>
                                    </n-form-item-gi>
                                    <n-form-item-gi :span="24">
                                        <n-data-table :columns="mediumPreviewOrderCol" :data="mediumPreview.order_list"
                                            :bordered="false" default-expand-all />
                                    </n-form-item-gi>
                                </template>
                            </n-grid>
                        </n-form>
                    </n-tab-pane>
                    <n-tab-pane v-if="getPower('subject:voucherInfo')" class="boss-box" name="boss" tab="BOS送审详情">
                        <n-data-table :bordered="false" class="table-head-gray" :columns="bosIntroTemplateColumns"
                            :max-height="400" :data="bos_status_model.bos_status_modelRef.project_overview" />
                    </n-tab-pane>
                </n-tabs>
            </n-card>
        </n-modal>
        <!-- boss送审详情 -->
        <bossExamineComponent v-model:show="examineStatus" v-model:project_status_model="project_status_model"
            @getProjectData="GetProjectData"></bossExamineComponent>
    </div>
</template>

<script setup lang="ts">
import {
    reactive,
    ref,
    shallowRef,
    h,
    onMounted,
    RendererElement,
    RendererNode,
    VNode,
    Ref,
    watchEffect,
} from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { showStyleMap } from '../constant/screen'
import { handelCopy } from '@/utils/index'
// 引用筛选项默认值
import {
    projectType, //投放模式
    projectStatus, //状态
    customerTypeOption,//客户类型
} from '../constant/project'
import { cloneDeep } from 'lodash'
import {
    GetSubjectPageApi,
    GetRegionIdListApi,
    // GetOrderCompanyListApi,
    GetvoucherInfoApi,
    GetBossPushLogInfoApi,
    GetOvervieworderInfoApi,
    GetAdvertiserListApi,
    GetProjectInfoApi,
    DeleteProjectApi,
    GetUsersListApi,
    GetEmployeeListApi,
    GetBossCheckInfoApi,
    GetContractListApi,
    GetSubjectMaterialsApi,
    GetCompanyBodyNameListApi,
    GetCompanyNameListApi
} from '@api'
import porjectInfo from './use/project' //引用参数
import { btnListToMoreList } from '@utils'
import wTable from '@/components/table/index.vue'
import bulkOperations from '@/components/bulk-operations/index.vue'
import dayjs from 'dayjs'
import useStore from '@/config/pinia'
import { format } from 'date-fns/esm'

import { Eye } from '@vicons/tabler'
import { ContentPasteSearchRound } from '@vicons/material'
import {
    DataUsageEdit24Regular,
    AppsAddIn24Regular,
    History20Filled
} from '@vicons/fluent'
import { AuditOutlined } from '@vicons/antd'
import projectStatusComponent from './components/projectStatusComponent.vue'
import projectBossStatusComponent from './components/projectBossStatusComponent.vue'
import bossExamineComponent from './components/bossExamineComponent.vue'
import s2Table from "./components/s2Table.vue";
const route = useRoute()
const router = useRouter()
const formRef: any = ref(null) //同步ref
const servicesStatusFormRef: any = ref(null) //营销配置表单ref
let wtable: Ref<any> = ref(null) //table ref
const { getPower, project, $patch, CustomAdd } = useStore()
let { update_status_model, services_status_model, crm_status_model, mediumPreview, mediumPreviewOrderCol, project_status_model, bos_status_model, childTemplateColumns } = porjectInfo
let active = ref(false)
let isPreview = ref(false) //底部弹窗状态
let updateStatus = ref(false) //通过驳回状态弹窗
let previewStatus = ref(false) //预览弹框状态
let examineStatus = ref(false) //项目信息审核
let materialsList: Ref<any> = ref([])
let salesmanList = ref([]) //下单销售
let perviewActive: any = reactive({
    //预览数据
    pathParams: {
        time_long: 0,
        path: '',
        dow_page_url: ''
    },
    currentIndex: 0,
    active: <any>{},
    modalTitle: '', //预览名称
    path: '', // 预览视频地址
    thumbnail_path: '', //预览图片地址
    time_long: '', //预览视频时长
    coo_start_time: '', //预览投放开始时间
    coo_end_time: '', //预览投放结束时间
    brands: [], //预览品牌
})
let dataCfg: Ref<any> = ref({

})
let previewList = ref([
    {
        title: '项目ID',
        value: 'subject_id'
    },
    {
        title: '项目名称',
        value: 'subject_name'
    },
    {
        title: '项目周期',
        value: 'subject_period'
    },
    {
        title: '下单日期',
        value: 'push_time',
    },
    {
        title: '投放量级',
        value: 'put_level',
    },
    {
        title: '预估总量',
        value: 'forecast_all_count',
    },
    {
        title: '投放金额',
        value: 'put_price_all',
    },
    {
        title: '预估收入',
        value: 'forecast_income',
    },
    {
        title: '考核KPI',
        value: 'settle_kpi_html',
    },
    {
        title: '录屏要求',
        value: 'video_require',
    },
    {
        title: '投放单价',
        value: 'put_price_unit',
    },
    {
        title: '对公返点',
        value: 'return_point_msg',
    },
])

//每次进入页面初始化一下
$patch({
    project: {
        isOperate: true,
    },
})

/**
 * 字段名 ok，表格显示用
 */
function createCols() {
    return [
        {
            type: 'selection',
            fixed: 'left',
            minWidth: 50,
            align: 'center',
            customStatus: 'left',
        },
        {
            expandable: false,
            title: '项目名称',
            key: 'name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 250,
            width: 250,
            render: (row: any) => {
                return h(
                    'a',
                    {
                        class: 'jump_name',
                        onClick: () => {
                            let openPage = router.resolve({
                                name: 'order',
                                query: {
                                    subjectId: row.id,
                                },
                            })
                            window.open(openPage.href, '_blank')
                        },
                    },
                    {
                        default: () => row.name,
                    }
                )
            },
            customStatus: 'left',
        },
        {
            title: '项目ID',
            key: 'id',
            ellipsis: true,
            minWidth: 100,
            width: 100,
            align: 'left',
            customStatus: 'left',
        },
        {
            title: '投放模式',
            key: 'type',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 150,
            width: 150,
            custom: true,
            render: (row: any) => {
                let typeList = row.type.split(',')
                return typeList.map((item, index) => {
                    return h(
                        'div',
                        {
                            style: index > 0 ? { marginLeft: '10px' } : {},
                            class: item == '直投' ? 'delivery-box' : 'prog-box',
                        },
                        {
                            default: () => item,
                        }
                    )
                })
            },
        },
        {
            title: '广告主',
            key: 'advertiser_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 150,
            width: 150,
            custom: true,
        },
        {
            title: '投放周期',
            key: 'coo_time_between',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: true,
        },
        {
            title: '项目状态',
            key: 'status',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 120,
            width: 120,
            custom: false,
            render: (row: any) => {
                return h(
                    projectStatusComponent,
                    {
                        row: row
                    }
                )
            }
        },
        {
            title: 'BOS送审状态',
            key: 'boss_status',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 120,
            width: 120,
            custom: false,
            render: (row: any) => {
                return h(
                    projectBossStatusComponent,
                    {
                        row: row
                    }
                )

            }
        },
        {
            title: '操作人',
            key: 'use_user_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 100,
            width: 100,
            custom: true,
        },
        {
            title: '审核人',
            key: 'check_user_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 100,
            width: 100,
            custom: true,
        },
        {
            title: '下单来源',
            key: 'region_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 10,
            width: 100,
            custom: false,
        },
        {
            title: '下单公司',
            key: 'company_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 250,
            width: 250,
            custom: false,
        },
        /*  {
              title: '所属行业',
              key: 'advertiser_industry',
              ellipsis: {
                  tooltip: true,
              },
              minWidth: 100,
              width: 100,
              custom: false,
          },*/
        {
            title: '下单日期',
            key: 'push_time',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 150,
            width: 150,
            custom: false,
        },
        {
            title: '监测公司',
            key: 'supervise_company_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: false,
        },
        {
            title: '结算依据',
            key: 'settle_standard_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: false,
        },
        {
            title: '投放素材',
            key: 'materials_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: false,
        },
        {
            title: '投放量级',
            key: 'put_level',
            ellipsis: {
                tooltip: {
                    width: 'trigger',
                    contentStyle: 'max-height:200px;',
                    scrollable: true,
                },
            },
            minWidth: 220,
            width: 220,
            custom: true,
        },
        {
            title: '投放单价',
            key: 'put_price_unit',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: false,
        },
        {
            title: '投放金额',
            key: 'put_price_all',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: false,
        },
        {
            title: '对公返点',
            key: 'return_point_msg',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: false,
        },
        {
            title: '考核KPI',
            key: 'settle_kpi_text',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: false,
        },
        {
            title: '录屏要求',
            key: 'video_require',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 220,
            width: 220,
            custom: false,
        },
        {
            title: '合同',
            key: 'contract_name',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 150,
            width: 150,
            custom: false,
        },
        {
            title: '公司主体',
            key: 'corporate_body',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 150,
            width: 150,
            custom: false,
        },
        {
            title: '客户类型',
            key: 'customer_type',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 100,
            width: 100,
            custom: false,
        },
        {
            title: '下单销售',
            key: 'sales',
            ellipsis: {
                tooltip: true,
            },
            minWidth: 100,
            width: 100,
            custom: false,
        },
        {
            title: '操作',
            key: 'project',
            fixed: 'right',
            align: 'left',
            customStatus: 'right',
            render: (row: any) => {
                let moduleMap: any[] = [
                    {
                        name: 'update',
                        label: '编辑',
                        component: DataUsageEdit24Regular,
                        isFather: true,
                        isChild: false,
                        code: ['subject:update', 'subject:info'],
                    },
                    {
                        name: 'bossPreview',
                        label: '详情',
                        component: ContentPasteSearchRound,
                        isFather: row.status != 10, //调整中
                    },
                    {
                        name: 'preview',
                        label: '素材预览',
                        component: Eye,
                        isFather: true,
                        isChild: true,
                        code: 'subject:materials',
                    },
                    {
                        name: 'bossExamine',
                        label: 'BOS送审',
                        component: AuditOutlined,
                        isFather: true,
                        code: 'subject:salesAudit',
                    },
                    {
                        name: 'changeTake',
                        label: '修改记录',
                        component: History20Filled,
                        isFather: true,
                        isChild: false,
                        code: ['subject:updateLog'],
                    },
                    {
                        name: 'services',
                        label: '营销服务',
                        component: AppsAddIn24Regular,
                        isFather: true,
                        isChild: true,
                        code: 'subject:sell',
                    },
                ]
                // (10: 调整中，11:待审核;20: 审核通过，21: 审核不通过，30: 已结束
                // 状态为 待执行、投放中、已暂停、已完成时，按钮【修改纪录、编辑、数据、同步CRM、营销服务、素材、删除】可见
                // 状态为 不通过时，按钮【修改纪录、编辑、数据、营销服务、素材、删除】可见
                if (![11].includes(row.status)) {
                    moduleMap = moduleMap.filter((item) => {
                        return !['bossExamine'].includes(item.name)
                    })
                }
                if (!row.update_log_flag) {
                    moduleMap = moduleMap.filter((item) => {
                        return !['changeTake'].includes(item.name)
                    })
                }

                let resultList: VNode<
                    RendererNode,
                    RendererElement,
                    { [key: string]: any }
                >[] = []
                let filterModelList = [];
                moduleMap.forEach((item) => {
                    if (item.code == undefined || getPower(item.code)) {
                        filterModelList.push(item);
                        resultList.push(
                            h(
                                NButton,
                                {
                                    text: true,
                                    tag: 'a',
                                    title: item.label,
                                    style: {
                                        fontSize: '18px',
                                        marginRight: '18px',
                                        verticalAlign: 'middle',
                                    },
                                    onClick: () => btnClick(item, row)
                                },
                                {
                                    default: () =>
                                        h(
                                            NIcon,
                                            {},
                                            {
                                                default: () => h(item.component),
                                            }
                                        ),
                                }
                            )
                        )
                    }
                })
                if (resultList.length == 0) {
                    $patch({
                        project: {
                            isOperate: false,
                        },
                    })
                }
                return btnListToMoreList(resultList, filterModelList, btnClick, row)
            },
            minWidth: 180,
            width: 180,
        }
    ]
}

const btnClick = ((item, row) => {
    switch (item.name) {
        // 改单记录
        case 'changeTake': {
            let routeUrl = router.resolve({
                name: 'projectChangeTake',
                query: {
                    id: row.id,
                    name: row.name,
                    type: 'update',
                },
            })
            window.open(routeUrl.href, '_blank')
            break
        }
        // 编辑
        case 'update': {
            let routeUrl = router.resolve({
                name: 'addProject',
                query: {
                    id: row.id,
                    type: 'update',
                },
            })
            window.open(routeUrl.href, '_blank')
            break
        }
        // 营销服务配置
        case 'services': {
            handleServicesStatus(row)
            break
        }
        // 预览素材
        case 'preview': {
            getPerviewData(row.id)
            break
        }
        // 预览bos服务配置
        case 'bossPreview': {
            let parmas = {
                subject_id: row.id,
            }
            handleGetPreviewData(parmas)
            break
        }
        // 送审bos服务配置
        case 'bossExamine': {
            let parmas = {
                id: row.id,
            }
            handleGetBosData(parmas)
            break
        }
    }
})

// boss弹窗详情
let bosIntroTemplateColumns: any = ref([
    {
        type: 'expand',
        key: 'submission',
        width: 40,
        fixed: 'left',
        expandable: () => true,
        renderExpand: (row, index) => {
            console.log(row.check_time.length);
            let height = row.check_time.length * 40 > 250 ? 250 : row.check_time.length == 1 ? 70 : row.check_time.length * 40;
            const colsValues = ['price', 'estimate_income', 'cpm', 'discount_price', 'discount_estimate_income', 'return_point_price', 'policy_return_point_price',
                'status', 'msg',]
            const colsBackground = colsValues.map(item => {
                if (item == 'status') return {}
                return {
                    field: item,
                    mapping(fieldValue, data) {
                        if (data.id == 819) {
                            return {
                                fill: '#f00'
                            }
                        }

                    }
                }
            })
            return h(s2Table, {
                dataCfg: {
                    fields: {
                        rows: ['time', 'id',],
                        values: colsValues,
                    },
                    meta: [
                        {
                            field: 'time',
                            name: '排期',
                        },
                        {
                            field: 'cpm',
                            name: '投放量(CPM)',
                        },
                        {
                            field: 'price',
                            name: '折前单价(元)',
                        },
                        {
                            field: 'estimate_income',
                            name: '折前预估收入(元)',
                        },
                        {
                            field: 'discount_price',
                            name: '折后单价(元)',
                        },
                        {
                            field: 'discount_estimate_income',
                            name: '折后预估收入(元)',
                        },
                        {
                            field: 'return_point_price',
                            name: '项目返点金额',
                        },
                        {
                            field: 'policy_return_point_price',
                            name: '框架返点金额(元)',
                        },
                        {
                            field: 'status',
                            name: '收入送审状态',
                        },
                        {
                            field: 'msg',
                            name: '收入送审信息',
                        },
                    ],
                    data: row.check_time
                },
                options: {
                    width: 1490,
                    height: height,
                    showDefaultHeaderActionIcon: false,//是否展示行操作
                    interaction: {
                        enableCopy: true,
                        hiddenColumnFields: ['id']
                    },
                    tooltip: {
                        showTooltip: false,
                    },
                    conditions: {
                        text: colsBackground
                    }
                },
                themeCfg: {
                    name: 'gray',
                    theme: {
                        splitLine: {
                            verticalBorderWidth: 1
                        },
                        cornerCell: {
                            bolderText: {
                                fontWeight: 400
                            },
                            measureText: {
                                fontWeight: 400
                            },
                            text: {
                                fontWeight: 400
                            },
                        },
                        rowCell: {
                            bolderText: {
                                fontWeight: 400
                            },
                            measureText: {
                                fontWeight: 400
                            },
                            text: {
                                fontWeight: 400
                            },
                        },
                    },

                }
            })
        },
    },
    {
        title: '产品名称',
        key: 'product_name',
        width: 120,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '广告位',
        key: 'ad_space',
        width: 200,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '投放量(CPM)',
        key: 'cpm',
        width: 120,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '折前单价(元)',
        key: 'price',
        width: 120,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '折前预估收入(元)',
        key: 'estimate_income',
        width: 140,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '折后单价(元)',
        key: 'discount_price',
        width: 120,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '折后预估收入(元)',
        key: 'discount_estimate_income',
        width: 140,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '项目返点方式',
        key: 'return_point_type',
        width: 130,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '项目返点(元)',
        key: 'return_point_price',
        width: 130,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '框架返点方式',
        key: 'policy_return_point_type',
        width: 130,
        ellipsis: {
            tooltip: true,
        },
    },
    {
        title: '框架返点(元)',
        key: 'policy_return_point_price',
        width: 130,
        ellipsis: {
            tooltip: true,
        },
    },
])

const columns = ref(createCols())
const pagination = reactive({
    page: 1,
    pageSize: 10,
    showQuickJumper: true,
    pageSizes: [10, 20, 30, 40, 50, 100],
    showSizePicker: true,
    itemCount: 0,
    onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        CustomAdd({ info: { pageSize }, key: 'project' })
        resetPaginationPage()
        GetProjectData()
    },
    onUpdatePage: (page: number) => {
        pagination.page = page
        GetProjectData()
    },
})
const config: any = reactive({
    pageId: 'project',
    tableOption: {
        data: [],
        columns,
        singleColumn: false,
        pagination: pagination,
        checkedRowKeys: [],
        bordered: false,
        size: 'small',
        isAffixSeach: true,
        isAffixTableHeader: true,
        remote: true,
        isSecTableHead: false,
        loading: true,
        expandedRowKeys: <any>[],
        updateExpandedRowKeys: (key: any) => { },
        rowProps: (
            row: {
                hasOwnProperty: (arg0: string) => any
                children_node: any
                id: any
            },
            index: any
        ) => {
            return {
                onClick: (e: any) => {
                    //点击行展开或收缩 禁止掉子项添加 并将列表项中除了 td svg path 以及 svg 必须是下拉按钮 才会往下执行
                    if (
                        (row.hasOwnProperty('children_node') && row.children_node) ||
                        !['TD', 'svg', 'path'].includes(e.target.tagName) ||
                        (e.target.tagName == 'svg' &&
                            e.target.childNodes[0].tagName != 'path')
                    ) {
                        return
                    }
                    let isPush = config.tableOption.expandedRowKeys.findIndex(
                        (item: any) => item == row.id
                    )

                    if (isPush == -1) {
                        config.tableOption.expandedRowKeys.push(row.id)
                    } else {
                        config.tableOption.expandedRowKeys.splice(isPush, 1)
                    }
                },
            }
        },
        rowClassName: (rowData: { hasOwnProperty: (arg0: string) => any }) => {
            return rowData.hasOwnProperty('children_node') ? 'children-tr' : ''
        },
    },
    paginationOption: pagination,
    moduleColOptions: {
        search: {
            isShow: true,
            code: 'search',
            key: 'query_param',
            placeholder: '请输入ID或者关键词',
            value: '',
        },
        filter: {
            isShow: true,
            code: 'filter',
        },
        add: {
            isShow: true,
            code: 'subject:save',
            title: ' 新建项目',
        },
        custom: {
            isShow: true,
            code: 'subject:save',
        },
    },
    selectOptions: {
        type: {
            options: {
                label: '投放模式',
                key: 'type',
                value: '',
                type: 'select',
                options: cloneDeep(projectType),
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        status: {
            options: {
                label: '项目状态',
                key: 'status',
                value: '',
                type: 'select',
                options: cloneDeep(projectStatus),
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        region_id: {
            options: {
                label: '下单来源',
                key: 'region_id',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        company_name: {
            options: {
                label: '下单公司',
                key: 'company_name',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        advertiser_id: {
            options: {
                label: '广告主',
                key: 'advertiser_id',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        /*industry: {
            options: {
                label: '所属行业',
                key: 'industry',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },*/
        supervise_company: {
            options: {
                label: '监测公司',
                key: 'supervise_company',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        settle_standard: {
            options: {
                label: '结算依据',
                key: 'settle_standard',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        materials_name: {
            options: {
                label: '投放素材',
                key: 'materials_name',
                value: '',
                type: 'text',
                placeholder: '素材关键字',
                filterable: true,
            },
            defaultValue: {
                value: '',
            },
        },
        return_point_msg: {
            options: {
                label: '对公返点',
                key: 'return_point_msg',
                value: '',
                type: 'text',
                placeholder: '对公返点',
            },
            defaultValue: {
                value: '',
            },
        },
        settle_kpi_text: {
            options: {
                label: '考核KPI',
                key: 'settle_kpi_text',
                value: '',
                type: 'text',
                options: [],
                placeholder: '考核KPI',
            },
            defaultValue: {
                value: '',
            },
        },
        video_require: {
            options: {
                label: '录屏要求',
                key: 'video_require',
                value: '',
                type: 'text',
                placeholder: '录屏要求',
            },
            defaultValue: {
                value: '',
            },
        },
        contract_id: {
            options: {
                label: '合同',
                key: 'contract_id',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        corporate_body: {
            options: {
                label: '公司主体',
                key: 'corporate_body',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        customer_type: {
            options: {
                label: '客户类型',
                key: 'customer_type',
                value: '',
                type: 'select',
                options: cloneDeep(customerTypeOption),
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        sales: {
            options: {
                label: '下单销售',
                key: 'sales',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        // query_param: {
        //     options: {
        //         label: '订单',
        //         key: 'query_param',
        //         value: '',
        //         type: "text",
        //         placeholder: "订单或者关键字",
        //     },
        //     defaultValue: {
        //         value: '',
        //     },
        // }
    },
})

// 多选底层弹窗
const blukModuleOption = reactive({
    // 删除
    delete: {
        key: 'delete',
        code: 'subject:del',
        prompt: '删除将同时删除该项目下所有的订单，确定删除吗',
    },
})


/**
 * 初始化人员数据
 */
const handleGetUserList = () => {
    GetUsersListApi().then((res) => {
        salesmanList.value = res.data
    })
}
/**
 * 初始化下单销售数据
 */
const handleGetEmployeeList = () => {
    GetEmployeeListApi().then((res) => {
        config.selectOptions.sales.options.options = res.data.map((item) => {
            return {
                label: item.name,
                value: item.id
            }
        })
        config.selectOptions.sales.options.options.unshift(
            config.selectOptions.sales.defaultValue
        )
    })
}

/**
 * 初始化下单来源数据
 */
const handleGetRegionIdList = () => {
    GetRegionIdListApi().then((res) => {
        config.selectOptions.region_id.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            }
        )
        config.selectOptions.region_id.options.options.unshift(
            config.selectOptions.region_id.defaultValue
        )
    })
}

/*/!**
 * 初始化下单公司数据
 *!/
const handleGetOrderCompanyList = () => {
    GetOrderCompanyListApi().then((res) => {
        config.selectOptions.company_name.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            }
        )
        config.selectOptions.company_name.options.options.unshift(
            config.selectOptions.company_name.defaultValue
        )
    })
}*/

/**
 * 获取广告主列表
 */
const handleGetAdvertiserList = () => {
    GetAdvertiserListApi().then((res) => {
        config.selectOptions.advertiser_id.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            }
        )
        config.selectOptions.advertiser_id.options.options.unshift(
            config.selectOptions.advertiser_id.defaultValue
        )
    })
}
/*
/!**
 * 获取所属行业列表
 *!/
const handleGetindustryList = () => {
    GetProjectInfoApi({ type: 'INDUSTRY' }).then((res) => {
        config.selectOptions.industry.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            }
        )
        config.selectOptions.industry.options.options.unshift(
            config.selectOptions.industry.defaultValue
        )
    })
}*/

/**
 * 获取监测公司列表
 */
const handleSuperviseCompanyList = () => {
    GetProjectInfoApi({ type: 'SUPERVISE_COMPANY' }).then((res) => {
        config.selectOptions.supervise_company.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            }
        )
        config.selectOptions.supervise_company.options.options.unshift(
            config.selectOptions.supervise_company.defaultValue
        )
    })
}

/**
 * 获取结算依据列表
 */
const handleSettleStandardList = () => {
    GetProjectInfoApi({ type: 'SUPERVISE_COMPANY' }).then((res) => {
        config.selectOptions.settle_standard.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            }
        )
        config.selectOptions.settle_standard.options.options.unshift(
            config.selectOptions.settle_standard.defaultValue
        )
    })
}

/**
 * 获取合同、公司列表
 */
const handleContractList = () => {
    return GetContractListApi().then(res => {
        config.selectOptions.contract_id.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            }
        )
        config.selectOptions.contract_id.options.options.unshift(
            config.selectOptions.contract_id.defaultValue
        )

    })
}
/**
 * 公司主体列表
 */
const handleCompanyList = () => {
    return GetCompanyBodyNameListApi().then(res => {
        config.selectOptions.corporate_body.options.options = []
        config.selectOptions.corporate_body.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item,
                    value: item
                }
            }
        )
        config.selectOptions.corporate_body.options.options.unshift(
            config.selectOptions.corporate_body.defaultValue
        )
    })
}/**
 * 公司列表
 */
const handleCompanyNameList = () => {
    return GetCompanyNameListApi().then(res => {
        config.selectOptions.company_name.options.options = []
        config.selectOptions.company_name.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item,
                    value: item,
                }
            }
        )
        config.selectOptions.company_name.options.options.unshift(
            config.selectOptions.company_name.defaultValue
        )
    })
}



/**
 * 初始化请求列表数据，用于列表查询
 */
const GetProjectData = (selectOptions?: undefined) => {
    config.tableOption.loading = true
    config.tableOption.data = []
    let params = config.selectOptions
    let pageOption = config.paginationOption;
    const options = {
        query_param: config.moduleColOptions.search.value, //查询项关键字
        type: params.type.options.value, //查询投放模式
        status: params.status.options.value, //查询状态
        region_id: params.region_id.options.value, //查询下单来源
        // boss: params.boss.options.value,//boss
        // crm_sync_flag: params.crm.options.value, //同步crm
        // huanunion_sync_flag: params.huan_union.options.value, //同步crm
        company_name: params.company_name.options.value, //查询下单公司
        advertiser_id: params.advertiser_id.options.value, //查询广告主
        // industry: params.industry.options.value, //查询所属行业
        supervise_company: params.supervise_company.options.value, //查询监测公司
        settle_standard: params.settle_standard.options.value, //查询结算依据
        materials_name: params.materials_name.options.value, //查询投放素材
        return_point_msg: params.return_point_msg.options.value, //查询投放素材
        settle_kpi_text: params.settle_kpi_text.options.value, //查询考核Kpi
        video_require: params.video_require.options.value, //查询录屏要求
        contract_id: params.contract_id.options.value, //合同
        corporate_body: params.corporate_body.options.value, //公司主体
        customer_type: params.customer_type.options.value, //客户类型
        sales: params.sales.options.value, //下单销售
        id: config.moduleColOptions.search.value, //id
        page: pageOption.page, //分页
        size: pageOption.pageSize, //分页
    }
    GetSubjectPageApi(options).then((res) => {
        config.tableOption.loading = false
        if (res.code == 200) {
            config.tableOption.pagination['itemCount'] = res.data.total
            config.paginationOption['itemCount'] = res.data.total
            config.tableOption.checkedRowKeys = []
            let pageCount = Math.ceil(
                config.paginationOption['itemCount'] / config.paginationOption.pageSize
            )
            if (config.tableOption.pagination.page > pageCount) {
                config.paginationOption.page = pageCount
                config.tableOption.pagination.page = pageCount
                GetProjectData()
                return
            }
            if (res.data['items']) {
                config.tableOption.data = res.data.items.map(
                    (
                        item: {
                            item_list?: any[]
                            children: any
                            key: any
                            id: any
                            query_param: string | number
                        },
                        index: any
                    ) => {
                        item.key = item.id
                        item.query_param = showStyleMap[item.query_param]
                        return item
                    }
                )
            }
        }
    })
}
const clearPerviewActive = () => {
    materialsList.value = []
    perviewActive.pathParams = {}
    perviewActive.modalTitle = ''
    perviewActive.currentIndex = 0
    perviewActive.active = 0
}
/**
 * 初始化预览信息
 */
const getPerviewData = (id: number) => {
    return GetSubjectMaterialsApi({ id }).then((res) => {
        clearPerviewActive()
        if (res.code == 200) {
            materialsList.value = res.data
            perviewActive.pathParams = {
                time_long: res.data.time_long ? res.data.time_long + 'S' : '',
                dow_page_url: res.data.dow_page_url,
                path: res.data.path
            }
            isPreview.value = true
            perviewActiveClick(materialsList.value[0], 0)
        }
    })
}

/**
 * 修改营销服务配置
 */
const handleServicesStatus = (row: any) => {
    router.push({
        name: 'MarketingServer',
        query: {
            status: row.status,
            id: row.id,
            coo_time_between: row.coo_time_between,
            name: row.name,
            first_pass: row.first_pass,
        }
    })
}

// 获得Bos数据
const handleGetBosData = (params: any) => {
    examineStatus.value = true //打开弹窗
    let id = params.id
    project_status_model.project_status_modelRef.id = id
    GetBossCheckInfoApi({ id }).then(({ data }) => {
        // 如果获得boss数据，覆盖状态
        examineStatus.value = true //打开弹窗
        project_status_model.project_status_modelRef = Object.assign(project_status_model.project_status_modelRef, data);
        project_status_model.project_status_modelRef.subject_schedule_list = project_status_model.project_status_modelRef.subject_schedule_list || []
    })
}
// 预览执行
const handleGetPreviewData = async (params: any) => {
    //请求获取
    let { subject_id } = params;
    if (getPower('subject:overviewOrderInfo')) {
        await GetOvervieworderInfoApi({ subject_id }).then(({ data }) => {
            mediumPreview = reactive(data);
            crm_status_model.crm_status_modelRef = data;
        })
    }
    if (getPower('subject:voucherInfo')) {
        await GetvoucherInfoApi({ subject_id }).then(({ data }) => {
            crm_status_model.crm_status_modelRef = data;
        })
        await GetBossPushLogInfoApi({ id: subject_id }).then(({ data }) => {
            bos_status_model.bos_status_modelRef.project_overview = data.map(pItem => {
                return {
                    ...pItem,
                    key: pItem.id
                }
            });
        })
    }
    previewStatus.value = true //打开弹窗
}

// Bos意见通过时清空驳回信息
const ReviewComments = () => {
    if (bos_status_model.bos_status_modelRef.status == '1') {
        bos_status_model.bos_status_modelRef.status_message = '';
    }
}
// bos服务弹窗提交
const submitBosCallback = (project_id: any) => {
    let params = {
        id: project_id
    }
    console.error(params)
    // SubmitBosApi(params).then((res) => {
    //     if (res.code == 200) {
    //         window.$message.success('同步成功')
    //         previewStatus.value = false //关闭弹窗
    //         GetProjectData()
    //     }
    // })
}

// 通过驳回取消
// const cancelCallback = () => {
//     updateStatus.value = false //关闭弹窗
//     update_status_model.not_pass_msg = '' //重置驳回信息
// }


const perviewActiveClick = (
    item: {
        material_path?: string | undefined
        type?: number | undefined
        task_name?: any
        title?: any
        time_long: any
        dow_page_url: any
        path: any
    },
    index: number,
    name: string
) => {
    perviewActive.active = item
    perviewActive.currentIndex = index
    perviewActive.modalTitle = item.name
    perviewActive.pathParams = {
        time_long: item.time_long ? item.time_long + 'S' : '',
        dow_page_url: item.dow_page_url,
        path: item.path
    }
    perviewActive.path = item.path
    perviewActive.thumbnail_path = item.thumbnail_path
    perviewActive.time_long = item.time_long
    perviewActive.coo_start_time = item.coo_start_time
    perviewActive.coo_end_time = item.coo_end_time
    perviewActive.brands = item.brands
}

/**
 * 重置分页
 */
const resetPaginationPage = () => {
    config.tableOption.pagination.page = 1
    config.paginationOption.page = 1
}

/**
 *  关闭弹框
 */
const closeModal = () => {
    isPreview.value = false
}

/**
 * tag 发生修改后
 */
const searchTagChange = (item: any, selectOptions: any) => {
    resetPaginationPage()
    GetProjectData()
}

/**
 * 清空
 * @param selectOptions
 */
const searchClearClick = (selectOptions: any) => {
    resetPaginationPage()
    GetProjectData()
}

/**
 * tag 某一个的清空回调
 * @param selectOptions
 */
const searchTagClose = () => {
    resetPaginationPage()
    GetProjectData()
}

/**
 * 筛选点击确认
 */
const filterClickOK = () => {
    resetPaginationPage()
    GetProjectData()
}

const filterClickCancel = (selectOptions: any) => {
    // getProjectData();
}

const searchInputChange = (value: any, selectOptions: any) => {
    resetPaginationPage()
    GetProjectData()
}

const searchInputEnter = (value: any, selectOptions: any) => {
    resetPaginationPage()
    GetProjectData()
}

/**
 * 执行批量删除操作 delete
 * @param data
 */
const deleteClickOk = (data: any[]) => {
    let ids: number[] = []
    let isError: boolean = false;
    data.forEach((item: any) => {
        if (item.firstPass == 1) {
            window.$notification['error']({
                content: '错误提示',
                meta: `存在已送审项目，不允许删除，请检查后再操作！`,
                duration: 3000,
            })
            isError = true;
            return
        }
        ids.push(Number(item))
    })
    if (isError) {
        return
    }
    DeleteProjectApi(ids).then((res) => {
        if (res.code == 200) {
            window.$notification['success']({
                content: '成功提示',
                meta: `项目删除成功！`,
                duration: 3000,
            })
            GetProjectData()
        }
    })
}

// 新建项目
const handleAddProject = () => {
    let routeUrl = router.resolve({
        path: '/project/addProject',
    })
    window.open(routeUrl.href, '_blank')
}

const initEnd = () => {
    GetProjectData() //获得列表数据
    wtable.value.generateSearchTag()
}

onMounted(() => {
    handleGetRegionIdList() //获得下单来源列表
    // handleGetOrderCompanyList() //获得下单公司列表
    handleGetAdvertiserList() //获得广告主列表
    // handleGetindustryList() //获得行业列表
    handleSuperviseCompanyList() //获得监测公司列表
    handleSettleStandardList() //获得结算依据列表
    handleGetUserList() //获得用户列表
    handleGetEmployeeList() //获得下单销售列表
    handleContractList() //获得合同、公司主体列表
    handleCompanyList()//获取公司主体
    handleCompanyNameList()//获取公司列表
})

watchEffect(() => {
    if (!project.isOperate) {
        config.tableOption.columns = config.tableOption.columns.filter((item) => {
            return item.key != 'operate'
        })
    }
})
</script>

<style scoped>
.boss-alert :deep(.n-form-item .n-form-item-label),
.examine-box :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.boss-box {
    overflow: auto;
}
</style>
<style>
.delivery-box {
    color: #fff;
    background-color: #fd8f00;
    font-size: 12px;
    border-radius: 5px;
    padding: 1px 8px;
    display: inline-block;
}

.prog-box {
    display: inline-block;
    color: #fff;
    background-color: #52c41a;
    font-size: 12px;
    border-radius: 5px;
    padding: 1px 8px;
}

.preview-title,
.perview-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 16px;
}

.preview-title-ul {
    display: inline-flex;
    list-style: none;
    flex-direction: row;
    align-items: center;

}

.preview-title-ul .cont {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;

}

.preview-title-ul .color-blue {
    color: #1890FF;
    margin-left: 3px;
    cursor: pointer;
}

.perview-box {
    margin-bottom: 10px;
}

.perview-show {
    width: 630px;
    height: 360px;
}

.perview-img {
    width: 100%;
    height: 100%;
}

.perview-materials {
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.perview-list {
    width: 130px;
    height: 360px;
    overflow: auto;
}

.perview-list-ul {
    width: 100%;
}

.perview-list-ul li {
    list-style: none;
    margin-bottom: 4px;
}


.active-item {
    border: 2px solid var(--theme-color);
    padding: 2px;
}

.unactive-item {
    border: 2px solid #00000000;
    padding: 2px;
}

.children-tr td {
    background-color: var(--theme-bg-color) !important;
}

.updateStatus .n-form-item-feedback-wrapper {
    display: none;
}

.project-footer {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.jump_name {
    cursor: pointer;
}

.crm-box .n-form-item,
.bos-box .n-form-item {
    margin-bottom: 12px;
}

.project .project-status {
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
}

.project .project-gray {
    color: #8c8c8c;
}

.project .project-blue {
    color: #1890ff;
}

.project .project-red {
    color: #f5222d;
}

.project .project-green {
    color: #52c41a;
}

.icon-danger {
    width: 14px;
    height: 14px;
}

.icon-warp-box {
    display: flex;
    flex-direction: row;
}

.left-icon-box {
    width: 120px;
    display: flex;
    justify-content: flex-end;
}

.previews {
    height: 800px;
    width: 1200px;
    overflow: hidden;
}

.previews .crm-box {
    height: 430px;
    overflow-y: scroll;
}

.previews .examine-box {
    height: 670px;
    overflow-y: auto;
    padding-right: 10px;
}

.previews .bos-box {
    box-sizing: border-box;
    height: 600px;
    overflow-y: scroll;
    padding: 0 12px;
}

.close-box {
    float: right;
    margin-left: 10px;
    cursor: pointer;
}

.alert-title {
    margin: 12px 0 17px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: bold;
    color: #262626;
}

.editor-show * {
    vertical-align: baseline;
}

.execed {
    display: flex;
    align-items: center;
}

.execed {
    display: flex;
    align-items: center;
}

.execed {
    display: flex;
    align-items: center;
}

.execed {
    display: flex;
    align-items: center;
}

.form-item-preview {
    height: 30px !important;
    vertical-align: top;
}

.cell-item {}

.info-item-div {}

.info-label {
    width: 90px;
    margin-right: 10px;
    display: inline-block;
    text-align: right;
    vertical-align: top;
    color: #999999;
}

.info-value {
    display: inline-block;
    width: 420px;
    vertical-align: top;
}

/* .info-value p{
    line-height:20px !important;
} */
</style>

