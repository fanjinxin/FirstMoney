/**
 * HIT 霍兰德职业兴趣测试计分
 * 是=1 分，否=0 分；取前三高分组成霍兰德代码（如 RIA）
 */
import { hitQuestions, HIT_DIMENSIONS, type HITDimensionId } from '../data/hit'

export interface HITDimensionScore {
  id: HITDimensionId
  name: string
  nameEn: string
  rawScore: number
  maxScore: number
  percent: number
}

export interface HITResult {
  dimensionScores: HITDimensionScore[]
  hollandCode: string
  topThree: HITDimensionScore[]
}

function getDimensionScore(dimId: HITDimensionId, answers: Record<string, number>): HITDimensionScore {
  const dim = HIT_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === 1) raw += 1 // 是=1
  }

  const maxScore = dim.qEnd - dim.qStart + 1
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0

  return {
    id: dimId,
    name: dim.name,
    nameEn: dim.nameEn,
    rawScore: raw,
    maxScore,
    percent: Math.min(100, percent),
  }
}

export function calculateHITResult(answers: Record<string, number>): HITResult {
  const dimensionScores = HIT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  const sorted = [...dimensionScores].sort((a, b) => b.rawScore - a.rawScore)
  const topThree = sorted.slice(0, 3)
  const hollandCode = topThree.map(t => t.id).join('')

  return {
    dimensionScores,
    hollandCode,
    topThree,
  }
}
