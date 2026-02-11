import { Dimension, Question } from '../types'

export type DimensionScore = {
  id: string
  name: string
  score: number
  hint: string
  level?: 'normal' | 'mild' | 'moderate' | 'severe'
}

export type ScoreSummary = {
  total: number
  average: number
  answered: number
  dimensionScores: DimensionScore[]
}

export type Scl90FactorLevel = 'normal' | 'mild' | 'moderate' | 'severe'

export type Scl90FactorScore = {
  id: string
  name: string
  score: number
  level: Scl90FactorLevel
  levelLabel: string
  count: number
  description: string
  detail: string
}

export type Scl90ScoreSummary = {
  basic: {
    totalScore: number
    avgTotal: number
    positiveCount: number
    negativeCount: number
    positiveAvg: number
    totalLevel: string
  }
  factors: Scl90FactorScore[]
  top3Factors: Scl90FactorScore[]
  symptomDist: { name: string; value: number }[]
}

/** RPI 恋爱占有欲：单视角维度分（5–25）、总分（20–100）、等级 */
export type RpiDimensionScore = {
  id: string
  name: string
  /** 该维度 5 题得分之和，范围 5–25 */
  scoreSum: number
  /** 该维度均分，范围 1–5（便于图表） */
  scoreMean: number
  level: 'low' | 'moderate' | 'high' | 'veryHigh'
  levelLabel: string
  hint: string
}

export type RpiPerspectiveSummary = {
  total: number
  level: string
  levelLabel: string
  dimensionScores: RpiDimensionScore[]
  answered: number
}

export type RpiScoreSummary = {
  self: RpiPerspectiveSummary | null
  partner: RpiPerspectiveSummary | null
  /** 双视角均完成时的对比 */
  comparison: {
    dimensionDiffs: { id: string; name: string; selfSum: number; partnerSum: number; diff: number }[]
    summary: string
  } | null
}

function getHint(dimension: Dimension, score: number) {
  if (score < 2.1) return dimension.lowHint
  if (score < 3.1) return dimension.midHint
  return dimension.highHint
}

function getScl90Level(score: number): DimensionScore['level'] {
  if (score < 2) return 'normal'
  if (score < 3) return 'mild'
  if (score < 4) return 'moderate'
  return 'severe'
}

export function calculateScores(
  questions: Question[],
  dimensions: Dimension[],
  answers: Record<string, number>,
): ScoreSummary {
  const dimensionMap = new Map(dimensions.map((d) => [d.id, d]))
  const buckets = new Map<string, number[]>()

  questions.forEach((q) => {
    const value = answers[q.id]
    if (value === undefined) return
    const list = buckets.get(q.dimension) ?? []
    list.push(value)
    buckets.set(q.dimension, list)
  })

  const dimensionScores = dimensions.map((dimension) => {
    const list = buckets.get(dimension.id) ?? []
    const score = list.length
      ? list.reduce((sum, v) => sum + v, 0) / list.length
      : 0
    return {
      id: dimension.id,
      name: dimension.name,
      score,
      hint: getHint(dimension, score),
      level: getScl90Level(score),
    }
  })

  const allScores = Array.from(buckets.values()).flat()
  const answered = allScores.length
  const total = allScores.reduce((sum, v) => sum + v, 0)
  const average = answered ? total / answered : 0

  return {
    total,
    average,
    answered,
    dimensionScores,
  }
}

