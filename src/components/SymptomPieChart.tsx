import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type PieItem = {
  name: string
  value: number
}

type SymptomPieChartProps = {
  data: PieItem[]
}

const pieColors = [
  'rgb(var(--xia-sky))',
  'rgb(var(--xia-aqua))',
  'rgb(var(--xia-mint))',
  'rgb(var(--xia-teal))',
  'rgb(var(--xia-deep))',
]

export default function SymptomPieChart({ data }: SymptomPieChartProps) {
  return (
    <div className="h-72 w-full rounded-2xl border border-xia-haze bg-white/60 p-4 shadow-[0_8px_16px_rgba(15,76,92,0.05)] backdrop-blur-sm">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-semibold text-xia-deep">症状等级分布</div>
        <span className="rounded-full bg-xia-cream px-2.5 py-0.5 text-[11px] font-semibold text-xia-deep">
          分布
        </span>
      </div>
      <div className="mt-3 h-[calc(100%-5rem)] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
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
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={36}
              outerRadius={68}
              paddingAngle={2}
              stroke="rgb(var(--xia-cream))"
              strokeWidth={2}
              labelLine={{ stroke: 'rgb(var(--xia-haze))', strokeWidth: 1 }}
              label={({ cx, x, y, name, percent }) => (
                <text
                  x={x}
                  y={y}
                  fill="rgb(var(--xia-deep))"
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  className="text-[10px] font-medium"
                >
                  {`${name} ${(percent * 100).toFixed(0)}%`}
                </text>
              )}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-xia-teal">
        {data.map((item, index) => (
          <div key={item.name} className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: pieColors[index % pieColors.length] }}
            />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
