<script>
import {h,defineComponent,inject} from 'vue'

export default defineComponent({
    name:"w-td",
    props:['options'],
    setup(props){
      const resizeInfo= inject('resizeInfo')
      const options =  props.options;
      let titleDom;
      let result=[];
      if(options.item.hasOwnProperty('title') && typeof(options.item.title) == 'function'){
        titleDom =  options.item.title(options.item);
      }else {
        titleDom =  options.item.title
      }
      return ()=> h('div',
          {
            class:options.tdClass,
            style:options.tdStyle,
          },
          {
            default:()=>{
              let result = [];
              result.push(h('span', titleDom));
              if(options.tdClass.includes('border-right-td') && options.item.hasOwnProperty("resize") && options.item.resize){
                result.push(h('div',{ class:'border-resize',
                  onMousedown:(e)=>{
                    resizeInfo.startX=e.x;
                    resizeInfo.isResize=true;
                    resizeInfo.index=options.index;
                    resizeInfo.startWidth=options.item.width;
                  },
                },[
                   h('div',{ class:resizeInfo.index == options.index ? ['resize-line', 'resize-line-active'] : 'resize-line'},{})
                ]))
              }
              return result;
            }
          })
    },
})
</script>
<style>
.border-resize{
  position: absolute;
  height: 100%;
  width: 10px;
  top: 0px;
  right: -5px;
  z-index: 9;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}
.border-resize:hover .resize-line{
  opacity: 1;
}
.resize-line{
  height: 100%;
  width: 2px;
  background-color: var(--theme-color);
  opacity: 0;
}
.resize-line-active{
  opacity: 1;
}
</style>