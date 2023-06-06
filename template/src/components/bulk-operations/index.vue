<template>
  <div class="bluk-box">
    <div v-if="isShow" class="bulk-operations">
        <div class="bluk-left-box">
          已选择<span class="bluk-count">{{ modelValue.length}}</span>项
          <div class="bluk-module">
            <template v-for="item in moduleList" :key="item.code">
              <div v-permissions="item.code" class="bluk-item">
                <n-button  text class="bluk-btn" @click="bulkOperations(item)">
                  <n-icon>
                    <component :is="item.icon"></component>
                  </n-icon>
                  &nbsp;{{item.label}}
                </n-button>
              </div>
            </template>
          </div>
        </div>
        <div class="bluk-right-box">
          <n-button @click="closeClick('closeClick')"  text  class="bluk-close-btn" >
            <n-icon><CloseOutline/></n-icon>
          </n-button>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CloseOutline } from '@vicons/ionicons5'
  import {  useDialog } from 'naive-ui'
  import { ref, defineEmits, defineProps, watch } from 'vue'
  import { useBulk, useEmit } from './config/config'
  const emits = defineEmits(useEmit())
  let props = defineProps(['modelValue','options']);
  const moduleList  = useBulk(props.options)
  const isShow = ref(false);
  const dialog = useDialog();

  const bulkOperations = (item)=>{
    dialog.warning({
      title: '提示',
      content: `当前已选中${props.modelValue.length}个选项，${item.prompt}?`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        emits('update:modelValue',[]);
        emits(item.emitsKey,props.modelValue)
      },
    })
  }

  const closeClick = (emitsKey:string) => {
    emits('update:modelValue',[])
    emits(emitsKey,[])
  }

  watch(
      () => props.modelValue,
      val => {
        isShow.value = props.modelValue.length > 0 ;
      }
  )

</script>

<style>
  .bluk-box{
    display: flex;
    justify-content: center;
  }
  .bulk-operations{
    position: fixed;
    bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
  }
  .bluk-left-box{
    height: 52px;
    border-radius: 50px;
    padding: 0px 40px;
    box-shadow: var(--theme-box-shadow);
    line-height: 52px;
    background-color: #fff;
    font-size: 14px;
  }
  .bluk-right-box{
    height: 52px;
    width: 52px;
    border-radius: 50%;
    margin-left: 20px;
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--theme-box-shadow);
    background-color: #fff;
  }
  .bluk-close-btn{
    font-size: 30px;
    vertical-align: middle;
  }
  .bluk-module{
    margin-left: 20px;
    display: inline-flex;
    vertical-align: middle;
  }
  .bluk-item:not(:last-child){
    line-height: 52px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
  }
  .bluk-btn{
    font-size: 14px;
    font-weight: 600;
    color: #000000;
  }
  .bluk-count{
    color: var(--theme-color);
    font-weight: 600;
    font-size: 15px;
    margin: 0px 5px;
    vertical-align: baseline;
  }

</style>