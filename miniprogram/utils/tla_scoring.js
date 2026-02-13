/**
 * TLA 年上年下恋爱测试计分 - 移植自 src/utils/tla_scoring.ts
 */
const { tlaQuestions, TLA_DIMENSIONS } = require('../data/tla');

function getDimensionScore(dimId, answers) {
  const dim = TLA_DIMENSIONS.find(d => d.id === dimId);
  if (!dim) return null;

  let raw = 0;
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)];
    if (ans === undefined || ans < 1 || ans > 5) continue;
    const qData = tlaQuestions.find(x => x.id === q);
    const score = qData && qData.reverse ? 6 - ans : ans;
    raw += score;
  }

  const maxScore = (dim.qEnd - dim.qStart + 1) * 5;
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;

  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: Math.min(100, percent) };
}

function calculateTLAResult(answers) {
  const dimensionScores = TLA_DIMENSIONS.map(d => getDimensionScore(d.id, answers)).filter(Boolean);
  const totalScore = dimensionScores.reduce((s, d) => s + d.rawScore, 0);
  const maxTotalScore = tlaQuestions.length * 5;
  return { dimensionScores, totalScore, maxTotalScore };
}

module.exports = { calculateTLAResult };
