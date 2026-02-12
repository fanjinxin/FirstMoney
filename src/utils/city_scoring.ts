import { cityQuestions, CITY_DIMENSIONS, type CityDimensionId } from '../data/city'
import { CHINESE_CITIES, type CityProfile } from '../data/cities_db'

export type CityLevel = 'low' | 'moderate' | 'high'

export interface CityDimensionScore {
  id: CityDimensionId
  name: string
  rawScore: number
  maxScore: number
  percent: number
  level: CityLevel
}

export interface CityMatchResult {
  city: CityProfile
  matchScore: number
  maxMatchScore: number
  matchPercent: number
  dimensionMatch: Record<string, number>
  matchReason: string
}

export type CityProfileKey =
  | 'metropolis'      // 一线/新一线都市型
  | 'coastal_slow'    // 海滨/文旅慢城型
  | 'cost_effective'  // 性价比宜居型
  | 'cultural'        // 文化氛围型
  | 'vitality'        // 活力机会型
  | 'balanced'        // 均衡型

export interface CityResult {
  dimensionScores: CityDimensionScore[]
  profileKey: CityProfileKey
  suggestedType: string
  topCities: CityMatchResult[]
  methodology: string
}

function getLevel(percent: number): CityLevel {
  if (percent <= 45) return 'low'
  if (percent >= 70) return 'high'
  return 'moderate'
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
  return {
    id: dimId,
    name: dim.name,
    rawScore: raw,
    maxScore,
    percent: Math.min(100, percent),
    level: getLevel(Math.min(100, percent)),
  }
}

/**
 * 计算用户与城市的匹配度
 * 方法：各维度取 (100 - |用户得分 - 城市得分|)，求和后归一化
 * 维度对应：climate/pace/culture 直接匹配；cost 用户高=在意成本，匹配城市 cost 高=可负担；social 直接匹配
 */
function calculateMatchScore(
  userScores: Record<CityDimensionId, number>,
  city: CityProfile
): { total: number; dimensionMatch: Record<string, number> } {
  const dimKeys: CityDimensionId[] = ['climate', 'pace', 'culture', 'cost', 'social']
  const cityScores = {
    climate: city.climate,
    pace: city.pace,
    culture: city.culture,
    cost: city.cost,
    social: city.social,
  }

  let total = 0
  const dimensionMatch: Record<string, number> = {}

  for (const key of dimKeys) {
    const diff = Math.abs(userScores[key] - cityScores[key as keyof typeof cityScores])
    const match = Math.max(0, 100 - diff)
    dimensionMatch[key] = match
    total += match
  }

  return { total, dimensionMatch }
}

/**
 * 优先从用户得分判定类型；若为均衡型，再校验推荐城市是否也为均衡型。
 * 若推荐城市（如敦煌、鄂尔多斯）与均衡型典型城市（苏州、嘉兴）差异大，则按推荐城市反推更贴切的类型。
 */
function getProfileKey(
  climate: number,
  pace: number,
  culture: number,
  cost: number
): CityProfileKey {
  if (pace > 65 && culture > 60) return 'metropolis'
  if (pace < 45 && climate > 55) return 'coastal_slow'
  if (cost > 65) return 'cost_effective'
  if (culture > 65) return 'cultural'
  if (pace > 60) return 'vitality'
  // 均衡型：各维度均在 40-65 区间
  const isModerate = (v: number) => v >= 40 && v <= 65
  if (isModerate(climate) && isModerate(pace) && isModerate(culture) && isModerate(cost)) {
    return 'balanced'
  }
  // 非均衡型：按最突出维度近似归类
  if (culture >= 60) return 'cultural'
  if (cost >= 58) return 'cost_effective'
  if (pace >= 55) return 'vitality'
  if (pace < 50 && climate >= 50) return 'coastal_slow'
  return 'balanced'
}

/** 判断城市是否为「均衡型」典型城市（五维均在 45-75 区间） */
function isBalancedCity(city: CityProfile): boolean {
  const inRange = (v: number) => v >= 45 && v <= 75
  return inRange(city.climate) && inRange(city.pace) && inRange(city.culture) && inRange(city.cost) && inRange(city.social)
}

function getSuggestedType(profileKey: CityProfileKey): string {
  const map: Record<CityProfileKey, string> = {
    metropolis: '一线/新一线都市型',
    coastal_slow: '海滨/文旅慢城型',
    cost_effective: '性价比宜居型',
    cultural: '文化氛围型',
    vitality: '活力机会型',
    balanced: '均衡型城市',
  }
  return map[profileKey]
}

