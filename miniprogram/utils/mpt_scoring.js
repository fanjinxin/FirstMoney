/**
 * MPT 麋鹿性偏好计分 - 移植自 src/utils/mpt_scoring.ts
 */
const { mptQuestions, MPT_DIMENSIONS } = require('../data/mpt');

function getLevel(percent) {
  if (percent <= 45) return 'low';
  if (percent >= 70) return 'high';
  return 'moderate';
}

function getDimensionScore(dimId, answers) {
  const dim = MPT_DIMENSIONS.find(d => d.id === dimId);
  if (!dim) return null;

  let raw = 0;
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)];
    if (ans === undefined || ans < 1 || ans > 5) continue;
    const qData = mptQuestions.find(x => x.id === q);
    raw += qData && qData.reverse ? 6 - ans : ans;
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5;
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;
  const cappedPercent = Math.min(100, percent);
  return {
    id: dimId,
    name: dim.name,
    rawScore: raw,
    maxScore,
    percent: cappedPercent,
    level: getLevel(cappedPercent),
  };
}

function getScorePattern(sorted, primarySecondaryGap, highCount, lowCount) {
  const p = sorted[0]?.percent ?? 0;
  const s = sorted[1]?.percent ?? 0;
  const range = (sorted[0]?.percent ?? 0) - (sorted[sorted.length - 1]?.percent ?? 0);

  if (range <= 15) return 'balanced';
  if (p >= 60 && s >= 60 && p - s <= 15) return 'dual_high';
  if ((p >= 75 && lowCount >= 2) || (primarySecondaryGap >= 25 && s < 55)) return 'single_dominant';
  return 'distinct';
}

function calculateMPTResult(answers) {
  const dimensionScores = MPT_DIMENSIONS.map(d => getDimensionScore(d.id, answers)).filter(Boolean);
  const sorted = [...dimensionScores].sort((a, b) => b.percent - a.percent);
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0);
  const maxTotalScore = mptQuestions.length * 5;
  const avgPercent = dimensionScores.length
    ? Math.round(dimensionScores.reduce((s, d) => s + d.percent, 0) / dimensionScores.length)
    : 0;
  const primary = sorted[0];
  const secondary = sorted[1] || null;
  const primarySecondaryGap = primary
    ? (secondary ? primary.percent - secondary.percent : primary.percent - (sorted[2]?.percent ?? 0))
    : 0;
  const highCount = dimensionScores.filter(d => d.percent >= 70).length;
  const lowCount = dimensionScores.filter(d => d.percent <= 45).length;
  const scorePattern = getScorePattern(sorted, primarySecondaryGap, highCount, lowCount);

  return {
    dimensionScores,
    totalScore,
    maxTotalScore,
    avgPercent,
    primaryType: primary,
    secondaryType: secondary,
    primarySecondaryGap,
    scorePattern,
    highCount,
    lowCount,
  };
}

module.exports = { calculateMPTResult };
