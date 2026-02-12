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
import { calculateYBTResult } from '../../utils/ybt_scoring'
import { loadAnswers } from '../../utils/storage'
import { YBT_TEST_ID } from '../../data/ybt'
import {
  YBT_PROFILES,
  YBT_LEVEL_LABELS,
  YBT_DIMENSION_INSIGHTS,
  YBT_DIMENSION_BY_LEVEL,
  YBT_RELATIONSHIP_TIPS,
  getYBTProfileKey,
} from '../../data/ybt_insights'
import type { YBTProfileKey } from '../../data/ybt_insights'
import type { YBTDimensionId } from '../../data/ybt'
import { ChevronRight, Scan, Lightbulb, Check } from 'lucide-react'

// 病娇图片：按拼音匹配 Profile 类型
import imgWenhe from '../../assets/bingjiao/wenhe.jpg'
import imgZhanyouxing from '../../assets/bingjiao/zhanyouxing.jpg'
import imgKongzhixing from '../../assets/bingjiao/kongzhixing.jpg'
import imgYilaixing from '../../assets/bingjiao/yilaixing.jpg'
import imgQianzaibinjiaoqinxiao from '../../assets/bingjiao/qianzaibinjiaoqinxiao.jpg'
import imgJingjuexing from '../../assets/bingjiao/jingjuexing.jpg'
import imgJunhengxin from '../../assets/bingjiao/junhengxin.jpg'
// 病娇图片：按拼音匹配维度
import imgZhanyouyu from '../../assets/bingjiao/zhanyouyu.jpg'
import imgKongzhiyu from '../../assets/bingjiao/kongzhiyu.jpg'
import imgYilaidu from '../../assets/bingjiao/yilaidu.jpg'
import imgJiduanqinxiang from '../../assets/bingjiao/jiduanqinxiang.jpg'

const PROFILE_IMAGES: Record<YBTProfileKey, string> = {
  gentle: imgWenhe,
  possessive: imgZhanyouxing,
  controlling: imgKongzhixing,
  dependent: imgYilaixing,
  extreme_risk: imgQianzaibinjiaoqinxiao,
  extreme_only: imgJingjuexing,
  balanced: imgJunhengxin,
}

const DIMENSION_IMAGES: Record<YBTDimensionId, string> = {
  possess: imgZhanyouyu,
  control: imgKongzhiyu,
  depend: imgYilaidu,
  extreme: imgJiduanqinxiang,
}

