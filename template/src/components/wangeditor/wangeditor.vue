<!--
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-04-25 20:02:35
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-05-24 19:07:08
 * @FilePath: \operation-web\src\components\wangeditor\wangeditor.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div style="border: 1px solid #ccc" @click="clickFoucus" id="editDom">
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" v-model="valueHtml"
            :style="{ height: editorHeight + 'px', maxHeiht: '800px', overflowY: 'hidden'}"
            id='editorBox'
            @onCreated="handleCreated"
            @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus" @onBlur="handleBlur"
            @customPaste="customPaste" :defaultContent="defaultContent" />
    </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef , nextTick, watch, onUpdated } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IToolbarConfig, DomEditor } from '@wangeditor/editor'
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()
const props = defineProps(['toolbarKeys', 'value', 'valueHtml', 'height', 'defaultContent', 'hoverbarKeys', 'maxLength'])
const emits = defineEmits(['getHtml', 'getText', 'handleBlur', 'handleFocus'])
const editorHeight = ref(props.height);
// 内容 HTML
const valueHtml = ref('')
watch(
    () => props.valueHtml,
    (newValue) => {
        // if (newValue != '<p><br></p>') {
        //     valueHtml.value = newValue;
        //     const editor = editorRef.value
        //     if (editor == null) return
        //     editor.setHtml(valueHtml.value);
        // }
    },
    { deep: true }
);
const toolbarConfig: Partial<IToolbarConfig> = {  // TS 语法
    // /* 工具栏配置 */
    toolbarKeys: props.toolbarKeys || []
}
// console.log('config', toolbarConfig.getConfig())
const editorConfig = {
    placeholder: '请输入内容...',
    hoverbarKeys: {
        'text': {
            menuKeys: props.hoverbarKeys || [], // 定义你想要的 menu keys
        }
    },
    maxLength: props.maxLength || null,
    autoFocus: false
}

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

onUpdated(()=>{
    props.valueHtml = props.valueHtml ? props.valueHtml : ''
    editorRef.value&&editorRef.value.setHtml(props.valueHtml);
})

const handleChange = (editor) => {
    console.log('editor.getHtml()', editor.getHtml())
    console.log('editor.getText()', editor.getText())
    if (editor.getHtml() == '<p><br></p>') {
        emits('getHtml', '')
    } else {
        emits('getHtml', editor.getHtml())
    }
    emits('getText', editor.getText())
}
const handleDestroyed = (editor) => {
    console.log('destroyed', editor)
}
const handleFocus = (editor) => {
  emits('handleFocus')
}
const handleBlur = (editor) => {
  console.log(editorRef.value.getConfig());
  emits('handleBlur')
}

const customPaste = (editor, event, callback) => {
    const text = event.clipboardData.getData('text/plain')
    if (editor == null) return
    // 自定义插入内容
    editor.insertText(text)
    // 返回值（注意，vue 事件的返回值，不能用 return）
    callback(false) // 返回 false ，阻止默认粘贴行为
    // callback(true) // 返回 true ，继续默认的粘贴行为
}

const clickFoucus = () => {
  editorRef.value.focus();
}
const printHtml = () => {
    const editor = editorRef.value
    if (editor == null) return
}

const disable = () => {
    const editor = editorRef.value
    if (editor == null) return
    editor.disable()
}
</script>

<style>
.w-e-text-placeholder{
  font-style: inherit !important;
}
.w-e-scroll>div{
    padding:6.5px 10px !important;
}
/* #editorBox{
    font-size: 14px;
}
#editorBox span{
    line-height:16px !important;
} */
#editDom .w-e-text-container p{
    margin:0 !important;
    font-size: 14px;
}
#editDom .w-e-text-container{
  line-height: 10px;
}
</style>