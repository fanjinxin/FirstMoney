import { TestConfig } from '../types'

/**
 * RPI 恋爱占有欲指数测试（40 题双视角完整版）
 * 四大维度：控制欲望、嫉妒强度、情感依赖、关系不安全感
 * 每维度每视角 5 题，维度分 5–25，总分 20–100；等级：低 1–25、适中 26–50、偏高 51–75、极高 76–100
 * 参考：Bowlby 依恋理论、White/Mullen 浪漫嫉妒研究、Spann/Fischer 共依赖模型
 */
export const rpiTest: TestConfig = {
  id: 'rpi',
  title: 'RPI 恋爱占有欲指数测试',
  subtitle: '40 题双视角完整版',
  description:
    '评估亲密关系中的占有欲程度，含控制欲望、嫉妒强度、情感依赖、关系不安全感四个维度。支持「给自己测」与「为恋人测」两种视角，结果可对照沟通。',
  instructions: [
    '选择视角后作答，可切换视角分别完成；双视角均完成后可查看对比报告',
    '以最近三个月内的真实体验为准',
    '本量表仅用于关系沟通与自我觉察参考，不替代专业咨询',
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
      id: 'control',
      name: '控制欲望',
      description: '对伴侣的监控与限制行为倾向（如查看手机、要求汇报行程、限制社交等）',
      lowHint: '控制倾向较低，关系边界较健康。',
      midHint: '对关系有一定控制需求，建议与伴侣讨论边界与舒适区。',
      highHint: '控制倾向较强，建议觉察不安全感来源，练习信任与开放沟通。',
    },
    {
      id: 'jealousy',
      name: '嫉妒强度',
      description: '嫉妒情绪的强度与频率（对伴侣与异性互动、前任、被称赞他人等）',
      lowHint: '嫉妒反应较少，情绪较平稳。',
      midHint: '在部分情境下会敏感，适度澄清与表达有助于关系。',
      highHint: '嫉妒反应较明显，建议结合安全感与自我认同一起探讨。',
    },
    {
      id: 'dependency',
      name: '情感依赖',
      description: '对伴侣的情感需求程度与独立性（频繁确认、独处焦虑、独立决策等）',
      lowHint: '依恋需求适中，独立性较好。',
      midHint: '依恋需求有所增加，可尝试平衡亲密与个人空间。',
      highHint: '情感依赖较强，建议逐步发展自我关怀与稳定互动节奏。',
    },
    {
      id: 'security',
      name: '关系不安全感',
      description: '在关系中的不安全感与被抛弃恐惧',
      lowHint: '关系安全感较稳定，信任感较好。',
      midHint: '安全感时有波动，建议加强正向沟通与约定。',
      highHint: '不安全感较明显，建议建立更清晰的约定与支持方式。',
    },
  ],
  questions: [
    // 自我视角 · 控制欲望 (5)
    { id: 'self-1', text: '我希望了解伴侣的日常行程和安排', dimension: 'control' },
    { id: 'self-2', text: '我会倾向于查看或过问伴侣的通讯与社交内容', dimension: 'control' },
    { id: 'self-3', text: '我希望伴侣在重要决定上先和我商量', dimension: 'control' },
    { id: 'self-4', text: '我会对伴侣与异性单独相处感到不放心', dimension: 'control' },
    { id: 'self-5', text: '我希望伴侣按照我认可的方式处理与异性的边界', dimension: 'control' },
    // 自我视角 · 嫉妒强度 (5)
    { id: 'self-6', text: '伴侣称赞或关注其他人时，我容易感到不快', dimension: 'jealousy' },
    { id: 'self-7', text: '我会想象伴侣可能被他人吸引的场景并感到难受', dimension: 'jealousy' },
    { id: 'self-8', text: '伴侣与前任或暧昧对象有关联时，我会很在意', dimension: 'jealousy' },
    { id: 'self-9', text: '伴侣和异性互动较多时，我容易焦虑或吃醋', dimension: 'jealousy' },
    { id: 'self-10', text: '我常会对比自己与伴侣身边可能出现的“竞争者”', dimension: 'jealousy' },
    // 自我视角 · 情感依赖 (5)
    { id: 'self-11', text: '我需要伴侣经常表达爱意或确认关系才安心', dimension: 'dependency' },
    { id: 'self-12', text: '伴侣长时间不联系时，我会感到焦虑或空虚', dimension: 'dependency' },
    { id: 'self-13', text: '我更希望重要的事由伴侣陪我一起做', dimension: 'dependency' },
    { id: 'self-14', text: '我会把伴侣的陪伴和回应看得很重', dimension: 'dependency' },
    { id: 'self-15', text: '我很难在伴侣忙碌或不在时保持情绪稳定', dimension: 'dependency' },
    // 自我视角 · 关系不安全感 (5)
    { id: 'self-16', text: '我常担心伴侣会离开或关系会结束', dimension: 'security' },
    { id: 'self-17', text: '伴侣没有及时回复或解释时，我容易多想', dimension: 'security' },
    { id: 'self-18', text: '我对这段关系的未来是否稳定有时感到不确定', dimension: 'security' },
    { id: 'self-19', text: '我需要在关系里反复确认“被选择”才安心', dimension: 'security' },
    { id: 'self-20', text: '我容易担心自己不够好而被伴侣放弃', dimension: 'security' },
    // 伴侣视角 · 控制欲望 (5)
    { id: 'partner-1', text: 'Ta 希望了解我的日常行程和安排', dimension: 'control' },
    { id: 'partner-2', text: 'Ta 会倾向于查看或过问我的通讯与社交内容', dimension: 'control' },
    { id: 'partner-3', text: 'Ta 希望我在重要决定上先和 Ta 商量', dimension: 'control' },
    { id: 'partner-4', text: 'Ta 对我与异性单独相处会感到不放心', dimension: 'control' },
    { id: 'partner-5', text: 'Ta 希望我按照 Ta 认可的方式处理与异性的边界', dimension: 'control' },
    // 伴侣视角 · 嫉妒强度 (5)
    { id: 'partner-6', text: '我称赞或关注其他人时，Ta 容易感到不快', dimension: 'jealousy' },
    { id: 'partner-7', text: 'Ta 会想象我可能被他人吸引并感到难受', dimension: 'jealousy' },
    { id: 'partner-8', text: '我与前任或暧昧对象有关联时，Ta 会很在意', dimension: 'jealousy' },
    { id: 'partner-9', text: '我和异性互动较多时，Ta 容易焦虑或吃醋', dimension: 'jealousy' },
    { id: 'partner-10', text: 'Ta 常会对比自己与我身边可能出现的“竞争者”', dimension: 'jealousy' },
    // 伴侣视角 · 情感依赖 (5)
    { id: 'partner-11', text: 'Ta 需要我经常表达爱意或确认关系才安心', dimension: 'dependency' },
    { id: 'partner-12', text: '我长时间不联系时，Ta 会感到焦虑或空虚', dimension: 'dependency' },
    { id: 'partner-13', text: 'Ta 更希望重要的事由我陪着一起做', dimension: 'dependency' },
    { id: 'partner-14', text: 'Ta 会把我的陪伴和回应看得很重', dimension: 'dependency' },
    { id: 'partner-15', text: 'Ta 在我忙碌或不在时较难保持情绪稳定', dimension: 'dependency' },
    // 伴侣视角 · 关系不安全感 (5)
    { id: 'partner-16', text: 'Ta 常担心我会离开或关系会结束', dimension: 'security' },
    { id: 'partner-17', text: '我没有及时回复或解释时，Ta 容易多想', dimension: 'security' },
    { id: 'partner-18', text: 'Ta 对这段关系的未来是否稳定有时感到不确定', dimension: 'security' },
    { id: 'partner-19', text: 'Ta 需要在关系里反复确认“被选择”才安心', dimension: 'security' },
    { id: 'partner-20', text: 'Ta 容易担心自己不够好而被我放弃', dimension: 'security' },
  ],
}
