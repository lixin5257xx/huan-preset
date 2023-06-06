<template>
    <div class="orderList">
        <wTable :config="config" ref="wtable" @filterClickOK="filterClickOK" @searchInputChange="searchInputChange"
            @searchTagChange="searchTagChange" @searchTagClose="searchTagClose" @searchClearClick="searchClearClick"
            @searchInputEnter="searchInputEnter" @addClick="addScreen" @initEnd="initEnd">
        </wTable>
        <bulkOperations v-model="config.tableOption.checkedRowKeys" :options="blukModuleOption"
            @deleteClickOk="deleteClickOk" />
        <n-modal v-model:show="isPreview" :mask-closable="false" :auto-focus="false" preset="card" style="width: 500px"
            title="撤单" @mask-click="handelCancelPreview" @after-leave="handelCancelPreview">
            <template #header-extra></template>
            <p class="model-msg">确定对{{ cancelReactive.name }}订单执行撤单吗?</p>
            <n-input v-model:value="cancelReactive.withdraw_msg" type="textarea" placeholder="请输入撤单原因！" maxlength="60" />
            <template #footer>
                <div class="project-footer">
                    <n-button :text="true" class="btn-txt" @click="handelCancelPreview">取消</n-button>
                    <n-button :loading="cancelLoading" type="warning" style="margin-left: 10px" @click.prevent="handelSubmitCancel" v-preventReClick>
                        确定</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import {
    reactive,
    ref,
    h,
    onMounted,
    onBeforeMount,
    RendererElement,
    RendererNode,
    VNode,
    Ref,
    defineComponent,
    nextTick,
    watchEffect,
} from 'vue'
import {
    GetOrderListApi,
    OrderListDeleteApi,
    GetSysDictApi,
    GetShowStyleApi,
    OrderUpdateNameApi,
    GetSubjectListApi,
} from '@api'
import _ from 'lodash'
import { NButton, NIcon, NTooltip, NInput } from 'naive-ui'
import wTable from '@/components/table/index.vue'
import ShowOrEdit from '@/components/edit-name/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { DataUsageEdit24Regular, History20Filled } from '@vicons/fluent'

import { Undo, CalendarTools } from '@vicons/carbon'
import { EditOutlined } from '@vicons/antd'
import dayjs from 'dayjs'
// 引用筛选项默认值
import {
    projectType, //投放模式
    orderStatus, //状态
    orderStatusMap,
    projectTypeMap,
    returnPointFlagOptions,
} from '../constant/project'
import { useState, useCancelModel } from './use/order'
import bulkOperations from '@/components/bulk-operations/index.vue'
import orderStatusComp from './components/orderStatus.vue'
import orderStatusDanger from './components/orderStatusComponent.vue'
import useStore from '@/config/pinia'
const { cancelReactive } = useState()
const { $patch, CustomAdd, order, getPower } = useStore()

$patch({
    order: {
        isOperate: true,
    },
})

/**
 * 初始化请求列表数据
 */
