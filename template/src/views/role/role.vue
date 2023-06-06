<script setup lang="ts">
import {reactive, ref, h, onMounted, RendererElement, RendererNode, VNode, Ref, watchEffect} from 'vue';
import { NSwitch, NButton, NIcon, NCheckbox, NTooltip ,useDialog} from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { DataUsageEdit24Regular } from '@vicons/fluent'
import { GroupAddOutlined } from '@vicons/material'
import _ from 'lodash'
import { getRolesApi, deleteRolesApi} from '@api'
import useState from '@/config/pinia';

import wTable from '@/components/table/index.vue'
import bulkOperations from '@/components/bulk-operations/index.vue'

const route = useRoute()
const router = useRouter()
const dialog = useDialog();
const { getPower,role,$patch,CustomAdd } = useState();

$patch({
  role:{
    isOperate:true,
  }
})

/**
 * 字段名 ok
 */
function createCols() {
  return [
    {
      type: 'selection',
      fixed: "left",
      width: 40,
      align: "center",
    },
    {
      expandable: false,
      title: "名称",
      key: 'name',
      turnKey: 'name',
      ellipsis: {
        tooltip: true
      },
      width: 100,
      fixed: 'left',
      align: "left",
    },
    {
      title: 'ID',
      key: 'id',
      turnKey: 'id',
      ellipsis: true,
      width: 100,
      align: "left",
    },
    {
      title: '创建日期',
      key: 'create_time',
      turnKey: 'create_time',
      width: 150,
      align: "left",
    },
    {
      title: '账户统计',
      key: 'account',
      turnKey: 'account',
      width:150,
      ellipsis: {
        tooltip: true
      },
      align: "left",
    },
    {
      title: '操作',
      key: 'operate',
      width: 140,
      fixed: "right",
      align: "left",
      render: (row: any) => {
        let moduleMap = [
          { name: 'update', label: '编辑', component: DataUsageEdit24Regular, code:['role:update','role:info'] },
          { name: 'add', label: '添加账号', component: GroupAddOutlined, code:'user:save' },
        ]
        let resultList: VNode<RendererNode, RendererElement, { [key: string]: any; }>[] = [];
          moduleMap.forEach(item => {
            if(getPower(item.code)){
              resultList.push(
                  h(NButton, {
                    text: true,
                    tag: "a",
                    title: item.label,
                    style: {
                      fontSize: '18px',
                      marginRight: '20px',
                      verticalAlign: 'middle'
                    },
                    onClick: () => {
                      switch (item.name) {
                        case 'add': {
                          //添加账号操作
                          let routeUrl = router.resolve({
                            name: "addUser",
                            query: {
                              roleid: row.id,
                            }
                          });
                          window.open(routeUrl.href, '_blank');
                          break;
                        }
                        case 'update': {
                          // 编辑操作
                          let routeUrl = router.resolve({
                            name: "addRole",
                            query: {
                              id: row.id,
                              type:"update",
                            }
                          });
                          window.open(routeUrl.href, '_blank');
                          break;
                        }
                      }
                    }
                  }, {
                    default: () => h(NIcon, {
                    }, {
                      default: () => h(item.component)
                    })
                  })
              )
            }
        })
        if (resultList.length == 0) {
          $patch({
            role:{
              isOperate:false,
            }
          })
        }
        return resultList;
      }
    },
  ]
}
const columns = ref(createCols());
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showQuickJumper: true,
  pageSizes: [10, 20, 30, 40, 50, 100],
  showSizePicker: true,
  itemCount: 0,
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    CustomAdd({info:{pageSize},key:"role"});
    resetPaginationPage();
    getRoleData();
  },
  onUpdatePage: (page: number) => {
    pagination.page = page;
    getRoleData()
  },
})
const config: any = reactive({
  pageId:'role',
  tableOption: {
    data: [],
    columns: columns,
    singleColumn: false,
    pagination: pagination,
    checkedRowKeys: [],
    loading: true,
    bordered: false,
    size: 'small',
    isAffixSeach: true,
    isAffixTableHeader: true,
    remote: true,
    isSecTableHead: true,
    rowKey:(row: { id: any; }) => row.id
  },
  paginationOption: pagination,
  moduleColOptions: {
    search: {
      isShow: true,
      code: "queryParam",
      key: "queryParam",
      placeholder: '请输入ID或者关键词',
      value: '',
    },
    filter: {
      isShow: false,
      code: 'filter',
    },
    add: {
      isShow: true,
      code: "role:save",
      title: ' 新建角色'
    },
  },
})

const blukModuleOption = reactive({
  delete: {
    key: 'delete',
    code: 'role:del',
  }
})

/**
 * 初始化请求列表数据
 */
const getRoleData = () => {
  config.tableOption.loading = true;
  config.tableOption.data = [];
  let params = {};
  let pageOption = config.paginationOption;
  const options = {
    ...params,
    "queryParam": config.moduleColOptions.search.value,
    "page": pageOption.page,
    "size": pageOption.pageSize,
  }
  getRolesApi(options).then(res => {
    config.tableOption.loading = false;
    if (res.code == 200) {
      config.tableOption.data = res.data.items;
      config.tableOption.pagination['itemCount'] = res.data.total;
      config.paginationOption['itemCount'] = res.data.total;
      config.tableOption.checkedRowKeys = [];
      let pageCount = (Math.ceil(config.paginationOption['itemCount'] / config.paginationOption.pageSize));
      pageCount = pageCount == 0 ? 1 : pageCount;
      if (config.tableOption.pagination.page > pageCount) {
        config.paginationOption.page = pageCount;
        config.tableOption.pagination.page = pageCount;
        getRoleData();
        return;
      }
    }
  })
}
/**
 * 重置分页
 */
const resetPaginationPage = () => {
  config.tableOption.pagination.page = 1;
  config.paginationOption.page = 1;
}
/**
 * 筛选点击确认
 */
const searchInputChange = () => {
  resetPaginationPage();
  getRoleData();
}

const searchInputEnter = () => {
  resetPaginationPage();
  getRoleData();
}


/**
 * 执行批量删除操作 delete
 * @param data
 */
const deleteClickOk = (data: any[]) => {
  let ids: number[] = [];
  data.forEach((item: any) => {
      ids.push(Number(item));
  })
  deleteRolesApi(ids).then(res => {
    if (res.code == 200) {
      window.$notification['success']({
        content: "成功提示",
        meta: `角色删除成功！`,
        duration: 3000
      });
      getRoleData();
    }
  })
}
// 新建角色操作
const addRole = () => {
  let routeUrl = router.resolve({
    path: "/role/addRole",
  });
  window.open(routeUrl.href, '_blank');
}

const initEnd = () => {
  getRoleData();
}

watchEffect(() => {
  if(!role.isOperate){
    config.tableOption.columns = config.tableOption.columns.filter(item=>{
      return  item.key != 'operate'
    })
  }
})
</script>

<template>
  <div>
    <wTable
        :config="config"
        @searchInputChange="searchInputChange"
        @searchInputEnter="searchInputEnter"
        @addClick="addRole"
        @initEnd="initEnd"
    ></wTable>
    <bulkOperations
        v-model="config.tableOption.checkedRowKeys"
        :options="blukModuleOption"
        @deleteClickOk="deleteClickOk"
    />
  </div>
</template>

<style scoped>
</style>
