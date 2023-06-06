<template>
    <div class="order-content">
        <n-grid item-responsive :cols="24">
            <n-grid-item :offset="2" :span="18">
                <n-form ref="formRef" :model="model" :rules="rules" label-placement="left"
                    require-mark-placement="right-hanging" label-width="100px">
                    <div class="block-item">
                        <h5 id="orderProject">所属项目</h5>
                        <template v-if="isSkeleton">
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                        </template>
                        <template v-if="!isSkeleton">
                            <n-form-item path="subject_id" id="subject_id" label="项目名称">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <div class="sel-box">
                                            <n-select style="width: 530px" v-model:value="model.subject_id"
                                                :disabled="editDisabled || model.first_pass == 1" label-field="name1"
                                                filterable value-field="id" :render-option="renderSubjectOption"
                                                placeholder="搜索或下拉选择" :options="projectList" clearable
                                                @update:value="handleChangeProject" />
                                            <router-link :to="{ name: 'addProject' }" target="_blank" class="text-orange"
                                                v-if="!editDisabled">新建项目</router-link>
                                        </div>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item path="advertiser_name" label="广告主" id="advertiser_name">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <span class="form-span">{{ model.advertiser_name }}</span>
                                        <span v-show="!model.subject_id" class="tips_text">请选择所属项目</span>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item path="advertiser_product_ids" label="产品线">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <n-select style="width: 285px" v-model:value="model.advertiser_product_ids"
                                            :disabled="editDisabled" label-field="name" value-field="id" multiple
                                            placeholder="请选择产品线" @update:value="handleChangeProductLine"
                                            :options="productLineList" clearable />
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item path="industry_name" label="行业">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <!-- <span class="form-span">{{ model.industry_name }}</span> -->
                                        <span class="form-span">
                                            <n-space>
                                                <n-tag  type="warning" v-for="item in industryNamelist"> {{ item }} </n-tag>
                                            </n-space>
                                        </span>
                                        
                                        <span v-show="model.advertiser_product_ids.length == 0" class="tips_text">请选择产品线</span>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                        </template>
                    </div>
                    <div class="block-item">
                        <h5 id="orderBase">基本信息</h5>
                        <template v-if="isSkeleton">
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" height="120px" />
                                </n-space>
                            </n-form-item>
                        </template>
                        <template v-if="!isSkeleton">
                            <n-form-item path="type" label="投放模式" id="type">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <n-radio-group v-model:value="model.type" :disabled="editDisabled"
                                            @update:value="handelChangeModelType" v-show="model.subject_id">
                                            <n-radio style="min-width: 100px" value="1"
                                                v-if="flags.type.includes('1') || model.type == '1'">直投</n-radio>
                                            <n-radio style="min-width: 100px" value="2"
                                                v-if="flags.type.includes('2') || model.type == '2'">程序化</n-radio>
                                        </n-radio-group>
                                        <span v-show="!model.subject_id" class="tips_text">请选择所属项目</span>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item label="交易类型" path="play_type" id="play_type" v-if="['2'].includes(model.type)">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <n-radio-group v-model:value="model.play_type" :disabled="editDisabled">
                                            <n-radio style="min-width: 100px" v-for="item in transTypeList"
                                                :value="item.value">{{ item.label }}</n-radio>
                                        </n-radio-group>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item label="媒体" path="brand" id="brand">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <!-- <n-radio-group v-model:value="model.brand" :disabled="model.status == 4 &&model.out_time1_day_flag">
                                        <n-radio v-for="item in channelList" :value="item.value">{{
                                            item.label
                                        }}</n-radio>
                                    </n-radio-group> -->
                                        <n-select style="width: 285px" v-model:value="model.brand"
                                            :disabled="editDisabled || model.first_pass == 1" label-field="label" filterable
                                            value-field="value" placeholder="搜索或下拉选择" :options="channelList" clearable
                                            @update:value="handleChangeBrand" />
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item label="产品名称" path="product_name" id="product_name">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <!-- <n-radio-group v-model:value="model.product_name" @update:value="handleChangeAdType"
                                        :disabled="model.status == 4 &&model.out_time1_day_flag">
                                        <n-radio v-for="item in showStyle" :value="item.value"
                                            :disabled="item.gray_show">{{ item.label }}</n-radio>
                                    </n-radio-group> -->
                                        <n-select style="width: 285px" v-model:value="model.product_name"
                                            :disabled="editDisabled || model.first_pass == 1" label-field="label" filterable
                                            value-field="value" placeholder="搜索或下拉选择" :options="showStyle" clearable
                                            @update:value="handleChangeAdType" />
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item label="广告位" path="ad_space" id="ad_space">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <n-select style="width: 285px" v-model:value="model.ad_space"
                                            :disabled="editDisabled || model.first_pass == 1" label-field="name" filterable
                                            value-field="value" placeholder="搜索或下拉选择" :options="advertiserList" clearable
                                            @update:value="handleChangeAdSpace" />
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <n-form-item label="策略" path="kpi_type" id="kpi_type">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <n-checkbox-group v-model:value="model.kpi_type" :disabled="editDisabled">
                                            <n-space item-style="display: flex;">
                                                <n-checkbox v-for="item in kpiTypeList" :value="item.value"
                                                    :key="item.name">{{
                                                        item.label }}</n-checkbox>
                                            </n-space>
                                        </n-checkbox-group>
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                            <!-- <n-form-item label="考核KPI" path="kpi_msg" id="kpi_msg">
                            <n-grid :cols="24">
                                <n-gi :span="24">
                                    <n-input :disabled="editDisabled" style="width: 560px;margin-right: 20px;"
                                        v-model:value="model.kpi_msg"
                                        placeholder="请输入"
                                        type="textarea" v-emoji="1" maxlength="500" />
                                    <div class="example-box">【示例】<br />考核要求
                                        <br />1、若完成率在70%-90%则需要1赔2，完成率低于70%则整波不结算。<br />2、秒针的in-geo%和RTBAsia的IVT%同时考核，超过2%容忍值部分需要进行实结;若in-geo低于90%，则整波不结算。
                                    </div>
                                </n-gi>
                            </n-grid>
                        </n-form-item> -->
                            <n-form-item label="备注" class="edit-item">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <!-- <n-input :disabled="editDisabled" style="width: 560px" v-model:value="model.remarks"
                                        placeholder="" type="textarea" v-emoji="1" maxlength="500" :autosize="{
                                                minRows: 3,
                                            }" /> -->
                                        <Wangeditor @getHtml="getRemarks" @getText="getRemarksText" style="width:560px;"
                                            height="150" :maxLength="500" :valueHtml="model.remarks_html"
                                            :toolbarKeys="toolbarKeys" :defaultContent="jsonContent" />
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                        </template>
                    </div>
                    <div class="block-item">
                        <h5 id="orderScheduling">排期与监测</h5>
                        <template v-if="isSkeleton">
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" height="500px" />
                                </n-space>
                            </n-form-item>
                        </template>
                        <template v-if="!isSkeleton">
                            <importExeclEcho  :formRef="formRef" ref="importRef" :config="importConfig"
                                :schedule="tableSchedule"  @handleUploadFile="handleUploadFile"
                                 @downTemplate="downTemplateExecl"
                            />
                          <n-form-item label="订单周期" path="coo_time" id="coo_time">
                                <div class="coo_time_update" v-if="model.coo_time.length">
                                    <span style="margin-right: 10px" v-if="model.coo_time.length">{{
                                        dayjs(model.coo_time[0]).format('YYYY-MM-DD') }} 至</span>
                                    <span style="margin-right: 10px" v-if="model.coo_time.length">{{
                                        dayjs(model.coo_time[1]).format('YYYY-MM-DD') }}</span>
                                </div>
                                <span v-show="!model.coo_time.length" class="tips_text">请导入文件</span>
                            </n-form-item>
                            <!-- <n-form-item path="materials_ids" label="素材" id="materials_ids">
                            <n-grid :cols="24">
                                <n-gi :span="18">
                                    <div class="sel-box">
                                        <n-select :disabled="editDisabled" style="width: 285px" multiple
                                            v-model:value="model.materials_ids" label-field="name" filterable
                                            value-field="id" placeholder="搜索或下拉选择素材" :options="filePathList" clearable />
                                    </div>
                                </n-gi>
                            </n-grid>
                        </n-form-item> -->
                        </template>
                    </div>
                    <div class="block-item">
                        <h5 id="orderName">订单名称</h5>
                        <template v-if="isSkeleton">
                            <n-form-item>
                                <n-space align="flex-start">
                                    <n-skeleton text :repeat="1" width="80px" class="skeleton-title" />
                                    <n-skeleton text :repeat="1" width="550px" />
                                </n-space>
                            </n-form-item>
                        </template>
                        <template v-if="!isSkeleton">
                            <n-form-item label="订单名称" path="name" id="name">
                                <n-grid :cols="24">
                                    <n-gi :span="24">
                                        <n-input style="width: 400px" :disabled="editDisabled" clearable
                                            @input="changeOrderName" placeholder="请输入订单名称" maxlength="60"
                                            v-model:value="model.name" />
                                    </n-gi>
                                </n-grid>
                            </n-form-item>
                        </template>
                    </div>
                    <div style="display: flex; justify-content: center; margin-bottom: 10px">
                        <n-button :text="true" class="btn-txt" :loading="model.click_state" @click="goBack">取消</n-button>
                        <Tooltip v-if="editDisabled">
                            <div>
                                <!-- 触发器 -->
                                <n-button type="warning" class="btn-submit" :disabled="true">
                                    保存并关闭</n-button>
                            </div>

                            <!-- 内容 -->
                            <template #header>
                                <p v-if="model.status == 4 && model.out_time1_day_flag">
                                    订单已经完成,不能编辑!
                                </p>
                                <p v-if="model.status == -1">订单已经撤单,不能编辑!</p>
                            </template>
                        </Tooltip>
                        <div v-else>
                            <n-button type="warning" v-permissions="submitCode" class="btn-submit" @click.prevent="submit"
                                v-preventReClick :loading="model.click_state">
                                保存并关闭</n-button>
                            <n-button v-if="type == 'add'" type="warning" v-permissions="submitCode" class="btn-submit"
                                @click.prevent="create" v-preventReClick :loading="model.click_state">
                                保存并继续创建</n-button>
                        </div>

                    </div>
                </n-form>
            </n-grid-item>
            <n-grid-item :span="3">
                <div class="anchor-box">
                    <AnchorLink :list="anchorArrList" type="block" :top="88" affix :show-rail="showRail"></AnchorLink>
                </div>
            </n-grid-item>
        </n-grid>
        <n-icon size="200px" :depth="5" class="bg_icon">
            <DocumentQueueAdd24Regular />
        </n-icon>
    </div>
    <!-- 改单原因弹窗 -->
    <changeReason v-model:show="showChangeOrderModel" v-model:loading="model.click_state" @submit="handelSubmitReason">
    </changeReason>
