type SectionHeaderProps = {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {description ? <p className="text-sm text-slate-600">{description}</p> : null}
    </div>
  )
}
