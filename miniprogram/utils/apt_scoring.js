/**
 * APT 天赋潜能评估计分 - 移植自 src/utils/apt_scoring.ts
 * 每题 1-5 分，反向题：5→1, 4→2, 3→3, 2→4, 1→5
 */
const { aptQuestions, APT_DIMENSIONS } = require('../data/apt');

function getDimensionScore(dimId, answers) {
  const dim = APT_DIMENSIONS.find(d => d.id === dimId);
  if (!dim) return null;

  let raw = 0;
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)];
    if (ans === undefined || ans < 1 || ans > 5) continue;
    const qData = aptQuestions.find(x => x.id === q);
    const score = qData && qData.reverse ? 6 - ans : ans;
    raw += score;
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5;
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;
  const p = Math.min(100, percent);

  let level = 'fair';
  let levelLabel = '中等';
  if (p >= 75) { level = 'excellent'; levelLabel = '优秀'; }
  else if (p >= 60) { level = 'good'; levelLabel = '较好'; }
  else if (p >= 45) { level = 'fair'; levelLabel = '中等'; }
  else { level = 'low'; levelLabel = '偏低'; }

  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: p, level, levelLabel };
}

const APT_GROUPS = [
  { id: 'cognitive', name: '认知型', dimIds: ['logic', 'language', 'spatial'] },
  { id: 'creative', name: '创意型', dimIds: ['creativity'] },
  { id: 'social', name: '人际型', dimIds: ['social'] },
  { id: 'psychological', name: '心理型', dimIds: ['resilience'] },
];

function calculateAPTResult(answers) {
  const dimensionScores = APT_DIMENSIONS.map(d => getDimensionScore(d.id, answers)).filter(Boolean);
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0);
  const maxTotalScore = aptQuestions.length * 5;
  const totalPercent = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

  let totalLevel = 'fair';
  if (totalPercent >= 75) totalLevel = 'excellent';
  else if (totalPercent >= 60) totalLevel = 'good';
  else if (totalPercent >= 45) totalLevel = 'fair';
  else totalLevel = 'low';

  const sorted = [...dimensionScores].sort((a, b) => b.percent - a.percent);
  const topDimensions = sorted.slice(0, 3);
  const weakDimensions = sorted.slice(-3).reverse();

  const groupScores = APT_GROUPS.map(g => {
    const dims = dimensionScores.filter(d => g.dimIds.includes(d.id));
    const avg = dims.length ? Math.round(dims.reduce((s, x) => s + x.percent, 0) / dims.length) : 0;
    return { id: g.id, name: g.name, avg, dimensions: dims };
  });

  return {
    dimensionScores,
    totalScore,
    maxTotalScore,
    totalPercent,
    totalLevel,
    topDimensions,
    weakDimensions,
    groupScores,
  };
}

module.exports = { calculateAPTResult };
