/**
 * LBT 恋爱脑测试
 * 共 20 题，3 子维度：情感依赖、优先倾斜、理性平衡
 * 5 点量表
 */

export const LBT_TEST_ID = 'lbt'

export const LBT_DIMENSIONS = [
  { id: 'depend', name: '情感依赖', qIds: [3, 8, 16, 20] },
  { id: 'prioritize', name: '优先倾斜', qIds: [1, 5, 7, 10, 12, 13, 15, 18] },
  { id: 'balance', name: '理性平衡', qIds: [2, 4, 6, 9, 11, 14, 17, 19] },
] as const

export type LBTDimensionId = (typeof LBT_DIMENSIONS)[number]['id']

export interface LBTQuestion {
  id: number
  text: string
  reverse: boolean
}

export const lbtQuestions: LBTQuestion[] = [
  { id: 1, text: '恋爱时，我经常把对方放在第一位。', reverse: false },
  { id: 2, text: '我能平衡好爱情和事业/学习。', reverse: true },
  { id: 3, text: '对方不回消息我会焦虑。', reverse: false },
  { id: 4, text: '恋爱不会影响我的其他计划。', reverse: true },
  { id: 5, text: '我常常幻想和对方的未来。', reverse: false },
  { id: 6, text: '我有自己的兴趣，不会只围着对方转。', reverse: true },
  { id: 7, text: '我会为了对方改变自己的计划。', reverse: false },
  { id: 8, text: '对方的情绪很容易影响我。', reverse: false },
  { id: 9, text: '即使恋爱，我也能专注自己的事。', reverse: true },
  { id: 10, text: '我经常想和对方待在一起。', reverse: false },
  { id: 11, text: '我能接受对方有自己独立的空间。', reverse: true },
  { id: 12, text: '恋爱占据了我大部分思绪。', reverse: false },
  { id: 13, text: '我会因为对方而忽略朋友。', reverse: false },
  { id: 14, text: '我有清晰的人生目标，不会被恋爱打乱。', reverse: true },
  { id: 15, text: '我容易在恋爱中失去自我。', reverse: false },
  { id: 16, text: '对方的态度会决定我一天的心情。', reverse: false },
  { id: 17, text: '我能理性看待感情问题。', reverse: true },
  { id: 18, text: '我经常琢磨对方在想什么。', reverse: false },
  { id: 19, text: '恋爱只是生活的一部分，不是全部。', reverse: true },
  { id: 20, text: '没有恋爱时我会感到空虚。', reverse: false },
]
