import { useApi } from './index'
import type { AxiosResponseData } from '../types/public'
import type {
	GetSettingParams,
	GetSettingResponse,
	SaveSettingParams,
	GetReportListParams,
	GetReportListResponse,
	AddReportParams,
	UpdateReportParams,
	DeleteReportParams,
	TestReportParams,
} from '../types/setting'

/**
 * @description 获取系统设置
 * @param {GetSettingParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<GetSettingResponse>>} 系统设置
 */
export const getSystemSetting = (params?: GetSettingParams) =>
	useApi<GetSettingResponse, GetSettingParams>('/v1/setting/get_setting', params)

/**
 * @description 保存系统设置
 * @param {SaveSettingParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 保存结果
 */
export const saveSystemSetting = (params?: SaveSettingParams) =>
	useApi<AxiosResponseData, SaveSettingParams>('/v1/setting/save_setting', params)

/**
 * @description 添加告警
 * @param {AddReportParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 配置结果
 */
export const addReport = (params?: AddReportParams) =>
	useApi<AxiosResponseData, AddReportParams>('/v1/report/add_report', params)

/**
 * @description 更新告警
 * @param {UpdateReportParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 更新结果
 */
export const updateReport = (params?: UpdateReportParams) =>
	useApi<AxiosResponseData, UpdateReportParams>('/v1/report/upd_report', params)

/**
 * @description 删除告警
 * @param {DeleteReportParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 删除结果
 */
export const deleteReport = (params?: DeleteReportParams) =>
	useApi<AxiosResponseData, DeleteReportParams>('/v1/report/del_report', params)

/**
 * @description 测试告警
 * @param {TestReportParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 测试结果
 */
export const testReport = (params?: TestReportParams) =>
	useApi<AxiosResponseData, TestReportParams>('/v1/report/notify_test', params)

/**
 * @description 获取告警类型列表
 * @param {GetReportListParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<GetReportListResponse>>} 告警类型列表
 */
export const getReportList = (params?: GetReportListParams) =>
	useApi<GetReportListResponse, GetReportListParams>('/v1/report/get_list', params)
