import { Link, useNavigate } from 'react-router-dom'
import { fillSampleAnswers } from '../utils/testSample'

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
  /** 测试阶段：结果页路径，与 testId 同时传入时显示「测试：直接看结果」按钮 */
  resultTo?: string
  /** 测试阶段：测评 id，用于填充示例答案 */
  testId?: 'scl90' | 'rpi' | 'sri' | 'animal'
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
  resultTo,
  testId,
}: TestCardProps) {
  const navigate = useNavigate()
  const totalQuestions = questionCount ?? 0
  const metaText =
    totalQuestions > 0 && duration
      ? `${totalQuestions}题 · ${duration}`
      : totalQuestions > 0
        ? `${totalQuestions}题`
        : duration
          ? duration
          : null

  const showTestJump = resultTo && testId

  const handleTestJump = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!testId || !resultTo) return
    fillSampleAnswers(testId)
    navigate(resultTo)
  }

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-xia-haze p-4 shadow-sm transition hover:-translate-y-1 hover:border-xia-teal/30 hover:shadow-md sm:p-6 ${backgroundClass ?? 'bg-white'}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white/60 to-xia-cream/30 opacity-0 transition duration-300 group-hover:opacity-100" />
      <Link to={to} className="relative flex flex-1 flex-col focus:outline-none">
        <div className="relative mb-4 flex items-center justify-between sm:mb-5">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg} shadow-sm transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12`}
          >
            <img
              src={iconUrl}
              alt={iconAlt}
              className="h-6 w-6 animate-float sm:h-7 sm:w-7"
              loading="lazy"
            />
          </div>
          <div className="rounded-full bg-xia-deep/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-xia-deep/60 sm:px-3 sm:text-[11px]">
            {subtitle}
          </div>
        </div>
        <div className="relative text-base font-semibold text-xia-deep sm:text-xl">{title}</div>
        <p className="mt-2 text-sm leading-relaxed text-xia-deep/80 sm:mt-3">{description}</p>
        {metaText ? (
          <div className="mt-3 inline-flex items-center rounded-full bg-xia-deep/5 px-3 py-1 text-xs font-semibold text-xia-deep/70 sm:mt-4">
            {metaText}
          </div>
        ) : null}
      </Link>
      <div className="relative mt-auto flex flex-wrap items-center gap-2 pt-5 sm:gap-3 sm:pt-6">
        <Link
          to={to}
          className="text-sm font-medium text-xia-deep underline-offset-2 hover:underline"
        >
          开始测评 →
        </Link>
        {showTestJump && (
          <button
            type="button"
            onClick={handleTestJump}
            className="rounded-full border border-xia-mint/50 bg-xia-mint/10 px-3 py-1.5 text-xs font-medium text-xia-teal transition hover:bg-xia-mint/20"
          >
            测试：直接看结果
          </button>
        )}
      </div>
    </div>
  )
}
