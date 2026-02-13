/**
 * VBT 易被欺负测试 - 移植自 src/data/vbt.ts
 * 40 题，4 维度：边界清晰度、自我主张、敏感度、应对方式
 * 5 点量表
 */
const VBT_DIMENSIONS = [
  { id: 'boundary', name: '边界清晰度', qStart: 1, qEnd: 10 },
  { id: 'assertive', name: '自我主张', qStart: 11, qEnd: 20 },
  { id: 'sensitive', name: '敏感度', qStart: 21, qEnd: 30 },
  { id: 'cope', name: '应对方式', qStart: 31, qEnd: 40 },
];

const vbtQuestions = [
  { id: 1, text: '我能明确拒绝不合理的要求。', dimension: 'boundary', reverse: false },
  { id: 2, text: '别人越界时我会立刻表明态度。', dimension: 'boundary', reverse: false },
  { id: 3, text: '我常常为了不得罪人而委屈自己。', dimension: 'boundary', reverse: true },
  { id: 4, text: '我知道自己的底线在哪里。', dimension: 'boundary', reverse: false },
  { id: 5, text: '我难以对熟人说不。', dimension: 'boundary', reverse: true },
  { id: 6, text: '被冒犯时我会表达不满。', dimension: 'boundary', reverse: false },
  { id: 7, text: '我容易在压力下妥协。', dimension: 'boundary', reverse: true },
  { id: 8, text: '我清楚什么可以接受、什么不能。', dimension: 'boundary', reverse: false },
  { id: 9, text: '别人开玩笑过度我会忍下来。', dimension: 'boundary', reverse: true },
  { id: 10, text: '我能坚持自己的立场。', dimension: 'boundary', reverse: false },
  { id: 11, text: '我敢于在冲突中表达自己的观点。', dimension: 'assertive', reverse: false },
  { id: 12, text: '面对不公平我会站出来。', dimension: 'assertive', reverse: false },
  { id: 13, text: '我倾向于回避冲突。', dimension: 'assertive', reverse: true },
  { id: 14, text: '我有信心维护自己的权益。', dimension: 'assertive', reverse: false },
  { id: 15, text: '被轻视时我通常选择沉默。', dimension: 'assertive', reverse: true },
  { id: 16, text: '我能冷静而坚定地回应攻击。', dimension: 'assertive', reverse: false },
  { id: 17, text: '我担心表达反对会破坏关系。', dimension: 'assertive', reverse: true },
  { id: 18, text: '我能够为自己辩护。', dimension: 'assertive', reverse: false },
  { id: 19, text: '面对强势的人我会退缩。', dimension: 'assertive', reverse: true },
  { id: 20, text: '我会主动争取应得的尊重。', dimension: 'assertive', reverse: false },
  { id: 21, text: '别人的负面评价会让我难过很久。', dimension: 'sensitive', reverse: false },
  { id: 22, text: '我能较快从批评中恢复。', dimension: 'sensitive', reverse: true },
  { id: 23, text: '我容易察觉别人对我的态度变化。', dimension: 'sensitive', reverse: false },
  { id: 24, text: '被忽视会让我感到受伤。', dimension: 'sensitive', reverse: false },
  { id: 25, text: '我有较厚的心理防线。', dimension: 'sensitive', reverse: true },
  { id: 26, text: '冷嘲热讽会深深刺痛我。', dimension: 'sensitive', reverse: false },
  { id: 27, text: '我倾向于不把小事放在心上。', dimension: 'sensitive', reverse: true },
  { id: 28, text: '我容易因别人的言行而自责。', dimension: 'sensitive', reverse: false },
  { id: 29, text: '我能区分「对方的问题」和「我的问题」。', dimension: 'sensitive', reverse: true },
  { id: 30, text: '被否定时我会怀疑自己。', dimension: 'sensitive', reverse: false },
  { id: 31, text: '遇到欺负我会寻求支持或帮助。', dimension: 'cope', reverse: false },
  { id: 32, text: '我倾向于独自忍受而不是说出来。', dimension: 'cope', reverse: true },
  { id: 33, text: '我会分析情况并找到应对策略。', dimension: 'cope', reverse: false },
  { id: 34, text: '我不知道该如何应对恶意对待。', dimension: 'cope', reverse: true },
  { id: 35, text: '我会记录或保留证据以便维权。', dimension: 'cope', reverse: false },
  { id: 36, text: '我常常觉得「忍一忍就过去了」。', dimension: 'cope', reverse: true },
  { id: 37, text: '我有可信任的人可以倾诉。', dimension: 'cope', reverse: false },
  { id: 38, text: '遇到欺负我通常会选择逃避。', dimension: 'cope', reverse: true },
  { id: 39, text: '我会学习如何更好地保护自己。', dimension: 'cope', reverse: false },
  { id: 40, text: '我缺乏应对冲突的技巧。', dimension: 'cope', reverse: true },
];

const vbtTest = {
  id: 'vbt',
  title: 'VBT 易被欺负测试',
  subtitle: '边界与应对',
  description: '从边界清晰度、自我主张、敏感度、应对方式四个维度，了解你在人际中是否容易受到不当对待。',
  instructions: ['请根据真实感受作答，每题五选一', '无对错之分，选最符合你的即可'],
  options: [
    { value: 1, label: '完全不符合' },
    { value: 2, label: '不太符合' },
    { value: 3, label: '一般' },
    { value: 4, label: '比较符合' },
    { value: 5, label: '完全符合' },
  ],
  questions: vbtQuestions.map(q => ({ id: q.id, text: q.text, dimension: q.dimension, reverse: q.reverse })),
};

module.exports = { vbtTest, vbtQuestions, VBT_DIMENSIONS };
