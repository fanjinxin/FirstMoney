import { Link } from 'react-router-dom'
import FactorBarChart from '../../components/FactorBarChart'
import FactorRadarChart from '../../components/FactorRadarChart'
import SectionHeader from '../../components/SectionHeader'
import StatCard from '../../components/StatCard'
import SymptomPieChart from '../../components/SymptomPieChart'
import { scl90Test } from '../../data/scl90'
import { calculateScl90Scores } from '../../utils/scoring'
import { loadAnswers } from '../../utils/storage'

export default function SCL90Result() {
  const answers = loadAnswers(scl90Test.id)
  if (!answers) {
    return (
      <div className="space-y-4">
        <SectionHeader title="尚未完成测评" />
        <Link className="text-sm text-slate-900 underline" to="/scl90">
          返回 SCL-90 测试
        </Link>
      </div>
    )
  }

  const summary = calculateScl90Scores(scl90Test.questions, scl90Test.dimensions, answers)
  const factors = summary.factors
  const top3Factors = summary.top3Factors
  const radarData = factors.map((item) => ({
    name: item.name,
    score: Number(item.score.toFixed(2)),
    line2: 2,
    line3: 3,
  }))
  const barChartData = [...factors]
    .sort((a, b) => b.score - a.score)
    .map((item) => ({
      id: item.id,
      name: item.name,
      score: item.score,
      hint: item.description,
      level: item.level,
    }))
  const severityRanks: Record<string, number> = {
    normal: 0,
    mild: 1,
    moderate: 2,
    severe: 3,
  }
  const maxSeverity = Math.max(...factors.map((item) => severityRanks[item.level]))
  const suggestionLevel =
    maxSeverity >= 3 || summary.basic.totalLevel === '重度困扰'
      ? '专业医学评估'
      : maxSeverity >= 2 || summary.basic.totalLevel === '中度困扰'
        ? '心理咨询'
        : '自我调节'

  return (
    <div className="space-y-10 animate-fade-in">
      <SectionHeader title={`${scl90Test.title} 结果分析`} description={scl90Test.subtitle} />

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">测评基本信息</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                量表名称
              </dt>
              <dd className="mt-1 text-slate-900">90项症状自评量表（SCL-90）</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                测评时间
              </dt>
              <dd className="mt-1 text-slate-900">—</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                测评对象
              </dt>
              <dd className="mt-1 text-slate-900">—</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                评估时段
              </dt>
              <dd className="mt-1 text-slate-900">最近一周内的身心感受</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                计分方式
              </dt>
              <dd className="mt-1 text-slate-900">1=从无 2=轻度 3=中度 4=偏重 5=严重</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">核心统计指标</div>
        <div className="grid gap-6 md:grid-cols-5">
          <StatCard
            label="总分"
            value={`${summary.basic.totalScore}`}
            hint={`总体等级：${summary.basic.totalLevel}`}
          />
          <StatCard
            label="总均分"
            value={summary.basic.avgTotal.toFixed(2)}
            hint="总分 / 90"
          />
          <StatCard
            label="阳性项目数"
            value={`${summary.basic.positiveCount}`}
            hint="分值 ≥2 的题目数量"
          />
          <StatCard
            label="阴性项目数"
            value={`${summary.basic.negativeCount}`}
            hint="分值 =1 的题目数量"
          />
          <StatCard
            label="阳性症状均分"
            value={summary.basic.positiveAvg.toFixed(2)}
            hint="(总分 - 阴性项目数) / 阳性项目数"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">10个因子得分与严重程度</div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">维度</th>
                <th className="px-4 py-3 font-semibold">因子分</th>
                <th className="px-4 py-3 font-semibold">严重程度</th>
                <th className="px-4 py-3 font-semibold">说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {factors.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                  <td className="px-4 py-3">{item.score.toFixed(2)}</td>
                  <td className="px-4 py-3">{item.levelLabel}</td>
                  <td className="px-4 py-3">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">严重程度判断标准</div>
          <ul className="mt-3 space-y-2">
            <li>＜2 分：正常</li>
            <li>2～3 分：轻度困扰</li>
            <li>3～4 分：中度困扰</li>
            <li>≥4 分：重度困扰</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">图表展示说明</div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">10因子雷达图</div>
            <p className="mt-2">用途：整体症状轮廓</p>
            <p>展示：10个维度得分曲线 + 2分参考线</p>
            <p>结论：突出高风险维度</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">10因子柱状排序图</div>
            <p className="mt-2">用途：找出最严重的3个问题</p>
            <p>展示：从高到低排序</p>
            <p>结论：明确主要困扰来源</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">症状分布饼图</div>
            <p className="mt-2">分类：正常、轻度、中度、偏重、严重</p>
            <p>用途：看痛苦分布比例</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <FactorRadarChart data={radarData} />
          <SymptomPieChart data={summary.symptomDist} />
        </div>
        <FactorBarChart data={barChartData} />
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">整体心理健康水平评价</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <p>
            本次测评总分：{summary.basic.totalScore} 分，阳性项目数：
            {summary.basic.positiveCount} 项。
          </p>
          <ul className="mt-3 space-y-2">
            <li>总分＜160：整体状态基本平稳</li>
            <li>160～250：轻度心理困扰</li>
            <li>250～350：中度心理困扰</li>
            <li>≥350：重度心理困扰</li>
          </ul>
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            近期整体心理健康状态为：{summary.basic.totalLevel}，存在
            {top3Factors.map((item) => item.name).join('、')}方面的不适较为突出。
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">主要困扰维度（TOP 3）</div>
        <div className="grid gap-4 lg:grid-cols-3">
          {top3Factors.map((item, index) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                TOP {index + 1}
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{item.name}</div>
              <div className="mt-1 text-sm text-slate-500">
                {item.score.toFixed(2)} 分 · {item.levelLabel}困扰
              </div>
              <div className="mt-3 text-sm text-slate-600">主要表现：{item.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">详细症状解读</div>
        <div className="grid gap-4 lg:grid-cols-2">
          {factors.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-slate-900">{item.name}</div>
                <div className="text-sm text-slate-500">
                  {item.score.toFixed(2)} · {item.levelLabel}
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-600">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">专业建议</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">建议等级</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['自我调节', '心理咨询', '专业医学评估'].map((item) => (
              <span
                key={item}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  suggestionLevel === item
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div>生活方式：规律作息、适度运动、减少熬夜与过度信息输入。</div>
            <div>情绪调节：倾诉、放松训练、正念、呼吸练习。</div>
            <div>社交支持：增加人际连接，减少孤独感。</div>
            <div>
              专业帮助：若中度以上困扰建议心理咨询，若重度或影响生活建议到心理科/精神科评估。
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="text-sm font-semibold text-slate-900">重要声明</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          <ul className="space-y-2">
            <li>本报告仅为心理健康筛查，不构成任何疾病诊断。</li>
            <li>不能替代医生、心理咨询师的专业评估。</li>
            <li>如出现自杀、自伤、冲动失控等想法，请立即求助。</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
