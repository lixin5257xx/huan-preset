<template>
    <div class="w-table">
        <div ref="tableSearchBox" :class="tableOption.isAffixSeach ? 'table-header-box' : ''">
            <div class="table-header-search" v-if="tableOption.isShowHead">
                <div class="table-btn">
                    <n-button class="special-btn"
                        v-if="moduleColOptions.add.isShow && getPower(moduleColOptions.add.code)"
                        @click="moduleClick('add')" size="medium" strong round style="font-size: 14px" color="#FA8C16">
                        <template #icon>
                            <n-icon>
                                <Add24Filled />
                            </n-icon>
                        </template>
                        {{ moduleColOptions.add.title }}
                    </n-button>
                    <slot name="table-btn"></slot>
                </div>
                <div class="table-select">
                    <div class="table-select-slot">
                        <slot name="table-select-slot"></slot>
                    </div>
                    <div class="table-select-box">
                        <n-input v-if="moduleColOptions.search.isShow && moduleColOptions.search.code" round
                            :placeholder="moduleColOptions.search.placeholder"
                            v-model:value="moduleColOptions.search.value" @focus="searchInputFocus" @blur="searchSubmit"
                            @keydown.enter="searchEnter" style="width: 200px" :size="'medium'" maxlength="100" v-emoji>
                            <template #suffix>
                                <n-icon :component="Search" />
                            </template>
                        </n-input>
                        <div>
                          <div class="table-dressing-slot">
                            <slot  name="table-dressing-slot"></slot>
                          </div>
                        </div>
                        <n-button class="btn" v-if="moduleColOptions.down.isShow && moduleColOptions.down.code"
                            size="medium" @click="moduleClick('down')" circle>
                            <template #icon>
                                <n-icon>
                                    <Download />
                                </n-icon>
                            </template>
                        </n-button>
                        <n-button class="btn" title="筛选条件" v-if="moduleColOptions.filter.isShow && moduleColOptions.filter.code"
                            @click="openDrawer('filter')" size="medium" circle>
                            <template #icon>
                                <n-icon>
                                    <MultiselectRtl20Regular />
                                </n-icon>
                            </template>
                        </n-button>
                        <n-button class="btn" title="自定义列"  v-if="moduleColOptions.custom.isShow && moduleColOptions.custom.code"
                            @click="openDrawer('custom')" size="medium" circle>
                            <template #icon>
                                <n-icon>
                                    <ColumnInsert />
                                </n-icon>
                            </template>
                        </n-button>
                    </div>
                </div>
            </div>
            <template v-if="tableOption.isShowHead">
              <div class="table-filter-box" v-if="searchTagList.length">
                <n-space :align="'center'">
                  <n-tag v-for="item in searchTagList" type="info" class="tag-box" round :bordered="false" closable
                         @close="searchTagClose(item)">
                    <template #default>
                      <div class="tag-box-div">
                        {{ item.options.label }}：
                        <n-input v-if="['text', 'password', 'textarea'].includes(item.options.type)"
                                 v-bind="item.options" v-model:value="item.options.value" size="small"
                                 @focus="searchTagInputFocus(item)" @blur="searchTagInputBlur(item)"
                                 @keydown.enter="searchTagInputEnter(item)" />
                        <n-select v-if="item.options.type == 'select'" v-bind="item.options"
                                  v-model:value="item.options.value" :title="getTitle(item)" size="small"
                                  @update:value="searchTagChange(item)" />
                        <n-date-picker
                            v-if="['date', 'datetime', 'daterange', 'datetimerange', 'month', 'year', 'quarter'].includes(item.options.type)"
                            v-model:formatted-value="item.options.value" v-bind="item.options" size="small"
                            @update:formatted-value="(value, timestampValue) => {
                                        searchTagChange(item, value)
                                    }" />
                      </div>
                    </template>
                  </n-tag>
                  <n-button class="clear-btn" text @click="searchClearClick">清空</n-button>
                </n-space>
              </div>
              <div class="table-filter-placeholder" v-else></div>
            </template>
        </div>
        <div class="table-box">
            <n-data-table v-show="isInit" v-bind="tableOption" :disabled="true"
                v-model:checked-row-keys="tableOption.checkedRowKeys"
                v-model:expanded-row-keys="tableOption.expandedRowKeys"
                @update:expanded-row-keys='tableOption.updateExpandedRowKeys(key)' />
            <div class="table-bottom table-normal-bottom" v-if="paginationOption != false">
                <n-pagination v-bind="paginationOption" v-model:page="paginationOption.page"
                    v-model:page-size="paginationOption.pageSize" :disabled="tableOption.loading">
                    <template #suffix="{ itemCount }">共计 {{ itemCount }} 条</template>
                </n-pagination>
                <div class="table-bottom-btn-box">
                    <slot name="table-bottom-btn"></slot>
                </div>
            </div>
        </div>
        <!--  抽屉  -->
        <n-drawer v-model:show="drawerOption.active" :width="400" :close-on-esc="false" :mask-closable="false">
            <n-drawer-content :title="drawerOption.title">
                <template v-slot:header="msg">
                    <div class="drawer-header-box">
                        <div class="drawer-box-div">
                            {{ drawerOption.title }}
                            <n-button v-show="drawerOption.status == 'custom'"
                                @click="drawerOperate(drawerOption.status + 'ClickReset')" text size="medium" strong
                                secondary circle color="#999999" :focusable="false" style="vertical-align: text-top;">
                                <template #icon>
                                    <n-icon>
                                        <RefreshOutline />
                                    </n-icon>
                                </template>
                            </n-button>
                        </div>
                        <div>
                            <n-button :text="true" class="btn-txt"
                                @click="drawerOperate(drawerOption.status + 'ClickCancel')">{{
                                    drawerOption.cancel
                                }}</n-button>

                            <n-button @click="drawerOperate(drawerOption.status + 'ClickOK')" style="margin-left: 10px"
                                type="primary">{{ drawerOption.confirm }}</n-button>
                        </div>
                    </div>
                </template>
                <div v-if="drawerOption.status == 'custom'">
                    <n-checkbox size="medium" class="select-all-checkbox" v-model:checked="isSelectAll"
                        :indeterminate="isSelectHalf" label="全选" :on-update:checked="checkAllChange" />
                    <n-checkbox-group v-model:value="customAction">
                        <draggable v-model="customList" item-key="key" @start="drag = true" @end="drag = false"
                            handle=".custom-col-icon">
                            <template #item="{ element }">
                                <div class="custom-col">
                                    <div>
                                        <n-icon :size="18" class="custom-col-icon">
                                            <ArrowMove24Regular />
                                        </n-icon>
                                        <span class="custom-col-title">{{ element.title }}</span>
                                    </div>
                                    <n-checkbox size="medium" :value="element.key" />
                                </div>
                            </template>
                        </draggable>
                    </n-checkbox-group>
                </div>
                <div v-if="drawerOption.status == 'filter'">
                    <template v-for="item in selectOptions" :key="item.options.type">
                        <p class="filter-label">{{ item.options.label }}</p>
                        <n-input v-if="['text', 'password', 'textarea'].includes(item.options.type)"
                            v-bind="item.options" v-model:value="item.options.value" />
                        <n-select v-if="item.options.type == 'select'" v-bind="item.options"
                            v-model:value="item.options.value" />
                        <n-date-picker
                            v-if="['date', 'datetime', 'daterange', 'datetimerange', 'month', 'year', 'quarter'].includes(item.options.type)"
                            v-model:formatted-value="item.options.value" v-bind="item.options" />
                    </template>
                </div>
            </n-drawer-content>
        </n-drawer>
    </div>
