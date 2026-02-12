import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'
import QuestionOverview from './QuestionOverview'
import SectionHeader from './SectionHeader'

export interface StandardTestConfig {
  testId: string
  title: string
  subtitle: string
  description: string
  instructions: string[]
  questions: { id: number; text: string; dimension?: string }[]
  options: string[]
  resultPath: string
}

type StandardTestProps = {
  config: StandardTestConfig
  loadAnswers: (id: string) => Record<string, number> | null
  saveAnswers: (id: string, answers: Record<string, number>) => void
  clearAnswers: (id: string) => void
}

export default function StandardTest({
  config,
  loadAnswers,
  saveAnswers,
  clearAnswers,
}: StandardTestProps) {
  const navigate = useNavigate()
  const stored = useMemo(() => {
    const raw = loadAnswers(config.testId) ?? {}
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [String(k), v]))
  }, [config.testId, loadAnswers])

  const [answers, setAnswers] = useState<Record<string, number>>(stored)
  const [current, setCurrent] = useState(0)

  const questions = config.questions
  const total = questions.length
  const currentQuestion = questions[current]

  const overviewQuestions = useMemo(
    () =>
      questions.map(q => ({
        id: String(q.id),
        text: q.text,
        dimension: q.dimension ?? '',
      })),
    [questions]
  )

  const answeredCount = Object.keys(answers).length
  const progress = total > 0 ? (answeredCount / total) * 100 : 0

  const handleSelect = (optionIndex: number) => {
    const next = { ...answers, [String(currentQuestion.id)]: optionIndex }
    setAnswers(next)
    saveAnswers(config.testId, next)

    const nextUnanswered = questions.findIndex((q, i) => i > current && next[String(q.id)] === undefined)
    if (nextUnanswered !== -1) setTimeout(() => setCurrent(nextUnanswered), 200)
    else {
      const firstUnanswered = questions.findIndex(q => next[String(q.id)] === undefined)
      if (firstUnanswered !== -1) setTimeout(() => setCurrent(firstUnanswered), 200)
      else if (current < total - 1) setTimeout(() => setCurrent(current + 1), 200)
    }
  }

  const goNext = () => setCurrent(prev => Math.min(total - 1, prev + 1))
  const goPrev = () => setCurrent(prev => Math.max(0, prev - 1))

  const handleRestart = () => {
    if (window.confirm('确定要重新开始吗？当前的作答进度将被清空。')) {
      clearAnswers(config.testId)
      setAnswers({})
      setCurrent(0)
    }
  }

  const canSubmit = answeredCount === total

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <SectionHeader title={config.title} description={config.subtitle} />
          <button onClick={handleRestart} className="text-xs text-xia-deep/50 hover:text-xia-teal underline px-2 py-1">
            重新开始
          </button>
        </div>
        <p className="text-sm text-xia-deep/80">{config.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <ProgressBar value={progress} />
          <div className="rounded-2xl border border-xia-haze bg-white p-4 shadow-sm sm:p-6">
            <div className="text-xs text-xia-deep/50">
              题目 {current + 1}/{total}
            </div>
            <div className="mt-2 text-base font-medium text-xia-deep sm:text-lg">{currentQuestion.text}</div>
            <div className="mt-4 grid gap-3">
              {config.options.map((opt, index) => {
                const isSelected = answers[String(currentQuestion.id)] === index
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 sm:text-base ${
                      isSelected
                        ? 'border-xia-deep bg-xia-deep text-white shadow-md'
                        : 'border-xia-haze/50 bg-white hover:border-xia-deep/30 hover:bg-xia-cream/20 text-xia-deep'
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                    {isSelected && (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              className="rounded-full border border-xia-haze px-4 py-2 text-sm text-xia-deep/80 hover:border-xia-teal/50 transition"
              disabled={current === 0}
            >
              上一题
            </button>
            <div className="text-sm text-xia-teal/80">
              已完成 {answeredCount}/{total}
            </div>
            <button
              onClick={goNext}
              className="rounded-full border border-xia-deep bg-xia-deep px-4 py-2 text-sm text-white hover:bg-xia-deep/90 transition"
              disabled={current === total - 1}
            >
              下一题
            </button>
          </div>
          <button
            onClick={() => navigate(config.resultPath)}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              canSubmit ? 'bg-xia-deep text-white hover:bg-xia-deep/90 shadow-md' : 'cursor-not-allowed bg-xia-haze/30 text-xia-haze'
            }`}
            disabled={!canSubmit}
          >
            查看分析结果
          </button>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-xia-haze bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-xia-deep">作答提示</div>
            <ul className="space-y-2 text-sm text-xia-deep/80">
              {config.instructions.map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <QuestionOverview questions={overviewQuestions} answers={answers} currentIndex={current} onSelect={setCurrent} />
        </aside>
      </div>
    </div>
  )
}
