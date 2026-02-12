/**
 * 心理年龄测验计分逻辑
 * 总分 0-116，映射心理年龄 20-60+ 岁
 * 七维度：行动与决断、言语与认知、活动与性格、目标与情绪、兴趣与学习、身心状态、心理韧性
 */
import { psychAgeQuestions, PSYCH_AGE_DIMENSIONS, type PsychAgeDimensionId } from '../data/psych_age'

export interface PsychAgeDimensionScore {
  id: PsychAgeDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  /** 该维度得分越低越年轻，percent 高表示该维度偏老化 */
  trend: 'young' | 'balanced' | 'aged'
  trendLabel: string
}

export interface PsychAgeResult {
  totalScore: number
  maxTotalScore: number
  psychAgeRange: string
  psychAgeMin: number
  psychAgeMax: number
  /** 心理年龄区间的中位数估计，用于图表 */
  psychAgeEstimate: number
  dimensionScores: PsychAgeDimensionScore[]
  answeredCount: number
  totalQuestions: number
}

const AGE_BANDS: { minScore: number; maxScore: number; range: string; minAge: number; maxAge: number; estimate: number }[] = [
  { minScore: 0, maxScore: 29, range: '20–29 岁', minAge: 20, maxAge: 29, estimate: 25 },
  { minScore: 30, maxScore: 49, range: '30–39 岁', minAge: 30, maxAge: 39, estimate: 35 },
  { minScore: 50, maxScore: 64, range: '40–49 岁', minAge: 40, maxAge: 49, estimate: 45 },
  { minScore: 65, maxScore: 74, range: '50–59 岁', minAge: 50, maxAge: 59, estimate: 55 },
  { minScore: 75, maxScore: 79, range: '60–69 岁', minAge: 60, maxAge: 69, estimate: 65 },
  { minScore: 80, maxScore: 200, range: '70 岁以上', minAge: 70, maxAge: 80, estimate: 75 },
]

function getAgeBand(totalScore: number) {
  for (const band of AGE_BANDS) {
    if (totalScore >= band.minScore && totalScore <= band.maxScore) return band
  }
  return AGE_BANDS[AGE_BANDS.length - 1]
}

function getDimensionTrend(percent: number): { trend: PsychAgeDimensionScore['trend']; label: string } {
  if (percent <= 33) return { trend: 'young', label: '偏年轻化' }
  if (percent <= 66) return { trend: 'balanced', label: '适中' }
  return { trend: 'aged', label: '偏成熟/偏老化' }
}

export function calculatePsychAgeResult(answers: Record<string | number, number>): PsychAgeResult {
  let totalScore = 0
  const dimScores: Record<PsychAgeDimensionId, { raw: number; max: number }> = {} as Record<
    PsychAgeDimensionId,
    { raw: number; max: number }
  >
  PSYCH_AGE_DIMENSIONS.forEach(d => {
    dimScores[d.id] = { raw: 0, max: 0 }
  })

  psychAgeQuestions.forEach(q => {
    const selectedIndex = answers[q.id]
    dimScores[q.dimension].max += Math.max(...q.scores)
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex <= 2) {
      const s = q.scores[selectedIndex]
      totalScore += s
      dimScores[q.dimension].raw += s
    }
  })

  const band = getAgeBand(totalScore)
  const dimensionScores: PsychAgeDimensionScore[] = PSYCH_AGE_DIMENSIONS.map(dim => {
    const { raw, max } = dimScores[dim.id]
    const percent = max > 0 ? Math.round((raw / max) * 100) : 0
    const { trend, label } = getDimensionTrend(percent)
    return {
      id: dim.id,
      name: dim.name,
      rawScore: raw,
      maxScore: max,
      percent,
      trend,
      trendLabel: label,
    }
  })

  const maxTotalScore = psychAgeQuestions.reduce((s, q) => s + Math.max(...q.scores), 0)
  return {
    totalScore,
    maxTotalScore,
    psychAgeRange: band.range,
    psychAgeMin: band.minAge,
    psychAgeMax: band.maxAge,
    psychAgeEstimate: band.estimate,
    dimensionScores,
    answeredCount: psychAgeQuestions.filter(q => answers[q.id] !== undefined).length,
    totalQuestions: psychAgeQuestions.length,
  }
}
