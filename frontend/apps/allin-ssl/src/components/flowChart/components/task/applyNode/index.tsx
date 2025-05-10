import { useNodeValidator } from '@components/flowChart/lib/verify'
import { useStore } from '@components/flowChart/useStore'
import { useThemeCssVar } from '@baota/naive-ui/theme'
import { $t } from '@locales/index'
import rules from './verify'
import type { ApplyNodeConfig } from '@components/flowChart/types'

interface NodeProps {
	node: {
		id: string
		config: ApplyNodeConfig
	}
}

export default defineComponent({
	name: 'ApplyNode',
	props: {
		node: {
			type: Object as PropType<{ id: string; config: ApplyNodeConfig }>,
			default: () => ({ id: '', config: {} }),
		},
	},
	setup(props: NodeProps) {
		// 注册验证器
		const { isRefreshNode } = useStore()
		// 初始化节点状态
		const { registerCompatValidator, validate, validationResult, unregisterValidator } = useNodeValidator()
		// 主题色
		const cssVar = useThemeCssVar(['warningColor', 'primaryColor'])

		// 是否有效
		const validColor = computed(() => {
			return validationResult.value.valid ? 'var(--n-primary-color)' : 'var(--n-warning-color)'
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

		//
		onUnmounted(() => unregisterValidator(props.node.id))

		// 渲染节点状态
		return () => (
			<div style={cssVar.value} class="text-[12px]">
				<div style={{ color: validColor.value }}>
					{validationResult.value.valid ? '域名：' + props.node.config?.domains : $t('t_9_1745735765287')}
				</div>
			</div>
		)
	},
})
