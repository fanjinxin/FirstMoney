/**
 * RVT 恋爱观测试
 * 基于 Lee 六种爱情风格 / Hendrick 爱情态度量表
 * 共 36 题，6 维度：Eros、Ludus、Storge、Mania、Pragma、Agape
 * 5 点量表
 */

export const RVT_TEST_ID = 'rvt'

export const RVT_DIMENSIONS = [
  { id: 'eros', name: '浪漫情欲型', qStart: 1, qEnd: 6 },
  { id: 'ludus', name: '游戏型', qStart: 7, qEnd: 12 },
  { id: 'storge', name: '友谊型', qStart: 13, qEnd: 18 },
  { id: 'mania', name: '占有型', qStart: 19, qEnd: 24 },
  { id: 'pragma', name: '现实型', qStart: 25, qEnd: 30 },
  { id: 'agape', name: '奉献型', qStart: 31, qEnd: 36 },
] as const

export type RVTDimensionId = (typeof RVT_DIMENSIONS)[number]['id']

export interface RVTQuestion {
  id: number
  text: string
  dimension: RVTDimensionId
  reverse: boolean
}

export const rvtQuestions: RVTQuestion[] = [
  // 1-6 Eros 浪漫情欲型（重视外表吸引与激情）
  { id: 1, text: '我相信一见钟情。', dimension: 'eros', reverse: false },
  { id: 2, text: '外表吸引力对我选择伴侣很重要。', dimension: 'eros', reverse: false },
  { id: 3, text: '我容易被对方的外表或气质打动。', dimension: 'eros', reverse: false },
  { id: 4, text: '爱情应该让人心跳加速、充满激情。', dimension: 'eros', reverse: false },
  { id: 5, text: '强烈的身体吸引力是爱情的重要部分。', dimension: 'eros', reverse: false },
  { id: 6, text: '我向往热烈、浓烈的情感体验。', dimension: 'eros', reverse: false },
  // 7-12 Ludus 游戏型（把恋爱当游戏，不愿深陷）
  { id: 7, text: '恋爱就像一场游戏，不必太认真。', dimension: 'ludus', reverse: false },
  { id: 8, text: '我倾向于避免过于投入的关系。', dimension: 'ludus', reverse: false },
  { id: 9, text: '我不喜欢被一段关系束缚。', dimension: 'ludus', reverse: false },
  { id: 10, text: '恋爱中保持轻松随意就好。', dimension: 'ludus', reverse: false },
  { id: 11, text: '承诺会让我感到压力。', dimension: 'ludus', reverse: false },
  { id: 12, text: '我会认真对待每段关系并希望长久。', dimension: 'ludus', reverse: true },
  // 13-18 Storge 友谊型（由友谊慢慢发展为爱）
  { id: 13, text: '最好的爱情是从好朋友慢慢发展来的。', dimension: 'storge', reverse: false },
  { id: 14, text: '我更相信日久生情。', dimension: 'storge', reverse: false },
  { id: 15, text: '伴侣应该是我最好的朋友。', dimension: 'storge', reverse: false },
  { id: 16, text: '我重视日常相处中的默契与舒适。', dimension: 'storge', reverse: false },
  { id: 17, text: '理想的伴侣是能聊得来、处得来的人。', dimension: 'storge', reverse: false },
  { id: 18, text: '爱情会随着时间慢慢加深。', dimension: 'storge', reverse: false },
  // 19-24 Mania 占有型（依赖、占有、情绪强烈）
  { id: 19, text: '没有伴侣我很难开心。', dimension: 'mania', reverse: false },
  { id: 20, text: '我会很在意伴侣的一举一动。', dimension: 'mania', reverse: false },
  { id: 21, text: '我容易在恋爱中失去自我。', dimension: 'mania', reverse: false },
  { id: 22, text: '我很难接受伴侣心里装着别人。', dimension: 'mania', reverse: false },
  { id: 23, text: '恋爱时我常常感到焦虑和不安全。', dimension: 'mania', reverse: false },
  { id: 24, text: '我希望完全拥有伴侣的注意力。', dimension: 'mania', reverse: false },
  // 25-30 Pragma 现实型（看重条件、合适）
  { id: 25, text: '选择伴侣时，经济条件很重要。', dimension: 'pragma', reverse: false },
  { id: 26, text: '我认为门当户对有一定道理。', dimension: 'pragma', reverse: false },
  { id: 27, text: '我会理性评估一段关系是否可行。', dimension: 'pragma', reverse: false },
  { id: 28, text: '合适比感觉更重要。', dimension: 'pragma', reverse: false },
  { id: 29, text: '恋爱要考虑未来和现实规划。', dimension: 'pragma', reverse: false },
  { id: 30, text: '只要相爱就能克服一切困难。', dimension: 'pragma', reverse: true },
  // 31-36 Agape 奉献型（无私付出）
  { id: 31, text: '我愿意为伴侣付出一切。', dimension: 'agape', reverse: false },
  { id: 32, text: '爱一个人就应该无条件为他/她着想。', dimension: 'agape', reverse: false },
  { id: 33, text: '我很少计较恋爱中的得失。', dimension: 'agape', reverse: false },
  { id: 34, text: '伴侣的幸福比我的需求更重要。', dimension: 'agape', reverse: false },
  { id: 35, text: '我会优先满足伴侣的愿望。', dimension: 'agape', reverse: false },
  { id: 36, text: '恋爱中应该平等付出，不必一味牺牲。', dimension: 'agape', reverse: true },
]
