import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import SectionHeader from '../../components/SectionHeader'
import { fftQuestions, FFT_TEST_ID } from '../../data/fft'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'
import { clearSampleFlag } from '../../utils/testSample'

export default function FFTTest() {
  const navigate = useNavigate()
  const stored = useMemo(() => {
    const raw = loadAnswers(FFT_TEST_ID) ?? {}
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [String(k), v]))
  }, [])

  const [answers, setAnswers] = useState<Record<string, number>>(stored)
  const [current, setCurrent] = useState(0)

  const questions = fftQuestions
  const total = questions.length
  const currentQuestion = questions[current]

  const overviewQuestions = useMemo(
    () => questions.map(q => ({ id: String(q.id), text: q.text, dimension: '' })),
    [questions]
  )

  const answeredCount = Object.keys(answers).length
  const progress = total > 0 ? (answeredCount / total) * 100 : 0

  const handleSelect = (optionIndex: number) => {
    clearSampleFlag('fft')
    const next = { ...answers, [String(currentQuestion.id)]: optionIndex }
    setAnswers(next)
    saveAnswers(FFT_TEST_ID, next)

    const nextUnanswered = questions.findIndex((q, i) => i > current && next[String(q.id)] === undefined)
    if (nextUnanswered !== -1) setTimeout(() => setCurrent(nextUnanswered), 200)
    else {
      const firstUnanswered = questions.findIndex(q => next[String(q.id)] === undefined)
      if (firstUnanswered !== -1) setTimeout(() => setCurrent(firstUnanswered), 200)
      else if (current < total - 1) setTimeout(() => setCurrent(current + 1), 200)
    }
  }

  const canSubmit = answeredCount === total

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <SectionHeader title="FFT 水果塑形测试" description="发现你的水果人格" />
          <button
            onClick={() => {
              if (window.confirm('确定要重新开始吗？')) {
                clearAnswers(FFT_TEST_ID)
                setAnswers({})
                setCurrent(0)
              }
            }}
            className="text-xs text-xia-deep/50 hover:text-xia-teal underline"
          >
            重新开始
          </button>
        </div>
        <p className="text-sm text-xia-deep/80">
          通过 54 道情境选择题，探索你的水果人格类型。苹果、葡萄、草莓、橙子、柠檬、香蕉、梨、樱桃、柚子九种水果代表不同的性格倾向。
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <ProgressBar value={progress} />
          <div className="rounded-2xl border border-xia-haze bg-white p-4 shadow-sm sm:p-6">
            <div className="text-xs text-xia-deep/50">题目 {current + 1}/{total}</div>
            <div className="mt-2 text-base font-medium text-xia-deep sm:text-lg">{currentQuestion.text}</div>
            <div className="mt-4 grid gap-3">
              {currentQuestion.options.map((opt, index) => {
                const isSelected = answers[String(currentQuestion.id)] === index
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition sm:text-base ${
                      isSelected ? 'border-xia-deep bg-xia-deep text-white' : 'border-xia-haze/50 bg-white hover:border-xia-deep/30 text-xia-deep'
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
              onClick={() => setCurrent(prev => Math.max(0, prev - 1))}
              className="rounded-full border border-xia-haze px-4 py-2 text-sm"
              disabled={current === 0}
            >
              上一题
            </button>
            <span className="text-sm text-xia-teal/80">已完成 {answeredCount}/{total}</span>
            <button
              onClick={() => setCurrent(prev => Math.min(total - 1, prev + 1))}
              className="rounded-full border border-xia-deep bg-xia-deep px-4 py-2 text-sm text-white"
              disabled={current === total - 1}
            >
              下一题
            </button>
          </div>
          <button
            onClick={() => navigate('/fft/result')}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold ${
              canSubmit ? 'bg-xia-deep text-white' : 'cursor-not-allowed bg-xia-haze/30 text-xia-haze'
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
              <li>· 每题三选一，选择最符合自己的选项。</li>
              <li>· 凭第一感受作答即可。</li>
            </ul>
          </div>
          <QuestionOverview questions={overviewQuestions} answers={answers} currentIndex={current} onSelect={setCurrent} />
        </aside>
      </div>
    </div>
  )
}
