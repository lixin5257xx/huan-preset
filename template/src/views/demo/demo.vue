<template>
  <div class="screen">
<!--    <wTable
        :config="config"
        @customClickOk="customClickOk"
        @customClickCancel="customClickCancel"
        @filterClickOK="filterClickOK"
        @filterClickCancel="filterClickCancel"
        @downClick="downClick"
        @refreshClick="refreshClick"
        @searchTagChange="searchTagChange"
        @searchClearClick="searchClearClick"
        @searchTagClose="searchTagClose"
        @searchInputChange="searchInputChange"
        @addClick="addScreen">
    </wTable>-->
    <bulkOperations
        v-model="config.tableOption.checkedRowKeys"
        :options="blukModuleOption"
        @deleteClickOk="deleteClickOk"
        @closeClick="closeClick"
    />
    <cascadePanel  :data="menuIdList" v-model="menu_id_list"
              placeholder="请输入权限名称" :cascaderOption="cascaderOption"/>
  </div>
</template>

<script setup lang="ts">
import wTable from '@/components/table/index.vue'
import {useRoute,useRouter} from 'vue-router'
import bulkOperations from '@/components/bulk-operations/index.vue'
import cascadePanel from '@/components/cascade-panel/index.vue'
import {reactive, ref, h , onMounted } from 'vue';
import { NSwitch } from 'naive-ui'
import {getMenuIdListApi} from "@api";
const checkedRowKeysRef = ref([])
const route = useRoute()
const router = useRouter()
let active = ref(false);
let menu_id_list = ref([]);
let menuIdList = ref([]);
let flatList = ref([]);

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

// 树形化角色列表
const updateFlatList = (menuIdList: any[]) => {
  menuIdList.forEach((item: any) => {
    if (!item[cascaderOption.childrenKey]) {
      flatList.value.push(item)
      return
    }
    updateFlatList(item[cascaderOption.childrenKey])
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



function createCols () {
  return [
    {
      type: 'selection',
      options: [
        'all',
        'none',
        {
          label: '选中前 2 行',
          key: 'f2',
          onSelect: (pageData) => {
            checkedRowKeysRef.value = pageData
                .map((row) => row.key)
                .slice(0, 2)
          }
        }
      ],
      disabled (row) {
        return row.name === 'Edward King 3'
      },
    },
    {
      title: '开启/关闭',
      key: 'switch',
      render(){
        return h(
            NSwitch,
            {
              modelValue:active,
            },
            {  }
        )
      },
    },
    {
      title: 'Name',
      key: 'name',
      ellipsis:true,
    },
    {
      title: 'physicsAttack',
      key: 'physicsAttack',
      ellipsis:true,
    },
    {
      title: 'magicAttack',
      key: 'magicAttack',
      ellipsis:true,
    },
    {
      title: 'defend',
      key: 'defend',
      ellipsis:true,
    },
    {
      title: 'speed',
      key: 'speed',
      ellipsis:true,
    }
  ]
}
function createData () {
  return Array.apply(null, { length: 50 }).map((_, i) => {
    return {
      key: i,
      name: `name_${i}`,
      physicsAttack: `哈哈哈${i}`,
      magicAttack: `magicAttack_${i}`,
      defend: `defend_${i}`,
      speed: `speed_${i}`,
    }
  })
}
const data = ref(createData());
const columns= ref(createCols());
const pagination= reactive({
  page:1,
  pageSize: 10,
  showQuickJumper:true,
  pageSizes:[10, 20, 30, 40],
  itemCount:data.value.length,
  showSizePicker:true,
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
  onUpdatePage: (page: number) => {
    pagination.page = page
  },
})
const selectData=[
  {
    label: "不限",
    value: 'song0',
  },
  {
    label: '很多',
    value: 'song1'
  },
  {
    label: '很多多',
    value: 'song2'
  },
]
const config = reactive({
  tableOption:{
    "data":data,
    'columns':columns,
    'single-line':false,
    pagination:pagination,
    checkedRowKeys:[],
  },
  paginationOption:pagination,
  moduleColOptions:{
    search:{
      isShow:true,
      code:"search",
      placeholder:'推广id或者用户名',
      value:'',
    },
    down:{
      isShow:true,
      code:"down",
    },
    filter:{
      isShow:true,
      code:"filter",
    },
    custom:{
      isShow:true,
      code:'custom',
    },
    add:{
      isShow:true,
      code:"add",
    }
  },
  selectOptions:[
    {
      options:{
        label:'计划',
        value:'',
        type:"text",
        placeholder:"计划ID或者关键字",
      },
      defaultValue:{
        value: '',
      },
    },
    {
      options:{
        label:'推广id',
        value:'song0',
        type:"select",
        options:selectData,
        placeholder:"请选择推广id",
      },
      defaultValue:{
        label: "不限",
        value: 'song0',
      },
    },
    {
      options:{
        label:'订单时间',
        value:null,
        type:"datetime",
        placeholder:"请选择订单时间",
      },
      defaultValue:{
        value: null,
      },
    },
    {
      options:{
        label:'创意名称',
        value:'',
        type:"text",
        placeholder:"创意ID或者关键字",
      },
      defaultValue:{
        value: '',
      },
    },
  ],
})
const blukData = ref([23,33]);
const blukModuleOption = reactive({
  delete:{
    key:'delete',
    code:'delete',
  }
})

/**
 * 自定义列选择完成
 */
const customClickOk = (status) => {
  console.log("自定义列选择完成",status);
}
/**
 * tag 发生修改后
 */
const searchTagChange = (item,selectOptions) => {
  console.log("搜索tag发生改变后",item, selectOptions);
}
/**
 * 清空
 * @param selectOptions
 */
const searchClearClick = (selectOptions) => {
  console.log("清空",selectOptions);
}
/**
 * tag 某一个的清空回调
 * @param selectOptions
 */
const searchTagClose = (selectOptions) => {
  console.log("tag单个关闭",selectOptions);
}
const customClickCancel = (option) => {
  console.log("自定义列点击关闭",option);
}
const filterClickOK = (selectOptions) => {
  console.log("筛选点击确认",selectOptions);
}
const filterClickCancel = (selectOptions) => {
  console.log("筛选点击关闭",selectOptions);
}
const downClick = () => {
  console.log("点击下载");
}
const refreshClick = () => {
  console.log("点击刷新");
}
const searchInputChange = (value,selectOptions) => {
  console.log("搜索后执行",value,selectOptions);
}

/**
 * 执行批量删除操作 delete
 * @param data
 */
const deleteClickOk = (data) => {
  console.log("执行批量删除",data);
}
/**
 * 关闭批量模块 close
 * @param data
 */
const closeClick = (data) => {
  console.log("关闭批量模块",data);
}

const addScreen = ()=>{
  console.log('增加录屏')
  router.push('/screen/addOrUpdate')
}

onMounted(()=>{
  getMenuIdList()
})

</script>

<style scoped>
.screen{
}
</style>