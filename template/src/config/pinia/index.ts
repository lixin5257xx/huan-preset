import { defineStore } from "pinia";
import { setLocalData , getLocalData } from "@utils";
import { loginApi, loginOutApi, getUserInfoApi, getSysMenuListApi,SendCaptchaCodeApi,ChangePasswordApi,updateColumnsApi,getColumnsInfoApi } from '@/config/api'
import { CollectionsFilled } from "@vicons/material";

const INIT_TOKEN = {
  access_token:"",
  token_type:"",
  refresh_token:"",
  expires_in:0,
  scope:''
}
const INIT_USERS = {
  authorities:[],
  id:undefined,
  name:"",
};
const INIT_PERMISSIONS = {
  source:[],
  codeList:[],
}


const INIT_STATE = {
  users: getLocalData("users") || INIT_USERS,
  tokenData: getLocalData("token-data") || INIT_TOKEN,
  permissionsData: getLocalData("permissions-data") || INIT_PERMISSIONS,
  isRemove: false,
  project:{
    isOperate:true,
  },
  screenTemplate:{
    isOperate:true,
  },
  user:{
    isOperate:true,
  },
  role:{
    isOperate:true,
  },
  order:{
    isOperate:true,
  },
  orderChangeTake:{
    isOperate:true,
  },
  projectChangeTake:{
    isOperate:true,
  }
};

const useStore:any =  defineStore( 'storeData', {
  state: () => {
    return INIT_STATE
  },
  actions: {
    /**
     * 根据token 刷新用户信息
     */
    async refreshUserInfo(){
      let { data } =  await getUserInfoApi();
      this.users = data;
      await setLocalData('users',data);
      return data;
    },
    /**
     * 获取所有权限集合
     */
    async getSysMenuList(){
      let { data } =  await getSysMenuListApi();
      this.permissionsData.source = data;
      this.permissionsData.codeList =  data.map(item=>{
        return item.perms
      })
      await setLocalData('permissions-data', this.permissionsData);
      return data;
    },
    /**
     * 登录
     * @param params
     */
    async login(params: any){
      //先请求
      let { data } =  await loginApi(params);
      this.tokenData = data;
      await setLocalData("token-data", this.tokenData);
      //刷新用户信息
      await this.refreshUserInfo();
      await this.getSysMenuList();
    },
    loginOut(){
      this.isRemove = true;
      loginOutApi().then(res=>{
        localStorage.clear();
        this.$reset();
        this.isRemove = false;
      });
    },
     /**
     * 发送验证码
     */
    async CaptchaCode(email:string){
      try{
        let captcha = await SendCaptchaCodeApi(email);
        return captcha.code
      }
      catch(res){
        console.error(res)
      }
    },
    /**
     * 重置密码
     */
    async ChangePassword(params: any){
      try{
        let changePassword =  await ChangePasswordApi(params);
        return changePassword.code
      } catch(res){
        console.error(res)
      }
    },
    /**
     * 自定义列保存
     */
    async CustomAdd(params:any){
      await updateColumnsApi(params);
      return true;
    },
    /**
     * 自定义列、页面操作查询
     */
    async GetCustomPageInfo(params:any){
      return  getColumnsInfoApi(params);
    }
  },
  getters: {
    getPower: (state: any) => (id: string[] | string) => {
      let codeList =state.users.authorities;
      if(codeList.length <= 0 ){
        return false;
      }
      if (Array.isArray(id)) {
        return id.some(function(item: string) {
          return codeList.includes(item);
        });
      } else {
        return codeList.includes(id);
      }
    },
    /**
     * 获取用户信息
     */
    getUserInfo : (state:any) => {
      return  {...state.users,...state.tokenData};
    },
  }
});

export default useStore