import FlowChart from '@components/flowChart'
import { useStore } from './useStore'
import { useController } from './useController'
export default defineComponent({
	setup() {
		const { init } = useController()
		const { workflowType, workDefalutNodeData, isEdit } = useStore()
		onMounted(init)
		return () => <FlowChart type={workflowType.value} node={workDefalutNodeData.value} isEdit={isEdit.value} />
	},
})
