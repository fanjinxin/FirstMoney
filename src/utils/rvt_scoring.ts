import { rvtQuestions, RVT_DIMENSIONS, type RVTDimensionId } from '../data/rvt'

export type RVTLevel = 'low' | 'moderate' | 'high'

export interface RVTDimensionScore {
  id: RVTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  level: RVTLevel
}

export interface RVTResult {
  dimensionScores: RVTDimensionScore[]
  primaryType: RVTDimensionScore
  secondaryType: RVTDimensionScore | null
  totalScore: number
  maxTotalScore: number
  avgPercent: number
}

function getLevel(percent: number): RVTLevel {
  if (percent <= 45) return 'low'
  if (percent >= 70) return 'high'
  return 'moderate'
}

function getDimensionScore(dimId: RVTDimensionId, answers: Record<string, number>): RVTDimensionScore {
  const dim = RVT_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const qData = rvtQuestions.find(x => x.id === q)
    raw += qData?.reverse ? 6 - ans : ans
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0
  const cappedPercent = Math.min(100, percent)
  return {
    id: dimId,
    name: dim.name,
    rawScore: raw,
    maxScore,
    percent: cappedPercent,
    level: getLevel(cappedPercent),
  }
}

export function calculateRVTResult(answers: Record<string, number>): RVTResult {
  const dimensionScores = RVT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  const sorted = [...dimensionScores].sort((a, b) => b.rawScore - a.rawScore)
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0)
  const maxTotalScore = rvtQuestions.length * 5
  const avgPercent = dimensionScores.length > 0
    ? Math.round(dimensionScores.reduce((s, d) => s + d.percent, 0) / dimensionScores.length)
    : 0
  return {
    dimensionScores,
    primaryType: sorted[0],
    secondaryType: sorted[1] ?? null,
    totalScore,
    maxTotalScore,
    avgPercent,
  }
}
