import { BRANCH, EXECUTE_RESULT_BRANCH } from '@components/flowChart/lib/alias'
import BranchNode from '@components/flowChart/components/base/branchNode'
import ConditionNode from '@components/flowChart/components/base/conditionNode'
import BaseNode from '@components/flowChart/components/base/baseNode'
import NodeWrap from '@components/flowChart/components/render/nodeWrap'

import type { BaseNodeData, BranchNodeData, ExecuteResultBranchNodeData } from '@components/flowChart/types'

interface NodeWrapProps {
	node?: BaseNodeData | BranchNodeData
	depth?: number
}

// 自定义样式
const styles = {
	flowNodeWrap: 'flex flex-col items-center w-full relative',
	flowNodeWrapNested: 'nested-node-wrap w-full',
	flowNodeWrapDeep: 'deep-nested-node-wrap w-full',
}

export default defineComponent({
	name: 'NodeWrap',
	props: {
		// 节点数据
		node: {
			type: Object as PropType<BaseNodeData | BranchNodeData | ExecuteResultBranchNodeData>,
			default: () => ({}),
		},
		// 嵌套深度
		depth: {
			type: Number,
			default: 0,
		},
	},
	emits: ['select'],
	setup(props: NodeWrapProps, { emit }) {
		// 计算当前节点的嵌套深度样式类
		const getDepthClass = () => {
			if (props.depth && props.depth > 1) {
				return props.depth > 2 ? styles.flowNodeWrapDeep : styles.flowNodeWrapNested
			}
			return styles.flowNodeWrap
		}

		// 选中节点
		const handleSelect = (node: BaseNodeData | BranchNodeData | ExecuteResultBranchNodeData) => {
			if (node.id) emit('select', node.id)
		}

		return {
			getDepthClass,
			handleSelect,
		}
	},
	render() {
		if (!this.node) return null
		const currentDepth = this.depth || 0
		const nextDepth = currentDepth + 1

		return (
			<div class={this.getDepthClass()}>
				{/* 判断是否为分支节点或普通节点 */}
				{this.node.type === BRANCH ? <BranchNode node={this.node as BranchNodeData} /> : null}

				{/* 判断是否为条件节点 */}
				{this.node.type === EXECUTE_RESULT_BRANCH ? (
					<ConditionNode node={this.node as ExecuteResultBranchNodeData} />
				) : null}

				{/* 判断是否为普通节点 */}
				{![BRANCH, EXECUTE_RESULT_BRANCH].includes(this.node.type) ? <BaseNode node={this.node} /> : null}

				{/* 判断是否存在子节点 */}
				{this.node.childNode?.type && (
					<NodeWrap node={this.node.childNode} depth={nextDepth} onSelect={(nodeId) => this.$emit('select', nodeId)} />
				)}
			</div>
		)
	},
})
