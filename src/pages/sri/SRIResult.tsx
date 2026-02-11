import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { reportDownloadRequiresPayment } from '../../config/feature'
import { sriReverseScoreIds, sriTest } from '../../data/sri'
import { calculateSriScores, SriDimensionScore } from '../../utils/scoring'
import { loadAnswers } from '../../utils/storage'

function getLevelBg(level: string) {
  switch (level) {
    case 'veryLow':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'low':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'mid':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case 'high':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'veryHigh':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

function getTotalLevelStyle(label: string) {
  if (label.includes('很低')) return 'bg-emerald-50 text-emerald-800 border-emerald-200'
  if (label.includes('偏低')) return 'bg-blue-50 text-blue-800 border-blue-200'
  if (label.includes('中等')) return 'bg-slate-100 text-slate-800 border-slate-200'
  if (label.includes('偏高')) return 'bg-amber-50 text-amber-800 border-amber-200'
  if (label.includes('很高')) return 'bg-red-50 text-red-800 border-red-200'
  return 'bg-slate-50 text-slate-800 border-slate-200'
}

function formatDate() {
  const now = new Date()
  return `${now.getFullYear()} 年 ${String(now.getMonth() + 1).padStart(2, '0')} 月 ${String(now.getDate()).padStart(2, '0')} 日`
}

function DimensionRow({ d }: { d: SriDimensionScore }) {
  const pct = Math.min((d.score / 5) * 100, 100)
  const barClass =
    d.level === 'veryLow'
      ? 'from-emerald-400 to-emerald-500'
      : d.level === 'low'
        ? 'from-blue-400 to-blue-500'
        : d.level === 'mid'
          ? 'from-slate-400 to-slate-500'
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
        <span className="text-sm text-slate-400">均分 {d.score.toFixed(2)}</span>
        <span className="w-10 text-right text-sm font-bold tabular-nums text-slate-900">
          {Math.round(((d.score - 1) / 4) * 100)}
        </span>
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

const levelColors: Record<string, string> = {
  veryLow: '#34D399',
  low: '#60A5FA',
  mid: '#64748B',
  high: '#FBBF24',
  veryHigh: '#F87171',
}

export default function SRIResult() {
  const answers = loadAnswers(sriTest.id)
  const [showPayModal, setShowPayModal] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  if (!answers || Object.keys(answers).length < sriTest.questions.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-slate-700">尚未完成测评</div>
        <p className="text-sm text-slate-500">请完成全部题目后查看结果。</p>
        <Link className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800" to="/sri">
          返回 SRI 测试
        </Link>
      </div>
    )
  }

  const summary = calculateSriScores(
    sriTest.questions,
    sriTest.dimensions,
    answers,
    sriReverseScoreIds,
  )
  const answeredCount = Object.keys(answers).length
  const topDimension = summary.top3Dimensions[0]

  const chartData = summary.dimensionScores.map((d) => ({
    name: d.name,
    score: Number(d.score.toFixed(2)),
    index: Math.round(((d.score - 1) / 4) * 100),
    level: d.level,
  }))

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
      pdf.save(`SRI-报告-${dateStr}.pdf`)
    } finally {
      setExportingPdf(false)
    }
  }

  const conflictDim = summary.dimensionScores.find((d) => d.id === 'conflict')
  const expressionDim = summary.dimensionScores.find((d) => d.id === 'expression')
  const anxietyDim = summary.dimensionScores.find((d) => d.id === 'anxiety')
  const inhibitionDim = summary.dimensionScores.find((d) => d.id === 'inhibition')
  const conflictHigh = conflictDim?.level === 'high' || conflictDim?.level === 'veryHigh'
  const expressionHigh = (expressionDim?.score ?? 0) >= 3
  const anxietyInhibitionHigh = (anxietyDim?.score ?? 0) >= 3 || (inhibitionDim?.score ?? 0) >= 3

  return (
    <div className="sri-report-page mx-auto max-w-4xl animate-fade-in">
      {showPayModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:hidden"
          onClick={() => setShowPayModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sri-pay-modal-title"
        >
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 id="sri-pay-modal-title" className="text-lg font-bold text-slate-900">下载报告</h3>
            <p className="mt-3 text-sm text-slate-600">正式版中，下载完整报告需付费。付费后可下载 PDF 报告并长期保存。</p>
            <p className="mt-2 text-xs text-slate-400">功能即将上线，敬请期待。</p>
            <div className="mt-6 flex justify-end">
              <button type="button" onClick={() => setShowPayModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">关闭</button>
            </div>
          </div>
        </div>
      )}

      <div ref={reportRef} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="relative overflow-hidden border-b-2 border-slate-800 bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 px-4 py-6 text-white sm:px-8 sm:py-8 md:px-12">
          <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 top-8 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Sexual Repression Index</div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">SRI 性压抑指数测试</h1>
              <div className="mt-1 text-sm text-slate-400">四维度评估报告 · 欲望表达 · 观念冲突 · 情绪紧张 · 行为抑制</div>
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
              <div className="mt-1 font-medium text-slate-800">48 题</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">维度</div>
              <div className="mt-1 font-medium text-slate-800">欲望表达 / 观念冲突 / 情绪紧张 / 行为抑制</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">指数范围</div>
              <div className="mt-1 font-medium text-slate-800">0–100（越高越压抑）</div>
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
              SRI 从四个维度评估性压抑程度：欲望表达（能否自然表达需求与界限）、观念冲突（内心“应该”与“想要”的冲突）、情绪紧张（羞耻与焦虑）、行为抑制（回避与压抑行为）。指数 0–100，越高表示压抑程度越高。等级：0–20 很低、20–40 偏低、40–60 中等、60–80 偏高、80–100 很高。
            </p>
            <div className={`mt-6 rounded-2xl border px-5 py-4 shadow-sm ${getTotalLevelStyle(summary.levelLabel)}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">性压抑指数</div>
                  <div className="mt-1 text-2xl font-bold">{summary.totalIndex} 分 · {summary.levelLabel}</div>
                </div>
                <div className="h-12 w-32 overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 transition-all"
                    style={{ width: `${summary.totalIndex}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">总体指数</div>
                <div className="mt-2 text-xl font-bold text-slate-900">{summary.totalIndex}</div>
                <div className="mt-1 text-sm text-slate-500">0–100（越高越压抑）</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">等级</div>
                <div className="mt-2 text-xl font-bold text-slate-900">{summary.levelLabel}</div>
                <div className="mt-1 text-sm text-slate-500">五等级评估</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">最高维度</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{topDimension?.name ?? '暂无'}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {topDimension ? `均分 ${topDimension.score.toFixed(2)} · ${topDimension.levelLabel}` : '等待完成'}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">完成度</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{answeredCount}/48</div>
                <div className="mt-1 text-sm text-slate-500">全部题目已完成</div>
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-slate-100" />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">2</span>
              四维度得分
            </h2>
            <div className="mt-4 h-px bg-slate-200" />
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {summary.dimensionScores.map((d) => (
                <DimensionRow key={d.id} d={d} />
              ))}
            </div>
            <div className="mt-6 w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-900">
                四维度均分（1–5，越高越压抑）
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                  柱状图
                </span>
              </div>
              <div className="h-[200px] w-full sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barSize={28}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[1, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#E2E8F0' }} labelStyle={{ fontWeight: 600 }} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={levelColors[entry.level] ?? '#64748B'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-slate-100" />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">3</span>
              多角度解读
            </h2>
            <div className="mt-4 h-px bg-slate-200" />
            <p className="mt-5 text-sm leading-relaxed text-slate-700">
              以下从维度组合与突出维度两个角度对结果进行解读，便于自我觉察与沟通参考。
            </p>

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800">突出维度（得分最高的 3 个）</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                  {summary.top3Dimensions.map((d, i) => (
                    <li key={d.id}>
                      <span className="font-medium text-slate-800">{i + 1}. {d.name}（{d.levelLabel}）</span> {d.hint}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800">观念与表达</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {conflictHigh && expressionHigh
                    ? '您在「观念冲突」与「欲望表达」上均存在一定压力：内心对欲望的评判与对表达的顾虑可能相互强化。建议从接纳“有欲望是正常的”开始，在安全关系中尝试小步表达，减少自我批判。'
                    : conflictHigh
                      ? '「观念冲突」较突出，可能伴随自责或“不该想”的念头。可尝试将道德、价值观与身体感受分开看待，在安全前提下探讨自己的真实态度。'
                      : expressionHigh
                        ? '「欲望表达」方面存在保留或回避。可逐步在可信赖的关系中练习用“我需要/我不需要”表达界限，减少因怕被评判而沉默。'
                        : '观念与表达维度相对均衡，可继续维护在安全情境下的开放沟通。'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800">情绪与行为</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {anxietyInhibitionHigh
                    ? '「情绪紧张」和/或「行为抑制」较明显：在亲密话题或情境下容易焦虑、羞耻或回避。建议从情绪觉察开始（如区分“紧张”与“不愿意”），在安全、自愿的前提下小步增加表达或接触，必要时可借助伴侣沟通或专业支持。'
                    : '情绪与行为维度显示紧张与抑制程度在可接受范围内，可继续关注舒适区与边界的一致性。'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-amber-50/60 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800">综合视角</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {summary.totalIndex >= 60
                    ? '整体性压抑指数偏高，建议优先在安全关系中增加自我接纳与表达练习，必要时考虑伴侣沟通或心理咨询以系统探讨观念、情绪与行为。'
                    : summary.totalIndex >= 40
                      ? '整体处于中等水平，部分维度可能仍有提升空间。可针对得分较高的维度做针对性觉察与沟通。'
                      : '整体压抑程度较低，在自愿与安全的前提下，表达与行为较一致。可继续维护边界清晰与沟通开放。'}
                </p>
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-slate-100" />

          <section>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">4</span>
              建议方向
            </h2>
            <div className="mt-4 h-px bg-slate-200" />
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-700">
              <p>· 用“我需要/我不需要”表达感受，减少自我批评与“应该”的绑架。</p>
              <p>· 与可信赖的伴侣或对象建立安全的对话节奏，逐步明确边界与舒适区。</p>
              <p>· 区分“紧张”与“不愿意”，在自愿前提下小步增加表达或身体接触。</p>
              <p>· 本结果仅作自我了解与沟通参考，不构成任何临床诊断；如有持续困扰可寻求伴侣/性心理咨询。</p>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50/80 to-white px-4 py-6 sm:px-8 md:px-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">声明</div>
          <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-500">
            <p>本报告依据自评结果生成，仅供自我探索与沟通参考，不构成任何临床诊断。数据在本地处理，不上传服务器。</p>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
            <div className="text-[11px] text-slate-400">报告生成时间：{formatDate()} · SRI 性压抑指数</div>
            <Link to="/sri" className="text-xs font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 hover:text-slate-800">返回测试</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
