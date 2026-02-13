/**
 * FFT 水果塑形测试计分 - 移植自 src/utils/fft_scoring.ts
 * 选第 index 项 → 对应 scores[index] 的水果 +1 分
 */
const { fftQuestions, FFT_DIMENSIONS } = require('../data/fft');

function getDimensionScore(dimId, answers) {
  const dim = FFT_DIMENSIONS.find(d => d.id === dimId);
  if (!dim) return null;

  let raw = 0;
  for (const q of fftQuestions) {
    if (q.id < dim.qStart || q.id > dim.qEnd) continue;
    const ans = answers[String(q.id)];
    if (ans === undefined || ans < 0 || ans > 2) continue;
    if (q.scores[ans] === dimId) raw += 1;
  }

  const maxScore = dim.qEnd - dim.qStart + 1;
  const percent = maxScore > 0 ? Math.round((raw / maxScore) * 100) : 0;

  return { id: dimId, name: dim.name, rawScore: raw, maxScore, percent: Math.min(100, percent) };
}

function calculateFFTResult(answers) {
  const dimensionScores = FFT_DIMENSIONS.map(d => getDimensionScore(d.id, answers)).filter(Boolean);
  const primaryFruit = [...dimensionScores].sort((a, b) => b.rawScore - a.rawScore)[0];
  return { dimensionScores, primaryFruit };
}

module.exports = { calculateFFTResult };