</template>

<script setup lang="ts">
import { Search, RefreshOutline } from '@vicons/ionicons5'
import { TextColumnTwoLeft24Filled, Add24Filled, ArrowMove24Regular,MultiselectRtl20Regular } from '@vicons/fluent'
import {ColumnInsert } from '@vicons/carbon'
import { FilterOutlined } from '@vicons/antd'
import draggable from "vuedraggable";
import useStore from "@/config/pinia";
import tableHeader from './src/header/index.vue'
import { useConfig } from './config/config'
import {ref, reactive, defineEmits, defineProps, watch, onMounted, createApp, h, nextTick, watchEffect} from 'vue'
const props = defineProps(['config']);
const config = useConfig(props.config);
const moduleColOptions = config.moduleColOptions;
const selectOptions = config.selectOptions;
const tableOption = config.tableOption;
const paginationOption = config.paginationOption;
const pageId = config.pageId;
const emits = defineEmits(['customClickOk', 'customClickCancel', 'customClickReset',
    'filterClickOK', 'filterClickCancel', 'searchTagChange', 'searchClearClick', 'searchTagClose',
    'searchInputChange', 'searchInputEnter', 'addClick', 'downClick', 'initEnd'])
import _ from "lodash";

const { getPower, CustomAdd, GetCustomPageInfo } = useStore();

