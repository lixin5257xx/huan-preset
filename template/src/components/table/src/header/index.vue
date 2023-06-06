<template>
    <div class="table-header">
        <div class="table-thead-box">
        <div class="table-scroll-box" :style="{width:'100%',minWidth:tableOption['scroll-x']+'px'}">
          <template  v-for="(item,index) in tableOption.columns" :key="item.key">
            <wTd :options="optionsList[index]"/>
          </template>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
  import { onMounted,defineProps,watch,reactive,provide,ref } from 'vue'
  import wTd from './td.vue'
  const {tableOption} = defineProps({
    tableOption : {
      type: Object,
    },
  })

  let findFixedLeftList:any = [];
  let findFixedRightList:any = [];
  let resizeInfo=reactive({
    startX:0,
    startWidth:0,//起始宽度
    isResize:false,
    index:-1,//需要拖拽列的下标
  });
  let optionsList = ref([]);


  provide('resizeInfo',resizeInfo)

  /**
   * 自定义表头
   */
  const headerItemOptions = (item,index) => {
    return {
      tdClass:headerItemClass(item,index)+'table-thead-td',
      tdStyle:headerItemStyle(item,index),
      item,
      index,
    }
  }



  const headerItemClass = (item,index) => {
    let appendClass = '';
    if (index != (tableOption.columns.length - 1)) {
      appendClass+= 'border-right-td '
    }
    if(['left','right'].includes(item.fixed)){
      appendClass+= 'header-fixed-'+item.fixed+' ';
    }
    if(item.type == 'selection'){
      appendClass += 'header-selection ';
    }
    return appendClass;
  }
  const headerItemStyle = (item,index) => {
    let itemStyle = {
      backgroundColor:'#fff'
    };
    if(index != tableOption.columns.length-1){
      itemStyle.minWidth =  index == 0 ?  (item.width)+'px' : (item.width-16)+'px';
    }else{
      itemStyle.minWidth = (item.width-16)+'px'
    }
    if(item.hasOwnProperty("fixed")){
      if(item.type == 'selection'){
        itemStyle[item.fixed] = 0;
      }else{
        let targetList= item.fixed == 'left' ? findFixedLeftList : findFixedRightList;
        let fixedIndex =  targetList.findIndex(find=>{
          return find.title == item.title;
        })
        itemStyle[item.fixed] = fixedIndex  == 0  ? 0 : targetList[fixedIndex -1].width+'px';
      }
    }
    return  itemStyle;
  }

  const initFixedList = () => {
    findFixedLeftList=[];
    findFixedRightList=[];
    tableOption.columns.forEach((item,index) =>{
      if (item.hasOwnProperty('fixed') && item.fixed == 'left') {
        findFixedLeftList.push(item);
      }else if(item.hasOwnProperty('fixed') && item.fixed == 'right'){
        findFixedRightList.push(item)
      }
    })
  }

  initFixedList();
  tableOption.columns.forEach((item,index) =>{
    optionsList.value.push(headerItemOptions(item,index));
  })

  /**
   * 如果设置全选 则找到原来table 中的 添加到自定义表头中
   * @param item
   */
  const renderSelection = (item)=>{
    if (item.type == 'selection') {
      let tableCheck = document.querySelector(".n-data-table-th--selection");
      let selectBox =  document.querySelector('.header-selection');
      let targetDom =   document.createElement('div');
      tableCheck.style.border='none';
      tableCheck.style.backgroundColor='#fff';
      targetDom.style.display='flex';
      targetDom.style.justifyContent='center';
      targetDom.append(tableCheck)
      selectBox.append(targetDom);
    }
  }

  /***
   * body因为表头滑动而触发的全局滑动
   * 暂定最小宽度80 后期想一下怎么变成自动获取
   */
  const bodyDragResize = () => {
    let body:any = document.querySelector('body') ;
    body.addEventListener('mousemove',(e)=>{
      if(resizeInfo.isResize){
        let resizeNum = resizeInfo.startWidth + (e.x - resizeInfo.startX);
        tableOption.columns[resizeInfo.index].width = resizeNum > 80 ?  resizeInfo.startWidth + (e.x - resizeInfo.startX) : 80 ;
        optionsList.value[resizeInfo.index].tdStyle=headerItemStyle(tableOption.columns[resizeInfo.index],resizeInfo.index);
      }
    })
    body.addEventListener('mouseup',()=>{
      if (!resizeInfo.isResize) {return;}
      resizeInfo.isResize =  false;
      resizeInfo.index =  -1;
    })
  }

  watch(
      ()=> [tableOption.columns],
      ()=>{
        initFixedList();
        renderSelection(tableOption.columns[0]);
      },
  )

  onMounted(()=>{
    initFixedList();
    if(tableOption.columns.some(item=>{return item.hasOwnProperty('resize')})){
      bodyDragResize();
    }
    renderSelection(tableOption.columns[0]);
  })

</script>

<style scoped>

.table-header{
  display: flex;
  justify-content: space-between;
  align-content: center;
  background-color: #fff;
}

.table-thead-box{
  background-color: #fff;
  width: 100%;
  border-radius: 5px;
  color:#999;
}
.table-scroll-box{
  height: 28px;
  display: table;
  font-weight: 500;
}
.border-right-td::before{
  content: "";
  width: 1px;
  height: 60%;
  text-align: center;
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  background-color: rgba(239, 239, 245, 1);
  display: inline-block;
}
.table-thead-td {
  text-align: left;
  height: 27px;
  line-height: 27px;
  font-size: 14px;
  display: table-cell;
  border-bottom: 1px solid rgba(239, 239, 245, 1);
  position: relative;
  user-select: none;
}
.table-thead-td:not(:first-child){
  padding: 8px;
}
.header-fixed-left,.header-fixed-right{
  position: sticky;
  z-index: 2;
  border-bottom: 1px solid rgba(239, 239, 245, 1);
}
.header-fixed-right::before{
  pointer-events: none;
  content: "";
  width: 1px;
  position: absolute;
  top: 0;
  bottom: -1px;
  left: -1px;
  margin: auto;
  height: 60%;
  display: inline-block;
  background-color: rgba(239, 239, 245, 1);
}

</style>