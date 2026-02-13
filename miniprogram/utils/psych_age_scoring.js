/**
 * 心理年龄测验计分 - 移植自 src/utils/psych_age_scoring.ts
 */
const { psychAgeQuestions, PSYCH_AGE_DIMENSIONS } = require('../data/psych_age');

const AGE_BANDS = [
  { minScore: 0, maxScore: 29, range: '20–29 岁', minAge: 20, maxAge: 29, estimate: 25 },
  { minScore: 30, maxScore: 49, range: '30–39 岁', minAge: 30, maxAge: 39, estimate: 35 },
  { minScore: 50, maxScore: 64, range: '40–49 岁', minAge: 40, maxAge: 49, estimate: 45 },
  { minScore: 65, maxScore: 74, range: '50–59 岁', minAge: 50, maxAge: 59, estimate: 55 },
  { minScore: 75, maxScore: 79, range: '60–69 岁', minAge: 60, maxAge: 69, estimate: 65 },
  { minScore: 80, maxScore: 200, range: '70 岁以上', minAge: 70, maxAge: 80, estimate: 75 },
];

function getAgeBand(totalScore) {
  for (const band of AGE_BANDS) {
    if (totalScore >= band.minScore && totalScore <= band.maxScore) return band;
  }
  return AGE_BANDS[AGE_BANDS.length - 1];
}

function getDimensionTrend(percent) {
  if (percent <= 33) return { trend: 'young', label: '偏年轻化' };
  if (percent <= 66) return { trend: 'balanced', label: '适中' };
  return { trend: 'aged', label: '偏成熟/偏老化' };
}

function calculatePsychAgeResult(answers) {
  let totalScore = 0;
  const dimScores = {};
  PSYCH_AGE_DIMENSIONS.forEach(d => { dimScores[d.id] = { raw: 0, max: 0 }; });

  psychAgeQuestions.forEach(q => {
    const selectedIndex = answers[q.id] ?? answers[String(q.id)];
    dimScores[q.dimension].max += Math.max(...q.scores);
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex <= 2) {
      const s = q.scores[selectedIndex];
      totalScore += s;
      dimScores[q.dimension].raw += s;
    }
  });

  const band = getAgeBand(totalScore);
  const dimensionScores = PSYCH_AGE_DIMENSIONS.map(dim => {
    const { raw, max } = dimScores[dim.id];
    const percent = max > 0 ? Math.round((raw / max) * 100) : 0;
    const { trend, label } = getDimensionTrend(percent);
    return { id: dim.id, name: dim.name, rawScore: raw, maxScore: max, percent, trend, trendLabel: label };
  });

  const maxTotalScore = psychAgeQuestions.reduce((s, q) => s + Math.max(...q.scores), 0);
  return {
    totalScore,
    maxTotalScore,
    psychAgeRange: band.range,
    psychAgeMin: band.minAge,
    psychAgeMax: band.maxAge,
    psychAgeEstimate: band.estimate,
    dimensionScores,
    answeredCount: psychAgeQuestions.filter(q => answers[q.id] !== undefined || answers[String(q.id)] !== undefined).length,
    totalQuestions: psychAgeQuestions.length,
  };
}

module.exports = { calculatePsychAgeResult };
