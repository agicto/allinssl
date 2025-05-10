import { useNodeValidator } from '@components/flowChart/lib/verify'
import rules from './verify'
import { useThemeCssVar } from '@baota/naive-ui/theme'
import { useStore } from '@components/flowChart/useStore'
import { UploadNodeConfig } from '@components/flowChart/types'

export default defineComponent({
	name: 'UploadNode',
	props: {
		node: {
			type: Object as PropType<{ id: string; config: UploadNodeConfig }>,
			default: () => ({ id: '', config: {} }),
		},
	},
	setup(props) {
		// 注册验证器
		const { isRefreshNode } = useStore()
		const { validate, validationResult, registerCompatValidator, unregisterValidator } = useNodeValidator()
		// 主题色
		const cssVar = useThemeCssVar(['warningColor', 'primaryColor'])

		// 是否有效
		const validColor = computed(() => {
			return validationResult.value.valid ? 'var(--n-primary-color)' : 'var(--n-warning-color)'
		})

		// 提示内容
		const verificationPrompt = computed(() => {
			if (validationResult.value.valid) return '已配置'
			return '未配置'
		})

		// 监听是否刷新节点
		watch(
			() => isRefreshNode.value,
			(newVal) => {
				useTimeoutFn(() => {
					registerCompatValidator(props.node.id, rules, props.node.config)
					validate(props.node.id)
					isRefreshNode.value = null
				}, 500)
			},
			{ immediate: true },
		)

		onUnmounted(() => unregisterValidator(props.node.id))

		return () => (
			<div style={cssVar.value} class="text-[12px]">
				<div style={{ color: validColor.value }}>{verificationPrompt.value}</div>
			</div>
		)
	},
})
