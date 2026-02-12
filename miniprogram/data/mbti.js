/* MBTI 16型人格 - 精简版 24题 (每维度6题)，完整版需90题 */
const MBTI_SCALE_OPTIONS = [
  { label: '非常符合 A', value: 0 },
  { label: '比较符合 A', value: 1 },
  { label: '不确定', value: 2 },
  { label: '比较符合 B', value: 3 },
  { label: '非常符合 B', value: 4 }
];

const mbtiQuestions = [
  { id: 'mbti-1', text: '在社交聚会中，你通常：', dimension: 'EI', optionA: { label: '主动与许多人交谈，感到精力充沛', pole: 'E' }, optionB: { label: '只与少数熟人交谈，或更倾向于安静观察', pole: 'I' } },
  { id: 'mbti-5', text: '你更喜欢的工作/学习方式是：', dimension: 'EI', optionA: { label: '小组讨论、头脑风暴、与人合作', pole: 'E' }, optionB: { label: '独自钻研、深度思考、安静专注', pole: 'I' } },
  { id: 'mbti-7', text: '周末你更希望：', dimension: 'EI', optionA: { label: '外出聚会、见朋友、参加活动', pole: 'E' }, optionB: { label: '宅在家里、看书、独处充电', pole: 'I' } },
  { id: 'mbti-15', text: '你的精力主要来自：', dimension: 'EI', optionA: { label: '与外界互动、社交、活动', pole: 'E' }, optionB: { label: '独处、内省、安静时光', pole: 'I' } },
  { id: 'mbti-20', text: '在人群中待久了，你通常：', dimension: 'EI', optionA: { label: '仍然精力充沛', pole: 'E' }, optionB: { label: '感到疲惫，需要独处恢复', pole: 'I' } },
  { id: 'mbti-23', text: '你理想的周末夜晚是：', dimension: 'EI', optionA: { label: '朋友聚会、聚餐、唱歌', pole: 'E' }, optionB: { label: '在家看书、追剧、早睡', pole: 'I' } },
  { id: 'mbti-24', text: '你更相信：', dimension: 'SN', optionA: { label: '具体的事实、数据、经验', pole: 'S' }, optionB: { label: '直觉、灵感、可能性', pole: 'N' } },
  { id: 'mbti-26', text: '学习新事物时，你更喜欢：', dimension: 'SN', optionA: { label: '循序渐进，按步骤操作', pole: 'S' }, optionB: { label: '先把握整体框架，再填细节', pole: 'N' } },
  { id: 'mbti-30', text: '你做决定时更依赖：', dimension: 'SN', optionA: { label: '过去的经验和可验证的信息', pole: 'S' }, optionB: { label: '直觉和内在感受', pole: 'N' } },
  { id: 'mbti-33', text: '你更享受：', dimension: 'SN', optionA: { label: '动手实践、亲身体验', pole: 'S' }, optionB: { label: '头脑风暴、概念探讨', pole: 'N' } },
  { id: 'mbti-40', text: '你更认同：', dimension: 'SN', optionA: { label: '眼见为实，实践出真知', pole: 'S' }, optionB: { label: '灵感和远见同样重要', pole: 'N' } },
  { id: 'mbti-45', text: '你更看重：', dimension: 'SN', optionA: { label: '可靠、稳定、经得起检验', pole: 'S' }, optionB: { label: '创新、突破、有潜力', pole: 'N' } },
  { id: 'mbti-46', text: '做决定时，你更看重：', dimension: 'TF', optionA: { label: '逻辑、公平、客观分析', pole: 'T' }, optionB: { label: '感受、和谐、对人的影响', pole: 'F' } },
  { id: 'mbti-51', text: '面对哭泣的朋友，你更可能：', dimension: 'TF', optionA: { label: '分析问题，帮忙找解决办法', pole: 'T' }, optionB: { label: '先陪伴安慰，感同身受', pole: 'F' } },
  { id: 'mbti-55', text: '你更容易被什么打动：', dimension: 'TF', optionA: { label: '严谨的论证、精妙的设计', pole: 'T' }, optionB: { label: '真诚的情感、动人的故事', pole: 'F' } },
  { id: 'mbti-62', text: '你更容易：', dimension: 'TF', optionA: { label: '看到逻辑漏洞和矛盾', pole: 'T' }, optionB: { label: '察觉他人的情绪和需求', pole: 'F' } },
  { id: 'mbti-64', text: '你更认同：', dimension: 'TF', optionA: { label: '诚实有时比善意更重要', pole: 'T' }, optionB: { label: '善意有时比诚实更重要', pole: 'F' } },
  { id: 'mbti-68', text: '你更看重：', dimension: 'TF', optionA: { label: '正义和真理', pole: 'T' }, optionB: { label: '善良和慈悲', pole: 'F' } },
  { id: 'mbti-69', text: '你的生活节奏更偏向：', dimension: 'JP', optionA: { label: '有计划、有条理、按部就班', pole: 'J' }, optionB: { label: '灵活随性、即兴发挥', pole: 'P' } },
  { id: 'mbti-71', text: '面对截止日期，你通常：', dimension: 'JP', optionA: { label: '提前完成，留有余地', pole: 'J' }, optionB: { label: '在截止前冲刺完成', pole: 'P' } },
  { id: 'mbti-74', text: '做决定时，你倾向于：', dimension: 'JP', optionA: { label: '尽快定下来，执行', pole: 'J' }, optionB: { label: '保持选项开放，再想想', pole: 'P' } },
  { id: 'mbti-79', text: '你更认同：', dimension: 'JP', optionA: { label: '凡事预则立，不预则废', pole: 'J' }, optionB: { label: '计划赶不上变化，随机应变', pole: 'P' } },
  { id: 'mbti-84', text: '你更看重：', dimension: 'JP', optionA: { label: '秩序、可控、可预测', pole: 'J' }, optionB: { label: '自由、弹性、可能性', pole: 'P' } },
  { id: 'mbti-90', text: '完成项目时，你倾向于：', dimension: 'JP', optionA: { label: '严格按照计划推进', pole: 'J' }, optionB: { label: '根据进展灵活调整方向', pole: 'P' } }
];

