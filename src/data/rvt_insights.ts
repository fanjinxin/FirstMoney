/**
 * RVT 恋爱观测试 - Lee 六种爱情风格
 * Eros / Ludus / Storge / Mania / Pragma / Agape
 */
import type { RVTDimensionId } from './rvt'
import type { RVTDimensionScore } from '../utils/rvt_scoring'

export const RVT_LEVEL_LABELS = {
  low: '偏低',
  moderate: '适中',
  high: '偏高',
} as const

/** 六种爱情风格（Lee / Hendrick） */
export type RVTProfileKey = RVTDimensionId | 'balanced'

export interface RVTProfileInfo {
  title: string
  summary: string
  dominantNote: string
  advice: string
}

export const RVT_PROFILES: Record<RVTProfileKey, RVTProfileInfo> = {
  eros: {
    title: '浪漫情欲型 (Eros)',
    summary: '你重视外表吸引与激情，相信一见钟情，容易被对方的外表或气质打动。你向往热烈、浓烈的情感体验，认为强烈的身体吸引力是爱情的重要部分。',
    dominantNote: 'Eros 型的人追求浪漫与激情，适合与同样重视吸引力、善于表达热情的伴侣相处。',
    advice: '激情会随时间自然消退，可逐步培养默契与陪伴，为长期关系注入持久动力。',
  },
  ludus: {
    title: '游戏型 (Ludus)',
    summary: '你把恋爱当游戏，倾向于避免过于投入，不喜欢被关系束缚。你希望保持轻松随意，承诺会让你感到压力。',
    dominantNote: 'Ludus 型的人追求自由与新鲜感，需留意是否影响建立深度联结。',
    advice: '若希望建立稳定关系，可尝试适度投入与承诺；若享受当下，需与伴侣沟通彼此的期待。',
  },
  storge: {
    title: '友谊型 (Storge)',
    summary: '你认为最好的爱情是从好朋友慢慢发展来的，更相信日久生情。你重视日常相处中的默契与舒适，理想的伴侣是能聊得来、处得来的人。',
    dominantNote: 'Storge 型的人追求稳定与陪伴，适合与能共度日常、共同成长的伴侣相处。',
    advice: '稳定的友谊式爱情是长久关系的基础，可适度营造浪漫与惊喜保持新鲜感。',
  },
  mania: {
    title: '占有型 (Mania)',
    summary: '你在恋爱中容易依赖、占有，情绪强烈。没有伴侣你很难开心，会非常在意伴侣的一举一动，常常感到焦虑和不安全，希望完全拥有伴侣的注意力。',
    dominantNote: 'Mania 型的人情感投入深，但需关注依赖与占有可能给关系带来的压力。',
    advice: '练习情绪独立与边界意识，给伴侣一定空间；若焦虑持续，可寻求专业心理咨询。',
  },
  pragma: {
    title: '现实型 (Pragma)',
    summary: '你看重条件与合适，选择伴侣时经济条件、门当户对很重要。你会理性评估一段关系是否可行，认为合适比感觉更重要，恋爱要考虑未来和现实规划。',
    dominantNote: 'Pragma 型的人务实理性，适合与目标一致、愿意共同经营的伴侣相处。',
    advice: '理性是优势，同时可适度关注情感联结，用浪漫表达增进亲密感。',
  },
  agape: {
    title: '奉献型 (Agape)',
    summary: '你倾向于无私付出，愿意为伴侣付出一切，很少计较得失。你认为爱一个人就应该无条件为他/她着想，伴侣的幸福比自己的需求更重要。',
    dominantNote: 'Agape 型的人充满爱与包容，但需留意过度牺牲可能忽视自己的需求。',
    advice: '在付出的同时，记得关注自己的需求与边界，健康的爱是双向的。',
  },
  balanced: {
    title: '均衡型',
    summary: '六个维度得分较为均衡，你兼具多种恋爱观的倾向，能在不同情境下灵活调整。多数人有一定程度的混合。',
    dominantNote: '你能够根据关系阶段与伴侣特点灵活表达。',
    advice: '保持觉察，在六维之间寻找适合自己的平衡，与伴侣定期沟通彼此的期待。',
  },
}

