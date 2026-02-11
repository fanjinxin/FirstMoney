import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type RadarItem = {
  name: string
  score: number
  line2: number
  line3: number
}

type FactorRadarChartProps = {
  data: RadarItem[]
}

export default function FactorRadarChart({ data }: FactorRadarChartProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-indigo-50/60 p-4 shadow-sm">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-semibold text-slate-900">10 因子雷达图</div>
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
          轮廓
        </span>
      </div>
      <div className="mt-3 h-[calc(100%-2.5rem)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, borderColor: '#E2E8F0' }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Radar
              dataKey="line2"
              stroke="#94A3B8"
              fillOpacity={0}
              strokeDasharray="4 4"
            />
            <Radar
              dataKey="line3"
              stroke="#64748B"
              fillOpacity={0}
              strokeDasharray="4 4"
            />
            <Radar
              dataKey="score"
              stroke="#4F46E5"
              fill="#6366F1"
              fillOpacity={0.18}
              dot={{ r: 2, fill: '#4F46E5' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
