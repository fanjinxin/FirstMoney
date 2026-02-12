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
import { calculatePsychAgeResult } from '../../utils/psych_age_scoring'
import { loadAnswers } from '../../utils/storage'
import { PSYCH_AGE_TEST_ID } from '../../data/psych_age'
import { PSYCH_AGE_RANGE_INSIGHTS, PSYCH_AGE_DIMENSION_INSIGHTS } from '../../data/psych_age_insights'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import PsychAgeIllustration from '../../components/PsychAgeIllustration'

function getTrendStyle(trend: string) {
  switch (trend) {
    case 'young':
      return 'bg-xia-mint/20 text-xia-teal border-xia-mint'
    case 'balanced':
      return 'bg-xia-sky/20 text-xia-deep border-xia-sky'
    case 'aged':
      return 'bg-xia-aqua/20 text-xia-deep border-xia-aqua'
    default:
      return 'bg-xia-haze/30 text-xia-deep border-xia-haze'
  }
}

function getTrendColor(trend: string) {
  switch (trend) {
    case 'young':
      return 'rgb(var(--xia-teal))'
    case 'balanced':
      return 'rgb(var(--xia-sky))'
    case 'aged':
      return 'rgb(var(--xia-aqua))'
    default:
      return 'rgb(var(--xia-haze))'
  }
}

