<template>
  <div class="resize-table-header-demo">
    <wTable
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
    </wTable>
  </div>
</template>

<script setup lang="ts">
import wTable from '@/components/table/index.vue'
import {useRoute,useRouter} from 'vue-router'
import {reactive, ref, h } from 'vue';
import { NSwitch } from 'naive-ui'
const checkedRowKeysRef = ref([])
const route = useRoute()
const router = useRouter()
let active = ref(false);
function createCols () {
  return [
    {
      type: 'selection',
      fixed: "left",
      width:40,
    },
    {
      title: '开启/关闭',
      key: 'switch',
      fixed: "left",
      width:380,
      render(){
        return h(
            NSwitch,
            {
              modelValue:active,
            },
            {  }
        )
      },
      resize:true, //如果想使用拖拽必须设置key
    },
    {
      title: '名字',
      key: 'name',
      ellipsis:true,
      width:200,
      resize:true,
    },
    {
      title: '描述',
      key: 'physicsAttack',
      ellipsis:true,
      width:200,
      resize:true,
    },
    {
      title: '别名',
      key: 'magicAttack',
      ellipsis:true,
      width:200,
      resize:true,
    },
    {
      title: '时间',
      key: 'defend',
      ellipsis:true,
      width:200,
      resize:true,
    },
    {
      title: '操作',
      key: 'speed',
      ellipsis:true,
      width:200,
      fixed:'right',
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
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
  onUpdatePage: (page) => {
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
    data:data,
    columns:columns,
    singleLine:true,
    pagination:pagination,
    checkedRowKeys:[],
    bordered: false,
    size: 'small',
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

const addScreen = ()=>{
  console.log('增加录屏')
  router.push('/screen/addOrUpdate')
}

</script>

<style scoped>
.resize-table-header-demo{
}
</style>