let drag = ref(true);

let drawerOption = reactive({
    active: false,//是否展开
    title: "自定义列",//展示的标题
    status: "custom",//打开的显示状态
    confirm: "确定",//确定按钮文案
    cancel: "取消",//取消按钮文案
})

let searchTagList = ref([]); //搜索tag
let customList: any = ref([]); //自定义列抽屉展示list
let customAction: any = ref([]); //当前选中的自定义列有哪些 checkout
let customRecordInfo: any = {
    customRecordAction: [],
    customRecordList: []
};
let isSelectAll = ref(true); //是否全选
let isSelectHalf = ref(true); //是否半选
let columnsOperateData = ref(tableOption.columns); //当前table columns 的操作数据
let columnsSource = _.cloneDeep(tableOption.columns);
let inputCompared = ref("");// 用于筛选input 判断值是否有变化 判断用
let oldSelectData = reactive({ value: {} }); //用于记录旧的筛选数据
let tableSearchBox = ref(null);//搜索区域dom
let isInit = ref(false);//是否初始化完成


/**
 * 根据传入状态不同 显示不同内容抽屉
 * @param status
 */
const openDrawer = (status: string = 'custom') => {
    if (status == 'custom') {
        drawerOption.title = '自定义列';
        drawerOption.status = "custom";
        drawerOption.confirm = "应用";
        drawerOption.cancel = "返回";
        customRecordInfo.customRecordAction = _.cloneDeep(customAction.value);
        customRecordInfo.customRecordList = _.cloneDeep(customList.value);
    } else {
        drawerOption.title = '筛选条件';
        drawerOption.status = "filter";
        drawerOption.confirm = "确定";
        drawerOption.cancel = "取消";
        oldSelectData.value = _.cloneDeep(selectOptions);
    }
    drawerOption.active = true;
}
/**
 * 抽屉按钮发生点击，emits 对应函数并且执行组件内部回显逻辑
 * @param status 是 操作状态和是否拼接而成
 */
const drawerOperate = (status) => {
    drawerOption.active = false;
    let options;
    switch (status) {
        case 'filterClickOK': {
            generateSearchTag();
            options = selectOptions;
            break;
        }
        case 'filterClickCancel': {
            for (const selectOptionsKey in config.selectOptions) {
                config.selectOptions[selectOptionsKey].options.value = oldSelectData.value[selectOptionsKey].options.value;
            }
            options = selectOptions;
            break;
        }
        case 'customClickOK': {
            options = tableOption.columns;
            customColumnShow();
            break;
        }
        case 'customClickCancel': {
            options = tableOption.columns;
            customAction.value = customRecordInfo.customRecordAction;
            customList.value = customRecordInfo.customRecordList;
            break;
        }
        case 'customClickReset': {
            options = tableOption.columns;
            customColumReset();
            break;
        }
    }
    emits(status, options);
}
/**
 *  筛选tag 获取焦点时触发
 */
const searchTagInputFocus = (item) => {
    inputCompared.value = item.options.value;
}
/**
 *  筛选tag input 失去焦点触发
 */
const searchTagInputBlur = (item) => {
    if (!_.isEqual(inputCompared.value, item.options.value)) {
        emits('searchTagChange', item, config.selectOptions);
    }
}
/**
 *  筛选tag input 回车
 *  TODO 正常回车不应该触发change但是为了快速实现暂时 使用后面可区分出来
 */
const searchTagInputEnter = (item) => {
    if (!_.isEqual(inputCompared.value, item.options.value)) {
        emits('searchTagChange', item, config.selectOptions);
        inputCompared.value = item.options.value;
    }
}
/**
 * 初始化固定表头
 * 在使用框架表头时 无法生效，因为执行时，还无法正确获取dom 后续待优化
 */
