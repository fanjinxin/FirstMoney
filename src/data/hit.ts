/**
 * HIT 霍兰德职业兴趣测试
 * 共 90 题，6 维度（RIASEC），每题 是/否，选「是」得 1 分
 * R 现实型、I 研究型、A 艺术型、S 社会型、E 企业型、C 常规型
 */

export const HIT_TEST_ID = 'hit'

export const HIT_DIMENSIONS = [
  { id: 'R', name: '现实型', nameEn: 'Realistic', qStart: 1, qEnd: 15 },
  { id: 'I', name: '研究型', nameEn: 'Investigative', qStart: 16, qEnd: 30 },
  { id: 'A', name: '艺术型', nameEn: 'Artistic', qStart: 31, qEnd: 45 },
  { id: 'S', name: '社会型', nameEn: 'Social', qStart: 46, qEnd: 60 },
  { id: 'E', name: '企业型', nameEn: 'Enterprising', qStart: 61, qEnd: 75 },
  { id: 'C', name: '常规型', nameEn: 'Conventional', qStart: 76, qEnd: 90 },
] as const

export type HITDimensionId = (typeof HIT_DIMENSIONS)[number]['id']

export interface HITQuestion {
  id: number
  text: string
  dimension: HITDimensionId
}

export const hitQuestions: HITQuestion[] = [
  // 1-15 R 现实型
  { id: 1, text: '你曾经将钢笔拆开再装上过吗？', dimension: 'R' },
  { id: 2, text: '你喜欢做木工、电工、修钟表等手工活吗？', dimension: 'R' },
  { id: 3, text: '你能够用积木搭出许多造型吗？', dimension: 'R' },
  { id: 4, text: '你喜欢自己动手修理收音机、自行车吗？', dimension: 'R' },
  { id: 5, text: '你喜欢参加各种体育活动吗？', dimension: 'R' },
  { id: 6, text: '你喜欢做一些实验吗？', dimension: 'R' },
  { id: 7, text: '你喜欢动手制作模型吗？', dimension: 'R' },
  { id: 8, text: '你喜欢在户外活动吗？', dimension: 'R' },
  { id: 9, text: '你喜欢使用锤子、钳子等工具吗？', dimension: 'R' },
  { id: 10, text: '你喜欢了解收音机、电视机的工作原理吗？', dimension: 'R' },
  { id: 11, text: '你喜欢做一些有技术含量的工作吗？', dimension: 'R' },
  { id: 12, text: '你喜欢养小动物或种植花草吗？', dimension: 'R' },
  { id: 13, text: '你喜欢操作机器或驾驶车辆吗？', dimension: 'R' },
  { id: 14, text: '你喜欢修理电器或家具吗？', dimension: 'R' },
  { id: 15, text: '你喜欢从事需要体力的工作吗？', dimension: 'R' },
  // 16-30 I 研究型
  { id: 16, text: '你常常会对自然现象感到好奇吗？', dimension: 'I' },
  { id: 17, text: '你喜欢阅读科普类书籍或杂志吗？', dimension: 'I' },
  { id: 18, text: '你喜欢做数学或逻辑题吗？', dimension: 'I' },
  { id: 19, text: '你喜欢研究事物的来龙去脉吗？', dimension: 'I' },
  { id: 20, text: '你喜欢做一些小实验吗？', dimension: 'I' },
  { id: 21, text: '你喜欢独自思考问题吗？', dimension: 'I' },
  { id: 22, text: '你喜欢阅读科学家的传记吗？', dimension: 'I' },
  { id: 23, text: '你喜欢分析数据的规律吗？', dimension: 'I' },
  { id: 24, text: '你喜欢阅读学术论文或专业书籍吗？', dimension: 'I' },
  { id: 25, text: '你喜欢用科学方法解决问题吗？', dimension: 'I' },
  { id: 26, text: '你对未知领域有探索欲望吗？', dimension: 'I' },
  { id: 27, text: '你喜欢参加科技竞赛或学术讨论吗？', dimension: 'I' },
  { id: 28, text: '你喜欢查阅资料验证自己的猜想吗？', dimension: 'I' },
  { id: 29, text: '你喜欢研究事物的原理和机制吗？', dimension: 'I' },
  { id: 30, text: '你喜欢阅读百科全书或知识类节目吗？', dimension: 'I' },
  // 31-45 A 艺术型
  { id: 31, text: '你喜欢绘画、书法或设计吗？', dimension: 'A' },
  { id: 32, text: '你喜欢唱歌、演奏乐器吗？', dimension: 'A' },
  { id: 33, text: '你喜欢写作（小说、诗歌、随笔等）吗？', dimension: 'A' },
  { id: 34, text: '你喜欢参观美术馆、博物馆吗？', dimension: 'A' },
  { id: 35, text: '你喜欢用创意方式表达自己吗？', dimension: 'A' },
  { id: 36, text: '你喜欢欣赏音乐、戏剧、舞蹈吗？', dimension: 'A' },
  { id: 37, text: '你喜欢设计自己的房间或物品吗？', dimension: 'A' },
  { id: 38, text: '你喜欢摄影或剪辑视频吗？', dimension: 'A' },
  { id: 39, text: '你喜欢尝试不同的艺术形式吗？', dimension: 'A' },
  { id: 40, text: '你喜欢参加文艺演出或展览吗？', dimension: 'A' },
  { id: 41, text: '你喜欢创作与众不同的作品吗？', dimension: 'A' },
  { id: 42, text: '你喜欢用文字或图像记录生活吗？', dimension: 'A' },
  { id: 43, text: '你喜欢关注时尚、美学话题吗？', dimension: 'A' },
  { id: 44, text: '你喜欢把想法转化为可视化的表达吗？', dimension: 'A' },
  { id: 45, text: '你喜欢欣赏和评价各类艺术作品吗？', dimension: 'A' },
  // 46-60 S 社会型
  { id: 46, text: '你喜欢帮助别人解决问题吗？', dimension: 'S' },
  { id: 47, text: '你喜欢参加志愿活动或公益活动吗？', dimension: 'S' },
  { id: 48, text: '你喜欢倾听别人的烦恼并给予建议吗？', dimension: 'S' },
  { id: 49, text: '你喜欢照顾他人（如老人、小孩、病人）吗？', dimension: 'S' },
  { id: 50, text: '你喜欢在团队中协调大家的关系吗？', dimension: 'S' },
  { id: 51, text: '你喜欢参加社团或集体活动吗？', dimension: 'S' },
  { id: 52, text: '你喜欢教别人学习新技能吗？', dimension: 'S' },
  { id: 53, text: '你善于察觉他人的情绪变化吗？', dimension: 'S' },
  { id: 54, text: '你喜欢与不同类型的人交流吗？', dimension: 'S' },
  { id: 55, text: '你关心社会问题并愿意参与改善吗？', dimension: 'S' },
  { id: 56, text: '你喜欢组织聚会或活动吗？', dimension: 'S' },
  { id: 57, text: '你乐于为他人提供情感支持吗？', dimension: 'S' },
  { id: 58, text: '你喜欢在人际交往中获得成就感吗？', dimension: 'S' },
  { id: 59, text: '你喜欢参与社区或群体服务吗？', dimension: 'S' },
  { id: 60, text: '你善于化解他人之间的冲突吗？', dimension: 'S' },
  // 61-75 E 企业型
  { id: 61, text: '你喜欢在竞争中取胜吗？', dimension: 'E' },
  { id: 62, text: '你喜欢说服别人接受你的观点吗？', dimension: 'E' },
  { id: 63, text: '你喜欢担任领导或负责人吗？', dimension: 'E' },
  { id: 64, text: '你喜欢参与商业或创业类活动吗？', dimension: 'E' },
  { id: 65, text: '你喜欢制定计划并推动执行吗？', dimension: 'E' },
  { id: 66, text: '你喜欢在众人面前演讲或展示吗？', dimension: 'E' },
  { id: 67, text: '你喜欢承担有挑战性的任务吗？', dimension: 'E' },
  { id: 68, text: '你喜欢通过努力获得更高成就吗？', dimension: 'E' },
  { id: 69, text: '你喜欢销售或推广产品/想法吗？', dimension: 'E' },
  { id: 70, text: '你喜欢管理团队或项目吗？', dimension: 'E' },
  { id: 71, text: '你喜欢阅读商业、管理类书籍吗？', dimension: 'E' },
  { id: 72, text: '你喜欢在不确定中做出决策吗？', dimension: 'E' },
  { id: 73, text: '你喜欢追求权力和影响力吗？', dimension: 'E' },
  { id: 74, text: '你喜欢策划活动并统筹资源吗？', dimension: 'E' },
  { id: 75, text: '你喜欢在压力下完成目标吗？', dimension: 'E' },
  // 76-90 C 常规型
  { id: 76, text: '你喜欢把物品整理得井井有条吗？', dimension: 'C' },
  { id: 77, text: '你喜欢处理数字、报表、文档吗？', dimension: 'C' },
  { id: 78, text: '你喜欢按规则和流程办事吗？', dimension: 'C' },
  { id: 79, text: '你喜欢用电脑处理数据或文件吗？', dimension: 'C' },
  { id: 80, text: '你喜欢做会计、统计类工作吗？', dimension: 'C' },
  { id: 81, text: '你喜欢制作清晰的图表和清单吗？', dimension: 'C' },
  { id: 82, text: '你喜欢核对和检查细节吗？', dimension: 'C' },
  { id: 83, text: '你喜欢在稳定的环境中工作吗？', dimension: 'C' },
  { id: 84, text: '你喜欢归档、整理资料吗？', dimension: 'C' },
  { id: 85, text: '你喜欢按计划有条不紊地完成任务吗？', dimension: 'C' },
  { id: 86, text: '你喜欢使用办公软件处理日常事务吗？', dimension: 'C' },
  { id: 87, text: '你喜欢确保信息准确无误吗？', dimension: 'C' },
  { id: 88, text: '你喜欢遵循既定的工作流程吗？', dimension: 'C' },
  { id: 89, text: '你喜欢参与行政、后勤类工作吗？', dimension: 'C' },
  { id: 90, text: '你喜欢在有序、可预测的环境中工作吗？', dimension: 'C' },
]
