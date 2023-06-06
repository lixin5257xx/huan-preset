
<!-- 选择级联组件 -->
<script setup lang="ts">
import { ref, reactive, watch, nextTick, onMounted } from "vue";
import Tooltip from '@/components/toolTip/index.vue'
import { cloneDeep, uniq, xorBy, intersection } from "lodash";
const props: any = defineProps({
    modelValue: {
        type: Array,
        required: false,
        default: () => []
    },
    data: {
        type: Array,
        required: true
    },
    cascaderOption: {
        default: () => ({
            parentName: "销售区域",
            childrenName: "销售组",
            nodeKey: "id",
            valueKey: "id",
            childrenKey: "sub_list",
            childrenIdKey: "id",
            childrenLabel: "name",
            childrenParentIdKey: "parent_id",
            parentIdKey: "id",
            parentLabel: "name",
            label: "name",
            threeName: "",
            banCheckedParent: false,
            showTag: true,
            merge: false,
            search: false,
            disabled: false
        })
    },
    placeholder: {
        default: "请选择"
    },
});
const emits = defineEmits([
    "update:modelValue",
    "handleSelectChange"
]);

const {
    nodeKey,
    childrenKey,
    disabled,
    childrenParentIdKey,
    childrenIdKey,
    labelKey,
    childrenLabelKey,
    childrenNodeKey,
    search,
    showTag,
    selectTips,
    parentName,
    childrenName
} = props.cascaderOption;

const searchValue: any = ref(''); //搜索用
const flatList: any = ref([]); //被拍平的所有数据
const parentTree = ref([]); // 父级树形数据
const childTree = ref([]); // 子级树形数据
const showChecked = ref([]); // 展示的tag数据
const checkedNode: any = ref([]); // 选中的节点
const checkedId: any = ref([]); // 选中的ID
const parentTreeRef = ref(null);
const childTreeRef = ref(null);
const searchSelectRef = ref(null);
const threeTree = ref([])

// 获展示的展示的tag
const getShowChecked = () => {
    checkedNode.value = flatList.value.filter((item: any) => {
        return checkedId.value.includes(item[nodeKey]);
    })
    showChecked.value = cloneDeep(checkedNode.value);
    emits("update:modelValue", checkedId.value);
};

// 点击父级树形结构的回调
const handleParentClick = (keys: any, option: any) => {
  if (option.length > 0) {
    const thisNodes = option[0]
    const chidrens = thisNodes[childrenKey] ? thisNodes[childrenKey] : []
    if (chidrens.length > 0) {
      childTree.value = chidrens.map((item: any) => {
        return item;
      });
    } else {
      childTree.value = []
    }
  } else {
    childTree.value = []
  }
};
const handleChildrenClick = (keys: any, option: any) => {
    if (option.length > 0) {
        const thisNodes = option[0]
        const chidrens = thisNodes[childrenKey] ? thisNodes[childrenKey] : []
        if (chidrens.length > 0) {
            threeTree.value = chidrens.map((item: any) => {
                return item;
            });
        } else {
            threeTree.value = []
        }
    } else {
        threeTree.value = []
    }
}

/*
*树形结构选中的回调
 */
const handleParentCheckChange = (checkedKeys: any, options: any) => {
    let checkedAllNode = flatList.value.filter((item: any) => {
        return checkedKeys.includes(item[nodeKey]);
    })
    checkedNode.value = checkedAllNode.filter((item: any) => {
        return item && !item[childrenKey]
    })
    checkedId.value = checkedNode.value.map(item => {
        return item[nodeKey]
    })
    getShowChecked();

    emits("handleSelectChange", checkedId.value, checkedNode.value);
};
// 点击删除某一项tag的回调
const handleClose = (checkData: any) => {
    const selectIndex = checkedId.value.findIndex(
        (item: any) => item == checkData[nodeKey]
    );
    checkedId.value.splice(selectIndex, 1);
    getShowChecked();
};

