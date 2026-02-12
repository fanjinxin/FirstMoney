/**
 * AAT 学习适应性测验计分逻辑
 * 12 因子，每题 3 选一：正向题 ①②③→3,2,1；反向题 ①②③→1,2,3
 * 每题满分 3 分，每因子约 7 题，因子满分约 20，按百分制换算 0-100
 */
import { aatQuestions, AAT_DIMENSIONS, type AATDimensionId } from '../data/aat'

export interface AATFactorScore {
  id: AATDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number // 0-100
  level: 'good' | 'fair' | 'poor' | 'veryPoor'
  levelLabel: string
}

export interface AATResultData {
  factorScores: AATFactorScore[]
  totalPercent: number
  answeredCount: number
  totalQuestions: number
}

/** 选项得分：selectedIndex 0,1,2 → 正向 3,2,1 或 反向 1,2,3 */
function getOptionScore(selectedIndex: number, reverse: boolean): number {
  if (reverse) return selectedIndex + 1 // 0→1, 1→2, 2→3
  return 3 - selectedIndex // 0→3, 1→2, 2→1
}

/** 百分制转等级 */
function percentToLevel(percent: number): { level: AATFactorScore['level']; label: string } {
  if (percent >= 70) return { level: 'good', label: '较好' }
  if (percent >= 50) return { level: 'fair', label: '中等' }
  if (percent >= 30) return { level: 'poor', label: '较差' }
  return { level: 'veryPoor', label: '差' }
}

export function calculateAATResult(answers: Record<string | number, number>): AATResultData {
  const dimScores: Record<AATDimensionId, { raw: number; max: number }> = {} as Record<
    AATDimensionId,
    { raw: number; max: number }
  >
  AAT_DIMENSIONS.forEach(d => {
    dimScores[d.id] = { raw: 0, max: 0 }
  })

  aatQuestions.forEach(q => {
    const selectedIndex = answers[q.id]
    dimScores[q.dimension].max += 3
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex <= 2) {
      dimScores[q.dimension].raw += getOptionScore(selectedIndex, q.reverse)
    }
  })

  const factorScores: AATFactorScore[] = AAT_DIMENSIONS.map(dim => {
    const { raw, max } = dimScores[dim.id]
    const percent = max > 0 ? Math.round((raw / max) * 100) : 0
    const { level, label } = percentToLevel(percent)
    return {
      id: dim.id,
      name: dim.name,
      rawScore: raw,
      maxScore: max,
      percent,
      level,
      levelLabel: label,
    }
  })

  const totalRaw = factorScores.reduce((s, f) => s + f.rawScore, 0)
  const totalMax = factorScores.reduce((s, f) => s + f.maxScore, 0)
  const totalPercent = totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0
  const answeredCount = aatQuestions.filter(q => answers[q.id] !== undefined).length

  return {
    factorScores,
    totalPercent,
    answeredCount,
    totalQuestions: aatQuestions.length,
  }
}
