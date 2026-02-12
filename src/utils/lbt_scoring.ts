import { lbtQuestions } from '../data/lbt'
import { LBT_DIMENSIONS, type LBTDimensionId } from '../data/lbt'

export type LBTLevel = 'low' | 'moderate' | 'high'

export interface LBTDimensionScore {
  id: LBTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  level: LBTLevel
}

export interface LBTResult {
  totalScore: number
  maxTotalScore: number
  percent: number
  level: LBTLevel
  dimensionScores: LBTDimensionScore[]
}

function getLevel(percent: number): LBTLevel {
  if (percent <= 40) return 'low'
  if (percent >= 65) return 'high'
  return 'moderate'
}

function getDimensionScore(dimId: LBTDimensionId, answers: Record<string, number>): LBTDimensionScore {
  const dim = LBT_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (const qId of dim.qIds) {
    const ans = answers[String(qId)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const q = lbtQuestions.find(x => x.id === qId)
    raw += q?.reverse ? 6 - ans : ans
  }

  const maxScore = dim.qIds.length * 5
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

export function calculateLBTResult(answers: Record<string, number>): LBTResult {
  let raw = 0
  for (const q of lbtQuestions) {
    const ans = answers[String(q.id)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    raw += q.reverse ? 6 - ans : ans
  }

  const maxTotalScore = lbtQuestions.length * 5
  const percent = Math.round((raw / maxTotalScore) * 100)
  const cappedPercent = Math.min(100, percent)
  const level = getLevel(cappedPercent)

  const dimensionScores = LBT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))

  return {
    totalScore: raw,
    maxTotalScore,
    percent: cappedPercent,
    level,
    dimensionScores,
  }
}
