<script setup lang="ts">
import {reactive, ref, h, onMounted, RendererElement, RendererNode, VNode, Ref, watchEffect} from 'vue';
import { NSwitch, NButton, NIcon, NCheckbox, NTooltip ,useDialog} from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import { DataUsageEdit24Regular, PeopleSwap16Regular } from '@vicons/fluent'
import { Reset } from '@vicons/carbon'
import useState from '@/config/pinia'
import {
  regionList,
  rankList,
  rankMap,
  regionMap,
  powerList,
  progList,
} from '../constant/user'
import _ from 'lodash'
import { getUserListApi, updateUsersStatusApi, deleteUsersApi, getRoleListApi, resetPassApi} from '@api'

import wTable from '@/components/table/index.vue'
import bulkOperations from '@/components/bulk-operations/index.vue'

const route = useRoute()
const router = useRouter()
const dialog = useDialog();
const { getPower,user,$patch,CustomAdd } = useState();

$patch({
  user:{
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
      title: '销售区域',
      key: 'region',
      turnKey: 'region',
      ellipsis: {
        tooltip: true
      },
      render: (row: any) => {
        return h('span', {}, {
          default: () =>  row.region != null ? row.region : '不限'
        })
      },
      width: 150,
      align: "left",
    },
    {
      title: '职级',
      key: 'rank',
      turnKey: 'rank',
      ellipsis: true,
      align: "left",
      width: 150,
      render: (row: any) => {
        return h('span', {}, {
          default: () =>  row.rank  ? rankMap[row.rank] : '无'
        })
      },
    },
    {
      title: '角色',
      key: 'role_name',
      turnKey: 'role_name',
      width:150,
      ellipsis: {
        tooltip: true
      },
      align: "left",
    },
    {
      title: '状态',
      key: 'status',
      turnKey: 'status',
      ellipsis: {
        tooltip: true
      },
      width: 150,
      align: "left",
      render: (row: any) => {
        return h('span', {}, {
          default: () => row.status == 1 ? '激活' : '冻结'
        })
      },
    },
    {
      title: '操作',
      key: 'operate',
      width: 140,
      fixed: "right",
      align: "left",
      render: (row: any) => {
        let moduleMap = [
          { name: 'update', label: '编辑', component: DataUsageEdit24Regular ,code:['user:update','user:info']},
          { name: 'reset', label: '重置密码', component: Reset ,code:'user:resetPassword'},
          // { name: 'handover', label: '交接', component: PeopleSwap16Regular }
        ]
        let resultList: VNode<RendererNode, RendererElement, { [key: string]: any; }>[] = [];
        moduleMap.forEach(item => {
          if (getPower(item.code)) {
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
                      case 'reset': {
                        //重置操作
                        dialog.warning({
                          title: '提示',
                          content: `确认重置【${row.name}】账号密码吗?`,
                          positiveText: '确定',
                          negativeText: '取消',
                          onPositiveClick: () => {
                            resetUserPass(row.id)
                          },
                        })
                        break;
                      }
                      case 'update': {
                        let routeUrl = router.resolve({
                          name: "addUser",
                          query: {
                            id: row.id,
                            type: "update",
                          }
                        });
                        window.open(routeUrl.href, '_blank');
                        break;
                      }
                      case 'handover': {
                        //交接操作
                        dialog.warning({
                          title: '提示',
                          content: `确认重录【${row.task_name}】吗?`,
                          positiveText: '确定',
                          negativeText: '取消',
                          onPositiveClick: () => {
                            // updateRemake(row);
                          },
                        })
                        break;
                      }
                    }
                  }
                }, {
                  default: () => h(NIcon, {}, {
                    default: () => h(item.component)
                  })
                })
            )
          }
        })
        if (resultList.length == 0) {
          $patch({
            user:{
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
    CustomAdd({info:{pageSize},key:"user"});
    resetPaginationPage();
    getUserData();
  },
  onUpdatePage: (page: number) => {
    pagination.page = page;
    getUserData()
  },
})
const config: any = reactive({
  pageId:"user",
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
    rowKey:(row: { id: any; }) => row.id
  },
  paginationOption: pagination,
  moduleColOptions: {
    search: {
      isShow: true,
      code: "search",
      key: "queryParam",
      placeholder: '请输入ID或者关键词',
      value: '',
    },
    filter: {
      isShow: true,
      code: 'filter',
    },
    add: {
      isShow: true,
      code: "user:save",
      title: ' 新建账户'
    },
  },
  selectOptions: {
    roleId: {
      options: {
        label: '角色',
        key: 'roleId',
        value: -1,
        type: "select",
        options: [],
        placeholder: "请选择",
      },
      defaultValue: {
        label: '不限',
        value: -1,
      },
    },
    email: {
      options: {
        label: '电子邮箱',
        key: 'email',
        value: '',
        type: "text",
        placeholder: "请输入关键词",
      },
      defaultValue: {
        value: '',
      },
    },
    phone:{
      options:{
        label:'手机',
        key:'phone',
        value:'',
        type:"text",
        placeholder:"请输入关键词",
      },
      defaultValue:{
        value: '',
      },
    },
    regionId: {
      options: {
        label: '销售区域',
        key: 'regionId',
        value: -1,
        type: "select",
        options: _.cloneDeep(regionList),
        placeholder: "请选择",
      },
      defaultValue: {
        label: '不限',
        value: -1,
      },
    },
    rank: {
      options: {
        label: '职级',
        key: 'rank',
        value: -1,
        type: "select",
        options: _.cloneDeep(rankList),
        placeholder: "请选择",
      },
      defaultValue: {
        label: '不限',
        value: -1,
      },
    },
    autoFlag: {
      options: {
        label: '程序化',
        key: 'autoFlag',
        value: -1,
        type: "select",
        options: _.cloneDeep(progList),
        placeholder: "请选择",
      },
      defaultValue: {
        label: '不限',
        value: -1,
      },
    },
   /* power: {
      options: {
        label: '审核权限',
        key: 'power',
        value: -1,
        type: "select",
        options: _.cloneDeep(powerList),
        placeholder: "请选择",
      },
      defaultValue: {
        label: '不限',
        value: -1,
      },
    },
   */
  },
})

