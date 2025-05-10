import { useError } from '@baota/hooks/error'

import type { RouteName } from './types'
import { DnsProviderOption, NotifyProviderOption } from '@/types/setting'
import { getReportList } from '@api/setting'
import { getAccessAllList } from '@api/index'

/**
 * @description 布局相关的状态管理
 * @warn 包含部分硬编码的业务数据，需要从API获取
 */
export const useLayoutStore = defineStore('layout-store', () => {
	const { handleError } = useError()

	// ==============================
	// 状态定义
	// ==============================

	/**
	 * @description UI 相关状态
	 */
	const isCollapsed = useLocalStorage<boolean>('layout-collapsed', false)

	/**
	 * @description 消息通知
	 */
	const notifyProvider = ref<NotifyProviderOption[]>([])

	/**
	 * @description DNS提供商
	 */
	const dnsProvider = ref<DnsProviderOption[]>([])

	/**
	 * @description 导航状态
	 */
	const menuActive = useLocalStorage<RouteName>('menu-active', 'home')

	/**
	 * @description 布局内边距
	 */
	const layoutPadding = computed(() => {
		return menuActive.value !== 'home' ? 'var(--n-content-padding)' : '0'
	})

	/**
	 * @description 语言
	 */
	const locales = useLocalStorage<string>('locales-active', 'zhCN')

	// ==============================
	// UI 交互方法
	// ==============================

	/**
	 * @description 切换侧边栏折叠状态
	 */
	const toggleCollapse = (): void => {
		isCollapsed.value = !isCollapsed.value
	}

	/**
	 * @description 展开侧边栏
	 */
	const handleCollapse = () => {
		isCollapsed.value = true
	}

	/**
	 * @description 收起侧边栏
	 */

	const handleExpand = () => {
		isCollapsed.value = false
	}

	/**
	 * @description 更新菜单激活状态
	 * @param active - 激活状态
	 */
	const updateMenuActive = (active: RouteName): void => {
		if (active === 'logout') return
		menuActive.value = active
	}

	/**
	 * @description 重置数据信息
	 */
	const resetDataInfo = (): void => {
		menuActive.value = 'home'
		localStorage.removeItem('menu-active')
	}

	// ==============================
	// API 请求方法
	// ==============================

	/**
	 * @description 获取消息通知提供商
	 * @returns 消息通知提供商
	 */
	const fetchNotifyProvider = async (): Promise<void> => {
		try {
			notifyProvider.value = []
			const { data } = await getReportList({ p: 1, search: '', limit: 1000 }).fetch()
			notifyProvider.value = data?.map((item) => {
				return {
					label: item.name,
					value: item.id.toString(),
					type: item.type,
				}
			})
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 * @description 获取DNS提供商
	 * @param type - 类型
	 * @returns DNS提供商
	 */
	const fetchDnsProvider = async (
		type: 'btpanel' | 'aliyun' | 'ssh' | 'tencentcloud' | '1panel' | 'dns' | '' = '',
	): Promise<void> => {
		try {
			dnsProvider.value = []
			const { data } = await getAccessAllList({ type }).fetch()
			console.timeEnd('loadDnsProviders')
			dnsProvider.value =
				data?.map((item) => ({
					label: item.name,
					value: item.id.toString(),
					type: item.type,
				})) || []
			console.timeEnd('loadDnsProviders')
		} catch (error) {
			handleError(error)
		}
	}

	// ==============================
	// 表单处理方法
	// ==============================

	return {
		// 状态
		locales,
		notifyProvider,
		dnsProvider,
		isCollapsed,
		layoutPadding,
		menuActive,

		// 方法
		resetDataInfo,
		updateMenuActive,
		toggleCollapse,
		handleCollapse,
		handleExpand,
		fetchNotifyProvider,
		fetchDnsProvider,
	}
})

/**
 * @description 辅助函数：获取布局相关的状态和方法
 * @returns 组合了store实例和响应式引用的对象
 */
export const useStore = () => {
	const store = useLayoutStore()
	return { ...store, ...storeToRefs(store) }
}
