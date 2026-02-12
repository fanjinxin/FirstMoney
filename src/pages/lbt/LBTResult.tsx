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
import { calculateLBTResult } from '../../utils/lbt_scoring'
import { loadAnswers } from '../../utils/storage'
import { LBT_TEST_ID } from '../../data/lbt'
import {
  LBT_PROFILES,
  LBT_LEVEL_LABELS,
  LBT_DIMENSION_INSIGHTS,
  LBT_DIMENSION_BY_LEVEL,
  LBT_RELATIONSHIP_TIPS,
  getLBTProfileKey,
} from '../../data/lbt_insights'
import { Heart, ChevronRight, Check, Scan, HeartPulse, Scale } from 'lucide-react'
import type { LBTDimensionId } from '../../data/lbt'
import type { LucideIcon } from 'lucide-react'

const DIMENSION_ICONS: Record<LBTDimensionId, LucideIcon> = {
  depend: HeartPulse,
  prioritize: Heart,
  balance: Scale,
}

const SUBJECT_SHORT: Record<LBTDimensionId, string> = {
  depend: '情感依赖',
  prioritize: '优先倾斜',
  balance: '理性平衡',
}

export default function LBTResult() {
  const answers = useMemo(() => loadAnswers(LBT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateLBTResult(answers), [answers])

  const totalQuestions = 20
  if (Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 {totalQuestions} 题后查看结果。</p>
        <Link className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white" to="/lbt">
          返回恋爱脑测试
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const profileKey = getLBTProfileKey(result.level, result.dimensionScores)
  const profile = LBT_PROFILES[profileKey]
  const radarData = result.dimensionScores.map(d => ({
    subject: SUBJECT_SHORT[d.id],
    A: d.id === 'balance' ? d.percent : d.percent,
    fullMark: 100,
  }))
  const barData = result.dimensionScores.map(d => ({
    name: d.name,
    score: d.percent,
    level: LBT_LEVEL_LABELS[d.level],
  }))

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 pb-10 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-xia-haze bg-white shadow-lg sm:rounded-3xl sm:shadow-xl">
        {/* 头部：仿照其他测试 */}
        <div className="relative overflow-hidden border-b border-xia-haze bg-gradient-to-br from-pink-50/80 via-xia-cream/50 to-white px-4 py-8 sm:px-6 sm:py-10">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-pink-200/25 blur-2xl sm:h-64 sm:w-64 sm:blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-center gap-4 text-center sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-lg ring-2 ring-pink-200/60 sm:h-24 sm:w-24">
              <Heart className="h-10 w-10 fill-pink-400 text-pink-500 sm:h-12 sm:w-12" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-xia-deep/50 sm:text-xs">
                LBT 恋爱脑测试 · 投入与平衡
              </p>
              <h1 className="mt-1.5 text-xl font-bold text-xia-deep sm:mt-2 sm:text-2xl md:text-3xl">
                你是{profile.title}
              </h1>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-pink-500/15 px-3 py-1.5 ring-1 ring-pink-400/40">
                <span className="text-[10px] font-bold uppercase tracking-wide text-pink-700 sm:text-xs">整体</span>
                <span className="font-semibold text-pink-800">{LBT_LEVEL_LABELS[result.level]}</span>
                <span className="tabular-nums font-bold text-pink-700">{result.percent}%</span>
              </div>
            </div>
            {/* 三维得分：2 列小屏 3 列大屏 */}
            <div className="mt-2 w-full max-w-sm rounded-xl border border-xia-haze/60 bg-white/80 p-3 sm:mt-4 sm:max-w-md sm:p-4">
              <p className="mb-2 text-[10px] font-semibold text-xia-deep/60 sm:text-xs">三维得分</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {result.dimensionScores.map(d => {
                  const DimIcon = DIMENSION_ICONS[d.id]
                  const dependPriMax = Math.max(
                    ...result.dimensionScores.filter(x => x.id !== 'balance').map(x => x.percent)
                  )
                  const isHighest = d.id !== 'balance' && d.percent === dependPriMax
                  return (
                    <div
                      key={d.id}
                      className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs ${
                        isHighest ? 'ring-2 ring-pink-400/60 bg-pink-500/20 font-bold text-pink-900' : 'bg-xia-haze/30 text-xia-deep/70'
                      }`}
                    >
                      <DimIcon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 flex-1">{SUBJECT_SHORT[d.id]}</span>
                      <span className="shrink-0 tabular-nums font-medium">{d.percent}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6 sm:py-8">
          {/* 综合结论 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">
              <Heart className="h-4 w-4 fill-pink-400 text-pink-500" />
              {profile.title}解读
            </h2>
            <div className="rounded-xl border border-pink-200/60 bg-pink-50/30 p-4 shadow-sm sm:p-6">
              <p className="text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{profile.summary}</p>
              <p className="mt-2 text-sm font-medium text-pink-700/90">{profile.dominantNote}</p>
              <p className="mt-3 text-[10px] leading-relaxed text-xia-deep/60 sm:mt-4 sm:text-xs">
                本测验从情感依赖、优先倾斜、理性平衡三维度评估恋爱投入程度。总分 {result.totalScore}/{result.maxTotalScore}。结果仅供自我觉察，不构成专业评估。若困扰持续，建议寻求专业心理咨询。
              </p>
            </div>
          </section>

          {/* 三维雷达 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">
              <Scan className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
              三维雷达
            </h2>
            <div className="h-64 rounded-xl border border-xia-haze bg-white p-3 sm:h-72 sm:rounded-2xl sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgb(var(--xia-haze))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                  <Radar
                    name="得分"
                    dataKey="A"
                    stroke="rgb(219 39 119)"
                    fill="rgb(219 39 119)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 三维柱状图 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">三维得分</h2>
            <div className="h-40 rounded-xl border border-xia-haze bg-white p-3 sm:h-48 sm:rounded-2xl sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 4, right: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v: number, _: unknown, props: { payload?: { level?: string } }) => [`${v}% (${props.payload?.level ?? ''})`, '得分']}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20} fill="rgb(219 39 119)" fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 维度解读 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 text-base font-bold text-xia-deep sm:mb-6 sm:text-lg">维度解读</h2>
            <div className="space-y-4">
              {result.dimensionScores.map(d => {
                const levelConclusion = LBT_DIMENSION_BY_LEVEL[d.id]?.[d.level] ?? ''
                const DimIcon = DIMENSION_ICONS[d.id]
                return (
                  <div
                    key={d.id}
                    className="overflow-hidden rounded-xl border border-xia-haze bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-xia-deep">
                        <DimIcon className="h-5 w-5 text-pink-600" />
                        {d.name}
                      </h3>
                      <span className="text-sm font-bold text-xia-teal">
                        {d.percent}% · {LBT_LEVEL_LABELS[d.level]}
                      </span>
                    </div>
                    <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-xia-haze/50">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${d.percent}%`,
                          backgroundColor: d.id === 'balance' && d.level === 'high' ? 'rgb(var(--xia-teal))' : 'rgb(219 39 119)',
                        }}
                      />
                    </div>
                    {levelConclusion && (
                      <div className="mb-2 flex gap-2 rounded-lg bg-xia-cream/50 px-3 py-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-xia-teal" />
                        <p className="text-xs font-medium text-xia-deep/90 sm:text-sm">{levelConclusion}</p>
                      </div>
                    )}
                    <p className="text-xs leading-relaxed text-xia-deep/80 sm:text-sm">{LBT_DIMENSION_INSIGHTS[d.id]}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 建议 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <ChevronRight className="h-4 w-4 text-pink-600" />
              恋爱建议
            </h2>
            <ul className="space-y-2 rounded-xl border border-pink-100 bg-pink-50/30 p-4 sm:p-5">
              {LBT_RELATIONSHIP_TIPS[profileKey].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-xia-deep/90">
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-pink-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-4 py-5 text-center text-[11px] text-xia-deep/50 sm:px-6 sm:py-6 sm:text-xs">
          <p>报告生成时间：{formatDate()}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-4">
            <Link to="/lbt" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回恋爱脑测试</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
