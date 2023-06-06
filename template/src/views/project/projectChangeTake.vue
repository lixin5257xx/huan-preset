<!--
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-02-27 09:58:28
 * @LastEditors: 文件最后更新人：任亮
 * @LastEditTime: 2023-03-15 11:17:16
 * @FilePath: \operation-web\src\views\project\projectChangeTake.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div class="orderChangeTake">
        <wTable ref="wtable" :config="config" @searchInputChange="searchInputChange" @searchClearClick="searchClearClick"
            @searchInputEnter="searchInputEnter" @addClick="addScreen" @initEnd="initEnd">
            <template #table-dressing-slot>
                <n-date-picker style="width: 285px" v-model:value="model.range" type="daterange" clearable
                :is-date-disabled="disablePreviousDate"
                @update:value="dateCooTimeChange" />
            </template>
        </wTable>
        <bulkOperations v-model="config.tableOption.checkedRowKeys" :options="blukModuleOption"
            @deleteClickOk="deleteClickOk" />
    </div>
</template>

<script setup lang="ts">
import {
    reactive,
    ref,
    h,
    onMounted,
    RendererElement,
    RendererNode,
    VNode,
    watchEffect,
} from 'vue'
import { GetSubjectTaskPageApi, OrderListDeleteApi } from '@api'
import _ from 'lodash'
import { NButton, NIcon } from 'naive-ui'
import wTable from '@/components/table/index.vue'
import { useRoute, useRouter } from 'vue-router'

import { ClipboardError24Regular} from '@vicons/fluent'
import dayjs from 'dayjs'
import { useState } from './use/projectChangeTake'
import bulkOperations from '@/components/bulk-operations/index.vue'
import useStore from "@/config/pinia";
const router = useRouter()
const route = useRoute()
const { $patch, order, getPower } = useStore();
const { model } = useState()
$patch({
    projectChangeTake: {
        isOperate: true,
    }
})
const getTime = (value: string | any[] | null, index: number) => {
    return value && value.length > 0 ? (index == 0 ? value[index] : value[index]) : ''
}
/**
 * 投放周期change
 */
const dateCooTimeChange = (value: any) => {
    console.log('value', value)
    model.range = value
    if (model.range && model.range.length) {
        model.create_time_start = dayjs(model.range[0]).format('YYYY-MM-DD')
        model.create_time_end = dayjs(model.range[1]).format('YYYY-MM-DD')
    } else {
        model.create_time_start = null
        model.create_time_end = null
    }
    getData()
}
// 日期禁止今天以后
const  disablePreviousDate = (ts: number) => {
    return ts > Date.now()
}

/**
 * 初始化请求列表数据
 */
const getData = (selectOptions?: undefined) => {
    config.tableOption.loading = true
    config.tableOption.data = []
    let pageOption = config.paginationOption
    const options = {
        type: 'subject',
        data_id: route.query.id,
        create_time_start: model.create_time_start,
        create_time_end: model.create_time_end,
        query_param: config.moduleColOptions.search.value,
        page: pageOption.page, //分页
        size: pageOption.pageSize, //分页
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
                config.tableOption.data = res.data.items
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

const wtable = ref()
function createCols() {
    return [
        {
            title: '项目ID',
            key: 'data_id',
            minWidth: 80,
            width: 80,
            customStatus: "left",
            align: "center"
        },
        {
            title: '项目名称',
            key: 'data_name',
            minWidth: 200,
            width: 200,
            customStatus: "left",
        },
        {
            title: '操作人',
            key: 'create_user',
            minWidth: 100,
            width: 100,
            customStatus: "left",
        },
        {
            title: '操作时间',
            key: 'create_time',
            minWidth: 200,
            width: 200,
            ellipsis: {
                tooltip: true
            },
            custom: false,
        },
        {
            title: '操作结果',
            key: 'update_msg',
            ellipsis: {
                tooltip: true
            },
            custom: true,
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
                        name: 'record',
                        label: '详情',
                        component: ClipboardError24Regular  ,
                        isFather: true,
                        isChild: false,
                        code: ["subject:updateLog"],
                    },
                ]
                let resultList: VNode<
                    RendererNode,
                    RendererElement,
                    { [key: string]: any }
                >[] = []

                moduleMap.forEach((item) => {
                    if (getPower(item.code)) {
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
                                            case 'record': {
                                                let routeUrl = router.resolve({
                                                    name: 'projectChangeTakeInfo',
                                                    query: {
                                                        id: row.id,
                                                        projectId: route.query.id,
                                                        name: row.data_name,
                                                        time: row.create_time,
                                                        type: 'update',
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
                        projectChangeTake: {
                            isOperate: false,
                        }
                    })
                }
                return resultList
            },
        },
    ]
}
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
    },
    paginationOption: pagination,
    moduleColOptions: {
        search: {
            isShow: true,
            code: 'search',
            placeholder: '请输入操作人关键词',
            value: '',
        },
    },
})

const blukModuleOption = reactive({
    delete: {
        key: 'delete',
        code: 'order:del',
    },

})

const searchInputChange = (value: any, selectOptions: any) => {
    console.log('searchInputChange')
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

watchEffect(() => {
    if (order.isOperate == false) {
        config.tableOption.columns = config.tableOption.columns.filter((item) => {
            return item.key != 'operate';
        })
    }
})

const initEnd = async () => {
    await getData(); //获得列表数据
}

onMounted(() => {
    route.meta.bread[1].label = route.query.name;
})
</script>

<style>
.orderList .order-status {
    width: 58px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
}

.orderList .order-gray {
    background: #f2f2f2;
    color: #8c8c8c;
}

.orderList .order-blue {
    background: #e6f7ff;
    color: #1890ff;
}

.orderList .order-red {
    background: #fff1f0;
    color: #f5222d;
}

.orderList .order-green {
    background: #f6ffed;
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
