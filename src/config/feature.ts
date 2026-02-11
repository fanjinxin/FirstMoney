/**
 * 功能开关：报告下载是否需付费
 * - 测试阶段：false，下载全面开放（打印/另存为 PDF）
 * - 正式上线后：改为 true，下载前需完成付费，再开放下载
 *
 * 可通过环境变量覆盖：
 * VITE_REPORT_DOWNLOAD_REQUIRES_PAYMENT=true  → 需付费
 * VITE_REPORT_DOWNLOAD_REQUIRES_PAYMENT=false → 免费（默认，测试阶段）
 */
const raw = import.meta.env.VITE_REPORT_DOWNLOAD_REQUIRES_PAYMENT
export const reportDownloadRequiresPayment = raw === 'true' || raw === '1'
