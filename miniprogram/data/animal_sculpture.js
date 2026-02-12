const animalQuestions = [
  // 1-10: Social Interaction (E)
  {
    id: 1,
    text: "遇到困难时，我的第一解决方案是：",
    options: [
      { label: "自己默默地思考解决办法", score: { E: 1, N: 3 } },
      { label: "上网搜索或查阅资料", score: { E: 3, O: 3 } },
      { label: "马上向信任的人求助", score: { E: 5, A: 4 } },
    ]
  },
  {
    id: 2,
    text: "在聚会中，我通常是：",
    options: [
      { label: "角落里的观察者", score: { E: 1 } },
      { label: "跟随朋友参与话题", score: { E: 3 } },
      { label: "活跃气氛的焦点", score: { E: 5 } },
    ]
  },
  {
    id: 3,
    text: "面对陌生人的搭讪，我会：",
    options: [
      { label: "保持警惕，简短回答", score: { E: 2, N: 4 } },
      { label: "礼貌回应，保持距离", score: { E: 3, A: 3 } },
      { label: "热情交谈，结交朋友", score: { E: 5, O: 4 } },
    ]
  },
  {
    id: 4,
    text: "周末休息时，我更倾向于：",
    options: [
      { label: "独自在家宅着", score: { E: 1 } },
      { label: "和亲密好友小聚", score: { E: 3 } },
      { label: "参加大型活动或派对", score: { E: 5 } },
    ]
  },
  {
    id: 5,
    text: "我认为自己更偏向于：",
    options: [
      { label: "独行侠", score: { E: 1, A: 2 } },
      { label: "小圈子主义者", score: { E: 3, A: 4 } },
      { label: "社交达人", score: { E: 5, A: 5 } },
    ]
  },
  // ... Adding more questions to reach 60 based on dimensions ...
  // Will generate logically consistent questions below
  {
    id: 6,
    text: "对于时尚，我的态度是：",
    options: [
      { label: "风格固定，形成了自己的经典穿搭", score: { O: 2, C: 4 } },
      { label: "舒适第一，怎么舒服怎么穿", score: { O: 3, C: 2 } },
      { label: "紧跟潮流，打扮是一种乐趣", score: { O: 5, E: 4 } },
    ]
  },
  {
    id: 7,
    text: "我喜欢的音乐/电影类型是：",
    options: [
      { label: "刺激、悬疑、充满张力的", score: { O: 4, N: 3 } },
      { label: "安静、深沉、引人思考的", score: { O: 5, E: 1 } },
      { label: "热闹、欢快、有节奏感的", score: { O: 3, E: 5 } },
    ]
  },
  {
    id: 8,
    text: "在食物选择上，我倾向于：",
    options: [
      { label: "对食物很挑剔，有明确的喜好", score: { N: 4, O: 2 } },
      { label: "忠于几样自己最爱的经典款", score: { O: 2, C: 4 } },
      { label: "勇于尝试各种新奇的美食", score: { O: 5 } },
    ]
  },
  {
    id: 9,
    text: "我理想的周末是：",
    options: [
      { label: "去博物馆、图书馆或参加讲座", score: { O: 5, E: 2 } },
      { label: "一个人在家看剧、听音乐、做美食", score: { E: 1, A: 3 } },
      { label: "和朋友一起爬山、烧烤或逛街", score: { E: 5, A: 4 } },
    ]
  },
  {
    id: 10,
    text: "我认为自己更偏向于：",
    options: [
      { label: "乐观主义者", score: { N: 1, E: 4 } },
      { label: "悲观主义者", score: { N: 5, E: 2 } },
      { label: "现实主义者", score: { N: 3, C: 4 } },
      { label: "理想主义者", score: { N: 3, O: 5 } },
    ]
  },
  {
    id: 11,
    text: "我对“白日梦”的态度是：",
    options: [
      { label: "很少做，觉得是浪费时间", score: { O: 1, C: 5 } },
      { label: "偶尔为之，但知道要回归现实", score: { O: 3, C: 3 } },
      { label: "经常做，这是我的精神乐园", score: { O: 5, N: 3 } },
    ]
  },
  {
    id: 12,
    text: "我学习新事物的最佳方式是：",
    options: [
      { label: "与人讨论，在思想碰撞中领悟", score: { E: 5, O: 4 } },
      { label: "系统听课或阅读，建立知识框架", score: { C: 5, E: 2 } },
      { label: "动手实践，在做的过程中学习", score: { O: 3, C: 3 } },
    ]
  },
  {
    id: 13,
    text: "处理问题时，我的大脑更倾向于：",
    options: [
      { label: "经验思维，借鉴过去的成功做法", score: { C: 4, O: 2 } },
      { label: "聚焦思维，深入分析问题的核心", score: { C: 5, N: 2 } },
      { label: "发散思维，联想出多种可能性", score: { O: 5, C: 2 } },
    ]
  },
  {
    id: 14,
    text: "我更相信：",
    options: [
      { label: "经验和传统", score: { O: 1, C: 4 } },
      { label: "逻辑和证据", score: { C: 5, N: 2 } },
      { label: "直觉和灵感", score: { O: 5, N: 3 } },
    ]
  },
  {
    id: 15,
    text: "我回忆过去的方式是：",
    options: [
      { label: "对过去的细节记忆犹新", score: { C: 4, N: 3 } },
      { label: "偶尔想起，但更专注于当下和未来", score: { N: 2, O: 3 } },
      { label: "经常怀念，情绪容易受回忆影响", score: { N: 5, A: 4 } },
    ]
  },
  {
    id: 16,
    text: "我对“安全感”的定义更接近于：",
    options: [
      { label: "确信自己被某个人或群体深爱着", score: { A: 5, N: 4 } },
      { label: "拥有独立自主的经济和能力", score: { C: 5, N: 2 } },
      { label: "稳定和可预测的生活环境", score: { C: 4, O: 2 } },
    ]
  },
  {
    id: 17,
    text: "当我难过时，我希望伴侣：",
    options: [
      { label: "能帮我分析问题，找到解决办法", score: { C: 5, A: 2 } },
      { label: "能静静地陪着我，不用多说什么", score: { A: 4, E: 2 } },
      { label: "能逗我开心，带我走出情绪", score: { E: 5, A: 3 } },
    ]
  },
  {
    id: 18,
    text: "我的情绪通常是：",
    options: [
      { label: "稳定而持久，很少大起大落", score: { N: 1, C: 4 } },
      { label: "内心波涛汹涌，表面波澜不惊", score: { N: 4, E: 2 } },
      { label: "写在脸上，来得快去的也快", score: { N: 3, E: 5 } },
    ]
  },
  {
    id: 19,
    text: "我表达爱意的方式是：",
    options: [
      { label: "赠送精心准备的礼物", score: { A: 3, C: 4 } },
      { label: "通过实际行动和细节照顾", score: { A: 5, C: 3 } },
      { label: "直接的言语和亲密的肢体接触", score: { A: 4, E: 5 } },
    ]
  },
  {
    id: 20,
    text: "我最无法忍受的行为是：",
    options: [
      { label: "吵闹和缺乏边界感", score: { N: 4, C: 3 } },
      { label: "愚蠢和不讲道理", score: { O: 4, A: 1 } },
      { label: "背叛和不忠诚", score: { A: 2, C: 4 } },
    ]
  },
  {
    id: 21,
    text: "我如何对待我的财物？",
    options: [
      { label: "对珍贵的东西有很强的占有欲", score: { N: 4, C: 3 } },
      { label: "分得很清，不经允许不能动我的东西", score: { C: 5, A: 2 } },
      { label: "乐于分享，我的东西就是大家的东西", score: { A: 5, E: 4 } },
    ]
  },
  {
    id: 22,
    text: "对于计划，我的态度是：",
    options: [
      { label: "严格按计划行事，不喜欢变动", score: { C: 5, O: 1 } },
      { label: "有个大概方向，细节灵活调整", score: { C: 3, O: 3 } },
      { label: "随性而至，走到哪算哪", score: { C: 1, O: 5 } },
    ]
  },
  {
    id: 23,
    text: "在团队合作中，我通常扮演：",
    options: [
      { label: "领导者，负责统筹全局", score: { E: 5, C: 4 } },
      { label: "执行者，踏实完成任务", score: { C: 5, E: 2 } },
      { label: "协调者，调解人际关系", score: { A: 5, E: 3 } },
    ]
  },
  {
    id: 24,
    text: "当我与人发生冲突时，我会：",
    options: [
      { label: "据理力争，绝不退让", score: { A: 1, E: 4 } },
      { label: "试图沟通，寻找妥协", score: { A: 4, C: 3 } },
      { label: "回避冲突，生闷气", score: { A: 3, E: 1, N: 4 } },
    ]
  },
  {
    id: 25,
    text: "我更喜欢哪种自然景观？",
    options: [
      { label: "广阔无垠的海洋或草原", score: { O: 5, E: 3 } },
      { label: "神秘幽深的森林或山谷", score: { O: 5, N: 3 } },
      { label: "温暖舒适的海滩或阳光房", score: { A: 4, N: 1 } },
    ]
  },
  {
    id: 26,
    text: "我最容易陷入的负面情绪是：",
    options: [
      { label: "焦虑，对未来的不确定性感到担忧", score: { N: 5, C: 3 } },
      { label: "孤独，感觉无人能真正理解自己", score: { N: 4, E: 2 } },
      { label: "易怒，对不公和愚蠢缺乏耐心", score: { N: 4, A: 1 } },
    ]
  },
  {
    id: 27,
    text: "在他人眼中，我可能显得：",
    options: [
      { label: "过于敏感或情绪化", score: { N: 5, A: 3 } },
      { label: "过于冷漠或疏离", score: { E: 1, A: 2 } },
      { label: "过于强势或固执", score: { E: 4, A: 1 } },
    ]
  },
  {
    id: 28,
    text: "当我感到被冒犯时，我的反应是：",
    options: [
      { label: "直接表达不满", score: { E: 5, A: 1 } },
      { label: "默默记在心里并疏远对方", score: { E: 2, A: 2, N: 4 } },
      { label: "用幽默或讽刺的方式回击", score: { O: 4, E: 3 } },
    ]
  },
  {
    id: 29,
    text: "我最大的恐惧之一是：",
    options: [
      { label: "被抛弃或不被喜爱", score: { A: 4, N: 5 } },
      { label: "失去自由或自我", score: { O: 5, N: 3 } },
      { label: "失败或变得无能", score: { C: 5, N: 4 } },
    ]
  },
  {
    id: 30,
    text: "我内心深处，是否有一个“理想自我”的形象？",
    options: [
      { label: "有，并且我一直在努力向它靠近", score: { C: 5, N: 3 } },
      { label: "有，但觉得离它很遥远", score: { N: 5, O: 3 } },
      { label: "没有，我更接受真实的自己", score: { N: 1, A: 4 } },
    ]
  },
  {
    id: 31,
    text: "独处时，我最常做的事是：",
    options: [
      { label: "反思自己，梳理内心感受", score: { N: 3, O: 3 } },
      { label: "天马行空地幻想", score: { O: 5, C: 1 } },
      { label: "专注于自己的兴趣爱好", score: { C: 4, O: 2 } },
    ]
  },
  {
    id: 32,
    text: "我认为自己的灵魂：",
    options: [
      { label: "住着一个苍老、看透一切的灵魂", score: { O: 4, E: 1 } },
      { label: "永远住着一个好奇、纯真的小孩", score: { O: 5, E: 4 } },
      { label: "是一个在不断挣扎和成长的青年", score: { N: 4, C: 3 } },
    ]
  },
  {
    id: 33,
    text: "一个秘密的、不为人知的爱好是：",
    options: [
      { label: "写日记或创作一些私人作品", score: { O: 4, E: 1 } },
      { label: "观察他人或研究心理学", score: { O: 5, A: 3 } },
      { label: "收集某种特定的小物件", score: { C: 4, O: 2 } },
    ]
  },
  {
    id: 34,
    text: "我对“命运”的看法是：",
    options: [
      { label: "相信人定胜天", score: { C: 5, N: 1 } },
      { label: "相信一切都是最好的安排", score: { A: 4, N: 2 } },
      { label: "在半信半疑间努力生活", score: { O: 3, N: 3 } },
    ]
  },
  {
    id: 35,
    text: "如果在森林里迷路了，我会：",
    options: [
      { label: "试图寻找水源或高地，寻找出路", score: { C: 5, N: 2 } },
      { label: "待在原地，等待救援", score: { C: 3, A: 3 } },
      { label: "感到恐慌，漫无目的地乱走", score: { N: 5, C: 1 } },
    ]
  },
  {
    id: 36,
    text: "如果我获得了一笔巨额奖金，我会：",
    options: [
      { label: "环游世界，尽情享受", score: { O: 5, E: 4 } },
      { label: "进行投资，让钱生钱", score: { C: 5, O: 2 } },
      { label: "捐赠一部分，然后过低调的生活", score: { A: 5, E: 1 } },
    ]
  },
  {
    id: 37,
    text: "如果只能带三样东西去荒岛，我会选：",
    options: [
      { label: "刀、打火石、水壶（实用派）", score: { C: 5, O: 1 } },
      { label: "书、日记本、笔（精神派）", score: { O: 5, N: 2 } },
      { label: "照片、玩偶、音乐播放器（情感派）", score: { A: 4, N: 4 } },
    ]
  },
  {
    id: 38,
    text: "如果我变成透明人一天，我会：",
    options: [
      { label: "恶作剧，享受不被看见的自由", score: { E: 4, A: 1 } },
      { label: "去一些平时不能去的地方满足好奇心", score: { O: 5, E: 2 } },
      { label: "静静地观察身边人的生活", score: { O: 3, E: 1 } },
    ]
  },
  {
    id: 39,
    text: "如果我能拥有一种超能力，我希望是：",
    options: [
      { label: "飞行", score: { O: 5, E: 3 } },
      { label: "读心术", score: { N: 4, A: 2 } },
      { label: "时间控制", score: { C: 5, N: 3 } },
      { label: "瞬间移动", score: { E: 4, O: 3 } },
    ]
  },
  {
    id: 40,
    text: "我认为自己最大的优点是：",
    options: [
      { label: "共情能力强，能理解他人", score: { A: 5, O: 3 } },
      { label: "思维敏捷，学习能力强", score: { C: 4, O: 4 } },
      { label: "意志坚定，有毅力", score: { C: 5, N: 1 } },
    ]
  },
  {
    id: 41,
    text: "哪种天气最让我感到舒适？",
    options: [
      { label: "晴朗明媚的晴天", score: { E: 5, N: 1 } },
      { label: "细雨绵绵的雨天", score: { N: 3, O: 4 } },
      { label: "大雪纷飞的雪天", score: { E: 1, C: 3 } },
      { label: "微风和煦的阴天", score: { A: 4, N: 2 } },
    ]
  },
  {
    id: 42,
    text: "我认为生命更像：",
    options: [
      { label: "一场冒险", score: { O: 5, E: 4 } },
      { label: "一场修行", score: { C: 4, N: 3 } },
      { label: "一场游戏", score: { E: 4, A: 2 } },
    ]
  },
  {
    id: 43,
    text: "在朋友眼中，我是什么样的人？",
    options: [
      { label: "开心果，有我在就不会冷场", score: { E: 5, A: 4 } },
      { label: "智囊团，遇到问题找我准没错", score: { C: 5, O: 3 } },
      { label: "倾听者，总是耐心听他们诉苦", score: { A: 5, E: 2 } },
    ]
  },
  {
    id: 44,
    text: "如果可以穿越，我想去：",
    options: [
      { label: "几百年前的古代，体验慢生活", score: { O: 3, N: 2 } },
      { label: "几百年后的未来，看科技发展", score: { O: 5, C: 3 } },
      { label: "回到自己的童年，弥补遗憾", score: { N: 5, A: 3 } },
    ]
  },
  {
    id: 45,
    text: "面对不喜欢的任务，我会：",
    options: [
      { label: "拖延到最后一刻才做", score: { C: 1, N: 3 } },
      { label: "硬着头皮先做完再说", score: { C: 5, N: 2 } },
      { label: "想办法推掉或找人帮忙", score: { E: 4, A: 2 } },
    ]
  },
  {
    id: 46,
    text: "我看待竞争的态度是：",
    options: [
      { label: "遇强则强，享受挑战", score: { E: 5, C: 4 } },
      { label: "佛系随缘，尽力就好", score: { A: 5, C: 2 } },
      { label: "害怕失败，容易焦虑", score: { N: 5, C: 2 } },
    ]
  },
  {
    id: 47,
    text: "在一段关系中，我最看重：",
    options: [
      { label: "彼此的忠诚和信任", score: { C: 5, A: 3 } },
      { label: "精神上的共鸣和理解", score: { O: 5, N: 2 } },
      { label: "相处时的轻松和快乐", score: { E: 5, A: 4 } },
    ]
  },
  {
    id: 48,
    text: "如果被误解了，我会：",
    options: [
      { label: "极力解释，直到对方明白", score: { E: 4, N: 4 } },
      { label: "清者自清，不屑解释", score: { A: 2, C: 3 } },
      { label: "感到委屈，不知所措", score: { N: 5, A: 3 } },
    ]
  },
  {
    id: 49,
    text: "我更喜欢哪种工作环境？",
    options: [
      { label: "团队协作，热闹有活力", score: { E: 5, A: 4 } },
      { label: "独立自主，安静不被打扰", score: { E: 1, C: 4 } },
      { label: "充满变化，富有挑战性", score: { O: 5, E: 3 } },
    ]
  },
  {
    id: 50,
    text: "当我做错事时，我会：",
    options: [
      { label: "勇于承担，立马道歉", score: { C: 5, A: 4 } },
      { label: "寻找借口，推卸责任", score: { A: 1, C: 2 } },
      { label: "内心愧疚，不敢面对", score: { N: 5, A: 3 } },
    ]
  },
  {
    id: 51,
    text: "对于“承诺”，我的看法是：",
    options: [
      { label: "一诺千金，说到做到", score: { C: 5, A: 4 } },
      { label: "量力而行，不轻易许诺", score: { C: 4, O: 2 } },
      { label: "视情况而定，计划赶不上变化", score: { O: 4, C: 1 } },
    ]
  },
  {
    id: 52,
    text: "我更倾向于通过什么方式放松？",
    options: [
      { label: "运动流汗，释放压力", score: { E: 5, C: 3 } },
      { label: "大吃一顿，满足口腹之欲", score: { E: 3, N: 2 } },
      { label: "冥想或睡觉，恢复精力", score: { E: 1, N: 3 } },
    ]
  },
  {
    id: 53,
    text: "面对复杂的人际关系，我会：",
    options: [
      { label: "游刃有余，乐在其中", score: { E: 5, A: 3 } },
      { label: "敬而远之，保持简单", score: { E: 1, A: 4 } },
      { label: "感到头疼，不知如何应对", score: { N: 5, C: 2 } },
    ]
  },
  {
    id: 54,
    text: "我对于“权威”的态度是：",
    options: [
      { label: "尊重并服从", score: { C: 5, A: 3 } },
      { label: "保持怀疑，敢于挑战", score: { O: 5, E: 4 } },
      { label: "表面顺从，内心保留意见", score: { N: 3, A: 2 } },
    ]
  },
  {
    id: 55,
    text: "在做决定时，我通常：",
    options: [
      { label: "果断迅速，不拖泥带水", score: { C: 5, E: 4 } },
      { label: "犹豫不决，反复权衡", score: { N: 5, C: 2 } },
      { label: "听取他人建议，从善如流", score: { A: 5, E: 3 } },
    ]
  },
  {
    id: 56,
    text: "我更看重一个人的：",
    options: [
      { label: "能力和才华", score: { C: 4, O: 4 } },
      { label: "品德和性格", score: { A: 5, C: 3 } },
      { label: "外貌和气质", score: { O: 3, E: 3 } },
    ]
  },
  {
    id: 57,
    text: "如果生活一成不变，我会：",
    options: [
      { label: "感到安心和踏实", score: { C: 5, O: 1 } },
      { label: "感到厌倦，想要改变", score: { O: 5, N: 2 } },
      { label: "寻找一些小确幸来调节", score: { A: 4, O: 3 } },
    ]
  },
  {
    id: 58,
    text: "对于“八卦”，我的态度是：",
    options: [
      { label: "津津乐道，消息灵通", score: { E: 5, O: 3 } },
      { label: "听听就好，不予置评", score: { A: 3, C: 3 } },
      { label: "毫无兴趣，觉得无聊", score: { C: 4, O: 1 } },
    ]
  },
  {
    id: 59,
    text: "我希望自己老了以后：",
    options: [
      { label: "儿孙满堂，享受天伦之乐", score: { A: 5, E: 3 } },
      { label: "依然保持活力，周游世界", score: { O: 5, E: 4 } },
      { label: "内心宁静，拥有智慧", score: { C: 4, N: 1 } },
    ]
  },
  {
    id: 60,
    text: "这套测试题做到现在，我的感受是：",
    options: [
      { label: "很有趣，期待结果", score: { O: 5, E: 3 } },
      { label: "有点累，但坚持做完了", score: { C: 5, N: 2 } },
      { label: "希望能准确反映我的性格", score: { C: 4, N: 3 } },
    ]
  }
];

