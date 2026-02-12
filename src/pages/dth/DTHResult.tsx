import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { calculateDTHResult } from '../../utils/dth_scoring'
import { loadAnswers } from '../../utils/storage'
import { DTH_TEST_ID } from '../../data/dth'
import {
  DTH_DIMENSION_INSIGHTS,
  DTH_LEVEL_LABELS,
  DTH_OVERALL_CONCLUSIONS,
  DTH_PROFILE_HINTS,
  DTH_DIMENSION_BY_LEVEL,
  getDTHOverallLevel,
  getDTHDominantDimension,
} from '../../data/dth_insights'
import { Shield, CheckCircle2, AlertCircle, Info } from 'lucide-react'

export default function DTHResult() {
  const answers = useMemo(() => loadAnswers(DTH_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateDTHResult(answers), [answers])

  const totalQuestions = 70
  if (!answers || Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 70 题后查看结果。</p>
        <Link className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white transition hover:bg-xia-teal" to="/dth">
          返回黑暗三角人格测试
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const avgPercent = result.dimensionScores.length > 0
    ? Math.round(result.dimensionScores.reduce((s, d) => s + d.percent, 0) / result.dimensionScores.length)
    : 0
  const overallLevel = getDTHOverallLevel(avgPercent)
  const dominantId = getDTHDominantDimension(result.dimensionScores)
  const conclusion = DTH_OVERALL_CONCLUSIONS[overallLevel]
  const profileHint = DTH_PROFILE_HINTS[dominantId]

  const radarData = result.dimensionScores.map(d => ({ subject: d.name, A: d.percent, fullMark: 100 }))

  const barData = result.dimensionScores.map(d => ({
    name: d.name,
    score: d.percent,
    level: DTH_LEVEL_LABELS[d.level],
  }))

  return (
    <div className="mx-auto max-w-4xl animate-fade-in pb-10">
      <div className="rounded-3xl border border-xia-haze bg-white shadow-xl ring-1 ring-xia-haze/30">
        <div className="rounded-t-3xl border-b border-xia-haze overflow-hidden">
          <div className="relative px-6 py-10 sm:px-12 sm:py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-xia-deep/5 via-xia-cream/40 to-white" />
            <div className="relative mx-auto max-w-2xl">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-lg ring-2 ring-xia-teal/20 sm:h-24 sm:w-24">
                  <Shield className="h-10 w-10 text-xia-deep sm:h-12 sm:w-12" />
                </div>
                <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
                  <p className="text-xs font-medium uppercase tracking-widest text-xia-deep/50">DTH 黑暗三角人格</p>
                  <p className="text-2xl font-bold tracking-tight text-xia-deep sm:text-3xl">{conclusion.title}</p>
                  <p className="text-sm text-xia-deep/70">
                    三维均分 {avgPercent}% · 总分 {result.totalScore}/{result.maxTotalScore}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-12">
          {/* 综合结论：一目了然 */}
          <section className="mb-10">
            <div className="rounded-2xl border-2 border-xia-deep/20 bg-gradient-to-br from-xia-cream/60 to-white p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  overallLevel === 'low' ? 'bg-xia-mint/30 text-xia-teal' :
                  overallLevel === 'moderate' ? 'bg-xia-sky/30 text-xia-deep' :
                  'bg-xia-deep/15 text-xia-deep'
                }`}>
                  {overallLevel === 'low' ? <CheckCircle2 className="h-6 w-6" /> : overallLevel === 'moderate' ? <Info className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-xia-deep">{conclusion.title}</h2>
                  <p className="mt-2 text-base leading-relaxed text-xia-deep/90">{conclusion.summary}</p>
                  <p className="mt-2 text-sm font-medium text-xia-teal/90">{profileHint}</p>
                  <p className="mt-3 text-sm text-xia-deep/70">{conclusion.hint}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">三角雷达</h2>
            <div className="h-72 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgb(var(--xia-haze))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'rgb(var(--xia-deep))' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                  <Radar
                    name="特质强度"
                    dataKey="A"
                    stroke="rgb(var(--xia-deep))"
                    fill="rgb(var(--xia-deep))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">三维度得分</h2>
            <div className="h-48 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 16, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number, _: unknown, props: { payload?: { level?: string } }) => [`${v}% (${props.payload?.level ?? ''})`, '得分']} />
                  <Bar dataKey="score" fill="rgb(var(--xia-deep))" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">维度解读</h2>
            <div className="space-y-4">
              {result.dimensionScores.map(d => {
                const levelConclusion = DTH_DIMENSION_BY_LEVEL[d.id]?.[d.level] ?? ''
                return (
                  <div key={d.id} className="rounded-xl border border-xia-haze bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-xia-deep">{d.name}</h3>
                      <span className="text-sm font-bold text-xia-teal">
                        {d.percent}% · {DTH_LEVEL_LABELS[d.level]}
                      </span>
                    </div>
                    <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-xia-haze/50">
                      <div className="h-full rounded-full bg-xia-deep/60" style={{ width: `${d.percent}%` }} />
                    </div>
                    {levelConclusion && (
                      <p className="mb-2 rounded-lg bg-xia-cream/40 px-3 py-2 text-sm font-medium text-xia-deep/90">
                        ✓ {levelConclusion}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed text-xia-deep/80">{DTH_DIMENSION_INSIGHTS[d.id]}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <div className="rounded-xl border border-xia-haze/50 bg-xia-cream/20 p-5 text-sm text-xia-deep/80">
              <p className="font-semibold text-xia-deep">说明：</p>
              <p className="mt-2">
                黑暗三角为心理学研究概念，用于描述人格中与权谋、自恋、冷漠冲动相关的特质。本测验仅供自我觉察与教育参考，不用于临床诊断。若结果令你困扰，建议咨询专业心理咨询师。
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-6 py-6 sm:px-12 text-center text-xs text-xia-deep/50">
          <p>报告生成时间：{formatDate()} · DTH 黑暗三角人格测试</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/dth" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回测验</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
