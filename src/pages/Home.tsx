import TestCard from '../components/TestCard'
import { rpiTest } from '../data/rpi'
import { scl90Test } from '../data/scl90'
import { sriTest } from '../data/sri'

export default function Home() {
  // 首页测评卡片：统一结构（title / subtitle / description / to / iconUrl / iconAlt / iconBg / duration / questionCount / backgroundClass），新测评按此格式添加即可
  const tests = [
    {
      title: 'SCL-90 心理健康自评量表',
      subtitle: '综合心理评估',
      description:
        '评估最近一周的身心症状与心理困扰程度，涵盖躯体化、焦虑、抑郁、强迫、人际敏感、敌对、恐怖、偏执等 10 个因子，帮助了解情绪与压力状态，适合自我筛查与觉察。',
      to: '/scl90',
      resultTo: '/scl90/result',
      testId: 'scl90' as const,
      iconUrl: 'https://twemoji.maxcdn.com/v/latest/72x72/1f9e0.png',
      iconAlt: '大脑图标',
      iconBg: 'bg-xia-sky/20',
      duration: '约15-20分钟',
      questionCount: scl90Test.questions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-sky/10 via-white to-xia-haze/20',
    },
    {
      title: 'RPI 恋爱占有欲指数测试',
      subtitle: '双视角关系评估',
      description:
        '评估亲密关系中的占有欲与安全感，支持自我视角与伴侣视角，帮助理解边界与依赖程度，适合情侣或对关系质量有好奇的个体。',
      to: '/rpi',
      resultTo: '/rpi/result',
      testId: 'rpi' as const,
      iconUrl: 'https://twemoji.maxcdn.com/v/latest/72x72/2764-fe0f.png',
      iconAlt: '爱心图标',
      iconBg: 'bg-xia-mint/20',
      duration: '约10-15分钟',
      questionCount: rpiTest.questions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-mint/10 via-white to-xia-cream/30',
    },
    {
      title: 'SRI 性压抑指数测试',
      subtitle: '亲密表达评估',
      description:
        '评估在性与亲密表达上的压抑程度与自我接纳水平，关注态度、表达与舒适度，适用于想了解自身亲密表达与自我理解的成年人。',
      to: '/sri',
      resultTo: '/sri/result',
      testId: 'sri' as const,
      iconUrl: 'https://twemoji.maxcdn.com/v/latest/72x72/1f511.png',
      iconAlt: '钥匙图标',
      iconBg: 'bg-xia-cream',
      duration: '约15-25分钟',
      questionCount: sriTest.questions.length,
      backgroundClass: 'bg-gradient-to-br from-xia-cream/30 via-white to-xia-haze/20',
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
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-xia-deep/5 text-base">
                  📊
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
