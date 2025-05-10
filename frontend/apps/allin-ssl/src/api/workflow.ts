import { useApi } from './index'
import type {
	WorkflowListParams,
	WorkflowListResponse,
	AddWorkflowParams,
	UpdateWorkflowParams,
	DeleteWorkflowParams,
	WorkflowHistoryParams,
	WorkflowHistoryResponse,
	ExecuteWorkflowParams,
	UpdateWorkflowExecTypeParams,
	EnableWorkflowParams,
	WorkflowHistoryDetailParams,
} from '../types/workflow'
import { AxiosResponseData } from '@/types/public'

/**
 * @description 获取工作流列表
 * @param {WorkflowListParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<WorkflowListResponse>>} 工作流列表
 */
export const getWorkflowList = (params?: WorkflowListParams) =>
	useApi<WorkflowListResponse, WorkflowListParams>('/v1/workflow/get_list', params)

/**
 * @description 新增工作流
 * @param {AddWorkflowParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 新增结果
 */
export const addWorkflow = (params?: AddWorkflowParams) =>
	useApi<AxiosResponseData, AddWorkflowParams>('/v1/workflow/add_workflow', params)

/**
 * @description 修改工作流
 * @param {UpdateWorkflowParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 修改结果
 */
export const updateWorkflow = (params?: UpdateWorkflowParams) =>
	useApi<AxiosResponseData, UpdateWorkflowParams>('/v1/workflow/upd_workflow', params)

/**
 * @description 删除工作流
 * @param {DeleteWorkflowParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 删除结果
 */
export const deleteWorkflow = (params?: DeleteWorkflowParams) =>
	useApi<AxiosResponseData, DeleteWorkflowParams>('/v1/workflow/del_workflow', params)

/**
 * @description 获取工作流执行历史
 * @param {WorkflowHistoryParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<WorkflowHistoryResponse>>} 工作流执行历史
 */
export const getWorkflowHistory = (params?: WorkflowHistoryParams) =>
	useApi<WorkflowHistoryResponse, WorkflowHistoryParams>('/v1/workflow/get_workflow_history', params)

/**
 * @description 获取工作流执行历史详情
 * @param {WorkflowHistoryDetailParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 工作流执行历史详情
 */
export const getWorkflowHistoryDetail = (params?: WorkflowHistoryDetailParams) =>
	useApi<AxiosResponseData, WorkflowHistoryDetailParams>('/v1/workflow/get_exec_log', params)

/**
 * @description 手动执行工作流
 * @param {ExecuteWorkflowParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 执行结果
 */
export const executeWorkflow = (params?: ExecuteWorkflowParams) =>
	useApi<AxiosResponseData, ExecuteWorkflowParams>('/v1/workflow/execute_workflow', params)

/**
 * @description 修改工作流执行方式
 * @param {UpdateWorkflowExecTypeParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 修改结果
 */
export const updateWorkflowExecType = (params?: UpdateWorkflowExecTypeParams) =>
	useApi<AxiosResponseData, UpdateWorkflowExecTypeParams>('/v1/workflow/exec_type', params)

/**
 * @description 启用工作流或禁用工作流
 * @param {EnableWorkflowParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<AxiosResponseData>>} 启用或禁用结果
 */
export const enableWorkflow = (params?: EnableWorkflowParams) =>
	useApi<AxiosResponseData, EnableWorkflowParams>('/v1/workflow/active', params)



