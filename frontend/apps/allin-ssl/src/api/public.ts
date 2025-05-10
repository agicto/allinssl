import axios from 'axios'
import { useApi } from './index'
import type {
	loginParams,
	loginResponse,
	GetOverviewsParams,
	GetOverviewsResponse,
	AxiosResponseData,
} from '@/types/public'

/**
 * @description 登录
 * @param {loginParams} [params] 登录参数
 * @returns {Promise<AxiosResponse<loginResponse>>} 登录结果
 */
export const login = (params?: loginParams) => useApi<loginResponse, loginParams>('/v1/login/sign', params)

/**
 * @description 获取登录验证码
 * @returns {Promise<AxiosResponse<loginCodeResponse>>} 登录验证码
 */
export const getLoginCode = () => {
	return axios.get('/v1/login/get_code')
}

/**
 * @description 登出
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 登出结果
 */
export const signOut = () => useApi<AxiosResponseData>('/v1/login/sign-out')

/**
 * @description 获取首页概览
 * @param {GetOverviewsParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<GetOverviewsResponse>>} 首页概览数据
 */
export const getOverviews = (params?: GetOverviewsParams) =>
	useApi<GetOverviewsResponse, GetOverviewsParams>('/v1/overview/get_overviews', params)
