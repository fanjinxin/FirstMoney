/**
 * 心理年龄测验
 * 心理年龄自评工具，共 30 题，每题三选一：是 / 吃不准 / 否
 * 得分映射心理年龄区间 20–70+ 岁
 */

export const PSYCH_AGE_TEST_ID = 'psych-age'

/** 题目计分：options[0]=是, [1]=吃不准, [2]=否 → 对应分数 */
export interface PsychAgeQuestion {
  id: number
  text: string
  dimension: PsychAgeDimensionId
  /** [是, 吃不准, 否] 对应的分数 */
  scores: [number, number, number]
}

export const PSYCH_AGE_DIMENSIONS = [
  { id: 'action', name: '行动与决断', qStart: 1, qEnd: 3 },
  { id: 'cognition', name: '言语与认知', qStart: 4, qEnd: 6 },
  { id: 'activity', name: '活动与性格', qStart: 7, qEnd: 10 },
  { id: 'emotion', name: '目标与情绪', qStart: 11, qEnd: 14 },
  { id: 'interest', name: '兴趣与学习', qStart: 15, qEnd: 20 },
  { id: 'body', name: '身心状态', qStart: 21, qEnd: 26 },
  { id: 'resilience', name: '心理韧性', qStart: 27, qEnd: 30 },
] as const

export type PsychAgeDimensionId = (typeof PSYCH_AGE_DIMENSIONS)[number]['id']

export const psychAgeQuestions: PsychAgeQuestion[] = [
  // 1-3 行动与决断
  { id: 1, text: '下决心后立即去做。', dimension: 'action', scores: [0, 1, 2] },
  { id: 2, text: '往往凭老经验办事。', dimension: 'action', scores: [2, 1, 0] },
  { id: 3, text: '对事情都有探索精神。', dimension: 'action', scores: [0, 2, 4] },
  // 4-6 言语与认知
  { id: 4, text: '说话慢而唠叨。', dimension: 'cognition', scores: [4, 2, 0] },
  { id: 5, text: '健忘。', dimension: 'cognition', scores: [4, 2, 0] },
  { id: 6, text: '怕烦心、怕做事，不想活动。', dimension: 'cognition', scores: [4, 2, 0] },
  // 7-10 活动与性格
  { id: 7, text: '喜欢参加各种运动。', dimension: 'activity', scores: [0, 1, 2] },
  { id: 8, text: '喜欢计较小事。', dimension: 'activity', scores: [2, 1, 0] },
  { id: 9, text: '日益固执起来。', dimension: 'activity', scores: [4, 2, 0] },
  { id: 10, text: '对什么事都有好奇心。', dimension: 'activity', scores: [0, 1, 2] },
  // 11-14 目标与情绪
  { id: 11, text: '有强烈的生活追求目标。', dimension: 'emotion', scores: [0, 2, 4] },
  { id: 12, text: '难以控制感情。', dimension: 'emotion', scores: [0, 1, 2] },
  { id: 13, text: '容易妒忌别人，易悲伤。', dimension: 'emotion', scores: [2, 1, 0] },
  { id: 14, text: '见到不讲理的事不那么气愤了。', dimension: 'emotion', scores: [2, 1, 0] },
  // 15-20 兴趣与学习
  { id: 15, text: '不喜欢看推理小说。', dimension: 'interest', scores: [2, 1, 0] },
  { id: 16, text: '对电影和爱情小说日益丧失兴趣。', dimension: 'interest', scores: [2, 1, 0] },
  { id: 17, text: '做事情缺乏持久性。', dimension: 'interest', scores: [4, 2, 0] },
  { id: 18, text: '不爱改变旧习惯。', dimension: 'interest', scores: [2, 1, 0] },
  { id: 19, text: '喜欢回忆过去。', dimension: 'interest', scores: [4, 2, 0] },
  { id: 20, text: '学习新事物感到困难。', dimension: 'interest', scores: [2, 1, 0] },
  // 21-26 身心状态
  { id: 21, text: '十分注意自己的身体变化。', dimension: 'body', scores: [2, 1, 0] },
  { id: 22, text: '生活兴趣的范围变小了。', dimension: 'body', scores: [4, 2, 0] },
  { id: 23, text: '看书的速度加快。', dimension: 'body', scores: [0, 1, 2] },
  { id: 24, text: '动作欠灵活。', dimension: 'body', scores: [2, 1, 0] },
  { id: 25, text: '消除疲劳感很慢。', dimension: 'body', scores: [2, 1, 0] },
  { id: 26, text: '晚上不如早晨和上午头脑清醒。', dimension: 'body', scores: [2, 1, 0] },
  // 27-30 心理韧性
  { id: 27, text: '对生活中的挫折感到烦恼。', dimension: 'resilience', scores: [2, 1, 0] },
  { id: 28, text: '缺乏自信心。', dimension: 'resilience', scores: [2, 1, 0] },
  { id: 29, text: '集中精力思考有困难。', dimension: 'resilience', scores: [4, 2, 0] },
  { id: 30, text: '工作效率降低。', dimension: 'resilience', scores: [4, 2, 0] },
]
