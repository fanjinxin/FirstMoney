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
import { calculateVBTResult } from '../../utils/vbt_scoring'
import { loadAnswers } from '../../utils/storage'
import { VBT_TEST_ID } from '../../data/vbt'
import {
  VBT_PROFILES,
  VBT_LEVEL_LABELS,
  VBT_SENSITIVE_LEVEL_LABELS,
  VBT_DIMENSION_INSIGHTS,
  VBT_DIMENSION_BY_LEVEL,
  VBT_DIMENSION_EXTENDED,
  VBT_VULNERABILITY_ZONE_INSIGHTS,
  VBT_SELF_PROTECTION_TIPS,
  VBT_GROWTH_DIRECTIONS,
  VBT_CAUTIONS,
} from '../../data/vbt_insights'
import { ChevronRight, Check, Scan, Shield, MessageSquare, Heart, Zap, AlertTriangle, TrendingUp } from 'lucide-react'
import type { VBTDimensionId } from '../../data/vbt'
import type { LucideIcon } from 'lucide-react'

const DIMENSION_ICONS: Record<VBTDimensionId, LucideIcon> = {
  boundary: Shield,
  assertive: MessageSquare,
  sensitive: Heart,
  cope: Zap,
}

const SUBJECT_SHORT: Record<VBTDimensionId, string> = {
  boundary: '边界',
  assertive: '主张',
  sensitive: '敏感',
  cope: '应对',
}

function getLevelLabel(dimId: VBTDimensionId, level: string): string {
  return dimId === 'sensitive' ? VBT_SENSITIVE_LEVEL_LABELS[level as keyof typeof VBT_SENSITIVE_LEVEL_LABELS] ?? level : VBT_LEVEL_LABELS[level as keyof typeof VBT_LEVEL_LABELS] ?? level
}

