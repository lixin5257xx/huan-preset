<!--
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-04-25 20:02:35
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-04-26 11:00:14
 * @FilePath: \operation-web\src\views\order\components\Wangeditor.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template>
    <div style="border: 1px solid #ccc">
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" v-model="valueHtml" style="height: 400px; overflow-y: hidden;"
            @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus"
            @onBlur="handleBlur" @customAlert="customAlert" @customPaste="customPaste" />
    </div>
</template>
<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, ref, shallowRef, onMounted, nextTick, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IToolbarConfig, DomEditor } from '@wangeditor/editor'
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()
const props = defineProps(['toolbarKeys', 'value'])
const emits = defineEmits(['getVal'])
// 内容 HTML
const valueHtml = ref('')
watch(
    () => props.value,
    (newValue, oldValue) => {
        valueHtml.value = newValue
    },
    { deep: true }
);
const toolbarConfig: Partial<IToolbarConfig> = {  // TS 语法
    // /* 工具栏配置 */
    toolbarKeys: props.toolbarKeys || []
}
// console.log('config', toolbarConfig.getConfig())
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return

    editor.destroy()
})

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
    console.log('change:', editor.getHtml());
    emits('getVal', editor.getHtml())
}
const handleDestroyed = (editor) => {
    console.log('destroyed', editor)
}
const handleFocus = (editor) => {
    console.log('focus', editor)
}
const handleBlur = (editor) => {
    console.log('blur', editor)
}
const customAlert = (info, type) => {
    alert(`【自定义提示】${type} - ${info}`)
}
const customPaste = (editor, event, callback) => {
    console.log('ClipboardEvent 粘贴事件对象', event)

    // 自定义插入内容
    editor.insertText('xxx')

    // 返回值（注意，vue 事件的返回值，不能用 return）
    callback(false) // 返回 false ，阻止默认粘贴行为
    // callback(true) // 返回 true ，继续默认的粘贴行为
}

const insertText = () => {
    const editor = editorRef.value
    if (editor == null) return
    editor.insertText('hello world')
}

const printHtml = () => {
    const editor = editorRef.value
    if (editor == null) return
    console.log(editor.getHtml())
}

const disable = () => {
    const editor = editorRef.value
    if (editor == null) return
    editor.disable()
}
</script>
