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
import { calculateCityResult } from '../../utils/city_scoring'
import { loadAnswers } from '../../utils/storage'
import { CITY_TEST_ID } from '../../data/city'
import {
  CITY_PROFILES,
  CITY_LEVEL_LABELS,
  CITY_DIMENSION_INSIGHTS,
  CITY_DIMENSION_BY_LEVEL,
  CITY_METHODOLOGY,
} from '../../data/city_insights'
import { ChevronRight, Scan, MapPin, Cloud, Clock, BookOpen, Wallet, Users, Info } from 'lucide-react'
import type { CityDimensionId } from '../../data/city'
import type { LucideIcon } from 'lucide-react'

const DIMENSION_ICONS: Record<CityDimensionId, LucideIcon> = {
  climate: Cloud,
  pace: Clock,
  culture: BookOpen,
  cost: Wallet,
  social: Users,
}

const SUBJECT_SHORT: Record<CityDimensionId, string> = {
  climate: '气候',
  pace: '节奏',
  culture: '文化',
  cost: '成本',
  social: '社交',
}

export default function CityResult() {
  const answers = useMemo(() => loadAnswers(CITY_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateCityResult(answers), [answers])

  const totalQuestions = 45
  if (Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 {totalQuestions} 题后查看结果。</p>
        <Link className="rounded-xl bg-xia-deep px-5 py-2.5 text-sm font-medium text-white transition hover:bg-xia-teal" to="/city">
          返回宜居城市测试
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const profile = CITY_PROFILES[result.profileKey]
  const sorted = [...result.dimensionScores].sort((a, b) => b.percent - a.percent)

  const radarData = result.dimensionScores.map(d => ({
    subject: SUBJECT_SHORT[d.id],
    A: d.percent,
    fullMark: 100,
  }))
  const barData = sorted.map(d => ({
    name: d.name,
    score: d.percent,
    level: CITY_LEVEL_LABELS[d.level],
  }))

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 pb-10 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-xia-haze bg-white shadow-lg sm:rounded-3xl sm:shadow-xl">
        {/* 头部：先给出城市结果 */}
        <div className="relative overflow-hidden border-b border-xia-haze bg-gradient-to-br from-xia-mint/50 via-xia-cream/80 to-white px-4 py-8 sm:px-6 sm:py-10">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-xia-aqua/20 blur-2xl sm:h-64 sm:w-64 sm:blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-center gap-4 text-center sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-xia-mint/60 shadow-lg ring-2 ring-xia-aqua/60 sm:h-24 sm:w-24">
              <MapPin className="h-10 w-10 text-xia-teal sm:h-12 sm:w-12" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-xia-deep/50 sm:text-xs">
                宜居城市测试 · 五维分析
              </p>
              <h1 className="mt-1.5 text-xl font-bold text-xia-deep sm:mt-2 sm:text-2xl md:text-3xl">
                为你推荐的两座城市
              </h1>
              {/* 城市结果：首要展示，两卡片宽高一致 */}
              <div className="mt-3 flex flex-wrap justify-center gap-3 sm:gap-4">
                {result.topCities.map((match, idx) => (
                  <div
                    key={match.city.id}
                    className={`flex h-10 w-52 items-center justify-center gap-1.5 overflow-hidden rounded-xl px-3 sm:h-11 sm:w-64 sm:gap-2 sm:px-4 ${
                      idx === 0
                        ? 'ring-2 ring-xia-aqua/60 bg-xia-mint/60 shadow-md'
                        : 'border border-xia-haze bg-white/90'
                    }`}
                  >
                    <span className={`shrink-0 text-sm font-bold sm:text-base ${idx === 0 ? 'text-xia-teal' : 'text-xia-deep'}`}>
                      {match.city.name}
                    </span>
                    <span className="shrink-0 text-[10px] text-xia-deep/60 sm:text-[11px]">（{match.city.province}）</span>
                    <span className="shrink-0 rounded-full bg-xia-aqua/30 px-1.5 py-0.5 text-[10px] font-bold leading-none text-xia-teal">
                      匹配 {match.matchPercent}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-xia-deep/70 sm:text-sm">
                你是{profile.title} · {profile.focus}
              </p>
            </div>
            {/* 五维得分 */}
            <div className="mt-2 w-full max-w-md rounded-xl border border-xia-haze/60 bg-white/80 p-3 sm:mt-4 sm:p-4">
              <p className="mb-2 text-[10px] font-semibold text-xia-deep/60 sm:text-xs">五维偏好</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {result.dimensionScores.map(d => {
                  const DimIcon = DIMENSION_ICONS[d.id]
                  return (
                    <div
                      key={d.id}
                      className="flex items-center gap-1.5 rounded-lg bg-xia-haze/30 px-2 py-1.5 text-[11px] sm:text-xs"
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

        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-12">
          {/* 推荐城市详情分析 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <MapPin className="h-4 w-4 text-xia-teal" />
              推荐城市详细分析
            </h2>
            <div className="space-y-4">
              {result.topCities.map((match, idx) => (
                <div
                  key={match.city.id}
                  className={`overflow-hidden rounded-xl border p-4 shadow-sm sm:p-5 ${
                    idx === 0 ? 'border-xia-aqua/60 bg-xia-mint/30' : 'border-xia-haze bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-5 items-center justify-center rounded-full px-2.5 text-xs font-bold leading-none ${
                            idx === 0 ? 'bg-xia-teal text-white' : 'bg-xia-mint/50 text-xia-teal ring-1 ring-xia-teal/40'
                          }`}
                        >
                          推荐 {idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-xia-deep">
                          {match.city.name}
                          <span className="ml-1.5 text-sm font-normal text-xia-deep/60">（{match.city.province}）</span>
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-xia-deep/80 sm:text-sm">{match.city.brief}</p>
                      <p className="mt-2 text-xs font-medium text-xia-teal">
                        匹配原因：{match.matchReason}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-2xl font-bold text-xia-teal">{match.matchPercent}%</span>
                      <p className="text-[10px] text-xia-deep/60">综合匹配度</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(['climate', 'pace', 'culture', 'cost', 'social'] as const).map(dim => (
                      <span
                        key={dim}
                        className="rounded-md bg-xia-haze/50 px-2 py-0.5 text-[10px] text-xia-deep/80"
                      >
                        {SUBJECT_SHORT[dim]} {match.dimensionMatch[dim]}%
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 分析方法 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <Info className="h-4 w-4 text-xia-teal" />
              分析方法说明
            </h2>
            <div className="space-y-4 rounded-xl border border-xia-haze bg-xia-cream/30 p-4 sm:p-5">
              {CITY_METHODOLOGY.steps.map(s => (
                <div key={s.step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-xia-aqua/40 text-xs font-bold text-xia-teal">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-semibold text-xia-deep">{s.title}</p>
                    <p className="mt-0.5 text-xs text-xia-deep/85 sm:text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
              <p className="border-t border-xia-haze/50 pt-3 text-[10px] text-xia-deep/60 sm:text-xs">
                {CITY_METHODOLOGY.disclaimer}
              </p>
            </div>
          </section>

          {/* 五维雷达 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">
              <Scan className="h-4 w-4 sm:h-5 sm:w-5 text-xia-teal" />
              五维雷达
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
                    stroke="rgb(var(--xia-teal))"
                    fill="rgb(var(--xia-teal))"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 五维柱状图 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">五维得分</h2>
            <div className="h-44 rounded-xl border border-xia-haze bg-white p-3 sm:h-52 sm:rounded-2xl sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 4, right: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v: number, _: unknown, props: { payload?: { level?: string } }) => [`${v}% (${props.payload?.level ?? ''})`, '得分']}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={22} fill="rgb(var(--xia-teal))" fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 维度解读 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 text-base font-bold text-xia-deep sm:mb-6 sm:text-lg">维度解读</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.dimensionScores.map(d => {
                const levelConclusion = CITY_DIMENSION_BY_LEVEL[d.id]?.[d.level] ?? ''
                const DimIcon = DIMENSION_ICONS[d.id]
                return (
                  <div
                    key={d.id}
                    className="overflow-hidden rounded-xl border border-xia-haze bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-xia-deep">
                        <DimIcon className="h-5 w-5 text-xia-teal" />
                        {d.name}
                      </h3>
                      <span className="text-sm font-bold text-xia-teal">
                        {d.percent}% · {CITY_LEVEL_LABELS[d.level]}
                      </span>
                    </div>
                    <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-xia-haze/50">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${d.percent}%`, backgroundColor: 'rgb(var(--xia-teal))' }}
                      />
                    </div>
                    {levelConclusion && (
                      <div className="mb-2 flex gap-2 rounded-lg bg-xia-cream/50 px-3 py-2">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-xia-teal" />
                        <p className="text-xs font-medium text-xia-deep/90 sm:text-sm">{levelConclusion}</p>
                      </div>
                    )}
                    <p className="text-xs leading-relaxed text-xia-deep/80 sm:text-sm">{CITY_DIMENSION_INSIGHTS[d.id]}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 类型参考城市 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <MapPin className="h-4 w-4 text-xia-teal" />
              该类型典型城市参考
            </h2>
            <div className="rounded-xl border border-xia-haze bg-xia-mint/20 p-4 sm:p-5">
              <p className="text-sm font-medium text-xia-deep">{profile.focus}</p>
              <p className="mt-1 text-xs text-xia-deep/70">{profile.typicalCities}</p>
            </div>
          </section>

          {/* 说明 */}
          <section>
            <div className="rounded-xl border border-xia-haze/50 bg-xia-cream/20 p-4 text-xs text-xia-deep/80 sm:text-sm">
              <p className="font-semibold text-xia-deep">说明</p>
              <p className="mt-2">
                本测试从气候、生活节奏、文化氛围、成本考量、社交需求五个维度探索你的城市偏好，并基于全国主要城市的五维画像进行匹配推荐。推荐结果仅供自我探索与择城参考，实际择城请结合职业发展、家庭因素等综合决策。
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-4 py-5 text-center text-[11px] text-xia-deep/50 sm:px-6 sm:py-6 sm:text-xs">
          <p>报告生成时间：{formatDate()}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-4">
            <Link to="/city" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回宜居城市测试</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
