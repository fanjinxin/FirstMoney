import { Link, useNavigate } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { fillSampleAnswers, isSampleData, clearSampleFlag } from '../utils/testSample'
import { clearAnswers } from '../utils/storage'
import { useBackdoor } from '../contexts/BackdoorContext'

type TestCardProps = {
  title: string
  subtitle: string
  description: string
  to: string
  /** Lucide 图标组件（替代原 iconUrl/iconAlt） */
  icon: React.ReactNode
  iconBg: string
  backgroundClass?: string
  duration?: string
  questionCount?: number
  /** 是否显示首页热门标记 */
  hot?: boolean
  /** 使用人数文案，如 "12w+ 使用过" */
  usageText?: string
  /** 测试阶段：结果页路径，与 testId 同时传入时显示「测试：直接看结果」按钮 */
  resultTo?: string
  /** 测试阶段：测评 id，用于填充示例答案 */
  testId?: 'scl90' | 'rpi' | 'sri' | 'animal' | 'mbti' | 'aat' | 'psych-age' | 'apt' | 'hit' | 'dth' | 'tla' | 'fft' | 'ybt' | 'rvt' | 'lbt' | 'mpt' | 'vbt' | 'city'
}

export default function TestCard({
  title,
  subtitle,
  description,
  to,
  icon,
  iconBg,
  backgroundClass,
  duration,
  questionCount,
  hot,
  usageText,
  resultTo,
  testId,
}: TestCardProps) {
  const navigate = useNavigate()
  const { showBackdoorBtn } = useBackdoor()
  const totalQuestions = questionCount ?? 0
  const metaText =
    totalQuestions > 0 && duration
      ? `${totalQuestions}题 · ${duration}`
      : totalQuestions > 0
        ? `${totalQuestions}题`
        : duration
          ? duration
          : null

  const showTestJump = showBackdoorBtn && resultTo && testId

  const handleStartTest = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!testId) return
    if (isSampleData(testId)) {
      clearSampleFlag(testId)
      if (testId === 'scl90') {
        clearAnswers('scl90')
      } else if (testId === 'rpi') {
        clearAnswers('rpi-self')
        clearAnswers('rpi-partner')
      } else if (testId === 'animal') {
        clearAnswers('animal-sculpture')
      } else {
        clearAnswers(testId)
      }
    }
    navigate(to)
  }

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
      <Link to={to} onClick={handleStartTest} className="relative flex flex-1 flex-col focus:outline-none">
        <div className="relative mb-4 flex items-center justify-between sm:mb-5">
          <div
            className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl ${iconBg} shadow-sm transition duration-300 group-hover:scale-105 sm:h-12 sm:w-12 [&>svg]:h-6 [&>svg]:w-6 sm:[&>svg]:h-7 sm:[&>svg]:w-7 [&>img]:h-full [&>img]:w-full [&>img]:object-contain`}
          >
            {icon}
          </div>
          <div className="flex items-center gap-2">
            {hot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500/25 to-red-500/25 px-2 py-1 text-orange-500">
                <Flame className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 animate-hot-flame" strokeWidth={2.5} />
                <span className="text-[9px] font-bold uppercase tracking-wider sm:text-[10px]">hot</span>
              </span>
            )}
            <span className="rounded-full bg-xia-deep/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-xia-deep/60 sm:px-3 sm:text-[11px]">
              {subtitle}
            </span>
          </div>
        </div>
        <div className="relative text-base font-semibold text-xia-deep sm:text-xl">{title}</div>
        <p className="mt-2 text-sm leading-relaxed text-xia-deep/80 sm:mt-3">{description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
          {metaText ? (
            <span className="inline-flex rounded-full bg-xia-deep/5 px-3 py-1 text-xs font-semibold text-xia-deep/70">
              {metaText}
            </span>
          ) : null}
          {usageText ? (
            <span className="text-[11px] font-medium text-xia-deep/50 sm:text-xs">
              {usageText}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="relative mt-auto flex flex-wrap items-center gap-2 pt-5 sm:gap-3 sm:pt-6">
        <Link
          to={to}
          onClick={handleStartTest}
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
            测试：直接查看结果
          </button>
        )}
      </div>
    </div>
  )
}
