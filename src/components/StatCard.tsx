type StatCardProps = {
  label: string
  value: string
  hint: string
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-2 text-sm text-slate-600">{hint}</div>
    </div>
  )
}
