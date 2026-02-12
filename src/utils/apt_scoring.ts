/**
 * APT 天赋潜能评估计分
 * 每题 1-5 分，反向题：5→1, 4→2, 3→3, 2→4, 1→5
 */
import { aptQuestions, APT_DIMENSIONS, type APTDimensionId } from '../data/apt'

export type APTLevel = 'excellent' | 'good' | 'fair' | 'low'

export interface APTDimensionScore {
  id: APTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  level: APTLevel
  levelLabel: string
}

export interface APTResult {
  dimensionScores: APTDimensionScore[]
  totalScore: number
  maxTotalScore: number
  totalPercent: number
  totalLevel: APTLevel
  topDimensions: APTDimensionScore[]
  weakDimensions: APTDimensionScore[]
  /** 认知型：逻辑+语言+空间；创意型：创造力；人际型：社交；心理型：抗压 */
  groupScores: { id: string; name: string; avg: number; dimensions: APTDimensionScore[] }[]
}

function getDimensionScore(dimId: APTDimensionId, answers: Record<string, number>): APTDimensionScore {
  const dim = APT_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const qData = aptQuestions.find(x => x.id === q)
    const score = qData?.reverse ? 6 - ans : ans
    raw += score
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0
  const p = Math.min(100, percent)

  let level: APTLevel = 'fair'
  let levelLabel = '中等'
  if (p >= 75) { level = 'excellent'; levelLabel = '优秀' }
  else if (p >= 60) { level = 'good'; levelLabel = '较好' }
  else if (p >= 45) { level = 'fair'; levelLabel = '中等' }
  else { level = 'low'; levelLabel = '偏低' }

  return {
    id: dimId,
    name: dim.name,
    rawScore: raw,
    maxScore,
    percent: p,
    level,
    levelLabel,
  }
}

const APT_GROUPS = [
  { id: 'cognitive', name: '认知型', dimIds: ['logic', 'language', 'spatial'] as const },
  { id: 'creative', name: '创意型', dimIds: ['creativity'] as const },
  { id: 'social', name: '人际型', dimIds: ['social'] as const },
  { id: 'psychological', name: '心理型', dimIds: ['resilience'] as const },
] as const

export function calculateAPTResult(answers: Record<string, number>): APTResult {
  const dimensionScores = APT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0)
  const maxTotalScore = aptQuestions.length * 5
  const totalPercent = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0

  let totalLevel: APTResult['totalLevel'] = 'fair'
  if (totalPercent >= 75) totalLevel = 'excellent'
  else if (totalPercent >= 60) totalLevel = 'good'
  else if (totalPercent >= 45) totalLevel = 'fair'
  else totalLevel = 'low'

  const sorted = [...dimensionScores].sort((a, b) => b.percent - a.percent)
  const topDimensions = sorted.slice(0, 3)
  const weakDimensions = sorted.slice(-3).reverse()

  const groupScores = APT_GROUPS.map(g => {
    const dims = dimensionScores.filter(d => (g.dimIds as readonly string[]).includes(d.id))
    const avg = dims.length > 0 ? Math.round(dims.reduce((s, x) => s + x.percent, 0) / dims.length) : 0
    return { id: g.id, name: g.name, avg, dimensions: dims }
  })

  return {
    dimensionScores,
    totalScore,
    maxTotalScore,
    totalPercent,
    totalLevel,
    topDimensions,
    weakDimensions,
    groupScores,
  }
}
