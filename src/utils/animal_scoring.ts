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

/** 欧氏距离 */
function euclidean(a: Record<AnimalDimension, number>, b: Record<AnimalDimension, number>): number {
  let sumSq = 0
  DIMS.forEach(dim => {
    const d = (a[dim] ?? 0) - (b[dim] ?? 0)
    sumSq += d * d
  })
  return Math.sqrt(sumSq)
}

export function calculateAnimalResult(answers: Record<string | number, number>): AnimalResultData {
  const rawScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 }
  const maxScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 }

  animalQuestions.forEach(q => {
    const maxOptionScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 }
    q.options.forEach(opt => {
      DIMS.forEach(dim => {
        const v = opt.score[dim] ?? 0
        if (v > maxOptionScores[dim]) maxOptionScores[dim] = v
      })
    })
    DIMS.forEach(dim => (maxScores[dim] += maxOptionScores[dim]))

    const idx = answers[q.id] ?? answers[String(q.id)]
    if (idx == null || !q.options[idx]) return

    const opt = q.options[idx]
    const score = opt.score
    DIMS.forEach(dim => {
      if (score[dim] != null) rawScores[dim] += score[dim]!
    })
  })

  // 归一化维度到 0–10（雷达图用）
  const normalizedScores: Record<AnimalDimension, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 }
  DIMS.forEach(dim => {
    normalizedScores[dim] = maxScores[dim] > 0 ? (rawScores[dim] / maxScores[dim]) * 10 : NEUTRAL
  })

  // 主动物/次动物：基于用户五维分数与各动物原型的欧氏距离，选最近的 2 个
  const userProfile: Record<AnimalDimension, number> = { ...normalizedScores }
  const byDistance = animalArchetypes
    .map(a => ({ animal: a, distance: euclidean(userProfile, a.dimensions) }))
    .sort((a, b) => a.distance - b.distance)

  const mainAnimal = byDistance[0].animal
  const secondaryAnimal = byDistance[1].animal

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
