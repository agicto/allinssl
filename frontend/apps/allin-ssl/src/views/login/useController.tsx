import md5 from 'crypto-js/md5'
import { useError } from '@baota/hooks/error'
import { $t } from '@locales/index'
import { useStore } from './useStore'
import type { LoginParams } from '@/types/login'

/**
 * @file 登录控制器
 * @description 处理登录页面的业务逻辑，包括表单验证、密码加密、记住密码等功能
 */

// ==================== 类型定义 ====================
interface RememberData {
	username: string
	password: string
}

// ==================== 工具函数 ====================
/**
 * @description md5 密码加密
 * @param {string} password - 原始密码
 * @returns {string} 加密后的密码
 */
const encryptPassword = (password: string): string => {
	return md5(`${password}_bt_all_in_ssl`).toString()
}

/**
 * @description 获取记住密码数据
 * @returns {RememberData | null} 返回登录数据
 */
const getRememberData = (): RememberData | null => {
	const loginDataInfo = localStorage.getItem('loginData')
	if (!loginDataInfo) return null
	return JSON.parse(loginDataInfo)
}

/**
 * @description 设置记住密码数据
 * @param {string} username - 用户名
 * @param {string} password - 密码
 */
const setRememberData = (username: string, password: string): void => {
	localStorage.setItem('loginData', JSON.stringify({ username, password }))
}

// ==================== 控制器逻辑 ====================
/**
 * @description 登录控制器钩子
 * @returns {Object} 返回登录相关的状态和方法
 */
export const useController = () => {
	const store = useStore()

	const { handleError } = useError()
	const { error, loginData, handleLogin, resetForm, rememberMe, checkMustCode } = store

	/**
	 * @description 处理登录业务
	 * @param {LoginParams} params - 登录参数
	 */
	const handleLoginBusiness = async (params: LoginParams): Promise<void> => {
		// 表单验证
		if (!params.username.trim()) {
			error.value = $t('t_3_1744164839524')
			return
		}
		if (!params.password.trim()) {
			error.value = $t('t_4_1744164840458')
			return
		}

		try {
			const encryptedPassword = encryptPassword(params.password)
			await handleLogin({ ...params, password: encryptedPassword })
			// 处理记住密码
			if (rememberMe.value && !error.value) {
				setRememberData(params.username, params.password)
			} else if (error.value) {
				loginData.value.password = ''
			} else if (!error.value) {
				resetForm()
			}
		} catch (err) {
			handleError(err)
		}
	}

	/**
	 * @description 处理表单提交
	 * @param {Event} event - 表单提交事件
	 */
	const handleSubmit = async (event: Event): Promise<void> => {
		event.preventDefault()
		await handleLoginBusiness(loginData.value)
	}

	/**
	 * @description 处理回车键提交
	 * @param {KeyboardEvent} event - 键盘事件
	 */
	const handleKeyup = (event: KeyboardEvent): void => {
		if (event.key === 'Enter') {
			handleSubmit(event)
		}
	}

	// ==================== 生命周期钩子 ====================
	const scope = effectScope()

	scope.run(() => {
		// 监听错误信息，5秒后自动清除
		watch(error, () => {
			setTimeout(() => {
				error.value = ''
			}, 5000)
		})

		onScopeDispose(() => {
			scope.stop()
		})
	})

	onMounted(() => {
		checkMustCode() // 检测是否必须验证码
		if (rememberMe.value) {
			const rememberedData = getRememberData() // 获取记住密码数据
			if (rememberedData) loginData.value = rememberedData
		}
	})

	// ==================== 返回值 ====================
	return {
		...store,
		handleSubmit,
		handleKeyup,
		handleLogin: handleLoginBusiness,
		getRememberData,
		setRememberData,
	}
}
