// import { defineComponent, inject } from 'vue'
// import { KEY_PROCESS_DATA, KEY_VALIDATOR } from '../../config/keys'
import { useStore } from '@components/flowChart/useStore'
import { useNodeValidator } from '@components/flowChart/lib/verify'
import { useThemeCssVar } from '@baota/naive-ui/theme'
import { $t } from '@locales/index'
import rules from './verify'
import type { StartNodeConfig } from '@components/flowChart/types'

interface NodeProps {
	node: {
		id: string
		config: StartNodeConfig
	}
}

export default defineComponent({
	name: 'StartNode',
	props: {
		node: {
			type: Object as PropType<{ id: string; config: StartNodeConfig }>,
			default: () => ({ id: '', config: {} }),
		},
	},
	setup(props: NodeProps) {
		// 注册验证器
		const { isRefreshNode } = useStore()
		// 验证器
		const { validate, validationResult, registerCompatValidator, unregisterValidator } = useNodeValidator()
		// 主题色
		const cssVar = useThemeCssVar(['warningColor', 'primaryColor'])

		// 是否有效
		const validColor = computed(() => {
			return validationResult.value.valid ? 'var(--n-primary-color)' : 'var(--n-warning-color)'
		})

		// 提示
		const verificationPrompt = computed(() => {
			if (validationResult.value.valid) {
				return props.node.config.exec_type === 'auto' ? $t('t_4_1744875940750') : $t('t_5_1744875940010')
			}
			return '未配置'
		})

		// 监听是否刷新节点
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
