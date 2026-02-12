/**
 * LBT 恋爱脑测试 - 综合结论、维度解读、建议
 */
import type { LBTDimensionId } from './lbt'
import type { LBTDimensionScore } from '../utils/lbt_scoring'

export const LBT_LEVEL_LABELS = {
  low: '偏低',
  moderate: '适中',
  high: '偏高',
} as const

export type LBTProfileKey = 'rational' | 'balanced' | 'invested' | 'obsessive'

export interface LBTProfileInfo {
  title: string
  summary: string
  dominantNote: string
  advice: string
}

export const LBT_PROFILES: Record<LBTProfileKey, LBTProfileInfo> = {
  rational: {
    title: '理性型',
    summary: '你的恋爱脑程度整体偏低，能够较好地在恋爱与生活中保持平衡。情感依赖、优先倾斜均不高，理性平衡能力较强，不易因感情失去自我。',
    dominantNote: '你在恋爱中保持清晰的边界与独立空间，适合与同样重视个人成长的伴侣相处。',
    advice: '保持理性与独立的同时，可适度表达情感与在意，避免让伴侣感到疏离。',
  },
  balanced: {
    title: '平衡型',
    summary: '你的恋爱脑程度适中，既会投入感情，也能保持一定独立性。情感依赖与优先倾斜处于中等水平，理性平衡能力尚可。',
    dominantNote: '你能够在亲密与独立之间寻求平衡，注意在热恋期保持自我边界。',
    advice: '继续保持觉察，在投入与边界之间灵活调整，避免过度依赖或过度疏离。',
  },
  invested: {
    title: '投入型',
    summary: '你的恋爱脑程度偏高，在恋爱中容易把对方放在第一位，情感依赖较强，思绪易被关系占据。理性平衡能力相对较弱。',
    dominantNote: '你倾向于全力投入关系，需留意是否影响其他生活重心与社交圈。',
    advice: '培养独立兴趣、维持朋友圈，练习在关系中保留自己的空间与目标。',
  },
  obsessive: {
    title: '痴迷型',
    summary: '你的恋爱脑程度较高，情感依赖强，容易因对方的态度与回应焦虑，可能忽略朋友、失去自我。建议关注情绪管理与边界意识。',
    dominantNote: '过度投入可能给关系带来压力，也容易失去自我价值感。',
    advice: '优先培养情绪独立与自我认同。若困扰持续，建议寻求专业心理咨询支持。',
  },
}

/** 各维度 × 等级的简要结论 */
export const LBT_DIMENSION_BY_LEVEL: Record<LBTDimensionId, Record<string, string>> = {
  depend: {
    low: '情感依赖较低，不会因对方态度或回应过度焦虑，能接受适度距离。',
    moderate: '情感依赖适中，会在意对方态度，但能保持一定的情绪独立。',
    high: '情感依赖较高，容易因对方态度焦虑，情绪易受关系影响，需关注自我安抚能力。',
  },
  prioritize: {
    low: '优先倾斜较低，能平衡爱情与其他生活重心，不会因恋爱忽略朋友或计划。',
    moderate: '优先倾斜适中，会为伴侣付出，但能保留自己的兴趣与社交。',
    high: '优先倾斜较高，容易把对方放在第一位，可能忽略朋友或改变计划，需留意边界。',
  },
  balance: {
    low: '理性平衡能力较弱，恋爱容易占据主要思绪，难以在感情与其他目标间平衡。',
    moderate: '理性平衡能力尚可，能部分兼顾感情与事业/目标，但热恋期可能倾斜。',
    high: '理性平衡能力较强，能较好地在恋爱与生活中保持平衡，有清晰目标与边界。',
  },
}

/** 各维度详细解读 */
export const LBT_DIMENSION_INSIGHTS: Record<LBTDimensionId, string> = {
  depend: '情感依赖反映你对伴侣态度与回应的敏感度。适度的在意能增进亲密；过高可能导致焦虑、情绪起伏大，需练习自我安抚与情绪独立。',
  prioritize: '优先倾斜反映你为关系付出的程度。适度付出是爱的体现；过高可能导致忽略朋友、改变计划、失去自我，需保持生活重心多元。',
  balance: '理性平衡反映你在恋爱与事业/目标间的协调能力。能力强者可兼顾亲密与独立；能力弱者易在恋爱中倾斜过度，需刻意维护其他生活重心。',
}

/** 建议（按 profile） */
export const LBT_RELATIONSHIP_TIPS: Record<LBTProfileKey, string[]> = {
  rational: [
    '保持理性与边界，同时适度表达情感与在意',
    '若伴侣更需要亲密感，可适当增加陪伴与表达',
    '避免让伴侣感到疏离或不被需要',
  ],
  balanced: [
    '继续保持觉察，在投入与边界之间灵活调整',
    '热恋期注意保持朋友圈与个人兴趣',
    '与伴侣沟通彼此对独立空间的需求',
  ],
  invested: [
    '培养 1–2 个独立于关系的兴趣或爱好',
    '维持与朋友的定期联系，不因恋爱忽略社交',
    '设定个人目标，即使恋爱也保留成长空间',
  ],
  obsessive: [
    '优先练习情绪独立，不把自我价值完全系于对方态度',
    '若焦虑、空虚感持续，建议寻求专业心理咨询',
    '与伴侣坦诚沟通自己的不安，共同建立健康的边界',
  ],
}

/** 根据总分与维度计算 profile */
export function getLBTProfileKey(
  level: string,
  dimensionScores: LBTDimensionScore[]
): LBTProfileKey {
  if (level === 'low') return 'rational'
  if (level === 'high') {
    const depend = dimensionScores.find(d => d.id === 'depend')
    const prioritize = dimensionScores.find(d => d.id === 'prioritize')
    if (depend?.level === 'high' && (prioritize?.level === 'high' || depend.percent >= 75)) {
      return 'obsessive'
    }
    return 'invested'
  }
  return 'balanced'
}
