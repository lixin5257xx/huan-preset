<template>
    <div class="order-content">
        <n-grid item-responsive :cols="24">
            <n-grid-item :offset="2" :span="18">
                <div class="sensitive-tips">
                    <slot  name="take-tips-slot">
                      <n-alert class="sensitive-alert"  v-bind="config.takeTipsProps" >
                        <template #icon>
                          <n-icon color="#E02020">
                            <IosWarning />
                          </n-icon>
                        </template>
                        {{config.takeTipsProps.content}}
                      </n-alert>
                    </slot>
                </div>
                <n-form v-bind="config.formProps">
                    <div class="block-item" v-for="block in config.blockList">
                        <h5 :id="block.id">{{ block.label }}</h5>
                        <template v-for="item in block.children">
                              <n-form-item v-if="!item.noFormItem" :path="item.path" :id="item.id" :label="item.label">
                                <n-grid :cols="24">
                                  <n-gi :span="24">
                                    <div class="sel-box">
                                      <slot :name="item.id">
                                        <template v-if="isEqual(config.newDetail[item.id], config.oldDetail[item.id])">
                                          <div class="take-not">
                                            {{ showTitleRender(config.newDetail, item.id) }}
                                          </div>
                                        </template>
                                        <template v-else>
                                        <div style="margin-top: 8px">
                                          <div class="take-not new-data">
                                            {{ showTitleRender(config.newDetail, item.id) }}
                                          </div>
                                          <div class="take-not old-data">
                                            {{ showTitleRender(config.oldDetail, item.id) }}
                                          </div>
                                        </div>
                                      </template>
                                      </slot>
                                    </div>
                                  </n-gi>
                                </n-grid>
                              </n-form-item>
                              <template v-else>
                                <slot :name="item.id">
                                    <template v-if="isEqual(config.newDetail[item.id], config.oldDetail[item.id])">
                                        <div class="take-not">
                                            {{ showTitleRender(config.newDetail, item.id) }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div style="margin-top: 8px">
                                            <div class="take-not new-data">
                                                {{ showTitleRender(config.newDetail, item.id) }}
                                            </div>
                                            <div class="take-not old-data">
                                                {{ showTitleRender(config.oldDetail, item.id) }}
                                            </div>
                                        </div>
                                    </template>
                                </slot>
                            </template>
                        </template>
                    </div>
                    <div style="display: flex; justify-content: center;margin-bottom: 10px">
                        <n-button type="warning" @click="goBack">关闭</n-button>
                    </div>
                </n-form>
            </n-grid-item>
            <n-grid-item :span="3" v-if="config.anchorLinkProps.isShow">
                <div class='anchor-box'>
                    <AnchorLink v-bind="config.anchorLinkProps"></AnchorLink>
                </div>
            </n-grid-item>
        </n-grid>
        <slot name="take-bg-icon">
          <n-icon size="200px" :depth="5" class="bg_icon">
            <DocumentQueueAdd24Regular />
          </n-icon>
        </slot>
    </div>
</template>
<script setup lang="ts">
import { onDeactivated, defineProps, defineEmits } from 'vue'
import { isEqual } from 'lodash'
import { useConfig } from './config/config'
import { IosWarning } from '@vicons/ionicons4'
import { DocumentQueueAdd24Regular } from '@vicons/fluent'
import AnchorLink from '@/components/anchor-link/index.vue'

const props = defineProps(['config']);
const emits = defineEmits(['goBack']);
const config = useConfig(props.config);

const goBack = () => {
  emits('goBack');
}

const showTitleRender = (data, id) => {
    if (data) {
        if (data[id] instanceof Array) {
            return data[id].join('、')
        }
        return data[id];
    }
    return ''
}

onDeactivated(() => {
    window.$notification.destroyAll()
})
</script>

<style>
.error-msg {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgb(118, 124, 130);
    max-height: 400px;
    overflow-y: auto;
    min-height: 18px;
    margin-bottom: 10px;
}

.error-msg .error-title:before {
    content: "*";
    color: red;
    display: inline-block;
    margin-right: 10px;
}

.error-msg .error-content {
    padding-left: 15px;
    cursor: pointer;
}

.error-msg .error-content,
.error-msg-content {
    font-size: 12px !important;
    line-height: 20px;
    font-weight: 400 !important;

    margin: 0 0 10px;
}

.error-msg .error-title,
.error-msg .error-title-name {
    font-size: 14px !important;
    font-weight: 600 !important;
    max-height: 300px;
    overflow-y: auto;
    padding: 0 10px 0 0;
    min-height: 18px;
    line-height: 26px;
    color: #606266;
}

.error-msg p:nth-of-type(1) {
    /* margin-bottom: 10px; */
}

.error-msg p:nth-of-type(2) {
    /* color: #d03050; */
    /* line-height: 18px; */
}

.sensitive-alert .n-alert-body__title {
    color: #E02020 !important;
}

.sensitive-alert .n-alert-body__content {
    color: #999999 !important;
}

.sensitive-alert .n-alert-body {
    background-color: #ffffff !important;
    border-radius: 8px;
}

.sensitive-alert {
    border-radius: 8px;
}
</style>


<style scoped>
.sensitive-tips {
    background-color: #fff;
    margin-bottom: 20px;
    color: red;
    border-radius: 8px;
}

.sensitive-alert {
    border-radius: 8px;
}

.order-content :deep(.n-form-item .n-form-item-label) {
    color: #999999 !important;
}

.order-content {
    background: #fafafa !important;
    padding-bottom: 50px !important;
    margin: var(--theme-box-margin);
}

/*.order-content :deep(.n-form-item) {*/
/*    margin-left: 40px !important;*/
/*}*/

.order-content h5,
.order-content h5 b {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
    margin: 0 0 25px;
}

.order-content h5 b {
    display: inline-block;
    margin: 0 0 3px;
}

.sel-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.take-not {
    font-size: 14px;
    line-height: 18px;
    height: 18px;
}

.old-data {
    display: block;
    background-color: #f0f0f0;
    text-decoration: line-through;
    padding: 0px 2px;
}

.new-data {
    background-color: #fef2e4;
    padding: 0px 2px;
}

.anchor-box {
    width: 165px;
    display: flex;
    background: #fff;
    height: 260px;
    margin-left: 15px;
    padding-left: 20px;
    border-radius: 8px;
    padding-top: 25px;
    position: fixed;
}</style>