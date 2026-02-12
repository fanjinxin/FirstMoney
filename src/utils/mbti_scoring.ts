import {
  mbtiQuestions,
  mbtiTypeInfos,
  type MBTIDimension,
  type MBTIPole,
  type MBTITypeInfo,
} from '../data/mbti'

export interface MBTIDimensionScore {
  dimension: MBTIDimension
  poleA: MBTIPole
  poleB: MBTIPole
  scoreA: number
  scoreB: number
  dominant: MBTIPole
  percentage: number // 主导维度占比 0-100
  label: string
}

export interface MBTIResultData {
  type: string // 四字母，如 INTJ
  typeInfo: MBTITypeInfo
  dimensionScores: MBTIDimensionScore[]
  radarData: { subject: string; A: number; fullMark: number }[]
  dimensionLabels: Record<MBTIDimension, string>
}

const DIMENSION_LABELS: Record<MBTIDimension, string> = {
  EI: '外向-内向 (E/I)',
  SN: '实感-直觉 (S/N)',
  TF: '思考-情感 (T/F)',
  JP: '判断-知觉 (J/P)',
}

const POLE_LABELS: Record<MBTIPole, string> = {
  E: '外向',
  I: '内向',
  S: '实感',
  N: '直觉',
  T: '思考',
  F: '情感',
  J: '判断',
  P: '知觉',
}

/**
 * 5点量表计分：0=非常符合A(+2), 1=比较符合A(+1), 2=不确定(0), 3=比较符合B(+1), 4=非常符合B(+2)
 */
function getScoreContribution(value: number): { forA: number; forB: number } {
  if (value === 0) return { forA: 2, forB: 0 }
  if (value === 1) return { forA: 1, forB: 0 }
  if (value === 2) return { forA: 0, forB: 0 }
  if (value === 3) return { forA: 0, forB: 1 }
  if (value === 4) return { forA: 0, forB: 2 }
  return { forA: 0, forB: 0 }
}

export function calculateMBTIResult(
  answers: Record<string, number>
): MBTIResultData {
  const scores: Record<MBTIPole, number> = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  }

  mbtiQuestions.forEach((q) => {
    const selectedValue = answers[q.id]
    if (selectedValue !== undefined && selectedValue >= 0 && selectedValue <= 4) {
      const { forA, forB } = getScoreContribution(selectedValue)
      scores[q.optionA.pole] += forA
      scores[q.optionB.pole] += forB
    }
  })

  const dimensionPairs: [MBTIDimension, [MBTIPole, MBTIPole]][] = [
    ['EI', ['E', 'I']],
    ['SN', ['S', 'N']],
    ['TF', ['T', 'F']],
    ['JP', ['J', 'P']],
  ]

  let type = ''
  const dimensionScores: MBTIDimensionScore[] = []

  dimensionPairs.forEach(([dim, [poleA, poleB]]) => {
    const scoreA = scores[poleA]
    const scoreB = scores[poleB]
    const total = scoreA + scoreB
    const dominant = scoreA >= scoreB ? poleA : poleB
    const percentage = total > 0
      ? Math.round((Math.max(scoreA, scoreB) / total) * 100)
      : 50

    type += dominant
    dimensionScores.push({
      dimension: dim,
      poleA,
      poleB,
      scoreA,
      scoreB,
      dominant,
      percentage,
      label: DIMENSION_LABELS[dim],
    })
  })

  const typeInfo = mbtiTypeInfos[type] ?? {
    type,
    name: type,
    nameEn: type,
    emoji: '', // 不再使用 emoji，MBTIAvatar 回退时显示 Puzzle 图标
    slogan: '独特的你',
    description: '基于你的作答，你呈现出的性格特质组合。',
    strengths: [],
    weaknesses: [],
    career: [],
    relationships: '保持开放心态，与不同人格类型的人交流。',
    workStyle: '根据你的特质，寻找适合自己的工作方式。',
    stressCoping: '了解自己的压力来源，找到适合的放松方式。',
  }

  const radarData = dimensionPairs.map(([dim], i) => {
    const ds = dimensionScores[i]
    const total = ds.scoreA + ds.scoreB
    const value = total > 0
      ? 5 + (ds.scoreA - ds.scoreB) / total * 5
      : 5
    const clamped = Math.max(0, Math.min(10, value))
    return {
      subject: DIMENSION_LABELS[dim],
      A: parseFloat(clamped.toFixed(2)),
      fullMark: 10,
    }
  })

  return {
    type,
    typeInfo,
    dimensionScores,
    radarData,
    dimensionLabels: DIMENSION_LABELS,
  }
}

export { POLE_LABELS }
