type SectionHeaderProps = {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
      {description ? <p className="text-sm text-slate-600">{description}</p> : null}
    </div>
  )
}
