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
import { calculateAPTResult } from '../../utils/apt_scoring'
import { loadAnswers } from '../../utils/storage'
import { APT_TEST_ID } from '../../data/apt'
import {
  APT_DIMENSION_INSIGHTS,
  APT_LEVEL_LABELS,
  APT_LEVEL_DESC,
  APT_CAREER_SUGGESTIONS,
  APT_IMPROVE_TIPS,
  getCareerSuggestionKey,
} from '../../data/apt_insights'
import { TrendingUp, TrendingDown, Briefcase, Target, Sparkles } from 'lucide-react'

function getLevelStyle(level: string) {
  switch (level) {
    case 'excellent':
      return 'bg-xia-mint/20 text-xia-teal border-xia-mint'
    case 'good':
      return 'bg-xia-sky/20 text-xia-deep border-xia-sky'
    case 'fair':
      return 'bg-xia-aqua/20 text-xia-deep border-xia-aqua'
    case 'low':
      return 'bg-xia-deep/10 text-xia-deep border-xia-deep'
    default:
      return 'bg-xia-haze/30 text-xia-deep border-xia-haze'
  }
}

function getLevelColor(level: string) {
  switch (level) {
    case 'excellent':
      return 'rgb(var(--xia-teal))'
    case 'good':
      return 'rgb(var(--xia-sky))'
    case 'fair':
      return 'rgb(var(--xia-aqua))'
    case 'low':
      return 'rgb(var(--xia-deep))'
    default:
      return 'rgb(var(--xia-haze))'
  }
}

