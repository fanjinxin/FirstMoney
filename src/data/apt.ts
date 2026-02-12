/**
 * APT 天赋潜能评估
 * 共 60 题，6 维度，每题 5 点量表（1-5）
 * 维度：逻辑推理、语言表达、空间想象、创造力、人际交往、抗压韧性
 */

export const APT_TEST_ID = 'apt'

export const APT_DIMENSIONS = [
  { id: 'logic', name: '逻辑推理', qStart: 1, qEnd: 10 },
  { id: 'language', name: '语言表达', qStart: 11, qEnd: 20 },
  { id: 'spatial', name: '空间想象', qStart: 21, qEnd: 30 },
  { id: 'creativity', name: '创造力', qStart: 31, qEnd: 40 },
  { id: 'social', name: '人际交往', qStart: 41, qEnd: 50 },
  { id: 'resilience', name: '抗压韧性', qStart: 51, qEnd: 60 },
] as const

export type APTDimensionId = (typeof APT_DIMENSIONS)[number]['id']

export interface APTQuestion {
  id: number
  text: string
  dimension: APTDimensionId
  reverse: boolean // 反向题
}

export const aptQuestions: APTQuestion[] = [
  // 1-10 逻辑推理
  { id: 1, text: '面对复杂问题，我擅长抽丝剥茧找出关键线索。', dimension: 'logic', reverse: false },
  { id: 2, text: '我习惯用「如果……那么……」的逻辑链条推理。', dimension: 'logic', reverse: false },
  { id: 3, text: '数字和符号对我来说比文字更容易理解。', dimension: 'logic', reverse: false },
  { id: 4, text: '我能较快发现他人论证中的漏洞。', dimension: 'logic', reverse: false },
  { id: 5, text: '做数学或逻辑题时，我通常能找到多种解法。', dimension: 'logic', reverse: false },
  { id: 6, text: '我不善于从混乱信息中提炼出规律。', dimension: 'logic', reverse: true },
  { id: 7, text: '面对新规则或新系统，我能快速理清结构。', dimension: 'logic', reverse: false },
  { id: 8, text: '分析因果关系对我来说比较困难。', dimension: 'logic', reverse: true },
  { id: 9, text: '我喜欢玩解谜、策略类游戏。', dimension: 'logic', reverse: false },
  { id: 10, text: '我能较准确地预测事情的发展走向。', dimension: 'logic', reverse: false },
  // 11-20 语言表达
  { id: 11, text: '我能用简洁的语言说清复杂的概念。', dimension: 'language', reverse: false },
  { id: 12, text: '写作时，我善于组织段落和论点。', dimension: 'language', reverse: false },
  { id: 13, text: '我说话时条理清晰，很少让人误解。', dimension: 'language', reverse: false },
  { id: 14, text: '我读书时能快速抓住作者的核心观点。', dimension: 'language', reverse: false },
  { id: 15, text: '我能根据不同场合灵活调整表达方式。', dimension: 'language', reverse: false },
  { id: 16, text: '在众人面前发言时，我经常词不达意。', dimension: 'language', reverse: true },
  { id: 17, text: '我善于用比喻或故事来解释抽象概念。', dimension: 'language', reverse: false },
  { id: 18, text: '我很难把内心的想法准确表达出来。', dimension: 'language', reverse: true },
  { id: 19, text: '我乐于阅读各类文本并提炼要点。', dimension: 'language', reverse: false },
  { id: 20, text: '我善于倾听并准确复述他人的意思。', dimension: 'language', reverse: false },
  // 21-30 空间想象
  { id: 21, text: '看地图时，我能较快在脑中建立方位感。', dimension: 'spatial', reverse: false },
  { id: 22, text: '我能在脑海中旋转或重组物体的形状。', dimension: 'spatial', reverse: false },
  { id: 23, text: '装修或布局时，我能预想空间效果。', dimension: 'spatial', reverse: false },
  { id: 24, text: '我擅长识别图案、图形中的规律。', dimension: 'spatial', reverse: false },
  { id: 25, text: '走陌生路段时，我通常不会迷路。', dimension: 'spatial', reverse: false },
  { id: 26, text: '我对立体几何、3D 图形理解较快。', dimension: 'spatial', reverse: false },
  { id: 27, text: '拼装家具或模型时，我看图纸就能完成。', dimension: 'spatial', reverse: false },
  { id: 28, text: '我经常在脑中想象物体从不同角度的样子。', dimension: 'spatial', reverse: false },
  { id: 29, text: '我对空间比例和距离的感觉较准。', dimension: 'spatial', reverse: false },
  { id: 30, text: '在脑中回忆路线或场景时，画面比较清晰。', dimension: 'spatial', reverse: false },
  // 31-40 创造力
  { id: 31, text: '我常冒出别人想不到的点子。', dimension: 'creativity', reverse: false },
  { id: 32, text: '遇到难题时，我会尝试非常规的解决方式。', dimension: 'creativity', reverse: false },
  { id: 33, text: '我乐于把不同领域的想法结合起来。', dimension: 'creativity', reverse: false },
  { id: 34, text: '我经常质疑现有做法并思考改进空间。', dimension: 'creativity', reverse: false },
  { id: 35, text: '我更习惯于按既定流程做事。', dimension: 'creativity', reverse: true },
  { id: 36, text: '头脑风暴时，我能很快想出多种方案。', dimension: 'creativity', reverse: false },
  { id: 37, text: '我喜欢尝试新事物、新方法。', dimension: 'creativity', reverse: false },
  { id: 38, text: '我很难跳出常规思维框架。', dimension: 'creativity', reverse: true },
  { id: 39, text: '我常能从失败中想到新的可能性。', dimension: 'creativity', reverse: false },
  { id: 40, text: '创作类活动（写作、绘画、设计等）让我有成就感。', dimension: 'creativity', reverse: false },
  // 41-50 人际交往
  { id: 41, text: '我能较快与陌生人建立融洽关系。', dimension: 'social', reverse: false },
  { id: 42, text: '我善于察觉他人的情绪和需求。', dimension: 'social', reverse: false },
  { id: 43, text: '在团队中，我擅长协调不同人的意见。', dimension: 'social', reverse: false },
  { id: 44, text: '我能自然地表达关心与支持。', dimension: 'social', reverse: false },
  { id: 45, text: '与人沟通时，我常常感到不自在。', dimension: 'social', reverse: true },
  { id: 46, text: '我能在冲突中保持冷静并寻求共赢。', dimension: 'social', reverse: false },
  { id: 47, text: '我乐于倾听他人，不急于打断。', dimension: 'social', reverse: false },
  { id: 48, text: '我能较准确地感知群体氛围。', dimension: 'social', reverse: false },
  { id: 49, text: '在社交场合，我往往不知道说什么。', dimension: 'social', reverse: true },
  { id: 50, text: '我能与不同类型的人建立信任。', dimension: 'social', reverse: false },
  // 51-60 抗压韧性
  { id: 51, text: '遇到挫折后，我能较快恢复并继续前进。', dimension: 'resilience', reverse: false },
  { id: 52, text: '压力之下，我仍能保持做事效率。', dimension: 'resilience', reverse: false },
  { id: 53, text: '失败对我更多是学习机会而非打击。', dimension: 'resilience', reverse: false },
  { id: 54, text: '我容易因负面评价而陷入低落。', dimension: 'resilience', reverse: true },
  { id: 55, text: '面对不确定性，我能保持行动力。', dimension: 'resilience', reverse: false },
  { id: 56, text: '我有较明确的自我接纳与自信。', dimension: 'resilience', reverse: false },
  { id: 57, text: '在高压环境中，我容易焦虑或崩溃。', dimension: 'resilience', reverse: true },
  { id: 58, text: '我能从困难经历中提炼出成长经验。', dimension: 'resilience', reverse: false },
  { id: 59, text: '我善于给自己设定小目标并逐步达成。', dimension: 'resilience', reverse: false },
  { id: 60, text: '面对长期挑战，我能保持耐心与投入。', dimension: 'resilience', reverse: false },
]
