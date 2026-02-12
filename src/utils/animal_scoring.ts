/**
 * 动物塑测试计分逻辑
 * 每题选择直接向各动物累积相似度，避免单一“中间型”占据优势
 */
import {
  AnimalDimension,
  AnimalQuestion,
  AnimalArchetype,
  animalQuestions,
  animalArchetypes,
} from '../data/animal_sculpture'

export interface AnimalResultData {
  scores: Record<AnimalDimension, number>
  mainAnimal: AnimalArchetype
  secondaryAnimal: AnimalArchetype
  radarData: { subject: string; A: number; fullMark: number }[]
  compoundDimensions: {
    socialEnergy: number
    resilience: number
    drive: number
    adaptability: number
  }
}

const DIMS: AnimalDimension[] = ['E', 'A', 'C', 'N', 'O']
const NEUTRAL = 5 // 未涉及的维度用 5 作为中性值

/** 根据选项的维度分数构建完整画像（缺省维度填 5） */
function optionProfile(score: Partial<Record<AnimalDimension, number>>): Record<AnimalDimension, number> {
  const profile: Record<AnimalDimension, number> = { E: NEUTRAL, A: NEUTRAL, C: NEUTRAL, N: NEUTRAL, O: NEUTRAL }
  DIMS.forEach(dim => {
    if (score[dim] != null) profile[dim] = score[dim]!
  })
  return profile
}

/** 欧氏距离 */
function euclidean(a: Record<AnimalDimension, number>, b: Record<AnimalDimension, number>): number {
  let sumSq = 0
  DIMS.forEach(dim => {
    const d = a[dim] - b[dim]
    sumSq += d * d
  })
  return Math.sqrt(sumSq)
}

/** 相似度：距离越小分数越高 */
function similarity(distance: number): number {
  return 1 / (1 + distance)
}

/** 选项区分度：与中性(5,5,5,5,5)距离越远，区分度越高；中性选项降权，避免主导结果 */
function optionWeight(profile: Record<AnimalDimension, number>): number {
  const centerDist = euclidean(profile, { E: 5, A: 5, C: 5, N: 5, O: 5 })
  return Math.min(1.5, 0.5 + centerDist / 5) // 中性约 0.5x，极端约 1.5x
}

export function calculateAnimalResult(answers: Record<string | number, number>): AnimalResultData {
  const rawScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 }
  const maxScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 }

  /** 每题选择向各动物累积的相似度（借鉴 PDP 的“每题计入类型”思路） */
  const animalAffinity: Record<string, number> = {}
  animalArchetypes.forEach(a => (animalAffinity[a.id] = 0))

  animalQuestions.forEach(q => {
    const maxOptionScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 }
    q.options.forEach(opt => {
      DIMS.forEach(dim => {
        const v = opt.score[dim] ?? 0
        if (v > maxOptionScores[dim]) maxOptionScores[dim] = v
      })
    })
    DIMS.forEach(dim => (maxScores[dim] += maxOptionScores[dim]))

    const idx = answers[q.id]
    if (idx == null || !q.options[idx]) return

    const opt = q.options[idx]
    const score = opt.score
    DIMS.forEach(dim => {
      if (score[dim] != null) rawScores[dim] += score[dim]!
    })

    // 当前选项的维度画像；中性选项降权，使极端型动物（狮、猫、鹰等）有更多机会
    const profile = optionProfile(score)
    const weight = optionWeight(profile)
    animalArchetypes.forEach(animal => {
      const dist = euclidean(profile, animal.dimensions)
      animalAffinity[animal.id] += weight * similarity(dist)
    })
  })

  // 归一化维度到 0–10（雷达图用）
  const normalizedScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 }
  DIMS.forEach(dim => {
    normalizedScores[dim] = maxScores[dim] > 0 ? (rawScores[dim] / maxScores[dim]) * 10 : NEUTRAL
  })

  // 主动物：累积相似度最高
  const byAffinity = animalArchetypes
    .map(a => ({ animal: a, affinity: animalAffinity[a.id] }))
    .sort((a, b) => b.affinity - a.affinity)

  const mainAnimal = byAffinity[0].animal
  const secondaryAnimal = byAffinity[1].animal

  const dimensionLabels: Record<AnimalDimension, string> = {
    E: '外向性 (E)',
    A: '亲和性 (A)',
    C: '尽责性 (C)',
    N: '敏感性 (N)',
    O: '开放性 (O)',
  }

  const radarData = DIMS.map(dim => ({
    subject: dimensionLabels[dim],
    A: parseFloat(normalizedScores[dim].toFixed(2)),
    fullMark: 10,
  }))

  const compoundDimensions = {
    socialEnergy: (normalizedScores.E + normalizedScores.A) / 2,
    resilience: (normalizedScores.C + (10 - normalizedScores.N)) / 2,
    drive: (normalizedScores.E + normalizedScores.C) / 2,
    adaptability: (normalizedScores.O + normalizedScores.A) / 2,
  }

  return {
    scores: normalizedScores,
    mainAnimal,
    secondaryAnimal,
    radarData,
    compoundDimensions,
  }
}
