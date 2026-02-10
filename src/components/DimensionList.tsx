import { DimensionScore } from '../utils/scoring'

type DimensionListProps = {
  data: DimensionScore[]
}

export default function DimensionList({ data }: DimensionListProps) {
  const levelLabels: Record<string, string> = {
    normal: '正常',
    mild: '轻度',
    moderate: '中度',
    severe: '重度',
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">{item.name}</div>
            <div className="text-sm text-slate-500">
              均值 {item.score.toFixed(2)}
              {item.level ? ` · ${levelLabels[item.level]}` : ''}
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-600">{item.hint}</div>
        </div>
      ))}
    </div>
  )
}
