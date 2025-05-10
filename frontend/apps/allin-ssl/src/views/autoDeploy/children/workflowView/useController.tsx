import { useStore } from './useStore'
/**
 * useController
 * @description 组合式API使用store
 * @returns {object} store - 返回store对象
 */
export const useController = () => {
	const { workflowType, detectionRefresh } = useStore()
	const route = useRoute()
	const router = useRouter()

	// 监听页面刷新
	const beforeUnload = (event: any) => {
		event.preventDefault()
		event.returnValue = '您确定要刷新页面吗？数据可能会丢失哦！'
		return '您确定要刷新页面吗？数据可能会丢失哦！'
	}

	// 初始化
	const init = () => {
		// 监听页面刷新
		window.addEventListener('beforeunload', beforeUnload)
		// 获取路由参数
		const type = route.query.type
		if (type) workflowType.value = type as 'quick' | 'advanced'
		// 如果检测刷新为false，则跳转至自动部署页面
		if (!detectionRefresh.value && route.path !== '/auto-deploy') router.push('/auto-deploy')
	}

	// 卸载
	onUnmounted(() => {
		window.removeEventListener('beforeunload', beforeUnload)
	})

	return {
		init,
	}
}
