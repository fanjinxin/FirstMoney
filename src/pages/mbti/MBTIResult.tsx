import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { calculateMBTIResult, POLE_LABELS } from '../../utils/mbti_scoring'
import { loadAnswers, clearAnswers } from '../../utils/storage'
import type { MBTIDimensionScore } from '../../utils/mbti_scoring'
import { mbtiTypeInsights } from '../../data/mbti_insights'
import { Heart, Briefcase, Leaf, Puzzle } from 'lucide-react'

export default function MBTIResult() {
  const navigate = useNavigate()
  const reportRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  const answers = useMemo(() => loadAnswers('mbti') ?? {}, [])
  const result = useMemo(() => calculateMBTIResult(answers), [answers])
  const { type, typeInfo, dimensionScores, radarData } = result
  const insight = mbtiTypeInsights[type]

  const handleExport = async () => {
    if (!reportRef.current) return
    try {
      setExporting(true)
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FDFBF7',
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgProps = pdf.getImageProperties(imgData)
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width
      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
      heightLeft -= pdfHeight
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
        heightLeft -= pdfHeight
      }
      pdf.save(`MBTI_${type}_报告.pdf`)
    } catch (error) {
      console.error('Export failed', error)
    } finally {
      setExporting(false)
    }
  }

  const handleRetake = () => {
    if (window.confirm('确定要重新测试吗？')) {
      clearAnswers('mbti')
      navigate('/mbti')
    }
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <div className="min-h-screen pb-10">
      {/* Actions */}
      <div className="mb-6 flex items-center justify-between px-2 sm:px-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-xia-deep/60 transition hover:text-xia-deep"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 rounded-lg border border-xia-haze bg-white px-4 py-2 text-sm font-medium text-xia-deep/80 shadow-sm transition hover:border-xia-teal/50 hover:text-xia-deep"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            再测一次
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-lg bg-xia-deep px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-xia-deep/90 disabled:opacity-50"
          >
            {exporting ? '生成中...' : '导出报告'}
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-xia-haze/30">
        {/* Header - 人格类型卡片 */}
        <div className="bg-gradient-to-br from-xia-sky/20 via-xia-cream/30 to-white px-6 py-10 sm:px-12 sm:py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-lg sm:h-32 sm:w-32 sm:p-3">
            <MBTIAvatar type={type} typeInfo={typeInfo} />
          </div>
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-xia-deep/50">
            你的人格类型
          </div>
          <h1 className="mt-2 text-3xl font-bold text-xia-deep sm:text-5xl">
            {typeInfo.type} · {typeInfo.name}
          </h1>
          <p className="mx-auto mt-2 text-sm text-xia-deep/60">{typeInfo.nameEn}</p>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium italic text-xia-teal sm:text-lg">
            「{typeInfo.slogan}」
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-xia-deep/80 sm:text-lg">
            {typeInfo.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {typeInfo.strengths.map((trait) => (
              <span key={trait} className="rounded-full bg-xia-teal/10 px-4 py-1.5 text-sm font-medium text-xia-teal">
                #{trait}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 py-8 sm:px-12">
          {/* 四维度得分条 */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-xia-deep">四维度详细得分</h2>
            <div className="rounded-2xl border border-xia-haze/30 bg-white p-6 shadow-sm">
              <div className="space-y-8">
                {dimensionScores.map((ds) => (
                  <DimensionBar key={ds.dimension} ds={ds} />
                ))}
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-xia-haze/30" />

          {/* 雷达图 + 维度解析 */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-xia-deep">维度雷达图</h2>
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                      name="维度倾向"
                      dataKey="A"
                      stroke="#2C6F7A"
                      strokeWidth={2}
                      fill="#2C6F7A"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-xia-deep">各维度解读</h3>
                <div className="space-y-4">
                  {radarData.map((d, idx) => {
                    const ds = dimensionScores[idx]
                    const poleLabel = ds ? POLE_LABELS[ds.dominant] : ''
                    return (
                      <div key={d.subject}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-medium text-xia-deep/80">{d.subject}</span>
                          <span className="font-bold text-xia-deep">
                            {poleLabel} · {d.A.toFixed(1)}/10
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-xia-haze/20">
                          <div
                            className="h-full rounded-full bg-xia-teal"
                            style={{ width: `${(d.A / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-xia-haze/30" />

          {/* 人格深度分析 - 完整解读 */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-xia-deep">人格深度分析</h2>
            {insight?.depthAnalysis && (
              <div className="mb-6 rounded-2xl border border-xia-haze/30 bg-gradient-to-br from-xia-sky/5 to-xia-cream/30 p-6">
                <h3 className="mb-3 text-base font-semibold text-xia-deep">核心特质与内在驱动力</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-xia-deep/85">
                  {insight.depthAnalysis}
                </p>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-xia-sky/10 p-6">
                <h4 className="mb-4 font-semibold text-xia-deep">优势特质详解</h4>
                {insight?.strengthDetails?.length ? (
                  <div className="space-y-4">
                    {insight.strengthDetails.map(({ trait, detail }) => (
                      <div key={trait}>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full bg-xia-teal" />
                          <span className="font-medium text-xia-deep">{trait}</span>
                        </div>
                        <p className="pl-4 text-sm leading-relaxed text-xia-deep/80">{detail}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm leading-relaxed text-xia-deep/80">
                    {typeInfo.strengths.map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-xia-teal" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-xl bg-xia-cream/30 p-6">
                <h4 className="mb-4 font-semibold text-xia-deep">待发展领域与改进建议</h4>
                {insight?.weaknessDetails?.length ? (
                  <div className="space-y-4">
                    {insight.weaknessDetails.map(({ trait, suggestion }) => (
                      <div key={trait}>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full bg-xia-deep/40" />
                          <span className="font-medium text-xia-deep">{trait}</span>
                        </div>
                        <p className="pl-4 text-sm leading-relaxed text-xia-deep/80">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2 text-sm leading-relaxed text-xia-deep/80">
                    {typeInfo.weaknesses.map((w) => (
                      <li key={w} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-xia-deep/40" />
                        {w}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-xl bg-xia-aqua/10 p-6 sm:col-span-2">
                <h4 className="mb-3 font-semibold text-xia-deep">职业发展建议</h4>
                <div className="mb-4 flex flex-wrap gap-2">
                  {typeInfo.career.map((c) => (
                    <span key={c} className="rounded-full bg-xia-deep/5 px-3 py-1 text-sm font-medium text-xia-deep">
                      {c}
                    </span>
                  ))}
                </div>
                {insight?.growthTips?.length ? (
                  <div>
                    <h5 className="mb-2 text-sm font-medium text-xia-deep">可执行的成长建议</h5>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {insight.growthTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 rounded-lg bg-white/60 px-3 py-2 text-sm text-xia-deep/85">
                          <span className="mt-1 shrink-0 text-xia-teal">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-xia-haze/30" />

          {/* 多维应用洞察 - 详细分析 */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-xia-deep">多维应用洞察</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl border border-xia-haze/50 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-xia-teal" aria-hidden />
                  <h4 className="font-semibold text-xia-deep">亲密关系</h4>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-xia-deep/80">{typeInfo.relationships}</p>
                {insight?.relationshipsInsight ? (
                  <div className="rounded-lg bg-xia-cream/30 p-4">
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-xia-deep/60">深度洞察</h5>
                    <p className="text-sm leading-relaxed text-xia-deep/85">{insight.relationshipsInsight}</p>
                  </div>
                ) : null}
              </div>
              <div className="rounded-xl border border-xia-haze/50 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-xia-teal" aria-hidden />
                  <h4 className="font-semibold text-xia-deep">工作与职业</h4>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-xia-deep/80">{typeInfo.workStyle}</p>
                {insight?.workInsight ? (
                  <div className="rounded-lg bg-xia-cream/30 p-4">
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-xia-deep/60">环境与角色建议</h5>
                    <p className="text-sm leading-relaxed text-xia-deep/85">{insight.workInsight}</p>
                  </div>
                ) : null}
              </div>
              <div className="rounded-xl border border-xia-haze/50 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Leaf className="h-6 w-6 text-xia-teal" aria-hidden />
                  <h4 className="font-semibold text-xia-deep">压力应对与成长</h4>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-xia-deep/80">{typeInfo.stressCoping}</p>
                {insight?.stressInsight ? (
                  <div className="rounded-lg bg-xia-cream/30 p-4">
                    <h5 className="mb-2 text-xs font-semibold uppercase tracking-wider text-xia-deep/60">压力来源与恢复建议</h5>
                    <p className="text-sm leading-relaxed text-xia-deep/85">{insight.stressInsight}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-xia-haze/30" />

          {/* 四维度细致分析 */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-xia-deep">四维度细致解析</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {dimensionScores.map((ds) => (
                <DimensionAnalysisCard key={ds.dimension} ds={ds} />
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-xia-haze bg-xia-cream/20 px-6 py-6 sm:px-12 text-center text-xs text-xia-deep/50">
          <p>报告生成时间：{formatDate()} · MBTI 16型人格测试</p>
          <p className="mt-2">本测试基于荣格心理学理论，结果仅供自我了解与娱乐参考，不构成专业诊断。</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/mbti" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回测验</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function MBTIAvatar({ type, typeInfo }: { type: string; typeInfo: { name: string } }) {
  const [imgError, setImgError] = useState(false)
  if (imgError) {
    return (
      <span className="flex items-center justify-center text-xia-teal">
        <Puzzle className="h-16 w-16 sm:h-20 sm:w-20" aria-hidden />
      </span>
    )
  }
  return (
    <img
      src={`/mbti/${type.toLowerCase()}.svg`}
      alt={typeInfo.name}
      className="h-full w-full object-contain"
      onError={() => setImgError(true)}
    />
  )
}

function DimensionBar({ ds }: { ds: MBTIDimensionScore }) {
  const total = ds.scoreA + ds.scoreB
  const pctA = total > 0 ? (ds.scoreA / total) * 100 : 50
  const pctB = 100 - pctA
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-xia-deep">{ds.label}</span>
        <span className="text-xia-deep/70">
          {POLE_LABELS[ds.poleA]} {ds.scoreA} · {POLE_LABELS[ds.poleB]} {ds.scoreB}
        </span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-xia-haze/20">
        <div
          className="rounded-l-full bg-xia-teal transition-all"
          style={{ width: `${pctA}%` }}
        />
        <div
          className="rounded-r-full bg-xia-sky/60 transition-all"
          style={{ width: `${pctB}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-xia-deep/60">
        你更偏向 <strong className="text-xia-deep">{POLE_LABELS[ds.dominant]}</strong>，
        倾向度约 {ds.percentage}%
      </p>
    </div>
  )
}

const DIMENSION_DESCRIPTIONS: Record<string, { title: string; content: string }> = {
  EI: {
    title: '能量来源 · E/I',
    content: '外向(E)者从与人互动中获得能量，内向(I)者从独处与内省中充电。两者无优劣之分，关键在于了解自己的节奏。',
  },
  SN: {
    title: '信息获取 · S/N',
    content: '实感(S)者关注具体事实与细节，直觉(N)者关注整体模式与可能性。二者在学习和决策中各有优势。',
  },
  TF: {
    title: '决策方式 · T/F',
    content: '思考(T)者侧重逻辑与公平，情感(F)者侧重感受与和谐。理想的决策往往需要两者的平衡。',
  },
  JP: {
    title: '生活节奏 · J/P',
    content: '判断(J)者偏好计划与条理，知觉(P)者偏好灵活与开放。了解自己的节奏有助于提高效率与幸福感。',
  },
}

function DimensionAnalysisCard({ ds }: { ds: MBTIDimensionScore }) {
  const info = DIMENSION_DESCRIPTIONS[ds.dimension]
  const dominantLabel = POLE_LABELS[ds.dominant]
  return (
    <div className="rounded-xl border border-xia-haze/50 bg-white p-6 shadow-sm">
      <h4 className="mb-2 font-semibold text-xia-deep">{info?.title ?? ds.label}</h4>
      <p className="mb-4 text-sm leading-relaxed text-xia-deep/80">{info?.content}</p>
      <div className="rounded-lg bg-xia-cream/30 px-4 py-3 text-sm">
        <span className="font-medium text-xia-teal">你的倾向：</span>
        <span className="text-xia-deep/90"> {dominantLabel} · 倾向度约 {ds.percentage}%</span>
      </div>
    </div>
  )
}
