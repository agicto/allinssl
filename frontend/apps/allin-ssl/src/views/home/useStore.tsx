import { getOverviews } from '@/api/public'
import { $t } from '@locales/index'
import { useError } from '@baota/hooks/error'
import type { OverviewData } from '@/types/public'

/**
 * 首页数据存储
 *
 * 使用Pinia管理首页相关的状态和操作，包括：
 * - 概览数据的获取和存储
 * - 页面导航功能
 * - 加载状态管理
 */
export const useHomeStore = defineStore('home-store', () => {
	// -------------------- 状态定义 --------------------
	/**
	 * 数据加载状态
	 * 用于控制页面加载指示器的显示
	 */
	const loading = ref(false)

	/**
	 * 首页概览数据
	 * 包含工作流、证书和监控的统计信息以及工作流历史记录
	 */
	const overviewData = ref<OverviewData>({
		workflow: { count: 0, active: 0, failure: 0 },
		cert: { count: 0, will: 0, end: 0 },
		site_monitor: { count: 0, exception: 0 },
		workflow_history: [],
	})

	// 错误处理
	const { handleError } = useError()

	// -------------------- 请求方法 --------------------
	/**
	 * @description 获取首页概览数据
	 * @returns {Promise<void>} 返回Promise对象
	 */
	const fetchOverviewData = async (): Promise<void> => {
		try {
			loading.value = true
			const { data, status } = await getOverviews().fetch()
			if (status) {
				const { workflow, cert, site_monitor, workflow_history } = data
				overviewData.value = {
					workflow: {
						count: workflow?.count || 0,
						active: workflow?.active || 0,
						failure: workflow?.failure || 0,
					},
					cert: { count: cert?.count || 0, will: cert?.will || 0, end: cert?.end || 0 },
					site_monitor: { count: site_monitor?.count || 0, exception: site_monitor?.exception || 0 },
					workflow_history: workflow_history || [],
				}
			}
		} catch (error) {
			console.error('获取首页概览数据失败', error)
			handleError(error).default($t('t_3_1745833936770'))
		} finally {
			loading.value = false
		}
	}

	// 返回状态和方法
	return {
		loading,
		overviewData,
		fetchOverviewData,
	}
})

/**
 * 首页状态管理钩子
 *
 * 将Store包装为组合式API风格，便于在视图组件中使用
 * 自动处理响应式引用，简化状态的访问和修改
 *
 * @returns {object} 包含状态和方法的对象，支持解构使用
 */
export const useStore = () => {
	const store = useHomeStore()
	return { ...store, ...storeToRefs(store) }
}