export default function APTResult() {
  const answers = useMemo(() => loadAnswers(APT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateAPTResult(answers), [answers])

  const totalQuestions = 60
  if (!answers || Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 60 题后查看结果。</p>
        <Link className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white transition hover:bg-xia-teal" to="/apt">
          返回天赋潜能评估
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const levelKey = result.totalLevel
  const levelLabel = APT_LEVEL_LABELS[levelKey]
  const excellentCount = result.dimensionScores.filter(d => d.level === 'excellent').length
  const lowCount = result.dimensionScores.filter(d => d.level === 'low').length

  const radarData = result.dimensionScores.map(d => ({ subject: d.name, A: d.percent, fullMark: 100, level: d.level }))
  const barData = [...result.dimensionScores]
    .sort((a, b) => b.percent - a.percent)
    .map(d => ({ name: d.name, score: d.percent, level: d.level }))

  const levelDistData = [
    { name: '优秀', value: result.dimensionScores.filter(d => d.level === 'excellent').length, color: 'rgb(var(--xia-teal))' },
    { name: '较好', value: result.dimensionScores.filter(d => d.level === 'good').length, color: 'rgb(var(--xia-sky))' },
    { name: '中等', value: result.dimensionScores.filter(d => d.level === 'fair').length, color: 'rgb(var(--xia-aqua))' },
    { name: '偏低', value: result.dimensionScores.filter(d => d.level === 'low').length, color: 'rgb(var(--xia-deep))' },
  ].filter(d => d.value > 0)

  const careerKey = getCareerSuggestionKey(result.topDimensions)
  const careerSuggestion = APT_CAREER_SUGGESTIONS[careerKey] ?? `你的优势组合为「${result.topDimensions[0]?.name ?? ''}+${result.topDimensions[1]?.name ?? ''}」，可根据兴趣探索分析、创意、人际或管理类方向。`

  return (
    <div className="mx-auto max-w-4xl animate-fade-in pb-10">
      <div className="rounded-3xl border border-xia-haze bg-white shadow-xl ring-1 ring-xia-haze/30 overflow-hidden">
        {/* 头部：仿照心理年龄布局 */}
        <div className="rounded-t-3xl border-b border-xia-haze overflow-hidden">
          <div className="relative px-6 py-10 sm:px-12 sm:py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-xia-mint/25 via-xia-cream/40 to-white" />
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-xia-teal/8 blur-3xl" aria-hidden />
            <div className="absolute left-0 bottom-0 h-40 w-40 -translate-x-1/3 translate-y-1/3 rounded-full bg-xia-aqua/12 blur-3xl" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                {/* 左侧：圆环 + 中心图标 */}
                <div className="flex flex-col items-center gap-4 sm:items-start">
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32">
                    <svg className="absolute inset-0 h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="apt-result-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgb(var(--xia-teal))" />
                          <stop offset="100%" stopColor="rgb(var(--xia-aqua))" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="6" />
                      <circle
                        cx="50" cy="50" r="44"
                        fill="none"
                        stroke="url(#apt-result-ring)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.totalPercent / 100) * 276} 276`}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_14px_rgba(44,111,122,0.12)] ring-2 ring-xia-teal/20 sm:h-24 sm:w-24 overflow-hidden">
                      <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-xia-teal" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-xia-deep/40">APT 天赋潜能</p>
                    <p className="mt-0.5 text-xs text-xia-deep/60">总分 {result.totalScore}/{result.maxTotalScore}</p>
                  </div>
                </div>
                {/* 右侧：标题 + 描述 + 两张卡片 */}
                <div className="flex flex-1 flex-col items-center gap-6 sm:items-start sm:gap-5">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-medium uppercase tracking-widest text-xia-deep/50">天赋潜能评估</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-xia-deep sm:text-4xl">综合潜能指数</p>
                    <div className="mt-2">
                      <span className={`inline-flex rounded-lg border px-3 py-1 text-sm font-semibold ${
                        levelKey === 'excellent' ? 'bg-xia-teal/20 border-xia-teal text-xia-deep' :
                        levelKey === 'good' ? 'bg-xia-sky/20 border-xia-sky text-xia-deep' :
                        levelKey === 'fair' ? 'bg-xia-aqua/20 border-xia-aqua text-xia-deep' :
                        'bg-xia-deep/10 border-xia-deep text-xia-deep'
                      }`}>
                        {levelLabel}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-xia-deep/70">
                      {APT_LEVEL_DESC[levelKey] ?? APT_LEVEL_DESC.fair}
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                    <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 shadow-sm ${getLevelStyle(result.topDimensions[0]?.level ?? 'fair')}`}>
                      <TrendingUp className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">最强</span>
                      <span className="text-sm font-semibold">{result.topDimensions[0]?.name ?? '-'}</span>
                    </div>
                    <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 shadow-sm ${getLevelStyle(result.weakDimensions[0]?.level ?? 'fair')}`}>
                      <TrendingDown className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">待提升</span>
                      <span className="text-sm font-semibold">{result.weakDimensions[0]?.name ?? '-'}</span>
                    </div>
                  </div>
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
                <div className="mb-2 text-sm font-semibold text-xia-deep">六维天赋雷达</div>
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgb(var(--xia-haze))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'rgb(var(--xia-teal))' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                    <Radar name="潜能" dataKey="A" stroke="rgb(var(--xia-teal))" fill="rgb(var(--xia-teal))" fillOpacity={0.35} strokeWidth={2} />
                    <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12, borderColor: 'rgb(var(--xia-haze))' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold text-xia-deep">维度等级分布</div>
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
                  <div className="flex h-full items-center justify-center text-sm text-xia-deep/60">暂无数据</div>
                )}
              </div>
            </div>
          </section>

          {/* 2. 柱状图 */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">维度得分排序（由高到低）</h2>
            <div className="h-72 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`${v}%`, '潜能']} contentStyle={{ borderRadius: 12 }} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                    {barData.map(e => (
                      <Cell key={e.name} fill={getLevelColor(e.level)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 3. 职业发展方向 */}
          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">职业与发展方向建议</h2>
            <div className="rounded-xl border border-xia-mint/40 bg-gradient-to-br from-xia-mint/10 to-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-xia-teal/15">
                  <Briefcase className="h-5 w-5 text-xia-teal" />
                </div>
                <div>
                  <p className="font-semibold text-xia-deep">基于你的优势组合</p>
                  <p className="mt-2 text-sm leading-relaxed text-xia-deep/85">{careerSuggestion}</p>
                  <p className="mt-4 text-xs text-xia-deep/60">
                    建议结合兴趣、价值观与实际机会，探索适合的发展路径。本建议仅供参考，不替代专业职业咨询。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. 优势与待改进：重设计 */}
          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">优势与待改进维度</h2>
            <div className="relative overflow-hidden rounded-2xl border border-xia-haze/60 bg-gradient-to-br from-white via-xia-cream/20 to-xia-haze/10 p-6 shadow-lg">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-xia-mint/20 blur-2xl" aria-hidden />
              <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-xia-aqua/15 blur-2xl" aria-hidden />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-stretch">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-xia-mint/30 text-xia-teal">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold text-xia-deep">表现较好 · 可继续保持</h3>
                  </div>
                  <div className="flex gap-3 sm:gap-4">
                    {result.topDimensions.map((f, i) => (
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
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--xia-teal))" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(f.percent / 100) * 88} 88`} />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-xia-teal">{f.percent}%</span>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getLevelStyle(f.level)}`}>{f.levelLabel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden h-auto w-px bg-gradient-to-b from-transparent via-xia-haze to-transparent lg:block" />

                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-xia-aqua/20 text-xia-deep/80">
                      <Target className="h-4 w-4" />
                    </span>
                    <h3 className="font-semibold text-xia-deep">建议优先提升</h3>
                  </div>

                  {result.weakDimensions[0] && (
                    <div className="rounded-xl border-2 border-xia-aqua/40 bg-gradient-to-br from-xia-aqua/5 to-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-block rounded-full bg-xia-deep/10 px-2.5 py-0.5 text-xs font-semibold text-xia-deep">优先</span>
                          <p className="mt-2 font-semibold text-xia-deep">{result.weakDimensions[0].name}</p>
                          <p className="mt-1 text-2xl font-bold text-xia-deep">{result.weakDimensions[0].percent}%</p>
                        </div>
                        <div className="h-14 w-14 shrink-0">
                          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="3" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--xia-deep))" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(result.weakDimensions[0].percent / 100) * 88} 88`} />
                          </svg>
                        </div>
                      </div>
                      {APT_IMPROVE_TIPS[result.weakDimensions[0].id] && (
                        <div className="mt-4 flex gap-3 rounded-lg bg-xia-cream/50 p-3">
                          <span className="text-lg">💡</span>
                          <p className="text-xs leading-relaxed text-xia-deep/85">{APT_IMPROVE_TIPS[result.weakDimensions[0].id]}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {result.weakDimensions.slice(1, 3).map((f, i) => (
                      <div key={f.id} className="flex flex-1 items-center gap-3 rounded-xl border border-xia-haze/50 bg-white/80 px-4 py-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-xia-deep/5 text-xs font-bold text-xia-deep">{i + 2}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-xia-deep">{f.name}</p>
                          <p className="text-xs font-bold text-xia-deep/70">{f.percent}%</p>
                        </div>
                        <div className="h-8 w-8 shrink-0">
                          <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="2.5" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="rgb(var(--xia-aqua))" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${(f.percent / 100) * 88} 88`} />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 六维度解读 */}
          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">六维度解读与发展建议</h2>
            <div className="space-y-4">
              {result.dimensionScores.map(d => {
                const isTop = result.topDimensions.some(t => t.id === d.id)
                const isWeak = result.weakDimensions.some(w => w.id === d.id)
                return (
                  <div
                    key={d.id}
                    className={`rounded-xl border p-5 shadow-sm ${
                      isTop ? 'border-xia-mint bg-xia-mint/10' : isWeak ? 'border-xia-haze bg-xia-cream/20' : 'border-xia-haze bg-white'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-xia-deep">{d.name}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${getLevelStyle(d.level)}`}>
                          {d.levelLabel}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-xia-teal">{d.percent}%</span>
                    </div>
                    <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-xia-haze/50">
                      <div className="h-full rounded-full bg-xia-teal transition-all" style={{ width: `${d.percent}%` }} />
                    </div>
                    <p className="text-sm leading-relaxed text-xia-deep/80">{APT_DIMENSION_INSIGHTS[d.id]}</p>
                    {isTop && <p className="mt-2 text-xs font-medium text-xia-teal">✨ 这是你的优势维度，可优先发挥。</p>}
                    {isWeak && APT_IMPROVE_TIPS[d.id] && (
                      <p className="mt-2 text-xs font-medium text-xia-deep/70">💡 提升建议：{APT_IMPROVE_TIPS[d.id]}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* 6. 综合建议 */}
          <section>
            <h2 className="mb-6 text-lg font-bold text-xia-deep">综合建议</h2>
            <div className="space-y-4 rounded-xl border border-xia-haze/50 bg-xia-cream/20 p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-xia-deep/80">
                · 天赋潜能反映你在各维度的相对优势，不代表绝对能力。高分维度可视为「舒适区」，适合在职业与学习中优先发挥；偏低维度可通过系统学习与刻意练习逐步提升。
              </p>
              <p className="text-sm leading-relaxed text-xia-deep/80">
                · 六维度并非彼此孤立，逻辑与语言、创造力与抗压等常相互促进。建议结合兴趣与职业目标，有重点地发展 1～2 个核心维度，同时兼顾短板。
              </p>
              <p className="text-sm leading-relaxed text-xia-deep/80">
                · 本测验为自我觉察工具，结果仅供参考，不替代专业职业咨询。
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-6 py-6 sm:px-12 text-center text-xs text-xia-deep/50">
          <p>报告生成时间：{formatDate()} · APT 天赋潜能评估</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/apt" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回测验</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