const initAffixTableHeader = () => {
    nextTick(() => {
        if (tableOption.isAffixTableHeader) {
            let tableHeaderDom = document.querySelector('.n-data-table-base-table-header');
            tableHeaderDom.style.top = `${tableSearchBox.value.offsetHeight}px`;
        }
    })
}
/**
 * 初始化二次封装表头
 */
const initSecTableHead = () => {
  nextTick(()=>{
    let nDataTableThead = document.querySelector('.n-data-table-thead'); //naive 原本表头
    nDataTableThead.style.display='none';
    let  parentBaseTable = document.querySelector('.n-data-table-table');
    let scrollbarContainer = document.querySelector('.n-data-table-base-table-header') ? document.querySelector('.n-data-table-base-table-header') : document.querySelector('.n-data-table-base-table-header');
    let targetDom = document.createElement('div');
    targetDom.className = 'target-header';
    scrollbarContainer.insertBefore(targetDom, parentBaseTable);
    let tableHead = createApp(h(tableHeader, { tableOption }))
    tableHead.mount(targetDom);
    initAffixTableHeader();
  })
}
/**
* 初始化无数据高度
*/
const initTableHeight = () => {
    let empty = document.querySelector('.n-data-table-empty');
    let maxNumber = tableOption.maxHeight != null && tableOption.maxHeight != undefined ?
        tableOption.maxHeight : document.documentElement.clientHeight - 210;
    [empty].forEach(item => {
        if (item) {
            item.style.height = `${maxNumber}px`
        }
    })
}
/**
 * 筛选组件初始化赋值
 */
const init = async () => {
    initTableHeight();
    if (tableOption?.isSecTableHead) {
      initSecTableHead();
    }
    //生成自定义列需要展示的
    //只有设置了自定义列模块展示才执行此代码
    if (moduleColOptions.custom.isShow) {
        let res = await GetCustomPageInfo({ key: config.pageId });
        if (res.code == '200' && res.data.info) {
        if (res.data.info['colums']) {
          let result = {
            left: [],
            right: []
          };
          let indexList = [];
          let addCustomList = [];
          let columsData = res.data.info.colums;

          columnsOperateData.value.forEach(item => {
            if (item.hasOwnProperty("customStatus")) {
              item.customStatus == 'left' ? result.left.push(item) : result.right.push(item)
            } else {
              let currentOldItemIndex; //当前col的接口获取的顺序下标
              let oldItem = columsData.find((col, index) => {
                //由于select 没有key 所有不参与排序，直接会使用旧的col 配置设置
                if (col.key == item.key) {
                  currentOldItemIndex = index;
                  return col;
                }
              })
              if (oldItem) {
                let indexCustom = _.cloneDeep(item);
                if (indexCustom.hasOwnProperty("custom")) {
                  indexCustom.custom = oldItem.custom;
                }
                indexCustom['no'] = currentOldItemIndex;
                indexList.push(indexCustom);
              } else {
                addCustomList.push(item);
              }
            }
          })
          indexList = indexList.sort((a, b) => {
            return a.no - b.no;
          })
          columnsOperateData.value = [...result.left, ...indexList, ...addCustomList, ...result.right];
        }
        if (typeof paginationOption == 'object') {
          paginationOption.pageSize = res.data.info.pageSize;
        }
      }
        customAction.value = [];
        customList.value = columnsOperateData.value.filter(item => {
            return item.hasOwnProperty("custom")
        })
        tableOption.columns = columnsOperateData.value.filter(item => {
            if (item.hasOwnProperty("custom")) {
                if (item.custom) {
                    customAction.value.push(item.key);
                }
                return item.custom;
            }
            return true;
        })
    }
    isInit.value = true;
    emits("initEnd");
}
/**
 * 生成筛选tag
 */
const generateSearchTag = () => {
    searchTagList.value = [];
    for (let key in selectOptions) {
        let defaultValue = selectOptions[key].defaultValue.value;
        if (!_.isEqual(selectOptions[key].options.value, defaultValue)) {
            searchTagList.value.push(selectOptions[key]);
        }
    }
    nextTick(() => {
        initAffixTableHeader()
    })
}
/**
 * searchTagChange
 * 所有遍历的筛选项change
 */