export default function YBTResult() {
  const answers = useMemo(() => loadAnswers(YBT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateYBTResult(answers), [answers])

  const totalQuestions = 40
  if (!answers || Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 px-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 {totalQuestions} 题后查看结果。</p>
        <Link className="rounded-xl bg-xia-deep px-5 py-2.5 text-sm font-medium text-white transition hover:bg-xia-teal" to="/ybt">
          返回病娇测试
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const profileKey = getYBTProfileKey(result.dimensionScores)
  const profile = YBT_PROFILES[profileKey]
  const profileImage = PROFILE_IMAGES[profileKey]
  const sorted = [...result.dimensionScores].sort((a, b) => b.percent - a.percent)
  const dominant = sorted[0]

  const radarData = result.dimensionScores.map(d => ({
    subject: d.name,
    A: d.percent,
    fullMark: 100,
  }))
  const barData = sorted.map(d => ({
    name: d.name,
    score: d.percent,
    level: YBT_LEVEL_LABELS[d.level],
  }))

  const isRiskProfile = profileKey === 'extreme_risk' || profileKey === 'extreme_only'

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 pb-10 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-xia-haze bg-white shadow-lg sm:rounded-3xl sm:shadow-xl">
        {/* 头部：手机优先 */}
        <div className="relative overflow-hidden border-b border-xia-haze bg-gradient-to-br from-rose-50/80 via-xia-cream/50 to-white px-4 py-8 sm:px-6 sm:py-10">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-rose-200/30 blur-2xl sm:h-56 sm:w-56" aria-hidden />
          <div className="relative flex flex-col items-center gap-4 text-center sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white/95 shadow-lg ring-2 ring-rose-200/60 sm:h-24 sm:w-24">
              <img src={profileImage} alt={profile.title} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-xia-deep/50 sm:text-xs">
                YBT 病娇测试 · 恋爱占有倾向
              </p>
              <h1 className="mt-1.5 text-xl font-bold text-xia-deep sm:mt-2 sm:text-2xl md:text-3xl">
                {profile.title}
              </h1>
              <p className="mt-1 text-xs text-xia-deep/70 sm:text-sm">
                四维均分 {result.avgPercent}% · 总分 {result.totalScore}/{result.maxTotalScore}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6 sm:py-8">
          {/* 综合结论卡片 */}
          <section className="mb-8 sm:mb-10">
            <div
              className={`overflow-hidden rounded-xl border-2 p-4 shadow-sm sm:p-6 ${
                isRiskProfile
                  ? 'border-rose-300/60 bg-gradient-to-br from-rose-50/90 to-amber-50/50'
                  : 'border-rose-200/60 bg-gradient-to-br from-rose-50/60 to-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 overflow-hidden rounded-xl sm:h-14 sm:w-14">
                  <img src={profileImage} alt={profile.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-xia-deep sm:text-lg">{profile.title} · 综合结论</h2>
                  <p className="mt-2 text-sm leading-relaxed text-xia-deep/90 sm:text-base">{profile.summary}</p>
                  <p className="mt-2 text-sm font-medium text-rose-700/90">{profile.dominantNote}</p>
                  <div className="mt-2 flex gap-2 rounded-lg bg-white/60 px-3 py-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <p className="text-xs text-xia-deep/80 sm:text-sm">{profile.advice}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 四维雷达 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">
              <Scan className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
              四维雷达
            </h2>
            <div className="h-64 rounded-xl border border-xia-haze bg-white p-3 sm:h-72 sm:rounded-2xl sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgb(var(--xia-haze))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'rgb(var(--xia-teal))' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                  <Radar
                    name="得分"
                    dataKey="A"
                    stroke="rgb(190 18 60)"
                    fill="rgb(190 18 60)"
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
            <div className="h-52 rounded-xl border border-xia-haze bg-white p-3 sm:h-60 sm:rounded-2xl sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 4, right: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={56} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(v: number, _: unknown, props: { payload?: { level?: string } }) => [`${v}% (${props.payload?.level ?? ''})`, '得分']}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={18} fill="rgb(190 18 60)" fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 维度解读：按等级细化 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 text-base font-bold text-xia-deep sm:mb-6 sm:text-lg">维度解读</h2>
            <div className="space-y-4">
              {result.dimensionScores.map(d => {
                const levelConclusion = YBT_DIMENSION_BY_LEVEL[d.id]?.[d.level] ?? ''
                const isDominant = dominant?.id === d.id
                const dimImage = DIMENSION_IMAGES[d.id]
                return (
                  <div
                    key={d.id}
                    className={`overflow-hidden rounded-xl border p-4 shadow-sm sm:p-5 ${
                      isDominant ? 'border-rose-200 bg-rose-50/40' : 'border-xia-haze bg-white'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-xia-deep">
                        <img src={dimImage} alt={d.name} className="h-8 w-8 rounded-lg object-cover sm:h-9 sm:w-9" />
                        {d.name}
                        {isDominant && (
                          <span className="rounded-full bg-rose-200/60 px-2 py-0.5 text-[10px] font-medium text-rose-800">最高维度</span>
                        )}
                      </h3>
                      <span className="text-sm font-bold text-xia-teal">
                        {d.percent}% · {YBT_LEVEL_LABELS[d.level]}
                      </span>
                    </div>
                    <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-xia-haze/50">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${d.percent}%`,
                          backgroundColor: d.level === 'high' ? 'rgb(190 18 60)' : 'rgb(var(--xia-teal))',
                        }}
                      />
                    </div>
                    {levelConclusion && (
                      <div className="mb-2 flex gap-2 rounded-lg bg-xia-cream/50 px-3 py-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-xia-teal" />
                        <p className="text-xs font-medium text-xia-deep/90 sm:text-sm">{levelConclusion}</p>
                      </div>
                    )}
                    <p className="text-xs leading-relaxed text-xia-deep/80 sm:text-sm">{YBT_DIMENSION_INSIGHTS[d.id]}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 恋爱建议 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-xia-deep sm:text-lg">
              <ChevronRight className="h-4 w-4 text-rose-600" />
              恋爱建议
            </h2>
            <ul className="space-y-2 rounded-xl border border-rose-100 bg-rose-50/30 p-4 sm:p-5">
              {YBT_RELATIONSHIP_TIPS[profileKey].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-xia-deep/90">
                  <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-rose-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {/* 说明 */}
          <section>
            <div className="rounded-xl border border-xia-haze/50 bg-xia-cream/20 p-4 text-xs text-xia-deep/80 sm:text-sm">
              <p className="font-semibold text-xia-deep">说明</p>
              <p className="mt-2">
                病娇测试从占有欲、控制欲、依赖度、极端倾向四个维度探索恋爱中的倾向。本测验仅供娱乐与自我觉察，不用于诊断。若结果令你困扰，建议咨询专业心理咨询师。
              </p>
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-4 py-5 text-center text-[11px] text-xia-deep/50 sm:px-6 sm:py-6 sm:text-xs">
          <p>报告生成时间：{formatDate()}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-4">
            <Link to="/ybt" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回病娇测试</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
