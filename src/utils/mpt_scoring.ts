import { mptQuestions, MPT_DIMENSIONS, type MPTDimensionId } from '../data/mpt'

export interface MPTDimensionScore {
  id: MPTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
}

export interface MPTResult {
  dimensionScores: MPTDimensionScore[]
  totalScore: number
  maxTotalScore: number
}

function getDimensionScore(dimId: MPTDimensionId, answers: Record<string, number>): MPTDimensionScore {
  const dim = MPT_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const qData = mptQuestions.find(x => x.id === q)
    raw += qData?.reverse ? 6 - ans : ans
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0
  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: Math.min(100, percent) }
}

export function calculateMPTResult(answers: Record<string, number>): MPTResult {
  const dimensionScores = MPT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  return {
    dimensionScores,
    totalScore: dimensionScores.reduce((s, d) => s + d.rawScore, 0),
    maxTotalScore: mptQuestions.length * 5,
  }
}
