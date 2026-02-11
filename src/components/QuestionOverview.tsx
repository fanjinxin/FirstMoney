import { Question } from '../types'

type QuestionOverviewProps = {
  title?: string
  questions: Question[]
  answers: Record<string, number>
  currentIndex: number
  onSelect: (index: number) => void
}

export default function QuestionOverview({
  title = '题目总览',
  questions,
  answers,
  currentIndex,
  onSelect,
}: QuestionOverviewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
        <span>{title}</span>
        <span className="text-xs font-medium text-slate-500">
          已答 {Object.keys(answers).length}/{questions.length}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          已作答
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          未作答
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-900" />
          当前题
        </span>
      </div>
      <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-8">
        {questions.map((question, index) => {
          const answered = answers[question.id] !== undefined
          const isCurrent = index === currentIndex
          const base =
            'flex h-8 items-center justify-center rounded-lg border text-xs font-semibold transition'
          const stateClass = isCurrent
            ? 'border-slate-900 bg-slate-900 text-white'
            : answered
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300'
              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'

          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(index)}
              className={`${base} ${stateClass}`}
              aria-current={isCurrent ? 'true' : 'false'}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
