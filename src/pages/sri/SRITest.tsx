import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import QuestionView from '../../components/QuestionView'
import SectionHeader from '../../components/SectionHeader'
import { sriTest } from '../../data/sri'
import { loadAnswers, saveAnswers } from '../../utils/storage'

export default function SRITest() {
  const navigate = useNavigate()
  const stored = useMemo(() => loadAnswers(sriTest.id) ?? {}, [])
  const [answers, setAnswers] = useState<Record<string, number>>(stored)
  const [current, setCurrent] = useState(0)

  const questions = sriTest.questions
  const total = questions.length
  const currentQuestion = questions[current]
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length
  const progress = (answeredCount / total) * 100

  const handleSelect = (value: number) => {
    const next = { ...answers, [currentQuestion.id]: value }
    setAnswers(next)
    saveAnswers(sriTest.id, next)
  }

  const goNext = () => setCurrent((prev) => Math.min(total - 1, prev + 1))
  const goPrev = () => setCurrent((prev) => Math.max(0, prev - 1))

  const canSubmit = answeredCount === total

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <SectionHeader title={sriTest.title} description={sriTest.subtitle} />
        <p className="text-sm text-xia-deep/80">{sriTest.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <ProgressBar value={progress} />
          <QuestionView
            question={currentQuestion}
            index={current}
            total={total}
            options={sriTest.options}
            value={answers[currentQuestion.id]}
            onChange={handleSelect}
          />
          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              className="rounded-full border border-xia-haze px-4 py-2 text-sm text-xia-deep/60 hover:border-xia-teal/50"
              disabled={current === 0}
            >
              上一题
            </button>
            <div className="text-sm text-xia-deep/60">
              已完成 {answeredCount}/{total}
            </div>
            <button
              onClick={goNext}
              className="rounded-full border border-xia-deep bg-xia-deep px-4 py-2 text-sm text-white hover:bg-xia-deep/90"
              disabled={current === total - 1}
            >
              下一题
            </button>
          </div>
          <button
            onClick={() => navigate('/sri/result')}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              canSubmit
                ? 'bg-xia-deep text-white hover:bg-xia-deep/90'
                : 'cursor-not-allowed bg-xia-haze text-xia-deep/40'
            }`}
            disabled={!canSubmit}
          >
            查看分析结果
          </button>
        </div>

        <aside className="space-y-4 rounded-2xl border border-xia-haze bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-xia-deep">作答提示</div>
          <ul className="space-y-2 text-sm text-xia-deep/80">
            {sriTest.instructions.map((tip) => (
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
