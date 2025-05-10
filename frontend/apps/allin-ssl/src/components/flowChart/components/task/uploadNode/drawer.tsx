import { useForm, useFormHooks, useModalHooks } from '@baota/naive-ui/hooks'
import { FormConfig } from '@baota/naive-ui/types/form'
import { $t } from '@locales/index'
import { useStore } from '@components/flowChart/useStore'
import { useError } from '@baota/hooks/error'
import verifyRules from './verify'
import { UploadNodeConfig } from '@components/flowChart/types'

export default defineComponent({
	name: 'UploadNodeDrawer',
	props: {
		// 节点配置数据
		node: {
			type: Object as PropType<{ id: string; config: UploadNodeConfig }>,
			default: () => ({
				id: '',
				config: {
					cert: '',
					key: '',
				},
			}),
		},
	},
	setup(props) {
		// 获取store
		const { updateNodeConfig, isRefreshNode } = useStore()
		// 获取表单助手函数
		const { useFormTextarea } = useFormHooks()
		// 节点配置数据
		const { config } = toRefs(props.node)
		// 弹窗辅助
		const { confirm } = useModalHooks()
		// 错误处理
		const { handleError } = useError()

		// 表单渲染配置
		const formConfig: FormConfig = [
			useFormTextarea($t('t_34_1745735771147'), 'cert', {
				placeholder: $t('t_35_1745735781545'),
				rows: 6,
			}),
			useFormTextarea($t('t_36_1745735769443'), 'key', {
				placeholder: $t('t_37_1745735779980'),
				rows: 6,
			}),
		]

		// 创建表单实例
		const {
			component: Form,
			data,
			example,
		} = useForm<UploadNodeConfig>({
			defaultValue: config,
			config: formConfig,
			rules: verifyRules,
		})

		// 确认事件触发
		confirm(async (close) => {
			try {
				await example.value?.validate()
				updateNodeConfig(props.node.id, data.value) // 更新节点配置
				console.log(data.value, props.node.id)
				isRefreshNode.value = props.node.id // 刷新节点
				close()
			} catch (error) {
				handleError(error)
			}
		})
		return () => (
			<div class="upload-node-drawer">
				<Form labelPlacement="top" />
			</div>
		)
	},
})
