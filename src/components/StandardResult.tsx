import { ReactNode } from 'react'
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

type StandardResultProps = {
  totalQuestions: number
  answeredCount: number
  backPath: string
  backLabel: string
  title: string
  subtitle?: string
  headerExtra?: ReactNode
  dimensionScores: { id: string; name: string; percent: number }[]
  insights: Record<string, string>
}

export default function StandardResult({
  totalQuestions,
  answeredCount,
  backPath,
  backLabel,
  title,
  subtitle,
  headerExtra,
  dimensionScores,
  insights,
}: StandardResultProps) {
  if (answeredCount < totalQuestions) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="text-lg font-medium text-xia-deep">尚未完成测验</div>
        <p className="text-sm text-xia-teal">请完成全部 {totalQuestions} 题后查看结果。</p>
        <Link className="rounded-lg bg-xia-deep px-4 py-2 text-sm text-white transition hover:bg-xia-teal" to={backPath}>
          返回{backLabel}
        </Link>
      </div>
    )
  }

  const formatDate = () =>
    new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

  const radarData = dimensionScores.map(d => ({ subject: d.name, A: d.percent, fullMark: 100 }))
  const barData = [...dimensionScores].sort((a, b) => b.percent - a.percent).map(d => ({ name: d.name, score: d.percent }))

  return (
    <div className="mx-auto max-w-4xl animate-fade-in pb-10">
      <div className="rounded-3xl border border-xia-haze bg-white shadow-xl ring-1 ring-xia-haze/30">
        <div className="rounded-t-3xl border-b border-xia-haze overflow-hidden">
          <div className="relative px-6 py-10 sm:px-12 sm:py-12">
            <div className="absolute inset-0 bg-gradient-to-br from-xia-mint/25 via-xia-cream/40 to-white" />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-widest text-xia-deep/50">{title}</p>
              <p className="mt-2 text-2xl font-bold text-xia-deep sm:text-3xl">{subtitle ?? '分析报告'}</p>
              {headerExtra}
            </div>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-12">
          {dimensionScores.length > 0 && (
            <>
              <section className="mb-10">
                <h2 className="mb-4 text-lg font-bold text-xia-deep">维度雷达</h2>
                <div className="h-72 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgb(var(--xia-haze))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                      <Radar name="得分" dataKey="A" stroke="rgb(var(--xia-teal))" fill="rgb(var(--xia-teal))" fillOpacity={0.35} strokeWidth={2} />
                      <Tooltip formatter={(v: number) => [`${v}%`, '得分']} contentStyle={{ borderRadius: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="mb-4 text-lg font-bold text-xia-deep">维度得分</h2>
                <div className="h-56 w-full rounded-2xl border border-xia-haze bg-white p-4 shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 4, right: 16, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={(v: number) => [`${v}%`, '得分']} />
                      <Bar dataKey="score" fill="rgb(var(--xia-teal))" radius={[4, 4, 0, 0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="mb-6 text-lg font-bold text-xia-deep">维度解读</h2>
                <div className="space-y-4">
                  {dimensionScores.map(d => (
                    <div key={d.id} className="rounded-xl border border-xia-haze bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold text-xia-deep">{d.name}</h3>
                        <span className="text-sm font-bold text-xia-teal">{d.percent}%</span>
                      </div>
                      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-xia-haze/50">
                        <div className="h-full rounded-full bg-xia-teal" style={{ width: `${d.percent}%` }} />
                      </div>
                      <p className="text-sm leading-relaxed text-xia-deep/80">{insights[d.id] ?? ''}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        <div className="border-t border-xia-haze bg-xia-cream/20 px-6 py-6 sm:px-12 text-center text-xs text-xia-deep/50">
          <p>报告生成时间：{formatDate()}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link to={backPath} className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">
              返回测验
            </Link>
            <span className="text-xia-haze">·</span>
            <Link to="/" className="text-sm font-medium text-xia-teal underline-offset-2 hover:text-xia-deep">
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
