import { AxiosResponseData } from './public'

/** 站点监控列表请求参数 */
export interface SiteMonitorListParams {
	p?: number
	limit?: number
	search?: string
}

/** 站点监控项 */
export interface SiteMonitorItem {
	active: number
	ca: string
	cert_domain: string
	create_time: string
	cycle: number
	end_day: string
	end_time: string
	except_end_time: string
	id: number
	last_time: string
	name: string
	report_type: string
	site_domain: string
	state: string
	update_time: string
}

/** 站点监控列表响应 */
export interface SiteMonitorListResponse extends AxiosResponseData {
	data: SiteMonitorItem[]
}

/** 新增站点监控请求参数 */
export interface AddSiteMonitorParams {
	name: string
	domain: string
	cycle: number
	report_type: string
}

/** 修改站点监控请求参数 */
export interface UpdateSiteMonitorParams extends AddSiteMonitorParams {
	id: number
}
/** 删除站点监控请求参数 */
export interface DeleteSiteMonitorParams {
	id: number
}

/** 启用/禁用站点监控请求参数 */
export interface SetSiteMonitorParams {
	id: number
	active: number
}
