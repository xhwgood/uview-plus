import { defineMixin } from '../../libs/vue.js'
import defProps from '../../libs/config/props.js'

export const propsBox = defineMixin({
    props: {
        // 背景色
        bgColors: {
            type: [Array],
            default: ['#EEFCFF', '#FCF8FF', '#FDF8F2']
        },
        // 高度
        height: {
            type: [String],
            default: "160px"
        },
        // 圆角
        borderRadius: {
            type: [String],
            default: "6px"
        },
        // 间隔
        gap: {
            type: [String],
            default: "15px"
        },
        // 左侧图标
        leftIcon: {
            type: [String],
            default: ""
        },
        // 左侧文案
        leftTitle: {
            type: [String],
            default: "左"
        },
        // 右上图标
        rightTopIcon: {
            type: [String],
            default: ""
        },
        // 右上文案
        rightTopTitle: {
            type: [String],
            default: "右上"
        },
        // 右下图标
        rightBottomIcon: {
            type: [String],
            default: ""
        },
        // 右下文案
        rightBottomTitle: {
            type: [String],
            default: "右下"
        },
    }
})
