<!--
 * @Author: lixinxin lixinxin@huan.tv
 * @Date: 2023-02-09 19:02:42
 * @LastEditors: lixinxin lixinxin@huan.tv
 * @LastEditTime: 2023-02-13 15:09:16
 * @FilePath: \operation-web\src\components\edit-name\index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<template></template>
<script lang="ts">
import { ref, h, defineComponent, nextTick } from 'vue'
import { NButton, NInput, NTooltip } from 'naive-ui'
import { EditOutlined } from '@vicons/antd'
import { nullLiteral } from '@babel/types'
export default defineComponent({
    name: 'ShowOrEdit',
    props: {
        value: [String, Number],
        onUpdateValue: [Function, Array],
    },
    setup(props) {
        const isEdit = ref(false)
        const inputRef = ref(null)
        const inputValue = ref(props.value)
        const isShowIcon = ref(false)
        function handleOnClick() {
            isEdit.value = true
            nextTick(() => {
                inputValue.value = props.value
                inputRef.value.focus()
            })
        }
        function handleChange() {
            props.onUpdateValue(inputValue.value)
            isEdit.value = false
        }
        function handleMouseOver() {
            isShowIcon.value = true
        }
        function handleMouseLeave() {
            isShowIcon.value = false
        }
        return () =>
            h(
                'div',
                {
                    class: 'edit-box',
                    style: 'min-height: 22px',
                    onMouseover: handleMouseOver,
                    onMouseout: handleMouseLeave,
                },
                [
                    isEdit.value
                        ? h(NInput, {
                            ref: inputRef,
                            value: inputValue.value,
                            maxlength: 60,
                            onUpdateValue: (v) => {
                                inputValue.value = v
                            },
                            onBlur: handleChange,
                        })
                        : h(
                            NTooltip,
                            null,
                            {
                                trigger() {
                                    return h(
                                        'span',
                                        {
                                            class: 'txt-ellipsis',
                                        },
                                        props.value
                                    )
                                },
                                default: () => h(
                                    'span',
                                    {
                                    },
                                    props.value
                                )
                            }
                        ),
                    // : h(
                    //     'span',
                    //     {
                    //         class: 'txt-ellipsis',
                    //     },
                    //     props.value
                    // ),
                    !isEdit.value
                        ? h('div', {
                            className: 'edit-box'
                        }, [
                            h(EditOutlined, {
                                class: 'icon-edit',
                                onClick: handleOnClick,
                                style: {
                                    display: isShowIcon.value ? '' : 'none',
                                },
                            })
                        ])
                        : '',
                ]
            )
    },
})
</script>
