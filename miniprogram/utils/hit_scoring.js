/**
 * HIT 霍兰德职业兴趣测试计分 - 移植自 src/utils/hit_scoring.ts
 * 选「是」(index 0) 得 1 分，选「否」(index 1) 得 0 分
 */
const { HIT_DIMENSIONS } = require('../data/hit');

function getDimensionScore(dimId, answers) {
  const dim = HIT_DIMENSIONS.find(d => d.id === dimId);
  if (!dim) return null;

  let raw = 0;
  for (let q = dim.qStart; q <= dim.qEnd; q++) {
    const ans = answers[String(q)];
    if (ans === 0 || ans === '0') raw += 1;
  }

  const maxScore = dim.qEnd - dim.qStart + 1;
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;

  return {
    id: dimId,
    name: dim.name,
    nameEn: dim.nameEn,
    rawScore: raw,
    maxScore,
    percent: Math.min(100, percent),
  };
}

function calculateHITResult(answers) {
  const dimensionScores = HIT_DIMENSIONS.map(d => getDimensionScore(d.id, answers)).filter(Boolean);
  const sorted = [...dimensionScores].sort((a, b) => b.rawScore - a.rawScore);
  const topThree = sorted.slice(0, 3);
  const hollandCode = topThree.map(t => t.id).join('');

  return { dimensionScores, hollandCode, topThree };
}

module.exports = { calculateHITResult };
