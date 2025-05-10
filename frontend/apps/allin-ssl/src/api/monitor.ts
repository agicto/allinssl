import { useApi } from './index'
import type { AxiosResponseData } from '@/types/public'
import type {
	SiteMonitorListParams,
	SiteMonitorListResponse,
	AddSiteMonitorParams,
	UpdateSiteMonitorParams,
	DeleteSiteMonitorParams,
	SetSiteMonitorParams,
} from '../types/monitor'

/**
 * @description 获取站点监控列表
 * @param {SiteMonitorListParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<SiteMonitorListResponse>>} 站点监控列表
 */
export const getSiteMonitorList = (params?: SiteMonitorListParams) =>
	useApi<SiteMonitorListResponse, SiteMonitorListParams>('/v1/siteMonitor/get_list', params)

/**
 * @description 新增站点监控
 * @param {AddSiteMonitorParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 新增结果
 */
export const addSiteMonitor = (params?: AddSiteMonitorParams) =>
	useApi<AxiosResponseData, AddSiteMonitorParams>('/v1/siteMonitor/add_site_monitor', params)

/**
 * @description 修改站点监控
 * @param {UpdateSiteMonitorParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 修改结果
 */
export const updateSiteMonitor = (params?: UpdateSiteMonitorParams) =>
	useApi<AxiosResponseData, UpdateSiteMonitorParams>('/v1/siteMonitor/upd_site_monitor', params)

/**
 * @description 删除站点监控
 * @param {DeleteSiteMonitorParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 删除结果
 */
export const deleteSiteMonitor = (params?: DeleteSiteMonitorParams) =>
	useApi<AxiosResponseData, DeleteSiteMonitorParams>('/v1/siteMonitor/del_site_monitor', params)

/**
 * @description 启用/禁用站点监控
 * @param {SetSiteMonitorParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 操作结果
 */
export const setSiteMonitor = (params?: SetSiteMonitorParams) =>
	useApi<AxiosResponseData, SetSiteMonitorParams>('/v1/siteMonitor/set_site_monitor', params)
