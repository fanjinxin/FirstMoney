
import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'
import { calculateAnimalResult } from '../../utils/animal_scoring'
import { loadAnswers, clearAnswers } from '../../utils/storage'

const ANIMAL_TEST_ID = 'animal-sculpture'

export default function AnimalResult() {
  const navigate = useNavigate()
  const reportRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  
  const answers = useMemo(() => loadAnswers(ANIMAL_TEST_ID) ?? {}, [])
  const result = useMemo(() => calculateAnimalResult(answers), [answers])
  const { mainAnimal, secondaryAnimal, radarData, scores, compoundDimensions } = result

  // Cast key to string to avoid complex type issues with direct indexing or mapping
  const getCompoundLabel = (key: string, value: number) => {
    if (key === 'socialEnergy') {
      if (value < 4) return '独处充电'
      if (value > 7) return '社交充电'
      return '平衡型'
    }
    if (key === 'resilience') {
      if (value < 4) return '敏感细腻'
      if (value > 7) return '坚韧抗压'
      return '适应型'
    }
    if (key === 'drive') {
      if (value < 4) return '佛系随缘'
      if (value > 7) return '目标导向'
      return '稳健型'
    }
    if (key === 'adaptability') {
      if (value < 4) return '坚持自我'
      if (value > 7) return '灵活变通'
      return '折中型'
    }
    return ''
  }

  const compoundConfigs = [
    { key: 'socialEnergy', label: '社交能量', color: 'bg-xia-aqua' },
    { key: 'resilience', label: '抗压指数', color: 'bg-xia-teal' },
    { key: 'drive', label: '进取心', color: 'bg-xia-deep' },
    { key: 'adaptability', label: '适应力', color: 'bg-xia-mint' },
  ] as const

  const handleExport = async () => {
    if (!reportRef.current) return
    try {
      setExporting(true)
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FDFBF7', // xia-cream-light
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgProps = pdf.getImageProperties(imgData)
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width
      
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
      heightLeft -= pdfHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
        heightLeft -= pdfHeight
      }
      
      pdf.save('我的动物塑报告.pdf')
    } catch (error) {
      console.error('Export failed', error)
    } finally {
      setExporting(false)
    }
  }

  const handleRetake = () => {
    if (window.confirm('确定要重新测试吗？')) {
      clearAnswers(ANIMAL_TEST_ID)
      navigate('/animal')
    }
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen pb-10">
      {/* Actions */}
      <div className="mb-6 flex items-center justify-between px-2 sm:px-0">
        <Link 
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-xia-deep/60 transition hover:text-xia-deep"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 rounded-lg border border-xia-haze bg-white px-4 py-2 text-sm font-medium text-xia-deep/80 shadow-sm transition hover:border-xia-teal/50 hover:text-xia-deep"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            再测一次
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-lg bg-xia-deep px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-xia-deep/90 disabled:opacity-50"
          >
            {exporting ? '生成中...' : '导出报告'}
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div 
        ref={reportRef} 
        className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-xia-haze/30"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-xia-sky/20 via-xia-cream/30 to-white px-6 py-10 sm:px-12 sm:py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg sm:h-32 sm:w-32">
            <span className="text-6xl sm:text-8xl">{mainAnimal.emoji}</span>
          </div>
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-xia-deep/50">
            您的精神动物是
          </div>
          <h1 className="mt-2 text-3xl font-bold text-xia-deep sm:text-5xl">
            {mainAnimal.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-xia-deep/80 sm:text-lg">
            {mainAnimal.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {mainAnimal.traits.map(trait => (
              <span key={trait} className="rounded-full bg-xia-deep/5 px-4 py-1.5 text-sm font-medium text-xia-deep">
                #{trait}
              </span>
            ))}
          </div>

          {mainAnimal.weaknesses && (
            <div className="mt-6">
              <div className="text-xs font-semibold text-xia-deep/40 uppercase tracking-wider mb-2">潜在弱点</div>
              <div className="flex flex-wrap justify-center gap-2">
                {mainAnimal.weaknesses.map(weakness => (
                  <span key={weakness} className="px-3 py-1 bg-red-50 text-red-400 rounded-full text-sm font-medium border border-red-100">
                    {weakness}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-8 sm:px-12">
          {/* Radar Chart Section */}
          <div className="mb-12 grid gap-8 md:grid-cols-2 items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#4B5563', fontSize: 12 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar
                    name="我的维度"
                    dataKey="A"
                    stroke="#2C6F7A"
                    strokeWidth={2}
                    fill="#2C6F7A"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-xia-deep">维度解析</h3>
              <div className="space-y-4">
                {radarData.map((d) => (
                  <div key={d.subject}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-xia-deep/80">{d.subject}</span>
                      <span className="font-bold text-xia-deep">{d.A} / 10</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-xia-haze/20">
                      <div 
                        className="h-full rounded-full bg-xia-teal"
                        style={{ width: `${(d.A / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="my-10 h-px bg-xia-haze/30" />

          {/* Compound Dimensions */}
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-bold text-xia-deep">综合特质分析</h2>
            <div className="rounded-2xl border border-xia-haze/30 bg-white p-6 shadow-sm">
              <div className="grid gap-y-8 gap-x-12 sm:grid-cols-2">
                {compoundConfigs.map(({ key, label, color }) => {
                  const value = compoundDimensions[key]
                  const status = getCompoundLabel(key, value)
                  
                  return (
                    <div key={key} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${color}`}></span>
                          <span className="text-sm font-medium text-xia-deep/70">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-xia-deep/50 px-2 py-0.5 rounded-full bg-gray-100">{status}</span>
                          <span className="text-lg font-bold text-xia-deep">{value.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div 
                          className={`h-full rounded-full ${color}`} 
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <div className="my-10 h-px bg-xia-haze/30" />

          {/* Secondary Animal */}
          <section className="mb-10">
            <h2 className="mb-6 text-xl font-bold text-xia-deep">潜在特质：第二动物形态</h2>
            <div className="flex items-start gap-6 rounded-2xl border border-xia-haze/50 bg-xia-cream/10 p-6 sm:p-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm sm:h-20 sm:w-20">
                <span className="text-4xl sm:text-5xl">{secondaryAnimal.emoji}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-xia-deep">{secondaryAnimal.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {secondaryAnimal.traits.map(t => (
                    <span key={t} className="text-xs text-xia-deep/60">#{t}</span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-xia-deep/80">
                  除了{mainAnimal.name}的主导特质外，你还表现出{secondaryAnimal.name}的一面。
                  {secondaryAnimal.description}
                </p>
              </div>
            </div>
          </section>

          {/* Detailed Text Analysis */}
          <section>
            <h2 className="mb-6 text-xl font-bold text-xia-deep">深度性格分析</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-xia-sky/10 p-6">
                <h4 className="mb-3 font-semibold text-xia-deep">能量来源 (E)</h4>
                <p className="text-sm leading-relaxed text-xia-deep/80">
                  {scores.E > 6 
                    ? '你是一个能量充沛的人，喜欢与人交往，在群体中能获得更多能量。' 
                    : scores.E < 4 
                    ? '你更享受独处的时光，内心世界丰富，在安静中能获得更多力量。' 
                    : '你在社交和独处之间保持着良好的平衡，既能融入群体，也能享受孤独。'}
                </p>
              </div>
              <div className="rounded-xl bg-xia-cream/30 p-6">
                <h4 className="mb-3 font-semibold text-xia-deep">思维模式 (O)</h4>
                <p className="text-sm leading-relaxed text-xia-deep/80">
                  {scores.O > 6 
                    ? '你充满想象力和创造力，喜欢探索新事物，思维跳跃且富有远见。' 
                    : scores.O < 4 
                    ? '你注重实际和传统，脚踏实地，更相信经验和被验证过的方法。' 
                    : '你既有务实的一面，也不乏创新的火花，能够将理想与现实结合。'}
                </p>
              </div>
              <div className="rounded-xl bg-xia-aqua/10 p-6">
                <h4 className="mb-3 font-semibold text-xia-deep">决策风格 (A/C)</h4>
                <p className="text-sm leading-relaxed text-xia-deep/80">
                  {scores.A > scores.C 
                    ? '在做决定时，你更看重他人的感受和人际关系的和谐，富有人情味。' 
                    : scores.C > scores.A 
                    ? '你更看重逻辑、规则和效率，能够客观冷静地做出理性的判断。' 
                    : '你能够很好地平衡理性和感性，既讲原则，又通情达理。'}
                </p>
              </div>
              <div className="rounded-xl bg-xia-haze/20 p-6">
                <h4 className="mb-3 font-semibold text-xia-deep">抗压能力 (N)</h4>
                <p className="text-sm leading-relaxed text-xia-deep/80">
                  {scores.N > 6 
                    ? '你的感知力很强，容易察觉环境的变化，虽然有时会焦虑，但也更细腻。' 
                    : scores.N < 4 
                    ? '你的情绪非常稳定，泰山崩于前而色不变，能够从容应对各种压力。' 
                    : '你拥有正常的情绪波动，在大多数情况下能够自我调节，保持平稳。'}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-xia-haze bg-xia-cream/20 px-6 py-6 sm:px-12 text-center text-xs text-xia-deep/50">
          <p>报告生成时间：{formatDate()} · 动物塑性格测试</p>
          <p className="mt-2">本测试基于FFM五因素模型与动物心理学趣味映射，结果仅供娱乐与参考。</p>
        </div>
      </div>
    </div>
  )
}