export default function VBTResult() {
  const answers = useMemo(() => loadAnswers(VBT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateVBTResult(answers), [answers])

  const totalQuestions = 40
  if (Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 {totalQuestions} 题后查看结果。</p>
        <Link className="rounded-xl bg-xia-deep px-5 py-2.5 text-sm font-medium text-white transition hover:bg-xia-teal" to="/vbt">
          返回易被欺负测试
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const profile = VBT_PROFILES[result.profileKey]
  const zoneInfo = VBT_VULNERABILITY_ZONE_INSIGHTS[result.vulnerabilityZone]
  const sorted = [...result.dimensionScores].sort((a, b) =>
    a.id === 'sensitive' ? 1 : b.id === 'sensitive' ? -1 : b.percent - a.percent
  )
  const protectDims = result.dimensionScores.filter(d => d.id !== 'sensitive')

  const radarData = result.dimensionScores.map(d => ({
    subject: SUBJECT_SHORT[d.id],
    A: d.percent,
    fullMark: 100,
  }))
  const barData = protectDims.map(d => ({
    name: d.name,
    score: d.percent,
    level: VBT_LEVEL_LABELS[d.level],
  }))

  const zoneColor = {
    low: 'bg-xia-mint/50 text-xia-teal ring-xia-teal/40',
    low_mid: 'bg-xia-aqua/20 text-xia-teal ring-xia-aqua/40',
    mid: 'bg-xia-sky/20 text-xia-teal ring-xia-sky/40',
    mid_high: 'bg-xia-sky/30 text-xia-deep ring-xia-sky/50',
    high: 'bg-xia-deep/10 text-xia-deep ring-xia-teal/50',
  }[result.vulnerabilityZone]

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 pb-10 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-xia-haze bg-white shadow-lg sm:rounded-3xl sm:shadow-xl">
        {/* 头部 */}
        <div className="relative overflow-hidden border-b border-xia-haze bg-gradient-to-br from-xia-mint/50 via-xia-cream/80 to-white px-4 py-8 sm:px-6 sm:py-10">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-xia-aqua/20 blur-2xl sm:h-64 sm:w-64 sm:blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-center gap-4 text-center sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-xia-mint/60 shadow-lg ring-2 ring-xia-aqua/60 sm:h-24 sm:w-24">
              <Shield className="h-10 w-10 text-xia-teal sm:h-12 sm:w-12" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-xia-deep/50 sm:text-xs">
                VBT 易被欺负测试 · 四维分析
              </p>
              <h1 className="mt-1.5 text-xl font-bold text-xia-deep sm:mt-2 sm:text-2xl md:text-3xl">
                你是{profile.title}
              </h1>
              <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1 ${zoneColor}`}>
                <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">易被欺负指数</span>
                <span className="tabular-nums font-bold">{result.vulnerabilityIndex}</span>
                <span className="text-[10px] sm:text-xs">（{zoneInfo.title} · {zoneInfo.range}）</span>
              </div>
              <p className="mt-2 text-xs text-xia-deep/70">{zoneInfo.analysis}</p>
            </div>
            {/* 四维得分 */}
            <div className="mt-2 w-full max-w-sm rounded-xl border border-xia-haze/60 bg-white/80 p-3 sm:mt-4 sm:max-w-md sm:p-4">
              <p className="mb-2 text-[10px] font-semibold text-xia-deep/60 sm:text-xs">四维得分</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {result.dimensionScores.map(d => {
                  const DimIcon = DIMENSION_ICONS[d.id]
                  const isWeak = (d.id !== 'sensitive' && d.percent < 50) || (d.id === 'sensitive' && d.percent >= 65)
                  const isStrong = d.id !== 'sensitive' && d.percent >= 70
                  return (
                    <div
                      key={d.id}
                      className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs ${
                        isStrong ? 'ring-2 ring-xia-aqua/60 bg-xia-mint/50 font-bold text-xia-deep' :
                        isWeak ? 'bg-xia-sky/30 font-semibold text-xia-deep' :
                        'bg-xia-haze/30 text-xia-deep/70'
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

        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-12">
          {/* 主型解读 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">
              <Shield className="h-5 w-5 text-xia-teal" />
              <span>{profile.title}</span>
              <span className="rounded-full bg-xia-aqua/20 px-2 py-0.5 text-xs font-semibold text-xia-teal">类型解读</span>
            </h2>
            <div className="rounded-xl border border-xia-haze bg-xia-mint/20 p-4 shadow-sm sm:p-6">
              <p className="text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{profile.summary}</p>
              <p className="mt-2 text-sm font-medium text-xia-teal">{profile.coreNote}</p>
              <p className="mt-3 text-[10px] leading-relaxed text-xia-deep/60 sm:mt-4 sm:text-xs">
                本测验从边界清晰度、自我主张、敏感度、应对方式四个维度评估「易被欺负」程度。保护力（边界+主张+应对）越高越不易被欺负；敏感度越高越易感到受伤。仅供自我觉察，不用于诊断。
              </p>
            </div>

            {/* 风险等级解读 */}
            <div className="mt-4 rounded-xl border border-xia-haze bg-white p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-xia-teal sm:text-sm">{zoneInfo.title}（{zoneInfo.range}）</p>
              <p className="mt-2 text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{zoneInfo.analysis}</p>
              <p className="mt-2 text-xs font-medium text-xia-teal sm:text-sm">{zoneInfo.implication}</p>
            </div>

            {/* 最弱维度深度分析 */}
            {result.weakestDimension && result.weakestDimension.id !== 'sensitive' && (() => {
              const ext = VBT_DIMENSION_EXTENDED[result.weakestDimension.id]?.[result.weakestDimension.level]
              return ext ? (
                <div className="mt-4 space-y-3 rounded-xl border border-xia-haze bg-xia-cream/50 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-xia-teal sm:text-sm">最需关注：{result.weakestDimension.name}</p>
                  <div className="space-y-2 text-xs text-xia-deep/90 sm:text-sm">
                    <p><span className="font-medium text-xia-teal">分析说明：</span>{ext.method}</p>
                    <p><span className="font-medium text-xia-teal">行为倾向：</span>{ext.tendency}</p>
                    <p><span className="font-medium text-xia-teal">发展建议：</span>{ext.suggestion}</p>
                  </div>
                </div>
              ) : null
            })()}
          </section>

          {/* 四维雷达 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">
              <Scan className="h-4 w-4 sm:h-5 sm:w-5 text-xia-teal" />
              四维雷达
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

          {/* 保护力柱状图 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">保护力维度得分</h2>
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
                const levelConclusion = VBT_DIMENSION_BY_LEVEL[d.id]?.[d.level] ?? ''
                const isProtectDim = d.id !== 'sensitive'
                const isWeak = isProtectDim ? d.percent < 50 : d.percent >= 65
                const DimIcon = DIMENSION_ICONS[d.id]
                return (
                  <div
                    key={d.id}
                    className={`overflow-hidden rounded-xl border p-4 shadow-sm sm:p-5 ${
                      isWeak ? 'border-xia-sky/60 bg-xia-sky/15' : 'border-xia-haze bg-white'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-xia-deep">
                        <DimIcon className="h-5 w-5 text-xia-teal" />
                        {d.name}
                        {isWeak && isProtectDim && (
                          <span className="rounded-full bg-xia-sky/40 px-2 py-0.5 text-[10px] font-medium text-xia-teal">需加强</span>
                        )}
                      </h3>
                      <span className="text-sm font-bold text-xia-teal">
                        {d.percent}% · {getLevelLabel(d.id, d.level)}
                      </span>
                    </div>
                    <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-xia-haze/50">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${d.percent}%`,
                          backgroundColor: isProtectDim
                            ? (d.percent >= 70 ? 'rgb(var(--xia-teal))' : d.percent < 50 ? 'rgb(var(--xia-sky))' : 'rgb(var(--xia-aqua))')
                            : d.percent >= 65 ? 'rgb(var(--xia-sky))' : 'rgb(var(--xia-teal))',
                        }}
                      />
                    </div>
                    {levelConclusion && (
                      <div className="mb-2 flex gap-2 rounded-lg bg-xia-cream/50 px-3 py-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-xia-teal" />
                        <p className="text-xs font-medium text-xia-deep/90 sm:text-sm">{levelConclusion}</p>
                      </div>
                    )}
                    {VBT_DIMENSION_EXTENDED[d.id]?.[d.level]?.suggestion && (
                      <p className="mb-2 text-xs font-medium text-xia-teal sm:text-sm">
                        建议：{VBT_DIMENSION_EXTENDED[d.id][d.level].suggestion}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed text-xia-deep/80 sm:text-sm">{VBT_DIMENSION_INSIGHTS[d.id]}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 自我保护行动建议 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <ChevronRight className="h-4 w-4 text-xia-teal" />
              自我保护行动建议
            </h2>
            <ul className="space-y-2 rounded-xl border border-xia-haze bg-xia-mint/20 p-4 sm:p-5">
              {VBT_SELF_PROTECTION_TIPS[result.profileKey].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-xia-deep/90">
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-xia-aqua" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {/* 成长方向 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <TrendingUp className="h-4 w-4 text-xia-teal" />
              成长方向
            </h2>
            {(() => {
              const g = VBT_GROWTH_DIRECTIONS[result.profileKey]
              return g ? (
                <div className="rounded-xl border border-xia-haze bg-xia-cream/50 p-4 sm:p-5">
                  <p className="font-semibold text-xia-teal">{g.direction}</p>
                  <p className="mt-1 text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{g.reason}</p>
                </div>
              ) : null
            })()}
          </section>

          {/* 潜在注意点 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <AlertTriangle className="h-4 w-4 text-xia-teal" />
              潜在注意点
            </h2>
            {(() => {
              const c = VBT_CAUTIONS[result.profileKey]
              return c ? (
                <div className="rounded-xl border border-xia-sky/50 bg-xia-sky/15 p-4 sm:p-5">
                  <ul className="space-y-2">
                    {c.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-xia-deep/90 sm:text-sm">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-xia-sky" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            })()}
          </section>

          {/* 说明 */}
          <section>
            <div className="rounded-xl border border-xia-haze/50 bg-xia-cream/20 p-4 text-xs text-xia-deep/80 sm:text-sm">
              <p className="font-semibold text-xia-deep">说明</p>
              <p className="mt-2">
                本测验从边界清晰度、自我主张、敏感度、应对方式四个维度探索你在人际互动中的自我保护力。易被欺负指数综合了保护力与敏感度，值越高越需注意边界与自我主张。仅供自我觉察与参考，不用于诊断。若持续感到困扰，建议寻求专业心理咨询支持。
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-4 py-5 text-center text-[11px] text-xia-deep/50 sm:px-6 sm:py-6 sm:text-xs">
          <p>报告生成时间：{formatDate()}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-4">
            <Link to="/vbt" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回易被欺负测试</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
