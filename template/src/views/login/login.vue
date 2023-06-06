<template>
  <div class="login">
      <div class="login-box">
          <div :class="flags.status ? 'login-box-left':'login-box-left forget-password'" id="login">
          <div class="login-content">
            <n-h2>欢迎使用</n-h2>
            <n-h1 class="login-title">
              <img src="../../assets/images/logo.png">
            </n-h1>
            <div class="login-input-box">
              <p>邮箱：</p>
              <n-input class="login-input" size="large" v-model:value="loginParams.username" type="text" placeholder="输入有效邮箱" />
            </div>
            <div class="login-input-box"  @keyup.enter.native="login()">
              <p>密码：</p>
              <n-input class="login-input" size="large" type="password" show-password-on="click" v-model:value="loginParams.password"  placeholder="输入密码" />
            </div>
            <n-space class="login-input-box" align="center">

            </n-space>
            <n-button class="login-submit" size="large" @click="login" type="primary" :disabled="loginLoading" :loading="loginLoading">
              登录
            </n-button>
            <n-space class="login-operate" justify="space-between" align="center">
              <n-button text @click="handleForgetPassword">
                忘记密码
              </n-button>
              <n-checkbox size="small" label="记住密码"  />
            </n-space>
          </div>

          <div class="password-content">
            <n-h1 class="login-title">重置密码</n-h1>
            <div class="login-input-box">
              <p>邮箱：</p>
              <n-input class="login-input" size="large" v-model:value="passwordParams.email" type="text" placeholder="输入有效邮箱" />
            </div>
            <div class="login-input-box" @keyup.enter.native="handleChangePassword()">
              <p>新密码：</p>
              <n-input class="login-input" size="large" type="password" v-model:value="passwordParams.password"  placeholder="输入新密码" />
            </div>
            <div class="login-input-box" @keyup.enter.native="handleChangePassword()">
              <p>确认密码：</p>
              <n-input class="login-input" size="large" type="password" v-model:value="passwordParams.confirmPassword"  placeholder="输入确认新密码" />
            </div>
            <div class="login-input-box captcha-code-content" @keyup.enter.native="handleChangePassword()">
              <p>验证码：</p>
              <n-input class="login-input" size="large" type="password" v-model:value="passwordParams.code"  placeholder="输入验证码" />
              <n-button type="warning" class="captcha-code" @click="handleCaptchaCode" :disabled="flags.isDisabled">{{flags.buttonName}}</n-button>
            </div>
            <n-space class="login-input-box" align="center">

            </n-space>
            <n-button class="login-submit" size="large" @click="handleChangePassword" type="primary">
              提交
            </n-button>
            <n-space class="login-operate" justify="space-between" @click="handleGoLogging" align="center">
              <n-button text>
                立即登录
              </n-button>
            </n-space>
          </div>
        </div>
        <div class="login-box-right">
          <img src="../../assets/login/login.png"/>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import {reactive,ref} from 'vue'
