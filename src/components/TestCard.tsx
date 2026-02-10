import { Link } from 'react-router-dom'

type TestCardProps = {
  title: string
  subtitle: string
  description: string
  to: string
  iconUrl: string
  iconAlt: string
  iconBg: string
  backgroundClass?: string
  duration?: string
  questionCount?: number
}

export default function TestCard({
  title,
  subtitle,
  description,
  to,
  iconUrl,
  iconAlt,
  iconBg,
  backgroundClass,
  duration,
  questionCount,
}: TestCardProps) {
  const totalQuestions = questionCount ?? 0
  const metaText =
    totalQuestions > 0 && duration
      ? `${totalQuestions}题 · ${duration}`
      : totalQuestions > 0
        ? `${totalQuestions}题`
        : duration
          ? duration
          : null

  return (
    <Link
      to={to}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md ${backgroundClass ?? 'bg-white'}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white/60 to-slate-50 opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative mb-5 flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} shadow-sm transition duration-300 group-hover:scale-105`}
        >
          <img
            src={iconUrl}
            alt={iconAlt}
            className="h-7 w-7 animate-float"
            loading="lazy"
          />
        </div>
        <div className="rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {subtitle}
        </div>
      </div>
      <div className="relative text-xl font-semibold text-slate-900">{title}</div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
      {metaText ? (
        <div className="mt-4 inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-600">
          {metaText}
        </div>
      ) : null}
      <div className="relative mt-auto pt-6 text-sm font-medium text-slate-900">
        开始测评 →
      </div>
    </Link>
  )
}
