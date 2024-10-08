<template>
	<view
		class="up-loading-icon"
		:style="[addStyle(customStyle)]"
		:class="[vertical && 'up-loading-icon--vertical']"
		v-if="show"
	>
		<view
			v-if="!webviewHide"
			class="up-loading-icon__spinner"
			:class="[`up-loading-icon__spinner--${mode}`]"
			ref="ani"
			:style="{
				color: color,
				width: addUnit(size),
				height: addUnit(size),
				borderTopColor: color,
				borderBottomColor: otherBorderColor,
				borderLeftColor: otherBorderColor,
				borderRightColor: otherBorderColor,
				'animation-duration': `${duration}ms`,
				'animation-timing-function': mode === 'semicircle' || mode === 'circle' ? timingFunction : ''
			}"
		>
			<block v-if="mode === 'spinner'">
				<!-- #ifndef APP-NVUE -->
				<view
					v-for="(item, index) in array12"
					:key="index"
					class="up-loading-icon__dot"
				>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-NVUE -->
				<!-- 此组件内部图标部分无法设置宽高，即使通过width和height配置了也无效 -->
				<loading-indicator
					v-if="!webviewHide"
					class="up-loading-indicator"
					:animating="true"
					:style="{
						color: color,
						width: addUnit(size),
						height: addUnit(size)
					}"
				/>
				<!-- #endif -->
			</block>
		</view>
		<text
			v-if="text"
			class="up-loading-icon__text"
			:style="{
				fontSize: addUnit(textSize),
				color: textColor,
			}"
		>{{text}}</text>
	</view>
</template>

