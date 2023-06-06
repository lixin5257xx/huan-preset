<template>
    <div>8982{{screen_shot_list}}</div>
    <div class="input-add-box" v-for="(item, index) in screen_shot_list" :key="index">
        <div class="add-box">
            <n-form-item-gi
                style="width: 170px;margin-left: 10px;"
                :path="`screen_shot_list.[${index}]`"
                :rule="useTimeLongRule"
            >
                <n-input-group>
                    <n-input-group-label>第</n-input-group-label>
                    <n-input-number
                        v-emoji
                        :show-button="false"
                        :min="0"
                        :max="100"
                        clearable
                        v-model:value="screen_shot_list[index]"
                        :ref="(el: any) => { if (el) screenInput[index] = el }"
                    />
                    <n-input-group-label>秒</n-input-group-label>
                </n-input-group>
            </n-form-item-gi>
            <div class="add-icon-box">
                <n-icon
                    @click="addShot"
                    style="margin-right:5px;"
                    v-if="screen_shot_list.length - 1 == index && screen_shot_list.length < 10"
                >
                    <AddCircle32Regular />
                </n-icon>
                <n-icon @click="minuShot(index)" v-if="screen_shot_list.length > 1">
                    <MinusCircleOutlined style="font-size:22px;" />
                </n-icon>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useTimeLongRule } from '@views/screen/use/addOrUpdate.ts'
import {
    AddCircle32Regular
} from '@vicons/fluent'
import {
    MinusCircleOutlined
} from '@vicons/antd'
let props = defineProps(['modelValue'])
let emits = defineEmits(['update:modelValue'])
const tabValue = ref(0);
const screenInput: any = ref([])

const screen_shot_list = computed({
    get: () => {
        return props.modelValue
    },
    set: (newVal) => {
        emits('update:modelValue', newVal)
    }
})
const addShot = () => {
    screen_shot_list.value.push(null);
    lastFocus()
};
const minuShot = (index: any) => {
    screen_shot_list.value.splice(index, 1);
    lastFocus()
};
const lastFocus = () => {
    nextTick(() => {
        const lastIndex = screen_shot_list.value.length - 1
        screenInput.value[lastIndex].focus()
    })
}
onMounted(() => {
    nextTick(() => {
        console.log('screenInput', screenInput)
        // screenInput.value[0].focus()
    })
})
</script>

<style scoped>
.input-add-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
}
.input-add-box .add-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
}
.add-icon-box {
    display: flex;
    align-items: center;
    margin-left: 8px;
    margin-top: 5px;
    font-size: 22px !important;
}
</style>