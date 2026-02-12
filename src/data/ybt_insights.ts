/**
 * YBT 病娇测试 - 综合结论、 profile 类型、维度解读
 */
import type { YBTDimensionId } from './ybt'
import type { YBTDimensionScore } from '../utils/ybt_scoring'

export const YBT_LEVEL_LABELS = {
  low: '偏低',
  moderate: '适中',
  high: '偏高',
} as const

/** 综合 profile 类型 */
export type YBTProfileKey =
  | 'gentle'      // 温和型
  | 'possessive'  // 占有型
  | 'controlling'  // 控制型
  | 'dependent'    // 依赖型
  | 'extreme_risk' // 潜在病娇型
  | 'extreme_only' // 警觉型（仅极端高）
  | 'balanced'    // 均衡型

export interface YBTProfileInfo {
  title: string
  summary: string
  dominantNote: string
  advice: string
}

export const YBT_PROFILES: Record<YBTProfileKey, YBTProfileInfo> = {
  gentle: {
    title: '温和型',
    summary: '你在占有欲、控制欲、依赖度与极端倾向四个维度上均处于较低水平，恋爱观较为健康、边界清晰，能尊重伴侣的独立空间与社交自由。',
    dominantNote: '你倾向于以信任与尊重维系关系，较少产生强烈占有或控制冲动。',
    advice: '保持当前的平衡感，同时在关系中适度表达需求，避免过度压抑自己的真实感受。',
  },
  possessive: {
    title: '占有型',
    summary: '你的占有欲最为突出，希望成为伴侣心中唯一重要的人，对伴侣与异性的互动较为敏感，容易产生醋意。',
    dominantNote: '占有欲本身是爱的表现之一，但过高可能让伴侣感到窒息或缺乏信任。',
    advice: '尝试区分「适度在意」与「过度占有」，给伴侣一定的社交空间，用沟通替代猜忌。',
  },
  controlling: {
    title: '控制型',
    summary: '你的控制欲较高，希望了解伴侣的行踪、参与其决策，甚至对其社交圈有较多意见。',
    dominantNote: '关心伴侣是爱的体现，但过度控制可能侵犯对方隐私与自主权。',
    advice: '学会区分「关心」与「控制」，尊重伴侣的私人空间和独立选择。',
  },
  dependent: {
    title: '依赖型',
    summary: '你对伴侣的情感依赖较强，伴侣在你生活中的权重很高，其态度与行为会显著影响你的情绪与决策。',
    dominantNote: '适度依赖有助于亲密感，但过度依赖可能导致焦虑与失去自我。',
    advice: '培养自己的兴趣与社交圈，保持一定程度的情绪独立，有助于关系的长期稳定。',
  },
  extreme_risk: {
    title: '潜在病娇倾向',
    summary: '你在占有欲、控制欲或极端倾向中至少两项偏高，在关系受挫时可能出现较强的占有、控制或激烈反应倾向。',
    dominantNote: '这类特质在 ACG 文化中常被浪漫化，现实中需警惕对关系与双方的伤害。',
    advice: '建议关注情绪管理与边界意识。若感到难以自控或困扰，可寻求专业心理咨询支持。',
  },
  extreme_only: {
    title: '警觉型',
    summary: '你的极端倾向得分较高，但占有与控制维度相对较低，表明在关系受挫时可能出现激烈想法，但平时并不表现为强占有或控制。',
    dominantNote: '这类反应多与情绪调节能力或过去经历相关。',
    advice: '关注情绪管理，学习用理性与沟通应对冲突。若极端想法反复出现，建议寻求专业支持。',
  },
  balanced: {
    title: '均衡型',
    summary: '四个维度得分较为均衡，处于适中区间，既有一定的占有与依赖，又能保持理性与边界，多数人处于此类型。',
    dominantNote: '你能够在亲密与独立之间寻求平衡。',
    advice: '保持觉察，根据实际关系动态灵活调整，既表达爱意，也尊重彼此空间。',
  },
}

/** 各维度 × 等级的简要结论 */
export const YBT_DIMENSION_BY_LEVEL: Record<YBTDimensionId, Record<string, string>> = {
  possess: {
    low: '占有欲较低，能接受伴侣有自己的社交圈与异性朋友，较为信任对方。',
    moderate: '占有欲适中，希望被重视，也会吃醋，但能把握尺度。',
    high: '占有欲较强，希望独占伴侣的全部注意力，对伴侣与异性互动很敏感。',
  },
  control: {
    low: '控制欲较低，尊重伴侣的隐私与独立选择，很少干涉对方生活。',
    moderate: '控制欲适中，关心伴侣动态，希望参与重要决策，但不过度干涉。',
    high: '控制欲较强，希望了解伴侣行踪、参与其决策，对其社交圈有较多意见。',
  },
  depend: {
    low: '依赖度较低，情感上较为独立，有自己的人生重心。',
    moderate: '依赖度适中，伴侣对你重要，但不会失去自我。',
    high: '依赖度较高，伴侣是精神支柱，其态度显著影响你的情绪与决策。',
  },
  extreme: {
    low: '极端倾向较低，能以理性应对感情问题，较少出现激烈想法或行为。',
    moderate: '极端倾向适中，偶尔会有冲动，但多数情况能控制。',
    high: '极端倾向偏高，在关系受挫时可能产生激烈反应或极端想法，需留意情绪管理。',
  },
}

