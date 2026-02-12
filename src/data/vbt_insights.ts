import type { VBTDimensionId } from './vbt'

export const VBT_DIMENSION_INSIGHTS: Record<VBTDimensionId, string> = {
  boundary: '边界清晰度反映你能否明确底线、拒绝不合理要求。高分者更不易被侵犯，低分者可能容易妥协。',
  assertive: '自我主张反映你能否在冲突中表达立场、维护权益。高分者更敢于发声，低分者可能倾向回避。',
  sensitive: '敏感度反映你对他人的态度与评价有多敏感。高分者更容易受伤，低分者心理防线较厚。',
  cope: '应对方式反映你遭遇恶意时的处理策略。高分者更善于寻求支持、理性应对，低分者可能独自忍受。',
}
