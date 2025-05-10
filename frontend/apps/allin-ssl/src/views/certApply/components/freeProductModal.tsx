import { useCertificateFormController } from '@certApply/useController'

/**
 * 证书申请表单组件
 */
export default defineComponent({
	name: 'CertificateForm',
	setup() {
		const { component: CertificateForm } = useCertificateFormController()
		return () => <CertificateForm labelPlacement="top" class="max-w-[50rem] mx-auto" />
	},
})
