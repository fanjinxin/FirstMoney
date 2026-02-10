import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import QuestionView from '../../components/QuestionView'
import SectionHeader from '../../components/SectionHeader'
import { scl90Test } from '../../data/scl90'
import { loadAnswers, saveAnswers } from '../../utils/storage'

export default function SCL90Test() {
  const navigate = useNavigate()
  const stored = useMemo(() => loadAnswers(scl90Test.id) ?? {}, [])
  const [answers, setAnswers] = useState<Record<string, number>>(stored)
  const [current, setCurrent] = useState(0)

  const questions = scl90Test.questions
  const total = questions.length
  const currentQuestion = questions[current]
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length
  const progress = (answeredCount / total) * 100

  const handleSelect = (value: number) => {
    const next = { ...answers, [currentQuestion.id]: value }
    setAnswers(next)
    saveAnswers(scl90Test.id, next)
  }

  const goNext = () => setCurrent((prev) => Math.min(total - 1, prev + 1))
  const goPrev = () => setCurrent((prev) => Math.max(0, prev - 1))

  const canSubmit = answeredCount === total

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <SectionHeader title={scl90Test.title} description={scl90Test.subtitle} />
        <p className="text-sm text-slate-600">{scl90Test.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <ProgressBar value={progress} />
          <QuestionView
            question={currentQuestion}
            index={current}
            total={total}
            options={scl90Test.options}
            value={answers[currentQuestion.id]}
            onChange={handleSelect}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-slate-300"
              disabled={current === 0}
            >
              上一题
            </button>
            <div className="text-sm text-slate-500">
              已完成 {answeredCount}/{total}
            </div>
            <button
              onClick={goNext}
              className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
              disabled={current === total - 1}
            >
              下一题
            </button>
          </div>
          <button
            onClick={() => navigate('/scl90/result')}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              canSubmit
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'cursor-not-allowed bg-slate-200 text-slate-400'
            }`}
            disabled={!canSubmit}
          >
            查看分析结果
          </button>
        </div>

        <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">作答提示</div>
          <ul className="space-y-2 text-sm text-slate-600">
            {scl90Test.instructions.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </aside>
        <QuestionOverview
          questions={questions}
          answers={answers}
          currentIndex={current}
          onSelect={setCurrent}
        />
      </div>
    </div>
  )
}
