import { useMonitorFormController } from '../useController'

import type { UpdateSiteMonitorParams } from '@/types/monitor'

/**
 * 监控表单组件
 */
export default defineComponent({
	name: 'MonitorForm',
	props: {
		isEdit: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object as PropType<UpdateSiteMonitorParams | null>,
			default: () => null,
		},
	},
	setup(props) {
		const { component: MonitorForm } = useMonitorFormController(props.data)
		return () => <MonitorForm labelPlacement="top" />
	},
})