</template>
<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  onDeactivated,
  h,
  VNode, reactive
} from 'vue'
import {
    useRouter,
    useRoute,
    Router,
} from 'vue-router'
import {
    useState,
    useHandle,
    useMounted,
    useSubmit,
    useDetail,
    useCancel,
    useModel,
    useEdit
} from './use/addOrUpdateOrder'
import { NTooltip, SelectOption } from 'naive-ui'
import { projectType, transTypeList } from '../constant'
import Tooltip from '@/components/toolTip/index.vue'
import AnchorLink from '@/components/anchor-link/index.vue'
import { startOfDay, add, set, format } from 'date-fns/esm'
import importExeclEcho from '@/components/import-execl-echo/importExeclEcho.vue'
// import importExeclEcho from './components/importExeclEcho.vue'
import Wangeditor from '@/components/wangeditor/wangeditor.vue'
import { DocumentQueueAdd24Regular } from '@vicons/fluent'
import dayjs from 'dayjs'
import changeReason from '@/components/changeReason/changeReason.vue'
import {GetOrderTemplateApi, uploadFileApi, UploadImportTemplateApi} from "@api";
import {downLoadFile} from "@utils";
const router: Router = useRouter()
const route: any = useRoute()
const { model, rules, modelRules, formRef, selProjectOption, taskNameStatus } = useState()
const {
    channelList,
    advertiserList,
    kpiTypeList,
    getKpiTypeList,
    getChannelList,
    showStyle,
    getShowStyle,
    getProjectList,
    projectList,
    filePathList,
    handleChangeAdType,
} = useMounted(model, taskNameStatus, route)
const {
    isShowChoice,
    handleChangeProject,
    handleChangeBrand,
    handleChangeAdSpace,
    handleChangeProductLine,
    changeOrderName,
    flags,
    productLineList,
    updateTime,
    industryNamelist
} = useHandle(
    model,
    formRef,
    projectList,
    selProjectOption,
    filePathList,
    taskNameStatus,

)
const type = ref()
const importRef = ref<any>(null)
const isSkeleton = ref(false);


