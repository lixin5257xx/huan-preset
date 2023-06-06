<script setup lang="ts">
import layoutTB from "./src/layout-teambition.vue"
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
// onMounted(()=>{
//   router.push('/screen');
// })
</script>
<template>
  <n-dialog-provider>
    <layoutTB />
  </n-dialog-provider>
</template>
