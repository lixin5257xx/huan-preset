<template>
  <div
    class="input-add-box"
    v-for="(item, index) in screen_shot_list"
    :key="index"
  >
    <div class="add-box">
      <n-form-item-gi
        style="width: 170px; "
      >
        <n-input-group>
          <n-select
            :style="{ width: '100%' }"
            placeholder="按键"
            clearable
            v-model:value="screen_shot_list[index]"
            :options="keyOptions"
          />
        </n-input-group>
      </n-form-item-gi>
      <div class="add-icon-box">
        <n-icon
          @click="addShot"
          style="margin-right: 5px"
          v-if="
            screen_shot_list.length - 1 == index && screen_shot_list.length < 10
          "
        >
          <AddCircle32Regular />
        </n-icon>
        <n-icon @click="minuShot(index)" v-if="screen_shot_list.length > 1">
          <MinusCircleOutlined style="font-size: 22px" />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {keyOptions } from '../../constant/screen'
import { AddCircle32Regular } from '@vicons/fluent'
import { MinusCircleOutlined } from '@vicons/antd'
let props = defineProps(['modelValue'])
let emits = defineEmits(['update:modelValue'])
const tabValue = ref(0)
const screenInput: any = ref([])

const screen_shot_list = computed({
  get: () => {
    return props.modelValue
  },
  set: (newVal) => {
    emits('update:modelValue', newVal)
  },
})
const addShot = () => {
  screen_shot_list.value.push(null)
}
const minuShot = (index: any) => {
  screen_shot_list.value.splice(index, 1)
}

onMounted(() => {
  nextTick(() => {
    console.log('screenInput', screenInput)
    // screenInput.value[0].focus()
  })
})
</script>

<style scoped>
.n-icon {
    cursor: pointer;
}
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
