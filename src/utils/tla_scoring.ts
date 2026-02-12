import { tlaQuestions, TLA_DIMENSIONS, type TLADimensionId } from '../data/tla'

export interface TLADimensionScore {
  id: TLADimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
}

export interface TLAResult {
  dimensionScores: TLADimensionScore[]
  totalScore: number
  maxTotalScore: number
}

function getDimensionScore(dimId: TLADimensionId, answers: Record<string, number>): TLADimensionScore {
  const dim = TLA_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const qData = tlaQuestions.find(x => x.id === q)
    const score = qData?.reverse ? 6 - ans : ans
    raw += score
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0

  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: Math.min(100, percent) }
}

export function calculateTLAResult(answers: Record<string, number>): TLAResult {
  const dimensionScores = TLA_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0)
  const maxTotalScore = tlaQuestions.length * 5
  return { dimensionScores, totalScore, maxTotalScore }
}
