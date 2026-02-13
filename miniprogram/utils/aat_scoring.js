/**
 * AAT 学习适应性测验计分逻辑 - 移植自 src/utils/aat_scoring.ts
 * 12 因子，每题 3 选一：正向题 ①②③→3,2,1；反向题 ①②③→1,2,3
 */
const { aatQuestions, AAT_DIMENSIONS } = require('../data/aat');

function getOptionScore(selectedIndex, reverse) {
  if (reverse) return selectedIndex + 1; // 0→1, 1→2, 2→3
  return 3 - selectedIndex; // 0→3, 1→2, 2→1
}

function percentToLevel(percent) {
  if (percent >= 70) return { level: 'good', label: '较好' };
  if (percent >= 50) return { level: 'fair', label: '中等' };
  if (percent >= 30) return { level: 'poor', label: '较差' };
  return { level: 'veryPoor', label: '差' };
}

function calculateAATResult(answers) {
  const dimScores = {};
  AAT_DIMENSIONS.forEach(d => { dimScores[d.id] = { raw: 0, max: 0 }; });

  aatQuestions.forEach(q => {
    const selectedIndex = answers[q.id] ?? answers[String(q.id)];
    dimScores[q.dimension].max += 3;
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex <= 2) {
      dimScores[q.dimension].raw += getOptionScore(selectedIndex, q.reverse);
    }
  });

  const factorScores = AAT_DIMENSIONS.map(dim => {
    const { raw, max } = dimScores[dim.id];
    const percent = max > 0 ? Math.round((raw / max) * 100) : 0;
    const { level, label } = percentToLevel(percent);
    return {
      id: dim.id,
      name: dim.name,
      rawScore: raw,
      maxScore: max,
      percent,
      level,
      levelLabel: label,
    };
  });

  const totalRaw = factorScores.reduce((s, f) => s + f.rawScore, 0);
  const totalMax = factorScores.reduce((s, f) => s + f.maxScore, 0);
  const totalPercent = totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0;
  const answeredCount = aatQuestions.filter(q => answers[q.id] !== undefined || answers[String(q.id)] !== undefined).length;

  return {
    factorScores,
    totalPercent,
    answeredCount,
    totalQuestions: aatQuestions.length,
  };
}

module.exports = { calculateAATResult };
