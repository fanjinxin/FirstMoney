import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import SectionHeader from '../../components/SectionHeader'
import { animalQuestions } from '../../data/animal_sculpture'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'
import { clearSampleFlag } from '../../utils/testSample'

const ANIMAL_TEST_ID = 'animal-sculpture'

const TEST_INFO = {
  title: '人格动物塑测试',
  subtitle: '测测你的精神动物',
  description: '本测试基于FFM五因素模型（大五人格），通过60道生活场景题目，深度解析你的性格特质，并匹配最契合的动物原型。',
  instructions: [
    '本测试共有60道题目，请耐心完成。',
    '请根据您的真实情况和第一直觉作答。',
    '答案无对错之分，越真实的结果越有参考价值。',
    '中途退出会自动保存进度。',
  ],
}

export default function AnimalTest() {
  const navigate = useNavigate()
  
  // Load answers and ensure keys are strings for compatibility
  const stored = useMemo(() => {
    const raw = loadAnswers(ANIMAL_TEST_ID) ?? {}
    const normalized: Record<string, number> = {}
    Object.keys(raw).forEach(k => {
      normalized[String(k)] = raw[k]
    })
    return normalized
  }, [])

  const [answers, setAnswers] = useState<Record<string, number>>(stored)
  const [current, setCurrent] = useState(0)

  const questions = animalQuestions
  const total = questions.length
  const currentQuestion = questions[current]
  
  // Map for QuestionOverview
  const overviewQuestions = useMemo(() => {
    return questions.map(q => ({
      id: String(q.id),
      text: q.text,
      dimension: 'animal' // Dummy dimension
    }))
  }, [questions])

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / total) * 100

  const handleSelect = (optionIndex: number) => {
    clearSampleFlag('animal')
    const next = { ...answers, [String(currentQuestion.id)]: optionIndex }
    setAnswers(next)
    saveAnswers(ANIMAL_TEST_ID, next)
    
    // Find next unanswered question
    const nextUnansweredIndex = questions.findIndex(
      (q, index) => index > current && next[String(q.id)] === undefined
    )

    if (nextUnansweredIndex !== -1) {
      setTimeout(() => {
        setCurrent(nextUnansweredIndex)
      }, 200)
    } else if (current < total - 1) {
       // If all subsequent questions are answered, but we are not at the end, just go to next
       // Or we can check if there are ANY unanswered questions from the beginning
       const firstUnansweredIndex = questions.findIndex(
        (q) => next[String(q.id)] === undefined
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
      clearAnswers(ANIMAL_TEST_ID)
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
          
          {/* Custom Question View */}
          <div className="rounded-2xl border border-xia-haze bg-white p-4 shadow-sm sm:p-6">
            <div className="text-xs text-xia-deep/50">
              题目 {current + 1}/{total}
            </div>
            <div className="mt-2 text-base font-medium text-xia-deep sm:text-lg">
              {currentQuestion.text}
            </div>
            <div className="mt-4 grid gap-3">
              {currentQuestion.options.map((option, index) => {
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
                    <span className="font-medium">{option.label}</span>
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
            onClick={() => navigate('/animal/result')}
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