<script>
	import { propsLoadicon } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	import { addUnit, addStyle } from '../../libs/function/index.js';
	import { colorGradient } from '../../libs/function/colorGradient.js';
	// #ifdef APP-NVUE
	const animation = weex.requireModule('animation');
	// #endif
	/**
	 * loading 加载动画
	 * @description 警此组件为一个小动画，目前用在uView的loadmore加载更多和switch开关等组件的正在加载状态场景。
	 * @tutorial https://ijry.github.io/uview-plus/components/loading.html
	 * @property {Boolean}			show			是否显示组件  (默认 true)
	 * @property {String}			color			动画活动区域的颜色，只对 mode = flower 模式有效（默认color['up-tips-color']）
	 * @property {String}			textColor		提示文本的颜色（默认color['up-tips-color']）
	 * @property {Boolean}			vertical		文字和图标是否垂直排列 (默认 false )
	 * @property {String}			mode			模式选择，见官网说明（默认 'circle' ）
	 * @property {String | Number}	size			加载图标的大小，单位px （默认 24 ）
	 * @property {String | Number}	textSize		文字大小（默认 15 ）
	 * @property {String | Number}	text			文字内容 
	 * @property {String}			timingFunction	动画模式 （默认 'ease-in-out' ）
	 * @property {String | Number}	duration		动画执行周期时间（默认 1200）
	 * @property {String}			inactiveColor	mode=circle时的暗边颜色 
	 * @property {Object}			customStyle		定义需要用到的外部样式
	 * @example <up-loading mode="circle"></up-loading>
	 */
	export default {
		name: 'up-loading-icon',
		mixins: [mpMixin, mixin, propsLoadicon],
		data() {
			return {
				// Array.form可以通过一个伪数组对象创建指定长度的数组
				// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
				array12: Array.from({
					length: 12
				}),
				// 这里需要设置默认值为360，否则在安卓nvue上，会延迟一个duration周期后才执行
				// 在iOS nvue上，则会一开始默认执行两个周期的动画
				aniAngel: 360, // 动画旋转角度
				webviewHide: false, // 监听webview的状态，如果隐藏了页面，则停止动画，以免性能消耗
				loading: false, // 是否运行中，针对nvue使用
			}
		},
		computed: {
			// 当为circle类型时，给其另外三边设置一个更轻一些的颜色
			// 之所以需要这么做的原因是，比如父组件传了color为红色，那么需要另外的三个边为浅红色
			// 而不能是固定的某一个其他颜色(因为这个固定的颜色可能浅蓝，导致效果没有那么细腻良好)
			otherBorderColor() {
				const lightColor = colorGradient(this.color, '#ffffff', 100)[80]
				if (this.mode === 'circle') {
					return this.inactiveColor ? this.inactiveColor : lightColor
				} else {
					return 'transparent'
				}
				// return this.mode === 'circle' ? this.inactiveColor ? this.inactiveColor : lightColor : 'transparent'
			}
		},
		watch: {
			show(n) {
				// nvue中，show为true，且为非loading状态，就重新执行动画模块
				// #ifdef APP-NVUE
				if (n && !this.loading) {
					setTimeout(() => {
						this.startAnimate()
					}, 30)
				}
				// #endif
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			addUnit,
			addStyle,
			init() {
				setTimeout(() => {
					// #ifdef APP-NVUE
					this.show && this.nvueAnimate()
					// #endif
					// #ifdef APP-PLUS 
					this.show && this.addEventListenerToWebview()
					// #endif
				}, 20)
			},
			// 监听webview的显示与隐藏
			addEventListenerToWebview() {
				// webview的堆栈
				const pages = getCurrentPages()
				// 当前页面
				const page = pages[pages.length - 1]
				// 当前页面的webview实例
				const currentWebview = page.$getAppWebview()
				// 监听webview的显示与隐藏，从而停止或者开始动画(为了性能)
				currentWebview.addEventListener('hide', () => {
					this.webviewHide = true
				})
				currentWebview.addEventListener('show', () => {
					this.webviewHide = false
				})
			},
			// #ifdef APP-NVUE
			nvueAnimate() {
				// nvue下，非spinner类型时才需要旋转，因为nvue的spinner类型，使用了weex的
				// loading-indicator组件，自带旋转功能
				this.mode !== 'spinner' && this.startAnimate()
			},
			// 执行nvue的animate模块动画
			startAnimate() {
				this.loading = true
				const ani = this.$refs.ani
				if (!ani) return
				animation.transition(ani, {
					// 进行角度旋转
					styles: {
						transform: `rotate(${this.aniAngel}deg)`,
						transformOrigin: 'center center'
					},
					duration: this.duration,
					timingFunction: this.timingFunction,
					// delay: 10
				}, () => {
					// 每次增加360deg，为了让其重新旋转一周
					this.aniAngel += 360
					// 动画结束后，继续循环执行动画，需要同时判断webviewHide变量
					// nvue安卓，页面隐藏后依然会继续执行startAnimate方法
					this.show && !this.webviewHide ? this.startAnimate() : this.loading = false
				})
			}
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
	$up-loading-icon-color: #c8c9cc !default;
	$up-loading-icon-text-margin-left:4px !default;
	$up-loading-icon-text-color:$up-content-color !default;
	$up-loading-icon-text-font-size:14px !default;
	$up-loading-icon-text-line-height:20px !default;
	$up-loading-width:30px !default;
	$up-loading-height:30px !default;
	$up-loading-max-width:100% !default;
	$up-loading-max-height:100% !default;
	$up-loading-semicircle-border-width: 2px !default;
	$up-loading-semicircle-border-color:transparent !default;
	$up-loading-semicircle-border-top-right-radius: 100px !default;
	$up-loading-semicircle-border-top-left-radius: 100px !default;
	$up-loading-semicircle-border-bottom-left-radius: 100px !default;
	$up-loading-semicircle-border-bottom-right-radiu: 100px !default;
	$up-loading-semicircle-border-style: solid !default;
	$up-loading-circle-border-top-right-radius: 100px !default;
	$up-loading-circle-border-top-left-radius: 100px !default;
	$up-loading-circle-border-bottom-left-radius: 100px !default;
	$up-loading-circle-border-bottom-right-radiu: 100px !default;
	$up-loading-circle-border-width:2px !default;
	$up-loading-circle-border-top-color:#e5e5e5 !default;
	$up-loading-circle-border-right-color:$up-loading-circle-border-top-color !default;
	$up-loading-circle-border-bottom-color:$up-loading-circle-border-top-color !default;
	$up-loading-circle-border-left-color:$up-loading-circle-border-top-color !default;
	$up-loading-circle-border-style:solid !default;
	$up-loading-icon-host-font-size:0px !default;
	$up-loading-icon-host-line-height:1 !default;
	$up-loading-icon-vertical-margin:6px 0 0 !default;
	$up-loading-icon-dot-top:0 !default;
	$up-loading-icon-dot-left:0 !default;
	$up-loading-icon-dot-width:100% !default;
	$up-loading-icon-dot-height:100% !default;
	$up-loading-icon-dot-before-width:2px !default;
	$up-loading-icon-dot-before-height:25% !default;
	$up-loading-icon-dot-before-margin:0 auto !default;
	$up-loading-icon-dot-before-background-color:currentColor !default;
	$up-loading-icon-dot-before-border-radius:40% !default;

	.up-loading-icon {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: $up-loading-icon-color;

		&__text {
			margin-left: $up-loading-icon-text-margin-left;
			color: $up-loading-icon-text-color;
			font-size: $up-loading-icon-text-font-size;
			line-height: $up-loading-icon-text-line-height;
		}

		&__spinner {
			width: $up-loading-width;
			height: $up-loading-height;
			position: relative;
			/* #ifndef APP-NVUE */
			box-sizing: border-box;
			max-width: $up-loading-max-width;
			max-height: $up-loading-max-height;
			animation: up-rotate 1s linear infinite;
			/* #endif */
		}

		&__spinner--semicircle {
			border-width: $up-loading-semicircle-border-width;
			border-color: $up-loading-semicircle-border-color;
			border-top-right-radius: $up-loading-semicircle-border-top-right-radius;
			border-top-left-radius: $up-loading-semicircle-border-top-left-radius;
			border-bottom-left-radius: $up-loading-semicircle-border-bottom-left-radius;
			border-bottom-right-radius: $up-loading-semicircle-border-bottom-right-radiu;
			border-style: $up-loading-semicircle-border-style;
		}

		&__spinner--circle {
			border-top-right-radius: $up-loading-circle-border-top-right-radius;
			border-top-left-radius: $up-loading-circle-border-top-left-radius;
			border-bottom-left-radius: $up-loading-circle-border-bottom-left-radius;
			border-bottom-right-radius: $up-loading-circle-border-bottom-right-radiu;
			border-width: $up-loading-circle-border-width;
			border-top-color: $up-loading-circle-border-top-color;
			border-right-color: $up-loading-circle-border-right-color;
			border-bottom-color: $up-loading-circle-border-bottom-color;
			border-left-color: $up-loading-circle-border-left-color;
			border-style: $up-loading-circle-border-style;
		}

		&--vertical {
			flex-direction: column
		}
	}

	/* #ifndef APP-NVUE */
	:host {
		font-size: $up-loading-icon-host-font-size;
		line-height: $up-loading-icon-host-line-height;
	}

	.up-loading-icon {
		&__spinner--spinner {
			animation-timing-function: steps(12)
		}

		&__text:empty {
			display: none
		}

		&--vertical &__text {
			margin: $up-loading-icon-vertical-margin;
			color: $up-content-color;
		}

		&__dot {
			position: absolute;
			top: $up-loading-icon-dot-top;
			left: $up-loading-icon-dot-left;
			width: $up-loading-icon-dot-width;
			height: $up-loading-icon-dot-height;

			&:before {
				/* #ifndef APP-NVUE */
				display: block;
				/* #endif */
				width: $up-loading-icon-dot-before-width;
				height: $up-loading-icon-dot-before-height;
				margin: $up-loading-icon-dot-before-margin;
				background-color: $up-loading-icon-dot-before-background-color;
				border-radius: $up-loading-icon-dot-before-border-radius;
				content: " "
			}
		}
	}

	@for $i from 1 through 12 {
		.up-loading-icon__dot:nth-of-type(#{$i}) {
			transform: rotate($i * 30deg);
			opacity: 1 - 0.0625 * ($i - 1);
		}
	}

	@keyframes up-rotate {
		0% {
			transform: rotate(0deg)
		}

		to {
			transform: rotate(1turn)
		}
	}

	/* #endif */
</style>
