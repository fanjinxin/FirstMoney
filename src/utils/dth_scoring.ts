/**
 * DTH 黑暗三角人格测试计分
 * 5 点量表，反向题 5→1,4→2,3→3,2→4,1→5
 */
import { dthQuestions, DTH_DIMENSIONS, type DTHDimensionId } from '../data/dth'

export interface DTHDimensionScore {
  id: DTHDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  level: 'low' | 'moderate' | 'high'
}

export interface DTHResult {
  dimensionScores: DTHDimensionScore[]
  totalScore: number
  maxTotalScore: number
}

function getDimensionScore(dimId: DTHDimensionId, answers: Record<string, number>): DTHDimensionScore {
  const dim = DTH_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const qData = dthQuestions.find(x => x.id === q)
    const score = qData?.reverse ? 6 - ans : ans
    raw += score
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0
  let level: DTHDimensionScore['level'] = 'moderate'
  if (percent <= 40) level = 'low'
  else if (percent >= 65) level = 'high'

  return {
    id: dimId,
    name: dim.name,
    rawScore: raw,
    maxScore,
    percent: Math.min(100, percent),
    level,
  }
}

export function calculateDTHResult(answers: Record<string, number>): DTHResult {
  const dimensionScores = DTH_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0)
  const maxTotalScore = dthQuestions.length * 5

  return {
    dimensionScores,
    totalScore,
    maxTotalScore,
  }
}
