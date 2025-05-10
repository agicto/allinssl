import { useApiFormController } from '../useController'
import type { AccessItem } from '@/types/access'

export default defineComponent({
	name: 'AddApiForm',
	props: {
		data: {
			type: Object as PropType<AccessItem>,
			default: () => {},
		},
	},
	setup(props) {
		const { ApiManageForm } = useApiFormController(props)
		return () => (
			<div class="p-4">
				<ApiManageForm labelPlacement="top" requireMarkPlacement="right-hanging" />
			</div>
		)
	},
})
