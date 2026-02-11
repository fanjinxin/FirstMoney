type SectionHeaderProps = {
  title: string
  description?: string
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-xia-deep sm:text-2xl">{title}</h2>
      {description ? <p className="text-sm text-xia-deep/80">{description}</p> : null}
    </div>
  )
}
