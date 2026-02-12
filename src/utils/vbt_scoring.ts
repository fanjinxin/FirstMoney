import { vbtQuestions, VBT_DIMENSIONS, type VBTDimensionId } from '../data/vbt'

export type VBTLevel = 'low' | 'moderate' | 'high'

/** 保护力维度：边界、主张、应对 高分=好；敏感度 高分=易受伤 */
export interface VBTDimensionScore {
  id: VBTDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  /** 保护力维度用常规等级；敏感度：高=易受伤，低=心理防线厚 */
  level: VBTLevel
}

/** 易被欺负风险等级：0-100 越高越易被欺负 */
export type VBTVulnerabilityZone = 'low' | 'low_mid' | 'mid' | 'mid_high' | 'high'

export type VBTProfileKey =
  | 'robust'        // 综合稳健型
  | 'boundary_weak' // 边界薄弱型
  | 'assertive_weak'// 主张不足型
  | 'cope_weak'     // 应对不足型
  | 'sensitive_high'// 高敏感型
  | 'combo_weak'    // 多维度薄弱型
  | 'risk_high'     // 高危型

export interface VBTResult {
  dimensionScores: VBTDimensionScore[]
  vulnerabilityIndex: number
  vulnerabilityZone: VBTVulnerabilityZone
  /** 保护力平均（边界+主张+应对）/3 */
  protectAvg: number
  profileKey: VBTProfileKey
  weakestDimension: VBTDimensionScore | null
  strongestProtectDimension: VBTDimensionScore | null
}

function getLevel(dimId: VBTDimensionId, percent: number): VBTLevel {
  if (dimId === 'sensitive') {
    // 敏感度：高=易受伤，所以 high 表示高敏感
    if (percent <= 45) return 'low'
    if (percent >= 70) return 'high'
    return 'moderate'
  }
  // 保护力维度：高=好
  if (percent <= 45) return 'low'
  if (percent >= 70) return 'high'
  return 'moderate'
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
  return {
    id: dimId,
    name: dim.name,
    rawScore: raw,
    maxScore,
    percent: Math.min(100, percent),
    level: getLevel(dimId, Math.min(100, percent)),
  }
}

function getVulnerabilityZone(index: number): VBTVulnerabilityZone {
  if (index <= 20) return 'low'
  if (index <= 40) return 'low_mid'
  if (index <= 60) return 'mid'
  if (index <= 80) return 'mid_high'
  return 'high'
}

function getProfileKey(
  dimensionScores: VBTDimensionScore[],
  vulnerabilityIndex: number
): VBTProfileKey {
  const b = dimensionScores.find(d => d.id === 'boundary')!
  const a = dimensionScores.find(d => d.id === 'assertive')!
  const c = dimensionScores.find(d => d.id === 'cope')!
  const s = dimensionScores.find(d => d.id === 'sensitive')!

  const protectLow = (p: number) => p < 50
  const protectVeryLow = (p: number) => p < 40
  const sensitiveHigh = s.percent >= 65

  const weakCount = [b, a, c].filter(d => protectLow(d.percent)).length
  if (weakCount >= 2 && vulnerabilityIndex >= 60) return 'risk_high'
  if (weakCount >= 2) return 'combo_weak'
  if (protectVeryLow(b.percent) && (protectLow(a.percent) || protectLow(c.percent))) return 'boundary_weak'
  if (protectVeryLow(b.percent)) return 'boundary_weak'
  if (protectVeryLow(a.percent)) return 'assertive_weak'
  if (protectVeryLow(c.percent)) return 'cope_weak'
  if (sensitiveHigh && (protectLow(b.percent) || protectLow(a.percent) || protectLow(c.percent))) return 'sensitive_high'
  if (sensitiveHigh && vulnerabilityIndex >= 55) return 'sensitive_high'
  if (b.percent >= 60 && a.percent >= 60 && c.percent >= 60 && s.percent <= 55) return 'robust'
  return 'robust'
}

/**
 * 易被欺负指数：保护力(边界+主张+应对)越高越不易被欺负；
 * 敏感度越高越易受伤。vulnerabilityIndex = 50 - protect/2 + sensitive/2，0-100 越高越易被欺负
 */
export function calculateVBTResult(answers: Record<string, number>): VBTResult {
  const dimensionScores = VBT_DIMENSIONS.map(d => getDimensionScore(d.id, answers))

  const b = dimensionScores.find(d => d.id === 'boundary')?.percent ?? 0
  const a = dimensionScores.find(d => d.id === 'assertive')?.percent ?? 0
  const c = dimensionScores.find(d => d.id === 'cope')?.percent ?? 0
  const protectAvg = Math.round((b + a + c) / 3)
  const sensitive = dimensionScores.find(d => d.id === 'sensitive')?.percent ?? 0
  const vulnerabilityIndex = Math.round(50 - protectAvg / 2 + sensitive / 2)
  const clamped = Math.min(100, Math.max(0, vulnerabilityIndex))

  const protectDims = dimensionScores.filter(d => d.id !== 'sensitive')
  const weakest = [...dimensionScores].sort((x, y) => {
    if (x.id === 'sensitive') return 1
    if (y.id === 'sensitive') return -1
    return x.percent - y.percent
  })[0] ?? null
  const strongestProtect = protectDims.length > 0
    ? protectDims.reduce((best, d) => (d.percent > best.percent ? d : best))
    : null

  return {
    dimensionScores,
    vulnerabilityIndex: clamped,
    vulnerabilityZone: getVulnerabilityZone(clamped),
    protectAvg,
    profileKey: getProfileKey(dimensionScores, clamped),
    weakestDimension: weakest,
    strongestProtectDimension: strongestProtect,
  }
}
