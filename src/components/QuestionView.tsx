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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs text-slate-400">
        题目 {index + 1}/{total}
      </div>
      <div className="mt-2 text-base font-medium text-slate-900">
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
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
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
