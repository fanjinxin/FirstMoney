import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  PieChart,
} from 'recharts'
import { calculateAATResult } from '../../utils/aat_scoring'
import { loadAnswers } from '../../utils/storage'
import { AAT_TEST_ID } from '../../data/aat'
import {
  AAT_FACTOR_INSIGHTS,
  AAT_FACTOR_IMPROVE,
  AAT_TOTAL_LEVELS,
} from '../../data/aat_insights'
import { TrendingUp, TrendingDown, BookOpen, Target } from 'lucide-react'

function getTotalLevel(totalPercent: number) {
  if (totalPercent >= 75) return AAT_TOTAL_LEVELS.excellent
  if (totalPercent >= 60) return AAT_TOTAL_LEVELS.good
  if (totalPercent >= 45) return AAT_TOTAL_LEVELS.fair
  if (totalPercent >= 30) return AAT_TOTAL_LEVELS.poor
  return AAT_TOTAL_LEVELS.veryPoor
}

function getLevelStyle(level: string) {
  switch (level) {
    case 'good':
      return 'bg-xia-mint/20 text-xia-teal border-xia-mint'
    case 'fair':
      return 'bg-xia-sky/20 text-xia-deep border-xia-sky'
    case 'poor':
      return 'bg-xia-aqua/20 text-xia-deep border-xia-aqua'
    case 'veryPoor':
      return 'bg-xia-deep/10 text-xia-deep border-xia-deep'
    default:
      return 'bg-xia-haze/30 text-xia-deep border-xia-haze'
  }
}

function getLevelColor(level: string) {
  switch (level) {
    case 'good':
      return 'rgb(var(--xia-teal))'
    case 'fair':
      return 'rgb(var(--xia-sky))'
    case 'poor':
      return 'rgb(var(--xia-aqua))'
    case 'veryPoor':
      return 'rgb(var(--xia-deep))'
    default:
      return 'rgb(var(--xia-haze))'
  }
}

const AAT_GROUPS = [
  { id: 'drive', name: '学习动力', factors: ['enthusiasm', 'planning'] as const, hint: '学习热情与计划能力' },
  { id: 'method', name: '学习方法', factors: ['listening', 'reading', 'technique', 'exam'] as const, hint: '听课、读书、技术、应试' },
  { id: 'environment', name: '环境因素', factors: ['family', 'school', 'friends'] as const, hint: '家庭、学校、朋友关系' },
  { id: 'trait', name: '个人特质', factors: ['independence', 'perseverance', 'health'] as const, hint: '独立性、毅力、心身健康' },
] as const