const searchTagChange = (item, value) => {
    if (value) {
        item.options.value = value;
    }
    emits('searchTagChange', item, config.selectOptions);
}
/**
 * searchClear
 * 清空按钮
 */
const searchClearClick = () => {
    for (let key in config.selectOptions) {
        config.selectOptions[key].options.value = config.selectOptions[key].defaultValue.value;
    }
    searchTagList.value = [];
    nextTick(() => {
        initAffixTableHeader()
    })
    emits('searchClearClick', config.selectOptions)
}
/**
 * searchTagClose
 * 单个筛选tag清空
 */
const searchTagClose = (item: any) => {
    searchTagList.value = searchTagList.value.filter((filterOption: any) => {
        return filterOption.options.label != item.options.label;
    })
    for (let key in config.selectOptions) {
        if (config.selectOptions[key].options.label == item.options.label) {
            config.selectOptions[key].options.value = item.defaultValue.value;
        }
    }
    nextTick(() => {
        initAffixTableHeader()
    })
    emits('searchTagClose', item, config.selectOptions)
}
/**
 * 根据传入的数组展示自定义列
 * 处理操作自定义列后并生成 新的列数据
 */
const customColumnShow = () => {
    nextTick(()=>{
      //重置到0-0
      document.querySelector(".n-scrollbar-container").scroll(0,0);
    })
    let culumnSetList = [];
    let isFirst = true;
    customList.value = customList.value.map((item: any) => {
        if (item.hasOwnProperty("custom")) {
            item.custom = customAction.value.includes(item.key);
        }
        return item;
    })
    columnsOperateData.value.forEach((item: any) => {
        if (item.hasOwnProperty("customStatus") && item.customStatus == 'left') {
            culumnSetList.push(item);
        } else if (item.hasOwnProperty("customStatus") && item.customStatus == 'right') {
            if (isFirst) {
                culumnSetList.push(...customList.value);
                isFirst = false;
            }
            culumnSetList.push(item);
        }
    })
    tableOption.columns = culumnSetList.filter((item: any) => {
        if (item.hasOwnProperty("custom")) {
            return item.custom;
        } else {
            return true;
        }
    })
    CustomAdd({ info: { colums: culumnSetList }, key: pageId });
}
/**
 * 重置自定义列
 */
const customColumReset = () => {
    customAction.value = [];
    tableOption.columns = columnsSource.filter(item => {
        if (item.hasOwnProperty("custom")) {
            if (item.custom) customAction.value.push(item.key);
            return item.custom;
        }
        return true;
    })
    //重置顺序
    customList.value = columnsOperateData.value.filter(item => {
      return item.hasOwnProperty("custom")
    })
    customList.value = customList.value.map((item: any) => {
      if (item.hasOwnProperty("custom")) {
        item.custom = customAction.value.includes(item.key);
      }
      return item;
    })
    CustomAdd({ info: { colums: tableOption.columns }, key: pageId });
}
/**
 * 右侧模块点击
 */
const moduleClick = (status: string) => {
    let emitsName: string;
    emitsName = status == 'add' ? 'addClick' : 'downClick';
    emits(emitsName);
}
/**
 * 自定义列点击全选逻辑
 * @param checked
 */
const checkAllChange = (checked) => {
    let allCustom = customList.value.map(item => { return item.key })
    isSelectHalf.value = false; //只要触发此事件 就不会是半选状态
    isSelectAll.value = checked;
    customAction.value = checked ? (allCustom as []) : [];
}
/**
 *  搜索查询获取焦点时触发
 */
const searchInputFocus = () => {
    inputCompared.value = moduleColOptions.search.value;
}
/**
 *  搜索查询获取焦点时触发
 */
const searchSubmit = () => {
    if (!_.isEqual(inputCompared.value, moduleColOptions.search.value)) {
        inputCompared.value = moduleColOptions.search.value;
        emits('searchInputChange', moduleColOptions.search.value, selectOptions);
    }
}
/**
 * 搜索查询无需对比触发回车事件
 */
const searchEnter = () => {
    inputCompared.value = moduleColOptions.search.value;
    emits('searchInputEnter', moduleColOptions.search.value, selectOptions);
}

const getTitle = (item)=>{
   let targetItem =   item.options.options.find(op=>{
    return  op.value == item.options.value;
  })
  return targetItem ?  targetItem.label : "";
}

