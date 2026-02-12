/**
 * 动物塑测试图标：使用 lucide-react 图标替代 emoji
 */
import { Bird, Cat, Dog, Fish, Rabbit, type LucideIcon } from 'lucide-react'

const ANIMAL_ICON_MAP: Record<string, LucideIcon> = {
  lion: Cat,
  golden_retriever: Dog,
  cat: Cat,
  owl: Bird,
  dolphin: Fish,
  wolf: Dog,
  rabbit: Rabbit,
  fox: Cat,
  panda: Cat,
  eagle: Bird,
}

type AnimalIconProps = {
  animalId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16 sm:h-20 sm:w-20',
  lg: 'h-24 w-24 sm:h-32 sm:w-32',
}

export default function AnimalIcon({ animalId, className = '', size = 'md' }: AnimalIconProps) {
  const IconComponent = ANIMAL_ICON_MAP[animalId] ?? Cat
  return (
    <IconComponent
      className={`text-xia-deep/80 ${sizeClasses[size]} ${className}`}
      strokeWidth={1.5}
      aria-hidden
    />
  )
}