const getData = (selectOptions?: undefined) => {
    config.tableOption.loading = true
    config.tableOption.data = []
    let pageOption = config.paginationOption
    let params = config.selectOptions
    const options = {
        query_param: config.moduleColOptions.search.value,
        page: pageOption.page,
        size: pageOption.pageSize,
        ad_space: params.adSpace.options.value,
        brand: params.brand.options.value,
        create_time_start: getTime(params.createTime.options.value, 0),
        create_time_end: getTime(params.createTime.options.value, 1),
        kpi_type: params.kpiType.options.value,
        market: params.market.options.value,
        // materials_name: params.materialsName.options.value,
        push_time_start: getTime(params.pushTime.options.value, 0),
        push_time_end: getTime(params.pushTime.options.value, 1),
        remarks_text: params.remarks_text.options.value,
        // return_point_flag: params.returnPointFlag.options.value,
        product_name: params.productName.options.value,
        status: params.status.options.value,
        type: params.type.options.value,
        subject_id: params.subjectId.options.value,
    }
    GetOrderListApi(options).then((res) => {
        config.tableOption.loading = false
        if (res.code == 200) {
            config.tableOption.pagination['itemCount'] = res.data.total
            config.paginationOption['itemCount'] = res.data.total
            config.tableOption.checkedRowKeys = []
            let maxPage = config.tableOption.pagination.page
            //当用户没有数据的时候 会出现两次请求 所以需要加入判断
            if (res.data.total) {
                maxPage = Math.ceil(res.data.total / config.paginationOption.pageSize)
            }
            if (config.tableOption.pagination.page > maxPage) {
                config.paginationOption.page = maxPage
                config.tableOption.pagination.page = maxPage
                getData()
                return
            }
            if (res.data['items']) {
                config.tableOption.data = res.data.items.map(
                    (
                        item: {
                            key: any
                            id: any
                            name: string
                            create_time: string
                            push_time_end: string
                            push_time_start: string
                            product_name_name: string
                            status: string
                            type: string
                            withdraw_msg: string
                            brand_name: string
                            out_time1_day_flag: boolean
                            subject_name: string
                            ad_space_name: string
                            remarks_text: string
                            materials_name: string
                            update_log_flag: boolean
                        },
                        index: any
                    ) => {
                        return {
                            id: item.id,
                            name: item.name,
                            create_time: item.create_time,
                            push_time_end: item.push_time_end,
                            push_time_start: item.push_time_start,
                            product_name_name: item.product_name_name,
                            key: item.id,
                            status: item.status,
                            type: item.type,
                            withdraw_msg: item.withdraw_msg,
                            brand_name: item.brand_name,
                            out_time1_day_flag: item.out_time1_day_flag,
                            subject_name: item.subject_name,
                            ad_space_name: item.ad_space_name,
                            remarks_text: item.remarks_text,
                            materials_name: item.materials_name,
                            update_log_flag: item.update_log_flag,
                        }
                    }
                )
            }
        }
    })
}
/**
 * 重置分页
 */
