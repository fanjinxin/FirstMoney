import { Option, Question } from '../types'

type QuestionViewProps = {
  question: Question
  index: number
  total: number
  options: Option[]
  value?: number
  onChange: (value: number) => void
}

const is5PointScale = (opts: Option[]) =>
  opts.length === 5 && opts.every((o) => o.value >= 1 && o.value <= 5)

export default function QuestionView({
  question,
  index,
  total,
  options,
  value,
  onChange,
}: QuestionViewProps) {
  const scaleOptions = is5PointScale(options)
    ? [...options].sort((a, b) => b.value - a.value)
    : null

  return (
    <div className="rounded-2xl border border-xia-haze bg-white p-4 shadow-sm sm:p-6">
      <div className="text-xs text-xia-deep/50">
        题目 {index + 1}/{total}
      </div>
      <div className="mt-2 text-base font-medium text-xia-deep sm:text-lg">
        {question.text}
      </div>
      {scaleOptions ? (
        <div className="mt-4">
          <div className="flex items-center gap-4">
            <span className="shrink-0 max-w-[100px] text-left text-xs font-semibold text-xia-deep sm:text-sm">
              {scaleOptions[0].label}
            </span>
            <div className="flex flex-1 items-center justify-between gap-2 px-2">
              {scaleOptions.map((opt, i) => {
                const isSelected = value === opt.value
                const dotSize =
                  i === 0 || i === 4
                    ? 'h-10 w-10 sm:h-12 sm:w-12'
                    : i === 1 || i === 3
                      ? 'h-8 w-8 sm:h-10 sm:w-10'
                      : 'h-5 w-5 sm:h-7 sm:w-7'
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`shrink-0 rounded-full border-2 transition-all ${dotSize} ${
                      isSelected
                        ? i === 0
                          ? 'border-xia-sky bg-xia-sky'
                          : 'border-xia-deep bg-xia-deep'
                        : 'border-xia-haze/50 bg-white hover:border-xia-teal/50'
                    }`}
                  />
                )
              })}
            </div>
            <span className="shrink-0 max-w-[100px] text-right text-xs font-semibold text-xia-deep sm:text-sm">
              {scaleOptions[4].label}
            </span>
          </div>
          <p className="mt-2 text-center text-xs text-xia-deep/70">
            从左到右：{scaleOptions[0].label} → {scaleOptions[4].label}
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {options.map((option) => {
            const checked = value === option.value
            return (
              <button
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  checked
                    ? 'border-xia-deep bg-xia-deep text-white'
                    : 'border-xia-haze bg-white text-xia-deep/70 hover:border-xia-teal/50'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
