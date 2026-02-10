import { TestConfig } from '../types'

export const sriTest: TestConfig = {
  id: 'sri',
  title: 'SRI 性压抑指数测试',
  subtitle: '关注亲密表达与自我接纳',
  description:
    '本页面为演示版题库，方便搭建测试流程与结果分析界面。正式使用请替换为授权题目。',
  instructions: [
    '以近期的真实感受作答',
    '每题选择最贴近你的状态',
    '量表仅用于自我了解与沟通参考',
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
      id: 'acceptance',
      name: '自我接纳',
      description: '对亲密需求与情绪的接纳程度',
      lowHint: '自我接纳度较好。',
      midHint: '偶有内在冲突，建议关注自我关怀。',
      highHint: '内在冲突较多，建议增加自我理解与支持。',
    },
    {
      id: 'expression',
      name: '表达开放度',
      description: '表达亲密需求与想法的开放程度',
      lowHint: '表达较自然。',
      midHint: '表达有所保留，可尝试更清晰沟通。',
      highHint: '表达受限较明显，建议逐步建立安全表达方式。',
    },
    {
      id: 'anxiety',
      name: '羞耻与焦虑',
      description: '在亲密议题上的紧张与回避',
      lowHint: '紧张感较少。',
      midHint: '偶有紧张或回避感。',
      highHint: '紧张感明显，建议从安全沟通开始。',
    },
    {
      id: 'boundary',
      name: '边界清晰度',
      description: '对亲密关系边界的清晰度',
      lowHint: '边界较清晰。',
      midHint: '边界感波动，可加强共识。',
      highHint: '边界感不足，建议明确彼此舒适区。',
    },
  ],
  questions: [
    { id: 'sr1', text: '我可以坦然表达自己的亲密需求', dimension: 'expression' },
    { id: 'sr2', text: '谈到亲密话题会让我紧张', dimension: 'anxiety' },
    { id: 'sr3', text: '我能理解自己的亲密情绪', dimension: 'acceptance' },
    { id: 'sr4', text: '我担心表达需求会被否定', dimension: 'anxiety' },
    { id: 'sr5', text: '我能与伴侣清晰沟通边界', dimension: 'boundary' },
    { id: 'sr6', text: '我会回避亲密相关话题', dimension: 'anxiety' },
    { id: 'sr7', text: '我能接纳自己的亲密感受', dimension: 'acceptance' },
    { id: 'sr8', text: '我愿意表达喜欢的互动方式', dimension: 'expression' },
    { id: 'sr9', text: '我会担心自己的需求不被理解', dimension: 'anxiety' },
    { id: 'sr10', text: '我能尊重并维护双方边界', dimension: 'boundary' },
    { id: 'sr11', text: '我觉得表达亲密想法很尴尬', dimension: 'anxiety' },
    { id: 'sr12', text: '我可以清楚说出自己的舒适区', dimension: 'boundary' },
  ],
}
