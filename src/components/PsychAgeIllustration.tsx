/**
 * 心理年龄测验 - 年龄段图标
 * 支持 6 档：20-29, 30-39, 40-49, 50-59, 60-69, 70+
 * 使用 src/assets/age-test/ 下的年龄段图片（50-59 暂用 audit40-50）
 */
import { useState } from 'react'
import { User } from 'lucide-react'
import audit2030 from '../assets/age-test/audit20-30.jpg'
import audit3040 from '../assets/age-test/audit30-40.jpg'
import audit4050 from '../assets/age-test/audit40-50.jpg'
import audit60100 from '../assets/age-test/audit60-100.jpg'

type AgeRangeKey = '20-29' | '30-39' | '40-49' | '50-59' | '60-69' | '70+'

const AGE_IMAGES: Record<AgeRangeKey, string> = {
  '20-29': audit2030,
  '30-39': audit3040,
  '40-49': audit4050,
  '50-59': audit4050,
  '60-69': audit60100,
  '70+': audit60100,
}

/** 心理年龄区间 → 插画 key */
export function getPsychAgeIllustrationKey(psychAgeRange: string): AgeRangeKey {
  if (/70|岁以上/.test(psychAgeRange)) return '70+'
  if (/60|69/.test(psychAgeRange)) return '60-69'
  if (/50|59/.test(psychAgeRange)) return '50-59'
  if (/40|49/.test(psychAgeRange)) return '40-49'
  if (/30|39/.test(psychAgeRange)) return '30-39'
  if (/20|29/.test(psychAgeRange)) return '20-29'
  return '30-39'
}

interface PsychAgeIllustrationProps {
  psychAgeRange: string
  /** 可选：传入自定义图片 URL 覆盖本地图标 */
  imgUrl?: string | null
  className?: string
}

export default function PsychAgeIllustration({ psychAgeRange, imgUrl, className }: PsychAgeIllustrationProps) {
  const [imgError, setImgError] = useState(false)
  const key = getPsychAgeIllustrationKey(psychAgeRange)
  const src = imgUrl ?? AGE_IMAGES[key]

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={`心理年龄 ${key}`}
        className={`h-full w-full rounded-full object-contain ${className ?? ''}`}
        loading="eager"
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-xia-teal/15 ${className ?? ''}`}>
      <User className="h-1/2 w-1/2 text-xia-teal" aria-hidden />
    </div>
  )
}
