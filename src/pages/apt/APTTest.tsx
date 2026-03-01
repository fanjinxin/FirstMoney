import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import SectionHeader from '../../components/SectionHeader'
import { aptQuestions, APT_TEST_ID } from '../../data/apt'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'
import { clearSampleFlag } from '../../utils/testSample'

const OPTIONS = ['完全不符合', '不太符合', '一般', '比较符合', '完全符合']

const TEST_INFO = {
  title: 'APT 天赋潜能评估',
  subtitle: '发现你的优势与潜力',
  description:
    '本测验从逻辑推理、语言表达、空间想象、创造力、人际交往、抗压韧性六个维度，评估你的天赋倾向与潜能。结果将揭示你的优势维度与发展空间，为职业规划与自我提升提供参考。',
  instructions: [
    '请根据平时的真实感受与行为倾向作答，不必揣测「正确」答案。',
    '每题五选一：完全不符合 → 完全符合。',
    '选择最符合自己实际状态的选项。',
    '回答时间无限制，凭第一感受作答即可。',
  ],
}

export default function APTTest() {
  const navigate = useNavigate()
  const stored = useMemo(() => {
    const raw = loadAnswers(APT_TEST_ID) ?? {}
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [String(k), v]))
  }, [])

  const [answers, setAnswers] = useState<Record<string, number>>(stored)
  const [current, setCurrent] = useState(0)

  const questions = aptQuestions
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
  const progress = total > 0 ? (answeredCount / total) * 100 : 0

  const handleSelect = (optionIndex: number) => {
    clearSampleFlag('apt')
    const next = { ...answers, [String(currentQuestion.id)]: optionIndex }
    setAnswers(next)
    saveAnswers(APT_TEST_ID, next)

    const nextUnanswered = questions.findIndex((q, i) => i > current && next[String(q.id)] === undefined)
    if (nextUnanswered !== -1) {
      setTimeout(() => setCurrent(nextUnanswered), 200)
    } else {
      const firstUnanswered = questions.findIndex(q => next[String(q.id)] === undefined)
      if (firstUnanswered !== -1) setTimeout(() => setCurrent(firstUnanswered), 200)
      else if (current < total - 1) setTimeout(() => setCurrent(current + 1), 200)
    }
  }

  const goNext = () => setCurrent(prev => Math.min(total - 1, prev + 1))
  const goPrev = () => setCurrent(prev => Math.max(0, prev - 1))

  const handleRestart = () => {
    if (window.confirm('确定要重新开始吗？当前的作答进度将被清空。')) {
      clearAnswers(APT_TEST_ID)
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
                <span className="shrink-0 max-w-[100px] text-left text-xs font-semibold text-xia-deep sm:text-sm">
                  {OPTIONS[4]}
                </span>
                <div className="flex flex-1 items-center justify-between gap-2 px-2">
                  {[4, 3, 2, 1, 0].map((idx) => {
                    const isSelected = answers[String(currentQuestion.id)] === idx
                    const dotSize =
                      idx === 4 || idx === 0
                        ? 'h-10 w-10 sm:h-12 sm:w-12'
                        : idx === 3 || idx === 1
                          ? 'h-8 w-8 sm:h-10 sm:w-10'
                          : 'h-5 w-5 sm:h-7 sm:w-7'
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelect(idx)}
                        className={`shrink-0 rounded-full border-2 transition-all ${dotSize} ${
                          isSelected
                            ? idx === 4
                              ? 'border-xia-sky bg-xia-sky'
                              : 'border-xia-deep bg-xia-deep'
                            : 'border-xia-haze/50 bg-white hover:border-xia-teal/50'
                        }`}
                      />
                    )
                  })}
                </div>
                <span className="shrink-0 max-w-[100px] text-right text-xs font-semibold text-xia-deep sm:text-sm">
                  {OPTIONS[0]}
                </span>
              </div>
              <p className="mt-2 text-center text-xs text-xia-deep/70">
                从左到右：{OPTIONS[4]} → {OPTIONS[0]}
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
            onClick={() => navigate('/apt/result')}
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
