import { ybtQuestions, YBT_DIMENSIONS, type YBTDimensionId } from '../data/ybt'

export type YBTLevel = 'low' | 'moderate' | 'high'

export interface YBTDimensionScore {
  id: YBTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  level: YBTLevel
}

export interface YBTResult {
  dimensionScores: YBTDimensionScore[]
  totalScore: number
  maxTotalScore: number
  avgPercent: number
}

function getLevel(percent: number): YBTLevel {
  if (percent <= 45) return 'low'
  if (percent >= 70) return 'high'
  return 'moderate'
}

function getDimensionScore(dimId: YBTDimensionId, answers: Record<string, number>): YBTDimensionScore {
  const dim = YBT_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const qData = ybtQuestions.find(x => x.id === q)
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

export function calculateYBTResult(answers: Record<string, number>): YBTResult {
  const dimensionScores = YBT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0)
  const maxTotalScore = ybtQuestions.length * 5
  const avgPercent = dimensionScores.length > 0
    ? Math.round(dimensionScores.reduce((s, d) => s + d.percent, 0) / dimensionScores.length)
    : 0
  return {
    dimensionScores,
    totalScore,
    maxTotalScore,
    avgPercent,
  }
}
