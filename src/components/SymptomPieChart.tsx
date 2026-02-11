import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type PieItem = {
  name: string
  value: number
}

type SymptomPieChartProps = {
  data: PieItem[]
}

const pieColors = ['#22C55E', '#60A5FA', '#FBBF24', '#FB923C', '#F87171']

export default function SymptomPieChart({ data }: SymptomPieChartProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-emerald-50/60 p-4 shadow-sm">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-semibold text-slate-900">症状等级分布</div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
          分布
        </span>
      </div>
      <div className="mt-3 h-[calc(100%-2.5rem)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{ borderRadius: 12, borderColor: '#E2E8F0' }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={48}
              outerRadius={90}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
