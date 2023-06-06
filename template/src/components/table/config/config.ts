import { reactive } from 'vue';
import _ from 'lodash';

function initResize(config){
    window.onresize = () => {
        config.tableOption.maxHeight = config.tableOption.realMaxHeight();
    }
}

/***
 * 重置表头总长度.
 * @param colArr 所有配置列
 * @param options 默认列表配置项
 * @return  options 会返回一个计算成并加入scrool-x 属性的 table 配置项。
 */
export function resizeScrollXSize(colArr,options){
    if (_.isEmpty(colArr)) {
        return ;
    }
    options ['scroll-x'] = colArr.reduce((total,item)=>{
        if (item.hasOwnProperty("width")) {
            return total+item.width;
        }
    },0)

    return options;
}


/**
 * 初始化获取配置
 * 用于做兜底判断保证参数传参的简化性
 */
export function useConfig(config: any){
    //只有等于方法的时候才实时监控
    if (typeof config.tableOption.maxHeight == 'function') {
        config.tableOption.realMaxHeight =  config.tableOption.maxHeight;
        config.tableOption.maxHeight = config.tableOption.realMaxHeight();
        initResize(config)
    }else{
        config.tableOption.maxHeight = ()=> undefined;
    }
    let defaultConfig:any =reactive({
        moduleColOptions : {
            add:{
              isShow:false,
              code:"",
              title:"",
            },
            search:{
                isShow:false,
                code:"",
                placeholder:'',
                value:'',
            },
            down:{
                isShow:false,
                code:"",
            },
            filter:{
                isShow:false,
                code:"",
            },
            custom:{
                isShow:false,
                code:'',
            }
        },
        paginationOption:{},
        selectOptions:{},
        tableOption:{
            checkedRowKeys:[],
            isShowHead:true,
            isSecTableHead:false,//是否使用二次封装表头
            isAffixSeach: false,//是否固定搜索区域
            isAffixTableHeader: false, //是否全局固定表头
        },
    })
    defaultConfig.tableOption =  resizeScrollXSize( config.tableOption.columns, defaultConfig.tableOption)

    for (let key in config.selectOptions) {
        let item =  config.selectOptions[key];
        if (item.hasOwnProperty('defaultValue') && item.options.type == 'select') {
            let isExist =  item.options.options.findIndex(find => {
                return  find.value == item.defaultValue.value
            })
            if (isExist >= 0) {
                config.selectOptions[key].options.options[isExist] = item.defaultValue;
            }else{
                config.selectOptions[key].options.options.unshift(item.defaultValue);
            }
        }
    }


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