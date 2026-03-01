import TestCard from '../components/TestCard'
import { rpiTest } from '../data/rpi'
import { scl90Test } from '../data/scl90'
import { sriTest } from '../data/sri'
import { mbtiQuestions } from '../data/mbti'
import { aatQuestions } from '../data/aat'
import { psychAgeQuestions } from '../data/psych_age'
import { aptQuestions } from '../data/apt'
import { hitQuestions } from '../data/hit'
import { dthQuestions } from '../data/dth'
import { tlaQuestions } from '../data/tla'
import { fftQuestions } from '../data/fft'
import { ybtQuestions } from '../data/ybt'
import { rvtQuestions } from '../data/rvt'
import { lbtQuestions } from '../data/lbt'
import { mptQuestions } from '../data/mpt'
import { vbtQuestions } from '../data/vbt'
import { cityQuestions } from '../data/city'
import { Heart, Key, Cat, Puzzle, BarChart2, BookOpen, Sparkles, Shield, Cherry, MapPin } from 'lucide-react'
import huolandeIcon from '../assets/huolande/huolande-icon.png'
import rpiIcon from '../assets/icons/rpi.svg'
import scl90Icon from '../assets/icons/scl90.svg'

export default function Home() {
  // 首页测评卡片：统一结构（title / subtitle / description / to / icon / iconBg / duration / questionCount / backgroundClass / hot），新测评按此格式添加即可
  const tests = [
    {
      title: 'MBTI 16型人格测试',
      subtitle: '四维度性格探索',
      description:
        '90 题 5 点量表，从能量来源、信息获取、决策方式、生活节奏四个维度，深入解析你的性格类型，生成详细图文报告。',
      to: '/mbti',
      resultTo: '/mbti/result',
      testId: 'mbti' as const,
      icon: <Puzzle className="animate-float" />,
      iconBg: 'bg-xia-aqua/20',
      duration: '约15-20分钟',
      questionCount: mbtiQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-aqua/10 via-white to-xia-cream/20',
      hot: true,
      usageText: '12w+ 使用过',
    },
    {
      title: 'FFT 水果塑形测试',
      subtitle: '九型水果人格',
      description: '通过 54 道情境选择题，探索你的水果人格类型。苹果、葡萄、草莓、橙子、柠檬、香蕉、梨、樱桃、柚子代表不同性格倾向。',
      to: '/fft',
      resultTo: '/fft/result',
      testId: 'fft' as const,
      icon: <Cherry className="animate-float" />,
      iconBg: 'bg-xia-cream',
      duration: '约8-12分钟',
      questionCount: fftQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-cream/30 via-white to-xia-haze/20',
      hot: true,
      usageText: '8.5w+ 使用过',
    },
    {
      title: '人格动物塑测试',
      subtitle: '精神动物原型',
      description:
        '通过 60 道情境选择题，探索你内心深处的动物原型。基于五大性格特质（FFM）模型，揭示你的主导动物形态与潜在特质，发现真实的自己。',
      to: '/animal',
      resultTo: '/animal/result',
      testId: 'animal' as const,
      icon: <Cat className="animate-float" />,
      iconBg: 'bg-xia-cream/20',
      duration: '约10-15分钟',
      questionCount: 60,
      backgroundClass: 'bg-gradient-to-br from-xia-cream/20 via-white to-xia-sky/10',
      usageText: '6.8w+ 使用过',
    },
    {
      title: 'RVT 恋爱观测试',
      subtitle: '爱情观',
      description: '基于 Lee 六种爱情风格（Eros / Ludus / Storge / Mania / Pragma / Agape），了解你对爱情的信念与期待。',
      to: '/rvt',
      resultTo: '/rvt/result',
      testId: 'rvt' as const,
      icon: <Heart className="animate-float" />,
      iconBg: 'bg-xia-sky/20',
      duration: '约8-12分钟',
      questionCount: rvtQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-sky/10 via-white to-xia-haze/20',
      usageText: '5.2w+ 使用过',
    },
    {
      title: '你最宜居的城市测试',
      subtitle: '择城参考',
      description: '从气候、生活节奏、文化氛围、成本、社交需求五个维度，了解你理想城市的特征。',
      to: '/city',
      resultTo: '/city/result',
      testId: 'city' as const,
      icon: <MapPin className="animate-float" />,
      iconBg: 'bg-xia-aqua/20',
      duration: '约8-12分钟',
      questionCount: cityQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-aqua/10 via-white to-xia-cream/20',
      usageText: '4.1w+ 使用过',
    },
    {
      title: 'SCL-90 心理健康自评量表',
      subtitle: '综合心理评估',
      description:
        '评估最近一周的身心症状与心理困扰程度，涵盖躯体化、焦虑、抑郁、强迫、人际敏感、敌对、恐怖、偏执等 10 个因子，帮助了解情绪与压力状态，适合自我筛查与觉察。',
      to: '/scl90',
      resultTo: '/scl90/result',
      testId: 'scl90' as const,
      icon: <img src={`${import.meta.env.BASE_URL}icons/target.svg`} alt="SCL-90" className="animate-float h-full w-full object-contain" />,
      iconBg: 'bg-xia-sky/20',
      duration: '约15-20分钟',
      questionCount: scl90Test.questions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-sky/10 via-white to-xia-haze/20',
      usageText: '3.6w+ 使用过',
    },
    {
      title: 'RPI 恋爱占有欲指数测试',
      subtitle: '双视角关系评估',
      description:
        '评估亲密关系中的占有欲与安全感，支持自我视角与伴侣视角，帮助理解边界与依赖程度，适合情侣或对关系质量有好奇的个体。',
      to: '/rpi',
      resultTo: '/rpi/result',
      testId: 'rpi' as const,
      icon: <img src={rpiIcon} alt="RPI" className="animate-float h-6 w-6 sm:h-7 sm:w-7 object-contain" />,
      iconBg: 'bg-xia-mint/20',
      duration: '约10-15分钟',
      questionCount: rpiTest.questions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-mint/10 via-white to-xia-cream/30',
      usageText: '2.9w+ 使用过',
    },
    {
      title: 'SRI 性压抑指数测试',
      subtitle: '亲密表达评估',
      description:
        '评估个体在性与亲密议题上压抑自身感受与欲望的程度，涵盖欲望表达、观念冲突、情绪紧张、行为抑制四个维度。结果仅供自我觉察与沟通参考。',
      to: '/sri',
      resultTo: '/sri/result',
      testId: 'sri' as const,
      icon: <img src={`${import.meta.env.BASE_URL}icons/sri.svg`} alt="SRI" className="animate-float h-full w-full object-contain" />,
      iconBg: 'bg-xia-cream',
      duration: '约15-25分钟',
      questionCount: sriTest.questions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-cream/30 via-white to-xia-haze/20',
      usageText: '2.3w+ 使用过',
    },
    {
      title: 'AAT 学习适应性测验',
      subtitle: '学习适应度评估',
      description:
        '评估学习热情、学习计划、听课方法、读书笔记、学习技术、应试方法、家庭学校朋友环境、独立性、毅力与心身健康等 12 个因子，帮助发现学习适应问题，提升学习效率。',
      to: '/aat',
      resultTo: '/aat/result',
      testId: 'aat' as const,
      icon: <BookOpen className="animate-float" />,
      iconBg: 'bg-xia-sky/20',
      duration: '约20-30分钟',
      questionCount: aatQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-sky/10 via-white to-xia-haze/20',
      usageText: '1.8w+ 使用过',
    },
    {
      title: '心理年龄测验',
      subtitle: '心理特征年龄倾向',
      description:
        '本测验从行动决断、言语认知、活动性格、目标情绪、兴趣学习、身心状态、心理韧性七个维度，评估你的心理特征所呈现的年龄倾向。结果可与实际年龄对照，帮助自我觉察。',
      to: '/psych-age',
      resultTo: '/psych-age/result',
      testId: 'psych-age' as const,
      icon: <img src={`${import.meta.env.BASE_URL}icons/psych-age.svg`} alt="心理年龄" className="animate-float h-full w-full object-contain" />,
      iconBg: 'bg-xia-aqua/20',
      duration: '约5-8分钟',
      questionCount: psychAgeQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-aqua/10 via-white to-xia-cream/20',
      usageText: '1.5w+ 使用过',
    },
    {
      title: 'APT 天赋潜能评估',
      subtitle: '六维潜能探索',
      description: '从逻辑推理、语言表达、空间想象、创造力、人际交往、抗压韧性六个维度，评估你的天赋倾向与发展空间。',
      to: '/apt',
      resultTo: '/apt/result',
      testId: 'apt' as const,
      icon: <Sparkles className="animate-float" />,
      iconBg: 'bg-xia-mint/20',
      duration: '约12-18分钟',
      questionCount: aptQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-mint/10 via-white to-xia-cream/20',
      usageText: '1.2w+ 使用过',
    },
    {
      title: 'HIT 霍兰德职业兴趣测试',
      subtitle: 'RIASEC 六型',
      description: '评估你在现实型、研究型、艺术型、社会型、企业型、常规型六类职业兴趣上的倾向，生成霍兰德代码。',
      to: '/hit',
      resultTo: '/hit/result',
      testId: 'hit' as const,
      icon: <img src={huolandeIcon} alt="霍兰德" className="animate-float" />,
      iconBg: 'bg-xia-sky/20',
      duration: '约15-20分钟',
      questionCount: hitQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-sky/10 via-white to-xia-haze/20',
      usageText: '1w+ 使用过',
    },
    {
      title: 'DTH 黑暗三角人格测试',
      subtitle: '人格暗面探索',
      description: '从马基雅维利主义、自恋、精神病态三个维度，探索人格的暗面特质。仅供教育参考，不用于诊断。',
      to: '/dth',
      resultTo: '/dth/result',
      testId: 'dth' as const,
      icon: <Shield className="animate-float" />,
      iconBg: 'bg-xia-deep/10',
      duration: '约15-20分钟',
      questionCount: dthQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-cream/20 via-white to-xia-haze/20',
      usageText: '8.5k+ 使用过',
    },
    {
      title: 'TLA 年上年下恋爱测试',
      subtitle: '恋爱偏好',
      description: '从年上/年下倾向、照顾欲/被照顾欲四个维度，了解你在亲密关系中的偏好与角色倾向。',
      to: '/tla',
      resultTo: '/tla/result',
      testId: 'tla' as const,
      icon: <Heart className="animate-float" />,
      iconBg: 'bg-xia-mint/20',
      duration: '约10-15分钟',
      questionCount: tlaQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-mint/10 via-white to-xia-cream/30',
      usageText: '7.2k+ 使用过',
    },
    {
      title: 'YBT 病娇测试',
      subtitle: '占有倾向',
      description: '从占有欲、控制欲、依赖度、极端倾向四个维度，探索你在亲密关系中的倾向。仅供娱乐与自我觉察。',
      to: '/ybt',
      resultTo: '/ybt/result',
      testId: 'ybt' as const,
      icon: <Heart className="animate-float" />,
      iconBg: 'bg-xia-aqua/20',
      duration: '约8-12分钟',
      questionCount: ybtQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-aqua/10 via-white to-xia-cream/20',
      usageText: '6.1k+ 使用过',
    },
    {
      title: 'LBT 恋爱脑测试',
      subtitle: '投入程度',
      description: '了解你在恋爱中的投入程度与平衡能力，探索是否容易在感情中失去自我。',
      to: '/lbt',
      resultTo: '/lbt/result',
      testId: 'lbt' as const,
      icon: <img src={scl90Icon} alt="恋爱脑" className="animate-float h-full w-full object-contain" />,
      iconBg: 'bg-xia-mint/20',
      duration: '约3-5分钟',
      questionCount: lbtQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-mint/10 via-white to-xia-cream/30',
      usageText: '5.3k+ 使用过',
    },
    {
      title: 'MPT 麋鹿性偏好测试',
      subtitle: '亲密偏好',
      description: '从亲密、激情、浪漫、探索四个维度，探索你在亲密关系中的倾向。仅限成年人自我觉察。',
      to: '/mpt',
      resultTo: '/mpt/result',
      testId: 'mpt' as const,
      icon: <Key className="animate-float" />,
      iconBg: 'bg-xia-cream',
      duration: '约15-20分钟',
      questionCount: mptQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-cream/30 via-white to-xia-haze/20',
      usageText: '4.6k+ 使用过',
    },
    {
      title: 'VBT 易被欺负测试',
      subtitle: '边界与应对',
      description: '从边界清晰度、自我主张、敏感度、应对方式四个维度，了解你在人际中是否容易受到不当对待。',
      to: '/vbt',
      resultTo: '/vbt/result',
      testId: 'vbt' as const,
      icon: <Shield className="animate-float" />,
      iconBg: 'bg-xia-sky/20',
      duration: '约8-12分钟',
      questionCount: vbtQuestions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-sky/10 via-white to-xia-haze/20',
      usageText: '3.9k+ 使用过',
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in sm:space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-xia-haze bg-gradient-to-br from-white via-white to-xia-cream/20 p-6 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute -right-12 top-6 h-40 w-40 rounded-full bg-xia-sky/20 blur-3xl animate-glow" />
        <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-xia-mint/20 blur-3xl animate-glow" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-xia-deep/5 px-3 py-1.5 text-[11px] font-semibold tracking-widest text-xia-deep/60 sm:px-4 sm:py-2 sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-xia-aqua animate-pulse" />
              轻量心理测评 · 即开即测
            </div>
            <h1 className="text-2xl font-semibold leading-tight text-xia-deep sm:text-4xl">
              更酷的测评体验，快速获得多维度洞察
            </h1>
            <p className="text-sm leading-relaxed text-xia-deep/80 sm:text-base">
              更直观的流程、更清晰的反馈、更有节奏的体验感，帮助你专注于真实感受。
              测试结果将以图表与建议结合的方式呈现。
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-medium text-xia-deep/70 sm:gap-3 sm:text-xs">
              <span className="rounded-full bg-white/70 px-3 py-1 shadow-sm">即时解析</span>
              <span className="rounded-full bg-white/70 px-3 py-1 shadow-sm">多维度雷达</span>
              <span className="rounded-full bg-white/70 px-3 py-1 shadow-sm">隐私友好</span>
            </div>
          </div>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-xia-haze/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-xia-deep/40">
                测评亮点
              </div>
              <div className="mt-2 text-base font-semibold text-xia-deep sm:mt-3 sm:text-lg">
                自动生成个性化建议
              </div>
              <p className="mt-2 text-sm text-xia-deep/80">
                根据作答节奏与内容趋势，输出更贴合的提示与行动建议。
              </p>
            </div>
            <div className="rounded-2xl border border-xia-haze/80 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-xia-deep/40">
                报告格式
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm font-medium text-xia-deep/70 sm:mt-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-xia-deep/5">
                  <BarChart2 className="h-5 w-5 text-xia-deep/70" />
                </span>
                多维图表 + 可执行建议
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-xia-haze/50">
                <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-xia-sky to-xia-deep animate-fill-bar" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {tests.map((test) => (
          <TestCard key={test.to} {...test} />
        ))}
      </section>
    </div>
  )
}
