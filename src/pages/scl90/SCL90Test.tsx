import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import QuestionView from '../../components/QuestionView'
import SectionHeader from '../../components/SectionHeader'
import { scl90Test } from '../../data/scl90'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'
import { clearSampleFlag } from '../../utils/testSample'

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
    clearSampleFlag('scl90')
    const next = { ...answers, [currentQuestion.id]: value }
    setAnswers(next)
    saveAnswers(scl90Test.id, next)

    // Find next unanswered question
    const nextUnansweredIndex = questions.findIndex(
      (q, index) => index > current && next[q.id] === undefined
    )

    if (nextUnansweredIndex !== -1) {
      setTimeout(() => {
        setCurrent(nextUnansweredIndex)
      }, 200)
    } else if (current < total - 1) {
       // If all subsequent questions are answered, but we are not at the end, just go to next
       // Or we can check if there are ANY unanswered questions from the beginning
       const firstUnansweredIndex = questions.findIndex(
        (q) => next[q.id] === undefined
      )
      if (firstUnansweredIndex !== -1) {
         setTimeout(() => {
            setCurrent(firstUnansweredIndex)
          }, 200)
      } else {
         // All answered, stay or maybe go to next if not last
         if (current < total - 1) {
            setTimeout(() => {
                setCurrent(current + 1)
              }, 200)
         }
      }
    }
  }

  const goNext = () => setCurrent((prev) => Math.min(total - 1, prev + 1))
  const goPrev = () => setCurrent((prev) => Math.max(0, prev - 1))

  const handleRestart = () => {
    if (window.confirm('确定要重新开始吗？当前的作答进度将被清空。')) {
      clearAnswers(scl90Test.id)
      setAnswers({})
      setCurrent(0)
    }
  }

  const canSubmit = answeredCount === total

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <SectionHeader title={scl90Test.title} description={scl90Test.subtitle} />
          <button onClick={handleRestart} className="text-xs text-xia-deep/50 hover:text-xia-teal underline px-2 py-1">
            重新开始
          </button>
        </div>
        <p className="text-sm text-xia-deep/80">{scl90Test.description}</p>
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
              className="rounded-full border border-xia-haze px-4 py-2 text-sm text-xia-deep/80 hover:border-xia-teal/50"
              disabled={current === 0}
            >
              上一题
            </button>
            <div className="text-sm text-xia-teal/80">
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
            onClick={() => navigate('/scl90/result')}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              canSubmit
                ? 'bg-xia-deep text-white hover:bg-xia-deep/90'
                : 'cursor-not-allowed bg-xia-haze/30 text-xia-haze'
            }`}
            disabled={!canSubmit}
          >
            查看分析结果
          </button>
        </div>

        <aside className="space-y-4 rounded-2xl border border-xia-haze bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-xia-deep">作答提示</div>
          <ul className="space-y-2 text-sm text-xia-deep/80">
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
