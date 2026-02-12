import { TestConfig } from '../types'

/**
 * 反向计分题目 id：选“非常符合”表示低压抑，计分时用 (6-原始分) 使高分=高压抑
 */
export const sriReverseScoreIds: string[] = [
  'sri-1', 'sri-2', 'sri-3', 'sri-4', 'sri-5', 'sri-6', 'sri-7', 'sri-8', 'sri-9', 'sri-10', 'sri-11', 'sri-12', // 欲望表达：能表达=低压抑
  'sri-15', 'sri-16', 'sri-17', 'sri-18', 'sri-20', 'sri-21', 'sri-23', 'sri-24', // 观念冲突：接纳/一致=低压抑
  'sri-29', 'sri-30', 'sri-33', 'sri-35', 'sri-36', // 情绪紧张：放松/不焦虑=低压抑
  'sri-40', 'sri-41', 'sri-42', 'sri-44', 'sri-47', 'sri-48', // 行为抑制：意愿一致/不回避=低压抑
]

/**
 * SRI 性压抑指数测试（完整版）
 * 四维度：欲望表达、观念冲突、情绪紧张、行为抑制
 * 每题 1–5 分（部分反向计分），总分换算为 0–100；等级：很低(0–20)、偏低(20–40)、中等(40–60)、偏高(60–80)、很高(80–100)
 * 性与亲密表达自评工具
 */
