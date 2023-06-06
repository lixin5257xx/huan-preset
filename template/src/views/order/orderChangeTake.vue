<template>
    <div class="orderChangeTake">
        <wTable ref="wtable" :config="config" @searchInputChange="searchInputChange" @searchClearClick="searchClearClick"
            @searchInputEnter="searchInputEnter" @initEnd="initEnd">
            <template #table-dressing-slot>
                <n-date-picker @update:formatted-value="(value, timestampValue) => updateTimeSelect(value, timestampValue)"
                    type="daterange" clearable value-format="yyyy-MM-dd" :is-date-disabled="disablePreviousDate" />
            </template>
        </wTable>
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
} from 'vue'
import type { Ref } from 'vue';
import { GetSubjectTaskPageApi } from '@api'
import _ from 'lodash'
import { NButton, NIcon, NTooltip, NInput } from 'naive-ui'
import wTable from '@/components/table/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { ClipboardError24Regular } from '@vicons/fluent'
import useStore from "@/config/pinia";
const { $patch, CustomAdd, order, getPower } = useStore();
const dateTimeRange: Ref<string[] | undefined> = ref();
const data_id: any = ref();
$patch({
    orderChangeTake: {
        isOperate: true,
    }
})

/**
 * 初始化请求列表数据
 */
const getData = (selectOptions?: undefined) => {
    config.tableOption.loading = true
    config.tableOption.data = []
    let pageOption = config.paginationOption
    console.log('初始化')
    const options = {
        data_id: data_id.value,
        type: "order",
        create_time_start: dateTimeRange.value ? dateTimeRange.value[0] : null,
        create_time_end: dateTimeRange.value ? dateTimeRange.value[1] : null,
        query_param: config.moduleColOptions.search.value,
        page: pageOption.page,
        size: pageOption.pageSize,
    }
    GetSubjectTaskPageApi(options).then((res) => {
        config.tableOption.loading = false
        if (res.code == 200) {
            config.tableOption.pagination['itemCount'] = res.data.total
            config.paginationOption['itemCount'] = res.data.total
            config.tableOption.checkedRowKeys = []
            let maxPage = config.tableOption.pagination.page;
            //当用户没有数据的时候 会出现两次请求 所以需要加入判断
            if (res.data.total) {
                maxPage = Math.ceil(
                    res.data.total / config.paginationOption.pageSize
                )
            }
            if (config.tableOption.pagination.page > maxPage) {
                config.paginationOption.page = maxPage
                config.tableOption.pagination.page = maxPage
                getData()
                return
            }
            if (res.data['items']) {
                config.tableOption.data = res.data['items'];
            }
        }
    })
}

const updateTimeSelect = (value: [string, string] | null, timestampValue: [number, number] | null) => {
    dateTimeRange.value = value;
    getData();
}

// 日期禁止今天以后
const disablePreviousDate = (ts: number) => {
    return ts > Date.now()
}

/**
 * 重置分页
 */
const resetPaginationPage = () => {
    config.tableOption.pagination.page = 1
    config.paginationOption.page = 1
}
const route = useRoute()
const router = useRouter()
const wtable = ref()
function createCols() {
    return [
        {
            title: '订单ID',
            key: 'data_id',
            minWidth: 80,
            width: 80,
            align: "center"
        },
        {
            title: '订单名称',
            key: 'data_name',
            minWidth: 200,
            width: 200,
            ellipsis: {
                tooltip: true
            },
        },
        {
            title: '操作人',
            key: 'create_user',
            minWidth: 100,
            width: 100,
            ellipsis: {
                tooltip: true
            },
        },
        {
            title: '操作时间',
            key: 'create_time',
            minWidth: 200,
            width: 200,
            ellipsis: {
                tooltip: true
            },
        },
        {
            title: '操作结果',
            key: 'update_msg',
        },
        {
            title: '操作',
            key: 'operate',
            minWidth: 80,
            width: 80,
            fixed: 'right',
            align: 'left',
            customStatus: "right",
            render: (row: any) => {
                let moduleMap = [
                    {
                        name: 'info',
                        label: '详情',
                        component: ClipboardError24Regular,
                        isFather: true,
                        isChild: false,
                        code: ["order:info", "order:update"],
                    },
                ]
                let resultList: VNode<
                    RendererNode,
                    RendererElement,
                    { [key: string]: any }
                >[] = []
                if ([2, 3, -1, 4].includes(row.status)) {
                    moduleMap = moduleMap.filter((item: any) => {
                        return !["cancel"].includes(item.name)
                    })
                }
                moduleMap.forEach((item) => {
                    if (
                        ((row.hasOwnProperty('children_node') && item.isChild) ||
                            (!row.hasOwnProperty('children_node') && item.isFather)) && getPower(item.code)
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
                                            case 'info': {
                                                let routeUrl = router.resolve({
                                                    name: 'orderTakeInfo',
                                                    query: {
                                                        pid: data_id.value,
                                                        id: row.id,
                                                        time: row.create_time,
                                                        name: row.data_name,
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
                        }
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
        pagination.pageSize = pageSize;
        CustomAdd({ info: { pageSize }, key: "orderChangeTake" });
        resetPaginationPage()
        getData()
    },
    onUpdatePage: (page: number) => {
        pagination.page = page
        getData()
    },
})


const config = reactive({
    pageId: 'orderChangeTake',
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
            placeholder: '请输入操作人关键词',
            value: '',
        }
    },
})
const getTime = (value: string | any[] | null, index: number) => {
    return value && value.length > 0 ? (index == 0 ? value[index] : value[index]) : ''
}

const blukModuleOption = reactive({
    delete: {
        key: 'delete',
        code: 'order:del',
    },

})

const searchInputChange = (value: any, selectOptions: any) => {
    resetPaginationPage()
    getData()
}
const searchInputEnter = (value: any, selectOptions: any) => {
    resetPaginationPage()
    getData()
}

/**
 * 清空
 * @param selectOptions
 */
const searchClearClick = (selectOptions: any) => {
    resetPaginationPage();
    getData();
}

const initEnd = async () => {
    await getData(); //获得列表数据
}

onBeforeMount(() => {
    (route.meta as any).bread[1].label = route.query['name'] ? route.query['name'] : '改单列表';
    data_id.value = route.query['id'] ? route.query['id'] : null;
    console.log('data_id.value',data_id.value)
})
</script>

<style>
.orderChangeTake .order-status {
    width: 58px;
    height: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
}

.orderChangeTake .order-gray {
    background: #f2f2f2;
    color: #8c8c8c;
}

.orderChangeTake .order-blue {
    background: #e6f7ff;
    color: #1890ff;
}

.orderChangeTake .order-red {
    background: #fff1f0;
    color: #f5222d;
}

.orderChangeTake .order-green {
    background: #f6ffed;
    color: #52c41a;
}

.orderChangeTake .icon-danger {
    width: 14px;
    height: 14px;
}

.orderChangeTake .icon-edit {
    font-size: 12px;
    width: 14px;
    height: 14px;
    margin: 0px 0 0 5px;
    cursor: pointer;
    display: block;
}

.orderChangeTake .edit-box {
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
