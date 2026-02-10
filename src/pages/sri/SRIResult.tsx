import { Link } from 'react-router-dom'
import DimensionList from '../../components/DimensionList'
import ScoreBarChart from '../../components/ScoreBarChart'
import SectionHeader from '../../components/SectionHeader'
import StatCard from '../../components/StatCard'
import { sriTest } from '../../data/sri'
import { calculateScores } from '../../utils/scoring'
import { loadAnswers } from '../../utils/storage'

function getLevelLabel(avg: number) {
  if (avg < 2) return '开放'
  if (avg < 3) return '平衡'
  if (avg < 4) return '谨慎'
  return '压抑偏高'
}

export default function SRIResult() {
  const answers = loadAnswers(sriTest.id)
  if (!answers) {
    return (
      <div className="space-y-4">
        <SectionHeader title="尚未完成测评" />
        <Link className="text-sm text-slate-900 underline" to="/sri">
          返回 SRI 测试
        </Link>
      </div>
    )
  }

  const summary = calculateScores(sriTest.questions, sriTest.dimensions, answers)
  const level = getLevelLabel(summary.average)
  const topDimensions = [...summary.dimensionScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <div className="space-y-10 animate-fade-in">
      <SectionHeader title={`${sriTest.title} 结果分析`} description={sriTest.subtitle} />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          label="平均水平"
          value={summary.average.toFixed(2)}
          hint={`当前状态：${level}`}
        />
        <StatCard
          label="作答题数"
          value={`${summary.answered}`}
          hint="完整作答有助于分析准确性"
        />
        <StatCard
          label="重点维度"
          value={topDimensions.map((d) => d.name).join(' · ')}
          hint="高分维度值得重点关注"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <ScoreBarChart data={summary.dimensionScores} />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">建议方向</div>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li>• 尝试用“我需要”表达感受，减少自我批评。</li>
            <li>• 与可信赖对象建立安全对话节奏。</li>
            <li>• 逐步明确边界与舒适区，建立稳定的互动感。</li>
          </ul>
        </div>
      </div>

      <DimensionList data={summary.dimensionScores} />
    </div>
  )
}
