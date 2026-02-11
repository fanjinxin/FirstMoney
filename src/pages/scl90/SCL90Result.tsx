import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { reportDownloadRequiresPayment } from '../../config/feature'
import FactorBarChart from '../../components/FactorBarChart'
import FactorRadarChart from '../../components/FactorRadarChart'
import SymptomPieChart from '../../components/SymptomPieChart'
import { scl90Test } from '../../data/scl90'
import { calculateScl90Scores, Scl90FactorScore } from '../../utils/scoring'
import { loadAnswers } from '../../utils/storage'

function getLevelColor(level: string) {
  switch (level) {
    case 'normal':
      return 'text-emerald-600'
    case 'mild':
      return 'text-blue-600'
    case 'moderate':
      return 'text-amber-600'
    case 'severe':
      return 'text-red-600'
    default:
      return 'text-slate-600'
  }
}

function getLevelBg(level: string) {
  switch (level) {
    case 'normal':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'mild':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'moderate':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'severe':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

function getTotalLevelStyle(level: string) {
  switch (level) {
    case '正常':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200'
    case '轻度困扰':
      return 'bg-blue-50 text-blue-800 border-blue-200'
    case '中度困扰':
      return 'bg-amber-50 text-amber-800 border-amber-200'
    case '重度困扰':
      return 'bg-red-50 text-red-800 border-red-200'
    default:
      return 'bg-slate-50 text-slate-800 border-slate-200'
  }
}

function formatDate() {
  const now = new Date()
  return `${now.getFullYear()} 年 ${String(now.getMonth() + 1).padStart(2, '0')} 月 ${String(now.getDate()).padStart(2, '0')} 日`
}

function FactorDetailBlock({ factor, index }: { factor: Scl90FactorScore; index: number }) {
  const barWidth = Math.min((factor.score / 5) * 100, 100)
  return (
    <div className="py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">
              {index + 1}. {factor.name}
            </span>
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${getLevelBg(factor.level)}`}
            >
              {factor.levelLabel}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{factor.detail}</p>
        </div>
        <div className="flex flex-col items-end pt-0.5">
          <span className={`text-lg font-bold tabular-nums ${getLevelColor(factor.level)}`}>
            {factor.score.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${
            factor.level === 'normal'
              ? 'bg-emerald-400'
              : factor.level === 'mild'
                ? 'bg-blue-400'
                : factor.level === 'moderate'
                  ? 'bg-amber-400'
                  : 'bg-red-400'
          }`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  )
}

export default function SCL90Result() {
  const answers = loadAnswers(scl90Test.id)
  const totalQuestions = scl90Test.questions.length
  const answeredCount = answers ? Object.keys(answers).length : 0
  if (!answers || answeredCount < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-slate-700">尚未完成测评</div>
        <p className="text-sm text-slate-500">请完成全部题目后查看结果。</p>
        <Link
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
          to="/scl90"
        >
          返回 SCL-90 测试
        </Link>
      </div>
    )
  }

  const summary = calculateScl90Scores(scl90Test.questions, scl90Test.dimensions, answers)
  const factors = summary.factors
  const top3Factors = summary.top3Factors
  const radarData = factors.map((item) => ({
    name: item.name,
    score: Number(item.score.toFixed(2)),
    line2: 2,
    line3: 3,
  }))
  const barChartData = [...factors]
    .sort((a, b) => b.score - a.score)
    .map((item) => ({
      id: item.id,
      name: item.name,
      score: item.score,
      hint: item.description,
      level: item.level,
    }))
  const severityRanks: Record<string, number> = {
    normal: 0,
    mild: 1,
    moderate: 2,
    severe: 3,
  }
  const maxSeverity = Math.max(...factors.map((item) => severityRanks[item.level]))
  const suggestionLevel =
    maxSeverity >= 3 || summary.basic.totalLevel === '重度困扰'
      ? 'severe'
      : maxSeverity >= 2 || summary.basic.totalLevel === '中度困扰'
        ? 'moderate'
        : maxSeverity >= 1 || summary.basic.totalLevel === '轻度困扰'
          ? 'mild'
          : 'normal'

  const positiveRatio = ((summary.basic.positiveCount / 90) * 100).toFixed(1)
  const topFactor = top3Factors[0]

  const [showPayModal, setShowPayModal] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const handleDownloadReport = async () => {
    if (reportDownloadRequiresPayment) {
      setShowPayModal(true)
      return
    }
    const el = reportRef.current
    if (!el) return
    setExportingPdf(true)
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgW = 210
      const imgH = (canvas.height * imgW) / canvas.width
      const pageH = 297
      pdf.addImage(imgData, 'PNG', 0, 0, imgW, imgH)
      let y = pageH
      while (y < imgH) {
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, -y, imgW, imgH)
        y += pageH
      }
      const dateStr = new Date().toISOString().slice(0, 10)
      const fileName = `SCL90-报告-${dateStr}.pdf`
      pdf.save(fileName)
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <div className="scl90-report-page mx-auto max-w-4xl animate-fade-in">
      {/* 付费下载占位弹窗（后续接入支付后替换） */}
      {showPayModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:hidden"
          onClick={() => setShowPayModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pay-modal-title"
        >
          <div
            className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="pay-modal-title" className="text-lg font-bold text-slate-900">
              下载报告
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              正式版中，下载完整报告需付费。付费后可下载 PDF 报告并长期保存。
            </p>
            <p className="mt-2 text-xs text-slate-400">
              功能即将上线，敬请期待。
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Report Paper ===== */}
      <div
        ref={reportRef}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        {/* ── Report Header ── */}
        <div className="relative overflow-hidden border-b-2 border-slate-800 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 px-4 py-6 text-white sm:px-8 sm:py-8 md:px-12">
          <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-8 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Psychological Assessment Report
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                90项症状自评量表（SCL-90）
              </h1>
              <div className="mt-1 text-sm text-slate-400">心理健康筛查评估报告</div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-start gap-3 text-left sm:items-end sm:text-right">
              <button
                type="button"
                onClick={handleDownloadReport}
                disabled={exportingPdf}
                className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {exportingPdf ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    导出中…
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {reportDownloadRequiresPayment ? '下载报告（付费）' : '导出 PDF'}
                  </>
                )}
              </button>
              <div className="hidden rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 sm:block">
                仅供参考
              </div>
            </div>
          </div>
        </div>

        {/* ── Report Meta ── */}
        <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white px-4 py-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                报告日期
              </div>
              <div className="mt-1 font-medium text-slate-800">{formatDate()}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                评估时段
              </div>
              <div className="mt-1 font-medium text-slate-800">最近一周</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                量表题数
              </div>
              <div className="mt-1 font-medium text-slate-800">90 题</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                计分范围
              </div>
              <div className="mt-1 font-medium text-slate-800">1（无）~ 5（严重）</div>
            </div>
          </div>
        </div>

        {/* ── Report Body ── */}
        <div className="px-4 py-6 sm:px-8 sm:py-8 md:px-12">
          <div className="relative mb-10">
            <div className="pointer-events-none absolute -right-24 -top-20 h-48 w-48 rounded-full bg-xia-sky/35 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 top-24 h-36 w-36 rounded-full bg-xia-aqua/40 blur-3xl" />
            <div className="pointer-events-none absolute right-10 top-36 h-28 w-28 rounded-full bg-xia-cream/80 blur-2xl" />
            <div className="relative z-10 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-[28px] border border-xia-haze bg-gradient-to-br from-xia-sky via-xia-aqua to-xia-mint p-6 text-xia-deep shadow-[0_20px_45px_rgba(104,212,219,0.35),_0_6px_0_rgba(255,255,255,0.6)] sm:p-7">
                  <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-white/35 blur-3xl" />
                  <div className="pointer-events-none absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-xia-cream/70 blur-2xl" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent" />
                  <div className="relative space-y-3">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-xia-deep/70">
                      人格类型
                    </div>
                    <div className="text-3xl font-bold">{summary.basic.totalLevel}</div>
                    <div className="text-sm text-xia-deep/80">综合结论 · {summary.basic.totalLevel}型</div>
                    <div className="mt-4 inline-flex items-center rounded-full bg-xia-cream px-3 py-1 text-xs font-semibold text-xia-teal shadow-[0_6px_16px_rgba(44,111,122,0.15)]">
                      核心结论：{top3Factors.map((f) => f.name).join('、')}
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-[28px] border border-xia-haze bg-gradient-to-br from-xia-aqua via-xia-sky to-xia-mint p-6 text-xia-deep shadow-[0_20px_45px_rgba(127,191,225,0.35),_0_6px_0_rgba(255,255,255,0.6)] sm:p-7">
                  <div className="pointer-events-none absolute -right-12 top-0 h-32 w-32 rounded-full bg-white/35 blur-2xl" />
                  <div className="pointer-events-none absolute -left-12 bottom-2 h-24 w-24 rounded-full bg-xia-cream/70 blur-2xl" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-white/10 to-transparent" />
                  <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-xia-deep/70">
                    测试总分
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="text-4xl font-bold tracking-tight">{summary.basic.totalScore}</div>
                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border border-white/60 bg-white/40 text-center shadow-[0_10px_20px_rgba(15,76,92,0.2)]">
                      <div className="text-sm font-bold">{summary.basic.avgTotal.toFixed(2)}</div>
                      <div className="text-[10px] text-xia-deep/70">总均分</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-xia-deep/70">范围 90–450</div>
                </div>
              </div>
              <div className="rounded-3xl border border-xia-haze bg-white/90 p-5 shadow-[0_18px_35px_rgba(104,212,219,0.18)] backdrop-blur sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      核心结论
                    </div>
                    <div className="text-xl font-bold text-slate-900 sm:text-2xl">
                      综合结论：{summary.basic.totalLevel}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {summary.basic.totalLevel === '正常'
                        ? '当前整体心理状态较为稳定，可继续保持规律作息与情绪管理。'
                        : `当前存在${summary.basic.totalLevel}表现，${top3Factors.map((f) => f.name).join('、')}维度尤为突出。`}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-xia-cream shadow-[0_12px_24px_rgba(44,111,122,0.18)] sm:h-28 sm:w-28">
                      <img
                        src="https://twemoji.maxcdn.com/v/latest/72x72/1f9d1.png"
                        alt="人物插画"
                        className="h-14 w-14 sm:h-16 sm:w-16"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-xia-haze bg-gradient-to-br from-white via-white to-xia-mint/30 p-4 shadow-[0_14px_28px_rgba(104,212,219,0.18)]">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">阳性项目</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">{summary.basic.positiveCount}</div>
                  <div className="mt-1 text-sm text-slate-500">占比 {positiveRatio}%</div>
                </div>
                <div className="rounded-2xl border border-xia-haze bg-gradient-to-br from-white via-white to-xia-mint/30 p-4 shadow-[0_14px_28px_rgba(104,212,219,0.18)]">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">总均分</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">{summary.basic.avgTotal.toFixed(2)}</div>
                  <div className="mt-1 text-sm text-slate-500">1–5 量表均值</div>
                </div>
                <div className="rounded-2xl border border-xia-haze bg-gradient-to-br from-white via-white to-xia-mint/30 p-4 shadow-[0_14px_28px_rgba(104,212,219,0.18)]">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">最高因子</div>
                  <div className="mt-2 text-base font-semibold text-slate-900">{topFactor?.name ?? '暂无'}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {topFactor ? `均分 ${topFactor.score.toFixed(2)} · ${topFactor.levelLabel}` : '等待完成'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-10 h-px bg-slate-100" />
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                1
              </span>
              可视化分析
            </h2>
            <div className="mt-4 h-px bg-slate-200" />
            <p className="mt-5 text-sm leading-relaxed text-slate-700">
              通过图表快速了解十因子整体轮廓、症状分布与因子强弱排序。
            </p>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr,1fr]">
              <FactorRadarChart data={radarData} />
              <SymptomPieChart data={summary.symptomDist} />
            </div>
            <div className="mt-5">
              <FactorBarChart data={barChartData} />
            </div>
          </section>
          <div className="my-10 h-px bg-slate-100" />
          {/* Section 1: 总体评价 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                3
              </span>
              总体评价
            </h2>
            <div className="mt-4 h-px bg-slate-200" />

            <div className="mt-5">
              <p className="text-sm leading-relaxed text-slate-700">
                本次评估总分为{' '}
                <span className="font-bold text-slate-900">{summary.basic.totalScore} 分</span>
                ，总均分{' '}
                <span className="font-bold text-slate-900">
                  {summary.basic.avgTotal.toFixed(2)}
                </span>
                。在 90 个项目中，有{' '}
                <span className="font-bold text-slate-900">
                  {summary.basic.positiveCount} 项（{positiveRatio}%）
                </span>{' '}
                达到阳性标准（评分 ≥ 2），阳性症状均分{' '}
                <span className="font-bold text-slate-900">
                  {summary.basic.positiveAvg.toFixed(2)}
                </span>
                。
              </p>

              <div
                className={`mt-4 rounded-2xl border px-5 py-4 shadow-sm ${getTotalLevelStyle(summary.basic.totalLevel)}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">综合评估结论：</span>
                  <span className="text-lg font-bold">{summary.basic.totalLevel}</span>
                </div>
                <p className="mt-1 text-sm opacity-80">
                  {summary.basic.totalLevel === '正常'
                    ? '近期整体心理健康状态基本平稳，未见明显异常。'
                    : `近期存在${summary.basic.totalLevel}，其中${top3Factors.map((f) => f.name).join('、')}维度的不适较为突出，建议重点关注。`}
                </p>
              </div>
            </div>

            {/* 核心指标表格 */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-[520px] w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      指标
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      数值
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-800">总分</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                      {summary.basic.totalScore}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">90项评分之和（范围 90–450）</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-800">总均分</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                      {summary.basic.avgTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">总分 ÷ 90</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-800">阳性项目数</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                      {summary.basic.positiveCount}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      评分 ≥ 2 的项目数（占比 {positiveRatio}%）
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-800">阴性项目数</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                      {summary.basic.negativeCount}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">评分 = 1 的项目数</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-slate-800">阳性症状均分</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-slate-900">
                      {summary.basic.positiveAvg.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-500">
                      (总分 − 阴性项目数) ÷ 阳性项目数
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              * 判断标准：总分 &lt; 160 正常；160–250 轻度困扰；250–350 中度困扰；≥ 350 重度困扰
            </p>
          </section>

          {/* Divider */}
          <div className="my-10 h-px bg-slate-100" />

          {/* Section 2: 因子分析 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                2
              </span>
              十因子分析
            </h2>
            <div className="mt-4 h-px bg-slate-200" />

            <p className="mt-5 text-sm leading-relaxed text-slate-700">
              SCL-90 量表从十个维度评估近期心理症状。下表为各因子得分及严重程度。因子均分 &lt; 2
              为正常，2–3 为轻度，3–4 为中度，≥ 4 为重度。
            </p>

            {/* 因子得分表 */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-[640px] w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      序号
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      因子维度
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      题数
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      因子均分
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      严重程度
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {factors.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 1 ? 'bg-slate-50/40' : ''}>
                      <td className="px-4 py-2.5 text-slate-400">{index + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">{item.name}</td>
                      <td className="px-4 py-2.5 text-slate-500">{item.count}</td>
                      <td
                        className={`px-4 py-2.5 text-right font-bold tabular-nums ${getLevelColor(item.level)}`}
                      >
                        {item.score.toFixed(2)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getLevelBg(item.level)}`}
                        >
                          {item.levelLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: 主要困扰维度 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                4
              </span>
              主要困扰维度
            </h2>
            <div className="mt-4 h-px bg-slate-200" />

            <p className="mt-5 text-sm leading-relaxed text-slate-700">
              以下三个维度得分最高，是近期最突出的心理困扰来源，建议优先关注与干预。
            </p>

            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/30 p-5">
              {top3Factors.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <div className="my-3 h-px bg-slate-200" />}
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{item.name}</span>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getLevelBg(item.level)}`}
                        >
                          {item.score.toFixed(2)} 分 · {item.levelLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        <span className="font-medium text-slate-700">主要表现：</span>
                        {item.description}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="my-10 h-px bg-slate-100" />

          {/* Section 5: 各维度详细解读 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                5
              </span>
              各维度详细解读
            </h2>
            <div className="mt-4 h-px bg-slate-200" />

            <div className="mt-4 divide-y divide-slate-100">
              {factors.map((item, index) => (
                <FactorDetailBlock key={item.id} factor={item} index={index} />
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="my-10 h-px bg-slate-100" />

          {/* Section 6: 综合建议 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                6
              </span>
              综合建议
            </h2>
            <div className="mt-4 h-px bg-slate-200" />

            <div className="mt-5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">建议干预等级：</span>
                {[
                  { key: 'normal', label: '自我调节', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                  { key: 'mild', label: '心理疏导', color: 'bg-blue-100 text-blue-800 border-blue-300' },
                  { key: 'moderate', label: '心理咨询', color: 'bg-amber-100 text-amber-800 border-amber-300' },
                  { key: 'severe', label: '专业评估', color: 'bg-red-100 text-red-800 border-red-300' },
                ].map((item) => (
                  <span
                    key={item.key}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      suggestionLevel === item.key
                        ? item.color
                        : 'border-slate-200 bg-slate-50 text-slate-300'
                    }`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-700">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800">生活方式调整：</span>
                    保持规律作息，保证充足睡眠；适度运动（每周 3–5 次，每次 30
                    分钟以上）；减少熬夜与过度信息摄入。
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800">情绪管理：</span>
                    学习放松技巧（如渐进式肌肉放松、腹式呼吸）；尝试正念冥想；适当倾诉与表达。
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800">社会支持：</span>
                    增加积极的人际互动，减少社交孤立；向信任的朋友或家人寻求支持。
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-500">
                    4
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800">专业帮助：</span>
                    {suggestionLevel === 'severe'
                      ? '当前评估结果提示存在较重心理困扰，强烈建议尽快前往医院心理科或精神科进行专业评估与干预。'
                      : suggestionLevel === 'moderate'
                        ? '当前评估结果提示存在中度心理困扰，建议寻求专业心理咨询师的帮助，进行系统的心理评估和疏导。'
                        : '如困扰持续或加重，建议及时咨询专业心理咨询师或心理科医生。'}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── Report Footer ── */}
        <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50/80 to-white px-4 py-6 sm:px-8 md:px-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            重要声明
          </div>
          <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-500">
            <p>
              1.
              本报告依据被试自评结果生成，仅作为心理健康筛查参考，不构成任何精神或心理疾病的临床诊断。
            </p>
            <p>
              2.
              测评结果受被试当时主观状态、理解能力及配合程度影响，可能与客观情况存在偏差。
            </p>
            <p>
              3. 本报告不能替代精神科医师、心理治疗师或心理咨询师的专业面诊评估。
            </p>
            <p>
              4.
              若出现自伤、自杀想法或严重情绪失控等紧急状况，请立即拨打心理援助热线或前往最近的医疗机构急诊。
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="text-[11px] text-slate-400">
              报告生成时间：{formatDate()} · SCL-90 心理健康筛查评估
            </div>
            <Link
              to="/scl90"
              className="text-xs font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-800"
            >
              返回测试
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