const { showChangeOrderModel, changeModel, cancelCallback, submitCallback } = useModel(model, router)

const { getDetail, tableSchedule } = useDetail(
    model,
    route,
    taskNameStatus,
    projectList,
    selProjectOption,
    filePathList,
    showStyle,
    advertiserList,
    importRef,
    productLineList,
    isSkeleton
)
const { submit, create, handelSubmitReason } = useSubmit(model, formRef, type, router, showChangeOrderModel, flags)


const { goBack } = useCancel(router)

const { toolbarKeys, getRemarks, getRemarksText } = useEdit(model)
route.meta.bread[route.meta.bread.length - 1].label = route.query.id
    ? '编辑订单'
    : '新建订单'
isSkeleton.value = route.query.id ? true : false
type.value = route.query.type ? route.query.type : 'add'

const importConfig:any = reactive({
  label:'导入',
  modelType: type.value,
  filePath:'',
  showUploadTable:false,
  showWatermark:true,
  editDisabled:false,
  tips:{
    isShowLabelTips:true,
    content:"请先下载模板，按照模板提醒填入排期数据后导入文件",
  },
  downTemplate:{
    label:"下载模板",
  },
  importTemplate:{
    label:"导入",
  },
  downImportedTemplate:{
    label:'已导入文件下载'
  }
})
const submitCode = type.value == 'add' ? 'order:save' : 'order:update'
const renderSubjectOption = ({ node, option }: { node: VNode; option: SelectOption }) => {
    return h(NTooltip, null, {
        trigger: () => node,
        default: () => option.name
    })
}
const anchorArrList = ref([
    {
        name: '所属项目',
        children: [
            {
                selector: '#orderProject',
                name: '项目名称',
                active: true,
            },
        ],
    },
    {
        name: '订单',
        children: [
            {
                selector: '#orderBase',
                name: '基本信息',
            },
            {
                selector: '#orderScheduling',
                name: '排期与监测',
            },
            {
                selector: '#orderName',
                name: '订单名称',
            },
        ],
    },
])
const showRail = ref(true)
const dateCooTimeDisabled = (
    ts: number,
    type: 'start' | 'end',
    range: [number, number] | null
) => {
    if (selProjectOption.value) {
        return (
            ts > dayjs(selProjectOption.value.coo_end_time).valueOf() ||
            ts < dayjs(selProjectOption.value.coo_start_time).valueOf() ||
            ts < dayjs().subtract(1, 'day').valueOf()
        )
    } else {
        return null
    }
}
/**
 * 投放周期change
 */
