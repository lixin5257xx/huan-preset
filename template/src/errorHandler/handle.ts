import {ERROR_MAP_LIST} from './error';

export const errorHandler = new function (){
    return {
        /**
         * 监管可能会error的问题
         */
        intercept:(fn:Function)=>{
            try{
                fn()
            }catch (error){
                window.$notification['error']({
                    content: '错误提示',
                    meta: '页面好像出了点问题，请刷新重试！',
                    duration: 0,
                })
            }
        },
        getErrorCodeHandler:(error:string)=>{
            if (error) {
                let targetError =  ERROR_MAP_LIST.find((item)=> error.includes(item.code))
                if (targetError) {
                    window.$notification['error']({
                        content: '错误提示',
                        meta: targetError.msg,
                        duration: 0,
                    })
                }
            }
        }
    }
}