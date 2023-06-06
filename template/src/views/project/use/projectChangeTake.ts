import {
  ref,
  reactive,
  nextTick,
  Ref,
  h,
  RendererElement,
  RendererNode,
  VNode,
} from 'vue'
export const useState = () => {
  const model:any = reactive({
    range: '',
    create_time_start: '',
    create_time_end: '',
  })

  return {
    model,
  }
}
