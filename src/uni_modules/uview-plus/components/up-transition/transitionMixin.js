// 定义一个一定时间后自动成功的promise，让调用nextTick方法处，进入下一个then方法
const waitTick = () => new Promise(resolve => setTimeout(resolve, 1000 / 50))
// nvue动画模块实现细节抽离在外部文件
// #ifdef APP-NVUE
import animationMap from './nvue-ani-map.js'
// #endif

// #ifndef APP-NVUE
// 定义类名，通过给元素动态切换类名，赋予元素一定的css动画样式
const getClassNames = (name) => ({
    enter: `up-${name}-enter up-${name}-enter-active`,
    'enter-to': `up-${name}-enter-to up-${name}-enter-active`,
    leave: `up-${name}-leave up-${name}-leave-active`,
    'leave-to': `up-${name}-leave-to up-${name}-leave-active`
})
// #endif

// #ifdef APP-NVUE
// 引入nvue(weex)的animation动画模块，文档见：
// https://weex.apache.org/zh/docs/modules/animation.html#transition
const animation = uni.requireNativePlugin('animation')
const getStyle = (name) => animationMap[name]
// #endif

import { nextTick } from 'vue'
import { sleep } from '../../libs/function/index.js';
export default {
    methods: {
        // 组件被点击发出事件
        clickHandler() {
            this.$emit('click')
        },
        // #ifndef APP-NVUE
        // vue版本的组件进场处理
        async vueEnter() {
            // 动画进入时的类名
            const classNames = getClassNames(this.mode)
            // 定义状态和发出动画进入前事件
            this.status = 'enter'
            this.$emit('beforeEnter')
            this.inited = true
            this.display = true
            this.classes = classNames.enter
			await nextTick();
			{
                // https://github.com/umicro/uView2.0/issues/545
				await sleep(20)
                // 标识动画尚未结束
                this.$emit('enter')
                this.transitionEnded = false
				// 组件动画进入后触发的事件
                this.$emit('afterEnter')
                // 赋予组件enter-to类名
                this.classes = classNames['enter-to']
            }
        },
        // 动画离场处理
        async vueLeave() {
            // 如果不是展示状态，无需执行逻辑
            if (!this.display) return
            const classNames = getClassNames(this.mode)
            // 标记离开状态和发出事件
            this.status = 'leave'
            this.$emit('beforeLeave')
            // 获得类名
            this.classes = classNames.leave

            await nextTick();
			{
               // 动画正在离场的状态
               this.transitionEnded = false
               this.$emit('leave')
                // 组件执行动画，到了执行的执行时间后，执行一些额外处理
                setTimeout(this.onTransitionEnd, this.duration)
                this.classes = classNames['leave-to']
            }
        },
        // #endif
        // #ifdef APP-NVUE
        // nvue版本动画进场
        async nvueEnter() {
            // 获得样式的名称
            const currentStyle = getStyle(this.mode)
            // 组件动画状态和发出事件
            this.status = 'enter'
            this.$emit('beforeEnter')
            // 展示生成组件元素
            this.inited = true
            this.display = true
            // 在nvue安卓上，由于渲染速度慢，在弹窗，键盘，日历等组件中，渲染其中的内容需要时间
            // 导致出现弹窗卡顿，这里让其一开始为透明状态，等一定时间渲染完成后，再让其隐藏起来，再让其按正常逻辑出现
            this.viewStyle = {
                opacity: 0
            }
            // 等待弹窗内容渲染完成
            await nextTick();
			{
                // 合并样式
                this.viewStyle = currentStyle.enter
                Promise.resolve()
                    .then(waitTick)
                    .then(() => {
                        // 组件开始进入前的事件
                        this.$emit('enter')
                        // nvue的transition动画模块需要通过ref调用组件，注意此处的ref不同于vue的this.$refs['up-transition']用法
                        animation.transition(this.$refs['up-transition'].ref, {
                            styles: currentStyle['enter-to'],
                            duration: this.duration,
                            timingFunction: this.timingFunction,
                            needLayout: false,
                            delay: 0
                        }, () => {
                            // 动画执行完毕，发出事件
                            this.$emit('afterEnter')
                        })
                    })
                    .catch(() => {})
            }
        },
        nvueLeave() {
            if (!this.display) {
                return
            }
            const currentStyle = getStyle(this.mode)
            // 定义状态和事件
            this.status = 'leave'
            this.$emit('beforeLeave')
            // 合并样式
            this.viewStyle = currentStyle.leave
            // 放到promise中处理执行过程
            Promise.resolve()
                .then(waitTick) // 等待几十ms
                .then(() => {
                    this.transitionEnded = false
                    // 动画正在离场的状态
                    this.$emit('leave')
                    animation.transition(this.$refs['up-transition'].ref, {
                        styles: currentStyle['leave-to'],
                        duration: this.duration,
                        timingFunction: this.timingFunction,
                        needLayout: false,
                        delay: 0
                    }, () => {
                        this.onTransitionEnd()
                    })
                })
                .catch(() => {})
        },
        // #endif
        // 完成过渡后触发
        onTransitionEnd() {
            // 如果已经是结束的状态，无需再处理
            if (this.transitionEnded) return
            this.transitionEnded = true
            // 发出组件动画执行后的事件
            this.$emit(this.status === 'leave' ? 'afterLeave' : 'afterEnter')
            if (!this.show && this.display) {
                this.display = false
                this.inited = false
            }
        }
    }
}