export default function PsychAgeResult() {
  const answers = useMemo(() => loadAnswers(PSYCH_AGE_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculatePsychAgeResult(answers), [answers])

  const totalQuestions = 30
  if (!answers || Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 30 题后查看结果。</p>
        <Link
          className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white transition hover:bg-xia-teal"
          to="/psych-age"
        >
          返回心理年龄测验
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const radarData = result.dimensionScores.map(d => ({
    subject: d.name,
    A: d.percent,
    fullMark: 100,
    trend: d.trend,
  }))

  const barData = [...result.dimensionScores]
    .sort((a, b) => b.percent - a.percent)
    .map(d => ({
      name: d.name,
      score: d.percent,
      trend: d.trend,
    }))

  const trendDistData = [
    { name: '偏年轻化', value: result.dimensionScores.filter(d => d.trend === 'young').length, color: 'rgb(var(--xia-teal))' },
    { name: '适中', value: result.dimensionScores.filter(d => d.trend === 'balanced').length, color: 'rgb(var(--xia-sky))' },
    { name: '偏成熟', value: result.dimensionScores.filter(d => d.trend === 'aged').length, color: 'rgb(var(--xia-aqua))' },
  ].filter(d => d.value > 0)

  const rangeInsight = PSYCH_AGE_RANGE_INSIGHTS[result.psychAgeRange] ?? '暂无解读'

  const youngestDim = [...result.dimensionScores].sort((a, b) => a.percent - b.percent)[0]
  const oldestDim = [...result.dimensionScores].sort((a, b) => b.percent - a.percent)[0]

  return (
    <div className="mx-auto max-w-4xl animate-fade-in pb-10">
      <div className="rounded-3xl border border-xia-haze bg-white shadow-xl ring-1 ring-xia-haze/30">
        {/* Header */}
        <div className="rounded-t-3xl border-b border-xia-haze overflow-hidden">
          <div className="relative px-6 py-10 sm:px-12 sm:py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-xia-mint/25 via-xia-cream/40 to-white" />
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-xia-teal/8 blur-3xl" aria-hidden />
            <div className="absolute left-0 bottom-0 h-40 w-40 -translate-x-1/3 translate-y-1/3 rounded-full bg-xia-aqua/12 blur-3xl" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <div className="flex flex-col items-center gap-4 sm:items-start">
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32">
                    <svg className="absolute inset-0 h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="psych-age-result-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="rgb(var(--xia-teal))" />
                          <stop offset="100%" stopColor="rgb(var(--xia-aqua))" />
                        </linearGradient>
                      </defs>
                      <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="6" />
                      <circle
                        cx="50" cy="50" r="44"
                        fill="none"
                        stroke="url(#psych-age-result-ring)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.totalScore / result.maxTotalScore) * 276} 276`}
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-[0_4px_14px_rgba(44,111,122,0.12)] ring-2 ring-xia-teal/20 sm:h-24 sm:w-24 overflow-hidden">
                      <PsychAgeIllustration
                        psychAgeRange={result.psychAgeRange}
                        className="h-14 w-14 sm:h-16 sm:w-16 text-xia-teal"
                      />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-xia-deep/40">心理年龄</p>
                    <p className="mt-0.5 text-xs text-xia-deep/60">总分 {result.totalScore}/{result.maxTotalScore}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center gap-6 sm:items-start sm:gap-5">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-medium uppercase tracking-widest text-xia-deep/50">心理年龄测验</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-xia-deep sm:text-4xl">{result.psychAgeRange}</p>
                    <p className="mt-1 text-sm leading-relaxed text-xia-deep/70">
                      根据七维度综合评估，你的心理特征倾向于此年龄区间的特质。
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                    <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 shadow-sm ${getTrendStyle(youngestDim?.trend ?? 'balanced')}`}>
                      <ArrowDownCircle className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">最年轻</span>
                      <span className="text-sm font-semibold">{youngestDim?.name ?? '-'}</span>
                    </div>
                    <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 shadow-sm ${getTrendStyle(oldestDim?.trend ?? 'balanced')}`}>
                      <ArrowUpCircle className="h-4 w-4 shrink-0" />
                      <span className="text-sm font-medium">最成熟</span>
                      <span className="text-sm font-semibold">{oldestDim?.name ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-12">
          {/* 1. 核心结论与区间解读 */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">心理年龄区间解读</h2>
            <div className="rounded-xl border border-xia-haze/50 bg-xia-cream/20 p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-xia-deep/80">
                {rangeInsight}
              </p>
              <p className="mt-4 text-xs text-xia-deep/50">
                本测验将总分映射至心理年龄区间，可与实际年龄对照。心理年龄反映心理特征所呈现的年龄倾向，不代表智力或能力高低，仅供自我觉察与成长参考。
              </p>
            </div>
          </section>

          {/* 2. 可视化分析 */}
          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">可视化分析</h2>
            <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
              <div className="h-80 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold text-xia-deep">七维度雷达图</div>
                <p className="mb-2 text-xs text-xia-deep/50">得分越高表示该维度心理特征越偏成熟/老化倾向</p>
                <ResponsiveContainer width="100%" height="85%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgb(var(--xia-haze))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'rgb(var(--xia-teal))' }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'rgb(var(--xia-teal))' }} tickFormatter={v => `${v}%`} />
                    <Radar
                      name="老化倾向"
                      dataKey="A"
                      stroke="rgb(var(--xia-teal))"
                      fill="rgb(var(--xia-teal))"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(v: number) => [`${v}%`, '老化倾向']}
                      contentStyle={{ borderRadius: 12, borderColor: 'rgb(var(--xia-haze))' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-80 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
                <div className="mb-2 text-sm font-semibold text-xia-deep">维度趋势分布</div>
                {trendDistData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={trendDistData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        label={({ name, value }) => `${name} ${value}项`}
                      >
                        {trendDistData.map(e => (
                          <Cell key={e.name} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number, n: string) => [`${v} 项`, n]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-xia-deep/60">
                    暂无分布数据
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 3. 柱状图 */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">七维度老化倾向（由高到低）</h2>
            <div className="h-64 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }} />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, '老化倾向']}
                    contentStyle={{ borderRadius: 12, borderColor: 'rgb(var(--xia-haze))' }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                    {barData.map(e => (
                      <Cell key={e.name} fill={getTrendColor(e.trend)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 4. 七维度得分与解读 */}
          <section className="mb-10">
            <h2 className="mb-6 text-lg font-bold text-xia-deep">七维度得分与专业解读</h2>
            <div className="space-y-4">
              {result.dimensionScores.map(d => (
                <div
                  key={d.id}
                  className={`rounded-xl border p-5 shadow-sm ${getTrendStyle(d.trend)}`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-xia-deep">{d.name}</h3>
                    <span className="text-sm font-bold">{d.percent}%</span>
                  </div>
                  <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-white/50">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${d.percent}%`, backgroundColor: getTrendColor(d.trend) }}
                    />
                  </div>
                  <div className="mb-3 text-xs opacity-80">{d.trendLabel}</div>
                  <p className="text-sm leading-relaxed text-xia-deep/80">
                    {PSYCH_AGE_DIMENSION_INSIGHTS[d.id] ?? '暂无解读'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. 专业建议 */}
          <section>
            <h2 className="mb-6 text-lg font-bold text-xia-deep">专业建议</h2>
            <div className="space-y-4 rounded-xl border border-xia-haze/50 bg-white p-6 shadow-sm">
              <p className="text-sm leading-relaxed text-xia-deep/80">
                <strong className="text-xia-deep">· 心理年龄与实际年龄的关系：</strong>心理年龄反映的是心理特征所呈现的年龄倾向，不代表智力或能力。若心理年龄显著高于实际年龄，可考虑增加新事物接触、保持运动与社交、适度挑战认知；若心理年龄较低，说明心理活力较好，可继续保持开放心态。
              </p>
              <p className="text-sm leading-relaxed text-xia-deep/80">
                <strong className="text-xia-deep">· 维度差异的利用：</strong>七维度中「偏年轻化」的维度是你的心理活力优势，可在此基础上发挥；「偏成熟」的维度若带来困扰，可针对该领域做小幅调整（如学习新技能、拓展兴趣、调节作息等）。
              </p>
              <p className="text-sm leading-relaxed text-xia-deep/80">
                <strong className="text-xia-deep">· 自我觉察与成长：</strong>本测验旨在帮助了解心理特征与年龄倾向的关系，促进自我觉察。结果仅供参考，不替代临床评估。若有持续情绪困扰或适应困难，建议寻求专业心理咨询。
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-xia-haze bg-xia-cream/20 px-6 py-6 sm:px-12 text-center text-xs text-xia-deep/50">
          <p>报告生成时间：{formatDate()} · 心理年龄测验</p>
          <p className="mt-2">
            本测验旨在帮助了解心理年龄特征，促进自我觉察，不用于诊断或评价。结果仅供参考。
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/psych-age" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回测验</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
