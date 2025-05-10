/**
 * @description 基础组件
 * @example
 * ```tsx
 * <BaseComponent>
 *   <template #header-left>左侧头部内容</template>
 *   <template #header-right>右侧头部内容</template>
 *   <template #content>主要内容</template>
 *   <template #footer-left>左侧底部内容</template>
 *   <template #footer-right>右侧底部内容</template>
 *   <template #popup>弹窗内容</template>
 * </BaseComponent>
 * ```
 */
export default defineComponent({
	name: 'BaseComponent',
	setup(_, { slots }) {
		// 获取插槽内容，支持驼峰和短横线两种命名方式
		const slotHL = slots['header-left'] || slots['headerLeft']
		const slotHR = slots['header-right'] || slots['headerRight']
		const slotHeader = slots['header'] || slots['header']
		const slotFL = slots['footer-left'] || slots['footerLeft']
		const slotFR = slots['footer-right'] || slots['footerRight']
		const slotFooter = slots['footer'] || slots['footer']

		return () => (
			<div class="flex flex-col">
				{/* 头部区域 */}
				{(slotHL || slotHR) && (
					<div class="flex justify-between flex-wrap" style={{ rowGap: '0.8rem' }}>
						<div class="flex flex-shrink-0">{slotHL && slotHL()}</div>
						<div class="flex flex-shrink-0">{slotHR && slotHR()}</div>
					</div>
				)}

				{/* 头部区域 */}
				{slotHeader && <div class="flex justify-between flex-wrap w-full">{slotHeader && slotHeader()}</div>}

				{/* 内容区域 */}
				<div class={`w-full content ${slotHL || slotHR ? 'mt-[1.2rem]' : ''} ${slotFL || slotFR ? 'mb-[1.2rem]' : ''}`}>
					{slots.content && slots.content()}
				</div>

				{/* 底部区域 */}
				{(slotFL || slotFR) && (
					<div class="flex justify-between">
						<div class="flex flex-shrink-0">{slotFL && slotFL()}</div>
						<div class="flex flex-shrink-0">{slotFR && slotFR()}</div>
					</div>
				)}

				{/* 底部区域 */}
				{slotFooter && <div class="flex justify-between w-full">{slotFooter()}</div>}

				{/* 弹窗区域 */}
				{slots.popup && slots.popup()}
			</div>
		)
	},
})