const scl90FactorConfig = [
  {
    id: 'somatization',
    name: '躯体化',
    ids: [1, 4, 12, 27, 40, 42, 48, 49, 52, 53, 56, 58],
    description: '身体不适、心慌、胸闷、肠胃不适等',
    detail:
      '近期可能出现头痛、心慌、肠胃不适、肌肉紧张、呼吸不畅等身体反应，多与压力和情绪相关。',
  },
  {
    id: 'obsession',
    name: '强迫症状',
    ids: [3, 9, 10, 28, 38, 45, 46, 51, 55, 65],
    description: '反复思考、反复检查、控制不住',
    detail: '存在反复思考、反复检查、追求完美、难以控制的思维或行为倾向。',
  },
  {
    id: 'interpersonal',
    name: '人际关系敏感',
    ids: [6, 21, 34, 36, 37, 41, 61, 69, 73],
    description: '自卑、敏感、在意他人评价',
    detail: '在社交中易自卑、敏感、在意评价、不自在、感觉不被理解。',
  },
  {
    id: 'depression',
    name: '抑郁',
    ids: [5, 14, 15, 20, 22, 26, 29, 30, 31, 32, 54, 71, 79],
    description: '情绪低落、兴趣下降、无望感',
    detail: '情绪偏低落，兴趣下降、精力不足、无助、自责、消极想法增多。',
  },
  {
    id: 'anxiety',
    name: '焦虑',
    ids: [2, 17, 23, 33, 39, 57, 72, 78, 80, 85],
    description: '紧张、担心、坐立不安、恐惧',
    detail: '明显紧张不安、过度担心、心慌、坐立不安、容易恐惧。',
  },
  {
    id: 'hostility',
    name: '敌对',
    ids: [11, 24, 63, 67, 74, 81],
    description: '易怒、烦躁、冲动',
    detail: '情绪易激惹，烦躁、易怒，有冲动或攻击性想法。',
  },
  {
    id: 'phobic',
    name: '恐怖',
    ids: [13, 25, 47, 50, 70, 75, 82],
    description: '怕场所、怕人多、怕单独出门',
    detail: '对场所、人群、外出等存在明显恐惧与回避。',
  },
  {
    id: 'paranoid',
    name: '偏执',
    ids: [8, 18, 43, 68, 76, 83],
    description: '多疑、不信任、感觉被针对',
    detail: '偏多疑、不信任他人、感觉被议论、被针对。',
  },
  {
    id: 'psychotic',
    name: '精神病性',
    ids: [7, 16, 35, 62, 77, 84, 88, 90],
    description: '思维异常、不真实感、疏远感',
    detail: '存在思维不真实、疏远感、怪异想法等体验。',
  },
  {
    id: 'sleep',
    name: '其他（睡眠饮食）',
    ids: [19, 44, 59, 60, 64, 66],
    description: '失眠、早醒、食欲问题',
    detail: '存在睡眠紊乱、食欲异常、早醒、死亡想法等。',
  },
]

function getAnswerByNumber(answers: Record<string, number>, number: number) {
  const value = answers[`s${number}`]
  return typeof value === 'number' ? value : undefined
}

export function calculateScl90Scores(
  questions: Question[],
  dimensions: Dimension[],
  answers: Record<string, number>,
): Scl90ScoreSummary {
  const scores = Array.from({ length: 90 }, (_, index) => {
    return getAnswerByNumber(answers, index + 1) ?? 1
  })
  const totalScore = scores.reduce((sum, val) => sum + val, 0)
  const avgTotal = totalScore / 90
  const positiveCount = scores.filter((val) => val >= 2).length
  const negativeCount = 90 - positiveCount
  const positiveAvg =
    positiveCount > 0 ? (totalScore - negativeCount) / positiveCount : 0

  const factors = scl90FactorConfig.map((item) => {
    const factorScores = item.ids.map((id) => scores[id - 1])
    const factorTotal = factorScores.reduce((sum, val) => sum + val, 0)
    const factorAvg = item.ids.length ? factorTotal / item.ids.length : 0
    const level: Scl90FactorLevel =
      factorAvg < 2 ? 'normal' : factorAvg < 3 ? 'mild' : factorAvg < 4 ? 'moderate' : 'severe'
    const levelLabel =
      level === 'normal' ? '正常' : level === 'mild' ? '轻度' : level === 'moderate' ? '中度' : '重度'

    return {
      id: item.id,
      name: item.name,
      score: factorAvg,
      level,
      levelLabel,
      count: item.ids.length,
      description: item.description,
      detail: item.detail,
    }
  })

  const totalLevel =
    totalScore < 160
      ? '正常'
      : totalScore < 250
        ? '轻度困扰'
        : totalScore < 350
          ? '中度困扰'
          : '重度困扰'

  const top3Factors = [...factors].sort((a, b) => b.score - a.score).slice(0, 3)

  const symptomDist = [
    { name: '正常', value: scores.filter((val) => val === 1).length },
    { name: '轻度', value: scores.filter((val) => val === 2).length },
    { name: '中度', value: scores.filter((val) => val === 3).length },
    { name: '偏重', value: scores.filter((val) => val === 4).length },
    { name: '严重', value: scores.filter((val) => val === 5).length },
  ]

  return {
    basic: {
      totalScore,
      avgTotal,
      positiveCount,
      negativeCount,
      positiveAvg,
      totalLevel,
    },
    factors,
    top3Factors,
    symptomDist,
  }
}