/** 各维度 × 等级的简要结论 */
export const RVT_DIMENSION_BY_LEVEL: Record<RVTDimensionId, Record<string, string>> = {
  eros: {
    low: '浪漫情欲倾向较低，更注重友谊、现实或陪伴，不太相信一见钟情。',
    moderate: '浪漫情欲倾向适中，既能享受激情，也关注其他维度。',
    high: '浪漫情欲倾向较高，重视外表吸引与强烈情感体验。',
  },
  ludus: {
    low: '游戏倾向较低，倾向于认真投入关系，追求长久承诺。',
    moderate: '游戏倾向适中，能在轻松与投入之间平衡。',
    high: '游戏倾向较高，倾向于避免深度投入，保持自由。',
  },
  storge: {
    low: '友谊倾向较低，更相信一见钟情或激情先行。',
    moderate: '友谊倾向适中，认同日久生情与陪伴的重要性。',
    high: '友谊倾向较高，追求从朋友发展为伴侣的稳定关系。',
  },
  mania: {
    low: '占有倾向较低，能保持情绪独立与边界。',
    moderate: '占有倾向适中，会有依赖与在意，但能把握尺度。',
    high: '占有倾向较高，容易依赖、占有，情绪强烈且易焦虑。',
  },
  pragma: {
    low: '现实倾向较低，更凭感觉与情感做选择。',
    moderate: '现实倾向适中，会理性评估，但不完全忽略感觉。',
    high: '现实倾向较高，重视条件、合适与长远规划。',
  },
  agape: {
    low: '奉献倾向较低，更注重平等付出与自身需求。',
    moderate: '奉献倾向适中，愿意付出，也会关注自己的需求。',
    high: '奉献倾向较高，倾向于无条件付出、优先满足伴侣。',
  },
}

/** 各维度详细解读 */
export const RVT_DIMENSION_INSIGHTS: Record<RVTDimensionId, string> = {
  eros: 'Eros 浪漫情欲型源于希腊语，指基于外表吸引与强烈激情的爱情。适度的 Eros 能点燃关系；过高可能忽视长期相处的契合度。',
  ludus: 'Ludus 游戏型将恋爱视为游戏，避免深度投入。适度可保持关系轻松；过高可能影响建立稳定联结，需与伴侣沟通期待。',
  storge: 'Storge 友谊型指由友谊慢慢发展为爱情。这种爱情往往稳定持久，可适度结合浪漫与激情保持新鲜感。',
  mania: 'Mania 占有型表现为依赖、占有、情绪强烈。适度在意是爱的表现；过高可能导致焦虑与关系压力，需关注情绪管理。',
  pragma: 'Pragma 现实型重视条件、合适与长远规划。务实有助于关系稳定；过高可能让关系显得功利，需兼顾情感联结。',
  agape: 'Agape 奉献型指无私、利他的爱。适度付出能增进亲密；过度牺牲可能忽视自身需求，健康的爱是双向的。',
}

/** 恋爱建议（按 profile） */
export const RVT_RELATIONSHIP_TIPS: Record<RVTProfileKey, string[]> = {
  eros: [
    '选择重视吸引力、善于表达热情的伴侣',
    '接受激情随时间消退，培养默契与陪伴',
    '用共同的浪漫回忆与日常相处支撑长期关系',
  ],
  ludus: [
    '若希望稳定，可尝试适度投入与承诺',
    '与伴侣坦诚沟通彼此对关系的期待',
    '在自由与联结之间寻找适合自己的平衡',
  ],
  storge: [
    '选择能聊得来、处得来、共度日常的伴侣',
    '适度营造浪漫与惊喜，保持关系新鲜感',
    '与伴侣一起设定共同目标，共同成长',
  ],
  mania: [
    '练习情绪独立，不过度依赖伴侣的态度',
    '给伴侣一定空间，用沟通替代猜忌',
    '若焦虑持续，建议寻求专业心理咨询',
  ],
  pragma: [
    '与目标一致、愿意共同经营的伴侣更匹配',
    '在理性评估的同时，关注情感联结',
    '适时用浪漫表达增进亲密感',
  ],
  agape: [
    '在付出的同时，关注自己的需求与边界',
    '与伴侣建立平等的付出与接受',
    '健康的爱是双向的，不必一味牺牲',
  ],
  balanced: [
    '根据关系阶段与伴侣特点灵活表达',
    '保持觉察，在六维之间寻找平衡',
    '定期与伴侣沟通彼此对恋爱的期待',
  ],
}

/** 根据主型、次型计算 profile（主型得分明显领先则为主型，否则为均衡） */
export function getRVTProfileKey(
  primary: RVTDimensionScore,
  secondary: RVTDimensionScore | null
): RVTProfileKey {
  const gap = primary.percent - (secondary?.percent ?? 0)
  // 主型比次型高 15 分以上，则认定为主型主导
  if (gap >= 15) return primary.id
  return 'balanced'
}
