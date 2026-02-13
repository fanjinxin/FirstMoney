/**
 * VBT 易被欺负 - 综合结论、维度解读
 * 移植自 src/data/vbt_insights.ts（精简版）
 */
const VBT_LEVEL_LABELS = { low: '偏低', moderate: '适中', high: '偏高' };

const VBT_SENSITIVE_LEVEL_LABELS = {
  low: '心理防线较厚',
  moderate: '敏感度适中',
  high: '易受伤、易自责',
};

const VBT_PROFILES = {
  robust: {
    title: '综合稳健型',
    summary: '你的边界清晰度、自我主张与应对方式都较为均衡，整体保护力较强。你能够明确拒绝不合理要求、在冲突中表达立场，并采取积极应对策略。',
    coreNote: '继续保持边界意识与自我主张，同时保持对他人感受的适度觉察。',
    focus: '维持现有优势，偶尔复盘边界与沟通方式是否清晰。',
  },
  boundary_weak: {
    title: '边界薄弱型',
    summary: '你的边界清晰度较低，容易为了维持关系而妥协、难以拒绝不合理要求或对熟人说不。别人越界时你可能选择忍让，这会让一些人误判你的底线。',
    coreNote: '边界薄弱是「易被欺负」的最常见根源之一。明确自己的底线，练习在安全情境下说「不」。',
    focus: '从小事开始练习拒绝，明确「什么可以接受、什么不能」，并让对方知道。',
  },
  assertive_weak: {
    title: '主张不足型',
    summary: '你在冲突中倾向于回避、沉默或退缩，面对不公平或强势的人时难以表达立场。你可能担心表达反对会破坏关系，因此选择忍耐。',
    coreNote: '自我主张不等于攻击。坚定而冷静地表达自己的需求与边界，是健康关系的基础。',
    focus: '练习「我句式」表达感受与需求，在低风险情境下先尝试发声。',
  },
  cope_weak: {
    title: '应对不足型',
    summary: '遭遇恶意或欺负时，你倾向于独自忍受、逃避或「忍一忍就过去」，缺乏应对策略与支持系统。容易在重复遭遇中陷入被动。',
    coreNote: '应对能力可以通过学习和练习提升。建立可信任的支持网络、了解维权途径。',
    focus: '事先想好「如果遇到……我会怎么做」，并找到至少一位可信任的倾诉对象。',
  },
  sensitive_high: {
    title: '高敏感型',
    summary: '你对他人评价与态度变化极为敏感，负面评价、冷嘲热讽、被忽视或否定都会让你难过很久。即便边界与主张尚可，高敏感也会让你更容易感到「被欺负」。',
    coreNote: '敏感是特质而非缺陷。区分「对方的问题」与「我的问题」，建立内在稳定感。',
    focus: '练习将他人评价与自我价值分离；在情绪激动时先冷静，再决定如何回应。',
  },
  combo_weak: {
    title: '多维度薄弱型',
    summary: '你在边界、主张、应对中至少两个维度得分偏低，保护力整体不足。可能同时存在「难以拒绝」「回避冲突」「独自忍受」等特点。',
    coreNote: '多维度薄弱需要系统性的自我成长。建议从你最弱的一个维度着手。',
    focus: '优先发展最弱维度，设定小目标逐步练习；考虑寻求心理咨询或成长类资源。',
  },
  risk_high: {
    title: '高危型',
    summary: '你在保护力多个维度上得分较低，且易被欺负指数较高。你容易在人际关系中感到被侵犯、被利用或难以维护自己。',
    coreNote: '改变是可能的。从今天开始，哪怕只是一个小改变——比如对一件小事说「不」——都是进步。',
    focus: '建议寻求专业支持（如心理咨询），同时从小事开始练习边界与主张；建立可信赖的支持网络。',
  },
};

