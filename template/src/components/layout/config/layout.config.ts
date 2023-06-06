/*暂定设计*/
// 关于这里的key 既代表code 也代表 页面路由的code 这样跳转不加任何处理
import { NIcon } from "naive-ui";
import { h } from "vue";
import { BookOutline as BookIcon } from "@vicons/ionicons5";
import { SlowMotionVideoFilled,FaceSharp,FileCopyOutlined } from "@vicons/material";
import { DocumentVideo } from "@vicons/carbon";
import { UserRegular  } from "@vicons/fa";
import { Sitemap  } from "@vicons/tabler";
import useStore from "@/config/pinia"
import {cloneDeep} from 'lodash'

// @ts-ignore
function renderIcon(icon,params={}) {
  return () => h(NIcon, {...params}, { default: () => h(icon) });
}

export interface menuOptions {
  label: string;
  name: string;
  code?: string | string[];
  parendKey?: string;
  icon?: any;
  disabled?: boolean;
  children?: menuOptions[];
}

const menuList: menuOptions[] = [
  // {
  //   label: "概览",
  //   name: "overivew",
  // },
  {
    label: "项目",
    name: "projectsAndScree",
    children: [
      {
        label: "项目",
        name: "project",
        code:"subject:page",
        icon: renderIcon(Sitemap),
        parendKey: "projectsAndScree",
      },
      {
        label: "订单",
        name: "order",
        code:"order:page",
        icon: renderIcon(FileCopyOutlined),
        parendKey: "projectsAndScree",
      },
      {
        label: "录屏",
        name: "screen",
        code: 'record-screen:page',
        icon: renderIcon(SlowMotionVideoFilled),
        parendKey: "projectsAndScree",
      },
      {
        label: "录屏模板",
        name: "screenTemplate",
        code: "click-template:page",
        icon: renderIcon(DocumentVideo),
        parendKey: "projectsAndScree",
      },
    ],
  },
  // {
  //   label: "数据",
  //   name: "data",
  // },
  {
    label: "系统",
    name: "system",
    children: [
      // {
      //   label: "操作日志",
      //   name: "operationLog",
      //   parendKey: "system",
      // },
      // {
      //   label: "产品线管理",
      //   name: "product",
      //   parendKey: "system",
      // },
      // {
      //   label: "广告主管理",
      //   name: "advertise",
      //   parendKey: "system",
      // },
      {
        label: "账户",
        name: "user",
        code: "user:page",
        icon: renderIcon(UserRegular,{size:16}),
        parendKey: "system",
      },
      {
        label: "角色",
        name: "role",
        code:"role:page",
        icon: renderIcon(FaceSharp),
        parendKey: "system",
      },
    ],
  },
  
];


export const  useMenuOption = () => {
  const store = useStore();
  let result:[] = [];
  let deepMenuList = cloneDeep(menuList);
  deepMenuList.forEach(item=>{
    if (item['children']) {
      item.children =  item.children.filter(item=>{
        return store.getPower(item['code']);
      })
      if (item.children.length) {
        result.push(item);
      }
    }
  })
  return result;
}


