type ProgressBarProps = {
  value: number
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-slate-900 transition-all animate-fill-bar"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