const VBT_DIMENSION_BY_LEVEL = {
  boundary: {
    low: '边界清晰度偏低，容易为维持关系而妥协、难以拒绝不合理要求。',
    moderate: '边界清晰度适中，能在多数情境下守住底线，但也可能对熟人有所妥协。',
    high: '边界清晰度较高，能明确拒绝、表明态度、坚持立场。',
  },
  assertive: {
    low: '自我主张偏低，倾向回避冲突、在强势者面前退缩。',
    moderate: '自我主张适中，能在部分情境下表达立场。',
    high: '自我主张较高，敢于在冲突中发声、维护权益。',
  },
  sensitive: {
    low: '敏感度偏低，心理防线较厚，负面评价对你影响较小。',
    moderate: '敏感度适中，能察觉他人态度，但不会过度放大伤害。',
    high: '敏感度偏高，他人评价与态度变化对你影响较大。',
  },
  cope: {
    low: '应对方式偏被动，遇到欺负可能独自忍受、缺乏策略。',
    moderate: '应对方式适中，能在部分情境下寻求支持或理性应对。',
    high: '应对方式较积极，会寻求支持、分析策略、保留证据。',
  },
};

const VBT_VULNERABILITY_ZONE_INSIGHTS = {
  low: { title: '低风险', range: '0-20', analysis: '易被欺负指数较低，整体保护力较好。', implication: '继续保持边界意识与自我主张。' },
  low_mid: { title: '中低风险', range: '21-40', analysis: '易被欺负指数处于中低水平，某些维度可能有提升空间。', implication: '识别最薄弱的维度与最容易妥协的情境，有针对性地练习。' },
  mid: { title: '中等风险', range: '41-60', analysis: '易被欺负指数处于中等水平，保护力与敏感度可能较为均衡。', implication: '根据维度分析，优先发展最弱的保护力维度。' },
  mid_high: { title: '中高风险', range: '61-80', analysis: '易被欺负指数较高，在人际关系中可能常常感到被侵犯。', implication: '建议系统性地学习边界与主张技巧，建立支持网络。' },
  high: { title: '高风险', range: '81-100', analysis: '易被欺负指数很高，在人际互动中可能长期感到被动、受伤。', implication: '强烈建议寻求专业支持。同时从小事开始：今天对一件小事说「不」。' },
};

const VBT_DIMENSION_INSIGHTS = {
  boundary: '边界清晰度反映你能否明确底线、拒绝不合理要求。高分者更不易被侵犯。',
  assertive: '自我主张反映你能否在冲突中表达立场、维护权益。高分者更敢于发声。',
  sensitive: '敏感度反映你对他人的态度与评价有多敏感。高分者更容易受伤。',
  cope: '应对方式反映你遭遇恶意时的处理策略。高分者更善于寻求支持、理性应对。',
};

const VBT_SELF_PROTECTION_TIPS = {
  robust: ['定期复盘：最近有没有因「不好意思」而答应的事？', '在重要关系中明确传达你的底线'],
  boundary_weak: ['从小事练习说「不」', '写下「我的底线清单」，并让亲近的人知道'],
  assertive_weak: ['准备「万能回应」：如「我需要考虑一下」「我不同意这个说法」', '在低风险情境中练习表达不同意见'],
  cope_weak: ['找到至少一位可信任的倾诉对象', '事先想好应对脚本：如果遇到……我会怎么做'],
  sensitive_high: ['练习区分「对方的评价」与「我的价值」', '情绪激动时先不回应，等冷静后再决定'],
  combo_weak: ['从最弱的一个维度着手，设定每周一个小目标', '建立支持网络：至少一个人可以倾诉'],
  risk_high: ['强烈建议寻求专业心理咨询', '从今天开始：对一件小事说「不」，或找一个可信任的人说出你的感受'],
};

function getLevelLabel(dimId, level) {
  return dimId === 'sensitive' ? (VBT_SENSITIVE_LEVEL_LABELS[level] || level) : (VBT_LEVEL_LABELS[level] || level);
}

module.exports = {
  VBT_LEVEL_LABELS,
  VBT_SENSITIVE_LEVEL_LABELS,
  VBT_PROFILES,
  VBT_DIMENSION_BY_LEVEL,
  VBT_VULNERABILITY_ZONE_INSIGHTS,
  VBT_DIMENSION_INSIGHTS,
  VBT_SELF_PROTECTION_TIPS,
  getLevelLabel,
};
