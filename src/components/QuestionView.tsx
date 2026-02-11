import { Option, Question } from '../types'

type QuestionViewProps = {
  question: Question
  index: number
  total: number
  options: Option[]
  value?: number
  onChange: (value: number) => void
}

export default function QuestionView({
  question,
  index,
  total,
  options,
  value,
  onChange,
}: QuestionViewProps) {
  return (
    <div className="rounded-2xl border border-xia-haze bg-white p-4 shadow-sm sm:p-6">
      <div className="text-xs text-xia-deep/50">
        题目 {index + 1}/{total}
      </div>
      <div className="mt-2 text-base font-medium text-xia-deep sm:text-lg">
        {question.text}
      </div>
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
    </div>
  )
}
