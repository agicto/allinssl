import { useApi } from './index'
import type {
	CertListParams,
	CertListResponse,
	ApplyCertParams,
	ApplyCertResponse,
	UploadCertParams,
	UploadCertResponse,
	DeleteCertParams,
	DeleteCertResponse,
	DownloadCertParams,
} from '../types/cert'
import axios from 'axios'

/**
 * @description 获取证书列表
 * @param {CertListParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<CertListResponse>>} 证书列表
 */
export const getCertList = (params?: CertListParams) =>
	useApi<CertListResponse, CertListParams>('/v1/cert/get_list', params)

/**
 * @description 申请证书
 * @param {ApplyCertParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<ApplyCertResponse>>} 申请结果
 */
export const applyCert = (params?: ApplyCertParams) =>
	useApi<ApplyCertResponse, ApplyCertParams>('/v1/cert/apply_cert', params)

/**
 * @description 上传证书
 * @param {UploadCertParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<UploadCertResponse>>} 上传结果
 */
export const uploadCert = (params?: UploadCertParams) =>
	useApi<UploadCertResponse, UploadCertParams>('/v1/cert/upload_cert', params)

/**
 * @description 删除证书
 * @param {DeleteCertParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<DeleteCertResponse>>} 删除结果
 */
export const deleteCert = (params?: DeleteCertParams) =>
	useApi<DeleteCertResponse, DeleteCertParams>('/v1/cert/del_cert', params)

/**
 * @description 下载证书
 * @param {DownloadCertParams} [params] 请求参数
 * @returns {Promise<AxiosResponse<DownloadCertResponse>>} 下载结果
 */
export const downloadCert = (params?: DownloadCertParams) => {
	return axios.get('/v1/cert/download', {
		params,
	})
}
