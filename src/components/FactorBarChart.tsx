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
  normal: 'rgb(var(--xia-sky))',
  mild: 'rgb(var(--xia-aqua))',
  moderate: 'rgb(var(--xia-teal))',
  severe: 'rgb(var(--xia-deep))',
  default: 'rgb(var(--xia-haze))',
}

export default function FactorBarChart({ data }: FactorBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    score: Number(item.score.toFixed(2)),
    level: item.level ?? 'default',
  }))

  return (
    <div className="h-80 w-full rounded-2xl border border-xia-haze bg-white/60 p-4 shadow-[0_8px_16px_rgba(15,76,92,0.05)] backdrop-blur-sm">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-semibold text-xia-deep">10 因子横向柱状图</div>
        <span className="rounded-full bg-xia-cream px-2.5 py-0.5 text-[11px] font-semibold text-xia-deep">
          均分
        </span>
      </div>
      <div className="mt-3 h-[calc(100%-2.5rem)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="rgb(var(--xia-haze))" />
            <XAxis
              type="number"
              domain={[0, 5]}
              tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }}
              axisLine={{ stroke: 'rgb(var(--xia-haze))' }}
              tickLine={{ stroke: 'rgb(var(--xia-haze))' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={88}
              tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }}
              axisLine={{ stroke: 'rgb(var(--xia-haze))' }}
              tickLine={{ stroke: 'rgb(var(--xia-haze))' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                borderColor: 'rgb(var(--xia-haze))',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'rgb(var(--xia-deep))',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
              itemStyle={{ color: 'rgb(var(--xia-deep))' }}
              labelStyle={{ fontWeight: 600, color: 'rgb(var(--xia-deep))' }}
              cursor={{ fill: 'rgb(var(--xia-cream))', opacity: 0.4 }}
            />
            <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={12}>
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
