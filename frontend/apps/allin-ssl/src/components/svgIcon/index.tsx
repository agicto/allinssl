import { defineComponent, computed, PropType } from 'vue'

interface SvgIconProps {
	size: string
	icon: string
	color?: string
}

export default defineComponent({
	name: 'SvgIcon',
	props: {
		// 图标
		icon: {
			type: String as PropType<string>,
			required: true,
		},
		// 颜色
		color: {
			type: String as PropType<string>,
			default: '',
		},
		// 大小
		size: {
			type: String as PropType<string>,
			default: '1.8rem',
		},
	},
	setup(props: SvgIconProps) {
		const iconName = computed(() => `#icon-${props.icon}`)
		return () => (
			<svg
				class="relative inline-block align-[-0.2rem]"
				style={{ width: props.size, height: props.size }}
				aria-hidden="true"
			>
				<use xlinkHref={iconName.value} fill={props.color} />
			</svg>
		)
	},
})
