import {h, reactive, ref, RendererElement, RendererNode, shallowRef, VNode} from 'vue'
import _, { uniqueId } from 'lodash'
import {
  customerTypeOption,
  projectStatus,
  projectType,
  syncOption,
} from '@views/constant'
import projectStatusComponent from '@views/project/components/projectStatusComponent.vue'
import {
  AppsAddIn24Regular,
  CalendarSync24Regular,
  DataUsageEdit24Regular,
  History20Filled,
} from '@vicons/fluent'
import { Eye } from '@vicons/tabler'
import { AuditOutlined } from '@vicons/antd'
import { NButton, NIcon, NInput} from 'naive-ui'
import { btnListToMoreList } from '@utils'

let model: any = reactive({
  type: [1], //项目类型
  region_id: undefined, //下单来源
  push_time: undefined, //下单日期
  contract_id: undefined, //合同
  company_body_name: undefined, //公司主体
  advertiser_id: undefined, //广告主
  customer_type: undefined, //客户类型
  employee_id: undefined, //销售人员
  sales_assistant:'',//销售助理
  industry_name: '', //所属行业
  deal_type: null, //交易类型
  dsp_id: null, //dspid
  supervise_company: [], //监测公司
  settle_standard: [], //结算依准
  schedule_file: [], //排期文件
  supervise_file: [], //监测附件
  email_files: [],//邮件附件
  coo_time: '', //投放时间
  coo_end_time: null, //投放结束时间
  coo_start_time: null, //投放开始时间
  materials_upload_type:1,//投放素材
  materials_infos: [
    // {
    //   name: '',
    //   uuid: uniqueId(),
    //   coo_time: null,
    //   coo_end_time: null,
    //   coo_start_time: null,
    //   time_long: null,
    //   thumbnail_path: null,
    //   type: null,
    //   return_schedule: '',
    //   brands: [],
    //   loading: false,
    // },
  ], //素材集合
  material_msg:'',//素材说明
  put_level: '', //投放量级
  put_price_unit: '', //投放单价
  put_price_all: '', //投放金额
  return_point_msg: '', //对公返点
  settle_kpi_text: '', //考核KPI
  settle_kpi_html: '', //考核KPI
  video_require: '', //录屏要求
  name: '', //项目名称
  click_state: false, //提交按钮禁止双点击
  first_pass:0, //审核是否通过 0 不通过1 通过
})
let oldModel: any = reactive({
  type: [1], //项目类型
  region_id: undefined, //下单来源
  push_time: undefined, //下单日期
  contract_id: undefined, //合同
  company_body_name: undefined, //公司主体
  advertiser_id: undefined, //广告主
  customer_type: undefined, //客户类型
  employee_id: undefined, //销售人员
  sales_assistant:'',//销售助理
  industry_name: '', //所属行业
  deal_type: null, //交易类型
  dsp_id: null, //dspid
  supervise_company: [], //监测公司
  settle_standard: [], //结算依准
  schedule_file: [], //排期文件
  supervise_file: [], //监测附件
  email_files: [],//邮件附件
  coo_time: '', //投放时间
  coo_end_time: null, //投放结束时间
  coo_start_time: null, //投放开始时间
  materials_upload_type:1,//投放素材
  materials_infos: [
    // {
    //   name: '',
    //   uuid: uniqueId(),
    //   coo_time: null,
    //   coo_end_time: null,
    //   coo_start_time: null,
    //   time_long: null,
    //   thumbnail_path: null,
    //   type: null,
    //   return_schedule: '',
    //   brands: [],
    //   loading: false,
    // },
  ], //素材集合
  material_msg:'',//素材说明
  put_level: '', //投放量级
  put_price_unit: '', //投放单价
  put_price_all: '', //投放金额
  return_point_msg: '', //对公返点
  settle_kpi_text: '', //考核KPI
  settle_kpi_html: '', //考核KPI
  video_require: '', //录屏要求
  name: '', //项目名称
  click_state: false, //提交按钮禁止双点击
  first_pass:0, //审核是否通过 0 不通过1 通过
})