const RPI_DIMENSION_ORDER = ['control', 'jealousy', 'dependency', 'security'] as const

function getRpiTotalLevel(total: number): string {
  if (total <= 25) return '低占有欲'
  if (total <= 50) return '适中占有欲'
  if (total <= 75) return '偏高占有欲'
  return '极高占有欲'
}

function getRpiDimensionLevel(scoreSum: number): RpiDimensionScore['level'] {
  if (scoreSum <= 10) return 'low'
  if (scoreSum <= 15) return 'moderate'
  if (scoreSum <= 20) return 'high'
  return 'veryHigh'
}

function getRpiDimensionLevelLabel(level: RpiDimensionScore['level']): string {
  const map: Record<RpiDimensionScore['level'], string> = {
    low: '低',
    moderate: '适中',
    high: '偏高',
    veryHigh: '极高',
  }
  return map[level]
}

function buildRpiPerspectiveSummary(
  questions: Question[],
  dimensions: Dimension[],
  answers: Record<string, number>,
): RpiPerspectiveSummary | null {
  const buckets = new Map<string, number[]>()
  questions.forEach((q) => {
    const value = answers[q.id]
    if (value === undefined) return
    const list = buckets.get(q.dimension) ?? []
    list.push(value)
    buckets.set(q.dimension, list)
  })
  const answered = Array.from(buckets.values()).flat().length
  if (answered === 0) return null

  const dimensionMap = new Map(dimensions.map((d) => [d.id, d]))
  const dimensionScores: RpiDimensionScore[] = RPI_DIMENSION_ORDER.map((dimId) => {
    const list = buckets.get(dimId) ?? []
    const dimension = dimensionMap.get(dimId)!
    const scoreSum = list.reduce((sum, v) => sum + v, 0)
    const scoreMean = list.length ? scoreSum / list.length : 0
    const level = getRpiDimensionLevel(scoreSum)
    const levelLabel = getRpiDimensionLevelLabel(level)
    const hint =
      scoreMean < 2.1
        ? dimension.lowHint
        : scoreMean < 3.1
          ? dimension.midHint
          : dimension.highHint
    return {
      id: dimension.id,
      name: dimension.name,
      scoreSum,
      scoreMean,
      level,
      levelLabel,
      hint,
    }
  })

  const total = dimensionScores.reduce((sum, d) => sum + d.scoreSum, 0)
  const level = getRpiTotalLevel(total)
  return {
    total,
    level,
    levelLabel: level,
    dimensionScores,
    answered,
  }
}

/**
 * RPI 恋爱占有欲指数（40 题双视角）计分
 * 每维度 5 题，维度分 = 5 题之和（5–25），总分 = 四维度之和（20–100）
 * 等级：1–25 低、26–50 适中、51–75 偏高、76–100 极高
 */
export function calculateRpiScores(
  questionsSelf: Question[],
  questionsPartner: Question[],
  dimensions: Dimension[],
  answersSelf: Record<string, number>,
  answersPartner: Record<string, number>,
): RpiScoreSummary {
  const self = buildRpiPerspectiveSummary(questionsSelf, dimensions, answersSelf)
  const partner = buildRpiPerspectiveSummary(questionsPartner, dimensions, answersPartner)

  let comparison: RpiScoreSummary['comparison'] = null
  if (self && partner) {
    const dimensionDiffs = RPI_DIMENSION_ORDER.map((dimId) => {
      const ds = self.dimensionScores.find((d) => d.id === dimId)!
      const dp = partner.dimensionScores.find((d) => d.id === dimId)!
      return {
        id: dimId,
        name: ds.name,
        selfSum: ds.scoreSum,
        partnerSum: dp.scoreSum,
        diff: ds.scoreSum - dp.scoreSum,
      }
    })
    const maxDiff = dimensionDiffs.reduce(
      (acc, d) => (Math.abs(d.diff) > Math.abs(acc.diff) ? d : acc),
      dimensionDiffs[0],
    )
    const summary =
      maxDiff.diff === 0
        ? '自我与伴侣视角在各维度上较为一致。'
        : maxDiff.diff > 0
          ? `自我视角在「${maxDiff.name}」上高于伴侣视角，可结合沟通进一步澄清。`
          : `伴侣视角在「${maxDiff.name}」上高于自我视角，可结合沟通进一步澄清。`
    comparison = { dimensionDiffs, summary }
  }

  return { self, partner, comparison }
}

