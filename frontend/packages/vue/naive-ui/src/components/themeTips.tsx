import { defineComponent, PropType } from 'vue'
import { NDropdown, NIcon, NButton } from 'naive-ui'
import { Sunny, Moon } from '@vicons/ionicons5'

import { useTheme } from '../theme/index'
import type { DropdownOption } from 'naive-ui'
interface Props {
	type?: 'button' | 'link'
}

export default defineComponent({
	props: {
		type: {
			type: String as PropType<'button' | 'link'>,
			default: 'button',
		},
	},
	setup(props: Props) {
		const { isDark, cutDarkMode, themeActive } = useTheme()

		const dropdownOptions: DropdownOption[] = [
			{
				label: '亮色模式',
				key: 'defaultLight',
			},
			{
				label: '暗色模式',
				key: 'defaultDark',
			},
		]

		return () => (
			<NDropdown options={dropdownOptions} onSelect={() => cutDarkMode(true, this)} value={themeActive.value}>
				<div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
					{props.type === 'button' ? (
						<NButton quaternary strong circle type="primary">
							<NIcon size={20}>{isDark.value ? <Moon /> : <Sunny />}</NIcon>
						</NButton>
					) : (
						<NIcon size={20}>{isDark.value ? <Moon /> : <Sunny />}</NIcon>
					)}
				</div>
			</NDropdown>
		)
	},
})
