<template>
    <div class="screen">
        <wTable
            :config="config"
            @filterClickOK="filterClickOK"
            @filterClickCancel="filterClickCancel"
            @searchTagChange="searchTagChange"
            @searchClearClick="searchClearClick"
            @searchTagClose="searchTagClose"
            @searchInputChange="searchInputChange"
            @searchInputEnter="searchInputEnter"
            @addClick="addScreen"
            @initEnd="initEnd"
        >
        </wTable>
        <bulkOperations
            v-model="config.tableOption.checkedRowKeys"
            :options="blukModuleOption"
            @deleteClickOk="deleteClickOk"
            @fastClickOk="fastClickOk"
            @recordClickOk="recordClickOk"
        />
        <n-modal v-model:show="isPreview">
            <n-card
                style="width: 800px"
                :title="perviewActive.modalTitle"
                :bordered="false"
                size="small"
                role="dialog"
                aria-modal="true"
            >
                <template #header-extra>
                    <n-button @click="closeModal()" text size="large" strong secondary circle>关闭</n-button>
                </template>
                <div class="preview-title">
                    <ul class="preview-title-ul">
                        <li v-for="item in perviewActive.title">{{ item }}</li>
                    </ul>
                    <span
                        class="preview-title-span"
                    >{{ (perviewActive.currentIndex + 1) }}/{{ materialsList.length }}</span>
                </div>
                <div class="perview-box">
                    <div class="perview-show">
                        <video
                            class="perview-materials"
                            controls
                            v-if="perviewActive.active?.type == 1"
                            :src="perviewActive.active?.material_path"
                        />
                        <img
                            v-else
                            class="perview-materials"
                            :src="perviewActive.active.material_path"
                        />
                    </div>
                    <div class="perview-list">
                        <ul class="perview-list-ul">
                            <li
                                v-for="(item, index) in materialsList"
                                :class="perviewActive.currentIndex == index ? 'active-item' : 'unactive-item'"
                            >
                                <img
                                    @click="perviewActiveClick(item, index)"
                                    class="perview-img"
                                    :src="item.thumbnail"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </n-card>
        </n-modal>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref, h, onMounted, RendererElement, RendererNode, VNode, Ref, watchEffect} from 'vue';
import { NSwitch, NButton, NIcon, NCheckbox, NTooltip ,useDialog} from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import useStore from "@/config/pinia";
import { DataUsageEdit24Regular, VideoSwitch24Regular, Info16Regular } from '@vicons/fluent'
import { ContentCopyOutlined } from '@vicons/material'
import { Download, Eye } from '@vicons/tabler'
import {
  showStyle,
  screenShot,
  farNear,
  screenStatus,
  brands,
  timeVerification,
  showStyleMap,
  timeVerificationMap,
  screenStatusMap,
  brandsMap,
  baiduFlagMap,
  real_time_flag,
  fast_flag_map
} from '../constant/screen'
import _ from 'lodash'
import { recordScreenPageApi, recordScreenPreviewApi, recordScreenRemakeApi, recordScreenDeleteApi, GetSysDictApi, recordScreenFastFlagApi} from '@api'

import { downLoadFile } from '@utils'

import wTable from '@/components/table/index.vue'
import bulkOperations from '@/components/bulk-operations/index.vue'


const route = useRoute()
const router = useRouter()
const dialog = useDialog();
const { getPower,CustomAdd } = useStore();