onMounted(() => {
    handleWacthChange()
})

let checkedNodeProvice: any = [];
let childChecked = cloneDeep(props.modelValue);
const handleTree = (nodes: any) => {
    nodes.forEach((item: any) => {
        item.value = item[props.cascaderOption.parentLabel];
        item.disabled = disabled;
        // 一级选中
        if (childChecked.includes(item[nodeKey])) {
            checkedNodeProvice.push(item);
        }
        if (!item[childrenKey]) {
            flatList.value.push(item);
            return
        }
        handleTree(item[childrenKey])
        
    });
}
// 初始化加载
const handleWacthChange = async () => {
    if (props.data.length === 0) {
        showChecked.value = [];
        checkedNode.value = [];
        checkedId.value = [];
        parentTree.value = [];
        childTree.value = [];
        return;
    }
    checkedId.value = props.modelValue;
    let parentTreeProvice = cloneDeep(props.data);
    handleTree(parentTreeProvice)

    parentTree.value = parentTreeProvice;
    childTree.value = parentTree.value.length ? parentTree.value[0][childrenKey] || [] : [];
    threeTree.value = childTree.value.length ? childTree.value[0][childrenKey] || [] : [];
    showChecked.value = checkedNode.value = checkedNodeProvice;
    getShowChecked();
};

watch(
    () => props.cascaderOption.disabled,
    (newValue) => {
        //禁用反选
        const { childrenKey } = props.cascaderOption;
        props.data.forEach((item: any) => {
            item.disabled = newValue;
            if (item[childrenKey]) {
                item[childrenKey].forEach((itemChild) => {
                    itemChild.disabled = newValue;
                });
            }
        });
        parentTree.value = props.data;
    },
    {
        immediate: true // 深度监听
    }
);
// 全选
const checkAllChange = () => {
    let checkedAllNode = flatList.value.filter((item: any) => {
        return item && !item[childrenKey];
    })
    let allIdList = checkedAllNode.map((item: any) => {
        return item[nodeKey];
    })
    checkedNode.value = cloneDeep(checkedAllNode);
    checkedId.value = cloneDeep(allIdList);
    showChecked.value = cloneDeep(checkedNode.value);
    emits("update:modelValue", checkedId.value);
    emits("handleSelectChange", checkedId.value, checkedNode.value);
};
// 清空
const handleClickClear = () => {
    checkedNode.value = [];
    showChecked.value = [];
    checkedId.value = []
    emits("update:modelValue", []);
    emits("handleSelectChange", [], []);
};
</script>

