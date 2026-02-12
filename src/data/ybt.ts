/**
 * YBT 病娇测试
 * 共 40 题，4 维度：占有欲、控制欲、依赖度、极端倾向
 * 5 点量表
 */

export const YBT_TEST_ID = 'ybt'

export const YBT_DIMENSIONS = [
  { id: 'possess', name: '占有欲', qStart: 1, qEnd: 10 },
  { id: 'control', name: '控制欲', qStart: 11, qEnd: 20 },
  { id: 'depend', name: '依赖度', qStart: 21, qEnd: 30 },
  { id: 'extreme', name: '极端倾向', qStart: 31, qEnd: 40 },
] as const

export type YBTDimensionId = (typeof YBT_DIMENSIONS)[number]['id']

export interface YBTQuestion {
  id: number
  text: string
  dimension: YBTDimensionId
  reverse: boolean
}

export const ybtQuestions: YBTQuestion[] = [
  // 1-10 占有欲
  { id: 1, text: '我希望伴侣只对我一个人好。', dimension: 'possess', reverse: false },
  { id: 2, text: '伴侣和其他异性走得近会让我不舒服。', dimension: 'possess', reverse: false },
  { id: 3, text: '我能接受伴侣有亲密的异性朋友。', dimension: 'possess', reverse: true },
  { id: 4, text: '我希望在伴侣心中是唯一重要的。', dimension: 'possess', reverse: false },
  { id: 5, text: '伴侣对别人好我会吃醋。', dimension: 'possess', reverse: false },
  { id: 6, text: '我尊重伴侣的社交自由。', dimension: 'possess', reverse: true },
  { id: 7, text: '我很难接受伴侣心里装着别人。', dimension: 'possess', reverse: false },
  { id: 8, text: '伴侣多看别人一眼我都会在意。', dimension: 'possess', reverse: false },
  { id: 9, text: '我允许伴侣有自己的朋友圈。', dimension: 'possess', reverse: true },
  { id: 10, text: '我希望完全拥有伴侣的全部注意力。', dimension: 'possess', reverse: false },
  // 11-20 控制欲
  { id: 11, text: '我想知道伴侣的行踪和动态。', dimension: 'control', reverse: false },
  { id: 12, text: '我会希望伴侣按我的想法做事。', dimension: 'control', reverse: false },
  { id: 13, text: '我不介意伴侣保留隐私。', dimension: 'control', reverse: true },
  { id: 14, text: '我希望参与伴侣的重要决定。', dimension: 'control', reverse: false },
  { id: 15, text: '我会检查伴侣的手机或社交动态。', dimension: 'control', reverse: false },
  { id: 16, text: '我尊重伴侣的独立选择。', dimension: 'control', reverse: true },
  { id: 17, text: '我希望伴侣做什么都能告诉我。', dimension: 'control', reverse: false },
  { id: 18, text: '我会对伴侣的社交圈有意见。', dimension: 'control', reverse: false },
  { id: 19, text: '我尽量不干涉伴侣的私人空间。', dimension: 'control', reverse: true },
  { id: 20, text: '我希望在关系中掌握更多主导权。', dimension: 'control', reverse: false },
  // 21-30 依赖度
  { id: 21, text: '没有伴侣我很难开心。', dimension: 'depend', reverse: false },
  { id: 22, text: '伴侣是我的精神支柱。', dimension: 'depend', reverse: false },
  { id: 23, text: '我可以独自过得很好。', dimension: 'depend', reverse: true },
  { id: 24, text: '失去伴侣我会崩溃。', dimension: 'depend', reverse: false },
  { id: 25, text: '我的情绪很大程度上受伴侣影响。', dimension: 'depend', reverse: false },
  { id: 26, text: '我有自己的兴趣和生活重心。', dimension: 'depend', reverse: true },
  { id: 27, text: '伴侣不在身边我会焦虑。', dimension: 'depend', reverse: false },
  { id: 28, text: '我依赖伴侣来做很多决定。', dimension: 'depend', reverse: false },
  { id: 29, text: '我在情感上可以独立。', dimension: 'depend', reverse: true },
  { id: 30, text: '伴侣对我来说比什么都重要。', dimension: 'depend', reverse: false },
  // 31-40 极端倾向
  { id: 31, text: '我曾有过「得不到就毁掉」的念头。', dimension: 'extreme', reverse: false },
  { id: 32, text: '我愿意为伴侣做任何事。', dimension: 'extreme', reverse: false },
  { id: 33, text: '我从未有过极端的占有或报复想法。', dimension: 'extreme', reverse: true },
  { id: 34, text: '如果伴侣离开，我可能会做出激烈反应。', dimension: 'extreme', reverse: false },
  { id: 35, text: '我倾向于用理性处理感情问题。', dimension: 'extreme', reverse: true },
  { id: 36, text: '我可能会用极端方式挽留伴侣。', dimension: 'extreme', reverse: false },
  { id: 37, text: '我从未想过伤害或报复伴侣。', dimension: 'extreme', reverse: true },
  { id: 38, text: '在感情中我有时会失去理智。', dimension: 'extreme', reverse: false },
  { id: 39, text: '我能接受伴侣自由选择离开。', dimension: 'extreme', reverse: true },
  { id: 40, text: '感情中的背叛会激起我强烈的反应。', dimension: 'extreme', reverse: false },
]
