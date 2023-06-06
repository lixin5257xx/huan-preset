import { reactive } from 'vue';

/**
 * 初始化获取配置
 * 用于做兜底判断保证参数传参的简化性
 */
export function useConfig(config: any){
    //只有等于方法的时候才实时监控
    let defaultConfig:any =reactive({
        config:{
          label:'',
          filePath:'',
          modelType:'add',
          showUploadTable:true,
          showWatermark:true,//是否展示水印
          editDisabled:false,
          tips: {
              isShowLabelTips: false, //是否需要气泡提示
              content: '',
          },
          downTemplate:{
                label:"",
          },
          importTemplate:{
                label:"",
          },
          downImportedTemplate:{
              label:''
          }
        },
    })
    let keyList = Object.keys(defaultConfig);
    keyList.forEach(item =>{
        if (config.hasOwnProperty(item)) {
            if(Object.prototype.toString.call(defaultConfig[item]) == Object.prototype.toString.call(config[item])){
                config[item] = Object.assign(defaultConfig[item],config[item]);
            }
        }
    })
    return config;
}