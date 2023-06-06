// @ts-ignore
import useStore from "@/config/pinia/index";
import { Directive, nextTick } from "vue";
const directive: Directive = {
  mounted(el, { value }) {
    nextTick(() => {
      const status = useStore().getPower(value);
      if (status) return;
      el.parentNode && el.parentNode.removeChild(el);
    });
  }
};

export default {
  name: "permissions",
  ...directive
};
