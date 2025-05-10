import { v4 as uuidv4 } from 'uuid'
import { useStore } from '@components/flowChart/useStore'
import { useController } from '@components/flowChart/useController'
import nodeOptions from '@components/flowChart/lib/config'
import { useDialog } from '@baota/naive-ui/hooks'
import { $t } from '@locales/index'
import { CONDITION, EXECUTE_RESULT_CONDITION, START } from '@components/flowChart/lib/alias'
import { useNodeValidator } from '@components/flowChart/lib/verify'

import AddNode from '@components/flowChart/components/other/addNode/index'
import SvgIcon from '@components/svgIcon'

import type { BaseNodeData, NodeNum, BaseRenderNodeOptions, BaseNodeProps } from '@components/flowChart/types'

import styles from './index.module.css'
import ErrorNode from '../errorNode'

export default defineComponent({
	name: 'BaseNode',
	props: {
		// 节点数据
		node: {
			type: Object as PropType<BaseNodeData>,
			required: true, // 自读
		},
	},
	setup(props: BaseNodeProps) {
		// ====================== 基础状态数据 ======================
		const { validator, validate } = useNodeValidator() // 验证器
		const tempNodeId = ref(props.node.id || uuidv4()) // 节点id
		const config = ref<BaseRenderNodeOptions<BaseNodeData>>(nodeOptions[props.node.type]() || {}) // 节点配置
		const nodeNameRef = ref<HTMLInputElement | null>(null) // 节点名称输入框
		const isShowEditNodeName = ref(false) // 是否显示编辑节点名称
		const inputValue = ref(props.node.name) // 输入框值
		const renderNodeContent = shallowRef() // 节点组件
		const { removeNode, updateNode } = useStore()
		const { handleSelectNode } = useController()

		// ====================== 节点状态数据 ======================
		// 错误状态
		const errorState = ref({
			isError: false,
			message: null as string | null,
			showTips: false,
		})

		// ====================== 计算属性 ======================
		// 是否是开始节点
		const isStart = computed(() => props.node.type === START)

		// 是否可以删除
		const isRemoved = computed(() => config.value?.operateNode?.remove)

		// 是否是条件节点
		const isCondition = computed(() => [CONDITION, EXECUTE_RESULT_CONDITION].includes(props.node.type))

		// 根据节点类型获取图标
		const typeIcon: ComputedRef<string> = computed(() => {
			const type = {
				success: 'flow-success',
				fail: 'flow-error',
			}
			// console.log(props.node.config?.type)
			if (props.node.type === EXECUTE_RESULT_CONDITION)
				return (type[props.node.config?.type as keyof typeof type] || '') as string
			return ''
		})

		// 根据节点类型获取图标颜色
		const typeIconColor: ComputedRef<string> = computed(() => {
			if (props.node.type === EXECUTE_RESULT_CONDITION) return (props.node.config?.type || '') as string
			return '#FFFFFF'
		})

		const nodeComponents = import.meta.glob('../../task/**/index.tsx')
		// ====================== 数据监听与副作用 ======================
		// 监听节点数据，更新节点配置
		watch(
			() => props.node,
			() => {
				config.value = nodeOptions[props.node.type as NodeNum]() // 更新节点配置
				inputValue.value = props.node.name // 更新节点名称
				tempNodeId.value = props.node.id || uuidv4() // 更新节点id
				validator.validateAll() // 验证器验证
				const NodeComp =
					nodeComponents[`../../task/${props.node.type}Node/index.tsx`] ||
					import('@components/flowChart/components/base/errorNode')
				renderNodeContent.value = defineAsyncComponent({
					loader: NodeComp as Promise<Component>,
					loadingComponent: () => <div>Loading...</div>,
					errorComponent: () => <ErrorNode />,
				})
			},
			{ immediate: true },
		)

		// ====================== 渲染节点内容 ======================

		// // 渲染节点内容
		// const renderNodeContent = defineAsyncComponent({
		// 	loader: () =>
		// 		(nodeComp ? nodeComp : import('@components/flowChart/components/base/errorNode')) as Promise<Component>,
		// 	loadingComponent: () => <div>Loading...</div>,
		// 	errorComponent: () => <ErrorNode />,
		// })

		// ====================== 节点操作方法 ======================
		// 显示错误提示
		const showErrorTips = (flag: boolean) => {
			errorState.value.showTips = flag
		}

		// 删除节点
		const removeFindNode = (ev: MouseEvent, id: string, node: BaseNodeData) => {
			const validator = validate(id)
			console.log(validator)
			if (validator.valid) {
				useDialog({
					type: 'warning',
					title: $t('t_1_1745765875247', { name: node.name }),
					content: node.type === CONDITION ? $t('t_2_1745765875918') : $t('t_3_1745765920953'),
					onPositiveClick: () => removeNode(id),
				})
			}
			// 如果节点类型是条件节点或验证不通过，则删除节点
			if ([EXECUTE_RESULT_CONDITION].includes(node.type) || !validator.valid) {
				removeNode(id)
			}
			ev.stopPropagation()
			ev.preventDefault()
		}

		// 点击节点
		const handleNodeClick = () => {
			handleSelectNode(props.node.id || '', props.node.type)
		}

		// ====================== 事件处理函数 ======================
		// 回车保存
		const keyupSaveNodeName = (e: KeyboardEvent) => {
			if (e.keyCode === 13) {
				isShowEditNodeName.value = false
			}
		}

		// 保存节点名称
		const saveNodeName = (e: Event) => {
			const target = e.target as HTMLInputElement
			inputValue.value = target.value
			updateNode(tempNodeId.value, { name: inputValue.value })
		}

		// ====================== 渲染函数 ======================
		return () => (
			<div class={[styles.node, !isStart.value && styles.nodeArrows]}>
				<div class={[styles.nodeContent, isCondition.value && styles.nodeCondition]} onClick={handleNodeClick}>
					{/* 节点头部 */}
					<div
						class={[
							styles.nodeHeader,
							isCondition.value && styles.nodeConditionHeader,
							!typeIcon.value ? styles.nodeHeaderBranch : '',
						]}
						style={{
							color: config.value?.title?.color,
							backgroundColor: config.value?.title?.bgColor,
						}}
					>
						{/* 节点图标 */}
						{typeIcon.value ? (
							<SvgIcon
								icon={typeIcon.value ? typeIcon.value : config.value?.icon?.name || ''}
								class={[styles.nodeIcon, '!absolute top-[50%] left-[1rem] -mt-[.8rem]']}
								color={typeIconColor.value}
							/>
						) : null}

						{/* 节点标题 */}
						<div class={styles.nodeHeaderTitle} title="点击编辑">
							<div class={styles.nodeHeaderTitleInput}>
								<input
									ref={nodeNameRef}
									value={inputValue.value}
									onClick={(e) => e.stopPropagation()}
									onInput={saveNodeName}
									onBlur={() => (isShowEditNodeName.value = false)}
									onKeyup={keyupSaveNodeName}
								/>
							</div>
						</div>

						{/* 删除按钮 */}
						{isRemoved.value && (
							<span
								onClick={(ev) => removeFindNode(ev, tempNodeId.value, props.node)}
								class="flex items-center justify-center absolute top-[50%] right-[1rem] -mt-[.9rem]"
							>
								<SvgIcon class={styles.nodeClose} icon="close" color={isCondition.value ? '#333' : '#FFFFFF'} />
							</span>
						)}
					</div>
					{/* 节点主体 */}
					{!isCondition.value ? (
						<div class={[styles.nodeBody]}>
							{renderNodeContent.value &&
								h(renderNodeContent.value, {
									id: props.node.id,
									node: props.node || {},
									class: 'text-center',
								})}
						</div>
					) : null}
					{/* 错误提示 */}
					{errorState.value.showTips && (
						<div class={styles.nodeErrorMsg}>
							<div class={styles.nodeErrorMsgBox}>
								<span onMouseenter={() => showErrorTips(true)} onMouseleave={() => showErrorTips(false)}>
									<SvgIcon class={styles.nodeErrorIcon} icon="tips" color="red" />
								</span>
								{errorState.value.message && <div class={styles.nodeErrorTips}>{errorState.value.message}</div>}
							</div>
						</div>
					)}
				</div>
				{/* 添加节点组件 */}
				<AddNode node={props.node} />
			</div>
		)
	},
})
