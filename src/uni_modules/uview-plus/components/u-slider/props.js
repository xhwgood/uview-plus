import { defineMixin } from '../../libs/vue'
import defProps from '../../libs/config/props.js'
export const props = defineMixin({
    props: {
        // 最小可选值
        min: {
            type: [Number, String],
            default: () => defProps.slider.min
        },
        // 最大可选值
        max: {
            type: [Number, String],
            default: () => defProps.slider.max
        },
        // 步长，取值必须大于 0，并且可被(max - min)整除
        step: {
            type: [Number, String],
            default: () => defProps.slider.step
        },
		// #ifdef VUE3
		// 当前取值
		modelValue: {
			type: [String, Number],
			default: () => defProps.slider.value
		},
		// #endif
		// #ifdef VUE2
		// 当前取值
		value: {
			type: [String, Number],
			default: () => defProps.slider.value
		},
		// #endif
        // 滑块右侧已选择部分的背景色
        activeColor: {
            type: String,
            default: () => defProps.slider.activeColor
        },
        // 滑块左侧未选择部分的背景色
        inactiveColor: {
            type: String,
            default: () => defProps.slider.inactiveColor
        },
        // 滑块的大小，取值范围为 12 - 28
        blockSize: {
            type: [Number, String],
            default: () => defProps.slider.blockSize
        },
        // 滑块的颜色
        blockColor: {
            type: String,
            default: () => defProps.slider.blockColor
        },
		// 禁用状态
		disabled: {
			type: Boolean,
			default: () => defProps.slider.disabled
		},
        // 是否显示当前的选择值
        showValue: {
            type: Boolean,
            default: () => defProps.slider.showValue
        }
    }
})