const dateCooTimeChange = (value: any) => {
    model.coo_time = value
    if (model.coo_time && model.coo_time.length) {
        model.push_time_start = model.coo_time[0]
        model.push_time_end = model.coo_time[1]
    } else {
        model.push_time_start = null
        model.push_time_end = null
    }
}
const updateDateCooTimeDisabled = (ts: number) => {
    if (selProjectOption.value) {
        return (
            ts > dayjs(selProjectOption.value.coo_end_time).valueOf() ||
            ts < dayjs(selProjectOption.value.coo_start_time).valueOf() ||
            ts < dayjs().subtract(1, 'day').valueOf()
        )
    }
}
/**
 * 投放素材编辑时
 */
const updateTimeChange = (value: any) => {
    model.coo_end_time = value
    model.coo_time[1] = dayjs(value).valueOf()
}

onMounted(async () => {
    await getChannelList()
    await getKpiTypeList()
    await getShowStyle()
    if (route.query.id) {
        await getDetail();
        importConfig.showUploadTable = true;
        importConfig.filePath = model.file_path;
        importConfig.editDisabled = ((model.status == 4 && model.out_time1_day_flag) || model.status == -1);
    } else {
        model.type = '1'
        model.play_type = 1
    }
    await getProjectList()

})
const editDisabled = computed(() => {
    return (model.status == 4 && model.out_time1_day_flag) || model.status == -1
})

