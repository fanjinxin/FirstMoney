/**
 * MBTI 风格横向刻度：非常符合/高值放左边，不符合/低值放右边
 */
type ScaleOption = { value: number; label: string } | string

type LikertScaleProps = {
  options: ScaleOption[]
  value: number | undefined
  onChange: (value: number) => void
  indexMode?: boolean
}

export default function LikertScale({ options, value, onChange, indexMode }: LikertScaleProps) {
  const normalized = options.map((opt, i) =>
    typeof opt === 'string' ? { value: i, label: opt } : { value: opt.value, label: opt.label }
  )
  const sorted = [...normalized].sort((a, b) => b.value - a.value)
  const is5Point = sorted.length === 5

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <span className="shrink-0 max-w-[100px] text-left text-xs font-semibold text-xia-deep sm:text-sm">
          {sorted[0].label}
        </span>
        <div className="flex flex-1 items-center justify-between gap-2 px-2">
          {sorted.map((opt, i) => {
            const isSelected = value === opt.value
            const dotSize =
              is5Point && (i === 0 || i === 4)
                ? 'h-10 w-10 sm:h-12 sm:w-12'
                : is5Point && (i === 1 || i === 3)
                  ? 'h-8 w-8 sm:h-10 sm:w-10'
                  : is5Point
                    ? 'h-5 w-5 sm:h-7 sm:w-7'
                    : 'h-8 w-8 sm:h-10 sm:w-10'
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
          {sorted[sorted.length - 1].label}
        </span>
      </div>
      <p className="mt-2 text-center text-xs text-xia-deep/70">
        从左到右：{sorted[0].label} → {sorted[sorted.length - 1].label}
      </p>
    </div>
  )
}