/** 各维度详细解读（通用） */
export const YBT_DIMENSION_INSIGHTS: Record<YBTDimensionId, string> = {
  possess:
    '占有欲反映你希望独享伴侣的倾向，包括对伴侣社交、注意力的敏感度。适度的占有是爱的表现；过高可能让伴侣感到被束缚，需注意尊重边界与信任建立。',
  control:
    '控制欲反映你想了解、参与甚至主导伴侣生活的倾向。适度关心能增进亲密；过高可能侵犯对方隐私与自由，引发反感。学会区分「关心」与「控制」很重要。',
  depend:
    '依赖度反映你对伴侣的情感依恋程度。适度依赖有助于亲密感与安全感；过高可能导致失去自我、过度焦虑、害怕被抛弃。保持一定的情绪独立有利于关系稳定。',
  extreme:
    '极端倾向反映在关系受挫时出现激烈想法或行为的可能性。低分者更能理性应对冲突；高分者需关注情绪调节。若极端想法反复出现，建议寻求专业心理咨询。',
}

/** 最高维度的简要结论 */
export const YBT_DOMINANT_HINTS: Record<YBTDimensionId, string> = {
  possess: '你在占有欲上得分最高，希望成为伴侣心中最重要的人。',
  control: '你在控制欲上得分最高，倾向于了解并参与伴侣的生活。',
  depend: '你在依赖度上得分最高，伴侣对你的情绪与决策影响较大。',
  extreme: '你在极端倾向上得分最高，需关注关系受挫时的情绪反应。',
}

/** 恋爱建议（按 profile） */
export const YBT_RELATIONSHIP_TIPS: Record<YBTProfileKey, string[]> = {
  gentle: [
    '保持信任与开放沟通',
    '适度表达自己的需求，不必过于压抑',
    '若伴侣占有欲较强，可温和设定边界',
  ],
  possessive: [
    '练习区分「在意」与「过度占有」',
    '给伴侣一定的社交与私人空间',
    '用坦诚沟通替代猜忌与查岗',
  ],
  controlling: [
    '尊重伴侣的隐私与独立决策权',
    '用「邀请参与」替代「要求汇报」',
    '关注自己的控制欲来源（如安全感、焦虑）',
  ],
  dependent: [
    '培养自己的兴趣与社交圈',
    '练习情绪独立，不过度依赖伴侣的态度',
    '与伴侣一起建立健康的依赖边界',
  ],
  extreme_risk: [
    '优先关注情绪管理与冲动控制',
    '在冲突时给自己冷静期，避免激烈反应',
    '若困扰持续，建议寻求专业心理咨询',
  ],
  extreme_only: [
    '学习用理性与沟通应对冲突',
    '了解极端想法的触发情境',
    '必要时寻求专业支持梳理情绪',
  ],
  balanced: [
    '保持觉察，根据关系动态灵活调整',
    '既表达爱意与在意，也尊重彼此空间',
    '定期与伴侣沟通双方的需求与边界',
  ],
}

/** 根据得分计算 profile 类型 */
export function getYBTProfileKey(scores: YBTDimensionScore[]): YBTProfileKey {
  const byId = Object.fromEntries(scores.map(d => [d.id, d])) as Record<YBTDimensionId, YBTDimensionScore>
  const possess = byId.possess
  const control = byId.control
  const depend = byId.depend
  const extreme = byId.extreme

  const highCount = scores.filter(d => d.level === 'high').length
  const lowCount = scores.filter(d => d.level === 'low').length

  // 四维均低 → 温和型
  if (lowCount >= 3 && highCount === 0) return 'gentle'

  // 极端高 + (占有高 或 控制高) → 潜在病娇倾向
  if (extreme?.level === 'high' && (possess?.level === 'high' || control?.level === 'high')) return 'extreme_risk'

  // 占有+控制+极端 至少两个高 → 潜在病娇
  const highDanger = [possess, control, extreme].filter(d => d?.level === 'high').length
  if (highDanger >= 2) return 'extreme_risk'

  // 仅极端高，其他不高 → 警觉型
  if (extreme?.level === 'high' && possess?.level !== 'high' && control?.level !== 'high') return 'extreme_only'

  // 取最高维度
  const sorted = [...scores].sort((a, b) => b.percent - a.percent)
  const top = sorted[0]
  if (!top) return 'balanced'

  // 最高维度为高 → 对应类型
  if (top.level === 'high') {
    if (top.id === 'possess') return 'possessive'
    if (top.id === 'control') return 'controlling'
    if (top.id === 'depend') return 'dependent'
  }

  return 'balanced'
}
