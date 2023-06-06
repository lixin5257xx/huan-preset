<template>
    <div class="add-project">
        <n-back-top :right="100" />
        <takeInfo :config="config" @goBack="goBack">
            <template #schedule_file>
              <batchUpload v-model:fileList="config.newDetail.schedule_file"
                           :isDisabled="false"
                           :accept="'*'"
                           @handBatchUpload="handBatchUpload"
                           :isContrast="true"
                           :valueKey="'schedule_file'"
              />
            </template>
            <template #supervise_file>
              测试
            </template>
            <template #email_files>
              测试
            </template>
            <template #take-bg-icon>
              <n-icon size="160px" :depth="5" class="bg_icon">
                <TaskListSquareAdd20Regular />
              </n-icon>
            </template>
        </takeInfo>
<!--        <div class="take-box" v-if="['schedule_file', 'supervise_file'].includes(option.key)">
          <div class="value"
               v-if="option.newValue && option.newValue[0].url === option.oldValue[0].url">
                                              <span style="cursor: pointer;" @click="downLoadFile(option.newValue[0].url)">{{
                                                  option.newValue[0].name }}</span>
          </div>
          <template v-else>
            <div class="add-value"
                 v-if="option.newValue && option.newValue[0].url && !option.oldValue[0].url">
                                                  <span style="cursor: pointer;"
                                                        @click="downLoadFile(option.newValue[0].url)">{{
                                                      option.newValue[0].name }}</span>
            </div>
            <div class="del-value"
                 v-if="option.newValue && !option.newValue[0].url && option.oldValue[0].url">
                                                  <span style="cursor: pointer;"
                                                        @click="downLoadFile(option.oldValue[0].url)">{{
                                                      option.oldValue[0].name }}</span>
            </div>
            <template
                v-if="option.newValue && option.newValue[0].url && option.oldValue[0].url">
              <div class="add-value">
                                                      <span style="cursor: pointer;"
                                                            @click="downLoadFile(option.newValue[0].url)">{{
                                                          option.newValue[0].name }}</span>
              </div>
              <div class="del-value">
                                                      <span style="cursor: pointer;"
                                                            @click="downLoadFile(option.oldValue[0].url)">{{
                                                          option.oldValue[0].name }}</span>
              </div>
            </template>
          </template>
        </div>
        <div class="take-box" v-if="['email_image','contract_id'].includes(option.key)">
          待修改
          <div class="value"
               v-if="option.newValue && option.newValue[0].url === option.oldValue[0].url">
                                              <span style="cursor: pointer;" @click="downLoadFile(option.newValue[0].url)">{{
                                                  option.newValue[0].name }}</span>
          </div>
          <template v-else>
            <div class="add-value"
                 v-if="option.newValue && option.newValue[0].url && !option.oldValue[0].url">
                                                  <span style="cursor: pointer;"
                                                        @click="downLoadFile(option.newValue[0].url)">{{
                                                      option.newValue[0].name }}</span>
            </div>
            <div class="del-value"
                 v-if="option.newValue && !option.newValue[0].url && option.oldValue[0].url">
                                                  <span style="cursor: pointer;"
                                                        @click="downLoadFile(option.oldValue[0].url)">{{
                                                      option.oldValue[0].name }}</span>
            </div>
            <template
                v-if="option.newValue && option.newValue[0].url && option.oldValue[0].url">
              <div class="add-value">
                                                      <span style="cursor: pointer;"
                                                            @click="downLoadFile(option.newValue[0].url)">{{
                                                          option.newValue[0].name }}</span>
              </div>
              <div class="del-value">
                                                      <span style="cursor: pointer;"
                                                            @click="downLoadFile(option.oldValue[0].url)">{{
                                                          option.oldValue[0].name }}</span>
              </div>
            </template>
          </template>
        </div>
        <div class="take-box" v-else-if="['materialsInfosList'].includes(option.key)"
             v-for="item in materialsInfosList">
          <div class="materials-box" :class="item.domType">
            <div>
              <span>{{ item.name }}</span>
            </div>
            <div>
              <span>{{ item.brands.join(',') }}</span>
            </div>
            <div>
              <span> {{ item.path }}</span>
            </div>
            <div>
              <span>{{ item.coo_start_time }}至{{ item.coo_end_time }}</span>
            </div>
          </div>
        </div>-->

    </div>
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import { TaskListSquareAdd20Regular } from '@vicons/fluent'
import takeInfo from '@/components/take-info/index.vue'

import { useRouter, useRoute,  RouteLocationNormalized } from 'vue-router'
import { Download } from '@vicons/tabler'
import { downLoadFile } from '@utils'
import {GetSubjectTaskInfoApi} from "@api";
import dayjs from "dayjs";
import batchUpload from '@/components/batch-upload/index.vue'

