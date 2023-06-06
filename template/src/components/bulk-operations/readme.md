# 批量操作气泡框

作用：传入一个双向绑定的数组然后内部不管执行什么都会回调父级


  v-model="config.tableOption.checkedRowKeys"
          :options="blukModuleOption"
          @deleteClickOk="deleteClickOk"
          @closeClick="closeClick"
          
v-model 是代表多选的值内部不会修改  
options  
  名字对应内部模块功能key 名 key对应内部模块名 code 对应页面权限名
  delete:{
      key:'delete',
      code:'delete',
  }  
deleteClickOk 批量删除的回调  
closeClick  关闭的回调