function generateMatchReason(city: CityProfile, dimensionMatch: Record<string, number>): string {
  const parts: string[] = []
  const entries = Object.entries(dimensionMatch).sort((a, b) => b[1] - a[1])
  const top2 = entries.slice(0, 2)
  const dimNames: Record<string, string> = {
    climate: '气候',
    pace: '节奏',
    culture: '文化',
    cost: '成本',
    social: '社交',
  }
  for (const [dim, score] of top2) {
    if (score >= 80) parts.push(`${dimNames[dim] ?? dim}匹配度高`)
  }
  return parts.length > 0 ? parts.join('，') : '综合匹配度较高'
}

export function calculateCityResult(answers: Record<string, number>): CityResult {
  const dimensionScores = CITY_DIMENSIONS.map(d => getDimensionScore(d.id, answers))

  const climate = dimensionScores.find(d => d.id === 'climate')?.percent ?? 50
  const pace = dimensionScores.find(d => d.id === 'pace')?.percent ?? 50
  const culture = dimensionScores.find(d => d.id === 'culture')?.percent ?? 50
  const cost = dimensionScores.find(d => d.id === 'cost')?.percent ?? 50
  const social = dimensionScores.find(d => d.id === 'social')?.percent ?? 50

  const profileKey = getProfileKey(climate, pace, culture, cost)
  const suggestedType = getSuggestedType(profileKey)

  const userScores: Record<CityDimensionId, number> = {
    climate,
    pace,
    culture,
    cost,
    social,
  }

  const maxPossible = 500 // 5 * 100
  const results: CityMatchResult[] = CHINESE_CITIES.map(city => {
    const { total, dimensionMatch } = calculateMatchScore(userScores, city)
    const matchPercent = Math.round((total / maxPossible) * 100)
    return {
      city,
      matchScore: total,
      maxMatchScore: maxPossible,
      matchPercent,
      dimensionMatch,
      matchReason: generateMatchReason(city, dimensionMatch),
    }
  })

  const sorted = results.sort((a, b) => b.matchScore - a.matchScore)
  const topCities = sorted.slice(0, 2)

  // 若初判为均衡型，但推荐城市并非均衡型（如敦煌、鄂尔多斯），则按推荐城市反推类型，避免脱节
  let finalProfileKey = profileKey
  if (profileKey === 'balanced' && topCities.length >= 1) {
    const top1 = topCities[0].city
    const top2 = topCities[1]?.city
    const bothBalanced = isBalancedCity(top1) && (!top2 || isBalancedCity(top2))
    if (!bothBalanced) {
      // 按推荐城市特征反推：高文化低节奏→文化型，高成本可负担→性价比型，高节奏→活力型等
      const avgCulture = top2 ? (top1.culture + top2.culture) / 2 : top1.culture
      const avgPace = top2 ? (top1.pace + top2.pace) / 2 : top1.pace
      const avgCost = top2 ? (top1.cost + top2.cost) / 2 : top1.cost
      const avgClimate = top2 ? (top1.climate + top2.climate) / 2 : top1.climate
      if (avgCulture >= 78 && avgPace <= 52) finalProfileKey = 'cultural'
      else if (avgCost >= 65) finalProfileKey = 'cost_effective'
      else if (avgPace >= 65) finalProfileKey = 'vitality'
      else if (avgPace <= 48 && avgClimate >= 55) finalProfileKey = 'coastal_slow'
      else if (avgPace >= 62 && avgCulture >= 60) finalProfileKey = 'metropolis'
    }
  }

  const finalSuggestedType = getSuggestedType(finalProfileKey)

  const methodology = `本测试从气候、生活节奏、文化氛围、成本考量、社交需求五个维度评估你的城市偏好。匹配算法：将你的各维度得分与全国 ${CHINESE_CITIES.length} 座城市的五维画像逐一比对，计算匹配度（100 - |你的得分 - 城市得分|），综合后排序，推荐匹配度最高的两座城市。城市类型根据推荐城市的特征反推，确保与推荐结果一致。`

  return {
    dimensionScores,
    profileKey: finalProfileKey,
    suggestedType: finalSuggestedType,
    topCities,
    methodology,
  }
}