const router: any = useRouter()
const route: RouteLocationNormalized = useRoute()
const model = reactive({
  company_name: '',
  put_level: '',
  put_price_all: '',
  put_price_unit: '',
  settle_kpi: '',
  coo_start_time: '',
  coo_end_time: '',
  materials_infos:[],
  video_require: '',
  id:'',
  coo_time: '',
  type_name: '',
  region_name: '',
  advertiser_name: '',
  industry: '',
  deal_type_name: '',
  dsp_name: '',
  supervise_company_name: '',
  settle_standard_name: '',
  schedule_file: [],
  supervise_file: [],
  name: '',
  status_name: '',
})
const config = reactive({
  takeTipsProps : {
    content:'123',//原因
  },
  formProps:{
    model,
    labelWidth:'210px'
  },
  blockList:[],
  newDetail:{},
  oldDetail:{},
  anchorLinkProps:{},
})

const getBread = () => {
  route.meta.bread[1].label = route.query.name
  route.meta.bread[2].label = `修改详情：${route.query.time}`
}

const getSubjectInfo = (id: number) => {
  return GetSubjectTaskInfoApi({ id: Number(id) }).then(({ data }) => {
    const new_coo_time =
        dayjs(data.new_detail.coo_start_time).format('YYYY-MM-DD') +
        ' 至 ' +
        dayjs(data.new_detail.coo_end_time).format('YYYY-MM-DD')
    const old_coo_time =
        dayjs(data.old_detail.coo_start_time).format('YYYY-MM-DD') +
        ' 至 ' +
        dayjs(data.old_detail.coo_end_time).format('YYYY-MM-DD')
    config.newDetail = Object.assign({}, data.new_detail)
    config.oldDetail = Object.assign({}, data.old_detail)
    config.newDetail.coo_time = new_coo_time;
    config.oldDetail.coo_time = old_coo_time;
  })
}

const formRef: any = ref(null);
let id: any = 0;
let type: any = '';

const goBack = () => {
    router.push({
        name: 'projectChangeTake'
    })
}

const init = async () => {
    id = route.query.id;
    type = route.query.type;
    await getSubjectInfo(id);
}

onMounted(async () => {
    config.blockList = [
    {
      label: "基本信息", id: 'base', children: [
        {
          label: "投放模式",  path: "product_name", id: "product_name"
        },
        {
          label: "下单部门",  path: "product_name", id: "product_name"
        },
        {
          label: "下单来源", path: "region_name", id: "region_name"
        },
        {
          label: "广告主", path: "advertiser_name", id: "advertiser_name"
        },
        {
          label: "下单公司", path: "company_name", id: "company_name"
        },
        {
          label: "下单销售", path: "employee_id", id: "employee_id"
        },
        {
          label: "DSP平台", path: "dsp_name", id: "dsp_name"
        },
        {
          label: "监测公司", path: "supervise_company_name", id: "supervise_company_name"
        },
        {
          label: "结算依准", path: "settle_standard_name", id: "settle_standard_name"
        },
        {
          label: "排期附件", path: "schedule_file", id: "schedule_file"
        },
        {
          label: "监测附件", path: "supervise_file", id: "supervise_file"
        },
        {
          label: "邮件文件", path: "email_files", id: "email_files"
        },
        {
          label: "投放周期", path: "coo_time", id: "coo_time"
        },
        {
          label: "投放素材", path: "materialsInfosList", id: "materialsInfosList"
        },
      ]
    },
    {
      label: "投放信息", id: 'deliveryInfo', children: [
        {
          label: "投放量级", path: "put_level", id: "put_level"
        },
        {
          label: "投放单价", path: "put_price_unit", id: "put_price_unit"
        },
        {
          label: "投放金额", path: "put_price_all", id: "put_price_all"
        },
        {
          label: "对公返点",  path: "product_name", id: "product_name"
        },
      ]
    },
    {
      label: "考核信息", id: 'kpiInfo', children: [
        { label: "考核KPI", path: "settle_kpi", id: "settle_kpi" },
        { label: "录屏要求", path: "video_require", id: "video_require" }
      ]
    },
    {
      label: "项目名称", id: 'projectName', children: [
        { label: "项目名称", path: "name", id: "name" },
      ]
    },
    {
      label: "凭证信息", id: 'projectName', children: [
        {
          label: "合同", path: "contract_id", id: "contract_id"
        },
        {
          label: "邮件截图", path: "contract_id", id: "contract_id"
        },
      ]
    },
    {
      label: "单价返点", id: 'rebate', children: [
        {
          label: "单价", path: "contract_id", id: "contract_id"
        },
        {
          label: "返点", path: "contract_id", id: "contract_id"
        },
      ]
    },
    {
      label: "状态", id: 'statusBox', children: [
        {
          label: "项目状态", path: "contract_id", id: "contract_id"
        },
        {
          label: "BOS送审状态", path: "contract_id", id: "contract_id"
        },
      ]
    },
  ]
    getBread()
    await init();
})

</script>

<style scoped>
.add-project {
    background: #fafafa !important;
    padding-bottom: 50px !important;
    margin: var(--theme-box-margin);
}

.add-project :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.add-project h5,
.add-project h5 b {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
    margin: 0 0 25px;
}
</style>
