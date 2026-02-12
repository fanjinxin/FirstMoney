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
import { calculateHITResult } from '../../utils/hit_scoring'
import { loadAnswers } from '../../utils/storage'
import { HIT_TEST_ID } from '../../data/hit'
import {
  HIT_DIMENSION_INSIGHTS,
  HIT_DIMENSION_SHORT,
  HOLLAND_CODE_EXAMPLES,
  HOLLAND_CODE_INTRO,
  getCodeConsistency,
} from '../../data/hit_insights'
import type { LucideIcon } from 'lucide-react'
import { Briefcase, Wrench, FlaskConical, Palette, Users, TrendingUp, FileText, Target, Sparkles, Info } from 'lucide-react'
import huolandeIcon from '../../assets/huolande/huolande-icon.png'

/** 霍兰德六边形：R-I-A-S-E-C 顺时针，高亮前三型 */
function HollandHexagon({ topThreeIds }: { topThreeIds: string[] }) {
  const order = ['R', 'I', 'A', 'S', 'E', 'C'] as const
  const r = 48
  const cx = 56
  const cy = 56
  const points = order.map((_, i) => {
    const a = -Math.PI / 2 + i * (Math.PI / 3)
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  }).join(' ')

  return (
    <svg viewBox="0 0 112 112" className="h-36 w-36 sm:h-40 sm:w-40">
      <polygon points={points} fill="none" stroke="rgb(var(--xia-haze))" strokeWidth="2" />
      {order.map((id, i) => {
        const a = -Math.PI / 2 + i * (Math.PI / 3)
        const x = cx + r * Math.cos(a) * 0.75
        const y = cy + r * Math.sin(a) * 0.75
        const isTop = topThreeIds.includes(id)
        return (
          <g key={id}>
            <circle cx={x} cy={y} r="12" fill={isTop ? 'rgb(var(--xia-teal))' : 'rgb(var(--xia-haze))'} fillOpacity={isTop ? 0.5 : 0.3} stroke="rgb(var(--xia-teal))" strokeWidth={isTop ? 2 : 1} />
            <text x={x} y={y + 4} textAnchor="middle" fill="rgb(var(--xia-deep))" fontSize="11" fontWeight="bold">{id}</text>
          </g>
        )
      })}
    </svg>
  )
}

const HOLLAND_ICONS: Record<string, LucideIcon> = {
  R: Wrench,
  I: FlaskConical,
  A: Palette,
  S: Users,
  E: TrendingUp,
  C: FileText,
}

