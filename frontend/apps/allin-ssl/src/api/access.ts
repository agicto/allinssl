import { useApi } from './index'
import type {
	AccessListParams,
	AccessListResponse,
	AddAccessParams,
	UpdateAccessParams,
	DeleteAccessParams,
	GetAccessAllListParams,
	GetAccessAllListResponse,
} from '../types/access'
import type { AxiosResponseData } from '../types/public'

/**
 * @description 获取授权列表
 * @param {AccessListParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AccessListResponse>>} 授权列表
 */
export const getAccessList = (params?: AccessListParams) =>
	useApi<AccessListResponse, AccessListParams>('/v1/access/get_list', params)

/**
 * @description 新增授权
 * @param {AddAccessParams<string>} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 新增结果
 */
export const addAccess = (params?: AddAccessParams<string>) =>
	useApi<AxiosResponseData, AddAccessParams<string>>('/v1/access/add_access', params)

/**
 * @description 修改授权
 * @param {UpdateAccessParams<string>} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 修改结果
 */
export const updateAccess = (params?: UpdateAccessParams<string>) =>
	useApi<AxiosResponseData, UpdateAccessParams<string>>('/v1/access/upd_access', params)

/**
 * @description 删除授权
 * @param {DeleteAccessParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 删除结果
 */
export const deleteAccess = (params?: DeleteAccessParams) =>
	useApi<AxiosResponseData, DeleteAccessParams>('/v1/access/del_access', params)

/**
 * @description 获取DNS提供商列表
 * @param {GetAccessAllListParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<GetAccessAllListResponse>>} 工作流 dns 配置
 */
export const getAccessAllList = (params?: GetAccessAllListParams) =>
	useApi<GetAccessAllListResponse, GetAccessAllListParams>('/v1/access/get_all', params)
