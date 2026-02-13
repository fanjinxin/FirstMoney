/**
 * 动物塑测试计分逻辑 - 移植自 src/utils/animal_scoring.ts
 */
const { animalQuestions, animalArchetypes } = require('../data/animal_sculpture');

const DIMS = ['E', 'A', 'C', 'N', 'O'];
const NEUTRAL = 5;

function euclidean(a, b) {
  let sumSq = 0;
  DIMS.forEach(dim => {
    const d = (a[dim] || 0) - (b[dim] || 0);
    sumSq += d * d;
  });
  return Math.sqrt(sumSq);
}

function calculateAnimalResult(answers) {
  const rawScores = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  const maxScores = { E: 0, A: 0, C: 0, N: 0, O: 0 };

  animalQuestions.forEach(q => {
    const maxOptionScores = { E: 0, A: 0, C: 0, N: 0, O: 0 };
    q.options.forEach(opt => {
      DIMS.forEach(dim => {
        const v = (opt.score && opt.score[dim]) || 0;
        if (v > maxOptionScores[dim]) maxOptionScores[dim] = v;
      });
    });
    DIMS.forEach(dim => { maxScores[dim] += maxOptionScores[dim]; });

    const idx = answers[q.id] ?? answers[String(q.id)];
    if (idx == null || !q.options[idx]) return;

    const opt = q.options[idx];
    const score = opt.score || {};
    DIMS.forEach(dim => {
      if (score[dim] != null) rawScores[dim] += score[dim];
    });
  });

  const normalizedScores = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  DIMS.forEach(dim => {
    normalizedScores[dim] = maxScores[dim] > 0 ? (rawScores[dim] / maxScores[dim]) * 10 : NEUTRAL;
  });

  // 主动物/次动物：基于用户五维分数与各动物原型的欧氏距离，选最近的 2 个
  const userProfile = { ...normalizedScores };
  const byDistance = animalArchetypes
    .map(a => ({ animal: a, distance: euclidean(userProfile, a.dimensions) }))
    .sort((a, b) => a.distance - b.distance);

  const mainAnimal = byDistance[0].animal;
  const secondaryAnimal = byDistance[1].animal;

  const dimensionLabels = { E: '外向性 (E)', A: '亲和性 (A)', C: '尽责性 (C)', N: '敏感性 (N)', O: '开放性 (O)' };
  const radarData = DIMS.map(dim => ({
    subject: dimensionLabels[dim],
    A: parseFloat(normalizedScores[dim].toFixed(2)),
    fullMark: 10,
  }));

  const compoundDimensions = {
    socialEnergy: (normalizedScores.E + normalizedScores.A) / 2,
    resilience: (normalizedScores.C + (10 - normalizedScores.N)) / 2,
    drive: (normalizedScores.E + normalizedScores.C) / 2,
    adaptability: (normalizedScores.O + normalizedScores.A) / 2,
  };

  return {
    scores: normalizedScores,
    mainAnimal,
    secondaryAnimal,
    radarData,
    compoundDimensions,
  };
}

module.exports = { calculateAnimalResult };
