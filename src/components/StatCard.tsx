type StatCardProps = {
  label: string
  value: string
  hint: string
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-xia-haze bg-white p-5 shadow-sm">
      <div className="text-xs uppercase tracking-wider text-xia-deep/40">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-xia-deep">{value}</div>
      <div className="mt-2 text-sm text-xia-deep/80">{hint}</div>
    </div>
  )
}
