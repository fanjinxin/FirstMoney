/**
 * MBTI 16型人格测试 - 90题完整版（5点李克特量表）
 * 四大维度：E/I（外向-内向）、S/N（实感-直觉）、T/F（思考-情感）、J/P（判断-知觉）
 * 每题两个陈述（A/B），5档选择：非常符合A · 比较符合A · 不确定 · 比较符合B · 非常符合B
 */

export type MBTIDimension = 'EI' | 'SN' | 'TF' | 'JP'
export type MBTIPole = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'

export interface MBTIStatement {
  label: string
  pole: MBTIPole
}

export interface MBTIQuestion {
  id: string
  text: string
  dimension: MBTIDimension
  optionA: MBTIStatement
  optionB: MBTIStatement
}

/** 5点李克特量表：0=非常符合A, 1=比较符合A, 2=不确定, 3=比较符合B, 4=非常符合B */
export const MBTI_SCALE_OPTIONS = [
  { label: '非常符合 A', value: 0 },
  { label: '比较符合 A', value: 1 },
  { label: '不确定', value: 2 },
  { label: '比较符合 B', value: 3 },
  { label: '非常符合 B', value: 4 },
] as const

export const MBTI_TEST_ID = 'mbti'

export const mbtiQuestions: MBTIQuestion[] = [
  // ============ E/I 维度 (23题) ============
  { id: 'mbti-1', text: '在社交聚会中，你通常：', dimension: 'EI', optionA: { label: '主动与许多人交谈，感到精力充沛', pole: 'E' }, optionB: { label: '只与少数熟人交谈，或更倾向于安静观察', pole: 'I' } },
  { id: 'mbti-2', text: '独处一段时间后，你通常：', dimension: 'EI', optionA: { label: '感到无聊，渴望与人互动', pole: 'E' }, optionB: { label: '感到放松和恢复，享受独处', pole: 'I' } },
  { id: 'mbti-3', text: '参加派对或集体活动时，你更倾向于：', dimension: 'EI', optionA: { label: '待到很晚，人越多越有劲', pole: 'E' }, optionB: { label: '提早离开，回家后感到解脱', pole: 'I' } },
  { id: 'mbti-4', text: '面对新认识的人，你通常：', dimension: 'EI', optionA: { label: '主动打开话题，感到自然', pole: 'E' }, optionB: { label: '等对方先开口，或需要时间适应', pole: 'I' } },
  { id: 'mbti-5', text: '你更喜欢的工作/学习方式是：', dimension: 'EI', optionA: { label: '小组讨论、头脑风暴、与人合作', pole: 'E' }, optionB: { label: '独自钻研、深度思考、安静专注', pole: 'I' } },
  { id: 'mbti-6', text: '你通常通过什么方式理清思路：', dimension: 'EI', optionA: { label: '与人交流，说出来才能想清楚', pole: 'E' }, optionB: { label: '独自思考，写下来或内省', pole: 'I' } },
  { id: 'mbti-7', text: '周末你更希望：', dimension: 'EI', optionA: { label: '外出聚会、见朋友、参加活动', pole: 'E' }, optionB: { label: '宅在家里、看书、独处充电', pole: 'I' } },
  { id: 'mbti-8', text: '在会议或课堂讨论中，你通常：', dimension: 'EI', optionA: { label: '积极发言，想到就说', pole: 'E' }, optionB: { label: '先听完再发言，或会后单独沟通', pole: 'I' } },
  { id: 'mbti-9', text: '你交朋友的节奏是：', dimension: 'EI', optionA: { label: '容易结交许多人，朋友圈较广', pole: 'E' }, optionB: { label: '朋友不多但交情深厚', pole: 'I' } },
  { id: 'mbti-10', text: '电话或视频来电时，你通常：', dimension: 'EI', optionA: { label: '立即接听，乐于交谈', pole: 'E' }, optionB: { label: '有时想等一等再接，或偏好文字', pole: 'I' } },
  { id: 'mbti-11', text: '遇到压力或烦恼时，你更常：', dimension: 'EI', optionA: { label: '找朋友倾诉或一起放松', pole: 'E' }, optionB: { label: '独自消化，需要安静空间', pole: 'I' } },
  { id: 'mbti-12', text: '你觉得自己更像：', dimension: 'EI', optionA: { label: '派对上的活力担当', pole: 'E' }, optionB: { label: '角落里的观察者', pole: 'I' } },
  { id: 'mbti-13', text: '学习新知识时，你更喜欢：', dimension: 'EI', optionA: { label: '与人讨论、实践演练、互动学习', pole: 'E' }, optionB: { label: '阅读、观看、独自琢磨', pole: 'I' } },
  { id: 'mbti-14', text: '在陌生环境中，你通常：', dimension: 'EI', optionA: { label: '很快融入，乐于结识新面孔', pole: 'E' }, optionB: { label: '需要时间适应，偏好熟悉的人', pole: 'I' } },
  { id: 'mbti-15', text: '你的精力主要来自：', dimension: 'EI', optionA: { label: '与外界互动、社交、活动', pole: 'E' }, optionB: { label: '独处、内省、安静时光', pole: 'I' } },
  { id: 'mbti-16', text: '你更享受：', dimension: 'EI', optionA: { label: '成为众人瞩目的焦点', pole: 'E' }, optionB: { label: '在幕后默默贡献', pole: 'I' } },
  { id: 'mbti-17', text: '做重大决定时，你倾向于：', dimension: 'EI', optionA: { label: '与人讨论，听取多方意见', pole: 'E' }, optionB: { label: '独自权衡，内心已有答案', pole: 'I' } },
  { id: 'mbti-18', text: '长假你更喜欢：', dimension: 'EI', optionA: { label: '与朋友/家人结伴旅行', pole: 'E' }, optionB: { label: '独自旅行或与极少数人出行', pole: 'I' } },
  { id: 'mbti-19', text: '你认为自己说话的方式更偏向：', dimension: 'EI', optionA: { label: '边说边想，即兴发挥', pole: 'E' }, optionB: { label: '想清楚再说，措辞谨慎', pole: 'I' } },
  { id: 'mbti-20', text: '在人群中待久了，你通常：', dimension: 'EI', optionA: { label: '仍然精力充沛', pole: 'E' }, optionB: { label: '感到疲惫，需要独处恢复', pole: 'I' } },
  { id: 'mbti-21', text: '你更容易被描述为：', dimension: 'EI', optionA: { label: '开朗外向、善于表达', pole: 'E' }, optionB: { label: '沉稳内敛、善于倾听', pole: 'I' } },
  { id: 'mbti-22', text: '解决问题时，你更喜欢：', dimension: 'EI', optionA: { label: '集思广益，团队头脑风暴', pole: 'E' }, optionB: { label: '独自分析，理清逻辑', pole: 'I' } },
  { id: 'mbti-23', text: '你理想的周末夜晚是：', dimension: 'EI', optionA: { label: '朋友聚会、聚餐、唱歌', pole: 'E' }, optionB: { label: '在家看书、追剧、早睡', pole: 'I' } },

  // ============ S/N 维度 (22题) ============
  { id: 'mbti-24', text: '你更相信：', dimension: 'SN', optionA: { label: '具体的事实、数据、经验', pole: 'S' }, optionB: { label: '直觉、灵感、可能性', pole: 'N' } },
  { id: 'mbti-25', text: '你更关注：', dimension: 'SN', optionA: { label: '当下正在发生的事', pole: 'S' }, optionB: { label: '未来的可能性和意义', pole: 'N' } },
  { id: 'mbti-26', text: '学习新事物时，你更喜欢：', dimension: 'SN', optionA: { label: '循序渐进，按步骤操作', pole: 'S' }, optionB: { label: '先把握整体框架，再填细节', pole: 'N' } },
  { id: 'mbti-27', text: '你描述事物时更倾向于：', dimension: 'SN', optionA: { label: '具体、细致、实事求是', pole: 'S' }, optionB: { label: '抽象、概括、隐喻联想', pole: 'N' } },
  { id: 'mbti-28', text: '你更喜欢的工作内容是：', dimension: 'SN', optionA: { label: '处理具体细节、执行既定计划', pole: 'S' }, optionB: { label: '探索新想法、战略规划、创新', pole: 'N' } },
  { id: 'mbti-29', text: '别人说你有时：', dimension: 'SN', optionA: { label: '过于务实，缺乏想象力', pole: 'S' }, optionB: { label: '想太多，不够接地气', pole: 'N' } },
  { id: 'mbti-30', text: '你做决定时更依赖：', dimension: 'SN', optionA: { label: '过去的经验和可验证的信息', pole: 'S' }, optionB: { label: '直觉和内在感受', pole: 'N' } },
  { id: 'mbti-31', text: '使用新设备或软件时，你更喜欢：', dimension: 'SN', optionA: { label: '按说明书一步步来', pole: 'S' }, optionB: { label: '自己摸索，跳过说明书', pole: 'N' } },
  { id: 'mbti-32', text: '你更容易注意到：', dimension: 'SN', optionA: { label: '环境中的细节变化', pole: 'S' }, optionB: { label: '事物之间的模式和联系', pole: 'N' } },
  { id: 'mbti-33', text: '你更享受：', dimension: 'SN', optionA: { label: '动手实践、亲身体验', pole: 'S' }, optionB: { label: '头脑风暴、概念探讨', pole: 'N' } },
  { id: 'mbti-34', text: '你说话的风格更接近：', dimension: 'SN', optionA: { label: '直白、具体、有一说一', pole: 'S' }, optionB: { label: '比喻、引申、留有余地', pole: 'N' } },
  { id: 'mbti-35', text: '你更容易被什么吸引：', dimension: 'SN', optionA: { label: '实际可用的技能和工具', pole: 'S' }, optionB: { label: '新颖的理论和可能性', pole: 'N' } },
  { id: 'mbti-36', text: '回顾过去时，你更常想起：', dimension: 'SN', optionA: { label: '具体的场景、细节、画面', pole: 'S' }, optionB: { label: '当时的感受、意义、启示', pole: 'N' } },
  { id: 'mbti-37', text: '面对新项目，你通常：', dimension: 'SN', optionA: { label: '先搞清楚具体怎么做', pole: 'S' }, optionB: { label: '先想清楚为什么要做、能做到什么', pole: 'N' } },
  { id: 'mbti-38', text: '你更喜欢哪种类型的书/影视：', dimension: 'SN', optionA: { label: '纪实、传记、写实风格', pole: 'S' }, optionB: { label: '科幻、奇幻、寓意深刻', pole: 'N' } },
  { id: 'mbti-39', text: '你更容易：', dimension: 'SN', optionA: { label: '记住具体的事件和数据', pole: 'S' }, optionB: { label: '记住整体的印象和感受', pole: 'N' } },
  { id: 'mbti-40', text: '你更认同：', dimension: 'SN', optionA: { label: '眼见为实，实践出真知', pole: 'S' }, optionB: { label: '灵感和远见同样重要', pole: 'N' } },
  { id: 'mbti-41', text: '计划旅行时，你更倾向于：', dimension: 'SN', optionA: { label: '查好攻略、订好酒店、按计划执行', pole: 'S' }, optionB: { label: '大致有个方向，随遇而安', pole: 'N' } },
  { id: 'mbti-42', text: '你更喜欢讨论：', dimension: 'SN', optionA: { label: '具体的人和事、眼前的方案', pole: 'S' }, optionB: { label: '抽象的概念、未来的愿景', pole: 'N' } },
  { id: 'mbti-43', text: '别人向你请教时，你更常：', dimension: 'SN', optionA: { label: '给出具体步骤和例子', pole: 'S' }, optionB: { label: '解释原理和思路', pole: 'N' } },
  { id: 'mbti-44', text: '你更容易对什么感到不耐烦：', dimension: 'SN', optionA: { label: '空洞的理论、不着边际的幻想', pole: 'S' }, optionB: { label: '繁琐的细节、重复的流程', pole: 'N' } },
  { id: 'mbti-45', text: '你更看重：', dimension: 'SN', optionA: { label: '可靠、稳定、经得起检验', pole: 'S' }, optionB: { label: '创新、突破、有潜力', pole: 'N' } },

  // ============ T/F 维度 (23题) ============
  { id: 'mbti-46', text: '做决定时，你更看重：', dimension: 'TF', optionA: { label: '逻辑、公平、客观分析', pole: 'T' }, optionB: { label: '感受、和谐、对人的影响', pole: 'F' } },
  { id: 'mbti-47', text: '与人意见不合时，你通常：', dimension: 'TF', optionA: { label: '坚持真理，即使可能伤人', pole: 'T' }, optionB: { label: '顾及对方感受，委婉表达', pole: 'F' } },
  { id: 'mbti-48', text: '你更容易被评价为：', dimension: 'TF', optionA: { label: '理性、冷静、讲道理', pole: 'T' }, optionB: { label: '温暖、体贴、善解人意', pole: 'F' } },
  { id: 'mbti-49', text: '批评别人时，你倾向于：', dimension: 'TF', optionA: { label: '直接指出问题，对事不对人', pole: 'T' }, optionB: { label: '考虑对方感受，先肯定再建议', pole: 'F' } },
  { id: 'mbti-50', text: '你更认同：', dimension: 'TF', optionA: { label: '规则面前人人平等', pole: 'T' }, optionB: { label: '特殊情况可以特殊处理', pole: 'F' } },
  { id: 'mbti-51', text: '面对哭泣的朋友，你更可能：', dimension: 'TF', optionA: { label: '分析问题，帮忙找解决办法', pole: 'T' }, optionB: { label: '先陪伴安慰，感同身受', pole: 'F' } },
  { id: 'mbti-52', text: '你更在意：', dimension: 'TF', optionA: { label: '事情做得对不对、好不好', pole: 'T' }, optionB: { label: '大家的感受和关系是否和谐', pole: 'F' } },
  { id: 'mbti-53', text: '你更喜欢哪种反馈方式：', dimension: 'TF', optionA: { label: '直接、尖锐但有用的批评', pole: 'T' }, optionB: { label: '温和、鼓励式的建议', pole: 'F' } },
  { id: 'mbti-54', text: '团队冲突时，你倾向于：', dimension: 'TF', optionA: { label: '从道理和效率角度判断', pole: 'T' }, optionB: { label: '调解关系，照顾每个人感受', pole: 'F' } },
  { id: 'mbti-55', text: '你更容易被什么打动：', dimension: 'TF', optionA: { label: '严谨的论证、精妙的设计', pole: 'T' }, optionB: { label: '真诚的情感、动人的故事', pole: 'F' } },
  { id: 'mbti-56', text: '你更看重伴侣的：', dimension: 'TF', optionA: { label: '智慧、能力、逻辑思维', pole: 'T' }, optionB: { label: '体贴、共情、情感共鸣', pole: 'F' } },
  { id: 'mbti-57', text: '你觉得自己更：', dimension: 'TF', optionA: { label: '头脑主导，理性决策', pole: 'T' }, optionB: { label: '内心主导，感觉先行', pole: 'F' } },
  { id: 'mbti-58', text: '别人说你有时：', dimension: 'TF', optionA: { label: '太冷漠、不近人情', pole: 'T' }, optionB: { label: '太感性、不够果敢', pole: 'F' } },
  { id: 'mbti-59', text: '评价一件事时，你更常：', dimension: 'TF', optionA: { label: '分析优劣、成本收益', pole: 'T' }, optionB: { label: '考虑对人的影响、价值观', pole: 'F' } },
  { id: 'mbti-60', text: '你更喜欢的工作氛围：', dimension: 'TF', optionA: { label: '竞争、效率、结果导向', pole: 'T' }, optionB: { label: '互助、包容、人情味足', pole: 'F' } },
  { id: 'mbti-61', text: '面对不公平的事，你更可能：', dimension: 'TF', optionA: { label: '从制度和规则角度分析', pole: 'T' }, optionB: { label: '为受害者感到愤怒和难过', pole: 'F' } },
  { id: 'mbti-62', text: '你更容易：', dimension: 'TF', optionA: { label: '看到逻辑漏洞和矛盾', pole: 'T' }, optionB: { label: '察觉他人的情绪和需求', pole: 'F' } },
  { id: 'mbti-63', text: '做艰难决定时，你更依赖：', dimension: 'TF', optionA: { label: '利弊分析、数据支撑', pole: 'T' }, optionB: { label: '内心感受、价值取向', pole: 'F' } },
  { id: 'mbti-64', text: '你更认同：', dimension: 'TF', optionA: { label: '诚实有时比善意更重要', pole: 'T' }, optionB: { label: '善意有时比诚实更重要', pole: 'F' } },
  { id: 'mbti-65', text: '在争执中，你更可能：', dimension: 'TF', optionA: { label: '专注于论点本身', pole: 'T' }, optionB: { label: '在意对方是否受伤', pole: 'F' } },
  { id: 'mbti-66', text: '你更容易被批评：', dimension: 'TF', optionA: { label: '缺乏共情、不解风情', pole: 'T' }, optionB: { label: '优柔寡断、感情用事', pole: 'F' } },
  { id: 'mbti-67', text: '帮助别人时，你更倾向于：', dimension: 'TF', optionA: { label: '提供实质性的解决方案', pole: 'T' }, optionB: { label: '给予情感支持和理解', pole: 'F' } },
  { id: 'mbti-68', text: '你更看重：', dimension: 'TF', optionA: { label: '正义和真理', pole: 'T' }, optionB: { label: '善良和慈悲', pole: 'F' } },

  // ============ J/P 维度 (22题) ============
  { id: 'mbti-69', text: '你的生活节奏更偏向：', dimension: 'JP', optionA: { label: '有计划、有条理、按部就班', pole: 'J' }, optionB: { label: '灵活随性、即兴发挥', pole: 'P' } },
  { id: 'mbti-70', text: '旅行时，你更喜欢：', dimension: 'JP', optionA: { label: '提前做好详细计划', pole: 'J' }, optionB: { label: '到了再说，保持开放', pole: 'P' } },
  { id: 'mbti-71', text: '面对截止日期，你通常：', dimension: 'JP', optionA: { label: '提前完成，留有余地', pole: 'J' }, optionB: { label: '在截止前冲刺完成', pole: 'P' } },
  { id: 'mbti-72', text: '你的桌面/房间更常：', dimension: 'JP', optionA: { label: '整洁有序，物归其位', pole: 'J' }, optionB: { label: '略显凌乱，但自己知道在哪', pole: 'P' } },
  { id: 'mbti-73', text: '你更容易感到压力当：', dimension: 'JP', optionA: { label: '计划被打乱、事情不确定', pole: 'J' }, optionB: { label: '被限制、缺乏选择自由', pole: 'P' } },
  { id: 'mbti-74', text: '做决定时，你倾向于：', dimension: 'JP', optionA: { label: '尽快定下来，执行', pole: 'J' }, optionB: { label: '保持选项开放，再想想', pole: 'P' } },
  { id: 'mbti-75', text: '你更喜欢的工作方式是：', dimension: 'JP', optionA: { label: '先列清单，逐项完成', pole: 'J' }, optionB: { label: '随机应变，灵感来了就做', pole: 'P' } },
  { id: 'mbti-76', text: '你更享受：', dimension: 'JP', optionA: { label: '完成任务的满足感', pole: 'J' }, optionB: { label: '探索过程的新鲜感', pole: 'P' } },
  { id: 'mbti-77', text: '周末计划被打乱时，你通常：', dimension: 'JP', optionA: { label: '感到烦躁，想恢复原计划', pole: 'J' }, optionB: { label: '顺势调整，看看有什么新可能', pole: 'P' } },
  { id: 'mbti-78', text: '你觉得自己更：', dimension: 'JP', optionA: { label: '果断、有决断力', pole: 'J' }, optionB: { label: '灵活、适应力强', pole: 'P' } },
  { id: 'mbti-79', text: '你更认同：', dimension: 'JP', optionA: { label: '凡事预则立，不预则废', pole: 'J' }, optionB: { label: '计划赶不上变化，随机应变', pole: 'P' } },
  { id: 'mbti-80', text: '你的待办事项通常：', dimension: 'JP', optionA: { label: '有明确清单，勾选完成', pole: 'J' }, optionB: { label: '在脑子里，或随时记下', pole: 'P' } },
  { id: 'mbti-81', text: '你更容易被批评：', dimension: 'JP', optionA: { label: '过于死板、不够灵活', pole: 'J' }, optionB: { label: '拖延、缺乏条理', pole: 'P' } },
  { id: 'mbti-82', text: '你更喜欢：', dimension: 'JP', optionA: { label: '把事情做完再放松', pole: 'J' }, optionB: { label: '边做边玩，劳逸结合', pole: 'P' } },
  { id: 'mbti-83', text: '面对多个选项，你通常：', dimension: 'JP', optionA: { label: '尽快做决定并执行', pole: 'J' }, optionB: { label: '迟迟难决，想收集更多信息', pole: 'P' } },
  { id: 'mbti-84', text: '你更看重：', dimension: 'JP', optionA: { label: '秩序、可控、可预测', pole: 'J' }, optionB: { label: '自由、弹性、可能性', pole: 'P' } },
  { id: 'mbti-85', text: '你的时间管理风格更接近：', dimension: 'JP', optionA: { label: '按日程表行事', pole: 'J' }, optionB: { label: '根据当下状态调整', pole: 'P' } },
  { id: 'mbti-86', text: '你更容易在什么时候有灵感：', dimension: 'JP', optionA: { label: '按计划推进工作时', pole: 'J' }, optionB: { label: '放松、闲逛、发散时', pole: 'P' } },
  { id: 'mbti-87', text: '你更喜欢：', dimension: 'JP', optionA: { label: '有结论、有产出', pole: 'J' }, optionB: { label: '有探索、有发现', pole: 'P' } },
  { id: 'mbti-88', text: '面对突发变化，你通常：', dimension: 'JP', optionA: { label: '需要时间重新规划', pole: 'J' }, optionB: { label: '很快适应，顺势而为', pole: 'P' } },
  { id: 'mbti-89', text: '你更认同：', dimension: 'JP', optionA: { label: '早做打算，心里踏实', pole: 'J' }, optionB: { label: '保持开放，迎接惊喜', pole: 'P' } },
  { id: 'mbti-90', text: '完成项目时，你倾向于：', dimension: 'JP', optionA: { label: '严格按照计划推进', pole: 'J' }, optionB: { label: '根据进展灵活调整方向', pole: 'P' } },
]

