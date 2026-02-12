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
import { calculateMPTResult } from '../../utils/mpt_scoring'
import { loadAnswers } from '../../utils/storage'
import { MPT_TEST_ID } from '../../data/mpt'
import {
  MPT_PROFILES,
  MPT_LEVEL_LABELS,
  MPT_DIMENSION_INSIGHTS,
  MPT_DIMENSION_BY_LEVEL,
  MPT_DIMENSION_BY_LEVEL_EXTENDED,
  MPT_RELATIONSHIP_TIPS,
  MPT_SCORE_PATTERN_INSIGHTS,
  MPT_GROWTH_DIRECTIONS,
  MPT_CAUTIONS,
  MPT_PARTNER_MATCH,
  getMPTProfileKey,
  getComboInsight,
} from '../../data/mpt_insights'
import { ChevronRight, Check, Scan, Heart, Flame, Sparkles, Compass, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import type { MPTDimensionId } from '../../data/mpt'
import type { LucideIcon } from 'lucide-react'

const DIMENSION_ICONS: Record<MPTDimensionId, LucideIcon> = {
  intimacy: Heart,
  passion: Flame,
  romance: Sparkles,
  explore: Compass,
}

const SUBJECT_SHORT: Record<MPTDimensionId, string> = {
  intimacy: '亲密',
  passion: '激情',
  romance: '浪漫',
  explore: '探索',
}

export default function MPTResult() {
  const answers = useMemo(() => loadAnswers(MPT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateMPTResult(answers), [answers])

  const totalQuestions = 68
  if (Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 {totalQuestions} 题后查看结果。</p>
        <Link className="rounded-xl bg-xia-deep px-5 py-2.5 text-sm font-medium text-white transition hover:bg-xia-teal" to="/mpt">
          返回亲密关系偏好测试
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const profileKey = getMPTProfileKey(result.primaryType, result.secondaryType)
  const profile = MPT_PROFILES[profileKey]
  const sorted = [...result.dimensionScores].sort((a, b) => b.percent - a.percent)
  const dominant = sorted[0]
  const PrimaryIcon = DIMENSION_ICONS[result.primaryType.id]

  const radarData = result.dimensionScores.map(d => ({
    subject: SUBJECT_SHORT[d.id],
    A: d.percent,
    fullMark: 100,
  }))
  const barData = sorted.map(d => ({
    name: d.name,
    score: d.percent,
    level: MPT_LEVEL_LABELS[d.level],
  }))

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 pb-10 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-xia-haze bg-white shadow-lg sm:rounded-3xl sm:shadow-xl">
        {/* 头部 */}
        <div className="relative overflow-hidden border-b border-xia-haze bg-gradient-to-br from-xia-mint/50 via-xia-cream/80 to-white px-4 py-8 sm:px-6 sm:py-10">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-xia-aqua/20 blur-2xl sm:h-64 sm:w-64 sm:blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-center gap-4 text-center sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-xia-mint/60 shadow-lg ring-2 ring-xia-aqua/60 sm:h-24 sm:w-24">
              <PrimaryIcon className="h-10 w-10 text-xia-teal sm:h-12 sm:w-12" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-xia-deep/50 sm:text-xs">
                MPT 亲密关系偏好 · 四维分析
              </p>
              <h1 className="mt-1.5 text-xl font-bold text-xia-deep sm:mt-2 sm:text-2xl md:text-3xl">
                你是{profile.title}
              </h1>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-xia-aqua/20 px-3 py-1.5 ring-1 ring-xia-teal/40">
                <span className="text-[10px] font-bold uppercase tracking-wide text-xia-teal sm:text-xs">主型</span>
                <span className="font-semibold text-xia-deep">{result.primaryType.name}</span>
                <span className="tabular-nums font-bold text-xia-teal">{result.primaryType.percent}%</span>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {result.secondaryType && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-xia-haze bg-white/80 px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-xs">
                    次型 {result.secondaryType.name} {result.secondaryType.percent}%
                  </span>
                )}
                {sorted[2] && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-xia-haze bg-white/60 px-2 py-1 text-[11px] text-xia-deep/70 sm:px-2.5 sm:text-xs">
                    {sorted[2].name}
                  </span>
                )}
              </div>
            </div>
            {/* 四维得分 */}
            <div className="mt-2 w-full max-w-sm rounded-xl border border-xia-haze/60 bg-white/80 p-3 sm:mt-4 sm:max-w-md sm:p-4">
              <p className="mb-2 text-[10px] font-semibold text-xia-deep/60 sm:text-xs">四维得分</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {result.dimensionScores.map(d => {
                  const DimIcon = DIMENSION_ICONS[d.id]
                  return (
                    <div
                      key={d.id}
                      className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs ${
                        d.id === result.primaryType.id
                          ? 'ring-2 ring-xia-aqua/60 bg-xia-mint/50 font-bold text-xia-deep'
                          : d.id === result.secondaryType?.id
                            ? 'bg-xia-haze/60 font-semibold text-xia-deep/90'
                            : 'bg-xia-haze/30 text-xia-deep/70'
                      }`}
                    >
                      {d.id === result.primaryType.id && (
                        <span className="shrink-0 rounded bg-xia-aqua/40 px-1 py-0.5 text-[8px] font-bold text-xia-teal sm:text-[9px]">主</span>
                      )}
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
              <PrimaryIcon className="h-5 w-5 text-xia-teal" />
              <span>{profile.title}</span>
              <span className="rounded-full bg-xia-aqua/20 px-2 py-0.5 text-xs font-semibold text-xia-teal">主型解读</span>
            </h2>
            <div className="rounded-xl border border-xia-haze bg-xia-mint/20 p-4 shadow-sm sm:p-6">
              <p className="text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{profile.summary}</p>
              <p className="mt-2 text-sm font-medium text-xia-teal">{profile.dominantNote}</p>
              <p className="mt-3 text-[10px] leading-relaxed text-xia-deep/60 sm:mt-4 sm:text-xs">
                本测验从亲密、激情、浪漫、探索四个维度评估亲密关系偏好，68 题五选一。主型为得分最高维度，次型为第二高。仅供成年人自我觉察，不用于诊断。
              </p>
            </div>

            {/* 得分分布特征 */}
            {(() => {
              const patternInfo = MPT_SCORE_PATTERN_INSIGHTS[result.scorePattern]
              return patternInfo ? (
                <div className="mt-4 rounded-xl border border-xia-haze bg-white p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-xia-teal sm:text-sm">{patternInfo.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{patternInfo.analysis}</p>
                  <p className="mt-2 text-xs font-medium text-xia-teal sm:text-sm">{patternInfo.implication}</p>
                </div>
              ) : null
            })()}

            {/* 主次型组合深度解读 */}
            {result.secondaryType && (() => {
              const combo = getComboInsight(result.primaryType.id, result.secondaryType.id)
              return combo ? (
                <div className="mt-4 rounded-xl border border-xia-haze bg-xia-mint/20 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-xia-teal sm:text-sm">主次型组合解读</p>
                  <p className="mt-2 text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{combo}</p>
                </div>
              ) : null
            })()}

            {/* 主型深度分析方法 */}
            {(() => {
              const ext = MPT_DIMENSION_BY_LEVEL_EXTENDED[result.primaryType.id]?.[result.primaryType.level]
              return ext ? (
                <div className="mt-4 space-y-3 rounded-xl border border-xia-haze bg-xia-cream/50 p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-xia-teal sm:text-sm">主型分析方法</p>
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

          {/* 四维柱状图 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">四维得分</h2>
            <div className="h-44 rounded-xl border border-xia-haze bg-white p-3 sm:h-52 sm:rounded-2xl sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 4, right: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 11 }} />
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
                const levelConclusion = MPT_DIMENSION_BY_LEVEL[d.id]?.[d.level] ?? ''
                const isDominant = dominant?.id === d.id
                const DimIcon = DIMENSION_ICONS[d.id]
                return (
                  <div
                    key={d.id}
                    className={`overflow-hidden rounded-xl border p-4 shadow-sm sm:p-5 ${
                      isDominant ? 'border-xia-aqua/60 bg-xia-mint/30' : 'border-xia-haze bg-white'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-xia-deep">
                        <DimIcon className="h-5 w-5 text-xia-teal" />
                        {d.name}
                        {isDominant && (
                          <span className="rounded-full bg-xia-aqua/30 px-2 py-0.5 text-[10px] font-medium text-xia-teal">主导型</span>
                        )}
                      </h3>
                      <span className="text-sm font-bold text-xia-teal">
                        {d.percent}% · {MPT_LEVEL_LABELS[d.level]}
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
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-xia-teal" />
                        <p className="text-xs font-medium text-xia-deep/90 sm:text-sm">{levelConclusion}</p>
                      </div>
                    )}
                    {MPT_DIMENSION_BY_LEVEL_EXTENDED[d.id]?.[d.level]?.suggestion && (
                      <p className="mb-2 text-xs font-medium text-xia-teal sm:text-sm">
                        建议：{MPT_DIMENSION_BY_LEVEL_EXTENDED[d.id][d.level].suggestion}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed text-xia-deep/80 sm:text-sm">{MPT_DIMENSION_INSIGHTS[d.id]}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 亲密关系建议 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <ChevronRight className="h-4 w-4 text-xia-teal" />
              亲密关系建议
            </h2>
            <ul className="space-y-2 rounded-xl border border-xia-haze bg-xia-mint/20 p-4 sm:p-5">
              {MPT_RELATIONSHIP_TIPS[profileKey].map((tip, i) => (
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
              const g = MPT_GROWTH_DIRECTIONS[profileKey]
              return g ? (
                <div className="rounded-xl border border-xia-haze bg-xia-cream/50 p-4 sm:p-5">
                  <p className="font-semibold text-xia-teal">{g.direction}</p>
                  <p className="mt-1 text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{g.reason}</p>
                  <ul className="mt-3 space-y-1.5">
                    {g.actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-xia-deep/90 sm:text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-xia-teal" />
                        {a}
                      </li>
                    ))}
                  </ul>
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
              const c = MPT_CAUTIONS[profileKey]
              return c ? (
                <div className="rounded-xl border border-xia-sky/50 bg-xia-sky/15 p-4 sm:p-5">
                  <p className="font-semibold text-xia-teal">{c.title}</p>
                  <ul className="mt-2 space-y-2">
                    {c.points.map((p, i) => (
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

          {/* 伴侣匹配与沟通 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <Users className="h-4 w-4 text-xia-teal" />
              伴侣匹配与沟通
            </h2>
            {(() => {
              const pm = MPT_PARTNER_MATCH[profileKey]
              return pm ? (
                <div className="rounded-xl border border-xia-haze bg-xia-cream/50 p-4 sm:p-5">
                  <p className="text-xs font-semibold text-xia-teal sm:text-sm">匹配建议</p>
                  <p className="mt-1 text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{pm.match}</p>
                  <p className="mt-3 text-xs font-semibold text-xia-teal sm:text-sm">沟通建议</p>
                  <ul className="mt-1 space-y-1">
                    {pm.communicate.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-xia-deep/90 sm:text-sm">
                        <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-xia-aqua" />
                        {item}
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
                本测验从亲密、激情、浪漫、探索四个维度探索你在亲密关系中的偏好。仅供成年人自我觉察与参考，不用于诊断。请在安全与相互尊重的前提下与伴侣沟通偏好与边界。
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-4 py-5 text-center text-[11px] text-xia-deep/50 sm:px-6 sm:py-6 sm:text-xs">
          <p>报告生成时间：{formatDate()}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-4">
            <Link to="/mpt" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回亲密关系偏好测试</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
