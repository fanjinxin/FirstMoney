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
} from 'recharts'
import { calculateFFTResult } from '../../utils/fft_scoring'
import { loadAnswers } from '../../utils/storage'
import { FFT_TEST_ID } from '../../data/fft'
import { FFT_FRUIT_INSIGHTS, FFT_FRUIT_EMOJI } from '../../data/fft_insights'

const FRUIT_COLORS: Record<string, string> = {
  apple: '#e74c3c',
  grape: '#9b59b6',
  strawberry: '#e91e63',
  orange: '#f39c12',
  lemon: '#f1c40f',
  banana: '#f4d03f',
  pear: '#2ecc71',
  cherry: '#c0392b',
  pomelo: '#27ae60',
}

export default function FFTResult() {
  const answers = useMemo(() => loadAnswers(FFT_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateFFTResult(answers), [answers])

  const totalQuestions = 54
  if (Object.keys(answers).length < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 {totalQuestions} 题后查看结果。</p>
        <Link className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white" to="/fft">返回水果塑形测试</Link>
      </div>
    )
  }

  const sorted = [...result.dimensionScores].sort((a, b) => b.percent - a.percent)
  const primary = result.primaryFruit
  const secondary = sorted[1]
  const tertiary = sorted[2]

  const radarData = result.dimensionScores.map(d => ({
    subject: d.name.replace('型', ''),
    A: d.percent,
    fullMark: 100,
    id: d.id,
  }))
  const barData = sorted.map(d => ({
    name: `${FFT_FRUIT_EMOJI[d.id] ?? ''} ${d.name}`,
    score: d.percent,
    id: d.id,
  }))

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="mx-auto max-w-4xl animate-fade-in px-4 pb-10 sm:px-6">
      <div className="overflow-hidden rounded-2xl border border-xia-haze bg-white shadow-lg sm:rounded-3xl sm:shadow-xl">
        {/* 头部：手机优先纵向居中 */}
        <div className="relative overflow-hidden border-b border-xia-haze bg-gradient-to-br from-xia-mint/25 via-xia-cream/40 to-white px-4 py-8 sm:px-6 sm:py-10">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full bg-xia-teal/8 blur-2xl sm:h-64 sm:w-64 sm:blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-center gap-4 text-center sm:gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/95 text-4xl shadow-lg ring-2 ring-xia-teal/20 sm:h-24 sm:w-24 sm:text-5xl">
              {FFT_FRUIT_EMOJI[primary.id] ?? '🍎'}
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-xia-deep/50 sm:text-xs">FFT 水果塑形 · 九型人格</p>
              <h1 className="mt-1.5 text-xl font-bold text-xia-deep sm:mt-2 sm:text-2xl md:text-3xl">
                你是{primary.name}人格
              </h1>
              <p className="mt-1 text-xs text-xia-deep/70 sm:text-sm">
                主型 {primary.percent}% · {primary.rawScore}/{primary.maxScore}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {secondary && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-xia-haze bg-white/80 px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:text-xs">
                    {FFT_FRUIT_EMOJI[secondary.id]} 次型 {secondary.name} {secondary.percent}%
                  </span>
                )}
                {tertiary && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-xia-haze bg-white/60 px-2 py-1 text-[11px] text-xia-deep/70 sm:px-2.5 sm:text-xs">
                    {FFT_FRUIT_EMOJI[tertiary.id]} {tertiary.name}
                  </span>
                )}
              </div>
            </div>
            {/* 九型得分：紧贴下方，3 列适配小屏 */}
            <div className="mt-2 w-full max-w-sm rounded-xl border border-xia-haze/60 bg-white/80 p-3 sm:mt-4 sm:max-w-md sm:p-4">
              <p className="mb-2 text-[10px] font-semibold text-xia-deep/60 sm:text-xs">九型得分</p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {result.dimensionScores.map(d => (
                  <div
                    key={d.id}
                    className={`flex items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] sm:px-2 sm:py-1.5 sm:text-xs ${
                      d.id === primary.id ? 'bg-xia-teal/15 font-semibold text-xia-deep' :
                      d.id === secondary?.id ? 'bg-xia-mint/20 text-xia-deep/90' :
                      'bg-xia-haze/30 text-xia-deep/70'
                    }`}
                  >
                    <span className="shrink-0">{FFT_FRUIT_EMOJI[d.id]}</span>
                    <span className="min-w-0 truncate">{d.name.replace('型', '')}</span>
                    <span className="ml-auto shrink-0 tabular-nums font-medium">{d.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-12">
          {/* 主型解读 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">
              <span>{FFT_FRUIT_EMOJI[primary.id]}</span>
              {primary.name}解读
            </h2>
            <div className="rounded-xl border border-xia-mint/50 bg-xia-mint/10 p-4 shadow-sm sm:p-6">
              <p className="text-xs leading-relaxed text-xia-deep/90 sm:text-sm">{FFT_FRUIT_INSIGHTS[primary.id]}</p>
              <p className="mt-3 text-[10px] leading-relaxed text-xia-deep/60 sm:mt-4 sm:text-xs">
                本测验基于情境选择法，54 题三选一。主型为得分最高维度，次型为第二高。结果仅供自我觉察，不构成专业心理评估。
              </p>
            </div>
          </section>

          {/* 九维雷达 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">九维雷达</h2>
            <div className="h-64 rounded-xl border border-xia-haze bg-white p-3 sm:h-80 sm:rounded-2xl sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgb(var(--xia-haze))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: 'rgb(var(--xia-teal))' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 8 }} tickFormatter={v => `${v}%`} />
                  <Radar name="倾向" dataKey="A" stroke="rgb(var(--xia-teal))" fill="rgb(var(--xia-teal))" fillOpacity={0.35} strokeWidth={2} />
                  <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 九型柱状图 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-3 text-base font-bold text-xia-deep sm:mb-4 sm:text-lg">九型得分</h2>
            <div className="h-60 rounded-xl border border-xia-haze bg-white p-3 sm:h-72 sm:rounded-2xl sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 4, right: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9 }} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={72} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                    {barData.map((entry) => (
                      <Cell key={entry.id} fill={FRUIT_COLORS[entry.id] ?? 'rgb(var(--xia-teal))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 九型概览：手机单列 */}
          <section className="mb-8 sm:mb-10">
            <h2 className="mb-4 text-base font-bold text-xia-deep sm:mb-6 sm:text-lg">九型概览</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {result.dimensionScores.map(d => {
                const isPrimary = d.id === primary.id
                const isSecondary = d.id === secondary?.id
                return (
                  <div
                    key={d.id}
                    className={`rounded-xl border p-3 shadow-sm sm:p-4 ${
                      isPrimary ? 'border-xia-teal bg-xia-teal/10' : isSecondary ? 'border-xia-mint bg-xia-mint/10' : 'border-xia-haze bg-white'
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between sm:mb-2">
                      <span className="text-xl sm:text-2xl">{FFT_FRUIT_EMOJI[d.id]}</span>
                      <div className="flex items-center gap-1.5">
                        {isPrimary && <span className="rounded bg-xia-teal/20 px-1.5 py-0.5 text-[9px] font-semibold text-xia-teal sm:text-[10px]">主型</span>}
                        {isSecondary && <span className="rounded bg-xia-mint/30 px-1.5 py-0.5 text-[9px] font-semibold text-xia-teal sm:text-[10px]">次型</span>}
                        <span className="text-sm font-bold text-xia-deep sm:text-base">{d.percent}%</span>
                      </div>
                    </div>
                    <h3 className="text-xs font-semibold text-xia-deep sm:text-sm">{d.name}</h3>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-xia-haze/50 sm:mt-1.5 sm:h-1.5">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${d.percent}%`, backgroundColor: FRUIT_COLORS[d.id] ?? 'rgb(var(--xia-teal))' }}
                      />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-xia-deep/75 sm:mt-2 sm:line-clamp-3 sm:text-xs">{FFT_FRUIT_INSIGHTS[d.id]}</p>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-4 py-5 text-center text-[11px] text-xia-deep/50 sm:px-6 sm:py-6 sm:text-xs md:px-12">
          <p>报告生成时间：{formatDate()}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-4">
            <Link to="/fft" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回测验</Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-xs font-medium text-xia-teal hover:text-xia-deep sm:text-sm">返回首页</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