let rules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '项目名称不能为空！',
  },
  department_id: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请选择下单部门！',
  },
  region_id: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请选择下单来源！',
  },
  push_time: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请选择下单日期！',
  },
  contract_id: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请选择合同！',
  },
  customer_type: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请选择客户类型！',
  },
  employee_id: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请选择销售人员！',
  },
  sales_assistant: {
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请选择销售助理！',
  },
  type: {
    key: 'type',
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请选择投放模式！',
  },
  advertiser_id: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请选择广告主！',
  },
  deal_type: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请选择交易类型！',
  },
  dsp_id: {
    required: true,
    type: 'number',
    trigger: ['blur', 'input'],
    message: '请选择DSP平台！',
  },
  supervise_company: {
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请选择监测公司！',
  },
  settle_standard: {
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请选择结算依据！',
  },
  schedule_file: {
    key: 'schedule_file',
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请上传排期附件！',
  },
  supervise_file: {
    key: 'supervise_file',
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请上传监测附件！',
  },
  email_files: {
    key: 'email_files',
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请上传邮件附件！',
  },
  coo_time: {
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请选择投放周期！',
  },
  materials_infos: {
    required: true,
    trigger: [],
    validator(rule, value) {
      if (value.length <= 0) {
        return new Error('投放素材不能为空！')
      }
      let isItemNull = value.some(item=>{
        return item.name.length <= 0
      })
      if(isItemNull){
        return new Error('素材名称不能为空！')
      }

      if (new Set(value.map(((item) => { return item.name}))).size != value.length) {
        return new Error('存在重名的素材，请修改后重试！')
      }
      if (new Set(value.map(((item) => { return item.path}))).size != value.length) {
        return new Error('存在重名的地址，请修改后重试！')
      }
      return true
    },
  },
  put_level: {
    required: true,
    trigger: ['blur', 'input'],
    message: '投放量级不能为空！',
  },
  put_price_unit: {
    required: true,
    trigger: ['blur', 'input'],
    message: '投放单价不能为空！',
  },
  put_price_all: {
    required: true,
    trigger: ['blur', 'input'],
    message: '投放金额不能为空！',
  },
  settle_kpi_text: {
    key:"settle_kpi_text",
    required: true,
    trigger: ['blur', 'input'],
    message: '考核KPI不能为空！',
  },
  materials_name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入素材名称',
  },
  materials_brands: {
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请选择品牌',
  },
  materials_path: {
    required: true,
    trigger: [],
    message: '请输入素材地址或者上传素材',
  },
  materials_time: {
    required: true,
    type: 'array',
    trigger: ['blur', 'input'],
    message: '请选择日期',
  },
}

let update_status_model: any = reactive({
  id: '', //项目id
  name: '', //项目名称
  coo_start_time: '', //项目开始时间
  coo_end_time: '', //项目结束时间
  company_name: '', // 下单公司
  put_level: '', //项目量级
  put_price_unit: '', //投放单价
  put_price_all: '', //投放金额
  forecast_all_count: '', //预估总量
  forecast_income: '', //预估收入
  settle_kpi: '', //考核KPI
  title: '', //显示title
  state: false, //是否显示
  not_pass_msg: '', //驳回原因
})

let services_status_model: any = reactive({
  subject_id: '', //项目id
  calculate_type: '1', //业务双计状态
  settle_status: '1', //业务结算状态
  settle_price: null, //业务结算价格
  calculate_info: [
    {
      proportion: null, //比例
      user_id: null, //销售人员id
    },
  ], //双计内容
})