export const sriTest: TestConfig = {
  id: 'sri',
  title: 'SRI 性压抑指数测试',
  subtitle: '欲望表达 · 观念冲突 · 情绪紧张 · 行为抑制',
  description:
    '评估个体在性与亲密议题上压抑自身感受与欲望的程度，涵盖欲望表达、观念冲突、情绪紧张、行为抑制四个维度。结果仅供自我觉察与沟通参考。',
  instructions: [
    '请根据最近半年内的真实感受作答，无对错之分',
    '在私密、不受打扰的环境下完成，有利于更真实反映',
    '本量表仅用于自我了解与沟通参考，不构成任何临床诊断',
  ],
  options: [
    { label: '非常不符合', value: 1 },
    { label: '比较不符合', value: 2 },
    { label: '一般', value: 3 },
    { label: '比较符合', value: 4 },
    { label: '非常符合', value: 5 },
  ],
  dimensions: [
    {
      id: 'expression',
      name: '欲望表达',
      description: '对性需求与亲密偏好的表达能力与开放度',
      lowHint: '在安全情境下能较自然表达需求与偏好，沟通顺畅。',
      midHint: '表达时有保留或选择性开放，可尝试逐步增加安全表达。',
      highHint: '表达需求时明显受限或回避，建议从可接纳的小步表达开始。',
    },
    {
      id: 'conflict',
      name: '观念冲突',
      description: '内心观念、道德感与实际欲望之间的冲突程度',
      lowHint: '观念与欲望较为一致，内在冲突较少。',
      midHint: '偶有“应该”与“想要”的冲突，可尝试自我理解与整合。',
      highHint: '观念与欲望冲突明显，易自责或压抑，建议在安全前提下探讨价值观。',
    },
    {
      id: 'anxiety',
      name: '情绪紧张',
      description: '在性与亲密话题上的焦虑、羞耻与紧张感',
      lowHint: '谈及相关话题时紧张感较少，羞耻感较低。',
      midHint: '部分情境下会紧张或羞耻，可逐步在安全关系中练习。',
      highHint: '紧张、羞耻或焦虑感明显，建议从情绪觉察与安全对话开始。',
    },
    {
      id: 'inhibition',
      name: '行为抑制',
      description: '对亲密行为与性表达的抑制与回避程度',
      lowHint: '在自愿与安全前提下，行为与意愿较为一致。',
      midHint: '有时会抑制或回避某些亲密表达，可关注舒适区与边界。',
      highHint: '明显抑制或回避亲密行为，建议结合伴侣沟通与自我接纳逐步调整。',
    },
  ],
  questions: [
    // 欲望表达 (12)
    { id: 'sri-1', text: '我能在伴侣面前说出自己在亲密方面的偏好', dimension: 'expression' },
    { id: 'sri-2', text: '我可以坦然表达自己“想要”或“不想要”的界限', dimension: 'expression' },
    { id: 'sri-3', text: '当伴侣询问我的感受时，我能如实说出', dimension: 'expression' },
    { id: 'sri-4', text: '我会主动提出自己在亲密关系中的需求', dimension: 'expression' },
    { id: 'sri-5', text: '我能用语言或非语言方式让对方了解我的舒适区', dimension: 'expression' },
    { id: 'sri-6', text: '在安全的关系里，我不太会隐藏自己对亲密的真实想法', dimension: 'expression' },
    { id: 'sri-7', text: '我可以和伴侣讨论什么让我感到舒服或不舒服', dimension: 'expression' },
    { id: 'sri-8', text: '当我不愿意时，我能清楚地说“不”', dimension: 'expression' },
    { id: 'sri-9', text: '我会表达对亲密互动的喜好或节奏偏好', dimension: 'expression' },
    { id: 'sri-10', text: '我能向伴侣说明自己在什么时候需要距离或亲近', dimension: 'expression' },
    { id: 'sri-11', text: '在亲密话题上，我较少因为怕被评判而沉默', dimension: 'expression' },
    { id: 'sri-12', text: '我愿意在关系里尝试用“我需要…”的方式表达感受', dimension: 'expression' },
    // 观念冲突 (12)
    { id: 'sri-13', text: '我常觉得“想要”和“应该”在内心打架', dimension: 'conflict' },
    { id: 'sri-14', text: '我会因为自己有某些欲望而感到不该或羞耻', dimension: 'conflict' },
    { id: 'sri-15', text: '我接受“人有亲密与性的需求是正常的”这种想法', dimension: 'conflict' },
    { id: 'sri-16', text: '我内心对性的态度和我的实际感受比较一致', dimension: 'conflict' },
    { id: 'sri-17', text: '我很少因为享受亲密而事后自责', dimension: 'conflict' },
    { id: 'sri-18', text: '我觉得在关系里表达欲望是正当的', dimension: 'conflict' },
    { id: 'sri-19', text: '我会用“不正经”“不该想”等想法压抑自己的感受', dimension: 'conflict' },
    { id: 'sri-20', text: '我能把道德、价值观和身体感受分开看待', dimension: 'conflict' },
    { id: 'sri-21', text: '我很少觉得自己的欲望是“错的”', dimension: 'conflict' },
    { id: 'sri-22', text: '社会或家庭对性的看法常让我内心冲突', dimension: 'conflict' },
    { id: 'sri-23', text: '我允许自己拥有与亲密相关的想法和感受', dimension: 'conflict' },
    { id: 'sri-24', text: '我能在不否定自己的前提下，尊重自己的底线', dimension: 'conflict' },
    // 情绪紧张 (12)
    { id: 'sri-25', text: '谈到性或亲密话题时，我容易紧张或尴尬', dimension: 'anxiety' },
    { id: 'sri-26', text: '我会避免看或听与性相关的内容', dimension: 'anxiety' },
    { id: 'sri-27', text: '当伴侣提起亲密需求时，我常感到压力或焦虑', dimension: 'anxiety' },
    { id: 'sri-28', text: '我担心自己在亲密方面“不够好”或“不正常”', dimension: 'anxiety' },
    { id: 'sri-29', text: '在亲密情境下，我比较容易放松而非紧绷', dimension: 'anxiety' },
    { id: 'sri-30', text: '我很少因为性相关话题而脸红、心跳加速或想回避', dimension: 'anxiety' },
    { id: 'sri-31', text: '我会担心对方怎么看待我的身体或欲望', dimension: 'anxiety' },
    { id: 'sri-32', text: '在安全的关系里，我仍常感到羞耻或不好意思', dimension: 'anxiety' },
    { id: 'sri-33', text: '我能区分“紧张”和“不愿意”，并据此沟通', dimension: 'anxiety' },
    { id: 'sri-34', text: '我常担心表达需求会被拒绝或嘲笑', dimension: 'anxiety' },
    { id: 'sri-35', text: '亲密相关的情境很少让我长时间焦虑或事后反复想', dimension: 'anxiety' },
    { id: 'sri-36', text: '我允许自己感到渴望，而不立刻批判自己', dimension: 'anxiety' },
    // 行为抑制 (12)
    { id: 'sri-37', text: '即使想要，我有时也会压抑或推迟亲密互动', dimension: 'inhibition' },
    { id: 'sri-38', text: '我会主动回避可能引发亲密的情境或话题', dimension: 'inhibition' },
    { id: 'sri-39', text: '在伴侣表达亲近时，我常会退缩或敷衍', dimension: 'inhibition' },
    { id: 'sri-40', text: '我能根据自己真实意愿选择是否参与亲密，而非习惯性拒绝', dimension: 'inhibition' },
    { id: 'sri-41', text: '我很少因为“不该”“不好意思”而压抑身体接触', dimension: 'inhibition' },
    { id: 'sri-42', text: '当我想亲近时，我通常允许自己表达或接受', dimension: 'inhibition' },
    { id: 'sri-43', text: '我会用“太累”“没心情”等理由经常回避亲密', dimension: 'inhibition' },
    { id: 'sri-44', text: '在自愿且安全的前提下，我的行为与内心意愿较一致', dimension: 'inhibition' },
    { id: 'sri-45', text: '我难以在亲密中放松或投入，常处于“绷着”的状态', dimension: 'inhibition' },
    { id: 'sri-46', text: '我会刻意减少与伴侣的身体亲密以“保持距离”', dimension: 'inhibition' },
    { id: 'sri-47', text: '我能区分“不想”和“不敢”，并尽量按真实意愿行动', dimension: 'inhibition' },
    { id: 'sri-48', text: '在关系里，我较少长期、主动地回避所有亲密接触', dimension: 'inhibition' },
  ],
}
