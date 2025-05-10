/**
 * @file 布局组件类型定义文件
 * @description 此文件包含布局组件及相关接口的 TypeScript 类型定义，
 *              包括布局属性、系统信息、公司信息、菜单项以及布局状态管理等类型定义。
 * @module views/layout/types
 */

/**
 * 布局组件的Props接口定义
 * @interface LayoutProps
 * @property {VNode[]} [children] - 子节点列表
 */
export interface LayoutProps {
	children?: VNode[]
}

/**
 * 系统信息接口定义
 * @interface SystemInfo
 * @property {string} version - 系统版本号
 * @property {boolean} updateAvailable - 是否有可用更新
 * @property {boolean} isPro - 是否为专业版
 */
export interface SystemInfo {
	username: string
	version: string
	secret: string
	id: string
	server_id: string
	uid: string
}

/**
 * 支付信息接口定义
 * @interface PayAuthInfo
 * @property {string} auth - 支付类型
 * @property {number} count - 支付数量
 * @property {string} endtime - 支付结束时间
 */
export interface PayAuthInfo {
	auth: string
	count: number
	endtime: number
}

/**
 * 更新信息接口定义
 * @interface UpdateInfo
 * @property {string} currentVersion - 当前版本
 * @property {string} currentVersionDate - 当前版本发布时间
 * @property {string} newVersion - 新版本
 * @property {string} newVersionDate - 新版本发布时间
 * @property {string[]} upgradeLog - 更新日志
 */
export interface UpdateInfo {
	currentVersion: string
	currentVersionDate: string
	newVersion: string
	newVersionDate: string
	upgradeLog: string[]
}

/**
 * 公司信息接口定义
 * @interface CompanyInfo
 * @property {string} name - 公司名称
 * @property {string} copyright - 版权信息
 * @property {number} year - 年份
 */
export interface CompanyInfo {
	name: string
	copyright: string
	year: string
}

/**
 * 菜单项接口定义
 * @interface MenuItem
 * @property {string} key - 菜单项唯一标识
 * @property {() => VNode} [icon] - 菜单图标渲染函数
 * @property {string} label - 菜单显示文本
 * @property {MenuItem[]} [children] - 子菜单项列表
 * @property {string} [path] - 菜单路由路径
 */
export interface MenuItem {
	key: string
	icon?: () => VNode
	label: string
	children?: MenuItem[]
	path?: string
}

/**
 * 布局状态存储接口定义
 * @interface LayoutStoreState
 * @property {Ref<boolean>} collapsed - 侧边栏折叠状态
 * @property {Ref<SystemInfo>} systemInfo - 系统信息
 * @property {Ref<CompanyInfo>} companyInfo - 公司信息
 * @property {Ref<MenuItem[]>} menuItems - 菜单项列表
 * @property {Ref<string>} menuActive - 当前激活的菜单项
 * @property {Ref<string>} title - 页面标题
 * @property {() => void} openPayModal - 打开支付弹窗方法
 */
export interface LayoutStoreState {
	collapsed: Ref<boolean>
	systemInfo: Ref<SystemInfo>
	companyInfo: Ref<CompanyInfo>
	menuItems: Ref<MenuItem[]>
	menuActive: Ref<string>
	title: Ref<string>
	openPayModal: () => void
}

/**
 * 布局状态管理方法接口定义
 * @interface LayoutStoreMethods
 * @property {() => void} toggleCollapse - 切换侧边栏折叠状态
 * @property {() => Promise<void>} fetchSystemInfo - 获取系统信息
 * @property {(info: Partial<CompanyInfo>) => void} updateCompanyInfo - 更新公司信息
 * @property {(title: string) => void} updateTitle - 更新页面标题
 */
export interface LayoutStoreMethods {
	toggleCollapse: () => void
	fetchSystemInfo: () => Promise<void>
	updateCompanyInfo: (info: Partial<CompanyInfo>) => void
	updateTitle: (title: string) => void
}

/**
 * 布局状态管理完整类型定义
 * @type {LayoutStoreState & LayoutStoreMethods}
 */
export type LayoutStoreType = LayoutStoreState & LayoutStoreMethods

/**
 * @description 路由名称类型定义
 */
export type RouteName =
	| 'logout'
	| 'settings'
	| 'home'
	| 'monitor'
	| 'certApply'
	| 'autoDeploy'
	| 'authApiManage'
	| 'certManage'
