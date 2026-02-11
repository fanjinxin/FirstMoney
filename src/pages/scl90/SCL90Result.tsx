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
      return 'text-xia-sky'
    case 'mild':
      return 'text-xia-aqua'
    case 'moderate':
      return 'text-xia-teal'
    case 'severe':
      return 'text-xia-deep'
    default:
      return 'text-xia-teal'
  }
}

function getLevelBg(level: string) {
  switch (level) {
    case 'normal':
      return 'bg-xia-cream text-xia-deep border-xia-haze'
    case 'mild':
      return 'bg-xia-haze text-xia-deep border-xia-aqua'
    case 'moderate':
      return 'bg-xia-aqua/20 text-xia-deep border-xia-aqua'
    case 'severe':
      return 'bg-xia-sky/20 text-xia-deep border-xia-sky'
    default:
      return 'bg-xia-cream text-xia-deep border-xia-haze'
  }
}

function getTotalLevelStyle(level: string) {
  switch (level) {
    case '正常':
      return 'bg-xia-cream text-xia-deep border-xia-haze'
    case '轻度困扰':
      return 'bg-xia-haze text-xia-deep border-xia-aqua'
    case '中度困扰':
      return 'bg-xia-aqua/20 text-xia-deep border-xia-aqua'
    case '重度困扰':
      return 'bg-xia-sky/20 text-xia-deep border-xia-sky'
    default:
      return 'bg-xia-cream text-xia-deep border-xia-haze'
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
            <span className="text-sm font-semibold text-xia-deep">
              {index + 1}. {factor.name}
            </span>
            <span
              className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${getLevelBg(factor.level)}`}
            >
              {factor.levelLabel}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-xia-teal/80">{factor.detail}</p>
        </div>
        <div className="flex flex-col items-end pt-0.5">
          <span className={`text-lg font-bold tabular-nums ${getLevelColor(factor.level)}`}>
            {factor.score.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-xia-haze/50">
        <div
          className={`h-full rounded-full transition-all ${
            factor.level === 'normal'
              ? 'bg-xia-sky'
              : factor.level === 'mild'
                ? 'bg-xia-aqua'
                : factor.level === 'moderate'
                  ? 'bg-xia-teal'
                  : 'bg-xia-deep'
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
        <div className="text-lg font-medium text-xia-deep">尚未完成测评</div>
        <p className="text-sm text-xia-teal">请完成全部题目后查看结果。</p>
        <Link
          className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white transition hover:bg-xia-teal"
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
            className="w-full max-w-sm rounded-xl border border-xia-haze bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="pay-modal-title" className="text-lg font-bold text-xia-deep">
              下载报告
            </h3>
            <p className="mt-3 text-sm text-xia-teal">
              正式版中，下载完整报告需付费。付费后可下载 PDF 报告并长期保存。
            </p>
            <p className="mt-2 text-xs text-xia-teal/60">
              功能即将上线，敬请期待。
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="rounded-lg border border-xia-haze bg-white px-4 py-2 text-sm font-medium text-xia-teal transition hover:bg-xia-cream"
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
        className="relative overflow-hidden rounded-2xl border border-xia-haze bg-white shadow-xl"
      >
        {/* ── Report Header ── */}
        <div className="relative overflow-hidden border-b-2 border-xia-deep bg-xia-deep px-4 py-6 text-white sm:px-8 sm:py-8 md:px-12">
          <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-xia-sky/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-8 h-32 w-32 rounded-full bg-xia-mint/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-xia-haze/80">
                Psychological Assessment Report
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                90项症状自评量表（SCL-90）
              </h1>
              <div className="mt-1 text-sm text-xia-haze/80">心理健康筛查评估报告</div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-start gap-3 text-left sm:items-end sm:text-right">
              <button
                type="button"
                onClick={handleDownloadReport}
                disabled={exportingPdf}
                className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
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
              <div className="hidden rounded-md border border-white/20 px-3 py-1.5 text-xs font-medium text-xia-haze sm:block">
                仅供参考
              </div>
            </div>
          </div>
        </div>

        {/* ── Report Meta ── */}
        <div className="border-b border-xia-haze bg-xia-cream/30 px-4 py-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-xia-teal/70">
                报告日期
              </div>
              <div className="mt-1 font-medium text-xia-deep">{formatDate()}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-xia-teal/70">
                评估时段
              </div>
              <div className="mt-1 font-medium text-xia-deep">最近一周</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-xia-teal/70">
                量表题数
              </div>
              <div className="mt-1 font-medium text-xia-deep">90 题</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-xia-teal/70">
                计分范围
              </div>
              <div className="mt-1 font-medium text-xia-deep">1（无）~ 5（严重）</div>
            </div>
          </div>
        </div>

        {/* ── Report Body ── */}
        <div className="px-4 py-6 sm:px-8 sm:py-8 md:px-12">
          <div className="mb-10">
            <div className="relative overflow-hidden rounded-[32px] border border-xia-haze/30 bg-gradient-to-br from-xia-sky/20 via-white/60 to-xia-cream/30 shadow-[0_20px_40px_-12px_rgba(104,212,219,0.15)] backdrop-blur-sm">
              {/* Decorative Blobs */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-xia-sky/20 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-xia-cream/30 to-transparent blur-3xl" />

              <div className="relative grid gap-8 p-8 md:grid-cols-12 md:items-center md:gap-12 md:p-10">
                {/* Left Column: Main Content (7 cols) */}
                <div className="md:col-span-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-xia-teal shadow-[0_0_10px_rgba(44,111,122,0.4)]"></span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-xia-deep/60">心理健康画像</span>
                  </div>
                  
                  <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-xia-deep sm:text-5xl lg:text-6xl">
                    {summary.basic.totalLevel}
                  </h2>
                  
                  <div className="mt-6">
                    <p className="text-base leading-relaxed text-xia-deep/80 sm:text-lg">
                      {summary.basic.totalLevel === '正常'
                        ? '您的心理健康状况良好，各项指标均在正常范围内。'
                        : `测试结果显示您当前处于「${summary.basic.totalLevel}」状态。`}
                      <span className="opacity-70">
                        {summary.basic.totalLevel === '正常'
                          ? '建议继续保持当前的生活方式，维持良好的心理状态，定期进行自我觉察。'
                          : `其中，${top3Factors.map(f => f.name).join('、')}等维度的困扰较为明显。建议结合下方详细解读，关注自身情绪变化，必要时寻求专业帮助。`}
                      </span>
                    </p>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-xia-haze/50 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md transition hover:bg-white/80">
                      <span className="text-xs font-bold text-xia-deep/50">核心结论</span>
                      <span className="text-sm font-bold text-xia-deep">{summary.basic.totalLevel}</span>
                    </div>
                    {top3Factors.length > 0 && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-xia-haze/50 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md transition hover:bg-white/80">
                        <span className="text-xs font-bold text-xia-deep/50">突出维度</span>
                        <div className="flex gap-1.5">
                          {top3Factors.map((f, i) => (
                             <span key={i} className="text-sm font-bold text-xia-deep">
                               {f.name} <span className="text-xs font-medium text-xia-teal">{f.score.toFixed(1)}</span>
                             </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Visual & Stats (5 cols) */}
                <div className="md:col-span-5">
                   <div className="relative rounded-[24px] border border-white/50 bg-white/40 p-6 shadow-sm backdrop-blur-md transition hover:bg-white/50">
                      <div className="flex items-start justify-between">
                         <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-xia-deep/50">测试总分</div>
                            <div className="mt-1 flex items-baseline gap-1.5">
                               <span className="text-5xl font-bold text-xia-deep">{summary.basic.totalScore}</span>
                               <span className="text-sm font-medium text-xia-deep/40">/ 450</span>
                            </div>
                         </div>
                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                            <img src="https://twemoji.maxcdn.com/v/latest/72x72/1f4ca.png" alt="Stats" className="h-6 w-6 opacity-80" />
                         </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-4">
                         <div className="rounded-xl bg-white/60 p-3">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-xia-deep/40">总均分</div>
                            <div className="mt-1 text-xl font-bold text-xia-deep">{summary.basic.avgTotal.toFixed(2)}</div>
                         </div>
                         <div className="rounded-xl bg-white/60 p-3">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-xia-deep/40">阳性项目</div>
                            <div className="mt-1 flex items-baseline gap-1">
                               <span className="text-xl font-bold text-xia-deep">{summary.basic.positiveCount}</span>
                               <span className="text-xs font-medium text-xia-deep/40">项</span>
                            </div>
                         </div>
                      </div>

                      {topFactor && (
                        <div className="mt-4 rounded-xl bg-xia-deep/5 p-3">
                            <div className="flex items-center justify-between">
                               <span className="text-xs font-medium text-xia-deep/60">最高维度：{topFactor.name}</span>
                               <span className="text-xs font-bold text-xia-deep">{topFactor.score.toFixed(2)}</span>
                            </div>
                            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-xia-deep/5">
                               <div className="h-full rounded-full bg-xia-deep transition-all duration-1000" style={{ width: `${Math.min((topFactor.score / 5) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-10 h-px bg-xia-haze/30" />
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-xia-deep">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-xia-deep text-xs font-bold text-white">
                1
              </span>
              可视化分析
            </h2>
            <div className="mt-4 h-px bg-xia-haze/50" />
            <p className="mt-5 text-sm leading-relaxed text-xia-deep/80">
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
          <div className="my-10 h-px bg-xia-haze/30" />
          {/* Section 1: 总体评价 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-xia-deep">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-xia-deep text-xs font-bold text-white">
                3
              </span>
              总体评价
            </h2>
            <div className="mt-4 h-px bg-xia-haze/50" />

            <div className="mt-5">
              <p className="text-sm leading-relaxed text-xia-deep/80">
                本次评估总分为{' '}
                <span className="font-bold text-xia-deep">{summary.basic.totalScore} 分</span>
                ，总均分{' '}
                <span className="font-bold text-xia-deep">
                  {summary.basic.avgTotal.toFixed(2)}
                </span>
                。在 90 个项目中，有{' '}
                <span className="font-bold text-xia-deep">
                  {summary.basic.positiveCount} 项（{positiveRatio}%）
                </span>{' '}
                达到阳性标准（评分 ≥ 2），阳性症状均分{' '}
                <span className="font-bold text-xia-deep">
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
            <div className="mt-6 overflow-x-auto rounded-xl border border-xia-haze bg-white shadow-sm">
              <table className="min-w-[520px] w-full text-sm">
                <thead>
                  <tr className="bg-xia-cream">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-xia-teal/80">
                      指标
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-xia-teal/80">
                      数值
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-xia-teal/80">
                      说明
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-xia-haze/30">
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-xia-deep/90">总分</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-xia-deep">
                      {summary.basic.totalScore}
                    </td>
                    <td className="px-4 py-2.5 text-xia-teal/80">90项评分之和（范围 90–450）</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-xia-deep/90">总均分</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-xia-deep">
                      {summary.basic.avgTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-xia-teal/80">总分 ÷ 90</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-xia-deep/90">阳性项目数</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-xia-deep">
                      {summary.basic.positiveCount}
                    </td>
                    <td className="px-4 py-2.5 text-xia-teal/80">
                      评分 ≥ 2 的项目数（占比 {positiveRatio}%）
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-xia-deep/90">阴性项目数</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-xia-deep">
                      {summary.basic.negativeCount}
                    </td>
                    <td className="px-4 py-2.5 text-xia-teal/80">评分 = 1 的项目数</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium text-xia-deep/90">阳性症状均分</td>
                    <td className="px-4 py-2.5 text-right font-bold tabular-nums text-xia-deep">
                      {summary.basic.positiveAvg.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-xia-teal/80">
                      (总分 − 阴性项目数) ÷ 阳性项目数
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-xia-deep/50">
              * 判断标准：总分 &lt; 160 正常；160–250 轻度困扰；250–350 中度困扰；≥ 350 重度困扰
            </p>
          </section>

          {/* Divider */}
          <div className="my-10 h-px bg-xia-haze/30" />

          {/* Section 2: 因子分析 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-xia-deep">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-xia-deep text-xs font-bold text-white">
                2
              </span>
              十因子分析
            </h2>
            <div className="mt-4 h-px bg-xia-haze/50" />

            <p className="mt-5 text-sm leading-relaxed text-xia-deep/80">
              SCL-90 量表从十个维度评估近期心理症状。下表为各因子得分及严重程度。因子均分 &lt; 2
              为正常，2–3 为轻度，3–4 为中度，≥ 4 为重度。
            </p>

            {/* 因子得分表 */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-xia-haze bg-white shadow-sm">
              <table className="min-w-[640px] w-full text-sm">
                <thead>
                  <tr className="bg-xia-cream">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-xia-teal/80">
                      序号
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-xia-teal/80">
                      因子维度
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-xia-teal/80">
                      题数
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-xia-teal/80">
                      因子均分
                    </th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-xia-teal/80">
                      严重程度
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-xia-haze/30">
                  {factors.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 1 ? 'bg-xia-cream/30' : ''}>
                      <td className="px-4 py-2.5 text-xia-deep/50">{index + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-xia-deep/90">{item.name}</td>
                      <td className="px-4 py-2.5 text-xia-teal/80">{item.count}</td>
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
            <h2 className="flex items-center gap-2 text-lg font-bold text-xia-deep">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-xia-deep text-xs font-bold text-white">
                4
              </span>
              主要困扰维度
            </h2>
            <div className="mt-4 h-px bg-xia-haze/50" />

            <p className="mt-5 text-sm leading-relaxed text-xia-deep/80">
              以下三个维度得分最高，是近期最突出的心理困扰来源，建议优先关注与干预。
            </p>

            <div className="mt-4 rounded-lg border border-xia-haze bg-xia-cream/30 p-5">
              {top3Factors.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <div className="my-3 h-px bg-xia-haze/30" />}
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-xia-deep text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-xia-deep">{item.name}</span>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getLevelBg(item.level)}`}
                        >
                          {item.score.toFixed(2)} 分 · {item.levelLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-xia-deep/70">
                        <span className="font-medium text-xia-deep/80">主要表现：</span>
                        {item.description}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-xia-teal/80">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="my-10 h-px bg-xia-haze/30" />

          {/* Section 5: 各维度详细解读 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-xia-deep">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-xia-deep text-xs font-bold text-white">
                5
              </span>
              各维度详细解读
            </h2>
            <div className="mt-4 h-px bg-xia-haze/50" />

            <div className="mt-4 divide-y divide-xia-haze/30">
              {factors.map((item, index) => (
                <FactorDetailBlock key={item.id} factor={item} index={index} />
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="my-10 h-px bg-xia-haze/30" />

          {/* Section 6: 综合建议 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-xia-deep">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-xia-deep text-xs font-bold text-white">
                6
              </span>
              综合建议
            </h2>
            <div className="mt-4 h-px bg-xia-haze/50" />

            <div className="mt-5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-xia-deep/80">建议干预等级：</span>
                {[
                  { key: 'normal', label: '自我调节', color: 'bg-xia-cream text-xia-deep border-xia-haze' },
                  { key: 'mild', label: '心理疏导', color: 'bg-xia-haze text-xia-deep border-xia-aqua' },
                  { key: 'moderate', label: '心理咨询', color: 'bg-xia-aqua/20 text-xia-deep border-xia-aqua' },
                  { key: 'severe', label: '专业评估', color: 'bg-xia-sky/20 text-xia-deep border-xia-sky' },
                ].map((item) => (
                  <span
                    key={item.key}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      suggestionLevel === item.key
                        ? item.color
                        : 'border-xia-haze bg-xia-cream text-xia-haze/60'
                    }`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-xia-deep/80">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-xia-haze/30 text-[10px] font-bold text-xia-teal/80">
                    1
                  </span>
                  <div>
                    <span className="font-semibold text-xia-deep">生活方式调整：</span>
                    保持规律作息，保证充足睡眠；适度运动（每周 3–5 次，每次 30
                    分钟以上）；减少熬夜与过度信息摄入。
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-xia-haze/30 text-[10px] font-bold text-xia-teal/80">
                    2
                  </span>
                  <div>
                    <span className="font-semibold text-xia-deep">情绪管理：</span>
                    学习放松技巧（如渐进式肌肉放松、腹式呼吸）；尝试正念冥想；适当倾诉与表达。
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-xia-haze/30 text-[10px] font-bold text-xia-teal/80">
                    3
                  </span>
                  <div>
                    <span className="font-semibold text-xia-deep">社会支持：</span>
                    增加积极的人际互动，减少社交孤立；向信任的朋友或家人寻求支持。
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-xia-haze/30 text-[10px] font-bold text-xia-teal/80">
                    4
                  </span>
                  <div>
                    <span className="font-semibold text-xia-deep">专业帮助：</span>
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
        <div className="border-t border-xia-haze bg-xia-cream/20 px-4 py-6 sm:px-8 md:px-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-xia-deep/50">
            重要声明
          </div>
          <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-xia-teal/80">
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
          <div className="mt-5 flex items-center justify-between border-t border-xia-haze pt-4">
            <div className="text-[11px] text-xia-deep/50">
              报告生成时间：{formatDate()} · SCL-90 心理健康筛查评估
            </div>
            <Link
              to="/scl90"
              className="text-xs font-medium text-xia-teal/80 underline decoration-xia-haze/50 underline-offset-2 transition hover:text-xia-deep"
            >
              返回测试
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