export default function HITResult() {
  const answers = useMemo(() => loadAnswers(HIT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateHITResult(answers), [answers])

  const totalQuestions = 90
  if (!answers || Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 90 题后查看结果。</p>
        <Link
          className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white transition hover:bg-xia-teal"
          to="/hit"
        >
          返回霍兰德职业兴趣测试
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
  }))

  const barData = [...result.dimensionScores]
    .sort((a, b) => b.rawScore - a.rawScore)
    .map(d => ({ name: `${d.name}(${d.id})`, score: d.rawScore, fullMark: 15 }))

  const codeExamples = HOLLAND_CODE_EXAMPLES[result.hollandCode] ?? '可根据前三型自行探索适合职业'
  const consistency = getCodeConsistency(result.topThree.map(t => t.id))

  return (
    <div className="mx-auto max-w-4xl animate-fade-in pb-10">
      <div className="rounded-3xl border border-xia-haze bg-white shadow-xl ring-1 ring-xia-haze/30">
        {/* Header */}
        <div className="rounded-t-3xl border-b border-xia-haze overflow-hidden">
          <div className="relative px-6 py-10 sm:px-12 sm:py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-xia-sky/20 via-xia-cream/40 to-white" />
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-xia-teal/8 blur-3xl" aria-hidden />
            <div className="relative mx-auto max-w-2xl">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/95 shadow-lg ring-2 ring-xia-teal/20 sm:h-24 sm:w-24">
                  <img src={huolandeIcon} alt="霍兰德" className="h-full w-full object-contain" />
                </div>
                <div className="flex flex-1 flex-col items-center gap-6 sm:items-start sm:gap-5">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-medium uppercase tracking-widest text-xia-deep/50">HIT 霍兰德职业兴趣</p>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-xia-deep sm:text-4xl">
                      你的霍兰德代码：{result.hollandCode}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-xia-deep/70">
                      前三型：{result.topThree.map(t => `${t.name}(${t.id})`).join(' > ')}
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-xia-sky bg-xia-sky/15 px-4 py-3 text-sm text-xia-deep/90">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-xia-teal" />
                    <div><span className="font-semibold">推荐职业：</span>{codeExamples}</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-xia-haze/60 bg-white/70 px-3 py-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-xia-aqua" />
                    <span className="text-xs"><span className="font-semibold text-xia-teal">一致性 {consistency.level}</span> · {consistency.short}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-12">
          {/* 0. 霍兰德六边形 + 代码解读 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-xia-deep">
              <Info className="h-5 w-5 text-xia-teal" />
              霍兰德六边形
            </h2>
            <div className="flex flex-col gap-6 rounded-xl border border-xia-haze/50 bg-xia-cream/20 p-5 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex shrink-0 justify-center">
                <HollandHexagon topThreeIds={result.topThree.map(t => t.id)} />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="flex items-start gap-2 text-sm text-xia-deep/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-xia-teal/20">
                    <span className="text-[10px] font-bold text-xia-teal">1</span>
                  </span>
                  {HOLLAND_CODE_INTRO.what}
                </p>
                <p className="flex items-start gap-2 text-sm text-xia-deep/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-xia-sky/30">
                    <span className="text-[10px] font-bold text-xia-deep">2</span>
                  </span>
                  你的代码 <span className="font-semibold text-xia-teal">{result.hollandCode}</span>：首位 <strong>{result.topThree[0]?.name}</strong> 为主导型
                </p>
              </div>
            </div>
          </section>

          {/* 1. 雷达图 */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">六型雷达</h2>
            <div className="h-80 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgb(var(--xia-haze))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                  <Radar
                    name="兴趣强度"
                    dataKey="A"
                    stroke="rgb(var(--xia-sky))"
                    fill="rgb(var(--xia-sky))"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, '兴趣']}
                    contentStyle={{ borderRadius: 12, borderColor: 'rgb(var(--xia-haze))' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 2. 柱状图 */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">六型得分</h2>
            <div className="h-72 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 15]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v: number) => [v, '选「是」题数']}
                    contentStyle={{ borderRadius: 12, borderColor: 'rgb(var(--xia-haze))' }}
                  />
                  <Bar dataKey="score" fill="rgb(var(--xia-sky))" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 3. 六型解读 */}
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-xia-deep">六型解读</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.dimensionScores.map(d => {
                const topIdx = result.topThree.findIndex(t => t.id === d.id)
                const isTop = topIdx >= 0
                const Icon = HOLLAND_ICONS[d.id]
                const roleLabel = topIdx === 0 ? '主导' : topIdx >= 1 ? '辅助' : ''
                return (
                  <div
                    key={d.id}
                    className={`flex gap-3 rounded-xl border p-4 shadow-sm ${
                      isTop ? 'border-xia-sky bg-xia-sky/10' : 'border-xia-haze bg-white'
                    }`}
                    title={HIT_DIMENSION_INSIGHTS[d.id]}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isTop ? 'bg-xia-teal/20 text-xia-teal' : 'bg-xia-haze/50 text-xia-deep/70'}`}>
                      {Icon && <Icon className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xia-deep">{d.name}（{d.id}）</span>
                        <span className="text-xs font-bold text-xia-teal">{d.rawScore}/15</span>
                      </div>
                      {roleLabel && <span className="text-[10px] text-xia-teal">{roleLabel}</span>}
                      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-xia-haze/50">
                        <div className="h-full rounded-full bg-xia-sky" style={{ width: `${d.percent}%` }} />
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-xia-deep/75">{HIT_DIMENSION_SHORT[d.id]}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 4. 使用说明 */}
          <section>
            <div className="flex flex-wrap gap-4 rounded-xl border border-xia-haze/50 bg-xia-cream/20 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-xia-deep/75">
                <Briefcase className="h-4 w-4 shrink-0 text-xia-teal" />
                <span>前三型组成代码 · 首位主导</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-xia-deep/75">
                <Target className="h-4 w-4 shrink-0 text-xia-teal" />
                <span>可查 O*NET / 职业索引</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-xia-deep/75">
                <Info className="h-4 w-4 shrink-0 text-xia-teal" />
                <span>兴趣≠能力 · 仅供参考</span>
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-6 py-6 sm:px-12 text-center text-xs text-xia-deep/50">
          <p>报告生成时间：{formatDate()} · HIT 霍兰德职业兴趣测试</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to="/hit" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回测验</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
