/*
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2022-11-07 18:18:35
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2022-11-08 10:04:08
 * @FilePath: \operation-web\src\views\role\use\role.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by lixinxin lixinxin@huan.tv, All Rights Reserved. 
 */
import { reactive } from 'vue'
let model = reactive({
    id:"", //id
    name:"", //角色名称
    des:"", //描述
    menu_id_list:[], //权限列表
})

let rules = {
    name:{
        required:true,
        trigger:['blur','input'],
        message:"角色名称不能为空！",
    },
    menu_id_list:{
        required:true,
        type:"array",
        trigger:['blur','input'],
        message:"角色权限不能为空！",
    }
}

export default {
    model,
    rules
}