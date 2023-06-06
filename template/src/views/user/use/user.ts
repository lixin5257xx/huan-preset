import { reactive } from 'vue'
let model = reactive({
    name:"",
    email:"",
    phone:"",
    password:"",
    des:"",
    role_id:undefined,
    region_type:1,//销售区域类型
    region_list:[],
    rank:-1,
    auto_flag:0,
})

let rules = {
    name:{
        required:true,
        trigger:['blur','input'],
        message:"账号名称不能为空！",
    },
    email:{
        required:true,
        trigger:['blur','input'],
        validator (rule , value ) {
            let  emailRule =/^(.+)@(.+)$/;
            if (value.length <= 0 ) {
                return new Error('电子邮箱不能为空！')
            } else if (!value.match(emailRule)) {
                return new Error('电子邮箱格式不正确，请重新输入！')
            }
            return true
        },
    },
    phone: {
        required: true,
        trigger: ['blur', 'input'],
        validator(rule, value) {
            if (value.length <= 0) {
                return new Error('手机号不能为空！')
            } else if (!/^1[3-9]\d{9}$/.test(value)) {
                return new Error('手机号格式不正确，请重新输入！')
            }
            return true
        },
    },
    password:{
        required:true,
        trigger:['blur','input'],
        validator(rule, value) {
            if (value.length <= 0) {
                return new Error('密码不能为空！')
            } else if (!/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[0-9a-zA-Z,\\.]{8,20}$/.test(value)) {
                return new Error('密码必须包括数字、大小写英文字母，长度8-20位！')
            }
            return true
        },
    },
    des:{
        required:true,
        trigger:['blur','input'],
        message:"描述不能为空！",
    },
    role_id:{
        required:true,
        type:"number",
        trigger:['blur','input'],
        message:"角色不能为空！",
    },
    auto_flag:{
        required:true,
        type:"number",
        trigger:['blur','input'],
        message:"程序化不能为空！",
    },
    region_list:{
        required:true,
        type:"array",
        trigger:['blur','input'],
        message:"销售区域不能为空！",
    }
}

export default {
    model,
    rules
}