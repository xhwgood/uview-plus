<template>
    <view :style="[addStyle(customStyle)]" :class="[customClass]" class="up-cell-group">
        <view v-if="title" class="up-cell-group__title">
            <slot name="title">
				<text class="up-cell-group__title__text">{{ title }}</text>
			</slot>
        </view>
        <view class="up-cell-group__wrapper">
			<up-line v-if="border"></up-line>
            <slot />
        </view>
    </view>
</template>

<script>
	import { props } from './props.js';
	import { mpMixin } from '../../libs/mixin/mpMixin.js';
	import { mixin } from '../../libs/mixin/mixin.js';
	import { addStyle } from '../../libs/function/index.js';
	/**
	 * cellGroup  单元格
	 * @description cell单元格一般用于一组列表的情况，比如个人中心页，设置页等。
	 * @tutorial https://uview-plus.jiangruyi.com/components/cell.html
	 * 
	 * @property {String}	title		分组标题
	 * @property {Boolean}	border		是否显示外边框 (默认 true )
	 * @property {Object}	customStyle	定义需要用到的外部样式
	 * 
	 * @event {Function} click 	点击cell列表时触发
	 * @example <up-cell-group title="设置喜好">
	 */
	export default {
		name: 'up-cell-group',
		mixins: [mpMixin, mixin, props],
		methods: {
			addStyle
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
	
	$up-cell-group-title-padding: 16px 16px 8px !default;
	$up-cell-group-title-font-size: 15px !default;
	$up-cell-group-title-line-height: 16px !default;
	$up-cell-group-title-color: $up-main-color !default;

    .up-cell-group {
		flex: 1;
		
        &__title {
            padding: $up-cell-group-title-padding;

            &__text {
                font-size: $up-cell-group-title-font-size;
                line-height: $up-cell-group-title-line-height;
                color: $up-cell-group-title-color;
            }
        }
		
		&__wrapper {
			position: relative;
		}
    }
</style>