watch(
    () => customAction.value,
    val => {
        isSelectHalf.value = !!val.length && val.length < customList.value.length;
        isSelectAll.value = val.length === customList.value.length;
    },
)

onMounted(async () => {
    await init();
})
defineExpose({
    generateSearchTag
});
</script>

<style>
.w-table {
    position: relative;
}

.w-table .n-data-table>.n-base-loading {
    transition: none;
}

.n-data-table-td > span::after {
  content: '';
  display: block;
}

.table-header-box {
    position: sticky;
    top: 0px;
    z-index: 10;
    background: #fafafa;
}

.table-header-search {
    font-size: var(--theme-font-size) !important;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    background-color: #fff;
    padding: var(--theme-box-padding);
    /*margin: var(--theme-box-margin);*/
    margin-top: 16px;
    z-index: 9;
}

.btn {
    background-color: #fff;
}

.table-btn,
.table-select,
.table-select-slot,
.table-select-box {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

.table-select .n-button,
.table-select-slot .n-button,
.table-select .n-input {
    margin-left: 10px;
}
.table-dressing-slot {
  margin-left: 10px;
}

.drawer-header-box {
    display: flex;
    width: 356px;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
}

.drawer-box-div {
    display: flex;
    align-items: center;
    width: 90px;
    justify-content: space-between;
}

.table-filter-box {
    width: 100%;
    padding: var(--theme-box-margin);
    z-index: 9;
    background-color: var(--theme-bg-color);
}

.table-filter-placeholder {
    background-color: var(--theme-bg-color);
    height: 16px;
}

.select-all-checkbox {
    margin-bottom: 10px;
}

.table-normal-bottom {
    padding: var(--theme-box-padding);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
}

.table-bottom-btn-box {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

.clear-btn {
    color: var(--theme-color);
}

.filter-label {
    margin-top: 10px;
    font-size: 12px;
    line-height: 30px;
    color: var(--theme-grey-color);
}

.tag-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    min-width: 190px;
}

.tag-box .n-tag__content .n-space>div {
    margin: 0px !important;
}

.tag-box .n-base-selection__border,
.tag-box .n-base-selection__state-border,
.tag-box .n-input__border,
.tag-box .n-input__state-border {
    display: none;
}

.tag-box .n-input__input-el {
    width: 90px;
}

.tag-box .n-base-selection .n-base-selection-label,
.tag-box .n-input {
    min-width: 110px;
    line-height: 28px;
    background-color: #00000000;
    font-size: 14px;
    color: #262626;
}

.tag-box .n-base-selection .n-base-selection-label .n-base-selection-input {
    caret-color: #262626;
}

.tag-box .n-base-selection:not(.n-base-selection--disabled).n-base-selection--active .n-base-selection-label,
.tag-box .n-input:not(.n-input--disabled).n-input--focus {
    background-color: #00000000;
}

.tag-box .n-base-selection-input__content,
.tag-box .n-input__input-el {
    color: #262626;
    overflow: hidden;
}

.tag-box .n-base-selection .n-base-suffix .n-base-suffix__arrow,
.tag-box .n-date-picker .n-date-picker-icon {
    color: #262626;
}

.tag-box-div {
    display: flex;
    align-items: center;
}

.table-box .n-data-table__pagination {
    display: none;
}

.w-table .n-data-table-thead>tr>th {
    background-color: #ffffff !important;
    color: #999;
}

.w-table .n-affix {
    z-index: 3;
}

.w-table .n-data-table .n-data-table-tr td {
    height: 55px;
}

.w-table>.tag-box {
    border-radius: 10px !important;
}

.w-table .n-data-table-base-table {
    background-color: #fff !important;
}

.w-table .n-data-table-base-table-header {
    position: sticky;
    z-index: 9;
}

.table-bottom-affix {
    padding: var(--theme-box-padding);
    position: sticky;
    z-index: 3;
}

.target-header {
    position: sticky;
    top: 0px;
    z-index: 3;
}

.n-base-close {
    color: #000000 !important;
}

.custom-col {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    margin: 10px 0px;
    user-select: none;
}

.custom-col-icon {
    cursor: pointer;
}

.custom-col-title {
    margin-left: 10px;
}
</style>