<template>
    <div class="cascader-tree">
        <div class="search-title">
            <n-input v-model:value="searchValue" :placeholder="placeholder" :disabled="cascaderOption.disabled"
                clearable v-if="cascaderOption.search" />
        </div>
        <div class="cascader-content">
            <div class="selectTree">
                <div class="parentTree">
                    <div class="tree-title">
                        <div class="title-left">
                            <p>
                                {{ cascaderOption.parentName }}
                            </p>
                        </div>
                        <div class="title-right">
                            <span class="checkedTree__title__clear checkAll" :disabled="cascaderOption.disabled"
                                @click="checkAllChange">全选</span>
                        </div>
                    </div>
                    <n-tree checkable :data="parentTree" :show-irrelevant-nodes="false" :pattern="searchValue" cascade
                        :disabled="cascaderOption.disabled" :checked-keys="checkedId"
                        @update:selected-keys="handleParentClick" @update:checked-keys="handleParentCheckChange"
                        :key-field="cascaderOption.parentIdKey" :label-field="cascaderOption.parentLabel"
                        :children-field="childrenKey" check-strategy="all" virtual-scroll style="height: 270px">
                    </n-tree>
                </div>
                <div class="childTree" v-show="childTree.length > 0">
                    <div class="tree-title">
                        <div class="title-left">
                            <p>
                                {{ cascaderOption.childrenName }}
                            </p>
                        </div>
                    </div>
                    <n-tree checkable :data="childTree" :show-irrelevant-nodes="false" :pattern="searchValue"
                        :checked-keys="checkedId" :disabled="cascaderOption.disabled" cascade
                        :key-field="cascaderOption.childrenIdKey" :label-field="cascaderOption.childrenLabel"
                        :children-field="childrenKey" @update:selected-keys="handleChildrenClick"
                        @update:checked-keys="handleParentCheckChange" virtual-scroll style="height: 270px;"></n-tree>
                </div>
                <div class="childTree" v-show="threeTree.length > 0">
                    <div class="tree-title">
                        <div class="title-left">
                            <p>
                                {{ cascaderOption.threeName }}
                            </p>
                        </div>
                    </div>
                    <n-tree checkable :data="threeTree" :show-irrelevant-nodes="false" :pattern="searchValue"
                        :checked-keys="checkedId" :disabled="cascaderOption.disabled"
                        :key-field="cascaderOption.childrenIdKey" :label-field="cascaderOption.childrenLabel"
                        @update:checked-keys="handleParentCheckChange" check-strategy="parent" virtual-scroll
                        style="height: 270px;"></n-tree>
                </div>
            </div>
            <div class="checkedTree" v-show="cascaderOption.showTag">
                <div class="tree-title">
                    <div class="search-title-right">
                        <span>已选（{{ showChecked.length }}）</span>
                        <span v-if="!cascaderOption.disabled" @click="handleClickClear"
                            class="checkedTree__title__clear">清空</span>
                    </div>
                </div>
                <div class="checkedTree__tagBox">
                    <n-tag :bordered="false" v-for="item in showChecked" :key="item[cascaderOption.nodeKey]"
                        :closable="!cascaderOption.disabled" @close="handleClose(item)">
                        <Tooltip>
                            {{ item.name }}
                            <template #header>{{ item.name }}</template>
                        </Tooltip>
                    </n-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.cascader-tree {}

.search-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 460px;
}

.search-title-right {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.search-title span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
}

.search-title .checkAll {
    display: inline-block;
    margin-left: 30px;
}

.checkedTree__title__clear {
    cursor: pointer;
    font-family: PingFangSC-Regular, PingFang SC;
}

.tree-title {
    box-sizing: border-box;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #333;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;
    padding: 0 15px;
}

.title-left {}

.cascader-content {
    display: flex;
    flex-direction: row;
}

.cascader-content .selectTree {
    display: flex;
    flex-direction: row;
    width: 690px;
}

.cascader-content .parentTree,
.cascader-content .childTree {
    flex: 1;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    /*padding:0px 10px;*/
    margin-top: 10px;
    font-size: 14px;
}

.cascader-content .childTree {
    width: 300px;
}

.cascader-content .checkedTree {
    width: 200px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    margin-top: 10px;
    overflow: hidden;
    overflow-y: auto;
}

.cascader-content .n-tree .n-tree-node-wrapper {
    padding-left: 10px;
}

.cascader-content .checkedTree {
    margin-left: 16px;
}

.n-tree .n-tree-node-switcher {
    display: none !important;
}

.checkedTree__tagBox {
    height: 250px;
    overflow-y: auto;
}

.checkedTree__tagBox .n-tag {
    display: block;
    height: 28px;
    margin-top: 8px;
    background: none;
    border: none !important;
    border-radius: 4px;
    line-height: 28px;
    padding: 0 15px !important;
    font-size: 14px;
    color: #999999;
    border-color: #f8f8f8;
    position: relative;
    width: 180px;
    cursor: pointer;
}

.checkedTree__tagBox .n-tag .n-tag__content {
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    overflow: hidden;
    width: 130px;
    display: inline-block;
}

.checkedTree__tagBox .n-tag__close {
    position: absolute;
    font-size: 14px;
    top: 7px;
    right: 0px;
    color: #999999;
}

.checkedTree__tagBox .n-tag__close:hover {
    background: none;
    color: #999999;
}
</style>