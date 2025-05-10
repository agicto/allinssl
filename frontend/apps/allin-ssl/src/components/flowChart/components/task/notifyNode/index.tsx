import { useThemeCssVar } from '@baota/naive-ui/theme'
import { useNodeValidator } from '@components/flowChart/lib/verify'
import { NotifyNodeConfig } from '@components/flowChart/types'
import { useStore } from '@components/flowChart/useStore'

import rules from './verify'
import TypeIcon from '@components/typeIcon'
import { $t } from '@locales/index'
export default defineComponent({
	name: 'NotifyNode',
	props: {
		node: {
			type: Object as PropType<{ id: string; config: NotifyNodeConfig }>,
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
			return validationResult.value.valid && props.node.config.provider
				? 'var(--n-primary-color)'
				: 'var(--n-warning-color)'
		})

		// 提示内容
		const verificationPrompt = computed(() => {
			if (validationResult.value.valid && props.node.config.provider)
				return <TypeIcon icon={props.node.config.provider} type="success" />
			return $t('t_9_1745735765287')
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

		// 卸载验证器
		onUnmounted(() => unregisterValidator(props.node.id))

		// 渲染节点状态
		return () => (
			<div style={cssVar.value} class="text-[12px]">
				<div style={{ color: validColor.value }}>{verificationPrompt.value}</div>
			</div>
		)
	},
})
