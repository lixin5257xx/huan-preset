<template>
    <div></div>
</template>

<script setup lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import { useMessage } from 'naive-ui';
import { useNotification } from "naive-ui";
window.$notification = useNotification()
</script>