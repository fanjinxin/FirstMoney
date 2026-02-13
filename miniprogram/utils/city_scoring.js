/**
 * 宜居城市计分 - 移植自 src/utils/city_scoring.ts
 */
const { cityQuestions, CITY_DIMENSIONS } = require('../data/city');
const { CHINESE_CITIES } = require('../data/cities_db');

function getLevel(percent) {
  if (percent <= 45) return 'low';
  if (percent >= 70) return 'high';
  return 'moderate';
}

function getDimensionScore(dimId, answers) {
  const dim = CITY_DIMENSIONS.find(d => d.id === dimId);
  if (!dim) return null;

  let raw = 0;
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)];
    if (ans === undefined || ans < 1 || ans > 5) continue;
    const qData = cityQuestions.find(x => x.id === q);
    raw += qData && qData.reverse ? 6 - ans : ans;
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5;
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;
  const cappedPercent = Math.min(100, percent);
  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: cappedPercent, level: getLevel(cappedPercent) };
}

function calculateMatchScore(userScores, city) {
  const dimKeys = ['climate', 'pace', 'culture', 'cost', 'social'];
  const cityScores = { climate: city.climate, pace: city.pace, culture: city.culture, cost: city.cost, social: city.social };
  let total = 0;
  const dimensionMatch = {};
  for (const key of dimKeys) {
    const diff = Math.abs(userScores[key] - cityScores[key]);
    const match = Math.max(0, 100 - diff);
    dimensionMatch[key] = match;
    total += match;
  }
  return { total, dimensionMatch };
}

function generateMatchReason(city, dimensionMatch) {
  const dimNames = { climate: '气候', pace: '节奏', culture: '文化', cost: '成本', social: '社交' };
  const entries = Object.entries(dimensionMatch).sort((a, b) => b[1] - a[1]);
  const top2 = entries.slice(0, 2);
  const parts = [];
  for (const [dim, score] of top2) {
    if (score >= 80) parts.push(`${dimNames[dim] || dim}匹配度高`);
  }
  return parts.length > 0 ? parts.join('，') : '综合匹配度较高';
}

function getProfileKey(climate, pace, culture, cost) {
  if (pace > 65 && culture > 60) return 'metropolis';
  if (pace < 45 && climate > 55) return 'coastal_slow';
  if (cost > 65) return 'cost_effective';
  if (culture > 65) return 'cultural';
  if (pace > 60) return 'vitality';
  const isModerate = (v) => v >= 40 && v <= 65;
  if (isModerate(climate) && isModerate(pace) && isModerate(culture) && isModerate(cost)) return 'balanced';
  if (culture >= 60) return 'cultural';
  if (cost >= 58) return 'cost_effective';
  if (pace >= 55) return 'vitality';
  if (pace < 50 && climate >= 50) return 'coastal_slow';
  return 'balanced';
}

function isBalancedCity(city) {
  const inRange = (v) => v >= 45 && v <= 75;
  return inRange(city.climate) && inRange(city.pace) && inRange(city.culture) && inRange(city.cost) && inRange(city.social);
}

function getSuggestedType(profileKey) {
  const map = { metropolis: '一线/新一线都市型', coastal_slow: '海滨/文旅慢城型', cost_effective: '性价比宜居型', cultural: '文化氛围型', vitality: '活力机会型', balanced: '均衡型城市' };
  return map[profileKey] || '均衡型城市';
}

function calculateCityResult(answers) {
  const dimensionScores = CITY_DIMENSIONS.map(d => getDimensionScore(d.id, answers)).filter(Boolean);
  const climate = dimensionScores.find(d => d.id === 'climate')?.percent ?? 50;
  const pace = dimensionScores.find(d => d.id === 'pace')?.percent ?? 50;
  const culture = dimensionScores.find(d => d.id === 'culture')?.percent ?? 50;
  const cost = dimensionScores.find(d => d.id === 'cost')?.percent ?? 50;
  const social = dimensionScores.find(d => d.id === 'social')?.percent ?? 50;

  const profileKey = getProfileKey(climate, pace, culture, cost);
  const suggestedType = getSuggestedType(profileKey);

  const userScores = { climate, pace, culture, cost, social };
  const maxPossible = 500;

  const results = CHINESE_CITIES.map(city => {
    const { total, dimensionMatch } = calculateMatchScore(userScores, city);
    const matchPercent = Math.round((total / maxPossible) * 100);
    return {
      city,
      matchScore: total,
      maxMatchScore: maxPossible,
      matchPercent,
      dimensionMatch,
      matchReason: generateMatchReason(city, dimensionMatch),
    };
  });

  const sorted = results.sort((a, b) => b.matchScore - a.matchScore);
  const topCities = sorted.slice(0, 2);

  let finalProfileKey = profileKey;
  if (profileKey === 'balanced' && topCities.length >= 1) {
    const top1 = topCities[0].city;
    const top2 = topCities[1]?.city;
    const bothBalanced = isBalancedCity(top1) && (!top2 || isBalancedCity(top2));
    if (!bothBalanced) {
      const avgCulture = top2 ? (top1.culture + top2.culture) / 2 : top1.culture;
      const avgPace = top2 ? (top1.pace + top2.pace) / 2 : top1.pace;
      const avgCost = top2 ? (top1.cost + top2.cost) / 2 : top1.cost;
      const avgClimate = top2 ? (top1.climate + top2.climate) / 2 : top1.climate;
      if (avgCulture >= 78 && avgPace <= 52) finalProfileKey = 'cultural';
      else if (avgCost >= 65) finalProfileKey = 'cost_effective';
      else if (avgPace >= 65) finalProfileKey = 'vitality';
      else if (avgPace <= 48 && avgClimate >= 55) finalProfileKey = 'coastal_slow';
      else if (avgPace >= 62 && avgCulture >= 60) finalProfileKey = 'metropolis';
    }
  }

  const finalSuggestedType = getSuggestedType(finalProfileKey);

  return {
    dimensionScores,
    profileKey: finalProfileKey,
    suggestedType: finalSuggestedType,
    topCities,
  };
}

module.exports = { calculateCityResult };
