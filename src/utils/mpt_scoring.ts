import { mptQuestions, MPT_DIMENSIONS, type MPTDimensionId } from '../data/mpt'

export type MPTLevel = 'low' | 'moderate' | 'high'

export interface MPTDimensionScore {
  id: MPTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  level: MPTLevel
}

/** 得分分布特征：均衡 | 鲜明型 | 双高型 | 单高悬殊 */
export type MPTScorePattern = 'balanced' | 'distinct' | 'dual_high' | 'single_dominant'

export interface MPTResult {
  dimensionScores: MPTDimensionScore[]
  totalScore: number
  maxTotalScore: number
  avgPercent: number
  primaryType: MPTDimensionScore
  secondaryType: MPTDimensionScore | null
  /** 主型与次型得分差（若无次型则为与第三维度的差） */
  primarySecondaryGap: number
  /** 得分分布特征，用于更细致的分析 */
  scorePattern: MPTScorePattern
  /** 高分区维度数（≥70%） */
  highCount: number
  /** 低分区维度数（≤45%） */
  lowCount: number
}

function getLevel(percent: number): MPTLevel {
  if (percent <= 45) return 'low'
  if (percent >= 70) return 'high'
  return 'moderate'
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

function getScorePattern(
  sorted: MPTDimensionScore[],
  primarySecondaryGap: number,
  highCount: number,
  lowCount: number
): MPTScorePattern {
  const p = sorted[0]?.percent ?? 0
  const s = sorted[1]?.percent ?? 0
  const range = (sorted[0]?.percent ?? 0) - (sorted[sorted.length - 1]?.percent ?? 0)

  // 四维极均衡：最高与最低差≤15%
  if (range <= 15) return 'balanced'
  // 双高型：主型次型都≥60% 且两者差≤15
  if (p >= 60 && s >= 60 && p - s <= 15) return 'dual_high'
  // 单高悬殊：主型很高(≥75)且其他明显偏低，或高分区多且主型远超次型
  if ((p >= 75 && lowCount >= 2) || (primarySecondaryGap >= 25 && s < 55)) return 'single_dominant'
  return 'distinct'
}

export function calculateMPTResult(answers: Record<string, number>): MPTResult {
  const dimensionScores = MPT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))
  const sorted = [...dimensionScores].sort((a, b) => b.percent - a.percent)
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0)
  const maxTotalScore = mptQuestions.length * 5
  const avgPercent = dimensionScores.length > 0
    ? Math.round(dimensionScores.reduce((s, d) => s + d.percent, 0) / dimensionScores.length)
    : 0
  const primary = sorted[0]
  const secondary = sorted[1] ?? null
  const primarySecondaryGap = primary ? (secondary ? primary.percent - secondary.percent : primary.percent - (sorted[2]?.percent ?? 0)) : 0
  const highCount = dimensionScores.filter(d => d.percent >= 70).length
  const lowCount = dimensionScores.filter(d => d.percent <= 45).length
  const scorePattern = getScorePattern(sorted, primarySecondaryGap, highCount, lowCount)

  return {
    dimensionScores,
    totalScore,
    maxTotalScore,
    avgPercent,
    primaryType: primary!,
    secondaryType: secondary,
    primarySecondaryGap,
    scorePattern,
    highCount,
    lowCount,
  }
}
