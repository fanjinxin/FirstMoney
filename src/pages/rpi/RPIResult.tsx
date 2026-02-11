import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { reportDownloadRequiresPayment } from '../../config/feature'
import { rpiTest } from '../../data/rpi'
import { calculateRpiScores, RpiDimensionScore, RpiPerspectiveSummary } from '../../utils/scoring'
import { loadAnswers } from '../../utils/storage'

const PERSPECTIVE_LABELS: Record<string, string> = { self: '自我视角', partner: '伴侣视角' }

function getLevelBg(level: string) {
  switch (level) {
    case 'low':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'moderate':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'high':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'veryHigh':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

function getTotalLevelStyle(label: string) {
  if (label.includes('低')) return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (label.includes('适中')) return 'bg-blue-50 text-blue-800 border-blue-200'
  if (label.includes('偏高')) return 'bg-amber-50 text-amber-800 border-amber-200'
  if (label.includes('极高')) return 'bg-red-50 text-red-800 border-red-200'
  return 'bg-slate-50 text-slate-800 border-slate-200'
}

function formatDate() {
  const now = new Date()
  return `${now.getFullYear()} 年 ${String(now.getMonth() + 1).padStart(2, '0')} 月 ${String(now.getDate()).padStart(2, '0')} 日`
}

function DimensionRow({ d }: { d: RpiDimensionScore }) {
  const pct = Math.min((d.scoreSum / 25) * 100, 100)
  const barClass =
    d.level === 'low'
      ? 'from-emerald-400 to-emerald-500'
      : d.level === 'moderate'
        ? 'from-blue-400 to-blue-500'
        : d.level === 'high'
          ? 'from-amber-400 to-amber-500'
          : 'from-red-400 to-red-500'
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">{d.name}</span>
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${getLevelBg(d.level)}`}>
            {d.levelLabel}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{d.hint}</p>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-sm text-slate-400">均分 {d.scoreMean.toFixed(2)}</span>
        <span className="w-12 text-right text-lg font-bold tabular-nums text-slate-900">{d.scoreSum}</span>
      </div>
      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function PerspectiveBlock({ title, summary }: { title: string; summary: RpiPerspectiveSummary }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/50 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <div className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${getTotalLevelStyle(summary.levelLabel)}`}>
          {summary.total} 分 · {summary.levelLabel}
        </div>
      </div>
      <div className="mt-4 space-y-0">
        {summary.dimensionScores.map((d) => (
          <DimensionRow key={d.id} d={d} />
        ))}
      </div>
    </div>
  )
}