const mbtiTypeInfos = {
  INTJ: { type: 'INTJ', name: '建筑师', description: 'INTJ 型人富有远见，善于制定长期计划并坚决执行。独立思考、追求完美。' },
  INTP: { type: 'INTP', name: '逻辑学家', description: 'INTP 型人热衷于探索理论和抽象概念，善于分析复杂问题。好奇、创新。' },
  ENTJ: { type: 'ENTJ', name: '指挥官', description: 'ENTJ 型人自信果断，善于领导和组织。目标导向、效率至上。' },
  ENTP: { type: 'ENTP', name: '辩论家', description: 'ENTP 型人机智灵活，擅长辩论和头脑风暴。喜欢挑战传统。' },
  INFJ: { type: 'INFJ', name: '提倡者', description: 'INFJ 型人富有洞察力和同理心，追求意义与和谐。' },
  INFP: { type: 'INFP', name: '调停者', description: 'INFP 型人敏感细腻，富有想象力和同情心。追求真实与美好。' },
  ENFJ: { type: 'ENFJ', name: '主人公', description: 'ENFJ 型人热情而有魅力，善于理解他人并激发潜能。' },
  ENFP: { type: 'ENFP', name: '竞选者', description: 'ENFP 型人热情开朗，充满想象力和感染力。好奇、灵活。' },
  ISTJ: { type: 'ISTJ', name: '物流师', description: 'ISTJ 型人踏实可靠，注重事实和规则。负责任、有条理。' },
  ISFJ: { type: 'ISFJ', name: '守卫者', description: 'ISFJ 型人温和可靠，善于照顾他人。注重细节、忠诚尽责。' },
  ESTJ: { type: 'ESTJ', name: '总经理', description: 'ESTJ 型人直接务实，善于组织和管理。追求效率和秩序。' },
  ESFJ: { type: 'ESFJ', name: '执政官', description: 'ESFJ 型人热情友善，善于照顾他人和维系和谐。' },
  ISTP: { type: 'ISTP', name: '鉴赏家', description: 'ISTP 型人冷静务实，善于动手解决问题。' },
  ISFP: { type: 'ISFP', name: '探险家', description: 'ISFP 型人温和敏感，富有艺术气质。活在当下。' },
  ESTP: { type: 'ESTP', name: '企业家', description: 'ESTP 型人活力十足，善于把握当下机会。务实、灵活。' },
  ESFP: { type: 'ESFP', name: '表演者', description: 'ESFP 型人热情开朗，善于带来欢乐和活力。' }
};

const mbtiTest = {
  id: 'mbti',
  title: 'MBTI 16型人格测试',
  subtitle: '24题精简版 · 5点量表',
  description: '从能量来源、信息获取、决策方式、生活节奏四个维度，揭示你的 16 型人格。',
  instructions: [
    '每题有两个陈述（A 和 B），请选择最符合你的程度',
    '「非常符合」表示强烈倾向，「不确定」表示两者皆有',
    '请根据真实情况和第一直觉作答，无对错之分'
  ],
  format: 'mbti',
  scaleOptions: MBTI_SCALE_OPTIONS,
  questions: mbtiQuestions,
  typeInfos: mbtiTypeInfos
};

module.exports = { mbtiTest, mbtiQuestions, MBTI_SCALE_OPTIONS, mbtiTypeInfos };
