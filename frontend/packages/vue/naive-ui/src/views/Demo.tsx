import { defineComponent, ref, computed } from 'vue'
import { NSpace, NTabs, NTabPane, NBackTop, NButton } from 'naive-ui'
import TableDemo from './tabs/TableDemo'
import FormDemo from './tabs/FormDemo'
import { useModal } from '../hooks/useModal'
// import FormBuilder from '../components/FormBuilder'

export default defineComponent({
	name: 'Demo',
	setup() {
		const tabName = ref('table')
		const tabTitle = computed(() => {
			if (tabName.value === 'table') {
				return '动态表格'
			} else if (tabName.value === 'form') {
				return '动态表单'
			} else if (tabName.value === 'builder') {
				return '表单构建器'
			}
		})

		const handleClick = () => {
			useModal().imperative.open({
				title: '测试标题',
				content: '测试内容',
				yes: () => {
					console.log('确认')
				},
			})
		}

		return () => (
			<NSpace vertical size="large">
				<div class="p-0">
					<NButton onClick={handleClick}>测试按钮</NButton>
					<h1 class="text-[32px] font-bold mb-[24px]">{tabTitle.value}</h1>
					<NTabs type="line" class=" rounded-lg " modelValue={tabName.value}>
						<NTabPane name="table" tab="动态表格">
							<TableDemo />
						</NTabPane>
						<NTabPane name="form" tab="动态表单">
							<FormDemo />
						</NTabPane>
						<NTabPane name="builder" tab="表单构建器">
							{/* <FormBuilder /> */}
						</NTabPane>
					</NTabs>
				</div>
			</NSpace>
		)
	},
})