/** 16型人格详细描述 */
export interface MBTITypeInfo {
  type: string
  name: string
  nameEn: string
  emoji: string
  slogan: string
  description: string
  strengths: string[]
  weaknesses: string[]
  career: string[]
  relationships: string
  workStyle: string
  stressCoping: string
}

export const mbtiTypeInfos: Record<string, MBTITypeInfo> = {
  INTJ: { type: 'INTJ', name: '建筑师', nameEn: 'The Architect', emoji: '🏛️', slogan: '用战略眼光构建未来', description: 'INTJ 型人富有远见，善于制定长期计划并坚决执行。他们独立思考、追求完美，对复杂系统有深刻洞察，常被视为战略家和革新者。', strengths: ['战略思维', '独立自主', '意志坚定', '追求卓越', '逻辑严密'], weaknesses: ['过于挑剔', '不善表达情感', '固执己见', '对他人要求高'], career: ['战略顾问', '科学家', '工程师', '投资分析', '建筑师'], relationships: '在亲密关系中注重精神共鸣和共同成长，不太擅长表达情感，但忠诚且愿意为关系付出实质努力。', workStyle: '喜欢独立工作，制定清晰目标并高效执行，对低效和冗余缺乏耐心。', stressCoping: '倾向独处分析问题根源，通过阅读、思考或运动来恢复能量。' },
  INTP: { type: 'INTP', name: '逻辑学家', nameEn: 'The Logician', emoji: '🔬', slogan: '用逻辑解构世界的奥秘', description: 'INTP 型人热衷于探索理论和抽象概念，善于分析复杂问题。他们好奇、创新，追求知识本身，常被形容为「思维的工匠」。', strengths: ['分析能力强', '富有创造力', '客观理性', '善于发现规律', '开放包容'], weaknesses: ['拖延症', '不善社交', '过于理论化', '忽视细节'], career: ['哲学家', '程序员', '研究员', '数学家', '作家'], relationships: '渴望智力上的契合，对深度对话感兴趣，可能忽视情感表达和日常琐事。', workStyle: '喜欢研究新问题，讨厌重复性工作，需要足够的自主空间。', stressCoping: '通过深入思考、学习新事物或独处来化解压力。' },
  ENTJ: { type: 'ENTJ', name: '指挥官', nameEn: 'The Commander', emoji: '👑', slogan: '天生的领袖与变革者', description: 'ENTJ 型人自信果断，善于领导和组织。他们目标导向、效率至上，能够迅速做出决策并推动执行，是天生的管理者和企业家。', strengths: ['领导力强', '果断高效', '战略眼光', '意志坚定', '善于激励'], weaknesses: ['过于强势', '忽视他人感受', '缺乏耐心', '控制欲强'], career: ['CEO', '律师', '政治家', '项目经理', '投资人'], relationships: '在关系中追求平等和共同成长，可能显得过于理性或缺乏柔情。', workStyle: '喜欢掌控全局，制定计划并推动团队执行，追求卓越成果。', stressCoping: '通过行动解决问题，运动或投入工作来释放压力。' },
  ENTP: { type: 'ENTP', name: '辩论家', nameEn: 'The Debater', emoji: '💡', slogan: '思维敏捷的创意挑战者', description: 'ENTP 型人机智灵活，擅长辩论和头脑风暴。他们喜欢挑战传统、探索可能性，富有魅力且适应力强，是创新的催化剂。', strengths: ['思维敏捷', '善于辩论', '富有创意', '适应力强', '充满魅力'], weaknesses: ['不够专注', '好争辩', '忽视细节', '难以坚持'], career: ['创业者', '律师', '咨询师', '发明家', '营销专家'], relationships: '喜欢智力交锋和新鲜感，可能忽视关系的稳定性与日常关怀。', workStyle: '喜欢新项目和挑战，讨厌重复和官僚，需要自由和变化。', stressCoping: '通过与人辩论、尝试新事物或转换环境来缓解压力。' },
  INFJ: { type: 'INFJ', name: '提倡者', nameEn: 'The Advocate', emoji: '🌟', slogan: '安静而坚定的理想主义者', description: 'INFJ 型人富有洞察力和同理心，追求意义与和谐。他们内敛而坚定，往往有清晰的价值观和人生使命，是罕见的「神秘主义者」。', strengths: ['洞察力强', '富有同理心', '坚定理想', '善于倾听', '创意独特'], weaknesses: ['过于敏感', '追求完美', '易倦怠', '不善拒绝'], career: ['心理咨询师', '作家', '教师', '社工', '人力资源'], relationships: '追求深度连接和精神共鸣，忠诚且愿意为伴侣付出，但需要独处空间。', workStyle: '喜欢有意义的工作，关注人的成长与福祉，需要价值观一致的环境。', stressCoping: '通过独处、写作、艺术或与信任的人倾诉来恢复。' },
  INFP: { type: 'INFP', name: '调停者', nameEn: 'The Mediator', emoji: '🌸', slogan: '诗意而温柔的理想主义者', description: 'INFP 型人敏感细腻，富有想象力和同情心。他们追求真实与美好，按自己的价值观生活，常被形容为「治愈系」人格。', strengths: ['富有同情心', '创意丰富', '忠于自我', '善于倾听', '开放包容'], weaknesses: ['过于理想化', '易受伤', '逃避冲突', '难以做决定'], career: ['作家', '艺术家', '心理咨询师', '社工', '翻译'], relationships: '渴望深度情感连接，浪漫且专一，需要被理解和支持。', workStyle: '喜欢有创意和意义的工作，讨厌机械重复和高压竞争。', stressCoping: '通过独处、创作、亲近自然或与少数知己交流来疗愈。' },
  ENFJ: { type: 'ENFJ', name: '主人公', nameEn: 'The Protagonist', emoji: '🎭', slogan: '善于激励他人的领袖', description: 'ENFJ 型人热情而有魅力，善于理解他人并激发潜能。他们富有责任感，追求和谐与成长，是天生的导师和鼓舞者。', strengths: ['善于激励', '共情能力强', '有责任感', '善于协调', '魅力出众'], weaknesses: ['过于理想化', '忽视自我需求', '敏感于批评', '易过度付出'], career: ['教师', '人力资源', '公关', '心理咨询师', '培训师'], relationships: '全心全意投入关系，善于营造和谐，但可能忽视自己的边界。', workStyle: '喜欢与人合作，关注团队成长，追求有影响力的工作。', stressCoping: '通过与他人交流、倾诉或帮助他人来恢复。' },
  ENFP: { type: 'ENFP', name: '竞选者', nameEn: 'The Campaigner', emoji: '🌈', slogan: '热情洋溢的灵感创造者', description: 'ENFP 型人热情开朗，充满想象力和感染力。他们好奇、灵活，善于发现可能性，是团队中的活力源泉和创意担当。', strengths: ['热情洋溢', '富有创意', '善于沟通', '适应力强', '充满魅力'], weaknesses: ['注意力分散', '拖延', '过于敏感', '难以坚持'], career: ['创意总监', '记者', '心理咨询师', '演员', '创业'], relationships: '浪漫且投入，喜欢新鲜感和深度连接，需要自由和表达空间。', workStyle: '喜欢有创意和变化的工作，讨厌枯燥和束缚，需要激情与意义。', stressCoping: '通过社交、旅行、创作或与朋友倾诉来恢复。' },
  ISTJ: { type: 'ISTJ', name: '物流师', nameEn: 'The Logistician', emoji: '📋', slogan: '可靠务实的秩序守护者', description: 'ISTJ 型人踏实可靠，注重事实和规则。他们负责任、有条理，善于执行既定计划，是社会运转的坚实基石。', strengths: ['可靠负责', '有条理', '注重细节', '意志坚定', '实事求是'], weaknesses: ['固执', '不善变通', '忽视情感', '抗拒改变'], career: ['会计', '审计', '公务员', '工程师', '项目管理'], relationships: '忠诚稳定，用行动表达爱意，可能显得不够浪漫或表达。', workStyle: '喜欢清晰的任务和流程，按计划执行，追求准确和可靠。', stressCoping: '通过完成计划、整理事务或规律生活来获得掌控感。' },
  ISFJ: { type: 'ISFJ', name: '守卫者', nameEn: 'The Defender', emoji: '🛡️', slogan: '默默奉献的守护者', description: 'ISFJ 型人温和可靠，善于照顾他人。他们注重细节、忠诚尽责，在幕后默默付出，是团队和家庭的稳定支柱。', strengths: ['忠诚可靠', '体贴细致', '善于观察', '耐心包容', '务实负责'], weaknesses: ['过于自我牺牲', '不善拒绝', '回避冲突', '抗拒改变'], career: ['护士', '教师', '行政', '社工', '人力资源'], relationships: '用行动和细节表达爱，忠诚且愿意付出，需要被看见和感激。', workStyle: '喜欢支持性角色，注重和谐与细节，追求稳定和可预测。', stressCoping: '通过独处、亲近信任的人或完成照顾性任务来恢复。' },
  ESTJ: { type: 'ESTJ', name: '总经理', nameEn: 'The Executive', emoji: '📊', slogan: '高效务实的组织者', description: 'ESTJ 型人直接务实，善于组织和管理。他们尊重传统与规则，追求效率和秩序，是典型的「管理者」人格。', strengths: ['组织力强', '直接高效', '负责任', '公正坦率', '善于执行'], weaknesses: ['缺乏弹性', '过于强硬', '忽视感受', '难以接受批评'], career: ['经理', '法官', '军官', '企业家', '行政主管'], relationships: '忠诚且愿意承担责任，可能显得过于理性或缺乏浪漫。', workStyle: '喜欢清晰的结构和规则，按计划推进，追求高效产出。', stressCoping: '通过行动、解决问题或保持忙碌来应对压力。' },
  ESFJ: { type: 'ESFJ', name: '执政官', nameEn: 'The Consul', emoji: '🤝', slogan: '热心助人的社交能手', description: 'ESFJ 型人热情友善，善于照顾他人和维系和谐。他们注重传统、重视关系，是团队中的「粘合剂」和温暖源泉。', strengths: ['善于社交', '体贴周到', '忠诚可靠', '务实负责', '善于协调'], weaknesses: ['过于在意他人看法', '抗拒冲突', '忽视自我', '难以接受批评'], career: ['教师', '护士', '活动策划', '人力资源', '客服'], relationships: '全心投入关系，善于营造温馨氛围，需要被认可和感激。', workStyle: '喜欢与人合作，注重和谐与支持，追求被需要和认可。', stressCoping: '通过与人交流、帮助他人或维系社交来恢复。' },
  ISTP: { type: 'ISTP', name: '鉴赏家', nameEn: 'The Virtuoso', emoji: '🔧', slogan: '冷静务实的实干家', description: 'ISTP 型人冷静务实，善于动手解决问题。他们喜欢分析机械和系统，注重实效，是「工匠」型人格。', strengths: ['冷静理性', '善于动手', '适应力强', '客观务实', '独立自主'], weaknesses: ['不善表达', '容易感到无聊', '回避承诺', '难以规划长期'], career: ['工程师', '飞行员', '运动员', '技工', '侦探'], relationships: '用行动表达爱意，需要个人空间，可能显得疏离或不够浪漫。', workStyle: '喜欢动手和解决问题，讨厌冗长会议和繁琐流程，需要自由度。', stressCoping: '通过动手、运动或独处来恢复。' },
  ISFP: { type: 'ISFP', name: '探险家', nameEn: 'The Adventurer', emoji: '🎨', slogan: '温和随性的艺术家', description: 'ISFP 型人温和敏感，富有艺术气质。他们活在当下，注重美感和体验，按自己的节奏生活，是「自由灵魂」。', strengths: ['温和包容', '审美敏锐', '活在当下', '灵活随和', '忠诚真诚'], weaknesses: ['过于敏感', '逃避冲突', '难以规划', '易被忽视'], career: ['艺术家', '设计师', '音乐人', '兽医', '摄影师'], relationships: '用行动和陪伴表达爱，需要被理解和尊重，讨厌被控制。', workStyle: '喜欢有创意和美感的工作，讨厌高压和官僚，需要表达空间。', stressCoping: '通过艺术、自然、音乐或独处来疗愈。' },
  ESTP: { type: 'ESTP', name: '企业家', nameEn: 'The Entrepreneur', emoji: '🎯', slogan: '活力四射的行动派', description: 'ESTP 型人活力十足，善于把握当下机会。他们务实、灵活，喜欢行动和冒险，是「活在当下」的实践者。', strengths: ['行动力强', '适应力强', '善于观察', '直接坦率', '充满活力'], weaknesses: ['缺乏耐心', '忽视长期计划', '好冒险', '难以坚持'], career: ['销售', '运动员', '创业者', '急救员', '侦探'], relationships: '用行动和冒险表达爱，喜欢新鲜感，可能忽视深层情感需求。', workStyle: '喜欢刺激和变化，讨厌沉闷和冗长，需要即时反馈。', stressCoping: '通过运动、冒险或与人互动来释放能量。' },
  ESFP: { type: 'ESFP', name: '表演者', nameEn: 'The Entertainer', emoji: '🎪', slogan: '热情洋溢的欢乐制造者', description: 'ESFP 型人热情开朗，善于带来欢乐和活力。他们活在当下、善于察言观色，是派对和社交场合的灵魂人物。', strengths: ['热情开朗', '善于观察', '适应力强', '乐于助人', '活在当下'], weaknesses: ['缺乏长期规划', '易分心', '敏感于批评', '难以深入思考'], career: ['演员', '活动策划', '销售', '旅游', '幼教'], relationships: '用热情和陪伴表达爱，喜欢共同体验，需要被关注和认可。', workStyle: '喜欢与人互动和即时反馈，讨厌枯燥和孤独，需要活力和变化。', stressCoping: '通过社交、娱乐或运动来恢复。' },
}