const animalArchetypes = [
  {
    id: 'lion',
    name: '狮子',
    emoji: '🦁',
    description: '天生的领导者，自信满满，行动力强。你像狮子一样拥有强大的气场，享受掌控全局的感觉，面对挑战从不退缩。',
    traits: ['果断', '自信', '霸气', '领导力'],
    weaknesses: ['固执己见', '易怒', '控制欲强'],
    dimensions: { E: 9, A: 4, C: 8, N: 2, O: 7 }
  },
  {
    id: 'golden_retriever',
    name: '金毛寻回犬',
    emoji: '🦮',
    description: '温暖治愈的小太阳，忠诚友善，人见人爱。你像金毛一样热情开朗，总是能给身边的人带来快乐和正能量。',
    traits: ['热情', '忠诚', '友善', '治愈'],
    weaknesses: ['过于依赖', '讨好型人格', '缺乏主见'],
    dimensions: { E: 8, A: 9, C: 6, N: 3, O: 5 }
  },
  {
    id: 'cat',
    name: '波斯猫',
    emoji: '🐱',
    description: '优雅独立，保持着适当的神秘感。你像猫咪一样享受独处，有自己的节奏和原则，不会轻易被他人左右。',
    traits: ['独立', '优雅', '傲娇', '敏锐'],
    weaknesses: ['冷漠', '挑剔', '自我中心'],
    dimensions: { E: 2, A: 3, C: 6, N: 4, O: 6 }
  },
  {
    id: 'owl',
    name: '猫头鹰',
    emoji: '🦉',
    description: '智慧的化身，洞察力强，喜欢思考。你像猫头鹰一样冷静理性，善于分析问题，总是能看到别人忽略的细节。',
    traits: ['理智', '博学', '冷静', '深沉'],
    weaknesses: ['过度分析', '优柔寡断', '孤僻'],
    dimensions: { E: 2, A: 5, C: 9, N: 3, O: 8 }
  },
  {
    id: 'dolphin',
    name: '海豚',
    emoji: '🐬',
    description: '聪明伶俐，充满好奇心，自由自在。你像海豚一样富有创造力，喜欢探索新鲜事物，是团队中的开心果和灵感源泉。',
    traits: ['聪明', '活泼', '自由', '灵动'],
    weaknesses: ['缺乏耐心', '注意力分散', '情绪化'],
    dimensions: { E: 7, A: 7, C: 4, N: 2, O: 9 }
  },
  {
    id: 'wolf',
    name: '灰狼',
    emoji: '🐺',
    description: '坚韧不拔，既能独当一面，又重视团队。你像狼一样拥有极强的意志力和责任感，对认定的目标绝不轻言放弃。',
    traits: ['坚韧', '团结', '敏锐', '野性'],
    weaknesses: ['多疑', '报复心强', '难以信任'],
    dimensions: { E: 6, A: 4, C: 8, N: 4, O: 6 }
  },
  {
    id: 'rabbit',
    name: '垂耳兔',
    emoji: '🐰',
    description: '温柔敏感，心思细腻，惹人怜爱。你像兔子一样内心柔软，对周围的情绪变化非常敏感，需要安全感和呵护。',
    traits: ['温柔', '敏感', '可爱', '细腻'],
    weaknesses: ['胆小', '玻璃心', '逃避问题'],
    dimensions: { E: 3, A: 8, C: 4, N: 8, O: 5 }
  },
  {
    id: 'fox',
    name: '赤狐',
    emoji: '🦊',
    description: '机智狡黠，适应力强，充满魅力。你像狐狸一样聪明灵活，善于在各种环境中生存，总是有出人意料的鬼点子。',
    traits: ['机智', '圆滑', '迷人', '多变'],
    weaknesses: ['狡猾', '不真诚', '投机取巧'],
    dimensions: { E: 6, A: 4, C: 5, N: 5, O: 8 }
  },
  {
    id: 'panda',
    name: '大熊猫',
    emoji: '🐼',
    description: '随遇而安，心态平和，大智若愚。你像熊猫一样从容淡定，不争不抢，懂得享受生活，自带一种松弛感。',
    traits: ['佛系', '平和', '呆萌', '从容'],
    weaknesses: ['懒惰', '拖延', '缺乏上进心'],
    dimensions: { E: 4, A: 7, C: 3, N: 1, O: 4 }
  },
  {
    id: 'eagle',
    name: '金雕',
    emoji: '🦅',
    description: '目光长远，志在千里，孤傲不群。你像鹰一样拥有宏大的格局和抱负，不拘泥于眼前的小利，追求更高的境界。',
    traits: ['高远', '孤傲', '锐利', '自由'],
    weaknesses: ['傲慢', '不合群', '眼高手低'],
    dimensions: { E: 3, A: 2, C: 7, N: 2, O: 9 }
  }
];


module.exports = { animalQuestions, animalArchetypes };
