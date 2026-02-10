import { useState } from 'react'
import { Link } from 'react-router-dom'
import DimensionList from '../../components/DimensionList'
import ScoreBarChart from '../../components/ScoreBarChart'
import SectionHeader from '../../components/SectionHeader'
import StatCard from '../../components/StatCard'
import { rpiTest } from '../../data/rpi'
import { calculateScores } from '../../utils/scoring'
import { loadAnswers } from '../../utils/storage'

type Perspective = 'self' | 'partner'

const perspectiveLabels: Record<Perspective, string> = {
  self: '自我视角',
  partner: '伴侣视角',
}

function getLevelLabel(avg: number) {
  if (avg < 2) return '平稳'
  if (avg < 3) return '轻度'
  if (avg < 4) return '中度'
  return '较高'
}

export default function RPIResult() {
  const [view, setView] = useState<Perspective>('self')

  const questions = rpiTest.questions.filter((q) => q.id.startsWith(`${view}-`))
  const answers = loadAnswers(`${rpiTest.id}-${view}`)

  if (!answers) {
    return (
      <div className="space-y-4">
        <SectionHeader title="尚未完成测评" />
        <Link className="text-sm text-slate-900 underline" to="/rpi">
          返回 RPI 测试
        </Link>
      </div>
    )
  }

  const summary = calculateScores(questions, rpiTest.dimensions, answers)
  const level = getLevelLabel(summary.average)
  const topDimensions = [...summary.dimensionScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <div className="space-y-10 animate-fade-in">
      <SectionHeader title={`${rpiTest.title} 结果分析`} description={rpiTest.subtitle} />

      <div className="flex flex-wrap gap-3">
        {(['self', 'partner'] as Perspective[]).map((key) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              view === key
                ? 'bg-slate-900 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {perspectiveLabels[key]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          label="平均水平"
          value={summary.average.toFixed(2)}
          hint={`占有欲强度：${level}`}
        />
        <StatCard
          label="作答题数"
          value={`${summary.answered}`}
          hint="双视角结果可用于对照沟通"
        />
        <StatCard
          label="重点维度"
          value={topDimensions.map((d) => d.name).join(' · ')}
          hint="关注高分维度带来的互动模式"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <ScoreBarChart data={summary.dimensionScores} />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">沟通建议</div>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li>• 将“我感到”而非“你总是”的表达方式用于对话。</li>
            <li>• 对安全感需求给出可执行的具体约定。</li>
            <li>• 如果分歧持续，建议共同建立边界与信任机制。</li>
          </ul>
        </div>
      </div>

      <DimensionList data={summary.dimensionScores} />
    </div>
  )
}