import {useRouter} from "vue-router";
import {getUserPermissNextPath} from '@/config/router'
import useStore  from '@/config/pinia';
import { nullLiteral } from '@babel/types';
import {rasEncrypt } from '@utils'
import { cloneDeep } from 'lodash'
const router = useRouter();
const flags = reactive({
  buttonName:'点击获取验证码',
  isDisabled:false,
  time: 59,
  status:true, //
})
const loginParams = reactive({
  username:'',
  password:'',
  grant_type:'password',
  scope:'all'
})
let  params = cloneDeep(loginParams);
const loginLoading = ref(false);
const login = async () => {
  let { username, password } = loginParams;
  params.username = rasEncrypt(loginParams.username);
  params.password = rasEncrypt(loginParams.password);
  username = username.replaceAll(' ','');
  if (username.length == 0  || password.length == 0) {
    window.$message.error('邮箱或密码不能为空')
    return '';
  } else if(username !== '' && !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(username)){
    window.$message.error('邮箱格式不正确')
    return '';
  }
    loginLoading.value = true ;
  try{
    await useStore().login(params);
    window.$message.success('登录成功！');
    router.push(getUserPermissNextPath());
  }catch (err){
    loginLoading.value = false ;
  }
}
// 修改密码参数
const passwordParams = reactive({
  code:'',
  email:'',
  password:'',
  confirmPassword:''
})
// 提交新密码
const handleChangePassword = async () =>{
  let { code, email,password,confirmPassword } = passwordParams
  if (confirmPassword!==password) {
    window.$message.error('确认密码和新密码不一致')
    return '';
  } else if (code.length == 0  || email.length == 0 || password.length ==0 || confirmPassword.length==0) {
    window.$message.error('邮箱、密码、确认密码、验证码均不能为空')
    return '';
  } else if(code.length !== 6 ){
    window.$message.error('验证码不为6位数')
    return '';
  } else if(email !== '' && !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)){
    window.$message.error('邮箱格式不正确')
    return '';
  } else if(password !== '' && !/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[0-9a-zA-Z,\\.]{8,20}$/.test(password)){
    window.$message.error('密码必须含有数字；必须含有大小写英文字母，长度8-20位')
    return '';
  } else if(confirmPassword !== '' && !/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[0-9a-zA-Z,\\.]{8,20}$/.test(confirmPassword)){
    window.$message.error('确认密码必须含有数字；必须含有大小写英文字母，长度8-20位')
    return '';
  } else{
    let code = await useStore().ChangePassword(passwordParams)
    if (code == '200') {
      handleGoLogging();
      window.$message.success('修改成功，请重新登录')     
    }
  }
}
// 切换忘记密码
const handleForgetPassword = async () =>{
  flags.status = false
}
// 切换登录
const handleGoLogging = async () =>{
  flags.status = true
}
// 发送验证码
const handleCaptchaCode = async () =>{
  let { email } = passwordParams
  if(email.length==0){
    window.$message.error('邮箱不能为空')
  } else if( email !== '' && !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)){
    window.$message.error('邮箱格式不正确')
    return '';
  }
  else{
    flags.buttonName = "loading……"
    let code = await useStore().CaptchaCode(email);
    if (code == '200') {
      window.$message.success("发送成功！请在十分钟之内输入验证码");
      flags.isDisabled = true;
      const interval = window.setInterval(() => {
        flags.buttonName = flags.time + "秒后重新发送";
        --flags.time;
        if (flags.time < 0) {
          flags.buttonName = "重新发送";
          flags.time = 60;
          flags.isDisabled = false;
          window.clearInterval(interval);
        }
      }, 1000);
    } else {
        flags.buttonName = "点击获取验证码"
    }
  }
}
</script>
<style scoped>
.login{
user-select: none;
background-color: #FAFAFA;
height: 100vh;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
}
.login-box{
width: 800px;
height: 500px;
border-radius: 5px;
background-color: #fff;
box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
}
.login-box-left{
width: 320px;
padding: 40px;
position: relative;
vertical-align: top;
display: inline-block;
}
.login-content,.password-content{
position: absolute;
top:40px;
transition-duration: .4s;
width: 320px;
z-index: 1;
}
.login-content{
left:40px;
}
.password-content{
left: 440px;
opacity: 0;
}
.login-box-right{
width: 400px;
height: 500px;
vertical-align: top;
font-size: 0px;
display: inline-block;
position: absolute;
z-index: 2;
}
.login-box-right img{
height: 540px;
position: absolute;
top: -37px;
}
.login-title{
padding-bottom: 24px;
}
.login-title img {
  width: 80%;
}
.login-input-box{
margin-top: 40px;
display: flex;
justify-content: center;
align-items: center;
}
.login-input-box p{
width: 17%;
font-size: 14px;
color: #999999;
}
.login-input{
width: 83%;
}
.login-submit{
width: 100%;
margin-top: 40px;
}
.login-operate{
margin-top: 40px;
display: flex;
justify-content: space-around;
}
.forget-password .login-content{
transform: translateX(400px);
opacity: 0;
}
.forget-password .password-content{
transform: translateX(-400px);
opacity: 1;
}
.password-content .login-input-box{
margin-top: 20px;
}
.password-content .login-input-box p{
width: 27%;
font-size: 14px;
color: #999999;
}
.captcha-code-content{
position: relative;
}
.captcha-code{
position: absolute;
right: 3px;
top:3px;
}
</style>