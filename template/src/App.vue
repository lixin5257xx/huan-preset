<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from 'naive-ui'
import NotificationApi from '@/components/notification-api/index.vue';
import MessageApi from '@/components/message-api/index.vue';
document.title = import.meta.env.VITE_TITLE;
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#fa8c16',
    primaryColorHover: "#fa8c16",
    primaryColorPressed: "#c97c10",
    textColor2: "#262626",
    // closeColorHover: "#595959",
  },
  Button: {
    textColor: '#c5c5c5',
    textColorText: '#666',
    textColorHover: '#fa8c16',
    paddingRoundMedium: '0 10px',
    iconMarginMedium:'2px'
  },
  Tag: {
    borderRadius: "5px"
  },
  Form:{
    feedbackFontSizeMedium:"12px",
  }
}

</script>
<template>
  <n-message-provider>
    <message-api></message-api>
  </n-message-provider>
  <n-notification-provider>
    <notification-api></notification-api>
  </n-notification-provider>

  <n-config-provider :theme-overrides="themeOverrides">
    <div>
      <router-view />
    </div>
  </n-config-provider>
</template>

<style>
::-webkit-scrollbar-track-piece {
  background-color:#f8f8f8;
}
::-webkit-scrollbar {
  width:7px;
  height:7px;
  border-radius: 50%;
}
::-webkit-scrollbar-thumb {
  background-color:#dddddd;
  background-clip:padding-box;
  min-height:28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius:2em;
}
::-webkit-scrollbar-thumb:hover {
  background-color:#bbb;
}

input:focus::-webkit-contacts-auto-fill-button{
  opacity: 0;
}

.text-orange-left {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FA8C16;
  cursor: pointer;
  margin-left: 10px;
}

/*部分样式调整，如果后续不使用嵌套方案将移除*/
@media screen and (min-width: 300px) and (max-width: 960px) {
  .layout-navigation{
    display: none ;
  }
}
@media screen and (orientation: landscape) {
}
</style>