const blukModuleOption = reactive({
  delete: {
    key: 'delete',
    code: 'user:del',
  },
  frozen:{
    key:'frozen',
    code:'user:updateStatus'
  },
  activation:{
    key:'activation',
    code:'user:updateStatus'
  }
})

/**
 * 初始化请求列表数据
 */
const getUserData = () => {
  config.tableOption.loading = true;
  config.tableOption.data = [];
  let params = {};
  for (const key in config.selectOptions) {
    params[key] = config.selectOptions[key].options.value  == -1 ? null :  config.selectOptions[key].options.value;
  }
  let pageOption = config.paginationOption;
  const options = {
    ...params,
    "queryParam": config.moduleColOptions.search.value,
    "page": pageOption.page,
    "size": pageOption.pageSize,
  }
  getUserListApi(options).then(res => {
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
        getUserData();
        return;
      }
    }
  })
}
/**
 * 获取角色list
 */
const getRoleListData = () => {
  getRoleListApi().then(res => {
    config.selectOptions.roleId.options.options = res.data.map((item: { label: string; id: number; }) => {
      return {
        label:item.name,
        value:item.id,
      };
    });
    config.selectOptions.roleId.options.options.unshift(config.selectOptions.roleId.defaultValue)
  })
}
/**
 * 重置请求
 */
const resetUserPass = (id) => {
  resetPassApi({ id }).then(res => {
    if (res.code == 200) {
      window.$notification['success']({
        content: "成功提示",
        meta: "重置密码成功，请前往邮箱查看！",
        duration: 3000
      });
    }
  })
}
/**
 *  激活 or 冻结
 *
 */
const updateUsersStatus = (ids , status ) => {
  updateUsersStatusApi({ ids,status }).then(res => {
    let message = status == 1 ? '帐号启动成功！' : '帐号冻结成功！';
    if (res.code == 200) {
      window.$notification['success']({
        content: "成功提示",
        meta: message,
        duration: 3000
      });
      getUserData();
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
 * tag 发生修改后
 */
const searchTagChange = (item: any, selectOptions: any) => {
  resetPaginationPage();
  getUserData();
}
/**
 * 清空
 * @param selectOptions
 */
const searchClearClick = (selectOptions: any) => {
  resetPaginationPage();
  getUserData();
}
/**
 * tag 某一个的清空回调
 * @param selectOptions
 */
const searchTagClose = () => {
  resetPaginationPage();
  getUserData();
}
/**
 * 筛选点击确认
 */
const filterClickOK = () => {
  resetPaginationPage();
  getUserData();
}
const filterClickCancel = (selectOptions: any) => {
  // getUserData();
}
const searchInputChange = (value: any, selectOptions: any) => {
  resetPaginationPage();
  getUserData();
}

const searchInputEnter = (value: any, selectOptions: any) => {
  resetPaginationPage();
  getUserData();
}


/**
 * 执行批量删除操作 delete
 * @param data
 */
const deleteClickOk = (data: any[]) => {
  let ids:number [] = data;
  deleteUsersApi(ids).then(res => {
    if (res.code == 200) {
      window.$notification['success']({
        content: "成功提示",
        meta: `账号删除成功！`,
        duration: 3000
      });
      getUserData();
    }
  })
}
/**
 * 批量冻结 frozenClickOk
 * @param data
 */
const frozenClickOk = (data: any[]) => {
      let ids:number [] = data;
      updateUsersStatus(ids,2);
}
/**
 * 批量激活 activationClickOk
 * @param data
 */
const activationClickOk = (data: any[]) => {
  let ids:number [] = data;
  updateUsersStatus(ids,1);
}
const addUser = () => {
  let routeUrl = router.resolve({
    path: "/user/addUser",
  });
  window.open(routeUrl.href, '_blank');
}

onMounted(() => {
  getRoleListData();
})

const initEnd = () => {
  getUserData();
}

watchEffect(() => {
  if(!user.isOperate){
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
        @filterClickOK="filterClickOK"
        @filterClickCancel="filterClickCancel"
        @searchTagChange="searchTagChange"
        @searchClearClick="searchClearClick"
        @searchTagClose="searchTagClose"
        @searchInputChange="searchInputChange"
        @searchInputEnter="searchInputEnter"
        @addClick="addUser"
        @initEnd="initEnd"
    ></wTable>
    <bulkOperations
        v-model="config.tableOption.checkedRowKeys"
        :options="blukModuleOption"
        @deleteClickOk="deleteClickOk"
        @frozenClickOk="frozenClickOk"
        @activationClickOk="activationClickOk"
    />
  </div>
</template>

<style scoped>
</style>
