import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DimensionScore } from '../utils/scoring'

type FactorBarChartProps = {
  data: DimensionScore[]
}

const levelColors: Record<string, string> = {
  normal: '#34D399',
  mild: '#60A5FA',
  moderate: '#FBBF24',
  severe: '#F87171',
  default: '#0F172A',
}

export default function FactorBarChart({ data }: FactorBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    score: Number(item.score.toFixed(2)),
    level: item.level ?? 'default',
  }))

  return (
    <div className="h-80 w-full rounded-2xl border border-slate-200 bg-white p-4">
      <div className="px-1 text-sm font-semibold text-slate-900">10 因子横向柱状图</div>
      <div className="mt-3 h-[calc(100%-2rem)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" />
            <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, borderColor: '#E2E8F0' }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Bar dataKey="score" radius={[6, 6, 6, 6]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={levelColors[entry.level] ?? levelColors.default}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