const handelChangeModelType = (value: any) => {
    console.log('value', value)
    if (value == 2) {
        model.play_type = 2
    }
}

const downTemplateExecl = async () => {
  let { data } = await GetOrderTemplateApi()
  downLoadFile(data)
}

const uploadFile = async (model: any) => {
  await uploadFileApi({ file: model.file }).then((res) => {
    model.file_path = res.data.path
    model.fileName = res.data.file_name
  })
}

const  handleUploadFile = async (options:any) => {
  try {
    await UploadImportTemplateApi({
    file: options.file.file
  }).then((res) => {
    if (res.code == 200) {
      model.showUploadTable = true
      window.$message.success('导入成功!')
      model.file = options.file.file
      formRef.value.validate()
      model.file_upload_flag = true
      uploadFile(model);
      importRef.value.upLoadSuccess(res);
      updateTime({
        coo_start_time: dayjs(res.data.push_time_start).format(
            'YYYY-MM-DD'
        ),
        coo_end_time: dayjs(res.data.push_time_end).format(
            'YYYY-MM-DD'
        ),
      })
    }
  })
} catch (e) {
  console.log('执行失败')
}
  importRef.value.clearFilesUpload()
}

onDeactivated(() => {
    window.$notification.destroyAll()
})
const jsonContent = [
    {
        type: 'paragraph',
        lineHeight: '1',
        children: [
            { text: '', fontSize: '14px' }
        ]
    }
]
</script>

<style>
.error-msg {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgb(118, 124, 130);
    max-height: 400px;
    overflow-y: auto;
    min-height: 18px;
    margin-bottom: 10px;
}

.error-msg .error-title:before {
    content: '*';
    color: red;
    display: inline-block;
    margin-right: 10px;
}

.error-msg .error-content {
    padding-left: 15px;
    cursor: pointer;
}

.error-msg .error-content,
.error-msg-content {
    font-size: 12px !important;
    line-height: 20px;
    font-weight: 400 !important;

    margin: 0 0 10px;
}

.error-msg .error-title,
.error-msg .error-title-name {
    font-size: 14px !important;
    font-weight: 600 !important;
    max-height: 300px;
    overflow-y: auto;
    padding: 0 10px 0 0;
    min-height: 18px;
    line-height: 26px;
    color: #606266;
}

.error-msg p:nth-of-type(1) {
    /* margin-bottom: 10px; */
}

.error-msg p:nth-of-type(2) {
    /* color: #d03050; */
    /* line-height: 18px; */
}
</style>

<style scoped>
.laout-content {
    background: #fafafa;
}

.order-content :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.order-content {
    background: #fafafa !important;
    padding-bottom: 50px !important;
    margin: var(--theme-box-margin);
}

.order-content :deep(.n-form-item) {
    margin-left: 100px !important;
}

.order-content h5,
.order-content h5 b {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
    margin: 0 0 25px;
}

.coo_time_update {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
}

.order-content h5 b {
    display: inline-block;
    margin: 0 0 3px;
}

.sel-box {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.text-orange {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fa8c16;
    margin-left: 10px;
}

.anchor-box {
    width: 165px;
    display: flex;
    background: #fff;
    height: 260px;
    margin-left: 15px;
    padding-left: 20px;
    border-radius: 8px;
    padding-top: 25px;
    position: fixed;
}

.tips_text {
    color: #c2c2c2;
    font-size: 14px;
    position: relative;
    top: -2px;
}

.project-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.model-msg {
    margin-bottom: 10px;
    display: block;
}

.model-msg .xing {
    color: #d03050
}

.example-box {
    display: inline-block;
    font-size: 14px;
    color: #999;
    width: 450px;
}

.form-span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    position: relative;
    max-width: 550px;
    display: block;
}
</style>

