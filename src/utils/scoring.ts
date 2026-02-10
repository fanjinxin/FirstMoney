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
