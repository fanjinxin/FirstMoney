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
    <div className="h-72 w-full rounded-2xl border border-xia-haze bg-white/60 p-4 shadow-[0_8px_16px_rgba(15,76,92,0.05)] backdrop-blur-sm">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-semibold text-xia-deep">10 因子雷达图</div>
        <span className="rounded-full bg-xia-cream px-2.5 py-0.5 text-[11px] font-semibold text-xia-deep">
          轮廓
        </span>
      </div>
      <div className="mt-3 h-[calc(100%-2.5rem)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="rgb(var(--xia-haze))" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }}
            />
            <PolarRadiusAxis
              domain={[0, 5]}
              tick={{ fontSize: 11, fill: 'rgb(var(--xia-teal))' }}
              axisLine={{ stroke: 'rgb(var(--xia-haze))' }}
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
            />
            <Radar
              dataKey="line2"
              stroke="rgb(var(--xia-aqua))"
              fillOpacity={0}
              strokeDasharray="4 4"
            />
            <Radar
              dataKey="line3"
              stroke="rgb(var(--xia-haze))"
              fillOpacity={0}
              strokeDasharray="4 4"
            />
            <Radar
              dataKey="score"
              stroke="rgb(var(--xia-deep))"
              fill="rgb(var(--xia-sky))"
              fillOpacity={0.3}
              dot={{ r: 3, fill: 'rgb(var(--xia-deep))' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