const resetPaginationPage = () => {
    config.tableOption.pagination.page = 1
    config.paginationOption.page = 1
}
const { isPreview, handelSubmitCancel, handelCancelPreview ,cancelLoading} = useCancelModel(
    cancelReactive,
    getData,
    resetPaginationPage
)
const checkedRowKeysRef = ref([])
const route = useRoute()
const router = useRouter()
const wtable = ref()
function createCols() {
    return [
        {
            type: 'selection',
            fixed: 'left',
            minWidth: 50,
            disabled(row: any) {
                return row.status == 4
            },
            customStatus: 'left',
        },
        {
            title: '订单名称',
            key: 'name',
            minWidth: 250,
            width: 250,
            // render(row: any) {
            //     return h(ShowOrEdit, {
            //         value: row.name,
            //         onUpdateValue(v: any) {
            //             if (v) {
            //                 OrderUpdateNameApi({
            //                     id: row.id,
            //                     name: v,
            //                 }).then((res) => {
            //                     if (res.code == 200) {
            //                         row.name = v
            //                         row.update_log_flag = res.data.update_log_flag
            //                     }
            //                 })
            //             } else {
            //                 window.$message.error('订单名称不能为空！')
            //                 return false
            //             }
            //         },
            //     })
            // },
            customStatus: 'left',
        },
        {
            title: '订单ID',
            key: 'id',
            minWidth: 80,
            width: 80,
            customStatus: 'left',
        },
        {
            title: '项目名称',
            key: 'subject_name',
            minWidth: 250,
            width: 250,
            ellipsis: {
                tooltip: true,
            },
            custom: false,
        },
        {
            title: '订单状态',
            key: 'status',
            minWidth: 100,
            width: 100,
            custom: true,
            render: (row: any) => {
                return row.status == -1 || row.status == 31
                    ? h(
                        orderStatusDanger,
                        {
                            row: row
                        }
                    )
                    : h(
                        orderStatusComp,
                        {
                            row: row
                        }
                    )
            },
        },
        {
            title: '投放模式',
            key: 'type',
            minWidth: 100,
            width: 100,
            custom: true,
            render: (row: any) => {
                return h(
                    'div',
                    {
                        class: row.type == 1 ? 'delivery-box' : 'prog-box',
                    },
                    {
                        default: () => projectTypeMap[row.type],
                    }
                )
            },
        },
        {
            title: '产品名称',
            key: 'product_name_name',
            minWidth: 150,
            width: 150,
            ellipsis: {
                tooltip: true,
            },
            custom: true,
        },
        {
            title: '媒体',
            key: 'brand_name',
            minWidth: 150,
            width: 150,
            ellipsis: {
                tooltip: true,
            },
            custom: true,
        },
        {
            title: '广告位',
            key: 'ad_space_name',
            minWidth: 150,
            width: 150,
            ellipsis: {
                tooltip: true,
            },
            custom: false,
        },

        {
            title: '备注',
            key: 'remarks_text',
            minWidth: 150,
            width: 150,
            ellipsis: {
                tooltip: true,
            },
            custom: false,
        },
        {
            title: '订单周期',
            key: 'push_time_start',
            minWidth: 250,
            width: 250,
            custom: true,
            render: (row: any) => {
                return h(
                    'div',
                    {},
                    {
                        default: () =>
                            `${dayjs(row.push_time_start).format('YYYY-MM-DD')} 至 ${dayjs(
                                row.push_time_end
                            ).format('YYYY-MM-DD')}`,
                    }
                )
            },
        },
        // {
        //     title: '投放时段',
        //     key: 'push_time_start',
        //     width: 150,
        //     ellipsis: true,
        //     custom: false,
        //     render: (row: any) => {
        //         return h('div', {
        //         }, {
        //             default: () => `${row.push_time_start}-${row.push_time_end}`
        //         });
        //     }
        // },
        // {
        //     title: '素材',
        //     key: 'materials_name',
        //     minWidth: 150,
        //     width: 150,
        //     ellipsis: {
        //         tooltip: true,
        //     },
        //     custom: false,
        // },
        {
            title: '操作',
            key: 'operate',
            minWidth: 180,
            width: 180,
            fixed: 'right',
            align: 'left',
            customStatus: 'right',
            render: (row: any) => {
                let moduleMap = [
                    {
                        name: 'cancel',
                        label: '撤单',
                        component: Undo,
                        code: 'order:updateStatus',
                    },
                    {
                        name: 'update',
                        label: '编辑',
                        component: DataUsageEdit24Regular,
                        code: ['order:info', 'order:update'],
                    },
                    {
                        name: 'record',
                        label: '改单记录',
                        component: History20Filled,
                        code: 'order:updateLog',
                    },
                ]
                let resultList: VNode<
                    RendererNode,
                    RendererElement,
                    { [key: string]: any }
                >[] = []
                // 1：待执行，2：投放中，3：已暂停，31：已驳回，4：已完成，-1：已撤单
                    // 订单是否开始执行
                const isStart = dayjs().isBefore(dayjs(row.push_time_start))
                if ([2, 3, -1, 4].includes(row.status) || ([31].includes(row.status) && !isStart)) {
                    moduleMap = moduleMap.filter((item: any) => {
                        return !['cancel'].includes(item.name)
                    })
                }
                if (!row.update_log_flag) {
                    moduleMap = moduleMap.filter((item) => {
                        return !['record'].includes(item.name)
                    })
                }
                moduleMap.forEach((item) => {
                    if (
                        (row.hasOwnProperty('children_node') ||
                            !row.hasOwnProperty('children_node')) &&
                        getPower(item.code)
                    ) {
                        resultList.push(
                            h(
                                NButton,
                                {
                                    text: true,
                                    tag: 'a',
                                    title: item.label,
                                    style: {
                                        fontSize: '18px',
                                        marginRight: '20px',
                                        verticalAlign: 'middle',
                                    },
                                    onClick: () => {
                                        switch (item.name) {
                                            case 'cancel': {
                                                isPreview.value = true
                                                cancelReactive.id = row.id
                                                cancelReactive.name = row.name
                                                // handelSubmitCancel(row.id)
                                                break
                                            }
                                            case 'update': {
                                                let routeUrl = router.resolve({
                                                    name: 'addOrUpdateOrder',
                                                    query: {
                                                        id: row.id,
                                                        type: 'update',
                                                    },
                                                })
                                                window.open(routeUrl.href, '_blank')
                                                break
                                            }
                                            case 'record': {
                                                let routeUrl = router.resolve({
                                                    name: 'orderTake',
                                                    query: {
                                                        id: row.id,
                                                        name: row.name,
                                                    },
                                                })
                                                window.open(routeUrl.href, '_blank')
                                                break
                                            }
                                        }
                                    },
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
                        order: {
                            isOperate: false,
                        },
                    })
                }
                return resultList
            },
        },
    ]
}
const data = ref()
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
        CustomAdd({ info: { pageSize }, key: 'order' })
        resetPaginationPage()
        getData()
    },
    onUpdatePage: (page: number) => {
        pagination.page = page
        getData()
    },
})

