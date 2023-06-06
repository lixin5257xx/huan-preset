import { reactive } from 'vue';

/**
 * 初始化获取配置
 * 用于做兜底判断保证参数传参的简化性
 */
export function useConfig(config: any){
    //只有等于方法的时候才实时监控
    let defaultConfig:any =reactive({
        takeTipsProps : {
            title:"本次修改涉及敏感内容，具体原因请看下方",
            type:"default",
            bordered:false,
            content:'',//原因
        },
        formProps:{
            labelPlacement:"left",
            requireMarkPlacement:"right-hanging",
            labelWidth:"100px"
        },
        blockList:[],
        newDetail:{},
        oldDetail:{},
        anchorLinkProps:{
            isShow:false,
        }
    })
    let keyList = Object.keys(defaultConfig);
    keyList.forEach(item =>{
        if (config.hasOwnProperty(item)) {
            if(Object.prototype.toString.call(defaultConfig[item]) == Object.prototype.toString.call(config[item])){
                config[item] = Object.assign(defaultConfig[item],config[item]);
            }
        }
    })
    console.log(config);
    return config;
}