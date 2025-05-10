import { useRouter } from 'vue-router'
import { useStore } from './useStore'

import { NTag, type DataTableColumns } from 'naive-ui'
import type { WorkflowHistoryItem } from '@/types/public'
import styles from './index.module.css'
import { $t } from '@locales/index'

const { overviewData, fetchOverviewData } = useStore()

/**
 * 首页控制器
 *
 * @description 处理首页视图的业务逻辑，包括状态转换、数据格式化等功能
 * @returns {object} 返回首页视图所需的状态和方法
 */
export const useController = () => {
	// 路由实例
	const router = useRouter()

	// -------------------- 业务逻辑处理 --------------------
	/**
	 * @description 获取工作流状态对应的标签类型
	 * @param {number} state - 工作流状态值
	 * @returns {string} NTag组件的type属性值
	 */
	const getWorkflowStateType = (state: number): 'success' | 'error' | 'warning' | 'default' => {
		switch (state) {
			case 1:
				return 'success' // 成功状态
			case 0:
				return 'warning' // 失败状态
			case -1:
				return 'error' // 执行中状态
			default:
				return 'default' // 未知状态
		}
	}

	/**
	 * @description 获取工作流状态对应的文本说明
	 * @param {number} state - 工作流状态值
	 * @returns {string} 状态的中文描述
	 */
	const getWorkflowStateText = (state: number): string => {
		switch (state) {
			case 1:
				return '成功'
			case 0:
				return '正在运行'
			case -1:
				return '失败'
			default:
				return '未知'
		}
	}

	/**
	 * @description 格式化执行时间为本地化的日期时间字符串
	 * @param {string} time - ISO格式的时间字符串
	 * @returns {string} 格式化后的本地时间字符串
	 */
	const formatExecTime = (time: string): string => {
		return new Date(time).toLocaleString()
	}

	/**
	 * @description 创建工作流历史表格列配置
	 * @returns {DataTableColumns<WorkflowHistoryItem>} 工作流历史表格列配置
	 */
	const createColumns = (): DataTableColumns<WorkflowHistoryItem> => {
		return [
			{
				title: $t('t_2_1745289353944'),
				key: 'name',
			},
			{
				title: $t('t_0_1746590054456'),
				key: 'state',
				render: (row: WorkflowHistoryItem) => {
					const stateType = getWorkflowStateType(row.state)
					const stateText = getWorkflowStateText(row.state)
					return (
						<NTag type={stateType} size="small" class={`${styles.stateText} ${styles[stateType]}`}>
							{stateText}
						</NTag>
					)
				},
			},
			{
				title: $t('t_1_1746590060448'),
				key: 'mode',
				render: (row: WorkflowHistoryItem) => {
					return <span class={styles.tableText}>{row.mode || '未知'}</span>
				},
			},
			{
				title: $t('t_4_1745227838558'),
				key: 'exec_time',
				render: (row: WorkflowHistoryItem) => <span class={styles.tableText}>{formatExecTime(row.exec_time)}</span>,
			},
		]
	}

	/**
	 * @description 跳转至工作流构建页面
	 * @param {string} type - 类型
	 */
	const pushToWorkflow = (type: string = ''): void => {
		router.push(`/auto-deploy${type ? `?type=${type}` : ''}`)
	}

	/**
	 * @description 跳转至申请证书页面
	 * @param {string} type - 类型
	 */
	const pushToCert = (type: string = ''): void => {
		router.push(`/cert-apply${type ? `?type=${type}` : ''}`)
	}

	/**
	 * @description 跳转至证书管理
	 * @param {string} type - 类型
	 */
	const pushToCertManage = (): void => {
		router.push(`/cert-manage`)
	}

	/**
	 * @description 跳转至添加监控页面
	 * @param {string} type - 类型
	 */
	const pushToMonitor = (type: string = ''): void => {
		router.push(`/monitor${type ? `?type=${type}` : ''}`)
	}

	onMounted(fetchOverviewData)

	// 暴露状态和方法给视图使用
	return {
		overviewData,
		pushToWorkflow,
		pushToCert,
		pushToMonitor,
		pushToCertManage,
		getWorkflowStateType,
		getWorkflowStateText,
		formatExecTime,
		createColumns,
	}
}