/** SRI 性压抑指数：单维度均分 1–5，总分 0–100，五等级 */
export type SriDimensionScore = {
  id: string
  name: string
  score: number
  level: 'veryLow' | 'low' | 'mid' | 'high' | 'veryHigh'
  levelLabel: string
  hint: string
}

export type SriScoreSummary = {
  totalIndex: number
  level: string
  levelLabel: string
  dimensionScores: SriDimensionScore[]
  answered: number
  top3Dimensions: SriDimensionScore[]
}

const SRI_DIMENSION_ORDER = ['expression', 'conflict', 'anxiety', 'inhibition'] as const

function getSriIndexFromMean(mean: number): number {
  if (mean <= 1) return 0
  return Math.round(((mean - 1) / 4) * 100)
}

function getSriLevel(index: number): SriDimensionScore['level'] {
  if (index <= 20) return 'veryLow'
  if (index <= 40) return 'low'
  if (index <= 60) return 'mid'
  if (index <= 80) return 'high'
  return 'veryHigh'
}

function getSriLevelLabel(level: SriDimensionScore['level']): string {
  const map: Record<SriDimensionScore['level'], string> = {
    veryLow: '很低',
    low: '偏低',
    mid: '中等',
    high: '偏高',
    veryHigh: '很高',
  }
  return map[level]
}

/**
 * SRI 性压抑指数计分
 * 部分题目反向计分（高分=低压抑），统一换算后高分=高压抑；总分 0–100，五等级
 */
export function calculateSriScores(
  questions: Question[],
  dimensions: Dimension[],
  answers: Record<string, number>,
  reverseScoreIds: string[],
): SriScoreSummary {
  const getEffective = (id: string, raw: number) =>
    reverseScoreIds.includes(id) ? 6 - raw : raw

  const buckets = new Map<string, number[]>()
  questions.forEach((q) => {
    const raw = answers[q.id]
    if (raw === undefined) return
    const effective = getEffective(q.id, raw)
    const list = buckets.get(q.dimension) ?? []
    list.push(effective)
    buckets.set(q.dimension, list)
  })

  const dimensionMap = new Map(dimensions.map((d) => [d.id, d]))
  const dimensionScores: SriDimensionScore[] = SRI_DIMENSION_ORDER.map((dimId) => {
    const list = buckets.get(dimId) ?? []
    const dimension = dimensionMap.get(dimId)!
    const score = list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0
    const index = getSriIndexFromMean(score)
    const level = getSriLevel(index)
    const levelLabel = getSriLevelLabel(level)
    const hint =
      score < 2.1 ? dimension.lowHint : score < 3.1 ? dimension.midHint : dimension.highHint
    return {
      id: dimension.id,
      name: dimension.name,
      score,
      level,
      levelLabel,
      hint,
    }
  })

  const allScores = Array.from(buckets.values()).flat()
  const answered = allScores.length
  const mean = answered ? allScores.reduce((a, b) => a + b, 0) / answered : 1
  const totalIndex = getSriIndexFromMean(mean)
  const level = getSriLevel(totalIndex)
  const levelLabel = getSriLevelLabel(level)
  const top3Dimensions = [...dimensionScores].sort((a, b) => b.score - a.score).slice(0, 3)

  return {
    totalIndex,
    level,
    levelLabel,
    dimensionScores,
    answered,
    top3Dimensions,
  }
}
