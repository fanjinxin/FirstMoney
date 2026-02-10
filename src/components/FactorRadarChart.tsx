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
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-white p-4">
      <div className="px-1 text-sm font-semibold text-slate-900">10 因子雷达图</div>
      <div className="mt-3 h-[calc(100%-2rem)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
            <Tooltip />
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
            <Radar dataKey="score" stroke="#0F172A" fill="#0F172A" fillOpacity={0.15} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