const config = reactive({
    pageId: 'order',
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
        rowClassName: (rowData: { hasOwnProperty: (arg0: string) => any }) => {
            return rowData.hasOwnProperty('children_node') ? 'children-tr' : ''
        },
    },
    paginationOption: pagination,
    moduleColOptions: {
        search: {
            isShow: true,
            code: 'search',
            placeholder: '请输入ID或者关键词',
            value: '',
        },
        filter: {
            isShow: true,
            code: 'filter',
        },
        add: {
            isShow: true,
            code: 'order:save',
            title: ' 新建订单',
        },
        custom: {
            isShow: true,
            code: 'custom',
        },
    },
    selectOptions: {
        subjectId: {
            options: {
                label: '项目名称',
                key: 'subjectId',
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
        type: {
            options: {
                label: '投放模式',
                key: 'type',
                value: '',
                type: 'select',
                options: _.cloneDeep(projectType),
                placeholder: '请选择',
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        status: {
            options: {
                label: '订单状态',
                key: 'status',
                value: '',
                type: 'select',
                options: _.cloneDeep(orderStatus),
                placeholder: '请选择',
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        productName: {
            options: {
                label: '产品名称',
                key: 'product_name',
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
        brand: {
            options: {
                label: '媒体',
                key: 'brand',
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
        createTime: {
            options: {
                label: '创建日期',
                key: 'create_time',
                value: '',
                type: 'daterange',
                options: [],
                placeholder: '开始日期 至 结束日期',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        pushTime: {
            options: {
                label: '订单周期',
                key: 'push_time',
                value: '',
                type: 'daterange',
                options: [],
                placeholder: '开始日期 至 结束日期',
                filterable: true,
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        adSpace: {
            options: {
                label: '广告位',
                key: 'ad_space',
                value: '',
                type: 'text',
                options: [],
                placeholder: '请输入',
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        kpiType: {
            options: {
                label: 'KPI类型',
                key: 'kpi_type',
                value: '',
                type: 'select',
                options: [],
                placeholder: '请选择',
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },

        remarks_text: {
            options: {
                label: '备注',
                key: 'remarks_text',
                value: '',
                type: 'text',
                placeholder: '备注',
            },
            defaultValue: {
                value: '',
            },
        },
        // materialsName: {
        //     options: {
        //         label: '素材',
        //         key: 'materials_name',
        //         value: '',
        //         type: 'text',
        //         placeholder: '请输入素材',
        //     },
        //     defaultValue: {
        //         value: '',
        //     },
        // },
        market: {
            options: {
                label: '市场',
                key: 'market',
                value: '',
                type: 'text',
                placeholder: '市场',
            },
            defaultValue: {
                value: '',
            },
        },
        // returnPointFlag: {
        //     options: {
        //         value: '',
        //         label: '对公返点',
        //         key: 'return_point_flag',
        //         type: 'select',
        //         options: _.cloneDeep(returnPointFlagOptions),
        //         placeholder: '请选择',
        //     },
        //     defaultValue: {
        //         label: '不限',
        //         value: '',
        //     },
        // },
    },
})
const getTime = (value: string | any[] | null, index: number) => {
    return value && value.length > 0
        ? index == 0
            ? value[index]
            : value[index]
        : ''
}

const blukModuleOption = reactive({
    delete: {
        key: 'delete',
        code: 'order:del',
    },
})
/**
 * 筛选点击确认
 */
const filterClickOK = () => {
    resetPaginationPage()
    getData()
}
const searchInputChange = (value: any, selectOptions: any) => {
    resetPaginationPage()
    getData()
}
const searchInputEnter = (value: any, selectOptions: any) => {
    resetPaginationPage()
    getData()
}
/**
 * tag 发生修改后
 */
const searchTagChange = (item: any, selectOptions: any) => {
    resetPaginationPage()
    getData()
}

/**
 * tag 某一个的清空回调
 * @param selectOptions
 */
const searchTagClose = () => {
    resetPaginationPage()
    getData()
}
/**
 * 清空
 * @param selectOptions
 */
const searchClearClick = (selectOptions: any) => {
    resetPaginationPage()
    getData()
}
/**
 * 执行批量删除操作 delete
 * @param data
 */
const deleteClickOk = (data: any) => {
    // ids是后端参数
    let params: any = {
        ids: [],
    }
    // 把选中的key加入删除id队列
    data.forEach((item: any) => {
        params.ids.push(Number(item))
    })
    OrderListDeleteApi(params).then((res) => {
        if (res.code == 200) {
            window.$notification['success']({
                content: '成功提示',
                meta: `删除订单成功!`,
                duration: 3000,
            })
            getData()
        }
    })
}
const addScreen = () => {
    let routeUrl = router.resolve({
        path: '/order/addOrUpdateOrder',
    })
    window.open(routeUrl.href, '_blank')
}

/**
 * 初始化项目名称数据
 */
const getSubjectList = () => {
    return GetSubjectListApi({
        status_open_flag: false,
    }).then((res) => {
        config.selectOptions.subjectId.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            }
        )
        config.selectOptions.subjectId.options.options.unshift(
            config.selectOptions.subjectId.defaultValue
        )
        if (route.query.subjectId) {
            config.selectOptions.subjectId.options.value = Number(
                route.query.subjectId
            )
        }
        wtable.value.generateSearchTag()
    })
}
/**
 * 初始化产品名称数据
 */
const getShowStyle = () => {
    GetShowStyleApi({ type: 'ADVERTISING' }).then((res) => {
        config.selectOptions.productName.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.value,
                }
            }
        )
        config.selectOptions.productName.options.options.unshift(
            config.selectOptions.productName.defaultValue
        )
    })
}
/**
 * 初始化媒体数据
 */
const getChannelList = () => {
    GetSysDictApi({ type: 'MT' }).then((res) => {
        config.selectOptions.brand.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.value,
                }
            }
        )
        config.selectOptions.brand.options.options.unshift(
            config.selectOptions.brand.defaultValue
        )
    })
}

/**
 * 初始化KPI类型数据
 */
const getKpiTypeList = () => {
    GetSysDictApi({ type: 'KPI_TYPE' }).then((res) => {
        config.selectOptions.kpiType.options.options = res.data.map(
            (item: { [x: string]: any; label: string; id: number }) => {
                return {
                    label: item.name,
                    value: item.value,
                }
            }
        )
        config.selectOptions.kpiType.options.options.unshift(
            config.selectOptions.kpiType.defaultValue
        )
    })
}

watchEffect(() => {
    if (order.isOperate == false) {
        config.tableOption.columns = config.tableOption.columns.filter((item) => {
            return item.key != 'operate'
        })
    }
})

const initEnd = async () => {
    await getSubjectList()
    await getData() //获得列表数据
}

onMounted(() => {
    getShowStyle()
    getChannelList()
    getKpiTypeList()
})
</script>

<style>
.orderList .order-status {
    width: 48px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
}

.orderList .order-gray {
    background: #f2f2f2;
    color: #8c8c8c;
}

.orderList .order-blue {
    color: #1890ff;
}

.orderList .order-red {
    color: #f5222d;
}

.orderList .order-green {
    color: #52c41a;
}

.orderList .icon-danger {
    width: 14px;
    height: 14px;
}

.orderList .icon-edit {
    font-size: 12px;
    width: 14px;
    height: 14px;
    margin: 0px 0 0 5px;
    cursor: pointer;
    display: block;
}

.orderList .edit-box {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.txt-ellipsis {
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

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
</style>
<style scoped>
.model-msg {
    margin-bottom: 10px;
    color: #333;
    text-align: center;
    font-size: 14px;
}

.project-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