// 项目审核数据
let project_status_model: any = reactive({
  project_status_modelRef: {
    id: '', //项目id
    services_status_model: null,
    company_name: '', //公司名称
    coo_end_time: '', //投放结束时间
    coo_start_time: '', //投放开始时间
    forecast_all_count: null, //预测总量
    forecast_income: null, //预测收入
    name: '', //名称
    put_level: '', //投放量级
    put_price_all: '', //投放金额
    put_price_unit: '', //投放单价
    region_id: null, //下单来源(地区id)
    schedule_infos: [
      {
        brands: '', //广告位
        name: '', //产品名称
        return_schedule: '', //返点
        type: 0, //下单单价
      },
    ], //排期数据集合
    status: null, //状态
    sync_crm_time: '', //同步crm时间
    not_pass_msg:"",
  },
})
// crm同步数据
let crm_status_model: any = reactive({
  crm_status_modelRef: {
    services_status_model: null, //公司id
    company_name: '', //公司名称
    coo_end_time: '', //投放结束时间
    coo_start_time: '', //投放开始时间
    forecast_all_count: null, //预测总量
    forecast_income: null, //预测收入
    id: null, //id
    name: '', //名称
    put_level: '', //投放量级
    put_price_all: '', //投放金额
    put_price_unit: '', //投放单价
    region_id: null, //下单来源(地区id)
    schedule_infos: [
      {
        brands: '', //广告位
        name: '', //产品名称
        return_schedule: '', //返点
        type: 0, //下单单价
      },
    ], //排期数据集合
    status: null, //状态
    sync_crm_time: '', //同步crm时间
  },
})
let mediumPreview = reactive({
  subject_id:'',
  subject_name:"",
  subject_period:"",
  put_level:"",
  forecast_all_count:"",
  order_list:[],
})
let mediumPreviewOrderCol = [
  {
    title: '订单名称',
    key: 'name',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '投放模式',
    key: 'type_name',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '媒体',
    key: 'brand_name',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '产品名称',
    key: 'product_name',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '广告位',
    key: 'ad_space_name',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '订单周期',
    key: 'push_time',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '排期量',
    key: 'cpm',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
]
//crm弹窗标题
let templateColumns: any = ref([
  {
    title: '业务类型',
    key: 'name1',
    width: 120,
    fixed: 'left',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: ' ',
    key: 'name',
    width: 120,
    fixed: 'left',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '广告位',
    key: 'brands',
    width: 120,
    fixed: 'left',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '预估收入（元）',
    key: 'return_schedule',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '返点金额（元）',
    key: 'type',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
])
// bos审核数据
let bos_status_model:any = reactive({
    bos_status_modelRef:{
        id: null, //bosid
        project_overview: [], //公司id
        status:null, //送审状态
        status_message:'', //送审信息
    }
})
// bos弹窗标题
let childTemplateColumns: any = ref([
  {
    title: '排期',
    key: 'time',
    width: 120,
    fixed: 'left',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '投放量(CPM)',
    key: 'cpm',
    width: 120,
    fixed: 'left',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '预估收入(元)',
    key: 'forecast_income',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '返点金额(元)',
    key: 'return_price',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '收入送审状态',
    key: 'status',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '收入送审信息',
    key: 'check_info',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
])


const materialsUploadCol:any = ref([
  {
    title: '素材名称（示例：0505_项目_TCL_15s_JD）',
    key: 'name',
    width: 240,
    ellipsis: {
      tooltip: true,
    },
    render (row, index) {
      return h(NInput, {
        value: row.name,
        onUpdateValue (v) {
          model.materials_infos[index].name = v
        },
        style:'width:240px'
      })
    }
  },
  {
    title: '素材地址',
    key: 'path',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
    render(row){
      return h('span',{
        style:'cursor: pointer;',
        onClick:()=>{window.open(row.path)}
        },{default:()=>{return row.path}})
    }
  },
  {
    title: '时长',
    key: 'time_long',
    width: 50,
    ellipsis: {
      tooltip: true,
    },
    render (row) {
      return h('span', {},{default:()=> row.type == 2 ? '无' : `${row.time_long}S`})
    }
  },
  {
    title: '落地页地址',
    key: 'dow_page_url',
    width: 130,
    ellipsis: {
      tooltip: true,
    },
    render (row, index) {
      return h(NInput, {
        value: row.dow_page_url,
        onUpdateValue (v) {
          model.materials_infos[index].dow_page_url = v
        }
      })
    }
  },
  {
    title: '操作',
    key: 'operate',
    width: 100,
    align:'center',
    render (row, index) {
      let  btnGroup:any = ''
      if(row.status != 'noDelete'){
        btnGroup = h(NButton, {
          type:'text',
          style:"margin-left:-10px",
          onClick:()=>{
            model.materials_infos.splice(index,1);
          }
        },{default:()=> "删除"})
      }
      return btnGroup;
    }
  },
])
export default {
  model,
  oldModel,
  rules,
  update_status_model, //通过状态弹窗数据
  services_status_model, //营销服务配置数据
  bos_status_model, //bos配置服务
  childTemplateColumns, //bos配置头
  project_status_model, //项目详情数据
  mediumPreview, //媒介预览
  mediumPreviewOrderCol,
  crm_status_model, //crm配置数据
  templateColumns, //crm配置头
  materialsUploadCol,//投放素材col
}
