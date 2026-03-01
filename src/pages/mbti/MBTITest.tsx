import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../../components/ProgressBar'
import QuestionOverview from '../../components/QuestionOverview'
import SectionHeader from '../../components/SectionHeader'
import { mbtiQuestions, MBTI_SCALE_OPTIONS } from '../../data/mbti'
import { loadAnswers, saveAnswers, clearAnswers } from '../../utils/storage'
import { clearSampleFlag } from '../../utils/testSample'

const TEST_INFO = {
  title: 'MBTI 16型人格测试',
  subtitle: '90题完整版 · 5点量表',
  description:
    '通过 90 道题目，从能量来源(E/I)、信息获取(S/N)、决策方式(T/F)、生活节奏(J/P)四个维度，揭示你的 16 型人格。每题两个陈述，选择符合程度。',
  instructions: [
    '每题有两个陈述（A 和 B），请选择最符合你的程度。',
    '「非常符合」表示强烈倾向，「比较符合」表示有所倾向，「不确定」表示两者皆有或难以判断。',
    '请根据真实情况和第一直觉作答，无对错之分。',
    '中途退出会自动保存进度。',
  ],
}

export default function MBTITest() {
  const navigate = useNavigate()
  const stored = useMemo(() => loadAnswers('mbti') ?? {}, [])
  const [answers, setAnswers] = useState<Record<string, number>>(stored)
  const [current, setCurrent] = useState(0)

  const questions = mbtiQuestions
  const total = questions.length
  const currentQuestion = questions[current]

  const overviewQuestions = useMemo(
    () =>
      questions.map((q) => ({
        id: q.id,
        text: q.text,
        dimension: q.dimension,
      })),
    [questions]
  )

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / total) * 100

  const handleSelect = (value: number) => {
    clearSampleFlag('mbti')
    const next = { ...answers, [currentQuestion.id]: value }
    setAnswers(next)
    saveAnswers('mbti', next)

    const nextUnansweredIndex = questions.findIndex(
      (q, idx) => idx > current && next[q.id] === undefined
    )

    if (nextUnansweredIndex !== -1) {
      setTimeout(() => setCurrent(nextUnansweredIndex), 200)
    } else if (current < total - 1) {
      const firstUnanswered = questions.findIndex((q) => next[q.id] === undefined)
      if (firstUnanswered !== -1) {
        setTimeout(() => setCurrent(firstUnanswered), 200)
      } else {
        if (current < total - 1) {
          setTimeout(() => setCurrent(current + 1), 200)
        }
      }
    }
  }

  const goNext = () => setCurrent((prev) => Math.min(total - 1, prev + 1))
  const goPrev = () => setCurrent((prev) => Math.max(0, prev - 1))

  const handleRestart = () => {
    if (window.confirm('确定要重新开始吗？当前的作答进度将被清空。')) {
      clearAnswers('mbti')
      setAnswers({})
      setCurrent(0)
    }
  }

  const canSubmit = answeredCount === total

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <SectionHeader
            title={TEST_INFO.title}
            description={TEST_INFO.subtitle}
          />
          <button
            onClick={handleRestart}
            className="rounded-lg px-2 py-1 text-xs text-xia-deep/50 underline hover:text-xia-teal"
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

            {/* A/B 两个陈述 */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-xia-haze/60 bg-xia-cream/20 p-4">
                <div className="mb-1 text-xs font-semibold text-xia-sky">A</div>
                <div className="text-sm text-xia-deep/90">{currentQuestion.optionA.label}</div>
              </div>
              <div className="rounded-xl border border-xia-haze/60 bg-xia-cream/20 p-4">
                <div className="mb-1 text-xs font-semibold text-xia-deep">B</div>
                <div className="text-sm text-xia-deep/90">{currentQuestion.optionB.label}</div>
              </div>
            </div>

            {/* 5点量表 - 圈圈选择器（A↔B 程度） */}
            <div className="mt-6">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-xia-sky">A</span>
                <div className="flex flex-1 items-center justify-between px-4">
                  {MBTI_SCALE_OPTIONS.map((opt) => {
                    const isSelected = answers[currentQuestion.id] === opt.value
                    const isA = opt.value <= 1
                    const isB = opt.value >= 3
                    // 左侧 A：主题主色(sky) | 右侧 B：主题深色(deep) | 中间：灰(haze)，均随主题变化
                    const borderColor = isSelected
                      ? isA
                        ? 'border-xia-sky'
                        : isB
                          ? 'border-xia-deep'
                          : 'border-xia-haze'
                      : isA
                        ? 'border-xia-sky/50'
                        : isB
                          ? 'border-xia-deep/50'
                          : 'border-xia-haze/60'
                    const fillColor = isSelected
                      ? isA
                        ? 'bg-xia-sky'
                        : isB
                          ? 'bg-xia-deep'
                          : 'bg-xia-haze'
                      : 'bg-transparent'
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`flex shrink-0 items-center justify-center rounded-full border-2 transition-all hover:scale-110 ${
                          opt.value === 0 || opt.value === 4
                            ? 'h-10 w-10 sm:h-12 sm:w-12'
                            : opt.value === 1 || opt.value === 3
                              ? 'h-8 w-8 sm:h-10 sm:w-10'
                              : 'h-6 w-6 sm:h-7 sm:w-7'
                        } ${
                          isSelected ? `${borderColor} ${fillColor}` : `${borderColor} bg-white hover:bg-xia-cream/30`
                        }`}
                        title={opt.label}
                        aria-label={opt.label}
                      />
                    )
                  })}
                </div>
                <span className="text-xs font-semibold text-xia-deep">B</span>
              </div>
              <p className="mt-2 text-center text-[11px] text-xia-deep/50">
                从左到右：非常符合A → 不确定 → 非常符合B
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={goPrev}
              className="rounded-full border border-xia-haze px-4 py-2 text-sm text-xia-deep/80 transition hover:border-xia-teal/50"
              disabled={current === 0}
            >
              上一题
            </button>
            <div className="text-sm text-xia-teal/80">
              已完成 {answeredCount}/{total}
            </div>
            <button
              onClick={goNext}
              className="rounded-full border-xia-deep bg-xia-deep px-4 py-2 text-sm text-white transition hover:bg-xia-deep/90"
              disabled={current === total - 1}
            >
              下一题
            </button>
          </div>

          <button
            onClick={() => navigate('/mbti/result')}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              canSubmit
                ? 'bg-xia-deep text-white shadow-md hover:bg-xia-deep/90'
                : 'cursor-not-allowed bg-xia-haze/30 text-xia-haze'
            }`}
            disabled={!canSubmit}
          >
            查看分析结果
          </button>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-xia-haze bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm font-semibold text-xia-deep">
              作答提示
            </div>
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
            title="题目总览"
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
