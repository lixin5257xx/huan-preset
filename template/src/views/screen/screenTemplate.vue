<template>
    <div class="screen">
        <wTable :config="config" @searchInputChange="searchInputChange"
                @searchInputEnter="searchInputEnter" @addClick="addScreen"
                @initEnd="initEnd"
        >
        </wTable>
        
        <bulkOperations
            v-model="config.tableOption.checkedRowKeys"
            :options="blukModuleOption"
            @deleteClickOk="deleteClickOk"
        />
    </div>
</template>

<script setup lang="ts">
import {reactive, ref, h, onMounted, RendererElement, RendererNode, VNode, Ref, watchEffect} from 'vue';
import { GetTempListApi,TempListDeleteApi } from '@api'

import {  NButton, NIcon } from 'naive-ui'
import wTable from '@/components/table/index.vue'
import { useRoute, useRouter } from 'vue-router'
import useStore from "@/config/pinia";
import { DataUsageEdit24Regular } from '@vicons/fluent'
const checkedRowKeysRef = ref([])
const route = useRoute()
const router = useRouter()
const { getPower,screenTemplate,$patch,CustomAdd } = useStore();

$patch({
  screenTemplate:{
    isOperate:true,
  }
})
function createCols() {
    return [
        {
            type: 'selection',
            width: 40,
        },
        {
            title: '名称',
            key: 'name',
            width: 250,
            ellipsis: true,
        },
        {
            title: '创建日期',
            key: 'create_time',
            width: 150,
            ellipsis: true,
        },
        {
            title: '创建人',
            key: 'create_user',
            width: 150,
            ellipsis: true,
        },
        {
            title: '修改日期',
            key: 'update_time',
            width: 150,
            ellipsis: true,
        },
        {
            title: '操作人',
            key: 'update_user',
            width: 150,
            ellipsis: true,
        },
        {
            title: '操作',
            key: 'operate',
            width: 140,
            fixed: "right",
            align: "left",
            render: (row: any) => {
                let moduleMap = [
                    {
                        name: 'update',
                        label: '编辑',
                        component: DataUsageEdit24Regular,
                        code:['click-template:update','click-template:info']
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

                                            case 'update': {
                                                let routeUrl = router.resolve({
                                                    name: 'temPaddOrUpdate',
                                                    query: {
                                                        id: row.id,
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
                    screenTemplate:{
                      isOperate:false,
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
        CustomAdd({info:{pageSize},key:"screenTemplate"});
        resetPaginationPage();
        getData();
    },
    onUpdatePage: (page: number) => {
        pagination.page = page;
        getData()
    },
})
/**
 * 重置分页
 */
const resetPaginationPage = () => {
    config.tableOption.pagination.page = 1;
    config.paginationOption.page = 1;
}

const config = reactive({
    pageId:'screenTemplate',
    tableOption: {
        data: [],
        columns: columns,
        singleColumn: false,
        pagination: pagination,
        checkedRowKeys: [],
        bordered: false,
        size: 'small',
        isAffixSeach: true,
        isAffixTableHeader: true,
        remote: true,
        isSecTableHead: true,
        loading: true,
        expandedRowKeys: <any>[],
        rowClassName: (rowData: { hasOwnProperty: (arg0: string) => any; }) => {
            return rowData.hasOwnProperty('children_node') ? 'children-tr' : '';
        }
    },
    paginationOption: pagination,
    moduleColOptions: {
        search: {
            isShow: true,
            code: 'search',
            placeholder: '请输入关键词',
            value: '',
        },
        add: {
            isShow: true,
            code: 'click-template:save',
            title: ' 新建模板',
        },
    }
})
/**
 * 初始化请求列表数据
 */
const getData = (selectOptions?: undefined) => {
    config.tableOption.loading = true;
    config.tableOption.data = [];
    let pageOption = config.paginationOption;
    const options = {
        "name": config.moduleColOptions.search.value,
        "page": pageOption.page,
        "size": pageOption.pageSize,
    }
    GetTempListApi(options).then(res => {
        config.tableOption.loading = false;
        if (res.code == 200) {
            config.tableOption.pagination['itemCount'] = res.data.total;
            config.paginationOption['itemCount'] = res.data.total;
            config.tableOption.checkedRowKeys = [];
            let pageCount = (Math.ceil(config.paginationOption['itemCount'] / config.paginationOption.pageSize));
            if (config.tableOption.pagination.page > pageCount) {
                config.paginationOption.page = pageCount;
                config.tableOption.pagination.page = pageCount;
                getData();
                return;
            }
            if (res.data['items']) {
                config.tableOption.data = res.data.items.map((item: { key: any; id: any; name:string;create_time:string;create_user:string; update_time:string; update_user:string; }, index: any) => {
                    return{
                        "id": item.id,
                        "name": item.name,
                        "create_time": item.create_time ? item.create_time : `暂无`,
                        "create_user":item.create_user ? item.create_user : `暂无`,
                        "update_time":item.update_time ? item.update_time : `暂无`,
                        "update_user": item.update_user ? item.update_user : `暂无`,
                        "key":item.id
                    }
                })
            }
        }
    })
}
const blukModuleOption = reactive({
    delete: {
        key: 'delete',
        code: 'click-template:delete_batch',
    },
})

const searchInputChange = (value: any, selectOptions: any) => {
    resetPaginationPage();
    getData();
}
const searchInputEnter = (value: any, selectOptions: any) => {
    resetPaginationPage();
    getData();
}

/**
 * 执行批量删除操作 delete
 * @param data
 */
const deleteClickOk = (data:any) => {
    // ids是后端参数
    let params: any = {
        ids : [],
    };
    // 把选中的key加入删除id队列
    data.forEach((item: any) => {
        params.ids.push(Number(item));
    })
    TempListDeleteApi(params).then(res => {
        if (res.code == 200) {
            window.$notification['success']({
                content: "成功提示",
                meta: `录屏模板删除成功！`,
                duration: 3000
            });
            getData();
        }
    })
}
const addScreen = () => {
    let routeUrl = router.resolve({
        path: "/screenTemplate/addOrUpdateTemp",
    });
    window.open(routeUrl.href, '_blank');
}
const initEnd = () => {
    getData();
}

watchEffect(() => {
  if(!screenTemplate.isOperate){
    config.tableOption.columns = config.tableOption.columns.filter(item=>{
      return  item.key != 'operate'
    })
  }
})
</script>

<style scoped>
</style>
