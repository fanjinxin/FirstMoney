import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import QuestionView from '../../components/QuestionView'
import SectionHeader from '../../components/SectionHeader'
import { rpiTest } from '../../data/rpi'
import { loadAnswers, saveAnswers } from '../../utils/storage'
import { clearSampleFlag } from '../../utils/testSample'

type Perspective = 'self' | 'partner'

const perspectiveLabels: Record<Perspective, string> = {
  self: '自我视角',
  partner: '伴侣视角',
}

export default function RPITest() {
  const navigate = useNavigate()
  const [perspective, setPerspective] = useState<Perspective>('self')

  const answers = useMemo(() => {
    return loadAnswers(`${rpiTest.id}-${perspective}`) ?? {}
  }, [perspective])

  const [current, setCurrent] = useState(0)
  const [stateAnswers, setStateAnswers] = useState<Record<string, number>>(answers)

  const questions = rpiTest.questions.filter((q) => q.id.startsWith(`${perspective}-`))
  const total = questions.length
  const currentQuestion = questions[current]
  const answeredCount = questions.filter((q) => stateAnswers[q.id] !== undefined).length
  const progress = (answeredCount / total) * 100

  const handleSelect = (value: number) => {
    clearSampleFlag('rpi')
    const next = { ...stateAnswers, [currentQuestion.id]: value }
    setStateAnswers(next)
    saveAnswers(`${rpiTest.id}-${perspective}`, next)

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

  const canSubmit = answeredCount === total

  const switchPerspective = (next: Perspective) => {
    setPerspective(next)
    setCurrent(0)
    const stored = loadAnswers(`${rpiTest.id}-${next}`) ?? {}
    setStateAnswers(stored)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <SectionHeader title={rpiTest.title} description={rpiTest.subtitle} />
        <p className="text-sm text-xia-deep/80">{rpiTest.description}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {(['self', 'partner'] as Perspective[]).map((key) => (
          <button
            key={key}
            onClick={() => switchPerspective(key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              perspective === key
                ? 'bg-xia-deep text-white'
                : 'border border-xia-haze bg-white text-xia-deep/60 hover:border-xia-teal/50'
            }`}
          >
            {perspectiveLabels[key]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <ProgressBar value={progress} />
          <QuestionView
            question={currentQuestion}
            index={current}
            total={total}
            options={rpiTest.options}
            value={stateAnswers[currentQuestion.id]}
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
            onClick={() => navigate('/rpi/result')}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              canSubmit
                ? 'bg-xia-deep text-white hover:bg-xia-deep/90'
                : 'cursor-not-allowed bg-xia-haze/30 text-xia-deep/30'
            }`}
            disabled={!canSubmit}
          >
            查看分析结果
          </button>
        </div>

        <aside className="space-y-4 rounded-2xl border border-xia-haze bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-xia-deep">作答提示</div>
          <ul className="space-y-2 text-sm text-xia-deep/80">
            {rpiTest.instructions.map((tip) => (
              <li key={tip}>• {tip}</li>
            ))}
          </ul>
        </aside>
        <QuestionOverview
          title={`${perspectiveLabels[perspective]}题目总览`}
          questions={questions}
          answers={stateAnswers}
          currentIndex={current}
          onSelect={setCurrent}
        />
      </div>
    </div>
  )
}
