参数调用:  
## tableOption 表格配置

|  参数名   | 类型  |  默认值   |  说明  |
|  ----  | ----  |  ----  | ----  |
| data  | object  | object  | 表格源数据 |
| columns  | object | object  | 表头配置 |
| pagination  | object | object  | 分页配置 |  

[table 详细配置](https://www.naiveui.com/zh-CN/light/components/data-table)

## columns 表格配置 除了库里自带的属性值外，以下为扩展属性
|  参数名   | 类型  |  默认值   |  说明  |
|  ----  | ----  |  ----  | ----  |
| resize  | boolean  | false  | 选填，是否让当前列可拖拽，当设置此值时，必须设置唯一key |
| key  | string | '' | 必填，当前字段设置的key |
| turnKey  | string | '' | 当用于树形table时，表明自身原本key |
| fixed  | string | null | 选填,设置此值会固定，需要表明的是，现在拖拽列，由于暂时没有加入限制所以，会导致拖拽时，超过固定列。这里暂时不做需求项去修复 |

## moduleColOptions 功能模块配置

|  参数名   | 类型  |  默认值   |  说明  |
|  ----  | ----  |  ----  | ----  |
| down   | object()=> {isShow:true,code:"down"}  | {isShow:false,code:""}  | 选填,用于控制下载模块是否显示 |
| filter  | object()=> {isShow:true,code:"filter"} | {isShow:false,code:""}  | 选填,用于控制筛选模块是否显示 |  
| custom  | object()=> {isShow:true,code:"custom"} | {isShow:false,code:""}  | 选填,用于控制自定义列模块是否显示 |  
| search  | object()=> {isShow:true,code:"custom",placeholder:'',value:'',key:''} | {isShow:false,code:"",placeholder:'',value:''}  | 选填,用于控制搜索模块是否显示 , key 仅用于 表明调用他的字段名 |  
| add     | object()=> {isShow:false,code:"",title:'新建'} | {isShow:false,code:"",placeholder:'',value:''}  | 选填,用于控制新增是否显示,如果选择穿此值 title 为必须 |  


## moduleColOptions custom 使用配置
需要在 tableOption.columns 中 将需要的自定义类 加入 custom:true, 加入此字段将当前列设为自定义列  
true 为默认展示 false 为默认不展示

## moduleColOptions childrenOption 功能模块内部配置

|  参数名   | 类型  |  默认值   |  说明  |
|  ----  | ----  |  ----  | ----  |
| isShow  | boolean  | false  | 选填,用于控制模块是否显示 |
| code  | string | '' | 选填,用于判断当前用户权限是否包含此模块 |
| placeholder  | string | '' | 选填,只有搜索模块需要用到此值，其他模块不需要穿此值 |
| value  | string | '' | 选填,只有搜索模块需要用到此值，其他模块不需要穿此值 |

## selectOptions array 筛选配置 整个值可以不填，但是如果设置了 筛选模块展示此值为必填

|  参数名   | 类型  |  默认值   |  说明  |
|  ----  | ----  |  ----  | ----  |
| options  | object()=> {label:'',value:'',type:"",placeholder:"",key:''}  | 无  | 必传,用于配置筛选 内部生成不同组件标签 type类型 根据 ui库自身来支持的type进行生成 select 则就是'select' （'text' | 'password' | 'textarea' |'date' | 'datetime' | 'daterange' | 'datetimerange' | 'month' | 'year' | 'quarter'）key在内部没有任何使用 仅为了方便回调判断用  |
| defaultValue  | object()=> {label: "",value: ''} | 无  | 必传,绑定默认该组件的默认值 |

> 并且 defaultValue 代表初始值，value 代表绑定值， 如果options 中的options 没有包含 defaultValue 则会合并。


## methods 方法回调

``` js
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
```
## 思路
该组件 内部不加入任何请求方法的执行，将二次封装的组件只做展示

当操作必要的筛选项时，需向外暴露回调函数。

如果使用插槽时，同时方法也会在外面，保证 请求函数 一直在父组件可以调用

另外 由于分页需要独立使用，并且进行封装所以，需要传入tableOption > pagination
和 paginationOption 都需要传入相同配置分页, 才生效,组件内部会隐藏table 自带的分页,使用自己封装的分页

现在属于 权限判断还没加，分页和新增和批量操作都悬浮在底下。