export default function RPIResult() {
  const answersSelf = loadAnswers(`${rpiTest.id}-self`)
  const answersPartner = loadAnswers(`${rpiTest.id}-partner`)
  const questionsSelf = rpiTest.questions.filter((q) => q.id.startsWith('self-'))
  const questionsPartner = rpiTest.questions.filter((q) => q.id.startsWith('partner-'))

  const summary = calculateRpiScores(
    questionsSelf,
    questionsPartner,
    rpiTest.dimensions,
    answersSelf ?? {},
    answersPartner ?? {},
  )

  const hasSelf = !!(summary.self && summary.self.answered >= 20)
  const hasPartner = !!(summary.partner && summary.partner.answered >= 20)
  const hasAny = hasSelf || hasPartner
  const selfAnswered = summary.self?.answered ?? 0
  const partnerAnswered = summary.partner?.answered ?? 0
  const selfTop = summary.self
    ? [...summary.self.dimensionScores].sort((a, b) => b.scoreSum - a.scoreSum)[0]
    : null
  const partnerTop = summary.partner
    ? [...summary.partner.dimensionScores].sort((a, b) => b.scoreSum - a.scoreSum)[0]
    : null
  const maxDiff = summary.comparison
    ? summary.comparison.dimensionDiffs.reduce((acc, d) =>
        Math.abs(d.diff) > Math.abs(acc.diff) ? d : acc,
      )
    : null

  if (!hasAny) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-slate-700">尚未完成任一视角测评</div>
        <p className="text-sm text-slate-500">请至少完成「自我视角」或「伴侣视角」全部 20 题后查看结果。</p>
        <Link className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800" to="/rpi">
          返回 RPI 测试
        </Link>
      </div>
    )
  }

  const [view, setView] = useState<'self' | 'partner' | 'both'>(() =>
    hasSelf && hasPartner ? 'both' : hasSelf ? 'self' : 'partner',
  )
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
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' })
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
      pdf.save(`RPI-报告-${dateStr}.pdf`)
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <div className="rpi-report-page mx-auto max-w-4xl animate-fade-in">
      {showPayModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:hidden"
          onClick={() => setShowPayModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rpi-pay-modal-title"
        >
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 id="rpi-pay-modal-title" className="text-lg font-bold text-slate-900">下载报告</h3>
            <p className="mt-3 text-sm text-slate-600">正式版中，下载完整报告需付费。付费后可下载 PDF 报告并长期保存。</p>
            <p className="mt-2 text-xs text-slate-400">功能即将上线，敬请期待。</p>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setShowPayModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={reportRef} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="relative overflow-hidden border-b-2 border-slate-800 bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 px-4 py-6 text-white sm:px-8 sm:py-8 md:px-12">
          <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-rose-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-8 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Romantic Possessiveness Index</div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">RPI 恋爱占有欲指数测试</h1>
              <div className="mt-1 text-sm text-slate-400">40 题双视角完整版 · 评估报告</div>
            </div>
            <div className="flex flex-shrink-0 flex-col items-start gap-3 sm:items-end">
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
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {reportDownloadRequiresPayment ? '下载报告（付费）' : '导出 PDF'}
                  </>
                )}
              </button>
              <div className="hidden rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 sm:block">仅供参考</div>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white px-4 py-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">报告日期</div>
              <div className="mt-1 font-medium text-slate-800">{formatDate()}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">题数</div>
              <div className="mt-1 font-medium text-slate-800">40 题（双视角各 20 题）</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">维度</div>
              <div className="mt-1 font-medium text-slate-800">控制 / 嫉妒 / 依赖 / 安全感</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">计分</div>
              <div className="mt-1 font-medium text-slate-800">每维度 5–25 分，总分 20–100</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-8 sm:py-8 md:px-12">
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">1</span>
              总体结论
            </h2>
            <div className="mt-4 h-px bg-slate-200" />
            <p className="mt-5 text-sm leading-relaxed text-slate-700">
              RPI 从四个维度评估恋爱占有欲：控制欲望、嫉妒强度、情感依赖、关系不安全感。每维度 5 题，维度分为 5 题之和（5–25 分），总分为四维度之和（20–100 分）。等级划分：1–25 低占有欲、26–50 适中、51–75 偏高、76–100 极高。
            </p>
            {!hasSelf || !hasPartner ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 px-5 py-4 text-sm text-amber-800">
                {hasSelf
                  ? `伴侣视角已作答 ${partnerAnswered}/20，完成后可生成对比报告。`
                  : `自我视角已作答 ${selfAnswered}/20，完成后可生成对比报告。`}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-4">
              {hasSelf && summary.self && (
                <div className={`rounded-2xl border px-5 py-4 shadow-sm ${getTotalLevelStyle(summary.self.levelLabel)}`}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">自我视角</div>
                  <div className="mt-1 text-xl font-bold">{summary.self.total} 分 · {summary.self.levelLabel}</div>
                </div>
              )}
              {hasPartner && summary.partner && (
                <div className={`rounded-2xl border px-5 py-4 shadow-sm ${getTotalLevelStyle(summary.partner.levelLabel)}`}>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">伴侣视角</div>
                  <div className="mt-1 text-xl font-bold">{summary.partner.total} 分 · {summary.partner.levelLabel}</div>
                </div>
              )}
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/60 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">自我视角突出维度</div>
                <div className="mt-2 text-base font-semibold text-slate-900">
                  {selfTop ? selfTop.name : '暂无数据'}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {selfTop ? `得分 ${selfTop.scoreSum} · ${selfTop.levelLabel}` : `完成度 ${selfAnswered}/20`}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/60 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">伴侣视角突出维度</div>
                <div className="mt-2 text-base font-semibold text-slate-900">
                  {partnerTop ? partnerTop.name : '暂无数据'}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {partnerTop ? `得分 ${partnerTop.scoreSum} · ${partnerTop.levelLabel}` : `完成度 ${partnerAnswered}/20`}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/60 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">视角差异最大</div>
                <div className="mt-2 text-base font-semibold text-slate-900">
                  {maxDiff ? maxDiff.name : '需完成双视角'}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {maxDiff ? `差异 ${maxDiff.diff > 0 ? `+${maxDiff.diff}` : maxDiff.diff}` : '完成双视角后计算'}
                </div>
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-slate-100" />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">2</span>
              维度得分
            </h2>
            <div className="mt-4 h-px bg-slate-200" />

            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              {hasSelf && hasPartner && (
                <>
                  <button
                    type="button"
                    onClick={() => setView('both')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === 'both' ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    双视角
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('self')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === 'self' ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    自我视角
                  </button>
                  <button
                    type="button"
                    onClick={() => setView('partner')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === 'partner' ? 'bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
                  >
                    伴侣视角
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              {view !== 'partner' && hasSelf && summary.self && (
                <PerspectiveBlock title={PERSPECTIVE_LABELS.self} summary={summary.self} />
              )}
              {view !== 'self' && hasPartner && summary.partner && (
                <PerspectiveBlock title={PERSPECTIVE_LABELS.partner} summary={summary.partner} />
              )}
            </div>
          </section>

          {summary.comparison && hasSelf && hasPartner && (
            <>
              <div className="my-10 h-px bg-slate-100" />
              <section>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">3</span>
                  双视角对比
                </h2>
                <div className="mt-4 h-px bg-slate-200" />
                <p className="mt-5 text-sm leading-relaxed text-slate-700">{summary.comparison.summary}</p>
                <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                  <table className="min-w-[520px] w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-2.5 text-left font-semibold text-slate-600">维度</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-slate-600">自我</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-slate-600">伴侣</th>
                        <th className="px-4 py-2.5 text-right font-semibold text-slate-600">差异</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summary.comparison.dimensionDiffs.map((row) => (
                        <tr key={row.id}>
                          <td className="px-4 py-2.5 font-medium text-slate-800">{row.name}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">{row.selfSum}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">{row.partnerSum}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">{row.diff > 0 ? `+${row.diff}` : row.diff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          <div className="my-10 h-px bg-slate-100" />
          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">4</span>
              沟通与关系建议
            </h2>
            <div className="mt-4 h-px bg-slate-200" />
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-700">
              <p>· 使用「我感到…」而非「你总是…」的表达方式，减少指责感。</p>
              <p>· 对安全感与边界需求给出可执行的具体约定（如回复频率、与异性相处的底线）。</p>
              <p>· 若双方在控制、嫉妒或依赖维度上差异较大，可共同讨论各自舒适区与底线。</p>
              <p>· 本结果仅作关系沟通与自我觉察参考，不替代伴侣咨询或个体心理咨询。</p>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50/80 to-white px-8 py-6 sm:px-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">声明</div>
          <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-500">
            <p>本报告依据自评/为伴侣评结果生成，仅供关系沟通与自我觉察参考，不构成任何临床诊断。数据在本地处理，不上传服务器。</p>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="text-[11px] text-slate-400">报告生成时间：{formatDate()} · RPI 恋爱占有欲指数</div>
            <Link to="/rpi" className="text-xs font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-slate-800">
              返回测试
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
