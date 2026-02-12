import { cityQuestions, CITY_DIMENSIONS, type CityDimensionId } from '../data/city'

export interface CityDimensionScore {
  id: CityDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
}

export interface CityResult {
  dimensionScores: CityDimensionScore[]
  suggestedType: string
}

function getDimensionScore(dimId: CityDimensionId, answers: Record<string, number>): CityDimensionScore {
  const dim = CITY_DIMENSIONS.find(d => d.id === dimId)
  if (!dim) throw new Error(`Unknown dimension: ${dimId}`)

  let raw = 0
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)]
    if (ans === undefined || ans < 1 || ans > 5) continue
    const qData = cityQuestions.find(x => x.id === q)
    raw += qData?.reverse ? 6 - ans : ans
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0
  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: Math.min(100, percent) }
}

export function calculateCityResult(answers: Record<string, number>): CityResult {
  const dimensionScores = CITY_DIMENSIONS.map(d => getDimensionScore(d.id, answers))

  const climate = dimensionScores.find(d => d.id === 'climate')?.percent ?? 50
  const pace = dimensionScores.find(d => d.id === 'pace')?.percent ?? 50
  const culture = dimensionScores.find(d => d.id === 'culture')?.percent ?? 50
  const cost = dimensionScores.find(d => d.id === 'cost')?.percent ?? 50

  let suggestedType = '均衡型城市'
  if (pace > 65 && culture > 60) suggestedType = '一线/新一线都市型'
  else if (pace < 45 && climate > 55) suggestedType = '海滨/文旅慢城型'
  else if (cost > 65) suggestedType = '性价比宜居型'
  else if (culture > 65) suggestedType = '文化氛围型'
  else if (pace > 60) suggestedType = '活力机会型'

  return { dimensionScores, suggestedType }
}
