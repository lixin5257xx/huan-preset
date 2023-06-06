<template>
    <n-input-group :span="24">
        <n-input
            :style="{ width: '25%' }"
            v-model:value="parameter.key"
            clearable
            placeholder="请输入参数名称"
        />
        <n-input
            :style="{ width: '25%' }"
            v-model:value="parameter.value"
            clearable
            placeholder="请输入参数值"
        />
        <n-select
            :style="{ width: '25%' }"
            v-model:value="parameter.type"
            clearable
            placeholder="请选择参数类型"
            :options="parameterOptions"
        />
        <n-gi :span="3" style="margin-top:5px;">
            <div class="add-icon-box">
                <n-icon @click="addParams" v-if="props.length - 1 == index">
                    <AddCircle28Regular />
                </n-icon>
                <n-icon @click="minuParams" v-if="props.length > 1">
                    <CircleMinus />
                </n-icon>
            </div>
        </n-gi>
    </n-input-group>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { parameterOptions, } from '../../constant/screen'
import {
    AddCircle28Regular
} from '@vicons/fluent'
import {
    CircleMinus
} from '@vicons/tabler'
let props = defineProps(['modelValue', 'index', 'length'])
// let emits = defineEmits(['update:modelValue', 'addParams', 'minuParams'])

const emits = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'addParams'): void
    (e: 'minuParams', value: number): void
}>()
const parameter = computed({
    get: () => {
        return props.modelValue
    },
    set: (newVal) => {
        emits('update:modelValue', newVal)
    }
})
const addParams = () => {
    emits('addParams')
};
const minuParams = () => {
    emits('minuParams', props.index)
};
</script>

<style scoped>
.add-icon-box {
  display: flex;
  align-items: center;
  margin-left: 8px;
  margin-top: 5px;
  font-size: 22px !important;
  cursor: pointer;
}
</style>