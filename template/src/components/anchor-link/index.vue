<template>
    <!-- <div class="n-affix n-affix--affixed" data-v-7524693c="" style="top: 88px;">
        <div class="n-anchor n-anchor--show-rail"
            style="--n-link-border-radius:3px; --n-link-color:rgba(250, 140, 22, 0.15); --n-link-font-size:13px; --n-link-text-color:#262626; --n-link-text-color-hover:#fa8c16; --n-link-text-color-active:#fa8c16; --n-link-text-color-pressed:#c97c10; --n-link-padding:0 0 0 16px; --n-bezier:cubic-bezier(0.4, 0, 0.2, 1); --n-rail-color:rgb(219, 219, 223); --n-rail-color-active:#fa8c16; --n-rail-width:4px;">
            <div class="n-anchor-rail">
                <div class="n-anchor-rail__bar" style=""></div>
            </div>
            <div class="n-anchor-link"><a class="n-anchor-link__title" title="所属项目" style="">所属项目</a>
                <div class="n-anchor-link n-anchor-link--active link-children"><a class="n-anchor-link__title"
                        title="项目名称" style="">项目名称</a></div>
            </div>
            <div class="n-anchor-link"><a class="n-anchor-link__title" title="订单" style="">订单</a>
                <div class="n-anchor-link link-children"><a class="n-anchor-link__title" title="基本信息"
                        style="">基本信息</a></div>
                <div class="n-anchor-link link-children"><a class="n-anchor-link__title" title="排期与监测"
                        style="">排期与监测</a></div>
                <div class="n-anchor-link link-children"><a class="n-anchor-link__title" title="订单名称"
                        style="">订单名称</a></div>
            </div>
        </div>
    </div> -->
    <n-anchor>
        <n-anchor-link :title="item.name" v-for="(item, index) in anchorArrList"
            :class="item.disabled ? 'disabled' : ''">
            <n-anchor-link :title="children.name" :class="[children.disabled ? 'disabled' : '', children.active ? 'n-anchor-link--active' : '', 'link-children'
            ]" v-for=" (children, childIndex) in item.children"
                @click.stop="goAnchor(children, children.selector, index, childIndex)" />
        </n-anchor-link>
    </n-anchor>
</template>

<script setup lang="ts">
import { clone } from 'lodash';
import { ref, onMounted, nextTick, reactive } from 'vue'
const { list } = defineProps(['list']);
const anchorArrList = ref(list)
var num = 0
const getAnthorTop = (selector: any) => {
    let top = 0;
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    if (typeof selector === 'number') {
        top = selector - scrollTop
    } else {
        const anchor = document.querySelector(selector) || { offsetTop: 0 }
        top = anchor.offsetTop - scrollTop - 90
    }
    return top
}
const goAnchor = (children: any, selector: any, selIndex: number, selChildIndex: number) => {
    if (children.disabled) return false
    const element: any = document.querySelector('.layout-content')
    const top = getAnthorTop(selector)
    element.scrollTo({ top, behavior: 'instant' })
    console.log('num11', num)
    num++
    setTimeout(item => {
        num = 0
    }, 500)
    anchorArrList.value.forEach((item: any, index: number) => {
        item.children && item.children.forEach((children: any, childIndex: number) => {
            if (selIndex == index && selChildIndex == childIndex) {
                children.active = true
                console.log('children.active', children)
            } else {
                console.log('childrenFalse', children)
                children.active = false
            }
        })
    })
}
const flatArr: any = []
const getScroll = () => {
    const element: any = document.querySelector('.layout-content')
    anchorArrList.value.forEach((item: any) => {
        item.scrollTopNumber = getAnthorTop(item.selector)
        item.children && item.children.forEach((children: any, childIndex: number) => {
            children.scrollTopNumber = getAnthorTop(children.selector)
            flatArr.push(children)
        })
        flatArr.push(item)
    })
    element.onscroll = (e) => {
        if (num == 1) return false
        const scrollTop = e.target.scrollTop
        const arr = flatArr.filter((item: any) => {
            return item.scrollTopNumber <= scrollTop && item.scrollTopNumber > 0
        })
        arr.length > 0 && anchorArrList.value.forEach((item: any) => {
            item.children && item.children.forEach((children: any, childIndex: number) => {
                if (children.selector == arr[arr.length - 1].selector) {
                    children.active = true
                } else {
                    children.active = false
                }
            })
        })
    }
}
onMounted(() => {
    getScroll()
})
</script>

<style>
.n-anchor .n-anchor-link {
    padding: 0;
}

.n-anchor.n-anchor--block .n-anchor-link {
    padding: 0;
}

.n-anchor.n-anchor--block .n-anchor-link.n-anchor-link--active {
    background: none;
}


.n-anchor .n-anchor-link .n-anchor-link__title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262626;
    line-height: 24px;
}

.n-anchor .n-anchor-link.link-children {
    margin-top: 10px;
}

.n-anchor .n-anchor-link.link-children .n-anchor-link__title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
}

.n-anchor.n-anchor--block .n-anchor-link.n-anchor-link--active .n-anchor-link__title {
    color: #FA8C16
}

.n-affix.n-affix--affixed {
    position: fixed;
}
</style>