let checkedRowKeysRef = ref([])
let active = ref(false);
let isPreview = ref(false);
let materialsList: Ref<any> = ref([]);
let perviewActive = reactive({
    title: [],
    currentIndex: 0,
    active: <any>{},
    modalTitle: "",
});

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
            key: 'task_name',
            turnKey: 'task_name',
            ellipsis: {
              tooltip: true
            },
            width: 340,
            fixed: 'left',
            align: "left",
            children: [
                {
                    title: '子任务名称',
                    key: 'task_name',
                    turnKey: 'name',
                    ellipsis: {
                      tooltip: true
                    },
                    width: 340,
                    fixed: 'left',
                },
            ]
        },
        {
            title: 'ID',
            key: 'id',
            turnKey: 'id',
            ellipsis: true,
            width: 100,
            align: "left",
            children: [
                {
                    title: '子任务id',
                    key: 'id',
                    turnKey: 'id',
                    ellipsis: true,
                    width: 100,
                    align: "left",
                }
            ]
        },
        {
            title: '品牌',
            key: 'brands',
            turnKey: 'brands',
            ellipsis: {
                tooltip: true
            },
            width: 150,
            align: "left",
            children: [
                {
                    title: '品牌',
                    key: 'brands',
                    turnKey: 'brand',
                    width: 150,
                    ellipsis: {
                        tooltip: true
                    },
                    align: "left",
                }
            ]
        },
        /*  {
            title: '项目',
            key: 'project',
            turnKey: 'project',
            ellipsis: {
                  tooltip: true
            },
            width:200,
            align:"left",
            children:[
              {
                title: '设备标识',
                key: 'project',
                turnKey: 'device_id',
                 ellipsis: {
                  tooltip: true
                },
                width:200,
                align:"left",
              }
            ]
          },
          {
            title: '订单',
            key: 'order_form',
            turnKey: 'order_form',
             ellipsis: {
                  tooltip: true
            },
            width:200,
            align:"left",
            children:[
              {
                title: '子任务录屏时间',
                key: 'order_form',
                turnKey: 'real_time',
                 ellipsis: {
                  tooltip: true
                },
                width:200,
                align:"left",
              }
            ]
          },*/
        {
            title: '展示场景',
            key: 'ad_type',
            turnKey: 'ad_type',
            ellipsis: {
                tooltip: true
            },
            width: 220,
            align: "left",
            children: [
                {
                    title: '设备标识',
                    key: 'ad_type',
                    turnKey: 'device_id',
                    ellipsis: {
                        tooltip: true
                    },
                    width: 220,
                    align: "left",
                },
            ]
        },
        {
            title: '录屏时间',
            key: 'task_record_time',
            turnKey: 'task_record_time',
            ellipsis: {
                tooltip: true
            },
            width: 400,
            align: "left",
            children: [
                {
                    title: '子任务录屏时间',
                    key: 'task_record_time',
                    turnKey: 'real_time',
                    ellipsis: {
                        tooltip: true
                    },
                    width: 200,
                    align: "left",
                },
                {
                    title: '时间校验',
                    key: 'baidu_flag',
                    turnKey: 'baidu_flag',
                    ellipsis: {
                        tooltip: true
                    },
                    width: 100,
                    align: "left",
                },
                {
                title: '状态',
                key: 'status_map',
                turnKey: 'status',
                ellipsis: {
                  tooltip: true
                },
                width: 100,
                align: "left",
                render: (row: any) => {
                  let statusMap: any = {
                    "准备录制": 'grey-status',
                    "录制中": 'blue-status',
                    "录制成功": 'green-status',
                    "录制失败": 'red-status flex_middle',
                  }
                  return h('p', {
                    class: statusMap[row?.status_map],
                  }, {
                    default: () => {
                      if (["录制失败"].includes(row?.status_map)) {
                        return [h('span', {}, { default: () => row?.status_map }),
                          h(NTooltip, {}, {
                            default: () => row?.failure_reason,
                            trigger: () => {
                              return h(NIcon, { size: "18", style: { verticalAlign: "text-bottom" } }, {
                                default: () => { return h(Info16Regular, {}, {}) }
                              })
                            }
                          })];
                      }
                      return row?.status_map
                    }

                  })
                }
              }
            ]
        },
        {
            title: '状态',
            key: 'status_map',
            turnKey: 'status_map',
            ellipsis: {
                tooltip: false
            },
            width: 300,
            align: "left",
            render: (row: any) => {
                if (!row.hasOwnProperty('children_node')) {
                    return h(NTooltip, { trigger: "hover" }, {
                        default: () => `准备录制：${row.prepare_tasks_num} | 录制中：${row.recording_tasks_num} | 录制成功：${row.success_tasks_num} | 录制失败：${row.fail_tasks_num}  `,
                        trigger: () => {
                            return h('span', {}, {
                                default: () => {
                                    return [
                                        h('span', { style: { marginRight: '4px' } }, { default: () => `总任务数:${row.total_tasks_num}个` }),
                                        h('p', { class: 'grey-status status-text' }, { default: () => `${row.prepare_tasks_num}` }),
                                        h('span', {}, { default: () => `/` }),
                                        h('p', { class: 'blue-status status-text' }, { default: () => `${row.recording_tasks_num}` }),
                                        h('span', {}, { default: () => `/` }),
                                        h('p', { class: 'green-status status-text' }, { default: () => `${row.success_tasks_num}` }),
                                        h('span', {}, { default: () => `/` }),
                                        h('p', { class: 'red-status status-text' }, { default: () => `${row.fail_tasks_num}` }),
                                    ]
                                }
                            })

                        }
                    })
                }
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
                    { name: 'update', label: '编辑', component: DataUsageEdit24Regular, isFather: true, isChild: false, code:['record-screen:update','record-screen:getId'] },
                    { name: 'preview', label: '预览', component: Eye, isFather: false, isChild: (true && ['录制成功'].includes(row?.status_map)), code:'record-screen:preview' },
                    { name: 'down', label: '下载', component: Download, isFather: true, isChild: true,code:'record-screen:down' },
                    { name: 'copy', label: '复制', component: ContentCopyOutlined, isFather: true, isChild: false,code:'record-screen:copy'},
                    { name: 'record', label: '重录', component: VideoSwitch24Regular, isFather: false, isChild: (true && ['录制成功', '录制失败'].includes(row?.status_map)),code: 'record-screen:remake' },
                ]
                let resultList: VNode<RendererNode, RendererElement, { [key: string]: any; }>[] = [];
                moduleMap.forEach(item => {
                    if (((row.hasOwnProperty('children_node') && item.isChild) || (!row.hasOwnProperty('children_node') && item.isFather)) && getPower(item.code)) {
                      if(item.name == 'down' && !row.file_path  && row.hasOwnProperty('children_node')){
                        return ;
                      }
                      if(item.name == 'down' &&  row.hasOwnProperty('status_map') && row.status_map != '录制成功'){
                        return ;
                      }
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
                                        case 'preview': {
                                            getPerviewData(row.id);
                                            break;
                                        }
                                        case 'update': {
                                            let routeUrl = router.resolve({
                                                name: "screenAddOrUpdate",
                                                query: {
                                                    id: row.id,
                                                    type:"update",
                                                }
                                            });
                                            window.open(routeUrl.href, '_blank');
                                            break;
                                        }
                                        case 'down': {
                                            if (row.file_path) {
                                                downLoadFile(row.file_path)
                                            } else {
                                                window.$notification['error']({
                                                    content: "错误提示",
                                                    meta: `录屏 ${row.task_name} 没有执行完毕，暂时不能下载，请稍候重试！`,
                                                    duration: 3000
                                                });
                                            }
                                            break;
                                        }
                                        case 'record': {
                                          dialog.warning({
                                            title: '提示',
                                            content: `确认重录【${row.task_name}】吗?`,
                                            positiveText: '确定',
                                            negativeText: '取消',
                                            onPositiveClick: () => {
                                              updateRemake(row);
                                            },
                                          })
                                          break;
                                        }
                                        case 'copy': {
                                          let routeUrl = router.resolve({
                                            name: "screenAddOrUpdate",
                                            query: {
                                              id: row.id,
                                              type:'copy',
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
        pagination.pageSize = pageSize
        CustomAdd({info:{pageSize},key:"screen"});
        resetPaginationPage();
        getScreenData();
    },
    onUpdatePage: (page: number) => {
        pagination.page = page;
        getScreenData()
    },
})
const config: any = reactive({
    pageId:'screen',
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
        isSecTableHead:true,
        // maxHeight:()=> document.documentElement.clientHeight - 310,
        loading: true,
        expandedRowKeys: <any>[],
        updateExpandedRowKeys: (key: any) => {
        },
        rowProps: (row: { hasOwnProperty: (arg0: string) => any; children_node: any; id: any; }, index: any) => {
            return {
                onClick: (e:any) => {
                  //点击行展开或收缩 禁止掉子项添加 并将列表项中除了 td svg path 以及 svg 必须是下拉按钮 才会往下执行
                    if (row.hasOwnProperty('children_node') && row.children_node
                        || !['TD', 'svg', 'path'].includes(e.target.tagName)
                        || (e.target.tagName == 'svg' && e.target.childNodes[0].tagName != 'path')) {
                        return;
                    }
                    let isPush = config.tableOption.expandedRowKeys.findIndex((item: any) => item == row.id)

                    if (isPush == -1) {
                        config.tableOption.expandedRowKeys.push(row.id);
                    } else {
                        config.tableOption.expandedRowKeys.splice(isPush, 1);
                    }
                }
            }
        },
        rowClassName: (rowData: { hasOwnProperty: (arg0: string) => any; }) => {
            return rowData.hasOwnProperty('children_node') ? 'children-tr' : '';
        }
    },
    paginationOption: pagination,
    moduleColOptions: {
        search: {
            isShow: true,
            code: "search",
            key: "id",
            placeholder: '请输入ID或者关键词',
            value: '',
        },
        filter: {
            isShow: true,
            code: 'filter',
        },
        add: {
            isShow: true,
            code: "record-screen:save",
            title: ' 新建录屏'
        },
    },
    selectOptions: {
        /*project:{
          options:{
            label:'项目',
            key:'project',
            value:'',
            type:"text",
            placeholder:"项目ID或者关键字",
          },
          defaultValue:{
            value: '',
          },
        },
        orderForm:{
          options:{
            label:'订单',
            key:'order_form',
            value:'',
            type:"text",
            placeholder:"订单ID或者关键字",
          },
          defaultValue:{
            value: '',
          },
        },*/
        adType: {
            options: {
                label: '展示场景',
                key: 'ad_type',
                value: -1,
                type: "select",
                options: _.cloneDeep(showStyle),
                placeholder: "请选择展示场景",
            },
            defaultValue: {
                label: '不限',
                value: -1,
            },
        },
        status: {
          options: {
            label: '状态',
            key: 'status',
            value: -1,
            type: "select",
            options: _.cloneDeep(screenStatus),
            placeholder: "请选择",
          },
          defaultValue: {
            label: '不限',
            value: -1,
          },
        },
        brand: {
          options: {
            label: '品牌',
            key: 'brand',
            value: '',
            type: "select",
            options: _.cloneDeep(brands),
            placeholder: "请选择",
          },
          defaultValue: {
            label: '不限',
            value: '',
          },
        },
        screenRecordTime: {
            options: {
                label: '录屏日期',
                key: 'screen_record_time',
                value: null,
                type: "daterange",
                placeholder: "请选择录屏时间",
                closeOnSelect: true,
                updateValueOnClose: true,
                valueFormat: "yyyy-MM-dd"
            },
            defaultValue: {
                value: null,
            },
        },
        createTime: {
            options: {
                label: '创建日期',
                key: 'create_time',
                value: null,
                type: "daterange",
                placeholder: "请选择创建日期",
                closeOnSelect: true,
                updateValueOnClose: true,
                valueFormat: "yyyy-MM-dd"
            },
            defaultValue: {
                value: null,
            },
        },
        screenshot: {
        options: {
          label: '是否截图',
          key: 'screenshot',
          value: -1,
          type: "select",
          options: _.cloneDeep(screenShot),
          placeholder: "请选择广告来源",
        },
        defaultValue: {
          label: '不限',
          value: -1,
        },
      },
        adSourceId: {
            options: {
                label: '广告来源',
                key: 'ad_source_id',
                value: '',
                type: "select",
                options: [],
                placeholder: "请选择广告来源",
            },
            defaultValue: {
                label: '不限',
                value: '',
            },
        },
        fast_flag: {
          options: {
            label: '优先执行',
            key: 'fast_flag',
            value: -1,
            type: "select",
            options: _.cloneDeep(fast_flag_map),
            placeholder: "请选择优先执行",
          },
          defaultValue: {
            label: '不限',
            value: -1,
          },
        },
        screenshot: {
            options: {
                label: '是否截图',
                key: 'screenshot',
                value: -1,
                type: "select",
                options: _.cloneDeep(screenShot),
                placeholder: "请选择广告来源",
            },
            defaultValue: {
                label: '不限',
                value: -1,
            },
        },
        real_time_flag: {
            options: {
                label: '标准时间',
                key: 'real_time_flag',
                value: -1,
                type: "select",
                options: _.cloneDeep(real_time_flag),
                placeholder: "请选择是否为标准时间",
            },
            defaultValue: {
                label: '不限',
                value: -1,
            },
        },
        sceneChange: {
            options: {
                label: '远近景切换',
                key: 'scene_change',
                value: -1,
                type: "select",
                options: _.cloneDeep(farNear),
                placeholder: "请选择",
            },
            defaultValue: {
                label: '全部',
                value: -1,
            },
        },
        baiduFlag: {
            options: {
                label: '时间校验',
                key: 'baidu_flag',
                value: -1,
                type: "select",
                options: _.cloneDeep(timeVerification),
                placeholder: "请选择",
            },
            defaultValue: {
                label: '不限',
                value: -1,
            },
        },
        publishTime: {
            options: {
                label: '任务下发时间',
                key: 'publish_time',
                value: null,
                type: "daterange",
                closeOnSelect: true,
                updateValueOnClose: true,
                valueFormat: "yyyy-MM-dd"
            },
            defaultValue: {
                value: null,
            },
        },
        finishTime: {
            options: {
                label: '任务完毕时间',
                key: 'finish_time',
                value: null,
                type: "daterange",
                closeOnSelect: true,
                updateValueOnClose: true,
                valueFormat: "yyyy-MM-dd"
            },
            defaultValue: {
                value: null,
            },
        },
    },
})

const blukModuleOption = reactive({
    delete: {
        key: 'delete',
        code: 'record-screen:delete',
    },
    priority:{
      key:'priority',
      code:'record-screen:fastFlag'
    },
    record:{
      key:'record',
      code:'record-screen:remake'
    }
})

const clearPerviewActive = () => {
    materialsList.value=[]
    perviewActive.title = [];
    perviewActive.modalTitle = '';
    perviewActive.currentIndex = 0;
    perviewActive.active = 0;
}

const getTime = (value: string | any[] | null, index: number) => {
    return value && value.length > 0 ? (index == 0 ? value[index] + ' 00:00:00' : value[index] + ' 23:59:59') : ''
}

/**
 * 初始化请求列表数据
 */
const getScreenData = (selectOptions?: undefined) => {
    config.tableOption.loading = true;
    config.tableOption.data = [];
    let params = config.selectOptions;
    let pageOption = config.paginationOption;
    const options = {
        "ad_source_id": params.adSourceId.options.value,
        "ad_type": params.adType.options.value,
        "baidu_flag": params.baiduFlag.options.value,
        "brand": params.brand.options.value,
        "create_start_time": getTime(params.createTime.options.value, 0),
        "create_end_time": getTime(params.createTime.options.value, 1),
        "finish_start_time": getTime(params.finishTime.options.value, 0),
        "finish_end_time": getTime(params.finishTime.options.value, 1),
        "id": config.moduleColOptions.search.value,
        // "order_form":params.orderForm.options.value,
        "page": pageOption.page,
        "size": pageOption.pageSize,
        // "project":params.project.options.value,
        "fast_flag":(params.fast_flag.options.value == -1 ? null : params.fast_flag.options.value),
        "publish_start_time": getTime(params.publishTime.options.value, 0),
        "publish_end_time": getTime(params.publishTime.options.value, 1),
        "scene_change": params.sceneChange.options.value,
        "screen_record_start_time": getTime(params.screenRecordTime.options.value, 0),
        "screen_record_end_time": getTime(params.screenRecordTime.options.value, 1),
        "screenshot": params.screenshot.options.value,
        "status": params.status.options.value,
        "real_time_flag": params.real_time_flag.options.value
    }
    recordScreenPageApi(options).then(res => {
        config.tableOption.loading = false;
        if (res.code == 200) {
            config.tableOption.pagination['itemCount'] = res.data.total;
            config.paginationOption['itemCount'] = res.data.total;
            config.tableOption.checkedRowKeys = [];
            let pageCount = (Math.ceil(config.paginationOption['itemCount'] / config.paginationOption.pageSize));
            if (config.tableOption.pagination.page > pageCount) {
                config.paginationOption.page = pageCount;
                config.tableOption.pagination.page = pageCount;
                getScreenData();
                return;
            }
            if (res.data['items']) {
                config.tableOption.data = res.data.items.map((item: { item_list?: any[]; children: any; key: any; id: any; ad_type: string | number; }, index: any) => {
                    if (item.item_list && item.item_list.length > 0) {
                        item.children = item.item_list.map((items: { name: any; id: string; brand: string | number; real_time: any; device_id: any; baidu_flag: string | number; status: string | number; failure_reason: any; }) => {
                            return {
                                "task_name": items.name,
                                "id": items.id,
                                "key": items.id + '',
                                "brands": brandsMap[items.brand],
                                "real_time": items.real_time,
                                "file_path": items.file_path,
                                // "project":items.device_id,
                                // "order_form":items.real_time,
                                "ad_type": items.device_id ? `设备标识：${items.device_id}` : `设备标识：暂无`,
                                "task_record_time": items.real_time,
                                "baidu_flag": timeVerificationMap[items.baidu_flag],
                                "status_map": screenStatusMap[items.status],
                                "failure_reason": items.failure_reason,
                                "children_node": true,
                            }
                        })
                    }
                    delete item.item_list;
                    item.key = item.id;
                    item.ad_type = showStyleMap[item.ad_type];
                    return item;
                })
            }
        }
    })
}
/**
 * 初始化广告来源
 */
const getScreenDetailsData = () => {
    GetSysDictApi({ type: 'AD_SOURCE' }).then(res => {
        if (res.code == 200) {
            config.selectOptions.adSourceId.options.options = res.data.map((item: { label: any; name: any; }) => {
                item.label = item.name;
                return item;
            });
            config.selectOptions.adSourceId.options.options.unshift(config.selectOptions.adSourceId.defaultValue)
        }
    })
}
/**
 * 初始化预览信息
 */
const getPerviewData = (id: number) => {
    return recordScreenPreviewApi({ id }).then(res => {
        clearPerviewActive();
        if (res.code == 200) {
            materialsList.value = res.data.map((item: { baidu_flag: number; title: any[]; brand: string | number; ad_type: string | number; task_record_time: any; }) => {
                let baiduFlag = item.baidu_flag == -1 ? '不限' : baiduFlagMap[item.baidu_flag]
                item.title = [brandsMap[item.brand], showStyleMap[item.ad_type], baiduFlag, item.task_record_time];
                return item;
            });
            isPreview.value = true;
            perviewActiveClick(materialsList.value[0], 0)
        }
    })
}
/**
 *  重录
 */
const updateRemake = (row: { id: any; task_name: any; }) => {
    recordScreenRemakeApi({ ids: [row.id] }).then(res => {
        if (res.code == 200) {
            window.$notification['success']({
                content: "成功提示",
                meta: `${row.task_name}正在重录！`,
                duration: 3000
            });
            getScreenData();
        }
    })
}

const perviewActiveClick = (item: { material_path?: string | undefined; type?: number | undefined; task_name?: any; title?: any }, index: number) => {
    perviewActive.active = item;
    perviewActive.currentIndex = index;
    perviewActive.modalTitle = item.task_name;
    perviewActive.title = item.title;
}

/**
 * 重置分页
 */
const resetPaginationPage = () => {
    config.tableOption.pagination.page = 1;
    config.paginationOption.page = 1;
}

/**
 *  关闭 弹框
 */
const closeModal = () => {
    isPreview.value = false;
}

/**
 * tag 发生修改后
 */
const searchTagChange = (item: any, selectOptions: any) => {
    resetPaginationPage();
    getScreenData();
}
/**
 * 清空
 * @param selectOptions
 */
const searchClearClick = (selectOptions: any) => {
    resetPaginationPage();
    getScreenData();
}
/**
 * tag 某一个的清空回调
 * @param selectOptions
 */
const searchTagClose = () => {
    resetPaginationPage();
    getScreenData();
}
/**
 * 筛选点击确认
 */
const filterClickOK = () => {
    resetPaginationPage();
    getScreenData();
}
const filterClickCancel = (selectOptions: any) => {
    // getScreenData();
}
const searchInputChange = (value: any, selectOptions: any) => {
    resetPaginationPage();
    getScreenData();
}

const searchInputEnter = (value: any, selectOptions: any) => {
    resetPaginationPage();
    getScreenData();
}


/**
 * 执行批量删除操作 delete
 * @param data
 */
const deleteClickOk = (data: any[]) => {
    let params: number[] = [];
    data.forEach((item: any) => {
        if (typeof item == 'string') {
            params.push(Number(item));
        }
    })
    recordScreenDeleteApi(params).then(res => {
        if (res.code == 200) {
            window.$notification['success']({
                content: "成功提示",
                meta: `录屏删除成功！`,
                duration: 3000
            });
            getScreenData();
        }
    })
}
/**
 * 优先执行操作 fast
 * @param data
 */
const fastClickOk = (data: any[]) => {
    let ids:number [] = [];
    data.forEach((item: any) => {
        if (typeof item == 'string') {
          ids.push(Number(item))
        }
    })
    recordScreenFastFlagApi({id:ids,fast_flag:1}).then(res => {
        if (res.code == 200) {
            window.$notification['success']({
                content: "成功提示",
                meta: `操作成功！`,
                duration: 3000
            });
        }
    })
}
/**
 * 批量重录操作 fast
 * @param data
 */
const recordClickOk = (data: any[]) => {
    let ids:number [] = [];
    data.forEach((item: any) => {
        if (typeof item == 'string') {
          ids.push(Number(item))
        }
    })
    recordScreenRemakeApi({ids:ids}).then(res => {
        if (res.code == 200) {
            window.$notification['success']({
                content: "成功提示",
                meta: `操作成功！`,
                duration: 3000
            });
          getScreenData();
        }
    })
}
const addScreen = () => {
    let routeUrl = router.resolve({
        path: "/screen/addOrUpdate",
    });
    window.open(routeUrl.href, '_blank');
}
const initEnd = () => {
  getScreenData();
}

onMounted(() => {
    getScreenDetailsData();
})


</script>

<style>
.screen  .n-ellipsis:not(.n-ellipsis--line-clamp){
  max-width: 85% !important;
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
.status-text {
    margin: 0px 4px;
    width: 30px;
    text-align: center;
    display: inline-block;
}
.grey-status {
    color: #999999;
}
.blue-status {
    color: #1890ff;
}
.green-status {
    color: #52c41a;
}
.red-status {
    color: #f5222d;
}
.flex_middle{
    display:flex;
    align-items:center;
}
</style>