import { vbtQuestions, VBT_DIMENSIONS, type VBTDimensionId } from '../data/vbt'

export interface VBTDimensionScore {
  id: VBTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
}

export interface VBTResult {
  dimensionScores: VBTDimensionScore[]
  vulnerabilityIndex: number
}

function getDimensionScore(dimId: VBTDimensionId, answers: Record<string, number>): VBTDimensionScore {
  const dim = VBT_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const qData = vbtQuestions.find(x => x.id === q)
    raw += qData?.reverse ? 6 - ans : ans
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0
  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: Math.min(100, percent) }
}

/**
 * 易被欺负指数：边界+主张+应对 越高越不易被欺负；
 * 敏感度越高越易受伤。综合 = (边界+主张+应对)/3 - 敏感度/2，归一化到0-100
 * 此处简化为：vulnerabilityIndex = 100 - 平均(边界,主张,应对) + 敏感度/2，值越高越易被欺负
 */
export function calculateVBTResult(answers: Record<string, number>): VBTResult {
  const dimensionScores = VBT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))

  const b = dimensionScores.find(d => d.id === 'boundary')?.percent ?? 0
  const a = dimensionScores.find(d => d.id === 'assertive')?.percent ?? 0
  const c = dimensionScores.find(d => d.id === 'cope')?.percent ?? 0
  const protect = (b + a + c) / 3
  const sensitive = dimensionScores.find(d => d.id === 'sensitive')?.percent ?? 0
  const vulnerabilityIndex = Math.round(50 - protect / 2 + sensitive / 2)
  const clamped = Math.min(100, Math.max(0, vulnerabilityIndex))

  return {
    dimensionScores,
    vulnerabilityIndex: clamped,
  }
}
