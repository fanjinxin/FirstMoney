import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import SectionHeader from '../../components/SectionHeader'
import { aatQuestions, AAT_TEST_ID } from '../../data/aat'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'
import { clearSampleFlag } from '../../utils/testSample'

const TEST_INFO = {
  title: 'AAT 学习适应性测验',
  subtitle: '了解你的学习适应程度',
  description:
    '本测验用于调查你如何根据性格、健康状况和环境条件改进学习方法，提高学习能力。不是评价能力或性格好坏，而是帮助发现问题、提升学习效率。',
  instructions: [
    '请按平时所想和所做，如实作答。',
    '每题只选一个答案，没有合适答案时选最接近的。',
    '不要与同学商量或照抄答案。',
    '回答时间无限制，但不必过分考虑，选最初想到的答案。',
  ],
}

export default function AATTest() {
  const navigate = useNavigate()
  const stored = useMemo(() => {
    const raw = loadAnswers(AAT_TEST_ID) ?? {}
    const normalized: Record<string, number> = {}
    Object.keys(raw).forEach(k => {
      normalized[String(k)] = raw[k]
    })
    return normalized
  }, [])

  const [answers, setAnswers] = useState<Record<string, number>>(stored)
  const [current, setCurrent] = useState(0)

  const questions = aatQuestions
  const total = questions.length
  const currentQuestion = questions[current]

  const overviewQuestions = useMemo(
    () =>
      questions.map(q => ({
        id: String(q.id),
        text: q.text,
        dimension: q.dimension,
      })),
    [questions]
  )

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / total) * 100

  const handleSelect = (optionIndex: number) => {
    clearSampleFlag('aat')
    const next = { ...answers, [String(currentQuestion.id)]: optionIndex }
    setAnswers(next)
    saveAnswers(AAT_TEST_ID, next)

    const nextUnansweredIndex = questions.findIndex(
      (q, index) => index > current && next[String(q.id)] === undefined
    )
    if (nextUnansweredIndex !== -1) {
      setTimeout(() => setCurrent(nextUnansweredIndex), 200)
    } else {
      const firstUnanswered = questions.findIndex(q => next[String(q.id)] === undefined)
      if (firstUnanswered !== -1) {
        setTimeout(() => setCurrent(firstUnanswered), 200)
      } else if (current < total - 1) {
        setTimeout(() => setCurrent(current + 1), 200)
      }
    }
  }

  const goNext = () => setCurrent(prev => Math.min(total - 1, prev + 1))
  const goPrev = () => setCurrent(prev => Math.max(0, prev - 1))

  const handleRestart = () => {
    if (window.confirm('确定要重新开始吗？当前的作答进度将被清空。')) {
      clearAnswers(AAT_TEST_ID)
      setAnswers({})
      setCurrent(0)
    }
  }

  const canSubmit = answeredCount === total

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <SectionHeader title={TEST_INFO.title} description={TEST_INFO.subtitle} />
          <button
            onClick={handleRestart}
            className="text-xs text-xia-deep/50 hover:text-xia-teal underline px-2 py-1"
          >
            重新开始
          </button>
        </div>
        <p className="text-sm text-xia-deep/80">{TEST_INFO.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <ProgressBar value={progress} />
          <div className="rounded-2xl border border-xia-haze bg-white p-4 shadow-sm sm:p-6">
            <div className="text-xs text-xia-deep/50">
              题目 {current + 1}/{total}
            </div>
            <div className="mt-2 text-base font-medium text-xia-deep sm:text-lg">
              {currentQuestion.text}
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-4">
                <span className="shrink-0 max-w-[120px] text-left text-xs font-semibold text-xia-deep sm:text-sm">
                  {currentQuestion.options[0]}
                </span>
                <div className="flex flex-1 items-center justify-between gap-4 px-2">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = answers[String(currentQuestion.id)] === index
                    const dotSize =
                      index === 0 || index === 2
                        ? 'h-10 w-10 sm:h-12 sm:w-12'
                        : 'h-6 w-6 sm:h-8 sm:w-8'
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelect(index)}
                        className={`shrink-0 rounded-full border-2 transition-all ${dotSize} ${
                          isSelected
                            ? index === 0
                              ? 'border-xia-sky bg-xia-sky'
                              : 'border-xia-deep bg-xia-deep'
                            : 'border-xia-haze/50 bg-white hover:border-xia-teal/50'
                        }`}
                      />
                    )
                  })}
                </div>
                <span className="shrink-0 max-w-[120px] text-right text-xs font-semibold text-xia-deep sm:text-sm">
                  {currentQuestion.options[currentQuestion.options.length - 1]}
                </span>
              </div>
              <p className="mt-2 text-center text-xs text-xia-deep/70">
                从左到右：{currentQuestion.options[0]} →{' '}
                {currentQuestion.options[currentQuestion.options.length - 1]}
              </p>
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
            onClick={() => navigate('/aat/result')}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              canSubmit
                ? 'bg-xia-deep text-white hover:bg-xia-deep/90 shadow-md'
                : 'cursor-not-allowed bg-xia-haze/30 text-xia-haze'
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
              {TEST_INFO.instructions.map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <QuestionOverview
            questions={overviewQuestions}
            answers={answers}
            currentIndex={current}
            onSelect={setCurrent}
          />
        </aside>
      </div>
    </div>
  )
}
