import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DimensionScore } from '../utils/scoring'

type ScoreBarChartProps = {
  data: DimensionScore[]
}

export default function ScoreBarChart({ data }: ScoreBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    score: Number(item.score.toFixed(2)),
  }))

  return (
    <div className="h-64 w-full rounded-2xl border border-slate-200 bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, borderColor: '#E2E8F0' }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="score" fill="#0F172A" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
