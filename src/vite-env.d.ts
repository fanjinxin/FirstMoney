/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 报告下载是否需付费：true=需付费，false=测试阶段开放（默认） */
  readonly VITE_REPORT_DOWNLOAD_REQUIRES_PAYMENT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}
