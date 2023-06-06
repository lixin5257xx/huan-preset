import { Directive } from "vue";
// 禁止输入特殊符号和表情
const findEle = (parent: any, type: string) => {
  return parent.tagName.toLowerCase() === type
    ? parent
    : parent.querySelector(type);
};
const trigger = (el: any, type: string) => {
  // 给元素绑定事件
  const e = document.createEvent("HTMLEvents");
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
};
/**
 * v-emoji='1' 只过滤emoji
 * 不穿或者传入其他都过滤特殊字符加 emoji
 */
const emoji: Directive = {
  mounted(el, binding) {
    // 正则规则可根据需求自定义
    let $inp = findEle(el, "input") || findEle(el, "textarea"); // 判断绑定元素是否是input输入框或者富文本输入框
    el.$inp = $inp;
    let emojiRules = /(\u00a9|\u00ae|\u203c|\u2049|\u20e3|\u2122|\u2139|[\u2194-\u2199]|[\u21a9-\u21aa]|[\u231a-\u231b]|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\u24c2|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|[\u2600-\u2604]|\u260e|\u2611|[\u2614-\u2615]|\u2618|\u261d|\u2620|[\u2622-\u2623]|\u2626|\u262a|[\u262e-\u262f]|[\u2638-\u263a]|\u2640|\u2642|[\u2648-\u2653]|[\u265f-\u2660]|\u2663|[\u2665-\u2666]|\u2668|\u267b|[\u267e-\u267f]|[\u2692-\u2697]|\u2699|[\u269b-\u269c]|[\u26a0-\u26a1]|\u26a7|[\u26aa-\u26ab]|[\u26b0-\u26b1]|[\u26bd-\u26be]|[\u26c4-\u26c5]|\u26c8|[\u26ce-\u26cf]|\u26d1|[\u26d3-\u26d4]|[\u26e9-\u26ea]|[\u26f0-\u26f5]|[\u26f7-\u26fa]|\u26fd|\u2702|\u2705|[\u2708-\u270d]|\u270f|\u2712|\u2714|\u2716|\u271d|\u2721|\u2728|[\u2733-\u2734]|\u2744|\u2747|\u274c|\u274e|[\u2753-\u2755]|\u2757|[\u2763-\u2764]|[\u2795-\u2797]|\u27a1|\u27b0|\u27bf|[\u2934-\u2935]|[\u2b05-\u2b07]|[\u2b1b-\u2b1c]|\u2b50|\u2b55|\u3030|\u303d|\u3297|\u3299)|(\ud83c(\udc04|\udccf|[\udd70-\udd71]|[\udd7e-\udd7f]|\udd8e|[\udd91-\udd9a]|[\udde6-\uddff]|[\ude01-\ude02]|\ude1a|\ude2f|[\ude32-\ude3a]|[\ude50-\ude51]|[\udf00-\udf21]|[\udf24-\udf93]|[\udf96-\udf97]|[\udf99-\udf9b]|[\udf9e-\udff0]|[\udff3-\udff5]))|(\ud83d([\udc00-\udcfd]|[\udcff-\udd3d]|[\udd49-\udd4e]|[\udd50-\udd67]|[\udd6f-\udd70]|[\udd73-\udd7a]|\udd87|[\udd8a-\udd8d]|\udd90|[\udd95-\udd96]|[\udda4-\udda5]|\udda8|[\uddb1-\uddb2]|\uddbc|[\uddc2-\uddc4]|[\uddd1-\uddd3]|[\udddc-\uddde]|\udde1|\udde3|\udde8|\uddef|\uddf3|[\uddfa-\ude4f]|[\ude80-\udec5]|[\udecb-\uded2]|[\uded5-\uded7]|[\udedd-\udee5]|\udee9|[\udeeb-\udeec]|\udef0|[\udef3-\udefc]|[\udfe0-\udfeb]))|(\ud83e([\udd0c-\udd3a]|[\udd3c-\udd45]|[\udd47-\uddff]|[\ude70-\ude74]|[\ude78-\ude7c]|[\ude80-\ude86]|[\ude90-\udeac]|[\udeb0-\udeba]|[\udec0-\udec5]|[\uded0-\uded9]|[\udee0-\udee7]))|(\udb40([\udc62-\udc63]|\udc65|\udc67|\udc6c|\udc6e|[\udc73-\udc74]))]/g;
    let pattern = /[`~!@#$%^&*()+=<>?"{}|,;'\\[\]·~！@#￥%……&*（）——+={}|？：“”【】、；‘’，。、]/g;
    $inp.handle = function() {
      const val = $inp.value;
      if(binding.value == 1 ){
        $inp.value = val.replace(emojiRules, "")
      }else{
        $inp.value = val.replace(pattern, "").replace(emojiRules, "")
      }
      trigger($inp, "input");
    };
    $inp.addEventListener("blur", $inp.handle); // el添加键盘失焦事件blur
  },
  unmounted(el: any) {
    // 只调用一次，指令与元素解绑时调用。
    el.$inp.removeEventListener("blur", el.$inp.handle);
  }
};

export default {
  name: "emoji",
  ...emoji
};
