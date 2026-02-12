/**
 * DTH 黑暗三角人格 - 综合结论、维度解读
 */
import type { DTHDimensionId } from './dth'

export const DTH_LEVEL_LABELS = {
  low: '偏低',
  moderate: '适中',
  high: '偏高',
} as const

/** 综合水平结论（基于三维均分） */
export const DTH_OVERALL_CONCLUSIONS = {
  low: {
    title: '整体水平偏低',
    summary: '你在黑暗三角三个维度上的得分均较低，表明你更倾向于真诚交往、较少权谋算计，自我评价较为平和，注重他人感受与行为后果。',
    hint: '这种特质组合有利于信任建立与长期关系，在职场上可适度培养策略思维以应对复杂情境。',
  },
  moderate: {
    title: '整体水平适中',
    summary: '你在权谋、自恋与冲动冷漠三个维度的得分处于中等区间，既保留一定的策略意识与自我肯定，又不失对他人与规范的考量。',
    hint: '多数人处于此区间。可根据情境灵活调整，注意保持真诚与边界的平衡。',
  },
  high: {
    title: '整体水平偏高',
    summary: '你在一个或多个黑暗三角维度上得分较高，可能表现出较强的策略倾向、自我中心或追求刺激。',
    hint: '这些特质并非全然负面，但在人际与决策中需留意对信任、共情与长期后果的影响。若结果令你困扰，建议寻求专业咨询。',
  },
} as const

/** 最高维度的简要结论 */
export const DTH_PROFILE_HINTS: Record<DTHDimensionId, string> = {
  mach: '你在权谋策略上得分最高，倾向于用策略思维达成目标。',
  narc: '你在自恋维度上得分最高，自我价值感与对认可的渴求较强。',
  psych: '你在冲动冷漠维度上得分最高，可能更追求刺激、较少顾虑他人感受。',
}

/** 各维度 × 等级的简要结论 */
export const DTH_DIMENSION_BY_LEVEL: Record<DTHDimensionId, Record<string, string>> = {
  mach: {
    low: '权谋倾向较低，倾向于坦诚直接。',
    moderate: '具有一定的策略思维，能兼顾目的与关系。',
    high: '权谋倾向较强，善用策略达成目标，需留意信任与边界。',
  },
  narc: {
    low: '自恋倾向较低，自我评价较为平和。',
    moderate: '有适度的自我肯定，能平衡自信与谦逊。',
    high: '自恋倾向较强，渴望被认可，需留意共情与接纳批评。',
  },
  psych: {
    low: '冲动冷漠倾向较低，注重他人感受与行为后果。',
    moderate: '有一定冒险倾向，多数情况下能权衡后果。',
    high: '冲动冷漠倾向较强，可能追求刺激、较少内疚，需留意长期影响。',
  },
}

export const DTH_DIMENSION_INSIGHTS: Record<DTHDimensionId, string> = {
  mach: '马基雅维利主义反映权谋倾向：善用策略、操纵、隐瞒以达成目的。适度者可具备策略思维与谈判能力；过高可能损害信任与人际关系。',
  narc: '自恋反映自我中心、渴望关注与特殊待遇。适度的自我肯定有助于自信；过高可能表现出傲慢、缺乏共情、难以接受批评。',
  psych: '精神病态反映低共情、冲动、追求刺激。低分者更注重他人感受与行为后果；高分者可能表现出冷漠、鲁莽与道德边界模糊。',
}

/** 计算综合水平（基于三维均分） */
export function getDTHOverallLevel(avgPercent: number): 'low' | 'moderate' | 'high' {
  if (avgPercent <= 40) return 'low'
  if (avgPercent >= 65) return 'high'
  return 'moderate'
}

/** 取最高得分维度 */
export function getDTHDominantDimension(scores: { id: DTHDimensionId; percent: number }[]): DTHDimensionId {
  const sorted = [...scores].sort((a, b) => b.percent - a.percent)
  return sorted[0]?.id ?? 'mach'
}
