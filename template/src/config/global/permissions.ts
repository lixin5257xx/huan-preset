// @ts-ignore
import useStore from "@/config/pinia";
// @ts-ignore
import {app}  from "@/config/vue/app";
app.config.globalProperties.$permissions = (code: string[] | string) => {
   return useStore().getPower(code);
};

