/**
 * RVT 恋爱观测试计分 - 移植自 src/utils/rvt_scoring.ts
 */
const { rvtQuestions, RVT_DIMENSIONS } = require('../data/rvt');

function getLevel(percent) {
  if (percent <= 45) return 'low';
  if (percent >= 70) return 'high';
  return 'moderate';
}

function getDimensionScore(dimId, answers) {
  const dim = RVT_DIMENSIONS.find(d => d.id === dimId);
  if (!dim) return null;

  let raw = 0;
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)];
    if (ans === undefined || ans < 1 || ans > 5) continue;
    const qData = rvtQuestions.find(x => x.id === q);
    raw += qData && qData.reverse ? 6 - ans : ans;
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5;
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;
  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: Math.min(100, percent), level: getLevel(Math.min(100, percent)) };
}

function calculateRVTResult(answers) {
  const dimensionScores = RVT_DIMENSIONS.map(d => getDimensionScore(d.id, answers)).filter(Boolean);
  const sorted = [...dimensionScores].sort((a, b) => b.rawScore - a.rawScore);
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0);
  const maxTotalScore = rvtQuestions.length * 5;
  const avgPercent = dimensionScores.length ? Math.round(dimensionScores.reduce((s, d) => s + d.percent, 0) / dimensionScores.length) : 0;
  return {
    dimensionScores,
    primaryType: sorted[0],
    secondaryType: sorted[1] || null,
    totalScore,
    maxTotalScore,
    avgPercent,
  };
}

module.exports = { calculateRVTResult };