export default function AATResult() {
  const answers = useMemo(() => loadAnswers(AAT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateAATResult(answers), [answers])

  const totalQuestions = 118
  if (!answers || Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 118 题后查看结果。</p>
        <Link className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white transition hover:bg-xia-teal" to="/aat">
          返回 AAT 测验
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const totalLevel = getTotalLevel(result.totalPercent)
  const goodCount = result.factorScores.filter(f => f.level === 'good').length
  const poorCount = result.factorScores.filter(f => f.level === 'poor' || f.level === 'veryPoor').length

  const radarData = result.factorScores.map(f => ({ subject: f.name, A: f.percent, fullMark: 100, level: f.level }))

  const barData = [...result.factorScores]
    .sort((a, b) => b.percent - a.percent)
    .map(f => ({
      name: f.name.length > 5 ? f.name.replace(/和/g, '&') : f.name,
      score: f.percent,
      level: f.level,
    }))

  const levelDistData = [
    { name: '较好', value: result.factorScores.filter(f => f.level === 'good').length, color: 'rgb(var(--xia-teal))' },
    { name: '中等', value: result.factorScores.filter(f => f.level === 'fair').length, color: 'rgb(var(--xia-sky))' },
    { name: '较差', value: result.factorScores.filter(f => f.level === 'poor').length, color: 'rgb(var(--xia-aqua))' },
    { name: '差', value: result.factorScores.filter(f => f.level === 'veryPoor').length, color: 'rgb(var(--xia-deep))' },
  ].filter(d => d.value > 0)

  const top3 = [...result.factorScores].sort((a, b) => b.percent - a.percent).slice(0, 3)
  const bottom3 = [...result.factorScores].sort((a, b) => a.percent - b.percent).slice(0, 3)

  const groupScores = AAT_GROUPS.map(g => {
    const factorIds = g.factors as readonly string[]
    const items = result.factorScores.filter(f => factorIds.includes(f.id))
    const avg = items.length > 0 ? Math.round(items.reduce((s, x) => s + x.percent, 0) / items.length) : 0
    return { ...g, avg, items }
  })

  return (
    <div className="mx-auto max-w-4xl animate-fade-in pb-10">
      <div className="rounded-3xl border border-xia-haze bg-white shadow-xl ring-1 ring-xia-haze/30 overflow-hidden">
        {/* 头部卡片：重设计 */}
        <div className="relative overflow-hidden border-b border-xia-haze">
          <div className="absolute inset-0 bg-gradient-to-br from-xia-sky/15 via-xia-cream/40 to-white" />
          <div className="absolute right-0 top-0 h-72 w-72 -translate-y-1/3 translate-x-1/3 rounded-full bg-xia-teal/8 blur-3xl" aria-hidden />
          <div className="absolute left-0 bottom-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full bg-xia-aqua/12 blur-2xl" aria-hidden />

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
              {/* 左侧：总分与等级 */}
              <div className="flex shrink-0 flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative">
                  <svg className="h-28 w-28 -rotate-90 sm:h-32 sm:w-32" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="44"
                      fill="none"
                      stroke="rgb(var(--xia-teal))"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.totalPercent / 100) * 276} 276`}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-xia-deep sm:text-3xl">{result.totalPercent}</span>
                    <span className="text-xs font-medium text-xia-deep/60">%</span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xs font-semibold uppercase tracking-widest text-xia-deep/50">AAT 学习适应性测验</p>
                  <h1 className="mt-2 text-2xl font-bold text-xia-deep sm:text-3xl">综合适应指数</h1>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold ${
                      totalLevel.label === '优秀' ? 'bg-xia-teal/20 border-xia-teal text-xia-deep' :
                      totalLevel.label === '较好' ? 'bg-xia-sky/20 border-xia-sky text-xia-deep' :
                      totalLevel.label === '中等' ? 'bg-xia-aqua/20 border-xia-aqua text-xia-deep' :
                      'bg-xia-deep/10 border-xia-deep text-xia-deep'
                    }`}>
                      {totalLevel.label}
                    </span>
                  </div>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-xia-deep/75">
                    {totalLevel.desc}
                  </p>
                  <p className="mt-2 text-xs text-xia-deep/50">
                    已完成 {result.answeredCount}/{result.totalQuestions} 题
                  </p>
                </div>
              </div>

              {/* 右侧：关键数据与四维 */}
              <div className="min-w-0 flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-xia-haze/60 bg-white/80 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xia-deep/60">
                      <TrendingUp className="h-4 w-4 text-xia-teal" />
                      <span className="text-xs font-medium">优势因子</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold text-xia-teal">{goodCount}</p>
                    <p className="text-[10px] text-xia-deep/50">表现较好</p>
                  </div>
                  <div className="rounded-xl border border-xia-haze/60 bg-white/80 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-xia-deep/60">
                      <TrendingDown className="h-4 w-4 text-xia-deep/70" />
                      <span className="text-xs font-medium">待改进</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold text-xia-deep">{poorCount}</p>
                    <p className="text-[10px] text-xia-deep/50">需关注</p>
                  </div>
                  <div className="rounded-xl border border-xia-haze/60 bg-white/80 p-4 shadow-sm col-span-2">
                    <div className="flex items-center gap-2 text-xia-deep/60">
                      <Target className="h-4 w-4" />
                      <span className="text-xs font-medium">优先改进</span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-xia-deep">
                      {bottom3[0]?.name ?? '-'} ({bottom3[0]?.percent ?? 0}%)
                    </p>
                    <p className="text-[10px] text-xia-deep/50">建议从该因子着手</p>
                  </div>
                </div>

                <div className="rounded-xl border border-xia-haze/50 bg-white/70 p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-semibold text-xia-deep/60 mb-3">
                    <BookOpen className="h-4 w-4" />
                    四维分组均分
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {groupScores.map(g => (
                      <div key={g.id} className="text-center">
                        <p className="text-[10px] text-xia-deep/50 truncate">{g.name}</p>
                        <p className="text-lg font-bold text-xia-teal">{g.avg}%</p>
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-xia-haze/40">
                          <div
                            className="h-full rounded-full bg-xia-teal/80"
                            style={{ width: `${g.avg}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${getLevelStyle(top3[0]?.level ?? 'fair')}`}>
                    <TrendingUp className="h-3.5 w-3.5" /> 最强：{top3[0]?.name ?? '-'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${getLevelStyle(bottom3[0]?.level ?? 'fair')}`}>
                    <TrendingDown className="h-3.5 w-3.5" /> 待改进：{bottom3[0]?.name ?? '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-12">
          {/* 1. 雷达图 + 等级分布 */}
          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">可视化分析</h2>
            <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
              <div className="h-80 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold text-xia-deep">十二因子雷达图</div>
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgb(var(--xia-haze))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'rgb(var(--xia-teal))' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                    <Radar name="得分" dataKey="A" stroke="rgb(var(--xia-teal))" fill="rgb(var(--xia-teal))" fillOpacity={0.35} strokeWidth={2} />
                    <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12, borderColor: 'rgb(var(--xia-haze))' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold text-xia-deep">因子等级分布</div>
                {levelDistData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={levelDistData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        label={({ name, value }) => `${name} ${value}项`}
                      >
                        {levelDistData.map(e => (
                          <Cell key={e.name} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number, n: string) => [`${v} 项`, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-xia-deep/60">暂无等级分布数据</div>
                )}
              </div>
            </div>
          </section>

          {/* 2. 柱状图 */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">因子得分排序（由高到低）</h2>
            <div className="h-72 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12 }} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                    {barData.map(e => (
                      <Cell key={e.name} fill={getLevelColor(e.level)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 3. 四维分组 */}
          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">四维分组概览</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {groupScores.map(g => (
                <div key={g.id} className="rounded-xl border border-xia-haze/50 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-xia-deep">{g.name}</h3>
                      <p className="mt-0.5 text-xs text-xia-deep/50">{g.hint}</p>
                    </div>
                    <span className="text-2xl font-bold text-xia-teal">{g.avg}%</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-xia-haze/30">
                    <div className="h-full rounded-full bg-xia-teal transition-all" style={{ width: `${g.avg}%` }} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                    {g.items.map(f => (
                      <span key={f.id} className={`rounded-full px-2 py-0.5 ${getLevelStyle(f.level)}`}>
                        {f.name} {f.percent}%
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. 优势与待改进：重设计 */}
          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">优势与待改进因子</h2>
            <div className="relative overflow-hidden rounded-2xl border border-xia-haze/60 bg-gradient-to-br from-white via-xia-cream/20 to-xia-haze/10 p-6 shadow-lg">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-xia-mint/20 blur-2xl" aria-hidden />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-xia-aqua/15 blur-2xl" aria-hidden />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-stretch">
                {/* 优势：领奖台风格 */}
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-xia-mint/30 text-xia-teal">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold text-xia-deep">表现较好 · 可继续保持</h3>
                  </div>
                  <div className="flex gap-3 sm:gap-4">
                    {top3.map((f, i) => (
                      <div
                        key={f.id}
                        className={`flex flex-1 flex-col items-center gap-2 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
                          i === 0 ? 'order-2 scale-105 border-xia-teal/30 ring-1 ring-xia-teal/20' : i === 1 ? 'order-1 border-xia-mint/40' : 'order-3 border-xia-mint/40'
                        }`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-xia-teal/15 text-sm font-bold text-xia-teal">
                          {i + 1}
                        </span>
                        <p className="text-center text-sm font-medium text-xia-deep line-clamp-2">{f.name}</p>
                        <div className="relative h-12 w-12">
                          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="3" />
                            <circle
                              cx="18" cy="18" r="14"
                              fill="none"
                              stroke="rgb(var(--xia-teal))"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray={`${(f.percent / 100) * 88} 88`}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-xia-teal">{f.percent}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="hidden h-auto w-px bg-gradient-to-b from-transparent via-xia-haze to-transparent lg:block" />

                {/* 待改进：重点突出 + 建议 */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-xia-aqua/20 text-xia-deep/80">
                      <Target className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold text-xia-deep">建议优先改进</h3>
                  </div>

                  {bottom3[0] && (
                    <div className="rounded-xl border-2 border-xia-aqua/40 bg-gradient-to-br from-xia-aqua/5 to-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-block rounded-full bg-xia-deep/10 px-2.5 py-0.5 text-xs font-semibold text-xia-deep">优先</span>
                          <p className="mt-2 font-semibold text-xia-deep">{bottom3[0].name}</p>
                          <p className="mt-1 text-2xl font-bold text-xia-deep">{bottom3[0].percent}%</p>
                        </div>
                        <div className="h-14 w-14 shrink-0">
                          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="3" />
                            <circle
                              cx="18" cy="18" r="14"
                              fill="none"
                              stroke="rgb(var(--xia-deep))"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray={`${(bottom3[0].percent / 100) * 88} 88`}
                            />
                          </svg>
                        </div>
                      </div>
                      {AAT_FACTOR_IMPROVE[bottom3[0].id] && (
                        <div className="mt-4 flex gap-3 rounded-lg bg-xia-cream/50 p-3">
                          <span className="text-lg">💡</span>
                          <p className="text-xs leading-relaxed text-xia-deep/85">{AAT_FACTOR_IMPROVE[bottom3[0].id]}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {bottom3.slice(1, 3).map((f, i) => (
                      <div
                        key={f.id}
                        className="flex flex-1 items-center gap-3 rounded-xl border border-xia-haze/50 bg-white/80 px-4 py-3"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-xia-deep/5 text-xs font-bold text-xia-deep">
                          {i + 2}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-xia-deep">{f.name}</p>
                          <p className="text-xs font-bold text-xia-deep/70">{f.percent}%</p>
                        </div>
                        <div className="h-8 w-8 shrink-0">
                          <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="2.5" />
                            <circle
                              cx="18" cy="18" r="14"
                              fill="none"
                              stroke="rgb(var(--xia-aqua))"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeDasharray={`${(f.percent / 100) * 88} 88`}
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="my-8 h-px bg-xia-haze/30" />

          {/* 5. 十二因子详解 */}
          <section>
            <h2 className="mb-6 text-lg font-bold text-xia-deep">十二因子得分与解读</h2>
            <div className="space-y-4">
              {result.factorScores.map(f => (
                <div key={f.id} className={`rounded-xl border p-5 shadow-sm ${getLevelStyle(f.level)}`}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-xia-deep">{f.name}</h3>
                    <span className="text-sm font-bold">{f.percent}% · {f.levelLabel}</span>
                  </div>
                  <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/50">
                    <div className="h-full rounded-full transition-all" style={{ width: `${f.percent}%`, backgroundColor: getLevelColor(f.level) }} />
                  </div>
                  <p className="mb-2 text-sm leading-relaxed text-xia-deep/80">{AAT_FACTOR_INSIGHTS[f.id] ?? '暂无解读'}</p>
                  {(f.level === 'poor' || f.level === 'veryPoor') && AAT_FACTOR_IMPROVE[f.id] && (
                    <p className="text-xs leading-relaxed text-xia-teal/90">
                      <strong>改进建议：</strong>{AAT_FACTOR_IMPROVE[f.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-6 py-6 sm:px-12 text-center text-xs text-xia-deep/50">
          <p>报告生成时间：{formatDate()} · AAT 学习适应性测验</p>
          <p className="mt-2">本测验仅供自我觉察与学习参考，不构成专业评估。结果仅供参考，不用于区分优劣。如有学习困扰，建议寻求专业辅导。</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/aat" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回测验</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
