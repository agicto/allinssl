/**
 * @file 登录模块状态管理
 * @description 负责处理登录相关的状态管理，包括用户认证、token管理和登录状态维护
 */
import { useMessage } from '@baota/naive-ui/hooks'
import { getLoginCode, login } from '@api/public'
import { getCookie } from '@baota/utils/browser'
import { useError } from '@baota/hooks/error'

import type { UserInfo } from '@/types/login'

/** 消息提示 */
const { success } = useMessage()
const { handleError } = useError()
// ==================== Store 定义 ====================
export const useLoginStore = defineStore('login-store', () => {
	// -------------------- 状态定义 --------------------
	/** 认证相关状态 */
	const user = ref<UserInfo | null>(null)
	const codeImg = ref('')
	const useToken = useLocalStorage<string>('login-token', '')
	const mustCode = ref<boolean>(false) // 是否必须验证码

	/** 表单相关状态 */
	const loginData = ref<{
		username: string
		password: string
		code?: string
	}>({
		username: '',
		password: '',
		code: '',
	})

	const rememberMeRef = useLocalStorage<boolean>('remember-me', false)
	const forgotPasswordRef = ref<HTMLAnchorElement | null>(null)

	// 初始化登录请求
	const { fetch, error, data, defaultData, message, loading } = login()
	// -------------------- 工具方法 --------------------

	/**
	 * 重置表单状态
	 */
	const resetForm = () => {
		loginData.value.username = ''
		loginData.value.password = ''
		rememberMeRef.value = false
		error.value = null
	}

	/**
	 * 清除token
	 */
	const clearToken = () => {
		useToken.value = null
	}

	// -------------------- 核心业务逻辑 --------------------
	/**
	 * 登录处理
	 * @param {string} username - 用户名
	 * @param {string} password - 密码
	 * @returns {Promise<void>}
	 */
	const handleLogin = async (params: { username: string; password: string; code?: string }): Promise<void> => {
		try {
			error.value = null // 错误信息
			message.value = true // 消息提示
			// 发送登录请求
			await fetch(params)
			const { status } = data.value
			// 处理登录响应
			if (status) {
				success('登录成功，正在跳转中...')
				// 登录成功，跳转到服务器页面
				setTimeout(() => (location.href = '/'), 1000)
			} else {
				throw new Error(data.value.message)
			}
			checkMustCode()
		} catch (err: unknown) {
			error.value = (err as Error).message
			checkMustCode()
		}
	}

	/**
	 * 登出处理
	 * 清除用户信息和token，并重定向到登录页
	 */
	const handleLogout = () => {
		// 清除所有状态
		user.value = null
		useToken.value = null
		resetForm()
		location.href = '/login'
	}

	/**
	 * 获取登录验证码
	 */
	const handleGetCode = async () => {
		try {
			const { data } = await getLoginCode()
			codeImg.value = data.data
		} catch (error) {
			handleError(error)
		}
	}

	/**
	 *  检测是否必须验证码
	 */
	const checkMustCode = () => {
		const res = getCookie('must_code', false)
		console.log('res', res)
		mustCode.value = Number(res) === 1
		if (mustCode.value) handleGetCode()
	}

	// -------------------- Store 导出 --------------------
	return {
		// 状态导出
		loading,
		codeImg,
		error,
		user,
		// token: useToken,
		loginData,
		rememberMe: rememberMeRef,
		forgotPasswordRef,
		mustCode,

		// 方法导出
		handleLogin,
		handleLogout,
		handleGetCode,
		checkMustCode,
		resetForm,
		clearToken,
	}
})

/**
 * 登录Store Hook
 * @returns {Object} 登录Store的响应式状态和方法
 */
export const useStore = () => {
	const store = useLoginStore()
	return { ...store, ...storeToRefs(store) }
}
