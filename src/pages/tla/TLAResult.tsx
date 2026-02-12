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
import { calculateTLAResult } from '../../utils/tla_scoring'
import { loadAnswers } from '../../utils/storage'
import { TLA_TEST_ID } from '../../data/tla'
import {
  TLA_DIMENSION_INSIGHTS,
  TLA_DIMENSION_CUTE,
  TLA_PROFILE_SHORT,
  getTLAProfileKey,
} from '../../data/tla_insights'
import { Heart, Sparkles } from 'lucide-react'

export default function TLAResult() {
  const answers = useMemo(() => loadAnswers(TLA_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateTLAResult(answers), [answers])

  const totalQuestions = 52
  if (!answers || Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 52 题后查看结果～</p>
        <Link className="rounded-2xl bg-pink-300/80 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pink-400" to="/tla">
          返回年上年下恋爱测试
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const topTwo = [...result.dimensionScores].sort((a, b) => b.percent - a.percent).slice(0, 2)
  const profileKey = getTLAProfileKey(topTwo)
  const profileDesc = TLA_PROFILE_SHORT[profileKey] ?? TLA_PROFILE_SHORT.default

  const radarData = result.dimensionScores.map(d => ({
    subject: d.name,
    A: d.percent,
    fullMark: 100,
  }))
  const barData = [...result.dimensionScores]
    .sort((a, b) => b.percent - a.percent)
    .map(d => ({
      name: TLA_DIMENSION_CUTE[d.id]?.label ?? d.name,
      score: d.percent,
    }))

  return (
    <div className="mx-auto max-w-4xl animate-fade-in pb-10">
      <div className="overflow-hidden rounded-3xl border-2 border-pink-200/60 bg-white shadow-xl shadow-pink-100/50">
        {/* 可爱头部 */}
        <div className="relative overflow-hidden border-b border-pink-100">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/80 via-rose-50/90 to-amber-50/70" />
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-pink-200/40 blur-3xl" aria-hidden />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-200/40 blur-2xl" aria-hidden />
          <div className="relative px-6 py-10 sm:px-12 sm:py-12">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-lg ring-4 ring-pink-200/50 sm:h-28 sm:w-28">
                <Heart className="h-12 w-12 fill-pink-400 text-pink-400 sm:h-14 sm:w-14" />
              </div>
              <div className="text-center sm:text-left">
                <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-pink-600/80 sm:justify-start">
                  <Sparkles className="h-4 w-4" />
                  TLA 年上年下恋爱测试
                </p>
                <h1 className="mt-2 text-2xl font-bold text-rose-800 sm:text-3xl">你的恋爱偏好报告</h1>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {topTwo.map((d, i) => (
                    <span
                      key={d.id}
                      className="inline-flex items-center gap-1 rounded-full bg-pink-200/50 px-3 py-1 text-sm font-medium text-rose-700"
                    >
                      <span>{TLA_DIMENSION_CUTE[d.id]?.emoji ?? '❤️'}</span>
                      {TLA_DIMENSION_CUTE[d.id]?.label ?? d.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-12">
          {/* 恋爱画像：可爱结论卡片 */}
          <section className="mb-10">
            <div className="overflow-hidden rounded-2xl border-2 border-pink-200/60 bg-gradient-to-br from-pink-50 to-rose-50/50 p-6 shadow-lg shadow-pink-100/30">
              <div className="flex items-start gap-4">
                <span className="text-4xl">💗</span>
                <div>
                  <h2 className="text-lg font-bold text-rose-800">你的恋爱画像</h2>
                  <p className="mt-2 text-base leading-relaxed text-rose-700/90">{profileDesc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 恋爱偏好雷达 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-rose-800">
              <span>🌈</span>
              恋爱偏好雷达
            </h2>
            <div className="h-72 w-full overflow-hidden rounded-2xl border-2 border-pink-100 bg-white/80 p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgb(253 164 175)" strokeOpacity={0.5} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: 'rgb(190 18 60)' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                  <Radar
                    name="偏好强度"
                    dataKey="A"
                    stroke="rgb(244 63 94)"
                    fill="rgb(244 63 94)"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, '偏好']}
                    contentStyle={{ borderRadius: 12, borderColor: 'rgb(253 164 175)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 四维得分 */}
          <section className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-rose-800">
              <span>📊</span>
              四维得分
            </h2>
            <div className="h-56 w-full overflow-hidden rounded-2xl border-2 border-pink-100 bg-white/80 p-4 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 16, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(253 164 175)" strokeOpacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'rgb(190 18 60)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, '得分']}
                    contentStyle={{ borderRadius: 12, borderColor: 'rgb(253 164 175)' }}
                  />
                  <Bar dataKey="score" fill="rgb(244 63 94)" fillOpacity={0.8} radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 维度解读：可爱卡片 */}
          <section className="mb-10">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-rose-800">
              <span>💌</span>
              维度解读
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.dimensionScores.map(d => {
                const cute = TLA_DIMENSION_CUTE[d.id]
                const isTop = topTwo.some(t => t.id === d.id)
                return (
                  <div
                    key={d.id}
                    className={`overflow-hidden rounded-2xl border-2 p-5 shadow-md transition hover:shadow-lg ${
                      isTop ? 'border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50' : 'border-pink-100 bg-white'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-semibold text-rose-800">
                        <span className="text-xl">{cute?.emoji ?? '❤️'}</span>
                        {d.name}
                        {isTop && <span className="rounded-full bg-pink-300/50 px-2 py-0.5 text-xs">偏好较高</span>}
                      </h3>
                      <span className="font-bold text-rose-600">{d.percent}%</span>
                    </div>
                    <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-pink-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all"
                        style={{ width: `${d.percent}%` }}
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-rose-700/85">{TLA_DIMENSION_INSIGHTS[d.id]}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 温馨提示 */}
          <section>
            <div className="rounded-2xl border border-pink-200/50 bg-pink-50/50 px-5 py-4 text-sm text-rose-700/80">
              <p>💝 恋爱偏好因人而异，没有对错～这份报告帮你更好地了解自己，在关系中做真实的自己就好啦！</p>
            </div>
          </section>
        </div>

        <div className="border-t border-pink-100 bg-pink-50/30 px-6 py-6 sm:px-12 text-center text-xs text-rose-600/70">
          <p>报告生成时间：{formatDate()} · 年上年下恋爱测试</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              to="/tla"
              className="inline-block rounded-full bg-pink-300/70 px-5 py-2 text-sm font-medium text-rose-800 transition hover:bg-pink-400"
            >
              返回测验
            </Link>
            <Link to="/" className="text-sm font-medium text-rose-600 underline-offset-2 hover:text-rose-800">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
